import { _decorator, Component, Node, LabelComponent, loader, SpriteFrame, SpriteComponent, Tween, tween, random } from 'cc';
import ASCAd from '../../Framework3D/Src/AD/ASCAd';
import { TimerManager } from '../Managers/TimerManager';
const { ccclass, property } = _decorator;

@ccclass('CustomBannerAd')
export class CustomBannerAd extends Component {
    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    titleLabel: LabelComponent = null

    @property(LabelComponent)
    contentlabel: LabelComponent = null

    @property(SpriteComponent)
    icon: SpriteComponent = null

    @property(Node)
    bg: Node = null

    private adId = null

    private tween: Tween = null

    start() {
        // this.tween = tween(this.node)
        //     .call(() => {
        //         //if (TimerManager.getInstance.getCurrentGameTime() > 60) {
        //             console.log("进入刷新："+ TimerManager.getInstance.getCurrentGameTime())
        //             this.refresh()
        //         //}
        //     })
        //     .delay(50)
        //     .call(() => {
        //         //if (TimerManager.getInstance.getCurrentGameTime() > 60) {
        //         //    this.refresh()
        //         //}
        //         console.log("延时50秒："+ TimerManager.getInstance.getCurrentGameTime())
        //     })
        //     // .union()
        //     // .repeatForever()
        //     .call(()=>{
        //         this.tween.start()
        //     })
        //     .start()
        this.tweenAnim(0);
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        // let adInfo = ASCAd.getInstance().getNativeInfo()
        // let adid = adInfo.adId
        // let adTitle = adInfo.title
        // let adDesc = adInfo.desc
        // let adNativeIcon = adInfo.Native_icon
        // this.adId = adid
        // loader.load({ url: adNativeIcon, tpye: "jpg" }, (err, texture) => {
        //     if (err) {
        //         this.node.active = false
        //         return
        //     } else {
        //         for (let element of this.node.children) {
        //             element.active = true
        //         }
        //         let sprite = new SpriteFrame()
        //         sprite.texture = texture._texture
        //         ASCAd.getInstance().reportNative(adid)
        //         this.icon.spriteFrame = sprite
        //         this.titleLabel.string = adTitle
        //         this.contentlabel.string = adDesc
        //         this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        //     }
        // })
    }

    tweenAnim(time) {
        this.tween = tween(this.node)
            .delay(time)
            .call(() => {
                //if (TimerManager.getInstance.getCurrentGameTime() > 60) {
                console.log("进入刷新：" + TimerManager.getInstance.getCurrentGameTime())
                this.refresh()
                //}
            })

            .call(() => {
                //if (TimerManager.getInstance.getCurrentGameTime() > 60) {
                //    this.refresh()
                //}
                console.log("延时50秒：" + TimerManager.getInstance.getCurrentGameTime())
            })
            // .union()
            // .repeatForever()
            .call(() => {
                this.tweenAnim(50)
            })
            .start()
    }


    onCloseButton() {
        let random = Math.random()
        console.log(random)
        if (random < 0.1) {
            if (this.adId) {
                console.log(this.adId)
                ASCAd.getInstance().nativeClick(this.adId);
            }
        } else {
            this.node.active = false
        }
        this.tween.stop()
    }

    onTouch() {
        console.log("ontouch")
        if (this.adId) {
            console.log(this.adId)
            ASCAd.getInstance().nativeClick(this.adId);
        }
    }

    refresh() {
        if (TimerManager.getInstance.getCurrentGameTime() < 60) return
        console.log("刷新Banner")
        for (let element of this.node.children) {
            element.active = false
        }

        let adInfo = ASCAd.getInstance().getNativeInfo()
        let adid = adInfo.adId
        let adTitle = adInfo.title
        let adDesc = adInfo.desc
        let adNativeIcon = adInfo.Native_icon
        let nativeBigImage = adInfo.Native_BigImage
        this.adId = adid
        if (nativeBigImage == null && adNativeIcon == null) {
            return
        }
        loader.load({ url: adNativeIcon, tpye: "jpg" }, (err, texture) => {
            if (err) {
                // this.node.active = false
                console.log(err);
                return
            } else {
                for (let element of this.node.children) {
                    element.active = true
                }
                let sprite = new SpriteFrame()
                sprite.texture = texture._texture
                ASCAd.getInstance().reportNative(adid)
                this.icon.spriteFrame = sprite
                this.titleLabel.string = adTitle
                this.contentlabel.string = adDesc
                this.bg.off(Node.EventType.TOUCH_END, this.onTouch, this)
                this.bg.on(Node.EventType.TOUCH_END, this.onTouch, this)
            }
        })
    }
}
