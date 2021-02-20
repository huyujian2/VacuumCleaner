import { _decorator, Component, Node, Vec2, Vec3, LabelComponent, instantiate, loader, Prefab } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { CleanerBody } from '../CleanerConstruction/CleanerBody';
import { SkinManager } from '../Managers/SkinManager';
import { GameInfo } from '../Data/GameInfo';
import { GameStorage } from '../Data/GameStorage';
import DialogManager from '../../Framework3D/Src/Base/DialogManager';
import AudioManager from '../../Framework3D/Src/Base/AudioManager';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
const { ccclass, property } = _decorator;

@ccclass('SkinPage')
export class SkinPage extends Component {

    @property(Node)
    skinList: Node = null

    @property(Node)
    sellectList: Node = null

    @property(LabelComponent)
    skinNameLabel: LabelComponent = null

    @property(LabelComponent)
    skinNameShadowLabel: LabelComponent = null

    @property(Node)
    backToMainButton: Node = null

    @property(Node)
    skinButton: Node = null

    @property(Node)
    unLockButton: Node = null

    @property(LabelComponent)
    conditionLabel: LabelComponent = null

    @property(Node)
    startButton: Node = null

    @property(Node)
    skinLoader: Node = null

    @property(Node)
    skinLoadIcon: Node = null

    @property(LabelComponent)
    JYBCount: LabelComponent = null

    @property(Node)
    JYBUnlcokButton: Node = null

    @property(Node)
    turnLeft: Node = null

    @property(Node)
    turnRight: Node = null

    private moveDelta: Vec2 = new Vec2()

    private hadMove: boolean = false

    private mapWorldPos: Vec3 = new Vec3()

    private sellectSkin: string = null



    start() {
        this.mapWorldPos = this.skinList.getWorldPosition()
        this.backToMainButton.on(Node.EventType.TOUCH_END, this.onBackToMainButton, this)
        this.skinButton.on(Node.EventType.TOUCH_END, this.onSkinButton, this)
        this.unLockButton.on(Node.EventType.TOUCH_END, this.onUnlockButton, this)
        this.skinLoader.on(Node.EventType.TOUCH_START, this.onSkinLoader, this)
        this.skinLoader.on(Node.EventType.TOUCH_MOVE, this.onSkinLoader, this)
        this.skinLoader.on(Node.EventType.TOUCH_END, this.onSkinLoader, this)
        this.turnLeft.on(Node.EventType.TOUCH_END, this.onTurnLeft, this)
        this.turnRight.on(Node.EventType.TOUCH_END, this.onTurnRight, this)
    }

    onSkinLoader() { }

    onTurnLeft() {
        this.moveSkinLsit("Left")
    }

    onTurnRight() {
        this.moveSkinLsit("Right")
    }

    updateSkinPageDiaplay() {
        console.log(GameInfo.Instance().gameDate)
        this.JYBCount.string = GameInfo.Instance().gameDate.JYB.toString()
    }

    onBackToMainButton() {
        for (var i = 0; i < Constants.SkinInfo.Skin.length; i++) {
            let skinModle = this.skinList.getChildByName(Constants.SkinInfo.Skin[i].EnglishName)
            if (!skinModle) continue
            if (SkinManager.Instance().currentSkin !== Constants.SkinInfo.Skin[i].EnglishName) {
                let model = this.skinList.getChildByName(Constants.SkinInfo.Skin[i].EnglishName)
                let pos = model.getPosition()
                cc.tween(model).repeat(1, cc.tween()
                    .to(0.8, { position: cc.v3(pos.x, pos.y, 0) }, { easing: "sineOut" }))
                    .start()
            }
            else {
                var t = i
                setTimeout(() => {
                    cc.tween(this.skinList).repeat(1, cc.tween()
                        .to(0.8, { position: cc.v3(-t * 2, this.skinList.worldPosition.y, this.skinList.worldPosition.z) }, { easing: "sineOut" }))
                        .start()
                }, 300)
            }
        }
        if (GameInfo.Instance().gameDate.unLockSkinList.indexOf(this.sellectSkin) === -1) {

        }
        else {
            SkinManager.Instance().currentSkin = this.sellectSkin
        }
        GameInfo.Instance().gameDate.currentSkin = SkinManager.Instance().currentSkin
        GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this)
        this.startButton.active = true
    }

    public onSkinButton() {
        this.updateSkinPageDiaplay()
        this.sellectSkin = SkinManager.Instance().currentSkin
        this.mapWorldPos = this.skinList.getWorldPosition()
        this.updateSellectList()
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onUnlockButton() {
        let isCanUlock = SkinManager.Instance().getUnLockCondition(this.sellectSkin)
        console.info("解锁条件：" + isCanUlock)
        if (isCanUlock) {
            GameInfo.Instance().gameDate.unLockSkinList.push(this.sellectSkin)
            SkinManager.Instance().currentSkin = this.sellectSkin
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            this.unLockButton.active = false
            this.startButton.active = true
            this.updateSkinPageDiaplay()
            let data = {
                label: "恭喜解锁此皮肤"
            }
            AudioManager.getInstance().playEffectByPath("Congratulation")
            DialogManager.getInstance().showDlg("TipDialog", data)
        } else {
            let data = {
                label: "解锁条件不满足"
            }
            DialogManager.getInstance().showDlg("TipDialog", data)
        }
    }


    moveSkinLsit(dir: string) {
        this.skinLoader.active = true
        if (dir === "Left") {
            this.mapWorldPos.x += 2
            if (this.mapWorldPos.x > 1) {
                this.mapWorldPos.x = 1
                let pos1 = this.mapWorldPos.clone()
                this.mapWorldPos.x = 0
                let pos2 = this.mapWorldPos.clone()
                cc.tween(this.skinList).repeat(1, cc.tween()
                    .to(0.25, { worldPosition: pos1 }, { easing: "sineOut" })
                    .to(0.25, { worldPosition: pos2 }, { easing: "sineOut" }))
                    .call(() => {
                        this.updateSellectList()
                    })
                    .start()
            }
            else {
                let pos = this.mapWorldPos
                cc.tween(this.skinList).repeat(1, cc.tween()
                    .to(0.5, { worldPosition: pos }, { easing: "sineOut" }))
                    .call(() => {
                        this.updateSellectList()
                    })
                    .start()
            }
        }
        if (dir === "Right") {
            this.mapWorldPos.x -= 2
            if (this.mapWorldPos.x < -33) {
                this.mapWorldPos.x = -33
                let pos1 = this.mapWorldPos.clone()
                this.mapWorldPos.x = -32
                let pos2 = this.mapWorldPos.clone()
                cc.tween(this.skinList).repeat(1, cc.tween()
                    .to(0.25, { worldPosition: pos1 }, { easing: "sineOut" })
                    .to(0.25, { worldPosition: pos2 }, { easing: "sineOut" }))
                    .call(() => {
                        this.updateSellectList()
                    })
                    .start()
            }
            else {
                let pos = this.mapWorldPos
                cc.tween(this.skinList).repeat(1, cc.tween()
                    .to(0.5, { worldPosition: pos }, { easing: "sineOut" }))
                    .call(() => {
                        this.updateSellectList()
                    })
                    .start()
            }
        }
    }

    updateSellectList() {
        let index = -this.mapWorldPos.x / 2
        for (var i = 0; i < this.sellectList.children.length; i++) {
            if (i === index) {
                this.sellectList.children[i].children[0].active = true
            }
            else {
                this.sellectList.children[i].children[0].active = false
            }
        }
        console.log(index)
        let skinName = Constants.SkinInfo.Skin[index].Name
        this.skinNameLabel.string = skinName
        this.skinNameLabel.color.set(SkinManager.Instance().LockColor)
        this.skinNameShadowLabel.string = skinName

        let skinEngName = Constants.SkinInfo.Skin[index].EnglishName
        let result = this.skinList.getChildByName(skinEngName)
        if (result) {
            if (GameInfo.Instance().gameDate.unLockSkinList.indexOf(skinEngName) === -1) {
                this.unLockButton.active = true
                this.startButton.active = false
                if (Constants.SkinInfo.Skin[index])
                    this.sellectSkin = skinEngName
                this.conditionLabel.string = Constants.SkinInfo.Skin[index].Contiditon + "\n" + SkinManager.Instance().getUnLockStrCondition(skinName)
            }
            else {
                this.unLockButton.active = false
                this.startButton.active = true
                this.sellectSkin = skinEngName
                SkinManager.Instance().currentSkin = skinEngName
                this.conditionLabel.string = Constants.SkinInfo.Skin[index].Contiditon
            }
            console.log(this.sellectSkin)
            this.skinLoader.active = false
        } else {
            this.skinLoadIcon.active = true
            loader.loadRes("Cleaner/" + skinEngName, Prefab, (err: any, prefab: Prefab) => {
                if (err) { ASCAd.getInstance().exitTheGame() }
                let skinModel = instantiate(prefab)
                skinModel.getChildByName("CleanerHead").getComponent(CleanerHead).enabled = false
                skinModel.getChildByName("CleanerBody").getComponent(CleanerBody).enabled = false
                skinModel.getChildByName("CleanerHead").removeComponent(CleanerHead)
                skinModel.getChildByName("CleanerBody").removeComponent(CleanerBody)
                skinModel.setParent(this.skinList)
                skinModel.setPosition(-index * 2, 0, 10)
                console.log(this.skinList)
                this.skinLoader.active = false
                this.skinLoadIcon.active = false
                if (GameInfo.Instance().gameDate.unLockSkinList.indexOf(skinEngName) === -1) {
                    this.unLockButton.active = true
                    this.startButton.active = false
                    this.sellectSkin = skinEngName
                    this.conditionLabel.string = Constants.SkinInfo.Skin[index].Contiditon + "\n" + SkinManager.Instance().getUnLockStrCondition(skinName)
                }
                else {
                    this.unLockButton.active = false
                    this.startButton.active = true
                    this.sellectSkin = skinEngName
                    SkinManager.Instance().currentSkin = skinEngName
                    this.conditionLabel.string = Constants.SkinInfo.Skin[index].Contiditon
                }
                console.log(this.sellectSkin)
            })
        }
    }

    onTouchStart(e) {
        if (cc.game.canvas.requestPointerLock) { cc.game.canvas.requestPointerLock(); }
        this.hadMove = false
    }

    onTouchMove(e) {
        e.getDelta(this.moveDelta)
        if (!this.hadMove) {
            if (this.moveDelta.x > 8) {
                this.hadMove = true
                this.moveSkinLsit("Left")
            }
            if (this.moveDelta.x < -8) {
                this.hadMove = true
                this.moveSkinLsit("Right")
            }
        }
    }

    onTouchEnd(e) {
        if (document.exitPointerLock) { document.exitPointerLock(); }
    }
}
