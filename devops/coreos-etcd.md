## Configuring etcd

etcd is an open source, distributed, consistent key-value store for shared configuration, service discovery, and scheduler coordination.

#### [Customizing the etcd Unit](https://coreos.com/docs/distributed-configuration/customize-etcd-unit/)

- Use Client Certificates

etcd supports client certificates as a way to provide secure communication between clients ↔ leader and internal traffic between etcd peers in the cluster. Configuring certificates for both scenarios is done through environment variables. (ex: systemd drop-in unit to augment the unit)

#### [Etcd Configuration](https://coreos.com/docs/distributed-configuration/etcd-configuration/)

Individual node configuration options can be set in three places:

Command line flags (highest precedence)
Environment variables (high)
Configuration file (low)

- Cluster Configuration

Cluster-wide settings are configured via the /config admin endpoint and additionally in the configuration file. Values contained in the configuration file will seed the cluster setting with the provided value. After the cluster is running, only the admin endpoint is used.

The full documentation is contained in the [API docs](https://github.com/coreos/etcd/blob/master/Documentation/api.md#cluster-config).

activeSize - the maximum number of peers that can participate in the consensus protocol. Other peers will join as standbys.
removeDelay - the minimum time in seconds that a machine has been observed to be unresponsive before it is removed from the cluster.
syncInterval - the amount of time in seconds between cluster sync when it runs in standby mode.

- Command Line Flags

Required
-name - The node name. Defaults to a UUID.

Optional
-addr - The advertised public hostname:port for client communication. Defaults to 127.0.0.1:4001.

-bind-addr - The listening hostname for client communication. Defaults to advertised IP.

-ca-file - The path of the client CAFile. Enables client cert authentication when present.

-cert-file - The cert file of the client.

-cluster-active-size - The expected number of instances participating in the consensus protocol. Only applied if the etcd instance is the first peer in the cluster.

-cluster-remove-delay - The number of seconds before one node is removed from the cluster since it cannot be connected at all. Only applied if the etcd instance is the first peer in the cluster.

-cluster-sync-interval - The number of seconds between synchronization for standby-mode instance with the cluster. Only applied if the etcd instance is the first peer in the cluster.

-config - The path of the etcd configuration file. Defaults to /etc/etcd/etcd.conf.

-cors - A comma separated white list of origins for cross-origin resource sharing.

-cpuprofile - The path to a file to output CPU profile data. Enables CPU profiling when present.

-data-dir - The directory to store log and snapshot. Defaults to the current working directory.

-discovery - A URL to use for discovering the peer list. (i.e "https://discovery.etcd.io/your-unique-key").

-graphite-host - The Graphite endpoint to which to send metrics.

-http-read-timeout - The number of seconds before an HTTP read operation is timed out.

-http-write-timeout - The number of seconds before an HTTP write operation is timed out.

-key-file - The key file of the client.

-max-result-buffer - The max size of result buffer. Defaults to 1024.

-max-retry-attempts - The max retry attempts when trying to join a cluster. Defaults to 3.

-peer-addr - The advertised public hostname:port for server communication. Defaults to 127.0.0.1:7001.

-peer-bind-addr - The listening hostname for server communication. Defaults to advertised IP.

-peer-ca-file - The path of the CAFile. Enables client/peer cert authentication when present.

-peer-cert-file - The cert file of the server.

-peer-election-timeout - The number of milliseconds to wait before the leader is declared unhealthy.

-peer-heartbeat-interval - The number of milliseconds in between heartbeat requests

-peer-key-file - The key file of the server.

-peers - A comma separated list of peers in the cluster (i.e "203.0.113.101:7001,203.0.113.102:7001").

-peers-file - The file path containing a comma separated list of peers in the cluster.

-retry-interval - Seconds to wait between cluster join retry attempts.

-snapshot=false - Disable log snapshots. Defaults to true.

-v - Enable verbose logging. Defaults to false.

-vv - Enable very verbose logging. Defaults to false.

-version - Print the version and exit.

- Configuration File

The etcd configuration file is written in TOML and read from /etc/etcd/etcd.conf by default.

```bash
addr = "127.0.0.1:4001"   # Environment Variables: ETCD_ADDR
bind_addr = "127.0.0.1:4001"   # Environment Variables: ETCD_BIND_ADDR
ca_file = ""
cert_file = ""
cors = []
cpu_profile_file = ""
data_dir = "."
discovery = "http://etcd.local:4001/v2/keys/_etcd/registry/examplecluster"
http_read_timeout = 10.0
http_write_timeout = 10.0
key_file = ""
peers = []
peers_file = ""
max_result_buffer = 1024
max_retry_attempts = 3
name = "default-name"
snapshot = true
verbose = false
very_verbose = false

[peer]
addr = "127.0.0.1:7001"  # Environment Variables: ETCD_PEER_ADDR
bind_addr = "127.0.0.1:7001"  # Environment Variables: ETCD_PEER_BIND_ADDR
ca_file = ""
cert_file = ""
key_file = ""

[cluster]
active_size = 9   # Environment Variables: ETCD_CLUSTER_ACTIVE_SIZE
remove_delay = 1800.0  # Environment Variables: ETCD_CLUSTER_REMOVE_DELAY
sync_interval = 5.0    # Environment Variables: ETCD_CLUSTER_SYNC_INTERVAL
```

#### [etcd API](https://coreos.com/docs/distributed-configuration/etcd-api/)

```bash
# Getting the etcd version when you are in CoreOS machine
curl -L http://127.0.0.1:4001/version
```

- Key Space Operations

The primary API of etcd is a hierarchical key space. The key space consists of directories and keys which are generically referred to as "nodes".

etcd uses a file-system-like structure to represent the key-value pairs, therefore all keys start with /.

```bash
# Setting the value of a key
curl -L http://127.0.0.1:4001/v2/keys/message -X PUT -d value="Hello world"

{
    "action": "set",   # the action of the request
    "node": {
        "createdIndex": 2,  # an index is a unique, monotonically-incrementing integer created for each change to etcd. This specific index reflects the point in the etcd state machine at which a given key was created.
        "key": "/message",  # the HTTP path to which the request. ex: set /message to Hello world
        "modifiedIndex": 2, # this attribute is also an etcd index. Actions that cause the value to change include set, delete, update, create, compareAndSwap and compareAndDelete. Since the get and watch commands do not change state in the store, they do not change the value of node.modifiedIndex.
        "value": "Hello world"  # the value of the key after resolving the request.
    }
}
```

```bash
# get the value of the key
curl -L http://127.0.0.1:4001/v2/keys/message

# Changing the value of a key
curl -L http://127.0.0.1:4001/v2/keys/message -X PUT -d value="Hello etcd"

{
    "action": "set",
    "node": {
        "createdIndex": 3,
        "key": "/message",
        "modifiedIndex": 3,
        "value": "Hello etcd"
    },
    "prevNode": {  # represents what the state of a given node was before resolving the request. omitted in the event
        "createdIndex": 2,
        "key": "/message",
        "value": "Hello world",
        "modifiedIndex": 2
    }
}

# Deleting a key
curl -L http://127.0.0.1:4001/v2/keys/message -X DELETE
```

- TTL (expire)

Keys in etcd can be set to expire after a specified number of seconds. You can do this by setting a TTL (time to live) on the key when sending a PUT request:

```bash
# The ttl is the specified time to live for the key, in seconds.
curl -L http://127.0.0.1:4001/v2/keys/foo -XPUT -d value=bar -d ttl=5

# TTL could be unset to avoid expiration through update operation
curl -L http://127.0.0.1:4001/v2/keys/foo -XPUT -d value=bar -d ttl= -d prevExist=true
```

NOTE: Keys can only be expired by a cluster leader, so if a machine gets disconnected from the cluster, its keys will not expire until it rejoins.

- Waiting for a change

We can watch for a change on a key and receive a notification by using long polling. This also works for child keys by passing recursive=true in curl.

```bash
curl -L http://127.0.0.1:4001/v2/keys/foo?wait=true  # will be notified
curl -L http://127.0.0.1:4001/v2/keys/foo -XPUT -d value=bar
```

#### [Confd and Etcd to dynamically reconfigure services in CoreOS](https://www.digitalocean.com/community/tutorials/how-to-use-confd-and-etcd-to-dynamically-reconfigure-services-in-coreos)

one or multiple instances of a service need to register each instance with `etcd`, related services can obtain valuable information about the state of the infrastructure and use this knowledge to inform their own behavior. This makes it possible for services to dynamically configure themselves whenever significant etcd values change.

We use `confd`, which is specifically crafted to watch distributed key-value stores for changes. It is run from within a Docker container and is used to trigger configuration modifications and service reloads. confd can make this process relatively simple by allowing for continuous polling of significant entries.

Use Nginx to serve as a reverse proxy to the various Apache instances that we can spawn from our template files. The Nginx container will be configured with confd to watch the service registration that our sidekick services are responsible for. One modification we have made here is to use the private interface instead of the public interface. Since all of our Apache instances will be passed traffic through the Nginx reverse proxy instead of handling connections from the open web, this is a good idea.

use `confd` so that we can watch the /services/apache location in etcd for changes and reconfigure Nginx each time.

- get confd binary

```bash
cd /usr/local/bin
curl -L https://github.com/kelseyhightower/confd/releases/download/v0.5.0/confd-0.5.0<^>-linux-amd64 -o confd
chmod +x confd
#  create the configuration structure that confd expects
mkdir -p /etc/confd/{conf.d,templates}
```

- Create a Confd Configuration File to Read Etcd Values

start by creating a configuration file, or template resource file.

Configuration files in confd are used to set up the service to check certain etcd values and initiate actions when changes are detected. These use the TOML file format, which is easy to use and fairly intuitive.

Ex: Our Nginx container will use a template stored at `/etc/confd/templates/nginx.conf.tmpl` to render a configuration file that will be placed at `/etc/nginx/sites-enabled/app.conf`. The file will be given a permission set of 0644 and ownership will be given to the root user.

The confd application will look for changes at the /services/apache node. When a change is seen, confd will query for the new information under that node. It will then render a new configuration for Nginx. It will check the configuration file for syntax errors and reload the Nginx service after the file is in place.

```bash
# /etc/confd/conf.d/nginx.toml
[template]

# The name of the template that will be used to render the application's configuration file
# Confd will look in `/etc/conf.d/templates` for these files by default
src = "nginx.tmpl"

# The location to place the rendered configuration file
dest = "/etc/nginx/sites-enabled/app.conf"

# The etcd keys or directory to watch.  This is where the information to fill in
# the template will come from.
keys = [ "/services/apache" ]

# File ownership and mode information
owner = "root"
mode = "0644"

# These are the commands that will be used to check whether the rendered config is
# valid and to reload the actual service once the new config is in place
check_cmd = "/usr/sbin/nginx -t"
reload_cmd = "/usr/sbin/service nginx reload"
```

- confd options

Directive  Required?  Type     Description
src           Yes            String   The name of the template that will be used to render the information. If this is located outside of
                                             `/etc/confd/templates`, the entire path is should be used.
dest         Yes            String   The file location where the rendered configuration file should be placed.
keys         Yes            Array    The etcd keys that the template requires to be rendered correctly. This can be a directory if the
                                of strings       template is set up to handle child keys.
owner       No            String   The username that will be given ownership of the rendered configuration file.
group       No            String   The group that will be given group ownership of the rendered configuration file.
mode        No            String   The octal permissions mode that should be set for the rendered file.
check_cmd   No         String   check the syntax of the rendered configuration file.
reload_cmd  No         String   reload the configuration of the application.
prefix        No            String  A part of the etcd hierarchy that comes before the keys in the keys directive. This can be used to
                                             make the .toml file more flexible.

- Create a Confd Template File

Put this file in our templates directory:

In this file, we basically just re-create a standard Nginx reverse proxy configuration file. However we will be using some Go templating syntax to substitute some of the information that confd is pulling from etcd.

```bash
# /etc/confd/templates/nginx.tmpl

# 1st, configure the block with the "upstream" servers. To define the pool of servers that Nginx can send requests to.
# allows us to pass requests to the pool_name and Nginx will select one of the defined servers to hand the request to.
upstream pool_name {
    server server_1_IP:port_num;
    server server_2_IP:port_num;
    server server_3_IP:port_num;
}

# make dynamic fill this information in when the file is rendered. We can do this by using Go templates for the dynamic content.
# opened a block to define an upstream pool of servers called apache_pool.
upstream apache_pool {
    # indicate to use Go language code by using the double brackets.
    # specify the etcd endpoint where the values we are interested in are held. using a range to make the list iterable.
    {{ range getvs "/services/apache/*" }}
        # pass all of the entries retrieved from `/services/apache` location in etcd into the range block
        # get the value of the key in the current iteration using a single dot within the "{{" and "}}" that indicate an inserted value.
        # within the range loop to populate the server pool.
        server {{ . }};
    # end the loop with the {{ end }} directive.
    {{ end }}
}
```

Note: Remember to add the semicolon after the server directive within the loop. Forgetting this will result in a non-working configuration.

After setting up the server pool, we can just use a proxy pass to direct all connections into that pool. This will just be a standard server block as a reverse proxy. The one thing to note is the access_log, which uses a custom format that we will be creating momentarily:

```bash
upstream apache_pool {
    {{ range getvs "/services/apache/*" }}
        server {{ . }};
    {{ end }}
}

server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    access_log /var/log/nginx/access.log upstreamlog;

    location / {
        proxy_pass http://apache_pool;
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

This will respond to all connections on port 80 and pass them to the pool of servers at apache_pool that is generated by looking at the etcd entries.

While we are dealing with this aspect of the service, we should remove the default Nginx configuration file so that we do not run into conflicts later on. We will just remove the symbolic link enabling the default config: `rm /etc/nginx/sites-enabled/default`

- setup nginx logs

configure the log format that we referenced in our template file. This must go in the http block of the configuration, which is available in the main configuration file. Open that now: `vi /etc/nginx/nginx.conf`

We will add a `log_format` directive to define the information we want to log. It will log the client that is visiting, as well as the backend server that the request is passed to. We will log some data about the amount of time these procedures take:

```bash
. . .
http {
    ##
    # Basic Settings
    ##
    log_format upstreamlog '[$time_local] $remote_addr passed to: $upstream_addr: $request Upstream Response Time: $upstream_response_time Request time: $request_time';

    sendfile on;
    . . .
}
```

- Creating a Script to Run Confd

The script must do two things for our service to work correctly:

1. It must run when the container launches to set up the initial Nginx settings based on the current state of the backend infrastructure.

2. It must continue to watch for changes to the etcd registration for the Apache servers so that it can reconfigure Nginx based on the backend servers available.

Good tutorials from [here](https://github.com/marceldegraaf/blog-coreos-1)

place this script alongside our `confd` executable. We will call this `confd-watch`:

```bash
#!/bin/bash

# Fail hard and fast
# the script fails immediately if anything goes wrong. It will return the value of the last command to fail or run.
set -eo pipefail

# Set up some variables. By using bash parameter substitution, we will set default values, but build in some flexibility to let us override the hard-coded values when calling the script. This will basically just set up each component of the connection address independently and then group them together to get the full address needed.
#
# The parameter substitution is created with this syntax: ${var_name:-default_value}. This has the property of using the value of var_name if it is given and not null, otherwise defaulting to the default_value.
export ETCD_PORT=${ETCD_PORT:-4001}
export HOST_IP=${HOST_IP:-172.17.42.1}
export ETCD=$HOST_IP:$ETCD_PORT

echo "[nginx] booting container. ETCD: $ETCD"

# Loop until confd has updated the nginx config. Try to make initial configuration every 5 seconds until successful
#
# use confd to render an initial version of the Nginx configuration file by reading the values from etcd that are available when this script is called. We will use an until loop to continuously try to build the initial configuration.
#
# The looping construct can be necessary in case etcd is not available right away or in the event that the Nginx container is brought online before the backend servers. This allows it to poll etcd repeatedly until it can finally produce a valid initial configuration.
#
# The actual confd command we are calling executes once and then exits. This is so we can wait 5 seconds until the next run to give our backend servers a chance to register. We connect to the full ETCD variable that we built using the defaults or passed in parameters, and we use the template resources file to define the behavior of what we want to do:
until confd -onetime -node $ETCD -config-file /etc/confd/conf.d/nginx.toml; do
  echo "[nginx] waiting for confd to create initial nginx configuration"
  sleep 5
done

# Run confd in the background to watch the upstream servers
#
# place a mechanism for continual polling. to make sure any future changes are detected so that Nginx will be updated.
#
# Set a continuous polling interval and place the process in the background so that it will run indefinitely. We will pass in the same etcd connection information and the same template resources file since our goal is still the same.
confd -interval 10 -node $ETCD -config-file /etc/confd/conf.d/nginx.toml &
echo "[nginx] confd is now monitoring etcd for changes..."

# Start the Nginx service using the generated config
#
# Since this script will be called as our Docker "run" command, we need to keep it running in the foreground so that the container doesn't exit at this point. We can do this by just tailing the logs, giving us access to all of the information we have been logging:
echo "[nginx] starting nginx service..."
service nginx start

# Tail all nginx log files. Follow the logs to allow the script to continue running
tail -f /var/log/nginx/*.log
```

The last thing we need to do is make the script executable:

`chmod +x /usr/local/bin/confd-watch`

commit the container and push it up to Docker Hub so that it is available to our machines to pull down.

- Build the Nginx Static Unit File

```bash
# static/nginx_lb.service
[Unit]
Description=Nginx load balancer web server backends

# Requirements
Requires=etcd.service
Requires=docker.service

# Dependency ordering
After=etcd.service
After=docker.service

[Service]
# Let the process take awhile to start up (for first run Docker containers)
TimeoutStartSec=0

# Change killmode from "control-group" to "none" to let Docker remove
# work correctly.
KillMode=none

# Get CoreOS environmental variables
EnvironmentFile=/etc/environment

# Pre-start and Start
# Directives with "=-" are allowed to fail without consequence
ExecStartPre=-/usr/bin/docker kill nginx_lb
ExecStartPre=-/usr/bin/docker rm nginx_lb
ExecStartPre=/usr/bin/docker pull user_name/nginx_lb
ExecStart=/usr/bin/docker run --name nginx_lb -p ${COREOS_PUBLIC_IPV4}:80:80 user_name/nginx_lb /usr/local/bin/confd-watch

# Stop
ExecStop=/usr/bin/docker stop nginx_lb

[X-Fleet]
Conflicts=nginx.service
Conflicts=apache@*.service
```

start up our Nginx service:

```bash
fleetctl start ~/static/nginx_lb.service
#  see some log information from confd
fleetctl journal nginx_lb.service
# To see the load balancer in action. contains the host's public IP address.
fleetctl ssh nginx_lb cat /etc/environment
```

As you can see, confd looked to etcd for its initial configuration. It then started nginx. Afterwards, we can see lines where the etcd entries have been re-evaluated and a new configuration file made. If the newly generated file does not match the `md5sum` of the file in place, the file is switched out and the service is reloaded.

#### etcd 2.0

Internal etcd protocol improvements to guard against accidental misconfiguration
etcdctl backup was added to make recovering from cluster failure easier
etcdctl member list/add/remove commands for easily managing a cluster
On-disk datastore safety improvements with CRC checksums and append-only behavior
An improved Raft consensus implementation already used in other projects like CockroachDB
More rigorous and faster running tests of the underlying Raft implementation, covering all state machine and cases explained in the original Raft white paper in 1.5 seconds
Additional administrator focused documentation explaining common scenarios
Official IANA assigned ports for etcd TCP 2379/2380
