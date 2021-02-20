import { _decorator, Component, Node, CCInteger, Vec3, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainSceneCamera')
export class MainSceneCamera extends Component {

    @property(Node)
    followTarget:Node = null
    
    @property({type:(CCInteger)})
    changeTime:number = 0

    @property({type:(CCFloat)})
    speed:number = 0

    private cameraPos:Vec3 = new Vec3()

    private currentTime:number = 0

    private moveDir:boolean = false

    start () {
        this.node.lookAt(this.followTarget.worldPosition)
        this.cameraPos = this.node.getWorldPosition()
    }

    update (deltaTime: number) {
        this.currentTime +=deltaTime
        if(this.currentTime>this.changeTime)
        {
            this.currentTime = 0
            this.moveDir = !this.moveDir
        }
       
        this.node.lookAt(this.followTarget.worldPosition)
        if(this.moveDir)
        {
            this.node.setWorldPosition(cc.v3(this.node.worldPosition.x-deltaTime*this.speed,this.cameraPos.y,this.cameraPos.z))
        }
        else
        {
            this.node.setWorldPosition(cc.v3(this.node.worldPosition.x+deltaTime*this.speed,this.cameraPos.y,this.cameraPos.z))
        }
    }
}
