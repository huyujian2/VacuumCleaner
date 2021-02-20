import { _decorator, Component, Node, LabelComponent, ButtonComponent, Vec3, find, loader, instantiate, Prefab, SpriteComponent, PhysicsSystem, director, UIOpacityComponent, AudioSourceComponent, ttf, Tween, tween } from 'cc';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { Constants } from '../CustomEventListener/Constants';
import { CameraCtrl } from '../Game/CamreaCtrl';
import { RankInfo } from './RankInfo';
import { GameManager } from '../Game/GameManager';
import { ObjectPool } from '../Uitis/ObjectPool';
import { RankBar } from './RankBar';
import { GameInfo } from '../Data/GameInfo';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
import UIUtility from '../../Framework3D/Src/Base/UIUtility';
import AudioManager from '../../Framework3D/Src/Base/AudioManager';
import { AdManager } from '../Managers/AdManager/AdManager';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    /**升级显示 */
    @property(Node)
    levelUp: Node = null
    /**点击开始节点 */
    @property(Node)
    startNode: Node = null
    /**完成游戏界面 */
    @property(Node)
    settelPage: Node = null
    /**排行榜列表 */
    @property([RankInfo])
    rankInfoList: Array<RankInfo> = []
    /**刚体活动数 */
    @property(LabelComponent)
    rigibodyCount: LabelComponent = null
    @property(LabelComponent)
    timeLabel: LabelComponent = null
    @property(Node)
    receiveRewardButton: Node = null
    @property(Node)
    adReceiveRewardButton: Node = null
    @property(Node)
    guideNode: Node = null
    @property(Node)
    customBannerAD:Node = null

    private rankPos: Array<Vec3> = []
    /**游戏开始标志 */
    private startFlat: boolean = false
    /**游戏时间 */
    private gameTime: number = 0

    private tween: Tween[] = []

    onLoad() {
        CustomEventListener.on(Constants.EventName.LevelUp, this.LevelUp, this)
        CustomEventListener.on(Constants.EventName.ShowScore, this.showScore, this)
        CustomEventListener.on(Constants.EventName.UpdateRank, this.updateRankList, this)
    }

    start() {
        for (var i = 0; i < this.rankInfoList.length; i++) {
            console.info(this.rankInfoList[i].node.name)
            this.rankPos.push(this.rankInfoList[i].node.getPosition())
        }
        this.startNode.on(Node.EventType.TOUCH_END, this.startPlay, this)
        this.gameTime = 90
        this.startFlat = true
        this.adReceiveRewardButton.on(Node.EventType.TOUCH_END, this.adRecieveReward, this)
        this.receiveRewardButton.on(Node.EventType.TOUCH_END, this.onBackMianButton, this)
        this.scheduleOnce(() => {
            console.log(this.node.children.length)
            this.settelPage.setSiblingIndex(this.node.parent.children.length - 1)
            this.guideNode.active = true
        }, 0)
        this.node.on(Node.EventType.TOUCH_START, this.onTouch, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouch, this)

        this.scheduleOnce(() => {
            this.onTouch()
        }, 4)
    }

    onTouch() {
        if (this.guideNode.active) {
            this.guideNode.active = false
            this.node.off(Node.EventType.TOUCH_START, this.onTouch, this)
            this.node.off(Node.EventType.TOUCH_MOVE, this.onTouch, this)
        }
    }

    update(dt: number) {
        if (this.startFlat) {
            this.gameTime -= dt
            if (this.gameTime <= 0) {
                this.startFlat = false
                //进行结算
                this.showSettlePage()
                GameManager.Instance.timeOver = true
                CustomEventListener.dispatchEvent(Constants.EventName.SaveMaxScore)
            }
            let minutes = Math.round((this.gameTime - 30) / 60) % 60;
            let seconds = this.gameTime % 60;
            this.timeLabel.string = (minutes > 9 ? minutes.toFixed(0) : "0" + minutes.toFixed(0)) + ":" + (seconds > 9 ? seconds.toFixed(0) : "0" + seconds.toFixed(0))
        }
        this.rigibodyCount.string = GameManager.Instance.Enable.size.toString()
    }

    LevelUp() {
        this.levelUp.setPosition(cc.v3(160, 500, 0))
        this.levelUp.setWorldRotationFromEuler(0, 0, 90)
        this.levelUp.setScale(cc.v3(0, 0, 0))
        this.levelUp.getComponent(UIOpacityComponent).opacity = 255
        let t1 = tween(this.levelUp).repeat(1, tween()
            .to(1, { position: cc.v3(0, 380, 0) }, { easing: "sineOut" }))
            .start()
        this.tween.push(t1)
        let t2 = tween(this.levelUp).repeat(1, tween()
            .to(1, { eulerAngles: cc.v3(0, 0, 0) }, { easing: "sineOut" }))
            .start()
        this.tween.push(t2)
        let t3 = tween(this.levelUp).repeat(1, tween()
            .to(1, { scale: cc.v3(1, 1, 1) }, { easing: "sineOut" })
            .to(0.3, { scale: cc.v3(1.15, 1.15, 1.15) }, { easing: "sineOut" }))
            .start()
        this.tween.push(t3)
        let t4 = tween(this.levelUp.getComponent(UIOpacityComponent)).repeat(1, tween()
            .to(1, { opacity: 255 }, { easing: "sineOut" }))
            .to(0.3, { opacity: 0 }, { easing: "sineOut" })
            .start()
        this.tween.push(t4)
    }

    startPlay() {
        this.startFlat = true
        this.startNode.active = false
    }

    showScore(pos: Vec3, score: number) {
        const showScore = ObjectPool.Instance().getObj("UI/ShowScore")
        showScore.setParent(find("Canvas"))
        showScore.active = true
        showScore.setPosition(CameraCtrl.Instance.getScreenPos(pos))
        showScore.getComponent(LabelComponent).string = "+" + score.toString()
        //分数上升动画
        let t1 = tween(showScore).repeat(1, cc.tween()
            .to(1, { position: cc.v3(showScore.position.x, showScore.position.y + 80, showScore.position.z) }, { easing: "sineOut" }))
            .start()
        this.tween.push(t1)
        let t2 = tween(showScore.getComponent(UIOpacityComponent)).repeat(1, cc.tween()
            .to(0.2, { opacity: 255 }, { easing: "sineOut" })
            .to(0.6, { opacity: 255 }, { easing: "sineOut" })
            .to(0.2, { opacity: 0 }, { easing: "sineOut" }))
            .start()
        this.tween.push(t2)
        this.scheduleOnce(() => {
            showScore.active = false
            ObjectPool.Instance().putInObj('UI/ShowScore', showScore)
        }, 1)
    }

    updateRankList() {
        for (var i = 0; i < this.rankInfoList.length; i++) {
            let maxScore = this.rankInfoList[i].score
            let maxIndex = i
            for (var j = i + 1; j < this.rankInfoList.length; j++) {
                if (maxScore < this.rankInfoList[j].score) {
                    maxScore = this.rankInfoList[j].score
                    maxIndex = j
                }
            }
            //改变UI位置
            let tempPos = this.rankPos[maxIndex]
            this.rankInfoList[maxIndex].changeRankPos(this.rankPos[i])
            this.rankInfoList[i].changeRankPos(tempPos)
            //改变排序位置
            let rankInfo = this.rankInfoList[maxIndex]
            this.rankInfoList[maxIndex] = this.rankInfoList[i]
            this.rankInfoList[i] = rankInfo
        }
    }

    onBackMianButton() {
        director.loadScene("MainScene")
    }

    adRecieveReward() {
        var callback = function (isEnd) {
            if (isEnd) {
                for (var i = 0; i <= this.rankInfoList.length - 1; i++) {
                    if (this.rankInfoList[i].playerName === GameInfo.Instance().gameDate.playerName) {
                        GameInfo.Instance().rewardExp = Constants.RankRewared.rewared[i] * 2
                        console.info("奖励：" + GameInfo.Instance().rewardExp)
                    }
                }
                director.loadScene("MainScene")
            }
            else {
                UIUtility.getInstance().showTopTips("视频未播放完成！")
            }
            AudioManager.getInstance().resumeMusic()
        }.bind(this)
        if (ASCAd.getInstance().getVideoFlag()) {
            ASCAd.getInstance().showVideo(callback)
            AudioManager.getInstance().pauseMusic()
        }
        else {
            UIUtility.getInstance().showTopTips("视频未加载完成！")
        }
    }

    showSettlePage() {
        //this.customBannerAD.active = false
        AdManager.getInstance().hideBanner()
        this.timeLabel.node.active = false
        find("Canvas").getChildByName("Rank").active = false
        this.settelPage.active = true
        for (var i = 0; i < this.rankInfoList.length - 1; i++) {
            this.settelPage.getChildByName("RankBar" + Number(i + 1)).addComponent(RankBar).rankInfo = this.rankInfoList[i]
            this.settelPage.getChildByName("RankBar" + Number(i + 1)).getComponent(RankBar).startTime = i * 0.5
        }
        this.settelPage.active = true
        for (var i = 0; i <= this.rankInfoList.length - 1; i++) {
            if (this.rankInfoList[i].playerName === GameInfo.Instance().gameDate.playerName) {
                GameInfo.Instance().rewardExp = Constants.RankRewared.rewared[i]
                console.info("奖励：" + GameInfo.Instance().rewardExp)
            }
        }
    }

    onDestroy() {
        CustomEventListener.off(Constants.EventName.LevelUp, this.LevelUp, this)
        CustomEventListener.off(Constants.EventName.ShowScore, this.showScore, this)
        CustomEventListener.off(Constants.EventName.UpdateRank, this.updateRankList, this)
        for (let i = 0; i < this.tween.length; i++) {
            if (this.tween[i]) {
                this.tween[i].stop()
            }
        }
    }
}
