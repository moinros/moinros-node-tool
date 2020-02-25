;(function() {
    "use strict";// 严格模式

    // 是否为DOM节点
    function isDom(obj) {
        if (typeof HTMLElement === 'object') {
            return obj instanceof HTMLElement;
        } else {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
    }

    // 根据 html 代码片段创建 dom 对象
    function createElemByHTML(html) {
        let div = void 0;
        div = document.createElement('div');
        div.innerHTML = html;
        return div.children;
    }

    // 是否是 DOM List
    function isDOMList(selector) {
        if (!selector) {
            return false;
        }
        if (selector instanceof HTMLCollection || selector instanceof NodeList) {
            return true;
        }
        return false;
    }

    // 封装 document.querySelectorAll
    function querySelectorAll(selector) {
        let result = document.querySelectorAll(selector);
        if (isDOMList(result)) {
            return result;
        } else {
            return [result];
        }
    }

    // 记录所有的事件绑定
    const eventList = [];

    /**
     * 自定义{DomElement}对象构造函数<br>
     * 内部调用了document.querySelectorAll()所以兼容属性选择器
     * @param selector {DomElement}对象,DOM对象,属性选择器
     * @returns {DomElement}
     * @constructor {DomElement}
     */
    function DomElement(selector) {
        if (!selector) {
            return void 0;
        }
        // selector 本来就是 DomElement 对象，直接返回
        if (selector instanceof DomElement) {
            return selector;
        }
        this.selector = selector;
        let nodeType = selector.nodeType;
        // 根据 selector 得出的结果（如 DOM，DOM List）
        let selectorResult = [];
        if (nodeType === 9) {
            // document 节点
            selectorResult = [selector];
        } else if (nodeType === 1) {
            // 单个 DOM 节点
            selectorResult = [selector];
        } else if (isDOMList(selector) || selector instanceof Array) {
            // DOM List 或者数组
            selectorResult = selector;
        } else if (typeof selector === 'string') {
            // 字符串
            selector = selector.replace('/\n/mg', '').trim();
            if (selector.indexOf('<') === 0) {
                // 如 <div>
                selectorResult = createElemByHTML(selector);
            } else {
                // 如 #id .class
                selectorResult = querySelectorAll(selector);
            }
        }
        let length = selectorResult.length;
        if (!length) {
            // 空数组
            return this;
        }
        // 加入 DOM 节点
        let i = void 0;
        for (i = 0; i < length; i++) {
            this[i] = selectorResult[i];
        }
        this.length = length;
    }

    // 修改原型
    DomElement.prototype = {
        constructor: DomElement,
        // 类数组，forEach
        forEach: function forEach(fn) {
            let i = void 0;
            for (i = 0; i < this.length; i++) {
                let elem = this[i];
                let result = fn.call(elem, elem, i);
                if (result === false) {
                    break;
                }
            }
            return this;
        },
        /**
         * 获取第几个元素
         * @param index
         * @returns {DomElement}
         */
        get: function get(index) {
            let length = this.length;
            if (index >= length) {
                index = index % length;
            }
            return $C(this[index]);
        },
        /**
         * 获取第几个DOM元素,无参数默认第0个元素
         * @param index
         * @returns {*}
         */
        getElement: function getElement(index) {
            if (index == null) {
                return this[0];
            }
            let length = this.length;
            if (index >= length) {
                index = index % length;
            }
            return this[index];
        },
        // 设置元素ID
        id: function id(val) {
            if (!id) {
                return this;
            }
            return this.forEach(function(elem) {
                elem.id = val;
            });
        },
        // 添加 class
        addClass: function addClass(className) {
            if (!className) {
                return this;
            }
            return this.forEach(function(elem) {
                let arr = void 0;
                if (elem.className) {
                    // 解析当前 className 转换为数组
                    arr = elem.className.split(/\s/);
                    arr = arr.filter(function(item) {
                        return !!item.trim();
                    });
                    // 添加 class
                    if (arr.indexOf(className) < 0) {
                        arr.push(className);
                    }
                    // 修改 elem.class
                    elem.className = arr.join(' ');
                } else {
                    elem.className = className;
                }
            });
        },
        // 删除 class
        removeClass: function removeClass(className) {
            if (!className) {
                return this;
            }
            return this.forEach(function(elem) {
                let arr = void 0;
                if (elem.className) {
                    // 解析当前 className 转换为数组
                    arr = elem.className.split(/\s/);
                    arr = arr.filter(function(item) {
                        item = item.trim();
                        // 删除 class
                        if (!item || item === className) {
                            return false;
                        }
                        return true;
                    });
                    // 修改 elem.class
                    elem.className = arr.join(' ');
                }
            });
        },
        // 获取/设置 属性
        attr: function attr(key, val) {
            if (val == null) {
                // 获取值
                return this[0].getAttribute(key);
            } else {
                // 设置值
                return this.forEach(function(elem) {
                    elem.setAttribute(key, val);
                });
            }
        },
        // 修改 css
        css: function css(key, val) {
            let currentStyle = key + ':' + val + ';';
            return this.forEach(function(elem) {
                let style = (elem.getAttribute('style') || '').trim();
                let styleArr = void 0,
                    resultArr = [];
                if (style) {
                    // 将 style 按照 ; 拆分为数组
                    styleArr = style.split(';');
                    styleArr.forEach(function(item) {
                        // 对每项样式，按照 : 拆分为 key 和 value
                        let arr = item.split(':').map(function(i) {
                            return i.trim();
                        });
                        if (arr.length === 2) {
                            resultArr.push(arr[0] + ':' + arr[1]);
                        }
                    });
                    // 替换或者新增
                    resultArr = resultArr.map(function(item) {
                        if (item.indexOf(key) === 0) {
                            return currentStyle;
                        } else {
                            return item;
                        }
                    });
                    if (resultArr.indexOf(currentStyle) < 0) {
                        resultArr.push(currentStyle);
                    }
                    // 结果
                    elem.setAttribute('style', resultArr.join('; '));
                } else {
                    // style 无值
                    elem.setAttribute('style', currentStyle);
                }
            });
        },
        // 修改元素CSS的width
        width: function width(val) {
            return this.css("width", val + 'px');
        },
        // 修改元素CSS的height
        height: function height(val) {
            return this.css("height", val + 'px');
        },
        // 修改元素CSS的top
        top: function top(val) {
            return this.css("top", val + 'px');
        },
        // 修改元素CSS的right
        right: function right(val) {
            return this.css("right", val + 'px');
        },
        // 修改元素CSS的bottom
        bottom: function bottom(val) {
            return this.css("bottom", val + 'px');
        },
        // 修改元素CSS的left
        left: function left(val) {
            return this.css("left", val + 'px');
        },
        // 显示
        show: function show() {
            return this.css('display', 'block');
        },
        // 隐藏
        hide: function hide() {
            return this.css('display', 'none');
        },
        // 增加子节点
        append: function append($Children) {
            return this.forEach(function(elem) {
                $Children.forEach(function(child) {
                    elem.appendChild(child);
                });
            });
        },
        // 移除当前节点
        remove: function remove() {
            return this.forEach(function(elem) {
                if (elem.remove) {
                    elem.remove();
                } else {
                    let parent = elem.parentElement;
                    parent && parent.removeChild(elem);
                }
            });
        },
        // 是否包含某个子节点
        isContain: function isContain($Child) {
            let elem = this[0];
            let child = $Child[0];
            return elem.contains(child);
        },
        // 获取当前元素的 text
        text: function text(val) {
            if (!val) {
                // 获取 text
                let elem = this[0];
                return elem.innerHTML.replace(/<.*?>/g, function() {
                    return '';
                });
            } else {
                // 设置 text
                return this.forEach(function(elem) {
                    elem.innerHTML = val;
                });
            }
        },
        // 获取 设置html,无参数为获取
        html: function html(val) {
            let elem = this[0];
            if (val == null) {
                return elem.innerHTML;
            } else {
                elem.innerHTML = val;
                return this;
            }
        },
        // 获取 value
        val: function val(val) {
            let elem = this[0];
            if (val == null) {
                return elem.value.trim();
            }
            return this.forEach(function(elem) {
                elem.value = val;
            });
        },
        // parent
        parent: function parent() {
            let elem = this[0];
            return $C(elem.parentElement);
        },
        // 判断两个 elem 是否相等
        equal: function equal($elem) {
            if ($elem.nodeType === 1) {
                return this[0] === $elem;
            } else {
                return this[0] === $elem[0];
            }
        },
        // 将该元素插入到某个元素之中
        insertTarget: function insertTarget(selector) {
            let $referenceNode = $C(selector);
            let referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function(elem) {
                referenceNode.appendChild(elem);
            })
        },
        // 将该元素插入到某个元素前面
        insertBefore: function insertBefore(selector) {
            let $referenceNode = $C(selector);
            let referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function(elem) {
                let parent = referenceNode.parentNode;
                parent.insertBefore(elem, referenceNode);
            });
        },
        // 将该元素插入到某个元素后面
        insertAfter: function insertAfter(selector) {
            let $referenceNode = $C(selector);
            let referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function(elem) {
                let parent = referenceNode.parentNode;
                if (parent.lastChild === referenceNode) {
                    // 最后一个元素
                    parent.appendChild(elem);
                } else {
                    // 不是最后一个元素
                    parent.insertBefore(elem, referenceNode.nextSibling);
                }
            });
        },
        // 绑定事件
        on: function on(type, selector, fn) {
            // selector 不为空，证明绑定事件要加代理
            if (!fn) {
                fn = selector;
                selector = null;
            }
            // type 是否有多个
            let types = [];
            types = type.split(/\s+/);
            return this.forEach(function(elem) {
                types.forEach(function(type) {
                    if (!type) {
                        return;
                    }
                    // 记录下，方便后面解绑
                    eventList.push({
                        elem: elem,
                        type: type,
                        fn: fn
                    });
                    if (!selector) {
                        // 无代理
                        elem.addEventListener(type, fn);
                        return;
                    }
                    // 有代理
                    elem.addEventListener(type, function(e) {
                        let target = e.target;
                        if (target.matches(selector)) {
                            fn.call(target, e);
                        }
                    });
                });
            });
        },
        // 取消事件绑定
        off: function off(type, fn) {
            return this.forEach(function(elem) {
                elem.removeEventListener(type, fn);
            });
        },
    }

    /**
     * 构建一个{DomElement}对象
     * @param selector
     * @returns {DomElement}
     */
    function $C(selector) {
        if (selector != null) return new DomElement(selector);
    }

    window.$C = $C;
})();
