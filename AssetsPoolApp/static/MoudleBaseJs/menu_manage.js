/**
 * Created by wangjingyao on 2015/10/21.
 */
function menu_manage() {
    //因为每个页面在打开后切换到其他页面在切换回来会重新执行js方法，会在页面重复添加布局，
    // 所以一开始先删除所有元素，达到重新加载的效果
    $('#menu_manage').empty();

    //保存菜单
    var SaveMenuDetails = function () {
        var saveform = Ext.getCmp('MenuOptionForm').getForm();
        var flagValid = saveform.isValid();
        if(!flagValid)
        {
            return;
        }
        var menuId = saveform.findField('ID').getValue();
        var menuPid = saveform.findField('ParentID').getValue();
        var menuName = saveform.findField('Name').getValue();
        var menuNo = saveform.findField('MenuNo').getValue();
        var menuOrder = saveform.findField('MenuOrder').getValue();
        var menuUrl = saveform.findField('URL').getValue();
        var menuIcon = saveform.findField('Icon').getValue();
        var isVis =saveform.findField('IsVisiable').getValue()==true?'1':'0';
        var menuLevel=saveform.findField('Level').getValue();
        var isleaf=saveform.findField('IsLeaf').getValue()=='true'?'1':'0';

        var optionUrl = 'MoudleBaseJs/UpdateMenu';
        if (menuId == '') {
            isleaf = '1';
            optionUrl = 'MoudleBaseJs/AddMenu';
        }
        Ext.Ajax.request({
            url: optionUrl,
            params: {
                id:menuId,
                parentid: menuPid,
                name: menuName,
                menuno: menuNo,
                menuorder: menuOrder,
                url: menuUrl,
                icon: menuIcon,
                isvisiable: isVis,
                level:menuLevel,
                isleaf: isleaf
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
                        msg:  responseJson.ErrorMsg
                    });
                    win.hide();
                    store.reload();
                }
            },
            failure: function (response, options) {
                Ext.MessageBox.alert('提示', '数据保存错误!');
            }

        });

    };

    //菜单新增和编辑的弹窗
    var MenuOpForm = Ext.create('Ext.form.Panel', {
        id: 'MenuOptionForm',
        layout: 'form',
        frame: false,
        bodyPadding: 5,
        header: false,
        border: false,
        defaults: {
            anchor: '100%'
        },
        items: [
            { labelAlign: 'right', fieldLabel: 'ID', xtype: 'textfield', hidden: true, name: 'ID' },
            { id: 'ParentID', labelAlign: 'right', fieldLabel: '父节点ID', xtype: 'textfield', hidden: true, name: 'ParentID' },
            { id: 'Level', labelAlign: 'right', fieldLabel: '层级深度', xtype: 'textfield', hidden: true, name: 'Level' },
            { id: 'IsLeaf', labelAlign: 'right', fieldLabel: '是否末节点', xtype: 'textfield', hidden: true, name: 'IsLeaf' },
            { fieldLabel: '菜单名称', xtype: 'textfield', labelAlign: 'right', name: 'Name', Width: 100 , allowBlank: false, blankText: "不能为空"},
            { fieldLabel: '编号', xtype: 'textfield', labelAlign: 'right', name: 'MenuNo', Width: 100 , allowBlank: false, blankText: "不能为空"},
            { fieldLabel: '序号', xtype: 'textfield', labelAlign: 'right', name: 'MenuOrder', Width: 100 },
            { id:'txtUrl',fieldLabel: '链接地址', xtype: 'textfield', labelAlign: 'right', name: 'URL', Width: 100 ,  blankText: "不能为空"},
            { fieldLabel: '图标', xtype: 'textfield', labelAlign: 'right', name: 'Icon', Width: 100 },
            { id: 'checkMenuDis', fieldLabel: '是否启用', labelAlign: 'right', xtype: 'checkboxfield', name: 'IsVisiable', inputValue: true , allowBlank: false, blankText: "不能为空"}
        ],
        buttons: [{
            text: '保存',
            handler: function () {
                SaveMenuDetails();
            }
        }, {
            text: '关闭',
            handler: function () {
                win.hide();
            }
        }]
    });
    //弹窗容器
    var win = Ext.create('widget.window', {
        title: '菜单详情',
        header: {
            titleAlign: 'center'
        },
        renderTo:'menu_manage',
        width: 350,
        minWidth: 350,
        modal:true,
        items: [MenuOpForm],
        closeAction: 'hide' //关闭事件，默认是destroy 很重要
    });



    //表格工具条上的按钮
    //增加同级
    var ToolsBtnAdd = Ext.create('Ext.Action', {
        iconCls: 'iconPageExpand', //通过样式表配置按钮icon
        text: '新增同级',
        disabled: true,
        handler: function (widget, event) {
            //得到当前选择行记录
            var rec = tree.getSelectionModel().getSelection()[0];
            //判断行是否为空，若为空则跳出
            if (rec) {
                if (win.isVisible()) {
                    win.hide();
                } else {
                    //对弹窗上父节点信息进行赋值
                    Ext.getCmp('MenuOptionForm').getForm().reset();
                    Ext.getCmp('ParentID').setValue(rec.data.ParentID);
                    Ext.getCmp('Level').setValue(rec.data.Level);
                    win.show();
                }
            }
        }
    });

    var ToolsBtnAddChildren = Ext.create('Ext.Action', {
        iconCls: 'iconPagePut', //通过样式表配置按钮icon
        text: '新增子级',
        disabled: true,
        handler: function (widget, event) {
            //得到当前选择行记录
            var rec = tree.getSelectionModel().getSelection()[0];
            //判断行是否为空，若为空则跳出
            if (rec) {
                if (win.isVisible()) {
                    win.hide();
                } else {
                    Ext.getCmp('MenuOptionForm').getForm().reset();
                    //对弹窗上父节点信息进行赋值,父节点为自己
                    Ext.getCmp('ParentID').setValue(rec.data.ID);
                    Ext.getCmp('Level').setValue(rec.data.Level+1);
                    win.show();
                }
            }
        }
    });

    var ToolsBtnEdit = Ext.create('Ext.Action', {
        text: '修  改',
        iconCls: 'iconEdit',
        disabled: true,
        handler: function (widget, event) {
            var rec = tree.getSelectionModel().getSelection()[0];
            if (rec) {
                if (win.isVisible()) {
                    win.hide();
                } else {
                    //加载数据
                    Ext.getCmp('MenuOptionForm').getForm().loadRecord(rec);
                    //改变checkbox的禁用
                    if (rec.data.IsVisiable == '0') {
                        Ext.getCmp('checkMenuDis').setValue(false);
                    }
                    else {
                        Ext.getCmp('checkMenuDis').setValue(true);
                    }
                    win.show();
                }
            }
        }
    });

    var ToolsBtnMenuVisiable = Ext.create('Ext.Action', {
        text: '启用菜单',
        iconCls: 'iconpageCheck',
        disabled: true,
        handler: function (widget, event) {
            var data = tree.getSelectionModel().getSelection();
            if (data.length == 0) {
                Ext.MessageBox.show({ title: "提示", msg: "请先选择您要操作的行!" });
                return;
            }
            else if (data.length > 1) {
                Ext.MessageBox.show({ title: "提示", msg: "请勿选择多行同时操作!" });
                return;
            }
            else {
                Ext.Msg.confirm("请确认", "是否真的要启用菜单？", function (button, text) {
                    if (button == "yes") {
                        Ext.Ajax.request({
                            url: 'MoudleBaseJs/EnabledMenu', method: 'POST',
                            params: { ID: data[0].get('ID') },
                            success: function (response, opts) {
                                var responseJson = Ext.JSON.decode(response.responseText);
                                // 当后台数据同步成功时
                                if (responseJson.IsError) {
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "菜单启用失败!"
                                    });
                                } else {
                                    store.reload();
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "菜单启用成功!"
                                    });
                                }

                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '菜单启用错误!');
                            }

                        });
                    }
                });
            }
        }
    });

    var ToolsBtnMenu = Ext.create('Ext.Action', {
        text: '禁用菜单',
        iconCls: 'iconpageDelete',
        disabled: true,
        handler: function (widget, event) {
            var data = tree.getSelectionModel().getSelection();
            if (data.length == 0) {
                Ext.MessageBox.show({ title: "提示", msg: "请先选择您要操作的行!" });
                return;
            }
            else if (data.length > 1) {
                Ext.MessageBox.show({ title: "提示", msg: "请勿选择多行同时操作!" });
                return;
            }
            else {
                Ext.Msg.confirm("请确认", "是否真的要禁用菜单？", function (button, text) {
                    if (button == "yes") {
                        Ext.Ajax.request({
                            url: 'MoudleBaseJs/DisableMenu', method: 'POST',
                            params: { ID: data[0].get('ID') },
                            success: function (response, opts) {
                                var responseJson = Ext.JSON.decode(response.responseText);
                                // 当后台数据同步成功时
                                if (responseJson.IsError) {
                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "菜单禁用失败!"
                                    });
                                } else {
                                    store.reload();

                                    Ext.MessageBox.show({
                                        title: "提示",
                                        msg: "菜单禁用成功!"
                                    });

                                }

                            },
                            failure: function (response, options) {
                                Ext.MessageBox.alert('提示', '菜单禁用错误!');
                            }

                        });
                    }
                });
            }
        }
    });

    //菜单对应的数据模型
   var Menu =  Ext.define('Menu', {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'Name', type: 'string' },
            { name: 'MenuNo', type: 'string' },
            { name: 'MenuOrder', type: 'string' },
            { name: 'URL', type: 'string' },
            { name: 'Icon', type: 'string' },
            { name: 'IsVisiable', type: 'boolean' },
            { name: 'IsLeaf', type: 'boolean' },
            { name: 'ID', type: 'string' },
            { name: 'ParentID', type: 'string' },
            { name: 'Level', type: 'int' }
        ]
    });

    var store = Ext.create('Ext.data.TreeStore', {
        model: Menu,
        proxy: {
            type: 'ajax',
            url: 'MoudleBaseJs/GetMenuTreeGridJson'
        }
    });

    //搭建界面布局 树状结构
    var tree = Ext.create('Ext.tree.Panel', {
        bodyPadding:  '0 5 2 5 ',
        useArrows: true,
        rootVisible: false,
        store: store,
        lines: false,
        columns: [
            { text: '菜单名称', dataIndex: 'Name', locked: true, xtype: 'treecolumn', width: 250 },
            { text: '菜单编号', dataIndex: 'MenuNo' },
            { text: '菜单序号', dataIndex: 'MenuOrder' },
            { text: '连接地址', dataIndex: 'URL', width: 200 },
            {
                text: "图标", width: 100, dataIndex: 'Icon',
                //renderer: function (value, meta, record) {
                //    if (value != '') {
                //        return "<img src='../" + value + "'>";
                //    }
                //
                //}
            },
            {
                text: '是否启用', dataIndex: 'IsVisiable',
                renderer: function (value, meta, record) {
                    if (value=='1') {
                        value = '是';
                    }
                    else {
                        value = '否';
                        meta.style = 'background-color:#FF8080';
                    }
                    return value;
                }
            }
        ],
        dockedItems: [{
            //头部工具条
            xtype: 'toolbar',
            dock: 'top',
            items: [ToolsBtnAdd, ToolsBtnAddChildren, ToolsBtnEdit, ToolsBtnMenuVisiable, ToolsBtnMenu]
        }]
    });
    //展开所有树节点
    tree.expandAll();

    //为表格的行选择改变事件添加事件监听
    tree.getSelectionModel().on({
        selectionchange: function (sm, selections) {
            if (selections.length) {
                //若选择了行 则启用
                ToolsBtnAdd.enable();
                ToolsBtnAddChildren.enable();
                ToolsBtnEdit.enable();
                ToolsBtnMenuVisiable.enable();
                ToolsBtnMenu.enable();
            } else {
                //否则 灰化
                ToolsBtnAdd.disable();
                ToolsBtnAddChildren.disable();
                ToolsBtnEdit.disable();
                ToolsBtnMenuVisiable.disable();
                ToolsBtnMenu.disable();
            }
        }
    });

    var BorderLayout = new Ext.Panel({
        title: '',
        layout: 'border',
        width: '100%',
        height: '100%',
        layout: 'fit',
        items: [
            //new Ext.Panel({ title: '', region: 'north', html: '可以放个logo什么的' }),
            //new Ext.Panel({ title: '', region: 'south', html: '版权信息？', autoEl: 'center' }),
            new Ext.Panel({title: '', region: 'center',items: tree})
            //,new Ext.Panel({title: '', region: 'west', html: '树型菜单或是手风琴'})
            //,new Ext.Panel({ title: '', region: 'east', html: '常用功能或是去掉？' })
        ],
        renderTo: 'menu_manage'
    });
}