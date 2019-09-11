
(function () {

    // 创建命名空间
    let window.cyber = window.cyber || {};

	// 需要加载的js文件列表
    let JS_LIST = [
        "app/cyber.createClass.js",
        "lib/Object.js",
        "lib/Component.js",
        "lib/Button.js",
    ];

    let JS_LIST_COUNT = 1;
    let JS_LOADED_COUNT = 0;

    function downloadJSAtOnload () {
        for(let i=0,l=JS_LIST.length; i<l; i++){
            let element = document.createElement("script");
            element.src = "../js/" + JS_LIST[i];
            document.body.appendChild(element);
        }
    }

    if (window.addEventListener) {
        window.addEventListener("load",downloadJSAtOnload, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload",downloadJSAtOnload);
    } else {
        window.onload = downloadJSAtOnload;
    }

    /**
     * 文档加载完成的回掉函数
     * @param {Object} window
     */
    cyber.onLoad = function (window) {
        //for ....
        $.getScript("outer.js", cyber.onComplete);

    };

    /**
     *
     */
    cyber.onComplete = function () {
        JS_LOADED_COUNT += 1;
        if (JS_LOADED_COUNT === JS_LIST_COUNT) {
            cyber.run();
        } else {
            console.log("loading javascript ", JS_LOADED_COUNT);
        }
    }




}) (window);