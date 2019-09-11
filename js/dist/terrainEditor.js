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
 * 步骤：
 * 1.上传图片，获取图片数据；(imageData)
 * 2.获取第一个有效点；(firstI)
 * 3.开始递归，找到所有的点；(allPointArray)
 * 4.开始直线判断；()
 *
 *
 * Function:获取图片转折点坐标
 * 学习总结：
 * 1.递归后的回调函数结尾：
 * 2.顺时针，逆时针结尾
 * 3.提 if 判断语句出来成为单独函数；
 * 4.判断斜率 -> 赋值真假 -> 根据真假来赋值给新数据，而不是直接删除
 * 5.判断透明像素是纯透明像素，还是某透明度的像素；
 * 6.凹方向的精准度
 * 7.权重，误差，斜率，远近
 *
 * 递归判断的注释，因为写了一个漂亮的注释，所以我的8个判断更加标准和清晰。
 */

let vm = new Vue({


    /**********************************************************************************************************
	 * 元素属性
     */
	el : '#terrainEditor',


    /**********************************************************************************************************
	 * data属性
     */
	data : {
        // 光标
        cursorRadius : 10,
        //
		alpha : 222,
		thresholdValue : 2,// 阈值
		// 图片
        sFilename : "",
		oImg : new Image(),
		hasImage : false,// 点击确定生成坐标前的一个判断
        //
        imageBase64 : '',
        imageData : [],// 图片信息
		imageWidth : 0,// 为了显示
		imageHeight : 0,// 为了显示
		// 存储数组
		allPointArray : [], // 数组:装有所有坐标点
        consequenceArray : [],// 最终坐标数组，为了下载
        // 出生点
        bornPoints : [],// 出生点

        bornPointDirection : 1,// 出生点方向1-向左，2-向右
        bornGroupConfig : [1, 2, 3, 4, 5],
        bornGroup : 1,
        // 操作
        tabShow : "edge",// tab 当前显示
        showImage : true,// 画原图
        canvasScale : 1,// canvas缩放
        oCoordinate : {
            show : false,
            width : 2,
            color : '#0000ff'// 如有更改，要同时修改html
        },
        oLine : {
            show : false,
            width : 1,
            color : '#ff0000'// 如有更改，要同时修改html
        },
        oArea : {
            show : false,
            opacity : 0.5,
            color : '#80ffff'// 如有更改，要同时修改html
        },
        pointType : 2,// 1-所有点；2-公差点；3-凸多边形点
        isCrucifixShow : true,// 是否显示鼠标十字架
        isCrucifixFull : false,// 十字架是否全屏
        isCrucifixVertical : true,// 是否画竖线
        isCrucifixHorizontal : false,// 是否画横线
        CrucifixDistance : 50,// 十字架长度
        // 显示鼠标当前的坐标
        mouse : {x:0, y:0},
        // 交点坐标
        intersection : {x:0, y:0},
        // 当前交点线段
        segmentStartPoint : {x:0, y:0},// 起始点
        segmentEndPoint : {x:0, y:0},// 结束点
        segmentSlope : 0,// 线段斜率
        //
        edge : null,
    },

    
    /**********************************************************************************************************
	 * computed属性
     */
    computed : {
        // can
        can : function () {
            return document.getElementById('canvas');
        },
        // ctx
        ctx : function () {
            return this.can.getContext('2d');
        },
    },


    /**********************************************************************************************************
	 * method属性
     */
	methods : {

		// 添加图片
		openImage : function (e) {
		    let oEvent = e || window.event;
            let _this = this;
            let oFile = oEvent.target.files[0];
            let reader = new FileReader();
			// 判断是否获取文件
			if (!oFile) return;
            // 判断文件的格式
            let filename = oFile.name;
            if (cyber.getSuffix(filename) !== 'png') {
                alert('图片后缀必须为：png');
                return;
            }
			// 清空之前的操作
            this.filename = '';
            this.imageData = [];
			this.consequenceArray = [];
			// 赋值
            this.filename = cyber.basename(filename, '.png');
            // 读取文件信息
			reader.readAsDataURL(oFile);
			// 如果数据成功，那么只先画原图，不求任何边缘数据
			reader.onload = function () {
			    // 清空
                _this.imageBase64 = '';// 清空数据
                _this.bornPoints = [];// 清空出生点
                _this.clearCanvas();// 清空画布
			    // 赋值
			    _this.imageBase64 = this.result;// 存储数据，但暂时不去求边缘数据
                _this.oImg.src = this.result;
                // 画原图
                _this.oImg.onload = function () {
                    _this.can.width = _this.imageWidth = _this.oImg.naturalWidth;
                    _this.can.height = _this.imageHeight = _this.oImg.naturalHeight;
                    _this.drawImg();
                    // 开关
                    _this.hasImage = true;
                }
			};
			// 清空value
            oEvent.target.value = '';
		},

        // 上传坐标文件
        uploadBornPoints : function (event) {
		    let _this = this;
		    let oEvent = event || window.event;
		    if (!oEvent.target.files) {
		        alert('请上传文件');
		        return;
            }
            //
		    let oFile = oEvent.target.files[0];
		    let filename = oFile.name;
		    if (cyber.getSuffix(filename) !== 'txt') {
		        alert('请上传txt文件');
		        return;
            }
            //
            let reader = new FileReader();
		    reader.readAsText(oFile, 'utf-8');
		    reader.onload = function () {
		        let jsonString = this.result.toString();// 不知道为什么这里要加toString，不然编辑器提示错误
                _this.bornPoints = JSON.parse(jsonString);
            }
        },

        /**
         * 点击操作
         */
        getAndShowCoordinate : function () {
            let _this = this;
            // 获取坐标
            this.getCoordinate(function () {
                // 清空画布
                _this.clearCanvas();
                // 画
                _this.drawAll(_this.consequenceArray);
            });
        },

        // 获取所需要的坐标点
        getCoordinate : function (callback) {
            let _this = this;
            // 清空
            this.consequenceArray = [];
            // 实例化
            this.edge = new cyber.PNGEdge({
                src : this.imageBase64,
                alpha : 222,
                thresholdValue : this.thresholdValue
            });
            // 加载完毕后
            this.edge.imageLoaded(function () {
                // 获取坐标
                switch (_this.pointType) {
                    case 1 :
                        _this.consequenceArray = _this.edge.allEdgePoints;
                        break;

                    case 2 :
                        _this.consequenceArray = _this.edge.allTolerancePoints;
                        break;

                    case 3 :
                        _this.consequenceArray = _this.edge.allConvexPoints;
                        break;

                    default :
                        alert('错误类型');
                        break
                }
                // 回调
                callback && callback();
            });
        },

        // 画所有该画的
        drawAll : function (arr) {
            // 画图
            if (this.showImage) this.drawImg();
            // 画坐标
            if (this.oCoordinate.show) this.drawCoordinary(arr, this.oCoordinate.width, this.oCoordinate.width, this.oCoordinate.color);
            // 画连线
            if (this.oLine.show) this.drawEdge(arr, this.oLine.color, this.oLine.width);
            // 画覆盖
            if (this.oArea.show) this.drawArea(arr, this.oArea.color, this.oArea.opacity);
            // 画所有出生点
            if (this.bornPoints.length !== 0) {
                for (let i = 0; i < this.bornPoints.length; i++) {
                    this.drawCircle(this.bornPoints[i].x, this.bornPoints[i].y, 6, 'yellowgreen');// 颜色
                    this.writeText(i+1, this.bornPoints[i].x, this.bornPoints[i].y);// 写字
                }
            }
            // 画当前交点
            if (this.intersection.x !== 0 || this.intersection.y !== 0) {
                this.drawCircle(this.intersection.x, this.intersection.y, 6, 'rgba(0,0,0,0.3)');
            }
        },

        // 改变阈值
        changeThresholdValue : function (type) {
            switch (type) {
                case 'up' :
                    this.thresholdValue = Number((this.thresholdValue + 0.1).toFixed(1));
                    break;
                    
                case 'down' :
                    if (this.thresholdValue > 0) {
                        this.thresholdValue = Number((this.thresholdValue - 0.1).toFixed(1));
                    }
                    break;
                    
                default :
                    alert('未知类型');
                    break;
            }
            // 执行
            this.getAndShowCoordinate();
        },

        /**
         * 鼠标在canvas 移动
         */
        canvasMoveFn : function (event) {
            if (this.isCrucifixShow) {
                let oEvent = event || window.event;
                let can = document.getElementById('canvas');
                let canvasRect = can.getBoundingClientRect();
                let canLeft = canvasRect.left;
                let canTop = canvasRect.top;
                //
                let point = {
                    x : oEvent.clientX - canLeft,
                    y : oEvent.clientY - canTop
                };
                // 赋值鼠标位置
                this.mouse = {
                    x : parseInt(point.x),
                    y : parseInt(point.y)
                };
                // 清空画布
                this.clearCanvas();
                // 画基础
                this.drawAll(this.consequenceArray);
                // 画十字架
                this.drawCrucifix(point);
                // 判断
                this.getPointBetweenTwoLines(point);
            }
        },

        /**
         * 判断交点
         * @param point 当前鼠标在canvas的坐标点
         */
        getPointBetweenTwoLines : function (point) {
            let arr = this.consequenceArray;
            for (let i = 0; i < arr.length; i++) {
                let AB_startPoint = {};
                let AB_endPoint = {};
                let CD_startPoint = {};
                let CD_endPoint = {};
                // 获取线段,数据上的点
                if (i === arr.length - 1) {
                    AB_startPoint = {x : arr[i].x, y : arr[i].y};
                    AB_endPoint = {x : arr[0].x, y : arr[0].y};
                }
                else {
                    AB_startPoint = {x : arr[i].x, y : arr[i].y};
                    AB_endPoint = {x : arr[i+1].x, y : arr[i+1].y};
                }
                // 鼠标上的垂直点
                CD_startPoint = {x : point.x, y : point.y - this.CrucifixDistance};
                CD_endPoint = {x : point.x, y : point.y + this.CrucifixDistance};
                // 获取焦点坐标
                let p = cyber.mathUtil.getIntersectionBetweenTwoLines(AB_startPoint, AB_endPoint, CD_startPoint, CD_endPoint);
                // 赋值
                if (typeof p === 'object') {// ❤
                    this.intersection = {
                        x : p.x,
                        y : Math.floor(p.y) // 向下去整，lua就向上了
                    };
                    this.segmentStartPoint = {x : AB_startPoint.x, y : AB_startPoint.y};// 线段起始点
                    this.segmentEndPoint = {x : AB_endPoint.x, y : AB_endPoint.y};// 线段结束点
                    this.segmentSlope = Math.atan2(p.y, p.x);// 线段斜率
                }
            }
        },

        // canvas 点击事件
        canvasClickFn : function () {
            $('#bornPoint-modal').modal('show');
        },

        // 添加出生点
        addBornPoint : function () {
            if (this.intersection.x === 0 && this.intersection.y === 0) {
                alert('当前焦点为0，0;无效点');
                return;
            }
            this.bornPoints.push({
                x : this.intersection.x,
                y : this.intersection.y,
                rotation : this.segmentSlope,
                direction : this.bornPointDirection,
                group : this.bornGroup,
            });
        },

        // 删除出生点
        deleteBornPoint : function (index) {
            let confirm = window.confirm('确认删除【第'+(index+1)+'个】出生点吗？');
            if (confirm) {
                this.bornPoints.splice(index, 1);
            }
        },

        /**
         * canvas清空
         */
        clearCanvas : function () {
            this.ctx.clearRect(0, 0, this.can.width, this.can.height);
        },
    
        // canvas画图
        drawImg : function () {
            this.ctx.drawImage(this.oImg, 0, 0, this.can.width, this.can.height);
        },

        // 画坐标点
        drawCoordinary : function (arr, w, h, color) {
        	let _this = this;
            arr.forEach(function(item) {
                _this.drawRect(item.x, item.y, w, h, color);
            });
        },
    
        // 画方形
        drawRect : function (x, y, w, h, color) {
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, w, h);
            this.ctx.fill();
            this.ctx.closePath();
        },

        // 画圆
        drawCircle : function (x, y, r, color) {
            color = color || 'rgba(209, 127, 56, 0.7)';
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        },

        // 写字
        writeText : function (text, x, y, color) {
            color = color || '#000';
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
            this.ctx.closePath();
            this.ctx.restore();
        },
        
        // 画线
        drawline : function(startPoint, endPoint, color, lineWidth) {
            color = color || '#000';
            lineWidth = lineWidth || 1;
            this.ctx.beginPath();
            this.ctx.lineWidth = lineWidth;
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(startPoint.x, startPoint.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            this.ctx.stroke();
            this.ctx.closePath();
        },
        
        // 画边缘数组
        drawEdge : function (arr, color , lineWidth) {
            for (let i = 0; i < arr.length; i++) {
                if (i === arr.length - 1) {
                    this.drawline(arr[i], arr[0], color, lineWidth);
                } else {
                    this.drawline(arr[i], arr[i+1], color, lineWidth);
                }
            }
        },
        
        // 画面积
        drawArea : function (arr, color, opacity) {
            color = color || '#f00';
            opacity = opacity || 0.5;
            
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = opacity;
            this.ctx.moveTo(arr[0].x,arr[0].y);
            for (let i = 1; i < arr.length; i++) {
                this.ctx.lineTo(arr[i].x , arr[i].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.globalAlpha = 1;// 恢复
        },

        // 鼠标画一个十字心
        drawCrucifix : function (point, color) {
            color = color || '#000';
            // 根据鼠标点，计算出十字架的4个点
            let leftPoint;
            let rightPoint;
            let topPoint;
            let bottomPoint;
            //
            if (this.isCrucifixFull) {
                leftPoint = {x : 0, y : point.y};
                rightPoint = {x : this.can.width, y : point.y};
                topPoint = {x : point.x, y : 0};
                bottomPoint = {x : point.x, y : this.can.height};
            }
            else {
                leftPoint = {x : point.x - this.CrucifixDistance, y : point.y};
                rightPoint = {x : point.x + this.CrucifixDistance, y : point.y};
                topPoint = {x : point.x, y : point.y - this.CrucifixDistance};
                bottomPoint = {x : point.x, y : point.y + this.CrucifixDistance};
            }

            // 画
            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = color;
            // 先画横线
            if (this.isCrucifixHorizontal) {
                this.ctx.moveTo(leftPoint.x, leftPoint.y);
                this.ctx.lineTo(rightPoint.x , rightPoint.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            // 再画竖线
            if (this.isCrucifixVertical) {
                this.ctx.moveTo(topPoint.x, topPoint.y);
                this.ctx.lineTo(bottomPoint.x , bottomPoint.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            this.ctx.restore();
        },

        /***************************************************************************************************************
         * 下载
         */
        // 选择下载内容
        downloadContentFn : function (content) {
            this.tabShow = content;
        },

        // 下载文本
        downloadTxt : function (downloadContent) {
            let content = JSON.stringify(downloadContent, null, 4);
            let filename = this.filename + '.txt';// 设置文件名
            window.download(content, filename);
        },

        // 下载json
        downloadJson : function (downloadContent) {
            let content = JSON.stringify(downloadContent, null, 4);
            let filename = this.filename + '.json';
            // 开始下载
            window.download(content, filename);
        },

        /**
         * 一键下载
         */
        downloadAllBornPoints : function (bornPoints) {
            this.downloadTxt(bornPoints);
            this.downloadBornPointsJson(bornPoints);
            this.downloadBornPointsLua(bornPoints);
        },

        /**
         * 下载bornPoints的json格式
         * @param downloadContent
         */
        downloadBornPointsJson : function (downloadContent) {
            let arr = cyber.deepcopy(downloadContent);
            arr = this.changeCoordinateSystemToLUA(arr, this.can.height);
            arr = this.changeBornPointsFormatToJson(arr);
            obj = this.toWenWeiWei(arr);
            let filename = this.filename + '.json';
            let content = JSON.stringify(obj, null, 4);
            window.download(content, filename);
        },

        /**
         * 拼接出 文伟伟的特殊json格式
         * @param bornPoints
         * @returns {{name: (string|*), id: number, bornPoints: *}}
         */
        toWenWeiWei : function (bornPoints) {
            return obj = {
                id : +this.filename.substr(-1, 1),
                bornPoints : bornPoints,
            }
        },

        /**
         * 出生点数据结构 转 文伟伟的json数据结构
         * @param bornPoints
         * @returns {Array}
         */
        changeBornPointsFormatToJson : function (bornPoints) {
            let arr = [];
            for (let i = 0; i < bornPoints.length; i++) {
                let obj = {
                    x : bornPoints[i].x,
                    y : bornPoints[i].y,
                    direction : bornPoints[i].direction,
                    group : bornPoints[i].group,
                };
                arr.push(obj);
            }
            return arr;
        },

        /**
         * 下载edgePoints的lua格式
         * @param downloadContent
         */
        downloadEdgePointsLua : function (downloadContent) {
            let arr = cyber.deepcopy(downloadContent);
            arr = this.changeCoordinateSystemToLUA(arr, this.can.height);
            arr = cyber.changeStringToNumber(arr);
            let content = cyber.format.lua({
                obj : arr,
                name : 'edge',
                delimiter : '\n',// WINDOW-'\r\n';LINUX/UNIX-'\n';MAC-'\r';
            });
            let filename = this.filename + '.lua';
            window.download(content, filename);
        },

        /**
         * 下载bornPoints的lua格式
         * @param downloadContent
         */
        downloadBornPointsLua : function (downloadContent) {
            let arr = cyber.deepcopy(downloadContent);
            arr = this.changeCoordinateSystemToLUA(arr, this.can.height);
            arr = cyber.changeStringToNumber(arr);
            arr = this.changeFormatToLUA(arr);
            let content = cyber.format.lua({
                obj : arr,
                name : 'edge',
                delimiter : '\n',// WINDOW-'\r\n';LINUX/UNIX-'\n';MAC-'\r';
            });
            let filename = this.filename + '.lua';
            window.download(content, filename);
        },

        /**
         * 出生点数据结构 转 吴俊的lua数据结构
         * @param bornPoints
         * @returns {Array}
         */
        changeFormatToLUA : function (bornPoints) {
            let arr = [];
            for (let i = 0; i < bornPoints.length; i++) {
                let obj = {
                    point : {
                        x : bornPoints[i].x,
                        y : bornPoints[i].y,
                    },
                    rotation : bornPoints[i].rotation,
                    direction : bornPoints[i].direction,
                };
                arr.push(obj);
            }
            return arr;
        },

        /**
         * 改变坐标为lua坐标系
         * @param arr
         * @param h
         * @returns {*}
         */
        changeCoordinateSystemToLUA : function (arr, h) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].y = (h-1) - arr[i].y;
            }
            return arr;
        },

    },// methods
});// Vue




let slide = new cyber.Slide("canvas");




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