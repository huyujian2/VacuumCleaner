import { _decorator, Component, Node, find, BaseNode, SphereColliderComponent, ITriggerEvent, Vec2, Vec3, tween, LabelComponent, instantiate, random, math, loader, SpriteFrame } from 'cc';
import { BaseState } from '../AI/BaseState';
import { DetectState } from '../AI/DetectState';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { JointConnect } from '../CleanerConstruction/JointConnect';
import { Constants } from '../CustomEventListener/Constants';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { AiConfig } from '../Data/AiConfig';
import { GameUpgrade } from '../Data/GameUpgrade';
import { ConfigManager } from '../Managers/ConfigManager';
import { MapManager } from '../Managers/MapManager';
import { PlayerUIInfo } from '../UI/PlayerUIInfo';
import { RankInfo } from '../UI/RankInfo';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerAI')
export class PlayerAI extends Component {

    /**跟随吸尘器的UI信息 */
    @property(PlayerUIInfo)
    public playerUIInfo: PlayerUIInfo = null
    /**排行版信息 */
    @property(RankInfo)
    public rankInfo: RankInfo = null
    /**吸尘器头部 */
    public cleanerHead: CleanerHead = null
    /**头和身体的关节连接 */
    private jiontComt: JointConnect = null
    /**尾巴的关节连接 */
    private jiontTail: JointConnect = null
    /**游戏等级系统 */
    private gameUpgrade: GameUpgrade = null
    /**当前等级 */
    public currentLevel: number = 1
    /**AI的状态 */
    private state: BaseState = null
    /**最小距离 */
    private nearestDis: number = 100000
    /**当前接收距离 */
    private receivesDis: number = 0
    /**最小距离的Node */
    public nearestTarget: Node = null
    /**已拉近黑名单的垃圾 */
    public blockMap: Map<string, Node> = new Map<string, Node>()
    /**初始Y值 */
    private originalPosY: Array<number> = []

    public playerConfig: AiConfig = null

    public star: number = 0

    onLoad() {

    }

    start() {

    }

    initPlayUI() {
        this.playerUIInfo.node.active = true
        this.gameUpgrade = new GameUpgrade()
        this.cleanerHead = this.node.getChildByName("CleanerHead").getComponent(CleanerHead)
        this.jiontComt = this.node.getChildByName("CleanerHead").getComponent(JointConnect)
        this.jiontTail = this.node.getChildByName("Tail").getComponent(JointConnect)
        //let nameIndex = (Math.random() * (Constants.AiName.Name.length - 1)).toFixed(0)
        let name: string = this.playerConfig.name
        let level = this.playerConfig.star
        this.star = level
        let playName = this.playerUIInfo.node.getChildByName("PlayName").getComponent(LabelComponent)
        let playNameShadow = this.playerUIInfo.node.getChildByPath("PlayName/PlayName").getComponent(LabelComponent)
        let statLayout = this.playerUIInfo.node.getChildByName("StartLayout")
        playName.string = name.slice(0, 5)
        playNameShadow.string = name.slice(0, 5)
        for (var i = 0; i < level - 1; i++) {
            let node = instantiate(statLayout.children[0]) as Node
            node.setParent(statLayout)
        }
        this.rankInfo.playerName = name.slice(0, 5)
        this.playerUIInfo.UIFollowNode = this.cleanerHead.node
        this.scheduleOnce(() => { this.setState(new DetectState()) }, 1)
        for (var i = 0; i < this.node.children.length; i++) {
            this.originalPosY.push(this.node.children[i].worldPosition.y)
        }
        let palyerIcon = this.playerUIInfo.getComponent(PlayerUIInfo).playerIcon
        let iconPath = ConfigManager.getInstance().getRobotTexPath()
        console.log(iconPath)
        loader.load(this.playerConfig.headPhoto, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                sprite.texture = texture._texture
                palyerIcon.spriteFrame = sprite
            }
        })
    }

    update(dt) {
        if (!GameManager.Instance.timeOver) {
            if (this.state !== null) {
                this.state.update(this, dt)
            }
        }
    }

    /**等级提升 */
    levelUp(number: number) {
        let size = Constants.GameLevelInfo.Level[number - 1].size
        //放大体型
        this.zoomInSize(size)
        //放大速度
        cc.tween(this.cleanerHead).repeat(1, cc.tween()
            .to(1, { moveSpeed: 5 * size }, { easing: "sineOut" }))
            .start()
        //扩大收集范围
        cc.tween(this.cleanerHead).repeat(1, cc.tween()
            .to(1, { maxAdsrtDis: this.cleanerHead.maxAdsrtOriginalDis * size }, { easing: "sineOut" }))
            .start()
        // //扩大铰链距离
        setTimeout(() => {
            this.jiontComt.setJiontDis = size
            this.jiontTail.setJiontDis = size
        }, 1000)
    }

    /**增加分数 */
    public addScore(score: number) {
        this.gameUpgrade.Score = score
        this.checkLevelUp()
        this.updateUIInfo()
        this.updateUIRank()
    }

    checkLevelUp() {
        if (this.currentLevel !== this.gameUpgrade.Level) {
            this.currentLevel = this.gameUpgrade.Level
            this.levelUp(this.currentLevel)
        }
    }

    updateUIInfo() {
        this.playerUIInfo.updateProgressBar(this.gameUpgrade.CurrentLevelScore / Constants.GameLevelInfo.Level[this.currentLevel - 1].Score)
    }

    updateUIRank() {
        this.rankInfo.score = this.gameUpgrade.TotalScore
        CustomEventListener.dispatchEvent(Constants.EventName.UpdateRank)
    }

    /**更改AI状态 */
    setState(state: BaseState) {
        this.state = state
        this.state.entry(this)
    }

    /**获取最近的垃圾 */
    public getNearestRubbish(): Node {
        // if (this.nearestTarget !== null) {
        //     return this.nearestTarget
        // }
        // else {
        //     return null
        // }
        let nearestDis = 999999
        let result = null
        let rubbishItem = MapManager.Instance.rubbishItemList
        for (let i = 0; i < rubbishItem.length; i++) {
            let rubbish = rubbishItem[i]
            if (rubbish.node && rubbish.absordedFalg == 0 && rubbish.level <= this.currentLevel) {
                let dis = Vec3.distance(this.node.worldPosition, rubbish.node.worldPosition)
                if (nearestDis > dis) {
                    nearestDis = dis
                    result = rubbish.node
                }
            }
        }
        return result
    }

    /**获取最近的垃圾 */
    public getRubbishSubStep(step: number, allProgress: number) {
        // if (this.nearestTarget !== null) {
        //     return this.nearestTarget
        // }
        // else {
        //     return null
        // }
        //let nearestDis = 999999
        //let result = null
        let length = Math.ceil(MapManager.Instance.rubbishItemList.length / allProgress)
        let startIndex = step * length
        let endIndex = (step + 1) * step
        if (step = allProgress) {
            endIndex = MapManager.Instance.rubbishItemList.length - 1
        }
        let rubbishItem = MapManager.Instance.rubbishItemList.slice(startIndex, endIndex)
        for (let i = 0; i < rubbishItem.length; i++) {
            let rubbish = rubbishItem[i]
            //console.log(this.blockMap.has(rubbish.uuid))
            if (rubbish.node && rubbish.absordedFalg == 0 && rubbish.level <= this.currentLevel) {
                if (!this.blockMap.has(rubbish.node.uuid)) {
                    let dis = Vec3.distance(this.node.worldPosition, rubbish.node.worldPosition)
                    if (this.nearestDis > dis) {
                        this.nearestDis = dis
                        this.nearestTarget = rubbish.node
                        // console.log(rubbish.node.uuid)
                        // console.log(this.blockMap.has(rubbish.uuid))
                    }
                }

            }
        }
        //return result
    }

    /**接收垃圾传来的位置信息 */
    public receivePos(node: Node) {
        if (this.blockMap.has(node.uuid)) {
            return
        }
        this.receivesDis = Vec3.distance(this.node.worldPosition, node.worldPosition)
        if (this.nearestDis >= this.receivesDis) {
            this.nearestDis = this.receivesDis
            this.nearestTarget = node
        }
    }

    public reflashTarget() {
        //console.info("正在刷新目标")
        this.nearestDis = 10000
        this.nearestTarget = null
    }

    zoomInSize(number: number) {

        //要放大Y轴
        cc.tween(this.node.children[0]).repeat(1, cc.tween()
            .to(1, { scale: cc.v3(number, number, number) }, { easing: "sineOut" }))
            .start()
        cc.tween(this.node.children[1]).repeat(1, cc.tween()
            .to(1, { scale: cc.v3(number * 0.2, number * 0.2, number * 0.2) }, { easing: "sineOut" }))
            .start()
        cc.tween(this.node.children[2]).repeat(1, cc.tween()
            .to(1, { scale: cc.v3(number, number, number) }, { easing: "sineOut" }))
            .start()
        cc.tween(this.node.children[3]).repeat(1, cc.tween()
            .to(1, { scale: cc.v3(number, number, number) }, { easing: "sineOut" }))
            .start()
        for (var i = 0; i < this.node.children.length; i++) {
            cc.tween(this.node.children[i].worldPosition).repeat(1, cc.tween()
                .to(1, { y: this.originalPosY[i] * number }, { easing: "sineOut" }))
                .start()
        }
    }

    public removeSelf() {
        this.playerUIInfo.node.active = false
        this.rankInfo.reomoveSelf()
        this.node.active = false
    }

}
