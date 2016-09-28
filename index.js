(function(global, name, factory){
	'use strict';
	if(typeof module === 'object' && typeof module.exports === 'object'){
		module.exports = factory(global, exports, name);
	}else if(typeof define === 'function' && define.amd){
		define(['exports'], function(exports){
			return factory(global, exports, name);
		});
	}else global[name] = factory(global, {}, name);
}(typeof window !== 'undefined'? window:global, 'dotcfg', function(global, exports, name){
	'use strict';

	var objectAssessor = /\[(["']?)([^\1]+?)\1?\]/g;
	var startWithDot = /^\./;
	var defaultStrategy;

	function isUndefined(value){
		return typeof value === 'undefined';
	}

	function isFunction(value){
		return typeof value === 'function';
	}

	function isLikeObject(value){
		return Object(value) === value;
	}

	function dotStrategy(target, value){
		if(Array.isArray(target)){
			return target.concat(value);
		}
		return value;
	}

	function replacer(match, p1, p2) {
		return isNaN(p2)? ' '+ p2 : '.'+ p2;
	}

	function ls(path){
		var keys = path.replace(/\s/g, '').replace(objectAssessor, replacer);
		keys = keys.replace(startWithDot, '').split(/\s/);
		keys = keys.length > 1? keys.filter(String) : keys[0].split('.');
		return keys;
	}

	function write(target, path, value, strategy){
		var id = 0,
		dot = target,
		keys = ls(path),
		total = keys.length - 1;
		while(id < total){
			path = keys[id++];
			if(!isLikeObject(target[path])){
				target = target[path] = {};
			}else{
				target = target[path];
			}
		}
		path = keys[id];
		if (isUndefined(value)) delete(target[path]);
		else (target[path] = strategy(target[path], value, path));
		return dot;
	}

	function read(target, path){
		var id = 0,
		keys = ls(path),
		total = keys.length;
		while((target = target[keys[id++]]) && id < total){}
		return id < total? void(0):target;
	}

	function assign(target){
		var output = Object(target);
		for(var index = 1; index < arguments.length; index++){
			var source = arguments[index];
			if(source !== undefined && source !== null){
				for(var nextKey in source){
					if(source.hasOwnProperty(nextKey)){
						if(source[nextKey] === Object(source[nextKey])){
							output[nextKey] = assign(source[nextKey]);
						}else{
							output[nextKey] = source[nextKey];
						}
					}
				}
			}
		}
		return output;
	}

	function getCfg(target) {
		target = assign({}, target);
		delete target.namespace;
		delete target.cfg;
		return target;
	}

	function uri(key, value, strategy){
		if(!key) return getCfg(this);
		var hasValue = arguments.length > 1;
		strategy = value && isFunction(strategy)? strategy : defaultStrategy;
		return hasValue? write(this, key, value, strategy) : read(this, key);
	}

	function stub(namespace, target, strategy){
		target = isLikeObject(target)? target : global;
		target = target[namespace] = target[namespace] || {};
		defaultStrategy = isFunction(strategy)? strategy:dotStrategy;
		target.namespace = namespace;
		target.cfg = uri.bind(target);
		return target;
	}

	exports[name] = stub;
	return stub;
}));
