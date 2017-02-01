# Roland
[![Build Status](https://travis-ci.org/hex22a/roland.svg?branch=master)](https://travis-ci.org/hex22a/roland)

**Roland** is a simple webapp to build and send e-mails. 

If you are building static web-site, you can deploy **Roland** wherever you want, 
then host your static web-site (or other client) at any static storage _(eg. Amazon S3, Dropbox, Selectel Cloud Storage etc.)_
All you need now is to send HTTP request to Roland and message will be sent ( or not 🙃 )

## Configuring
First take a look at [default.example.json](https://github.com/hex22a/roland/blob/master/config/default.example.json). Rename it to **default.json** and edit secret values.

Do the same manipulations with [test.example.json](https://github.com/hex22a/roland/blob/master/config/test.example.json).

## Dependencies
Well we depend on DB. RethinkDB.

[Get it here](https://www.rethinkdb.com/docs/install/ubuntu/)

Start RethinkDB

`$ rethinkdb`

This will create a directory with db-files and start RethinkDB server. DB dashboard will be available at [localhost:8080](http://localhost:8080)

## Starting App
`$ npm i` - to resolve dependencies

`$ npm start` - to start application

## Testing
Unit testing is powered by [Jest](https://github.com/facebook/jest).

`$ npm run test` - to run unit tests

You can also run

`$ npm run test:watch` - to run unit test in watch mode

Behaviour testing is powered by [Cucumber](https://github.com/cucumber/cucumber-js)

`$ npm run test:cucumber` - to run behaviour tests

## Contributing
PR are welcome 😉👍