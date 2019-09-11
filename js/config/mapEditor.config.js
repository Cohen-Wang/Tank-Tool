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

/**
 * 1.	Map要ID
 * 		地形层的地形图片要ID
 * 2.地形层指向索引terrainIndex
 * 3.地形层的depth必须是0
 * 4.地形位置 装饰物的特殊位置
 * 5.帧动画的示意图
 */

const DEFAULT_MAP_CONFIG = {};
//
DEFAULT_MAP_CONFIG.id = 0;
DEFAULT_MAP_CONFIG.scale = 1.0;// 缩放比；默认值：1.0
DEFAULT_MAP_CONFIG.width = 0;// 地图宽
DEFAULT_MAP_CONFIG.height = 0;// 地图高
DEFAULT_MAP_CONFIG.terrainIndex = 0;// 指向地形层索引
//----------------------------------------------------------------------------------------------------------------------
// 层级
DEFAULT_MAP_CONFIG.layers = {};
DEFAULT_MAP_CONFIG.layers.depth = 0;// 层纵深
DEFAULT_MAP_CONFIG.layers.zOrder = 0;// Z序列，写的程序生成的z-index
//----------------------------------------------------------------------------------------------------------------------
// 组件
DEFAULT_MAP_CONFIG.layers.components = {};
DEFAULT_MAP_CONFIG.layers.components.type = '1';// 图片类型；默认值'1'；'1'-地形，'2'-风景，'3'-装饰物，'4'-帧动画
DEFAULT_MAP_CONFIG.layers.components.image = '';// 图片名称
DEFAULT_MAP_CONFIG.layers.components.width = 0;// 图片宽
DEFAULT_MAP_CONFIG.layers.components.height = 0;// 图片高
DEFAULT_MAP_CONFIG.layers.components.coordX = 0;// X轴坐标
DEFAULT_MAP_CONFIG.layers.components.coordY = 0;// Y轴坐标
DEFAULT_MAP_CONFIG.layers.components.images = [];// (Array)切图后的组合，如果图片类型 为1和2 ，那么没有此属性
//----------------------------------------------------------------------------------------------------------------------
// type = 3时
// 帧动画（旋转）
DEFAULT_MAP_CONFIG.layers.components.anchorX = 0.5;// 锚点
DEFAULT_MAP_CONFIG.layers.components.anchorY = 0.5;// 锚点
DEFAULT_MAP_CONFIG.layers.components.decorationType = 0;// 装饰类型，默认值：0；1-旋转动画；2-plist；3-spine
//----------------------------------------------------------------------------------------------------------------------
// type = 3 && decorationType == 1（旋转的动画）
DEFAULT_MAP_CONFIG.layers.components.rotationMoment = 0;//
//----------------------------------------------------------------------------------------------------------------------
// type = 3 && decorationType == 2（plist）
DEFAULT_MAP_CONFIG.layers.components.plist = '';// "map_steam.plist"，注意后缀名，好像是没有
//----------------------------------------------------------------------------------------------------------------------
// type = 3 && decorationType = 3（spine）
//DEFAULT_MAP_CONFIG.layers.components.type = 3;
//DEFAULT_MAP_CONFIG.layers.components.coordX =800;
//DEFAULT_MAP_CONFIG.layers.components.coordY = 650;
//DEFAULT_MAP_CONFIG.layers.components.decorationType = 3;
DEFAULT_MAP_CONFIG.layers.components.spine = '';// json文件，例："ironarm"
DEFAULT_MAP_CONFIG.layers.components.animation = '';// 动画，例："idle"
DEFAULT_MAP_CONFIG.layers.components.isFliping = false;// 镜像，例：原图就是不镜像，反向动画就是镜像（张粒国）
//----------------------------------------------------------------------------------------------------------------------
// type = 4（雾）
DEFAULT_MAP_CONFIG.layers.components.scale = 1.0;// 缩放比
DEFAULT_MAP_CONFIG.layers.components.speed = 0;// 大小