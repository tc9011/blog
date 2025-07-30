---
title: ceph集群部署不完全指南
published: 2018-12-28 20:41:03
tags: 
  - ceph
toc: true
lang: zh
---

![1](../_images/ceph集群部署不完全指南/1.png)

<!--more-->

Ceph是一个统一的分布式存储系统，设计初衷是提供较好的性能、可靠性和可扩展性。

Ceph项目最早起源于Sage Weil就读博士期间的工作（最早的成果于2004年发表），并随后贡献给开源社区。在经过了数年的发展之后，目前已得到众多云计算厂商的支持并被广泛应用。RedHat及OpenStack都可与Ceph整合以支持虚拟机镜像的后端存储。

Ceph是一个横向扩展系统：它被设计为先天无单点失效问题，可以扩展到无限个节点，并且节点之间没有耦合关系（无共享架构），而传统存储系统控制器之间总有一些组件是共享的（缓存、磁盘）。

Ceph使用Crush算法对数据进行自动化组织管理。Crush算法负责数据对象在集群内的智能分布，随后使用集群节点作为数据的管理器。

ceph 部署的时候根据[官网](http://docs.ceph.org.cn/start/hardware-recommendations/)建议：

* 机械硬盘最小为1T
* 磁盘越大，单位GB的存储空间越小，但是需要的内存越多，尤其是在recovery,backfill以及reblance时
* 不推荐将一个盘分多个区，再跑多个OSD进程
* 不推荐OSD和mon, 或者OSD和mds跑在同一个硬盘上
* 很多 slow osd的问题往往是由于对磁盘设备的过度使用，请使用专用的磁盘用于安装操作系统以及软件；专用的磁盘设备用于osd daemon, 专门的磁盘设备用于journal

所以一般 ceph 部署时，一个节点最好挂三块盘，一块盘装操作系统，一块存储 OSD 数据，一块存储 OSD 日志，而存储日志的盘最好是 SSD，以便提高性能。

这里因为某些原因，以三台单盘的机器部署 ceph 集群为例，具体配置如下：

* 系统：Ubuntu 16.04.5 LTS (GNU/Linux 4.4.0-117-generic x86_64)
* IP 地址及 hostname：

|      ip       |  hostname   |
| :-----------: | :---------: |
| 172.19.217.71 | Ceph-master |
| 172.19.217.72 | Ceph-node1  |
| 172.19.217.73 | Ceph-node2  |

* 磁盘状态：

```bash
$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
vda    253:0    0  400G  0 disk
`-vda1 253:1    0  400G  0 part /
```

### 设置免密登录

选定一个节点作为主控节点（这里选的`172.19.217.71`主机），建立从主控节点到其他节点的免密登录。

生成秘钥：

```bash
$ ssh-keygen
```

拷贝秘钥：

```bash
$ ssh-copy-id root@172.19.217.72 
$ ssh-copy-id root@172.19.217.73
```

修改使hostname和ip对应:

在 `/etc/hosts` 里追加以下信息:

```bash
172.19.217.71   Ceph-master
172.19.217.72   Ceph-node1
172.19.217.73   Ceph-node2
```

### 安装ntp服务（所有节点）

主要是用于ceph-mon之间的时间同步。在所有 Ceph 节点上安装 NTP 服务（特别是 Ceph Monitor 节点），以免因时钟漂移导致故障。确保在各 Ceph 节点上启动了 NTP 服务，并且要使用同一个 NTP 服务器。

```bash
$ sudo apt install ntpdate
$ service ntp stop
$ ntpdate ntp.ubuntu.com
$ service ntp start
```

### 添加ceph用户（所有节点）

1、在各 Ceph 节点创建新用户

```bash
$ sudo useradd -d /home/ceph -m ceph
```

2、确保各 Ceph 节点上新创建的用户都有 sudo 权限

```bash
$ echo "ceph ALL = (root) NOPASSWD:ALL" | tee /etc/sudoers.d/ceph

$ chmod 0440 /etc/sudoers.d/ceph 
```

**tips**: 这里虽然添加了 ceph 用户, 但是最后安装时并没有用 ceph 用户来安装， 而是采用 root 用户安装

### 添加ceph安装源（所有节点）

```bash
$ wget -q -O- 'http://mirrors.163.com/ceph/keys/release.asc' | apt-key add -

$ echo deb http://mirrors.163.com/ceph/debian-jewel/ $(lsb_release -sc) main | tee /etc/apt/sources.list.d/ceph.list
```

### 安装ceph-deploy部署工具(仅主控节点)

更新仓库，并安装 ceph-deploy：

```bash
$ apt update
$ apt install ceph-deploy
```

### ceph安装(仅主控节点)

#### 创建部署目录

```bash
$ mkdir ceph-cluster && cd ceph-cluster/
```

#### 配置新节点

```bash
$ ceph-deploy new Ceph-master Ceph-node1 Ceph-node2
```

配置完后，目录下会有如下几个文件

```bash
$ ls
ceph.conf  ceph-deploy-ceph.log  ceph.mon.keyring 
```

#### 安装

```bash
$ ceph-deploy install Ceph-master Ceph-node1 Ceph-node2
```

都出现如下输出表示安装成功：

```bash
Running command: ceph --version
ceph version 10.2.11 (e4b061b47f07f583c92a050d9e84b1813a35671e)
```

### 配置并启动 ceph-mon(仅主控节点)

```bash
$ ceph-deploy mon create-initial
```

至此，ceph集群的安装工作完毕。

运行 `ceph -s`可以看到当前集群的状态，运行`ceph health`查看 ceph health 的状态：

```bash
HEALTH_OK
```

health 状态应该是 `HEALTH_OK`，如果有`no osds`的 error，只需按照下面方法添加 osd即可，如果有其他`HEALTH_ERROR`，可以参照下面的解决办法去解决。

#### ceph 鉴权文件分发到各个节点

```bash
$ ceph-deploy admin Ceph-master Ceph-node1 Ceph-node2
```

#### OSD HEALTH不为 OK 的解决办法

* 如果碰到下面的 health err且文件系统是 ext4

```bash
$ ceph health
HEALTH_ERR 64 pgs are stuck inactive for more than 300 seconds; 64 pgs stuck inactive; 64 pgs stuck unclean
```

先用 Tips 中的方法去查看 log，如果 log 中有 filename too long 的 error，先编辑对应的 `ceph.conf`：

```bash
$ vim ceph.conf
```

在末尾添加：

```bash
osd_max_object_name_len = 256
osd_max_object_namespace_len = 64
filestore_xattr_use_omap = true # Just 4 ext4
```

然后运行下面命令：

```bash
$ ceph-deploy install Ceph-master Ceph-node1 Ceph-node2

$ ceph-deploy --overwrite-conf admin Ceph-master Ceph-node1 Ceph-node2

$ ceph-deploy --overwrite-conf mon create-initial
```

* 如果碰到`too few PGs per OSD (21 < min 30)`的 warning，先查看 pool：

```bash
$ sudo ceph osd lspools
0 rbd,
```

查看 rbd pool 的 pgs 和 pgps以及副本数:

```bash
$ sudo ceph osd pool get rbd pg_num
pg_num: 64

$ sudo ceph osd pool get rbd pgp_num
pgp_num: 64

$ ceph osd dump | grep 'replicated size'
pool 0 'rbd' replicated size 3 min_size 2 crush_ruleset 0 object_hash rjenkins pg_num 64 pgp_num 64 last_change 1 flags hashpspool stripe_width 0
```

健康的 pg_num 和 pgp_num 计算方法：

 关于pgmap的数目，**osd_num \*100 / replica_num**，**向上取2的幂**。比如15个osd，三备份，15 *100/3=500，得到pg_num = 512，线上重新设定这个数值时会引起数据迁移，请谨慎处理。

在这里，pgs为64，因为是3副本的配置，所以当有3个osd的时候，3 *100/3=100，得到pg_num = 128

解决办法：修改默认pool rbd 的 pgs 和 pgps:

```bash
$ sudo ceph osd pool set rbd pg_num 128
$ sudo ceph osd pool set rbd pgp_num 128
```

* 终极方法

删除 ceph 并清理环境，然后可能就好了~~具体方法见下面 Tips

### 添加 OSD(仅主控节点)

查看未分配分区：

```bash
$ fdisk -l
Disk /dev/vda: 400 GiB, 429496729600 bytes, 838860800 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x77ba45a4

Device     Boot Start       End   Sectors  Size Id Type
/dev/vda1  *     2048 838858751 838856704  400G 83 Linux

$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev             63G     0   63G   0% /dev
tmpfs            13G   15M   13G   1% /run
/dev/vda1       394G  9.8G  364G   3% /
tmpfs            63G     0   63G   0% /dev/shm
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs            63G     0   63G   0% /sys/fs/cgroup
overlay         394G  9.8G  364G   3% /var/lib/docker/overlay2/d64af4717c1a56cf37cf6ba00937888a376304627b0791f19d6e5e707e0165b5/merged
```

这里看到这台机器只有一块盘，所以我们通过目录创建 ceph osd(所有节点)：

```bash
$ rm -rf /var/lib/ceph/osd/ceph-0
$ mkdir -p /var/lib/ceph/osd/ceph-0
$ chown ceph:ceph /var/lib/ceph/osd/ceph-0
```

添加 OSD(仅主控节点)：

```bash
$ ceph-deploy osd create Ceph-master
$ ceph-deploy osd create Ceph-node1
$ ceph-deploy osd create Ceph-node2
```

这个命令相当于下面磁盘准备和启动 OSD 两条命令：

* 磁盘准备(仅主控节点)

```bash
$ ceph-deploy osd prepare Ceph-master:/var/lib/ceph/osd/ceph-0

$ ceph-deploy osd prepare Ceph-node1:/var/lib/ceph/osd/ceph-0

$ ceph-deploy osd prepare Ceph-node2:/var/lib/ceph/osd/ceph-0
```

* 启动 OSD(仅主控节点)

```bash
$ ceph-deploy osd activate Ceph-master:/var/lib/ceph/osd/ceph-0

$ ceph-deploy osd activate Ceph-node1:/var/lib/ceph/osd/ceph-0

$ ceph-deploy osd activate Ceph-node2:/var/lib/ceph/osd/ceph-0
```

### 添加 mds(仅主控节点)

为使用 CephFS 添加 mds, 如果不用 CephFS 可以不添加。 此处只在 master 上添加一个 mds

```bash
$ ceph-deploy mds create Ceph-master
```

### 配置 mgr

ceph 12.0之后必须配置 manager, 且最好有 moniter 的机器上都部署 mgr：

```bash
$ ceph-deploy mgr create Ceph-master
$ ceph-deploy mgr create Ceph-node1
$ ceph-deploy mgr create Ceph-node2
```

因为部署的 ceph 版本是 10.2.11，所以这步可以略过。

配置完后用`ceph health`命令查看时，ceph 状态为 OK 则部署完成。

### Tips

#### 错误排查

查看 log：

```bash
$ cd /var/log/ceph
$ cat ceph-osd.0.log
```

#### 删除osd

```bash
$ ceph osd crush reweight osd.x 0.0  
$ ceph osd out osd.x  
$ service ceph stop osd.x
$ ceph osd crush remove osd.x  
$ ceph auth del osd.x  
$ ceph osd rm X
```

如果遇到`Error EBUSY: osd.0 is still up; must be down before removal.`可以执行下面命令强行标记为down，之后删除即可：

```bash
$ ceph osd down osd.0
$ ceph osd rm 0
```

#### 删除 ceph 并清理环境

```bash
#卸载ceph软件包
$ ceph-deploy purge Ceph-master Ceph-node1 Ceph-node2

#删除各种配置文件和生成的数据文件
$ ceph-deploy purgedata Ceph-master Ceph-node1 Ceph-node2
```

