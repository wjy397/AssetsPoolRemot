/**
 * Created by wangjingyao on 2015/10/13.
 */
//ExtJs在AJAX发送Post请求之前引用该方法,向请求头设置X-CSRFToken信息,防止Django的CSRF防御系统自动屏蔽此请求。
Ext.Ajax.on('beforerequest', function (conn, options) {
   if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
     if (typeof(options.headers) == "undefined") {
       options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
     } else {
       options.headers.extend({'X-CSRFToken': Ext.util.Cookies.get('csrftoken')});
     }
   }
}, this);