# -*- coding: utf-8 -*-
__author__ = 'wangjingyao'
from AssetsPoolApp.Models.UserModels import Sysuser

class UserController:
    def is_exit_user(self,_username):
        try:
            _user =  Sysuser.objects.filter(username=_username,isdisabled='0')
            if(not _user.exists()):
                return None
            else:
                return _user[0]
            return  _user
        except:
            raise