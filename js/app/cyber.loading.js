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


    let __extend = function (_child, _super) {
        for (let p in _super.prototype) {
            if (_super.prototype.hasOwnProperty(p)) {
                _child.prototype[p] = _super.prototype[p];
            }
        }
    };

    // 遮罩层
    let MaskLayer = (function () {
        // 构造
        function MaskLayer() {
            this.masklayer = document.createElement('div');

            this.masklayer.id = "masklayer";
            // 初始化 - 遮罩层 - 样式
            this.masklayer.style.cssText += "position: fixed";
            this.masklayer.style.cssText += 'left: 0';
            this.masklayer.style.cssText += 'right: 0';
            this.masklayer.style.cssText += 'top: 0';
            this.masklayer.style.cssText += 'bottom: 0';
            this.masklayer.style.cssText += 'background-color: rgba(255, 255, 255, 0.8)';// TODO 到底用哪个好？
            //this.oLayer.style.cssText += 'opacity: 0.8';
            this.masklayer.style.cssText += 'z-index: 9990';
            this.masklayer.style.cssText += 'display: block';
            this.masklayer.style.cssText += 'cursor:not-allowed';// 禁止选择
            this.masklayer.style.webkitUserSelect = 'none';// 禁止选择
            this.masklayer.style.mozUserSelect = 'none';// 禁止选择
            this.masklayer.style.msUserSelect = 'none';// 禁止选择
            this.masklayer.style.userSelect = 'none';// 禁止选择
        }
        // 获取样式
        function getStyle(obj, attr) {
            return (obj.currentStyle) ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
        }
        let originalBodyOverflow = '';// 私有
        // 显示
        MaskLayer.prototype.show = function () {
            originalBodyOverflow = getStyle(document.body, 'overflow');// 存储overflow属性
            document.body.style.overflow = 'hidden';
            document.body.appendChild(this.masklayer);
        };
        // 隐藏
        MaskLayer.prototype.hide = function () {
            document.body.removeChild(this.masklayer);
            document.body.style.overflow = originalBodyOverflow;// 还原overflow属性
        };
        return MaskLayer;
    }) ();





    let Canvas = (function () {
        // 构造
        function Canvas (id) {
            this.id = id;
            this.createCanvas();
        }
        // 创建canvas
        Canvas.prototype.createCanvas = function () {
            this.oContainer = document.getElementById(this.id);

            this.can = document.createElement('canvas');
            this.ctx = this.can.getContext('2d');

            this.can.width = this.oContainer.offsetWidth;
            this.can.height = this.oContainer.offsetHeight;

            this.oContainer.appendChild(this.can);
        };
        return Canvas;
    }) ();


    // 命名空间
    (function (loading) {


        let WavePlant = (function () {
            // 构造
            function WavePlant () {

                //



                //
                this.resize();
            }
            // 继承
            __extend(WavePlant, MaskLayer);
            //
            WavePlant.prototype.resize = function () {
                let _this = this;

                window.addEventListener('resize', function () {
                    let x = window.innerWidth / 2;
                    let y = window.innerHeight / 2;

                    _this.canvas.setCanvasPosition(x, y, 200, 200, "rgba(0, 0, 0, 0.1)");
                })
            };


            
            
            return WavePlant;
        }) ();
        loading.wavePlant = new WavePlant();



    }) (cyber.loading || (namespace.loading = Object.create(null)));


    let Plant = (function () {
        // 构造
        function Plant (startX, startY, endX, endY, amp, color) {
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.amp = amp;
            this.color = color;
            //
            this.lineWidth = 14;
            this.globalAlpha = 0.8;
        }
        // 绘画
        Plant.prototype.draw = function (ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = "round";
            ctx.globalAlpha = this.globalAlpha;
            ctx.strokeStyle = this.color;
            // 关键两步
            ctx.moveTo(this.startX, this.startY);
            //ctx.lineTo(this.endX, this.endY);// 直线
            ctx.quadraticCurveTo(this.startX, this.startY - 120, this.endX, this.endY);// 弧度线：贝塞尔曲线
            //
            ctx.stroke();
            ctx.restore();
        };
        return Plant;
    }) ();


    let WavePlant = (function () {
        // 构造
        function WavePlant (id) {
            Canvas.call(this, id);
            //
            this.num = 200;
            this.color = "rgb(10, 108, 70)";
            this.beta = 0;
            // 创建
            this.plants = this.createPlant(this.num);
            //
            this.start();
        }
        // 继承
        __extend(WavePlant, Canvas);
        //
        function random (m, n) {
            return Math.random() * (n - m) + m;
        }
        // 创建水草
        WavePlant.prototype.createPlant = function (num) {
            let plants = [];
            for (let i = 0; i < num; i++) {
                // 创建数据
                let startX = Math.random() * 20 + i * 10;// 均匀生成startX
                let startY = this.can.height;
                let endX = startX;// 结束点X坐标（变动）
                let endY = this.can.height * .66 - Math.random() * 100;// 结束点Y坐标（固定）
                let amp = random(40, 50); // 40 ~ 50
                // 生成
                plants.push(new Plant(startX, startY, endX, endY, amp, this.color));
            }
            return plants;
        };
        // 更新
        WavePlant.prototype.update = function () {
            // Math.sin的应用
            this.beta ++;
            let l = Math.sin(this.beta * 0.02);
            // 变动
            for (let i = 0; i < this.plants.length; i++) {
                // 周期性改变水草的顶点X坐标
                this.plants[i].endX = this.plants[i].startX + l * this.plants[i].amp;
            }
        };
        // 渲染
        WavePlant.prototype.render = function () {
            for (let i = 0; i < this.plants.length; i++) {
                this.plants[i].draw(this.ctx);
            }
        };
        // 开始动
        WavePlant.prototype.start = function () {
            let _this = this;
            go();
            function go () {
                window.requestAnimationFrame(go);
                // 清空
                _this.ctx.clearRect(0, 0, _this.can.width, _this.can.height);
                //
                _this.update();
                _this.render();
            }
        };
        return WavePlant;
    }) ();


}) (window.cyber || (cyber = {}));