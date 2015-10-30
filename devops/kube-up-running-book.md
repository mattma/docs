# Kubernetes Up and Running book

## Intro

Kubernetes provides tools which automate the distribution of applications across a cluster of machines, it provides a common API and self-healing framework which automatically handles machine failures and streamlines application deployments, log‐ ging, and monitoring.

Kubernetes can re-scheduled due to node failure. This service information is exposed to other apps through environment variables and DNS, making it easy for both cluster native and traditional applications to locate and communicate with other services running within the cluster. Kubernetes also provides a set of APIs that allows for custom deployment workflows such as rolling updates, canary deploys, and blue-green deployments.

### Kubernetes Design Overview

Kubernetes sits on top of a cluster of machines and provides an abstraction of a single machine.

- Clusters

Clusters are the set of compute, storage, and network resources where pods are deployed, managed, and scaled. Clusters are made of nodes connected via a “flat” network, in which each node and pod can communicate with each other.

- Pods

Pods are a colocated group of application containers that share volumes and a networking stack. Pods are the smallest units that can be deployed within a Kubernetes cluster. They are used for run once jobs, can be deployed individually, but long running applications, such as web services, should be deployed and managed by a replication controller.

- Replication Controllers

Replication Controllers ensure a specific number of pods, based on a template, are running at any given time. Replication Controllers manage pods based on labels and status updates.

- Services

Services deliver cluster wide service discovery and basic load balancing by providing a persistent name, address, or port for pods with a common set of labels.

- Labels

Labels are used to organize and select groups of objects, such as pods, based on key/ value pairs.

### Kubernetes Control Plane (Controller Services)

The control plane is made up of a collection of components that work together to provide a unified view of the cluster.

- etcd

etcd is a distributed, consistent key-value store for shared configuration and service discovery, with a focus on being: simple, secure, fast, and reliable. etcd uses the Raft consensus algorithm to achieve fault-tolerance and high-availability. etcd provides
the ability to “watch” for changes, which allows for fast coordination between Kubernetes components. All persistent cluster state is stored in etcd.

The etcd service is only available to Controller Services. This was done intentionally as this etcd instance is dedicated to the Kubernetes API server.

- API Server

The apiserver is responsible for serving the Kubernetes API and proxying cluster components such as the Kubernetes web UI. The apiserver exposes a REST interface that processes operations such as creating pods and services, and updating the corresponding objects in etcd. The apiserver is the only Kubernetes component that talks directly to etcd.

- Scheduler

The scheduler watches the apiserver for unscheduled pods and schedules them onto healthy nodes based on resource requirements.

- Controller Manager

There are other cluster-level functions such as managing service end-points, which is handled by the endpoints controller, and node lifecycle management which is handled by the node controller. When it comes to pods, replication controllers provide the ability to scale pods across a fleet of machines, and ensure the desired number of pods are always running.

Each of these controllers currently live in a single process called the Controller Manager.

### Kubernetes Node (Worker Services)

The Kubernetes node runs all the components necessary for running application containers and load balancing service end-points. Nodes are also responsible for reporting resource utilization and status information to the API server.

- Docker

Docker, the container runtime engine, runs on every node and handles downloading and running containers. Docker is controlled locally via its API by the Kubelet.

- Kubelet

Each node runs the Kubelet, which is responsible for node registration, and management of pods. The Kubelet watches the Kubernetes API server for pods to create as scheduled by the Scheduler, and pods to delete based on cluster events. The Kubelet also handles reporting resource utilization, and health status information for a specific node and the pods it’s running.

- Proxy

Each node also runs a simple network proxy with support for TCP and UDP stream forwarding across a set of pods as defined in the Kubernetes API.


## Deploying Kubernetes

Kubernetes requires a specific network layout where each pod running in a given cluster has a dedicated IP address. Nodes must have network connectivity between them, ideally in the same datacenter or availability zone. Nodes should also have a valid hostname that can be resolved using DNS by other nodes in the cluster.

- Configuring the Docker Daemon

The Kubernetes network model requires each pod to have a unique IP address within the cluster. Docker is responsible for allocating pod IPs based on the subnet used by the Docker bridge. To satisfy the pod IP uniqueness constraint we must ensure each Docker host has a unique subnet range.


```yaml
# /etc/systemd/system/docker.service
[Unit]
Description=Docker Application Container Engine
Documentation=http://docs.docker.io

# bip must be unique across all nodes
[Service]
ExecStart=/usr/bin/docker --daemon \
  --bip=10.200.0.1/24 \
  --iptables=false \
  --ip-masq=false \
  --host=unix:///var/run/docker.sock \
  --storage-driver=overlay
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# start the Docker service
sudo systemctl daemon-reload
sudo systemctl enable docker
sudo systemctl start docker
```

Network Address Translation (NAT) is a way to map an entire network to a single IP address. It ensure containers have access to the internet.

- DNS

Kubernetes offers a DNS cluster add-on that provides DNS A and SRV records for Kubernetes services. The heavy lifting is done by `SkyDNS`, an etcd backed DNS server that supports dynamic updates from the Kubernetes API.

```yaml
# skydns-rc.yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: kube-dns-v8
  namespace: kube-system
  labels:
    k8s-app: kube-dns
    version: v8
    kubernetes.io/cluster-service: "true"
spec:
  replicas: 1
  selector:
    k8s-app: kube-dns
    version: v8
  template:
    metadata:
      labels:
        k8s-app: kube-dns
        version: v8
        kubernetes.io/cluster-service: "true"
    spec:
      containers:
      - name: etcd
        image: gcr.io/google_containers/etcd:2.0.9
        resources:
          limits:
            cpu: 100m
            memory: 50Mi
        command:
        - /usr/local/bin/etcd
        - -data-dir
        - /var/etcd/data
        - -listen-client-urls
        - http://127.0.0.1:2379,http://127.0.0.1:4001
        - -advertise-client-urls
        - http://127.0.0.1:2379,http://127.0.0.1:4001
        - -initial-cluster-token
        - skydns-etcd
        volumeMounts:
        - name: etcd-storage
          mountPath: /var/etcd/data
      - name: kube2sky
        image: gcr.io/google_containers/kube2sky:1.11
        resources:
          limits:
            cpu: 100m
            memory: 50Mi
        args:
        # command = "/kube2sky"
        - -domain=cluster.local
        # @Edit: kube_master_url flag should point to your API server.
        - -kube_master_url=http://node0.c.PROJECT_NAME.internal:8080
      - name: skydns
        image: gcr.io/google_containers/skydns:2015-03-11-001
        resources:
          limits:
            cpu: 100m
            memory: 50Mi
        args:
        # command = "/skydns"
        - -machines=http://localhost:4001
        - -addr=0.0.0.0:53
        - -domain=cluster.local.
        ports:
        - containerPort: 53
          name: dns
          protocol: UDP
        - containerPort: 53
          name: dns-tcp
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
            scheme: HTTP
          initialDelaySeconds: 30
          timeoutSeconds: 5
      - name: healthz
        image: gcr.io/google_containers/exechealthz:1.0
        resources:
          limits:
            cpu: 10m
            memory: 20Mi
        args:
        - -cmd=nslookup kubernetes.default.svc.cluster.local localhost >/dev/null
        - -port=8080
        ports:
        - containerPort: 8080
          protocol: TCP
      volumes:
      - name: etcd-storage
        emptyDir: {}
      dnsPolicy: Default  # Don't use cluster DNS.
```

```bash
# Create the SkyDNS replication controller
kubectl create -f skydns-rc.yaml
```

```yaml
# skydns-svc.yaml
apiVersion: v1
kind: Service
metadata:
  name: kube-dns
  namespace: kube-system
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: "KubeDNS"
spec:
  selector:
    k8s-app: kube-dns
  clusterIP: 10.200.20.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
  - name: dns-tcp
    port: 53
    protocol: TCP
```

```bash
# Next create the SkyDNS service
kubectl create -f https://kuar.io/skydns-svc.yaml
```

Services can now be looked up by service name from pods deployed by the Kubelet.
