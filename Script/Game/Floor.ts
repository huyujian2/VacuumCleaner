import { _decorator, Component, Node, BoxColliderComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Floor')
export class Floor extends Component {


    private boxcollider:BoxColliderComponent
    start () 
    {
        this.boxcollider = this.node.getComponent(BoxColliderComponent)
        for(var i = 1;i<=100;i++)
        {
            this.boxcollider.addMask(i)
        }
    }
}
