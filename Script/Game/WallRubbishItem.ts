import { _decorator, Component, Node, Vec3, RigidBodyComponent, BoxColliderComponent, tween, CCInteger, CCBoolean, Tween } from 'cc';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { Constants } from '../CustomEventListener/Constants';
import { MapManager } from '../Managers/MapManager';
import { Absorded } from './Absorded';
import { CameraCtrl } from './CamreaCtrl';
import { GameManager } from './GameManager';
import { Player } from './Player';
import { WallBound } from './WallBound';
const { ccclass, property } = _decorator;

@ccclass('WallRubbishItem')
export class WallRubbishItem extends Component {
    /**这个垃圾的等级 */
    @property({ type: CCInteger })
    level: number = 5
    /**这个垃圾的碰撞体是否可以取消掉 */
    @property({ type: CCBoolean })
    canDisableCollider: boolean = true
    /**这个垃圾的碰撞体是否可以取消掉 */
    @property({ type: CCBoolean })
    ishanging: boolean = true
    /**这个垃圾的分数 */
    public score: number = 1
    /**吸尘器的节点 */
    public cleanerList: Array<Node> = []
    // /**与吸尘器前线方向的角度 */
    public includedAngle: number
    /**自身到吸尘器的向量 */
    public selfToCleanerVec3: Vec3 = new Vec3()
    /**吸尘器的位置Y值相同 */
    public CleanerSameY: Vec3 = new Vec3()
    /**最大可吸附角 */
    public maxAdsortAngel: number = 60
    /**刚体组建 */
    public rigiBody: RigidBodyComponent = null
    /**碰撞盒组件 */
    public collider: BoxColliderComponent = null
    /**原始大小 */
    private originalScale: Vec3 = new Vec3()
    /**被吸收的目标 */
    public absordedTarget: Node = null
    /**是否被吸收了 */
    public absordedFalg: number = 0

    public updateI: number = 0

    public parentComt: WallBound = null

    public tweenFalg: boolean = true

    private cleanerHeadList: Node[] = []

    private cleanerHeadObject: CleanerHead[] = []

    private absordGroudSet: boolean = false

    start() {
        //console.info(this.level)
        this.score = 30
        this.rigiBody = this.node.getComponent(RigidBodyComponent)
        this.collider = this.node.getComponent(BoxColliderComponent)
        this.originalScale = this.node.getScale()
        this.parentComt = this.node.parent.getComponent(WallBound)

        this.cleanerList = GameManager.Instance.playerList
        if (this.ishanging) {
            this.rigiBody.isKinematic = true
        }

        this.scheduleOnce(() => {
            this.cleanerList = GameManager.Instance.playerList
            for (let cleaner of this.cleanerList) {
                this.cleanerHeadList.push(cleaner.getChildByName("CleanerHead"))
                this.cleanerHeadObject.push(cleaner.getChildByName("CleanerHead").getComponent(CleanerHead))
            }
        }, 0)
        //每个一秒发送一次位置给AI
        // tween(this.node).repeatForever(tween(this.node)
        // .call(()=>{
        //     if(this.tweenFalg)
        //     {
        //         GameManager.Instance.sendPosToPlays(this.node)
        //     }
        //     }).delay(1).start()).start()
        tween(this.node).repeatForever(tween(this.node)
        .call(()=>{
            if(this.tweenFalg)
            {
                this.checkState()
            }
        }).delay(0.4).start()).start()

        this.rigiBody.sleep()
        this.rigiBody.enabled = false
        this.collider.enabled = false
    }



    update() {

        if (this.absordedFalg === 0 && !GameManager.Instance.timeOver && this.parentComt.childrenCanUpdate) {
            for (this.updateI = 0; this.updateI < this.cleanerHeadList.length; this.updateI++) {
                if (this.cleanerHeadList[this.updateI]) {
                    this.absorbing(this.cleanerHeadList[this.updateI], this.cleanerHeadObject[this.updateI])
                }
                //this.absorbing(this.cleanerList[this.updateI].getChildByName("CleanerHead"))
                //this.cleanerList[this.updateI].getChildByName("CleanerHead")
            }
        }
    }

    /**正在被吸收 */
    public absorbing(cleaner: Node, cleanerHead: CleanerHead) {
        if (this.level > cleanerHead.selfPlay.currentLevel) { return }
        if (Vec3.distance(this.node.worldPosition, cleaner.worldPosition) < cleanerHead.maxAdsrtDis) {
            this.CleanerSameY = cleaner.worldPosition.clone()
            this.CleanerSameY.y = this.node.worldPosition.y
            Vec3.subtract(this.selfToCleanerVec3, this.node.worldPosition.clone(), this.CleanerSameY)
            this.includedAngle = Vec3.angle(this.selfToCleanerVec3, cleaner.forward) * 180 / Math.PI
            if (this.includedAngle < this.maxAdsortAngel) {
                this.setAbsordGroud()
                if (this.rigiBody.isSleeping && this.rigiBody.enabled) {
                    this.rigiBody.wakeUp()
                }
                if (!this.rigiBody.enabled) {
                    // this.absordedFalg = 1
                    // this.absordedTarget = cleaner
                    // this.absorded()
                    this.rigiBody.enabled = true
                    this.collider.enabled = true
                    this.rigiBody.applyImpulse(this.selfToCleanerVec3.normalize().multiplyScalar(-1.5))
                }
                else {
                    if (this.ishanging && this.rigiBody.isKinematic) {
                        this.rigiBody.isKinematic = false
                    }
                    this.rigiBody.applyForce(this.selfToCleanerVec3.normalize().multiplyScalar(-40))
                }
                if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleanerHead.maxAdsrtDis * 0.6) {
                    this.absordedFalg = 1
                    this.absordedTarget = cleaner
                    this.absorded()
                }

            }
        }

    }

    /**已经被吸收了 */
    absorded() {
        this.rigiBody.enabled = false
        this.collider.enabled = false
        this.node.addComponent(Absorded).target = this.absordedTarget
        this.node.getComponent(Absorded).itemLevel = this.level

    }


    public destroySelf() {
        GameManager.Instance.delWakeUp(this.node.uuid)
        GameManager.Instance.delEnable(this.node.uuid)
        this.node.destroy()
    }

    public checkState() {
        if (this.collider == null) {
            //console.log(this.node.name)
            return
        }
        //console.log("墙体的checkState")
        if (!this.absordedFalg && this.parentComt.childrenCanUpdate && !GameManager.Instance.timeOver && this.cleanerList.length > 0) {
            if (CameraCtrl.Instance.posIsInScreen(this.node.worldPosition)) {
                if (this.level + 2 <= this.cleanerList[0].getComponent(Player).currentLevel) {
                    this.rigiBody.enabled = false
                    this.collider.enabled = false
                }
                else {
                    if (!this.rigiBody.enabled) {
                        this.rigiBody.enabled = true
                    }
                    if (!this.collider.enabled) {
                        this.collider.enabled = true
                    }
                }
            }
            else {
                if (this.canDisableCollider) {
                    if (this.rigiBody.enabled) {
                        this.rigiBody.enabled = false
                    }
                    if (this.collider.enabled) {
                        this.collider.enabled = false
                    }
                }
            }
        }

        // if(this.collider.enabled)
        // {
        //     GameManager.Instance.setEnable(this.node.uuid,this.node)
        // }
        // else
        // {
        //     GameManager.Instance.delEnable(this.node.uuid)
        // } 
        // if (this.collider.enabled) {
        //     GameManager.Instance.setEnable(this.node.uuid, this.node)
        // }
        // else {
        //     GameManager.Instance.delEnable(this.node.uuid)
        // }
    }

    public setGroupAndMask(any) {
        if (this.collider === null) { return }
        //console.info(this.collider)
        this.collider.setGroup(any)
        this.collider.setMask(any)
        this.collider.addMask(1)
    }

    setAbsordGroud() {
        if (this.absordGroudSet) return
        this.absordGroudSet = true
        let group = Constants.GroupAndMask.Group[MapManager.Instance.groupIndex]
        this.setGroupAndMask(group)
        MapManager.Instance.addGroupIndex()
    }

}
