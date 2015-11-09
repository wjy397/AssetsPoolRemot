/**
 * Created by wangjingyao on 2015/10/21.
 */
function role_manage() {
    //因为每个页面在打开后切换到其他页面在切换回来会重新执行js方法，会在页面重复添加布局，
    // 所以一开始先删除所有元素，达到重新加载的效果
    $('#role_manage').empty();
    /////////////////////////////////////////////////////////////////////////////////////////////////////////角色管理
    var click_role_grid_id = '';
    //表单提交方法
    var SaveRoleDetails = function () {
        var saveform = Ext.getCmp('roleDetailWin').getForm();
        var flagValid = saveform.isValid();
        if (!flagValid) {
            return;
        }
        var roleid = saveform.findField('id').getValue();
        var roleName = saveform.findField('rolename').getValue();
        var isDis_value = saveform.findField('isdisabled').getValue();
        var isDis = isDis_value == true ? '1' : '0';
        var description = saveform.findField('description').getValue();
        var optionUrl = 'MoudleBaseJs/UpdateRole';
        if (roleid == '') {
            optionUrl = 'MoudleBaseJs/AddRole';
        }
        Ext.Ajax.request({
            url: optionUrl,
            params: {
                id: roleid,
                rolename: roleName,
                isdisabled: isDis,
                description: description
            },
            method: 'POST',
            success: function (response, opts) {
                var responseJson = Ext.JSON.decode(response.responseText);
                // 当后台数据同步成功时
                if (responseJson.IsError) {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: responseJson.ErrorMsg
                    });
                } else {
                    Ext.MessageBox.show({
                        title: "提示",
                        msg: responseJson.ErrorMsg
                    });
                    storerole.reload();
                    winrole.hide();
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '数据保存错误!');
            }

        });
    };
    //角色新增和编辑的弹窗
    var RoleDetailsForm = Ext.create('Ext.form.Panel', {
        id: 'roleDetailWin',
        layout: 'form',
        frame: false,
        bodyPadding: 5,
        header: false,
        border: false,
        defaults: {
            anchor: '100%'
        },
        items: [{labelAlign: 'right', fieldLabel: 'ID', xtype: 'textfield', hidden: true, name: 'id'},
            {
                fieldLabel: '角色名',
                xtype: 'textfield',
                labelAlign: 'right',
                name: 'rolename',
                Width: 100,
                allowBlank: false,
                tooltip: '请输入角色名'
            },
            {fieldLabel: '描述', labelAlign: 'right', xtype: 'textfield', name: 'description', Width: 100},
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
                SaveRoleDetails();
            }
        }, {
            text: '关闭',
            handler: function () {
                winrole.hide();
            }
        }]
    });
    //弹窗容器
    var winrole = Ext.create('widget.window', {
        title: '角色详情',
        header: {
            titleAlign: 'center'
        },
        renderTo: 'role_manage',
        width: 350,
        minWidth: 350,
        modal: true,
        items: [RoleDetailsForm],
        closeAction: 'hide' //关闭事件，默认是destroy 很重要
    });

    //表格工具条上的按钮
    var ToolsBtnAdd = Ext.create('Ext.Action', {
        //icon: '../shared/icons/fam/delete.gif',  // 通过地址配置按钮icon
        iconCls: 'iconAdd', //通过样式表配置按钮icon
        text: '新  增',
        handler: function (widget, event) {
            if (winrole.isVisible()) {
                winrole.hide();
            } else {
                Ext.getCmp('roleDetailWin').getForm().reset();
                winrole.show();
            }
        }
    });

    var ToolsBtnDeleteRole = Ext.create('Ext.Action', {
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
                            url: 'MoudleBaseJs/DeleteRole',
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
                                        msg: "角色删除失败!"+responseJson.ErrorMsg
                                    });
                                } else {
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "角色删除失败成功!"
                                    });
                                storerole.reload();
                                storeRoleUser.removeAll();
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

    var ToolsBtnEdit = Ext.create('Ext.Action', {
        text: '修  改',
        iconCls: 'iconEdit',
        disabled: true,
        handler: function (widget, event) {
            var rec = grid.getSelectionModel().getSelection()[0];
            if (rec) {
                if (winrole.isVisible()) {
                    winrole.hide();
                } else {
                    //加载数据
                    Ext.getCmp('roleDetailWin').getForm().loadRecord(rec);
                    //改变checkbox的禁用
                    if (rec.data.isdisabled == '0') {
                        Ext.getCmp('checkboxDis').setValue(false);
                    }
                    else {
                        Ext.getCmp('checkboxDis').setValue(true);
                    }
                    winrole.show();
                }
            }
        }
    });

    var ToolsBtnMenuPrivilege = Ext.create('Ext.Action', {
        text: '菜单权限',
        iconCls: 'iconOrganisation',
        disabled: true,
        handler: function (widget, event) {
            if (privMenu.isVisible()) {
                privMenu.hide();
            } else {
                storePrivilege.reload();
                privMenu.show();
            }
        }
    });

    //创建数据展示表格所需要的结构
    var storerole = Ext.create('Ext.data.Store', {
        //设置分页大小
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: 'MoudleBaseJs/GetRoles',
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
            {name: 'rolename', type: 'string'},
            {name: 'isdisabled', type: 'string'},
            {name: 'description', type: 'string'}
        ],
        //设置属性进行请求后台排序
        remoteSort: true
    });

    //创建数据展示表格
    var grid = Ext.create('Ext.grid.Panel', {
        id: 'gridRole',
        title: '角色信息',
        store: storerole,
        columnLines: true,
        //列信息
        columns: [
            {text: 'ID', dataIndex: 'id', hidden: true},
            {text: '角色名', width: 120, dataIndex: 'rolename', sortable: true},
            {
                text: '禁用', width: 120, dataIndex: 'isdisabled', renderer: function (value, meta) {//根据图片路径渲染
                if (value == '0') {//判断是否含有图片
                    value = "否";
                } else {
                    value = "是";
                }
                return value;
            }
            },
            {text: '描述', width: 150, dataIndex: 'description'}
        ]
        , listeners: {
            'cellclick': {//事件
                fn: function (grid, rowIndex, columnIndex, e) {
                    //单击角色刷新角色用户store
                    Ext.getCmp('toolbarpage').moveFirst();//每次切換將分頁移到第一位
                    storeRoleUser.load({params: {roleid: click_role_grid_id}}); //传递参数
                }
            }
        },
        dockedItems: [{
            //头部工具条
            xtype: 'toolbar',
            dock: 'top',
            items: [ToolsBtnAdd, ToolsBtnEdit, ToolsBtnDeleteRole, ToolsBtnMenuPrivilege]//ToolsBtnQueryUsers
        }, {
            //分页工具条
            xtype: 'pagingtoolbar',
            store: storerole,   // 和grid的store要一致
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
            emptyMsg: "没有数据",
        }]
    });
    //加载第一页
    storerole.loadPage(1);
    //为表格的行选择改变事件添加事件监听
    grid.getSelectionModel().on({
        selectionchange: function (sm, selections) {
            if (selections.length) {
                //若选择了行 则启用
                ToolsBtnDeleteRole.enable();
                ToolsBtnEdit.enable();
                ToolsBtnMenuPrivilege.enable();
                ToolsBtnDelete.enable();
                ToolsBtnUserWin.enable();
            } else {
                //否则 灰化
                ToolsBtnDeleteRole.disable();
                ToolsBtnEdit.disable();
                ToolsBtnMenuPrivilege.disable();
                ToolsBtnDelete.disable();
                ToolsBtnUserWin.disable();
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////角色菜单权限
    ///*角色菜单关系部分 开始*/
    Ext.define('treeMenu', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', type: 'string'},
            {name: 'text', type: 'string'},
            {name: 'leaf', type: 'boolean'}
        ]
    });

    var storePrivilege = Ext.create('Ext.data.TreeStore', {
        model: 'treeMenu',
        proxy: {
            type: 'ajax',
            url: 'MoudleBaseJs/GetRoleMenuTreeData'
        },
        method: 'GET',
        root: {
            text: '菜单',
            expanded: true
        }
    });

    storePrivilege.on("beforeload", function () {
        click_role_grid_id = grid.getSelectionModel().getSelection()[0].data.id;
        Ext.apply(storePrivilege.proxy.extraParams, {roleid: click_role_grid_id});
    });
    ////创建保存按钮
    var btnSavePrivilege = Ext.create('Ext.Action', {
        text: '保存',
        iconCls: 'iconCheck',
        handler: function (widget, event) {
            var selectdroleid = grid.getSelectionModel().getSelection()[0].data.id;
            var records = gridPrivilege.getChecked();
            var dataMenus = new Array();
            //var dataMenus = {};
            Ext.Array.each(records, function (rec) {
                if(rec.raw.ID!=null&&rec.raw.ID!=''){
                dataMenus.push(rec.raw.ID);
                    }
            });
            Ext.Ajax.request({
                url: 'MoudleBaseJs/SaveRolePermission',
                params: {
                    DataJSON: Ext.JSON.encode(dataMenus),
                    roleid: selectdroleid//此ID事在视图中赋值的request
                },
                method: 'POST',
                success: function (response, opts) {
                    var responseJson = Ext.JSON.decode(response.responseText);
                    // 当后台数据同步成功时
                    if (responseJson.IsError) {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存失败!"+responseJson.ErrorMsg
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "保存成功!"
                        });
                    }
                    privMenu.hide();
                },
                failure: function (response, options) {
                    Ext.MessageBox.alert('提示', '数据删除错误!');
                }
            });
        }
    });

    var setChildChecked = function (node, checked) {
        node.expand();
        node.set({checked: checked});
        if (node.hasChildNodes()) {
            node.eachChild(function (child) {
                setChildChecked(child, checked);
            });
        }
    };
    var setParentChecked = function setParentChecked(node, checked) {
        node.set({checked: checked});
        var parentNode = node.parentNode;
        if (parentNode != null) {
            var flag = false;
            parentNode.eachChild(function (child) {
                if (child.data.checked == true) {
                    flag = true;
                }
            });
            if (checked == false) {
                if (!flag) {
                    if (node.hasChildNodes()) { //wjy add for All not cancel button to cancel the father
                        setParentChecked(parentNode, checked);
                    }
                }
            } else {
                if (flag) {
                    setParentChecked(parentNode, checked);
                }
            }
        }
    }

    var gridPrivilege = Ext.create('Ext.tree.Panel', {
        useArrows: true,
        rootVisible: false,
        store: storePrivilege,
        lines: false,
        displayField: 'text',
        //头部工具条
        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [
                btnSavePrivilege
            ]
        }],
        listeners: {
            checkchange: {
                fn: function (node, checked, eOpts) {
                    setChildChecked(node, checked);
                    setParentChecked(node, checked);
                }
            }

        }
    });
    var privMenu = new Ext.window.Window({
        width: 430,
        height: 500,
        title: '菜单信息',
        layout: {
            type: 'border'
        },
        header: {
            titleAlign: 'center'
        },
        items: [
            {layout: 'fit', region: 'center', border: 0, items: gridPrivilege}
        ],
        closeAction: 'hide',
        renderTo: 'role_manage',
        modal: true
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////角色用户成员
    //    加载表格信息
    //表格工具条上的按钮
    var ToolsBtnUserWin = Ext.create('Ext.Action', {
        //icon: '../shared/icons/fam/delete.gif',  // 通过地址配置按钮icon
        iconCls: 'iconAdd', //通过样式表配置按钮icon
        disabled: true,
        Visible: true,
        text: '选择人员',
        handler: function (widget, event) {
            if (proShowMenu.isVisible()) {
                proShowMenu.hide();
            } else {
                storeUser.reload();
                proShowMenu.show();
            }
        }
    });

    var ToolsBtnSave = Ext.create('Ext.Action', {
        iconCls: 'iconCheck',
        text: '保存',
        disabled: false, //按钮默认隐藏
        handler: function (widget, event) {
            var strdata = new Array();
            var selectdrole = grid.getSelectionModel().getSelection();
            storeRoleUser.each(
                function (r) {
                    strdata.push(r.data.id);
                }
            );
            Ext.Ajax.request({
                url: 'MoudleBaseJs/AddUserRole',
                params: {
                    RoleID: selectdrole[0].data.id,
                    data: Ext.JSON.encode(strdata)
                },
                method: 'POST',
                success: function (response, opts) {
                    var responseJson = Ext.JSON.decode(response.responseText);
                    if (responseJson.IsError) {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "数据保存失败!" + responseJson.ErrorMsg
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: "提示",
                            msg: "数据保存成功!"
                        });
                        Ext.getCmp('toolbarpage').moveFirst();//每次切換將分頁移到第一位
                        storeRoleUser.load(); //传递参数
                    }

                },
                failure: function (response, options) {
                    Ext.MessageBox.alert('提示', '数据保存错误!');
                }
            });
        }
    });

    var ToolsBtnDelete = Ext.create('Ext.Action', {
        iconCls: 'iconDelete',
        text: '移除',
        disabled: true,
        handler: function (widget, event) {
            var selectdrole = grid.getSelectionModel().getSelection();
            var selectdroleuser = gridUserRole.getSelectionModel().getSelection();
            //var strSelectd = "[" + Ext.JSON.encode(selectd[0].data) + "]";
            if (selectdroleuser.length == 0) {
                Ext.MessageBox.show({
                    title: "提示",
                    msg: "请先选择您要操作的行!"
                });
                return;
            }
            else if (selectdroleuser.length > 1) {
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
                            url: 'MoudleBaseJs/DeleteUserRole',
                            params: {
                                roleID: selectdrole[0].data.id,
                                userID: selectdroleuser[0].data.id
                            },
                            method: 'POST',
                            success: function (response, opts) {
                                var responseJson = Ext.JSON.decode(response.responseText);
                                // 当后台数据同步成功时
                                if (responseJson.IsError) {
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "数据删除失败!" + responseJson.ErrorMsg
                                    });
                                    storeRoleUser.remove(selectdroleuser[0]);// 页面效果
                                } else {
                                    Ext.getCmp('toolbarpage').moveFirst();//每次切換將分頁移到第一位
                                    storeRoleUser.load(); //传递参数
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "删除数据成功!"
                                    });
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

    var storeUser = Ext.create('Ext.data.Store', {
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
            {name: 'realname', type: 'string'}
        ],
        //设置属性进行请求后台排序
        remoteSort: true
    });

    var checkBox = Ext.create('Ext.selection.CheckboxModel');
    var gridMain = Ext.create('Ext.grid.Panel', {
        id: 'gridMain',
        padding: '5 5 3 5',
        selModel: checkBox,
        store: storeUser,
        columnLines: true,
        //列信息
        columns: [
            {text: 'ID', dataIndex: 'id', hidden: true},
            {text: '登录名', width: 150, dataIndex: 'username', sortable: true},
            {text: '真实姓名', width: 150, dataIndex: 'realname', sortable: true}
        ],

        dockedItems: [{
            //分页工具条
            xtype: 'pagingtoolbar',
            store: storeUser,   // 和grid的store要一致
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
            emptyMsg: "没有数据",
        }],
        buttons: [{
            text: '保存',
            handler: function () {
                var records = gridMain.getSelectionModel().getSelection();
                for (var i = 0; i < records.length; i++) {
                    var bool = false;
                    for (var j = 0; j < storeRoleUser.getCount(); j++) {
                        var record = storeRoleUser.getAt(j);
                        if (record.get('id') == records[i].data["id"]) {
                            bool = true;
                            break;
                        }
                    }
                    if (bool == false) {
                        storeRoleUser.add(
                            {
                                'id': records[i].data["id"],
                                'username': records[i].data["username"],
                                'realname': records[i].data["realname"]
                            }
                        );
                    }
                }
                proShowMenu.hide();
            }
        }, {
            text: '关闭',
            handler: function () {
                proShowMenu.hide();
            }
        }]
    });

    var proShowMenu = new Ext.window.Window({
        width: 430,
        height: 400,
        title: '用户信息',
        layout: {
            type: 'border'
        },
        header: {
            titleAlign: 'center'
        },
        items: [
            //{ layout: 'fit', region: 'north', border: 0, items: panelProSearch },
            {layout: 'fit', region: 'center', border: 0, items: gridMain}
        ],
        closeAction: 'hide',
        renderTo: 'role_manage',
        modal: true
    });

    //查询层
    var panelProSearch = Ext.create('Ext.panel.Panel', {
        //padding: 5,
        //title: '查询',
        //layout: {
        //    type: 'table',
        //    columns: 2
        //},
        //border: 0,
        //header: false,
        //items: [
        //    { width: 200, labelWidth: 70, labelAlign: 'right', xtype: 'textfield', fieldLabel: '查询码', id: 'txtUserQuery' },
        //    {
        //        clospan: 2,
        //        border: 0,
        //        layout: 'fit',
        //        items: [
        //            {
        //                xtype: 'button', text: '查  询', width: 60, handler: function () {
        //                    var queryinfo = Ext.getCmp('txtUserQuery').getValue(); //获取文本框值
        //                    storeUser.load({ params: { py: queryinfo } });
        //                    //if (queryinfo != "") { storePro.load({ params: { py: queryinfo } }); }//传递参数
        //                },
        //                style: { marginBottom: '5px', marginLeft: '5px' }
        //            }
        //        ]
        //    }
        //]
    });

    //表格显示的数据内容
    //创建数据展示表格所需要的结构
    var storeRoleUser = Ext.create('Ext.data.Store', {
        //设置分页大小
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: 'MoudleBaseJs/GetUserByRole',
            params: {
                roleid: click_role_grid_id
            },
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
            {name: 'realname', type: 'string'}
        ],
        //设置属性进行请求后台排序
        remoteSort: true
    });
    //默认只能查一页，分页在store被load之前给页参数赋值
    storeRoleUser.on("beforeload", function () {
        click_role_grid_id = grid.getSelectionModel().getSelection()[0].data.id;
        Ext.apply(storeRoleUser.proxy.extraParams, {roleid: click_role_grid_id});
    });
    //创建数据展示表格
    var gridUserRole = Ext.create('Ext.grid.Panel', {
        id: 'grid',
        title: '查看成员',
        store: storeRoleUser,
        columnLines: true,
        //列信息
        columns: [
            {text: 'ID', dataIndex: 'id', hidden: true},
            {text: '登录名', width: 200, dataIndex: 'username', sortable: true},
            {text: '真实姓名', width: 200, dataIndex: 'realname', sortable: true}
        ],
        //头部工具条
        dockedItems: [{
            //头部工具条
            xtype: 'toolbar',
            dock: 'top',
            items: [ToolsBtnUserWin, ToolsBtnDelete, ToolsBtnSave]
        }, {
            //分页工具条
            id: 'toolbarpage',
            xtype: 'pagingtoolbar',
            store: storeRoleUser,   // 和grid的store要一致
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
            emptyMsg: "没有数据",
        }],
    });
    //加载第一页
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var BorderLayout = new Ext.Panel({
        title: '',
        layout: 'border',
        width: '100%',
        height: '100%',
        items: [
            new Ext.Panel({title: '', region: 'center', items: grid, layout: 'fit'})
            , new Ext.Panel({title: '', region: 'east', width: '50%', items: gridUserRole, layout: 'fit'})
        ],
        renderTo: 'role_manage'
    });

}