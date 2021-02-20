import { _decorator, Component, Node, LabelComponent, find } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { GameInfo } from '../../Data/GameInfo';
import { BasePuzzleDialog } from '../../Uitis/BasePuzzleDialog';
import { MainUI } from '../MainUI';
const { ccclass, property } = _decorator;

@ccclass('RewardStarDialog')
export class RewardStarDialog extends BasePuzzleDialog {

    @property(LabelComponent)
    starLabel: LabelComponent = null

    @property(Node)
    button: Node = null

    start() {
        super.start()
        this.starLabel.string = "恭喜获得星星*" + this._data.num.toString()
        this.button.on(Node.EventType.TOUCH_END, this.onButton, this)
        AudioManager.getInstance().playEffectByPath("Click03")

    }

    onButton() {
        this.onTouchClose(null, false)
        GameInfo.Instance().rewardExp = this._data.num
        find("Canvas").getComponent(MainUI).updatePlayerInfo()
    }

}
