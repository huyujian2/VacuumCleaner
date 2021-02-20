import { _decorator, Component, Node, LabelComponent, SpriteComponent, loader, SpriteFrame, tween, director, math } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { GameInfo } from '../Data/GameInfo';
import { GameStorage } from '../Data/GameStorage';
import { AiConfigManager } from '../Managers/AiConfigManager';
import { SkinManager } from '../Managers/SkinManager';
const { ccclass, property } = _decorator;

@ccclass('LoadPage')
export class LoadPage extends Component {

    @property(LabelComponent)
    playerName: LabelComponent = null

    @property(LabelComponent)
    AI1Name: LabelComponent = null

    @property(LabelComponent)
    AI2Name: LabelComponent = null

    @property(LabelComponent)
    AI3Name: LabelComponent = null

    @property(LabelComponent)
    playerNameBlank: LabelComponent = null

    @property(LabelComponent)
    AI1NameBlank: LabelComponent = null

    @property(LabelComponent)
    AI2NameBlank: LabelComponent = null

    @property(LabelComponent)
    AI3NameBlank: LabelComponent = null

    @property(SpriteComponent)
    AI1Sprite: SpriteComponent = null

    @property(SpriteComponent)
    AI2Sprite: SpriteComponent = null

    @property(SpriteComponent)
    AI3Sprite: SpriteComponent = null

    @property(SpriteComponent)
    AI1Progress: SpriteComponent = null

    @property(SpriteComponent)
    AI2Progress: SpriteComponent = null

    @property(SpriteComponent)
    AI3Progress: SpriteComponent = null

    @property(LabelComponent)
    tipLabel: LabelComponent = null

    @property(LabelComponent)
    tipLabelBlank: LabelComponent = null

    playerFinish: boolean = false
    AI1Finish: boolean = false
    AI2Finish: boolean = false
    AI3Finish: boolean = false

    start() {
        let index = math.random() * 4
        if (index == 4) index = 3
        index = Math.ceil(index)
        this.tipLabel.string = Constants.tipLabel.Tip[index]
        this.tipLabelBlank.string = Constants.tipLabel.Tip[index]


        this.playerName.string = GameInfo.Instance().gameDate.playerName
        this.playerNameBlank.string = GameInfo.Instance().gameDate.playerName
        let aiConfig = AiConfigManager.getInstance()
        this.AI1Sprite.node.active = false
        this.AI2Sprite.node.active = false
        this.AI3Sprite.node.active = false

        loader.load(aiConfig.AI1.headPhoto, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                sprite.texture = texture._texture
                this.AI1Sprite.spriteFrame = sprite
            }
        })

        loader.load(aiConfig.AI2.headPhoto, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                sprite.texture = texture._texture
                this.AI2Sprite.spriteFrame = sprite
            }
        })

        loader.load(aiConfig.AI3.headPhoto, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                sprite.texture = texture._texture
                this.AI3Sprite.spriteFrame = sprite
            }
        })

        let seachTime1 = Math.random() * 4
        let seachTime2 = Math.random() * 4
        let seachTime3 = Math.random() * 4

        let loadTime1 = Math.random() * 6
        let loadTime2 = Math.random() * 6
        let loadTime3 = Math.random() * 6

        tween(this.AI1Progress)
            .delay(seachTime1)
            .call(() => {
                this.AI1Name.string = aiConfig.AI1.name
                this.AI1NameBlank.string = aiConfig.AI1.name
                this.AI1Sprite.node.active = true
            })
            .to(loadTime1, { fillRange: 1 })
            .call(() => {
                this.AI1Finish = true
                this.loadFinish()
            })
            .start()

        tween(this.AI2Progress)
            .delay(seachTime2)
            .call(() => {
                this.AI2Name.string = aiConfig.AI2.name
                this.AI2NameBlank.string = aiConfig.AI2.name
                this.AI2Sprite.node.active = true
            })
            .to(loadTime2, { fillRange: 1 })
            .call(() => {
                this.AI2Finish = true
                this.loadFinish()
            })
            .start()

        tween(this.AI3Progress)
            .delay(seachTime3)
            .call(() => {
                this.AI3Name.string = aiConfig.AI3.name
                this.AI3NameBlank.string = aiConfig.AI3.name
                this.AI3Sprite.node.active = true
            })
            .to(loadTime3, { fillRange: 1 })
            .call(() => {
                this.AI3Finish = true
                this.loadFinish()
            })
            .start()
    }

    loadFinish() {
        if (this.AI1Finish && this.AI2Finish && this.AI3Finish && this.playerFinish) {
            GameInfo.Instance().gameDate.currentSkin = SkinManager.Instance().currentSkin
            GameStorage.instance().saveGameData(GameInfo.Instance().gameDate)
            director.loadScene("GameScene")
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
