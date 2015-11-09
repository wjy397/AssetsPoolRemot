# -*- coding: utf-8 -*-
__author__ = 'wangjingyao'

from django.conf.urls import include, url
from AssetsPoolApp.Views.viewsBaseMoudule import *


basemodule_urlpatterns = [
    # 获取主页左侧导航栏菜单
    url(r'^GetMenuTreeJson$', getMenuTreeJson),
    #菜单管理
    url(r'^GetMenuTreeGridJson$', get_admin_menu_tree),
    url(r'^UpdateMenu$', udate_menu),
    url(r'^AddMenu$', add_menu),
    url(r'^EnabledMenu$', enabled_menu),
    url(r'^DisableMenu$', diable_menu),
    #角色管理
    url(r'^GetRoles$', get_roles),
    url(r'^UpdateRole$', update_roles),
    url(r'^AddRole$', add_roles),
    url(r'^DeleteRole$', delete_role),
    url(r'^GetUsersPaged$', get_user_page),
    url(r'^DeleteUserRole$', delete_user_role),
    url(r'^GetUserByRole$', get_user_by_role),
    url(r'^AddUserRole$', add_user_role),
    url(r'^GetRoleMenuTreeData$', get_role_menu_tree),
    url(r'^SaveRolePermission$', save_role_menu_permission),
    #用户管理
    url(r'^SaveRolePermission$', save_role_menu_permission),
    url(r'^AddUser$', add_user),
    url(r'^EditUser$', edit_user),
    url(r'^EditUserPwd$', edit_user_pwd),
    url(r'^DeleteUser$', delete_user),




]