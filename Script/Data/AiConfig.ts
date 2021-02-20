import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AiConfig')
export class AiConfig{

    public skinPath:string = ""
    public star:number = 0
    public headPhoto:string = ""
    public name:string = ""

}
