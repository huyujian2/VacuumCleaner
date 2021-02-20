import { _decorator, Component, Node, Vec3, find } from 'cc';
import { PlayerAI } from '../Game/PlayerAI';
import { BaseState } from './BaseState';
import { CollectState } from './CollectState';
import { DetectState } from './DetectState';
const { ccclass, property } = _decorator;

@ccclass('MoveState')
export class MoveState extends BaseState {

    private moveTarget:Node = null

    constructor(...params:any) {
        super()
        this.moveTarget = params[0]
    }

    update(ai:PlayerAI,dt)
    {
        if(this.moveTarget.isValid)
        {
            //console.info(this.moveTarget.isValid)
            if(Vec3.distance(ai.cleanerHead.node.worldPosition,this.moveTarget.worldPosition)<ai.cleanerHead.maxAdsrtDis)
            {
                ai.setState(new CollectState())
            }
            else
            {
                ai.cleanerHead.moveToTarget(this.moveTarget.worldPosition.clone())
            }
        }
        else
        {
            ai.setState(new DetectState())
        }
        
    }

    exit(ai:PlayerAI)
    {
        
    }

    entry(ai:PlayerAI)
    {
    }
}
