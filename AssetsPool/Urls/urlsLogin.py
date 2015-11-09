# -*- coding: utf-8 -*-
"""AssetsPool URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from AssetsPoolApp.Views.viewsLogin import *
from AssetsPool import settings
from AssetsPool.Urls.urlsBaseModule import basemodule_urlpatterns

urlpatterns = [
    # 登陆页面
    url(r'^admin/', include(admin.site.urls)),
    url(r'^MoudleBaseJs/', include(basemodule_urlpatterns)),#基础模块urls
    # 登录相关urls
    url(r'^Login$', Login),
    url(r'^LoginSystem$', loginSystem),
    url(r'^msg/LoginCheckCodeImage/$', getCheckCodeImage,name='check code'),
    url(r'^LoginIndex$', indexRedirect),
    #tab内嵌页请求urls
    # 基础模块
    url(r'^menu_manage$', menu_manage),
    url(r'^role_manage$', role_manage),
    url(r'^user_manage$', user_manage),
    # 资产库管理
    url(r'^luru$', luru),
    url(r'^shenbao$', shenbao),
    url(r'^shenpi$', shenpi),
    url(r'^zhuanyi$', zhuanyi),
]
