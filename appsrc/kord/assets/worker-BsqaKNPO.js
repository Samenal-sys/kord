(function() {
  "use strict";
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  const proxyMarker = Symbol("Comlink.proxy");
  const createEndpoint = Symbol("Comlink.endpoint");
  const releaseProxy = Symbol("Comlink.releaseProxy");
  const finalizer = Symbol("Comlink.finalizer");
  const throwMarker = Symbol("Comlink.thrown");
  const isObject = (val) => typeof val === "object" && val !== null || typeof val === "function";
  const proxyTransferHandler = {
    canHandle: (val) => isObject(val) && val[proxyMarker],
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
    canHandle: (value) => isObject(value) && throwMarker in value,
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
        const last = path[path.length - 1];
        if (last === createEndpoint) {
          return requestResponseMessage(ep, pendingListeners, {
            type: "ENDPOINT"
          }).then(fromWireValue);
        }
        if (last === "bind") {
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
  function typeofJsonValue(value) {
    let t = typeof value;
    if (t == "object") {
      if (Array.isArray(value))
        return "array";
      if (value === null)
        return "null";
    }
    return t;
  }
  function isJsonObject(value) {
    return value !== null && typeof value == "object" && !Array.isArray(value);
  }
  let encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  let decTable = [];
  for (let i = 0; i < encTable.length; i++)
    decTable[encTable[i].charCodeAt(0)] = i;
  decTable["-".charCodeAt(0)] = encTable.indexOf("+");
  decTable["_".charCodeAt(0)] = encTable.indexOf("/");
  function base64decode(base64Str) {
    let es = base64Str.length * 3 / 4;
    if (base64Str[base64Str.length - 2] == "=")
      es -= 2;
    else if (base64Str[base64Str.length - 1] == "=")
      es -= 1;
    let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
    for (let i = 0; i < base64Str.length; i++) {
      b = decTable[base64Str.charCodeAt(i)];
      if (b === void 0) {
        switch (base64Str[i]) {
          case "=":
            groupPos = 0;
          // reset state when padding found
          case "\n":
          case "\r":
          case "	":
          case " ":
            continue;
          // skip white-space, and padding
          default:
            throw Error(`invalid base64 string.`);
        }
      }
      switch (groupPos) {
        case 0:
          p = b;
          groupPos = 1;
          break;
        case 1:
          bytes[bytePos++] = p << 2 | (b & 48) >> 4;
          p = b;
          groupPos = 2;
          break;
        case 2:
          bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
          p = b;
          groupPos = 3;
          break;
        case 3:
          bytes[bytePos++] = (p & 3) << 6 | b;
          groupPos = 0;
          break;
      }
    }
    if (groupPos == 1)
      throw Error(`invalid base64 string.`);
    return bytes.subarray(0, bytePos);
  }
  function base64encode(bytes) {
    let base64 = "", groupPos = 0, b, p = 0;
    for (let i = 0; i < bytes.length; i++) {
      b = bytes[i];
      switch (groupPos) {
        case 0:
          base64 += encTable[b >> 2];
          p = (b & 3) << 4;
          groupPos = 1;
          break;
        case 1:
          base64 += encTable[p | b >> 4];
          p = (b & 15) << 2;
          groupPos = 2;
          break;
        case 2:
          base64 += encTable[p | b >> 6];
          base64 += encTable[b & 63];
          groupPos = 0;
          break;
      }
    }
    if (groupPos) {
      base64 += encTable[p];
      base64 += "=";
      if (groupPos == 1)
        base64 += "=";
    }
    return base64;
  }
  var UnknownFieldHandler;
  (function(UnknownFieldHandler2) {
    UnknownFieldHandler2.symbol = Symbol.for("protobuf-ts/unknown");
    UnknownFieldHandler2.onRead = (typeName, message, fieldNo, wireType, data) => {
      let container = is(message) ? message[UnknownFieldHandler2.symbol] : message[UnknownFieldHandler2.symbol] = [];
      container.push({ no: fieldNo, wireType, data });
    };
    UnknownFieldHandler2.onWrite = (typeName, message, writer) => {
      for (let { no, wireType, data } of UnknownFieldHandler2.list(message))
        writer.tag(no, wireType).raw(data);
    };
    UnknownFieldHandler2.list = (message, fieldNo) => {
      if (is(message)) {
        let all = message[UnknownFieldHandler2.symbol];
        return fieldNo ? all.filter((uf) => uf.no == fieldNo) : all;
      }
      return [];
    };
    UnknownFieldHandler2.last = (message, fieldNo) => UnknownFieldHandler2.list(message, fieldNo).slice(-1)[0];
    const is = (message) => message && Array.isArray(message[UnknownFieldHandler2.symbol]);
  })(UnknownFieldHandler || (UnknownFieldHandler = {}));
  var WireType;
  (function(WireType2) {
    WireType2[WireType2["Varint"] = 0] = "Varint";
    WireType2[WireType2["Bit64"] = 1] = "Bit64";
    WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
    WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
    WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
    WireType2[WireType2["Bit32"] = 5] = "Bit32";
  })(WireType || (WireType = {}));
  function varint64read() {
    let lowBits = 0;
    let highBits = 0;
    for (let shift = 0; shift < 28; shift += 7) {
      let b = this.buf[this.pos++];
      lowBits |= (b & 127) << shift;
      if ((b & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
    }
    let middleByte = this.buf[this.pos++];
    lowBits |= (middleByte & 15) << 28;
    highBits = (middleByte & 112) >> 4;
    if ((middleByte & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
    for (let shift = 3; shift <= 31; shift += 7) {
      let b = this.buf[this.pos++];
      highBits |= (b & 127) << shift;
      if ((b & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
    }
    throw new Error("invalid varint");
  }
  function varint64write(lo, hi, bytes) {
    for (let i = 0; i < 28; i = i + 7) {
      const shift = lo >>> i;
      const hasNext = !(shift >>> 7 == 0 && hi == 0);
      const byte = (hasNext ? shift | 128 : shift) & 255;
      bytes.push(byte);
      if (!hasNext) {
        return;
      }
    }
    const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
    const hasMoreBits = !(hi >> 3 == 0);
    bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
    if (!hasMoreBits) {
      return;
    }
    for (let i = 3; i < 31; i = i + 7) {
      const shift = hi >>> i;
      const hasNext = !(shift >>> 7 == 0);
      const byte = (hasNext ? shift | 128 : shift) & 255;
      bytes.push(byte);
      if (!hasNext) {
        return;
      }
    }
    bytes.push(hi >>> 31 & 1);
  }
  const TWO_PWR_32_DBL$1 = (1 << 16) * (1 << 16);
  function int64fromString(dec) {
    let minus = dec[0] == "-";
    if (minus)
      dec = dec.slice(1);
    const base = 1e6;
    let lowBits = 0;
    let highBits = 0;
    function add1e6digit(begin, end) {
      const digit1e6 = Number(dec.slice(begin, end));
      highBits *= base;
      lowBits = lowBits * base + digit1e6;
      if (lowBits >= TWO_PWR_32_DBL$1) {
        highBits = highBits + (lowBits / TWO_PWR_32_DBL$1 | 0);
        lowBits = lowBits % TWO_PWR_32_DBL$1;
      }
    }
    add1e6digit(-24, -18);
    add1e6digit(-18, -12);
    add1e6digit(-12, -6);
    add1e6digit(-6);
    return [minus, lowBits, highBits];
  }
  function int64toString(bitsLow, bitsHigh) {
    if (bitsHigh >>> 0 <= 2097151) {
      return "" + (TWO_PWR_32_DBL$1 * bitsHigh + (bitsLow >>> 0));
    }
    let low = bitsLow & 16777215;
    let mid = (bitsLow >>> 24 | bitsHigh << 8) >>> 0 & 16777215;
    let high = bitsHigh >> 16 & 65535;
    let digitA = low + mid * 6777216 + high * 6710656;
    let digitB = mid + high * 8147497;
    let digitC = high * 2;
    let base = 1e7;
    if (digitA >= base) {
      digitB += Math.floor(digitA / base);
      digitA %= base;
    }
    if (digitB >= base) {
      digitC += Math.floor(digitB / base);
      digitB %= base;
    }
    function decimalFrom1e7(digit1e7, needLeadingZeros) {
      let partial = digit1e7 ? String(digit1e7) : "";
      if (needLeadingZeros) {
        return "0000000".slice(partial.length) + partial;
      }
      return partial;
    }
    return decimalFrom1e7(
      digitC,
      /*needLeadingZeros=*/
      0
    ) + decimalFrom1e7(
      digitB,
      /*needLeadingZeros=*/
      digitC
    ) + // If the final 1e7 digit didn't need leading zeros, we would have
    // returned via the trivial code path at the top.
    decimalFrom1e7(
      digitA,
      /*needLeadingZeros=*/
      1
    );
  }
  function varint32write(value, bytes) {
    if (value >= 0) {
      while (value > 127) {
        bytes.push(value & 127 | 128);
        value = value >>> 7;
      }
      bytes.push(value);
    } else {
      for (let i = 0; i < 9; i++) {
        bytes.push(value & 127 | 128);
        value = value >> 7;
      }
      bytes.push(1);
    }
  }
  function varint32read() {
    let b = this.buf[this.pos++];
    let result = b & 127;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 7;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 14;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 21;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 15) << 28;
    for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
      b = this.buf[this.pos++];
    if ((b & 128) != 0)
      throw new Error("invalid varint");
    this.assertBounds();
    return result >>> 0;
  }
  let BI;
  function detectBi() {
    const dv = new DataView(new ArrayBuffer(8));
    const ok = globalThis.BigInt !== void 0 && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function";
    BI = ok ? {
      MIN: BigInt("-9223372036854775808"),
      MAX: BigInt("9223372036854775807"),
      UMIN: BigInt("0"),
      UMAX: BigInt("18446744073709551615"),
      C: BigInt,
      V: dv
    } : void 0;
  }
  detectBi();
  function assertBi(bi) {
    if (!bi)
      throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support");
  }
  const RE_DECIMAL_STR = /^-?[0-9]+$/;
  const TWO_PWR_32_DBL = 4294967296;
  const HALF_2_PWR_32 = 2147483648;
  class SharedPbLong {
    /**
     * Create a new instance with the given bits.
     */
    constructor(lo, hi) {
      this.lo = lo | 0;
      this.hi = hi | 0;
    }
    /**
     * Is this instance equal to 0?
     */
    isZero() {
      return this.lo == 0 && this.hi == 0;
    }
    /**
     * Convert to a native number.
     */
    toNumber() {
      let result = this.hi * TWO_PWR_32_DBL + (this.lo >>> 0);
      if (!Number.isSafeInteger(result))
        throw new Error("cannot convert to safe number");
      return result;
    }
  }
  class PbULong extends SharedPbLong {
    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value) {
      if (BI)
        switch (typeof value) {
          case "string":
            if (value == "0")
              return this.ZERO;
            if (value == "")
              throw new Error("string is no integer");
            value = BI.C(value);
          case "number":
            if (value === 0)
              return this.ZERO;
            value = BI.C(value);
          case "bigint":
            if (!value)
              return this.ZERO;
            if (value < BI.UMIN)
              throw new Error("signed value for ulong");
            if (value > BI.UMAX)
              throw new Error("ulong too large");
            BI.V.setBigUint64(0, value, true);
            return new PbULong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
        }
      else
        switch (typeof value) {
          case "string":
            if (value == "0")
              return this.ZERO;
            value = value.trim();
            if (!RE_DECIMAL_STR.test(value))
              throw new Error("string is no integer");
            let [minus, lo, hi] = int64fromString(value);
            if (minus)
              throw new Error("signed value for ulong");
            return new PbULong(lo, hi);
          case "number":
            if (value == 0)
              return this.ZERO;
            if (!Number.isSafeInteger(value))
              throw new Error("number is no integer");
            if (value < 0)
              throw new Error("signed value for ulong");
            return new PbULong(value, value / TWO_PWR_32_DBL);
        }
      throw new Error("unknown value " + typeof value);
    }
    /**
     * Convert to decimal string.
     */
    toString() {
      return BI ? this.toBigInt().toString() : int64toString(this.lo, this.hi);
    }
    /**
     * Convert to native bigint.
     */
    toBigInt() {
      assertBi(BI);
      BI.V.setInt32(0, this.lo, true);
      BI.V.setInt32(4, this.hi, true);
      return BI.V.getBigUint64(0, true);
    }
  }
  PbULong.ZERO = new PbULong(0, 0);
  class PbLong extends SharedPbLong {
    /**
     * Create instance from a `string`, `number` or `bigint`.
     */
    static from(value) {
      if (BI)
        switch (typeof value) {
          case "string":
            if (value == "0")
              return this.ZERO;
            if (value == "")
              throw new Error("string is no integer");
            value = BI.C(value);
          case "number":
            if (value === 0)
              return this.ZERO;
            value = BI.C(value);
          case "bigint":
            if (!value)
              return this.ZERO;
            if (value < BI.MIN)
              throw new Error("signed long too small");
            if (value > BI.MAX)
              throw new Error("signed long too large");
            BI.V.setBigInt64(0, value, true);
            return new PbLong(BI.V.getInt32(0, true), BI.V.getInt32(4, true));
        }
      else
        switch (typeof value) {
          case "string":
            if (value == "0")
              return this.ZERO;
            value = value.trim();
            if (!RE_DECIMAL_STR.test(value))
              throw new Error("string is no integer");
            let [minus, lo, hi] = int64fromString(value);
            if (minus) {
              if (hi > HALF_2_PWR_32 || hi == HALF_2_PWR_32 && lo != 0)
                throw new Error("signed long too small");
            } else if (hi >= HALF_2_PWR_32)
              throw new Error("signed long too large");
            let pbl = new PbLong(lo, hi);
            return minus ? pbl.negate() : pbl;
          case "number":
            if (value == 0)
              return this.ZERO;
            if (!Number.isSafeInteger(value))
              throw new Error("number is no integer");
            return value > 0 ? new PbLong(value, value / TWO_PWR_32_DBL) : new PbLong(-value, -value / TWO_PWR_32_DBL).negate();
        }
      throw new Error("unknown value " + typeof value);
    }
    /**
     * Do we have a minus sign?
     */
    isNegative() {
      return (this.hi & HALF_2_PWR_32) !== 0;
    }
    /**
     * Negate two's complement.
     * Invert all the bits and add one to the result.
     */
    negate() {
      let hi = ~this.hi, lo = this.lo;
      if (lo)
        lo = ~lo + 1;
      else
        hi += 1;
      return new PbLong(lo, hi);
    }
    /**
     * Convert to decimal string.
     */
    toString() {
      if (BI)
        return this.toBigInt().toString();
      if (this.isNegative()) {
        let n = this.negate();
        return "-" + int64toString(n.lo, n.hi);
      }
      return int64toString(this.lo, this.hi);
    }
    /**
     * Convert to native bigint.
     */
    toBigInt() {
      assertBi(BI);
      BI.V.setInt32(0, this.lo, true);
      BI.V.setInt32(4, this.hi, true);
      return BI.V.getBigInt64(0, true);
    }
  }
  PbLong.ZERO = new PbLong(0, 0);
  const defaultsRead$1 = {
    readUnknownField: true,
    readerFactory: (bytes) => new BinaryReader(bytes)
  };
  function binaryReadOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsRead$1), options) : defaultsRead$1;
  }
  class BinaryReader {
    constructor(buf, textDecoder) {
      this.varint64 = varint64read;
      this.uint32 = varint32read;
      this.buf = buf;
      this.len = buf.length;
      this.pos = 0;
      this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder("utf-8", {
        fatal: true,
        ignoreBOM: true
      });
    }
    /**
     * Reads a tag - field number and wire type.
     */
    tag() {
      let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
      if (fieldNo <= 0 || wireType < 0 || wireType > 5)
        throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
      return [fieldNo, wireType];
    }
    /**
     * Skip one element on the wire and return the skipped data.
     * Supports WireType.StartGroup since v2.0.0-alpha.23.
     */
    skip(wireType) {
      let start = this.pos;
      switch (wireType) {
        case WireType.Varint:
          while (this.buf[this.pos++] & 128) {
          }
          break;
        case WireType.Bit64:
          this.pos += 4;
        case WireType.Bit32:
          this.pos += 4;
          break;
        case WireType.LengthDelimited:
          let len = this.uint32();
          this.pos += len;
          break;
        case WireType.StartGroup:
          let t;
          while ((t = this.tag()[1]) !== WireType.EndGroup) {
            this.skip(t);
          }
          break;
        default:
          throw new Error("cant skip wire type " + wireType);
      }
      this.assertBounds();
      return this.buf.subarray(start, this.pos);
    }
    /**
     * Throws error if position in byte array is out of range.
     */
    assertBounds() {
      if (this.pos > this.len)
        throw new RangeError("premature EOF");
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32() {
      return this.uint32() | 0;
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32() {
      let zze = this.uint32();
      return zze >>> 1 ^ -(zze & 1);
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64() {
      return new PbLong(...this.varint64());
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64() {
      return new PbULong(...this.varint64());
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64() {
      let [lo, hi] = this.varint64();
      let s = -(lo & 1);
      lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
      hi = hi >>> 1 ^ s;
      return new PbLong(lo, hi);
    }
    /**
     * Read a `bool` field, a variant.
     */
    bool() {
      let [lo, hi] = this.varint64();
      return lo !== 0 || hi !== 0;
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64() {
      return new PbULong(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64() {
      return new PbLong(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes() {
      let len = this.uint32();
      let start = this.pos;
      this.pos += len;
      this.assertBounds();
      return this.buf.subarray(start, start + len);
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  }
  function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }
  const FLOAT32_MAX = 34028234663852886e22, FLOAT32_MIN = -34028234663852886e22, UINT32_MAX = 4294967295, INT32_MAX = 2147483647, INT32_MIN = -2147483648;
  function assertInt32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid int 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
      throw new Error("invalid int 32: " + arg);
  }
  function assertUInt32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid uint 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
      throw new Error("invalid uint 32: " + arg);
  }
  function assertFloat32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid float 32: " + typeof arg);
    if (!Number.isFinite(arg))
      return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
      throw new Error("invalid float 32: " + arg);
  }
  const defaultsWrite$1 = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter()
  };
  function binaryWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsWrite$1), options) : defaultsWrite$1;
  }
  class BinaryWriter {
    constructor(textEncoder) {
      this.stack = [];
      this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
      this.chunks = [];
      this.buf = [];
    }
    /**
     * Return all bytes written and reset this writer.
     */
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let len = 0;
      for (let i = 0; i < this.chunks.length; i++)
        len += this.chunks[i].length;
      let bytes = new Uint8Array(len);
      let offset = 0;
      for (let i = 0; i < this.chunks.length; i++) {
        bytes.set(this.chunks[i], offset);
        offset += this.chunks[i].length;
      }
      this.chunks = [];
      return bytes;
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork() {
      this.stack.push({ chunks: this.chunks, buf: this.buf });
      this.chunks = [];
      this.buf = [];
      return this;
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join() {
      let chunk = this.finish();
      let prev = this.stack.pop();
      if (!prev)
        throw new Error("invalid state, fork stack empty");
      this.chunks = prev.chunks;
      this.buf = prev.buf;
      this.uint32(chunk.byteLength);
      return this.raw(chunk);
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo, type) {
      return this.uint32((fieldNo << 3 | type) >>> 0);
    }
    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk) {
      if (this.buf.length) {
        this.chunks.push(new Uint8Array(this.buf));
        this.buf = [];
      }
      this.chunks.push(chunk);
      return this;
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value) {
      assertUInt32(value);
      while (value > 127) {
        this.buf.push(value & 127 | 128);
        value = value >>> 7;
      }
      this.buf.push(value);
      return this;
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value) {
      assertInt32(value);
      varint32write(value, this.buf);
      return this;
    }
    /**
     * Write a `bool` value, a variant.
     */
    bool(value) {
      this.buf.push(value ? 1 : 0);
      return this;
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value) {
      this.uint32(value.byteLength);
      return this.raw(value);
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value) {
      let chunk = this.textEncoder.encode(value);
      this.uint32(chunk.byteLength);
      return this.raw(chunk);
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value) {
      assertFloat32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setFloat32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value) {
      let chunk = new Uint8Array(8);
      new DataView(chunk.buffer).setFloat64(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value) {
      assertUInt32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setUint32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value) {
      assertInt32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setInt32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value) {
      assertInt32(value);
      value = (value << 1 ^ value >> 31) >>> 0;
      varint32write(value, this.buf);
      return this;
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value) {
      let chunk = new Uint8Array(8);
      let view = new DataView(chunk.buffer);
      let long = PbLong.from(value);
      view.setInt32(0, long.lo, true);
      view.setInt32(4, long.hi, true);
      return this.raw(chunk);
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value) {
      let chunk = new Uint8Array(8);
      let view = new DataView(chunk.buffer);
      let long = PbULong.from(value);
      view.setInt32(0, long.lo, true);
      view.setInt32(4, long.hi, true);
      return this.raw(chunk);
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value) {
      let long = PbLong.from(value);
      varint64write(long.lo, long.hi, this.buf);
      return this;
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value) {
      let long = PbLong.from(value), sign = long.hi >> 31, lo = long.lo << 1 ^ sign, hi = (long.hi << 1 | long.lo >>> 31) ^ sign;
      varint64write(lo, hi, this.buf);
      return this;
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value) {
      let long = PbULong.from(value);
      varint64write(long.lo, long.hi, this.buf);
      return this;
    }
  }
  const defaultsWrite = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0
  }, defaultsRead = {
    ignoreUnknownFields: false
  };
  function jsonReadOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsRead), options) : defaultsRead;
  }
  function jsonWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, defaultsWrite), options) : defaultsWrite;
  }
  const MESSAGE_TYPE = Symbol.for("protobuf-ts/message-type");
  function lowerCamelCase(snakeCase) {
    let capNext = false;
    const sb = [];
    for (let i = 0; i < snakeCase.length; i++) {
      let next = snakeCase.charAt(i);
      if (next == "_") {
        capNext = true;
      } else if (/\d/.test(next)) {
        sb.push(next);
        capNext = true;
      } else if (capNext) {
        sb.push(next.toUpperCase());
        capNext = false;
      } else if (i == 0) {
        sb.push(next.toLowerCase());
      } else {
        sb.push(next);
      }
    }
    return sb.join("");
  }
  var ScalarType;
  (function(ScalarType2) {
    ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
    ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
    ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
    ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
    ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
    ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
    ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
    ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
    ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
    ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
    ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
    ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
    ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
    ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
    ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
  })(ScalarType || (ScalarType = {}));
  var LongType;
  (function(LongType2) {
    LongType2[LongType2["BIGINT"] = 0] = "BIGINT";
    LongType2[LongType2["STRING"] = 1] = "STRING";
    LongType2[LongType2["NUMBER"] = 2] = "NUMBER";
  })(LongType || (LongType = {}));
  var RepeatType;
  (function(RepeatType2) {
    RepeatType2[RepeatType2["NO"] = 0] = "NO";
    RepeatType2[RepeatType2["PACKED"] = 1] = "PACKED";
    RepeatType2[RepeatType2["UNPACKED"] = 2] = "UNPACKED";
  })(RepeatType || (RepeatType = {}));
  function normalizeFieldInfo(field) {
    var _a, _b, _c, _d;
    field.localName = (_a = field.localName) !== null && _a !== void 0 ? _a : lowerCamelCase(field.name);
    field.jsonName = (_b = field.jsonName) !== null && _b !== void 0 ? _b : lowerCamelCase(field.name);
    field.repeat = (_c = field.repeat) !== null && _c !== void 0 ? _c : RepeatType.NO;
    field.opt = (_d = field.opt) !== null && _d !== void 0 ? _d : field.repeat ? false : field.oneof ? false : field.kind == "message";
    return field;
  }
  function isOneofGroup(any) {
    if (typeof any != "object" || any === null || !any.hasOwnProperty("oneofKind")) {
      return false;
    }
    switch (typeof any.oneofKind) {
      case "string":
        if (any[any.oneofKind] === void 0)
          return false;
        return Object.keys(any).length == 2;
      case "undefined":
        return Object.keys(any).length == 1;
      default:
        return false;
    }
  }
  class ReflectionTypeCheck {
    constructor(info) {
      var _a;
      this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : [];
    }
    prepare() {
      if (this.data)
        return;
      const req = [], known = [], oneofs = [];
      for (let field of this.fields) {
        if (field.oneof) {
          if (!oneofs.includes(field.oneof)) {
            oneofs.push(field.oneof);
            req.push(field.oneof);
            known.push(field.oneof);
          }
        } else {
          known.push(field.localName);
          switch (field.kind) {
            case "scalar":
            case "enum":
              if (!field.opt || field.repeat)
                req.push(field.localName);
              break;
            case "message":
              if (field.repeat)
                req.push(field.localName);
              break;
            case "map":
              req.push(field.localName);
              break;
          }
        }
      }
      this.data = { req, known, oneofs: Object.values(oneofs) };
    }
    /**
     * Is the argument a valid message as specified by the
     * reflection information?
     *
     * Checks all field types recursively. The `depth`
     * specifies how deep into the structure the check will be.
     *
     * With a depth of 0, only the presence of fields
     * is checked.
     *
     * With a depth of 1 or more, the field types are checked.
     *
     * With a depth of 2 or more, the members of map, repeated
     * and message fields are checked.
     *
     * Message fields will be checked recursively with depth - 1.
     *
     * The number of map entries / repeated values being checked
     * is < depth.
     */
    is(message, depth, allowExcessProperties = false) {
      if (depth < 0)
        return true;
      if (message === null || message === void 0 || typeof message != "object")
        return false;
      this.prepare();
      let keys = Object.keys(message), data = this.data;
      if (keys.length < data.req.length || data.req.some((n) => !keys.includes(n)))
        return false;
      if (!allowExcessProperties) {
        if (keys.some((k) => !data.known.includes(k)))
          return false;
      }
      if (depth < 1) {
        return true;
      }
      for (const name of data.oneofs) {
        const group = message[name];
        if (!isOneofGroup(group))
          return false;
        if (group.oneofKind === void 0)
          continue;
        const field = this.fields.find((f) => f.localName === group.oneofKind);
        if (!field)
          return false;
        if (!this.field(group[group.oneofKind], field, allowExcessProperties, depth))
          return false;
      }
      for (const field of this.fields) {
        if (field.oneof !== void 0)
          continue;
        if (!this.field(message[field.localName], field, allowExcessProperties, depth))
          return false;
      }
      return true;
    }
    field(arg, field, allowExcessProperties, depth) {
      let repeated = field.repeat;
      switch (field.kind) {
        case "scalar":
          if (arg === void 0)
            return field.opt;
          if (repeated)
            return this.scalars(arg, field.T, depth, field.L);
          return this.scalar(arg, field.T, field.L);
        case "enum":
          if (arg === void 0)
            return field.opt;
          if (repeated)
            return this.scalars(arg, ScalarType.INT32, depth);
          return this.scalar(arg, ScalarType.INT32);
        case "message":
          if (arg === void 0)
            return true;
          if (repeated)
            return this.messages(arg, field.T(), allowExcessProperties, depth);
          return this.message(arg, field.T(), allowExcessProperties, depth);
        case "map":
          if (typeof arg != "object" || arg === null)
            return false;
          if (depth < 2)
            return true;
          if (!this.mapKeys(arg, field.K, depth))
            return false;
          switch (field.V.kind) {
            case "scalar":
              return this.scalars(Object.values(arg), field.V.T, depth, field.V.L);
            case "enum":
              return this.scalars(Object.values(arg), ScalarType.INT32, depth);
            case "message":
              return this.messages(Object.values(arg), field.V.T(), allowExcessProperties, depth);
          }
          break;
      }
      return true;
    }
    message(arg, type, allowExcessProperties, depth) {
      if (allowExcessProperties) {
        return type.isAssignable(arg, depth);
      }
      return type.is(arg, depth);
    }
    messages(arg, type, allowExcessProperties, depth) {
      if (!Array.isArray(arg))
        return false;
      if (depth < 2)
        return true;
      if (allowExcessProperties) {
        for (let i = 0; i < arg.length && i < depth; i++)
          if (!type.isAssignable(arg[i], depth - 1))
            return false;
      } else {
        for (let i = 0; i < arg.length && i < depth; i++)
          if (!type.is(arg[i], depth - 1))
            return false;
      }
      return true;
    }
    scalar(arg, type, longType) {
      let argType = typeof arg;
      switch (type) {
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
          switch (longType) {
            case LongType.BIGINT:
              return argType == "bigint";
            case LongType.NUMBER:
              return argType == "number" && !isNaN(arg);
            default:
              return argType == "string";
          }
        case ScalarType.BOOL:
          return argType == "boolean";
        case ScalarType.STRING:
          return argType == "string";
        case ScalarType.BYTES:
          return arg instanceof Uint8Array;
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
          return argType == "number" && !isNaN(arg);
        default:
          return argType == "number" && Number.isInteger(arg);
      }
    }
    scalars(arg, type, depth, longType) {
      if (!Array.isArray(arg))
        return false;
      if (depth < 2)
        return true;
      if (Array.isArray(arg)) {
        for (let i = 0; i < arg.length && i < depth; i++)
          if (!this.scalar(arg[i], type, longType))
            return false;
      }
      return true;
    }
    mapKeys(map, type, depth) {
      let keys = Object.keys(map);
      switch (type) {
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.UINT32:
          return this.scalars(keys.slice(0, depth).map((k) => parseInt(k)), type, depth);
        case ScalarType.BOOL:
          return this.scalars(keys.slice(0, depth).map((k) => k == "true" ? true : k == "false" ? false : k), type, depth);
        default:
          return this.scalars(keys, type, depth, LongType.STRING);
      }
    }
  }
  function reflectionLongConvert(long, type) {
    switch (type) {
      case LongType.BIGINT:
        return long.toBigInt();
      case LongType.NUMBER:
        return long.toNumber();
      default:
        return long.toString();
    }
  }
  class ReflectionJsonReader {
    constructor(info) {
      this.info = info;
    }
    prepare() {
      var _a;
      if (this.fMap === void 0) {
        this.fMap = {};
        const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : [];
        for (const field of fieldsInput) {
          this.fMap[field.name] = field;
          this.fMap[field.jsonName] = field;
          this.fMap[field.localName] = field;
        }
      }
    }
    // Cannot parse JSON <type of jsonValue> for <type name>#<fieldName>.
    assert(condition, fieldName, jsonValue) {
      if (!condition) {
        let what = typeofJsonValue(jsonValue);
        if (what == "number" || what == "boolean")
          what = jsonValue.toString();
        throw new Error(`Cannot parse JSON ${what} for ${this.info.typeName}#${fieldName}`);
      }
    }
    /**
     * Reads a message from canonical JSON format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read(input, message, options) {
      this.prepare();
      const oneofsHandled = [];
      for (const [jsonKey, jsonValue] of Object.entries(input)) {
        const field = this.fMap[jsonKey];
        if (!field) {
          if (!options.ignoreUnknownFields)
            throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${jsonKey}`);
          continue;
        }
        const localName = field.localName;
        let target;
        if (field.oneof) {
          if (jsonValue === null && (field.kind !== "enum" || field.T()[0] !== "google.protobuf.NullValue")) {
            continue;
          }
          if (oneofsHandled.includes(field.oneof))
            throw new Error(`Multiple members of the oneof group "${field.oneof}" of ${this.info.typeName} are present in JSON.`);
          oneofsHandled.push(field.oneof);
          target = message[field.oneof] = {
            oneofKind: localName
          };
        } else {
          target = message;
        }
        if (field.kind == "map") {
          if (jsonValue === null) {
            continue;
          }
          this.assert(isJsonObject(jsonValue), field.name, jsonValue);
          const fieldObj = target[localName];
          for (const [jsonObjKey, jsonObjValue] of Object.entries(jsonValue)) {
            this.assert(jsonObjValue !== null, field.name + " map value", null);
            let val;
            switch (field.V.kind) {
              case "message":
                val = field.V.T().internalJsonRead(jsonObjValue, options);
                break;
              case "enum":
                val = this.enum(field.V.T(), jsonObjValue, field.name, options.ignoreUnknownFields);
                if (val === false)
                  continue;
                break;
              case "scalar":
                val = this.scalar(jsonObjValue, field.V.T, field.V.L, field.name);
                break;
            }
            this.assert(val !== void 0, field.name + " map value", jsonObjValue);
            let key = jsonObjKey;
            if (field.K == ScalarType.BOOL)
              key = key == "true" ? true : key == "false" ? false : key;
            key = this.scalar(key, field.K, LongType.STRING, field.name).toString();
            fieldObj[key] = val;
          }
        } else if (field.repeat) {
          if (jsonValue === null)
            continue;
          this.assert(Array.isArray(jsonValue), field.name, jsonValue);
          const fieldArr = target[localName];
          for (const jsonItem of jsonValue) {
            this.assert(jsonItem !== null, field.name, null);
            let val;
            switch (field.kind) {
              case "message":
                val = field.T().internalJsonRead(jsonItem, options);
                break;
              case "enum":
                val = this.enum(field.T(), jsonItem, field.name, options.ignoreUnknownFields);
                if (val === false)
                  continue;
                break;
              case "scalar":
                val = this.scalar(jsonItem, field.T, field.L, field.name);
                break;
            }
            this.assert(val !== void 0, field.name, jsonValue);
            fieldArr.push(val);
          }
        } else {
          switch (field.kind) {
            case "message":
              if (jsonValue === null && field.T().typeName != "google.protobuf.Value") {
                this.assert(field.oneof === void 0, field.name + " (oneof member)", null);
                continue;
              }
              target[localName] = field.T().internalJsonRead(jsonValue, options, target[localName]);
              break;
            case "enum":
              if (jsonValue === null)
                continue;
              let val = this.enum(field.T(), jsonValue, field.name, options.ignoreUnknownFields);
              if (val === false)
                continue;
              target[localName] = val;
              break;
            case "scalar":
              if (jsonValue === null)
                continue;
              target[localName] = this.scalar(jsonValue, field.T, field.L, field.name);
              break;
          }
        }
      }
    }
    /**
     * Returns `false` for unrecognized string representations.
     *
     * google.protobuf.NullValue accepts only JSON `null` (or the old `"NULL_VALUE"`).
     */
    enum(type, json, fieldName, ignoreUnknownFields) {
      if (type[0] == "google.protobuf.NullValue")
        assert(json === null || json === "NULL_VALUE", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} only accepts null.`);
      if (json === null)
        return 0;
      switch (typeof json) {
        case "number":
          assert(Number.isInteger(json), `Unable to parse field ${this.info.typeName}#${fieldName}, enum can only be integral number, got ${json}.`);
          return json;
        case "string":
          let localEnumName = json;
          if (type[2] && json.substring(0, type[2].length) === type[2])
            localEnumName = json.substring(type[2].length);
          let enumNumber = type[1][localEnumName];
          if (typeof enumNumber === "undefined" && ignoreUnknownFields) {
            return false;
          }
          assert(typeof enumNumber == "number", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} has no value for "${json}".`);
          return enumNumber;
      }
      assert(false, `Unable to parse field ${this.info.typeName}#${fieldName}, cannot parse enum value from ${typeof json}".`);
    }
    scalar(json, type, longType, fieldName) {
      let e;
      try {
        switch (type) {
          // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
          // Either numbers or strings are accepted. Exponent notation is also accepted.
          case ScalarType.DOUBLE:
          case ScalarType.FLOAT:
            if (json === null)
              return 0;
            if (json === "NaN")
              return Number.NaN;
            if (json === "Infinity")
              return Number.POSITIVE_INFINITY;
            if (json === "-Infinity")
              return Number.NEGATIVE_INFINITY;
            if (json === "") {
              e = "empty string";
              break;
            }
            if (typeof json == "string" && json.trim().length !== json.length) {
              e = "extra whitespace";
              break;
            }
            if (typeof json != "string" && typeof json != "number") {
              break;
            }
            let float = Number(json);
            if (Number.isNaN(float)) {
              e = "not a number";
              break;
            }
            if (!Number.isFinite(float)) {
              e = "too large or small";
              break;
            }
            if (type == ScalarType.FLOAT)
              assertFloat32(float);
            return float;
          // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
          case ScalarType.INT32:
          case ScalarType.FIXED32:
          case ScalarType.SFIXED32:
          case ScalarType.SINT32:
          case ScalarType.UINT32:
            if (json === null)
              return 0;
            let int32;
            if (typeof json == "number")
              int32 = json;
            else if (json === "")
              e = "empty string";
            else if (typeof json == "string") {
              if (json.trim().length !== json.length)
                e = "extra whitespace";
              else
                int32 = Number(json);
            }
            if (int32 === void 0)
              break;
            if (type == ScalarType.UINT32)
              assertUInt32(int32);
            else
              assertInt32(int32);
            return int32;
          // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
          case ScalarType.INT64:
          case ScalarType.SFIXED64:
          case ScalarType.SINT64:
            if (json === null)
              return reflectionLongConvert(PbLong.ZERO, longType);
            if (typeof json != "number" && typeof json != "string")
              break;
            return reflectionLongConvert(PbLong.from(json), longType);
          case ScalarType.FIXED64:
          case ScalarType.UINT64:
            if (json === null)
              return reflectionLongConvert(PbULong.ZERO, longType);
            if (typeof json != "number" && typeof json != "string")
              break;
            return reflectionLongConvert(PbULong.from(json), longType);
          // bool:
          case ScalarType.BOOL:
            if (json === null)
              return false;
            if (typeof json !== "boolean")
              break;
            return json;
          // string:
          case ScalarType.STRING:
            if (json === null)
              return "";
            if (typeof json !== "string") {
              e = "extra whitespace";
              break;
            }
            try {
              encodeURIComponent(json);
            } catch (e2) {
              e2 = "invalid UTF8";
              break;
            }
            return json;
          // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
          // Either standard or URL-safe base64 encoding with/without paddings are accepted.
          case ScalarType.BYTES:
            if (json === null || json === "")
              return new Uint8Array(0);
            if (typeof json !== "string")
              break;
            return base64decode(json);
        }
      } catch (error) {
        e = error.message;
      }
      this.assert(false, fieldName + (e ? " - " + e : ""), json);
    }
  }
  class ReflectionJsonWriter {
    constructor(info) {
      var _a;
      this.fields = (_a = info.fields) !== null && _a !== void 0 ? _a : [];
    }
    /**
     * Converts the message to a JSON object, based on the field descriptors.
     */
    write(message, options) {
      const json = {}, source = message;
      for (const field of this.fields) {
        if (!field.oneof) {
          let jsonValue2 = this.field(field, source[field.localName], options);
          if (jsonValue2 !== void 0)
            json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue2;
          continue;
        }
        const group = source[field.oneof];
        if (group.oneofKind !== field.localName)
          continue;
        const opt = field.kind == "scalar" || field.kind == "enum" ? Object.assign(Object.assign({}, options), { emitDefaultValues: true }) : options;
        let jsonValue = this.field(field, group[field.localName], opt);
        assert(jsonValue !== void 0);
        json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
      }
      return json;
    }
    field(field, value, options) {
      let jsonValue = void 0;
      if (field.kind == "map") {
        assert(typeof value == "object" && value !== null);
        const jsonObj = {};
        switch (field.V.kind) {
          case "scalar":
            for (const [entryKey, entryValue] of Object.entries(value)) {
              const val = this.scalar(field.V.T, entryValue, field.name, false, true);
              assert(val !== void 0);
              jsonObj[entryKey.toString()] = val;
            }
            break;
          case "message":
            const messageType = field.V.T();
            for (const [entryKey, entryValue] of Object.entries(value)) {
              const val = this.message(messageType, entryValue, field.name, options);
              assert(val !== void 0);
              jsonObj[entryKey.toString()] = val;
            }
            break;
          case "enum":
            const enumInfo = field.V.T();
            for (const [entryKey, entryValue] of Object.entries(value)) {
              assert(entryValue === void 0 || typeof entryValue == "number");
              const val = this.enum(enumInfo, entryValue, field.name, false, true, options.enumAsInteger);
              assert(val !== void 0);
              jsonObj[entryKey.toString()] = val;
            }
            break;
        }
        if (options.emitDefaultValues || Object.keys(jsonObj).length > 0)
          jsonValue = jsonObj;
      } else if (field.repeat) {
        assert(Array.isArray(value));
        const jsonArr = [];
        switch (field.kind) {
          case "scalar":
            for (let i = 0; i < value.length; i++) {
              const val = this.scalar(field.T, value[i], field.name, field.opt, true);
              assert(val !== void 0);
              jsonArr.push(val);
            }
            break;
          case "enum":
            const enumInfo = field.T();
            for (let i = 0; i < value.length; i++) {
              assert(value[i] === void 0 || typeof value[i] == "number");
              const val = this.enum(enumInfo, value[i], field.name, field.opt, true, options.enumAsInteger);
              assert(val !== void 0);
              jsonArr.push(val);
            }
            break;
          case "message":
            const messageType = field.T();
            for (let i = 0; i < value.length; i++) {
              const val = this.message(messageType, value[i], field.name, options);
              assert(val !== void 0);
              jsonArr.push(val);
            }
            break;
        }
        if (options.emitDefaultValues || jsonArr.length > 0 || options.emitDefaultValues)
          jsonValue = jsonArr;
      } else {
        switch (field.kind) {
          case "scalar":
            jsonValue = this.scalar(field.T, value, field.name, field.opt, options.emitDefaultValues);
            break;
          case "enum":
            jsonValue = this.enum(field.T(), value, field.name, field.opt, options.emitDefaultValues, options.enumAsInteger);
            break;
          case "message":
            jsonValue = this.message(field.T(), value, field.name, options);
            break;
        }
      }
      return jsonValue;
    }
    /**
     * Returns `null` as the default for google.protobuf.NullValue.
     */
    enum(type, value, fieldName, optional, emitDefaultValues, enumAsInteger) {
      if (type[0] == "google.protobuf.NullValue")
        return !emitDefaultValues && !optional ? void 0 : null;
      if (value === void 0) {
        assert(optional);
        return void 0;
      }
      if (value === 0 && !emitDefaultValues && !optional)
        return void 0;
      assert(typeof value == "number");
      assert(Number.isInteger(value));
      if (enumAsInteger || !type[1].hasOwnProperty(value))
        return value;
      if (type[2])
        return type[2] + type[1][value];
      return type[1][value];
    }
    message(type, value, fieldName, options) {
      if (value === void 0)
        return options.emitDefaultValues ? null : void 0;
      return type.internalJsonWrite(value, options);
    }
    scalar(type, value, fieldName, optional, emitDefaultValues) {
      if (value === void 0) {
        assert(optional);
        return void 0;
      }
      const ed = emitDefaultValues || optional;
      switch (type) {
        // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
        case ScalarType.INT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
          if (value === 0)
            return ed ? 0 : void 0;
          assertInt32(value);
          return value;
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
          if (value === 0)
            return ed ? 0 : void 0;
          assertUInt32(value);
          return value;
        // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
        // Either numbers or strings are accepted. Exponent notation is also accepted.
        case ScalarType.FLOAT:
          assertFloat32(value);
        case ScalarType.DOUBLE:
          if (value === 0)
            return ed ? 0 : void 0;
          assert(typeof value == "number");
          if (Number.isNaN(value))
            return "NaN";
          if (value === Number.POSITIVE_INFINITY)
            return "Infinity";
          if (value === Number.NEGATIVE_INFINITY)
            return "-Infinity";
          return value;
        // string:
        case ScalarType.STRING:
          if (value === "")
            return ed ? "" : void 0;
          assert(typeof value == "string");
          return value;
        // bool:
        case ScalarType.BOOL:
          if (value === false)
            return ed ? false : void 0;
          assert(typeof value == "boolean");
          return value;
        // JSON value will be a decimal string. Either numbers or strings are accepted.
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
          assert(typeof value == "number" || typeof value == "string" || typeof value == "bigint");
          let ulong = PbULong.from(value);
          if (ulong.isZero() && !ed)
            return void 0;
          return ulong.toString();
        // JSON value will be a decimal string. Either numbers or strings are accepted.
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
          assert(typeof value == "number" || typeof value == "string" || typeof value == "bigint");
          let long = PbLong.from(value);
          if (long.isZero() && !ed)
            return void 0;
          return long.toString();
        // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
        // Either standard or URL-safe base64 encoding with/without paddings are accepted.
        case ScalarType.BYTES:
          assert(value instanceof Uint8Array);
          if (!value.byteLength)
            return ed ? "" : void 0;
          return base64encode(value);
      }
    }
  }
  function reflectionScalarDefault(type, longType = LongType.STRING) {
    switch (type) {
      case ScalarType.BOOL:
        return false;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
        return reflectionLongConvert(PbULong.ZERO, longType);
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        return reflectionLongConvert(PbLong.ZERO, longType);
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        return 0;
      case ScalarType.BYTES:
        return new Uint8Array(0);
      case ScalarType.STRING:
        return "";
      default:
        return 0;
    }
  }
  class ReflectionBinaryReader {
    constructor(info) {
      this.info = info;
    }
    prepare() {
      var _a;
      if (!this.fieldNoToField) {
        const fieldsInput = (_a = this.info.fields) !== null && _a !== void 0 ? _a : [];
        this.fieldNoToField = new Map(fieldsInput.map((field) => [field.no, field]));
      }
    }
    /**
     * Reads a message from binary format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read(reader, message, options, length) {
      this.prepare();
      const end = length === void 0 ? reader.len : reader.pos + length;
      while (reader.pos < end) {
        const [fieldNo, wireType] = reader.tag(), field = this.fieldNoToField.get(fieldNo);
        if (!field) {
          let u = options.readUnknownField;
          if (u == "throw")
            throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.info.typeName}`);
          let d = reader.skip(wireType);
          if (u !== false)
            (u === true ? UnknownFieldHandler.onRead : u)(this.info.typeName, message, fieldNo, wireType, d);
          continue;
        }
        let target = message, repeated = field.repeat, localName = field.localName;
        if (field.oneof) {
          target = target[field.oneof];
          if (target.oneofKind !== localName)
            target = message[field.oneof] = {
              oneofKind: localName
            };
        }
        switch (field.kind) {
          case "scalar":
          case "enum":
            let T = field.kind == "enum" ? ScalarType.INT32 : field.T;
            let L = field.kind == "scalar" ? field.L : void 0;
            if (repeated) {
              let arr = target[localName];
              if (wireType == WireType.LengthDelimited && T != ScalarType.STRING && T != ScalarType.BYTES) {
                let e = reader.uint32() + reader.pos;
                while (reader.pos < e)
                  arr.push(this.scalar(reader, T, L));
              } else
                arr.push(this.scalar(reader, T, L));
            } else
              target[localName] = this.scalar(reader, T, L);
            break;
          case "message":
            if (repeated) {
              let arr = target[localName];
              let msg = field.T().internalBinaryRead(reader, reader.uint32(), options);
              arr.push(msg);
            } else
              target[localName] = field.T().internalBinaryRead(reader, reader.uint32(), options, target[localName]);
            break;
          case "map":
            let [mapKey, mapVal] = this.mapEntry(field, reader, options);
            target[localName][mapKey] = mapVal;
            break;
        }
      }
    }
    /**
     * Read a map field, expecting key field = 1, value field = 2
     */
    mapEntry(field, reader, options) {
      let length = reader.uint32();
      let end = reader.pos + length;
      let key = void 0;
      let val = void 0;
      while (reader.pos < end) {
        let [fieldNo, wireType] = reader.tag();
        switch (fieldNo) {
          case 1:
            if (field.K == ScalarType.BOOL)
              key = reader.bool().toString();
            else
              key = this.scalar(reader, field.K, LongType.STRING);
            break;
          case 2:
            switch (field.V.kind) {
              case "scalar":
                val = this.scalar(reader, field.V.T, field.V.L);
                break;
              case "enum":
                val = reader.int32();
                break;
              case "message":
                val = field.V.T().internalBinaryRead(reader, reader.uint32(), options);
                break;
            }
            break;
          default:
            throw new Error(`Unknown field ${fieldNo} (wire type ${wireType}) in map entry for ${this.info.typeName}#${field.name}`);
        }
      }
      if (key === void 0) {
        let keyRaw = reflectionScalarDefault(field.K);
        key = field.K == ScalarType.BOOL ? keyRaw.toString() : keyRaw;
      }
      if (val === void 0)
        switch (field.V.kind) {
          case "scalar":
            val = reflectionScalarDefault(field.V.T, field.V.L);
            break;
          case "enum":
            val = 0;
            break;
          case "message":
            val = field.V.T().create();
            break;
        }
      return [key, val];
    }
    scalar(reader, type, longType) {
      switch (type) {
        case ScalarType.INT32:
          return reader.int32();
        case ScalarType.STRING:
          return reader.string();
        case ScalarType.BOOL:
          return reader.bool();
        case ScalarType.DOUBLE:
          return reader.double();
        case ScalarType.FLOAT:
          return reader.float();
        case ScalarType.INT64:
          return reflectionLongConvert(reader.int64(), longType);
        case ScalarType.UINT64:
          return reflectionLongConvert(reader.uint64(), longType);
        case ScalarType.FIXED64:
          return reflectionLongConvert(reader.fixed64(), longType);
        case ScalarType.FIXED32:
          return reader.fixed32();
        case ScalarType.BYTES:
          return reader.bytes();
        case ScalarType.UINT32:
          return reader.uint32();
        case ScalarType.SFIXED32:
          return reader.sfixed32();
        case ScalarType.SFIXED64:
          return reflectionLongConvert(reader.sfixed64(), longType);
        case ScalarType.SINT32:
          return reader.sint32();
        case ScalarType.SINT64:
          return reflectionLongConvert(reader.sint64(), longType);
      }
    }
  }
  class ReflectionBinaryWriter {
    constructor(info) {
      this.info = info;
    }
    prepare() {
      if (!this.fields) {
        const fieldsInput = this.info.fields ? this.info.fields.concat() : [];
        this.fields = fieldsInput.sort((a, b) => a.no - b.no);
      }
    }
    /**
     * Writes the message to binary format.
     */
    write(message, writer, options) {
      this.prepare();
      for (const field of this.fields) {
        let value, emitDefault, repeated = field.repeat, localName = field.localName;
        if (field.oneof) {
          const group = message[field.oneof];
          if (group.oneofKind !== localName)
            continue;
          value = group[localName];
          emitDefault = true;
        } else {
          value = message[localName];
          emitDefault = false;
        }
        switch (field.kind) {
          case "scalar":
          case "enum":
            let T = field.kind == "enum" ? ScalarType.INT32 : field.T;
            if (repeated) {
              assert(Array.isArray(value));
              if (repeated == RepeatType.PACKED)
                this.packed(writer, T, field.no, value);
              else
                for (const item of value)
                  this.scalar(writer, T, field.no, item, true);
            } else if (value === void 0)
              assert(field.opt);
            else
              this.scalar(writer, T, field.no, value, emitDefault || field.opt);
            break;
          case "message":
            if (repeated) {
              assert(Array.isArray(value));
              for (const item of value)
                this.message(writer, options, field.T(), field.no, item);
            } else {
              this.message(writer, options, field.T(), field.no, value);
            }
            break;
          case "map":
            assert(typeof value == "object" && value !== null);
            for (const [key, val] of Object.entries(value))
              this.mapEntry(writer, options, field, key, val);
            break;
        }
      }
      let u = options.writeUnknownFields;
      if (u !== false)
        (u === true ? UnknownFieldHandler.onWrite : u)(this.info.typeName, message, writer);
    }
    mapEntry(writer, options, field, key, value) {
      writer.tag(field.no, WireType.LengthDelimited);
      writer.fork();
      let keyValue = key;
      switch (field.K) {
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
          keyValue = Number.parseInt(key);
          break;
        case ScalarType.BOOL:
          assert(key == "true" || key == "false");
          keyValue = key == "true";
          break;
      }
      this.scalar(writer, field.K, 1, keyValue, true);
      switch (field.V.kind) {
        case "scalar":
          this.scalar(writer, field.V.T, 2, value, true);
          break;
        case "enum":
          this.scalar(writer, ScalarType.INT32, 2, value, true);
          break;
        case "message":
          this.message(writer, options, field.V.T(), 2, value);
          break;
      }
      writer.join();
    }
    message(writer, options, handler, fieldNo, value) {
      if (value === void 0)
        return;
      handler.internalBinaryWrite(value, writer.tag(fieldNo, WireType.LengthDelimited).fork(), options);
      writer.join();
    }
    /**
     * Write a single scalar value.
     */
    scalar(writer, type, fieldNo, value, emitDefault) {
      let [wireType, method, isDefault] = this.scalarInfo(type, value);
      if (!isDefault || emitDefault) {
        writer.tag(fieldNo, wireType);
        writer[method](value);
      }
    }
    /**
     * Write an array of scalar values in packed format.
     */
    packed(writer, type, fieldNo, value) {
      if (!value.length)
        return;
      assert(type !== ScalarType.BYTES && type !== ScalarType.STRING);
      writer.tag(fieldNo, WireType.LengthDelimited);
      writer.fork();
      let [, method] = this.scalarInfo(type);
      for (let i = 0; i < value.length; i++)
        writer[method](value[i]);
      writer.join();
    }
    /**
     * Get information for writing a scalar value.
     *
     * Returns tuple:
     * [0]: appropriate WireType
     * [1]: name of the appropriate method of IBinaryWriter
     * [2]: whether the given value is a default value
     *
     * If argument `value` is omitted, [2] is always false.
     */
    scalarInfo(type, value) {
      let t = WireType.Varint;
      let m;
      let i = value === void 0;
      let d = value === 0;
      switch (type) {
        case ScalarType.INT32:
          m = "int32";
          break;
        case ScalarType.STRING:
          d = i || !value.length;
          t = WireType.LengthDelimited;
          m = "string";
          break;
        case ScalarType.BOOL:
          d = value === false;
          m = "bool";
          break;
        case ScalarType.UINT32:
          m = "uint32";
          break;
        case ScalarType.DOUBLE:
          t = WireType.Bit64;
          m = "double";
          break;
        case ScalarType.FLOAT:
          t = WireType.Bit32;
          m = "float";
          break;
        case ScalarType.INT64:
          d = i || PbLong.from(value).isZero();
          m = "int64";
          break;
        case ScalarType.UINT64:
          d = i || PbULong.from(value).isZero();
          m = "uint64";
          break;
        case ScalarType.FIXED64:
          d = i || PbULong.from(value).isZero();
          t = WireType.Bit64;
          m = "fixed64";
          break;
        case ScalarType.BYTES:
          d = i || !value.byteLength;
          t = WireType.LengthDelimited;
          m = "bytes";
          break;
        case ScalarType.FIXED32:
          t = WireType.Bit32;
          m = "fixed32";
          break;
        case ScalarType.SFIXED32:
          t = WireType.Bit32;
          m = "sfixed32";
          break;
        case ScalarType.SFIXED64:
          d = i || PbLong.from(value).isZero();
          t = WireType.Bit64;
          m = "sfixed64";
          break;
        case ScalarType.SINT32:
          m = "sint32";
          break;
        case ScalarType.SINT64:
          d = i || PbLong.from(value).isZero();
          m = "sint64";
          break;
      }
      return [t, m, i || d];
    }
  }
  function reflectionCreate(type) {
    const msg = type.messagePrototype ? Object.create(type.messagePrototype) : Object.defineProperty({}, MESSAGE_TYPE, { value: type });
    for (let field of type.fields) {
      let name = field.localName;
      if (field.opt)
        continue;
      if (field.oneof)
        msg[field.oneof] = { oneofKind: void 0 };
      else if (field.repeat)
        msg[name] = [];
      else
        switch (field.kind) {
          case "scalar":
            msg[name] = reflectionScalarDefault(field.T, field.L);
            break;
          case "enum":
            msg[name] = 0;
            break;
          case "map":
            msg[name] = {};
            break;
        }
    }
    return msg;
  }
  function reflectionMergePartial(info, target, source) {
    let fieldValue, input = source, output;
    for (let field of info.fields) {
      let name = field.localName;
      if (field.oneof) {
        const group = input[field.oneof];
        if ((group === null || group === void 0 ? void 0 : group.oneofKind) == void 0) {
          continue;
        }
        fieldValue = group[name];
        output = target[field.oneof];
        output.oneofKind = group.oneofKind;
        if (fieldValue == void 0) {
          delete output[name];
          continue;
        }
      } else {
        fieldValue = input[name];
        output = target;
        if (fieldValue == void 0) {
          continue;
        }
      }
      if (field.repeat)
        output[name].length = fieldValue.length;
      switch (field.kind) {
        case "scalar":
        case "enum":
          if (field.repeat)
            for (let i = 0; i < fieldValue.length; i++)
              output[name][i] = fieldValue[i];
          else
            output[name] = fieldValue;
          break;
        case "message":
          let T = field.T();
          if (field.repeat)
            for (let i = 0; i < fieldValue.length; i++)
              output[name][i] = T.create(fieldValue[i]);
          else if (output[name] === void 0)
            output[name] = T.create(fieldValue);
          else
            T.mergePartial(output[name], fieldValue);
          break;
        case "map":
          switch (field.V.kind) {
            case "scalar":
            case "enum":
              Object.assign(output[name], fieldValue);
              break;
            case "message":
              let T2 = field.V.T();
              for (let k of Object.keys(fieldValue))
                output[name][k] = T2.create(fieldValue[k]);
              break;
          }
          break;
      }
    }
  }
  function reflectionEquals(info, a, b) {
    if (a === b)
      return true;
    if (!a || !b)
      return false;
    for (let field of info.fields) {
      let localName = field.localName;
      let val_a = field.oneof ? a[field.oneof][localName] : a[localName];
      let val_b = field.oneof ? b[field.oneof][localName] : b[localName];
      switch (field.kind) {
        case "enum":
        case "scalar":
          let t = field.kind == "enum" ? ScalarType.INT32 : field.T;
          if (!(field.repeat ? repeatedPrimitiveEq(t, val_a, val_b) : primitiveEq(t, val_a, val_b)))
            return false;
          break;
        case "map":
          if (!(field.V.kind == "message" ? repeatedMsgEq(field.V.T(), objectValues(val_a), objectValues(val_b)) : repeatedPrimitiveEq(field.V.kind == "enum" ? ScalarType.INT32 : field.V.T, objectValues(val_a), objectValues(val_b))))
            return false;
          break;
        case "message":
          let T = field.T();
          if (!(field.repeat ? repeatedMsgEq(T, val_a, val_b) : T.equals(val_a, val_b)))
            return false;
          break;
      }
    }
    return true;
  }
  const objectValues = Object.values;
  function primitiveEq(type, a, b) {
    if (a === b)
      return true;
    if (type !== ScalarType.BYTES)
      return false;
    let ba = a;
    let bb = b;
    if (ba.length !== bb.length)
      return false;
    for (let i = 0; i < ba.length; i++)
      if (ba[i] != bb[i])
        return false;
    return true;
  }
  function repeatedPrimitiveEq(type, a, b) {
    if (a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++)
      if (!primitiveEq(type, a[i], b[i]))
        return false;
    return true;
  }
  function repeatedMsgEq(type, a, b) {
    if (a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++)
      if (!type.equals(a[i], b[i]))
        return false;
    return true;
  }
  const baseDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({}));
  const messageTypeDescriptor = baseDescriptors[MESSAGE_TYPE] = {};
  class MessageType {
    constructor(name, fields, options) {
      this.defaultCheckDepth = 16;
      this.typeName = name;
      this.fields = fields.map(normalizeFieldInfo);
      this.options = options !== null && options !== void 0 ? options : {};
      messageTypeDescriptor.value = this;
      this.messagePrototype = Object.create(null, baseDescriptors);
      this.refTypeCheck = new ReflectionTypeCheck(this);
      this.refJsonReader = new ReflectionJsonReader(this);
      this.refJsonWriter = new ReflectionJsonWriter(this);
      this.refBinReader = new ReflectionBinaryReader(this);
      this.refBinWriter = new ReflectionBinaryWriter(this);
    }
    create(value) {
      let message = reflectionCreate(this);
      if (value !== void 0) {
        reflectionMergePartial(this, message, value);
      }
      return message;
    }
    /**
     * Clone the message.
     *
     * Unknown fields are discarded.
     */
    clone(message) {
      let copy = this.create();
      reflectionMergePartial(this, copy, message);
      return copy;
    }
    /**
     * Determines whether two message of the same type have the same field values.
     * Checks for deep equality, traversing repeated fields, oneof groups, maps
     * and messages recursively.
     * Will also return true if both messages are `undefined`.
     */
    equals(a, b) {
      return reflectionEquals(this, a, b);
    }
    /**
     * Is the given value assignable to our message type
     * and contains no [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    is(arg, depth = this.defaultCheckDepth) {
      return this.refTypeCheck.is(arg, depth, false);
    }
    /**
     * Is the given value assignable to our message type,
     * regardless of [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    isAssignable(arg, depth = this.defaultCheckDepth) {
      return this.refTypeCheck.is(arg, depth, true);
    }
    /**
     * Copy partial data into the target message.
     */
    mergePartial(target, source) {
      reflectionMergePartial(this, target, source);
    }
    /**
     * Create a new message from binary format.
     */
    fromBinary(data, options) {
      let opt = binaryReadOptions(options);
      return this.internalBinaryRead(opt.readerFactory(data), data.byteLength, opt);
    }
    /**
     * Read a new message from a JSON value.
     */
    fromJson(json, options) {
      return this.internalJsonRead(json, jsonReadOptions(options));
    }
    /**
     * Read a new message from a JSON string.
     * This is equivalent to `T.fromJson(JSON.parse(json))`.
     */
    fromJsonString(json, options) {
      let value = JSON.parse(json);
      return this.fromJson(value, options);
    }
    /**
     * Write the message to canonical JSON value.
     */
    toJson(message, options) {
      return this.internalJsonWrite(message, jsonWriteOptions(options));
    }
    /**
     * Convert the message to canonical JSON string.
     * This is equivalent to `JSON.stringify(T.toJson(t))`
     */
    toJsonString(message, options) {
      var _a;
      let value = this.toJson(message, options);
      return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Write the message to binary format.
     */
    toBinary(message, options) {
      let opt = binaryWriteOptions(options);
      return this.internalBinaryWrite(message, opt.writerFactory(), opt).finish();
    }
    /**
     * This is an internal method. If you just want to read a message from
     * JSON, use `fromJson()` or `fromJsonString()`.
     *
     * Reads JSON value and merges the fields into the target
     * according to protobuf rules. If the target is omitted,
     * a new instance is created first.
     */
    internalJsonRead(json, options, target) {
      if (json !== null && typeof json == "object" && !Array.isArray(json)) {
        let message = target !== null && target !== void 0 ? target : this.create();
        this.refJsonReader.read(json, message, options);
        return message;
      }
      throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(json)}.`);
    }
    /**
     * This is an internal method. If you just want to write a message
     * to JSON, use `toJson()` or `toJsonString().
     *
     * Writes JSON value and returns it.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.write(message, options);
    }
    /**
     * This is an internal method. If you just want to write a message
     * in binary format, use `toBinary()`.
     *
     * Serializes the message in binary format and appends it to the given
     * writer. Returns passed writer.
     */
    internalBinaryWrite(message, writer, options) {
      this.refBinWriter.write(message, writer, options);
      return writer;
    }
    /**
     * This is an internal method. If you just want to read a message from
     * binary data, use `fromBinary()`.
     *
     * Reads data from binary format and merges the fields into
     * the target according to protobuf rules. If the target is
     * omitted, a new instance is created first.
     */
    internalBinaryRead(reader, length, options, target) {
      let message = target !== null && target !== void 0 ? target : this.create();
      this.refBinReader.read(reader, message, options, length);
      return message;
    }
  }
  class DoubleValue$Type extends MessageType {
    constructor() {
      super("google.protobuf.DoubleValue", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 1
          /*ScalarType.DOUBLE*/
        }
      ]);
    }
    /**
     * Encode `DoubleValue` to JSON number.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(2, message.value, "value", false, true);
    }
    /**
     * Decode `DoubleValue` from JSON number.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 1, void 0, "value");
      return target;
    }
  }
  new DoubleValue$Type();
  class FloatValue$Type extends MessageType {
    constructor() {
      super("google.protobuf.FloatValue", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 2
          /*ScalarType.FLOAT*/
        }
      ]);
    }
    /**
     * Encode `FloatValue` to JSON number.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(1, message.value, "value", false, true);
    }
    /**
     * Decode `FloatValue` from JSON number.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 1, void 0, "value");
      return target;
    }
  }
  new FloatValue$Type();
  class Int64Value$Type extends MessageType {
    constructor() {
      super("google.protobuf.Int64Value", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 3
          /*ScalarType.INT64*/
        }
      ]);
    }
    /**
     * Encode `Int64Value` to JSON string.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(ScalarType.INT64, message.value, "value", false, true);
    }
    /**
     * Decode `Int64Value` from JSON string.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, ScalarType.INT64, LongType.STRING, "value");
      return target;
    }
  }
  const Int64Value = new Int64Value$Type();
  class UInt64Value$Type extends MessageType {
    constructor() {
      super("google.protobuf.UInt64Value", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 4
          /*ScalarType.UINT64*/
        }
      ]);
    }
    /**
     * Encode `UInt64Value` to JSON string.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(ScalarType.UINT64, message.value, "value", false, true);
    }
    /**
     * Decode `UInt64Value` from JSON string.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, ScalarType.UINT64, LongType.STRING, "value");
      return target;
    }
  }
  const UInt64Value = new UInt64Value$Type();
  class Int32Value$Type extends MessageType {
    constructor() {
      super("google.protobuf.Int32Value", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 5
          /*ScalarType.INT32*/
        }
      ]);
    }
    /**
     * Encode `Int32Value` to JSON string.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(5, message.value, "value", false, true);
    }
    /**
     * Decode `Int32Value` from JSON string.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 5, void 0, "value");
      return target;
    }
  }
  const Int32Value = new Int32Value$Type();
  class UInt32Value$Type extends MessageType {
    constructor() {
      super("google.protobuf.UInt32Value", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        }
      ]);
    }
    /**
     * Encode `UInt32Value` to JSON string.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(13, message.value, "value", false, true);
    }
    /**
     * Decode `UInt32Value` from JSON string.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 13, void 0, "value");
      return target;
    }
  }
  const UInt32Value = new UInt32Value$Type();
  class BoolValue$Type extends MessageType {
    constructor() {
      super("google.protobuf.BoolValue", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        }
      ]);
    }
    /**
     * Encode `BoolValue` to JSON bool.
     */
    internalJsonWrite(message, options) {
      return message.value;
    }
    /**
     * Decode `BoolValue` from JSON bool.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 8, void 0, "value");
      return target;
    }
  }
  const BoolValue = new BoolValue$Type();
  class StringValue$Type extends MessageType {
    constructor() {
      super("google.protobuf.StringValue", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 9
          /*ScalarType.STRING*/
        }
      ]);
    }
    /**
     * Encode `StringValue` to JSON string.
     */
    internalJsonWrite(message, options) {
      return message.value;
    }
    /**
     * Decode `StringValue` from JSON string.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 9, void 0, "value");
      return target;
    }
  }
  const StringValue = new StringValue$Type();
  class BytesValue$Type extends MessageType {
    constructor() {
      super("google.protobuf.BytesValue", [
        {
          no: 1,
          name: "value",
          kind: "scalar",
          T: 12
          /*ScalarType.BYTES*/
        }
      ]);
    }
    /**
     * Encode `BytesValue` to JSON string.
     */
    internalJsonWrite(message, options) {
      return this.refJsonWriter.scalar(12, message.value, "value", false, true);
    }
    /**
     * Decode `BytesValue` from JSON string.
     */
    internalJsonRead(json, options, target) {
      if (!target)
        target = this.create();
      target.value = this.refJsonReader.scalar(json, 12, void 0, "value");
      return target;
    }
  }
  new BytesValue$Type();
  class Timestamp$Type extends MessageType {
    constructor() {
      super("google.protobuf.Timestamp", [
        {
          no: 1,
          name: "seconds",
          kind: "scalar",
          T: 3
          /*ScalarType.INT64*/
        },
        {
          no: 2,
          name: "nanos",
          kind: "scalar",
          T: 5
          /*ScalarType.INT32*/
        }
      ]);
    }
    /**
     * Creates a new `Timestamp` for the current time.
     */
    now() {
      const msg = this.create();
      const ms = Date.now();
      msg.seconds = PbLong.from(Math.floor(ms / 1e3)).toString();
      msg.nanos = ms % 1e3 * 1e6;
      return msg;
    }
    /**
     * Converts a `Timestamp` to a JavaScript Date.
     */
    toDate(message) {
      return new Date(PbLong.from(message.seconds).toNumber() * 1e3 + Math.ceil(message.nanos / 1e6));
    }
    /**
     * Converts a JavaScript Date to a `Timestamp`.
     */
    fromDate(date) {
      const msg = this.create();
      const ms = date.getTime();
      msg.seconds = PbLong.from(Math.floor(ms / 1e3)).toString();
      msg.nanos = ms % 1e3 * 1e6;
      return msg;
    }
    /**
     * In JSON format, the `Timestamp` type is encoded as a string
     * in the RFC 3339 format.
     */
    internalJsonWrite(message, options) {
      let ms = PbLong.from(message.seconds).toNumber() * 1e3;
      if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
        throw new Error("Unable to encode Timestamp to JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
      if (message.nanos < 0)
        throw new Error("Unable to encode invalid Timestamp to JSON. Nanos must not be negative.");
      let z = "Z";
      if (message.nanos > 0) {
        let nanosStr = (message.nanos + 1e9).toString().substring(1);
        if (nanosStr.substring(3) === "000000")
          z = "." + nanosStr.substring(0, 3) + "Z";
        else if (nanosStr.substring(6) === "000")
          z = "." + nanosStr.substring(0, 6) + "Z";
        else
          z = "." + nanosStr + "Z";
      }
      return new Date(ms).toISOString().replace(".000Z", z);
    }
    /**
     * In JSON format, the `Timestamp` type is encoded as a string
     * in the RFC 3339 format.
     */
    internalJsonRead(json, options, target) {
      if (typeof json !== "string")
        throw new Error("Unable to parse Timestamp from JSON " + typeofJsonValue(json) + ".");
      let matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
      if (!matches)
        throw new Error("Unable to parse Timestamp from JSON. Invalid format.");
      let ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
      if (Number.isNaN(ms))
        throw new Error("Unable to parse Timestamp from JSON. Invalid value.");
      if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
        throw new globalThis.Error("Unable to parse Timestamp from JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
      if (!target)
        target = this.create();
      target.seconds = PbLong.from(ms / 1e3).toString();
      target.nanos = 0;
      if (matches[7])
        target.nanos = parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1e9;
      return target;
    }
  }
  const Timestamp = new Timestamp$Type();
  var PreloadedUserSettings_InboxTab;
  (function(PreloadedUserSettings_InboxTab2) {
    PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["MENTIONS"] = 1] = "MENTIONS";
    PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["UNREADS"] = 2] = "UNREADS";
    PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["TODOS"] = 3] = "TODOS";
    PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["FOR_YOU"] = 4] = "FOR_YOU";
    PreloadedUserSettings_InboxTab2[PreloadedUserSettings_InboxTab2["GAME_INVITES"] = 5] = "GAME_INVITES";
  })(PreloadedUserSettings_InboxTab || (PreloadedUserSettings_InboxTab = {}));
  var PreloadedUserSettings_DmSpamFilterV2;
  (function(PreloadedUserSettings_DmSpamFilterV22) {
    PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["DEFAULT_UNSET"] = 0] = "DEFAULT_UNSET";
    PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["DISABLED"] = 1] = "DISABLED";
    PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["NON_FRIENDS"] = 2] = "NON_FRIENDS";
    PreloadedUserSettings_DmSpamFilterV22[PreloadedUserSettings_DmSpamFilterV22["FRIENDS_AND_NON_FRIENDS"] = 3] = "FRIENDS_AND_NON_FRIENDS";
  })(PreloadedUserSettings_DmSpamFilterV2 || (PreloadedUserSettings_DmSpamFilterV2 = {}));
  var PreloadedUserSettings_ExplicitContentRedaction;
  (function(PreloadedUserSettings_ExplicitContentRedaction2) {
    PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["UNSET_EXPLICIT_CONTENT_REDACTION"] = 0] = "UNSET_EXPLICIT_CONTENT_REDACTION";
    PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["SHOW"] = 1] = "SHOW";
    PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["BLUR"] = 2] = "BLUR";
    PreloadedUserSettings_ExplicitContentRedaction2[PreloadedUserSettings_ExplicitContentRedaction2["BLOCK"] = 3] = "BLOCK";
  })(PreloadedUserSettings_ExplicitContentRedaction || (PreloadedUserSettings_ExplicitContentRedaction = {}));
  var PreloadedUserSettings_GuildActivityStatusRestrictionDefault;
  (function(PreloadedUserSettings_GuildActivityStatusRestrictionDefault2) {
    PreloadedUserSettings_GuildActivityStatusRestrictionDefault2[PreloadedUserSettings_GuildActivityStatusRestrictionDefault2["OFF"] = 0] = "OFF";
    PreloadedUserSettings_GuildActivityStatusRestrictionDefault2[PreloadedUserSettings_GuildActivityStatusRestrictionDefault2["ON_FOR_LARGE_GUILDS"] = 1] = "ON_FOR_LARGE_GUILDS";
  })(PreloadedUserSettings_GuildActivityStatusRestrictionDefault || (PreloadedUserSettings_GuildActivityStatusRestrictionDefault = {}));
  var PreloadedUserSettings_Theme;
  (function(PreloadedUserSettings_Theme2) {
    PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["UNSET"] = 0] = "UNSET";
    PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["DARK"] = 1] = "DARK";
    PreloadedUserSettings_Theme2[PreloadedUserSettings_Theme2["LIGHT"] = 2] = "LIGHT";
  })(PreloadedUserSettings_Theme || (PreloadedUserSettings_Theme = {}));
  var PreloadedUserSettings_FavoriteChannelType;
  (function(PreloadedUserSettings_FavoriteChannelType2) {
    PreloadedUserSettings_FavoriteChannelType2[PreloadedUserSettings_FavoriteChannelType2["UNSET_FAVORITE_CHANNEL_TYPE"] = 0] = "UNSET_FAVORITE_CHANNEL_TYPE";
    PreloadedUserSettings_FavoriteChannelType2[PreloadedUserSettings_FavoriteChannelType2["REFERENCE_ORIGINAL"] = 1] = "REFERENCE_ORIGINAL";
    PreloadedUserSettings_FavoriteChannelType2[PreloadedUserSettings_FavoriteChannelType2["CATEGORY"] = 2] = "CATEGORY";
  })(PreloadedUserSettings_FavoriteChannelType || (PreloadedUserSettings_FavoriteChannelType = {}));
  class PreloadedUserSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings", [
        { no: 1, name: "versions", kind: "message", T: () => PreloadedUserSettings_Versions },
        { no: 2, name: "inbox", kind: "message", T: () => PreloadedUserSettings_InboxSettings },
        { no: 3, name: "guilds", kind: "message", T: () => PreloadedUserSettings_AllGuildSettings },
        { no: 4, name: "user_content", kind: "message", T: () => PreloadedUserSettings_UserContentSettings },
        { no: 5, name: "voice_and_video", kind: "message", T: () => PreloadedUserSettings_VoiceAndVideoSettings },
        { no: 6, name: "text_and_images", kind: "message", T: () => PreloadedUserSettings_TextAndImagesSettings },
        { no: 7, name: "notifications", kind: "message", T: () => PreloadedUserSettings_NotificationSettings },
        { no: 8, name: "privacy", kind: "message", T: () => PreloadedUserSettings_PrivacySettings },
        { no: 9, name: "debug", kind: "message", T: () => PreloadedUserSettings_DebugSettings },
        { no: 10, name: "game_library", kind: "message", T: () => PreloadedUserSettings_GameLibrarySettings },
        { no: 11, name: "status", kind: "message", T: () => PreloadedUserSettings_StatusSettings },
        { no: 12, name: "localization", kind: "message", T: () => PreloadedUserSettings_LocalizationSettings },
        { no: 13, name: "appearance", kind: "message", T: () => PreloadedUserSettings_AppearanceSettings },
        { no: 14, name: "guild_folders", kind: "message", T: () => PreloadedUserSettings_GuildFolders },
        { no: 15, name: "favorites", kind: "message", T: () => PreloadedUserSettings_Favorites },
        { no: 16, name: "audio_context_settings", kind: "message", T: () => PreloadedUserSettings_AudioSettings },
        { no: 17, name: "communities", kind: "message", T: () => PreloadedUserSettings_CommunitiesSettings },
        { no: 18, name: "broadcast", kind: "message", T: () => PreloadedUserSettings_BroadcastSettings },
        { no: 19, name: "clips", kind: "message", T: () => PreloadedUserSettings_ClipsSettings }
      ]);
    }
  }
  const PreloadedUserSettings = new PreloadedUserSettings$Type();
  class PreloadedUserSettings_Versions$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.Versions", [
        {
          no: 1,
          name: "client_version",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        },
        {
          no: 2,
          name: "server_version",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        },
        {
          no: 3,
          name: "data_version",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_Versions = new PreloadedUserSettings_Versions$Type();
  class PreloadedUserSettings_InboxSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.InboxSettings", [
        { no: 1, name: "current_tab", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.InboxTab", PreloadedUserSettings_InboxTab] },
        {
          no: 2,
          name: "viewed_tutorial",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_InboxSettings = new PreloadedUserSettings_InboxSettings$Type();
  class PreloadedUserSettings_ChannelIconEmoji$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ChannelIconEmoji", [
        { no: 1, name: "id", kind: "message", T: () => UInt64Value },
        { no: 2, name: "name", kind: "message", T: () => StringValue },
        { no: 3, name: "color", kind: "message", T: () => UInt64Value }
      ]);
    }
  }
  const PreloadedUserSettings_ChannelIconEmoji = new PreloadedUserSettings_ChannelIconEmoji$Type();
  class PreloadedUserSettings_ChannelSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ChannelSettings", [
        {
          no: 1,
          name: "collapsed_in_inbox",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        { no: 2, name: "icon_emoji", kind: "message", T: () => PreloadedUserSettings_ChannelIconEmoji }
      ]);
    }
  }
  const PreloadedUserSettings_ChannelSettings = new PreloadedUserSettings_ChannelSettings$Type();
  class PreloadedUserSettings_CustomCallSound$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.CustomCallSound", [
        {
          no: 1,
          name: "sound_id",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 2,
          name: "guild_id",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_CustomCallSound = new PreloadedUserSettings_CustomCallSound$Type();
  class PreloadedUserSettings_ChannelListSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ChannelListSettings", [
        { no: 1, name: "layout", kind: "message", T: () => StringValue },
        { no: 2, name: "message_previews", kind: "message", T: () => StringValue }
      ]);
    }
  }
  const PreloadedUserSettings_ChannelListSettings = new PreloadedUserSettings_ChannelListSettings$Type();
  class PreloadedUserSettings_GuildSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.GuildSettings", [
        { no: 1, name: "channels", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_ChannelSettings } },
        {
          no: 2,
          name: "hub_progress",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        },
        {
          no: 3,
          name: "guild_onboarding_progress",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        },
        { no: 4, name: "guild_recents_dismissed_at", kind: "message", T: () => Timestamp },
        {
          no: 5,
          name: "dismissed_guild_content",
          kind: "scalar",
          T: 12
          /*ScalarType.BYTES*/
        },
        { no: 6, name: "join_sound", kind: "message", T: () => PreloadedUserSettings_CustomCallSound },
        { no: 7, name: "mobile_redesign_channel_list_settings", kind: "message", T: () => PreloadedUserSettings_ChannelListSettings },
        {
          no: 8,
          name: "disable_raid_alert_push",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        {
          no: 9,
          name: "disable_raid_alert_nag",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_GuildSettings = new PreloadedUserSettings_GuildSettings$Type();
  class PreloadedUserSettings_AllGuildSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.AllGuildSettings", [
        { no: 1, name: "guilds", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_GuildSettings } }
      ]);
    }
  }
  const PreloadedUserSettings_AllGuildSettings = new PreloadedUserSettings_AllGuildSettings$Type();
  class PreloadedUserSettings_UserContentSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.UserContentSettings", [
        {
          no: 1,
          name: "dismissed_contents",
          kind: "scalar",
          T: 12
          /*ScalarType.BYTES*/
        },
        { no: 2, name: "last_dismissed_outbound_promotion_start_date", kind: "message", T: () => StringValue },
        { no: 3, name: "premium_tier_0_modal_dismissed_at", kind: "message", T: () => Timestamp },
        { no: 4, name: "guild_onboarding_upsell_dismissed_at", kind: "message", T: () => Timestamp },
        { no: 5, name: "safety_user_sentiment_notice_dismissed_at", kind: "message", T: () => Timestamp }
      ]);
    }
  }
  const PreloadedUserSettings_UserContentSettings = new PreloadedUserSettings_UserContentSettings$Type();
  class PreloadedUserSettings_VideoFilterBackgroundBlur$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.VideoFilterBackgroundBlur", [
        {
          no: 1,
          name: "use_blur",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_VideoFilterBackgroundBlur = new PreloadedUserSettings_VideoFilterBackgroundBlur$Type();
  class PreloadedUserSettings_VideoFilterAsset$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.VideoFilterAsset", [
        {
          no: 1,
          name: "id",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 2,
          name: "asset_hash",
          kind: "scalar",
          T: 9
          /*ScalarType.STRING*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_VideoFilterAsset = new PreloadedUserSettings_VideoFilterAsset$Type();
  class PreloadedUserSettings_SoundboardSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.SoundboardSettings", [
        {
          no: 1,
          name: "volume",
          kind: "scalar",
          T: 2
          /*ScalarType.FLOAT*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_SoundboardSettings = new PreloadedUserSettings_SoundboardSettings$Type();
  class PreloadedUserSettings_VoiceAndVideoSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.VoiceAndVideoSettings", [
        { no: 1, name: "blur", kind: "message", T: () => PreloadedUserSettings_VideoFilterBackgroundBlur },
        {
          no: 2,
          name: "preset_option",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        },
        { no: 3, name: "custom_asset", kind: "message", T: () => PreloadedUserSettings_VideoFilterAsset },
        { no: 5, name: "always_preview_video", kind: "message", T: () => BoolValue },
        { no: 6, name: "afk_timeout", kind: "message", T: () => UInt32Value },
        { no: 7, name: "stream_notifications_enabled", kind: "message", T: () => BoolValue },
        { no: 8, name: "native_phone_integration_enabled", kind: "message", T: () => BoolValue },
        { no: 9, name: "soundboard_settings", kind: "message", T: () => PreloadedUserSettings_SoundboardSettings }
      ]);
    }
  }
  const PreloadedUserSettings_VoiceAndVideoSettings = new PreloadedUserSettings_VoiceAndVideoSettings$Type();
  class PreloadedUserSettings_ExplicitContentSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ExplicitContentSettings", [
        { no: 1, name: "explicit_content_guilds", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ExplicitContentRedaction", PreloadedUserSettings_ExplicitContentRedaction] },
        { no: 2, name: "explicit_content_friend_dm", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ExplicitContentRedaction", PreloadedUserSettings_ExplicitContentRedaction] },
        { no: 3, name: "explicit_content_non_friend_dm", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ExplicitContentRedaction", PreloadedUserSettings_ExplicitContentRedaction] }
      ]);
    }
  }
  const PreloadedUserSettings_ExplicitContentSettings = new PreloadedUserSettings_ExplicitContentSettings$Type();
  class PreloadedUserSettings_TextAndImagesSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.TextAndImagesSettings", [
        { no: 1, name: "diversity_surrogate", kind: "message", T: () => StringValue },
        { no: 2, name: "use_rich_chat_input", kind: "message", T: () => BoolValue },
        { no: 3, name: "use_thread_sidebar", kind: "message", T: () => BoolValue },
        { no: 4, name: "render_spoilers", kind: "message", T: () => StringValue },
        {
          no: 5,
          name: "emoji_picker_collapsed_sections",
          kind: "scalar",
          repeat: 2,
          T: 9
          /*ScalarType.STRING*/
        },
        {
          no: 6,
          name: "sticker_picker_collapsed_sections",
          kind: "scalar",
          repeat: 2,
          T: 9
          /*ScalarType.STRING*/
        },
        { no: 7, name: "view_image_descriptions", kind: "message", T: () => BoolValue },
        { no: 8, name: "show_command_suggestions", kind: "message", T: () => BoolValue },
        { no: 9, name: "inline_attachment_media", kind: "message", T: () => BoolValue },
        { no: 10, name: "inline_embed_media", kind: "message", T: () => BoolValue },
        { no: 11, name: "gif_auto_play", kind: "message", T: () => BoolValue },
        { no: 12, name: "render_embeds", kind: "message", T: () => BoolValue },
        { no: 13, name: "render_reactions", kind: "message", T: () => BoolValue },
        { no: 14, name: "animate_emoji", kind: "message", T: () => BoolValue },
        { no: 15, name: "animate_stickers", kind: "message", T: () => UInt32Value },
        { no: 16, name: "enable_tts_command", kind: "message", T: () => BoolValue },
        { no: 17, name: "message_display_compact", kind: "message", T: () => BoolValue },
        { no: 19, name: "explicit_content_filter", kind: "message", T: () => UInt32Value },
        { no: 20, name: "view_nsfw_guilds", kind: "message", T: () => BoolValue },
        { no: 21, name: "convert_emoticons", kind: "message", T: () => BoolValue },
        { no: 22, name: "expression_suggestions_enabled", kind: "message", T: () => BoolValue },
        { no: 23, name: "view_nsfw_commands", kind: "message", T: () => BoolValue },
        { no: 24, name: "use_legacy_chat_input", kind: "message", T: () => BoolValue },
        {
          no: 25,
          name: "soundboard_picker_collapsed_sections",
          kind: "scalar",
          repeat: 2,
          T: 9
          /*ScalarType.STRING*/
        },
        { no: 26, name: "dm_spam_filter", kind: "message", T: () => UInt32Value },
        { no: 27, name: "dm_spam_filter_v2", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.DmSpamFilterV2", PreloadedUserSettings_DmSpamFilterV2] },
        { no: 28, name: "include_stickers_in_autocomplete", kind: "message", T: () => BoolValue },
        { no: 29, name: "explicit_content_settings", kind: "message", T: () => PreloadedUserSettings_ExplicitContentSettings }
      ]);
    }
  }
  const PreloadedUserSettings_TextAndImagesSettings = new PreloadedUserSettings_TextAndImagesSettings$Type();
  class PreloadedUserSettings_NotificationSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.NotificationSettings", [
        { no: 1, name: "show_in_app_notifications", kind: "message", T: () => BoolValue },
        { no: 2, name: "notify_friends_on_go_live", kind: "message", T: () => BoolValue },
        {
          no: 3,
          name: "notification_center_acked_before_id",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        },
        { no: 4, name: "enable_burst_reaction_notifications", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_NotificationSettings = new PreloadedUserSettings_NotificationSettings$Type();
  class PreloadedUserSettings_PrivacySettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.PrivacySettings", [
        { no: 1, name: "allow_activity_party_privacy_friends", kind: "message", T: () => BoolValue },
        { no: 2, name: "allow_activity_party_privacy_voice_channel", kind: "message", T: () => BoolValue },
        {
          no: 3,
          name: "restricted_guild_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 4,
          name: "default_guilds_restricted",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        {
          no: 7,
          name: "allow_accessibility_detection",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        { no: 8, name: "detect_platform_accounts", kind: "message", T: () => BoolValue },
        { no: 9, name: "passwordless", kind: "message", T: () => BoolValue },
        { no: 10, name: "contact_sync_enabled", kind: "message", T: () => BoolValue },
        { no: 11, name: "friend_source_flags", kind: "message", T: () => UInt32Value },
        { no: 12, name: "friend_discovery_flags", kind: "message", T: () => UInt32Value },
        {
          no: 13,
          name: "activity_restricted_guild_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        { no: 14, name: "default_guilds_activity_restricted", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.GuildActivityStatusRestrictionDefault", PreloadedUserSettings_GuildActivityStatusRestrictionDefault] },
        {
          no: 15,
          name: "activity_joining_restricted_guild_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 16,
          name: "message_request_restricted_guild_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        { no: 17, name: "default_message_request_restricted", kind: "message", T: () => BoolValue },
        { no: 18, name: "drops_opted_out", kind: "message", T: () => BoolValue },
        { no: 19, name: "non_spam_retraining_opt_in", kind: "message", T: () => BoolValue },
        { no: 20, name: "family_center_enabled", kind: "message", T: () => BoolValue },
        { no: 21, name: "family_center_enabled_v2", kind: "message", T: () => BoolValue },
        { no: 22, name: "hide_legacy_username", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_PrivacySettings = new PreloadedUserSettings_PrivacySettings$Type();
  class PreloadedUserSettings_DebugSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.DebugSettings", [
        { no: 1, name: "rtc_panel_show_voice_states", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_DebugSettings = new PreloadedUserSettings_DebugSettings$Type();
  class PreloadedUserSettings_GameLibrarySettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.GameLibrarySettings", [
        { no: 1, name: "install_shortcut_desktop", kind: "message", T: () => BoolValue },
        { no: 2, name: "install_shortcut_start_menu", kind: "message", T: () => BoolValue },
        { no: 3, name: "disable_games_tab", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_GameLibrarySettings = new PreloadedUserSettings_GameLibrarySettings$Type();
  class PreloadedUserSettings_CustomStatus$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.CustomStatus", [
        {
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
          /*ScalarType.STRING*/
        },
        {
          no: 2,
          name: "emoji_id",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 3,
          name: "emoji_name",
          kind: "scalar",
          T: 9
          /*ScalarType.STRING*/
        },
        {
          no: 4,
          name: "expires_at_ms",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_CustomStatus = new PreloadedUserSettings_CustomStatus$Type();
  class PreloadedUserSettings_StatusSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.StatusSettings", [
        { no: 1, name: "status", kind: "message", T: () => StringValue },
        { no: 2, name: "custom_status", kind: "message", T: () => PreloadedUserSettings_CustomStatus },
        { no: 3, name: "show_current_game", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_StatusSettings = new PreloadedUserSettings_StatusSettings$Type();
  class PreloadedUserSettings_LocalizationSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.LocalizationSettings", [
        { no: 1, name: "locale", kind: "message", T: () => StringValue },
        { no: 2, name: "timezone_offset", kind: "message", T: () => Int32Value }
      ]);
    }
  }
  const PreloadedUserSettings_LocalizationSettings = new PreloadedUserSettings_LocalizationSettings$Type();
  class PreloadedUserSettings_ClientThemeSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ClientThemeSettings", [
        { no: 2, name: "background_gradient_preset_id", kind: "message", T: () => UInt32Value }
      ]);
    }
  }
  const PreloadedUserSettings_ClientThemeSettings = new PreloadedUserSettings_ClientThemeSettings$Type();
  class PreloadedUserSettings_AppearanceSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.AppearanceSettings", [
        { no: 1, name: "theme", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.Theme", PreloadedUserSettings_Theme] },
        {
          no: 2,
          name: "developer_mode",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        { no: 3, name: "client_theme_settings", kind: "message", T: () => PreloadedUserSettings_ClientThemeSettings },
        {
          no: 4,
          name: "mobile_redesign_disabled",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        { no: 6, name: "channel_list_layout", kind: "message", T: () => StringValue },
        { no: 7, name: "message_previews", kind: "message", T: () => StringValue }
      ]);
    }
  }
  const PreloadedUserSettings_AppearanceSettings = new PreloadedUserSettings_AppearanceSettings$Type();
  class PreloadedUserSettings_GuildFolder$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.GuildFolder", [
        {
          no: 1,
          name: "guild_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        { no: 2, name: "id", kind: "message", T: () => Int64Value },
        { no: 3, name: "name", kind: "message", T: () => StringValue },
        { no: 4, name: "color", kind: "message", T: () => UInt64Value }
      ]);
    }
  }
  const PreloadedUserSettings_GuildFolder = new PreloadedUserSettings_GuildFolder$Type();
  class PreloadedUserSettings_GuildFolders$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.GuildFolders", [
        { no: 1, name: "folders", kind: "message", repeat: 1, T: () => PreloadedUserSettings_GuildFolder },
        {
          no: 2,
          name: "guild_positions",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_GuildFolders = new PreloadedUserSettings_GuildFolders$Type();
  class PreloadedUserSettings_FavoriteChannel$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.FavoriteChannel", [
        {
          no: 1,
          name: "nickname",
          kind: "scalar",
          T: 9
          /*ScalarType.STRING*/
        },
        { no: 2, name: "type", kind: "enum", T: () => ["discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.FavoriteChannelType", PreloadedUserSettings_FavoriteChannelType] },
        {
          no: 3,
          name: "position",
          kind: "scalar",
          T: 13
          /*ScalarType.UINT32*/
        },
        {
          no: 4,
          name: "parent_id",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_FavoriteChannel = new PreloadedUserSettings_FavoriteChannel$Type();
  class PreloadedUserSettings_Favorites$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.Favorites", [
        { no: 1, name: "favorite_channels", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_FavoriteChannel } },
        {
          no: 2,
          name: "muted",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_Favorites = new PreloadedUserSettings_Favorites$Type();
  class PreloadedUserSettings_AudioContextSetting$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.AudioContextSetting", [
        {
          no: 1,
          name: "muted",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        },
        {
          no: 2,
          name: "volume",
          kind: "scalar",
          T: 2
          /*ScalarType.FLOAT*/
        },
        {
          no: 3,
          name: "modified_at",
          kind: "scalar",
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 4,
          name: "soundboard_muted",
          kind: "scalar",
          T: 8
          /*ScalarType.BOOL*/
        }
      ]);
    }
  }
  const PreloadedUserSettings_AudioContextSetting = new PreloadedUserSettings_AudioContextSetting$Type();
  class PreloadedUserSettings_AudioSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.AudioSettings", [
        { no: 1, name: "user", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_AudioContextSetting } },
        { no: 2, name: "stream", kind: "map", K: 6, V: { kind: "message", T: () => PreloadedUserSettings_AudioContextSetting } }
      ]);
    }
  }
  const PreloadedUserSettings_AudioSettings = new PreloadedUserSettings_AudioSettings$Type();
  class PreloadedUserSettings_CommunitiesSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.CommunitiesSettings", [
        { no: 1, name: "disable_home_auto_nav", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_CommunitiesSettings = new PreloadedUserSettings_CommunitiesSettings$Type();
  class PreloadedUserSettings_BroadcastSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.BroadcastSettings", [
        { no: 1, name: "allow_friends", kind: "message", T: () => BoolValue },
        {
          no: 2,
          name: "allowed_guild_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        {
          no: 3,
          name: "allowed_user_ids",
          kind: "scalar",
          repeat: 1,
          T: 6
          /*ScalarType.FIXED64*/
        },
        { no: 4, name: "auto_broadcast", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_BroadcastSettings = new PreloadedUserSettings_BroadcastSettings$Type();
  class PreloadedUserSettings_ClipsSettings$Type extends MessageType {
    constructor() {
      super("discord_protos.discord_users.v1.PreloadedUserSettings.PreloadedUserSettings.ClipsSettings", [
        { no: 1, name: "allow_voice_recording", kind: "message", T: () => BoolValue }
      ]);
    }
  }
  const PreloadedUserSettings_ClipsSettings = new PreloadedUserSettings_ClipsSettings$Type();
  function fromBase64(base64) {
    return this.fromBinary(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)));
  }
  MessageType.prototype.fromBase64 = fromBase64;
  var common = {};
  var hasRequiredCommon;
  function requireCommon() {
    if (hasRequiredCommon) return common;
    hasRequiredCommon = 1;
    (function(exports) {
      var TYPED_OK = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
      function _has(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
      }
      exports.assign = function(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        while (sources.length) {
          var source = sources.shift();
          if (!source) {
            continue;
          }
          if (typeof source !== "object") {
            throw new TypeError(source + "must be non-object");
          }
          for (var p in source) {
            if (_has(source, p)) {
              obj[p] = source[p];
            }
          }
        }
        return obj;
      };
      exports.shrinkBuf = function(buf, size) {
        if (buf.length === size) {
          return buf;
        }
        if (buf.subarray) {
          return buf.subarray(0, size);
        }
        buf.length = size;
        return buf;
      };
      var fnTyped = {
        arraySet: function(dest, src, src_offs, len, dest_offs) {
          if (src.subarray && dest.subarray) {
            dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
            return;
          }
          for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function(chunks) {
          var i, l, len, pos, chunk, result;
          len = 0;
          for (i = 0, l = chunks.length; i < l; i++) {
            len += chunks[i].length;
          }
          result = new Uint8Array(len);
          pos = 0;
          for (i = 0, l = chunks.length; i < l; i++) {
            chunk = chunks[i];
            result.set(chunk, pos);
            pos += chunk.length;
          }
          return result;
        }
      };
      var fnUntyped = {
        arraySet: function(dest, src, src_offs, len, dest_offs) {
          for (var i = 0; i < len; i++) {
            dest[dest_offs + i] = src[src_offs + i];
          }
        },
        // Join array of chunks to single array.
        flattenChunks: function(chunks) {
          return [].concat.apply([], chunks);
        }
      };
      exports.setTyped = function(on) {
        if (on) {
          exports.Buf8 = Uint8Array;
          exports.Buf16 = Uint16Array;
          exports.Buf32 = Int32Array;
          exports.assign(exports, fnTyped);
        } else {
          exports.Buf8 = Array;
          exports.Buf16 = Array;
          exports.Buf32 = Array;
          exports.assign(exports, fnUntyped);
        }
      };
      exports.setTyped(TYPED_OK);
    })(common);
    return common;
  }
  var deflate$1 = {};
  var deflate = {};
  var trees = {};
  var hasRequiredTrees;
  function requireTrees() {
    if (hasRequiredTrees) return trees;
    hasRequiredTrees = 1;
    var utils = requireCommon();
    var Z_FIXED = 4;
    var Z_BINARY = 0;
    var Z_TEXT = 1;
    var Z_UNKNOWN = 2;
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    var STORED_BLOCK = 0;
    var STATIC_TREES = 1;
    var DYN_TREES = 2;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var Buf_size = 16;
    var MAX_BL_BITS = 7;
    var END_BLOCK = 256;
    var REP_3_6 = 16;
    var REPZ_3_10 = 17;
    var REPZ_11_138 = 18;
    var extra_lbits = (
      /* extra bits for each length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
    );
    var extra_dbits = (
      /* extra bits for each distance code */
      [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
    );
    var extra_blbits = (
      /* extra bits for each bit length code */
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
    );
    var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    var DIST_CODE_LEN = 512;
    var static_ltree = new Array((L_CODES + 2) * 2);
    zero(static_ltree);
    var static_dtree = new Array(D_CODES * 2);
    zero(static_dtree);
    var _dist_code = new Array(DIST_CODE_LEN);
    zero(_dist_code);
    var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
    zero(_length_code);
    var base_length = new Array(LENGTH_CODES);
    zero(base_length);
    var base_dist = new Array(D_CODES);
    zero(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
      this.static_tree = static_tree;
      this.extra_bits = extra_bits;
      this.extra_base = extra_base;
      this.elems = elems;
      this.max_length = max_length;
      this.has_stree = static_tree && static_tree.length;
    }
    var static_l_desc;
    var static_d_desc;
    var static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
      this.dyn_tree = dyn_tree;
      this.max_code = 0;
      this.stat_desc = stat_desc;
    }
    function d_code(dist) {
      return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    }
    function put_short(s, w) {
      s.pending_buf[s.pending++] = w & 255;
      s.pending_buf[s.pending++] = w >>> 8 & 255;
    }
    function send_bits(s, value, length) {
      if (s.bi_valid > Buf_size - length) {
        s.bi_buf |= value << s.bi_valid & 65535;
        put_short(s, s.bi_buf);
        s.bi_buf = value >> Buf_size - s.bi_valid;
        s.bi_valid += length - Buf_size;
      } else {
        s.bi_buf |= value << s.bi_valid & 65535;
        s.bi_valid += length;
      }
    }
    function send_code(s, c, tree) {
      send_bits(
        s,
        tree[c * 2],
        tree[c * 2 + 1]
        /*.Len*/
      );
    }
    function bi_reverse(code, len) {
      var res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }
    function bi_flush(s) {
      if (s.bi_valid === 16) {
        put_short(s, s.bi_buf);
        s.bi_buf = 0;
        s.bi_valid = 0;
      } else if (s.bi_valid >= 8) {
        s.pending_buf[s.pending++] = s.bi_buf & 255;
        s.bi_buf >>= 8;
        s.bi_valid -= 8;
      }
    }
    function gen_bitlen(s, desc) {
      var tree = desc.dyn_tree;
      var max_code = desc.max_code;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var extra = desc.stat_desc.extra_bits;
      var base = desc.stat_desc.extra_base;
      var max_length = desc.stat_desc.max_length;
      var h;
      var n, m;
      var bits;
      var xbits;
      var f;
      var overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++) {
        s.bl_count[bits] = 0;
      }
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > max_code) {
          continue;
        }
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base) {
          xbits = extra[n - base];
        }
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (has_stree) {
          s.static_len += f * (stree[n * 2 + 1] + xbits);
        }
      }
      if (overflow === 0) {
        return;
      }
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0) {
          bits--;
        }
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > max_code) {
            continue;
          }
          if (tree[m * 2 + 1] !== bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = new Array(MAX_BITS + 1);
      var code = 0;
      var bits;
      var n;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      }
      for (n = 0; n <= max_code; n++) {
        var len = tree[n * 2 + 1];
        if (len === 0) {
          continue;
        }
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }
    function tr_static_init() {
      var n;
      var bits;
      var length;
      var code;
      var dist;
      var bl_count = new Array(MAX_BITS + 1);
      length = 0;
      for (code = 0; code < LENGTH_CODES - 1; code++) {
        base_length[code] = length;
        for (n = 0; n < 1 << extra_lbits[code]; n++) {
          _length_code[length++] = code;
        }
      }
      _length_code[length - 1] = code;
      dist = 0;
      for (code = 0; code < 16; code++) {
        base_dist[code] = dist;
        for (n = 0; n < 1 << extra_dbits[code]; n++) {
          _dist_code[dist++] = code;
        }
      }
      dist >>= 7;
      for (; code < D_CODES; code++) {
        base_dist[code] = dist << 7;
        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
          _dist_code[256 + dist++] = code;
        }
      }
      for (bits = 0; bits <= MAX_BITS; bits++) {
        bl_count[bits] = 0;
      }
      n = 0;
      while (n <= 143) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      while (n <= 255) {
        static_ltree[n * 2 + 1] = 9;
        n++;
        bl_count[9]++;
      }
      while (n <= 279) {
        static_ltree[n * 2 + 1] = 7;
        n++;
        bl_count[7]++;
      }
      while (n <= 287) {
        static_ltree[n * 2 + 1] = 8;
        n++;
        bl_count[8]++;
      }
      gen_codes(static_ltree, L_CODES + 1, bl_count);
      for (n = 0; n < D_CODES; n++) {
        static_dtree[n * 2 + 1] = 5;
        static_dtree[n * 2] = bi_reverse(n, 5);
      }
      static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
      static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
      static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
    }
    function init_block(s) {
      var n;
      for (n = 0; n < L_CODES; n++) {
        s.dyn_ltree[n * 2] = 0;
      }
      for (n = 0; n < D_CODES; n++) {
        s.dyn_dtree[n * 2] = 0;
      }
      for (n = 0; n < BL_CODES; n++) {
        s.bl_tree[n * 2] = 0;
      }
      s.dyn_ltree[END_BLOCK * 2] = 1;
      s.opt_len = s.static_len = 0;
      s.last_lit = s.matches = 0;
    }
    function bi_windup(s) {
      if (s.bi_valid > 8) {
        put_short(s, s.bi_buf);
      } else if (s.bi_valid > 0) {
        s.pending_buf[s.pending++] = s.bi_buf;
      }
      s.bi_buf = 0;
      s.bi_valid = 0;
    }
    function copy_block(s, buf, len, header) {
      bi_windup(s);
      {
        put_short(s, len);
        put_short(s, ~len);
      }
      utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
      s.pending += len;
    }
    function smaller(tree, n, m, depth) {
      var _n2 = n * 2;
      var _m2 = m * 2;
      return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    }
    function pqdownheap(s, tree, k) {
      var v = s.heap[k];
      var j = k << 1;
      while (j <= s.heap_len) {
        if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
          j++;
        }
        if (smaller(tree, v, s.heap[j], s.depth)) {
          break;
        }
        s.heap[k] = s.heap[j];
        k = j;
        j <<= 1;
      }
      s.heap[k] = v;
    }
    function compress_block(s, ltree, dtree) {
      var dist;
      var lc;
      var lx = 0;
      var code;
      var extra;
      if (s.last_lit !== 0) {
        do {
          dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
          lc = s.pending_buf[s.l_buf + lx];
          lx++;
          if (dist === 0) {
            send_code(s, lc, ltree);
          } else {
            code = _length_code[lc];
            send_code(s, code + LITERALS + 1, ltree);
            extra = extra_lbits[code];
            if (extra !== 0) {
              lc -= base_length[code];
              send_bits(s, lc, extra);
            }
            dist--;
            code = d_code(dist);
            send_code(s, code, dtree);
            extra = extra_dbits[code];
            if (extra !== 0) {
              dist -= base_dist[code];
              send_bits(s, dist, extra);
            }
          }
        } while (lx < s.last_lit);
      }
      send_code(s, END_BLOCK, ltree);
    }
    function build_tree(s, desc) {
      var tree = desc.dyn_tree;
      var stree = desc.stat_desc.static_tree;
      var has_stree = desc.stat_desc.has_stree;
      var elems = desc.stat_desc.elems;
      var n, m;
      var max_code = -1;
      var node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (has_stree) {
          s.static_len -= stree[node * 2 + 1];
        }
      }
      desc.max_code = max_code;
      for (n = s.heap_len >> 1; n >= 1; n--) {
        pqdownheap(s, tree, n);
      }
      node = elems;
      do {
        n = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[
          1
          /*SMALLEST*/
        ] = s.heap[s.heap_len--];
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
        m = s.heap[
          1
          /*SMALLEST*/
        ];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[
          1
          /*SMALLEST*/
        ] = node++;
        pqdownheap(
          s,
          tree,
          1
          /*SMALLEST*/
        );
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[
        1
        /*SMALLEST*/
      ];
      gen_bitlen(s, desc);
      gen_codes(tree, max_code, s.bl_count);
    }
    function scan_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          s.bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            s.bl_tree[curlen * 2]++;
          }
          s.bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          s.bl_tree[REPZ_3_10 * 2]++;
        } else {
          s.bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function send_tree(s, tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen === nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(s, curlen, s.bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen !== prevlen) {
            send_code(s, curlen, s.bl_tree);
            count--;
          }
          send_code(s, REP_3_6, s.bl_tree);
          send_bits(s, count - 3, 2);
        } else if (count <= 10) {
          send_code(s, REPZ_3_10, s.bl_tree);
          send_bits(s, count - 3, 3);
        } else {
          send_code(s, REPZ_11_138, s.bl_tree);
          send_bits(s, count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen === nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function build_bl_tree(s) {
      var max_blindex;
      scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
      scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
      build_tree(s, s.bl_desc);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
          break;
        }
      }
      s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }
    function send_all_trees(s, lcodes, dcodes, blcodes) {
      var rank;
      send_bits(s, lcodes - 257, 5);
      send_bits(s, dcodes - 1, 5);
      send_bits(s, blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);
      }
      send_tree(s, s.dyn_ltree, lcodes - 1);
      send_tree(s, s.dyn_dtree, dcodes - 1);
    }
    function detect_data_type(s) {
      var black_mask = 4093624447;
      var n;
      for (n = 0; n <= 31; n++, black_mask >>>= 1) {
        if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
          return Z_BINARY;
        }
      }
      if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
        return Z_TEXT;
      }
      for (n = 32; n < LITERALS; n++) {
        if (s.dyn_ltree[n * 2] !== 0) {
          return Z_TEXT;
        }
      }
      return Z_BINARY;
    }
    var static_init_done = false;
    function _tr_init(s) {
      if (!static_init_done) {
        tr_static_init();
        static_init_done = true;
      }
      s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
      s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
      s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
      s.bi_buf = 0;
      s.bi_valid = 0;
      init_block(s);
    }
    function _tr_stored_block(s, buf, stored_len, last) {
      send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
      copy_block(s, buf, stored_len);
    }
    function _tr_align(s) {
      send_bits(s, STATIC_TREES << 1, 3);
      send_code(s, END_BLOCK, static_ltree);
      bi_flush(s);
    }
    function _tr_flush_block(s, buf, stored_len, last) {
      var opt_lenb, static_lenb;
      var max_blindex = 0;
      if (s.level > 0) {
        if (s.strm.data_type === Z_UNKNOWN) {
          s.strm.data_type = detect_data_type(s);
        }
        build_tree(s, s.l_desc);
        build_tree(s, s.d_desc);
        max_blindex = build_bl_tree(s);
        opt_lenb = s.opt_len + 3 + 7 >>> 3;
        static_lenb = s.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb) {
          opt_lenb = static_lenb;
        }
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf !== -1) {
        _tr_stored_block(s, buf, stored_len, last);
      } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
        send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
        compress_block(s, static_ltree, static_dtree);
      } else {
        send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
        send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
        compress_block(s, s.dyn_ltree, s.dyn_dtree);
      }
      init_block(s);
      if (last) {
        bi_windup(s);
      }
    }
    function _tr_tally(s, dist, lc) {
      s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
      s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
      s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
      s.last_lit++;
      if (dist === 0) {
        s.dyn_ltree[lc * 2]++;
      } else {
        s.matches++;
        dist--;
        s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
        s.dyn_dtree[d_code(dist) * 2]++;
      }
      return s.last_lit === s.lit_bufsize - 1;
    }
    trees._tr_init = _tr_init;
    trees._tr_stored_block = _tr_stored_block;
    trees._tr_flush_block = _tr_flush_block;
    trees._tr_tally = _tr_tally;
    trees._tr_align = _tr_align;
    return trees;
  }
  var adler32_1;
  var hasRequiredAdler32;
  function requireAdler32() {
    if (hasRequiredAdler32) return adler32_1;
    hasRequiredAdler32 = 1;
    function adler32(adler, buf, len, pos) {
      var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
      while (len !== 0) {
        n = len > 2e3 ? 2e3 : len;
        len -= n;
        do {
          s1 = s1 + buf[pos++] | 0;
          s2 = s2 + s1 | 0;
        } while (--n);
        s1 %= 65521;
        s2 %= 65521;
      }
      return s1 | s2 << 16 | 0;
    }
    adler32_1 = adler32;
    return adler32_1;
  }
  var crc32_1;
  var hasRequiredCrc32;
  function requireCrc32() {
    if (hasRequiredCrc32) return crc32_1;
    hasRequiredCrc32 = 1;
    function makeTable() {
      var c, table = [];
      for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
          c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
        }
        table[n] = c;
      }
      return table;
    }
    var crcTable = makeTable();
    function crc32(crc, buf, len, pos) {
      var t = crcTable, end = pos + len;
      crc ^= -1;
      for (var i = pos; i < end; i++) {
        crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
      }
      return crc ^ -1;
    }
    crc32_1 = crc32;
    return crc32_1;
  }
  var messages;
  var hasRequiredMessages;
  function requireMessages() {
    if (hasRequiredMessages) return messages;
    hasRequiredMessages = 1;
    messages = {
      2: "need dictionary",
      /* Z_NEED_DICT       2  */
      1: "stream end",
      /* Z_STREAM_END      1  */
      0: "",
      /* Z_OK              0  */
      "-1": "file error",
      /* Z_ERRNO         (-1) */
      "-2": "stream error",
      /* Z_STREAM_ERROR  (-2) */
      "-3": "data error",
      /* Z_DATA_ERROR    (-3) */
      "-4": "insufficient memory",
      /* Z_MEM_ERROR     (-4) */
      "-5": "buffer error",
      /* Z_BUF_ERROR     (-5) */
      "-6": "incompatible version"
      /* Z_VERSION_ERROR (-6) */
    };
    return messages;
  }
  var hasRequiredDeflate$1;
  function requireDeflate$1() {
    if (hasRequiredDeflate$1) return deflate;
    hasRequiredDeflate$1 = 1;
    var utils = requireCommon();
    var trees2 = requireTrees();
    var adler32 = requireAdler32();
    var crc32 = requireCrc32();
    var msg = requireMessages();
    var Z_NO_FLUSH = 0;
    var Z_PARTIAL_FLUSH = 1;
    var Z_FULL_FLUSH = 3;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_BUF_ERROR = -5;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_FILTERED = 1;
    var Z_HUFFMAN_ONLY = 2;
    var Z_RLE = 3;
    var Z_FIXED = 4;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_UNKNOWN = 2;
    var Z_DEFLATED = 8;
    var MAX_MEM_LEVEL = 9;
    var MAX_WBITS = 15;
    var DEF_MEM_LEVEL = 8;
    var LENGTH_CODES = 29;
    var LITERALS = 256;
    var L_CODES = LITERALS + 1 + LENGTH_CODES;
    var D_CODES = 30;
    var BL_CODES = 19;
    var HEAP_SIZE = 2 * L_CODES + 1;
    var MAX_BITS = 15;
    var MIN_MATCH = 3;
    var MAX_MATCH = 258;
    var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
    var PRESET_DICT = 32;
    var INIT_STATE = 42;
    var EXTRA_STATE = 69;
    var NAME_STATE = 73;
    var COMMENT_STATE = 91;
    var HCRC_STATE = 103;
    var BUSY_STATE = 113;
    var FINISH_STATE = 666;
    var BS_NEED_MORE = 1;
    var BS_BLOCK_DONE = 2;
    var BS_FINISH_STARTED = 3;
    var BS_FINISH_DONE = 4;
    var OS_CODE = 3;
    function err(strm, errorCode) {
      strm.msg = msg[errorCode];
      return errorCode;
    }
    function rank(f) {
      return (f << 1) - (f > 4 ? 9 : 0);
    }
    function zero(buf) {
      var len = buf.length;
      while (--len >= 0) {
        buf[len] = 0;
      }
    }
    function flush_pending(strm) {
      var s = strm.state;
      var len = s.pending;
      if (len > strm.avail_out) {
        len = strm.avail_out;
      }
      if (len === 0) {
        return;
      }
      utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
      strm.next_out += len;
      s.pending_out += len;
      strm.total_out += len;
      strm.avail_out -= len;
      s.pending -= len;
      if (s.pending === 0) {
        s.pending_out = 0;
      }
    }
    function flush_block_only(s, last) {
      trees2._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
      s.block_start = s.strstart;
      flush_pending(s.strm);
    }
    function put_byte(s, b) {
      s.pending_buf[s.pending++] = b;
    }
    function putShortMSB(s, b) {
      s.pending_buf[s.pending++] = b >>> 8 & 255;
      s.pending_buf[s.pending++] = b & 255;
    }
    function read_buf(strm, buf, start, size) {
      var len = strm.avail_in;
      if (len > size) {
        len = size;
      }
      if (len === 0) {
        return 0;
      }
      strm.avail_in -= len;
      utils.arraySet(buf, strm.input, strm.next_in, len, start);
      if (strm.state.wrap === 1) {
        strm.adler = adler32(strm.adler, buf, len, start);
      } else if (strm.state.wrap === 2) {
        strm.adler = crc32(strm.adler, buf, len, start);
      }
      strm.next_in += len;
      strm.total_in += len;
      return len;
    }
    function longest_match(s, cur_match) {
      var chain_length = s.max_chain_length;
      var scan = s.strstart;
      var match;
      var len;
      var best_len = s.prev_length;
      var nice_match = s.nice_match;
      var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
      var _win = s.window;
      var wmask = s.w_mask;
      var prev = s.prev;
      var strend = s.strstart + MAX_MATCH;
      var scan_end1 = _win[scan + best_len - 1];
      var scan_end = _win[scan + best_len];
      if (s.prev_length >= s.good_match) {
        chain_length >>= 2;
      }
      if (nice_match > s.lookahead) {
        nice_match = s.lookahead;
      }
      do {
        match = cur_match;
        if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
          continue;
        }
        scan += 2;
        match++;
        do {
        } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          s.match_start = cur_match;
          best_len = len;
          if (len >= nice_match) {
            break;
          }
          scan_end1 = _win[scan + best_len - 1];
          scan_end = _win[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
      if (best_len <= s.lookahead) {
        return best_len;
      }
      return s.lookahead;
    }
    function fill_window(s) {
      var _w_size = s.w_size;
      var p, n, m, more, str;
      do {
        more = s.window_size - s.lookahead - s.strstart;
        if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
          utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
          s.match_start -= _w_size;
          s.strstart -= _w_size;
          s.block_start -= _w_size;
          n = s.hash_size;
          p = n;
          do {
            m = s.head[--p];
            s.head[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          n = _w_size;
          p = n;
          do {
            m = s.prev[--p];
            s.prev[p] = m >= _w_size ? m - _w_size : 0;
          } while (--n);
          more += _w_size;
        }
        if (s.strm.avail_in === 0) {
          break;
        }
        n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
        s.lookahead += n;
        if (s.lookahead + s.insert >= MIN_MATCH) {
          str = s.strstart - s.insert;
          s.ins_h = s.window[str];
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
          while (s.insert) {
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
            s.prev[str & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = str;
            str++;
            s.insert--;
            if (s.lookahead + s.insert < MIN_MATCH) {
              break;
            }
          }
        }
      } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
    }
    function deflate_stored(s, flush) {
      var max_block_size = 65535;
      if (max_block_size > s.pending_buf_size - 5) {
        max_block_size = s.pending_buf_size - 5;
      }
      for (; ; ) {
        if (s.lookahead <= 1) {
          fill_window(s);
          if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.strstart += s.lookahead;
        s.lookahead = 0;
        var max_start = s.block_start + max_block_size;
        if (s.strstart === 0 || s.strstart >= max_start) {
          s.lookahead = s.strstart - max_start;
          s.strstart = max_start;
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
        if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.strstart > s.block_start) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_NEED_MORE;
    }
    function deflate_fast(s, flush) {
      var hash_head;
      var bflush;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees2._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
            s.match_length--;
            do {
              s.strstart++;
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            } while (--s.match_length !== 0);
            s.strstart++;
          } else {
            s.strstart += s.match_length;
            s.match_length = 0;
            s.ins_h = s.window[s.strstart];
            s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
          }
        } else {
          bflush = trees2._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_slow(s, flush) {
      var hash_head;
      var bflush;
      var max_insert;
      for (; ; ) {
        if (s.lookahead < MIN_LOOKAHEAD) {
          fill_window(s);
          if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        hash_head = 0;
        if (s.lookahead >= MIN_MATCH) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
        s.prev_length = s.match_length;
        s.prev_match = s.match_start;
        s.match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
          s.match_length = longest_match(s, hash_head);
          if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
            s.match_length = MIN_MATCH - 1;
          }
        }
        if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
          max_insert = s.strstart + s.lookahead - MIN_MATCH;
          bflush = trees2._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
          s.lookahead -= s.prev_length - 1;
          s.prev_length -= 2;
          do {
            if (++s.strstart <= max_insert) {
              s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
              hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
              s.head[s.ins_h] = s.strstart;
            }
          } while (--s.prev_length !== 0);
          s.match_available = 0;
          s.match_length = MIN_MATCH - 1;
          s.strstart++;
          if (bflush) {
            flush_block_only(s, false);
            if (s.strm.avail_out === 0) {
              return BS_NEED_MORE;
            }
          }
        } else if (s.match_available) {
          bflush = trees2._tr_tally(s, 0, s.window[s.strstart - 1]);
          if (bflush) {
            flush_block_only(s, false);
          }
          s.strstart++;
          s.lookahead--;
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        } else {
          s.match_available = 1;
          s.strstart++;
          s.lookahead--;
        }
      }
      if (s.match_available) {
        bflush = trees2._tr_tally(s, 0, s.window[s.strstart - 1]);
        s.match_available = 0;
      }
      s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_rle(s, flush) {
      var bflush;
      var prev;
      var scan, strend;
      var _win = s.window;
      for (; ; ) {
        if (s.lookahead <= MAX_MATCH) {
          fill_window(s);
          if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
            return BS_NEED_MORE;
          }
          if (s.lookahead === 0) {
            break;
          }
        }
        s.match_length = 0;
        if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
          scan = s.strstart - 1;
          prev = _win[scan];
          if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
            strend = s.strstart + MAX_MATCH;
            do {
            } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
            s.match_length = MAX_MATCH - (strend - scan);
            if (s.match_length > s.lookahead) {
              s.match_length = s.lookahead;
            }
          }
        }
        if (s.match_length >= MIN_MATCH) {
          bflush = trees2._tr_tally(s, 1, s.match_length - MIN_MATCH);
          s.lookahead -= s.match_length;
          s.strstart += s.match_length;
          s.match_length = 0;
        } else {
          bflush = trees2._tr_tally(s, 0, s.window[s.strstart]);
          s.lookahead--;
          s.strstart++;
        }
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function deflate_huff(s, flush) {
      var bflush;
      for (; ; ) {
        if (s.lookahead === 0) {
          fill_window(s);
          if (s.lookahead === 0) {
            if (flush === Z_NO_FLUSH) {
              return BS_NEED_MORE;
            }
            break;
          }
        }
        s.match_length = 0;
        bflush = trees2._tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      }
      s.insert = 0;
      if (flush === Z_FINISH) {
        flush_block_only(s, true);
        if (s.strm.avail_out === 0) {
          return BS_FINISH_STARTED;
        }
        return BS_FINISH_DONE;
      }
      if (s.last_lit) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
      return BS_BLOCK_DONE;
    }
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
      this.good_length = good_length;
      this.max_lazy = max_lazy;
      this.nice_length = nice_length;
      this.max_chain = max_chain;
      this.func = func;
    }
    var configuration_table;
    configuration_table = [
      /*      good lazy nice chain */
      new Config(0, 0, 0, 0, deflate_stored),
      /* 0 store only */
      new Config(4, 4, 8, 4, deflate_fast),
      /* 1 max speed, no lazy matches */
      new Config(4, 5, 16, 8, deflate_fast),
      /* 2 */
      new Config(4, 6, 32, 32, deflate_fast),
      /* 3 */
      new Config(4, 4, 16, 16, deflate_slow),
      /* 4 lazy matches */
      new Config(8, 16, 32, 32, deflate_slow),
      /* 5 */
      new Config(8, 16, 128, 128, deflate_slow),
      /* 6 */
      new Config(8, 32, 128, 256, deflate_slow),
      /* 7 */
      new Config(32, 128, 258, 1024, deflate_slow),
      /* 8 */
      new Config(32, 258, 258, 4096, deflate_slow)
      /* 9 max compression */
    ];
    function lm_init(s) {
      s.window_size = 2 * s.w_size;
      zero(s.head);
      s.max_lazy_match = configuration_table[s.level].max_lazy;
      s.good_match = configuration_table[s.level].good_length;
      s.nice_match = configuration_table[s.level].nice_length;
      s.max_chain_length = configuration_table[s.level].max_chain;
      s.strstart = 0;
      s.block_start = 0;
      s.lookahead = 0;
      s.insert = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      s.ins_h = 0;
    }
    function DeflateState() {
      this.strm = null;
      this.status = 0;
      this.pending_buf = null;
      this.pending_buf_size = 0;
      this.pending_out = 0;
      this.pending = 0;
      this.wrap = 0;
      this.gzhead = null;
      this.gzindex = 0;
      this.method = Z_DEFLATED;
      this.last_flush = -1;
      this.w_size = 0;
      this.w_bits = 0;
      this.w_mask = 0;
      this.window = null;
      this.window_size = 0;
      this.prev = null;
      this.head = null;
      this.ins_h = 0;
      this.hash_size = 0;
      this.hash_bits = 0;
      this.hash_mask = 0;
      this.hash_shift = 0;
      this.block_start = 0;
      this.match_length = 0;
      this.prev_match = 0;
      this.match_available = 0;
      this.strstart = 0;
      this.match_start = 0;
      this.lookahead = 0;
      this.prev_length = 0;
      this.max_chain_length = 0;
      this.max_lazy_match = 0;
      this.level = 0;
      this.strategy = 0;
      this.good_match = 0;
      this.nice_match = 0;
      this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
      this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
      this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
      zero(this.dyn_ltree);
      zero(this.dyn_dtree);
      zero(this.bl_tree);
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = new utils.Buf16(MAX_BITS + 1);
      this.heap = new utils.Buf16(2 * L_CODES + 1);
      zero(this.heap);
      this.heap_len = 0;
      this.heap_max = 0;
      this.depth = new utils.Buf16(2 * L_CODES + 1);
      zero(this.depth);
      this.l_buf = 0;
      this.lit_bufsize = 0;
      this.last_lit = 0;
      this.d_buf = 0;
      this.opt_len = 0;
      this.static_len = 0;
      this.matches = 0;
      this.insert = 0;
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
    function deflateResetKeep(strm) {
      var s;
      if (!strm || !strm.state) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.total_in = strm.total_out = 0;
      strm.data_type = Z_UNKNOWN;
      s = strm.state;
      s.pending = 0;
      s.pending_out = 0;
      if (s.wrap < 0) {
        s.wrap = -s.wrap;
      }
      s.status = s.wrap ? INIT_STATE : BUSY_STATE;
      strm.adler = s.wrap === 2 ? 0 : 1;
      s.last_flush = Z_NO_FLUSH;
      trees2._tr_init(s);
      return Z_OK;
    }
    function deflateReset(strm) {
      var ret = deflateResetKeep(strm);
      if (ret === Z_OK) {
        lm_init(strm.state);
      }
      return ret;
    }
    function deflateSetHeader(strm, head) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      if (strm.state.wrap !== 2) {
        return Z_STREAM_ERROR;
      }
      strm.state.gzhead = head;
      return Z_OK;
    }
    function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      var wrap2 = 1;
      if (level === Z_DEFAULT_COMPRESSION) {
        level = 6;
      }
      if (windowBits < 0) {
        wrap2 = 0;
        windowBits = -windowBits;
      } else if (windowBits > 15) {
        wrap2 = 2;
        windowBits -= 16;
      }
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
        return err(strm, Z_STREAM_ERROR);
      }
      if (windowBits === 8) {
        windowBits = 9;
      }
      var s = new DeflateState();
      strm.state = s;
      s.strm = strm;
      s.wrap = wrap2;
      s.gzhead = null;
      s.w_bits = windowBits;
      s.w_size = 1 << s.w_bits;
      s.w_mask = s.w_size - 1;
      s.hash_bits = memLevel + 7;
      s.hash_size = 1 << s.hash_bits;
      s.hash_mask = s.hash_size - 1;
      s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      s.window = new utils.Buf8(s.w_size * 2);
      s.head = new utils.Buf16(s.hash_size);
      s.prev = new utils.Buf16(s.w_size);
      s.lit_bufsize = 1 << memLevel + 6;
      s.pending_buf_size = s.lit_bufsize * 4;
      s.pending_buf = new utils.Buf8(s.pending_buf_size);
      s.d_buf = 1 * s.lit_bufsize;
      s.l_buf = (1 + 2) * s.lit_bufsize;
      s.level = level;
      s.strategy = strategy;
      s.method = method;
      return deflateReset(strm);
    }
    function deflateInit(strm, level) {
      return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
    }
    function deflate$12(strm, flush) {
      var old_flush, s;
      var beg, val;
      if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
        return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
      }
      s = strm.state;
      if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
        return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
      }
      s.strm = strm;
      old_flush = s.last_flush;
      s.last_flush = flush;
      if (s.status === INIT_STATE) {
        if (s.wrap === 2) {
          strm.adler = 0;
          put_byte(s, 31);
          put_byte(s, 139);
          put_byte(s, 8);
          if (!s.gzhead) {
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, 0);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, OS_CODE);
            s.status = BUSY_STATE;
          } else {
            put_byte(
              s,
              (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
            );
            put_byte(s, s.gzhead.time & 255);
            put_byte(s, s.gzhead.time >> 8 & 255);
            put_byte(s, s.gzhead.time >> 16 & 255);
            put_byte(s, s.gzhead.time >> 24 & 255);
            put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
            put_byte(s, s.gzhead.os & 255);
            if (s.gzhead.extra && s.gzhead.extra.length) {
              put_byte(s, s.gzhead.extra.length & 255);
              put_byte(s, s.gzhead.extra.length >> 8 & 255);
            }
            if (s.gzhead.hcrc) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
            }
            s.gzindex = 0;
            s.status = EXTRA_STATE;
          }
        } else {
          var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
          var level_flags = -1;
          if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
            level_flags = 0;
          } else if (s.level < 6) {
            level_flags = 1;
          } else if (s.level === 6) {
            level_flags = 2;
          } else {
            level_flags = 3;
          }
          header |= level_flags << 6;
          if (s.strstart !== 0) {
            header |= PRESET_DICT;
          }
          header += 31 - header % 31;
          s.status = BUSY_STATE;
          putShortMSB(s, header);
          if (s.strstart !== 0) {
            putShortMSB(s, strm.adler >>> 16);
            putShortMSB(s, strm.adler & 65535);
          }
          strm.adler = 1;
        }
      }
      if (s.status === EXTRA_STATE) {
        if (s.gzhead.extra) {
          beg = s.pending;
          while (s.gzindex < (s.gzhead.extra.length & 65535)) {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                break;
              }
            }
            put_byte(s, s.gzhead.extra[s.gzindex] & 255);
            s.gzindex++;
          }
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (s.gzindex === s.gzhead.extra.length) {
            s.gzindex = 0;
            s.status = NAME_STATE;
          }
        } else {
          s.status = NAME_STATE;
        }
      }
      if (s.status === NAME_STATE) {
        if (s.gzhead.name) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.name.length) {
              val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.gzindex = 0;
            s.status = COMMENT_STATE;
          }
        } else {
          s.status = COMMENT_STATE;
        }
      }
      if (s.status === COMMENT_STATE) {
        if (s.gzhead.comment) {
          beg = s.pending;
          do {
            if (s.pending === s.pending_buf_size) {
              if (s.gzhead.hcrc && s.pending > beg) {
                strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
              }
              flush_pending(strm);
              beg = s.pending;
              if (s.pending === s.pending_buf_size) {
                val = 1;
                break;
              }
            }
            if (s.gzindex < s.gzhead.comment.length) {
              val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
            } else {
              val = 0;
            }
            put_byte(s, val);
          } while (val !== 0);
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          if (val === 0) {
            s.status = HCRC_STATE;
          }
        } else {
          s.status = HCRC_STATE;
        }
      }
      if (s.status === HCRC_STATE) {
        if (s.gzhead.hcrc) {
          if (s.pending + 2 > s.pending_buf_size) {
            flush_pending(strm);
          }
          if (s.pending + 2 <= s.pending_buf_size) {
            put_byte(s, strm.adler & 255);
            put_byte(s, strm.adler >> 8 & 255);
            strm.adler = 0;
            s.status = BUSY_STATE;
          }
        } else {
          s.status = BUSY_STATE;
        }
      }
      if (s.pending !== 0) {
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
        return err(strm, Z_BUF_ERROR);
      }
      if (s.status === FINISH_STATE && strm.avail_in !== 0) {
        return err(strm, Z_BUF_ERROR);
      }
      if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
        var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
        if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
          s.status = FINISH_STATE;
        }
        if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
          if (strm.avail_out === 0) {
            s.last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate === BS_BLOCK_DONE) {
          if (flush === Z_PARTIAL_FLUSH) {
            trees2._tr_align(s);
          } else if (flush !== Z_BLOCK) {
            trees2._tr_stored_block(s, 0, 0, false);
            if (flush === Z_FULL_FLUSH) {
              zero(s.head);
              if (s.lookahead === 0) {
                s.strstart = 0;
                s.block_start = 0;
                s.insert = 0;
              }
            }
          }
          flush_pending(strm);
          if (strm.avail_out === 0) {
            s.last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush !== Z_FINISH) {
        return Z_OK;
      }
      if (s.wrap <= 0) {
        return Z_STREAM_END;
      }
      if (s.wrap === 2) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        put_byte(s, strm.adler >> 16 & 255);
        put_byte(s, strm.adler >> 24 & 255);
        put_byte(s, strm.total_in & 255);
        put_byte(s, strm.total_in >> 8 & 255);
        put_byte(s, strm.total_in >> 16 & 255);
        put_byte(s, strm.total_in >> 24 & 255);
      } else {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      flush_pending(strm);
      if (s.wrap > 0) {
        s.wrap = -s.wrap;
      }
      return s.pending !== 0 ? Z_OK : Z_STREAM_END;
    }
    function deflateEnd(strm) {
      var status;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      status = strm.state.status;
      if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
        return err(strm, Z_STREAM_ERROR);
      }
      strm.state = null;
      return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
    }
    function deflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var s;
      var str, n;
      var wrap2;
      var avail;
      var next;
      var input;
      var tmpDict;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      s = strm.state;
      wrap2 = s.wrap;
      if (wrap2 === 2 || wrap2 === 1 && s.status !== INIT_STATE || s.lookahead) {
        return Z_STREAM_ERROR;
      }
      if (wrap2 === 1) {
        strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
      }
      s.wrap = 0;
      if (dictLength >= s.w_size) {
        if (wrap2 === 0) {
          zero(s.head);
          s.strstart = 0;
          s.block_start = 0;
          s.insert = 0;
        }
        tmpDict = new utils.Buf8(s.w_size);
        utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
        dictionary = tmpDict;
        dictLength = s.w_size;
      }
      avail = strm.avail_in;
      next = strm.next_in;
      input = strm.input;
      strm.avail_in = dictLength;
      strm.next_in = 0;
      strm.input = dictionary;
      fill_window(s);
      while (s.lookahead >= MIN_MATCH) {
        str = s.strstart;
        n = s.lookahead - (MIN_MATCH - 1);
        do {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
        } while (--n);
        s.strstart = str;
        s.lookahead = MIN_MATCH - 1;
        fill_window(s);
      }
      s.strstart += s.lookahead;
      s.block_start = s.strstart;
      s.insert = s.lookahead;
      s.lookahead = 0;
      s.match_length = s.prev_length = MIN_MATCH - 1;
      s.match_available = 0;
      strm.next_in = next;
      strm.input = input;
      strm.avail_in = avail;
      s.wrap = wrap2;
      return Z_OK;
    }
    deflate.deflateInit = deflateInit;
    deflate.deflateInit2 = deflateInit2;
    deflate.deflateReset = deflateReset;
    deflate.deflateResetKeep = deflateResetKeep;
    deflate.deflateSetHeader = deflateSetHeader;
    deflate.deflate = deflate$12;
    deflate.deflateEnd = deflateEnd;
    deflate.deflateSetDictionary = deflateSetDictionary;
    deflate.deflateInfo = "pako deflate (from Nodeca project)";
    return deflate;
  }
  var strings = {};
  var hasRequiredStrings;
  function requireStrings() {
    if (hasRequiredStrings) return strings;
    hasRequiredStrings = 1;
    var utils = requireCommon();
    var STR_APPLY_OK = true;
    var STR_APPLY_UIA_OK = true;
    try {
      String.fromCharCode.apply(null, [0]);
    } catch (__) {
      STR_APPLY_OK = false;
    }
    try {
      String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
      STR_APPLY_UIA_OK = false;
    }
    var _utf8len = new utils.Buf8(256);
    for (var q = 0; q < 256; q++) {
      _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    _utf8len[254] = _utf8len[254] = 1;
    strings.string2buf = function(str) {
      var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
      for (m_pos = 0; m_pos < str_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
      }
      buf = new utils.Buf8(buf_len);
      for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
        c = str.charCodeAt(m_pos);
        if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
          c2 = str.charCodeAt(m_pos + 1);
          if ((c2 & 64512) === 56320) {
            c = 65536 + (c - 55296 << 10) + (c2 - 56320);
            m_pos++;
          }
        }
        if (c < 128) {
          buf[i++] = c;
        } else if (c < 2048) {
          buf[i++] = 192 | c >>> 6;
          buf[i++] = 128 | c & 63;
        } else if (c < 65536) {
          buf[i++] = 224 | c >>> 12;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        } else {
          buf[i++] = 240 | c >>> 18;
          buf[i++] = 128 | c >>> 12 & 63;
          buf[i++] = 128 | c >>> 6 & 63;
          buf[i++] = 128 | c & 63;
        }
      }
      return buf;
    };
    function buf2binstring(buf, len) {
      if (len < 65534) {
        if (buf.subarray && STR_APPLY_UIA_OK || !buf.subarray && STR_APPLY_OK) {
          return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
        }
      }
      var result = "";
      for (var i = 0; i < len; i++) {
        result += String.fromCharCode(buf[i]);
      }
      return result;
    }
    strings.buf2binstring = function(buf) {
      return buf2binstring(buf, buf.length);
    };
    strings.binstring2buf = function(str) {
      var buf = new utils.Buf8(str.length);
      for (var i = 0, len = buf.length; i < len; i++) {
        buf[i] = str.charCodeAt(i);
      }
      return buf;
    };
    strings.buf2string = function(buf, max) {
      var i, out, c, c_len;
      var len = max || buf.length;
      var utf16buf = new Array(len * 2);
      for (out = 0, i = 0; i < len; ) {
        c = buf[i++];
        if (c < 128) {
          utf16buf[out++] = c;
          continue;
        }
        c_len = _utf8len[c];
        if (c_len > 4) {
          utf16buf[out++] = 65533;
          i += c_len - 1;
          continue;
        }
        c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
        while (c_len > 1 && i < len) {
          c = c << 6 | buf[i++] & 63;
          c_len--;
        }
        if (c_len > 1) {
          utf16buf[out++] = 65533;
          continue;
        }
        if (c < 65536) {
          utf16buf[out++] = c;
        } else {
          c -= 65536;
          utf16buf[out++] = 55296 | c >> 10 & 1023;
          utf16buf[out++] = 56320 | c & 1023;
        }
      }
      return buf2binstring(utf16buf, out);
    };
    strings.utf8border = function(buf, max) {
      var pos;
      max = max || buf.length;
      if (max > buf.length) {
        max = buf.length;
      }
      pos = max - 1;
      while (pos >= 0 && (buf[pos] & 192) === 128) {
        pos--;
      }
      if (pos < 0) {
        return max;
      }
      if (pos === 0) {
        return max;
      }
      return pos + _utf8len[buf[pos]] > max ? pos : max;
    };
    return strings;
  }
  var zstream;
  var hasRequiredZstream;
  function requireZstream() {
    if (hasRequiredZstream) return zstream;
    hasRequiredZstream = 1;
    function ZStream() {
      this.input = null;
      this.next_in = 0;
      this.avail_in = 0;
      this.total_in = 0;
      this.output = null;
      this.next_out = 0;
      this.avail_out = 0;
      this.total_out = 0;
      this.msg = "";
      this.state = null;
      this.data_type = 2;
      this.adler = 0;
    }
    zstream = ZStream;
    return zstream;
  }
  var hasRequiredDeflate;
  function requireDeflate() {
    if (hasRequiredDeflate) return deflate$1;
    hasRequiredDeflate = 1;
    var zlib_deflate = requireDeflate$1();
    var utils = requireCommon();
    var strings2 = requireStrings();
    var msg = requireMessages();
    var ZStream = requireZstream();
    var toString = Object.prototype.toString;
    var Z_NO_FLUSH = 0;
    var Z_FINISH = 4;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_SYNC_FLUSH = 2;
    var Z_DEFAULT_COMPRESSION = -1;
    var Z_DEFAULT_STRATEGY = 0;
    var Z_DEFLATED = 8;
    function Deflate(options) {
      if (!(this instanceof Deflate)) return new Deflate(options);
      this.options = utils.assign({
        level: Z_DEFAULT_COMPRESSION,
        method: Z_DEFLATED,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: Z_DEFAULT_STRATEGY,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits > 0) {
        opt.windowBits = -opt.windowBits;
      } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
        opt.windowBits += 16;
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_deflate.deflateInit2(
        this.strm,
        opt.level,
        opt.method,
        opt.windowBits,
        opt.memLevel,
        opt.strategy
      );
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
      if (opt.header) {
        zlib_deflate.deflateSetHeader(this.strm, opt.header);
      }
      if (opt.dictionary) {
        var dict;
        if (typeof opt.dictionary === "string") {
          dict = strings2.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          dict = new Uint8Array(opt.dictionary);
        } else {
          dict = opt.dictionary;
        }
        status = zlib_deflate.deflateSetDictionary(this.strm, dict);
        if (status !== Z_OK) {
          throw new Error(msg[status]);
        }
        this._dict_set = true;
      }
    }
    Deflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var status, _mode;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings2.string2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_deflate.deflate(strm, _mode);
        if (status !== Z_STREAM_END && status !== Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
          if (this.options.to === "string") {
            this.onData(strings2.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
          } else {
            this.onData(utils.shrinkBuf(strm.output, strm.next_out));
          }
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
      if (_mode === Z_FINISH) {
        status = zlib_deflate.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK;
      }
      if (_mode === Z_SYNC_FLUSH) {
        this.onEnd(Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Deflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Deflate.prototype.onEnd = function(status) {
      if (status === Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function deflate2(input, options) {
      var deflator = new Deflate(options);
      deflator.push(input, true);
      if (deflator.err) {
        throw deflator.msg || msg[deflator.err];
      }
      return deflator.result;
    }
    function deflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return deflate2(input, options);
    }
    function gzip(input, options) {
      options = options || {};
      options.gzip = true;
      return deflate2(input, options);
    }
    deflate$1.Deflate = Deflate;
    deflate$1.deflate = deflate2;
    deflate$1.deflateRaw = deflateRaw;
    deflate$1.gzip = gzip;
    return deflate$1;
  }
  var inflate$1 = {};
  var inflate = {};
  var inffast;
  var hasRequiredInffast;
  function requireInffast() {
    if (hasRequiredInffast) return inffast;
    hasRequiredInffast = 1;
    var BAD = 30;
    var TYPE = 12;
    inffast = function inflate_fast(strm, start) {
      var state;
      var _in;
      var last;
      var _out;
      var beg;
      var end;
      var dmax;
      var wsize;
      var whave;
      var wnext;
      var s_window;
      var hold;
      var bits;
      var lcode;
      var dcode;
      var lmask;
      var dmask;
      var here;
      var op;
      var len;
      var dist;
      var from;
      var from_source;
      var input, output;
      state = strm.state;
      _in = strm.next_in;
      input = strm.input;
      last = _in + (strm.avail_in - 5);
      _out = strm.next_out;
      output = strm.output;
      beg = _out - (start - strm.avail_out);
      end = _out + (strm.avail_out - 257);
      dmax = state.dmax;
      wsize = state.wsize;
      whave = state.whave;
      wnext = state.wnext;
      s_window = state.window;
      hold = state.hold;
      bits = state.bits;
      lcode = state.lencode;
      dcode = state.distcode;
      lmask = (1 << state.lenbits) - 1;
      dmask = (1 << state.distbits) - 1;
      top:
        do {
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = lcode[hold & lmask];
          dolen:
            for (; ; ) {
              op = here >>> 24;
              hold >>>= op;
              bits -= op;
              op = here >>> 16 & 255;
              if (op === 0) {
                output[_out++] = here & 65535;
              } else if (op & 16) {
                len = here & 65535;
                op &= 15;
                if (op) {
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                  }
                  len += hold & (1 << op) - 1;
                  hold >>>= op;
                  bits -= op;
                }
                if (bits < 15) {
                  hold += input[_in++] << bits;
                  bits += 8;
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                here = dcode[hold & dmask];
                dodist:
                  for (; ; ) {
                    op = here >>> 24;
                    hold >>>= op;
                    bits -= op;
                    op = here >>> 16 & 255;
                    if (op & 16) {
                      dist = here & 65535;
                      op &= 15;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        if (bits < op) {
                          hold += input[_in++] << bits;
                          bits += 8;
                        }
                      }
                      dist += hold & (1 << op) - 1;
                      if (dist > dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                      hold >>>= op;
                      bits -= op;
                      op = _out - beg;
                      if (dist > op) {
                        op = dist - op;
                        if (op > whave) {
                          if (state.sane) {
                            strm.msg = "invalid distance too far back";
                            state.mode = BAD;
                            break top;
                          }
                        }
                        from = 0;
                        from_source = s_window;
                        if (wnext === 0) {
                          from += wsize - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        } else if (wnext < op) {
                          from += wsize + wnext - op;
                          op -= wnext;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = 0;
                            if (wnext < len) {
                              op = wnext;
                              len -= op;
                              do {
                                output[_out++] = s_window[from++];
                              } while (--op);
                              from = _out - dist;
                              from_source = output;
                            }
                          }
                        } else {
                          from += wnext - op;
                          if (op < len) {
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                        while (len > 2) {
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          output[_out++] = from_source[from++];
                          len -= 3;
                        }
                        if (len) {
                          output[_out++] = from_source[from++];
                          if (len > 1) {
                            output[_out++] = from_source[from++];
                          }
                        }
                      } else {
                        from = _out - dist;
                        do {
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          output[_out++] = output[from++];
                          len -= 3;
                        } while (len > 2);
                        if (len) {
                          output[_out++] = output[from++];
                          if (len > 1) {
                            output[_out++] = output[from++];
                          }
                        }
                      }
                    } else if ((op & 64) === 0) {
                      here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                      continue dodist;
                    } else {
                      strm.msg = "invalid distance code";
                      state.mode = BAD;
                      break top;
                    }
                    break;
                  }
              } else if ((op & 64) === 0) {
                here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
                continue dolen;
              } else if (op & 32) {
                state.mode = TYPE;
                break top;
              } else {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break top;
              }
              break;
            }
        } while (_in < last && _out < end);
      len = bits >> 3;
      _in -= len;
      bits -= len << 3;
      hold &= (1 << bits) - 1;
      strm.next_in = _in;
      strm.next_out = _out;
      strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
      strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
      state.hold = hold;
      state.bits = bits;
      return;
    };
    return inffast;
  }
  var inftrees;
  var hasRequiredInftrees;
  function requireInftrees() {
    if (hasRequiredInftrees) return inftrees;
    hasRequiredInftrees = 1;
    var utils = requireCommon();
    var MAXBITS = 15;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var lbase = [
      /* Length codes 257..285 base */
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      13,
      15,
      17,
      19,
      23,
      27,
      31,
      35,
      43,
      51,
      59,
      67,
      83,
      99,
      115,
      131,
      163,
      195,
      227,
      258,
      0,
      0
    ];
    var lext = [
      /* Length codes 257..285 extra */
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      16,
      17,
      17,
      17,
      17,
      18,
      18,
      18,
      18,
      19,
      19,
      19,
      19,
      20,
      20,
      20,
      20,
      21,
      21,
      21,
      21,
      16,
      72,
      78
    ];
    var dbase = [
      /* Distance codes 0..29 base */
      1,
      2,
      3,
      4,
      5,
      7,
      9,
      13,
      17,
      25,
      33,
      49,
      65,
      97,
      129,
      193,
      257,
      385,
      513,
      769,
      1025,
      1537,
      2049,
      3073,
      4097,
      6145,
      8193,
      12289,
      16385,
      24577,
      0,
      0
    ];
    var dext = [
      /* Distance codes 0..29 extra */
      16,
      16,
      16,
      16,
      17,
      17,
      18,
      18,
      19,
      19,
      20,
      20,
      21,
      21,
      22,
      22,
      23,
      23,
      24,
      24,
      25,
      25,
      26,
      26,
      27,
      27,
      28,
      28,
      29,
      29,
      64,
      64
    ];
    inftrees = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
      var bits = opts.bits;
      var len = 0;
      var sym = 0;
      var min = 0, max = 0;
      var root = 0;
      var curr = 0;
      var drop = 0;
      var left = 0;
      var used = 0;
      var huff = 0;
      var incr;
      var fill;
      var low;
      var mask;
      var next;
      var base = null;
      var base_index = 0;
      var end;
      var count = new utils.Buf16(MAXBITS + 1);
      var offs = new utils.Buf16(MAXBITS + 1);
      var extra = null;
      var extra_index = 0;
      var here_bits, here_op, here_val;
      for (len = 0; len <= MAXBITS; len++) {
        count[len] = 0;
      }
      for (sym = 0; sym < codes; sym++) {
        count[lens[lens_index + sym]]++;
      }
      root = bits;
      for (max = MAXBITS; max >= 1; max--) {
        if (count[max] !== 0) {
          break;
        }
      }
      if (root > max) {
        root = max;
      }
      if (max === 0) {
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        table[table_index++] = 1 << 24 | 64 << 16 | 0;
        opts.bits = 1;
        return 0;
      }
      for (min = 1; min < max; min++) {
        if (count[min] !== 0) {
          break;
        }
      }
      if (root < min) {
        root = min;
      }
      left = 1;
      for (len = 1; len <= MAXBITS; len++) {
        left <<= 1;
        left -= count[len];
        if (left < 0) {
          return -1;
        }
      }
      if (left > 0 && (type === CODES || max !== 1)) {
        return -1;
      }
      offs[1] = 0;
      for (len = 1; len < MAXBITS; len++) {
        offs[len + 1] = offs[len] + count[len];
      }
      for (sym = 0; sym < codes; sym++) {
        if (lens[lens_index + sym] !== 0) {
          work[offs[lens[lens_index + sym]]++] = sym;
        }
      }
      if (type === CODES) {
        base = extra = work;
        end = 19;
      } else if (type === LENS) {
        base = lbase;
        base_index -= 257;
        extra = lext;
        extra_index -= 257;
        end = 256;
      } else {
        base = dbase;
        extra = dext;
        end = -1;
      }
      huff = 0;
      sym = 0;
      len = min;
      next = table_index;
      curr = root;
      drop = 0;
      low = -1;
      used = 1 << root;
      mask = used - 1;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      for (; ; ) {
        here_bits = len - drop;
        if (work[sym] < end) {
          here_op = 0;
          here_val = work[sym];
        } else if (work[sym] > end) {
          here_op = extra[extra_index + work[sym]];
          here_val = base[base_index + work[sym]];
        } else {
          here_op = 32 + 64;
          here_val = 0;
        }
        incr = 1 << len - drop;
        fill = 1 << curr;
        min = fill;
        do {
          fill -= incr;
          table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
        } while (fill !== 0);
        incr = 1 << len - 1;
        while (huff & incr) {
          incr >>= 1;
        }
        if (incr !== 0) {
          huff &= incr - 1;
          huff += incr;
        } else {
          huff = 0;
        }
        sym++;
        if (--count[len] === 0) {
          if (len === max) {
            break;
          }
          len = lens[lens_index + work[sym]];
        }
        if (len > root && (huff & mask) !== low) {
          if (drop === 0) {
            drop = root;
          }
          next += min;
          curr = len - drop;
          left = 1 << curr;
          while (curr + drop < max) {
            left -= count[curr + drop];
            if (left <= 0) {
              break;
            }
            curr++;
            left <<= 1;
          }
          used += 1 << curr;
          if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
            return 1;
          }
          low = huff & mask;
          table[low] = root << 24 | curr << 16 | next - table_index | 0;
        }
      }
      if (huff !== 0) {
        table[next + huff] = len - drop << 24 | 64 << 16 | 0;
      }
      opts.bits = root;
      return 0;
    };
    return inftrees;
  }
  var hasRequiredInflate$1;
  function requireInflate$1() {
    if (hasRequiredInflate$1) return inflate;
    hasRequiredInflate$1 = 1;
    var utils = requireCommon();
    var adler32 = requireAdler32();
    var crc32 = requireCrc32();
    var inflate_fast = requireInffast();
    var inflate_table = requireInftrees();
    var CODES = 0;
    var LENS = 1;
    var DISTS = 2;
    var Z_FINISH = 4;
    var Z_BLOCK = 5;
    var Z_TREES = 6;
    var Z_OK = 0;
    var Z_STREAM_END = 1;
    var Z_NEED_DICT = 2;
    var Z_STREAM_ERROR = -2;
    var Z_DATA_ERROR = -3;
    var Z_MEM_ERROR = -4;
    var Z_BUF_ERROR = -5;
    var Z_DEFLATED = 8;
    var HEAD = 1;
    var FLAGS = 2;
    var TIME = 3;
    var OS = 4;
    var EXLEN = 5;
    var EXTRA = 6;
    var NAME = 7;
    var COMMENT = 8;
    var HCRC = 9;
    var DICTID = 10;
    var DICT = 11;
    var TYPE = 12;
    var TYPEDO = 13;
    var STORED = 14;
    var COPY_ = 15;
    var COPY = 16;
    var TABLE = 17;
    var LENLENS = 18;
    var CODELENS = 19;
    var LEN_ = 20;
    var LEN = 21;
    var LENEXT = 22;
    var DIST = 23;
    var DISTEXT = 24;
    var MATCH = 25;
    var LIT = 26;
    var CHECK = 27;
    var LENGTH = 28;
    var DONE = 29;
    var BAD = 30;
    var MEM = 31;
    var SYNC = 32;
    var ENOUGH_LENS = 852;
    var ENOUGH_DISTS = 592;
    var MAX_WBITS = 15;
    var DEF_WBITS = MAX_WBITS;
    function zswap32(q) {
      return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
    }
    function InflateState() {
      this.mode = 0;
      this.last = false;
      this.wrap = 0;
      this.havedict = false;
      this.flags = 0;
      this.dmax = 0;
      this.check = 0;
      this.total = 0;
      this.head = null;
      this.wbits = 0;
      this.wsize = 0;
      this.whave = 0;
      this.wnext = 0;
      this.window = null;
      this.hold = 0;
      this.bits = 0;
      this.length = 0;
      this.offset = 0;
      this.extra = 0;
      this.lencode = null;
      this.distcode = null;
      this.lenbits = 0;
      this.distbits = 0;
      this.ncode = 0;
      this.nlen = 0;
      this.ndist = 0;
      this.have = 0;
      this.next = null;
      this.lens = new utils.Buf16(320);
      this.work = new utils.Buf16(288);
      this.lendyn = null;
      this.distdyn = null;
      this.sane = 0;
      this.back = 0;
      this.was = 0;
    }
    function inflateResetKeep(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      strm.total_in = strm.total_out = state.total = 0;
      strm.msg = "";
      if (state.wrap) {
        strm.adler = state.wrap & 1;
      }
      state.mode = HEAD;
      state.last = 0;
      state.havedict = 0;
      state.dmax = 32768;
      state.head = null;
      state.hold = 0;
      state.bits = 0;
      state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
      state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
      state.sane = 1;
      state.back = -1;
      return Z_OK;
    }
    function inflateReset(strm) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      state.wsize = 0;
      state.whave = 0;
      state.wnext = 0;
      return inflateResetKeep(strm);
    }
    function inflateReset2(strm, windowBits) {
      var wrap2;
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (windowBits < 0) {
        wrap2 = 0;
        windowBits = -windowBits;
      } else {
        wrap2 = (windowBits >> 4) + 1;
        if (windowBits < 48) {
          windowBits &= 15;
        }
      }
      if (windowBits && (windowBits < 8 || windowBits > 15)) {
        return Z_STREAM_ERROR;
      }
      if (state.window !== null && state.wbits !== windowBits) {
        state.window = null;
      }
      state.wrap = wrap2;
      state.wbits = windowBits;
      return inflateReset(strm);
    }
    function inflateInit2(strm, windowBits) {
      var ret;
      var state;
      if (!strm) {
        return Z_STREAM_ERROR;
      }
      state = new InflateState();
      strm.state = state;
      state.window = null;
      ret = inflateReset2(strm, windowBits);
      if (ret !== Z_OK) {
        strm.state = null;
      }
      return ret;
    }
    function inflateInit(strm) {
      return inflateInit2(strm, DEF_WBITS);
    }
    var virgin = true;
    var lenfix, distfix;
    function fixedtables(state) {
      if (virgin) {
        var sym;
        lenfix = new utils.Buf32(512);
        distfix = new utils.Buf32(32);
        sym = 0;
        while (sym < 144) {
          state.lens[sym++] = 8;
        }
        while (sym < 256) {
          state.lens[sym++] = 9;
        }
        while (sym < 280) {
          state.lens[sym++] = 7;
        }
        while (sym < 288) {
          state.lens[sym++] = 8;
        }
        inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
        sym = 0;
        while (sym < 32) {
          state.lens[sym++] = 5;
        }
        inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
        virgin = false;
      }
      state.lencode = lenfix;
      state.lenbits = 9;
      state.distcode = distfix;
      state.distbits = 5;
    }
    function updatewindow(strm, src, end, copy) {
      var dist;
      var state = strm.state;
      if (state.window === null) {
        state.wsize = 1 << state.wbits;
        state.wnext = 0;
        state.whave = 0;
        state.window = new utils.Buf8(state.wsize);
      }
      if (copy >= state.wsize) {
        utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
        state.wnext = 0;
        state.whave = state.wsize;
      } else {
        dist = state.wsize - state.wnext;
        if (dist > copy) {
          dist = copy;
        }
        utils.arraySet(state.window, src, end - copy, dist, state.wnext);
        copy -= dist;
        if (copy) {
          utils.arraySet(state.window, src, end - copy, copy, 0);
          state.wnext = copy;
          state.whave = state.wsize;
        } else {
          state.wnext += dist;
          if (state.wnext === state.wsize) {
            state.wnext = 0;
          }
          if (state.whave < state.wsize) {
            state.whave += dist;
          }
        }
      }
      return 0;
    }
    function inflate$12(strm, flush) {
      var state;
      var input, output;
      var next;
      var put;
      var have, left;
      var hold;
      var bits;
      var _in, _out;
      var copy;
      var from;
      var from_source;
      var here = 0;
      var here_bits, here_op, here_val;
      var last_bits, last_op, last_val;
      var len;
      var ret;
      var hbuf = new utils.Buf8(4);
      var opts;
      var n;
      var order = (
        /* permutation of code lengths */
        [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
      );
      if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.mode === TYPE) {
        state.mode = TYPEDO;
      }
      put = strm.next_out;
      output = strm.output;
      left = strm.avail_out;
      next = strm.next_in;
      input = strm.input;
      have = strm.avail_in;
      hold = state.hold;
      bits = state.bits;
      _in = have;
      _out = left;
      ret = Z_OK;
      inf_leave:
        for (; ; ) {
          switch (state.mode) {
            case HEAD:
              if (state.wrap === 0) {
                state.mode = TYPEDO;
                break;
              }
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 2 && hold === 35615) {
                state.check = 0;
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
                hold = 0;
                bits = 0;
                state.mode = FLAGS;
                break;
              }
              state.flags = 0;
              if (state.head) {
                state.head.done = false;
              }
              if (!(state.wrap & 1) || /* check if zlib header allowed */
              (((hold & 255) << 8) + (hold >> 8)) % 31) {
                strm.msg = "incorrect header check";
                state.mode = BAD;
                break;
              }
              if ((hold & 15) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              hold >>>= 4;
              bits -= 4;
              len = (hold & 15) + 8;
              if (state.wbits === 0) {
                state.wbits = len;
              } else if (len > state.wbits) {
                strm.msg = "invalid window size";
                state.mode = BAD;
                break;
              }
              state.dmax = 1 << len;
              strm.adler = state.check = 1;
              state.mode = hold & 512 ? DICTID : TYPE;
              hold = 0;
              bits = 0;
              break;
            case FLAGS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.flags = hold;
              if ((state.flags & 255) !== Z_DEFLATED) {
                strm.msg = "unknown compression method";
                state.mode = BAD;
                break;
              }
              if (state.flags & 57344) {
                strm.msg = "unknown header flags set";
                state.mode = BAD;
                break;
              }
              if (state.head) {
                state.head.text = hold >> 8 & 1;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = TIME;
            /* falls through */
            case TIME:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.time = hold;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                hbuf[2] = hold >>> 16 & 255;
                hbuf[3] = hold >>> 24 & 255;
                state.check = crc32(state.check, hbuf, 4, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = OS;
            /* falls through */
            case OS:
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.head) {
                state.head.xflags = hold & 255;
                state.head.os = hold >> 8;
              }
              if (state.flags & 512) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
              state.mode = EXLEN;
            /* falls through */
            case EXLEN:
              if (state.flags & 1024) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length = hold;
                if (state.head) {
                  state.head.extra_len = hold;
                }
                if (state.flags & 512) {
                  hbuf[0] = hold & 255;
                  hbuf[1] = hold >>> 8 & 255;
                  state.check = crc32(state.check, hbuf, 2, 0);
                }
                hold = 0;
                bits = 0;
              } else if (state.head) {
                state.head.extra = null;
              }
              state.mode = EXTRA;
            /* falls through */
            case EXTRA:
              if (state.flags & 1024) {
                copy = state.length;
                if (copy > have) {
                  copy = have;
                }
                if (copy) {
                  if (state.head) {
                    len = state.head.extra_len - state.length;
                    if (!state.head.extra) {
                      state.head.extra = new Array(state.head.extra_len);
                    }
                    utils.arraySet(
                      state.head.extra,
                      input,
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      copy,
                      /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                      len
                    );
                  }
                  if (state.flags & 512) {
                    state.check = crc32(state.check, input, copy, next);
                  }
                  have -= copy;
                  next += copy;
                  state.length -= copy;
                }
                if (state.length) {
                  break inf_leave;
                }
              }
              state.length = 0;
              state.mode = NAME;
            /* falls through */
            case NAME:
              if (state.flags & 2048) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.name += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.name = null;
              }
              state.length = 0;
              state.mode = COMMENT;
            /* falls through */
            case COMMENT:
              if (state.flags & 4096) {
                if (have === 0) {
                  break inf_leave;
                }
                copy = 0;
                do {
                  len = input[next + copy++];
                  if (state.head && len && state.length < 65536) {
                    state.head.comment += String.fromCharCode(len);
                  }
                } while (len && copy < have);
                if (state.flags & 512) {
                  state.check = crc32(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                if (len) {
                  break inf_leave;
                }
              } else if (state.head) {
                state.head.comment = null;
              }
              state.mode = HCRC;
            /* falls through */
            case HCRC:
              if (state.flags & 512) {
                while (bits < 16) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.check & 65535)) {
                  strm.msg = "header crc mismatch";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              if (state.head) {
                state.head.hcrc = state.flags >> 9 & 1;
                state.head.done = true;
              }
              strm.adler = state.check = 0;
              state.mode = TYPE;
              break;
            case DICTID:
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              strm.adler = state.check = zswap32(hold);
              hold = 0;
              bits = 0;
              state.mode = DICT;
            /* falls through */
            case DICT:
              if (state.havedict === 0) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                return Z_NEED_DICT;
              }
              strm.adler = state.check = 1;
              state.mode = TYPE;
            /* falls through */
            case TYPE:
              if (flush === Z_BLOCK || flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case TYPEDO:
              if (state.last) {
                hold >>>= bits & 7;
                bits -= bits & 7;
                state.mode = CHECK;
                break;
              }
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.last = hold & 1;
              hold >>>= 1;
              bits -= 1;
              switch (hold & 3) {
                case 0:
                  state.mode = STORED;
                  break;
                case 1:
                  fixedtables(state);
                  state.mode = LEN_;
                  if (flush === Z_TREES) {
                    hold >>>= 2;
                    bits -= 2;
                    break inf_leave;
                  }
                  break;
                case 2:
                  state.mode = TABLE;
                  break;
                case 3:
                  strm.msg = "invalid block type";
                  state.mode = BAD;
              }
              hold >>>= 2;
              bits -= 2;
              break;
            case STORED:
              hold >>>= bits & 7;
              bits -= bits & 7;
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
                strm.msg = "invalid stored block lengths";
                state.mode = BAD;
                break;
              }
              state.length = hold & 65535;
              hold = 0;
              bits = 0;
              state.mode = COPY_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case COPY_:
              state.mode = COPY;
            /* falls through */
            case COPY:
              copy = state.length;
              if (copy) {
                if (copy > have) {
                  copy = have;
                }
                if (copy > left) {
                  copy = left;
                }
                if (copy === 0) {
                  break inf_leave;
                }
                utils.arraySet(output, input, next, copy, put);
                have -= copy;
                next += copy;
                left -= copy;
                put += copy;
                state.length -= copy;
                break;
              }
              state.mode = TYPE;
              break;
            case TABLE:
              while (bits < 14) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.nlen = (hold & 31) + 257;
              hold >>>= 5;
              bits -= 5;
              state.ndist = (hold & 31) + 1;
              hold >>>= 5;
              bits -= 5;
              state.ncode = (hold & 15) + 4;
              hold >>>= 4;
              bits -= 4;
              if (state.nlen > 286 || state.ndist > 30) {
                strm.msg = "too many length or distance symbols";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = LENLENS;
            /* falls through */
            case LENLENS:
              while (state.have < state.ncode) {
                while (bits < 3) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.lens[order[state.have++]] = hold & 7;
                hold >>>= 3;
                bits -= 3;
              }
              while (state.have < 19) {
                state.lens[order[state.have++]] = 0;
              }
              state.lencode = state.lendyn;
              state.lenbits = 7;
              opts = { bits: state.lenbits };
              ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid code lengths set";
                state.mode = BAD;
                break;
              }
              state.have = 0;
              state.mode = CODELENS;
            /* falls through */
            case CODELENS:
              while (state.have < state.nlen + state.ndist) {
                for (; ; ) {
                  here = state.lencode[hold & (1 << state.lenbits) - 1];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (here_val < 16) {
                  hold >>>= here_bits;
                  bits -= here_bits;
                  state.lens[state.have++] = here_val;
                } else {
                  if (here_val === 16) {
                    n = here_bits + 2;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    if (state.have === 0) {
                      strm.msg = "invalid bit length repeat";
                      state.mode = BAD;
                      break;
                    }
                    len = state.lens[state.have - 1];
                    copy = 3 + (hold & 3);
                    hold >>>= 2;
                    bits -= 2;
                  } else if (here_val === 17) {
                    n = here_bits + 3;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 3 + (hold & 7);
                    hold >>>= 3;
                    bits -= 3;
                  } else {
                    n = here_bits + 7;
                    while (bits < n) {
                      if (have === 0) {
                        break inf_leave;
                      }
                      have--;
                      hold += input[next++] << bits;
                      bits += 8;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    len = 0;
                    copy = 11 + (hold & 127);
                    hold >>>= 7;
                    bits -= 7;
                  }
                  if (state.have + copy > state.nlen + state.ndist) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  while (copy--) {
                    state.lens[state.have++] = len;
                  }
                }
              }
              if (state.mode === BAD) {
                break;
              }
              if (state.lens[256] === 0) {
                strm.msg = "invalid code -- missing end-of-block";
                state.mode = BAD;
                break;
              }
              state.lenbits = 9;
              opts = { bits: state.lenbits };
              ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
              state.lenbits = opts.bits;
              if (ret) {
                strm.msg = "invalid literal/lengths set";
                state.mode = BAD;
                break;
              }
              state.distbits = 6;
              state.distcode = state.distdyn;
              opts = { bits: state.distbits };
              ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
              state.distbits = opts.bits;
              if (ret) {
                strm.msg = "invalid distances set";
                state.mode = BAD;
                break;
              }
              state.mode = LEN_;
              if (flush === Z_TREES) {
                break inf_leave;
              }
            /* falls through */
            case LEN_:
              state.mode = LEN;
            /* falls through */
            case LEN:
              if (have >= 6 && left >= 258) {
                strm.next_out = put;
                strm.avail_out = left;
                strm.next_in = next;
                strm.avail_in = have;
                state.hold = hold;
                state.bits = bits;
                inflate_fast(strm, _out);
                put = strm.next_out;
                output = strm.output;
                left = strm.avail_out;
                next = strm.next_in;
                input = strm.input;
                have = strm.avail_in;
                hold = state.hold;
                bits = state.bits;
                if (state.mode === TYPE) {
                  state.back = -1;
                }
                break;
              }
              state.back = 0;
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_op && (here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              state.length = here_val;
              if (here_op === 0) {
                state.mode = LIT;
                break;
              }
              if (here_op & 32) {
                state.back = -1;
                state.mode = TYPE;
                break;
              }
              if (here_op & 64) {
                strm.msg = "invalid literal/length code";
                state.mode = BAD;
                break;
              }
              state.extra = here_op & 15;
              state.mode = LENEXT;
            /* falls through */
            case LENEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.length += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              state.was = state.length;
              state.mode = DIST;
            /* falls through */
            case DIST:
              for (; ; ) {
                here = state.distcode[hold & (1 << state.distbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if ((here_op & 240) === 0) {
                last_bits = here_bits;
                last_op = here_op;
                last_val = here_val;
                for (; ; ) {
                  here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                  here_bits = here >>> 24;
                  here_op = here >>> 16 & 255;
                  here_val = here & 65535;
                  if (last_bits + here_bits <= bits) {
                    break;
                  }
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= last_bits;
                bits -= last_bits;
                state.back += last_bits;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              state.back += here_bits;
              if (here_op & 64) {
                strm.msg = "invalid distance code";
                state.mode = BAD;
                break;
              }
              state.offset = here_val;
              state.extra = here_op & 15;
              state.mode = DISTEXT;
            /* falls through */
            case DISTEXT:
              if (state.extra) {
                n = state.extra;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                state.offset += hold & (1 << state.extra) - 1;
                hold >>>= state.extra;
                bits -= state.extra;
                state.back += state.extra;
              }
              if (state.offset > state.dmax) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
              state.mode = MATCH;
            /* falls through */
            case MATCH:
              if (left === 0) {
                break inf_leave;
              }
              copy = _out - left;
              if (state.offset > copy) {
                copy = state.offset - copy;
                if (copy > state.whave) {
                  if (state.sane) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break;
                  }
                }
                if (copy > state.wnext) {
                  copy -= state.wnext;
                  from = state.wsize - copy;
                } else {
                  from = state.wnext - copy;
                }
                if (copy > state.length) {
                  copy = state.length;
                }
                from_source = state.window;
              } else {
                from_source = output;
                from = put - state.offset;
                copy = state.length;
              }
              if (copy > left) {
                copy = left;
              }
              left -= copy;
              state.length -= copy;
              do {
                output[put++] = from_source[from++];
              } while (--copy);
              if (state.length === 0) {
                state.mode = LEN;
              }
              break;
            case LIT:
              if (left === 0) {
                break inf_leave;
              }
              output[put++] = state.length;
              left--;
              state.mode = LEN;
              break;
            case CHECK:
              if (state.wrap) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold |= input[next++] << bits;
                  bits += 8;
                }
                _out -= left;
                strm.total_out += _out;
                state.total += _out;
                if (_out) {
                  strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
                  state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
                }
                _out = left;
                if ((state.flags ? hold : zswap32(hold)) !== state.check) {
                  strm.msg = "incorrect data check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = LENGTH;
            /* falls through */
            case LENGTH:
              if (state.wrap && state.flags) {
                while (bits < 32) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                if (hold !== (state.total & 4294967295)) {
                  strm.msg = "incorrect length check";
                  state.mode = BAD;
                  break;
                }
                hold = 0;
                bits = 0;
              }
              state.mode = DONE;
            /* falls through */
            case DONE:
              ret = Z_STREAM_END;
              break inf_leave;
            case BAD:
              ret = Z_DATA_ERROR;
              break inf_leave;
            case MEM:
              return Z_MEM_ERROR;
            case SYNC:
            /* falls through */
            default:
              return Z_STREAM_ERROR;
          }
        }
      strm.next_out = put;
      strm.avail_out = left;
      strm.next_in = next;
      strm.avail_in = have;
      state.hold = hold;
      state.bits = bits;
      if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
        if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
      }
      _in -= strm.avail_in;
      _out -= strm.avail_out;
      strm.total_in += _in;
      strm.total_out += _out;
      state.total += _out;
      if (state.wrap && _out) {
        strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
        state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
      }
      strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
      if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
        ret = Z_BUF_ERROR;
      }
      return ret;
    }
    function inflateEnd(strm) {
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      var state = strm.state;
      if (state.window) {
        state.window = null;
      }
      strm.state = null;
      return Z_OK;
    }
    function inflateGetHeader(strm, head) {
      var state;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if ((state.wrap & 2) === 0) {
        return Z_STREAM_ERROR;
      }
      state.head = head;
      head.done = false;
      return Z_OK;
    }
    function inflateSetDictionary(strm, dictionary) {
      var dictLength = dictionary.length;
      var state;
      var dictid;
      var ret;
      if (!strm || !strm.state) {
        return Z_STREAM_ERROR;
      }
      state = strm.state;
      if (state.wrap !== 0 && state.mode !== DICT) {
        return Z_STREAM_ERROR;
      }
      if (state.mode === DICT) {
        dictid = 1;
        dictid = adler32(dictid, dictionary, dictLength, 0);
        if (dictid !== state.check) {
          return Z_DATA_ERROR;
        }
      }
      ret = updatewindow(strm, dictionary, dictLength, dictLength);
      if (ret) {
        state.mode = MEM;
        return Z_MEM_ERROR;
      }
      state.havedict = 1;
      return Z_OK;
    }
    inflate.inflateReset = inflateReset;
    inflate.inflateReset2 = inflateReset2;
    inflate.inflateResetKeep = inflateResetKeep;
    inflate.inflateInit = inflateInit;
    inflate.inflateInit2 = inflateInit2;
    inflate.inflate = inflate$12;
    inflate.inflateEnd = inflateEnd;
    inflate.inflateGetHeader = inflateGetHeader;
    inflate.inflateSetDictionary = inflateSetDictionary;
    inflate.inflateInfo = "pako inflate (from Nodeca project)";
    return inflate;
  }
  var constants;
  var hasRequiredConstants;
  function requireConstants() {
    if (hasRequiredConstants) return constants;
    hasRequiredConstants = 1;
    constants = {
      /* Allowed flush values; see deflate() and inflate() below for details */
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      /* Return codes for the compression/decompression functions. Negative values
      * are errors, positive values are used for special but normal events.
      */
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      //Z_MEM_ERROR:     -4,
      Z_BUF_ERROR: -5,
      //Z_VERSION_ERROR: -6,
      /* compression levels */
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      /* Possible values of the data_type field (though see inflate()) */
      Z_BINARY: 0,
      Z_TEXT: 1,
      //Z_ASCII:                1, // = Z_TEXT (deprecated)
      Z_UNKNOWN: 2,
      /* The deflate compression method */
      Z_DEFLATED: 8
      //Z_NULL:                 null // Use -1 or null inline, depending on var type
    };
    return constants;
  }
  var gzheader;
  var hasRequiredGzheader;
  function requireGzheader() {
    if (hasRequiredGzheader) return gzheader;
    hasRequiredGzheader = 1;
    function GZheader() {
      this.text = 0;
      this.time = 0;
      this.xflags = 0;
      this.os = 0;
      this.extra = null;
      this.extra_len = 0;
      this.name = "";
      this.comment = "";
      this.hcrc = 0;
      this.done = false;
    }
    gzheader = GZheader;
    return gzheader;
  }
  var hasRequiredInflate;
  function requireInflate() {
    if (hasRequiredInflate) return inflate$1;
    hasRequiredInflate = 1;
    var zlib_inflate = requireInflate$1();
    var utils = requireCommon();
    var strings2 = requireStrings();
    var c = requireConstants();
    var msg = requireMessages();
    var ZStream = requireZstream();
    var GZheader = requireGzheader();
    var toString = Object.prototype.toString;
    function Inflate(options) {
      if (!(this instanceof Inflate)) return new Inflate(options);
      this.options = utils.assign({
        chunkSize: 16384,
        windowBits: 0,
        to: ""
      }, options || {});
      var opt = this.options;
      if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
        opt.windowBits = -opt.windowBits;
        if (opt.windowBits === 0) {
          opt.windowBits = -15;
        }
      }
      if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
        opt.windowBits += 32;
      }
      if (opt.windowBits > 15 && opt.windowBits < 48) {
        if ((opt.windowBits & 15) === 0) {
          opt.windowBits |= 15;
        }
      }
      this.err = 0;
      this.msg = "";
      this.ended = false;
      this.chunks = [];
      this.strm = new ZStream();
      this.strm.avail_out = 0;
      var status = zlib_inflate.inflateInit2(
        this.strm,
        opt.windowBits
      );
      if (status !== c.Z_OK) {
        throw new Error(msg[status]);
      }
      this.header = new GZheader();
      zlib_inflate.inflateGetHeader(this.strm, this.header);
      if (opt.dictionary) {
        if (typeof opt.dictionary === "string") {
          opt.dictionary = strings2.string2buf(opt.dictionary);
        } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
          opt.dictionary = new Uint8Array(opt.dictionary);
        }
        if (opt.raw) {
          status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
          if (status !== c.Z_OK) {
            throw new Error(msg[status]);
          }
        }
      }
    }
    Inflate.prototype.push = function(data, mode) {
      var strm = this.strm;
      var chunkSize = this.options.chunkSize;
      var dictionary = this.options.dictionary;
      var status, _mode;
      var next_out_utf8, tail, utf8str;
      var allowBufError = false;
      if (this.ended) {
        return false;
      }
      _mode = mode === ~~mode ? mode : mode === true ? c.Z_FINISH : c.Z_NO_FLUSH;
      if (typeof data === "string") {
        strm.input = strings2.binstring2buf(data);
      } else if (toString.call(data) === "[object ArrayBuffer]") {
        strm.input = new Uint8Array(data);
      } else {
        strm.input = data;
      }
      strm.next_in = 0;
      strm.avail_in = strm.input.length;
      do {
        if (strm.avail_out === 0) {
          strm.output = new utils.Buf8(chunkSize);
          strm.next_out = 0;
          strm.avail_out = chunkSize;
        }
        status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);
        if (status === c.Z_NEED_DICT && dictionary) {
          status = zlib_inflate.inflateSetDictionary(this.strm, dictionary);
        }
        if (status === c.Z_BUF_ERROR && allowBufError === true) {
          status = c.Z_OK;
          allowBufError = false;
        }
        if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
          this.onEnd(status);
          this.ended = true;
          return false;
        }
        if (strm.next_out) {
          if (strm.avail_out === 0 || status === c.Z_STREAM_END || strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH)) {
            if (this.options.to === "string") {
              next_out_utf8 = strings2.utf8border(strm.output, strm.next_out);
              tail = strm.next_out - next_out_utf8;
              utf8str = strings2.buf2string(strm.output, next_out_utf8);
              strm.next_out = tail;
              strm.avail_out = chunkSize - tail;
              if (tail) {
                utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
              }
              this.onData(utf8str);
            } else {
              this.onData(utils.shrinkBuf(strm.output, strm.next_out));
            }
          }
        }
        if (strm.avail_in === 0 && strm.avail_out === 0) {
          allowBufError = true;
        }
      } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
      if (status === c.Z_STREAM_END) {
        _mode = c.Z_FINISH;
      }
      if (_mode === c.Z_FINISH) {
        status = zlib_inflate.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === c.Z_OK;
      }
      if (_mode === c.Z_SYNC_FLUSH) {
        this.onEnd(c.Z_OK);
        strm.avail_out = 0;
        return true;
      }
      return true;
    };
    Inflate.prototype.onData = function(chunk) {
      this.chunks.push(chunk);
    };
    Inflate.prototype.onEnd = function(status) {
      if (status === c.Z_OK) {
        if (this.options.to === "string") {
          this.result = this.chunks.join("");
        } else {
          this.result = utils.flattenChunks(this.chunks);
        }
      }
      this.chunks = [];
      this.err = status;
      this.msg = this.strm.msg;
    };
    function inflate2(input, options) {
      var inflator = new Inflate(options);
      inflator.push(input, true);
      if (inflator.err) {
        throw inflator.msg || msg[inflator.err];
      }
      return inflator.result;
    }
    function inflateRaw(input, options) {
      options = options || {};
      options.raw = true;
      return inflate2(input, options);
    }
    inflate$1.Inflate = Inflate;
    inflate$1.inflate = inflate2;
    inflate$1.inflateRaw = inflateRaw;
    inflate$1.ungzip = inflate2;
    return inflate$1;
  }
  var pako_1;
  var hasRequiredPako;
  function requirePako() {
    if (hasRequiredPako) return pako_1;
    hasRequiredPako = 1;
    var assign = requireCommon().assign;
    var deflate2 = requireDeflate();
    var inflate2 = requireInflate();
    var constants2 = requireConstants();
    var pako = {};
    assign(pako, deflate2, inflate2, constants2);
    pako_1 = pako;
    return pako_1;
  }
  var pakoExports = requirePako();
  function getGuildFoldersFromProto(proto) {
    const userSettings = PreloadedUserSettings.fromBase64(proto);
    return userSettings.guildFolders?.folders || [];
  }
  function createInflateInstance(onPush) {
    let inflate2 = new pakoExports.Inflate({ chunkSize: 65536, to: "string" });
    inflate2.onEnd = (e) => {
      if (e !== pakoExports.Z_OK) throw new Error(`zlib error, ${e}, ${inflate2.strm.msg}`);
      const chunks = inflate2.chunks;
      const result = chunks.join("");
      result && onPush(JSON.parse(result));
      chunks.length = 0;
    };
    return proxy((data) => {
      if (data === null || !inflate2) {
        if (inflate2) {
          inflate2.chunks = [];
          inflate2.onEnd = () => {
          };
          inflate2 = null;
        }
        return;
      }
      const view = new DataView(data), shouldFlush = view.byteLength >= 4 && 65535 === view.getUint32(view.byteLength - 4, false);
      inflate2.push(data, shouldFlush && pakoExports.Z_SYNC_FLUSH);
    });
  }
  const exposed = {
    getGuildFoldersFromProto,
    createInflateInstance
  };
  expose(exposed);
})();
//# sourceMappingURL=worker-BsqaKNPO.js.map
