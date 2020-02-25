(function(api, factory) {
    // 检验是否浏览器环境
    try {
        document;
    } catch (ex) {
        throw new Error('请在浏览器环境下运行');
    }
    factory();
    window.XMPictureCut = factory();
})(this, function() {
    "use strict";// 严格模式


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
        } else if ($D.isDOMList(selector) || selector instanceof Array) {
            // DOM List 或者数组
            selectorResult = selector;
        } else if (typeof selector === 'string') {
            // 字符串
            selector = selector.replace('/\n/mg', '').trim();
            if (selector.indexOf('<') === 0) {
                // 如 <div>
                selectorResult = $D.createElemByHTML(selector);
            } else {
                // 如 #id .class
                selectorResult = $D.querySelectorAll(selector);
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
            return $D(this[index]);
        },
        getResult: function getResult() {
            let result = [];
            this.forEach(function(elem) {
                result.push(elem);
            });
            return result;
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
        append: function append($Dhildren) {
            console.log(this.forEach);
            return this.forEach(function(elem) {
                $Dhildren.forEach(function(child) {
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
        isContain: function isContain($Dhild) {
            let elem = this[0];
            let child = $Dhild[0];
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
            return $D(elem.parentElement);
        },
        // 判断两个 elem 是否相等
        equal: function equal($elem) {
            if ($elem.nodeType === 1) {
                return this[0] === $elem;
            } else {
                return this[0] === $elem[0];
            }
        },
        // 将该元素插入到某个目标元素之中,如果目标元素有多个,则只会对第一个目标元素生效
        insertTarget: function insertTarget(selector) {
            let $referenceNode = $D(selector);
            let referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function(elem) {
                referenceNode.appendChild(elem);
            })
        },
        // 将该元素插入到某个元素前面,如果目标元素有多个,则只会对第一个目标元素生效
        insertBefore: function insertBefore(selector) {
            let $referenceNode = $D(selector);
            let referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function(elem) {
                let parent = referenceNode.parentNode;
                parent.insertBefore(elem, referenceNode);
            });
        },
        // 将该元素插入到某个元素后面,如果目标元素有多个,则只会对第一个目标元素生效
        insertAfter: function insertAfter(selector) {
            let $referenceNode = $D(selector);
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
     * @returns {*}
     */
    function $D(selector) {
        return selector != null ? new DomElement(selector) : void 0;
    }

    // 修改$D__proto__原型
    Object.setPrototypeOf($D, {
        // 移除指定元素
        removeElement: function removeElement(ele) {
            if (ele) ele.parentNode.removeChild(ele);
        },
        // 是否为DOM节点
        isDom: function isDom(obj) {
            if (typeof HTMLElement === 'object') {
                return obj instanceof HTMLElement;
            } else {
                return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
            }
        },
        // 根据 html 代码片段创建 dom 对象
        createElemByHTML: function createElemByHTML(html) {
            let div = void 0;
            div = document.createElement('div');
            div.innerHTML = html;
            return div.children;
        },
        // 是否是 DOM List
        isDOMList: function isDOMList(selector) {
            if (!selector) {
                return false;
            }
            if (selector instanceof HTMLCollection || selector instanceof NodeList) {
                return true;
            }
            return false;
        },
        // 封装 document.querySelectorAll
        querySelectorAll: function querySelectorAll(selector) {
            let result = document.querySelectorAll(selector);
            if (this.isDOMList(result)) {
                return result;
            } else {
                return [result];
            }
        },
    });


    // 配置信息
    const CONFIG = {
        // 插件的z-index属性
        zIndex: 999,
        // 是否开启debug
        debug: true,
        // 长宽比值,默认 1 / 1,
        aspectRatio: 1 / 1,
        // 是否按比例缩放裁剪框?默认true,即按照'aspectRatio'比例进行缩放,设置为false后即可任意拉伸裁剪框
        freeScaling: true,
        // 图片能否放大
        zoomable: false,
        // 图片按照原始尺寸裁剪?true表示按照原始尺寸等比例裁剪,false表示按照网页显示的尺寸裁剪
        originalSize: true,
        // 封装了裁剪区动态参数的函数,裁剪框没移动一次即调用一次,可用于显示动态的尺寸信息等数据
        cropView: void 0,
        // 上传文件数据时参数名
        formName: 'file',
        // 插件
        plugin: {
            // 选择文件的<input>标签
            fileInput: void 0,
            // 预览图选择器例如.preview、#preview
            preview: [],
            // 恢复默认样式按钮选择器,默认使用内置按钮,设置后内置按钮不会创建
            restore: void 0,
        },
        // 默认CSS样式(selector:元素选择器,list:CSS样式表,以key,val的形式设置样式),注:这里配置的样式表生成插件时会以<style>标签的形式加到<head>标签中
        CSS: [
            {
                selector: ".XMPictureCut",
                list: [
                    {key: "position", val: "relative"},
                    {key: 'width', val: '1000px'},
                    {key: 'margin', val: 'auto'},
                    {key: 'user-select', val: 'none'},
                ]
            },
            {
                selector: ".XMPictureCut .drag-point",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'width', val: '6px'},
                    {key: 'height', val: '6px'},
                    {key: 'background-color', val: '#556dff'},
                    {key: 'border', val: '1px solid #ffffff'},
                    {key: 'opacity', val: '0.6'},
                    {key: 'z-index', val: '999'},
                ]
            },
            {
                selector: ".XMPictureCut .drag-point:hover",
                list: [
                    {key: 'border', val: '1px solid #ff0'},
                ]
            },
            {
                selector: ".XMPictureCut .point-n",
                list: [
                    {key: 'top', val: '-4px'},
                    {key: 'left', val: 'calc(50% - 5px)'},
                    {key: 'cursor', val: 'n-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .point-e",
                list: [
                    {key: 'right', val: '-4px'},
                    {key: 'top', val: 'calc(50% - 5px)'},
                    {key: 'cursor', val: 'e-resize'},

                ]
            },
            {
                selector: ".XMPictureCut .point-s",
                list: [
                    {key: 'bottom', val: '-4px'},
                    {key: 'left', val: 'calc(50% - 5px)'},
                    {key: 'cursor', val: 's-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .point-w",
                list: [
                    {key: 'left', val: '-4px'},
                    {key: 'top', val: 'calc(50% - 5px)'},
                    {key: 'cursor', val: 'w-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .point-ne",
                list: [
                    {key: 'right', val: '-4px'},
                    {key: 'top', val: '-4px'},
                    {key: 'cursor', val: 'nesw-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .point-se",
                list: [
                    {key: 'right', val: '-4px'},
                    {key: 'bottom', val: '-4px'},
                    {key: 'cursor', val: 'nwse-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .point-nw",
                list: [
                    {key: 'left', val: '-4px'},
                    {key: 'top', val: '-4px'},
                    {key: 'cursor', val: 'nwse-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .point-sw",
                list: [
                    {key: 'left', val: '-4px'},
                    {key: 'bottom', val: '-4px'},
                    {key: 'cursor', val: 'nesw-resize'},
                ]
            },
            {
                selector: ".XMPictureCut .xm-pc-crop-wrap",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'width', val: '1000px'},
                    {key: 'margin', val: 'auto'},
                ]
            },
            {
                selector: ".XMPictureCut .xm-pc-native-box",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'width', val: '100%'},
                ]
            },
            {
                selector: ".XMPictureCut .xm-pc-native-box img",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'width', val: '100%'},
                ]
            },
            {
                selector: ".XMPictureCut .xm-pc-masking",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'width', val: '100%'},
                    {key: 'height', val: '100%'},
                    {key: 'left', val: '0px'},
                    {key: 'top', val: '0px'},
                ]
            },
            {
                selector: ".XMPictureCut .xm-pc-drag-box",
                list: [
                    {key: 'position', val: 'absolute'},
                    {key: 'display', val: 'none'},
                    {key: 'cursor', val: 'move'},
                    {key: 'box-shadow', val: '0px 0px 1px 1px #fafafa'},
                ]
            },
            {
                selector: ".XMPictureCut .xm-pc-drag-box img",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'transform', val: 'translateX(0px) translateY(0px)'},

                ]
            },
        ],
        // 默认的`keyframes`动画样式
        keyframes: [
            {
                selector: "@keyframes keyframes-name",
                val: [
                    {
                        name: 'form',
                        style: [
                            {key: 'color', val: '#333'},
                        ],
                    },
                    {
                        name: 'to',
                        style: [
                            {key: 'color', val: '#666'},
                        ],
                    },
                ],
            },
        ],
    };

    let PLUGIN_LIST = [];

    // 图片裁剪插件本体
    function PictureCut($config, $framework, $id) {
        // DOM结构
        let $f = {
            // 选择器
            SELECTOR_BOX: void 0,
            // 裁剪区域插件
            XMPictureCutBox: void 0,
            // 裁剪区外壳
            cropWrap: void 0,
            // 本地图片外壳
            nativeBox: void 0,
            // 本地图片
            nativeImage: void 0,
            // 遮罩层外壳
            masking: void 0,
            // 裁剪框
            drag: void 0,
            // 裁剪框初始尺寸
            dragSize: {
                width: 100,
                height: 100 / $config.aspectRatio,
            },
            // 预览图外套
            previewBox: void 0,
            // 预览图
            viewImage: void 0,
            // 缩放点
            point: {
                // 北
                n: void 0,
                // 东
                e: void 0,
                // 南
                s: void 0,
                // 西
                w: void 0,
                // 东北
                ne: void 0,
                // 东南
                se: void 0,
                // 西北
                nw: void 0,
                // 西南
                sw: void 0,
            },
            view: {
                // 尺寸数据
                result: {},
                // 预览图列表
                list: [],
            },
        };
        this.start_up = false;
        // 配置信息
        this.config = $config;

        // 插件的DOM结构
        this.framework = Object.assign($f, $framework);
        console.log(this.config);
        // 插件ID
        this.id = $id;
        // 编号
        this.index = PLUGIN_LIST.length;
        // 每次创建新的对象时保存对象引用,用于销毁对象时使用
        PLUGIN_LIST.push({
            $index: this.index,
            $id: this.id,
            $val: this,
        });
        // 初始化
        this.init();
    }

    // 修改原型
    PictureCut.prototype = {
        constructor: PictureCut,

        // 设置是否等比例缩放裁剪框
        setFreeScaling: function(bl) {
            if (bl === true || bl === false) {
                this.config.freeScaling = bl;
            } else {
                return this.config.freeScaling;
            }
        },
        // 获取裁剪区尺寸数据
        getViewSize: function() {
            return this.framework.view.result;
        },
        // 将裁剪出的图片转换为Base64格式返回
        getImageBase64: function() {
            console.log(this);
            if (this.config.originalSize) {
            }
            let image = this.framework.nativeImage;
            let size = this.framework.view.result;
            let nw = image.naturalWidth;
            let nh = image.naturalHeight;
            let ca = document.createElement("canvas");
            ca.width = nw;
            ca.height = nh;
            let ctx = ca.getContext("2d");
            ctx.drawImage(image, 0, 0, nw, nh);
            ctx.save();
            let offset = nw / image.width;
            let data = ctx.getImageData(size.imageX, size.iamgeY, size.imageWidth, size.imageHeight);
            ctx.clearRect(0, 0, nw, nh);
            ca.width = size.dragWidth * offset;
            ca.height = size.dragHeight * offset;
            ctx.putImageData(data, 0, 0);
            ctx.save();
            return {
                width: ca.width,
                height: ca.height,
                data: ca.toDataURL("image/jpeg"),
            };
        },
        mouseState: true,
        setEvent: function setEvent(elem, crop, fn) {
            // 为指定的元素绑定鼠标事件
            elem.onmousedown = function(me) {
                if (crop.mouseState) {
                    crop.mouseState = false;
                    // 获取鼠标和`裁剪框`的坐标参数
                    let coordinate = crop.getCoordinate(me);
                    document.onmousemove = function(e) {
                        coordinate.x = coordinate.diffX - e.clientX;
                        coordinate.y = coordinate.diffY - e.clientY;
                        // 执行元素绑定的函数
                        fn(e, crop, coordinate);
                        // 设置预览图的clip属性
                        crop.setClip();
                        // 显示坐标尺寸
                        crop.showViewSize();
                        // 显示其他位置的预览图
                        crop.showViewList();
                    };
                    // 鼠标弹起时清除`onmousemove`事件,防止重复调用
                    document.onmouseup = function(e) {
                        document.onmousemove = null;
                        e.preventDefault();
                        crop.mouseState = true;
                    };
                }
            }
        },
        // 获取动态的坐标数据
        getCoordinate: function getCoordinate(e) {
            return {
                // 按下鼠标时获取参考X坐标
                diffX: e.clientX,
                // 获取参考Y坐标
                diffY: e.clientY,
                // 获取`裁剪框`宽度
                DW: this.framework.drag.offsetWidth,
                // 获取`裁剪框`高度
                DH: this.framework.drag.offsetHeight,
                // 获取`裁剪框`距离左边框距离
                DX: this.framework.drag.offsetLeft,
                // 获取距离上边框距离
                DY: this.framework.drag.offsetTop,
                // 本地图片的长度
                MW: this.framework.nativeImage.offsetWidth,
                // 本地图片的宽度
                MH: this.framework.nativeImage.offsetHeight,
                // X轴偏移量
                x: 0,
                // Y轴偏移量
                y: 0,
            };
        },
        // 设置预览图片的Clip属性,实现预览图跟随裁剪框移动的效果
        setClip: function setClip() {
            let $result = this.framework.view.result;
            // `预览图``top`坐标
            $result.viewTop = this.framework.drag.offsetTop;
            // `预览图``right`坐标
            $result.viewRight = this.framework.drag.offsetLeft + this.framework.drag.offsetWidth;
            // `预览图``bottom`坐标
            $result.viewBottom = this.framework.drag.offsetTop + this.framework.drag.offsetHeight;
            // `预览图``left`坐标
            $result.viewLeft = this.framework.drag.offsetLeft;
            // `裁剪框`X坐标
            $result.dragLeft = this.framework.drag.offsetLeft;
            // `裁剪框`Y坐标
            $result.dragTop = this.framework.drag.offsetTop;
            // `裁剪框`长
            $result.dragWidth = this.framework.drag.offsetWidth;
            // `裁剪框`宽
            $result.dragHeight = this.framework.drag.offsetHeight;
            // 缩放比例
            let offset = this.framework.nativeImage.naturalWidth / this.framework.nativeImage.offsetWidth;
            // 根据原图尺寸计算X坐标
            $result.imageX = $result.dragLeft * offset;
            // 根据原图尺寸计算Y坐标
            $result.iamgeY = $result.dragTop * offset;
            // 根据原图长度计算预览图的长度
            $result.imageWidth = $result.dragWidth * offset;
            // 根据原图宽度计算预览图的宽度
            $result.imageHeight = $result.dragHeight * offset;
            // 设置clip属性
            $D(this.framework.viewImage).css("clip", "rect(" + $result.viewTop + "px, " + $result.viewRight + "px, " + $result.viewBottom + "px, " + $result.viewLeft + "px)");
        },
        // 显示尺寸数据
        showViewSize: function showViewSize() {
            // 调用指定的显示函数,没有指定则忽略
            if (this.config.cropView) this.config.cropView(this.framework.view.result);
        },

        /**
         * 显示预览缩略图
         */
        showViewList: function showViewList() {
            if (this.framework.view.list) {
                let $list = this.framework.view.list;
                let $result = this.framework.view.result;
                for (let i = 0; i < $list.length; i++) {
                    let offset = $list[i].offsetWidth / $result.dragWidth;
                    $D($list[i].childNodes[0]).css("transform", "translateX(" + -($result.dragLeft * offset) + "px) translateY(" + -($result.dragTop * offset) + "px)").width($result.viewWidth * offset).height($result.viewHeight * offset);
                }
            }
        },

        /**
         * 初始化缩略图预览图列表
         */
        initViewList: function initViewList(fr) {
            let previews = this.config.plugin.preview;
            if (previews) {
                let $list = this.framework.view.list;
                // 判断view列表中是否存在视图元素,有的话先移除
                if ($list.length > 0) {
                    for (let i = 0; i < $list.length; i++) {
                        //
                        $list[i].innerHTML = null;
                    }
                } else {
                    for (let i = 0; i < previews.length; i++) {
                        let result = $D(previews[i]).css("position", "relative").css("overflow", "hidden").getResult();
                        for (let j = 0; j < result.length; j++) {
                            if (result[j]) $list.push(result[j]);
                        }
                    }
                }
                let $result = this.framework.view.result;
                for (let i = 0; i < $list.length; i++) {
                    let offset = $list[i].offsetWidth / $result.dragWidth;
                    let image = new Image();
                    image.src = fr.result;
                    $D(image).insertTarget($list[i]).css("transform", "translateX(" + -($result.dragLeft * offset) + "px) translateY(" + -($result.dragTop * offset) + "px)").width($result.viewWidth * offset).height($result.viewHeight * offset);
                }
            }
        },
        // 为元素绑定事件
        bindEvent: function bindEvent() {
            let $this = this;
            // let $config = this.config;
            let $framework = this.framework;

            // 核心要点: [原始尺寸 + 偏移量 == 新的尺寸]

            // 设置`裁剪框`的拖动效果
            this.setEvent($framework.drag, $this, function(e, crop, cs) {
                // 根据图片的长宽和`裁剪框`的长宽计算出`left`,和`top`的最大值
                // `裁剪框``left`坐标
                let dx = (cs.DX - cs.x < 0 ? 0 : cs.DX - cs.x > cs.MW - cs.DW ? cs.MW - cs.DW : cs.DX - cs.x);
                // `裁剪框``top`坐标
                let dy = (cs.DY - cs.y < 0 ? 0 : cs.DY - cs.y > cs.MH - cs.DH ? cs.MH - cs.DH : cs.DY - cs.y);
                // 计算完成后重新设置坐标,实现拖动效果
                $D(crop.framework.drag).left(dx).top(dy);
            });

            // 东北
            this.setEvent($framework.point.ne, $this, function(e, crop, cs) {
                // 计算缩放后的长
                let dw = (cs.DW - cs.x > cs.MW - cs.DX ? cs.MW - cs.DX : cs.DW - cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH + cs.y > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DH + cs.y);
                // 是否等比例放大裁剪框
                if (crop.config.freeScaling) {
                    dw = cs.DW * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                    dh = cs.DH * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                }
                // 因为只需要向右边拖动,所以X坐标不需要校准
                // 校准Y坐标 [原始Y坐标 - 偏移量 == 当前Y坐标; 原始Y坐标 + 原始高度 == 最大Y坐标;]
                let dy = (cs.DY + cs.DH - dh < 0 ? 0 : cs.DY + cs.DH - dh > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DY + cs.DH - dh);
                // let dy = cs.DY - cs.y < 0 ? 0 : cs.DY - cs.y > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DY - cs.y;
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(crop.framework.drag).width(dw).height(dh).top(dy);
            });

            // 东南
            this.setEvent($framework.point.se, $this, function(e, crop, cs) {
                // 计算缩放后的长
                let dw = (cs.DW - cs.x > cs.MW - cs.DX ? cs.MW - cs.DX : cs.DW - cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH - cs.y > cs.MH - cs.DY ? cs.MH - cs.DY : cs.DH - cs.y);
                // 是否等比例放大裁剪框
                if (crop.config.freeScaling) {
                    dw = cs.DW * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                    dh = cs.DH * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                }
                // 由于DOM元素默认以左上角为基准坐标的,所以东南方的尺寸改变不需要校准X,Y坐标
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(crop.framework.drag).width(dw).height(dh);
            });

            // 西南
            this.setEvent($framework.point.sw, this, function(e, crop, cs) {
                // 计算缩放后的长
                let dw = (cs.DW + cs.x > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DW + cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH - cs.y > cs.MH - cs.DY ? cs.MH - cs.DY : cs.DH - cs.y);
                // 是否等比例放大裁剪框
                if (crop.config.freeScaling) {
                    dw = cs.DW * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                    dh = cs.DH * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                }
                // 校准X坐标
                let dx = (cs.DX + cs.DW - dw < 0 ? 0 : cs.DX + cs.DW - dw > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DX + cs.DW - dw);
                // let dx = (cs.DX - cs.x < 0 ? 0 : cs.DX - cs.x > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DX - cs.x);
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(crop.framework.drag).width(dw).height(dh).left(dx);
            });

            // 西北
            this.setEvent($framework.point.nw, $this, function(e, crop, cs) {
                // 计算缩放后的长
                let dw = (cs.DW + cs.x > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DW + cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH + cs.y > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DH + cs.y);
                // 是否等比例放大裁剪框
                if (crop.config.freeScaling) {
                    dw = cs.DW * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                    dh = cs.DH * (dw / cs.DW < dh / cs.DH ? dw / cs.DW : dh / cs.DH);
                }
                // 校准X坐标
                let dx = (cs.DX + cs.DW - dw < 0 ? 0 : cs.DX + cs.DW - dw > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DX + cs.DW - dw);
                // 校准Y坐标
                let dy = (cs.DY + cs.DH - dh < 0 ? 0 : cs.DY + cs.DH - dh > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DY + cs.DH - dh);
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(crop.framework.drag).width(dw).height(dh).left(dx).top(dy);
            })
            ;
            // 为图片选择框绑定事件
            $D($framework.button.fileInput).on("change", function() {
                $this.loadingImage(this);
            })

            if ($this.config.plugin.restore) {
                $D($this.config.plugin.restore).on("click", function() {
                    $this.initView();
                });
            }


        },
        // 加载本地图片
        loadingImage: function(e) {
            let $this = this;
            let $f = this.framework;
            let $config = this.config;
            let file = e.files[0];
            // 判断是文件是否为图片
            if ((file.type).indexOf("image/") >= 0) {
                // 使用'FileReader'读取文件
                let fr = new FileReader();
                fr.readAsDataURL(file);
                // 读取文件出现错误时,会调用'onerror'函数,不过暂时没想到怎么测试,就不管了
                fr.onerror = function() {
                    alert("读取文件出错！请重试！");
                };
                // 读取文件完成后,会调用'onload'函数
                fr.onload = function() {
                    // 判断是否已经存有图片数据,有的话先移除
                    if ($f.nativeImage != null) {
                        $D($f.nativeImage).remove();
                        $f.nativeImage = null;
                    }
                    if ($f.viewImage != null) {
                        $D($f.viewImage).remove();
                        $f.viewImage = null;
                    }
                    // 创建新的图片
                    let nativeImage = new Image();
                    // 将新的图片对象添加到DOM树中
                    $f.nativeImage = $D(nativeImage).attr("src", fr.result).css("position", "absolute").insertTarget($f.nativeBox).getElement(0);
                    // 图片加载完成后初始化裁剪区尺寸数据
                    nativeImage.onload = function() {
                        let viewImage = new Image(nativeImage.width, nativeImage.height);
                        $f.viewImage = $D(viewImage).attr("src", fr.result).css("position", "absolute").insertTarget($f.previewBox).getElement(0);
                        $this.initViewList(fr);
                        $this.initView();
                    }
                };
            } else {
                alert("你选择的文件不是图片哦~");
            }
        },

        // 设置裁剪区尺寸数据
        setViewSize: function(dx, dy, dw, dh) {
            let $f = this.framework;
            $D($f.drag).left(dx).top(dy).width(dw).height(dh);
            this.setClip();
            this.showViewList();
        },
        /**
         * 初始化裁剪框尺寸坐标
         */
        initView: function initView() {
            let $f = this.framework;
            // 本地图片的原始长度
            $f.view.result.nativeWidth = $f.nativeImage.naturalWidth;
            // 本地图片的原始宽度
            $f.view.result.nativeHeight = $f.nativeImage.naturalHeight;
            // 页面显示的图片长
            $f.view.result.viewWidth = $f.nativeImage.width;
            // 页面显示的图片宽
            $f.view.result.viewHeight = $f.nativeImage.height;
            $D($f.previewBox).width($f.nativeImage.width).height($f.nativeImage.height);
            $D($f.previewBox).width($f.nativeImage.width).height($f.nativeImage.height);
            $D($f.masking).width($f.nativeImage.width).height($f.nativeImage.height);
            $D($f.drag).show().left($f.nativeImage.width / 2 - 50).top($f.nativeImage.height / 2 - 50).width($f.dragSize.width).height($f.dragSize.height);
            this.setClip();
            this.showViewList();
        },

        // 初始化
        init: function init() {
            this.bindEvent();
        },
    };


    function PictureCutFactory() {

    }

    PictureCutFactory.prototype = {
        constructor: PictureCutFactory,
        _initConfig: function _initConfig(conf) {
            let target = {};
            return Object.assign(target, CONFIG, conf);
        },
        // 初始化CSS样式表
        _initCSS: function _initCSS(css) {
            // 将通用的默认CSS样式添加到style标签中
            let list = [];
            for (let i = 0; i < css.length; i++) {
                let val = css[i].selector + '{ ';
                for (let j = 0; j < css[i].list.length; j++) {
                    val += css[i].list[j].key + ':' + css[i].list[j].val + '; ';
                }
                val += '}';
                list.push(val);
            }
            let kst = CONFIG.keyframes;
            for (let i = 0; i < kst.length; i++) {
                let val = kst[i].selector + '{ ';
                for (let j = 0; j < kst[i].val.length; j++) {
                    val += kst[i].val[j].name + '{ ';
                    for (let k = 0; k < kst[i].val[j].style.length; k++) {
                        val += kst[i].val[j].style[k].key + ': ' + kst[i].val[j].style[k].val + ';';
                    }
                    val += '}';
                }
                val += '}';
                list.push(val);
            }
            $D("<style></style>").attr("type", 'text/css').insertTarget($D('head')).html(list.join('\n'));
        },
        _initDOM: function _initDOM($selector, $config, $id) {
            let $SelectorBox = $D($selector).getElement(0);
            let $XMPictureCutBox = $D("<div class='XMPictureCut'></div>").insertTarget($SelectorBox).id($id).css("z-index", $config.zIndex).css("position", "relative").css("user-select", "none").getElement(0);
            let $cropWrap = $D("<div class='xm-pc-crop-wrap'></div>").insertTarget($XMPictureCutBox).css("position", "relative").css("width", "100%").getElement(0);
            let $nativeBox = $D("<div class='xm-pc-native-box'></div>").insertTarget($cropWrap).css("position", "absolute").getElement(0);
            let $masking = $D("<div class='xm-pc-masking'></div>").insertTarget($cropWrap).css("position", "absolute").css("background-color", "#666666").css("opacity", "0.5").getElement(0);
            let $previewBox = $D("<div class='xm-pc-preview-box'></div>").insertTarget($cropWrap).getElement(0);
            let $drag = $D("<div class='xm-pc-drag-box' style='display: none'></div>").insertTarget($cropWrap).getElement(0);
            let $point_n = $D("<div class='drag-point point-n'></div>").insertTarget($drag).getElement(0);
            let $point_e = $D("<div class='drag-point point-e'></div>").insertTarget($drag).getElement(0);
            let $point_s = $D("<div class='drag-point point-s'></div>").insertTarget($drag).getElement(0);
            let $point_w = $D("<div class='drag-point point-w'></div>").insertTarget($drag).getElement(0);
            let $point_ne = $D("<div class='drag-point point-ne'></div>").insertTarget($drag).getElement(0);
            let $point_se = $D("<div class='drag-point point-se'></div>").insertTarget($drag).getElement(0);
            let $point_nw = $D("<div class='drag-point point-nw'></div>").insertTarget($drag).getElement(0);
            let $point_sw = $D("<div class='drag-point point-sw'></div>").insertTarget($drag).getElement(0);
            let $fileInput;
            if ($config.plugin.fileInput) {
                $fileInput = $D($config.plugin.fileInput).getElement(0);
            } else {
                $fileInput = $D("<input type='file'/>").insertTarget($D("<div class='xm-pc-file-box'></div>").insertTarget($XMPictureCutBox)).attr("name", $config.formName).getElement(0);
            }
            return {
                SELECTOR_BOX: $SelectorBox,
                XMPictureCutBox: $XMPictureCutBox,
                cropWrap: $cropWrap,
                nativeBox: $nativeBox,
                masking: $masking,
                drag: $drag,
                previewBox: $previewBox,
                point: {
                    n: $point_n,
                    e: $point_e,
                    s: $point_s,
                    w: $point_w,
                    ne: $point_ne,
                    se: $point_se,
                    nw: $point_nw,
                    sw: $point_sw,
                },
                button: {
                    fileInput: $fileInput,
                },
            };
        },
        _getPictureCut: function _getPictureCut(conf, selector, $id) {
            let $config = this._initConfig(conf);
            console.log($config);
            let $framework = this._initDOM(selector, $config, $id);
            this._initCSS($config.CSS);
            let picture = new PictureCut($config, $framework, $id);
            return {
                $getImage: () => {
                    return picture.getImageBase64()
                },
                $setView: (dx, dy, dw, dh) => {
                    if (REGEX_NUMBER.test(dx) && REGEX_NUMBER.test(dy) && REGEX_NUMBER.test(dw) && REGEX_NUMBER.test(dh)) {
                        picture.setViewSize(dx, dy, dw, dh);
                    } else {
                        alert("只能输入正数！");
                    }
                },
                $getViewSize: () => {
                    return picture.getViewSize()
                },
                $setFreeScaling: (bl) => {
                    picture.setFreeScaling(bl)
                },
            };
        }
    };
    const REGEX_NUMBER = /^[0-9]+\.?[0-9]+$/;


    // 插件编号
    let XM_PC_ID_INDEX = 1;

    /**
     * 插件工厂,用于获取初始化插件的对象
     * @constructor
     */
    function XMPictureCut(selector) {
        if (selector == null) throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档');
        // 插件ID
        this.XM_PC_ID = "XMPictureCut_" + XM_PC_ID_INDEX++;
        // 初始化选择器
        this.selector = selector;
    }

    // 修改原型
    XMPictureCut.prototype = {
        constructor: XMPictureCut,

        // 创建图片裁剪区
        create: function create(conf) {
            let factory = new PictureCutFactory();
            let picture = factory._getPictureCut(conf, this.selector, this.XM_PC_ID);
            // 将裁剪后的图片转换为Base64格式返回
            this.getImage = picture.$getImage;
            // 设置尺寸数据
            this.setView = picture.$setView;
            // 获取当前裁剪区的尺寸数据
            this.getViewSize = picture.$getViewSize;
            // 设置是否等比例缩放裁剪框
            this.setScaling = picture.$setFreeScaling;
        },

    };

    return XMPictureCut;

});