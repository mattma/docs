# [API Reference](https://cloud.google.com/container-engine/docs/v1beta1/)

[Kubernetes LIVE API docs](http://kubernetes.io/third_party/swagger-ui/)
[kubernetes client of Node.js](https://github.com/tenxcloud/node-kubernetes-client)

the internal representation of an API object is decoupled from any one API version. While all of the Kubernetes code operates on the internal structures, they are always converted to a versioned form before being written to storage (disk or etcd) or being sent over a wire. Clients should consume and operate on the versioned APIs exclusively.

To demonstrate the general process, let's walk through a (hypothetical) example:

* A user POSTs a Pod object to `/api/v7beta1/...`
* The JSON is unmarshalled into a `v7beta1.Pod` structure
* Default values are applied to the `v7beta1.Pod`
The `v7beta1.Pod` is converted to an `api.Pod` structure
The `api.Pod` is validated, and any errors are returned to the user
The `api.Pod` is converted to a `v6.Pod` (because v6 is the latest stable version)
The `v6.Pod` is marshalled into JSON and written to etcd

Now that we have the `Pod` object stored, a user can GET that object in any supported api version. For example:

* A user GETs the Pod from `/api/v5/...`
* The JSON is read from etcd and unmarshalled into a `v6.Pod` structure
* Default values are applied to the `v6.Pod`
* The `v6.Pod` is converted to an `api.Pod` structure
* The `api.Pod` is converted to a `v5.Pod` structure
* The `v5.Pod` is marshalled into JSON and sent to the user

## v1beta3: API at /api/v1beta3 version v1beta3

1. /api/v1beta3

```bash
# list or watch objects of kind Endpoints
GET /api/v1beta3/endpoints

# list or watch objects of kind Event
GET /api/v1beta3/events

# list or watch objects of kind LimitRange
GET /api/v1beta3/limitranges

# replace the specified Node
PUT /api/v1beta3/minions/{name}/status
```

2. /api/v1beta3/namespaces

```bash
# list or watch objects of kind Namespace
GET /api/v1beta3/namespaces

# create a Namespace
POST /api/v1beta3/namespaces

# create a Binding
POST /api/v1beta3/namespaces/{namespaces}/bindings

# list or watch objects of kind Endpoints
GET /api/v1beta3/namespaces/{namespaces}/endpoints

# create a Endpoints
POST /api/v1beta3/namespaces/{namespaces}/endpoints

# delete a Endpoints
DELETE /api/v1beta3/namespaces/{namespaces}/endpoints/{name}

# read the specified Endpoints
GET /api/v1beta3/namespaces/{namespaces}/endpoints/{name}

# partially update the specified Endpoints
PATCH /api/v1beta3/namespaces/{namespaces}/endpoints/{name}

# replace the specified Endpoints
PUT /api/v1beta3/namespaces/{namespaces}/endpoints/{name}

# list or watch objects of kind Event
GET /api/v1beta3/namespaces/{namespaces}/events

# create a Event
POST /api/v1beta3/namespaces/{namespaces}/events

# delete a Event
DELETE /api/v1beta3/namespaces/{namespaces}/events/{name}

# read the specified Event
GET /api/v1beta3/namespaces/{namespaces}/events/{name}

# partially update the specified Event
PATCH /api/v1beta3/namespaces/{namespaces}/events/{name}

# replace the specified Event
PUT /api/v1beta3/namespaces/{namespaces}/events/{name}

# list or watch objects of kind LimitRange
GET /api/v1beta3/namespaces/{namespaces}/limitranges

# create a LimitRange
POST /api/v1beta3/namespaces/{namespaces}/limitranges

# delete a LimitRange
DELETE /api/v1beta3/namespaces/{namespaces}/limitranges/{name}

# read the specified LimitRange
GET /api/v1beta3/namespaces/{namespaces}/limitranges/{name}

# partially update the specified LimitRange
PATCH /api/v1beta3/namespaces/{namespaces}/limitranges/{name}

# replace the specified LimitRange
PUT /api/v1beta3/namespaces/{namespaces}/limitranges/{name}

# list or watch objects of kind PersistentVolumeClaim
GET /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims

# create a PersistentVolumeClaim
POST /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims

# delete a PersistentVolumeClaim
DELETE /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims/{name}

# read the specified PersistentVolumeClaim
GET /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims/{name}

# partially update the specified PersistentVolumeClaim
PATCH /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims/{name}

# replace the specified PersistentVolumeClaim
PUT /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims/{name}

# replace the specified PersistentVolumeClaim
PUT /api/v1beta3/namespaces/{namespaces}/persistentvolumeclaims/{name}/status

# list or watch objects of kind Pod
GET /api/v1beta3/namespaces/{namespaces}/pods

# create a Pod
POST /api/v1beta3/namespaces/{namespaces}/pods

# delete a Pod
DELETE /api/v1beta3/namespaces/{namespaces}/pods/{name}

# read the specified Pod
GET /api/v1beta3/namespaces/{namespaces}/pods/{name}

# partially update the specified Pod
PATCH /api/v1beta3/namespaces/{namespaces}/pods/{name}

# replace the specified Pod
PUT /api/v1beta3/namespaces/{namespaces}/pods/{name}

# create a Binding
POST /api/v1beta3/namespaces/{namespaces}/pods/{name}/binding


GET /api/v1beta3/namespaces/{namespaces}/pods/{name}/log read the specified PodLogOptions


PUT /api/v1beta3/namespaces/{namespaces}/pods/{name}/status replace the specified Pod


GET /api/v1beta3/namespaces/{namespaces}/replicationcontrollers list or watch objects of kind ReplicationController


POST /api/v1beta3/namespaces/{namespaces}/replicationcontrollers create a ReplicationController


DELETE /api/v1beta3/namespaces/{namespaces}/replicationcontrollers/{name} delete a ReplicationController


GET /api/v1beta3/namespaces/{namespaces}/replicationcontrollers/{name} read the specified ReplicationController


PATCH /api/v1beta3/namespaces/{namespaces}/replicationcontrollers/{name} partially update the specified ReplicationController


PUT /api/v1beta3/namespaces/{namespaces}/replicationcontrollers/{name} replace the specified ReplicationController


GET /api/v1beta3/namespaces/{namespaces}/resourcequotas list or watch objects of kind ResourceQuota


POST /api/v1beta3/namespaces/{namespaces}/resourcequotas create a ResourceQuota


DELETE /api/v1beta3/namespaces/{namespaces}/resourcequotas/{name} delete a ResourceQuota


GET /api/v1beta3/namespaces/{namespaces}/resourcequotas/{name} read the specified ResourceQuota


PATCH /api/v1beta3/namespaces/{namespaces}/resourcequotas/{name} partially update the specified ResourceQuota


PUT /api/v1beta3/namespaces/{namespaces}/resourcequotas/{name} replace the specified ResourceQuota


PUT /api/v1beta3/namespaces/{namespaces}/resourcequotas/{name}/status replace the specified ResourceQuota


GET /api/v1beta3/namespaces/{namespaces}/secrets list or watch objects of kind Secret


POST /api/v1beta3/namespaces/{namespaces}/secrets create a Secret


DELETE /api/v1beta3/namespaces/{namespaces}/secrets/{name} delete a Secret


GET /api/v1beta3/namespaces/{namespaces}/secrets/{name} read the specified Secret


PATCH /api/v1beta3/namespaces/{namespaces}/secrets/{name} partially update the specified Secret


PUT /api/v1beta3/namespaces/{namespaces}/secrets/{name} replace the specified Secret


GET /api/v1beta3/namespaces/{namespaces}/services list or watch objects of kind Service


POST /api/v1beta3/namespaces/{namespaces}/services create a Service


DELETE /api/v1beta3/namespaces/{namespaces}/services/{name} delete a Service


GET /api/v1beta3/namespaces/{namespaces}/services/{name} read the specified Service


PATCH /api/v1beta3/namespaces/{namespaces}/services/{name} partially update the specified Service


PUT /api/v1beta3/namespaces/{namespaces}/services/{name} replace the specified Service


DELETE /api/v1beta3/namespaces/{name} delete a Namespace


GET /api/v1beta3/namespaces/{name} read the specified Namespace


PATCH /api/v1beta3/namespaces/{name} partially update the specified Namespace


PUT /api/v1beta3/namespaces/{name} replace the specified Namespace


PUT /api/v1beta3/namespaces/{name}/finalize replace the specified Namespace


PUT /api/v1beta3/namespaces/{name}/status replace the specified Namespace


GET /api/v1beta3/nodes list or watch objects of kind Node


POST /api/v1beta3/nodes create a Node


DELETE /api/v1beta3/nodes/{name} delete a Node


GET /api/v1beta3/nodes/{name} read the specified Node


PATCH /api/v1beta3/nodes/{name} partially update the specified Node


PUT /api/v1beta3/nodes/{name} replace the specified Node


PUT /api/v1beta3/nodes/{name}/status replace the specified Node


GET /api/v1beta3/persistentvolumeclaims list or watch objects of kind PersistentVolumeClaim


GET /api/v1beta3/persistentvolumes list or watch objects of kind PersistentVolume


POST /api/v1beta3/persistentvolumes create a PersistentVolume


DELETE /api/v1beta3/persistentvolumes/{name} delete a PersistentVolume


GET /api/v1beta3/persistentvolumes/{name} read the specified PersistentVolume


PATCH /api/v1beta3/persistentvolumes/{name} partially update the specified PersistentVolume


PUT /api/v1beta3/persistentvolumes/{name} replace the specified PersistentVolume


PUT /api/v1beta3/persistentvolumes/{name}/status replace the specified PersistentVolume


GET /api/v1beta3/pods list or watch objects of kind Pod


DELETE /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name} proxy DELETE requests to Pod


GET /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name} proxy GET requests to Pod


POST /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name} proxy POST requests to Pod


PUT /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name} proxy PUT requests to Pod


DELETE /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name}/{path:*} proxy DELETE requests to Pod


GET /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name}/{path:*} proxy GET requests to Pod


POST /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name}/{path:*} proxy POST requests to Pod


PUT /api/v1beta3/proxy/namespaces/{namespaces}/pods/{name}/{path:*} proxy PUT requests to Pod


DELETE /api/v1beta3/proxy/namespaces/{namespaces}/services/{name} proxy DELETE requests to Service


GET /api/v1beta3/proxy/namespaces/{namespaces}/services/{name} proxy GET requests to Service


POST /api/v1beta3/proxy/namespaces/{namespaces}/services/{name} proxy POST requests to Service


PUT /api/v1beta3/proxy/namespaces/{namespaces}/services/{name} proxy PUT requests to Service


DELETE /api/v1beta3/proxy/namespaces/{namespaces}/services/{name}/{path:*} proxy DELETE requests to Service


GET /api/v1beta3/proxy/namespaces/{namespaces}/services/{name}/{path:*} proxy GET requests to Service


POST /api/v1beta3/proxy/namespaces/{namespaces}/services/{name}/{path:*} proxy POST requests to Service


PUT /api/v1beta3/proxy/namespaces/{namespaces}/services/{name}/{path:*} proxy PUT requests to Service


DELETE /api/v1beta3/proxy/nodes/{name} proxy DELETE requests to Node


GET /api/v1beta3/proxy/nodes/{name} proxy GET requests to Node


POST /api/v1beta3/proxy/nodes/{name} proxy POST requests to Node


PUT /api/v1beta3/proxy/nodes/{name} proxy PUT requests to Node


DELETE /api/v1beta3/proxy/nodes/{name}/{path:*} proxy DELETE requests to Node


GET /api/v1beta3/proxy/nodes/{name}/{path:*} proxy GET requests to Node


POST /api/v1beta3/proxy/nodes/{name}/{path:*} proxy POST requests to Node


PUT /api/v1beta3/proxy/nodes/{name}/{path:*} proxy PUT requests to Node


GET /api/v1beta3/redirect/namespaces/{namespaces}/pods/{name} redirect GET request to Pod


GET /api/v1beta3/redirect/namespaces/{namespaces}/services/{name} redirect GET request to Service


GET /api/v1beta3/redirect/nodes/{name} redirect GET request to Node


GET /api/v1beta3/replicationcontrollers list or watch objects of kind ReplicationController


GET /api/v1beta3/resourcequotas list or watch objects of kind ResourceQuota


GET /api/v1beta3/secrets list or watch objects of kind Secret


GET /api/v1beta3/services list or watch objects of kind Service


GET /api/v1beta3/watch/endpoints watch individual changes to a list of Endpoints


GET /api/v1beta3/watch/events watch individual changes to a list of Event


GET /api/v1beta3/watch/limitranges watch individual changes to a list of LimitRange


GET /api/v1beta3/watch/namespaces watch individual changes to a list of Namespace


GET /api/v1beta3/watch/namespaces/{namespaces}/endpoints watch individual changes to a list of Endpoints


GET /api/v1beta3/watch/namespaces/{namespaces}/endpoints/{name} watch changes to an object of kind Endpoints


GET /api/v1beta3/watch/namespaces/{namespaces}/events watch individual changes to a list of Event


GET /api/v1beta3/watch/namespaces/{namespaces}/events/{name} watch changes to an object of kind Event


GET /api/v1beta3/watch/namespaces/{namespaces}/limitranges watch individual changes to a list of LimitRange


GET /api/v1beta3/watch/namespaces/{namespaces}/limitranges/{name} watch changes to an object of kind LimitRange


GET /api/v1beta3/watch/namespaces/{namespaces}/persistentvolumeclaims watch individual changes to a list of

PersistentVolumeClaim


GET /api/v1beta3/watch/namespaces/{namespaces}/persistentvolumeclaims/{name} watch changes to an object of kind

PersistentVolumeClaim


GET /api/v1beta3/watch/namespaces/{namespaces}/pods watch individual changes to a list of Pod


GET /api/v1beta3/watch/namespaces/{namespaces}/pods/{name} watch changes to an object of kind Pod


GET /api/v1beta3/watch/namespaces/{namespaces}/replicationcontrollers watch individual changes to a list of ReplicationController


GET /api/v1beta3/watch/namespaces/{namespaces}/replicationcontrollers/{name} watch changes to an object of kind

ReplicationController


GET /api/v1beta3/watch/namespaces/{namespaces}/resourcequotas watch individual changes to a list of ResourceQuota


GET /api/v1beta3/watch/namespaces/{namespaces}/resourcequotas/{name} watch changes to an object of kind ResourceQuota


GET /api/v1beta3/watch/namespaces/{namespaces}/secrets watch individual changes to a list of Secret


GET /api/v1beta3/watch/namespaces/{namespaces}/secrets/{name} watch changes to an object of kind Secret


GET /api/v1beta3/watch/namespaces/{namespaces}/services watch individual changes to a list of Service


GET /api/v1beta3/watch/namespaces/{namespaces}/services/{name} watch changes to an object of kind Service


GET /api/v1beta3/watch/namespaces/{name} watch changes to an object of kind Namespace


GET /api/v1beta3/watch/nodes watch individual changes to a list of Node


GET /api/v1beta3/watch/nodes/{name} watch changes to an object of kind Node


GET /api/v1beta3/watch/persistentvolumeclaims watch individual changes to a list of PersistentVolumeClaim


GET /api/v1beta3/watch/persistentvolumes watch individual changes to a list of PersistentVolume


GET /api/v1beta3/watch/persistentvolumes/{name} watch changes to an object of kind PersistentVolume


GET /api/v1beta3/watch/pods watch individual changes to a list of Pod


GET /api/v1beta3/watch/replicationcontrollers watch individual changes to a list of ReplicationController


GET /api/v1beta3/watch/resourcequotas watch individual changes to a list of ResourceQuota


GET /api/v1beta3/watch/secrets watch individual changes to a list of Secret


GET /api/v1beta3/watch/services watch individual changes to a list of Service

```
