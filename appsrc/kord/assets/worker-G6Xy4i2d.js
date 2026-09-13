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
(function() {
  "use strict";
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  var _a, _o, _b, _c, _o2, _c2, _S, _O, _w, _M, _I, _m, _n, _b2, _s, _i, _t, _l, _u, _a2, _h, _y, _r, __, _F, _d, _g, _T, _U, _f, _D, _d_instances, k_fn, _R, _v, _H, _p, X_fn, _x, _j, _N, A_fn, z_fn, V_fn, W_fn, G_fn, Y_fn, J_fn, P_fn, e_fn, B_fn, K_fn, Q_fn, C_fn, $_fn, L_fn, E_fn, q_fn, _d2;
  const proxyMarker = Symbol("Comlink.proxy");
  const createEndpoint = Symbol("Comlink.endpoint");
  const releaseProxy = Symbol("Comlink.releaseProxy");
  const finalizer = Symbol("Comlink.finalizer");
  const throwMarker = Symbol("Comlink.thrown");
  const isObject$1 = (val) => typeof val === "object" && val !== null || typeof val === "function";
  const proxyTransferHandler = {
    canHandle: (val) => isObject$1(val) && val[proxyMarker],
    serialize(obj) {
      const { port1, port2 } = new MessageChannel();
      expose(obj, port1);
      return [port2, [port2]];
    },
    deserialize(port) {
      port.start();
      return wrap(port);
    }
  };
  const throwTransferHandler = {
    canHandle: (value) => isObject$1(value) && throwMarker in value,
    serialize({ value }) {
      let serialized;
      if (value instanceof Error) {
        serialized = {
          isError: true,
          value: {
            message: value.message,
            name: value.name,
            stack: value.stack
          }
        };
      } else {
        serialized = { isError: false, value };
      }
      return [serialized, []];
    },
    deserialize(serialized) {
      if (serialized.isError) {
        throw Object.assign(new Error(serialized.value.message), serialized.value);
      }
      throw serialized.value;
    }
  };
  const transferHandlers = /* @__PURE__ */ new Map([
    ["proxy", proxyTransferHandler],
    ["throw", throwTransferHandler]
  ]);
  function isAllowedOrigin(allowedOrigins, origin) {
    for (const allowedOrigin of allowedOrigins) {
      if (origin === allowedOrigin || allowedOrigin === "*") {
        return true;
      }
      if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
        return true;
      }
    }
    return false;
  }
  function expose(obj, ep = globalThis, allowedOrigins = ["*"]) {
    ep.addEventListener("message", function callback(ev) {
      if (!ev || !ev.data) {
        return;
      }
      if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
        console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
        return;
      }
      const { id, type, path } = Object.assign({ path: [] }, ev.data);
      const argumentList = (ev.data.argumentList || []).map(fromWireValue);
      let returnValue;
      try {
        const parent = path.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
        const rawValue = path.reduce((obj2, prop) => obj2[prop], obj);
        switch (type) {
          case "GET":
            {
              returnValue = rawValue;
            }
            break;
          case "SET":
            {
              parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
              returnValue = true;
            }
            break;
          case "APPLY":
            {
              returnValue = rawValue.apply(parent, argumentList);
            }
            break;
          case "CONSTRUCT":
            {
              const value = new rawValue(...argumentList);
              returnValue = proxy(value);
            }
            break;
          case "ENDPOINT":
            {
              const { port1, port2 } = new MessageChannel();
              expose(obj, port2);
              returnValue = transfer(port1, [port1]);
            }
            break;
          case "RELEASE":
            {
              returnValue = void 0;
            }
            break;
          default:
            return;
        }
      } catch (value) {
        returnValue = { value, [throwMarker]: 0 };
      }
      Promise.resolve(returnValue).catch((value) => {
        return { value, [throwMarker]: 0 };
      }).then((returnValue2) => {
        const [wireValue, transferables] = toWireValue(returnValue2);
        ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
        if (type === "RELEASE") {
          ep.removeEventListener("message", callback);
          closeEndPoint(ep);
          if (finalizer in obj && typeof obj[finalizer] === "function") {
            obj[finalizer]();
          }
        }
      }).catch((error) => {
        const [wireValue, transferables] = toWireValue({
          value: new TypeError("Unserializable return value"),
          [throwMarker]: 0
        });
        ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
      });
    });
    if (ep.start) {
      ep.start();
    }
  }
  function isMessagePort(endpoint) {
    return endpoint.constructor.name === "MessagePort";
  }
  function closeEndPoint(endpoint) {
    if (isMessagePort(endpoint))
      endpoint.close();
  }
  function wrap(ep, target) {
    const pendingListeners = /* @__PURE__ */ new Map();
    ep.addEventListener("message", function handleMessage(ev) {
      const { data } = ev;
      if (!data || !data.id) {
        return;
      }
      const resolver = pendingListeners.get(data.id);
      if (!resolver) {
        return;
      }
      try {
        resolver(data);
      } finally {
        pendingListeners.delete(data.id);
      }
    });
    return createProxy(ep, pendingListeners, [], target);
  }
  function throwIfProxyReleased(isReleased) {
    if (isReleased) {
      throw new Error("Proxy has been released and is not useable");
    }
  }
  function releaseEndpoint(ep) {
    return requestResponseMessage(ep, /* @__PURE__ */ new Map(), {
      type: "RELEASE"
    }).then(() => {
      closeEndPoint(ep);
    });
  }
  const proxyCounter = /* @__PURE__ */ new WeakMap();
  const proxyFinalizers = "FinalizationRegistry" in globalThis && new FinalizationRegistry((ep) => {
    const newCount = (proxyCounter.get(ep) || 0) - 1;
    proxyCounter.set(ep, newCount);
    if (newCount === 0) {
      releaseEndpoint(ep);
    }
  });
  function registerProxy(proxy2, ep) {
    const newCount = (proxyCounter.get(ep) || 0) + 1;
    proxyCounter.set(ep, newCount);
    if (proxyFinalizers) {
      proxyFinalizers.register(proxy2, ep, proxy2);
    }
  }
  function unregisterProxy(proxy2) {
    if (proxyFinalizers) {
      proxyFinalizers.unregister(proxy2);
    }
  }
  function createProxy(ep, pendingListeners, path = [], target = function() {
  }) {
    let isProxyReleased = false;
    const proxy2 = new Proxy(target, {
      get(_target, prop) {
        throwIfProxyReleased(isProxyReleased);
        if (prop === releaseProxy) {
          return () => {
            unregisterProxy(proxy2);
            releaseEndpoint(ep);
            pendingListeners.clear();
            isProxyReleased = true;
          };
        }
        if (prop === "then") {
          if (path.length === 0) {
            return { then: () => proxy2 };
          }
          const r = requestResponseMessage(ep, pendingListeners, {
            type: "GET",
            path: path.map((p) => p.toString())
          }).then(fromWireValue);
          return r.then.bind(r);
        }
        return createProxy(ep, pendingListeners, [...path, prop]);
      },
      set(_target, prop, rawValue) {
        throwIfProxyReleased(isProxyReleased);
        const [value, transferables] = toWireValue(rawValue);
        return requestResponseMessage(ep, pendingListeners, {
          type: "SET",
          path: [...path, prop].map((p) => p.toString()),
          value
        }, transferables).then(fromWireValue);
      },
      apply(_target, _thisArg, rawArgumentList) {
        throwIfProxyReleased(isProxyReleased);
        const last2 = path[path.length - 1];
        if (last2 === createEndpoint) {
          return requestResponseMessage(ep, pendingListeners, {
            type: "ENDPOINT"
          }).then(fromWireValue);
        }
        if (last2 === "bind") {
          return createProxy(ep, pendingListeners, path.slice(0, -1));
        }
        const [argumentList, transferables] = processArguments(rawArgumentList);
        return requestResponseMessage(ep, pendingListeners, {
          type: "APPLY",
          path: path.map((p) => p.toString()),
          argumentList
        }, transferables).then(fromWireValue);
      },
      construct(_target, rawArgumentList) {
        throwIfProxyReleased(isProxyReleased);
        const [argumentList, transferables] = processArguments(rawArgumentList);
        return requestResponseMessage(ep, pendingListeners, {
          type: "CONSTRUCT",
          path: path.map((p) => p.toString()),
          argumentList
        }, transferables).then(fromWireValue);
      }
    });
    registerProxy(proxy2, ep);
    return proxy2;
  }
  function myFlat(arr) {
    return Array.prototype.concat.apply([], arr);
  }
  function processArguments(argumentList) {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
  }
  const transferCache = /* @__PURE__ */ new WeakMap();
  function transfer(obj, transfers) {
    transferCache.set(obj, transfers);
    return obj;
  }
  function proxy(obj) {
    return Object.assign(obj, { [proxyMarker]: true });
  }
  function toWireValue(value) {
    for (const [name, handler] of transferHandlers) {
      if (handler.canHandle(value)) {
        const [serializedValue, transferables] = handler.serialize(value);
        return [
          {
            type: "HANDLER",
            name,
            value: serializedValue
          },
          transferables
        ];
      }
    }
    return [
      {
        type: "RAW",
        value
      },
      transferCache.get(value) || []
    ];
  }
  function fromWireValue(value) {
    switch (value.type) {
      case "HANDLER":
        return transferHandlers.get(value.name).deserialize(value.value);
      case "RAW":
        return value.value;
    }
  }
  function requestResponseMessage(ep, pendingListeners, msg, transfers) {
    return new Promise((resolve) => {
      const id = generateUUID();
      pendingListeners.set(id, resolve);
      if (ep.start) {
        ep.start();
      }
      ep.postMessage(Object.assign({ id }, msg), transfers);
    });
  }
  function generateUUID() {
    return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
  }
  var emoji_data = "/assets/emoji-B_R8ICHT.json";
  const ENTRIES = "ENTRIES";
  const KEYS = "KEYS";
  const VALUES = "VALUES";
  const LEAF = "";
  class TreeIterator {
    constructor(set, type) {
      const node = set._tree;
      const keys = Array.from(node.keys());
      this.set = set;
      this._type = type;
      this._path = keys.length > 0 ? [{ node, keys }] : [];
    }
    next() {
      const value = this.dive();
      this.backtrack();
      return value;
    }
    dive() {
      if (this._path.length === 0) {
        return { done: true, value: void 0 };
      }
      const { node, keys } = last$1(this._path);
      if (last$1(keys) === LEAF) {
        return { done: false, value: this.result() };
      }
      const child = node.get(last$1(keys));
      this._path.push({ node: child, keys: Array.from(child.keys()) });
      return this.dive();
    }
    backtrack() {
      if (this._path.length === 0) {
        return;
      }
      const keys = last$1(this._path).keys;
      keys.pop();
      if (keys.length > 0) {
        return;
      }
      this._path.pop();
      this.backtrack();
    }
    key() {
      return this.set._prefix + this._path.map(({ keys }) => last$1(keys)).filter((key) => key !== LEAF).join("");
    }
    value() {
      return last$1(this._path).node.get(LEAF);
    }
    result() {
      switch (this._type) {
        case VALUES:
          return this.value();
        case KEYS:
          return this.key();
        default:
          return [this.key(), this.value()];
      }
    }
    [Symbol.iterator]() {
      return this;
    }
  }
  const last$1 = (array) => {
    return array[array.length - 1];
  };
  const fuzzySearch$1 = (node, query, maxDistance) => {
    const results = /* @__PURE__ */ new Map();
    if (query === void 0)
      return results;
    const n = query.length + 1;
    const m = n + maxDistance;
    const matrix = new Uint8Array(m * n).fill(maxDistance + 1);
    for (let j2 = 0; j2 < n; ++j2)
      matrix[j2] = j2;
    for (let i = 1; i < m; ++i)
      matrix[i * n] = i;
    recurse(node, query, maxDistance, results, matrix, 1, n, "");
    return results;
  };
  const recurse = (node, query, maxDistance, results, matrix, m, n, prefix) => {
    const offset = m * n;
    key: for (const key of node.keys()) {
      if (key === LEAF) {
        const distance = matrix[offset - 1];
        if (distance <= maxDistance) {
          results.set(prefix, [node.get(key), distance]);
        }
      } else {
        let i = m;
        for (let pos = 0; pos < key.length; ++pos, ++i) {
          const char = key[pos];
          const thisRowOffset = n * i;
          const prevRowOffset = thisRowOffset - n;
          let minDistance = matrix[thisRowOffset];
          const jmin = Math.max(0, i - maxDistance - 1);
          const jmax = Math.min(n - 1, i + maxDistance);
          for (let j2 = jmin; j2 < jmax; ++j2) {
            const different = char !== query[j2];
            const rpl = matrix[prevRowOffset + j2] + +different;
            const del = matrix[prevRowOffset + j2 + 1] + 1;
            const ins = matrix[thisRowOffset + j2] + 1;
            const dist = matrix[thisRowOffset + j2 + 1] = Math.min(rpl, del, ins);
            if (dist < minDistance)
              minDistance = dist;
          }
          if (minDistance > maxDistance) {
            continue key;
          }
        }
        recurse(node.get(key), query, maxDistance, results, matrix, i, n, prefix + key);
      }
    }
  };
  class SearchableMap {
    /**
     * The constructor is normally called without arguments, creating an empty
     * map. In order to create a {@link SearchableMap} from an iterable or from an
     * object, check {@link SearchableMap.from} and {@link
     * SearchableMap.fromObject}.
     *
     * The constructor arguments are for internal use, when creating derived
     * mutable views of a map at a prefix.
     */
    constructor(tree = /* @__PURE__ */ new Map(), prefix = "") {
      this._size = void 0;
      this._tree = tree;
      this._prefix = prefix;
    }
    /**
     * Creates and returns a mutable view of this {@link SearchableMap},
     * containing only entries that share the given prefix.
     *
     * ### Usage:
     *
     * ```javascript
     * let map = new SearchableMap()
     * map.set("unicorn", 1)
     * map.set("universe", 2)
     * map.set("university", 3)
     * map.set("unique", 4)
     * map.set("hello", 5)
     *
     * let uni = map.atPrefix("uni")
     * uni.get("unique") // => 4
     * uni.get("unicorn") // => 1
     * uni.get("hello") // => undefined
     *
     * let univer = map.atPrefix("univer")
     * univer.get("unique") // => undefined
     * univer.get("universe") // => 2
     * univer.get("university") // => 3
     * ```
     *
     * @param prefix  The prefix
     * @return A {@link SearchableMap} representing a mutable view of the original
     * Map at the given prefix
     */
    atPrefix(prefix) {
      if (!prefix.startsWith(this._prefix)) {
        throw new Error("Mismatched prefix");
      }
      const [node, path] = trackDown(this._tree, prefix.slice(this._prefix.length));
      if (node === void 0) {
        const [parentNode, key] = last(path);
        for (const k2 of parentNode.keys()) {
          if (k2 !== LEAF && k2.startsWith(key)) {
            const node2 = /* @__PURE__ */ new Map();
            node2.set(k2.slice(key.length), parentNode.get(k2));
            return new SearchableMap(node2, prefix);
          }
        }
      }
      return new SearchableMap(node, prefix);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
     */
    clear() {
      this._size = void 0;
      this._tree.clear();
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
     * @param key  Key to delete
     */
    delete(key) {
      this._size = void 0;
      return remove(this._tree, key);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
     * @return An iterator iterating through `[key, value]` entries.
     */
    entries() {
      return new TreeIterator(this, ENTRIES);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
     * @param fn  Iteration function
     */
    forEach(fn) {
      for (const [key, value] of this) {
        fn(key, value, this);
      }
    }
    /**
     * Returns a Map of all the entries that have a key within the given edit
     * distance from the search key. The keys of the returned Map are the matching
     * keys, while the values are two-element arrays where the first element is
     * the value associated to the key, and the second is the edit distance of the
     * key to the search key.
     *
     * ### Usage:
     *
     * ```javascript
     * let map = new SearchableMap()
     * map.set('hello', 'world')
     * map.set('hell', 'yeah')
     * map.set('ciao', 'mondo')
     *
     * // Get all entries that match the key 'hallo' with a maximum edit distance of 2
     * map.fuzzyGet('hallo', 2)
     * // => Map(2) { 'hello' => ['world', 1], 'hell' => ['yeah', 2] }
     *
     * // In the example, the "hello" key has value "world" and edit distance of 1
     * // (change "e" to "a"), the key "hell" has value "yeah" and edit distance of 2
     * // (change "e" to "a", delete "o")
     * ```
     *
     * @param key  The search key
     * @param maxEditDistance  The maximum edit distance (Levenshtein)
     * @return A Map of the matching keys to their value and edit distance
     */
    fuzzyGet(key, maxEditDistance) {
      return fuzzySearch$1(this._tree, key, maxEditDistance);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
     * @param key  Key to get
     * @return Value associated to the key, or `undefined` if the key is not
     * found.
     */
    get(key) {
      const node = lookup(this._tree, key);
      return node !== void 0 ? node.get(LEAF) : void 0;
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
     * @param key  Key
     * @return True if the key is in the map, false otherwise
     */
    has(key) {
      const node = lookup(this._tree, key);
      return node !== void 0 && node.has(LEAF);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
     * @return An `Iterable` iterating through keys
     */
    keys() {
      return new TreeIterator(this, KEYS);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
     * @param key  Key to set
     * @param value  Value to associate to the key
     * @return The {@link SearchableMap} itself, to allow chaining
     */
    set(key, value) {
      if (typeof key !== "string") {
        throw new Error("key must be a string");
      }
      this._size = void 0;
      const node = createPath(this._tree, key);
      node.set(LEAF, value);
      return this;
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
     */
    get size() {
      if (this._size) {
        return this._size;
      }
      this._size = 0;
      const iter = this.entries();
      while (!iter.next().done)
        this._size += 1;
      return this._size;
    }
    /**
     * Updates the value at the given key using the provided function. The function
     * is called with the current value at the key, and its return value is used as
     * the new value to be set.
     *
     * ### Example:
     *
     * ```javascript
     * // Increment the current value by one
     * searchableMap.update('somekey', (currentValue) => currentValue == null ? 0 : currentValue + 1)
     * ```
     *
     * If the value at the given key is or will be an object, it might not require
     * re-assignment. In that case it is better to use `fetch()`, because it is
     * faster.
     *
     * @param key  The key to update
     * @param fn  The function used to compute the new value from the current one
     * @return The {@link SearchableMap} itself, to allow chaining
     */
    update(key, fn) {
      if (typeof key !== "string") {
        throw new Error("key must be a string");
      }
      this._size = void 0;
      const node = createPath(this._tree, key);
      node.set(LEAF, fn(node.get(LEAF)));
      return this;
    }
    /**
     * Fetches the value of the given key. If the value does not exist, calls the
     * given function to create a new value, which is inserted at the given key
     * and subsequently returned.
     *
     * ### Example:
     *
     * ```javascript
     * const map = searchableMap.fetch('somekey', () => new Map())
     * map.set('foo', 'bar')
     * ```
     *
     * @param key  The key to update
     * @param initial  A function that creates a new value if the key does not exist
     * @return The existing or new value at the given key
     */
    fetch(key, initial) {
      if (typeof key !== "string") {
        throw new Error("key must be a string");
      }
      this._size = void 0;
      const node = createPath(this._tree, key);
      let value = node.get(LEAF);
      if (value === void 0) {
        node.set(LEAF, value = initial());
      }
      return value;
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
     * @return An `Iterable` iterating through values.
     */
    values() {
      return new TreeIterator(this, VALUES);
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
     */
    [Symbol.iterator]() {
      return this.entries();
    }
    /**
     * Creates a {@link SearchableMap} from an `Iterable` of entries
     *
     * @param entries  Entries to be inserted in the {@link SearchableMap}
     * @return A new {@link SearchableMap} with the given entries
     */
    static from(entries) {
      const tree = new SearchableMap();
      for (const [key, value] of entries) {
        tree.set(key, value);
      }
      return tree;
    }
    /**
     * Creates a {@link SearchableMap} from the iterable properties of a JavaScript object
     *
     * @param object  Object of entries for the {@link SearchableMap}
     * @return A new {@link SearchableMap} with the given entries
     */
    static fromObject(object2) {
      return SearchableMap.from(Object.entries(object2));
    }
  }
  const trackDown = (tree, key, path = []) => {
    if (key.length === 0 || tree == null) {
      return [tree, path];
    }
    for (const k2 of tree.keys()) {
      if (k2 !== LEAF && key.startsWith(k2)) {
        path.push([tree, k2]);
        return trackDown(tree.get(k2), key.slice(k2.length), path);
      }
    }
    path.push([tree, key]);
    return trackDown(void 0, "", path);
  };
  const lookup = (tree, key) => {
    if (key.length === 0 || tree == null) {
      return tree;
    }
    for (const k2 of tree.keys()) {
      if (k2 !== LEAF && key.startsWith(k2)) {
        return lookup(tree.get(k2), key.slice(k2.length));
      }
    }
  };
  const createPath = (node, key) => {
    const keyLength = key.length;
    outer: for (let pos = 0; node && pos < keyLength; ) {
      for (const k2 of node.keys()) {
        if (k2 !== LEAF && key[pos] === k2[0]) {
          const len = Math.min(keyLength - pos, k2.length);
          let offset = 1;
          while (offset < len && key[pos + offset] === k2[offset])
            ++offset;
          const child2 = node.get(k2);
          if (offset === k2.length) {
            node = child2;
          } else {
            const intermediate = /* @__PURE__ */ new Map();
            intermediate.set(k2.slice(offset), child2);
            node.set(key.slice(pos, pos + offset), intermediate);
            node.delete(k2);
            node = intermediate;
          }
          pos += offset;
          continue outer;
        }
      }
      const child = /* @__PURE__ */ new Map();
      node.set(key.slice(pos), child);
      return child;
    }
    return node;
  };
  const remove = (tree, key) => {
    const [node, path] = trackDown(tree, key);
    if (node === void 0) {
      return;
    }
    node.delete(LEAF);
    if (node.size === 0) {
      cleanup(path);
    } else if (node.size === 1) {
      const [key2, value] = node.entries().next().value;
      merge(path, key2, value);
    }
  };
  const cleanup = (path) => {
    if (path.length === 0) {
      return;
    }
    const [node, key] = last(path);
    node.delete(key);
    if (node.size === 0) {
      cleanup(path.slice(0, -1));
    } else if (node.size === 1) {
      const [key2, value] = node.entries().next().value;
      if (key2 !== LEAF) {
        merge(path.slice(0, -1), key2, value);
      }
    }
  };
  const merge = (path, key, value) => {
    if (path.length === 0) {
      return;
    }
    const [node, nodeKey] = last(path);
    node.set(nodeKey + key, value);
    node.delete(nodeKey);
  };
  const last = (array) => {
    return array[array.length - 1];
  };
  const OR = "or";
  const AND = "and";
  const AND_NOT = "and_not";
  class MiniSearch {
    /**
     * @param options  Configuration options
     *
     * ### Examples:
     *
     * ```javascript
     * // Create a search engine that indexes the 'title' and 'text' fields of your
     * // documents:
     * const miniSearch = new MiniSearch({ fields: ['title', 'text'] })
     * ```
     *
     * ### ID Field:
     *
     * ```javascript
     * // Your documents are assumed to include a unique 'id' field, but if you want
     * // to use a different field for document identification, you can set the
     * // 'idField' option:
     * const miniSearch = new MiniSearch({ idField: 'key', fields: ['title', 'text'] })
     * ```
     *
     * ### Options and defaults:
     *
     * ```javascript
     * // The full set of options (here with their default value) is:
     * const miniSearch = new MiniSearch({
     *   // idField: field that uniquely identifies a document
     *   idField: 'id',
     *
     *   // extractField: function used to get the value of a field in a document.
     *   // By default, it assumes the document is a flat object with field names as
     *   // property keys and field values as string property values, but custom logic
     *   // can be implemented by setting this option to a custom extractor function.
     *   extractField: (document, fieldName) => document[fieldName],
     *
     *   // tokenize: function used to split fields into individual terms. By
     *   // default, it is also used to tokenize search queries, unless a specific
     *   // `tokenize` search option is supplied. When tokenizing an indexed field,
     *   // the field name is passed as the second argument.
     *   tokenize: (string, _fieldName) => string.split(SPACE_OR_PUNCTUATION),
     *
     *   // processTerm: function used to process each tokenized term before
     *   // indexing. It can be used for stemming and normalization. Return a falsy
     *   // value in order to discard a term. By default, it is also used to process
     *   // search queries, unless a specific `processTerm` option is supplied as a
     *   // search option. When processing a term from a indexed field, the field
     *   // name is passed as the second argument.
     *   processTerm: (term, _fieldName) => term.toLowerCase(),
     *
     *   // searchOptions: default search options, see the `search` method for
     *   // details
     *   searchOptions: undefined,
     *
     *   // fields: document fields to be indexed. Mandatory, but not set by default
     *   fields: undefined
     *
     *   // storeFields: document fields to be stored and returned as part of the
     *   // search results.
     *   storeFields: []
     * })
     * ```
     */
    constructor(options) {
      if ((options === null || options === void 0 ? void 0 : options.fields) == null) {
        throw new Error('MiniSearch: option "fields" must be provided');
      }
      const autoVacuum = options.autoVacuum == null || options.autoVacuum === true ? defaultAutoVacuumOptions : options.autoVacuum;
      this._options = {
        ...defaultOptions,
        ...options,
        autoVacuum,
        searchOptions: { ...defaultSearchOptions, ...options.searchOptions || {} },
        autoSuggestOptions: { ...defaultAutoSuggestOptions, ...options.autoSuggestOptions || {} }
      };
      this._index = new SearchableMap();
      this._documentCount = 0;
      this._documentIds = /* @__PURE__ */ new Map();
      this._idToShortId = /* @__PURE__ */ new Map();
      this._fieldIds = {};
      this._fieldLength = /* @__PURE__ */ new Map();
      this._avgFieldLength = [];
      this._nextId = 0;
      this._storedFields = /* @__PURE__ */ new Map();
      this._dirtCount = 0;
      this._currentVacuum = null;
      this._enqueuedVacuum = null;
      this._enqueuedVacuumConditions = defaultVacuumConditions;
      this.addFields(this._options.fields);
    }
    /**
     * Adds a document to the index
     *
     * @param document  The document to be indexed
     */
    add(document2) {
      const { extractField, stringifyField, tokenize, processTerm, fields, idField } = this._options;
      const id = extractField(document2, idField);
      if (id == null) {
        throw new Error(`MiniSearch: document does not have ID field "${idField}"`);
      }
      if (this._idToShortId.has(id)) {
        throw new Error(`MiniSearch: duplicate ID ${id}`);
      }
      const shortDocumentId = this.addDocumentId(id);
      this.saveStoredFields(shortDocumentId, document2);
      for (const field of fields) {
        const fieldValue = extractField(document2, field);
        if (fieldValue == null)
          continue;
        const tokens = tokenize(stringifyField(fieldValue, field), field);
        const fieldId = this._fieldIds[field];
        const uniqueTerms = new Set(tokens).size;
        this.addFieldLength(shortDocumentId, fieldId, this._documentCount - 1, uniqueTerms);
        for (const term of tokens) {
          const processedTerm = processTerm(term, field);
          if (Array.isArray(processedTerm)) {
            for (const t of processedTerm) {
              this.addTerm(fieldId, shortDocumentId, t);
            }
          } else if (processedTerm) {
            this.addTerm(fieldId, shortDocumentId, processedTerm);
          }
        }
      }
    }
    /**
     * Adds all the given documents to the index
     *
     * @param documents  An array of documents to be indexed
     */
    addAll(documents) {
      for (const document2 of documents)
        this.add(document2);
    }
    /**
     * Adds all the given documents to the index asynchronously.
     *
     * Returns a promise that resolves (to `undefined`) when the indexing is done.
     * This method is useful when index many documents, to avoid blocking the main
     * thread. The indexing is performed asynchronously and in chunks.
     *
     * @param documents  An array of documents to be indexed
     * @param options  Configuration options
     * @return A promise resolving to `undefined` when the indexing is done
     */
    addAllAsync(documents, options = {}) {
      const { chunkSize = 10 } = options;
      const acc = { chunk: [], promise: Promise.resolve() };
      const { chunk, promise } = documents.reduce(({ chunk: chunk2, promise: promise2 }, document2, i) => {
        chunk2.push(document2);
        if ((i + 1) % chunkSize === 0) {
          return {
            chunk: [],
            promise: promise2.then(() => new Promise((resolve) => setTimeout(resolve, 0))).then(() => this.addAll(chunk2))
          };
        } else {
          return { chunk: chunk2, promise: promise2 };
        }
      }, acc);
      return promise.then(() => this.addAll(chunk));
    }
    /**
     * Removes the given document from the index.
     *
     * The document to remove must NOT have changed between indexing and removal,
     * otherwise the index will be corrupted.
     *
     * This method requires passing the full document to be removed (not just the
     * ID), and immediately removes the document from the inverted index, allowing
     * memory to be released. A convenient alternative is {@link
     * MiniSearch#discard}, which needs only the document ID, and has the same
     * visible effect, but delays cleaning up the index until the next vacuuming.
     *
     * @param document  The document to be removed
     */
    remove(document2) {
      const { tokenize, processTerm, extractField, stringifyField, fields, idField } = this._options;
      const id = extractField(document2, idField);
      if (id == null) {
        throw new Error(`MiniSearch: document does not have ID field "${idField}"`);
      }
      const shortId = this._idToShortId.get(id);
      if (shortId == null) {
        throw new Error(`MiniSearch: cannot remove document with ID ${id}: it is not in the index`);
      }
      for (const field of fields) {
        const fieldValue = extractField(document2, field);
        if (fieldValue == null)
          continue;
        const tokens = tokenize(stringifyField(fieldValue, field), field);
        const fieldId = this._fieldIds[field];
        const uniqueTerms = new Set(tokens).size;
        this.removeFieldLength(shortId, fieldId, this._documentCount, uniqueTerms);
        for (const term of tokens) {
          const processedTerm = processTerm(term, field);
          if (Array.isArray(processedTerm)) {
            for (const t of processedTerm) {
              this.removeTerm(fieldId, shortId, t);
            }
          } else if (processedTerm) {
            this.removeTerm(fieldId, shortId, processedTerm);
          }
        }
      }
      this._storedFields.delete(shortId);
      this._documentIds.delete(shortId);
      this._idToShortId.delete(id);
      this._fieldLength.delete(shortId);
      this._documentCount -= 1;
    }
    /**
     * Removes all the given documents from the index. If called with no arguments,
     * it removes _all_ documents from the index.
     *
     * @param documents  The documents to be removed. If this argument is omitted,
     * all documents are removed. Note that, for removing all documents, it is
     * more efficient to call this method with no arguments than to pass all
     * documents.
     */
    removeAll(documents) {
      if (documents) {
        for (const document2 of documents)
          this.remove(document2);
      } else if (arguments.length > 0) {
        throw new Error("Expected documents to be present. Omit the argument to remove all documents.");
      } else {
        this._index = new SearchableMap();
        this._documentCount = 0;
        this._documentIds = /* @__PURE__ */ new Map();
        this._idToShortId = /* @__PURE__ */ new Map();
        this._fieldLength = /* @__PURE__ */ new Map();
        this._avgFieldLength = [];
        this._storedFields = /* @__PURE__ */ new Map();
        this._nextId = 0;
      }
    }
    /**
     * Discards the document with the given ID, so it won't appear in search results
     *
     * It has the same visible effect of {@link MiniSearch.remove} (both cause the
     * document to stop appearing in searches), but a different effect on the
     * internal data structures:
     *
     *   - {@link MiniSearch#remove} requires passing the full document to be
     *   removed as argument, and removes it from the inverted index immediately.
     *
     *   - {@link MiniSearch#discard} instead only needs the document ID, and
     *   works by marking the current version of the document as discarded, so it
     *   is immediately ignored by searches. This is faster and more convenient
     *   than {@link MiniSearch#remove}, but the index is not immediately
     *   modified. To take care of that, vacuuming is performed after a certain
     *   number of documents are discarded, cleaning up the index and allowing
     *   memory to be released.
     *
     * After discarding a document, it is possible to re-add a new version, and
     * only the new version will appear in searches. In other words, discarding
     * and re-adding a document works exactly like removing and re-adding it. The
     * {@link MiniSearch.replace} method can also be used to replace a document
     * with a new version.
     *
     * #### Details about vacuuming
     *
     * Repetite calls to this method would leave obsolete document references in
     * the index, invisible to searches. Two mechanisms take care of cleaning up:
     * clean up during search, and vacuuming.
     *
     *   - Upon search, whenever a discarded ID is found (and ignored for the
     *   results), references to the discarded document are removed from the
     *   inverted index entries for the search terms. This ensures that subsequent
     *   searches for the same terms do not need to skip these obsolete references
     *   again.
     *
     *   - In addition, vacuuming is performed automatically by default (see the
     *   `autoVacuum` field in {@link Options}) after a certain number of
     *   documents are discarded. Vacuuming traverses all terms in the index,
     *   cleaning up all references to discarded documents. Vacuuming can also be
     *   triggered manually by calling {@link MiniSearch#vacuum}.
     *
     * @param id  The ID of the document to be discarded
     */
    discard(id) {
      const shortId = this._idToShortId.get(id);
      if (shortId == null) {
        throw new Error(`MiniSearch: cannot discard document with ID ${id}: it is not in the index`);
      }
      this._idToShortId.delete(id);
      this._documentIds.delete(shortId);
      this._storedFields.delete(shortId);
      (this._fieldLength.get(shortId) || []).forEach((fieldLength, fieldId) => {
        this.removeFieldLength(shortId, fieldId, this._documentCount, fieldLength);
      });
      this._fieldLength.delete(shortId);
      this._documentCount -= 1;
      this._dirtCount += 1;
      this.maybeAutoVacuum();
    }
    maybeAutoVacuum() {
      if (this._options.autoVacuum === false) {
        return;
      }
      const { minDirtFactor, minDirtCount, batchSize, batchWait } = this._options.autoVacuum;
      this.conditionalVacuum({ batchSize, batchWait }, { minDirtCount, minDirtFactor });
    }
    /**
     * Discards the documents with the given IDs, so they won't appear in search
     * results
     *
     * It is equivalent to calling {@link MiniSearch#discard} for all the given
     * IDs, but with the optimization of triggering at most one automatic
     * vacuuming at the end.
     *
     * Note: to remove all documents from the index, it is faster and more
     * convenient to call {@link MiniSearch.removeAll} with no argument, instead
     * of passing all IDs to this method.
     */
    discardAll(ids) {
      const autoVacuum = this._options.autoVacuum;
      try {
        this._options.autoVacuum = false;
        for (const id of ids) {
          this.discard(id);
        }
      } finally {
        this._options.autoVacuum = autoVacuum;
      }
      this.maybeAutoVacuum();
    }
    /**
     * It replaces an existing document with the given updated version
     *
     * It works by discarding the current version and adding the updated one, so
     * it is functionally equivalent to calling {@link MiniSearch#discard}
     * followed by {@link MiniSearch#add}. The ID of the updated document should
     * be the same as the original one.
     *
     * Since it uses {@link MiniSearch#discard} internally, this method relies on
     * vacuuming to clean up obsolete document references from the index, allowing
     * memory to be released (see {@link MiniSearch#discard}).
     *
     * @param updatedDocument  The updated document to replace the old version
     * with
     */
    replace(updatedDocument) {
      const { idField, extractField } = this._options;
      const id = extractField(updatedDocument, idField);
      this.discard(id);
      this.add(updatedDocument);
    }
    /**
     * Triggers a manual vacuuming, cleaning up references to discarded documents
     * from the inverted index
     *
     * Vacuuming is only useful for applications that use the {@link
     * MiniSearch#discard} or {@link MiniSearch#replace} methods.
     *
     * By default, vacuuming is performed automatically when needed (controlled by
     * the `autoVacuum` field in {@link Options}), so there is usually no need to
     * call this method, unless one wants to make sure to perform vacuuming at a
     * specific moment.
     *
     * Vacuuming traverses all terms in the inverted index in batches, and cleans
     * up references to discarded documents from the posting list, allowing memory
     * to be released.
     *
     * The method takes an optional object as argument with the following keys:
     *
     *   - `batchSize`: the size of each batch (1000 by default)
     *
     *   - `batchWait`: the number of milliseconds to wait between batches (10 by
     *   default)
     *
     * On large indexes, vacuuming could have a non-negligible cost: batching
     * avoids blocking the thread for long, diluting this cost so that it is not
     * negatively affecting the application. Nonetheless, this method should only
     * be called when necessary, and relying on automatic vacuuming is usually
     * better.
     *
     * It returns a promise that resolves (to undefined) when the clean up is
     * completed. If vacuuming is already ongoing at the time this method is
     * called, a new one is enqueued immediately after the ongoing one, and a
     * corresponding promise is returned. However, no more than one vacuuming is
     * enqueued on top of the ongoing one, even if this method is called more
     * times (enqueuing multiple ones would be useless).
     *
     * @param options  Configuration options for the batch size and delay. See
     * {@link VacuumOptions}.
     */
    vacuum(options = {}) {
      return this.conditionalVacuum(options);
    }
    conditionalVacuum(options, conditions) {
      if (this._currentVacuum) {
        this._enqueuedVacuumConditions = this._enqueuedVacuumConditions && conditions;
        if (this._enqueuedVacuum != null) {
          return this._enqueuedVacuum;
        }
        this._enqueuedVacuum = this._currentVacuum.then(() => {
          const conditions2 = this._enqueuedVacuumConditions;
          this._enqueuedVacuumConditions = defaultVacuumConditions;
          return this.performVacuuming(options, conditions2);
        });
        return this._enqueuedVacuum;
      }
      if (this.vacuumConditionsMet(conditions) === false) {
        return Promise.resolve();
      }
      this._currentVacuum = this.performVacuuming(options);
      return this._currentVacuum;
    }
    async performVacuuming(options, conditions) {
      const initialDirtCount = this._dirtCount;
      if (this.vacuumConditionsMet(conditions)) {
        const batchSize = options.batchSize || defaultVacuumOptions.batchSize;
        const batchWait = options.batchWait || defaultVacuumOptions.batchWait;
        let i = 1;
        for (const [term, fieldsData] of this._index) {
          for (const [fieldId, fieldIndex] of fieldsData) {
            for (const [shortId] of fieldIndex) {
              if (this._documentIds.has(shortId)) {
                continue;
              }
              if (fieldIndex.size <= 1) {
                fieldsData.delete(fieldId);
              } else {
                fieldIndex.delete(shortId);
              }
            }
          }
          if (this._index.get(term).size === 0) {
            this._index.delete(term);
          }
          if (i % batchSize === 0) {
            await new Promise((resolve) => setTimeout(resolve, batchWait));
          }
          i += 1;
        }
        this._dirtCount -= initialDirtCount;
      }
      await null;
      this._currentVacuum = this._enqueuedVacuum;
      this._enqueuedVacuum = null;
    }
    vacuumConditionsMet(conditions) {
      if (conditions == null) {
        return true;
      }
      let { minDirtCount, minDirtFactor } = conditions;
      minDirtCount = minDirtCount || defaultAutoVacuumOptions.minDirtCount;
      minDirtFactor = minDirtFactor || defaultAutoVacuumOptions.minDirtFactor;
      return this.dirtCount >= minDirtCount && this.dirtFactor >= minDirtFactor;
    }
    /**
     * Is `true` if a vacuuming operation is ongoing, `false` otherwise
     */
    get isVacuuming() {
      return this._currentVacuum != null;
    }
    /**
     * The number of documents discarded since the most recent vacuuming
     */
    get dirtCount() {
      return this._dirtCount;
    }
    /**
     * A number between 0 and 1 giving an indication about the proportion of
     * documents that are discarded, and can therefore be cleaned up by vacuuming.
     * A value close to 0 means that the index is relatively clean, while a higher
     * value means that the index is relatively dirty, and vacuuming could release
     * memory.
     */
    get dirtFactor() {
      return this._dirtCount / (1 + this._documentCount + this._dirtCount);
    }
    /**
     * Returns `true` if a document with the given ID is present in the index and
     * available for search, `false` otherwise
     *
     * @param id  The document ID
     */
    has(id) {
      return this._idToShortId.has(id);
    }
    /**
     * Returns the stored fields (as configured in the `storeFields` constructor
     * option) for the given document ID. Returns `undefined` if the document is
     * not present in the index.
     *
     * @param id  The document ID
     */
    getStoredFields(id) {
      const shortId = this._idToShortId.get(id);
      if (shortId == null) {
        return void 0;
      }
      return this._storedFields.get(shortId);
    }
    /**
     * Search for documents matching the given search query.
     *
     * The result is a list of scored document IDs matching the query, sorted by
     * descending score, and each including data about which terms were matched and
     * in which fields.
     *
     * ### Basic usage:
     *
     * ```javascript
     * // Search for "zen art motorcycle" with default options: terms have to match
     * // exactly, and individual terms are joined with OR
     * miniSearch.search('zen art motorcycle')
     * // => [ { id: 2, score: 2.77258, match: { ... } }, { id: 4, score: 1.38629, match: { ... } } ]
     * ```
     *
     * ### Restrict search to specific fields:
     *
     * ```javascript
     * // Search only in the 'title' field
     * miniSearch.search('zen', { fields: ['title'] })
     * ```
     *
     * ### Field boosting:
     *
     * ```javascript
     * // Boost a field
     * miniSearch.search('zen', { boost: { title: 2 } })
     * ```
     *
     * ### Prefix search:
     *
     * ```javascript
     * // Search for "moto" with prefix search (it will match documents
     * // containing terms that start with "moto" or "neuro")
     * miniSearch.search('moto neuro', { prefix: true })
     * ```
     *
     * ### Fuzzy search:
     *
     * ```javascript
     * // Search for "ismael" with fuzzy search (it will match documents containing
     * // terms similar to "ismael", with a maximum edit distance of 0.2 term.length
     * // (rounded to nearest integer)
     * miniSearch.search('ismael', { fuzzy: 0.2 })
     * ```
     *
     * ### Combining strategies:
     *
     * ```javascript
     * // Mix of exact match, prefix search, and fuzzy search
     * miniSearch.search('ismael mob', {
     *  prefix: true,
     *  fuzzy: 0.2
     * })
     * ```
     *
     * ### Advanced prefix and fuzzy search:
     *
     * ```javascript
     * // Perform fuzzy and prefix search depending on the search term. Here
     * // performing prefix and fuzzy search only on terms longer than 3 characters
     * miniSearch.search('ismael mob', {
     *  prefix: term => term.length > 3
     *  fuzzy: term => term.length > 3 ? 0.2 : null
     * })
     * ```
     *
     * ### Combine with AND:
     *
     * ```javascript
     * // Combine search terms with AND (to match only documents that contain both
     * // "motorcycle" and "art")
     * miniSearch.search('motorcycle art', { combineWith: 'AND' })
     * ```
     *
     * ### Combine with AND_NOT:
     *
     * There is also an AND_NOT combinator, that finds documents that match the
     * first term, but do not match any of the other terms. This combinator is
     * rarely useful with simple queries, and is meant to be used with advanced
     * query combinations (see later for more details).
     *
     * ### Filtering results:
     *
     * ```javascript
     * // Filter only results in the 'fiction' category (assuming that 'category'
     * // is a stored field)
     * miniSearch.search('motorcycle art', {
     *   filter: (result) => result.category === 'fiction'
     * })
     * ```
     *
     * ### Wildcard query
     *
     * Searching for an empty string (assuming the default tokenizer) returns no
     * results. Sometimes though, one needs to match all documents, like in a
     * "wildcard" search. This is possible by passing the special value
     * {@link MiniSearch.wildcard} as the query:
     *
     * ```javascript
     * // Return search results for all documents
     * miniSearch.search(MiniSearch.wildcard)
     * ```
     *
     * Note that search options such as `filter` and `boostDocument` are still
     * applied, influencing which results are returned, and their order:
     *
     * ```javascript
     * // Return search results for all documents in the 'fiction' category
     * miniSearch.search(MiniSearch.wildcard, {
     *   filter: (result) => result.category === 'fiction'
     * })
     * ```
     *
     * ### Advanced combination of queries:
     *
     * It is possible to combine different subqueries with OR, AND, and AND_NOT,
     * and even with different search options, by passing a query expression
     * tree object as the first argument, instead of a string.
     *
     * ```javascript
     * // Search for documents that contain "zen" and ("motorcycle" or "archery")
     * miniSearch.search({
     *   combineWith: 'AND',
     *   queries: [
     *     'zen',
     *     {
     *       combineWith: 'OR',
     *       queries: ['motorcycle', 'archery']
     *     }
     *   ]
     * })
     *
     * // Search for documents that contain ("apple" or "pear") but not "juice" and
     * // not "tree"
     * miniSearch.search({
     *   combineWith: 'AND_NOT',
     *   queries: [
     *     {
     *       combineWith: 'OR',
     *       queries: ['apple', 'pear']
     *     },
     *     'juice',
     *     'tree'
     *   ]
     * })
     * ```
     *
     * Each node in the expression tree can be either a string, or an object that
     * supports all {@link SearchOptions} fields, plus a `queries` array field for
     * subqueries.
     *
     * Note that, while this can become complicated to do by hand for complex or
     * deeply nested queries, it provides a formalized expression tree API for
     * external libraries that implement a parser for custom query languages.
     *
     * @param query  Search query
     * @param searchOptions  Search options. Each option, if not given, defaults to the corresponding value of `searchOptions` given to the constructor, or to the library default.
     */
    search(query, searchOptions = {}) {
      const { searchOptions: globalSearchOptions } = this._options;
      const searchOptionsWithDefaults = { ...globalSearchOptions, ...searchOptions };
      const rawResults = this.executeQuery(query, searchOptions);
      const results = [];
      for (const [docId, { score, terms, match }] of rawResults) {
        const quality = terms.length || 1;
        const result = {
          id: this._documentIds.get(docId),
          score: score * quality,
          terms: Object.keys(match),
          queryTerms: terms,
          match
        };
        Object.assign(result, this._storedFields.get(docId));
        if (searchOptionsWithDefaults.filter == null || searchOptionsWithDefaults.filter(result)) {
          results.push(result);
        }
      }
      if (query === MiniSearch.wildcard && searchOptionsWithDefaults.boostDocument == null) {
        return results;
      }
      results.sort(byScore);
      return results;
    }
    /**
     * Provide suggestions for the given search query
     *
     * The result is a list of suggested modified search queries, derived from the
     * given search query, each with a relevance score, sorted by descending score.
     *
     * By default, it uses the same options used for search, except that by
     * default it performs prefix search on the last term of the query, and
     * combine terms with `'AND'` (requiring all query terms to match). Custom
     * options can be passed as a second argument. Defaults can be changed upon
     * calling the {@link MiniSearch} constructor, by passing a
     * `autoSuggestOptions` option.
     *
     * ### Basic usage:
     *
     * ```javascript
     * // Get suggestions for 'neuro':
     * miniSearch.autoSuggest('neuro')
     * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 0.46240 } ]
     * ```
     *
     * ### Multiple words:
     *
     * ```javascript
     * // Get suggestions for 'zen ar':
     * miniSearch.autoSuggest('zen ar')
     * // => [
     * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
     * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
     * // ]
     * ```
     *
     * ### Fuzzy suggestions:
     *
     * ```javascript
     * // Correct spelling mistakes using fuzzy search:
     * miniSearch.autoSuggest('neromancer', { fuzzy: 0.2 })
     * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 1.03998 } ]
     * ```
     *
     * ### Filtering:
     *
     * ```javascript
     * // Get suggestions for 'zen ar', but only within the 'fiction' category
     * // (assuming that 'category' is a stored field):
     * miniSearch.autoSuggest('zen ar', {
     *   filter: (result) => result.category === 'fiction'
     * })
     * // => [
     * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
     * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
     * // ]
     * ```
     *
     * @param queryString  Query string to be expanded into suggestions
     * @param options  Search options. The supported options and default values
     * are the same as for the {@link MiniSearch#search} method, except that by
     * default prefix search is performed on the last term in the query, and terms
     * are combined with `'AND'`.
     * @return  A sorted array of suggestions sorted by relevance score.
     */
    autoSuggest(queryString, options = {}) {
      options = { ...this._options.autoSuggestOptions, ...options };
      const suggestions = /* @__PURE__ */ new Map();
      for (const { score, terms } of this.search(queryString, options)) {
        const phrase = terms.join(" ");
        const suggestion = suggestions.get(phrase);
        if (suggestion != null) {
          suggestion.score += score;
          suggestion.count += 1;
        } else {
          suggestions.set(phrase, { score, terms, count: 1 });
        }
      }
      const results = [];
      for (const [suggestion, { score, terms, count }] of suggestions) {
        results.push({ suggestion, terms, score: score / count });
      }
      results.sort(byScore);
      return results;
    }
    /**
     * Total number of documents available to search
     */
    get documentCount() {
      return this._documentCount;
    }
    /**
     * Number of terms in the index
     */
    get termCount() {
      return this._index.size;
    }
    /**
     * Deserializes a JSON index (serialized with `JSON.stringify(miniSearch)`)
     * and instantiates a MiniSearch instance. It should be given the same options
     * originally used when serializing the index.
     *
     * ### Usage:
     *
     * ```javascript
     * // If the index was serialized with:
     * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
     * miniSearch.addAll(documents)
     *
     * const json = JSON.stringify(miniSearch)
     * // It can later be deserialized like this:
     * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
     * ```
     *
     * @param json  JSON-serialized index
     * @param options  configuration options, same as the constructor
     * @return An instance of MiniSearch deserialized from the given JSON.
     */
    static loadJSON(json, options) {
      if (options == null) {
        throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
      }
      return this.loadJS(JSON.parse(json), options);
    }
    /**
     * Async equivalent of {@link MiniSearch.loadJSON}
     *
     * This function is an alternative to {@link MiniSearch.loadJSON} that returns
     * a promise, and loads the index in batches, leaving pauses between them to avoid
     * blocking the main thread. It tends to be slower than the synchronous
     * version, but does not block the main thread, so it can be a better choice
     * when deserializing very large indexes.
     *
     * @param json  JSON-serialized index
     * @param options  configuration options, same as the constructor
     * @return A Promise that will resolve to an instance of MiniSearch deserialized from the given JSON.
     */
    static async loadJSONAsync(json, options) {
      if (options == null) {
        throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
      }
      return this.loadJSAsync(JSON.parse(json), options);
    }
    /**
     * Returns the default value of an option. It will throw an error if no option
     * with the given name exists.
     *
     * @param optionName  Name of the option
     * @return The default value of the given option
     *
     * ### Usage:
     *
     * ```javascript
     * // Get default tokenizer
     * MiniSearch.getDefault('tokenize')
     *
     * // Get default term processor
     * MiniSearch.getDefault('processTerm')
     *
     * // Unknown options will throw an error
     * MiniSearch.getDefault('notExisting')
     * // => throws 'MiniSearch: unknown option "notExisting"'
     * ```
     */
    static getDefault(optionName) {
      if (defaultOptions.hasOwnProperty(optionName)) {
        return getOwnProperty(defaultOptions, optionName);
      } else {
        throw new Error(`MiniSearch: unknown option "${optionName}"`);
      }
    }
    /**
     * @ignore
     */
    static loadJS(js, options) {
      const { index, documentIds, fieldLength, storedFields, serializationVersion } = js;
      const miniSearch = this.instantiateMiniSearch(js, options);
      miniSearch._documentIds = objectToNumericMap(documentIds);
      miniSearch._fieldLength = objectToNumericMap(fieldLength);
      miniSearch._storedFields = objectToNumericMap(storedFields);
      for (const [shortId, id] of miniSearch._documentIds) {
        miniSearch._idToShortId.set(id, shortId);
      }
      for (const [term, data] of index) {
        const dataMap = /* @__PURE__ */ new Map();
        for (const fieldId of Object.keys(data)) {
          let indexEntry = data[fieldId];
          if (serializationVersion === 1) {
            indexEntry = indexEntry.ds;
          }
          dataMap.set(parseInt(fieldId, 10), objectToNumericMap(indexEntry));
        }
        miniSearch._index.set(term, dataMap);
      }
      return miniSearch;
    }
    /**
     * @ignore
     */
    static async loadJSAsync(js, options) {
      const { index, documentIds, fieldLength, storedFields, serializationVersion } = js;
      const miniSearch = this.instantiateMiniSearch(js, options);
      miniSearch._documentIds = await objectToNumericMapAsync(documentIds);
      miniSearch._fieldLength = await objectToNumericMapAsync(fieldLength);
      miniSearch._storedFields = await objectToNumericMapAsync(storedFields);
      for (const [shortId, id] of miniSearch._documentIds) {
        miniSearch._idToShortId.set(id, shortId);
      }
      let count = 0;
      for (const [term, data] of index) {
        const dataMap = /* @__PURE__ */ new Map();
        for (const fieldId of Object.keys(data)) {
          let indexEntry = data[fieldId];
          if (serializationVersion === 1) {
            indexEntry = indexEntry.ds;
          }
          dataMap.set(parseInt(fieldId, 10), await objectToNumericMapAsync(indexEntry));
        }
        if (++count % 1e3 === 0)
          await wait(0);
        miniSearch._index.set(term, dataMap);
      }
      return miniSearch;
    }
    /**
     * @ignore
     */
    static instantiateMiniSearch(js, options) {
      const { documentCount, nextId, fieldIds, averageFieldLength, dirtCount, serializationVersion } = js;
      if (serializationVersion !== 1 && serializationVersion !== 2) {
        throw new Error("MiniSearch: cannot deserialize an index created with an incompatible version");
      }
      const miniSearch = new MiniSearch(options);
      miniSearch._documentCount = documentCount;
      miniSearch._nextId = nextId;
      miniSearch._idToShortId = /* @__PURE__ */ new Map();
      miniSearch._fieldIds = fieldIds;
      miniSearch._avgFieldLength = averageFieldLength;
      miniSearch._dirtCount = dirtCount || 0;
      miniSearch._index = new SearchableMap();
      return miniSearch;
    }
    /**
     * @ignore
     */
    executeQuery(query, searchOptions = {}) {
      if (query === MiniSearch.wildcard) {
        return this.executeWildcardQuery(searchOptions);
      }
      if (typeof query !== "string") {
        const options2 = { ...searchOptions, ...query, queries: void 0 };
        const results2 = query.queries.map((subquery) => this.executeQuery(subquery, options2));
        return this.combineResults(results2, options2.combineWith);
      }
      const { tokenize, processTerm, searchOptions: globalSearchOptions } = this._options;
      const options = { tokenize, processTerm, ...globalSearchOptions, ...searchOptions };
      const { tokenize: searchTokenize, processTerm: searchProcessTerm } = options;
      const terms = searchTokenize(query).flatMap((term) => searchProcessTerm(term)).filter((term) => !!term);
      const queries = terms.map(termToQuerySpec(options));
      const results = queries.map((query2) => this.executeQuerySpec(query2, options));
      return this.combineResults(results, options.combineWith);
    }
    /**
     * @ignore
     */
    executeQuerySpec(query, searchOptions) {
      const options = { ...this._options.searchOptions, ...searchOptions };
      const boosts = (options.fields || this._options.fields).reduce((boosts2, field) => ({ ...boosts2, [field]: getOwnProperty(options.boost, field) || 1 }), {});
      const { boostDocument, weights, maxFuzzy, bm25: bm25params } = options;
      const { fuzzy: fuzzyWeight, prefix: prefixWeight } = { ...defaultSearchOptions.weights, ...weights };
      const data = this._index.get(query.term);
      const results = this.termResults(query.term, query.term, 1, query.termBoost, data, boosts, boostDocument, bm25params);
      let prefixMatches;
      let fuzzyMatches;
      if (query.prefix) {
        prefixMatches = this._index.atPrefix(query.term);
      }
      if (query.fuzzy) {
        const fuzzy = query.fuzzy === true ? 0.2 : query.fuzzy;
        const maxDistance = fuzzy < 1 ? Math.min(maxFuzzy, Math.round(query.term.length * fuzzy)) : fuzzy;
        if (maxDistance)
          fuzzyMatches = this._index.fuzzyGet(query.term, maxDistance);
      }
      if (prefixMatches) {
        for (const [term, data2] of prefixMatches) {
          const distance = term.length - query.term.length;
          if (!distance) {
            continue;
          }
          fuzzyMatches === null || fuzzyMatches === void 0 ? void 0 : fuzzyMatches.delete(term);
          const weight = prefixWeight * term.length / (term.length + 0.3 * distance);
          this.termResults(query.term, term, weight, query.termBoost, data2, boosts, boostDocument, bm25params, results);
        }
      }
      if (fuzzyMatches) {
        for (const term of fuzzyMatches.keys()) {
          const [data2, distance] = fuzzyMatches.get(term);
          if (!distance) {
            continue;
          }
          const weight = fuzzyWeight * term.length / (term.length + distance);
          this.termResults(query.term, term, weight, query.termBoost, data2, boosts, boostDocument, bm25params, results);
        }
      }
      return results;
    }
    /**
     * @ignore
     */
    executeWildcardQuery(searchOptions) {
      const results = /* @__PURE__ */ new Map();
      const options = { ...this._options.searchOptions, ...searchOptions };
      for (const [shortId, id] of this._documentIds) {
        const score = options.boostDocument ? options.boostDocument(id, "", this._storedFields.get(shortId)) : 1;
        results.set(shortId, {
          score,
          terms: [],
          match: {}
        });
      }
      return results;
    }
    /**
     * @ignore
     */
    combineResults(results, combineWith = OR) {
      if (results.length === 0) {
        return /* @__PURE__ */ new Map();
      }
      const operator = combineWith.toLowerCase();
      const combinator = combinators[operator];
      if (!combinator) {
        throw new Error(`Invalid combination operator: ${combineWith}`);
      }
      return results.reduce(combinator) || /* @__PURE__ */ new Map();
    }
    /**
     * Allows serialization of the index to JSON, to possibly store it and later
     * deserialize it with {@link MiniSearch.loadJSON}.
     *
     * Normally one does not directly call this method, but rather call the
     * standard JavaScript `JSON.stringify()` passing the {@link MiniSearch}
     * instance, and JavaScript will internally call this method. Upon
     * deserialization, one must pass to {@link MiniSearch.loadJSON} the same
     * options used to create the original instance that was serialized.
     *
     * ### Usage:
     *
     * ```javascript
     * // Serialize the index:
     * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
     * miniSearch.addAll(documents)
     * const json = JSON.stringify(miniSearch)
     *
     * // Later, to deserialize it:
     * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
     * ```
     *
     * @return A plain-object serializable representation of the search index.
     */
    toJSON() {
      const index = [];
      for (const [term, fieldIndex] of this._index) {
        const data = {};
        for (const [fieldId, freqs] of fieldIndex) {
          data[fieldId] = Object.fromEntries(freqs);
        }
        index.push([term, data]);
      }
      return {
        documentCount: this._documentCount,
        nextId: this._nextId,
        documentIds: Object.fromEntries(this._documentIds),
        fieldIds: this._fieldIds,
        fieldLength: Object.fromEntries(this._fieldLength),
        averageFieldLength: this._avgFieldLength,
        storedFields: Object.fromEntries(this._storedFields),
        dirtCount: this._dirtCount,
        index,
        serializationVersion: 2
      };
    }
    /**
     * @ignore
     */
    termResults(sourceTerm, derivedTerm, termWeight, termBoost, fieldTermData, fieldBoosts, boostDocumentFn, bm25params, results = /* @__PURE__ */ new Map()) {
      if (fieldTermData == null)
        return results;
      for (const field of Object.keys(fieldBoosts)) {
        const fieldBoost = fieldBoosts[field];
        const fieldId = this._fieldIds[field];
        const fieldTermFreqs = fieldTermData.get(fieldId);
        if (fieldTermFreqs == null)
          continue;
        let matchingFields = fieldTermFreqs.size;
        const avgFieldLength = this._avgFieldLength[fieldId];
        for (const docId of fieldTermFreqs.keys()) {
          if (!this._documentIds.has(docId)) {
            this.removeTerm(fieldId, docId, derivedTerm);
            matchingFields -= 1;
            continue;
          }
          const docBoost = boostDocumentFn ? boostDocumentFn(this._documentIds.get(docId), derivedTerm, this._storedFields.get(docId)) : 1;
          if (!docBoost)
            continue;
          const termFreq = fieldTermFreqs.get(docId);
          const fieldLength = this._fieldLength.get(docId)[fieldId];
          const rawScore = calcBM25Score(termFreq, matchingFields, this._documentCount, fieldLength, avgFieldLength, bm25params);
          const weightedScore = termWeight * termBoost * fieldBoost * docBoost * rawScore;
          const result = results.get(docId);
          if (result) {
            result.score += weightedScore;
            assignUniqueTerm(result.terms, sourceTerm);
            const match = getOwnProperty(result.match, derivedTerm);
            if (match) {
              match.push(field);
            } else {
              result.match[derivedTerm] = [field];
            }
          } else {
            results.set(docId, {
              score: weightedScore,
              terms: [sourceTerm],
              match: { [derivedTerm]: [field] }
            });
          }
        }
      }
      return results;
    }
    /**
     * @ignore
     */
    addTerm(fieldId, documentId, term) {
      const indexData = this._index.fetch(term, createMap);
      let fieldIndex = indexData.get(fieldId);
      if (fieldIndex == null) {
        fieldIndex = /* @__PURE__ */ new Map();
        fieldIndex.set(documentId, 1);
        indexData.set(fieldId, fieldIndex);
      } else {
        const docs = fieldIndex.get(documentId);
        fieldIndex.set(documentId, (docs || 0) + 1);
      }
    }
    /**
     * @ignore
     */
    removeTerm(fieldId, documentId, term) {
      if (!this._index.has(term)) {
        this.warnDocumentChanged(documentId, fieldId, term);
        return;
      }
      const indexData = this._index.fetch(term, createMap);
      const fieldIndex = indexData.get(fieldId);
      if (fieldIndex == null || fieldIndex.get(documentId) == null) {
        this.warnDocumentChanged(documentId, fieldId, term);
      } else if (fieldIndex.get(documentId) <= 1) {
        if (fieldIndex.size <= 1) {
          indexData.delete(fieldId);
        } else {
          fieldIndex.delete(documentId);
        }
      } else {
        fieldIndex.set(documentId, fieldIndex.get(documentId) - 1);
      }
      if (this._index.get(term).size === 0) {
        this._index.delete(term);
      }
    }
    /**
     * @ignore
     */
    warnDocumentChanged(shortDocumentId, fieldId, term) {
      for (const fieldName of Object.keys(this._fieldIds)) {
        if (this._fieldIds[fieldName] === fieldId) {
          this._options.logger("warn", `MiniSearch: document with ID ${this._documentIds.get(shortDocumentId)} has changed before removal: term "${term}" was not present in field "${fieldName}". Removing a document after it has changed can corrupt the index!`, "version_conflict");
          return;
        }
      }
    }
    /**
     * @ignore
     */
    addDocumentId(documentId) {
      const shortDocumentId = this._nextId;
      this._idToShortId.set(documentId, shortDocumentId);
      this._documentIds.set(shortDocumentId, documentId);
      this._documentCount += 1;
      this._nextId += 1;
      return shortDocumentId;
    }
    /**
     * @ignore
     */
    addFields(fields) {
      for (let i = 0; i < fields.length; i++) {
        this._fieldIds[fields[i]] = i;
      }
    }
    /**
     * @ignore
     */
    addFieldLength(documentId, fieldId, count, length) {
      let fieldLengths = this._fieldLength.get(documentId);
      if (fieldLengths == null)
        this._fieldLength.set(documentId, fieldLengths = []);
      fieldLengths[fieldId] = length;
      const averageFieldLength = this._avgFieldLength[fieldId] || 0;
      const totalFieldLength = averageFieldLength * count + length;
      this._avgFieldLength[fieldId] = totalFieldLength / (count + 1);
    }
    /**
     * @ignore
     */
    removeFieldLength(documentId, fieldId, count, length) {
      if (count === 1) {
        this._avgFieldLength[fieldId] = 0;
        return;
      }
      const totalFieldLength = this._avgFieldLength[fieldId] * count - length;
      this._avgFieldLength[fieldId] = totalFieldLength / (count - 1);
    }
    /**
     * @ignore
     */
    saveStoredFields(documentId, doc) {
      const { storeFields, extractField } = this._options;
      if (storeFields == null || storeFields.length === 0) {
        return;
      }
      let documentFields = this._storedFields.get(documentId);
      if (documentFields == null)
        this._storedFields.set(documentId, documentFields = {});
      for (const fieldName of storeFields) {
        const fieldValue = extractField(doc, fieldName);
        if (fieldValue !== void 0)
          documentFields[fieldName] = fieldValue;
      }
    }
  }
  MiniSearch.wildcard = Symbol("*");
  const getOwnProperty = (object2, property) => Object.prototype.hasOwnProperty.call(object2, property) ? object2[property] : void 0;
  const combinators = {
    [OR]: (a, b) => {
      for (const docId of b.keys()) {
        const existing = a.get(docId);
        if (existing == null) {
          a.set(docId, b.get(docId));
        } else {
          const { score, terms, match } = b.get(docId);
          existing.score = existing.score + score;
          existing.match = Object.assign(existing.match, match);
          assignUniqueTerms(existing.terms, terms);
        }
      }
      return a;
    },
    [AND]: (a, b) => {
      const combined = /* @__PURE__ */ new Map();
      for (const docId of b.keys()) {
        const existing = a.get(docId);
        if (existing == null)
          continue;
        const { score, terms, match } = b.get(docId);
        assignUniqueTerms(existing.terms, terms);
        combined.set(docId, {
          score: existing.score + score,
          terms: existing.terms,
          match: Object.assign(existing.match, match)
        });
      }
      return combined;
    },
    [AND_NOT]: (a, b) => {
      for (const docId of b.keys())
        a.delete(docId);
      return a;
    }
  };
  const defaultBM25params = { k: 1.2, b: 0.7, d: 0.5 };
  const calcBM25Score = (termFreq, matchingCount, totalCount, fieldLength, avgFieldLength, bm25params) => {
    const { k: k2, b, d } = bm25params;
    const invDocFreq = Math.log(1 + (totalCount - matchingCount + 0.5) / (matchingCount + 0.5));
    return invDocFreq * (d + termFreq * (k2 + 1) / (termFreq + k2 * (1 - b + b * fieldLength / avgFieldLength)));
  };
  const termToQuerySpec = (options) => (term, i, terms) => {
    const fuzzy = typeof options.fuzzy === "function" ? options.fuzzy(term, i, terms) : options.fuzzy || false;
    const prefix = typeof options.prefix === "function" ? options.prefix(term, i, terms) : options.prefix === true;
    const termBoost = typeof options.boostTerm === "function" ? options.boostTerm(term, i, terms) : 1;
    return { term, fuzzy, prefix, termBoost };
  };
  const defaultOptions = {
    idField: "id",
    extractField: (document2, fieldName) => document2[fieldName],
    stringifyField: (fieldValue, fieldName) => fieldValue.toString(),
    tokenize: (text) => text.split(SPACE_OR_PUNCTUATION),
    processTerm: (term) => term.toLowerCase(),
    fields: void 0,
    searchOptions: void 0,
    storeFields: [],
    logger: (level, message) => {
      if (typeof (console === null || console === void 0 ? void 0 : console[level]) === "function")
        console[level](message);
    },
    autoVacuum: true
  };
  const defaultSearchOptions = {
    combineWith: OR,
    prefix: false,
    fuzzy: false,
    maxFuzzy: 6,
    boost: {},
    weights: { fuzzy: 0.45, prefix: 0.375 },
    bm25: defaultBM25params
  };
  const defaultAutoSuggestOptions = {
    combineWith: AND,
    prefix: (term, i, terms) => i === terms.length - 1
  };
  const defaultVacuumOptions = { batchSize: 1e3, batchWait: 10 };
  const defaultVacuumConditions = { minDirtFactor: 0.1, minDirtCount: 20 };
  const defaultAutoVacuumOptions = { ...defaultVacuumOptions, ...defaultVacuumConditions };
  const assignUniqueTerm = (target, term) => {
    if (!target.includes(term))
      target.push(term);
  };
  const assignUniqueTerms = (target, source) => {
    for (const term of source) {
      if (!target.includes(term))
        target.push(term);
    }
  };
  const byScore = ({ score: a }, { score: b }) => b - a;
  const createMap = () => /* @__PURE__ */ new Map();
  const objectToNumericMap = (object2) => {
    const map = /* @__PURE__ */ new Map();
    for (const key of Object.keys(object2)) {
      map.set(parseInt(key, 10), object2[key]);
    }
    return map;
  };
  const objectToNumericMapAsync = async (object2) => {
    const map = /* @__PURE__ */ new Map();
    let count = 0;
    for (const key of Object.keys(object2)) {
      map.set(parseInt(key, 10), object2[key]);
      if (++count % 1e3 === 0) {
        await wait(0);
      }
    }
    return map;
  };
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]+/u;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var Symbol$1 = root.Symbol;
  var objectProto$4 = Object.prototype;
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$4.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
  var objectProto$3 = Object.prototype;
  var nativeObjectToString = objectProto$3.toString;
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
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
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
  var funcProto = Function.prototype, objectProto$2 = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  function getValue(object2, key) {
    return object2 == null ? void 0 : object2[key];
  }
  function getNative(object2, key) {
    var value = getValue(object2, key);
    return baseIsNative(value) ? value : void 0;
  }
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
  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED$1 ? void 0 : result;
    }
    return hasOwnProperty$1.call(data, key) ? data[key] : void 0;
  }
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
  }
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
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
  function eq(value, other) {
    return value === other || value !== value && other !== other;
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
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
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
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;
  var WasmURL = "/assets/rlottie-wasm-DRLgx-s6.wasm";
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
  }, _o = new WeakMap(), __privateAdd(_a, _o, false), _a), U = (_d2 = class {
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
      __privateAdd(this, _d);
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
        k(D) && (j.add(D), P("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", D, _d2));
      }
    }
    get perf() {
      return __privateGet(this, _m);
    }
    static unsafeExposeInternals(e) {
      return { starts: __privateGet(e, _F), ttls: __privateGet(e, _d), autopurgeTimers: __privateGet(e, _g), sizes: __privateGet(e, __), keyMap: __privateGet(e, _s), keyList: __privateGet(e, _i), valList: __privateGet(e, _t), next: __privateGet(e, _l), prev: __privateGet(e, _u), get head() {
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
      if (__privateGet(this, _d) && __privateGet(this, _F)) {
        let o = __privateGet(this, _d)[t], l = __privateGet(this, _F)[t];
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
        if (__privateGet(this, _d) && __privateGet(this, _F)) {
          o.ttl = __privateGet(this, _d)[t];
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
  }, _o2 = new WeakMap(), _c2 = new WeakMap(), _S = new WeakMap(), _O = new WeakMap(), _w = new WeakMap(), _M = new WeakMap(), _I = new WeakMap(), _m = new WeakMap(), _n = new WeakMap(), _b2 = new WeakMap(), _s = new WeakMap(), _i = new WeakMap(), _t = new WeakMap(), _l = new WeakMap(), _u = new WeakMap(), _a2 = new WeakMap(), _h = new WeakMap(), _y = new WeakMap(), _r = new WeakMap(), __ = new WeakMap(), _F = new WeakMap(), _d = new WeakMap(), _g = new WeakMap(), _T = new WeakMap(), _U = new WeakMap(), _f = new WeakMap(), _D = new WeakMap(), _d_instances = new WeakSet(), k_fn = function() {
    let e = new O(__privateGet(this, _o2)), t = new O(__privateGet(this, _o2));
    __privateSet(this, _d, e), __privateSet(this, _F, t);
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
    if (n !== 0 && !__privateGet(this, _d) && __privateMethod(this, _d_instances, k_fn).call(this), __privateGet(this, _d) && (m || __privateGet(this, _H).call(this, u, n, o), r && __privateGet(this, _v).call(this, r, u)), !l && __privateGet(this, _f) && __privateGet(this, _r)) {
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
    if (__privateGet(this, _s).clear(), __privateGet(this, _t).fill(void 0), __privateGet(this, _i).fill(void 0), __privateGet(this, _d) && __privateGet(this, _F)) {
      __privateGet(this, _d).fill(0), __privateGet(this, _F).fill(0);
      for (let t of __privateGet(this, _g) ?? []) t !== void 0 && clearTimeout(t);
      __privateGet(this, _g)?.fill(void 0);
    }
    if (__privateGet(this, __) && __privateGet(this, __).fill(0), __privateSet(this, _a2, 0), __privateSet(this, _h, 0), __privateGet(this, _y).length = 0, __privateSet(this, _b2, 0), __privateSet(this, _n, 0), __privateGet(this, _f) && __privateGet(this, _r)) {
      let t = __privateGet(this, _r), i;
      for (; i = t?.shift(); ) (_b3 = __privateGet(this, _w)) == null ? void 0 : _b3.call(this, ...i);
    }
  }, _d2);
  const rLottieCache = new U({
    max: 5,
    dispose(lottie) {
      lottie.delete();
    }
  });
  let RlottieWasm;
  async function _loadRlottie() {
    {
      const { default: factory } = await Promise.resolve().then(function() {
        return rlottieWasm;
      });
      const Module2 = await factory({
        locateFile() {
          return WasmURL;
        }
      });
      RlottieWasm = Module2.RlottieWasm;
    }
    console.info("RlottieWasm loaded!");
    return true;
  }
  let loaded$1 = null;
  function loadRlottie() {
    if (loaded$1) return loaded$1;
    return loaded$1 = _loadRlottie();
  }
  function isCached(id) {
    const has = rLottieCache.get(id);
    return has ? has.frames() : false;
  }
  async function loadAnimation(id, data) {
    console.info("Loading Rlottie " + id);
    const instance = new RlottieWasm();
    instance.load(data);
    rLottieCache.set(id, instance);
    return instance.frames();
  }
  function requestFrame(id, frame, width, height) {
    const instance = rLottieCache.get(id);
    if (!instance) throw new Error("sticker does not exist!");
    const buffer = instance.render(frame, width, height);
    const result = Uint8ClampedArray.from(buffer);
    return transfer(result, [result.buffer]);
  }
  var rlottie = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    isCached,
    loadAnimation,
    loadRlottie,
    requestFrame
  });
  let asm;
  async function _loadLibWebp() {
    {
      asm = null;
    }
    console.info("libwebp loaded!");
    return true;
  }
  let loaded = null;
  function loadLibWebp() {
    if (loaded) return loaded;
    return loaded = _loadLibWebp();
  }
  function getUint8Memory() {
    return asm.HEAPU8;
  }
  const MAX_MEMORY = 16777216;
  function getAvailableMemory() {
    return MAX_MEMORY - asm._getUsedMemory();
  }
  async function webp(buff, width, height) {
    await loadLibWebp();
    if (buff.length + width * height * 4 > getAvailableMemory()) {
      console.error("WEBP CONVERSION FAILED BECAUSE NOT ENOUGH MEMORY");
      return null;
    }
    const buffPointer = asm._malloc(buff.length);
    const mem = getUint8Memory();
    mem.set(buff, buffPointer);
    const decodedPtr = asm._webp_decode(buffPointer, buff.length);
    if (!decodedPtr) {
      asm._free(buffPointer);
      return null;
    }
    width = asm._webp_getWidth();
    height = asm._webp_getHeight();
    const rgba = new Uint8ClampedArray(mem.slice(decodedPtr, decodedPtr + width * height * 4).buffer);
    asm._webp_free(decodedPtr);
    asm._free(buffPointer);
    return {
      rgba,
      width,
      height
    };
  }
  const freeze = Object.freeze;
  function object(a) {
    const empty = /* @__PURE__ */ Object.create(null);
    Object.assign(empty, a);
    return freeze(empty);
  }
  const SUPPORTED_VARIATIONS = freeze([
    "1F3FB",
    "1F3FC",
    "1F3FD",
    "1F3FE",
    "1F3FF"
    /* Dark */
  ]);
  function fromCodePoint(codepoint) {
    var code = typeof codepoint === "string" ? parseInt(codepoint, 16) : codepoint;
    if (code < 65536) {
      return String.fromCharCode(code);
    }
    code -= 65536;
    return String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
  }
  const categories = object({
    Symbols: 7,
    Activities: 5,
    Flags: 8,
    "Travel & Places": 4,
    "Food & Drink": 3,
    "Animals & Nature": 2,
    "People & Body": 1,
    Objects: 6,
    Component: 9,
    "Smileys & Emotion": 0
    /* Smileys */
  });
  function unifiedString(str) {
    return str.split("-").map(fromCodePoint).join("");
  }
  const searcher = new MiniSearch({
    fields: ["tags", "short_names_string"]
  });
  let _emojis = null;
  function initEmojis() {
    if (_emojis) return _emojis;
    return _emojis = (async () => {
      const rawEmojis = await fetch(emoji_data).then((resp) => resp.json());
      const emojis = rawEmojis.map((emoji, index) => {
        const final = {};
        const vars = emoji.skin_variations ? Object.keys(emoji.skin_variations).filter((v) => SUPPORTED_VARIATIONS.includes(v)) : [];
        if (vars.length && emoji.skin_variations) {
          const variation = /* @__PURE__ */ Object.create(null);
          for (const v of vars) {
            variation[v] = unifiedString(emoji.skin_variations[v].unified);
          }
          final.variation = variation;
        }
        final.$ = unifiedString(emoji.unified);
        final.sort_order = emoji.sort_order;
        final.category = categories[emoji.category];
        final.id = index;
        final.short_names = new Set(emoji.short_names || []);
        final.short_names_string = emoji.short_names?.join(" ") || "";
        final.name = emoji.name.toLowerCase();
        final.tags = [final.$, final.name].concat(emoji.short_names || []).join(" ");
        return final;
      });
      return emojis;
    })();
  }
  let _initSearch = null;
  function initSearch() {
    if (_initSearch) return _initSearch;
    return _initSearch = (async () => {
      const _emojis2 = await initEmojis();
      await searcher.addAllAsync(_emojis2);
      return _emojis2;
    })();
  }
  async function preloadSearch() {
    await initSearch();
  }
  const findByShortCode = memoize(async (shortcode) => {
    const emojis = await initSearch();
    return searcher.search(shortcode.toLowerCase(), {
      prefix: true,
      fields: ["short_names_string"]
    }).map((a) => emojis[a.id]).find((emoji) => emoji.short_names.has(shortcode));
  });
  const fuzzySearch = memoize(async (query) => {
    const emojis = await initSearch();
    return searcher.search(query.toLowerCase(), {
      prefix: true,
      fields: ["tags"]
    }).map((a) => emojis[a.id]);
  });
  const exposed = {
    findByShortCode,
    fuzzySearch,
    preloadSearch,
    webp,
    ...rlottie
  };
  expose(exposed);
  var module$1 = { exports: {} };
  var exports$1 = module$1.exports;
  var Module = (() => {
    var _scriptName = typeof document != "undefined" ? document.currentScript?.src : void 0;
    return (async function(moduleArg = {}) {
      var moduleRtn;
      var Module2 = moduleArg;
      var readyPromiseResolve, readyPromiseReject;
      var readyPromise = new Promise((resolve, reject) => {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      var ENVIRONMENT_IS_WEB = typeof window == "object";
      var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";
      typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
      var moduleOverrides = Object.assign({}, Module2);
      var thisProgram = "./this.program";
      var quit_ = (status, toThrow) => {
        throw toThrow;
      };
      var scriptDirectory = "";
      function locateFile(path) {
        if (Module2["locateFile"]) {
          return Module2["locateFile"](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }
      var readAsync, readBinary;
      if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href;
        } else if (typeof document != "undefined" && document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }
        if (_scriptName) {
          scriptDirectory = _scriptName;
        }
        if (scriptDirectory.startsWith("blob:")) {
          scriptDirectory = "";
        } else {
          scriptDirectory = scriptDirectory.slice(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
        }
        {
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            };
          }
          readAsync = async (url) => {
            var response = await fetch(url, { credentials: "same-origin" });
            if (response.ok) {
              return response.arrayBuffer();
            }
            throw new Error(response.status + " : " + response.url);
          };
        }
      }
      var out = Module2["print"] || console.log.bind(console);
      var err = Module2["printErr"] || console.error.bind(console);
      Object.assign(Module2, moduleOverrides);
      moduleOverrides = null;
      if (Module2["arguments"]) Module2["arguments"];
      if (Module2["thisProgram"]) thisProgram = Module2["thisProgram"];
      var wasmBinary = Module2["wasmBinary"];
      var wasmMemory;
      var ABORT = false;
      var EXITSTATUS;
      var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAP64, HEAPU64, HEAPF64;
      function updateMemoryViews() {
        var b = wasmMemory.buffer;
        Module2["HEAP8"] = HEAP8 = new Int8Array(b);
        Module2["HEAP16"] = HEAP16 = new Int16Array(b);
        Module2["HEAPU8"] = HEAPU8 = new Uint8Array(b);
        Module2["HEAPU16"] = HEAPU16 = new Uint16Array(b);
        Module2["HEAP32"] = HEAP32 = new Int32Array(b);
        Module2["HEAPU32"] = HEAPU32 = new Uint32Array(b);
        Module2["HEAPF32"] = HEAPF32 = new Float32Array(b);
        Module2["HEAPF64"] = HEAPF64 = new Float64Array(b);
        Module2["HEAP64"] = HEAP64 = new BigInt64Array(b);
        Module2["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
      }
      function preRun() {
        if (Module2["preRun"]) {
          if (typeof Module2["preRun"] == "function") Module2["preRun"] = [Module2["preRun"]];
          while (Module2["preRun"].length) {
            addOnPreRun(Module2["preRun"].shift());
          }
        }
        callRuntimeCallbacks(onPreRuns);
      }
      function initRuntime() {
        wasmExports["L"]();
      }
      function postRun() {
        if (Module2["postRun"]) {
          if (typeof Module2["postRun"] == "function") Module2["postRun"] = [Module2["postRun"]];
          while (Module2["postRun"].length) {
            addOnPostRun(Module2["postRun"].shift());
          }
        }
        callRuntimeCallbacks(onPostRuns);
      }
      var runDependencies = 0;
      var dependenciesFulfilled = null;
      function addRunDependency(id) {
        runDependencies++;
        Module2["monitorRunDependencies"]?.(runDependencies);
      }
      function removeRunDependency(id) {
        runDependencies--;
        Module2["monitorRunDependencies"]?.(runDependencies);
        if (runDependencies == 0) {
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      function abort(what) {
        Module2["onAbort"]?.(what);
        what = "Aborted(" + what + ")";
        err(what);
        ABORT = true;
        what += ". Build with -sASSERTIONS for more info.";
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }
      var wasmBinaryFile;
      function findWasmBinary() {
        return locateFile("rlottie-wasm.wasm");
      }
      function getBinarySync(file) {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        }
        throw "both async and sync fetching of the wasm failed";
      }
      async function getWasmBinary(binaryFile) {
        if (!wasmBinary) {
          try {
            var response = await readAsync(binaryFile);
            return new Uint8Array(response);
          } catch {
          }
        }
        return getBinarySync(binaryFile);
      }
      async function instantiateArrayBuffer(binaryFile, imports) {
        try {
          var binary = await getWasmBinary(binaryFile);
          var instance = await WebAssembly.instantiate(binary, imports);
          return instance;
        } catch (reason) {
          err(`failed to asynchronously prepare wasm: ${reason}`);
          abort(reason);
        }
      }
      async function instantiateAsync(binary, binaryFile, imports) {
        if (!binary && typeof WebAssembly.instantiateStreaming == "function") {
          try {
            var response = fetch(binaryFile, { credentials: "same-origin" });
            var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
            return instantiationResult;
          } catch (reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err("falling back to ArrayBuffer instantiation");
          }
        }
        return instantiateArrayBuffer(binaryFile, imports);
      }
      function getWasmImports() {
        return { a: wasmImports };
      }
      async function createWasm() {
        function receiveInstance(instance, module) {
          wasmExports = instance.exports;
          wasmMemory = wasmExports["K"];
          updateMemoryViews();
          wasmTable = wasmExports["P"];
          removeRunDependency();
          return wasmExports;
        }
        addRunDependency();
        function receiveInstantiationResult(result2) {
          return receiveInstance(result2["instance"]);
        }
        var info = getWasmImports();
        if (Module2["instantiateWasm"]) {
          return new Promise((resolve, reject) => {
            Module2["instantiateWasm"](info, (mod, inst) => {
              receiveInstance(mod);
              resolve(mod.exports);
            });
          });
        }
        wasmBinaryFile ?? (wasmBinaryFile = findWasmBinary());
        try {
          var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
          var exports = receiveInstantiationResult(result);
          return exports;
        } catch (e) {
          readyPromiseReject(e);
          return Promise.reject(e);
        }
      }
      class ExitStatus {
        constructor(status) {
          __publicField(this, "name", "ExitStatus");
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
      }
      var callRuntimeCallbacks = (callbacks) => {
        while (callbacks.length > 0) {
          callbacks.shift()(Module2);
        }
      };
      var onPostRuns = [];
      var addOnPostRun = (cb) => onPostRuns.unshift(cb);
      var onPreRuns = [];
      var addOnPreRun = (cb) => onPreRuns.unshift(cb);
      var noExitRuntime = Module2["noExitRuntime"] || true;
      var stackRestore = (val) => __emscripten_stack_restore(val);
      var stackSave = () => _emscripten_stack_get_current();
      var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : void 0;
      var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
          return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
        }
        var str = "";
        while (idx < endPtr) {
          var u0 = heapOrArray[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heapOrArray[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }
          var u2 = heapOrArray[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
        return str;
      };
      var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
      var ___assert_fail = (condition, filename, line, func) => abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
      class ExceptionInfo {
        constructor(excPtr) {
          this.excPtr = excPtr;
          this.ptr = excPtr - 24;
        }
        set_type(type) {
          HEAPU32[this.ptr + 4 >> 2] = type;
        }
        get_type() {
          return HEAPU32[this.ptr + 4 >> 2];
        }
        set_destructor(destructor) {
          HEAPU32[this.ptr + 8 >> 2] = destructor;
        }
        get_destructor() {
          return HEAPU32[this.ptr + 8 >> 2];
        }
        set_caught(caught) {
          caught = caught ? 1 : 0;
          HEAP8[this.ptr + 12] = caught;
        }
        get_caught() {
          return HEAP8[this.ptr + 12] != 0;
        }
        set_rethrown(rethrown) {
          rethrown = rethrown ? 1 : 0;
          HEAP8[this.ptr + 13] = rethrown;
        }
        get_rethrown() {
          return HEAP8[this.ptr + 13] != 0;
        }
        init(type, destructor) {
          this.set_adjusted_ptr(0);
          this.set_type(type);
          this.set_destructor(destructor);
        }
        set_adjusted_ptr(adjustedPtr) {
          HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
        }
        get_adjusted_ptr() {
          return HEAPU32[this.ptr + 16 >> 2];
        }
      }
      var exceptionLast = 0;
      var ___cxa_throw = (ptr, type, destructor) => {
        var info = new ExceptionInfo(ptr);
        info.init(type, destructor);
        exceptionLast = ptr;
        throw exceptionLast;
      };
      function ___syscall_ioctl(fd, op, varargs) {
        return 0;
      }
      function ___syscall_openat(dirfd, path, flags, varargs) {
      }
      var __abort_js = () => abort("");
      var embindRepr = (v) => {
        if (v === null) {
          return "null";
        }
        var t = typeof v;
        if (t === "object" || t === "array" || t === "function") {
          return v.toString();
        } else {
          return "" + v;
        }
      };
      var embind_init_charCodes = () => {
        var codes = new Array(256);
        for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
        }
        embind_charCodes = codes;
      };
      var embind_charCodes;
      var readLatin1String = (ptr) => {
        var ret = "";
        var c = ptr;
        while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
        }
        return ret;
      };
      var awaitingDependencies = {};
      var registeredTypes = {};
      var typeDependencies = {};
      var BindingError;
      var throwBindingError = (message) => {
        throw new BindingError(message);
      };
      var InternalError;
      var throwInternalError = (message) => {
        throw new InternalError(message);
      };
      var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
        myTypes.forEach((type) => typeDependencies[type] = dependentTypes);
        function onComplete(typeConverters2) {
          var myTypeConverters = getTypeConverters(typeConverters2);
          if (myTypeConverters.length !== myTypes.length) {
            throwInternalError("Mismatched type converter count");
          }
          for (var i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i]);
          }
        }
        var typeConverters = new Array(dependentTypes.length);
        var unregisteredTypes = [];
        var registered = 0;
        dependentTypes.forEach((dt, i) => {
          if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt];
          } else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) {
              awaitingDependencies[dt] = [];
            }
            awaitingDependencies[dt].push(() => {
              typeConverters[i] = registeredTypes[dt];
              ++registered;
              if (registered === unregisteredTypes.length) {
                onComplete(typeConverters);
              }
            });
          }
        });
        if (0 === unregisteredTypes.length) {
          onComplete(typeConverters);
        }
      };
      function sharedRegisterType(rawType, registeredInstance, options = {}) {
        var name = registeredInstance.name;
        if (!rawType) {
          throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
        }
        if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
            return;
          } else {
            throwBindingError(`Cannot register type '${name}' twice`);
          }
        }
        registeredTypes[rawType] = registeredInstance;
        delete typeDependencies[rawType];
        if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach((cb) => cb());
        }
      }
      function registerType(rawType, registeredInstance, options = {}) {
        return sharedRegisterType(rawType, registeredInstance, options);
      }
      var integerReadValueFromPointer = (name, width, signed) => {
        switch (width) {
          case 1:
            return signed ? (pointer) => HEAP8[pointer] : (pointer) => HEAPU8[pointer];
          case 2:
            return signed ? (pointer) => HEAP16[pointer >> 1] : (pointer) => HEAPU16[pointer >> 1];
          case 4:
            return signed ? (pointer) => HEAP32[pointer >> 2] : (pointer) => HEAPU32[pointer >> 2];
          case 8:
            return signed ? (pointer) => HEAP64[pointer >> 3] : (pointer) => HEAPU64[pointer >> 3];
          default:
            throw new TypeError(`invalid integer width (${width}): ${name}`);
        }
      };
      var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {
        name = readLatin1String(name);
        var isUnsignedType = name.indexOf("u") != -1;
        registerType(primitiveType, { name, fromWireType: (value) => value, toWireType: function(destructors, value) {
          if (typeof value != "bigint" && typeof value != "number") {
            throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${this.name}`);
          }
          if (typeof value == "number") {
            value = BigInt(value);
          }
          return value;
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: integerReadValueFromPointer(name, size, !isUnsignedType), destructorFunction: null });
      };
      var GenericWireTypeSize = 8;
      var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
        name = readLatin1String(name);
        registerType(rawType, { name, fromWireType: function(wt) {
          return !!wt;
        }, toWireType: function(destructors, o) {
          return o ? trueValue : falseValue;
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: function(pointer) {
          return this["fromWireType"](HEAPU8[pointer]);
        }, destructorFunction: null });
      };
      var shallowCopyInternalPointer = (o) => ({ count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType });
      var throwInstanceAlreadyDeleted = (obj) => {
        function getInstanceTypeName(handle) {
          return handle.$$.ptrType.registeredClass.name;
        }
        throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
      };
      var finalizationRegistry = false;
      var detachFinalizer = (handle) => {
      };
      var runDestructor = ($$) => {
        if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr);
        } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr);
        }
      };
      var releaseClassHandle = ($$) => {
        $$.count.value -= 1;
        var toDelete = 0 === $$.count.value;
        if (toDelete) {
          runDestructor($$);
        }
      };
      var downcastPointer = (ptr, ptrClass, desiredClass) => {
        if (ptrClass === desiredClass) {
          return ptr;
        }
        if (void 0 === desiredClass.baseClass) {
          return null;
        }
        var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
        if (rv === null) {
          return null;
        }
        return desiredClass.downcast(rv);
      };
      var registeredPointers = {};
      var registeredInstances = {};
      var getBasestPointer = (class_, ptr) => {
        if (ptr === void 0) {
          throwBindingError("ptr should not be undefined");
        }
        while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
        }
        return ptr;
      };
      var getInheritedInstance = (class_, ptr) => {
        ptr = getBasestPointer(class_, ptr);
        return registeredInstances[ptr];
      };
      var makeClassHandle = (prototype, record) => {
        if (!record.ptrType || !record.ptr) {
          throwInternalError("makeClassHandle requires ptr and ptrType");
        }
        var hasSmartPtrType = !!record.smartPtrType;
        var hasSmartPtr = !!record.smartPtr;
        if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError("Both smartPtrType and smartPtr must be specified");
        }
        record.count = { value: 1 };
        return attachFinalizer(Object.create(prototype, { $$: { value: record, writable: true } }));
      };
      function RegisteredPointer_fromWireType(ptr) {
        var rawPointer = this.getPointee(ptr);
        if (!rawPointer) {
          this.destructor(ptr);
          return null;
        }
        var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
        if (void 0 !== registeredInstance) {
          if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]();
          } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv;
          }
        }
        function makeDefaultHandle() {
          if (this.isSmartPointer) {
            return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
          } else {
            return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
          }
        }
        var actualType = this.registeredClass.getActualType(rawPointer);
        var registeredPointerRecord = registeredPointers[actualType];
        if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this);
        }
        var toType;
        if (this.isConst) {
          toType = registeredPointerRecord.constPointerType;
        } else {
          toType = registeredPointerRecord.pointerType;
        }
        var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
        if (dp === null) {
          return makeDefaultHandle.call(this);
        }
        if (this.isSmartPointer) {
          return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
        } else {
          return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
        }
      }
      var attachFinalizer = (handle) => {
        if ("undefined" === typeof FinalizationRegistry) {
          attachFinalizer = (handle2) => handle2;
          return handle;
        }
        finalizationRegistry = new FinalizationRegistry((info) => {
          releaseClassHandle(info.$$);
        });
        attachFinalizer = (handle2) => {
          var $$ = handle2.$$;
          var hasSmartPtr = !!$$.smartPtr;
          if (hasSmartPtr) {
            var info = { $$ };
            finalizationRegistry.register(handle2, info, handle2);
          }
          return handle2;
        };
        detachFinalizer = (handle2) => finalizationRegistry.unregister(handle2);
        return attachFinalizer(handle);
      };
      var init_ClassHandle = () => {
        Object.assign(ClassHandle.prototype, { isAliasOf(other) {
          if (!(this instanceof ClassHandle)) {
            return false;
          }
          if (!(other instanceof ClassHandle)) {
            return false;
          }
          var leftClass = this.$$.ptrType.registeredClass;
          var left = this.$$.ptr;
          other.$$ = other.$$;
          var rightClass = other.$$.ptrType.registeredClass;
          var right = other.$$.ptr;
          while (leftClass.baseClass) {
            left = leftClass.upcast(left);
            leftClass = leftClass.baseClass;
          }
          while (rightClass.baseClass) {
            right = rightClass.upcast(right);
            rightClass = rightClass.baseClass;
          }
          return leftClass === rightClass && left === right;
        }, clone() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.preservePointerOnDelete) {
            this.$$.count.value += 1;
            return this;
          } else {
            var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
            clone.$$.count.value += 1;
            clone.$$.deleteScheduled = false;
            return clone;
          }
        }, delete() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError("Object already scheduled for deletion");
          }
          detachFinalizer(this);
          releaseClassHandle(this.$$);
          if (!this.$$.preservePointerOnDelete) {
            this.$$.smartPtr = void 0;
            this.$$.ptr = void 0;
          }
        }, isDeleted() {
          return !this.$$.ptr;
        }, deleteLater() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError("Object already scheduled for deletion");
          }
          this.$$.deleteScheduled = true;
          return this;
        } });
      };
      function ClassHandle() {
      }
      var createNamedFunction = (name, body) => Object.defineProperty(body, "name", { value: name });
      var ensureOverloadTable = (proto, methodName, humanName) => {
        if (void 0 === proto[methodName].overloadTable) {
          var prevFunc = proto[methodName];
          proto[methodName] = function(...args) {
            if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
              throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`);
            }
            return proto[methodName].overloadTable[args.length].apply(this, args);
          };
          proto[methodName].overloadTable = [];
          proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
        }
      };
      var exposePublicSymbol = (name, value, numArguments) => {
        if (Module2.hasOwnProperty(name)) {
          {
            throwBindingError(`Cannot register public name '${name}' twice`);
          }
          ensureOverloadTable(Module2, name, name);
          if (Module2[name].overloadTable.hasOwnProperty(numArguments)) {
            throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
          }
          Module2[name].overloadTable[numArguments] = value;
        } else {
          Module2[name] = value;
          Module2[name].argCount = numArguments;
        }
      };
      var char_0 = 48;
      var char_9 = 57;
      var makeLegalFunctionName = (name) => {
        name = name.replace(/[^a-zA-Z0-9_]/g, "$");
        var f = name.charCodeAt(0);
        if (f >= char_0 && f <= char_9) {
          return `_${name}`;
        }
        return name;
      };
      function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
        this.name = name;
        this.constructor = constructor;
        this.instancePrototype = instancePrototype;
        this.rawDestructor = rawDestructor;
        this.baseClass = baseClass;
        this.getActualType = getActualType;
        this.upcast = upcast;
        this.downcast = downcast;
        this.pureVirtualFunctions = [];
      }
      var upcastPointer = (ptr, ptrClass, desiredClass) => {
        while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
            throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
          }
          ptr = ptrClass.upcast(ptr);
          ptrClass = ptrClass.baseClass;
        }
        return ptr;
      };
      function constNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError(`null is not a valid ${this.name}`);
          }
          return 0;
        }
        if (!handle.$$) {
          throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
        }
        if (!handle.$$.ptr) {
          throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }
      function genericPointerToWireType(destructors, handle) {
        var ptr;
        if (handle === null) {
          if (this.isReference) {
            throwBindingError(`null is not a valid ${this.name}`);
          }
          if (this.isSmartPointer) {
            ptr = this.rawConstructor();
            if (destructors !== null) {
              destructors.push(this.rawDestructor, ptr);
            }
            return ptr;
          } else {
            return 0;
          }
        }
        if (!handle || !handle.$$) {
          throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
        }
        if (!handle.$$.ptr) {
          throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
        }
        if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        if (this.isSmartPointer) {
          if (void 0 === handle.$$.smartPtr) {
            throwBindingError("Passing raw pointer to smart pointer is illegal");
          }
          switch (this.sharingPolicy) {
            case 0:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
              }
              break;
            case 1:
              ptr = handle.$$.smartPtr;
              break;
            case 2:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                var clonedHandle = handle["clone"]();
                ptr = this.rawShare(ptr, Emval.toHandle(() => clonedHandle["delete"]()));
                if (destructors !== null) {
                  destructors.push(this.rawDestructor, ptr);
                }
              }
              break;
            default:
              throwBindingError("Unsupporting sharing policy");
          }
        }
        return ptr;
      }
      function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError(`null is not a valid ${this.name}`);
          }
          return 0;
        }
        if (!handle.$$) {
          throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
        }
        if (!handle.$$.ptr) {
          throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
        }
        if (handle.$$.ptrType.isConst) {
          throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }
      function readPointer(pointer) {
        return this["fromWireType"](HEAPU32[pointer >> 2]);
      }
      var init_RegisteredPointer = () => {
        Object.assign(RegisteredPointer.prototype, { getPointee(ptr) {
          if (this.rawGetPointee) {
            ptr = this.rawGetPointee(ptr);
          }
          return ptr;
        }, destructor(ptr) {
          this.rawDestructor?.(ptr);
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, fromWireType: RegisteredPointer_fromWireType });
      };
      function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
        this.name = name;
        this.registeredClass = registeredClass;
        this.isReference = isReference;
        this.isConst = isConst;
        this.isSmartPointer = isSmartPointer;
        this.pointeeType = pointeeType;
        this.sharingPolicy = sharingPolicy;
        this.rawGetPointee = rawGetPointee;
        this.rawConstructor = rawConstructor;
        this.rawShare = rawShare;
        this.rawDestructor = rawDestructor;
        if (!isSmartPointer && registeredClass.baseClass === void 0) {
          if (isConst) {
            this["toWireType"] = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          } else {
            this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          }
        } else {
          this["toWireType"] = genericPointerToWireType;
        }
      }
      var replacePublicSymbol = (name, value, numArguments) => {
        if (!Module2.hasOwnProperty(name)) {
          throwInternalError("Replacing nonexistent public symbol");
        }
        if (void 0 !== Module2[name].overloadTable && void 0 !== numArguments) ;
        else {
          Module2[name] = value;
          Module2[name].argCount = numArguments;
        }
      };
      var wasmTableMirror = [];
      var wasmTable;
      var getWasmTableEntry = (funcPtr) => {
        var func = wasmTableMirror[funcPtr];
        if (!func) {
          if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
          wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        }
        return func;
      };
      var embind__requireFunction = (signature, rawFunction) => {
        signature = readLatin1String(signature);
        function makeDynCaller() {
          return getWasmTableEntry(rawFunction);
        }
        var fp = makeDynCaller();
        if (typeof fp != "function") {
          throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
        }
        return fp;
      };
      var extendError = (baseErrorType, errorName) => {
        var errorClass = createNamedFunction(errorName, function(message) {
          this.name = errorName;
          this.message = message;
          var stack = new Error(message).stack;
          if (stack !== void 0) {
            this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
          }
        });
        errorClass.prototype = Object.create(baseErrorType.prototype);
        errorClass.prototype.constructor = errorClass;
        errorClass.prototype.toString = function() {
          if (this.message === void 0) {
            return this.name;
          } else {
            return `${this.name}: ${this.message}`;
          }
        };
        return errorClass;
      };
      var UnboundTypeError;
      var getTypeName = (type) => {
        var ptr = ___getTypeName(type);
        var rv = readLatin1String(ptr);
        _free(ptr);
        return rv;
      };
      var throwUnboundTypeError = (message, types) => {
        var unboundTypes = [];
        var seen = {};
        function visit(type) {
          if (seen[type]) {
            return;
          }
          if (registeredTypes[type]) {
            return;
          }
          if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return;
          }
          unboundTypes.push(type);
          seen[type] = true;
        }
        types.forEach(visit);
        throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
      };
      var __embind_register_class = (rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) => {
        name = readLatin1String(name);
        getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
        upcast && (upcast = embind__requireFunction(upcastSignature, upcast));
        downcast && (downcast = embind__requireFunction(downcastSignature, downcast));
        rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
        var legalFunctionName = makeLegalFunctionName(name);
        exposePublicSymbol(legalFunctionName, function() {
          throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
        });
        whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], (base) => {
          var _a3;
          base = base[0];
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          var constructor = createNamedFunction(name, function(...args) {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }
            if (void 0 === registeredClass.constructor_body) {
              throw new BindingError(name + " has no accessible constructor");
            }
            var body = registeredClass.constructor_body[args.length];
            if (void 0 === body) {
              throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
            }
            return body.apply(this, args);
          });
          var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
          if (registeredClass.baseClass) {
            (_a3 = registeredClass.baseClass).__derivedClasses ?? (_a3.__derivedClasses = []);
            registeredClass.baseClass.__derivedClasses.push(registeredClass);
          }
          var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
          var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
          var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
          registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        });
      };
      var heap32VectorToArray = (count, firstElement) => {
        var array = [];
        for (var i = 0; i < count; i++) {
          array.push(HEAPU32[firstElement + i * 4 >> 2]);
        }
        return array;
      };
      var runDestructors = (destructors) => {
        while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
        }
      };
      function usesDestructorStack(argTypes) {
        for (var i = 1; i < argTypes.length; ++i) {
          if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
            return true;
          }
        }
        return false;
      }
      function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
        var argCount = argTypes.length;
        if (argCount < 2) {
          throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
        }
        var isClassMethodFunc = argTypes[1] !== null && classType !== null;
        var needsDestructorStack = usesDestructorStack(argTypes);
        var returns = argTypes[0].name !== "void";
        var expectedArgCount = argCount - 2;
        var argsWired = new Array(expectedArgCount);
        var invokerFuncArgs = [];
        var destructors = [];
        var invokerFn = function(...args) {
          destructors.length = 0;
          var thisWired;
          invokerFuncArgs.length = isClassMethodFunc ? 2 : 1;
          invokerFuncArgs[0] = cppTargetFunc;
          if (isClassMethodFunc) {
            thisWired = argTypes[1]["toWireType"](destructors, this);
            invokerFuncArgs[1] = thisWired;
          }
          for (var i = 0; i < expectedArgCount; ++i) {
            argsWired[i] = argTypes[i + 2]["toWireType"](destructors, args[i]);
            invokerFuncArgs.push(argsWired[i]);
          }
          var rv = cppInvokerFunc(...invokerFuncArgs);
          function onDone(rv2) {
            if (needsDestructorStack) {
              runDestructors(destructors);
            } else {
              for (var i2 = isClassMethodFunc ? 1 : 2; i2 < argTypes.length; i2++) {
                var param = i2 === 1 ? thisWired : argsWired[i2 - 2];
                if (argTypes[i2].destructorFunction !== null) {
                  argTypes[i2].destructorFunction(param);
                }
              }
            }
            if (returns) {
              return argTypes[0]["fromWireType"](rv2);
            }
          }
          return onDone(rv);
        };
        return createNamedFunction(humanName, invokerFn);
      }
      var __embind_register_class_constructor = (rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) => {
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        invoker = embind__requireFunction(invokerSignature, invoker);
        whenDependentTypesAreResolved([], [rawClassType], (classType) => {
          classType = classType[0];
          var humanName = `constructor ${classType.name}`;
          if (void 0 === classType.registeredClass.constructor_body) {
            classType.registeredClass.constructor_body = [];
          }
          if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
            throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
          }
          classType.registeredClass.constructor_body[argCount - 1] = () => {
            throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
          };
          whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
            argTypes.splice(1, 0, null);
            classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
            return [];
          });
          return [];
        });
      };
      var getFunctionName = (signature) => {
        signature = signature.trim();
        const argsIndex = signature.indexOf("(");
        if (argsIndex === -1) return signature;
        return signature.slice(0, argsIndex);
      };
      var __embind_register_class_function = (rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual, isAsync, isNonnullReturn) => {
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        methodName = readLatin1String(methodName);
        methodName = getFunctionName(methodName);
        rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
        whenDependentTypesAreResolved([], [rawClassType], (classType) => {
          classType = classType[0];
          var humanName = `${classType.name}.${methodName}`;
          if (methodName.startsWith("@@")) {
            methodName = Symbol[methodName.substring(2)];
          }
          if (isPureVirtual) {
            classType.registeredClass.pureVirtualFunctions.push(methodName);
          }
          function unboundTypesHandler() {
            throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
          }
          var proto = classType.registeredClass.instancePrototype;
          var method = proto[methodName];
          if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
            unboundTypesHandler.argCount = argCount - 2;
            unboundTypesHandler.className = classType.name;
            proto[methodName] = unboundTypesHandler;
          } else {
            ensureOverloadTable(proto, methodName, humanName);
            proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
          }
          whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
            var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
            if (void 0 === proto[methodName].overloadTable) {
              memberFunction.argCount = argCount - 2;
              proto[methodName] = memberFunction;
            } else {
              proto[methodName].overloadTable[argCount - 2] = memberFunction;
            }
            return [];
          });
          return [];
        });
      };
      var emval_freelist = [];
      var emval_handles = [];
      var __emval_decref = (handle) => {
        if (handle > 9 && 0 === --emval_handles[handle + 1]) {
          emval_handles[handle] = void 0;
          emval_freelist.push(handle);
        }
      };
      var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;
      var init_emval = () => {
        emval_handles.push(0, 1, void 0, 1, null, 1, true, 1, false, 1);
        Module2["count_emval_handles"] = count_emval_handles;
      };
      var Emval = { toValue: (handle) => {
        if (!handle) {
          throwBindingError("Cannot use deleted val. handle = " + handle);
        }
        return emval_handles[handle];
      }, toHandle: (value) => {
        switch (value) {
          case void 0:
            return 2;
          case null:
            return 4;
          case true:
            return 6;
          case false:
            return 8;
          default: {
            const handle = emval_freelist.pop() || emval_handles.length;
            emval_handles[handle] = value;
            emval_handles[handle + 1] = 1;
            return handle;
          }
        }
      } };
      var EmValType = { name: "emscripten::val", fromWireType: (handle) => {
        var rv = Emval.toValue(handle);
        __emval_decref(handle);
        return rv;
      }, toWireType: (destructors, value) => Emval.toHandle(value), argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction: null };
      var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
      var floatReadValueFromPointer = (name, width) => {
        switch (width) {
          case 4:
            return function(pointer) {
              return this["fromWireType"](HEAPF32[pointer >> 2]);
            };
          case 8:
            return function(pointer) {
              return this["fromWireType"](HEAPF64[pointer >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${width}): ${name}`);
        }
      };
      var __embind_register_float = (rawType, name, size) => {
        name = readLatin1String(name);
        registerType(rawType, { name, fromWireType: (value) => value, toWireType: (destructors, value) => value, argPackAdvance: GenericWireTypeSize, readValueFromPointer: floatReadValueFromPointer(name, size), destructorFunction: null });
      };
      var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
        name = readLatin1String(name);
        var fromWireType = (value) => value;
        if (minRange === 0) {
          var bitshift = 32 - 8 * size;
          fromWireType = (value) => value << bitshift >>> bitshift;
        }
        var isUnsignedType = name.includes("unsigned");
        var checkAssertions = (value, toTypeName) => {
        };
        var toWireType;
        if (isUnsignedType) {
          toWireType = function(destructors, value) {
            checkAssertions(value, this.name);
            return value >>> 0;
          };
        } else {
          toWireType = function(destructors, value) {
            checkAssertions(value, this.name);
            return value;
          };
        }
        registerType(primitiveType, { name, fromWireType, toWireType, argPackAdvance: GenericWireTypeSize, readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0), destructorFunction: null });
      };
      var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
        var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array];
        var TA = typeMapping[dataTypeIndex];
        function decodeMemoryView(handle) {
          var size = HEAPU32[handle >> 2];
          var data = HEAPU32[handle + 4 >> 2];
          return new TA(HEAP8.buffer, data, size);
        }
        name = readLatin1String(name);
        registerType(rawType, { name, fromWireType: decodeMemoryView, argPackAdvance: GenericWireTypeSize, readValueFromPointer: decodeMemoryView }, { ignoreDuplicateRegistrations: true });
      };
      var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023;
          }
          if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx;
      };
      var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      var lengthBytesUTF8 = (str) => {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var c = str.charCodeAt(i);
          if (c <= 127) {
            len++;
          } else if (c <= 2047) {
            len += 2;
          } else if (c >= 55296 && c <= 57343) {
            len += 4;
            ++i;
          } else {
            len += 3;
          }
        }
        return len;
      };
      var __embind_register_std_string = (rawType, name) => {
        name = readLatin1String(name);
        registerType(rawType, { name, fromWireType(value) {
          var length = HEAPU32[value >> 2];
          var payload = value + 4;
          var str;
          var i;
          {
            var decodeStartPtr = payload;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = payload + i;
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                if (str === void 0) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          }
          _free(value);
          return str;
        }, toWireType(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          var length;
          var valueIsOfTypeString = typeof value == "string";
          if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
            throwBindingError("Cannot pass non-string to std::string");
          }
          if (valueIsOfTypeString) {
            length = lengthBytesUTF8(value);
          } else {
            length = value.length;
          }
          var base = _malloc(4 + length + 1);
          var ptr = base + 4;
          HEAPU32[base >> 2] = length;
          if (valueIsOfTypeString) {
            stringToUTF8(value, ptr, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(base);
                  throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                }
                HEAPU8[ptr + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + i] = value[i];
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, base);
          }
          return base;
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction(ptr) {
          _free(ptr);
        } });
      };
      var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
      var UTF16ToString = (ptr, maxBytesToRead) => {
        var endPtr = ptr;
        var idx = endPtr >> 1;
        var maxIdx = idx + maxBytesToRead / 2;
        while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
        endPtr = idx << 1;
        if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
        var str = "";
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[ptr + i * 2 >> 1];
          if (codeUnit == 0) break;
          str += String.fromCharCode(codeUnit);
        }
        return str;
      };
      var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
        maxBytesToWrite ?? (maxBytesToWrite = 2147483647);
        if (maxBytesToWrite < 2) return 0;
        maxBytesToWrite -= 2;
        var startPtr = outPtr;
        var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
        for (var i = 0; i < numCharsToWrite; ++i) {
          var codeUnit = str.charCodeAt(i);
          HEAP16[outPtr >> 1] = codeUnit;
          outPtr += 2;
        }
        HEAP16[outPtr >> 1] = 0;
        return outPtr - startPtr;
      };
      var lengthBytesUTF16 = (str) => str.length * 2;
      var UTF32ToString = (ptr, maxBytesToRead) => {
        var i = 0;
        var str = "";
        while (!(i >= maxBytesToRead / 4)) {
          var utf32 = HEAP32[ptr + i * 4 >> 2];
          if (utf32 == 0) break;
          ++i;
          if (utf32 >= 65536) {
            var ch = utf32 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          } else {
            str += String.fromCharCode(utf32);
          }
        }
        return str;
      };
      var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
        maxBytesToWrite ?? (maxBytesToWrite = 2147483647);
        if (maxBytesToWrite < 4) return 0;
        var startPtr = outPtr;
        var endPtr = startPtr + maxBytesToWrite - 4;
        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343) {
            var trailSurrogate = str.charCodeAt(++i);
            codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
          }
          HEAP32[outPtr >> 2] = codeUnit;
          outPtr += 4;
          if (outPtr + 4 > endPtr) break;
        }
        HEAP32[outPtr >> 2] = 0;
        return outPtr - startPtr;
      };
      var lengthBytesUTF32 = (str) => {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
          len += 4;
        }
        return len;
      };
      var __embind_register_std_wstring = (rawType, charSize, name) => {
        name = readLatin1String(name);
        var decodeString, encodeString, readCharAt, lengthBytesUTF;
        if (charSize === 2) {
          decodeString = UTF16ToString;
          encodeString = stringToUTF16;
          lengthBytesUTF = lengthBytesUTF16;
          readCharAt = (pointer) => HEAPU16[pointer >> 1];
        } else if (charSize === 4) {
          decodeString = UTF32ToString;
          encodeString = stringToUTF32;
          lengthBytesUTF = lengthBytesUTF32;
          readCharAt = (pointer) => HEAPU32[pointer >> 2];
        }
        registerType(rawType, { name, fromWireType: (value) => {
          var length = HEAPU32[value >> 2];
          var str;
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || readCharAt(currentBytePtr) == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
              if (str === void 0) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
          _free(value);
          return str;
        }, toWireType: (destructors, value) => {
          if (!(typeof value == "string")) {
            throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
          }
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          HEAPU32[ptr >> 2] = length / charSize;
          encodeString(value, ptr + 4, length + charSize);
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction(ptr) {
          _free(ptr);
        } });
      };
      var __embind_register_void = (rawType, name) => {
        name = readLatin1String(name);
        registerType(rawType, { isVoid: true, name, argPackAdvance: 0, fromWireType: () => void 0, toWireType: (destructors, o) => void 0 });
      };
      var runtimeKeepaliveCounter = 0;
      var __emscripten_runtime_keepalive_clear = () => {
        noExitRuntime = false;
        runtimeKeepaliveCounter = 0;
      };
      var __emscripten_throw_longjmp = () => {
        throw Infinity;
      };
      var requireRegisteredType = (rawType, humanName) => {
        var impl = registeredTypes[rawType];
        if (void 0 === impl) {
          throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
        }
        return impl;
      };
      var __emval_take_value = (type, arg) => {
        type = requireRegisteredType(type, "_emval_take_value");
        var v = type["readValueFromPointer"](arg);
        return Emval.toHandle(v);
      };
      var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
      var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      var ydayFromDate = (date) => {
        var leap = isLeapYear(date.getFullYear());
        var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
        var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
        return yday;
      };
      var INT53_MAX = 9007199254740992;
      var INT53_MIN = -9007199254740992;
      var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
      function __localtime_js(time, tmPtr) {
        time = bigintToI53Checked(time);
        var date = new Date(time * 1e3);
        HEAP32[tmPtr >> 2] = date.getSeconds();
        HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
        HEAP32[tmPtr + 8 >> 2] = date.getHours();
        HEAP32[tmPtr + 12 >> 2] = date.getDate();
        HEAP32[tmPtr + 16 >> 2] = date.getMonth();
        HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
        HEAP32[tmPtr + 24 >> 2] = date.getDay();
        var yday = ydayFromDate(date) | 0;
        HEAP32[tmPtr + 28 >> 2] = yday;
        HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
        var start = new Date(date.getFullYear(), 0, 1);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
        HEAP32[tmPtr + 32 >> 2] = dst;
      }
      var __mktime_js = function(tmPtr) {
        var ret = (() => {
          var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
          var dst = HEAP32[tmPtr + 32 >> 2];
          var guessedOffset = date.getTimezoneOffset();
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dstOffset = Math.min(winterOffset, summerOffset);
          if (dst < 0) {
            HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
          } else if (dst > 0 != (dstOffset == guessedOffset)) {
            var nonDstOffset = Math.max(winterOffset, summerOffset);
            var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
            date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
          }
          HEAP32[tmPtr + 24 >> 2] = date.getDay();
          var yday = ydayFromDate(date) | 0;
          HEAP32[tmPtr + 28 >> 2] = yday;
          HEAP32[tmPtr >> 2] = date.getSeconds();
          HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
          HEAP32[tmPtr + 8 >> 2] = date.getHours();
          HEAP32[tmPtr + 12 >> 2] = date.getDate();
          HEAP32[tmPtr + 16 >> 2] = date.getMonth();
          HEAP32[tmPtr + 20 >> 2] = date.getYear();
          var timeMs = date.getTime();
          if (isNaN(timeMs)) {
            return -1;
          }
          return timeMs / 1e3;
        })();
        return BigInt(ret);
      };
      var timers = {};
      var handleException = (e) => {
        if (e instanceof ExitStatus || e == "unwind") {
          return EXITSTATUS;
        }
        quit_(1, e);
      };
      var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
      var _proc_exit = (code) => {
        EXITSTATUS = code;
        if (!keepRuntimeAlive()) {
          Module2["onExit"]?.(code);
          ABORT = true;
        }
        quit_(code, new ExitStatus(code));
      };
      var exitJS = (status, implicit) => {
        EXITSTATUS = status;
        _proc_exit(status);
      };
      var _exit = exitJS;
      var maybeExit = () => {
        if (!keepRuntimeAlive()) {
          try {
            _exit(EXITSTATUS);
          } catch (e) {
            handleException(e);
          }
        }
      };
      var callUserCallback = (func) => {
        if (ABORT) {
          return;
        }
        try {
          func();
          maybeExit();
        } catch (e) {
          handleException(e);
        }
      };
      var _emscripten_get_now = () => performance.now();
      var __setitimer_js = (which, timeout_ms) => {
        if (timers[which]) {
          clearTimeout(timers[which].id);
          delete timers[which];
        }
        if (!timeout_ms) return 0;
        var id = setTimeout(() => {
          delete timers[which];
          callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
        }, timeout_ms);
        timers[which] = { id, timeout_ms };
        return 0;
      };
      var __tzset_js = (timezone, daylight, std_name, dst_name) => {
        var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        var winter = new Date(currentYear, 0, 1);
        var summer = new Date(currentYear, 6, 1);
        var winterOffset = winter.getTimezoneOffset();
        var summerOffset = summer.getTimezoneOffset();
        var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
        HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
        HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
        var extractZone = (timezoneOffset) => {
          var sign = timezoneOffset >= 0 ? "-" : "+";
          var absOffset = Math.abs(timezoneOffset);
          var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
          var minutes = String(absOffset % 60).padStart(2, "0");
          return `UTC${sign}${hours}${minutes}`;
        };
        var winterName = extractZone(winterOffset);
        var summerName = extractZone(summerOffset);
        if (summerOffset < winterOffset) {
          stringToUTF8(winterName, std_name, 17);
          stringToUTF8(summerName, dst_name, 17);
        } else {
          stringToUTF8(winterName, dst_name, 17);
          stringToUTF8(summerName, std_name, 17);
        }
      };
      var getHeapMax = () => 2147483648;
      var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
      var growMemory = (size) => {
        var b = wasmMemory.buffer;
        var pages = (size - b.byteLength + 65535) / 65536 | 0;
        try {
          wasmMemory.grow(pages);
          updateMemoryViews();
          return 1;
        } catch (e) {
        }
      };
      var _emscripten_resize_heap = (requestedSize) => {
        var oldSize = HEAPU8.length;
        requestedSize >>>= 0;
        var maxHeapSize = getHeapMax();
        if (requestedSize > maxHeapSize) {
          return false;
        }
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
          var replacement = growMemory(newSize);
          if (replacement) {
            return true;
          }
        }
        return false;
      };
      var ENV = {};
      var getExecutableName = () => thisProgram || "./this.program";
      var getEnvStrings = () => {
        if (!getEnvStrings.strings) {
          var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
          var env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
          for (var x2 in ENV) {
            if (ENV[x2] === void 0) delete env[x2];
            else env[x2] = ENV[x2];
          }
          var strings = [];
          for (var x2 in env) {
            strings.push(`${x2}=${env[x2]}`);
          }
          getEnvStrings.strings = strings;
        }
        return getEnvStrings.strings;
      };
      var stringToAscii = (str, buffer) => {
        for (var i = 0; i < str.length; ++i) {
          HEAP8[buffer++] = str.charCodeAt(i);
        }
        HEAP8[buffer] = 0;
      };
      var _environ_get = (__environ, environ_buf) => {
        var bufSize = 0;
        getEnvStrings().forEach((string, i) => {
          var ptr = environ_buf + bufSize;
          HEAPU32[__environ + i * 4 >> 2] = ptr;
          stringToAscii(string, ptr);
          bufSize += string.length + 1;
        });
        return 0;
      };
      var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
        var strings = getEnvStrings();
        HEAPU32[penviron_count >> 2] = strings.length;
        var bufSize = 0;
        strings.forEach((string) => bufSize += string.length + 1);
        HEAPU32[penviron_buf_size >> 2] = bufSize;
        return 0;
      };
      var _fd_close = (fd) => 52;
      var _fd_read = (fd, iov, iovcnt, pnum) => 52;
      function _fd_seek(fd, offset, whence, newOffset) {
        return 70;
      }
      var printCharBuffers = [null, [], []];
      var printChar = (stream, curr) => {
        var buffer = printCharBuffers[stream];
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      };
      var _fd_write = (fd, iov, iovcnt, pnum) => {
        var num = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAPU32[iov >> 2];
          var len = HEAPU32[iov + 4 >> 2];
          iov += 8;
          for (var j2 = 0; j2 < len; j2++) {
            printChar(fd, HEAPU8[ptr + j2]);
          }
          num += len;
        }
        HEAPU32[pnum >> 2] = num;
        return 0;
      };
      embind_init_charCodes();
      BindingError = Module2["BindingError"] = class BindingError extends Error {
        constructor(message) {
          super(message);
          this.name = "BindingError";
        }
      };
      InternalError = Module2["InternalError"] = class InternalError extends Error {
        constructor(message) {
          super(message);
          this.name = "InternalError";
        }
      };
      init_ClassHandle();
      init_RegisteredPointer();
      UnboundTypeError = Module2["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
      init_emval();
      var wasmImports = { a: ___assert_fail, C: ___cxa_throw, F: ___syscall_ioctl, G: ___syscall_openat, H: __abort_js, l: __embind_register_bigint, o: __embind_register_bool, J: __embind_register_class, I: __embind_register_class_constructor, c: __embind_register_class_function, m: __embind_register_emval, k: __embind_register_float, d: __embind_register_integer, b: __embind_register_memory_view, n: __embind_register_std_string, e: __embind_register_std_wstring, p: __embind_register_void, t: __emscripten_runtime_keepalive_clear, r: __emscripten_throw_longjmp, q: __emval_take_value, y: __localtime_js, z: __mktime_js, u: __setitimer_js, A: __tzset_js, x: _emscripten_resize_heap, v: _environ_get, w: _environ_sizes_get, j: _fd_close, E: _fd_read, B: _fd_seek, D: _fd_write, i: invoke_vii, g: invoke_viii, f: invoke_viiiii, h: invoke_viiiiiii, s: _proc_exit };
      var wasmExports = await createWasm();
      wasmExports["L"];
      var ___getTypeName = wasmExports["M"];
      var _free = wasmExports["N"];
      var _malloc = wasmExports["O"];
      var __emscripten_timeout = wasmExports["Q"];
      var _setThrew = wasmExports["R"];
      var __emscripten_stack_restore = wasmExports["S"];
      var _emscripten_stack_get_current = wasmExports["T"];
      function invoke_vii(index, a1, a2) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }
      function invoke_viii(index, a1, a2, a3) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }
      function invoke_viiiii(index, a1, a2, a3, a4, a5) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3, a4, a5);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }
      function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
        var sp = stackSave();
        try {
          getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
        } catch (e) {
          stackRestore(sp);
          if (e !== e + 0) throw e;
          _setThrew(1, 0);
        }
      }
      function run() {
        if (runDependencies > 0) {
          dependenciesFulfilled = run;
          return;
        }
        preRun();
        if (runDependencies > 0) {
          dependenciesFulfilled = run;
          return;
        }
        function doRun() {
          Module2["calledRun"] = true;
          if (ABORT) return;
          initRuntime();
          readyPromiseResolve(Module2);
          Module2["onRuntimeInitialized"]?.();
          postRun();
        }
        if (Module2["setStatus"]) {
          Module2["setStatus"]("Running...");
          setTimeout(() => {
            setTimeout(() => Module2["setStatus"](""), 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
      }
      if (Module2["preInit"]) {
        if (typeof Module2["preInit"] == "function") Module2["preInit"] = [Module2["preInit"]];
        while (Module2["preInit"].length > 0) {
          Module2["preInit"].pop()();
        }
      }
      run();
      moduleRtn = readyPromise;
      return moduleRtn;
    });
  })();
  if (typeof exports$1 === "object" && typeof module$1 === "object") {
    module$1.exports = Module;
    module$1.exports.default = Module;
  } else if (typeof define === "function" && define["amd"])
    define([], () => Module);
  const __CJS__export_default__ = (module$1.exports == null ? {} : module$1.exports).default || module$1.exports;
  var rlottieWasm = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    default: __CJS__export_default__
  });
})();
//# sourceMappingURL=worker-G6Xy4i2d.js.map
