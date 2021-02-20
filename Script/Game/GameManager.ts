import { _decorator, Component, Node, find, PhysicsSystem, instantiate, loader } from 'cc';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { Constants } from '../CustomEventListener/Constants';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { AiConfigManager } from '../Managers/AiConfigManager';
import { SkinManager } from '../Managers/SkinManager';
import { GameUI } from '../UI/GameUI';
import { PlayerUIInfo } from '../UI/PlayerUIInfo';
import { ObjectPool } from '../Uitis/ObjectPool';
import { CameraCtrl } from './CamreaCtrl';
import { Player } from './Player';
import { PlayerAI } from './PlayerAI';
import { RubbishItem } from './RubbishItem';
import { WallRubbishItem } from './WallRubbishItem';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager = null

    @property([Node])
    public playerList: Array<Node> = []

    @property([Node])
    public spwnPoint: Array<Node> = []

    public wackUp: Map<string, Node> = new Map<string, Node>()

    public Enable: Map<string, Node> = new Map<string, Node>()

    public timeOver: boolean = false

    public GameUI: GameUI = null

    onLoad() {
        if (GameManager.Instance === null) {

            GameManager.Instance = this
        }
        else {
            this.destroy()
            return
        }
    }

    start() {
        CustomEventListener.on(Constants.EventName.SendPosToPlayer, this.sendPosToPlays, this)
        PhysicsSystem.instance.physicsWorld.setGravity(cc.v3(0, -30, 0))
        this.GameUI = find("Canvas").getComponent(GameUI)
        // for(var i = 0;i<find("Map").children.length;i++)
        // {
        //     MapManager.Instance.setGroup(find("Map").children[i])
        // }
        this.initPlayers()
    }

    initPlayers() {
        let spwnList = [0, 1, 2, 3]
        let spwn1 = Math.random() * 3
        let selfSpwn = spwnList.splice(spwn1, 1)
        console.info(spwnList)
        console.info(Constants.SkinInfo.Skin.length)
        //初始化自己
        let player1 = instantiate(loader.getRes("Cleaner/" + SkinManager.Instance().currentSkin)) as Node
        player1.setParent(this.spwnPoint[selfSpwn[0]])
        player1.setWorldPosition(this.spwnPoint[selfSpwn[0]].worldPosition)
        CameraCtrl.Instance.followTarget = player1.getChildByName("CleanerHead")
        let playerUiInfo1 = instantiate(loader.getRes("UI/PlayInfo")) as Node
        playerUiInfo1.setParent(find("Canvas"))
        playerUiInfo1.setSiblingIndex(1)
        let player1Comt = player1.addComponent(Player)
        player1Comt.palyerUiInfo = playerUiInfo1.getComponent(PlayerUIInfo)
        player1Comt.rankInfo = this.GameUI.rankInfoList[0]
        player1Comt.initPlayUI()
        this.playerList.push(player1)
        //初始化AI1
        let player2 = instantiate(loader.getRes(AiConfigManager.getInstance().AI1.skinPath)) as Node
        player2.setParent(this.spwnPoint[spwnList[0]])
        player2.setWorldPosition(this.spwnPoint[spwnList[0]].worldPosition)
        player2.getChildByName("CleanerHead").getComponent(CleanerHead).isAI = true
        //CameraCtrl.Instance.followTarget = player2.getChildByName("CleanerHead")
        let playerUiInfo2 = instantiate(loader.getRes("UI/PlayInfo")) as Node
        playerUiInfo2.setParent(find("Canvas"))
        let player2Comt = player2.addComponent(PlayerAI)
        player2Comt.playerConfig = AiConfigManager.getInstance().AI1
        player2Comt.playerUIInfo = playerUiInfo2.getComponent(PlayerUIInfo)
        player2Comt.rankInfo = this.GameUI.rankInfoList[1]
        player2Comt.initPlayUI()
        this.playerList.push(player2)
        //初始化AI2
        let player3 = instantiate(loader.getRes(AiConfigManager.getInstance().AI2.skinPath)) as Node
        player3.setParent(this.spwnPoint[spwnList[1]])
        player3.setWorldPosition(this.spwnPoint[spwnList[1]].worldPosition)
        player3.getChildByName("CleanerHead").getComponent(CleanerHead).isAI = true
        //CameraCtrl.Instance.followTarget = player3.getChildByName("CleanerHead")
        let playerUiInfo3 = instantiate(loader.getRes("UI/PlayInfo")) as Node
        playerUiInfo3.setParent(find("Canvas"))
        let player3Comt = player3.addComponent(PlayerAI)
        player3Comt.playerConfig = AiConfigManager.getInstance().AI2
        player3Comt.playerUIInfo = playerUiInfo3.getComponent(PlayerUIInfo)
        player3Comt.getComponent(PlayerAI).rankInfo = this.GameUI.rankInfoList[2]
        player3Comt.getComponent(PlayerAI).initPlayUI()
        this.playerList.push(player3)
        //初始化AI3
        let player4 = instantiate(loader.getRes(AiConfigManager.getInstance().AI3.skinPath)) as Node
        player4.setParent(this.spwnPoint[spwnList[2]])
        player4.setWorldPosition(this.spwnPoint[spwnList[2]].worldPosition)
        player4.getChildByName("CleanerHead").getComponent(CleanerHead).isAI = true
        let playerUiInfo4 = instantiate(loader.getRes("UI/PlayInfo")) as Node
        playerUiInfo4.setParent(find("Canvas"))
        let player4Comt = player4.addComponent(PlayerAI)
        player4Comt.playerConfig = AiConfigManager.getInstance().AI3
        player4Comt.playerUIInfo = playerUiInfo4.getComponent(PlayerUIInfo)
        player4Comt.rankInfo = this.GameUI.rankInfoList[3]
        player4Comt.initPlayUI()
        this.playerList.push(player4)
    }

    setWakeUp(uuid, node) {
        if (!this.wackUp.has(uuid)) {
            this.wackUp.set(uuid, node)
        }
    }

    delWakeUp(uuid) {
        if (this.wackUp.has(uuid)) {
            this.wackUp.delete(uuid)
        }
    }

    setEnable(uuid, node) {
        if (!this.Enable.has(uuid)) {
            this.Enable.set(uuid, node)
        }
    }

    delEnable(uuid) {
        if (this.Enable.has(uuid)) {
            this.Enable.delete(uuid)
        }
    }

    /**发送此节点的位置给AI们 */
    sendPosToPlays(node: Node) {
        if (!GameManager.Instance.timeOver) {
            for (var i = 1; i < this.playerList.length; i++) {
                if (node.getComponent(RubbishItem) !== null) {
                    if (this.playerList[i].getComponent(PlayerAI).currentLevel === node.getComponent(RubbishItem).level) {
                        this.playerList[i].getComponent(PlayerAI).receivePos(node)
                    }
                }

                if (node.getComponent(WallRubbishItem) !== null) {
                    if (this.playerList[i].getComponent(PlayerAI).currentLevel === node.getComponent(WallRubbishItem).level) {
                        this.playerList[i].getComponent(PlayerAI).receivePos(node)
                    }
                }
            }
        }
    }

    onDestroy() {
        GameManager.Instance = null
        CustomEventListener.off(Constants.EventName.SendPosToPlayer, this.sendPosToPlays, this)
        ObjectPool.Instance().releasePool()
    }

}
