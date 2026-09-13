import { N as NativeBigInteger, C as CaptchaEvent, D as DiscordClient, a as DiscordClientReady, b as DiscordDMChannel, c as DiscordDirectMessage, d as DiscordGroupDMChannel, e as DiscordGuild, f as DiscordGuildChannelCategory, g as DiscordGuildSetting, h as DiscordGuildSettingsJar, i as DiscordGuildTextChannel, j as DiscordMessage, k as DiscordMessageReactionsJar, l as DiscordPresence, m as DiscordRelationship, n as DiscordServerProfile, o as DiscordSetup, p as DiscordSnowflake, q as DiscordUser, I as InvalidTokenError, M as MFA, r as MessageReaction, s as MessagesJar, P as PermissionFlagsBits, U as UsersJar, W as WritableStore, t as convertSnowflakeToDate, u as deepEqual, v as generateNonce, w as setup, x as shallowEqual, L as Logger, y as toast, z as utils, A as solid, B as signals, E as sleep } from "./index-DkPzNcWn.js";
const discord = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BigInteger: NativeBigInteger,
  CaptchaEvent,
  DiscordClient,
  DiscordClientReady,
  DiscordDMChannel,
  DiscordDirectMessage,
  DiscordGroupDMChannel,
  DiscordGuild,
  DiscordGuildChannelCategory,
  DiscordGuildSetting,
  DiscordGuildSettingsJar,
  DiscordGuildTextChannel,
  DiscordMessage,
  DiscordMessageReactionsJar,
  DiscordPresence,
  DiscordRelationship,
  DiscordServerProfile,
  DiscordSetup,
  DiscordSnowflake,
  DiscordUser,
  InvalidTokenError,
  MFA,
  MessageReaction,
  MessagesJar,
  PermissionFlagsBits,
  UsersJar,
  WritableStore,
  convertSnowflakeToDate,
  deepEqual,
  generateNonce,
  setup,
  shallowEqual
}, Symbol.toStringTag, { value: "Module" }));
Logger.prototype._log = function(type, ...args) {
  const binded = Function.prototype.bind.call(
    console[type],
    console,
    `%c[${this.name}]%c`,
    `color: ${this.color}; font-weight: 700;`,
    "",
    ...args
  );
  return binded;
};
const KeyboardEvent_key_property = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, "key");
Object.defineProperty(KeyboardEvent.prototype, "key", {
  enumerable: true,
  configurable: true,
  get() {
    const evt_key = KeyboardEvent_key_property.get.call(this);
    if ((this.ctrlKey || this.altKey) && evt_key.startsWith("Arrow") && (evt_key.endsWith("Left") || evt_key.endsWith("Right"))) {
      return "Soft" + evt_key.slice(5);
    }
    if (this.shiftKey && evt_key.startsWith("Arrow") && (evt_key.endsWith("Left") || evt_key.endsWith("Right"))) {
      return evt_key.endsWith("Left") ? "*" : "#";
    }
    return evt_key;
  }
});
Object.assign(window, {
  signals,
  solid,
  utils,
  toast,
  discord
});
const ReactNativeWebView = "ReactNativeWebView" in window && window.ReactNativeWebView;
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function dispatchKeyboardEvent(key, keyCode) {
  const init = {
    key,
    keyCode,
    composed: true,
    bubbles: true,
    cancelable: true
  };
  document.activeElement?.dispatchEvent(new KeyboardEvent("keydown", init));
  sleep(200).then(() => {
    document.activeElement?.dispatchEvent(new KeyboardEvent("keyup", init));
  });
}
if (ReactNativeWebView) {
  const __KORI__ = {
    handleMessage: (message) => {
      const data = JSON.parse(message);
      if (data.action === "move") {
        const key = "Arrow" + capitalizeFirstLetter(data.direction);
        var KEYMAPPING = {
          left: 37,
          up: 38,
          right: 39,
          down: 40
        };
        dispatchKeyboardEvent(key, KEYMAPPING[data.direction]);
      } else if (data.action === "key") {
        dispatchKeyboardEvent(data.key, data.key === "Enter" ? 13 : void 0);
      }
    }
  };
  Object.assign(window, { __KORI__ });
  ReactNativeWebView.postMessage(JSON.stringify({ connected: true }));
}
//# sourceMappingURL=dev-DEIYIx38.js.map
