import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoxManager')
export class BoxManager 
{

    public maskList:number = 1

    //单例模式
    private static boxManager: BoxManager
    public static Instance(): BoxManager 
    {
        if (this.boxManager == null) 
            {
                this.boxManager = new BoxManager()
            }
        return BoxManager.boxManager
    }
}
