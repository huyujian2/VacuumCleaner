import { _decorator, Component, Node } from 'cc';
import { PlayerAI } from '../Game/PlayerAI';
const { ccclass, property } = _decorator;

@ccclass('BaseState')
export class BaseState{
    
    update(ai:PlayerAI,dt){}
    entry(ai:PlayerAI){}
    exit(ai:PlayerAI){}

}
