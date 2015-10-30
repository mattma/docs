# Docker Book

Containers run in user space on top of an operating system’s kernel. As a result, container virtualization is often called operating system-level virtualization. Container technology allows multiple isolated user space instances to be run on a single host.

In Docker’s case, having modern Linux kernel features, such as control groups and namespaces, means that containers can have strong isolation, their own network and storage stacks, as well as resource management capabilities to allow friendly co-existence of multiple containers on a host.

Docker adds an application deployment engine on top of a virtualized container execution environment. It is designed to provide a lightweight and fast environment in which to run your code as well as an efficient workflow to get that code from your laptop to your test environment and then into production.

- Docker client and server

The Docker client talks to the Docker server or daemon, which, in turn, does all the work. Docker ships with a command line client binary, docker, as well as a full RESTful API. You can run the Docker daemon and client on the same host or connect your local Docker client to a remote daemon running on another host.

- Linux kernel namespaces

namespaces provide isolation for filesystems, processes, and networks. Each container is its own root filesystem, its own process environment, separate virtual interfaces and IP addressing between containers.

```bash
# Checking for the Linux kernel version on Ubuntu
uname -a
```

- Resource isolation and grouping (cgroup)

Resources like CPU and memory are allocated individually to each Docker container using the cgroups, or control groups, kernel feature.

cgroup (control groups) is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network, etc.) of a collection of processes.

Cgroups provides:

Resource limitation: groups can be set to not exceed a configured memory limit, which also includes the file system cache
Prioritization: some groups may get a larger share of CPU utilization or disk I/O throughput
Accounting: measures how much resources certain systems use, which may be used, for example, for billing purposes
Control: freezing the groups of processes, their checkpointing and restarting

A control group is a collection of processes that are bound by the same criteria. These groups can be hierarchical, where each group inherits limits from its parent group. The kernel provides access to multiple controllers (subsystems) through the cgroup interface; for example, the "memory" controller limits memory use, "cpuacct" accounts CPU usage, etc.

Control groups can be used in multiple ways:

By accessing the cgroup virtual file system manually.
By creating and managing groups on the fly using tools like cgcreate, cgexec, and cgclassify (from libcgroup).
Through the "rules engine daemon" that can automatically move processes of certain users, groups, or commands to cgroups as specified in its configuration.
Indirectly through other software that uses cgroups, such as Docker, Linux Containers (LXC) virtualization, libvirt, systemd, Open Grid Scheduler/Grid Engine, and Google's lmctfy.


- Copy-on-write model

filesystems are created with copy-on-write, meaning they are layered and fast and require limited disk usage.

- Logging

STDOUT,STDERR and STDIN from the container are collected, logged, and available for analysis or trouble-shooting.

## Docker daemon

Docker runs as a root-privileged daemon process to allow it to handle operations that can’t be executed by normal users (e.g., mounting filesystems).

By default, the daemon listens on a Unix socket at `/var/run/docker.sock` for incoming Docker requests. If a group named `docker` exists on our system, Docker will apply ownership of the socket to that group. Hence, any user that belongs to the docker group can run Docker without needing to use the sudo command.

#### Configuring the Docker daemon

-H flag: how the Docker daemon binds to the networks, to specify different interface and port configuration Ex: `sudo /usr/bin/docker daemon -H tcp://0.0.0.0:2375`. This would bind the Docker daemon to all interfaces on the host. Docker isn’t automatically aware of networking changes on the client side. We will need to specify the -H option to point the docker client at the server

Alternative: Using the DOCKER_HOST environment variable

`export DOCKER_HOST="tcp://0.0.0.0:2375"`

By default, Docker client-server communication is not authenticated. This means that if you bind Docker to an exposed network interface, anyone can connect to the daemon. We can also specify an alternative Unix socket path with the -H flag;

```bash
# Binding the Docker daemon to a different socket
sudo /usr/bin/docker daemon -H unix://home/docker/docker.sock
```

```bash
# Binding the Docker daemon to multiple places
sudo /usr/bin/docker daemon -H tcp://0.0.0.0:2375 -H unix:// home/docker/docker.sock
```

Note: If you’re running Docker behind a proxy or corporate firewall you can also use the HTTPS_PROXY, HTTP_PROXY, NO_PROXY options to control how the daemon connects.

```bash
# Turning on Docker daemon debug (verbosity)
/usr/bin/docker daemon -D
```

If we want to make these changes permanent, we’ll need to edit the various startup configurations. On Ubuntu, this is done by editing the `/etc/default/docker` file and changing the `DOCKER_OPTS` variable.

On Fedora and Red Hat distributions, this can be configured by editing the `/etc/systemd/system/docker.service` file and adjusting the `ExecStart` line. Or in later releases in the `/etc/sysconfig/docker` file.

**Checking that the Docker daemon is running**

```bash
# On Ubuntu
sudo status docker
sudo stop docker
sudo start docker

# On Red Hat and Fedora
sudo service docker stop
sudo service docker start
```

If the daemon isn’t running, then the docker binary client will fail with an error message similar to this: `Cannot connect to the Docker daemon. Is ' docker -d' running on this host?`

#### Working with container

```bash
# asking for its hostname
hostname

# Checking the container’s /etc/hosts
cat /etc/hosts

# Docker has added a host entry for our container with its IP address. Checking the container’s interfaces/networking configuration
ip a

# Checking container’s processes
ps -aux
```

**Docker log drivers**

Since Docker 1.6 you can also control the logging driver used by your daemon and container via `--log-driver` flag. You can pass this option to both the daemon and the docker run command.

`sudo docker run --log-driver="syslog" --name daemon_dwayne -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"`


**Inspecting the container’s processes `docker top`**

`sudo docker top CONTAINER_NAME`


**Docker statistics `docker stats`**

This shows statistics for one or more running Docker containers. see a list of daemonized containers and their CPU, memory and I/O per- formance and metrics.

`sudo docker stats CONTAINER_NAME`


**Running a process inside a container `docker exec`**

There are two types of commands we can run inside a container: background and interactive. Background tasks run inside the container without interaction and interactive tasks remain in the foreground. Interactive tasks are useful for tasks like opening a shell inside a container. Let’s look at an example of a background task.

Here the -d flag indicates we’re running a background process. We then specify the name of the container to run the command inside and the command to be executed.

Since Docker 1.7 you can use the -u flag to specify a new process owner for docker exec launched processes.


**Automatic container restarts `--restart`**

`sudo docker run --restart=always --name daemon_dave -d ubuntu / bin/sh -c "while true; do echo hello world; sleep 1; done"`
`--restart=on-failure:5`


**Finding out more about our container `docker inspect`**

```bash
sudo docker inspect CONTAINER_NAME
sudo docker inspect --format='{{ .State.Running }}' CONTAINER_NAME
sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' CONTAINER_NAME
sudo docker inspect --format '{{.Name}} {{.State.Running}}' CONTAINER_NAME_1 CONTAINER_NAME_2
```

**Note: How Docker works by exploring the `/var/lib/docker` directory. This directory holds your images, containers, and container configuration. You’ll find all your containers in the /var/lib/docker/containers directory.**


## Docker Images

A Docker image is made up of filesystems layered over each other.

At the base is a boot filesystem, bootfs, which resembles the typical Linux/Unix boot filesystem. A Docker user will probably never interact with the boot filesystem. Indeed, when a container has booted, it is moved into memory, and the boot filesystem is unmounted to free up the RAM used by the `initrd` disk image.

Docker next layers a root filesystem, rootfs, on top of the boot filesystem. This rootfs can be one or more operating systems (e.g., a Debian or Ubuntu filesystem). In traditional linux, rootfs is mounted read-only and then switched to read-write after boot and an integrity check is conducted. In Docker, rootfs stays in read-only mode, and Docker takes advantage of a union mount to add more read-only filesystems onto the root filesystem. A union mount is a mount that allows several filesystems to be mounted at one time but appear to be one filesystem. The union mount overlays the filesystems on top of one another so that the resulting filesystem may contain files and subdirectories from any or all of the underlying filesystems.

Docker calls each of these filesystems images. Images can be layered on top of one another. The image below is called the parent image and you can traverse each layer until you reach the bottom of the image stack where the final image is called the base image.

Finally, when a container is launched from an image, Docker mounts a read-write filesystem on top of any layers below. This is where whatever processes we want our Docker container to run will execute.

- copy on write pattern

When Docker first starts a container, the initial read-write layer is empty. As changes occur, they are applied to this layer; for example, if you want to change a file, then that file will be copied from the read-only layer below into the read-write layer. The read-only version of the file will still exist but is now hidden underneath the copy.

Each read-only image layer is read-only; this image never changes. When a container is created, Docker builds from the stack of im- ages and then adds the read-write layer on top. That layer, combined with the knowledge of the image layers below it and some configuration data, form the con- tainer.

- local docker images

Local images live on our local Docker host in the `/var/lib/docker`, directory. Each image will be inside a directory named for your storage driver; for example, `aufs` or `devicemapper`. You’ll also find all your containers in the `/var/lib/docker/containers` directory.

- Build image

Since Docker 1.5.0 and later you can also specify a path to a file to use as a build source. The file specified doesn’t need to be called `Dockerfile`, but must still be within the build context.

```bash
docker build -t "mattma/nginx:v1" -f /path/to/file
```

If a file named `.dockerignore` exists in the root of the build context then it is interpreted as a newline-separated list of exclusion patterns. Much like a `.gitignore` file it excludes the listed files from being uploaded to the build context. Globbing can be done using Go’s filepath.
