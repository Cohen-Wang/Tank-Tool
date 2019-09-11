/**
 * Clone the attribute
 * @param attribute
 */

var cyber = window.cyber || {};

let cloneAttribute = function (attribute)
{
    switch (Object.prototype.toString.call(attribute))
	{
		// Null
        case '[object Null]':
            return null;
            break;

		// Array
        case '[object Array]':
            return attribute.slice(0);
            break;

		// String or Number
        case '[object String]':
        case '[object Number]':
            return attribute.toString();
            break;

		// Object
        case '[object Object]':

            // Null
            if (attribute === null)
            {
                return null;
            }

            // Element node
            else if (attribute.nodeType === 1)
            {
                return document.createElement( attribute.nodeName );
            }
            else// Others
			{
                return attribute;
            }
            break;

		// Others
        default:
            return attribute;
            break;
    }
};



/**
 * The factory to create class
 * @param name The class name 类名
 * @param extend The super class that will be inherited 继承的父类，function对象
 * @param implement The interfaces that will be implemented 继承的接口，类似{ name：123 }的对象
 * @param property All the attributes and functions that will be used to create new class
 * 新创建的类的属性和方法，也是类似json格式的对象，主要原理是用闭包的方式保存属性attributes，方法放在原型上面。
 * 如果需要继承父类，实例化一个空对象，空对象的原型用于放置父类的原型，将这个空对象作为类的原型，就可以实现继承了。
 * 静态变量直接写在类上面，就可以继承了。
 * 不支持多继承，支持多接口集成，implement可以为存放多个接口对象的数组。
 * 实现了在子类中访问超类的同名方法，即被子类重写的方法，用_parent访问。
 * 所有_开头的属性和方法都是私有的，这只是一种人为的约束，技术上目前无法约束。
 * _init是默认的构造函数。
 */

cyber.classFactory = function(name, extend, implement, property)
{
    let attributes = {};// To store all the attributes for new class
    let prototype = {};// The prototype of new class

    // The parent class prototype
    let parentPrototype = {};

    // If the extend param is defined, means new class will inherited from the extend param
    if (typeof extend === 'function')
    {
        let F = function () {};
        parentPrototype = F.prototype = extend.prototype;
        prototype = new F();
    }

    // Push the implement and property together
    let _tmpArr = [];
    if (implement)
    {
        if (!Array.isArray(implement))
        {
            _tmpArr.push( implement );
        }
        else
		{
            _tmpArr = implement;
        }
    }
    if (property)
    {
        _tmpArr.push( property );
    }

    // Deal with the interfaces and property
    for (let i = 0, len = _tmpArr.length; i < len; i++)
    {
        let _interface = _tmpArr[ i ];
        for (let index in _interface)
        {
            prop = _interface[index];

            // Function
            if (typeof prop === 'function')
            {
                prototype[index] = !parentPrototype[index] ? prop : (function() {
                    let _parentFunction = parentPrototype[index],
                        _ownerFunction = prop;

                    return function ()
					{
                        this._parent = _parentFunction;
                        _ownerFunction.apply(this, arguments);
                        delete this._parent;
                    }
                })();
            }
            else// Attribute
			{
                attributes[index] = prop;
            }
        }
    }

	// Create class
    function Class ( flag )
	{
        // Init the inherited attributes
        if (typeof extend === 'function')
        {
            extend.call( this, false );
        }

        // Init the owner attributes
        for (let index in attributes)
        {
            this[index] = cloneAttribute( attributes[index] );
        }

        this.className = name;

        // Call the constructor
        if (flag !== false && this._init)
        {
            this._init.apply(this, arguments);
        }
    }

    Class.prototype = prototype;

	// Inherit the static property
    let hasOwnProp = Object.prototype.hasOwnProperty;

    for (let index in extend)
    {
        if (hasOwnProp.call(extend, index))
        {
            Class[index] = extend[index];
        }
    }

    return Class;
};
