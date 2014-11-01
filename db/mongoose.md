Mongoose as an ODM (Object-Document Modeler), is all about having a data model, and bringing control and management of that model into your application. Mongoose enables you to create a rich data structure, with a level of database management that you don't normally get with MongoDB.

Mongoose is an object modeling tool (define in one place) for MongoDB and Node.js. Mongoose is primarily useful when you want to interact with structured data in MongoDB. It allows you to define a schema for your data, Mongoose also returns the data to you as a JSON object that you can use directly, rather than the JSON string returned by MongoDB.

- Indexes
  - Mongoese Cornerstone
    - schema
    - model
  - Mongoose Guide

## Mongoese Cornerstone

1. Schemas: describing the data construct of a document
2. Models

### 1. Defining your schema

Everything in Mongoose starts with a Schema (describe the structure of data). Each schema maps to a MongoDB collection and defines the shape of the documents within that collection. This schema defines the name of each item of data, and the type of data (string, number, date, Boolean, and so on). In most scenarios you would have one schema for each collection within the database. can also be extended with helper functions and additional methods.

    var blogSchema = new mongoose.Schema({
      title:  String,
      author: String,
      body:   String,
      comments: [{ body: String, date: Date }],
      date: { type: Date, default: Date.now },
      hidden: Boolean,
      meta: {
        votes: Number,
        favs:  Number
      }
    });

**Schemas not only define the structure of your document and casting of properties, they also define document instance methods, static Model methods, compound indexes and document lifecycle hooks called middleware. Mongoose also offers the option of extending it with custom SchemaTypes.**

Data type allowed in schemas:

- String      :UTF-8 by default
- Number   :not support long and double, but mongodb does
- Date        :return an ISODate object
- Boolean
- Buffer      :storing binary information
- ObjectId  :assign a unique identifier to a key other than _id
- Mixed      :contain any type of data, problem: Changes to data of mixed type cannot be automatically detected by Mongoose
- Array       :two ways: 1. simple array of values of the same data type.  2. store a collection of subdocuments using nested schemas. If you declare an empty array it will be treated as mixed type,)

#### Schema methods and types

Ex: each document will be a kitten with properties and behaviors as declared in schema (kittySchema).

    var kittySchema = mongoose.Schema({
        name: String
    });

* Schema Instance methods ( Methods for instance )

**Instance methods must be added to the schema before compiling it with mongoose.model()**. Functions added to the methods property of a schema get compiled into the Model prototype and exposed on each document instance. In this case, `speak`

    kittySchema.methods.speak = function () {
      var greeting = this.name ? "Meow name is " + this.name : "I don't have a name"
      console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema);

    var fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak();  // "Meow name is fluffy"
    Kitten.find({ name: /^Fluff/ }, cb);

* Schema Statics methods  ( Methods for class )

Define your own static methods: Adding it to the statics collection of the schema

Do this after the schema is declared, but before the model is compiled. After the model is compiled, you will be able to use your new static method in the same way that you use the pre-built methods.

    projectSchema.statics.findByUserID = function (userid, callback) {
      this.find({ createdBy: userid }, '_id projectName', {sort: 'modifiedOn'}, callback);
    }

This creates a new model method for us, so that we will now be able to call `Model.findByUserID(userid,callback)` in the same way that we called `Model.findOne` when creating the login functionality earlier.

Aother Example: assign a function to the "statics" object of our animalSchema

    animalSchema.statics.findByName = function (name, cb) {
      this.find({ name: new RegExp(name, 'i') }, cb);
    }

    var Animal = mongoose.model('Animal', animalSchema);
    Animal.findByName('fido', function (err, animals) {
      console.log(animals);
    });

* Schema Indexes

MongoDB supports secondary indexes. With mongoose, we define these indexes within our Schema at 1. path level or 2. schema level. Defining indexes at the schema level is necessary when creating compound indexes.

    var animalSchema = new Schema({
      name: String,
      type: String,
      tags: { type: [String], index: true } // 1. path level
    });

    animalSchema.index({ name: 1, type: -1 }); // 2. schema level

#### Schema Tips:

* Modifying an existing schema

don't have to refactor the database or take it offline while we upgrade the schema, we simply add a couple of entries to the Mongoose schema. If a key requested in the schema doesn't exist, neither Mongoose nor MongoDB will throw errors, Mongoose will just return null values. When saving the MongoDB documents, the new keys and values will be added and stored as required. If the value is null, then the key is not added.

Schema#add: add additional keys later

* Mixed: Mongoose exposes a method called markModified to do just this, passing it the path of the data object that
has changed

    dj.mixedUp = { valueone: "a new value" };
    dj.markModified('mixedUp');
    dj.save();

* __v  :inside mongodb collection

the internal versioning number automatically set by Mongoose when a document is created. It doesn't increment when a document is changed, but instead is automatically incremented whenever an array within the document is updated in such a way that might cause the indexed position of some of the entries to have changed.

Why is this needed? When working with an array you will typically access the individual elements through their positional index, for example, myArray[3]. But what happens if somebody else deletes the element in myArray[2] while you are editing the data in myArray[3]? Your original data is now contained in myArray[2] but you don't know this, so you quite happily overwrite whatever data is now stored in myArray[3]. The `__v` gives you a method to be able to sanity check this, and prevent this scenario from happening.

### 2. Defining your model

A model is a class with which construct documents and a compiled version of the schema. Instances of Models are documents. A single instance of a model maps directly to a single document in the database. With this 1:1 relationship, it is the model that handles all document interaction — creating, reading, saving, and deleting. Documents have many built-in instance methods or define custom document instance methods.

Ex: Creating a User instance based on the schema (userSchema) is a one line task:

    var User = mongoose.model('User', userSchema);

#### Model Tips

* Setting up your routes is to have one routes file for each Mongoose model.

* `_id` is an SchemaType (ObjectId) that is unique and automatically added by Mongoose. You can also access a string representation of it by removing the underscore. ex:`console.log('id of saved user: ' + user.id)`

* A document in a Mongoose collection is a single instance of a model.

Four CRUD (Create, Read, Update, and Delete) operations model instance methods: if we have a model called User, some of the methods provided by Mongoose are

    User.create(dataObject,callback)
    User.find
    User.update
    User.remove

1. User.create(dataObject,callback)

combines `new` and `save` operations into one command. This method takes two parameters. First is the
data object, and the second is the callback function that is to be executed after the instance has been saved to the database.

User.save method is an example of an instance method, because it operates directly on the instance, rather than the model.

* Model Naming

When choosing your model name (The collection name defaults to a pluralization of the Mongoose model name.), Unless specified, the MongoDB collection will be a pluralized (lowercase) version of the model name. See the following for example:

    mongoose.model( 'User', userSchema );

reference a collection called users. If the collection doesn't exist it will create it the first time a document is saved using the model.

There are two ways of specifying a different collection name, 1. the schema declaration or 2. the model command

1. Overriding the collection name in the schema

To specify a collection name when defining a schema you need to send a second argument to the `new mongoose.Schema` call.

    var userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique:true }
    }, {
      collection: 'myuserlist'
    });

2. Overriding the collection name in the model

To specify the collection name when building a model you send a third argument to the `mongoose.model` command.

    mongoose.model( 'User', userSchema, 'myuserlist' );

## Mongoese Guide

### Connection

Two methods of creating a Mongoose connection to a MongoDB database. create a connection when your application starts and keep it open to be re-used.

1. mongoose.createConnection                  :to access multiple dbs
2. mongoose.connect(dbURI, dbOptions)    :to access one db

### Example

* Login use case

If user login, save it into the session ( via Express ) to store some useful information about the current user, then redirect the visitor to the user profile page */user*. Inside updating the Success section of our callback

    console.log("User created and saved: " + user);
    req.session.user = {
      "name" : user.name, "email": user.email, "_id": user._id
    };
    req.session.loggedIn = true;
    res.redirect( '/user' );

Next add the new export function to routes/user.js: // GET logged in user page

    exports.index = function (req, res) {
      if(req.session.loggedIn === true){
        res.render('user-page', {
          name: req.session.user.name,
          email: req.session.user.email,
          userID: req.session.user._id
        })
      }else{
        res.redirect('/login');
      }
    }

### Query MongoDB

#### Find: Query builder or Single query

1. Using QueryBuilder

build up the query over multiple steps before executing it at a certain point in your code.

    User.find({'name' : 'Simon Holmes'})
      .where('age').gt(18)
      .sort('-lastLogin')
      .select('_id name email')
      .exec(function (err, users){
        if (!err){
          console.log(users); // output array of users found
        }
      });

looking for all users whose name is "Simon Holmes" and who are older than 18 years. We want to order them by lastLogin in a descending order (that is, most recent first), and only return the three document fields _id, name, and email.

2. Using Single query

    Model.find(query)             return an array of instances matching the query
    Model.findOne(query)       return the first instance found that matches the query
    Model.findById(ObjectID)  return a single instance matching the given ObjectID

* Model.find(conditions, [fields], [options], [callback])

Note: fields and options are both optional, but if you want to specify options then you must specify fields, even if you send it as null.

Mongoose will run the callback function when the operation has been completed. If no callback function is defined then the query will not be executed. It can however be called explicitly by using the .exec() method we saw earlier.

    User.find( {'name' : 'Simon Holmes'}, '_id name email', function (err, users){
      if (!err){console.log(users); }
    });

using the options to specify a sort order by lastLogin descending, returning all fields in model by passing `null`

    User.find( {'name' : 'Simon Holmes'}, null, { sort: {lastLogin: -1} }, function (err, users){
      if (!err){console.log(users); }
    });

Note: once we have retrieved the Mongoose data object from a query, use Express res.json() method to return this response as JSON

#### Update

There are three static methods for updating data

    Model.update(query)              updates matching documents in the database without returning them
    Model.findOneAndUpdate(query)  like`findOne`, but writes the updates to DB before return the found instance to the callback
    Model.findByIdAndUpdate(ObjectID)  like `findOneAndUpdate`, but expects a unique ID instead of query object

Each of these methods can take the following four arguments:

1. conditions: the query conditions (or _id for findByIdAndUpdate) used to find documents to update
2. update: an object containing the fields and values to set
3. options: an object specifying options for this operation
4. callback: function to run after a successful operation

The options differ depending on the call made. update() method has one set of options you can set, and findOneAndUpdate(), findByIdAndUpdate() share another set of options.

**update() options are as follows:**

1. safe: Specifies whether errors should be returned to the callbacks. Can be true or false, the default value is the value set in the schema, if this was not explicitly set in the schema it defaults to true.

2. upsert:  Specifies whether to create the document if no matching document exists. Can be true or false, the default value is false.
3. multi:    Specifies whether multiple documents should be updated. Can be true or false, the default value is false.
4. strict:    Specifies whether only data defined in the schema will be saved, regardless of whether anything additional was passed to the model constructor. Can be true or false, the default value is true.

**findByIdAndUpdate() and findOneAndUpdate() options are as follows:**

1. new:     Specifies whether to return the modified document rather than the original. Can be true or false, the default value is true.
2. upsert:  Specifies whether to create the document if it doesn't exist. Can be true or false, the default value is false.
3. sort:      If some documents are found, sets the sort order to choose which one to update. This should be a JavaScript object.
4. select:   This sets the document fields to return. This is specified as a string.

**Which method to choose**

Rule of thumb is to only use update() when intentionally updating multiple documentsin one operation. Remember to set `{ multi: true }`in the options. Although in some cases you may decide to use it for updating a single document when you don't need to use a return object.

If you are going to use the data after updating, I recommend using one of the find methods. This will ensure that what you're using in your application is exactly what is in the database, so any problems can be quickly identified.

**The catch**

Any default values, validation, middleware, or setters applied to your schema will not be applied. So, whenever you want to use any of these things, you'll have to go back to a standard practice of find document, modify the data, and then save it.

#### Save

save() accepts only one parameter, a callback function to run once the save has completed. This callback function can pass an error or return the saved object.

    user.save(function (err) {
      if(!err){
        console.log('User updated: ' + req.body.FullName);
        req.session.user.name = req.body.FullName;
        req.session.user.email = req.body.Email;
        res.redirect( '/user' );
      }
    });

We need to use the three-step approach:  1. Find our user by the unique ID held in the session.  2. Change the name and e-mail to the values sent in the form.  3. Save the changes.

#### Delete

    Model.remove(query)        deletes one or more documents from the collection
    Model.findOneAndRemove(query)
              finds a single document based on a query object and removes it, passing it to the callback function on successful completion
    Model.findByIdAndRemove(ObjectID)  like `findOneAndRemove`, except that it finds a document based on a provided document ID

remove() method can be used in two ways: 1. as a model method, or 2. as an instance method.

1. As a model method, pass it a query object and it will remove the matching documents.

    User.remove({ name : /Simon/ } , function (err){
      if (!err){ // all users with 'Simon' in their name were deleted }
    });

2. As an instance method, operate it after a find operation once you have results returned.

Be careful when using Model.remove(). If you specify an empty query or just a callback — like you would when using the instance method — then all the documents in the collection will be removed.

Both findByIdAndRemove() and findOneAndRemove() methods accept options and can return the deleted document to the callback

    findByIdAndRemove(QueryObject, Options, Callback)

- QueryObject: a document to find and remove.
- Options: an object options
  1. sort: set the sort order in case multiple docs are found
  2. select: set the document fields to return in the object to the callback
- Callback: This optional parameter This returns either an error or the deleted document.

    User.findOneAndRemove( {name : /Simon/},{sort : 'lastLogin', select : 'name email'}, function (err, user){
      if (!err) { console.log(user.name + " removed"); } // Simon Holmes removed
    });






Validation

{ unique: true} part is a type of validation that Mongoose passes directly
through to MongoDB.

- All SchemaTypes
{ required: true }  # return a validation error if no data is given to a data object with this property.

 - Number SchemaType
min and max validators  ex: age : {type: Number, min: 13, max:19}

- String SchemaType
• match: This validator is for matching against a regular expression
• enum: This validator is for checking against a provided list of possible values

day : {type: String, match: /^(mon|tues|wednes|thurs|fri)day$/i}
Here the enum validator will check that the string is one of the values in the
weekdays array:
var weekdays = ['monday', 'tuesday', 'wednesday', 'thursday',
'friday'];
var weekdaySchema = new Schema({
day : {type: String, enum: weekdays}
});

Validation Errors

The error object
will contain a top-level message and name, and a collection of specific errors.

Each
of these errors give an individual message, name, path, and type object.

Object in this format:

{ message: 'Validation failed',
name: 'ValidationError',
errors:
{ email:
{ message: 'Validator "required" failed for path email',
name: 'ValidatorError',
path: 'email',
type: 'required' },
name:
{ message: 'Validator "required" failed for path name',
name: 'ValidatorError',
path: 'name',
type: 'required' } } }


if(err){
Object.keys(err.errors).forEach(function(key) {
var message = err.errors[key].message;
console.log('Validation error for "%s": %s', key, message);
});
}


Custom Validation

Single function – no custom error message. specify
a function and return true if the validation is passed, and false if it fails.

For example, if we want our usernames to be at least five characters long, we can
create a function like the following:
var lengthValidator = function(val) {
if (val && val.length >= 5){
return true;
}
return false;
};
The function is then referenced in our schema using the validate key:
name: {type: String, required: true, validate: lengthValidator }


Returning a custom error message

This object has two entries:
• validator: This is your custom function
• msg: This is your custom error message

ex: validate: { validator: lengthValidator, msg: 'Too short' }



Validating a regular expression

var validateDay = [/^(mon|tues|wednes|thurs|fri)day$/i, 'Not a
day' ];

var weekdaySchema = new Schema({
day : {type: String,
    validate: {validator:
/^(mon|tues|wednes|thurs|fri)day$/i, msg: 'Not a day' }
});

or

day : {type: String, validate: validateDay }


As you can see, it's pretty easy to build up a set of re-usable validators and
apply them to your schemas. There is one more way of doing this, by using the
SchemaType methods:
userSchema.path('name').validate(lengthValidator, 'Too short');
userSchema.path('name').validate(/^[a-z]+$/i, 'Letters only');

// check to see wheather a user record with the supplied username already exist
userSchema.path('username').validate(function (value, respond) {
User.find({username: value}, function(err, users){
if (err){
console.log(err);
return respond(false);
}
console.log('Number found: ' + users.length);
if (users.length) {
respond(false); // validation failed
} else {
respond(true); // validation passed
}
})
}, 'Duplicate username');



concepts of population
and subdocuments, exploring how they are used like SQL join.

Population – references to other
collections

Population works by pulling information into the model you're currently using from
a second model. Unlike JOIN statements, these are actually separate queries. First
you retrieve your primary set of data from a collection, and once that is returned,
you "populate" the required data from a secondary collection.


The first step to setting up population is in the schema. Your primary schema links
to the referenced model by passing an object containing the name of the model to be
used and the SchemaType of the linked schema object.

var projectSchema = new mongoose.Schema({
...
// a one-to-one relationship between the User model
and the Project model
createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
// a one-to-many relationship
by specifying an array of objects
contributors: [ {type: mongoose.Schema.Types.ObjectId, ref: 'User'} ]
...
});


ObjectId, Number, String, and Buffer are valid SchemaTypes
for using as references. You only need to declare the full Schema.
Type path for ObjectId.

In MongoDB a document for this schema would look something like this:
{ "projectName" : "Population test",
"createdBy" : ObjectId("5126b7a1f8a44d1e32000001"),
"_id" : ObjectId("51ac2fc4c746ba1645000002"),
"contributors" : [
ObjectId("5126b7a1f8a44d1e32000001"),
ObjectId("5126b7a1f8a44d1e32000002") ] }

Usage:
To do this, you build a query, use the populate command, and then exec() when
ready


Project
.findById( req.params.id)
.populate('createdBy')
.exec(function(err,project) { ... })

Return something like below

{ __v: 0,
_id: 51b495e01e686ea360000002,
createdBy:
{ __v: 0,
_id: 5126b7a1f8a44d1e32000001,
email: 'simon@theholmesoffice.com',
lastLogin: Sun Aug 04 2013 07:34:21 GMT+0100 (BST),
modifiedOn: Sun Jul 28 2013 16:32:15 GMT+0100 (BST),
name: 'Simon Holmes',
createdOn: Fri Feb 22 2013 00:11:13 GMT+0000 (GMT) },
modifiedOn: Sun Jul 07 2013 16:21:50 GMT+0100 (BST),
projectName: 'Updated project schemas',
createdOn: Sun Jun 09 2013 15:49:04 GMT+0100 (BST) }

ex:

// want the name and e-mail of the
creator,
.populate('createdBy', 'name email')

// populate multiple paths in the parent schema at once
 .populate('createdBy contributors')

// return specific paths for each of the populated items
.populate('createdBy', 'name email')
.populate('contributors', 'name email')


Querying to return a subset of results
When populating data with a one-to-many relationship, you may well want to return
a subset just like you might with a standard find operation.

Mongoose does give you the option
of sending a query object for population, with the following parameters:

• path: This is the path to populate and is required.
• select: This is a string or object specifying which paths to return.
• model: This is the name of the model you want to populate from. It defaults
to the reference specified in the schema if not declared here.
• match: This can specify query conditions.
• options: This can specify query options.


ex: populate a maximum of five contributors who have an e-mail
address at theholmesoffice.com, to sort them by name and return name and
lastLogin information we could do the following:

.populate({
path: 'contributors',
match: { email: /@theholmesoffice\.com/i },
select: 'name lastLogin',
options: { limit: 5, sort: 'name' }
})
.exec()


Populating into multiple parent items
ex: If your query on the primary
collection returns multiple documents, you can easily populate into them See
the following example
Project
.find({ createdBy: userid }, 'projectName')
.populate('createdBy', 'name')
.exec(function(err,projects) {
projects.forEach(function (project) {
console.log(project.projectName + ' created by' + project.
createdBy.name);
});
});


Subdocuments

Subdocuments are very similar to the ordinary documents. They are individual documents with their own schema. The big difference is that
subdocuments are documents that are stored within a parent document, instead of a
MongoDB collection of their own.

ex:

var taskSchema = new mongoose.Schema({
taskName: { type: String, required: true, validate: validateLength
},
taskDesc: String,
createdOn: { type: Date, default: Date.now },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',
required: true},
modifiedOn: Date,
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



Each task subdocument created goes into the array of tasks as defined in the
projectSchema. Mongoose will automatically give each subdocument a
unique _id unless overridden in the schema.

{
"projectName" : "Project 2",
"tasks" : [
"taskName" : "A task please",
"taskDesc" : "A short description of the task",
"createdBy" : ObjectId("5126b7a1f8a44d1e32000001"),
"_id" : ObjectId("51ad7d6cfa492a174a000005"),
"createdOn" : ISODate("2013-06-04T05:38:52.847Z")
},
{
"createdBy" : ObjectId("5126b7a1f8a44d1e32000002"),
"_id" : ObjectId("51ad7d80fa492a174a000006"),
"createdOn" : ISODate("2013-06-04T05:39:12.728Z"),
"modifiedOn" : ISODate("2013-06-04T05:39:48.553Z"),
"taskDesc" : "A quick description of this one too",
"taskName" : "A secondary task"
}
]
}

When working with subdocuments we always
have to go through the parent document. We also need to remember that each
individual subdocument is a document in its own right, stored inside an array.


So if we want to add a new task to an existing project, we would need to:
1. Find the project in the database
2. Push a task object to the tasks path
3. Save the parent document.

The code to do this looks like the following:
Project.findById( req.body.projectID, 'tasks modifiedOn',
function (err, project) {
if(!err){
project.tasks.push({
taskName: req.body.taskName,
taskDesc: req.body.taskDesc,
createdBy: req.session.user._id
});
project.modifiedOn = Date.now();
project.save(function (err, project){
if(err){
console.log('Oh dear', err);
} else {
console.log('Task saved: ' + req.body.taskName);
res.redirect( '/project/' + req.body.projectID );
}
});
}
}
);



Snippets

$.ajax('/project/byuser/' + userID, {
    dataType: 'json',
    error: function(){
        console.log("ajax error :(");
    },
    success: function (data) {
        if (data.length > 0) {
            if (data.status && data.status === 'error'){
                strHTMLOutput = "<li>Error: " + data.error + "</li>";
            } else {
                // no errors, have data
            }
        }else{

        }
    }
});


exports.edit = function(req, res){
    if (req.session.loggedin !== "true"){
        res.redirect('/login');
    }
    else {
        res.render('user-form', {
            title: 'Edit profile',
            _id: req.session.user._id,
            name: req.session.user.name,
            email: req.session.user.email,
            buttonText: "Save"
        });
    }
};

// need to log out a user.
var clearSession = function(session, callback){
session.destroy();
callback();
};

req.session.user = { "name" : user.name, "email": user.email,
"_id": user._id };
req.session.loggedIn = true;
console.log('Logged in user: ' + user);
res.redirect( '/user' );
// Now when a user logs in we set the lastLogin date, but leave
everything else unchanged
User.update(
    {_id:user._id},
    { $set: {lastLogin: Date.now()} },
    function(){
        res.redirect( '/user' );
    });


Login action
The second step is to create the action itself. What we are aiming to achieve with this
action is as follows
1. Check that the Email field from the form exists and contains a value.
2. Try to find a database entry with that e-mail address.
3. If the user doesn't exist, then:
1. Send visitor back to the login screen.
4. If the user does exist, then:
1. Return their name, e-mail address, and unique ID.
2. Save the details to the session.
3. Output the user object to the console so that we can see what's
going on.
4. Redirect to the user profile page /user.


// POST login page
exports.doLogin = function (req, res) {
    if (req.body.Email) {
        User.findOne(
            { 'email' : req.body.Email },
            '_id name email',
            function(err, user) {
                if (!err) {
                    if (!user){
                        res.redirect('/login?404=user');
                    }else{
                        req.session.user = {
                            "name" : user.name,
                            "email": user.email,
                            "_id": user._id
                        };
                        req.session.loggedin = "true";
                        console.log('Logged in user: ' + user);
                        res.redirect( '/user' );
                    }
                };
                } else {
                    res.redirect('/login?404=error');
                }
            });
        };
    } else {
        res.redirect('/login?404=error');
    }
};



- Single-threaded versus multithreaded

Traditional stacks are generally multithreaded. This means that every new visitor or session is given a new thread, and these are never shared. One session's activity
generally doesn't impact another, until the server resources are exhausted.

Node is single-threaded. This means that every visitor or session is added to that
one thread. So it is possible for a two-second database write operation to hold up
every other user for two seconds.

- Blocking versus non-blocking code

Blocking: do one thing at a time.
In the single-threaded stack, you may have to respond to several people's requests
at the same time, so you can't afford to be stuck doing time-consuming operations
or waiting for someone else to do something.
The way to code this in JavaScript is to use callbacks
