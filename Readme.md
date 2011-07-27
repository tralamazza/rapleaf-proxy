# Proxy and Webservice application for RapLeaf API

  I wrote this app primarily to learn more about [mongodb](http://www.mongodb.org), [node.js](http://nodejs.org), [rapleaf's API](https://www.rapleaf.com/developers/api_docs/personalization/direct) and [webservice.js](https://github.com/marak/webservice.js).
This proxy allows me to implement a simple idea on top of RafLeaf's API: add the time dimension.
Manipulating historical data allows us to ask things like "who changed country in the last year" or "list me recent graduates", the (weird) list of possibilities goes on.

## Proxy

  Implemented using node-http-proxy, this proxy is a http <-> https proxy. If you require a https proxy server make sure you have a certificate key par before changing the source code.
  Every successful response gets recorded on a mongodb database, which is later queried by our webservice layer.

## Webservice.js

  A dead simple webservice.js based implementation. This node module provides a free dynamic documentation page which can be accessed via browser at `http://localhost:8080/docs`.

## MongoDB

  Honestly I could have used about anything to store this data. I chose mongo out of curiosity and because it has builtin MapReduce (check `lib/module.js` for fields_count).

## Installation

  Github is more like a backup to me, but if you insist here is how you get this thing running:

  * Install mongodb (default settings)
  * Get this project source code and go to its folder
  * Install the dependencies `npm install -d`
  * Run `node app.js` and start making rapleaf calls to your http://localhost:8081
  * Open your browser at http://localhost:8080
