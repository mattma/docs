CoreOS aggregates individual machines into a single pool of resources. Instead of running a service on a specific machine, services are submitted to the cluster and the cluster manager(fleet) decides where they should run. Fleet allows you to gracefully update CoreOS across your cluster, handles machine failures automatically and allows for efficient resource utilization.

## Configuring fleet

#### [Deploying fleet](https://coreos.com/docs/launching-containers/config/fleet-deployment-and-configuration/)

Deploying fleet on CoreOS, is to drop the `fleetd` binary on a machine with access to etcd and starting it, simply run `systemctl start fleet`. The built-in configuration assumes each of your hosts is serving an etcd endpoint at the default location (http://127.0.0.1:4001).

- etcd

Each `fleetd` daemon must be configured to talk to the same etcd cluster. By default, the `fleetd` daemon will connect to http://127.0.0.1:4001

- systemd

`fleetd` daemon communicates with systemd (v207+) running locally on a given machine. It requires D-Bus (v1.6.12+) to do this.

- SSH Keys

`fleetctl` client tool uses SSH to interact with a fleet cluster. This means each client's public SSH key must be authorized to access each fleet machine.

Authorizing a public SSH key is to append it to the user's ~/.ssh/authorized_keys file. This may not be true on your systemd, though. If running CoreOS, use the built-in update-ssh-keys utility - it helps manage multiple authorized keys.

- API

fleet's API is served using systemd socket activation. At service startup, systemd passes fleet a set of file descriptors, preventing fleet from having to care on which interfaces it's serving the API. CoreOS ships a socket unit for fleet (fleet.socket) which binds to a Unix domain socket, /var/run/fleet.sock. To serve the fleet API over a network address, simply extend or replace this socket unit.

- Configuration

The fleetd daemon uses two sources for configuration parameters:

an INI-formatted config file (sample)
environment variables

fleet will look at /etc/fleet/fleet.conf for this config file by default. The --config flag may be passed to the fleetd binary to use a custom config file location. To use an environment variable, simply prefix the name of a given option with 'FLEET_', while uppercasing the rest of the name.

1. verbosity

Default: 0. Enable debug logging by setting this to an integer value greater than zero. Only a single debug level exists, so all values greater than zero are considered equivalent.

2. etcd_servers

Default: ["http://127.0.0.1:4001"]. Provide a custom set of etcd endpoints.

3. etcd_request_timeout

Default: 1.0. Amount of time in seconds to allow a single etcd request before considering it failed.

4. etcd_cafile, etcd_keyfile, etcd_certfile

Default: "". Provide TLS configuration when SSL certificate authentication is enabled in etcd endpoints

5. public_ip

Default: "". IP address that should be published with the local Machine's state and any socket information. If not set, fleetd will attempt to detect the IP it should publish based on the machine's IP routing information.

6. metadata

Default: "". Comma-delimited key/value pairs that are published with the local to the fleet registry. This data can be used directly by a client of fleet to make scheduling decisions. An example set of metadata could look like: `metadata="region=us-west,az=us-west-1"`

7. agent_ttl

Default: "30s". An Agent will be considered dead if it exceeds this amount of time to communicate with the Registry. The agent will attempt a heartbeat at half of this value.

8. engine_reconcile_interval

Default: 2. Interval at which the engine should reconcile the cluster schedule in etcd.

## Launching Containers

#### [Launching Containers with fleet](https://coreos.com/docs/launching-containers/launching/launching-containers-fleet/)

fleet is a cluster manager that controls systemd at the cluster level. Two types of units can be run in your cluster — standard and global units.

Standard units are long-running processes that are scheduled onto a single machine. If that machine goes offline, the unit will be migrated onto a new machine and started.

Global units will be run on all machines in the cluster. These are ideal for common services like monitoring agents or components of higher-level orchestration systems like Kubernetes, Mesos or OpenStack.

`fleetctl list-unit-files` shows the units that fleet knows about and whether or not they are global
`fleetctl list-units`  shows the current state of units actively loaded into machines in the cluster

- Run a Container in the Cluster

Run a single container, just provide a regular unit file without an [Install] section. `fleetctl start myapp.service` or `fleetctl start units/subgun-{http,presence}.{1,2,3}.service` will launch 6 services

```bash
# myapp.service
[Unit]
Description=MyApp
After=docker.service
Requires=docker.service

[Service]
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker kill busybox1
ExecStartPre=-/usr/bin/docker rm busybox1
ExecStartPre=/usr/bin/docker pull busybox
ExecStart=/usr/bin/docker run --name busybox1 busybox /bin/sh -c "while true; do echo Hello World; sleep 1; done"
ExecStop=/usr/bin/docker stop busybox1
```

Note: detached mode (-d). Detached mode won't start the container as a child of the unit's pid. This will cause the unit to run for just a few seconds and then exit.

- Run a High Availability Service

Ex: deploying a service that consists of two identical containers running the Apache web server. template to launch two instances, name apache@1.service and apache@2.service

Conflicts attribute tells fleet that these two services can't be run on the same machine, giving us high availability, ensure running on two different machines in our cluster.

```bash
# apache@1.service  and   apache@2.service
[Unit]
Description=My Apache Frontend
After=docker.service
Requires=docker.service

[Service]
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker kill apache1
ExecStartPre=-/usr/bin/docker rm apache1
ExecStartPre=/usr/bin/docker pull coreos/apache
ExecStart=/usr/bin/docker run -rm --name apache1 -p 80:80 coreos/apache /usr/sbin/apache2ctl -D FOREGROUND
ExecStop=/usr/bin/docker stop apache1

[X-Fleet]
Conflicts=apache@*.service
```

How do we route requests to these containers? The best strategy is to run a "sidekick" container that performs other duties that are related to our main container but shouldn't be directly built into that application. Examples of common sidekick containers are for service discovery and controlling external services such as cloud load balancers or DNS.

- run a simple sidekick

service discovery. This unit blindly announces that our container has been started. We'll run one of these for each Apache unit that's already running. Again, we'll use a template unit with two instances.

```bash
# apache-discovery@.service
[Unit]
Description=Announce Apache1
BindsTo=apache@%i.service  # link the unit to our apache@%i.service unit.
After=apache@%i.service

[Service]
ExecStart=/bin/sh -c "while true; do etcdctl set /services/website/apache@%i '{ \"host\": \"%H\", \"port\": 80, \"version\": \"52c7248a14\" }' --ttl 60;sleep 45;done"  # --ttl 60, remove the unit from the directory if our machine suddenly died for some reason
# When the Apache unit is stopped, this unit will stop as well, causing it to be removed from our /services/website directory in etcd.
ExecStop=/usr/bin/etcdctl rm /services/website/apache@%i

[X-Fleet]
# fleet-specific property: MachineOf.
# causes the unit to be placed onto the same machine that the corresponding apache service is running on
# (e.g., apache-discovery@1.service will be scheduled on the same machine as apache@1.service).
MachineOf=apache@%i.service
```

can verify that the service discovery is working correctly by `etcdctl ls /services/ --recursive`

- run a global unit

running a unit across all of the machines in your cluster. It doesn't differ very much from a regular unit other than a new `X-Fleet` parameter called `Global=true`.

```bash
[Unit]
Description=Monitoring Service

[Service]
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker kill dd-agent
ExecStartPre=-/usr/bin/docker rm dd-agent
ExecStartPre=/usr/bin/docker pull datadog/docker-dd-agent
ExecStart=/usr/bin/bash -c \
"/usr/bin/docker run --privileged --name dd-agent -h `hostname` \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /proc/mounts:/host/proc/mounts:ro \
-v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
-e API_KEY=`etcdctl get /ddapikey` \
datadog/docker-dd-agent"

[X-Fleet]
Global=true
```

- Schedule Based on Machine Metadata

Applications with complex and specific requirements can target a subset of the cluster for scheduling via machine metadata. Powerful deployment topologies can be achieved — schedule units based on the machine's region, rack location, disk speed or anything else you can think of.

1. Metadata can be provided via cloud-config or a config file. Here's an example config file:

```bash
# Comma-delimited key/value pairs that are published to the fleet registry.
# This data can be referenced in unit files to affect scheduling decisions.
# An example could look like: metadata="region=us-west,az=us-west-1"
metadata="platform=metal,provider=rackspace,region=east,disk=ssd"
# Metadata can be viewed in the machine list when configured
fleetctl list-machines
```

2.

```bash
[X-Fleet]
Conflicts=webapp*
MachineMetadata=provider=amazon
MachineMetadata=platform=cloud
MachineMetadata=region=east
```

#### [fleetctl client](https://coreos.com/docs/launching-containers/launching/fleet-using-the-client/)

```bash
fleetctl cat hello.service # The contents of a loaded unit file
fleetctl status hello.service  # Once a unit has been started, fleet will publish its status.  passes back the systemctl status result for the service on the host that is running the unit.
fleetctl journal hello.service  # Fetch unit logs, interact directly with journalctl on the machine running a given unit. see the journal entry for the service that is available on the associated machine
fleetctl journal --lines 20 hello.service  # by default, show last 10 lines, --line show more lines.
fleetctl journal -f hello.service  # -f, stands for "follow", like `tail -f` it will continue to pass back the latest log entries
fleetctl list-machines  #  Describe all of the machines currently connected to the cluster using the same cloud-config file. It is written to a file at `/etc/machine-id`.

fleetctl list-unit-files  # list all units (current state and scheduled) in the fleet cluster
fleetctl list-units  # List the last-known state of fleet's active units. show any running or scheduled units and their statuses.  It is collected directly from the local daemon,
fleetctl start goodbye.service  # Start units
fleetctl stop goodbye.service   # Stop units
fleetctl load hello.service  # To schedule a unit into the cluster (i.e. load it on a machine) without starting it, loaded unit will be in an inactive state
fleetctl unload hello.service  # unscheduled, but remain in the cluster. still be visible in fleetctl list-unit-files, but will have no state reported in fleetctl list-units

fleetctl submit examples/hello.service  # add units into the cluster.  cause fleet to read the file contents into memory, making it available for further actions.
fleetctl submit examples/*  # ls examples/   // hello.service   ping.service    pong.service
fleetctl destroy hello.service  # removed from a cluster. 1. Instruct systemd on the host machine to stop the unit, deferring to systemd completely for any custom stop directives (i.e. ExecStop option in the unit file). 2. Remove the unit file from the cluster, making it impossible to start again until it has been re-submitted.


fleetctl ssh hello.service  # or simply `hello`, just the service name. connect to the machine to-which the given unit is scheduled
fleetctl ssh 113f16a7  # open a pseudo-terminal over SSH to a host in the fleet cluster by Machine ID
fleetctl ssh nginx cat /etc/environment #  run a single command on a remote host (with the normal ssh executable)
```

Note: The submit command is idempotent, meaning that fleet will not update the in-memory unit file if you re-submit it. If you need to update your unit file, you must remove it completely and then re-submit it.

- Known-Hosts Verification

Fingerprints of machines accessed through fleetctl are stored in $HOME/.fleetctl/known_hosts and used for the verification of machine identity. If a machine presents a fingerprint that differs from that found in the known_hosts file, the SSH connection will be aborted.

Disable the storage of fingerprints with --strict-host-key-checking=false, or change the location of your fingerprints with the --known-hosts-file=<LOCATION> flag.

- Remote fleet Access

fleet does not yet have any custom authentication, so security of a given fleet cluster depends on a user's ability to access any host in that cluster. Using SSH public keys. This requires two things: 1. SSH access for a user to at least one host in the cluster. 2. ssh-agent running on a user's machine with the necessary identity

Assuming you have the tools installed, simply ensure ssh-agent has the necessary identity: by `ssh-add -l`
`FLEETCTL_TUNNEL=192.0.2.14:2222 fleetctl list-units`

#### [Getting Started with systemd](https://coreos.com/docs/launching-containers/launching/getting-started-with-systemd/)

use systemd to manage the lifecycle of your Docker containers. systemd consists of two main concepts: a unit and a target. A unit is a configuration file that describes the properties of the process that you'd like to run. A target is a grouping mechanism that allows systemd to start up groups of processes at the same time.

#### [Overview of systemctl](https://coreos.com/docs/launching-containers/launching/overview-of-systemctl/)

systemctl is your interface to systemd, the init system used in CoreOS.

```bash
sudo systemctl status custom-registry.service  #  If you have multiple Exec commands in your service file, see which one of them is failing and view the exit code
sudo systemctl list-units | grep .service  # List Status of All Units, pipe the output into grep to find the services, Here's all service files and their status
sudo systemctl start apache.service  # Start a Service
sudo systemctl stop apache.service  # Stop a Service
sudo systemctl kill apache.service  # Kill a Service, stop the process immediately
sudo systemctl restart apache.service  # Restart a Service
sudo systemctl daemon-reload  # If you're restarting a service after you changed its service file, you will need to reload all of the service files before your changes take effect
```

#### [Unit Files](https://coreos.com/docs/launching-containers/launching/fleet-unit-files/)

They define what you want to do, and how fleet should do it. fleet will schedule any valid service, socket, path or timer systemd unit to a machine in the cluster, taking into account a few special properties in the [X-Fleet] section.

- Unit Requirements

The unit name must be of the form `string.suffix` or `string@instance.suffix`

string,  match regexp `[a-zA-Z0-9:_.@-]+`, can not be an empty string
instance,  match regexp `[a-zA-Z0-9:_.@-]+`, can be an empty string
suffix,  must be one of unit types: service, socket, device, mount, automount, timer, path

Each of Unit File types are identified by the type being used as a file suffix, like example.service:

1. service

the most common type of unit file. define a service or application that can be run on one of the machines in the cluster.

2. socket

Defines details about a socket or socket-like files. These include network sockets, IPC sockets, and FIFO buffers. These are used to call services to start when traffic is seen on the file.

3. device

Defines information about a device available in the udev device tree. Systemd will create these as needed on individual hosts for kernel devices based on udev rules. These are usually used for ordering issues to make sure devices are available before attempting to mount.

4. mount

Defines information about a mount point for a device. These are named after the mount points they reference, with slashes replaced by dashes.

5. automount

Defines an automount point. They follow the same naming convention as mount units and must be accompanied by the associated mount unit. These are used to describe on demand and parallelized mounting.

6. timer

Defines a timer associated with another unit. When the point in time defined in this file is reached, the associated unit is started.

7. path

Defines a path that can be monitored for path-based activation. This can be used to start another unit when changes are made to a certain path.


The section headers and everything else in a unit file is case-sensitive.

[Unit]: define generic information about a unit. Options that are common for all unit-types are generally placed here.

[Service]: set directives that are specific to service units. Most (but not all) of the unit-types above have associated sections for unit-type-specific information. Check out the generic systemd unit file man page for links to the different unit types to see more information.

[X-Fleet]: set scheduling requirements for the unit for use with fleet. Using this section, you can require that certain conditions be true in order for a unit to be scheduled on a host.


We have used hard requirements for this example below. If we wanted `fleet` to attempt to start additional services, but not stop on a failure, we could have used the `Wants` directive instead.

For the [Service] section, we turn off the service startup timeout. The first time a service is run on a host, the container will have to be pulled down from the Docker registry, which counts towards the startup timeout. This is defaulted to 90 seconds, which will typically enough time, but with more complex containers, it can take longer.

We then set the killmode to none. This is used because the normal kill mode (control-group) will sometimes cause container removal commands to fail (especially when attempted by Docker's --rm option). This can cause issues on next restart.

We pull in the environment file so that we have access to the COREOS_PUBLIC_IPV4 and, if private networking was enabled during creation, the COREOS_PRIVATE_IPV4 environmental variables. These are very useful for configuring Docker containers to use their specific host's information.

```bash
# describe the unit and lay down the dependency information
[Unit]
Description=Apache web server service

# Requirements
Requires=etcd.service
Requires=docker.service
Requires=apache-discovery.1.service

# Dependency ordering
After=etcd.service
After=docker.service
Before=apache-discovery.1.service

[Service]
# Let processes take awhile to start up (for first run Docker containers)
TimeoutStartSec=0

# Change killmode from "control-group" to "none" to let Docker remove
# work correctly.
KillMode=none

# Get CoreOS environmental variables
EnvironmentFile=/etc/environment

# Pre-start and Start
## Directives with "=-" are allowed to fail without consequence
ExecStartPre=-/usr/bin/docker kill apache
ExecStartPre=-/usr/bin/docker rm apache
ExecStartPre=/usr/bin/docker pull username/apache
ExecStart=/usr/bin/docker run --name apache -p ${COREOS_PUBLIC_IPV4}:80:80 \
username/apache /usr/sbin/apache2ctl -D FOREGROUND

# Stop
ExecStop=/usr/bin/docker stop apache

[X-Fleet]
# Don't schedule on the same machine as other Apache instances
X-Conflicts=apache.*.service
```

- fleet-specific Options

OPTION           NAME DESCRIPTION
MachineID      Require the unit be scheduled to the machine identified by the given string.
MachineOf      Limit eligible machines to the one that hosts a specific unit.
MachineMetadata    Limit eligible machines to those with this specific metadata.
Conflicts         Prevent a unit from being collocated with other units using glob-matching on the other unit names.
Global            Schedule this unit on all agents in the cluster. A unit is considered invalid if options other than MachineMetadata are provided alongside Global=true.

```bash
[Unit]
Description=Some Monitoring Service
[Service]
ExecStart=/bin/monitorme
[X-Fleet]
MachineMetadata=location=chicago
Conflicts=monitor*
```

- Template unit files

fleet provides support for using systemd's instances feature to dynamically create instance units from a common template unit file. This allows you to have a single unit configuration and easily and dynamically create new instances of the unit as necessary.

Format: `<name>@.<suffix> format`    ex: hello@.service

submit it to fleet. then instantiate units by creating new units that match the instance pattern `<name>@<instance>.<suffix>`.
ex: `fleetctl start hello@world.service`, `fleetctl start hello@8080.service`. and fleet will automatically utilize the relevant template unit

- systemd specifiers

SPECIFIER   DESCRIPTION
%n  Full unit name
%N  Unescaped full unit name
%p  Unescaped prefix name
%i  Instance name

- Unit Scheduling

two types of units: non-global (the default) and global. (A global unit is one with Global=true in its X-Fleet section

Non-global units are scheduled by the fleet engine - the engine is responsible for deciding where they should be placed in the cluster.

Global units can run on every possible machine in the fleet cluster. While global units are not scheduled through the engine, fleet agents still check the MachineMetadata option before starting them. Other options are ignored.

- Schedule unit to specific machine

The `MachineID` option of a unit file causes the system to schedule a unit to a machine identified by the option's value.

The ID of each machine is currently published in the MACHINE column in the output of `fleetctl list-machines -l`. One must use the entire ID when setting MachineID - the shortened ID returned by fleetctl list-machines without the -l flag is not acceptable.

- Schedule unit to machine with specific metadata

The MachineMetadata option of a unit file allows you to set conditional metadata required for a machine to be elegible. A machine is not automatically configured with metadata. A deployer may define machine metadata using the metadata config option.

```bash
[X-Fleet]
MachineMetadata="region=us-east-1" "diskType=SSD"
```

This requires an eligible machine to have at least the region and diskType keys set accordingly.
A single key may also be defined multiple times, in which case only one of the conditions needs to be met:

```bash
[X-Fleet]
# allow a machine to match just one of the provided values to be considered eligible to run.
MachineMetadata=region=us-east-1
MachineMetadata=region=us-west-1
```

- Schedule unit next to another unit `MachineOf`

In order for a unit to be scheduled to the same machine as another unit, a unit file can define MachineOf. The value of this option is the exact name of another unit in the system, which we'll call the target unit.

If the target unit is not found in the system, the follower unit will be considered unschedulable. Once the target unit is scheduled somewhere, the follower unit will be scheduled there as well.

Follower units will reschedule themselves around the cluster to ensure their MachineOf options are always fulfilled.

Note that currently MachineOf cannot be a bidirectional dependency: i.e., if unit foo.service has MachineOf=bar.service, then bar.service must not have a MachineOf=foo.service, or fleet will be unable to schedule the units.

- Schedule unit away from other unit(s)  `Conflicts`

The value of the Conflicts option is a glob pattern defining which other units next to which a given unit must not be scheduled. A unit may have multiple Conflicts options.

If a unit is scheduled to the system without an Conflicts option, other units' conflicts still take effect and prevent the new unit from being scheduled to machines where conflicts exist.

- Dynamic requirements

fleet supports several systemd specifiers to allow requirements to be dynamically determined based on a Unit's name. This means that the same unit can be used for multiple Units and the requirements are dynamically substituted when the Unit is scheduled.

For example, a Unit by the name foo.service, whose unit contains the following snippet:

```bash
[X-Fleet]
MachineOf=%p.socket
```

would result in an effective MachineOf of foo.socket. Using the same unit snippet with a Unit called bar.service, on the other hand, would result in an effective MachineOf of bar.socket.

- Some behavior to keep in mind when building a main service

1. Separate logic for dependencies and ordering

Lay out your dependencies with `Requires=` or `Wants=` directives dependent on whether the unit you are building should fail if the dependency cannot be fulfilled. Separate out the ordering with separate `After=` and `Before=` lines so that you can easily adjust if the requirements change. Separating the dependency list from ordering can help you debug in case of dependency issues.

2. Handle service registration with a separate process

Your service should be registered with etcd to take advantage of service discovery and the dynamic configuration features that this allows. However, this should be handled by a separate "sidekick" container to keep the logic separate. This will allow you to more accurately report on the service's health as seen from an outside perspective, which is what other components will need.

3. Be aware of the possibility of your service timing out

Consider adjusting the TimeoutStartSec directive in order to allow for longer start times. Setting this to "0" will disable a startup timeout. This is often necessary because there are times when Docker has to pull an image (on first-run or when updates are found), which can add significant time to initializing the service.

4. Adjust the KillMode if your service does not stop cleanly

Be aware of the KillMode option if your services or containers seem to be stopping uncleanly. Setting this to "none" can sometimes resolve issues with your containers not being removed after stopping. This is especially important when you name your containers since Docker will fail if a container with the same name has been left behind from a previous run. Check out the documentation on KillMode for more information

5. Clean up the environment before starting up

Related to the above item, make sure to clean up previous Docker containers at each start. You should not assume that the previous run of the service exited as expected. These cleanup lines should use the =- specifier to allow them to fail silently if no cleanup is needed. While you should stop containers with docker stop normally, you should probably use docker kill during cleanup.

6. Pull in and use host-specific information for service portability

If you need to bind your service to a specific network interface, pull in the `/etc/environment` file to get access to `COREOS_PUBLIC_IPV4` and, if configured, `COREOS_PRIVATE_IPV4`. If you need to know the hostname of the machine running your service, use the `%H` systemd specifier. To learn more about possible specifiers, check out the systemd specifiers docs. In the [X-Fleet] section, only the `%n`, `%N`,` %i`, and `%p` specifiers will work.

## Building Containers

Docker makes creating and managing Linux containers really easy. Containers are like extremely lightweight VMs – they allow code to run in isolation from other containers but safely share the machine’s resources, all without the overhead of a hypervisor.

Do not run containers with detached mode inside of systemd unit files. Detached mode prevents your init system, in our case systemd, from monitoring the process that owns the container because detached mode forks it into the background. To prevent this issue, just omit the -d flag if you aren't running something manually.

- Run Apache in Foreground

`docker run -d  -p 80:80 coreos/apache /usr/sbin/apache2ctl -D FOREGROUND`

#### [Customizing docker](https://coreos.com/docs/launching-containers/building/customizing-docker/)

- Enable the Remote API on a New Socket

Create a file called /etc/systemd/system/docker-tcp.socket to make docker available on a TCP socket on port 2375.

```
[Unit]
Description=Docker Socket for the API

[Socket]
ListenStream=2375
BindIPv6Only=both
Service=docker.service

[Install]
WantedBy=sockets.target
```

Then enable this new socket.

```bash
systemctl enable docker-tcp.socket
systemctl stop docker
systemctl start docker-tcp.socket
systemctl start docker
```

Test that it's working `docker -H tcp://127.0.0.1:2375 ps`

- Enabling the docker Debug Flag

```bash
#cloud-config
coreos:
  units:
    - name: docker.service
      command: restart
      content: |
        [Unit]
        Description=Docker Application Container Engine
        Documentation=http://docs.docker.io
        After=network.target
        [Service]
        ExecStartPre=/bin/mount --make-rprivate /
        # Run docker but don't have docker automatically restart
        # containers. This is a job for systemd and unit files.
        ExecStart=/usr/bin/docker -d -s=btrfs -r=false -H fd:// -D

        [Install]
        WantedBy=multi-user.target
```

- Use an HTTP Proxy

specify an HTTP proxy for docker to use via an environment variable. First, create a directory for drop-in configuration for docker

```bash
#cloud-config
write_files:
    - path: /etc/systemd/system/docker.service.d/http-proxy.conf
      owner: core:core
      permissions: 0644
      content: |
        [Service]
        Environment="HTTP_PROXY=http://proxy.example.com:8080"

coreos:
  units:
    - name: docker.service
      command: restart
```

- Create Flexible Services for a CoreOS Cluster with Fleet Unit Files

etcd is involved in linking up the separate nodes and providing an area for global data, most of the actual service management and administration tasks involve working with the fleet daemon.

Because the service management aspect of fleet relies mainly on each local system's systemd init system, systemd unit files are used to define services.

- Building the Sidekick Announce Service

a conventional "sidekick" service. These sidekick services are associated with a main service and are used as an external point to register services with etcd.

BindsTo= directive. This directive causes this unit to follow the start, stop, and restart commands sent to the listed unit. Basically, this means that we can manage both of these units by manipulating the main unit once both are loaded into fleet. This is a one-way mechanism, so controlling the sidekick will not affect the main unit.

```bash
# apache-discovery.1.service
[Unit]
Description=Apache web server etcd registration

# Requirements
Requires=etcd.service
Requires=apache.1.service

# Dependency ordering and binding
After=etcd.service
After=apache.1.service
# BindsTo directive identifies a dependency that this service look to for state information
BindsTo=apache.1.service

[Service]

# Get CoreOS environmental variables
EnvironmentFile=/etc/environment

# Start
## Test whether service is accessible and then register useful information
#
#  The key is set to expire in 30 seconds so if this unit goes down unexpectedly, stale service information won't be left in etcd. If the connection fails, the key is removed immediately since the service cannot be verified to be available.
#  This loop includes a 20 second sleep command. This means that every 20 seconds (before the 30 second etcd key timeout), this unit re-checks whether the main unit is available and resets the key. This basically refreshes the TTL on the key so that it will be considered valid for another 30 seconds.
ExecStart=/bin/bash -c '\
  while true; do \
    curl -f ${COREOS_PUBLIC_IPV4}:80; \
    if [ $? -eq 0 ]; then \
      etcdctl set /services/apache/${COREOS_PUBLIC_IPV4} \'{"host": "%H", "ipv4_addr": ${COREOS_PUBLIC_IPV4}, "port": 80}\' --ttl 30; \
    else \
      etcdctl rm /services/apache/${COREOS_PUBLIC_IPV4}; \
    fi; \
    sleep 20; \
  done'

# Stop
# The stop command in this case just results in a manual removal of the key. This will cause the service registration to be removed when the main unit's stop command is mirrored to this unit due to the BindsTo= directive.
ExecStop=/usr/bin/etcdctl rm /services/apache/${COREOS_PUBLIC_IPV4}

[X-Fleet]
# Schedule on the same machine as the associated Apache service
# While this does not allow the unit to report on the availability of the service to remote machines, it is important for the BindsTo= directive to function correctly.
X-ConditionMachineOf=apache.1.service
```

* Basic Take-Aways For Building Sidekick Services

1. Check the actual availability of the main unit

It is important to actually check the state of main unit. Do not assume that the main unit is available just because the sidekick has been initialized. This is dependent on what the main unit's design and functionality is, but the more robust your check, the more credible your registration state will be. The check can be anything that makes sense for the unit, from checking a /health endpoint to attempting to connect to a database with a client.

2. Loop the registration logic to re-check regularly

Checking the availability of the service at start is important, but it is also essential that you recheck at regular intervals. This can catch instances of unexpected service failures, especially if they somehow result in the container not stopping. The pause between cycles will have to be tweaked according to your needs by weighing the importance of quick discovery against the additional load on your main unit.

3. Use the TTL flag when registering with etcd for automatic de-registration on failures

Unexpected failures of the sidekick unit can result in stale discovery information in etcd. To avoid conflicts between the registered and actual state of your services, you should let your keys time out. With the looping construct above, you can refresh each key before the timeout interval to make sure that the key never actually expires while the sidekick is running. The sleep interval in your loop should be set to slightly less than your timeout interval to ensure this functions correctly.

4. Register useful information with etcd, not just a confirmation

During your first iteration of a sidekick, you may only be interested in accurately registering with etcd when the unit is started. However, this is a missed opportunity to provide plenty of useful information for other services to utilize. While you may not need this information now, it will become more useful as you build other components with the ability to read values from etcd for their own configurations. The etcd service is a global key-value store, so don't forget to leverage this by providing key information. Storing details in JSON objects is a good way to pass multiple pieces of information.

#### Fleet-Specific Considerations

While fleet unit files are for the most part no different from conventional systemd unit files, there are some additional capabilities and pitfalls.

[X-Fleet]

* X-ConditionMachineID: This can be used to specify an exact machine to load the unit. The provided value is a complete machine ID. This value can be retrieved from an individual member of the cluster by examining the /etc/machine-id file, or through fleetctl by issuing the list-machines -l command. The entire ID string is required. This may be needed if you are running a database with the data directory kept on a specific machine. Unless you have a specific reason to use this, try to avoid it because it decreases the flexibility of the unit.

* X-ConditionMachineOf: This directive can be used to schedule this unit on the same machine that is loaded with the specified unit. This is helpful for sidekick units or for lumping associated units together.

* X-Conflicts: This is the opposite of the above declaration, in that it specifies unit files which this unit cannot be scheduled alongside. This is useful for easily configuring high availability by starting multiple versions of the same service, each on a different machine.

* X-ConditionMachineMetadata: This is used to specify scheduling requirements based on the metadata of the machines available. In the "METADATA" column of the fleetctl list-machines output, you can see the metadata that has been set for each host. To set metadata, pass it in your cloud-config file when initializing the server instance.

* Global: This is a special directive that takes a boolean argument indicating whether this should be scheduled on all machines in the cluster. Only the metadata conditional can be used alongside this directive.

These additional directives give an administrator greater flexibility and power in defining how services should be run on the machines available. The `fleetctl` utility does not evaluate dependency requirements outside of the [X-Fleet] section of the unit file.

Problem:  the dependencies of the unit. if you have both your main and sidekick unit submitted, but not loaded, in fleet, typing fleetctl start main.service will load and then attempt to start the main.service unit. However, since the sidekick.service unit is not yet loaded, and because fleetctl will not evaluate the dependency information to bring the dependency units through the loading and starting process, the main.service unit will fail. This is because once the machine's systemd instance processes the main.service unit, it will not be able to find the sidekick.service when it evaluates the dependencies. The sidekick.service unit was never loaded on the machine.

To avoid this situation when dealing with companion units, you can start the services manually at the same time, not relying on the `BindsTo=` directive bringing the sidekick into a running state:

`fleetctl start main.service sidekick.service`

Another option is to ensure that the sidekick unit is at least loaded when the main unit is run. The loading stage is where a machine is selected and the unit file is submitted to local `systemd` instance. This will ensure that dependencies are satisfied and that the `BindsTo=` directive will be able to execute correctly to bring up the second unit:

```bash
fleetctl load main.service sidekick.service
fleetctl start main.service
```

#### unit templates

Unit templates rely on a feature of systemd called "instances". These are instantiated units that are created at runtime by processing a template unit file.

1. Template files can be identified by the @ in their filename `unit@.service`

```bash
# When a unit is instantiated from a template, its instance identifier is placed between the @ and the .service suffix. This identifier is a unique string selected by the administrator:
unit@instance_id.service  # %p: unit;  %i: instance_id
```

2. Instantiating Units from Templates

- Option 1

Both fleet and systemd can handle symbolic links, which gives us the option of creating links with the full instance IDs to the template files, like this:

```bash
ln -s apache@.service apache@8888.service
ln -s apache-discovery@.service apache-discovery@8888.service
fleetctl start apache@8888.service apache-discovery@8888.service
```

This will create two links, called apache@8888.service and apache-discovery@8888.service. Each of these have all of the information needed for fleet and systemd to run these units now. However, they are pointed back to the templates so that we can make any changes needed in a single place.

- Option 2

submit the templates themselves into fleetctl, You can instantiate units from these templates right from within fleetctl by just assigning instance identifiers at runtime. For instance, you could get the same service running by typing:

```bash
fleetctl submit apache@.service apache-discovery@.service
fleetctl start apache@8888.service apache-discovery@8888.service
```

This eliminates the need for symbolic links. Some administrators prefer the linking mechanism though since it means that you have the instance files available at any time. It also allows you to pass in a directory to fleetctl so that everything is started at once.

#### directory

For instance, in your working directory, you may have a subdirectory called templates for your template files and a subdirectory called instances for the instantiated linked versions. You could even have one called static for non-templated units. You could do this like so:

`mkdir templates instances static`

```bash
cd instances
ln -s ../templates/apache@.service apache@5555.service
ln -s ../templates/apache@.service apache@6666.service
ln -s ../templates/apache@.service apache@7777.service
ln -s ../templates/apache-discovery@.service apache-discovery@5555.service
ln -s ../templates/apache-discovery@.service apache-discovery@6666.service
ln -s ../templates/apache-discovery@.service apache-discovery@7777.service

# start all of your instances at once
cd ..
fleetctl start instances/*
```

in conclusion, By taking advantage of some of the dynamic features available within unit files, you can make sure your services are evenly distributed, close to their dependencies, and registering useful information with etcd.
