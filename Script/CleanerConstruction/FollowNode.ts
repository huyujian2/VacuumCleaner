import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FollowNode')
export class FollowNode extends Component {
    
    @property(Node)
    followTarget:Node = null

    start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        this.node.setWorldPosition(this.followTarget.worldPosition)
    }
}
