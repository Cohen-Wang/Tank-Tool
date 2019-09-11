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

(function () {

    /**
     * canvas 操作方法；
     */
    let Canvas = window.Canvas = function (params) {
        // 传参
        this.canvasId = params.canvasId;
        this.width = params.width;
        this.height = params.height;
        this.background = params.background || '#000';
        // 变量
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.background = this.background;
    };

    /**
     * 清空矩形
     * @param {Number} startX x点，可选
     * @param {Number} startY y点，可选
     * @param {Number} w 清空区域的宽，可选
     * @param {Number} h 清空区域的高，可选
     */
    Canvas.prototype.clearRect = function (startX, startY, w, h) {
        startX = startX || 0;
        startY = startY || 0;
        w = w || this.canvas.width;
        h = h || this.canvas.height;
        this.ctx.clearRect(startX, startY, w, h);
    };

    /**
     * 画圆
     * @param {Number} x ： x轴，必须填，无默认值
     * @param {Number} y ： y轴，必须填，无默认值
     * @param {Number} radius ： 半径，必须填，无默认值
     * @param {String} color : 颜色，可选，默认黑色
     */
    Canvas.prototype.drawCircle = function (x, y, radius, color) {
        color = color || '#000000';
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    };

    /**
     * 空心圆
     */
    Canvas.prototype.drawHollowCircle = function (x, y, radius, lineWidth, color) {
        color = color || '#000000';
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    };

    /**
     * 画方形
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param {String} color
     */
    Canvas.prototype.drawRect = function (x, y, w, h, color) {
        color = color || "#f00";
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.closePath();
    };

    /**
     * 空心方块
     */
    Canvas.prototype.drawHollowRect = function (x, y, w, h, lineWidth, color) {
        color = color || "#f00";
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.closePath();
    };

    /**
     * 画直线
     * @param {Number} startX : 起始点X
     * @param {Number} startY : 起始点Y
     * @param {Number} endX : 结束点X
     * @param {Number} endY : 结束点Y
     * @param {String} [color] : 颜色，可选，默认黑色
     * @param {Number} [lineWidth] : 线的宽度，可选，默认1
     */
    Canvas.prototype.drawLine = function (startX, startY, endX, endY, color, lineWidth) {
        color = color || '#000000';
        lineWidth = lineWidth || 1;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.closePath();
    };

    /**
     * 画填充
     * @param {Object} arr : 坐标数组
     * @param {String} color
     */
    Canvas.prototype.drawArea = function (arr, color, opacity) {
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
    };

    /**
     * 写文字
     * @param {String} text
     * @param {Number} x
     * @param {Number} y
     * @param {String} font
     * @param {String} color
     */
    Canvas.prototype.writeText = function (text, x, y, font, color) {
        font = font || '12px Arial';
        color = color || '#000000';
        this.ctx.beginPath();
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        this.ctx.closePath();
    };



    /**
     * 实体字
     */
    Canvas.prototype.fillText = function (ctx, text, x, y, color, font) {
        color = color || 'red';
        font = font || '12px Arial';
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(text, x, y);
        ctx.closePath();
        ctx.restore();
    };

    /**
     * 写空心字
     */
    Canvas.prototype.strokeText = function (ctx, text, x, y, color, font) {
        color = color || 'red';
        font = font || '12px Arial';
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.font = font;
        ctx.strokeText(text, x, y);
        ctx.closePath();
        ctx.restore();
    };




    /**
     * 构造
     */
    CYBER.CanvasDrawImage = function (imgData) {
        this.oImg = new Image();
        this.oImg.src = imgData;
    };

    /**
     * 判断加载
     */
    CYBER.CanvasDrawImage.prototype.loaded = function (callback) {
        this.oImg.onload = function () {
            callback && callback();
        }
    };

    /**
     * 画
     */
    CYBER.CanvasDrawImage.prototype.drawImage = function (ctx, x, y, translateX, translateY, angel) {
        ctx.save();
        ctx.beginPath();

        ctx.translate(translateX, translateY);
        ctx.rotate(angel * Math.PI / 180);

        ctx.drawImage(this.oImg, x, y);

        ctx.closePath();
        ctx.restore();
    };

}) (window);