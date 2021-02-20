import { _decorator, Component, Node, random } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { AiConfig } from '../Data/AiConfig';
import { ConfigManager } from './ConfigManager';
const { ccclass, property } = _decorator;

@ccclass('AiConfigManager')
export class AiConfigManager {

    private static AiConfigManager: AiConfigManager
    public static getInstance(): AiConfigManager {
        if (this.AiConfigManager == null) {
            this.AiConfigManager = new AiConfigManager()
        }
        return AiConfigManager.AiConfigManager
    }

    public AI1: AiConfig = null

    public AI2: AiConfig = null

    public AI3: AiConfig = null

    public refalshConfig() {
        let skinLength = Constants.SkinInfo.Skin.length
        
        this.AI1 = new AiConfig()
        let skinIndex1 = Math.ceil(Math.random() * skinLength - 1)
        this.AI1.skinPath = "Cleaner/" + Constants.SkinInfo.Skin[skinIndex1].EnglishName
        this.AI1.star = Math.ceil(Math.random() * 16) + 1
        this.AI1.name = ConfigManager.getInstance().getRobotName()
        let photoIndex1 = Math.ceil(Math.random() * 95)
        this.AI1.headPhoto = "https://xiaoyudi-1259481479.cos.ap-guangzhou.myqcloud.com/BenFei/VacuumCleaner/ProfilePhoto/" + photoIndex1.toString() + ".jpg"

        this.AI2 = new AiConfig()
        let skinIndex2 = Math.ceil(Math.random() * skinLength - 1)
        this.AI2.skinPath = "Cleaner/" + Constants.SkinInfo.Skin[skinIndex2].EnglishName
        this.AI2.star = Math.ceil(Math.random() * 16) + 1
        this.AI2.name = ConfigManager.getInstance().getRobotName()
        let photoIndex2 = Math.ceil(Math.random() * 95)
        this.AI2.headPhoto = "https://xiaoyudi-1259481479.cos.ap-guangzhou.myqcloud.com/BenFei/VacuumCleaner/ProfilePhoto/" + photoIndex2.toString() + ".jpg"

        this.AI3 = new AiConfig()
        let skinIndex3 = Math.ceil(Math.random() * skinLength - 1)
        this.AI3.skinPath = "Cleaner/" + Constants.SkinInfo.Skin[skinIndex3].EnglishName
        this.AI3.star = Math.ceil(Math.random() * 16) + 1
        this.AI3.name = ConfigManager.getInstance().getRobotName()
        let photoIndex3 = Math.ceil(Math.random() * 95)
        this.AI3.headPhoto = "https://xiaoyudi-1259481479.cos.ap-guangzhou.myqcloud.com/BenFei/VacuumCleaner/ProfilePhoto/" + photoIndex3.toString() + ".jpg"
        console.log(skinIndex1, skinIndex2, skinIndex3)
    }

}
