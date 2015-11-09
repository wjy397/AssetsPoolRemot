# -*- coding: utf-8 -*-
__author__ = 'wangjingyao'

from AssetsPool import settings
from django.shortcuts import redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest, HttpResponseRedirect
from django.shortcuts import render_to_response, render, RequestContext
from django.views.decorators.csrf import csrf_exempt  # POST关闭csrf防御
from django.views.decorators.csrf import requires_csrf_token, ensure_csrf_cookie, csrf_protect  # token设置修饰器
from AssetsPoolApp.Controller.AdminPool.BaseModuleController import BaseModuleController  # 基础模块业务控制器
import StringIO
from AssetsPoolApp.Models.sys_models import *
from AssetsPoolApp.Models.UserModels import *
import uuid
from django.db import transaction
from django.contrib.auth.hashers import make_password, check_password  # 加密

# 基础模块controller
_BaseModuleController = BaseModuleController()


# 获取菜单json admin权限
def getMenuTreeJson(request):
    _username = request.session.get('username', 'hacker')
    _userid = request.session.get('userid', 'hacker')
    if (_userid == 'hacker'):
        return None
    elif (_userid == '37c3f5cf-8469-11e5-b201-10c37ba23555' and _username=='admin' ):
        _data_root = _BaseModuleController.get_admin_menu('root')
        return HttpResponse(_data_root)
    else:
        _data = _BaseModuleController.get_admin_menu(_userid)
        return HttpResponse(_data)
# 菜单管理
# 获取tree-grid数据
def get_admin_menu_tree(request):
    _data = _BaseModuleController.get_admin_menu_tree()
    return HttpResponse(_data)

# 增加菜单
def add_menu(request):
    try:
        if request.method == 'POST':
            _sysmenu_form = SysMenuForm(request.POST)
            if _sysmenu_form.is_valid():
                # 先将父节点的isleaf属性改为false
                if (_sysmenu_form.cleaned_data['parentid'] != '' and _sysmenu_form.cleaned_data['parentid'] != None):
                    _father_menu = SysMenu.objects.get(id=_sysmenu_form.cleaned_data['parentid'])
                    _father_menu.isleaf = '0'
                    _father_menu.save()
                # 增加新的menu
                _sysmenu_form_model = _sysmenu_form.save(commit=False)
                _sysmenu_form_model.id = uuid.uuid1()
                _sysmenu_form_model.save()
                return HttpResponse("{'IsError':false,'ErrorMsg':'添加菜单成功!'}")
            else:
                return HttpResponse("{'IsError':true,'ErrorMsg':'验证错误!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'添加菜单异常!'}")

# 更改菜单
def udate_menu(request):
    try:
        if request.method == 'POST':
            # 修改menu
            _update_menu_model = SysMenu.objects.get(id=request.POST.get('id'))
            _udate_menu = SysMenuForm(request.POST, instance=_update_menu_model)
            _udate_menu.save()
            return HttpResponse("{'IsError':false,'ErrorMsg':'修改菜单成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'修改菜单异常!'}")

# 禁用菜单
def diable_menu(request):
    try:
        _menu_id =id=request.POST.get('ID')
        _menu = SysMenu.objects.get(id=_menu_id)
        _menu_children = SysMenu.objects.filter(parentid=_menu_id)
        # 子菜单都禁用
        for _menu_children_model in _menu_children:
            _menu_children_model.isvisiable='0'
            _menu_children_model.save()
        _menu.isvisiable = '0'
        _menu.save()
        return HttpResponse("{'IsError':false,'ErrorMsg':'禁用菜单成功!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'禁用菜单异常!'}")

# 启用菜单
def enabled_menu(request):
    try:
        _menu_id =id=request.POST.get('ID')
        _menu = SysMenu.objects.get(id=_menu_id)
        _menu_children = SysMenu.objects.filter(parentid=_menu_id)
        _menu_parent = SysMenu.objects.filter(id=_menu.parentid)
        # 子菜单启用菜单
        for _menu_parent_model in _menu_parent:
            _menu_parent_model.isvisiable='1'
            _menu_parent_model.save()
        # 子菜单启用菜单
        for _menu_children_model in _menu_children:
            _menu_children_model.isvisiable='1'
            _menu_children_model.save()
        _menu.isvisiable = '1'
        _menu.save()
        return HttpResponse("{'IsError':false,'ErrorMsg':'启用菜单成功!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'启用菜单异常!'}")

# 角色管理
# 获取角色
def get_roles(request):
    try:
        _page = request.GET.get('page')
        _limit = request.GET.get('limit')
        _data = _BaseModuleController.get_roles_page(_page, _limit)
        return HttpResponse(_data)
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'获取角色异常!'}")

# 更改角色
def update_roles(request):
    try:
        if request.method == 'POST':
            # 修改role
            _update_role_model = SysRole.objects.get(id=request.POST.get('id'))
            _udate_role = SysRoleForm(request.POST, instance=_update_role_model)
            _udate_role.save()
            return HttpResponse("{'IsError':false,'ErrorMsg':'修改角色成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'修改角色异常!'}")

# 新增角色
def add_roles(request):
    try:
        if request.method == 'POST':
            _sysrole_form = SysRoleForm(request.POST)
            if _sysrole_form.is_valid():
                # 增加新的角色
                _sysmenu_form_model = _sysrole_form.save(commit=False)
                _sysmenu_form_model.id = uuid.uuid1()
                _sysmenu_form_model.save()
                return HttpResponse("{'IsError':false,'ErrorMsg':'添加菜单成功!'}")
            else:
                return HttpResponse("{'IsError':true,'ErrorMsg':'验证错误!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'添加菜单异常!'}")

# 删除角色
@transaction.atomic
def delete_role(request):
    try:
        # 事务
        sid = transaction.savepoint()
        if request.method == 'POST':
            _role_id = request.POST.get('ID')
            # 先删除权限表里role对应的菜单 再删除roleuser表里role的用户信息 再删除role表里的记录
            SysUserRole.objects.filter(roleid=_role_id).delete()
            SysPrivilege.objects.filter(privilegemasterkey=_role_id, privilegemaster='role').delete()
            # raise #test
            SysRole.objects.get(id=_role_id).delete()
            transaction.savepoint_commit(sid)
            return HttpResponse("{'IsError':false,'ErrorMsg':'删除角色成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        # 回滚
        transaction.savepoint_rollback(sid)
        return HttpResponse("{'IsError':true,'ErrorMsg':'删除角色异常!'}")

# 获取用户列表
# 根据角色id获取用户列表
def get_user_by_role(request):
    try:
        _page = request.GET.get('page')
        _limit = request.GET.get('limit')
        _role_id = request.GET.get('roleid')
        _data = _BaseModuleController.get__user_by_role_page(_page, _limit, _role_id)
        return HttpResponse(_data)
    except:
        import sys
        s = sys.exc_info()
        print "Error '%s' happened on line %d" % (s[1], s[2].tb_lineno)
        return HttpResponse("{'IsError':true,'ErrorMsg':'获取用户异常!'}")

# 获取所有用户信息列表
def get_user_page(request):
    try:
        _page = request.GET.get('page')
        _limit = request.GET.get('limit')
        _data = _BaseModuleController.get_all_user_page(_page, _limit)
        return HttpResponse(_data)
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'获取用户异常!'}")

# 删除角色用户
def delete_user_role(request):
    try:
        _role_id = request.POST.get('roleID')
        _user_id = request.POST.get('userID')
        _success = _BaseModuleController.delete_user_role_controller(_role_id, _user_id)
        if (_success):
            return HttpResponse("{'IsError':false,'ErrorMsg':'删除成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'不存在删除对象,是否确定执行保存操作'}")
    except:
        import sys
        s = sys.exc_info()
        print "Error '%s' happened on line %d" % (s[1], s[2].tb_lineno)
        return HttpResponse("{'IsError':true,'ErrorMsg':'删除异常!'}")

# 增加用户角色信息
def add_user_role(request):
    try:
        _role_id = request.POST.get('RoleID')
        _data_id_list = json.loads(request.POST.get('data'))
        for _data_userid in _data_id_list:
            _ishas = _BaseModuleController.is_has_role_user(_role_id, _data_userid)
            if (not _ishas):
                _sys_user_role = SysUserRole()
                _sys_user_role.id = uuid.uuid1()
                _sys_user_role.userid = _data_userid
                _sys_user_role.roleid = _role_id
                _sys_user_role.save()
        return HttpResponse("{'IsError':false,'ErrorMsg':'新增角色用户成功!'}")
    except:
        import sys
        s = sys.exc_info()
        print "Error '%s' happened on line %d" % (s[1], s[2].tb_lineno)
        return HttpResponse("{'IsError':true,'ErrorMsg':'新增角色用户异常!'}")

# 角色菜单
# 获取角色菜单tree的数据
def get_role_menu_tree(request):
    _role_id = request.GET.get('roleid')
    _data = _BaseModuleController.get_role_menu_tree_json(_role_id)
    return HttpResponse(_data)

# 保存角色菜单权限
def save_role_menu_permission(request):
    try:
        if request.method == 'POST':
            _data_json_menu_ids = json.loads(request.POST.get('DataJSON'))
            _role_id = request.POST.get('roleid')
            _BaseModuleController.sava_role_menu(_role_id, _data_json_menu_ids)
            return HttpResponse("{'IsError':false,'ErrorMsg':'保存角色菜单权限成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'保存角色菜单权限异常!'}")

# 用户管理
# 增加用户
def add_user(request):
    try:
        if request.method == 'POST':
            _sysuser_form = SysuserForm(request.POST)
            if _sysuser_form.is_valid():
                # 增加新的角色
                _sysuser_form_model = _sysuser_form.save(commit=False)
                _sysuser_form_model.id = uuid.uuid1()
                _username = _sysuser_form.cleaned_data['username']
                if _BaseModuleController.not_repeat_username(_username):
                    _sysuser_form_model.username =_username
                else:
                    return HttpResponse("{'IsError':true,'ErrorMsg':'用户名重复!'}")
                # sha256加密
                _sysuser_form_model.password = make_password(_sysuser_form.cleaned_data['password'], None, 'pbkdf2_sha256')
                _sysuser_form_model.save()
                return HttpResponse("{'IsError':false,'ErrorMsg':'增加用户成功!'}")
            else:
                return HttpResponse("{'IsError':true,'ErrorMsg':'验证错误!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'增加用户异常!'}")

# 修改用户信息
def edit_user(request):
    try:
        if request.method == 'POST':
            # 修改role 为了不显示密码 手写model修改属性
            _update_user_model = Sysuser.objects.get(id=request.POST.get('id'))
            _username = request.POST.get('username')
            if _update_user_model.username == _username:
                    _update_user_model.username =_username
            else:
                if _BaseModuleController.not_repeat_username(_username):
                    _update_user_model.username =_username
                else:
                    return HttpResponse("{'IsError':true,'ErrorMsg':'用户名重复!'}")
            _update_user_model.realname = request.POST.get('realname')
            _update_user_model.email = request.POST.get('email')
            _update_user_model.phone = request.POST.get('phone')
            _update_user_model.isdisabled = request.POST.get('isdisabled')
            _update_user_model.save()
            return HttpResponse("{'IsError':false,'ErrorMsg':'修改用户信息成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'修改用户信息异常!'}")

# 修改用户密码
def edit_user_pwd(request):
    try:
        if request.method == 'POST':
            _update_user_model = Sysuser.objects.get(id=request.POST.get('id'))
            _old_pwd = request.POST.get('oldpwd')
            _new_pwd = request.POST.get('newpwd')
            if (check_password(_old_pwd, _update_user_model.password)):
                _update_user_model.password =  make_password(_new_pwd, None, 'pbkdf2_sha256')
                _update_user_model.save()
                return HttpResponse("{'IsError':false,'ErrorMsg':'修改用户密码成功!'}")
            else:
                return HttpResponse("{'IsError':true,'ErrorMsg':'用户旧密码验证错误!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        return HttpResponse("{'IsError':true,'ErrorMsg':'修改用户密码异常!'}")

# 删除用户
@transaction.atomic
def delete_user(request):
    try:
        # 事务
        sid = transaction.savepoint()
        if request.method == 'POST':
            _user_id = request.POST.get('ID')
            # 先删除roleuser表里user的用户信息 再删除user表里的记录
            SysUserRole.objects.filter(userid=_user_id).delete()
            # raise #test
            Sysuser.objects.get(id=_user_id).delete()
            transaction.savepoint_commit(sid)
            return HttpResponse("{'IsError':false,'ErrorMsg':'删除用户成功!'}")
        else:
            return HttpResponse("{'IsError':true,'ErrorMsg':'get请求错误!'}")
    except:
        # 回滚
        transaction.savepoint_rollback(sid)
        return HttpResponse("{'IsError':true,'ErrorMsg':'删除用户异常!'}")