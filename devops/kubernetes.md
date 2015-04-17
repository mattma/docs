# [Kubernetes](http://kubernetes.io/)

Kubernetes is an open source project introduced by Google to help organizations run their infrastructure in a similar manner to the internal infrastructure that runs Google Search, Gmail, and other Google services. The concepts and workflows in Kubernetes are designed to help engineers focus on their application instead of infrastructure and build for high availability of services. With the Kubernetes APIs, users can manage application infrastructure - such as load balancing, service discovery, and rollout of new versions - in a way that is consistent and fault-tolerant.

it is a container cluster manager from Google that offers a unique workflow for managing containers across multiple machines.

CoreOS maintains a full tutorial on [running an elastic Kubernetes cluster on EC2](https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/getting-started-guides/aws.md). Running Kubernetes on non-Google platforms is made possible by the CoreOS project [flannel](https://github.com/coreos/flannel), which provides cross-container networking on any cloud provider.

Kubernetes introduces the concept of a pod, which represents a group of containers that should be deployed as a single logical service. The pod concept tends to fit well with the popular pattern of running a single service per container. Kubernetes makes it easy to run multiple pods on a single machine or across an entire cluster for better resource utilization and high availability. Kubernetes also actively monitors the health of pods to ensure they are always running within the cluster.

etcd takes care of storing and replicating data used by Kubernetes across the entire cluster, and thanks to the Raft consensus algorithm etcd can recover from hardware failure and network partitions.

- Start up Kubernetes on CoreOS

Kubernetes components including

apiserver
controller-manager
kubecfg
kubelet
proxy

```bash
# pre-packaged all the requirement above. installed under the `/opt/kubernetes/bin`
sudo mkdir -p /opt/kubernetes/bin
sudo chown -R core: /opt/kubernetes
cd /opt/kubernetes
wget https://github.com/kelseyhightower/kubernetes-coreos/releases/download/v0.0.1/kubernetes-coreos.tar.gz
tar -C bin/ -xvf kubernetes-coreos.tar.gz
```

While CoreOS recommends that you run third party applications via Docker containers, CoreOS does support running Kubernetes directly on the OS. The best way to do that is by creating systemd unit files and starting the Kubernetes components with systemctl.

```bash
git clone https://github.com/kelseyhightower/kubernetes-coreos.git
sudo cp kubernetes-coreos/units/* /etc/systemd/system/

# Before starting everything, make sure etcd is started
sudo systemctl start etcd

# With the systemd units in place we are ready to start the Kubernetes services
sudo systemctl start apiserver
sudo systemctl start controller-manager
sudo systemctl start kubelet
sudo systemctl start proxy
```

- Creating a Kubernetes pod

Pods are how Kubernetes groups containers and define a logical deployment group. Lets take a look at a simple pod configuration for a Redis database.

```bash
{
  "id": "redis",
  "desiredState": {
    "manifest": {
      "version": "v1beta1",
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
