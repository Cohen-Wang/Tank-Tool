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

let vm = new Vue({

    el : '#map',

    data : {
        // 默认剪切大小
        cutWidth : 1024,
        cutHeight : 1024,

        // 设置地图配置
        MapConfig : {
            id : DEFAULT_MAP_CONFIG.id,
            scale : DEFAULT_MAP_CONFIG.scale,
            terrainIndex : DEFAULT_MAP_CONFIG.terrainIndex,
            width : DEFAULT_MAP_CONFIG.width,
            height : DEFAULT_MAP_CONFIG.height,
            layers : [],
        },
        //
        mapEditorSize : 1,
        //
        tempIndex : -1,
        tempDepth : 0,
    },

    methods : {

        // 加载txt文件
        uploadFileOfOldMap : function (e) {
            // 变量
            let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            let reader = new FileReader();
            let _this = this;
            // 判断是否传入文件
            if (!oFile) return;
            // 判断文件的格式
            let filename = oFile.name;
            if (cyber.getSuffix(filename) !== 'txt') {
                alert('文件名后缀应为：txt');
                return;
            }
            // 上传成功后
            this.MapConfig = {};// 清空
            reader.readAsText(oFile , 'utf-8');// 读取文件
            reader.onload = function () {
                _this.MapConfig = _this.filterObj(JSON.parse(this.result));// 赋值_this.MapConfig
            };
        },

        /**
         * 过滤
         */
        filterObj : function (obj) {
            obj = this.filterIsFliping(obj);
            return obj;
        },

        // 添加isFliping
        filterIsFliping : function (obj) {
            let aLayers = obj.layers;
            for (let i = 0; i < aLayers.length; i++) {
                for (let j = 0; j < aLayers[i].components.length; j++) {
                    let type = aLayers[i].components[j].type;
                    let decorationType = aLayers[i].components[j].decorationType;
                    // 如果type === 3（帧动画） 并且decorationType === 3（装饰类型是骨骼动画）
                    if (type === '3' && decorationType === '3') {
                        if (aLayers[i].components[j].isFliping === undefined) {// 如果没有定义（这里可能是个不精准判断）
                            aLayers[i].components[j].isFliping = DEFAULT_MAP_CONFIG.layers.components.isFliping;
                        }
                    }
                }
            }
            return obj;
        },

        /**
         *
         */
        // 获取当前最大的图片作为mapEditor的宽高....❤理论上应该写成递归！！！
        setTheSizeOfMapEditor : function () {
            var oMapEditor = document.getElementById('mapEditor');
            var aImg = oMapEditor.getElementsByTagName('img');
            var arrH = [];
            var arrW = [];
            var max_h , max_w;

            for (var i = 0, len = aImg.length; i < len; i++) {
                arrH.push(aImg[i].naturalHeight);
                arrW.push(aImg[i].naturalWidth);
            }
            max_h = _.max(arrH);
            max_w = _.max(arrW);

            // 设置数据
            this.MapConfig.width = max_w;
            this.MapConfig.height = max_h;
            // 设置地图宽高
            oMapEditor.style.height = max_h + 'px';
            oMapEditor.style.width = max_w + 'px';
        },

        // 添加图层
        addLayer : function () {
            if (!(this.tempIndex !== "" && this.tempIndex >= 0 && this.tempDepth >=0)) {
                alert("请填入完整信息");
                return false;
            }

            this.MapConfig.layers.splice(this.tempIndex, 0, {
                depth : this.tempDepth,
                zOrder : 0,
                components : []
            });

            /* 清空 */
            this.tempDepth = 0;
            this.tempIndex = -1;
        },

        // 删除图层
        deleteLayer : function (layerIndex) {
            let confirm = window.confirm("确定删除【第"+(layerIndex+1)+"个】图层吗？");
            if (confirm) {
                this.MapConfig.layers.splice(layerIndex, 1);
            }
        },

        // 添加图片
        addImages : function (event, layerIndex) {
            let oEvent = event || window.event;

            if (!oEvent.target.files) return;// 判断是否有文件

            let prompt = window.prompt("请填写图片插入位置（数字）");

            /* 知识点 */
            /* +"123abc" 可以转义为 数字123；但是+"a123abc"，前面多了一个a，则不能转义为数字，而是NaN */
            /* 又由于 typeof NaN === 'number'， 所以 typeof +"任意变量" === 'number' */
            let reg = /^\d+$/;
            if (!reg.test(prompt)) {
                alert("你的输入不合法");
                return false;
            }

            let oFile = oEvent.target.files[0];
            let _this = this;
            let reader = new FileReader();

            reader.readAsDataURL(oFile);
            reader.onload = function () {
                // 获取图片（无后缀名的名称）来当 html 面板ID
                let imageName = oFile.name.slice(0, -4);
                let url = this.result;

                // 创建一张图片，才能获取大小吧？
                let oImg = new Image();
                oImg.src = this.result;

                oImg.onload = function () {
                    _this.MapConfig.layers[layerIndex].components.splice(+prompt, 0, {// 当splice 插入的索引数字大于数组长度，自然会变成push
                        _isShow : true,// 自定义：图片显示和隐藏
                        _name : imageName,// 自定义：无后缀名的名称
                        _url : url,// 自定义：图片数据地址
                        type : DEFAULT_MAP_CONFIG.layers.components.type,
                        image : oFile.name,
                        width : oImg.naturalWidth,
                        height : oImg.naturalHeight,
                        coordX : DEFAULT_MAP_CONFIG.layers.components.coordX,
                        coordY : DEFAULT_MAP_CONFIG.layers.components.coordY,
                    });
                };
            };

            setTimeout(function () {
                _this.setTheSizeOfMapEditor();
            }, 5000);
        },

        // 删除图片
        deleteImage : function (layerIndex, componentIndex) {
            let confirm = window.confirm("确认删除【第"+(layerIndex+1)+"图层】的【第"+(componentIndex+1)+"张图片】吗?");
            if (confirm) {
                this.MapConfig.layers[layerIndex].components.splice(componentIndex, 1);
            }
        },

        // 添加plist
        addPlist : function (layerIndex) {
            let name = 'plist' + parseInt(Math.random().toFixed(2) * 100);
            this.MapConfig.layers[layerIndex].components.push({
                image : name,
                _name : name,
                _isShow : true,//自定义：图片显示和隐藏
                type : 3,
                decorationType : 2,
                width : DEFAULT_MAP_CONFIG.layers.components.width,
                height: DEFAULT_MAP_CONFIG.layers.components.height,
                coordX : DEFAULT_MAP_CONFIG.layers.components.coordX,
                coordY : DEFAULT_MAP_CONFIG.layers.components.coordY,
                plist : DEFAULT_MAP_CONFIG.layers.components.plist,
            });
        },

        // 添加spine
        addSpine : function (layerIndex) {
            let name = 'spine' + parseInt(Math.random().toFixed(2) * 100);
            this.MapConfig.layers[layerIndex].components.push({
                image : name,
                _name : name,
                _isShow : true,// 自定义：图片显示和隐藏
                type : 3,
                decorationType : 3,
                width : DEFAULT_MAP_CONFIG.layers.components.width,
                height: DEFAULT_MAP_CONFIG.layers.components.height,
                coordX : DEFAULT_MAP_CONFIG.layers.components.coordX,
                coordY : DEFAULT_MAP_CONFIG.layers.components.coordY,
                // 帧动画
                spine : DEFAULT_MAP_CONFIG.layers.components.spine,
                animation : DEFAULT_MAP_CONFIG.layers.components.animation,
                isFliping : DEFAULT_MAP_CONFIG.layers.components.isFliping,
                _translateX : 0,
                _translateY : 0,
                _ShowCoordinate : false,
                _debugRendering : false,
                _showBackground : false,
            });
            // vue 添加属性技巧
			// vm.$set(componentItem, 'plist', fileName);
        },

        // createSpine
        createSpine : function (componentItem, layerIndex, componentIndex) {
            if (componentItem.spine && componentItem.animation) {
                new CYBER.SpineCanvas({
                    id : 'spineCanvas' + layerIndex + componentIndex,
                    skeletonName : componentItem.spine,
                    animationName : componentItem.animation,
                    left : componentItem.coordX,
                    top : componentItem.coordY,
                    width : componentItem.width,
                    height : componentItem.height,
                    translateX : componentItem._translateX,
                    translateY : componentItem._translateY,
                    ShowCoordinate : componentItem._ShowCoordinate,
                    debugRendering : componentItem._debugRendering,
                    showBackground : componentItem._showBackground,
                });
            }
        },

        // 层纵深和z序列的关系
        getZOrder : function () {
            // 提出depth
            let arr = [];
            _.each(this.MapConfig.layers , function (item , index) {
                arr.push(item.depth);
            });

            // 2.去重
            let arrDistinct = _.uniq(arr);
            // 3.排序
            let arrToBig = _.sortBy(arrDistinct, function (n) {
                return parseInt(n);//如果判断的是字符串，那么排序就是错误的；
            });
            // 4.倒序
            let arrToSmall = arrToBig.reverse();

            let result = [];
            _.each(arrToSmall , function (item , index) {
                result.push({
                    depth : item,
                    zOrder : index+1
                })
            });

            for (let i = 0 , leni = this.MapConfig.layers.length ; i < leni ; i++) {
                for (let j = 0 , lenj = result.length ; j < lenj ; j++) {
                    if (this.MapConfig.layers[i].depth === result[j].depth) {
                        this.MapConfig.layers[i].zOrder = result[j].zOrder;
                    }
                }
            }
        },

        // type
        mapTypeChange : function (componentItem) {
            // 先清空之前的内容
            if(componentItem.hasOwnProperty('decorationType')) delete componentItem.decorationType;
            //
            if(componentItem.hasOwnProperty('anchorX')) delete componentItem.anchorX;
            if(componentItem.hasOwnProperty('anchorY')) delete componentItem.anchorY;
            if(componentItem.hasOwnProperty('rotationMoment')) delete componentItem.rotationMoment;
            // type = 3 , decorationType = 2
            if(componentItem.hasOwnProperty('plist')) delete componentItem.plist;
            if(componentItem.hasOwnProperty('scale')) delete componentItem.scale;
            if(componentItem.hasOwnProperty('speed')) delete componentItem.speed;
            // type = 3 , decorationType = 3
            if(componentItem.hasOwnProperty('spine')) delete componentItem.spine;
            if(componentItem.hasOwnProperty('animation')) delete componentItem.animation;
            //
            switch (componentItem.type) {
                case '1' :

                    break;
                case '2' :

                    break;
                case '3' :
                    vm.$set(componentItem , 'anchorX' , DEFAULT_MAP_CONFIG.layers.components.anchorX);
                    vm.$set(componentItem , 'anchorY' , DEFAULT_MAP_CONFIG.layers.components.anchorY);
                    vm.$set(componentItem , 'decorationType' , DEFAULT_MAP_CONFIG.layers.components.decorationType);
                    break;
                case '4' :
                    vm.$set(componentItem , 'scale' , DEFAULT_MAP_CONFIG.layers.components.scale);
                    vm.$set(componentItem , 'speed' , DEFAULT_MAP_CONFIG.layers.components.speed);
                    break;
                default :
            }
        },

        // decorationType
        decorationTypeChange : function (componentItem) {
            // 先清空
            if (componentItem.hasOwnProperty('rotationMoment')) delete componentItem.rotationMoment;
            if (componentItem.hasOwnProperty('plist')) delete componentItem.plist;
            if (componentItem.hasOwnProperty('spine')) delete componentItem.spine;
            if (componentItem.hasOwnProperty('animation')) delete componentItem.animation;
            // 再添加
            switch (componentItem.decorationType) {
                case '1' :
                    vm.$set(componentItem, 'rotationMoment', DEFAULT_MAP_CONFIG.layers.components.rotationMoment);
                    break;
                case  '2' :
                    vm.$set(componentItem, 'plist', DEFAULT_MAP_CONFIG.layers.components.plist);
                    break;
                case  '3' :
                    vm.$set(componentItem, 'spine', DEFAULT_MAP_CONFIG.layers.components.spine);
                    vm.$set(componentItem, 'animation', DEFAULT_MAP_CONFIG.layers.components.animation);
                    break;
                default :
            }
        },

        // 一键全屏
        fullScreen : function (percent) {
            let oEditorArea = document.getElementById('EditorArea');// 编辑区域（固定）
            let oMapEditor = document.getElementById('mapEditor');//  地图容器（变动）
            let areaW = oEditorArea.offsetWidth;
            let mapW = oMapEditor.offsetWidth;
            percent = percent || (areaW / mapW).toFixed(2);
            oMapEditor.style.transform = 'scale(' + percent + ')';
        },

        // 删除plist不需要的属性
        deletePlistImage : function (obj) {
            for (let i = 0, len = obj.layers.length; i < len; i++) {
                for (let j = 0, lenj = obj.layers[i].components.length; j < lenj; j++) {
                    let decorationType = obj.layers[i].components[j].decorationType;
                    // plist
                    if (decorationType === '2') {
                        if (obj.layers[i].components[j].hasOwnProperty('image')) delete obj.layers[i].components[j].image;
                        if (obj.layers[i].components[j].hasOwnProperty('anchorX')) delete obj.layers[i].components[j].anchorX;
                        if (obj.layers[i].components[j].hasOwnProperty('anchorY')) delete obj.layers[i].components[j].anchorY;
                    }
                }
            }
            return obj;
        },

        // 删除spine不需要的属性
        deleteSpineProperty : function (obj) {
            for (let i = 0, len = obj.layers.length; i < len; i++) {
                for (let j = 0, lenj = obj.layers[i].components.length; j < lenj; j++) {
                    let decorationType = obj.layers[i].components[j].decorationType;
                    // spine
                    if (decorationType === '3') {
                        if (obj.layers[i].components[j].hasOwnProperty('image')) delete obj.layers[i].components[j].image;
                        if (obj.layers[i].components[j].hasOwnProperty('width')) delete obj.layers[i].components[j].width;
                        if (obj.layers[i].components[j].hasOwnProperty('height')) delete obj.layers[i].components[j].height;
                        if (obj.layers[i].components[j].hasOwnProperty('anchorX')) delete obj.layers[i].components[j].anchorX;
                        if (obj.layers[i].components[j].hasOwnProperty('anchorY')) delete obj.layers[i].components[j].anchorY;
                    }
                }
            }
            return obj;
        },

        // 计算spine的x, y坐标
        calculateSpineCoordinate : function (obj) {
            for (let i = 0, len = obj.layers.length; i < len; i++) {
                for (let j = 0, lenj = obj.layers[i].components.length; j < lenj; j++) {
                    let decorationType = obj.layers[i].components[j].decorationType;
                    // spine
                    if (decorationType === '3') {
                        //console.log(obj.layers[i].components[j].coordX);
                        //console.log(obj.layers[i].components[j]._translateX);
                        obj.layers[i].components[j].coordX = Math.ceil(obj.layers[i].components[j].coordX) + Math.ceil(obj.layers[i].components[j]._translateX);
                        obj.layers[i].components[j].coordY = Math.ceil(obj.layers[i].components[j].coordY) + Math.ceil(obj.layers[i].components[j]._translateY);
                    }
                }
            }
            return obj;
        },

        // 获取反向的坐标
        getCoordY : function (obj) {
            for (let i = 0, leni = obj.layers.length; i < leni; i++) {
                for (let j = 0, lenj = obj.layers[i].components.length; j < lenj; j++) {
                    if (obj.layers[i].components[j].type === '3') {
                        obj.layers[i].components[j].coordY = obj.height - parseInt(obj.layers[i].components[j].coordY);
                    } else {
                        obj.layers[i].components[j].coordY = obj.height - parseInt(obj.layers[i].components[j].coordY) - obj.layers[i].components[j].height;
                    }
                }
            }
            return obj;
        },

        // 拼接出真正的对象
        getSmallImage : function (obj) {
            for (let i = 0, leni = obj.layers.length; i < leni; i++) {
                for (let j = 0, lenj = obj.layers[i].components.length; j < lenj; j++) {
                    // 当组件类型为：'1'-地形，'2'-风景的时候，就要。。。
                    if (obj.layers[i].components[j].type === '1' || obj.layers[i].components[j].type === '2') {
                        obj.layers[i].components[j].images = this.getCanvasData(cyber.deleteSuffix(obj.layers[i].components[j].image));
                    }
                }
            }
            return obj;
        },

        // 获取canvas里面的数据
        getCanvasData : function (className) {
            let list = [];
            let aCanvasThisClassName = document.getElementsByClassName(className);
            for (let i = 0, len = aCanvasThisClassName.length; i < len; i++) {
                list.push({
                    "image" : aCanvasThisClassName[i].title + '_' + (i + 1) + '.png',
                    "coordX" : aCanvasThisClassName[i].getAttribute('coordx'),
                    "coordY" : aCanvasThisClassName[i].getAttribute('coordy'),
                    "width" : aCanvasThisClassName[i].width,
                    "height" : aCanvasThisClassName[i].height,
                });
                aCanvasThisClassName[i].title = aCanvasThisClassName[i].title + '_' + (i + 1);
            }
            return list;
        },

        // 将图片转换成canvas
        imageToCanvas : function () {
            let oMapEditor = document.getElementById('mapEditor');
            let aImg = oMapEditor.getElementsByTagName('img');
            for (let i = 0, len = aImg.length; i < len; i++) {
                let imageType = aImg[i].getAttribute('data-type');// 获取每张图片的所属的类型值
                if (imageType === '1' || imageType === '2') {
                    this.getTheImages(aImg[i]);// 根据算法切图
                } else {
                    this.createCan(aImg[i], 0, 0, aImg[i].naturalWidth, aImg[i].naturalHeight, 0, 0, aImg[i].naturalWidth, aImg[i].naturalHeight, aImg[i].title, 0, 0)//切原图；
                }
            }
        },

        // 获取图片->算法->切图->保存
        getTheImages : function (img) {
            let oImg = new Image();
            let _this = this;
            oImg.src = img.src;
            oImg.onload = function () {
                _this.cut(oImg, img.title);
            };
        },

        // 切图（算法）
        cut : function (oImg, title) {
            // 变量
            let imgW = oImg.naturalWidth;
            let imgH = oImg.naturalHeight;
            let w = this.cutWidth;
            let h = this.cutHeight;
            let xNum = parseInt(imgW / this.cutWidth);
            let xResidue = imgW % this.cutWidth;
            let yNum = parseInt(imgH / this.cutHeight);
            let yResidue = imgH % this.cutHeight;
            let startX, startY, coordX, coordY;

            // 算法
            if (xNum === 0) {
                if (yNum === 0) {
                    this.createCan(oImg, 0, 0, xResidue, yResidue, 0, 0, xResidue, yResidue, title, 0, 0);
                } else {
                    for (let j = 0; j < yNum; j++) {
                        startY = imgH - (j + 1) * h;
                        coordY = j * h;
                        this.createCan(oImg, 0, startY, xResidue, h, 0 , 0, xResidue, h, title, 0, coordY);
                        if (j === yNum-1 && yResidue !== 0) {
                            coordY = (j + 1) * h;
                            this.createCan(oImg, 0, 0, xResidue, yResidue, 0, 0, xResidue, yResidue, title, 0, coordY);
                        }
                    }
                }
            } else {
                for (let i = 0; i < xNum; i++) {
                    if (yNum === 0) {
                        startX = i * w;
                        coordX = i * w;
                        this.createCan(oImg, startX, 0, w, yResidue, 0, 0, w, yResidue, title, coordX, 0);
                        if (i === xNum - 1 && xResidue !== 0) {
                            startX = (i + 1) * w;
                            coordX = (i + 1) * w;
                            this.createCan(oImg, startX, 0, xResidue, yResidue, 0, 0, xResidue, yResidue, title, coordX, 0);
                        }
                    } else {
                        for (let j = 0; j < yNum; j ++) {
                            startX = i * w;
                            startY = imgH - (j+1) * h;
                            coordX = i * w;
                            coordY = j * h;
                            // x, y轴循环部分
                            this.createCan(oImg, startX, startY , w, h, 0, 0, w, h, title, coordX, coordY);
                            // y轴多余部分
                            if (j === yNum - 1 && yResidue !== 0) {
                                coordY = (j + 1) * h;
                                this.createCan(oImg, startX, 0, w, yResidue, 0, 0, w, yResidue, title , coordX, coordY)
                            }
                        }
                    }

                    // X轴多余部分
                    if (i === xNum - 1 && xResidue !== 0) {
                        for (let k = 0; k < yNum; k++) {
                            startX = (i + 1) * w;
                            startY = imgH - (k + 1) * h;
                            coordX = (i + 1) * w;
                            coordY = k * h;
                            this.createCan(oImg, startX, startY, xResidue, h, 0, 0, xResidue, h, title, coordX, coordY);

                            if (k === yNum - 1 && yResidue !== 0) {
                                startX = (i + 1) * w;
                                coordY = (k + 1) * h;
                                this.createCan(oImg, startX, 0, xResidue, yResidue,0 , 0, xResidue, yResidue, title, coordX, coordY)
                            }
                        }
                    }
                }
            }
        },

        // 创建canvas对应切图
        createCan : function (oImg, startX, startY, imgWidth, imgHeight, canX, canY, canWidth, canHeight, title, coordX, coordY) {
            // 初始化
            let can = document.createElement('canvas');
            let ctx = can.getContext('2d');
            // 设置属性
            can.width = canWidth;
            can.height = canHeight;
            can.className = 'imgCan' + ' ' + title;
            can.style.display = 'none';
            can.setAttribute('title' , title );
            can.setAttribute('coordx' , coordX );
            can.setAttribute('coordy' , coordY );
            // 画图
            ctx.drawImage(oImg, startX, startY, imgWidth, imgHeight, canX, canY, canWidth, canHeight, 1);
            // 添加
            document.getElementById('canvasContainer').appendChild(can);
        },

        /***************************************************************************************************************
         * 下载前的检查
         */
        // 检查所有
        checkBeforeDownload : function (obj) {
            if (!this.checkTerrainIndex(obj)) {
                alert('【地形索引】出错');
                return false;
            }
            return true;
        },

        // 检查TerrainIndex
        checkTerrainIndex : function (obj) {
            return obj.terrainIndex !== "0" && obj.terrainIndex !== "";// 等于0，也就是说没有填写
        },

        /***************************************************************************************************************
         * 下载
         */
        // 下载（txt，lua，图片）
        download : function (params) {
            let isTxt = params.isTxt || false;
            let isLua = params.isLua || false;
            let isImage = params.isImage || false;
            let _this = this;
            // 下载前，检查数据
            if (!this.checkBeforeDownload(this.MapConfig)) {
                return;
            }

            cyber.countdown.start(1 , function () {
                document.getElementById('canvasContainer').innerHTML = '';// 先清空div，再添加div，这样子就可以反复操作
                _this.imageToCanvas();// 将图片转化成canvas
                _this.setTheSizeOfMapEditor();// 获取画板大小
                _this.getZOrder();// 获取顺序,this.MapConfig
            } , function () {
                if (isTxt) _this.downloadText();
                if (isLua) _this.downloadLUA();
                if (isImage) _this.downloadImage();
            });
        },

        // 下载txt
        downloadText : function () {
            let str = JSON.stringify(this.MapConfig, undefined, 4);
            let filename = 'MapConfig';
            window.download(str, filename + '.txt');
        },

        // 下载lua
        downloadLUA : function () {
            let obj = cyber.deepcopy(this.MapConfig);
            // 获取被切的小图片
            obj = this.deletePlistImage(obj);
            obj = this.deleteSpineProperty(obj);
            obj = this.calculateSpineCoordinate(obj);
            obj = this.getSmallImage(this.getCoordY(obj));
            obj = cyber.deletePrivateProperty(obj);// 删除私有属性
            obj = cyber.changeStringToNumber(obj);// 将'数字字符串'从字符串类型 转为 数字类型

            let result = cyber.format.lua({
                obj : obj,
                name : 'MapConfig',
                delimiter : '\n',// WINDOW-'\r\n'; LINUX/UNIX-'\n'; MAC-'\r';
            });

            let filename = 'MapConfig';
            window.download(result, filename + '.lua');
        },

        // 下载canvas小图片
        downloadImage : function () {
            let aCanvasImg = document.getElementsByClassName('imgCan');
            let i = 0;
            getDetail();

            function getDetail() {
                downloadCanvasData();
                if (i < aCanvasImg.length - 1) {// 应为内部要i++，所以这里就要 -1
                    setTimeout(function () {
                        i++;
                        getDetail();
                    }, 1000);
                }
            }

            // 转换canvas成imgdata
            function downloadCanvasData () {
                let type = "image/png";
                let dataURL = aCanvasImg[i].toDataURL(type, 1);// 获取图片base64字符串

                // 如果我们直接将获得的DataURL赋值给a标签的href属性，在点击链接后浏览器只会在新窗口打开图片，并不会直接执行下载。我们可以修改DataURL的Mime-type为octet-stream，强制让浏览器下载。
                let fixtype = function (type) {
                    type = type.toLocaleLowerCase().replace(/jpg/i,'jpeg');
                    let r = type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/'+r;
                };
                dataURL = dataURL.replace(fixtype(type), 'image/octet-stream');// 例：将"image/png" 改成"image/octet-stream"，以便浏览器强制下载，而不是在新页面打开图片
                filename = aCanvasImg[i].title + '.png';
                // 下载
                window.download(dataURL, filename);
            }
        },
    },
});

/**
 * 阻止默认
 */
document.body.ondragover = function (event) {
    let oEvent = event || window.event;
    oEvent.preventDefault();
};

document.body.ondrop = function (event) {
    let oEvent = event || window.event;
    // 这句话为什么是个bug ，我也不清楚
    if (oEvent.target.localName === 'input' && oEvent.target.type === 'text') {
        oEvent.preventDefault();
    }
    if (oEvent.target.localName !== 'input' && oEvent.target.type !== 'file') {
        oEvent.preventDefault();
    }
};