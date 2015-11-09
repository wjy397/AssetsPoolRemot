/**
 * Created by wangjingyao on 2015/10/13.
 */
//ExtJs��AJAX����Post����֮ǰ���ø÷���,������ͷ����X-CSRFToken��Ϣ,��ֹDjango��CSRF����ϵͳ�Զ����δ�����
Ext.Ajax.on('beforerequest', function (conn, options) {
   if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
     if (typeof(options.headers) == "undefined") {
       options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
     } else {
       options.headers.extend({'X-CSRFToken': Ext.util.Cookies.get('csrftoken')});
     }
   }
}, this);