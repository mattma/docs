## 8 Ways to Use Docker in the Real World

1. Simplifying Configuration

This is the primary use case Docker Inc. advocates. One of the big advantages of VMs is the ability to run any platform with its own config on top of your infrastructure. Docker provides this same capability without the overhead of a VM. It lets you put your environment and configuration into code and deploy it. The same Docker configuration can be used in a variety of environments. This decouples infrastructure requirements from the application environment.

2. Code Pipeline Management

The previous use case makes a large impact in managing the code pipeline. As the code travels from the developer’s machine to production, there are many different environments it has to go through to get there. Each of these may have minor differences. Docker provides a consistent environment to the application from dev through production, easing the code development and deployment pipeline.

3. Developer Productivity

In a developer environment, we have two goals that are at odds with each other. We want it be as close as possible to production, and we want the development environment to be as fast as possible for interactive use.

Ideally, to achieve the first goal, we need to have every service running on its own VM to reflect how the production application runs. However, we don’t want to always require an Internet connection and add in the overhead of working remotely every time a compilation is needed. This is where the zero-overhead of Docker comes in handy. A development environment usually has a very low memory. And by not adding to the memory footprint that’s commonly done when using a VM, Docker easily allows a few dozen services to run within Docker.

4. App Isolation

There may be many reasons for which you end up running multiple applications on the same machine. An example of this is the developer productivity flow described earlier. But there are other cases, too.

A couple to consider are server consolidation for decreasing cost or a gradual plan to separate a monolithic application into decoupled pieces.

5. Server Consolidation

Just like using VMs for consolidating multiple applications, the application isolation abilities of Docker allow consolidating multiple servers to save on cost. However, without the memory footprint of multiple OSes and the ability to share unused memory across the instances, Docker provides far denser server consolidation than you can get with VMs.

6. Debugging Capabilities

Docker provides a lot of tools that are not necessarily specific to containers, but, they work well with the concept of containers. They also provide extremely useful functionality. This includes the ability to checkpoint and version containers, as well as to diff two containers. This can be immensely useful in fixing an application. You can find an example of this in our “Docker Saves the Day” post.

7. Multi-Tenancy

Yet another interesting use case of Docker is its use in multi-tenant applications, thereby avoiding major application rewrites. Our very own multi-tenant example is to develop quick and easy multi-tenancy for an IoT application. Code Bases for such multi-tenant applications are far more complicated, rigid and pretty much difficult to handle. Rearchitecting an application is not only time consuming, but also costs a lot of money.

Using Docker, it was easy and inexpensive to create isolated environments for running multiple instances of app tiers for each tenant. This was possible given the spin up speed of Docker environments and it’s effective diff command.

8. Rapid Deployment

Before VMs, bringing up a new hardware resource took days. Virtualization brought this number down to minutes. Docker, by creating just a container for the process and not booting up an OS, brings it down to seconds. This is the enabling technology that has had Google and Facebook using containers.

You can create and destroy resources in your data center without worrying about the cost of bringing it up again. With typical data center utilization at 30%, it is not difficult to bump up that number by using a more aggressive allocation of resources. And, the low cost of bringing up a new instance allows for a more aggressive allocation of resources.



## Components & Elements

#### Core components ( compose docker )

- **Docker Client** is the user interface that allows communication between the user and the Docker daemon.

- **Docker Server (Daemon)** sits on the host machine answering requests for services. It is the persistent background process that helps manage containers. In general, daemon is a long running process servicing requests for services. `-d` flag is used to run the daemon

Docker is a client-server application. Docker client talks to the Docker server or daemon, which, in turn, does all the work. Docker ships with a command line client binary (docker), act as both client and server, as well as a full RESTful API. You can run the Docker daemon and client on the same host or connect your local Docker client to a remote daemon running on another host.

Docker’s architecture:  thin docker client, REST docker server (daemon) over UNIX socket, make like an HTTP client

- **Docker Containers** are responsible for the actual running of applications and includes the OS, user added files, and meta-data. It has an image format, a set of standard operations, an execution environment.

Containers is the running or execution aspect of Docker.

- **Docker Images** are ready-only templates that help launch/build Docker containers.

An image holds all the information needed to bootstrap a container, including what processes to run and the configuration data. Every image starts from a base image, and a template is created by using the instructions that are stored in the DockerFile.

Docker containers are launched from images and can contain one or more running processes. Images as the building blocks or packing aspect of Docker and the containers as the running or execution aspect of Docker. You launch your containers from images. Images are the "build" part of Docker's life cycle. They are a layered format, using Union file systems, that are built step-by-step using a series of instructions. You can consider images to be the "source code" for your containers. For each instruction, a new layer is created on the image.

- **Docker registries** stores the images you build in registries and is a centralized registry allowing backup of Docker container images with public and private (only 2 types) access permissions.

#### Elements

- **DockerFile** is a file housing instructions that help automate image creation via `docker build`




## Containerization based on OS features:

- **Namespaces** serve as the first level of isolation. Makes sure a process running in a container cannot see or affect processes running outside the container.

- **Control Groups**, the key component of LXC, have resource accounting and limiting as their key functionality.

- **UnionFS** (FileSystem) serves as a building blocks of containers. It creates layers, and, thereby, accounts for Docker’s lightweight and fast features


## Puzzle Fits Together

 To run any application, there is a basic requirement of two steps:

Step 1: Build an Image

Step 2: Run the Container

Running the container originates from the image we created in the previous step. When a container is launched, a read-write layer is added to the top of the image. After appropriate network and IP address allocation, the desired application can now be run inside the container.

## Dockerfile

Dockerfile is built for the single purpose. **ONLY one purpose**. In docker, everything is in container, every container is isolated. every container definitely works.

Dockerfile contains a series of instructions paired with arguments. Instructions in the Dockerfile are processed from
the top down, so you should order them accordingly. Each instruction adds a new layer to the image and then commits the image.

Each instruction in a Dockerfile commits the change into a new image which will then be used as the base of the next instruction. If an image exists with the same parent and instruction ( except for ADD ) docker will use the image instead of executing the instruction, i.e. the cache. In order to effectively utilize the cache you need to keep your Dockerfiles consistent and **only add the alterations at the end**.

### Workflow

1. In source code repo, create an *image A* via Dockerfile

Docker executing instructions roughly follow a workflow:

- Docker runs a container from the image.

- An instruction executes and makes a change to the container.

- Docker runs the equivalent of docker commit to commit a new layer.

- Docker then runs a new container from this new image.

- The next instruction in the file is executed, and the process repeats until all instructions have been executed.

2. In source code level, build, pass tests, and push *image A* (new image) into Docker Registry ( public or private ).

If your Dockerfile stops for some reason (an instruction fails to complete), you will be left with an image you can use. This is
highly useful for debugging: you can run a container from this image interactively and then debug why your instruction failed using the last image created. Use `docker run` command to create a container from the last step that succeeded in my Docker build.

3. In host machine (Docker Daemon runs on), pull the *image A* from Docker registry, add the read-write layer to the image and launch the *container A* to run the application

4. User could use docker-client to interact with host machine to control the docker daemon


### Builiding the Dockerfile

    docker build -t='mattma/nodejs' .         # dot is very important

The trailing . tells Docker to look in the local directory to find the Dockerfile.

You can also specify a Git repository as a source for the Dockerfile as we can see here:

    docker build -t='mattma/nodejs' git@github.com:mattma/docker-container


If a file named **.dockerignore** exists in the root of the build context then it is interpreted as a newline-separated list of exclusion patterns. Much like **.gitignore** file it excludes the listed files from being uploaded to the build context. Globbing can be done using Go's filepath.


### Dockerfile Commands

Syntax: `INSTRUCTION <argument>`

Any line that starts with a `#` is considered a comment.


#### FROM

All DockerFiles must begin with the "FROM" command.

"FROM" instruction specifies an existing image that the following instructions will operate on.

The "FROM" command indicates the base image from which the new image will be created and from which all subsequent instructions will follow. The "FROM" command can be used any number of times, indicating the creation of multiple images.

    FROM ubuntu   # the new image will be created from Ubuntu image ( called the base image ).


#### MAINTAINER

Tells Docker who the author of the image is and what their email address is. This is useful for specifying an owner and contact for an image.

    MAINTAINER Matt Ma "matt@mattmadesign.com"


#### RUN

Execute command(s) in a shell or exec form on the current image. It adds a new layer on top of the newly created image. if successful, will commit that layer, the committed results are then used for executing the next instruction in the DockerFile.

    RUN apt-get update

By default, `RUN` instruction executes inside a shell using the command wrapper `/bin/sh -c`. If you are running the instruction on a platform without a shell or you wish to execute without a shell (for example, to avoid shell string munging), you can specify the instruction in exec format. We specify an array containing the command to be executed and then each parameter to pass to the command.

    RUN [ "apt-get", " install", "-y", "nginx" ]


#### EXPOSE

Specify the port on which the container will be listening at runtime (Tells Docker that the application in this container will use this specific port on the container).

That doesn't mean you can automatically access whatever service is running on that port (here, port 80) on the container. For security reasons, Docker doesn't open the port automatically, but waits for you to do it when you run the container using the `docker run`
command. You can specify multiple `EXPOSE` instructions to mark multiple ports to be exposed. Docker also uses the `EXPOSE`instruction to help link together containers.

    EXPOSE 80


#### CMD

Defaults for an executing container or run when a container is launched. Dockerfile allows usage of the `CMD` instruction only once. Multiple usage of `CMD` nullifies all previous `CMD` instructions.

It is similar to `RUN` instruction, but rather than running the command when the container is being built, it will specify the command to run when the container is launched, much like specifying a command to run when launching a container with the `docker run` command.

`CMD` comes in three flavours:

    CMD ["executable","param1","param2"]
    CMD ["param1","param2"]
    CMD command param1 param2

**Array format  tells Docker to run the command 'as-is'. without an array, Docker will prepend `/bin/sh -c` to the command. This may result in unexpected behavior when the command is executed. Always Recommended that you always use the array syntax.**

If *Dockerfile* define this instruction `CMD ["/bin/true"]` or `CMD ["/bin/bash" , "-l"]`, equivalent below

    docker run -i -t mattma/nodejs /bin/true

`CMD` command can be override when `docker run` container creation. If specify a `CMD` in *Dockerfile* and one on the
`docker run` command line, then the command line will override the Dockerfile's `CMD` instruction. This is the key difference between `ENTRYPOINT` and `CMD`.



## ENTRYPOINT

Similar to `CMD`. Configure a container to run as an executable, which means a specific application can be set as default and run every time a container is created using the image. This also means that the image will be used only to run and target the specific application each time it is called.

It's pretty much like `CMD` but essentially let's you use re-purpose `CMD` as runtime arguments to `ENTRYPOINT`, the command which specified in `ENTRYPOINT` that is executed when the container starts, thinking of it as turning CMD into a set of optional arguments for running the container.

Docker allows only one `ENTRYPOINT` and multiple `ENTRYPOINT` instructions nullifies all of them, executing the last `ENTRYPOINT` instruction.

`ENTRYPOINT` comes in three flavours:

    ENTRYPOINT ["executable","param1","param2"]
    ENTRYPOINT command param1 param2

**`ENTRYPOINT` isn't as easily overridden. Instead, any arguments we specify on the docker run command line will be passed as arguments to the command specified in the `ENTRYPOINT`.**

    ENTRYPOINT ["/usr/sbin/nginx"]
    ENTRYPOINT ["/usr/sbin/nginx" , "-g" , "daemon off;" ]

We can also combine `ENTRYPOINT` and `CMD` to do some neat things.

    ENTRYPOINT ["/usr/sbin/nginx" ]
    CMD ["-h" ]

You could specify `-g "daemon off"` to override default `-h` flag.

If required at runtime, you can override `ENTRYPOINT` instruction using `docker run` with `--entrypoint` flag.


#### ADD

Add/Copy files and directories from our build environment into our image. It takes two arguments *source* and *destination*.

The *destination* is a path in the container.
The *source* is either a URL, a filename, or directory as long as it is inside the build context or environment. (in the context of the launch config. Cannot ADD files from outside the build directory or context.)

    ADD software.lic /opt/application/software.lic

This ADD instruction will copy the file *software.lic* from the build directory to */opt/application/software.lic* in the image.

**The build cache can be invalidated by `ADD` instructions. If the files or directories added by an ADD instruction change then
this will invalidate the cache for all following instructions in the Dockerfile.**

When ADD'ing files Docker uses the ending character of the destination to determine what the source is. If the destination ends in a */*, then it considers the source a directory. If it doesn't end in a */*, it considers the source a file. The source of the file can also be a URL; for example:

    ADD http://wordpress.org/latest.zip /root/wordpress.zip

`ADD` instruction has some special magic for taking care of local tar archives. If a tar archive (valid archive types include gzip, bzip2, xz) is specified as the source file, then Docker will automatically unpack it for you:

    ADD latest.tar.gz /var/www/wordpress/

This will unpack the *latest.tar.gz* archive into the */var/www/wordpress/* directory. The archive is unpacked with the same behavior as running tar with the `-x` option: the output is the union of whatever exists in the destination plus the contents of the archive. If a file or directory with the same name already exists in the destination, it will not be overwritten. If the destination doesn't exist, Docker will create the full path for us, including any directories. New files and directories will be created with a mode of *0755* and a *UID* and *GID* of 0.


## COPY

Related to `ADD` instruction. The key difference is that the `COPY` instruction is purely focused on copying local files from the build
context and does not have any extraction or decompression capabilities.

The *destination* should be an absolute path inside the container.
The *source* must be the path to a file or directory relative to the build context, the local source directory in which your Dockerfile resides. You cannot copy anything that is outside of this directory, because the build context is uploaded to the Docker daemon, and the copy takes place there.

    COPY conf.d/ /etc/apache2/

This will copy files from the *conf.d* directory to the */etc/apache2/* directory.

Any files and directories created by the copy will have a UID and GID of 0. If the source is a directory, the entire directory is copied, including filesystem metadata; if the source is any other kind of file, it is copied individually along with its metadata.

If the destination doesn't exist, it is created along with all missing directories in its path, much like how the `mkdir -p` works.


#### WORKDIR

Set the working directory for the container and the `RUN`, `CMD` and `ENTRYPOINT` instructions to be executed when a container is launched from the image.

    WORKDIR /path/to/workdir

Example below, we've changed into the */opt/webapp/db* directory to run `bundle install` and then changed into the */opt/webapp* directory prior to specifying our ENTRYPOINT instruction of rackup.

    WORKDIR /opt/webapp/db
    RUN bundle install
    WORKDIR /opt/webapp
    ENTRYPOINT ["rackup"]

You can override the working directory at runtime with the `-w` flag, for example:

    docker run -ti -w /var/log ubuntu pwd         # /var/log   Will set the container's working directory to */var/log*


#### ENV

Set environment variables during the image build process.

    ENV <key> <value>

They come as key value pairs and increases the flexibility of running programs. The new environment variable will be used for any subsequent RUN instructions. ( would execute  RVM_PATH=/home/rvm/ gem install unicorn )


    ENV RVM_PATH /home/rvm/
    RUN gem install unicorn

**These environment variables will also be persisted into any containers created from your image.**

You can also pass environment variables on the `docker run` command line using the `-e` flag. These variables will only apply at runtime. so `env` command would be run when container started. container has the WEB_PORT environment variable set to 8080.

    docker run -ti -e "WEB_PORT=8080" ubuntu env


#### USER

Set a UID to be be used when the image is running. (a user that the image should be run as). Default USER instruction is **root**.

    USER <uid>

This will cause containers created from the image to be run by the user *matt ma*.

    USER mattma

We can specify a username or a UID and group or GID. Or even a combination thereof, for example:

    USER user
    USER user:group
    USER uid
    USER uid:gid
    USER user:gid
    USER uid:group

You can also pass environment variables on the `docker run` command line using the `-u` flag.


#### VOLUME

Enable access from a container to a directory on the host machine. Adds volumes to any container created from the image.

    VOLUME ["/data"]

A volume is a specially designated directory within one or more containers that bypasses the Union File System to provide several useful features for persistent or shared data:

* Volumes can be shared and reused between containers.

* A container doesn't have to be running to share its volumes.

* Changes to a volume are made directly.

* Changes to a volume will not be included when you update an image.

* Volumes persist until no containers use them.

This allows us to add data (like source code), a database, or other content into an image without committing it to the image and allows us to share that data between containers. This can be used to do testing with containers and an application's code, manage logs, or handle databases inside a container.

Example below would attempt to create a mount point */opt/project* to any container created from the image.

    VOLUME ["/opt/project"]

we can specify multiple volumes by specifying an array:

    VOLUME ["/opt/project" , "/data"]

Note:

Docker has an option to allow specific folders in a container to be mapped to the normal filesystem on the host. This allows us to have data in the container without making the data part of the Docker image, and without being bound to AUFS. These data-only containers don't even need to be running, it just needs to exist.

Problems: 1. Volumes are container specific, when you create a new container, even with the same image, you do not have access to the data.   2. Since image layers are built using containers, data saved to folders which have been specified as a volume does not make it to the next layer, or your final container.

Ex: data must be able to be persisted so creating data-only containers

And create the container with a mounted Volume on host machine at */var/lib/mysql*:

    docker run -i -t -v /var/lib/mysql --name mysql_data mattma/mysql_datastore

Docker allows us to pull in volumes from another container to use in our own:

    docker run -d -volumes-from mysql_data mattma/awesome_mysql

Here, all data being saved by mysql will be stored in the volume specified by mysql_data container. We can now create as many mysql instances via `docker run -d -volumes-from` as we can handle and use volumes from as many mysql_data style containers as we want as well (provided unique naming or use of container ID's).

Ex: What do you use when you need to share data with containers across hosts?

Answer: NFS (or insert your file share service of choice).


In fact if you are doing your containers correctly the stuff in the volumes is the only thing you need to worry about backing up as containers shouldn't be storing anything at all. how do you access the data in volumes?

1. `docker inspect`

where a container's volumes are stored and use sudo to access that data. Problems: 1. insane paths  2. Accessing data as root user  3. Creating new data needs to be chowned/chmod'd properly so the container can read/write to it as well

2. `--volumes-from`  <= preferred way

When accessing the volume data you want to make sure you are using the same uid/gid as it was written in, so it's a good idea to use the same image which was used to create that data. With this method all your data is in the same exact locations as it would normally be. No need to SSH, nsenter, or nsinit into the container to get at this stuff. the volumes needed to be namespaced for container they are in (so as not to overwrite files from other containers).

    docker run -it --rm --entrypoint /bin/sh --volumes-from my/appimage -c "bash"

Technically --volumes-from is just bind-mounting the host path of the given volumes into a new container, you could do this manually with "-v /var/lib/docker/path/to/volume:/container/path"

#### ONBUILD

Building a new image based on the existing image which has `ONBUILD` in its Dockerfile. For use when creating a base image and you want to defer instructions to child images. Mostly used in a base image.

Adds triggers to images. A trigger is executed when the image is used as the basis of another image (e.g., if you have an image that needs source code added from a specific location that might not yet be available, or if you need to execute a build script that is specific to the environment in which the image is built).

The trigger inserts a new instruction in the build process, as if it were specified right after the `FROM` instruction. The trigger can be any build instruction. For example

    ONBUILD ADD . /app/src
    ONBUILD RUN cd  /app/src && make

When run `docker build -t me/test .`, here the ONBUILD instruction is read, not run, but stored for later use. Later, when build on top of this image, *dockerfile*, `FROM me/test`. then called `docker build -t me/child-test .`, the `ONBUILD` instruction only gets run when building the `me/child-test` image, run just after the FROM and before any other instructions in a child image.

This would add an `ONBUILD` trigger to the image being created, which we can see when we run docker inspect on the image.

    docker inspect 508efa4e4bf8

    ...
        "OnBuild" : [
            "ADD . /app/src" ,
            "RUN cd /app/src/ && make"
         ]
    ...

We now have an image with an `ONBUILD` instruction that uses the `ADD` instruction to add the contents of the directory we're building from to the */app/src/* directory in our image. This could readily be our generic web application template from which I build web applications. This would allow me to always add the local source, and then proceeded to execute the remaining steps. Ex: specify some configuration or build information for each application.

*Dockerfile*

    FROM mattma/nodejs                      # the existing image with ONBUILD
    MAINTAINER James Turnbull "james@example.com"
    ENV APPLICATION_NAME webapp
    ENV ENVIRONMENT development

**The `ONBUILD` triggers are executed in the order specified in the parent image and are only inherited once (i.e., by children and not grandchildren). If we built another image from this new image, a grandchild of the mattma/nodejs image, then the triggers would not be executed when that image is built.**

** There are several instructions you can't `ONBUILD`: `FROM`, `MAINTAINER`, and `ONBUILD` itself. This is done to prevent inception-like recursion in Dockerfile builds.**


#### Dockerfile Best Practices

- Dockerfile boilerplate

    FROM ubuntu:14.04
    MAINTAINER Matt Ma "matt@mattmadesign.com"

    ENV REFRESHED_AT 2014-08-25
    RUN apt-get -qq update
    # RUN apt-get upgrade -y

- Lists

* Use human readable tags while building the images to better manage images

* Avoid mapping the public port on your host. (Only be able to have one instance of your dockerized app running)

* Use array syntax for CMD and ENTRYPOINT

* Keep common instructions at the top of the Dockerfile to utilize the cache.

* Always use tag in a build image step. ex: `docker build -t='mattma/nodejs'`


### Under the hook

- Docker Run command (executed to spin up and run a container.)

1. A docker run command is initiated.

2. Docker runs lxc-start to execute the run command.

3. A set of namespaces and control groups are created for the container by lxc-start.

namespace is the first level of isolation whereas no two containers can view or control the processes running in each of them. Each container is assigned a separate network stack, and, hence, one container does not get access to the sockets of another container. To allow IP traffic between the containers, you must specify public IP ports for the container.

Control Groups, the key component, has the following functionalities:

Is responsible for resource accounting and limiting.
Provides metrics pertaining to the CPU, memory, I/O and network.
Tries to avoid certain DoS attacks.
Has a significance on multi-tenant platforms.


### Security

Docker Daemon’s Attack Surface
Docker daemon runs with root privileges, which implies there are some issues that need extra care. Some interesting points include the following:

Control of Docker daemon should only be given to authorized users as Docker allows directory sharing with a guest container without limiting access rights.
The REST API endpoint now supports UNIX sockets, thereby preventing cross-site-scripting attacks.
REST API can be exposed over HTTP using appropriate trusted networks and VPNs.
Run Docker exclusively on a server (when done), isolating all other services.

Some key Docker security features include the following:

Processes, when run as non-privileged users in the containers, maintain a good level of security.
Apparmor, SELinux, GRSEC solutions can be used for an extra layer of security.
There’s a capability to inherit security features from other containerization systems.


### API

COMMAND                                                                         Purpose

GET /api/v1.1/users/:username/                                        Add a user
PATCH /api/v1.1/users/:username/                                    Update user info
GET /api/v1.1/users/:username/emails/                             List emails for the user
DELETE /api/v1.1/users/:username/emails/                        Delete a user

###Credits

[Flux7's Blog](http://blog.flux7.com/blogs/)
[Flux7's Docker Tutorial Series](http://blog.flux7.com/blogs/docker/docker-tutorial-series-part-1-an-introduction)
