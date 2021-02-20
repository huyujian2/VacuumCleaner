import { _decorator, Component, Node, director, UIOpacityComponent, Vec2, Vec3, ProgressBarComponent, LabelComponent, instantiate, EditBoxComponent, find, AudioSourceComponent, loader, Asset, SpriteComponent } from 'cc';
import { SkinPage } from './SkinPage';
import { Constants } from '../CustomEventListener/Constants';
import AudioManager from '../../Framework3D/Src/Base/AudioManager';
import { AiConfigManager } from '../Managers/AiConfigManager';
import { LoadPage } from './LoadPage';
import { SkinManager } from '../Managers/SkinManager';
import { GameInfo } from '../Data/GameInfo';
import DialogManager from '../../Framework3D/Src/Base/DialogManager';
import { GuideUI } from './GuideUI';
import { GameStorage } from '../Data/GameStorage';
import PlatformManager from '../../Framework3D/Src/Base/PlatformManager';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {

    @property(Node)
    startButton: Node = null

    @property(Node)
    loadingPage: Node = null

    @property(Node)
    skinPage: Node = null

    @property(Node)
    mainPage: Node = null

    @property(Node)
    soundOnButton: Node = null

    @property(Node)
    soundOffButton: Node = null

    @property(Node)
    shakeOnButton: Node = null

    @property(Node)
    shakeOffButton: Node = null

    @property(Node)
    map: Node = null

    @property(Node)
    skinListNode: Node = null

    @property(Node)
    skinButton: Node = null

    @property(Node)
    skinBackButton: Node = null

    @property(Node)
    lotteryButton: Node = null

    @property(Node)
    playerInfo: Node = null

    @property(EditBoxComponent)
    nameEditBox: EditBoxComponent = null

    @property(Node)
    loadingUI: Node = null

    @property(SpriteComponent)
    loadprogress: SpriteComponent = null

    @property(LoadPage)
    loadPage: LoadPage = null

    @property(Node)
    navigateButton: Node = null

    private LogoOriginalPos: Vec3 = new Vec3()

    private mapOriginalPos: Vec3 = new Vec3()

    start() {
        console.log("在MianUI里面")
        this.initPlayerInfo()
        this.scheduleOnce(() => {
            this.LogoOriginalPos = this.mainPage.getChildByName("Logo").getPosition()
            this.mapOriginalPos = this.map.getWorldPosition()
        }, 0)
        this.startButton.on(Node.EventType.TOUCH_END, this.onStartButton, this)
        this.soundOnButton.on(Node.EventType.TOUCH_END, this.onSoundOnButton, this)
        this.soundOffButton.on(Node.EventType.TOUCH_END, this.onSoundOffButton, this)
        // this.shakeOnButton.on(Node.EventType.TOUCH_END, this.onShakeOnButton, this)
        // this.shakeOffButton.on(Node.EventType.TOUCH_END, this.onShakeOffButton, this)
        this.skinButton.on(Node.EventType.TOUCH_END, this.onSkinButton, this)
        this.skinBackButton.on(Node.EventType.TOUCH_END, this.onSkinBackButton, this)
        this.lotteryButton.on(Node.EventType.TOUCH_END, this.onLotteryButton, this)
        this.nameEditBox.node.on('editing-did-ended', this.OnEditBox, this)
        this.navigateButton.on(Node.EventType.TOUCH_END, this.onNavigateButton, this)
        this.updatePlayerInfo()
        if (AudioManager.getInstance().getMusicState()) {
            this.soundOnButton.active = true
            this.soundOffButton.active = false
        }
        else {
            this.soundOnButton.active = false
            this.soundOffButton.active = true
        }

        //新手引导
        let gameInfo = GameInfo.Instance().gameDate
        if (gameInfo.startGameGuide) {
            ASCAd.getInstance().getIntersFlag() && ASCAd.getInstance().showInters()
        }
        if (!gameInfo.startGameGuide) {
            console.log("进行开始新手引导")
            let guideUI = instantiate(loader.getRes("UI/GuideUI")) as Node
            guideUI.setParent(this.node)
            var callBack = function () {
                this.onStartButton()
            }.bind(this)
            gameInfo.startGameGuide = true
            GameStorage.instance().saveGameData(gameInfo)
            guideUI.getComponent(GuideUI).init(this.startButton, "点击开始游戏对战", callBack)
        } else if (!gameInfo.lotteryGuide) {
            let guideUI = instantiate(loader.getRes("UI/GuideUI")) as Node
            guideUI.setParent(this.node)
            var callBack = function () {
                this.onLotteryButton()
            }.bind(this)
            gameInfo.lotteryGuide = true
            GameStorage.instance().saveGameData(gameInfo)
            guideUI.getComponent(GuideUI).init(this.lotteryButton, "点击转盘可进行抽奖", callBack)
            console.log("进行算盘新手引导")
        }

        if (PlatformManager.getInstance().isVivo()) {
            this.navigateButton.active = false
        }
        else if (PlatformManager.getInstance().isOppo()) {
            //@ts-ignore
            if (qg.getSystemInfoSync().platformVersionCode >= 1076) {
                this.navigateButton.active = true
            }
            else {
                // this.showNativeIcon()
            }
        }
        else {
            //this.showNativeIcon()
        }
    }

    onNavigateButton() {
        if (ASCAd.getInstance().getNavigateBoxPortalFlag()) {
            //展示互推盒子九宫格
            ASCAd.getInstance().showNavigateBoxPortal();
        }
    }

    onLotteryButton() {
        this.navigateButton.active = false
        var callBack = function () {
            if (PlatformManager.getInstance().isOppo()) {
                if (qg.getSystemInfoSync().platformVersionCode >= 1076) {
                    this.navigateButton.active = true
                }
            }
            //this.navigateButton.active = true
        }.bind(this)
        let data = {
            colseCallBakc: callBack
        }
        DialogManager.getInstance().showDlg("LotteryDialog", data)
    }

    onStartButton() {
        this.loadingPage.active = true
        this.navigateButton.active = false
        let resArray = [
            //"GameMap/BedRoom1",
            "GameMap/Kitchen1",
            "GameMap/Kitchen2",
            //"GameMap/Lounge1",
            "GameMap/StaticMap",
            "GameMap/Walls",
            "GameMap/House_hub",
            //"GameMap/WallsBounds"
        ]
        AiConfigManager.getInstance().refalshConfig()
        resArray.push(AiConfigManager.getInstance().AI1.skinPath)
        resArray.push(AiConfigManager.getInstance().AI2.skinPath)
        resArray.push(AiConfigManager.getInstance().AI3.skinPath)
        loader.loadResArray(resArray, Asset, (completedCount, totalCount) => {
            let progress = completedCount / totalCount;
            if (isNaN(progress)) {
                return;
            }
            this.setProgtrss(progress)
        }, () => {
            this.setProgtrss(1)
            this.loadPage.playerFinish = true
            this.loadPage.loadFinish()
            // GameInfo.Instance().gameDate.currentSkin = SkinManager.Instance().currentSkin
            // GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            // director.loadScene("GameScene")
        })
    }

    onSoundOnButton() {
        this.soundOnButton.active = false
        this.soundOffButton.active = true
        AudioManager.getInstance().setMusicState(false)
    }

    onSoundOffButton() {
        this.soundOffButton.active = false
        this.soundOnButton.active = true
        AudioManager.getInstance().setMusicState(true)
    }

    // onShakeOnButton() {
    //     this.shakeOnButton.active = false
    //     this.shakeOffButton.active = true
    // }

    // onShakeOffButton() {
    //     this.shakeOffButton.active = false
    //     this.shakeOnButton.active = true
    // }

    onSkinButton() {
        cc.tween(this.map).repeat(1, cc.tween()
            .to(1, { worldPosition: cc.v3(this.mapOriginalPos.clone().x, this.mapOriginalPos.clone().y, this.mapOriginalPos.clone().z - 20) }))
            .start()
        this.skinPage.active = true
        cc.tween(this.mainPage.getChildByName("Logo")).repeat(1, cc.tween()
            .to(0.3, { position: cc.v3(0, 1000, 0) }, { easing: "sineOut" }))
            .start()
        cc.tween(this.mainPage.getComponent(UIOpacityComponent)).repeat(1, cc.tween()
            .to(0.3, { opacity: 0 }, { easing: "sineOut" }))
            .start()
        cc.tween(this.skinPage.getComponent(UIOpacityComponent)).repeat(1, cc.tween()
            .to(0.3, { opacity: 255 }, { easing: "sineOut" })
            .call(() => {
                this.mainPage.active = false
            }))
            .start()

        for (var i = 0; i < this.skinListNode.children.length; i++) {
            if (this.skinListNode.children[i].name !== SkinManager.Instance().currentSkin) {
                //console.info("已经进来移动位置了")
                let pos = this.skinListNode.children[i].getPosition()
                cc.tween(this.skinListNode.children[i]).repeat(1, cc.tween()
                    .to(0.8, { position: cc.v3(pos.x, pos.y, 10) }, { easing: "sineOut" }))
                    .start()
            }
        }
        this.skinPage.getComponent(SkinPage).onSkinButton()
    }

    onSkinBackButton() {
        cc.tween(this.map).repeat(1, cc.tween()
            .to(1, { worldPosition: this.mapOriginalPos }, { easing: "sineIn" }))
            .start()
        this.mainPage.active = true
        cc.tween(this.mainPage.getChildByName("Logo")).repeat(1, cc.tween()
            .to(0.3, { position: this.LogoOriginalPos }))
            .start()
        cc.tween(this.skinPage.getComponent(UIOpacityComponent)).repeat(1, cc.tween()
            .to(0.3, { opacity: 0 }, { easing: "sineOut" }))
            .start()
        cc.tween(this.mainPage.getComponent(UIOpacityComponent)).repeat(1, cc.tween()
            .to(0.3, { opacity: 255 }, { easing: "sineOut" })
            .call(() => {
                this.skinPage.active = false
            }))
            .start()
    }

    initPlayerInfo() {
        let currentLevel = GameInfo.Instance().gameDate.level
        console.log("currentLevel" + currentLevel)
        let currentLevelExp = GameInfo.Instance().gameDate.currentLevelExp
        console.log("currentLevelExp" + currentLevelExp)
        let palyerName = GameInfo.Instance().gameDate.playerName
        console.log("palyerName" + palyerName)
        let Bar: ProgressBarComponent = this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent)
        let LevelProgressLabel: LabelComponent = this.playerInfo.getChildByName("LevelProgress").getComponent(LabelComponent)
        let ProgressLabel: LabelComponent = this.playerInfo.getChildByPath("LevelProgress/LevelProgress").getComponent(LabelComponent)
        let starLayout: Node = this.playerInfo.getChildByName("StarLayout")
        let levelNameShadow: LabelComponent = this.playerInfo.getChildByName("LevelName").getComponent(LabelComponent)
        let levelName: LabelComponent = this.playerInfo.getChildByPath("LevelName/LevelName").getComponent(LabelComponent)
        Bar.progress = currentLevelExp / Constants.AchievementLevelInfo.Level[currentLevel - 1].Score
        let labelString = currentLevelExp.toString() + "/" + Constants.AchievementLevelInfo.Level[currentLevel - 1].Score.toString()
        levelName.string = Constants.AchievementLevelInfo.Level[currentLevel - 1].Name
        levelNameShadow.string = Constants.AchievementLevelInfo.Level[currentLevel - 1].Name
        LevelProgressLabel.string = labelString
        ProgressLabel.string = labelString
        this.nameEditBox.placeholderLabel.string = palyerName
        // for (var i = 0; i < currentLevel - 1; i++) {
        //     let node = instantiate(starLayout.children[0]) as Node
        //     node.setParent(starLayout)
        // }
    }

    updatePlayerInfo() {
        console.info(GameInfo.Instance().gameDate)
        console.info(GameInfo.Instance().gameDate.currentLevelExp)
        console.info(GameInfo.Instance().rewardExp)
        GameInfo.Instance().updateLoginDay()
        if (GameInfo.Instance().rewardExp === 0) {
            let currentLevel = GameInfo.Instance().gameDate.level
            let currentLevelExp = GameInfo.Instance().gameDate.currentLevelExp
            let Bar: ProgressBarComponent = this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent)
            let LevelProgressLabel: LabelComponent = this.playerInfo.getChildByName("LevelProgress").getComponent(LabelComponent)
            let ProgressLabel: LabelComponent = this.playerInfo.getChildByPath("LevelProgress/LevelProgress").getComponent(LabelComponent)
            Bar.progress = currentLevelExp / Constants.AchievementLevelInfo.Level[currentLevel - 1].Score
            let labelString = currentLevelExp.toString() + "/" + Constants.AchievementLevelInfo.Level[currentLevel - 1].Score.toString()
            if (currentLevel >= 16) {
                LevelProgressLabel.string = ""
                ProgressLabel.string = ""
                Bar.progress = 1
            } else {
                LevelProgressLabel.string = labelString
                ProgressLabel.string = labelString
            }
            let starLayout: Node = this.playerInfo.getChildByName("StarLayout")
            let length = starLayout.children.length
            for (var i = 0; i < currentLevel - length; i++) {
                let node = instantiate(starLayout.children[0]) as Node
                node.setParent(starLayout)
            }
        }
        else {
            let oldLevel = GameInfo.Instance().gameDate.level
            GameInfo.Instance().AddExp(GameInfo.Instance().rewardExp)
            let currentLevel = GameInfo.Instance().gameDate.level
            let currentLevelExp = GameInfo.Instance().gameDate.currentLevelExp
            let starLayout: Node = this.playerInfo.getChildByName("StarLayout")
            this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent).progress = 0
            let length = starLayout.children.length
            for (var i = 0; i < currentLevel - length; i++) {
                let node = instantiate(starLayout.children[0]) as Node
                node.setParent(starLayout)
            }
            if (oldLevel !== currentLevel) {
                cc.tween(this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent)).repeat(1, cc.tween()
                    .to(0.5, { progress: 1 }, { easing: "sineOut" })
                    .call(() => {
                        this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent).progress = 0
                        let length = starLayout.children.length
                        for (var i = 0; i < currentLevel - length; i++) {
                            let node = instantiate(starLayout.children[0]) as Node
                            node.setParent(starLayout)
                        }
                    })
                    .to(1.1, { progress: currentLevelExp / Constants.AchievementLevelInfo.Level[currentLevel - 1].Score }, { easing: "sineOut" }))
                    .start()
            }
            else {
                if (currentLevel >= 16) {
                    this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent).progress = 1
                } else {
                    cc.tween(this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent)).repeat(1, cc.tween()
                        .to(1.6, { progress: currentLevelExp / Constants.AchievementLevelInfo.Level[currentLevel - 1].Score }, { easing: "sineOut" }))
                        .start()
                }
            }
            cc.tween(this.playerInfo).repeat(1, cc.tween()
                .to(0.3, { scale: cc.v3(1.2, 1.2, 1.2) }, { easing: "sineOut" })
                .to(1, { scale: cc.v3(1.2, 1.2, 1.2) }, { easing: "sineOut" })
                .to(0.3, { scale: cc.v3(1, 1, 1) }, { easing: "sineOut" }))
                .start()
            let Bar: ProgressBarComponent = this.playerInfo.getChildByName("LevelBar").getComponent(ProgressBarComponent)
            let LevelProgressLabel: LabelComponent = this.playerInfo.getChildByName("LevelProgress").getComponent(LabelComponent)
            let ProgressLabel: LabelComponent = this.playerInfo.getChildByPath("LevelProgress/LevelProgress").getComponent(LabelComponent)
            let levelNameShadow: LabelComponent = this.playerInfo.getChildByName("LevelName").getComponent(LabelComponent)
            let levelName: LabelComponent = this.playerInfo.getChildByPath("LevelName/LevelName").getComponent(LabelComponent)
            Bar.progress = currentLevelExp / Constants.AchievementLevelInfo.Level[currentLevel - 1].Score
            let labelString = currentLevelExp.toString() + "/" + Constants.AchievementLevelInfo.Level[currentLevel - 1].Score.toString()
            levelName.string = Constants.AchievementLevelInfo.Level[currentLevel - 1].Name
            levelNameShadow.string = Constants.AchievementLevelInfo.Level[currentLevel - 1].Name
            if (currentLevel >= 16) {
                LevelProgressLabel.string = ""
                ProgressLabel.string = ""
                Bar.progress = 1
            } else {
                LevelProgressLabel.string = labelString
                ProgressLabel.string = labelString
            }
            GameInfo.Instance().rewardExp = 0
        }
    }

    OnEditBox(editbox: EditBoxComponent) {
        if (editbox.string !== "") {
            GameInfo.Instance().gameDate.playerName = editbox.string
        }
    }

    setProgtrss(progress) {
        this.loadprogress.fillRange = progress
    }

}
