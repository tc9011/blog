---
title: 廖雪峰Git教程学习笔记
tags:
  - Git
  - 廖雪峰
published: 2016-12-15 23:07:27
toc: true
lang: zh
---


![201612148680654945a1bde216.png](../_images/廖雪峰Git教程学习笔记/201612148680654945a1bde216.png)

<!--more-->

粗略看过git方面的视频，工作之前自己写的代码量少，管理方便，git方面的知识也够用。但是最近工作的时候用git总是有各种问题，于是拿起廖雪峰老师的教程，开始撸一遍完整的。

## 创建版本库

git创建版本库很简单，只要用以下命令即可

```shell
$ mkdir tangcheng 	//创建文件夹
$ cd tangcheng		
$ git init			//创建版本库
```

完成后文件夹下面会有一个`.git`的隐藏目录，这是git的版本库。

## 版本库管理

### 工作区与暂存区

![20161214118240.jpeg](../_images/廖雪峰Git教程学习笔记/20161214118240.jpeg)

廖老师的这个图很清楚，工作区就是`tangcheng`这个文件夹，这个文件夹里面的`.git`隐藏目录就是版本库。

通过`git add`告诉git把文件添加到仓库，然后用`git commit`把文件提交到仓库。

`git commit`成功后git会记录你的修改，如果不`add`到暂存区，那就不会加入到`commit`中。可以多次`git add`文件，`git commit`一次提交多个文件。

### Git基本命令

`git status`可以参看仓库状态;

`git diff`可以参看difference，显示格式是Unix通用的diff格式;

`git log`可以显示从近到远的提交日志，日志中的一大串字母和数字的组合就是版本号。

`git reset --hard HEAD^`表示回退版本，上一个版本是`HEAD^`，上上一个版本就是`HEAD^^`，当然往上100个版本写100个`^`比较容易数不过来，所以写成`HEAD~100`。如果回退到上一个旧版本，当前的版本则会在log中删除，若要从上一个版本回退到已经删除的版本，需要在用回退命令的命令窗口中，通过版本号找回，例如`$ git reset --hard 3628164`，版本号没必要写全，前几位就可以了，Git会自动去找。当然也不能只写前一两位，因为Git可能会找到多个版本号，就无法确定是哪一个了。

若上一段中的用回退命令的命令窗口已经关闭，可以用`git reflog`来查看你每一次的命令和对应操作的版本号。

`git checkout -- tangcheng.txt`意思就是，把`tangcheng.txt`文件在工作区的修改（包括删除文件的操作）全部撤销，就是让这个文件回到最近一次`git commit`或`git add`时的状态。**命令中的`--`很重要，没有`--`，就变成了“切换到另一个分支”的命令**。

`git reset HEAD file`可以把暂存区的修改撤销掉（unstage），重新放回工作区

`git rm`从版本库中删除文件。

## 远程仓库

把本地仓库的内容推送到GitHub仓库，在本地的`tangcheng`仓库下运行命令：

```sh
$ git remote add origin git@github.com:tangcheng/tangcheng.git
```

添加后，远程库的名字就是`origin`，这是Git默认的叫法，也可以改成别的，但是`origin`这个名字一看就知道是远程库。



`$ git push -u origin master`是把当前分支`master`推送到远程。

由于远程库是空的，我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。



```shell
$ git clone git@github.com:tangcheng/tangcheng.git
```

克隆一个本地库。GitHub给出的地址不止一个，还可以用`https://github.com/tangcheng/tangcheng.git`这样的地址。实际上，Git支持多种协议，默认的`git://`使用ssh，但也可以使用`https`等其他协议。使用`https`除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放http端口的公司内部就无法使用`ssh`协议而只能用`https`。

## 分支管理

```shell
$ git checkout -b dev
```

`git checkout`命令加上`-b`参数表示创建并切换，相当于以下两条命令：

```shell
$ git branch dev
$ git checkout dev
```

用`git branch`命令查看当前分支。

`git branch`命令会列出所有分支，当前分支前面会标一个`*`号。



``` $ git merge dev```把`dev`分支的工作成果合并到`master`分支上，`git merge`命令用于合并指定分支到当前分支。



删除`dev`分支:

```sh
$ git branch -d dev
```



当Git无法自动合并分支时，就必须首先解决冲突。Git用`<<<<<<<`，`=======`，`>>>>>>>`标记出不同分支的内容。解决冲突后，再提交，合并完成。

用`git log --graph`命令可以看到分支合并图。



合并分支时，加上`--no-ff`参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而`fast forward`合并就看不出来曾经做过合并。如果要强制禁用`Fast forward`模式，Git就会在merge时生成一个新的commit，这样，从分支历史上就可以看出分支信息。

```sh
$ git merge --no-ff -m "merge with no-ff" dev
```

因为本次合并要创建一个新的commit，所以加上`-m`参数，把commit描述写进去。



修复bug时，我们会通过创建新的bug分支进行修复，然后合并，最后删除；

当手头工作没有完成时，先把工作现场`git stash`一下，然后去修复bug，修复后，再`git stash pop`，回到工作现场。



开发一个新feature，最好新建一个分支；

如果要丢弃一个没有被合并过的分支，可以通过`git branch -D `强行删除。



要查看远程库的信息，用`git remote`或者，用`git remote -v`显示更详细的信息。



推送分支：

```sh
$ git push origin master	//把master推送到远程分支
```



多人协作的工作模式通常是这样：

1. 首先，可以试图用`git push origin branch-name`推送自己的修改；
2. 如果推送失败，则因为远程分支比你的本地更新，需要先用`git pull`试图合并；
3. 如果合并有冲突，则解决冲突，并在本地提交；
4. 没有冲突或者解决掉冲突后，再用`git push origin branch-name`推送就能成功！

如果`git pull`提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，用命令`git branch --set-upstream branch-name origin/branch-name`。



## 标签管理

`git tag <name> `就可以打一个新标签。有commit为什么还要标签呢，因为commit是很长一串数字和字母的组合，阅读性差。commit和tag的关系类似于ip和域名。

用命令`git tag`查看所有标签。默认标签是打在最新提交的commit上的。标签不是按时间顺序列出，而是按字母排序的。

对特定的commit id打标签：

```sh
$ git tag v0.9 6224937
```



可以用`git show `查看标签信息



还可以创建带有说明的标签，用`-a`指定标签名，`-m`指定说明文字：

```sh
$ git tag -a v0.1 -m "version 0.1 released" 3628164
```



如果标签打错了，也可以删除：

```sh
$ git tag -d v0.1
Deleted tag 'v0.1' (was e078af9)
```



如果要推送某个标签到远程，使用命令`git push origin `：

```shell
$ git push origin v1.0
```

或者，一次性推送全部尚未推送到远程的本地标签：

```sh
$ git push origin --tags
```



命令`git push origin :refs/tags/`可以删除一个远程标签。

## 忽略特殊文件

在Git工作区的根目录下创建一个特殊的`.gitignore`文件，然后把要忽略的文件名填进去，Git就会自动忽略这些文件。不需要从头写`.gitignore`文件，GitHub已经为我们准备了各种配置文件，只需要组合一下就可以使用了。所有配置文件可以直接在线浏览：[https://github.com/github/gitignore](https://github.com/github/gitignore)

忽略文件的原则是：

1. 忽略操作系统自动生成的文件，比如缩略图等；
2. 忽略编译生成的中间文件、可执行文件等，也就是如果一个文件是通过另一个文件自动生成的，那自动生成的文件就没必要放进版本库，比如Java编译产生的`.class`文件；
3. 忽略你自己的带有敏感信息的配置文件，比如存放口令的配置文件。



`.gitignore`文件本身要放到版本库里，并且可以对`.gitignore`做版本管理。



你确实想添加该文件，可以用`-f`强制添加到Git：

```sh
$ git add -f App.class
```



`.gitignore`写得有问题，需要找出来到底哪个规则写错了，可以用`git check-ignore`命令检查



## 配置别名

我们只需要敲一行命令，告诉Git，以后`st`就表示`status`：

```sh
$ git config --global alias.st status
```

这样以后敲`git st`就表示`git status`

`--global`参数是全局参数，也就是这些命令在这台电脑的所有Git仓库下都有用。

每个仓库的Git配置文件都放在`.git/config`文件中，别名就在`[alias]`后面，要删除别名，直接把对应的行删掉即可。而当前用户的Git配置文件放在用户主目录下的一个隐藏文件`.gitconfig`中。



配置一个`git last`，让其显示最后一次提交信息：

```sh
$ git config --global alias.last 'log -1'
```

这样，用`git last`就能显示最近一次的提交：

```sh
$ git last
commit adca45d317e6d8a4b23f9811c3d7b7f0f180bfe2
Merge: bd6ae48 291bea8
Author: Michael Liao <askxuefeng@gmail.com>
Date:   Thu Aug 22 22:49:22 2013 +0800

    merge & fix hello.py
```

