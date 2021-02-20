import { _decorator, Component, Node, Color } from 'cc';
import { GameInfo } from '../Data/GameInfo';
import { GameStorage } from '../Data/GameStorage';
const { ccclass, property } = _decorator;

@ccclass('SkinManager')
export class SkinManager {

    //单例模式
    private static skinManager: SkinManager
    public static Instance(): SkinManager {
        if (this.skinManager == null) {
            this.skinManager = new SkinManager()
        }
        return SkinManager.skinManager
    }

    public currentSkin: string = "Default"
    public unLockColor: Color = cc.color(255, 255, 255)
    public LockColor: Color = cc.color(201, 15, 15)


    public getUnLockStrCondition(name: string) {
        switch (name) {
            // case "":
            //     return ""           
            // case "牛仔":
            //     return this.CowBoy()
            // case "土著人":
            //     return this.Aborigin()
            // case "我是女生":
            //     return this.IAmGirl()
            // case "白雪公主":
            //     return this.SnowWhite()
            // case "马里奥":
            //     return this.Mario()
            // case "小王子":
            //     return this.Princekin()
            // case "胡桃夹子":
            //     return this.Nutcracker()
            // case "慕容紫英":
            //     return this.MuRongZiYing()
            // case "酒吞童子":
            //     return this.JiuTunTongZi()
            // case "我爱罗":
            //     return this.WoAiLuo()
            // case "怪物":
            //     return this.Monster()
            case "瓦吸":
                return ""
            case "Vaco":
                return this.Vaco()
            case "瓦吸小子":
                return this.Kid()
            case "瓦吸雷吉":
                return this.Reggae()
            case "懒懒":
                return this.Lazy()
            case "维京":
                return this.Viking()
            case "足球瓦吸":
                return this.NFL()
            case "羽翼":
                return this.Wing()
            case "朋克":
                return this.Punk()
            case "圣诞老人":
                return this.Santa()
            case "宇航员":
                return this.Astronaut()
            case "下士":
                return this.Corporal()
            case "毕业生":
                return this.Graduate()
            case "报童":
                return this.PaperBoy()
            case "金属":
                return this.Metal()
            case "警察":
                return this.OuiPolice()
            case "号兵":
                return this.Trump()
            default:
                break;
        }
    }

    public getUnLockCondition(name: string) {
        //return true
        console.info(name)
        switch (name) {
            // case "":
            //     return ""           
            // case "CowBoy":
            //     return this.CowBoyCondition()
            // case "Aborigin":
            //     return this.AboriginCondition()
            // case "IAmGirl":
            //     return this.IAmGirlCondition()
            // case "SnowWhite":
            //     return this.SnowWhiteCondition()
            // case "Mario":
            //     return this.MarioCondition()
            // case "Princekin":
            //     return this.PrincekinCondition()
            // case "Nutcracker":
            //     return this.NutcrackerCondition()
            // case "MuRongZiYing":
            //     return this.MuRongZiYingCondition()
            // case "JiuTunTongZi":
            //     return this.JiuTunTongZiCondition()
            // case "WoAiLuo":
            //     return this.WoAiLuoCondition()
            // case "Monster":
            //     return this.MonsterCondition()
            case "Default":
                return ""
            case "Vaco":
                return this.VacoCondition()
            case "Kid":
                return this.KidCondition()
            case "Reggae":
                return this.ReggaeCondition()
            case "Lazy":
                return this.LazyCondition()
            case "Viking":
                return this.VikingCondition()
            case "NFL":
                return this.NFLCondition()
            case "Wing":
                return this.WingCondition()
            case "Punk":
                return this.PunkCondition()
            case "Santa":
                return this.SantaCondition()
            case "Astronaut":
                return this.AstronautCondition()
            case "Corporal":
                return this.CorporalCondition()
            case "Graduate":
                return this.GraduateCondition()
            case "PaperBoy":
                return this.PaperBoyCondition()
            case "Metal":
                return this.MetalCondition()
            case "OuiPolice":
                return this.OuiPoliceCondition()
            case "Trump":
                return this.TrumpCondition()
            default:
                break;
        }
    }


    private CowBoy() {
        return GameInfo.Instance().gameDate.loginDays + "/2"
    }

    private Aborigin() {
        return GameInfo.Instance().gameDate.level + "/2"
    }

    private IAmGirl() {
        return GameInfo.Instance().gameDate.loginDays + "/3"
    }

    private SnowWhite() {
        return GameInfo.Instance().gameDate.carNumber + "/500"
    }

    private Mario() {
        return GameInfo.Instance().gameDate.level + "/3"
    }

    private Princekin() {
        return GameInfo.Instance().gameDate.peopleNumber + "/500"
    }

    private Nutcracker() {
        return GameInfo.Instance().gameDate.maxScore + "/2000"
    }

    private MuRongZiYing() {
        return GameInfo.Instance().gameDate.carNumber + "/5000"
    }

    private JiuTunTongZi() {
        return GameInfo.Instance().gameDate.level + "/5"
    }

    private WoAiLuo() {
        return GameInfo.Instance().gameDate.maxScore + "/5000"
    }

    private Monster() {
        return GameInfo.Instance().gameDate.maxScore + "/5000"
    }




    private Vaco() {
        return GameInfo.Instance().gameDate.loginDays + "/2"
    }
    private Kid() {
        return GameInfo.Instance().gameDate.level + "/2"
    }
    private Reggae() {
        return GameInfo.Instance().gameDate.JYB + "/1"
    }
    private Lazy() {
        return GameInfo.Instance().gameDate.JYB + "/1"
    }
    private Viking() {
        return GameInfo.Instance().gameDate.loginDays + "/3"
    }
    private NFL() {
        return GameInfo.Instance().gameDate.computerCount + "/100"
    }
    private Wing() {
        return GameInfo.Instance().gameDate.maxScore + "/2000"
    }
    private Punk() {
        return GameInfo.Instance().gameDate.maxScore + "/5000"
    }
    private Santa() {
        return GameInfo.Instance().gameDate.level + "/5"
    }
    private Astronaut() {
        return ""
    }
    private Corporal() {
        return GameInfo.Instance().gameDate.bookCount + "/500"
    }
    private Graduate() {
        return GameInfo.Instance().gameDate.JYB + "/1"
    }
    private PaperBoy() {
        return GameInfo.Instance().gameDate.JYB + "/1"
    }
    private Metal() {
        return GameInfo.Instance().gameDate.maxScore + "/7000"
    }
    private OuiPolice() {
        return GameInfo.Instance().gameDate.level + "/10"
    }
    private Trump() {
        return GameInfo.Instance().gameDate.JYB + "/1"
    }



    //是否可以解锁
    private CowBoyCondition() {
        console.info(GameInfo.Instance().gameDate.loginDays >= 2)
        return GameInfo.Instance().gameDate.loginDays >= 2
    }

    private AboriginCondition() {
        return GameInfo.Instance().gameDate.level >= 2
    }

    private IAmGirlCondition() {
        return GameInfo.Instance().gameDate.loginDays >= 3
    }

    private SnowWhiteCondition() {
        return GameInfo.Instance().gameDate.carNumber >= 500
    }

    private MarioCondition() {
        return GameInfo.Instance().gameDate.level >= 3
    }

    private PrincekinCondition() {
        return GameInfo.Instance().gameDate.peopleNumber >= 500
    }

    private NutcrackerCondition() {
        return GameInfo.Instance().gameDate.maxScore >= 2000
    }

    private MuRongZiYingCondition() {
        return GameInfo.Instance().gameDate.carNumber >= 5000
    }

    private JiuTunTongZiCondition() {
        return GameInfo.Instance().gameDate.level >= 5
    }

    private WoAiLuoCondition() {
        return GameInfo.Instance().gameDate.maxScore >= 5000
    }

    private VacoCondition() {

        return GameInfo.Instance().gameDate.loginDays >= 2
    }

    private KidCondition() {
        return GameInfo.Instance().gameDate.level >= 2
    }
    private ReggaeCondition() {

        if (GameInfo.Instance().gameDate.JYB >= 1) {
            GameInfo.Instance().gameDate.JYB -= 1
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            return true
        } else {
            return false
        }
    }
    private LazyCondition() {

        if (GameInfo.Instance().gameDate.JYB >= 1) {
            GameInfo.Instance().gameDate.JYB -= 1
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            return true
        } else {
            return false
        }
    }
    private VikingCondition() {

        return GameInfo.Instance().gameDate.loginDays >= 3
    }
    private NFLCondition() {

        return GameInfo.Instance().gameDate.computerCount >= 100
    }
    private WingCondition() {

        return GameInfo.Instance().gameDate.maxScore >= 2000
    }
    private PunkCondition() {

        return GameInfo.Instance().gameDate.maxScore >= 5000
    }
    private SantaCondition() {

        return GameInfo.Instance().gameDate.level >= 5
    }
    private AstronautCondition() {

        return false
    }
    private CorporalCondition() {

        return GameInfo.Instance().gameDate.bookCount >= 500
    }
    private GraduateCondition() {

        if (GameInfo.Instance().gameDate.JYB >= 1) {
            GameInfo.Instance().gameDate.JYB -= 1
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            return true
        } else {
            return false
        }
    }
    private PaperBoyCondition() {

        if (GameInfo.Instance().gameDate.JYB >= 1) {
            GameInfo.Instance().gameDate.JYB -= 1
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            return true
        } else {
            return false
        }
    }
    private MetalCondition() {

        return GameInfo.Instance().gameDate.maxScore >= 7000
    }
    private OuiPoliceCondition() {

        return GameInfo.Instance().gameDate.level >= 10
    }
    private TrumpCondition() {

        return GameInfo.Instance().gameDate.JYB >= 1
    }
}
