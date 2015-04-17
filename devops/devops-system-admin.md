1. [What makes a cluster a cluster?](https://coreos.com/blog/cluster-osi-model/)

A cluster is a layers of abstraction in terms of execution of code on a group of machines, instead of communication between these machines.

A key aspect of this (Open Systems Interconnection) model is the separation of concerns, with well-defined responsibilities and dependence between components: every layer depends on the layer below it and provides useful network functionality (connection, retry, packetization) to the layer above it. At the top, finally, are web sessions and applications of all sorts running and abstracting communication.

- Level 1, Hardware (bare metal, virtual machines, OpenStack, cloud(AWS, DO))

The hardware layer is where it all begins. It mean physical (bare metal) or virtualized hardware. In general, hardware as the CPU, RAM, disk and network equipment that is rented or bought in discrete units.

- Level 2, OS/Machine ABI (Kernel + {systemd, cgroups/namespaces, jails, zones})

The OS layer is where we define how software executes on the hardware: the OS gives us the Application Binary Interface (ABI) by which we agree on a common language that our userland applications speak to the OS (system calls, device drivers, and so on). We also set up a network stack so that these machines can communicate amongst each other. This layer therefore provides our lowest level complete execution environment for applications.

Now, traditionally, we stop here, and run our final application on top of this as a third pseudo-layer of the OS and various user-space packages. We provision individual machines with slightly different software stacks (a database server, an app server) and there’s our server rack. Problem of this model: cost, infeasible over time, scaling over 3+ machines.

This is often where people start to talk about containers, as containers treat the entire OS userland as one hermetic application package that can be managed as an independent unit. Because of this abstraction, we can conceptually shift containers up the stack, as long as they’re above layer 2. We’ll revisit containers in layer 6.

- Level 3, Cluster Consensus (etcd, ZooKeeper, consul)

To begin to mitigate the complexity of managing individual servers, think in cluster, We want to write software that scales across these individual servers and shares work effortlessly.

However, as we add more servers to the picture, we now introduce many more points of failure: networks partition, machines crash and disks fail. How can we build systems in the face of greater uncertainty? What we’d like is some way of creating a uniform set of data and data primitives, as needed by distributed systems. Much like in multiprocessor programming, we need the equivalent of locks, message passing, shared memory and atomicity across this group of machines.

Why is this called consensus? The machines need to ‘agree’ on the same history and order of events in order to make the guarantees we’d like for the primitives described. Locks cannot be taken twice, for example, even if some subset of messages disappears or arrives out of order, or member machines crash for unknown reasons.

These algorithms build data structures to form a coherent, consistent, and fault-tolerant whole.

- Level 4, Cluster Resources (flannel, remote block storage, weave)

With this perspective of a unified cluster, we can now talk about cluster resources. Having abstracted the primitives of individual machines, we use this higher level view to create and interact with the complete set of resources that we have at our disposal. Thus we can consider in aggregate the CPUs, RAM, disk and networking as available to any process in the cluster, as provided by the physical layers underneath.

Viewing the cluster as one large machine, all devices (CPU, RAM, disk, networking) become abstract. This is a benefit already being used by containers. Containers depend on these things being abstracted on their behalf; for example, network bridges. This is so they can use these abstractions at a level higher in the stack while running on any of the underlying hardware.

In some sense, this layer is the equivalent of the hardware layer of the now-primordial notion of the cluster. It may not be as celebrated as the layers above it, but this layer is where some important innovation takes place. Showing a cool auto-scaling webapp demo is nice, but requires things like carving up cluster IP space or where a block device is attached to a host.

- Level 5, Cluster Orchestration and Scheduling (fleet, Mesos, Kubernetes)

Cluster orchestration look a lot like an OS kernel atop these cluster-level resources and the tools given by consistency – symmetry with the layers below again. It’s the purview of the orchestration platform to divide and share cluster resources, schedule applications to run, manage permissions, set up interfaces into and out of the cluster, and at the end of the day, find an ABI-compatible environment for the userland. With increased scale comes new challenges: from finding the right machines to providing the best experience to users of the cluster.

Any software that will run on the cluster must ultimately execute on a physical CPU on a particular server. How the application code gets there and what abstractions it sees is controlled by the orchestration layer. This is similar to how WiFi simulates a copper wire to existing network stacks, with a controllable abstraction through access points, signal strength, meshes, encryption and more.

- Level 6, Containers (Rocket, Docker, systemd-nspawn)

the entire userland is bundled together and treated as a single application unit. they depend on everything else to provide the appropriate execution environment. They carry userland data and expect specific OS details to be presented to them.

If you’ve followed the whole stack up to this point, you’ll see why containers sit at level 6, instead of at level 2 or 3. It’s because the layers of abstraction below this point all depend on each other to build up to the point where a single-serving userland can safely abstract whether it’s running as one process on a local machine or as something scheduled on the cluster as a whole.

- Level 7, Application

Containers can separate the OS and software dependencies from the hardware. By abstracting these details, we can create consistent execution environments across a fleet of machines and let the traditional POSIX userland continue to work, fairly seamlessly, no matter where you take it. If the intention is to share the containers, then choice is important, as is agreeing upon a sharable standard. Containers are exciting; it starts us down the road of a lot of open source work in the realm of true distributed systems, backwards-compatible with the code we already write – our Application.

