import { X as createSignal, Y as onMount, am as pauseKeypress, an as __CJS__export_default__, _ as onCleanup, ao as resumeKeypress, a4 as className, a6 as insert, F as createComponent, aq as For, a9 as mergeProps, Q as Show, R as template, b7 as useStoredSignal, az as centerScroll, E as sleep, ap as addEventListener, $ as untrack, a5 as use, K as createRenderEffect, O as setAttribute, a1 as discordClientReady, H as memo, bj as emojiVariation, ai as batch, ar as delegateEvents } from "./index-DkPzNcWn.js";
import { d as debounce, f as fuzzySearch, m as memoize } from "./MainView-_3_OZCIe.js";
const picker = `_picker_e3abe0f`;
const main = `_main_6ac1a98`;
const search = `_search_ddceb22`;
const emoji = `_emoji_80b3e83`;
const content = `_content_885a2dd`;
const category = `_category_ab3b3a1`;
const icon = `_icon_20478a4`;
const focused = `_focused_0dc40b6`;
const desc = `_desc_bf746ff`;
const text = `_text_dfce54e`;
var _tmpl$ = /* @__PURE__ */ template(`<div><input type=search placeholder="Search emojis">`), _tmpl$2 = /* @__PURE__ */ template(`<div tabindex=-1><img width=25 height=25>`), _tmpl$3 = /* @__PURE__ */ template(`<div><div><svg xmlns=http://www.w3.org/2000/svg width=16 height=16 fill=none viewBox="0 0 24 24"><path fill=currentColor fill-rule=evenodd d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm1-18a1 1 0 1 0-2 0v7c0 .27.1.52.3.7l3 3a1 1 0 0 0 1.4-1.4L13 11.58V5Z"clip-rule=evenodd class></path></svg></div>frequently used`), _tmpl$4 = /* @__PURE__ */ template(`<div>`), _tmpl$5 = /* @__PURE__ */ template(`<div><div><svg xmlns=http://www.w3.org/2000/svg width=16 height=16 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M10.81 2.86c.38-1.15 2-1.15 2.38 0l1.89 5.83h6.12c1.2 0 1.71 1.54.73 2.25l-4.95 3.6 1.9 5.82a1.25 1.25 0 0 1-1.93 1.4L12 18.16l-4.95 3.6c-.98.7-2.3-.25-1.92-1.4l1.89-5.82-4.95-3.6a1.25 1.25 0 0 1 .73-2.25h6.12l1.9-5.83Z"class></path></svg></div>favorites`), _tmpl$6 = /* @__PURE__ */ template(`<svg xmlns=http://www.w3.org/2000/svg width=12 height=12 fill=none viewBox="0 0 24 24"><path fill=currentColor d="M10.81 2.86c.38-1.15 2-1.15 2.38 0l1.89 5.83h6.12c1.2 0 1.71 1.54.73 2.25l-4.95 3.6 1.9 5.82a1.25 1.25 0 0 1-1.93 1.4L12 18.16l-4.95 3.6c-.98.7-2.3-.25-1.92-1.4l1.89-5.82-4.95-3.6a1.25 1.25 0 0 1 .73-2.25h6.12l1.9-5.83Z"class>`), _tmpl$7 = /* @__PURE__ */ template(`<span>:<!>:`), _tmpl$8 = /* @__PURE__ */ template(`<div><div>`), _tmpl$9 = /* @__PURE__ */ template(`<img width=25 height=25>`), _tmpl$0 = /* @__PURE__ */ template(`<img width=25 height=25 style=border-radius:2px>`), _tmpl$1 = /* @__PURE__ */ template(`<div tabindex=-1><img width=25 height=25 style=object-fit:contain>`), _tmpl$10 = /* @__PURE__ */ template(`<img height=16 width=16 style=border-radius:4px>`);
var SkinVariation = /* @__PURE__ */ ((SkinVariation2) => {
  SkinVariation2["Light"] = "1F3FB";
  SkinVariation2["MediumLight"] = "1F3FC";
  SkinVariation2["Medium"] = "1F3FD";
  SkinVariation2["MediumDark"] = "1F3FE";
  SkinVariation2["Dark"] = "1F3FF";
  return SkinVariation2;
})(SkinVariation || {});
const SUPPORTED_VARIATIONS = [
  "1F3FB",
  "1F3FC",
  "1F3FD",
  "1F3FE",
  "1F3FF"
  /* Dark */
];
function fromCodePoint(codepoint) {
  var code = typeof codepoint === "string" ? parseInt(codepoint, 16) : codepoint;
  if (code < 65536) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
}
const toCodePoint = memoize(function toCodePoint2(unicodeSurrogates, sep) {
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
  return r.join(sep || "-");
});
function Search(props) {
  let inputRef;
  let mounted = true;
  const debouncedSearch = debounce(async (search2) => {
    console.log("SEARCHING EMOJIS!!!");
    const results = await fuzzySearch(search2);
    if (!mounted) return;
    if (inputRef?.value) {
      props.setResult(results);
    } else {
      props.setResult([]);
    }
  }, 500);
  onCleanup(() => {
    mounted = false;
  });
  return (() => {
    var _el$ = _tmpl$(), _el$2 = _el$.firstChild;
    className(_el$, search);
    _el$2.$$keydown = (e) => {
      if (e.key == "Backspace" && !e.target.value) {
        props.onClose();
      }
      if (e.key.includes("Arrow") && (e.key.includes("Right") || e.key.includes("Left"))) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };
    _el$2.addEventListener("focus", () => {
      setFocusedEmoji(null);
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
const [focusedEmoji, setFocusedEmoji] = createSignal(null);
const JDECKED = "https://jdecked.github.io/twemoji/v/latest/svg/";
function EmojiItem(props) {
  const [, setFrequentEmojis] = useStoredSignal([], "frequentEmojis");
  const [, setFavoriteEmojis] = useStoredSignal([], "favoriteEmojis");
  let divRef;
  onCleanup(() => {
    if (divRef == document.activeElement) {
      __CJS__export_default__.move("right") || __CJS__export_default__.move("up") || __CJS__export_default__.move("left") || __CJS__export_default__.move("down");
    }
  });
  const emojiWithVariation = () => {
    const emoji2 = props.emoji;
    const variation = emojiVariation();
    const withVariation = variation ? emoji2.variation?.[variation] : void 0;
    return withVariation || emoji2.$;
  };
  return (() => {
    var _el$3 = _tmpl$2(), _el$4 = _el$3.firstChild;
    _el$3.addEventListener("focus", (e) => {
      centerScroll(e.target);
      setFocusedEmoji(props.emoji);
    });
    _el$3.$$keydown = (e) => {
      if (e.key == "Backspace") {
        props.onClose();
      } else if (e.key == "*") {
        sleep(100).then(() => setFavoriteEmojis((emojis) => {
          const found = emojis.find((e2) => e2.$ == props.emoji.$);
          if (found) {
            return emojis.filter((e2) => e2.$ != props.emoji.$);
          }
          return [props.emoji].concat(emojis);
        }));
      }
    };
    addEventListener(_el$3, "sn-navigatefailed", (e) => {
      const actEl = e.currentTarget;
      const direction = e.detail.direction;
      if (direction == "left") {
        const prev = actEl.previousElementSibling;
        prev?.focus();
      } else if (direction == "right") {
        const next = actEl.nextElementSibling;
        next?.focus();
      }
    });
    addEventListener(_el$3, "sn-enter-down", () => {
      setFrequentEmojis((emojis) => {
        const found = emojis.find((e) => e.emoji.$ == props.emoji.$);
        if (found) {
          found.count++;
          return emojis.toSorted((a, b) => b.count - a.count);
        }
        return emojis.concat({
          count: 1,
          emoji: props.emoji
        }).toSorted((a, b) => b.count - a.count);
      });
      props.onSelect(props.emoji, untrack(emojiWithVariation) || props.emoji.$);
    });
    var _ref$2 = divRef;
    typeof _ref$2 === "function" ? use(_ref$2, _el$3) : divRef = _el$3;
    className(_el$3, emoji);
    createRenderEffect((_p$) => {
      var _v$ = JDECKED + toCodePoint(emojiWithVariation()) + ".svg", _v$2 = props.emoji.$;
      _v$ !== _p$.e && setAttribute(_el$4, "src", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$4, "alt", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$3;
  })();
}
function FrequentEmojis(props) {
  const [frequentEmojis] = useStoredSignal([], "frequentEmojis");
  const frequent = () => frequentEmojis().slice(0, 45);
  return createComponent(Show, {
    get when() {
      return frequent().length;
    },
    get children() {
      return [(() => {
        var _el$5 = _tmpl$3(), _el$6 = _el$5.firstChild;
        className(_el$5, category);
        className(_el$6, icon);
        return _el$5;
      })(), (() => {
        var _el$7 = _tmpl$4();
        className(_el$7, content);
        insert(_el$7, createComponent(For, {
          get each() {
            return frequent();
          },
          children: (frequent2) => createComponent(EmojiItem, mergeProps({
            get emoji() {
              return frequent2.emoji;
            }
          }, props))
        }));
        return _el$7;
      })()];
    }
  });
}
function FavoriteEmojis(props) {
  const [favoriteEmojis] = useStoredSignal([], "favoriteEmojis");
  return createComponent(Show, {
    get when() {
      return favoriteEmojis().length;
    },
    get children() {
      return [(() => {
        var _el$8 = _tmpl$5(), _el$9 = _el$8.firstChild;
        className(_el$8, category);
        className(_el$9, icon);
        return _el$8;
      })(), (() => {
        var _el$0 = _tmpl$4();
        className(_el$0, content);
        insert(_el$0, createComponent(For, {
          get each() {
            return favoriteEmojis();
          },
          children: (emoji2) => createComponent(EmojiItem, mergeProps({
            emoji: emoji2
          }, props))
        }));
        return _el$0;
      })()];
    }
  });
}
function FocusedEmojiDescription() {
  const [favoriteEmojis] = useStoredSignal([], "favoriteEmojis");
  const emojiWithVariation = () => {
    const emoji2 = focusedEmoji();
    const variation = emojiVariation();
    const withVariation = variation ? emoji2.variation?.[variation] : void 0;
    return withVariation || emoji2.$;
  };
  return createComponent(Show, {
    get when() {
      return focusedEmoji();
    },
    get children() {
      var _el$1 = _tmpl$8(), _el$11 = _el$1.firstChild;
      className(_el$1, focused);
      insert(_el$1, createComponent(Show, {
        get when() {
          return memo(() => "guild" in focusedEmoji())() && focusedEmoji();
        },
        get fallback() {
          return (() => {
            var _el$16 = _tmpl$9();
            createRenderEffect((_p$) => {
              var _v$3 = JDECKED + toCodePoint(emojiWithVariation()) + ".svg", _v$4 = focusedEmoji().$;
              _v$3 !== _p$.e && setAttribute(_el$16, "src", _p$.e = _v$3);
              _v$4 !== _p$.t && setAttribute(_el$16, "alt", _p$.t = _v$4);
              return _p$;
            }, {
              e: void 0,
              t: void 0
            });
            return _el$16;
          })();
        },
        children: (emoji2) => (() => {
          var _el$17 = _tmpl$0();
          createRenderEffect((_p$) => {
            var _v$5 = `https://cdn.discordapp.com/emojis/${emoji2().$}.${emoji2().animated ? "gif" : "png"}?size=32`, _v$6 = emoji2().name;
            _v$5 !== _p$.e && setAttribute(_el$17, "src", _p$.e = _v$5);
            _v$6 !== _p$.t && setAttribute(_el$17, "alt", _p$.t = _v$6);
            return _p$;
          }, {
            e: void 0,
            t: void 0
          });
          return _el$17;
        })()
      }), _el$11);
      insert(_el$1, createComponent(Show, {
        get when() {
          return favoriteEmojis().find((a) => a.$ == focusedEmoji()?.$);
        },
        get children() {
          return _tmpl$6();
        }
      }), _el$11);
      className(_el$11, desc);
      insert(_el$11, createComponent(Show, {
        get when() {
          return "guild" in focusedEmoji();
        },
        get fallback() {
          return createComponent(For, {
            get each() {
              return Array.from(focusedEmoji().short_names || []);
            },
            children: (shortname) => (() => {
              var _el$18 = _tmpl$7(), _el$19 = _el$18.firstChild, _el$21 = _el$19.nextSibling;
              _el$21.nextSibling;
              className(_el$18, text);
              insert(_el$18, shortname, _el$21);
              return _el$18;
            })()
          });
        },
        get children() {
          var _el$12 = _tmpl$7(), _el$13 = _el$12.firstChild, _el$15 = _el$13.nextSibling;
          _el$15.nextSibling;
          className(_el$12, text);
          insert(_el$12, () => focusedEmoji().name, _el$15);
          return _el$12;
        }
      }));
      return _el$1;
    }
  });
}
const SN_ID = "emoji-picker";
function ServerEmojiItem(props) {
  const emoji$1 = {
    $: props.emoji.id,
    name: props.emoji.name,
    animated: props.emoji.animated || false,
    guild: props.guild.id
  };
  const [focused2, setFocused] = createSignal(false);
  return (() => {
    var _el$22 = _tmpl$1(), _el$23 = _el$22.firstChild;
    _el$22.addEventListener("blur", () => {
      setFocused(false);
    });
    _el$22.addEventListener("focus", (e) => {
      centerScroll(e.currentTarget);
      batch(() => {
        setFocusedEmoji(emoji$1);
        setFocused(true);
      });
    });
    _el$22.$$keydown = (e) => {
      if (e.key == "Backspace") {
        props.onClose();
      }
    };
    addEventListener(_el$22, "sn-navigatefailed", (e) => {
      const actEl = e.currentTarget;
      const direction = e.detail.direction;
      if (direction == "left") {
        const prev = actEl.previousElementSibling;
        prev?.focus();
      } else if (direction == "right") {
        const next = actEl.nextElementSibling;
        next?.focus();
      }
    });
    addEventListener(_el$22, "sn-enter-down", () => {
      props.onSelect(emoji$1);
    });
    className(_el$22, emoji);
    createRenderEffect(() => setAttribute(_el$23, "src", `https://cdn.discordapp.com/emojis/${props.emoji.id}.${focused2() && props.emoji.animated ? "gif" : "png"}?size=32`));
    return _el$22;
  })();
}
function ServerEmojis(props) {
  const isNitroUser = Number(untrack(discordClientReady)?.ready.user.premium_type) > 0;
  return [(() => {
    var _el$24 = _tmpl$8(), _el$25 = _el$24.firstChild;
    className(_el$24, category);
    className(_el$25, icon);
    insert(_el$25, createComponent(Show, {
      get when() {
        return props.guild.value.icon;
      },
      get fallback() {
        return (() => {
          var _el$27 = _tmpl$4();
          insert(_el$27, () => props.guild.value.name.split(/\s+/).map((a) => {
            let char = "";
            a.replace(/((^[A-z])|([^A-z]))/g, (a2) => {
              char += a2;
              return a2;
            });
            return char;
          }).join(""));
          return _el$27;
        })();
      },
      children: (icon2) => (() => {
        var _el$28 = _tmpl$10();
        createRenderEffect(() => setAttribute(_el$28, "src", `https://cdn.discordapp.com/icons/${props.guild.id}/${icon2()}.png?size=32`));
        return _el$28;
      })()
    }));
    insert(_el$24, () => props.guild.value.name, null);
    return _el$24;
  })(), (() => {
    var _el$26 = _tmpl$4();
    className(_el$26, content);
    insert(_el$26, createComponent(For, {
      get each() {
        return props.guild.$.emojis;
      },
      children: (serverEmoji) => createComponent(Show, {
        get when() {
          return memo(() => serverEmoji.available !== false)() && (serverEmoji.animated ? isNitroUser : true);
        },
        get children() {
          return createComponent(ServerEmojiItem, mergeProps(props, {
            emoji: serverEmoji
          }));
        }
      })
    }));
    return _el$26;
  })()];
}
function EmojiPicker(props) {
  const [result, setResult] = createSignal([]);
  onMount(() => {
    pauseKeypress();
    __CJS__export_default__.add(SN_ID, {
      selector: `.${picker} .${search} input, .${picker} .${emoji}`,
      restrict: "self-only"
    });
    __CJS__export_default__.focus(SN_ID);
  });
  onCleanup(() => {
    __CJS__export_default__.remove(SN_ID);
    resumeKeypress();
  });
  return (() => {
    var _el$29 = _tmpl$8(), _el$30 = _el$29.firstChild;
    className(_el$29, picker);
    className(_el$30, main);
    insert(_el$30, createComponent(Search, {
      get onClose() {
        return props.onClose;
      },
      setResult
    }), null);
    insert(_el$30, createComponent(Show, {
      get when() {
        return result().length;
      },
      get fallback() {
        return [createComponent(FavoriteEmojis, props), createComponent(FrequentEmojis, props), createComponent(Show, {
          get when() {
            return props.guild;
          },
          children: (guild) => createComponent(ServerEmojis, {
            get guild() {
              return guild();
            },
            get onClose() {
              return props.onClose;
            },
            get onSelect() {
              return props.onSelect;
            }
          })
        })];
      },
      get children() {
        var _el$31 = _tmpl$4();
        className(_el$31, content);
        insert(_el$31, createComponent(For, {
          get each() {
            return result();
          },
          children: (emoji2) => createComponent(EmojiItem, mergeProps({
            emoji: emoji2
          }, props))
        }));
        return _el$31;
      }
    }), null);
    insert(_el$29, createComponent(FocusedEmojiDescription, {}), null);
    return _el$29;
  })();
}
delegateEvents(["input", "keydown"]);
export {
  SUPPORTED_VARIATIONS,
  SkinVariation,
  EmojiPicker as default,
  fromCodePoint
};
//# sourceMappingURL=EmojiPicker-D-2hHhU7.js.map
