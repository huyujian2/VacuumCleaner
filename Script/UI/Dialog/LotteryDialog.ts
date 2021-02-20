import { _decorator, Component, Node, find, loader, instantiate } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { GameInfo } from '../../Data/GameInfo';
import { GameStorage } from '../../Data/GameStorage';
import { BasePuzzleDialog } from '../../Uitis/BasePuzzleDialog';
import { GuideUI } from '../GuideUI';
const { ccclass, property } = _decorator;
enum pointerStage {
    accelerationStage = "accelerationStage",
    constantsStage = "constantsStage",
    slowStage = "slowStage",
    moveToTargetStage = "moveToTargetStage"
}
const PointerStage = pointerStage
@ccclass('LotteryDialog')
export class LotteryDialog extends BasePuzzleDialog {

    @property(Node)
    pointer: Node = null

    @property(Node)
    freeButton: Node = null

    @property(Node)
    adButton: Node = null

    @property(Node)
    closeButton: Node = null

    private colseCallBakc = null

    speed: number = 0

    pointerStage: pointerStage = null

    acclerationRate: number = 0.2

    slowRate: number = 0.08

    minSpeed: number = 1.5

    acclerateTime: number = 1.5
    currAcclerTime: number = 0

    constantTime: number = 0.5
    currConstantTime: number = 0

    slowTime: number = 3
    currSlowTime: number = 0

    targerPoint: number = 0

    correctItem = null

    private isRotating = false

    itemList = [
        { itemName: "JBY", probability: 15, angle: 342 },
        { itemName: "Star*4000", probability: 15, angle: 306 },
        { itemName: "Star*5000", probability: 10, angle: 270 },
        { itemName: "Star*3000", probability: 20, angle: 234 },
        { itemName: "UpLevel", probability: 8, angle: 198 },
        { itemName: "Star*2000", probability: 15, angle: 162 },
        { itemName: "Star*10000", probability: 8, angle: 126 },
        { itemName: "Star*1000", probability: 3, angle: 90 },
        { itemName: "Skin", probability: 5, angle: 54 },
        { itemName: "Star*500", probability: 1, angle: 18 },
    ]

    start() {
        super.start()
        this.freeButton.on(Node.EventType.TOUCH_END, this.onFreeButton, this)
        this.adButton.on(Node.EventType.TOUCH_END, this.onAdButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        this.colseCallBakc = this._data.colseCallBakc
        if (GameInfo.Instance().gameDate.freeLottery) {
            this.adButton.active = false
        } else {
            this.freeButton.active = false
        }
        let gameInfo = GameInfo.Instance().gameDate
        if (!gameInfo.lottteryTouchButton) {
            var callback = function () {
                this.onFreeButton()
            }.bind(this)
            gameInfo.lottteryTouchButton = true
            GameStorage.instance().saveGameData(gameInfo)
            let guideUI = instantiate(loader.getRes("UI/GuideUI")) as Node
            guideUI.setParent(this.node)
            guideUI.getComponent(GuideUI).init(this.freeButton, "可以进行免费抽奖", callback)
        }
    }

    update(dt) {
        if (this.pointerStage) {
            switch (this.pointerStage) {
                case PointerStage.accelerationStage:
                    this.accelerationStage(dt)
                    break;
                case PointerStage.constantsStage:
                    this.constantsStage(dt)
                    break;
                case PointerStage.slowStage:
                    this.slowStage(dt)
                    break;
                case PointerStage.moveToTargetStage:
                    this.moveToTargetStage(dt)
                    break;
                default:
                    break;
            }
        }
    }

    onCloseButton() {
        if(this.isRotating == true){
            UIUtility.getInstance().showTopTips("正在抽奖中....")
            return
        }
        if(this.colseCallBakc){
            this.colseCallBakc()
        }
        this.onTouchClose(null, false)
    }

    onFreeButton() {
        this.freeButton.off(Node.EventType.TOUCH_END, this.onFreeButton, this)
        let randomNum = Math.random() * 100
        console.log(randomNum)
        let probability = 0
        for (let i = 0; i < this.itemList.length; i++) {
            probability += this.itemList[i].probability
            console.log(probability)
            if (randomNum <= probability) {
                this.correctItem = this.itemList[i]
                break
            }
        }
        GameInfo.Instance().gameDate.freeLottery = false
        GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
        //this.correctItem = this.itemList[9]
        this.targerPoint = this.correctItem.angle
        this.pointerStage = PointerStage.accelerationStage
        this.isRotating = true
    }

    onAdButton() {
        var callback = function (isEnd) {
            if (isEnd) {
                this.adButton.off(Node.EventType.TOUCH_END, this.onAdButton, this)
                let randomNum = Math.random() * 100
                console.log(randomNum)
                let probability = 0
                for (let i = 0; i < this.itemList.length; i++) {
                    probability += this.itemList[i].probability
                    console.log(probability)
                    if (randomNum <= probability) {
                        this.correctItem = this.itemList[i]
                        break
                    }
                }
                this.targerPoint = this.correctItem.angle
                this.pointerStage = PointerStage.accelerationStage
                this.isRotating = true
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

    accelerationStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        this.speed += this.acclerationRate
        pos.z = pos.z + this.speed
        //this.acclerate += this.acclerationRate
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        this.currAcclerTime += dt
        if (this.currAcclerTime >= this.acclerateTime) {
            this.pointerStage = PointerStage.constantsStage
        }
    }

    constantsStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        pos.z += this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        this.currConstantTime += dt
        if (this.currConstantTime >= this.constantTime) {
            this.pointerStage = PointerStage.slowStage
        }
    }

    slowStage(dt) {
        this.speed -= this.slowRate
        this.currSlowTime += dt
        if (this.speed <= this.minSpeed || this.currSlowTime >= this.slowTime) {
            this.speed = this.minSpeed
            let round = Math.ceil(this.pointer.eulerAngles.z / 360)
            if (this.targerPoint + round * 360 > this.pointer.eulerAngles.z) {
                this.targerPoint = round * 360 + this.targerPoint
            } else {
                this.targerPoint = (round - 1) * 360 + this.targerPoint
            }
            this.pointerStage = pointerStage.moveToTargetStage
        }
        let pos = this.pointer.eulerAngles.clone()
        pos.z += this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
    }

    moveToTargetStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        let dis = this.targerPoint - this.pointer.eulerAngles.z
        if (dis <= 100) {
            let speed = this.speed * dis / 100
            if (dis / 100 < 1 / 10) {
                speed = this.speed * 1 / 10
            }
            pos.z += speed
            this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        } else {
            pos.z += this.speed
            this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        }
        if (this.pointer.eulerAngles.z >= this.targerPoint) {
            if(this.colseCallBakc)this.colseCallBakc()
            this.onTouchClose(null, false)
            this.setReward()
            this.pointerStage = null
        }
    }

    setReward() {
        switch (this.correctItem.itemName) {
            case this.itemList[0].itemName:
                this.rewardStar(500)
                break
            case this.itemList[1].itemName:
                this.rewardSkin()
                break
            case this.itemList[2].itemName:
                this.rewardStar(1000)
                break
            case this.itemList[3].itemName:
                this.rewardStar(10000)
                break
            case this.itemList[4].itemName:
                this.rewardStar(2000)
                break
            case this.itemList[5].itemName:
                this.upLevel()
                break
            case this.itemList[6].itemName:
                this.rewardStar(3000)
                break
            case this.itemList[7].itemName:
                this.rewardStar(5000)
                break
            case this.itemList[8].itemName:
                this.rewardStar(4000)
                break
            case this.itemList[9].itemName:
                this.rewardJBY()
                break
            default:
                break
        }
    }

    rewardStar(num: number) {
        GameInfo.Instance().rewardExp = num
        let data = {
            num: num
        }
        DialogManager.getInstance().showDlg("RewardStarDialog", data)
    }

    rewardSkin() {
        DialogManager.getInstance().showDlg("RewardSkinDialog")
    }

    upLevel() {
        DialogManager.getInstance().showDlg("UpLevelDialog")
    }

    rewardJBY() {
        DialogManager.getInstance().showDlg("RewardJBYDialog")
    }

}
