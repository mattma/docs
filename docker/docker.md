# Docker

## What is **docker**?

#### highlevel

**Docker** is a lightweight VM without the performance penalty of having a VM and runtime for linux containers which run in the same kernel as the host unvirtualized. own process space, own network interface, can run stuff as root, can have it’s own /sbin/init (different from the host). it is a machine container.

#### lowlevel
it can also not have its own /sbin/init,  has container, which is isolated process(es), share kernel with the host. it is a application container.

**Docker** create a lightweight, portable, self-sufficient containers virtualization from any application, build, pack, ship and run app as a lightweight containers (or create a run-time environment once), build once, configure once and run anywhere, isolated and content agnostic. It will run each app in its own isolated container, so you can run various versions of libraries and other dependencies.  Automate testings, integration, packaging. Everything that runs in that environment is isolated from the underlying host (much like a virtual machine). It will eliminate inconsistencies between dev, test, prod envrionment. “Dockerized” apps are completely portable and can run anywhere. Scale to 1000s of nodes, move between VMs, bare metal, OpenStack clusters, data centers, clouds, update with 0 downtime and more.

**Docker** containers are both hardware-agnostic and platform-agnostic. This means that they can run anywhere, from your laptop to the largest EC2 compute instance and everything in between - and they don't require that you use a particular language, framework or packaging system.

Docker relies on a *copy-on-write* model so that making changes to your application is also incredibly fast. only what you want to change gets changed. *Copy-on-write* model: filesystems are created with copy-on-write, meaning they are layered and fast and require limited disk usage.

A docker container have its own ip address. It is a little of both - VM and process. It is like a process with an ip address.

**Docker** is a Linux-only tool developed in the Go language, and it builds on LinuX Containers (LxC) to create Virtual Environments (VE’s). A VE is a lite VM; A VM is created by a virtualizer tool or emulator (HyperV, VMWare, etc), and it is a full image of a source machine, including the OS, disk config, network and even virtual processors. The resulting bloated mass eats up quite a bit of disk space and is slow to deploy and start up.

By contrast, Docker relies on a different sandboxing method known as containerization. Unlike traditional virtualization, containerization takes place at the kernel level. Most modern OS kernels now support the primitives necessary for containerization, including Linux withopenvz, vserver and more recently lxc, Solaris with zones and FreeBSD with Jails. **Docker** builds on top of these low-level primitives to offer developers a portable format and runtime environment that solves all 4 problems. Docker containers are small (and their transfer can be optimized with layers), they have basically zero memory and cpu overhead, they are completely portable and are designed from the ground up with an application-centric design.

**Docker** solves dependency hell by giving the developer a simple way to express all their application's dependencies in one place, and streamline the process of assembling them. **Docker** isolating the OS from the kernel. It then creates a "level-zero" package from the kernel-machine baseline. Any subsequent changes are captured as snapshots called namespaces, and can be run in standalone containers as virtual systems. Snapshots capture only the changes from the "base template", not the full machine setup (unlike VM’s). From this point, namespaces are stored and can be installed on their own to create full environments on any Docker-ready host. Docker can be used to run short-lived commands, long-running daemons (app servers, databases etc.), interactive shell sessions, etc.

The best part: because Docker operates at the OS level, it can still be run inside a VM.

- Fork the container, track the history of the container, like the git commit, when push the images, only update/ship the diff in the new build of Application

- CI could run, build, test it, then create a new container, install dependencies, upload the code, compile them into final container, run tests, then ship to 100 servers. Instead of sending 100 VMs, only sending the diff.

- Stack Layers:  fat base systems => base system packages => Chef configs => Application Dependencies => Application.

- docker host won’t talk to any docker host. Via dependency injection to inject dependency into container, little redis database to know which one this container connect to


#### Different between Docker container VS VM

**VM** include app, binaries, libraries, entire OS (10G)

**Docker** containers are isolated, but share OS (Not include OS, relies on OS functionality provided by underlying infrastructure) and where appropriate, bins/libraries. Docker container include app, dependencies, runs as an isolated process in userspace on host OS, shared kernel with other containers. Benefits: resource isolation, allocation benefits of VMs.

Containers are to Virtual Machines as threads are to processes.

1. __Containers are not transient__.  `docker run` doesn't do what you think.

2. __Containers are not limited to running a single command or process.__  You can use [supervisord](http://docs.docker.io/examples/using_supervisord/) or [runit](https://github.com/phusion/baseimage-docker).

#### Recommended workflow

- each service will be in its own container(s)

- build an image for each service via `Dockerfile`

- pin dependencies(packages etc.) accurately

- link services together


#### What Docker has done when you do `docker run -it mattma/nodejs /bin/bash`

1. downloaded the image from docker repo

2. generated a new LXC container

3. created a new file system

4. mounted a read/write layer

5. allocated network interface

6. setup IP setup NATing

7. Executed the bash shell in the container

## Docker Features

- Extremely fast and elegant isolation framework

- Inexpensive

- Low CPU/memory overhead

- Fast boot/shutdown

- Cross cloud infrastructure

## Docker Goal

- wrap the whole environment into a single VM so upgrades were easy and the environment could be completely refreshed.

- the orchestration and automation components of docker dev environment 

## Docker Problems

