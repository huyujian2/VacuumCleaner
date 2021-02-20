import { _decorator, Component, Node, LabelComponent } from 'cc';
import { BasePuzzleDialog } from '../../Uitis/BasePuzzleDialog';
const { ccclass, property } = _decorator;

@ccclass('TipDialog')
export class TipDialog extends BasePuzzleDialog {

    @property(LabelComponent)
    label: LabelComponent = null

    @property(Node)
    button: Node = null

    start() {
        super.start()
        this.node.on(Node.EventType.TOUCH_END, this.onButton, this)
        this.label.string = this._data.label
    }

    onButton() {
        this.onTouchClose(null, false)
    }

}
