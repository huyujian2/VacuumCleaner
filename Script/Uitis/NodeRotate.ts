import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property ,executeInEditMode} = _decorator;

@ccclass('NodeRotate')
@executeInEditMode
export class NodeRotate extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start() {

    }

    update(deltaTime: number) {
        let euler = this.node.eulerAngles.clone()
        euler.y += 2
        this.node.setRotationFromEuler(euler.x, euler.y, euler.z)
    }

}
