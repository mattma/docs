## Concept

Docker Engine, AKA Docker Daemon, or Docker Runtime

Docker Engine:        Shipping yard
Docker Images:       Manifests, (need an image to launch a container)
Docker Containers:  Shipping containers (running instance of the image in runtime, barebone minimal to provide runtime feature, not full featured OS). Runtime Struct


docker provide a static container runtime. Docker engine uses **libcontainer** as the default. Micro-service is the future.

Docker engine used to depend on **LXC**, but Docker wants to have a full control, so that it starts a **libcontainer** project, it is a drop-in replacement for **LXC**, it talks to operating system (Linux Kernel) like **Namespaces**, **cgroups**, **Capabilities**, etc. Then the bottom layer, it is Physical or Virtual server.

Container name could be `[a-zA-Z0-9_-]`

- Images

A single image conprised from multiple layers of images. Here is from bottom(1) and up(to 3)
ex: 3 layers is comprised one image.

1. Base Image (Rootfs)   Root file system, bare minimal OS.
2. Layer 1    nginx
3. Layer 2    some updates

If you need add more stuffs, simple add another new layer. Each layer has an image ID, list inside our Docker one image. Plus some metadata tell Docker how to build up a container. The top one image is comprise all layers data. Higher layer will always win when there is any conflict. Image layering is accomplished through **union mounts** which allow multiple file system on top of each other.

- Containers

Docker build up container by arranging each image layers structed by the image metadata. One per container, a thin writable layer. It all goes to this top thin layer, initial empty, will grow and occpy space.

Note: `rootFs` is never writable. locked for readonly. Union mount create this thin writable layer, look like a system read/write. It is the main difference between container and full OS.

In general, One process per container. Great for micro service concept.

#### Tips

Exit from running container, by `ctrl + p + q`, get us back to the docker host machine

#### Commands

- docker pull

store them in local box. Images stored locally under `/var/lib/docker/<storage driver>`.  in **ubuntu**, storage driver is `aufs`

`docker pull fedora`   it will only pull fedora with tag **latest**
`docker pull -a fedora`   it will pull all fedora tags including **latest**

```bash
# image id are the same, it means Tag 0.9.16 is the latest tag. They are the same.
repository                  Tag                Image ID
phusion/baseimage   0.9.16            5a14c1498ff4        4 weeks ago         279.7 MB
phusion/baseimage   latest              5a14c1498ff4        4 weeks ago         279.7 MB
```

- docker images

`docker images mattma/iojs`   show the list (tags) of mattma/iojs image in this box

images is stack of layers using union mounts. `aufs` is the default union mount implementation for ubuntu which running docker. the only very top layer is writable, all changes at runtime applied to top layer.

`docker image --tree`  show how each image's layers how it linked.

Can be looked around the Docker system to see images, diffs etc in `ls -lash /var/lib/docker/aufs/`

How to manually copy image to another host?

```bash
docker save -o /tmp/ImageName.tar ImageName
tar -tf /tmp/ImageName.tar  # not needed, just to show
docker load -i /tmp/ImageName.tar
```

- docker commit

`docker commit <image-id> ImageName` create a new image based on that commit hash id. If you are giving a tag, it will auto give a latest tag.

`docker history ImageName` to see how this image is being created


- docker top

`docker top ImageId` allow to see what process is running inside a container

- docker inspect

get details info about this container

#### Options

-H, --host=[]:
The socket(s) to bind to in daemon mode or connect to in client mode, specified using one or more tcp://host:port, unix:///path/to/socket, fd://* or fd://socketfd.

```bash
# listening tcp port in daemon mode. use `&` get control back
docker -H 192.168.56.50:2375 -d
# TCP network listening program
netstat -tlp
```

```bash
# see all the uid docker container
ls -l /var/lib/docker/aufs/diff
# can actually access the container content through this way, need root permission
ls -l /var/lib/docker/aufs/diff/f8a621ea6abf9cd72b3e17948a94e41a0594295dbad29472bc14c4ef1996d35d/tmp/testfile
```


ctrl+p+q  exit the running container to the container host machine (detaching)

docker stop, docker kill  would send signal to `Containers PID1` to determine what to do

PID 1 = docker run …. <command>  # PID1 = command

running container binary is actually the PID 1 process of the current container

Basic rule:

one process per container
one concern per container
lean
simple

docker ps PID is different when access from host machine, from inside of the running docker container. PID 1 is the init step  (ps -ef)

docker inspect   will load up two different json files, location of those two
1. /var/lib/docker/containers/<container_id>/config.json
1. /var/lib/docker/containers/<container_id>/hostconfig.json


Docker ps will show the running container info, PORTS: 0.0.0.0:49154->80/tcp  means docker container expose its port 80/tcp to the host machine port 49154


Access running container

1. nsenter

allows us to enter Namespace, requires the containers PID (get from `docker inspect`)

```bash
docker inspect <container_id> | grep Pid
nsenter -munpit <container_Pid> /bin/bash  # mount, utf, network, process, ipc, target namespace
```

How to get `nsenter` on your host

```bash
docker run -v /usr/local/bin:/target jpetazzo/nsenter  # install nsenter to /target & install docker-enter to /target
```

It does not work like `docker attach`, it does not modify the docker container Pid.

2. docker-enter <container_id>

works like `nsenter`

3. docker exec -it <container_id> /bin/bash

This is the recommended way to go




Commands

1. docker version

get all the version info about docker client, docker server, and all related package version

2. docker info

a snapshot of current host, numbers of containers, images layers (docker images --tree # show layering), Execution-Driver: native-0.2 (<= LibContainer, Not a LXC)

3. docker history

give back the command that used when each image layer is being created.


Dockerfile

1. difference on image layering, in general speaking, less image layers are better

```bash
# only generate one image layer
RUN apt-get update && apt-get install -y \
    apache2 \
    traceroute

# genearte three image layers
RUN apt-get update
RUN apt-get install -y apache2
RUN apt-get install -y traceroute
```

#### Dockerfile

It is a plain-text file with simple format, contain instruction to build image, get write one at the time from top to bottom

Every RUN instruction adds a new layer to our image

Docker daemon is doing the build, not docker client. In local box, running docker daemon and docker cilent on the same machine. Docker client could talk to remote docker daemon

In each Docker build commit, it will throw away intermediate Container layer, and keep image layer


#### Docker hub

1. create a new repo on the Docker hub
2. go into the docker client

```bash
# REPOSITORY name could be different than `docker_hub_repo_name`
# IMAGE ID name has to match what is in the `docker_hub_repo_name`
docker tag <image_id> <docker_hub_repo_name>:<version_number>
```
3. after you have done above, it will create a new image with <docker_hub_repo_name> and list inside `docker images`

4. Push to Docker registry, only new layer will be pushed.

```bash
docker push <docker_hub_repo_name>:<version_number>
```

#### Private Docker registry

Running V1 python based Docker registry, used one of the OS with Docker engine built-in. Spin up this way.

```bash
docker run -d -p 5000:5000 registry
```

DNS resolve registry, it becomes to name repo to use. In this one, running on port 5000. open in the browser, should see "docker-registry server"

Usage

```bash
docker tag <image_id> <dns_name:port_number>/<image_name>
docker push <dns_name:port_number>/<image_name>

# note here. set setting here does not need to setup  SSL
/etc/default/docker
DOCKER_OPTS="--insecure-registry <dns_name:port_number>"
```

#### Dockerfile

1. Docker cache

When build from the daemon, docker daemon execute each instruction, it checks if it is existed in the build cache, use image cache.

CMD

it is only exeucted in Run-Time, run commands in containers at launch time. One CMD per Dockerfile
"Shell Form" could do variable expansion, "Exec Form" do not need a shell

RUN

it is a build time instruction, add layers to images

Volume

Decouple from the container, write into docker host, the data would persist
