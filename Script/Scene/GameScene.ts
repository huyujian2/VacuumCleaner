import { _decorator, Component, Node } from 'cc';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
import BaseScene from '../../Framework3D/Src/Base/BaseScene';
import { GameInfo } from '../Data/GameInfo';
import { AdManager } from '../Managers/AdManager/AdManager';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends BaseScene {

    start() {
        super.start()
        this.initScene()
        AdManager.getInstance().hideBanner()
        AdManager.getInstance().showBanner()
        // let adInfo = ASCAd.getInstance().getNativeInfo()
        // console.log(adInfo)
    }

    initScene() {
        GameInfo.Instance().rewardExp = 0
    }
}
