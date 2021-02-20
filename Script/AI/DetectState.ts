import { _decorator, Component, Node, SphereColliderComponent, math } from 'cc';
import { PlayerAI } from '../Game/PlayerAI';
import { BaseState } from './BaseState';
import { MoveState } from './MoveState';
const { ccclass, property } = _decorator;

@ccclass('DetectState')
export class DetectState extends BaseState {

    private detectTime: number = 0
    private detectCount: number = 3
    private currentDetectCount: number = 0
    private dirtectionAngelY: number = 0

    private detectProgress: number = 0
    private detectMaxProgress: number = 9

    update(ai: PlayerAI, dt) {
        if (this.detectTime === 0) {
            this.setDetectDirtection()
        }
        ai.cleanerHead.lerpRotateAngle(this.dirtectionAngelY)
        this.detectTime += dt
        if (this.detectTime > 0.1) {
            this.detectTime = 0
            this.detectProgress += 1
            ai.getRubbishSubStep(this.detectProgress, this.detectMaxProgress)
            if (this.detectProgress == this.detectMaxProgress) {
                if (ai.nearestTarget != null) {
                    ai.blockMap.set(ai.nearestTarget.uuid, ai.nearestTarget)
                    ai.setState(new MoveState(ai.nearestTarget))
                } else {
                    ai.setState(new DetectState())
                }
            }
        }
    }

    exit(ai: PlayerAI) {

    }

    entry(ai: PlayerAI) {
        ai.reflashTarget()
    }

    /**设置一个检测方向 */
    setDetectDirtection() {
        this.dirtectionAngelY = Math.random() * 360
    }

}
