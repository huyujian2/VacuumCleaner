import { _decorator, Component, Node, Vec3 } from 'cc';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { PlayerAI } from './PlayerAI';
const { ccclass, property } = _decorator;

@ccclass('CleanerObsorded')
export class CleanerObsorded extends Component {

    /**被吸收到的点 */
    public target:Node = null
    private targetPoint:Node = null 

    private directToTarget:Vec3 = new Vec3() 

    private startDistant:number = 0

    private currentDistant:number = 0

    private worldScale:Vec3 = new Vec3()

    public itemLevel:number = 0

    start () 
    {
        this.targetPoint = this.target.getComponent(CleanerHead).absordedPoint
        this.startDistant = Vec3.distance(this.node.parent.worldPosition,this.targetPoint.worldPosition)
        this.worldScale = this.node.parent.getWorldScale()
    }

    update (deltaTime: number)
    {
        this.currentDistant = Vec3.distance(this.node.parent.worldPosition,this.targetPoint.worldPosition)
        Vec3.subtract(this.directToTarget,this.node.parent.worldPosition,this.targetPoint.worldPosition)
        this.node.parent.setWorldPosition(this.node.parent.getWorldPosition().add(this.directToTarget.normalize().multiplyScalar(-0.1*this.startDistant))) 
        if(this.worldScale.clone().multiplyScalar(this.currentDistant/this.startDistant).x< this.node.parent.getWorldScale().x)
        {
            this.node.parent.setWorldScale(this.worldScale.clone().multiplyScalar(this.currentDistant/this.startDistant))
        }
        if( this.currentDistant <= 0.1*this.itemLevel)
        {
            this.node.parent.getComponent(PlayerAI).removeSelf()
        }
    }
}
