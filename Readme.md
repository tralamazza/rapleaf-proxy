# Starts with a simple idea...

  This proxy allows me to implement a simple idea on top of RafLeaf's API: add the... (dramatic pause)... time dimension!. Put simply, I want to ask things about the past, present and future (scary!). Data evolves, people move, get old, kids etc. The possibilities are really cool.

## Components

 I wrote this app primarily to learn more about [mongodb](http://www.mongodb.org), [node.js](http://nodejs.org), [rapleaf's API](https://www.rapleaf.com/developers/api_docs/personalization/direct) and [webservice.js](https://github.com/marak/webservice.js).

### Proxy server

  Implemented using [node-http-proxy](https://github.com/nodejitsu/node-http-proxy), this simple proxy relays HTTP messages by default. Every successful request is recorded on a mongodb database, which is later queried by our webservice module.

### Webservice

  A dead simple webservice.js based implementation. This module provides a free dynamic documentation page which can be accessed via browser at `http://localhost:8080/docs`. You can run each method directly on your browser.

### MongoDB

  Honestly I could have used just about anything to store this data. I chose mongodb out of curiosity, plus it has MapReduce builtin (check `lib/module.js` for the *fields_count* function).


## Installation

  This pet project is obviously NOT production ready, if you want to try it out please follow the following steps:

  * Install mongodb (default settings)
  * `git clone git://github.com/tralamazza/rapleaf-proxy.git`
  * `cd rapleaf-proxy`
  * Install the dependencies `npm install -d`
  * Run `node app.js` and start making rapleaf calls to your http://localhost:8081
  * Point your browser to http://localhost:8080/docs


## License

See LICENSE