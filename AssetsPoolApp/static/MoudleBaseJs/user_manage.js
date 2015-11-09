/**
 * Created by wangjingyao on 2015/10/21.
 */
function user_manage() {
    //因为每个页面在打开后切换到其他页面在切换回来会重新执行js方法，会在页面重复添加布局，
    // 所以一开始先删除所有元素，达到重新加载的效果
    $('#user_manage').empty();

    //保存菜单
    var SaveUserDetails = function () {
        var saveform = Ext.getCmp('UserOptionFormAdd').getForm();
        var flagValid = saveform.isValid();
        if (!flagValid) {
            return;
        }
        var userid = saveform.findField('id').getValue();
        var username = saveform.findField('username').getValue();
        var realname = saveform.findField('realname').getValue();
        var email = saveform.findField('email').getValue();
        var phone = saveform.findField('phone').getValue();
        var pwd = saveform.findField('password').getValue();
        var pwd2 = saveform.findField('passwordagain').getValue();
        var isDis = saveform.findField('isdisabled').getValue() == true ? '1' : '0';
        if (pwd != pwd2) {
            alert('两次密码输入不一致请重新输入');
            return;
        }
        var encryptPwd = hex_md5(pwd);//md5 encrypt
        Ext.Ajax.request({
            url: 'MoudleBaseJs/AddUser',
            params: {
                id: userid,
                username: username,
                realname: realname,
                password: encryptPwd,
                email: email,
                phone: phone,
                isdisabled: isDis
            },
            method: 'POST',
            success: function (response, opts) {
                var responseJson = Ext.JSON.decode(response.responseText);
                // 当后台数据同步成功时
                if (responseJson.IsError) {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "数据保存失败!</br>" + responseJson.ErrorMsg
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "数据保存成功!"
                    });
                    store.reload();
                    win.hide();
                }

            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '数据保存错误!');
            }
        });
    };

    var SaveUserEdit = function () {
        var saveform = Ext.getCmp('UserOptionFormEdit').getForm();
        var flagValid = saveform.isValid();
        if (!flagValid) {
            return;
        }
        var userid = saveform.findField('id').getValue();
        var username = saveform.findField('username').getValue();
        var realname = saveform.findField('realname').getValue();
        var email = saveform.findField('email').getValue();
        var phone = saveform.findField('phone').getValue();
        var isDis = saveform.findField('isdisabled').getValue() == true ? '1' : '0';
        Ext.Ajax.request({
            url: 'MoudleBaseJs/EditUser',
            params: {
                id: userid,
                username: username,
                realname: realname,
                email: email,
                phone: phone,
                isdisabled: isDis
            },
            method: 'POST',
            success: function (response, opts) {
                var responseJson = Ext.JSON.decode(response.responseText);
                // 当后台数据同步成功时
                if (responseJson.IsError) {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "修改失败!</br>" + responseJson.ErrorMsg
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "修改成功!"
                    });
                    store.reload();
                    winEdit.hide();
                }

            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '数据保存错误!');
            }
        });
    };

    var SaveUserEditPwd = function () {
        var userid = grid.getSelectionModel().getSelection()[0].data.id;
        var saveform = Ext.getCmp('UserOpFormEditPwd').getForm();
        var flagValid = saveform.isValid();
        if (!flagValid) {
            return;
        }
        var oldpwd = saveform.findField('oldpwd').getValue();
        var newpwd = saveform.findField('newpwd').getValue();
        var confirmnewpwd = saveform.findField('confirmnewpwd').getValue();
        if (newpwd != confirmnewpwd) {
            alert('两次密码输入不一致请重新输入');
            return;
        }
        var old_encryptPwd = hex_md5(oldpwd);//md5 encrypt
        var new_encryptPwd = hex_md5(newpwd);//md5 encrypt
        Ext.Ajax.request({
            url: 'MoudleBaseJs/EditUserPwd',
            params: {
                id: userid,
                oldpwd: old_encryptPwd,
                newpwd: new_encryptPwd
            },
            method: 'POST',
            success: function (response, opts) {
                var responseJson = Ext.JSON.decode(response.responseText);
                // 当后台数据同步成功时
                if (responseJson.IsError) {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "修改失败!</br>" + responseJson.ErrorMsg
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: "修改成功!"
                    });
                    store.reload();
                    winEditPwd.hide();
                }

            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '数据保存错误!');
            }
        });
    };

    //用户新增和编辑的弹窗
    var UserOpFormAdd = Ext.create('Ext.form.Panel', {
        id: 'UserOptionFormAdd',
        layout: 'form',
        frame: false,
        bodyPadding: 5,
        header: false,
        border: false,
        defaults: {
            anchor: '100%'
        },
        items: [
            {labelAlign: 'right', fieldLabel: 'ID', xtype: 'textfield', hidden: true, name: 'id'},
            {
                fieldLabel: '用户名',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'username',
                Width: 100,
                allowBlank: false,
                blankText: "不能为空"
            },
            {
                fieldLabel: '真实姓名',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'realname',
                Width: 100,
                allowBlank: false,
                blankText: "不能为空"
            },
            {fieldLabel: '邮箱', xtype: 'textfield', labelAlign: 'right', name: 'email', Width: 100},
            {fieldLabel: '电话', xtype: 'textfield', labelAlign: 'right', name: 'phone', Width: 100},
            {
                id: 'passfirst',
                fieldLabel: '密码',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'password',
                Width: 100,
                inputType: 'password', allowBlank: false, blankText: "不能为空"
            },
            {
                id: 'passwordagain',
                fieldLabel: '确认密码',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'passwordagain',
                Width: 100,
                inputType: 'password', allowBlank: false, blankText: "不能为空"
            },

            {id: 'checkUserDis', fieldLabel: '是否禁用', labelAlign: 'right', xtype: 'checkboxfield', name: 'isdisabled'}
        ],
        buttons: [{
            text: '保存',
            handler: function () {
                SaveUserDetails();
            }
        }, {
            text: '关闭',
            handler: function () {
                win.hide();
            }
        }]
    });
    //修改信息
    var UserOpFormEdit = Ext.create('Ext.form.Panel', {
        id: 'UserOptionFormEdit',
        layout: 'form',
        frame: false,
        bodyPadding: 5,
        header: false,
        border: false,
        defaults: {
            anchor: '100%'
        },
        items: [
            {labelAlign: 'right', fieldLabel: 'ID', xtype: 'textfield', hidden: true, name: 'id'},
            {
                fieldLabel: '用户名',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'username',
                Width: 100,
                allowBlank: false,
                blankText: "不能为空"
            },
            {
                fieldLabel: '真实姓名',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'realname',
                Width: 100,
                allowBlank: false,
                blankText: "不能为空"
            },
            {fieldLabel: '邮箱', xtype: 'textfield', labelAlign: 'right', name: 'email', Width: 100},
            {fieldLabel: '电话', xtype: 'textfield', labelAlign: 'right', name: 'phone', Width: 100},
            {
                fieldLabel: '禁用',
                labelAlign: 'right',
                xtype: 'checkboxfield',
                name: 'isdisabled',
                inputValue: true,
                id: 'checkboxDis'
            }
        ],
        buttons: [{
            text: '保存',
            handler: function () {
                SaveUserEdit();
            }
        }, {
            text: '关闭',
            handler: function () {
                winEdit.hide();
            }
        }]
    });
    //修改密码
    var UserOpFormEditPwd = Ext.create('Ext.form.Panel', {
        id: 'UserOpFormEditPwd',
        layout: 'form',
        frame: false,
        bodyPadding: 5,
        header: false,
        border: false,
        defaults: {
            anchor: '100%'
        },
        items: [
            {labelAlign: 'right', fieldLabel: 'ID', xtype: 'textfield', hidden: true, name: 'id'},
            {
                id: 'oldpwd',
                fieldLabel: '旧密码',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'oldpwd',
                Width: 100,
                inputType: 'password', allowBlank: false, blankText: "不能为空"
            },
            {
                id: 'newpwd',
                fieldLabel: '新密码',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'newpwd',
                Width: 100,
                inputType: 'password', allowBlank: false, blankText: "不能为空"
            },
            {
                id: 'confirmnewpwd',
                fieldLabel: '重复新密码',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'confirmnewpwd',
                Width: 100,
                inputType: 'password', allowBlank: false, blankText: "不能为空"
            }
        ],
        buttons: [{
            text: '保存',
            handler: function () {
                SaveUserEditPwd();
            }
        }, {
            text: '关闭',
            handler: function () {
                winEditPwd.hide();
            }
        }]
    });
    //弹窗容器
    var win = Ext.create('widget.window', {
        title: '用户详情',
        header: {
            titleAlign: 'center'
        },
        //closable: true,
        //closeAction: 'hide',
        modal: true,
        renderTo: 'user_manage',
        width: 350,
        minWidth: 350,
        items: [UserOpFormAdd],
        closeAction: 'hide' //关闭事件，默认是destroy 很重要
    });
    //修改信息
    var winEdit = Ext.create('widget.window', {
        title: '用户详情',
        header: {
            titleAlign: 'center'
        },
        //closable: true,
        //closeAction: 'hide',
        modal: true,
        renderTo: 'user_manage',
        width: 350,
        minWidth: 350,
        items: [UserOpFormEdit],
        closeAction: 'hide' //关闭事件，默认是destroy 很重要
    });
    //修改密码
    var winEditPwd = Ext.create('widget.window', {
        title: '密码详情',
        header: {
            titleAlign: 'center'
        },
        //closable: true,
        //closeAction: 'hide',
        modal: true,
        renderTo: 'user_manage',
        width: 350,
        minWidth: 350,
        items: [UserOpFormEditPwd],
        closeAction: 'hide' //关闭事件，默认是destroy 很重要
    });

    //表格工具条上的按钮
    var ToolsBtnAdd = Ext.create('Ext.Action', {
        //icon: '../shared/icons/fam/delete.gif',  // 通过地址配置按钮icon
        iconCls: 'iconAdd', //通过样式表配置按钮icon
        text: '新  增',
        handler: function (widget, event) {
            if (win.isVisible()) {
                win.hide();
            } else {
                Ext.getCmp('UserOptionFormAdd').getForm().reset();
                win.show();
            }
        }
    });
    //修改信息
    var ToolsBtnEdit = Ext.create('Ext.Action', {
        //icon: '../shared/icons/fam/delete.gif',  // 通过地址配置按钮icon
        iconCls: 'iconAdd', //通过样式表配置按钮icon
        text: '修改信息',
        disabled: true,
        handler: function (widget, event) {
            var rec = grid.getSelectionModel().getSelection()[0];
            if (rec) {
                if (winEdit.isVisible()) {
                    winEdit.hide();
                } else {
                    //加载数据
                    Ext.getCmp('UserOptionFormEdit').getForm().loadRecord(rec);
                    //改变checkbox的禁用
                    if (rec.data.isdisabled == '0') {
                        Ext.getCmp('checkboxDis').setValue(false);
                    }
                    else {
                        Ext.getCmp('checkboxDis').setValue(true);
                    }
                    winEdit.show();
                }
            }
        }
    });
    //修改密码
    var ToolsBtnPwd = Ext.create('Ext.Action', {
        //icon: '../shared/icons/fam/delete.gif',  // 通过地址配置按钮icon
        iconCls: 'iconAdd', //通过样式表配置按钮icon
        text: '修改密码',
        disabled: true,
        handler: function (widget, event) {
            var rec = grid.getSelectionModel().getSelection()[0];
            if (winEditPwd.isVisible()) {
                winEditPwd.hide();
            } else {
                winEditPwd.show();
            }
        }
    });

    var ToolsBtnDelete = Ext.create('Ext.Action', {
        text: '删  除',
        iconCls: 'iconDelete',
        disabled: true,
        handler: function (widget, event) {
            var data = grid.getSelectionModel().getSelection();
            if (data.length == 0) {
                Ext.MessageBox.show({
                    title: "提示",
                    msg: "请先选择您要操作的行!"
                });
                return;
            }
            else if (data.length > 1) {
                Ext.MessageBox.show({
                    title: "提示",
                    msg: "请勿选择多行同时删除!"
                });
                return;
            }
            else {
                Ext.Msg.confirm("请确认", "是否真的要删除数据？", function (button, text) {
                    if (button == "yes") {
                        Ext.Ajax.request({
                            url: 'MoudleBaseJs/DeleteUser',
                            params: {
                                ID: data[0].get('id')
                            },
                            method: 'POST',
                            success: function (response, opts) {
                                var responseJson = Ext.JSON.decode(response.responseText);
                                // 当后台数据同步成功时
                                if (responseJson.IsError) {
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "用户删除失败!" + responseJson.ErrorMsg
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "用户删除失败成功!"
                                    });
                                    store.reload();
                                }
                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '数据删除错误!');
                            }
                        });
                    }
                });
            }

        }
    });
    //创建数据展示表格所需要的结构
    var store = Ext.create('Ext.data.Store', {
        //设置分页大小
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: 'MoudleBaseJs/GetUsersPaged',
            reader: {
                //数据格式为json
                type: 'json',
                root: 'Rows',
                //获取数据总数
                totalProperty: 'Total'
            }
        },
        fields: [
            {name: 'id', type: 'string'},
            {name: 'username', type: 'string'},
            {name: 'realname', type: 'string'},
            {name: 'email', type: 'string'},
            {name: 'phone', type: 'string'},
            {name: 'isdisabled', type: 'string'}

        ],
        //设置属性进行请求后台排序
        remoteSort: true
    });


    ////查询层
    //var SeachPanel = Ext.create('Ext.form.FieldSet', {
    //    id: 'seachdiv',
    //    xtype: 'fieldset',
    //    padding: '2 2 2 2',
    //    title: '查询',
    //    collapsible: false,
    //    layout: {
    //        type: 'table',
    //        columns: 2
    //    },
    //    items: [
    //        {width: 200, labelWidth: 70, labelAlign: 'right', xtype: 'textfield', fieldLabel: '用户名', id: 'txtUserName'},
    //        {
    //            width: 200,
    //            labelWidth: 70,
    //            labelAlign: 'right',
    //            xtype: 'textfield',
    //            fieldLabel: '真实姓名',
    //            id: 'txtRealName'
    //        },
    //        {
    //            clospan: 2,
    //            border: 0,
    //            items: [
    //                {
    //                    id: 'btnSearch', xtype: 'button', text: '查  询', width: 60, handler: function () {
    //                    var username = Ext.getCmp('txtUserName').getValue(); //获取文本框值
    //                    var realname = Ext.getCmp('txtRealName').getValue(); //获取文本框值
    //                    if (name != "") {
    //                        store.load({params: {name: username, realname: realname}});
    //                    }//传递参数
    //                },
    //                    style: {marginBottom: '5px', marginLeft: '5px'}
    //                },
    //                {
    //                    id: 'btnResult', xtype: 'button', text: '重  置', width: 60,
    //                    handler: function () {
    //                        Ext.each(SeachPanel.items.items, function (value, index) {
    //                            if (value.fieldLabel) {
    //                                value.reset();
    //                            }
    //                        })
    //                    }, style: {marginBottom: '5px', marginLeft: '5px'}
    //                }
    //            ]
    //        }
    //    ]
    //
    //});
    //创建数据展示表格 并追加到body
    var grid = Ext.create('Ext.grid.Panel', {
        id: 'gridMain',
        padding: '0 5 2 5',
        store: store,
        columnLines: true,
        //列信息
        columns: [
            {text: '用户名', width: 120, dataIndex: 'username', sortable: true},
            {text: '真实姓名', width: 200, dataIndex: 'realname', sortable: true},
            {text: '邮箱', width: 120, dataIndex: 'email', sortable: true},
            {text: '电话', width: 120, dataIndex: 'phone', sortable: true},
            {
                text: '是否禁用', width: 150, dataIndex: 'isdisabled',
                renderer: function (value) {
                    if (value == '0') {//判断是否含有图片
                        value = "否";
                    } else {
                        value = "是";
                    }
                    return value;
                }
            }
        ],

        dockedItems: [{
            //头部工具条
            xtype: 'toolbar',
            dock: 'top',
            items: [ToolsBtnAdd, ToolsBtnEdit, ToolsBtnPwd, ToolsBtnDelete]
        }, {
            //分页工具条
            xtype: 'pagingtoolbar',
            store: store,   // 和grid的store要一致
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
            emptyMsg: "没有数据",
        }]
    });
    //加载第一页
    store.loadPage(1);
    //为表格的行选择改变事件添加事件监听
    grid.getSelectionModel().on({
        selectionchange: function (sm, selections) {
            if (selections.length) {
                //若选择了行 则启用
                ToolsBtnEdit.enable();
                ToolsBtnPwd.enable();
                ToolsBtnDelete.enable();
            } else {
                //否则 灰化
                ToolsBtnEdit.disable();
                ToolsBtnPwd.disable();
                ToolsBtnDelete.disable();
            }
        }
    });

    var BorderLayout = new Ext.Panel({
        title: '',
        layout: 'border',
        width: '100%',
        height: '100%',
        items: [
            new Ext.Panel({title: '', region: 'center', items: grid, layout: 'fit'})
        ],
        renderTo: 'user_manage'
    });

}
