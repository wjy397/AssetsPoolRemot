# -*- coding: utf-8 -*-
__author__ = 'wangjingyao'

# 遍历查询集 调用model属性转换成dict
def queryset_to_json(queryset):
        obj_arr=[]
        for o in queryset:
                obj_arr.append(o.toDict())
        return obj_arr