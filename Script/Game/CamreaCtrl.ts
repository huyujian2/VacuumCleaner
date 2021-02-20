import { _decorator, Component, Node, Vec3, find, CameraComponent, CanvasComponent, Vec2 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CameraCtrl")
export class CameraCtrl extends Component {
    public static Instance: CameraCtrl = null
    private viewSize: Vec2 = new Vec2()
    onLoad() {
        if (CameraCtrl.Instance === null) {
            CameraCtrl.Instance = this
        }
        else {
            this.destroy()
            return
        }
    }

    @property(Node)
    followTarget: Node = null

    @property(Vec3)
    public offset: Vec3 = null

    public originalOffset: Vec3 = new Vec3()
    public canvas: CanvasComponent = null
    private targetPos: Vec3 = new Vec3()
    private cameraComt: CameraComponent = null
    private realPos: Vec3 = new Vec3()

    start() {
        this.viewSize = cc.view.getFrameSize()
        this.originalOffset = this.offset.clone()
        this.canvas = find("Canvas").getComponent(CanvasComponent)
        this.cameraComt = this.node.getComponent(CameraComponent)
        console.info("位置偏移是：" + this.offset)
    }

    update(deltaTime: number) {
        if (this.followTarget) {
            this.targetPos = new Vec3(this.followTarget.worldPosition.x - this.offset.x, this.followTarget.worldPosition.y - this.offset.y, this.followTarget.worldPosition.z - this.offset.z)
            Vec3.lerp(this.realPos, this.node.worldPosition, this.targetPos, 0.1)
            this.node.setWorldPosition(this.realPos)
        }
    }

    public getScreenPos(vec3: Vec3) {
        let screenPos = this.cameraComt.convertToUINode(vec3, this.canvas.node)
        return screenPos
    }

    public posIsInScreen(pos: Vec3, moreRange: boolean = false): boolean {
        if (moreRange) {
            let screenPos = this.getScreenPos(pos)
            if (screenPos.x > -720 && screenPos.x < 720 && screenPos.y > -1000 && screenPos.y < 600) {
                return true
            }
            else {
                return false
            }
        }
        else {
            let screenPos = this.getScreenPos(pos)
            if (screenPos.x > -360 && screenPos.x < 360 && screenPos.y > -640 && screenPos.y < 400) {
                return true
            }
            else {
                return false
            }
        }
    }

    onDestroy() {
        CameraCtrl.Instance = null
    }
}
