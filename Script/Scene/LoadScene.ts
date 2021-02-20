import { _decorator, Component, Node, director, loader, Prefab, LabelComponent, math, SpriteComponent } from 'cc';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
import BaseLoadingScene from '../../Framework3D/Src/Base/BaseLoadingScene';
import { Constants } from '../CustomEventListener/Constants';
import { GameInfo } from '../Data/GameInfo';
import { GameStorage } from '../Data/GameStorage';
import { ConfigManager } from '../Managers/ConfigManager';
const { ccclass, property } = _decorator;

@ccclass('LoadScene')
export class LoadScene extends BaseLoadingScene {

    @property(LabelComponent)
    tipLabel: LabelComponent = null

    @property(LabelComponent)
    tipLabelBlank: LabelComponent = null

    @property(SpriteComponent)
    spriteProgress: SpriteComponent = null

    start() {
        super.start()
        ConfigManager.getInstance().init()
        let index = math.random() * 4
        if (index == 4) index = 3
        index = Math.ceil(index)
        this.tipLabel.string = Constants.tipLabel.Tip[index]
        this.tipLabelBlank.string = Constants.tipLabel.Tip[index]
        // let gameInfo = GameInfo.Instance().gameDate
        // gameInfo.currentSkin = null
        // GameStorage.instance().saveGameData(gameInfo)
        // console.log(GameStorage.instance().gameData)
        let currentSkin = GameInfo.Instance().getCurrentSkin()
        let skinPath = "Cleaner/" + currentSkin
        console.log("皮肤为"+skinPath)
        loader.loadRes(skinPath, Prefab, () => { })
        director.preloadScene("MainScene")
        director.preloadScene("GameScene")
    }

    onLoadResFinished() {
        let currentSkin = GameInfo.Instance().getCurrentSkin()
        let skinPath = "Cleaner/" + currentSkin
        loader.loadRes(skinPath, Prefab, (err) => {
            if (err) {
                ASCAd.getInstance().exitTheGame()
            }
            console.log("加载完成了")
            director.loadScene("MainScene")
        })
    }

    setProgress(progress) {
        if (this.spriteProgress) {
            this.spriteProgress.fillRange = progress;
        }
        if (this.progressLabel) {
            this.progressLabel.string = `${(progress * 100).toFixed(2)}%`;
        }
    }
}
