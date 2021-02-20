import { _decorator, Component, Node, find, Vec3, RigidBodyComponent, CCInteger, BoxColliderComponent, tween, CCBoolean, Tween, CameraComponent, ColliderComponent, RenderTexture } from 'cc';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { Constants } from '../CustomEventListener/Constants';
import { GameInfo } from '../Data/GameInfo';
import { GameStorage } from '../Data/GameStorage';
import { MapManager } from '../Managers/MapManager';
import { Absorded } from './Absorded';
import { CameraCtrl } from './CamreaCtrl';
import { GameManager } from './GameManager';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('RubbishItem')
export class RubbishItem extends Component {


    /**这个垃圾的等级 */
    @property({ type: CCInteger })
    level: number = 0
    /**这个垃圾的碰撞体是否可以取消掉 */
    @property({ type: CCBoolean })
    isbuttomSupport: boolean = false
    /**这个垃圾的碰撞体是否可以取消掉 */
    @property({ type: CCBoolean })
    ishanging: boolean = false
    /**这个垃圾的分数 */
    public score: number = 10
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
    public originalScale: Vec3 = new Vec3()
    /**被吸收的目标 */
    public absordedTarget: Node = null
    /**是否被吸收了 */
    public absordedFalg: number = 0

    public updateI: number = 0

    public tweenFalg: boolean = true

    private cleanerHeadList: Node[] = []

    private cleanerHeadObject: CleanerHead[] = []

    private absordGroudSet: boolean = false

    start() {
        this.score = Constants.RubbishLevelInfo.Level[this.level - 1].Score
        this.rigiBody = this.node.getComponent(RigidBodyComponent)
        this.collider = this.node.getComponent(BoxColliderComponent)
        this.originalScale = this.node.getScale()
        this.scheduleOnce(() => {
            this.cleanerList = GameManager.Instance.playerList
            for (let cleaner of this.cleanerList) {
                this.cleanerHeadList.push(cleaner.getChildByName("CleanerHead"))
                this.cleanerHeadObject.push(cleaner.getChildByName("CleanerHead").getComponent(CleanerHead))
            }
        }, 0)
        if (this.ishanging) {
            this.rigiBody.isKinematic = true
        }
        this.rigiBody.linearDamping = 0
        this.rigiBody.angularDamping = 0
        this.rigiBody.mass = 1
        this.rigiBody.sleep()
        this.rigiBody.enabled = false
        this.collider.enabled = false
    }

    update() {
        if (this.absordedFalg === 0 && !GameManager.Instance.timeOver) {
            for (this.updateI = 0; this.updateI < this.cleanerHeadList.length; this.updateI++) {
                if (this.cleanerHeadList[this.updateI]) {
                    this.absorbing(this.cleanerHeadList[this.updateI], this.cleanerHeadObject[this.updateI])
                }
                //this.node.getWorldPosition()
                //this.node.worldPosition.clone()
                //this.node.getComponent(BoxColliderComponent)
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
                //刚体没有激活
                if (!this.rigiBody.enabled) {
                    // if (cleanerHead.selfPlay.currentLevel <= 4 && !cleanerHead.isAI) {
                    //     this.rigiBody.enabled = true
                    //     this.collider.enabled = true
                    //     this.rigiBody.applyImpulse(this.selfToCleanerVec3.normalize().multiplyScalar(-1.5))
                    // }
                    // else {
                    //     if (cleanerHead.selfPlay.currentLevel >= 5) {
                    //         if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleaner.getComponent(CleanerHead).maxAdsrtDis * (1 - this.level * 0.12)) {
                    //             this.absordedFalg = 1
                    //             this.absordedTarget = cleaner
                    //             this.absorded()
                    //         }
                    //     }
                    //     else {
                    //         this.absordedFalg = 1
                    //         this.absordedTarget = cleaner
                    //         this.absorded()
                    //     }
                    // }
                    if (!cleanerHead.isAI) {
                        this.rigiBody.enabled = true
                        this.collider.enabled = true
                        this.rigiBody.applyImpulse(this.selfToCleanerVec3.normalize().multiplyScalar(-1.5))
                    } else {
                        this.absordedFalg = 1
                        this.absordedTarget = cleaner
                        this.absorded()
                    }
                }
                //刚体激活了
                else {
                    if (this.ishanging && this.rigiBody.isKinematic) {
                        this.rigiBody.isKinematic = false
                    }
                    this.rigiBody.applyImpulse(this.selfToCleanerVec3.normalize().multiplyScalar(-1.5))
                    if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleaner.getComponent(CleanerHead).maxAdsrtDis * 0.35) {
                        this.absordedFalg = 1
                        this.absordedTarget = cleaner
                        this.absorded()
                    }
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
        let cleanerHead = this.absordedTarget.getComponent(CleanerHead)
        if (!cleanerHead.isAI) {
            if (this.node.name.includes("(__autogen 1)")) {
                GameInfo.Instance().gameDate.bookCount += 1
                GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            }
            if (this.node.name.includes("Computer_Screen")) {
                GameInfo.Instance().gameDate.computerCount += 1
                GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)

            }
        }
    }


    public destroySelf() {
        GameManager.Instance.delWakeUp(this.node.uuid)
        GameManager.Instance.delEnable(this.node.uuid)
        this.node.destroy()
        MapManager.Instance.addDestoryCount()
    }

    public checkState() {
        if (this.collider == null) {
            //console.log(this.node.name)
            return
        }
        //console.info(this.cleanerList.length)
        if (!this.absordedFalg && !GameManager.Instance.timeOver && this.cleanerList.length > 0) {
            //是否在屏幕内
            if (CameraCtrl.Instance.posIsInScreen(this.node.worldPosition, this.isbuttomSupport)) {
                //这个垃圾的等级小于等于当前玩家等级的时候
                if (this.level <= this.cleanerList[0].getComponent(Player).currentLevel) {
                    //是小于的时候
                    if (this.level < this.cleanerList[0].getComponent(Player).currentLevel) {
                        if (this.rigiBody.isSleeping) {
                            if (this.rigiBody.enabled) {
                                this.rigiBody.enabled = false
                            }
                            if (this.collider.enabled) {
                                this.collider.enabled = false
                            }
                        }
                    }
                    //是等于的时候
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
                    if (!this.rigiBody.enabled) {
                        this.rigiBody.enabled = true
                    }
                    if (!this.collider.enabled) {
                        this.collider.enabled = true
                    }
                }
            }
            else {
                if (this.rigiBody.enabled) {
                    this.rigiBody.enabled = false
                }
                if (this.collider.enabled) {
                    this.collider.enabled = false
                }
            }
        }
        // if (this.collider.enabled) {
        //     GameManager.Instance.setEnable(this.node.uuid, this.node)
        // }
        // else {
        //     GameManager.Instance.delEnable(this.node.uuid)
        // }
    }

    public setGroupAndMask(any) {
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
