# Docker Cheat Sheet

## Dotfile alias

- the ID of the last-run Container. `-q` return only the container id

    alias dl='docker ps -l -q'

    usage: docker commit `dl` helloworld


## Installation

    curl get.docker.io | sudo sh -x

requirement:

1. Any x64 host running a modern Linux kernel ( 32bit not supported )

2. kernel version 3.8 and later.


### Set Up

- Pull down a base image and install image.

    docker pull ubuntu

### Container Level

- Create a Container.

    docker run ubuntu /bin/echo Hello Docker   # Hello World Example

    docker run -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
    docker run  -i -t mattma/nodejs /bin/bash

    docker run -e="DB_PASSWORD=$DB_PASSWORD" --link angry_bardeen:db -d -p 80 myuser/wordpress /run.sh

    docker run $Id_or_Name [command and args]
        -i -t     # interactive mode + pseudo-TTY. Run an interactive shell, allowing you to access the running container.
        -e ENVVAR=value         # environment vars
        -p 8080:80                   # <host_port>[:<container_port>] Maps a network port on the internal to the external
        -d                                 # detach or Run as daemon (runs in background)
        --name matt                # give the vm a user friendly name
        -v <host_dir>[:<container_dir>]                     # create a volume in our container from a directory on the host.
                                            # mapping source files on the host machine (must be an absolute path, ex: Mac OS) to folder in the host container ( VM run with docker binary, shares the host filesystem with the container) If the destination directory doesn't exist Docker will create it.
        -v <host_dir>[[:<container_dir>]:[rw|ro]]   # specify the read/write status of the destination (ro: read-only, rw: read-write)
        -h, --hostname           # set a specific hostname for the container
        --privileged
                                            # enables Docker's privileged mode. allows us to run containers with (almost) all the capabilities of their host machine, including kernel features and device access. This enables the special magic that allows us to run Docker inside Docker. Running Docker in --privileged mode is a security risk. Containers
with this enabled have root-level access to the Docker host.

Note: Docker containers automatically die when they complete their last task, so if you run docker with, for example, /sbin/service httpd start, when the service command ends and Exits 0, the container dies. You can get around this by passing it “/bin/bash” and running it interactively, as the shell will keep the container alive.

 However, if you attach to the container, and then use exit or Ctl-D to disconnect, then the container will die. You must use a special key command, Ctl-p Ctl-q, to detach. Think of it like a screen session.

- Stop a Container.

    docker stop $Id_or_Name

- Start a Container.

    docker start $Id_or_Name

- Restart a Container.

    docker restart $Id_or_Name

- Connect to a running Container.

    docker attach $Id_or_Name
        --sig-proxy=true  # Proxify all received signal to the process (even in non-tty mode)

- Copy file in a Container to the host.

    docker cp $Id_or_Name:/etc/passwd .

- Mount the directory in host to a Container.

    docker run -v /home/vagrant/test:/root/test ubuntu echo yo

- Delete a container

    docker rm $Id_or_Name                      # remove specific container

    docker rm $(docker ps -a -q)              # Delet all stopped containers, try to remove everything, but failed on still running container

    docker ps -a | awk '/Exit/ {print $1}' | xargs docker rm    # remove stopped containers

    docker ps -q -a | xargs docker rm                                   # Remove all containers (including running containers)

    for i in $(docker ps -a | grep "REGEXP_PATTERN" | cut -f1 -d" "); \
        do echo $i; done                                                          # Remove all containers which name or image matches RegExp
    # Note: it doesn't filter containers on any particular field - No difference if pattern is found on container name, image name, or any other field

### Container Info

- View general status, including amount installed containers and images, etc.

    docker info

- Show Containers

    docker ps         # list running containers
    docker ps -a    # list running and stopped containers

- Show Container information

    docker inspect $Id_or_Name

    // docker inspect allows the use of Go-Template format the output.
    docker inspect --format="{{.NetworkSettings.IPAddress}}" $Id_or_Name      # Grab the ipaddesses of a running docker container

    for x in $(docker ps | awk '!/C/ {print $1}'); \
        do  docker inspect --format="{{.NetworkSettings.IPAddress}}" $x; done   # Grab the ipaddesses of all docker containers

    docker inspect `dl` | grep IPAddress | cut -d '"' -f 4                                    # Get IP address

- Show log of a Container ( get the stdout and stderr of a container )

    docker logs $Id_or_Name

- Show running process in a Container.

    docker top $Id_or_Name


### Image Level

- Create an container from a image. For tag name, <username>/<imagename> is recommended.

    docker run -d ubuntu /bin/sh -c "apt-get install -y hello"

-  Commit the container <container_id> <some_noame>

    docker commit [ID] [image name]

    docker commit -m "My first container" $Id_or_Name mattma/nodejs

- Build and Name (format: <user>/<repo_name>) a new image via Dockerfile. When succeed, output at the end something like `Successfully built c127baa91a68`. Can use `docker history` to verify the build instructions

    echo -e "FROM base\nRUN apt-get install hello\nCMD hello" > Dockerfile
    docker build -t mattma/nodejs .
    docker build -t mattma/nodejs:0.0.1 ./myimage/   # repoName:tagName DockerfilePath
        -rm=true         # delete all intermediate images
        -no-cache       # do not use cache when build the image

    docker build -t='mattma/nodejs' git@github.com:mattma/docker-container

    docker history mattma/nodejs  # showing the history of the newly image started with the final layer

- Search an image

    docker search debian
    docker search debian | head

- Login to a image.

    docker run -rm -t -i $Id_or_Name /bin/bash

- Push an imges to remote repository. (Docker Hub)

    docker login
    docker push $Id_or_Name

- Delete an image

    docker rmi $Id_or_Name
    docker images -a -q | xargs docker rmi        # remove all images

- Kill a running container using SIGKILL or a specified signal

     docker kill $Id_or_Name
        -s      # --signal="KILL", Signal to send to the container


### Image Info

- List all available images ( Repository, Tag, Id )

    docker images
        -q  # --quite, only show numeric IDs
        -a  # --all, show all images (by default filter out the intermediate image layers)
        -f  # --filter, Provide filter values (i.e. 'dangling=true')

- Show image information like IP adress.

    docker inspect $Id_or_Name

- To show command history of a image.

    docker history $Id_or_Name


## Dockerfile

Always want a *Dockerfile*, even like installing everything in the shell. Configs could be reused over and over again.

    FROM ubuntu
    MAINTAINER matt ma <matt@mattmadesign.com>

#### Dockerfile Recipes

- Change password to the root user

    RUN echo 'root:my_password' |chpasswd


## Misc Tips

1. sudo - No need to run sudo again

    sudo groupadd docker                            # add the docker group.
    sudo gpasswd -a myUsername docker    # add self to the docker group
    sudo service docker restart                     # restart the docker daemon
    exit                                                        # logout and in again

2. jq

the gangsta way to parse `docker inspect`’s output, can be installed with apt-get, it is JSON-Post processor. think like JS access json

    docker inspect `dl` | grep 'IPAddress' | cut -d ' " ' -f4             # return ipaddress  172.17.0.52

    docker inspect `dl` | jq -r ' .[0].NetworkSettings.IPAddress'    # return ipaddress  172.17.0.52

3. find the mapping port number by defining the `docker port`

    docker port $Id_or_Name 3306                                              # 0.0.0.0:49155

    docker port $Id_or_Name 3306 | cut -d":" -f2                        # 49155


4. docker-get-ip: name or sha

    docker inspect -f {{.NetworkSettings.IPAddress}} $1

5. docker-get-id

    docker inspect -f {{.Id}} $1

6. docker-get-image

I find this one useful for DevOps uses, when I have the friendly name, I can compare the current running container’s image with the one I expect it to have (like an update) and redeploy.

    docker inspect -f {{.Image}} $1

7. docker-get-state

    docker inspect -f {{.State.Running}} $1

8. Remove all containers and Images ( A fresh and clean state ). It might give a warning when there are no running containers or containers

    docker kill $(docker ps -q); docker rm $(docker ps -a -q); docker rmi $(docker images -a -q)

Remove all containers

    docker kill $(docker ps -q) ; docker rm $(docker ps -a -q)

quickly run a command in a container and exit

    docker run --rm -i -t busybox /bin/bash

9. Commands Don't Run in a Shell

The gotcha here is: you don't have a shell, the * is shell expansion and so you need a shell to be able to use that.

    docker run --rm busybox sh -c 'ls /var/log/*'

10. Use the techniques from this post

http://www.tech-d.net/2014/05/05/docker-quicktip-5-backing-up-volumes/



Boot2Docker and Laptops on the Move Means DNS Woes
I have about three locations where I use my laptop and they're all on different ISPs. Boot2docker tends to hold on to DNS servers for a bit too long and because of that, you might get weird errors when trying to build images. If you see

    cannot lookup archive.ubuntu.com

on Ubuntu or something similar on CentOS, it might be wise to stop and start your boot2docker just to be sure:

    boot2docker-cli down && boot2docker-cli up


3. Where does Docker store everything?

    sudo su
    cd /var/lib/docker
    ls -lash

*graph/* means images.
filesystem layers are in *graph/<imagesid>/* include *json* & *layersize*

4. Reading docker source code

Written in `go`

commands.go                # the CLI
api.go                            # the rest api router
server.go                       # implementation of much of the REST API
buildfile.go                    # the Dockerfile parser


## Docker Tools

- Deis

deployment and orchestration

- [Dokku](https://github.com/progrium/dokku)

deployment

- Fig

deployment

Installation

$ sudo bash -c "curl -L https://github.com/docker/fig/releases/download/0.5.2/linux/ > /usr/local/bin/fig"
$ sudo chmod +x /usr/local/bin/fig

If pip available

$ sudo pip install -U fig


- [Flynn](https://flynn.io)

deployment and orchestration

- Shipyard

Monitoring


#### Credits:

[tcnksm's cheatsheet](https://coderwall.com/p/2es5jw)
[Docker scripts updated](http://bitjudo.com/blog/2014/05/07/docker-scripts-updated/)
