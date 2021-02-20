import { _decorator, Component, Node } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { GameData } from '../Data/GameData';
const { ccclass, property } = _decorator;


@ccclass('Achievement')
export class Achievement {

    /**等级 */
    private level: number = 1

    /**此等级的分数 */
    private currentLevelScore: number = 0

    /**总分数 */
    private totalScore: number = 0

    /**获取当前等级 */
    public get Level() {
        return this.level
    }
    /**设置等级 */
    public set Level(level: number) {
        this.level = level
    }

    /**获取当前等级分数 */
    public get CurrentLevelScore() {
        return this.currentLevelScore
    }
    /**获取总分数 */
    public get TotalScore() {
        return this.totalScore
    }

    /**设置分数 */
    public set Score(score: number) {
        this.totalScore += score
        var residual = this.totalScore
        for (var i = 0; i < Constants.AchievementLevelInfo.Level.length; i++) {
            residual -= Constants.AchievementLevelInfo.Level[i].Score
            if (residual > 0) {
                if (this.level <= Constants.AchievementLevelInfo.Level[i].Level) {
                    if (i + 1 >= 16) {
                        this.level = Constants.AchievementLevelInfo.Level[15].Level
                    } else {
                        this.level = Constants.AchievementLevelInfo.Level[i + 1].Level

                    }
                }
                this.currentLevelScore = residual
            }
            else if (residual === 0) {
                if (i + 1 >= 16) {
                    this.level = Constants.AchievementLevelInfo.Level[15].Level
                } else {
                    this.level = Constants.AchievementLevelInfo.Level[i + 1].Level
                }
                this.currentLevelScore = 0
                break
            }
            else {
                if (this.level === 1) {
                    this.currentLevelScore = this.totalScore
                }
                else {
                    residual += Constants.AchievementLevelInfo.Level[i].Score
                    this.currentLevelScore = residual
                    this.level = Constants.AchievementLevelInfo.Level[i].Level
                }
                break
            }
        }
    }

    getLoginDay(gamedate: GameData) {

    }
}


