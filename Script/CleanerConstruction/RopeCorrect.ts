import { _decorator, Component, Node, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RopeCorrect')
export class RopeCorrect extends Component {

    @property(Node)
    TopNode:Node = null
    @property(Node)
    TailNode:Node = null

    private correctPos:Vec3 = new Vec3()
    private correcRotate:Vec3 = new Vec3()

    start () {
        
    }

    update()
    {
        this.correctPos = this.TopNode.getWorldPosition().add(this.TailNode.getWorldPosition()).multiplyScalar(0.5)
        this.node.setWorldPosition(this.correctPos)
        Vec3.rotateZ(this.correcRotate,this.node.forward,new Vec3(0,0,0),1.57)
        this.node.lookAt(this.TailNode.worldPosition)

    }

   
}
