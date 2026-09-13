var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _a, _o, _b, _c, _o2, _c2, _S, _O, _w, _M, _I, _m, _n, _b2, _s, _i, _t, _l, _u, _a2, _h, _y, _r, __, _F, _d2, _g, _T, _U, _f, _D, _d_instances, k_fn, _R, _v, _H, _p, X_fn, _x, _j, _N, A_fn, z_fn, V_fn, W_fn, G_fn, Y_fn, J_fn, P_fn, e_fn, B_fn, K_fn, Q_fn, C_fn, $_fn, L_fn, E_fn, q_fn, _d;
import { F as createComponent, S as Switch, G as Match, H as memo, J as useStore, K as createRenderEffect, O as setAttribute, Q as Show, R as template, t as convertSnowflakeToDate, T as getDefaultExportFromCjs, V as ErrorBoundary, X as createSignal, Y as onMount, Z as EventEmitter, _ as onCleanup, $ as untrack, a0 as localforage, a1 as discordClientReady, a2 as handleCombo, a3 as createEffect, a4 as className, a5 as use, a6 as insert, a7 as setStyleProperty, a8 as classList, a9 as mergeProps, aa as style, ab as decimal2rgb, ac as spread, ad as Dynamic, ae as createMemo, af as wrap$3, ag as DEV, ah as $PROXY, ai as batch, aj as $TRACK, ak as getListener, al as splitProps, E as sleep, am as pauseKeypress, an as __CJS__export_default__, ao as resumeKeypress, ap as addEventListener, aq as For, ar as delegateEvents, as as useKeypress, at as slide, y as toast, au as createUniqueId, av as niceBytes, aw as fullscreen, ax as thumbhashPreview, ay as isPartiallyInViewport, az as centerScroll, aA as ezgifAllowed, aB as Deferred, aC as setTheme, aD as ThemeStyle, aE as themeStyle, aF as setAnimate, aG as animateApp, aH as setPreserveDeleted, aI as preserveDeleted, aJ as setDisableDiscordLinkLabels, aK as disableDiscordLinkLabels, aL as setEzgifAllowed, aM as discordSetup, aN as Button$1, aO as __vitePreload, aP as setEmojiVariation, aQ as createSelector, aR as scrollIntoView, aS as RateLimitError, aT as currentView, aU as Views, aV as currentDiscordChannel, j as DiscordMessage, aW as currentDiscordGuild, aX as $longpress, aY as setCurrentView, aZ as isInViewport, a_ as isKeypressPaused, a$ as toolshed, b0 as currentForwardingMessage, b1 as setCurrentDiscordGuild, b2 as setCurrentDiscordChannel, b3 as typeInTextarea, b4 as setCurrentForwardMessage, b5 as lazy, b6 as popup, b as DiscordDMChannel, d as DiscordGroupDMChannel, b7 as useStoredSignal, b8 as channelHistory, b9 as normalizeCSSNumber, e as DiscordGuild, ba as Portal, bb as observable, x as shallowEqual, bc as imageFormatGuildIcon, bd as from, be as readable, bf as discordClient, bg as restartApp, bh as integrityCheck, bi as transform } from "./index-DkPzNcWn.js";
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var Symbol$1 = root.Symbol;
var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
var nativeObjectToString$1 = objectProto$5.toString;
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$4.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$4 = Object.prototype;
var nativeObjectToString = objectProto$4.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var isArray = Array.isArray;
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
function identity(value) {
  return value;
}
var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
})();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var funcProto$1 = Function.prototype;
var funcToString$1 = funcProto$1.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype, objectProto$3 = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty$3).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var HOT_COUNT = 800, HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count2 = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count2 >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count2 = 0;
    }
    return func.apply(void 0, arguments);
  };
}
function constant(value) {
  return function() {
    return value;
  };
}
var defineProperty = (function() {
  try {
    var func = getNative(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
})();
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant(string),
    "writable": true
  });
};
var setToString = shortOut(baseSetToString);
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + -1;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
function baseIsNaN(value) {
  return value !== value;
}
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var nativeMax$1 = Math.max;
function overRest(func, start2, transform2) {
  start2 = nativeMax$1(start2 === void 0 ? func.length - 1 : start2, 0);
  return function() {
    var args = arguments, index = -1, length = nativeMax$1(args.length - start2, 0), array = Array(length);
    while (++index < length) {
      array[index] = args[start2 + index];
    }
    index = -1;
    var otherArgs = Array(start2 + 1);
    while (++index < start2) {
      otherArgs[index] = args[index];
    }
    otherArgs[start2] = transform2(array);
    return apply(func, this, otherArgs);
  };
}
function baseRest(func, start2) {
  return setToString(overRest(func, start2, identity), func + "");
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
  return arguments;
})()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var nativeCreate = getNative(Object, "create");
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? void 0 : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : void 0;
}
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
}
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
  return this;
}
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = getNative(root, "Map");
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$1 || ListCache)(),
    "string": new Hash()
  };
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function mapCacheDelete(key) {
  var result = getMapData(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  var data = getMapData(this, key), size2 = data.size;
  data.set(key, value);
  this.size += data.size == size2 ? 0 : 1;
  return this;
}
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var FUNC_ERROR_TEXT$1 = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache2 = memoized.cache;
    if (cache2.has(key)) {
      return cache2.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache2.set(key, result) || cache2;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
function arrayPush(array, values) {
  var index = -1, length = values.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1, length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);
  while (++index < length) {
    var value = array[index];
    if (predicate(value)) {
      {
        arrayPush(result, value);
      }
    }
  }
  return result;
}
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== void 0) {
      number = number <= upper ? number : upper;
    }
    if (lower !== void 0) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
function clamp(number, lower, upper) {
  if (upper === void 0) {
    upper = lower;
    lower = void 0;
  }
  if (upper !== void 0) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== void 0) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}
var HASH_UNDEFINED = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}
function setCacheHas(value) {
  return this.__data__.has(value);
}
function SetCache(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function cacheHas(cache2, key) {
  return cache2.has(key);
}
var now = function() {
  return root.Date.now();
};
var FUNC_ERROR_TEXT = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time2) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time2;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time2) {
    lastInvokeTime = time2;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time2) : result;
  }
  function remainingWait(time2) {
    var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time2) {
    var timeSinceLastCall = time2 - lastCallTime, timeSinceLastInvoke = time2 - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time2 = now();
    if (shouldInvoke(time2)) {
      return trailingEdge(time2);
    }
    timerId = setTimeout(timerExpired, remainingWait(time2));
  }
  function trailingEdge(time2) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time2);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time2 = now(), isInvoking = shouldInvoke(time2);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time2;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}
var LARGE_ARRAY_SIZE = 200;
function baseDifference(array, values, iteratee, comparator) {
  var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
  if (!length) {
    return result;
  }
  if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = value;
      value = value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      } else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }
  return result;
}
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject)) : [];
});
const mainView = `_mainView_8bb78af`;
const guilds = `_guilds_672990c`;
const channels = `_channels_d142c78`;
const messages = `_messages_17547c0`;
const guildsInFocus = `_guildsInFocus_a6bc482`;
const channelsInFocus = `_channelsInFocus_e1d5f4d`;
const messagesInFocus = `_messagesInFocus_18db79a`;
const _0$1 = "/assets/0-C3LuFtBl.png";
const _1$1 = "/assets/1-DCNSw7n-.png";
const _2$1 = "/assets/2-sht5JnLZ.png";
const _3$1 = "/assets/3-BY_JS00H.png";
const _4$1 = "/assets/4-CPr48j8Q.png";
const _5$1 = "/assets/5-CbTl1CXk.png";
const _6 = "/assets/6-D33Kty3H.png";
const _7 = "/assets/7-czw_zP85.png";
const DEFAULT_GROUP_DM_AVATARS = Object.freeze([_0$1, _1$1, _2$1, _3$1, _4$1, _5$1, _6, _7]);
const dmItem = `_dmItem_325baf5`;
const aside = `_aside_34fa878`;
const overflow = `_overflow_7d94419`;
const subtitle = `_subtitle_12107ea`;
const avatar$2 = `_avatar_bbd2edf`;
const wrap$2 = `_wrap_69aa166`;
const status_icon = `_status_icon_c4d21f0`;
const chItem = `_chItem_bfa3a95`;
const separator$1 = `_separator_ad4c4ac`;
const selected$2 = `_selected_afd6a2f`;
const unread$1 = `_unread_0be782a`;
const vListItem = `_vListItem_ef211c4`;
const start = `_start_fb5e018`;
const startGuild = `_startGuild_1d513bd`;
const collapsed = `_collapsed_b2213f0`;
const indicator = `_indicator_af69040`;
const icon$5 = `_icon_ee332c0`;
const text$4 = `_text_a1de34d`;
const count = `_count_35cff54`;
const guildName = `_guildName_ee793aa`;
const _0 = "/assets/0-asQLxZky.png";
const _1 = "/assets/1-CUzxu8bQ.png";
const _2 = "/assets/2-bpupQHOk.png";
const _3 = "/assets/3-E5cWIjpP.png";
const _4 = "/assets/4-CGwog4xP.png";
const _5 = "/assets/5-CTkMa-iM.png";
const DEFAULT_AVATARS = Object.freeze([_0, _1, _2, _3, _4, _5]);
var _tmpl$$G = /* @__PURE__ */ template(`<img>`);
function UserAvatarDefault(props) {
  const defaultAvatar = DEFAULT_AVATARS[convertSnowflakeToDate(props.$.id).getTime() % DEFAULT_AVATARS.length];
  const _size = props.size ?? 32;
  console.log("DEFAULT AVATAR", defaultAvatar, DEFAULT_AVATARS, convertSnowflakeToDate(props.$.id));
  return (() => {
    var _el$ = _tmpl$$G();
    setAttribute(_el$, "src", defaultAvatar);
    setAttribute(_el$, "width", _size + "px");
    setAttribute(_el$, "height", _size + "px");
    return _el$;
  })();
}
function UserAvatarGlobal(props) {
  const avatar2 = useStore(() => props.$, "avatar");
  return createComponent(Show, {
    get when() {
      return avatar2();
    },
    get fallback() {
      return createComponent(UserAvatarDefault, {
        get $() {
          return props.$;
        },
        get size() {
          return props.size;
        }
      });
    },
    get children() {
      var _el$2 = _tmpl$$G();
      createRenderEffect(() => setAttribute(_el$2, "src", `https://cdn.discordapp.com/avatars/${props.$.id}/${avatar2()}.png?size=${props.size ?? 32}`));
      return _el$2;
    }
  });
}
function UserAvatarProfile(props) {
  const avatar2 = useStore(() => props.profile, "avatar");
  return createComponent(Show, {
    get when() {
      return avatar2();
    },
    get fallback() {
      return createComponent(UserAvatarGlobal, {
        get $() {
          return props.$;
        },
        get size() {
          return props.size;
        }
      });
    },
    get children() {
      var _el$3 = _tmpl$$G();
      createRenderEffect(() => setAttribute(_el$3, "src", `https://cdn.discordapp.com/guilds/${props.profile.$guild.id}/users/${props.$.id}/avatars/${avatar2()}.png?size=${props.size ?? 32}`));
      return _el$3;
    }
  });
}
function UserAvatarGuild(props) {
  const profile = () => props.$.profiles.get(props.guild.id);
  return createComponent(Show, {
    get when() {
      return profile();
    },
    get fallback() {
      return createComponent(UserAvatarGlobal, {
        get $() {
          return props.$;
        },
        get size() {
          return props.size;
        }
      });
    },
    get children() {
      return createComponent(UserAvatarProfile, {
        get profile() {
          return profile();
        },
        get $() {
          return props.$;
        },
        get size() {
          return props.size;
        }
      });
    }
  });
}
function UserAvatar(props) {
  return createComponent(Switch, {
    get fallback() {
      return createComponent(UserAvatarGlobal, {
        get $() {
          return props.$;
        },
        get size() {
          return props.size;
        }
      });
    },
    get children() {
      return [createComponent(Match, {
        get when() {
          return memo(() => !!props.$.value.bot)() && props.$.value.discriminator == "0000";
        },
        get children() {
          return createComponent(UserAvatarGlobal, {
            get $() {
              return props.$;
            },
            get size() {
              return props.size;
            }
          });
        }
      }), createComponent(Match, {
        get when() {
          return props.guild;
        },
        get children() {
          return createComponent(UserAvatarGuild, {
            get $() {
              return props.$;
            },
            get guild() {
              return props.guild;
            },
            get size() {
              return props.size;
            }
          });
        }
      })];
    }
  });
}
const dnd = "/assets/dnd-Yy40DLM6.png";
const idle = "/assets/idle-TKufV_2e.png";
const online = "/assets/online-BEruAVUH.png";
const offline = "/assets/offline-D88SnI1V.png";
const desktop_dnd = "/assets/desktop_dnd-DaJW4XEk.png";
const desktop_idle = "/assets/desktop_idle-BSPOn2HZ.png";
const desktop_online = "/assets/desktop_online-DrRt3l2O.png";
const mobile_dnd = "/assets/mobile_dnd-CCOVkFJe.png";
const mobile_idle = "/assets/mobile_idle-B89J45jr.png";
const mobile_online = "/assets/mobile_online-_m4rTeLn.png";
const web_dnd = "/assets/web_dnd-Btim_XQS.png";
const web_idle = "/assets/web_idle-Bm46loaD.png";
const web_online = "/assets/web_online-Bk4BKaQz.png";
var JSON_prune = { exports: {} };
var hasRequiredJSON_prune;
function requireJSON_prune() {
  if (hasRequiredJSON_prune) return JSON_prune.exports;
  hasRequiredJSON_prune = 1;
  (function(module) {
    (function() {
      var DEFAULT_MAX_DEPTH = 6;
      var DEFAULT_ARRAY_MAX_LENGTH = 50;
      var DEFAULT_PRUNED_VALUE = '"-pruned-"';
      var seen;
      var iterator;
      var forEachEnumerableOwnProperty = function(obj, callback) {
        for (var k2 in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k2)) callback(k2);
        }
      };
      var forEachEnumerableProperty = function(obj, callback) {
        for (var k2 in obj) callback(k2);
      };
      var forEachProperty = function(obj, callback, excluded) {
        if (obj == null) return;
        excluded = excluded || {};
        Object.getOwnPropertyNames(obj).forEach(function(k2) {
          if (!excluded[k2]) {
            callback(k2);
            excluded[k2] = true;
          }
        });
        forEachProperty(Object.getPrototypeOf(obj), callback, excluded);
      };
      Object.defineProperty(Date.prototype, "toPrunedJSON", { value: Date.prototype.toJSON });
      var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {
        // table of character substitutions
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      };
      function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
          var c = meta[a];
          return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
      }
      var prune2 = function(value, depthDecr, arrayMaxLength) {
        var prunedString = DEFAULT_PRUNED_VALUE;
        var replacer;
        if (typeof depthDecr == "object") {
          var options = depthDecr;
          depthDecr = options.depthDecr;
          arrayMaxLength = options.arrayMaxLength;
          iterator = options.iterator || forEachEnumerableOwnProperty;
          if (options.allProperties) iterator = forEachProperty;
          else if (options.inheritedProperties) iterator = forEachEnumerableProperty;
          if ("prunedString" in options) {
            prunedString = options.prunedString;
          }
          if (options.replacer) {
            replacer = options.replacer;
          }
        } else {
          iterator = forEachEnumerableOwnProperty;
        }
        seen = [];
        depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
        arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
        function str(key, holder, depthDecr2) {
          var i, v, length, partial, value2 = holder[key];
          if (value2 && typeof value2 === "object" && typeof value2.toPrunedJSON === "function") {
            value2 = value2.toPrunedJSON(key);
          }
          if (value2 && typeof value2.toJSON === "function") {
            value2 = value2.toJSON();
          }
          switch (typeof value2) {
            case "string":
              return quote(value2);
            case "number":
              return isFinite(value2) ? String(value2) : "null";
            case "boolean":
            case "null":
              return String(value2);
            case "object":
              if (!value2) {
                return "null";
              }
              var isCircular = seen.indexOf(value2) !== -1;
              if (depthDecr2 <= 0 || isCircular) {
                if (replacer) {
                  var replacement = replacer(value2, prunedString, isCircular, isCircular ? "circular" : "depth");
                  return replacement === void 0 ? void 0 : "" + replacement;
                }
                return prunedString;
              }
              seen.push(value2);
              partial = [];
              if (Object.prototype.toString.apply(value2) === "[object Array]") {
                length = Math.min(value2.length, arrayMaxLength);
                for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value2, depthDecr2 - 1) || "null";
                }
                v = "[" + partial.join(",") + "]";
                if (replacer && value2.length > arrayMaxLength) return replacer(value2, v, false);
                return v;
              }
              if (value2 instanceof RegExp) {
                return quote(value2.toString());
              }
              iterator(value2, function(k2) {
                try {
                  v = str(k2, value2, depthDecr2 - 1);
                  if (v) partial.push(quote(k2) + ":" + v);
                } catch (e) {
                }
              });
              return "{" + partial.join(",") + "}";
            case "function":
            case "undefined":
              return replacer ? replacer(value2, void 0, false) : void 0;
          }
        }
        return str("", { "": value }, depthDecr);
      };
      prune2.log = function() {
        console.log.apply(console, Array.prototype.map.call(arguments, function(v) {
          return JSON.parse(JSON.prune(v));
        }));
      };
      prune2.forEachProperty = forEachProperty;
      module.exports = prune2;
    })();
  })(JSON_prune);
  return JSON_prune.exports;
}
var JSON_pruneExports = requireJSON_prune();
const prune = /* @__PURE__ */ getDefaultExportFromCjs(JSON_pruneExports);
var _tmpl$$F = /* @__PURE__ */ template(`<div style=background:yellow;color:black>Bug report was submitted thank you.`), _tmpl$2$i = /* @__PURE__ */ template(`<div style=background:red;color:white>Error occured while rendering this part. Call 37767`);
const comboEvt = new EventEmitter();
function Fallback(props) {
  const [submitted, setSubmitted] = createSignal(false);
  console.error(props.error);
  const onCombo = async () => {
    if (untrack(submitted)) return;
    const token = await localforage.getItem("token");
    const user2 = untrack(discordClientReady)?.ready.user;
    const number = user2?.phone;
    const email = user2?.email;
    const error = untrack(() => props.error);
    console.error(error);
    const objects_already_pruned = /* @__PURE__ */ new WeakSet();
    const prune_options = {
      replacer: function(value, defaultValue, circular) {
        if (circular) return '"-circular-"';
        if (objects_already_pruned.has(value)) return '"-circular-"';
        objects_already_pruned.add(value);
        if (Array.isArray(value)) return JSON.stringify(value.map((a) => JSON.parse(prune(a, prune_options))));
        if (value == token) return '"XXXXXTOKENXXXXX"';
        if (number && value == number) return '"XXXXXNUMBERXXXXX"';
        if (email && value == email) return '"XXXXXEMAILXXXXX"';
        return defaultValue;
      }
    };
    fetch("", {
      method: "POST",
      body: prune(error, prune_options).replaceAll(token, "XXXXXTOKENXXXXX")
    });
    setSubmitted(true);
  };
  onMount(() => {
    comboEvt.on("combo", onCombo);
  });
  onCleanup(() => {
    comboEvt.off("combo", onCombo);
  });
  return createComponent(Show, {
    get when() {
      return submitted();
    },
    get fallback() {
      return _tmpl$2$i();
    },
    get children() {
      return _tmpl$$F();
    }
  });
}
handleCombo("37767", comboEvt.emit.bind(comboEvt, "combo"));
function CustomErrorBoundary(props) {
  return createComponent(ErrorBoundary, {
    fallback: (error) => createComponent(Fallback, {
      error
    }),
    get children() {
      return props.children;
    }
  });
}
const wrap = `_wrap_163219a`;
const inner = `_inner_e17e43e`;
const marquee = `_marquee_370ef22`;
var _tmpl$$E = /* @__PURE__ */ template(`<div><div>`);
function isElementOverflowing(element) {
  var overflowX = element.offsetWidth < element.scrollWidth, overflowY = element.offsetHeight < element.scrollHeight;
  return overflowX || overflowY;
}
function Marquee(props) {
  let innerEl;
  const [marquee$1, setMarquee] = createSignal(false);
  const [transform2, setTransform] = createSignal("");
  const [time2, setTime] = createSignal(void 0);
  createEffect(() => {
    props.children;
    const element = innerEl;
    setMarquee(isElementOverflowing(element) && element.scrollWidth - element.offsetWidth);
    onCleanup(() => setMarquee(false));
  });
  createEffect(() => {
    let timeout;
    const string = innerEl?.innerText ?? "e".repeat(20);
    const preciseTime = string.length / 15;
    const time22 = Math.ceil(preciseTime) * 1e3 + 2e3;
    setTransform("");
    setTime(void 0);
    const _setTransform = () => {
      setTransform(`translateX(${-untrack(marquee$1) + "px"})`);
      setTime(preciseTime.toFixed(2) + "s");
      timeout = setTimeout(() => {
        setTransform("");
        timeout = setTimeout(_setTransform, time22);
      }, time22);
    };
    if (typeof marquee$1() == "number") {
      timeout = setTimeout(_setTransform, 2e3);
    }
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
  return (() => {
    var _el$ = _tmpl$$E(), _el$2 = _el$.firstChild;
    className(_el$, wrap);
    var _ref$ = innerEl;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : innerEl = _el$2;
    insert(_el$2, () => props.children);
    createRenderEffect((_p$) => {
      var _v$ = time2(), _v$2 = transform2(), _v$3 = {
        [marquee]: typeof marquee$1() == "number",
        [inner]: true
      };
      _v$ !== _p$.e && setStyleProperty(_el$2, "--time", _p$.e = _v$);
      _v$2 !== _p$.t && setStyleProperty(_el$2, "transform", _p$.t = _v$2);
      _p$.a = classList(_el$2, _v$3, _p$.a);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$;
  })();
}
function MarqueeOrNot(props) {
  return createComponent(Show, {
    get when() {
      return props.marquee;
    },
    get fallback() {
      return props.children;
    },
    get children() {
      return createComponent(Marquee, {
        get children() {
          return props.children;
        }
      });
    }
  });
}
var _tmpl$$D = /* @__PURE__ */ template(`<span>`);
function UserLabelNicknameProfile(props) {
  const nick = useStore(() => props.profile, "nick");
  const roles = useStore(() => props.profile, "roles");
  const guild_roles = useStore(() => props.guild, "roles");
  const role2 = () => {
    const _roles = roles();
    return guild_roles().toSorted((a, b) => b.position - a.position).find((a) => {
      return _roles.includes(a.id) && a.color !== 0;
    });
  };
  const color = () => role2()?.color ?? null;
  const children = () => nick() ?? createComponent(UserLabelRelationshipNickname, {
    get $() {
      return props.$;
    }
  });
  const prefix = props.prefix ?? "";
  return createComponent(Show, {
    get when() {
      return color();
    },
    get fallback() {
      return [prefix, memo(children)];
    },
    get children() {
      var _el$ = _tmpl$$D();
      insert(_el$, prefix, null);
      insert(_el$, children, null);
      createRenderEffect((_$p) => style(_el$, props.color ? {
        color: color() && `rgb(${decimal2rgb(color(), true)})` || void 0
      } : void 0, _$p));
      return _el$;
    }
  });
}
function UserLabelNicknameGuild(props) {
  let profile = props.$.profiles.get(props.guild.id);
  if (!profile) {
    profile = props.$.profiles.insert({
      user: props.$.$,
      roles: [],
      nick: null,
      mute: false,
      deaf: false,
      joined_at: "",
      flags: 1
    }, props.guild);
  }
  return createComponent(UserLabelNicknameProfile, mergeProps({
    profile
  }, props));
}
function UserLabelRelationshipNickname(props) {
  const nick = useStore(() => props.$.relationship, "nickname");
  return [memo(() => props.prefix ?? ""), createComponent(Show, {
    get when() {
      return nick();
    },
    get fallback() {
      return createComponent(UserLabelGlobalName, {
        get $() {
          return props.$;
        }
      });
    },
    get children() {
      return nick();
    }
  })];
}
function UserLabelGlobalName(props) {
  const global_name = useStore(() => props.$, "global_name");
  const username2 = useStore(() => props.$, "username");
  return [memo(() => props.prefix ?? ""), memo(() => global_name() || username2())];
}
function UserLabel(props) {
  return createComponent(Show, {
    get when() {
      return props.$;
    },
    fallback: "Error",
    get children() {
      return createComponent(Show, {
        get when() {
          return (
            // if nickname and not a webhook
            memo(() => !!props.nickname)() && !(props.$.value.bot && props.$.value.discriminator == "0000")
          );
        },
        get fallback() {
          return createComponent(UserLabelGlobalName, {
            get prefix() {
              return props.prefix;
            },
            get $() {
              return props.$;
            }
          });
        },
        get children() {
          return createComponent(Show, {
            get when() {
              return props.guild;
            },
            get fallback() {
              return createComponent(UserLabelRelationshipNickname, {
                get prefix() {
                  return props.prefix;
                },
                get $() {
                  return props.$;
                }
              });
            },
            get children() {
              return createComponent(UserLabelNicknameGuild, {
                get prefix() {
                  return props.prefix;
                },
                get $() {
                  return props.$;
                },
                get guild() {
                  return props.guild;
                },
                get color() {
                  return props.color ?? false;
                }
              });
            }
          });
        }
      });
    }
  });
}
var _tmpl$$C = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"clip-rule=evenodd class>`);
const TextIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$C();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$B = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M19.56 2a3 3 0 0 0-2.46 1.28 3.85 3.85 0 0 1-1.86 1.42l-8.9 3.18a.5.5 0 0 0-.34.47v10.09a3 3 0 0 0 2.27 2.9l.62.16c1.57.4 3.15-.56 3.55-2.12a.92.92 0 0 1 1.23-.63l2.36.94c.42.27.79.62 1.07 1.03A3 3 0 0 0 19.56 22h.94c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5h-.94Zm-8.53 15.8L8 16.7v1.73a1 1 0 0 0 .76.97l.62.15c.5.13 1-.17 1.12-.67.1-.41.29-.78.53-1.1Z"clip-rule=evenodd class></path><path fill=currentColor d="M2 10c0-1.1.9-2 2-2h.5c.28 0 .5.22.5.5v7a.5.5 0 0 1-.5.5H4a2 2 0 0 1-2-2v-4Z"class>`);
const AnnouncementIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$B();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$A = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M15 2a3 3 0 0 1 3 3v12H5.5a1.5 1.5 0 0 0 0 3h14a.5.5 0 0 0 .5-.5V5h1a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h10Zm-.3 5.7a1 1 0 0 0-1.4-1.4L9 10.58l-2.3-2.3a1 1 0 0 0-1.4 1.42l3 3a1 1 0 0 0 1.4 0l5-5Z"clip-rule=evenodd class>`);
const RulesIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$A();
  spread(_el$, props, true, true);
  return _el$;
})();
const Message$1 = `_Message_18f341f`;
const mentioned = `_mentioned_d697bcd`;
const deleted = `_deleted_e52b02c`;
const emoji$1 = `_emoji_27ad7fc`;
const bigEmoji = `_bigEmoji_60704f8`;
const text$3 = `_text_e1b4b59`;
const edited = `_edited_69f8707`;
const channelMentionIcon = `_channelMentionIcon_345cf85`;
const chevron = `_chevron_27cffc7`;
const Separator = `_Separator_828525c`;
const avatar_wrapper = `_avatar_wrapper_cf2b9f9`;
const reply = `_reply_e8c2200`;
const label = `_label_04abc37`;
const badge$1 = `_badge_087399d`;
const name$1 = `_name_136fec3`;
const date$1 = `_date_b4593ee`;
const interaction = `_interaction_4aa1523`;
const typing = `_typing_a5050af`;
const user$4 = `_user_0baab17`;
const MessageBox$1 = `_MessageBox_9342b92`;
const noPerm = `_noPerm_6be65c6`;
const header$1 = `_header_db5ee47`;
const texbox_wrap = `_texbox_wrap_11e98d0`;
const hidden$1 = `_hidden_88a8ce0`;
const placeholder = `_placeholder_7f41e96`;
const grow = `_grow_78f9050`;
const bar$1 = `_bar_dded46c`;
const hide$1 = `_hide_022b832`;
const Messages$1 = `_Messages_7e77ec2`;
const listWrap = `_listWrap_9730944`;
const loading = `_loading_ba4c47f`;
const mention = `_mention_329a9aa`;
const hideContent = `_hideContent_4306175`;
const bot = `_bot_1b4d1f6`;
const reactions$1 = `_reactions_19c9aee`;
const button_wrap$1 = `_button_wrap_3c7bb62`;
const reactionButton$1 = `_reactionButton_397d12c`;
const me = `_me_3eb058c`;
const non_uni$1 = `_non_uni_7bec1f2`;
const num$1 = `_num_0667978`;
const spoiler_hidden = `_spoiler_hidden_dfbd3e6`;
const subtext = `_subtext_44fc3ec`;
const forwarded = `_forwarded_9b504d9`;
const message_content = `_message_content_98d0aba`;
const forwarded_header = `_forwarded_header_c7b80a9`;
var _tmpl$$z = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M6 9h1V6a5 5 0 0 1 10 0v3h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Zm9-3v3H9V6a3 3 0 1 1 6 0Zm-1 8a2 2 0 0 1-1 1.73V18a1 1 0 1 1-2 0v-2.27A2 2 0 1 1 14 14Z"clip-rule=evenodd class>`);
const LockIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$z();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$y = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z"class>`);
const ChatIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$y();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$x = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M9.3 5.3a1 1 0 0 0 0 1.4l5.29 5.3-5.3 5.3a1 1 0 1 0 1.42 1.4l6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 0 0-1.42 0Z"class>`);
const ChevronSmallRightIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$x();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$w = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"clip-rule=evenodd class>`);
const SettingsIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$w();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$v = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M19.38 11.38a3 3 0 0 0 4.24 0l.03-.03a.5.5 0 0 0 0-.7L13.35.35a.5.5 0 0 0-.7 0l-.03.03a3 3 0 0 0 0 4.24L13 5l-2.92 2.92-3.65-.34a2 2 0 0 0-1.6.58l-.62.63a1 1 0 0 0 0 1.42l9.58 9.58a1 1 0 0 0 1.42 0l.63-.63a2 2 0 0 0 .58-1.6l-.34-3.64L19 11l.38.38ZM9.07 17.07a.5.5 0 0 1-.08.77l-5.15 3.43a.5.5 0 0 1-.63-.06l-.42-.42a.5.5 0 0 1-.06-.63L6.16 15a.5.5 0 0 1 .77-.08l2.14 2.14Z"class>`);
const PinIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$v();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$u = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="m13.96 5.46 4.58 4.58a1 1 0 0 0 1.42 0l1.38-1.38a2 2 0 0 0 0-2.82l-3.18-3.18a2 2 0 0 0-2.82 0l-1.38 1.38a1 1 0 0 0 0 1.42ZM2.11 20.16l.73-4.22a3 3 0 0 1 .83-1.61l7.87-7.87a1 1 0 0 1 1.42 0l4.58 4.58a1 1 0 0 1 0 1.42l-7.87 7.87a3 3 0 0 1-1.6.83l-4.23.73a1.5 1.5 0 0 1-1.73-1.73Z"class>`);
const PencilIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$u();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$t = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm2.18 13.87a2.9 2.9 0 0 1-1.66-.49 3.18 3.18 0 0 1-1.12-1.35A4.88 4.88 0 0 1 4 12c0-.75.14-1.42.42-2 .29-.59.7-1.04 1.24-1.37a3.7 3.7 0 0 1 1.95-.5c.64 0 1.21.14 1.72.4.5.28.89.67 1.15 1.16l-1.22.88a1.76 1.76 0 0 0-1.64-1.02c-.66 0-1.17.22-1.52.65a2.74 2.74 0 0 0-.53 1.8c0 .78.18 1.39.53 1.81.35.42.86.64 1.52.64.3 0 .57-.06.81-.16.25-.12.45-.27.58-.47v-.93H7.3v-1.4h3.24v4.23H9.27l-.2-.71c-.43.57-1.06.86-1.89.86Zm6.34-.15h-1.57V8.28h1.57v7.44Zm1.51 0h1.57v-2.83h2.76v-1.42H16.6V9.7H20V8.28h-4.97v7.44Z"clip-rule=evenodd class>`);
const GifIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$t();
  spread(_el$, props, true, true);
  return _el$;
})();
var dayjs_min$1 = { exports: {} };
var dayjs_min = dayjs_min$1.exports;
var hasRequiredDayjs_min;
function requireDayjs_min() {
  if (hasRequiredDayjs_min) return dayjs_min$1.exports;
  hasRequiredDayjs_min = 1;
  (function(module, exports) {
    !(function(t, e) {
      module.exports = e();
    })(dayjs_min, (function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M2 = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t2) {
        var e2 = ["th", "st", "nd", "rd"], n2 = t2 % 100;
        return "[" + t2 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
      } }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, v = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date()) return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, c), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return void 0 === t2;
      } }, g = "en", D = {};
      D[g] = M2;
      var p = "$isDayjsObject", S2 = function(t2) {
        return t2 instanceof _ || !(!t2 || !t2[p]);
      }, w = function t2(e2, n2, r2) {
        var i2;
        if (!e2) return g;
        if ("string" == typeof e2) {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1) return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (g = i2), i2 || !r2 && g;
      }, O2 = function(t2, e2) {
        if (S2(t2)) return t2.clone();
        var n2 = "object" == typeof e2 ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, b = v;
      b.l = w, b.i = S2, b.w = function(t2, e2) {
        return O2(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = (function() {
        function M3(t2) {
          this.$L = w(t2.locale, null, true), this.parse(t2), this.$x = this.$x || t2.x || {}, this[p] = true;
        }
        var m2 = M3.prototype;
        return m2.parse = function(t2) {
          this.$d = (function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (null === e2) return /* @__PURE__ */ new Date(NaN);
            if (b.u(e2)) return /* @__PURE__ */ new Date();
            if (e2 instanceof Date) return new Date(e2);
            if ("string" == typeof e2 && !/Z$/i.test(e2)) {
              var r2 = e2.match($);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          })(t2), this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return b;
        }, m2.isValid = function() {
          return !(this.$d.toString() === l);
        }, m2.isSame = function(t2, e2) {
          var n2 = O2(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return O2(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < O2(t2);
        }, m2.$g = function(t2, e2, n2) {
          return b.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t2), l2 = function(t3, e3) {
            var i2 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, $2 = function(t3, e3) {
            return b.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M4 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
          switch (f2) {
            case h:
              return r2 ? l2(1, 0) : l2(31, 11);
            case c:
              return r2 ? l2(1, M4) : l2(0, M4 + 1);
            case o:
              var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
              return l2(r2 ? m3 - D2 : m3 + (6 - D2), M4);
            case a:
            case d:
              return $2(v2 + "Hours", 0);
            case u:
              return $2(v2 + "Minutes", 1);
            case s:
              return $2(v2 + "Seconds", 2);
            case i:
              return $2(v2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = b.p(t2), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === c || o2 === h) {
            var y2 = this.clone().set(d, 1);
            y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else l2 && this.$d[l2]($2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[b.p(t2)]();
        }, m2.add = function(r2, f2) {
          var d2, l2 = this;
          r2 = Number(r2);
          var $2 = b.p(f2), y2 = function(t2) {
            var e2 = O2(l2);
            return b.w(e2.date(e2.date() + Math.round(t2 * r2)), l2);
          };
          if ($2 === c) return this.set(c, this.$M + r2);
          if ($2 === h) return this.set(h, this.$y + r2);
          if ($2 === a) return y2(1);
          if ($2 === o) return y2(7);
          var M4 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M4;
          return b.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid()) return n2.invalidDate || l;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, d2 = function(t3) {
            return b.s(s2 % 12 || 12, t3, "0");
          }, $2 = f2 || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          };
          return r2.replace(y, (function(t3, r3) {
            return r3 || (function(t4) {
              switch (t4) {
                case "YY":
                  return String(e2.$y).slice(-2);
                case "YYYY":
                  return b.s(e2.$y, 4, "0");
                case "M":
                  return a2 + 1;
                case "MM":
                  return b.s(a2 + 1, 2, "0");
                case "MMM":
                  return h2(n2.monthsShort, a2, c2, 3);
                case "MMMM":
                  return h2(c2, a2);
                case "D":
                  return e2.$D;
                case "DD":
                  return b.s(e2.$D, 2, "0");
                case "d":
                  return String(e2.$W);
                case "dd":
                  return h2(n2.weekdaysMin, e2.$W, o2, 2);
                case "ddd":
                  return h2(n2.weekdaysShort, e2.$W, o2, 3);
                case "dddd":
                  return o2[e2.$W];
                case "H":
                  return String(s2);
                case "HH":
                  return b.s(s2, 2, "0");
                case "h":
                  return d2(1);
                case "hh":
                  return d2(2);
                case "a":
                  return $2(s2, u2, true);
                case "A":
                  return $2(s2, u2, false);
                case "m":
                  return String(u2);
                case "mm":
                  return b.s(u2, 2, "0");
                case "s":
                  return String(e2.$s);
                case "ss":
                  return b.s(e2.$s, 2, "0");
                case "SSS":
                  return b.s(e2.$ms, 3, "0");
                case "Z":
                  return i2;
              }
              return null;
            })(t3) || i2.replace(":", "");
          }));
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, l2) {
          var $2, y2 = this, M4 = b.p(d2), m3 = O2(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function() {
            return b.m(y2, m3);
          };
          switch (M4) {
            case h:
              $2 = D2() / 12;
              break;
            case c:
              $2 = D2();
              break;
            case f:
              $2 = D2() / 3;
              break;
            case o:
              $2 = (g2 - v2) / 6048e5;
              break;
            case a:
              $2 = (g2 - v2) / 864e5;
              break;
            case u:
              $2 = g2 / n;
              break;
            case s:
              $2 = g2 / e;
              break;
            case i:
              $2 = g2 / t;
              break;
            default:
              $2 = g2;
          }
          return l2 ? $2 : b.a($2);
        }, m2.daysInMonth = function() {
          return this.endOf(c).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2) return this.$L;
          var n2 = this.clone(), r2 = w(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return b.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M3;
      })(), Y = _.prototype;
      return O2.prototype = Y, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach((function(t2) {
        Y[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      })), O2.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, O2), t2.$i = true), O2;
      }, O2.locale = w, O2.isDayjs = S2, O2.unix = function(t2) {
        return O2(1e3 * t2);
      }, O2.en = D[g], O2.Ls = D, O2.p = {}, O2;
    }));
  })(dayjs_min$1);
  return dayjs_min$1.exports;
}
var dayjs_minExports = requireDayjs_min();
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
const strike = `_strike_48d2f48`;
var _tmpl$$s = /* @__PURE__ */ template(`<div><span>`);
function DateSeparator(props) {
  return (() => {
    var _el$ = _tmpl$$s(), _el$2 = _el$.firstChild;
    className(_el$, strike);
    insert(_el$2, () => props.children);
    return _el$;
  })();
}
const main$1 = `_main_ed67542`;
const icon$4 = `_icon_dda777e`;
const user$3 = `_user_ebdce73`;
const date = `_date_90972e6`;
var _tmpl$$r = /* @__PURE__ */ template(`<div><div></div><div><span>`);
function ActionMessage(props) {
  return (() => {
    var _el$ = _tmpl$$r(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild;
    className(_el$, main$1);
    className(_el$2, icon$4);
    insert(_el$2, createComponent(Dynamic, {
      get component() {
        return props.icon;
      }
    }));
    insert(_el$3, createComponent(Dynamic, {
      get component() {
        return props.before;
      }
    }), _el$4);
    className(_el$4, user$3);
    insert(_el$4, createComponent(UserLabel, {
      nickname: true,
      color: true,
      get $() {
        return props.$;
      },
      get guild() {
        return props.guild;
      }
    }));
    insert(_el$3, createComponent(Dynamic, {
      get component() {
        return props.after;
      }
    }), null);
    createRenderEffect((_$p) => setStyleProperty(_el$2, "color", props.color));
    return _el$;
  })();
}
var _tmpl$$q = /* @__PURE__ */ template(`<svg height=18 width=18 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><path d="m18 0h-18v18h18z"></path><path d="m0 8h14.2l-3.6-3.6 1.4-1.4 6 6-6 6-1.4-1.4 3.6-3.6h-14.2"fill=#3ba55c>`), _tmpl$2$h = /* @__PURE__ */ template(`<small>`);
const greetings = [" joined the party.", " is here.", ["Welcome, ", ". We hope you brought pizza."], ["A wild ", " appeared."], " just landed.", " just slid into the server.", " just showed up!", ["Welcome ", ". Say hi!"], " hopped into the server.", ["Everyone welcome ", "!"], ["Glad you're here, ", "."], ["Good to see you, ", "."], ["Yay you made it, ", "!"]];
function JoinMessage(props) {
  const greeting = createMemo(() => {
    let before2 = "", after2 = "";
    const greet = greetings[Number(new Date(props.$.$.timestamp)) % greetings.length];
    if (typeof greet == "string") {
      after2 = greet;
    } else {
      [before2, after2] = greet;
    }
    return [before2, after2];
  });
  const before = () => greeting()[0];
  const after = () => greeting()[1];
  return createComponent(ActionMessage, {
    get $() {
      return props.$.author;
    },
    get guild() {
      return props.guild;
    },
    icon: () => _tmpl$$q(),
    before: () => before(),
    after: () => [memo(after), " ", memo(() => (() => {
      var _el$2 = _tmpl$2$h();
      className(_el$2, date);
      insert(_el$2, () => timeStamp(props.$.$.timestamp));
      return _el$2;
    })())]
  });
}
var _tmpl$$p = /* @__PURE__ */ template(`<small>`);
function PinnedMessage(props) {
  return createComponent(ActionMessage, {
    get guild() {
      return props.guild;
    },
    get $() {
      return props.$.author;
    },
    before: () => "",
    after: () => [" pinned a message to this channel. ", " ", (() => {
      var _el$ = _tmpl$$p();
      className(_el$, date);
      insert(_el$, () => timeStamp(props.$.$.timestamp));
      return _el$;
    })()],
    icon: () => createComponent(PinIcon, {})
  });
}
var simpleMarkdown$1 = { exports: {} };
var simpleMarkdown = simpleMarkdown$1.exports;
var hasRequiredSimpleMarkdown;
function requireSimpleMarkdown() {
  if (hasRequiredSimpleMarkdown) return simpleMarkdown$1.exports;
  hasRequiredSimpleMarkdown = 1;
  (function(module, exports) {
    (function(global2, factory) {
      module.exports = factory();
    })(simpleMarkdown, (function() {
      var CR_NEWLINE_R = /\r\n?/g;
      var TAB_R = /\t/g;
      var FORMFEED_R = /\f/g;
      var preprocess = function(source) {
        return source.replace(CR_NEWLINE_R, "\n").replace(FORMFEED_R, "").replace(TAB_R, "    ");
      };
      var populateInitialState = function(givenState, defaultState) {
        var state = givenState || {};
        if (defaultState != null) {
          for (var prop in defaultState) {
            if (Object.prototype.hasOwnProperty.call(defaultState, prop)) {
              state[prop] = defaultState[prop];
            }
          }
        }
        return state;
      };
      var parserFor = function(rules2, defaultState) {
        var ruleList = Object.keys(rules2).filter(function(type) {
          var rule = rules2[type];
          if (rule == null || rule.match == null) {
            return false;
          }
          var order = rule.order;
          if ((typeof order !== "number" || !isFinite(order)) && typeof console !== "undefined") {
            console.warn(
              "simple-markdown: Invalid order for rule `" + type + "`: " + String(order)
            );
          }
          return true;
        });
        ruleList.sort(function(typeA, typeB) {
          var ruleA = (
            /** @type {SimpleMarkdown.ParserRule} */
            rules2[typeA]
          );
          var ruleB = (
            /** @type {SimpleMarkdown.ParserRule} */
            rules2[typeB]
          );
          var orderA = ruleA.order;
          var orderB = ruleB.order;
          if (orderA !== orderB) {
            return orderA - orderB;
          }
          var secondaryOrderA = ruleA.quality ? 0 : 1;
          var secondaryOrderB = ruleB.quality ? 0 : 1;
          if (secondaryOrderA !== secondaryOrderB) {
            return secondaryOrderA - secondaryOrderB;
          } else if (typeA < typeB) {
            return -1;
          } else if (typeA > typeB) {
            return 1;
          } else {
            return 0;
          }
        });
        var latestState;
        var nestedParse = function(source, state) {
          var result = [];
          state = state || latestState;
          latestState = state;
          while (source) {
            var ruleType = null;
            var rule = null;
            var capture = null;
            var quality = NaN;
            var i = 0;
            var currRuleType = ruleList[0];
            var currRule = (
              /** @type {SimpleMarkdown.ParserRule} */
              rules2[currRuleType]
            );
            do {
              var currOrder2 = currRule.order;
              var prevCaptureStr = state.prevCapture == null ? "" : state.prevCapture[0];
              var currCapture = currRule.match(source, state, prevCaptureStr);
              if (currCapture) {
                var currQuality = currRule.quality ? currRule.quality(
                  currCapture,
                  state,
                  prevCaptureStr
                ) : 0;
                if (!(currQuality <= quality)) {
                  ruleType = currRuleType;
                  rule = currRule;
                  capture = currCapture;
                  quality = currQuality;
                }
              }
              i++;
              currRuleType = ruleList[i];
              currRule = /*::((*/
              /** @type {SimpleMarkdown.ParserRule} */
              rules2[currRuleType];
            } while (
              // keep looping while we're still within the ruleList
              currRule && // if we don't have a match yet, continue
              (!capture || // or if we have a match, but the next rule is
              // at the same order, and has a quality measurement
              // functions, then this rule must have a quality
              // measurement function (since they are sorted before
              // those without), and we need to check if there is
              // a better quality match
              currRule.order === currOrder2 && currRule.quality)
            );
            if (rule == null || capture == null) {
              throw new Error(
                "Could not find a matching rule for the below content. The rule with highest `order` should always match content provided to it. Check the definition of `match` for '" + ruleList[ruleList.length - 1] + "'. It seems to not match the following source:\n" + source
              );
            }
            if (capture.index) {
              throw new Error(
                "`match` must return a capture starting at index 0 (the current parse index). Did you forget a ^ at the start of the RegExp?"
              );
            }
            var parsed = rule.parse(capture, nestedParse, state);
            if (Array.isArray(parsed)) {
              Array.prototype.push.apply(result, parsed);
            } else {
              if (parsed.type == null) {
                parsed.type = ruleType;
              }
              result.push(
                /** @type {SimpleMarkdown.SingleASTNode} */
                parsed
              );
            }
            state.prevCapture = capture;
            source = source.substring(state.prevCapture[0].length);
          }
          return result;
        };
        var outerParse = function(source, state) {
          latestState = populateInitialState(state, defaultState);
          if (!latestState.inline && !latestState.disableAutoBlockNewlines) {
            source = source + "\n\n";
          }
          latestState.prevCapture = null;
          return nestedParse(preprocess(source), latestState);
        };
        return outerParse;
      };
      var inlineRegex = function(regex) {
        var match = function(source, state) {
          if (state.inline) {
            return regex.exec(source);
          } else {
            return null;
          }
        };
        match.regex = regex;
        return match;
      };
      var blockRegex = function(regex) {
        var match = function(source, state) {
          if (state.inline) {
            return null;
          } else {
            return regex.exec(source);
          }
        };
        match.regex = regex;
        return match;
      };
      var anyScopeRegex = function(regex) {
        var match = function(source, state) {
          return regex.exec(source);
        };
        match.regex = regex;
        return match;
      };
      var TYPE_SYMBOL = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 60103;
      var reactElement = function(type, key, props) {
        var element = (
          /** @type {SimpleMarkdown.ReactElement} */
          {
            $$typeof: TYPE_SYMBOL,
            type,
            key: key == null ? void 0 : key,
            ref: null,
            props,
            _owner: null
          }
        );
        return element;
      };
      var htmlTag = function(tagName, content2, attributes, isClosed) {
        attributes = attributes || {};
        isClosed = typeof isClosed !== "undefined" ? isClosed : true;
        var attributeString = "";
        for (var attr in attributes) {
          var attribute = attributes[attr];
          if (Object.prototype.hasOwnProperty.call(attributes, attr) && attribute) {
            attributeString += " " + sanitizeText(attr) + '="' + sanitizeText(attribute) + '"';
          }
        }
        var unclosedTag = "<" + tagName + attributeString + ">";
        if (isClosed) {
          return unclosedTag + content2 + "</" + tagName + ">";
        } else {
          return unclosedTag;
        }
      };
      var EMPTY_PROPS = {};
      var sanitizeUrl = function(url2) {
        if (url2 == null) {
          return null;
        }
        try {
          var prot = decodeURIComponent(url2).replace(/[^A-Za-z0-9/:]/g, "").toLowerCase();
          if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
            return null;
          }
        } catch (e) {
          return null;
        }
        return url2;
      };
      var SANITIZE_TEXT_R = /[<>&"']/g;
      var SANITIZE_TEXT_CODES = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
        "`": "&#96;"
      };
      var sanitizeText = function(text2) {
        return String(text2).replace(SANITIZE_TEXT_R, function(chr) {
          return SANITIZE_TEXT_CODES[chr];
        });
      };
      var UNESCAPE_URL_R = /\\([^0-9A-Za-z\s])/g;
      var unescapeUrl = function(rawUrlString) {
        return rawUrlString.replace(UNESCAPE_URL_R, "$1");
      };
      var parseInline = function(parse2, content2, state) {
        var isCurrentlyInline = state.inline || false;
        state.inline = true;
        var result = parse2(content2, state);
        state.inline = isCurrentlyInline;
        return result;
      };
      var parseBlock = function(parse2, content2, state) {
        var isCurrentlyInline = state.inline || false;
        state.inline = false;
        var result = parse2(content2 + "\n\n", state);
        state.inline = isCurrentlyInline;
        return result;
      };
      var parseCaptureInline = function(capture, parse2, state) {
        return {
          content: parseInline(parse2, capture[1], state)
        };
      };
      var ignoreCapture = function() {
        return {};
      };
      var LIST_BULLET2 = "(?:[*+-]|\\d+\\.)";
      var LIST_ITEM_PREFIX2 = "( *)(" + LIST_BULLET2 + ") +";
      var LIST_ITEM_PREFIX_R2 = new RegExp("^" + LIST_ITEM_PREFIX2);
      var LIST_ITEM_R2 = new RegExp(
        LIST_ITEM_PREFIX2 + "[^\\n]*(?:\\n(?!\\1" + LIST_BULLET2 + " )[^\\n]*)*(\n|$)",
        "gm"
      );
      var BLOCK_END_R2 = /\n{2,}$/;
      var INLINE_CODE_ESCAPE_BACKTICKS_R = /^ (?= *`)|(` *) $/g;
      var LIST_BLOCK_END_R2 = BLOCK_END_R2;
      var LIST_ITEM_END_R2 = / *\n+$/;
      var LIST_R = new RegExp(
        "^( *)(" + LIST_BULLET2 + ") [\\s\\S]+?(?:\n{2,}(?! )(?!\\1" + LIST_BULLET2 + " )\\n*|\\s*\n*$)"
      );
      var LIST_LOOKBEHIND_R2 = /(?:^|\n)( *)$/;
      var TABLES = (function() {
        var TABLE_ROW_SEPARATOR_TRIM = /^ *\| *| *\| *$/g;
        var TABLE_CELL_END_TRIM = / *$/;
        var TABLE_RIGHT_ALIGN = /^ *-+: *$/;
        var TABLE_CENTER_ALIGN = /^ *:-+: *$/;
        var TABLE_LEFT_ALIGN = /^ *:-+ *$/;
        var parseTableAlignCapture = function(alignCapture) {
          if (TABLE_RIGHT_ALIGN.test(alignCapture)) {
            return "right";
          } else if (TABLE_CENTER_ALIGN.test(alignCapture)) {
            return "center";
          } else if (TABLE_LEFT_ALIGN.test(alignCapture)) {
            return "left";
          } else {
            return null;
          }
        };
        var parseTableAlign = function(source, parse2, state, trimEndSeparators) {
          if (trimEndSeparators) {
            source = source.replace(TABLE_ROW_SEPARATOR_TRIM, "");
          }
          var alignText = source.trim().split("|");
          return alignText.map(parseTableAlignCapture);
        };
        var parseTableRow = function(source, parse2, state, trimEndSeparators) {
          var prevInTable = state.inTable;
          state.inTable = true;
          var tableRow = parse2(source.trim(), state);
          state.inTable = prevInTable;
          var cells = [[]];
          tableRow.forEach(function(node, i) {
            if (node.type === "tableSeparator") {
              if (!trimEndSeparators || i !== 0 && i !== tableRow.length - 1) {
                cells.push([]);
              }
            } else {
              if (node.type === "text" && (tableRow[i + 1] == null || tableRow[i + 1].type === "tableSeparator")) {
                node.content = node.content.replace(TABLE_CELL_END_TRIM, "");
              }
              cells[cells.length - 1].push(node);
            }
          });
          return cells;
        };
        var parseTableCells = function(source, parse2, state, trimEndSeparators) {
          var rowsText = source.trim().split("\n");
          return rowsText.map(function(rowText) {
            return parseTableRow(rowText, parse2, state, trimEndSeparators);
          });
        };
        var parseTable = function(trimEndSeparators) {
          return function(capture, parse2, state) {
            state.inline = true;
            var header2 = parseTableRow(capture[1], parse2, state, trimEndSeparators);
            var align = parseTableAlign(capture[2], parse2, state, trimEndSeparators);
            var cells = parseTableCells(capture[3], parse2, state, trimEndSeparators);
            state.inline = false;
            return {
              type: "table",
              header: header2,
              align,
              cells
            };
          };
        };
        return {
          parseTable: parseTable(true),
          parseNpTable: parseTable(false),
          TABLE_REGEX: /^ *(\|.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,
          NPTABLE_REGEX: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/
        };
      })();
      var LINK_INSIDE = "(?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*";
      var LINK_HREF_AND_TITLE = `\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['"]([\\s\\S]*?)['"])?\\s*`;
      var AUTOLINK_MAILTO_CHECK_R = /mailto:/i;
      var parseRef = function(capture, state, refNode) {
        var ref = (capture[2] || capture[1]).replace(/\s+/g, " ").toLowerCase();
        if (state._defs && state._defs[ref]) {
          var def = state._defs[ref];
          refNode.target = def.target;
          refNode.title = def.title;
        }
        state._refs = state._refs || {};
        state._refs[ref] = state._refs[ref] || [];
        state._refs[ref].push(refNode);
        return refNode;
      };
      var currOrder = 0;
      var defaultRules = {
        Array: {
          react: function(arr, output, state) {
            var oldKey = state.key;
            var result = [];
            for (var i = 0, key = 0; i < arr.length; i++, key++) {
              state.key = "" + i;
              var node = arr[i];
              if (node.type === "text") {
                node = { type: "text", content: node.content };
                for (; i + 1 < arr.length && arr[i + 1].type === "text"; i++) {
                  node.content += arr[i + 1].content;
                }
              }
              result.push(output(node, state));
            }
            state.key = oldKey;
            return result;
          },
          html: function(arr, output, state) {
            var result = "";
            for (var i = 0; i < arr.length; i++) {
              var node = arr[i];
              if (node.type === "text") {
                node = { type: "text", content: node.content };
                for (; i + 1 < arr.length && arr[i + 1].type === "text"; i++) {
                  node.content += arr[i + 1].content;
                }
              }
              result += output(node, state);
            }
            return result;
          }
        },
        heading: {
          order: currOrder++,
          match: blockRegex(/^ *(#{1,6})([^\n]+?)#* *(?:\n *)+\n/),
          parse: function(capture, parse2, state) {
            return {
              level: capture[1].length,
              content: parseInline(parse2, capture[2].trim(), state)
            };
          },
          react: function(node, output, state) {
            return reactElement(
              "h" + node.level,
              state.key,
              {
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("h" + node.level, output(node.content, state));
          }
        },
        nptable: {
          order: currOrder++,
          match: blockRegex(TABLES.NPTABLE_REGEX),
          parse: TABLES.parseNpTable,
          react: null,
          html: null
        },
        lheading: {
          order: currOrder++,
          match: blockRegex(/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/),
          parse: function(capture, parse2, state) {
            return {
              type: "heading",
              level: capture[2] === "=" ? 1 : 2,
              content: parseInline(parse2, capture[1], state)
            };
          },
          react: null,
          html: null
        },
        hr: {
          order: currOrder++,
          match: blockRegex(/^( *[-*_]){3,} *(?:\n *)+\n/),
          parse: ignoreCapture,
          react: function(node, output, state) {
            return reactElement(
              "hr",
              state.key,
              EMPTY_PROPS
            );
          },
          html: function(node, output, state) {
            return "<hr>";
          }
        },
        codeBlock: {
          order: currOrder++,
          match: blockRegex(/^(?:    [^\n]+\n*)+(?:\n *)+\n/),
          parse: function(capture, parse2, state) {
            var content2 = capture[0].replace(/^    /gm, "").replace(/\n+$/, "");
            return {
              lang: void 0,
              content: content2
            };
          },
          react: function(node, output, state) {
            var className2 = node.lang ? "markdown-code-" + node.lang : void 0;
            return reactElement(
              "pre",
              state.key,
              {
                children: reactElement(
                  "code",
                  null,
                  {
                    className: className2,
                    children: node.content
                  }
                )
              }
            );
          },
          html: function(node, output, state) {
            var className2 = node.lang ? "markdown-code-" + node.lang : void 0;
            var codeBlock2 = htmlTag("code", sanitizeText(node.content), {
              class: className2
            });
            return htmlTag("pre", codeBlock2);
          }
        },
        fence: {
          order: currOrder++,
          match: blockRegex(/^ *(`{3,}|~{3,}) *(?:(\S+) *)?\n([\s\S]+?)\n?\1 *(?:\n *)+\n/),
          parse: function(capture, parse2, state) {
            return {
              type: "codeBlock",
              lang: capture[2] || void 0,
              content: capture[3]
            };
          },
          react: null,
          html: null
        },
        blockQuote: {
          order: currOrder++,
          match: blockRegex(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n{2,}/),
          parse: function(capture, parse2, state) {
            var content2 = capture[0].replace(/^ *> ?/gm, "");
            return {
              content: parse2(content2, state)
            };
          },
          react: function(node, output, state) {
            return reactElement(
              "blockquote",
              state.key,
              {
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("blockquote", output(node.content, state));
          }
        },
        list: {
          order: currOrder++,
          match: function(source, state) {
            var prevCaptureStr = state.prevCapture == null ? "" : state.prevCapture[0];
            var isStartOfLineCapture = LIST_LOOKBEHIND_R2.exec(prevCaptureStr);
            var isListBlock = state._list || !state.inline;
            if (isStartOfLineCapture && isListBlock) {
              source = isStartOfLineCapture[1] + source;
              return LIST_R.exec(source);
            } else {
              return null;
            }
          },
          parse: function(capture, parse2, state) {
            var bullet = capture[2];
            var ordered = bullet.length > 1;
            var start2 = ordered ? +bullet : void 0;
            var items = (
              /** @type {string[]} */
              capture[0].replace(LIST_BLOCK_END_R2, "\n").match(LIST_ITEM_R2)
            );
            var lastItemWasAParagraph = false;
            var itemContent = items.map(function(item2, i) {
              var prefixCapture = LIST_ITEM_PREFIX_R2.exec(item2);
              var space = prefixCapture ? prefixCapture[0].length : 0;
              var spaceRegex = new RegExp("^ {1," + space + "}", "gm");
              var content2 = item2.replace(spaceRegex, "").replace(LIST_ITEM_PREFIX_R2, "");
              var isLastItem = i === items.length - 1;
              var containsBlocks = content2.indexOf("\n\n") !== -1;
              var thisItemIsAParagraph = containsBlocks || isLastItem && lastItemWasAParagraph;
              lastItemWasAParagraph = thisItemIsAParagraph;
              var oldStateInline = state.inline;
              var oldStateList = state._list;
              state._list = true;
              var adjustedContent;
              if (thisItemIsAParagraph) {
                state.inline = false;
                adjustedContent = content2.replace(LIST_ITEM_END_R2, "\n\n");
              } else {
                state.inline = true;
                adjustedContent = content2.replace(LIST_ITEM_END_R2, "");
              }
              var result = parse2(adjustedContent, state);
              state.inline = oldStateInline;
              state._list = oldStateList;
              return result;
            });
            return {
              ordered,
              start: start2,
              items: itemContent
            };
          },
          react: function(node, output, state) {
            var ListWrapper = node.ordered ? "ol" : "ul";
            return reactElement(
              ListWrapper,
              state.key,
              {
                start: node.start,
                children: node.items.map(function(item2, i) {
                  return reactElement(
                    "li",
                    "" + i,
                    {
                      children: output(item2, state)
                    }
                  );
                })
              }
            );
          },
          html: function(node, output, state) {
            var listItems = node.items.map(function(item2) {
              return htmlTag("li", output(item2, state));
            }).join("");
            var listTag = node.ordered ? "ol" : "ul";
            var attributes = {
              start: node.start
            };
            return htmlTag(listTag, listItems, attributes);
          }
        },
        def: {
          order: currOrder++,
          // TODO(aria): This will match without a blank line before the next
          // block element, which is inconsistent with most of the rest of
          // simple-markdown.
          match: blockRegex(
            /^ *\[([^\]]+)\]: *<?([^\s>]*)>?(?: +["(]([^\n]+)[")])? *\n(?: *\n)*/
          ),
          parse: function(capture, parse2, state) {
            var def = capture[1].replace(/\s+/g, " ").toLowerCase();
            var target = capture[2];
            var title = capture[3];
            if (state._refs && state._refs[def]) {
              state._refs[def].forEach(function(refNode) {
                refNode.target = target;
                refNode.title = title;
              });
            }
            state._defs = state._defs || {};
            state._defs[def] = {
              target,
              title
            };
            return {
              def,
              target,
              title
            };
          },
          react: function() {
            return null;
          },
          html: function() {
            return "";
          }
        },
        table: {
          order: currOrder++,
          match: blockRegex(TABLES.TABLE_REGEX),
          parse: TABLES.parseTable,
          react: function(node, output, state) {
            var getStyle = function(colIndex) {
              return node.align[colIndex] == null ? {} : {
                textAlign: node.align[colIndex]
              };
            };
            var headers = node.header.map(function(content2, i) {
              return reactElement(
                "th",
                "" + i,
                {
                  style: getStyle(i),
                  scope: "col",
                  children: output(content2, state)
                }
              );
            });
            var rows = node.cells.map(function(row, r) {
              return reactElement(
                "tr",
                "" + r,
                {
                  children: row.map(function(content2, c) {
                    return reactElement(
                      "td",
                      "" + c,
                      {
                        style: getStyle(c),
                        children: output(content2, state)
                      }
                    );
                  })
                }
              );
            });
            return reactElement(
              "table",
              state.key,
              {
                children: [reactElement(
                  "thead",
                  "thead",
                  {
                    children: reactElement(
                      "tr",
                      null,
                      {
                        children: headers
                      }
                    )
                  }
                ), reactElement(
                  "tbody",
                  "tbody",
                  {
                    children: rows
                  }
                )]
              }
            );
          },
          html: function(node, output, state) {
            var getStyle = function(colIndex) {
              return node.align[colIndex] == null ? "" : "text-align:" + node.align[colIndex] + ";";
            };
            var headers = node.header.map(function(content2, i) {
              return htmlTag(
                "th",
                output(content2, state),
                { style: getStyle(i), scope: "col" }
              );
            }).join("");
            var rows = node.cells.map(function(row) {
              var cols = row.map(function(content2, c) {
                return htmlTag(
                  "td",
                  output(content2, state),
                  { style: getStyle(c) }
                );
              }).join("");
              return htmlTag("tr", cols);
            }).join("");
            var thead = htmlTag("thead", htmlTag("tr", headers));
            var tbody = htmlTag("tbody", rows);
            return htmlTag("table", thead + tbody);
          }
        },
        newline: {
          order: currOrder++,
          match: blockRegex(/^(?:\n *)*\n/),
          parse: ignoreCapture,
          react: function(node, output, state) {
            return "\n";
          },
          html: function(node, output, state) {
            return "\n";
          }
        },
        paragraph: {
          order: currOrder++,
          match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)+\n/),
          parse: parseCaptureInline,
          react: function(node, output, state) {
            return reactElement(
              "div",
              state.key,
              {
                className: "paragraph",
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            var attributes = {
              class: "paragraph"
            };
            return htmlTag("div", output(node.content, state), attributes);
          }
        },
        escape: {
          order: currOrder++,
          // We don't allow escaping numbers, letters, or spaces here so that
          // backslashes used in plain text still get rendered. But allowing
          // escaping anything else provides a very flexible escape mechanism,
          // regardless of how this grammar is extended.
          match: inlineRegex(/^\\([^0-9A-Za-z\s])/),
          parse: function(capture, parse2, state) {
            return {
              type: "text",
              content: capture[1]
            };
          },
          react: null,
          html: null
        },
        tableSeparator: {
          order: currOrder++,
          match: function(source, state) {
            if (!state.inTable) {
              return null;
            }
            return /^ *\| */.exec(source);
          },
          parse: function() {
            return { type: "tableSeparator" };
          },
          // These shouldn't be reached, but in case they are, be reasonable:
          react: function() {
            return " | ";
          },
          html: function() {
            return " &vert; ";
          }
        },
        autolink: {
          order: currOrder++,
          match: inlineRegex(/^<([^: >]+:\/[^ >]+)>/),
          parse: function(capture, parse2, state) {
            return {
              type: "link",
              content: [{
                type: "text",
                content: capture[1]
              }],
              target: capture[1]
            };
          },
          react: null,
          html: null
        },
        mailto: {
          order: currOrder++,
          match: inlineRegex(/^<([^ >]+@[^ >]+)>/),
          parse: function(capture, parse2, state) {
            var address = capture[1];
            var target = capture[1];
            if (!AUTOLINK_MAILTO_CHECK_R.test(target)) {
              target = "mailto:" + target;
            }
            return {
              type: "link",
              content: [{
                type: "text",
                content: address
              }],
              target
            };
          },
          react: null,
          html: null
        },
        url: {
          order: currOrder++,
          match: inlineRegex(/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/),
          parse: function(capture, parse2, state) {
            return {
              type: "link",
              content: [{
                type: "text",
                content: capture[1]
              }],
              target: capture[1],
              title: void 0
            };
          },
          react: null,
          html: null
        },
        link: {
          order: currOrder++,
          match: inlineRegex(new RegExp(
            "^\\[(" + LINK_INSIDE + ")\\]\\(" + LINK_HREF_AND_TITLE + "\\)"
          )),
          parse: function(capture, parse2, state) {
            var link = {
              content: parse2(capture[1], state),
              target: unescapeUrl(capture[2]),
              title: capture[3]
            };
            return link;
          },
          react: function(node, output, state) {
            return reactElement(
              "a",
              state.key,
              {
                href: sanitizeUrl(node.target),
                title: node.title,
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            var attributes = {
              href: sanitizeUrl(node.target),
              title: node.title
            };
            return htmlTag("a", output(node.content, state), attributes);
          }
        },
        image: {
          order: currOrder++,
          match: inlineRegex(new RegExp(
            "^!\\[(" + LINK_INSIDE + ")\\]\\(" + LINK_HREF_AND_TITLE + "\\)"
          )),
          parse: function(capture, parse2, state) {
            var image = {
              alt: capture[1],
              target: unescapeUrl(capture[2]),
              title: capture[3]
            };
            return image;
          },
          react: function(node, output, state) {
            return reactElement(
              "img",
              state.key,
              {
                src: sanitizeUrl(node.target),
                alt: node.alt,
                title: node.title
              }
            );
          },
          html: function(node, output, state) {
            var attributes = {
              src: sanitizeUrl(node.target),
              alt: node.alt,
              title: node.title
            };
            return htmlTag("img", "", attributes, false);
          }
        },
        reflink: {
          order: currOrder++,
          match: inlineRegex(new RegExp(
            // The first [part] of the link
            "^\\[(" + LINK_INSIDE + ")\\]\\s*\\[([^\\]]*)\\]"
          )),
          parse: function(capture, parse2, state) {
            return parseRef(capture, state, {
              type: "link",
              content: parse2(capture[1], state)
            });
          },
          react: null,
          html: null
        },
        refimage: {
          order: currOrder++,
          match: inlineRegex(new RegExp(
            // The first [part] of the link
            "^!\\[(" + LINK_INSIDE + ")\\]\\s*\\[([^\\]]*)\\]"
          )),
          parse: function(capture, parse2, state) {
            return parseRef(capture, state, {
              type: "image",
              alt: capture[1]
            });
          },
          react: null,
          html: null
        },
        em: {
          order: currOrder,
          match: inlineRegex(
            new RegExp(
              // only match _s surrounding words.
              "^\\b_((?:__|\\\\[\\s\\S]|[^\\\\_])+?)_\\b|^\\*(?=\\S)((?:\\*\\*|\\\\[\\s\\S]|\\s+(?:\\\\[\\s\\S]|[^\\s\\*\\\\]|\\*\\*)|[^\\s\\*\\\\])+?)\\*(?!\\*)"
            )
          ),
          quality: function(capture) {
            return capture[0].length + 0.2;
          },
          parse: function(capture, parse2, state) {
            return {
              content: parse2(capture[2] || capture[1], state)
            };
          },
          react: function(node, output, state) {
            return reactElement(
              "em",
              state.key,
              {
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("em", output(node.content, state));
          }
        },
        strong: {
          order: currOrder,
          match: inlineRegex(/^\*\*((?:\\[\s\S]|[^\\])+?)\*\*(?!\*)/),
          quality: function(capture) {
            return capture[0].length + 0.1;
          },
          parse: parseCaptureInline,
          react: function(node, output, state) {
            return reactElement(
              "strong",
              state.key,
              {
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("strong", output(node.content, state));
          }
        },
        u: {
          order: currOrder++,
          match: inlineRegex(/^__((?:\\[\s\S]|[^\\])+?)__(?!_)/),
          quality: function(capture) {
            return capture[0].length;
          },
          parse: parseCaptureInline,
          react: function(node, output, state) {
            return reactElement(
              "u",
              state.key,
              {
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("u", output(node.content, state));
          }
        },
        del: {
          order: currOrder++,
          match: inlineRegex(/^~~(?=\S)((?:\\[\s\S]|~(?!~)|[^\s~\\]|\s(?!~~))+?)~~/),
          parse: parseCaptureInline,
          react: function(node, output, state) {
            return reactElement(
              "del",
              state.key,
              {
                children: output(node.content, state)
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("del", output(node.content, state));
          }
        },
        inlineCode: {
          order: currOrder++,
          match: inlineRegex(/^(`+)([\s\S]*?[^`])\1(?!`)/),
          parse: function(capture, parse2, state) {
            return {
              content: capture[2].replace(INLINE_CODE_ESCAPE_BACKTICKS_R, "$1")
            };
          },
          react: function(node, output, state) {
            return reactElement(
              "code",
              state.key,
              {
                children: node.content
              }
            );
          },
          html: function(node, output, state) {
            return htmlTag("code", sanitizeText(node.content));
          }
        },
        br: {
          order: currOrder++,
          match: anyScopeRegex(/^ {2,}\n/),
          parse: ignoreCapture,
          react: function(node, output, state) {
            return reactElement(
              "br",
              state.key,
              EMPTY_PROPS
            );
          },
          html: function(node, output, state) {
            return "<br>";
          }
        },
        text: {
          order: currOrder++,
          // Here we look for anything followed by non-symbols,
          // double newlines, or double-space-newlines
          // We break on any symbol characters so that this grammar
          // is easy to extend without needing to modify this regex
          match: anyScopeRegex(
            /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff]|\n\n| {2,}\n|\w+:\S|$)/
          ),
          parse: function(capture, parse2, state) {
            return {
              content: capture[0]
            };
          },
          react: function(node, output, state) {
            return node.content;
          },
          html: function(node, output, state) {
            return sanitizeText(node.content);
          }
        }
      };
      var ruleOutput = function(rules2, property) {
        if (!property && typeof console !== "undefined") {
          console.warn(
            "simple-markdown ruleOutput should take 'react' or 'html' as the second argument."
          );
        }
        var nestedRuleOutput = function(ast, outputFunc, state) {
          return rules2[ast.type][property](ast, outputFunc, state);
        };
        return nestedRuleOutput;
      };
      var reactFor = function(outputFunc) {
        var nestedOutput = function(ast, state) {
          state = state || {};
          if (Array.isArray(ast)) {
            var oldKey = state.key;
            var result = [];
            var lastResult = null;
            for (var i = 0; i < ast.length; i++) {
              state.key = "" + i;
              var nodeOut = nestedOutput(ast[i], state);
              if (typeof nodeOut === "string" && typeof lastResult === "string") {
                lastResult = lastResult + nodeOut;
                result[result.length - 1] = lastResult;
              } else {
                result.push(nodeOut);
                lastResult = nodeOut;
              }
            }
            state.key = oldKey;
            return result;
          } else {
            return outputFunc(ast, nestedOutput, state);
          }
        };
        return nestedOutput;
      };
      var htmlFor = function(outputFunc) {
        var nestedOutput = function(ast, state) {
          state = state || {};
          if (Array.isArray(ast)) {
            return ast.map(function(node) {
              return nestedOutput(node, state);
            }).join("");
          } else {
            return outputFunc(ast, nestedOutput, state);
          }
        };
        return nestedOutput;
      };
      var outputFor = function(rules2, property, defaultState) {
        if (!property) {
          throw new Error(
            "simple-markdown: outputFor: `property` must be defined. if you just upgraded, you probably need to replace `outputFor` with `reactFor`"
          );
        }
        var latestState;
        var arrayRule = rules2.Array || defaultRules.Array;
        var arrayRuleCheck = arrayRule[property];
        if (!arrayRuleCheck) {
          throw new Error(
            "simple-markdown: outputFor: to join nodes of type `" + property + "` you must provide an `Array:` joiner rule with that type, Please see the docs for details on specifying an Array rule."
          );
        }
        var arrayRuleOutput = arrayRuleCheck;
        var nestedOutput = function(ast, state) {
          state = state || latestState;
          latestState = state;
          if (Array.isArray(ast)) {
            return arrayRuleOutput(ast, nestedOutput, state);
          } else {
            return rules2[ast.type][property](ast, nestedOutput, state);
          }
        };
        var outerOutput = function(ast, state) {
          latestState = populateInitialState(state, defaultState);
          return nestedOutput(ast, latestState);
        };
        return outerOutput;
      };
      var defaultRawParse = parserFor(defaultRules);
      var defaultBlockParse = function(source, state) {
        state = state || {};
        state.inline = false;
        return defaultRawParse(source, state);
      };
      var defaultInlineParse = function(source, state) {
        state = state || {};
        state.inline = true;
        return defaultRawParse(source, state);
      };
      var defaultImplicitParse = function(source, state) {
        var isBlock = BLOCK_END_R2.test(source);
        state = state || {};
        state.inline = !isBlock;
        return defaultRawParse(source, state);
      };
      var defaultReactOutput = outputFor(defaultRules, "react");
      var defaultHtmlOutput = outputFor(defaultRules, "html");
      var markdownToReact = function(source, state) {
        return defaultReactOutput(defaultBlockParse(source, state), state);
      };
      var markdownToHtml = function(source, state) {
        return defaultHtmlOutput(defaultBlockParse(source, state), state);
      };
      var ReactMarkdown = function(props) {
        var divProps = {};
        for (var prop in props) {
          if (prop !== "source" && Object.prototype.hasOwnProperty.call(props, prop)) {
            divProps[prop] = props[prop];
          }
        }
        divProps.children = markdownToReact(props.source);
        return reactElement(
          "div",
          null,
          divProps
        );
      };
      var SimpleMarkdown2 = {
        defaultRules,
        parserFor,
        outputFor,
        inlineRegex,
        blockRegex,
        anyScopeRegex,
        parseInline,
        parseBlock,
        // default wrappers:
        markdownToReact,
        markdownToHtml,
        ReactMarkdown,
        defaultBlockParse,
        defaultInlineParse,
        defaultImplicitParse,
        defaultReactOutput,
        defaultHtmlOutput,
        preprocess,
        sanitizeText,
        sanitizeUrl,
        unescapeUrl,
        htmlTag,
        reactElement,
        // deprecated:
        defaultRawParse,
        ruleOutput,
        reactFor,
        htmlFor,
        defaultParse: function() {
          if (typeof console !== "undefined") {
            console.warn("defaultParse is deprecated, please use `defaultImplicitParse`");
          }
          return defaultImplicitParse.apply(
            null,
            /** @type {any} */
            arguments
          );
        },
        defaultOutput: function() {
          if (typeof console !== "undefined") {
            console.warn("defaultOutput is deprecated, please use `defaultReactOutput`");
          }
          return defaultReactOutput.apply(
            null,
            /** @type {any} */
            arguments
          );
        }
      };
      return SimpleMarkdown2;
    }));
  })(simpleMarkdown$1);
  return simpleMarkdown$1.exports;
}
var simpleMarkdownExports = requireSimpleMarkdown();
const SimpleMarkdown = /* @__PURE__ */ getDefaultExportFromCjs(simpleMarkdownExports);
const ChannelMentionRegex = /^<#(\d{17,20})>/;
const EmojiRegex = /^<(a)?:(\w{2,32}):(\d{17,21})>/;
const RoleMentionRegex = /^<@&(\d{17,20})>/;
const UserMentionRegex = /^<@!?(\d{17,20})>/;
const EveryoneRegex = /^@everyone/;
const HereRegex = /^@here/;
const BlockQuoteRegex = /^( *>>> ([\s\S]*))|^( *> [^\n]*(\n *> [^\n]*)*\n?)/;
const CodeBlockRegex = /^```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/i;
const EmoticonRegex = /^(¯\\_\(ツ\)_\/¯)/;
const SpoilerRegex = /^\|\|([\s\S]+?)\|\|/;
const StrikeThroughRegex = /^~~([\s\S]+?)~~(?!_)/;
const TextRegex = /^[\s\S]+?(?=[^0-9A-Za-z\s]|\n\n|\n|\w+:\S|$)/;
const TimestampRegex = /^<t:(\d+)(?::(R|t|T|d|D|f|F))?>/;
const HeadingRegex = /^(#{1,3}) +([^\n]+?)(\n|$)/;
const everyone = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => EveryoneRegex.exec(source),
  parse: function() {
    return {};
  }
};
const TwemojiRegex = /^((?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])(?:\u200d\u27a1\ufe0f)?|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f(?:\u200d\u27a1\ufe0f)?)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f(?:\u200d\u27a1\ufe0f)?|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83e\uddd1\u200d\ud83e\uddd1\u200d\ud83e\uddd2\u200d\ud83e\uddd2|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83e\uddd1\u200d\ud83e\uddd1\u200d\ud83e\uddd2|\ud83e\uddd1\u200d\ud83e\uddd2\u200d\ud83e\uddd2|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u26d3\ufe0f\u200d\ud83d\udca5|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udf44\u200d\ud83d\udfeb|\ud83c\udf4b\u200d\ud83d\udfe9|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc26\u200d\ud83d\udd25|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83d\ude42\u200d\u2194\ufe0f|\ud83d\ude42\u200d\u2195\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddd1\u200d\ud83e\uddd2|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b|\ud83d\udc26\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[\u00A9\u00AE\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|\ud83e\udef0|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c\udfc3|\ud83d\udeb6|\ud83e\uddce)(?:\ud83c[\udffb-\udfff])?(?:\u200d\u27a1\ufe0f)?|(?:\ud83c[\udf85\udfc2\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4\udeb5\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd\uddcf\uddd1-\udddd\udec3-\udec5\udef1-\udef8]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedc-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude7c\ude80-\ude88\ude90-\udebd\udebf-\udec2\udece-\udedb\udee0-\udee8]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f)/;
const twemoji = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => TwemojiRegex.exec(source),
  parse: function(capture) {
    return {
      name: capture[0]
    };
  }
};
const channel = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => ChannelMentionRegex.exec(source),
  parse: function(capture) {
    return {
      id: capture[1]
    };
  }
};
const timestamp$1 = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => TimestampRegex.exec(source),
  parse: function(capture) {
    return {
      timestamp: capture[1],
      format: capture[2]
    };
  }
};
const extend = (additionalRules, defaultRule) => {
  return Object.assign({}, defaultRule, additionalRules);
};
const blockQuote = extend(
  {
    match: function(source, state, prevSource) {
      return !/^$|\n *$/.test(prevSource) || state.inQuote ? null : BlockQuoteRegex.exec(source);
    },
    parse: function(capture, parse2, state) {
      const all = capture[0];
      const isBlock = Boolean(/^ *>>> ?/.exec(all));
      const removeSyntaxRegex = isBlock ? /^ *>>> ?/ : /^ *> ?/gm;
      const content2 = all.replace(removeSyntaxRegex, "");
      return {
        content: parse2(content2, Object.assign({}, state, { inQuote: true })),
        type: "blockQuote"
      };
    }
  },
  SimpleMarkdown.defaultRules.blockQuote
);
const strikethrough = extend(
  {
    match: SimpleMarkdown.inlineRegex(StrikeThroughRegex)
  },
  SimpleMarkdown.defaultRules.del
);
const codeBlock = extend(
  {
    match: SimpleMarkdown.inlineRegex(CodeBlockRegex),
    parse: function(capture, _parse, state) {
      return {
        lang: (capture[2] || "").trim(),
        content: capture[3] || "",
        inQuote: state.inQuote || false
      };
    }
  },
  SimpleMarkdown.defaultRules.codeBlock
);
const emoji = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => EmojiRegex.exec(source),
  parse: function(capture) {
    return {
      animated: capture[1] === "a",
      name: capture[2],
      id: capture[3]
    };
  }
};
const role = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => RoleMentionRegex.exec(source),
  parse: function(capture) {
    return {
      id: capture[1]
    };
  }
};
const autolink = extend(
  {
    parse: (capture) => {
      return {
        content: [
          {
            type: "text",
            content: capture[1]
          }
        ],
        target: capture[1]
      };
    }
  },
  SimpleMarkdown.defaultRules.autolink
);
const here = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => HereRegex.exec(source),
  parse: function() {
    return {};
  }
};
const emoticon = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: (source) => EmoticonRegex.exec(source),
  parse: function(capture) {
    return {
      type: "text",
      content: capture[1]
    };
  }
};
const user$2 = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => UserMentionRegex.exec(source),
  parse: function(capture) {
    return {
      id: capture[1],
      type: "user"
    };
  }
};
const spoiler = {
  order: 0,
  match: (source) => SpoilerRegex.exec(source),
  parse: function(capture, parse2, state) {
    return {
      content: parse2(capture[1], state)
    };
  }
};
const heading$1 = extend(
  {
    match: function(source, state) {
      if (state.disallowBlock) {
        return null;
      }
      if (state.prevCapture == null || state.prevCapture[0] === "\n" || ["#", "##", "###"].includes(state.prevCapture[1])) {
        return HeadingRegex.exec(source);
      }
      return null;
    },
    parse: function(capture) {
      return {
        type: "heading",
        level: capture[1].length,
        content: [{ type: "text", content: capture[2].trim() }]
      };
    }
  },
  SimpleMarkdown.defaultRules.heading
);
const text$2 = extend(
  {
    match: (source) => TextRegex.exec(source)
  },
  SimpleMarkdown.defaultRules.text
);
const url = extend(
  {
    parse: (capture) => {
      return {
        content: [
          {
            type: "text",
            content: capture[1]
          }
        ],
        target: capture[1]
      };
    }
  },
  SimpleMarkdown.defaultRules.url
);
const em = extend(
  {
    parse: function(capture, parse2, state) {
      const parsed = SimpleMarkdown.defaultRules.em.parse(
        capture,
        parse2,
        Object.assign({}, state, { inEmphasis: true })
      );
      return state.inEmphasis ? parsed.content : parsed;
    }
  },
  SimpleMarkdown.defaultRules.em
);
const br = extend(
  {
    match: SimpleMarkdown.anyScopeRegex(/^\n/)
  },
  SimpleMarkdown.defaultRules.br
);
const LIST_BULLET = "(?:[*-]|\\d+.)";
const LIST_ITEM_PREFIX = "( *)(" + LIST_BULLET + ") +";
const LIST_ITEM_PREFIX_R = new RegExp("^" + LIST_ITEM_PREFIX);
const LIST_LOOKBEHIND_R = /(?:^|\n)( *)$/;
const LIST_ITEM_R = new RegExp(
  LIST_ITEM_PREFIX + "[^\\n]*(?:\\n(?!\\1" + LIST_BULLET + " )[^\\n]*)*(\n|$)",
  "gm"
);
const BLOCK_END_R = /\n{1,}$/;
const LIST_BLOCK_END_R = BLOCK_END_R;
const LIST_ITEM_END_R = / *\n+$/;
const list = extend(
  {
    match: function(source, state) {
      const prevCaptureStr = state.prevCapture == null ? "" : state.prevCapture[0];
      const isStartOfLineCapture = LIST_LOOKBEHIND_R.exec(prevCaptureStr);
      const allowList = (!state.disallowBlock || (state.listDepth ?? 0) > 0) && (state.listDepth ?? 0) < 11;
      let result = "";
      let initialPrefix = null;
      let initialBullet = null;
      if (isStartOfLineCapture && allowList) {
        while (source.length) {
          const m = LIST_ITEM_PREFIX_R.exec(source);
          if (m == null) {
            return result.length === 0 ? null : [result, initialPrefix, initialBullet];
          }
          const [, prefix, bullet] = [...m];
          initialPrefix ?? (initialPrefix = prefix);
          initialBullet ?? (initialBullet = bullet);
          if (initialPrefix.length > prefix.length) {
            return [result, initialPrefix, initialBullet];
          }
          const idx = source.indexOf("\n");
          if (idx === -1) {
            result += source;
            return [result, initialPrefix, initialBullet];
          }
          result += source.slice(0, idx + 1);
          source = source.slice(idx + 1);
        }
        return result.length === 0 ? null : [result, initialPrefix, initialBullet];
      } else {
        return null;
      }
    },
    parse: function(capture, parse2, state) {
      const listDepth = state.listDepth;
      const disallowBlock = state.disallowBlock;
      state.disallowBlock = true;
      state.listDepth = (state.listDepth ?? 0) + 1;
      const bullet = capture[2];
      const ordered = bullet.length > 1;
      const start2 = ordered ? +bullet : void 0;
      const items = (
        /** @type {string[]} */
        capture[0].replace(LIST_BLOCK_END_R, "").match(LIST_ITEM_R)
      );
      const itemContent = items.map(function(item2) {
        const prefixCapture = LIST_ITEM_PREFIX_R.exec(item2);
        const space = prefixCapture ? prefixCapture[0].length : 0;
        const spaceRegex = new RegExp("^ {1," + space + "}", "gm");
        const content2 = item2.replace(spaceRegex, "").replace(LIST_ITEM_PREFIX_R, "");
        const adjustedContent = content2.replace(LIST_ITEM_END_R, "");
        const result = parse2(adjustedContent, state);
        return result;
      });
      state.listDepth = listDepth;
      state.disallowBlock = disallowBlock;
      return {
        ordered,
        start: start2,
        items: itemContent
      };
    }
  },
  SimpleMarkdown.defaultRules.list
);
const rules = {
  blockQuote,
  codeBlock,
  newline: SimpleMarkdown.defaultRules.newline,
  escape: SimpleMarkdown.defaultRules.escape,
  autolink,
  url,
  em,
  strong: SimpleMarkdown.defaultRules.strong,
  underline: SimpleMarkdown.defaultRules.u,
  strikethrough,
  inlineCode: SimpleMarkdown.defaultRules.inlineCode,
  text: text$2,
  emoticon,
  br,
  spoiler,
  heading: heading$1,
  list,
  link: SimpleMarkdown.defaultRules.link,
  // discord specific
  user: user$2,
  channel,
  role,
  emoji,
  everyone,
  here,
  twemoji,
  timestamp: timestamp$1
};
SimpleMarkdown.parserFor(rules);
const markdown = `_markdown_241ac09`;
const inline$1 = `_inline_47133f7`;
function WorkerWrapper(options) {
  return new Worker(
    "/assets/worker-G6Xy4i2d.js",
    {
      name: options?.name
    }
  );
}
const wrapped = wrap$3(new WorkerWrapper());
const findByShortCode = wrapped.findByShortCode;
const fuzzySearch = wrapped.fuzzySearch;
const preloadSearch = wrapped.preloadSearch;
const webp = wrapped.webp;
const rlottie = {
  loadRlottie: wrapped.loadRlottie,
  isCached: wrapped.isCached,
  loadAnimation: wrapped.loadAnimation,
  requestFrame: wrapped.requestFrame
};
const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $HAS = Symbol("store-has"), $SELF = Symbol("store-self");
function wrap$1(value) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value), desc2 = Object.getOwnPropertyDescriptors(value), proto = Object.getPrototypeOf(value);
      const isClass = proto !== null && value !== null && typeof value === "object" && !Array.isArray(value) && proto !== Object.prototype;
      if (isClass) {
        const descriptors = Object.getOwnPropertyDescriptors(proto);
        keys.push(...Object.keys(descriptors));
        Object.assign(desc2, descriptors);
      }
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (isClass && prop === "constructor") continue;
        if (desc2[prop].get) {
          Object.defineProperty(value, prop, {
            configurable: true,
            enumerable: desc2[prop].enumerable,
            get: desc2[prop].get.bind(p)
          });
        }
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item2, set = /* @__PURE__ */ new Set()) {
  let result, unwrapped, v, prop;
  if (result = item2 != null && item2[$RAW]) return result;
  if (!isWrappable(item2) || set.has(item2)) return item2;
  if (Array.isArray(item2)) {
    if (Object.isFrozen(item2)) item2 = item2.slice(0);
    else set.add(item2);
    for (let i = 0, l = item2.length; i < l; i++) {
      v = item2[i];
      if ((unwrapped = unwrap(v, set)) !== v) item2[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item2)) item2 = Object.assign({}, item2);
    else set.add(item2);
    const keys = Object.keys(item2), desc2 = Object.getOwnPropertyDescriptors(item2);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc2[prop].get) continue;
      v = item2[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item2[prop] = unwrapped;
    }
  }
  return item2;
}
function getNodes(target, symbol) {
  let nodes = target[symbol];
  if (!nodes) Object.defineProperty(target, symbol, {
    value: nodes = /* @__PURE__ */ Object.create(null)
  });
  return nodes;
}
function getNode(nodes, property, value) {
  if (nodes[property]) return nodes[property];
  const [s, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s.$ = set;
  return nodes[property] = s;
}
function proxyDescriptor$1(target, property) {
  const desc2 = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc2 || desc2.get || !desc2.configurable || property === $PROXY || property === $NODE) return desc2;
  delete desc2.value;
  delete desc2.writable;
  desc2.get = () => target[$PROXY][property];
  return desc2;
}
function trackSelf(target) {
  getListener() && getNode(getNodes(target, $NODE), $SELF)();
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getNodes(target, $NODE);
    const tracked = nodes[property];
    let value = tracked ? tracked() : target[property];
    if (property === $NODE || property === $HAS || property === "__proto__") return value;
    if (!tracked) {
      const desc2 = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || Object.prototype.hasOwnProperty.call(target, property)) && !(desc2 && desc2.get)) value = getNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === $HAS || property === "__proto__") return true;
    getListener() && getNode(getNodes(target, $HAS), property)();
    return property in target;
  },
  set() {
    console.warn("Cannot mutate a Store directly");
    return true;
  },
  deleteProperty() {
    console.warn("Cannot mutate a Store directly");
    return true;
  },
  ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor$1
};
function setProperty(state, property, value, deleting = false) {
  if (property === "__proto__") {
    console.warn(`Refusing to set "__proto__" on a store.`);
    return;
  }
  if (!deleting && state[property] === value) return;
  const prev = state[property], len = state.length;
  if (value === void 0) {
    delete state[property];
    if (state[$HAS] && state[$HAS][property] && prev !== void 0) state[$HAS][property].$();
  } else {
    state[property] = value;
    if (state[$HAS] && state[$HAS][property] && prev === void 0) state[$HAS][property].$();
  }
  let nodes = getNodes(state, $NODE), node;
  if (node = getNode(nodes, property, prev)) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) {
    for (let i = state.length; i < len; i++) (node = nodes[i]) && node.$();
    (node = getNode(nodes, "length", len)) && node.$(state.length);
  }
  (node = nodes[$SELF]) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (isUnsafeKey$1(key)) continue;
    setProperty(state, key, value[key]);
  }
}
function isUnsafeKey$1(property) {
  return property === "__proto__" || property === "constructor" || property === "prototype";
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0, len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part, prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part, isArray2 = Array.isArray(current);
    if (partType === "string" && (part === "__proto__" || path.length > 1 && isUnsafeKey$1(part))) {
      console.warn(`Refusing to traverse unsafe key "${part}" on a store.`);
      return;
    }
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray2 && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray2 && partType === "object") {
      const {
        from: from2 = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from2; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === void 0 && value == void 0) return;
  value = unwrap(value);
  if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(store, options) {
  const unwrappedStore = unwrap(store || {});
  const isArray2 = Array.isArray(unwrappedStore);
  if (typeof unwrappedStore !== "object" && typeof unwrappedStore !== "function") throw new Error(`Unexpected type ${typeof unwrappedStore} received when initializing 'createStore'. Expected an object.`);
  const wrappedStore = wrap$1(unwrappedStore);
  DEV.registerGraph({
    value: unwrappedStore,
    name: options && options.name
  });
  function setStore(...args) {
    batch(() => {
      isArray2 && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}
const $ROOT = Symbol("store-root");
function isUnsafeKey(property) {
  return property === "__proto__" || property === "constructor" || property === "prototype";
}
function applyState(target, parent, property, merge, key) {
  if (isUnsafeKey(property)) return;
  const previous = parent[property];
  if (target === previous) return;
  const isArray2 = Array.isArray(target);
  if (property !== $ROOT && (!isWrappable(target) || !isWrappable(previous) || isArray2 !== Array.isArray(previous) || key && target[key] !== previous[key])) {
    setProperty(parent, property, target);
    return;
  }
  if (isArray2) {
    if (target.length && previous.length && (!merge || key && target[0] && target[0][key] != null)) {
      let i, j2, start2, end, newEnd, item2, newIndicesNext, keyVal;
      for (start2 = 0, end = Math.min(previous.length, target.length); start2 < end && (previous[start2] === target[start2] || key && previous[start2] && target[start2] && previous[start2][key] && previous[start2][key] === target[start2][key]); start2++) {
        applyState(target[start2], previous, start2, merge, key);
      }
      const temp = new Array(target.length), newIndices = /* @__PURE__ */ new Map();
      for (end = previous.length - 1, newEnd = target.length - 1; end >= start2 && newEnd >= start2 && (previous[end] === target[newEnd] || key && previous[end] && target[newEnd] && previous[end][key] && previous[end][key] === target[newEnd][key]); end--, newEnd--) {
        temp[newEnd] = previous[end];
      }
      if (start2 > newEnd || start2 > end) {
        for (j2 = start2; j2 <= newEnd; j2++) setProperty(previous, j2, target[j2]);
        for (; j2 < target.length; j2++) {
          setProperty(previous, j2, temp[j2]);
          applyState(target[j2], previous, j2, merge, key);
        }
        if (previous.length > target.length) setProperty(previous, "length", target.length);
        return;
      }
      newIndicesNext = new Array(newEnd + 1);
      for (j2 = newEnd; j2 >= start2; j2--) {
        item2 = target[j2];
        keyVal = key && item2 ? item2[key] : item2;
        i = newIndices.get(keyVal);
        newIndicesNext[j2] = i === void 0 ? -1 : i;
        newIndices.set(keyVal, j2);
      }
      for (i = start2; i <= end; i++) {
        item2 = previous[i];
        keyVal = key && item2 ? item2[key] : item2;
        j2 = newIndices.get(keyVal);
        if (j2 !== void 0 && j2 !== -1) {
          temp[j2] = previous[i];
          j2 = newIndicesNext[j2];
          newIndices.set(keyVal, j2);
        }
      }
      for (j2 = start2; j2 < target.length; j2++) {
        if (j2 in temp) {
          setProperty(previous, j2, temp[j2]);
          applyState(target[j2], previous, j2, merge, key);
        } else setProperty(previous, j2, target[j2]);
      }
    } else {
      for (let i = 0, len = target.length; i < len; i++) {
        applyState(target[i], previous, i, merge, key);
      }
    }
    if (previous.length > target.length) setProperty(previous, "length", target.length);
    return;
  }
  const targetKeys = Object.keys(target);
  for (let i = 0, len = targetKeys.length; i < len; i++) {
    if (isUnsafeKey(targetKeys[i])) continue;
    applyState(target[targetKeys[i]], previous, targetKeys[i], merge, key);
  }
  const previousKeys = Object.keys(previous);
  for (let i = 0, len = previousKeys.length; i < len; i++) {
    if (target[previousKeys[i]] === void 0) setProperty(previous, previousKeys[i], void 0);
  }
}
function reconcile(value, options = {}) {
  const {
    merge,
    key = "id"
  } = options, v = unwrap(value);
  return (state) => {
    if (!isWrappable(state) || !isWrappable(v)) return v;
    const res = applyState(v, {
      [$ROOT]: state
    }, $ROOT, merge, key);
    return res === void 0 ? state : res;
  };
}
const embeds = `_embeds_e87900c`;
const embed = `_embed_eb24f59`;
const embedDesc = `_embed-desc_b8c17a1`;
const timestamp = `_timestamp_52a1c87`;
const field = `_field_7e3a4d4`;
const inline = `_inline_0827b33`;
const embedAName = `_embed-a-name_eb17ee0`;
const embedPName = `_embed-p-name_2fbde42`;
const fieldT = `_field-t_f227928`;
const embedTitle = `_embed-title_38b47b1`;
const thumbhash = `_thumbhash_446bd4b`;
const layer = `_layer_94b917d`;
const hide = `_hide_a838fb0`;
const default_attachment = `_default_attachment_475b99d`;
const icon$3 = `_icon_d2fb820`;
const text$1 = `_text_c4ee832`;
const size = `_size_4912dd1`;
const audio = `_audio_7cc859a`;
const button = `_button_3a6e8f5`;
const secs = `_secs_38b2c52`;
const playing = `_playing_e09a4ca`;
const video = `_video_c344cb0`;
const backdrop = `_backdrop_ae2c722`;
const play = `_play_0dc7122`;
function thumbHashToRGBA(hash) {
  let { PI, min, max, cos, round } = Math;
  let header24 = hash[0] | hash[1] << 8 | hash[2] << 16;
  let header16 = hash[3] | hash[4] << 8;
  let l_dc = (header24 & 63) / 63;
  let p_dc = (header24 >> 6 & 63) / 31.5 - 1;
  let q_dc = (header24 >> 12 & 63) / 31.5 - 1;
  let l_scale = (header24 >> 18 & 31) / 31;
  let hasAlpha = header24 >> 23;
  let p_scale = (header16 >> 3 & 63) / 63;
  let q_scale = (header16 >> 9 & 63) / 63;
  let isLandscape = header16 >> 15;
  let lx = max(3, isLandscape ? hasAlpha ? 5 : 7 : header16 & 7);
  let ly = max(3, isLandscape ? header16 & 7 : hasAlpha ? 5 : 7);
  let a_dc = hasAlpha ? (hash[5] & 15) / 15 : 1;
  let a_scale = (hash[5] >> 4) / 15;
  let ac_start = hasAlpha ? 6 : 5;
  let ac_index = 0;
  let decodeChannel = (nx, ny, scale) => {
    let ac = [];
    for (let cy = 0; cy < ny; cy++)
      for (let cx = cy ? 0 : 1; cx * ny < nx * (ny - cy); cx++)
        ac.push(((hash[ac_start + (ac_index >> 1)] >> ((ac_index++ & 1) << 2) & 15) / 7.5 - 1) * scale);
    return ac;
  };
  let l_ac = decodeChannel(lx, ly, l_scale);
  let p_ac = decodeChannel(3, 3, p_scale * 1.25);
  let q_ac = decodeChannel(3, 3, q_scale * 1.25);
  let a_ac = hasAlpha && decodeChannel(5, 5, a_scale);
  let ratio = thumbHashToApproximateAspectRatio(hash);
  let w = round(ratio > 1 ? 32 : 32 * ratio);
  let h = round(ratio > 1 ? 32 / ratio : 32);
  let rgba = new Uint8Array(w * h * 4), fx = [], fy = [];
  for (let y = 0, i = 0; y < h; y++) {
    for (let x2 = 0; x2 < w; x2++, i += 4) {
      let l = l_dc, p = p_dc, q = q_dc, a = a_dc;
      for (let cx = 0, n = max(lx, hasAlpha ? 5 : 3); cx < n; cx++)
        fx[cx] = cos(PI / w * (x2 + 0.5) * cx);
      for (let cy = 0, n = max(ly, hasAlpha ? 5 : 3); cy < n; cy++)
        fy[cy] = cos(PI / h * (y + 0.5) * cy);
      for (let cy = 0, j2 = 0; cy < ly; cy++)
        for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx * ly < lx * (ly - cy); cx++, j2++)
          l += l_ac[j2] * fx[cx] * fy2;
      for (let cy = 0, j2 = 0; cy < 3; cy++) {
        for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx < 3 - cy; cx++, j2++) {
          let f = fx[cx] * fy2;
          p += p_ac[j2] * f;
          q += q_ac[j2] * f;
        }
      }
      if (hasAlpha)
        for (let cy = 0, j2 = 0; cy < 5; cy++)
          for (let cx = cy ? 0 : 1, fy2 = fy[cy] * 2; cx < 5 - cy; cx++, j2++)
            a += a_ac[j2] * fx[cx] * fy2;
      let b = l - 2 / 3 * p;
      let r = (3 * l - b + q) / 2;
      let g = r - q;
      rgba[i] = max(0, 255 * min(1, r));
      rgba[i + 1] = max(0, 255 * min(1, g));
      rgba[i + 2] = max(0, 255 * min(1, b));
      rgba[i + 3] = max(0, 255 * min(1, a));
    }
  }
  return { w, h, rgba };
}
function thumbHashToApproximateAspectRatio(hash) {
  let header2 = hash[3];
  let hasAlpha = hash[2] & 128;
  let isLandscape = hash[4] & 128;
  let lx = isLandscape ? hasAlpha ? 5 : 7 : header2 & 7;
  let ly = isLandscape ? header2 & 7 : hasAlpha ? 5 : 7;
  return lx / ly;
}
function rgbaToDataURL(w, h, rgba) {
  let row = w * 4 + 1;
  let idat = 6 + h * (5 + row);
  let bytes = [
    137,
    80,
    78,
    71,
    13,
    10,
    26,
    10,
    0,
    0,
    0,
    13,
    73,
    72,
    68,
    82,
    0,
    0,
    w >> 8,
    w & 255,
    0,
    0,
    h >> 8,
    h & 255,
    8,
    6,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    idat >>> 24,
    idat >> 16 & 255,
    idat >> 8 & 255,
    idat & 255,
    73,
    68,
    65,
    84,
    120,
    1
  ];
  let table = [
    0,
    498536548,
    997073096,
    651767980,
    1994146192,
    1802195444,
    1303535960,
    1342533948,
    -306674912,
    -267414716,
    -690576408,
    -882789492,
    -1687895376,
    -2032938284,
    -1609899400,
    -1111625188
  ];
  let a = 1, b = 0;
  for (let y = 0, i = 0, end = row - 1; y < h; y++, end += row - 1) {
    bytes.push(y + 1 < h ? 0 : 1, row & 255, row >> 8, ~row & 255, row >> 8 ^ 255, 0);
    for (b = (b + a) % 65521; i < end; i++) {
      let u = rgba[i] & 255;
      bytes.push(u);
      a = (a + u) % 65521;
      b = (b + a) % 65521;
    }
  }
  bytes.push(
    b >> 8,
    b & 255,
    a >> 8,
    a & 255,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    73,
    69,
    78,
    68,
    174,
    66,
    96,
    130
  );
  for (let [start2, end] of [[12, 29], [37, 41 + idat]]) {
    let c = -1;
    for (let i = start2; i < end; i++) {
      c ^= bytes[i];
      c = c >>> 4 ^ table[c & 15];
      c = c >>> 4 ^ table[c & 15];
    }
    c = ~c;
    bytes[end++] = c >>> 24;
    bytes[end++] = c >> 16 & 255;
    bytes[end++] = c >> 8 & 255;
    bytes[end++] = c & 255;
  }
  return "data:image/png;base64," + btoa(String.fromCharCode(...bytes));
}
function webp2png(url2) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.set("new-image", new File([], "", { type: "application/octet-stream" }));
    form.set(
      "new-image-url",
      // URL
      //"https://cdn.discordapp.com/emojis/859084460489965598.webp?size=240&quality=lossless"
      url2
    );
    xhr.open("POST", "https://ezgif.com/webp-to-png", true);
    xhr.onload = function() {
      if (this.readyState == XMLHttpRequest.DONE) {
        const redirect_location = this.responseURL;
        const xhr2 = new XMLHttpRequest();
        const file_name = redirect_location.split("/").at(-1);
        const form2 = new FormData();
        form2.set("file", file_name);
        form2.set("ajax", "true");
        xhr2.onreadystatechange = null;
        xhr2.open("POST", redirect_location + "?ajax=true", true);
        xhr2.responseType = "document";
        xhr2.onload = function() {
          if (this.status === 200) {
            const src = this.response.querySelector("img")?.src;
            if (!src) {
              reject(new Error("Image not found"));
              return;
            }
            const xhr3 = new XMLHttpRequest();
            xhr3.open("GET", src, true);
            xhr3.responseType = "blob";
            xhr3.onload = function() {
              if (this.status === 200) {
                const blob = this.response;
                resolve(URL.createObjectURL(blob));
              }
            };
            xhr3.send();
          } else {
            reject(new Error(this.statusText));
          }
        };
        xhr2.send(form2);
      }
    };
    xhr.send(form);
  });
}
const zoom = `_zoom_1d8718d`;
const contain = `_contain_0265390`;
const no_contain = `_no_contain_77f2b24`;
const transition = `_transition_d464585`;
const visible = `_visible_480b14a`;
const hidden = `_hidden_bfe19f3`;
class Matrix {
  constructor(svg) {
    this.svg = svg || document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.vtm = this.createSVGMatrix();
    this.x = 0;
    this.y = 0;
    this.captureScale = 1;
  }
  clamp(scale, in_x, in_y, ratio) {
    let xx = (window.innerWidth - ratio.width) / 2;
    let yy = (window.innerHeight - ratio.height) / 2;
    let limit_max_right_formula = xx * scale + ratio.width * scale - window.innerWidth;
    let same_x = Math.min(this.vtm.e * 1, 0);
    let same_y = Math.min(this.vtm.f * 1, 0);
    let value1 = in_x > 0 ? same_x : -(xx * scale);
    let value2 = in_x > 0 ? same_x : -limit_max_right_formula;
    let limit_x_axis = this.vtm.e;
    limit_x_axis = Math.max(value2, this.vtm.e);
    limit_x_axis = Math.min(value1, limit_x_axis);
    let limit_max_bottom_formula = yy * scale + ratio.height * scale - window.innerHeight;
    let limit_max_top = in_y > 0 ? same_y : -(yy * scale);
    let limit_max_bottom = in_y > 0 ? same_y : -limit_max_bottom_formula;
    let limit_y_axis = this.vtm.f;
    limit_y_axis = Math.min(limit_max_top, limit_y_axis);
    limit_y_axis = Math.max(limit_y_axis, limit_max_bottom);
    this.vtm = this.createSVGMatrix().translate(limit_x_axis, limit_y_axis).scale(Math.max(this.vtm.a, 1));
  }
  createSVGMatrix() {
    return this.svg.createSVGMatrix();
  }
  move(x2, y, in_x, in_y, ratio) {
    this.vtm = this.createSVGMatrix().translate(this.x - x2, this.y - y).scale(this.vtm.a);
    this.clamp(this.vtm.a, in_x, in_y, ratio);
    return this.vtm;
  }
  scale(xFactor, yFactor, origin, in_x, in_y, ratio, max, value, dir) {
    if ((value >= max || this.stop) && dir === 1) {
      this.stop = true;
      if (!this.deb) {
        this.captureScale = this.vtm.a;
        this.vtm = this.createSVGMatrix().translate(origin.x, origin.y).scale(max / this.captureScale).translate(-origin.x, -origin.y).translate(this.vtm.e, this.vtm.f).scale(this.captureScale);
        this.deb = true;
      }
      return this.vtm;
    } else {
      this.stop = false;
    }
    this.vtm = this.createSVGMatrix().translate(origin.x, origin.y).scale(xFactor, yFactor).translate(-origin.x, -origin.y).multiply(this.vtm);
    let pre_scale = Math.min(Math.max(1, this.vtm.a), max);
    this.clamp(pre_scale, in_x, in_y, ratio);
    return this.vtm;
  }
}
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio, ratio };
}
var _tmpl$$o = /* @__PURE__ */ template(`<img alt=svelte-zoom>`);
function Zoom(props) {
  const [_props, $$props] = splitProps(props, ["maxScale", "scaleValue", "src"]);
  let imgEl;
  const maxScale = _props.maxScale ?? 11;
  const [transform2, setTransform] = createSignal(void 0);
  const [scaleValue, setScaleValue] = createSignal(_props.scaleValue ?? 1);
  const [src, setSrc] = createSignal("");
  createEffect(() => {
    setSrc(_props.src || "");
    let timeout;
    const img = imgEl;
    if (!img) return;
    const loaded = () => img.complete && img.naturalHeight !== 0;
    if (!loaded()) {
      timeout = setTimeout(async () => {
        if (!loaded()) {
          setSrc("");
          await sleep(100);
          setSrc(_props.src || "");
        }
      }, 1e3);
    }
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
  const xY = {
    initX: 0,
    initY: 0,
    newX: 0,
    newY: 0
  };
  const matrix = new Matrix();
  let ratio;
  const [contain$1, setContain] = createSignal(null);
  const [smooth, setSmooth] = createSignal(true);
  const [scaling, setScaling] = createSignal(false);
  const fireManualZoom = function(dir) {
    const _matrix = matrix, _ratio = ratio;
    const {
      innerHeight,
      innerWidth
    } = window;
    const xFactor = 1 + 0.2 * dir;
    const yFactor = xFactor * innerHeight / innerWidth;
    let in_x = (innerWidth - _ratio.width * _matrix.vtm.a) / 2;
    let in_y = (innerHeight - _ratio.height * _matrix.vtm.a) / 2;
    const origin = {
      x: innerWidth / 2,
      y: innerHeight / 2
    };
    const mat = _matrix.scale(xFactor, yFactor, origin, in_x, in_y, _ratio, maxScale, untrack(scaleValue) * xFactor, dir);
    setTransform(`translate(${mat.e}px,${mat.f}px) scale(${mat.d})`);
    setScaleValue(mat.d);
  };
  const moveImage = function(x2, y) {
    const {
      innerWidth,
      innerHeight
    } = window;
    const [a, b] = [innerWidth / 2, innerHeight / 2];
    fireDown(a, b);
    setSmooth(false);
    fireMove(a + x2, b + y);
    fireUp();
  };
  const zoomIn = () => fireManualZoom(1);
  const zoomOut = () => fireManualZoom(-1);
  const fireUp = function() {
    const _xY = xY, _matrix = matrix;
    _matrix.x -= _xY.newX;
    _matrix.y -= _xY.newY;
    setScaling(false);
    setSmooth(true);
  };
  const fireMove = function(x2, y) {
    const _xY = xY, _matrix = matrix, _ratio = ratio;
    if (untrack(scaling)) return;
    let in_x = (window.innerWidth - _ratio.width * _matrix.vtm.a) / 2;
    let in_y = (window.innerHeight - _ratio.height * _matrix.vtm.a) / 2;
    _xY.newX = _xY.initX - x2;
    _xY.newY = _xY.initY - y;
    const mat = _matrix.move(in_x >= 0 ? 0 : _xY.newX, in_y >= 0 ? 0 : _xY.newY, in_x, in_y, _ratio);
    setTransform(`matrix(${mat.a},${mat.b},${mat.c},${mat.d},${mat.e}, ${mat.f})`);
  };
  const fireDown = function(x2, y) {
    const _matrix = matrix, _xY = xY;
    _xY.initX = x2;
    _xY.initY = y;
    _matrix.x = _matrix.vtm.e;
    _matrix.y = _matrix.vtm.f;
  };
  const zoomRef = {
    zoomIn,
    zoomOut,
    moveImage,
    fireManualZoom,
    scaleValue: scaleValue()
  };
  createEffect(() => {
    zoomRef.scaleValue = scaleValue();
    typeof props.ref == "function" && props.ref(zoomRef);
  });
  onMount(() => {
    const onLoad = (e) => {
      const {
        naturalWidth,
        naturalHeight
      } = e.currentTarget;
      const {
        innerHeight,
        innerWidth
      } = window;
      setContain(naturalWidth > innerWidth || naturalHeight > innerHeight);
      ratio = calculateAspectRatioFit(naturalWidth, naturalHeight, innerWidth, innerHeight);
    };
    imgEl.addEventListener("load", onLoad);
    onCleanup(() => {
      imgEl.removeEventListener("load", onLoad);
    });
  });
  return (() => {
    var _el$ = _tmpl$$o();
    var _ref$ = imgEl;
    typeof _ref$ === "function" ? use(_ref$, _el$) : imgEl = _el$;
    setAttribute(_el$, "draggable", false);
    spread(_el$, mergeProps({
      get classList() {
        return {
          [zoom]: true,
          [contain]: !!contain$1(),
          [no_contain]: !contain$1(),
          [transition]: smooth(),
          [visible]: !!contain$1(),
          [hidden]: contain$1() === null
        };
      },
      get style() {
        return {
          transform: transform2()
        };
      },
      get src() {
        return src();
      }
    }, $$props), false, false);
    return _el$;
  })();
}
const viewer$1 = `_viewer_7a1cc42`;
const pixelated = `_pixelated_b90c370`;
const menu = `_menu_07b2aa1`;
const item = `_item_dd62b76`;
const icon$2 = `_icon_dce5797`;
var _tmpl$$n = /* @__PURE__ */ template(`<div>`), _tmpl$2$g = /* @__PURE__ */ template(`<div tabindex=-1>`);
const SN_ID$2 = "options-menu";
function OptionsMenu(props) {
  onMount(() => {
    if (props.items.filter((a) => a).length == 0) {
      Promise.resolve().then(() => props.onSelect(null));
      return;
    }
    pauseKeypress();
    __CJS__export_default__.add(SN_ID$2, {
      restrict: "self-only",
      selector: `.${item}`
    });
    __CJS__export_default__.focus(SN_ID$2);
  });
  onCleanup(() => {
    if (props.items.filter((a) => a).length == 0) {
      return;
    }
    document.activeElement?.blur();
    __CJS__export_default__.remove(SN_ID$2);
    resumeKeypress();
  });
  let selected2 = false;
  function onSelect(select) {
    if (selected2) return;
    props.onSelect(select);
    selected2 = true;
  }
  return (() => {
    var _el$ = _tmpl$$n();
    className(_el$, menu);
    insert(_el$, createComponent(For, {
      get each() {
        return props.items.filter((a) => a);
      },
      children: (option) => (() => {
        var _el$2 = _tmpl$2$g();
        _el$2.$$keydown = (e) => {
          if (e.key == "Backspace") {
            onSelect(null);
          }
        };
        addEventListener(_el$2, "sn-enter-down", () => {
          onSelect(option.id);
        });
        className(_el$2, item);
        insert(_el$2, createComponent(Show, {
          get when() {
            return option.react;
          },
          get fallback() {
            return createComponent(Show, {
              get when() {
                return option.text;
              },
              get children() {
                return option.text;
              }
            });
          },
          get children() {
            return createComponent(Dynamic, {
              get component() {
                return option.react;
              }
            });
          }
        }), null);
        insert(_el$2, createComponent(Show, {
          get when() {
            return option.icon;
          },
          get children() {
            var _el$3 = _tmpl$$n();
            className(_el$3, icon$2);
            insert(_el$3, createComponent(Dynamic, {
              get component() {
                return option.icon;
              }
            }));
            return _el$3;
          }
        }), null);
        return _el$2;
      })()
    }));
    return _el$;
  })();
}
delegateEvents(["keydown"]);
var _tmpl$$m = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M12 2a1 1 0 0 1 1 1v10.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V3a1 1 0 0 1 1-1ZM3 20a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z"class>`);
const DownloadIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$m();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$l = /* @__PURE__ */ template(`<div tabindex=-1>`);
function ImageViewer(props) {
  let divRef;
  onMount(() => {
    pauseKeypress();
    __CJS__export_default__.add("image-viewer", {
      restrict: "self-only",
      selector: `.${viewer$1}`
    });
    __CJS__export_default__.focus("image-viewer");
  });
  onCleanup(() => {
    __CJS__export_default__.remove("image-viewer");
    divRef?.blur();
    resumeKeypress();
  });
  let zoomRef;
  const [pixelated$1, setPixelated] = createSignal(false);
  useKeypress("3", () => {
    if (zoomRef) {
      if (zoomRef.scaleValue >= 3) setPixelated(true);
      if (zoomRef.scaleValue <= 11) zoomRef.zoomIn();
    }
  }, true);
  useKeypress("1", () => {
    if (zoomRef) {
      if (zoomRef.scaleValue <= 3) setPixelated(false);
      zoomRef.zoomOut();
    }
  }, true);
  let backspacePaused = false;
  useKeypress("SoftRight", () => {
    const src = props.originalSrc || props.src;
    if (src) {
      const actEl = document.activeElement;
      console.log("SHOW OPTIONS MENU");
      backspacePaused = true;
      const close = slide(() => createComponent(OptionsMenu, {
        items: [{
          text: "Download",
          id: "download",
          icon: () => createComponent(DownloadIcon, {})
        }],
        onSelect: async (item2) => {
          backspacePaused = false;
          await close?.();
          actEl.focus();
          switch (item2) {
            case "download":
              if (props.src.startsWith("blob:") && props.filename) {
                const a = document.createElement("a");
                a.href = props.src;
                a.download = props.filename || "";
                document.body.appendChild(a);
                a.click();
                a.remove();
              } else {
                window.open(src, "_blank");
              }
              break;
          }
        }
      }));
    }
  }, true);
  useKeypress(["Up", "Down", "Left", "Right"].map((a) => "Arrow" + a), ({
    key
  }) => {
    const offset = 50;
    const moveImage = zoomRef?.moveImage;
    if (!moveImage) return;
    switch (key.slice(5)) {
      case "Up":
        moveImage(0, offset);
        break;
      case "Down":
        moveImage(0, -offset);
        break;
      case "Left":
        moveImage(offset, 0);
        break;
      case "Right":
        moveImage(-offset, -0);
        break;
    }
  }, true);
  useKeypress("Backspace", () => {
    if (!backspacePaused) props.onClose?.();
  }, true);
  return (() => {
    var _el$ = _tmpl$$l();
    var _ref$ = divRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : divRef = _el$;
    insert(_el$, createComponent(Zoom, {
      ref: (e) => {
        zoomRef = e;
      },
      get src() {
        return props.src;
      }
    }));
    createRenderEffect((_$p) => classList(_el$, {
      [viewer$1]: true,
      [pixelated]: pixelated$1()
    }, _$p));
    return _el$;
  })();
}
const viewer = `_viewer_275f128`;
const controls = `_controls_ce47b72`;
const icon$1 = `_icon_5b353ca`;
const progress_wrap = `_progress_wrap_bd0eb52`;
const progress = `_progress_a3418fa`;
const buffer = `_buffer_1df743d`;
const time = `_time_95c4bc1`;
var _tmpl$$k = /* @__PURE__ */ template(`<svg role=img xmlns=http://www.w3.org/2000/svg width=16 height=16 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z"class>`), _tmpl$2$f = /* @__PURE__ */ template(`<div tabindex=-1><video></video><div><div></div><div>:<!> / <!>:</div><div><div></div></div><div><svg role=img xmlns=http://www.w3.org/2000/svg width=16 height=16 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M4 6c0-1.1.9-2 2-2h3a1 1 0 0 0 0-2H6a4 4 0 0 0-4 4v3a1 1 0 0 0 2 0V6ZM4 18c0 1.1.9 2 2 2h3a1 1 0 1 1 0 2H6a4 4 0 0 1-4-4v-3a1 1 0 1 1 2 0v3ZM18 4a2 2 0 0 1 2 2v3a1 1 0 1 0 2 0V6a4 4 0 0 0-4-4h-3a1 1 0 1 0 0 2h3ZM20 18a2 2 0 0 1-2 2h-3a1 1 0 1 0 0 2h3a4 4 0 0 0 4-4v-3a1 1 0 1 0-2 0v3Z"class>`), _tmpl$3$c = /* @__PURE__ */ template(`<svg role=img xmlns=http://www.w3.org/2000/svg width=16 height=16 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M6 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H6ZM15 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3Z"class>`);
async function rotateScreen(horizontal) {
  if ("orientation" in window.screen) {
    try {
      if (horizontal) {
        await window.screen.orientation.lock("landscape-primary");
      } else {
        await window.screen.orientation.lock("portrait-primary");
      }
      return true;
    } catch {
    }
  }
  return false;
}
function exitFullscreen() {
  rotateScreen(false);
  try {
    if ("exitFullscreen" in document) {
      document.exitFullscreen();
    } else if ("mozCancelFullScreen" in document) {
      document.mozCancelFullScreen();
    }
  } catch {
  }
}
function toggleFullScreen() {
  if (!document.fullscreenElement && // alternative standard method
  // @ts-ignore
  !document.mozFullScreenElement) {
    if ("requestFullscreen" in document.body) {
      document.body.requestFullscreen();
    } else if ("mozRequestFullScreen" in document.body) {
      document.body.mozRequestFullScreen();
    }
    return true;
  } else {
    exitFullscreen();
    return false;
  }
}
function VideoViewer(props) {
  let divRef;
  let backspacePaused = false;
  let player;
  const [duration, setDuration] = createSignal(0);
  const [time$1, setTime] = createSignal(0);
  const [paused2, setPaused2] = createSignal(true);
  const timeHMS = createMemo(() => secondsToHms(time$1()));
  const hours = () => timeHMS().hours;
  const minutes = () => timeHMS().minutes;
  const seconds = () => timeHMS().seconds;
  const durationHMS = createMemo(() => secondsToHms(duration()));
  const totalHours = () => durationHMS().hours;
  const totalMinutes = () => durationHMS().minutes;
  const totalSeconds = () => durationHMS().seconds;
  onMount(() => {
    pauseKeypress();
    __CJS__export_default__.add("video-viewer", {
      restrict: "self-only",
      selector: `.${viewer}`
    });
    __CJS__export_default__.focus("video-viewer");
  });
  onCleanup(() => {
    __CJS__export_default__.remove("video-viewer");
    divRef?.blur();
    clearTimeout(timeout);
    clearTimeout(controlsTimeout);
    resumeKeypress();
  });
  useKeypress("Backspace", () => {
    if (!backspacePaused) {
      if (!document.fullscreenElement && // alternative standard method
      // @ts-ignore
      !document.mozFullScreenElement) props.onClose?.();
      exitFullscreen();
    }
  }, true);
  let timeout;
  function handleKeydown(event) {
    const {
      key
    } = event;
    var step = Math.max(player.duration / 20, 2);
    if (key === "ArrowLeft") {
      player.fastSeek(player.currentTime - step);
    } else if (key === "ArrowRight") {
      player.fastSeek(player.currentTime + step);
    } else if (key == "ArrowUp") {
      navigator.volumeManager?.requestUp();
    } else if (key == "ArrowDown") {
      navigator.volumeManager?.requestDown();
    }
  }
  const progress$1 = () => {
    if (time$1() && duration()) {
      return time$1() / duration() * 100;
    }
    return 0;
  };
  const [show, setShow] = createSignal(true);
  let controlsTimeout;
  const controls$1 = () => {
    controlsTimeout = setTimeout(() => {
      setShow(paused2());
    }, 1e4);
  };
  useKeypress("3", () => {
    const src = props.src;
    if (src) {
      const actEl = document.activeElement;
      console.log("SHOW OPTIONS MENU");
      backspacePaused = true;
      const close = slide(() => createComponent(OptionsMenu, {
        items: [{
          text: "Download",
          id: "download",
          icon: () => createComponent(DownloadIcon, {})
        }],
        onSelect: async (item2) => {
          backspacePaused = false;
          await close?.();
          actEl.focus();
          switch (item2) {
            case "download":
              window.open(src, "_blank");
              break;
          }
        }
      }));
    }
  }, true);
  return (() => {
    var _el$ = _tmpl$2$f(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.firstChild, _el$6 = _el$4.nextSibling, _el$7 = _el$6.firstChild, _el$0 = _el$7.nextSibling, _el$8 = _el$0.nextSibling, _el$1 = _el$8.nextSibling;
    _el$1.nextSibling;
    var _el$10 = _el$6.nextSibling, _el$11 = _el$10.firstChild, _el$12 = _el$10.nextSibling;
    var _ref$ = divRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : divRef = _el$;
    _el$.$$keyup = () => {
      clearTimeout(controlsTimeout);
      controls$1();
    };
    _el$.$$keydown = (e) => {
      setShow(true);
      clearTimeout(controlsTimeout);
      handleKeydown(e);
      console.log("KEYDOWWNNN");
      if (e.key == "Enter" || e.key == "SoftLeft") {
        player.paused ? player.play() : player.pause();
        setPaused2(player.paused);
      }
      if (e.key == "SoftRight") {
        const isFullscreen = toggleFullScreen();
        if (isFullscreen && player.videoHeight < player.videoWidth) {
          rotateScreen(true);
        }
      }
    };
    className(_el$, viewer);
    _el$2.addEventListener("loadedmetadata", () => {
      setDuration(player.duration != Infinity && !Number.isNaN(player.duration) ? player.duration : 0);
    });
    _el$2.addEventListener("timeupdate", () => {
      clearTimeout(timeout);
      setTime(player.currentTime);
      setPaused2(player.paused);
      timeout = setTimeout(() => {
        if (player.paused) {
          setPaused2(player.paused);
        }
      }, 1e3);
    });
    var _ref$2 = player;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : player = _el$2;
    _el$2.addEventListener("error", function(evt) {
      switch (evt.currentTarget.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          return;
        case MediaError.MEDIA_ERR_NETWORK:
          toast("Network error occured when loading the video");
          break;
        case MediaError.MEDIA_ERR_DECODE:
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          toast("Video file type is unsupported");
          break;
        // Is it possible to be unknown errors?
        default:
          toast("Unknown error occured when loading the video");
          break;
      }
    });
    className(_el$3, controls);
    className(_el$4, icon$1);
    insert(_el$4, createComponent(Show, {
      get when() {
        return paused2();
      },
      get fallback() {
        return _tmpl$3$c();
      },
      get children() {
        return _tmpl$$k();
      }
    }));
    className(_el$6, time);
    insert(_el$6, createComponent(Show, {
      get when() {
        return hours() > 0;
      },
      get children() {
        return `${hours()}:`;
      }
    }), _el$7);
    insert(_el$6, () => ("0" + minutes()).slice(-2), _el$7);
    insert(_el$6, () => ("0" + seconds()).slice(-2), _el$0);
    insert(_el$6, createComponent(Show, {
      get when() {
        return totalHours() > 0;
      },
      get children() {
        return `${totalHours()}:`;
      }
    }), _el$1);
    insert(_el$6, () => ("0" + totalMinutes()).slice(-2), _el$1);
    insert(_el$6, () => ("0" + totalSeconds()).slice(-2), null);
    className(_el$10, progress_wrap);
    className(_el$11, progress);
    className(_el$12, icon$1);
    createRenderEffect((_p$) => {
      var _v$ = props.poster, _v$2 = props.src, _v$3 = show() ? 1 : 0, _v$4 = progress$1() + "%";
      _v$ !== _p$.e && setAttribute(_el$2, "poster", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$2, "src", _p$.t = _v$2);
      _v$3 !== _p$.a && setStyleProperty(_el$3, "opacity", _p$.a = _v$3);
      _v$4 !== _p$.o && setStyleProperty(_el$11, "width", _p$.o = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    });
    return _el$;
  })();
}
delegateEvents(["keydown", "keyup"]);
var L = { hasSubscribers: false }, S = L;
var M = typeof performance == "object" && performance && typeof performance.now == "function" ? performance : Date;
var j = /* @__PURE__ */ new Set(), I = typeof process == "object" && process ? process : {}, P = (d, e, t, i) => {
  typeof I.emitWarning == "function" ? I.emitWarning(d, e, t, i) : console.error(`[${t}] ${e}: ${d}`);
}, k = (d) => !j.has(d);
var T = (d) => !!d && d === Math.floor(d) && d > 0 && isFinite(d), G = (d) => T(d) ? d <= Math.pow(2, 8) ? Uint8Array : d <= Math.pow(2, 16) ? Uint16Array : d <= Math.pow(2, 32) ? Uint32Array : d <= Number.MAX_SAFE_INTEGER ? O : null : null, O = class extends Array {
  constructor(e) {
    super(e), this.fill(0);
  }
}, x = (_a = class {
  constructor(e, t) {
    __publicField(this, "heap");
    __publicField(this, "length");
    if (!__privateGet(_a, _o)) throw new TypeError("instantiate Stack using Stack.create(n)");
    this.heap = new t(e), this.length = 0;
  }
  static create(e) {
    let t = G(e);
    if (!t) return [];
    __privateSet(_a, _o, true);
    let i = new _a(e, t);
    return __privateSet(_a, _o, false), i;
  }
  push(e) {
    this.heap[this.length++] = e;
  }
  pop() {
    return this.heap[--this.length];
  }
}, _o = new WeakMap(), __privateAdd(_a, _o, false), _a), U = (_d = class {
  constructor(e) {
    __privateAdd(this, _d_instances);
    __privateAdd(this, _o2);
    __privateAdd(this, _c2);
    __privateAdd(this, _S);
    __privateAdd(this, _O);
    __privateAdd(this, _w);
    __privateAdd(this, _M);
    __privateAdd(this, _I);
    __privateAdd(this, _m);
    __publicField(this, "ttl");
    __publicField(this, "ttlResolution");
    __publicField(this, "ttlAutopurge");
    __publicField(this, "updateAgeOnGet");
    __publicField(this, "updateAgeOnHas");
    __publicField(this, "allowStale");
    __publicField(this, "noDisposeOnSet");
    __publicField(this, "noUpdateTTL");
    __publicField(this, "maxEntrySize");
    __publicField(this, "sizeCalculation");
    __publicField(this, "noDeleteOnFetchRejection");
    __publicField(this, "noDeleteOnStaleGet");
    __publicField(this, "allowStaleOnFetchAbort");
    __publicField(this, "allowStaleOnFetchRejection");
    __publicField(this, "ignoreFetchAbort");
    __publicField(this, "backgroundFetchSize");
    __privateAdd(this, _n);
    __privateAdd(this, _b2);
    __privateAdd(this, _s);
    __privateAdd(this, _i);
    __privateAdd(this, _t);
    __privateAdd(this, _l);
    __privateAdd(this, _u);
    __privateAdd(this, _a2);
    __privateAdd(this, _h);
    __privateAdd(this, _y);
    __privateAdd(this, _r);
    __privateAdd(this, __);
    __privateAdd(this, _F);
    __privateAdd(this, _d2);
    __privateAdd(this, _g);
    __privateAdd(this, _T);
    __privateAdd(this, _U);
    __privateAdd(this, _f);
    __privateAdd(this, _D);
    __privateAdd(this, _R, () => {
    });
    __privateAdd(this, _v, () => {
    });
    __privateAdd(this, _H, () => {
    });
    __privateAdd(this, _p, () => false);
    __privateAdd(this, _x, (e) => {
    });
    __privateAdd(this, _j, (e, t, i) => {
    });
    __privateAdd(this, _N, (e, t, i, s) => {
      if (i || s) throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
      return 0;
    });
    __publicField(this, _b, "LRUCache");
    let { max: t = 0, ttl: i, ttlResolution: s = 1, ttlAutopurge: n, updateAgeOnGet: o, updateAgeOnHas: l, allowStale: h, dispose: r, onInsert: c, disposeAfter: m, noDisposeOnSet: _, noUpdateTTL: u, maxSize: g = 0, maxEntrySize: f = 0, sizeCalculation: y, fetchMethod: a, memoMethod: w, noDeleteOnFetchRejection: F, noDeleteOnStaleGet: b, allowStaleOnFetchRejection: p, allowStaleOnFetchAbort: A, ignoreFetchAbort: z, backgroundFetchSize: C = 1, perf: E } = e;
    if (this.backgroundFetchSize = C, E !== void 0 && typeof E?.now != "function") throw new TypeError("perf option must have a now() method if specified");
    if (__privateSet(this, _m, E ?? M), t !== 0 && !T(t)) throw new TypeError("max option must be a nonnegative integer");
    let v = t ? G(t) : Array;
    if (!v) throw new Error("invalid max value: " + t);
    if (__privateSet(this, _o2, t), __privateSet(this, _c2, g), this.maxEntrySize = f || __privateGet(this, _c2), this.sizeCalculation = y, this.sizeCalculation) {
      if (!__privateGet(this, _c2) && !this.maxEntrySize) throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      if (typeof this.sizeCalculation != "function") throw new TypeError("sizeCalculation set to non-function");
    }
    if (w !== void 0 && typeof w != "function") throw new TypeError("memoMethod must be a function if defined");
    if (__privateSet(this, _I, w), a !== void 0 && typeof a != "function") throw new TypeError("fetchMethod must be a function if specified");
    if (__privateSet(this, _M, a), __privateSet(this, _U, !!a), __privateSet(this, _s, /* @__PURE__ */ new Map()), __privateSet(this, _i, Array.from({ length: t }).fill(void 0)), __privateSet(this, _t, Array.from({ length: t }).fill(void 0)), __privateSet(this, _l, new v(t)), __privateSet(this, _u, new v(t)), __privateSet(this, _a2, 0), __privateSet(this, _h, 0), __privateSet(this, _y, x.create(t)), __privateSet(this, _n, 0), __privateSet(this, _b2, 0), typeof r == "function" && __privateSet(this, _S, r), typeof c == "function" && __privateSet(this, _O, c), typeof m == "function" ? (__privateSet(this, _w, m), __privateSet(this, _r, [])) : (__privateSet(this, _w, void 0), __privateSet(this, _r, void 0)), __privateSet(this, _T, !!__privateGet(this, _S)), __privateSet(this, _D, !!__privateGet(this, _O)), __privateSet(this, _f, !!__privateGet(this, _w)), this.noDisposeOnSet = !!_, this.noUpdateTTL = !!u, this.noDeleteOnFetchRejection = !!F, this.allowStaleOnFetchRejection = !!p, this.allowStaleOnFetchAbort = !!A, this.ignoreFetchAbort = !!z, this.maxEntrySize !== 0) {
      if (__privateGet(this, _c2) !== 0 && !T(__privateGet(this, _c2))) throw new TypeError("maxSize must be a positive integer if specified");
      if (!T(this.maxEntrySize)) throw new TypeError("maxEntrySize must be a positive integer if specified");
      __privateMethod(this, _d_instances, X_fn).call(this);
    }
    if (this.allowStale = !!h, this.noDeleteOnStaleGet = !!b, this.updateAgeOnGet = !!o, this.updateAgeOnHas = !!l, this.ttlResolution = T(s) || s === 0 ? s : 1, this.ttlAutopurge = !!n, this.ttl = i || 0, this.ttl) {
      if (!T(this.ttl)) throw new TypeError("ttl must be a positive integer if specified");
      __privateMethod(this, _d_instances, k_fn).call(this);
    }
    if (__privateGet(this, _o2) === 0 && this.ttl === 0 && __privateGet(this, _c2) === 0) throw new TypeError("At least one of max, maxSize, or ttl is required");
    if (!this.ttlAutopurge && !__privateGet(this, _o2) && !__privateGet(this, _c2)) {
      let D = "LRU_CACHE_UNBOUNDED";
      k(D) && (j.add(D), P("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", D, _d));
    }
  }
  get perf() {
    return __privateGet(this, _m);
  }
  static unsafeExposeInternals(e) {
    return { starts: __privateGet(e, _F), ttls: __privateGet(e, _d2), autopurgeTimers: __privateGet(e, _g), sizes: __privateGet(e, __), keyMap: __privateGet(e, _s), keyList: __privateGet(e, _i), valList: __privateGet(e, _t), next: __privateGet(e, _l), prev: __privateGet(e, _u), get head() {
      return __privateGet(e, _a2);
    }, get tail() {
      return __privateGet(e, _h);
    }, free: __privateGet(e, _y), isBackgroundFetch: (t) => {
      var _a3;
      return __privateMethod(_a3 = e, _d_instances, e_fn).call(_a3, t);
    }, backgroundFetch: (t, i, s, n) => {
      var _a3;
      return __privateMethod(_a3 = e, _d_instances, P_fn).call(_a3, t, i, s, n);
    }, moveToTail: (t) => {
      var _a3;
      return __privateMethod(_a3 = e, _d_instances, L_fn).call(_a3, t);
    }, indexes: (t) => {
      var _a3;
      return __privateMethod(_a3 = e, _d_instances, A_fn).call(_a3, t);
    }, rindexes: (t) => {
      var _a3;
      return __privateMethod(_a3 = e, _d_instances, z_fn).call(_a3, t);
    }, isStale: (t) => {
      var _a3;
      return __privateGet(_a3 = e, _p).call(_a3, t);
    } };
  }
  get max() {
    return __privateGet(this, _o2);
  }
  get maxSize() {
    return __privateGet(this, _c2);
  }
  get calculatedSize() {
    return __privateGet(this, _b2);
  }
  get size() {
    return __privateGet(this, _n);
  }
  get fetchMethod() {
    return __privateGet(this, _M);
  }
  get memoMethod() {
    return __privateGet(this, _I);
  }
  get dispose() {
    return __privateGet(this, _S);
  }
  get onInsert() {
    return __privateGet(this, _O);
  }
  get disposeAfter() {
    return __privateGet(this, _w);
  }
  getRemainingTTL(e) {
    return __privateGet(this, _s).has(e) ? 1 / 0 : 0;
  }
  *entries() {
    for (let e of __privateMethod(this, _d_instances, A_fn).call(this)) __privateGet(this, _t)[e] !== void 0 && __privateGet(this, _i)[e] !== void 0 && !__privateMethod(this, _d_instances, e_fn).call(this, __privateGet(this, _t)[e]) && (yield [__privateGet(this, _i)[e], __privateGet(this, _t)[e]]);
  }
  *rentries() {
    for (let e of __privateMethod(this, _d_instances, z_fn).call(this)) __privateGet(this, _t)[e] !== void 0 && __privateGet(this, _i)[e] !== void 0 && !__privateMethod(this, _d_instances, e_fn).call(this, __privateGet(this, _t)[e]) && (yield [__privateGet(this, _i)[e], __privateGet(this, _t)[e]]);
  }
  *keys() {
    for (let e of __privateMethod(this, _d_instances, A_fn).call(this)) {
      let t = __privateGet(this, _i)[e];
      t !== void 0 && !__privateMethod(this, _d_instances, e_fn).call(this, __privateGet(this, _t)[e]) && (yield t);
    }
  }
  *rkeys() {
    for (let e of __privateMethod(this, _d_instances, z_fn).call(this)) {
      let t = __privateGet(this, _i)[e];
      t !== void 0 && !__privateMethod(this, _d_instances, e_fn).call(this, __privateGet(this, _t)[e]) && (yield t);
    }
  }
  *values() {
    for (let e of __privateMethod(this, _d_instances, A_fn).call(this)) __privateGet(this, _t)[e] !== void 0 && !__privateMethod(this, _d_instances, e_fn).call(this, __privateGet(this, _t)[e]) && (yield __privateGet(this, _t)[e]);
  }
  *rvalues() {
    for (let e of __privateMethod(this, _d_instances, z_fn).call(this)) __privateGet(this, _t)[e] !== void 0 && !__privateMethod(this, _d_instances, e_fn).call(this, __privateGet(this, _t)[e]) && (yield __privateGet(this, _t)[e]);
  }
  [(_c = Symbol.iterator, _b = Symbol.toStringTag, _c)]() {
    return this.entries();
  }
  find(e, t = {}) {
    for (let i of __privateMethod(this, _d_instances, A_fn).call(this)) {
      let s = __privateGet(this, _t)[i], n = __privateMethod(this, _d_instances, e_fn).call(this, s) ? s.__staleWhileFetching : s;
      if (n !== void 0 && e(n, __privateGet(this, _i)[i], this)) return __privateMethod(this, _d_instances, C_fn).call(this, __privateGet(this, _i)[i], t);
    }
  }
  forEach(e, t = this) {
    for (let i of __privateMethod(this, _d_instances, A_fn).call(this)) {
      let s = __privateGet(this, _t)[i], n = __privateMethod(this, _d_instances, e_fn).call(this, s) ? s.__staleWhileFetching : s;
      n !== void 0 && e.call(t, n, __privateGet(this, _i)[i], this);
    }
  }
  rforEach(e, t = this) {
    for (let i of __privateMethod(this, _d_instances, z_fn).call(this)) {
      let s = __privateGet(this, _t)[i], n = __privateMethod(this, _d_instances, e_fn).call(this, s) ? s.__staleWhileFetching : s;
      n !== void 0 && e.call(t, n, __privateGet(this, _i)[i], this);
    }
  }
  purgeStale() {
    let e = false;
    for (let t of __privateMethod(this, _d_instances, z_fn).call(this, { allowStale: true })) __privateGet(this, _p).call(this, t) && (__privateMethod(this, _d_instances, E_fn).call(this, __privateGet(this, _i)[t], "expire"), e = true);
    return e;
  }
  info(e) {
    let t = __privateGet(this, _s).get(e);
    if (t === void 0) return;
    let i = __privateGet(this, _t)[t], s = __privateMethod(this, _d_instances, e_fn).call(this, i) ? i.__staleWhileFetching : i;
    if (s === void 0) return;
    let n = { value: s };
    if (__privateGet(this, _d2) && __privateGet(this, _F)) {
      let o = __privateGet(this, _d2)[t], l = __privateGet(this, _F)[t];
      if (o && l) {
        let h = o - (__privateGet(this, _m).now() - l);
        n.ttl = h, n.start = Date.now();
      }
    }
    return __privateGet(this, __) && (n.size = __privateGet(this, __)[t]), n;
  }
  dump() {
    let e = [];
    for (let t of __privateMethod(this, _d_instances, A_fn).call(this, { allowStale: true })) {
      let i = __privateGet(this, _i)[t], s = __privateGet(this, _t)[t], n = __privateMethod(this, _d_instances, e_fn).call(this, s) ? s.__staleWhileFetching : s;
      if (n === void 0 || i === void 0) continue;
      let o = { value: n };
      if (__privateGet(this, _d2) && __privateGet(this, _F)) {
        o.ttl = __privateGet(this, _d2)[t];
        let l = __privateGet(this, _m).now() - __privateGet(this, _F)[t];
        o.start = Math.floor(Date.now() - l);
      }
      __privateGet(this, __) && (o.size = __privateGet(this, __)[t]), e.unshift([i, o]);
    }
    return e;
  }
  load(e) {
    this.clear();
    for (let [t, i] of e) {
      if (i.start) {
        let s = Date.now() - i.start;
        i.start = __privateGet(this, _m).now() - s;
      }
      __privateMethod(this, _d_instances, W_fn).call(this, t, i.value, i);
    }
  }
  set(e, t, i = {}) {
    let { status: s = void 0 } = i;
    i.status = s, s && (s.op = "set", s.key = e, t !== void 0 && (s.value = t), s.cache = this);
    let n = __privateMethod(this, _d_instances, W_fn).call(this, e, t, i);
    return n;
  }
  pop() {
    var _a3;
    try {
      for (; __privateGet(this, _n); ) {
        let e = __privateGet(this, _t)[__privateGet(this, _a2)];
        if (__privateMethod(this, _d_instances, G_fn).call(this, true), __privateMethod(this, _d_instances, e_fn).call(this, e)) {
          if (e.__staleWhileFetching) return e.__staleWhileFetching;
        } else if (e !== void 0) return e;
      }
    } finally {
      if (__privateGet(this, _f) && __privateGet(this, _r)) {
        let e = __privateGet(this, _r), t;
        for (; t = e?.shift(); ) (_a3 = __privateGet(this, _w)) == null ? void 0 : _a3.call(this, ...t);
      }
    }
  }
  has(e, t = {}) {
    let { status: i = void 0 } = t;
    t.status = i, i && (i.op = "has", i.key = e, i.cache = this);
    let s = __privateMethod(this, _d_instances, Y_fn).call(this, e, t);
    return s;
  }
  peek(e, t = {}) {
    let { status: i = void 0 } = t;
    i && (i.op = "peek", i.key = e, i.cache = this), t.status = i;
    let s = __privateMethod(this, _d_instances, J_fn).call(this, e, t);
    return s;
  }
  fetch(e, t = {}) {
    let { status: s = void 0 } = t;
    t.status = s, s && t.context && (s.context = t.context);
    let n = __privateMethod(this, _d_instances, B_fn).call(this, e, t);
    return n;
  }
  forceFetch(e, t = {}) {
    let { status: s = void 0 } = t;
    t.status = s, s && t.context && (s.context = t.context);
    let n = __privateMethod(this, _d_instances, K_fn).call(this, e, t);
    return n;
  }
  memo(e, t = {}) {
    let { status: i = void 0 } = t;
    t.status = i, i && (i.op = "memo", i.key = e, t.context && (i.context = t.context), i.cache = this);
    let s = __privateMethod(this, _d_instances, Q_fn).call(this, e, t);
    return i && (i.value = s), s;
  }
  get(e, t = {}) {
    let { status: i = void 0 } = t;
    t.status = i, i && (i.op = "get", i.key = e, i.cache = this);
    let s = __privateMethod(this, _d_instances, C_fn).call(this, e, t);
    return i && (s !== void 0 && (i.value = s), S.hasSubscribers), s;
  }
  delete(e) {
    return __privateMethod(this, _d_instances, E_fn).call(this, e, "delete");
  }
  clear() {
    return __privateMethod(this, _d_instances, q_fn).call(this, "delete");
  }
}, _o2 = new WeakMap(), _c2 = new WeakMap(), _S = new WeakMap(), _O = new WeakMap(), _w = new WeakMap(), _M = new WeakMap(), _I = new WeakMap(), _m = new WeakMap(), _n = new WeakMap(), _b2 = new WeakMap(), _s = new WeakMap(), _i = new WeakMap(), _t = new WeakMap(), _l = new WeakMap(), _u = new WeakMap(), _a2 = new WeakMap(), _h = new WeakMap(), _y = new WeakMap(), _r = new WeakMap(), __ = new WeakMap(), _F = new WeakMap(), _d2 = new WeakMap(), _g = new WeakMap(), _T = new WeakMap(), _U = new WeakMap(), _f = new WeakMap(), _D = new WeakMap(), _d_instances = new WeakSet(), k_fn = function() {
  let e = new O(__privateGet(this, _o2)), t = new O(__privateGet(this, _o2));
  __privateSet(this, _d2, e), __privateSet(this, _F, t);
  let i = this.ttlAutopurge ? Array.from({ length: __privateGet(this, _o2) }) : void 0;
  __privateSet(this, _g, i), __privateSet(this, _H, (h, r, c = __privateGet(this, _m).now()) => {
    t[h] = r !== 0 ? c : 0, e[h] = r, s(h, r);
  }), __privateSet(this, _R, (h) => {
    t[h] = e[h] !== 0 ? __privateGet(this, _m).now() : 0, s(h, e[h]);
  });
  let s = this.ttlAutopurge ? (h, r) => {
    if (i?.[h] && (clearTimeout(i[h]), i[h] = void 0), r && r !== 0 && i) {
      let c = setTimeout(() => {
        __privateGet(this, _p).call(this, h) ? (__privateMethod(this, _d_instances, E_fn).call(this, __privateGet(this, _i)[h], "expire"), i[h] = void 0) : s(h, l(h));
      }, r + 1);
      c.unref && c.unref(), i[h] = c;
    }
  } : () => {
  };
  __privateSet(this, _v, (h, r) => {
    if (e[r]) {
      let c = e[r], m = t[r];
      if (!c || !m) return;
      h.ttl = c, h.start = m, h.now = n || o();
      let _ = h.now - m;
      h.remainingTTL = c - _;
    }
  });
  let n = 0, o = () => {
    let h = __privateGet(this, _m).now();
    if (this.ttlResolution > 0) {
      n = h;
      let r = setTimeout(() => n = 0, this.ttlResolution);
      r.unref && r.unref();
    }
    return h;
  };
  this.getRemainingTTL = (h) => {
    let r = __privateGet(this, _s).get(h);
    return r === void 0 ? 0 : l(r);
  };
  let l = (h) => {
    let r = e[h], c = t[h];
    if (!r || !c) return 1 / 0;
    let m = (n || o()) - c;
    return r - m;
  };
  __privateSet(this, _p, (h) => {
    let r = t[h], c = e[h];
    return !!c && !!r && (n || o()) - r > c;
  });
}, _R = new WeakMap(), _v = new WeakMap(), _H = new WeakMap(), _p = new WeakMap(), X_fn = function() {
  let e = new O(__privateGet(this, _o2));
  __privateSet(this, _b2, 0), __privateSet(this, __, e), __privateSet(this, _x, (t) => {
    __privateSet(this, _b2, __privateGet(this, _b2) - e[t]), e[t] = 0;
  }), __privateSet(this, _N, (t, i, s, n) => {
    if (!T(s)) {
      if (__privateMethod(this, _d_instances, e_fn).call(this, i)) return this.backgroundFetchSize;
      if (n) {
        if (typeof n != "function") throw new TypeError("sizeCalculation must be a function");
        if (s = n(i, t), !T(s)) throw new TypeError("sizeCalculation return invalid (expect positive integer)");
      } else throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
    }
    return s;
  }), __privateSet(this, _j, (t, i, s) => {
    if (e[t] = i, __privateGet(this, _c2)) {
      let n = __privateGet(this, _c2) - e[t];
      for (; __privateGet(this, _b2) > n; ) __privateMethod(this, _d_instances, G_fn).call(this, true);
    }
    __privateSet(this, _b2, __privateGet(this, _b2) + e[t]), s && (s.entrySize = i, s.totalCalculatedSize = __privateGet(this, _b2));
  });
}, _x = new WeakMap(), _j = new WeakMap(), _N = new WeakMap(), A_fn = function* ({ allowStale: e = this.allowStale } = {}) {
  if (__privateGet(this, _n)) for (let t = __privateGet(this, _h); __privateMethod(this, _d_instances, V_fn).call(this, t) && ((e || !__privateGet(this, _p).call(this, t)) && (yield t), t !== __privateGet(this, _a2)); ) t = __privateGet(this, _u)[t];
}, z_fn = function* ({ allowStale: e = this.allowStale } = {}) {
  if (__privateGet(this, _n)) for (let t = __privateGet(this, _a2); __privateMethod(this, _d_instances, V_fn).call(this, t) && ((e || !__privateGet(this, _p).call(this, t)) && (yield t), t !== __privateGet(this, _h)); ) t = __privateGet(this, _l)[t];
}, V_fn = function(e) {
  return e !== void 0 && __privateGet(this, _s).get(__privateGet(this, _i)[e]) === e;
}, W_fn = function(e, t, i, s) {
  var _a3, _b3, _c3, _d3;
  let { ttl: n = this.ttl, start: o, noDisposeOnSet: l = this.noDisposeOnSet, sizeCalculation: h = this.sizeCalculation, status: r } = i, c = __privateMethod(this, _d_instances, e_fn).call(this, t);
  if (t === void 0) return r && (r.set = "deleted"), this.delete(e), this;
  let { noUpdateTTL: m = this.noUpdateTTL } = i;
  r && !c && (r.value = t);
  let _ = __privateGet(this, _N).call(this, e, t, i.size || 0, h, r);
  if (this.maxEntrySize && _ > this.maxEntrySize) return __privateMethod(this, _d_instances, E_fn).call(this, e, "set"), r && (r.set = "miss", r.maxEntrySizeExceeded = true), this;
  let u = __privateGet(this, _n) === 0 ? void 0 : __privateGet(this, _s).get(e);
  if (u === void 0) u = __privateGet(this, _n) === 0 ? __privateGet(this, _h) : __privateGet(this, _y).length !== 0 ? __privateGet(this, _y).pop() : __privateGet(this, _n) === __privateGet(this, _o2) ? __privateMethod(this, _d_instances, G_fn).call(this, false) : __privateGet(this, _n), __privateGet(this, _i)[u] = e, __privateGet(this, _t)[u] = t, __privateGet(this, _s).set(e, u), __privateGet(this, _l)[__privateGet(this, _h)] = u, __privateGet(this, _u)[u] = __privateGet(this, _h), __privateSet(this, _h, u), __privateWrapper(this, _n)._++, __privateGet(this, _j).call(this, u, _, r), r && (r.set = "add"), m = false, __privateGet(this, _D) && !c && ((_a3 = __privateGet(this, _O)) == null ? void 0 : _a3.call(this, t, e, "add"));
  else {
    __privateMethod(this, _d_instances, L_fn).call(this, u);
    let g = __privateGet(this, _t)[u];
    if (t !== g) {
      if (!l) if (__privateMethod(this, _d_instances, e_fn).call(this, g)) {
        g !== s && g.__abortController.abort(new Error("replaced"));
        let { __staleWhileFetching: f } = g;
        f !== void 0 && f !== t && (__privateGet(this, _T) && ((_b3 = __privateGet(this, _S)) == null ? void 0 : _b3.call(this, f, e, "set")), __privateGet(this, _f) && __privateGet(this, _r)?.push([f, e, "set"]));
      } else __privateGet(this, _T) && ((_c3 = __privateGet(this, _S)) == null ? void 0 : _c3.call(this, g, e, "set")), __privateGet(this, _f) && __privateGet(this, _r)?.push([g, e, "set"]);
      if (__privateGet(this, _x).call(this, u), __privateGet(this, _j).call(this, u, _, r), __privateGet(this, _t)[u] = t, !c) {
        let f = g && __privateMethod(this, _d_instances, e_fn).call(this, g) ? g.__staleWhileFetching : g, y = f === void 0 ? "add" : t !== f ? "replace" : "update";
        r && (r.set = y, f !== void 0 && (r.oldValue = f)), __privateGet(this, _D) && this.onInsert?.(t, e, y);
      }
    } else c || (r && (r.set = "update"), __privateGet(this, _D) && this.onInsert?.(t, e, "update"));
  }
  if (n !== 0 && !__privateGet(this, _d2) && __privateMethod(this, _d_instances, k_fn).call(this), __privateGet(this, _d2) && (m || __privateGet(this, _H).call(this, u, n, o), r && __privateGet(this, _v).call(this, r, u)), !l && __privateGet(this, _f) && __privateGet(this, _r)) {
    let g = __privateGet(this, _r), f;
    for (; f = g?.shift(); ) (_d3 = __privateGet(this, _w)) == null ? void 0 : _d3.call(this, ...f);
  }
  return this;
}, G_fn = function(e) {
  var _a3;
  let t = __privateGet(this, _a2), i = __privateGet(this, _i)[t], s = __privateGet(this, _t)[t], n = __privateMethod(this, _d_instances, e_fn).call(this, s);
  n && s.__abortController.abort(new Error("evicted"));
  let o = n ? s.__staleWhileFetching : s;
  return (__privateGet(this, _T) || __privateGet(this, _f)) && o !== void 0 && (__privateGet(this, _T) && ((_a3 = __privateGet(this, _S)) == null ? void 0 : _a3.call(this, o, i, "evict")), __privateGet(this, _f) && __privateGet(this, _r)?.push([o, i, "evict"])), __privateGet(this, _x).call(this, t), __privateGet(this, _g)?.[t] && (clearTimeout(__privateGet(this, _g)[t]), __privateGet(this, _g)[t] = void 0), e && (__privateGet(this, _i)[t] = void 0, __privateGet(this, _t)[t] = void 0, __privateGet(this, _y).push(t)), __privateGet(this, _n) === 1 ? (__privateSet(this, _a2, __privateSet(this, _h, 0)), __privateGet(this, _y).length = 0) : __privateSet(this, _a2, __privateGet(this, _l)[t]), __privateGet(this, _s).delete(i), __privateWrapper(this, _n)._--, t;
}, Y_fn = function(e, t = {}) {
  let { updateAgeOnHas: i = this.updateAgeOnHas, status: s } = t, n = __privateGet(this, _s).get(e);
  if (n !== void 0) {
    let o = __privateGet(this, _t)[n];
    if (__privateMethod(this, _d_instances, e_fn).call(this, o) && o.__staleWhileFetching === void 0) return false;
    if (__privateGet(this, _p).call(this, n)) s && (s.has = "stale", __privateGet(this, _v).call(this, s, n));
    else return i && __privateGet(this, _R).call(this, n), s && (s.has = "hit", __privateGet(this, _v).call(this, s, n)), true;
  } else s && (s.has = "miss");
  return false;
}, J_fn = function(e, t) {
  let { status: i, allowStale: s = this.allowStale } = t, n = __privateGet(this, _s).get(e);
  if (n === void 0 || !s && __privateGet(this, _p).call(this, n)) {
    i && (i.peek = n === void 0 ? "miss" : "stale");
    return;
  }
  let o = __privateGet(this, _t)[n], l = __privateMethod(this, _d_instances, e_fn).call(this, o) ? o.__staleWhileFetching : o;
  return i && (l !== void 0 ? (i.peek = "hit", i.value = l) : i.peek = "miss"), l;
}, P_fn = function(e, t, i, s) {
  let n = t === void 0 ? void 0 : __privateGet(this, _t)[t];
  if (__privateMethod(this, _d_instances, e_fn).call(this, n)) return n;
  let o = new AbortController(), { signal: l } = i;
  l?.addEventListener("abort", () => o.abort(l.reason), { signal: o.signal });
  let h = { signal: o.signal, options: i, context: s }, r = (f, y = false) => {
    let { aborted: a } = o.signal, w = i.ignoreFetchAbort && f !== void 0, F = i.ignoreFetchAbort || !!(i.allowStaleOnFetchAbort && f !== void 0);
    if (i.status && (a && !y ? (i.status.fetchAborted = true, i.status.fetchError = o.signal.reason, w && (i.status.fetchAbortIgnored = true)) : i.status.fetchResolved = true), a && !w && !y) return m(o.signal.reason, F);
    let b = u, p = __privateGet(this, _t)[t];
    return (p === u || p === void 0 && w && y) && (f === void 0 ? b.__staleWhileFetching !== void 0 ? __privateGet(this, _t)[t] = b.__staleWhileFetching : __privateMethod(this, _d_instances, E_fn).call(this, e, "fetch") : (i.status && (i.status.fetchUpdated = true), __privateMethod(this, _d_instances, W_fn).call(this, e, f, h.options, b))), f;
  }, c = (f) => (i.status && (i.status.fetchRejected = true, i.status.fetchError = f), m(f, false)), m = (f, y) => {
    let { aborted: a } = o.signal, w = a && i.allowStaleOnFetchAbort, F = w || i.allowStaleOnFetchRejection, b = F || i.noDeleteOnFetchRejection, p = u;
    if (__privateGet(this, _t)[t] === u && (!b || !y && p.__staleWhileFetching === void 0 ? __privateMethod(this, _d_instances, E_fn).call(this, e, "fetch") : w || (__privateGet(this, _t)[t] = p.__staleWhileFetching)), F) return i.status && p.__staleWhileFetching !== void 0 && (i.status.returnedStale = true), p.__staleWhileFetching;
    if (p.__returned === p) throw f;
  }, _ = (f, y) => {
    var _a3;
    let a = (_a3 = __privateGet(this, _M)) == null ? void 0 : _a3.call(this, e, n, h);
    o.signal.addEventListener("abort", () => {
      (!i.ignoreFetchAbort || i.allowStaleOnFetchAbort) && (f(void 0), i.allowStaleOnFetchAbort && (f = (w) => r(w, true)));
    }), a && a instanceof Promise ? a.then((w) => f(w === void 0 ? void 0 : w), y) : a !== void 0 && f(a);
  };
  i.status && (i.status.fetchDispatched = true);
  let u = new Promise(_).then(r, c), g = Object.assign(u, { __abortController: o, __staleWhileFetching: n, __returned: void 0 });
  return t === void 0 ? (__privateMethod(this, _d_instances, W_fn).call(this, e, g, { ...h.options, status: void 0 }), t = __privateGet(this, _s).get(e)) : __privateGet(this, _t)[t] = g, g;
}, e_fn = function(e) {
  if (!__privateGet(this, _U)) return false;
  let t = e;
  return !!t && t instanceof Promise && t.hasOwnProperty("__staleWhileFetching") && t.__abortController instanceof AbortController;
}, B_fn = async function(e, t = {}) {
  let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n = this.noDeleteOnStaleGet, ttl: o = this.ttl, noDisposeOnSet: l = this.noDisposeOnSet, size: h = 0, sizeCalculation: r = this.sizeCalculation, noUpdateTTL: c = this.noUpdateTTL, noDeleteOnFetchRejection: m = this.noDeleteOnFetchRejection, allowStaleOnFetchRejection: _ = this.allowStaleOnFetchRejection, ignoreFetchAbort: u = this.ignoreFetchAbort, allowStaleOnFetchAbort: g = this.allowStaleOnFetchAbort, context: f, forceRefresh: y = false, status: a, signal: w } = t;
  if (a && (a.op = "fetch", a.key = e, y && (a.forceRefresh = true), a.cache = this), !__privateGet(this, _U)) return a && (a.fetch = "get"), __privateMethod(this, _d_instances, C_fn).call(this, e, { allowStale: i, updateAgeOnGet: s, noDeleteOnStaleGet: n, status: a });
  let F = { allowStale: i, updateAgeOnGet: s, noDeleteOnStaleGet: n, ttl: o, noDisposeOnSet: l, size: h, sizeCalculation: r, noUpdateTTL: c, noDeleteOnFetchRejection: m, allowStaleOnFetchRejection: _, allowStaleOnFetchAbort: g, ignoreFetchAbort: u, status: a, signal: w }, b = __privateGet(this, _s).get(e);
  if (b === void 0) {
    a && (a.fetch = "miss");
    let p = __privateMethod(this, _d_instances, P_fn).call(this, e, b, F, f);
    return p.__returned = p;
  } else {
    let p = __privateGet(this, _t)[b];
    if (__privateMethod(this, _d_instances, e_fn).call(this, p)) {
      let v = i && p.__staleWhileFetching !== void 0;
      return a && (a.fetch = "inflight", v && (a.returnedStale = true)), v ? p.__staleWhileFetching : p.__returned = p;
    }
    let A = __privateGet(this, _p).call(this, b);
    if (!y && !A) return a && (a.fetch = "hit"), __privateMethod(this, _d_instances, L_fn).call(this, b), s && __privateGet(this, _R).call(this, b), a && __privateGet(this, _v).call(this, a, b), p;
    let z = __privateMethod(this, _d_instances, P_fn).call(this, e, b, F, f), E = z.__staleWhileFetching !== void 0 && i;
    return a && (a.fetch = A ? "stale" : "refresh", E && A && (a.returnedStale = true)), E ? z.__staleWhileFetching : z.__returned = z;
  }
}, K_fn = async function(e, t = {}) {
  let i = await __privateMethod(this, _d_instances, B_fn).call(this, e, t);
  if (i === void 0) throw new Error("fetch() returned undefined");
  return i;
}, Q_fn = function(e, t = {}) {
  let i = __privateGet(this, _I);
  if (!i) throw new Error("no memoMethod provided to constructor");
  let { context: s, status: n, forceRefresh: o, ...l } = t;
  n && o && (n.forceRefresh = true);
  let h = __privateMethod(this, _d_instances, C_fn).call(this, e, l), r = o || h === void 0;
  if (n && (n.memo = r ? "miss" : "hit", r || (n.value = h)), !r) return h;
  let c = i(e, h, { options: l, context: s });
  return n && (n.value = c), __privateMethod(this, _d_instances, W_fn).call(this, e, c, l), c;
}, C_fn = function(e, t = {}) {
  let { allowStale: i = this.allowStale, updateAgeOnGet: s = this.updateAgeOnGet, noDeleteOnStaleGet: n = this.noDeleteOnStaleGet, status: o } = t, l = __privateGet(this, _s).get(e);
  if (l === void 0) {
    o && (o.get = "miss");
    return;
  }
  let h = __privateGet(this, _t)[l], r = __privateMethod(this, _d_instances, e_fn).call(this, h);
  return o && __privateGet(this, _v).call(this, o, l), __privateGet(this, _p).call(this, l) ? r ? (o && (o.get = "stale-fetching"), i && h.__staleWhileFetching !== void 0 ? (o && (o.returnedStale = true), h.__staleWhileFetching) : void 0) : (n || __privateMethod(this, _d_instances, E_fn).call(this, e, "expire"), o && (o.get = "stale"), i ? (o && (o.returnedStale = true), h) : void 0) : (o && (o.get = r ? "fetching" : "hit"), __privateMethod(this, _d_instances, L_fn).call(this, l), s && __privateGet(this, _R).call(this, l), r ? h.__staleWhileFetching : h);
}, $_fn = function(e, t) {
  __privateGet(this, _u)[t] = e, __privateGet(this, _l)[e] = t;
}, L_fn = function(e) {
  e !== __privateGet(this, _h) && (e === __privateGet(this, _a2) ? __privateSet(this, _a2, __privateGet(this, _l)[e]) : __privateMethod(this, _d_instances, $_fn).call(this, __privateGet(this, _u)[e], __privateGet(this, _l)[e]), __privateMethod(this, _d_instances, $_fn).call(this, __privateGet(this, _h), e), __privateSet(this, _h, e));
}, E_fn = function(e, t) {
  var _a3, _b3;
  let i = false;
  if (__privateGet(this, _n) !== 0) {
    let s = __privateGet(this, _s).get(e);
    if (s !== void 0) if (__privateGet(this, _g)?.[s] && (clearTimeout(__privateGet(this, _g)[s]), __privateGet(this, _g)[s] = void 0), i = true, __privateGet(this, _n) === 1) __privateMethod(this, _d_instances, q_fn).call(this, t);
    else {
      __privateGet(this, _x).call(this, s);
      let n = __privateGet(this, _t)[s];
      if (__privateMethod(this, _d_instances, e_fn).call(this, n) ? n.__abortController.abort(new Error("deleted")) : (__privateGet(this, _T) || __privateGet(this, _f)) && (__privateGet(this, _T) && ((_a3 = __privateGet(this, _S)) == null ? void 0 : _a3.call(this, n, e, t)), __privateGet(this, _f) && __privateGet(this, _r)?.push([n, e, t])), __privateGet(this, _s).delete(e), __privateGet(this, _i)[s] = void 0, __privateGet(this, _t)[s] = void 0, s === __privateGet(this, _h)) __privateSet(this, _h, __privateGet(this, _u)[s]);
      else if (s === __privateGet(this, _a2)) __privateSet(this, _a2, __privateGet(this, _l)[s]);
      else {
        let o = __privateGet(this, _u)[s];
        __privateGet(this, _l)[o] = __privateGet(this, _l)[s];
        let l = __privateGet(this, _l)[s];
        __privateGet(this, _u)[l] = __privateGet(this, _u)[s];
      }
      __privateWrapper(this, _n)._--, __privateGet(this, _y).push(s);
    }
  }
  if (__privateGet(this, _f) && __privateGet(this, _r)?.length) {
    let s = __privateGet(this, _r), n;
    for (; n = s?.shift(); ) (_b3 = __privateGet(this, _w)) == null ? void 0 : _b3.call(this, ...n);
  }
  return i;
}, q_fn = function(e) {
  var _a3, _b3;
  for (let t of __privateMethod(this, _d_instances, z_fn).call(this, { allowStale: true })) {
    let i = __privateGet(this, _t)[t];
    if (__privateMethod(this, _d_instances, e_fn).call(this, i)) i.__abortController.abort(new Error("deleted"));
    else {
      let s = __privateGet(this, _i)[t];
      __privateGet(this, _T) && ((_a3 = __privateGet(this, _S)) == null ? void 0 : _a3.call(this, i, s, e)), __privateGet(this, _f) && __privateGet(this, _r)?.push([i, s, e]);
    }
  }
  if (__privateGet(this, _s).clear(), __privateGet(this, _t).fill(void 0), __privateGet(this, _i).fill(void 0), __privateGet(this, _d2) && __privateGet(this, _F)) {
    __privateGet(this, _d2).fill(0), __privateGet(this, _F).fill(0);
    for (let t of __privateGet(this, _g) ?? []) t !== void 0 && clearTimeout(t);
    __privateGet(this, _g)?.fill(void 0);
  }
  if (__privateGet(this, __) && __privateGet(this, __).fill(0), __privateSet(this, _a2, 0), __privateSet(this, _h, 0), __privateGet(this, _y).length = 0, __privateSet(this, _b2, 0), __privateSet(this, _n, 0), __privateGet(this, _f) && __privateGet(this, _r)) {
    let t = __privateGet(this, _r), i;
    for (; i = t?.shift(); ) (_b3 = __privateGet(this, _w)) == null ? void 0 : _b3.call(this, ...i);
  }
}, _d);
var _tmpl$$j = /* @__PURE__ */ template(`<img>`), _tmpl$2$e = /* @__PURE__ */ template(`<div><img>`), _tmpl$3$b = /* @__PURE__ */ template(`<canvas style=display:none>`), _tmpl$4$8 = /* @__PURE__ */ template(`<div data-sticker style=width:160px;height:160px><canvas height=160 width=160>`), _tmpl$5$8 = /* @__PURE__ */ template(`<img data-sticker width=160 height=160 style=object-fit:contain>`), _tmpl$6$5 = /* @__PURE__ */ template(`<a>`), _tmpl$7$3 = /* @__PURE__ */ template(`<div class=focusable-attachment tabindex=-1 style=display:inline>`), _tmpl$8$3 = /* @__PURE__ */ template(`<div>`), _tmpl$9$2 = /* @__PURE__ */ template(`<div><div></div><div>`), _tmpl$0$2 = /* @__PURE__ */ template(`<div><div></div><div><svg role=img xmlns=http://www.w3.org/2000/svg width=20 height=20 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z"class>`), _tmpl$1$1 = /* @__PURE__ */ template(`<svg class=playIcon__25e6e aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=12 height=12 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M6 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H6ZM15 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3Z"class>`), _tmpl$10$1 = /* @__PURE__ */ template(`<div tabindex=-1><div></div><div>:<!> / <!>:</div><audio>`), _tmpl$11$1 = /* @__PURE__ */ template(`<svg class=playIcon__25e6e aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=12 height=12 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z"class>`), _tmpl$12$1 = /* @__PURE__ */ template(`<div><div><svg xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=currentColor class="bi bi-file-earmark"viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"></path></svg></div><div><div><a></a></div><div>`);
let webp2pngQueue = Promise.resolve();
const webp2pngCache = /* @__PURE__ */ new Map();
async function cachedWebp2png(url2) {
  if (webp2pngCache.has(url2)) return Promise.resolve(webp2pngCache.get(url2));
  await webp2pngQueue;
  await sleep(10);
  if (webp2pngCache.has(url2)) return Promise.resolve(webp2pngCache.get(url2));
  const promise = webp2png(url2).catch(() => null);
  webp2pngQueue = promise;
  const result = await promise;
  console.log("RESSSULLTTTT", result);
  webp2pngCache.set(url2, result);
  return result;
}
const cachedImagesJar = /* @__PURE__ */ new Map();
const libwebpCache = /* @__PURE__ */ new Map();
const ImageThumbhash = function(props) {
  const [placeholderSrc, setPlaceholder] = createSignal("");
  const [hide$12, setHide] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  let imageEl;
  let canvasEl;
  const [, _props] = splitProps(props, ["$", "onError", "src", "tabIndex", "onFocus", "onBlur", "ref", "style"]);
  const thumbnail = () => props.$;
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  onMount(() => {
    const img = imageEl;
    if (!img) return;
    props.ref?.(img);
    setWidth(img.clientWidth);
    setHeight(img.clientHeight);
  });
  const [src, setSrc] = createSignal("");
  const [blob, setBlob] = createSignal(null);
  createEffect(() => {
    if (!props.src) return;
    imageEl?.setAttribute("data-src", props.src);
    if (cachedImagesJar.has(props.src)) {
      const src2 = cachedImagesJar.get(props.src);
      setSrc(src2);
      props.blobSrc?.(src2);
      return;
    }
    const xhr = new XMLHttpRequest({
      mozSystem: true,
      mozAnon: true
    });
    xhr.open("GET", props.src);
    xhr.setRequestHeader("Accept", "image/avif,image/webp,*/*");
    xhr.responseType = "blob";
    let done = false;
    xhr.onload = () => {
      const blob2 = xhr.response;
      const url2 = URL.createObjectURL(blob2);
      cachedImagesJar.set(props.src, url2);
      setBlob(blob2);
      setSrc(url2);
      props.blobSrc?.(url2);
      done = true;
    };
    xhr.onerror = (e) => {
      props.onError?.(e);
    };
    xhr.send();
    onCleanup(() => {
      if (done) return;
      xhr.onerror = null;
      xhr.onload = null;
      xhr.abort();
    });
  });
  createEffect(() => {
    setHide(false);
    if (!(thumbnail() && "placeholder" in thumbnail()) || !untrack(thumbhashPreview)) return;
    const buffer2 = Uint8Array.from(atob(thumbnail().placeholder), (e) => e.charCodeAt(0));
    const _ = thumbHashToRGBA(buffer2);
    const dataurl = rgbaToDataURL(_.w, _.h, _.rgba);
    setPlaceholder(dataurl);
    let timeout;
    if (imageEl) {
      let onLoad = function() {
        setHide(true);
        timeout = setTimeout(() => {
          setPlaceholder("");
        }, 200);
        setWidth(el.clientWidth);
        setHeight(el.clientHeight);
      };
      const el = imageEl;
      el.addEventListener("load", onLoad);
      return () => {
        el.removeEventListener("load", onLoad);
        clearTimeout(timeout);
      };
    }
  });
  let triedReplaceWebp = false;
  let triedEzgif = false;
  let tryingEzgif = false;
  let triedLibWebp = false;
  let tryingLibWebp = false;
  async function onError(e) {
    if (!untrack(src)) return;
    console.error("ERROR OCCURED WHEN RENDERING THIS IMAGE", e);
    await sleep(1e3);
    if (imageEl.naturalWidth != 0 && imageEl.naturalHeight != 0) {
      console.warn("IMAGE SEEMED TO HAVE LOADED", imageEl);
      return;
    }
    if (tryingEzgif) {
      console.warn("currently trying ezgif, image onError skipped");
      return;
    }
    if (tryingLibWebp) {
      console.warn("currently trying libwebp, image onError skipped");
      return;
    }
    try {
      const originalSrc = props.src;
      if (!originalSrc || !props.$) throw originalSrc;
      if (props.$.url.includes(".webp") || props.$.proxy_url?.includes(".webp")) {
        if (triedReplaceWebp) {
          if (!triedLibWebp && props.$ && props.$.height && props.$.width) {
            console.log("TRY: use libwebp");
            const cached = libwebpCache.get(originalSrc);
            if (cached) {
              props.blobSrc?.(cached);
              setSrc(cached);
              return;
            }
            triedLibWebp = true;
            tryingLibWebp = true;
            const result = await webp(new Uint8Array(await blob().arrayBuffer()), props.$.width, props.$.height).catch(() => null);
            if (result) {
              canvasEl.width = result.width;
              canvasEl.height = result.height;
              const imageData = new ImageData(new Uint8ClampedArray(result.rgba), result.width, result.height);
              canvasEl.getContext("2d").putImageData(imageData, 0, 0);
              const blobResult = await new Promise((res) => canvasEl.toBlob(async (blob2) => {
                if (blob2) {
                  res(blob2);
                }
              }, "image/png", 0.75));
              console.log("SUCCESS: USE LIBWEBP", result);
              const pngSrc = URL.createObjectURL(blobResult);
              libwebpCache.set(originalSrc, pngSrc);
              props.blobSrc?.(pngSrc);
              setSrc(pngSrc);
            } else {
              console.error("FAILED: TO USE LIBWEBP");
              props.onError();
            }
            return;
          }
          if (!triedEzgif && untrack(ezgifAllowed)) {
            console.log("TRY: USE EZGIF WEBP2PNG");
            triedEzgif = true;
            tryingEzgif = true;
            const pngSrc = await cachedWebp2png(originalSrc);
            tryingEzgif = false;
            if (pngSrc) {
              console.log("SUCCESS: USE EZGIF WEBP2PNG", pngSrc);
              props.blobSrc?.(pngSrc);
              setSrc(pngSrc);
            } else {
              console.error("FAILED: TO USE EZGIF WEBP2PNG");
              props.onError();
            }
            return;
          }
        } else {
          console.log("TRY: REPLACE WEBP WITH PNG");
          triedReplaceWebp = true;
          if (props.$.url.includes("cdn.discordapp.com")) {
            setSrc(props.$.url.replace(".webp", ".png"));
          } else {
            setSrc(originalSrc.replace(".webp", ".png"));
          }
          return;
        }
      }
    } catch {
    }
    console.warn("onError is called");
    props.onError?.(...arguments);
  }
  onMount(() => {
    const img = imageEl;
    if (!img) return;
    if (img.complete && img.naturalWidth !== 0) {
      setHide(true);
    }
  });
  function onFocus(e) {
    setFocused(true);
    centerScroll(e.currentTarget);
  }
  function onBlur() {
    setFocused(false);
  }
  function onEnterDown() {
    console.log("ENTER DOWNNNN");
    if (props.onClick) {
      props.onClick();
      return;
    }
    if (!props.$ || !props.$.proxy_url) return;
    const $ = props.$;
    setPaused(true);
    const close = fullscreen(() => createComponent(ImageViewer, {
      get src() {
        return untrack(src);
      },
      get filename() {
        return memo(() => "filename" in $)() ? $.filename : void 0;
      },
      get originalSrc() {
        return $.url;
      },
      onClose: async () => {
        await close?.();
        setPaused(false);
        makeContentUnfocusable();
      }
    }));
  }
  return [createComponent(Show, {
    get when() {
      return memo(() => !!thumbnail())() && "placeholder" in thumbnail();
    },
    get fallback() {
      return (() => {
        var _el$5 = _tmpl$$j();
        var _ref$3 = imageEl;
        typeof _ref$3 === "function" ? use(_ref$3, _el$5) : imageEl = _el$5;
        spread(_el$5, mergeProps(_props, {
          get style() {
            return {
              outline: focused() ? "2px solid #5865f2" : "none",
              opacity: src() === "" ? 0 : void 0,
              ...props.style
            };
          },
          "tabIndex": -1,
          "on:sn-enter-down": onEnterDown,
          get src() {
            return src();
          },
          "onError": onError,
          "onFocus": onFocus,
          "onBlur": onBlur
        }), false, false);
        return _el$5;
      })();
    },
    get children() {
      var _el$ = _tmpl$2$e(), _el$2 = _el$.firstChild;
      className(_el$, thumbhash);
      var _ref$ = imageEl;
      typeof _ref$ === "function" ? use(_ref$, _el$2) : imageEl = _el$2;
      spread(_el$2, mergeProps(_props, {
        get src() {
          return src();
        },
        get style() {
          return {
            outline: focused() ? "2px solid #5865f2" : "none",
            opacity: src() === "" ? 0 : void 0
          };
        },
        "on:sn-enter-down": onEnterDown,
        "onError": onError,
        "onFocus": onFocus,
        "onBlur": onBlur,
        "tabIndex": -1
      }), false, false);
      insert(_el$, createComponent(Show, {
        get when() {
          return placeholderSrc();
        },
        get children() {
          var _el$3 = _tmpl$$j();
          spread(_el$3, mergeProps(_props, {
            get classList() {
              return {
                [layer]: true,
                [hide]: hide$12()
              };
            },
            get src() {
              return placeholderSrc();
            }
          }), false, false);
          return _el$3;
        }
      }), null);
      createRenderEffect((_p$) => {
        var _v$ = width() + "px", _v$2 = height() + "px";
        _v$ !== _p$.e && setStyleProperty(_el$, "width", _p$.e = _v$);
        _v$2 !== _p$.t && setStyleProperty(_el$, "height", _p$.t = _v$2);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$;
    }
  }), (() => {
    var _el$4 = _tmpl$3$b();
    var _ref$2 = canvasEl;
    typeof _ref$2 === "function" ? use(_ref$2, _el$4) : canvasEl = _el$4;
    return _el$4;
  })()];
};
const decideHeight = (e, size2 = 203, minus) => {
  if (!e || typeof e !== "object") return {};
  const dataset = {
    "data-height": e.height ?? void 0,
    "data-width": e.width ?? void 0
  };
  let {
    height,
    width
  } = e;
  if (!height || !width) return {};
  if (minus && height - minus > 0 && width - minus > 0) {
    height -= minus;
    width -= minus;
  }
  if ((width || 0) > size2) {
    return {
      width: size2,
      height: Math.floor(height / width * size2),
      ...dataset
    };
  } else return {
    height,
    width,
    ...dataset
  };
};
function GifVEmbed(props) {
  const [src, setSrc] = createSignal(props.$.thumbnail.proxy_url);
  let imgEl;
  const checkIfInView = function() {
    if (imgEl && isPartiallyInViewport(imgEl)) {
      console.log("SET TO GIF");
      setSrc(props.$.url + ".gif");
    } else {
      setSrc(props.$.thumbnail.proxy_url);
    }
  };
  onMount(() => {
    checkIfInView();
    document.addEventListener("scroll", checkIfInView, true);
  });
  onCleanup(() => {
    document.removeEventListener("scroll", checkIfInView, true);
  });
  return createComponent(ImageThumbhash, mergeProps({
    "class": "v-image",
    get $() {
      return props.$.thumbnail;
    }
  }, () => decideHeight(props.$.thumbnail), {
    ref: (e) => {
      imgEl = e;
    },
    get src() {
      return src();
    }
  }));
}
const fps = 60;
const frameDuration = 1e3 / fps;
const lruSticker = new U({
  max: 5,
  dispose(value) {
    value.length = 0;
  }
});
function LottieSticker(props) {
  let ref;
  let paused2 = true;
  const checkIfInView = function() {
    if (ref && isPartiallyInViewport(ref)) {
      paused2 = false;
    } else {
      paused2 = true;
    }
  };
  let frames = 0;
  let currentFrame = 0;
  const [lottieData, setLottieData] = createSignal("");
  const [rLottieReady, setRlottieReady] = createSignal(false);
  const [rlottieCanvasRef, setRlottieCanvasRef] = createSignal(null);
  onMount(() => {
    document.addEventListener("scroll", checkIfInView, true);
  });
  onCleanup(() => {
    document.removeEventListener("scroll", checkIfInView, true);
  });
  createEffect(() => {
    const ready = rLottieReady();
    const canvas = rlottieCanvasRef();
    const id = props.src;
    if (!ready) return;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    let destroyed = false;
    let animFrame;
    let startTime;
    const cachedFrames = lruSticker.get(id) || [];
    cachedFrames.frames = frames;
    lruSticker.set(id, cachedFrames);
    async function tick_cb(timestamp2) {
      if (destroyed) return;
      if (paused2) {
        requestAnimationFrame((e) => tick_cb(e));
        return;
      }
      if (!startTime) startTime = timestamp2;
      const elapsed = timestamp2 - startTime;
      const frameIndex = Math.floor(elapsed / frameDuration);
      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex % frames;
        if (currentFrame >= frames) currentFrame = 0;
        const clampedBuffer = cachedFrames[currentFrame] || await rlottie.requestFrame(id, currentFrame, 160, 160);
        cachedFrames[currentFrame] = clampedBuffer;
        const imageData = new ImageData(clampedBuffer, 160, 160);
        context.putImageData(imageData, 0, 0);
      }
      animFrame = requestAnimationFrame((e) => {
        tick_cb(e);
      });
    }
    animFrame = requestAnimationFrame((e) => {
      tick_cb(e);
    });
    onCleanup(() => {
      destroyed = true;
      cancelAnimationFrame(animFrame);
      currentFrame = 0;
    });
  });
  createEffect(async () => {
    const canvas = rlottieCanvasRef();
    const data = lottieData();
    if (!canvas) return;
    if (!data) return;
    await rlottie.loadRlottie();
    const cached = await rlottie.isCached(props.src);
    if (cached === false) {
      frames = await rlottie.loadAnimation(props.src, data);
    } else {
      frames = cached;
    }
    setRlottieReady(true);
  });
  const xhr = new XMLHttpRequest({
    mozSystem: true
  });
  onMount(async () => {
    xhr.open("GET", props.src, true);
    xhr.onload = () => {
      const data = xhr.responseText;
      setLottieData(data);
      checkIfInView();
    };
    xhr.send();
  });
  onCleanup(() => {
    xhr.abort();
  });
  return (() => {
    var _el$6 = _tmpl$4$8(), _el$7 = _el$6.firstChild;
    var _ref$4 = ref;
    typeof _ref$4 === "function" ? use(_ref$4, _el$6) : ref = _el$6;
    use(setRlottieCanvasRef, _el$7);
    return _el$6;
  })();
}
function Sticker(props) {
  let ref;
  const [partiallyInViewport, setPartiallyInViewport] = createSignal(false);
  const checkIfInView = function() {
    if (ref && isPartiallyInViewport(ref)) {
      setPartiallyInViewport(true);
    } else {
      setPartiallyInViewport(false);
    }
  };
  onMount(() => {
    document.addEventListener("scroll", checkIfInView, true);
  });
  onCleanup(() => {
    document.removeEventListener("scroll", checkIfInView, true);
  });
  return (() => {
    var _el$8 = _tmpl$5$8();
    var _ref$5 = ref;
    typeof _ref$5 === "function" ? use(_ref$5, _el$8) : ref = _el$8;
    createRenderEffect((_p$) => {
      var _v$3 = `https://media.discordapp.net/stickers/${props.id}.png?size=160${partiallyInViewport() ? "" : "&passthrough=false"}`, _v$4 = `Sticker: ${props.name}`;
      _v$3 !== _p$.e && setAttribute(_el$8, "src", _p$.e = _v$3);
      _v$4 !== _p$.t && setAttribute(_el$8, "alt", _p$.t = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$8;
  })();
}
function FocusableLink(props) {
  const [, _props] = splitProps(props, ["react", "onNavigate"]);
  const [focused, setFocused] = createSignal(false);
  let ref;
  return (() => {
    var _el$9 = _tmpl$7$3();
    _el$9.addEventListener("blur", () => setFocused(false));
    _el$9.addEventListener("focus", () => {
      setFocused(true);
      ref && centerScroll(ref);
    });
    addEventListener(_el$9, "sn-enter-down", () => {
      props.onNavigate?.();
      makeContentUnfocusable();
    });
    var _ref$6 = ref;
    typeof _ref$6 === "function" ? use(_ref$6, _el$9) : ref = _el$9;
    insert(_el$9, createComponent(Show, {
      get when() {
        return !props.react;
      },
      get children() {
        var _el$0 = _tmpl$6$5();
        spread(_el$0, _props, false, false);
        return _el$0;
      }
    }), null);
    insert(_el$9, createComponent(Show, {
      get when() {
        return props.react;
      },
      get children() {
        return props.react;
      }
    }), null);
    createRenderEffect((_$p) => setStyleProperty(_el$9, "outline", focused() ? "2px solid #5865f2" : "none"));
    return _el$9;
  })();
}
function ImageEmbed(props) {
  const embed2 = props.$;
  const src = embed2.thumbnail.proxy_url;
  return createComponent(ImageThumbhash, mergeProps({
    get ["data-url"]() {
      return embed2.url;
    },
    "class": "v-image",
    src,
    get $() {
      return embed2.thumbnail;
    }
  }, () => decideHeight(embed2.thumbnail)));
}
function MessageEmbed(props) {
  props.$.type == "rich" || !!props.$$.$.webhook_id;
  return createComponent(Show, {
    get when() {
      return memo(() => !!(props.$.thumbnail && props.$.url))() && (props.$.type == "image" || props.$.type == "gifv" || !props.$.title && !props.$.description && !props.$.fields);
    },
    get fallback() {
      return (() => {
        var _el$1 = _tmpl$8$3();
        className(_el$1, embed);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.provider?.name;
          },
          get children() {
            var _el$10 = _tmpl$8$3();
            className(_el$10, embedPName);
            insert(_el$10, () => props.$.provider.name);
            return _el$10;
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.author?.name;
          },
          get children() {
            var _el$11 = _tmpl$8$3();
            className(_el$11, embedAName);
            insert(_el$11, () => props.$.author.name);
            return _el$11;
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.title;
          },
          get children() {
            var _el$12 = _tmpl$8$3();
            className(_el$12, embedTitle);
            insert(_el$12, createComponent(Show, {
              get when() {
                return props.$.url;
              },
              get fallback() {
                return props.$.title;
              },
              get children() {
                return createComponent(FocusableLink, {
                  onNavigate: () => {
                    window.open(props.$.url, "_blank");
                  },
                  get href() {
                    return props.$.url;
                  },
                  get children() {
                    return props.$.title;
                  }
                });
              }
            }));
            return _el$12;
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.description;
          },
          get children() {
            var _el$13 = _tmpl$8$3();
            className(_el$13, embedDesc);
            insert(_el$13, createComponent(Markdown, {
              get renderer() {
                return props.renderer;
              },
              get text() {
                return props.$.description;
              }
            }));
            return _el$13;
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.thumbnail;
          },
          get children() {
            return createComponent(ImageThumbhash, mergeProps({
              classList: {
                // [styles.thumb]: true,
                "v-image": true
              },
              get $() {
                return props.$.thumbnail;
              }
            }, () => decideHeight(props.$.thumbnail, 187, 50), {
              get src() {
                return props.$.thumbnail.proxy_url;
              }
            }));
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$;
          },
          get children() {
            return createComponent(For, {
              get each() {
                return props.$.fields;
              },
              children: (field$1) => (() => {
                var _el$15 = _tmpl$9$2(), _el$16 = _el$15.firstChild, _el$17 = _el$16.nextSibling;
                className(_el$16, fieldT);
                insert(_el$16, createComponent(Markdown, {
                  get renderer() {
                    return props.renderer;
                  },
                  get text() {
                    return field$1.name;
                  }
                }));
                insert(_el$17, createComponent(Markdown, {
                  get renderer() {
                    return props.renderer;
                  },
                  get text() {
                    return field$1.value;
                  }
                }));
                createRenderEffect((_$p) => classList(_el$15, {
                  [field]: true,
                  [inline]: field$1.inline
                }, _$p));
                return _el$15;
              })()
            });
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.image;
          },
          get children() {
            return createComponent(ImageThumbhash, mergeProps({
              classList: {
                // [styles.thumb]: true,
                "v-image": true
              },
              get $() {
                return props.$.image;
              },
              get src() {
                return props.$.image.url;
              }
            }, () => decideHeight(props.$.image, 187)));
          }
        }), null);
        insert(_el$1, createComponent(Show, {
          get when() {
            return props.$.timestamp;
          },
          get children() {
            var _el$14 = _tmpl$8$3();
            className(_el$14, timestamp);
            insert(_el$14, () => new Date(props.$.timestamp).toLocaleDateString());
            return _el$14;
          }
        }), null);
        createRenderEffect((_$p) => style(_el$1, props.$.color ? "--line_color:#" + props.$.color.toString(16) : "", _$p));
        return _el$1;
      })();
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return props.$.type == "gifv" || props.$.video && props.$.provider;
        },
        get fallback() {
          return createComponent(ImageEmbed, {
            get $() {
              return props.$;
            }
          });
        },
        get children() {
          return createComponent(GifVEmbed, {
            get $() {
              return props.$;
            }
          });
        }
      });
    }
  });
}
let contentFocusableCallback = null;
let currentID = "";
let toRemove = "";
function makeContentFocusable(cb, id) {
  if (contentFocusableCallback) return;
  pauseKeypress();
  currentID = id || createUniqueId();
  const newID = "images" + currentID;
  if (toRemove !== newID) {
    try {
      __CJS__export_default__.remove(toRemove);
    } catch {
    }
    toRemove = "";
    __CJS__export_default__.add(newID, {
      selector: ".msg-focused .v-image, .msg-focused .focusable-attachment",
      restrict: "self-only",
      rememberSource: true,
      enterTo: "last-focused"
    });
  } else {
    __CJS__export_default__.enable(newID);
  }
  const hmm = __CJS__export_default__.focus(newID);
  console.error("HMMMMM", hmm);
  window.addEventListener("keydown", onKeydownBackspace, true);
  if (!hmm) {
    makeContentUnfocusable();
    cb();
    return;
  }
  contentFocusableCallback = cb;
}
const [paused, setPaused] = createSignal(false);
function onKeydownBackspace(e) {
  if (untrack(paused)) return;
  if (e.key == "Backspace") {
    makeContentUnfocusable();
  }
}
function makeContentUnfocusable() {
  window.removeEventListener("keydown", onKeydownBackspace, true);
  document.activeElement.blur();
  toRemove = "images" + currentID;
  __CJS__export_default__.disable("images" + currentID);
  resumeKeypress();
  contentFocusableCallback?.();
  contentFocusableCallback = null;
}
function ImageAttachment(props) {
  return createComponent(ImageThumbhash, mergeProps({
    get onError() {
      return props.onError;
    },
    "class": "v-image",
    get ["data-filename"]() {
      return props.$.filename;
    },
    get ["data-url"]() {
      return props.$.url;
    },
    get src() {
      return props.$.proxy_url;
    },
    get $() {
      return props.$;
    }
  }, () => decideHeight(props.$, 200)));
}
function VideoAttachment(props) {
  const decision = () => decideHeight(props.$, 200);
  let blobSrc = "";
  const url2 = () => {
    const _ = new URL(props.$.proxy_url);
    const params = decision();
    if (params.height && params.width) {
      _.searchParams.set("width", String(params.width));
      _.searchParams.set("height", String(params.height));
    }
    _.searchParams.set("format", "png");
    return _.toString();
  };
  const poster = () => {
    const _url = url2();
    return blobSrc || _url;
  };
  return (() => {
    var _el$18 = _tmpl$0$2(), _el$19 = _el$18.firstChild, _el$20 = _el$19.nextSibling, _el$21 = _el$20.firstChild;
    className(_el$18, video);
    insert(_el$18, createComponent(ImageThumbhash, mergeProps({
      blobSrc: (url22) => {
        blobSrc = url22;
      },
      get onError() {
        return props.onError;
      },
      "class": "v-image",
      get ["data-filename"]() {
        return props.$.filename;
      },
      get ["data-url"]() {
        return props.$.url;
      },
      get src() {
        return url2();
      },
      onClick: () => {
        setPaused(true);
        const $ = props.$;
        const close = fullscreen(() => createComponent(VideoViewer, {
          get poster() {
            return poster();
          },
          get src() {
            return props.$.url;
          },
          get filename() {
            return memo(() => "filename" in $)() ? $.filename : void 0;
          },
          onClose: async () => {
            await close?.();
            setPaused(false);
            makeContentUnfocusable();
          }
        }));
      }
    }, decision)), _el$19);
    className(_el$19, backdrop);
    className(_el$20, play);
    setAttribute(_el$21, "class", icon$3);
    createRenderEffect((_p$) => {
      var _v$5 = decision().width + "px", _v$6 = decision().height + "px";
      _v$5 !== _p$.e && setStyleProperty(_el$18, "width", _p$.e = _v$5);
      _v$6 !== _p$.t && setStyleProperty(_el$18, "height", _p$.t = _v$6);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$18;
  })();
}
const secondsToHms = (_s2) => {
  const s = Math.ceil(_s2);
  return {
    hours: (s - s % 3600) / 3600,
    minutes: (s - s % 60) / 60 % 60,
    seconds: s % 60
  };
};
function AudioAttachment(props) {
  const [playing$1, setPlaying] = createSignal(false);
  let audioEl;
  const [focused, setFocused] = createSignal(false);
  const [time2, setTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const hours = () => secondsToHms(time2()).hours;
  const minutes = () => secondsToHms(time2()).minutes;
  const seconds = () => secondsToHms(time2()).seconds;
  const totalHours = () => secondsToHms(duration() || props.$.duration_secs || duration()).hours;
  const totalMinutes = () => secondsToHms(duration() || props.$.duration_secs || duration()).minutes;
  const totalSeconds = () => secondsToHms(duration() || props.$.duration_secs || duration()).seconds;
  return (() => {
    var _el$22 = _tmpl$10$1(), _el$23 = _el$22.firstChild, _el$25 = _el$23.nextSibling, _el$26 = _el$25.firstChild, _el$29 = _el$26.nextSibling, _el$27 = _el$29.nextSibling, _el$30 = _el$27.nextSibling;
    _el$30.nextSibling;
    var _el$31 = _el$25.nextSibling;
    addEventListener(_el$22, "sn-enter-down", () => {
      const audio2 = audioEl;
      makeContentUnfocusable();
      if (untrack(playing$1)) {
        audio2.pause();
        setPlaying(false);
        return;
      }
      audio2.play();
      setPlaying(true);
    });
    _el$22.addEventListener("blur", () => setFocused(false));
    _el$22.addEventListener("focus", () => setFocused(true));
    className(_el$23, button);
    insert(_el$23, createComponent(Show, {
      get when() {
        return playing$1();
      },
      get fallback() {
        return _tmpl$11$1();
      },
      get children() {
        return _tmpl$1$1();
      }
    }));
    className(_el$25, secs);
    insert(_el$25, createComponent(Show, {
      get when() {
        return hours() > 0;
      },
      get children() {
        return `${hours()}:`;
      }
    }), _el$26);
    insert(_el$25, () => ("0" + minutes()).slice(-2), _el$26);
    insert(_el$25, () => ("0" + seconds()).slice(-2), _el$29);
    insert(_el$25, createComponent(Show, {
      get when() {
        return totalHours() > 0;
      },
      get children() {
        return `${totalHours()}:`;
      }
    }), _el$30);
    insert(_el$25, () => ("0" + totalMinutes()).slice(-2), _el$30);
    insert(_el$25, () => ("0" + totalSeconds()).slice(-2), null);
    _el$31.addEventListener("ended", () => {
      const audio2 = audioEl;
      audio2.pause();
      audio2.currentTime = 0;
      setPlaying(false);
      setTime(0);
    });
    _el$31.addEventListener("timeupdate", () => {
      setTime(Math.floor(audioEl.currentTime));
      setDuration(audioEl.duration);
    });
    var _ref$7 = audioEl;
    typeof _ref$7 === "function" ? use(_ref$7, _el$31) : audioEl = _el$31;
    createRenderEffect((_p$) => {
      var _v$7 = focused() ? "2px solid #5865f2" : "none", _v$8 = {
        "focusable-attachment": true,
        [audio]: true,
        [playing]: playing$1()
      }, _v$9 = props.$.url;
      _v$7 !== _p$.e && setStyleProperty(_el$22, "outline", _p$.e = _v$7);
      _p$.t = classList(_el$22, _v$8, _p$.t);
      _v$9 !== _p$.a && setAttribute(_el$31, "src", _p$.a = _v$9);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$22;
  })();
}
function MessageAttachment(props) {
  const [didError, setError] = createSignal(false);
  console.log(props.$.content_type);
  return createComponent(Switch, {
    get fallback() {
      return createComponent(FocusableLink, {
        onNavigate: () => {
          window.open(props.$.url, "_blank");
        },
        get react() {
          return (() => {
            var _el$33 = _tmpl$12$1(), _el$34 = _el$33.firstChild, _el$35 = _el$34.nextSibling, _el$36 = _el$35.firstChild, _el$37 = _el$36.firstChild, _el$38 = _el$36.nextSibling;
            className(_el$33, default_attachment);
            className(_el$34, icon$3);
            className(_el$35, text$1);
            insert(_el$37, () => props.$.filename);
            className(_el$38, size);
            insert(_el$38, () => niceBytes(props.$.size));
            createRenderEffect(() => setAttribute(_el$37, "href", props.$.url));
            return _el$33;
          })();
        }
      });
    },
    get children() {
      return [createComponent(Match, {
        get when() {
          return memo(() => !!!didError())() && props.$.content_type?.startsWith("image");
        },
        get children() {
          return createComponent(ImageAttachment, {
            onError: () => {
              setError(true);
            },
            get $() {
              return props.$;
            }
          });
        }
      }), createComponent(Match, {
        get when() {
          return memo(() => !!!didError())() && props.$.content_type?.startsWith("video");
        },
        get children() {
          return createComponent(VideoAttachment, {
            onError: () => {
              setError(true);
              console.error("DID ERROR VIDEO");
            },
            get $() {
              return props.$;
            }
          });
        }
      }), createComponent(Match, {
        get when() {
          return memo(() => !!!didError())() && props.$.content_type?.includes("audio");
        },
        get children() {
          return createComponent(AudioAttachment, {
            get $() {
              return props.$;
            }
          });
        }
      })];
    }
  });
}
function MessageEmbeds(props) {
  const embeds$1 = useStore(() => props.$.embeds);
  const attachments2 = useStore(() => props.$.attachments);
  const stickers = useStore(() => props.$.stickers);
  return (() => {
    var _el$39 = _tmpl$8$3();
    insert(_el$39, createComponent(For, {
      get each() {
        return attachments2();
      },
      children: (a) => createComponent(MessageAttachment, {
        $: a
      })
    }), null);
    insert(_el$39, createComponent(For, {
      get each() {
        return embeds$1();
      },
      children: (embed2) => createComponent(MessageEmbed, {
        get $$() {
          return props.$;
        },
        $: embed2,
        get renderer() {
          return props.renderer;
        }
      })
    }), null);
    insert(_el$39, createComponent(For, {
      get each() {
        return stickers();
      },
      children: (a) => createComponent(Show, {
        get when() {
          return a.format_type == 3;
        },
        get fallback() {
          return createComponent(Sticker, a);
        },
        get children() {
          return createComponent(LottieSticker, {
            get src() {
              return `https://discord.com/stickers/${a.id}.json`;
            }
          });
        }
      })
    }), null);
    createRenderEffect(() => className(_el$39, embeds + " kori-embeds"));
    return _el$39;
  })();
}
var _tmpl$$i = /* @__PURE__ */ template(`<li>`), _tmpl$2$d = /* @__PURE__ */ template(`<br>`), _tmpl$3$a = /* @__PURE__ */ template(`<code>`), _tmpl$4$7 = /* @__PURE__ */ template(`<span style=background-color:red;color:white>An Error occured while trying to render this component. `), _tmpl$5$7 = /* @__PURE__ */ template(`<span>`);
const shortcodeCache = /* @__PURE__ */ new Map();
const parser = SimpleMarkdown.parserFor({
  ...rules,
  ":shortcode:": {
    order: rules.strong.order,
    match: (source) => /^:(\S+):/.exec(source),
    parse(capture) {
      const emoji2 = shortcodeCache.get(capture[1])?.$;
      if (emoji2) {
        return {
          type: "twemoji",
          name: emoji2
        };
      }
      return {
        type: ":shortcode:",
        name: capture[1],
        content: capture[0]
      };
    }
  },
  subtext: extend({
    match: function(source, state) {
      if (state.disallowBlock) {
        return null;
      }
      if (state.prevCapture == null || state.prevCapture[0] === "\n" || "-#" == state.prevCapture[1]) {
        return /^-# +([^\n]+?)(\n|$)/.exec(source);
      }
      return null;
    },
    parse: function(capture) {
      return {
        type: "subtext",
        content: [{
          type: "text",
          content: capture[1].trim()
        }]
      };
    }
  }, SimpleMarkdown.defaultRules.heading)
});
const parse = (input) => {
  return parser(input, {
    inline: true
  });
};
function List(props) {
  return createComponent(Dynamic, {
    get component() {
      return props.node.ordered ? "ol" : "ul";
    },
    get start() {
      return memo(() => !!props.node.ordered)() ? Math.min(Number(props.node.start), 1e9) : void 0;
    },
    get style() {
      return memo(() => !!props.node.ordered)() ? {
        "--total": String(Number(props.node.start) - 1 + props.node.items.length).length
      } : void 0;
    },
    get children() {
      return createComponent(For, {
        get each() {
          return props.node.items;
        },
        children: (a) => (() => {
          var _el$ = _tmpl$$i();
          insert(_el$, createComponent(Factory, {
            node: a,
            get options() {
              return props.options;
            },
            get bigEmoji() {
              return props.bigEmoji;
            }
          }));
          return _el$;
        })()
      });
    }
  });
}
function ShortcodeEmoji(props) {
  const [found, setFound] = createSignal("");
  let mounted = true;
  onMount(async () => {
    const emoji2 = await findByShortCode(props.name);
    emoji2 && shortcodeCache.set(props.name, emoji2);
    if (mounted && emoji2) {
      setFound(emoji2.$);
      props.forceUpdate();
    }
  });
  onCleanup(() => {
    mounted = false;
  });
  return memo(() => found() || props.content);
}
function Unsupported(props) {
  console.error("[Markdown] Unsupported node", unwrap(props.node));
  return props.children;
}
function Factory(props) {
  const child = () => {
    return createComponent(Factory, {
      get node() {
        return props.node.content;
      },
      get options() {
        return props.options;
      },
      get bigEmoji() {
        return props.bigEmoji;
      }
    });
  };
  return createComponent(Show, {
    get when() {
      return props.node;
    },
    get children() {
      return createComponent(Switch, {
        get fallback() {
          return createComponent(Unsupported, {
            get node() {
              return props.node;
            },
            get children() {
              return createComponent(Dynamic, {
                component: child
              });
            }
          });
        },
        get children() {
          return [createComponent(Match, {
            get when() {
              return Array.isArray(props.node);
            },
            get children() {
              return createComponent(For, {
                get each() {
                  return props.node;
                },
                children: (a) => createComponent(Factory, {
                  node: a,
                  get options() {
                    return props.options;
                  },
                  get bigEmoji() {
                    return props.bigEmoji;
                  }
                })
              });
            }
          }), createComponent(Match, {
            get when() {
              return typeof props.node == "string";
            },
            get children() {
              return props.node;
            }
          }), createComponent(Match, {
            get when() {
              return props.node.type;
            },
            get children() {
              return createComponent(Show, {
                get when() {
                  return memo(() => !!props.options.renderer)() && props.options.renderer[props.node.type];
                },
                get fallback() {
                  return createComponent(Switch, {
                    get fallback() {
                      return createComponent(Unsupported, {
                        get node() {
                          return props.node;
                        },
                        get children() {
                          return createComponent(Dynamic, {
                            component: child
                          });
                        }
                      });
                    },
                    get children() {
                      return [createComponent(Match, {
                        get when() {
                          return props.node.type === "text";
                        },
                        get children() {
                          return props.node.content;
                        }
                      }), createComponent(Match, {
                        get when() {
                          return memo(() => !!props.options.inline)() && ["newline", "br"].includes(props.node.type);
                        },
                        children: " "
                      }), createComponent(Match, {
                        get when() {
                          return props.node.type == "newline";
                        },
                        get children() {
                          return _tmpl$2$d();
                        }
                      }), createComponent(Match, {
                        get when() {
                          return ["underline", "strikethrough"].includes(props.node.type);
                        },
                        get children() {
                          return createComponent(Dynamic, {
                            get component() {
                              return props.node.type[0];
                            },
                            get children() {
                              return createComponent(Dynamic, {
                                component: child
                              });
                            }
                          });
                        }
                      }), createComponent(Match, {
                        get when() {
                          return ["em", "strong", "br", "blockQuote"].includes(props.node.type);
                        },
                        get children() {
                          return createComponent(Dynamic, {
                            get component() {
                              return props.node.type.toLowerCase();
                            },
                            get children() {
                              return createComponent(Dynamic, {
                                component: child
                              });
                            }
                          });
                        }
                      }), createComponent(Match, {
                        get when() {
                          return props.node.type == "heading";
                        },
                        get children() {
                          return createComponent(Dynamic, {
                            get component() {
                              return memo(() => !!props.options.inline)() ? "b" : `h${props.node.level}`;
                            },
                            get children() {
                              return createComponent(Dynamic, {
                                component: child
                              });
                            }
                          });
                        }
                      }), createComponent(Match, {
                        get when() {
                          return props.node.type == "inlineCode";
                        },
                        get children() {
                          var _el$3 = _tmpl$3$a();
                          className(_el$3, inline$1);
                          insert(_el$3, createComponent(Dynamic, {
                            component: child
                          }));
                          return _el$3;
                        }
                      }), createComponent(Match, {
                        get when() {
                          return ["everyone", "here"].includes(props.node.type);
                        },
                        get children() {
                          return "@" + props.node.type;
                        }
                      }), createComponent(Match, {
                        get when() {
                          return ["url", "autolink", "link"].includes(props.node.type);
                        },
                        get children() {
                          return createComponent(FocusableLink, {
                            onNavigate: () => {
                              window.open(props.node.target, "_blank");
                            },
                            get href() {
                              return props.node.target;
                            },
                            get children() {
                              return createComponent(Dynamic, {
                                component: child
                              });
                            }
                          });
                        }
                      }), createComponent(Match, {
                        get when() {
                          return props.node.type == "list";
                        },
                        get children() {
                          return createComponent(Show, {
                            get when() {
                              return !props.options.inline;
                            },
                            fallback: " ",
                            get children() {
                              return createComponent(List, {
                                get node() {
                                  return props.node;
                                },
                                get options() {
                                  return props.options;
                                },
                                get bigEmoji() {
                                  return props.bigEmoji;
                                }
                              });
                            }
                          });
                        }
                      }), createComponent(Match, {
                        get when() {
                          return props.node.type == ":shortcode:";
                        },
                        get children() {
                          return createComponent(ShortcodeEmoji, {
                            get content() {
                              return props.node.content;
                            },
                            get name() {
                              return props.node.name;
                            },
                            get forceUpdate() {
                              return props.options.forceUpdate;
                            }
                          });
                        }
                      })];
                    }
                  });
                },
                get children() {
                  return createComponent(Dynamic, {
                    get component() {
                      return props.options.renderer[props.node.type];
                    },
                    get node() {
                      return props.node;
                    },
                    child,
                    noRenderer: () => createComponent(Factory, {
                      get node() {
                        return props.node;
                      },
                      get options() {
                        return {
                          ...props.options,
                          renderer: void 0
                        };
                      },
                      get bigEmoji() {
                        return props.bigEmoji;
                      }
                    }),
                    ref(r$) {
                      var _ref$ = props.options.ref;
                      typeof _ref$ === "function" ? _ref$(r$) : props.options.ref = r$;
                    },
                    get bigEmoji() {
                      return props.bigEmoji;
                    }
                  });
                }
              });
            }
          })];
        }
      });
    }
  });
}
function MarkdownWithForceUpdate(props) {
  const [show, setShow] = createSignal(true);
  function forceUpdate() {
    setShow(false);
    Promise.resolve().then(() => {
      console.warn("A COMPONENT WAS FORCED TO UPDATE");
      setShow(true);
    });
  }
  return createComponent(Show, {
    get when() {
      return show();
    },
    get children() {
      return createComponent(_Markdown, mergeProps(props, {
        forceUpdate
      }));
    }
  });
}
function Markdown(props) {
  return createComponent(ErrorBoundary, {
    fallback: (e) => {
      console.error(e);
      return (() => {
        var _el$4 = _tmpl$4$7();
        _el$4.firstChild;
        className(_el$4, markdown);
        insert(_el$4, () => props.text, null);
        return _el$4;
      })();
    },
    get children() {
      return createComponent(MarkdownWithForceUpdate, props);
    }
  });
}
function _Markdown(props) {
  const [ast, setAst] = createStore([], {});
  const [__ast, setHiddenAst] = createSignal([]);
  createRenderEffect(() => {
    const newAST = parse(props.text);
    batch(() => {
      setAst(reconcile(newAST, {
        merge: true
      }));
      setHiddenAst(newAST);
    });
  });
  const [bigEmoji2, setBigEmoji] = createSignal(false);
  const markdownRefObject = {
    ast: [],
    get bigEmoji() {
      return bigEmoji2();
    },
    set bigEmoji(v) {
      setBigEmoji(v);
    }
  };
  createRenderEffect(() => {
    const _ast = __ast();
    markdownRefObject.ast = _ast;
    const filteredAST = _ast.filter((a) => {
      if (a.type == "br" || a.type == "text" && a.content.trim().length == 0) return false;
      return true;
    });
    markdownRefObject.bigEmoji = false;
    if (filteredAST.length < 31 && filteredAST.every((a) => a.type == "emoji" || a.type == "twemoji")) {
      markdownRefObject.bigEmoji = true;
    }
    if (props.setMarkdownRef) {
      props.setMarkdownRef(markdownRefObject);
    }
    if (props.setBigEmoji) {
      props.setBigEmoji(!!markdownRefObject.bigEmoji);
    }
  });
  return (() => {
    var _el$6 = _tmpl$5$7();
    className(_el$6, markdown);
    insert(_el$6, createComponent(For, {
      each: ast,
      children: (a) => {
        return createComponent(Factory, {
          node: a,
          get options() {
            return {
              renderer: props.renderer,
              inline: props.inline,
              ref: markdownRefObject,
              forceUpdate: props.forceUpdate
            };
          },
          get bigEmoji() {
            return bigEmoji2();
          }
        });
      }
    }));
    return _el$6;
  })();
}
const badge = `_badge_6ddd5f8`;
var _tmpl$$h = /* @__PURE__ */ template(`<div><svg width=12 height=8 viewBox="0 0 12 8"><path d="M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z"fill=currentColor>`);
function ReplyBadge(props) {
  return (() => {
    var _el$ = _tmpl$$h();
    spread(_el$, mergeProps(props, {
      get ["class"]() {
        return `${badge} ${props.class || ""}`;
      }
    }), false, true);
    return _el$;
  })();
}
const timer = `_timer_3a6dc5c`;
const bar = `_bar_2189c7a`;
const recorder = `_recorder_f737b00`;
var _tmpl$$g = /* @__PURE__ */ template(`<div><span class=digits>:</span><span class=digits>.</span><span class="digits mili-sec">`), _tmpl$2$c = /* @__PURE__ */ template(`<span>Preview`), _tmpl$3$9 = /* @__PURE__ */ template(`<span>Stop`), _tmpl$4$6 = /* @__PURE__ */ template(`<span>Send`), _tmpl$5$6 = /* @__PURE__ */ template(`<div tabindex=-1><div><div></div><div><span></span></div><div>`);
function Timer$1(props) {
  return (() => {
    var _el$ = _tmpl$$g(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.firstChild, _el$6 = _el$4.nextSibling;
    className(_el$, timer);
    insert(_el$2, () => ("0" + Math.floor(props.time / 6e4 % 60)).slice(-2), _el$3);
    insert(_el$4, () => ("0" + Math.floor(props.time / 1e3 % 60)).slice(-2), _el$5);
    insert(_el$6, () => ("0" + props.time / 10 % 100).slice(-2));
    return _el$;
  })();
}
function blobToArrayBuffer(blob) {
  if ("arrayBuffer" in blob) {
    return blob.arrayBuffer();
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
const VoiceRecorderWeb = (props) => {
  const [recording, setRecording] = createSignal(false);
  const [paused2, setPaused2] = createSignal(false);
  const [time2, setTime] = createSignal(0);
  const [audioPreview, setAudioPreview] = createSignal(null);
  let divRef;
  let recorder$1;
  let chunks = [];
  let currentStream;
  onMount(() => {
    pauseKeypress();
    divRef.focus();
  });
  onCleanup(() => {
    const _audioPreview = untrack(audioPreview);
    if (_audioPreview) {
      _audioPreview.pause();
      URL.revokeObjectURL(_audioPreview.src);
    }
    divRef.blur();
    resumeKeypress();
  });
  const changeRecording = (recording2) => {
    setRecording(recording2);
    props.onRecordingChange?.(recording2);
  };
  function toggleRecording() {
    const nowRecording = !untrack(recording);
    if (nowRecording) {
      setTime(0);
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      }).then((stream) => {
        currentStream = stream;
        const _chunks = [];
        chunks = _chunks;
        const _recorder = new MediaRecorder(stream);
        recorder$1 = _recorder;
        _recorder.addEventListener("dataavailable", (e) => {
          _chunks.push(e.data);
        });
        _recorder.start();
        changeRecording(true);
      });
    } else {
      if (recorder$1) {
        recorder$1.addEventListener("stop", async () => {
          const blob = new Blob(chunks, {
            type: "audio/ogg; codecs=opus"
          });
          const audioContext = new AudioContext();
          const audioBuffer = await audioContext.decodeAudioData(await blobToArrayBuffer(blob));
          const channelData = audioBuffer.getChannelData(0);
          const bins = new Uint8Array(clamp(Math.floor(audioBuffer.duration * 10), Math.min(32, channelData.length), 256));
          const samplesPerBin = Math.floor(channelData.length / bins.length);
          for (let binIdx = 0; binIdx < bins.length; binIdx++) {
            let squares = 0;
            for (let sampleOffset = 0; sampleOffset < samplesPerBin; sampleOffset++) {
              const sampleIdx = binIdx * samplesPerBin + sampleOffset;
              squares += channelData[sampleIdx] ** 2;
            }
            bins[binIdx] = ~~(Math.sqrt(squares / samplesPerBin) * 255);
          }
          const maxBin = Math.max(...bins);
          const ratio = 1 + (255 / maxBin - 1) * Math.min(1, 100 * (maxBin / 255) ** 3);
          for (let i = 0; i < bins.length; i++) bins[i] = Math.min(255, ~~(bins[i] * ratio));
          props.setAudioBlob(blob, btoa(String.fromCharCode(...bins)), audioBuffer.duration);
          changeRecording(false);
        });
        recorder$1.stop();
        currentStream?.getTracks().forEach((track) => track.stop());
      }
    }
  }
  createEffect(() => {
    let interval = void 0;
    const _recording = recording();
    const _paused = paused2();
    if (_recording && _paused === false) {
      interval = setInterval(() => {
        setTime((time22) => time22 + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    onCleanup(() => {
      clearInterval(interval);
    });
  });
  return (() => {
    var _el$7 = _tmpl$5$6(), _el$8 = _el$7.firstChild, _el$9 = _el$8.firstChild, _el$10 = _el$9.nextSibling, _el$11 = _el$10.firstChild, _el$12 = _el$10.nextSibling;
    var _ref$ = divRef;
    typeof _ref$ === "function" ? use(_ref$, _el$7) : divRef = _el$7;
    _el$7.$$keydown = (e) => {
      if (e.currentTarget !== divRef) return;
      if (e.currentTarget !== document.activeElement) return;
      switch (e.key) {
        case "Backspace":
          props.onCancel();
          break;
        case "SoftRight":
          {
            if (untrack(recording)) {
              toggleRecording();
            }
            if (!untrack(recording) && !!untrack(time2)) {
              props.onSend();
            }
          }
          break;
        case "Enter": {
          if (untrack(recording)) {
            if (untrack(paused2)) recorder$1?.resume();
            else recorder$1?.pause();
            setPaused2((a) => !a);
          } else {
            toggleRecording();
          }
          break;
        }
        case "SoftLeft": {
          if (!untrack(recording) && !!untrack(time2)) {
            const _audioPreview = untrack(audioPreview);
            if (_audioPreview) {
              _audioPreview.pause();
              URL.revokeObjectURL(_audioPreview.src);
              setAudioPreview(null);
            } else {
              const audio2 = new Audio(URL.createObjectURL(new Blob(chunks, {
                type: "audio/ogg; codecs=opus"
              })));
              audio2.play();
              audio2.onended = () => {
                URL.revokeObjectURL(audio2.src);
                setAudioPreview(null);
              };
              setAudioPreview(audio2);
            }
          }
          break;
        }
      }
    };
    className(_el$7, recorder);
    insert(_el$7, createComponent(Timer$1, {
      get time() {
        return time2();
      }
    }), _el$8);
    className(_el$8, bar);
    insert(_el$9, createComponent(Show, {
      get when() {
        return memo(() => !!(!audioPreview() && !recording()))() && !!time2();
      },
      get children() {
        return _tmpl$2$c();
      }
    }), null);
    insert(_el$9, createComponent(Show, {
      get when() {
        return audioPreview();
      },
      get children() {
        return _tmpl$3$9();
      }
    }), null);
    insert(_el$11, createComponent(Show, {
      get when() {
        return recording();
      },
      fallback: "Record",
      get children() {
        return paused2() ? "Resume" : "Pause";
      }
    }));
    insert(_el$12, createComponent(Show, {
      get when() {
        return recording();
      },
      get children() {
        return _tmpl$3$9();
      }
    }), null);
    insert(_el$12, createComponent(Show, {
      get when() {
        return memo(() => !!!recording())() && !!time2();
      },
      get children() {
        return _tmpl$4$6();
      }
    }), null);
    return _el$7;
  })();
};
delegateEvents(["keydown"]);
function filePicker() {
  const deferred = new Deferred();
  let input = document.createElement("input");
  input.type = "file";
  input.onchange = () => {
    deferred.resolve(input.files[0]);
    input.onchange = null;
  };
  input.click();
  return deferred.promise;
}
const settings = `_settings_99036f0`;
const _switch = `__switch_ec5df50`;
const on = `_on_87df890`;
const toggle = `_toggle_db6e985`;
const control_wrap = `_control_wrap_26d0162`;
const text = `_text_05cf244`;
const button_wrap = `_button_wrap_2f3a657`;
const header = `_header_ebd6a08`;
const content$1 = `_content_0a0f963`;
const icon = `_icon_89f7acb`;
const heading = `_heading_c90a092`;
const user$1 = `_user_0845e70`;
const avatar$1 = `_avatar_5b43213`;
const desc = `_desc_99e88db`;
const buttons = `_buttons_5c6ef85`;
var define_import_meta_env_MANIFEST_default = { name: "Kori" };
var _tmpl$$f = /* @__PURE__ */ template(`<div tabindex=-1><div><div></div><div>`), _tmpl$2$b = /* @__PURE__ */ template(`<div>`), _tmpl$3$8 = /* @__PURE__ */ template(`<div><div>`), _tmpl$4$5 = /* @__PURE__ */ template(`<div><img src=/icon112.png><div>`), _tmpl$5$5 = /* @__PURE__ */ template(`<div tabindex=-1><small>(a.k.a. <!>)</small> is the first and only actually usable Discord client for KaiOS.`), _tmpl$6$4 = /* @__PURE__ */ template(`<div>Developer`), _tmpl$7$2 = /* @__PURE__ */ template(`<div tabindex=-1><div></div><div><div>Cyan</div><div>cyan2048`), _tmpl$8$2 = /* @__PURE__ */ template(`<div tabindex=-1> is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Discord™, or any of its subsidiaries or its affiliates.`);
const focusable = true;
function Toggle(props) {
  const [focused, setFocused] = createSignal(false);
  return (() => {
    var _el$ = _tmpl$$f(), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling;
    _el$.addEventListener("blur", () => {
      setFocused(false);
    });
    _el$.addEventListener("focus", () => {
      setFocused(true);
    });
    addEventListener(_el$, "sn-enter-down", () => {
      props.onChange(!props.value);
    });
    className(_el$2, control_wrap);
    className(_el$3, text);
    insert(_el$3, createComponent(MarqueeOrNot, {
      get marquee() {
        return focused();
      },
      get children() {
        return props.title;
      }
    }));
    createRenderEffect((_p$) => {
      var _v$ = {
        [toggle]: true,
        focusable: true
      }, _v$2 = {
        [_switch]: true,
        [on]: props.value
      };
      _p$.e = classList(_el$, _v$, _p$.e);
      _p$.t = classList(_el$4, _v$2, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}
function Button(props) {
  const [disabled, setDisabled] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  async function handleClick() {
    setDisabled(true);
    await props.onClick();
    setDisabled(false);
  }
  return (() => {
    var _el$5 = _tmpl$2$b();
    className(_el$5, button_wrap);
    insert(_el$5, createComponent(Button$1, {
      classList: {
        focusable
      },
      get focused() {
        return focused();
      },
      tabIndex: -1,
      "on:sn-enter-down": handleClick,
      onFocus: () => {
        setFocused(true);
      },
      onBlur: () => {
        setFocused(false);
      },
      onClick: handleClick,
      get disabled() {
        return disabled();
      },
      get children() {
        return props.children;
      }
    }));
    return _el$5;
  })();
}
const SN_ID$1 = "settings";
function Settings(props) {
  onMount(() => {
    __CJS__export_default__.add(SN_ID$1, {
      selector: `.${settings} .focusable`,
      restrict: "self-only"
    });
    pauseKeypress();
    __CJS__export_default__.focus(SN_ID$1);
  });
  onCleanup(() => {
    __CJS__export_default__.remove(SN_ID$1);
    resumeKeypress();
  });
  const [page, setPage] = createSignal(
    0
    /* Settings */
  );
  createEffect(() => {
    page();
    queueMicrotask(() => {
      __CJS__export_default__.focus(SN_ID$1);
    });
  });
  let backspacePaused = false;
  useKeypress("Backspace", async () => {
    if (backspacePaused) return;
    switch (page()) {
      case 1:
        setPage(
          0
          /* Settings */
        );
        break;
      default:
        props.onClose();
    }
  }, true);
  return (() => {
    var _el$6 = _tmpl$3$8(), _el$7 = _el$6.firstChild;
    addEventListener(_el$6, "sn-willfocus", (e) => {
      centerScroll(e.target);
    });
    className(_el$6, settings);
    className(_el$7, header);
    insert(_el$7, createComponent(Switch, {
      get children() {
        return [createComponent(Match, {
          get when() {
            return page() == 0;
          },
          children: "Settings"
        }), createComponent(Match, {
          get when() {
            return page() == 1;
          },
          children: "Discord4KaiOS"
        })];
      }
    }));
    insert(_el$6, createComponent(Switch, {
      get children() {
        return [createComponent(Match, {
          get when() {
            return page() == 0;
          },
          get children() {
            return [createComponent(Toggle, {
              title: "Dark Mode",
              get value() {
                return themeStyle() == ThemeStyle.DARK;
              },
              onChange: (val) => {
                setTheme(val ? ThemeStyle.DARK : ThemeStyle.LIGHT);
              }
            }), createComponent(Toggle, {
              title: "Enable Animations",
              get value() {
                return animateApp();
              },
              onChange: (val) => {
                setAnimate(val);
              }
            }), createComponent(Toggle, {
              title: "Preserve Deleted Messages",
              get value() {
                return preserveDeleted();
              },
              onChange: (val) => {
                setPreserveDeleted(val);
              }
            }), createComponent(Toggle, {
              title: "Disable Discord Link Labels",
              get value() {
                return disableDiscordLinkLabels();
              },
              onChange: (val) => {
                setDisableDiscordLinkLabels(val);
              }
            }), createComponent(Toggle, {
              title: "Use ezgif for webp",
              get value() {
                return ezgifAllowed();
              },
              onChange: (val) => {
                setEzgifAllowed(val);
              }
            }), (() => {
              var _el$8 = _tmpl$2$b();
              className(_el$8, buttons);
              insert(_el$8, createComponent(Button, {
                onClick: async () => {
                  const actEl = document.activeElement;
                  backspacePaused = true;
                  const close = slide(() => createComponent(OptionsMenu, {
                    onSelect: async (e) => {
                      await close?.();
                      backspacePaused = false;
                      if (e !== null) {
                        const m = await __vitePreload(() => import("./EmojiPicker-D-2hHhU7.js"), true ? [] : void 0);
                        const variations = [null].concat(m.SUPPORTED_VARIATIONS);
                        setEmojiVariation(variations[e]);
                      }
                      actEl.focus();
                    },
                    items: [{
                      text: "None",
                      icon: () => "👌",
                      id: 0
                    }, {
                      text: "Light",
                      icon: () => "👌🏻",
                      id: 1
                    }, {
                      text: "Medium Light",
                      icon: () => "👌🏼",
                      id: 2
                    }, {
                      text: "Medium",
                      icon: () => "👌🏽",
                      id: 3
                    }, {
                      text: "Medium Dark",
                      icon: () => "👌🏾",
                      id: 4
                    }, {
                      text: "Dark",
                      icon: () => "👌🏿",
                      id: 5
                    }]
                  }));
                },
                children: "Change Emoji Skin Tone"
              }), null);
              insert(_el$8, createComponent(Button, {
                onClick: async () => {
                  if (!confirm("You sure?")) return;
                  try {
                    await discordSetup.logout()?.response();
                    await localforage.removeItem("token");
                    location.reload();
                  } catch {
                    alert("Failed to logout");
                  }
                },
                children: "Logout"
              }), null);
              insert(_el$8, createComponent(Button, {
                onClick: () => {
                  setPage(
                    1
                    /* About */
                  );
                },
                children: "About"
              }), null);
              return _el$8;
            })()];
          }
        }), createComponent(Match, {
          get when() {
            return page() == 1;
          },
          get children() {
            return createComponent(About, {});
          }
        })];
      }
    }), null);
    return _el$6;
  })();
}
function About() {
  const [appName, setAppName] = createSignal("Kori");
  const [dev, setDev] = createSignal(null);
  onMount(() => {
    {
      const manifest = define_import_meta_env_MANIFEST_default;
      setAppName(manifest.name);
    }
    const client = untrack(discordClientReady);
    const devUserId = "733929955099934741";
    const unsub = client?.waitForUser(devUserId).subscribe((user2) => {
      if (user2 == null) {
        client?.Request.get(`users/${devUserId}/profile`, {}).response().then((e) => {
          client.addUser(e.user);
        }).catch(() => {
        });
      }
      setDev(user2);
      queueMicrotask(() => {
        unsub?.();
      });
    });
  });
  return [(() => {
    var _el$9 = _tmpl$4$5(), _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling;
    className(_el$9, icon);
    insert(_el$1, () => "3.2.2");
    return _el$9;
  })(), (() => {
    var _el$10 = _tmpl$5$5(), _el$11 = _el$10.firstChild, _el$12 = _el$11.firstChild, _el$14 = _el$12.nextSibling;
    _el$14.nextSibling;
    insert(_el$11, () => appName() || "Sveltecord", _el$14);
    createRenderEffect((_$p) => classList(_el$10, {
      focusable: true,
      [content$1]: true
    }, _$p));
    return _el$10;
  })(), createComponent(Show, {
    get when() {
      return dev();
    },
    get children() {
      return [(() => {
        var _el$15 = _tmpl$6$4();
        className(_el$15, heading);
        return _el$15;
      })(), (() => {
        var _el$16 = _tmpl$7$2(), _el$17 = _el$16.firstChild, _el$18 = _el$17.nextSibling;
        className(_el$17, avatar$1);
        insert(_el$17, createComponent(UserAvatar, {
          size: 32,
          get $() {
            return dev();
          }
        }));
        className(_el$18, desc);
        createRenderEffect((_$p) => classList(_el$16, {
          [user$1]: true,
          focusable: true
        }, _$p));
        return _el$16;
      })()];
    }
  }), (() => {
    var _el$19 = _tmpl$8$2(), _el$20 = _el$19.firstChild;
    insert(_el$19, () => appName() || "Sveltecord", _el$20);
    createRenderEffect((_$p) => classList(_el$19, {
      focusable: true,
      [content$1]: true
    }, _$p));
    return _el$19;
  })()];
}
const reaction_container = `_reaction_container_ff94ef2`;
const reactionButton = `_reactionButton_603f64c`;
const selected$1 = `_selected_66fe2b7`;
const avatar = `_avatar_9d37107`;
const user = `_user_f93281f`;
const name = `_name_b6cc878`;
const username = `_username_5ce2e8f`;
const num = `_num_9dd1f35`;
const non_uni = `_non_uni_8fdb6ed`;
const unicode = `_unicode_2f9715a`;
const reactions = `_reactions_69f8d6b`;
const MessageReactions$1 = `_MessageReactions_5d9ec64`;
var _tmpl$$e = /* @__PURE__ */ template(`<div><img>`), _tmpl$2$a = /* @__PURE__ */ template(`<div tabindex=-1><div>`), _tmpl$3$7 = /* @__PURE__ */ template(`<div>`), _tmpl$4$4 = /* @__PURE__ */ template(`<span>`), _tmpl$5$4 = /* @__PURE__ */ template(`<div tabindex=-1><div></div><div>`), _tmpl$6$3 = /* @__PURE__ */ template(`<div><div>`);
function Reaction(props) {
  const emoji2 = useStore(() => props.$, "emoji");
  const count2 = useStore(() => props.$, "count");
  return (() => {
    var _el$ = _tmpl$2$a(), _el$4 = _el$.firstChild;
    _el$.$$click = () => {
      props.setSelected(props.$);
    };
    addEventListener(_el$, "sn-enter-down", () => {
      props.setSelected(props.$);
    });
    _el$.addEventListener("focus", (e) => {
      scrollIntoView(e.currentTarget, {
        time: 100,
        ease: (n) => n,
        isScrollable: (target) => {
          return target?.classList?.contains(reaction_container);
        }
      });
    });
    insert(_el$, createComponent(Show, {
      get when() {
        return emoji2().id;
      },
      get fallback() {
        return (() => {
          var _el$5 = _tmpl$3$7();
          className(_el$5, unicode);
          insert(_el$5, () => emoji2().name);
          return _el$5;
        })();
      },
      get children() {
        var _el$2 = _tmpl$$e(), _el$3 = _el$2.firstChild;
        className(_el$2, non_uni);
        createRenderEffect((_p$) => {
          var _v$ = `https://cdn.discordapp.com/emojis/${emoji2().id}.${emoji2().animated ? "gif" : "png"}?size=16`, _v$2 = emoji2().name;
          _v$ !== _p$.e && setAttribute(_el$3, "src", _p$.e = _v$);
          _v$2 !== _p$.t && setAttribute(_el$3, "alt", _p$.t = _v$2);
          return _p$;
        }, {
          e: void 0,
          t: void 0
        });
        return _el$2;
      }
    }), _el$4);
    className(_el$4, num);
    insert(_el$4, count2);
    createRenderEffect((_$p) => classList(_el$, {
      focusable: true,
      [reactionButton]: true,
      [selected$1]: props.selected
    }, _$p));
    return _el$;
  })();
}
const cache = /* @__PURE__ */ new WeakMap();
function ReactionUser(props) {
  const [focused, setFocused] = createSignal(false);
  return (() => {
    var _el$6 = _tmpl$5$4(), _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling;
    _el$6.addEventListener("blur", () => {
      setFocused(false);
    });
    _el$6.addEventListener("focus", (e) => {
      setFocused(true);
      centerScroll(e.currentTarget);
    });
    className(_el$7, avatar);
    insert(_el$7, createComponent(UserAvatar, mergeProps({
      size: 20
    }, props)));
    className(_el$8, name);
    insert(_el$8, createComponent(MarqueeOrNot, {
      get marquee() {
        return focused();
      },
      get children() {
        return [createComponent(UserLabel, mergeProps({
          nickname: true
        }, props)), " ", (() => {
          var _el$9 = _tmpl$4$4();
          className(_el$9, username);
          insert(_el$9, () => "@" + props.$.$.username);
          return _el$9;
        })()];
      }
    }));
    createRenderEffect(() => className(_el$6, "focusable " + user));
    return _el$6;
  })();
}
function SelectedReaction(props) {
  const [users, setUsers] = createSignal([]);
  createEffect(() => {
    const selectedReaction = props.$;
    setUsers([]);
    const cached = cache.get(selectedReaction);
    if (cached) {
      setUsers(Array.from(cached));
    }
    const emoji2 = selectedReaction.$.emoji;
    const hasBurst = Boolean(selectedReaction.$.count_details?.burst);
    if (hasBurst) console.error(selectedReaction.$, selectedReaction.$.count_details?.normal);
    const hasNormal = hasBurst ? Number(selectedReaction.$.count_details?.normal) > 0 : true;
    const resp = hasNormal ? props.reactions.getReactions(emoji2, 100).response() : Promise.resolve([]);
    function mergeUsers(users2) {
      const _users = cache.get(selectedReaction) || /* @__PURE__ */ new Set();
      users2.forEach((a) => {
        const user2 = selectedReaction.$message.$channel.$client.addUser(a);
        _users.add(user2);
      });
      cache.set(selectedReaction, _users);
      if (props.$ == selectedReaction) {
        setUsers(() => Array.from(_users));
      }
    }
    resp.then(async (users2) => {
      mergeUsers(users2);
      if (hasBurst) {
        await sleep(2e3);
        const users3 = await props.reactions.getReactions(emoji2, 100, void 0, 1).response();
        mergeUsers(users3);
      }
    }).catch((e) => {
      console.error("Error occured when fetching users in reaction emoji", e);
    });
  });
  return (() => {
    var _el$0 = _tmpl$3$7();
    addEventListener(_el$0, "sn-navigatefailed", (e) => {
      const direction = e.detail.direction;
      if (direction == "up") {
        __CJS__export_default__.focus("reactions");
      }
    });
    className(_el$0, reactions);
    insert(_el$0, createComponent(For, {
      get each() {
        return users();
      },
      fallback: "Loading...",
      children: (user2) => createComponent(ReactionUser, {
        $: user2,
        get guild() {
          return props.guild;
        }
      })
    }));
    return _el$0;
  })();
}
function MessageReactionsPopup(props) {
  const reactions$12 = useStore(() => props.$.reactions.state);
  const [selected2, setSelected] = createSignal(null);
  onMount(() => {
    __CJS__export_default__.add("reactions", {
      selector: `.${reaction_container} .focusable`,
      restrict: "self-only",
      rememberSource: true
    });
    __CJS__export_default__.add("reactions_selected", {
      selector: `.${reactions} .focusable`,
      restrict: "self-only",
      rememberSource: true
    });
    __CJS__export_default__.focus("reactions");
  });
  onCleanup(() => {
    __CJS__export_default__.remove("reactions");
    __CJS__export_default__.remove("reactions_selected");
  });
  createEffect(() => {
    const _r2 = reactions$12();
    const _s2 = selected2();
    if (_s2 == null || _s2 && !_r2.includes(_s2)) {
      setSelected(_r2[0]);
    }
  });
  const isSelected = createSelector(selected2);
  return (() => {
    var _el$1 = _tmpl$6$3(), _el$10 = _el$1.firstChild;
    _el$1.$$keydown = (e) => {
      if (e.key == "Backspace") {
        props.onClose();
      }
    };
    className(_el$1, MessageReactions$1);
    addEventListener(_el$10, "sn-navigatefailed", (e) => {
      if (e.detail.direction == "down") {
        __CJS__export_default__.focus("reactions_selected");
      }
    });
    className(_el$10, reaction_container);
    insert(_el$10, createComponent(For, {
      get each() {
        return reactions$12();
      },
      children: (reaction) => createComponent(Reaction, {
        get selected() {
          return isSelected(reaction);
        },
        setSelected,
        $: reaction
      })
    }));
    insert(_el$1, createComponent(Show, {
      get when() {
        return selected2();
      },
      children: ($) => createComponent(SelectedReaction, {
        get guild() {
          return props.guild;
        },
        get $() {
          return $();
        },
        get reactions() {
          return props.$.reactions;
        }
      })
    }), null);
    return _el$1;
  })();
}
delegateEvents(["click", "keydown"]);
var _tmpl$$d = /* @__PURE__ */ template(`<svg height=18 width=18 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><path d="m18 0h-18v18h18z"></path><path d="m3.8 8 3.6-3.6-1.4-1.4-6 6 6 6 1.4-1.4-3.6-3.6h14.2v-2"fill=#ed4245>`), _tmpl$2$9 = /* @__PURE__ */ template(`<small>`), _tmpl$3$6 = /* @__PURE__ */ template(`<span> from the group. `);
function LeaveDMMessage(props) {
  const mentionedUser = () => props.$.$.mentions[0]?.id != props.$.author.id ? props.$.$channel.$client.addUser(props.$.$.mentions[0]) : null;
  return createComponent(ActionMessage, {
    get $() {
      return props.$.author;
    },
    icon: () => _tmpl$$d(),
    after: () => createComponent(Show, {
      get when() {
        return !mentionedUser();
      },
      get fallback() {
        return [" removed ", (() => {
          var _el$3 = _tmpl$3$6(), _el$4 = _el$3.firstChild;
          className(_el$3, user$3);
          insert(_el$3, createComponent(UserLabel, {
            get $() {
              return mentionedUser();
            },
            color: true,
            nickname: true
          }), _el$4);
          return _el$3;
        })(), (() => {
          var _el$5 = _tmpl$2$9();
          className(_el$5, date);
          insert(_el$5, () => timeStamp(props.$.$.timestamp));
          return _el$5;
        })()];
      },
      get children() {
        return [" ", "left the group. ", (() => {
          var _el$2 = _tmpl$2$9();
          className(_el$2, date);
          insert(_el$2, () => timeStamp(props.$.$.timestamp));
          return _el$2;
        })()];
      }
    })
  });
}
var _tmpl$$c = /* @__PURE__ */ template(`<svg height=18 width=18 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><path d="m18 0h-18v18h18z"></path><path d="m0 8h14.2l-3.6-3.6 1.4-1.4 6 6-6 6-1.4-1.4 3.6-3.6h-14.2"fill=#3ba55c>`), _tmpl$2$8 = /* @__PURE__ */ template(`<span>`), _tmpl$3$5 = /* @__PURE__ */ template(`<small>`);
function JoinDMMessage(props) {
  const mentionedUser = () => props.$.$.mentions[0]?.id != props.$.author.id ? props.$.$channel.$client.addUser(props.$.$.mentions[0]) : null;
  return createComponent(ActionMessage, {
    get $() {
      return props.$.author;
    },
    icon: () => _tmpl$$c(),
    after: () => createComponent(Show, {
      get when() {
        return mentionedUser();
      },
      get children() {
        return [" ", "added", " ", (() => {
          var _el$2 = _tmpl$2$8();
          className(_el$2, user$3);
          insert(_el$2, createComponent(UserLabel, {
            get $() {
              return mentionedUser();
            },
            color: true,
            nickname: true
          }));
          return _el$2;
        })(), " ", "the group. ", (() => {
          var _el$3 = _tmpl$3$5();
          className(_el$3, date);
          insert(_el$3, () => timeStamp(props.$.$.timestamp));
          return _el$3;
        })()];
      }
    })
  });
}
var _tmpl$$b = /* @__PURE__ */ template(`<svg height=18 width=18 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><path d="m0 14.25v3.75h3.75l11.06-11.06-3.75-3.75zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75z"fill=#99aab5></path><path d="m0 0h18v18h-18">`), _tmpl$2$7 = /* @__PURE__ */ template(`<span style=font-weight:700>`), _tmpl$3$4 = /* @__PURE__ */ template(`<small>`);
function NameChangeDMMessage(props) {
  return createComponent(ActionMessage, {
    get $() {
      return props.$.author;
    },
    icon: () => _tmpl$$b(),
    after: () => [" changed the name to: ", (() => {
      var _el$2 = _tmpl$2$7();
      insert(_el$2, () => props.$.$.content);
      return _el$2;
    })(), " ", (() => {
      var _el$3 = _tmpl$3$4();
      className(_el$3, date);
      insert(_el$3, () => timeStamp(props.$.$.timestamp));
      return _el$3;
    })()]
  });
}
var _tmpl$$a = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=18 height=18><path fill=#3ba55c fill-rule=evenodd d="M17.7163041 15.36645368c-.0190957.02699568-1.9039523 2.6680735-2.9957762 2.63320406-3.0676659-.09785935-6.6733809-3.07188394-9.15694343-5.548738C3.08002193 9.9740657.09772497 6.3791404 0 3.3061316v-.024746C0 2.2060575 2.61386252.3152347 2.64082114.2972376c.7110335-.4971705 1.4917101-.3149497 1.80959713.1372281.19320342.2744561 2.19712724 3.2811005 2.42290565 3.6489167.09884826.1608492.14714912.3554431.14714912.5702838 0 .2744561-.07975258.5770327-.23701117.8751101-.1527655.2902036-.65262318 1.1664385-.89862055 1.594995.2673396.3768148.94804468 1.26429792 2.351016 2.66357424 1.39173858 1.39027775 2.28923588 2.07641807 2.67002628 2.34187563.4302146-.2452108 1.3086162-.74238132 1.5972981-.89423205.5447887-.28682915 1.0907006-.31944893 1.4568885-.08661115.3459689.2182151 3.3383754 2.21027167 3.6225641 2.41611376.2695862.19234426.4144887.5399137.4144887.91672846 0 .2969525-.089862.61190215-.2808189.88523346">`), _tmpl$2$6 = /* @__PURE__ */ template(`<small>`);
function CallMessage(props) {
  return createComponent(ActionMessage, {
    get $() {
      return props.$.author;
    },
    icon: () => _tmpl$$a(),
    after: () => [" ", "started a call. ", (() => {
      var _el$2 = _tmpl$2$6();
      className(_el$2, date);
      insert(_el$2, () => timeStamp(props.$.$.timestamp));
      return _el$2;
    })()]
  });
}
const picker = `_picker_2dfbf85`;
const main = `_main_dd31081`;
const search$1 = `_search_36b7e19`;
const trending = `_trending_1b9bed1`;
const category = `_category_0a1acc5`;
const content = `_content_cc7bfe2`;
const column = `_column_a43ba98`;
const gif = `_gif_b8314fd`;
var _tmpl$$9 = /* @__PURE__ */ template(`<div><input type=search placeholder="Search GIF">`), _tmpl$2$5 = /* @__PURE__ */ template(`<div tabindex=-1><div>`), _tmpl$3$3 = /* @__PURE__ */ template(`<div><div tabindex=-1><div>trending`), _tmpl$4$3 = /* @__PURE__ */ template(`<div tabindex=-1>`), _tmpl$5$3 = /* @__PURE__ */ template(`<div>`), _tmpl$6$2 = /* @__PURE__ */ template(`<div><div>`);
const SN_ID = "gif-picker";
function searchGifs(q) {
  return Promise.resolve(untrack(discordClientReady)?.gif.search(q).response().catch(async (e) => {
    if (e && e instanceof RateLimitError) {
      await e.wait();
      return searchGifs(q);
    }
    return [];
  }) || []);
}
const searchGifsMemo = memoize(searchGifs);
function getTrending() {
  return Promise.resolve(untrack(discordClientReady)?.gif.getTrendingGifs().response().catch(async (e) => {
    if (e && e instanceof RateLimitError) {
      await e.wait();
      return getTrending();
    }
    return [];
  }) || []);
}
const getTrendingMemo = memoize(getTrending);
let search = (q) => {
};
function Search(props) {
  let inputRef;
  let mounted = true;
  async function searchGif(search2) {
    console.log("SEARCHING GIFS!!!");
    const gifs = await searchGifsMemo(search2);
    if (!mounted || search2 != inputRef.value) return;
    if (inputRef?.value) {
      props.setResult(gifs);
    } else {
      props.setResult([]);
    }
  }
  const debouncedSearch = debounce(searchGif, 2100);
  onMount(() => {
    search = (q) => {
      searchGif(q);
      inputRef.value = q;
      inputRef.focus({
        preventScroll: true
      });
    };
    clearSearch = () => {
      inputRef.value = "";
      inputRef.focus({
        preventScroll: true
      });
    };
  });
  onCleanup(() => {
    mounted = false;
  });
  return (() => {
    var _el$ = _tmpl$$9(), _el$2 = _el$.firstChild;
    className(_el$, search$1);
    _el$2.$$keydown = (e) => {
      if (e.key == "Backspace" && !e.target.value) {
        props.onClose();
      }
      if (e.key.includes("Arrow") && (e.key.includes("Right") || e.key.includes("Left"))) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    _el$2.addEventListener("focus", (e) => {
      centerScroll(e.currentTarget);
    });
    _el$2.$$input = (e) => {
      const search2 = e.target.value;
      if (search2) {
        debouncedSearch(search2);
      } else {
        props.setResult([]);
      }
    };
    var _ref$ = inputRef;
    typeof _ref$ === "function" ? use(_ref$, _el$2) : inputRef = _el$2;
    return _el$;
  })();
}
let trendingCache = null;
let clearSearch = () => {
};
function GifCategory(props) {
  const [focused, setFocused] = createSignal(false);
  return (() => {
    var _el$3 = _tmpl$2$5(), _el$4 = _el$3.firstChild;
    _el$3.$$keydown = (e) => {
      if (e.key == "Backspace") {
        props.onClose();
      }
    };
    addEventListener(_el$3, "sn-enter-down", () => {
      search(props.category.name);
    });
    _el$3.addEventListener("blur", () => setFocused(false));
    _el$3.addEventListener("focus", (e) => {
      centerScroll(e.currentTarget);
      setFocused(true);
    });
    insert(_el$4, () => props.category.name);
    createRenderEffect((_p$) => {
      var _v$ = {
        [category]: true,
        focusable: true
      }, _v$2 = `url(${focused() ? props.category.src : props.category.src.replace("AAAAM/", "AAAAD/")})`;
      _p$.e = classList(_el$3, _v$, _p$.e);
      _v$2 !== _p$.t && setStyleProperty(_el$3, "background-image", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$3;
  })();
}
function Trending(props) {
  const [trending$1, setTrending] = createSignal([]);
  let mounted = true;
  const [trendingGif, setTrendingGif] = createSignal([]);
  const [focused, setFocused] = createSignal(false);
  onMount(() => {
    const client = discordClientReady();
    if (trendingCache) {
      batch(() => {
        setTrendingGif(trendingCache.gifs);
        setTrending(trendingCache.categories);
      });
    } else if (client) {
      async function fetchTrending() {
        client && client.gif.getTrending().response().then((trending2) => {
          if (mounted) {
            trendingCache = trending2;
            batch(() => {
              setTrendingGif(trending2.gifs);
              setTrending(trending2.categories);
            });
          }
        }).catch(async (e) => {
          if (e && e instanceof RateLimitError) {
            await e.wait();
            fetchTrending();
          }
        });
      }
      fetchTrending();
    }
  });
  onCleanup(() => {
    mounted = false;
  });
  return (() => {
    var _el$5 = _tmpl$3$3(), _el$6 = _el$5.firstChild;
    className(_el$5, trending);
    _el$6.$$keydown = (e) => {
      if (e.key == "Backspace") {
        props.onClose();
      }
    };
    addEventListener(_el$6, "sn-enter-down", () => {
      props.showTrending();
    });
    _el$6.addEventListener("blur", (e) => {
      setFocused(false);
    });
    _el$6.addEventListener("focus", (e) => {
      centerScroll(e.currentTarget);
      setFocused(true);
    });
    insert(_el$5, createComponent(For, {
      get each() {
        return trending$1();
      },
      children: (category2) => createComponent(GifCategory, {
        get onClose() {
          return props.onClose;
        },
        category: category2
      })
    }), null);
    createRenderEffect((_p$) => {
      var _v$3 = {
        [category]: true,
        focusable: true
      }, _v$4 = trendingGif()[0] ? `url(${focused() ? trendingGif()[0].src : trendingGif()[0].preview})` : void 0;
      _p$.e = classList(_el$6, _v$3, _p$.e);
      _v$4 !== _p$.t && setStyleProperty(_el$6, "background-image", _p$.t = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$5;
  })();
}
function inColumns(arr, count2) {
  return Array.from(Array(3).keys(), (c) => arr.filter((_, i) => i % count2 === c));
}
function GifItem(props) {
  const [focused, setFocused] = createSignal(false);
  return (() => {
    var _el$7 = _tmpl$4$3();
    addEventListener(_el$7, "keydown", props.onKeyDown, true);
    _el$7.addEventListener("blur", () => setFocused(false));
    _el$7.addEventListener("focus", (e) => {
      setFocused(true);
      centerScroll(e.currentTarget);
    });
    createRenderEffect((_p$) => {
      var _v$5 = Math.floor(props.gif.height / props.gif.width * 110) + "px", _v$6 = `url(${focused() ? props.gif.src : props.gif.preview.replace(/\.png$/, "")})`, _v$7 = {
        [gif]: true,
        focusable: true
      };
      _v$5 !== _p$.e && setStyleProperty(_el$7, "height", _p$.e = _v$5);
      _v$6 !== _p$.t && setStyleProperty(_el$7, "background-image", _p$.t = _v$6);
      _p$.a = classList(_el$7, _v$7, _p$.a);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$7;
  })();
}
function GifPicker(props) {
  const [result, setResult] = createSignal([]);
  const columns = createMemo(() => inColumns(result(), 2));
  onMount(() => {
    pauseKeypress();
    __CJS__export_default__.add(SN_ID, {
      selector: `.${picker} .${search$1} input, .${picker} .focusable`,
      restrict: "self-only"
    });
    __CJS__export_default__.focus(SN_ID);
  });
  let isShowingTrending = false;
  onCleanup(() => {
    __CJS__export_default__.remove(SN_ID);
    resumeKeypress();
  });
  return (() => {
    var _el$8 = _tmpl$6$2(), _el$9 = _el$8.firstChild;
    className(_el$8, picker);
    className(_el$9, main);
    insert(_el$9, createComponent(Search, {
      get onClose() {
        return props.onClose;
      },
      setResult: (e) => {
        isShowingTrending = false;
        setResult(e);
      }
    }), null);
    insert(_el$9, createComponent(Show, {
      get when() {
        return result().length;
      },
      get fallback() {
        return createComponent(Trending, {
          showTrending: () => {
            if (isShowingTrending) return;
            isShowingTrending = true;
            clearSearch();
            getTrendingMemo().then(setResult);
          },
          get onClose() {
            return props.onClose;
          }
        });
      },
      get children() {
        var _el$0 = _tmpl$5$3();
        className(_el$0, content);
        insert(_el$0, createComponent(For, {
          get each() {
            return columns();
          },
          children: (column$1) => createComponent(Show, {
            get when() {
              return column$1.length;
            },
            get children() {
              var _el$1 = _tmpl$5$3();
              className(_el$1, column);
              insert(_el$1, createComponent(For, {
                each: column$1,
                children: (gif2) => createComponent(GifItem, {
                  gif: gif2,
                  onKeyDown: (e) => {
                    if (e.key == "Enter") {
                      props.onSelect(gif2.url);
                    }
                    if (e.key == "Backspace") {
                      if (isShowingTrending) {
                        isShowingTrending = false;
                        setResult([]);
                        clearSearch();
                      } else {
                        props.onClose();
                      }
                    }
                  }
                })
              }));
              return _el$1;
            }
          })
        }));
        return _el$0;
      }
    }), null);
    return _el$8;
  })();
}
delegateEvents(["input", "keydown"]);
var _tmpl$$8 = /* @__PURE__ */ template(`<svg height=18 width=18 xmlns=http://www.w3.org/2000/svg><g fill=none fill-rule=evenodd><path d="m0 14.25v3.75h3.75l11.06-11.06-3.75-3.75zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75z"fill=#99aab5></path><path d="m0 0h18v18h-18">`), _tmpl$2$4 = /* @__PURE__ */ template(`<small>`);
function IconChangeDMMessage(props) {
  return createComponent(ActionMessage, {
    get $() {
      return props.$.author;
    },
    icon: () => _tmpl$$8(),
    after: () => [" ", "changed the group icon. ", (() => {
      var _el$2 = _tmpl$2$4();
      className(_el$2, date);
      insert(_el$2, () => timeStamp(props.$.$.timestamp));
      return _el$2;
    })()]
  });
}
var _tmpl$$7 = /* @__PURE__ */ template(`<svg width=18 height=18 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z"clip-rule=evenodd class>`), _tmpl$2$3 = /* @__PURE__ */ template(`<div><img>`), _tmpl$3$2 = /* @__PURE__ */ template(`<div><div>`), _tmpl$4$2 = /* @__PURE__ */ template(`<div>`), _tmpl$5$2 = /* @__PURE__ */ template(`<span>`), _tmpl$6$1 = /* @__PURE__ */ template(`<div>Editing Message`), _tmpl$7$1 = /* @__PURE__ */ template(`<div>Replying to `), _tmpl$8$1 = /* @__PURE__ */ template(`<div>Message `), _tmpl$9$1 = /* @__PURE__ */ template(`<div><div><textarea></textarea><div></div></div><div></div><div><div><svg fill=currentColor xmlns=http://www.w3.org/2000/svg height=20 viewBox="0 -960 960 960"width=20><path d="M774.913-435.13 193.565-201.826q-24.783 10.392-45.935-4.347-21.153-14.74-21.153-40.523v-466.608q0-25.783 21.153-40.523 21.152-14.739 45.935-4.347L774.913-524.87q30.348 12.391 30.348 44.87t-30.348 44.87ZM216-307.479 649.086-480 216-652.521v92.042L440.479-480 216-399.521v92.042Zm0 0v-345.042V-307.479Z"></path></svg></div><div><svg xmlns=http://www.w3.org/2000/svg fill=currentColor height=20 viewBox="0 -960 960 960"width=20><path d="m312.523-430.999 75.956 75.955q14.956 14.957 14.956 34.544 0 19.587-14.956 34.544-14.957 14.957-34.544 14.957-19.587 0-34.544-14.957L159.601-445.18q-6.906-6.907-10.819-16.033-3.913-9.126-3.913-18.587t3.913-18.587q3.913-9.126 10.609-16.222l160-159.435q14.957-14.957 34.544-14.957 19.587 0 34.544 14.957 14.956 14.957 14.956 34.544 0 19.587-14.956 34.544l-75.956 75.955h424.694V-588q0-20.387 14.246-34.694 14.246-14.307 34.544-14.307 20.298 0 34.755 14.307 14.456 14.307 14.456 34.694v58.999q0 41.005-28.498 69.503-28.498 28.499-69.503 28.499H312.523Z"></path></svg></div><div>`), _tmpl$0$1 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=18 height=18 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M21.7 7.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L18.58 9H13a7 7 0 0 0-7 7v4a1 1 0 1 1-2 0v-4a9 9 0 0 1 9-9h5.59l-3.3-3.3a1 1 0 0 1 1.42-1.4l5 5Z"class>`), _tmpl$1 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=18 height=18 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M13.82 21.7c.17.05.14.3-.04.3H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h7.5c.28 0 .5.22.5.5V5a5 5 0 0 0 5 5h2.5c.28 0 .5.22.5.5v2.3a.4.4 0 0 1-.68.27l-.2-.2a3 3 0 0 0-4.24 0l-4 4a3 3 0 0 0 0 4.25c.3.3.6.46.94.58Z"class></path><path fill=currentColor d="M21.66 8c.03 0 .05-.03.04-.06a3 3 0 0 0-.58-.82l-4.24-4.24a3 3 0 0 0-.82-.58.04.04 0 0 0-.06.04V5a3 3 0 0 0 3 3h2.66ZM18.3 14.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L20 17.42V23a1 1 0 1 1-2 0v-5.59l-2.3 2.3a1 1 0 0 1-1.4-1.42l4-4Z"class>`), _tmpl$10 = /* @__PURE__ */ template(`<svg width=18 height=18 viewBox="0 0 24 24"><path fill-rule=evenodd clip-rule=evenodd d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333 13 11V5C13 4.66667 12.8 4 12 4Z"fill=currentColor></path><path fill-rule=evenodd clip-rule=evenodd d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z"fill=currentColor>`), _tmpl$11 = /* @__PURE__ */ template(`<div><div>This channel is read only.`), _tmpl$12 = /* @__PURE__ */ template(`<div tabindex=-1 style=position:fixed;bottom:0;width:100vw;height:1px>`), _tmpl$13 = /* @__PURE__ */ template(`<em>Message has not loaded.`), _tmpl$14 = /* @__PURE__ */ template(`<div><span>`), _tmpl$15 = /* @__PURE__ */ template(`<div><div><span></span>used <a>/`), _tmpl$16 = /* @__PURE__ */ template(`<div><div></div><div> <span>`), _tmpl$17 = /* @__PURE__ */ template(`<em>Original message was deleted`), _tmpl$18 = /* @__PURE__ */ template(`<img style=display:inline;opacity:0;position:absolute>`), _tmpl$19 = /* @__PURE__ */ template(`<span>loading...`), _tmpl$20 = /* @__PURE__ */ template(`<span>@`), _tmpl$21 = /* @__PURE__ */ template(`<div style=display:inline;border-radius:3px>`), _tmpl$22 = /* @__PURE__ */ template(`<span>#deleted-channel`), _tmpl$23 = /* @__PURE__ */ template(`<span><span></span>No Access`), _tmpl$24 = /* @__PURE__ */ template(`<pre><code>`), _tmpl$25 = /* @__PURE__ */ template(`<div tabindex=-1>`), _tmpl$26 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=18 height=18 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z"class>`), _tmpl$27 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=18 height=18 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M14.25 1c.41 0 .75.34.75.75V3h5.25c.41 0 .75.34.75.75v.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 4.25v-.5c0-.41.34-.75.75-.75H9V1.75c0-.41.34-.75.75-.75h4.5Z"class></path><path fill=currentColor fill-rule=evenodd d="M5.06 7a1 1 0 0 0-1 1.06l.76 12.13a3 3 0 0 0 3 2.81h8.36a3 3 0 0 0 3-2.81l.75-12.13a1 1 0 0 0-1-1.06H5.07ZM11 12a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Zm3-1a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z"clip-rule=evenodd class>`), _tmpl$28 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=18 height=18 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M16.44 6.96c.29 0 .51.25.47.54l-.82 6.34c-.02.08-.03.2-.03.34 0 .71.28 1.07.85 1.07.49 0 .94-.21 1.36-.63.43-.42.77-1 1.02-1.72.26-.75.38-1.57.38-2.48 0-1.35-.29-2.54-.87-3.56a5.92 5.92 0 0 0-2.45-2.35 7.68 7.68 0 0 0-3.61-.83c-1.55 0-2.96.37-4.22 1.1a7.66 7.66 0 0 0-2.96 3.07 9.53 9.53 0 0 0-1.09 4.66c0 1.45.26 2.77.78 3.95a6.3 6.3 0 0 0 2.47 2.81 8.3 8.3 0 0 0 4.36 1.05 12.43 12.43 0 0 0 5.35-1.18.5.5 0 0 1 .7.24l.46 1.07c.1.22.02.47-.19.59-.77.43-1.69.77-2.75 1.02-1.23.3-2.48.44-3.76.44-2.18 0-4-.44-5.48-1.33a8.1 8.1 0 0 1-3.27-3.57 11.93 11.93 0 0 1-1.07-5.12c0-2.24.47-4.19 1.4-5.84a9.7 9.7 0 0 1 3.86-3.8c1.62-.9 3.4-1.34 5.36-1.34 1.8 0 3.4.37 4.8 1.12 1.4.72 2.5 1.76 3.28 3.1a8.86 8.86 0 0 1 1.16 4.56c0 1.36-.23 2.57-.7 3.64a5.81 5.81 0 0 1-1.92 2.47c-.82.58-1.76.87-2.81.87a2.4 2.4 0 0 1-1.6-.5c-.4-.35-.65-.78-.73-1.32-.3.55-.74 1-1.36 1.34a4.3 4.3 0 0 1-2.03.48A3.4 3.4 0 0 1 8 16C7.33 15.16 7 14 7 12.5c0-1.14.2-2.16.6-3.05.43-.89 1-1.57 1.73-2.06a4.3 4.3 0 0 1 4.27-.31c.47.29.82.68 1.07 1.16l.3-.95c.06-.2.25-.33.46-.33h1.02Zm-5.06 8.24c.8 0 1.45-.35 1.97-1.04.51-.7.77-1.6.77-2.7 0-.88-.18-1.56-.53-2.03a1.76 1.76 0 0 0-1.5-.73c-.8 0-1.45.35-1.97 1.04a4.28 4.28 0 0 0-.78 2.67c0 .9.17 1.58.51 2.06.36.49.87.73 1.53.73Z"class>`), _tmpl$29 = /* @__PURE__ */ template(`<div style=height:80vh>`), _tmpl$30 = /* @__PURE__ */ template(`<div><svg xmlns=http://www.w3.org/2000/svg width=13 height=13 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M21.7 7.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L18.58 9H13a7 7 0 0 0-7 7v4a1 1 0 1 1-2 0v-4a9 9 0 0 1 9-9h5.59l-3.3-3.3a1 1 0 0 1 1.42-1.4l5 5Z"class></path></svg>Forwarded`), _tmpl$31 = /* @__PURE__ */ template(`<span>(edited)`);
const EmojiIcon = () => _tmpl$$7();
const EmojiPicker = lazy(() => __vitePreload(() => import("./EmojiPicker-D-2hHhU7.js"), true ? [] : void 0));
function toCodePoint(unicodeSurrogates, sep) {
  var r = [], c = 0, p = 0, i = 0;
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
      p = 0;
    } else if (55296 <= c && c <= 56319) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join("-");
}
const [messageBoxHeight, setMessageBoxHeight] = createSignal(34);
const [messageBoxFocusable, setMessageBoxFocusable] = createSignal(true);
const [messageBoxFocused, setMessageBoxFocused] = createSignal(false);
const [readonlyChannel, setReadonlyChannel] = createSignal(false);
const [isLoadingMoreMessages, setIsLoadingMoreMessages] = createSignal(false);
let shouldScrollToBottom = (_addHeight) => false;
let scrollToBottom = (_smooth) => {
};
const [lastFocused, setLastFocused] = createSignal("message-box");
const [attachments, setAttachments] = createSignal([]);
const [currentEditingMessage, setCurrentEditingMessage] = createSignal(null);
const [currentReplyingMessage, setCurrentReplyingMessage] = createSignal(null);
function timeDiff(d2, d1) {
  const dt2 = new Date(d2);
  const dt1 = new Date(d1);
  var diff = (dt2.getTime() - dt1.getTime()) / 1e3;
  diff /= 60;
  return Math.abs(Math.round(diff)) > 0;
}
function timeStamp(date2) {
  const day = dayjs(date2), midnight = dayjs(dayjs(date2).format("YYYY-MM-DD")), today = dayjs(dayjs().format("YYYY-MM-DD"));
  const dayDiff = today.diff(midnight, "day");
  const americans = day.toDate().toLocaleTimeString(navigator.language, {
    minute: "numeric",
    hour: "numeric"
  });
  if (dayDiff == 0) {
    return "Today at " + americans;
  } else if (Math.abs(dayDiff) == 1) {
    return "Yesterday at " + americans;
  }
  const americans2 = day.toDate().toLocaleDateString(navigator.language);
  return americans2 + " " + americans;
}
function decideDateSeparator(...args) {
  if (args.filter((a) => Boolean(a)).length < 2) return true;
  const dates = args.map((a) => dayjs(dayjs(a).format("YYYY-MM-DD")));
  const first = dates.shift();
  return Boolean(dates.find((a) => first.diff(a, "day") != 0));
}
function decideMessageSeparator(message, before, channel2) {
  const last_message = before;
  if (!last_message) return true;
  return Boolean(decideDateSeparator(message.$.timestamp, last_message.$.timestamp) || timeDiff(last_message.$.timestamp, message.$.timestamp) || last_message.$.type != message.$.type || last_message.author.id != message.author.id || message.$.referenced_message || message.$.interaction);
}
function replyToMessage(message) {
  if (!message.isRepliable()) return;
  batch(() => {
    setCurrentReplyingMessage(message);
    setCurrentEditingMessage(null);
  });
  sleep(10).then(() => {
    __CJS__export_default__.focus("message-box");
  });
}
function editMessage(message) {
  if (!message.isEditable()) return;
  batch(() => {
    setCurrentEditingMessage(message);
    if (textarea) {
      textarea.value = message.value.content;
      textarea.dispatchEvent(new Event("input", {
        bubbles: true
      }));
    }
    setCurrentReplyingMessage(null);
  });
  sleep(10).then(() => {
    __CJS__export_default__.focus("message-box");
  });
}
async function jumpToBottom() {
  scrollToBottom(true);
  await sleep(300);
  chatbox?.lastChild?.focus();
  await tick();
  if (!untrack(readonlyChannel)) __CJS__export_default__.focus("message-box");
}
function mentionUserFromMessage(message) {
  if (!textarea) return;
  __CJS__export_default__.focus("message-box");
  typeInTextarea("@" + message.author.$.username + " ", textarea);
}
function ReactionButton(props) {
  const me$1 = useStore(props.$, "me");
  const emoji2 = useStore(props.$, "emoji");
  const count2 = useStore(props.$, "count");
  return createComponent(FocusableLink, {
    onNavigate: () => {
      props.$.toggle();
    },
    get react() {
      return (() => {
        var _el$2 = _tmpl$3$2(), _el$5 = _el$2.firstChild;
        insert(_el$2, createComponent(Show, {
          get when() {
            return emoji2().id;
          },
          get fallback() {
            return (() => {
              var _el$6 = _tmpl$4$2();
              insert(_el$6, () => emoji2().name);
              return _el$6;
            })();
          },
          get children() {
            var _el$3 = _tmpl$2$3(), _el$4 = _el$3.firstChild;
            className(_el$3, non_uni$1);
            createRenderEffect((_p$) => {
              var _v$ = `https://cdn.discordapp.com/emojis/${emoji2().id}.${emoji2().animated ? "gif" : "png"}?size=16`, _v$2 = emoji2().name;
              _v$ !== _p$.e && setAttribute(_el$4, "src", _p$.e = _v$);
              _v$2 !== _p$.t && setAttribute(_el$4, "alt", _p$.t = _v$2);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$3;
          }
        }), _el$5);
        className(_el$5, num$1);
        insert(_el$5, count2);
        createRenderEffect((_$p) => classList(_el$2, {
          [reactionButton$1]: true,
          [me]: me$1()
        }, _$p));
        return _el$2;
      })();
    }
  });
}
function MessageReactions(props) {
  return (() => {
    var _el$7 = _tmpl$4$2();
    className(_el$7, reactions$1);
    insert(_el$7, createComponent(For, {
      get each() {
        return props.$;
      },
      children: (a) => createComponent(ReactionButton, {
        $: a
      })
    }));
    return _el$7;
  })();
}
function ChannelTypingIndicatorWithChannel(props) {
  const user_id = () => props.channel.$client.config.user_id;
  const typingStateRaw = useStore(() => props.channel.typingState);
  const typingState = () => typingStateRaw().filter((a) => a?.id != user_id());
  return createComponent(Show, {
    get when() {
      return typingState().length;
    },
    get children() {
      var _el$8 = _tmpl$4$2();
      className(_el$8, typing);
      insert(_el$8, createComponent(Show, {
        get when() {
          return typingState().length < 5;
        },
        fallback: "Several people are typing...",
        get children() {
          return [createComponent(For, {
            get each() {
              return typingState();
            },
            children: (a, i) => [(() => {
              var _el$9 = _tmpl$5$2();
              className(_el$9, user$4);
              insert(_el$9, createComponent(UserLabel, {
                $: a,
                nickname: true,
                get guild() {
                  return currentDiscordGuild();
                }
              }));
              return _el$9;
            })(), createComponent(Show, {
              get when() {
                return i() < typingState().length - 2;
              },
              get fallback() {
                return createComponent(Show, {
                  get when() {
                    return memo(() => typingState().length > 1)() && i() == typingState().length - 2;
                  },
                  children: " and "
                });
              },
              children: ", "
            })]
          }), " ", memo(() => typingState().length > 1 ? "are" : "is"), " typing"];
        }
      }));
      return _el$8;
    }
  });
}
function ChannelTypingIndicator() {
  return createComponent(Show, {
    get when() {
      return currentDiscordChannel();
    },
    get children() {
      return createComponent(ChannelTypingIndicatorWithChannel, {
        get channel() {
          return currentDiscordChannel();
        }
      });
    }
  });
}
function MessageBoxInteraction() {
  const _replying = currentReplyingMessage;
  const _editing = currentEditingMessage;
  const interacting = () => {
    const _r2 = _replying();
    const _e = _editing();
    return _r2 || _e;
  };
  const guild = currentDiscordGuild;
  const channel2 = currentDiscordChannel;
  createEffect(() => {
    const _channel = channel2(), _interacting = interacting();
    if (!_interacting) return;
    if (_interacting.$channel != _channel) {
      batch(() => {
        setCurrentReplyingMessage(null);
        setCurrentEditingMessage(null);
      });
    }
  });
  const isEditing = () => _editing() == interacting();
  return createComponent(Show, {
    get when() {
      return interacting();
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return isEditing();
        },
        get fallback() {
          return (() => {
            var _el$1 = _tmpl$7$1();
            _el$1.firstChild;
            className(_el$1, interaction);
            insert(_el$1, () => createComponent(UserLabel, {
              color: true,
              nickname: true,
              get guild() {
                return guild();
              },
              get $() {
                return interacting().author;
              }
            }), null);
            return _el$1;
          })();
        },
        get children() {
          var _el$0 = _tmpl$6$1();
          className(_el$0, interaction);
          return _el$0;
        }
      });
    }
  });
}
function MessageBoxHeader() {
  return (() => {
    var _el$11 = _tmpl$4$2();
    className(_el$11, header$1);
    insert(_el$11, createComponent(ChannelTypingIndicator, {}), null);
    insert(_el$11, createComponent(MessageBoxInteraction, {}), null);
    return _el$11;
  })();
}
function PlaceholderRecipients(props) {
  const recipients = useStore(() => props.channel.recipients);
  return [memo(() => recipients().length <= 2 ? "@" : ""), memo(() => memo(() => recipients().length == 1)() ? createComponent(UserLabel, {
    nickname: true,
    get $() {
      return recipients()[0];
    }
  }) : createComponent(For, {
    get each() {
      return recipients().filter((a) => a != props.currentUser);
    },
    children: (a, i) => [memo(() => i() > 0 && ", "), createComponent(UserLabel, {
      nickname: true,
      $: a
    })]
  }))];
}
function PlaceholderName() {
  const channel2 = () => currentDiscordChannel();
  const client = () => channel2().$client;
  const currentUser = () => client().users.get(client().ready.user.id);
  const channelValue = useStore(() => channel2());
  return createComponent(Switch, {
    get children() {
      return [createComponent(Match, {
        get when() {
          return memo(() => "name" in channelValue())() && channelValue().name;
        },
        get children() {
          return [memo(() => "recipients" in channel2() ? "" : "#"), memo(() => channelValue().name)];
        }
      }), createComponent(Match, {
        get when() {
          return "recipients" in channel2();
        },
        get children() {
          return createComponent(PlaceholderRecipients, {
            get channel() {
              return channel2();
            },
            get currentUser() {
              return currentUser();
            }
          });
        }
      })];
    }
  });
}
let textarea = null;
function sendMessage(content2, opts, attachments2) {
  const channel2 = currentDiscordChannel();
  if (!channel2) return;
  const res = channel2.sendMessage(content2, opts, attachments2);
  if ("response" in res) {
    res.response().catch(() => {
      alert("message was not sent!!");
    });
  }
}
function MessageBoxWithChannel(props) {
  const currentChannel = () => props.$;
  let hiddenDiv;
  let messageTextAreaRef;
  const [value, setValue] = createSignal("");
  createEffect(() => {
    value();
    if (!hiddenDiv) return;
    const height = hiddenDiv.offsetHeight;
    setMessageBoxHeight(height);
  });
  onMount(() => {
    textarea = messageTextAreaRef;
  });
  onCleanup(() => {
    textarea = null;
  });
  createEffect(() => {
    setMessageBoxFocusable(currentView() == Views.MESSAGES);
  });
  const disabled = () => !messageBoxFocusable();
  function canUseKeyboard() {
    if (untrack(isKeypressPaused)) return false;
    if (!messageTextAreaRef) return true;
    if (messageTextAreaRef !== document.activeElement || messageTextAreaRef.value == "" || messageTextAreaRef.selectionStart == 0) return true;
    return false;
  }
  createEffect(() => {
    const isDisabled = disabled();
    if (isDisabled && document.activeElement == messageTextAreaRef) {
      messageTextAreaRef.blur();
    }
  });
  return (() => {
    var _el$12 = _tmpl$9$1(), _el$13 = _el$12.firstChild, _el$14 = _el$13.firstChild, _el$15 = _el$14.nextSibling, _el$18 = _el$13.nextSibling, _el$19 = _el$18.nextSibling, _el$20 = _el$19.firstChild;
    className(_el$12, MessageBox$1);
    insert(_el$12, createComponent(MessageBoxHeader, {}), _el$13);
    className(_el$13, texbox_wrap);
    _el$14.$$keydown = async (e) => {
      if (e.currentTarget !== e.target) return;
      if (e.key.includes("Arrow")) {
        if (e.key == "ArrowUp" && canUseKeyboard()) return;
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
      if (untrack(isKeypressPaused)) return;
      const editing = untrack(currentEditingMessage);
      const replying = untrack(currentReplyingMessage);
      const forwarding = untrack(currentForwardingMessage);
      const interacting = editing || replying;
      const _attachments = attachments();
      const softLeftOccupied = untrack(value) || !editing && _attachments.length;
      if (e.key == "SoftLeft" && softLeftOccupied) {
        console.log("bitch");
        if (replying) {
          setCurrentReplyingMessage(null);
        }
        const _content = untrack(value).replace(/@([a-z0-9_\.]{2,32})(\s|$)/g, (a, found_username) => {
          if (a.includes("..")) return a;
          let foundUser = null;
          currentChannel()?.messages.state.value?.find((a2) => {
            return a2.author.value.username == found_username && (foundUser = a2.author);
          });
          if (foundUser) {
            return a.replace("@" + found_username, `<@${foundUser.id}>`);
          }
          return a;
        });
        if (editing) {
          editing.edit(_content);
          setCurrentEditingMessage(null);
        } else {
          sendMessage(_content, {
            message_reference: replying ? {
              message_id: replying.id,
              channel_id: replying.$channel.id
            } : void 0
          }, _attachments);
          if (_attachments.length) setAttachments([]);
        }
        setValue("");
        e.target.value = "";
      }
      if (["ArrowLeft", "Backspace"].includes(e.key) && canUseKeyboard() || e.key == "SoftLeft" && !softLeftOccupied && canUseKeyboard()) {
        setCurrentView(Views.CHANNELS);
        await sleep(0);
        __CJS__export_default__.focus("channels");
      }
      if (e.key == "SoftRight") {
        const actEl = e.currentTarget;
        actEl?.blur();
        const close = toolshed(() => createComponent(OptionsMenu, {
          get items() {
            return [interacting && {
              id: "interaction",
              text: "Cancel " + (editing ? "Editing" : "Replying")
            }, forwarding && {
              id: "forward",
              text: "Forward Here",
              icon: () => _tmpl$0$1()
            }, !editing && {
              id: "upload",
              text: "Upload a File",
              icon: () => _tmpl$1()
            }, !editing ? untrack(attachments).length ? {
              id: "delete-uploads",
              text: `Delete ${untrack(attachments).length} attachments`
            } : {
              id: "voice-message",
              text: "Send a voice message",
              icon: () => _tmpl$10()
            } : null, {
              id: "emoji",
              text: "Emoji",
              icon: () => createComponent(EmojiIcon, {})
            }, {
              id: "gif",
              text: "GIF",
              icon: () => createComponent(GifIcon, {})
            }, {
              id: "settings",
              text: "Settings",
              icon: () => createComponent(SettingsIcon, {})
            }];
          },
          onSelect: async (a) => {
            await close?.();
            if (a === null) {
              actEl.focus();
              return;
            }
            switch (a) {
              case "forward": {
                sendMessage("", {
                  message_reference: {
                    type: 1,
                    ...forwarding
                  }
                }, []);
                setCurrentForwardMessage(null);
                break;
              }
              case "voice-message": {
                let voice_message = null;
                const close2 = toolshed(() => createComponent(VoiceRecorderWeb, {
                  setAudioBlob: (blob, waveform, duration) => {
                    voice_message = {
                      blob,
                      waveform,
                      duration_secs: duration
                    };
                  },
                  onSend: async () => {
                    if (!voice_message) {
                      toast("voice message is still being processed.");
                      return;
                    }
                    await close2?.();
                    actEl.focus();
                    if (replying) {
                      setCurrentReplyingMessage(null);
                    }
                    sendMessage("", {
                      flags: 8192,
                      channel_id: currentChannel().id,
                      sticker_ids: [],
                      type: 0,
                      message_reference: replying ? {
                        message_id: replying.id,
                        channel_id: replying.$channel.id
                      } : void 0
                    }, [{
                      filename: "voice-message.ogg",
                      ...voice_message
                    }]);
                  },
                  onCancel: async () => {
                    await close2?.();
                    actEl.focus();
                  }
                }));
                return;
              }
              case "delete-uploads":
                setAttachments([]);
                break;
              case "upload":
                filePicker().then((blob) => {
                  const origFileName = blob.name;
                  const filename = origFileName.endsWith(".3gp") ? origFileName.slice(0, -3) + "mp4" : origFileName;
                  setAttachments((a2) => [...a2, {
                    filename,
                    blob
                  }]);
                });
                break;
              case "settings": {
                sleep(500).then(() => {
                  const close2 = fullscreen(() => createComponent(Settings, {
                    onClose: async () => {
                      await close2?.();
                      actEl.focus();
                    }
                  }));
                });
                return;
              }
              case "interaction":
                batch(() => {
                  setCurrentReplyingMessage(null);
                  setCurrentEditingMessage(null);
                });
                break;
              case "emoji": {
                await EmojiPicker.preload();
                const close2 = toolshed(() => createComponent(EmojiPicker, {
                  get guild() {
                    return untrack(currentDiscordGuild);
                  },
                  onSelect: async (emoji2, variation) => {
                    await close2?.();
                    actEl.focus();
                    if ("guild" in emoji2) {
                      typeInTextarea(`<${emoji2.animated ? "a" : ""}:${emoji2.name}:${emoji2.$}>`);
                      return;
                    }
                    typeInTextarea(variation || emoji2.$, actEl);
                  },
                  onClose: async () => {
                    await close2?.();
                    actEl.focus();
                  }
                }));
                return;
              }
              case "gif": {
                const close2 = toolshed(() => createComponent(GifPicker, {
                  onSelect: async (url2) => {
                    await close2?.();
                    actEl.focus();
                    sendMessage(url2);
                  },
                  onClose: async () => {
                    await close2?.();
                    actEl.focus();
                  }
                }));
                return;
              }
            }
            actEl.focus();
            console.log("option selected", a);
          }
        }));
        if (!close) {
          actEl.focus();
        }
      }
    };
    addEventListener(_el$14, "sn-unfocused", async (e) => {
      if (e.currentTarget !== e.target) return;
      console.log("SNUNFOCUSED", e.detail.native);
      const native = e.detail.native;
      if (native) return;
      setMessageBoxFocused(false);
    });
    _el$14.addEventListener("focus", (e) => {
      if (e.currentTarget !== e.target) return;
      chatbox?.scrollBy({
        top: 22,
        behavior: "smooth"
      });
      setMessageBoxFocused(true);
      setLastFocused("message-box");
    });
    _el$14.$$input = async (e) => {
      await sleep(0);
      setValue(e.target.value);
      untrack(currentChannel).typingState.debounce();
    };
    var _ref$ = messageTextAreaRef;
    typeof _ref$ === "function" ? use(_ref$, _el$14) : messageTextAreaRef = _el$14;
    var _ref$2 = hiddenDiv;
    typeof _ref$2 === "function" ? use(_ref$2, _el$15) : hiddenDiv = _el$15;
    className(_el$15, hidden$1);
    insert(_el$15, value);
    insert(_el$13, createComponent(Show, {
      get when() {
        return !value();
      },
      get children() {
        var _el$16 = _tmpl$8$1();
        _el$16.firstChild;
        className(_el$16, placeholder);
        insert(_el$16, createComponent(PlaceholderName, {}), null);
        return _el$16;
      }
    }), null);
    className(_el$18, grow);
    className(_el$19, bar$1);
    createRenderEffect((_p$) => {
      var _v$3 = messageBoxHeight() + "px", _v$4 = messageBoxHeight() + "px", _v$5 = disabled(), _v$6 = messageBoxFocused() ? "20px" : 0, _v$7 = value() || attachments().length ? void 0 : hide$1;
      _v$3 !== _p$.e && setStyleProperty(_el$13, "height", _p$.e = _v$3);
      _v$4 !== _p$.t && setStyleProperty(_el$14, "height", _p$.t = _v$4);
      _v$5 !== _p$.a && (_el$14.disabled = _p$.a = _v$5);
      _v$6 !== _p$.o && setStyleProperty(_el$18, "height", _p$.o = _v$6);
      _v$7 !== _p$.i && className(_el$20, _p$.i = _v$7);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$12;
  })();
}
function MessageBox() {
  return createComponent(Show, {
    get when() {
      return currentDiscordChannel();
    },
    get children() {
      return createComponent(MessageBoxWithChannel, {
        get $() {
          return currentDiscordChannel();
        }
      });
    }
  });
}
function ReadonlyMessageBox() {
  let noPermRef;
  onMount(() => {
    setMessageBoxHeight(32);
    setMessageBoxFocused(false);
  });
  return [(() => {
    var _el$24 = _tmpl$11(), _el$25 = _el$24.firstChild;
    className(_el$24, noPerm);
    insert(_el$24, createComponent(MessageBoxHeader, {}), _el$25);
    className(_el$25, text$3);
    return _el$24;
  })(), (() => {
    var _el$26 = _tmpl$12();
    _el$26.addEventListener("focus", (e) => {
      if (e.currentTarget !== e.target) return;
      setLastFocused("message-box");
    });
    var _ref$3 = noPermRef;
    typeof _ref$3 === "function" ? use(_ref$3, _el$26) : noPermRef = _el$26;
    createRenderEffect((_$p) => classList(_el$26, {
      focusable: true,
      [bar$1]: true,
      noperm: true
    }, _$p));
    return _el$26;
  })()];
}
function MessageBoxOrNoPerm(props) {
  const _sideEffect = useStore(() => props.$, "permission_overwrites");
  const canSendMessages = () => {
    _sideEffect();
    return props.$.roleAccess().SendMessages !== false;
  };
  createEffect(() => {
    setReadonlyChannel(!canSendMessages());
  });
  return createComponent(Show, {
    get when() {
      return canSendMessages();
    },
    get fallback() {
      return createComponent(ReadonlyMessageBox, {});
    },
    get children() {
      return createComponent(MessageBox, {});
    }
  });
}
function MessageBoxGuild(props) {
  return createComponent(Show, {
    get when() {
      return "guild" in props.$;
    },
    get fallback() {
      return createComponent(MessageBox, {});
    },
    get children() {
      return createComponent(MessageBoxOrNoPerm, {
        get $() {
          return props.$;
        }
      });
    }
  });
}
function MessageBoxNullCheck() {
  return createComponent(Show, {
    get when() {
      return currentDiscordChannel();
    },
    get children() {
      return createComponent(MessageBoxGuild, {
        get $() {
          return currentDiscordChannel();
        }
      });
    }
  });
}
function WaitingForReplyToLoad(props) {
  const message = useStore(() => props.waiting);
  return createComponent(Show, {
    get when() {
      return message();
    },
    get fallback() {
      return _tmpl$13();
    },
    get children() {
      return createComponent(ReplyDescriptionText, {
        get $() {
          return message();
        }
      });
    }
  });
}
function WaitForReplyToLoad(props) {
  const mJar = () => currentDiscordChannel()?.messages;
  const message_id = () => props.$.reference?.message_id || props.$.$.referenced_message?.id;
  const waiting = () => mJar()?.waitForMessage(message_id());
  return createComponent(Show, {
    get when() {
      return memo(() => !!mJar())() && message_id();
    },
    get fallback() {
      return _tmpl$13();
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return waiting();
        },
        get fallback() {
          return _tmpl$13();
        },
        get children() {
          return createComponent(WaitingForReplyToLoad, {
            get waiting() {
              return waiting();
            }
          });
        }
      });
    }
  });
}
function toHHMMSS(time2) {
  const sec_num = Math.ceil(time2);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;
  return (hours ? ("0" + hours).slice(-2) + ":" : "") + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
}
function ReplyDescriptionText(props) {
  const content2 = useStore(() => props.$, "content");
  const firstAttachement = () => props.$.attachments.value[0];
  return (() => {
    var _el$30 = _tmpl$14(), _el$31 = _el$30.firstChild;
    className(_el$30, text$3);
    className(_el$31, label);
    insert(_el$31, createComponent(UserLabel, {
      color: true,
      prefix: "@",
      get $() {
        return props.$.author;
      },
      nickname: true,
      get guild() {
        return currentDiscordGuild();
      }
    }));
    insert(_el$30, (() => {
      var _c$ = memo(() => !!firstAttachement()?.waveform);
      return () => _c$() ? "🎙️ " + toHHMMSS(firstAttachement().duration_secs) : "";
    })(), null);
    insert(_el$30, createComponent(Markdown, {
      get text() {
        return (content2() || "").slice(0, 150);
      },
      inline: true,
      renderer
    }), null);
    return _el$30;
  })();
}
function ReplyDescription(props) {
  const mJar = () => currentDiscordChannel()?.messages;
  const message_id = () => props.$.reference?.message_id || props.$.$.referenced_message?.id;
  const has = () => mJar().get(message_id());
  return createComponent(Show, {
    get when() {
      return mJar();
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return !message_id();
        },
        get fallback() {
          return createComponent(Show, {
            get when() {
              return has();
            },
            get fallback() {
              return createComponent(WaitForReplyToLoad, {
                get $() {
                  return props.$;
                }
              });
            },
            get children() {
              return createComponent(ReplyDescriptionText, {
                get $() {
                  return has();
                }
              });
            }
          });
        },
        children: "Something went wrong."
      });
    }
  });
}
function MessageSeparatorAvatar(props) {
  return createComponent(UserAvatar, {
    get $() {
      return props.$.author;
    },
    get guild() {
      return currentDiscordGuild() || void 0;
    },
    size: 24
  });
}
function MessageSeparator(props) {
  const referenced_message = () => props.$.$.referenced_message;
  const interaction2 = () => props.$.$.interaction;
  const user_interaction = () => {
    const _interaction = interaction2();
    const client = discordClientReady();
    if (client && _interaction?.user) {
      const user2 = _interaction.user;
      return client.addUser(user2);
    }
    return false;
  };
  return (() => {
    var _el$32 = _tmpl$16(), _el$40 = _el$32.firstChild, _el$41 = _el$40.nextSibling, _el$42 = _el$41.firstChild, _el$44 = _el$42.nextSibling;
    className(_el$32, Separator);
    insert(_el$32, createComponent(Show, {
      get when() {
        return memo(() => !!referenced_message())() && props.$.$.type === 19;
      },
      get children() {
        var _el$33 = _tmpl$4$2();
        className(_el$33, reply);
        insert(_el$33, createComponent(ReplyBadge, {
          "class": badge$1
        }), null);
        insert(_el$33, createComponent(Show, {
          get when() {
            return referenced_message() !== null;
          },
          get fallback() {
            return _tmpl$17();
          },
          get children() {
            return createComponent(ReplyDescription, {
              get $() {
                return props.$;
              }
            });
          }
        }), null);
        return _el$33;
      }
    }), _el$40);
    insert(_el$32, createComponent(Show, {
      get when() {
        return interaction2();
      },
      get children() {
        var _el$34 = _tmpl$15(), _el$35 = _el$34.firstChild, _el$36 = _el$35.firstChild, _el$37 = _el$36.nextSibling, _el$38 = _el$37.nextSibling;
        _el$38.firstChild;
        className(_el$34, reply);
        insert(_el$34, createComponent(ReplyBadge, {
          "class": badge$1
        }), _el$35);
        className(_el$35, text$3);
        className(_el$36, label);
        insert(_el$36, createComponent(Show, {
          get when() {
            return user_interaction();
          },
          children: (user_interaction2) => createComponent(UserLabel, {
            color: true,
            prefix: "@",
            get $() {
              return user_interaction2();
            },
            nickname: true,
            get guild() {
              return currentDiscordGuild();
            }
          })
        }));
        insert(_el$38, () => interaction2().name, null);
        return _el$34;
      }
    }), _el$40);
    className(_el$40, avatar_wrapper);
    insert(_el$40, createComponent(MessageSeparatorAvatar, {
      get $() {
        return props.$;
      }
    }));
    className(_el$41, name$1);
    insert(_el$41, createComponent(UserLabel, {
      color: true,
      nickname: true,
      get $() {
        return props.$.author;
      },
      get guild() {
        return currentDiscordGuild();
      }
    }), _el$42);
    insert(_el$41, createComponent(Show, {
      get when() {
        return props.$.author.$.bot;
      },
      get children() {
        var _el$43 = _tmpl$5$2();
        className(_el$43, bot);
        insert(_el$43, () => props.$.$.webhook_id ? "WEBHOOK" : "BOT");
        return _el$43;
      }
    }), _el$44);
    className(_el$44, date$1);
    insert(_el$44, () => timeStamp(props.$.$.timestamp));
    return _el$32;
  })();
}
const JDECKED = "https://jdecked.github.io/twemoji/v/latest/svg/";
function Twemoji(props) {
  const size2 = props.bigEmoji ? 32 : 14;
  const url2 = JDECKED + toCodePoint(props.children) + ".svg";
  const [useText, setText] = createSignal(false);
  const [didError, setError] = createSignal(false);
  return (() => {
    var _el$46 = _tmpl$5$2();
    className(_el$46, emoji$1);
    setStyleProperty(_el$46, "width", size2 + "px");
    setStyleProperty(_el$46, "height", size2 + "px");
    setStyleProperty(_el$46, "--emoji_url", `url(${url2})`);
    insert(_el$46, createComponent(Show, {
      get when() {
        return !didError();
      },
      get children() {
        var _el$47 = _tmpl$18();
        _el$47.addEventListener("load", () => {
          setText(false);
        });
        _el$47.addEventListener("error", () => {
          batch(() => {
            setText(true);
            setError(true);
          });
        });
        setAttribute(_el$47, "src", url2);
        return _el$47;
      }
    }), null);
    insert(_el$46, createComponent(Show, {
      get when() {
        return useText();
      },
      get children() {
        return props.children;
      }
    }), null);
    return _el$46;
  })();
}
function UserMention(props) {
  const guild = untrack(currentDiscordGuild);
  return createComponent(UserLabel, {
    prefix: "@",
    nickname: true,
    get $() {
      return props.$;
    },
    guild
  });
}
function UserMentionFromID(props) {
  const [user2, setUser] = createSignal(null);
  createEffect(() => {
    const client = untrack(discordClientReady);
    const user22 = client.users.get(props.id);
    if (user22) {
      setUser(user22);
      return;
    }
    const cb = (id, _user) => {
      if (id == props.id) {
        setUser(_user || null);
      }
    };
    client.users.on("update", cb);
    onCleanup(() => {
      client.users.off("update", cb);
    });
  });
  return createComponent(Show, {
    get when() {
      return user2();
    },
    get fallback() {
      return (() => {
        var _el$49 = _tmpl$19();
        className(_el$49, mention);
        return _el$49;
      })();
    },
    get children() {
      var _el$48 = _tmpl$5$2();
      className(_el$48, mention);
      insert(_el$48, createComponent(UserMention, {
        get $() {
          return user2();
        }
      }));
      return _el$48;
    }
  });
}
function EveryoneHere(props) {
  return (() => {
    var _el$50 = _tmpl$20();
    _el$50.firstChild;
    className(_el$50, mention);
    insert(_el$50, () => props.node.type, null);
    return _el$50;
  })();
}
const ChannelMentionIcon = () => (() => {
  var _el$52 = _tmpl$5$2();
  className(_el$52, channelMentionIcon);
  insert(_el$52, createComponent(TextIcon, {}));
  return _el$52;
})();
const MessageLinkSuffix = () => [createComponent(ChevronSmallRightIcon, {
  "class": chevron
}), (() => {
  var _el$53 = _tmpl$5$2();
  className(_el$53, channelMentionIcon);
  insert(_el$53, createComponent(ChatIcon, {}));
  return _el$53;
})()];
function ChannelMentionRecipients(props) {
  const recipients = useStore(() => props.$.recipients);
  return (() => {
    var _el$54 = _tmpl$5$2();
    className(_el$54, mention);
    insert(_el$54, createComponent(ChannelMentionIcon, {}), null);
    insert(_el$54, createComponent(For, {
      get each() {
        return recipients();
      },
      children: (a, i) => {
        return [memo(() => i() > 0 && ", "), createComponent(UserLabel, {
          nickname: true,
          $: a
        })];
      }
    }), null);
    insert(_el$54, () => props.children, null);
    return _el$54;
  })();
}
function ChannelMention(props) {
  const name2 = useStore(() => props.$, "name");
  return createComponent(Show, {
    get when() {
      return name2();
    },
    get fallback() {
      return createComponent(Show, {
        get when() {
          return "recipients" in props.$;
        },
        get children() {
          return createComponent(ChannelMentionRecipients, {
            get $() {
              return props.$;
            },
            get children() {
              return props.children;
            }
          });
        }
      });
    },
    get children() {
      var _el$55 = _tmpl$5$2();
      className(_el$55, mention);
      insert(_el$55, createComponent(ChannelMentionIcon, {}), null);
      insert(_el$55, name2, null);
      insert(_el$55, () => props.children, null);
      return _el$55;
    }
  });
}
const LoadingMention = () => (() => {
  var _el$56 = _tmpl$19();
  className(_el$56, mention);
  return _el$56;
})();
function RoleMentionFromIDGuild(props) {
  const roles = useStore(() => props.guild, "roles");
  const role2 = () => roles().find((a) => a.id == props.id);
  const rgb = () => decimal2rgb(role2().color, true);
  return createComponent(Show, {
    get when() {
      return role2();
    },
    get fallback() {
      return createComponent(LoadingMention, {});
    },
    get children() {
      var _el$57 = _tmpl$20();
      _el$57.firstChild;
      className(_el$57, mention);
      insert(_el$57, () => role2().name, null);
      createRenderEffect((_p$) => {
        var _v$8 = `rgb(${rgb()})`, _v$9 = `rgba(${rgb()},0.2)`;
        _v$8 !== _p$.e && setStyleProperty(_el$57, "color", _p$.e = _v$8);
        _v$9 !== _p$.t && setStyleProperty(_el$57, "background-color", _p$.t = _v$9);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$57;
    }
  });
}
function RoleMentionFromID(props) {
  return createComponent(Show, {
    get when() {
      return currentDiscordGuild();
    },
    get fallback() {
      return createComponent(LoadingMention, {});
    },
    get children() {
      return createComponent(RoleMentionFromIDGuild, {
        get id() {
          return props.id;
        },
        get guild() {
          return currentDiscordGuild();
        }
      });
    }
  });
}
function SpoilerInline(props) {
  const [show, setShow] = createSignal(false);
  const color = () => {
    const _show = show();
    const theme = themeStyle();
    return _show ? void 0 : theme ? "#c4c9ce" : "#1e1f22";
  };
  const bg = () => {
    const _show = show();
    const theme = themeStyle();
    return _show ? `rgba(${(theme ? "0," : "255,").repeat(3)} 0.1)` : theme ? "#c4c9ce" : "#1e1f22";
  };
  return (() => {
    var _el$59 = _tmpl$21();
    insert(_el$59, createComponent(FocusableLink, {
      onNavigate: () => setShow((e) => !e),
      get react() {
        return props.children;
      }
    }));
    createRenderEffect((_p$) => {
      var _v$0 = bg(), _v$1 = color(), _v$10 = {
        [spoiler_hidden]: !show()
      };
      _v$0 !== _p$.e && setStyleProperty(_el$59, "background-color", _p$.e = _v$0);
      _v$1 !== _p$.t && setStyleProperty(_el$59, "color", _p$.t = _v$1);
      _p$.a = classList(_el$59, _v$10, _p$.a);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$59;
  })();
}
const DeletedChannel_ = () => (() => {
  var _el$60 = _tmpl$22();
  className(_el$60, mention);
  return _el$60;
})();
const renderer = {
  user: (props) => {
    return createComponent(UserMentionFromID, {
      get id() {
        return props.node.id;
      }
    });
  },
  everyone: EveryoneHere,
  here: EveryoneHere,
  twemoji: (props) => {
    return createComponent(Twemoji, {
      get bigEmoji() {
        return Boolean(props.ref.bigEmoji);
      },
      get children() {
        return props.node.name;
      }
    });
  },
  subtext: (props) => {
    console.log("subtext", props);
    return (() => {
      var _el$61 = _tmpl$4$2();
      className(_el$61, subtext);
      insert(_el$61, createComponent(Dynamic, {
        get component() {
          return props.child;
        }
      }));
      return _el$61;
    })();
  },
  emoji: (props) => {
    return (() => {
      var _el$62 = _tmpl$5$2();
      className(_el$62, emoji$1);
      createRenderEffect((_$p) => setStyleProperty(_el$62, "--emoji_url", `url(https://cdn.discordapp.com/emojis/${props.node.id}.${props.node.animated ? "gif" : "png"}?size=${props.bigEmoji ? 32 : 16})`));
      return _el$62;
    })();
  },
  // "url", "autolink", "link"
  url: (props) => {
    const url2 = () => new URL(props.node.target);
    return createComponent(Show, {
      get when() {
        return memo(() => !!(!disableDiscordLinkLabels() && url2().hostname.endsWith("discord.com") && url2().pathname.startsWith("/channels/")))() && url2().pathname.split("/").slice(2);
      },
      get fallback() {
        return createComponent(Dynamic, {
          get component() {
            return props.noRenderer;
          }
        });
      },
      children: (e) => {
        const guild_id = () => e()[0];
        const channel_id = () => e()[1];
        const message_id = () => e()[2];
        return createComponent(Show, {
          get when() {
            return memo(() => !!guild_id())() && channel_id();
          },
          get fallback() {
            return createComponent(Dynamic, {
              get component() {
                return props.noRenderer;
              }
            });
          },
          children: (e2) => {
            const guild = () => guild_id() == "@me" ? null : untrack(discordClientReady)?.guilds.get(guild_id());
            const channel2 = () => guild() ? guild().channels.get(channel_id()) : untrack(discordClientReady)?.dms.get(channel_id());
            console.log(guild_id(), channel_id(), message_id(), channel2());
            return createComponent(Show, {
              get when() {
                return channel2();
              },
              get fallback() {
                return createComponent(Dynamic, {
                  get component() {
                    return props.noRenderer;
                  }
                });
              },
              get children() {
                return createComponent(Show, {
                  get when() {
                    return memo(() => "roleAccess" in channel2())() && channel2().roleAccess().ViewChannel === false;
                  },
                  get fallback() {
                    return createComponent(FocusableLink, {
                      onNavigate: async () => {
                        batch(() => {
                          setCurrentDiscordGuild(guild() || null);
                          setCurrentDiscordChannel(channel2());
                        });
                        await sleep(0);
                        focusMessages();
                      },
                      get react() {
                        return createComponent(ChannelMention, {
                          get $() {
                            return channel2();
                          },
                          get children() {
                            return [createComponent(Show, {
                              get when() {
                                return message_id() || guild_id() == "@me";
                              },
                              get children() {
                                return createComponent(MessageLinkSuffix, {});
                              }
                            }), " "];
                          }
                        });
                      }
                    });
                  },
                  get children() {
                    var _el$63 = _tmpl$23(), _el$64 = _el$63.firstChild;
                    className(_el$63, mention);
                    className(_el$64, channelMentionIcon);
                    insert(_el$64, createComponent(LockIcon, {}));
                    return _el$63;
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  role: (props) => {
    return createComponent(RoleMentionFromID, {
      get id() {
        return props.node.id;
      }
    });
  },
  channel: (props) => {
    const ready = untrack(discordClientReady), guild = untrack(currentDiscordGuild);
    const dms = ready?.dms;
    const channel2 = () => guild?.channels.get(props.node.id) || !disableDiscordLinkLabels() && // only search even further when discord link labels is enabled
    (ready?.guilds.findChannelById(props.node.id) || dms?.get(props.node.id));
    const guildFromChannel = () => {
      const _channel = channel2();
      return _channel && "guild" in _channel && _channel.guild || void 0;
    };
    return createComponent(Show, {
      get when() {
        return ready && channel2();
      },
      get fallback() {
        return createComponent(DeletedChannel_, {});
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return channel2();
          },
          get fallback() {
            return createComponent(DeletedChannel_, {});
          },
          children: (channel22) => createComponent(Show, {
            get when() {
              return memo(() => "roleAccess" in channel22())() && channel22().roleAccess().ViewChannel === false;
            },
            get fallback() {
              return createComponent(Show, {
                get when() {
                  return guildFromChannel();
                },
                get fallback() {
                  return (
                    // TODO: Message Links as mentions
                    createComponent(ChannelMention, {
                      get $() {
                        return channel22();
                      }
                    })
                  );
                },
                get children() {
                  return createComponent(FocusableLink, {
                    onNavigate: async () => {
                      batch(() => {
                        setCurrentDiscordGuild(guildFromChannel());
                        setCurrentDiscordChannel(channel22());
                      });
                      await sleep(0);
                      focusMessages();
                    },
                    get react() {
                      return createComponent(ChannelMention, {
                        get $() {
                          return channel22();
                        }
                      });
                    }
                  });
                }
              });
            },
            get children() {
              var _el$65 = _tmpl$23(), _el$66 = _el$65.firstChild;
              className(_el$65, mention);
              className(_el$66, channelMentionIcon);
              insert(_el$66, createComponent(LockIcon, {}));
              return _el$65;
            }
          })
        });
      }
    });
  },
  codeBlock: (props) => {
    return (() => {
      var _el$67 = _tmpl$24(), _el$68 = _el$67.firstChild;
      insert(_el$68, () => props.node.content);
      return _el$67;
    })();
  },
  spoiler: (props) => {
    return createComponent(SpoilerInline, {
      get children() {
        return createComponent(Dynamic, {
          get component() {
            return props.child;
          }
        });
      }
    });
  }
};
function MessageContent(props) {
  return createComponent(Markdown, mergeProps(props, {
    renderer
  }));
}
let chatbox;
function Message(props) {
  const _content = useStore(() => props.$, "content");
  const content2 = () => {
    const _ = _content();
    return props.$.forwarded ? props.$.forwarded_content : _;
  };
  const edited$1 = useStore(() => props.$, "edited_timestamp");
  const deleted$1 = useStore(() => props.$.deleted);
  const embeds2 = useStore(() => props.$.embeds);
  const reactions2 = useStore(() => props.$.reactions.state);
  const attachments2 = useStore(() => props.$.attachments);
  const stickers = useStore(() => props.$.stickers);
  let divRef;
  const [bigEmoji$1, setBigEmoji] = createSignal(false);
  onCleanup(() => {
    __CJS__export_default__.move("down") || __CJS__export_default__.move("up");
  });
  const [focused, setFocused] = createSignal(false);
  const [innerFocus, setInnerFocus] = createSignal(false);
  useKeypress("5", async () => {
    if (untrack(focused) && untrack(currentView) == Views.MESSAGES) {
      if (!divRef.querySelector(".v-image, .focusable-attachment")) return;
      divRef.blur();
      setInnerFocus(true);
      await sleep(0);
      makeContentFocusable(async () => {
        setInnerFocus(false);
        await sleep(0);
        divRef.focus({
          preventScroll: true
        });
      }, props.$.id);
    }
  });
  onMount(async () => {
    if (!props.last) return;
    console.log("last message mounted!!!");
    await sleep(2);
    const actEl = document.activeElement;
    if (actEl.classList.contains("noperm")) {
      console.log("NO PERM CHANNEL FOCUSING LAST MESSAGE");
      divRef.focus({
        preventScroll: true
      });
    }
    if (shouldScrollToBottom(divRef.offsetHeight)) {
      scrollToBottom();
      console.log("SCROLLED TO BOTTOM");
      const channel2 = props.channel;
      const readState = props.$.$channel.readState.value;
      const readStateLastMessageID = readState.last_message_id;
      const unread2 = readState.mention_count > 0 || readStateLastMessageID !== void 0 && props.$.$channel.lastMessageID.value !== readStateLastMessageID;
      if (unread2) channel2.ack();
    }
  });
  const timestampBefore = () => props.before?.$.timestamp;
  const timestamp2 = () => props.$.$.timestamp;
  const [hideContent$1, setHide] = createSignal(false);
  const [markdownRef, setMarkdownRef] = createSignal(null);
  createEffect(() => {
    const _content2 = content2();
    if (!_content2) return;
    const markdown2 = markdownRef();
    const ast = markdown2?.ast;
    const _embeds = embeds2();
    if (!ast) return;
    if (_embeds && _embeds.length == 1 && (_embeds[0].type == "image" || _embeds[0].type == "gifv") && ast.length == 1 && ["link", "url"].includes(ast[0].type)) {
      setHide(true);
    }
  });
  const guild = () => currentDiscordGuild();
  return [memo(() => memo(() => !!(timestampBefore() && decideDateSeparator(timestamp2(), timestampBefore())))() && createComponent(DateSeparator, {
    get children() {
      return new Date(timestamp2()).toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }
  })), (() => {
    var _el$69 = _tmpl$25();
    addEventListener(_el$69, "sn-navigatefailed", async (e) => {
      if (e.currentTarget !== e.target) return;
      console.log("NAVIGATE FAILED");
      const direction = e.detail.direction;
      if (!chatbox) return;
      if (direction == "down" && props.last) {
        if (!(chatbox.scrollTop === chatbox.scrollHeight - chatbox.offsetHeight)) {
          chatbox.scrollBy({
            top: 66,
            behavior: untrack($longpress) ? "auto" : "smooth"
          });
        }
      }
      if (direction == "left") {
        setCurrentView(Views.CHANNELS);
        await sleep(0);
        __CJS__export_default__.focus("channels");
      }
    });
    addEventListener(_el$69, "sn-willunfocus", function(e) {
      if (e.currentTarget !== e.target) return;
      const direction = e.detail.direction;
      const next = e.detail.nextElement;
      if (!/up|down/.test(direction)) return;
      const actEl = document.activeElement;
      if (!actEl.classList.contains(Message$1)) return;
      if (!chatbox) return;
      if (next.classList.contains("noperm")) {
        e.preventDefault();
      }
      const center = (el) => centerScroll(el, untrack($longpress));
      if (actEl.offsetHeight > chatbox.offsetHeight) {
        if (props.last && direction === "down") {
          chatbox.scrollBy({
            top: 66,
            behavior: untrack($longpress) ? "auto" : "smooth"
          });
          if (chatbox.scrollTop === chatbox.scrollHeight - chatbox.offsetHeight) {
            return;
          }
          e.preventDefault();
          return;
        }
        e.preventDefault();
        if (!isInViewport(next)) chatbox.scrollBy({
          top: direction === "up" ? -66 : 66,
          behavior: untrack($longpress) ? "auto" : "smooth"
        });
        if (!next) {
          console.warn("next element to focus not found!");
          return;
        }
        if (next.offsetHeight + 10 >= chatbox.offsetHeight) {
          console.warn("next element is bigger than viewport hmmmm");
          if (isPartiallyInViewport(next)) {
            next.focus({
              preventScroll: true
            });
            next.scrollIntoView({
              behavior: untrack($longpress) ? "auto" : "smooth"
            });
          }
        } else if (isInViewport(next)) {
          console.warn("next element is not bigger than viewport and is in viewport right now");
          center(next).then(() => {
            next.focus();
          });
        }
      } else if (next.offsetHeight >= chatbox.offsetHeight) {
        console.warn("next element is bigger than viewport but was not before big");
        next.focus({
          preventScroll: true
        });
        next.scrollIntoView({
          behavior: untrack($longpress) ? "auto" : "smooth"
        });
      } else if (next && next.offsetHeight <= chatbox.offsetHeight) {
        if (!next.classList.contains("noperm")) {
          center(next);
        }
      }
    });
    addEventListener(_el$69, "sn-focused", (e) => {
      if (e.currentTarget !== e.target) return;
      const actEl = document.activeElement;
      if (props.last && chatbox && actEl.offsetHeight < chatbox.offsetHeight) {
        centerScroll(actEl);
      }
    });
    _el$69.addEventListener("blur", () => {
      setFocused(false);
    });
    _el$69.addEventListener("focus", (e) => {
      if (e.currentTarget !== e.target) return;
      {
        e.currentTarget.$$$kori = props.$;
      }
      setFocused(true);
      setLastFocused("chat");
      if (props.last) {
        const channel2 = props.channel;
        const readState = props.$.$channel.readState.value;
        const readStateLastMessageID = readState.last_message_id;
        const unread2 = readState.mention_count > 0 || readStateLastMessageID !== void 0 && props.$.$channel.lastMessageID.value !== readStateLastMessageID;
        if (unread2) channel2.ack();
      }
    });
    _el$69.$$keydown = async (e) => {
      if (e.currentTarget !== e.target) return;
      if (!untrack(focused)) return;
      if (untrack(isKeypressPaused)) return;
      if (["1", "2", "3", "0", "*", "#"].includes(e.key) && !untrack(deleted$1)) {
        const key = e.key;
        const message = props.$;
        switch (key) {
          case "0":
            jumpToBottom();
            break;
          case "2":
            if (message.canPin()) {
              message.pin(!message.value.pinned);
            }
            break;
          case "3":
            if (message.canDelete()) {
              message.delete();
            }
            break;
          case "*":
            editMessage(message);
            break;
          case "#":
            replyToMessage(message);
            break;
        }
        return;
      }
      if (e.key == "Backspace") {
        setCurrentView(Views.CHANNELS);
        await sleep(0);
        __CJS__export_default__.focus("channels");
      }
      if (e.key == "SoftRight" && !untrack(deleted$1)) {
        const items = [props.$.reactions.canAddReaction() ? {
          id: "react",
          text: "Add Reaction",
          icon: () => createComponent(EmojiIcon, {})
        } : null, props.$.reactions.state.value.length > 0 ? {
          id: "reactions",
          text: "View Reactions",
          icon: () => createComponent(EmojiIcon, {})
        } : null, props.$.isEditable() ? {
          id: "edit",
          text: "Edit Message",
          icon: () => createComponent(PencilIcon, {})
        } : null, props.$.isRepliable() ? {
          id: "reply",
          text: "Reply",
          icon: () => _tmpl$26()
        } : null, {
          id: "forward",
          text: "Forward",
          icon: () => _tmpl$0$1()
        }, props.$.canDelete() ? {
          id: "delete",
          text: "Delete Message",
          icon: () => _tmpl$27()
        } : null, props.$.canPin() ? {
          id: "pin",
          text: props.$.value.pinned ? "Unpin Message" : "Pin Message",
          icon: () => createComponent(PinIcon, {})
        } : null, !untrack(readonlyChannel) && props.$.author.id != props.$.$channel.$client.config.user_id ? {
          id: "mention",
          text: "Mention User",
          icon: () => _tmpl$28()
        } : null];
        if (items.filter((a) => a).length == 0) {
          return;
        }
        const actEl = e.currentTarget;
        actEl.blur();
        const close = toolshed(() => createComponent(OptionsMenu, {
          onSelect: async (res) => {
            await close?.();
            actEl.focus();
            switch (res) {
              case "react": {
                await EmojiPicker.preload();
                const close2 = toolshed(() => (() => {
                  var _el$74 = _tmpl$29();
                  insert(_el$74, createComponent(EmojiPicker, {
                    get guild() {
                      return untrack(currentDiscordGuild);
                    },
                    onSelect: async (emoji2, withVariation) => {
                      await close2?.();
                      actEl.focus();
                      if ("guild" in emoji2) {
                        props.$.reactions.addReaction({
                          id: emoji2.$,
                          name: emoji2.name
                        });
                      } else {
                        props.$.reactions.addReaction({
                          id: null,
                          name: withVariation || emoji2.$
                        });
                      }
                    },
                    onClose: async () => {
                      await close2?.();
                      actEl.focus();
                    }
                  }));
                  return _el$74;
                })());
                break;
              }
              case "reactions": {
                const close2 = popup(() => createComponent(MessageReactionsPopup, {
                  get guild() {
                    return untrack(currentDiscordGuild);
                  },
                  get $() {
                    return props.$;
                  },
                  onClose: async () => {
                    await close2?.();
                    actEl.focus();
                  }
                }));
                break;
              }
              case "delete":
                props.$.delete();
                break;
              case "edit":
                editMessage(props.$);
                break;
              case "reply":
                replyToMessage(props.$);
                break;
              case "forward":
                setCurrentForwardMessage({
                  message_id: props.$.id,
                  channel_id: props.channel.id,
                  guild_id: "guild" in props.channel ? props.channel.guild.id : null
                });
                break;
              case "pin":
                props.$.value.pinned ? props.$.unpin() : props.$.pin();
                break;
              case "mention":
                mentionUserFromMessage(props.$);
                break;
            }
          },
          items
        }));
      }
    };
    var _ref$4 = divRef;
    typeof _ref$4 === "function" ? use(_ref$4, _el$69) : divRef = _el$69;
    insert(_el$69, createComponent(Switch, {
      get fallback() {
        return [createComponent(Show, {
          get when() {
            return decideMessageSeparator(props.$, props.before, props.channel);
          },
          get children() {
            return createComponent(MessageSeparator, {
              get $() {
                return props.$;
              }
            });
          }
        }), (() => {
          var _el$75 = _tmpl$4$2();
          className(_el$75, message_content);
          insert(_el$75, createComponent(Show, {
            get when() {
              return props.$.forwarded;
            },
            get children() {
              var _el$76 = _tmpl$30();
              className(_el$76, forwarded_header);
              return _el$76;
            }
          }), null);
          insert(_el$75, createComponent(Show, {
            get when() {
              return content2();
            },
            get children() {
              var _el$77 = _tmpl$4$2();
              insert(_el$77, createComponent(MessageContent, {
                setMarkdownRef,
                setBigEmoji,
                get text() {
                  return content2();
                }
              }), null);
              insert(_el$77, createComponent(Show, {
                get when() {
                  return edited$1();
                },
                get children() {
                  var _el$78 = _tmpl$31();
                  className(_el$78, edited);
                  return _el$78;
                }
              }), null);
              createRenderEffect((_$p) => classList(_el$77, {
                [text$3]: true,
                // [styles.content]: true,
                [bigEmoji]: bigEmoji$1(),
                [hideContent]: hideContent$1()
              }, _$p));
              return _el$77;
            }
          }), null);
          insert(_el$75, createComponent(Show, {
            get when() {
              return embeds2().length || attachments2().length || stickers()?.length;
            },
            get children() {
              return createComponent(MessageEmbeds, {
                renderer,
                get $() {
                  return props.$;
                }
              });
            }
          }), null);
          return _el$75;
        })(), createComponent(Show, {
          get when() {
            return reactions2().length;
          },
          get children() {
            return createComponent(MessageReactions, {
              get $() {
                return reactions2();
              }
            });
          }
        })];
      },
      get children() {
        return [createComponent(Match, {
          get when() {
            return memo(() => props.$.$.type == 7)() && guild();
          },
          get children() {
            return createComponent(JoinMessage, {
              get $() {
                return props.$;
              },
              get guild() {
                return guild();
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return props.$.$.type == 6;
          },
          get children() {
            return createComponent(PinnedMessage, {
              get $() {
                return props.$;
              },
              get guild() {
                return guild();
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return props.$.$.type == 2;
          },
          get children() {
            return createComponent(LeaveDMMessage, {
              get $() {
                return props.$;
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return props.$.$.type == 3;
          },
          get children() {
            return createComponent(CallMessage, {
              get $() {
                return props.$;
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return props.$.$.type == 1;
          },
          get children() {
            return createComponent(JoinDMMessage, {
              get $() {
                return props.$;
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return props.$.$.type == 4;
          },
          get children() {
            return createComponent(NameChangeDMMessage, {
              get $() {
                return props.$;
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return props.$.$.type == 5;
          },
          get children() {
            return createComponent(IconChangeDMMessage, {
              get $() {
                return props.$;
              }
            });
          }
        })];
      }
    }));
    createRenderEffect((_$p) => classList(_el$69, {
      [Message$1]: true,
      "msg-focused": innerFocus(),
      focusable: true,
      last: props.last,
      [mentioned]: props.$.wouldPing(false),
      [deleted]: deleted$1(),
      ["msg-" + props.$.id]: true,
      [forwarded]: props.$.forwarded
    }, _$p));
    return _el$69;
  })()];
}
let lastScrollHeight = 0;
const tick = () => Promise.resolve();
const debouncedLazy = debounce((guild, user_ids) => {
  guild.lazy(user_ids);
}, 2e3);
function getMentionedUserIDs(messages2, requestedAlready) {
  const usersMentioned = /* @__PURE__ */ new Set();
  messages2.forEach((a) => {
    a.mentions.forEach((a2) => {
      if (!requestedAlready.has(a2.id)) {
        usersMentioned.add(a2.id);
      }
    });
    const userIDfromInteraction = a.interaction?.user.id;
    if (userIDfromInteraction) {
      const id = userIDfromInteraction;
      if (!requestedAlready.has(id)) {
        usersMentioned.add(id);
      }
    }
    usersMentioned.add(a.author.id);
  });
  return difference(Array.from(usersMentioned), Array.from(requestedAlready));
}
async function loadMoreMessages(channel2) {
  __CJS__export_default__.move("down");
  setIsLoadingMoreMessages(true);
  await tick();
  const messages2 = channel2.messages.state.value;
  const first = messages2[0];
  if (!first || !chatbox) {
    setIsLoadingMoreMessages(false);
    return;
  }
  lastScrollHeight = chatbox.scrollHeight;
  channel2.messages.loadMessages(20).then(async (messages22) => {
    setIsLoadingMoreMessages(false);
    await tick();
    const actEl = document.activeElement;
    const guild = untrack(currentDiscordGuild);
    if (guild) {
      const requestedAlready = getRequestedUsers(guild.id);
      const users = getMentionedUserIDs(messages22, requestedAlready);
      if (users.length) {
        users.forEach((a) => requestedAlready.add(a));
        debouncedLazy(guild, users);
      }
    }
    if (chatbox && actEl && actEl.classList.contains("msg-" + first.id)) {
      await tick();
      const scrollDiff = chatbox.scrollHeight - lastScrollHeight;
      chatbox.scrollTop += scrollDiff;
      if (!isPartiallyInViewport(document.activeElement)) {
        actEl.blur();
        await tick();
        actEl.focus({
          preventScroll: true
        });
      }
    } else {
      actEl.blur();
      await tick();
      actEl.focus({
        preventScroll: true
      });
    }
  });
}
function LoadMoreMessagesButton(props) {
  const [focused, setFocused] = createSignal(false);
  return createComponent(Show, {
    get when() {
      return !isLoadingMoreMessages();
    },
    get fallback() {
      return (() => {
        var _el$80 = _tmpl$4$2();
        insert(_el$80, createComponent(Button$1, {
          disabled: true,
          children: "Loading..."
        }));
        createRenderEffect((_$p) => classList(_el$80, {
          [button_wrap$1]: true
        }, _$p));
        return _el$80;
      })();
    },
    get children() {
      var _el$79 = _tmpl$25();
      _el$79.addEventListener("blur", () => setFocused(false));
      _el$79.addEventListener("focus", () => setFocused(true));
      addEventListener(_el$79, "sn-enter-down", () => loadMoreMessages(props.$));
      addEventListener(_el$79, "sn-navigatefailed", (e) => {
        if (e.detail.direction == "up") loadMoreMessages(props.$);
      });
      insert(_el$79, createComponent(Button$1, {
        get focused() {
          return focused();
        },
        children: "Load More"
      }));
      createRenderEffect((_$p) => classList(_el$79, {
        focusable: true,
        [button_wrap$1]: true
      }, _$p));
      return _el$79;
    }
  });
}
function MessagesWrap(props) {
  const messages2 = useStore(() => props.channel.messages.state);
  return [createComponent(LoadMoreMessagesButton, {
    get $() {
      return props.channel;
    }
  }), createComponent(For, {
    get each() {
      return messages2();
    },
    children: (message, index) => createComponent(Message, {
      get channel() {
        return props.channel;
      },
      get before() {
        return messages2()[index() - 1];
      },
      get last() {
        return index() == messages2().length - 1;
      },
      get index() {
        return index();
      },
      $: message
    })
  })];
}
const alreadyRequestedUsers = /* @__PURE__ */ new Map();
function getRequestedUsers(id) {
  const has = alreadyRequestedUsers.get(id);
  if (has) return has;
  const set = /* @__PURE__ */ new Set();
  alreadyRequestedUsers.set(id, set);
  return set;
}
function MessageList(props) {
  let chatListScrollableRef;
  onMount(() => {
    shouldScrollToBottom = (addHeight) => {
      if (untrack(messageBoxFocused)) return true;
      if (addHeight != void 0) {
        return chatListScrollableRef.scrollHeight === chatListScrollableRef.scrollTop + chatListScrollableRef.offsetHeight + addHeight;
      }
      return false;
    };
    chatbox = chatListScrollableRef;
  });
  createEffect(() => {
    DiscordMessage.preserveDeleted = preserveDeleted();
  });
  createEffect(() => {
    const channel2 = props.channel;
    if (!channel2) return;
    console.log("CHANNELS CHANGED");
    setLastFocused("message-box");
    scrollToBottom = (smooth) => {
      if (smooth) {
        chatListScrollableRef.scroll({
          top: chatListScrollableRef.scrollHeight,
          behavior: "smooth"
        });
        return;
      }
      chatListScrollableRef.scrollTop = chatListScrollableRef.scrollHeight;
    };
    const hasLoaded = channel2.messages.state.value.length > 0;
    if (channel2.messages.state.value.length < 20) {
      if (!hasLoaded) {
        setIsLoadingMoreMessages(true);
      }
      channel2.messages.loadMessages(20).then(async (messages2) => {
        setIsLoadingMoreMessages(false);
        await tick();
        const guild = untrack(currentDiscordGuild);
        if (guild) {
          const requestedAlready = getRequestedUsers(guild.id);
          const users = getMentionedUserIDs(messages2, requestedAlready);
          if (users.length) {
            users.forEach((a) => requestedAlready.add(a));
            debouncedLazy(guild, users);
          }
        }
        scrollToBottom();
      });
    }
    tick().then(() => scrollToBottom());
  });
  return (() => {
    var _el$81 = _tmpl$4$2();
    var _ref$5 = chatListScrollableRef;
    typeof _ref$5 === "function" ? use(_ref$5, _el$81) : chatListScrollableRef = _el$81;
    className(_el$81, listWrap);
    insert(_el$81, createComponent(MessagesWrap, props));
    return _el$81;
  })();
}
function MessageListNullCheck() {
  return createComponent(Show, {
    get when() {
      return memo(() => !!currentDiscordChannel())() && "getMessages" in currentDiscordChannel();
    },
    get children() {
      return createComponent(MessageList, {
        get channel() {
          return currentDiscordChannel();
        }
      });
    }
  });
}
function focusMessages() {
  const result = __CJS__export_default__.focus(untrack(lastFocused));
  console.log("focusMessages called", result, untrack(lastFocused));
  return result;
}
function Messages() {
  onMount(() => {
    __CJS__export_default__.add("chat", {
      // temp
      selector: `.${Messages$1} .${listWrap} .focusable`,
      restrict: "self-first",
      rememberSource: true,
      enterTo: "last-focused",
      straightOnly: true,
      leaveFor: {
        left: "",
        right: ""
      },
      defaultElement: `.${Messages$1} .focusable:last-child`
    });
    __CJS__export_default__.add("message-box", {
      selector: `.${MessageBox$1} textarea, .noperm`,
      straightOnly: true,
      leaveFor: {
        up: "@chat",
        left: "",
        right: "",
        down: ""
      }
    });
  });
  onCleanup(() => {
    __CJS__export_default__.remove("chat");
    __CJS__export_default__.remove("message-box");
  });
  return (() => {
    var _el$82 = _tmpl$3$2(), _el$83 = _el$82.firstChild;
    className(_el$83, Messages$1);
    insert(_el$83, createComponent(MessageListNullCheck, {}), null);
    insert(_el$83, createComponent(MessageBoxNullCheck, {}), null);
    createRenderEffect((_$p) => classList(_el$82, {
      [messages]: true,
      [messagesInFocus]: currentView() == Views.MESSAGES,
      [channelsInFocus]: currentView() == Views.CHANNELS,
      [guildsInFocus]: currentView() == Views.GUILDS
    }, _$p));
    return _el$82;
  })();
}
delegateEvents(["input", "keydown"]);
var _tmpl$$6 = /* @__PURE__ */ template(`<svg class=icon_eff5d4 aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M16 4h.5v-.5a2.5 2.5 0 0 1 5 0V4h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm4-.5V4h-2v-.5a1 1 0 1 1 2 0Z"clip-rule=evenodd class></path><path fill=currentColor d="M12.5 8c.28 0 .5.22.5.5V9c0 .1 0 .2.02.31.03.34-.21.69-.56.69H9.85l-.67 4h4.97l.28-1.68c.06-.34.44-.52.77-.43a3 3 0 0 0 .8.11c.27 0 .47.24.43.5l-.25 1.5H20a1 1 0 1 1 0 2h-4.15l-.86 5.16a1 1 0 0 1-1.98-.32l.8-4.84H8.86l-.86 5.16A1 1 0 0 1 6 20.84L6.82 16H3a1 1 0 1 1 0-2h4.15l.67-4H4a1 1 0 1 1 0-2h4.15l.86-5.16a1 1 0 1 1 1.98.32L10.19 8h2.31Z"class>`), _tmpl$2$2 = /* @__PURE__ */ template(`<div>`), _tmpl$3$1 = /* @__PURE__ */ template(`<span style=font-weight:600>`), _tmpl$4$1 = /* @__PURE__ */ template(`<div tabindex=-1><div><div>`), _tmpl$5$1 = /* @__PURE__ */ template(`<div> Members`), _tmpl$6 = /* @__PURE__ */ template(`<div tabindex=-1>`), _tmpl$7 = /* @__PURE__ */ template(`<div tabindex=-1><svg role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"class>`), _tmpl$8 = /* @__PURE__ */ template(`<img>`), _tmpl$9 = /* @__PURE__ */ template(`<div><svg width=32 height=32 viewBox="0 0 32 32"><foreignObject x=0 y=0 width=32 height=32></foreignObject></svg><img>`), _tmpl$0 = /* @__PURE__ */ template(`<div style=padding:0>`);
const StatusIcons = {
  dnd,
  idle,
  online,
  offline,
  desktop_dnd,
  desktop_idle,
  desktop_online,
  mobile_dnd,
  mobile_idle,
  mobile_online,
  web_dnd,
  web_idle,
  web_online
};
const ChannelIcons = {
  text: TextIcon,
  announce: AnnouncementIcon,
  limited: () => _tmpl$$6(),
  rules: RulesIcon
};
function channelItemOnFocus(e) {
  let sync = false;
  centerScroll(e.target, sync);
}
function PresenceSubtitleAvailable(props) {
  const activity = () => props.presence.activities.reduce((acc, loc) => acc.type < loc.type ? acc : loc);
  return (() => {
    var _el$2 = _tmpl$2$2();
    className(_el$2, subtitle);
    insert(_el$2, createComponent(Show, {
      get when() {
        return activity().type === 4;
      },
      get fallback() {
        return createComponent(MarqueeOrNot, {
          get marquee() {
            return props.focused;
          },
          get children() {
            return [memo(() => ["Playing", "Streaming", "Listening to", "Watching", "", "Competing in"][activity().type]), " ", (() => {
              var _el$3 = _tmpl$3$1();
              insert(_el$3, () => activity().name);
              return _el$3;
            })()];
          }
        });
      },
      get children() {
        return createComponent(MarqueeOrNot, {
          get marquee() {
            return props.focused;
          },
          get children() {
            return [memo(() => memo(() => !!activity().emoji)() ? activity().emoji.name + " " : ""), memo(() => activity().state)];
          }
        });
      }
    }));
    return _el$2;
  })();
}
function PresenceSubtitle(props) {
  const presence = useStore(() => props.$.presence);
  return createComponent(Show, {
    get when() {
      return memo(() => !!props.$)() && !(presence().status === "offline" || presence().activities.length === 0);
    },
    get children() {
      return createComponent(PresenceSubtitleAvailable, {
        get focused() {
          return props.focused;
        },
        get presence() {
          return presence();
        }
      });
    }
  });
}
async function channelItemKeydown(e) {
  if (untrack(currentView) === Views.CHANNELS) {
    if (e.key === "ArrowRight" && untrack(currentDiscordChannel)) {
      setCurrentView(Views.MESSAGES);
      await sleep(0);
      focusMessages();
    }
    if (e.key == "Backspace" || e.key == "ArrowLeft") {
      setCurrentView(Views.GUILDS);
      await sleep(0);
      __CJS__export_default__.focus("guilds");
    }
  }
}
function DMItem(props) {
  const [focused, setFocused] = createSignal(false);
  const selected2 = () => currentDiscordChannel() === props.$;
  const unread2 = useStore(() => props.$.readState, "mention_count");
  const client = props.$.$client;
  const currentUserID = client.ready.user.id;
  const dmUser = props.$.recipients.value.filter((a) => a.id != currentUserID)[0];
  return (() => {
    var _el$4 = _tmpl$4$1(), _el$5 = _el$4.firstChild, _el$6 = _el$5.firstChild;
    addEventListener(_el$4, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      console.log("ENTER DOWN WAS PRESSED FOR DM ITEM");
      setCurrentDiscordChannel(props.$);
      if (unread2() > 0) props.$.ack();
      setCurrentView(Views.MESSAGES);
      await sleep(0);
      focusMessages();
    });
    _el$4.addEventListener("blur", (e) => {
      setFocused(false);
    });
    _el$4.$$keydown = (e) => {
      channelItemKeydown(e);
    };
    _el$4.addEventListener("focus", (e) => {
      setFocused(true);
      channelItemOnFocus(e);
    });
    insert(_el$4, createComponent(RecipientAvatar, {
      get $() {
        return props.$;
      },
      dmItem: true
    }), _el$5);
    className(_el$5, aside);
    className(_el$6, overflow);
    insert(_el$6, createComponent(MarqueeOrNot, {
      get marquee() {
        return focused();
      },
      get children() {
        return createComponent(UserLabel, {
          nickname: true,
          $: dmUser
        });
      }
    }));
    insert(_el$5, createComponent(PresenceSubtitle, {
      get focused() {
        return focused();
      },
      $: dmUser
    }), null);
    createRenderEffect((_$p) => classList(_el$4, {
      focusable: true,
      [dmItem]: true,
      // [styles.focused]: focused(),
      [selected$2]: selected2(),
      [unread$1]: unread2() > 0,
      ["channel-" + props.$.id]: true
    }, _$p));
    return _el$4;
  })();
}
function DMGroupMembersNumber(props) {
  const recipients = useStore(() => props.$.recipients);
  return (() => {
    var _el$7 = _tmpl$5$1(), _el$8 = _el$7.firstChild;
    className(_el$7, subtitle);
    insert(_el$7, () => recipients().length, _el$8);
    return _el$7;
  })();
}
function DMGroupDefaultName(props) {
  const recipients = useStore(() => props.$.recipients);
  const client = props.$.$client;
  const currentUser = client.users.get(client.ready.user.id);
  return createComponent(For, {
    get each() {
      return memo(() => recipients().length > 1)() ? recipients().filter((a) => a != currentUser) : recipients();
    },
    children: (a, i) => [memo(() => i() > 0 && ", "), createComponent(UserLabel, {
      nickname: true,
      $: a
    })]
  });
}
function DMGroupItem(props) {
  const name2 = useStore(() => props.$, "name");
  const [focused, setFocused] = createSignal(false);
  const selected2 = () => currentDiscordChannel() === props.$;
  const unread2 = useStore(() => props.$.readState, "mention_count");
  return (() => {
    var _el$9 = _tmpl$4$1(), _el$0 = _el$9.firstChild, _el$1 = _el$0.firstChild;
    addEventListener(_el$9, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      setCurrentDiscordChannel(props.$);
      if (unread2() > 0) props.$.ack();
      setCurrentView(Views.MESSAGES);
      await sleep(0);
      focusMessages();
    });
    _el$9.addEventListener("blur", () => setFocused(false));
    _el$9.$$keydown = channelItemKeydown;
    _el$9.addEventListener("focus", (e) => {
      channelItemOnFocus(e);
      setFocused(true);
    });
    insert(_el$9, createComponent(GroupDMIcon, {
      get $() {
        return props.$;
      }
    }), _el$0);
    className(_el$0, aside);
    className(_el$1, overflow);
    insert(_el$1, createComponent(MarqueeOrNot, {
      get marquee() {
        return focused();
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return name2();
          },
          get fallback() {
            return createComponent(DMGroupDefaultName, {
              get $() {
                return props.$;
              }
            });
          },
          get children() {
            return name2();
          }
        });
      }
    }));
    insert(_el$0, createComponent(DMGroupMembersNumber, {
      get $() {
        return props.$;
      }
    }), null);
    createRenderEffect((_$p) => classList(_el$9, {
      [dmItem]: true,
      focusable: true,
      // [styles.focused]: focused(),
      [selected$2]: selected2(),
      [unread$1]: unread2() > 0,
      ["channel-" + props.$.id]: true
    }, _$p));
    return _el$9;
  })();
}
function DMChannels() {
  const dms = useStore(() => untrack(discordClientReady).dms.sorted);
  const currentUserID = untrack(discordClientReady).ready.user.id;
  return createComponent(For, {
    get each() {
      return dms();
    },
    children: (dm, index) => (() => {
      var _el$10 = _tmpl$2$2();
      insert(_el$10, createComponent(CustomErrorBoundary, {
        get children() {
          return createComponent(Show, {
            when: dm instanceof DiscordGroupDMChannel,
            get fallback() {
              return createComponent(Show, {
                get when() {
                  return dm instanceof DiscordDMChannel && dm.recipients.value.filter((a) => a.id != currentUserID).length;
                },
                get children() {
                  return createComponent(DMItem, {
                    $: dm
                  });
                }
              });
            },
            get children() {
              return createComponent(DMGroupItem, {
                $: dm
              });
            }
          });
        }
      }));
      createRenderEffect((_$p) => classList(_el$10, {
        [vListItem]: true,
        [start]: index() == 0
      }, _$p));
      return _el$10;
    })()
  });
}
function isChannelPrivate(channel2) {
  const perms = useStore(() => channel2, "permission_overwrites");
  const roles = useStore(() => channel2.guild, "roles");
  const everyone2 = () => roles().find((p) => p.position == 0)?.id;
  const ft = () => perms()?.find((l) => l.id == everyone2());
  return () => {
    if (!ft()) return false;
    return (+ft().deny & 1024) == 1024;
  };
}
function GuildChannelItemDecorations(props) {
  const name2 = useStore(() => props.$, "name");
  const rulesChannelID = useStore(() => props.$.guild, "rules_channel_id");
  const isRulesChannel = () => rulesChannelID() == props.$.id;
  const ch_type = () => isRulesChannel() ? "rules" : props.$.type === 5 ? "announce" : isChannelPrivate(props.$)() ? "limited" : "text";
  return [(() => {
    var _el$11 = _tmpl$2$2();
    className(_el$11, indicator);
    return _el$11;
  })(), (() => {
    var _el$12 = _tmpl$2$2();
    className(_el$12, icon$5);
    insert(_el$12, createComponent(Dynamic, {
      get component() {
        return ChannelIcons[ch_type()];
      }
    }));
    return _el$12;
  })(), (() => {
    var _el$13 = _tmpl$2$2();
    className(_el$13, text$4);
    insert(_el$13, createComponent(MarqueeOrNot, {
      get marquee() {
        return props.focused;
      },
      get children() {
        return name2();
      }
    }));
    return _el$13;
  })()];
}
function GuildChannelItem(props) {
  const [focused, setFocused] = createSignal(false);
  const selected2 = () => currentDiscordChannel() === props.$;
  return (() => {
    var _el$14 = _tmpl$6();
    addEventListener(_el$14, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      setCurrentDiscordChannel(props.$);
      if (props.unread) props.$.ack();
      channelHistory.set(props.$.guild, props.$);
      setCurrentView(Views.MESSAGES);
      await sleep(0);
      focusMessages();
    });
    _el$14.addEventListener("blur", () => setFocused(false));
    _el$14.$$keydown = channelItemKeydown;
    _el$14.addEventListener("focus", (e) => {
      setFocused(true);
      channelItemOnFocus(e);
    });
    insert(_el$14, createComponent(GuildChannelItemDecorations, {
      get focused() {
        return focused();
      },
      get $() {
        return props.$;
      }
    }), null);
    insert(_el$14, createComponent(Show, {
      get when() {
        return props.mentionCount > 0;
      },
      get children() {
        var _el$15 = _tmpl$2$2();
        className(_el$15, count);
        insert(_el$15, () => props.mentionCount);
        return _el$15;
      }
    }), null);
    createRenderEffect((_$p) => classList(_el$14, {
      [chItem]: true,
      focusable: true,
      [unread$1]: props.unread,
      [selected$2]: selected2(),
      ["channel-" + props.$.id]: true
    }, _$p));
    return _el$14;
  })();
}
function CollapserChannelItemWithParent(props) {
  const [collapsed2] = useStoredSignal(false, "ch-collapsed-" + props.parent);
  return createComponent(Show, {
    get when() {
      return !(collapsed2() && !props.unread && currentDiscordChannel() != props.$);
    },
    get children() {
      return createComponent(GuildChannelItem, {
        get mentionCount() {
          return props.mentionCount;
        },
        get unread() {
          return props.unread;
        },
        get $() {
          return props.$;
        }
      });
    }
  });
}
function CollapserChannelItem(props) {
  const mentionCount = useStore(() => props.$.readState, "mention_count");
  const parent = useStore(() => props.$, "parent_id");
  const readStateLastMessageID = useStore(() => props.$.readState, "last_message_id");
  const lastMessageID = useStore(() => props.$.lastMessageID);
  const unread2 = () => mentionCount() > 0 || readStateLastMessageID() !== void 0 && lastMessageID() !== readStateLastMessageID();
  return createComponent(Show, {
    get when() {
      return parent();
    },
    get fallback() {
      return createComponent(GuildChannelItem, {
        get mentionCount() {
          return mentionCount();
        },
        get unread() {
          return unread2();
        },
        get $() {
          return props.$;
        }
      });
    },
    get children() {
      return createComponent(CollapserChannelItemWithParent, {
        get $() {
          return props.$;
        },
        get parent() {
          return parent();
        },
        get unread() {
          return unread2();
        },
        get mentionCount() {
          return mentionCount();
        }
      });
    }
  });
}
function GuildNameInChannels() {
  const name2 = useStore(() => currentDiscordGuild(), "name");
  return (() => {
    var _el$16 = _tmpl$2$2();
    className(_el$16, guildName);
    insert(_el$16, name2);
    return _el$16;
  })();
}
function ChannelsSeparatorCollapsable(props) {
  const [collapsed$1, setCollapsed] = useStoredSignal(false, "ch-collapsed-" + props.id);
  let nodeRef;
  return (() => {
    var _el$17 = _tmpl$7();
    _el$17.firstChild;
    addEventListener(_el$17, "sn-enter-down", async () => {
      setCollapsed((a) => !a);
      await sleep(0);
      centerScroll(nodeRef);
    });
    _el$17.$$keydown = channelItemKeydown;
    _el$17.addEventListener("focus", (e) => {
      centerScroll(e.target);
    });
    var _ref$ = nodeRef;
    typeof _ref$ === "function" ? use(_ref$, _el$17) : nodeRef = _el$17;
    insert(_el$17, () => props.children, null);
    createRenderEffect((_$p) => classList(_el$17, {
      focusable: true,
      [separator$1]: true,
      [collapsed]: collapsed$1()
    }, _$p));
    return _el$17;
  })();
}
function ChannelsSeparator(props) {
  return createComponent(Show, {
    get when() {
      return props.id;
    },
    get fallback() {
      return (() => {
        var _el$19 = _tmpl$2$2();
        className(_el$19, separator$1);
        insert(_el$19, () => props.children);
        return _el$19;
      })();
    },
    get children() {
      return createComponent(ChannelsSeparatorCollapsable, {
        get id() {
          return props.id;
        },
        get children() {
          return props.children;
        }
      });
    }
  });
}
function GuildCategory(props) {
  const name2 = useStore(() => props.$, "name");
  return createComponent(ChannelsSeparator, {
    get id() {
      return props.$.id;
    },
    get children() {
      return name2();
    }
  });
}
function GuildChannels() {
  const channels2 = useStore(() => currentDiscordGuild().channels.sorted);
  return createComponent(For, {
    get each() {
      return channels2();
    },
    children: (ch, index) => (() => {
      var _el$20 = _tmpl$2$2();
      insert(_el$20, createComponent(Show, {
        get when() {
          return !index();
        },
        get children() {
          return createComponent(GuildNameInChannels, {});
        }
      }), null);
      insert(_el$20, createComponent(Show, {
        get when() {
          return "readState" in ch;
        },
        get fallback() {
          return createComponent(GuildCategory, {
            $: ch
          });
        },
        get children() {
          return createComponent(CollapserChannelItem, {
            $: ch
          });
        }
      }), null);
      createRenderEffect((_$p) => classList(_el$20, {
        [vListItem]: true,
        [startGuild]: "readState" in ch && index() == 0
      }, _$p));
      return _el$20;
    })()
  });
}
function Channels() {
  onMount(() => {
    __CJS__export_default__.add("channels", {
      selector: `.${channels} .focusable`,
      rememberSource: true,
      restrict: "self-only",
      leaveFor: {
        left: "",
        right: ""
      }
    });
    preloadSearch();
  });
  onCleanup(() => {
    __CJS__export_default__.remove("channels");
  });
  return (() => {
    var _el$21 = _tmpl$2$2();
    insert(_el$21, createComponent(Show, {
      get when() {
        return currentDiscordGuild() == null;
      },
      get fallback() {
        return createComponent(GuildChannels, {});
      },
      get children() {
        return createComponent(DMChannels, {});
      }
    }));
    createRenderEffect((_$p) => classList(_el$21, {
      [channels]: true,
      [messagesInFocus]: currentView() == Views.MESSAGES,
      [channelsInFocus]: currentView() == Views.CHANNELS,
      [guildsInFocus]: currentView() == Views.GUILDS
    }, _$p));
    return _el$21;
  })();
}
function GroupDMIcon(props) {
  const icon2 = useStore(() => props.$, "icon");
  const defaultAvatar = createMemo(() => !icon2() && DEFAULT_GROUP_DM_AVATARS[convertSnowflakeToDate(props.$.id).getTime() % DEFAULT_GROUP_DM_AVATARS.length]);
  return (() => {
    var _el$22 = _tmpl$8();
    createRenderEffect((_p$) => {
      var _v$ = `${avatar$2} ${props.class ?? ""}`, _v$2 = icon2() ? `https://cdn.discordapp.com/channel-icons/${props.$.id}/${icon2()}.png?size=${props.size ?? 32}` : defaultAvatar() || "";
      _v$ !== _p$.e && className(_el$22, _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$22, "src", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$22;
  })();
}
function RecipientAvatarStatusIcon(props) {
  const presence = useStore(() => props.$.presence);
  const available = () => Object.keys(presence().client_status || {}).filter((a) => {
    return presence().client_status?.[a] == presence().status;
  });
  const client = () => available().length ? available()[Math.floor(Math.random() * available().length)] : null;
  const icon2 = () => presence().status === "offline" ? StatusIcons["offline"] : StatusIcons[client() + "_" + presence().status];
  return (() => {
    var _el$23 = _tmpl$9(), _el$24 = _el$23.firstChild, _el$25 = _el$24.firstChild, _el$26 = _el$24.nextSibling;
    className(_el$23, wrap$2);
    insert(_el$25, () => props.children);
    className(_el$26, status_icon);
    createRenderEffect((_p$) => {
      var _v$3 = `url(#${client() === "mobile" ? client() : "round"}-avatar-status)`, _v$4 = icon2();
      _v$3 !== _p$.e && setAttribute(_el$25, "mask", _p$.e = _v$3);
      _v$4 !== _p$.t && setAttribute(_el$26, "src", _p$.t = _v$4);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$23;
  })();
}
function RecipientAvatar(props) {
  const client = props.$.$client;
  const currentUserID = client.ready.user.id;
  const recipients = useStore(() => props.$.recipients);
  const user2 = () => recipients().find((a) => a.id != currentUserID);
  return createComponent(Show, {
    get when() {
      return user2();
    },
    get children() {
      return createComponent(Show, {
        get when() {
          return props.dmItem;
        },
        get fallback() {
          return (() => {
            var _el$28 = _tmpl$0();
            insert(_el$28, createComponent(UserAvatar, {
              get $() {
                return user2();
              },
              get size() {
                return props.size;
              }
            }));
            createRenderEffect(() => className(_el$28, `${avatar$2} ${props.class}`));
            return _el$28;
          })();
        },
        get children() {
          return createComponent(RecipientAvatarStatusIcon, {
            get $() {
              return user2();
            },
            get children() {
              var _el$27 = _tmpl$0();
              insert(_el$27, createComponent(UserAvatar, {
                get $() {
                  return user2();
                },
                get size() {
                  return props.size;
                }
              }));
              createRenderEffect(() => className(_el$27, `${avatar$2} ${props.class}`));
              return _el$27;
            }
          });
        }
      });
    }
  });
}
delegateEvents(["keydown"]);
const guildItem = `_guildItem_bcda59e`;
const guildPing = `_guildPing_4e35664`;
const guildIcon = `_guildIcon_3dc5298`;
const folderCollapse = `_folderCollapse_488cb3c`;
const folderIcon = `_folderIcon_53db2c0`;
const grid = `_grid_5aab7c7`;
const selected = `_selected_69dc953`;
const guildIndicator = `_guildIndicator_50785f6`;
const unread = `_unread_e0a00e9`;
const folderWrap = `_folderWrap_54ab977`;
const separator = `_separator_14bf54d`;
var _tmpl$$5 = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"class>`);
const ClydeIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$5();
  spread(_el$, props, true, true);
  return _el$;
})();
var _tmpl$$4 = /* @__PURE__ */ template(`<svg aria-hidden=true role=img xmlns=http://www.w3.org/2000/svg width=24 height=24 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M2 5a3 3 0 0 1 3-3h3.93a2 2 0 0 1 1.66.9L12 5h7a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Z"class>`);
const FolderIcon = (props = {}) => (() => {
  var _el$ = _tmpl$$4();
  spread(_el$, props, true, true);
  return _el$;
})();
const tooltip = `_tooltip_c5a86f0`;
const body = `_body_5736687`;
const arrow = `_arrow_62aa519`;
const left = `_left_cdbbf37`;
const right = `_right_dfdc4b8`;
var _tmpl$$3 = /* @__PURE__ */ template(`<div><div></div><div>`);
function Tooltip(props) {
  const [top, setTop] = createSignal(null);
  let divRef;
  createEffect(() => {
    if (divRef && typeof props.y == "number") {
      const height = divRef.clientHeight;
      setTop(props.y - height / 2);
    }
  });
  return (() => {
    var _el$ = _tmpl$$3(), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling;
    var _ref$ = divRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : divRef = _el$;
    className(_el$, tooltip);
    className(_el$3, body);
    insert(_el$3, () => props.children);
    createRenderEffect((_p$) => {
      var _v$ = normalizeCSSNumber(props.maxWidth), _v$2 = normalizeCSSNumber(props.maxHeight), _v$3 = normalizeCSSNumber(props.x), _v$4 = normalizeCSSNumber(top()), _v$5 = {
        [arrow]: true,
        [left]: true
      };
      _v$ !== _p$.e && setStyleProperty(_el$, "max-width", _p$.e = _v$);
      _v$2 !== _p$.t && setStyleProperty(_el$, "max-height", _p$.t = _v$2);
      _v$3 !== _p$.a && setStyleProperty(_el$, "left", _p$.a = _v$3);
      _v$4 !== _p$.o && setStyleProperty(_el$, "top", _p$.o = _v$4);
      _p$.i = classList(_el$2, _v$5, _p$.i);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    });
    return _el$;
  })();
}
var _tmpl$$2 = /* @__PURE__ */ template(`<div>`), _tmpl$2$1 = /* @__PURE__ */ template(`<img>`), _tmpl$3 = /* @__PURE__ */ template(`<div tabindex=-1>`), _tmpl$4 = /* @__PURE__ */ template(`<div tabindex=-1 id=dmGuild><div>`), _tmpl$5 = /* @__PURE__ */ template(`<div tabindex=-1><div>`);
function GuildIcon(props) {
  const icon2 = useStore(() => props.$, "icon");
  const name2 = useStore(() => props.$, "name");
  return createComponent(Show, {
    get when() {
      return icon2();
    },
    get fallback() {
      return (() => {
        var _el$ = _tmpl$$2();
        className(_el$, guildIcon);
        insert(_el$, () => name2().split(/\s+/).map((a) => {
          let char = "";
          a.replace(/((^[A-z])|([^A-z]))/g, (a2) => {
            char += a2;
            return a2;
          });
          return char;
        }).join(""));
        return _el$;
      })();
    },
    children: (icon22) => (() => {
      var _el$2 = _tmpl$2$1();
      className(_el$2, guildIcon);
      createRenderEffect((_p$) => {
        var _v$ = props.$.value.name, _v$2 = `https://cdn.discordapp.com/icons/${props.$.id}/${icon22()}.${props.focused && icon22().startsWith("a_") ? "gif" : imageFormatGuildIcon()}?size=48`;
        _v$ !== _p$.e && setAttribute(_el$2, "title", _p$.e = _v$);
        _v$2 !== _p$.t && setAttribute(_el$2, "src", _p$.t = _v$2);
        return _p$;
      }, {
        e: void 0,
        t: void 0
      });
      return _el$2;
    })()
  });
}
function GuildIndicatorGuild(props) {
  const mentionCount = getGuildMentionCount(props.$);
  return (() => {
    var _el$3 = _tmpl$$2();
    createRenderEffect((_$p) => classList(_el$3, {
      [guildIndicator]: true,
      [unread]: Number.isInteger(mentionCount())
    }, _$p));
    return _el$3;
  })();
}
function GuildIndicatorArray(props) {
  const [unread$12, setUnread] = createSignal(false);
  createEffect(() => {
    const unsubs = [];
    const map = /* @__PURE__ */ new Map();
    let init = false;
    function updateUnread() {
      for (const v of map.values()) {
        if (v || v === 0) {
          setUnread(true);
          return;
        }
      }
      setUnread(false);
    }
    props.$.forEach((guild) => {
      const mentionCount = getGuildMentionCount(guild);
      unsubs.push(observable(mentionCount).subscribe((state) => {
        map.set(guild.id, state);
        if (init) {
          updateUnread();
        }
      }).unsubscribe);
    });
    updateUnread();
    init = true;
    onCleanup(() => {
      unsubs.forEach((e) => e());
    });
  });
  return (() => {
    var _el$4 = _tmpl$$2();
    createRenderEffect((_$p) => classList(_el$4, {
      [guildIndicator]: true,
      [unread]: unread$12()
    }, _$p));
    return _el$4;
  })();
}
function GuildIndicator(props) {
  return createComponent(Switch, {
    get fallback() {
      return (() => {
        var _el$5 = _tmpl$$2();
        className(_el$5, guildIndicator);
        return _el$5;
      })();
    },
    get children() {
      return [createComponent(Match, {
        get when() {
          return Array.isArray(props.$);
        },
        get children() {
          return createComponent(GuildIndicatorArray, {
            get $() {
              return props.$;
            }
          });
        }
      }), createComponent(Match, {
        get when() {
          return props.$ instanceof DiscordGuild;
        },
        get children() {
          return createComponent(GuildIndicatorGuild, {
            get $() {
              return props.$;
            }
          });
        }
      })];
    }
  });
}
function MentionCount(props) {
  const mentionCount = useStore(() => props.$.readState, "mention_count");
  return (() => {
    var _el$6 = _tmpl$$2();
    className(_el$6, guildPing);
    insert(_el$6, mentionCount);
    return _el$6;
  })();
}
function DMPing(props) {
  return (() => {
    var _el$7 = _tmpl$3();
    _el$7.addEventListener("focus", (e) => {
      centerScroll(e.currentTarget);
    });
    addEventListener(_el$7, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      setCurrentDiscordGuild(null);
      setCurrentDiscordChannel(props.$);
      console.log("move", __CJS__export_default__.move("down") || __CJS__export_default__.move("up"));
      await sleep(0);
      props.$.ack();
      __CJS__export_default__.focus(`.${channels} .focusable.channel-${props.$.id}`);
      await sleep(0);
      setCurrentView(Views.MESSAGES);
      await sleep(0);
      focusMessages();
    });
    insert(_el$7, createComponent(Show, {
      get when() {
        return props.$ instanceof DiscordGroupDMChannel;
      },
      get fallback() {
        return createComponent(RecipientAvatar, {
          get $() {
            return props.$;
          },
          "class": guildIcon,
          size: 48
        });
      },
      get children() {
        return createComponent(GroupDMIcon, {
          get $() {
            return props.$;
          },
          "class": guildIcon,
          size: 48
        });
      }
    }), null);
    insert(_el$7, createComponent(MentionCount, {
      get $() {
        return props.$;
      }
    }), null);
    insert(_el$7, createComponent(GuildIndicator, {
      $: null
    }), null);
    createRenderEffect(() => className(_el$7, guildItem + " focusable"));
    return _el$7;
  })();
}
function DMPings() {
  const [pings, setPings] = createSignal([]);
  const dms = useStore(() => untrack(discordClientReady).dms.sorted);
  function updatePings(dms2) {
    setPings((oldState) => {
      const newState = dms2.filter((dm) => dm.readState.value.mention_count > 0);
      return shallowEqual(oldState, newState) ? oldState : newState;
    });
  }
  createEffect(async () => {
    pings();
    const current = document.activeElement;
    if (current) {
      console.log("NEW PINGS CHANGE OCCURED");
      current.blur();
      await sleep(10);
      current.focus();
    }
  });
  createEffect(() => {
    const _dms = dms();
    const subs = _dms.map((dm) => dm.readState.subscribe(() => updatePings(_dms)));
    console.log("SUBBING");
    onCleanup(() => {
      console.log("UNSUBBING");
      subs.forEach((e) => e());
    });
  });
  return createComponent(For, {
    get each() {
      return pings();
    },
    children: (p) => createComponent(DMPing, {
      $: p
    })
  });
}
function DMGuild() {
  const isSelected = () => currentDiscordGuild() === null;
  return [(() => {
    var _el$8 = _tmpl$4(), _el$9 = _el$8.firstChild;
    _el$8.addEventListener("focus", (e) => {
      centerScroll(e.currentTarget);
    });
    addEventListener(_el$8, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      batch(() => {
        setCurrentDiscordGuild(null);
        const fromHistory = channelHistory.get(null) || null;
        setCurrentDiscordChannel(fromHistory);
      });
      setCurrentView(Views.CHANNELS);
      await sleep(0);
      __CJS__export_default__.focus("channels");
    });
    className(_el$9, guildIcon);
    insert(_el$9, createComponent(ClydeIcon, {}));
    insert(_el$8, createComponent(GuildIndicator, {
      $: null
    }), null);
    createRenderEffect((_$p) => classList(_el$8, {
      [guildItem]: true,
      [selected]: isSelected(),
      focusable: true
    }, _$p));
    return _el$8;
  })(), createComponent(DMPings, {}), (() => {
    var _el$0 = _tmpl$$2();
    className(_el$0, separator);
    return _el$0;
  })()];
}
let mentionCounts = /* @__PURE__ */ new WeakMap();
function getGuildMentionCount(guild) {
  const has = mentionCounts.get(guild);
  if (has) return from(has);
  const _readable = readable(null, (set) => {
    const unsubs = [];
    const unsubFromSorted = guild.channels.sorted.subscribe((channels2) => {
      unsubs.forEach((e) => e());
      const map = /* @__PURE__ */ new Map();
      function updateCount() {
        let count2 = 0, unread2 = false;
        map.forEach((mention_count, channel2) => {
          count2 += mention_count;
          if (!count2 && !unread2) {
            const readStateMessageID = channel2.readState.value.last_message_id;
            unread2 = readStateMessageID !== void 0 && channel2.lastMessageID.value !== readStateMessageID;
          }
        });
        set(count2 || (unread2 ? 0 : null));
      }
      let init = false;
      channels2.forEach((channel2) => {
        if ("readState" in channel2) unsubs.push(channel2.readState.subscribe((state) => {
          map.set(channel2, state.mention_count);
          if (init) {
            updateCount();
          }
        }), channel2.lastMessageID.subscribe(() => {
          if (init) {
            updateCount();
          }
        }));
      });
      updateCount();
      init = true;
    });
    return () => {
      unsubs.forEach((e) => e());
      unsubFromSorted();
    };
  });
  mentionCounts.set(guild, _readable);
  return from(_readable);
}
function GuildMentionCount(props) {
  const mentionCount = getGuildMentionCount(props.$);
  return createComponent(Show, {
    get when() {
      return mentionCount();
    },
    get children() {
      var _el$1 = _tmpl$$2();
      className(_el$1, guildPing);
      insert(_el$1, mentionCount);
      return _el$1;
    }
  });
}
function GuildItem(props) {
  const isSelected = () => currentDiscordGuild() === props.$;
  const [scrolledTo, setScrolledTo] = createSignal(false);
  const [tooltipTop, setTooltipTop] = createSignal(null);
  const [focused, setFocused] = createSignal(false);
  return (() => {
    var _el$10 = _tmpl$3();
    _el$10.addEventListener("focus", (e) => {
      setFocused(true);
      const node = e.target;
      centerScroll(node).then(() => sleep(10)).then(() => {
        batch(() => {
          setScrolledTo(true);
          const rect = node.getBoundingClientRect();
          setTooltipTop(rect.top + node.clientHeight / 2);
        });
      });
    });
    _el$10.addEventListener("blur", () => {
      batch(() => {
        setFocused(false);
        setTooltipTop(null);
        setScrolledTo(false);
      });
    });
    addEventListener(_el$10, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      batch(() => {
        setCurrentDiscordGuild(props.$);
        props.$.lazy();
        const fromHistory = channelHistory.get(props.$);
        setCurrentDiscordChannel(fromHistory || null);
      });
      await sleep(0);
      setCurrentView(Views.CHANNELS);
      __CJS__export_default__.focus("channels");
    });
    insert(_el$10, createComponent(GuildIcon, {
      get focused() {
        return focused();
      },
      get $() {
        return props.$;
      }
    }), null);
    insert(_el$10, createComponent(Show, {
      get when() {
        return memo(() => !!focused())() && scrolledTo();
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return tooltipCanBeShown();
          },
          get children() {
            return createComponent(Portal, {
              get children() {
                return createComponent(Tooltip, {
                  get y() {
                    return tooltipTop();
                  },
                  x: 72,
                  get maxWidth() {
                    return window.innerWidth - (72 + 5);
                  },
                  get children() {
                    return props.$.value.name;
                  }
                });
              }
            });
          }
        });
      }
    }), null);
    insert(_el$10, createComponent(GuildMentionCount, {
      get $() {
        return props.$;
      }
    }), null);
    insert(_el$10, createComponent(GuildIndicator, {
      get $() {
        return props.$;
      }
    }), null);
    createRenderEffect((_$p) => classList(_el$10, {
      [guildItem]: true,
      focusable: true,
      [selected]: isSelected()
    }, _$p));
    return _el$10;
  })();
}
function GuildFolderGrid(props) {
  return (() => {
    var _el$11 = _tmpl$$2();
    className(_el$11, grid);
    insert(_el$11, createComponent(For, {
      get each() {
        return props.$.guilds;
      },
      children: (guild) => createComponent(GuildIcon, {
        focused: false,
        $: guild
      })
    }));
    return _el$11;
  })();
}
function GuildFolderClosedIcon(props) {
  const color = props.$.color;
  return (() => {
    var _el$12 = _tmpl$$2();
    insert(_el$12, createComponent(GuildFolderGrid, {
      get $() {
        return props.$;
      }
    }));
    createRenderEffect((_p$) => {
      var _v$3 = `rgba(${color ? decimal2rgb(color, true) : [88, 101, 242]},0.5)`, _v$4 = {
        [guildIcon]: true,
        [folderIcon]: true
      };
      _v$3 !== _p$.e && setStyleProperty(_el$12, "background-color", _p$.e = _v$3);
      _p$.t = classList(_el$12, _v$4, _p$.t);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$12;
  })();
}
function GuildFolderMentionCount(props) {
  const [mentionCount, setCount] = createSignal(0);
  createEffect(() => {
    const unsubs = [];
    const map = /* @__PURE__ */ new Map();
    let init = false;
    function updateCount() {
      let count2 = 0;
      for (const v of map.values()) {
        if (v) count2 += v;
      }
      setCount(count2);
    }
    props.$.forEach((guild) => {
      const mentionCount2 = getGuildMentionCount(guild);
      unsubs.push(observable(mentionCount2).subscribe((state) => {
        map.set(guild.id, state);
        if (init) {
          updateCount();
        }
      }).unsubscribe);
    });
    updateCount();
    init = true;
    onCleanup(() => {
      unsubs.forEach((e) => e());
    });
  });
  return createComponent(Show, {
    get when() {
      return mentionCount();
    },
    get children() {
      var _el$13 = _tmpl$$2();
      className(_el$13, guildPing);
      insert(_el$13, mentionCount);
      return _el$13;
    }
  });
}
function GuildFolderClosed(props) {
  return (() => {
    var _el$14 = _tmpl$3();
    addEventListener(_el$14, "sn-enter-down", async (e) => {
      e.currentTarget.blur();
      props.setOpen(true);
      await sleep(0);
      __CJS__export_default__.focus(`.folder-${props.$.id}`);
    });
    _el$14.addEventListener("focus", (e) => {
      centerScroll(e.target);
    });
    insert(_el$14, createComponent(GuildFolderClosedIcon, {
      get $() {
        return props.$;
      }
    }), null);
    insert(_el$14, createComponent(GuildFolderMentionCount, {
      get $() {
        return props.$.guilds;
      }
    }), null);
    insert(_el$14, createComponent(GuildIndicator, {
      get $() {
        return props.$.guilds;
      }
    }), null);
    createRenderEffect((_$p) => classList(_el$14, {
      [guildItem]: true,
      focusable: true,
      ["folder-" + props.$.id]: true
    }, _$p));
    return _el$14;
  })();
}
function CollapseFolderIcon(props) {
  return (() => {
    var _el$15 = _tmpl$5(), _el$16 = _el$15.firstChild;
    addEventListener(_el$15, "sn-enter-down", async () => {
      props.setOpen(false);
      await sleep(0);
      __CJS__export_default__.focus(`.folder-${props.$.id}`);
    });
    _el$15.addEventListener("focus", (e) => {
      centerScroll(e.target);
    });
    insert(_el$16, createComponent(FolderIcon, {}));
    insert(_el$15, createComponent(GuildIndicator, {
      $: null
    }), null);
    createRenderEffect((_p$) => {
      var _v$5 = {
        [guildItem]: true,
        [folderCollapse]: true,
        focusable: true,
        ["folder-" + props.$.id]: true
      }, _v$6 = {
        [guildIcon]: true,
        [folderIcon]: true
      }, _v$7 = typeof props.$.color == "number" ? `rgb(${decimal2rgb(props.$.color, true)})` : "#5865f2";
      _p$.e = classList(_el$15, _v$5, _p$.e);
      _p$.t = classList(_el$16, _v$6, _p$.t);
      _v$7 !== _p$.a && setStyleProperty(_el$16, "color", _p$.a = _v$7);
      return _p$;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    });
    return _el$15;
  })();
}
function GuildFolder(props) {
  const [open, setOpen] = useStoredSignal(false, `guilds-folder-opened-${props.$.id}`);
  return createComponent(Show, {
    get when() {
      return open();
    },
    get fallback() {
      return createComponent(GuildFolderClosed, {
        setOpen,
        get $() {
          return props.$;
        }
      });
    },
    get children() {
      var _el$17 = _tmpl$$2();
      className(_el$17, folderWrap);
      insert(_el$17, createComponent(CollapseFolderIcon, {
        setOpen,
        get $() {
          return props.$;
        }
      }), null);
      insert(_el$17, createComponent(For, {
        get each() {
          return props.$.guilds;
        },
        children: (guild) => createComponent(GuildItem, {
          $: guild
        })
      }), null);
      return _el$17;
    }
  });
}
function GuildItems() {
  const state = useStore(() => untrack(discordClientReady).guilds.sorted);
  createEffect(() => {
    state();
    const currentGuild = untrack(currentDiscordGuild);
    if (!currentGuild) return;
    const guildExists = untrack(discordClientReady).guilds.get(currentGuild.id);
    if (!guildExists) {
      mentionCounts.delete(currentGuild);
      batch(() => {
        setCurrentDiscordGuild(null);
        setCurrentDiscordChannel(null);
      });
    }
  });
  return createComponent(For, {
    get each() {
      return state();
    },
    children: (item2) => createComponent(Show, {
      get when() {
        return "guild_ids" in item2;
      },
      get fallback() {
        return createComponent(GuildItem, {
          $: item2
        });
      },
      get children() {
        return createComponent(GuildFolder, {
          $: item2
        });
      }
    })
  });
}
const [tooltipCanBeShown, setTooltipCanBeShown] = createSignal(false);
function Guilds() {
  const guildsInView = createMemo(() => currentView() == Views.GUILDS);
  createEffect(() => {
    const inView = guildsInView();
    if (!inView) return setTooltipCanBeShown(false);
    const timeout = setTimeout(() => {
      setTooltipCanBeShown(inView ? true : false);
    }, 300);
    onCleanup(() => clearTimeout(timeout));
  });
  onMount(() => {
    __CJS__export_default__.add("guilds", {
      selector: `.${guilds} .focusable`,
      rememberSource: true,
      restrict: "self-only"
    });
    __CJS__export_default__.focus("guilds");
  });
  onCleanup(() => {
    __CJS__export_default__.remove("guilds");
    mentionCounts = /* @__PURE__ */ new WeakMap();
  });
  let warned = false;
  useKeypress(["ArrowRight", "Backspace"], async (e) => {
    if (untrack(currentView) == Views.GUILDS) {
      if (e.key === "ArrowRight") {
        setCurrentView(Views.CHANNELS);
        await sleep(0);
        __CJS__export_default__.focus("channels");
      } else {
        if (!warned) setTimeout(() => {
          warned = false;
        }, 3e3);
        if (warned) return window.close();
        warned = true;
        toast("Press backspace again to close the app");
      }
    }
  });
  return (() => {
    var _el$18 = _tmpl$$2();
    insert(_el$18, createComponent(DMGuild, {}), null);
    insert(_el$18, createComponent(GuildItems, {}), null);
    createRenderEffect((_$p) => classList(_el$18, {
      [guilds]: true,
      [messagesInFocus]: currentView() == Views.MESSAGES,
      [channelsInFocus]: currentView() == Views.CHANNELS,
      [guildsInFocus]: currentView() == Views.GUILDS
    }, _$p));
    return _el$18;
  })();
}
const trolleee = `_trolleee_f6d33a7`;
const warning = `_warning_850a49b`;
var _tmpl$$1 = /* @__PURE__ */ template(`<div>Time left: <!>:`), _tmpl$2 = /* @__PURE__ */ template(`<div><div>⚠️</div><div>The app's code has been tampered with.</div><div>You risk your token being compromised.</div><div>only install the app from here: https://github.com/Discord4KaiOS/`);
function Timer(props) {
  onMount(() => {
    let timer2 = setInterval(() => {
      props.setTime((time2) => {
        if (time2 === 0) {
          clearInterval(timer2);
          return 0;
        } else return time2 - 1;
      });
    }, 1e3);
    onCleanup(() => {
      clearInterval(timer2);
    });
  });
  return (() => {
    var _el$ = _tmpl$$1(), _el$2 = _el$.firstChild, _el$4 = _el$2.nextSibling;
    _el$4.nextSibling;
    insert(_el$, () => `${Math.floor(props.time / 60)}`.padStart(2, "0"), _el$4);
    insert(_el$, () => `${props.time % 60}`.padStart(2, "0"), null);
    return _el$;
  })();
}
function IntegrityCheckFailed(props) {
  const [time2, setTime] = createSignal(90);
  createEffect(() => {
    const _time = time2();
    if (_time === 0) {
      props.onClose();
    }
  });
  onMount(() => {
    __CJS__export_default__.pause();
  });
  onCleanup(() => {
    __CJS__export_default__.resume();
  });
  return (() => {
    var _el$5 = _tmpl$2(), _el$6 = _el$5.firstChild, _el$7 = _el$6.nextSibling, _el$8 = _el$7.nextSibling;
    _el$8.nextSibling;
    className(_el$5, trolleee);
    className(_el$6, warning);
    insert(_el$5, createComponent(Timer, {
      get time() {
        return time2();
      },
      setTime
    }), null);
    return _el$5;
  })();
}
var _tmpl$ = /* @__PURE__ */ template(`<div>`);
function MainView() {
  setCurrentView(Views.GUILDS);
  onMount(() => {
    untrack(discordClient).once("close", () => {
      restartApp();
    });
    integrityCheck.then(async (e) => {
      await sleep(1e3);
      if (!e) {
        const actEl = document.activeElement;
        actEl.blur();
        const close = fullscreen(() => createComponent(IntegrityCheckFailed, {
          onClose: async () => {
            await close?.();
            actEl.focus();
          }
        }));
      }
    });
    document.querySelector(".LOADING")?.style.setProperty("display", "none");
  });
  return (() => {
    var _el$ = _tmpl$();
    className(_el$, mainView);
    insert(_el$, createComponent(Guilds, {}), null);
    insert(_el$, createComponent(Channels, {}), null);
    insert(_el$, createComponent(Messages, {}), null);
    createRenderEffect((_$p) => setStyleProperty(_el$, "transform", transform()));
    return _el$;
  })();
}
const MainView$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MainView
}, Symbol.toStringTag, { value: "Module" }));
export {
  MainView$1 as M,
  debounce as d,
  fuzzySearch as f,
  memoize as m
};
//# sourceMappingURL=MainView-_3_OZCIe.js.map
