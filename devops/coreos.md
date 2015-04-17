# coreOS

CoreOS uses Linux containers to manage your services at a higher level of abstraction. A single service's code and all dependencies are packaged within a container that can be run on one or many CoreOS machines.

The main building block of CoreOS is docker, a Linux container engine, where your applications and code run. Docker is installed on each CoreOS machine. You should construct a container for each of your services (web server, caching, database) start them with fleet and connect them together by reading and writing to etcd.

CoreOS allows you to easily run services in Docker containers across a cluster of machines.

CoreOS is a minimal Linux distribution meant for running containers. It does not ship with a package manager or many of the other common system elements one might expect coming from other more desktop oriented distributions.

Running the latest software traditionally meant taking on risks around stability, security, and incompatibility. Times are changing, and our server deployments need to adapt. Yet for many organizations the process of patching is still too difficult and time consuming, and is often neglected as a result. CoreOS and our [Update Philosophy](https://coreos.com/using-coreos/updates/) aims to remove these pain points and enable our users to safely, and easily, always run the latest, most secure, and stable versions of the software we support, without breaking your deployment.


## [Running CoreOS on Vagrant](https://coreos.com/blog/coreos-clustering-with-vagrant/)

True power of CoreOS can be seen with a cluster, bring up a single machine or virtualize an entire cluster on your laptop.

https://coreos.com/docs/running-coreos/platforms/vagrant/

Use [YAML Validator](http://www.yamllint.com/) to lint your #cloud-config file.

If you need to update your `#cloud-config`(would be saved at `/var/lib/coreos-vagrant/vagrantfile-user-data`) later on, run `vagrant reload --provision` to reboot your VM and apply the new file.

`config.rb` file contains a few useful settings about your Vagrant environment and most importantly, how many machines you'd like in your cluster.

Each CoreOS cluster machines has following services installed or running: docker, etcd, systemctl, fleet.

For a cluster to be properly bootstrapped, you have to provide `cloud-config` via `user-data`, which is covered in each platform's guide. CoreOS gives you three essential tools: service discovery, container management and process management.

run `vagrant up`. Vagrant will instantiate and configure the VMs given the information in servers.yml or `user-data`, customize them via `coreos-cloudinit` using the information in `user-data`, and then communicate out to the etcd discovery URL to form an etcd cluster. Once Vagrant has completed, then you can use `vagrant ssh <name>` to connect to one of the VMs, then use commands like `systemctl status etcd` or `fleetctl list-machines` (to see the membership of the cluster). Once fleet is working as expected, then you can also use `fleetctl` to launch Docker containers across the etcd cluster.

#### Warning:

- insecure_private_key

Each cluster setup would use a different "insecure_private_key", so need to delete the old one. When run `vagrant up` on your cluster setup, it will generate a new "insecure_private_key", then run `ssh-add ~/.vagrant.d/insecure_private_key`, to make sure using up-to-date private key here.

- vagrant destroy

Each cluster needs its own unique discovery URL, so everytime you vagrant destroy you’ll need to generate a new discovery URL.
`curl -w '\n' https://discovery.etcd.io/new`

- $public_ipv4

`user-data` file references a variable `$public_ipv4`. This variable references the static IP address assigned to the public network in the Vagrantfile. it’s used here in the configuration of both etcd and fleet, and if it is not correct or missing then everything breaks.

```bash
$num_instances = 3
$instance_name_prefix = "core"
$update_channel = "beta"
$enable_serial_logging = false
$share_home = false
# On the ram and vcpu lines, tell Vagrant how much RAM and how many vCPUs should be assigned to the VMs it will create.
$vm_gui = false
$vm_memory = 2048
$vm_cpus = 1
$shared_folders = {}
$forwarded_ports = {}
```

#### Running `fleetctl` from external host.

1. [download `fleet` binary](https://github.com/coreos/fleet/releases). make sure you download the version that matches the version of fleet running on the CoreOS cluster.

2. SSH access for a user to at least one host in the cluster

3. ssh-agent running on a user’s machine with the necessary identity

In order to satisfy #2 and #3 above, i added following to `.ssh/config` on the separate machine where I am running `fleetctl`. Vagrant `insecure_private_key` is available in `~/.vagrant.d`, which i have copied to shared directory `/vagrant`.

```bash
# ~/.ssh/config
Host core-01
 User core
 HostName 172.17.8.101
 IdentityFile ~/.vagrant.d/insecure_private_key
```

4. Once the fleetctl binary is installed and communication is established, run following command. required.

```bash
rm -rf ~/.fleetctl/known_hosts
vi ~/.ssh/config  #update the HOST name to match $instance_name_prefix in vagrantfile
rm ~/.vagrant.d/insecure_private_key

vagrant up

# It doesn’t matter which instance you use as the other end of your SSH tunnel,
export FLEETCTL_TUNNEL=172.17.8.101
ssh-add  ~/.vagrant.d/insecure_private_key
fleetctl list-machines
```

#### Use CoreOS with CI

1. Prod deployment pipeline is not triggered automatically. It need manual approval. If you want, you can have approval gates for Dev/QA deployment pipelines as well.

2. There will be testing pipelines to run tests once the application is deployed on any environment

3. Running deployments on Dev, QA and prod should be able to communicate with CoreOS cluster using fleetctl.

4. Each Continuous Delivery pipeline is essentially doing the 5 things which can also be abstracted out to a template:

Check if the application is already deployed on CoreOS cluster.
If yes, kill the containers
Clone the git repo that has application systemd service unit files.
Prepare the service unit file for the application version that pipeline needs to deploy
Submit and start the systemd service unit file via fleetctl.

Note:

Having hierarchy of docker images is really a good idea. This will make sure that application images are very small, hence image building will be very quick.

Application Builds should produce docker containers as artifacts. These docker containers will have all the dependencies built into it.

Docker containers are immutable in nature so instead of bringing an immutable server up after every build, you can kill the running container and start a new one. This is much faster than bringing a new server up. Also there is better utilization of resources in this case.

#### work with coreOS box

```bash
vagrant status
vagrant status core-01
vagrant ssh core-01 -- -A  # connect to one of the machines

# Start VMware provider
vagrant up --provider vmware_fusion
vagrant ssh core-01 -- -A
```

- New Box Versions

```bash
# way 1, manually box update
vagrant box update
# or, simply remove the old box file and Vagrant will download the latest one the next time you vagrant up.
vagrant box remove coreos-alpha vmware_fusion
# then add it, download the URL contained in the Vagrantfile and add it manually
vagrant box add coreos-alpha <path-to-box-file>
```

#### Launch a service with fleet

```bash
# Submit the “application systemd unit” to CoreOS cluster
fleetctl submit sample.application.1@8080.service

# Start the service
fleetctl start sample.application.1@8080.service

# Check status
fleetctl list-units

# Read the service file
fleetctl cat sample.application.1@8080.service

# Check the status/history of the service
fleetctl status sample.application.1@8080.service

# output the logs
# pass -f flag to streams the output of the service on terminal
fleetctl journal (-f) sample.application.1@8080.service

# etcdctl setter and getter
etcdctl set first-etcd-key "Hello World"
etcdctl get first-etcd-key   # Hello World

# verify etcd can set a value
etcdctl ls SETTER_NAME
```

- using `systemctl` and `journalctl`

```bash
# To start a new unit, we need to tell systemd to create the symlink and then start the file
systemctl enable /etc/systemd/system/hello.service
systemctl start hello.service

# To verify the unit started, list of containers running with `docker ps` and read the unit's output with `journalctl`
journalctl -f -u hello.service
```

## etcd

A discovery service, `https://discovery.etcd.io`, is provided as a free service to help connect etcd instances together by storing a list of peer addresses and metadata under a unique address, known as the discovery URL. You can generate them very easily:

```bash
curl -w "\n" https://discovery.etcd.io/new
```

etcd is a distributed key-value store. Other popular one: zookeeper. The data within `etcd` is organized hierarchically, somewhat like a file system. The top of the hierarchy is `/` (root), and from there users can create paths and keys (with values). ex:

```bash
/  # root, already exists when etcd starts
/svclocation  #path or directory within etcd
/svclocation/instance1 = 10.1.1.20  # a key in etcd and it’s associated value
/svclocation/instance2 = 10.1.1.21  # another key and associated value
```

Because etcd is a distributed key-value store, both the organization of the information as well as the actual information is distributed across all the members of an etcd cluster.

- COnfiguration of etcd

etcd can be configured via command-line flags, environment variables, or configuration file. By default, etcd on CoreOS uses a configuration file generated by cloud-init to set environment variables that affect how etcd operates.

For example, when you configure the addr, peer-addr, or discovery properties via cloud-init, CoreOS puts those values into a file named 20-cloudinit.conf in the /run/systemd/system/etcd.service.d/ directory. That file takes those values and assigns them to the ETCD_ADDR, ETCD_PEER_ADDR, and ETCD_DISCOVERY environment variables, respectively. etcd will read those environment variables when it starts, thus controlling the configuration of etcd. By the way, the use of the etcd.service.d directory for configuration files is a systemd thing.

- etcd restful api

`curl` to interact with etcd. `-d` option allows us to pass data to the remote server. `-H` option allows you to add an HTTP header to the request.

```bash
# embed the authentication credentials into the command line
curl -d '{"auth":{"passwordCredentials":{"username": "admin", "password": "secret"},"tenantName": "customer-A"}}' -H "Content-Type: application/json" http://192.168.100.100:5000/v2.0/tokens

# recursively list the keys and values in a path within etcd
curl -X GET http://10.1.1.7:4001/v2/keys/?consistent=true&recursive;=true&sorted;=false

# store some data in etcd, ex: store the value “10.1.1.20:80” at the key `/svclocation`
curl -L http://10.1.1.7:4001/v2/keys/svclocation -X PUT -d value="10.1.1.20:80"

# read this value back
curl -L http://10.1.1.7:4001/v2/keys/svclocation
```

`etcdctl`,  a command-line client to use to interact with etcd.

```bash
etcdctl --peers 10.1.1.7:4001 ls / --recursive
etcdctl --peers 10.1.1.7:4001 mk /svclocation 10.1.1.20:80  # setter
etcdctl --peers 10.1.1.7:4001 get /svclocation   # getter
```

Note:

By default, etcdctl works against a local instance of etcd. In other words, it defaults to connecting to 127.0.0.1:4001. You’ll have to use the --peers flag if you’re running it external to a CoreOS instance. However, if you’re running it directly from a CoreOS instance, you can omit the --peers flag.

You can point etcdctl against any CoreOS instance in an etcd cluster, because the information stored in etcd is shared and distributed across all the members of the cluster.

`confd` takes information stored in etcd and turns it into “standard” configuration files. for example, that you could store dynamic configuration details in etcd, and then use confd to update static configuration files. A common example of using this is updating an HAProxy configuration file via confd as back-end web server containers start up and shut down.

## Fleet

It is a “distributed init system” that operates across a cluster of machines instead of on a single machine. Fleet combines `etcd` and `systemd` to allow users to deploy containers (configured as systemd units) across a cluster of CoreOS systems.

Using fleet, users can deploy a single container anywhere on the cluster, deploy multiple copies of the same container, ensure that containers run on the same machine (or different machines), or maintain a certain number of instances of a service (thus protecting against failure).

- Interacting with Fleet

`fleetctl` interact with fleet assumes it will be interacting with a local etcd endpoint on the loopback address.

way 1: run fleetctl on an instance of CoreOS in your cluster, no further configuration is needed.

way 2: tell fleetctl to use a specific endpoint, or you can tunnel the traffic through SSH. `export FLEETCTL_ENDPOINT=http://10.1.1.7:4001`

way 3: fleetctl remotely tunneling Through SSH, offers a bit more security. To make fleetctl tunnel its communications with etcd through SSH, set an environment variable called FLEETCTL_TUNNEL to the IP address of any node in the etcd cluster. `export FLEETCTL_TUNNEL=10.1.1.7`

However, the configuration involves more than just setting the environment variable. The fleetctl doesn’t expose any options to configure the SSH connection, and it assumes you’ll be using public key authentication. This means you’ll need access to a public key that will work against the nodes in your etcd cluster.

- launch multiple docker containers

If you make multiple copies of a service file, changing the Docker container name and the unit filename, you can submit all of the units to the etcd cluster at the same time. For example, let’s say you wanted to run 3 Nginx containers on the cluster. Make three copies of the file (nginx.1.service, nginx.2.service, and nginx.3.service), modifying the container name in each copy. Make sure that you have the “X-Conflicts” line in there; that tells fleet not to place two Nginx containers on the same system in the cluster.

```bash
# submit them with this command
fleetctl submit nginx.*.service

# start (launch) them with this command
fleetctl start nginx.*.service
```

run `fleetctl list-units` and you should see three Nginx containers distributed across three different CoreOS instances in the etcd cluster, all listed as “loaded” and “active”.

Want to see some of the magic behind fleet? Run `etcdctl --peers _<IP address of cluster node>_:4001 ls /_coreos.com --recursive` and see what’s displayed.



## [confd](https://github.com/kelseyhightower/confd)

confd is a configuration management tool built on top of etcd. Confd can watch certain keys in etcd, and update the related configuration files as soon as the key changes. After that, confd can reload or restart applications related to the updated configuration files. This allows you to automate configuration changes to all the servers in your cluster, and makes sure all services are always looking at the latest configuration.

confd is a lightweight configuration management tool focused on:

keeping local configuration files up-to-date using data stored in etcd, consul, or env vars and processing template resources.
reloading applications to pick up new config file changes

Example: whenever we launched/stopped an application docker container in our cluster we added/removed an entry in etcd as a post start step/post stop step. Hence at any point of time, if anyone needs to know how many application instances are alive, etcd will have up to date information. Apache HTTP server will use confd and information stored in etcd to update its proxy configuration file. That is how it knows on what all instances application is running. Also inside the HTTP server docker container confd is running in background and polls etcd at regular intervals. If any entry is added or removed, confd will update apache configuration file and restart apache.

ex: confd is a daemon which can be configured to watch for changes in etcd keys, and then generate configuration files from template files filled in with current etcd values. So, we’re we’re going to do is create a container to run confd which creates an nginx configuration load balancing our apache servers.

## [Updates](https://coreos.com/using-coreos/updates/)

Application Code

By deploying and running your code in containers, each application is packaged with all of its dependencies. This eliminates dependency conflicts and extensive test cases. Containers can be shipped from dev → test → production and will be bit for bit identical in either environment.

Configuration Values

Distributed platforms contain hundreds of configuration values. Every cache setting, database address, firewall rule and rate-limit needs to be stored somewhere. Traditionally you update these values via Chef or Puppet. But, you can't audit the state of hundreds of machines before you execute your single config change. What if you triggered a library upgrade on a machine that was missed on the last run?

To solve this problem, CoreOS provides distributed configuration with etcd. A single config value can be changed atomically, and only applications that are listening for that change will be affected. Each application can decide how to react to a value changing, and that logic can be updated independently of other applications.


## Tutorials

What is CoreOS?

CoreOS (geared towards clustering and containerization) is a powerful Linux distribution built to make large, scalable deployments on varied infrastructure simple to manage. Based on a build of Chrome OS, CoreOS maintains a lightweight host system and uses Docker containers for all applications.
The OS is updated as a whole, not package-by-package.
CoreOS is designed to primarily be manipulated at the cluster-level, not at the level of individual servers.

To manage these clusters, CoreOS uses a globally distributed key-value store called `etcd` to pass configuration data between nodes.
etcd is also the platform for service discovery, allowing applications to be dynamically configured based on the information available through the shared resource.

In order to schedule and manage applications across the entirety of the cluster, a tool called fleet is used. Fleet serves as a cluster-wide init system that can be used to manage processes across the entire cluster. This makes it easy to configure highly available applications and manage the cluster from a single point. It does this by tying into each individual node's `systemd` init system.

- Difference on traditional host

The main host system is relatively simple and foregoes many of the common "features" of traditional servers. In fact, CoreOS does not even have a package manager. Instead, all additional applications are expected to run as Docker containers, allowing for isolation, portability, and external management of the services.

At boot, CoreOS reads a user-supplied configuration file called "cloud-config" to do some initial configuration. This file allows CoreOS to connect with other members of a cluster, start up essential services, and reconfigure important parameters. This is how CoreOS is able to immediately join a cluster as a working unit upon creation.

`etcd daemon` is used to store and distribute data to each of the hosts in a cluster. This is useful for keeping consistent configurations and it also serves as a platform with which services can announce themselves. This service-discovery mechanism can be used by other services to query for information in order to adjust their configuration details. For example, a load balancer would be able to query etcd for the IP addresses of multiple backend web servers when it starts up.

`fleet daemon` is basically a distributed init system. It works by hooking into the systemd init system on each individual host in a cluster. It handles service scheduling, constraining the deployment targets based on user-defined criteria. Users can conceptualize the cluster as a single unit with fleet.

- Concepts

1. CoreOS uses the Omaha protocol. This dual root partition scheme allows CoreOS to run off one root partition while updating the other; the system then reboots onto the updated partition once an update is complete. If the system fails to boot from the updated partition, then reboot it again and it will revert to the known-good installation on the first partition.

2. All applications on CoreOS run in containers. This enables separation of applications from the underlying OS and further streamlines the CoreOS update process (because applications are essentially self-contained).

3. CoreOS leverages systemd. it is the new standard system and service manager for Linux. Ubuntu will adopt systemd with 14.10, In CoreOS, systemd unit files are used not only for system services, but also for running Docker containers.

4. etcd distributed key-value data store can be used for shared configuration and service discovery. etcd uses a simple REST API (HTTP+JSON) and leverages the Raft consensus protocol. Docker containers on CoreOS are able to access etcd via the loopback interface, and thus can use etcd to do dynamic service registration or discovery, for example. etcd is also configurable via cloud-init, which means it’s friendly to deployment on many cloud platforms including OpenStack.

5. CoreOS supports deploying containers across a cluster using fleet. Fleet is another open source project that leverages etcd to deploy Docker containers (written as systemd unit files) across a cluster of CoreOS systems. Fleet leverages both etcd and systemd to support the deployment of containers across a cluster of systems.

- Basic overview of all elements

1. Docker

Docker is a containerization system that utilizes LXC, also known as Linux containers, and uses kernel namespacing and cgroups in order to isolate processes.

The isolation helps keep the running environment of the application clean and predictable. One of the main benefits of this system though is that it makes distributing software trivial. A Docker container should be able to run exactly the same regardless of the operating environment. This means that a container built on a laptop can run seamlessly on a datacenter-wide cluster.

Docker allows you to distribute a working software environment with all of the necessary dependencies. Docker containers can run side-by-side with other containers, but act as an individual server. The advantage of Docker containers over virtualization is that Docker does not seek to emulate an entire operating system, it only implements the components necessary to get the application to run.

2. Etcd

provide a consistent set of global data to each of the nodes in a cluster and to enable service discovery functionality. The etcd service is a highly available key-value store that can be used by each node to get configuration data, query information about running services, and publish information that should be known to other members. Each node runs its own etcd client. These are configured to communicate with the other clients in the cluster to share and distribute information.

Applications wishing to retrieve information from the store simply need to connect to the etcd interface on their local machine. All etcd data will be available on each node, regardless of where it is actually stored and each stored value will be distributed and replicated automatically throughout the cluster. Leader elections are also handled automatically, making management of the key-store fairly trivial.

To interact with etcd data, Two ways include the etcdctl command and the HTTP API.

3. Fleet

orchestrate the CoreOS clusters, or acts as a cluster-wide init system.

Each individual node within a clustered environment operates its own conventional systemd init system. This is used to start and manage services on the local machine. In a simplified sense, what fleet does is provide an interface for controlling each of the cluster members' systemd systems.

You can start or stop services or get state information about running processes across your entire cluster. However, fleet does a few important things to make this more usable. It handles the process distribution mechanism, so it can start services on less busy hosts.

You can also specify placement conditions for the services you are running. You can insist that a service must or must not run on certain hosts depending on where they are located, what they are already running, and more. Because fleet leverages systemd for starting the local processes, each of the files which define services are systemd unit files (with a few custom options). You can pass these configuration files into fleet once and manage them for the entire cluster.

Any of the member nodes can be used to manage the cluster using the fleetctl utility. This allows you to schedule services, manage nodes, and see the general state of your systems.

- Start CoreOS cluster

1. SSH Keys

Every CoreOS server that you create will need to have at least one SSH public key installed during its creation process. The key(s) will be installed to the `core` user's authorized keys file, and you will need the corresponding private key(s) to log in to your CoreOS server. Can add your private key to your SSH agent on your client machine by running `ssh-add`

2. Generate a New Discovery URL

a unique address that stores peer CoreOS addresses and metadata. Run `curl -w "\n" https://discovery.etcd.io/new`

You will use your resulting discovery URL to create your new CoreOS cluster. The same discovery URL must be specified in the etcd section of the cloud-config of each server that you want to add to a particular CoreOS cluster.

3. Write a Cloud-Config File

CoreOS uses a file called `cloud-config` (YAML format) which allows you to declaratively customize network configuration, systemd units, and other OS-level items. The `cloud-config` file is processed when a machine is booted, and provides a way to configure your machines with etcd settings that will allow them to discover the cluster that they should join.

the peer addresses of each CoreOS machine in a cluster is stored with the discovery URL.

Requirement: each machine in a cluster must use the same discovery URL and pass in its own IP address where its etcd service can be reached.

You will also need to specify a `units` section, which will start the `etcd` and `fleet` services that are necessary for a working CoreOS cluster.

```bash
#cloud-config

coreos:
  etcd:
    # generate a new token for each unique cluster from https://discovery.etcd.io/new
    discovery: https://discovery.etcd.io/<token>
    # use $public_ipv4 if your datacenter of choice does not support private networking
    addr: $private_ipv4:4001
    peer-addr: $private_ipv4:7001
  # optional: do not intend to use the `fleetctl ssh` command.
  fleet:
    public-ip: $private_ipv4   # used for fleetctl ssh command
  units:
    - name: etcd.service
      command: start
    - name: fleet.service
      command: start
```

create at least three new CoreOS machines and be sure to use the same `cloud-config` for each. Once your CoreOS machines have booted completely, they should automatically cluster together. To login one of the machine, using `ssh` with `-A` option to forward your SSH agent.

Warning: Be sure to set up IPTables to restrict access to port 4001 to machines within your CoreOS cluster, after the cluster is set up. This will prevent external, unauthorized  users from controlling your CoreOS machines.

- Adding New Machines

simply create a new droplet using the same `cloud-config` (and discovery URL). Your new CoreOS machine will automatically join the existing cluster.

If you forgot which discovery URL you used, you may look it up on one of the members of the cluster. Use the following grep command on one of your existing machines:

```bash
grep DISCOVERY /run/systemd/system/etcd.service.d/20-cloudinit.conf
# see a line the contains the original discovery URL
# Environment="ETCD_DISCOVERY=https://discovery.etcd.io/575302f03f4fb2db82e81ea2abca55e9"
```

##### Fleet and Fleetctl to Manage your CoreOS Cluster

Fleet allows users to manage Docker containers as services for their entire cluster. It works by acting as an interface and a level of abstraction over each cluster member's systemd init system. Users can set constraints that affect the conditions under which a service runs.  This lets administrators define what they would like their infrastructure to look like by telling certain applications to run on the same or separate hosts based on the supplied criteria.

Ex: Cluster has three nodes, They are configured to communicate between each other using the private networking interface. The public interface is available on each of these nodes for running public services.

- Service Unit Files

Unit files are used by the systemd init system to describe each available service, define the commands needed to manage it, and set dependency information to ensure the system is in a workable state when each service is started.

The basic sections that most unit files will have are:

1. Unit

This section is used to provide generic information about the unit that is not dependent on the "type" of unit. This will include metadata information and dependency information. This is mainly used in fleet to provide descriptions and specify this units place in connection to other service units.

2. Unit Type Section

The fleet daemon can take units of different types, including: Service, Socket, Device, Mount, Automount, Timer, Path

If the type has specific options, then a section of the associated type is allowed. The Service section type is by far the most common. This section is used to define type-specific attributes. For Service units, this usually involves defining the start and stop commands, as well as the pre and post start or stop commands that might perform associated actions.

3. X-Fleet

provide fleet-specific configuration options. This mainly means that you can specify that a service must or must not be scheduled in a certain way based on criteria like machine ID, currently running services, metadata information, etc.

```bash

[Service]
# disable the starting timeout
TimeoutStartSec=0
# =- it means that the action can fail and not affect the service's completion.
ExecStartPre=-/usr/bin/docker rm hello
ExecStart=/usr/bin/docker run --name hello busybox /bin/sh -c "while true; do echo Hello World; sleep 1; done"
```

By default, fleet will use the machine's public IPv4 address for communication with other members. However, in our cloud-config file, we told fleet to use our private interfaces for communication. These are the IP addresses shown in the above output.

The "METADATA" column is by default blank in the above example. However, we could have added arbitrary key-value pairs under the metadata attribute for fleet in the cloud-config. It is useful for quickly getting information about a node from a management perspective, but it can also be used in service definitions to target specific hosts. This might look like this:

```bash
#cloud-config
. . .
coreos:
  fleet:
    public-ip: $private_ipv4
    metadata: region=europe,public_ip=$public_ipv4
```

- Service Management

Once your unit is submitted, the next step is to schedule it on a machine. Scheduling the unit involves the fleet engine looking at the unit to decide on the best machine in the cluster to pass the unit to. This will be predicated on the conditions within the [X-Fleet] section of the unit, as well as the current work volume of each machine in the cluster. When the unit has been scheduled, it has been passed to the specific machine and loaded into the local systemd instance.


```bash
# fleetctl list-unit-files
# DSTATE:  desired state;    STATE: actual state.  If these two match, this usually means that the action was successful.
UNIT        HASH    DSTATE      STATE       TMACHINE
hello1.service   0d1c468 loaded  loaded  14ffe4c3.../10.132.249.212  # loaded state indicate machine it is scheduled on:
hello.service   0d1c468 launched    launched    14ffe4c3.../10.132.249.212
hello.service   0d1c468 inactive    inactive    -      # after run unloaded, did not schedule into a machine, but not destroy yet

# fleetctl list-units:    information about the systemd state.
# ACTIVE: a generalized state of the unit;    SUB: a more low-level description
UNIT        MACHINE             ACTIVE      SUB
hello.service   14ffe4c3.../10.132.249.212  inactive    dead   # loaded state with scheduled machine
hello.service   14ffe4c3.../10.132.249.212  active  running
```

##### Etcdctl and Etcd

It is a globally distributed key-value store. This service is used by the individual CoreOS machines to form a cluster and as a platform to store globally-accessible data.

etcd can be used to store or retrieve information from any machine in your cluster. This allows you to synchronize data and provides a location for services to look for configuration data and connection details.

This is especially useful when building distributed systems because you can provide a simple endpoint that will be valid from any location within the cluster. By taking advantage of this resource, your services can dynamically configure themselves.

- Etcd Cluster Discovery Model

One of the most fundamental tasks that etcd is responsible for is organizing individual machines into a cluster. This is done when CoreOS is booted by checking in at the discovery address supplied in the cloud-config file which is passed in upon creation.

You must supply a fresh token for every new cluster. This includes when you have to rebuild the cluster using nodes that may have the same IP address. The etcd instances will be confused by this and will not function correctly to build the cluster if you reuse the discovery address.

When the machines running etcd boot up, they will check the information at this URL. It will submit its own information and query about other members. The first node in the cluster will obviously not find information about other nodes, so it will designate itself as the cluster leader.

The subsequent machines will also contact the discovery URL with their information. They will receive information back about the machines that have already checked in. They will then choose one of these machines and connect directly, where they will get the full list of healthy cluster members. The replication and distribution of data is accomplished through the Raft consensus algorithm.

The data about each of the machines is stored within a hidden directory structure within etcd. You can see the information about the machines that etcd knows about by typing:

```bash
etcdctl ls /_etcd/machines --recursive
# /_etcd/machines/2ddbdb7c872b4bc59dd1969ac166501e
# /_etcd/machines/921a7241c31a499a97d43f785108b17c
# /_etcd/machines/27987f5eaac243f88ca6823b47012c5b

# see the individual values by requesting those with etcdctl
etcdctl get /_etcd/machines/2ddbdb7c872b4bc59dd1969ac166501e
```

- Etcdctl Usage

two basic ways of interacting with etcd. Through the HTTP/JSON API and through a client, like the included etcdctl utility.

```bash
etcdctl ls /  # see the top-level keys
etcdctl ls / --recursive   # list its entire hierarchy of visible information

etcdctl -o extended get /coreos.com/updateengine/rebootlock/semaphore  # additional metadata about this entry by passing in the `-o extended` option. This is a global option, so it must come before the get command

etcdctl mkdir /example   # create a new directory
etcdctl mkdir /here/you/go --ttl 120  # `updatedir` command for directories is probably only useful if you have set a TTL, or time-to-live on a directory.
etcdctl updatedir /here/you/go --ttl 500  # update the TTL time with the one passed`
etcdctl setdir /x/y/z  #  get this same create-if-does-not-exist functionality for directories
etcdctl rmdir /x/y/z  # remove only an empty directory or a key. make sure you are only removing the endpoints of the hierarchies

etcdctl mk /example/key data  # make a key. only work if the key does not already exist. The key is "/example/key". the value is "data"
etcdctl get /example/key  # retrieve the data
etcdctl update /example/key turtles  # update an existing key
etcdctl set /example/key new  # change the value of an existing key, or to create a key if it does not exist. a combination of the `mk` and `update`
etcdctl set /a/b/c here # include non-existent paths

etcdctl rm /a/b/c  #  remove a key
etcdctl rm /a --recursive  # recursively to remove a directory and every subdirectory

# watch either a specific key or an entire directory for changes. It will cause the operation to hang until some event happens to whatever is being watched.
etcdctl watch /example/hello  # watch a key. To stop watching, you can press CTRL-C.
etcdctl watch --recursive /example  # watch an entire directory structure
etcdctl exec-watch --recursive  /example -- echo "hello"  # execute a command whenever a change is detected
```

- Hidden Values

there are hidden directory structures within etcd. These are directories or keys that begin with an underscore. These are not listed by the conventional etcdctl tools and you must know what you are looking for in order to find them.

For instance, there is a hidden directory called /_coreos.com that holds some internal information about fleet. You can see the hierarchy by explicitly asking for it:

```bash
etcdctl ls --recursive /_coreos.com  #  some internal information about fleet
etcdctl ls --recursive /_etcd  # directory structure
```

These function exactly like any other entry, with the only difference being that they do not show up in general listings. You can create them by simply starting your key or directory name with an underscore.

- Etcd HTTP/JSON API Usage

To access the API, you can use a simple HTTP program like curl. You must supply the -L flag to follow any redirects that are passed back. From within your cluster, you can use the local 127.0.0.1 interface and port 4001 for most queries.

Note: To connect to etcd from within a Docker container, the address http://172.17.42.1:4001 can be used. This can be useful for applications to update their configurations based on registered information.

The trailing slash in the request is mandatory. It will not resolve correctly without it.
You can set or retrieve values using normal HTTP verbs.
To modify the behavior of these operations, you can pass in flags at the end of your request using the ?flag=value syntax. Multiple flags can be separated by a & character.


```bash
curl -L http://127.0.0.1:4001/v2/keys/  # get a listing of the top-level keys/directories
curl -L http://127.0.0.1:4001/v2/keys/?recursive=true  # recursively list all of the keys
curl -L http://127.0.0.1:4001/version  # version info

curl -L http://127.0.0.1:4001/v2/stats/leader  # view stats about each of the cluster leader's relationship with each follower
curl -L http://127.0.0.1:4001/v2/stats/self  #  detect stats about the machine you are currently on
curl -L http://127.0.0.1:4001/v2/stats/store  #  see stats about operations that have been preformed
```

- Etcd Configuration

1. pass in parameters with your cloud-config file when bootstrap nodes

```bash
#cloud-config

coreos:
  etcd:
    discovery: https://discovery.etcd.io/<token>
    addr: $private_ipv4:4001
    peer-addr: $private_ipv4:7001
. . .
```

`etcd -h   #  see the options that you have available`. To include these options in your cloud-config, simply take off the leading dash and separate keys from values with a colon instead of an equal sign. So -peer-addr=<host:port> becomes peer-addr: <host:port>.

Upon reading the cloud-config file, CoreOS will translate these into environmental variables in a stub unit file, which is used to start the service.

2.  adjust the settings for etcd is through the API

This is generally done using the 7001 port instead of the standard 4001 that is used for key queries.

```bash
curl -L http://127.0.0.1:7001/v2/admin/config  #  current configuration values
curl -L http://127.0.0.1:7001/v2/admin/config -XPUT -d '{"activeSize":9,"removeDelay":1800,"syncInterval":5}'  # change these values by passing in the new JSON as the data payload with a PUT operation
curl -L http://127.0.0.1:7001/v2/admin/machines  # get a list of machines
```

This can be used to remove machines forcefully from the cluster with the DELETE method.
