(function() {
    // 配置信息
    const CONFIG = {
        // 配置绑定的事件
        EVENT: {
            // 文本框事件
            editor: {focus: void 0},
            // 提交按钮事件
            submit: {click: void 0},
        },
        CSS: [
            {
                selector: ".XMCommentEditor",
                list: [
                    {key: "position", val: "relative"},
                    {key: 'width', val: 'calc(100% - 10px)'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-editor-wrap",
                list: [
                    {key: "position", val: "relative"},
                    {key: 'width', val: '100%'},
                    {key: 'padding', val: '5px'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-editor-box",
                list: [
                    {key: 'margin', val: 'auto'},
                    {key: 'padding', val: '5px 10px 5px 10px'},
                    {key: 'border', val: '1px solid #cccccc'},
                    {key: 'border-radius', val: '4px 4px 0px 0px'},
                    {key: 'box-shadow', val: '0px 0px 5px 0px inset #d7dee1 '},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-comt-area",
                list: [
                    {key: 'min-width', val: '100%'},
                    {key: 'min-height', val: '60px'},
                    {key: 'margin', val: '0px'},
                    {key: 'padding', val: '0px'},
                    {key: 'border', val: 'none'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-button",
                list: [
                    {key: 'color', val: '#666'},
                    {key: 'user-select', val: 'none'},
                    {key: 'text-align', val: 'center'},
                    {key: 'white-space', val: 'nowrap'},
                    {key: 'border', val: '1px solid #b1b1b1'},
                    {key: 'border-radius', val: '0px 0px 4px 0px'},
                    {key: 'height', val: '30px'},
                    {key: 'line-height', val: '30px'},
                    {key: 'background-image', val: '-webkit-linear-gradient(#f6f6f6, #e2e2e2)'},
                    {key: 'text-shadow', val: '0 -1px 0 #ffffff'},
                    {key: 'background-color', val: '#f6f7f8'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-editor-submit",
                list: [
                    {key: "position", val: "absolute"},
                    {key: 'top', val: '-1px'},
                    {key: 'right', val: '-1px'},
                    {key: 'display', val: 'block'},
                    {key: 'width', val: '100px'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-button:hover ",
                list: [
                    {key: 'color', val: '#333'},
                    {key: 'background-image', val: '-webkit-linear-gradient(#ffffff, #e8e8e8)'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-button:active ",
                list: [
                    {key: 'background-image', val: '-webkit-linear-gradient(#ffffff, #e1e1e1)'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-comt-ctrl",
                list: [
                    {key: "position", val: "relative"},
                    {key: 'height', val: '30px'},
                    {key: 'line-height', val: '30px'},
                    {key: 'border-right', val: '1px solid #cccccc'},
                    {key: 'border-left', val: '1px solid #cccccc'},
                    {key: 'border-bottom', val: '1px solid #cccccc'},
                    {key: 'border-radius', val: '0px 0px 4px 4px'},
                    {key: 'background-color', val: '#f6f7f8'},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-tips",
                list: [
                    {key: "position", val: "absolute"},
                    {key: "right", val: "6px"},
                    {key: 'bottom', val: '6px'},
                    {key: 'border', val: '1px solid #cccccc'},
                    {key: 'height', val: '24px'},
                    {key: 'line-height', val: '24px'},
                    {key: 'font-size', val: '12px'},
                    {key: 'background-color', val: '#ffffff'},
                    {key: "animation-name", val: "xm-tips-keyframes"},
                    {key: "animation-duration", val: "5000ms"},
                    {key: "animation-timing-function", val: "linear"},
                    {key: "animation-fill-mode", val: "forwards"},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-tips:after",
                list: [
                    {key: "display", val: "block"},
                    {key: "padding", val: "0px 6px 0px 6px"},
                    {key: "white-space", val: "nowrap"},
                    {key: "color", val: "#ff3bb8"},
                    {key: "content", val: "attr(tips)"},
                ]
            },
            {
                selector: ".XMCommentEditor .xm-tips-kf",
                list: [
                    {key: "animation-name", val: "xm-tips-kf"},
                    {key: "animation-duration", val: "5000ms"},
                    {key: "animation-timing-function", val: "linear"},
                    {key: "animation-fill-mode", val: "forwards"},
                ]
            },
            {
                selector: ".comment-editor",
                list: [
                    {key: "background-color", val: "#ffffff"},
                ]
            },

            {
                selector: ".comment-list .item",
                list: [
                    {key: "background-color", val: "#ffffff"},
                    {key: "padding", val: "10px"},
                    {key: "border-bottom", val: "1px solid #e1e5e9"},
                ]
            },
            {
                selector: ".comment-list .c-li-avatar .c-li-face",
                list: [
                    {key: "width", val: "44px"},
                    {key: "height", val: "44px"},
                    {key: "padding", val: "2px"},
                    {key: "border", val: "1px solid #ffb0d2"},
                    {key: "border-radius", val: "25px"},

                ]
            },
            {
                selector: ".comment-list .c-li-avatar",
                list: [
                    {key: "float", val: "left"},
                    {key: "width", val: "66px"},
                    {key: "text-align", val: "center"},
                ]
            },
            {
                selector: ".comment-list .c-li-main",
                list: [
                    {key: "float", val: "right"},
                    {key: "width", val: "800px"},
                ]
            },
            {
                selector: ".comment-list .c-li-author",
                list: [
                    {key: "color", val: "#ff159d"},
                ]
            },
            {
                selector: ".comment-list .c-li-meta span",
                list: [
                    {key: "margin", val: "0px 10px 0px 10px"},
                ]
            },
            {
                selector: ".comment-list .c-reply-link",
                list: [
                    {key: "color", val: "#00c3ff"},
                ]
            },
            {
                selector: ".comment-list .c-reply-link:hover ",
                list: [
                    {key: "cursor", val: "pointer"},
                ]
            },
            {
                selector: ".comment-list .c-li-meta",
                list: [
                    {key: "height", val: "30px"},
                    {key: "line-height", val: "30px"},
                    {key: "font-size", val: "14px"},
                ]
            },
            {
                selector: ".comment-list .c-li-text",
                list: [
                    {key: "font-size", val: "14px"},
                    {key: "color", val: "#333333"},
                    {key: "padding", val: "5px"},
                ]
            },
        ],
        // 默认的`keyframes`动画样式
        keyframes: [
            {
                selector: "@keyframes xm-tips-kf",
                val: [
                    {
                        name: '1%',
                        style: [
                            {key: 'bottom', val: '6px'},
                            {key: 'display', val: 'block'},
                        ],
                    },
                    {
                        name: '10%',
                        style: [
                            {key: 'bottom', val: '36px'},
                        ],
                    },
                    {
                        name: '90%',
                        style: [
                            {key: 'bottom', val: '36px'},
                        ],
                    },
                    {
                        name: '100%',
                        style: [
                            {key: 'bottom', val: '6px'},
                            {key: 'display', val: 'none'},
                        ],
                    },
                ],
            },
        ],
    };
    let index = 1;

    function CommentEditor(conf, slector) {
        this.config = conf;
        this.slector = slector;
        this.framework = void 0;
        this.EditorID = "XMCommentEditor_" + index++;
    }

    CommentEditor.prototype = {
        constructor: CommentEditor,
        // 获取编辑器的内容
        _getText: function() {
            return this.framework.editor.value;
        },
        // 显示提示信息
        _showTips: function(text) {
            let $this = this;
            $D($this.framework.plugin.tips).attr("tips", text).addClass("xm-tips-kf");
            setTimeout(function() {
                $D($this.framework.plugin.tips).removeClass("xm-tips-kf");
            }, 5000);
        },
        // 初始化
        _init: function() {
            this._initDOM();
            this._initCSS(this.config.CSS);
            this._initEvent();
        },
        // 初始化需要绑定的事件
        _initEvent: function() {
            let $this = this;
            let $event = this.config.EVENT;
            let $framework = this.framework;

            $D($framework.editor).on("focus", function(e) {
                if ($event.editor.focus) {
                    $event.editor.focus($framework.editor);
                }
                document.onkeydown = function(ev) {
                    if (ev.key == 'Enter') {
                        if ($event.submit.click) {
                            $event.submit.click($framework.editor);
                        }
                        return false;
                    }
                }
            });
            $D($framework.submit).on("click", function(e) {
                if ($event.submit.click) {
                    $event.submit.click($framework.editor);
                }
            })

        },


        // 初始化DOM
        _initDOM: function() {
            let $this = this;
            let slector = $D($this.slector).getElement(0);
            let comment = $D("<div class='XMCommentEditor'></div>").id($this.EditorID).insertTarget(slector).getElement(0);
            let editorWrap = $D("<div class='xm-editor-wrap'></div>").insertTarget(comment).getElement(0);
            let $editor = $D("<textarea class='xm-comt-area' name='name'></textarea>").insertTarget($D("<div class='xm-editor-box'></div>").insertTarget(editorWrap)).getElement(0);
            let $tips = $D("<span class='xm-tips'></span>").insertTarget(editorWrap).getElement(0);
            let pluginBox = $D("<div class='xm-comt-ctrl'></div>").insertTarget(editorWrap).getElement(0);
            let $submit = $D("<a class='xm-button xm-editor-submit'>发送</a>").insertTarget(pluginBox).getElement(0);

            this.framework = {
                $slector: slector,
                commentEditor: comment,
                editorWrap: editorWrap,
                editor: $editor,
                pluginBox: pluginBox,
                submit: $submit,
                plugin: {
                    tips: $tips,
                },
            };
        },
        // 初始化CSS
        _initCSS: function(css) {
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
    };

    function XMComment(selector) {
        this.slector = selector;
    }

    XMComment.prototype = {
        constructor: XMComment,
        create: function(conf) {
            let target = {};
            let $config = Object.assign(target, CONFIG, conf);
            let editor = new CommentEditor($config, this.slector);
            editor._init();
            this.getText = () => {
                return editor._getText()
            };
            this.showTips = (text) => {
                editor._showTips(text)
            };
        },
    };

    window.XMComment = XMComment;
})();