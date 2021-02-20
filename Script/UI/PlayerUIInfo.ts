import { _decorator, Component, Node, CameraComponent, Vec3, find, ProgressBarComponent, LabelComponent, Vec2, SpriteComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerUIInfo')
export class PlayerUIInfo extends Component {
    /**等级进度条 */
    @property(ProgressBarComponent)
    levelBar:ProgressBarComponent = null
    /**等级百分比Label */
    @property(LabelComponent)
    progressLabel:LabelComponent = null
    /**玩家头像 */
    @property(SpriteComponent)
    playerIcon:SpriteComponent = null
    /**相机组件 */
    private camera:CameraComponent = null
    /**跟随节点 */
    public UIFollowNode:Node = null
    /**屏幕坐标 */
    private screenPos:Vec3 = new Vec3()

    private viewSize:Vec2 = new Vec2()

    private canvasNode:Node = null

    start ()
    {
        this.camera = find("Camera").getComponent(CameraComponent)
        this.canvasNode = find("Canvas")
        this.viewSize = cc.view.getFrameSize()
    }

    update()
    {
        if(this.UIFollowNode !== null && this.node.active === true)
        {
            this.screenPos = this.camera.convertToUINode(this.UIFollowNode.worldPosition,this.node.parent)
            this.screenPos.y += this.viewSize.y*0.1
            this.node.setPosition(this.screenPos)
        }
    }

    public updateProgressBar(num:number)
    {
        this.levelBar.progress = num
        this.progressLabel.string = (num*100).toFixed(0)+"%"
        this.progressLabel.node.children[0].getComponent(LabelComponent).string = (num*100).toFixed(0)+"%"
    }
}
