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

    // 将指定的DOM元素从DOM树中移除
    function removeElement(ele) {
        if (ele) ele.parentNode.removeChild(ele);
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
            if (obj instanceof DomElement) {
                this.selector.appendChild(obj.selector);
            } else if (isDom(obj)) {
                this.selector.appendChild(obj);
            } else {
                throw ">> [" + obj + "] 不是`DomElement`或者`HTMLElement`元素！";
            }
            return this;
        },
        // 设置元素ID
        id: function(id) {
            this.selector.id = id;
            return this;
        },
        // 设置SRC
        src: function(url) {
            this.selector.src = url;
            return this;
        },
        offWidth: function() {
            return this.selector.offsetWidth;
        },
        offHeight: function() {
            return this.selector.offsetHeight;
        },
        offLeft: function() {
            return this.selector.offsetLeft;
        },
        offTop: function() {
            return this.selector.offsetTop;
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
        width: function(val) {
            this.css("width", val + 'px');
            return this;
        },
        height: function(val) {
            this.css("height", val + 'px');
            return this;
        },
        top: function(val) {
            this.css("top", val + 'px');
            return this;
        },
        right: function(val) {
            this.css("right", val + 'px');
            return this;
        },
        bottom: function(val) {
            this.css("bottom", val + 'px');
            return this;
        },
        left: function(val) {
            this.css("left", val + 'px');
            return this;
        },

        // 设置CSS样式,(只传key获取CSS样式)
        css: function(key, val) {
            //   // console.log(this);
            // // console.log(key);
            if (Object.prototype.toString.call(key) === '[object Array]') {
                let style = (this.selector.getAttribute('style') || '').trim();

                if (style) {
                    style = style.substring(0, style.length - 1);
                    // console.log("[" + style + "]");
                    let item = style.split(';');
                    for (let i = 0; i < item.length; i++) {
                        let kv = item[i].split(':');
                        if (kv[0] && kv[1]) {
                            let flag = true;
                            for (let j = 0; j < key.length; j++) {
                                if (key[j].key == kv[0]) {
                                    key[j].val = kv[1];
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag) key.push({key: kv[0], val: kv[1]});
                        }
                    }
                }
                let value = '';
                for (let i = 0; i < key.length; i++) {
                    value += key[i].key + ':' + key[i].val + ';';
                }
                this.selector.setAttribute('style', value);
                return this;
            } else if (key != null && val != null) {
                let currentStyle = key + ':' + val;
                let style = (this.selector.getAttribute('style') || '').trim();
                if (style) {
                    style = style.substring(0, style.length - 1);
                    let item = style.split(';');
                    // // console.log(item);
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
                    style = style.substring(0, style.length - 1);
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
                let style = (this.selector.getAttribute('style') || '').trim();
                if (style) {
                    style = style.substring(0, style.length - 1);
                    let item = style.split(';');
                    let list = [];
                    for (let i = 0; i < item.length; i++) {
                        let kv = item[i].split(':');
                        list.push({key: kv[0], val: kv[1]});
                    }
                    return list;
                }
                return undefined;
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
        // 设置value值(必须要有value属性的元素才可以使用)
        value: function(val) {
            if (val) {
                this.selector.value = val;
                return this;
            } else {
                return this.selector.value;
            }
        },
        // 显示
        show: function() {
            this.css('display', 'block');
            return this;
        },

        // 隐藏
        hide: function() {
            this.css('display', 'none');
            return this;
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
            if (obj instanceof DomElement) {
                obj.selector.appendChild(this.selector);
            } else if (isDom(obj)) {
                obj.appendChild(obj);
            } else {
                throw ">> [" + obj + "] 不是`DomElement`或者`HTMLElement`元素！";
            }
            return this;
        },
        // 移除当前节点
        remove: function() {
            if (this.selector.remove) {
                this.selector.remove();
            } else {
                let parent = this.selector.parentElement;
                parent && parent.removeChild(this.selector);
            }
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

    // ===============================================================

    // 配置默认样式
    const Config = {
        VIEW: {
            // 缩略图元素ID
            list: [],
            // 是否等比例放大裁剪框
            scaling: true,
        },
        BUTTON: {
            fileInput: undefined,
            submit: undefined,
            cropButton: undefined,
        },
        CSS: {
            ros_cropping: [
                {key: 'width', val: '1000px'},
                {key: 'margin', val: 'auto'},
            ],
            crop_box_wrap: [
                {key: 'position', val: 'relative'},
                {key: 'width', val: '1000px'},
                {key: 'height', val: '100%'},
                {key: 'user-select', val: 'none'},
            ],
            native_box: [
                {key: 'position', val: 'absolute'},
                {key: 'width', val: '100%'},
                {key: 'height', val: '100%'},
            ],
            native_image: [
                {key: 'position', val: 'absolute'},
                {key: 'width', val: '100%'},
                {key: 'user-select', val: 'none'},
            ],
            crop_masking: [
                {key: 'position', val: 'absolute'},
                {key: 'width', val: '100%'},
                {key: 'height', val: '100%'},
                {key: 'background-color', val: '#666666'},
                {key: 'opacity', val: '0.5'},
            ],
            preview_box: [
                {key: 'position', val: 'absolute'},
                {key: 'width', val: '100%'},
                {key: 'height', val: '100%'},
            ],
            preview_image: [
                {key: 'position', val: 'absolute'},
                {key: 'clip', val: 'rect(0px, 100px, 100px, 0px)'},
                {key: 'user-select', val: 'none'},
            ],
            drag: [
                {key: 'position', val: 'absolute'},
                {key: 'width', val: '100px'},
                {key: 'height', val: '100px'},
                {key: 'display', val: 'none'},
                {key: 'cursor', val: 'move'},
                {key: 'box-shadow', val: '0px 0px 1px 1px #fafafa'},
            ],
            point: [
                {key: 'position', val: 'absolute'},
                {key: 'width', val: '6px'},
                {key: 'height', val: '6px'},
                {key: 'background-color', val: '#0005ff'},
                {key: 'border', val: '1px solid #ffffff'},
                {key: 'opacity', val: '0.6'},
            ],
            point_n: [
                {key: 'top', val: '-4px'},
                {key: 'left', val: 'calc(50% - 5px)'},
            ],
            point_e: [
                {key: 'right', val: '-4px'},
                {key: 'top', val: 'calc(50% - 5px)'},
            ],
            point_s: [
                {key: 'bottom', val: '-4px'},
                {key: 'left', val: 'calc(50% - 5px)'},
            ],
            point_w: [
                {key: 'left', val: '-4px'},
                {key: 'top', val: 'calc(50% - 5px)'},
            ],
            point_ne: [
                {key: 'right', val: '-4px'},
                {key: 'top', val: '-4px'},
                {key: 'cursor', val: 'nesw-resize'},
            ],
            point_se: [
                {key: 'right', val: '-4px'},
                {key: 'bottom', val: '-4px'},
                {key: 'cursor', val: 'nwse-resize'},
            ],
            point_nw: [
                {key: 'left', val: '-4px'},
                {key: 'top', val: '-4px'},
                {key: 'cursor', val: 'nwse-resize'},
            ],
            point_sw: [
                {key: 'left', val: '-4px'},
                {key: 'bottom', val: '-4px'},
                {key: 'cursor', val: 'nesw-resize'},
            ],
        },
    };


    let flag = true;

    /!**
     * 为元素绑定鼠标点击事件
     * @param ele [DomElement]对象
     * @param crop [$Cropping]对象
     * @param fn 鼠标拖动时执行的函数
     *!/
    function setEvent(ele, crop, fn) {
        ele.selector.onmousedown = function(ev) {
            if (flag) {
                flag = false;
                // 鼠标和`裁剪框`的坐标参数
                let coordinate = getCoordinate(ev, crop._dom_data_);
                document.onmousemove = function(e) {
                    coordinate.x = coordinate.diffX - e.clientX;
                    coordinate.y = coordinate.diffY - e.clientY;
                    // 鼠标移动时触发的函数
                    fn(e, coordinate);
                    crop._dom_data_.drag.attr("title", crop._box_value_.dragWidth + " x " + crop._box_value_.dragHeight);
                    // 裁剪框的坐标尺寸设置完成后,根据裁剪框的坐标设置预览图的坐标尺寸位置
                    setClip(crop._dom_data_, crop._box_value_);
                    // 显示设置完成后的尺寸数据
                    crop.showBoxView(crop._dom_data_, crop._box_value_);
                    crop.showViewList(crop._dom_data_, crop._box_value_);
                };
                document.onmouseup = function(e) {
                    document.onmousemove = null;
                    e.preventDefault();
                    flag = true;
                };
            }
        }
    }

    // 按下鼠标时获取当前坐标
    function getCoordinate(e, conf) {
        return {
            // 按下鼠标时获取参考X坐标
            diffX: e.clientX,
            // 获取参考Y坐标
            diffY: e.clientY,
            // 获取`裁剪框`宽度
            DW: conf.drag.selector.offsetWidth,
            // 获取`裁剪框`高度
            DH: conf.drag.selector.offsetHeight,
            // 获取`裁剪框`距离左边框距离
            DX: conf.drag.selector.offsetLeft,
            // 获取距离上边框距离
            DY: conf.drag.selector.offsetTop,
            // 本地图片的长度
            MW: conf.nativeImage.offWidth(),
            // 本地图片的宽度
            MH: conf.nativeImage.offHeight(),
            // X轴偏移量
            x: 0,
            // Y轴偏移量
            y: 0,
        };
    }

    // 设置预览图的clip坐标,实现实时预览裁剪图片
    function setClip(conf, box) {
        // `预览图``top`坐标
        box.viewTop = conf.drag.offTop();
        // `预览图``right`坐标
        box.viewRight = conf.drag.offLeft() + conf.drag.offWidth();
        // `预览图``bottom`坐标
        box.viewBottom = conf.drag.offTop() + conf.drag.offHeight();
        // `预览图``left`坐标
        box.viewLeft = conf.drag.offLeft();
        // `裁剪框`X坐标
        box.dragLeft = conf.drag.offLeft();
        // `裁剪框`Y坐标
        box.dragTop = conf.drag.offTop();
        // `裁剪框`长
        box.dragWidth = conf.drag.offWidth();
        // `裁剪框`宽
        box.dragHeight = conf.drag.offHeight();
        let offset = conf.nativeImage.selector.naturalWidth / conf.nativeImage.offWidth();
        // 图片的原始长
        box.imageWidth = box.dragWidth * offset;
        // 图片的原始宽
        box.imageHeight = box.dragHeight * offset;


        $D(conf.viewImage).css("clip", "rect(" + box.viewTop + "px, " + box.viewRight + "px, " + box.viewBottom + "px, " + box.viewLeft + "px)");
    }

    // 裁剪工具
    function $Cropping(selector) {
        // DOM列表
        const DOM_DATA = {};
        this._dom_data_ = DOM_DATA;
        // 坐标数据
        const BOX_VALUE = {};
        this._box_value_ = BOX_VALUE;
        $Cropping.prototype.init(selector, DOM_DATA);
        const _OBJECT_ = this;
        $D(DOM_DATA.fileInput).on("change", function() {
            $Cropping.prototype.initView(this, DOM_DATA, _OBJECT_);
        });

        $D(DOM_DATA.getImage).on("click", function(e) {
            $Cropping.prototype._getImage(_OBJECT_, e);
        });
        $Cropping.prototype.initEvent(this, DOM_DATA);

    }

    // 修改原型
    $Cropping.prototype = {

        /!**
         * 显示预览缩略图
         * @param conf DOM列表
         * @param cs 计算完成后的裁剪区坐标尺寸
         *!/
        showViewList: function(conf, cs) {
            let list = Config.VIEW.list;
            let item = conf.VIEW_ICO.boxList;
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    if (item[list[i]]) {
                        let offset = $D(item[list[i]].key).offWidth() / cs.dragWidth;
                        $D(item[list[i]].val).css("transform", "translateX(" + -(cs.dragLeft * offset) + "px) translateY(" + -(cs.dragTop * offset) + "px)").width(conf.nativeImage.offWidth() * offset).height(conf.nativeImage.offHeight() * offset);
                    }
                }
            }
        },

        /!**
         * 初始化缩略图预览图列表
         * @param conf DOM列表
         * @param cs 计算完成后的裁剪区坐标尺寸
         *!/
        initViewList: function(conf, cs, fr) {
            let list = Config.VIEW.list;
            if (list) {
                if (!conf.VIEW_ICO.boxList) {
                    conf.VIEW_ICO.boxList = {};
                } else {
                    for (let i = 0; i < list.length; i++) {
                        if (conf.VIEW_ICO.boxList[list[i]]) {
                            conf.VIEW_ICO.boxList[list[i]].key = null;
                            removeElement(conf.VIEW_ICO.boxList[list[i]].val);
                        }
                    }
                }
                for (let i = 0; i < list.length; i++) {
                    let item = document.getElementById(list[i]);
                    if (item) {
                        let offset = item.offsetWidth / cs.dragWidth;
                        let image = new Image();
                        conf.VIEW_ICO.boxList[list[i]] = {key: item, val: image};
                        $D(item).css("overflow", "hidden").css("position", "relative").append(image);
                        $D(image).src(fr.result).css("position", "absolute").css("transform", "translateX(" + -(cs.dragTop * offset) + "px) translateY(" + -(cs.dragTop * offset) + "px)").width(conf.nativeImage.offWidth() * offset).height(conf.nativeImage.offHeight() * offset);
                    } else {
                        console.log("ID为[ " + list[i] + " ]的元素不存在！");
                    }
                }
            }
        },

        /!**
         * 获取裁剪出来的图片
         * @param e
         * @param crop
         *!/
        _getImage: function(crop) {
            let tables = crop._dom_data_;
            let values = crop._box_value_;
            // 本地图片原始长度
            let imageWidth = tables.nativeImage.selector.naturalWidth;
            // 本地图片原始宽度
            let imageHeight = tables.nativeImage.selector.naturalHeight;
            console.log("image = " + imageWidth + " x " + imageHeight);
            let boxWidth = tables.drag.offWidth();
            let boxHeight = tables.drag.offHeight();

            let offset = imageWidth / tables.nativeImage.offWidth();

            console.log("drag = " + boxWidth + " x " + boxHeight);

            let canvasBox = $D("canvas").selector;
            canvasBox.width = imageWidth;
            canvasBox.height = imageHeight;
            let ctx = canvasBox.getContext("2d");
            ctx.drawImage(tables.nativeImage.selector, 0, 0, imageWidth, imageHeight);
            ctx.save();
            let ix = offset * values.dragLeft;
            let iy = offset * values.dragTop;
            let iw = offset * values.dragWidth;
            let ih = offset * values.dragHeight;
            let data = ctx.getImageData(ix, iy, iw, ih);
            canvasBox.width = iw;
            canvasBox.height = ih;
            ctx.putImageData(data, 0, 0);
            let image = new Image(iw, ih);
            image.src = canvasBox.toDataURL("image/jpeg");
            $D(tables.Cropping).append(image);
        },

        // 输出裁剪去区域的各个数据
        showBoxView: function(conf, box) {
            let html =
                "<div>DX: " + box.dragLeft + "</div>" +
                "<div>DY: " + box.dragTop + "</div>" +
                "<div>DW: " + box.dragWidth + "</div>" +
                "<div>DH: " + box.dragHeight + "</div>" +
                "<div>IW: " + box.imageWidth + "</div>" +
                "<div>IH: " + box.imageHeight + "</div>";
            conf.viewValue.html(html);
        },

        // 为裁剪区域的元素绑定鼠标拖动事件
        initEvent: function(crop, conf) {
            // 核心要点: [原始尺寸 + 偏移量 == 新的尺寸]

            // 设置`裁剪框`的拖动效果
            setEvent(conf.drag, crop, function(e, cs) {
                // 根据图片的长宽和`裁剪框`的长宽计算出`left`,和`top`的最大值
                // `裁剪框``left`坐标
                let dx = (cs.DX - cs.x < 0 ? 0 : cs.DX - cs.x > cs.MW - cs.DW ? cs.MW - cs.DW : cs.DX - cs.x);
                // `裁剪框``top`坐标
                let dy = (cs.DY - cs.y < 0 ? 0 : cs.DY - cs.y > cs.MH - cs.DH ? cs.MH - cs.DH : cs.DY - cs.y);
                // 计算完成后重新设置坐标,实现拖动效果
                $D(conf.drag).left(dx).top(dy);
            });

            // 东北
            setEvent(conf.point.ne, crop, function(e, cs) {
                // 计算缩放后的长
                let dw = (cs.DW - cs.x > cs.MW - cs.DX ? cs.MW - cs.DX : cs.DW - cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH + cs.y > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DH + cs.y);
                // 是否等比例放大裁剪框
                if (Config.VIEW.scaling) dh = dw = (dw < dh ? dw : dh);
                // 因为只需要向右边拖动,所以X坐标不需要校准
                // 校准Y坐标 [原始Y坐标 - 偏移量 == 当前Y坐标; 原始Y坐标 + 原始高度 == 最大Y坐标;]
                let dy = (cs.DY + cs.DH - dh < 0 ? 0 : cs.DY + cs.DH - dh > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DY + cs.DH - dh);
                // let dy = cs.DY - cs.y < 0 ? 0 : cs.DY - cs.y > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DY - cs.y;
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(conf.drag).width(dw).height(dh).top(dy);
            });

            // 东南
            setEvent(conf.point.se, crop, function(e, cs) {
                // 计算缩放后的长
                let dw = (cs.DW - cs.x > cs.MW - cs.DX ? cs.MW - cs.DX : cs.DW - cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH - cs.y > cs.MH - cs.DY ? cs.MH - cs.DY : cs.DH - cs.y);
                // 是否等比例放大裁剪框
                if (Config.VIEW.scaling) dh = dw = (dw < dh ? dw : dh);
                // 由于DOM元素默认以左上角为基准坐标的,所以东南方的尺寸改变不需要校准X,Y坐标
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(conf.drag).width(dw).height(dh);
            });

            // 西南
            setEvent(conf.point.sw, crop, function(e, cs) {
                // 计算缩放后的长
                let dw = (cs.DW + cs.x > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DW + cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH - cs.y > cs.MH - cs.DY ? cs.MH - cs.DY : cs.DH - cs.y);
                // 是否等比例放大裁剪框
                if (Config.VIEW.scaling) dh = dw = (dw < dh ? dw : dh);
                // 校准X坐标
                let dx = (cs.DX + cs.DW - dw < 0 ? 0 : cs.DX + cs.DW - dw > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DX + cs.DW - dw);
                // let dx = (cs.DX - cs.x < 0 ? 0 : cs.DX - cs.x > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DX - cs.x);
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(conf.drag).width(dw).height(dh).left(dx);
            });

            // 西北
            setEvent(conf.point.nw, crop, function(e, cs) {
                // 计算缩放后的长
                let dw = (cs.DW + cs.x > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DW + cs.x);
                // 计算缩放后的宽
                let dh = (cs.DH + cs.y > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DH + cs.y);
                // 是否等比例放大裁剪框
                if (Config.VIEW.scaling) dh = dw = (dw < dh ? dw : dh);
                // 校准X坐标
                let dx = (cs.DX + cs.DW - dw < 0 ? 0 : cs.DX + cs.DW - dw > cs.DX + cs.DW ? cs.DX + cs.DW : cs.DX + cs.DW - dw);
                // 校准Y坐标
                let dy = (cs.DY + cs.DH - dh < 0 ? 0 : cs.DY + cs.DH - dh > cs.DY + cs.DH ? cs.DY + cs.DH : cs.DY + cs.DH - dh);
                // 计算完成后重新设置尺寸,实现图片缩放效果
                $D(conf.drag).width(dw).height(dh).left(dx).top(dy);
            });

        },

        // 加载本地图片到预览框
        initView: function(e, conf, crop) {
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
                    if (conf.nativeImage != null) {
                        $D(conf.nativeImage).remove();
                        conf.nativeImage = null;
                    }
                    if (conf.viewImage != null) {
                        $D(conf.viewImage).remove();
                        conf.viewImage = null;
                    }
                    // 创建新的图片
                    let nativeImage = new Image();
                    // 将新的图片对象地址添加到DOM列表中
                    conf.nativeImage = $D(nativeImage).attr("src", fr.result).css(Config.CSS.native_image);
                    // 将图片添加到DOM树中
                    $D(conf.nativeBox).append(nativeImage);
                    // 图片加载完成后初始化裁剪区尺寸数据
                    nativeImage.onload = function() {
                        let viewImage = document.createElement("canvas");
                        conf.viewImage = $D(viewImage).css(Config.CSS.preview_image);
                        viewImage.width = nativeImage.width;
                        viewImage.height = nativeImage.height;
                        let ctx = viewImage.getContext("2d");
                        ctx.drawImage(nativeImage, 0, 0, nativeImage.width, nativeImage.height);
                        ctx.save();
                        $D(conf.previewBox).append(viewImage);
                        // 设置本地图片外壳尺寸
                        $D(conf.nativeBox).width(nativeImage.width).height(nativeImage.height);
                        // 设置背景图片外壳尺寸
                        $D(conf.previewBox).width(nativeImage.width).height(nativeImage.height);
                        // 设置遮罩层尺寸
                        $D(conf.masking).height(nativeImage.height).width(nativeImage.width);
                        // 设置裁剪区尺寸
                        $D(conf.CropBoxWrap).height(nativeImage.height).width(nativeImage.width);
                        // 图片裁人完成后重置`裁剪框`位置
                        $D(conf.drag).left(nativeImage.width / 2 - 50).top(nativeImage.height / 2 - 50).width(100).height(100).show();
                        // 重置预览图坐标位置
                        setClip(crop._dom_data_, crop._box_value_);
                        // 重置裁剪区坐标和尺寸数据
                        crop.showBoxView(crop._dom_data_, crop._box_value_);
                        crop.initViewList(crop._dom_data_, crop._box_value_, fr);
                    }
                };
            } else {
                alert("你选择的文件不是图片哦~");
            }
        },


        // 初始化
        init: function(selector, conf) {
            if (isDom(selector)) {
                // 外部指定的元素
                conf.BOX_WRAP = selector;
            } else {
                let dom = document.getElementById(selector);
                if (dom) {
                    conf.BOX_WRAP = $D(dom);
                } else {
                    throw "没有找到指定的元素！";
                }
            }
            // 裁剪工具外壳
            conf.Cropping = $D("div").addClass("RosCropping").css(Config.CSS.ros_cropping);
            // 包裹裁剪区域的外套
            conf.CropBoxWrap = $D("div").addClass("crop-box-wrap").css(Config.CSS.crop_box_wrap);
            $D(conf.BOX_WRAP).append(conf.Cropping);
            $D(conf.Cropping).append(conf.CropBoxWrap);

            // 放置本地图片的元素
            conf.nativeBox = $D("div").addClass("native-box").css(Config.CSS.native_box);
            // 遮罩层元素
            conf.masking = $D("div").addClass("crop-masking").css(Config.CSS.crop_masking);
            // `裁剪框`中的预览图
            conf.previewBox = $D("div").addClass("preview-box").css(Config.CSS.preview_box);
            // `裁剪框`
            conf.drag = $D("div").addClass("drag-box").css(Config.CSS.drag);

            // 将4个主要模块添加进`外套`
            $D(conf.CropBoxWrap).append(conf.nativeBox).append(conf.masking).append(conf.previewBox).append(conf.drag);

            // `裁剪框`中的缩放点
            conf.point = {};
            // 北
            conf.point.n = $D("div").addClass("drag-point point-n").attr("tips", "北");
            // 东
            conf.point.e = $D("div").addClass("drag-point point-e").attr("tips", "东");
            // 南
            conf.point.s = $D("div").addClass("drag-point point-s").attr("tips", "南");
            // 西
            conf.point.w = $D("div").addClass("drag-point point-w").attr("tips", "西");
            // 东北
            conf.point.ne = $D("div").addClass("drag-point point-ne").attr("tips", "东北");
            // 东南
            conf.point.se = $D("div").addClass("drag-point point-se").attr("tips", "东南");
            // 西北
            conf.point.nw = $D("div").addClass("drag-point point-nw").attr("tips", "西北");
            // 西南
            conf.point.sw = $D("div").addClass("drag-point point-sw").attr("tips", "西南");
            // 将缩放点添加到`裁剪框`中
            $D(conf.drag).append(conf.point.n).append(conf.point.e).append(conf.point.s).append(conf.point.w).append(conf.point.ne).append(conf.point.se).append(conf.point.nw).append(conf.point.sw);
            // 设置CSS样式
            $D(conf.point.n).css(Config.CSS.point).css(Config.CSS.point_n);
            $D(conf.point.e).css(Config.CSS.point).css(Config.CSS.point_e);
            $D(conf.point.s).css(Config.CSS.point).css(Config.CSS.point_s);
            $D(conf.point.w).css(Config.CSS.point).css(Config.CSS.point_w);
            $D(conf.point.ne).css(Config.CSS.point).css(Config.CSS.point_ne);
            $D(conf.point.se).css(Config.CSS.point).css(Config.CSS.point_se);
            $D(conf.point.nw).css(Config.CSS.point).css(Config.CSS.point_nw);
            $D(conf.point.sw).css(Config.CSS.point).css(Config.CSS.point_sw);
            // 选择文件的按钮
            conf.fileInput = $D("input").attr("type", "file").attr("name", "file");
            // 将按钮添加到DOM树中
            $D(conf.Cropping).append($D("div").append(conf.fileInput));
            // 显示裁剪区数据
            conf.viewValue = $D("div").addClass("view-value");
            $D(conf.Cropping).append(conf.viewValue);
            conf.VIEW_ICO = {};
            //  conf.VIEW_ICO.viewTable = $D("div").addClass("view-table-box");
            //$D(conf.Cropping).append(conf.VIEW_ICO.viewTable);
            // 裁剪图片按钮
            conf.getImage = $D("input").attr("type", "button").value("裁剪图片");
            $D(conf.Cropping).append($D("div").append(conf.getImage));
            // console.log($D(conf.point.sw).css());
            // console.log(conf);

        },
    };

    const regex = /^#(.)+/;

    function RosCroppingUtil(selector) {
        if (regex.test(selector)) {
            this.CROPPING = new $Cropping(selector.substring(1, selector.length));
        } else if (isDom(selector)) {
            this.CROPPING = new $Cropping(selector);
        } else {
            throw "初始化失败！";
        }
        return {
            // 添加缩略图模块ID
            addViewList: function(id) {
                Config.VIEW.list.push(id);
                return this;
            },
            // 设置裁剪框长宽是否等比例缩放
            setScaling: function(flag) {
                Config.VIEW.scaling = flag;
            },
            getImage: RosCroppingUtil.prototype._getImage,
        };
    }

    // 修改原型
    RosCroppingUtil.prototype = {
        _getImage: function() {
            this.CROPPING._getImage(this.CROPPING);
        },
    };
    window.RosCropping = RosCroppingUtil;
})();*/
