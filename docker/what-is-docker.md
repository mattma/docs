## Why would I use Docker over plain LXC?

Docker is not a replacement for lxc. "lxc" refers to capabilities of the linux kernel (specifically namespaces and control groups) which allow sandboxing processes from one another, and controlling their resource allocations.

On top of this low-level foundation of kernel features, Docker offers a high-level tool with several powerful functionalities:

Portable deployment across machines. Docker defines a format for bundling an application and all its dependencies into a single object which can be transferred to any docker-enabled machine, and executed there with the guarantee that the execution environment exposed to the application will be the same. Lxc implements process sandboxing, which is an important pre-requisite for portable deployment, but that alone is not enough for portable deployment. If you sent me a copy of your application installed in a custom lxc configuration, it would almost certainly not run on my machine the way it does on yours, because it is tied to your machine's specific configuration: networking, storage, logging, distro, etc. Docker defines an abstraction for these machine-specific settings, so that the exact same docker container can run - unchanged - on many different machines, with many different configurations.

Application-centric. Docker is optimized for the deployment of applications, as opposed to machines. This is reflected in its API, user interface, design philosophy and documentation. By contrast, the lxc helper scripts focus on containers as lightweight machines - basically servers that boot faster and need less ram. We think there's more to containers than just that.

Automatic build. Docker includes a tool for developers to automatically assemble a container from their source code, with full control over application dependencies, build tools, packaging etc. They are free to use make, maven, chef, puppet, salt, debian packages, rpms, source tarballs, or any combination of the above, regardless of the configuration of the machines.

Versioning. Docker includes git-like capabilities for tracking successive versions of a container, inspecting the diff between versions, committing new versions, rolling back etc. The history also includes how a container was assembled and by whom, so you get full traceability from the production server all the way back to the upstream developer. Docker also implements incremental uploads and downloads, similar to "git pull", so new versions of a container can be transferred by only sending diffs.

Component re-use. Any container can be used as an "base image" to create more specialized components. This can be done manually or as part of an automated build. For example you can prepare the ideal python environment, and use it as a base for 10 different applications. Your ideal postgresql setup can be re-used for all your future projects. And so on.

Sharing. Docker has access to a public registry (http://index.docker.io) where thousands of people have uploaded useful containers: anything from redis, couchdb, postgres to irc bouncers to rails app servers to hadoop to base images for various distros. The registry also includes an official "standard library" of useful containers maintained by the docker team. The registry itself is open-source, so anyone can deploy their own registry to store and transfer private containers, for internal server deployments for example.

Tool ecosystem. Docker defines an API for automating and customizing the creation and deployment of containers. There are a huge number of tools integrating with docker to extend its capabilities. PaaS-like deployment (Dokku, Deis, Flynn), multi-node orchestration (maestro, salt, mesos, openstack nova), management dashboards (docker-ui, openstack horizon, shipyard), configuration management (chef, puppet), continuous integration (jenkins, strider, travis), etc. Docker is rapidly establishing itself as the standard for container-based tooling.



Example:  A multi-container application stack

In our sample application, we're going to build a series of images that will allow
us to deploy a multi-container application:
• A Node container to serve our Node application, linked to:
• A Redis primary container to hold and cluster our state, linked to:
• Two Redis replica containers to cluster our state.
• A logging container to capture our application logs.

We're then going to run our Node application in a container with Redis in primaryreplica
configuration in multiple containers behind it.


docker run -d --name nodeapp -p 8080:3000 --link redis_primary:redis_primary book/nodejs
docker run -d -h redis_primary   --name redis_primary    book/redis_primary
docker run -d -h redis_replica1   --name redis_replica1   --link redis_primary:redis_primary book/redis_replica
docker run -d -h redis_replica2   --name redis_replica2   --link redis_primary:redis_primary book/redis_replica

docker run -d --name logstash --volumes-from redis_primary --volumes-from nodeapp book/logstash
docker logs -f logstash
# create a hostname and container name   redis_primary based on book/redis_primary image which built on the `Dockerfile`

Our session state will also be recorded and stored in our
primary Redis container, redis_primary, then replicated to our Redis replicas:
redis_replica1 and redis_replica2.

# to generate a one time log reading file
# Woot! We're off and replicating between our redis_primary container and our
# redis_replica1 container.

docker run -it --rm --volumes-from redis_primary ubuntu cat /var/log/redis/redis-server.log
docker run -it --rm --volumes-from redia_replica ubuntu cat /var/log/redis/redis-replica.log


Here we've run another container interactively. We've specified the --rm flag,
which automatically deletes a container after the process it runs stops. We've
also specified the --volumes-from flag and told it to mount the volumes from
our redis_primary container. Then we've specified a base ubuntu image and
told it to cat the cat /var/log/redis/redis-server.log log file. This takes advantage
of volumes to allow us to mount the /var/log/redis directory from the
redis_primary container and read the log file inside it. We're going to see more
about how we can use this shortly.

We've again specified
the --rm flag, which automatically deletes a container after the process it
runs stops. We've specified the --volumes-from flag and told it to mount the volumes
from our redis_replica1 container this time. Then we've specified a base
ubuntu image and told it to cat the cat /var/log/redis/redis-replica.log log
file.

