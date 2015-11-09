# -*- coding: utf-8 -*-
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin sqlcustom [app_label]'
# into your database.
from __future__ import unicode_literals
import json
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup)
    permission = models.ForeignKey('AuthPermission')

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group_id', 'permission_id'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType')
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type_id', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser)
    group = models.ForeignKey(AuthGroup)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user_id', 'group_id'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser)
    permission = models.ForeignKey(AuthPermission)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user_id', 'permission_id'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', blank=True, null=True)
    user = models.ForeignKey(AuthUser)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoRedirect(models.Model):
    site = models.ForeignKey('DjangoSite')
    old_path = models.CharField(max_length=200)
    new_path = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'django_redirect'
        unique_together = (('site_id', 'old_path'),)


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class DjangoSite(models.Model):
    domain = models.CharField(max_length=100)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'django_site'


class SysMenu(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=50, blank=True, null=True)  # Field name made lowercase.
    menuno = models.CharField(db_column='MenuNo', max_length=50)  # Field name made lowercase.
    parentid = models.CharField(db_column='ParentID', max_length=50, blank=True, null=True)  # Field name made lowercase.
    menuorder = models.CharField(db_column='MenuOrder', max_length=50, blank=True, null=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=200)  # Field name made lowercase.
    icon = models.CharField(db_column='Icon', max_length=500, blank=True, null=True)  # Field name made lowercase.
    url = models.CharField(db_column='URL', max_length=500, blank=True, null=True)  # Field name made lowercase.
    isleaf = models.CharField(db_column='IsLeaf', max_length=1)  # Field name made lowercase. This field type is a guess.
    isvisiable = models.CharField(db_column='IsVisiable', max_length=1)  # Field name made lowercase. This field type is a guess.
    level = models.IntegerField(db_column='Level')  # Field name made lowercase.

    def __unicode__(self):
        return self.name
		
    class Meta:
        managed = False
        db_table = 'sys_menu'


class SysPrivilege(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=50)  # Field name made lowercase.
    privilegemaster = models.CharField(db_column='PrivilegeMaster', max_length=100, blank=True, null=True)  # Field name made lowercase.
    privilegemasterkey = models.CharField(db_column='PrivilegeMasterKey', max_length=50, blank=True, null=True)  # Field name made lowercase.
    privilegeaccess = models.CharField(db_column='PrivilegeAccess', max_length=100, blank=True, null=True)  # Field name made lowercase.
    privilegeaccesskey = models.CharField(db_column='PrivilegeAccessKey', max_length=50, blank=True, null=True)  # Field name made lowercase.
    privilegeoperation = models.CharField(db_column='PrivilegeOperation', max_length=100, blank=True, null=True)  # Field name made lowercase.
    recordstatus = models.CharField(db_column='RecordStatus', max_length=100, blank=True, null=True)  # Field name made lowercase.
	
    def __unicode__(self):
        return self.id
    class Meta:
        managed = False
        db_table = 'sys_privilege'


class SysRole(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=50, blank=True, null=True)  # Field name made lowercase.
    rolename = models.CharField(db_column='RoleName', max_length=50)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=200, blank=True, null=True)  # Field name made lowercase.
    querycode = models.CharField(db_column='QueryCode', max_length=200, blank=True, null=True)  # Field name made lowercase.
    isdisabled = models.CharField(db_column='IsDisabled', max_length=1)  # Field name made lowercase. This field type is a guess.
	
    def __unicode__(self):
        return self.rolename
    # 将属性和属性值转换成dict 列表生成式
    def toDict(self):
        return dict([(attr, getattr(self, attr)) for attr in [f.name for f in self._meta.fields]])#type(self._meta.fields).__name__
    class Meta:
        managed = False
        db_table = 'sys_role'


class SysUserRole(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=50)  # Field name made lowercase.
    roleid = models.CharField(db_column='RoleID', max_length=50)  # Field name made lowercase.
    userid = models.CharField(db_column='UserID', max_length=50)  # Field name made lowercase.

    def __unicode__(self):
        return self.id
	
    class Meta:
        managed = False
        db_table = 'sys_user_role'

from django.forms import ModelForm
# modelForm
class SysMenuForm(ModelForm):
    class Meta:
        model = SysMenu
        fields = '__all__'

class SysRoleForm(ModelForm):
    class Meta:
        model = SysRole
        fields = '__all__'
