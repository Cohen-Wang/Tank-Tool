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

    let Slide = (function () {
        // 构造
        function Slide (id, speed) {
            this.oDiv = document.getElementById(id);
            this.speed = speed || 20;

            let _this = this;

            this.oDiv.addEventListener("wheel", function (e) {
                _this.wheelFn(e);
            })
        }
        //
        Slide.prototype.wheelFn = function (event) {
            let oEvent = event || window.event;
            // 阻止默认
            oEvent.preventDefault();
            /**
             * 处理兼容性 ： 特别备注
             * oEvent.wheelDelta（标准）
             *      chrome ， opera 支持
             *      滚轮向上 ： 值为 120； 滚轮向下 ： 值为 -120；
             *
             *  oEvent.deltaY（非标准）
             *      firefox : 滚向向上 ： -3； 滚轮向下 ： 3；
             *      ie : 滚轮向上 ： -63.29999； 滚轮向下 ： 63.29999
             *      所以要加 "-"
             */
            let delta = oEvent.wheelDelta || -oEvent.deltaY;

            if (delta > 0) {
                this.oDiv.style.width = this.oDiv.offsetWidth + this.speed + "px";
                this.oDiv.style.height = this.oDiv.offsetHeight + this.speed + "px";
            } else {
                this.oDiv.style.width = this.oDiv.offsetWidth - this.speed + "px";
                this.oDiv.style.height = this.oDiv.offsetHeight - this.speed + "px";
            }
        };

        return Slide;
    }) ();
    namespace.Slide = Slide;

}) (window.cyber || (cyber = {}));