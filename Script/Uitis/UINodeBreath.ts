import { _decorator, Component, Node, tween, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UINodeBreath')
export class UINodeBreath extends Component {

    @property(CCInteger)
    frequency: number = 0.2

    start() {
        tween(this.node)
            .to(this.frequency, { scale: cc.v3(1.15, 1.15, 1.15) })
            .to(this.frequency, { scale: cc.v3(1, 1, 1) })
            .union()
            .repeatForever()
            .start()
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
