import { _decorator, Component, Node, instantiate, find, tween, loader, Tween } from 'cc';
import { Constants } from '../CustomEventListener/Constants';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { RubbishItem } from '../Game/RubbishItem';
import { WallRubbishItem } from '../Game/WallRubbishItem';
const { ccclass, property } = _decorator;

@ccclass('MapManager')
export class MapManager extends Component {

    public static Instance: MapManager = null
    onLoad() {
        if (MapManager.Instance === null) {
            MapManager.Instance = this
        }
        else {
            this.destroy()
            return
        }
    }

    @property([Node])
    insideMapList: Node[] = []

    @property([Node])
    outSideMapList: Node[] = []


    private currentInstanceIndex = 0

    private currentOutSideRubbishEnable = 0

    public destoryCount = 0

    private insideRubbishCount = 0

    public outSideRubbish: Array<any> = new Array()

    private outSideRubbishEnableFlag: boolean = false

    private hasEnable: boolean = false

    public groupIndex: number = 2

    public rubbishItemList: Array<any> = []

    private inSideMapList =
        [
            "City/BedRoom1",
            "GameMap/Kitchen1",
            "GameMap/Kitchen2",
            "City/Lounge1",
            "GameMap/StaticMap",
        ]
    start() {
        for (let path of this.inSideMapList.values()) {
            console.log(path)
            let map = instantiate(loader.getRes(path)) as Node
            map.setParent(find("Map"))
            this.insideMapList.push(map)
        }
        let outsideMap = instantiate(loader.getRes("GameMap/House_hub")) as Node
        outsideMap.setParent(find("Map"))
        this.scheduleOnce(() => {
            this.searchInsideRubbish()
            tween(this.node).repeatForever(tween(this.node)
                .call(() => {
                    this.rubbishItemList.forEach(element => {
                        if (element.node) {
                            element.checkState()
                        }
                    })
                }).delay(0.4).start()).start()
            this.pushOutSideRubbish(outsideMap)
            outsideMap.active = false
        }, 0)
    }

    update() {
        // if(this.destoryCount>=550 && !this.outSideRubbishEnableFlag)
        // {
        //     this.outSideRubbishEnableFlag = true
        //     this.enableAllRubbish()
        //     CustomEventListener.dispatchEvent(Constants.EventName.CanBreaKWall)
        // }
    }

    searchInsideRubbish() {
        for (let node of this.insideMapList) {
            for (let rubbish of node.children) {
                let rubbishComt = rubbish.getComponent(RubbishItem)
                if (rubbishComt) {
                    this.rubbishItemList.push(rubbishComt)
                }
            }
        }
    }


    instantiateMap() {
        // let node = instantiate(loader.getRes(this.MapList[this.currentInstanceIndex]))
        // node.setParent(find("Map"))
        // this.currentInstanceIndex += 1
        // this.pushOutSideRubbish(node)
        // this.scheduleOnce(() => {
        //     node.active = false
        // }, 0)
    }

    pushOutSideRubbish(node: Node) {
        this.outSideMapList.push(node)
        node.children.forEach(element => {
            if (element.getComponent(RubbishItem) !== null) {
                this.outSideRubbish.push(element.getComponent(RubbishItem))
                element.getComponent(RubbishItem).tweenFalg = false
                element.getComponent(RubbishItem).enabled = false
            }
            if (element.getComponent(WallRubbishItem) !== null) {
                this.outSideRubbish.push(element.getComponent(WallRubbishItem))
                element.getComponent(WallRubbishItem).tweenFalg = false
                element.getComponent(WallRubbishItem).enabled = false
            }
        })
    }

    enableRubbish() {
        let element = this.outSideRubbish[this.currentOutSideRubbishEnable]
        element.active = true
        element.tweenFalg = true
        this.currentInstanceIndex += 1
    }

    enableAllRubbish() {
        this.outSideRubbish.forEach(element => {
            this.rubbishItemList.push(element)
            element.enabled = true
            element.tweenFalg = true
        })
        
        // this.scheduleOnce(() => {
        //     console.log(this.outSideRubbish)
        //     this.scheduleOnce(() => {
        //         this.outSideCheckTween.start()
        //     }, 0)
        // }, 0)
    }

    addDestoryCount() {
        this.destoryCount += 1
        if (this.destoryCount >= 550 && !this.hasEnable) {
            this.hasEnable = true
            this.enableAllRubbish()
            this.outSideMapList.forEach(element => {
                element.active = true
            })
            CustomEventListener.dispatchEvent(Constants.EventName.CanBreaKWall)
        }
    }

    // public addInsideRubbishCount(node)
    // {
    //     node.children.forEach(element => {
    //         if(element.getComponent(RubbishItem)!== null)
    //         {
    //             //this.outSideRubbish.push(element.getComponent(RubbishItem))
    //             //element.getComponent(RubbishItem).enabled = false
    //             this.insideRubbishCount+=1
    //         }
    //     })
    // }

    onDestroy() {
        MapManager.Instance = null
    }

    public setGroup(node: Node) {
        node.children.forEach(element => {
            if (element.getComponent(RubbishItem) !== null) {
                element.getComponent(RubbishItem).setGroupAndMask(Constants.GroupAndMask.Group[this.groupIndex])
            }
            if (element.getComponent(WallRubbishItem) !== null) {
                element.getComponent(WallRubbishItem).setGroupAndMask(Constants.GroupAndMask.Group[this.groupIndex])
            }
        });
        this.addGroupIndex()
    }

    addGroupIndex() {
        this.groupIndex += 1
        if (this.groupIndex == Constants.GroupAndMask.Group.length) {
            this.groupIndex = 0
        }
    }
}
