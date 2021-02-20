import { _decorator, Component, Node, game } from 'cc';
import { GameData } from './GameData';
const { ccclass, property } = _decorator;
@ccclass('GameStorage')
export class GameStorage
{
    private jsonData = {}
    private gameItem = "game-1.1.0"
    private gameKey = "thiskey-1.0.8"
    static _instance: GameStorage = null;
    public static instance() {
        if (!this._instance) {
            this._instance = new GameStorage();
        }
        return this._instance;
    }

    constructor()
    {
        const currentData = cc.sys.localStorage.getItem(this.gameItem)
        if(currentData !==null && currentData !== undefined && currentData !=="")
        {
            this.jsonData = JSON.parse(currentData)
        }
        else
        {
            this.jsonData = {}
        }
    }

    public gameData: GameData = null

    saveGameData(value:GameData)
    {
        this.jsonData[this.gameKey] = value
        const data = JSON.stringify(this.jsonData)
        cc.sys.localStorage.setItem(this.gameItem,data)
    }

    getGameData():any
    {
        const currentData = cc.sys.localStorage.getItem(this.gameItem)
        if(currentData !== null && currentData !== undefined && currentData !=="")
        {
            this.jsonData = JSON.parse(currentData)
            this.gameData = this.jsonData[this.gameKey]
            if(this.jsonData[this.gameKey] === undefined)
            {
                const gamedata = new GameData()
                return gamedata
            }
            else
            {
                return this.gameData
            }
        }
        else
        {
            const gamedata = new GameData()
            return gamedata
        }
    }
}
