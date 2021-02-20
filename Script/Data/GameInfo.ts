import { _decorator, Component, Node } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { Achievement } from '../Game/Achievement';
import { GameData } from './GameData';
import { GameStorage } from './GameStorage';
const { ccclass, property } = _decorator;

@ccclass('GameInfo')
export class GameInfo {

    //单例模式
    private static gameInfo: GameInfo
    public static Instance(): GameInfo {
        if (this.gameInfo == null) {
            this.gameInfo = new GameInfo()
        }
        return GameInfo.gameInfo
    }

    constructor() {
        this.gameDate = GameStorage.instance().getGameData()
        this.achievement.Score = this.gameDate.totalExp
        this.gameDate.currentLevelExp = this.achievement.CurrentLevelScore
        this.gameDate.totalExp = this.achievement.TotalScore
        this.gameDate.level = this.achievement.Level
    }
    /**游戏数据 */
    public gameDate: GameData = new GameData()
    /**成就系统 */
    public achievement: Achievement = new Achievement()
    /**经验值 */
    public rewardExp: number = 0

    /**增加经验值 */
    public AddExp(num: number) {
        this.achievement.Score = num
        this.gameDate.currentLevelExp = this.achievement.CurrentLevelScore
        this.gameDate.totalExp = this.achievement.TotalScore
        this.gameDate.level = this.achievement.Level
        GameStorage.instance().saveGameData(this.gameDate)
    }
    /**更新登录天数 */
    public updateLoginDay() {
        console.info(this.gameDate)
        let time = new Date()
        let day = time.getDate()
        if (this.gameDate.lastLoginDay !== day) {
            this.gameDate.loginDays += 1
            this.gameDate.lastLoginDay = day
            GameStorage.instance().saveGameData(this.gameDate)
            console.info(this.gameDate)
        }
    }

    public getCurrentSkin() {
        let skin = this.gameDate.currentSkin
        if (skin) {
            for (let i = 0; i < Constants.SkinInfo.Skin.length; i++) {
                if (skin == Constants.SkinInfo.Skin[i].EnglishName) {
                    return skin
                }
            }
            return "Default"
        } else {
            return "Default"
        }
    }

}
