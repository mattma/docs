connect your machines together as a cluster. Configure machine parameters, create users, inject multiple SSH keys and more with cloud-config. Providing a discovery token via cloud-config is the easiest way to get a cluster set up.

## Planning A Cluster

#### [Cluster architectures](https://coreos.com/docs/cluster-management/setup/cluster-architectures/)

- Easy Development/Testing Cluster

The cloud-config files provided with each section are valid, but you will need to add SSH keys and other desired configuration options. etcd_server set via cloud-config, frequently tweak your cloud-config which requires booting/rebooting/destroying many machines.

only using a single etcd node, there is no need to include a discovery token.

```bash
#cloud-config
coreos:
  etcd:
    addr: 10.0.0.101:4001
```

- Production Cluster with Central Services

For large clusters, it's recommended to set aside 3-5 machines to run central services. Once those are set up, you can boot as many workers as your heart desires. Each of the workers will use the distributed etcd cluster on the central machines. fleet will be used to bootstrap both the central services and jobs on the worker machines by taking advantage of machine metadata and global units.

```bash
#cloud-config
coreos:
  etcd:
    # generate a new token for each unique cluster from https://discovery.etcd.io/new?size=3
    # specify the intial size of your cluster with ?size=X
    discovery: https://discovery.etcd.io/<token>
    # multi-region and multi-cloud deployments need to use $public_ipv4
    addr: 10.0.0.101:4001
    peer-addr: 10.0.0.101:7001
```

#### [Update Strategies](https://coreos.com/docs/cluster-management/setup/update-strategies/)

4 automatically update strategies:

best-effort:  Default. If etcd is running, `etcd-lock` strategy, otherwise use `reboot` strategy.
etcd-lock:    Reboot after first taking a distributed lock in etcd. (hold a reboot lock before it is allowed to reboot.)

```bash
locksmithctl set-max 4
locksmithctl status
locksmithctl unlock 69d27b356a94476da859461d3a3bc6fd  # manually clear a lock
```

reboot:   Reboot immediately after an update is applied.
off:  Do not reboot after updates are applied.

```bash
#cloud-config
coreos:
  update:
    reboot-strategy: best-effort
```

## Setting Up a Cluster

#### [CoreOS Cluster Discovery](https://coreos.com/docs/cluster-management/setup/cluster-discovery/)

CoreOS uses etcd, a service running on each machine, to handle coordination between software running on the cluster. For a group of CoreOS machines to form a cluster, their etcd instances need to be connected, get a machine connected to the network and join the cluster.

Starting a CoreOS cluster requires one of the new machines to become the first leader of the cluster. The initial leader is stored as metadata with the discovery URL in order to inform the other members of the new cluster. Let's walk through a timeline a new 3 machine CoreOS cluster discovering each other:

1. All three machines are booted via a cloud-provider with the same cloud-config in the user-data. (same discovery token)
2. Machine 1 starts up first. It requests information about the cluster from the discovery token and submits its `peer-addr` address `10.10.10.1`.
3. No state is recorded into the discovery URL metadata, so machine 1 becomes the leader and records the state as `started`.
4. Machine 2 boots and submits its `peer-addr` address `10.10.10.2`. It also reads back the list of existing peers (only 10.10.10.1) and attempts to connect to the address listed.
5. Machine 2 connects to Machine 1 and is now part of the cluster as a follower.
6. Machine 3 boots and submits its `peer-addr` address `10.10.10.3`. It reads back the list of peers ( 10.10.10.1 and 10.10.10.2) and selects one of the addresses to try first. When it connects to a machine in the cluster, the machine is given a full list of the existing other members of the cluster.
7. The cluster is now bootstrapped with an initial leader and two followers.

- Join existing clusters

Boot the new machines with a cloud-config containing the same discovery URL. After boot, the new machines will see that a cluster already exists and attempt to join through one of the addresses stored with the discovery URL.

If discovery URL contain addresses of peers that are no longer alive. Each entry in the discovery URL has a TTL of 7 days, which should be long enough to make sure no extended outages cause an address to be removed erroneously. There is no harm in having stale peers in the list until they are cleaned up, since an etcd instance only needs to connect to one valid peer in the cluster to join. discovery URL can contain no existing addresses, because they were all removed after 7 days.

- TroubleShooting

[YAML validator](http://www.yamllint.com/) valid Cloud-Config.

Stale Tokens: Problem is the initial leader election is recorded into the URL, the new machines will attempt to connect to each of the old peer addresses, which will fail since they don't exist, and the bootstrapping process will fail. To find out the stale tokens: 1. open the URL  2. `journalctl -u etcd`, etcd log can provide more clues.

If your CoreOS cluster can't communicate out to the public internet, `https://discovery.etcd.io` won't work and you'll have to run your own discovery endpoint.

Setting Peer Addresses Correctly. Each etcd instance submits the -peer-addr of each etcd instance to the configured discovery service. It's important to select an address that all peers in the cluster can communicate with.

#### [Using Cloud-Config](https://coreos.com/docs/cluster-management/setup/cloudinit-cloud-config/)

CoreOS uses `#cloud-config` files (ex: user-data) as it configures the OS after startup or during runtime, they are processed during each boot. Invalid cloud-config won't be processed but will be logged in the journal. [cloud config validator](https://coreos.com/validate/)

The [cloud-config docs](http://cloudinit.readthedocs.org/en/latest/index.html) file uses the YAML file format, which uses whitespace and new-lines to delimit lists, associative arrays, and values. A cloud-config file must contain `#cloud-config`, followed by an associative array which has zero or more of the following keys: `coreos, ssh_authorized_keys, hostname, users, write_files, manage_etc_hosts`

- Configuration Parameters: coreos

1. etcd

The `coreos.etcd.*` parameters will be translated to a partial systemd unit acting as an [etcd doc](https://github.com/coreos/etcd/blob/master/Documentation/configuration.md) configuration file.

```bash
#cloud-config
coreos:
  etcd:
      name: node001
      # generate a new token for each unique cluster from https://discovery.etcd.io/new
      discovery: https://discovery.etcd.io/<token>
      # multi-region and multi-cloud deployments need to use $public_ipv4
      addr: $public_ipv4:4001
      peer-addr: $private_ipv4:7001
```

will generate a systemd unit drop-in like this:

```bash
[Service]
Environment="ETCD_NAME=node001"
Environment="ETCD_DISCOVERY=https://discovery.etcd.io/<token>"
Environment="ETCD_ADDR=203.0.113.29:4001"
Environment="ETCD_PEER_ADDR=192.0.2.13:7001"
```

2. fleet

The `coreos.fleet.*` parameters allow for the configuration of [fleet docs](https://github.com/coreos/fleet/blob/master/Documentation/deployment-and-configuration.md#configuration) through environment variables.

```bash
#cloud-config
coreos:
  fleet:
      public-ip: $public_ipv4
      metadata: region=us-west

# generate systemd service
[Service]
Environment="FLEET_PUBLIC_IP=203.0.113.29"
Environment="FLEET_METADATA=region=us-west"
```

3. flannel

The `coreos.flannel.*` parameters set environment variables for flanneld.

```bash
#cloud-config
coreos:
  flannel:
      etcd_prefix: /coreos.com/network2

# generate systemd service
[Service]
Environment="FLANNELD_ETCD_PREFIX=/coreos.com/network2"
```

List of flannel configuration parameters:

etcd_endpoints: Comma separated list of etcd endpoints
etcd_cafile: Path to CA file used for TLS communication with etcd
etcd_certfile: Path to certificate file used for TLS communication with etcd
etcd_keyfile: Path to private key file used for TLS communication with etcd
etcd_prefix: Etcd prefix path to be used for flannel keys
ip_masq: Install IP masquerade rules for traffic outside of flannel subnet
subnet_file: Path to flannel subnet file to write out
interface: Interface (name or IP) that should be used for inter-host communication

4. locksmith

The `coreos.locksmith.*` parameters set environment variables for [locksmith docs](https://github.com/coreos/locksmith/blob/master/README.md).

```bash
#cloud-config
coreos:
  locksmith:
      endpoint: example.com:4001

# generate systemd service
[Service]
Environment="LOCKSMITHD_ENDPOINT=example.com:4001"
```

5. update

The `coreos.update.*` parameters manipulate settings related to how CoreOS instances are updated.

reboot-strategy: "reboot", "etcd-lock", "best-effort" or "off"
server: The location of the CoreUpdate server which will be queried for updates.
group: signifies the channel which should be used for automatic updates.  "master", "alpha", "beta", "stable"

```bash
#cloud-config
coreos:
  update:
    reboot-strategy: etcd-lock
```

6. units

The `coreos.units.*` parameters define a list of arbitrary systemd units to start after booting. This feature is intended to help you start essential services required to mount storage and configure networking in order to join the CoreOS cluster. It is not intended to be a Chef/Puppet replacement.

Each item is an object with the following fields:

- name: String representing unit's name. Required.

- runtime: Boolean indicating whether or not to persist the unit across reboots. This is analogous to the `--runtime` argument to `systemctl enable`. The default value is false.

- enable: Boolean indicating whether or not to handle the [Install] section of the unit file. This is similar to running `systemctl enable <name>`. The default value is false.

- content: Plaintext string representing entire unit file. If no value is provided, the unit is assumed to exist already.

- command: Command to execute on unit: start, stop, reload, restart, try-restart, reload-or-restart, reload-or-try-restart. The default behavior is to not execute any commands.

- mask: Whether to mask the unit file by symlinking it to `/dev/null` (analogous to `systemctl mask <name>`). Note that unlike `systemctl mask`, this will destructively remove any existing unit file located at `/etc/systemd/system/<unit>`, to ensure that the mask succeeds. The default value is false.

- drop-ins: A list of unit drop-ins with the following fields:
    - name: String representing unit's name. Required.
    - content: Plaintext string representing entire file. Required.

NOTE: The command field is ignored for all network, netdev, and link units. The systemd-networkd.service unit will be restarted in their place.

```bash
#cloud-config
coreos:
  units:
    # Start the built-in etcd and fleet services:
    - name: etcd.service
     command: start
    - name: fleet.service
     command: start
    # Write a unit to disk, automatically starting it.
    - name: docker-redis.service
      command: start
      content: |
        [Unit]
        Description=Redis container
        Author=Me
        After=docker.service

        [Service]
        Restart=always
        ExecStart=/usr/bin/docker start -a redis_server
        ExecStop=/usr/bin/docker stop -t 2 redis_server
    # Add the DOCKER_OPTS environment variable to docker.service.
    - name: docker.service
      drop-ins:
        - name: 50-insecure-registry.conf
           content: |
             [Service]
             Environment=DOCKER_OPTS='--insecure-registry="10.0.1.0/24"'
```

- Configuration Parameters: ssh_authorized_keys

it adds public SSH keys which will be authorized for the core user.

```bash
#cloud-config
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0g+ZTxC7weoIJLUafOgrm+h...
```

- Configuration Parameters: hostname

It defines the system's hostname. This is the local part of a fully-qualified domain name (i.e. foo in foo.example.com).

```bash
#cloud-config
hostname: coreos1
```

- Configuration Parameters: users

It adds or modifies the specified list of users. Each user is an object which consists of the following fields. Each field is optional and of type string unless otherwise noted. All but the `passwd` and `ssh-authorized-keys` fields will be ignored if the user already exists.

name: Required. Login name of user
gecos: GECOS comment of user
passwd: Hash of the password to use for this user
homedir: User's home directory. Defaults to /home/<name>
no-create-home: Boolean. Skip home directory creation.
primary-group: Default group for the user. Defaults to a new group created named after the user.
groups: Add user to these additional groups
no-user-group: Boolean. Skip default group creation.
ssh-authorized-keys: List of public SSH keys to authorize for this user
coreos-ssh-import-github: Authorize SSH keys from GitHub user
coreos-ssh-import-github-users: Authorize SSH keys from a list of GitHub users
coreos-ssh-import-url: Authorize SSH keys imported from a url endpoint.
system: Create the user as a system user. No home directory will be created.
no-log-init: Boolean. Skip initialization of lastlog and faillog databases.

```bash
#cloud-config
users:
  - name: mattma
    passwd: $6$5s2u6/jR$un0AvWnqilcgaNB3Mkxd5yYv6mTlWfOoCYHZmfi3LDKVltj.E8XNKEcwWm...
    groups:
      - sudo
      - docker
    ssh-authorized-keys:
      - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0g+ZTxC7weoIJLUafOgrm+h...
```

Manually add user in Shell

```bash
# "*" creates a user that cannot login with a password but can log in via SSH key
# -U creates a group for the user
# -m creates a home directory
# -G adds the user to the existing sudo group
sudo useradd -p "*" -U -m user1 -G sudo
# optionally, add a password for the user
sudo passwd user1
# optionally, To assign an SSH key
update-ssh-keys -u user1 user1.pem
```

- Configuration Parameters: write_files

It directive defines a set of files to create on the local filesystem. Each item in the list may have the following keys:

path: Absolute location on disk where contents should be written
content: Data to write at the provided path
permissions: Integer representing file permissions, typically in octal notation (i.e. 0644)
owner: User and group that should own the file written to disk. This is equivalent to the <user>:<group> argument to chown <user>:<group> <path>.
encoding: Optional. The encoding of the data in content. If not specified this defaults to the yaml document encoding (usually utf-8). Supported encoding types are:
    b64, base64: Base64 encoded content
    gz, gzip: gzip encoded content, for use with the !!binary tag
    gz+b64, gz+base64, gzip+b64, gzip+base64: Base64 encoded gzip content

```bash
#cloud-config
write_files:
  - path: /etc/resolv.conf
    permissions: 0644
    owner: root
    content: |
      nameserver 8.8.8.8
  - path: /etc/motd
    permissions: 0644
    owner: root
    content: |
      Good news, everyone!
  - path: /tmp/like_this
    permissions: 0644
    owner: root
    encoding: gzip
    content: !!binary |
      H4sIAKgdh1QAAwtITM5WyK1USMqvUCjPLMlQSMssS1VIya9KzVPIySwszS9SyCpNLwYARQFQ5CcAAAA=
  - path: /tmp/or_like_this
    permissions: 0644
    owner: root
    encoding: gzip+base64
    content: |
      H4sIAKgdh1QAAwtITM5WyK1USMqvUCjPLMlQSMssS1VIya9KzVPIySwszS9SyCpNLwYARQFQ5CcAAAA=
  - path: /tmp/todolist
    permissions: 0644
    owner: root
    encoding: base64
    content: |
      UGFjayBteSBib3ggd2l0aCBmaXZlIGRvemVuIGxpcXVvciBqdWdz
```

- Configuration Parameters: manage_etc_hosts

It configures the contents of the `/etc/hosts` file, which is used for local name resolution. Currently, the only supported value is "localhost" which will cause your system's hostname to resolve to "127.0.0.1". This is helpful when the host does not have DNS infrastructure in place to resolve its own hostname, for example, when using Vagrant.

```bash
#cloud-config
manage_etc_hosts: localhost
```

#### [Mounting Storage](https://coreos.com/docs/cluster-management/setup/mounting-storage/)

do this via cloud-config with a .mount unit. Here's an example that mounts an EC2 ephemeral disk:

```bash
#cloud-config
coreos:
  units:
    - name: media-ephemeral.mount
      command: start
      content: |
        [Mount]
        What=/dev/xvdb
        Where=/media/ephemeral
        Type=ext3
```

It's important to note that systemd requires mount units to be named after the "mount point directories they control". In our example above, we want our device mounted at `/media/ephemeral` so it must be named `media-ephemeral.mount`.

Ex: mount a btrfs device to `/var/lib/docker`, where docker stores images. do this on the fly when the machines starts up with a `oneshot` unit that formats the drive and another one that runs afterwards to mount it. Be sure to hardcode the correct device or look for a device by label. starting both units at the same time and using systemd to work out the dependencies. In this case, var-lib-docker.mount requires format-ephemeral.service, ensuring that our storage will always be formatted before it is mounted. Docker will refuse to start otherwise.

```bash
#cloud-config
coreos:
  units:
    - name: format-ephemeral.service
      command: start
      content: |
        [Unit]
        Description=Formats the ephemeral drive
        [Service]
        Type=oneshot
        RemainAfterExit=yes
        ExecStart=/usr/sbin/wipefs -f /dev/xvdb
        ExecStart=/usr/sbin/mkfs.btrfs -f /dev/xvdb
    - name: var-lib-docker.mount
      command: start
      content: |
        [Unit]
        Description=Mount ephemeral to /var/lib/docker
        Requires=format-ephemeral.service
        After=format-ephemeral.service
        Before=docker.service
        [Mount]
        What=/dev/xvdb
        Where=/var/lib/docker
        Type=btrfs
```

#### [Configuring flannel for Container Networking](https://coreos.com/docs/cluster-management/setup/flannel-config/)

With Docker, each container is assigned an IP address that can be used to communicate with other containers on the same host. For communicating over a network, containers are tied to the IP addresses of the host machines and must rely on port-mapping to reach the desired container. This makes it difficult for applications running inside containers to advertise their external IP and port as that information is not available to them.

flannel solves the problem by giving each container an IP that can be used for container-to-container communication.

It uses packet encapsulation to create a virtual overlay network that spans the whole cluster. More specifically, flannel gives each host an IP subnet (/24 by default) from which the Docker daemon is able to allocate IPs to the individual containers.

flannel uses etcd to store mappings between the virtual IP and host addresses. A flanneld daemon runs on each host and is responsible for watching information in etcd and routing the packets.

To reduce the CoreOS image size, flannel daemon is stored in CoreOS Enterprise Registry as a Docker container and not shipped in the CoreOS image.

## debugging clusters

#### [Working with btrfs and Common Troubleshooting](https://coreos.com/docs/cluster-management/debugging/btrfs-troubleshooting/)

btrfs is a copy-on-write filesystem with full support in the upstream Linux kernel, which is important since CoreOS frequently ships updated versions of the kernel. Docker has a storage driver for btrfs and it is set up on CoreOS out of the box.

Notable Features of [btrfs](https://btrfs.wiki.kernel.org/index.php/Balance_Filters):

Ability to add/remove block devices without interruption
Ability to balance the filesystem without interruption
RAID 0, RAID 1, RAID 5, RAID 6 and RAID 10
Snapshots and file cloning

btrfs stores data in chunks across all of the block devices on the system. The total storage across these devices is shown in the standard output of `df -h`.

Raw data and filesystem metadata are stored in one or many chunks, typically ~1GiB in size. When RAID is configured, these chunks are replicated instead of individual files.

A copy-on-write filesystem maintains many changes of a single file, which is helpful for snapshotting and other advanced features, but can lead to fragmentation with some workloads.

- No Space Left on Device (`df -h`)

When the filesystem is out of chunks to write data into, No space left on device will be reported. This will prevent journal files from being recorded, containers from starting and so on.

1. df -h

see free space. It isn't measuring the btrfs primitives (chunks, metadata, etc), which is what really matters.

2. sudo btrfs fi show

btrfs view of how much free space you have. When starting/stopping many docker containers or doing a large amount of random writes, chunks will become duplicated in an inefficient manner over time.

#### [Reading the System Log](https://coreos.com/docs/cluster-management/debugging/reading-the-system-log/)

```bash
journalctl # nterface into a single machine's `journal/logging`. read the entire journal
fleetctl journal # fetch the journal for containers started with fleet. All service files and docker containers insert data into the systemd journal
journalctl -u apache.service # Read Entries for a Specific Service
fleetctl --tunnel 10.10.10.10 journal apache.service # --tunnel flag can remotely read the journal for a specific unit started via fleet. it will figure out which machine the unit is currently running on, fetch the journal and output it
journalctl --boot  # Read Entries Since Boot
journalctl -f  # Tail the entire Journal
journalctl -u apache.service -f  # tail a specific service journal
```

## Scaling cluster

#### [Adding Disk Space](https://coreos.com/docs/cluster-management/scaling/adding-disk-space/)

On a CoreOS machine, the operating system itself is mounted as a read-only partition at `/usr`. The root partition provides read-write storage by default and on a fresh install is mostly blank. The default size of this partition depends on the platform but it is usually between 3GB and 16GB.

#### [Optimal etcd Cluster Size](https://coreos.com/docs/cluster-management/scaling/etcd-optimal-cluster-size/)

etcd's Raft consensus algorithm is most efficient in small clusters between 3 and 9 peers. For clusters larger than 9, etcd will select a subset of instances to participate in the algorithm in order to keep it efficient.

- Writing to etcd

Writes to an etcd peer are always redirected to the leader of the cluster and distributed to all of the peers immediately. A write is only considered successful when a majority of the peers acknowledge the write. For example, in a cluster with 5 peers, a write operation is only as fast as the 3rd fastest machine. This is the main reason for keeping the number of active peers below 9. I

- Leader Election

a majority of the active peers must acknowledge the new leader before cluster operations can continue.

- Odd Active Cluster Size

always have an odd active cluster size. During a network partition, an odd number of active peers also guarantees that there will almost always be a majority of the cluster that can continue to operate and be the source of truth when the partition ends.



Explain:

[Service]
EnvironmentFile=/etc/environment
ExecStart=/usr/bin/docker run --rm --name apache-%i -p ${COREOS_PRIVATE_IPV4}:%i:80 tutum/hello-world

Firstly, it pulls in `/etc/environment`. This is so we can use the COREOS_PRIVATE_IPV4 environment variable later on in this unit definition

[Service]
Type=oneshot
RemainAfterExit=yes

the unit a ‘oneshot’ unit, which tells systemd we expect ExecStart to run just once.
We don’t want systemd to keep retrying the ExecStart line. Secondly, RemainAfterExit=yes just allows the service appear successfully executed, which lets us hang some dependancies off it later.


## Scheduler base system

interact with schedule API. ex: server handle 5 requests/sec, we know 500 requests/sec, need 100 of same application services. Make sure 100 of application are running. Scheduler work as an active loop. What user tells me to do, current status of the system, what is my todo, list of machines, what is its capacity, ideally, 2 per host.

You => Scheduler API => Scheduler => Machines

Tell the environment to do what I want on my behave.

Kubernetes: a scheduler, automate rollout, how service discovery should be built, high level of tooling. provide permitive to run web scaled infrastructure.
Fleet: a scheduler, like systemd for lots of hosts.

Note: whenever sharing some files between two containers, we’re going to need a data volume.

`vagrant global-status --prune`   to get rid of cache entry that are showing, old or not used vagrant instances.

#### [Create and Run a Service on a CoreOS Cluster](https://www.digitalocean.com/community/tutorials/how-to-create-and-run-a-service-on-a-coreos-cluster)

1. setting up a containerized service environment with Docker
2. create a systemd-style unit file to describe the service and its operational parameters
3. Within a companion unit file, we will tell our service to register with etcd, which will allow other services to track its details.
4. We will submit both of our services to fleet, where we can start and manage the services on machines throughout our cluster.

- Connect to a Node and Pass your SSH Agent

The first thing we need to do to get started configuring services is connect to one of our nodes with SSH. In order for the `fleetctl` tool to work, which we will be using to communicate with neighboring nodes, we need to pass in our SSH agent information while connecting.

Before you connect through SSH, you must start your SSH agent. This will allow you to forward your credentials to the server you are connecting to, allowing you to log in from that machine to other nodes. To start the user agent on your machine, you should type:

`eval $(ssh-agent)`

You then can add your private key to the agent's in memory storage by typing:

`ssh-add`

At this point, your SSH agent should be running and it should know about your private SSH key. The next step is to connect to one of the nodes in your cluster and forward your SSH agent information. You can do this by using the -A flag:

`ssh -A core@coreos_node_public_IP`

- Creating a Service Unit File

create a unit file called `apache@.service`. The @ indicates that this is a template service file.
[Unit] section header and set up some metadata about this unit

```bash
[Unit]
Description=Apache web server service
After=etcd.service
After=docker.service
# add the other service file that we will be creating as a requirement
#  Requiring it here will force it into starting when this service is started.
Requires=apache-discovery@%i.service
```

[Service] section: tell the system what needs to happen when starting or stopping this unit.

The first thing we want to do is disable the service startup from timing out `TimeoutStartSec=0`. Because our services are Docker containers, the first time it is started on each host, the image will have to be pulled down from the Docker Hub servers, potentially causing a longer-than-usual start up time on the first run

We want to set the KillMode to "none" `KillMode=none` so that systemd will allow our "stop" command to kill the Docker process. If we leave this out, systemd will think that the Docker process failed when we call our stop command.

The =- syntax for the first two ExecStartPre lines indicate that those preparation lines can fail and the unit file will still continue. Since those commands only succeed if a container with that name exists, they will fail if no container is found.

%i suffix at the end of the apache container names in the above directives. The service file we are creating is actually a template unit file. This means that upon running the file, fleet will automatically substitute some information with the appropriate values. Read the information at the provided link to find out more. In our case, the %i will be replaced anywhere it exists within the file with the portion of the service file's name to the right of the @ before the .service suffix. Our file is simply named apache@.service though.
Although we will submit the file to fleetctl with apache@.service, when we load the file, we will load it as apache@PORT_NUM.service, where "PORT_NUM" will be the port that we want to start this server on. We will be labelling our service based on the port it will be running on so that we can easily differentiate them.


[X-Fleet]. This section is specifically designed to give instructions to fleet as to how to schedule the service. Here, you can add restrictions so that your service must or must not run in certain arrangements in relation to other services or machine states.

```bash
[X-Fleet]
X-Conflicts=apache@*.service  # run only on hosts that are not already running an Apache web server. use a wildcard to catch any of the apache service files that we might have running
```

- Registering Service States with Etcd

In order to record the current state of the services started on the cluster, we will want to write some entries to etcd. This is known as registering with etcd.

In order to do this, we will start up a minimal companion service that can update etcd as to when the server is available for traffic. The new service file will be called `apache-discovery@.service`.


The BindsTo directive identifies a dependency that this service look to for state information. If the listed service is stopped, the unit we are writing now will stop as well. We will use this so that if our web server unit fails unexpectedly, this service will update etcd to reflect that information. This solves potential issue of having stale information in etcd which could be erroneously used by other services:

```bash
# apache-discovery@.service
[Unit]
Description=Announce Apache@%i service
# BindsTo directive identifies a dependency that this service look to for state information
BindsTo=apache@%i.service

[Service]
# source the environment file with the host's IP address information
EnvironmentFile=/etc/environment
# set an expiration time of 60 seconds on the value so that the key will be removed if the service somehow dies.
# We will then sleep 45 seconds. This will provide an overlap with the expiration so that we are always updating the TTL (time-to-live) value prior to it reaching its timeout.
ExecStart=/bin/sh -c "while true; do etcdctl set /announce/services/apache%i ${COREOS_PUBLIC_IPV4}:%i --ttl 60; sleep 45; done"
# stopping action, we will simply remove the key with the same etcdctl utility, marking the service as unavailable
ExecStop=/usr/bin/etcdctl rm /announce/services/apache%i

[X-Fleet]
# ensure that this service is started on the same host as the web server it is reporting on
X-MachineOf=apache@%i.service
```

Working with Unit Files and Fleet

```bash
fleetctl start apache@80.service apache-discovery@80.service
etcdctl get /announce/services/apache80  #  have registered the public IP address and the port number with etcd. query its value
```
