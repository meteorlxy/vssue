import Vue from 'vue';
import { formatDateTime, getCleanURL, compareDateDesc } from '@vssue/utils';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.6.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _library = false;

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode: _library ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_core.inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var ITERATOR$1 = _wks('iterator');
var TO_STRING_TAG = _wks('toStringTag');
var ArrayValues = _iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
    _iterators[NAME] = ArrayValues;
    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
  }
}

var f$1 = _wks;

var _wksExt = {
	f: f$1
};

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

_wksDefine('asyncIterator');

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});
var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$4
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
};

var _objectGopnExt = {
	f: f$5
};

var gOPD = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

// ECMAScript 6 symbols shim





var META = _meta.KEY;



















var gOPD$1 = _objectGopd.f;
var dP$1 = _objectDp.f;
var gOPN$1 = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$1({}, 'a', {
    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD$1(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD$1(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN$1(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!_isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

/* global Reflect, Promise */
var _extendStatics = function extendStatics(d, b) {
  _extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return _extendStatics(d, b);
};

function __extends(d, b) {
  _extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var at = _stringAt(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var _advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var _regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (_classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

// 21.2.5.3 get RegExp.prototype.flags

var _flags = function () {
  var that = _anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var _regexpExec = patchedExec;

_export({
  target: 'RegExp',
  proto: true,
  forced: _regexpExec !== /./.exec
}, {
  exec: _regexpExec
});

var SPECIES = _wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

var _fixReWks = function (KEY, length, exec) {
  var SYMBOL = _wks(KEY);

  var DELEGATES_TO_SYMBOL = !_fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      _defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === _regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    _redefine(String.prototype, KEY, strfn);
    _hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

var max$1 = Math.max;
var min$2 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
_fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = _anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = _regexpExecAbstract(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max$1(min$2(_toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = _toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return ch;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return ch;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return ch;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

var dP$2 = _objectDp.f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME$1 = 'name';

// 19.2.4.2 name
NAME$1 in FProto || _descriptors && dP$2(FProto, NAME$1, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var vueClassComponent_common = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopDefault(ex) {
    return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var Vue$$1 = _interopDefault(Vue);

  var reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata;

  function copyReflectionMetadata(to, from) {
    forwardMetadata(to, from);
    Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
      forwardMetadata(to.prototype, from.prototype, key);
    });
    Object.getOwnPropertyNames(from).forEach(function (key) {
      forwardMetadata(to, from, key);
    });
  }

  function forwardMetadata(to, from, propertyKey) {
    var metaKeys = propertyKey ? Reflect.getOwnMetadataKeys(from, propertyKey) : Reflect.getOwnMetadataKeys(from);
    metaKeys.forEach(function (metaKey) {
      var metadata = propertyKey ? Reflect.getOwnMetadata(metaKey, from, propertyKey) : Reflect.getOwnMetadata(metaKey, from);

      if (propertyKey) {
        Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
      } else {
        Reflect.defineMetadata(metaKey, metadata, to);
      }
    });
  }

  var fakeArray = {
    __proto__: []
  };
  var hasProto = fakeArray instanceof Array;

  function createDecorator(factory) {
    return function (target, key, index) {
      var Ctor = typeof target === 'function' ? target : target.constructor;

      if (!Ctor.__decorators__) {
        Ctor.__decorators__ = [];
      }

      if (typeof index !== 'number') {
        index = undefined;
      }

      Ctor.__decorators__.push(function (options) {
        return factory(options, key, index);
      });
    };
  }

  function mixins() {
    var Ctors = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      Ctors[_i] = arguments[_i];
    }

    return Vue$$1.extend({
      mixins: Ctors
    });
  }

  function isPrimitive(value) {
    var type = _typeof(value);

    return value == null || type !== 'object' && type !== 'function';
  }

  function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;

    Component.prototype._init = function () {
      var _this = this; // proxy to actual vm


      var keys = Object.getOwnPropertyNames(vm); // 2.2.0 compat (props are no longer exposed as self properties)

      if (vm.$options.props) {
        for (var key in vm.$options.props) {
          if (!vm.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
      }

      keys.forEach(function (key) {
        if (key.charAt(0) !== '_') {
          Object.defineProperty(_this, key, {
            get: function get() {
              return vm[key];
            },
            set: function set(value) {
              vm[key] = value;
            },
            configurable: true
          });
        }
      });
    }; // should be acquired class property values


    var data = new Component(); // restore original _init to avoid memory leak (#209)

    Component.prototype._init = originalInit; // create plain data object

    var plainData = {};
    Object.keys(data).forEach(function (key) {
      if (data[key] !== undefined) {
        plainData[key] = data[key];
      }
    });

    return plainData;
  }

  var $internalHooks = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeDestroy', 'destroyed', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured' // 2.5
  ];

  function componentFactory(Component, options) {
    if (options === void 0) {
      options = {};
    }

    options.name = options.name || Component._componentTag || Component.name; // prototype props.

    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
      if (key === 'constructor') {
        return;
      } // hooks


      if ($internalHooks.indexOf(key) > -1) {
        options[key] = proto[key];
        return;
      }

      var descriptor = Object.getOwnPropertyDescriptor(proto, key);

      if (descriptor.value !== void 0) {
        // methods
        if (typeof descriptor.value === 'function') {
          (options.methods || (options.methods = {}))[key] = descriptor.value;
        } else {
          // typescript decorated data
          (options.mixins || (options.mixins = [])).push({
            data: function data() {
              var _a;

              return _a = {}, _a[key] = descriptor.value, _a;
            }
          });
        }
      } else if (descriptor.get || descriptor.set) {
        // computed properties
        (options.computed || (options.computed = {}))[key] = {
          get: descriptor.get,
          set: descriptor.set
        };
      }
    });
    (options.mixins || (options.mixins = [])).push({
      data: function data() {
        return collectDataFromConstructor(this, Component);
      }
    }); // decorate options

    var decorators = Component.__decorators__;

    if (decorators) {
      decorators.forEach(function (fn) {
        return fn(options);
      });
      delete Component.__decorators__;
    } // find super


    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue$$1 ? superProto.constructor : Vue$$1;
    var Extended = Super.extend(options);
    forwardStaticMembers(Extended, Component, Super);

    if (reflectionIsSupported) {
      copyReflectionMetadata(Extended, Component);
    }

    return Extended;
  }

  function forwardStaticMembers(Extended, Original, Super) {
    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
    Object.getOwnPropertyNames(Original).forEach(function (key) {
      // `prototype` should not be overwritten
      if (key === 'prototype') {
        return;
      } // Some browsers does not allow reconfigure built-in properties


      var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);

      if (extendedDescriptor && !extendedDescriptor.configurable) {
        return;
      }

      var descriptor = Object.getOwnPropertyDescriptor(Original, key); // If the user agent does not support `__proto__` or its family (IE <= 10),
      // the sub class properties may be inherited properties from the super class in TypeScript.
      // We need to exclude such properties to prevent to overwrite
      // the component options object which stored on the extended constructor (See #192).
      // If the value is a referenced value (object or function),
      // we can check equality of them and exclude it if they have the same reference.
      // If it is a primitive value, it will be forwarded for safety.

      if (!hasProto) {
        // Only `cid` is explicitly exluded from property forwarding
        // because we cannot detect whether it is a inherited property or not
        // on the no `__proto__` environment even though the property is reserved.
        if (key === 'cid') {
          return;
        }

        var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);

        if (!isPrimitive(descriptor.value) && superDescriptor && superDescriptor.value === descriptor.value) {
          return;
        }
      } // Warn if the users manually declare reserved properties

      Object.defineProperty(Extended, key, descriptor);
    });
  }

  function Component(options) {
    if (typeof options === 'function') {
      return componentFactory(options);
    }

    return function (Component) {
      return componentFactory(Component, options);
    };
  }

  Component.registerHooks = function registerHooks(keys) {
    $internalHooks.push.apply($internalHooks, keys);
  };

  exports.default = Component;
  exports.createDecorator = createDecorator;
  exports.mixins = mixins;
});
var Component = unwrapExports(vueClassComponent_common);
var vueClassComponent_common_1 = vueClassComponent_common.createDecorator;
var vueClassComponent_common_2 = vueClassComponent_common.mixins;

/** vue-property-decorator verson 7.2.0 MIT LICENSE copyright 2018 kaorun343 */
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */

function Prop(options) {
  if (options === void 0) {
    options = {};
  }

  return vueClassComponent_common_1(function (componentOptions, k) {
    (componentOptions.props || (componentOptions.props = {}))[k] = options;
  });
}

var TransitionFade = /** @class */ (function (_super) {
    __extends(TransitionFade, _super);
    function TransitionFade() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransitionFade.prototype.render = function (h) {
        return h(this.group ? 'TransitionGroup' : 'Transition', {
            props: {
                name: 'fade',
                mode: 'out-in',
                appear: true
            }
        }, this.$slots["default"]);
    };
    __decorate([
        Prop({
            type: Boolean,
            required: false,
            "default": false
        })
    ], TransitionFade.prototype, "group");
    TransitionFade = __decorate([
        Component
    ], TransitionFade);
    return TransitionFade;
}(Vue));

/* script */
var __vue_script__ = TransitionFade;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = undefined;
/* component normalizer */

function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "TransitionFade.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var TransitionFade$1 = __vue_normalize__({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

var Iconfont = /** @class */ (function (_super) {
    __extends(Iconfont, _super);
    function Iconfont() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Iconfont = __decorate([
        Component
    ], Iconfont);
    return Iconfont;
}(Vue));

/* script */
var __vue_script__$1 = Iconfont;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: false,
      expression: "false"
    }]
  }, [_c('symbol', {
    attrs: {
      "id": "icon-bitbucket",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M575.330231 490.861714q4.534857 35.986286-28.891429 57.709714t-63.707429 3.437714q-22.308571-9.728-30.573714-33.133714t-0.292571-46.884571 29.696-33.133714q20.553143-10.313143 41.398857-6.875429t36.571429 20.260571 15.725714 38.546286zM638.745088 478.866286q-7.972571-61.147429-64.585143-93.696t-112.566857-7.460571q-35.986286 16.018286-57.417143 50.541714t-19.748571 74.020571q2.267429 52.004571 44.251429 88.576t94.573714 32.036571q52.004571-4.534857 86.820571-47.981714t28.598857-96.036571zM775.375945 169.179429q-11.410286-15.433143-32.036571-25.453714t-33.133714-12.580571-40.594286-7.168q-166.253714-26.843429-323.437714 1.170286-24.576 4.022857-37.741714 6.875429t-31.451429 12.580571-28.598857 24.576q17.115429 16.018286 43.446857 25.965714t41.984 12.580571 50.029714 6.582857q130.267429 16.603429 256 0.585143 35.986286-4.534857 51.126857-6.875429t41.398857-12.288 42.861714-26.550857zM807.924517 760.539429q-4.534857 14.848-8.850286 43.739429t-7.972571 47.981714-16.310857 40.009143-33.133714 32.256q-49.152 27.428571-108.251429 40.886857t-115.419429 12.580571-115.126857-10.605714q-26.258286-4.534857-46.592-10.313143t-43.739429-15.433143-41.691429-24.868571-29.696-35.108571q-14.262857-54.857143-32.548571-166.838857l3.437714-9.142857 10.313143-5.12q127.414857 84.553143 289.426286 84.553143t290.011429-84.553143q11.995429 3.437714 13.677714 13.165714t-2.852571 25.746286-4.534857 21.138286zM911.348517 211.456q-14.848 95.451429-63.414857 374.272-2.852571 17.115429-15.433143 32.036571t-24.868571 22.820571-31.158857 17.700571q-144.018286 71.972571-348.598857 50.322286-141.677714-15.433143-225.133714-79.433143-8.557714-6.875429-14.555429-15.140571t-9.728-19.968-5.12-19.456-3.437714-22.601143-3.145143-19.968q-5.12-28.598857-15.140571-85.723429t-16.018286-92.306286-13.458286-84.260571-12.580571-90.258286q1.682286-14.848 10.020571-27.721143t17.993143-21.430857 25.746286-17.115429 26.258286-12.873143 27.428571-10.605714q71.460571-26.258286 178.834286-36.571429 216.576-21.138286 386.267429 28.598857 88.576 26.258286 122.88 69.705143 9.142857 11.410286 9.435429 29.110857t-3.145143 30.866286z"
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-github",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M512 12.64c-282.752 0-512 229.216-512 512 0 226.208 146.72 418.144 350.144 485.824 25.6 4.736 35.008-11.104 35.008-24.64 0-12.192-0.48-52.544-0.704-95.328-142.464 30.976-172.512-60.416-172.512-60.416-23.296-59.168-56.832-74.912-56.832-74.912-46.464-31.776 3.52-31.136 3.52-31.136 51.392 3.616 78.464 52.768 78.464 52.768 45.664 78.272 119.776 55.648 148.992 42.56 4.576-33.088 17.856-55.68 32.512-68.48-113.728-12.928-233.28-56.864-233.28-253.024 0-55.904 20-101.568 52.768-137.44-5.312-12.896-22.848-64.96 4.96-135.488 0 0 43.008-13.76 140.832 52.48 40.832-11.36 84.64-17.024 128.16-17.248 43.488 0.192 87.328 5.888 128.256 17.248 97.728-66.24 140.64-52.48 140.64-52.48 27.872 70.528 10.336 122.592 5.024 135.488 32.832 35.84 52.704 81.536 52.704 137.44 0 196.64-119.776 239.936-233.792 252.64 18.368 15.904 34.72 47.04 34.72 94.816 0 68.512-0.608 123.648-0.608 140.512 0 13.632 9.216 29.6 35.168 24.576 203.328-67.776 349.856-259.616 349.856-485.76 0-282.784-229.248-512-512-512z"
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-loading",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M843.307 742.24c0 3.217 2.607 5.824 5.824 5.824s5.824-2.607 5.824-5.824a5.823 5.823 0 0 0-5.824-5.824 5.823 5.823 0 0 0-5.824 5.824zM714.731 874.912c0 6.398 5.186 11.584 11.584 11.584s11.584-5.186 11.584-11.584-5.186-11.584-11.584-11.584-11.584 5.186-11.584 11.584zM541.419 943.2c0 9.614 7.794 17.408 17.408 17.408s17.408-7.794 17.408-17.408-7.794-17.408-17.408-17.408-17.408 7.794-17.408 17.408z m-186.56-9.152c0 12.795 10.373 23.168 23.168 23.168s23.168-10.373 23.168-23.168-10.373-23.168-23.168-23.168-23.168 10.373-23.168 23.168zM189.355 849.12c0 16.012 12.98 28.992 28.992 28.992s28.992-12.98 28.992-28.992-12.98-28.992-28.992-28.992-28.992 12.98-28.992 28.992zM74.731 704.736c0 19.228 15.588 34.816 34.816 34.816s34.816-15.588 34.816-34.816-15.588-34.816-34.816-34.816-34.816 15.588-34.816 34.816z m-43.008-177.28c0 22.41 18.166 40.576 40.576 40.576s40.576-18.166 40.576-40.576-18.166-40.576-40.576-40.576-40.576 18.166-40.576 40.576z m35.392-176.128c0 25.626 20.774 46.4 46.4 46.4s46.4-20.774 46.4-46.4c0-25.626-20.774-46.4-46.4-46.4-25.626 0-46.4 20.774-46.4 46.4z m106.176-142.016c0 28.843 23.381 52.224 52.224 52.224s52.224-23.381 52.224-52.224c0-28.843-23.381-52.224-52.224-52.224-28.843 0-52.224 23.381-52.224 52.224z m155.904-81.344c0 32.024 25.96 57.984 57.984 57.984s57.984-25.96 57.984-57.984-25.96-57.984-57.984-57.984-57.984 25.96-57.984 57.984z m175.104-5.056c0 35.24 28.568 63.808 63.808 63.808s63.808-28.568 63.808-63.808c0-35.24-28.568-63.808-63.808-63.808-35.24 0-63.808 28.568-63.808 63.808z m160.32 72.128c0 38.421 31.147 69.568 69.568 69.568s69.568-31.147 69.568-69.568-31.147-69.568-69.568-69.568-69.568 31.147-69.568 69.568z m113.92 135.488c0 41.638 33.754 75.392 75.392 75.392s75.392-33.754 75.392-75.392-33.754-75.392-75.392-75.392-75.392 33.754-75.392 75.392z m45.312 175.488c0 44.854 36.362 81.216 81.216 81.216s81.216-36.362 81.216-81.216c0-44.854-36.362-81.216-81.216-81.216-44.854 0-81.216 36.362-81.216 81.216z",
      "fill": ""
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-gitlab",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M59.544137 403.419429L512.115566 983.405714 16.09728 623.396571a39.936 39.936 0 0 1-14.299429-43.995428l57.709715-176.018286z m264.009143 0h377.161143L512.152137 983.405714zM210.40128 53.723429l113.152 349.696H59.544137l113.152-349.696a20.041143 20.041143 0 0 1 37.705143 0z m754.285714 349.696l57.709715 176.018285a39.862857 39.862857 0 0 1-14.299429 43.995429l-496.018286 360.009143 452.571429-579.986286z m0 0h-264.009143l113.152-349.696a20.041143 20.041143 0 0 1 37.705143 0z",
      "fill": ""
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-like",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-unlike",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4-8.3-3.6-17.2-5.4-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81z m627.2 160.4H496.8l9.6 198.4c0.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7-19.6-0.1-36.9-13.4-42.2-32.3L329 459.2V172h415.4c20.4 9.2 33.6 29.4 33.6 51.8 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 19.1-11 37.5-28.8 48.4z"
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-heart",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"
    }
  })]), _vm._v(" "), _c('symbol', {
    attrs: {
      "id": "icon-error",
      "viewBox": "0 0 1024 1024"
    }
  }, [_c('path', {
    attrs: {
      "d": "M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"
    }
  }), _vm._v(" "), _c('path', {
    attrs: {
      "d": "M480 416v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z"
    }
  }), _vm._v(" "), _c('path', {
    attrs: {
      "d": "M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z m-783.5-27.9L512 239.9l339.8 588.2H172.2z"
    }
  })])]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* component normalizer */

function __vue_normalize__$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Iconfont.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var Iconfont$1 = __vue_normalize__$1({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

var VssueIcon = /** @class */ (function (_super) {
    __extends(VssueIcon, _super);
    function VssueIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VssueIcon.prototype, "iconClass", {
        get: function () {
            return "icon-" + this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueIcon.prototype, "xlinkHref", {
        get: function () {
            return "#" + this.iconClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueIcon.prototype, "iconStyle", {
        get: function () {
            return {
                'font-size': this.size,
                'fill': this.color
            };
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Prop({
            type: String,
            required: true
        })
    ], VssueIcon.prototype, "name");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": '1em'
        })
    ], VssueIcon.prototype, "size");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": null
        })
    ], VssueIcon.prototype, "color");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": null
        })
    ], VssueIcon.prototype, "title");
    VssueIcon = __decorate([
        Component
    ], VssueIcon);
    return VssueIcon;
}(Vue));

/* script */
var __vue_script__$2 = VssueIcon;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    staticClass: "vssue-icon",
    class: _vm.iconClass,
    style: _vm.iconStyle,
    attrs: {
      "aria-hidden": "true"
    }
  }, [_c('title', {
    domProps: {
      "textContent": _vm._s(_vm.title)
    }
  }), _vm._v(" "), _c('use', {
    attrs: {
      "xlink:href": _vm.xlinkHref
    }
  })]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* component normalizer */

function __vue_normalize__$2(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueIcon.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueIcon$1 = __vue_normalize__$2({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, undefined, undefined);

var VssueComment = /** @class */ (function (_super) {
    __extends(VssueComment, _super);
    function VssueComment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VssueComment.prototype, "content", {
        get: function () {
            return this.comment.content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueComment.prototype, "contentRaw", {
        get: function () {
            return this.comment.contentRaw;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueComment.prototype, "author", {
        get: function () {
            return this.comment.author;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueComment.prototype, "createdAt", {
        get: function () {
            return formatDateTime(this.comment.createdAt);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueComment.prototype, "updatedAt", {
        get: function () {
            return formatDateTime(this.comment.updatedAt);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueComment.prototype, "showReactions", {
        get: function () {
            return Boolean(this.comment.reactions);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Prop({
            type: Object,
            required: true
        })
    ], VssueComment.prototype, "comment");
    VssueComment = __decorate([
        Component({
            components: {
                VssueIcon: VssueIcon$1
            }
        })
    ], VssueComment);
    return VssueComment;
}(Vue));

/* script */
var __vue_script__$3 = VssueComment;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vssue-comment"
  }, [_c('div', {
    staticClass: "vssue-comment-avatar"
  }, [_c('a', {
    attrs: {
      "href": _vm.author.homepage,
      "title": _vm.author.username,
      "target": "_blank"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.author.avatar
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "vssue-comment-body"
  }, [_vm._t("body", [_c('div', {
    staticClass: "vssue-comment-header"
  }, [_c('span', {
    staticClass: "vssue-comment-author"
  }, [_c('a', {
    attrs: {
      "href": _vm.author.homepage,
      "title": _vm.author.username,
      "target": "_blank"
    }
  }, [_vm._v("\n            " + _vm._s(_vm.author.username) + "\n          ")])]), _vm._v(" "), _c('span', {
    staticClass: "vssue-comment-created-at"
  }, [_vm._v("\n          " + _vm._s(_vm.createdAt) + "\n        ")])]), _vm._v(" "), _c('div', {
    staticClass: "vssue-comment-main"
  }, [_c('article', {
    staticClass: "markdown-body",
    domProps: {
      "innerHTML": _vm._s(_vm.content)
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "vssue-comment-footer"
  }, [_vm.showReactions ? _c('span', {
    staticClass: "vssue-comment-reactions"
  }, _vm._l(['heart', 'like', 'unlike'], function (reaction) {
    return _c('span', {
      key: reaction,
      staticClass: "vssue-comment-reaction",
      on: {
        "click": function click($event) {
          _vm.$emit('create-reaction', {
            commentId: _vm.comment.id,
            reaction: reaction
          });
        }
      }
    }, [_c('VssueIcon', {
      attrs: {
        "name": reaction
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "vssue-comment-reaction-number"
    }, [_vm._v("\n              " + _vm._s(_vm.comment.reactions[reaction]) + "\n            ")])], 1);
  }), 0) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "vssue-comment-reply",
    on: {
      "click": function click($event) {
        _vm.$emit('reply', _vm.comment);
      }
    }
  }, [_vm._v("\n          Reply\n        ")])])])], 2)]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = undefined;
/* functional template */

var __vue_is_functional_template__$3 = false;
/* component normalizer */

function __vue_normalize__$3(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueComment.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueComment$1 = __vue_normalize__$3({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, undefined, undefined);

var VssueStatus = /** @class */ (function (_super) {
    __extends(VssueStatus, _super);
    function VssueStatus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": null
        })
    ], VssueStatus.prototype, "iconName");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": '20px'
        })
    ], VssueStatus.prototype, "iconSize");
    VssueStatus = __decorate([
        Component({
            components: {
                VssueIcon: VssueIcon$1
            }
        })
    ], VssueStatus);
    return VssueStatus;
}(Vue));

/* script */
var __vue_script__$4 = VssueStatus;
/* template */

var __vue_render__$3 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vssue-status"
  }, [_vm.iconName ? _c('VssueIcon', {
    attrs: {
      "name": _vm.iconName,
      "size": _vm.iconSize
    }
  }) : _vm._e(), _vm._v(" "), _c('p', [_vm._t("default")], 2)], 1);
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$4 = undefined;
/* scoped */

var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = undefined;
/* functional template */

var __vue_is_functional_template__$4 = false;
/* component normalizer */

function __vue_normalize__$4(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueStatus.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueStatus$1 = __vue_normalize__$4({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, undefined, undefined);

var VssueComments = /** @class */ (function (_super) {
    __extends(VssueComments, _super);
    function VssueComments() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Prop({
            type: Array,
            required: true
        })
    ], VssueComments.prototype, "comments");
    __decorate([
        Prop({
            type: Boolean,
            required: true
        })
    ], VssueComments.prototype, "failed");
    __decorate([
        Prop({
            type: Boolean,
            required: true
        })
    ], VssueComments.prototype, "loading");
    __decorate([
        Prop({
            type: Boolean,
            required: true
        })
    ], VssueComments.prototype, "requireLogin");
    VssueComments = __decorate([
        Component({
            components: {
                TransitionFade: TransitionFade$1,
                VssueComment: VssueComment$1,
                VssueStatus: VssueStatus$1
            }
        })
    ], VssueComments);
    return VssueComments;
}(Vue));

/* script */
var __vue_script__$5 = VssueComments;
/* template */

var __vue_render__$4 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vssue-comments"
  }, [_c('TransitionFade', [_vm.failed ? _c('VssueStatus', {
    key: "failed",
    attrs: {
      "icon-name": "error",
      "icon-size": "25px"
    }
  }, [_vm._v("\n      Failed to load comments\n    ")]) : _vm.requireLogin ? _c('VssueStatus', {
    key: "requie-login"
  }, [_vm._v("\n      Login to view comments\n    ")]) : _vm.loading ? _c('VssueStatus', {
    key: "loading",
    attrs: {
      "icon-name": "loading"
    }
  }, [_vm._v("\n      Loading comments...\n    ")]) : _c('div', {
    key: "comments-list",
    staticClass: "vssue-comments-list"
  }, [_c('TransitionFade', {
    attrs: {
      "group": ""
    }
  }, _vm._l(_vm.comments, function (comment) {
    return _c('VssueComment', {
      key: comment.id,
      attrs: {
        "comment": comment
      },
      on: {
        "reply": function reply(comment) {
          return _vm.$emit('reply', comment);
        },
        "create-reaction": function createReaction(reaction) {
          return _vm.$emit('create-reaction', reaction);
        }
      }
    });
  }), 1)], 1)], 1)], 1);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = undefined;
/* functional template */

var __vue_is_functional_template__$5 = false;
/* component normalizer */

function __vue_normalize__$5(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueComments.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueComments$1 = __vue_normalize__$5({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, undefined, undefined);

var VssueButton = /** @class */ (function (_super) {
    __extends(VssueButton, _super);
    function VssueButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VssueButton.prototype, "buttonClass", {
        get: function () {
            return "vssue-button-" + this.type;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Prop({
            type: Boolean,
            required: false,
            "default": false
        })
    ], VssueButton.prototype, "disabled");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": 'default'
        })
    ], VssueButton.prototype, "type");
    VssueButton = __decorate([
        Component
    ], VssueButton);
    return VssueButton;
}(Vue));

/* script */
var __vue_script__$6 = VssueButton;
/* template */

var __vue_render__$5 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('button', {
    staticClass: "vssue-button",
    class: _vm.buttonClass,
    attrs: {
      "disabled": _vm.disabled
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__$5 = [];
/* style */

var __vue_inject_styles__$6 = undefined;
/* scoped */

var __vue_scope_id__$6 = undefined;
/* module identifier */

var __vue_module_identifier__$6 = undefined;
/* functional template */

var __vue_is_functional_template__$6 = false;
/* component normalizer */

function __vue_normalize__$6(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueButton.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueButton$1 = __vue_normalize__$6({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, undefined, undefined);

var VssueNewCommentInput = /** @class */ (function (_super) {
    __extends(VssueNewCommentInput, _super);
    function VssueNewCommentInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VssueNewCommentInput.prototype, "content", {
        get: function () {
            return this.value;
        },
        set: function (text) {
            this.$emit('input', text);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueNewCommentInput.prototype, "contentRows", {
        get: function () {
            return this.content.split('\n').length - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueNewCommentInput.prototype, "rows", {
        get: function () {
            return this.contentRows < 3 ? 5 : this.contentRows + 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssueNewCommentInput.prototype, "placeholder", {
        get: function () {
            return this.disabled ? 'Login to leave a comment' : 'Leave a comment. Styling with Markdown is supported';
        },
        enumerable: true,
        configurable: true
    });
    VssueNewCommentInput.prototype.focus = function () {
        this.$refs.input.focus();
    };
    __decorate([
        Prop({
            type: Boolean,
            required: false,
            "default": true
        })
    ], VssueNewCommentInput.prototype, "disabled");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": ''
        })
    ], VssueNewCommentInput.prototype, "value");
    VssueNewCommentInput = __decorate([
        Component
    ], VssueNewCommentInput);
    return VssueNewCommentInput;
}(Vue));

/* script */
var __vue_script__$7 = VssueNewCommentInput;
/* template */

var __vue_render__$6 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.content,
      expression: "content"
    }],
    ref: "input",
    staticClass: "vssue-new-comment-input",
    attrs: {
      "rows": _vm.rows,
      "disabled": _vm.disabled,
      "placeholder": _vm.placeholder,
      "spellcheck": false
    },
    domProps: {
      "value": _vm.content
    },
    on: {
      "input": function input($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.content = $event.target.value;
      }
    }
  });
};

var __vue_staticRenderFns__$6 = [];
/* style */

var __vue_inject_styles__$7 = undefined;
/* scoped */

var __vue_scope_id__$7 = undefined;
/* module identifier */

var __vue_module_identifier__$7 = undefined;
/* functional template */

var __vue_is_functional_template__$7 = false;
/* component normalizer */

function __vue_normalize__$7(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueNewCommentInput.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueNewCommentInput$1 = __vue_normalize__$7({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, undefined, undefined);

var VssueNewComment = /** @class */ (function (_super) {
    __extends(VssueNewComment, _super);
    function VssueNewComment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.newComment = '';
        return _this;
    }
    VssueNewComment.prototype.add = function (str) {
        this.newComment = this.newComment.concat(str);
    };
    VssueNewComment.prototype.focus = function () {
        this.$refs.newCommentInput.focus();
    };
    VssueNewComment.prototype.reset = function () {
        this.newComment = '';
    };
    __decorate([
        Prop({
            type: Boolean,
            required: true
        })
    ], VssueNewComment.prototype, "loading");
    __decorate([
        Prop({
            type: String,
            required: true
        })
    ], VssueNewComment.prototype, "platform");
    __decorate([
        Prop({
            type: Object,
            required: false,
            "default": null
        })
    ], VssueNewComment.prototype, "user");
    VssueNewComment = __decorate([
        Component({
            components: {
                VssueButton: VssueButton$1,
                VssueIcon: VssueIcon$1,
                VssueNewCommentInput: VssueNewCommentInput$1
            }
        })
    ], VssueNewComment);
    return VssueNewComment;
}(Vue));

/* script */
var __vue_script__$8 = VssueNewComment;
/* template */

var __vue_render__$7 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vssue-new-comment"
  }, [_c('div', {
    staticClass: "vssue-comment-avatar"
  }, [_vm.user ? _c('a', {
    attrs: {
      "href": _vm.user.homepage,
      "title": _vm.user.username,
      "target": "_blank"
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.user.avatar
    }
  })]) : _c('VssueIcon', {
    staticStyle: {
      "padding": "5px",
      "cursor": "pointer"
    },
    attrs: {
      "name": _vm.platform,
      "title": "Login with " + _vm.platform,
      "size": "50px",
      "color": "grey"
    },
    nativeOn: {
      "click": function click($event) {
        _vm.$emit('login');
      }
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "vssue-new-comment-body"
  }, [_c('VssueNewCommentInput', {
    ref: "newCommentInput",
    attrs: {
      "disabled": !_vm.user
    },
    model: {
      value: _vm.newComment,
      callback: function callback($$v) {
        _vm.newComment = $$v;
      },
      expression: "newComment"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "vssue-new-comment-footer"
  }, [_vm.user ? _c('span', {
    staticClass: "vssue-current-user"
  }, [_c('span', [_vm._v("Current user - " + _vm._s(_vm.user.username) + " - ")]), _vm._v(" "), _c('a', {
    staticClass: "vssue-logout",
    on: {
      "click": function click($event) {
        _vm.$emit('logout');
      }
    }
  }, [_vm._v("\n        Logout\n      ")])]) : _c('span', {
    staticClass: "vssue-current-user"
  }, [_vm._v("\n      Login with " + _vm._s(_vm.platform) + " account to leave a comment\n    ")]), _vm._v(" "), _c('div', {
    staticClass: "vssue-new-comment-operations"
  }, [_vm.user ? _c('VssueButton', {
    staticClass: "vssue-button-submit-comment",
    attrs: {
      "type": "primary",
      "disabled": _vm.newComment === '' || _vm.loading
    },
    nativeOn: {
      "click": function click($event) {
        _vm.$emit('create-comment', {
          content: _vm.newComment
        });
      }
    }
  }, [_c('VssueIcon', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.loading,
      expression: "loading"
    }],
    attrs: {
      "name": "loading",
      "color": "grey"
    }
  }), _vm._v("\n\n        " + _vm._s(_vm.loading ? "Submitting" : "Submit Comment") + "\n      ")], 1) : _c('VssueButton', {
    staticClass: "vssue-button-login",
    attrs: {
      "type": "primary",
      "title": "Click to Login with " + _vm.platform
    },
    nativeOn: {
      "click": function click($event) {
        _vm.$emit('login');
      }
    }
  }, [_vm._v("\n        Login\n      ")])], 1)])]);
};

var __vue_staticRenderFns__$7 = [];
/* style */

var __vue_inject_styles__$8 = undefined;
/* scoped */

var __vue_scope_id__$8 = undefined;
/* module identifier */

var __vue_module_identifier__$8 = undefined;
/* functional template */

var __vue_is_functional_template__$8 = false;
/* component normalizer */

function __vue_normalize__$8(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssueNewComment.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueNewComment$1 = __vue_normalize__$8({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, undefined, undefined);

var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(_defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
var _stringHtml = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  _export(_export.P + _export.F * _fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

// B.2.3.10 String.prototype.link(url)
_stringHtml('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

var platforms = {
    'github': {
        name: 'GitHub',
        link: 'https://github.com'
    },
    'gitlab': {
        name: 'GitLab',
        link: 'https://gitlab.com'
    },
    'bitbucket': {
        name: 'BitBucket',
        link: 'https://bitbucket.org'
    }
};
var VssuePoweredBy = /** @class */ (function (_super) {
    __extends(VssuePoweredBy, _super);
    function VssuePoweredBy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(VssuePoweredBy.prototype, "platformInfo", {
        get: function () {
            return this.platform ? platforms[this.platform] : {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VssuePoweredBy.prototype, "vssueVersion", {
        get: function () {
            return "0.1.5";
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": null
        })
    ], VssuePoweredBy.prototype, "platform");
    __decorate([
        Prop({
            type: String,
            required: false,
            "default": null
        })
    ], VssuePoweredBy.prototype, "version");
    VssuePoweredBy = __decorate([
        Component
    ], VssuePoweredBy);
    return VssuePoweredBy;
}(Vue));

var __vue_script__$9 = VssuePoweredBy;
/* template */

var __vue_render__$8 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vssue-powered-by"
  }, [_c('span', [_vm._v("Powered by")]), _vm._v(" "), _vm.platform && _vm.version ? _c('span', [_c('a', {
    attrs: {
      "href": _vm.platformInfo.link,
      "target": "_blank",
      "title": _vm.platformInfo.name + " API " + _vm.version
    }
  }, [_vm._v("\n      " + _vm._s(_vm.platformInfo.name) + "\n    ")]), _vm._v(" "), _c('span', [_vm._v("&")])]) : _vm._e(), _vm._v(" "), _c('a', {
    attrs: {
      "href": "https://vssue.js.org",
      "target": "_blank",
      "title": "Vssue v" + _vm.vssueVersion
    }
  }, [_vm._v("\n    Vssue\n  ")])]);
};

var __vue_staticRenderFns__$8 = [];
/* style */

var __vue_inject_styles__$9 = undefined;
/* scoped */

var __vue_scope_id__$9 = undefined;
/* module identifier */

var __vue_module_identifier__$9 = undefined;
/* functional template */

var __vue_is_functional_template__$9 = false;
/* component normalizer */

function __vue_normalize__$9(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "VssuePoweredBy.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssuePoweredBy$1 = __vue_normalize__$9({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, undefined, undefined);

var Vssue = /** @class */ (function (_super) {
    __extends(Vssue, _super);
    function Vssue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // the issue that fetched from the platform
        _this.issue = null;
        // the comments of this issue that fetched from the platform
        _this.comments = [];
        // the user that logined
        _this.user = null;
        // access token of user
        _this.accessToken = null;
        // status flags
        _this.isFailed = false;
        _this.isLoginRequired = false;
        _this.isCreatingComment = false;
        _this.hasInitialized = false;
        _this.hasLoadedComments = false;
        return _this;
    }
    Object.defineProperty(Vssue.prototype, "vssueOptions", {
        /**
         * the actual options used by this vssue component
         */
        get: function () {
            return Object.assign({
                labels: 'Vssue',
                state: 'Vssue',
                prefix: '[Vssue]',
                admins: []
            }, this.$vssue ? this.$vssue.options : {}, this.options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vssue.prototype, "issueTitle", {
        /**
         * the actual title of this issue
         */
        get: function () {
            if (typeof this.title === 'function') {
                return this.title(this.vssueOptions);
            }
            return "" + this.vssueOptions.prefix + this.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vssue.prototype, "issueContent", {
        /**
         * the actual content of this issue (used when auto creating the issue)
         */
        get: function () {
            return getCleanURL(window.location.href);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vssue.prototype, "accessTokenKey", {
        /**
         * the key of access token for local storage
         */
        get: function () {
            return this.vssueAPI ? "Vssue." + this.vssueAPI.platform + ".access_token" : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vssue.prototype, "isLogined", {
        /**
         * flag that if the user is logined
         */
        get: function () {
            return this.accessToken !== null && this.user !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vssue.prototype, "isAdmin", {
        /**
         * flag that if the logined user is admin
         */
        get: function () {
            return this.isLogined && this.user !== null && (this.user.username === this.vssueOptions.owner || this.vssueOptions.admins.includes(this.user.username));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * created hook
     */
    Vssue.prototype.created = function () {
        return __awaiter(this, void 0, Promise, function () {
            var requiredOptions, _i, requiredOptions_1, opt, APIConstructor, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, 5, 6]);
                        requiredOptions = [
                            'api',
                            'owner',
                            'repo',
                            'clientId',
                            'clientSecret',
                        ];
                        for (_i = 0, requiredOptions_1 = requiredOptions; _i < requiredOptions_1.length; _i++) {
                            opt = requiredOptions_1[_i];
                            if (!this.vssueOptions[opt]) {
                                throw new Error("[Vssue] the option '" + opt + "' is required");
                            }
                        }
                        APIConstructor = this.vssueOptions.api;
                        this.vssueAPI = new APIConstructor({
                            baseURL: this.vssueOptions.baseURL,
                            labels: this.vssueOptions.labels || 'Vssue',
                            state: this.vssueOptions.state || 'Vssue',
                            owner: this.vssueOptions.owner,
                            repo: this.vssueOptions.repo,
                            clientId: this.vssueOptions.clientId,
                            clientSecret: this.vssueOptions.clientSecret
                        });
                        // get user
                        return [4 /*yield*/, this.handleAuthorize()];
                    case 1:
                        // get user
                        _a.sent();
                        this.hasInitialized = true;
                        // get vssue
                        return [4 /*yield*/, this.getIssue()
                            // get comments of vssue
                        ];
                    case 2:
                        // get vssue
                        _a.sent();
                        // get comments of vssue
                        return [4 /*yield*/, this.getComments()];
                    case 3:
                        // get comments of vssue
                        _a.sent();
                        this.hasLoadedComments = true;
                        return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        if (e_1.response && [401, 403].includes(e_1.response.status)) {
                            // in some cases, require login to load comments
                            this.isLoginRequired = true;
                        }
                        else {
                            this.isFailed = true;
                        }
                        throw e_1;
                    case 5:
                        this.hasInitialized = true;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get issue according to the labels and title
     */
    Vssue.prototype.getIssue = function () {
        return __awaiter(this, void 0, Promise, function () {
            var vssues, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.vssueAPI.getIssues({
                            accessToken: this.accessToken
                        })
                        // get the issue of this page (according to title)
                    ];
                    case 1:
                        vssues = _b.sent();
                        // get the issue of this page (according to title)
                        this.issue = vssues.find(function (vssue) { return vssue.title === _this.issueTitle; }) || null;
                        if (!!this.issue) return [3 /*break*/, 3];
                        // required login to create the issue
                        if (!this.isLogined) {
                            this.handleLogin();
                        }
                        // if current user is not admin
                        if (!this.isAdmin) {
                            throw Error('Failed to get Vssue');
                        }
                        // create the corresponding issue
                        _a = this;
                        return [4 /*yield*/, this.vssueAPI.createIssue({
                                title: this.issueTitle,
                                content: this.issueContent,
                                accessToken: this.accessToken
                            })];
                    case 2:
                        // create the corresponding issue
                        _a.issue = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get comments of this vssue according to the issue id
     */
    Vssue.prototype.getComments = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (this.issue === null) {
                            throw new Error('Failed to load issue');
                        }
                        _a = this;
                        return [4 /*yield*/, this.vssueAPI.getComments({
                                issueId: this.issue.id,
                                accessToken: this.accessToken
                            })];
                    case 1:
                        _a.comments = _b.sent();
                        this.comments.sort(function (a, b) { return compareDateDesc(a.createdAt, b.createdAt); });
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _b.sent();
                        console.error(e_2);
                        throw Error('Failed to get comments');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * create a new comment submitted by current user
     */
    Vssue.prototype.createComment = function (_a) {
        var content = _a.content;
        return __awaiter(this, void 0, Promise, function () {
            var e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, 4, 5]);
                        if (this.issue === null) {
                            throw new Error('Failed to load issue');
                        }
                        this.isCreatingComment = true;
                        // create comment
                        return [4 /*yield*/, this.vssueAPI.createIssueComment({
                                issueId: this.issue.id,
                                content: content,
                                accessToken: this.accessToken
                            })
                            // refresh comments after creation
                        ];
                    case 1:
                        // create comment
                        _b.sent();
                        // refresh comments after creation
                        return [4 /*yield*/, this.getComments()
                            // reset the new comment textarea
                        ];
                    case 2:
                        // refresh comments after creation
                        _b.sent();
                        // reset the new comment textarea
                        this.resetNewComment();
                        return [3 /*break*/, 5];
                    case 3:
                        e_3 = _b.sent();
                        console.error(e_3);
                        throw Error('Failed to create comment');
                    case 4:
                        this.isCreatingComment = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * create a new reaction to a certain comment
     */
    Vssue.prototype.createCommentReaction = function (_a) {
        var commentId = _a.commentId, reaction = _a.reaction;
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.issue === null) {
                            throw new Error('Failed to load issue');
                        }
                        return [4 /*yield*/, this.vssueAPI.createCommentReaction({
                                issueId: this.issue.id,
                                commentId: commentId,
                                reaction: reaction,
                                accessToken: this.accessToken
                            })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getComments()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * reply to a certain comment quickly
     */
    Vssue.prototype.replyToComment = function (comment) {
        var quotedComment = comment.contentRaw.replace(/\n/g, '\n> ');
        var replyContent = "@" + comment.author.username + "\n\n> " + quotedComment + "\n\n";
        this.$refs.newComment.add(replyContent);
        this.$refs.newComment.focus();
    };
    /**
     * reset new comment
     */
    Vssue.prototype.resetNewComment = function () {
        this.$refs.newComment.reset();
    };
    /**
     * handle authorization if `code` and `state` exist in the query parameters
     */
    Vssue.prototype.handleAuthorize = function () {
        return __awaiter(this, void 0, Promise, function () {
            var accessToken, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // get access_token from storage
                        this.accessToken = this.getAccessToken();
                        return [4 /*yield*/, this.vssueAPI.handleAuthorize()];
                    case 1:
                        accessToken = _c.sent();
                        if (!accessToken) return [3 /*break*/, 3];
                        // new access_token
                        this.setAccessToken(accessToken);
                        _a = this;
                        return [4 /*yield*/, this.vssueAPI.getUser({ accessToken: accessToken })];
                    case 2:
                        _a.user = _c.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!this.accessToken) return [3 /*break*/, 5];
                        // stored access_token
                        _b = this;
                        return [4 /*yield*/, this.vssueAPI.getUser({ accessToken: this.accessToken })];
                    case 4:
                        // stored access_token
                        _b.user = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        // no access_token
                        this.setAccessToken(null);
                        this.user = null;
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * redirect to the platform's authorization page
     */
    Vssue.prototype.handleLogin = function () {
        this.vssueAPI.redirectAuthorize();
    };
    /**
     * clean the access token stored in local storage
     */
    Vssue.prototype.handleLogout = function () {
        this.setAccessToken(null);
        this.user = null;
    };
    /**
     * get access token from local storage
     */
    Vssue.prototype.getAccessToken = function () {
        return window.localStorage.getItem(this.accessTokenKey);
    };
    /**
     * save access token to local storage
     */
    Vssue.prototype.setAccessToken = function (token) {
        if (token === null) {
            window.localStorage.removeItem(this.accessTokenKey);
        }
        else {
            window.localStorage.setItem(this.accessTokenKey, token);
        }
        this.accessToken = token;
    };
    __decorate([
        Prop({
            type: [String, Function],
            required: false,
            "default": function (opts) { return "" + opts.prefix + document.title; }
        })
    ], Vssue.prototype, "title");
    __decorate([
        Prop({
            type: Object,
            required: false,
            "default": function () { return ({}); }
        })
    ], Vssue.prototype, "options");
    Vssue = __decorate([
        Component({
            components: {
                Iconfont: Iconfont$1,
                TransitionFade: TransitionFade$1,
                VssueComments: VssueComments$1,
                VssueNewComment: VssueNewComment$1,
                VssuePoweredBy: VssuePoweredBy$1,
                VssueStatus: VssueStatus$1
            }
        })
    ], Vssue);
    return Vssue;
}(Vue));

/* script */
var __vue_script__$a = Vssue;
/* template */

var __vue_render__$9 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vssue"
  }, [_c('Iconfont'), _vm._v(" "), _c('div', {
    staticClass: "vssue-header"
  }, [_c('span', {
    staticClass: "vssue-comments-count"
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.hasLoadedComments,
      expression: "hasLoadedComments"
    }]
  }, [_vm._v("\n        " + _vm._s(_vm.comments.length) + "\n      ")]), _vm._v(" "), _c('span', [_vm._v("\n        Comments\n      ")])]), _vm._v(" "), _c('VssuePoweredBy', {
    attrs: {
      "platform": _vm.vssueAPI.platform,
      "version": _vm.vssueAPI.version
    }
  })], 1), _vm._v(" "), _c('TransitionFade', [!_vm.hasInitialized ? _c('VssueStatus', {
    key: "initializing",
    attrs: {
      "icon-name": "loading"
    }
  }, [_vm._v("\n      Initializing...\n    ")]) : _c('div', {
    key: "initialized"
  }, [_c('VssueNewComment', {
    ref: "newComment",
    attrs: {
      "loading": _vm.isCreatingComment,
      "platform": _vm.vssueAPI.platform,
      "user": _vm.user
    },
    on: {
      "login": _vm.handleLogin,
      "logout": _vm.handleLogout,
      "create-comment": _vm.createComment
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "vssue-body"
  }, [_c('VssueComments', {
    attrs: {
      "comments": _vm.comments,
      "loading": !_vm.hasLoadedComments,
      "failed": _vm.isFailed,
      "require-login": _vm.isLoginRequired
    },
    on: {
      "reply": _vm.replyToComment,
      "create-reaction": _vm.createCommentReaction
    }
  })], 1)], 1)], 1)], 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

var __vue_inject_styles__$a = undefined;
/* scoped */

var __vue_scope_id__$a = undefined;
/* module identifier */

var __vue_module_identifier__$a = undefined;
/* functional template */

var __vue_is_functional_template__$a = false;
/* component normalizer */

function __vue_normalize__$a(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Vssue.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  return component;
}
/* style inject */

/* style inject SSR */


var VssueComponent = __vue_normalize__$a({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, undefined, undefined);

var Vssue$1 = {
    get version() {
        return "0.1.5";
    },
    install: function (Vue$$1, options) {
        if (Vue$$1.prototype.$vssue) {
            return false;
        }
        var store = new Vue$$1({
            data: {
                options: options
            }
        });
        Vue$$1.prototype.$vssue = store;
        Vue$$1.component('Vssue', VssueComponent);
    },
    Vssue: VssueComponent
};

export default Vssue$1;
export { VssueComponent as Vssue };
