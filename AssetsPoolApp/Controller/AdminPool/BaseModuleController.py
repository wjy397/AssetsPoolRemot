# -*- coding: utf-8 -*-
__author__ = 'wangjingyao'
from AssetsPoolApp.Models.sys_models import *
from AssetsPoolApp.Models.UserModels import *
from django.core import serializers #序列化
import json #json序列化
from AssetsPoolApp.Controller import  tools
import uuid

class BaseModuleController:
    # 递归求menu adim权限
    def get_admin_menu(self,_permission):
        try:
            if _permission == 'root':
                # 排除不可用菜单
                _all_menu = SysMenu.objects.exclude(isvisiable='0')
            else:
                # user拥有的角色权限
                _userid_roids = SysUserRole.objects.filter(userid=_permission).values_list("roleid", flat=True)
                # 过滤禁用角色
                _userid_roids_able = SysRole.objects.filter(id__in=_userid_roids,isdisabled='0')
                # 角色权限拥有的菜单权限
                _uerid_roleids_menus = SysPrivilege.objects.filter(privilegemaster='role',privilegemasterkey__in = _userid_roids_able,privilegeaccess='SysMenu').values_list("privilegeaccesskey", flat=True).distinct()
                _all_menu = SysMenu.objects.filter(isvisiable='1',id__in =_uerid_roleids_menus)
            _first_menu = []
            for _menu in _all_menu:
                if(_menu.parentid == None or _menu.parentid ==''):
                      _first_menu.append(self.queryset_to_dict_recur(_menu,_all_menu))
                      continue
            # _json_data = serializers.serialize("json",_serialize_data)
            _serialize_success = {}
            _serialize_success['success'] = 'true'
            _serialize_success['menu'] = _first_menu
            _json_data = json.dumps(_serialize_success)
            return _json_data
        except:
            raise

    def queryset_to_dict_recur(self,_menu,_all_menu):
        if _menu.isleaf == '1':
            _leaf_menu = {}
            _leaf_menu['ID'] = _menu.id
            _leaf_menu['text'] = _menu.name
            _leaf_menu['url'] = _menu.url
            _leaf_menu['leaf'] = "true"
            return _leaf_menu
        else:
            _second_menu = {}
            _second_menu['ID'] = _menu.id
            _second_menu['text'] = _menu.name
            _second_menu['expanded']="true"
            _second_menu['leaf'] = "false"
            _recur_menu_list = []
            for _recur_menu in _all_menu:
                if(_recur_menu.parentid == _menu.id):
                    _recur_menu_list.append(self.queryset_to_dict_recur(_recur_menu,_all_menu))
            _second_menu['children'] = _recur_menu_list
            return _second_menu

    # 菜单管理
    # 菜单管理获取tree-grid数据
    def get_admin_menu_tree(self):
        try:
            _all_menu = SysMenu.objects.all()
            _first_menu = []
            for _menu in _all_menu:
                if(_menu.parentid == None or _menu.parentid ==''):
                      _first_menu.append(self.queryset_to_dict_recur_for_tree_grid(_menu,_all_menu))
                      continue
            _json_data = json.dumps(_first_menu)
            return _json_data
        except:
            raise

    def queryset_to_dict_recur_for_tree_grid(self,_menu,_all_menu):
        if _menu.isleaf == '1':
            _leaf_menu = {}
            _leaf_menu['ID'] = _menu.id
            _leaf_menu['ParentID'] = _menu.parentid
            _leaf_menu['Icon'] = _menu.icon
            _leaf_menu['Name'] = _menu.name
            _leaf_menu['MenuOrder'] = _menu.menuorder
            _leaf_menu['IsVisiable'] = _menu.isvisiable
            _leaf_menu['MenuNo'] = _menu.menuno
            _leaf_menu['URL'] = _menu.url
            _leaf_menu['IsLeaf'] = True
            _leaf_menu['Level'] = _menu.level
            _leaf_menu['leaf'] = True
            return _leaf_menu
        else:
            _second_menu = {}
            _second_menu['ID'] = _menu.id
            _second_menu['ParentID'] = _menu.parentid
            _second_menu['Icon'] = _menu.icon
            _second_menu['Name'] = _menu.name
            _second_menu['MenuOrder'] = _menu.menuorder
            _second_menu['IsVisiable'] =  _menu.isvisiable
            _second_menu['MenuNo'] = _menu.menuno
            _second_menu['URL'] = _menu.url
            _second_menu['IsLeaf'] = False
            _second_menu['Level'] = _menu.level
            _second_menu['leaf'] = False
            _recur_menu_list = []
            for _recur_menu in _all_menu:
                if(_recur_menu.parentid == _menu.id):
                    _recur_menu_list.append(self.queryset_to_dict_recur_for_tree_grid(_recur_menu,_all_menu))
            _second_menu['children'] = _recur_menu_list
            return _second_menu


    #角色管理
    # 获取角色分页列表
    def get_roles_page(self,_page,_limit):
        _roles = SysRole.objects.all()[(int(_page)-1)*int(_limit):int(_page)*int(_limit)]
        _count = SysRole.objects.all().count()
        # 将查询集里的model遍历 将model属性和属性值转成字典
        _dict_roles = tools.queryset_to_json(_roles)
        _data_page_json = {}
        _data_page_json['Rows']=_dict_roles
        _data_page_json['Total']=_count
        return json.dumps(_data_page_json,ensure_ascii=False)

    #获取所有用户信息列表
    def get_all_user_page(self,_page,_limit):
        _users = Sysuser.objects.all().order_by('id')[(int(_page)-1)*int(_limit):int(_page)*int(_limit)]
        _count = Sysuser.objects.all().count()
        # 将查询集里的model遍历 将model属性和属性值转成字典
        _dict_users = tools.queryset_to_json(_users)
        _data_page_json = {}
        _data_page_json['Rows']=_dict_users
        _data_page_json['Total']=_count
        return json.dumps(_data_page_json,ensure_ascii=False)

    # 根据角色id获取用户列表
    def get__user_by_role_page(self,_page,_limit,_role_id):
        # 取字段values_list flat=True为单个显示 去掉为元祖显示
        _user_ids = SysUserRole.objects.all().filter(roleid=_role_id).values_list("userid", flat=True)
        _count = SysUserRole.objects.all().filter(roleid=_role_id).count()
        #  __in 条件的值
        _users = Sysuser.objects.filter(id__in=_user_ids)[(int(_page)-1)*int(_limit):int(_page)*int(_limit)]
        _dict_users = tools.queryset_to_json(_users)
        _data_page_json = {}
        _data_page_json['Rows']=_dict_users
        _data_page_json['Total']=_count
        return json.dumps(_data_page_json,ensure_ascii=False)

    # 删除角色用户
    def delete_user_role_controller(self,_role_id,_user_id):
        _role_id_delete = SysUserRole.objects.filter(userid=_user_id,roleid=_role_id)
        if(_role_id_delete.exists()):
            _role_id_delete[0].delete()
            return  True
        else:
            return False;

    #是否存在角色用户
    def is_has_role_user(self,_role_id,_user_id):
        _role_id_delete = SysUserRole.objects.filter(userid=_user_id,roleid=_role_id)
        if(_role_id_delete.exists()):
            return  True
        else:
            return False;

    # 获取角色菜单json数据
    def get_role_menu_tree_json(self,_role_id):
        try:
            _all_menu = SysMenu.objects.all()
            # 获取权限表里role对应的菜单id
            _all_check_menu_id = SysPrivilege.objects.filter(privilegemaster='role',privilegemasterkey=_role_id,privilegeaccess='SysMenu').values_list("privilegeaccesskey", flat=True)
            _wrap_json = {}
            _first_menu = []
            for _menu in _all_menu:
                if(_menu.parentid == None or _menu.parentid ==''):
                      # 将所有menu和role对应的菜单id传入递归
                      _first_menu.append(self.queryset_to_dict_recur_for_role_menu_tree_json(_menu,_all_menu,_all_check_menu_id))
                      continue
            _wrap_json['children']=_first_menu
            _json_data = json.dumps(_wrap_json)
            return _json_data
        except:
            raise
    # 递归
    def queryset_to_dict_recur_for_role_menu_tree_json(self,_menu,_all_menu,_all_check_menu_id):
        if _menu.isleaf == '1':
            _leaf_menu = {}
            _leaf_menu['ID'] = _menu.id
            _leaf_menu['text'] = _menu.name
            _leaf_menu['checked'] = False
            # 判断此menu是否是权限表里role对应的菜单
            for check_id in _all_check_menu_id:
                if(_menu.id==check_id):
                    _leaf_menu['checked'] = True
            _leaf_menu['expanded'] = True
            _leaf_menu['leaf'] = True
            return _leaf_menu
        else:
            _second_menu = {}
            _second_menu['ID'] = _menu.id
            _second_menu['text'] = _menu.name
            _second_menu['expanded'] = True
            _second_menu['checked'] = False
            for check_id in _all_check_menu_id:
                if(_menu.id==check_id):
                    _second_menu['checked'] = True
            _second_menu['leaf'] = False
            _recur_menu_list = []
            for _recur_menu in _all_menu:
                if(_recur_menu.parentid == _menu.id):
                    _recur_menu_list.append(self.queryset_to_dict_recur_for_role_menu_tree_json(_recur_menu,_all_menu,_all_check_menu_id))
            _second_menu['children'] = _recur_menu_list
            return _second_menu

    # 保存角色菜单权限
    def sava_role_menu(self,_role_id,_data_json_menu_ids):
        # 先删除全部角色菜单权限
        _all_role_menu = SysPrivilege.objects.filter(privilegemaster='role',privilegemasterkey=_role_id)
        _all_role_menu.delete()
        for menu_id in _data_json_menu_ids:
            _sys_privilege = SysPrivilege()
            _sys_privilege.id=uuid.uuid1()
            _sys_privilege.privilegemaster='role'
            _sys_privilege.privilegemasterkey=_role_id
            _sys_privilege.privilegeaccess='SysMenu'
            _sys_privilege.privilegeaccesskey=menu_id
            _sys_privilege.save()

    #判断用户名是否重复
    def not_repeat_username(self,_username):
        _username_count = Sysuser.objects.filter(username =_username).count()
        if _username_count != 0:
            return False
        else:
            return True