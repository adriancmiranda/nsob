var is = require('./source/types');
var assignStrategy;
var objectAssessor = /\[(["']?)([^\1]+?)\1?\]/g;
var startWithDot = /^\./;
var spaces = /\s/g;

function dotStrategy(value, target) {
  if (Array.isArray(target)) {
    return target.concat(value);
  }
  if (is.obj(target) && is.obj(value)) {
    return assign(target, value);
  }
  return value;
}

function replacer(match, p1, p2) {
  return (isNaN(p2) ? ' ' : '.') + p2;
}

function ls(path) {
  var keys = path.replace(spaces, '').replace(objectAssessor, replacer);
  keys = keys.replace(startWithDot, '').split(spaces);
  keys = keys.length > 1 ? keys.filter(String) : keys[0].split('.');
  return keys;
}

function write(target, path, value, strategy){
  var id = 0,
  dot = target,
  opath = path,
  keys = ls(path),
  total = keys.length - 1;
  while (id < total) {
    path = keys[id++];
    if (!is.objectLike(target[path])) {
      target = target[path] = {};
    } else {
      target = target[path];
    }
  }
  path = keys[id];
  if (is.undef(value)) delete target[path];
  else (target[path] = strategy(value, target[path], opath, keys));
  return dot;
}

function read(target, path){
  var id = 0,
  keys = ls(path),
  total = keys.length;
  while ((target = target[keys[id++]]) && id < total) {}
  return id < total ? void(0) : target;
}

function assign(target){
  var args = Array.prototype.slice.call(arguments),
  output = Object(target || {});
  for (var ix = 1, from, keys; ix < args.length; ix++) {
    from = args[ix];
    keys = Object.keys(Object(from));
    for (var iy = 0, key; iy < keys.length; iy++) {
      key = keys[iy];
      if (Array.isArray(from[key])) {
        from[key] = from[key].slice();
      }
      write(output, key, from[key], assignStrategy);
    }
  }
  return output;
}

function getCfg(target, copy) {
  target = copy ? assign({}, target) : target;
  delete target.namespace;
  delete target.cfg;
  delete target.exe;
  return target;
}

function uri(target, defaultStrategy) {
  assignStrategy = defaultStrategy;
  return function cfg(key, value, strategy) {
    var hasValue = arguments.length > 1;
    if (!key || key === true) return getCfg(target, key);
    if (is.objectLike(key)) return assign(target, key);
    strategy = is.defined(value) && is.fn(strategy) ? strategy : defaultStrategy;
    return hasValue ? write(target, key, value, strategy) : read(target, key);
  };
}

function run(scope) {
  return function result(key) {
    var piece = read(scope, key);
    var params = Array.prototype.slice.call(arguments, 1);
    return is.fn(piece) ? piece.apply(scope, params) : piece;
  };
}

function stub(namespace, target, strategy) {
  if (is.objectLike(namespace)) {
    strategy = target;
    target = namespace;
  } else {
    target = is.objectLike(target) ? target : global;
    target = target[namespace] = target[namespace] || {};
    target.namespace = namespace;
  }
  target.cfg = uri(target, is.fn(strategy) ? strategy : dotStrategy);
  target.exe = run(target);
  return target;
}

stub.strategy = dotStrategy;
stub.assign = assign;

module.exports = stub;
