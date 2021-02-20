import { _decorator, Component, Node, find } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { Constants } from '../../CustomEventListener/Constants';
import { GameInfo } from '../../Data/GameInfo';
import { BasePuzzleDialog } from '../../Uitis/BasePuzzleDialog';
import { MainUI } from '../MainUI';
const { ccclass, property } = _decorator;

@ccclass('UpdateLevelDialog')
export class UpdateLevelDialog extends BasePuzzleDialog {

    @property(Node)
    button: Node = null

    start() {
        super.start()
        this.button.on(Node.EventType.TOUCH_END, this.onButton, this)
        AudioManager.getInstance().playEffectByPath("Click03")
    }

    onButton() {
        this.onTouchClose(null, false)
        let currentLevel = GameInfo.Instance().gameDate.level
        let currentLevelExp = GameInfo.Instance().gameDate.currentLevelExp
        let reachExp = Constants.AchievementLevelInfo.Level[currentLevel - 1].Score
        GameInfo.Instance().rewardExp = reachExp - currentLevelExp
        find("Canvas").getComponent(MainUI).updatePlayerInfo()
    }

}
