# [cubectl](https://cloud.google.com/container-engine/docs/kubectl/)

The Kubectl command-line tool can be used to create, update, delete, and get API objects. Kubernetes stores its serialized state (currently in etcd) in terms of the API resources. Kubernetes itself is decomposed into multiple components, which interact through its API.

## v1beta3 conversion tips

 Most recent [API Live Docs](http://kubernetes.io/third_party/swagger-ui/#!/v1beta3)
 Download [Release Example links](https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.16.2)

```bash
# on guest machines
curl -LO https://storage.googleapis.com/kubernetes-release/release/v0.16.2/bin/darwin/amd64/kubectl

# Master
curl -LO https://storage.googleapis.com/kubernetes-release/release/v0.16.2/bin/darwin/amd64/kube-apiserver
curl -LO https://storage.googleapis.com/kubernetes-release/release/v0.16.2/bin/darwin/amd64/kube-controller-manager
curl -LO https://storage.googleapis.com/kubernetes-release/release/v0.16.2/bin/darwin/amd64/kube-scheduler
curl -LO https://github.com/kelseyhightower/kube-register/releases/download/v0.0.3/kube-register-0.0.3-linux-amd64

curl -LO https://storage.googleapis.com/k8s/setup-network-environment

# Nodes
curl -LO https://storage.googleapis.com/kubernetes-release/release/v0.16.2/bin/linux/amd64/kube-proxy
curl -LO https://storage.googleapis.com/kubernetes-release/release/v0.16.2/bin/linux/amd64/kubelet

# make all of them executable
chmod +x *
```

 Some important differences between v1beta1/2 and v1beta3:

     * The resource `id` is now called `name`.
     * `name`, `labels`, `annotations`, and other metadata are now nested in a map called `metadata`
     * `desiredState` is now called `spec`, and `currentState` is now called `status`
     * `/minions` has been moved to `/nodes`, and the resource has kind `Node`
     * The namespace is required (for all namespaced resources) and has moved from a URL parameter to the path: `/api/v1beta3/namespaces/{namespace}/{resource_collection}/{resource_name}`
     * The names of all resource collections are now lower cased - instead of `replicationControllers`, use `replicationcontrollers`.
     * To watch for changes to a resource, open an HTTP or Websocket connection to the collection query and provide the `?watch=true` query parameter along with the desired `resourceVersion` parameter to watch from.
     * The `labels` query parameter has been renamed to `label-selector`.
     * The container `entrypoint` has been renamed to `command`, and `command` has been renamed to `args`.
     * Container, volume, and node resources are expressed as nested maps (e.g., `resources{cpu:1}`) rather than as individual fields, and resource values support [scaling suffixes](resources.md#resource-quantities) rather than fixed scales (e.g., milli-cores).
     * Restart policy is represented simply as a string (e.g., `"Always"`) rather than as a nested map (`always{}`).
     * Pull policies changed from `PullAlways`, `PullNever`, and `PullIfNotPresent` to `Always`, `Never`, and `IfNotPresent`.
     * The volume `source` is inlined into `volume` rather than nested.
     * Host volumes have been changed from `hostDir` to `hostPath` to better reflect that they can be files or directories.

kubectl controls the Kubernetes cluster manager

- Global options

      --alsologtostderr=false: log to standard error as well as files
      --api-version="": The API version to use when talking to the server
  -a, --auth-path="": Path to the auth info file. If missing, prompt the user. Only used if using https.
      --certificate-authority="": Path to a cert. file for the certificate authority.
      --client-certificate="": Path to a client key file for TLS.
      --client-key="": Path to a client key file for TLS.
      --cluster="": The name of the kubeconfig cluster to use
      --context="": The name of the kubeconfig context to use
  -h, --help=false: help for kubectl
      --insecure-skip-tls-verify=false: If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure.
      --kubeconfig="": Path to the kubeconfig file to use for CLI requests.
      --log_backtrace_at=:0: when logging hits line file:N, emit a stack trace
      --log_dir=: If non-empty, write log files in this directory
      --log_flush_frequency=5s: Maximum number of seconds between log flushes
      --logtostderr=true: log to standard error instead of files
      --match-server-version=false: Require server version to match client version
      --namespace="": If present, the namespace scope for this CLI request.
      --password="": Password for basic authentication to the API server.
  -s, --server="": The address and port of the Kubernetes API server
      --stderrthreshold=2: logs at or above this threshold go to stderr
      --token="": Bearer token for authentication to the API server.
      --user="": The name of the kubeconfig user to use
      --username="": Username for basic authentication to the API server.
      --v=0: log level for V logs
      --validate=false: If true, use a schema to validate the input before sending it
      --vmodule=: comma-separated list of pattern=N settings for file-filtered logging

1. kubectl cluster-info

Display cluster info. Display addresses of the master and services with label kubernetes.io/cluster-service=true

2. kubectl config set-cluster

Sets a cluster entry in `.kubeconfig`. Specifying a name that already exists will merge new fields on top of existing values for those fields.

```bash
kubectl config set-cluster NAME [--server=server] [--certificate-authority=path/to/certficate/authority] [--api-version=apiversion] [--insecure-skip-tls-verify=true]

# Set only the server field on the e2e cluster entry without touching other values.
kubectl config set-cluster e2e --server=https://1.2.3.4

# Embed certificate authority data for the e2e cluster entry
kubectl config set-cluster e2e --certificate-authority=~/.kube/e2e/kubernetes.ca.crt

# Disable cert checking for the dev cluster entry
kubectl config set-cluster e2e --insecure-skip-tls-verify=true
```

3. kubectl config set-context

Sets a context entry in .`kubeconfig`. Specifying a name that already exists will merge new fields on top of existing values for those fields.

```bash
kubectl config set-context NAME [--cluster=cluster_nickname] [--user=user_nickname] [--namespace=namespace]

# Set the user field on the gce context entry without touching other values
kubectl config set-context gce --user=cluster-admin
```

4. kubectl config set-credentials

Sets a user entry in `.kubeconfig`. Specifying a name that already exists will merge new fields on top of existing values.

```bash
kubectl config set-credentials NAME [--auth-path=/path/to/authfile] [--client-certificate=path/to/certfile] [--client-key=path/to/keyfile] [--token=bearer_token] [--username=basic_user] [--password=basic_password]

# Set only the "client-key" field on the "cluster-admin" entry, without touching other values:
kubectl set-credentials cluster-admin --client-key=~/.kube/admin.key

# Set basic auth for the "cluster-admin" entry
kubectl set-credentials cluster-admin --username=admin --password=uXFGweU9l35qcif

# Embed client certificate data in the "cluster-admin" entry
kubectl set-credentials cluster-admin --client-certificate=~/.kube/admin.crt --embed-certs=true
```

5. kubectl config set

Sets an individual value in a `.kubeconfig` file PROPERTY_NAME is a dot delimited name where each token represents either a attribute name or a map key. Map keys may not contain dots. PROPERTY_VALUE is the new value you wish to set.

```bash
kubectl config set PROPERTY_NAME PROPERTY_VALUE
```

6. kubectl config unset

Unsets an individual value in a `.kubeconfig` file PROPERTY_NAME is a dot delimited name where each token represents either a attribute name or a map key. Map keys may not contain dots

```bash
kubectl config unset PROPERTY_NAME
```

7. kubectl config use-context

Sets the current-context in a `.kubeconfig` file

```bash
kubectl config use-context CONTEXT_NAME
```

8. kubectl config view

displays merged `.kubeconfig` settings or a specified `.kubeconfig` file. You can use `--output=template --template=TEMPLATE` to extract specific values.

```bash
# Show merged .kubeconfig settings.
kubectl config view

# Show only local ./.kubeconfig settings
kubectl config view --local

# Get the password for the e2e user
kubectl config view -o template --template='{{ index . "users" "e2e" "password" }}'
```

9. kubectl config

config modifies `.kubeconfig` files using subcommands like "kubectl config set current-context my-context"

```bash
kubectl config SUBCOMMAND
```

10. kubectl create

Create a resource by filename or stdin. JSON and YAML formats are accepted.

```bash
kubectl create -f FILENAME

# Create a pod using the data in pod.json.
kubectl create -f pod.json

# Create a pod based on the JSON passed into stdin.
cat pod.json | kubectl create -f -
```

11. kubectl delete

Delete a resource by filename, stdin, resource and ID, or by resources and label selector. JSON and YAML formats are accepted.

If both a filename and command line arguments are passed, the command line arguments are used and the filename is ignored.

Note that the delete command does NOT do resource version checks, so if someone submits an update to a resource right when you submit a delete, their update will be lost along with the rest of the resource.

```bash
# kubectl delete ([-f FILENAME] | (RESOURCE [(ID | -l label | --all)]

# Delete a pod using the type and ID specified in pod.json.
kubectl delete -f pod.json

# Delete a pod based on the type and ID in the JSON passed into stdin.
cat pod.json | kubectl delete -f -

# Delete pods and services with label name=myLabel.
kubectl delete pods,services -l name=myLabel

# Delete a pod with ID 1234-56-7890-234234-456456.
kubectl delete pod 1234-56-7890-234234-456456

# Delete all pods
kubectl delete pods --all
```

12. kubectl describe

Show details of a specific resource. This command joins many API calls together to form a detailed description of a given resource.

```bash
kubectl describe RESOURCE ID
```

13. kubectl exec

Execute a command in a container.

```bash
kubectl exec -p POD -c CONTAINER -- COMMAND [args...]

# get output from running 'date' in ruby-container from pod 123456-7890
kubectl exec -p 123456-7890 -c ruby-container date

#switch to raw terminal mode, sends stdin to 'bash' in ruby-container from pod 123456-780 and sends stdout/stderr from 'bash' back to the client
kubectl exec -p 123456-7890 -c ruby-container -i -t -- bash -il

-c, --container="": Container name
-p, --pod="": Pod name
-i, --stdin=false: Pass stdin to the container
-t, --tty=false: Stdin is a TTY
```

14. kubectl expose

Take a replicated application and expose it as Kubernetes Service. Looks up a replication controller or service by name and uses the selector for that resource as the selector for a new Service on the specified port.

```bash
kubectl expose RESOURCE NAME --port=port [--protocol=TCP|UDP] [--target-port=number-or-name] [--service-name=name] [--public-ip=ip] [--create-external-load-balancer=bool]

# Creates a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000.
kubectl expose nginx --port=80 --target-port=8000

# Creates a second service based on the above service, exposing the container port 8443 as port 443 with the name "nginx-https"
kubectl expose service nginx --port=443 --target-port=8443 --service-name=nginx-https

# Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
kubectl expose streamer --port=4100 --protocol=udp --service-name=video-stream
```

15. kubectl get

Display one or many resources. Possible resources include:

pods (po), replication controllers (rc), services (svc), nodes(mi), events (ev)

By specifying the output as 'template' and providing a Go template as the value of the --template flag, you can filter the attributes of the fetched resource(s).

```bash
kubectl get [(-o|--output=)json|yaml|template|...] (RESOURCE [NAME] | RESOURCE/NAME ...)

# List all pods in ps output format.
kubectl get pods

# List a single replication controller with specified NAME in ps output format.
kubectl get replicationController web

# List a single pod in JSON output format.
kubectl get -o json pod web-pod-13je7

# Return only the status value of the specified pod.
kubectl get -o template web-pod-13je7 --template={{.currentState.status}}

# List all replication controllers and services together in ps output format.
kubectl get rc,services

# List one or more resources by their type and names
kubectl get rc/web service/frontend pods/web-pod-13je7

--no-headers=false: When using the default output, don\'t print headers.
-o, --output="": Output format. One of: json|yaml|template|templatefile.
    --output-version="": Output the formatted object with the given version (default api-version).
-l, --selector="": Selector (label query) to filter on
-t, --template="": Template string or path to template file to use when -o=template or -o=templatefile.  The template format is golang templates [http://golang.org/pkg/text/template/#pkg-overview]
-w, --watch=false: After listing/getting the requested object, watch \for changes.
    --watch-only=false: Watch \for changes to the requested object(s), without listing/getting first.
```

16. kubectl label

Update the labels on a resource. If `--overwrite` is true, then existing labels can be overwritten, otherwise attempting to overwrite a label will result in an error. If --resource-version is specified, then updates will use this resource version, otherwise the existing resource-version will be used.

```bash
kubectl label [--overwrite] RESOURCE NAME KEY_1=VAL_1 ... KEY_N=VAL_N [--resource-version=version]

# Update pod 'foo' with the label 'unhealthy' and the value 'true'.
kubectl label pods foo unhealthy=true

# Update pod 'foo' with the label 'status' and the value 'unhealthy', overwriting any existing value.
kubectl label --overwrite pods foo status=unhealthy

# Update all pods in the namespace
kubectl label pods --all status=unhealthy

# Update pod 'foo' only if the resource is unchanged from version 1.
kubectl label pods foo status=unhealthy --resource-version=1

# Update pod 'foo' by removing a label named 'bar' if it exists.
# Does not require the --overwrite flag.
kubectl label pods foo bar-
```

17. kubectl log

Print the logs for a container in a pod. If the pod has only one container, the container name is optional.

```bash
kubectl log [-f] POD [CONTAINER]

# Returns snapshot of ruby-container logs from pod 123456-7890.
kubectl log 123456-7890 ruby-container

# Starts streaming of ruby-container logs from pod 123456-7890.
kubectl log -f 123456-7890 ruby-container

-f, --follow=false: Specify \if the logs should be streamed.
-h, --help=false: help \for log
--interactive=true: If \true, prompt the user \for input when required. Default \true.
```

18. kubectl namespace

SUPERCEDED: Set and view the current Kubernetes namespace scope for command line requests.

namespace has been superceded by the context.namespace field of .kubeconfig files. See 'kubectl config set-context --help' for more details.

```bash
kubectl namespace [namespace]
```

19. kubectl port-forward

Forward one or more local ports to a pod.

```bash
kubectl port-forward -p POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]

# listens on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in the pod
kubectl port-forward -p mypod 5000 6000

# listens on port 8888 locally, forwarding to 5000 in the pod
kubectl port-forward -p mypod 8888:5000

# listens on a random port locally, forwarding to 5000 in the pod
kubectl port-forward -p mypod :5000

# listens on a random port locally, forwarding to 5000 in the pod
kubectl port-forward -p mypod 0:5000
```

20. kubectl proxy

Run a proxy to the Kubernetes API server.

```bash
kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix]

# Run a proxy to kubernetes apiserver on port 8011, serving static content from ./local/www/
kubectl proxy --port=8011 --www=./local/www/

# Run a proxy to kubernetes apiserver, changing the api prefix to k8s-api
# This makes e.g. the pods api available at localhost:8011/k8s-api/v1beta1/pods/
kubectl proxy --api-prefix=k8s-api
```

21. kubectl resize

Set a new size for a Replication Controller.

Resize also allows users to specify one or more preconditions for the resize action. If --current-replicas or --resource-version is specified, it is validated before the resize is attempted, and it is guaranteed that the precondition holds true when the resize is sent to the server.

```bash
kubectl resize [--resource-version=version] [--current-replicas=count] --replicas=COUNT RESOURCE ID

# Resize replication controller named 'foo' to 3.
kubectl resize --replicas=3 replicationcontrollers foo

# If the replication controller named foo's current size is 2, resize foo to 3.
kubectl resize --current-replicas=2 --replicas=3 replicationcontrollers foo

--current-replicas=-1: Precondition \for current size. Requires that the current size of the replication controller match this value \in order to resize.
--replicas=-1: The new desired number of replicas. Required.
--resource-version="": Precondition \for resource version. Requires that the current resource version match this value \in order to resize.
```

22. kubectl rolling-update

Perform a rolling update of the given ReplicationController.

Replaces the specified controller with new controller, updating one pod at a time to use the new PodTemplate. The `new-controller.json` must specify the same namespace as the existing controller and overwrite at least one (common) label in its replicaSelector.

```bash
kubectl rolling-update OLD_CONTROLLER_NAME -f NEW_CONTROLLER_SPEC

# Update pods of frontend-v1 using new controller data in frontend-v2.json.
kubectl rolling-update frontend-v1 -f frontend-v2.json

# Update pods of frontend-v1 using JSON data passed into stdin.
cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -

-f, --filename="": Filename or URL to file to use to create the new controller.
--poll-interval="3s": Time delay between polling controller status after update. Valid \time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
--timeout="5m0s": Max \time to \wait \for a controller to update before giving up. Valid \time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
--update-period="1m0s": Time to \wait between updating pods. Valid \time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
```

23. kubectl run-container

Create and run a particular image, possibly replicated. Creates a replication controller to manage the created container(s).

```bash
kubectl run-container NAME --image=image [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json]

# Starts a single instance of nginx.
kubectl run-container nginx --image=nginx

# Starts a replicated instance of nginx.
kubectl run-container nginx --image=nginx --replicas=5

# Dry run. Print the corresponding API objects without creating them.
kubectl run-container nginx --image=nginx --dry-run

# Start a single instance of nginx, but overload the desired state with a partial set of values parsed from JSON.
kubectl run-container nginx --image=nginx --overrides='{ "apiVersion": "v1beta1", "desiredState": { ... } }'
```

24. kubectl stop

Gracefully shut down a resource by id or filename. Attempts to shut down and delete a resource that supports graceful termination. If the resource is resizable it will be resized to 0 before deletion.

```bash
kubectl stop (-f FILENAME | RESOURCE (ID | -l label | --all))

# Shut down foo.
kubectl stop replicationcontroller foo

# Stop pods and services with label name=myLabel.
kubectl stop pods,services -l name=myLabel

# Shut down the service defined in service.json
kubectl stop -f service.json

# Shut down all resources in the path/to/resources directory
kubectl stop -f path/to/resources

```

25. kubectl update

Update a resource by filename or stdin. JSON and YAML formats are accepted.

```bash
kubectl update -f FILENAME

# Update a pod using the data in pod.json.
kubectl update -f pod.json

# Update a pod based on the JSON passed into stdin.
cat pod.json | kubectl update -f -

# Update a pod by downloading it, applying the patch, then updating. Requires apiVersion be specified.
kubectl update pods my-pod --patch='{ "apiVersion": "v1beta1", "desiredState": { "manifest": [{ "cpu": 100 }]}}'
```

26. kubectl version

Print the client and server version information.

```bash
kubectl version
```

27. kubectl api-versions

Print available API versions.

28. kubectl get cs

Returns status of each component

#### Helping commands for debugging

```bash
# List all keys in etcd
etcdctl ls --recursive

# List fleet machines
fleetctl list-machines

# Check system status of services on master node:
vagrant ssh master

systemctl status kube-apiserver
systemctl status kube-controller-manager
systemctl status kube-scheduler
systemctl status kube-register

journalctl -r -u kube-apiserver
journalctl -r -u kube-controller-manager

systemctl cat early-docker.service

systemctl status etcd2
systemctl status nginx

# Check system status of services on a kubernetes node:
vagrant ssh node-01

systemctl status kube-kubelet
systemctl status docker

journalctl -r -u kube-kubelet
journalctl -r -u docker

# List Kubernetes
kubectl get pods
kubectl get nodes

# Kill all pods:
for i in `kubectl get pods | awk '{print $1}'`; do kubectl stop pod $i; done
```

#### Check Status

```bash
# Once the master and nodes are up
#
# see all the running docker containers, get the container ID
vagrant ssh node-02 -c 'docker ps'

# check the container logs
vagrant ssh node-02 -c "docker logs cec3eab3f4d3"
```

- Create service example

```yaml
kind: Service
apiVersion: v1beta1
# must be a DNS compatible name
id: nginx-example
# the port that this service should serve on
port: 80
# just like the selector in the replication controller,
# but this time it identifies the set of pods to load balance traffic to.
selector:
  name: www
# the container on each pod to connect to, can be a name
# (e.g. 'www') or a number (e.g. 80)
containerPort: 80
```

```bash
# Check if node-01 can reach kubernetes master
vagrant ssh node-01 -- ping -c 10 172.17.8.101

# node-01 can pull down an image from docker registry
vagrant ssh node-01 -- 'sudo docker pull kubernetes/serve_hostname'

# Run ping from node-01 to docker bridges and to the containers on both nodes
vagrant ssh node-01 -- ping -c 20 10.246.0.1  && ping -c 20 10.246.1.1 && ping -c 20 10.246.0.2 && ping -c 20 10.246.1.2

# tcp check, curl to both the running webservers from node-01
vagrant ssh node-01 -- curl -sS 10.246.0.2:9376 && curl -sS 10.246.1.2:9376
```

`systemctl status kube-apiserver -l` return output below

```bash
# Started Kubernetes API Server.
# master kube-apiserver [restful/swagger] listing is available at
https://172.17.8.101:6443/swaggerapi/
https://172.17.8.101:6443/swaggerapi/api/v1beta3

# master kube-apiserver [restful/swagger]
https://172.17.8.101:6443/swagger-ui

172.17.8.101:8080

# master kube-apiserver Serving read-only insecurely on
172.17.8.101:7080

# master kube-apiserver Serving securely on
https://172.17.8.101:6443

# master kube-apiserver Serving insecurely on
0.0.0.0:8080

master kube-apiserver[1368]: I0503 02:46:11.769690    1368 publish.go:152] setting endpoints for master service "kubernetes" to &{{ } {kubernetes  default    0001-01-01 00:00:00 +0000 UTC <nil> map[] map[]} [{[{172.17.8.101 <nil>}] [{ 6443 TCP}]}]}

May 03 02:46:11 master kube-apiserver[1368]: I0503 02:46:11.843201    1368 publish.go:152] setting endpoints for master service "kubernetes-ro" to &{{ } {kubernetes-ro  default    0001-01-01 00:00:00 +0000 UTC <nil> map[] map[]} [{[{172.17.8.101 <nil>}] [{ 7080 TCP}]}]}

May 03 02:46:11 master kube-apiserver[1368]: I0503 02:46:11.931698    1368 server.go:377] Using self-signed cert (/var/run/kubernetes/apiserver.crt, /var/run/kubernetes/apiserver.key)
```
