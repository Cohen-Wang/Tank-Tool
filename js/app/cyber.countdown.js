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

    /**
     * 遮罩层
     *
     * @type {MaskLayer}
     */
    let MaskLayer = (function () {
        // 构造
        function MaskLayer () {
            this.masklayer = document.createElement('div');
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
        function getStyle (obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return getComputedStyle(obj, null)[attr];
            }
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

    /**
     * 倒计时
     *
     * @type {CountDown}
     */
    let CountDown = (function () {
        // 构造
        function CountDown () {
            MaskLayer.call(this);
            //
            this.countDownLayer = document.createElement('div');
            // 初始化 - 倒计时 - 样式
            this.countDownLayer.style.cssText += 'position: fixed';
            this.countDownLayer.style.cssText += 'top: 0';
            this.countDownLayer.style.cssText += 'right: 0';
            this.countDownLayer.style.cssText += 'bottom: 0';
            this.countDownLayer.style.cssText += 'left: 0';
            this.countDownLayer.style.cssText += 'animation: pulse 1s ease infinite';
            this.countDownLayer.style.cssText += 'margin: auto';
            this.countDownLayer.style.cssText += 'height: 200px';
            this.countDownLayer.style.cssText += 'text-align: center';
            this.countDownLayer.style.cssText += 'display: block';
            this.countDownLayer.style.cssText += 'font: 900 120px/1 "微软雅黑"';
            this.countDownLayer.style.cssText += 'color: rgb(226,41,69)';
            this.countDownLayer.style.cssText += 'text-shadow: 2px 5px 65px #fff';
            this.countDownLayer.style.cssText += 'z-index: 9999';
            this.countDownLayer.style.cssText += 'text-shadow: 5px 5px 15px #666';
            this.countDownLayer.style.webkitUserSelect = 'none';// 禁止选择
            this.countDownLayer.style.mozUserSelect = 'none';// 禁止选择
            this.countDownLayer.style.msUserSelect = 'none';// 禁止选择
            this.countDownLayer.style.userSelect = 'none';// 禁止选择
            // 添加
            this.masklayer.appendChild(this.countDownLayer);
        }
        // 继承
        for (let prop in MaskLayer.prototype) {
            if (MaskLayer.prototype.hasOwnProperty(prop)) {
                CountDown.prototype[prop] = MaskLayer.prototype[prop];
            }
        }
        // 判断数字类型
        function isNumber (param) {
            return Object.prototype.toString.call(param) === '[object Number]';
        }
        // 判断undefined
        function isUndefined (param) {
            return Object.prototype.toString.call(param) === '[object Undefined]';
        }
        // 开始倒计时
        CountDown.prototype.start = function (num, startFn, endFn) {
            if (!isUndefined(num) && !isNumber(num)) {// 要么不填，要么必须填写数字
                throw new Error("the type of first parameter in startCountDown function must be number");
            }
            let countdownNumber = (typeof num !== 'undefined') ? Math.abs(Math.round(num)) : 3;// 必须处理为正整数
            let timer = null;

            // 先关闭
            clearInterval(timer);
            // 显示
            this.show(countdownNumber);
            this.setInnerHTML(countdownNumber);
            // 倒计时前 - 执行函数
            startFn && startFn();
            // 开始倒计时
            timer = window.setInterval(function () {
                countdownNumber--;
                //
                switch (countdownNumber) {
                    case -1:
                        // 关闭计时器
                        clearInterval(timer);
                        // 隐藏
                        this.hide();
                        // 倒计时后 - 执行函数
                        endFn && endFn();
                        break;

                    case 0:
                        this.countDownLayer.innerHTML = 'Go!';
                        break;

                    default:
                        this.countDownLayer.innerHTML = countdownNumber;
                }
            }.bind(this), 1000)
        };
        // 设置文字内容
        CountDown.prototype.setInnerHTML = function (countdownNumber) {
            this.countDownLayer.innerHTML = (countdownNumber === 0) ? 'Go!' : countdownNumber;
        };
        return CountDown;
    }) ();
    namespace.countdown = new CountDown();

}) (window.cyber || (cyber = {}));