## Kubernetes Book review

Kubernetes Node

Check `iptables` rules after `kube-proxy` run, `sudo iptables -t nat -S`, `sudo iptables -t nat -L`

Beware of iptables version
Kubernetes uses iptables to implement service proxy. iptables with version 1.4.11+ is recommended on Kubernetes. Otherwise iptable rules might be out of control and keep increasing. You can use `yum info iptables` to check current version of iptables.

Check out your node capacity in minion

```bash
kubectl get nodes -o json | jq '.items[] | {name: .metadata.name, capacity: .status.capacity}'
```

- Create etcd user

Due to security reason, create local user and group who can own etcd packages.

```bash
# reate group(-U), home directory(-d), and create it(-m)
# name in GCOS field (-c), login shell(-s)
sudo useradd -U -d /var/lib/etcd -m -c "etcd user" -s /sbin/nologin etcd
```

You can check /etc/passwd whether create etcd user has created or not.

```bash
# search etcd user on /etc/passwd, uid and gid is vary
grep etcd /etc/passwd
```

```bash
# delete user etcd
sudo userdel -r etcd
```

check the process ID 1 on your system. Type `ps -P 1` to see the process name as below. To check on your Linux either systemd or init,


- Flannel networking configuration

After Flannel service starts, you should be able to see a file in `/run/flannel/subnet.env` and flannel0 bridge in `ifconfig`.

After flanneld is up and running, using `ifconfig` or `ip` command to see there is a `flannel0` virtual bridge in the interface.

```bash
# check current ipv4 range
# output: inet 192.168.50.0/16 scope global flannel0
ip a | grep flannel | grep inet
```

We can see the above example the subnet lease of flannel0 is `192.168.50.0/16`. Whenever your flanneld service starts, flannel will acquire the subnet lease and save in etcd, and then write out the environment variable file in `/run/flannel/subnet.env` by default, or you could change the default path by --subnet-file parameter when launching it.

Integrating with docker

flannel already allocate one subnet (/run/flannel/subnet.env) with suggested `MTU` and `IPMASQ` setting. Docker daemon need the corresponding parameter

```bash
--bip=””  # Specify network bridge IP (docker0)
--mtu=0   # Set the container network MTU (for docker0 and veth)
--ip-masq=true  # Enable IP masquerading
```

ex: `/usr/bin/docker daemon --bip=\${FLANNEL_SUBNET} --mtu=\${FLANNEL_MTU} -H fd://` Staring docker by service docker start, and type ifconfig, you might be able to see the virtual network device docker0 and its allocated IP address from flannel.

How it works?

There are 2 virtual bridges named `flannel0` and `docker0` are created in previous steps. Let’s take a look on their IP range by ip command.

```bash
# checkout IPv4 network in local
ip -4 a | grep inet

# check the route
route -n
```

every pod will have its own IP address, and packet is encapsulated so that pod IPs are routable. The packet from Pod1 will go though veth (virtual network interface) device that connects to docker0, and routes to flannel0. The traffic is encapsulated by flanneld and send to the host (10.42.1.172) of target pod.


- system unit file

```bash
# make sure kube-apiserver is the first started daemon
After=kube-apiserver.service
Wants=kube-apiserver.service
```

```bash
# healthy API server, service must be in active state
Requires=kube-apiserver.service
```

`Requires` has more strict restrictions. In case that daemon kube-apiserver is crashed, kube-scheduler and kube-controller-manager would also be stopped. On the other hand, configuration with Requires is hard for debugging master installation. It is recommended that you enable this parameter once you make sure every setting is correct.


If one node is expected as `Ready` but `NotReady`, go to that node to restart  docker and minion service by `service docker start` and `service kubernetes-minion start`

```bash
 ➜ kubectl describe svc naohai
Name:           naohai
Namespace:      default
Labels:         name=naohai,role=marketing,version=canary
Selector:       name=naohai,role=marketing,version=canary
Type:           LoadBalancer
IP:         10.100.209.179
Port:           <unnamed>   3011/TCP
NodePort:       <unnamed>   31009/TCP
Endpoints:      10.244.64.27:3001,10.244.99.15:3001
Session Affinity:   None
No events.
```

`Port` here is an abstract Service port, which allows any other resources to access the Service within the cluster.
`nodePort` will be indicated the external port for allowing external access.
`targetPort` is the port the container allows traffic into, by default it will be the same with Port.

The illustration is as below. External access will access Service with nodePort. Service acts as a load balancer to dispatch the traffic to Pod by Port 80. Pod will then pass through the traffic into the corresponding container by targetPort 80.


In any nodes or master (if your master has flannel installed), you should be able to curl internal ip endpoint. ex: curl 192.168.50.4:80


---

etcd: the store where cluster configuration

api-server: everything goes through API server. All other components watch API server, they do not know anything about etcd, etc.

rc: standalone binary, talk to API server, figure out what he needs to do

scheduler: global thing, find better resource in the cluster to run pods and rc

proxy: Unique, run on each host, help for service discovery

Kubelet: run on each worker node, know how to talk to docker, do the thing which be told by scheduler

Each component is plugable, can be pulled out, and replace by your own. because they simply just talk to API server.


When you launch a service, how do you use this service IP?

ex: POSTGRES_SERVICE_HOST, POSTGRES_SERVICE_PORT. (Environment variable) Whenever you deploy a k8s pods, it will inject all the service ip and port to your namespace, it gave you the username and password how to get there. It also has configuration management built in k8s. When you deploy the pod, it gave those config setting, k8s can do 2 things. 1) mount a temp volume that you specify, so your app can look on disc for configs. 2) allow your app to make HTTP call to grab the configs.

# [Kubernetes](http://kubernetes.io/)

Kubernetes (From Greek, pilot or helmsman) is an open source project and written in go. It is an orchestration system to manage a cluster of Linux containers as a single system. It manage and run Docker containers across multiple hosts, offering co-location of containers, service discovery, replication control, and provides basic mechanisms for deployment, maintenance, and scaling of applications. With the Kubernetes APIs, users can manage application infrastructure - such as load balancing, service discovery, and rollout of new versions - in a way that is consistent and fault-tolerant.

Kubernetes is essentially a cluster manager for Docker. With it, you can schedule and deploy any number of container replicas onto a node cluster and Kubernetes will take care of making decisions like which containers go on which servers for you. Kubernetes uses Docker to package, instantiate, and run containerized applications.

Kubernetes provide declarative primitives for the desired state. Kubernetes self-healing mechanisms, such as auto-restarting, re-scheduling, and replicating containers then ensure this state is met. The user just define the state and Kubernetes ensures that the state is met at all times on the cluster.

Benefits:  it packages all necessary tools — orchestration, service discovery, load balancing

- Difference between PaaS and Kubernetes

Developers dealing with PaaS will push the code along with the metadata that has the requirements and dependencies of the application. The PaaS engine looks up the metadata configuration to provision the code. Once the application moves into production, PaaS will scale, monitor and manage the application lifecycle.

Kubernetes and Docker deliver the promise of PaaS through a simplified mechanism. Once the system administrators configure and deploy Kubernetes on a specific infrastructure, developers can start pushing the code into the clusters. This hides the complexity of dealing with the command line tools, APIs and dashboards of specific IaaS providers.

Developers can define the application stack in a declarative form and Kubernetes will use that information to provision and manage the pods. If the code, the container or the VM experience disruption, Kubernetes will replace that entity with a healthy one.

When we provision containers, the same process repeats. But, instead of provisioning a new VM, the container orchestration engine might decide to boot the container in one of the running VMs. Based on the current availability of VMs, the orchestrator may also decide to launch a new VM and run the container within that. So, container orchestration does to the VMs what a fabric controller does to the physical hardware.

Kubernetes is capable of launching containers in existing VMs or even provisioning new VMs and placing the containers in that. It goes beyond booting containers to monitoring and managing them. With Kubernetes, administrators can create Pods, which are logical collections of containers that belong to an application. These Pods are provisioned within the VMs or bare metal servers.

it is a container cluster manager from Google that offers a unique workflow for managing containers across multiple machines.

CoreOS maintains a full tutorial on [running an elastic Kubernetes cluster on EC2](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/aws.md). Running Kubernetes on non-Google platforms is made possible by the CoreOS project [flannel](https://github.com/coreos/flannel), which provides cross-container networking on any cloud provider.

Kubernetes introduces the concept of a pod, which represents a group of containers that should be deployed as a single logical service. The pod concept tends to fit well with the popular pattern of running a single service per container. Kubernetes makes it easy to run multiple pods on a single machine or across an entire cluster for better resource utilization and high availability. Kubernetes also actively monitors the health of pods to ensure they are always running within the cluster.

etcd takes care of storing and replicating data used by Kubernetes across the entire cluster, and thanks to the Raft consensus algorithm etcd can recover from hardware failure and network partitions.

Kubernetes is defined by states, not processes.


Kubernetes has declarative language for launching containers (application components). Services define how pods are consumed.


Master: Server with the Kubernetes API service. Multi master configuration is on the roadmap.
Minion: Each of the multiple Docker hosts with the Kubelet service that receive orders from the master, and manages the host running containers.
Pod: Defines a collection of containers tied together that are deployed in the same minion, for example a database and a web server container.
Replication controller: Defines how many pods or containers need to be running. The containers are scheduled across multiple minions.
Service: A definition that allows discovery of services/ports published by containers, and external proxy communications. A service maps the ports of the containers running on pods across multiple minions to externally accesible ports.
kubecfg: The command line client that connects to the master to administer Kubernetes.


While Docker provides the lifecycle management of containers, Kubernetes takes it to the next level by providing orchestration and managing clusters of containers.


How it works?

a pod configuration describes a Docker container and port mapping. Pods also define a label which is used for service discovery.

Kubernetes as a project that builds on the idea that the datacenter is the computer, and Kubernetes provides an API to manage it all. allows us to think about the cluster as a whole and less about each individual machine. In the Kubernetes model we don't deploy containers to specific hosts, instead we describe the containers we want running, and Kubernetes figures out how and where to run them. This declarative style of managing infrastructure opens up the door for large scale deployments and self healing infrastructures.

Kubernetes introduces the concept of a Pod, which is a group of dependent containers that share networking and a filesystem. Pods are great for applications that benefit from collocating services such as a caching server or log manager. Pods are created within a Kubernetes cluster through specification files that are pushed to the Kubernetes API. Kubernetes then schedules Pod creation on a machine in the cluster.

At this point the Kubelet service running on the machine kicks in and starts the related containers via the Docker API. It’s the Kubelet’s responsibility to keep the scheduled containers up and running until the Pod is either deleted or scheduled onto another machine.

Next Kubernetes provides a form of service discovery based on labels. Each collection of Pods can have an arbitrary number of labels which can be used to locate them. For example, to locate the Redis service running in production you could use the following labels to perform a label query:  `service=redis,environment=production`

Finally, Kubernetes ships with a TCP proxy that runs on every host. The TCP proxy is responsible for mapping service ports to label queries. The idea is that consumers of a service could contact any machine in a Kubernetes cluster on a service port and the request is load balanced across Pods responsible for that service.

The service proxy works even if the target Pods runs on other hosts. It should also be noted that every Pod in a Kubernetes cluster has its own IP address, and has the ability to communicate with other Pods within the cluster.

- Service discovery

Kubernetes allows defining services, a way for containers to use discovery and proxy requests to the appropriate minion. With this definition in `service-http.json`, we are creating a service with id jenkins pointing to the pod with the label name=jenkins, as declared in the pod definition, and forwarding the port 8888 to the container's 8080. Each service is assigned a unique IP address tied to the lifespan of the Service. If we had multiple pods matching the service definition the service would load balance the traffic across all of them.

Kubernetes is proxying the services in each minion the slaves will reconnect to the new Jenkins server automagically no matter where they run!

Another feature of services is that a number of environment variables are available for any subsequent containers ran by Kubernetes, providing the ability to connect to the service container, in a similar way as running linked Docker containers.

- Replication controllers

Replication controllers allow running multiple pods in multiple minions. Jenkins slaves can be run this way to ensure there is always a pool of slaves ready to run Jenkins jobs.

The podTemplate section allows the same configuration options as a pod definition. In this case we want to make the Jenkins slave connect automatically to our Jenkins master, instead of relying on Jenkins multicast discovery. To do so we execute the jenkins-slave.sh command with -master parameter to point the slave to the Jenkins master running in Kubernetes. Note that we use the Kubernetes provided environment variables for the Jenkins service definition (JENKINS_SERVICE_HOST and JENKINS_SERVICE_PORT). The image command is overridden to configure the container this way, useful to reuse existing images while taking advantage of the service environment variables. It can be done in pod definitions too.

The replication controller can automatically be resized to any number of desired replicas:

`kubectl resize jenkins-slave 2`



#### Installation

1. boot2docker

Install the latest [boot2docker](https://github.com/boot2docker/osx-installer/releases) binary

2. Get kubernetes binary

```bash
git clone https://github.com/GoogleCloudPlatform/kubernetes.git
cd kubernetes/build
# build the binaries using an included script
./release.sh
#  find the binaries at the default directory
ls -lash ~/kubernetes/_output/dockerized/bin/linux/amd64
cp ~/kubernetes/_output/dockerized/bin/linux/amd64/* /usr/local/bin/
```

While CoreOS recommends that you run third party applications via Docker containers, CoreOS does support running Kubernetes directly on the OS. The best way to do that is by creating systemd unit files and starting the Kubernetes components with systemctl.

- Creating a Kubernetes pod

Pods are how Kubernetes groups containers and define a logical deployment group. Lets take a look at a simple pod configuration for a Redis database.

```bash
{
  "id": "redis",
  "desiredState": {
    "manifest": {
      "version": "v1beta3",
      "id": "redis",
      "containers": [{
        "name": "redis",
        "image": "dockerfile/redis",
        "ports": [{
          "containerPort": 6379,
          "hostPort": 6379
        }]
      }]
    }
  },
  "labels": {
    "name": "redis"
  }
}
```



#### Pods

Kubernetes introduces the concept of a pod, which represents a group of containers that should be deployed as a single logical service. The pod concept tends to fit well with the popular pattern of running a single service per container. Kubernetes makes it easy to run multiple pods on a single machine or across an entire cluster for better resource utilization and high availability. Kubernetes also actively monitors the health of pods to ensure they are always running within the cluster.


A pod is the basic unit that Kubernetes deals with. Containers themselves are not assigned to hosts. Instead, closely related containers are grouped together in a pod. A pod generally represents one or more containers that should be controlled as a single "application".

Pods are the primary unit that Kubernetes will schedule into your cluster. A pod may consist of 1 or more containers. If you define more than 1 container they are guaranteed to be co-located on a system allowing you to share local volumes and networking between the containers.

This association leads all of the involved containers to be scheduled on the same host. They are managed as a unit and they share an environment. This means that they can share volumes and IP space, and can be deployed and scaled as a single application. You can and should generally think of pods as a single virtual computer in order to best conceptualize how the resources and scheduling should work.

The general design of pods usually consists of the main container that satisfies the general purpose of the pod, and optionally some helper containers that facilitate related tasks. These are applications that benefit from being run and managed in their own container, but are heavily tied to the main application.

Horizontal scaling is generally discouraged with pods, use "Replication Controllers".

#### Services

A service is a unit that acts as a basic load balancer and ambassador for other containers. This allows you to deploy a service unit that is aware of all of the backend containers to pass traffic to. External applications only need to worry about a single access point, but benefit from a scalable backend or at least a backend that can be swapped out when necessary.

Services are an interface to a group of containers so that consumers do not have to worry about anything beyond a single access location. By deploying a service, you easily gain discover-ability and can simplify your container designs.

Services are user-defined “load balancers” that are aware of the container locations and their labels. When a user creates a service, a proxy will be created on the Kubernetes nodes that will seamlessly proxy to any container that has the selected labels assigned.

```json
{
  "id": "mysite",
  "kind": "Service",
  "apiVersion": "v1beta3",
  "port": 10000,
  "selector": {
    "name": "mysite"
  },
  "labels": {
    "name": "mysite"
  }
}
```

This is a basic example that creates a service that listens on port `10000`, but will proxy to any pod that fulfills the “selector” requirements of “name: mysite”. If you have 1 container running, it will get all the traffic, if you have 3, they will each receive traffic. If you grow or shrink the number of containers, the proxies will be aware and balance accordingly.

#### Replication Controllers

A more complex version of a pod is a replicated pod. These are handled by a type of work unit known as a replication controller.

A replication controller is a framework for defining pods that are meant to be horizontally scaled. The work unit is, in essence, a nested unit. A template is provided, which is basically a complete pod definition. This is wrapped with additional details about the replication work that should be done.

The replication controller is delegated responsibility over maintaining a desired number of copies. This means that if a container temporarily goes down, the replication controller might start up another container. If the first container comes back online, the controller will kill off one of the containers.

A replication controller ensures that a specified number of pod "replicas" are running at any one time. If there are too many, it will kill some. If there are too few, it will start more. ex: node failure, disruptive node maintenance, kernel upgrade. It works like a process supervisor, only it supervises multiple pods across multiple nodes instead of individual processes on a single node. Replication controller delegates local container restarts to some agent on the node (e.g., Kubelet or Docker).

`replicationcontroller` is only appropriate for pods with `RestartPolicy = Always`. `replicationcontroller` should refuse to instantiate any pod that has a different restart policy.

A replication controller will never terminate on its own, but it isn't expected to be as long-lived as services. Services may be composed of pods controlled by multiple replication controllers, and it is expected that many replication controllers may be created and destroyed over the lifetime of a service. Both services themselves and their clients should remain oblivious to the replication controllers that maintain the pods of the services.

- Responsibilities of the replication controller

ensures that the desired number of pods matches its label selector and are operational. It will not perform readiness nor liveness probes. Rather than performing auto-scaling, it is intended to be controlled by an external auto-scaler, which would change its `replicas` field.

The replication controller is intended to be a composable building-block primitive.

We will not add scheduling policies (e.g., spreading) to replication controller. Nor should it verify that the pods controlled match the currently specified template, as that would obstruct auto-sizing and other automated processes. Similarly, completion deadlines, ordering dependencies, configuration expansion, and other features belong elsewhere.

- How does a replication controller work?

* Pod template

A replication controller creates new pods from a template, currently inline in the `replicationcontroller` object. Rather than specifying the current desired state of all replicas, pod templates are like cookie cutters. Once a cookie has been cut, the cookie has no relationship to the cutter. Subsequent changes to the template or even switching to a new template has no direct effect on the pods already created.

Similarly, pods created by a replication controller may subsequently be updated directly. This is in deliberate contrast to pods, which do specify the current desired state of all containers belonging to the pod. Pods created by a replication controller are intended to be fungible and semantically identical, though their configurations may become heterogeneous over time.

replication controllers can also be used to maintain availability of master-elected, sharded, and worker-pool applications. Such applications should use dynamic work assignment mechanisms, such as the etcd lock module or RabbitMQ work queues.

* Labels

A Kubernetes organizational concept outside of the work-based units is labeling. A label is basically an arbitrary tag that can be placed on the above work units to mark them as a part of a group. These can then be selected for management purposes and action targeting.

Labels are fundamental to how both services and replication controllers function. To get a list of backend servers that a service should pass traffic to, it selects containers based on labels that have been given to them.

Conceptually, labels are similar to standard metadata tags except that they are arbitrary key/value pairs. Labels are primarily used by services to build powerful internal load balancing proxies, but can also be filter output from the API.

Similarly, replication controllers give all of the containers spawned from their templates the same label. This makes it easy for the controller to monitor each instance. The controller or the administrator can manage all of the instances as a group, regardless of how many containers have been spawned.

Labels are given as key-value pairs. Each unit can have more than one label, but each unit can only have one entry for each key. You can stick with giving pods a "name" key as a general purpose identifier, or you can classify them by various criteria such as development stage, public accessibility, etc.

In many cases you'll want to assign many labels for fine-grained control. You can then select based on a single or combined label requirements.

The population of pods that a `replicationcontroller` is monitoring is defined with a `label selector`, which creates a loosely coupled relationship between the controller and the pods controlled, in contrast to pods, which are more tightly coupled.

The replication controller should verify that the pods created from the specified template have labels that match its label selector. Though it isn't verified yet, you should also ensure that only one replication controller controls any given pod, by ensuring that the label selectors of replication controllers do not target overlapping sets.

Note that `replicationcontrollers` may themselves have labels and would generally carry the labels their corresponding pods have in common, but these labels do not affect the behavior of the replication controllers.

Pods may be removed from a replication controller's target set by changing their labels. This technique may be used to remove pods from service for debugging, data recovery, etc. Pods that are removed in this way will be replaced automatically (assuming that the number of replicas is not also changed).

Similarly, deleting a replication controller does not affect the pods it created. It's replicas field must first be set to 0 in order to delete the pods controlled.

- Common usage patterns

* Rescheduling

ensure that the specified number(1 or 1000) of pods exists, even in the event of node failure or pod termination (e.g., due to an action by another control agent).

* Scaling

scale the number of replicas up or down, either manually or by an auto-scaling control agent, by simply updating the `replicas` field.

* Rolling updates

facilitate rolling updates to a service by replacing pods one-by-one.

the recommended approach is to create a new replication controller with 1 replica, resize the new (+1) and old (-1) controllers one by one, and then delete the old controller after it reaches 0 replicas. This predictably updates the set of pods regardless of unexpected failures.

The two replication controllers would need to create pods with at least one differentiating label, such as the image tag of the primary container of the pod, since it is typically image updates that motivate rolling updates.

* Multiple release tracks

In addition to running multiple releases of an application while a rolling update is in progress, it's common to run multiple releases for an extended period of time, or even continuously, using multiple release tracks. The tracks would be differentiated by labels.

Example: a service might target all pods with tier in (frontend), environment in (prod) with 10 replicated pods that make up this tier. But you want to be able to 'canary' a new version of this component.

A `replicationcontroller `with replicas set to 9 for the bulk of the replicas, with labels `tier=frontend, environment=prod, track=stable`, and another `replicationcontroller` with replicas set to 1 for the `canary`, with labels `tier=frontend, environment=prod, track=canary`.

Now the service is covering both the canary and non-canary pods. But you can mess with the `replicationcontrollers` separately to test things out, monitor the results, etc.

#### Use kubernetes

Kubernetes provides a RESTful API in order to manipulate the three main resources: pods, services, and replicationControllers.

A pod file is a json representation of the task you want to run. A simple pod configuration for a Redis master container might look like this:

```js
{
  "ApiVersion": "V1beta1",
  "Kind": "Pod",
  "Id": "Redis-Master-Pod",
  "DesiredState": {
    "Manifest": {
      "Version": "V1beta1",
      "Id": "Redis-Master-Pod",
      "Containers": [{
        "Name": "Redis-Master",
        "Image": "Gurpartap/Redis",
        "Ports": [{ "Name": "Redis-Server", "ContainerPort": 6379 }]
      }]
    }
  },
  // labels used for service discovery
  "Labels": { "Name": "Redis", "Role": "Master" }
}
```

```bash
# send a request to your running Kubernetes API serve
kubecfg -c my-pod-directory/redis-master-pod.json create /pods
# Verify the pod is running by listing the pods
kubecfg list /pods
# delete your pod
kubecfg delete /pods/redis-master-pod
```

- Replication Controllers

Along with the `service`, the replicationController uses the pod's labels in order to do its job. In short, the role of the replicationController is to ensure that a certain number of replicas of each pod are running. If there are too many, it will kill them, and if there are too few, it spins them up. The pods that the replicationController monitors is determined via labels.

```js
{
  "Id": "RedisSlaveController",
  "Kind": "ReplicationController",
  "ApiVersion": "V1beta1",
  "DesiredState": {
    // want two replicas of the Redis template you've defined
    // Kubernetes works to make sure you have two running at all times
    "Replicas": 2,
    "ReplicaSelector": {"Name": "Redisslave"},
    "PodTemplate": {
      "DesiredState": {
         "Manifest": {
           "Version": "V1beta1",
           "Id": "RedisSlaveController",
           "Containers": [{
             "Name": "Slave",
             "Image": "Brendanburns/Redis-Slave",
             "Ports": [{"ContainerPort": 6379, "HostPort": 6380}]
           }]
         }
       },
       "Labels": {"Name": "Redisslave"}
      }},
  "Labels": {"Name": "Redisslave"}
}
```

- Services

In Kubernetes, a service is a config unit for the proxies running on the minion nodes. It too can have a name and labels, and it points to one or more pods. It provides an endpoint for load balancing across a replicated group of pods.

#### Kubernetes Design overview

Kubernetes is a system for managing containerized applications across multiple hosts, providing basic mechanisms for deployment, maintenance, and scaling of applications. Kubernetes establishes robust declarative primitives for maintaining the desired state requested by the user. Self-healing mechanisms, such as auto-restarting, re-scheduling, and replicating containers require active controllers, not just imperative orchestration.

The system automatically chooses hosts to run those containers on.

- Architechture - Kubernetes Node

A running Kubernetes cluster contains node agents (kubelet) and master components (APIs, scheduler, etc), on top of a distributed storage solution. The Kubernetes node has the services necessary to run application containers and be managed from the master systems. Each node runs Docker. Docker takes care of the details of downloading images and running containers.

* Kubelet: manages pods and their containers, their images, their volumes, etc.

* Kube-Proxy: Each node also runs a simple network proxy and load balancer. It reflects services as defined in the Kubernetes API on each node and can do simple TCP/UDP stream forwarding (round robin) across a set of backends.

Service endpoints are currently found via DNS or through environment variables (both Docker-links-compatible and Kubernetes {FOO}_SERVICE_HOST and {FOO}_SERVICE_PORT variables are supported). These variables resolve to ports managed by the service proxy.





Provide a way to schedule Docker containers, to decouple application from the infrastructure and envrionment. (Decouple, Portability, Gateway to access manangement). It runs anywhere, manage applications, not machines, written in Go, it is Lean, extensible and portable.

Every machines in the Rack is being provision into exactly same shape.

(Cluster Scheduler => Scheduled Containers) => Node Container Manager => Managed Base OS

Kubernetes take care of Cluster Scheduler (replication and resizing) and Scheduled Containers across machines.

Query is the live object, running all the times, execute the label query to the set of the pod to match those  query. Reconsiller agent run on each host to reconsile the label query. To make sure the desiredState match the currentState. This is the declarative definition, dev changes the desiredState, then system will make sure the currentState will match the desiredState


Services: https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/services.md

Parameter values come from Environment variable. If you `docker inspect` your container, you will see Object has a key of "Env", then output "Master" `SERVICE_PORT` and `SERVICE_HOST` to the outside world. Every single host machines that we run those containers on exposed service proxy, this service proxy responsible on maintaining the service to container connection. Open up a particular port for every single service that they knows about in the system, it provides load balancing abstraction. Do not need to worry about where it is located at.

https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/container-environment.md#cluster-information-1

Currently the list of all services that are running at the time when the container was created via the Kubernetes Cluster API are available to the container as environment variables.  The set of environment variables matches the syntax of Docker links.

FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>

In your application logic, either in database connection, or backend service connection, get the dynamic value from Environment variable, so that your application talks to one single end point, service proxy end point.

In database design, Write operation database will stay at Master machine, then read operation could have multiple slave database machines, so that your database could scale horizontally. Add more slave machines as needed.

* Why can't my containers find the service they need to connect to?

You need to create the service before creating the pods that will connect to the service. Also ensure you are using the correct environment variable names. https://github.com/GoogleCloudPlatform/kubernetes/wiki/Debugging-FAQ

- [Kubernetes User Interface](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/ui.md)

Running locally by starting the server:

```bash
# http://localhost:8001/static/index.html#/groups//selector
kubectl proxy --www=$PWD/www
```

The Kubernetes user interface is a query-based visualization of the Kubernetes API. The user interface is defined by two functional primitives:

* GroupBy

`GroupBy` takes a label `key` as a parameter, places all objects with the same value for that key within a single group. For example /groups/host/selector groups pods by host. /groups/name/selector groups pods by name. Groups are hiearchical, for example /groups/name/host/selector first groups by pod name, and then by host.

* Select

Select takes a `label selector` and uses it to filter, so only resources which match that label selector are displayed. For example, /groups/host/selector/name=frontend, shows pods, grouped by host, which have a label with the name frontend.


- Login a Docker private registry

Docker stores keys for private registries in a `.dockercfg` file. Create a config file by running docker login <registry>.<domain> and then copying the resulting `.dockercfg` file to the kubelet working dir. The kubelet working dir varies by cloud provider. It is `/` on GCE and `/home/core` on CoreOS. You can determine the working dir by running this command: `sudo ls -ld /proc/$(pidof kubelet)/cwd` on a kNode.

All users of the cluster will have access to any private registry in the `.dockercfg`.

- Preloading Images

Be default, the kubelet will try to pull each image from the specified registry. However, if the `imagePullPolicy` property of the container is set to `IfNotPresent` or `Never`, then a local image is used

This can be used to preload certain images for speed or as an alternative to authenticating to a private registry.

Pull Policy is per-container, but any user of the cluster will have access to all local images.


#### note

Removing list of vms in vagrant cache

```bash
vagrant global-status --prune
```

Declarative > imperative

State your desired results, let the system actuate

Control loops: Observe, rectify, repeat

Simple > Complex:  Try to do as little as possible.


### CoreOS

factory reset of CoreOS updating policy

```bash
rm -Rf /
roboot
```

grpc and json api. what is JSON, marshall and unmarshall JSON, kubernetes spend 50%, coreos cpu take 60% of time.


## issues

1. after add more worker nodes into the cluster in vagrant, then `vagrant destroy` workers nodes,
use `kubectl get nodes`, the deleted node becomes `Not Ready` state. but it is still being scheduled with jobs.


## CoreOS distributed System.

#### What is CoreOS?

linux os for distributed platform Era
runs applications in containers
distributed by default
automatically security updates

How automatically works?

Separate application dependencies and host dependencies, ssh update and break the applicaiton web server.
Web application has to package into a container which has its own isolated dependencies.
Docker provides a portable unit to share among host and distributed infrastructure.


#### concepts

1. core

the processor, CPU or Central Processing Unit, is an important part of a functioning system, but it isn't the only one. Today's processors are almost all at least dual-core, meaning that the entire processor itself contains two separate cores with which it can process information.

A multi-core processor is a single computing component with two or more independent actual processing units (called "cores"), which are the units that read and execute program instructions.

2. dns

Short for Domain Name System (or Service or Server), an Internet service that translates domain names into IP addresses. Because domain names are alphabetic, they're easier to remember. The Internet however, is really based on IP addresses. Every time you use a domain name, therefore, a DNS service must translate the name into the corresponding IP address. For example, the domain name www.example.com might translate to 198.105.232.4.

Domain Name System is a hierarchical distributed naming system for computers, services, or any resource connected to the Internet or a private network. It associates various information with domain names assigned to each of the participating entities. Most prominently, it translates domain names, which can be easily memorized by humans, to the numerical IP addresses needed for the purpose of computer services and devices worldwide. The Domain Name System is an essential component of the functionality of most Internet services because it is the Internet's primary directory service.

The Domain Name System distributes the responsibility of assigning domain names and mapping those names to IP addresses by designating authoritative name servers for each domain. Authoritative name servers are assigned to be responsible for their supported domains, and may delegate authority over sub-domains to other name servers. This mechanism provides distributed and fault tolerant service and was designed to avoid the need for a single central database.

#### Q & A

1. for the google container registry, is it private or public, how can I browse it?

kube2sky     gcr.io/google_containers/kube2sky:1.3
pause           gcr.io/google_containers/pause:0.8.0

It currently cannot be browsed by because there is no UI for it.

2. every pod is created, it will create with a pause container as well. what is it?  command run "/pause"

Yes. pause container is created when the pod is created due to the networking info transformation. Like sidekicks.

3. service name is totally random?

- name: docker.service
  drop-ins:
    - name: 50-insecure-registry.conf

- name: flanneld.service
  command: start
  drop-ins:
    - name: 50-network-config.conf

SystemD has an order on starting the service files.

`50-insecure-registry.conf`, the extension need to be "conf", maybe, not too sure. but the name is really abtritry, you could name anything for your own memorization. the number is at the beginning. it is for triggering the applying order.

Systemd is applying the layers from 1 to 99. 50 is applied in the middle, hajack into the running services.

The service by default, it won't start, it is only registered with systemd, for example, `docker.service` is registered, only when you run the `docker run` or anything like that, it will trigger the start of the service.

4. difference between "drop-ins" and "write-files" in systems?

write-files will actually write a file with the unit files and the name that you declared
drop-ins will override the services with the additional configurations

it is layered from 1 to 99. 50 is the right in the middle.

4. CI rebuild the images, how to add dynamic tag to be pulled by kubernetes?

quay.io does not support the dynamic tag yet. To do it, you could add a git tag, then build with that tag by quay.io system.
Manually go to quay.io, using the restful api to trigger the certain commits to build the images. Restful API has not changed the last 6 months, very stable. can email the quay.io guy to get the rest api endpoint.

Try to create a sidekick, simply pull from the github commit SHA, then server is simply reading the files.

Always pull the images with squash images with `docker load` for the fastest results possible. Using the `curl` and `docker reload`

5. Update policy:  reboot-strategy  usage demo
https://coreos.com/docs/cluster-management/setup/update-strategies/
https://github.com/coreos/locksmith

Set the reboot to `etcd-lock`

The concept is give the control to be able to update the machines, then manually lock it itself, use the hack of `locksmithctl` binary to manually the update machines from the system.

```bash
locksmithctl status
# this will simply lock this machines, return as a Machine ID
locksmithctl lock
cat /etc/machine-id

# login into a different machine, it will show up the same Machine ID
locksmithctl status
locksmithctl unlock <machine-id>

# now each machines should automatically talk to it, and it will be
# trigger the updates automatically. Taking one machine down at the time
# depends on the `locksmithctl set-max number` info

```
