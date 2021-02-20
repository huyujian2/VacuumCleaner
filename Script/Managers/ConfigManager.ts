import { ConeTwistConstraint } from '@cocos/cannon';
import { _decorator, Component, Node, loader, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConfigManager')
export class ConfigManager {

    private static configManager: ConfigManager
    public static getInstance(): ConfigManager {
        if (this.configManager == null) {
            this.configManager = new ConfigManager()
        }
        return ConfigManager.configManager
    }

    private robotsPath = "Config/robots"
    private robotsConfig: any = null


    init() {
        cc.loader.loadRes(this.robotsPath, (err, jsonAsset) => {
            if (err) { return }
            this.robotsConfig = jsonAsset
        })
    }

    getRobotsConfig() {
        if (this.robotsConfig) {
            return this.robotsConfig
        } else {
            return null
        }
    }

    getRobotName(): string {
        let data = this.robotsConfig.json
        let index = Math.ceil(Math.random() * (data.length - 1))
        let name = data[index][0]
        return name
    }

    getRobotTexPath(): string {
        //let remoteUrl = "https://thirdwx.qlogo.cn/mmopen/vi_32/$robot_o_Rbc4jCDGOwohBumrDGgLjxDETA.jpg/132"
        let data = this.robotsConfig.json
        let index = Math.ceil(Math.random() * (data.length - 1))
        let path =  "http://thirdwx.qlogo.cn/mmopen/vi_32/"+data[index][1]+"/132"
        return path
        // loader.load({ url: remoteUrl, tpye: "jpg" }, (err, texture) => {
        //     if (err) {
        //         return null
        //     } else {
        //         let sprite = new SpriteFrame()
        //         sprite.texture = texture._texture
        //         return sprite
        //     }
        // })
    }
}
