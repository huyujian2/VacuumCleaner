import { _decorator, Component, Node, instantiate, LabelComponent } from 'cc';
import { UINodeBreath } from '../Uitis/UINodeBreath';
const { ccclass, property } = _decorator;

@ccclass('GuideUI')
export class GuideUI extends Component {

    @property(Node)
    finger: Node = null

    @property(Node)
    button: Node = null

    @property(LabelComponent)
    label: LabelComponent = null

    callBack = null

    targetNode: Node = null

    start() {
        this.button.setContentSize(this.targetNode.getContentSize())
        let cloneNode = instantiate(this.targetNode)
        cloneNode.setParent(this.node)
        cloneNode.setWorldPosition(this.targetNode.worldPosition)
        cloneNode.setWorldRotation(this.targetNode.worldRotation)
        this.button.on(Node.EventType.TOUCH_END, this.onButton, this)
        this.finger.setWorldPosition(this.targetNode.worldPosition)
        this.button.setWorldPosition(this.targetNode.worldPosition)
        this.button.setWorldRotation(this.targetNode.worldRotation)
        cloneNode.setSiblingIndex(1)
        cloneNode.addComponent(UINodeBreath).frequency = 0.8
    }

    init(node: Node, label: string, callback) {
        this.targetNode = node
        this.callBack = callback
        this.label.string = label
    }

    onButton() {
        this.node.active = false
        if (this.callBack) {
            this.callBack()
        }
    }

}
