---
title: Ubuntu Server 18.04.3 搭建Samba文件服务
categories:
  - 技术
color: '#111'
thumbnail: ./cover.jpg
date: 2019-09-20 09:48:32
tags:
  - linux
  - ubuntu
  - samba
  - 文件服务
keywords:
  - ubuntu搭建samba文件服务
  - Linux文件服务
  - 文件共享
  - 内网共享工作组
---

最近公司在终端设备上调试软件的时候有诸多不便，看到工程师小哥哥拿着 U 盘到处跑。回头一看，公司还有几台闲置电脑，便想着装个文件服务，供团队开发测试使用。服务器系统使用`ubuntu server 18.04.3`，系统安装非常简单，不再赘述。

<!-- more -->

## samba 安装

```shell
sudo apt-get install -y samba samba-common
```

## 创建用户

不建议直接使用`root`用户进行文件共享，创建一个`share`用户，并为其分配`/home/share`目录。同时，也会把`/home/share`目录设置为文件共享目录。

```shell
# 1. 创建工作用户组
groupadd work
# 2. 创建用户，并添加到工作用户组
# 参数说明
# m: 自动创建用户目录
# g: 添加到用户组
# s: 制定用户的shell
useradd -m -g work -s /bin/bash share
# 3. 将用户添加到samba并设置密码
sudo smbpasswd -a share
```

## 配置 samba

`samba`配置文件路径为`/etc/samba/smb.conf`，在末尾添加配置

```conf
[share]
  comment = work share
  path = /home/share
  browseable = yes
  valid users = share
  read only = no
  guest ok = no
```

重启`samba`

```shell
sudo service smbd restart
```

之后便可以使用`share`用户访问文件服务器。
