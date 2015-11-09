Ext.require(['*']);
Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    //动态加载tab页内嵌业务js方法
    function addScript(jsfile, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = jsfile;
        head.appendChild(script);
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                script.onload = script.onreadystatechange = null;
                //if(callback&&typeof(callback)== 'function'){
                //加载js成功 tabJsCounter加入js文件名，callback = separateJsFuncName
                tabJsLoadCounter.push(callback);
                window[callback]();
                //}
            }
        };
    }

    //限制每个tab页js只加载一次容器
    var tabJsLoadCounter = [];
    //tab页加载html容器
    var indexTabContainer = [];
    //动态操作dom节点将tab相应内嵌html加入主页tab里并请求相应js
    //参数配置：主页tab内嵌ID，请求html的ajax路径，分离html文件div的ID，分离js文件路径，分离js文件Function函数名
    var dynamicLoadingPage = function (text, url) {
        //主页没有url
        if(url == undefined){
            return
        }
        //前期数据库设计有误，所以所有addTab所有参数都从url里截取
        // 参数为text,ajaxPath,separateID,separateJsPath,separateJsFuncName
        // 数据库中urlseparateJsPath，参数ajaxPath,separateID,separateJsFuncName统一取js路径里js文件名
        var indexIsolate = url.lastIndexOf("/");
        var indexDot = url.lastIndexOf(".");
        var ajaxPath = url.substring(indexIsolate + 1, indexDot);
        var separateID = ajaxPath;
        var separateJsPath = url;
        var separateJsFuncName = ajaxPath;
        var tabID = 'father_' + separateID;

        //因为tab页初始化时tabchangge是在addTab之前发生，此时还没有对应业务js方法，所以判断是否加载对应js
        //tabchange事件是发生在tab改变的时候，当所有tab打开又都关闭了，js都加载完毕的时候，不应该调用js方法，因为js会找不到对应html的dom节点
        //限制每个tab页js只加载一次
        var isLoadHtml = indexTabContainer.indexOf(text);
        if (isLoadHtml == -1) {
            //jquery load方法动态请求业务界面html加入tab里的div
            $("#" + tabID).load(ajaxPath + " #" + separateID,
                function callbackLoadJs(response, status, xhr) {
                    //增加tab数组容器标示
                    indexTabContainer.push(text);
                    //动态调用业务html相应的js文件,在请求页面成功的回调里执行加载js
                    if (status == 'success') {
                        var isLoadJs = tabJsLoadCounter.indexOf(separateJsFuncName);
                        if (isLoadJs == -1) {
                            addScript("static/" + separateJsPath, separateJsFuncName);
                        }//end if isLoadJs
                        else {//js已经加载过执行相应方法
                            window[separateJsFuncName]();
                        }
                    }//end if status
                });
        }//end if
        else {//html加载过相应的js肯定是加载过的，因为上述方法里在html加载完成的回调里执行加载js，所有html加载过，直接执行相应js方法
            window[separateJsFuncName]();
        }
    }//end dynamicLoadingPage

    //增加tab页方法
    function addTab(text, url) {
        //由于要点击tab更新其对应js的方法等同于刷新页面，函数方法名添加到tab自定的funcName里
        var indexIsolate = url.lastIndexOf("/");
        var indexDot = url.lastIndexOf(".");
        var fatherID = 'father_' + url.substring(indexIsolate + 1, indexDot);
        tabs.add({
            closable: true,
            html: '<div style="width:100%;height: 100%;" id = ' + fatherID + ' ></div>',// + Ext.example.bogusMarkup,
            iconCls: 'tabs',
            title: text,
            funcUrl: url
        }).show();
        //add方法会触发tab的tabchangge方法所以这里不需要动态添加html和js，让tabchange做这些，dynamicLoadingPage(text, url);
    }

    //创建tab页
    var tabs = Ext.create('Ext.tab.Panel', {
        region: 'center', // a center region is ALWAYS required for border layout
        deferredRender: false,
        activeTab: 0,     // first tab initially active
        items: [{
            contentEl: 'center1',
            title: '我有一个梦想',
            closable: false,
            autoScroll: true
        }],
        listeners: {
            //用于新增tab或者切换tab时候更新对应js
            'tabchange': function (tab, newc, oldc, eOpts) {
                dynamicLoadingPage(newc.title, newc.funcUrl);
            }
            //用于删除tab页
            , 'remove': function (tab, eOpts) {
                var colseTabIndex = indexTabContainer.indexOf(eOpts.title);
                //splaice可以改变数组大小不会变成稀疏数组，改变索引位置，第一个为参数为删除位置，第二个为删除数量
                indexTabContainer.splice(colseTabIndex, 1)
            }
        }
    });
    //左侧菜单栏
    var Menu = Ext.create('Ext.panel.Panel', {
        region: 'west',
        stateId: 'navigation-panel',
        id: 'west-panel', // see Ext.getCmp() below
        title: '菜单',
        split: true,
        width: 200,
        minWidth: 175,
        maxWidth: 400,
        collapsible: true,
        animCollapse: true,
        margins: '0 0 0 5',
        layout: 'accordion',
    });
    //请求后台获取一级菜单手风琴数据
    Ext.Ajax.request({
        url: 'MoudleBaseJs/GetMenuTreeJson',
        method: 'GET',
        success: function (response, opts) {
            var responseJson = Ext.JSON.decode(response.responseText);
            // 当后台数据同步成功时
            if (responseJson.success) {
                MenuTopAdd(responseJson.menu);
            }
        },
        failure: function (response, options) {
            Ext.MessageBox.alert('提示', '该用户无菜单信息，加载失败!');
        }

    });
    //向手风琴容器添加菜单
    var MenuTopAdd = function (dataMenu) {
        for (var i = 0; i < dataMenu.length; i++) {
            var menufor = Ext.create('Ext.tree.Panel', {
                title: dataMenu[i].text,
                width: 200,
                store: createStore(dataMenu[i].children),
                icon: dataMenu[i].icon,
                rootVisible: false,
                autoScroll: true,
                animate: true,
                listeners: {
                    //五个参数具体含义 请参照帮助文档。
                    'itemclick': function (view, record, item, index, e) {
                        //查看是否已经打开tab
                        var isOpenTab = indexTabContainer.indexOf(record.raw.text);
                        if (isOpenTab == -1) {
                            addTab(record.raw.text, record.raw.url);
                        } else {
                            //+1为首页位置站位
                            tabs.setActiveTab(isOpenTab + 1)
                        }
                    }
                }
            });
            menufor.expandAll();
            Menu.add(menufor)
        }
        //Menu.doLayout();
    }
    //创建树面板数据源
    var createStore = function (data) {
        var menustore = Ext.create('Ext.data.TreeStore', {
            expanded: true,
            root: {
                expanded: true,
                children: data
            }
        });
        return menustore;
    };
    //布局
    var viewport = Ext.create('Ext.Viewport', {
        id: 'border-example',
        layout: 'border',
        items: [
            // create instance immediately
            Ext.create('Ext.Component', {
                region: 'north',
                height: 32, // give north and south regions a height
                autoEl: {
                    tag: 'div',
                    html: '<p> &nbsp&nbsp&nbsp    hi - 这是资产库首页 !</p>'
                }
            }), {
                // lazily created panel (xtype:'panel' is default)
                region: 'south',
                contentEl: 'south',
                split: true,
                height: 100,
                minSize: 100,
                maxSize: 200,
                collapsible: true,
                collapsed: true,
                title: '南山南',
                margins: '0 0 0 0'
            }, {
                xtype: 'tabpanel',
                region: 'east',
                title: '公告栏',
                animCollapse: true,
                collapsible: true,
                split: true,
                width: 225, // give east and west regions a width
                minSize: 175,
                maxSize: 400,
                margins: '0 5 0 0',
                activeTab: 1,
                tabPosition: 'bottom',
                items: [{
                    html: '<p>hi - Should smile every day !</p>',
                    title: '^@^',
                    autoScroll: true
                }
                ]
            },
            Menu, tabs]
    });
    // get a reference to the HTML element with id "hideit" and add a click listener to it
    //Ext.get("hideit").on('click', function(){
    //    // get a reference to the Panel that was created with id = 'west-panel'
    //    var w = Ext.getCmp('west-panel');
    //    // expand or collapse that Panel based on its collapsed property state
    //    w.collapsed ? w.expand() : w.collapse();
    //});


});

