(function() {

    /**
     * 初始化 Close 条,关闭对话框模块,用于绑定主动关闭对话框
     * @param box 对话框DOM元素
     * @param title 标题
     * @returns {HTMLDivElement} Close - DOM
     */
    function buildCloseBox(box, title, closeMethod) {
        var closeBox = document.createElement('div');
        closeBox.className = 'dialog-close';
        if (title != undefined && title != null) {
            closeBox.innerHTML = "<span class='title'>" + title + "</span>";
        }
        var close = document.createElement('i');
        close.className = 'close';

        close.innerHTML = "<i></i>";
        closeBox.appendChild(close);
        // 点击右上角的X图标关闭对话框
        $C.bindEvent.add(close, 'onclick', function() {
            RosDialog.dialog.close(box, closeMethod);
        });
        return closeBox;
    }

    /**
     * 初始化对话框
     * @param data 对话框初始化信息
     * @returns {HTMLDivElement} 对话框DOM元素
     */
    function initBox(data) {
        var wraps = document.getElementsByClassName('dialog-wrap');
        var dialog = document.createElement('div');
        if (wraps != undefined && wraps != null && wraps.length > 0) {
            dialog.id = 'dialog_' + (wraps.length + 1);
        } else {
            dialog.id = 'dialog_1';
        }
        dialog.className = 'dialog-wrap';
        var box = document.createElement('div');
        if ($C.fns.valueIsNull(data.boxName)) {
            box.className = 'dialog-box ' + data.boxName;
        } else {
            box.className = 'dialog-box';
        }
        if ($C.fns.valueIsNull(data.boxId)) {
            box.id = data.boxId;
        }
        // 添加close条
        box.appendChild(buildCloseBox(dialog, data.title, data.closeMethod));
        var contentBox = document.createElement('div');
        contentBox.className = "dialog-content";
        if ($C.fns.isFunction(data.content)) {
            contentBox.appendChild(data.content());
        } else {
            contentBox.innerHTML = data.content;
        }
        // contentBox.appendChild(data.content);
        box.appendChild(contentBox);
        // 添加底部按钮
        if (data.button != undefined && data.button != null) {
            var buttonBox = document.createElement('div');
            buttonBox.className = 'dialog-button';
            if ($C.fns.isFunction(data.button)) {
                buttonBox.appendChild(data.button());
            } else {
                buttonBox.innerHTML = data.button;
            }
            box.appendChild(buttonBox);
        }
        dialog.appendChild(box);
        document.body.appendChild(dialog);
        return dialog;
    }

    const DialogItem = new Array();

    /**
     * 创建对话框的工具包
     * @type {{dialog: {slider: slider, wait: (function(*=): function(...[*]=)), login: login, close: close, open: open}, item: {add: add, remove: remove}}}
     */
    const RosDialog = {

        // 内置对话框
        dialog: {
            /**
             * 关闭,并移除对话框
             * @param box 要关闭的DOM节点
             * @param fn 移除对话框前执行的函数
             */
            close: function(box, fn) {
                if ($C.fns.isFunction(fn)) {
                    fn();
                }
                if (box != undefined && box != null && box.parentNode != null) {
                    box.parentNode.removeChild(box);
                }
            },

            /**
             * 在屏幕右下角弹出消息框
             * @param text
             * @param time
             */
            msg: function(text, time) {
                var dialog = document.createElement("div");
                dialog.className = "dialog-box message-text";
                dialog.appendChild(buildCloseBox(dialog));
                var content = document.createElement("div");
                content.className = "dialog-content";
                if (text == undefined || text == null) {
                    text = "网络故障！";
                    content.innerHTML = text;
                } else if (text == '') {
                    text = '服务器拒绝了你的请求！';
                    content.innerHTML = text;
                } else if ($C.fns.isFunction(text)) {
                    content.appendChild(text);
                } else {
                    content.innerHTML = text;
                }
                dialog.appendChild(content);
                document.body.appendChild(dialog);

                // 设置自动关闭对话框的函数，如果没有设置，对话框则一直存在
                if (time != undefined && time != null && time != '' && time > 0) {
                    setTimeout(function() {
                        RosDialog.dialog.close(dialog);
                    }, time);
                }
            },

            /**
             * 弹出消息提示框
             * @param text 设置提示内容
             * @param time 设置对话框自动关闭时间。单位/毫秒（如果不传或者 time<=0, 则不自动关闭对话框）
             * @param confirmMethod 绑定点击确定按钮执行(confirmMethod)函数
             * @param cancelMethod 绑定点击取消按钮执行(cancelMethod)函数
             */
            open: function(text, time, confirmMethod, cancelMethod) {
                var confirm; // '确定'按钮
                var cancel; // '取消'按钮
                // 初始化对话框
                var dialogBox = initBox({
                    boxName: 'message-box',
                    content: function() {
                        // '网络故障！'
                        var content = document.createElement("div");
                        if (text == undefined || text == null) {
                            text = "网络故障！";
                            content.innerHTML = text;
                        } else if (text == '') {
                            text = '服务器拒绝了你的请求！';
                            content.innerHTML = text;
                        } else if ($C.fns.isFunction(text)) {
                            content.appendChild(text);
                        } else {
                            content.innerHTML = text;
                        }
                        return content;
                    },
                    button: function() {
                        var buttonBox = document.createElement('div');
                        buttonBox.className = 'button-box';
                        var confirmButton = document.createElement('button');
                        confirmButton.type = 'button';
                        confirmButton.className = 'button confirm';
                        confirmButton.innerHTML = '确认';
                        confirm = confirmButton;
                        var cancelButton = document.createElement('button');
                        cancelButton.type = 'button';
                        cancelButton.className = 'button cancel';
                        cancelButton.innerHTML = '取消';
                        cancel = cancelButton;
                        buttonBox.appendChild(confirmButton);
                        buttonBox.appendChild(cancelButton);
                        return buttonBox;
                    }
                });

                // 为对话框组件绑定函数
                // 为'确定'按钮绑定函数，点击'确定'按钮时触发调用
                $C.bindEvent.add(confirm, 'onclick', function() {
                    if ($C.fns.isFunction(confirmMethod)) {
                        confirmMethod();
                    }
                    //console.log("点击'确定'按钮");
                    RosDialog.dialog.close(dialogBox);
                });
                // 为'取消'按钮绑定函数，点击'取消'按钮时触发调用
                $C.bindEvent.add(cancel, 'onclick', function() {
                    if ($C.fns.isFunction(cancelMethod)) {
                        cancelMethod();
                    }
                    //console.log("点击'取消'按钮");
                    RosDialog.dialog.close(dialogBox);
                });

                // 设置自动关闭对话框的函数，如果没有设置，对话框则一直存在
                if (time != undefined && time != null && time != '' && time > 0) {
                    setTimeout(function() {
                        RosDialog.dialog.close(dialogBox);
                    }, time);
                }
            },

            /**
             * 弹出登录框
             */
            login: function() {
                // 判断是否已经存在登录框,有则先关闭
                let loginBox = document.getElementById('DIALOG_LOGIN_BOX');
                if (loginBox) {
                    RosDialog.dialog.close(loginBox.parentNode);
                }
                var usernameInput; // 账号文本框
                var passwrodinput; // 密码文本框
                var submitButton; // 提交按钮文本框
                var formList; // form表单
                var formState = true; // 表单状态
                var selectBox;
                var autoBox;
                // 初始化登录框
                initBox({
                    title: '登录',
                    boxName: 'login-box',
                    boxId: 'DIALOG_LOGIN_BOX',
                    content: function() {
                        var loginForm = document.createElement('form');
                        loginForm.className = 'login-form';
                        formList = loginForm;
                        let ul = document.createElement('ul');

                        let li_1 = document.createElement('li');
                        li_1.className = "item";
                        let li_1_i1 = document.createElement('div');
                        li_1_i1.className = 'username-box';
                        let li_1_put = document.createElement('input');
                        li_1_put.type = 'text';
                        li_1_put.name = 'username';
                        li_1_put.placeholder = '账号';
                        li_1_put.autocomplete = 'off';
                        li_1_put.setAttribute('box', 'text');
                        usernameInput = li_1_put;
                        li_1_i1.appendChild(li_1_put);
                        let li_1_i2 = document.createElement('span');
                        li_1_i2.className = 'tips';
                        li_1.appendChild(li_1_i1);
                        li_1.appendChild(li_1_i2);
                        ul.appendChild(li_1);

                        let li_2 = document.createElement('li');
                        li_2.className = "item";
                        let li_2_i1 = document.createElement('div');
                        li_2_i1.className = 'password-box';
                        let li_2_put = document.createElement('input');
                        li_2_put.type = 'password';
                        li_2_put.name = 'password';
                        li_2_put.placeholder = '密码';
                        li_2_put.setAttribute('box', 'text');
                        passwrodinput = li_2_put;
                        li_2_i1.appendChild(li_2_put);
                        let li_2_i2 = document.createElement('span');
                        li_2_i2.className = 'tips';
                        li_2.appendChild(li_2_i1);
                        li_2.appendChild(li_2_i2);
                        ul.appendChild(li_2);

                        let li_3 = document.createElement('li');
                        let li_3_div = document.createElement('div');
                        li_3_div.className = "select-box";
                        let li_3_label_1 = document.createElement('label');
                        let li_3_input_1 = document.createElement('input');
                        let li_3_span_1 = document.createElement('span');
                        li_3_label_1.className = "select-box-auto";
                        li_3_input_1.type = "checkbox";
                        li_3_span_1.innerHTML = "记住密码";
                        selectBox = li_3_input_1;
                        li_3_label_1.appendChild(li_3_input_1);
                        li_3_label_1.appendChild(li_3_span_1);
                        let li_3_label_2 = document.createElement('label');
                        let li_3_input_2 = document.createElement('input');
                        let li_3_span_2 = document.createElement('span');
                        li_3_label_2.className = "select-box-login";
                        li_3_input_2.type = "checkbox";
                        li_3_span_2.innerHTML = "自动登录";
                        autoBox = li_3_input_2;
                        li_3_label_2.appendChild(li_3_input_2);
                        li_3_label_2.appendChild(li_3_span_2);
                        li_3_div.appendChild(li_3_label_1);
                        li_3_div.appendChild(li_3_label_2);
                        li_3.appendChild(li_3_div);
                        ul.appendChild(li_3);

                        let item = document.createElement('li');
                        let button = document.createElement('a');
                        button.className = "login-button";
                        button.innerHTML = "登 录";
                        submitButton = button;
                        item.appendChild(button);
                        ul.appendChild(item);
                        loginForm.appendChild(ul);
                        return loginForm;
                    },
                    button: function() {
                        var link = document.createElement('div');
                        link.innerHTML = "<a class='box-link' href='/register' target='_blank'>账号注册</a><a class='box-link' href='/login/find-password' target='_blank' style='float: right'>找回密码</a>";
                        return link;
                    }
                });


                /**
                 * 提交表单数据
                 */
                function submitForm() {
                    var username = usernameInput.value;
                    var password = passwrodinput.value;
                    var uf = $C.fns.paramIsNull(usernameInput, function(e, f) {
                        var tips = $C.fns.getSub(e.parentNode, 'tips');
                        if (f) {
                            $C.fns.setTips(tips, 'tips', '', true);
                        } else {
                            $C.fns.setTips(tips, 'tips', '账号不能为空！', false);
                        }
                    });
                    var pf = $C.fns.paramIsNull(passwrodinput, function(e, f) {
                        var tips = $C.fns.getSub(e.parentNode, 'tips');
                        if (f) {
                            $C.fns.setTips(tips, 'tips', '', true);
                        } else {
                            $C.fns.setTips(tips, 'tips', '密码不能为空！', false);
                        }
                    });

                    // 参数验证通过
                    if (uf && pf) {
                        // 弹出验证码对话框，输入验证码！
                        RosDialog.dialog.slider(function() {
                            if (selectBox.checked) {
                                setCookie(usernameInput.value, passwrodinput.value, autoBox.checked);
                            } else {
                                $C.Cookie.delCookie("USER_DATA");
                            }
                            //console.log("验证通过！");
                            // 获取表单数据
                            var userdata = $C.fns.getParameter(formList);
                            userdata['url'] = window.location.href;
                            // 弹出等待层
                            var waitClose = RosDialog.dialog.wait();
                            if (formState) {
                                formState = false;
                                //console.log(userdata);
                                $C.RSA.getPublicKey({
                                    async: true,
                                    success: function(key) {
                                        if (key) {
                                            var cipher = $C.RSA.encrypt(userdata['password'], key);
                                            userdata['password'] = cipher;
                                            $.ajax({
                                                type: 'post',
                                                url: '/login',
                                                data: userdata,
                                                dataType: 'json',
                                                contentType: 'application/x-www-form-urlencoded;charset=utf-8',
                                                success: function(reply) {
                                                    formState = true;
                                                    waitClose();
                                                    if (reply.state == 'success') {
                                                        // 登录成功
                                                        window.location.href = '/message.html';
                                                    } else {
                                                        RosDialog.dialog.open(reply.content, 5000);
                                                    }
                                                },
                                                error: function() {
                                                    formState = true;
                                                    waitClose();
                                                    RosDialog.dialog.open();
                                                }
                                            });
                                        } else {
                                            RosDialog.dialog.open();
                                        }
                                        formState = true;
                                    },
                                    error: function() {
                                        formState = true;
                                        RosDialog.dialog.open(null);
                                    }
                                });
                            }
                        });
                    }
                }

                /**
                 * 判断是否存在本地Cookie
                 */
                function isCookie() {
                    // 查询本地是否保存有'USER_DATA'的Cookie
                    let data = $C.Cookie.getCookie("USER_DATA");
                    if (data != null) {
                        // 有Cookie,将Cookie值转换为对象
                        let user = eval(data);
                        usernameInput.value = user.NAME;
                        passwrodinput.value = user.PWD;
                        selectBox.checked = true;
                        autoBox.checked = user.AUTO;
                        // 判断是否选择了自动登录
                        if (user.AUTO) {
                            // 调用登录函数
                            submitForm();
                        }
                    }
                }

                /**
                 * 设置'USER_DATA'的本地Cookie
                 * @param name 账号
                 * @param pwd 密码
                 * @param auto [boolean]自定登录
                 */
                function setCookie(name, pwd, auto) {
                    $C.Cookie.setCookie("USER_DATA", "({'NAME':'" + name + "','PWD':'" + pwd + "','AUTO':" + auto + "})");
                }

                // ## 为form表单组件绑定函数 ##
                // 为文本框绑定clearBlank(禁止输入空格)事件
                $C.bindEvent.add(usernameInput, 'oninput', $C.fns.clearBlank);
                $C.bindEvent.add(passwrodinput, 'oninput', $C.fns.clearBlank);

                // 焦点处在账号或者密码框时按空格键提交表单数据
                $C.bindEvent.add(usernameInput, 'onfocus', function() {
                    $C.key.pressEnter(submitForm);
                });
                $C.bindEvent.add(passwrodinput, 'onfocus', function() {
                    $C.key.pressEnter(submitForm);
                });
                // 点击登录按钮提交表单数据
                $C.bindEvent.add(submitButton, 'onclick', submitForm);
                isCookie();
            },

            /**
             * 滑动验证条
             * @param callback 回调函数
             * @param time 延迟时间,默认1000毫秒
             */
            slider: function(callback, time) {
                if (!$C.fns.isFunction(callback)) {
                    throw "callback 不是函数！";
                }
                if (!$C.fns.valueIsNull(time) || time <= 0) {
                    time = 1000;
                }
                // 初始化滑块验证框
                var dialogBox = initBox({
                    title: '滑块验证',
                    boxName: 'slide-box',
                    content: function() {
                        var slideBox = document.createElement("div");
                        slideBox.className = "slide-bar";
                        slideBox.innerHTML = "<div class='text'>将滑块滑动到右边验证</div>";
                        var tips = document.createElement("span");
                        tips.className = 'tips';
                        tips.style.display = 'none';
                        slideBox.appendChild(tips);
                        var slider = document.createElement("i");
                        slider.className = 'slider';
                        slideBox.appendChild(slider);
                        $C.bindEvent.add(slider, 'onmousedown', function(e) {
                            //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离  
                            var diffX = e.clientX - slider.offsetLeft;
                            document.onmousemove = function(e) {
                                var left = e.clientX - diffX;
                                // 限制滑块只能在指定范围内滑动
                                if (left < 2) {
                                    left = 2;
                                } else if (left > 225) {
                                    left = 225;
                                }
                                //移动时重新得到物体的距离，解决拖动时出现晃动的现象  
                                slider.style.left = left + 'px';
                            };
                            //当鼠标弹起来的时候不再移动  
                            document.onmouseup = function(e) {
                                this.onmousemove = null
                                //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动） 
                                this.onmouseup = null;
                                // 鼠标弹起后，滑块没有滑动到最右边，则复位到最左边
                                if (slider.style.left != '225px') {
                                    slider.style.left = '2px';
                                } else {
                                    // 滑块移动到最右边，执行回调函数
                                    tips.style.display = 'block';
                                    setTimeout(function() {
                                        callback();
                                        RosDialog.dialog.close(dialogBox);
                                    }, time);
                                }
                            };
                        });
                        return slideBox;
                    },
                });
            },


            /**
             * 弹出等待层，防止用户在客户端请求服务器时进行某些操作。例如上传文件时弹出此模块，防止用户干扰上传过程。
             * @returns {function(...[*]=)} // 返回了一个无参数的回调函数，用于关闭此模块，可以调用此函数关闭等待层
             */
            wait: function() {
                // var text = '';
                // if (content != undefined && content != null) {
                //     text = content;
                // }
                var wrap = document.createElement("div");
                wrap.className = 'dialog-wrap';
                wrap.innerHTML = "<div class='dialog-wait'><i class='wait-circle'></i><div class='wait-text'>Logding···</div><div class='wait-text'></div></div>";
                document.body.appendChild(wrap);
                return function() {
                    wrap.parentNode.removeChild(wrap);
                }
            },

            /**
             * 弹出图片上传框
             */
            image: function() {
                let picture;
                let restore;
                let DX;
                let DY;
                let DW;
                let DH;
                let IW;
                let IH;
                initBox({
                    title: '图片上传',
                    boxName: 'upload-box',
                    content: function() {
                        let box = document.createElement("div");
                        box.className = "clearfix";
                        let PictureCutBox = document.createElement("div");
                        PictureCutBox.className = "xm-pc-model-box";
                        box.appendChild(PictureCutBox);

                        let tableBox = document.createElement("div");
                        tableBox.className = "xm-up-img-small";
                        box.appendChild(tableBox);
                        // let view_1 = document.createElement("div");
                        // view_1.className = "xm-up-img-view-1";
                        let view_2 = document.createElement("div");
                        view_2.className = "xm-up-img-view-2";
                        let view_3 = document.createElement("div");
                        view_3.className = "xm-up-img-view-3";
                        //tableBox.appendChild(view_1);
                        tableBox.appendChild(view_2);
                        tableBox.appendChild(view_3);

                        let cropView = document.createElement("ul");
                        cropView.className = "xm-up-img-v-list";
                        cropView.style.padding = "5px";
                        cropView.style.margin = "0px";

                        let divDX = document.createElement("li");
                        divDX.innerHTML = "<label>X</label>";
                        DX = document.createElement("input");
                        DX.type = "text";
                        divDX.appendChild(DX)
                        cropView.appendChild(divDX);

                        let divDY = document.createElement("li");
                        divDY.innerHTML = "<label>Y</label>";
                        DY = document.createElement("input");
                        DY.type = "text";
                        divDY.appendChild(DY)
                        cropView.appendChild(divDY);

                        let divDW = document.createElement("li");
                        divDW.innerHTML = "<label>W</label>";
                        DW = document.createElement("input");
                        DW.type = "text";
                        divDW.appendChild(DW)
                        cropView.appendChild(divDW);

                        let divDH = document.createElement("li");
                        divDH.innerHTML = "<label>H</label>";
                        DH = document.createElement("input");
                        DH.type = "text";
                        divDH.appendChild(DH)
                        cropView.appendChild(divDH);

                        tableBox.appendChild(cropView);

                        IW = document.createElement("div");
                        IH = document.createElement("div");
                        tableBox.appendChild(IW);
                        tableBox.appendChild(IH);

                        restore = document.createElement("button");
                        restore.id = "xm_up_img_restore";
                        restore.innerHTML = "重置";
                        tableBox.appendChild(restore);


                        // 构建图片裁剪模块
                        picture = new XMPictureCut(PictureCutBox);
                        picture.create({
                            freeScaling: false,
                            aspectRatio: 1 / 1,
                            plugin: {
                                restore: restore,
                                preview: [".xm-up-img-view-1", ".xm-up-img-view-2", ".xm-up-img-view-3"],
                            },
                            cropView: function(view) {
                                DX.value = view.dragLeft;
                                DY.value = view.dragTop;
                                DW.value = view.dragWidth;
                                DH.value = view.dragHeight;
                                IW.innerText = "IW : " + view.imageWidth;
                                IH.innerText = "IH : " + view.imageHeight;
                            },
                        });

                        return box;
                    },
                });

            }
        }
    }

    window.RosDialog = RosDialog;
})();
