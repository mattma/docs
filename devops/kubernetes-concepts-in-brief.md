DONE:
1. docs/overview.md
2. docs/pods.md
3. docs/pod-state.md
4. docs/replication-controller.md
5. docs/services.md
6. docs/annotations.md
7. docs/namespaces.md
8. docs/volumes.md
9. docs/dns.md
10. docs/networking.md
11. docs/node.md
12. docs/labels.md
13. docs/secrets.md

## [High Level Concepts](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/overview.md)

In Kubernetes, all containers run inside pods. A pod can host a single or multiple containers. The containers in the pod are guaranteed to be co-located on the same machine and can share resources. A pod can also contain zero or more volumes(directories) across containers in a pod.

For each pod the user creates, the system finds a machine that is healthy and that has sufficient available capacity, and starts up the corresponding container(s) there. If a container fails it can be automatically restarted by Kubernetes' node agent(Kubelet). But if the pod or its machine fails, it is not automatically moved or restarted unless the user also defines a replication controller.

Replication controller defines a pod in terms of a template, that the system then instantiates as some number of pods (specified by the user). Once the pods are created, the system continually monitors their health and that of the machines they are running on; if a pod fails due to a software problem or machine failure, the replication controller automatically creates a new pod on a healthy machine, to maintain the set of pods at the desired replication level. Note that a replication controller is needed even in the case of a single non-replicated pod if the user wants it to be re-created when it or its machine fails.

As a general mechanism, users can attach to most Kubernetes API objects arbitrary key-value pairs called labels, and then use a set of label selectors (key-value queries over labels) to constrain the target of API operations. Each resource also has a map of string keys and values that can be used by external tooling to store and retrieve arbitrary metadata about this object, called annotations.

Kubernetes supports a unique networking model. Kubernetes encourages a flat address space and does not dynamically allocate ports, instead allowing users to select whichever ports are convenient for them. To achieve this, it allocates an IP address for each pod.

Modern Internet applications are commonly built by layering micro-services. Kubernetes offers the service abstraction, which provides a stable IP address and DNS name that corresponds to a dynamic set of pods such as the set of pods constituting a micro-service. The set is defined using a label selector and thus can refer to any set of pods. When a container running in a Kubernetes pod connects to this address, the connection is forwarded by a local agent (called the kube proxy) running on the source machine, to one of the corresponding back-end containers. The exact back-end is chosen using a round-robin policy to balance load. The kube proxy takes care of tracking the dynamic set of back-ends as pods are replaced by new pods on new hosts, so that the service IP address (and DNS name) never changes.

Every resource in Kubernetes, such as a pod, is identified by a URI and has a UID. Important components of the URI are the kind of object (e.g. pod), the object’s name, and the object’s namespace. Every name is unique within its namespace, and in contexts where an object name is provided without a namespace, it is assumed to be in the default namespace. UID is unique across time and space

- Benefits

1. Container oriented deployments.

Package up your application components with all their dependencies and deploy them using technologies like Docker or Rocket.  Containers radically simplify the deployment process, making rollouts repeatable and predictable.

2. Dynamically managed.

Rely on modern control systems to make moment-to-moment decisions around the health management and scheduling of applications to radically improve reliability and efficiency.

3. Micro-services oriented.

Tease applications apart into small semi-autonomous services that can be consumed easily so that the resulting systems are easier to understand, extend and adapt.

## Kubernetes Clusters

A cluster is comprised of a master and worker nodes. Creating a cluster results in a fully provisioned set of nodes and a master, all on a configured IP private network. The master becomes the entry point for creating and controlling the Compute resources, reached through the cluster’s API endpoint.

Each node in the cluster provides processor and memory resources. A node belongs to only one cluster and gets provisioned and turned on during cluster creation. The number of nodes created should be based on the total amount of Compute Engine resources expected. The cluster master schedules work on each node.

- Kubernetes master

Every cluster has a single master instance. The master provides a unified view into the cluster and, through its publicly-accessible endpoint, is the doorway for interacting with the cluster.

The master runs the Kubernetes API server, which services REST requests, schedules pod creation and deletion on worker nodes, and synchronizes pod info (such as open ports and location) with service information.

- Kubernetes nodes

A cluster can have one or more node instances. These are managed from the master, and run the services necessary to support Docker containers. Each node runs the Docker runtime and hosts a Kubelet agent, which manages the Docker containers scheduled on the host. Each node also runs a simple network proxy.

## What is Kubernetes

Kubernetes manages containerized applications across multiple hosts in a cluster. The user should not have to care much about where work is scheduled. The unit of work presented to the user is at the "service" level and can be accomplished by any of the member nodes.

It provides mechanisms for application deployment, scheduling, updating, maintenance, and scaling. A key feature of Kubernetes is that it actively manages the containers to ensure that the state of the cluster continually matches the user's intentions.

## Key Concepts

- At a very high level, there are three key concepts

* Pods

They are the smallest deployable units that can be created, scheduled, and managed. Its a logical collection of containers that belong to an application. a way to group containers together. Group of containers and shared namespaces. This is the basic unit of manipulation in Kubernetes.

Behavior: Group of containers, often one container, settings written in a template
Benefits: reuse across envrionment, repeatable, manageable

* Master

The central control point that provides a unified view of the cluster. There is a single master node, the managing machine, that control one or multiple worker nodes. Master serves/expose RESTful Kubernetes API that validate and configure Pod, Service, and Replication Controller, it allows you to request certain tasks to be completed, then spawns containers to handle the workload you've asked for.

The Kubernetes control plane is comprised of many components, but they all run on the single Kubernetes master node.

* Node

(previously called Minion) is a worker node that run tasks as delegated by the user and Kubernetes master. Nodes can run one or more pods. It provides an application-specific “virtual host” in a containerized environment.

- A few key components at Master and Node

* Replication Controller (on Master)

It is a resource at Master that ensures that requested number of pods are running on Nodes at all times. a way to handle the lifecycle of containers.

Behavior: keeps pods running, gives direct control (definition rules) of Pod #s. System is maintaining the state for you. Reconsiliation
Benefits: restarts pods, desired state, fine-grained control for scaling

* Service (on Master)

It is an object on master has an endpoint that provides automatically configured load balancing across a replicated group of pods. a set of containers performing a common function. Load balancer and Virtual IP. It will send the request to one of the healthy Node, if a node drop off or killed, it will be dropped off from load balancer as well. Kubernetes provides load balancer on all of your components, great for micro services. Using query label, using Environment variable.

Behavior: Stable address, decoupled from controllers
Benefits: client shielded from implemention details, independently control each, build for resiliency

* Kubelet (on every Node)

Each Node runs services to run containers and be managed from the master. In addition to Docker, Kubelet is another key service installed there. It is an agent and reads container manifests as YAML files that describes a pod and a proxy service. Kubelet ensures that the containers defined in the pods are started and continue running.

* Label

It is an arbitrary key/value pair in a distributed watchable storage that the Replication Controller uses for service discovery. a way to find and query containers

Behavior: Metadata with semantic meaning and membership identifier
Benefits: allow for intent of many users, build higher level system

## Details

## Master (Kubernetes Control Plane)

It contains a set of components and all run on a single master node. These components work together to provide a unified view of the cluster. The controlling unit in a Kubernetes cluster. It serves as the main management contact point for administrators, and it also provides many cluster-wide systems for the relatively dumb worker nodes. The master server runs a number of unique services that are used to manage the cluster's workload and direct communications across the system.

1. Etcd

Kubernetes uses etcd to store configuration data(all persistent master state) that can be used by each of the nodes in the cluster, with `watch` support, coordinating components can be notified very quickly of changes. This can be used for service discovery and represents the state of the cluster that each component can reference to configure or reconfigure themselves. It provide a simple HTTP/JSON API.

The implementation of etcd on a Kubernetes cluster is a bit more flexible than CoreOS. If you choose to, you can turn off etcd on every server but your master, so long as you point your Kubernetes components at the master server's instance. Because the master server must be up for Kubernetes to function, the value of distributing the store is less fundamental.

2. API Server

The apiserver (CRUD) serves up the Kubernetes API, with most/all business logic implemented in separate components or in plug-ins. It mainly processes REST operations, validates them, and updates the corresponding objects in etcd.

This is the main management point of the entire cluster, as it allows a user to configure many of Kubernetes' workloads and organizational units. It implements a RESTful interface, also is responsible for the etcd store and the service details of deployed containers are in agreement.

3. Controller Manager Server

All other cluster-level functions are currently performed by the Controller Manager. For instance, `Endpoints` objects are created and updated by the endpoints controller, and nodes are discovered, managed, and monitored by the node controller. The `replicationController` is a mechanism that is layered on top of the simple `pod` API.

It handles the replication processes defined by replication tasks. The details of these operations are written to etcd, where the controller manager watches for changes. When a change is seen, the controller manager reads the new information and implements the replication procedure that fulfills the desired state. This can involve scaling the application group up or down.

4. Scheduler Server

The scheduler binds unscheduled pods to nodes via the `/binding` API.

It assigns workloads to specific nodes in the cluster is the scheduler. This is used to read in a service's operating requirements, analyze the current infrastructure environment, and place the work on an acceptable node(s).

The scheduler is responsible for tracking resource utilization on each host to make sure that workloads are not scheduled in excess of the available resources. The scheduler must know the total resources available on each server, as well as the resources allocated to existing workloads assigned on each server.

## Node (aka Minion)

Node servers that perform work (a worker node). Node may be a VM or physical machine, depending on the cluster. Each node has the services necessary to run Pods and be managed from the master systems, the services include docker, kubelet and network proxy, Ex: configure the networking for containers, and run the actual workloads assigned to them.

1. Docker Running on a Dedicated Subnet

The first requirement of each individual Node server is docker. The docker service is used to run encapsulated application containers in a relatively isolated but lightweight operating environment. Each unit of work implemented as a series containers that must be deployed.

Each Node has a dedicated subnet. This is not the case with many standard clustered deployments. For instance, with CoreOS, a separate networking fabric called flannel is needed for this purpose. Docker must be configured to use this so that it can expose ports in the correct fashion.

2. Kubelet Service

The main contact point for each Node with the cluster group is through a small service called kubelet. This service is responsible for relaying info to and from the master server, as well as interacting with the etcd store to read configuration details or write new values.

The kubelet service communicates with the master server to receive commands and work. Work is received in the form of a "manifest" which defines the workload and the operating parameters. The kubelet process then assumes responsibility for maintaining the state of the work on the Node server.

3. Proxy Service

In order to deal with individual host subnetting and in order to make services available to external parties, a small proxy service is run on each Node server. This process forwards requests to the correct containers, can do primitive load balancing, and is generally responsible for making sure the networking environment is predictable and accessible, but isolated.

#### Node Status

It describe current status of a node. There are three pieces of information:

1. HostIP

Host IP address is queried from cloudprovider and stored as part of node status. If kubernetes runs without cloudprovider, node's ID will be used. IP address can change, and there are different kind of IPs, e.g. public IP, private IP, dynamic IP, ipv6, etc. It makes more sense to save it as a status rather than spec.

2. Node Phase

Node Phase is the current lifecycle phase of node, one of Pending, Running and Terminated. In kubernetes, node will be created in Pending phase, until it is discovered and checked in by kubernetes, at which time, kubernetes will mark it as Running. The end of a node's lifecycle is Terminated. A terminated node will not receive any scheduling request, and any running pods will be removed from the node.

3. Node Condition

Node Condition describes the conditions of Running nodes. Current valid condition is `Ready`. Ready means kubelet is healthy and ready to accept pods. Different condition provides different level of understanding for node health. Node condition is represented as a json object. For example, the following conditions mean the node is in sane state:

"conditions": [
  {
    "kind": "Ready",
    "status": "True",
    },
]

#### Node Management

Unlike Pod and Service, Node is not inherently created by Kubernetes: it is either created from cloud providers, or from your physical or virtual machines. What this means is that when Kubernetes creates a node, it only creates a representation for the node. After creation, Kubernetes will check whether the node is valid or not. For example, if you try to create a node from the following content:

```json
{
  "id": "10.1.2.3",
  "kind": "Minion",
  "apiVersion": "v1beta1",
  "resources": {
    "capacity": {
      "cpu": 1000,
      "memory": 1073741824
    },
  },
  "labels": {
    "name": "my-first-k8s-node",
  },
}
```

Kubernetes will create a Node object internally (the representation), and validate the node by health checking based on the id field: we assume id can be resolved. If the node is valid, i.e. all necessary services are running, it is eligible to run a Pod; otherwise, it will be ignored for any cluster activity, until it becomes valid. Note that Kubernetes will keep invalid node unless explicitly deleted by client, and it will keep checking to see if it becomes valid.

#### two agents that interacts with Kubernetes node interface: Node Controller and Kube Admin

1. Node Controller

Node controller is a component in Kubernetes master which manages Node objects. It performs two major functions: cluster-wide node synchronization and single node life-cycle management.

Node controller has a sync loop that creates/deletes Nodes from Kubernetes based on all matching VM instances listed from cloud provider. The sync period can be controlled via flag "--node_sync_period". If a new instance gets created, Node Controller creates a representation for it. If an existing instance gets deleted, Node Controller deletes the representation.

Note however, Node Controller is unable to provision the node for you, i.e. it won't install any binary; therefore, to join Kubernetes cluster, you as an admin need to make sure proper services are running in the node.

In case of no cloud provider, 1) Node Controller simply registers all machines from `--machines` flag, any further interactions need to be done manually by using kubectl. 2) leave `--machines` empty and create all machines from kubectl one by one - the two approaches are equivalent. Optionally you can skip cluster-wide node synchronization with '--sync_nodes=false' and can use REST api/kubectl cli to add/remove nodes.

2. Manual Node Administration

A Kubernetes administrator typically uses kubectl to manage Node. Similar to Node Controller, kubectl command only creates/deletes node representation. Note if Kubernetes is running on cloud provider, kubectl create a node will be refused if Node Controller has already synchronized nodes from cloud provider.

Admin can choose to make the node unschedulable using kubectl. Unscheduling the node will not affect any existing pods on the node but it will disable creation of any new pods on the node. Node unschedulable example:

`kubectl update nodes 10.1.2.3 --patch='{"apiVersion": "v1beta3", "unschedulable": true}'`

## [Pods](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/pods.md)

Pods are the smallest deployable units that can be created, scheduled, and managed. A pod is the unit of scheduling in Kubernetes. It is a resource envelope in which one or more containers run. Containers that are part of the same pod are guaranteed to be scheduled together onto the same machine, and can share state via local volumes.

A pod corresponds to a colocated group of applications running with a shared context. Within that context, the applications may also have individual cgroup isolations applied. A pod models an application-specific "logical host" in a containerized environment. It may contain one or more applications which are relatively tightly coupled -- in a pre-container world, they would have executed on the same physical or virtual host.

In general, users shouldn't need to create pods directly. They should almost always use replication controller, even for singletons. Controllers provide self-healing with a cluster scope, as well as replication and rollout management.

The context of the pod can be defined as the conjunction of several Linux namespaces:

    * PID namespace (applications within the pod can see each other's processes)
    * network namespace (applications within the pod have access to the same IP and port space)
    * IPC namespace (applications within the pod can use SystemV IPC or POSIX message queues to communicate)
    * UTS namespace (applications within the pod share a hostname)

A pod consists of a colocated group of Docker containers (Applications within a pod) with shared volumes. Shared volumes are defined at the pod level and made available in each application's filesystem. A pod may define top-level cgroup isolations which form an outer bound to any individual isolation applied to constituent applications.

Like running containers, pods are considered to be relatively ephemeral rather than durable entities. Pods are scheduled to nodes and remain there until termination (according to restart policy) or deletion. When a node dies, the pods scheduled to that node are deleted. Specific pods are never rescheduled to new nodes; instead, they must be replaced.

Pod is exposed as a primitive in order to facilitate:

    * scheduler and controller pluggability
    * support for pod-level operations without the need to "proxy" them via controller APIs
    * decoupling of pod lifetime from controller lifetime, such as for bootstrapping
    * decoupling of controllers and services -- the endpoint controller just watches pods
    * clean composition of Kubelet-level functionality with cluster-level functionality -- Kubelet is effectively the "pod controller"
    * high-availability applications, which will expect pods to be replaced in advance of their termination and certainly in advance of deletion, such as in the case of planned evictions, image prefetching, or live pod migration


- IP-per-Pod.

Advent of software-defined overlay networks such as flannel or those built into public clouds, Kubernetes is able to give every pod and service its own IP address. This removes the infrastructure complexity of managing ports, and allows developers to choose any ports they want rather than requiring their software to adapt to the ones chosen by the infrastructure. The latter point is crucial for making it easy to run off-the-shelf open-source applications on Kubernetes--pods can be treated much like VMs or physical hosts, with access to the full port space, oblivious to the fact that they may be sharing the same physical machine with other pods.

- Motivation for pods

* Pods facilitate data sharing and communication among their peers.

The containers in the pod all use the same network namespace/IP, port space. They find/communicate with each other using localhost. Each pod has an IP address in a flat shared networking namespace that has full communication with other physical computers and containers across the network.

The hostname for each container within the pod is set to the pod's name. Goal: 1) defining the containers that run in the pod  2) specify a set of shared storage volumes. Volumes enable data to survive container restarts and to be shared among the containers within the pod.

* Management

Pods simplify application deployment and management by providing a higher-level abstraction than the raw, low-level container interface. Pods serve as units of deployment and horizontal scaling/replication. Co-location, fate sharing, coordinated replication, resource sharing, and dependency management are handled automatically. Do not run multiple programs in a single Docker container, benefits: transparency, decoupling software dependencies, ease of use, efficiency.

- Uses of pods

Individual pods are not intended to run multiple instances of the same application. Pods host vertically integrated application stacks, but their primary motivation is to support co-located, co-managed helper programs, such as:

    * Content management systems, file and data loaders, local cache managers, etc.
    * Log and checkpoint backup, compression, rotation, snapshotting, etc.
    * Data-change watchers, log tailers, logging and monitoring adapters, event publishers, etc.
    * Proxies, bridges, and adapters.
    * Controllers, managers, configurators, and updaters.

#### Life of a pod

- Pod Phase (`PodPhase`)

Phase is a simple, high-level summary of the phase of the lifecycle of a pod. It is not a comprehensive rollup of observations of container-level/pod-level conditions or other state, Not a comprehensive state machine.

`PodPhase` values are tightly guarded:

1. Pending

The pod has been accepted by the system, but one or more of the container images has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take a while.

2. Running

The pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting.

3. Succeeded

All containers in the pod have terminated in success, and will not be restarted.

4. Failed

All containers in the pod have terminated, at least one container has terminated in failure (exited with non-zero exit status or was terminated by the system).

- Container Status (`containerStatuses`)

`containerStatuses`: detailed info about the current/previous container statuses. The information reported depends on the current ContainerState, which may be Waiting, Running, or Termination (sic).

- RestartPolicy (`RestartPolicy`)

The RestartPolicy may be `Always`, `OnFailure`, or `Never`. RestartPolicy applies to all containers in the pod. RestartPolicy only refers to restarts of the containers by the Kubelet on the same node. Once bound to a node, a pod may never be rebound to another node.

ReplicationController is only appropriate for pods with `RestartPolicy = Always`. It refuses to instantiate any pod that has a different restart policy.

- Pod lifetime

Pods do not disappear until someone destroys them by a human or a ReplicationController. The only exception to this rule is that pods with a PodPhase of Succeeded or Failed for more than some duration (determined by the master) will expire and be automatically reaped.

If a node dies or is disconnected from the rest of the cluster, some entity within the system (call it the `NodeController` for now) is responsible for applying policy (e.g. a timeout) and marking any pods on the lost node as Failed.

```bash
# 1.
Pod is Running, 1 container, container exits success
    Log completion event
    If RestartPolicy is:
        Always: restart container, pod stays Running
        OnFailure: pod becomes Succeeded
        Never: pod becomes Succeeded

# 2.
Pod is Running, 1 container, container exits failure
    Log failure event
    If RestartPolicy is:
        Always: restart container, pod stays Running
        OnFailure: restart container, pod stays Running
        Never: pod becomes Failed

# 3
Pod is Running, 2 containers, container 1 exits failure
    Log failure event
    If RestartPolicy is:
        Always: restart container, pod stays Running
        OnFailure: restart container, pod stays Running
        Never: pod stays Running
When container 2 exits...
    Log failure event
    If RestartPolicy is:
        Always: restart container, pod stays Running
        OnFailure: restart container, pod stays Running
        Never: pod becomes Failed

# 4
Pod is Running, container becomes OOM (Out of Mermory)
    Container terminates in failure
    Log OOM event
    If RestartPolicy is:
        Always: restart container, pod stays Running
        OnFailure: restart container, pod stays Running
        Never: log failure event, pod becomes Failed

# 5
Pod is Running, a disk dies
    All containers are killed
    Log appropriate event
    Pod becomes Failed
    If running under a controller, pod will be recreated elsewhere

# 6
Pod is Running, its node is segmented out
    NodeController waits \for timeout
    NodeController marks pod Failed
    If running under a controller, pod will be recreated elsewhere
```

## Replication Controllers

A replication controller ensures that a specified number of pod "replicas" are running at any one time. If there are too many, it kills some pods. If there are too few, it starts more. As opposed to just creating singleton pods or even creating pods in bulk, a replication controller replaces pods that are deleted or terminated for any reason (ex: node failure, disruptive node maintenance, a kernel upgrade.). For this reason, we recommend that you use a replication controller even if your application requires only a single pod. Replication controller delegates local container restarts to some agent on the node (e.g., Kubelet or Docker).

A replicationController is only appropriate for pods with `RestartPolicy = Always`.
The two replication controllers need to create pods with at least one differentiating label.

A replication controller will never terminate on its own, but it isn't expected to be as long-lived as services. Services may be comprised of pods controlled by multiple replication controllers, and it is expected that many replication controllers may be created and destroyed over the lifetime of a service. Services and their clients should remain oblivious to the replication controllers that maintain the pods of the services.

#### How does a replication controller work?

* Pod template

A replication controller creates new pods from a template.

Rather than specifying the current desired state of all replicas, pod templates are like cookie cutters. Once a cookie has been cut, the cookie has no relationship to the cutter. Subsequent changes to the template or even a switch to a new template has no direct effect on the pods already created. Similarly, pods created by a replication controller may subsequently be updated directly.

* Labels

The population of pods that a replication controller monitors is defined with a label selector, which creates a loosely coupled relationship between the controller and the pods controlled.

Only one replication controller controls any given pod, ensure that the label selectors of replication controllers do not target overlapping sets. And specified template have labels that match its label selector. Note that replicationControllers may themselves have labels and would generally carry the labels their corresponding pods have in common, but these labels do not affect the behavior of the replication controllers.

To remove a pod from a replication controller's target set, change the pod's label. Use this technique to remove pods from service for debugging, data recovery, etc. Pods that are removed in this way will be replaced automatically (assuming that the number of replicas is not also changed).

Similarly, deleting a replication controller does not affect the pods it created. To delete the pods in a replication controller's target set, set the replication controller's replicas field to 0. `kubectl stop rc <rc-name>`

#### Responsibilities of the replication controller

The replication controller ensures that the desired number of pods matches its label selector and are operational. Currently, only terminated pods are excluded from its count. It itself will not perform readiness nor liveness probes. Rather than performing auto-scaling, it is intended to be controlled by an external auto-scaler, which would change its replicas field. We will not add scheduling policies (e.g., spreading) to replication controller. Nor should it verify that the pods controlled match the currently specified template, as that would obstruct auto-sizing and other automated processes. Similarly, completion deadlines, ordering dependencies, configuration expansion, and other features belong elsewhere.

The replication controller is intended to be a composable building-block primitive. We expect higher-level APIs and/or tools to be built on top of it and other complementary primitives for user convenience in the future.

#### Common usage patterns

* Rescheduling

Whether you have 1 pod you want to keep running, or 1,000, a replication controller will ensure that the specified number of pods exists ( ex: node failure, pod termination, an action by another control agent).

* Scaling

Replication controllers make it easy to scale the number of replicas up or down, either manually or by an auto-scaling control agent. Scaling is accomplished by updating the replicas field of the replication controller's configuration file.

* Rolling updates

Replication controllers are designed to facilitate rolling updates to a service by replacing pods one by one.

The recommended approach is:

    * Create a new replication controller with 1 replica.
    * Resize the new (+1) and old (-1) controllers one by one.
    * Delete the old controller after it reaches 0 replicas.
    * This predictably updates the set of pods regardless of unexpected failures.

The two replication controllers would need to create pods with at least one differentiating label, such as the image tag of the primary container of the pod, since it is typically image updates that motivate rolling updates.

* Multiple release tracks

In addition to running multiple releases of an application while a rolling update is in progress, it's common to run multiple releases for an extended period of time, or even continuously, using multiple release tracks which be differentiated by labels.

For instance, a service might target all pods with tier in (frontend), environment in (prod). Now say you have 10 replicated pods that make up this tier. But you want to be able to 'canary' a new version of this component. You could set up a replicationController with replicas set to 9 for the bulk of the replicas, with labels `tier=frontend, environment=prod, track=stable`, and another replicationController with replicas set to 1 for the canary, with labels `tier=frontend, environment=prod, track=canary`. Now the service is covering both the canary and non-canary pods. But you can update the replicationControllers separately to test things out, monitor the results, etc.

## Service

Kubernetes supports naming and load balancing using the service abstraction: a service has a name and maps to a dynamic set of pods defined by a label selector. Any container in the cluster can connect to the service using the service name. Under the covers, Kubernetes automatically load-balances connections to the service among the pods that match the label selector, and keeps track of where the pods are running as they get rescheduled over time due to failures.

Pods can come and go over time, especially when driven by things like replication controllers (create/destroy pods dynamically). While each pod gets its own IP address, those IP addresses cannot be relied upon to be stable over time. This leads to a problem: if some set of pods (let's call them backends) provides functionality to other pods (let's call them frontends) inside a cluster, how do those frontends find the backends? "services".

A service is an abstraction which defines a logical set of pods and a policy by which to access them - sometimes called a micro-service. The set of Pods targeted by a Service is determined by a Label Selector.

Ex: 3 live replicas backend (IP can change), frontend can connect to any one of them (do not need to know backend pod IP changes). The service abstraction enables this decoupling.

For Kubernetes-native applications, Kubernetes offers a simple Endpoints API that is updated whenever the set of Pods in a Service changes.

For non-native applications, Kubernetes offers a virtual-IP-based bridge to Services which redirects to the backend Pods.

A service offers clients an IP and port pair which, when accessed, redirects to the appropriate backends. The set of pods targeted is determined by a label selector.

#### How do they work?

Each node in a cluster runs a service proxy. This application watches the cluster master for the addition and removal of service objects. If a service's label selector matches the labels on a pod, the proxy opens a port on the local node for that service and forwards traffic to the pod.

When a pod is scheduled, the master adds a set of environment variables for each active service.

A service, through its label selector, can resolve to 0 or more pods. Over the life of a service, the set of pods which comprise that service can grow, shrink, or turn over completely.

#### Defining a Service

A Service in Kubernetes is a REST object. A Service definition can be POSTed to the apiserver to create a new instance.

#### Services without selectors

Services, in addition to providing abstractions to access Pods, can also abstract any kind of backend. For example:

    * you want to have an external database cluster in production, but in test you use your own databases.
    * you want to point your service to a service in another Namespace or on another cluster.
    * you are migrating your workload to Kubernetes and some of your backends run outside of Kubernetes.

In any of these scenarios you can define a service without a selector, Accessing a Service without a selector works the same as if it had selector. The traffic will be routed to endpoints defined by the user (`173.194.112.206:80` in this example).

```json
"kind": "Service",
"apiVersion": "v1beta1",
"id": "myapp",
"port": 80
```

Then you can explicitly map the service to a specific endpoint(s):

```json
"kind": "Endpoints",
"apiVersion": "v1beta1",
"id": "myapp",
"endpoints": ["173.194.112.206:80"]
```

#### Portals and service proxies

Every node in a Kubernetes cluster runs a `kube-proxy`. This application watches the Kubernetes master for the addition and removal of Service and Endpoints objects. For each Service it opens a port (random) on the local node. Any connections made to that port will be proxied to one of the corresponding backend Pods. Which backend to use is decided based on the AffinityPolicy of the Service. Lastly, it installs iptables rules which capture traffic to the Service's Port on the Service's portal IP and redirects that traffic to the previously described port.

Any traffic bound for the Service is proxied to an appropriate backend without the clients knowing anything about Kubernetes or Services or Pods.

#### Discovering services

Kubernetes supports 2 primary modes of finding a Service - environment variables and DNS.

1. Environment variables

Any Service that a Pod wants to access Environment Variable must be created before the Pod itself, or else the environment variables will not be populated. DNS does not have this restriction.

When a Pod is run on a Node, the kubelet adds a set of environment variables for each active Service. It supports both Docker links compatible variables (see makeLinkVariables) and simpler {SVCNAME}_SERVICE_HOST and {SVCNAME}_SERVICE_PORT variables, where the Service name is upper-cased and dashes are converted to underscores.

For example, the Service "redis-master" which exposes TCP port 6379 and has been allocated portal IP address 10.0.0.11 produces the following environment variables:

```bash
    REDIS_MASTER_SERVICE_HOST=10.0.0.11
    REDIS_MASTER_SERVICE_PORT=6379
    REDIS_MASTER_PORT=tcp://10.0.0.11:6379
    REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
    REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
    REDIS_MASTER_PORT_6379_TCP_PORT=6379
    REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

2. DNS

A recommended way, a cluster add-on is a DNS server. The DNS server watches the Kubernetes API for new Services and creates a set of DNS records for each. If DNS has been enabled throughout the cluster then all Pods should be able to do name resolution of Services automatically.

For example, if you have a Service called "my-service" in Kubernetes Namespace "my-ns" a DNS record for "my-service.my-ns" is created. Pods which exist in the "my-ns" Namespace should be able to find it by simply doing a name lookup for "my-service". Pods which exist in other Namespaces must qualify the name as "my-service.my-ns". The result of these name lookups is the virtual portal IP.

* [Kubernetes Skydns (Manually)](http://www.dasblinkenlichten.com/kubernetes-dns-config-on-bare-metal/)

Kubernetes register service names in a DNS server running in the Kubernetes cluster. Kubernetes leverages SkyDNS and another container (called kube2sky) to read the service entries and insert them as DNS entries.

Beyond the containers to run the DNS service, we also need to tell the pods to use this particular DNS server for DNS resolution.  This is done by adding a couple of lines of config to the `kube-kubelet.service`.  Once that’s done, we can configure the Kubernetes service and the replication controller for the SkyDNS pod.

```yaml
# kube-kubelet.service
--cluster_dns=10.100.0.10 \   # IP out of our Portal Net allocation as a DNS server
--cluster_domain=kubdomain.local   # setting the cluster DNS namespace
```

Once previous setup is done, do below. Duplicate this step on all of your Kubernetes nodes

```bash
systemctl daemon-reload
systemctl restart kube-kubelet
```

Then configure the replication controller for the actual service. There are two files we’ll use for this, the first is for the service definition.  See example at `kubernetes-vagrant/dns/dns-service-v1beta3.yaml`

```yaml
kind: Service
apiVersion: v1beta1
id: kube-dns
namespace: default
protocol: UDP
port: 53
# May need to be edited was the PortalIP.
#  the same IP you used when you configured the nodes kubelet service DNS server.
portalIP: 10.100.0.10
containerPort: 53
labels:
  k8s-app: kube-dns
  kubernetes.io/cluster-service: "true"
selector:
  k8s-app: kube-dns
```

this IP is only relevant in the cluster. Deploy this service into the cluster and then let’s move onto the replication controller configuration.

```yaml
kind: ReplicationController
apiVersion: v1beta1
id: kube-dns
namespace: default
labels:
  k8s-app: kube-dns
  kubernetes.io/cluster-service: "true"
desiredState:
  replicas: 1
  replicaSelector:
    k8s-app: kube-dns
  podTemplate:
    labels:
      k8s-app: kube-dns
      kubernetes.io/cluster-service: "true"
    desiredState:
      manifest:
        version: v1beta2
        id: kube-dns
        dnsPolicy: "Default"  # Don't use cluster DNS.
        containers:
          - name: etcd
            image: quay.io/coreos/etcd:latest
            command: [
                    "/etcd",
                    "-bind-addr=127.0.0.1",
                    "-peer-bind-addr=127.0.0.1",
            ]
          - name: kube2sky
            image: kubernetes/kube2sky:1.0
            command: [
                    # entrypoint = "/kube2sky",
                    "-domain=kubdomain.local",
            ]
          - name: skydns
            image: kubernetes/skydns:2014-12-23-001
            command: [
                    # entrypoint = "/skydns",
                    "-machines=http://localhost:4001",
                    "-addr=0.0.0.0:53",
                    "-domain=kubdomain.local",
            ]
            ports:
              - name: dns
                containerPort: 53
                protocol: UDP
```

It pulled all of my service definitions and added DNS records for them!

#### Headless Services

Users can create headless services by specifying "None" for the PortalIP. For such services, an IP or DNS is not created and neither are service-specific environment variables for the pods created. Additionally, the kube proxy does not handle these services and there is no load balancing or proxying being done by the platform for them. The endpoints_controller would still create endpoint records in etcd for such services, which are also made available via the API. These services also take advantage of any UI, readiness probes, etc. that are applicable for services in general.

The tradeoff for a developer would be whether to couple to the Kubernetes API or to a particular discovery system. This API would not preclude the self-registration approach, however, and adapters for other discovery systems could be built upon this API, as well.

#### External Services

For some parts of your application (e.g. frontends) you may want to expose a Service onto an external (outside of your cluster, maybe public internet) IP address.

On cloud providers which support external load balancers, this should be as simple as setting the flag `createExternalLoadBalancer: true`. This sets up a cloud-specific load balancer and populates the publicIPs field. Traffic from the external load balancer will be directed at the backend Pods.

For cloud providers which do not support external load balancers, The flag `publicIPs` array field. Any address you put into the publicIPs array will be handled the same as the portal IP - the kube-proxy will install iptables rules which proxy traffic through to the backends. You are then responsible for ensuring that traffic to those IPs gets sent to one or more Kubernetes Nodes.

An example situation might be when a Node has both internal and an external network interfaces. If you assign that Node's external IP as a publicIP, you can then aim traffic at the Service port on that Node and it will be proxied to the backends.

- Choosing your own PortalIP address

A user can specify their own `PortalIP` address as part of a service creation request. For example, if they already have an existing DNS entry that they wish to replace, or legacy systems that are configured for a specific IP address and difficult to re-configure. The PortalIP address that a user chooses must be a valid IP address and within the portal net CIDR range that is specified by flag to the API server. If the PortalIP value is invalid, the apiserver returns a 422 HTTP status code to indicate that the value is invalid.

#### portals

1. Avoiding collisions

In general, users should not have to choose a port number if that choice might collide with another user. That is an isolation failure.

In order to allow users to choose a port number for their Services, we must ensure that no two Services can collide. We do that by allocating each Service its own IP address.

2. IPs and Portals

Unlike Pod IP addresses, which actually route to a fixed destination, Service IPs are not actually answered by a single host. Instead, we use iptables (packet processing logic in Linux) to define "virtual" IP addresses which are transparently redirected as needed. We call the tuple of the Service IP and the Service port the portal. When clients connect to the portal, their traffic is automatically transported to an appropriate endpoint. The environment variables and DNS for Services are actually populated in terms of the portal IP and port.

Ex: When the backend Service is created, the Kubernetes master assigns a portal IP address, for example 10.0.0.1. Assuming the Service port is 1234, the portal is 10.0.0.1:1234. The master stores that information, which is then observed by all of the kube-proxy instances in the cluster. When a proxy sees a new portal, it opens a new random port, establishes an iptables redirect from the portal to this new port, and starts accepting connections on it.

When a client connects to the portal the iptables rule kicks in, and redirects the packets to the Service proxy's own port. The Service proxy chooses a backend, and starts proxying traffic from the client to the backend.

This means that Service owners can choose any Service port they want without risk of collision. Clients can simply connect to an IP and port, without being aware of which Pods they are actually accessing.

## Label

Kubernetes supports more flexible collections than Borg by organizing pods using labels, which are arbitrary key/value pairs that users attach to pods (and in fact to any object in the system). Users can create groupings equivalent to Borg Jobs by using a “job:<jobname>” label on their pods, but they can also use additional labels to tag the service name, service instance (production, staging, test), and in general, any subset of their pods. A label query (called a “label selector”) is used to select which set of pods an operation should be applied to.

Labels are key/value pairs that specify identifying attributes of objects that are meaningful and relevant to users, such as pods. but which do not directly imply semantics to the core system. Using labels to organize/select subsets of objects. Labels can be attached to objects at creation time and subsequently added and modified at any time. Each object can have a set of key/value labels defined. Each Key must be unique for a given object.

Note: We don't want to pollute labels with non-identifying, especially large and/or structured, data. Non-identifying information should be recorded using annotations.

#### Motivation

Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion, without requiring clients to store these mappings.

Service deployments and batch processing pipelines are often multi-dimensional entities (e.g., multiple partitions or deployments, multiple release tracks, multiple tiers, multiple micro-services per tier). Management often requires cross-cutting operations, which breaks encapsulation of strictly hierarchical representations, especially rigid hierarchies determined by the infrastructure rather than by users.

- Label examples

release: "stable", "canary", ...
environment: "dev", "qa", "production"
tier: "frontend", "backend", "middleware"
partition: "customerA", "customerB", ...
track: "daily", "weekly"

#### Syntax and character set

Labels are key value pairs. Valid label keys have two segments - prefix and name - separated by a slash (/).

1. Keys

Name segment is required and must be a DNS label: 63 characters or less, all lowercase, beginning and ending with an alphanumeric character ([a-z0-9A-Z]), with dashes (-) and alphanumerics between. The prefix and slash are optional. If specified, the prefix must be a DNS subdomain (a series of DNS labels separated by dots (.), not longer than 253 characters in total. If the prefix is omitted, the label key is presumed to be private to the user. System components which use labels must specify a prefix. The kubernetes.io prefix is reserved for kubernetes core components.

2. values

It must be shorter than 64 characters, accepted characters are ([-A-Za-z0-9_.]) but the first character must be ([A-Za-z0-9]).

#### Label selectors

Unlike names and UIDs, labels do not provide uniqueness. In general, we expect many objects to carry the same label(s). Via a label selector, the client/user can identify a set of objects. The label selector is the core grouping primitive in Kubernetes.

The API currently supports two types of selectors: equality-based and set-based. A label selector can be made of multiple requirements which are comma-separated. In the case of multiple requirements, all must be satisfied so comma separator acts as an AND logical operator.

Note: Set-based requirements can be mixed with equality-based requirements. For example: partition in (customerA, customerB),environment!=qa.

1. Equality-based requirement

Equality- or inequality-based requirements allow filtering by label keys and values. Matching objects must have all of the specified labels (both keys and values), though they may have additional labels as well. Three kinds of operators are admitted =,==,!=. ex:

```bash
environment = production
tier != frontend
# or
environment=production,tier!=frontend
```

2. Set-based requirement

Set-based label requirements allow filtering keys according to a set of values. Matching objects must have all of the specified labels (i.e. all keys and at least one of the values specified for each key). Three kind of operators are supported: in,notin and exists (only the key identifier). Ex:

```bash
environment in (production, qa)  # selects all resources with key equal to environment and value equal to production or qa
tier notin (frontend, backend) # selects all resources with key equal to tier and value other than frontend and backend
partition  # selects all resources including a label with key partition, no values are checked
```

Similarly the comma separator acts as an AND operator.

Ex: filtering resource with a partition key (not matter the value) and with environment different than qa.
Ex: partition,environment notin (qa). The set-based label selector is a general form of equality since environment=production is equivalent to environment in (production); similarly for != and notin.

#### API

Sets identified by labels could be overlapping.

- LIST and WATCH operations may specify label selectors to filter the sets of objects returned using a query parameter. Both requirements are permitted:

equality-based requirements: ?label-selector=key1%3Dvalue1,key2%3Dvalue2
set-based requirements: ?label-selector=key+in+%28value1%2Cvalue2%29%2Ckey2+notin+%28value3

- Kubernetes currently supports two objects that use label selectors to keep track of their members, services and replicationControllers.

* service: A service is a configuration unit for the proxies that run on every worker node. It is named and points to one or more pods.

* replicationController: A replication controller ensures that a specified number of pod "replicas" are running at any one time.

The set of pods that a service targets is defined with a label selector. And the population of pods that a replicationController is monitoring is also defined with a label selector. For management convenience and consistency, services and replicationControllers may themselves have labels and would generally carry the labels their corresponding pods have in common.

Pods (and other objects) may belong to multiple sets simultaneously, which enables representation of service substructure and/or superstructure. In particular, labels are intended to facilitate the creation of non-hierarchical, multi-dimensional deployment structures. They are useful for a variety of management purposes (e.g., configuration, deployment) and for application introspection and analysis (e.g., logging, monitoring, alerting, analytics). Without the ability to form sets by intersecting labels, many implicitly related, overlapping flat sets would need to be created, for each subset and/or superset desired, which would lose semantic information and be difficult to keep consistent. Purely hierarchically nested sets wouldn't readily support slicing sets across different dimensions.

## Annotations

Labels for identifying metadata. Annotations are key-value object for attaching arbitrary non-identifying metadata, for retrieval by API clients such as tools, libraries, etc. This information may be large, structured or unstructured, may include characters not permitted by labels, etc. Such information would not be used for object selection and therefore doesn't belong in labels.

```json
"annotations": {
  "key1" : "value1",
  "key2" : "value2"
}
```

- Possible information that could be recorded in annotations:

* fields

managed by a declarative configuration layer, to distinguish them from client- and/or server-set default values and other auto-generated fields, fields set by auto-sizing/auto-scaling systems, etc., in order to facilitate merging

* build/release/image information (timestamps, release ids, git branch, PR numbers, image hashes, registry address, etc.)

* pointers to logging/monitoring/analytics/audit repos

* client library/tool information (e.g. for debugging purposes -- name, version, build info)

* other user and/or tool/system provenance info, such as URLs of related objects from other ecosystem components

* lightweight rollout tool metadata (config and/or checkpoints)

* phone/pager number(s) of person(s) responsible, or directory entry where that info could be found, such as a team website

Yes, this information could be stored in an external database or directory, but that would make it much harder to produce shared client libraries and tools for deployment, management, introspection, etc.

## Namespaces

Namespaces help different projects, teams, or customers to share a kubernetes cluster.

First, they provide a scope for Names. Second, as our access control code develops, convenient to attach authorization and other policy to namespaces.

## Volumes

A Volume is a directory, possibly with some data in it, which is accessible to a Container. Kubernetes Volumes are similar to but not the same as Docker Volumes.

A Pod specifies which Volumes its containers need in its ContainerManifest property.

A process in a Container sees a filesystem view composed from two sources: a single Docker image and zero or more Volumes. A Docker image is at the root of the file hierarchy. Any Volumes are mounted at points on the Docker image; Volumes do not mount on other Volumes and do not have hard links to other Volumes. Each container in the Pod independently specifies where on its image to mount each Volume. This is specified a `VolumeMounts` property.

- Resources

The storage media (Disk, SSD, or memory) of a volume is determined by the media of the filesystem holding the kubelet root dir (typically /var/lib/kubelet). There is no limit on how much space an EmptyDir or PersistentDir volume can consume, and no isolation between containers or between pods.

- Types of Volumes

1. EmptyDir

An EmptyDir volume is created when a Pod is bound to a Node. It is initially empty, when the first Container command starts. Containers in the same pod can all read and write the same files in the EmptyDir. When a Pod is unbound, the data in the EmptyDir is deleted forever.

Some uses for an EmptyDir are:

* scratch space, such as for a disk-based mergesort or checkpointing a long computation.

* a directory that a content-manager container fills with data while a webserver container serves the data.

Currently, the user cannot control what kind of media is used for an EmptyDir. If the Kubelet is configured to use a disk drive, then all EmptyDirectories will be created on that disk drive.

2. HostDir

A Volume with a HostDir property allows access to files on the current node.

Some uses for a HostDir are:

* running a container that needs access to Docker internals; use a HostDir of /var/lib/docker.

* running cAdvisor in a container; use a HostDir of /dev/cgroups.

Watch out when using this type of volume, because: 1) pods with identical configuration (such as created from a podTemplate) may behave differently on different nodes due to different files on different nodes. 2) When Kubernetes adds resource-aware scheduling, as is planned, it will not be able to account for resources used by a HostDir.

- NFS

Kubernetes NFS volumes allow an existing NFS share to be made available to containers within a pod.

## DNS

DNS as a cluster addon, If enabled, a DNS Pod and Service will be scheduled on the cluster, and the kubelets will be configured to tell individual containers to use the DNS Service's IP.

Every Service defined in the cluster (including the DNS server itself) will be assigned a DNS name. By default, a client Pod's DNS search list will include the Pod's own namespace and the cluster's default domain. This is best illustrated by example:

Assume a Service named `foo` in the kubernetes namespace `bar`. A Pod running in namespace `bar` can look up this service by simply doing a DNS query for `foo`. A Pod running in namespace `quux` can look up this service by doing a DNS query for `foo.bar`.

The cluster DNS server [SkyDNS](https://github.com/skynetservices/skydns) supports forward lookups (A records) and service lookups (SRV records).

- How it Works

The DNS pod that runs holds 3 containers - skydns, etcd (which skydns uses), and a kubernetes-to-skydns bridge called `kube2sky`. The kube2sky process watches the kubernetes master for changes in Services, and then writes the information to etcd, which skydns reads. This etcd instance is not linked to any other etcd clusters that might exist, including the kubernetes master.

## Networking

Kubernetes approaches networking somewhat differently that Docker's defaults. We give every pod its own IP address allocated from an internal network, so you do not need to explicitly create links between communicating pods. To do this, you must set up your cluster networking correctly.

Since pods can fail and be replaced with new pods with different IP addresses on different nodes, we do not recommend having a pod directly talk to the IP address of another Pod. Instead, if a pod, or collection of pods, provide some service, then you should create a service object spanning those pods, and clients should connect to the IP of the service object.

- Docker Networking model

Docker uses host-private networking. It creates a virtual bridge, called docker0 by default, and allocates a subnet from one of the private address blocks defined in RFC1918 for that bridge. For each container that Docker creates, it allocates a virtual ethernet device (called veth) which is attached to the bridge. The veth is mapped to appear as `eth0` in the container, using Linux namespaces. The in-container eth0 interface is given an IP address from the bridge's address range.

The result is that Docker containers can talk to other containers only if they are on the same machine (and thus the same virtual bridge). In order for Docker containers to communicate across nodes, they must be allocated ports on the machine's own IP address, which are then forwarded or proxied to the containers. This obviously means that containers must either coordinate which ports they use very carefully or else be allocated ports dynamically.

- Kubernetes Networking model

Kubernetes imposes the following fundamental requirements on any networking implementation:

* all containers can communicate with all other containers without NAT
* all nodes can communicate with all containers (and vice-versa) without NAT
* the IP that a container sees itself as is the same IP that others see it as

What this means in practice is that you can not just take two computers running Docker and expect Kubernetes to work. You must ensure that the fundamental requirements are met. Just like your VM had an IP and could talk to other VMs in your project.

Kubernetes applies IP addresses at the Pod scope - containers within a Pod share their network namespaces - including their IP address. This means that containers within a Pod can all reach each other’s ports on localhost. This does imply that containers within a Pod must coordinate port usage, but this is no different that processes in a VM. We call this the "IP-per-pod" model. This is implemented in Docker as a "pod container" which holds the network namespace open while "app containers" (the things the user specified) join that namespace with Docker's --net=container:<id> function.

As with Docker, it is possible to request host ports, but this is reduced to a very niche operation. In this case a port will be allocated on the host Node and traffic will be forwarded to the Pod. The Pod itself is blind to the existence or non-existence of host ports.

#### How to achieve this - Flannel

[Flannel](https://github.com/coreos/flannel#flannel) is an overlay network that gives a subnet to each machine for use with Kubernetes.

In Kubernetes every machine in the cluster is assigned a full subnet. The machine A and B might have 10.0.1.0/24 and 10.0.2.0/24 respectively. The advantage of this model is that it reduces the complexity of doing port mapping.

- Theory of Operation

To emulate the Kubernetes model from GCE on other platforms we need to create an overlay network on top of the network that we are given from cloud providers. flannel uses the Universal TUN/TAP device and creates an overlay network using UDP to encapsulate IP packets. The subnet allocation is done with the help of etcd which maintains the overlay to actual IP mappings.

flannel give each container an IP that can be used for container-to-container communication. It uses packet encapsulation to create a virtual overlay network that spans the whole cluster. More specifically, flannel gives each host an IP subnet (/24 by default) from which the Docker daemon is able to allocate IPs to the individual containers.

flannel uses etcd to store mappings between the virtual IP and host addresses. A flanneld daemon runs on each host and is responsible for watching information in etcd and routing the packets.

- Configuration

flannel reads its configuration from etcd. By default, it will read the configuration from `/coreos.com/network/config` (can be overridden via --etcd-prefix). At the bare minimum, you must tell flannel an IP range (subnet) that it should use for the overlay. Here is an example of the minimum flannel configuration:  `{ "Network": "10.1.0.0/16" }`

The value of the config should be a JSON dictionary with the following keys:

* Network (string): IPv4 network in CIDR format to use for the entire overlay network. This is the only mandatory key.

* SubnetLen (number): The size of the subnet allocated to each host. Defaults to 24 (i.e. /24) unless the Network was configured to be smaller than a /24 in which case it is one less than the network.

* SubnetMin (string): The beginning of IP range which the subnet allocation should start with. Defaults to the first subnet of Network.

* SubnetMax (string): The end of the IP range at which the subnet allocation should end with. Defaults to the last subnet of Network.

* Backend (dictionary): Type of backend to use and specific configurations for that backend. The list of available backends and the keys that can be put into the this dictionary are listed below. Defaults to "udp" backend.

```json
{
   "Network": "10.1.0.0/16",
    "SubnetLen": 28,
    "SubnetMin": "10.1.10.0",
    "SubnetMax": "10.1.50.0",
    "Backend": {
        "Type": "udp",
        "Port": 7890
    }
}
```

This config instructs flannel to allocate /28 subnets to individual hosts and make sure not to issue subnets outside of 10.1.10.0 - 10.1.50.0 range.

- Firewall

flannel uses UDP port 8285 for sending encapsulated IP packets. Make sure to enable this traffic to pass between the hosts. If you find that you can't ping containers across hosts, this port is probably not open.

Important: If you are starting other units via `cloud-config`, `flanneld.service` needs to be listed before any services that run Docker containers. In addition, other units that will run in containers, including those scheduled via fleet, should include Requires=flanneld.service, After=flanneld.service, and Restart=always|on-failure directives. These directive are necessary because flanneld.service may fail due to etcd not being available yet. It will keep restarting and it is important for Docker based services to also keep trying until flannel is up.

Important: If you are starting flannel on Vagrant, it should be instructed to use the correct network interface:

```yaml
#cloud-config
coreos:
  flannel:
    interface: $public_ipv4
```

- Under the Hood

To reduce the CoreOS image size, flannel daemon is stored in CoreOS Enterprise Registry as a Docker container and not shipped in the CoreOS image.

When flanneld.service it started, it pulls the Docker image from the registry. There is, however, a chicken and the egg problem as flannel configures Docker bridge and Docker is needed to pull down the image.

In order to work around this, CoreOS is configured to optionally run a second copy of Docker daemon which we call `early-docker`. `Early-docker` daemon is started with `--iptables=false` and containers that it executes need to run with host networking. This prevents Docker from starting `docker0` bridge. Use this `systemctl cat early-docker.service` to check its implementation.

Here is the sequence of events that happens when flanneld.service is started followed by a service that runs a Docker container (e.g. redis server):

1. early-docker.service gets started since it is a dependency of flanneld.service.

2. early-docker.service launches a Docker on a separate Unix socket — `/var/run/early-docker.sock`.

3. flanneld.service executes `DOCKER_HOST=unix:///var/run/early-docker.sock docker run --net=host quay.io/coreos/flannel:$FLANNEL_VER` (actual invocation is slightly more complex).

4. flanneld starts and writes out `/run/flannel/subnet.env` with the acquired IP subnet information.

5. ExecStartPost in flanneld.service converts information in `/run/flannel/subnet.env` into Docker daemon command line args (such as --bip and --mtu), storing them in /run/flannel_docker_opts.env

6. redis.service gets started which invokes docker run ..., triggering socket activation of docker.service.

7. docker.service sources in /run/flannel_docker_opts.env which contains env variables with command line options and starts the Docker with them.

8. redis.service runs Docker redis container.

## Secrets

Objects of type secret are intended to hold sensitive information, such as passwords, OAuth tokens, and ssh keys. Putting this information in a secret is safer and more flexible than putting it verbatim in a pod definition or in a docker image.

#### Creating and Using Secrets

Two steps: 1) create a secret resource with secret data  2) create a pod that has a volume of type secret and a container which mounts that volume.

The data field is a map. Its keys must match [DNS_SUBDOMAIN](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/design/identifiers.md). The values are arbitrary data, encoded using base64.

```json
{
  "apiVersion": "v1beta3",
  "kind": "Secret",
  "name": "mysecret",
  "namespace": "myns",
  "data": {
    "username": "dmFsdWUtMQ0K",
    "password": "dmFsdWUtMg0KDQo="
  }
}
```

This is an example of a pod that uses a secret, in json format:

```json
{
  "apiVersion": "v1beta3",
  "name": "mypod",
  "kind": "Pod",
  "spec": {
    "manifest": {
      "containers": [{
        "name": "c",
        "image": "example/image",
        "volumeMounts": [{
          "name": "foo",
          "mountPath": "/etc/foo",
          "readOnly": true
        }]
      }],
      "volumes": [{
        "name": "foo",
        "secret": {
          "secretName": "mysecret"
        }
      }]
    }
  }
}]
```
