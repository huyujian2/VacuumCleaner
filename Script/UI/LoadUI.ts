import { _decorator, Component, Node, loader, ProgressBarComponent, director } from 'cc';
import { CustomEventListener } from '../CustomEventListener/CustomEventListener';
import { ResMgr } from '../Managers/ResMgr';
const { ccclass, property } = _decorator;
var resPkg = {
    scenes_3D: [
        "City/CapitalPalace",
        "City/CarPack",
        "City/Commercial1",
        "City/Commercial2",
        "City/Commercial3",
        "City/EiffelPark",
        "City/IndustryTopRight",
        "City/L-Shape",
        "City/Liberty Park_hub",
        "City/Metropolis1",
        "City/Metropolis2",
        "City/MonumentPark",
        "City/Residemtial1",
        "City/Residemtial2",
        "City/Trains"
    ],

    charactors_3D: [
        "Cleaner/CommonCleaner",
        "Cleaner/CowBoy",
        "Cleaner/Aborigin",
        "Cleaner/IAmGirl",
        "Cleaner/SnowWhite",
        "Cleaner/Mario",
        "Cleaner/Princekin",
        "Cleaner/Nutcracker",
        "Cleaner/MuRongZiYing",
        "Cleaner/JiuTunTongZi",
        "Cleaner/WoAiLuo"
    ],

    UI_atlas: [
       
    ],

    Sounds: [

    ],

    UI_prefabs: [
        "ShowScore"
    ],

    Mat:[
        
    ]
};
@ccclass('LoadUI')
export class LoadUI extends Component {

    @property(ProgressBarComponent)
    LoadingBar:ProgressBarComponent = null

    onLoad()
    {
        CustomEventListener.on("LoadingBar",this.updateLoadingBar,this)
    }

    start () {

        director.preloadScene("GameScene")
        ResMgr.Instance.preloadResPackage(resPkg, function(now, total){
            CustomEventListener.dispatchEvent("LoadingBar",now/total)
            }, function() {
            this.scheduleOnce(this.onResLoaded.bind(this), 0.5);
            }.bind(this));
    }


    updateLoadingBar(progress)
    {
        this.LoadingBar.progress = progress
    }

    onResLoaded()
    {
        director.loadScene("MainScene")
    }

    onDestroy(){
        CustomEventListener.off("LoadingBar",this.updateLoadingBar,this)

    }


}
