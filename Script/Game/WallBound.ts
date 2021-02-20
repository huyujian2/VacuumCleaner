import { _decorator, Component, Node, BoxColliderComponent, ITriggerEvent, ModelComponent, CCBoolean, director, Vec2, Vec3 } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { MapManager } from '../Managers/MapManager';
import { GameManager } from './GameManager';
import { WallRubbishItem } from './WallRubbishItem';
const { ccclass, property } = _decorator;

@ccclass('WallBound')
export class WallBound extends Component {

    //true:水平放置；false:垂直放置
    @property(CCBoolean)
    direction: boolean = false

    @property(CCBoolean)
    notCheck: boolean = false

    @property(Node)
    consoleNode: Node = null

    /**墙体激活的最小等级 */
    private mixLevel = 1
    private collider: BoxColliderComponent = null
    public childrenCanUpdate: boolean = false


    start() {
        CustomEventListener.on(Constants.EventName.CanBreaKWall, this.CanBlocKWall, this)
        this.collider = this.node.getComponent(BoxColliderComponent)
        if (this.notCheck) this.collider.enabled = false
    }

    checkState() {
        if (!this.collider) {
            //console.log(this.collider)
            return
        }
        if (this.notCheck || this.childrenCanUpdate) return
        let player = GameManager.Instance.playerList[0].getChildByName("CleanerHead")
        if (player) {
            let dis = Vec3.distance(this.node.worldPosition, player.worldPosition)
            if (dis < 15) {
                //console.log("设置为True")
                this.collider.enabled = true
            } else {
                //console.log("设置为false")
                this.collider.enabled = false
            }
        }
    }

    // private onTrigger (event: ITriggerEvent) {
    //     console.log(event.type, event);
    //     this.collider.enabled = false
    //     this.node.getComponent(ModelComponent).enabled = false
    //     this.node.children.forEach(element => {
    //         element.active = true
    //     })
    // }

    private CanBlocKWall() {
        this.childrenCanUpdate = true
        console.info("可以破坏墙体了")
        if (this.collider) {
            this.collider.enabled = false
        }
        if (this.node) {
            this.node.getComponent(ModelComponent).enabled = false
        }

        for (let wall of this.node.children.values()) {
            wall.active = true
            MapManager.Instance.rubbishItemList.push(wall.getComponent(WallRubbishItem))
        }
    }

    onDestroy() {
        CustomEventListener.off(Constants.EventName.CanBreaKWall, this.CanBlocKWall, this)
    }

}
