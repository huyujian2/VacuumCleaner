import { _decorator, Component, Node } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { GameInfo } from '../../Data/GameInfo';
import { GameStorage } from '../../Data/GameStorage';
import { BasePuzzleDialog } from '../../Uitis/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('RewardJBYDialog')
export class RewardJBYDialog extends BasePuzzleDialog {

    @property(Node)
    button: Node = null

    start() {
        super.start()
        this.button.on(Node.EventType.TOUCH_END, this.onButton, this)
        AudioManager.getInstance().playEffectByPath("Click03")
    }

    onButton() {
        this.onTouchClose(null, false)
        let gameData = GameInfo.Instance().gameDate
        gameData.JYB += 1
        GameStorage.instance().saveGameData(gameData)
    }


}
