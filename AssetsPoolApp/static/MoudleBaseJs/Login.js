//Extjs页面初始化方法
Ext.onReady(function () {
    //登陆按钮事件
    var loginClick =   function(){
            var loginName = document.getElementById('txtUserName').value;
            var loginPwd = document.getElementById('txtUserPass').value;
            var loginPwd_hash  = hex_md5(loginPwd);//md5 encrypt
            var codeVerity = document.getElementById('codeVerification').value;
                    Ext.Ajax.request({
                    url: 'LoginSystem',
                    method: 'POST',
                    params: { loginName: loginName, loginPwd: loginPwd_hash,codeVerity:codeVerity },
                    success: function (response, opts) {
                        var responseJson = Ext.JSON.decode(response.responseText);
                        // 当后台数据同步成功时
                        if (responseJson.IsError) {
                            Ext.MessageBox.show({
                                title: "提示",
                                msg: "登陆失败:"+responseJson.ErrorMsg
                            });
                            if(responseJson.ErrorMsg=='验证码错误!')
                            {
                                document.getElementById('codeVerityImg').setAttribute('src','/msg/LoginCheckCodeImage?nocache='+Math.random())
                            }
                        } else {
                            window.location.href=responseJson.ErrorMsg
                        }
                    },
                    failure: function (response, options) {
                        Ext.MessageBox.alert('提示', '登陆错误:传输失败,请检查网络设置或者CSRF攻击!');
                    }

                });
        }
    //获取按钮id
    var loginBtn = document.getElementById('btnLogin');
    //按钮点击登录
    loginBtn.onclick= loginClick
    //监听回车登录
    if (document.addEventListener)   
    {//如果是Firefox    
        document.addEventListener("keypress", fireFoxHandler, true);    
    } else{    
        document.attachEvent("onkeypress", ieHandler);    
    }    
  function fireFoxHandler(evt){     
        if (evt.keyCode == 13)   
        {    
            loginClick();
        }    
    }    
  function ieHandler(evt)   
    {  //alert("IE");    
        if (evt.keyCode == 13)   
        {    
            loginClick();      
        }    
    } 

});