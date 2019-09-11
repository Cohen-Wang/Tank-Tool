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
 * 总结：
 * 1.type 数据类型，可以还写成全局
 * 2.删除辅助行的时候，可以用一个，删一个；也可以用完后，统一删除
 * 3.函数内部，参数，最好判断下先
 * 4.
 */


/**
 * 必须手动初始化
 */
$(function () {
    $('[data-toggle="popover"]').popover()
});

let vm = new Vue({


    /*******************************************************************************************************************
     * el属性
     */
    el : '#index',


    /*******************************************************************************************************************
     * data属性
     */
    data : {

        //
        checkLocalStorageFlag : false,
        localStorage : 0,// 类型：Number
        //
        navigator_appVersion : '',

        // 客服端信息
        client : {
            ip : returnCitySN['cip'],
            city : returnCitySN['cname'],
        },
        // 网速
        checkNetworkSpeedFlag : false,
        networkSpeed : 0,
        // 服务器信息
        server : {
            ip : "",
        },

        //
        md5 : "请先导入文件",

    },


    /*******************************************************************************************************************
     * methods属性
     */
    methods : {

        // 获取内核信息
        getNavigatorInfo : function () {
            let Sys = {};
            // Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36
            let ua = navigator.userAgent.toLowerCase();
            let s;
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

            //以下进行测试
            let result = '';
            if (Sys.ie) result ='IE: ' + Sys.ie;
            if (Sys.firefox) result = 'Firefox: ' + Sys.firefox;
            if (Sys.chrome) result = 'Chrome: ' + Sys.chrome;
            if (Sys.opera) result = 'Opera: ' + Sys.opera;
            if (Sys.safari) result = 'Safari: ' + Sys.safari;
            // 赋值
            this.navigator_appVersion = (result !== '') ? result : '未获取内容';
        },

        // 测试【剩余本地存储】
        checkTheMaxLocalStorage : function () {
            // 判断
            if (!window.localStorage) {
                alert('当前浏览器不支持localStorage!');
                return;
            }
            let confirm = window.confirm("这里按钮，可以出发多次bug");
            if (confirm) {
                this.checkLocalStorageFlag = true;
                // 变量
                let test = '0123456789';
                // 函数
                let add = function (num) {
                    num += num;
                    if (num.length === 10240) {
                        test = num;
                        return;
                    }
                    add(num);
                };
                add(test);

                let _this = this;
                let sum = test;
                let timer = setInterval(function () {
                    sum += test;
                    try {
                        window.localStorage.removeItem('test');
                        window.localStorage.setItem('test', sum);
                        //
                        _this.localStorage = sum.length / 1024;// sum.length / 1024 + 'KB'
                    } catch(e) {
                        _this.localStorage = sum.length / 1024;// sum.length / 1024 + 'KB超出最大限制'
                        clearInterval(timer);

                        _this.checkLocalStorageFlag = false;
                    }
                }, 1000/60)
            }
        },

        // 测试网络
        checkNetworkSpeed : function () {
            this.checkNetworkSpeedFlag = true;

            let startTime, endTime, fileSize;
            let url = "https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png?id=" + +new Date();
            let xhr = new XMLHttpRequest();
            let _this = this;

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 2) {
                    startTime = Date.now();
                }
                if (xhr.readyState === 4 && xhr.status === 200) {
                    endTime = Date.now();
                    fileSize = xhr.responseText.length;
                    _this.networkSpeed = fileSize  / ((endTime - startTime)/1000) / 1024;

                    _this.checkNetworkSpeedFlag = false;
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        },

        /**
         * 获取IP
         */
        acquireServerAddress : function () {
            let url = "./php/dist/index.php";
            this.$http.post(url , {
                action : "index_acquireIP"
            }, {
                emulateJSON : true
            }).then(function (data) {
                this.server.ip = data.bodyText;
            }, function (response) {
                console.info(response);
            });
        },

        /**
         * 获取文件md5值
         *
         * @param e
         */
        getFileMD5 : function (e) {
            let oEvent = e || window.event;
            let oFile = oEvent.target.files[0];
            let _this = this;
            let reader = new FileReader();
            reader.readAsText(oFile , 'utf-8');
            reader.onload = function () {
                _this.md5 = '';// 清空
                let url = "./php/dist/index.php";
                _this.$http.post(url , {
                    action : "index_getFileMD5",
                    content : this.result,
                }, {
                    emulateJSON : true
                }). then(function (data) {
                    //console.log(data);
                    _this.md5 = data.bodyText;
                }, function (response) {
                    console.info(response);
                });
            };
        },

    },// methods


    /*******************************************************************************************************************
     * computed属性
     */
    computed : {

    },

    /*******************************************************************************************************************
     * created属性
     */
    created : function () {
        // navigator
        this.getNavigatorInfo();
        /**
         * ajax
         */
        this.acquireServerAddress();// 获取服务器IP
    },


});//Vue

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


let time = new Date();
function showspeed () {
    let fs = 1.46*1024;// 图片文件大小(KB)
    let l = 2;// 小数点的位数
    let now = new Date();
    let alltime = fs * 1000 / (now - time);
    let Lnum = Math.pow(10, l);
    let downloadSpeed = Math.round(alltime*Lnum) / Lnum;

    console.log(downloadSpeed);
    vm.network = downloadSpeed;
    vm.$set(vm.$data, "network", downloadSpeed);

    console.log("您的下载速度为：" + downloadSpeed + " (KB/秒)  带宽约" + Math.round(downloadSpeed / 128 * Lnum) / Lnum  + "M");
}