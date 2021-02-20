import { _decorator, Component, Node } from 'cc';
import { PlayerAI } from '../Game/PlayerAI';
import { BaseState } from './BaseState';
import { DetectState } from './DetectState';
const { ccclass, property } = _decorator;

@ccclass('CollectState')
export class CollectState extends BaseState {

    private time = 0

    update(ai:PlayerAI,dt)
    {
        // this.time += 1
        // console.info("我正在侦测模式")
        // console.info(this.time)
        // if(this.time === 500)
        // {
        //     this.exit(ai)
        //     ai.setState(new DetectState())
        // }
        this.time += 1
        //console.info(this.time)
        if(this.time>=50)
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
