import { _decorator, Component, Node, LabelComponent, Vec3 } from 'cc';
import { RankInfo } from './RankInfo';
const { ccclass, property } = _decorator;

@ccclass('RankBar')
export class RankBar extends Component {

    public rankInfo:RankInfo = null

    private originalPos:Vec3 = new Vec3()

    public startTime:number = 0
    

    start () {
        this.originalPos = this.node.getWorldPosition()
        this.node.getChildByName("ScoreAndName").getComponent(LabelComponent).string = this.rankInfo.score+ "分   " + this.rankInfo.playerName
        this.node.getChildByName("ScoreAndName").getComponent(LabelComponent).color.set(this.rankInfo.bgColor)
        this.node.setWorldPosition(this.originalPos.x,-200,this.originalPos.z)
        this.node.active = true
        this.scheduleOnce(this.PlayAnim,this.startTime)
    }

    PlayAnim()
    {
        cc.tween(this.node).repeat(1,cc.tween()
        .to(1,{worldPosition:this.originalPos},{easing:"sineOut"}))
        .start()
    }
   
}
