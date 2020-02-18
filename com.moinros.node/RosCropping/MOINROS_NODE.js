/*
(function() {

    /!**
     * 判断参数是否为DOM元素
     * @param obj
     * @returns {boolean}
     *!/
    function isDom(obj) {
        if (typeof HTMLElement === 'object') {
            return obj instanceof HTMLElement;
        } else {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
    }

    /!**
     * 判断元素是否为目标元素的子元素;是返回true,不是则返回false
     * @param ele 元素
     * @param target 目标元素
     * @returns {boolean}
     *!/
    function isTargetSon(ele, target) {
        //ele是内部元素，target是你想找到的包裹元素
        if (!ele || ele === document) return false;
        return ele === target ? true : isTargetSon(ele.parentNode, target);
    }

    /!**
     * 将原生DOM对象封装为`DomElement`对象,用于绑定一些常用方法
     * @param selector
     * @returns {DomElement}
     * @constructor
     *!/
    function DomElement(selector) {
        if (!selector) {
            return undefined;
        }
        // selector 本来就是 DomElement 对象，直接返回
        if (selector instanceof DomElement) {
            return selector;
        }
        const SELECTOR = isDom(selector) ? selector : document.createElement(selector);
        this.selector = SELECTOR;
    }

    // 修改原型
    DomElement.prototype = {
        constructor: DomElement,
        // 向元素中添加元素
        append: function(obj) {
            this.selector.appendChild(obj);
            return this;
        },
        // 设置元素ID
        id: function(id) {
            this.selector.id = id;
            return this;
        },
        // 添加class名
        addClass: function(className) {
            if (className) {
                let name = this.selector.className;
                if (name) {
                    this.selector.className = name + ' ' + className;
                } else {
                    this.selector.className = className;
                }

            }
            return this;
        },
        // 移除class名
        removeClass: function(className) {
            if (className) {
                let name = this.selector.className;
                if (name.indexOf(className) >= 0) {
                    name = name.replace(className, '');
                    this.selector.className = name;
                }
            }
            return this;
        },
        // 设置CSS样式,(只传key获取CSS样式)
        css: function(key, val) {
            if (key != null && val != null) {
                let currentStyle = key + ':' + val;
                let style = (this.selector.getAttribute('style') || '').trim();
                if (style) {
                    let item = style.split(';');
                    let resultArr = [];
                    let flag = true;
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].indexOf(key) >= 0) {
                            item[i] = currentStyle;
                            flag = false;
                        }
                    }
                    if (flag) item.push(currentStyle);
                    let value = '';
                    for (let i = 0; i < item.length; i++) {
                        if (item[i]) {
                            value += (item[i] + ';');
                        }
                    }
                    this.selector.setAttribute('style', value);
                } else {
                    this.selector.setAttribute('style', currentStyle + ';');
                }
                return this;
            } else if (key != null) {
                let style = (this.selector.getAttribute('style') || '').trim();
                if (style) {
                    let item = style.split(';');
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].indexOf(key) >= 0) {
                            let value = item[i].replace(key, '');
                            if (value) return value.substring(1, value.length);
                        }
                    }
                }
                return undefined;
            } else {
                throw "DomElement.css 不允许接收两个空值！";
            }
        },
        // 设置属性
        attr: function(key, val) {
            if (val == null) {
                return this.selector.getAttribute(key);
            } else {
                this.selector.setAttribute(key, val);
                return this;
            }
        },
        // 显示
        show: function() {
            return this.css('display', 'block');
        },

        // 隐藏
        hide: function() {
            return this.css('display', 'none');
        },
        // 比较当前元素与目标元素是否为同一对象
        equals: function(obj) {
            return this.selector === obj;
        },
        // 设置或者获取`innerHTML`值,不传参数即为获取
        html: function(value) {
            if (value) {
                this.selector.innerHTML = value;
                return this;
            } else {
                return this.selector.innerHTML;
            }
        },
        // 尺寸数据
        getSizeData: function getSizeData() {
            return this.selector.getBoundingClientRect(); // 可得到 bottom height left right top width 的数据
        },
        // 将元素插入到指定元素末尾
        insertAfter: function(obj) {
            obj.appendChild(this.selector);
        },
        // 绑定事件
        on: function on(type, fn, selector) {
            if (!selector) {
                // 无代理
                this.selector.addEventListener(type, fn);
            } else {
                // 有代理
                this.selector.addEventListener(type, function(e) {
                    let target = e.target;
                    if (target.matches(selector)) {
                        fn.call(target, e);
                    }
                });
            }
            return this;
        },

        // 取消事件绑定
        off: function off(type, fn) {
            this.selector.removeEventListener(type, fn);
            return this;
        },
    }

    function $D(selector) {
        return new DomElement(selector);
    }

    window.$D = $D;
})();*/
