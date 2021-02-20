import { _decorator, Component, Node, PhysicsSystem, RigidBodyComponent, Vec3 } from 'cc';
//import { Vec3 } from '@cocos/cannon';
const { ccclass, property } = _decorator;

@ccclass('JointConnect')
export class JointConnect extends Component {
 

    @property(Node)
    public node1:Node = null
    @property(Node)
    public node2:Node = null
    private originalDis:number = 0
    start ()
    {
        this.originalDis = Vec3.distance(this.node1.worldPosition,this.node2.worldPosition)
        this.setJiontDis = 1
    }
    
    update()
    {
        if(!this.node2.getComponent(RigidBodyComponent).isAwake)
        {
            this.node2.getComponent(RigidBodyComponent).wakeUp()
        }
    }

    public set setJiontDis(number)
    {
        var c = new CANNON.DistanceConstraint(this.node1.getComponent(RigidBodyComponent).body._sharedBody.body,this.node2.getComponent(RigidBodyComponent).body._sharedBody.body,this.originalDis*number)
        PhysicsSystem.instance.physicsWorld.impl.addConstraint(c)
    }
    
}
