import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;


enum EventName {
    GetScore = "getScore",
    LevelUp = "levelUp",
    ShowScore = "showScore",
    UpdateRank = "updateRank",
    SendPosToPlayer = "sendPosToPlay",
    CanBreaKWall = "canBreaKWall",
    SaveMaxScore = "saveMaxScore"
}

export class GameLevelInfo {
    public Level =
        [
            { Level: 1, Score: 50, size: 1, speed: 4 },
            { Level: 2, Score: 300, size: 1.4, speed: 5.4 },
            { Level: 3, Score: 1200, size: 1.8, speed: 6.8 },
            { Level: 4, Score: 1500, size: 2.3, speed: 8.2 },
            { Level: 5, Score: 3000, size: 4, speed: 14 },
            { Level: 6, Score: 10000, size: 5, speed: 17.3 },
            { Level: 7, Score: 12000, size: 10, speed: 28 },
            { Level: 8, Score: 12000, size: 19, speed: 48 },
            { Level: 9, Score: 12000, size: 22, speed: 53 },
            { Level: 10, Score: 12000, size: 30, speed: 57 },
            { Level: 11, Score: 12000, size: 40, speed: 66 },
            { Level: 12, Score: 12000, size: 60, speed: 80 },
            { Level: 13, Score: 12000, size: 70, speed: 86 },
            { Level: 14, Score: 12000, size: 80, speed: 93 },
            { Level: 15, Score: 12000, size: 90, speed: 100 },
            { Level: 16, Score: 12000, size: 100, speed: 106 }
        ]
}


export class RubbishLevelInfo {
    public Level =
        [
            { Level: 1, Score: 10 },
            { Level: 2, Score: 20 },
            { Level: 3, Score: 30 },
            { Level: 4, Score: 40 },
            { Level: 5, Score: 50 },
            { Level: 6, Score: 90 },
            { Level: 7, Score: 120 },
            { Level: 8, Score: 160 },
            { Level: 9, Score: 170 },
            { Level: 10, Score: 300 },
        ]
}

export class SkinInfo {
    public Skin =
        [
            { Name: "瓦吸", Contiditon: "", EnglishName: "Default", },
            { Name: "Vaco", Contiditon: "第二天登录领取", EnglishName: "Vaco" },
            { Name: "瓦吸小子", Contiditon: "达到星级2解锁", EnglishName: "Kid" },
            { Name: "瓦吸雷吉", Contiditon: "皮肤兑换券解锁", EnglishName: "Reggae" },
            { Name: "懒懒", Contiditon: "皮肤兑换券解锁", EnglishName: "Lazy" },
            { Name: "维京", Contiditon: "第三天登录解锁", EnglishName: "Viking" },
            { Name: "足球瓦吸", Contiditon: "吸走100台电脑解锁", EnglishName: "NFL" },
            { Name: "羽翼", Contiditon: "获得最高等分达成2000解锁", EnglishName: "Wing" },
            { Name: "朋克", Contiditon: "获得最高等分达成5000解锁", EnglishName: "Punk" },
            { Name: "号兵", Contiditon: "皮肤兑换券解锁", EnglishName: "Trump" },
            { Name: "圣诞老人", Contiditon: "达到星级5解锁", EnglishName: "Santa" },
            { Name: "下士", Contiditon: "吸走500个书籍解锁", EnglishName: "Corporal" },
            { Name: "毕业生", Contiditon: "皮肤兑换券解锁", EnglishName: "Graduate" },
            { Name: "报童", Contiditon: "皮肤兑换券解锁", EnglishName: "PaperBoy" },
            { Name: "金属", Contiditon: "获得最高得分达成7000解锁", EnglishName: "Metal" },
            { Name: "警察", Contiditon: "达到星级10解锁", EnglishName: "OuiPolice" },
            { Name: "宇航员", Contiditon: "转盘解锁", EnglishName: "Astronaut" },
        ]
}

export class AchievementLevelInfo {
    public Level =
        [
            { Level: 1, Score: 50, Name: "吸尘器" },
            { Level: 2, Score: 300, Name: "除尘机" },
            { Level: 3, Score: 1200, Name: "家用吸尘器" },
            { Level: 4, Score: 3000, Name: "半自动吸尘器" },
            { Level: 5, Score: 5000, Name: "自动吸尘器" },
            { Level: 6, Score: 7000, Name: "工业吸尘器" },
            { Level: 7, Score: 8000, Name: "扫路机" },
            { Level: 8, Score: 9000, Name: "尘埃克星" },
            { Level: 9, Score: 10000, Name: "吸尘专家" },
            { Level: 10, Score: 12000, Name: "吸尘大师" },
            { Level: 11, Score: 13000, Name: "尘埃梦魇" },
            { Level: 12, Score: 14000, Name: "吸尘之王" },
            { Level: 13, Score: 15000, Name: "吸尘天尊" },
            { Level: 14, Score: 16000, Name: "吸尘神皇" },
            { Level: 15, Score: 17000, Name: "吸尘帝君" },
            { Level: 16, Score: 18000, Name: "黑洞" }
        ]
}

export class TipLabel {
    public Tip =
        [
            "你会越吸越大，最后可以吸走一切东西！",
            "随着等级的提升，你的速度也可以加快哦！",
            "你不仅可以吸走垃圾，你还可以吸走和你一样的吸尘器，只要你比他大！",
            "全部有20多款皮肤，可以根据解锁条件进行解锁",
            "你的吸尘器不一样，你可以吸走墙体，车，床，只要你够大"
        ]
}

export class GroupAndMask {
    public Group =
        [
            1 << 0,
            1 << 1,
            1 << 2,
            1 << 3,
            1 << 4,
            1 << 5,
            1 << 6,
            1 << 7,
            1 << 8,
            1 << 9,
            1 << 10,
            1 << 11,
            1 << 12,
            1 << 13,
            1 << 14,
            1 << 15,
            1 << 16,
            1 << 17,
            1 << 18,
            1 << 19,
            1 << 20,
            1 << 21,
            1 << 22,
            1 << 23,
            1 << 24,
            1 << 25,
            1 << 26,
            1 << 27,
            1 << 28,
            1 << 29,
        ]
}


export class RankRewared {
    public rewared =
        [
            3000,
            1500,
            1000,
            500
        ]
}



export class AiName {
    public Name =
        [
            '她在他城 #',
            '如今陌生*丶',
            '哦i', '嗯i',
            '正太', '正妹',
            '北巷', '南阳',
            '骚eR', '瘾eR.qq可じòぴé游戏名字单纯',
            '赵高尚', '曾无洁',
            '不放弃', '不离开',
            '太棒了', '带莪走',
            '温瞳乄', '冷眸乄',
            '吣不动则不痛', '情不移则离',
            '还在么? ', '从未走',
            '八级货i', '八级半i',
            '故事还长', '伱别失望',
            '硬汉子♀', '女强人♂',
            '香港凯子', '大陆马子',
            '　忘　ぁ ', '　念　あ',
            '泪与笑， ', ' 沙与沫。',
            '抚风弹琴', '听风浅笑',
            '尴尬、ゞ ', '郁闷、ゞ',
            '姑娘慢走 ', ' 公子留步',
            '她还じòぴé莪',
            '╰眷春° ', '╰惜夏°',
            '甜蜜 70° ', '幸福 70°',
            '゛儛;?網 ', '゛儛;?逅',
            '记忆?、安 ', ' 回忆 、美',
            '别说从前. ', ' 别话以后.',
            '—憨潴。 ', ' —憨妞。',
            '↘"じòぴé莪. ', ' ↘"蒽,じòぴé尔.',
            '伱说deじòぴé莪', '伱承诺太茤',
            '谱写、情歌 ', '续写、情歌',
            '世世牵挂** ', '生生思念**',
            '火星sんǎǒ女。', ' 火星sんǎǒ年。',
            '年sんǎǒ最轻狂 ', '青春不悲伤',
            '说她じòぴé他', ' 他说他じòぴé她',
            '深ai这小妞', '只ai这男人',
            '为伱写诗！ ', ' 喂伱些屎？',
            '╰ 米老头', ' ╰ 米老婆',
            '♂苯人^拒激', ' ♀苯人^拒辱',
            '▁_黑礼服﹖', ' ▁_白緍紗﹖',
            '温柔、坏男人 ', '体贴、小sんǎǒ妇',
            '地老·陪伱恋 ', ' 天荒·恋着伱',
            '：冇鴨出售：', '：冇鷄出售：',
            '美de让人刺眼 ', '美de让人着迷',
            '　　　精孓。 ', '　　卵蛋。',
            '莪噯(_sんǎǒ懶潴 ', '莪是(_sんǎǒ懶潴',
            '割脉以示真吣 ', '真吣不用割脉',
            'ヾ沵.昰涐de乐 ', 'ヾ恩.涐昰沵嘚',
            '大西瓜凉凉 , ', '小夏天凉凉 ',
            '舞暧依然*娶暧 ', ' 舞暧依然*嫁磊',
            '魏晨是太阳啊i ', '乐橙是月亮啊i重口味游戏名字女生',
            '若偏执可以守护 ', '若诺言可以厮守',
            '莪走莪de阳光道 ', '莪过莪de独木桥',
            '老婆做じòぴé好不好', '老公莪真想做じòぴé',
            '伱de权限给了谁 ', ' 伱de初吣给了谁',
            '最溅不过憾情﹌', '最凉不过人吣﹌',
            '谁，卑微了承诺', ' 谁，卑微了幸福',
            '他说不想见莪啊! ', '莪说莪想见伱啊!',
            'ζ 青春还未开始 ', 'ζ 苍老早已来临',
            '青果学院那么牛', '怎么不帮莪考试啊',
            '対伱、动ろ情。 ', '対伱、动ろ吣。',
            '爷就是这么霸道* ', ' 姐就是这么娇媚*',
            '笨蛋。&#; ', ' &#;。薇宝贝',
            'Forever魔鬼旋律 ', 'Forever天使节奏',
            '伱是莪de小呀小苹果~ ', ' 伱俗不俗呀！',
            'sんǎǒ年，莪用吣じòぴé伱', ' sんǎǒ女，莪拿命珍惜',
            '卡布奇诺式じòぴé恋╮', ' 提拉米苏式想念╮',
            '吴世勋莪じòぴé伱.EXO* ', ' 鹿晗莪也じòぴé伱.EXO*',
            'zZZ 苊，莪娶？oО ', 'zZZ 苊，莪糘？oО',
            '大众人吣中de女神@ ', '广众人吣中de男神@',
            '〆.万劫不复de男人 ', '〆.万劫不复de女人',
            '南笙依旧温暖如初. ', '北街依旧阳光明媚.',
            '伱是莪离不开de空氕 ', ' 伱是莪离不开de氧氕',
            '傻瓜莪们都一样.丫 ', '笨蛋莪们都一样.乖',
            '玩de久不一定是闺蜜 ', 'じòぴé得深不一定他じòぴé伱',
            'シ____『茉莉、清茶 ', 'シ____『茉莉、蜜茶',
            '静静 静静莪是明明！', '明明 明明莪是静静！',
            '十年相依 终身红魔！ ', '十年相依 终身红魔！',
            '老婆,伱是莪最じòぴéde-', '老公,伱是莪最疼de-',
            '男人付得起那份责任。', '女人守得住那份矜持。',
            '[情到深处怎能不孤独] ', '[じòぴé到浓时定牵肠挂肚]',
            '- 伱说伱じòぴé莪是玩笑', '- 伱说伱じòぴé莪是放屁 #',
            '莪以后再也不和伱玩了 ', '这句话伱都说了几百遍了',
            '跟着莪笑、莪会{开吣} ', '跟着莪哭、莪会【欣喜】',
            '莪决定走出伱de世界，', '莪不要伱走出莪de世界，',
            '地平线γ　　　　　　 ', ' 海平面γ　　　　　　　',
            '　￠　活着不是硬道理 ', '　￠　活着并硬着才是道理',
            'Sorry，莪有喜欢de人了', 'Sorry，莪喜欢de人就是伱',
            '重拾旧梦い放不下de曾经', '重温旧日い舍不得de过往',
            '-　　　　　　　凉洛生ゝ ', '-　　　　　　凉洛兮ゝ',
            '▲习惯不曾习惯de习惯〃', '△在乎不曾在乎de在乎〃',
            '不二吣°　　　　　　mm ', '不二情°　　　　　　mm',
            '〆 末落╰一红尘娘已唁╮', '〆 季末╰一红尘君已婚╮',
            '会骂人de孩子未必是坏孩子', '不骂人de孩子未必是好孩子',
            '做过じòぴé上过床说不じòぴé就不じòぴé', '上过床做过じòぴé说分手就分手',
            '伱若背叛全世界与莪不离', '莪亦放弃全世界与伱不弃',
        ]
}


@ccclass('Constants')
export class Constants {
    /**监听事件名 */
    public static EventName = EventName
    /**玩家游戏等级信息 */
    public static GameLevelInfo = new GameLevelInfo()
    /**玩家等级信息 */
    public static SkinInfo = new SkinInfo()
    /**玩家成就等级信息 */
    public static AchievementLevelInfo = new AchievementLevelInfo()
    /**垃圾等级信息 */
    public static RubbishLevelInfo = new RubbishLevelInfo()
    /**组与掩码 */
    public static GroupAndMask = new GroupAndMask()
    /**排行奖励 */
    public static RankRewared = new RankRewared()
    /**AI名字 */
    public static AiName = new AiName()
    /**提示 */
    public static tipLabel = new TipLabel()
}
