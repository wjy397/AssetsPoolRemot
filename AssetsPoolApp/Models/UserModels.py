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
from django.forms import ModelForm
from django.db import models

class Sysuser(models.Model):
    id = models.CharField(db_column='ID', primary_key=True, max_length=50, blank=True, null=True)  # Field name made lowercase.
    username = models.CharField(db_column='UserName', max_length=50)  # Field name made lowercase.
    realname = models.CharField(db_column='RealName', max_length=50, blank=True, null=True)  # Field name made lowercase.
    password = models.CharField(db_column='PassWord', max_length=100, blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=50, blank=True, null=True)  # Field name made lowercase.
    phone = models.CharField(db_column='Phone', max_length=50, blank=True, null=True)  # Field name made lowercase.
    isdisabled = models.CharField(db_column='IsDisabled', max_length=1, blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    querycode = models.CharField(db_column='QueryCode', max_length=500, blank=True, null=True)  # Field name made lowercase.
    def __unicode__(self):
		return self.username

    # 将属性和属性值转换成dict 列表生成式
    def toDict(self):
        return dict([(attr, getattr(self, attr)) for attr in [f.name for f in self._meta.fields]])

    class Meta:
        managed = False
        db_table = 'sysuser'

class SysuserForm(ModelForm):
    class Meta:
        model = Sysuser
        fields = '__all__'
