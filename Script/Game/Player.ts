import { _decorator, Component, Node, find, LabelComponent, instantiate } from 'cc';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { JointConnect } from '../CleanerConstruction/JointConnect';
import { Constants } from '../CustomEventListener/Constants';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { GameInfo } from '../Data/GameInfo';
import { GameStorage } from '../Data/GameStorage';
import { GameUpgrade } from '../Data/GameUpgrade';
import { PlayerUIInfo } from '../UI/PlayerUIInfo';
import { RankInfo } from '../UI/RankInfo';
import { CameraCtrl } from './CamreaCtrl';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    /**跟随吸尘器走动的UI信息 */
    public palyerUiInfo: PlayerUIInfo = null
    /**排行版信息 */
    public rankInfo: RankInfo = null

    /**吸尘器头部 */
    private cleanerHead: CleanerHead = null
    private jiontComt: JointConnect = null
    private jiontTail: JointConnect = null
    /**游戏等级系统 */
    private gameUpgrade: GameUpgrade = null

    /**当前等级 */
    public currentLevel: number = 1

    private originalPosY: Array<number> = []

    public star: number = 0

    public initPlayUI() {
        this.palyerUiInfo.node.active = true
        this.gameUpgrade = new GameUpgrade()
        this.cleanerHead = this.node.getChildByName("CleanerHead").getComponent(CleanerHead)
        this.jiontComt = this.node.getChildByName("CleanerHead").getComponent(JointConnect)
        this.jiontTail = this.node.getChildByName("Tail").getComponent(JointConnect)
        let gameData = GameInfo.Instance().gameDate
        let playName = this.palyerUiInfo.node.getChildByName("PlayName").getComponent(LabelComponent)
        let playNameShadow = this.palyerUiInfo.node.getChildByPath("PlayName/PlayName").getComponent(LabelComponent)
        let statLayout = this.palyerUiInfo.node.getChildByName("StartLayout")
        playName.string = gameData.playerName
        playNameShadow.string = gameData.playerName
        this.star = gameData.level
        for (var i = 0; i < gameData.level - 1; i++) {
            let node = instantiate(statLayout.children[0]) as Node
            node.setParent(statLayout)
        }
        this.rankInfo.playerName = gameData.playerName
        this.palyerUiInfo.UIFollowNode = this.cleanerHead.node
        for (var i = 0; i < this.node.children.length; i++) {
            this.originalPosY.push(this.node.children[i].worldPosition.y)
        }
        CustomEventListener.on(Constants.EventName.SaveMaxScore, this.saveMaxScore, this)
    }

    saveMaxScore() {
        if (this.gameUpgrade.TotalScore > GameInfo.Instance().gameDate.maxScore) {
            GameInfo.Instance().gameDate.maxScore = this.gameUpgrade.TotalScore
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
        }
    }


    /**等级提升 */
    levelUp(number: number) {
        let size = Constants.GameLevelInfo.Level[number - 1].size
        let speed = Constants.GameLevelInfo.Level[number - 1].speed
        //放大体型
        this.zoomInSize(size)
        //放大速度

        cc.tween(this.cleanerHead).repeat(1, cc.tween()
            .to(1, { moveSpeed: speed }, { easing: "sineOut" }))
            .start()
        //相机放远
        cc.tween(CameraCtrl.Instance).repeat(1, cc.tween()
            .to(1, { offset: CameraCtrl.Instance.originalOffset.clone().multiplyScalar(size) }, { easing: "sineOut" }))
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
        CustomEventListener.dispatchEvent(Constants.EventName.GetScore, this.gameUpgrade.TotalScore)
        this.checkLevelUp()
        this.updateUIInfo()
        this.updateUIRank()
    }

    checkLevelUp() {
        if (this.currentLevel !== this.gameUpgrade.Level) {
            this.currentLevel = this.gameUpgrade.Level
            this.levelUp(this.currentLevel)
            CustomEventListener.dispatchEvent(Constants.EventName.LevelUp)
            console.info("当前等级：" + this.currentLevel)
            // if(this.currentLevel === 5)
            // {
            //     CustomEventListener.dispatchEvent(Constants.EventName.CanBreaKWall)
            //     MapManager.Instance.enableAllRubbish()
            // }
        }
    }

    updateUIInfo() {
        this.palyerUiInfo.updateProgressBar(this.gameUpgrade.CurrentLevelScore / Constants.GameLevelInfo.Level[this.currentLevel - 1].Score)
    }

    updateUIRank() {
        this.rankInfo.score = this.gameUpgrade.TotalScore
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
    onDestroy() {
        CustomEventListener.off(Constants.EventName.SaveMaxScore, this.saveMaxScore, this)
    }

}
