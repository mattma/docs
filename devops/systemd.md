### PID 1

On every Unix system there is one process with the special process identifier 1. It is started by the kernel before all other processes and is the parent process for all those other processes that have nobody else to be child of. Due to that it can do a lot of stuff that other processes cannot do. And it is also responsible for some things that other processes are not responsible for, such as bringing up and maintaining userspace during boot. the central responsibility of an init system is to bring up userspace.

For a fast and efficient boot-up two things are crucial: To start less. And to start more in parallel. Keeping the First User PID Small

Another thing we can learn from the MacOS boot-up logic is that shell scripts are evil. Shell is fast and shell is slow. It is fast to hack, but slow in execution. So, let's get rid of shell scripts in the boot process!

In Bash, `echo $$` will output the PID of current process.

the kernel knows Control Groups (aka "cgroups"). Basically they allow the creation of a hierarchy of groups of processes.  The hierarchy is directly exposed in a virtual file-system, and hence easily accessible. The group names are basically directory names in that file-system. If a process belonging to a specific cgroup fork()s, its child will become a member of the same group. Unless it is privileged and has access to the cgroup file system it cannot escape its group. Originally, cgroups have been introduced into the kernel for the purpose of containers: certain kernel subsystems can enforce limits on resources of certain groups, such as limiting CPU or memory usage. Traditional resource limits (as implemented by setrlimit()) are (mostly) per-process. cgroups on the other hand let you enforce limits on entire groups of processes. cgroups are also useful to enforce limits outside of the immediate container use case. You can use it for example to limit the total amount of memory or CPU Apache and all its children may use. Then, a misbehaving CGI script can no longer escape your setrlimit() resource control by simply forking away.

### [systemd](http://0pointer.de/blog/projects/systemd.html)

[systemd is an ideal init system](https://www.youtube.com/watch?v=Rm68XYskgH8&feature=youtu.be&t=34m7s) that provides many powerful features for starting, stopping and managing processes. It starts up and supervises the entire system. systemd acts as a drop in replacement for the traditional init system. It executes the traditional shell scripts and manages their execution. (binary: systemctl)

It’s growing all the time and now handles logging, device hotplugging events, networking, scheduled actions (like Cron) and much more.

Using `services` view, not `servers` or `processes`. systemd use cgroups to manage multi-tenant unix systems, instead of delegating to the hypervisor, it maximise reliability and efficiency.

Systemd configuration is stored in the `/etc/systemd` directory. Systemd primary task is to manage the boot process and provides informations about it.

Our beloved /etc/inittab is no more. Instead, we have a /etc/systemd/system/ directory chock-full of symlinks to files in /usr/lib/systemd/system/. /usr/lib/systemd/system/ contains init scripts; to start a service at boot it must be linked to /etc/systemd/system/. The systemctl command does this for you when you enable a new service.

There are three possible states for a service: enabled or disabled, and static. Enabled means it has a symlink in a .wants directory. Disabled means it does not. Static means the service is missing the [Install] section in its init script, so you cannot enable or disable it. Static services are usually dependencies of other services, and are controlled automatically.

```bash
$ systemctl list-unit-files --type=service
UNIT FILE              STATE
[...]
chronyd.service        enabled
clamd@.service         static
clamd@scan.service     disabled
```

#### Two main concepts: a unit and a target.

- a unit

It is based around the notion of units. Units have a name and a type. A unit is a configuration file that describes the properties of the process that you'd like to run. This is normally a docker run command or something similar. Since their configuration is usually loaded directly from the file system, these unit names are actually file names.

- a target

A target is a grouping mechanism that allows systemd to start up groups of processes at the same time. This happens at every boot as processes are started at different run levels.

Example: a unit avahi.service is read from a configuration file by the same name, and of course could be a unit encapsulating the Avahi daemon.

systemd can already be used as a drop-in replacement for `Upstart` and `sysvinit`.

There are several kinds of units:

- service: daemons that can be started, stopped, restarted, reloaded. For compatibility with SysV we not only support our own configuration files for services, but also are able to read classic SysV init scripts, in particular we parse the LSB header, if it exists. /etc/init.d is hence not much more than just another source of configuration.

- socket: this unit encapsulates a socket in the file-system or on the Internet. We currently support AF_INET, AF_INET6, AF_UNIX sockets of the types stream, datagram, and sequential packet. We also support classic FIFOs as transport. Each socket unit has a matching service unit, that is started if the first connection comes in on the socket or FIFO. Example: nscd.socket starts nscd.service on an incoming connection.

- device: this unit encapsulates a device in the Linux device tree. If a device is marked for this via udev rules, it will be exposed as a device unit in systemd. Properties set with udev can be used as configuration source to set dependencies for device units.

- mount: this unit encapsulates a mount point in the file system hierarchy. systemd monitors all mount points how they come and go, and can also be used to mount or unmount mount-points. /etc/fstab is used here as an additional configuration source for these mount points, similar to how SysV init scripts can be used as additional configuration source for service units.

- automount: this unit type encapsulates an automount point in the file system hierarchy. Each automount unit has a matching mount unit, which is started (i.e. mounted) as soon as the automount directory is accessed.

- target: this unit type is used for logical grouping of units: instead of actually doing anything by itself it simply references other units, which thereby can be controlled together. Examples for this are: multi-user.target, which is a target that basically plays the role of run-level 5 on classic SysV system, or bluetooth.target which is requested as soon as a bluetooth dongle becomes available and which simply pulls in bluetooth related services that otherwise would not need to be started: bluetoothd and obexd and suchlike.

- snapshot: similar to target units snapshots do not actually do anything themselves and their only purpose is to reference other units. Snapshots can be used to save/rollback the state of all services and units of the init system. Primarily it has two intended use cases: to allow the user to temporarily enter a specific state such as "Emergency Shell", terminating current services, and provide an easy way to return to the state before, pulling up all services again that got temporarily pulled down. And to ease support for system suspending: still many services cannot correctly deal with system suspend, and it is often a better idea to shut them down before suspend, and restore them afterwards.


All these units can have dependencies between each other (both positive and negative, i.e. 'Requires' and 'Conflicts'): a device can have a dependency on a service, meaning that as soon as a device becomes available a certain service is started. Mounts get an implicit dependency on the device they are mounted from. Mounts also gets implicit dependencies to mounts that are their prefixes (i.e. a mount /home/lennart implicitly gets a dependency added to the mount for /home) and so on.

A short list of other features:

- For each process that is spawned, you may control: the environment, resource limits, working and root directory, umask, OOM killer adjustment, nice level, IO class and priority, CPU policy and priority, CPU affinity, timer slack, user id, group id, supplementary group ids, readable/writable/inaccessible directories, shared/private/slave mount flags, capabilities/bounding set, secure bits, CPU scheduler reset of fork, private /tmp name-space, cgroup control for various subsystems. Also, you can easily connect stdin/stdout/stderr of services to syslog, /dev/kmsg, arbitrary TTYs. If connected to a TTY for input systemd will make sure a process gets exclusive access, optionally waiting or enforcing it.

- Every executed process gets its own cgroup (currently by default in the debug subsystem, since that subsystem is not otherwise used and does not much more than the most basic process grouping), and it is very easy to configure systemd to place services in cgroups that have been configured externally, for example via the libcgroups utilities.

- The native configuration files use a syntax that closely follows the well-known .desktop files. It is a simple syntax for which parsers exist already in many software frameworks. Also, this allows us to rely on existing tools for i18n for service descriptions, and similar. Administrators and developers don't need to learn a new syntax.

- As mentioned, we provide compatibility with SysV init scripts.

- systemd has a minimal transaction system. Meaning: if a unit is requested to start up or shut down we will add it and all its dependencies to a temporary transaction.

- We record start/exit time as well as the PID and exit status of every process we spawn and supervise.

#### systemctl

```bash
# Checking the Status of Services
# without parameters gives you a list of all known services and some extra info. systemd’s name for the stuff it manages is unit.
systemctl
```

- LOADED shows you whether the unit has been loaded correctly. This is a necessary condition for the unit being properly managed by systemd.

- ACTIVE shows you whether the unit is active. It does so in a generic terminology, which is the same for all units. In contrast SUB shows you a more specific piece of information: For example mounted for devices, running for a service like nginx.

```bash
# look at one specific service you issue:
systemctl status [name.service]

# Stopping, Starting, Restarting and Reloading Services
systemctl stop [name.service]
systemctl start [name.service]
systemctl restart [name.service]
systemctl reload [name.service]

# do nothing if the service is not started already. It will also not complain about this.
systemctl try-restart [name.service]

# Permanently Enabling or Disabling Services
systemctl enable [name.service]
systemctl disable [name.service]

systemctl is-active [name.service]
systemctl list-units --type service --all
```

- systemd has 12 unit types.

.service is system services, and when you're running any of the above commands you can leave off the .service extension, because systemd assumes a service unit if you don't specify something else. The other unit types are:

Target: group of units
Automount: filesystem auto-mountpoint
Device: kernel device names, which you can see in sysfs and udev
Mount: filesystem mountpoint
Path: file or directory
Scope: external processes not started by systemd
Slice: a management unit of processes
Snapshot: systemd saved state
Socket: IPC (inter-process communication) socket
Swap: swap file
Timer: systemd timer.

It is unlikely that you'll ever need to do anything to these other units, but it's good to know they exist and what they're for. You can look at them:

`systemctl list-units --type [unit name]`


- Understanding the Journal

The systemctl commands will not write it to standard output. systemd writes the output of init scripts and all status messages generated by systemd to something called journal, a log database and syslog replacement.

```bash
#  get the last relevant lines of output from the status command
systemctl status SERVICE_NAME
```

- You can still manually start or stop services even if they are enabled or disabled. It just means that they won’t start or stop at boot. If you actually want to make it impossible that the service is started you can mask it:

```bash
# This will link the unit to /dev/null, so it can’t be started.
systemctl mask SERVICE_NAME

# to unmask you unsurprisingly issue
systemctl unmask SERVICE_NAME
```

Note: Issuing `disable, enable; mask or unmask` will not start or stop the service. You need to do this separately.


### [Systemd in coreOS](https://coreos.com/docs/launching-containers/launching/getting-started-with-systemd/)

In coreOS, use systemd to manage the lifecycle of your Docker containers. systemd is the first process started on CoreOS and it reads different targets and starts the processes specified which allows the operating system to start. The target that you'll interact with is the `multi-user.target` which holds all of the general use unit files for our containers.

Each target is actually a collection of symlinks to our unit files. This is specified in the unit file by `WantedBy=multi-user.target`. Running `systemctl enable foo.service` creates symlinks to the unit inside `multi-user.target.wants`.

- Unit File

On CoreOS, unit files are located within the R/W filesystem at `/etc/systemd/system`. Full list options can be found [here](http://www.freedesktop.org/software/systemd/man/systemd.service.html) Ex:

```bash
# sample.application.1@8080.service
[Unit]
Description=sample-application # 9
After=docker.service #10
Requires=docker.service #10
After=network.target #15

[Service]
Type=forking  #16
PIDFile=/run/nginx.pid #17
EnvironmentFile=/etc/environment #1
ExecStartPre=/usr/bin/docker pull mohitarora/sample-app:v1.0.1 #2
ExecStart=/usr/bin/docker run —name %p —expose 8080 -p %i:8080 mohitarora/sample-app:v1.0.1 /opt/launch.sh #3 #8
ExecStartPost=/usr/bin/etcdctl set /applications/sample/%p ${COREOS_PUBLIC_IPV4}:%i #4
ExecStop=/usr/bin/docker stop %p #5
ExecStopPost=/usr/bin/etcdctl rm /applications/sample/%p #6
TimeoutSec=120min

[Install]
WantedBy=multi-user.target #11

[X-Fleet]
X-Conflicts=*@%i.service #7
```

1.  EnvironmentFile= allow you to exposes environment variables of a file to the current unit file

2. ExecStartPre= allow you to specify any commands that will run before ExecStart. In this case we are pulling application docker image from docker index on CoreOS machine.

3. ExecStart= allows you to specify any command that you’d like to run when this unit is started. In this case we are starting application docker container. In most cases, we will be starting docker container as part of Exec Start. The pid assigned to this process is what systemd will monitor to determine whether the process has crashed or not. Do not run docker containers with `-d` as this will prevent the container from starting as a child of this pid. systemd will think the process has exited and the unit will be stopped.

4.  ExecStartPost= allow you to specify any commands that will run after ExecStart. In this case we are creating a key value pair in etcd. We will use the same key value details when we launch apache server.

5. ExecStop= allow you to specify commands that will run when this unit is considered failed or if it is stopped. In this case we are stopping docker container.

6.  ExecStopPost= allow you to specify any commands that will run after ExecStop. In this case we are removing entry from etcd

7. X-Conflicts= X-Conflicts attribute tells fleet that these two services can’t be run on the same machine

8. %p && %i: Instantiated Units

%p  Prefix name, Refers to any string before @ in your unit name. in this case, "sample.application.1"
%i  Instance name, Refers to the string between the @ and the suffix.  in this case, "8080"

%n  Full unit name, Useful if the name of your unit is unique enough to be used as an argument on a command.
%m  Machine ID, Useful for namespacing etcd keys by machine. Example: /machines/%m/units
%b  BootID, Similar to the machine ID, but this value is random and changes on each boot
%H  Hostname, Allows you to run the same unit file across many machines. Useful for service discovery

ex:

```bash
# foo@8081.service
ExecStartPost=/usr/bin/etcdctl set /domains/example.com/%H:%i running
# ExecStartPost=/usr/bin/etcdctl set /domains/example.com/10.10.10.123:8081 running
```

9. The description shows up in the systemd log and a few other places. Write something that will help you understand exactly what this does later on.

10. `After=docker.service` and `Requires=docker.service` means this unit will only start after `docker.service` is active. You can define as many of these as you want.

11. WantedBy= is the target that this unit is a part of. it means that if the service is enabled, then it is necessary to be started in order to complete the init of this target.

12. ExecReload=  Commands that will run when this unit is reloaded via systemctl reload foo.service

13. RestartSec=  The amount of time to sleep before restarting a service. Useful to prevent your failed service from attempting to restart itself every 100ms.

14. =- is systemd syntax to ignore errors for this command. We don't consider this an error (because we want the container stopped) so we tell systemd to ignore the possible failure.

15. After declares that the service must be started only after the network target has been completed. Targets are similar to runlevels, but for reasons of flexibility the systemd developers have built in an extra layer of abstraction. Basically what it says is: Only start this after the network is ready.

16. Type= declares this service as forking, meaning that the service follows the traditional unix pattern of a daemon forking its process.

17. PIDFile= is a file containing the process id of the service. This is no longer strictly necessary with systemd because systemd keeps track of all the processes started by the unit. However, according to the man page of systemd.service it is recommended to be used if the daemon forks because then “systemd can identify the main process of the daemon”.

Note:

While it's possible to manage the starting, stopping, and removal of the container in a single ExecStart command by using `docker run --rm`. it's a good idea to separate the container's lifecycle into ExecStartPre, ExecStart, and ExecStop options as we've done above. This gives you a chance to inspect the container's state after it stops or fails.
