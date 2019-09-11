/**
 * 标准键盘布局
 * ┌───┐   ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┐
 * │Esc│   │ F1│ F2│ F3│ F4│ │ F5│ F6│ F7│ F8│ │ F9│F10│F11│F12│ │P/S│S L│P/B│  ┌┐    ┌┐    ┌┐
 * └───┘   └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┘  └┘    └┘    └┘
 * ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───────┐ ┌───┬───┬───┐ ┌───┬───┬───┬───┐
 * ├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─────┤ ├───┼───┼───┤ ├───┼───┼───┼───┤
 * │ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{ [│} ]│ | \ │ │Del│End│PDn│ │ 7 │ 8 │ 9 │   │
 * ├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤ └───┴───┴───┘ ├───┼───┼───┤ + │
 * │ Caps │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  │               │ 4 │ 5 │ 6 │   │
 * ├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────────┤     ┌───┐     ├───┼───┼───┼───┤
 * │ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│  Shift   │     │ ↑ │     │ 1 │ 2 │ 3 │   │
 * ├─────┬──┴─┬─┴──┬┴───┴───┴───┴───┴───┴──┬┴───┼───┴┬────┬────┤ ┌───┼───┼───┐ ├───┴───┼───┤ E││
 * │ Ctrl│    │Alt │         Space         │ Alt│    │    │Ctrl│ │ ← │ ↓ │ → │ │   0   │ . │←─┘│
 * └─────┴────┴────┴───────────────────────┴────┴────┴────┴────┘ └───┴───┴───┘ └───────┴───┴───┘
 */

const DEFAULT_BULLET_CONFIG = {};
// 弹头
DEFAULT_BULLET_CONFIG.id = null;// this.BulletConfig._bulletID
DEFAULT_BULLET_CONFIG.weaponFire = '';// 开火特效
DEFAULT_BULLET_CONFIG.weaponSound = '';// 开火音效
DEFAULT_BULLET_CONFIG._bulletIndex = 0;// 必须是0，不能是-1
DEFAULT_BULLET_CONFIG._cycleIndex = -1;
DEFAULT_BULLET_CONFIG._triggerIndex = -1;
DEFAULT_BULLET_CONFIG._effectIndex = -1;
DEFAULT_BULLET_CONFIG._cycleID = 2;
DEFAULT_BULLET_CONFIG._animations = [];
// 弹头- 样式png
DEFAULT_BULLET_CONFIG._imageType = 1;
DEFAULT_BULLET_CONFIG.image = '';// 炮弹图片；英文名：image；默认值：无；范围：无
DEFAULT_BULLET_CONFIG.spineName = '';
DEFAULT_BULLET_CONFIG._animations = [];
DEFAULT_BULLET_CONFIG.animation = '';
DEFAULT_BULLET_CONFIG.keepPlay = true;// 是否持续旋转
// 弹头 - 样式json
DEFAULT_BULLET_CONFIG.wake = '';// 尾焰
DEFAULT_BULLET_CONFIG.fire = '';// 火焰
DEFAULT_BULLET_CONFIG.fireAnimation = '';// 火焰动画
DEFAULT_BULLET_CONFIG._fireAnimations = [];// 存储导出来的json动画
// 弹头 - 发射
DEFAULT_BULLET_CONFIG.launchTime = 0;// 发射时间，默认值：0
DEFAULT_BULLET_CONFIG.speed = '';// 飞行速度，没有默认值
/***********************************************************************************************************************
 * 弹头-物理模型
 */
DEFAULT_BULLET_CONFIG.physicsShape = {};
DEFAULT_BULLET_CONFIG.physicsShape.type = 4;// 默认值：4
DEFAULT_BULLET_CONFIG.physicsShape.radius = '';//
DEFAULT_BULLET_CONFIG.physicsShape.width = '';//
DEFAULT_BULLET_CONFIG.physicsShape.height = '';//
/***********************************************************************************************************************
 * 弹头-弹头模型
 */
DEFAULT_BULLET_CONFIG.bulletShape = {};
DEFAULT_BULLET_CONFIG.bulletShape.type = '';// 炮弹形状类型：1：圆形；2：方形。没有默认值
DEFAULT_BULLET_CONFIG.bulletShape.radius = '';// 半径
DEFAULT_BULLET_CONFIG.bulletShape.width = '';// 宽
DEFAULT_BULLET_CONFIG.bulletShape.height = '';// 高
DEFAULT_BULLET_CONFIG.bulletShape.anchorX = 0.5;
DEFAULT_BULLET_CONFIG.bulletShape.anchorY = 0.5;
// 弹头
DEFAULT_BULLET_CONFIG.mass = 35;// 质量，默认值：35
DEFAULT_BULLET_CONFIG.rotationMoment = 0;// 旋转速度，默认值：0
DEFAULT_BULLET_CONFIG.isFollowByCamera = true;// 跟随镜头，默认值：true
DEFAULT_BULLET_CONFIG.launched = true;// 是否主动发射，如果是触发结果生成就是false
/***********************************************************************************************************************
 * 弹头-轨迹
 */
DEFAULT_BULLET_CONFIG.cycles = {};
DEFAULT_BULLET_CONFIG.cycles.id = 1;
DEFAULT_BULLET_CONFIG.cycles.motionMode = 0;// 运行轨迹类型:1.飞行；2.滚动；3.弹跳；4.粘着；默认值：0
// 弹头-轨迹-1.飞行
DEFAULT_BULLET_CONFIG.cycles.isOffsetCoord = true;// 是否相对于当前位置偏移；true-相对，false-绝对；没有继承
DEFAULT_BULLET_CONFIG.cycles.x = 0;// 默认值：0
DEFAULT_BULLET_CONFIG.cycles.y = 0;// 默认值：0
DEFAULT_BULLET_CONFIG.cycles.isOffsetRotation = true;// 绝对角度；相对角度true
DEFAULT_BULLET_CONFIG.cycles.rotation = 0;// 角度，默认值：0
DEFAULT_BULLET_CONFIG.cycles.isOffsetSpeed = true;// 相对速度-true，绝对速度-false，默认值：true
DEFAULT_BULLET_CONFIG.cycles.speed = 0;// 速度，默认值：0
DEFAULT_BULLET_CONFIG.cycles.influenced = true;// 是否受风力影响，默认true
DEFAULT_BULLET_CONFIG.cycles.flyMode = 1;// 飞行模式：1：抛物线；2：直线
DEFAULT_BULLET_CONFIG.cycles.flySound = '';// 飞行音效
DEFAULT_BULLET_CONFIG.cycles.obstructionLoss = 0;// 阻力损失，默认值：0，范围：0~1
DEFAULT_BULLET_CONFIG.cycles.rotateMode = 3;// 1.不旋转，2.自旋转，3.跟随轨迹旋转，4.固定；默认值：3
DEFAULT_BULLET_CONFIG.cycles.fixedRotation = 0;// （新增）固定角度；默认值：0
// 弹头-轨迹-1.飞行-是否跟踪
DEFAULT_BULLET_CONFIG.cycles.isTrack = false;// true-触发；false-不触发；默认值：false
DEFAULT_BULLET_CONFIG.cycles.trackSound = '';// 跟踪音效
DEFAULT_BULLET_CONFIG.cycles.trackRange = '';// 跟踪范围；默认值：0；范围：大于0的数值
DEFAULT_BULLET_CONFIG.cycles.trackAngle = '';// 范围：大于0小于360
DEFAULT_BULLET_CONFIG.cycles.trackTarget = 1;// //1-友方，2-敌方，3-双方；默认值：1
// 弹头-轨迹-2.滚动
DEFAULT_BULLET_CONFIG.cycles.rollSound = '';// 滚动音效
DEFAULT_BULLET_CONFIG.cycles.rollDistence = '';// 滚动距离
DEFAULT_BULLET_CONFIG.cycles.rollSpeed = '';// 滚动速度
//DEFAULT_BULLET_CONFIG.cycles.rollMode = '';// 滚动类型（已经删除）
// 弹头-轨迹-3.弹跳
DEFAULT_BULLET_CONFIG.cycles.elasticityLoss = 0;// 弹力损失；默认值：0
DEFAULT_BULLET_CONFIG.cycles.keepJump = false;// 是否继续弹跳
DEFAULT_BULLET_CONFIG.cycles.jumpSound1 = '';// 弹跳音效1
DEFAULT_BULLET_CONFIG.cycles.jumpSound2 = '';// 弹跳音效2
DEFAULT_BULLET_CONFIG.cycles.jumpSound3 = '';// 弹跳音效3
DEFAULT_BULLET_CONFIG.cycles.jumpSound4 = '';// 弹跳音效4
// 弹头-轨迹-4.粘着
// 暂无
// 弹头-轨迹-5.粘着
DEFAULT_BULLET_CONFIG.cycles.penetrate = false;// 是否穿透，默认值：false
/***********************************************************************************************************************
 * 弹头-轨迹-触发
 */
DEFAULT_BULLET_CONFIG.cycles.triggers = {};
DEFAULT_BULLET_CONFIG.cycles.triggers.triggerMode = 0;// 触发条件类型：1.时间；2.距离；3.接触地面；4.接触战车；5.制定位置；6.静止；默认值:0
DEFAULT_BULLET_CONFIG.cycles.triggers.triggerParams = '';// 当triggerMode = 0,1,2,3时，默认值：空；当=4时；1-友方，2-敌方，3-双方；当=5时，{x=0,y=0}
/***********************************************************************************************************************
 * 弹头-轨迹-触发-结果
 */
DEFAULT_BULLET_CONFIG.cycles.triggers.effects = {};
DEFAULT_BULLET_CONFIG.cycles.triggers.effects._tempEffectMode = 0;// 触发结果改变的临时变量
DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 0;// 1.新轨迹；2.空；3.效果；4.地形；5.美术；6.添加新子弹；7.END；8.是否手动触发
DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams = '';// 'nil'
// effectMode = 2时
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 2;// 效果值
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.range = 200;// 影响范围
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.target = 3;// 影响对象
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.effectType = 1;// 值类型
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.effectValue = 102;// 值
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.range = 200;// 影响范围
// effectMode = 3时
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 3;
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.range = 200;// 影响范围
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.target = 2;// 伤害属性
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.buffId = 15;// buff的ID
// effectMode = 4时
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 4;
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.destroyRange = 0;// 破坏范围
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.destroyShape = 'views.png';// 破坏外形
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.destroyEdge = 'edge.png';// 破坏后边缘
// effectMode = 5时
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 5;// 效果(美术)
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams.source = 'boom_2.png';// 效果(美术)；英文名：source；
// effectMode = 6时
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 6;// 添加弹头
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams = [3,4,5];// 指向新弹头的ID
// effectMode = 7时
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectMode = 7;// END
//DEFAULT_BULLET_CONFIG.cycles.triggers.effects.effectParams = '';// 结束，最后应该要删除；