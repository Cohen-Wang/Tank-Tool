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

(function (namespace) {

    let PNGEdge = (function () {
        /**
         * 获取透明图片边缘
         * @type {Window.PNGEdge}
         */
        function PNGEdge (params) {
            // 传参
            this.src            = params.src;// 图片src
            this.alpha          = params.alpha || 222;// 边缘透明度值;范围 0 < alpha < 255
            this.thresholdValue = params.thresholdValue || 1;// 阈值 thresholdValue > 0
            this.type           = params.type || 'json';// 导出格式，默认为json
            // 设置canvas
            this.can = document.createElement('canvas');
            this.ctx = this.can.getContext('2d');
            // 初始化图片像素数据
            this.imageData = [];// 获取图片像数数据
            this.firstI = 0;// 获取的第一个坐标点的索引
            // public
            this.allEdgeIndexes = [];// 获取图片边缘点的 索引
            this.allEdgePoints = [];// 获取所有边缘坐标点
            this.allTolerancePoints = [];// 存储所有公差算法的点
            this.allConvexPoints = [];// 存储所有的凸多边形点
            //
            this.tempI = 0;
        }

        /**
         * 图片加载完毕
         */
        PNGEdge.prototype.imageLoaded = function (callback) {
            let _this = this;
            this.oImg = new Image();
            this.oImg.src = this.src;
            this.oImg.onload = function () {
                // 赋值：宽高
                _this.can.width = _this.imageWidth = _this.oImg.naturalWidth;
                _this.can.height = _this.imageHeight = _this.oImg.naturalHeight;
                // 赋值：图片数据
                _this._drawImage();
                _this.imageData = _this._getImageData();
                // 赋值：firstI
                _this.firstI = _this._getFirstI();
                // 赋值：获取所有边缘点的索引
                _this._getEdgeIndexes(_this.firstI);
                // 赋值：将所有索引转换为坐标
                for (let i = 0; i < _this.allEdgeIndexes.length; i++) {
                    _this.allEdgePoints.push(_this._getXY(_this.allEdgeIndexes[i]));
                }
                // 赋值：公差算法后的点
                _this.allTolerancePoints = _this._getToleranceArray();
                // 赋值：凸多边形点
                _this.allConvexPoints = _this._getAllConvexPoints();
                // 回调函数
                callback && callback();
            };
        };

        /**
         * public
         * 获取公差算法结果
         * @returns {Array}
         */
        PNGEdge.prototype._getToleranceArray = function () {
            let arr = cyber.deepcopy(this.allEdgePoints);// 中间数组
            arr = this._deleteByStraightLine(arr);// 删除横竖
            arr = this._deleteByAdjacentPoint(arr);// 删除临近
            arr = this._deleteByTolerance(arr);// 公差算法
            return arr;
        };

        /**
         * public
         * 获取凸多边形计算结果
         * @returns {Array}
         */
        PNGEdge.prototype._getAllConvexPoints = function () {
            let arr = cyber.deepcopy(this.allEdgePoints);// 中间数组
            arr = this._deleteByStraightLine(arr);// 删除横竖
            arr = this._deleteByAdjacentPoint(arr);// 删除临近
            arr = this._deleteByTolerance(arr);// 公差算法
            arr = this._deleteByConvexPolygon(arr);// 删除凸多边形
            return arr;
        };

        /**
         * canvas-画图
         */
        PNGEdge.prototype._drawImage = function () {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.drawImage(this.oImg, 0, 0, this.can.width, this.can.height);
            this.ctx.closePath();
            this.ctx.restore();
        };

        /**
         * canvas-获取图片像素信息
         */
        PNGEdge.prototype._getImageData = function () {
            return this.ctx.getImageData(0, 0, this.can.width, this.can.height).data;
        };

        /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓坐标点↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
        /**
         * 获取第一个有效点的索引
         * @returns {number}
         */
        PNGEdge.prototype._getFirstI = function () {
            let i = 3;
            do {
                i += 4;
            } while (this.imageData[i] <= this.alpha);
            return i;
        };

        /**
         * 递归-获取所有边缘点的索引
         */
        PNGEdge.prototype._getEdgeIndexes = function (i) {
            this.tempI = i;
            do {
                // 8个方向
                let leftTopI        = this.tempI - this.imageWidth * 4 - 4;      // 左上
                let leftI           = this.tempI - 4;						    // 左
                let leftDownI       = this.tempI + this.imageWidth * 4 - 4;	    // 左下
                let downI           = this.tempI + this.imageWidth * 4;			// 下
                let rightDownI      = this.tempI + this.imageWidth * 4 + 4;	    // 右下
                let rightI          = this.tempI + 4;							// 右
                let rightTopI       = this.tempI - this.imageWidth * 4 + 4;	    // 右上
                let topI            = this.tempI - this.imageWidth * 4;			// 上
                // 赋值
                let leftTopIAlpha   = this.imageData[leftTopI]      || 0;
                let leftIAlpha      = this.imageData[leftI]         || 0;
                let leftDownIAlpha  = this.imageData[leftDownI]     || 0;
                let downIAlpha      = this.imageData[downI]         || 0;
                let rightDownIAlpha = this.imageData[rightDownI]    || 0;
                let rightIAlpha     = this.imageData[rightI]        || 0;
                let rightTopIAlpha  = this.imageData[rightTopI]     || 0;
                let topIAlpha       = this.imageData[topI]          || 0;
                // 判断真假边缘
                if (this._getXY(leftTopI).x + 1  !== this._getXY(this.tempI).x    || this._getXY(leftTopI).y + 1   !== this._getXY(this.tempI).y) leftTopIAlpha = 0;
                if (this._getXY(leftI).x + 1     !== this._getXY(this.tempI).x    || this._getXY(leftI).y          !== this._getXY(this.tempI).y) leftIAlpha = 0;
                if (this._getXY(leftDownI).x + 1 !== this._getXY(this.tempI).x    || this._getXY(leftDownI).y - 1  !== this._getXY(this.tempI).y) leftDownIAlpha = 0;
                if (this._getXY(downI).x         !== this._getXY(this.tempI).x    || this._getXY(downI).y - 1      !== this._getXY(this.tempI).y) downIAlpha = 0;
                if (this._getXY(rightDownI).x - 1 !== this._getXY(this.tempI).x   || this._getXY(rightDownI).y - 1 !== this._getXY(this.tempI).y) rightDownIAlpha = 0;
                if (this._getXY(rightI).x - 1    !== this._getXY(this.tempI).x    || this._getXY(rightI).y         !== this._getXY(this.tempI).y) rightIAlpha = 0;
                if (this._getXY(rightTopI).x - 1 !== this._getXY(this.tempI).x    || this._getXY(rightTopI).y + 1  !== this._getXY(this.tempI).y) rightTopIAlpha = 0;
                if (this._getXY(topI).x          !== this._getXY(this.tempI).x    || this._getXY(topI).y + 1       !== this._getXY(this.tempI).y) topIAlpha = 0;

                /**
                 * 左
                 * +-+-+-+
                 * |0|0| |
                 * +-+-+-+
                 * |#|#| |
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 */
                if (leftTopIAlpha < this.alpha && topIAlpha < this.alpha && leftIAlpha >= this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.tempI = leftI;
                }
                /**
                 * 左下
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 * |0|#| |
                 * +-+-+-+
                 * |#|#| |
                 * +-+-+-+
                 */
                else if (leftIAlpha < this.alpha && leftDownIAlpha >= this.alpha && downIAlpha >= this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.allEdgeIndexes.push(downI);
                    this.tempI = leftDownI;
                }
                /**
                 * 下
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 * |0|#| |
                 * +-+-+-+
                 * |0|#| |
                 * +-+-+-+
                 */
                else if (leftIAlpha < this.alpha && leftDownIAlpha < this.alpha && downIAlpha >= this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.tempI = downI;
                }
                /**
                 * 右下
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 * | |#|#|
                 * +-+-+-+
                 * | |0|#|
                 * +-+-+-+
                 */
                else if (downIAlpha < this.alpha && rightIAlpha >= this.alpha && rightDownIAlpha >= this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.allEdgeIndexes.push(rightI);
                    this.tempI = rightDownI;
                }
                /**
                 * 右
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 * | |#|#|
                 * +-+-+-+
                 * | |0|0|
                 * +-+-+-+
                 */
                else if (downIAlpha < this.alpha && rightDownIAlpha < this.alpha && rightIAlpha >= this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.tempI = rightI;
                }
                /**
                 * 右上
                 * +-+-+-+
                 * | |#|#|
                 * +-+-+-+
                 * | |#|0|
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 */
                else if (topIAlpha >= this.alpha && rightTopIAlpha >= this.alpha && rightIAlpha < this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.allEdgeIndexes.push(topI);
                    this.tempI = rightTopI;
                }
                /**
                 * 上
                 * +-+-+-+
                 * | |#|0|
                 * +-+-+-+
                 * | |#|0|
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 */
                else if (topIAlpha >= this.alpha && rightTopIAlpha < this.alpha && rightIAlpha < this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.tempI = topI;
                }
                /**
                 * 左上
                 * +-+-+-+
                 * |#|0| |
                 * +-+-+-+
                 * |#|#| |
                 * +-+-+-+
                 * | | | |
                 * +-+-+-+
                 */
                else if (topIAlpha < this.alpha && leftTopIAlpha >= this.alpha && leftIAlpha >= this.alpha) {
                    this.allEdgeIndexes.push(this.tempI);
                    this.allEdgeIndexes.push(leftI);
                    this.tempI = leftTopI;
                }
                else {
                    console.log('没有递归了');
                    console.log('leftTopIAlpha:'+leftTopIAlpha);
                    console.log('leftIAlpha:'+leftIAlpha);
                    console.log('leftDownIAlpha:'+leftDownIAlpha);
                    console.log('downIAlpha:'+downIAlpha);
                    console.log('rightDownIAlpha:'+rightDownIAlpha);
                    console.log('rightIAlpha:'+rightIAlpha);
                    console.log('rightTopIAlpha:'+rightTopIAlpha);
                    console.log('topIAlpha:'+topIAlpha);
                }
            } while (this.tempI !== this.firstI && this.allEdgeIndexes.length <= 25000);// 第二个判断条件是我们为了查看错误而设置的
        };

        // 将有效的i转化成x，y坐标
        PNGEdge.prototype._getXY = function (i) {
            // 换算成这个点的坐标
            let num = (i + 1) / 4;// 加1是因为索引从0开始；除以4因为每个像素点有4个数字表示
            //
            let x;
            if (this.imageWidth === 1) {
                x = 0;
            }
            else {
                if (num % this.imageWidth === 0) {
                    x = this.imageWidth;
                }
                else {
                    x = num % this.imageWidth - 1;
                }
            }
            // 返回坐标
            return {
                x : x,
                y : Math.floor(num / this.imageWidth)
            };
        };

        /***********************************************************************************************************
         * 算法
         */

        /**
         * 算法：删除直线，只留两边的点
         */
        PNGEdge.prototype._deleteByStraightLine = function (arr) {
            for (let i = 1; i < arr.length ; i++) {// ❤ i = 1
                // 变量
                let backwardI = i - 1;
                let forwardI = i + 1;
                // 最后一个点
                if (i === arr.length - 1) forwardI = 0;
                // 变量-距离
                let dx12 = Math.abs(arr[backwardI].x - arr[i].x);
                let dy12 = Math.abs(arr[backwardI].y - arr[i].y);
                let dx23 = Math.abs(arr[forwardI].x - arr[i].x);
                let dy23 = Math.abs(arr[forwardI].y - arr[i].y);
                // 判断
                if (((dy12 === 0 && dx12 === 1) && (dy23 === 0 && dx23 === 1)) // 竖
                    || ((dy12 === 1 && dx12 === 0) && (dy23 === 1 && dx23 === 0))// 横
                ) {
                    arr[i].canDelete = true;
                }
            }
            // 再删除
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i].hasOwnProperty('canDelete')) {
                    arr.splice(i, 1);
                }
            }
            return arr;
        };

        /**
         * 算法：删除相邻点
         */
        PNGEdge.prototype._deleteByAdjacentPoint = function (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (i < arr.length - 1) {// 不需要判断最后一个点
                    // 变量
                    let p1 = arr[i];
                    let p2 = arr[i+1];
                    let dx = p2.x - p1.x;
                    let dy = p2.y - p1.y;
                    // 判断
                    if (((dx === 1 || dx === -1) && dy === 0) || ((dy === 1 || dy === -1) && dx === 0)) {
                        arr.splice(i + 1, 1);
                        i--;
                    }
                }
            }
            return arr;
        };

        /**
         * 过任意两点的直线表达式
         * @param {Object} startPoint
         * @param {Object} endPoint
         * @param {Object} thirdPoint
         * return {Number} len : 距离
         */
        function getDistanceBetweenLineAndPoint (startPoint, endPoint, thirdPoint) {
            let a = endPoint.y - startPoint.y;
            let b = startPoint.x - endPoint.x;
            let c = endPoint.x * startPoint.y - startPoint.x * endPoint.y;

            let d = Math.sqrt(a * a + b * b);

            if (d === 0) {
                let dx = endPoint.x - startPoint.x;
                let dy = endPoint.y - startPoint.y;
                return Math.sqrt(dx * dx + dy * dy);
            } else {
                return Math.abs(a * thirdPoint.x + b * thirdPoint.y + c) / d;
            }
        }

        /**
         * 算法：公差算法
         */
        PNGEdge.prototype._deleteByTolerance = function (arr) {
            let found = false;

            for (let i = 0; i < arr.length - 2; i += 2) {
                let distance = getDistanceBetweenLineAndPoint(arr[i], arr[i+2], arr[i+1]);
                if (distance <= this.thresholdValue) {
                    arr.splice(i+1, 1);
                    i--;

                    found = true;
                }
            }
            if (found) {
                return this._deleteByTolerance(arr);
            }
            return arr;
        };

        /**
         * 求出点与直线的位置关系
         * @param startPoint 直线上的一个点
         * @param endPoint 直线上的一个点
         * @param pt
         * @return 返回直线方程的d值（ =0 在直线上；> 0 在直线右方；< 0 在直线左方）
         */
        function checkRelationBetweenLineAndPoint (startPoint, endPoint, pt) {
            // 计算直线方程的参数
            let a = endPoint.y - startPoint.y;
            let b = startPoint.x - endPoint.x;
            let c = endPoint.x * startPoint.y - startPoint.x * endPoint.y;
            return a * pt.x + b * pt.y + c;
        }

        /**
         * 算法：删除凹点
         * 求出点与直线的位置关系
         */
        PNGEdge.prototype._deleteByConvexPolygon = function (arr) {
            for (let i = 0; i < arr.length; i++) {
                //
                let i1 = i;
                let i2 = (i1 + 1) % arr.length;
                let i3 = (i2 + 1) % arr.length;
                //
                let p1 = arr[i1];
                let p2 = arr[i2];
                let p3 = arr[i3];
                //
                let result = checkRelationBetweenLineAndPoint(p1, p2, p3);
                // 注意js 坐标系和 lua 坐标系区别，在js中，凸多边形，用 < 0
                if (result < 0) {
                    arr.splice(i2, 1);
                    return this._deleteByConvexPolygon(arr);
                }
            }
            return arr;
        };

        return PNGEdge;// 返回PNGEdge类

    }) ();
    namespace.PNGEdge = PNGEdge;

}) (window.cyber || (cyber = {}));