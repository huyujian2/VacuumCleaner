import { _decorator, Component, Node, CCInteger } from 'cc';
const { ccclass, property, executeInEditMode} = _decorator;

@ccclass('SpriteRotate')
@executeInEditMode
export class SpriteRotate extends Component {


    @property(CCInteger)
    speed:number = 0

    start () {
       
    }


    update(dt){
        this.node.setRotationFromEuler(
            this.node.eulerAngles.x,
            this.node.eulerAngles.y,
            this.node.eulerAngles.z+dt*this.speed
            )
    }

}
