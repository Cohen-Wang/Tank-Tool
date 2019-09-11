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
    el : '#associatedListEditor',


    /*******************************************************************************************************************
     * data属性
     */
    data : {
        allInfo : {},// 预定义，装所有信息的变量，存储到localStorage
        aExcelAllData : [],// 所有标签页数据
        sheetNames : [],// 渲染标签页按钮
        // 用于表格显示的对象
        tableObj : {"title" : [], "content" : []},
        // 初始化关系
        associationConfig : [],// 用于存储所有关系配置，存储到localStorage
        tempAssociationName : '',// 添加
        nowEditingIndex : -1,// 选择
        usingAssociation : [],
        // 初始化结果内容
        searchWord : null,
        result : [],// 必须初始化为Array，存储到localStorage
    },


    /*******************************************************************************************************************
     * computed属性
     */
    computed : {

    },


    /*******************************************************************************************************************
     * methods属性
     */
	methods : {
        /**
         * 初始化加载本地
         */
	    // 获取localStorage的数据
        getAllInfo : function () {
            console.log("获取本地数据【allInfo】");
            this.allInfo =  window.localStorage.getItem("allInfo") ? JSON.parse(window.localStorage.getItem("allInfo")) : {};
        },

        // 获取【关联配置】
        getAssociationConfig : function () {
            console.log("获取本地数据【associationConfig】");
            this.associationConfig =  window.localStorage.getItem("associationConfig") ? JSON.parse(window.localStorage.getItem("associationConfig")) : [];
        },

        // 获取this.nowEditingIndex
        getNowEditingIndex : function () {
            if (this.associationConfig.length !== 0) {
                this.nowEditingIndex = 0;
            }
        },

        /**************************************************************************************************************
         * 加载excel文件
         */
		// 添加excel文件
		addExcel : function (e) {
		    // 变量
            let oEvent = e || window.event;
            let aFiles = oEvent.target.files;
            let _this = this;
            let len = 0;
            // 判断是否有文件传入
            if (!aFiles) return;
            $(".loading").fadeIn(400);
            // 一次性判断所有文件名后缀
            for (let i = 0; i < aFiles.length; i++) {
                let filename = aFiles[i].name;
                let suffix = cyber.getSuffix(filename);
                if (suffix !== 'xls' && suffix !== 'xlsx') {
                    alert('文件----' + filename + '----的后缀应为：xls, xlsx');
                    return;
                }
                else {
                    len++;
                }
            }
            // 如果所有文件名后缀都正确
            if (aFiles.length === len) {
                // 清空
                this.aExcelAllData = [];
                this.allInfo = {};// 初始化必须是Object，不能是null
                window.localStorage.removeItem("allInfo");
                // 变量
                let reader = [];
                // 逐一读取
                for (let i = 0; i < aFiles.length; i++) {
                    reader[i] = new FileReader();
                    reader[i].readAsBinaryString(aFiles[i]);
                    reader[i].onload = function () {
                        // 变量
                        let arr = [];// 创建一个临时数组

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
                        _this.sheetNames = dataObj.SheetNames;

                        /**
                         * 获取【可读】的数据
                         * @type Object
                         */
                        dataObj = _this.getReadableExcelData(dataObj);
                        //console.log(dataObj);

                        //dataObj = _this.deleteRow(dataObj, 0);// 删除了"中文说明行"
                        //console.log(dataObj);

                        //dataObj = _this.deleteRow(dataObj, 0);// 删除了"a s c说明行"
                        //console.log(dataObj);

                        //dataObj = _this.deleteRow(dataObj, 0);// 删除了"num string等 格式说明行"
                        //console.log(dataObj);

                        // 删除第多余（空白，空行）
                        dataObj = _this.deleteWrongRow(dataObj);// 删除第多余（空白，空行）
                        //console.log(dataObj);

                        //
                        _this.aExcelAllData = dataObj;
                        //console.log(dataObj);

                        // 具体赋值
                        for (let j = 0; j < _this.sheetNames.length; j++) {
                            // 赋值 allInfo.sheet 的具体数据
                            //_this.allInfo[_this.sheetNames[j]] = _this.aExcelAllData[j];// 此方法赋值，不能立即被渲染
                            let key = _this.sheetNames[j];
                            let value = _this.aExcelAllData[j];
                            vm.$set(_this.allInfo, key, value);
                        }
                    }
                }

                // TODO 优化：由于上面用了reader.onload，所以这里用延迟
                window.setTimeout(function () {
                    let str = JSON.stringify(_this.allInfo);
                    window.localStorage.setItem("allInfo", str);// 存入本地
                }, 2000);

                //
                $(".loading").fadeOut(400);
            }
            // 还原
            //oEvent.target.value = '';// ❤因为以后还要用其内容，所以这里还不能清空
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

        // 删除不完整，没有ID,effect_name,bluePrintsToC的行
        deleteWrongRow : function (data) {
            let arr = cyber.deepcopy(data);
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

        /***************************************************************************************************************
         * 创建，管理，删除 关联配置
         */
        // 新建【关联配置】
        addAssociationConfig : function () {
            if (this.tempAssociationName.trim() !== '') {
                // 添加
                this.associationConfig.push({
                    name : this.tempAssociationName.trim(),
                    content : [{
                        sheet : "工作表",
                        primeKey : "主键",
                        foreignKey : "外键",
                        _allKeys : [],
                    }],
                });
                // 赋值
                if (this.nowEditingIndex === -1) {
                    this.nowEditingIndex = 0;
                }
                // 清空
                this.tempAssociationName = '';// 清空为String，不能为null
            } else {
                alert("请先输入新建配置关系的名称!");
            }
        },

        // 删除【关联配置】
        deleteAssociationConfig : function (associationConfigItem, associationConfigIndex) {
            let confirm = window.confirm("确认删除【"+associationConfigItem.name+"】的配置吗？");
            if (confirm) {
                this.associationConfig.splice(associationConfigIndex, 1);
            }
        },

        // 选择【关联配置】
        selectAssociationConfig : function (event) {
            let oEvent = event || window.event;
            this.nowEditingIndex = +oEvent.target.value;
        },

        // 点击【添加关联】按钮
        addAssociation : function (associationConfigIndex, contentIndex) {
            if (this.associationConfig[associationConfigIndex].content.length < 4) {
                this.associationConfig[associationConfigIndex].content.push({
                    sheet : "工作表",
                    primeKey : "主键",
                    foreignKey : "外键",
                    _allKeys : [],
                });
            } else {
                alert("关联关系不能超过4个，否则【布局变形】。");
            }
        },

        // 删除关联工作表
        deleteAssociation : function (associationConfigIndex, contentIndex) {
            let confirm = window.confirm("确认删除吗？");
            if (confirm) {
                this.associationConfig[associationConfigIndex].content.splice(contentIndex, 1);
            }
        },

        // 选择【工作表】
        pickSheet : function (associationItem, sheetName) {
            /**
             * 更改选中表单名
             */
            associationItem.sheet = sheetName;

            /**
             * 更改_allKeys
             */
            let arr = [];
            let obj = this.allInfo[sheetName][0];// {'id':'ID','name':'cohen'}
            //
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(key);
                }
            }
            //
            associationItem._allKeys = arr;
        },

        // 选择【主键】
        pickPrimeKey : function (associationItem, keyItem) {
            associationItem.primeKey = keyItem;
        },

        // 选择【外键】
        pickForeignKey : function (associationItem, keyItem) {
            associationItem.foreignKey = keyItem;
        },

        // 点击【确定】保存本地
        confirmAssociation : function () {
            let str = JSON.stringify(this.associationConfig);
            window.localStorage.setItem("associationConfig", str);
        },

        // 选择【usingAssociation】
        chooseUsingAssociation : function (event) {
            let oEvent = event || window.event;
            let index = +oEvent.target.value;
            // 赋值
            this.usingAssociation = this.associationConfig[index].content;
        },


        /***************************************************************************************************************
         * 查看表单
         */
        // 选择查看表单
        chooseSheet : function (sheetKey) {
            // 清空旧的数据
            this.tableObj = {"title":[],"content":[]};
            // 赋值
            let arr = this.allInfo[sheetKey];
            //
            $(".loading").fadeIn(400);

            /**
             * 添加title
             * 必须要先添加，不能title和content一起push，因为在content push的时候，需要利用title判断
             */
            let obj = arr[0];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    // 添加标题
                    this.tableObj.title.push(key);
                }
            }

            /**
             * 添加content
             */
            for (let i = 0; i < arr.length; i++) {
                // 初始化和清空
                let tempArr = {};
                //
                for (let j = 0; j < this.tableObj.title.length; j++) {
                    if (arr[i][this.tableObj.title[j]] !== undefined) {
                        tempArr[this.tableObj.title[j]] = arr[i][this.tableObj.title[j]];
                    } else {
                        tempArr[this.tableObj.title[j]] = "";
                    }
                }
                //
                this.tableObj.content.push(tempArr);
            }
            //
            $(".loading").fadeOut(400);
        },


        /***************************************************************************************************************
         * 显示结果
         */
        confirmResult : function () {
            // 判断 this.usingAssociation 是否赋值
            if (this.usingAssociation.length === 0) {
                alert("请先选择【关联配置】");
                return false;
            }
            // 变量
            let foreignValue = [];
            foreignValue.push(this.searchWord);
            // 清空
            this.result = null;
            // 设置
            let arr = [];
            for (let i = 0; i < this.usingAssociation.length; i++) {
                arr.push({
                    title : '',
                    content : [],
                })
            }
            // 获取
            for (let i = 0; i < this.usingAssociation.length; i++) {
                // 变量
                let sheetContent = this.allInfo[this.usingAssociation[i].sheet];// 获取关联工作表的内容，类型：Array
                let primeKey = this.usingAssociation[i].primeKey;// 例：id
                let foreignKey = this.usingAssociation[i].foreignKey;// 例：skill_id
                let len = 0;
                let tempForeignKey = [];


                let arr1 = [];
                let arr2 = [];

                //
                let color = ['text-danger', 'text-info', 'text-success', 'text-warning', 'text-primary'];
                let bg = ['bg-danger', 'bg-info', 'bg-success', 'bg-warning', 'bg-primary'];

                // 赋值标题
                arr[i]['title'] = this.usingAssociation[i].sheet;
                // 赋值内容
                for (let n = 0; n < foreignValue.length; n++) {
                    //arr1 = [];

                    for (let j = 0; j < sheetContent.length; j++) {
                        arr2 = [];

                        if (sheetContent[j][primeKey] === foreignValue[n]) {// equipment[j]['id'] === 400301

                            // TODO
                            sheetContent[j]._color = color[i];
                            sheetContent[j]._bg = bg[i];

                            // 赋值content
                            arr[i]['content'].push(sheetContent[j]);

                            // 判断是否为多个
                            if (sheetContent[j][foreignKey].indexOf(';') !== -1) {
                                arr2 = sheetContent[j][foreignKey].split(';');// '100101;100102'
                            } else {
                                arr2.push(sheetContent[j][foreignKey]);// '100101'
                            }
                            //
                            len++;
                        }
                        if (arr2.length !== 0) {// 如果找到了外键，就push，没有不能push；
                            arr1 = arr1.concat(arr2);
                        }
                    }
                    /**
                     * 重新赋值
                     */
                    if (len === foreignValue.length) {
                        // 清空
                        foreignValue = [];
                        foreignValue = arr1;
                        //console.log('foreignValue', foreignValue);
                    }
                }
            }
            // 赋值this.result
            this.result = arr;
            // 弹出模态框
            $('#result-modal').modal('show');
        },


        /***************************************************************************************************************
         * 清空数据
         */
        deleteAll : function () {
            let prompt = window.prompt("请输入密码!");
            let passwd = "1234";
            if (prompt === passwd) {
                // 清空本地数据
                window.localStorage.clear();
                // 清空正在使用的数据
                this.allInfo = {};
                this.associationConfig = [];
                this.searchWord = '';
            }
        },


    },// methods


    /*******************************************************************************************************************
     * created属性
     */
    created : function () {
        // 获取localStorage的数据
        this.getAllInfo();
        this.getAssociationConfig();
        //
        this.getNowEditingIndex();
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