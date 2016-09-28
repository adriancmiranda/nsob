# dotcfg

## Getting Started

### Install:

```bash
npm i -S adriancmiranda/dotcfg
```

or

```bash
bower i -S adriancmiranda/dotcfg
```

or yet

```bash
npm i -S dotcfg
```

### Usage:

```javascript
var ns = dotcfg([namespace:string][, scope:object][, defaultStrategy:function]):Object
ns.cfg([namespace:string][, value:*][, customStrategy:function]):*
```

```javascript
const dotcfg = require('dotcfg')('NS')
.cfg('env.url.host', process.env.HOST || '0.0.0.0') // { env:{ url:{ host:'0.0.0.0' } } }
.cfg('env.url.port', process.env.PORT || 3000) // { env:{ url:{ host:'0.0.0.0', port:3000 } } }
.cfg('resolve.extensions[1].name', '.js') // { resolve:{ extensions:{ '1': { name: '.js' } } } }
.cfg('watchOptions.pool', undefined); // { watchOptions:{} }

console.log(NS.cfg()); // { env:{ url:{ host:'0.0.0.0', port:3000 } } } }
console.log(NS.cfg('env')); // { url:{ host:'0.0.0.0', port:3000 } } }
console.log(NS.cfg('env.url')); // { host:'0.0.0.0', port:3000 }
console.log(NS.cfg('env.url.host')); // '0.0.0.0'
console.log(NS.cfg('resolve.extensions[1]')); // { name:'.js' }
console.log(NS.resolve.extensions[1].name); // '.js'
```
