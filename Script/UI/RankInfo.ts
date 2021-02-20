import { _decorator, Component, Node, LabelComponent, Vec3, CCInteger, SpriteComponent, UITransformComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RankInfo')
export class RankInfo extends Component 
{
    /**当前分数 */
    public score:number = 0
    /**玩家名字 */
    public playerName:string = ""
    /**显示文字 */
    private showLabel:LabelComponent = null
    /**背景颜色 */
    public bgColor = null

    private bgUiTransformTop:UITransformComponent = null

    private bgUiTransformButtom:UITransformComponent= null

    private UITransformOriginalWidth:number = 0

    start ()
    {
        this.showLabel = this.node.getChildByPath("BG/BG/Score").getComponent(LabelComponent)
        this.bgColor = this.node.getChildByPath("BG/BG").getComponent(SpriteComponent).color
        this.bgUiTransformTop = this.node.getChildByPath("BG/BG").getComponent(UITransformComponent)
        this.bgUiTransformButtom = this.node.getChildByPath("BG").getComponent(UITransformComponent)
        this.UITransformOriginalWidth = this.bgUiTransformTop.width
    }

    update()
    {
        this.showLabel.string = this.score.toString()+"  分  -  "+this.playerName
        this.bgUiTransformTop.width = this.UITransformOriginalWidth + this.score/95
        this.bgUiTransformButtom.width = this.UITransformOriginalWidth + this.score/95
    }

    /**改变Rank的位置 */
    public changeRankPos(pos:Vec3)
    {
        cc.tween(this.node).repeat(1,cc.tween()
        .to(1,{position:pos},{easing:"sineOut"}))
        .start()
    }

    public reomoveSelf()
    {
        this.node.getChildByPath("BG/BG").getComponent(SpriteComponent).color = cc.color(130,130,130)
    }
}
