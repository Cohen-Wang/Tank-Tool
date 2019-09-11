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
     * 拖拽
     *
     * @type {Drag}
     */
    let Drag = (function () {
        // 构造
        function Drag (id) {
            this.oBox = document.getElementById(id);
            this.disX = 0;
            this.disY = 0;
            let _this = this;
            // 执行
            this.oBox.onmousedown = function (e) {
                _this.fnDown(e);
            }
        }
        //鼠标按下
        Drag.prototype.fnDown = function (event) {
            let oEvent = event || window.event;

            this.disX = oEvent.clientX - this.oBox.offsetLeft;
            this.disY = oEvent.clientY - this.oBox.offsetTop;

            let _this = this;

            document.onmousemove = function (e) {
                _this.fnMove(e);
            };
            document.onmouseup = function (e) {
                _this.fnUp(e);
            };
        };
        //鼠标移动
        Drag.prototype.fnMove = function (event) {
            let oEvent= event || window.event;

            this.oBox.style.left = oEvent.clientX - this.disX + 'px';
            this.oBox.style.top = oEvent.clientY - this.disY + 'px';
        };
        //鼠标抬起
        Drag.prototype.fnUp = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return Drag;
    }) ();
    namespace.Drag = Drag;

    /**
     * 限制边界的拖拽，继承自Drag
     *
     * @type {DragLimit}
     */
    let DragLimit = (function () {
        // 构造
        function DragLimit (id) {
            Drag.call(this, id);
        }
        // 继承方法
        for (let proto in Drag.prototype) {
            if (Drag.prototype.hasOwnProperty(proto)) {
                DragLimit.prototype[proto] = Drag.prototype[proto];
            }
        }
        // 覆写父类的鼠标移动方法，控制不能移出边界
        DragLimit.prototype.fnMove = function (event) {
            let oEvent= event || window.event;

            let left = oEvent.clientX - this.disX;
            let top = oEvent.clientY - this.disY;

            //控制边界
            if (left < 0) {
                left = 0;
            } else if (left > document.documentElement.clientWidth-this.oBox.offsetWidth) {
                left = document.documentElement.clientWidth-this.oBox.offsetWidth;
            }
            if (top <= 0) {
                top = 0;
            } else if (top > document.documentElement.clientHeight-this.oBox.offsetHeight) {
                top = document.documentElement.clientHeight-this.oBox.offsetHeight;
            }
            this.oBox.style.left = left + 'px';
            this.oBox.style.top = top + 'px';
        };
        return DragLimit;
    }) ();
    namespace.DragLimit = DragLimit;

}) (window.cyber || (cyber = {}));