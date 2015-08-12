Based on version v1.2

### Installation

- [Docker official installation guide - Ubuntu]((https://docs.docker.com/v1.2/installation/ubuntulinux/)

- [Docker official installation guide - Mac OS X](https://docs.docker.com/v1.2/installation/mac/)

- [Docker official installation guide - Amazon](https://docs.docker.com/v1.2/installation/amazon/)


### User Guide

- [Docker official user guide](https://docs.docker.com/v1.2/userguide/)

- [Docker official quick starter](https://docs.docker.com/v1.2/articles/basics/)


### API

- [Docker official CLI](https://docs.docker.com/v1.2/reference/commandline/cli/)

- [Docker official CLI - RUN](https://docs.docker.com/v1.2/reference/run/)

- [Docker official Dockerfile](https://docs.docker.com/v1.2/reference/builder/)

- [Docker official Remote API v1.14 - extension UI](https://docs.docker.com/reference/api/docker_remote_api_v1.14/)

- [Docker Remote API Client Libraries](https://docs.docker.com/reference/api/docker_remote_api_v1.14/)

There are 4 APIs

1. Docker Registry API

a REST API for the [Docker Registry](https://registry.hub.docker.com/), which eases the storage of images and repositories. The API does not have access to user accounts or its authorization.

- GET /v1/images/(image_id)/layer           # extract image layer
- PUT /v1/images/(image_id)/layer           # insert image layer
- GET /v1/images/(image_id)/json            # retrieve an image
- GET /v1/images/(image_id)/ancestry      # retrieve roots of an image
- GET /v1/repositories/(namespace)/(repository)/tags
   GET /v1/repositories/(namespace)/(repository)/tags/(tag*)
                                                                 # retrieve all tags or specific tag of a repository
- DELETE /v1/repositories/(namespace)/(repository)/tags/(tag*)
                                                                 # delete a tag
- GET /v1/_ping                                        # status check of registry


2. Docker Hub API

The major difference between library-specific and user-specific commands is the use of namespace.

- PUT /v1/repositories/(repo_name)/        # create a new repository
- DELETE /v1/repositories/(repo_name)/   # delete existing repository
- PUT /v1/repositories/(repo_name)/images   # Update repository images
- GET /v1/repositories/(repo_name)/images   # Get images from a repository
- PUT /v1/repositories/(repo_name)/auth       # Authorization
- GET /v1/users                                              # verify a user login
- POST /v1/users                                            # create a new user
- PUT /v1/users/(username)/                          # update user details

3. Docker OAuth API

4. Docker Remote API

Docker Remote API is a REST API that replaces the remote command line interface -- rcli.

- Get the list of all containers

    GET /containers/json
    curl http://localhost/containers/json?all=1

- Create a new container

    POST /containers/create
    curl -X POST -H "Content-Type: application/json" -d { ....// json obj  } http://localhost/containers/create

- Inspect Container- Return low-level information about a container with the id is

    GET /containers/(id)/json
    curl http://localhost/containers/3734....e6e/json

- Process List - To obtain the list of processes running inside a container

    GET /containers/(id)/top
    curl http://localhost/containers/3734....e6e/top

- Container Logs - Collect stdout and stderr logs from the container

    GET /containers/(id)/logs
    curl http://localhost/containers/3734....e6e/logs

- Export Container - export the contents of the container. *.tar.gz* would be created

    GET /containers/(id)/export

- Start a container - Use command:

    POST /containers/(id)/start
    curl -v -X POST -H "Content-Type: application/json" -d { ....// json obj  } http://localhost/containers/3734....e6e/start

- Stop a container

    POST /containers/(id)/stop

- Restart a Container

    POST /containers/(id)/restart

- Kill a container

    POST /containers/(id)/kill

### Blog

- [Docker official blog](https://blog.docker.com/)

- [Docker registry and workflows](http://blog.flux7.com/blogs/docker/docker-tutorial-series-part-4-registry-workflows)

### Video Resource

- [Docker official youtube channel](https://www.youtube.com/user/dockerrun/feed)


### Quick Start

    vagrant init phusion/ubuntu-14.04-amd64
    vagrant up
    vagrant ssh


## Dockerfile

[The configuration file](http://docs.docker.io/introduction/working-with-docker/#working-with-the-dockerfile). Sets up a Docker container when you run `docker build` on it.  Vastly preferable to `docker commit`.

- Build:

Docker images can be built using dockerfiles.

    docker build [options] PATH | URL

        --rm=true; all intermediate containers are removed after a successful build
        --no-cache=false; avoids using cache during build

    ex: docker build --rm -t mattma/nodejs .

- Attach:

allows interaction with running containers. allows viewing of daemonized processes. Detaching from the container can be done in two ways: 1. Ctrl+c - for a quiet exit   2. Ctrl-\ - to detach with a stack trace

    docker attach container


- Diff:

lists the changes in the files and directories. Methods: A (addtion), D (deletion),  C  (changed)

    docker diff container

- import:

Docker allows imports from remote locations and a local file or directory. Import from remote locations is done using http, and imports from local files or directories is accomplished using the “-” parameter.

    docker import http://example.com/example.tar

    ex: sudo tar -c image.tar | docker import - image


- export:

transfer the contents of the filesystem as a tar file.

    docker export $Id_or_Name > image.tar

- cp:

copies files from the containers filesystems to the host machine specified path.

    docker cp container:path hostpath

    ex: docker cp mattma/nodejs:/test /opt   # opt/test/ exists now

- login:

login the Docker registry server is Docker login

    docker login [options] [server]

    ex: docker login localhost:8080

- inspect:

Low-level information about containers and images can be collected using the Docker inspect command. Information, including the following, can be gathered using the inspect command:

IP address of an instance
List of port bindings
Search for specific port mapping
Collect configuration details

    docker inspect container/image

- kill:

The container’s main process is killed by sending the SIGKILL signal. (Not remove or delete the container)

    docker kill [options] container

- rmi:

Removing one or more images can be achieved using the rmi command.

    docker rmi image

- wait:

print the exit code only after the container exits.

    docker wait $Id_or_Name

- load:

Load an image or a repository in tar form to STDIN

    docker load $Id_or_Name

    ex: docker load -i image.tar

- save:

Similar to load, an image can be saved as tar and sent to the STDOUT.

    docker save image

    ex: docker save mattma/nodejs > image.tar


### Instructions

* [FROM](http://docs.docker.io/reference/builder/#from)
* [MAINTAINER](http://docs.docker.io/reference/builder/#maintainer)
* [RUN](http://docs.docker.io/reference/builder/#run)
* [CMD](http://docs.docker.io/reference/builder/#cmd)
* [EXPOSE](http://docs.docker.io/reference/builder/#expose)
* [ENV](http://docs.docker.io/reference/builder/#env)
* [ADD](http://docs.docker.io/reference/builder/#add)
* [ENTRYPOINT](http://docs.docker.io/reference/builder/#entrypoint)
* [VOLUME](http://docs.docker.io/reference/builder/#volume)
* [USER](http://docs.docker.io/reference/builder/#user)
* [WORKDIR](http://docs.docker.io/reference/builder/#workdir)
* [ONBUILD](http://docs.docker.io/reference/builder/#onbuild)


### Best Practices

Best to look at [http://github.com/wsargent/docker-devenv](http://github.com/wsargent/docker-devenv) and the [best practices](http://crosbymichael.com/dockerfile-best-practices.html) / [take 2](http://crosbymichael.com/dockerfile-best-practices-take-2.html) for more details.

    ENV LANG en_US.UTF-8
    ENV LANGUAGE en_US.UTF-8
    ENV LC_ALL en_US.UTF-8
    ENV HOME /root

    https://registry.hub.docker.com/u/quintenk/supervisor/dockerfile/

## Links

Links are how Docker containers talk to each other [through TCP/IP ports](http://docs.docker.io/use/working_with_links_names/).  [Linking into Redis](http://docs.docker.io/use/working_with_links_names/#links-service-discovery-for-docker) and [Atlassian](http://blogs.atlassian.com/2013/11/docker-all-the-things-at-atlassian-automation-and-wiring/) show worked examples.  You can also (in 0.11) resolve [links by hostname](http://docs.docker.io/use/working_with_links_names/#resolving-links-by-name).

NOTE: If you want containers to ONLY communicate with each other through links, start the docker daemon with `-icc=false` to disable inter process communication.

If you have a container with the name CONTAINER (specified by `docker run -name CONTAINER`) and in the Dockerfile, it has an exposed port:
```
EXPOSE 1337
```

Then if we create another container called LINKED like so:

```
docker run -d -link CONTAINER:ALIAS -name LINKED user/wordpress
```

Then the exposed ports and aliases of CONTAINER will show up in LINKED with the following environment variables:

```
$ALIAS_PORT_1337_TCP_PORT
$ALIAS_PORT_1337_TCP_ADDR
```

And you can connect to it that way.

To delete links, use `docker rm -link `.

## Volumes

Docker volumes are [free-floating filesystems](http://docs.docker.io/use/working_with_volumes/).  They don't have to be connected to a particular container.

Volumes are useful in situations where you can't use links (which are TCP/IP only).  For instance, if you need to have two docker instances communicate by leaving stuff on the filesystem.

You can mount them in several docker containers at once, using `docker run -volume-from`

See [advanced volumes](http://crosbymichael.com/advanced-docker-volumes.html) for more details.

## Exposing ports

Exposing ports through the host container is [fiddly but doable](http://docs.docker.io/use/port_redirection/#binding-a-port-to-an-host-interface).

First expose the port in your Dockerfile:

```
EXPOSE <CONTAINERPORT>
```

Then map the container port to the host port (only using localhost interface):

```
docker run -p 127.0.0.1:$HOSTPORT:$CONTAINERPORT -name CONTAINER -t someimage
```

If you're running Docker in Virtualbox, you then need to forward the port there as well.  It can be useful to define something in Vagrantfile to expose a range of ports so that you can dynamically map them:

```
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  ...

  (49000..49900).each do |port|
    config.vm.network :forwarded_port, :host => port, :guest => port
  end

  ...
end
```

If you forget what you mapped the port to on the host container, use `docker port` to show it:

```
docker port CONTAINER $CONTAINERPORT



## Tips

1. Docker image cleanup

When developing with Docker it is quite easy to accumulate a pile of images you never use, and containers that have long ago stopped and are disposable. It is fairly important to stay vigilant and keep cleaning up. Any complex docker environments are going to need a very clean process for eliminating unnecessary containers and images.

2.

```
wget http://stedolan.github.io/jq/download/source/jq-1.3.tar.gz
tar xzvf jq-1.3.tar.gz
cd jq-1.3
./configure && make && sudo make install
docker inspect `dl` | jq -r '.[0].NetworkSettings.IPAddress'
```
or (this is unverified)

```
docker inspect -f '{{ .NetworkSettings.IPAddress }}' <container_name>
```

### Get Environment Settings

```
docker run -rm ubuntu env
```

### Delete old containers

```
docker ps -a | grep 'weeks ago' | awk '{print $1}' | xargs docker rm
```

### Show image dependencies

```
docker images -viz | dot -Tpng -o docker.png
```


### Docker Projects

1. [Discourse](https://github.com/discourse/discourse_docker)

credit by Discoure sysadmin [Michael Brown](https://twitter.com/Supermathie)

This solution is 100% transparent and hackable for other purposes

The [launcher](https://github.com/discourse/discourse_docker/blob/master/launcher) shell script has no logic regarding Discourse built in. Nor does pups, the yaml based image bootstrapper inspired by ansible. You can go ahead and adapt this solution to your own purposes and extend as you see fit.

I took it on myself to create the most complex of setup first, however this can easily be adapted to run separate applications per container using the single base image. You may prefer to run PostgreSQL and Redis in a single container and the web in another, for example. The base image has all the programs needed, copy-on-write makes storage cheap.

I elected to keep all persistent data outside of the container, that way I can always throw away a container and start again from scratch, easily.


This is how you would work through it

Install Ubuntu 12.04.03 LTS
sudo apt-get install git
git clone https://github.com/SamSaffron/discourse_docker.git
cd discourse_docker, run ./launcher for instructions on how to install docker
Install docker
Modify the base template to suit your needs (standalone.yml.sample):

    # this is the base template, you should not change it
    template: "standalone.template.yml"
    # which ports to expose?
    expose:
      - "80:80"
      - "2222:22"

    params:
      # ssh key so you can log in
      ssh_key: YOUR_SSH_KEY
      # git revision to run
      version: HEAD


      # host name, required by Discourse
      database_yml:
        production:
          host_names:
            # your domain name
            - www.example.com


    # needed for bootstrapping, lowercase email
    env:
      DEVELOPER_EMAILS: 'my_email@email.com'

Save it as say, web.yaml
Run sudo ./launcher bootstrap web to create an image for your site
Run sudo ./launcher start web to start the site
At this point you will have a Discourse site up and running with sshd / nginx / postgresql / redis / unicorn running in a single container with runit ensuring all the processes keep running. (though I still need to build in a monitoring bits)

At no point during this setup did you have to pick the redis and postgres version, or mess around with nginx config files. It was all scripted in a completely reproducible fashion.


2. [Phusion - Baseimage-docker](https://github.com/phusion/baseimage-docker)

A minimal Ubuntu base image modified for Docker-friendliness

3. [Phusion - passenger-docker](https://github.com/phusion/passenger-docker)

A Docker base image for Ruby, Python, Node.js and Meteor web apps

4. [Progrium - buildstep](https://github.com/progrium/buildstep)

Buildstep uses Docker and Buildpacks to build applications like Heroku

5. [RelateIQ - docker_public](https://github.com/relateiq/docker_public)

Instant RelateIQ Development Environment

6. [komljen - dockerfile-examples](https://github.com/komljen/dockerfile-examples)

7. [nsenter](https://github.com/jpetazzo/nsenter)

It is a small tool allowing to enter into namespaces. Technically, it can enter existing namespaces, or spawn a process into a new set of namespaces. "What are those namespaces you're blabbering about?" We are talking about container namespaces.

### Must Read

[Docker vs Vagrant](https://medium.com/@_marcos_otero/docker-vs-vagrant-582135beb623)
[Docker Warning](https://devopsu.com/blog/docker-misconceptions/)
[Libswarm in a nutshell](http://www.tech-d.net/2014/07/03/libswarm/)
[Docker DNS](http://sysadmin-innovations.blogspot.com/2014/03/dockerdns-main-page.html)
[A Docker Registry](http://bitjudo.com/blog/2014/03/12/authentication-for-a-docker-registry/)

#### Docker blogs

[tech-d](http://www.tech-d.net/)
[bitjudo](http://bitjudo.com/)
[Jérôme Petazzoni](http://jpetazzo.github.io/)
[Docker Engineer Nathan](http://nathanleclaire.com/)
[Tutum's Docker](https://learn.tutum.co/tag/7/docker)
[TheNewStack](http://thenewstack.io/)


### Github
[Solomon Hykes](https://github.com/shykes)
[kubernetes](https://github.com/GoogleCloudPlatform/kubernetes)
[Dokku](https://github.com/progrium/dokku)

Docker powered mini-Heroku. The smallest PaaS implementation you've ever seen.

### Credits

[Discourse in a docker container](http://samsaffron.com/archive/2013/11/07/discourse-in-a-docker-container)
[Flux7's Blog](http://blog.flux7.com/blogs/)
[Flux7's Docker Tutorial Series](http://blog.flux7.com/blogs/docker/docker-tutorial-series-part-1-an-introduction)
