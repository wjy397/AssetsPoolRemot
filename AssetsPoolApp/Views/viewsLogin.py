# -*- coding: utf-8 -*-
# Create your views here.
from AssetsPool import settings
from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseNotFound,HttpRequest,HttpResponseRedirect
from django.shortcuts import render_to_response,render,RequestContext
from django.views.decorators.csrf import csrf_exempt   #POST关闭csrf防御
from django.views.decorators.csrf import requires_csrf_token,ensure_csrf_cookie ,csrf_protect#token设置修饰器
from PIL import Image, ImageDraw, ImageFont #验证码绘图
import random
import StringIO
from AssetsPoolApp.Controller.AdminPool.LoginController import UserController #登陆业务控制器
from django.contrib.auth.hashers import make_password, check_password #加密

# tab内嵌页
# 基础模块
def menu_manage(request):
            return render_to_response('AdminPool/menu_manage.html', {})
def role_manage(request):
            return render_to_response('AdminPool/role_manage.html', {})
def user_manage(request):
            return render_to_response('AdminPool/user_manage.html', {})

# 资产库管理
def luru(request):
            return render_to_response('AssetManageHtml/luru.html', {})
def shenbao(request):
            return render_to_response('AssetManageHtml/shenbao.html', {})
def shenpi(request):
            return render_to_response('AssetManageHtml/shenpi.html', {})
def zhuanyi(request):
            return render_to_response('AssetManageHtml/zhuanyi.html', {})

# 登陆页面
@ensure_csrf_cookie #设置token验证
def Login(request):
    if(request.session.get('username','hacker') == 'hacker'):
            return render_to_response('AdminPool/Login.html', {})
    else:
        return indexRedirect(request)
# 首页跳转到首页
def indexRedirect(request):
    # 判断是否存在用户
    if(request.session.get('username','hacker') == 'hacker'):
            return Login(request)
    else:
        return render_to_response('AdminPool/index.html', {})

# 登陆相应
def  loginSystem(request):
   if request.method == 'POST':
       _loginName = request.POST.get('loginName')
       _loginPwd = request.POST.get('loginPwd')
       _codeVerity = request.POST.get('codeVerity')
       _serverCheckcode =  request.session.get('checkcode',default=None)
       #验证码检测
       if(_serverCheckcode.lower()!=_codeVerity.lower()):                                              #此注释用于开发快捷登陆
            return HttpResponse("{'IsError':true,'ErrorMsg':'验证码错误!'}")                            # 此注释用于开发快捷登陆
       #验证用户信息
       try:
            request.session['checkcode'] =initCheckCodeVal(4)['cstr'].lower()  #更新验证码 防止携一次登录成功验证码DDOS
            _userController = UserController()
            _user = _userController.is_exit_user(_loginName)
            if(_user !=None and check_password(_loginPwd,_user.password)):
                   request.session['username']=_user.username
                   request.session['userid']=_user.id
                   return HttpResponse("{'IsError':false,'ErrorMsg':'LoginIndex'}")
            else:
                   return HttpResponse("{'IsError':true,'ErrorMsg':'用户名或密码错误!'}")
       except:
           return HttpResponse("{'IsError':true,'ErrorMsg':'用户信息_controller错误!'}")

   # POST以为
   result = "{'IsError':true,'ErrorMsg':'CSRF防御!'}"
   return HttpResponse(result)

# 获取验证码
def getCheckCodeImage(request):
    #验证码的长度
    clength = 4
    #获取到验证码的值
    code_dict = initCheckCodeVal(clength)
    #取出列表类型的验证码值
    rand_list = code_dict['clist']
    #取出字符串类型的验证码值
    rand_str = code_dict['cstr']
    #设置字体,需设置的字体包simsun.ttc与python源码同级目录
    font = ImageFont.truetype('simsun.ttc',random.randint(18,25))
    #Image背景颜色
    bg_color = (255,255,255)
    #Image的长和宽
    i_width,i_height = clength*20,30
    #初始化Image对象
    im = Image.new('RGB',(i_width,i_height),bg_color)
    draw = ImageDraw.Draw(im)
    for i in range(0,clength):
        in_x = 10+i*10+random.randint(1,7)#随机验证码数字初始坐标
        in_y = random.randint(2,15)
        draw.text((in_x,5), rand_list[i],font=font,fill=(0,0,0))
    #随机设置干扰线
    for i in range(0,3):
        linecolor = (random.randint(0,255),random.randint(0,255),random.randint(0,255))#随机颜色
        #都是随机的
        x1 = random.randint(0,10)#随机干扰线初始和结束x,y坐标
        x2 = random.randint(i_width-10,i_width)
        y1 = random.randint(5,i_height-5)
        y2 = random.randint(5,i_height-5)
        draw.line([(x1, y1), (x2, y2)], linecolor)
    del draw
    #将验证码转换成小写的，并保存到session中
    request.session['checkcode'] = rand_str.lower()
    # request.session.set_expiry(60*0.5)
    buf = StringIO.StringIO()
    #将image信息保存到StringIO流中
    im.save(buf, 'gif')
    return HttpResponse(buf.getvalue(),'image/gif')

# 获取验证码的值
def initCheckCodeVal(length=4):
    codes = ['0','2','3','4','5','6','7','8','9',
    'a','b','c','d','e','f','g','h','i','j',
    'k','m','n','o','p','q','r','s','t','u',
    'v','w','x','y','z','A','B','C','D','E',
    'F','G','H','I','J','K','L','M','N','O',
    'P','Q','R','S','T','U','V','W','X','Y',
    'Z']
    code_list = []
    code_str = ''
    for i in range(0,length):
        temp = codes[random.randint(0,59)]
        code_list.append(temp)
        code_str+=temp
    return {'clist':code_list,'cstr':code_str}


