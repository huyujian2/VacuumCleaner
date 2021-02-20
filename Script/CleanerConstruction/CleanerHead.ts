import { _decorator, Component, CCFloat, Vec2, Vec3, PhysicsSystem, Node, RigidBodyComponent, ColliderComponent, ITriggerEvent, BoxColliderComponent, math, CCBoolean, lerp, tween } from 'cc';

import { CameraCtrl } from '../Game/CamreaCtrl';
import { CleanerObsorded } from '../Game/CleanerObsorded';
import { GameManager } from '../Game/GameManager';
import { Player } from '../Game/Player';
import { PlayerAI } from '../Game/PlayerAI';
import { RubbishItem } from '../Game/RubbishItem';
import { WallRubbishItem } from '../Game/WallRubbishItem';
const { ccclass, property } = _decorator;


enum TouchState {
    TouchMove,
    TouchEnd
}

@ccclass('CleanerHead')
export class CleanerHead extends Component {

    /**移动速度 */
    @property({ type: CCFloat })
    moveSpeed: number = 0

    /**移动速度 */
    @property({ type: CCFloat })
    rotateSpeed: number = 0

    @property({ type: BoxColliderComponent })
    adsorbTrigger: BoxColliderComponent = null

    @property({ type: BoxColliderComponent })
    collecter: BoxColliderComponent = null

    @property(Node)
    absordedPoint: Node = null

    /**是否是AI */
    @property({})
    isAI = false

    /**这个吸尘器头的玩家 */
    public selfPlay = null

    /**开始触摸的坐标 */
    private touchStartPos: Vec2 = new Vec2()
    /**当前触摸的坐标 */
    private touchCurrentPos: Vec2 = new Vec2()
    /**开始触摸到当前触摸的方向 */
    private directStartToCurrent2D: Vec2 = new Vec2()
    /**开始触摸到当前触摸的方向 */
    private directStartToCurrent3D: Vec3 = new Vec3()
    /**实际角度值 */
    private realAngleY: number = null
    /**要旋转到的目标角度 */
    private targetAngleY: number = null
    /**当前触摸状态 */
    private touchState = TouchState.TouchEnd
    /**刚体组建 */
    private rigidBody: RigidBodyComponent = null
    /**收集器的原始大小 */
    public collecterOriginalSize: Vec3 = new Vec3()
    /**最大可吸附距离 */
    public maxAdsrtDis: number = 5
    /**初始最大可吸附距离 */
    public maxAdsrtOriginalDis: number = 3

    private updateI: number = 0

    ///////////////////////////////////////////////////
    /**吸尘器的节点 */
    private cleanerList: Array<Node> = []

    private CleanerSameY: Vec3 = new Vec3()

    private selfToCleanerVec3: Vec3 = new Vec3()

    private includedAngle: number = 0

    private maxAdsortAngel = 60

    private absordedFalg = false
    /////////////////////////////////////////////////////




    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    start() {
        if (this.isAI) {
            this.selfPlay = this.node.parent.getComponent(PlayerAI)
        }
        else {
            this.selfPlay = this.node.parent.getComponent(Player)
        }
        this.rigidBody = this.node.getComponent(RigidBodyComponent)
        this.collecter.on('onTriggerEnter', this.onCollerterTrigger, this)
        this.collecterOriginalSize = this.collecter.size.clone()
        this.cleanerList = GameManager.Instance.playerList
        tween(this.node).repeatForever(tween(this.node)
            .call(() => {
                this.checkState()
            }).delay(0.4).start()).start()
    }



    update(deltaTime: number) {
        if (this.absordedFalg) { return }
        if (!this.isAI && !GameManager.Instance.timeOver) {
            this.posCtrl()
        }
        for (this.updateI = 0; this.updateI < this.cleanerList.length; this.updateI++) {
            if (this.selfPlay.node !== this.cleanerList[this.updateI]) {
                this.absorbingCleaner(this.cleanerList[this.updateI].getChildByName("CleanerHead"))
            }
        }
        // for (let rubbish of MapManager.Instance.rubbishItemList) {
        //     if (rubbish.node) {
        //         this.absorbingRubbish(rubbish)
        //     }
        // }
        // for (let rubbish of MapManager.Instance.outSideRubbish) {
        //     if (rubbish.node) {
        //         this.absorbingRubbish(rubbish)
        //     }
        // }
    }


    onTouchMove(e, a) {
        this.touchState = TouchState.TouchMove
        if (a.getTouches().length === 1) {
            e.getStartLocation(this.touchStartPos)
            e.getLocation(this.touchCurrentPos)
        }
    }

    onTouchEnd() {
        this.touchState = TouchState.TouchEnd
        this.rigidBody.setLinearVelocity(new Vec3(0, 0, 0))
    }

    public collect(node: Node) {
        if (node.getComponent(RubbishItem) !== null) {
            var score = node.getComponent(RubbishItem).score
            this.selfPlay.addScore(score)
            if (!this.isAI) {
                GameManager.Instance.GameUI.showScore(node.worldPosition, score)
                //CustomEventListener.dispatchEvent(Constants.EventName.ShowScore,node.worldPosition,score)
            }
            //node.getComponent(RubbishItem).destroySelf()
        }

        if (node.getComponent(WallRubbishItem) !== null) {
            var score = node.getComponent(WallRubbishItem).score
            this.selfPlay.addScore(score)
            if (!this.isAI) {
                GameManager.Instance.GameUI.showScore(node.worldPosition, score)
                //CustomEventListener.dispatchEvent(Constants.EventName.ShowScore,node.worldPosition,score)
            }
            //node.getComponent(WallRubbishItem).destroySelf()
        }
    }

    private onCollerterTrigger(event: ITriggerEvent) {

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

    posCtrl() {
        if (this.touchState === TouchState.TouchMove) {
            Vec2.subtract(this.directStartToCurrent2D, this.touchCurrentPos, this.touchStartPos)
            //角度旋转
            this.targetAngleY = -this.getAngleByVector(this.directStartToCurrent2D.x, this.directStartToCurrent2D.y)
            if (this.node.eulerAngles.y - this.targetAngleY > 180) {
                this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y - 360, this.node.eulerAngles.z)
            }
            if (this.node.eulerAngles.y - this.targetAngleY < -180) {
                this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y + 360, this.node.eulerAngles.z)
            }
            this.node.setRotationFromEuler(this.node.eulerAngles.x, lerp(this.node.eulerAngles.y, this.targetAngleY, 0.1), this.node.eulerAngles.z)
            this.directStartToCurrent3D = new Vec3(this.directStartToCurrent2D.x, 0, -this.directStartToCurrent2D.y).normalize()
            this.rigidBody.setLinearVelocity(this.directStartToCurrent3D.multiplyScalar(this.moveSpeed + this.selfPlay.star * 0.2))
        }
    }

    moveToTarget(pos: Vec3) {
        pos.y = this.node.worldPosition.clone().y
        pos.subtract(this.node.getWorldPosition())
        pos.normalize()
        var angelY = this.node.eulerAngles.clone().y
        if (angelY < 0) {
            angelY += 360
            this.node.setRotationFromEuler(this.node.eulerAngles.clone().x, this.node.eulerAngles.clone().y + 360, this.node.eulerAngles.clone().z)
        }
        var y = math.lerp(angelY, this.getAngleByVector(-pos.x, -pos.z), 0.2)
        this.node.setRotationFromEuler(this.node.eulerAngles.clone().x, y, this.node.eulerAngles.clone().z)
        if (y - this.getAngleByVector(-pos.x, -pos.z) <= 2) {
            this.rigidBody.setLinearVelocity(this.node.forward.multiplyScalar(this.moveSpeed + this.selfPlay.star * 0.2))
        }
    }

    lerpRotateAngle(TargetY: number) {
        var angelY = this.node.eulerAngles.clone().y
        if (angelY < 0) {
            angelY += 360
            this.node.setRotationFromEuler(this.node.eulerAngles.clone().x, this.node.eulerAngles.clone().y + 360, this.node.eulerAngles.clone().z)
        }
        var y = math.lerp(angelY, TargetY, 0.06 + 0.06 * this.selfPlay.star * 0.2)
        this.node.setRotationFromEuler(this.node.eulerAngles.clone().x, y, this.node.eulerAngles.clone().z)
        this.rigidBody.setLinearVelocity(this.node.forward.multiplyScalar(this.moveSpeed + this.selfPlay.star * 0.2))
    }

    /**正在被吸收 */
    public absorbingCleaner(cleaner: Node) {
        if (this.selfPlay.currentLevel > cleaner.getComponent(CleanerHead).selfPlay.currentLevel) { return }

        if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleaner.getComponent(CleanerHead).maxAdsrtDis) {
            this.CleanerSameY = cleaner.getWorldPosition()
            this.CleanerSameY.y = this.node.worldPosition.y
            Vec3.subtract(this.selfToCleanerVec3, this.node.getWorldPosition(), this.CleanerSameY)
            this.includedAngle = Vec3.angle(this.selfToCleanerVec3, cleaner.forward) * 180 / Math.PI
            if (this.includedAngle < this.maxAdsortAngel) {
                this.rigidBody.applyImpulse(this.selfToCleanerVec3.normalize().multiplyScalar(-20))
                if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleaner.getComponent(CleanerHead).maxAdsrtDis * 0.35) {
                    if (this.isAI && this.selfPlay.currentLevel < cleaner.getComponent(CleanerHead).selfPlay.currentLevel) {
                        this.absordedFalg = true
                        this.rigidBody.enabled = false
                        this.node.getComponent(BoxColliderComponent).enabled = false
                        this.node.addComponent(CleanerObsorded).target = cleaner
                        this.node.getComponent(CleanerObsorded).itemLevel = this.selfPlay.currentLevel
                    }
                }
            }
        }
    }

    /**正在被吸收 */
    public absorbingRubbish(rubbish: any) {
        if (!rubbish.node || !rubbish.rigiBody) return
        if (this.selfPlay.currentLevel < rubbish.level) { return }
        if (Vec3.distance(this.node.getWorldPosition(), rubbish.node.getWorldPosition()) < this.maxAdsrtDis) {
            let sameYPos = this.node.getWorldPosition()
            sameYPos.y = rubbish.node.getWorldPosition().y
            let absorbingVec: Vec3 = new Vec3()
            Vec3.subtract(absorbingVec, rubbish.node.getWorldPosition(), sameYPos)
            let includeAngle = Vec3.angle(absorbingVec, this.node.forward) * 180 / Math.PI
            if (includeAngle < rubbish.maxAdsortAngel) {
                if (rubbish.rigiBody.isSleeping && rubbish.rigiBody.enabled) { rubbish.rigiBody.wakeUp() }
            }
            if (!rubbish.rigiBody.enabled) {
                if (this.selfPlay.currentLevel <= 4 && !this.isAI) {
                    rubbish.rigiBody.enabled = true
                    rubbish.collider.enabled = true
                    rubbish.rigiBody.applyImpulse(absorbingVec.normalize().multiplyScalar(-1.5))
                } else {
                    if (this.selfPlay.currentLevel >= 5) {
                        if (Vec3.distance(rubbish.node.getWorldPosition(), this.node.getWorldPosition()) < this.maxAdsrtDis * (1 - rubbish.level * 0.12)) {
                            rubbish.absordedFalg = 1
                            rubbish.absordedTarget = this.node
                            rubbish.absorded()
                        }
                    } else {
                        rubbish.absordedFalg = 1
                        rubbish.absordedTarget = this.node
                        rubbish.absorded()
                    }
                }
            } else {
                if (rubbish.ishanging && rubbish.rigiBody.isKinematic) {
                    rubbish.rigiBody.isKinematic = false
                }
                rubbish.rigiBody.applyImpulse(absorbingVec.normalize().multiplyScalar(-1.5))
                if (Vec3.distance(this.node.getWorldPosition(), rubbish.node.getWorldPosition()) < this.maxAdsrtDis * 0.35) {
                    rubbish.absordedFalg = 1
                    rubbish.absordedTarget = this.node
                    rubbish.absorded()
                }
            }
        }



        // if (this.selfPlay.currentLevel > cleaner.getComponent(CleanerHead).selfPlay.currentLevel) { return }
        // if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleaner.getComponent(CleanerHead).maxAdsrtDis) {
        //     this.CleanerSameY = cleaner.getWorldPosition()
        //     this.CleanerSameY.y = this.node.worldPosition.y
        //     Vec3.subtract(this.selfToCleanerVec3, this.node.getWorldPosition(), this.CleanerSameY)
        //     this.includedAngle = Vec3.angle(this.selfToCleanerVec3, cleaner.forward) * 180 / Math.PI
        //     if (this.includedAngle < this.maxAdsortAngel) {
        //         this.rigidBody.applyImpulse(this.selfToCleanerVec3.normalize().multiplyScalar(-20))
        //         if (Vec3.distance(this.node.getWorldPosition(), cleaner.getWorldPosition()) < cleaner.getComponent(CleanerHead).maxAdsrtDis * 0.35) {
        //             if (this.isAI && this.selfPlay.currentLevel < cleaner.getComponent(CleanerHead).selfPlay.currentLevel) {
        //                 this.absordedFalg = true
        //                 this.rigidBody.enabled = false
        //                 this.node.getComponent(BoxColliderComponent).enabled = false
        //                 this.node.addComponent(CleanerObsorded).target = cleaner
        //                 this.node.getComponent(CleanerObsorded).itemLevel = this.selfPlay.currentLevel
        //             }
        //         }
        //     }
        // }
    }

    checkState() {
        let result = CameraCtrl.Instance.posIsInScreen(this.node.worldPosition)
        if (result) {
            this.rigidBody.enabled = true
            //this.collecter.enabled = true
        } else {
            this.rigidBody.enabled = false
            //this.collecter.enabled = false
        }
    }
}
