import { _decorator, Component, Node, LabelComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { GameInfo } from '../../Data/GameInfo';
import { GameStorage } from '../../Data/GameStorage';
import { BasePuzzleDialog } from '../../Uitis/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('RewardSkinDialog')
export class RewardSkinDialog extends BasePuzzleDialog {

    @property(Node)
    button: Node = null

    @property(LabelComponent)
    label: LabelComponent = null

    hadSkin: boolean = false

    start() {
        this.button.on(Node.EventType.TOUCH_END, this.onButton, this)
        if (GameInfo.Instance().gameDate.unLockSkinList.includes("Astronaut")) {
            this.hadSkin = true
        } else {
            this.hadSkin = false
        }
        if (this.hadSkin) {
            this.label.string = "已拥有"
        } else {
            this.label.string = "恭喜获得"
        }
        AudioManager.getInstance().playEffectByPath("Click03")
        console.log(GameInfo.Instance().gameDate.unLockSkinList.includes("Astronaut"))
    }

    onButton() {
        this.onTouchClose(null, false)
        if (!this.hadSkin) {
            GameInfo.Instance().gameDate.unLockSkinList.push("Astronaut")
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
        }
    }

}
