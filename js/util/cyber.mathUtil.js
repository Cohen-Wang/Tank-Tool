/**
 * 【数学工具类】
 *
 * getDistanceBetweenTwoPoints ---- 【点】到【点】的距离
 * getDistanceBetweenLineAndPoint ---- 【点】到【直线】的距离
 *
 * checkRelationBetweenLineAndPoint ---- 求出点与直线的位置关系
 *
 * getIntersectionBetweenTwoLines ---- 求出两条线段（若相交） 的交点
 * getTangentBetweenPoints ---- 求两点的正切值
 * getSlopeBetweenTwoPoints ---- 已知直线两点，求直线斜率
 *
 * isConvexPolygon ---- 检测是否为凹多边形
 *
 */

(function (namespace) {

    let mathUtil = function (obj) {
        return new wrapper(obj);
    };

    let wrapper = function (obj) {
        this._wrapped = obj;
    };

    let result = function (obj) {
        return obj;
    };

    // 获取obj类型
    let getType = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();// 例：[object Array] => array
    };

    let isFunction = function (obj) {
        return (getType(obj) === "function");
    };

    let functions = function (obj) {
        let names = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (isFunction(obj[key])) {
                    names.push(key);
                }
            }
        }
        return names.sort();
    };

    let mixin = function (obj) {
        Array.prototype.forEach.call(functions(obj), function (fnName, index) {
            let func = mathUtil[fnName] = obj[fnName];// 函数内容
            // 将属性内容复制到原型链上
            mathUtil.prototype[fnName] = function () {
                let args = [this._wrapped];
                //console.log(args);
                Array.prototype.push.apply(args, arguments);
                return result(func.apply(mathUtil, args));
            }
        });
    };

    /*******************************************************************************************************************
     * 正文
     */

    /**
     * 【点】到【点】的距离
     *
     * @param startPoint 例：{x:1,y:1}
     * @param endPoint 例：{x:2,y:2}
     * @param precision 精度，可选，默认值：2
     * @returns {number}
     */
    mathUtil.getDistanceBetweenTwoPoints = function (startPoint, endPoint, precision = 2)
    {
        let distance;
        let distance_x = endPoint.x - startPoint.x;
        let distance_y = endPoint.y - startPoint.y;

        distance = Math.sqrt( Math.pow(distance_x, 2) + Math.pow(distance_y, 2) ).toFixed(precision);/*两点之间距离公式：Math.sqrt( x² + y²)*/

        return +distance;/*+ : 加号作用：字符串转数字*/
    };

    /**
     * 【点】到【直线】的距离
     *
     * @param startPoint 例：{x:1,y:1}
     * @param endPoint 例：{x:1,y:1}
     * @param thirdPoint 例：{x:1,y:1}
     * @returns {number}
     */
    mathUtil.getDistanceBetweenLineAndPoint = function (startPoint, endPoint, thirdPoint)
    {
        let distance;
        let a = endPoint.y - startPoint.y;
        let b = endPoint.x - startPoint.x;
        let c = endPoint.x * startPoint.y - startPoint.x * endPoint.y;

        let d = Math.sqrt(a * a + b * b);
        if (d === 0)
        {
            let dx = endPoint.x - startPoint.x;
            let dy = endPoint.y - startPoint.y;

            distance =  Math.sqrt(dx * dx + dy * dy);
        }
        else
        {
            distance =  Math.abs(a * thirdPoint.x + b * thirdPoint.y + c) / d;
        }

        return distance;
    };

    /**
     * 求两点的正切值
     *
     * @param startPoint 例：{x:1,y:1}
     * @param endPoint 例：{x:1,y:1}
     * @param precision 精度，可选，默认值：2
     * @returns {string}
     */
    mathUtil.getTangentBetweenPoints = function (startPoint, endPoint, precision = 2)
    {
        let distance_x = endPoint.x - startPoint.x;
        let	distance_y = endPoint.y - startPoint.y;

        // 求得角度，不是弧度
        let tangentAngle = 360 * Math.atan(distance_y / distance_x) / (2 * Math.PI);
        let x = tangentAngle.toFixed(precision);// 精确度

        return x;
    };

    /**
     * 求出点与直线的位置关系
     *
     * @param startPoint 直线中的一个点
     * @param endPoint 直线中的一个点
     * @param pt
     * @returns {number} 返回直线方程的d值（ =0 在直线上；> 0 在直线右方；< 0 在直线左方）
     */
    mathUtil.checkRelationBetweenLineAndPoint = function (startPoint, endPoint, pt)
    {
        let a = endPoint.y - startPoint.y;
        let b = startPoint.x - endPoint.x;
        let c = endPoint.x * startPoint.y - startPoint.x * endPoint.y;

        // 计算直线方程的参数
        return a * pt.x + b * pt.y + c;
    };

    /**
     * 检测是否为凹多边形
     *
     * @param points 坐标数组参数，期望长度大于等于4
     * @returns {boolean}
     */
    mathUtil.isConvexPolygon = function (points)
    {
        let len = points.length;

        // 数组长度要大于4 ，才可能有凹的地方
        if (len >= 4)
        {
            for (let i = 0; i < len; i++)
            {
                let i1 = i;
                let i2 = i1 % len + 1;
                let i3 = i2 % len + 1;
                //
                let startPoint = points[i1];
                let pt = points[i2];
                let endPoint = points[i3];
                //
                let result = this.checkRelationBetweenLineAndPoint(startPoint, endPoint, pt);
                //result = MathUtil.keepFloat(result);
                if (result > 0) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * 求出两条线段（若相交） 的交点
     *
     * @param AB_startPoint 例：{x:1,y:1}
     * @param AB_endPoint 例：{x:1,y:1}
     * @param CD_startPoint 例：{x:1,y:1}
     * @param CD_endPoint 例：{x:1,y:1}
     * @returns {*}
     */
    mathUtil.getIntersectionBetweenTwoLines = function (AB_startPoint, AB_endPoint, CD_startPoint, CD_endPoint)
    {
        // 计算向量
        let vec2_ac = {x : 0, y : 0};
        let vec2_ad = {x : 0, y : 0};
        let vec2_ab = {x : 0, y : 0};
        let vec2_da = {x : 0, y : 0};
        let vec2_db = {x : 0, y : 0};
        let vec2_dc = {x : 0, y : 0};
        let vec2_bc = {x : 0, y : 0};
        let vec2_bd = {x : 0, y : 0};
        //
        vec2_ac.x = CD_startPoint.x - AB_startPoint.x;
        vec2_ac.y = CD_startPoint.y - AB_startPoint.y;
        vec2_ad.x = CD_endPoint.x - AB_startPoint.x;
        vec2_ad.y = CD_endPoint.y - AB_startPoint.y;
        vec2_ab.x = AB_endPoint.x - AB_startPoint.x;
        vec2_ab.y = AB_endPoint.y - AB_startPoint.y;
        vec2_da.x = AB_startPoint.x - CD_endPoint.x;
        vec2_da.y = AB_startPoint.y - CD_endPoint.y;
        vec2_db.x = AB_endPoint.x - CD_endPoint.x;
        vec2_db.y = AB_endPoint.y - CD_endPoint.y;
        vec2_dc.x = CD_startPoint.x - CD_endPoint.x;
        vec2_dc.y = CD_startPoint.y - CD_endPoint.y;
        vec2_bc.x = CD_startPoint.x - AB_endPoint.x;
        vec2_bc.y = CD_startPoint.y - AB_endPoint.y;
        vec2_bd.x = CD_endPoint.x - AB_endPoint.x;
        vec2_bd.y = CD_endPoint.y - AB_endPoint.y;

        // 利用叉乘判断是否两天线段是否相交
        let result1 = (vec2_ab.x * vec2_ac.y - vec2_ac.x * vec2_ab.y) * (vec2_ab.x * vec2_ad.y - vec2_ad.x * vec2_ab.y);
        let result2 = (vec2_dc.x * vec2_da.y - vec2_da.x * vec2_dc.y) * (vec2_dc.x * vec2_db.y - vec2_db.x * vec2_dc.y);
        //result1 = keepFloat(result1);
        //result2 = keepFloat(result2);

        // 重合
        if (result1 === 0 && result2 === 0) {
            return false
        }
        // 相交时，计算交点坐标
        if (result1 <= 0 && result2 <= 0) {
            // 求交点的坐标
            let area_acd = vec2_ad.x * vec2_ac.y - vec2_ac.x * vec2_ad.y;
            let area_bcd = vec2_bc.x * vec2_bd.y - vec2_bd.x * vec2_bc.y;

            let area_total = area_acd + area_bcd;
            //area_total = keepFloat(area_total);
            if (area_total !== 0) {
                let t = area_acd / area_total;
                let px = AB_startPoint.x + t * vec2_ab.x;
                let py = AB_startPoint.y + t * vec2_ab.y;

                return {
                    x : px,
                    y : py
                }
            }
            else {
                //return true, pt_a.x, pt_a.y
            }
        }
    };

    /**
     * 已知直线两点，求直线斜率
     *
     * @param startPoint
     * @param endPoint
     * @returns {number | boolean}
     */
    mathUtil.getSlopeBetweenTwoPoints = function (startPoint, endPoint)
    {
        if (startPoint.x === endPoint.x) return false;// 当 (x1 === x2)，说明斜率不存在

        let slope;// 斜率
        let x = endPoint.x - startPoint.x;
        let y = endPoint.y - startPoint.y;
        slope = y / x;

        return slope;
    };









    // mathUtil.prototype 指向 wrapper.prototype
    mathUtil.prototype = wrapper.prototype;
    // 修复原型链
    mathUtil.prototype.constructor = mathUtil;
    // 这里通过mixin方法把_的静态方法，赋值给wrapper实例
    mixin(mathUtil);
    // 暴露
    namespace.mathUtil = mathUtil;

}) (window.cyber || (cyber = Object.create(null)));