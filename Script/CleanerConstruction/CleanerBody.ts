import { _decorator, Component, Node, Vec3, Vec2, CCFloat, Quat, ColliderComponent, RigidBodyComponent, tween } from "cc";
import { CameraCtrl } from "../Game/CamreaCtrl";
const { ccclass, property } = _decorator;
cc.macro.ENABLE_WEBGL_ANTIALIAS = true
@ccclass("CleanerBody")
export class CleanerBody extends Component {

    /**跟随目标，也就是吸尘器的头 */
    @property(Node)
    folowTarger: Node = null

    /**跟随时的转动角度 */
    @property({ type: CCFloat })
    rotateSpeed = 0

    @property(ColliderComponent)
    collider: ColliderComponent = null

    @property(RigidBodyComponent)
    rigidBody: RigidBodyComponent = null

    /**与吸尘器头的限定距离 */
    private disWithTarget: number

    private heightOffset: number

    private disOffset: Vec3 = new Vec3()



    start() {
        this.disWithTarget = Vec3.distance(this.node.position, this.folowTarger.position)
        this.heightOffset = this.node.position.y - this.folowTarger.position.y
        Vec3.subtract(this.disOffset, this.node.worldPosition, this.folowTarger.worldPosition)

        tween(this.node).repeatForever(tween(this.node)
            .call(() => {
                this.checkState()
            }).delay(0.4).start()).start()
    }

    update() {
        var temp = new Vec3(this.folowTarger.worldPosition.x, this.node.worldPosition.y, this.folowTarger.worldPosition.z)
        //Vec3.subtract(this.disOffset,this.node.worldPosition,temp)
        //this.disOffset.y = this.node.worldPosition.y
        this.node.lookAt(temp)
        //this.currentDis = Vec3.distance(this.node.position,this.folowTarger.position)
        //if(this.disWithTarget<this.currentDis)
        //{
        // Vec3.subtract(this.targetDirection,this.folowTarger.position,this.node.position)
        // //角度旋转
        // this.targetAngleY = -this.getAngleByVector(this.targetDirection.x,-this.targetDirection.z)
        // if(this.node.eulerAngles.y - this.targetAngleY > 180)
        // {
        //     this.node.setRotationFromEuler(this.node.eulerAngles.x,this.node.eulerAngles.y-360,this.node.eulerAngles.z)
        // }
        // if(this.node.eulerAngles.y - this.targetAngleY < -180)
        // {
        //     this.node.setRotationFromEuler(this.node.eulerAngles.x,this.node.eulerAngles.y+360,this.node.eulerAngles.z)
        // }
        // if(this.targetAngleY -this.node.eulerAngles.y >5+0.1)
        // {
        //     this.realAngleY = this.node.eulerAngles.y + 5
        //     this.node.setRotationFromEuler(this.node.eulerAngles.x,this.realAngleY,this.node.eulerAngles.z)
        // }
        // else if(this.targetAngleY -this.node.eulerAngles.y < -5-0.1)
        // {
        //     this.realAngleY = this.node.eulerAngles.y - 5
        //     this.node.setRotationFromEuler(this.node.eulerAngles.x,this.realAngleY,this.node.eulerAngles.z)
        // }
        // else
        // {
        //     this.realAngleY = this.node.eulerAngles.y
        //     this.node.setRotationFromEuler(this.node.eulerAngles.x,this.realAngleY,this.node.eulerAngles.z)
        // }

        // console.info("距离远了")
        //this.node.position.add(this.node.forward.normalize().multiplyScalar(0.1))
        //this.node.setWorldPosition(this.folowTarger.position)
        // var c
        // Vec3.add(c,this.folowTarger.worldPosition,this.disOffset)
        // this.node.setWorldPosition(c)
        // console.info(this.node.worldPosition)
        //}
    }


    /**向量转换角度 */
    getAngleByVector(lenx, leny) {
        if (leny === 0) {
            if (lenx < 0) {
                return 270
            }
            else if (lenx > 0) {
                return 90
            }

        }
        if (lenx === 0) {
            if (leny >= 0) {
                return 0
            }
            else if (leny < 0) {
                return 180
            }
        }

        let tanyx = Math.abs(leny) / Math.abs(lenx)
        let angle = 0
        if (leny > 0 && lenx < 0) {
            angle = 270 + Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny > 0 && lenx > 0) {
            angle = 90 - Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny < 0 && lenx < 0) {
            angle = 270 - Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny < 0 && lenx > 0) {
            angle = 90 + Math.atan(tanyx) * 180 / Math.PI
        }
        return angle
    }

    checkState() {
        let result = CameraCtrl.Instance.posIsInScreen(this.node.worldPosition)
        if (result) {
            this.rigidBody.enabled = true
            //this.collider.enabled = true
        } else {
            this.rigidBody.enabled = false
            //this.collider.enabled = false
        }
    }
}
