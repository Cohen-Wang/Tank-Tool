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
    el : '#excelEditor',


    /*******************************************************************************************************************
     * data属性
     */
    data : {
        // 是否将文件读取为二进制字符串
        isBinary : false,
        rABS : false,
        //
        explainConfig : [],// ajax获取explain

        //
        allDataOfExcels : {},// 存储所有excel的所有数据
        chosenExcel : '',// 当前选中的excel，例：'零件属性表'
        chosenSheet : '',// 当前选中的sheet，例：'equipment'
        // 当前选中-标签页-数据
        sheetContent : [],

        /**
         * 【选择内容】
         */
        // 配置
        chosenCS_config : [
            {name:"全部端口", value : "a"},
            {name:"服务端口", value : "s"},
            {name:"客户端口", value : "c"},
        ],
        // 选中值
        chosenCS : {name : '全部端口',value : 'a'},

        /**
         * 【选择版本】
         */
        // 配置
        chosenVersion_config : [
            {name:"格式版", value : "format"},
            {name:"压缩版", value : "condensed"},
        ],
        // 选中值
        chosenVersion : {name:"格式版", value : "format"},

        /**
         * 【选择格式】
         */
        // 配置
        chosenType_config : [
            {name:"json格式", value : "json"},
            {name:"lua格式" , value : "lua"},
        ],
        // 选中值
        chosenType : {name:"json格式", value : "json"},
    },


    /*******************************************************************************************************************
     * methods属性
     */
	methods : {


        /***************************************************************************************************************
         * 加载本地数据
         */
        // 已经取消了这一步，没有意义，但保留操作方法，以便以后审阅
        // chosenCS
        getChosenCS : function () {
            if (window.localStorage.getItem("chosenCS") !== null) {
                let str =  decodeURIComponent(window.localStorage.getItem("chosenCS"));
                this.chosenCS = JSON.parse(str);
            } else {
                this.chosenCS = {name : '全部端口',value : 'a'};
            }
        },

        /***************************************************************************************************************
         * 添加excel文件
         */
        addExcel : function (e) {
            // 变量
            let oEvent = e || window.event;
            let aFiles = oEvent.target.files;
            let _this = this;
            let len = 0;
            // 判断是否有文件传入
            if (aFiles.length === 0) {
                alert('你没有上传文件');
                return
            }
            // 动画
            $(".loading").fadeIn(400);
            // 一次性判断所有文件名后缀
            for (let i = 0; i < aFiles.length; i++) {
                let filename = aFiles[i].name;
                let suffix = cyber.getSuffix(filename);
                if (suffix !== 'xls' && suffix !== 'xlsx') {
                    alert('文件----' + filename + '----的后缀应为：xls, xlsx');
                    return;
                } else {
                    len++;
                }
            }
            // 如果所有文件名后缀都正确
            if (aFiles.length === len) {
                // 清空
                this.allDataOfExcels = {};// 初始化必须是Object，不能是null
                // 变量
                let reader = [];
                // 逐一读取
                for (let i = 0; i < aFiles.length; i++) {

                    // 赋值
                    let filename = cyber.deleteSuffix(aFiles[i].name);
                    // 例：allDataOfExcels = {
                    //      "零件属性表":"...",
                    //      "战利品配置表":"..."
                    // }
                    vm.$set(this.allDataOfExcels, filename, {});

                    // 赋值chosenExcel，不然加载完后，按钮是空的，没有文字
                    this.chosenExcel = cyber.deleteSuffix(aFiles[i].name);

                    // 读取
                    reader[i] = new FileReader();
                    reader[i].readAsBinaryString(aFiles[i]);
                    reader[i].onload = function () {
                        /**
                         * 获取数据
                         * @type String
                         */
                        let dataString = this.result;// data是当前excel二进制的乱码字符串

                        /**
                         * 获取【所有】信息
                         * @type Object
                         */
                        let dataObj = XLSX.read(dataString, {
                            type: 'binary'
                        });

                        // 给下载标签赋值
                        let arrSheetNames = dataObj.SheetNames;

                        /**
                         * 获取【可读】的数据
                         * @type Object
                         */
                        dataObj = _this.getReadableExcelData(dataObj);
                        //console.log(dataObj);

                        dataObj = _this.deleteRow(dataObj, 0);// 删除了"中文说明行"
                        //console.log(dataObj);

                        //dataObj = _this.deleteRow(dataObj, 0);// 删除了"a s c说明行"
                        //console.log(dataObj);

                        //dataObj = _this.deleteRow(dataObj, 0);// 删除了"num string等 格式说明行"
                        //console.log(dataObj);

                        // 删除第多余（空白，空行）
                        dataObj = _this.deleteWrongRow(dataObj);// 删除第多余（空白，空行）
                        //console.log(dataObj);

                        // 具体赋值
                        for (let j = 0; j < arrSheetNames.length; j++) {
                            // 赋值 allInfo.sheet 的具体数据
                            let key = arrSheetNames[j];
                            let value = dataObj[j];
                            let obj = {
                                _isDownload : false,
                                content : value,
                            };
                            vm.$set(_this.allDataOfExcels[filename], key, obj);

                            // 这里，为了让加载excel的时候，显示区有内容，不让别人以为加载失败，做的处理
                            // 注意异步，找准属性比较难
                            if (i === aFiles.length-1 && j === 0) {
                                _this.chosenSheet = key;
                                //
                                _this.sheetContent = _this.allDataOfExcels[_this.chosenExcel][_this.chosenSheet].content;
                            }
                        }
                    }
                }
                //
                $(".loading").fadeOut(400);
            }
            // 还原
            // ❤因为以后还要用其内容，所以这里还不能清空
            //oEvent.target.value = '';
        },

        // 获取可读的js格式
        getReadableExcelData : function (fileData) {
            let newArr = [];
            for (let i = 0, len = fileData.SheetNames.length; i < len; i++) {// 遍历标签页
                newArr.push(XLSX.utils.sheet_to_json(fileData.Sheets[fileData.SheetNames[i]]));
            }
            return newArr;
        },

        /**
         * 删除excel表的某一行
         * @param data
         * @param index
         * @returns {Array}
         */
        deleteRow : function (data, index) {
            let arr = cyber.deepcopy(data);// 深拷贝，否则影响那个原始数据的变量
            for (let i = 0; i < arr.length; i++) {
                arr[i].splice(index, 1);
            }
            return arr;
        },

        // TODO 先别删
        // 删除第二行（中文说明行）方法
        // deleteNotesRow : function (arr) {
		//     let newArr = [];
        //     for (let i = 0, len = arr.SheetNames.length; i < len; i++) {// 遍历标签页
        //         for (let key in arr.Sheets[arr.SheetNames[i]]) {// 遍历列：key = A1,A2...B1,B2...
        //             let num = key.match(/\d+/gi);
        //             if (num !== null) {	// 有一个!ref，读取出来是null，所以要判断一下
        //                 let numstr = num.toString();// 期待numstr是'2'
        //                 if (numstr === '2') {// 删除第二行（中文名称）
        //                     delete arr.Sheets[arr.SheetNames[i]][key];
        //                 }
        //             }
        //         }
        //         newArr.push(XLSX.util.sheet_to_json(arr.Sheets[arr.SheetNames[i]]));
        //     }
        //     return newArr;
        // },

        // 删除不完整，没有ID,effect_name,bluePrintsToC的行
        deleteWrongRow : function (arr) {
            for (let i = 0, leni = arr.length; i < leni; i++) {
                for (let j = arr[i].length - 1; j >= 0; j--) {// 倒序删
                    if (arr[i][j]) {
                        if (
                            (!arr[i][j].id || arr[i][j].id === 'undefined')
                            && (!arr[i][j].effect_name || arr[i][j].effect_name === 'undefined')
                            && (!arr[i][j].bluePrintsToC || arr[i][j].bluePrintsToC === 'undefined')
                            && (!arr[i][j].RecycleTime || arr[i][j].RecycleTime === 'undefined')
                        )
                        {
                            arr[i].splice(j, 1);
                        }
                    }
                }
            }
            return arr;
        },
    
        // 删除-非选中a，s，c-内容
        chosenCSFn : function (sheetContent) {
            if (typeof sheetContent === 'object') {
                for (let i = 0, len = sheetContent.length; i < len; i++ ) {
                    for (let key in sheetContent[i]) {
                        if (sheetContent[i].hasOwnProperty(key)) {
                            if (this.chosenCS.value !== 'a') {
                                if (sheetContent[0][key] !== this.chosenCS.value && sheetContent[0][key] !== 'a' ) {
                                    delete sheetContent[i][key];
                                }
                            }
                        }
                    }
                }
            }
            return sheetContent;
        },


        /***************************************************************************************************************
         * 修改选项
         */
        changeChosenCS : function (item) {
            // 赋值
            this.chosenCS = item;
            // 存本地
            let str = encodeURIComponent(JSON.stringify(item));
            window.localStorage.setItem("chosenCS", str);
        },

        changeChosenVersion : function (item) {
            // 赋值
            this.chosenVersion = item;
            // 存本地
            let str = encodeURIComponent(JSON.stringify(item));
            window.localStorage.setItem("chosenVersion", str);
        },

        changeChosenType : function (item) {
            // 赋值
            this.chosenType = item;
            // 存本地
            let str = encodeURIComponent(JSON.stringify(item));
            window.localStorage.setItem("chosenType", str);
        },

        changeChosenExcel : function (excelName) {
            // 如果没有改变值，那么不执行
            if (this.chosenExcel === excelName) return;
            // 赋值
            this.chosenExcel = excelName;
        },

        // 选择【表单】
        // TODO 触发两次事件bug
        changeChosenSheet : function (sheetName) {
            // 如果没有改变值，那么不执行
            if (this.chosenSheet === sheetName) return;
            // 赋值this.chosenSheet
            this.chosenSheet = sheetName;
            // 获取：选中excel-选中sheet-content
            this.sheetContent = this.allDataOfExcels[this.chosenExcel][this.chosenSheet].content;
        },

        // 当前选中-标签页-数据
        sheetContent : function () {
            // 没有上传文件时，为空数组；否则赋值
            if (JSON.stringify(this.allDataOfExcels) !== '{}' && this.chosenSheet !== '') {
                return this.allDataOfExcels[this.chosenExcel][this.chosenSheet].content;
            } else {
                return [];
            }
        },

        // 全选按钮
        selectAll : function (event, excelItem) {
            let oEvent = window.event || event;
            //
            for (let sheetName in excelItem) {
                if (excelItem.hasOwnProperty(sheetName)) {
                    let sheetContent = excelItem[sheetName];
                    //
                    if (oEvent.target.checked === true) {
                        if (sheetContent._isDownload === false) {// 只要有一个是 false，就让全部都是true
                            this.allChecked(excelItem, true);
                            return;
                        }
                    } else {
                        if (sheetContent._isDownload === true) {// 只要有一个是 true，就让全部都是false
                            this.allChecked(excelItem, false);
                            return;
                        }
                    }
                }
            }
        },

        // 全选
        allChecked : function (excelItem, flag) {
            for (let sheetName in excelItem) {
                if (excelItem.hasOwnProperty(sheetName)) {
                    excelItem[sheetName]._isDownload = flag;
                }
            }
        },



        /***************************************************************************************************************
         * 格式化
         */
        // json格式化
        jsonFormatting : function (obj) {
            let type = obj[0];// 提取obj的值类型那一行，例如：{effect_name: "string", mount: "string", layer: "string", follow: "string"}
            obj.splice(0, 1);// 提取后，删除值类型这一行
            // 开始拼接字符串
            let jsonstr = '[\n\t';
            // 遍历一（数组）：
            for (let i = 0, len = obj.length; i < len; i++) {
                jsonstr += '{';
                // 遍历二（对象）：
                for (let k in obj[i]) {
                    if (obj[i].hasOwnProperty(k)) {
                        if (obj[i][k].trim() !== '') {// 不为空
                            switch (type[k]) {// 值类型
                                case 'num' :
                                    jsonstr += '\n\t\t' + '\"'+ [k] + '\"' + ' : ' + obj[i][k] + ',';
                                    break;
        
                                case 'string' :
                                    // 防止双引号，从 '"' 改成 '\"';
                                    if (obj[i][k].indexOf('"') !== -1) {
                                        obj[i][k] = obj[i][k].replace(/"/ig, '\\"');
                                    }

                                    jsonstr += '\n\t\t' + '\"'+[k]+'\"' + ' : ' + '\"' + obj[i][k] + '\"' + ',';
                                    break;
        
                                case 'string_array' :
                                    if (obj[i][k].indexOf(';') !== -1) {
                                        let result = obj[i][k].split(';');
                                        jsonstr += '\n\t\t' + '\"'+[k]+'\"' + ' : ' + '\[';
                                        for (let j = 0 , lenj = result.length; j < lenj; j++) {
                                            // 判断是否为最后一个，方便加逗号
                                            if (j === lenj - 1) {
                                                jsonstr += '\"' +result[j] + '\"';
                                            } else {
                                                jsonstr += '\"' +result[j] + '\"' + ',';
                                            }
                                        }
                                        jsonstr += '\]' + ',';
                                    } else { // 长度为1时
                                        jsonstr += '\n\t\t' + '\"'+ [k] + '\"' + ' : ' + '\[';
                                        jsonstr += '\"'+ obj[i][k] + '\"';
                                        jsonstr += '\]' + ',';
                                    }
                                    break;
        
                                case 'num_array' :
                                    if (obj[i][k].indexOf(';') !== -1) {// 数组长度大于1的情况
                                        let result = obj[i][k].split(';');
                                        jsonstr += '\n\t\t' + '\"'+[k]+'\"' + ' : ' + '\[';
                                        for (let j = 0 , lenj = result.length; j < lenj; j++) {
                                            // 判断是否为最后一个，方便加逗号
                                            if (j === lenj - 1) {
                                                jsonstr += result[j];
                                            } else {
                                                jsonstr += result[j] + ',';
                                            }
                                        }
                                        jsonstr += '\]' + ',';
                
                                    } else {// 数组长度等于1的情况
                                        jsonstr += '\n\t\t' + '\"'+[k]+'\"' + ' : ' + '\[';
                                        jsonstr += obj[i][k];
                                        jsonstr += '\]' + ',';
                                    }
                                    break;
                                    
                                default :
                                    alert("警告:当前选中的excel表中，有不明数据类型");
                                    throw Error('EXCEL中，有不明数据类型 : ' + '---'
                                        + this.chosenSheet + '---'
                                        + k + '---'
                                        + type[k]);
                            }
                        }
                    }
                }
                // 最后一个不要换行和逗号，但我觉得可以改进
                if (i === len - 1) {
                    jsonstr += '\n\t}';
                } else {
                    jsonstr += '\n\t},\n\t';
                }
            }
            jsonstr += '\t\n]';
            return jsonstr;
        },
        
        // lua格式化
        luaFormatting : function (obj) {
            let type = obj[0];// 提取obj-数据类型
            obj.splice(0, 1);// 提取后，删除值类型这一行
            let defaultId = 1;
            // 开始拼接字符串
            let luastr = 'local list = {}';
            for (let i = 0, len = obj.length; i < len; i++) {
                // 设置id
                let index = obj[i].id || defaultId;
                luastr += '\nlist[' + index + '] = {';
                for (let k in obj[i]) {
                    if (obj[i].hasOwnProperty(k)) {
                        if (obj[i][k].trim() !== '') {// 不为空
                            switch (type[k]) {// 值类型
                                case 'num' :
                                    luastr += '\n\t' + [k] + ' = ' + obj[i][k] + ',';
                                    break;
        
                                case 'string' :
                                    // 防止双引号，从 '"' 改成 '\"';
                                    if (obj[i][k].indexOf('"') !== -1) {
                                        obj[i][k] = obj[i][k].replace(/"/ig, '\\"');
                                    }

                                    luastr += '\n\t' + [k] + ' = ' + '\"' + obj[i][k] + '\"' + ',';
                                    break;
        
                                case 'string_array' :
                                    if (obj[i][k].indexOf(';') !== -1) {// 判断数组长度 >= 2的情况,如：111;222;333
                                        luastr += '\n\t' + [k] + ' = ' + '{';
                                        let result = obj[i][k].split(';');
                                        for (let j = 0, lenj = result.length; j < lenj; j++) {// ❤注意lenj，两个for循环，注意变量i和len
                                            luastr += '\n\t\t[' + (j + 1) + '] = ' + '\"' +result[j] + '\"' + ',';
                                        }
                                        luastr += '\n\t},'
                                    } else {// 数组长度为1时
                                        luastr += '\n\t' + [k] + ' = ' + '{';
                                        luastr += '\n\t\t[' + 1 + '] = ' + '\"' + obj[i][k] + '\"' + ',';
                                        luastr += '\n\t},'
                                    }
                                    break;
        
                                case 'num_array' :
                                    if (obj[i][k].indexOf(';') !== -1) {// 判断数组长度 >= 2的情况,如：111;222;333
                                        luastr += '\n\t' + [k] + ' = ' + '{';
                                        let result = obj[i][k].split(';');
                                        for (let j = 0, lenj = result.length; j < lenj; j++) {// ❤注意lenj，两个for循环，注意变量i和len
                                            luastr += '\n\t\t[' + (j + 1) + '] = ' + result[j] + ',';
                                        }
                                        luastr += '\n\t},'
                                    } else {// 数组长度为1时
                                        luastr += '\n\t' + [k] + ' = ' + '{';
                                        luastr += '\n\t\t[' + 1 + '] = ' + obj[i][k] + ',';
                                        luastr += '\n\t},'
                                    }
                                    break;
        
                                default :
                                    throw Error('EXCEL中，有不明数据类型 : ' + type[k]);
                            }
                        }
                    }
                }
                luastr += '\n}\n';
                // 默认id 自增
                defaultId++;
            }
            luastr += 'return list';
            return luastr;
        },

        // 最小化lua或json
        minimize : function (str) {
            str = str.replace(/[\n\t\s]/g, '');
            str = str.replace('locallist','local list');
            str = str.replace('returnlist','return list');
            str = str.replace(/\,}/g,'}');
            return str ;
        },

        /***************************************************************************************************************
         * ajax
         */
        // 获取buff配置
        getExplainConfig : function () {
            let url = "../config/excelEditor.explain.config.json";
            this.$http.post(url, {
            
            }, {
                emulateJSON : true
            }).then(function (data) {
                this.explainConfig = data.body;
            }, function (response) {
                console.info('没有连接,状态码：' + response.status);
            });
        },

        /**
         * 将js对象转为json字符串
         */
        jsonize : function (obj) {
            let jsonObject = cyber.deepcopy(obj);
            let jsonString;
            //
            if (jsonObject.length !== 0) {
                jsonObject = this.chosenCSFn(jsonObject);// 选择 a，s，c
                jsonObject.splice(0, 1);// 删掉 a，s，c
                // 格式化 和 最小化
                switch (this.chosenVersion.value) {
                    case 'format' :
                        jsonString = this.jsonFormatting(jsonObject);
                        jsonString = jsonString.replace(/\,\n\t}/g, '\n\t}');// 删除末尾的逗号
                        break;
                    case 'condensed' :
                        jsonString = this.minimize(this.jsonFormatting(jsonObject));
                        break;
                    default :
                }
            } else {
                jsonString = "json暂无内容";
            }
            return jsonString;
        },

        /**
         * 将js对象转为 lua字符串
         */
        luanize : function (obj) {
            let objLUA = cyber.deepcopy(obj);
            let strLUA;
            //
            if (objLUA.length !== 0) {
                objLUA = this.chosenCSFn(objLUA);// 选择 a，s，c
                objLUA.splice(0, 1);// 删掉 a，s，c
                // 格式化 和 最小化
                switch (this.chosenVersion.value) {
                    case 'format' :
                        strLUA = this.luaFormatting(objLUA);
                        strLUA = strLUA.replace(/\,\n\t}/g,'\n\t}');
                        strLUA = strLUA.replace(/\,\n}/g,'\n}');
                        break;
                    case 'condensed' :
                        strLUA = this.minimize(this.luaFormatting(objLUA));
                        break;
                    default :
                }
            }
            else {
                strLUA = "lua暂无内容";
            }
            return strLUA;
        },


        /***************************************************************************************************************
         * 下载
         */
        // 下载所有sheets
        downloadAllSheets : function () {
            let _this = this;
            //
            swal ({
                type : "warning",
                title : "确认下载吗",
                text : "",
                // 确认按钮
                confirmButtonColor : "#DD6B55",
                confirmButtonText : "确定",
                // 取消按钮
                showCancelButton : true,
                cancelButtonText : "取消",
                //
                closeOnConfirm : true,
                closeOnCancel : true,
            },
            function (isConfirm) {
                if (isConfirm) {
                    $(".loading").fadeIn(400);
                    //
                    let arr = [];
                    // 遍历 this.allDataOfExcels
                    for (let excelName in _this.allDataOfExcels) {
                        if (_this.allDataOfExcels.hasOwnProperty(excelName)) {
                            let excelContent = _this.allDataOfExcels[excelName];
                            // 遍历Excel
                            for (let sheetName in excelContent) {
                                if (excelContent.hasOwnProperty(sheetName)) {
                                    let sheetContent = excelContent[sheetName];
                                    if (sheetContent._isDownload === true) {
                                        let obj = sheetContent.content;
                                        //console.log(sheetName);// 文件名称
                                        //console.log(obj);
                                        //
                                        arr.push({
                                            sheetName : sheetName,
                                            content : obj,
                                        })
                                    }
                                }
                            }
                        }
                    }
                    // 判断是否下载内容（arr）为空
                    if (arr.length !== 0) {
                        let i = 0;
                        doRecursion.call(_this);
                        //
                        function doRecursion() {
                            _this.download(arr[i]);
                            i++;
                            // 递归
                            if (i < arr.length) {
                                setTimeout(function () {
                                    doRecursion.call(_this);
                                }.bind(_this), 500);
                            }

                            if (i === arr.length) {
                                $(".loading").fadeOut(400);
                            }
                        }
                    } else {
                        $(".loading").fadeOut(400);
                    }
                }
            });

        },

        // 下载
        download : function (obj) {
            switch (this.chosenType.value) {
                case 'json' :
                    window.download(this.jsonize(obj.content), obj.sheetName + '.json');
                    break;
                case 'lua' :
                    window.download(this.luanize(obj.content), obj.sheetName + '.lua');
                    break;
                default :
            }
        }
	},// methods
    
    
    /*******************************************************************************************************************
     * computed属性
     */
    computed : {

        // jsonHTML
        jsonHTML : function () {
            // 深拷贝-选中标签页内容
            let objJSON = cyber.deepcopy(this.sheetContent);
            return this.jsonize(objJSON);
        },
        
        // luaHTML
        luaHTML : function () {
            // 深拷贝-选中标签页内容
            let objLUA = cyber.deepcopy(this.sheetContent);
            return this.luanize(objLUA);
        },
        
        // xml
        xmlHTML : function () {
            return 'xml暂无内容'
        },
    },
    
    /*******************************************************************************************************************
     * created属性
     */
    created : function () {
        // ajax 获取解释说明
        this.getExplainConfig();
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


// 文件流转BinaryString
function fixdata (data) {
    let o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l) 
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}