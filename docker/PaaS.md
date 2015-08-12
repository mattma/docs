1. Amazon Web Services (AWS) Elastic Beanstalk (EB)

a service to deploy your code. This easy-to-use service works as a Platform as a Service (PaaS). It supports familiar web applications, such as PHP, Node.js, Ruby, Python, Java and .Net. You can simply choose your software stack and upload your code. AWS will take care of the provisioning of the environment, deploying the code, load balancing, auto scaling, and health monitoring. At the end of the process, it prints a url used to access the application.

Here are the three ways to deploying docker containers:

- Create a Dockerfile and upload it to EB.

- Create a Dockerrun.aws.json file to deploy an existing Docker image.

- Create a zip file with Dockerfile, Dockerrun.aws.json, and any application file, then upload to EB.

Credit: [10 Steps Deploying Docker Containers on Elastic Beanstalk](http://blog.flux7.com/blogs/docker/10-steps-deploying-docker-containers-on-elastic-beanstalk)


[Drone](https://drone.io/)

One of the more promising CI/CD tools being developed on top of Docker is Drone.
Drone is a SAAS continuous integration platform that connects to GitHub, Bitbucket,
and Google Code repositories written in a wide variety of languages, including
Python, Node.js, Ruby, Go, and numerous others. It runs the test suites
of repositories added to it inside a Docker container.

Shippable
Shippable is a free, hosted continuous integration and deployment service for
GitHub and Bitbucket. It is blazing fast and lightweight, and it supports Docker
natively.
