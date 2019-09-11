/***************************************
 * 赛贝洱科技技术有限责任公司web端工具函数
 ***************************************
 * copy : 2010 ~ 2018
 * website : http://www.cbergame.com/
 ***************************************
 * author : cohen_wang
 * date : 2018-03-13
 ***************************************
 */

(function (namespace) {


    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓DOM↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    // 获取元素id
    namespace.getId = function (id) {
		return document.getElementById(id);
	};
    
    
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓css-class↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    // 判断是否含有某个class
    namespace.hasClass = function (elements, cName) {
        let reg = new RegExp("(\\s|^)" + cName + "(\\s|$)");
        return (elements.className.match(reg));
    };
    
    // 添加class
    namespace.addClass = function (elements, cName) {
        if(!this.hasClass(elements, cName)) {
            elements.className += " " + cName;
        }
    };
    
    // 除某个class
    namespace.removeClass = function (elements, cName) {
        if (this.hasClass(elements, cName)) {
            elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)" ), " ");
        }
    };
    
    
    
    
    
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓类型判断↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    let toString = Object.prototype.toString;

    /**
     * Undefined type check
     */
    const UNDEFINED_STRING = "[object Undefined]";
    namespace.isUndefined = function (param) {
        return toString.call(param) === UNDEFINED_STRING;
    };

    namespace.isNull = function (val) {
        return val === null;
    };

    /**
     * Boolean type check
     */
    const BOOLEAN_STRING = "[object Boolean]";
    namespace.isBoolean = function (param) {
        return toString.call(param) === BOOLEAN_STRING;
    };

    /**
     * Number type check
     */
    const NUMBER_STRING = "[object Number]";
    namespace.isNumber = function (param) {
        return toString.call(param) === NUMBER_STRING;
    };

    /**
     * String type check
     */
    const STRING_STRING = "[object String]";
    namespace.isString = function (param) {
        return Object.prototype.toString.call(param) === STRING_STRING;
    };

    /**
     * Array type check
     */
    const ARRAY_STRING = "[object Array]";
    namespace.isArray = function (param) {
        return toString.call(param) === ARRAY_STRING;
    };

    /**
     * Quick object check
     * both array and object return true
     */
    namespace.isObject = function (param) {
        return param !== null && typeof param === 'object'
    };

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    const OBJECT_STRING = "[object Object]";
    namespace.isPlainObject = function (param) {
        return toString.call(param) === OBJECT_STRING;
    };

    /**
     * Date type check
     */
    const DATE_STRING = "[object Date]";
    namespace.isDate = function (param) {
        return toString.call(param) === DATE_STRING;
    };

    /**
     * RegExp type check
     */
    const REGEXP_STRING = "[object RegExp]";
    namespace.isRegExp = function (param) {
        return toString.call(param) === REGEXP_STRING;
    };
    
    // isNumberSting 如：'123'
    namespace.isNumberString = function (content) {
        return (
            !isNaN(content)
            && typeof content === 'boolean' // true ,false
            && namespace.isArray(content) // [123]
            && namespace.isEmptyString(content)
        );
    };
    

    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓类型转换↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    // namespace.convertToNumber = function (content) {
    //     if (namespace.isString(content)) {
    //         let reg = /^\d+$/ig;
    //         if (reg.test(content)) {
    //             return Number(content);
    //         }
    //         else {
    //             return ;
    //         }
    //     }
    //     else if (namespace.isNumber(content)) {
    //         return content;
    //     }
    //     else {
    //         return;
    //     }
    // };





    /*******************************************************************************************************************
     * String工具
     */

    /**
     * 清空字符串两边空白
     * @param str
     * @returns {*|void|string}
     */
    namespace.trim = function (str) {
		return str.replace(/^\s+|\s+$/g, "");
	};
    
    // 空字符串
    namespace.isEmptyString = function (str) {
        return (typeof str === 'string' && str.length === 0);
    };

    /**
     * UppercaseFirst : 单词首字母大写
     * @param str
     * @returns {string}
     */
    namespace.ucfirst = function (str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    };

    /**
     * LowercaseFirst ： 单词首字母小写
     * @param str
     * @returns {string}
     */
    namespace.lcfirst = function (str) {
        return str.slice(0, 1).toLowerCase() + str.slice(1);
    };

    /**
     * UppercaseWord ：一句话中，所有单词首字母大写
     * @param str
     * @returns {string}
     */
    namespace.ucword = function (str) {
        let arr = str.toLowerCase().split(/\s+/);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].slice(0, 1).toUpperCase() + arr[i].slice(1);
        }
        return arr.join(' ');
    };





    /*******************************************************************************************************************
     * 文件名操作
     */

    /**
     * 获取文件名
     * @param filename
     * @returns {string}
     */
    namespace.getFilename = function (filename) {
        let index = filename.lastIndexOf('.') + 1;
        return filename.substring(0, index-1);
    };

    /**
     * 获取文件名后缀名
     * @param filename
     * @returns {string}
     */
    namespace.getSuffix = function (filename) {
        let index = filename.lastIndexOf('.') + 1;
        let len = filename.length;
        return filename.substring(index, len);
    };

    /**
     * 删除文件后缀名
     * @param filename
     * @returns {string}
     */
    namespace.deleteSuffix = function (filename) {
        let index = filename.indexOf('.');
        return filename.substring(0, index);
    };

    /**
     * 获取文件名称
     * @param path
     * @param extension
     * @returns {string}
     */
    namespace.basename = function (path, extension = "") {
        let filename_index = path.lastIndexOf("/") + 1;
        let filename = path.substr(filename_index);
        let basename_index = filename.lastIndexOf(extension);
        let basename = filename.substr(0, basename_index);
        return (extension === "") ? filename : basename;
    };




    /*******************************************************************************************************************
     * Array工具
     */

    /**
     * 遍历数组
     * @param arr
     * @param fn
     */
	namespace.each = function (arr, fn) {
		for (let i = 0, l = arr.length; i < l; i++) {
			fn(arr[i], i);
		}
	};
	

	// 寻找数组最大值
    namespace.max = function (arr, fn) {
	    let tempArr = [];
	    for (let i = 0, len = arr.length; i < len; i++) {
	    	if (arr[i] > tempArr[0]) {
	    		tempArr[0] = arr[i];
	    		fn(tempArr[0]);
	    	}
	    }
	};
	
	// 单位数'数字字符串'，转换为双位数'数字字符串'
    namespace.double = function (num) {
        if (num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    };
    
    namespace.getStyle = function (element, attr) {
      	if (element.currentStyle) {
        	return element.currentStyle[attr];
      	} else {
        	return window.getComputedStyle(element,null)[attr];
      	}
    };



    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Object工具↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	// 深拷贝
    namespace.deepcopy = function (obj) {
        // 过渡数组
		let objArray = namespace.isArray(obj) ? [] : {};
		// 执行拷贝
		if (obj && typeof obj === 'object') {
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (obj[key] !== 'undefined' && typeof obj[key] === 'object') {
						objArray[key] = namespace.deepcopy(obj[key]);
					} else {
						objArray[key] = obj[key];
					}
				}
			}
		}
		return objArray;
	};

	// 删除私有属性
    namespace.deletePrivateProperty = function (obj) {
        if (namespace.isArray(obj)) {
            // obj 为数组
            namespace.each(obj, function (item, index) {
                if (typeof item === 'object') {
                    recursion(item);
                }
            });
        } else {
            // obj 为对象
            recursion(obj);
        }
        // 递归
        function recursion (obj) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (key.match(/^\_/) ) {// 判断出是自己定义属性
                        delete obj[key];
                    }

                    if (typeof obj[key] === 'object') {
                        recursion(obj[key])
                    } else {
                        if (key.match(/^\_/) ) {// 判断出是自己定义属性
                            delete obj[key];
                        }
                    }
                }
            }
        }
        return obj;
    };

	// String类型数字转Number类型数字
    namespace.changeStringToNumber = function (obj) {
        if (namespace.isArray(obj)) {
            namespace.each(obj, function (item) {
                if (namespace.isArray(item) || namespace.isObject(item)) {
                    recursion(item);
                }
            });
        } else {
            recursion(obj);
        }

        function recursion (obj) {//递归
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (namespace.isObject(obj[key]) || namespace.isArray(obj[key])) {
                        recursion(obj[key]);
                    } else {
                        let reg = /^(-?\d+)(\.\d+)?$/ig;// 正负浮点数

                        // 是字符串，并且，是正负（整数）浮点数
                        if (namespace.isString(obj[key]) && reg.test(obj[key])) {// '-123.456' 转 -123.456
                            obj[key] = Number(obj[key]);
                        }
                    }
                }
            }
        }

        return obj;
    };

    // 删除对象中的空字符串
    namespace.deleteEmptyString = function (obj) {
        if (namespace.isArray(obj)) {
            namespace.each(obj , function (item , index) {
                if (typeof item === 'object') {
                    recursion(item);
                }
            });
        } else {
            recursion(obj)
        }
        //递归
        function recursion (obj) {
            for (key in obj) {
                if(obj.hasOwnProperty(key)) {
    
                    if (typeof obj[key] === 'object') {
                        recursion(obj[key]);
                    } else {
                        if (namespace.isEmptyString(obj[key])) {//空字符串，删
                            delete obj[key];
                        }
                    }
                    
                }
            }
        }
        return obj;
    };


    /**
     * 浏览器 信息
     */
    // 获取内核信息
    namespace.getNavigatorInfo = function () {
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
        return (result !== '') ? result : '未获取内容';
    };


    /**
     * 格式化工具
     */
    let format = (function () {
        let format = {};
        /**
         * 将【js对象】转换为【lua对象】
         *
         * @param options
         * @returns {string}
         */
        format.lua = function (options) {
            let obj = options.obj;
            let name = options.name || 'tempname';
            let delimiter = options.delimiter || '\r\n';// 定义换行符 WINDOW-'\r\n';LINUX/UNIX-'\n';MAC-'\r';
            let spaceAfterColon = options.spaceAfterColon || false;// 分号后面是否需要空格
            let newlineAfterColonIfBeforeBraceOrBracket = options.newlineAfterColonIfBeforeBraceOrBracket || false;
            let tab = options.tab || '    ';// tab长度，默认值：四个空格
            // 变量
            let str = 'local ' + name + ' = {';
            let formatted = '';// 存储最终格式化的字符串
            let pad = 0;

            traverse(obj);
            // js的obj 转换为lua的str
            function traverse (obj) {
                switch (Object.prototype.toString.call(obj)) {
                    case "[object Array]" :
                        for (let i = 0, len = obj.length; i < len; i++) {
                            str += delimiter + '[' + (i+1) + '] = ';

                            switch (Object.prototype.toString.call(obj[i])) {
                                case "[object Number]" :
                                case "[object Boolean]" :
                                    str +=  obj[i] + ',';
                                    break;

                                case "[object String]" :
                                    str += obj[i] + ',';
                                    break;

                                case "[object Array]" :
                                    str +=  '{';
                                    traverse(obj[i]);
                                    str += delimiter + '},';
                                    break;

                                case "[object Object]" :
                                    str += '{';
                                    traverse(obj[i]);
                                    if (i === len - 1) {
                                        str += delimiter + '}';
                                    } else {
                                        str += delimiter + '},';
                                    }
                                    break;
                            }
                        }
                        break;

                    case "[object Object]" :
                        for (let k in obj) {
                            if (obj.hasOwnProperty(k)) {
                                switch (Object.prototype.toString.call(obj[k])) {
                                    case "[object Number]" :
                                    case "[object Boolean]" :
                                        str += delimiter + k + ' = ' + obj[k] + ',';
                                        break;

                                    case "[object String]" :
                                        str += delimiter + k + ' = \"' + obj[k] + '\",';
                                        break;

                                    case "[object Array]" :
                                        str +=  delimiter + k + ' = ' + '{';
                                        traverse(obj[k]);
                                        str += delimiter + '},';
                                        break;

                                    case "[object Object]" :
                                        str += delimiter + k + ' = ' + '{';
                                        traverse(obj[k]);
                                        str += delimiter + '},';
                                        break;
                                }
                            }
                        }
                        break;
                }
            }

            str += delimiter + '}' + delimiter + 'return ' + name;
            reg = /(\,)/g;
            str = str.replace(/\,(\s*})/g , '$1');// ❤❤❤❤去掉最后一个对象 后面的都好 ，我草，我居然做出来了

            // 二：格式化
            (str.split(delimiter)).forEach(function (node, index) {
                var i = 0,
                    indent = 0,
                    padding = '';

                if (node.match(/\{$/) || node.match(/\[$/)) {
                    indent = 1;
                } else if (node.match(/\}/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else {
                    indent = 0;
                }
                for (i = 0; i < pad; i++) {
                    padding += tab;
                }
                formatted += padding + node + delimiter;
                pad += indent;
            });

            formatted = formatted.replace(/(\r\n)$/, '');// 去掉最后一个换行符

            return formatted;
        };


        /**
         * @param {Object} text
         */
        format.xml = function (text) {
            // 去掉多余的空格
            text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
                return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
            }).replace(/>\s*?</g, ">\n<");

            // 把注释编码
            text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
                var ret = '<!--' + escape(text) + '-->';
                //alert(ret);
                return ret;
            }).replace(/\r/g, '\n');

            // 调整格式
            var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
            var nodeStack = [];
            var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
                var isClosed = (isCloseFull1 == '/') || (isCloseFull2 == '/' ) || (isFull1 == '/') || (isFull2 == '/');
                // alert([all,isClosed].join('='));
                var prefix = '';
                if (isBegin == '!') {
                    prefix = getPrefix(nodeStack.length);
                }
                else {
                    if (isBegin != '/') {
                        prefix = getPrefix(nodeStack.length);
                        if (!isClosed) {
                            nodeStack.push(name);
                        }
                    }
                    else {
                        nodeStack.pop();
                        prefix = getPrefix(nodeStack.length);
                    }

                }
                var ret = '\n' + prefix + all;
                return ret;
            });

            var prefixSpace = -1;
            var outputText = output.substring(1);
            //alert(outputText);

            //把注释还原并解码，调格式
            outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
                //alert(['[',prefix,']=',prefix.length].join(''));
                if (prefix.charAt(0) == '\r')
                    prefix = prefix.substring(1);
                text = unescape(text).replace(/\r/g, '\n');
                var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
                //alert(ret);
                return ret;
            });

            return outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
        };


        return format;
    }) ();
    namespace.format = format;



}) (window.cyber || (cyber = Object.create(null)));