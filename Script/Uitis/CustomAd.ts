import { _decorator, Component, Node, LabelComponent, SpriteComponent, loader, SpriteFrame } from 'cc';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
const { ccclass, property } = _decorator;

@ccclass('CustomAd')
export class CustomAd extends Component {

    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    titleLabel: LabelComponent = null

    @property(LabelComponent)
    contentlabel: LabelComponent = null

    @property(SpriteComponent)
    bigImage: SpriteComponent = null

    private adId = null

    start() {

        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        let adInfo = ASCAd.getInstance().getNativeInfo()
        let adid = adInfo.adId
        let adTitle = adInfo.title
        let adDesc = adInfo.desc
        let adNativeBigImage = adInfo.Native_BigImage
        this.adId = adid
        loader.load({ url: adNativeBigImage, tpye: "jpg" }, (err, texture) => {
            if (err) {
                return
            } else {
                for (let element of this.node.children) {
                    element.active = true
                }
                let sprite = new SpriteFrame()
                sprite.texture = texture._texture
                ASCAd.getInstance().reportNative(adid)
                this.bigImage.spriteFrame = sprite
                this.titleLabel.string = adTitle
                this.contentlabel.string = adDesc
                this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
            }
        })
    }

    onCloseButton() {
        this.node.active = false
    }

    onTouch() {
        if (this.adId) {
            console.log(this.adId)
            ASCAd.getInstance().nativeClick(this.adId);
        }
    }
}
