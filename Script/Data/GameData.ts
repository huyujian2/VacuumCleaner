import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData {

    /**玩家名字 */
    public playerName: string = "我"
    /**已经解锁的皮肤 */
    public unLockSkinList: Array<string> = ["Default"]
    /**玩家的总经验值 */
    public totalExp: number = 0
    /**玩家等级 */
    public level: number = 1
    /**玩家当前等级经验值 */
    public currentLevelExp: number = 0
    /**吸收车的数量 */
    public carNumber: number = 0
    /**吸收人的数量 */
    public peopleNumber: number = 0
    /**当前皮肤 */
    public currentSkin: string = "Default"
    /**连续登录天数 */
    public loginDays: number = 0
    /**最高分数 */
    public maxScore: number = 0
    /**上次登录时间 */
    public lastLoginDay: number = 0
    /**是否开启音乐 */
    public musicEnanle: boolean = true
    /**皮肤兑换券数量 */
    public JYB: number = 0
    /**免费抽奖 */
    public freeLottery: boolean = true
    /**吸收的电脑数 */
    public computerCount:number = 0
    /**吸走的书籍 */
    public bookCount:number = 0
    /**开始游戏指示 */
    public startGameGuide:boolean = false
    /**转盘指示 */
    public lotteryGuide:boolean = false
    /**点击开始转盘指示 */
    public lottteryTouchButton:boolean = false
}
