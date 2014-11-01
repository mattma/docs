# [Mockgoose](https://github.com/mccormicka/Mockgoose)

Mockgoose is a simplified in memory database that allows you to perform actions on Mongoose Models without having a running instance of MongoDB. It mock out your mongoose database during testing so that you do not have to spin up a new database for every test and teardown that same database afterwards.

## Usage

```js
    var mongoose = require('mongoose');
    var mockgoose = require('mockgoose');
    // all calls to connect() and createConnection()
    // will be intercepted by Mockgoose
    // No MongoDB instance is created.
    mockgoose(mongoose);
```

- Supported Events:

```js
    "connecting"
    "connected"
    "open"
    "error"
```

- Supported model operations are:

```js
    save()
    create()
    remove()
    count()
    find()
    findById()
    findByIdAndRemove()
    findByIdAndUpdate()
    findOne()
    findOneAndRemove()
    findOneAndUpdate()
    Update()
```

- Supported Operatorse

```js
    $
    $addToSet
    $all
    $and
    $elemMatch
    $exists
    $gt
    $gte
    $in
    $inc
    $lt
    $lte
    $ne
    $nin
    $nor
    $not
    $or
    $pull
    $pullAll
    $push
    $pushAll
    $regex
    $set
    $setOnInsert
    $unset
```

- Supported Options

```js
    multi : 0/1 defaults to 0
    upsert : true/false defaults to false
    sort : one level of sorting for find operations {sort: {name:1}}
    skip
    limit
```
- support for validators and the unique field key

## Note

Mockgoose comes with a reset() method to clean up DB

```js
    // Delete all the collections and models in the database
    mockgoose.reset()
    // Delete all the associated models for a schema
    // schema_name is Case sensitive
    mockgoose.reset('schema_name')
```
