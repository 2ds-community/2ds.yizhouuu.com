---
layout: ../layouts/DocsLayout.astro
title: 面向新手的使用鹊桥搭建 MC 服务器 QQ 互联指南
description: 手把手从零搭建互联
---

# 面向新手的使用鹊桥搭建 MC 服务器 QQ 互联指南

本文是一份面向新手的使用鹊桥搭建 MC <> QQ 互联指南，并以全新的、无图形界面的 Linux（Debian 13）进行演示。

本文主要使用的软件有 [Napcat](https://napneko.github.io)、[Nonebot](https://nonebot.dev) 和 [鹊桥](https://queqiao-docs.pages.dev)。

**Napcat** 是一款运行在命令行中的“QQ客户端”。它将消息接发等功能暴露给其他软件，开发者得以将自己的功能接入 QQ

**Nonebot** 是一款专门的机器人软件，负责机器人的逻辑处理，是实现机器人具体功能的软件。我们将 Napcat 接入 Nonebot，便让 Nonebot 有了操控 QQ 的能力

**鹊桥** 是一款安装在 Minecraft 服务器中的模组/插件。顾名思义，其作为是为 Minecraft 搭起一座与外部世界沟通的桥梁。我们将鹊桥接入 Nonebot，就可以让机器人将消息转发到 Minecraft，亦可将消息转发回 QQ

---

## 一、Napcat 的安装与配置

Napcat 的官方下载页为：https://napneko.github.io/guide/install

Windows 端推荐选择 Napcat.Win.一键版本。官方教程[点这里](https://napneko.github.io/guide/boot/Shell#napcat-win-%E4%B8%80%E9%94%AE%E7%89%88%E6%9C%AC)  
Linux 端推荐选择 AppImage 版本。官方教程[点这里](https://napneko.github.io/guide/boot/Shell#napcat-appimage)  
Mac 和 Termux 端建议选择 Docker 版本。官方教程[点这里](https://napneko.github.io/guide/boot/Shell#napcat-docker-linux%E5%AE%B9%E5%99%A8%E5%8C%96%E9%83%A8%E7%BD%B2)

### 1. 安装 Napcat

本文演示用的系统是 Linux Debian，因此选择 AppImage 版本。使用上述链接

![image-20260517191449052](/docs/queqiao.assets/image-20260517191449052.png)

阅读完官方介绍后，发现下载链接在 [AppImage 仓库](https://github.com/NapNeko/NapCatAppImageBuild/releases)

![image-20260517191923320](/docs/queqiao.assets/image-20260517191923320.png)

除非特殊情况，否则直接选择 `.amd64.AppImage` 结尾的文件下载即可。通过下载页提示，我们需要先安装 `fuse` 和 `xvfb` 库作为前置。同时，为了方便从网络上直接将软件下载到服务器，我们再安装一个 `wget` 工具

让我先处理前置：

```shell
sudo apt update # 更新软件仓库，尤其是刚安装的系统，一定要进行一次 update
sudo apt install -y fuse xvfb wget 
```

你可以直接将这两行一起复制到终端并按下回车执行。可能会提示你输入密码，输入后按下回车继续执行即可

![image-20260517195846043](/docs/queqiao.assets/image-20260517195846043.png)

安装完前置后，我们来安装 Napcat。首先，我们先前往我们的`家目录`，在这里创建一个用来放置机器人相关软件、文件的目录，例如叫 `bot`。然后再在 `bot` 目录下建一个叫 `napcat` 的目录用来放 Napcat。

```shell
cd # 前往自己的家目录
mkdir bot # 在当前路径下创建名为 bot 的目录
cd bot # 前往当下路径下的 bot 目录
mkdir napcat
cd napcat
```

然后，我们进入创建好的 `napcat` 目录，将 Napcat 的 AppImage 文件下载下来，并给予运行权限。我们不直接在自己的电脑上下载 napcat 程序，而是复制其链接，并在服务器上直接下载

![image-20260517200646364](/docs/queqiao.assets/image-20260517200646364.png)

```shell
wget https://v6.gh-proxy.org/https://github.com/NapNeko/NapCatAppImageBuild/releases/download/v4.18.2/QQ-44343_NapCat-v4.18.2-amd64.AppImage
# 该处链接仅作演示。Napcat 更新频率高，请尽量用最新版的 Napcat，否则可能出现登录异常等问题。
# 本链接使用了 gh-proxy.com 的反代，以便在大陆机器上安装，只需要在原始的链接前加上 v6.ghproxy.org/ 即可。
# 详情请查阅 gh-proxy.com 官网。我们不为该服务负责
chmod +x QQ-44343_NapCat-v4.18.2-amd64.AppImage
# 该处文件名仅作演示。下载完成后，你只需要输入 QQ 的开头，再按 TAb，便会自动补全整个文件名
```

![image-20260517202308642](/docs/queqiao.assets/image-20260517202308642.png)

至此，Napcat 就成功安装好了。接下来我们需要将机器人账号登录上去

### 2. 在 Napcat 上登录机器人账号
