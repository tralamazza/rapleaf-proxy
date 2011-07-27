# Proxy and Webservice application for RapLeaf API

  I wrote this app primarily to learn more about mongodb, node.js, rapleaf's API and webservice.js.
This proxy allows me to implement a simple idea on top of RafLeaf's API: add the time dimension.
Manipulating historical data allows us to ask things like "who changed country in the last year" or "list me recent graduates", the (weird) list of possibilities goes on.

## Proxy

  Implemented using node-http-proxy, this proxy is a https <-> https proxy which requires a certificate key par. If you don't require a https server changing the code is easy.
  Every successful response gets recorded on a mongodb database, which is later queried by our webservice layer.

## Webservice.js

  A dead simple webservice.js based implementation. This node module provides a free dynamic documentation page which can be accessed via browser on `http://localhost:8080/docs`.

## MongoDB

  Honestly I could have used about anything to store this data. I chose mongo out of curiosity and because it has builtin MapReduce.

## What now ?

  Get the source code, go to its folder and install the dependencies first `npm install -d`, after that simply call `node app.js`.
