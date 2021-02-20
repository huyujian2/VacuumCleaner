import { _decorator, Component, Node } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
const { ccclass, property } = _decorator;


@ccclass('GameUpgrade')
export class GameUpgrade{

    /**等级 */
    private level:number = 1

    /**此等级的分数 */
    private currentLevelScore:number = 0

    /**总分数 */
    private totalScore:number = 0

    /**获取当前等级 */
    public get Level()
    {
        return this.level
    }
    /**设置等级 */
    public set Level(level:number)
    {
        this.level = level
    }

    /**获取当前等级分数分数 */
    public get CurrentLevelScore()
    {
        return this.currentLevelScore
    }
    /**获取总分数 */
    public get TotalScore()
    {
        return this.totalScore
    }

    /**设置分数 */
    public set Score(score:number)
    {
        this.totalScore += score
        var residual = this.totalScore
        for(var i = 0;i<Constants.GameLevelInfo.Level.length;i++)
        {
            residual -= Constants.GameLevelInfo.Level[i].Score
            if(residual>0)
            {
                //console.info("剩余的大于0")
                if(this.level <= Constants.GameLevelInfo.Level[i].Level)
                {
                    this.level = Constants.GameLevelInfo.Level[i+1].Level
                }
                this.currentLevelScore = residual
            }
            else if(residual === 0)
            {
                this.level = Constants.GameLevelInfo.Level[i+1].Level
                this.currentLevelScore = 0
                break
            }
            else
            {
                //console.info("剩余的小于0")
                if(this.level === 1)
                {
                    this.currentLevelScore = this.totalScore
                }
                else
                {
                    residual += Constants.GameLevelInfo.Level[i].Score
                    this.currentLevelScore = residual
                    this.level = Constants.GameLevelInfo.Level[i].Level
                }
                break
            }
        }
    }
}


