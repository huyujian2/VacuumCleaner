import { _decorator, Component, Node, tween, instantiate, loader, find } from 'cc';
import { WallBound } from '../Game/WallBound';
import { MapManager } from './MapManager';
const { ccclass, property } = _decorator;

@ccclass('WallManager')
export class WallManager extends Component {

    @property([Node])
    wallParent: Array<Node> = []

    private wallLsit = []

    private enableIndex = 0

    start() {
        let walls = instantiate(loader.getRes("GameMap/Walls")) as Node
        walls.setParent(find("Map"))
        walls.children.forEach(element => {
            this.wallParent.push(element)
            element.children.forEach(elementSub => {
                this.wallLsit.push(elementSub)
            })
        })
        this.scheduleOnce(() => {
            // tween(this.node).repeat(this.wallLsit.length - 1, tween(this.node)
            //     .call(() => { this.enabledWall() }).delay(0.2).start()).start()
            tween(this.node).repeatForever(tween(this.node)
                .call(() => {
                    this.wallParent.forEach(element => {
                        if (element) {
                            element.getComponent(WallBound).checkState()
                        }
                    })
                }).delay(0.4).start()).start()
        }, 0)
    }

    enabledWall() {
        this.wallLsit[this.enableIndex].active = true
        this.enableIndex += 1
        if (this.wallLsit.length === this.enableIndex) {
            this.wallParent.forEach(element => {
                MapManager.Instance.setGroup(element)
            })
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
