import { _decorator, Component, Node, find, instantiate, loader, director } from 'cc';
import BaseScene from '../../Framework3D/Src/Base/BaseScene';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { CleanerBody } from '../CleanerConstruction/CleanerBody';
import { ConfigManager } from '../Managers/ConfigManager';
import { SkinManager } from '../Managers/SkinManager';
import { GameInfo } from '../Data/GameInfo';
import { AdManager } from '../Managers/AdManager/AdManager';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends BaseScene {

    @property(Node)
    skinListNode: Node = null

    skinList = [
        "Cleaner/Default",
        "Cleaner/Vaco",
        "Cleaner/Kid",
        "Cleaner/Reggae",
        "Cleaner/Lazy",
        "Cleaner/Viking",
        "Cleaner/NFL",
        "Cleaner/Wing",
        "Cleaner/Punk",
        "Cleaner/Trump",
        "Cleaner/Santa",
        "Cleaner/Corporal",
        "Cleaner/Graduate",
        "Cleaner/PaperBoy",
        "Cleaner/Metal",
        "Cleaner/OuiPolice",
        "Cleaner/Astronaut"
    ]

    start() {
        super.start()
        console.log("开始初始化皮肤")
        this.initSkinModel()
        console.log("开始初始化场景")
        this.initScene()
        director.preloadScene("GameScene")
        ConfigManager.getInstance().getRobotName()
        AdManager.getInstance().hideBanner()
        AdManager.getInstance().showBanner()
    }

    initScene() {
        SkinManager.Instance().currentSkin = GameInfo.Instance().getCurrentSkin()
        console.log(SkinManager.Instance().currentSkin)
        let skinPath = "Cleaner/" + SkinManager.Instance().currentSkin
        for (var i = 0; i < this.skinList.length; i++) {
            if (skinPath === this.skinList[i]) {
                this.skinListNode.setWorldPosition(cc.v3(-i * 2, this.skinListNode.worldPosition.y, this.skinListNode.worldPosition.z))
                console.info(this.skinListNode.getWorldPosition())
                let currentSkinModel = this.skinListNode.getChildByName(SkinManager.Instance().currentSkin)
                let pos = currentSkinModel.getWorldPosition()
                currentSkinModel.setWorldPosition(cc.v3(pos.x, pos.y, 0))
            }
        }

        //let currentSkinModel = this.skinListNode.getChildByName(SkinManager.Instance().currentSkin)
        //this.skinListNode.setWorldPosition(cc.v3(-i * 2, this.skinListNode.worldPosition.y, this.skinListNode.worldPosition.z))

        // SkinManager.Instance().currentSkin = GameInfo.Instance().gameDate.currentSkin
        // //let skinPath = "Cleaner/" + SkinManager.Instance().currentSkin
        // for (var i = 0; i < this.skinListNode.children.length; i++) {
        //     if (SkinManager.Instance().currentSkin === this.skinListNode.children[i].name) {
        //         this.skinListNode.setWorldPosition(cc.v3(-i * 2, this.skinListNode.worldPosition.y, this.skinListNode.worldPosition.z))
        //         console.info(this.skinListNode.getWorldPosition())
        //         let pos = this.skinListNode.children[i].getWorldPosition()
        //         this.skinListNode.children[i].setWorldPosition(cc.v3(pos.x, pos.y, 0))
        //     }
        // }
    }

    initSkinModel() {
        console.log("初始化皮肤")
        for (let path of this.skinList.values()) {
            console.log(path)
            let skinRes = loader.getRes(path)
            if (skinRes) {
                let skin = instantiate(loader.getRes(path)) as Node
                skin.getChildByName("CleanerHead").getComponent(CleanerHead).enabled = false
                skin.getChildByName("CleanerBody").getComponent(CleanerBody).enabled = false
                skin.getChildByName("CleanerHead").removeComponent(CleanerHead)
                skin.getChildByName("CleanerBody").removeComponent(CleanerBody)
                skin.setParent(this.skinListNode)
            }
        }
    }
}
