var e = Object.create,
    t = Object.defineProperty,
    n = Object.getOwnPropertyDescriptor,
    r = Object.getOwnPropertyNames,
    i = Object.getPrototypeOf,
    a = Object.prototype.hasOwnProperty,
    o = (e, t) => () => (t || e((t = {exports: {}}).exports, t), t.exports),
    s = (e, i, o, s) => {
        if ((i && typeof i == `object`) || typeof i == `function`)
            for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
                ((d = c[l]),
                    !a.call(e, d) &&
                        d !== o &&
                        t(e, d, {
                            get: ((e) => i[e]).bind(null, d),
                            enumerable: !(s = n(i, d)) || s.enumerable,
                        }));
        return e;
    },
    c = (n, r, a) => (
        (a = n == null ? {} : e(i(n))),
        s(r || !n || !n.__esModule ? t(a, `default`, {value: n, enumerable: !0}) : a, n)
    );
const l = (e, t, n) => (customElements.get(e) === t || customElements.define(e, t, n), !0),
    u = (e) => {
        let t = ``;
        for (let n = 0; n < e; n++)
            t += `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`.charAt(
                Math.floor(Math.random() * 62),
            );
        return t;
    },
    d = (e, t = {}) => {
        let n = p(t);
        return new URL(e, n).href;
    },
    f = (e, t, n = {}) => {
        if (t === void 0)
            return (
                console.warn(`getAssetURL called without package name, use getAbsoluteURL instead`),
                d(e, n)
            );
        let r = `local/` + e + `/` + t,
            i = p(n);
        return new URL(r, i).href;
    },
    p = (e = {}) => {
        let t = new URL(e.metaUrl === void 0 ? import.meta.url : e.metaUrl);
        return (t.pathname.split(`/`).slice(-2)[0] === `shared` && (t = new URL(`..`, t)), t);
    };
var m = o((e, t) => {
    /*!
     * jQuery JavaScript Library v3.7.1
     * https://jquery.com/
     *
     * Copyright OpenJS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2023-08-28T13:37Z
     */
    (function (e, n) {
        typeof t == `object` && typeof t.exports == `object`
            ? (t.exports = e.document
                  ? n(e, !0)
                  : function (e) {
                        if (!e.document) throw Error(`jQuery requires a window with a document`);
                        return n(e);
                    })
            : n(e);
    })(typeof window < `u` ? window : e, function (e, t) {
        var n = [],
            r = Object.getPrototypeOf,
            i = n.slice,
            a = n.flat
                ? function (e) {
                      return n.flat.call(e);
                  }
                : function (e) {
                      return n.concat.apply([], e);
                  },
            o = n.push,
            s = n.indexOf,
            c = {},
            l = c.toString,
            u = c.hasOwnProperty,
            d = u.toString,
            f = d.call(Object),
            p = {},
            m = function (e) {
                return (
                    typeof e == `function` &&
                    typeof e.nodeType != `number` &&
                    typeof e.item != `function`
                );
            },
            h = function (e) {
                return e != null && e === e.window;
            },
            g = e.document,
            _ = {type: !0, src: !0, nonce: !0, noModule: !0};
        function v(e, t, n) {
            n ||= g;
            var r,
                i,
                a = n.createElement(`script`);
            if (((a.text = e), t))
                for (r in _)
                    ((i = t[r] || (t.getAttribute && t.getAttribute(r))),
                        i && a.setAttribute(r, i));
            n.head.appendChild(a).parentNode.removeChild(a);
        }
        function y(e) {
            return e == null
                ? e + ``
                : typeof e == `object` || typeof e == `function`
                  ? c[l.call(e)] || `object`
                  : typeof e;
        }
        var b = `3.7.1`,
            x = /HTML$/i,
            S = function (e, t) {
                return new S.fn.init(e, t);
            };
        ((S.fn = S.prototype =
            {
                jquery: b,
                constructor: S,
                length: 0,
                toArray: function () {
                    return i.call(this);
                },
                get: function (e) {
                    return e == null ? i.call(this) : e < 0 ? this[e + this.length] : this[e];
                },
                pushStack: function (e) {
                    var t = S.merge(this.constructor(), e);
                    return ((t.prevObject = this), t);
                },
                each: function (e) {
                    return S.each(this, e);
                },
                map: function (e) {
                    return this.pushStack(
                        S.map(this, function (t, n) {
                            return e.call(t, n, t);
                        }),
                    );
                },
                slice: function () {
                    return this.pushStack(i.apply(this, arguments));
                },
                first: function () {
                    return this.eq(0);
                },
                last: function () {
                    return this.eq(-1);
                },
                even: function () {
                    return this.pushStack(
                        S.grep(this, function (e, t) {
                            return (t + 1) % 2;
                        }),
                    );
                },
                odd: function () {
                    return this.pushStack(
                        S.grep(this, function (e, t) {
                            return t % 2;
                        }),
                    );
                },
                eq: function (e) {
                    var t = this.length,
                        n = +e + (e < 0 ? t : 0);
                    return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
                },
                end: function () {
                    return this.prevObject || this.constructor();
                },
                push: o,
                sort: n.sort,
                splice: n.splice,
            }),
            (S.extend = S.fn.extend =
                function () {
                    var e,
                        t,
                        n,
                        r,
                        i,
                        a,
                        o = arguments[0] || {},
                        s = 1,
                        c = arguments.length,
                        l = !1;
                    for (
                        typeof o == `boolean` && ((l = o), (o = arguments[s] || {}), s++),
                            typeof o != `object` && !m(o) && (o = {}),
                            s === c && ((o = this), s--);
                        s < c;
                        s++
                    )
                        if ((e = arguments[s]) != null)
                            for (t in e)
                                ((r = e[t]),
                                    !(t === `__proto__` || o === r) &&
                                        (l && r && (S.isPlainObject(r) || (i = Array.isArray(r)))
                                            ? ((n = o[t]),
                                              (a =
                                                  i && !Array.isArray(n)
                                                      ? []
                                                      : !i && !S.isPlainObject(n)
                                                        ? {}
                                                        : n),
                                              (i = !1),
                                              (o[t] = S.extend(l, a, r)))
                                            : r !== void 0 && (o[t] = r)));
                    return o;
                }),
            S.extend({
                expando: `jQuery` + (b + Math.random()).replace(/\D/g, ``),
                isReady: !0,
                error: function (e) {
                    throw Error(e);
                },
                noop: function () {},
                isPlainObject: function (e) {
                    var t, n;
                    return !e || l.call(e) !== `[object Object]`
                        ? !1
                        : ((t = r(e)),
                          t
                              ? ((n = u.call(t, `constructor`) && t.constructor),
                                typeof n == `function` && d.call(n) === f)
                              : !0);
                },
                isEmptyObject: function (e) {
                    for (var t in e) return !1;
                    return !0;
                },
                globalEval: function (e, t, n) {
                    v(e, {nonce: t && t.nonce}, n);
                },
                each: function (e, t) {
                    var n,
                        r = 0;
                    if (C(e)) for (n = e.length; r < n && t.call(e[r], r, e[r]) !== !1; r++);
                    else for (r in e) if (t.call(e[r], r, e[r]) === !1) break;
                    return e;
                },
                text: function (e) {
                    var t,
                        n = ``,
                        r = 0,
                        i = e.nodeType;
                    if (!i) for (; (t = e[r++]); ) n += S.text(t);
                    return i === 1 || i === 11
                        ? e.textContent
                        : i === 9
                          ? e.documentElement.textContent
                          : i === 3 || i === 4
                            ? e.nodeValue
                            : n;
                },
                makeArray: function (e, t) {
                    var n = t || [];
                    return (
                        e != null &&
                            (C(Object(e))
                                ? S.merge(n, typeof e == `string` ? [e] : e)
                                : o.call(n, e)),
                        n
                    );
                },
                inArray: function (e, t, n) {
                    return t == null ? -1 : s.call(t, e, n);
                },
                isXMLDoc: function (e) {
                    var t = e && e.namespaceURI,
                        n = e && (e.ownerDocument || e).documentElement;
                    return !x.test(t || (n && n.nodeName) || `HTML`);
                },
                merge: function (e, t) {
                    for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
                    return ((e.length = i), e);
                },
                grep: function (e, t, n) {
                    for (var r, i = [], a = 0, o = e.length, s = !n; a < o; a++)
                        ((r = !t(e[a], a)), r !== s && i.push(e[a]));
                    return i;
                },
                map: function (e, t, n) {
                    var r,
                        i,
                        o = 0,
                        s = [];
                    if (C(e))
                        for (r = e.length; o < r; o++)
                            ((i = t(e[o], o, n)), i != null && s.push(i));
                    else for (o in e) ((i = t(e[o], o, n)), i != null && s.push(i));
                    return a(s);
                },
                guid: 1,
                support: p,
            }),
            typeof Symbol == `function` && (S.fn[Symbol.iterator] = n[Symbol.iterator]),
            S.each(
                `Boolean Number String Function Array Date RegExp Object Error Symbol`.split(` `),
                function (e, t) {
                    c[`[object ` + t + `]`] = t.toLowerCase();
                },
            ));
        function C(e) {
            var t = !!e && `length` in e && e.length,
                n = y(e);
            return m(e) || h(e)
                ? !1
                : n === `array` || t === 0 || (typeof t == `number` && t > 0 && t - 1 in e);
        }
        function w(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
        }
        var T = n.pop,
            E = n.sort,
            ee = n.splice,
            D = `[\\x20\\t\\r\\n\\f]`,
            O = RegExp(`^` + D + `+|((?:^|[^\\\\])(?:\\\\.)*)` + D + `+$`, `g`);
        S.contains = function (e, t) {
            var n = t && t.parentNode;
            return (
                e === n ||
                !!(
                    n &&
                    n.nodeType === 1 &&
                    (e.contains
                        ? e.contains(n)
                        : e.compareDocumentPosition && e.compareDocumentPosition(n) & 16)
                )
            );
        };
        var te = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        function ne(e, t) {
            return t
                ? e === `\0`
                    ? `�`
                    : e.slice(0, -1) + `\\` + e.charCodeAt(e.length - 1).toString(16) + ` `
                : `\\` + e;
        }
        S.escapeSelector = function (e) {
            return (e + ``).replace(te, ne);
        };
        var k = g,
            re = o;
        (function () {
            var t,
                r,
                a,
                o,
                c,
                l = re,
                d,
                f,
                m,
                h,
                g,
                _ = S.expando,
                v = 0,
                y = 0,
                b = ye(),
                x = ye(),
                C = ye(),
                te = ye(),
                ne = function (e, t) {
                    return (e === t && (c = !0), 0);
                },
                A = `checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped`,
                ie = `(?:\\\\[\\da-fA-F]{1,6}` + D + `?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+`,
                ae =
                    `\\[` +
                    D +
                    `*(` +
                    ie +
                    `)(?:` +
                    D +
                    `*([*^$|!~]?=)` +
                    D +
                    `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` +
                    ie +
                    `))|)` +
                    D +
                    `*\\]`,
                oe =
                    `:(` +
                    ie +
                    `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` +
                    ae +
                    `)*)|.*)\\)|)`,
                se = RegExp(D + `+`, `g`),
                ce = RegExp(`^` + D + `*,` + D + `*`),
                le = RegExp(`^` + D + `*([>+~]|` + D + `)` + D + `*`),
                ue = RegExp(D + `|>`),
                de = new RegExp(oe),
                fe = RegExp(`^` + ie + `$`),
                pe = {
                    ID: RegExp(`^#(` + ie + `)`),
                    CLASS: RegExp(`^\\.(` + ie + `)`),
                    TAG: RegExp(`^(` + ie + `|[*])`),
                    ATTR: RegExp(`^` + ae),
                    PSEUDO: RegExp(`^` + oe),
                    CHILD: RegExp(
                        `^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(` +
                            D +
                            `*(even|odd|(([+-]|)(\\d*)n|)` +
                            D +
                            `*(?:([+-]|)` +
                            D +
                            `*(\\d+)|))` +
                            D +
                            `*\\)|)`,
                        `i`,
                    ),
                    bool: RegExp(`^(?:` + A + `)$`, `i`),
                    needsContext: RegExp(
                        `^` +
                            D +
                            `*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(` +
                            D +
                            `*((?:-\\d)?\\d*)` +
                            D +
                            `*\\)|)(?=[^-]|$)`,
                        `i`,
                    ),
                },
                j = /^(?:input|select|textarea|button)$/i,
                me = /^h\d$/i,
                he = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                M = /[+~]/,
                N = RegExp(`\\\\[\\da-fA-F]{1,6}` + D + `?|\\\\([^\\r\\n\\f])`, `g`),
                ge = function (e, t) {
                    var n = `0x` + e.slice(1) - 65536;
                    return (
                        t ||
                        (n < 0
                            ? String.fromCharCode(n + 65536)
                            : String.fromCharCode((n >> 10) | 55296, (n & 1023) | 56320))
                    );
                },
                _e = function () {
                    Ce();
                },
                ve = Te(
                    function (e) {
                        return e.disabled === !0 && w(e, `fieldset`);
                    },
                    {dir: `parentNode`, next: `legend`},
                );
            function P() {
                try {
                    return d.activeElement;
                } catch {}
            }
            try {
                (l.apply((n = i.call(k.childNodes)), k.childNodes),
                    n[k.childNodes.length].nodeType);
            } catch {
                l = {
                    apply: function (e, t) {
                        re.apply(e, i.call(t));
                    },
                    call: function (e) {
                        re.apply(e, i.call(arguments, 1));
                    },
                };
            }
            function F(e, t, n, r) {
                var i,
                    a,
                    o,
                    s,
                    c,
                    u,
                    f,
                    g = t && t.ownerDocument,
                    v = t ? t.nodeType : 9;
                if (((n ||= []), typeof e != `string` || !e || (v !== 1 && v !== 9 && v !== 11)))
                    return n;
                if (!r && (Ce(t), (t ||= d), m)) {
                    if (v !== 11 && (c = he.exec(e))) {
                        if ((i = c[1])) {
                            if (v === 9)
                                if ((o = t.getElementById(i))) {
                                    if (o.id === i) return (l.call(n, o), n);
                                } else return n;
                            else if (
                                g &&
                                (o = g.getElementById(i)) &&
                                F.contains(t, o) &&
                                o.id === i
                            )
                                return (l.call(n, o), n);
                        } else if (c[2]) return (l.apply(n, t.getElementsByTagName(e)), n);
                        else if ((i = c[3]) && t.getElementsByClassName)
                            return (l.apply(n, t.getElementsByClassName(i)), n);
                    }
                    if (!te[e + ` `] && (!h || !h.test(e))) {
                        if (((f = e), (g = t), v === 1 && (ue.test(e) || le.test(e)))) {
                            for (
                                g = (M.test(e) && Se(t.parentNode)) || t,
                                    (g != t || !p.scope) &&
                                        ((s = t.getAttribute(`id`))
                                            ? (s = S.escapeSelector(s))
                                            : t.setAttribute(`id`, (s = _))),
                                    u = B(e),
                                    a = u.length;
                                a--;

                            )
                                u[a] = (s ? `#` + s : `:scope`) + ` ` + V(u[a]);
                            f = u.join(`,`);
                        }
                        try {
                            return (l.apply(n, g.querySelectorAll(f)), n);
                        } catch {
                            te(e, !0);
                        } finally {
                            s === _ && t.removeAttribute(`id`);
                        }
                    }
                }
                return je(e.replace(O, `$1`), t, n, r);
            }
            function ye() {
                var e = [];
                function t(n, i) {
                    return (
                        e.push(n + ` `) > r.cacheLength && delete t[e.shift()],
                        (t[n + ` `] = i)
                    );
                }
                return t;
            }
            function I(e) {
                return ((e[_] = !0), e);
            }
            function L(e) {
                var t = d.createElement(`fieldset`);
                try {
                    return !!e(t);
                } catch {
                    return !1;
                } finally {
                    (t.parentNode && t.parentNode.removeChild(t), (t = null));
                }
            }
            function be(e) {
                return function (t) {
                    return w(t, `input`) && t.type === e;
                };
            }
            function xe(e) {
                return function (t) {
                    return (w(t, `input`) || w(t, `button`)) && t.type === e;
                };
            }
            function R(e) {
                return function (t) {
                    return `form` in t
                        ? t.parentNode && t.disabled === !1
                            ? `label` in t
                                ? `label` in t.parentNode
                                    ? t.parentNode.disabled === e
                                    : t.disabled === e
                                : t.isDisabled === e || (t.isDisabled !== !e && ve(t) === e)
                            : t.disabled === e
                        : `label` in t
                          ? t.disabled === e
                          : !1;
                };
            }
            function z(e) {
                return I(function (t) {
                    return (
                        (t = +t),
                        I(function (n, r) {
                            for (var i, a = e([], n.length, t), o = a.length; o--; )
                                n[(i = a[o])] && (n[i] = !(r[i] = n[i]));
                        })
                    );
                });
            }
            function Se(e) {
                return e && e.getElementsByTagName !== void 0 && e;
            }
            function Ce(e) {
                var t,
                    n = e ? e.ownerDocument || e : k;
                return n == d || n.nodeType !== 9 || !n.documentElement
                    ? d
                    : ((d = n),
                      (f = d.documentElement),
                      (m = !S.isXMLDoc(d)),
                      (g = f.matches || f.webkitMatchesSelector || f.msMatchesSelector),
                      f.msMatchesSelector &&
                          k != d &&
                          (t = d.defaultView) &&
                          t.top !== t &&
                          t.addEventListener(`unload`, _e),
                      (p.getById = L(function (e) {
                          return (
                              (f.appendChild(e).id = S.expando),
                              !d.getElementsByName || !d.getElementsByName(S.expando).length
                          );
                      })),
                      (p.disconnectedMatch = L(function (e) {
                          return g.call(e, `*`);
                      })),
                      (p.scope = L(function () {
                          return d.querySelectorAll(`:scope`);
                      })),
                      (p.cssHas = L(function () {
                          try {
                              return (d.querySelector(`:has(*,:jqfake)`), !1);
                          } catch {
                              return !0;
                          }
                      })),
                      p.getById
                          ? ((r.filter.ID = function (e) {
                                var t = e.replace(N, ge);
                                return function (e) {
                                    return e.getAttribute(`id`) === t;
                                };
                            }),
                            (r.find.ID = function (e, t) {
                                if (t.getElementById !== void 0 && m) {
                                    var n = t.getElementById(e);
                                    return n ? [n] : [];
                                }
                            }))
                          : ((r.filter.ID = function (e) {
                                var t = e.replace(N, ge);
                                return function (e) {
                                    var n =
                                        e.getAttributeNode !== void 0 && e.getAttributeNode(`id`);
                                    return n && n.value === t;
                                };
                            }),
                            (r.find.ID = function (e, t) {
                                if (t.getElementById !== void 0 && m) {
                                    var n,
                                        r,
                                        i,
                                        a = t.getElementById(e);
                                    if (a) {
                                        if (((n = a.getAttributeNode(`id`)), n && n.value === e))
                                            return [a];
                                        for (i = t.getElementsByName(e), r = 0; (a = i[r++]); )
                                            if (
                                                ((n = a.getAttributeNode(`id`)), n && n.value === e)
                                            )
                                                return [a];
                                    }
                                    return [];
                                }
                            })),
                      (r.find.TAG = function (e, t) {
                          return t.getElementsByTagName === void 0
                              ? t.querySelectorAll(e)
                              : t.getElementsByTagName(e);
                      }),
                      (r.find.CLASS = function (e, t) {
                          if (t.getElementsByClassName !== void 0 && m)
                              return t.getElementsByClassName(e);
                      }),
                      (h = []),
                      L(function (e) {
                          var t;
                          ((f.appendChild(e).innerHTML =
                              `<a id='` +
                              _ +
                              `' href='' disabled='disabled'></a><select id='` +
                              _ +
                              `-\r\\' disabled='disabled'><option selected=''></option></select>`),
                              e.querySelectorAll(`[selected]`).length ||
                                  h.push(`\\[` + D + `*(?:value|` + A + `)`),
                              e.querySelectorAll(`[id~=` + _ + `-]`).length || h.push(`~=`),
                              e.querySelectorAll(`a#` + _ + `+*`).length || h.push(`.#.+[+~]`),
                              e.querySelectorAll(`:checked`).length || h.push(`:checked`),
                              (t = d.createElement(`input`)),
                              t.setAttribute(`type`, `hidden`),
                              e.appendChild(t).setAttribute(`name`, `D`),
                              (f.appendChild(e).disabled = !0),
                              e.querySelectorAll(`:disabled`).length !== 2 &&
                                  h.push(`:enabled`, `:disabled`),
                              (t = d.createElement(`input`)),
                              t.setAttribute(`name`, ``),
                              e.appendChild(t),
                              e.querySelectorAll(`[name='']`).length ||
                                  h.push(`\\[` + D + `*name` + D + `*=` + D + `*(?:''|"")`));
                      }),
                      p.cssHas || h.push(`:has`),
                      (h = h.length && new RegExp(h.join(`|`))),
                      (ne = function (e, t) {
                          if (e === t) return ((c = !0), 0);
                          var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                          return (
                              n ||
                              ((n =
                                  (e.ownerDocument || e) == (t.ownerDocument || t)
                                      ? e.compareDocumentPosition(t)
                                      : 1),
                              n & 1 || (!p.sortDetached && t.compareDocumentPosition(e) === n)
                                  ? e === d || (e.ownerDocument == k && F.contains(k, e))
                                      ? -1
                                      : t === d || (t.ownerDocument == k && F.contains(k, t))
                                        ? 1
                                        : o
                                          ? s.call(o, e) - s.call(o, t)
                                          : 0
                                  : n & 4
                                    ? -1
                                    : 1)
                          );
                      }),
                      d);
            }
            for (t in ((F.matches = function (e, t) {
                return F(e, null, null, t);
            }),
            (F.matchesSelector = function (e, t) {
                if ((Ce(e), m && !te[t + ` `] && (!h || !h.test(t))))
                    try {
                        var n = g.call(e, t);
                        if (n || p.disconnectedMatch || (e.document && e.document.nodeType !== 11))
                            return n;
                    } catch {
                        te(t, !0);
                    }
                return F(t, d, null, [e]).length > 0;
            }),
            (F.contains = function (e, t) {
                return ((e.ownerDocument || e) != d && Ce(e), S.contains(e, t));
            }),
            (F.attr = function (e, t) {
                (e.ownerDocument || e) != d && Ce(e);
                var n = r.attrHandle[t.toLowerCase()],
                    i = n && u.call(r.attrHandle, t.toLowerCase()) ? n(e, t, !m) : void 0;
                return i === void 0 ? e.getAttribute(t) : i;
            }),
            (F.error = function (e) {
                throw Error(`Syntax error, unrecognized expression: ` + e);
            }),
            (S.uniqueSort = function (e) {
                var t,
                    n = [],
                    r = 0,
                    a = 0;
                if (((c = !p.sortStable), (o = !p.sortStable && i.call(e, 0)), E.call(e, ne), c)) {
                    for (; (t = e[a++]); ) t === e[a] && (r = n.push(a));
                    for (; r--; ) ee.call(e, n[r], 1);
                }
                return ((o = null), e);
            }),
            (S.fn.uniqueSort = function () {
                return this.pushStack(S.uniqueSort(i.apply(this)));
            }),
            (r = S.expr =
                {
                    cacheLength: 50,
                    createPseudo: I,
                    match: pe,
                    attrHandle: {},
                    find: {},
                    relative: {
                        '>': {dir: `parentNode`, first: !0},
                        ' ': {dir: `parentNode`},
                        '+': {dir: `previousSibling`, first: !0},
                        '~': {dir: `previousSibling`},
                    },
                    preFilter: {
                        ATTR: function (e) {
                            return (
                                (e[1] = e[1].replace(N, ge)),
                                (e[3] = (e[3] || e[4] || e[5] || ``).replace(N, ge)),
                                e[2] === `~=` && (e[3] = ` ` + e[3] + ` `),
                                e.slice(0, 4)
                            );
                        },
                        CHILD: function (e) {
                            return (
                                (e[1] = e[1].toLowerCase()),
                                e[1].slice(0, 3) === `nth`
                                    ? (e[3] || F.error(e[0]),
                                      (e[4] = +(e[4]
                                          ? e[5] + (e[6] || 1)
                                          : 2 * (e[3] === `even` || e[3] === `odd`))),
                                      (e[5] = +(e[7] + e[8] || e[3] === `odd`)))
                                    : e[3] && F.error(e[0]),
                                e
                            );
                        },
                        PSEUDO: function (e) {
                            var t,
                                n = !e[6] && e[2];
                            return pe.CHILD.test(e[0])
                                ? null
                                : (e[3]
                                      ? (e[2] = e[4] || e[5] || ``)
                                      : n &&
                                        de.test(n) &&
                                        (t = B(n, !0)) &&
                                        (t = n.indexOf(`)`, n.length - t) - n.length) &&
                                        ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                                  e.slice(0, 3));
                        },
                    },
                    filter: {
                        TAG: function (e) {
                            var t = e.replace(N, ge).toLowerCase();
                            return e === `*`
                                ? function () {
                                      return !0;
                                  }
                                : function (e) {
                                      return w(e, t);
                                  };
                        },
                        CLASS: function (e) {
                            var t = b[e + ` `];
                            return (
                                t ||
                                ((t = RegExp(`(^|` + D + `)` + e + `(` + D + `|$)`)) &&
                                    b(e, function (e) {
                                        return t.test(
                                            (typeof e.className == `string` && e.className) ||
                                                (e.getAttribute !== void 0 &&
                                                    e.getAttribute(`class`)) ||
                                                ``,
                                        );
                                    }))
                            );
                        },
                        ATTR: function (e, t, n) {
                            return function (r) {
                                var i = F.attr(r, e);
                                return i == null
                                    ? t === `!=`
                                    : t
                                      ? ((i += ``),
                                        t === `=`
                                            ? i === n
                                            : t === `!=`
                                              ? i !== n
                                              : t === `^=`
                                                ? n && i.indexOf(n) === 0
                                                : t === `*=`
                                                  ? n && i.indexOf(n) > -1
                                                  : t === `$=`
                                                    ? n && i.slice(-n.length) === n
                                                    : t === `~=`
                                                      ? (` ` + i.replace(se, ` `) + ` `).indexOf(
                                                            n,
                                                        ) > -1
                                                      : t === `|=`
                                                        ? i === n ||
                                                          i.slice(0, n.length + 1) === n + `-`
                                                        : !1)
                                      : !0;
                            };
                        },
                        CHILD: function (e, t, n, r, i) {
                            var a = e.slice(0, 3) !== `nth`,
                                o = e.slice(-4) !== `last`,
                                s = t === `of-type`;
                            return r === 1 && i === 0
                                ? function (e) {
                                      return !!e.parentNode;
                                  }
                                : function (t, n, c) {
                                      var l,
                                          u,
                                          d,
                                          f,
                                          p,
                                          m = a === o ? `previousSibling` : `nextSibling`,
                                          h = t.parentNode,
                                          g = s && t.nodeName.toLowerCase(),
                                          y = !c && !s,
                                          b = !1;
                                      if (h) {
                                          if (a) {
                                              for (; m; ) {
                                                  for (d = t; (d = d[m]); )
                                                      if (s ? w(d, g) : d.nodeType === 1) return !1;
                                                  p = m = e === `only` && !p && `nextSibling`;
                                              }
                                              return !0;
                                          }
                                          if (((p = [o ? h.firstChild : h.lastChild]), o && y)) {
                                              for (
                                                  u = h[_] || (h[_] = {}),
                                                      l = u[e] || [],
                                                      f = l[0] === v && l[1],
                                                      b = f && l[2],
                                                      d = f && h.childNodes[f];
                                                  (d =
                                                      (++f && d && d[m]) || (b = f = 0) || p.pop());

                                              )
                                                  if (d.nodeType === 1 && ++b && d === t) {
                                                      u[e] = [v, f, b];
                                                      break;
                                                  }
                                          } else if (
                                              (y &&
                                                  ((u = t[_] || (t[_] = {})),
                                                  (l = u[e] || []),
                                                  (f = l[0] === v && l[1]),
                                                  (b = f)),
                                              b === !1)
                                          )
                                              for (
                                                  ;
                                                  (d =
                                                      (++f && d && d[m]) ||
                                                      (b = f = 0) ||
                                                      p.pop()) &&
                                                  !(
                                                      (s ? w(d, g) : d.nodeType === 1) &&
                                                      ++b &&
                                                      (y &&
                                                          ((u = d[_] || (d[_] = {})),
                                                          (u[e] = [v, b])),
                                                      d === t)
                                                  );

                                              );
                                          return ((b -= i), b === r || (b % r === 0 && b / r >= 0));
                                      }
                                  };
                        },
                        PSEUDO: function (e, t) {
                            var n,
                                i =
                                    r.pseudos[e] ||
                                    r.setFilters[e.toLowerCase()] ||
                                    F.error(`unsupported pseudo: ` + e);
                            return i[_]
                                ? i(t)
                                : i.length > 1
                                  ? ((n = [e, e, ``, t]),
                                    r.setFilters.hasOwnProperty(e.toLowerCase())
                                        ? I(function (e, n) {
                                              for (var r, a = i(e, t), o = a.length; o--; )
                                                  ((r = s.call(e, a[o])), (e[r] = !(n[r] = a[o])));
                                          })
                                        : function (e) {
                                              return i(e, 0, n);
                                          })
                                  : i;
                        },
                    },
                    pseudos: {
                        not: I(function (e) {
                            var t = [],
                                n = [],
                                r = Ae(e.replace(O, `$1`));
                            return r[_]
                                ? I(function (e, t, n, i) {
                                      for (var a, o = r(e, null, i, []), s = e.length; s--; )
                                          (a = o[s]) && (e[s] = !(t[s] = a));
                                  })
                                : function (e, i, a) {
                                      return (
                                          (t[0] = e),
                                          r(t, null, a, n),
                                          (t[0] = null),
                                          !n.pop()
                                      );
                                  };
                        }),
                        has: I(function (e) {
                            return function (t) {
                                return F(e, t).length > 0;
                            };
                        }),
                        contains: I(function (e) {
                            return (
                                (e = e.replace(N, ge)),
                                function (t) {
                                    return (t.textContent || S.text(t)).indexOf(e) > -1;
                                }
                            );
                        }),
                        lang: I(function (e) {
                            return (
                                fe.test(e || ``) || F.error(`unsupported lang: ` + e),
                                (e = e.replace(N, ge).toLowerCase()),
                                function (t) {
                                    var n;
                                    do
                                        if (
                                            (n = m
                                                ? t.lang
                                                : t.getAttribute(`xml:lang`) ||
                                                  t.getAttribute(`lang`))
                                        )
                                            return (
                                                (n = n.toLowerCase()),
                                                n === e || n.indexOf(e + `-`) === 0
                                            );
                                    while ((t = t.parentNode) && t.nodeType === 1);
                                    return !1;
                                }
                            );
                        }),
                        target: function (t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id;
                        },
                        root: function (e) {
                            return e === f;
                        },
                        focus: function (e) {
                            return e === P() && d.hasFocus() && !!(e.type || e.href || ~e.tabIndex);
                        },
                        enabled: R(!1),
                        disabled: R(!0),
                        checked: function (e) {
                            return (
                                (w(e, `input`) && !!e.checked) || (w(e, `option`) && !!e.selected)
                            );
                        },
                        selected: function (e) {
                            return (e.parentNode && e.parentNode.selectedIndex, e.selected === !0);
                        },
                        empty: function (e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6) return !1;
                            return !0;
                        },
                        parent: function (e) {
                            return !r.pseudos.empty(e);
                        },
                        header: function (e) {
                            return me.test(e.nodeName);
                        },
                        input: function (e) {
                            return j.test(e.nodeName);
                        },
                        button: function (e) {
                            return (w(e, `input`) && e.type === `button`) || w(e, `button`);
                        },
                        text: function (e) {
                            var t;
                            return (
                                w(e, `input`) &&
                                e.type === `text` &&
                                ((t = e.getAttribute(`type`)) == null || t.toLowerCase() === `text`)
                            );
                        },
                        first: z(function () {
                            return [0];
                        }),
                        last: z(function (e, t) {
                            return [t - 1];
                        }),
                        eq: z(function (e, t, n) {
                            return [n < 0 ? n + t : n];
                        }),
                        even: z(function (e, t) {
                            for (var n = 0; n < t; n += 2) e.push(n);
                            return e;
                        }),
                        odd: z(function (e, t) {
                            for (var n = 1; n < t; n += 2) e.push(n);
                            return e;
                        }),
                        lt: z(function (e, t, n) {
                            for (var r = n < 0 ? n + t : n > t ? t : n; --r >= 0; ) e.push(r);
                            return e;
                        }),
                        gt: z(function (e, t, n) {
                            for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
                            return e;
                        }),
                    },
                }),
            (r.pseudos.nth = r.pseudos.eq),
            {radio: !0, checkbox: !0, file: !0, password: !0, image: !0}))
                r.pseudos[t] = be(t);
            for (t in {submit: !0, reset: !0}) r.pseudos[t] = xe(t);
            function we() {}
            ((we.prototype = r.filters = r.pseudos), (r.setFilters = new we()));
            function B(e, t) {
                var n,
                    i,
                    a,
                    o,
                    s,
                    c,
                    l,
                    u = x[e + ` `];
                if (u) return t ? 0 : u.slice(0);
                for (s = e, c = [], l = r.preFilter; s; ) {
                    for (o in ((!n || (i = ce.exec(s))) &&
                        (i && (s = s.slice(i[0].length) || s), c.push((a = []))),
                    (n = !1),
                    (i = le.exec(s)) &&
                        ((n = i.shift()),
                        a.push({value: n, type: i[0].replace(O, ` `)}),
                        (s = s.slice(n.length))),
                    r.filter))
                        (i = pe[o].exec(s)) &&
                            (!l[o] || (i = l[o](i))) &&
                            ((n = i.shift()),
                            a.push({value: n, type: o, matches: i}),
                            (s = s.slice(n.length)));
                    if (!n) break;
                }
                return t ? s.length : s ? F.error(e) : x(e, c).slice(0);
            }
            function V(e) {
                for (var t = 0, n = e.length, r = ``; t < n; t++) r += e[t].value;
                return r;
            }
            function Te(e, t, n) {
                var r = t.dir,
                    i = t.next,
                    a = i || r,
                    o = n && a === `parentNode`,
                    s = y++;
                return t.first
                    ? function (t, n, i) {
                          for (; (t = t[r]); ) if (t.nodeType === 1 || o) return e(t, n, i);
                          return !1;
                      }
                    : function (t, n, c) {
                          var l,
                              u,
                              d = [v, s];
                          if (c) {
                              for (; (t = t[r]); )
                                  if ((t.nodeType === 1 || o) && e(t, n, c)) return !0;
                          } else
                              for (; (t = t[r]); )
                                  if (t.nodeType === 1 || o) {
                                      if (((u = t[_] || (t[_] = {})), i && w(t, i))) t = t[r] || t;
                                      else if ((l = u[a]) && l[0] === v && l[1] === s)
                                          return (d[2] = l[2]);
                                      else if (((u[a] = d), (d[2] = e(t, n, c)))) return !0;
                                  }
                          return !1;
                      };
            }
            function H(e) {
                return e.length > 1
                    ? function (t, n, r) {
                          for (var i = e.length; i--; ) if (!e[i](t, n, r)) return !1;
                          return !0;
                      }
                    : e[0];
            }
            function Ee(e, t, n) {
                for (var r = 0, i = t.length; r < i; r++) F(e, t[r], n);
                return n;
            }
            function De(e, t, n, r, i) {
                for (var a, o = [], s = 0, c = e.length, l = t != null; s < c; s++)
                    (a = e[s]) && (!n || n(a, r, i)) && (o.push(a), l && t.push(s));
                return o;
            }
            function Oe(e, t, n, r, i, a) {
                return (
                    r && !r[_] && (r = Oe(r)),
                    i && !i[_] && (i = Oe(i, a)),
                    I(function (a, o, c, u) {
                        var d,
                            f,
                            p,
                            m,
                            h = [],
                            g = [],
                            _ = o.length,
                            v = a || Ee(t || `*`, c.nodeType ? [c] : c, []),
                            y = e && (a || !t) ? De(v, h, e, c, u) : v;
                        if (
                            (n ? ((m = i || (a ? e : _ || r) ? [] : o), n(y, m, c, u)) : (m = y), r)
                        )
                            for (d = De(m, g), r(d, [], c, u), f = d.length; f--; )
                                (p = d[f]) && (m[g[f]] = !(y[g[f]] = p));
                        if (a) {
                            if (i || e) {
                                if (i) {
                                    for (d = [], f = m.length; f--; )
                                        (p = m[f]) && d.push((y[f] = p));
                                    i(null, (m = []), d, u);
                                }
                                for (f = m.length; f--; )
                                    (p = m[f]) &&
                                        (d = i ? s.call(a, p) : h[f]) > -1 &&
                                        (a[d] = !(o[d] = p));
                            }
                        } else
                            ((m = De(m === o ? m.splice(_, m.length) : m)),
                                i ? i(null, o, m, u) : l.apply(o, m));
                    })
                );
            }
            function U(e) {
                for (
                    var t,
                        n,
                        i,
                        o = e.length,
                        c = r.relative[e[0].type],
                        l = c || r.relative[` `],
                        u = c ? 1 : 0,
                        d = Te(
                            function (e) {
                                return e === t;
                            },
                            l,
                            !0,
                        ),
                        f = Te(
                            function (e) {
                                return s.call(t, e) > -1;
                            },
                            l,
                            !0,
                        ),
                        p = [
                            function (e, n, r) {
                                var i =
                                    (!c && (r || n != a)) ||
                                    ((t = n).nodeType ? d(e, n, r) : f(e, n, r));
                                return ((t = null), i);
                            },
                        ];
                    u < o;
                    u++
                )
                    if ((n = r.relative[e[u].type])) p = [Te(H(p), n)];
                    else {
                        if (((n = r.filter[e[u].type].apply(null, e[u].matches)), n[_])) {
                            for (i = ++u; i < o && !r.relative[e[i].type]; i++);
                            return Oe(
                                u > 1 && H(p),
                                u > 1 &&
                                    V(
                                        e
                                            .slice(0, u - 1)
                                            .concat({value: e[u - 2].type === ` ` ? `*` : ``}),
                                    ).replace(O, `$1`),
                                n,
                                u < i && U(e.slice(u, i)),
                                i < o && U((e = e.slice(i))),
                                i < o && V(e),
                            );
                        }
                        p.push(n);
                    }
                return H(p);
            }
            function ke(e, t) {
                var n = t.length > 0,
                    i = e.length > 0,
                    o = function (o, s, c, u, f) {
                        var p,
                            h,
                            g,
                            _ = 0,
                            y = `0`,
                            b = o && [],
                            x = [],
                            C = a,
                            w = o || (i && r.find.TAG(`*`, f)),
                            E = (v += C == null ? 1 : Math.random() || 0.1),
                            ee = w.length;
                        for (f && (a = s == d || s || f); y !== ee && (p = w[y]) != null; y++) {
                            if (i && p) {
                                for (
                                    h = 0, !s && p.ownerDocument != d && (Ce(p), (c = !m));
                                    (g = e[h++]);

                                )
                                    if (g(p, s || d, c)) {
                                        l.call(u, p);
                                        break;
                                    }
                                f && (v = E);
                            }
                            n && ((p = !g && p) && _--, o && b.push(p));
                        }
                        if (((_ += y), n && y !== _)) {
                            for (h = 0; (g = t[h++]); ) g(b, x, s, c);
                            if (o) {
                                if (_ > 0) for (; y--; ) b[y] || x[y] || (x[y] = T.call(u));
                                x = De(x);
                            }
                            (l.apply(u, x),
                                f && !o && x.length > 0 && _ + t.length > 1 && S.uniqueSort(u));
                        }
                        return (f && ((v = E), (a = C)), b);
                    };
                return n ? I(o) : o;
            }
            function Ae(e, t) {
                var n,
                    r = [],
                    i = [],
                    a = C[e + ` `];
                if (!a) {
                    for (t ||= B(e), n = t.length; n--; )
                        ((a = U(t[n])), a[_] ? r.push(a) : i.push(a));
                    ((a = C(e, ke(i, r))), (a.selector = e));
                }
                return a;
            }
            function je(e, t, n, i) {
                var a,
                    o,
                    s,
                    c,
                    u,
                    d = typeof e == `function` && e,
                    f = !i && B((e = d.selector || e));
                if (((n ||= []), f.length === 1)) {
                    if (
                        ((o = f[0] = f[0].slice(0)),
                        o.length > 2 &&
                            (s = o[0]).type === `ID` &&
                            t.nodeType === 9 &&
                            m &&
                            r.relative[o[1].type])
                    ) {
                        if (((t = (r.find.ID(s.matches[0].replace(N, ge), t) || [])[0]), t))
                            d && (t = t.parentNode);
                        else return n;
                        e = e.slice(o.shift().value.length);
                    }
                    for (
                        a = pe.needsContext.test(e) ? 0 : o.length;
                        a-- && ((s = o[a]), !r.relative[(c = s.type)]);

                    )
                        if (
                            (u = r.find[c]) &&
                            (i = u(
                                s.matches[0].replace(N, ge),
                                (M.test(o[0].type) && Se(t.parentNode)) || t,
                            ))
                        ) {
                            if ((o.splice(a, 1), (e = i.length && V(o)), !e))
                                return (l.apply(n, i), n);
                            break;
                        }
                }
                return (
                    (d || Ae(e, f))(i, t, !m, n, !t || (M.test(e) && Se(t.parentNode)) || t),
                    n
                );
            }
            ((p.sortStable = _.split(``).sort(ne).join(``) === _),
                Ce(),
                (p.sortDetached = L(function (e) {
                    return e.compareDocumentPosition(d.createElement(`fieldset`)) & 1;
                })),
                (S.find = F),
                (S.expr[`:`] = S.expr.pseudos),
                (S.unique = S.uniqueSort),
                (F.compile = Ae),
                (F.select = je),
                (F.setDocument = Ce),
                (F.tokenize = B),
                (F.escape = S.escapeSelector),
                (F.getText = S.text),
                (F.isXML = S.isXMLDoc),
                (F.selectors = S.expr),
                (F.support = S.support),
                (F.uniqueSort = S.uniqueSort));
        })();
        var A = function (e, t, n) {
                for (var r = [], i = n !== void 0; (e = e[t]) && e.nodeType !== 9; )
                    if (e.nodeType === 1) {
                        if (i && S(e).is(n)) break;
                        r.push(e);
                    }
                return r;
            },
            ie = function (e, t) {
                for (var n = []; e; e = e.nextSibling) e.nodeType === 1 && e !== t && n.push(e);
                return n;
            },
            ae = S.expr.match.needsContext,
            oe = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function se(e, t, n) {
            return m(t)
                ? S.grep(e, function (e, r) {
                      return !!t.call(e, r, e) !== n;
                  })
                : t.nodeType
                  ? S.grep(e, function (e) {
                        return (e === t) !== n;
                    })
                  : typeof t == `string`
                    ? S.filter(t, e, n)
                    : S.grep(e, function (e) {
                          return s.call(t, e) > -1 !== n;
                      });
        }
        ((S.filter = function (e, t, n) {
            var r = t[0];
            return (
                n && (e = `:not(` + e + `)`),
                t.length === 1 && r.nodeType === 1
                    ? S.find.matchesSelector(r, e)
                        ? [r]
                        : []
                    : S.find.matches(
                          e,
                          S.grep(t, function (e) {
                              return e.nodeType === 1;
                          }),
                      )
            );
        }),
            S.fn.extend({
                find: function (e) {
                    var t,
                        n,
                        r = this.length,
                        i = this;
                    if (typeof e != `string`)
                        return this.pushStack(
                            S(e).filter(function () {
                                for (t = 0; t < r; t++) if (S.contains(i[t], this)) return !0;
                            }),
                        );
                    for (n = this.pushStack([]), t = 0; t < r; t++) S.find(e, i[t], n);
                    return r > 1 ? S.uniqueSort(n) : n;
                },
                filter: function (e) {
                    return this.pushStack(se(this, e || [], !1));
                },
                not: function (e) {
                    return this.pushStack(se(this, e || [], !0));
                },
                is: function (e) {
                    return !!se(this, typeof e == `string` && ae.test(e) ? S(e) : e || [], !1)
                        .length;
                },
            }));
        var ce,
            le = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
            ue = (S.fn.init = function (e, t, n) {
                var r, i;
                if (!e) return this;
                if (((n ||= ce), typeof e == `string`))
                    if (
                        ((r =
                            e[0] === `<` && e[e.length - 1] === `>` && e.length >= 3
                                ? [null, e, null]
                                : le.exec(e)),
                        r && (r[1] || !t))
                    )
                        if (r[1]) {
                            if (
                                ((t = t instanceof S ? t[0] : t),
                                S.merge(
                                    this,
                                    S.parseHTML(
                                        r[1],
                                        t && t.nodeType ? t.ownerDocument || t : g,
                                        !0,
                                    ),
                                ),
                                oe.test(r[1]) && S.isPlainObject(t))
                            )
                                for (r in t) m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                            return this;
                        } else
                            return (
                                (i = g.getElementById(r[2])),
                                i && ((this[0] = i), (this.length = 1)),
                                this
                            );
                    else if (!t || t.jquery) return (t || n).find(e);
                    else return this.constructor(t).find(e);
                else if (e.nodeType) return ((this[0] = e), (this.length = 1), this);
                else if (m(e)) return n.ready === void 0 ? e(S) : n.ready(e);
                return S.makeArray(e, this);
            });
        ((ue.prototype = S.fn), (ce = S(g)));
        var de = /^(?:parents|prev(?:Until|All))/,
            fe = {children: !0, contents: !0, next: !0, prev: !0};
        S.fn.extend({
            has: function (e) {
                var t = S(e, this),
                    n = t.length;
                return this.filter(function () {
                    for (var e = 0; e < n; e++) if (S.contains(this, t[e])) return !0;
                });
            },
            closest: function (e, t) {
                var n,
                    r = 0,
                    i = this.length,
                    a = [],
                    o = typeof e != `string` && S(e);
                if (!ae.test(e)) {
                    for (; r < i; r++)
                        for (n = this[r]; n && n !== t; n = n.parentNode)
                            if (
                                n.nodeType < 11 &&
                                (o
                                    ? o.index(n) > -1
                                    : n.nodeType === 1 && S.find.matchesSelector(n, e))
                            ) {
                                a.push(n);
                                break;
                            }
                }
                return this.pushStack(a.length > 1 ? S.uniqueSort(a) : a);
            },
            index: function (e) {
                return e
                    ? typeof e == `string`
                        ? s.call(S(e), this[0])
                        : s.call(this, e.jquery ? e[0] : e)
                    : this[0] && this[0].parentNode
                      ? this.first().prevAll().length
                      : -1;
            },
            add: function (e, t) {
                return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))));
            },
            addBack: function (e) {
                return this.add(e == null ? this.prevObject : this.prevObject.filter(e));
            },
        });
        function pe(e, t) {
            for (; (e = e[t]) && e.nodeType !== 1; );
            return e;
        }
        S.each(
            {
                parent: function (e) {
                    var t = e.parentNode;
                    return t && t.nodeType !== 11 ? t : null;
                },
                parents: function (e) {
                    return A(e, `parentNode`);
                },
                parentsUntil: function (e, t, n) {
                    return A(e, `parentNode`, n);
                },
                next: function (e) {
                    return pe(e, `nextSibling`);
                },
                prev: function (e) {
                    return pe(e, `previousSibling`);
                },
                nextAll: function (e) {
                    return A(e, `nextSibling`);
                },
                prevAll: function (e) {
                    return A(e, `previousSibling`);
                },
                nextUntil: function (e, t, n) {
                    return A(e, `nextSibling`, n);
                },
                prevUntil: function (e, t, n) {
                    return A(e, `previousSibling`, n);
                },
                siblings: function (e) {
                    return ie((e.parentNode || {}).firstChild, e);
                },
                children: function (e) {
                    return ie(e.firstChild);
                },
                contents: function (e) {
                    return e.contentDocument != null && r(e.contentDocument)
                        ? e.contentDocument
                        : (w(e, `template`) && (e = e.content || e), S.merge([], e.childNodes));
                },
            },
            function (e, t) {
                S.fn[e] = function (n, r) {
                    var i = S.map(this, t, n);
                    return (
                        e.slice(-5) !== `Until` && (r = n),
                        r && typeof r == `string` && (i = S.filter(r, i)),
                        this.length > 1 && (fe[e] || S.uniqueSort(i), de.test(e) && i.reverse()),
                        this.pushStack(i)
                    );
                };
            },
        );
        var j = /[^\x20\t\r\n\f]+/g;
        function me(e) {
            var t = {};
            return (
                S.each(e.match(j) || [], function (e, n) {
                    t[n] = !0;
                }),
                t
            );
        }
        S.Callbacks = function (e) {
            e = typeof e == `string` ? me(e) : S.extend({}, e);
            var t,
                n,
                r,
                i,
                a = [],
                o = [],
                s = -1,
                c = function () {
                    for (i ||= e.once, r = t = !0; o.length; s = -1)
                        for (n = o.shift(); ++s < a.length; )
                            a[s].apply(n[0], n[1]) === !1 &&
                                e.stopOnFalse &&
                                ((s = a.length), (n = !1));
                    (e.memory || (n = !1), (t = !1), i && (a = n ? [] : ``));
                },
                l = {
                    add: function () {
                        return (
                            a &&
                                (n && !t && ((s = a.length - 1), o.push(n)),
                                (function t(n) {
                                    S.each(n, function (n, r) {
                                        m(r)
                                            ? (!e.unique || !l.has(r)) && a.push(r)
                                            : r && r.length && y(r) !== `string` && t(r);
                                    });
                                })(arguments),
                                n && !t && c()),
                            this
                        );
                    },
                    remove: function () {
                        return (
                            S.each(arguments, function (e, t) {
                                for (var n; (n = S.inArray(t, a, n)) > -1; )
                                    (a.splice(n, 1), n <= s && s--);
                            }),
                            this
                        );
                    },
                    has: function (e) {
                        return e ? S.inArray(e, a) > -1 : a.length > 0;
                    },
                    empty: function () {
                        return ((a &&= []), this);
                    },
                    disable: function () {
                        return ((i = o = []), (a = n = ``), this);
                    },
                    disabled: function () {
                        return !a;
                    },
                    lock: function () {
                        return ((i = o = []), !n && !t && (a = n = ``), this);
                    },
                    locked: function () {
                        return !!i;
                    },
                    fireWith: function (e, n) {
                        return (
                            i ||
                                ((n ||= []),
                                (n = [e, n.slice ? n.slice() : n]),
                                o.push(n),
                                t || c()),
                            this
                        );
                    },
                    fire: function () {
                        return (l.fireWith(this, arguments), this);
                    },
                    fired: function () {
                        return !!r;
                    },
                };
            return l;
        };
        function he(e) {
            return e;
        }
        function M(e) {
            throw e;
        }
        function N(e, t, n, r) {
            var i;
            try {
                e && m((i = e.promise))
                    ? i.call(e).done(t).fail(n)
                    : e && m((i = e.then))
                      ? i.call(e, t, n)
                      : t.apply(void 0, [e].slice(r));
            } catch (e) {
                n.apply(void 0, [e]);
            }
        }
        S.extend({
            Deferred: function (t) {
                var n = [
                        [`notify`, `progress`, S.Callbacks(`memory`), S.Callbacks(`memory`), 2],
                        [
                            `resolve`,
                            `done`,
                            S.Callbacks(`once memory`),
                            S.Callbacks(`once memory`),
                            0,
                            `resolved`,
                        ],
                        [
                            `reject`,
                            `fail`,
                            S.Callbacks(`once memory`),
                            S.Callbacks(`once memory`),
                            1,
                            `rejected`,
                        ],
                    ],
                    r = `pending`,
                    i = {
                        state: function () {
                            return r;
                        },
                        always: function () {
                            return (a.done(arguments).fail(arguments), this);
                        },
                        catch: function (e) {
                            return i.then(null, e);
                        },
                        pipe: function () {
                            var e = arguments;
                            return S.Deferred(function (t) {
                                (S.each(n, function (n, r) {
                                    var i = m(e[r[4]]) && e[r[4]];
                                    a[r[1]](function () {
                                        var e = i && i.apply(this, arguments);
                                        e && m(e.promise)
                                            ? e
                                                  .promise()
                                                  .progress(t.notify)
                                                  .done(t.resolve)
                                                  .fail(t.reject)
                                            : t[r[0] + `With`](this, i ? [e] : arguments);
                                    });
                                }),
                                    (e = null));
                            }).promise();
                        },
                        then: function (t, r, i) {
                            var a = 0;
                            function o(t, n, r, i) {
                                return function () {
                                    var s = this,
                                        c = arguments,
                                        l = function () {
                                            var e, l;
                                            if (!(t < a)) {
                                                if (((e = r.apply(s, c)), e === n.promise()))
                                                    throw TypeError(`Thenable self-resolution`);
                                                ((l =
                                                    e &&
                                                    (typeof e == `object` ||
                                                        typeof e == `function`) &&
                                                    e.then),
                                                    m(l)
                                                        ? i
                                                            ? l.call(
                                                                  e,
                                                                  o(a, n, he, i),
                                                                  o(a, n, M, i),
                                                              )
                                                            : (a++,
                                                              l.call(
                                                                  e,
                                                                  o(a, n, he, i),
                                                                  o(a, n, M, i),
                                                                  o(a, n, he, n.notifyWith),
                                                              ))
                                                        : (r !== he && ((s = void 0), (c = [e])),
                                                          (i || n.resolveWith)(s, c)));
                                            }
                                        },
                                        u = i
                                            ? l
                                            : function () {
                                                  try {
                                                      l();
                                                  } catch (e) {
                                                      (S.Deferred.exceptionHook &&
                                                          S.Deferred.exceptionHook(e, u.error),
                                                          t + 1 >= a &&
                                                              (r !== M && ((s = void 0), (c = [e])),
                                                              n.rejectWith(s, c)));
                                                  }
                                              };
                                    t
                                        ? u()
                                        : (S.Deferred.getErrorHook
                                              ? (u.error = S.Deferred.getErrorHook())
                                              : S.Deferred.getStackHook &&
                                                (u.error = S.Deferred.getStackHook()),
                                          e.setTimeout(u));
                                };
                            }
                            return S.Deferred(function (e) {
                                (n[0][3].add(o(0, e, m(i) ? i : he, e.notifyWith)),
                                    n[1][3].add(o(0, e, m(t) ? t : he)),
                                    n[2][3].add(o(0, e, m(r) ? r : M)));
                            }).promise();
                        },
                        promise: function (e) {
                            return e == null ? i : S.extend(e, i);
                        },
                    },
                    a = {};
                return (
                    S.each(n, function (e, t) {
                        var o = t[2],
                            s = t[5];
                        ((i[t[1]] = o.add),
                            s &&
                                o.add(
                                    function () {
                                        r = s;
                                    },
                                    n[3 - e][2].disable,
                                    n[3 - e][3].disable,
                                    n[0][2].lock,
                                    n[0][3].lock,
                                ),
                            o.add(t[3].fire),
                            (a[t[0]] = function () {
                                return (
                                    a[t[0] + `With`](this === a ? void 0 : this, arguments),
                                    this
                                );
                            }),
                            (a[t[0] + `With`] = o.fireWith));
                    }),
                    i.promise(a),
                    t && t.call(a, a),
                    a
                );
            },
            when: function (e) {
                var t = arguments.length,
                    n = t,
                    r = Array(n),
                    a = i.call(arguments),
                    o = S.Deferred(),
                    s = function (e) {
                        return function (n) {
                            ((r[e] = this),
                                (a[e] = arguments.length > 1 ? i.call(arguments) : n),
                                --t || o.resolveWith(r, a));
                        };
                    };
                if (
                    t <= 1 &&
                    (N(e, o.done(s(n)).resolve, o.reject, !t),
                    o.state() === `pending` || m(a[n] && a[n].then))
                )
                    return o.then();
                for (; n--; ) N(a[n], s(n), o.reject);
                return o.promise();
            },
        });
        var ge = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        ((S.Deferred.exceptionHook = function (t, n) {
            e.console &&
                e.console.warn &&
                t &&
                ge.test(t.name) &&
                e.console.warn(`jQuery.Deferred exception: ` + t.message, t.stack, n);
        }),
            (S.readyException = function (t) {
                e.setTimeout(function () {
                    throw t;
                });
            }));
        var _e = S.Deferred();
        ((S.fn.ready = function (e) {
            return (
                _e.then(e).catch(function (e) {
                    S.readyException(e);
                }),
                this
            );
        }),
            S.extend({
                isReady: !1,
                readyWait: 1,
                ready: function (e) {
                    (e === !0 ? --S.readyWait : S.isReady) ||
                        ((S.isReady = !0),
                        !(e !== !0 && --S.readyWait > 0) && _e.resolveWith(g, [S]));
                },
            }),
            (S.ready.then = _e.then));
        function ve() {
            (g.removeEventListener(`DOMContentLoaded`, ve),
                e.removeEventListener(`load`, ve),
                S.ready());
        }
        g.readyState === `complete` || (g.readyState !== `loading` && !g.documentElement.doScroll)
            ? e.setTimeout(S.ready)
            : (g.addEventListener(`DOMContentLoaded`, ve), e.addEventListener(`load`, ve));
        var P = function (e, t, n, r, i, a, o) {
                var s = 0,
                    c = e.length,
                    l = n == null;
                if (y(n) === `object`) for (s in ((i = !0), n)) P(e, t, s, n[s], !0, a, o);
                else if (
                    r !== void 0 &&
                    ((i = !0),
                    m(r) || (o = !0),
                    l &&
                        (o
                            ? (t.call(e, r), (t = null))
                            : ((l = t),
                              (t = function (e, t, n) {
                                  return l.call(S(e), n);
                              }))),
                    t)
                )
                    for (; s < c; s++) t(e[s], n, o ? r : r.call(e[s], s, t(e[s], n)));
                return i ? e : l ? t.call(e) : c ? t(e[0], n) : a;
            },
            F = /^-ms-/,
            ye = /-([a-z])/g;
        function I(e, t) {
            return t.toUpperCase();
        }
        function L(e) {
            return e.replace(F, `ms-`).replace(ye, I);
        }
        var be = function (e) {
            return e.nodeType === 1 || e.nodeType === 9 || !+e.nodeType;
        };
        function xe() {
            this.expando = S.expando + xe.uid++;
        }
        ((xe.uid = 1),
            (xe.prototype = {
                cache: function (e) {
                    var t = e[this.expando];
                    return (
                        t ||
                            ((t = {}),
                            be(e) &&
                                (e.nodeType
                                    ? (e[this.expando] = t)
                                    : Object.defineProperty(e, this.expando, {
                                          value: t,
                                          configurable: !0,
                                      }))),
                        t
                    );
                },
                set: function (e, t, n) {
                    var r,
                        i = this.cache(e);
                    if (typeof t == `string`) i[L(t)] = n;
                    else for (r in t) i[L(r)] = t[r];
                    return i;
                },
                get: function (e, t) {
                    return t === void 0 ? this.cache(e) : e[this.expando] && e[this.expando][L(t)];
                },
                access: function (e, t, n) {
                    return t === void 0 || (t && typeof t == `string` && n === void 0)
                        ? this.get(e, t)
                        : (this.set(e, t, n), n === void 0 ? t : n);
                },
                remove: function (e, t) {
                    var n,
                        r = e[this.expando];
                    if (r !== void 0) {
                        if (t !== void 0)
                            for (
                                Array.isArray(t)
                                    ? (t = t.map(L))
                                    : ((t = L(t)), (t = (t in r) ? [t] : t.match(j) || [])),
                                    n = t.length;
                                n--;

                            )
                                delete r[t[n]];
                        (t === void 0 || S.isEmptyObject(r)) &&
                            (e.nodeType ? (e[this.expando] = void 0) : delete e[this.expando]);
                    }
                },
                hasData: function (e) {
                    var t = e[this.expando];
                    return t !== void 0 && !S.isEmptyObject(t);
                },
            }));
        var R = new xe(),
            z = new xe(),
            Se = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Ce = /[A-Z]/g;
        function we(e) {
            return e === `true`
                ? !0
                : e === `false`
                  ? !1
                  : e === `null`
                    ? null
                    : e === +e + ``
                      ? +e
                      : Se.test(e)
                        ? JSON.parse(e)
                        : e;
        }
        function B(e, t, n) {
            var r;
            if (n === void 0 && e.nodeType === 1)
                if (
                    ((r = `data-` + t.replace(Ce, `-$&`).toLowerCase()),
                    (n = e.getAttribute(r)),
                    typeof n == `string`)
                ) {
                    try {
                        n = we(n);
                    } catch {}
                    z.set(e, t, n);
                } else n = void 0;
            return n;
        }
        (S.extend({
            hasData: function (e) {
                return z.hasData(e) || R.hasData(e);
            },
            data: function (e, t, n) {
                return z.access(e, t, n);
            },
            removeData: function (e, t) {
                z.remove(e, t);
            },
            _data: function (e, t, n) {
                return R.access(e, t, n);
            },
            _removeData: function (e, t) {
                R.remove(e, t);
            },
        }),
            S.fn.extend({
                data: function (e, t) {
                    var n,
                        r,
                        i,
                        a = this[0],
                        o = a && a.attributes;
                    if (e === void 0) {
                        if (
                            this.length &&
                            ((i = z.get(a)), a.nodeType === 1 && !R.get(a, `hasDataAttrs`))
                        ) {
                            for (n = o.length; n--; )
                                o[n] &&
                                    ((r = o[n].name),
                                    r.indexOf(`data-`) === 0 &&
                                        ((r = L(r.slice(5))), B(a, r, i[r])));
                            R.set(a, `hasDataAttrs`, !0);
                        }
                        return i;
                    }
                    return typeof e == `object`
                        ? this.each(function () {
                              z.set(this, e);
                          })
                        : P(
                              this,
                              function (t) {
                                  var n;
                                  if (a && t === void 0)
                                      return (
                                          (n = z.get(a, e)),
                                          n !== void 0 || ((n = B(a, e)), n !== void 0) ? n : void 0
                                      );
                                  this.each(function () {
                                      z.set(this, e, t);
                                  });
                              },
                              null,
                              t,
                              arguments.length > 1,
                              null,
                              !0,
                          );
                },
                removeData: function (e) {
                    return this.each(function () {
                        z.remove(this, e);
                    });
                },
            }),
            S.extend({
                queue: function (e, t, n) {
                    var r;
                    if (e)
                        return (
                            (t = (t || `fx`) + `queue`),
                            (r = R.get(e, t)),
                            n &&
                                (!r || Array.isArray(n)
                                    ? (r = R.access(e, t, S.makeArray(n)))
                                    : r.push(n)),
                            r || []
                        );
                },
                dequeue: function (e, t) {
                    t ||= `fx`;
                    var n = S.queue(e, t),
                        r = n.length,
                        i = n.shift(),
                        a = S._queueHooks(e, t);
                    (i === `inprogress` && ((i = n.shift()), r--),
                        i &&
                            (t === `fx` && n.unshift(`inprogress`),
                            delete a.stop,
                            i.call(
                                e,
                                function () {
                                    S.dequeue(e, t);
                                },
                                a,
                            )),
                        !r && a && a.empty.fire());
                },
                _queueHooks: function (e, t) {
                    var n = t + `queueHooks`;
                    return (
                        R.get(e, n) ||
                        R.access(e, n, {
                            empty: S.Callbacks(`once memory`).add(function () {
                                R.remove(e, [t + `queue`, n]);
                            }),
                        })
                    );
                },
            }),
            S.fn.extend({
                queue: function (e, t) {
                    var n = 2;
                    return (
                        typeof e != `string` && ((t = e), (e = `fx`), n--),
                        arguments.length < n
                            ? S.queue(this[0], e)
                            : t === void 0
                              ? this
                              : this.each(function () {
                                    var n = S.queue(this, e, t);
                                    (S._queueHooks(this, e),
                                        e === `fx` && n[0] !== `inprogress` && S.dequeue(this, e));
                                })
                    );
                },
                dequeue: function (e) {
                    return this.each(function () {
                        S.dequeue(this, e);
                    });
                },
                clearQueue: function (e) {
                    return this.queue(e || `fx`, []);
                },
                promise: function (e, t) {
                    var n,
                        r = 1,
                        i = S.Deferred(),
                        a = this,
                        o = this.length,
                        s = function () {
                            --r || i.resolveWith(a, [a]);
                        };
                    for (typeof e != `string` && ((t = e), (e = void 0)), e ||= `fx`; o--; )
                        ((n = R.get(a[o], e + `queueHooks`)),
                            n && n.empty && (r++, n.empty.add(s)));
                    return (s(), i.promise(t));
                },
            }));
        var V = `[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)`,
            Te = RegExp(`^(?:([+-])=|)(` + V + `)([a-z%]*)$`, `i`),
            H = [`Top`, `Right`, `Bottom`, `Left`],
            Ee = g.documentElement,
            De = function (e) {
                return S.contains(e.ownerDocument, e);
            },
            Oe = {composed: !0};
        Ee.getRootNode &&
            (De = function (e) {
                return S.contains(e.ownerDocument, e) || e.getRootNode(Oe) === e.ownerDocument;
            });
        var U = function (e, t) {
            return (
                (e = t || e),
                e.style.display === `none` ||
                    (e.style.display === `` && De(e) && S.css(e, `display`) === `none`)
            );
        };
        function ke(e, t, n, r) {
            var i,
                a,
                o = 20,
                s = r
                    ? function () {
                          return r.cur();
                      }
                    : function () {
                          return S.css(e, t, ``);
                      },
                c = s(),
                l = (n && n[3]) || (S.cssNumber[t] ? `` : `px`),
                u = e.nodeType && (S.cssNumber[t] || (l !== `px` && +c)) && Te.exec(S.css(e, t));
            if (u && u[3] !== l) {
                for (c /= 2, l ||= u[3], u = +c || 1; o--; )
                    (S.style(e, t, u + l),
                        (1 - a) * (1 - (a = s() / c || 0.5)) <= 0 && (o = 0),
                        (u /= a));
                ((u *= 2), S.style(e, t, u + l), (n ||= []));
            }
            return (
                n &&
                    ((u = +u || +c || 0),
                    (i = n[1] ? u + (n[1] + 1) * n[2] : +n[2]),
                    r && ((r.unit = l), (r.start = u), (r.end = i))),
                i
            );
        }
        var Ae = {};
        function je(e) {
            var t,
                n = e.ownerDocument,
                r = e.nodeName,
                i = Ae[r];
            return (
                i ||
                ((t = n.body.appendChild(n.createElement(r))),
                (i = S.css(t, `display`)),
                t.parentNode.removeChild(t),
                i === `none` && (i = `block`),
                (Ae[r] = i),
                i)
            );
        }
        function Me(e, t) {
            for (var n, r, i = [], a = 0, o = e.length; a < o; a++)
                ((r = e[a]),
                    r.style &&
                        ((n = r.style.display),
                        t
                            ? (n === `none` &&
                                  ((i[a] = R.get(r, `display`) || null),
                                  i[a] || (r.style.display = ``)),
                              r.style.display === `` && U(r) && (i[a] = je(r)))
                            : n !== `none` && ((i[a] = `none`), R.set(r, `display`, n))));
            for (a = 0; a < o; a++) i[a] != null && (e[a].style.display = i[a]);
            return e;
        }
        S.fn.extend({
            show: function () {
                return Me(this, !0);
            },
            hide: function () {
                return Me(this);
            },
            toggle: function (e) {
                return typeof e == `boolean`
                    ? e
                        ? this.show()
                        : this.hide()
                    : this.each(function () {
                          U(this) ? S(this).show() : S(this).hide();
                      });
            },
        });
        var Ne = /^(?:checkbox|radio)$/i,
            Pe = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
            Fe = /^$|^module$|\/(?:java|ecma)script/i;
        (function () {
            var e = g.createDocumentFragment().appendChild(g.createElement(`div`)),
                t = g.createElement(`input`);
            (t.setAttribute(`type`, `radio`),
                t.setAttribute(`checked`, `checked`),
                t.setAttribute(`name`, `t`),
                e.appendChild(t),
                (p.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked),
                (e.innerHTML = `<textarea>x</textarea>`),
                (p.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue),
                (e.innerHTML = `<option></option>`),
                (p.option = !!e.lastChild));
        })();
        var W = {
            thead: [1, `<table>`, `</table>`],
            col: [2, `<table><colgroup>`, `</colgroup></table>`],
            tr: [2, `<table><tbody>`, `</tbody></table>`],
            td: [3, `<table><tbody><tr>`, `</tr></tbody></table>`],
            _default: [0, ``, ``],
        };
        ((W.tbody = W.tfoot = W.colgroup = W.caption = W.thead),
            (W.th = W.td),
            p.option || (W.optgroup = W.option = [1, `<select multiple='multiple'>`, `</select>`]));
        function G(e, t) {
            var n =
                e.getElementsByTagName === void 0
                    ? e.querySelectorAll === void 0
                        ? []
                        : e.querySelectorAll(t || `*`)
                    : e.getElementsByTagName(t || `*`);
            return t === void 0 || (t && w(e, t)) ? S.merge([e], n) : n;
        }
        function Ie(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                R.set(e[n], `globalEval`, !t || R.get(t[n], `globalEval`));
        }
        var Le = /<|&#?\w+;/;
        function Re(e, t, n, r, i) {
            for (
                var a, o, s, c, l, u, d = t.createDocumentFragment(), f = [], p = 0, m = e.length;
                p < m;
                p++
            )
                if (((a = e[p]), a || a === 0))
                    if (y(a) === `object`) S.merge(f, a.nodeType ? [a] : a);
                    else if (!Le.test(a)) f.push(t.createTextNode(a));
                    else {
                        for (
                            o ||= d.appendChild(t.createElement(`div`)),
                                s = (Pe.exec(a) || [``, ``])[1].toLowerCase(),
                                c = W[s] || W._default,
                                o.innerHTML = c[1] + S.htmlPrefilter(a) + c[2],
                                u = c[0];
                            u--;

                        )
                            o = o.lastChild;
                        (S.merge(f, o.childNodes), (o = d.firstChild), (o.textContent = ``));
                    }
            for (d.textContent = ``, p = 0; (a = f[p++]); ) {
                if (r && S.inArray(a, r) > -1) {
                    i && i.push(a);
                    continue;
                }
                if (((l = De(a)), (o = G(d.appendChild(a), `script`)), l && Ie(o), n))
                    for (u = 0; (a = o[u++]); ) Fe.test(a.type || ``) && n.push(a);
            }
            return d;
        }
        var ze = /^([^.]*)(?:\.(.+)|)/;
        function Be() {
            return !0;
        }
        function Ve() {
            return !1;
        }
        function He(e, t, n, r, i, a) {
            var o, s;
            if (typeof t == `object`) {
                for (s in (typeof n != `string` && ((r ||= n), (n = void 0)), t))
                    He(e, s, n, r, t[s], a);
                return e;
            }
            if (
                (r == null && i == null
                    ? ((i = n), (r = n = void 0))
                    : (i ??
                      (typeof n == `string`
                          ? ((i = r), (r = void 0))
                          : ((i = r), (r = n), (n = void 0)))),
                i === !1)
            )
                i = Ve;
            else if (!i) return e;
            return (
                a === 1 &&
                    ((o = i),
                    (i = function (e) {
                        return (S().off(e), o.apply(this, arguments));
                    }),
                    (i.guid = o.guid ||= S.guid++)),
                e.each(function () {
                    S.event.add(this, t, i, r, n);
                })
            );
        }
        S.event = {
            global: {},
            add: function (e, t, n, r, i) {
                var a,
                    o,
                    s,
                    c,
                    l,
                    u,
                    d,
                    f,
                    p,
                    m,
                    h,
                    g = R.get(e);
                if (be(e))
                    for (
                        n.handler && ((a = n), (n = a.handler), (i = a.selector)),
                            i && S.find.matchesSelector(Ee, i),
                            n.guid ||= S.guid++,
                            (c = g.events) || (c = g.events = Object.create(null)),
                            (o = g.handle) ||
                                (o = g.handle =
                                    function (t) {
                                        return S !== void 0 && S.event.triggered !== t.type
                                            ? S.event.dispatch.apply(e, arguments)
                                            : void 0;
                                    }),
                            t = (t || ``).match(j) || [``],
                            l = t.length;
                        l--;

                    )
                        ((s = ze.exec(t[l]) || []),
                            (p = h = s[1]),
                            (m = (s[2] || ``).split(`.`).sort()),
                            p &&
                                ((d = S.event.special[p] || {}),
                                (p = (i ? d.delegateType : d.bindType) || p),
                                (d = S.event.special[p] || {}),
                                (u = S.extend(
                                    {
                                        type: p,
                                        origType: h,
                                        data: r,
                                        handler: n,
                                        guid: n.guid,
                                        selector: i,
                                        needsContext: i && S.expr.match.needsContext.test(i),
                                        namespace: m.join(`.`),
                                    },
                                    a,
                                )),
                                (f = c[p]) ||
                                    ((f = c[p] = []),
                                    (f.delegateCount = 0),
                                    (!d.setup || d.setup.call(e, r, m, o) === !1) &&
                                        e.addEventListener &&
                                        e.addEventListener(p, o)),
                                d.add &&
                                    (d.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)),
                                i ? f.splice(f.delegateCount++, 0, u) : f.push(u),
                                (S.event.global[p] = !0)));
            },
            remove: function (e, t, n, r, i) {
                var a,
                    o,
                    s,
                    c,
                    l,
                    u,
                    d,
                    f,
                    p,
                    m,
                    h,
                    g = R.hasData(e) && R.get(e);
                if (!(!g || !(c = g.events))) {
                    for (t = (t || ``).match(j) || [``], l = t.length; l--; ) {
                        if (
                            ((s = ze.exec(t[l]) || []),
                            (p = h = s[1]),
                            (m = (s[2] || ``).split(`.`).sort()),
                            !p)
                        ) {
                            for (p in c) S.event.remove(e, p + t[l], n, r, !0);
                            continue;
                        }
                        for (
                            d = S.event.special[p] || {},
                                p = (r ? d.delegateType : d.bindType) || p,
                                f = c[p] || [],
                                s = s[2] && RegExp(`(^|\\.)` + m.join(`\\.(?:.*\\.|)`) + `(\\.|$)`),
                                o = a = f.length;
                            a--;

                        )
                            ((u = f[a]),
                                (i || h === u.origType) &&
                                    (!n || n.guid === u.guid) &&
                                    (!s || s.test(u.namespace)) &&
                                    (!r || r === u.selector || (r === `**` && u.selector)) &&
                                    (f.splice(a, 1),
                                    u.selector && f.delegateCount--,
                                    d.remove && d.remove.call(e, u)));
                        o &&
                            !f.length &&
                            ((!d.teardown || d.teardown.call(e, m, g.handle) === !1) &&
                                S.removeEvent(e, p, g.handle),
                            delete c[p]);
                    }
                    S.isEmptyObject(c) && R.remove(e, `handle events`);
                }
            },
            dispatch: function (e) {
                var t,
                    n,
                    r,
                    i,
                    a,
                    o,
                    s = Array(arguments.length),
                    c = S.event.fix(e),
                    l = (R.get(this, `events`) || Object.create(null))[c.type] || [],
                    u = S.event.special[c.type] || {};
                for (s[0] = c, t = 1; t < arguments.length; t++) s[t] = arguments[t];
                if (
                    ((c.delegateTarget = this),
                    !(u.preDispatch && u.preDispatch.call(this, c) === !1))
                ) {
                    for (
                        o = S.event.handlers.call(this, c, l), t = 0;
                        (i = o[t++]) && !c.isPropagationStopped();

                    )
                        for (
                            c.currentTarget = i.elem, n = 0;
                            (a = i.handlers[n++]) && !c.isImmediatePropagationStopped();

                        )
                            (!c.rnamespace ||
                                a.namespace === !1 ||
                                c.rnamespace.test(a.namespace)) &&
                                ((c.handleObj = a),
                                (c.data = a.data),
                                (r = (
                                    (S.event.special[a.origType] || {}).handle || a.handler
                                ).apply(i.elem, s)),
                                r !== void 0 &&
                                    (c.result = r) === !1 &&
                                    (c.preventDefault(), c.stopPropagation()));
                    return (u.postDispatch && u.postDispatch.call(this, c), c.result);
                }
            },
            handlers: function (e, t) {
                var n,
                    r,
                    i,
                    a,
                    o,
                    s = [],
                    c = t.delegateCount,
                    l = e.target;
                if (c && l.nodeType && !(e.type === `click` && e.button >= 1)) {
                    for (; l !== this; l = l.parentNode || this)
                        if (l.nodeType === 1 && !(e.type === `click` && l.disabled === !0)) {
                            for (a = [], o = {}, n = 0; n < c; n++)
                                ((r = t[n]),
                                    (i = r.selector + ` `),
                                    o[i] === void 0 &&
                                        (o[i] = r.needsContext
                                            ? S(i, this).index(l) > -1
                                            : S.find(i, this, null, [l]).length),
                                    o[i] && a.push(r));
                            a.length && s.push({elem: l, handlers: a});
                        }
                }
                return ((l = this), c < t.length && s.push({elem: l, handlers: t.slice(c)}), s);
            },
            addProp: function (e, t) {
                Object.defineProperty(S.Event.prototype, e, {
                    enumerable: !0,
                    configurable: !0,
                    get: m(t)
                        ? function () {
                              if (this.originalEvent) return t(this.originalEvent);
                          }
                        : function () {
                              if (this.originalEvent) return this.originalEvent[e];
                          },
                    set: function (t) {
                        Object.defineProperty(this, e, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: t,
                        });
                    },
                });
            },
            fix: function (e) {
                return e[S.expando] ? e : new S.Event(e);
            },
            special: {
                load: {noBubble: !0},
                click: {
                    setup: function (e) {
                        var t = this || e;
                        return (
                            Ne.test(t.type) && t.click && w(t, `input`) && Ue(t, `click`, !0),
                            !1
                        );
                    },
                    trigger: function (e) {
                        var t = this || e;
                        return (Ne.test(t.type) && t.click && w(t, `input`) && Ue(t, `click`), !0);
                    },
                    _default: function (e) {
                        var t = e.target;
                        return (
                            (Ne.test(t.type) && t.click && w(t, `input`) && R.get(t, `click`)) ||
                            w(t, `a`)
                        );
                    },
                },
                beforeunload: {
                    postDispatch: function (e) {
                        e.result !== void 0 &&
                            e.originalEvent &&
                            (e.originalEvent.returnValue = e.result);
                    },
                },
            },
        };
        function Ue(e, t, n) {
            if (!n) {
                R.get(e, t) === void 0 && S.event.add(e, t, Be);
                return;
            }
            (R.set(e, t, !1),
                S.event.add(e, t, {
                    namespace: !1,
                    handler: function (e) {
                        var n,
                            r = R.get(this, t);
                        if (e.isTrigger & 1 && this[t]) {
                            if (r) (S.event.special[t] || {}).delegateType && e.stopPropagation();
                            else if (
                                ((r = i.call(arguments)),
                                R.set(this, t, r),
                                this[t](),
                                (n = R.get(this, t)),
                                R.set(this, t, !1),
                                r !== n)
                            )
                                return (e.stopImmediatePropagation(), e.preventDefault(), n);
                        } else
                            r &&
                                (R.set(this, t, S.event.trigger(r[0], r.slice(1), this)),
                                e.stopPropagation(),
                                (e.isImmediatePropagationStopped = Be));
                    },
                }));
        }
        ((S.removeEvent = function (e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n);
        }),
            (S.Event = function (e, t) {
                if (!(this instanceof S.Event)) return new S.Event(e, t);
                (e && e.type
                    ? ((this.originalEvent = e),
                      (this.type = e.type),
                      (this.isDefaultPrevented =
                          e.defaultPrevented ||
                          (e.defaultPrevented === void 0 && e.returnValue === !1)
                              ? Be
                              : Ve),
                      (this.target =
                          e.target && e.target.nodeType === 3 ? e.target.parentNode : e.target),
                      (this.currentTarget = e.currentTarget),
                      (this.relatedTarget = e.relatedTarget))
                    : (this.type = e),
                    t && S.extend(this, t),
                    (this.timeStamp = (e && e.timeStamp) || Date.now()),
                    (this[S.expando] = !0));
            }),
            (S.Event.prototype = {
                constructor: S.Event,
                isDefaultPrevented: Ve,
                isPropagationStopped: Ve,
                isImmediatePropagationStopped: Ve,
                isSimulated: !1,
                preventDefault: function () {
                    var e = this.originalEvent;
                    ((this.isDefaultPrevented = Be), e && !this.isSimulated && e.preventDefault());
                },
                stopPropagation: function () {
                    var e = this.originalEvent;
                    ((this.isPropagationStopped = Be),
                        e && !this.isSimulated && e.stopPropagation());
                },
                stopImmediatePropagation: function () {
                    var e = this.originalEvent;
                    ((this.isImmediatePropagationStopped = Be),
                        e && !this.isSimulated && e.stopImmediatePropagation(),
                        this.stopPropagation());
                },
            }),
            S.each(
                {
                    altKey: !0,
                    bubbles: !0,
                    cancelable: !0,
                    changedTouches: !0,
                    ctrlKey: !0,
                    detail: !0,
                    eventPhase: !0,
                    metaKey: !0,
                    pageX: !0,
                    pageY: !0,
                    shiftKey: !0,
                    view: !0,
                    char: !0,
                    code: !0,
                    charCode: !0,
                    key: !0,
                    keyCode: !0,
                    button: !0,
                    buttons: !0,
                    clientX: !0,
                    clientY: !0,
                    offsetX: !0,
                    offsetY: !0,
                    pointerId: !0,
                    pointerType: !0,
                    screenX: !0,
                    screenY: !0,
                    targetTouches: !0,
                    toElement: !0,
                    touches: !0,
                    which: !0,
                },
                S.event.addProp,
            ),
            S.each({focus: `focusin`, blur: `focusout`}, function (e, t) {
                function n(e) {
                    if (g.documentMode) {
                        var n = R.get(this, `handle`),
                            r = S.event.fix(e);
                        ((r.type = e.type === `focusin` ? `focus` : `blur`),
                            (r.isSimulated = !0),
                            n(e),
                            r.target === r.currentTarget && n(r));
                    } else S.event.simulate(t, e.target, S.event.fix(e));
                }
                ((S.event.special[e] = {
                    setup: function () {
                        var r;
                        if ((Ue(this, e, !0), g.documentMode))
                            ((r = R.get(this, t)),
                                r || this.addEventListener(t, n),
                                R.set(this, t, (r || 0) + 1));
                        else return !1;
                    },
                    trigger: function () {
                        return (Ue(this, e), !0);
                    },
                    teardown: function () {
                        var e;
                        if (g.documentMode)
                            ((e = R.get(this, t) - 1),
                                e
                                    ? R.set(this, t, e)
                                    : (this.removeEventListener(t, n), R.remove(this, t)));
                        else return !1;
                    },
                    _default: function (t) {
                        return R.get(t.target, e);
                    },
                    delegateType: t,
                }),
                    (S.event.special[t] = {
                        setup: function () {
                            var r = this.ownerDocument || this.document || this,
                                i = g.documentMode ? this : r,
                                a = R.get(i, t);
                            (a ||
                                (g.documentMode
                                    ? this.addEventListener(t, n)
                                    : r.addEventListener(e, n, !0)),
                                R.set(i, t, (a || 0) + 1));
                        },
                        teardown: function () {
                            var r = this.ownerDocument || this.document || this,
                                i = g.documentMode ? this : r,
                                a = R.get(i, t) - 1;
                            a
                                ? R.set(i, t, a)
                                : (g.documentMode
                                      ? this.removeEventListener(t, n)
                                      : r.removeEventListener(e, n, !0),
                                  R.remove(i, t));
                        },
                    }));
            }),
            S.each(
                {
                    mouseenter: `mouseover`,
                    mouseleave: `mouseout`,
                    pointerenter: `pointerover`,
                    pointerleave: `pointerout`,
                },
                function (e, t) {
                    S.event.special[e] = {
                        delegateType: t,
                        bindType: t,
                        handle: function (e) {
                            var n,
                                r = this,
                                i = e.relatedTarget,
                                a = e.handleObj;
                            return (
                                (!i || (i !== r && !S.contains(r, i))) &&
                                    ((e.type = a.origType),
                                    (n = a.handler.apply(this, arguments)),
                                    (e.type = t)),
                                n
                            );
                        },
                    };
                },
            ),
            S.fn.extend({
                on: function (e, t, n, r) {
                    return He(this, e, t, n, r);
                },
                one: function (e, t, n, r) {
                    return He(this, e, t, n, r, 1);
                },
                off: function (e, t, n) {
                    var r, i;
                    if (e && e.preventDefault && e.handleObj)
                        return (
                            (r = e.handleObj),
                            S(e.delegateTarget).off(
                                r.namespace ? r.origType + `.` + r.namespace : r.origType,
                                r.selector,
                                r.handler,
                            ),
                            this
                        );
                    if (typeof e == `object`) {
                        for (i in e) this.off(i, t, e[i]);
                        return this;
                    }
                    return (
                        (t === !1 || typeof t == `function`) && ((n = t), (t = void 0)),
                        n === !1 && (n = Ve),
                        this.each(function () {
                            S.event.remove(this, e, n, t);
                        })
                    );
                },
            }));
        var We = /<script|<style|<link/i,
            Ge = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Ke = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
        function qe(e, t) {
            return (
                (w(e, `table`) &&
                    w(t.nodeType === 11 ? t.firstChild : t, `tr`) &&
                    S(e).children(`tbody`)[0]) ||
                e
            );
        }
        function Je(e) {
            return ((e.type = (e.getAttribute(`type`) !== null) + `/` + e.type), e);
        }
        function Ye(e) {
            return (
                (e.type || ``).slice(0, 5) === `true/`
                    ? (e.type = e.type.slice(5))
                    : e.removeAttribute(`type`),
                e
            );
        }
        function Xe(e, t) {
            var n, r, i, a, o, s, c;
            if (t.nodeType === 1) {
                if (R.hasData(e) && ((a = R.get(e)), (c = a.events), c))
                    for (i in (R.remove(t, `handle events`), c))
                        for (n = 0, r = c[i].length; n < r; n++) S.event.add(t, i, c[i][n]);
                z.hasData(e) && ((o = z.access(e)), (s = S.extend({}, o)), z.set(t, s));
            }
        }
        function Ze(e, t) {
            var n = t.nodeName.toLowerCase();
            n === `input` && Ne.test(e.type)
                ? (t.checked = e.checked)
                : (n === `input` || n === `textarea`) && (t.defaultValue = e.defaultValue);
        }
        function Qe(e, t, n, r) {
            t = a(t);
            var i,
                o,
                s,
                c,
                l,
                u,
                d = 0,
                f = e.length,
                h = f - 1,
                g = t[0],
                _ = m(g);
            if (_ || (f > 1 && typeof g == `string` && !p.checkClone && Ge.test(g)))
                return e.each(function (i) {
                    var a = e.eq(i);
                    (_ && (t[0] = g.call(this, i, a.html())), Qe(a, t, n, r));
                });
            if (
                f &&
                ((i = Re(t, e[0].ownerDocument, !1, e, r)),
                (o = i.firstChild),
                i.childNodes.length === 1 && (i = o),
                o || r)
            ) {
                for (s = S.map(G(i, `script`), Je), c = s.length; d < f; d++)
                    ((l = i),
                        d !== h && ((l = S.clone(l, !0, !0)), c && S.merge(s, G(l, `script`))),
                        n.call(e[d], l, d));
                if (c)
                    for (u = s[s.length - 1].ownerDocument, S.map(s, Ye), d = 0; d < c; d++)
                        ((l = s[d]),
                            Fe.test(l.type || ``) &&
                                !R.access(l, `globalEval`) &&
                                S.contains(u, l) &&
                                (l.src && (l.type || ``).toLowerCase() !== `module`
                                    ? S._evalUrl &&
                                      !l.noModule &&
                                      S._evalUrl(
                                          l.src,
                                          {nonce: l.nonce || l.getAttribute(`nonce`)},
                                          u,
                                      )
                                    : v(l.textContent.replace(Ke, ``), l, u)));
            }
            return e;
        }
        function $e(e, t, n) {
            for (var r, i = t ? S.filter(t, e) : e, a = 0; (r = i[a]) != null; a++)
                (!n && r.nodeType === 1 && S.cleanData(G(r)),
                    r.parentNode &&
                        (n && De(r) && Ie(G(r, `script`)), r.parentNode.removeChild(r)));
            return e;
        }
        (S.extend({
            htmlPrefilter: function (e) {
                return e;
            },
            clone: function (e, t, n) {
                var r,
                    i,
                    a,
                    o,
                    s = e.cloneNode(!0),
                    c = De(e);
                if (!p.noCloneChecked && (e.nodeType === 1 || e.nodeType === 11) && !S.isXMLDoc(e))
                    for (o = G(s), a = G(e), r = 0, i = a.length; r < i; r++) Ze(a[r], o[r]);
                if (t)
                    if (n)
                        for (a ||= G(e), o ||= G(s), r = 0, i = a.length; r < i; r++)
                            Xe(a[r], o[r]);
                    else Xe(e, s);
                return ((o = G(s, `script`)), o.length > 0 && Ie(o, !c && G(e, `script`)), s);
            },
            cleanData: function (e) {
                for (var t, n, r, i = S.event.special, a = 0; (n = e[a]) !== void 0; a++)
                    if (be(n)) {
                        if ((t = n[R.expando])) {
                            if (t.events)
                                for (r in t.events)
                                    i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
                            n[R.expando] = void 0;
                        }
                        n[z.expando] && (n[z.expando] = void 0);
                    }
            },
        }),
            S.fn.extend({
                detach: function (e) {
                    return $e(this, e, !0);
                },
                remove: function (e) {
                    return $e(this, e);
                },
                text: function (e) {
                    return P(
                        this,
                        function (e) {
                            return e === void 0
                                ? S.text(this)
                                : this.empty().each(function () {
                                      (this.nodeType === 1 ||
                                          this.nodeType === 11 ||
                                          this.nodeType === 9) &&
                                          (this.textContent = e);
                                  });
                        },
                        null,
                        e,
                        arguments.length,
                    );
                },
                append: function () {
                    return Qe(this, arguments, function (e) {
                        (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) &&
                            qe(this, e).appendChild(e);
                    });
                },
                prepend: function () {
                    return Qe(this, arguments, function (e) {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                            var t = qe(this, e);
                            t.insertBefore(e, t.firstChild);
                        }
                    });
                },
                before: function () {
                    return Qe(this, arguments, function (e) {
                        this.parentNode && this.parentNode.insertBefore(e, this);
                    });
                },
                after: function () {
                    return Qe(this, arguments, function (e) {
                        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
                    });
                },
                empty: function () {
                    for (var e, t = 0; (e = this[t]) != null; t++)
                        e.nodeType === 1 && (S.cleanData(G(e, !1)), (e.textContent = ``));
                    return this;
                },
                clone: function (e, t) {
                    return (
                        (e ??= !1),
                        (t ??= e),
                        this.map(function () {
                            return S.clone(this, e, t);
                        })
                    );
                },
                html: function (e) {
                    return P(
                        this,
                        function (e) {
                            var t = this[0] || {},
                                n = 0,
                                r = this.length;
                            if (e === void 0 && t.nodeType === 1) return t.innerHTML;
                            if (
                                typeof e == `string` &&
                                !We.test(e) &&
                                !W[(Pe.exec(e) || [``, ``])[1].toLowerCase()]
                            ) {
                                e = S.htmlPrefilter(e);
                                try {
                                    for (; n < r; n++)
                                        ((t = this[n] || {}),
                                            t.nodeType === 1 &&
                                                (S.cleanData(G(t, !1)), (t.innerHTML = e)));
                                    t = 0;
                                } catch {}
                            }
                            t && this.empty().append(e);
                        },
                        null,
                        e,
                        arguments.length,
                    );
                },
                replaceWith: function () {
                    var e = [];
                    return Qe(
                        this,
                        arguments,
                        function (t) {
                            var n = this.parentNode;
                            S.inArray(this, e) < 0 &&
                                (S.cleanData(G(this)), n && n.replaceChild(t, this));
                        },
                        e,
                    );
                },
            }),
            S.each(
                {
                    appendTo: `append`,
                    prependTo: `prepend`,
                    insertBefore: `before`,
                    insertAfter: `after`,
                    replaceAll: `replaceWith`,
                },
                function (e, t) {
                    S.fn[e] = function (e) {
                        for (var n, r = [], i = S(e), a = i.length - 1, s = 0; s <= a; s++)
                            ((n = s === a ? this : this.clone(!0)),
                                S(i[s])[t](n),
                                o.apply(r, n.get()));
                        return this.pushStack(r);
                    };
                },
            ));
        var et = RegExp(`^(` + V + `)(?!px)[a-z%]+$`, `i`),
            tt = /^--/,
            nt = function (t) {
                var n = t.ownerDocument.defaultView;
                return ((!n || !n.opener) && (n = e), n.getComputedStyle(t));
            },
            rt = function (e, t, n) {
                var r,
                    i,
                    a = {};
                for (i in t) ((a[i] = e.style[i]), (e.style[i] = t[i]));
                for (i in ((r = n.call(e)), t)) e.style[i] = a[i];
                return r;
            },
            K = new RegExp(H.join(`|`), `i`);
        (function () {
            function t() {
                if (u) {
                    ((l.style.cssText = `position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0`),
                        (u.style.cssText = `position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%`),
                        Ee.appendChild(l).appendChild(u));
                    var t = e.getComputedStyle(u);
                    ((r = t.top !== `1%`),
                        (c = n(t.marginLeft) === 12),
                        (u.style.right = `60%`),
                        (o = n(t.right) === 36),
                        (i = n(t.width) === 36),
                        (u.style.position = `absolute`),
                        (a = n(u.offsetWidth / 3) === 12),
                        Ee.removeChild(l),
                        (u = null));
                }
            }
            function n(e) {
                return Math.round(parseFloat(e));
            }
            var r,
                i,
                a,
                o,
                s,
                c,
                l = g.createElement(`div`),
                u = g.createElement(`div`);
            u.style &&
                ((u.style.backgroundClip = `content-box`),
                (u.cloneNode(!0).style.backgroundClip = ``),
                (p.clearCloneStyle = u.style.backgroundClip === `content-box`),
                S.extend(p, {
                    boxSizingReliable: function () {
                        return (t(), i);
                    },
                    pixelBoxStyles: function () {
                        return (t(), o);
                    },
                    pixelPosition: function () {
                        return (t(), r);
                    },
                    reliableMarginLeft: function () {
                        return (t(), c);
                    },
                    scrollboxSize: function () {
                        return (t(), a);
                    },
                    reliableTrDimensions: function () {
                        var t, n, r, i;
                        return (
                            s ??
                                ((t = g.createElement(`table`)),
                                (n = g.createElement(`tr`)),
                                (r = g.createElement(`div`)),
                                (t.style.cssText = `position:absolute;left:-11111px;border-collapse:separate`),
                                (n.style.cssText = `box-sizing:content-box;border:1px solid`),
                                (n.style.height = `1px`),
                                (r.style.height = `9px`),
                                (r.style.display = `block`),
                                Ee.appendChild(t).appendChild(n).appendChild(r),
                                (i = e.getComputedStyle(n)),
                                (s =
                                    parseInt(i.height, 10) +
                                        parseInt(i.borderTopWidth, 10) +
                                        parseInt(i.borderBottomWidth, 10) ===
                                    n.offsetHeight),
                                Ee.removeChild(t)),
                            s
                        );
                    },
                }));
        })();
        function it(e, t, n) {
            var r,
                i,
                a,
                o,
                s = tt.test(t),
                c = e.style;
            return (
                (n ||= nt(e)),
                n &&
                    ((o = n.getPropertyValue(t) || n[t]),
                    s && o && (o = o.replace(O, `$1`) || void 0),
                    o === `` && !De(e) && (o = S.style(e, t)),
                    !p.pixelBoxStyles() &&
                        et.test(o) &&
                        K.test(t) &&
                        ((r = c.width),
                        (i = c.minWidth),
                        (a = c.maxWidth),
                        (c.minWidth = c.maxWidth = c.width = o),
                        (o = n.width),
                        (c.width = r),
                        (c.minWidth = i),
                        (c.maxWidth = a))),
                o === void 0 ? o : o + ``
            );
        }
        function at(e, t) {
            return {
                get: function () {
                    if (e()) {
                        delete this.get;
                        return;
                    }
                    return (this.get = t).apply(this, arguments);
                },
            };
        }
        var ot = [`Webkit`, `Moz`, `ms`],
            st = g.createElement(`div`).style,
            ct = {};
        function lt(e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = ot.length; n--; )
                if (((e = ot[n] + t), e in st)) return e;
        }
        function ut(e) {
            return S.cssProps[e] || ct[e] || (e in st ? e : (ct[e] = lt(e) || e));
        }
        var dt = /^(none|table(?!-c[ea]).+)/,
            q = {position: `absolute`, visibility: `hidden`, display: `block`},
            ft = {letterSpacing: `0`, fontWeight: `400`};
        function pt(e, t, n) {
            var r = Te.exec(t);
            return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || `px`) : t;
        }
        function mt(e, t, n, r, i, a) {
            var o = t === `width` ? 1 : 0,
                s = 0,
                c = 0,
                l = 0;
            if (n === (r ? `border` : `content`)) return 0;
            for (; o < 4; o += 2)
                (n === `margin` && (l += S.css(e, n + H[o], !0, i)),
                    r
                        ? (n === `content` && (c -= S.css(e, `padding` + H[o], !0, i)),
                          n !== `margin` && (c -= S.css(e, `border` + H[o] + `Width`, !0, i)))
                        : ((c += S.css(e, `padding` + H[o], !0, i)),
                          n === `padding`
                              ? (s += S.css(e, `border` + H[o] + `Width`, !0, i))
                              : (c += S.css(e, `border` + H[o] + `Width`, !0, i))));
            return (
                !r &&
                    a >= 0 &&
                    (c +=
                        Math.max(
                            0,
                            Math.ceil(
                                e[`offset` + t[0].toUpperCase() + t.slice(1)] - a - c - s - 0.5,
                            ),
                        ) || 0),
                c + l
            );
        }
        function ht(e, t, n) {
            var r = nt(e),
                i = (!p.boxSizingReliable() || n) && S.css(e, `boxSizing`, !1, r) === `border-box`,
                a = i,
                o = it(e, t, r),
                s = `offset` + t[0].toUpperCase() + t.slice(1);
            if (et.test(o)) {
                if (!n) return o;
                o = `auto`;
            }
            return (
                ((!p.boxSizingReliable() && i) ||
                    (!p.reliableTrDimensions() && w(e, `tr`)) ||
                    o === `auto` ||
                    (!parseFloat(o) && S.css(e, `display`, !1, r) === `inline`)) &&
                    e.getClientRects().length &&
                    ((i = S.css(e, `boxSizing`, !1, r) === `border-box`),
                    (a = s in e),
                    a && (o = e[s])),
                (o = parseFloat(o) || 0),
                o + mt(e, t, n || (i ? `border` : `content`), a, r, o) + `px`
            );
        }
        (S.extend({
            cssHooks: {
                opacity: {
                    get: function (e, t) {
                        if (t) {
                            var n = it(e, `opacity`);
                            return n === `` ? `1` : n;
                        }
                    },
                },
            },
            cssNumber: {
                animationIterationCount: !0,
                aspectRatio: !0,
                borderImageSlice: !0,
                columnCount: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                gridArea: !0,
                gridColumn: !0,
                gridColumnEnd: !0,
                gridColumnStart: !0,
                gridRow: !0,
                gridRowEnd: !0,
                gridRowStart: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                scale: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0,
                fillOpacity: !0,
                floodOpacity: !0,
                stopOpacity: !0,
                strokeMiterlimit: !0,
                strokeOpacity: !0,
            },
            cssProps: {},
            style: function (e, t, n, r) {
                if (!(!e || e.nodeType === 3 || e.nodeType === 8 || !e.style)) {
                    var i,
                        a,
                        o,
                        s = L(t),
                        c = tt.test(t),
                        l = e.style;
                    if ((c || (t = ut(s)), (o = S.cssHooks[t] || S.cssHooks[s]), n !== void 0)) {
                        if (
                            ((a = typeof n),
                            a === `string` &&
                                (i = Te.exec(n)) &&
                                i[1] &&
                                ((n = ke(e, t, i)), (a = `number`)),
                            n == null || n !== n)
                        )
                            return;
                        (a === `number` && !c && (n += (i && i[3]) || (S.cssNumber[s] ? `` : `px`)),
                            !p.clearCloneStyle &&
                                n === `` &&
                                t.indexOf(`background`) === 0 &&
                                (l[t] = `inherit`),
                            (!o || !(`set` in o) || (n = o.set(e, n, r)) !== void 0) &&
                                (c ? l.setProperty(t, n) : (l[t] = n)));
                    } else return o && `get` in o && (i = o.get(e, !1, r)) !== void 0 ? i : l[t];
                }
            },
            css: function (e, t, n, r) {
                var i,
                    a,
                    o,
                    s = L(t);
                return (
                    tt.test(t) || (t = ut(s)),
                    (o = S.cssHooks[t] || S.cssHooks[s]),
                    o && `get` in o && (i = o.get(e, !0, n)),
                    i === void 0 && (i = it(e, t, r)),
                    i === `normal` && t in ft && (i = ft[t]),
                    n === `` || n ? ((a = parseFloat(i)), n === !0 || isFinite(a) ? a || 0 : i) : i
                );
            },
        }),
            S.each([`height`, `width`], function (e, t) {
                S.cssHooks[t] = {
                    get: function (e, n, r) {
                        if (n)
                            return dt.test(S.css(e, `display`)) &&
                                (!e.getClientRects().length || !e.getBoundingClientRect().width)
                                ? rt(e, q, function () {
                                      return ht(e, t, r);
                                  })
                                : ht(e, t, r);
                    },
                    set: function (e, n, r) {
                        var i,
                            a = nt(e),
                            o = !p.scrollboxSize() && a.position === `absolute`,
                            s = (o || r) && S.css(e, `boxSizing`, !1, a) === `border-box`,
                            c = r ? mt(e, t, r, s, a) : 0;
                        return (
                            s &&
                                o &&
                                (c -= Math.ceil(
                                    e[`offset` + t[0].toUpperCase() + t.slice(1)] -
                                        parseFloat(a[t]) -
                                        mt(e, t, `border`, !1, a) -
                                        0.5,
                                )),
                            c &&
                                (i = Te.exec(n)) &&
                                (i[3] || `px`) !== `px` &&
                                ((e.style[t] = n), (n = S.css(e, t))),
                            pt(e, n, c)
                        );
                    },
                };
            }),
            (S.cssHooks.marginLeft = at(p.reliableMarginLeft, function (e, t) {
                if (t)
                    return (
                        (parseFloat(it(e, `marginLeft`)) ||
                            e.getBoundingClientRect().left -
                                rt(e, {marginLeft: 0}, function () {
                                    return e.getBoundingClientRect().left;
                                })) + `px`
                    );
            })),
            S.each({margin: ``, padding: ``, border: `Width`}, function (e, t) {
                ((S.cssHooks[e + t] = {
                    expand: function (n) {
                        for (
                            var r = 0, i = {}, a = typeof n == `string` ? n.split(` `) : [n];
                            r < 4;
                            r++
                        )
                            i[e + H[r] + t] = a[r] || a[r - 2] || a[0];
                        return i;
                    },
                }),
                    e !== `margin` && (S.cssHooks[e + t].set = pt));
            }),
            S.fn.extend({
                css: function (e, t) {
                    return P(
                        this,
                        function (e, t, n) {
                            var r,
                                i,
                                a = {},
                                o = 0;
                            if (Array.isArray(t)) {
                                for (r = nt(e), i = t.length; o < i; o++)
                                    a[t[o]] = S.css(e, t[o], !1, r);
                                return a;
                            }
                            return n === void 0 ? S.css(e, t) : S.style(e, t, n);
                        },
                        e,
                        t,
                        arguments.length > 1,
                    );
                },
            }));
        function J(e, t, n, r, i) {
            return new J.prototype.init(e, t, n, r, i);
        }
        ((S.Tween = J),
            (J.prototype = {
                constructor: J,
                init: function (e, t, n, r, i, a) {
                    ((this.elem = e),
                        (this.prop = n),
                        (this.easing = i || S.easing._default),
                        (this.options = t),
                        (this.start = this.now = this.cur()),
                        (this.end = r),
                        (this.unit = a || (S.cssNumber[n] ? `` : `px`)));
                },
                cur: function () {
                    var e = J.propHooks[this.prop];
                    return e && e.get ? e.get(this) : J.propHooks._default.get(this);
                },
                run: function (e) {
                    var t,
                        n = J.propHooks[this.prop];
                    return (
                        this.options.duration
                            ? (this.pos = t =
                                  S.easing[this.easing](
                                      e,
                                      this.options.duration * e,
                                      0,
                                      1,
                                      this.options.duration,
                                  ))
                            : (this.pos = t = e),
                        (this.now = (this.end - this.start) * t + this.start),
                        this.options.step && this.options.step.call(this.elem, this.now, this),
                        n && n.set ? n.set(this) : J.propHooks._default.set(this),
                        this
                    );
                },
            }),
            (J.prototype.init.prototype = J.prototype),
            (J.propHooks = {
                _default: {
                    get: function (e) {
                        var t;
                        return e.elem.nodeType !== 1 ||
                            (e.elem[e.prop] != null && e.elem.style[e.prop] == null)
                            ? e.elem[e.prop]
                            : ((t = S.css(e.elem, e.prop, ``)), !t || t === `auto` ? 0 : t);
                    },
                    set: function (e) {
                        S.fx.step[e.prop]
                            ? S.fx.step[e.prop](e)
                            : e.elem.nodeType === 1 &&
                                (S.cssHooks[e.prop] || e.elem.style[ut(e.prop)] != null)
                              ? S.style(e.elem, e.prop, e.now + e.unit)
                              : (e.elem[e.prop] = e.now);
                    },
                },
            }),
            (J.propHooks.scrollTop = J.propHooks.scrollLeft =
                {
                    set: function (e) {
                        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
                    },
                }),
            (S.easing = {
                linear: function (e) {
                    return e;
                },
                swing: function (e) {
                    return 0.5 - Math.cos(e * Math.PI) / 2;
                },
                _default: `swing`,
            }),
            (S.fx = J.prototype.init),
            (S.fx.step = {}));
        var gt,
            _t,
            vt = /^(?:toggle|show|hide)$/,
            yt = /queueHooks$/;
        function bt() {
            _t &&
                (g.hidden === !1 && e.requestAnimationFrame
                    ? e.requestAnimationFrame(bt)
                    : e.setTimeout(bt, S.fx.interval),
                S.fx.tick());
        }
        function xt() {
            return (
                e.setTimeout(function () {
                    gt = void 0;
                }),
                (gt = Date.now())
            );
        }
        function St(e, t) {
            var n,
                r = 0,
                i = {height: e};
            for (t = t ? 1 : 0; r < 4; r += 2 - t)
                ((n = H[r]), (i[`margin` + n] = i[`padding` + n] = e));
            return (t && (i.opacity = i.width = e), i);
        }
        function Ct(e, t, n) {
            for (
                var r, i = (Y.tweeners[t] || []).concat(Y.tweeners[`*`]), a = 0, o = i.length;
                a < o;
                a++
            )
                if ((r = i[a].call(n, t, e))) return r;
        }
        function wt(e, t, n) {
            var r,
                i,
                a,
                o,
                s,
                c,
                l,
                u,
                d = `width` in t || `height` in t,
                f = this,
                p = {},
                m = e.style,
                h = e.nodeType && U(e),
                g = R.get(e, `fxshow`);
            for (r in (n.queue ||
                ((o = S._queueHooks(e, `fx`)),
                o.unqueued ??
                    ((o.unqueued = 0),
                    (s = o.empty.fire),
                    (o.empty.fire = function () {
                        o.unqueued || s();
                    })),
                o.unqueued++,
                f.always(function () {
                    f.always(function () {
                        (o.unqueued--, S.queue(e, `fx`).length || o.empty.fire());
                    });
                })),
            t))
                if (((i = t[r]), vt.test(i))) {
                    if ((delete t[r], (a ||= i === `toggle`), i === (h ? `hide` : `show`)))
                        if (i === `show` && g && g[r] !== void 0) h = !0;
                        else continue;
                    p[r] = (g && g[r]) || S.style(e, r);
                }
            if (((c = !S.isEmptyObject(t)), !(!c && S.isEmptyObject(p))))
                for (r in (d &&
                    e.nodeType === 1 &&
                    ((n.overflow = [m.overflow, m.overflowX, m.overflowY]),
                    (l = g && g.display),
                    (l ??= R.get(e, `display`)),
                    (u = S.css(e, `display`)),
                    u === `none` &&
                        (l
                            ? (u = l)
                            : (Me([e], !0),
                              (l = e.style.display || l),
                              (u = S.css(e, `display`)),
                              Me([e]))),
                    (u === `inline` || (u === `inline-block` && l != null)) &&
                        S.css(e, `float`) === `none` &&
                        (c ||
                            (f.done(function () {
                                m.display = l;
                            }),
                            (l ??= ((u = m.display), u === `none` ? `` : u))),
                        (m.display = `inline-block`))),
                n.overflow &&
                    ((m.overflow = `hidden`),
                    f.always(function () {
                        ((m.overflow = n.overflow[0]),
                            (m.overflowX = n.overflow[1]),
                            (m.overflowY = n.overflow[2]));
                    })),
                (c = !1),
                p))
                    (c ||
                        (g
                            ? `hidden` in g && (h = g.hidden)
                            : (g = R.access(e, `fxshow`, {display: l})),
                        a && (g.hidden = !h),
                        h && Me([e], !0),
                        f.done(function () {
                            for (r in (h || Me([e]), R.remove(e, `fxshow`), p)) S.style(e, r, p[r]);
                        })),
                        (c = Ct(h ? g[r] : 0, r, f)),
                        r in g || ((g[r] = c.start), h && ((c.end = c.start), (c.start = 0))));
        }
        function Tt(e, t) {
            var n, r, i, a, o;
            for (n in e)
                if (
                    ((r = L(n)),
                    (i = t[r]),
                    (a = e[n]),
                    Array.isArray(a) && ((i = a[1]), (a = e[n] = a[0])),
                    n !== r && ((e[r] = a), delete e[n]),
                    (o = S.cssHooks[r]),
                    o && `expand` in o)
                )
                    for (n in ((a = o.expand(a)), delete e[r], a))
                        n in e || ((e[n] = a[n]), (t[n] = i));
                else t[r] = i;
        }
        function Y(e, t, n) {
            var r,
                i,
                a = 0,
                o = Y.prefilters.length,
                s = S.Deferred().always(function () {
                    delete c.elem;
                }),
                c = function () {
                    if (i) return !1;
                    for (
                        var t = gt || xt(),
                            n = Math.max(0, l.startTime + l.duration - t),
                            r = 1 - (n / l.duration || 0),
                            a = 0,
                            o = l.tweens.length;
                        a < o;
                        a++
                    )
                        l.tweens[a].run(r);
                    return (
                        s.notifyWith(e, [l, r, n]),
                        r < 1 && o
                            ? n
                            : (o || s.notifyWith(e, [l, 1, 0]), s.resolveWith(e, [l]), !1)
                    );
                },
                l = s.promise({
                    elem: e,
                    props: S.extend({}, t),
                    opts: S.extend(!0, {specialEasing: {}, easing: S.easing._default}, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: gt || xt(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function (t, n) {
                        var r = S.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                        return (l.tweens.push(r), r);
                    },
                    stop: function (t) {
                        var n = 0,
                            r = t ? l.tweens.length : 0;
                        if (i) return this;
                        for (i = !0; n < r; n++) l.tweens[n].run(1);
                        return (
                            t
                                ? (s.notifyWith(e, [l, 1, 0]), s.resolveWith(e, [l, t]))
                                : s.rejectWith(e, [l, t]),
                            this
                        );
                    },
                }),
                u = l.props;
            for (Tt(u, l.opts.specialEasing); a < o; a++)
                if (((r = Y.prefilters[a].call(l, e, u, l.opts)), r))
                    return (
                        m(r.stop) && (S._queueHooks(l.elem, l.opts.queue).stop = r.stop.bind(r)),
                        r
                    );
            return (
                S.map(u, Ct, l),
                m(l.opts.start) && l.opts.start.call(e, l),
                l
                    .progress(l.opts.progress)
                    .done(l.opts.done, l.opts.complete)
                    .fail(l.opts.fail)
                    .always(l.opts.always),
                S.fx.timer(S.extend(c, {elem: e, anim: l, queue: l.opts.queue})),
                l
            );
        }
        ((S.Animation = S.extend(Y, {
            tweeners: {
                '*': [
                    function (e, t) {
                        var n = this.createTween(e, t);
                        return (ke(n.elem, e, Te.exec(t), n), n);
                    },
                ],
            },
            tweener: function (e, t) {
                m(e) ? ((t = e), (e = [`*`])) : (e = e.match(j));
                for (var n, r = 0, i = e.length; r < i; r++)
                    ((n = e[r]), (Y.tweeners[n] = Y.tweeners[n] || []), Y.tweeners[n].unshift(t));
            },
            prefilters: [wt],
            prefilter: function (e, t) {
                t ? Y.prefilters.unshift(e) : Y.prefilters.push(e);
            },
        })),
            (S.speed = function (e, t, n) {
                var r =
                    e && typeof e == `object`
                        ? S.extend({}, e)
                        : {
                              complete: n || (!n && t) || (m(e) && e),
                              duration: e,
                              easing: (n && t) || (t && !m(t) && t),
                          };
                return (
                    S.fx.off
                        ? (r.duration = 0)
                        : typeof r.duration != `number` &&
                          (r.duration in S.fx.speeds
                              ? (r.duration = S.fx.speeds[r.duration])
                              : (r.duration = S.fx.speeds._default)),
                    (r.queue == null || r.queue === !0) && (r.queue = `fx`),
                    (r.old = r.complete),
                    (r.complete = function () {
                        (m(r.old) && r.old.call(this), r.queue && S.dequeue(this, r.queue));
                    }),
                    r
                );
            }),
            S.fn.extend({
                fadeTo: function (e, t, n, r) {
                    return this.filter(U)
                        .css(`opacity`, 0)
                        .show()
                        .end()
                        .animate({opacity: t}, e, n, r);
                },
                animate: function (e, t, n, r) {
                    var i = S.isEmptyObject(e),
                        a = S.speed(t, n, r),
                        o = function () {
                            var t = Y(this, S.extend({}, e), a);
                            (i || R.get(this, `finish`)) && t.stop(!0);
                        };
                    return (
                        (o.finish = o),
                        i || a.queue === !1 ? this.each(o) : this.queue(a.queue, o)
                    );
                },
                stop: function (e, t, n) {
                    var r = function (e) {
                        var t = e.stop;
                        (delete e.stop, t(n));
                    };
                    return (
                        typeof e != `string` && ((n = t), (t = e), (e = void 0)),
                        t && this.queue(e || `fx`, []),
                        this.each(function () {
                            var t = !0,
                                i = e != null && e + `queueHooks`,
                                a = S.timers,
                                o = R.get(this);
                            if (i) o[i] && o[i].stop && r(o[i]);
                            else for (i in o) o[i] && o[i].stop && yt.test(i) && r(o[i]);
                            for (i = a.length; i--; )
                                a[i].elem === this &&
                                    (e == null || a[i].queue === e) &&
                                    (a[i].anim.stop(n), (t = !1), a.splice(i, 1));
                            (t || !n) && S.dequeue(this, e);
                        })
                    );
                },
                finish: function (e) {
                    return (
                        e !== !1 && (e ||= `fx`),
                        this.each(function () {
                            var t,
                                n = R.get(this),
                                r = n[e + `queue`],
                                i = n[e + `queueHooks`],
                                a = S.timers,
                                o = r ? r.length : 0;
                            for (
                                n.finish = !0,
                                    S.queue(this, e, []),
                                    i && i.stop && i.stop.call(this, !0),
                                    t = a.length;
                                t--;

                            )
                                a[t].elem === this &&
                                    a[t].queue === e &&
                                    (a[t].anim.stop(!0), a.splice(t, 1));
                            for (t = 0; t < o; t++) r[t] && r[t].finish && r[t].finish.call(this);
                            delete n.finish;
                        })
                    );
                },
            }),
            S.each([`toggle`, `show`, `hide`], function (e, t) {
                var n = S.fn[t];
                S.fn[t] = function (e, r, i) {
                    return e == null || typeof e == `boolean`
                        ? n.apply(this, arguments)
                        : this.animate(St(t, !0), e, r, i);
                };
            }),
            S.each(
                {
                    slideDown: St(`show`),
                    slideUp: St(`hide`),
                    slideToggle: St(`toggle`),
                    fadeIn: {opacity: `show`},
                    fadeOut: {opacity: `hide`},
                    fadeToggle: {opacity: `toggle`},
                },
                function (e, t) {
                    S.fn[e] = function (e, n, r) {
                        return this.animate(t, e, n, r);
                    };
                },
            ),
            (S.timers = []),
            (S.fx.tick = function () {
                var e,
                    t = 0,
                    n = S.timers;
                for (gt = Date.now(); t < n.length; t++)
                    ((e = n[t]), !e() && n[t] === e && n.splice(t--, 1));
                (n.length || S.fx.stop(), (gt = void 0));
            }),
            (S.fx.timer = function (e) {
                (S.timers.push(e), S.fx.start());
            }),
            (S.fx.interval = 13),
            (S.fx.start = function () {
                _t || ((_t = !0), bt());
            }),
            (S.fx.stop = function () {
                _t = null;
            }),
            (S.fx.speeds = {slow: 600, fast: 200, _default: 400}),
            (S.fn.delay = function (t, n) {
                return (
                    (t = (S.fx && S.fx.speeds[t]) || t),
                    (n ||= `fx`),
                    this.queue(n, function (n, r) {
                        var i = e.setTimeout(n, t);
                        r.stop = function () {
                            e.clearTimeout(i);
                        };
                    })
                );
            }),
            (function () {
                var e = g.createElement(`input`),
                    t = g.createElement(`select`).appendChild(g.createElement(`option`));
                ((e.type = `checkbox`),
                    (p.checkOn = e.value !== ``),
                    (p.optSelected = t.selected),
                    (e = g.createElement(`input`)),
                    (e.value = `t`),
                    (e.type = `radio`),
                    (p.radioValue = e.value === `t`));
            })());
        var Et,
            Dt = S.expr.attrHandle;
        (S.fn.extend({
            attr: function (e, t) {
                return P(this, S.attr, e, t, arguments.length > 1);
            },
            removeAttr: function (e) {
                return this.each(function () {
                    S.removeAttr(this, e);
                });
            },
        }),
            S.extend({
                attr: function (e, t, n) {
                    var r,
                        i,
                        a = e.nodeType;
                    if (!(a === 3 || a === 8 || a === 2)) {
                        if (e.getAttribute === void 0) return S.prop(e, t, n);
                        if (
                            ((a !== 1 || !S.isXMLDoc(e)) &&
                                (i =
                                    S.attrHooks[t.toLowerCase()] ||
                                    (S.expr.match.bool.test(t) ? Et : void 0)),
                            n !== void 0)
                        ) {
                            if (n === null) {
                                S.removeAttr(e, t);
                                return;
                            }
                            return i && `set` in i && (r = i.set(e, n, t)) !== void 0
                                ? r
                                : (e.setAttribute(t, n + ``), n);
                        }
                        return i && `get` in i && (r = i.get(e, t)) !== null
                            ? r
                            : ((r = S.find.attr(e, t)), r ?? void 0);
                    }
                },
                attrHooks: {
                    type: {
                        set: function (e, t) {
                            if (!p.radioValue && t === `radio` && w(e, `input`)) {
                                var n = e.value;
                                return (e.setAttribute(`type`, t), n && (e.value = n), t);
                            }
                        },
                    },
                },
                removeAttr: function (e, t) {
                    var n,
                        r = 0,
                        i = t && t.match(j);
                    if (i && e.nodeType === 1) for (; (n = i[r++]); ) e.removeAttribute(n);
                },
            }),
            (Et = {
                set: function (e, t, n) {
                    return (t === !1 ? S.removeAttr(e, n) : e.setAttribute(n, n), n);
                },
            }),
            S.each(S.expr.match.bool.source.match(/\w+/g), function (e, t) {
                var n = Dt[t] || S.find.attr;
                Dt[t] = function (e, t, r) {
                    var i,
                        a,
                        o = t.toLowerCase();
                    return (
                        r ||
                            ((a = Dt[o]),
                            (Dt[o] = i),
                            (i = n(e, t, r) == null ? null : o),
                            (Dt[o] = a)),
                        i
                    );
                };
            }));
        var Ot = /^(?:input|select|textarea|button)$/i,
            kt = /^(?:a|area)$/i;
        (S.fn.extend({
            prop: function (e, t) {
                return P(this, S.prop, e, t, arguments.length > 1);
            },
            removeProp: function (e) {
                return this.each(function () {
                    delete this[S.propFix[e] || e];
                });
            },
        }),
            S.extend({
                prop: function (e, t, n) {
                    var r,
                        i,
                        a = e.nodeType;
                    if (!(a === 3 || a === 8 || a === 2))
                        return (
                            (a !== 1 || !S.isXMLDoc(e)) &&
                                ((t = S.propFix[t] || t), (i = S.propHooks[t])),
                            n === void 0
                                ? i && `get` in i && (r = i.get(e, t)) !== null
                                    ? r
                                    : e[t]
                                : i && `set` in i && (r = i.set(e, n, t)) !== void 0
                                  ? r
                                  : (e[t] = n)
                        );
                },
                propHooks: {
                    tabIndex: {
                        get: function (e) {
                            var t = S.find.attr(e, `tabindex`);
                            return t
                                ? parseInt(t, 10)
                                : Ot.test(e.nodeName) || (kt.test(e.nodeName) && e.href)
                                  ? 0
                                  : -1;
                        },
                    },
                },
                propFix: {for: `htmlFor`, class: `className`},
            }),
            p.optSelected ||
                (S.propHooks.selected = {
                    get: function (e) {
                        var t = e.parentNode;
                        return (t && t.parentNode && t.parentNode.selectedIndex, null);
                    },
                    set: function (e) {
                        var t = e.parentNode;
                        t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
                    },
                }),
            S.each(
                [
                    `tabIndex`,
                    `readOnly`,
                    `maxLength`,
                    `cellSpacing`,
                    `cellPadding`,
                    `rowSpan`,
                    `colSpan`,
                    `useMap`,
                    `frameBorder`,
                    `contentEditable`,
                ],
                function () {
                    S.propFix[this.toLowerCase()] = this;
                },
            ));
        function At(e) {
            return (e.match(j) || []).join(` `);
        }
        function jt(e) {
            return (e.getAttribute && e.getAttribute(`class`)) || ``;
        }
        function X(e) {
            return Array.isArray(e) ? e : (typeof e == `string` && e.match(j)) || [];
        }
        S.fn.extend({
            addClass: function (e) {
                var t, n, r, i, a, o;
                return m(e)
                    ? this.each(function (t) {
                          S(this).addClass(e.call(this, t, jt(this)));
                      })
                    : ((t = X(e)),
                      t.length
                          ? this.each(function () {
                                if (
                                    ((r = jt(this)),
                                    (n = this.nodeType === 1 && ` ` + At(r) + ` `),
                                    n)
                                ) {
                                    for (a = 0; a < t.length; a++)
                                        ((i = t[a]),
                                            n.indexOf(` ` + i + ` `) < 0 && (n += i + ` `));
                                    ((o = At(n)), r !== o && this.setAttribute(`class`, o));
                                }
                            })
                          : this);
            },
            removeClass: function (e) {
                var t, n, r, i, a, o;
                return m(e)
                    ? this.each(function (t) {
                          S(this).removeClass(e.call(this, t, jt(this)));
                      })
                    : arguments.length
                      ? ((t = X(e)),
                        t.length
                            ? this.each(function () {
                                  if (
                                      ((r = jt(this)),
                                      (n = this.nodeType === 1 && ` ` + At(r) + ` `),
                                      n)
                                  ) {
                                      for (a = 0; a < t.length; a++)
                                          for (i = t[a]; n.indexOf(` ` + i + ` `) > -1; )
                                              n = n.replace(` ` + i + ` `, ` `);
                                      ((o = At(n)), r !== o && this.setAttribute(`class`, o));
                                  }
                              })
                            : this)
                      : this.attr(`class`, ``);
            },
            toggleClass: function (e, t) {
                var n,
                    r,
                    i,
                    a,
                    o = typeof e,
                    s = o === `string` || Array.isArray(e);
                return m(e)
                    ? this.each(function (n) {
                          S(this).toggleClass(e.call(this, n, jt(this), t), t);
                      })
                    : typeof t == `boolean` && s
                      ? t
                          ? this.addClass(e)
                          : this.removeClass(e)
                      : ((n = X(e)),
                        this.each(function () {
                            if (s)
                                for (a = S(this), i = 0; i < n.length; i++)
                                    ((r = n[i]), a.hasClass(r) ? a.removeClass(r) : a.addClass(r));
                            else
                                (e === void 0 || o === `boolean`) &&
                                    ((r = jt(this)),
                                    r && R.set(this, `__className__`, r),
                                    this.setAttribute &&
                                        this.setAttribute(
                                            `class`,
                                            r || e === !1 ? `` : R.get(this, `__className__`) || ``,
                                        ));
                        }));
            },
            hasClass: function (e) {
                var t,
                    n,
                    r = 0;
                for (t = ` ` + e + ` `; (n = this[r++]); )
                    if (n.nodeType === 1 && (` ` + At(jt(n)) + ` `).indexOf(t) > -1) return !0;
                return !1;
            },
        });
        var Mt = /\r/g;
        (S.fn.extend({
            val: function (e) {
                var t,
                    n,
                    r,
                    i = this[0];
                return arguments.length
                    ? ((r = m(e)),
                      this.each(function (n) {
                          var i;
                          this.nodeType === 1 &&
                              ((i = r ? e.call(this, n, S(this).val()) : e),
                              i == null
                                  ? (i = ``)
                                  : typeof i == `number`
                                    ? (i += ``)
                                    : Array.isArray(i) &&
                                      (i = S.map(i, function (e) {
                                          return e == null ? `` : e + ``;
                                      })),
                              (t =
                                  S.valHooks[this.type] || S.valHooks[this.nodeName.toLowerCase()]),
                              (!t || !(`set` in t) || t.set(this, i, `value`) === void 0) &&
                                  (this.value = i));
                      }))
                    : i
                      ? ((t = S.valHooks[i.type] || S.valHooks[i.nodeName.toLowerCase()]),
                        t && `get` in t && (n = t.get(i, `value`)) !== void 0
                            ? n
                            : ((n = i.value), typeof n == `string` ? n.replace(Mt, ``) : (n ?? ``)))
                      : void 0;
            },
        }),
            S.extend({
                valHooks: {
                    option: {
                        get: function (e) {
                            return S.find.attr(e, `value`) ?? At(S.text(e));
                        },
                    },
                    select: {
                        get: function (e) {
                            var t,
                                n,
                                r,
                                i = e.options,
                                a = e.selectedIndex,
                                o = e.type === `select-one`,
                                s = o ? null : [],
                                c = o ? a + 1 : i.length;
                            for (r = a < 0 ? c : o ? a : 0; r < c; r++)
                                if (
                                    ((n = i[r]),
                                    (n.selected || r === a) &&
                                        !n.disabled &&
                                        (!n.parentNode.disabled || !w(n.parentNode, `optgroup`)))
                                ) {
                                    if (((t = S(n).val()), o)) return t;
                                    s.push(t);
                                }
                            return s;
                        },
                        set: function (e, t) {
                            for (var n, r, i = e.options, a = S.makeArray(t), o = i.length; o--; )
                                ((r = i[o]),
                                    (r.selected = S.inArray(S.valHooks.option.get(r), a) > -1) &&
                                        (n = !0));
                            return (n || (e.selectedIndex = -1), a);
                        },
                    },
                },
            }),
            S.each([`radio`, `checkbox`], function () {
                ((S.valHooks[this] = {
                    set: function (e, t) {
                        if (Array.isArray(t)) return (e.checked = S.inArray(S(e).val(), t) > -1);
                    },
                }),
                    p.checkOn ||
                        (S.valHooks[this].get = function (e) {
                            return e.getAttribute(`value`) === null ? `on` : e.value;
                        }));
            }));
        var Nt = e.location,
            Pt = {guid: Date.now()},
            Ft = /\?/;
        S.parseXML = function (t) {
            var n, r;
            if (!t || typeof t != `string`) return null;
            try {
                n = new e.DOMParser().parseFromString(t, `text/xml`);
            } catch {}
            return (
                (r = n && n.getElementsByTagName(`parsererror`)[0]),
                (!n || r) &&
                    S.error(
                        `Invalid XML: ` +
                            (r
                                ? S.map(r.childNodes, function (e) {
                                      return e.textContent;
                                  }).join(`
`)
                                : t),
                    ),
                n
            );
        };
        var It = /^(?:focusinfocus|focusoutblur)$/,
            Lt = function (e) {
                e.stopPropagation();
            };
        (S.extend(S.event, {
            trigger: function (t, n, r, i) {
                var a,
                    o,
                    s,
                    c,
                    l,
                    d,
                    f,
                    p,
                    _ = [r || g],
                    v = u.call(t, `type`) ? t.type : t,
                    y = u.call(t, `namespace`) ? t.namespace.split(`.`) : [];
                if (
                    ((o = p = s = r ||= g),
                    !(r.nodeType === 3 || r.nodeType === 8) &&
                        !It.test(v + S.event.triggered) &&
                        (v.indexOf(`.`) > -1 && ((y = v.split(`.`)), (v = y.shift()), y.sort()),
                        (l = v.indexOf(`:`) < 0 && `on` + v),
                        (t = t[S.expando] ? t : new S.Event(v, typeof t == `object` && t)),
                        (t.isTrigger = i ? 2 : 3),
                        (t.namespace = y.join(`.`)),
                        (t.rnamespace = t.namespace
                            ? RegExp(`(^|\\.)` + y.join(`\\.(?:.*\\.|)`) + `(\\.|$)`)
                            : null),
                        (t.result = void 0),
                        (t.target ||= r),
                        (n = n == null ? [t] : S.makeArray(n, [t])),
                        (f = S.event.special[v] || {}),
                        !(!i && f.trigger && f.trigger.apply(r, n) === !1)))
                ) {
                    if (!i && !f.noBubble && !h(r)) {
                        for (
                            c = f.delegateType || v, It.test(c + v) || (o = o.parentNode);
                            o;
                            o = o.parentNode
                        )
                            (_.push(o), (s = o));
                        s === (r.ownerDocument || g) &&
                            _.push(s.defaultView || s.parentWindow || e);
                    }
                    for (a = 0; (o = _[a++]) && !t.isPropagationStopped(); )
                        ((p = o),
                            (t.type = a > 1 ? c : f.bindType || v),
                            (d =
                                (R.get(o, `events`) || Object.create(null))[t.type] &&
                                R.get(o, `handle`)),
                            d && d.apply(o, n),
                            (d = l && o[l]),
                            d &&
                                d.apply &&
                                be(o) &&
                                ((t.result = d.apply(o, n)),
                                t.result === !1 && t.preventDefault()));
                    return (
                        (t.type = v),
                        !i &&
                            !t.isDefaultPrevented() &&
                            (!f._default || f._default.apply(_.pop(), n) === !1) &&
                            be(r) &&
                            l &&
                            m(r[v]) &&
                            !h(r) &&
                            ((s = r[l]),
                            s && (r[l] = null),
                            (S.event.triggered = v),
                            t.isPropagationStopped() && p.addEventListener(v, Lt),
                            r[v](),
                            t.isPropagationStopped() && p.removeEventListener(v, Lt),
                            (S.event.triggered = void 0),
                            s && (r[l] = s)),
                        t.result
                    );
                }
            },
            simulate: function (e, t, n) {
                var r = S.extend(new S.Event(), n, {type: e, isSimulated: !0});
                S.event.trigger(r, null, t);
            },
        }),
            S.fn.extend({
                trigger: function (e, t) {
                    return this.each(function () {
                        S.event.trigger(e, t, this);
                    });
                },
                triggerHandler: function (e, t) {
                    var n = this[0];
                    if (n) return S.event.trigger(e, t, n, !0);
                },
            }));
        var Rt = /\[\]$/,
            zt = /\r?\n/g,
            Bt = /^(?:submit|button|image|reset|file)$/i,
            Vt = /^(?:input|select|textarea|keygen)/i;
        function Ht(e, t, n, r) {
            var i;
            if (Array.isArray(t))
                S.each(t, function (t, i) {
                    n || Rt.test(e)
                        ? r(e, i)
                        : Ht(e + `[` + (typeof i == `object` && i ? t : ``) + `]`, i, n, r);
                });
            else if (!n && y(t) === `object`) for (i in t) Ht(e + `[` + i + `]`, t[i], n, r);
            else r(e, t);
        }
        ((S.param = function (e, t) {
            var n,
                r = [],
                i = function (e, t) {
                    var n = m(t) ? t() : t;
                    r[r.length] = encodeURIComponent(e) + `=` + encodeURIComponent(n ?? ``);
                };
            if (e == null) return ``;
            if (Array.isArray(e) || (e.jquery && !S.isPlainObject(e)))
                S.each(e, function () {
                    i(this.name, this.value);
                });
            else for (n in e) Ht(n, e[n], t, i);
            return r.join(`&`);
        }),
            S.fn.extend({
                serialize: function () {
                    return S.param(this.serializeArray());
                },
                serializeArray: function () {
                    return this.map(function () {
                        var e = S.prop(this, `elements`);
                        return e ? S.makeArray(e) : this;
                    })
                        .filter(function () {
                            var e = this.type;
                            return (
                                this.name &&
                                !S(this).is(`:disabled`) &&
                                Vt.test(this.nodeName) &&
                                !Bt.test(e) &&
                                (this.checked || !Ne.test(e))
                            );
                        })
                        .map(function (e, t) {
                            var n = S(this).val();
                            return n == null
                                ? null
                                : Array.isArray(n)
                                  ? S.map(n, function (e) {
                                        return {
                                            name: t.name,
                                            value: e.replace(
                                                zt,
                                                `\r
`,
                                            ),
                                        };
                                    })
                                  : {
                                        name: t.name,
                                        value: n.replace(
                                            zt,
                                            `\r
`,
                                        ),
                                    };
                        })
                        .get();
                },
            }));
        var Ut = /%20/g,
            Wt = /#.*$/,
            Gt = /([?&])_=[^&]*/,
            Kt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            qt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Jt = /^(?:GET|HEAD)$/,
            Yt = /^\/\//,
            Xt = {},
            Zt = {},
            Qt = `*/*`,
            $t = g.createElement(`a`);
        $t.href = Nt.href;
        function en(e) {
            return function (t, n) {
                typeof t != `string` && ((n = t), (t = `*`));
                var r,
                    i = 0,
                    a = t.toLowerCase().match(j) || [];
                if (m(n))
                    for (; (r = a[i++]); )
                        r[0] === `+`
                            ? ((r = r.slice(1) || `*`), (e[r] = e[r] || []).unshift(n))
                            : (e[r] = e[r] || []).push(n);
            };
        }
        function tn(e, t, n, r) {
            var i = {},
                a = e === Zt;
            function o(s) {
                var c;
                return (
                    (i[s] = !0),
                    S.each(e[s] || [], function (e, s) {
                        var l = s(t, n, r);
                        if (typeof l == `string` && !a && !i[l])
                            return (t.dataTypes.unshift(l), o(l), !1);
                        if (a) return !(c = l);
                    }),
                    c
                );
            }
            return o(t.dataTypes[0]) || (!i[`*`] && o(`*`));
        }
        function nn(e, t) {
            var n,
                r,
                i = S.ajaxSettings.flatOptions || {};
            for (n in t) t[n] !== void 0 && ((i[n] ? e : (r ||= {}))[n] = t[n]);
            return (r && S.extend(!0, e, r), e);
        }
        function rn(e, t, n) {
            for (var r, i, a, o, s = e.contents, c = e.dataTypes; c[0] === `*`; )
                (c.shift(),
                    r === void 0 && (r = e.mimeType || t.getResponseHeader(`Content-Type`)));
            if (r) {
                for (i in s)
                    if (s[i] && s[i].test(r)) {
                        c.unshift(i);
                        break;
                    }
            }
            if (c[0] in n) a = c[0];
            else {
                for (i in n) {
                    if (!c[0] || e.converters[i + ` ` + c[0]]) {
                        a = i;
                        break;
                    }
                    o ||= i;
                }
                a ||= o;
            }
            if (a) return (a !== c[0] && c.unshift(a), n[a]);
        }
        function an(e, t, n, r) {
            var i,
                a,
                o,
                s,
                c,
                l = {},
                u = e.dataTypes.slice();
            if (u[1]) for (o in e.converters) l[o.toLowerCase()] = e.converters[o];
            for (a = u.shift(); a; )
                if (
                    (e.responseFields[a] && (n[e.responseFields[a]] = t),
                    !c && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                    (c = a),
                    (a = u.shift()),
                    a)
                ) {
                    if (a === `*`) a = c;
                    else if (c !== `*` && c !== a) {
                        if (((o = l[c + ` ` + a] || l[`* ` + a]), !o)) {
                            for (i in l)
                                if (
                                    ((s = i.split(` `)),
                                    s[1] === a && ((o = l[c + ` ` + s[0]] || l[`* ` + s[0]]), o))
                                ) {
                                    o === !0
                                        ? (o = l[i])
                                        : l[i] !== !0 && ((a = s[0]), u.unshift(s[1]));
                                    break;
                                }
                        }
                        if (o !== !0)
                            if (o && e.throws) t = o(t);
                            else
                                try {
                                    t = o(t);
                                } catch (e) {
                                    return {
                                        state: `parsererror`,
                                        error: o ? e : `No conversion from ` + c + ` to ` + a,
                                    };
                                }
                    }
                }
            return {state: `success`, data: t};
        }
        (S.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Nt.href,
                type: `GET`,
                isLocal: qt.test(Nt.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: `application/x-www-form-urlencoded; charset=UTF-8`,
                accepts: {
                    '*': Qt,
                    text: `text/plain`,
                    html: `text/html`,
                    xml: `application/xml, text/xml`,
                    json: `application/json, text/javascript`,
                },
                contents: {xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/},
                responseFields: {xml: `responseXML`, text: `responseText`, json: `responseJSON`},
                converters: {
                    '* text': String,
                    'text html': !0,
                    'text json': JSON.parse,
                    'text xml': S.parseXML,
                },
                flatOptions: {url: !0, context: !0},
            },
            ajaxSetup: function (e, t) {
                return t ? nn(nn(e, S.ajaxSettings), t) : nn(S.ajaxSettings, e);
            },
            ajaxPrefilter: en(Xt),
            ajaxTransport: en(Zt),
            ajax: function (t, n) {
                (typeof t == `object` && ((n = t), (t = void 0)), (n ||= {}));
                var r,
                    i,
                    a,
                    o,
                    s,
                    c,
                    l,
                    u,
                    d,
                    f,
                    p = S.ajaxSetup({}, n),
                    m = p.context || p,
                    h = p.context && (m.nodeType || m.jquery) ? S(m) : S.event,
                    _ = S.Deferred(),
                    v = S.Callbacks(`once memory`),
                    y = p.statusCode || {},
                    b = {},
                    x = {},
                    C = `canceled`,
                    w = {
                        readyState: 0,
                        getResponseHeader: function (e) {
                            var t;
                            if (l) {
                                if (!o)
                                    for (o = {}; (t = Kt.exec(a)); )
                                        o[t[1].toLowerCase() + ` `] = (
                                            o[t[1].toLowerCase() + ` `] || []
                                        ).concat(t[2]);
                                t = o[e.toLowerCase() + ` `];
                            }
                            return t == null ? null : t.join(`, `);
                        },
                        getAllResponseHeaders: function () {
                            return l ? a : null;
                        },
                        setRequestHeader: function (e, t) {
                            return (
                                l ??
                                    ((e = x[e.toLowerCase()] = x[e.toLowerCase()] || e),
                                    (b[e] = t)),
                                this
                            );
                        },
                        overrideMimeType: function (e) {
                            return (l ?? (p.mimeType = e), this);
                        },
                        statusCode: function (e) {
                            var t;
                            if (e)
                                if (l) w.always(e[w.status]);
                                else for (t in e) y[t] = [y[t], e[t]];
                            return this;
                        },
                        abort: function (e) {
                            var t = e || C;
                            return (r && r.abort(t), T(0, t), this);
                        },
                    };
                if (
                    (_.promise(w),
                    (p.url = ((t || p.url || Nt.href) + ``).replace(Yt, Nt.protocol + `//`)),
                    (p.type = n.method || n.type || p.method || p.type),
                    (p.dataTypes = (p.dataType || `*`).toLowerCase().match(j) || [``]),
                    p.crossDomain == null)
                ) {
                    c = g.createElement(`a`);
                    try {
                        ((c.href = p.url),
                            (c.href = c.href),
                            (p.crossDomain =
                                $t.protocol + `//` + $t.host != c.protocol + `//` + c.host));
                    } catch {
                        p.crossDomain = !0;
                    }
                }
                if (
                    (p.data &&
                        p.processData &&
                        typeof p.data != `string` &&
                        (p.data = S.param(p.data, p.traditional)),
                    tn(Xt, p, n, w),
                    l)
                )
                    return w;
                for (d in ((u = S.event && p.global),
                u && S.active++ === 0 && S.event.trigger(`ajaxStart`),
                (p.type = p.type.toUpperCase()),
                (p.hasContent = !Jt.test(p.type)),
                (i = p.url.replace(Wt, ``)),
                p.hasContent
                    ? p.data &&
                      p.processData &&
                      (p.contentType || ``).indexOf(`application/x-www-form-urlencoded`) === 0 &&
                      (p.data = p.data.replace(Ut, `+`))
                    : ((f = p.url.slice(i.length)),
                      p.data &&
                          (p.processData || typeof p.data == `string`) &&
                          ((i += (Ft.test(i) ? `&` : `?`) + p.data), delete p.data),
                      p.cache === !1 &&
                          ((i = i.replace(Gt, `$1`)),
                          (f = (Ft.test(i) ? `&` : `?`) + `_=` + Pt.guid++ + f)),
                      (p.url = i + f)),
                p.ifModified &&
                    (S.lastModified[i] &&
                        w.setRequestHeader(`If-Modified-Since`, S.lastModified[i]),
                    S.etag[i] && w.setRequestHeader(`If-None-Match`, S.etag[i])),
                ((p.data && p.hasContent && p.contentType !== !1) || n.contentType) &&
                    w.setRequestHeader(`Content-Type`, p.contentType),
                w.setRequestHeader(
                    `Accept`,
                    p.dataTypes[0] && p.accepts[p.dataTypes[0]]
                        ? p.accepts[p.dataTypes[0]] +
                              (p.dataTypes[0] === `*` ? `` : `, ` + Qt + `; q=0.01`)
                        : p.accepts[`*`],
                ),
                p.headers))
                    w.setRequestHeader(d, p.headers[d]);
                if (p.beforeSend && (p.beforeSend.call(m, w, p) === !1 || l)) return w.abort();
                if (
                    ((C = `abort`),
                    v.add(p.complete),
                    w.done(p.success),
                    w.fail(p.error),
                    (r = tn(Zt, p, n, w)),
                    !r)
                )
                    T(-1, `No Transport`);
                else {
                    if (((w.readyState = 1), u && h.trigger(`ajaxSend`, [w, p]), l)) return w;
                    p.async &&
                        p.timeout > 0 &&
                        (s = e.setTimeout(function () {
                            w.abort(`timeout`);
                        }, p.timeout));
                    try {
                        ((l = !1), r.send(b, T));
                    } catch (e) {
                        if (l) throw e;
                        T(-1, e);
                    }
                }
                function T(t, n, o, c) {
                    var d,
                        f,
                        g,
                        b,
                        x,
                        C = n;
                    l ||
                        ((l = !0),
                        s && e.clearTimeout(s),
                        (r = void 0),
                        (a = c || ``),
                        (w.readyState = t > 0 ? 4 : 0),
                        (d = (t >= 200 && t < 300) || t === 304),
                        o && (b = rn(p, w, o)),
                        !d &&
                            S.inArray(`script`, p.dataTypes) > -1 &&
                            S.inArray(`json`, p.dataTypes) < 0 &&
                            (p.converters[`text script`] = function () {}),
                        (b = an(p, b, w, d)),
                        d
                            ? (p.ifModified &&
                                  ((x = w.getResponseHeader(`Last-Modified`)),
                                  x && (S.lastModified[i] = x),
                                  (x = w.getResponseHeader(`etag`)),
                                  x && (S.etag[i] = x)),
                              t === 204 || p.type === `HEAD`
                                  ? (C = `nocontent`)
                                  : t === 304
                                    ? (C = `notmodified`)
                                    : ((C = b.state), (f = b.data), (g = b.error), (d = !g)))
                            : ((g = C), (t || !C) && ((C = `error`), t < 0 && (t = 0))),
                        (w.status = t),
                        (w.statusText = (n || C) + ``),
                        d ? _.resolveWith(m, [f, C, w]) : _.rejectWith(m, [w, C, g]),
                        w.statusCode(y),
                        (y = void 0),
                        u && h.trigger(d ? `ajaxSuccess` : `ajaxError`, [w, p, d ? f : g]),
                        v.fireWith(m, [w, C]),
                        u &&
                            (h.trigger(`ajaxComplete`, [w, p]),
                            --S.active || S.event.trigger(`ajaxStop`)));
                }
                return w;
            },
            getJSON: function (e, t, n) {
                return S.get(e, t, n, `json`);
            },
            getScript: function (e, t) {
                return S.get(e, void 0, t, `script`);
            },
        }),
            S.each([`get`, `post`], function (e, t) {
                S[t] = function (e, n, r, i) {
                    return (
                        m(n) && ((i ||= r), (r = n), (n = void 0)),
                        S.ajax(
                            S.extend(
                                {url: e, type: t, dataType: i, data: n, success: r},
                                S.isPlainObject(e) && e,
                            ),
                        )
                    );
                };
            }),
            S.ajaxPrefilter(function (e) {
                for (var t in e.headers)
                    t.toLowerCase() === `content-type` && (e.contentType = e.headers[t] || ``);
            }),
            (S._evalUrl = function (e, t, n) {
                return S.ajax({
                    url: e,
                    type: `GET`,
                    dataType: `script`,
                    cache: !0,
                    async: !1,
                    global: !1,
                    converters: {'text script': function () {}},
                    dataFilter: function (e) {
                        S.globalEval(e, t, n);
                    },
                });
            }),
            S.fn.extend({
                wrapAll: function (e) {
                    var t;
                    return (
                        this[0] &&
                            (m(e) && (e = e.call(this[0])),
                            (t = S(e, this[0].ownerDocument).eq(0).clone(!0)),
                            this[0].parentNode && t.insertBefore(this[0]),
                            t
                                .map(function () {
                                    for (var e = this; e.firstElementChild; )
                                        e = e.firstElementChild;
                                    return e;
                                })
                                .append(this)),
                        this
                    );
                },
                wrapInner: function (e) {
                    return m(e)
                        ? this.each(function (t) {
                              S(this).wrapInner(e.call(this, t));
                          })
                        : this.each(function () {
                              var t = S(this),
                                  n = t.contents();
                              n.length ? n.wrapAll(e) : t.append(e);
                          });
                },
                wrap: function (e) {
                    var t = m(e);
                    return this.each(function (n) {
                        S(this).wrapAll(t ? e.call(this, n) : e);
                    });
                },
                unwrap: function (e) {
                    return (
                        this.parent(e)
                            .not(`body`)
                            .each(function () {
                                S(this).replaceWith(this.childNodes);
                            }),
                        this
                    );
                },
            }),
            (S.expr.pseudos.hidden = function (e) {
                return !S.expr.pseudos.visible(e);
            }),
            (S.expr.pseudos.visible = function (e) {
                return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
            }),
            (S.ajaxSettings.xhr = function () {
                try {
                    return new e.XMLHttpRequest();
                } catch {}
            }));
        var on = {0: 200, 1223: 204},
            sn = S.ajaxSettings.xhr();
        ((p.cors = !!sn && `withCredentials` in sn),
            (p.ajax = sn = !!sn),
            S.ajaxTransport(function (t) {
                var n, r;
                if (p.cors || (sn && !t.crossDomain))
                    return {
                        send: function (i, a) {
                            var o,
                                s = t.xhr();
                            if (
                                (s.open(t.type, t.url, t.async, t.username, t.password),
                                t.xhrFields)
                            )
                                for (o in t.xhrFields) s[o] = t.xhrFields[o];
                            for (o in (t.mimeType &&
                                s.overrideMimeType &&
                                s.overrideMimeType(t.mimeType),
                            !t.crossDomain &&
                                !i[`X-Requested-With`] &&
                                (i[`X-Requested-With`] = `XMLHttpRequest`),
                            i))
                                s.setRequestHeader(o, i[o]);
                            ((n = function (e) {
                                return function () {
                                    n &&
                                        ((n =
                                            r =
                                            s.onload =
                                            s.onerror =
                                            s.onabort =
                                            s.ontimeout =
                                            s.onreadystatechange =
                                                null),
                                        e === `abort`
                                            ? s.abort()
                                            : e === `error`
                                              ? typeof s.status == `number`
                                                  ? a(s.status, s.statusText)
                                                  : a(0, `error`)
                                              : a(
                                                    on[s.status] || s.status,
                                                    s.statusText,
                                                    (s.responseType || `text`) !== `text` ||
                                                        typeof s.responseText != `string`
                                                        ? {binary: s.response}
                                                        : {text: s.responseText},
                                                    s.getAllResponseHeaders(),
                                                ));
                                };
                            }),
                                (s.onload = n()),
                                (r = s.onerror = s.ontimeout = n(`error`)),
                                s.onabort === void 0
                                    ? (s.onreadystatechange = function () {
                                          s.readyState === 4 &&
                                              e.setTimeout(function () {
                                                  n && r();
                                              });
                                      })
                                    : (s.onabort = r),
                                (n = n(`abort`)));
                            try {
                                s.send((t.hasContent && t.data) || null);
                            } catch (e) {
                                if (n) throw e;
                            }
                        },
                        abort: function () {
                            n && n();
                        },
                    };
            }),
            S.ajaxPrefilter(function (e) {
                e.crossDomain && (e.contents.script = !1);
            }),
            S.ajaxSetup({
                accepts: {
                    script: `text/javascript, application/javascript, application/ecmascript, application/x-ecmascript`,
                },
                contents: {script: /\b(?:java|ecma)script\b/},
                converters: {
                    'text script': function (e) {
                        return (S.globalEval(e), e);
                    },
                },
            }),
            S.ajaxPrefilter(`script`, function (e) {
                (e.cache === void 0 && (e.cache = !1), e.crossDomain && (e.type = `GET`));
            }),
            S.ajaxTransport(`script`, function (e) {
                if (e.crossDomain || e.scriptAttrs) {
                    var t, n;
                    return {
                        send: function (r, i) {
                            ((t = S(`<script>`)
                                .attr(e.scriptAttrs || {})
                                .prop({charset: e.scriptCharset, src: e.url})
                                .on(
                                    `load error`,
                                    (n = function (e) {
                                        (t.remove(),
                                            (n = null),
                                            e && i(e.type === `error` ? 404 : 200, e.type));
                                    }),
                                )),
                                g.head.appendChild(t[0]));
                        },
                        abort: function () {
                            n && n();
                        },
                    };
                }
            }));
        var cn = [],
            Z = /(=)\?(?=&|$)|\?\?/;
        (S.ajaxSetup({
            jsonp: `callback`,
            jsonpCallback: function () {
                var e = cn.pop() || S.expando + `_` + Pt.guid++;
                return ((this[e] = !0), e);
            },
        }),
            S.ajaxPrefilter(`json jsonp`, function (t, n, r) {
                var i,
                    a,
                    o,
                    s =
                        t.jsonp !== !1 &&
                        (Z.test(t.url)
                            ? `url`
                            : typeof t.data == `string` &&
                              (t.contentType || ``).indexOf(`application/x-www-form-urlencoded`) ===
                                  0 &&
                              Z.test(t.data) &&
                              `data`);
                if (s || t.dataTypes[0] === `jsonp`)
                    return (
                        (i = t.jsonpCallback =
                            m(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback),
                        s
                            ? (t[s] = t[s].replace(Z, `$1` + i))
                            : t.jsonp !== !1 &&
                              (t.url += (Ft.test(t.url) ? `&` : `?`) + t.jsonp + `=` + i),
                        (t.converters[`script json`] = function () {
                            return (o || S.error(i + ` was not called`), o[0]);
                        }),
                        (t.dataTypes[0] = `json`),
                        (a = e[i]),
                        (e[i] = function () {
                            o = arguments;
                        }),
                        r.always(function () {
                            (a === void 0 ? S(e).removeProp(i) : (e[i] = a),
                                t[i] && ((t.jsonpCallback = n.jsonpCallback), cn.push(i)),
                                o && m(a) && a(o[0]),
                                (o = a = void 0));
                        }),
                        `script`
                    );
            }),
            (p.createHTMLDocument = (function () {
                var e = g.implementation.createHTMLDocument(``).body;
                return ((e.innerHTML = `<form></form><form></form>`), e.childNodes.length === 2);
            })()),
            (S.parseHTML = function (e, t, n) {
                if (typeof e != `string`) return [];
                typeof t == `boolean` && ((n = t), (t = !1));
                var r, i, a;
                return (
                    t ||
                        (p.createHTMLDocument
                            ? ((t = g.implementation.createHTMLDocument(``)),
                              (r = t.createElement(`base`)),
                              (r.href = g.location.href),
                              t.head.appendChild(r))
                            : (t = g)),
                    (i = oe.exec(e)),
                    (a = !n && []),
                    i
                        ? [t.createElement(i[1])]
                        : ((i = Re([e], t, a)),
                          a && a.length && S(a).remove(),
                          S.merge([], i.childNodes))
                );
            }),
            (S.fn.load = function (e, t, n) {
                var r,
                    i,
                    a,
                    o = this,
                    s = e.indexOf(` `);
                return (
                    s > -1 && ((r = At(e.slice(s))), (e = e.slice(0, s))),
                    m(t) ? ((n = t), (t = void 0)) : t && typeof t == `object` && (i = `POST`),
                    o.length > 0 &&
                        S.ajax({url: e, type: i || `GET`, dataType: `html`, data: t})
                            .done(function (e) {
                                ((a = arguments),
                                    o.html(r ? S(`<div>`).append(S.parseHTML(e)).find(r) : e));
                            })
                            .always(
                                n &&
                                    function (e, t) {
                                        o.each(function () {
                                            n.apply(this, a || [e.responseText, t, e]);
                                        });
                                    },
                            ),
                    this
                );
            }),
            (S.expr.pseudos.animated = function (e) {
                return S.grep(S.timers, function (t) {
                    return e === t.elem;
                }).length;
            }),
            (S.offset = {
                setOffset: function (e, t, n) {
                    var r,
                        i,
                        a,
                        o,
                        s,
                        c,
                        l,
                        u = S.css(e, `position`),
                        d = S(e),
                        f = {};
                    (u === `static` && (e.style.position = `relative`),
                        (s = d.offset()),
                        (a = S.css(e, `top`)),
                        (c = S.css(e, `left`)),
                        (l = (u === `absolute` || u === `fixed`) && (a + c).indexOf(`auto`) > -1),
                        l
                            ? ((r = d.position()), (o = r.top), (i = r.left))
                            : ((o = parseFloat(a) || 0), (i = parseFloat(c) || 0)),
                        m(t) && (t = t.call(e, n, S.extend({}, s))),
                        t.top != null && (f.top = t.top - s.top + o),
                        t.left != null && (f.left = t.left - s.left + i),
                        `using` in t ? t.using.call(e, f) : d.css(f));
                },
            }),
            S.fn.extend({
                offset: function (e) {
                    if (arguments.length)
                        return e === void 0
                            ? this
                            : this.each(function (t) {
                                  S.offset.setOffset(this, e, t);
                              });
                    var t,
                        n,
                        r = this[0];
                    if (r)
                        return r.getClientRects().length
                            ? ((t = r.getBoundingClientRect()),
                              (n = r.ownerDocument.defaultView),
                              {top: t.top + n.pageYOffset, left: t.left + n.pageXOffset})
                            : {top: 0, left: 0};
                },
                position: function () {
                    if (this[0]) {
                        var e,
                            t,
                            n,
                            r = this[0],
                            i = {top: 0, left: 0};
                        if (S.css(r, `position`) === `fixed`) t = r.getBoundingClientRect();
                        else {
                            for (
                                t = this.offset(),
                                    n = r.ownerDocument,
                                    e = r.offsetParent || n.documentElement;
                                e &&
                                (e === n.body || e === n.documentElement) &&
                                S.css(e, `position`) === `static`;

                            )
                                e = e.parentNode;
                            e &&
                                e !== r &&
                                e.nodeType === 1 &&
                                ((i = S(e).offset()),
                                (i.top += S.css(e, `borderTopWidth`, !0)),
                                (i.left += S.css(e, `borderLeftWidth`, !0)));
                        }
                        return {
                            top: t.top - i.top - S.css(r, `marginTop`, !0),
                            left: t.left - i.left - S.css(r, `marginLeft`, !0),
                        };
                    }
                },
                offsetParent: function () {
                    return this.map(function () {
                        for (var e = this.offsetParent; e && S.css(e, `position`) === `static`; )
                            e = e.offsetParent;
                        return e || Ee;
                    });
                },
            }),
            S.each({scrollLeft: `pageXOffset`, scrollTop: `pageYOffset`}, function (e, t) {
                var n = t === `pageYOffset`;
                S.fn[e] = function (r) {
                    return P(
                        this,
                        function (e, r, i) {
                            var a;
                            if (
                                (h(e) ? (a = e) : e.nodeType === 9 && (a = e.defaultView),
                                i === void 0)
                            )
                                return a ? a[t] : e[r];
                            a
                                ? a.scrollTo(n ? a.pageXOffset : i, n ? i : a.pageYOffset)
                                : (e[r] = i);
                        },
                        e,
                        r,
                        arguments.length,
                    );
                };
            }),
            S.each([`top`, `left`], function (e, t) {
                S.cssHooks[t] = at(p.pixelPosition, function (e, n) {
                    if (n) return ((n = it(e, t)), et.test(n) ? S(e).position()[t] + `px` : n);
                });
            }),
            S.each({Height: `height`, Width: `width`}, function (e, t) {
                S.each({padding: `inner` + e, content: t, '': `outer` + e}, function (n, r) {
                    S.fn[r] = function (i, a) {
                        var o = arguments.length && (n || typeof i != `boolean`),
                            s = n || (i === !0 || a === !0 ? `margin` : `border`);
                        return P(
                            this,
                            function (t, n, i) {
                                var a;
                                return h(t)
                                    ? r.indexOf(`outer`) === 0
                                        ? t[`inner` + e]
                                        : t.document.documentElement[`client` + e]
                                    : t.nodeType === 9
                                      ? ((a = t.documentElement),
                                        Math.max(
                                            t.body[`scroll` + e],
                                            a[`scroll` + e],
                                            t.body[`offset` + e],
                                            a[`offset` + e],
                                            a[`client` + e],
                                        ))
                                      : i === void 0
                                        ? S.css(t, n, s)
                                        : S.style(t, n, i, s);
                            },
                            t,
                            o ? i : void 0,
                            o,
                        );
                    };
                });
            }),
            S.each(
                [`ajaxStart`, `ajaxStop`, `ajaxComplete`, `ajaxError`, `ajaxSuccess`, `ajaxSend`],
                function (e, t) {
                    S.fn[t] = function (e) {
                        return this.on(t, e);
                    };
                },
            ),
            S.fn.extend({
                bind: function (e, t, n) {
                    return this.on(e, null, t, n);
                },
                unbind: function (e, t) {
                    return this.off(e, null, t);
                },
                delegate: function (e, t, n, r) {
                    return this.on(t, e, n, r);
                },
                undelegate: function (e, t, n) {
                    return arguments.length === 1 ? this.off(e, `**`) : this.off(t, e || `**`, n);
                },
                hover: function (e, t) {
                    return this.on(`mouseenter`, e).on(`mouseleave`, t || e);
                },
            }),
            S.each(
                `blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu`.split(
                    ` `,
                ),
                function (e, t) {
                    S.fn[t] = function (e, n) {
                        return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t);
                    };
                },
            ));
        var ln = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
        ((S.proxy = function (e, t) {
            var n, r, a;
            if ((typeof t == `string` && ((n = e[t]), (t = e), (e = n)), m(e)))
                return (
                    (r = i.call(arguments, 2)),
                    (a = function () {
                        return e.apply(t || this, r.concat(i.call(arguments)));
                    }),
                    (a.guid = e.guid = e.guid || S.guid++),
                    a
                );
        }),
            (S.holdReady = function (e) {
                e ? S.readyWait++ : S.ready(!0);
            }),
            (S.isArray = Array.isArray),
            (S.parseJSON = JSON.parse),
            (S.nodeName = w),
            (S.isFunction = m),
            (S.isWindow = h),
            (S.camelCase = L),
            (S.type = y),
            (S.now = Date.now),
            (S.isNumeric = function (e) {
                var t = S.type(e);
                return (t === `number` || t === `string`) && !isNaN(e - parseFloat(e));
            }),
            (S.trim = function (e) {
                return e == null ? `` : (e + ``).replace(ln, `$1`);
            }),
            typeof define == `function` &&
                define.amd &&
                define(`jquery`, [], function () {
                    return S;
                }));
        var un = e.jQuery,
            dn = e.$;
        return (
            (S.noConflict = function (t) {
                return (e.$ === S && (e.$ = dn), t && e.jQuery === S && (e.jQuery = un), S);
            }),
            t === void 0 && (e.jQuery = e.$ = S),
            S
        );
    });
});
const h = (e, t, n = `@id`) => {
    let r = t[`hydra:member`];
    if (r !== void 0) {
        for (let t of r) if (t[n] === e) return t;
    }
};
var g = o((e, t) => {
    (function (e) {
        typeof define == `function` && define.amd
            ? define([`jquery`], e)
            : typeof t == `object` && t.exports
              ? (t.exports = function (t, n) {
                    return (n === void 0 && (n = typeof window < `u` ? m() : m()(t)), e(n), n);
                })
              : e(jQuery);
    })(function (e) {
        var t = (function () {
                if (e && e.fn && e.fn.select2 && e.fn.select2.amd) var t = e.fn.select2.amd;
                var t;
                return (
                    (function () {
                        if (!t || !t.requirejs) {
                            t ? (n = t) : (t = {});
                            /**
                             * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
                             * Released under MIT license, http://github.com/requirejs/almond/LICENSE
                             */
                            var e, n, r;
                            ((function (t) {
                                var i,
                                    a,
                                    o,
                                    s,
                                    c = {},
                                    l = {},
                                    u = {},
                                    d = {},
                                    f = Object.prototype.hasOwnProperty,
                                    p = [].slice,
                                    m = /\.js$/;
                                function h(e, t) {
                                    return f.call(e, t);
                                }
                                function g(e, t) {
                                    var n,
                                        r,
                                        i,
                                        a,
                                        o,
                                        s,
                                        c,
                                        l,
                                        d,
                                        f,
                                        p,
                                        h,
                                        g = t && t.split(`/`),
                                        _ = u.map,
                                        v = (_ && _[`*`]) || {};
                                    if (e) {
                                        for (
                                            e = e.split(`/`),
                                                o = e.length - 1,
                                                u.nodeIdCompat &&
                                                    m.test(e[o]) &&
                                                    (e[o] = e[o].replace(m, ``)),
                                                e[0].charAt(0) === `.` &&
                                                    g &&
                                                    ((h = g.slice(0, g.length - 1)),
                                                    (e = h.concat(e))),
                                                d = 0;
                                            d < e.length;
                                            d++
                                        )
                                            if (((p = e[d]), p === `.`)) (e.splice(d, 1), --d);
                                            else if (p === `..`) {
                                                if (
                                                    d === 0 ||
                                                    (d === 1 && e[2] === `..`) ||
                                                    e[d - 1] === `..`
                                                )
                                                    continue;
                                                d > 0 && (e.splice(d - 1, 2), (d -= 2));
                                            }
                                        e = e.join(`/`);
                                    }
                                    if ((g || v) && _) {
                                        for (n = e.split(`/`), d = n.length; d > 0; --d) {
                                            if (((r = n.slice(0, d).join(`/`)), g)) {
                                                for (f = g.length; f > 0; --f)
                                                    if (
                                                        ((i = _[g.slice(0, f).join(`/`)]),
                                                        i && ((i = i[r]), i))
                                                    ) {
                                                        ((a = i), (s = d));
                                                        break;
                                                    }
                                            }
                                            if (a) break;
                                            !c && v && v[r] && ((c = v[r]), (l = d));
                                        }
                                        (!a && c && ((a = c), (s = l)),
                                            a && (n.splice(0, s, a), (e = n.join(`/`))));
                                    }
                                    return e;
                                }
                                function _(e, n) {
                                    return function () {
                                        var r = p.call(arguments, 0);
                                        return (
                                            typeof r[0] != `string` &&
                                                r.length === 1 &&
                                                r.push(null),
                                            a.apply(t, r.concat([e, n]))
                                        );
                                    };
                                }
                                function v(e) {
                                    return function (t) {
                                        return g(t, e);
                                    };
                                }
                                function y(e) {
                                    return function (t) {
                                        c[e] = t;
                                    };
                                }
                                function b(e) {
                                    if (h(l, e)) {
                                        var n = l[e];
                                        (delete l[e], (d[e] = !0), i.apply(t, n));
                                    }
                                    if (!h(c, e) && !h(d, e)) throw Error(`No ` + e);
                                    return c[e];
                                }
                                function x(e) {
                                    var t,
                                        n = e ? e.indexOf(`!`) : -1;
                                    return (
                                        n > -1 &&
                                            ((t = e.substring(0, n)),
                                            (e = e.substring(n + 1, e.length))),
                                        [t, e]
                                    );
                                }
                                function S(e) {
                                    return e ? x(e) : [];
                                }
                                o = function (e, t) {
                                    var n,
                                        r = x(e),
                                        i = r[0],
                                        a = t[1];
                                    return (
                                        (e = r[1]),
                                        i && ((i = g(i, a)), (n = b(i))),
                                        i
                                            ? (e =
                                                  n && n.normalize ? n.normalize(e, v(a)) : g(e, a))
                                            : ((e = g(e, a)),
                                              (r = x(e)),
                                              (i = r[0]),
                                              (e = r[1]),
                                              i && (n = b(i))),
                                        {f: i ? i + `!` + e : e, n: e, pr: i, p: n}
                                    );
                                };
                                function C(e) {
                                    return function () {
                                        return (u && u.config && u.config[e]) || {};
                                    };
                                }
                                ((s = {
                                    require: function (e) {
                                        return _(e);
                                    },
                                    exports: function (e) {
                                        var t = c[e];
                                        return t === void 0 ? (c[e] = {}) : t;
                                    },
                                    module: function (e) {
                                        return {id: e, uri: ``, exports: c[e], config: C(e)};
                                    },
                                }),
                                    (i = function (e, n, r, i) {
                                        var a,
                                            u,
                                            f,
                                            p,
                                            m,
                                            g,
                                            v = [],
                                            x = typeof r,
                                            C;
                                        if (
                                            ((i ||= e),
                                            (g = S(i)),
                                            x === `undefined` || x === `function`)
                                        ) {
                                            for (
                                                n =
                                                    !n.length && r.length
                                                        ? [`require`, `exports`, `module`]
                                                        : n,
                                                    m = 0;
                                                m < n.length;
                                                m += 1
                                            )
                                                if (((p = o(n[m], g)), (u = p.f), u === `require`))
                                                    v[m] = s.require(e);
                                                else if (u === `exports`)
                                                    ((v[m] = s.exports(e)), (C = !0));
                                                else if (u === `module`) a = v[m] = s.module(e);
                                                else if (h(c, u) || h(l, u) || h(d, u)) v[m] = b(u);
                                                else if (p.p)
                                                    (p.p.load(p.n, _(i, !0), y(u), {}),
                                                        (v[m] = c[u]));
                                                else throw Error(e + ` missing ` + u);
                                            ((f = r ? r.apply(c[e], v) : void 0),
                                                e &&
                                                    (a && a.exports !== t && a.exports !== c[e]
                                                        ? (c[e] = a.exports)
                                                        : (f !== t || !C) && (c[e] = f)));
                                        } else e && (c[e] = r);
                                    }),
                                    (e =
                                        n =
                                        a =
                                            function (e, n, r, c, l) {
                                                if (typeof e == `string`)
                                                    return s[e] ? s[e](n) : b(o(e, S(n)).f);
                                                if (!e.splice) {
                                                    if (
                                                        ((u = e),
                                                        u.deps && a(u.deps, u.callback),
                                                        !n)
                                                    )
                                                        return;
                                                    n.splice
                                                        ? ((e = n), (n = r), (r = null))
                                                        : (e = t);
                                                }
                                                return (
                                                    (n ||= function () {}),
                                                    typeof r == `function` && ((r = c), (c = l)),
                                                    c
                                                        ? i(t, e, n, r)
                                                        : setTimeout(function () {
                                                              i(t, e, n, r);
                                                          }, 4),
                                                    a
                                                );
                                            }),
                                    (a.config = function (e) {
                                        return a(e);
                                    }),
                                    (e._defined = c),
                                    (r = function (e, t, n) {
                                        if (typeof e != `string`)
                                            throw Error(
                                                `See almond README: incorrect module build, no module name`,
                                            );
                                        (t.splice || ((n = t), (t = [])),
                                            !h(c, e) && !h(l, e) && (l[e] = [e, t, n]));
                                    }),
                                    (r.amd = {jQuery: !0}));
                            })(),
                                (t.requirejs = e),
                                (t.require = n),
                                (t.define = r));
                        }
                    })(),
                    t.define(`almond`, function () {}),
                    t.define(`jquery`, [], function () {
                        var t = e || $;
                        return (
                            t == null &&
                                console &&
                                console.error &&
                                console.error(
                                    `Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page.`,
                                ),
                            t
                        );
                    }),
                    t.define(`select2/utils`, [`jquery`], function (e) {
                        var t = {};
                        t.Extend = function (e, t) {
                            var n = {}.hasOwnProperty;
                            function r() {
                                this.constructor = e;
                            }
                            for (var i in t) n.call(t, i) && (e[i] = t[i]);
                            return (
                                (r.prototype = t.prototype),
                                (e.prototype = new r()),
                                (e.__super__ = t.prototype),
                                e
                            );
                        };
                        function n(e) {
                            var t = e.prototype,
                                n = [];
                            for (var r in t)
                                typeof t[r] == `function` && r !== `constructor` && n.push(r);
                            return n;
                        }
                        t.Decorate = function (e, t) {
                            var r = n(t),
                                i = n(e);
                            function a() {
                                var n = Array.prototype.unshift,
                                    r = t.prototype.constructor.length,
                                    i = e.prototype.constructor;
                                (r > 0 &&
                                    (n.call(arguments, e.prototype.constructor),
                                    (i = t.prototype.constructor)),
                                    i.apply(this, arguments));
                            }
                            t.displayName = e.displayName;
                            function o() {
                                this.constructor = a;
                            }
                            a.prototype = new o();
                            for (var s = 0; s < i.length; s++) {
                                var c = i[s];
                                a.prototype[c] = e.prototype[c];
                            }
                            for (
                                var l = function (e) {
                                        var n = function () {};
                                        (e in a.prototype) && (n = a.prototype[e]);
                                        var r = t.prototype[e];
                                        return function () {
                                            return (
                                                Array.prototype.unshift.call(arguments, n),
                                                r.apply(this, arguments)
                                            );
                                        };
                                    },
                                    u = 0;
                                u < r.length;
                                u++
                            ) {
                                var d = r[u];
                                a.prototype[d] = l(d);
                            }
                            return a;
                        };
                        var r = function () {
                            this.listeners = {};
                        };
                        ((r.prototype.on = function (e, t) {
                            ((this.listeners = this.listeners || {}),
                                e in this.listeners
                                    ? this.listeners[e].push(t)
                                    : (this.listeners[e] = [t]));
                        }),
                            (r.prototype.trigger = function (e) {
                                var t = Array.prototype.slice,
                                    n = t.call(arguments, 1);
                                ((this.listeners = this.listeners || {}),
                                    (n ??= []),
                                    n.length === 0 && n.push({}),
                                    (n[0]._type = e),
                                    e in this.listeners &&
                                        this.invoke(this.listeners[e], t.call(arguments, 1)),
                                    `*` in this.listeners &&
                                        this.invoke(this.listeners[`*`], arguments));
                            }),
                            (r.prototype.invoke = function (e, t) {
                                for (var n = 0, r = e.length; n < r; n++) e[n].apply(this, t);
                            }),
                            (t.Observable = r),
                            (t.generateChars = function (e) {
                                for (var t = ``, n = 0; n < e; n++) {
                                    var r = Math.floor(Math.random() * 36);
                                    t += r.toString(36);
                                }
                                return t;
                            }),
                            (t.bind = function (e, t) {
                                return function () {
                                    e.apply(t, arguments);
                                };
                            }),
                            (t._convertData = function (e) {
                                for (var t in e) {
                                    var n = t.split(`-`),
                                        r = e;
                                    if (n.length !== 1) {
                                        for (var i = 0; i < n.length; i++) {
                                            var a = n[i];
                                            ((a = a.substring(0, 1).toLowerCase() + a.substring(1)),
                                                a in r || (r[a] = {}),
                                                i == n.length - 1 && (r[a] = e[t]),
                                                (r = r[a]));
                                        }
                                        delete e[t];
                                    }
                                }
                                return e;
                            }),
                            (t.hasScroll = function (t, n) {
                                var r = e(n),
                                    i = n.style.overflowX,
                                    a = n.style.overflowY;
                                return i === a && (a === `hidden` || a === `visible`)
                                    ? !1
                                    : i === `scroll` || a === `scroll`
                                      ? !0
                                      : r.innerHeight() < n.scrollHeight ||
                                        r.innerWidth() < n.scrollWidth;
                            }),
                            (t.escapeMarkup = function (e) {
                                var t = {
                                    '\\': `&#92;`,
                                    '&': `&amp;`,
                                    '<': `&lt;`,
                                    '>': `&gt;`,
                                    '"': `&quot;`,
                                    "'": `&#39;`,
                                    '/': `&#47;`,
                                };
                                return typeof e == `string`
                                    ? String(e).replace(/[&<>"'\/\\]/g, function (e) {
                                          return t[e];
                                      })
                                    : e;
                            }),
                            (t.appendMany = function (t, n) {
                                if (e.fn.jquery.substr(0, 3) === `1.7`) {
                                    var r = e();
                                    (e.map(n, function (e) {
                                        r = r.add(e);
                                    }),
                                        (n = r));
                                }
                                t.append(n);
                            }),
                            (t.__cache = {}));
                        var i = 0;
                        return (
                            (t.GetUniqueElementId = function (e) {
                                var t = e.getAttribute(`data-select2-id`);
                                return (
                                    t ??
                                        (e.id
                                            ? ((t = e.id), e.setAttribute(`data-select2-id`, t))
                                            : (e.setAttribute(`data-select2-id`, ++i),
                                              (t = i.toString()))),
                                    t
                                );
                            }),
                            (t.StoreData = function (e, n, r) {
                                var i = t.GetUniqueElementId(e);
                                (t.__cache[i] || (t.__cache[i] = {}), (t.__cache[i][n] = r));
                            }),
                            (t.GetData = function (n, r) {
                                var i = t.GetUniqueElementId(n);
                                return r
                                    ? t.__cache[i]
                                        ? t.__cache[i][r] == null
                                            ? e(n).data(r)
                                            : t.__cache[i][r]
                                        : e(n).data(r)
                                    : t.__cache[i];
                            }),
                            (t.RemoveData = function (e) {
                                var n = t.GetUniqueElementId(e);
                                (t.__cache[n] != null && delete t.__cache[n],
                                    e.removeAttribute(`data-select2-id`));
                            }),
                            t
                        );
                    }),
                    t.define(`select2/results`, [`jquery`, `./utils`], function (e, t) {
                        function n(e, t, r) {
                            ((this.$element = e),
                                (this.data = r),
                                (this.options = t),
                                n.__super__.constructor.call(this));
                        }
                        return (
                            t.Extend(n, t.Observable),
                            (n.prototype.render = function () {
                                var t = e(
                                    `<ul class="select2-results__options" role="listbox"></ul>`,
                                );
                                return (
                                    this.options.get(`multiple`) &&
                                        t.attr(`aria-multiselectable`, `true`),
                                    (this.$results = t),
                                    t
                                );
                            }),
                            (n.prototype.clear = function () {
                                this.$results.empty();
                            }),
                            (n.prototype.displayMessage = function (t) {
                                var n = this.options.get(`escapeMarkup`);
                                (this.clear(), this.hideLoading());
                                var r = e(
                                        `<li role="alert" aria-live="assertive" class="select2-results__option"></li>`,
                                    ),
                                    i = this.options.get(`translations`).get(t.message);
                                (r.append(n(i(t.args))),
                                    (r[0].className += ` select2-results__message`),
                                    this.$results.append(r));
                            }),
                            (n.prototype.hideMessages = function () {
                                this.$results.find(`.select2-results__message`).remove();
                            }),
                            (n.prototype.append = function (e) {
                                this.hideLoading();
                                var t = [];
                                if (e.results == null || e.results.length === 0) {
                                    this.$results.children().length === 0 &&
                                        this.trigger(`results:message`, {message: `noResults`});
                                    return;
                                }
                                e.results = this.sort(e.results);
                                for (var n = 0; n < e.results.length; n++) {
                                    var r = e.results[n],
                                        i = this.option(r);
                                    t.push(i);
                                }
                                this.$results.append(t);
                            }),
                            (n.prototype.position = function (e, t) {
                                t.find(`.select2-results`).append(e);
                            }),
                            (n.prototype.sort = function (e) {
                                return this.options.get(`sorter`)(e);
                            }),
                            (n.prototype.highlightFirstItem = function () {
                                var e = this.$results.find(
                                        `.select2-results__option[aria-selected]`,
                                    ),
                                    t = e.filter(`[aria-selected=true]`);
                                (t.length > 0
                                    ? t.first().trigger(`mouseenter`)
                                    : e.first().trigger(`mouseenter`),
                                    this.ensureHighlightVisible());
                            }),
                            (n.prototype.setClasses = function () {
                                var n = this;
                                this.data.current(function (r) {
                                    var i = e.map(r, function (e) {
                                        return e.id.toString();
                                    });
                                    n.$results
                                        .find(`.select2-results__option[aria-selected]`)
                                        .each(function () {
                                            var n = e(this),
                                                r = t.GetData(this, `data`),
                                                a = `` + r.id;
                                            (r.element != null && r.element.selected) ||
                                            (r.element == null && e.inArray(a, i) > -1)
                                                ? n.attr(`aria-selected`, `true`)
                                                : n.attr(`aria-selected`, `false`);
                                        });
                                });
                            }),
                            (n.prototype.showLoading = function (e) {
                                this.hideLoading();
                                var t = {
                                        disabled: !0,
                                        loading: !0,
                                        text: this.options.get(`translations`).get(`searching`)(e),
                                    },
                                    n = this.option(t);
                                ((n.className += ` loading-results`), this.$results.prepend(n));
                            }),
                            (n.prototype.hideLoading = function () {
                                this.$results.find(`.loading-results`).remove();
                            }),
                            (n.prototype.option = function (n) {
                                var r = document.createElement(`li`);
                                r.className = `select2-results__option`;
                                var i = {role: `option`, 'aria-selected': `false`},
                                    a =
                                        window.Element.prototype.matches ||
                                        window.Element.prototype.msMatchesSelector ||
                                        window.Element.prototype.webkitMatchesSelector;
                                for (var o in (((n.element != null &&
                                    a.call(n.element, `:disabled`)) ||
                                    (n.element == null && n.disabled)) &&
                                    (delete i[`aria-selected`], (i[`aria-disabled`] = `true`)),
                                n.id ?? delete i[`aria-selected`],
                                n._resultId != null && (r.id = n._resultId),
                                n.title && (r.title = n.title),
                                n.children &&
                                    ((i.role = `group`),
                                    (i[`aria-label`] = n.text),
                                    delete i[`aria-selected`]),
                                i)) {
                                    var s = i[o];
                                    r.setAttribute(o, s);
                                }
                                if (n.children) {
                                    var c = e(r),
                                        l = document.createElement(`strong`);
                                    ((l.className = `select2-results__group`),
                                        e(l),
                                        this.template(n, l));
                                    for (var u = [], d = 0; d < n.children.length; d++) {
                                        var f = n.children[d],
                                            p = this.option(f);
                                        u.push(p);
                                    }
                                    var m = e(`<ul></ul>`, {
                                        class: `select2-results__options select2-results__options--nested`,
                                    });
                                    (m.append(u), c.append(l), c.append(m));
                                } else this.template(n, r);
                                return (t.StoreData(r, `data`, n), r);
                            }),
                            (n.prototype.bind = function (n, r) {
                                var i = this,
                                    a = n.id + `-results`;
                                (this.$results.attr(`id`, a),
                                    n.on(`results:all`, function (e) {
                                        (i.clear(),
                                            i.append(e.data),
                                            n.isOpen() && (i.setClasses(), i.highlightFirstItem()));
                                    }),
                                    n.on(`results:append`, function (e) {
                                        (i.append(e.data), n.isOpen() && i.setClasses());
                                    }),
                                    n.on(`query`, function (e) {
                                        (i.hideMessages(), i.showLoading(e));
                                    }),
                                    n.on(`select`, function () {
                                        n.isOpen() &&
                                            (i.setClasses(),
                                            i.options.get(`scrollAfterSelect`) &&
                                                i.highlightFirstItem());
                                    }),
                                    n.on(`unselect`, function () {
                                        n.isOpen() &&
                                            (i.setClasses(),
                                            i.options.get(`scrollAfterSelect`) &&
                                                i.highlightFirstItem());
                                    }),
                                    n.on(`open`, function () {
                                        (i.$results.attr(`aria-expanded`, `true`),
                                            i.$results.attr(`aria-hidden`, `false`),
                                            i.setClasses(),
                                            i.ensureHighlightVisible());
                                    }),
                                    n.on(`close`, function () {
                                        (i.$results.attr(`aria-expanded`, `false`),
                                            i.$results.attr(`aria-hidden`, `true`),
                                            i.$results.removeAttr(`aria-activedescendant`));
                                    }),
                                    n.on(`results:toggle`, function () {
                                        var e = i.getHighlightedResults();
                                        e.length !== 0 && e.trigger(`mouseup`);
                                    }),
                                    n.on(`results:select`, function () {
                                        var e = i.getHighlightedResults();
                                        if (e.length !== 0) {
                                            var n = t.GetData(e[0], `data`);
                                            e.attr(`aria-selected`) == `true`
                                                ? i.trigger(`close`, {})
                                                : i.trigger(`select`, {data: n});
                                        }
                                    }),
                                    n.on(`results:previous`, function () {
                                        var e = i.getHighlightedResults(),
                                            t = i.$results.find(`[aria-selected]`),
                                            n = t.index(e);
                                        if (!(n <= 0)) {
                                            var r = n - 1;
                                            e.length === 0 && (r = 0);
                                            var a = t.eq(r);
                                            a.trigger(`mouseenter`);
                                            var o = i.$results.offset().top,
                                                s = a.offset().top,
                                                c = i.$results.scrollTop() + (s - o);
                                            r === 0
                                                ? i.$results.scrollTop(0)
                                                : s - o < 0 && i.$results.scrollTop(c);
                                        }
                                    }),
                                    n.on(`results:next`, function () {
                                        var e = i.getHighlightedResults(),
                                            t = i.$results.find(`[aria-selected]`),
                                            n = t.index(e) + 1;
                                        if (!(n >= t.length)) {
                                            var r = t.eq(n);
                                            r.trigger(`mouseenter`);
                                            var a =
                                                    i.$results.offset().top +
                                                    i.$results.outerHeight(!1),
                                                o = r.offset().top + r.outerHeight(!1),
                                                s = i.$results.scrollTop() + o - a;
                                            n === 0
                                                ? i.$results.scrollTop(0)
                                                : o > a && i.$results.scrollTop(s);
                                        }
                                    }),
                                    n.on(`results:focus`, function (e) {
                                        e.element.addClass(`select2-results__option--highlighted`);
                                    }),
                                    n.on(`results:message`, function (e) {
                                        i.displayMessage(e);
                                    }),
                                    e.fn.mousewheel &&
                                        this.$results.on(`mousewheel`, function (e) {
                                            var t = i.$results.scrollTop(),
                                                n = i.$results.get(0).scrollHeight - t + e.deltaY,
                                                r = e.deltaY > 0 && t - e.deltaY <= 0,
                                                a = e.deltaY < 0 && n <= i.$results.height();
                                            r
                                                ? (i.$results.scrollTop(0),
                                                  e.preventDefault(),
                                                  e.stopPropagation())
                                                : a &&
                                                  (i.$results.scrollTop(
                                                      i.$results.get(0).scrollHeight -
                                                          i.$results.height(),
                                                  ),
                                                  e.preventDefault(),
                                                  e.stopPropagation());
                                        }),
                                    this.$results.on(
                                        `mouseup`,
                                        `.select2-results__option[aria-selected]`,
                                        function (n) {
                                            var r = e(this),
                                                a = t.GetData(this, `data`);
                                            if (r.attr(`aria-selected`) === `true`) {
                                                i.options.get(`multiple`)
                                                    ? i.trigger(`unselect`, {
                                                          originalEvent: n,
                                                          data: a,
                                                      })
                                                    : i.trigger(`close`, {});
                                                return;
                                            }
                                            i.trigger(`select`, {originalEvent: n, data: a});
                                        },
                                    ),
                                    this.$results.on(
                                        `mouseenter`,
                                        `.select2-results__option[aria-selected]`,
                                        function (n) {
                                            var r = t.GetData(this, `data`);
                                            (i
                                                .getHighlightedResults()
                                                .removeClass(
                                                    `select2-results__option--highlighted`,
                                                ),
                                                i.trigger(`results:focus`, {
                                                    data: r,
                                                    element: e(this),
                                                }));
                                        },
                                    ));
                            }),
                            (n.prototype.getHighlightedResults = function () {
                                return this.$results.find(`.select2-results__option--highlighted`);
                            }),
                            (n.prototype.destroy = function () {
                                this.$results.remove();
                            }),
                            (n.prototype.ensureHighlightVisible = function () {
                                var e = this.getHighlightedResults();
                                if (e.length !== 0) {
                                    var t = this.$results.find(`[aria-selected]`).index(e),
                                        n = this.$results.offset().top,
                                        r = e.offset().top,
                                        i = this.$results.scrollTop() + (r - n),
                                        a = r - n;
                                    ((i -= e.outerHeight(!1) * 2),
                                        t <= 2
                                            ? this.$results.scrollTop(0)
                                            : (a > this.$results.outerHeight() || a < 0) &&
                                              this.$results.scrollTop(i));
                                }
                            }),
                            (n.prototype.template = function (t, n) {
                                var r = this.options.get(`templateResult`),
                                    i = this.options.get(`escapeMarkup`),
                                    a = r(t, n);
                                a == null
                                    ? (n.style.display = `none`)
                                    : typeof a == `string`
                                      ? (n.innerHTML = i(a))
                                      : e(n).append(a);
                            }),
                            n
                        );
                    }),
                    t.define(`select2/keys`, [], function () {
                        return {
                            BACKSPACE: 8,
                            TAB: 9,
                            ENTER: 13,
                            SHIFT: 16,
                            CTRL: 17,
                            ALT: 18,
                            ESC: 27,
                            SPACE: 32,
                            PAGE_UP: 33,
                            PAGE_DOWN: 34,
                            END: 35,
                            HOME: 36,
                            LEFT: 37,
                            UP: 38,
                            RIGHT: 39,
                            DOWN: 40,
                            DELETE: 46,
                        };
                    }),
                    t.define(
                        `select2/selection/base`,
                        [`jquery`, `../utils`, `../keys`],
                        function (e, t, n) {
                            function r(e, t) {
                                ((this.$element = e),
                                    (this.options = t),
                                    r.__super__.constructor.call(this));
                            }
                            return (
                                t.Extend(r, t.Observable),
                                (r.prototype.render = function () {
                                    var n = e(
                                        `<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>`,
                                    );
                                    return (
                                        (this._tabindex = 0),
                                        t.GetData(this.$element[0], `old-tabindex`) == null
                                            ? this.$element.attr(`tabindex`) != null &&
                                              (this._tabindex = this.$element.attr(`tabindex`))
                                            : (this._tabindex = t.GetData(
                                                  this.$element[0],
                                                  `old-tabindex`,
                                              )),
                                        n.attr(`title`, this.$element.attr(`title`)),
                                        n.attr(`tabindex`, this._tabindex),
                                        n.attr(`aria-disabled`, `false`),
                                        (this.$selection = n),
                                        n
                                    );
                                }),
                                (r.prototype.bind = function (e, t) {
                                    var r = this,
                                        i = e.id + `-results`;
                                    ((this.container = e),
                                        this.$selection.on(`focus`, function (e) {
                                            r.trigger(`focus`, e);
                                        }),
                                        this.$selection.on(`blur`, function (e) {
                                            r._handleBlur(e);
                                        }),
                                        this.$selection.on(`keydown`, function (e) {
                                            (r.trigger(`keypress`, e),
                                                e.which === n.SPACE && e.preventDefault());
                                        }),
                                        e.on(`results:focus`, function (e) {
                                            r.$selection.attr(
                                                `aria-activedescendant`,
                                                e.data._resultId,
                                            );
                                        }),
                                        e.on(`selection:update`, function (e) {
                                            r.update(e.data);
                                        }),
                                        e.on(`open`, function () {
                                            (r.$selection.attr(`aria-expanded`, `true`),
                                                r.$selection.attr(`aria-owns`, i),
                                                r._attachCloseHandler(e));
                                        }),
                                        e.on(`close`, function () {
                                            (r.$selection.attr(`aria-expanded`, `false`),
                                                r.$selection.removeAttr(`aria-activedescendant`),
                                                r.$selection.removeAttr(`aria-owns`),
                                                r.$selection.trigger(`focus`),
                                                r._detachCloseHandler(e));
                                        }),
                                        e.on(`enable`, function () {
                                            (r.$selection.attr(`tabindex`, r._tabindex),
                                                r.$selection.attr(`aria-disabled`, `false`));
                                        }),
                                        e.on(`disable`, function () {
                                            (r.$selection.attr(`tabindex`, `-1`),
                                                r.$selection.attr(`aria-disabled`, `true`));
                                        }));
                                }),
                                (r.prototype._handleBlur = function (t) {
                                    var n = this;
                                    window.setTimeout(function () {
                                        document.activeElement == n.$selection[0] ||
                                            e.contains(n.$selection[0], document.activeElement) ||
                                            n.trigger(`blur`, t);
                                    }, 1);
                                }),
                                (r.prototype._attachCloseHandler = function (n) {
                                    e(document.body).on(`mousedown.select2.` + n.id, function (n) {
                                        var r = e(n.target).closest(`.select2`);
                                        e(`.select2.select2-container--open`).each(function () {
                                            this != r[0] &&
                                                t.GetData(this, `element`).select2(`close`);
                                        });
                                    });
                                }),
                                (r.prototype._detachCloseHandler = function (t) {
                                    e(document.body).off(`mousedown.select2.` + t.id);
                                }),
                                (r.prototype.position = function (e, t) {
                                    t.find(`.selection`).append(e);
                                }),
                                (r.prototype.destroy = function () {
                                    this._detachCloseHandler(this.container);
                                }),
                                (r.prototype.update = function (e) {
                                    throw Error(
                                        'The `update` method must be defined in child classes.',
                                    );
                                }),
                                (r.prototype.isEnabled = function () {
                                    return !this.isDisabled();
                                }),
                                (r.prototype.isDisabled = function () {
                                    return this.options.get(`disabled`);
                                }),
                                r
                            );
                        },
                    ),
                    t.define(
                        `select2/selection/single`,
                        [`jquery`, `./base`, `../utils`, `../keys`],
                        function (e, t, n, r) {
                            function i() {
                                i.__super__.constructor.apply(this, arguments);
                            }
                            return (
                                n.Extend(i, t),
                                (i.prototype.render = function () {
                                    var e = i.__super__.render.call(this);
                                    return (
                                        e.addClass(`select2-selection--single`),
                                        e.html(
                                            `<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>`,
                                        ),
                                        e
                                    );
                                }),
                                (i.prototype.bind = function (e, t) {
                                    var n = this;
                                    i.__super__.bind.apply(this, arguments);
                                    var r = e.id + `-container`;
                                    (this.$selection
                                        .find(`.select2-selection__rendered`)
                                        .attr(`id`, r)
                                        .attr(`role`, `textbox`)
                                        .attr(`aria-readonly`, `true`),
                                        this.$selection.attr(`aria-labelledby`, r),
                                        this.$selection.on(`mousedown`, function (e) {
                                            e.which === 1 &&
                                                n.trigger(`toggle`, {originalEvent: e});
                                        }),
                                        this.$selection.on(`focus`, function (e) {}),
                                        this.$selection.on(`blur`, function (e) {}),
                                        e.on(`focus`, function (t) {
                                            e.isOpen() || n.$selection.trigger(`focus`);
                                        }));
                                }),
                                (i.prototype.clear = function () {
                                    var e = this.$selection.find(`.select2-selection__rendered`);
                                    (e.empty(), e.removeAttr(`title`));
                                }),
                                (i.prototype.display = function (e, t) {
                                    var n = this.options.get(`templateSelection`);
                                    return this.options.get(`escapeMarkup`)(n(e, t));
                                }),
                                (i.prototype.selectionContainer = function () {
                                    return e(`<span></span>`);
                                }),
                                (i.prototype.update = function (e) {
                                    if (e.length === 0) {
                                        this.clear();
                                        return;
                                    }
                                    var t = e[0],
                                        n = this.$selection.find(`.select2-selection__rendered`),
                                        r = this.display(t, n);
                                    n.empty().append(r);
                                    var i = t.title || t.text;
                                    i ? n.attr(`title`, i) : n.removeAttr(`title`);
                                }),
                                i
                            );
                        },
                    ),
                    t.define(
                        `select2/selection/multiple`,
                        [`jquery`, `./base`, `../utils`],
                        function (e, t, n) {
                            function r(e, t) {
                                r.__super__.constructor.apply(this, arguments);
                            }
                            return (
                                n.Extend(r, t),
                                (r.prototype.render = function () {
                                    var e = r.__super__.render.call(this);
                                    return (
                                        e.addClass(`select2-selection--multiple`),
                                        e.html(`<ul class="select2-selection__rendered"></ul>`),
                                        e
                                    );
                                }),
                                (r.prototype.bind = function (t, i) {
                                    var a = this;
                                    (r.__super__.bind.apply(this, arguments),
                                        this.$selection.on(`click`, function (e) {
                                            a.trigger(`toggle`, {originalEvent: e});
                                        }),
                                        this.$selection.on(
                                            `click`,
                                            `.select2-selection__choice__remove`,
                                            function (t) {
                                                if (!a.isDisabled()) {
                                                    var r = e(this).parent(),
                                                        i = n.GetData(r[0], `data`);
                                                    a.trigger(`unselect`, {
                                                        originalEvent: t,
                                                        data: i,
                                                    });
                                                }
                                            },
                                        ));
                                }),
                                (r.prototype.clear = function () {
                                    var e = this.$selection.find(`.select2-selection__rendered`);
                                    (e.empty(), e.removeAttr(`title`));
                                }),
                                (r.prototype.display = function (e, t) {
                                    var n = this.options.get(`templateSelection`);
                                    return this.options.get(`escapeMarkup`)(n(e, t));
                                }),
                                (r.prototype.selectionContainer = function () {
                                    return e(
                                        `<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>`,
                                    );
                                }),
                                (r.prototype.update = function (e) {
                                    if ((this.clear(), e.length !== 0)) {
                                        for (var t = [], r = 0; r < e.length; r++) {
                                            var i = e[r],
                                                a = this.selectionContainer(),
                                                o = this.display(i, a);
                                            a.append(o);
                                            var s = i.title || i.text;
                                            (s && a.attr(`title`, s),
                                                n.StoreData(a[0], `data`, i),
                                                t.push(a));
                                        }
                                        var c = this.$selection.find(
                                            `.select2-selection__rendered`,
                                        );
                                        n.appendMany(c, t);
                                    }
                                }),
                                r
                            );
                        },
                    ),
                    t.define(`select2/selection/placeholder`, [`../utils`], function (e) {
                        function t(e, t, n) {
                            ((this.placeholder = this.normalizePlaceholder(n.get(`placeholder`))),
                                e.call(this, t, n));
                        }
                        return (
                            (t.prototype.normalizePlaceholder = function (e, t) {
                                return (typeof t == `string` && (t = {id: ``, text: t}), t);
                            }),
                            (t.prototype.createPlaceholder = function (e, t) {
                                var n = this.selectionContainer();
                                return (
                                    n.html(this.display(t)),
                                    n
                                        .addClass(`select2-selection__placeholder`)
                                        .removeClass(`select2-selection__choice`),
                                    n
                                );
                            }),
                            (t.prototype.update = function (e, t) {
                                var n = t.length == 1 && t[0].id != this.placeholder.id;
                                if (t.length > 1 || n) return e.call(this, t);
                                this.clear();
                                var r = this.createPlaceholder(this.placeholder);
                                this.$selection.find(`.select2-selection__rendered`).append(r);
                            }),
                            t
                        );
                    }),
                    t.define(
                        `select2/selection/allowClear`,
                        [`jquery`, `../keys`, `../utils`],
                        function (e, t, n) {
                            function r() {}
                            return (
                                (r.prototype.bind = function (e, t, n) {
                                    var r = this;
                                    (e.call(this, t, n),
                                        this.placeholder == null &&
                                            this.options.get(`debug`) &&
                                            window.console &&
                                            console.error &&
                                            console.error(
                                                'Select2: The `allowClear` option should be used in combination with the `placeholder` option.',
                                            ),
                                        this.$selection.on(
                                            `mousedown`,
                                            `.select2-selection__clear`,
                                            function (e) {
                                                r._handleClear(e);
                                            },
                                        ),
                                        t.on(`keypress`, function (e) {
                                            r._handleKeyboardClear(e, t);
                                        }));
                                }),
                                (r.prototype._handleClear = function (e, t) {
                                    if (!this.isDisabled()) {
                                        var r = this.$selection.find(`.select2-selection__clear`);
                                        if (r.length !== 0) {
                                            t.stopPropagation();
                                            var i = n.GetData(r[0], `data`),
                                                a = this.$element.val();
                                            this.$element.val(this.placeholder.id);
                                            var o = {data: i};
                                            if ((this.trigger(`clear`, o), o.prevented)) {
                                                this.$element.val(a);
                                                return;
                                            }
                                            for (var s = 0; s < i.length; s++)
                                                if (
                                                    ((o = {data: i[s]}),
                                                    this.trigger(`unselect`, o),
                                                    o.prevented)
                                                ) {
                                                    this.$element.val(a);
                                                    return;
                                                }
                                            (this.$element.trigger(`input`).trigger(`change`),
                                                this.trigger(`toggle`, {}));
                                        }
                                    }
                                }),
                                (r.prototype._handleKeyboardClear = function (e, n, r) {
                                    r.isOpen() ||
                                        ((n.which == t.DELETE || n.which == t.BACKSPACE) &&
                                            this._handleClear(n));
                                }),
                                (r.prototype.update = function (t, r) {
                                    if (
                                        (t.call(this, r),
                                        !(
                                            this.$selection.find(`.select2-selection__placeholder`)
                                                .length > 0 || r.length === 0
                                        ))
                                    ) {
                                        var i = e(
                                            `<span class="select2-selection__clear" title="` +
                                                this.options
                                                    .get(`translations`)
                                                    .get(`removeAllItems`)() +
                                                `">&times;</span>`,
                                        );
                                        (n.StoreData(i[0], `data`, r),
                                            this.$selection
                                                .find(`.select2-selection__rendered`)
                                                .prepend(i));
                                    }
                                }),
                                r
                            );
                        },
                    ),
                    t.define(
                        `select2/selection/search`,
                        [`jquery`, `../utils`, `../keys`],
                        function (e, t, n) {
                            function r(e, t, n) {
                                e.call(this, t, n);
                            }
                            return (
                                (r.prototype.render = function (t) {
                                    var n = e(
                                        `<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></li>`,
                                    );
                                    ((this.$searchContainer = n), (this.$search = n.find(`input`)));
                                    var r = t.call(this);
                                    return (this._transferTabIndex(), r);
                                }),
                                (r.prototype.bind = function (e, r, i) {
                                    var a = this,
                                        o = r.id + `-results`;
                                    (e.call(this, r, i),
                                        r.on(`open`, function () {
                                            (a.$search.attr(`aria-controls`, o),
                                                a.$search.trigger(`focus`));
                                        }),
                                        r.on(`close`, function () {
                                            (a.$search.val(``),
                                                a.$search.removeAttr(`aria-controls`),
                                                a.$search.removeAttr(`aria-activedescendant`),
                                                a.$search.trigger(`focus`));
                                        }),
                                        r.on(`enable`, function () {
                                            (a.$search.prop(`disabled`, !1), a._transferTabIndex());
                                        }),
                                        r.on(`disable`, function () {
                                            a.$search.prop(`disabled`, !0);
                                        }),
                                        r.on(`focus`, function (e) {
                                            a.$search.trigger(`focus`);
                                        }),
                                        r.on(`results:focus`, function (e) {
                                            e.data._resultId
                                                ? a.$search.attr(
                                                      `aria-activedescendant`,
                                                      e.data._resultId,
                                                  )
                                                : a.$search.removeAttr(`aria-activedescendant`);
                                        }),
                                        this.$selection.on(
                                            `focusin`,
                                            `.select2-search--inline`,
                                            function (e) {
                                                a.trigger(`focus`, e);
                                            },
                                        ),
                                        this.$selection.on(
                                            `focusout`,
                                            `.select2-search--inline`,
                                            function (e) {
                                                a._handleBlur(e);
                                            },
                                        ),
                                        this.$selection.on(
                                            `keydown`,
                                            `.select2-search--inline`,
                                            function (e) {
                                                if (
                                                    (e.stopPropagation(),
                                                    a.trigger(`keypress`, e),
                                                    (a._keyUpPrevented = e.isDefaultPrevented()),
                                                    e.which === n.BACKSPACE &&
                                                        a.$search.val() === ``)
                                                ) {
                                                    var r = a.$searchContainer.prev(
                                                        `.select2-selection__choice`,
                                                    );
                                                    if (r.length > 0) {
                                                        var i = t.GetData(r[0], `data`);
                                                        (a.searchRemoveChoice(i),
                                                            e.preventDefault());
                                                    }
                                                }
                                            },
                                        ),
                                        this.$selection.on(
                                            `click`,
                                            `.select2-search--inline`,
                                            function (e) {
                                                a.$search.val() && e.stopPropagation();
                                            },
                                        ));
                                    var s = document.documentMode,
                                        c = s && s <= 11;
                                    (this.$selection.on(
                                        `input.searchcheck`,
                                        `.select2-search--inline`,
                                        function (e) {
                                            if (c) {
                                                a.$selection.off(`input.search input.searchcheck`);
                                                return;
                                            }
                                            a.$selection.off(`keyup.search`);
                                        },
                                    ),
                                        this.$selection.on(
                                            `keyup.search input.search`,
                                            `.select2-search--inline`,
                                            function (e) {
                                                if (c && e.type === `input`) {
                                                    a.$selection.off(
                                                        `input.search input.searchcheck`,
                                                    );
                                                    return;
                                                }
                                                var t = e.which;
                                                t == n.SHIFT ||
                                                    t == n.CTRL ||
                                                    t == n.ALT ||
                                                    (t != n.TAB && a.handleSearch(e));
                                            },
                                        ));
                                }),
                                (r.prototype._transferTabIndex = function (e) {
                                    (this.$search.attr(
                                        `tabindex`,
                                        this.$selection.attr(`tabindex`),
                                    ),
                                        this.$selection.attr(`tabindex`, `-1`));
                                }),
                                (r.prototype.createPlaceholder = function (e, t) {
                                    this.$search.attr(`placeholder`, t.text);
                                }),
                                (r.prototype.update = function (e, t) {
                                    var n = this.$search[0] == document.activeElement;
                                    (this.$search.attr(`placeholder`, ``),
                                        e.call(this, t),
                                        this.$selection
                                            .find(`.select2-selection__rendered`)
                                            .append(this.$searchContainer),
                                        this.resizeSearch(),
                                        n && this.$search.trigger(`focus`));
                                }),
                                (r.prototype.handleSearch = function () {
                                    if ((this.resizeSearch(), !this._keyUpPrevented)) {
                                        var e = this.$search.val();
                                        this.trigger(`query`, {term: e});
                                    }
                                    this._keyUpPrevented = !1;
                                }),
                                (r.prototype.searchRemoveChoice = function (e, t) {
                                    (this.trigger(`unselect`, {data: t}),
                                        this.$search.val(t.text),
                                        this.handleSearch());
                                }),
                                (r.prototype.resizeSearch = function () {
                                    this.$search.css(`width`, `25px`);
                                    var e = ``;
                                    ((e =
                                        this.$search.attr(`placeholder`) === ``
                                            ? (this.$search.val().length + 1) * 0.75 + `em`
                                            : this.$selection
                                                  .find(`.select2-selection__rendered`)
                                                  .width()),
                                        this.$search.css(`width`, e));
                                }),
                                r
                            );
                        },
                    ),
                    t.define(`select2/selection/eventRelay`, [`jquery`], function (e) {
                        function t() {}
                        return (
                            (t.prototype.bind = function (t, n, r) {
                                var i = this,
                                    a = [
                                        `open`,
                                        `opening`,
                                        `close`,
                                        `closing`,
                                        `select`,
                                        `selecting`,
                                        `unselect`,
                                        `unselecting`,
                                        `clear`,
                                        `clearing`,
                                    ],
                                    o = [
                                        `opening`,
                                        `closing`,
                                        `selecting`,
                                        `unselecting`,
                                        `clearing`,
                                    ];
                                (t.call(this, n, r),
                                    n.on(`*`, function (t, n) {
                                        if (e.inArray(t, a) !== -1) {
                                            n ||= {};
                                            var r = e.Event(`select2:` + t, {params: n});
                                            (i.$element.trigger(r),
                                                e.inArray(t, o) !== -1 &&
                                                    (n.prevented = r.isDefaultPrevented()));
                                        }
                                    }));
                            }),
                            t
                        );
                    }),
                    t.define(`select2/translation`, [`jquery`, `require`], function (e, t) {
                        function n(e) {
                            this.dict = e || {};
                        }
                        return (
                            (n.prototype.all = function () {
                                return this.dict;
                            }),
                            (n.prototype.get = function (e) {
                                return this.dict[e];
                            }),
                            (n.prototype.extend = function (t) {
                                this.dict = e.extend({}, t.all(), this.dict);
                            }),
                            (n._cache = {}),
                            (n.loadPath = function (e) {
                                if (!(e in n._cache)) {
                                    var r = t(e);
                                    n._cache[e] = r;
                                }
                                return new n(n._cache[e]);
                            }),
                            n
                        );
                    }),
                    t.define(`select2/diacritics`, [], function () {
                        return {
                            'Ⓐ': `A`,
                            Ａ: `A`,
                            À: `A`,
                            Á: `A`,
                            Â: `A`,
                            Ầ: `A`,
                            Ấ: `A`,
                            Ẫ: `A`,
                            Ẩ: `A`,
                            Ã: `A`,
                            Ā: `A`,
                            Ă: `A`,
                            Ằ: `A`,
                            Ắ: `A`,
                            Ẵ: `A`,
                            Ẳ: `A`,
                            Ȧ: `A`,
                            Ǡ: `A`,
                            Ä: `A`,
                            Ǟ: `A`,
                            Ả: `A`,
                            Å: `A`,
                            Ǻ: `A`,
                            Ǎ: `A`,
                            Ȁ: `A`,
                            Ȃ: `A`,
                            Ạ: `A`,
                            Ậ: `A`,
                            Ặ: `A`,
                            Ḁ: `A`,
                            Ą: `A`,
                            Ⱥ: `A`,
                            Ɐ: `A`,
                            Ꜳ: `AA`,
                            Æ: `AE`,
                            Ǽ: `AE`,
                            Ǣ: `AE`,
                            Ꜵ: `AO`,
                            Ꜷ: `AU`,
                            Ꜹ: `AV`,
                            Ꜻ: `AV`,
                            Ꜽ: `AY`,
                            'Ⓑ': `B`,
                            Ｂ: `B`,
                            Ḃ: `B`,
                            Ḅ: `B`,
                            Ḇ: `B`,
                            Ƀ: `B`,
                            Ƃ: `B`,
                            Ɓ: `B`,
                            'Ⓒ': `C`,
                            Ｃ: `C`,
                            Ć: `C`,
                            Ĉ: `C`,
                            Ċ: `C`,
                            Č: `C`,
                            Ç: `C`,
                            Ḉ: `C`,
                            Ƈ: `C`,
                            Ȼ: `C`,
                            Ꜿ: `C`,
                            'Ⓓ': `D`,
                            Ｄ: `D`,
                            Ḋ: `D`,
                            Ď: `D`,
                            Ḍ: `D`,
                            Ḑ: `D`,
                            Ḓ: `D`,
                            Ḏ: `D`,
                            Đ: `D`,
                            Ƌ: `D`,
                            Ɗ: `D`,
                            Ɖ: `D`,
                            Ꝺ: `D`,
                            Ǳ: `DZ`,
                            Ǆ: `DZ`,
                            ǲ: `Dz`,
                            ǅ: `Dz`,
                            'Ⓔ': `E`,
                            Ｅ: `E`,
                            È: `E`,
                            É: `E`,
                            Ê: `E`,
                            Ề: `E`,
                            Ế: `E`,
                            Ễ: `E`,
                            Ể: `E`,
                            Ẽ: `E`,
                            Ē: `E`,
                            Ḕ: `E`,
                            Ḗ: `E`,
                            Ĕ: `E`,
                            Ė: `E`,
                            Ë: `E`,
                            Ẻ: `E`,
                            Ě: `E`,
                            Ȅ: `E`,
                            Ȇ: `E`,
                            Ẹ: `E`,
                            Ệ: `E`,
                            Ȩ: `E`,
                            Ḝ: `E`,
                            Ę: `E`,
                            Ḙ: `E`,
                            Ḛ: `E`,
                            Ɛ: `E`,
                            Ǝ: `E`,
                            'Ⓕ': `F`,
                            Ｆ: `F`,
                            Ḟ: `F`,
                            Ƒ: `F`,
                            Ꝼ: `F`,
                            'Ⓖ': `G`,
                            Ｇ: `G`,
                            Ǵ: `G`,
                            Ĝ: `G`,
                            Ḡ: `G`,
                            Ğ: `G`,
                            Ġ: `G`,
                            Ǧ: `G`,
                            Ģ: `G`,
                            Ǥ: `G`,
                            Ɠ: `G`,
                            Ꞡ: `G`,
                            Ᵹ: `G`,
                            Ꝿ: `G`,
                            'Ⓗ': `H`,
                            Ｈ: `H`,
                            Ĥ: `H`,
                            Ḣ: `H`,
                            Ḧ: `H`,
                            Ȟ: `H`,
                            Ḥ: `H`,
                            Ḩ: `H`,
                            Ḫ: `H`,
                            Ħ: `H`,
                            Ⱨ: `H`,
                            Ⱶ: `H`,
                            Ɥ: `H`,
                            'Ⓘ': `I`,
                            Ｉ: `I`,
                            Ì: `I`,
                            Í: `I`,
                            Î: `I`,
                            Ĩ: `I`,
                            Ī: `I`,
                            Ĭ: `I`,
                            İ: `I`,
                            Ï: `I`,
                            Ḯ: `I`,
                            Ỉ: `I`,
                            Ǐ: `I`,
                            Ȉ: `I`,
                            Ȋ: `I`,
                            Ị: `I`,
                            Į: `I`,
                            Ḭ: `I`,
                            Ɨ: `I`,
                            'Ⓙ': `J`,
                            Ｊ: `J`,
                            Ĵ: `J`,
                            Ɉ: `J`,
                            'Ⓚ': `K`,
                            Ｋ: `K`,
                            Ḱ: `K`,
                            Ǩ: `K`,
                            Ḳ: `K`,
                            Ķ: `K`,
                            Ḵ: `K`,
                            Ƙ: `K`,
                            Ⱪ: `K`,
                            Ꝁ: `K`,
                            Ꝃ: `K`,
                            Ꝅ: `K`,
                            Ꞣ: `K`,
                            'Ⓛ': `L`,
                            Ｌ: `L`,
                            Ŀ: `L`,
                            Ĺ: `L`,
                            Ľ: `L`,
                            Ḷ: `L`,
                            Ḹ: `L`,
                            Ļ: `L`,
                            Ḽ: `L`,
                            Ḻ: `L`,
                            Ł: `L`,
                            Ƚ: `L`,
                            Ɫ: `L`,
                            Ⱡ: `L`,
                            Ꝉ: `L`,
                            Ꝇ: `L`,
                            Ꞁ: `L`,
                            Ǉ: `LJ`,
                            ǈ: `Lj`,
                            'Ⓜ': `M`,
                            Ｍ: `M`,
                            Ḿ: `M`,
                            Ṁ: `M`,
                            Ṃ: `M`,
                            Ɱ: `M`,
                            Ɯ: `M`,
                            'Ⓝ': `N`,
                            Ｎ: `N`,
                            Ǹ: `N`,
                            Ń: `N`,
                            Ñ: `N`,
                            Ṅ: `N`,
                            Ň: `N`,
                            Ṇ: `N`,
                            Ņ: `N`,
                            Ṋ: `N`,
                            Ṉ: `N`,
                            Ƞ: `N`,
                            Ɲ: `N`,
                            Ꞑ: `N`,
                            Ꞥ: `N`,
                            Ǌ: `NJ`,
                            ǋ: `Nj`,
                            'Ⓞ': `O`,
                            Ｏ: `O`,
                            Ò: `O`,
                            Ó: `O`,
                            Ô: `O`,
                            Ồ: `O`,
                            Ố: `O`,
                            Ỗ: `O`,
                            Ổ: `O`,
                            Õ: `O`,
                            Ṍ: `O`,
                            Ȭ: `O`,
                            Ṏ: `O`,
                            Ō: `O`,
                            Ṑ: `O`,
                            Ṓ: `O`,
                            Ŏ: `O`,
                            Ȯ: `O`,
                            Ȱ: `O`,
                            Ö: `O`,
                            Ȫ: `O`,
                            Ỏ: `O`,
                            Ő: `O`,
                            Ǒ: `O`,
                            Ȍ: `O`,
                            Ȏ: `O`,
                            Ơ: `O`,
                            Ờ: `O`,
                            Ớ: `O`,
                            Ỡ: `O`,
                            Ở: `O`,
                            Ợ: `O`,
                            Ọ: `O`,
                            Ộ: `O`,
                            Ǫ: `O`,
                            Ǭ: `O`,
                            Ø: `O`,
                            Ǿ: `O`,
                            Ɔ: `O`,
                            Ɵ: `O`,
                            Ꝋ: `O`,
                            Ꝍ: `O`,
                            Œ: `OE`,
                            Ƣ: `OI`,
                            Ꝏ: `OO`,
                            Ȣ: `OU`,
                            'Ⓟ': `P`,
                            Ｐ: `P`,
                            Ṕ: `P`,
                            Ṗ: `P`,
                            Ƥ: `P`,
                            Ᵽ: `P`,
                            Ꝑ: `P`,
                            Ꝓ: `P`,
                            Ꝕ: `P`,
                            'Ⓠ': `Q`,
                            Ｑ: `Q`,
                            Ꝗ: `Q`,
                            Ꝙ: `Q`,
                            Ɋ: `Q`,
                            'Ⓡ': `R`,
                            Ｒ: `R`,
                            Ŕ: `R`,
                            Ṙ: `R`,
                            Ř: `R`,
                            Ȑ: `R`,
                            Ȓ: `R`,
                            Ṛ: `R`,
                            Ṝ: `R`,
                            Ŗ: `R`,
                            Ṟ: `R`,
                            Ɍ: `R`,
                            Ɽ: `R`,
                            Ꝛ: `R`,
                            Ꞧ: `R`,
                            Ꞃ: `R`,
                            'Ⓢ': `S`,
                            Ｓ: `S`,
                            ẞ: `S`,
                            Ś: `S`,
                            Ṥ: `S`,
                            Ŝ: `S`,
                            Ṡ: `S`,
                            Š: `S`,
                            Ṧ: `S`,
                            Ṣ: `S`,
                            Ṩ: `S`,
                            Ș: `S`,
                            Ş: `S`,
                            Ȿ: `S`,
                            Ꞩ: `S`,
                            Ꞅ: `S`,
                            'Ⓣ': `T`,
                            Ｔ: `T`,
                            Ṫ: `T`,
                            Ť: `T`,
                            Ṭ: `T`,
                            Ț: `T`,
                            Ţ: `T`,
                            Ṱ: `T`,
                            Ṯ: `T`,
                            Ŧ: `T`,
                            Ƭ: `T`,
                            Ʈ: `T`,
                            Ⱦ: `T`,
                            Ꞇ: `T`,
                            Ꜩ: `TZ`,
                            'Ⓤ': `U`,
                            Ｕ: `U`,
                            Ù: `U`,
                            Ú: `U`,
                            Û: `U`,
                            Ũ: `U`,
                            Ṹ: `U`,
                            Ū: `U`,
                            Ṻ: `U`,
                            Ŭ: `U`,
                            Ü: `U`,
                            Ǜ: `U`,
                            Ǘ: `U`,
                            Ǖ: `U`,
                            Ǚ: `U`,
                            Ủ: `U`,
                            Ů: `U`,
                            Ű: `U`,
                            Ǔ: `U`,
                            Ȕ: `U`,
                            Ȗ: `U`,
                            Ư: `U`,
                            Ừ: `U`,
                            Ứ: `U`,
                            Ữ: `U`,
                            Ử: `U`,
                            Ự: `U`,
                            Ụ: `U`,
                            Ṳ: `U`,
                            Ų: `U`,
                            Ṷ: `U`,
                            Ṵ: `U`,
                            Ʉ: `U`,
                            'Ⓥ': `V`,
                            Ｖ: `V`,
                            Ṽ: `V`,
                            Ṿ: `V`,
                            Ʋ: `V`,
                            Ꝟ: `V`,
                            Ʌ: `V`,
                            Ꝡ: `VY`,
                            'Ⓦ': `W`,
                            Ｗ: `W`,
                            Ẁ: `W`,
                            Ẃ: `W`,
                            Ŵ: `W`,
                            Ẇ: `W`,
                            Ẅ: `W`,
                            Ẉ: `W`,
                            Ⱳ: `W`,
                            'Ⓧ': `X`,
                            Ｘ: `X`,
                            Ẋ: `X`,
                            Ẍ: `X`,
                            'Ⓨ': `Y`,
                            Ｙ: `Y`,
                            Ỳ: `Y`,
                            Ý: `Y`,
                            Ŷ: `Y`,
                            Ỹ: `Y`,
                            Ȳ: `Y`,
                            Ẏ: `Y`,
                            Ÿ: `Y`,
                            Ỷ: `Y`,
                            Ỵ: `Y`,
                            Ƴ: `Y`,
                            Ɏ: `Y`,
                            Ỿ: `Y`,
                            'Ⓩ': `Z`,
                            Ｚ: `Z`,
                            Ź: `Z`,
                            Ẑ: `Z`,
                            Ż: `Z`,
                            Ž: `Z`,
                            Ẓ: `Z`,
                            Ẕ: `Z`,
                            Ƶ: `Z`,
                            Ȥ: `Z`,
                            Ɀ: `Z`,
                            Ⱬ: `Z`,
                            Ꝣ: `Z`,
                            'ⓐ': `a`,
                            ａ: `a`,
                            ẚ: `a`,
                            à: `a`,
                            á: `a`,
                            â: `a`,
                            ầ: `a`,
                            ấ: `a`,
                            ẫ: `a`,
                            ẩ: `a`,
                            ã: `a`,
                            ā: `a`,
                            ă: `a`,
                            ằ: `a`,
                            ắ: `a`,
                            ẵ: `a`,
                            ẳ: `a`,
                            ȧ: `a`,
                            ǡ: `a`,
                            ä: `a`,
                            ǟ: `a`,
                            ả: `a`,
                            å: `a`,
                            ǻ: `a`,
                            ǎ: `a`,
                            ȁ: `a`,
                            ȃ: `a`,
                            ạ: `a`,
                            ậ: `a`,
                            ặ: `a`,
                            ḁ: `a`,
                            ą: `a`,
                            ⱥ: `a`,
                            ɐ: `a`,
                            ꜳ: `aa`,
                            æ: `ae`,
                            ǽ: `ae`,
                            ǣ: `ae`,
                            ꜵ: `ao`,
                            ꜷ: `au`,
                            ꜹ: `av`,
                            ꜻ: `av`,
                            ꜽ: `ay`,
                            'ⓑ': `b`,
                            ｂ: `b`,
                            ḃ: `b`,
                            ḅ: `b`,
                            ḇ: `b`,
                            ƀ: `b`,
                            ƃ: `b`,
                            ɓ: `b`,
                            'ⓒ': `c`,
                            ｃ: `c`,
                            ć: `c`,
                            ĉ: `c`,
                            ċ: `c`,
                            č: `c`,
                            ç: `c`,
                            ḉ: `c`,
                            ƈ: `c`,
                            ȼ: `c`,
                            ꜿ: `c`,
                            ↄ: `c`,
                            'ⓓ': `d`,
                            ｄ: `d`,
                            ḋ: `d`,
                            ď: `d`,
                            ḍ: `d`,
                            ḑ: `d`,
                            ḓ: `d`,
                            ḏ: `d`,
                            đ: `d`,
                            ƌ: `d`,
                            ɖ: `d`,
                            ɗ: `d`,
                            ꝺ: `d`,
                            ǳ: `dz`,
                            ǆ: `dz`,
                            'ⓔ': `e`,
                            ｅ: `e`,
                            è: `e`,
                            é: `e`,
                            ê: `e`,
                            ề: `e`,
                            ế: `e`,
                            ễ: `e`,
                            ể: `e`,
                            ẽ: `e`,
                            ē: `e`,
                            ḕ: `e`,
                            ḗ: `e`,
                            ĕ: `e`,
                            ė: `e`,
                            ë: `e`,
                            ẻ: `e`,
                            ě: `e`,
                            ȅ: `e`,
                            ȇ: `e`,
                            ẹ: `e`,
                            ệ: `e`,
                            ȩ: `e`,
                            ḝ: `e`,
                            ę: `e`,
                            ḙ: `e`,
                            ḛ: `e`,
                            ɇ: `e`,
                            ɛ: `e`,
                            ǝ: `e`,
                            'ⓕ': `f`,
                            ｆ: `f`,
                            ḟ: `f`,
                            ƒ: `f`,
                            ꝼ: `f`,
                            'ⓖ': `g`,
                            ｇ: `g`,
                            ǵ: `g`,
                            ĝ: `g`,
                            ḡ: `g`,
                            ğ: `g`,
                            ġ: `g`,
                            ǧ: `g`,
                            ģ: `g`,
                            ǥ: `g`,
                            ɠ: `g`,
                            ꞡ: `g`,
                            ᵹ: `g`,
                            ꝿ: `g`,
                            'ⓗ': `h`,
                            ｈ: `h`,
                            ĥ: `h`,
                            ḣ: `h`,
                            ḧ: `h`,
                            ȟ: `h`,
                            ḥ: `h`,
                            ḩ: `h`,
                            ḫ: `h`,
                            ẖ: `h`,
                            ħ: `h`,
                            ⱨ: `h`,
                            ⱶ: `h`,
                            ɥ: `h`,
                            ƕ: `hv`,
                            'ⓘ': `i`,
                            ｉ: `i`,
                            ì: `i`,
                            í: `i`,
                            î: `i`,
                            ĩ: `i`,
                            ī: `i`,
                            ĭ: `i`,
                            ï: `i`,
                            ḯ: `i`,
                            ỉ: `i`,
                            ǐ: `i`,
                            ȉ: `i`,
                            ȋ: `i`,
                            ị: `i`,
                            į: `i`,
                            ḭ: `i`,
                            ɨ: `i`,
                            ı: `i`,
                            'ⓙ': `j`,
                            ｊ: `j`,
                            ĵ: `j`,
                            ǰ: `j`,
                            ɉ: `j`,
                            'ⓚ': `k`,
                            ｋ: `k`,
                            ḱ: `k`,
                            ǩ: `k`,
                            ḳ: `k`,
                            ķ: `k`,
                            ḵ: `k`,
                            ƙ: `k`,
                            ⱪ: `k`,
                            ꝁ: `k`,
                            ꝃ: `k`,
                            ꝅ: `k`,
                            ꞣ: `k`,
                            'ⓛ': `l`,
                            ｌ: `l`,
                            ŀ: `l`,
                            ĺ: `l`,
                            ľ: `l`,
                            ḷ: `l`,
                            ḹ: `l`,
                            ļ: `l`,
                            ḽ: `l`,
                            ḻ: `l`,
                            ſ: `l`,
                            ł: `l`,
                            ƚ: `l`,
                            ɫ: `l`,
                            ⱡ: `l`,
                            ꝉ: `l`,
                            ꞁ: `l`,
                            ꝇ: `l`,
                            ǉ: `lj`,
                            'ⓜ': `m`,
                            ｍ: `m`,
                            ḿ: `m`,
                            ṁ: `m`,
                            ṃ: `m`,
                            ɱ: `m`,
                            ɯ: `m`,
                            'ⓝ': `n`,
                            ｎ: `n`,
                            ǹ: `n`,
                            ń: `n`,
                            ñ: `n`,
                            ṅ: `n`,
                            ň: `n`,
                            ṇ: `n`,
                            ņ: `n`,
                            ṋ: `n`,
                            ṉ: `n`,
                            ƞ: `n`,
                            ɲ: `n`,
                            ŉ: `n`,
                            ꞑ: `n`,
                            ꞥ: `n`,
                            ǌ: `nj`,
                            'ⓞ': `o`,
                            ｏ: `o`,
                            ò: `o`,
                            ó: `o`,
                            ô: `o`,
                            ồ: `o`,
                            ố: `o`,
                            ỗ: `o`,
                            ổ: `o`,
                            õ: `o`,
                            ṍ: `o`,
                            ȭ: `o`,
                            ṏ: `o`,
                            ō: `o`,
                            ṑ: `o`,
                            ṓ: `o`,
                            ŏ: `o`,
                            ȯ: `o`,
                            ȱ: `o`,
                            ö: `o`,
                            ȫ: `o`,
                            ỏ: `o`,
                            ő: `o`,
                            ǒ: `o`,
                            ȍ: `o`,
                            ȏ: `o`,
                            ơ: `o`,
                            ờ: `o`,
                            ớ: `o`,
                            ỡ: `o`,
                            ở: `o`,
                            ợ: `o`,
                            ọ: `o`,
                            ộ: `o`,
                            ǫ: `o`,
                            ǭ: `o`,
                            ø: `o`,
                            ǿ: `o`,
                            ɔ: `o`,
                            ꝋ: `o`,
                            ꝍ: `o`,
                            ɵ: `o`,
                            œ: `oe`,
                            ƣ: `oi`,
                            ȣ: `ou`,
                            ꝏ: `oo`,
                            'ⓟ': `p`,
                            ｐ: `p`,
                            ṕ: `p`,
                            ṗ: `p`,
                            ƥ: `p`,
                            ᵽ: `p`,
                            ꝑ: `p`,
                            ꝓ: `p`,
                            ꝕ: `p`,
                            'ⓠ': `q`,
                            ｑ: `q`,
                            ɋ: `q`,
                            ꝗ: `q`,
                            ꝙ: `q`,
                            'ⓡ': `r`,
                            ｒ: `r`,
                            ŕ: `r`,
                            ṙ: `r`,
                            ř: `r`,
                            ȑ: `r`,
                            ȓ: `r`,
                            ṛ: `r`,
                            ṝ: `r`,
                            ŗ: `r`,
                            ṟ: `r`,
                            ɍ: `r`,
                            ɽ: `r`,
                            ꝛ: `r`,
                            ꞧ: `r`,
                            ꞃ: `r`,
                            'ⓢ': `s`,
                            ｓ: `s`,
                            ß: `s`,
                            ś: `s`,
                            ṥ: `s`,
                            ŝ: `s`,
                            ṡ: `s`,
                            š: `s`,
                            ṧ: `s`,
                            ṣ: `s`,
                            ṩ: `s`,
                            ș: `s`,
                            ş: `s`,
                            ȿ: `s`,
                            ꞩ: `s`,
                            ꞅ: `s`,
                            ẛ: `s`,
                            'ⓣ': `t`,
                            ｔ: `t`,
                            ṫ: `t`,
                            ẗ: `t`,
                            ť: `t`,
                            ṭ: `t`,
                            ț: `t`,
                            ţ: `t`,
                            ṱ: `t`,
                            ṯ: `t`,
                            ŧ: `t`,
                            ƭ: `t`,
                            ʈ: `t`,
                            ⱦ: `t`,
                            ꞇ: `t`,
                            ꜩ: `tz`,
                            'ⓤ': `u`,
                            ｕ: `u`,
                            ù: `u`,
                            ú: `u`,
                            û: `u`,
                            ũ: `u`,
                            ṹ: `u`,
                            ū: `u`,
                            ṻ: `u`,
                            ŭ: `u`,
                            ü: `u`,
                            ǜ: `u`,
                            ǘ: `u`,
                            ǖ: `u`,
                            ǚ: `u`,
                            ủ: `u`,
                            ů: `u`,
                            ű: `u`,
                            ǔ: `u`,
                            ȕ: `u`,
                            ȗ: `u`,
                            ư: `u`,
                            ừ: `u`,
                            ứ: `u`,
                            ữ: `u`,
                            ử: `u`,
                            ự: `u`,
                            ụ: `u`,
                            ṳ: `u`,
                            ų: `u`,
                            ṷ: `u`,
                            ṵ: `u`,
                            ʉ: `u`,
                            'ⓥ': `v`,
                            ｖ: `v`,
                            ṽ: `v`,
                            ṿ: `v`,
                            ʋ: `v`,
                            ꝟ: `v`,
                            ʌ: `v`,
                            ꝡ: `vy`,
                            'ⓦ': `w`,
                            ｗ: `w`,
                            ẁ: `w`,
                            ẃ: `w`,
                            ŵ: `w`,
                            ẇ: `w`,
                            ẅ: `w`,
                            ẘ: `w`,
                            ẉ: `w`,
                            ⱳ: `w`,
                            'ⓧ': `x`,
                            ｘ: `x`,
                            ẋ: `x`,
                            ẍ: `x`,
                            'ⓨ': `y`,
                            ｙ: `y`,
                            ỳ: `y`,
                            ý: `y`,
                            ŷ: `y`,
                            ỹ: `y`,
                            ȳ: `y`,
                            ẏ: `y`,
                            ÿ: `y`,
                            ỷ: `y`,
                            ẙ: `y`,
                            ỵ: `y`,
                            ƴ: `y`,
                            ɏ: `y`,
                            ỿ: `y`,
                            'ⓩ': `z`,
                            ｚ: `z`,
                            ź: `z`,
                            ẑ: `z`,
                            ż: `z`,
                            ž: `z`,
                            ẓ: `z`,
                            ẕ: `z`,
                            ƶ: `z`,
                            ȥ: `z`,
                            ɀ: `z`,
                            ⱬ: `z`,
                            ꝣ: `z`,
                            Ά: `Α`,
                            Έ: `Ε`,
                            Ή: `Η`,
                            Ί: `Ι`,
                            Ϊ: `Ι`,
                            Ό: `Ο`,
                            Ύ: `Υ`,
                            Ϋ: `Υ`,
                            Ώ: `Ω`,
                            ά: `α`,
                            έ: `ε`,
                            ή: `η`,
                            ί: `ι`,
                            ϊ: `ι`,
                            ΐ: `ι`,
                            ό: `ο`,
                            ύ: `υ`,
                            ϋ: `υ`,
                            ΰ: `υ`,
                            ώ: `ω`,
                            ς: `σ`,
                            '’': `'`,
                        };
                    }),
                    t.define(`select2/data/base`, [`../utils`], function (e) {
                        function t(e, n) {
                            t.__super__.constructor.call(this);
                        }
                        return (
                            e.Extend(t, e.Observable),
                            (t.prototype.current = function (e) {
                                throw Error(
                                    'The `current` method must be defined in child classes.',
                                );
                            }),
                            (t.prototype.query = function (e, t) {
                                throw Error('The `query` method must be defined in child classes.');
                            }),
                            (t.prototype.bind = function (e, t) {}),
                            (t.prototype.destroy = function () {}),
                            (t.prototype.generateResultId = function (t, n) {
                                var r = t.id + `-result-`;
                                return (
                                    (r += e.generateChars(4)),
                                    n.id == null
                                        ? (r += `-` + e.generateChars(4))
                                        : (r += `-` + n.id.toString()),
                                    r
                                );
                            }),
                            t
                        );
                    }),
                    t.define(
                        `select2/data/select`,
                        [`./base`, `../utils`, `jquery`],
                        function (e, t, n) {
                            function r(e, t) {
                                ((this.$element = e),
                                    (this.options = t),
                                    r.__super__.constructor.call(this));
                            }
                            return (
                                t.Extend(r, e),
                                (r.prototype.current = function (e) {
                                    var t = [],
                                        r = this;
                                    (this.$element.find(`:selected`).each(function () {
                                        var e = n(this),
                                            i = r.item(e);
                                        t.push(i);
                                    }),
                                        e(t));
                                }),
                                (r.prototype.select = function (e) {
                                    var t = this;
                                    if (((e.selected = !0), n(e.element).is(`option`))) {
                                        ((e.element.selected = !0),
                                            this.$element.trigger(`input`).trigger(`change`));
                                        return;
                                    }
                                    if (this.$element.prop(`multiple`))
                                        this.current(function (r) {
                                            var i = [];
                                            ((e = [e]), e.push.apply(e, r));
                                            for (var a = 0; a < e.length; a++) {
                                                var o = e[a].id;
                                                n.inArray(o, i) === -1 && i.push(o);
                                            }
                                            (t.$element.val(i),
                                                t.$element.trigger(`input`).trigger(`change`));
                                        });
                                    else {
                                        var r = e.id;
                                        (this.$element.val(r),
                                            this.$element.trigger(`input`).trigger(`change`));
                                    }
                                }),
                                (r.prototype.unselect = function (e) {
                                    var t = this;
                                    if (this.$element.prop(`multiple`)) {
                                        if (((e.selected = !1), n(e.element).is(`option`))) {
                                            ((e.element.selected = !1),
                                                this.$element.trigger(`input`).trigger(`change`));
                                            return;
                                        }
                                        this.current(function (r) {
                                            for (var i = [], a = 0; a < r.length; a++) {
                                                var o = r[a].id;
                                                o !== e.id && n.inArray(o, i) === -1 && i.push(o);
                                            }
                                            (t.$element.val(i),
                                                t.$element.trigger(`input`).trigger(`change`));
                                        });
                                    }
                                }),
                                (r.prototype.bind = function (e, t) {
                                    var n = this;
                                    ((this.container = e),
                                        e.on(`select`, function (e) {
                                            n.select(e.data);
                                        }),
                                        e.on(`unselect`, function (e) {
                                            n.unselect(e.data);
                                        }));
                                }),
                                (r.prototype.destroy = function () {
                                    this.$element.find(`*`).each(function () {
                                        t.RemoveData(this);
                                    });
                                }),
                                (r.prototype.query = function (e, t) {
                                    var r = [],
                                        i = this;
                                    (this.$element.children().each(function () {
                                        var t = n(this);
                                        if (!(!t.is(`option`) && !t.is(`optgroup`))) {
                                            var a = i.item(t),
                                                o = i.matches(e, a);
                                            o !== null && r.push(o);
                                        }
                                    }),
                                        t({results: r}));
                                }),
                                (r.prototype.addOptions = function (e) {
                                    t.appendMany(this.$element, e);
                                }),
                                (r.prototype.option = function (e) {
                                    var r;
                                    (e.children
                                        ? ((r = document.createElement(`optgroup`)),
                                          (r.label = e.text))
                                        : ((r = document.createElement(`option`)),
                                          r.textContent === void 0
                                              ? (r.innerText = e.text)
                                              : (r.textContent = e.text)),
                                        e.id !== void 0 && (r.value = e.id),
                                        e.disabled && (r.disabled = !0),
                                        e.selected && (r.selected = !0),
                                        e.title && (r.title = e.title));
                                    var i = n(r),
                                        a = this._normalizeItem(e);
                                    return ((a.element = r), t.StoreData(r, `data`, a), i);
                                }),
                                (r.prototype.item = function (e) {
                                    var r = {};
                                    if (((r = t.GetData(e[0], `data`)), r != null)) return r;
                                    if (e.is(`option`))
                                        r = {
                                            id: e.val(),
                                            text: e.text(),
                                            disabled: e.prop(`disabled`),
                                            selected: e.prop(`selected`),
                                            title: e.prop(`title`),
                                        };
                                    else if (e.is(`optgroup`)) {
                                        r = {
                                            text: e.prop(`label`),
                                            children: [],
                                            title: e.prop(`title`),
                                        };
                                        for (
                                            var i = e.children(`option`), a = [], o = 0;
                                            o < i.length;
                                            o++
                                        ) {
                                            var s = n(i[o]),
                                                c = this.item(s);
                                            a.push(c);
                                        }
                                        r.children = a;
                                    }
                                    return (
                                        (r = this._normalizeItem(r)),
                                        (r.element = e[0]),
                                        t.StoreData(e[0], `data`, r),
                                        r
                                    );
                                }),
                                (r.prototype._normalizeItem = function (e) {
                                    return (
                                        e !== Object(e) && (e = {id: e, text: e}),
                                        (e = n.extend({}, {text: ``}, e)),
                                        e.id != null && (e.id = e.id.toString()),
                                        e.text != null && (e.text = e.text.toString()),
                                        e._resultId == null &&
                                            e.id &&
                                            this.container != null &&
                                            (e._resultId = this.generateResultId(
                                                this.container,
                                                e,
                                            )),
                                        n.extend({}, {selected: !1, disabled: !1}, e)
                                    );
                                }),
                                (r.prototype.matches = function (e, t) {
                                    return this.options.get(`matcher`)(e, t);
                                }),
                                r
                            );
                        },
                    ),
                    t.define(
                        `select2/data/array`,
                        [`./select`, `../utils`, `jquery`],
                        function (e, t, n) {
                            function r(e, t) {
                                ((this._dataToConvert = t.get(`data`) || []),
                                    r.__super__.constructor.call(this, e, t));
                            }
                            return (
                                t.Extend(r, e),
                                (r.prototype.bind = function (e, t) {
                                    (r.__super__.bind.call(this, e, t),
                                        this.addOptions(
                                            this.convertToOptions(this._dataToConvert),
                                        ));
                                }),
                                (r.prototype.select = function (e) {
                                    var t = this.$element.find(`option`).filter(function (t, n) {
                                        return n.value == e.id.toString();
                                    });
                                    (t.length === 0 && ((t = this.option(e)), this.addOptions(t)),
                                        r.__super__.select.call(this, e));
                                }),
                                (r.prototype.convertToOptions = function (e) {
                                    var r = this,
                                        i = this.$element.find(`option`),
                                        a = i
                                            .map(function () {
                                                return r.item(n(this)).id;
                                            })
                                            .get(),
                                        o = [];
                                    function s(e) {
                                        return function () {
                                            return n(this).val() == e.id;
                                        };
                                    }
                                    for (var c = 0; c < e.length; c++) {
                                        var l = this._normalizeItem(e[c]);
                                        if (n.inArray(l.id, a) >= 0) {
                                            var u = i.filter(s(l)),
                                                d = this.item(u),
                                                f = n.extend(!0, {}, l, d),
                                                p = this.option(f);
                                            u.replaceWith(p);
                                            continue;
                                        }
                                        var m = this.option(l);
                                        if (l.children) {
                                            var h = this.convertToOptions(l.children);
                                            t.appendMany(m, h);
                                        }
                                        o.push(m);
                                    }
                                    return o;
                                }),
                                r
                            );
                        },
                    ),
                    t.define(
                        `select2/data/ajax`,
                        [`./array`, `../utils`, `jquery`],
                        function (e, t, n) {
                            function r(e, t) {
                                ((this.ajaxOptions = this._applyDefaults(t.get(`ajax`))),
                                    this.ajaxOptions.processResults != null &&
                                        (this.processResults = this.ajaxOptions.processResults),
                                    r.__super__.constructor.call(this, e, t));
                            }
                            return (
                                t.Extend(r, e),
                                (r.prototype._applyDefaults = function (e) {
                                    return n.extend(
                                        {},
                                        {
                                            data: function (e) {
                                                return n.extend({}, e, {q: e.term});
                                            },
                                            transport: function (e, t, r) {
                                                var i = n.ajax(e);
                                                return (i.then(t), i.fail(r), i);
                                            },
                                        },
                                        e,
                                        !0,
                                    );
                                }),
                                (r.prototype.processResults = function (e) {
                                    return e;
                                }),
                                (r.prototype.query = function (e, t) {
                                    var r = this;
                                    this._request != null &&
                                        (n.isFunction(this._request.abort) && this._request.abort(),
                                        (this._request = null));
                                    var i = n.extend({type: `GET`}, this.ajaxOptions);
                                    (typeof i.url == `function` &&
                                        (i.url = i.url.call(this.$element, e)),
                                        typeof i.data == `function` &&
                                            (i.data = i.data.call(this.$element, e)));
                                    function a() {
                                        var a = i.transport(
                                            i,
                                            function (i) {
                                                var a = r.processResults(i, e);
                                                (r.options.get(`debug`) &&
                                                    window.console &&
                                                    console.error &&
                                                    (!a || !a.results || !n.isArray(a.results)) &&
                                                    console.error(
                                                        'Select2: The AJAX results did not return an array in the `results` key of the response.',
                                                    ),
                                                    t(a));
                                            },
                                            function () {
                                                (`status` in a &&
                                                    (a.status === 0 || a.status === `0`)) ||
                                                    r.trigger(`results:message`, {
                                                        message: `errorLoading`,
                                                    });
                                            },
                                        );
                                        r._request = a;
                                    }
                                    this.ajaxOptions.delay && e.term != null
                                        ? (this._queryTimeout &&
                                              window.clearTimeout(this._queryTimeout),
                                          (this._queryTimeout = window.setTimeout(
                                              a,
                                              this.ajaxOptions.delay,
                                          )))
                                        : a();
                                }),
                                r
                            );
                        },
                    ),
                    t.define(`select2/data/tags`, [`jquery`], function (e) {
                        function t(t, n, r) {
                            var i = r.get(`tags`),
                                a = r.get(`createTag`);
                            a !== void 0 && (this.createTag = a);
                            var o = r.get(`insertTag`);
                            if (
                                (o !== void 0 && (this.insertTag = o),
                                t.call(this, n, r),
                                e.isArray(i))
                            )
                                for (var s = 0; s < i.length; s++) {
                                    var c = i[s],
                                        l = this._normalizeItem(c),
                                        u = this.option(l);
                                    this.$element.append(u);
                                }
                        }
                        return (
                            (t.prototype.query = function (e, t, n) {
                                var r = this;
                                if ((this._removeOldTags(), t.term == null || t.page != null)) {
                                    e.call(this, t, n);
                                    return;
                                }
                                function i(e, a) {
                                    for (var o = e.results, s = 0; s < o.length; s++) {
                                        var c = o[s],
                                            l = c.children != null && !i({results: c.children}, !0);
                                        if (
                                            (c.text || ``).toUpperCase() ===
                                                (t.term || ``).toUpperCase() ||
                                            l
                                        ) {
                                            if (a) return !1;
                                            ((e.data = o), n(e));
                                            return;
                                        }
                                    }
                                    if (a) return !0;
                                    var u = r.createTag(t);
                                    if (u != null) {
                                        var d = r.option(u);
                                        (d.attr(`data-select2-tag`, !0),
                                            r.addOptions([d]),
                                            r.insertTag(o, u));
                                    }
                                    ((e.results = o), n(e));
                                }
                                e.call(this, t, i);
                            }),
                            (t.prototype.createTag = function (t, n) {
                                var r = e.trim(n.term);
                                return r === `` ? null : {id: r, text: r};
                            }),
                            (t.prototype.insertTag = function (e, t, n) {
                                t.unshift(n);
                            }),
                            (t.prototype._removeOldTags = function (t) {
                                this.$element.find(`option[data-select2-tag]`).each(function () {
                                    this.selected || e(this).remove();
                                });
                            }),
                            t
                        );
                    }),
                    t.define(`select2/data/tokenizer`, [`jquery`], function (e) {
                        function t(e, t, n) {
                            var r = n.get(`tokenizer`);
                            (r !== void 0 && (this.tokenizer = r), e.call(this, t, n));
                        }
                        return (
                            (t.prototype.bind = function (e, t, n) {
                                (e.call(this, t, n),
                                    (this.$search =
                                        t.dropdown.$search ||
                                        t.selection.$search ||
                                        n.find(`.select2-search__field`)));
                            }),
                            (t.prototype.query = function (t, n, r) {
                                var i = this;
                                function a(t) {
                                    var n = i._normalizeItem(t);
                                    if (
                                        !i.$element.find(`option`).filter(function () {
                                            return e(this).val() === n.id;
                                        }).length
                                    ) {
                                        var r = i.option(n);
                                        (r.attr(`data-select2-tag`, !0),
                                            i._removeOldTags(),
                                            i.addOptions([r]));
                                    }
                                    o(n);
                                }
                                function o(e) {
                                    i.trigger(`select`, {data: e});
                                }
                                n.term = n.term || ``;
                                var s = this.tokenizer(n, this.options, a);
                                (s.term !== n.term &&
                                    (this.$search.length &&
                                        (this.$search.val(s.term), this.$search.trigger(`focus`)),
                                    (n.term = s.term)),
                                    t.call(this, n, r));
                            }),
                            (t.prototype.tokenizer = function (t, n, r, i) {
                                for (
                                    var a = r.get(`tokenSeparators`) || [],
                                        o = n.term,
                                        s = 0,
                                        c =
                                            this.createTag ||
                                            function (e) {
                                                return {id: e.term, text: e.term};
                                            };
                                    s < o.length;

                                ) {
                                    var l = o[s];
                                    if (e.inArray(l, a) === -1) {
                                        s++;
                                        continue;
                                    }
                                    var u = o.substr(0, s),
                                        d = c(e.extend({}, n, {term: u}));
                                    if (d == null) {
                                        s++;
                                        continue;
                                    }
                                    (i(d), (o = o.substr(s + 1) || ``), (s = 0));
                                }
                                return {term: o};
                            }),
                            t
                        );
                    }),
                    t.define(`select2/data/minimumInputLength`, [], function () {
                        function e(e, t, n) {
                            ((this.minimumInputLength = n.get(`minimumInputLength`)),
                                e.call(this, t, n));
                        }
                        return (
                            (e.prototype.query = function (e, t, n) {
                                if (
                                    ((t.term = t.term || ``),
                                    t.term.length < this.minimumInputLength)
                                ) {
                                    this.trigger(`results:message`, {
                                        message: `inputTooShort`,
                                        args: {
                                            minimum: this.minimumInputLength,
                                            input: t.term,
                                            params: t,
                                        },
                                    });
                                    return;
                                }
                                e.call(this, t, n);
                            }),
                            e
                        );
                    }),
                    t.define(`select2/data/maximumInputLength`, [], function () {
                        function e(e, t, n) {
                            ((this.maximumInputLength = n.get(`maximumInputLength`)),
                                e.call(this, t, n));
                        }
                        return (
                            (e.prototype.query = function (e, t, n) {
                                if (
                                    ((t.term = t.term || ``),
                                    this.maximumInputLength > 0 &&
                                        t.term.length > this.maximumInputLength)
                                ) {
                                    this.trigger(`results:message`, {
                                        message: `inputTooLong`,
                                        args: {
                                            maximum: this.maximumInputLength,
                                            input: t.term,
                                            params: t,
                                        },
                                    });
                                    return;
                                }
                                e.call(this, t, n);
                            }),
                            e
                        );
                    }),
                    t.define(`select2/data/maximumSelectionLength`, [], function () {
                        function e(e, t, n) {
                            ((this.maximumSelectionLength = n.get(`maximumSelectionLength`)),
                                e.call(this, t, n));
                        }
                        return (
                            (e.prototype.bind = function (e, t, n) {
                                var r = this;
                                (e.call(this, t, n),
                                    t.on(`select`, function () {
                                        r._checkIfMaximumSelected();
                                    }));
                            }),
                            (e.prototype.query = function (e, t, n) {
                                var r = this;
                                this._checkIfMaximumSelected(function () {
                                    e.call(r, t, n);
                                });
                            }),
                            (e.prototype._checkIfMaximumSelected = function (e, t) {
                                var n = this;
                                this.current(function (e) {
                                    var r = e == null ? 0 : e.length;
                                    if (
                                        n.maximumSelectionLength > 0 &&
                                        r >= n.maximumSelectionLength
                                    ) {
                                        n.trigger(`results:message`, {
                                            message: `maximumSelected`,
                                            args: {maximum: n.maximumSelectionLength},
                                        });
                                        return;
                                    }
                                    t && t();
                                });
                            }),
                            e
                        );
                    }),
                    t.define(`select2/dropdown`, [`jquery`, `./utils`], function (e, t) {
                        function n(e, t) {
                            ((this.$element = e),
                                (this.options = t),
                                n.__super__.constructor.call(this));
                        }
                        return (
                            t.Extend(n, t.Observable),
                            (n.prototype.render = function () {
                                var t = e(
                                    `<span class="select2-dropdown"><span class="select2-results"></span></span>`,
                                );
                                return (
                                    t.attr(`dir`, this.options.get(`dir`)),
                                    (this.$dropdown = t),
                                    t
                                );
                            }),
                            (n.prototype.bind = function () {}),
                            (n.prototype.position = function (e, t) {}),
                            (n.prototype.destroy = function () {
                                this.$dropdown.remove();
                            }),
                            n
                        );
                    }),
                    t.define(`select2/dropdown/search`, [`jquery`, `../utils`], function (e, t) {
                        function n() {}
                        return (
                            (n.prototype.render = function (t) {
                                var n = t.call(this),
                                    r = e(
                                        `<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" /></span>`,
                                    );
                                return (
                                    (this.$searchContainer = r),
                                    (this.$search = r.find(`input`)),
                                    n.prepend(r),
                                    n
                                );
                            }),
                            (n.prototype.bind = function (t, n, r) {
                                var i = this,
                                    a = n.id + `-results`;
                                (t.call(this, n, r),
                                    this.$search.on(`keydown`, function (e) {
                                        (i.trigger(`keypress`, e),
                                            (i._keyUpPrevented = e.isDefaultPrevented()));
                                    }),
                                    this.$search.on(`input`, function (t) {
                                        e(this).off(`keyup`);
                                    }),
                                    this.$search.on(`keyup input`, function (e) {
                                        i.handleSearch(e);
                                    }),
                                    n.on(`open`, function () {
                                        (i.$search.attr(`tabindex`, 0),
                                            i.$search.attr(`aria-controls`, a),
                                            i.$search.trigger(`focus`),
                                            window.setTimeout(function () {
                                                i.$search.trigger(`focus`);
                                            }, 0));
                                    }),
                                    n.on(`close`, function () {
                                        (i.$search.attr(`tabindex`, -1),
                                            i.$search.removeAttr(`aria-controls`),
                                            i.$search.removeAttr(`aria-activedescendant`),
                                            i.$search.val(``),
                                            i.$search.trigger(`blur`));
                                    }),
                                    n.on(`focus`, function () {
                                        n.isOpen() || i.$search.trigger(`focus`);
                                    }),
                                    n.on(`results:all`, function (e) {
                                        (e.query.term == null || e.query.term === ``) &&
                                            (i.showSearch(e)
                                                ? i.$searchContainer.removeClass(
                                                      `select2-search--hide`,
                                                  )
                                                : i.$searchContainer.addClass(
                                                      `select2-search--hide`,
                                                  ));
                                    }),
                                    n.on(`results:focus`, function (e) {
                                        e.data._resultId
                                            ? i.$search.attr(
                                                  `aria-activedescendant`,
                                                  e.data._resultId,
                                              )
                                            : i.$search.removeAttr(`aria-activedescendant`);
                                    }));
                            }),
                            (n.prototype.handleSearch = function (e) {
                                if (!this._keyUpPrevented) {
                                    var t = this.$search.val();
                                    this.trigger(`query`, {term: t});
                                }
                                this._keyUpPrevented = !1;
                            }),
                            (n.prototype.showSearch = function (e, t) {
                                return !0;
                            }),
                            n
                        );
                    }),
                    t.define(`select2/dropdown/hidePlaceholder`, [], function () {
                        function e(e, t, n, r) {
                            ((this.placeholder = this.normalizePlaceholder(n.get(`placeholder`))),
                                e.call(this, t, n, r));
                        }
                        return (
                            (e.prototype.append = function (e, t) {
                                ((t.results = this.removePlaceholder(t.results)), e.call(this, t));
                            }),
                            (e.prototype.normalizePlaceholder = function (e, t) {
                                return (typeof t == `string` && (t = {id: ``, text: t}), t);
                            }),
                            (e.prototype.removePlaceholder = function (e, t) {
                                for (var n = t.slice(0), r = t.length - 1; r >= 0; r--) {
                                    var i = t[r];
                                    this.placeholder.id === i.id && n.splice(r, 1);
                                }
                                return n;
                            }),
                            e
                        );
                    }),
                    t.define(`select2/dropdown/infiniteScroll`, [`jquery`], function (e) {
                        function t(e, t, n, r) {
                            ((this.lastParams = {}),
                                e.call(this, t, n, r),
                                (this.$loadingMore = this.createLoadingMore()),
                                (this.loading = !1));
                        }
                        return (
                            (t.prototype.append = function (e, t) {
                                (this.$loadingMore.remove(),
                                    (this.loading = !1),
                                    e.call(this, t),
                                    this.showLoadingMore(t) &&
                                        (this.$results.append(this.$loadingMore),
                                        this.loadMoreIfNeeded()));
                            }),
                            (t.prototype.bind = function (e, t, n) {
                                var r = this;
                                (e.call(this, t, n),
                                    t.on(`query`, function (e) {
                                        ((r.lastParams = e), (r.loading = !0));
                                    }),
                                    t.on(`query:append`, function (e) {
                                        ((r.lastParams = e), (r.loading = !0));
                                    }),
                                    this.$results.on(`scroll`, this.loadMoreIfNeeded.bind(this)));
                            }),
                            (t.prototype.loadMoreIfNeeded = function () {
                                var t = e.contains(document.documentElement, this.$loadingMore[0]);
                                if (!(this.loading || !t)) {
                                    var n =
                                            this.$results.offset().top +
                                            this.$results.outerHeight(!1),
                                        r =
                                            this.$loadingMore.offset().top +
                                            this.$loadingMore.outerHeight(!1);
                                    n + 50 >= r && this.loadMore();
                                }
                            }),
                            (t.prototype.loadMore = function () {
                                this.loading = !0;
                                var t = e.extend({}, {page: 1}, this.lastParams);
                                (t.page++, this.trigger(`query:append`, t));
                            }),
                            (t.prototype.showLoadingMore = function (e, t) {
                                return t.pagination && t.pagination.more;
                            }),
                            (t.prototype.createLoadingMore = function () {
                                var t = e(
                                        `<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>`,
                                    ),
                                    n = this.options.get(`translations`).get(`loadingMore`);
                                return (t.html(n(this.lastParams)), t);
                            }),
                            t
                        );
                    }),
                    t.define(
                        `select2/dropdown/attachBody`,
                        [`jquery`, `../utils`],
                        function (e, t) {
                            function n(t, n, r) {
                                ((this.$dropdownParent = e(
                                    r.get(`dropdownParent`) || document.body,
                                )),
                                    t.call(this, n, r));
                            }
                            return (
                                (n.prototype.bind = function (e, t, n) {
                                    var r = this;
                                    (e.call(this, t, n),
                                        t.on(`open`, function () {
                                            (r._showDropdown(),
                                                r._attachPositioningHandler(t),
                                                r._bindContainerResultHandlers(t));
                                        }),
                                        t.on(`close`, function () {
                                            (r._hideDropdown(), r._detachPositioningHandler(t));
                                        }),
                                        this.$dropdownContainer.on(`mousedown`, function (e) {
                                            e.stopPropagation();
                                        }));
                                }),
                                (n.prototype.destroy = function (e) {
                                    (e.call(this), this.$dropdownContainer.remove());
                                }),
                                (n.prototype.position = function (e, t, n) {
                                    (t.attr(`class`, n.attr(`class`)),
                                        t.removeClass(`select2`),
                                        t.addClass(`select2-container--open`),
                                        t.css({position: `absolute`, top: -999999}),
                                        (this.$container = n));
                                }),
                                (n.prototype.render = function (t) {
                                    var n = e(`<span></span>`),
                                        r = t.call(this);
                                    return (n.append(r), (this.$dropdownContainer = n), n);
                                }),
                                (n.prototype._hideDropdown = function (e) {
                                    this.$dropdownContainer.detach();
                                }),
                                (n.prototype._bindContainerResultHandlers = function (e, t) {
                                    if (!this._containerResultsHandlersBound) {
                                        var n = this;
                                        (t.on(`results:all`, function () {
                                            (n._positionDropdown(), n._resizeDropdown());
                                        }),
                                            t.on(`results:append`, function () {
                                                (n._positionDropdown(), n._resizeDropdown());
                                            }),
                                            t.on(`results:message`, function () {
                                                (n._positionDropdown(), n._resizeDropdown());
                                            }),
                                            t.on(`select`, function () {
                                                (n._positionDropdown(), n._resizeDropdown());
                                            }),
                                            t.on(`unselect`, function () {
                                                (n._positionDropdown(), n._resizeDropdown());
                                            }),
                                            (this._containerResultsHandlersBound = !0));
                                    }
                                }),
                                (n.prototype._attachPositioningHandler = function (n, r) {
                                    var i = this,
                                        a = `scroll.select2.` + r.id,
                                        o = `resize.select2.` + r.id,
                                        s = `orientationchange.select2.` + r.id,
                                        c = this.$container.parents().filter(t.hasScroll);
                                    (c.each(function () {
                                        t.StoreData(this, `select2-scroll-position`, {
                                            x: e(this).scrollLeft(),
                                            y: e(this).scrollTop(),
                                        });
                                    }),
                                        c.on(a, function (n) {
                                            var r = t.GetData(this, `select2-scroll-position`);
                                            e(this).scrollTop(r.y);
                                        }),
                                        e(window).on(a + ` ` + o + ` ` + s, function (e) {
                                            (i._positionDropdown(), i._resizeDropdown());
                                        }));
                                }),
                                (n.prototype._detachPositioningHandler = function (n, r) {
                                    var i = `scroll.select2.` + r.id,
                                        a = `resize.select2.` + r.id,
                                        o = `orientationchange.select2.` + r.id;
                                    (this.$container.parents().filter(t.hasScroll).off(i),
                                        e(window).off(i + ` ` + a + ` ` + o));
                                }),
                                (n.prototype._positionDropdown = function () {
                                    var t = e(window),
                                        n = this.$dropdown.hasClass(`select2-dropdown--above`),
                                        r = this.$dropdown.hasClass(`select2-dropdown--below`),
                                        i = null,
                                        a = this.$container.offset();
                                    a.bottom = a.top + this.$container.outerHeight(!1);
                                    var o = {height: this.$container.outerHeight(!1)};
                                    ((o.top = a.top), (o.bottom = a.top + o.height));
                                    var s = {height: this.$dropdown.outerHeight(!1)},
                                        c = {
                                            top: t.scrollTop(),
                                            bottom: t.scrollTop() + t.height(),
                                        },
                                        l = c.top < a.top - s.height,
                                        u = c.bottom > a.bottom + s.height,
                                        d = {left: a.left, top: o.bottom},
                                        f = this.$dropdownParent;
                                    f.css(`position`) === `static` && (f = f.offsetParent());
                                    var p = {top: 0, left: 0};
                                    ((e.contains(document.body, f[0]) || f[0].isConnected) &&
                                        (p = f.offset()),
                                        (d.top -= p.top),
                                        (d.left -= p.left),
                                        !n && !r && (i = `below`),
                                        !u && l && !n
                                            ? (i = `above`)
                                            : !l && u && n && (i = `below`),
                                        (i == `above` || (n && i !== `below`)) &&
                                            (d.top = o.top - p.top - s.height),
                                        i != null &&
                                            (this.$dropdown
                                                .removeClass(
                                                    `select2-dropdown--below select2-dropdown--above`,
                                                )
                                                .addClass(`select2-dropdown--` + i),
                                            this.$container
                                                .removeClass(
                                                    `select2-container--below select2-container--above`,
                                                )
                                                .addClass(`select2-container--` + i)),
                                        this.$dropdownContainer.css(d));
                                }),
                                (n.prototype._resizeDropdown = function () {
                                    var e = {width: this.$container.outerWidth(!1) + `px`};
                                    (this.options.get(`dropdownAutoWidth`) &&
                                        ((e.minWidth = e.width),
                                        (e.position = `relative`),
                                        (e.width = `auto`)),
                                        this.$dropdown.css(e));
                                }),
                                (n.prototype._showDropdown = function (e) {
                                    (this.$dropdownContainer.appendTo(this.$dropdownParent),
                                        this._positionDropdown(),
                                        this._resizeDropdown());
                                }),
                                n
                            );
                        },
                    ),
                    t.define(`select2/dropdown/minimumResultsForSearch`, [], function () {
                        function e(t) {
                            for (var n = 0, r = 0; r < t.length; r++) {
                                var i = t[r];
                                i.children ? (n += e(i.children)) : n++;
                            }
                            return n;
                        }
                        function t(e, t, n, r) {
                            ((this.minimumResultsForSearch = n.get(`minimumResultsForSearch`)),
                                this.minimumResultsForSearch < 0 &&
                                    (this.minimumResultsForSearch = 1 / 0),
                                e.call(this, t, n, r));
                        }
                        return (
                            (t.prototype.showSearch = function (t, n) {
                                return e(n.data.results) < this.minimumResultsForSearch
                                    ? !1
                                    : t.call(this, n);
                            }),
                            t
                        );
                    }),
                    t.define(`select2/dropdown/selectOnClose`, [`../utils`], function (e) {
                        function t() {}
                        return (
                            (t.prototype.bind = function (e, t, n) {
                                var r = this;
                                (e.call(this, t, n),
                                    t.on(`close`, function (e) {
                                        r._handleSelectOnClose(e);
                                    }));
                            }),
                            (t.prototype._handleSelectOnClose = function (t, n) {
                                if (n && n.originalSelect2Event != null) {
                                    var r = n.originalSelect2Event;
                                    if (r._type === `select` || r._type === `unselect`) return;
                                }
                                var i = this.getHighlightedResults();
                                if (!(i.length < 1)) {
                                    var a = e.GetData(i[0], `data`);
                                    (a.element != null && a.element.selected) ||
                                        (a.element == null && a.selected) ||
                                        this.trigger(`select`, {data: a});
                                }
                            }),
                            t
                        );
                    }),
                    t.define(`select2/dropdown/closeOnSelect`, [], function () {
                        function e() {}
                        return (
                            (e.prototype.bind = function (e, t, n) {
                                var r = this;
                                (e.call(this, t, n),
                                    t.on(`select`, function (e) {
                                        r._selectTriggered(e);
                                    }),
                                    t.on(`unselect`, function (e) {
                                        r._selectTriggered(e);
                                    }));
                            }),
                            (e.prototype._selectTriggered = function (e, t) {
                                var n = t.originalEvent;
                                (n && (n.ctrlKey || n.metaKey)) ||
                                    this.trigger(`close`, {
                                        originalEvent: n,
                                        originalSelect2Event: t,
                                    });
                            }),
                            e
                        );
                    }),
                    t.define(`select2/i18n/en`, [], function () {
                        return {
                            errorLoading: function () {
                                return `The results could not be loaded.`;
                            },
                            inputTooLong: function (e) {
                                var t = e.input.length - e.maximum,
                                    n = `Please delete ` + t + ` character`;
                                return (t != 1 && (n += `s`), n);
                            },
                            inputTooShort: function (e) {
                                return (
                                    `Please enter ` +
                                    (e.minimum - e.input.length) +
                                    ` or more characters`
                                );
                            },
                            loadingMore: function () {
                                return `Loading more results…`;
                            },
                            maximumSelected: function (e) {
                                var t = `You can only select ` + e.maximum + ` item`;
                                return (e.maximum != 1 && (t += `s`), t);
                            },
                            noResults: function () {
                                return `No results found`;
                            },
                            searching: function () {
                                return `Searching…`;
                            },
                            removeAllItems: function () {
                                return `Remove all items`;
                            },
                        };
                    }),
                    t.define(
                        `select2/defaults`,
                        `jquery,require,./results,./selection/single,./selection/multiple,./selection/placeholder,./selection/allowClear,./selection/search,./selection/eventRelay,./utils,./translation,./diacritics,./data/select,./data/array,./data/ajax,./data/tags,./data/tokenizer,./data/minimumInputLength,./data/maximumInputLength,./data/maximumSelectionLength,./dropdown,./dropdown/search,./dropdown/hidePlaceholder,./dropdown/infiniteScroll,./dropdown/attachBody,./dropdown/minimumResultsForSearch,./dropdown/selectOnClose,./dropdown/closeOnSelect,./i18n/en`.split(
                            `,`,
                        ),
                        function (
                            e,
                            t,
                            n,
                            r,
                            i,
                            a,
                            o,
                            s,
                            c,
                            l,
                            u,
                            d,
                            f,
                            p,
                            m,
                            h,
                            g,
                            _,
                            v,
                            y,
                            b,
                            x,
                            S,
                            C,
                            w,
                            T,
                            E,
                            ee,
                            D,
                        ) {
                            function O() {
                                this.reset();
                            }
                            return (
                                (O.prototype.apply = function (u) {
                                    if (
                                        ((u = e.extend(!0, {}, this.defaults, u)),
                                        u.dataAdapter == null)
                                    ) {
                                        if (
                                            (u.ajax == null
                                                ? u.data == null
                                                    ? (u.dataAdapter = f)
                                                    : (u.dataAdapter = p)
                                                : (u.dataAdapter = m),
                                            u.minimumInputLength > 0 &&
                                                (u.dataAdapter = l.Decorate(u.dataAdapter, _)),
                                            u.maximumInputLength > 0 &&
                                                (u.dataAdapter = l.Decorate(u.dataAdapter, v)),
                                            u.maximumSelectionLength > 0 &&
                                                (u.dataAdapter = l.Decorate(u.dataAdapter, y)),
                                            u.tags &&
                                                (u.dataAdapter = l.Decorate(u.dataAdapter, h)),
                                            (u.tokenSeparators != null || u.tokenizer != null) &&
                                                (u.dataAdapter = l.Decorate(u.dataAdapter, g)),
                                            u.query != null)
                                        ) {
                                            var d = t(u.amdBase + `compat/query`);
                                            u.dataAdapter = l.Decorate(u.dataAdapter, d);
                                        }
                                        if (u.initSelection != null) {
                                            var D = t(u.amdBase + `compat/initSelection`);
                                            u.dataAdapter = l.Decorate(u.dataAdapter, D);
                                        }
                                    }
                                    if (
                                        (u.resultsAdapter ??
                                            ((u.resultsAdapter = n),
                                            u.ajax != null &&
                                                (u.resultsAdapter = l.Decorate(
                                                    u.resultsAdapter,
                                                    C,
                                                )),
                                            u.placeholder != null &&
                                                (u.resultsAdapter = l.Decorate(
                                                    u.resultsAdapter,
                                                    S,
                                                )),
                                            u.selectOnClose &&
                                                (u.resultsAdapter = l.Decorate(
                                                    u.resultsAdapter,
                                                    E,
                                                ))),
                                        u.dropdownAdapter == null)
                                    ) {
                                        if (u.multiple) u.dropdownAdapter = b;
                                        else {
                                            var O = l.Decorate(b, x);
                                            u.dropdownAdapter = O;
                                        }
                                        if (
                                            (u.minimumResultsForSearch !== 0 &&
                                                (u.dropdownAdapter = l.Decorate(
                                                    u.dropdownAdapter,
                                                    T,
                                                )),
                                            u.closeOnSelect &&
                                                (u.dropdownAdapter = l.Decorate(
                                                    u.dropdownAdapter,
                                                    ee,
                                                )),
                                            u.dropdownCssClass != null ||
                                                u.dropdownCss != null ||
                                                u.adaptDropdownCssClass != null)
                                        ) {
                                            var te = t(u.amdBase + `compat/dropdownCss`);
                                            u.dropdownAdapter = l.Decorate(u.dropdownAdapter, te);
                                        }
                                        u.dropdownAdapter = l.Decorate(u.dropdownAdapter, w);
                                    }
                                    if (u.selectionAdapter == null) {
                                        if (
                                            (u.multiple
                                                ? (u.selectionAdapter = i)
                                                : (u.selectionAdapter = r),
                                            u.placeholder != null &&
                                                (u.selectionAdapter = l.Decorate(
                                                    u.selectionAdapter,
                                                    a,
                                                )),
                                            u.allowClear &&
                                                (u.selectionAdapter = l.Decorate(
                                                    u.selectionAdapter,
                                                    o,
                                                )),
                                            u.multiple &&
                                                (u.selectionAdapter = l.Decorate(
                                                    u.selectionAdapter,
                                                    s,
                                                )),
                                            u.containerCssClass != null ||
                                                u.containerCss != null ||
                                                u.adaptContainerCssClass != null)
                                        ) {
                                            var ne = t(u.amdBase + `compat/containerCss`);
                                            u.selectionAdapter = l.Decorate(u.selectionAdapter, ne);
                                        }
                                        u.selectionAdapter = l.Decorate(u.selectionAdapter, c);
                                    }
                                    ((u.language = this._resolveLanguage(u.language)),
                                        u.language.push(`en`));
                                    for (var k = [], re = 0; re < u.language.length; re++) {
                                        var A = u.language[re];
                                        k.indexOf(A) === -1 && k.push(A);
                                    }
                                    return (
                                        (u.language = k),
                                        (u.translations = this._processTranslations(
                                            u.language,
                                            u.debug,
                                        )),
                                        u
                                    );
                                }),
                                (O.prototype.reset = function () {
                                    function t(e) {
                                        function t(e) {
                                            return d[e] || e;
                                        }
                                        return e.replace(/[^\u0000-\u007E]/g, t);
                                    }
                                    function n(r, i) {
                                        if (e.trim(r.term) === ``) return i;
                                        if (i.children && i.children.length > 0) {
                                            for (
                                                var a = e.extend(!0, {}, i),
                                                    o = i.children.length - 1;
                                                o >= 0;
                                                o--
                                            ) {
                                                var s = i.children[o];
                                                n(r, s) ?? a.children.splice(o, 1);
                                            }
                                            return a.children.length > 0 ? a : n(r, a);
                                        }
                                        var c = t(i.text).toUpperCase(),
                                            l = t(r.term).toUpperCase();
                                        return c.indexOf(l) > -1 ? i : null;
                                    }
                                    this.defaults = {
                                        amdBase: `./`,
                                        amdLanguageBase: `./i18n/`,
                                        closeOnSelect: !0,
                                        debug: !1,
                                        dropdownAutoWidth: !1,
                                        escapeMarkup: l.escapeMarkup,
                                        language: {},
                                        matcher: n,
                                        minimumInputLength: 0,
                                        maximumInputLength: 0,
                                        maximumSelectionLength: 0,
                                        minimumResultsForSearch: 0,
                                        selectOnClose: !1,
                                        scrollAfterSelect: !1,
                                        sorter: function (e) {
                                            return e;
                                        },
                                        templateResult: function (e) {
                                            return e.text;
                                        },
                                        templateSelection: function (e) {
                                            return e.text;
                                        },
                                        theme: `default`,
                                        width: `resolve`,
                                    };
                                }),
                                (O.prototype.applyFromElement = function (e, t) {
                                    var n = e.language,
                                        r = this.defaults.language,
                                        i = t.prop(`lang`),
                                        a = t.closest(`[lang]`).prop(`lang`);
                                    return (
                                        (e.language = Array.prototype.concat.call(
                                            this._resolveLanguage(i),
                                            this._resolveLanguage(n),
                                            this._resolveLanguage(r),
                                            this._resolveLanguage(a),
                                        )),
                                        e
                                    );
                                }),
                                (O.prototype._resolveLanguage = function (t) {
                                    if (!t || e.isEmptyObject(t)) return [];
                                    if (e.isPlainObject(t)) return [t];
                                    for (
                                        var n = e.isArray(t) ? t : [t], r = [], i = 0;
                                        i < n.length;
                                        i++
                                    )
                                        if (
                                            (r.push(n[i]),
                                            typeof n[i] == `string` && n[i].indexOf(`-`) > 0)
                                        ) {
                                            var a = n[i].split(`-`)[0];
                                            r.push(a);
                                        }
                                    return r;
                                }),
                                (O.prototype._processTranslations = function (t, n) {
                                    for (var r = new u(), i = 0; i < t.length; i++) {
                                        var a = new u(),
                                            o = t[i];
                                        if (typeof o == `string`)
                                            try {
                                                a = u.loadPath(o);
                                            } catch {
                                                try {
                                                    ((o = this.defaults.amdLanguageBase + o),
                                                        (a = u.loadPath(o)));
                                                } catch {
                                                    n &&
                                                        window.console &&
                                                        console.warn &&
                                                        console.warn(
                                                            `Select2: The language file for "` +
                                                                o +
                                                                `" could not be automatically loaded. A fallback will be used instead.`,
                                                        );
                                                }
                                            }
                                        else a = e.isPlainObject(o) ? new u(o) : o;
                                        r.extend(a);
                                    }
                                    return r;
                                }),
                                (O.prototype.set = function (t, n) {
                                    var r = e.camelCase(t),
                                        i = {};
                                    i[r] = n;
                                    var a = l._convertData(i);
                                    e.extend(!0, this.defaults, a);
                                }),
                                new O()
                            );
                        },
                    ),
                    t.define(
                        `select2/options`,
                        [`require`, `jquery`, `./defaults`, `./utils`],
                        function (e, t, n, r) {
                            function i(t, i) {
                                if (
                                    ((this.options = t),
                                    i != null && this.fromElement(i),
                                    i != null &&
                                        (this.options = n.applyFromElement(this.options, i)),
                                    (this.options = n.apply(this.options)),
                                    i && i.is(`input`))
                                ) {
                                    var a = e(this.get(`amdBase`) + `compat/inputData`);
                                    this.options.dataAdapter = r.Decorate(
                                        this.options.dataAdapter,
                                        a,
                                    );
                                }
                            }
                            return (
                                (i.prototype.fromElement = function (e) {
                                    var n = [`select2`];
                                    (this.options.multiple ??
                                        (this.options.multiple = e.prop(`multiple`)),
                                        this.options.disabled ??
                                            (this.options.disabled = e.prop(`disabled`)),
                                        this.options.dir ??
                                            (e.prop(`dir`)
                                                ? (this.options.dir = e.prop(`dir`))
                                                : e.closest(`[dir]`).prop(`dir`)
                                                  ? (this.options.dir = e
                                                        .closest(`[dir]`)
                                                        .prop(`dir`))
                                                  : (this.options.dir = `ltr`)),
                                        e.prop(`disabled`, this.options.disabled),
                                        e.prop(`multiple`, this.options.multiple),
                                        r.GetData(e[0], `select2Tags`) &&
                                            (this.options.debug &&
                                                window.console &&
                                                console.warn &&
                                                console.warn(
                                                    'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.',
                                                ),
                                            r.StoreData(
                                                e[0],
                                                `data`,
                                                r.GetData(e[0], `select2Tags`),
                                            ),
                                            r.StoreData(e[0], `tags`, !0)),
                                        r.GetData(e[0], `ajaxUrl`) &&
                                            (this.options.debug &&
                                                window.console &&
                                                console.warn &&
                                                console.warn(
                                                    'Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2.',
                                                ),
                                            e.attr(`ajax--url`, r.GetData(e[0], `ajaxUrl`)),
                                            r.StoreData(
                                                e[0],
                                                `ajax-Url`,
                                                r.GetData(e[0], `ajaxUrl`),
                                            )));
                                    var i = {};
                                    function a(e, t) {
                                        return t.toUpperCase();
                                    }
                                    for (var o = 0; o < e[0].attributes.length; o++) {
                                        var s = e[0].attributes[o].name,
                                            c = `data-`;
                                        if (s.substr(0, c.length) == c) {
                                            var l = s.substring(c.length),
                                                u = r.GetData(e[0], l),
                                                d = l.replace(/-([a-z])/g, a);
                                            i[d] = u;
                                        }
                                    }
                                    t.fn.jquery &&
                                        t.fn.jquery.substr(0, 2) == `1.` &&
                                        e[0].dataset &&
                                        (i = t.extend(!0, {}, e[0].dataset, i));
                                    var f = t.extend(!0, {}, r.GetData(e[0]), i);
                                    for (var p in ((f = r._convertData(f)), f))
                                        t.inArray(p, n) > -1 ||
                                            (t.isPlainObject(this.options[p])
                                                ? t.extend(this.options[p], f[p])
                                                : (this.options[p] = f[p]));
                                    return this;
                                }),
                                (i.prototype.get = function (e) {
                                    return this.options[e];
                                }),
                                (i.prototype.set = function (e, t) {
                                    this.options[e] = t;
                                }),
                                i
                            );
                        },
                    ),
                    t.define(
                        `select2/core`,
                        [`jquery`, `./options`, `./utils`, `./keys`],
                        function (e, t, n, r) {
                            var i = function (e, r) {
                                (n.GetData(e[0], `select2`) != null &&
                                    n.GetData(e[0], `select2`).destroy(),
                                    (this.$element = e),
                                    (this.id = this._generateId(e)),
                                    (r ||= {}),
                                    (this.options = new t(r, e)),
                                    i.__super__.constructor.call(this));
                                var a = e.attr(`tabindex`) || 0;
                                (n.StoreData(e[0], `old-tabindex`, a),
                                    e.attr(`tabindex`, `-1`),
                                    (this.dataAdapter = new (this.options.get(`dataAdapter`))(
                                        e,
                                        this.options,
                                    )));
                                var o = this.render();
                                (this._placeContainer(o),
                                    (this.selection = new (this.options.get(`selectionAdapter`))(
                                        e,
                                        this.options,
                                    )),
                                    (this.$selection = this.selection.render()),
                                    this.selection.position(this.$selection, o),
                                    (this.dropdown = new (this.options.get(`dropdownAdapter`))(
                                        e,
                                        this.options,
                                    )),
                                    (this.$dropdown = this.dropdown.render()),
                                    this.dropdown.position(this.$dropdown, o),
                                    (this.results = new (this.options.get(`resultsAdapter`))(
                                        e,
                                        this.options,
                                        this.dataAdapter,
                                    )),
                                    (this.$results = this.results.render()),
                                    this.results.position(this.$results, this.$dropdown));
                                var s = this;
                                (this._bindAdapters(),
                                    this._registerDomEvents(),
                                    this._registerDataEvents(),
                                    this._registerSelectionEvents(),
                                    this._registerDropdownEvents(),
                                    this._registerResultsEvents(),
                                    this._registerEvents(),
                                    this.dataAdapter.current(function (e) {
                                        s.trigger(`selection:update`, {data: e});
                                    }),
                                    e.addClass(`select2-hidden-accessible`),
                                    e.attr(`aria-hidden`, `true`),
                                    this._syncAttributes(),
                                    n.StoreData(e[0], `select2`, this),
                                    e.data(`select2`, this));
                            };
                            return (
                                n.Extend(i, n.Observable),
                                (i.prototype._generateId = function (e) {
                                    var t = ``;
                                    return (
                                        (t =
                                            e.attr(`id`) == null
                                                ? e.attr(`name`) == null
                                                    ? n.generateChars(4)
                                                    : e.attr(`name`) + `-` + n.generateChars(2)
                                                : e.attr(`id`)),
                                        (t = t.replace(/(:|\.|\[|\]|,)/g, ``)),
                                        (t = `select2-` + t),
                                        t
                                    );
                                }),
                                (i.prototype._placeContainer = function (e) {
                                    e.insertAfter(this.$element);
                                    var t = this._resolveWidth(
                                        this.$element,
                                        this.options.get(`width`),
                                    );
                                    t != null && e.css(`width`, t);
                                }),
                                (i.prototype._resolveWidth = function (e, t) {
                                    var n =
                                        /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                                    if (t == `resolve`)
                                        return (
                                            this._resolveWidth(e, `style`) ??
                                            this._resolveWidth(e, `element`)
                                        );
                                    if (t == `element`) {
                                        var r = e.outerWidth(!1);
                                        return r <= 0 ? `auto` : r + `px`;
                                    }
                                    if (t == `style`) {
                                        var i = e.attr(`style`);
                                        if (typeof i != `string`) return null;
                                        for (
                                            var a = i.split(`;`), o = 0, s = a.length;
                                            o < s;
                                            o += 1
                                        ) {
                                            var c = a[o].replace(/\s/g, ``).match(n);
                                            if (c !== null && c.length >= 1) return c[1];
                                        }
                                        return null;
                                    }
                                    return t == `computedstyle`
                                        ? window.getComputedStyle(e[0]).width
                                        : t;
                                }),
                                (i.prototype._bindAdapters = function () {
                                    (this.dataAdapter.bind(this, this.$container),
                                        this.selection.bind(this, this.$container),
                                        this.dropdown.bind(this, this.$container),
                                        this.results.bind(this, this.$container));
                                }),
                                (i.prototype._registerDomEvents = function () {
                                    var e = this;
                                    (this.$element.on(`change.select2`, function () {
                                        e.dataAdapter.current(function (t) {
                                            e.trigger(`selection:update`, {data: t});
                                        });
                                    }),
                                        this.$element.on(`focus.select2`, function (t) {
                                            e.trigger(`focus`, t);
                                        }),
                                        (this._syncA = n.bind(this._syncAttributes, this)),
                                        (this._syncS = n.bind(this._syncSubtree, this)),
                                        this.$element[0].attachEvent &&
                                            this.$element[0].attachEvent(
                                                `onpropertychange`,
                                                this._syncA,
                                            ));
                                    var t =
                                        window.MutationObserver ||
                                        window.WebKitMutationObserver ||
                                        window.MozMutationObserver;
                                    t == null
                                        ? this.$element[0].addEventListener &&
                                          (this.$element[0].addEventListener(
                                              `DOMAttrModified`,
                                              e._syncA,
                                              !1,
                                          ),
                                          this.$element[0].addEventListener(
                                              `DOMNodeInserted`,
                                              e._syncS,
                                              !1,
                                          ),
                                          this.$element[0].addEventListener(
                                              `DOMNodeRemoved`,
                                              e._syncS,
                                              !1,
                                          ))
                                        : ((this._observer = new t(function (t) {
                                              (e._syncA(), e._syncS(null, t));
                                          })),
                                          this._observer.observe(this.$element[0], {
                                              attributes: !0,
                                              childList: !0,
                                              subtree: !1,
                                          }));
                                }),
                                (i.prototype._registerDataEvents = function () {
                                    var e = this;
                                    this.dataAdapter.on(`*`, function (t, n) {
                                        e.trigger(t, n);
                                    });
                                }),
                                (i.prototype._registerSelectionEvents = function () {
                                    var t = this,
                                        n = [`toggle`, `focus`];
                                    (this.selection.on(`toggle`, function () {
                                        t.toggleDropdown();
                                    }),
                                        this.selection.on(`focus`, function (e) {
                                            t.focus(e);
                                        }),
                                        this.selection.on(`*`, function (r, i) {
                                            e.inArray(r, n) === -1 && t.trigger(r, i);
                                        }));
                                }),
                                (i.prototype._registerDropdownEvents = function () {
                                    var e = this;
                                    this.dropdown.on(`*`, function (t, n) {
                                        e.trigger(t, n);
                                    });
                                }),
                                (i.prototype._registerResultsEvents = function () {
                                    var e = this;
                                    this.results.on(`*`, function (t, n) {
                                        e.trigger(t, n);
                                    });
                                }),
                                (i.prototype._registerEvents = function () {
                                    var e = this;
                                    (this.on(`open`, function () {
                                        e.$container.addClass(`select2-container--open`);
                                    }),
                                        this.on(`close`, function () {
                                            e.$container.removeClass(`select2-container--open`);
                                        }),
                                        this.on(`enable`, function () {
                                            e.$container.removeClass(`select2-container--disabled`);
                                        }),
                                        this.on(`disable`, function () {
                                            e.$container.addClass(`select2-container--disabled`);
                                        }),
                                        this.on(`blur`, function () {
                                            e.$container.removeClass(`select2-container--focus`);
                                        }),
                                        this.on(`query`, function (t) {
                                            (e.isOpen() || e.trigger(`open`, {}),
                                                this.dataAdapter.query(t, function (n) {
                                                    e.trigger(`results:all`, {data: n, query: t});
                                                }));
                                        }),
                                        this.on(`query:append`, function (t) {
                                            this.dataAdapter.query(t, function (n) {
                                                e.trigger(`results:append`, {data: n, query: t});
                                            });
                                        }),
                                        this.on(`keypress`, function (t) {
                                            var n = t.which;
                                            e.isOpen()
                                                ? n === r.ESC ||
                                                  n === r.TAB ||
                                                  (n === r.UP && t.altKey)
                                                    ? (e.close(t), t.preventDefault())
                                                    : n === r.ENTER
                                                      ? (e.trigger(`results:select`, {}),
                                                        t.preventDefault())
                                                      : n === r.SPACE && t.ctrlKey
                                                        ? (e.trigger(`results:toggle`, {}),
                                                          t.preventDefault())
                                                        : n === r.UP
                                                          ? (e.trigger(`results:previous`, {}),
                                                            t.preventDefault())
                                                          : n === r.DOWN &&
                                                            (e.trigger(`results:next`, {}),
                                                            t.preventDefault())
                                                : (n === r.ENTER ||
                                                      n === r.SPACE ||
                                                      (n === r.DOWN && t.altKey)) &&
                                                  (e.open(), t.preventDefault());
                                        }));
                                }),
                                (i.prototype._syncAttributes = function () {
                                    (this.options.set(`disabled`, this.$element.prop(`disabled`)),
                                        this.isDisabled()
                                            ? (this.isOpen() && this.close(),
                                              this.trigger(`disable`, {}))
                                            : this.trigger(`enable`, {}));
                                }),
                                (i.prototype._isChangeMutation = function (t, n) {
                                    var r = !1,
                                        i = this;
                                    if (
                                        !(
                                            t &&
                                            t.target &&
                                            t.target.nodeName !== `OPTION` &&
                                            t.target.nodeName !== `OPTGROUP`
                                        )
                                    ) {
                                        if (!n) r = !0;
                                        else if (n.addedNodes && n.addedNodes.length > 0)
                                            for (var a = 0; a < n.addedNodes.length; a++)
                                                n.addedNodes[a].selected && (r = !0);
                                        else
                                            n.removedNodes && n.removedNodes.length > 0
                                                ? (r = !0)
                                                : e.isArray(n) &&
                                                  e.each(n, function (e, t) {
                                                      if (i._isChangeMutation(e, t))
                                                          return ((r = !0), !1);
                                                  });
                                        return r;
                                    }
                                }),
                                (i.prototype._syncSubtree = function (e, t) {
                                    var n = this._isChangeMutation(e, t),
                                        r = this;
                                    n &&
                                        this.dataAdapter.current(function (e) {
                                            r.trigger(`selection:update`, {data: e});
                                        });
                                }),
                                (i.prototype.trigger = function (e, t) {
                                    var n = i.__super__.trigger,
                                        r = {
                                            open: `opening`,
                                            close: `closing`,
                                            select: `selecting`,
                                            unselect: `unselecting`,
                                            clear: `clearing`,
                                        };
                                    if ((t === void 0 && (t = {}), e in r)) {
                                        var a = r[e],
                                            o = {prevented: !1, name: e, args: t};
                                        if ((n.call(this, a, o), o.prevented)) {
                                            t.prevented = !0;
                                            return;
                                        }
                                    }
                                    n.call(this, e, t);
                                }),
                                (i.prototype.toggleDropdown = function () {
                                    this.isDisabled() ||
                                        (this.isOpen() ? this.close() : this.open());
                                }),
                                (i.prototype.open = function () {
                                    this.isOpen() || this.isDisabled() || this.trigger(`query`, {});
                                }),
                                (i.prototype.close = function (e) {
                                    this.isOpen() && this.trigger(`close`, {originalEvent: e});
                                }),
                                (i.prototype.isEnabled = function () {
                                    return !this.isDisabled();
                                }),
                                (i.prototype.isDisabled = function () {
                                    return this.options.get(`disabled`);
                                }),
                                (i.prototype.isOpen = function () {
                                    return this.$container.hasClass(`select2-container--open`);
                                }),
                                (i.prototype.hasFocus = function () {
                                    return this.$container.hasClass(`select2-container--focus`);
                                }),
                                (i.prototype.focus = function (e) {
                                    this.hasFocus() ||
                                        (this.$container.addClass(`select2-container--focus`),
                                        this.trigger(`focus`, {}));
                                }),
                                (i.prototype.enable = function (e) {
                                    (this.options.get(`debug`) &&
                                        window.console &&
                                        console.warn &&
                                        console.warn(
                                            'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.',
                                        ),
                                        (e == null || e.length === 0) && (e = [!0]));
                                    var t = !e[0];
                                    this.$element.prop(`disabled`, t);
                                }),
                                (i.prototype.data = function () {
                                    this.options.get(`debug`) &&
                                        arguments.length > 0 &&
                                        window.console &&
                                        console.warn &&
                                        console.warn(
                                            'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.',
                                        );
                                    var e = [];
                                    return (
                                        this.dataAdapter.current(function (t) {
                                            e = t;
                                        }),
                                        e
                                    );
                                }),
                                (i.prototype.val = function (t) {
                                    if (
                                        (this.options.get(`debug`) &&
                                            window.console &&
                                            console.warn &&
                                            console.warn(
                                                'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.',
                                            ),
                                        t == null || t.length === 0)
                                    )
                                        return this.$element.val();
                                    var n = t[0];
                                    (e.isArray(n) &&
                                        (n = e.map(n, function (e) {
                                            return e.toString();
                                        })),
                                        this.$element.val(n).trigger(`input`).trigger(`change`));
                                }),
                                (i.prototype.destroy = function () {
                                    (this.$container.remove(),
                                        this.$element[0].detachEvent &&
                                            this.$element[0].detachEvent(
                                                `onpropertychange`,
                                                this._syncA,
                                            ),
                                        this._observer == null
                                            ? this.$element[0].removeEventListener &&
                                              (this.$element[0].removeEventListener(
                                                  `DOMAttrModified`,
                                                  this._syncA,
                                                  !1,
                                              ),
                                              this.$element[0].removeEventListener(
                                                  `DOMNodeInserted`,
                                                  this._syncS,
                                                  !1,
                                              ),
                                              this.$element[0].removeEventListener(
                                                  `DOMNodeRemoved`,
                                                  this._syncS,
                                                  !1,
                                              ))
                                            : (this._observer.disconnect(),
                                              (this._observer = null)),
                                        (this._syncA = null),
                                        (this._syncS = null),
                                        this.$element.off(`.select2`),
                                        this.$element.attr(
                                            `tabindex`,
                                            n.GetData(this.$element[0], `old-tabindex`),
                                        ),
                                        this.$element.removeClass(`select2-hidden-accessible`),
                                        this.$element.attr(`aria-hidden`, `false`),
                                        n.RemoveData(this.$element[0]),
                                        this.$element.removeData(`select2`),
                                        this.dataAdapter.destroy(),
                                        this.selection.destroy(),
                                        this.dropdown.destroy(),
                                        this.results.destroy(),
                                        (this.dataAdapter = null),
                                        (this.selection = null),
                                        (this.dropdown = null),
                                        (this.results = null));
                                }),
                                (i.prototype.render = function () {
                                    var t = e(
                                        `<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>`,
                                    );
                                    return (
                                        t.attr(`dir`, this.options.get(`dir`)),
                                        (this.$container = t),
                                        this.$container.addClass(
                                            `select2-container--` + this.options.get(`theme`),
                                        ),
                                        n.StoreData(t[0], `element`, this.$element),
                                        t
                                    );
                                }),
                                i
                            );
                        },
                    ),
                    t.define(`jquery-mousewheel`, [`jquery`], function (e) {
                        return e;
                    }),
                    t.define(
                        `jquery.select2`,
                        [
                            `jquery`,
                            `jquery-mousewheel`,
                            `./select2/core`,
                            `./select2/defaults`,
                            `./select2/utils`,
                        ],
                        function (e, t, n, r, i) {
                            if (e.fn.select2 == null) {
                                var a = [`open`, `close`, `destroy`];
                                e.fn.select2 = function (t) {
                                    if (((t ||= {}), typeof t == `object`))
                                        return (
                                            this.each(function () {
                                                var r = e.extend(!0, {}, t);
                                                new n(e(this), r);
                                            }),
                                            this
                                        );
                                    if (typeof t == `string`) {
                                        var r,
                                            o = Array.prototype.slice.call(arguments, 1);
                                        return (
                                            this.each(function () {
                                                var e = i.GetData(this, `select2`);
                                                (e == null &&
                                                    window.console &&
                                                    console.error &&
                                                    console.error(
                                                        `The select2('` +
                                                            t +
                                                            `') method was called on an element that is not using Select2.`,
                                                    ),
                                                    (r = e[t].apply(e, o)));
                                            }),
                                            e.inArray(t, a) > -1 ? this : r
                                        );
                                    } else throw Error(`Invalid arguments for Select2: ` + t);
                                };
                            }
                            return (e.fn.select2.defaults ?? (e.fn.select2.defaults = r), n);
                        },
                    ),
                    {define: t.define, require: t.require}
                );
            })(),
            n = t.require(`jquery.select2`);
        return ((e.fn.select2.amd = t), n);
    });
});
function _() {
    return {
        errorLoading: function () {
            return `Die Ergebnisse konnten nicht geladen werden.`;
        },
        inputTooLong: function (e) {
            return `Bitte ` + (e.input.length - e.maximum) + ` Zeichen weniger eingeben`;
        },
        inputTooShort: function (e) {
            return (
                `Bitte ` +
                (e.minimum - e.input.length) +
                ` Zeichen mehr eingeben, es kann nach mehreren Teilen von Namen gesucht werden`
            );
        },
        loadingMore: function () {
            return `Lade mehr Ergebnisse…`;
        },
        maximumSelected: function (e) {
            var t = `Sie können nur ` + e.maximum + ` Eintr`;
            return (e.maximum === 1 ? (t += `ag`) : (t += `äge`), (t += ` auswählen`), t);
        },
        noResults: function () {
            return `Keine Übereinstimmungen gefunden`;
        },
        searching: function () {
            return `Suche…`;
        },
        removeAllItems: function () {
            return `Entferne alle Gegenstände`;
        },
    };
}
function v() {
    return {
        errorLoading: function () {
            return `The results could not be loaded.`;
        },
        inputTooLong: function (e) {
            var t = e.input.length - e.maximum,
                n = `Please delete ` + t + ` character`;
            return (t != 1 && (n += `s`), n);
        },
        inputTooShort: function (e) {
            return (
                `Please enter ` +
                (e.minimum - e.input.length) +
                ` or more characters, you can also search for multiple parts of names`
            );
        },
        loadingMore: function () {
            return `Loading more results…`;
        },
        maximumSelected: function (e) {
            var t = `You can only select ` + e.maximum + ` item`;
            return (e.maximum != 1 && (t += `s`), t);
        },
        noResults: function () {
            return `No results found`;
        },
        searching: function () {
            return `Searching…`;
        },
        removeAllItems: function () {
            return `Remove all items`;
        },
    };
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis,
    b =
        y.ShadowRoot &&
        (y.ShadyCSS === void 0 || y.ShadyCSS.nativeShadow) &&
        `adoptedStyleSheets` in Document.prototype &&
        `replace` in CSSStyleSheet.prototype,
    x = Symbol(),
    S = new WeakMap();
var C = class {
    constructor(e, t, n) {
        if (((this._$cssResult$ = !0), n !== x))
            throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        ((this.cssText = e), (this.t = t));
    }
    get styleSheet() {
        let e = this.o,
            t = this.t;
        if (b && e === void 0) {
            let n = t !== void 0 && t.length === 1;
            (n && (e = S.get(t)),
                e === void 0 &&
                    ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
                    n && S.set(t, e)));
        }
        return e;
    }
    toString() {
        return this.cssText;
    }
};
const w = (e) => new C(typeof e == `string` ? e : e + ``, void 0, x),
    T = (e, ...t) =>
        new C(
            e.length === 1
                ? e[0]
                : t.reduce(
                      (t, n, r) =>
                          t +
                          ((e) => {
                              if (!0 === e._$cssResult$) return e.cssText;
                              if (typeof e == `number`) return e;
                              throw Error(
                                  `Value passed to 'css' function must be a 'css' function result: ` +
                                      e +
                                      `. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`,
                              );
                          })(n) +
                          e[r + 1],
                      e[0],
                  ),
            e,
            x,
        ),
    E = (e, t) => {
        if (b) e.adoptedStyleSheets = t.map((e) => (e instanceof CSSStyleSheet ? e : e.styleSheet));
        else
            for (let n of t) {
                let t = document.createElement(`style`),
                    r = y.litNonce;
                (r !== void 0 && t.setAttribute(`nonce`, r),
                    (t.textContent = n.cssText),
                    e.appendChild(t));
            }
    },
    ee = b
        ? (e) => e
        : (e) =>
              e instanceof CSSStyleSheet
                  ? ((e) => {
                        let t = ``;
                        for (let n of e.cssRules) t += n.cssText;
                        return w(t);
                    })(e)
                  : e,
    {
        is: D,
        defineProperty: O,
        getOwnPropertyDescriptor: te,
        getOwnPropertyNames: ne,
        getOwnPropertySymbols: k,
        getPrototypeOf: re,
    } = Object,
    A = globalThis,
    ie = A.trustedTypes,
    ae = ie ? ie.emptyScript : ``,
    oe = A.reactiveElementPolyfillSupport,
    se = (e, t) => e,
    ce = {
        toAttribute(e, t) {
            switch (t) {
                case Boolean:
                    e = e ? ae : null;
                    break;
                case Object:
                case Array:
                    e = e == null ? e : JSON.stringify(e);
            }
            return e;
        },
        fromAttribute(e, t) {
            let n = e;
            switch (t) {
                case Boolean:
                    n = e !== null;
                    break;
                case Number:
                    n = e === null ? null : Number(e);
                    break;
                case Object:
                case Array:
                    try {
                        n = JSON.parse(e);
                    } catch {
                        n = null;
                    }
            }
            return n;
        },
    },
    le = (e, t) => !D(e, t),
    ue = {attribute: !0, type: String, converter: ce, reflect: !1, useDefault: !1, hasChanged: le};
((Symbol.metadata ??= Symbol(`metadata`)), (A.litPropertyMetadata ??= new WeakMap()));
var de = class extends HTMLElement {
    static addInitializer(e) {
        (this._$Ei(), (this.l ??= []).push(e));
    }
    static get observedAttributes() {
        return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
    }
    static createProperty(e, t = ue) {
        if (
            (t.state && (t.attribute = !1),
            this._$Ei(),
            this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
            this.elementProperties.set(e, t),
            !t.noAccessor)
        ) {
            let n = Symbol(),
                r = this.getPropertyDescriptor(e, n, t);
            r !== void 0 && O(this.prototype, e, r);
        }
    }
    static getPropertyDescriptor(e, t, n) {
        let {get: r, set: i} = te(this.prototype, e) ?? {
            get() {
                return this[t];
            },
            set(e) {
                this[t] = e;
            },
        };
        return {
            get: r,
            set(t) {
                let a = r?.call(this);
                (i?.call(this, t), this.requestUpdate(e, a, n));
            },
            configurable: !0,
            enumerable: !0,
        };
    }
    static getPropertyOptions(e) {
        return this.elementProperties.get(e) ?? ue;
    }
    static _$Ei() {
        if (this.hasOwnProperty(se(`elementProperties`))) return;
        let e = re(this);
        (e.finalize(),
            e.l !== void 0 && (this.l = [...e.l]),
            (this.elementProperties = new Map(e.elementProperties)));
    }
    static finalize() {
        if (this.hasOwnProperty(se(`finalized`))) return;
        if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(se(`properties`)))) {
            let e = this.properties,
                t = [...ne(e), ...k(e)];
            for (let n of t) this.createProperty(n, e[n]);
        }
        let e = this[Symbol.metadata];
        if (e !== null) {
            let t = litPropertyMetadata.get(e);
            if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
        }
        this._$Eh = new Map();
        for (let [e, t] of this.elementProperties) {
            let n = this._$Eu(e, t);
            n !== void 0 && this._$Eh.set(n, e);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(e) {
        let t = [];
        if (Array.isArray(e)) {
            let n = new Set(e.flat(1 / 0).reverse());
            for (let e of n) t.unshift(ee(e));
        } else e !== void 0 && t.push(ee(e));
        return t;
    }
    static _$Eu(e, t) {
        let n = t.attribute;
        return !1 === n
            ? void 0
            : typeof n == `string`
              ? n
              : typeof e == `string`
                ? e.toLowerCase()
                : void 0;
    }
    constructor() {
        (super(),
            (this._$Ep = void 0),
            (this.isUpdatePending = !1),
            (this.hasUpdated = !1),
            (this._$Em = null),
            this._$Ev());
    }
    _$Ev() {
        ((this._$ES = new Promise((e) => (this.enableUpdating = e))),
            (this._$AL = new Map()),
            this._$E_(),
            this.requestUpdate(),
            this.constructor.l?.forEach((e) => e(this)));
    }
    addController(e) {
        ((this._$EO ??= new Set()).add(e),
            this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.());
    }
    removeController(e) {
        this._$EO?.delete(e);
    }
    _$E_() {
        let e = new Map(),
            t = this.constructor.elementProperties;
        for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
        e.size > 0 && (this._$Ep = e);
    }
    createRenderRoot() {
        let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return (E(e, this.constructor.elementStyles), e);
    }
    connectedCallback() {
        ((this.renderRoot ??= this.createRenderRoot()),
            this.enableUpdating(!0),
            this._$EO?.forEach((e) => e.hostConnected?.()));
    }
    enableUpdating(e) {}
    disconnectedCallback() {
        this._$EO?.forEach((e) => e.hostDisconnected?.());
    }
    attributeChangedCallback(e, t, n) {
        this._$AK(e, n);
    }
    _$ET(e, t) {
        let n = this.constructor.elementProperties.get(e),
            r = this.constructor._$Eu(e, n);
        if (r !== void 0 && !0 === n.reflect) {
            let i = (n.converter?.toAttribute === void 0 ? ce : n.converter).toAttribute(t, n.type);
            ((this._$Em = e),
                i == null ? this.removeAttribute(r) : this.setAttribute(r, i),
                (this._$Em = null));
        }
    }
    _$AK(e, t) {
        let n = this.constructor,
            r = n._$Eh.get(e);
        if (r !== void 0 && this._$Em !== r) {
            let e = n.getPropertyOptions(r),
                i =
                    typeof e.converter == `function`
                        ? {fromAttribute: e.converter}
                        : e.converter?.fromAttribute === void 0
                          ? ce
                          : e.converter;
            this._$Em = r;
            let a = i.fromAttribute(t, e.type);
            ((this[r] = a ?? this._$Ej?.get(r) ?? a), (this._$Em = null));
        }
    }
    requestUpdate(e, t, n, r = !1, i) {
        if (e !== void 0) {
            let a = this.constructor;
            if (
                (!1 === r && (i = this[e]),
                (n ??= a.getPropertyOptions(e)),
                !(
                    (n.hasChanged ?? le)(i, t) ||
                    (n.useDefault &&
                        n.reflect &&
                        i === this._$Ej?.get(e) &&
                        !this.hasAttribute(a._$Eu(e, n)))
                ))
            )
                return;
            this.C(e, t, n);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(e, t, {useDefault: n, reflect: r, wrapped: i}, a) {
        (n &&
            !(this._$Ej ??= new Map()).has(e) &&
            (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0)) ||
            (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)),
            !0 === r && this._$Em !== e && (this._$Eq ??= new Set()).add(e));
    }
    async _$EP() {
        this.isUpdatePending = !0;
        try {
            await this._$ES;
        } catch (e) {
            Promise.reject(e);
        }
        let e = this.scheduleUpdate();
        return (e != null && (await e), !this.isUpdatePending);
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
            if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
                for (let [e, t] of this._$Ep) this[e] = t;
                this._$Ep = void 0;
            }
            let e = this.constructor.elementProperties;
            if (e.size > 0)
                for (let [t, n] of e) {
                    let {wrapped: e} = n,
                        r = this[t];
                    !0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
                }
        }
        let e = !1,
            t = this._$AL;
        try {
            ((e = this.shouldUpdate(t)),
                e
                    ? (this.willUpdate(t),
                      this._$EO?.forEach((e) => e.hostUpdate?.()),
                      this.update(t))
                    : this._$EM());
        } catch (t) {
            throw ((e = !1), this._$EM(), t);
        }
        e && this._$AE(t);
    }
    willUpdate(e) {}
    _$AE(e) {
        (this._$EO?.forEach((e) => e.hostUpdated?.()),
            this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
            this.updated(e));
    }
    _$EM() {
        ((this._$AL = new Map()), (this.isUpdatePending = !1));
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(e) {
        return !0;
    }
    update(e) {
        ((this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM());
    }
    updated(e) {}
    firstUpdated(e) {}
};
((de.elementStyles = []),
    (de.shadowRootOptions = {mode: `open`}),
    (de[se(`elementProperties`)] = new Map()),
    (de[se(`finalized`)] = new Map()),
    oe?.({ReactiveElement: de}),
    (A.reactiveElementVersions ??= []).push(`2.1.2`));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = globalThis,
    pe = (e) => e,
    j = fe.trustedTypes,
    me = j ? j.createPolicy(`lit-html`, {createHTML: (e) => e}) : void 0,
    he = `$lit$`,
    M = `lit$${Math.random().toFixed(9).slice(2)}$`,
    N = `?` + M,
    ge = `<${N}>`,
    _e = document,
    ve = () => _e.createComment(``),
    P = (e) => e === null || (typeof e != `object` && typeof e != `function`),
    F = Array.isArray,
    ye = (e) => F(e) || typeof e?.[Symbol.iterator] == `function`,
    I = `[ 	
\f\r]`,
    L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    be = /-->/g,
    xe = />/g,
    R = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, `g`),
    z = /'/g,
    Se = /"/g,
    Ce = /^(?:script|style|textarea|title)$/i,
    we = (
        (e) =>
        (t, ...n) => ({_$litType$: e, strings: t, values: n})
    )(1),
    B = Symbol.for(`lit-noChange`),
    V = Symbol.for(`lit-nothing`),
    Te = new WeakMap(),
    H = _e.createTreeWalker(_e, 129);
function Ee(e, t) {
    if (!F(e) || !e.hasOwnProperty(`raw`)) throw Error(`invalid template strings array`);
    return me === void 0 ? t : me.createHTML(t);
}
const De = (e, t) => {
    let n = e.length - 1,
        r = [],
        i,
        a = t === 2 ? `<svg>` : t === 3 ? `<math>` : ``,
        o = L;
    for (let t = 0; t < n; t++) {
        let n = e[t],
            s,
            c,
            l = -1,
            u = 0;
        for (; u < n.length && ((o.lastIndex = u), (c = o.exec(n)), c !== null); )
            ((u = o.lastIndex),
                o === L
                    ? c[1] === `!--`
                        ? (o = be)
                        : c[1] === void 0
                          ? c[2] === void 0
                              ? c[3] !== void 0 && (o = R)
                              : (Ce.test(c[2]) && (i = RegExp(`</` + c[2], `g`)), (o = R))
                          : (o = xe)
                    : o === R
                      ? c[0] === `>`
                          ? ((o = i ?? L), (l = -1))
                          : c[1] === void 0
                            ? (l = -2)
                            : ((l = o.lastIndex - c[2].length),
                              (s = c[1]),
                              (o = c[3] === void 0 ? R : c[3] === `"` ? Se : z))
                      : o === Se || o === z
                        ? (o = R)
                        : o === be || o === xe
                          ? (o = L)
                          : ((o = R), (i = void 0)));
        let d = o === R && e[t + 1].startsWith(`/>`) ? ` ` : ``;
        a +=
            o === L
                ? n + ge
                : l >= 0
                  ? (r.push(s), n.slice(0, l) + he + n.slice(l) + M + d)
                  : n + M + (l === -2 ? t : d);
    }
    return [Ee(e, a + (e[n] || `<?>`) + (t === 2 ? `</svg>` : t === 3 ? `</math>` : ``)), r];
};
var Oe = class e {
    constructor({strings: t, _$litType$: n}, r) {
        let i;
        this.parts = [];
        let a = 0,
            o = 0,
            s = t.length - 1,
            c = this.parts,
            [l, u] = De(t, n);
        if (
            ((this.el = e.createElement(l, r)),
            (H.currentNode = this.el.content),
            n === 2 || n === 3)
        ) {
            let e = this.el.content.firstChild;
            e.replaceWith(...e.childNodes);
        }
        for (; (i = H.nextNode()) !== null && c.length < s; ) {
            if (i.nodeType === 1) {
                if (i.hasAttributes())
                    for (let e of i.getAttributeNames())
                        if (e.endsWith(he)) {
                            let t = u[o++],
                                n = i.getAttribute(e).split(M),
                                r = /([.?@])?(.*)/.exec(t);
                            (c.push({
                                type: 1,
                                index: a,
                                name: r[2],
                                strings: n,
                                ctor:
                                    r[1] === `.` ? Me : r[1] === `?` ? Ne : r[1] === `@` ? Pe : je,
                            }),
                                i.removeAttribute(e));
                        } else
                            e.startsWith(M) && (c.push({type: 6, index: a}), i.removeAttribute(e));
                if (Ce.test(i.tagName)) {
                    let e = i.textContent.split(M),
                        t = e.length - 1;
                    if (t > 0) {
                        i.textContent = j ? j.emptyScript : ``;
                        for (let n = 0; n < t; n++)
                            (i.append(e[n], ve()), H.nextNode(), c.push({type: 2, index: ++a}));
                        i.append(e[t], ve());
                    }
                }
            } else if (i.nodeType === 8)
                if (i.data === N) c.push({type: 2, index: a});
                else {
                    let e = -1;
                    for (; (e = i.data.indexOf(M, e + 1)) !== -1; )
                        (c.push({type: 7, index: a}), (e += M.length - 1));
                }
            a++;
        }
    }
    static createElement(e, t) {
        let n = _e.createElement(`template`);
        return ((n.innerHTML = e), n);
    }
};
function U(e, t, n = e, r) {
    if (t === B) return t;
    let i = r === void 0 ? n._$Cl : n._$Co?.[r],
        a = P(t) ? void 0 : t._$litDirective$;
    return (
        i?.constructor !== a &&
            (i?._$AO?.(!1),
            a === void 0 ? (i = void 0) : ((i = new a(e)), i._$AT(e, n, r)),
            r === void 0 ? (n._$Cl = i) : ((n._$Co ??= [])[r] = i)),
        i !== void 0 && (t = U(e, i._$AS(e, t.values), i, r)),
        t
    );
}
var ke = class {
        constructor(e, t) {
            ((this._$AV = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = t));
        }
        get parentNode() {
            return this._$AM.parentNode;
        }
        get _$AU() {
            return this._$AM._$AU;
        }
        u(e) {
            let {
                    el: {content: t},
                    parts: n,
                } = this._$AD,
                r = (e?.creationScope ?? _e).importNode(t, !0);
            H.currentNode = r;
            let i = H.nextNode(),
                a = 0,
                o = 0,
                s = n[0];
            for (; s !== void 0; ) {
                if (a === s.index) {
                    let t;
                    (s.type === 2
                        ? (t = new Ae(i, i.nextSibling, this, e))
                        : s.type === 1
                          ? (t = new s.ctor(i, s.name, s.strings, this, e))
                          : s.type === 6 && (t = new Fe(i, this, e)),
                        this._$AV.push(t),
                        (s = n[++o]));
                }
                a !== s?.index && ((i = H.nextNode()), a++);
            }
            return ((H.currentNode = _e), r);
        }
        p(e) {
            let t = 0;
            for (let n of this._$AV)
                (n !== void 0 &&
                    (n.strings === void 0
                        ? n._$AI(e[t])
                        : (n._$AI(e, n, t), (t += n.strings.length - 2))),
                    t++);
        }
    },
    Ae = class e {
        get _$AU() {
            return this._$AM?._$AU ?? this._$Cv;
        }
        constructor(e, t, n, r) {
            ((this.type = 2),
                (this._$AH = V),
                (this._$AN = void 0),
                (this._$AA = e),
                (this._$AB = t),
                (this._$AM = n),
                (this.options = r),
                (this._$Cv = r?.isConnected ?? !0));
        }
        get parentNode() {
            let e = this._$AA.parentNode,
                t = this._$AM;
            return (t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e);
        }
        get startNode() {
            return this._$AA;
        }
        get endNode() {
            return this._$AB;
        }
        _$AI(e, t = this) {
            ((e = U(this, e, t)),
                P(e)
                    ? e === V || e == null || e === ``
                        ? (this._$AH !== V && this._$AR(), (this._$AH = V))
                        : e !== this._$AH && e !== B && this._(e)
                    : e._$litType$ === void 0
                      ? e.nodeType === void 0
                          ? ye(e)
                              ? this.k(e)
                              : this._(e)
                          : this.T(e)
                      : this.$(e));
        }
        O(e) {
            return this._$AA.parentNode.insertBefore(e, this._$AB);
        }
        T(e) {
            this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
        }
        _(e) {
            (this._$AH !== V && P(this._$AH)
                ? (this._$AA.nextSibling.data = e)
                : this.T(_e.createTextNode(e)),
                (this._$AH = e));
        }
        $(e) {
            let {values: t, _$litType$: n} = e,
                r =
                    typeof n == `number`
                        ? this._$AC(e)
                        : (n.el === void 0 &&
                              (n.el = Oe.createElement(Ee(n.h, n.h[0]), this.options)),
                          n);
            if (this._$AH?._$AD === r) this._$AH.p(t);
            else {
                let e = new ke(r, this),
                    n = e.u(this.options);
                (e.p(t), this.T(n), (this._$AH = e));
            }
        }
        _$AC(e) {
            let t = Te.get(e.strings);
            return (t === void 0 && Te.set(e.strings, (t = new Oe(e))), t);
        }
        k(t) {
            F(this._$AH) || ((this._$AH = []), this._$AR());
            let n = this._$AH,
                r,
                i = 0;
            for (let a of t)
                (i === n.length
                    ? n.push((r = new e(this.O(ve()), this.O(ve()), this, this.options)))
                    : (r = n[i]),
                    r._$AI(a),
                    i++);
            i < n.length && (this._$AR(r && r._$AB.nextSibling, i), (n.length = i));
        }
        _$AR(e = this._$AA.nextSibling, t) {
            for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
                let t = pe(e).nextSibling;
                (pe(e).remove(), (e = t));
            }
        }
        setConnected(e) {
            this._$AM === void 0 && ((this._$Cv = e), this._$AP?.(e));
        }
    },
    je = class {
        get tagName() {
            return this.element.tagName;
        }
        get _$AU() {
            return this._$AM._$AU;
        }
        constructor(e, t, n, r, i) {
            ((this.type = 1),
                (this._$AH = V),
                (this._$AN = void 0),
                (this.element = e),
                (this.name = t),
                (this._$AM = r),
                (this.options = i),
                n.length > 2 || n[0] !== `` || n[1] !== ``
                    ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n))
                    : (this._$AH = V));
        }
        _$AI(e, t = this, n, r) {
            let i = this.strings,
                a = !1;
            if (i === void 0)
                ((e = U(this, e, t, 0)),
                    (a = !P(e) || (e !== this._$AH && e !== B)),
                    a && (this._$AH = e));
            else {
                let r = e,
                    o,
                    s;
                for (e = i[0], o = 0; o < i.length - 1; o++)
                    ((s = U(this, r[n + o], t, o)),
                        s === B && (s = this._$AH[o]),
                        (a ||= !P(s) || s !== this._$AH[o]),
                        s === V ? (e = V) : e !== V && (e += (s ?? ``) + i[o + 1]),
                        (this._$AH[o] = s));
            }
            a && !r && this.j(e);
        }
        j(e) {
            e === V
                ? this.element.removeAttribute(this.name)
                : this.element.setAttribute(this.name, e ?? ``);
        }
    },
    Me = class extends je {
        constructor() {
            (super(...arguments), (this.type = 3));
        }
        j(e) {
            this.element[this.name] = e === V ? void 0 : e;
        }
    },
    Ne = class extends je {
        constructor() {
            (super(...arguments), (this.type = 4));
        }
        j(e) {
            this.element.toggleAttribute(this.name, !!e && e !== V);
        }
    },
    Pe = class extends je {
        constructor(e, t, n, r, i) {
            (super(e, t, n, r, i), (this.type = 5));
        }
        _$AI(e, t = this) {
            if ((e = U(this, e, t, 0) ?? V) === B) return;
            let n = this._$AH,
                r =
                    (e === V && n !== V) ||
                    e.capture !== n.capture ||
                    e.once !== n.once ||
                    e.passive !== n.passive,
                i = e !== V && (n === V || r);
            (r && this.element.removeEventListener(this.name, this, n),
                i && this.element.addEventListener(this.name, this, e),
                (this._$AH = e));
        }
        handleEvent(e) {
            typeof this._$AH == `function`
                ? this._$AH.call(this.options?.host ?? this.element, e)
                : this._$AH.handleEvent(e);
        }
    },
    Fe = class {
        constructor(e, t, n) {
            ((this.element = e),
                (this.type = 6),
                (this._$AN = void 0),
                (this._$AM = t),
                (this.options = n));
        }
        get _$AU() {
            return this._$AM._$AU;
        }
        _$AI(e) {
            U(this, e);
        }
    };
const W = fe.litHtmlPolyfillSupport;
(W?.(Oe, Ae), (fe.litHtmlVersions ??= []).push(`3.3.2`));
const G = (e, t, n) => {
        let r = n?.renderBefore ?? t,
            i = r._$litPart$;
        if (i === void 0) {
            let e = n?.renderBefore ?? null;
            r._$litPart$ = i = new Ae(t.insertBefore(ve(), e), e, void 0, n ?? {});
        }
        return (i._$AI(e), i);
    },
    Ie = globalThis;
var Le = class extends de {
    constructor() {
        (super(...arguments), (this.renderOptions = {host: this}), (this._$Do = void 0));
    }
    createRenderRoot() {
        let e = super.createRenderRoot();
        return ((this.renderOptions.renderBefore ??= e.firstChild), e);
    }
    update(e) {
        let t = this.render();
        (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
            super.update(e),
            (this._$Do = G(t, this.renderRoot, this.renderOptions)));
    }
    connectedCallback() {
        (super.connectedCallback(), this._$Do?.setConnected(!0));
    }
    disconnectedCallback() {
        (super.disconnectedCallback(), this._$Do?.setConnected(!1));
    }
    render() {
        return B;
    }
};
((Le._$litElement$ = !0), (Le.finalized = !0), Ie.litElementHydrateSupport?.({LitElement: Le}));
const Re = Ie.litElementPolyfillSupport;
(Re?.({LitElement: Le}), (Ie.litElementVersions ??= []).push(`4.2.2`));
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const ze = (e) => e ?? V;
var Be = `@dbp-toolkit/common`;
function Ve(e) {
    return f(Be, `icons/` + encodeURI(e) + `.svg`);
}
var He = class extends Le {
        constructor() {
            (super(), (this.name = `bolt`), (this.ariaLabel = void 0));
        }
        static get properties() {
            return {
                name: {type: String},
                ariaLabel: {type: String, attribute: `aria-label`, reflect: !0},
            };
        }
        static get styles() {
            return T`
            :host {
                display: inline-block;
                height: 1em;
                width: 1em;
                min-width: 1em;
                min-height: 1em;
                top: 0.125em;
                position: relative;
            }

            #svg {
                height: 100%;
                width: 100%;
                background-repeat: no-repeat;
                background-position: center;
                background-color: currentColor;
                mask-repeat: no-repeat;
                mask-position: center;
                mask-size: 100% 100%;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
                -webkit-mask-size: 100% 100%;
            }
        `;
        }
        render() {
            let e = Ve(this.name),
                t = this.name.trim().split(` `).join(``);
            return we`
            <style>
                #svg {
                    -webkit-mask-image: var(--dbp-override-icon-${t}, url(${e}));
                    mask-image: var(--dbp-override-icon-${t}, url(${e}));
                }
            </style>
            <div
                id="svg"
                aria-label="${ze(this.ariaLabel ? this.ariaLabel : void 0)}"></div>
        `;
        }
    },
    Ue = class extends Le {
        constructor() {
            (super(), (this.text = ``));
        }
        static get properties() {
            return {text: {type: String}};
        }
        static get styles() {
            return T`
            .outer {
                display: inline-block;
                vertical-align: sub;
            }
            .inner {
                display: flex;
            }
            .ring {
                display: inline-block;
                position: relative;
                width: 1em;
                height: 1em;
            }
            .ring div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                border: 0.2em solid currentColor;
                border-radius: 50%;
                animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: currentColor transparent transparent transparent;
            }
            .ring div:nth-child(1) {
                animation-delay: -0.45s;
            }
            .ring div:nth-child(2) {
                animation-delay: -0.3s;
            }
            .ring div:nth-child(3) {
                animation-delay: -0.15s;
            }
            @keyframes ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .text {
                display: inline-block;
                margin-left: 0.5em;
                font-size: 0.7em;
            }
        `;
        }
        render() {
            return we`
            <div class="outer">
                <div class="inner">
                    <div class="ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    ${
                        this.text === ``
                            ? we``
                            : we`
                      <div class="text">${this.text}</div>
                  `
                    }
                </div>
            </div>
        `;
        }
    };
const We = new WeakMap();
function Ge(e, t) {
    let n = t;
    for (; n; ) {
        if (We.get(n) === e) return !0;
        n = Object.getPrototypeOf(n);
    }
    return !1;
}
function Ke(e) {
    return (t) => {
        if (Ge(e, t)) return t;
        let n = e(t);
        return (We.set(n, e), n);
    };
}
const qe = `3.0.0`,
    Je = window.scopedElementsVersions || (window.scopedElementsVersions = []);
Je.includes(qe) || Je.push(qe);
const Ye = Ke(
        (e) =>
            class extends e {
                static scopedElements;
                static get scopedElementsVersion() {
                    return qe;
                }
                static __registry;
                get registry() {
                    return this.constructor.__registry;
                }
                set registry(e) {
                    this.constructor.__registry = e;
                }
                attachShadow(e) {
                    let {scopedElements: t} = this.constructor;
                    if (
                        !this.registry ||
                        (this.registry === this.constructor.__registry &&
                            !Object.prototype.hasOwnProperty.call(this.constructor, `__registry`))
                    ) {
                        this.registry = new CustomElementRegistry();
                        for (let [e, n] of Object.entries(t ?? {})) this.registry.define(e, n);
                    }
                    return super.attachShadow({
                        ...e,
                        customElements: this.registry,
                        registry: this.registry,
                    });
                }
            },
    ),
    Xe = Ke(
        (e) =>
            class extends Ye(e) {
                createRenderRoot() {
                    let {shadowRootOptions: e, elementStyles: t} = this.constructor,
                        n = this.attachShadow(e);
                    return (
                        (this.renderOptions.creationScope = n),
                        E(n, t),
                        (this.renderOptions.renderBefore ??= n.firstChild),
                        n
                    );
                }
            },
    );
function Ze() {
    return !!(
        globalThis.ShadowRoot?.prototype.createElement &&
        globalThis.ShadowRoot?.prototype.importNode
    );
}
const Qe = Ke(
    (e) =>
        class extends Xe(e) {
            constructor() {
                super();
            }
            createScopedElement(e) {
                return (Ze() ? this.shadowRoot : document).createElement(e);
            }
            defineScopedElement(e, t) {
                let n = this.registry.get(e),
                    r = n && n !== t;
                return (
                    !Ze() &&
                        r &&
                        console.error(
                            [
                                `You are trying to re-register the "${e}" custom element with a different class via ScopedElementsMixin.`,
                                `This is only possible with a CustomElementRegistry.`,
                                `Your browser does not support this feature so you will need to load a polyfill for it.`,
                                `Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.`,
                                `e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"><\/script>" as your first script tag.`,
                                `For more details you can visit https://open-wc.org/docs/development/scoped-elements/`,
                            ].join(`
`),
                        ),
                    n ? this.registry.get(e) : this.registry.define(e, t)
                );
            }
            attachShadow(e) {
                let {scopedElements: t} = this.constructor;
                if (
                    !this.registry ||
                    (this.registry === this.constructor.__registry &&
                        !Object.prototype.hasOwnProperty.call(this.constructor, `__registry`))
                ) {
                    this.registry = Ze() ? new CustomElementRegistry() : customElements;
                    for (let [e, n] of Object.entries(t ?? {})) this.defineScopedElement(e, n);
                }
                return Element.prototype.attachShadow.call(this, {
                    ...e,
                    customElements: this.registry,
                    registry: this.registry,
                });
            }
            createRenderRoot() {
                let {shadowRootOptions: e, elementStyles: t} = this.constructor,
                    n = this.attachShadow(e);
                return (
                    Ze() && (this.renderOptions.creationScope = n),
                    n instanceof ShadowRoot &&
                        (E(n, t),
                        (this.renderOptions.renderBefore =
                            this.renderOptions.renderBefore || n.firstChild)),
                    n
                );
            }
        },
);
function $e() {
    return T`
        :host {
            /* new new variables */
            --dbp-background: var(--dbp-override-background, #ffffff);
            --dbp-content: var(--dbp-override-content, #222120);
            --dbp-content-surface: var(--dbp-override-content-surface, var(--dbp-content));
            --dbp-on-content-surface: var(--dbp-override-on-content-surface, var(--dbp-background));
            --dbp-border: var(--dbp-override-border, 1px solid #222120);
            --dbp-border-radius: var(--dbp-override-border-radius, 0px);
            --dbp-primary: var(--dbp-override-primary, #3775c1);
            --dbp-primary-surface: var(--dbp-override-primary-surface, var(--dbp-primary));
            --dbp-on-primary-surface: var(
                --dbp-override-on-primary-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-primary-surface-border-color: var(
                --dbp-override-primary-surface-border-color,
                var(--dbp-primary)
            );
            --dbp-secondary: var(--dbp-override-secondary, #222120);
            --dbp-secondary-surface: var(--dbp-override-secondary-surface, var(--dbp-secondary));
            --dbp-on-secondary-surface: var(
                --dbp-override-on-secondary-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-secondary-surface-border-color: var(
                --dbp-override-secondary-surface-border-color,
                var(--dbp-secondary)
            );
            --dbp-muted: var(--dbp-override-muted, #767676);
            --dbp-muted-surface: var(--dbp-override-muted-surface, var(--dbp-muted));
            --dbp-on-muted-surface: var(
                --dbp-override-on-muted-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-muted-surface-border-color: var(
                --dbp-override-muted-surface-border-color,
                var(--dbp-muted)
            );
            --dbp-accent: var(--dbp-override-accent, #9e1e4d);
            --dbp-accent-surface: var(--dbp-override-accent-surface, var(--dbp-accent));
            --dbp-on-accent-surface: var(
                --dbp-override-on-accent-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-accent-surface-border-color: var(
                --dbp-override-accent-surface-border-color,
                var(--dbp-accent)
            );
            --dbp-info: var(--dbp-override-info, #38808a);
            --dbp-info-surface: var(--dbp-override-info-surface, var(--dbp-info));
            --dbp-on-info-surface: var(
                --dbp-override-on-info-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-info-surface-border-color: var(
                --dbp-override-info-surface-border-color,
                var(--dbp-info)
            );
            --dbp-success: var(--dbp-override-success, #338555);
            --dbp-success-surface: var(--dbp-override-success-surface, var(--dbp-success));
            --dbp-on-success-surface: var(
                --dbp-override-on-success-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-success-surface-border-color: var(
                --dbp-override-success-surface-border-color,
                var(--dbp-success)
            );
            --dbp-warning: var(--dbp-override-warning, #bf8808);
            --dbp-warning-surface: var(--dbp-override-warning-surface, var(--dbp-warning));
            --dbp-on-warning-surface: var(
                --dbp-override-on-warning-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-warning-surface-border-color: var(
                --dbp-override-warning-surface-border-color,
                var(--dbp-warning)
            );
            --dbp-danger: var(--dbp-override-danger, #cc3232);
            --dbp-danger-surface: var(--dbp-override-danger-surface, var(--dbp-danger));
            --dbp-on-danger-surface: var(
                --dbp-override-on-danger-surface,
                var(--dbp-on-content-surface)
            );
            --dbp-danger-surface-border-color: var(
                --dbp-override-danger-surface-border-color,
                var(--dbp-danger)
            );
            --dbp-hover-background-color: var(--dbp-override-hover-background-color);
            --dbp-hover-color: var(--dbp-override-hover-color);
        }

        #root {
            background-color: var(--dbp-background);
            color: var(--dbp-content);
        }

        ::-moz-selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }

        ::selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }
    `;
}
function et(e = !0) {
    return T`
        h2 {
            font-weight: 300;
            /*text-align: center;*/
        }

        h3 {
            font-weight: 300;
            margin-top: 0px;
            margin-bottom: 0.75rem;
        }

        p {
            font-size: 1em;
        }

        .field:not(:last-child) {
            margin-bottom: 0.75rem;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .input,
        .textarea,
        .select select {
            border: solid 1px var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            padding-bottom: calc(0.375em - 1px);
            padding-left: calc(0.625em - 1px);
            padding-right: calc(0.625em - 1px);
            padding-top: calc(0.375em - 1px);
        }

        .input::placeholder,
        .textarea::placeholder,
        .select select::placeholder {
            color: var(--dbp-muted);
        }

        input,
        ::placeholder,
        textarea,
        select,
        button,
        .select select {
            font-size: inherit;
            font-family: inherit;
        }

        input::-moz-focus-inner {
            border: 0;
        }

        :focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }

        .control {
            box-sizing: border-box;
            clear: both;
            font-size: 1rem;
            position: relative;
            text-align: left;
        }

        .label {
            margin-bottom: 0.5em;
            display: block;
            font-weight: 600;
        }

        .hidden {
            display: none;
        }

        a {
            color: var(--dbp-content);
            cursor: pointer;
            text-decoration: none;
            word-wrap: break-word;
        }

        a.is-download {
            border-bottom: var(--dbp-border);
            transition:
                background-color 0.15s,
                color 0.15s;
        }

        a.is-download:hover {
            color: var(--dbp-hover-color, var(--dbp-content));
            background-color: var(--dbp-hover-background-color);
        }

        #headline h1 {
            font-size: 2em;
            font-weight: normal;
        }

        ${
            e
                ? T`
              blockquote,
              body,
              dd,
              dl,
              dt,
              fieldset,
              figure,
              h1,
              h2,
              h3,
              h4,
              h5,
              h6,
              hr,
              html,
              iframe,
              legend,
              li,
              ol,
              p,
              pre,
              textarea,
              ul {
                  margin: 0;
                  padding: 0;
              }
              /*here played around*/
              /*h1 {
                  font-weight: 300;
                  margin-bottom: 20px;
                  text-align: center;
              }*/
          `
                : T``
        }.int-link-internal

        .button[disabled], .file-cta[disabled], .file-name[disabled], .input[disabled], .pagination-ellipsis[disabled],
        .pagination-link[disabled], .pagination-next[disabled], .pagination-previous[disabled], .select fieldset[disabled] select,
        .select select[disabled], .textarea[disabled], fieldset[disabled] .button, fieldset[disabled] .file-cta,
        fieldset[disabled] .file-name, fieldset[disabled] .input, fieldset[disabled] .pagination-ellipsis,
        fieldset[disabled] .pagination-link, fieldset[disabled] .pagination-next, fieldset[disabled] .pagination-previous,
        fieldset[disabled] .select select, fieldset[disabled] .textarea {
            cursor: not-allowed;
        }

        .input,
        .select select,
        .textarea {
            background-color: var(--dbp-background);
            border-color: var(--dbp-muted);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
        }

        .input[disabled] {
            color: var(--dbp-muted);
        }

        *,
        ::after,
        ::before {
            box-sizing: inherit;
        }

        select:not(.select),
        .dropdown-menu {
            -moz-appearance: none;
            -webkit-appearance: none;
            background-color: var(--dbp-background);
            background: calc(100% - 0.4rem) center no-repeat
                url('${w(Ve(`chevron-down`))}');
            background-size: 25%;
            border: var(--dbp-border);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
            padding: 0.14rem 1rem 0.14rem 0.14rem;
        }

        ::-moz-selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }

        ::selection {
            color: var(--dbp-on-primary-surface);
            background: var(--dbp-primary-surface);
        }
    `;
}
function tt() {
    return T`
        .buttons.has-addons .button:not(:first-child) {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .buttons.has-addons .button:not(:last-child) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
            margin-right: -1px;
        }

        .buttons.has-addons .button:last-child {
            margin-right: 0;
        }

        .buttons.has-addons .button:hover,
        .buttons.has-addons .button.is-hovered {
            z-index: 2;
        }

        .buttons.has-addons .button:focus,
        .buttons.has-addons .button.is-focused,
        .buttons.has-addons .button:active,
        .buttons.has-addons .button.is-active,
        .buttons.has-addons .button.is-selected {
            z-index: 3;
        }

        .buttons.has-addons .button:focus:hover,
        .buttons.has-addons .button.is-focused:hover,
        .buttons.has-addons .button:active:hover,
        .buttons.has-addons .button.is-active:hover,
        .buttons.has-addons .button.is-selected:hover {
            z-index: 4;
        }

        .buttons.has-addons .button.is-expanded {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .buttons.is-centered {
            justify-content: center;
        }

        .buttons.is-centered:not(.has-addons) .button:not(.is-fullwidth) {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }

        .buttons.is-right {
            justify-content: flex-end;
        }

        .buttons.is-right:not(.has-addons) .button:not(.is-fullwidth) {
            margin-left: 0.25rem;
            margin-right: 0.25rem;
        }

        .tags.has-addons .tag {
            margin-right: 0;
        }

        .tags.has-addons .tag:not(:first-child) {
            margin-left: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .tags.has-addons .tag:not(:last-child) {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }

        .field.has-addons {
            display: flex;
            justify-content: flex-start;
        }

        .field.has-addons .control:not(:last-child) {
            margin-right: -1px;
        }

        .field.has-addons .control:not(:first-child):not(:last-child) .button,
        .field.has-addons .control:not(:first-child):not(:last-child) .input,
        .field.has-addons .control:not(:first-child):not(:last-child) .select select {
            border-radius: 0;
        }

        .field.has-addons .control:first-child:not(:only-child) .button,
        .field.has-addons .control:first-child:not(:only-child) .input,
        .field.has-addons .control:first-child:not(:only-child) .select select {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }

        .field.has-addons .control:last-child:not(:only-child) .button,
        .field.has-addons .control:last-child:not(:only-child) .input,
        .field.has-addons .control:last-child:not(:only-child) .select select {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }

        .field.has-addons .control .button:not([disabled]):hover,
        .field.has-addons .control .button:not([disabled]).is-hovered,
        .field.has-addons .control .input:not([disabled]):hover,
        .field.has-addons .control .input:not([disabled]).is-hovered,
        .field.has-addons .control .select select:not([disabled]):hover,
        .field.has-addons .control .select select:not([disabled]).is-hovered {
            z-index: 2;
        }

        .field.has-addons .control .button:not([disabled]):focus,
        .field.has-addons .control .button:not([disabled]).is-focused,
        .field.has-addons .control .button:not([disabled]):active,
        .field.has-addons .control .button:not([disabled]).is-active,
        .field.has-addons .control .input:not([disabled]):focus,
        .field.has-addons .control .input:not([disabled]).is-focused,
        .field.has-addons .control .input:not([disabled]):active,
        .field.has-addons .control .input:not([disabled]).is-active,
        .field.has-addons .control .select select:not([disabled]):focus,
        .field.has-addons .control .select select:not([disabled]).is-focused,
        .field.has-addons .control .select select:not([disabled]):active,
        .field.has-addons .control .select select:not([disabled]).is-active {
            z-index: 3;
        }

        .field.has-addons .control .button:not([disabled]):focus:hover,
        .field.has-addons .control .button:not([disabled]).is-focused:hover,
        .field.has-addons .control .button:not([disabled]):active:hover,
        .field.has-addons .control .button:not([disabled]).is-active:hover,
        .field.has-addons .control .input:not([disabled]):focus:hover,
        .field.has-addons .control .input:not([disabled]).is-focused:hover,
        .field.has-addons .control .input:not([disabled]):active:hover,
        .field.has-addons .control .input:not([disabled]).is-active:hover,
        .field.has-addons .control .select select:not([disabled]):focus:hover,
        .field.has-addons .control .select select:not([disabled]).is-focused:hover,
        .field.has-addons .control .select select:not([disabled]):active:hover,
        .field.has-addons .control .select select:not([disabled]).is-active:hover {
            z-index: 4;
        }

        .field.has-addons .control.is-expanded {
            flex-grow: 1;
            flex-shrink: 1;
        }

        .field.has-addons.has-addons-centered {
            justify-content: center;
        }

        .field.has-addons.has-addons-right {
            justify-content: flex-end;
        }

        .field.has-addons.has-addons-fullwidth .control {
            flex-grow: 1;
            flex-shrink: 0;
        }
    `;
}
function nt() {
    return T`
        button.button,
        .button,
        button.dt-button {
            border: var(--dbp-border);
            border-radius: var(--dbp-border-radius);
            color: var(--dbp-content);
            cursor: pointer;
            justify-content: center;
            padding-bottom: calc(0.375em - 1px);
            padding-left: 0.75em;
            padding-right: 0.75em;
            padding-top: calc(0.375em - 1px);
            text-align: center;
            white-space: nowrap;
            font-size: inherit;
            font-weight: bolder;
            font-family: inherit;
            transition:
                all 0.15s ease 0s,
                color 0.15s ease 0s;
            background: var(--dbp-secondary-surface);
            color: var(--dbp-on-secondary-surface);
            border-color: var(--dbp-secondary-surface-border-color);
        }

        button.button:hover:enabled,
        .button:hover:enabled,
        button.dt-button:hover:enabled,
        button.dt-button:hover:not(.disabled) {
            color: var(--dbp-hover-color, var(--dbp-on-secondary-surface));
            background-color: var(--dbp-hover-background-color, var(--dbp-secondary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-secondary-surface-border-color)
            );
        }

        button.button.is-small,
        .button.is-small {
            border-radius: calc(var(--dbp-border-radius) / 2);
            font-size: 0.75rem;
        }

        button.button.is-icon,
        .button.is-icon {
            border: none;
            background: none;
            padding: 0px;
            width: var(--dbp-button-size, 40px);
            height: var(--dbp-button-size, 40px);
            display: flex;
            justify-content: center;
            align-items: center;
            color: currentColor;
        }

        button.button.is-icon dbp-icon,
        .button.is-icon dbp-icon {
            top: 0px;
        }

        button.button.is-icon:hover:enabled,
        .button.is-icon:hover:enabled {
            background-color: var(--dbp-hover-background-color, unset);
            color: var(--dbp-hover-color, currentColor);
            border: 0 none;
        }

        button.button.is-primary,
        .button.is-primary {
            background-color: var(--dbp-primary-surface);
            border-color: var(--dbp-primary-surface-border-color);
            color: var(--dbp-on-primary-surface);
        }

        button.button.is-primary:hover:enabled,
        .button.is-primary:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-primary-surface));
            color: var(--dbp-hover-color, var(--dbp-on-primary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-primary-surface-border-color)
            );
        }

        button.button.is-secondary,
        .button.is-secondary {
            background-color: var(--dbp-secondary-surface);
            color: var(--dbp-on-secondary-surface);
            border-color: var(--dbp-secondary-surface-border-color);
        }

        button.button.is-secondary:hover:enabled,
        .button.is-secondary:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-secondary-surface));
            color: var(--dbp-hover-color, var(--dbp-on-secondary-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-secondary-surface-border-color)
            );
        }

        button.button.is-info,
        .button.is-info {
            background-color: var(--dbp-info-surface);
            color: var(--dbp-on-info-surface);
            border-color: var(--dbp-info-surface-border-color);
        }

        button.button.is-info:hover:enabled,
        .button.is-info:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-info-surface));
            color: var(--dbp-hover-color, var(--dbp-on-info-surface));
            border-color: var(--dbp-hover-background-color, var(--dbp-info-surface-border-color));
        }

        button.button.is-success,
        .button.is-success {
            background-color: var(--dbp-success-surface);
            border-color: var(--dbp-success-surface-border-color);
            color: var(--dbp-on-success-surface);
        }

        button.button.is-success:hover:enabled,
        .button.is-success:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-success-surface));
            color: var(--dbp-hover-color, var(--dbp-on-success-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-success-surface-border-color)
            );
        }

        button.button.is-warning,
        .button.is-warning {
            background-color: var(--dbp-warning-surface);
            border-color: var(--dbp-warning-surface-border-color);
            color: var(--dbp-on-warning-surface);
        }

        button.button.is-warning:hover:enabled,
        .button.is-warning:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-warning-surface));
            color: var(--dbp-hover-color, var(--dbp-on-warning-surface));
            border-color: var(
                --dbp-hover-background-color,
                var(--dbp-warning-surface-border-color)
            );
        }

        .button.button.is-danger,
        .button.is-danger {
            background-color: var(--dbp-danger-surface);
            border-color: var(--dbp-danger-surface-border-color);
            color: var(--dbp-on-danger-surface);
        }

        .button.button.is-danger:hover:enabled,
        .button.is-danger:hover:enabled {
            background-color: var(--dbp-hover-background-color, var(--dbp-danger-surface));
            color: var(--dbp-hover-color, var(--dbp-on-danger-surface));
            border-color: var(--dbp-hover-background-color, var(--dbp-danger-surface-border-color));
        }

        button.button[disabled],
        .button[disabled],
        fieldset[disabled] .button {
            opacity: 0.4;
            cursor: not-allowed;
        }

        button:focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none;
            -moz-box-shadow: none;
            -webkit-box-shadow: none;
            box-shadow: 0px 0px 3px 1px var(--dbp-primary);
        }
    `;
}
function rt() {
    return T`
        .select2-dropdown {
            border-radius: var(--dbp-border-radius);
        }

        .select2-container--default .select2-selection--single {
            border-radius: var(--dbp-border-radius);
        }

        .select2-container--default .select2-selection--single .select2-selection__rendered {
            color: inherit;
        }

        .select2-container--default .select2-selection--single .select2-selection__clear {
            font-size: 1.5em;
            font-weight: 300;
        }

        .select2-container--default .select2-selection--single .select2-selection__placeholder {
            color: var(--dbp-muted);
        }

        .select2-container--default .select2-selection--multiple .select2-selection__rendered {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-selection--multiple {
            background-color: var(--dbp-background);
        }
        .select2-container--default .select2-selection--multiple .select2-selection__choice {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-results__option[aria-selected='true'] {
            background-color: var(--dbp-muted);
        }

        /* Work around single selections not wrapping and breaking responsivness */
        .select2-container--default .select2-selection--single {
            height: 100% !important;
        }
        .select2-container--default .select2-selection__rendered {
            word-wrap: break-word !important;
            text-overflow: inherit !important;
            white-space: normal !important;
        }

        .select2-dropdown {
            background-color: var(--dbp-background);
        }

        .select2-container--default .select2-selection--single,
        .select2-dropdown,
        .select2-container--default .select2-search--dropdown .select2-search__field {
            background: var(--dbp-background);
            color: var(--dbp-content);
            border: var(--dbp-border);
            border-color: var(--dbp-muted);
        }
    `;
}
const K = new (class {
    get debug() {
        return window.location.hash.includes(`debug`) ? console.debug : () => {};
    }
})();
var it = class extends Le {
    constructor() {
        (super(),
            (this._connected = !1),
            (this._deferSubscribe = !1),
            (this._deferUnSubscribe = !1),
            (this.reflectAttribute = !0),
            (this.subscribe = ``),
            (this.unsubscribe = ``),
            (this._callbackStore = []),
            (this._propertyStore = {}),
            (this._lastProperties = {}),
            K.debug(`AdapterLitElement(` + this.tagName + `) constructor()`));
    }
    getProperty(e) {
        return this._propertyStore[e];
    }
    getPropertyByAttributeName(e) {
        return this[this.findPropertyName(e)];
    }
    setPropertyByAttributeName(e, t) {
        this[this.findPropertyName(e)] = t;
    }
    setProperty(e, t) {
        (typeof t == `object` && t
            ? this.setPropertyByAttributeName(e, t)
            : this.attributeChangedCallback(e, this.getPropertyByAttributeName(e), t),
            (this._lastProperties[e] = t),
            (this._propertyStore[e] = t));
    }
    hasPropertyChanged(e, t) {
        return this._lastProperties[e] !== t;
    }
    hasProperty(e) {
        return Object.hasOwnProperty.call(this._propertyStore, e);
    }
    connectedCallback() {
        (super.connectedCallback(),
            this._deferUnSubscribe &&
                (this.unsubscribe.split(`,`).forEach((e) => this.unSubscribeProviderFor(e)),
                (this._deferSubscribe = !1),
                (this.unsubscribe = ``)),
            (this._deferSubscribe &&=
                (this.subscribe.split(`,`).forEach((e) => this.subscribeProviderFor(e)), !1)),
            (this._connected = !0));
        let e = this;
        if (
            (this.addEventListener(
                `dbp-subscribe`,
                function (t) {
                    let n = t.detail.name;
                    (e.hasProperty(n) || e.providerRoot) &&
                        (K.debug(
                            `AdapterLitElementProvider(` +
                                e.tagName +
                                `) eventListener("dbp-subscribe",..) name "` +
                                n +
                                `" found.`,
                        ),
                        e._callbackStore.push({
                            name: n,
                            callback: t.detail.callback,
                            sender: t.detail.sender,
                        }),
                        t.detail.callback(e.getProperty(n)),
                        t.stopPropagation());
                },
                !1,
            ),
            this.addEventListener(
                `dbp-unsubscribe`,
                function (t) {
                    let n = t.detail.name,
                        r = t.detail.sender;
                    (e.hasProperty(n) || e.providerRoot) &&
                        (K.debug(
                            `AdapterLitElementProvider(` +
                                e.tagName +
                                `) eventListener("dbp-unsubscribe",..) name "` +
                                n +
                                `" found.`,
                        ),
                        e._callbackStore.forEach((t) => {
                            if (t.sender === r && t.name === n) {
                                let r = e._callbackStore.indexOf(t);
                                (e._callbackStore.splice(r, 1),
                                    K.debug(
                                        `AdapterLitElementProvider(` +
                                            e.tagName +
                                            `) eventListener for name "` +
                                            n +
                                            `" removed.`,
                                    ));
                            }
                        }),
                        t.stopPropagation());
                },
                !1,
            ),
            this.addEventListener(
                `dbp-set-property`,
                function (t) {
                    let n = t.detail.name,
                        r = t.detail.value;
                    (e.hasProperty(n) || e.providerRoot) &&
                        (K.debug(
                            `AdapterLitElementProvider(` +
                                e.tagName +
                                `) eventListener("dbp-set-property",..) name "` +
                                n +
                                `" found.`,
                        ),
                        e.setProperty(n, r),
                        e._callbackStore.forEach((e) => {
                            e.name === n && e.callback(r);
                        }),
                        t.stopPropagation());
                },
                !1,
            ),
            new MutationObserver(function (t, n) {
                for (let n of t)
                    if (n.type === `attributes`) {
                        let t = n.attributeName,
                            r = e.getAttribute(t);
                        e.hasPropertyChanged(t, r) &&
                            (K.debug(
                                `AdapterLitElementProvider (` +
                                    e.tagName +
                                    `) observed attribute "` +
                                    t +
                                    `" changed`,
                            ),
                            e.setProperty(t, r),
                            e._callbackStore.forEach((e) => {
                                e.name === t && e.callback(r);
                            }));
                    }
            }).observe(this, {attributes: !0, childList: !1, subtree: !1}),
            this.hasAttributes())
        ) {
            let t = this.attributes;
            for (let n = t.length - 1; n >= 0; n--)
                [`id`, `class`, `style`, `data-tag-name`].includes(t[n].name) ||
                    (this.setProperty(t[n].name, t[n].value),
                    K.debug(
                        `AdapterLitElementProvider (` +
                            e.tagName +
                            `) found attribute "` +
                            t[n].name +
                            `" = "` +
                            t[n].value +
                            `"`,
                    ));
        }
    }
    disconnectedCallback() {
        (this.subscribe.split(`,`).forEach((e) => this.unSubscribeProviderFor(e)),
            super.disconnectedCallback());
    }
    subscribeProviderFor(e) {
        K.debug(`AdapterLitElement(` + this.tagName + `) subscribeProviderFor( ` + e + ` )`);
        let t = e.trim().split(`:`),
            n = t[0],
            r = t[1] || n,
            i = this,
            a = new CustomEvent(`dbp-subscribe`, {
                bubbles: !0,
                composed: !0,
                detail: {
                    name: r,
                    callback: (e) => {
                        e !== void 0 &&
                            (K.debug(
                                `AdapterLitElement(` +
                                    i.tagName +
                                    `) sub/Callback ` +
                                    r +
                                    ` -> ` +
                                    n +
                                    ` = ` +
                                    e,
                            ),
                            typeof e == `object` && e
                                ? i.setPropertyByAttributeName(n, e)
                                : (i.attributeChangedCallback(
                                      n,
                                      i.getPropertyByAttributeName(n),
                                      e,
                                  ),
                                  i.getAttribute(n) !== null &&
                                      (console.warn(
                                          `Provider callback: "` +
                                              n +
                                              `" is also an attribute in tag "` +
                                              i.tagName +
                                              `", this is not supported!`,
                                      ),
                                      i.reflectAttribute && i.setAttribute(n, e))));
                    },
                    sender: this,
                },
            });
        this.dispatchEvent(a);
    }
    unSubscribeProviderFor(e) {
        K.debug(`AdapterLitElement(` + this.tagName + `) unSubscribeProviderFor( ` + e + ` )`);
        let t = e.trim().split(`:`),
            n = t[1] || t[0],
            r = new CustomEvent(`dbp-unsubscribe`, {
                bubbles: !0,
                composed: !0,
                detail: {name: n, sender: this},
            });
        this.dispatchEvent(r);
    }
    static get properties() {
        return {
            ...super.properties,
            subscribe: {type: String},
            unsubscribe: {type: String},
            providerRoot: {type: Boolean, attribute: `provider-root`},
        };
    }
    findPropertyName(e) {
        let t = e,
            n = this.constructor.properties;
        for (let r in n)
            if (n[r].attribute === e) {
                t = r;
                break;
            }
        return t;
    }
    attributeChangedCallback(e, t, n) {
        switch (e) {
            case `subscribe`:
                (K.debug(
                    `AdapterLitElement() attributeChangesCallback( ` +
                        e +
                        `, ` +
                        t +
                        `, ` +
                        n +
                        `)`,
                ),
                    this.subscribe &&
                        this.subscribe.length > 0 &&
                        (this._connected
                            ? this.subscribe
                                  .split(`,`)
                                  .forEach((e) => this.unSubscribeProviderFor(e))
                            : ((this._deferUnSubscribe = this.subscribe.length > 0),
                              (this.unsubscribe = this.subscribe))),
                    n !== null &&
                        ((this.subscribe = n),
                        this._connected
                            ? n.split(`,`).forEach((e) => this.subscribeProviderFor(e))
                            : (this._deferSubscribe = n && n.length > 0)));
                break;
            default:
                if ((typeof t == `object` && !t && !n) || (!n && t && e)) break;
                super.attributeChangedCallback(e, t, n);
        }
    }
    sendSetPropertyEvent(e, t, n = !1) {
        let r = new CustomEvent(`dbp-set-property`, {
            bubbles: !0,
            composed: !0,
            detail: {name: e, value: t},
        });
        return (this.parentElement && !n ? this.parentElement : this).dispatchEvent(r);
    }
};
function at(e) {
    let t = new URL(e, `https://example.com`);
    return {
        pathname: t.pathname,
        pathSegments: t.pathname
            .split(`/`)
            .filter((e) => e !== ``)
            .map((e) => decodeURIComponent(e)),
        queryParams: t.searchParams,
        queryString: t.search,
        hash: t.hash,
        fragment: t.hash.replace(/^#/, ``),
    };
}
var ot = class extends it {
    constructor() {
        (super(),
            (this.htmlOverrides = ``),
            (this._localTemplateSlotsImported = !1),
            (this._globalSlotsContainer = null),
            (this._globalTemplateSlotsImported = !1),
            (this._renderDone = !1),
            (this.routingUrl = ``));
    }
    static get properties() {
        return {
            ...super.properties,
            htmlOverrides: {type: String, attribute: `html-overrides`},
            routingUrl: {type: String, attribute: `routing-url`},
        };
    }
    disconnectedCallback() {
        (super.disconnectedCallback(),
            this._globalSlotsContainer !== null && this._globalSlotsContainer.remove());
    }
    _(e) {
        return this.renderRoot.querySelector(e);
    }
    _a(e) {
        return this.renderRoot.querySelectorAll(e);
    }
    firstUpdated(e) {
        (super.firstUpdated(e), (this._renderDone = !0), this._importTemplateSlots());
    }
    update(e) {
        (e.forEach((e, t) => {
            switch (t) {
                case `html-overrides`:
                    this._importTemplateSlots();
                    break;
            }
        }),
            super.update(e));
    }
    _importTemplateSlots() {
        this._renderDone && (this._importLocalTemplateSlots(), this._importGlobalTemplateSlots());
    }
    _importLocalTemplateSlots() {
        if (this._localTemplateSlotsImported) return;
        let e = this.querySelectorAll(`:scope > template[slot]:not([slot=""]`);
        for (let t of e) {
            let e = document.createElement(`div`);
            ((e.slot = t.getAttribute(`slot`)),
                e.appendChild(t.content.cloneNode(!0)),
                t.remove(),
                this.appendChild(e));
        }
        this._localTemplateSlotsImported = !0;
    }
    _importGlobalTemplateSlots() {
        if (this.htmlOverrides === `` || this._globalTemplateSlotsImported) return;
        let e = document.querySelector(`template#` + this.htmlOverrides);
        if (e !== null) {
            let t = e.content.cloneNode(!0).querySelector(`template#` + this.tagName.toLowerCase());
            if (t !== null) {
                let n = t.content.cloneNode(!0),
                    r = [];
                for (let e of n.querySelectorAll(`[slot]:not([slot=""]`))
                    e.parentNode === n && r.push(e);
                for (let e of r)
                    for (let t of this.querySelectorAll(`[slot="` + e.slot + `"]`)) t.remove();
                let i = document.createElement(`div`);
                (e.append(i), (this._globalSlotsContainer = i));
                for (let e of r) i.appendChild(e);
                for (; i.childNodes.length; ) this.appendChild(i.removeChild(i.childNodes[0]));
            }
        }
        this._globalTemplateSlotsImported = !0;
    }
    getRoutingData() {
        return at(this.routingUrl);
    }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = {ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6},
    ct =
        (e) =>
        (...t) => ({_$litDirective$: e, values: t});
var lt = class {
        constructor(e) {}
        get _$AU() {
            return this._$AM._$AU;
        }
        _$AT(e, t, n) {
            ((this._$Ct = e), (this._$AM = t), (this._$Ci = n));
        }
        _$AS(e, t) {
            return this.update(e, t);
        }
        update(e, t) {
            return this.render(...t);
        }
    },
    ut = class extends lt {
        constructor(e) {
            if ((super(e), (this.it = V), e.type !== st.CHILD))
                throw Error(
                    this.constructor.directiveName + `() can only be used in child bindings`,
                );
        }
        render(e) {
            if (e === V || e == null) return ((this._t = void 0), (this.it = e));
            if (e === B) return e;
            if (typeof e != `string`)
                throw Error(this.constructor.directiveName + `() called with a non-string value`);
            if (e === this.it) return this._t;
            this.it = e;
            let t = [e];
            return (
                (t.raw = t),
                (this._t = {_$litType$: this.constructor.resultType, strings: t, values: []})
            );
        }
    };
((ut.directiveName = `unsafeHTML`), (ut.resultType = 1));
const dt = ct(ut),
    q = (e) => typeof e == `string`,
    ft = () => {
        let e,
            t,
            n = new Promise((n, r) => {
                ((e = n), (t = r));
            });
        return ((n.resolve = e), (n.reject = t), n);
    },
    pt = (e) => (e == null ? `` : `` + e),
    mt = (e, t, n) => {
        e.forEach((e) => {
            t[e] && (n[e] = t[e]);
        });
    },
    ht = /###/g,
    J = (e) => (e && e.indexOf(`###`) > -1 ? e.replace(ht, `.`) : e),
    gt = (e) => !e || q(e),
    _t = (e, t, n) => {
        let r = q(t) ? t.split(`.`) : t,
            i = 0;
        for (; i < r.length - 1; ) {
            if (gt(e)) return {};
            let t = J(r[i]);
            (!e[t] && n && (e[t] = new n()),
                (e = Object.prototype.hasOwnProperty.call(e, t) ? e[t] : {}),
                ++i);
        }
        return gt(e) ? {} : {obj: e, k: J(r[i])};
    },
    vt = (e, t, n) => {
        let {obj: r, k: i} = _t(e, t, Object);
        if (r !== void 0 || t.length === 1) {
            r[i] = n;
            return;
        }
        let a = t[t.length - 1],
            o = t.slice(0, t.length - 1),
            s = _t(e, o, Object);
        for (; s.obj === void 0 && o.length; )
            ((a = `${o[o.length - 1]}.${a}`),
                (o = o.slice(0, o.length - 1)),
                (s = _t(e, o, Object)),
                s?.obj && s.obj[`${s.k}.${a}`] !== void 0 && (s.obj = void 0));
        s.obj[`${s.k}.${a}`] = n;
    },
    yt = (e, t, n, r) => {
        let {obj: i, k: a} = _t(e, t, Object);
        ((i[a] = i[a] || []), i[a].push(n));
    },
    bt = (e, t) => {
        let {obj: n, k: r} = _t(e, t);
        if (n && Object.prototype.hasOwnProperty.call(n, r)) return n[r];
    },
    xt = (e, t, n) => {
        let r = bt(e, n);
        return r === void 0 ? bt(t, n) : r;
    },
    St = (e, t, n) => {
        for (let r in t)
            r !== `__proto__` &&
                r !== `constructor` &&
                (r in e
                    ? q(e[r]) || e[r] instanceof String || q(t[r]) || t[r] instanceof String
                        ? n && (e[r] = t[r])
                        : St(e[r], t[r], n)
                    : (e[r] = t[r]));
        return e;
    },
    Ct = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, `\\$&`);
var wt = {'&': `&amp;`, '<': `&lt;`, '>': `&gt;`, '"': `&quot;`, "'": `&#39;`, '/': `&#x2F;`};
const Tt = (e) => (q(e) ? e.replace(/[&<>"'\/]/g, (e) => wt[e]) : e);
var Y = class {
    constructor(e) {
        ((this.capacity = e), (this.regExpMap = new Map()), (this.regExpQueue = []));
    }
    getRegExp(e) {
        let t = this.regExpMap.get(e);
        if (t !== void 0) return t;
        let n = new RegExp(e);
        return (
            this.regExpQueue.length === this.capacity &&
                this.regExpMap.delete(this.regExpQueue.shift()),
            this.regExpMap.set(e, n),
            this.regExpQueue.push(e),
            n
        );
    }
};
const Et = [` `, `,`, `?`, `!`, `;`],
    Dt = new Y(20),
    Ot = (e, t, n) => {
        ((t ||= ``), (n ||= ``));
        let r = Et.filter((e) => t.indexOf(e) < 0 && n.indexOf(e) < 0);
        if (r.length === 0) return !0;
        let i = Dt.getRegExp(`(${r.map((e) => (e === `?` ? `\\?` : e)).join(`|`)})`),
            a = !i.test(e);
        if (!a) {
            let t = e.indexOf(n);
            t > 0 && !i.test(e.substring(0, t)) && (a = !0);
        }
        return a;
    },
    kt = (e, t, n = `.`) => {
        if (!e) return;
        if (e[t]) return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
        let r = t.split(n),
            i = e;
        for (let e = 0; e < r.length; ) {
            if (!i || typeof i != `object`) return;
            let t,
                a = ``;
            for (let o = e; o < r.length; ++o)
                if ((o !== e && (a += n), (a += r[o]), (t = i[a]), t !== void 0)) {
                    if ([`string`, `number`, `boolean`].indexOf(typeof t) > -1 && o < r.length - 1)
                        continue;
                    e += o - e + 1;
                    break;
                }
            i = t;
        }
        return i;
    },
    At = (e) => e?.replace(/_/g, `-`),
    jt = {
        type: `logger`,
        log(e) {
            this.output(`log`, e);
        },
        warn(e) {
            this.output(`warn`, e);
        },
        error(e) {
            this.output(`error`, e);
        },
        output(e, t) {
            console?.[e]?.apply?.(console, t);
        },
    };
var X = new (class e {
        constructor(e, t = {}) {
            this.init(e, t);
        }
        init(e, t = {}) {
            ((this.prefix = t.prefix || `i18next:`),
                (this.logger = e || jt),
                (this.options = t),
                (this.debug = t.debug));
        }
        log(...e) {
            return this.forward(e, `log`, ``, !0);
        }
        warn(...e) {
            return this.forward(e, `warn`, ``, !0);
        }
        error(...e) {
            return this.forward(e, `error`, ``);
        }
        deprecate(...e) {
            return this.forward(e, `warn`, `WARNING DEPRECATED: `, !0);
        }
        forward(e, t, n, r) {
            return r && !this.debug
                ? null
                : (q(e[0]) && (e[0] = `${n}${this.prefix} ${e[0]}`), this.logger[t](e));
        }
        create(t) {
            return new e(this.logger, {prefix: `${this.prefix}:${t}:`, ...this.options});
        }
        clone(t) {
            return (
                (t ||= this.options),
                (t.prefix = t.prefix || this.prefix),
                new e(this.logger, t)
            );
        }
    })(),
    Mt = class {
        constructor() {
            this.observers = {};
        }
        on(e, t) {
            return (
                e.split(` `).forEach((e) => {
                    this.observers[e] || (this.observers[e] = new Map());
                    let n = this.observers[e].get(t) || 0;
                    this.observers[e].set(t, n + 1);
                }),
                this
            );
        }
        off(e, t) {
            if (this.observers[e]) {
                if (!t) {
                    delete this.observers[e];
                    return;
                }
                this.observers[e].delete(t);
            }
        }
        emit(e, ...t) {
            (this.observers[e] &&
                Array.from(this.observers[e].entries()).forEach(([e, n]) => {
                    for (let r = 0; r < n; r++) e(...t);
                }),
                this.observers[`*`] &&
                    Array.from(this.observers[`*`].entries()).forEach(([n, r]) => {
                        for (let i = 0; i < r; i++) n.apply(n, [e, ...t]);
                    }));
        }
    },
    Nt = class extends Mt {
        constructor(e, t = {ns: [`translation`], defaultNS: `translation`}) {
            (super(),
                (this.data = e || {}),
                (this.options = t),
                this.options.keySeparator === void 0 && (this.options.keySeparator = `.`),
                this.options.ignoreJSONStructure === void 0 &&
                    (this.options.ignoreJSONStructure = !0));
        }
        addNamespaces(e) {
            this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
        }
        removeNamespaces(e) {
            let t = this.options.ns.indexOf(e);
            t > -1 && this.options.ns.splice(t, 1);
        }
        getResource(e, t, n, r = {}) {
            let i = r.keySeparator === void 0 ? this.options.keySeparator : r.keySeparator,
                a =
                    r.ignoreJSONStructure === void 0
                        ? this.options.ignoreJSONStructure
                        : r.ignoreJSONStructure,
                o;
            e.indexOf(`.`) > -1
                ? (o = e.split(`.`))
                : ((o = [e, t]),
                  n &&
                      (Array.isArray(n)
                          ? o.push(...n)
                          : q(n) && i
                            ? o.push(...n.split(i))
                            : o.push(n)));
            let s = bt(this.data, o);
            return (
                !s &&
                    !t &&
                    !n &&
                    e.indexOf(`.`) > -1 &&
                    ((e = o[0]), (t = o[1]), (n = o.slice(2).join(`.`))),
                s || !a || !q(n) ? s : kt(this.data?.[e]?.[t], n, i)
            );
        }
        addResource(e, t, n, r, i = {silent: !1}) {
            let a = i.keySeparator === void 0 ? this.options.keySeparator : i.keySeparator,
                o = [e, t];
            (n && (o = o.concat(a ? n.split(a) : n)),
                e.indexOf(`.`) > -1 && ((o = e.split(`.`)), (r = t), (t = o[1])),
                this.addNamespaces(t),
                vt(this.data, o, r),
                i.silent || this.emit(`added`, e, t, n, r));
        }
        addResources(e, t, n, r = {silent: !1}) {
            for (let r in n)
                (q(n[r]) || Array.isArray(n[r])) && this.addResource(e, t, r, n[r], {silent: !0});
            r.silent || this.emit(`added`, e, t, n);
        }
        addResourceBundle(e, t, n, r, i, a = {silent: !1, skipCopy: !1}) {
            let o = [e, t];
            (e.indexOf(`.`) > -1 && ((o = e.split(`.`)), (r = n), (n = t), (t = o[1])),
                this.addNamespaces(t));
            let s = bt(this.data, o) || {};
            (a.skipCopy || (n = JSON.parse(JSON.stringify(n))),
                r ? St(s, n, i) : (s = {...s, ...n}),
                vt(this.data, o, s),
                a.silent || this.emit(`added`, e, t, n));
        }
        removeResourceBundle(e, t) {
            (this.hasResourceBundle(e, t) && delete this.data[e][t],
                this.removeNamespaces(t),
                this.emit(`removed`, e, t));
        }
        hasResourceBundle(e, t) {
            return this.getResource(e, t) !== void 0;
        }
        getResourceBundle(e, t) {
            return ((t ||= this.options.defaultNS), this.getResource(e, t));
        }
        getDataByLanguage(e) {
            return this.data[e];
        }
        hasLanguageSomeTranslations(e) {
            let t = this.getDataByLanguage(e);
            return !!((t && Object.keys(t)) || []).find(
                (e) => t[e] && Object.keys(t[e]).length > 0,
            );
        }
        toJSON() {
            return this.data;
        }
    },
    Pt = {
        processors: {},
        addPostProcessor(e) {
            this.processors[e.name] = e;
        },
        handle(e, t, n, r, i) {
            return (
                e.forEach((e) => {
                    t = this.processors[e]?.process(t, n, r, i) ?? t;
                }),
                t
            );
        },
    };
const Ft = Symbol(`i18next/PATH_KEY`);
function It() {
    let e = [],
        t = Object.create(null),
        n;
    return (
        (t.get = (r, i) => (
            n?.revoke?.(),
            i === Ft ? e : (e.push(i), (n = Proxy.revocable(r, t)), n.proxy)
        )),
        Proxy.revocable(Object.create(null), t).proxy
    );
}
function Lt(e, t) {
    let {[Ft]: n} = e(It()),
        r = t?.keySeparator ?? `.`,
        i = t?.nsSeparator ?? `:`;
    if (n.length > 1 && i) {
        let e = t?.ns;
        if ((e ? (Array.isArray(e) ? e : [e]) : []).includes(n[0]))
            return `${n[0]}${i}${n.slice(1).join(r)}`;
    }
    return n.join(r);
}
const Rt = {},
    zt = (e) => !q(e) && typeof e != `boolean` && typeof e != `number`;
var Bt = class e extends Mt {
        constructor(e, t = {}) {
            (super(),
                mt(
                    [
                        `resourceStore`,
                        `languageUtils`,
                        `pluralResolver`,
                        `interpolator`,
                        `backendConnector`,
                        `i18nFormat`,
                        `utils`,
                    ],
                    e,
                    this,
                ),
                (this.options = t),
                this.options.keySeparator === void 0 && (this.options.keySeparator = `.`),
                (this.logger = X.create(`translator`)));
        }
        changeLanguage(e) {
            e && (this.language = e);
        }
        exists(e, t = {interpolation: {}}) {
            let n = {...t};
            if (e == null) return !1;
            let r = this.resolve(e, n);
            if (r?.res === void 0) return !1;
            let i = zt(r.res);
            return !(n.returnObjects === !1 && i);
        }
        extractFromKey(e, t) {
            let n = t.nsSeparator === void 0 ? this.options.nsSeparator : t.nsSeparator;
            n === void 0 && (n = `:`);
            let r = t.keySeparator === void 0 ? this.options.keySeparator : t.keySeparator,
                i = t.ns || this.options.defaultNS || [],
                a = n && e.indexOf(n) > -1,
                o =
                    !this.options.userDefinedKeySeparator &&
                    !t.keySeparator &&
                    !this.options.userDefinedNsSeparator &&
                    !t.nsSeparator &&
                    !Ot(e, n, r);
            if (a && !o) {
                let t = e.match(this.interpolator.nestingRegexp);
                if (t && t.length > 0) return {key: e, namespaces: q(i) ? [i] : i};
                let a = e.split(n);
                ((n !== r || (n === r && this.options.ns.indexOf(a[0]) > -1)) && (i = a.shift()),
                    (e = a.join(r)));
            }
            return {key: e, namespaces: q(i) ? [i] : i};
        }
        translate(t, n, r) {
            let i = typeof n == `object` ? {...n} : n;
            if (
                (typeof i != `object` &&
                    this.options.overloadTranslationOptionHandler &&
                    (i = this.options.overloadTranslationOptionHandler(arguments)),
                typeof i == `object` && (i = {...i}),
                (i ||= {}),
                t == null)
            )
                return ``;
            (typeof t == `function` && (t = Lt(t, {...this.options, ...i})),
                Array.isArray(t) || (t = [String(t)]),
                (t = t.map((e) =>
                    typeof e == `function` ? Lt(e, {...this.options, ...i}) : String(e),
                )));
            let a = i.returnDetails === void 0 ? this.options.returnDetails : i.returnDetails,
                o = i.keySeparator === void 0 ? this.options.keySeparator : i.keySeparator,
                {key: s, namespaces: c} = this.extractFromKey(t[t.length - 1], i),
                l = c[c.length - 1],
                u = i.nsSeparator === void 0 ? this.options.nsSeparator : i.nsSeparator;
            u === void 0 && (u = `:`);
            let d = i.lng || this.language,
                f = i.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
            if (d?.toLowerCase() === `cimode`)
                return f
                    ? a
                        ? {
                              res: `${l}${u}${s}`,
                              usedKey: s,
                              exactUsedKey: s,
                              usedLng: d,
                              usedNS: l,
                              usedParams: this.getUsedParamsDetails(i),
                          }
                        : `${l}${u}${s}`
                    : a
                      ? {
                            res: s,
                            usedKey: s,
                            exactUsedKey: s,
                            usedLng: d,
                            usedNS: l,
                            usedParams: this.getUsedParamsDetails(i),
                        }
                      : s;
            let p = this.resolve(t, i),
                m = p?.res,
                h = p?.usedKey || s,
                g = p?.exactUsedKey || s,
                _ = [`[object Number]`, `[object Function]`, `[object RegExp]`],
                v = i.joinArrays === void 0 ? this.options.joinArrays : i.joinArrays,
                y = !this.i18nFormat || this.i18nFormat.handleAsObject,
                b = i.count !== void 0 && !q(i.count),
                x = e.hasDefaultValue(i),
                S = b ? this.pluralResolver.getSuffix(d, i.count, i) : ``,
                C = i.ordinal && b ? this.pluralResolver.getSuffix(d, i.count, {ordinal: !1}) : ``,
                w = b && !i.ordinal && i.count === 0,
                T =
                    (w && i[`defaultValue${this.options.pluralSeparator}zero`]) ||
                    i[`defaultValue${S}`] ||
                    i[`defaultValue${C}`] ||
                    i.defaultValue,
                E = m;
            y && !m && x && (E = T);
            let ee = zt(E),
                D = Object.prototype.toString.apply(E);
            if (y && E && ee && _.indexOf(D) < 0 && !(q(v) && Array.isArray(E))) {
                if (!i.returnObjects && !this.options.returnObjects) {
                    this.options.returnedObjectHandler ||
                        this.logger.warn(
                            `accessing an object - but returnObjects options is not enabled!`,
                        );
                    let e = this.options.returnedObjectHandler
                        ? this.options.returnedObjectHandler(h, E, {...i, ns: c})
                        : `key '${s} (${this.language})' returned an object instead of string.`;
                    return a ? ((p.res = e), (p.usedParams = this.getUsedParamsDetails(i)), p) : e;
                }
                if (o) {
                    let e = Array.isArray(E),
                        t = e ? [] : {},
                        n = e ? g : h;
                    for (let e in E)
                        if (Object.prototype.hasOwnProperty.call(E, e)) {
                            let r = `${n}${o}${e}`;
                            (x && !m
                                ? (t[e] = this.translate(r, {
                                      ...i,
                                      defaultValue: zt(T) ? T[e] : void 0,
                                      joinArrays: !1,
                                      ns: c,
                                  }))
                                : (t[e] = this.translate(r, {...i, joinArrays: !1, ns: c})),
                                t[e] === r && (t[e] = E[e]));
                        }
                    m = t;
                }
            } else if (y && q(v) && Array.isArray(m))
                ((m = m.join(v)), (m &&= this.extendTranslation(m, t, i, r)));
            else {
                let e = !1,
                    n = !1;
                (!this.isValidLookup(m) && x && ((e = !0), (m = T)),
                    this.isValidLookup(m) || ((n = !0), (m = s)));
                let a =
                        (i.missingKeyNoValueFallbackToKey ||
                            this.options.missingKeyNoValueFallbackToKey) &&
                        n
                            ? void 0
                            : m,
                    c = x && T !== m && this.options.updateMissing;
                if (n || e || c) {
                    if ((this.logger.log(c ? `updateKey` : `missingKey`, d, l, s, c ? T : m), o)) {
                        let e = this.resolve(s, {...i, keySeparator: !1});
                        e &&
                            e.res &&
                            this.logger.warn(
                                `Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.`,
                            );
                    }
                    let e = [],
                        t = this.languageUtils.getFallbackCodes(
                            this.options.fallbackLng,
                            i.lng || this.language,
                        );
                    if (this.options.saveMissingTo === `fallback` && t && t[0])
                        for (let n = 0; n < t.length; n++) e.push(t[n]);
                    else
                        this.options.saveMissingTo === `all`
                            ? (e = this.languageUtils.toResolveHierarchy(i.lng || this.language))
                            : e.push(i.lng || this.language);
                    let n = (e, t, n) => {
                        let r = x && n !== m ? n : a;
                        (this.options.missingKeyHandler
                            ? this.options.missingKeyHandler(e, l, t, r, c, i)
                            : this.backendConnector?.saveMissing &&
                              this.backendConnector.saveMissing(e, l, t, r, c, i),
                            this.emit(`missingKey`, e, l, t, m));
                    };
                    this.options.saveMissing &&
                        (this.options.saveMissingPlurals && b
                            ? e.forEach((e) => {
                                  let t = this.pluralResolver.getSuffixes(e, i);
                                  (w &&
                                      i[`defaultValue${this.options.pluralSeparator}zero`] &&
                                      t.indexOf(`${this.options.pluralSeparator}zero`) < 0 &&
                                      t.push(`${this.options.pluralSeparator}zero`),
                                      t.forEach((t) => {
                                          n([e], s + t, i[`defaultValue${t}`] || T);
                                      }));
                              })
                            : n(e, s, T));
                }
                ((m = this.extendTranslation(m, t, i, p, r)),
                    n &&
                        m === s &&
                        this.options.appendNamespaceToMissingKey &&
                        (m = `${l}${u}${s}`),
                    (n || e) &&
                        this.options.parseMissingKeyHandler &&
                        (m = this.options.parseMissingKeyHandler(
                            this.options.appendNamespaceToMissingKey ? `${l}${u}${s}` : s,
                            e ? m : void 0,
                            i,
                        )));
            }
            return a ? ((p.res = m), (p.usedParams = this.getUsedParamsDetails(i)), p) : m;
        }
        extendTranslation(e, t, n, r, i) {
            if (this.i18nFormat?.parse)
                e = this.i18nFormat.parse(
                    e,
                    {...this.options.interpolation.defaultVariables, ...n},
                    n.lng || this.language || r.usedLng,
                    r.usedNS,
                    r.usedKey,
                    {resolved: r},
                );
            else if (!n.skipInterpolation) {
                n.interpolation &&
                    this.interpolator.init({
                        ...n,
                        interpolation: {...this.options.interpolation, ...n.interpolation},
                    });
                let a =
                        q(e) &&
                        (n?.interpolation?.skipOnVariables === void 0
                            ? this.options.interpolation.skipOnVariables
                            : n.interpolation.skipOnVariables),
                    o;
                if (a) {
                    let t = e.match(this.interpolator.nestingRegexp);
                    o = t && t.length;
                }
                let s = n.replace && !q(n.replace) ? n.replace : n;
                if (
                    (this.options.interpolation.defaultVariables &&
                        (s = {...this.options.interpolation.defaultVariables, ...s}),
                    (e = this.interpolator.interpolate(
                        e,
                        s,
                        n.lng || this.language || r.usedLng,
                        n,
                    )),
                    a)
                ) {
                    let t = e.match(this.interpolator.nestingRegexp),
                        r = t && t.length;
                    o < r && (n.nest = !1);
                }
                (!n.lng && r && r.res && (n.lng = this.language || r.usedLng),
                    n.nest !== !1 &&
                        (e = this.interpolator.nest(
                            e,
                            (...e) =>
                                i?.[0] === e[0] && !n.context
                                    ? (this.logger.warn(
                                          `It seems you are nesting recursively key: ${e[0]} in key: ${t[0]}`,
                                      ),
                                      null)
                                    : this.translate(...e, t),
                            n,
                        )),
                    n.interpolation && this.interpolator.reset());
            }
            let a = n.postProcess || this.options.postProcess,
                o = q(a) ? [a] : a;
            return (
                e != null &&
                    o?.length &&
                    n.applyPostProcessor !== !1 &&
                    (e = Pt.handle(
                        o,
                        e,
                        t,
                        this.options && this.options.postProcessPassResolved
                            ? {i18nResolved: {...r, usedParams: this.getUsedParamsDetails(n)}, ...n}
                            : n,
                        this,
                    )),
                e
            );
        }
        resolve(e, t = {}) {
            let n, r, i, a, o;
            return (
                q(e) && (e = [e]),
                Array.isArray(e) &&
                    (e = e.map((e) =>
                        typeof e == `function` ? Lt(e, {...this.options, ...t}) : e,
                    )),
                e.forEach((e) => {
                    if (this.isValidLookup(n)) return;
                    let s = this.extractFromKey(e, t),
                        c = s.key;
                    r = c;
                    let l = s.namespaces;
                    this.options.fallbackNS && (l = l.concat(this.options.fallbackNS));
                    let u = t.count !== void 0 && !q(t.count),
                        d = u && !t.ordinal && t.count === 0,
                        f =
                            t.context !== void 0 &&
                            (q(t.context) || typeof t.context == `number`) &&
                            t.context !== ``,
                        p = t.lngs
                            ? t.lngs
                            : this.languageUtils.toResolveHierarchy(
                                  t.lng || this.language,
                                  t.fallbackLng,
                              );
                    l.forEach((e) => {
                        this.isValidLookup(n) ||
                            ((o = e),
                            !Rt[`${p[0]}-${e}`] &&
                                this.utils?.hasLoadedNamespace &&
                                !this.utils?.hasLoadedNamespace(o) &&
                                ((Rt[`${p[0]}-${e}`] = !0),
                                this.logger.warn(
                                    `key "${r}" for languages "${p.join(`, `)}" won't get resolved as namespace "${o}" was not yet loaded`,
                                    `This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!`,
                                )),
                            p.forEach((r) => {
                                if (this.isValidLookup(n)) return;
                                a = r;
                                let o = [c];
                                if (this.i18nFormat?.addLookupKeys)
                                    this.i18nFormat.addLookupKeys(o, c, r, e, t);
                                else {
                                    let e;
                                    u && (e = this.pluralResolver.getSuffix(r, t.count, t));
                                    let n = `${this.options.pluralSeparator}zero`,
                                        i = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                                    if (
                                        (u &&
                                            (t.ordinal &&
                                                e.indexOf(i) === 0 &&
                                                o.push(
                                                    c + e.replace(i, this.options.pluralSeparator),
                                                ),
                                            o.push(c + e),
                                            d && o.push(c + n)),
                                        f)
                                    ) {
                                        let r = `${c}${this.options.contextSeparator || `_`}${t.context}`;
                                        (o.push(r),
                                            u &&
                                                (t.ordinal &&
                                                    e.indexOf(i) === 0 &&
                                                    o.push(
                                                        r +
                                                            e.replace(
                                                                i,
                                                                this.options.pluralSeparator,
                                                            ),
                                                    ),
                                                o.push(r + e),
                                                d && o.push(r + n)));
                                    }
                                }
                                let s;
                                for (; (s = o.pop()); )
                                    this.isValidLookup(n) ||
                                        ((i = s), (n = this.getResource(r, e, s, t)));
                            }));
                    });
                }),
                {res: n, usedKey: r, exactUsedKey: i, usedLng: a, usedNS: o}
            );
        }
        isValidLookup(e) {
            return (
                e !== void 0 &&
                !(!this.options.returnNull && e === null) &&
                !(!this.options.returnEmptyString && e === ``)
            );
        }
        getResource(e, t, n, r = {}) {
            return this.i18nFormat?.getResource
                ? this.i18nFormat.getResource(e, t, n, r)
                : this.resourceStore.getResource(e, t, n, r);
        }
        getUsedParamsDetails(e = {}) {
            let t = [
                    `defaultValue`,
                    `ordinal`,
                    `context`,
                    `replace`,
                    `lng`,
                    `lngs`,
                    `fallbackLng`,
                    `ns`,
                    `keySeparator`,
                    `nsSeparator`,
                    `returnObjects`,
                    `returnDetails`,
                    `joinArrays`,
                    `postProcess`,
                    `interpolation`,
                ],
                n = e.replace && !q(e.replace),
                r = n ? e.replace : e;
            if (
                (n && e.count !== void 0 && (r.count = e.count),
                this.options.interpolation.defaultVariables &&
                    (r = {...this.options.interpolation.defaultVariables, ...r}),
                !n)
            ) {
                r = {...r};
                for (let e of t) delete r[e];
            }
            return r;
        }
        static hasDefaultValue(e) {
            for (let t in e)
                if (
                    Object.prototype.hasOwnProperty.call(e, t) &&
                    t.substring(0, 12) === `defaultValue` &&
                    e[t] !== void 0
                )
                    return !0;
            return !1;
        }
    },
    Vt = class {
        constructor(e) {
            ((this.options = e),
                (this.supportedLngs = this.options.supportedLngs || !1),
                (this.logger = X.create(`languageUtils`)));
        }
        getScriptPartFromCode(e) {
            if (((e = At(e)), !e || e.indexOf(`-`) < 0)) return null;
            let t = e.split(`-`);
            return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === `x`)
                ? null
                : this.formatLanguageCode(t.join(`-`));
        }
        getLanguagePartFromCode(e) {
            if (((e = At(e)), !e || e.indexOf(`-`) < 0)) return e;
            let t = e.split(`-`);
            return this.formatLanguageCode(t[0]);
        }
        formatLanguageCode(e) {
            if (q(e) && e.indexOf(`-`) > -1) {
                let t;
                try {
                    t = Intl.getCanonicalLocales(e)[0];
                } catch {}
                return (
                    t && this.options.lowerCaseLng && (t = t.toLowerCase()),
                    t || (this.options.lowerCaseLng ? e.toLowerCase() : e)
                );
            }
            return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
        }
        isSupportedCode(e) {
            return (
                (this.options.load === `languageOnly` || this.options.nonExplicitSupportedLngs) &&
                    (e = this.getLanguagePartFromCode(e)),
                !this.supportedLngs ||
                    !this.supportedLngs.length ||
                    this.supportedLngs.indexOf(e) > -1
            );
        }
        getBestMatchFromCodes(e) {
            if (!e) return null;
            let t;
            return (
                e.forEach((e) => {
                    if (t) return;
                    let n = this.formatLanguageCode(e);
                    (!this.options.supportedLngs || this.isSupportedCode(n)) && (t = n);
                }),
                !t &&
                    this.options.supportedLngs &&
                    e.forEach((e) => {
                        if (t) return;
                        let n = this.getScriptPartFromCode(e);
                        if (this.isSupportedCode(n)) return (t = n);
                        let r = this.getLanguagePartFromCode(e);
                        if (this.isSupportedCode(r)) return (t = r);
                        t = this.options.supportedLngs.find((e) => {
                            if (
                                e === r ||
                                (!(e.indexOf(`-`) < 0 && r.indexOf(`-`) < 0) &&
                                    ((e.indexOf(`-`) > 0 &&
                                        r.indexOf(`-`) < 0 &&
                                        e.substring(0, e.indexOf(`-`)) === r) ||
                                        (e.indexOf(r) === 0 && r.length > 1)))
                            )
                                return e;
                        });
                    }),
                (t ||= this.getFallbackCodes(this.options.fallbackLng)[0]),
                t
            );
        }
        getFallbackCodes(e, t) {
            if (!e) return [];
            if ((typeof e == `function` && (e = e(t)), q(e) && (e = [e]), Array.isArray(e)))
                return e;
            if (!t) return e.default || [];
            let n = e[t];
            return (
                (n ||= e[this.getScriptPartFromCode(t)]),
                (n ||= e[this.formatLanguageCode(t)]),
                (n ||= e[this.getLanguagePartFromCode(t)]),
                (n ||= e.default),
                n || []
            );
        }
        toResolveHierarchy(e, t) {
            let n = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e),
                r = [],
                i = (e) => {
                    e &&
                        (this.isSupportedCode(e)
                            ? r.push(e)
                            : this.logger.warn(
                                  `rejecting language code not found in supportedLngs: ${e}`,
                              ));
                };
            return (
                q(e) && (e.indexOf(`-`) > -1 || e.indexOf(`_`) > -1)
                    ? (this.options.load !== `languageOnly` && i(this.formatLanguageCode(e)),
                      this.options.load !== `languageOnly` &&
                          this.options.load !== `currentOnly` &&
                          i(this.getScriptPartFromCode(e)),
                      this.options.load !== `currentOnly` && i(this.getLanguagePartFromCode(e)))
                    : q(e) && i(this.formatLanguageCode(e)),
                n.forEach((e) => {
                    r.indexOf(e) < 0 && i(this.formatLanguageCode(e));
                }),
                r
            );
        }
    };
const Ht = {zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5},
    Ut = {
        select: (e) => (e === 1 ? `one` : `other`),
        resolvedOptions: () => ({pluralCategories: [`one`, `other`]}),
    };
var Wt = class {
    constructor(e, t = {}) {
        ((this.languageUtils = e),
            (this.options = t),
            (this.logger = X.create(`pluralResolver`)),
            (this.pluralRulesCache = {}));
    }
    clearCache() {
        this.pluralRulesCache = {};
    }
    getRule(e, t = {}) {
        let n = At(e === `dev` ? `en` : e),
            r = t.ordinal ? `ordinal` : `cardinal`,
            i = JSON.stringify({cleanedCode: n, type: r});
        if (i in this.pluralRulesCache) return this.pluralRulesCache[i];
        let a;
        try {
            a = new Intl.PluralRules(n, {type: r});
        } catch {
            if (typeof Intl > `u`)
                return (this.logger.error(`No Intl support, please use an Intl polyfill!`), Ut);
            if (!e.match(/-|_/)) return Ut;
            let n = this.languageUtils.getLanguagePartFromCode(e);
            a = this.getRule(n, t);
        }
        return ((this.pluralRulesCache[i] = a), a);
    }
    needsPlural(e, t = {}) {
        let n = this.getRule(e, t);
        return ((n ||= this.getRule(`dev`, t)), n?.resolvedOptions().pluralCategories.length > 1);
    }
    getPluralFormsOfKey(e, t, n = {}) {
        return this.getSuffixes(e, n).map((e) => `${t}${e}`);
    }
    getSuffixes(e, t = {}) {
        let n = this.getRule(e, t);
        return (
            (n ||= this.getRule(`dev`, t)),
            n
                ? n
                      .resolvedOptions()
                      .pluralCategories.sort((e, t) => Ht[e] - Ht[t])
                      .map(
                          (e) =>
                              `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ``}${e}`,
                      )
                : []
        );
    }
    getSuffix(e, t, n = {}) {
        let r = this.getRule(e, n);
        return r
            ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ``}${r.select(t)}`
            : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix(`dev`, t, n));
    }
};
const Gt = (e, t, n, r = `.`, i = !0) => {
        let a = xt(e, t, n);
        return (!a && i && q(n) && ((a = kt(e, n, r)), a === void 0 && (a = kt(t, n, r))), a);
    },
    Kt = (e) => e.replace(/\$/g, `$$$$`);
var qt = class {
    constructor(e = {}) {
        ((this.logger = X.create(`interpolator`)),
            (this.options = e),
            (this.format = e?.interpolation?.format || ((e) => e)),
            this.init(e));
    }
    init(e = {}) {
        e.interpolation ||= {escapeValue: !0};
        let {
            escape: t,
            escapeValue: n,
            useRawValueToEscape: r,
            prefix: i,
            prefixEscaped: a,
            suffix: o,
            suffixEscaped: s,
            formatSeparator: c,
            unescapeSuffix: l,
            unescapePrefix: u,
            nestingPrefix: d,
            nestingPrefixEscaped: f,
            nestingSuffix: p,
            nestingSuffixEscaped: m,
            nestingOptionsSeparator: h,
            maxReplaces: g,
            alwaysFormat: _,
        } = e.interpolation;
        ((this.escape = t === void 0 ? Tt : t),
            (this.escapeValue = n === void 0 ? !0 : n),
            (this.useRawValueToEscape = r === void 0 ? !1 : r),
            (this.prefix = i ? Ct(i) : a || `{{`),
            (this.suffix = o ? Ct(o) : s || `}}`),
            (this.formatSeparator = c || `,`),
            (this.unescapePrefix = l ? `` : u || `-`),
            (this.unescapeSuffix = this.unescapePrefix ? `` : l || ``),
            (this.nestingPrefix = d ? Ct(d) : f || Ct(`$t(`)),
            (this.nestingSuffix = p ? Ct(p) : m || Ct(`)`)),
            (this.nestingOptionsSeparator = h || `,`),
            (this.maxReplaces = g || 1e3),
            (this.alwaysFormat = _ === void 0 ? !1 : _),
            this.resetRegExp());
    }
    reset() {
        this.options && this.init(this.options);
    }
    resetRegExp() {
        let e = (e, t) => (e?.source === t ? ((e.lastIndex = 0), e) : new RegExp(t, `g`));
        ((this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`)),
            (this.regexpUnescape = e(
                this.regexpUnescape,
                `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`,
            )),
            (this.nestingRegexp = e(
                this.nestingRegexp,
                `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`,
            )));
    }
    interpolate(e, t, n, r) {
        let i,
            a,
            o,
            s =
                (this.options &&
                    this.options.interpolation &&
                    this.options.interpolation.defaultVariables) ||
                {},
            c = (e) => {
                if (e.indexOf(this.formatSeparator) < 0) {
                    let i = Gt(
                        t,
                        s,
                        e,
                        this.options.keySeparator,
                        this.options.ignoreJSONStructure,
                    );
                    return this.alwaysFormat
                        ? this.format(i, void 0, n, {...r, ...t, interpolationkey: e})
                        : i;
                }
                let i = e.split(this.formatSeparator),
                    a = i.shift().trim(),
                    o = i.join(this.formatSeparator).trim();
                return this.format(
                    Gt(t, s, a, this.options.keySeparator, this.options.ignoreJSONStructure),
                    o,
                    n,
                    {...r, ...t, interpolationkey: a},
                );
            };
        this.resetRegExp();
        let l = r?.missingInterpolationHandler || this.options.missingInterpolationHandler,
            u =
                r?.interpolation?.skipOnVariables === void 0
                    ? this.options.interpolation.skipOnVariables
                    : r.interpolation.skipOnVariables;
        return (
            [
                {regex: this.regexpUnescape, safeValue: (e) => Kt(e)},
                {
                    regex: this.regexp,
                    safeValue: (e) => (this.escapeValue ? Kt(this.escape(e)) : Kt(e)),
                },
            ].forEach((t) => {
                for (o = 0; (i = t.regex.exec(e)); ) {
                    let n = i[1].trim();
                    if (((a = c(n)), a === void 0))
                        if (typeof l == `function`) {
                            let t = l(e, i, r);
                            a = q(t) ? t : ``;
                        } else if (r && Object.prototype.hasOwnProperty.call(r, n)) a = ``;
                        else if (u) {
                            a = i[0];
                            continue;
                        } else
                            (this.logger.warn(
                                `missed to pass in variable ${n} for interpolating ${e}`,
                            ),
                                (a = ``));
                    else !q(a) && !this.useRawValueToEscape && (a = pt(a));
                    let s = t.safeValue(a);
                    if (
                        ((e = e.replace(i[0], s)),
                        u
                            ? ((t.regex.lastIndex += a.length), (t.regex.lastIndex -= i[0].length))
                            : (t.regex.lastIndex = 0),
                        o++,
                        o >= this.maxReplaces)
                    )
                        break;
                }
            }),
            e
        );
    }
    nest(e, t, n = {}) {
        let r,
            i,
            a,
            o = (e, t) => {
                let n = this.nestingOptionsSeparator;
                if (e.indexOf(n) < 0) return e;
                let r = e.split(RegExp(`${Ct(n)}[ ]*{`)),
                    i = `{${r[1]}`;
                ((e = r[0]), (i = this.interpolate(i, a)));
                let o = i.match(/'/g),
                    s = i.match(/"/g);
                (((o?.length ?? 0) % 2 == 0 && !s) || (s?.length ?? 0) % 2 != 0) &&
                    (i = i.replace(/'/g, `"`));
                try {
                    ((a = JSON.parse(i)), t && (a = {...t, ...a}));
                } catch (t) {
                    return (
                        this.logger.warn(
                            `failed parsing options string in nesting for key ${e}`,
                            t,
                        ),
                        `${e}${n}${i}`
                    );
                }
                return (
                    a.defaultValue &&
                        a.defaultValue.indexOf(this.prefix) > -1 &&
                        delete a.defaultValue,
                    e
                );
            };
        for (; (r = this.nestingRegexp.exec(e)); ) {
            let s = [];
            ((a = {...n}),
                (a = a.replace && !q(a.replace) ? a.replace : a),
                (a.applyPostProcessor = !1),
                delete a.defaultValue);
            let c = /{.*}/.test(r[1])
                ? r[1].lastIndexOf(`}`) + 1
                : r[1].indexOf(this.formatSeparator);
            if (
                (c !== -1 &&
                    ((s = r[1]
                        .slice(c)
                        .split(this.formatSeparator)
                        .map((e) => e.trim())
                        .filter(Boolean)),
                    (r[1] = r[1].slice(0, c))),
                (i = t(o.call(this, r[1].trim(), a), a)),
                i && r[0] === e && !q(i))
            )
                return i;
            (q(i) || (i = pt(i)),
                (i ||= (this.logger.warn(`missed to resolve ${r[1]} for nesting ${e}`), ``)),
                s.length &&
                    (i = s.reduce(
                        (e, t) => this.format(e, t, n.lng, {...n, interpolationkey: r[1].trim()}),
                        i.trim(),
                    )),
                (e = e.replace(r[0], i)),
                (this.regexp.lastIndex = 0));
        }
        return e;
    }
};
const Jt = (e) => {
        let t = e.toLowerCase().trim(),
            n = {};
        if (e.indexOf(`(`) > -1) {
            let r = e.split(`(`);
            t = r[0].toLowerCase().trim();
            let i = r[1].substring(0, r[1].length - 1);
            t === `currency` && i.indexOf(`:`) < 0
                ? (n.currency ||= i.trim())
                : t === `relativetime` && i.indexOf(`:`) < 0
                  ? (n.range ||= i.trim())
                  : i.split(`;`).forEach((e) => {
                        if (e) {
                            let [t, ...r] = e.split(`:`),
                                i = r
                                    .join(`:`)
                                    .trim()
                                    .replace(/^'+|'+$/g, ``),
                                a = t.trim();
                            (n[a] || (n[a] = i),
                                i === `false` && (n[a] = !1),
                                i === `true` && (n[a] = !0),
                                isNaN(i) || (n[a] = parseInt(i, 10)));
                        }
                    });
        }
        return {formatName: t, formatOptions: n};
    },
    Yt = (e) => {
        let t = {};
        return (n, r, i) => {
            let a = i;
            i &&
                i.interpolationkey &&
                i.formatParams &&
                i.formatParams[i.interpolationkey] &&
                i[i.interpolationkey] &&
                (a = {...a, [i.interpolationkey]: void 0});
            let o = r + JSON.stringify(a),
                s = t[o];
            return (s || ((s = e(At(r), i)), (t[o] = s)), s(n));
        };
    },
    Xt = (e) => (t, n, r) => e(At(n), r)(t);
var Zt = class {
    constructor(e = {}) {
        ((this.logger = X.create(`formatter`)), (this.options = e), this.init(e));
    }
    init(e, t = {interpolation: {}}) {
        this.formatSeparator = t.interpolation.formatSeparator || `,`;
        let n = t.cacheInBuiltFormats ? Yt : Xt;
        this.formats = {
            number: n((e, t) => {
                let n = new Intl.NumberFormat(e, {...t});
                return (e) => n.format(e);
            }),
            currency: n((e, t) => {
                let n = new Intl.NumberFormat(e, {...t, style: `currency`});
                return (e) => n.format(e);
            }),
            datetime: n((e, t) => {
                let n = new Intl.DateTimeFormat(e, {...t});
                return (e) => n.format(e);
            }),
            relativetime: n((e, t) => {
                let n = new Intl.RelativeTimeFormat(e, {...t});
                return (e) => n.format(e, t.range || `day`);
            }),
            list: n((e, t) => {
                let n = new Intl.ListFormat(e, {...t});
                return (e) => n.format(e);
            }),
        };
    }
    add(e, t) {
        this.formats[e.toLowerCase().trim()] = t;
    }
    addCached(e, t) {
        this.formats[e.toLowerCase().trim()] = Yt(t);
    }
    format(e, t, n, r = {}) {
        let i = t.split(this.formatSeparator);
        if (
            i.length > 1 &&
            i[0].indexOf(`(`) > 1 &&
            i[0].indexOf(`)`) < 0 &&
            i.find((e) => e.indexOf(`)`) > -1)
        ) {
            let e = i.findIndex((e) => e.indexOf(`)`) > -1);
            i[0] = [i[0], ...i.splice(1, e)].join(this.formatSeparator);
        }
        return i.reduce((e, t) => {
            let {formatName: i, formatOptions: a} = Jt(t);
            if (this.formats[i]) {
                let t = e;
                try {
                    let o = r?.formatParams?.[r.interpolationkey] || {},
                        s = o.locale || o.lng || r.locale || r.lng || n;
                    t = this.formats[i](e, s, {...a, ...r, ...o});
                } catch (e) {
                    this.logger.warn(e);
                }
                return t;
            } else this.logger.warn(`there was no format function for ${i}`);
            return e;
        }, e);
    }
};
const Qt = (e, t) => {
    e.pending[t] !== void 0 && (delete e.pending[t], e.pendingCount--);
};
var $t = class extends Mt {
    constructor(e, t, n, r = {}) {
        (super(),
            (this.backend = e),
            (this.store = t),
            (this.services = n),
            (this.languageUtils = n.languageUtils),
            (this.options = r),
            (this.logger = X.create(`backendConnector`)),
            (this.waitingReads = []),
            (this.maxParallelReads = r.maxParallelReads || 10),
            (this.readingCalls = 0),
            (this.maxRetries = r.maxRetries >= 0 ? r.maxRetries : 5),
            (this.retryTimeout = r.retryTimeout >= 1 ? r.retryTimeout : 350),
            (this.state = {}),
            (this.queue = []),
            this.backend?.init?.(n, r.backend, r));
    }
    queueLoad(e, t, n, r) {
        let i = {},
            a = {},
            o = {},
            s = {};
        return (
            e.forEach((e) => {
                let r = !0;
                (t.forEach((t) => {
                    let o = `${e}|${t}`;
                    !n.reload && this.store.hasResourceBundle(e, t)
                        ? (this.state[o] = 2)
                        : this.state[o] < 0 ||
                          (this.state[o] === 1
                              ? a[o] === void 0 && (a[o] = !0)
                              : ((this.state[o] = 1),
                                (r = !1),
                                a[o] === void 0 && (a[o] = !0),
                                i[o] === void 0 && (i[o] = !0),
                                s[t] === void 0 && (s[t] = !0)));
                }),
                    r || (o[e] = !0));
            }),
            (Object.keys(i).length || Object.keys(a).length) &&
                this.queue.push({
                    pending: a,
                    pendingCount: Object.keys(a).length,
                    loaded: {},
                    errors: [],
                    callback: r,
                }),
            {
                toLoad: Object.keys(i),
                pending: Object.keys(a),
                toLoadLanguages: Object.keys(o),
                toLoadNamespaces: Object.keys(s),
            }
        );
    }
    loaded(e, t, n) {
        let r = e.split(`|`),
            i = r[0],
            a = r[1];
        (t && this.emit(`failedLoading`, i, a, t),
            !t && n && this.store.addResourceBundle(i, a, n, void 0, void 0, {skipCopy: !0}),
            (this.state[e] = t ? -1 : 2),
            t && n && (this.state[e] = 0));
        let o = {};
        (this.queue.forEach((n) => {
            (yt(n.loaded, [i], a),
                Qt(n, e),
                t && n.errors.push(t),
                n.pendingCount === 0 &&
                    !n.done &&
                    (Object.keys(n.loaded).forEach((e) => {
                        o[e] || (o[e] = {});
                        let t = n.loaded[e];
                        t.length &&
                            t.forEach((t) => {
                                o[e][t] === void 0 && (o[e][t] = !0);
                            });
                    }),
                    (n.done = !0),
                    n.errors.length ? n.callback(n.errors) : n.callback()));
        }),
            this.emit(`loaded`, o),
            (this.queue = this.queue.filter((e) => !e.done)));
    }
    read(e, t, n, r = 0, i = this.retryTimeout, a) {
        if (!e.length) return a(null, {});
        if (this.readingCalls >= this.maxParallelReads) {
            this.waitingReads.push({lng: e, ns: t, fcName: n, tried: r, wait: i, callback: a});
            return;
        }
        this.readingCalls++;
        let o = (o, s) => {
                if ((this.readingCalls--, this.waitingReads.length > 0)) {
                    let e = this.waitingReads.shift();
                    this.read(e.lng, e.ns, e.fcName, e.tried, e.wait, e.callback);
                }
                if (o && s && r < this.maxRetries) {
                    setTimeout(() => {
                        this.read.call(this, e, t, n, r + 1, i * 2, a);
                    }, i);
                    return;
                }
                a(o, s);
            },
            s = this.backend[n].bind(this.backend);
        if (s.length === 2) {
            try {
                let n = s(e, t);
                n && typeof n.then == `function` ? n.then((e) => o(null, e)).catch(o) : o(null, n);
            } catch (e) {
                o(e);
            }
            return;
        }
        return s(e, t, o);
    }
    prepareLoading(e, t, n = {}, r) {
        if (!this.backend)
            return (
                this.logger.warn(`No backend was added via i18next.use. Will not load resources.`),
                r && r()
            );
        (q(e) && (e = this.languageUtils.toResolveHierarchy(e)), q(t) && (t = [t]));
        let i = this.queueLoad(e, t, n, r);
        if (!i.toLoad.length) return (i.pending.length || r(), null);
        i.toLoad.forEach((e) => {
            this.loadOne(e);
        });
    }
    load(e, t, n) {
        this.prepareLoading(e, t, {}, n);
    }
    reload(e, t, n) {
        this.prepareLoading(e, t, {reload: !0}, n);
    }
    loadOne(e, t = ``) {
        let n = e.split(`|`),
            r = n[0],
            i = n[1];
        this.read(r, i, `read`, void 0, void 0, (n, a) => {
            (n && this.logger.warn(`${t}loading namespace ${i} for language ${r} failed`, n),
                !n && a && this.logger.log(`${t}loaded namespace ${i} for language ${r}`, a),
                this.loaded(e, n, a));
        });
    }
    saveMissing(e, t, n, r, i, a = {}, o = () => {}) {
        if (
            this.services?.utils?.hasLoadedNamespace &&
            !this.services?.utils?.hasLoadedNamespace(t)
        ) {
            this.logger.warn(
                `did not save key "${n}" as the namespace "${t}" was not yet loaded`,
                `This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!`,
            );
            return;
        }
        if (!(n == null || n === ``)) {
            if (this.backend?.create) {
                let s = {...a, isUpdate: i},
                    c = this.backend.create.bind(this.backend);
                if (c.length < 6)
                    try {
                        let i;
                        ((i = c.length === 5 ? c(e, t, n, r, s) : c(e, t, n, r)),
                            i && typeof i.then == `function`
                                ? i.then((e) => o(null, e)).catch(o)
                                : o(null, i));
                    } catch (e) {
                        o(e);
                    }
                else c(e, t, n, r, o, s);
            }
            !e || !e[0] || this.store.addResource(e[0], t, n, r);
        }
    }
};
const en = () => ({
        debug: !1,
        initAsync: !0,
        ns: [`translation`],
        defaultNS: [`translation`],
        fallbackLng: [`dev`],
        fallbackNS: !1,
        supportedLngs: !1,
        nonExplicitSupportedLngs: !1,
        load: `all`,
        preload: !1,
        simplifyPluralSuffix: !0,
        keySeparator: `.`,
        nsSeparator: `:`,
        pluralSeparator: `_`,
        contextSeparator: `_`,
        partialBundledLanguages: !1,
        saveMissing: !1,
        updateMissing: !1,
        saveMissingTo: `fallback`,
        saveMissingPlurals: !0,
        missingKeyHandler: !1,
        missingInterpolationHandler: !1,
        postProcess: !1,
        postProcessPassResolved: !1,
        returnNull: !1,
        returnEmptyString: !0,
        returnObjects: !1,
        joinArrays: !1,
        returnedObjectHandler: !1,
        parseMissingKeyHandler: !1,
        appendNamespaceToMissingKey: !1,
        appendNamespaceToCIMode: !1,
        overloadTranslationOptionHandler: (e) => {
            let t = {};
            if (
                (typeof e[1] == `object` && (t = e[1]),
                q(e[1]) && (t.defaultValue = e[1]),
                q(e[2]) && (t.tDescription = e[2]),
                typeof e[2] == `object` || typeof e[3] == `object`)
            ) {
                let n = e[3] || e[2];
                Object.keys(n).forEach((e) => {
                    t[e] = n[e];
                });
            }
            return t;
        },
        interpolation: {
            escapeValue: !0,
            format: (e) => e,
            prefix: `{{`,
            suffix: `}}`,
            formatSeparator: `,`,
            unescapePrefix: `-`,
            nestingPrefix: `$t(`,
            nestingSuffix: `)`,
            nestingOptionsSeparator: `,`,
            maxReplaces: 1e3,
            skipOnVariables: !0,
        },
        cacheInBuiltFormats: !0,
    }),
    tn = (e) => (
        q(e.ns) && (e.ns = [e.ns]),
        q(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]),
        q(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]),
        e.supportedLngs?.indexOf?.(`cimode`) < 0 &&
            (e.supportedLngs = e.supportedLngs.concat([`cimode`])),
        typeof e.initImmediate == `boolean` && (e.initAsync = e.initImmediate),
        e
    ),
    nn = () => {},
    rn = (e) => {
        Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((t) => {
            typeof e[t] == `function` && (e[t] = e[t].bind(e));
        });
    },
    an = `__i18next_supportNoticeShown`,
    on = () => typeof globalThis < `u` && !!globalThis[an],
    sn = () => {
        typeof globalThis < `u` && (globalThis[an] = !0);
    },
    cn = (e) =>
        !!(
            e?.modules?.backend?.name?.indexOf(`Locize`) > 0 ||
            e?.modules?.backend?.constructor?.name?.indexOf(`Locize`) > 0 ||
            (e?.options?.backend?.backends &&
                e.options.backend.backends.some(
                    (e) =>
                        e?.name?.indexOf(`Locize`) > 0 ||
                        e?.constructor?.name?.indexOf(`Locize`) > 0,
                )) ||
            e?.options?.backend?.projectId ||
            (e?.options?.backend?.backendOptions &&
                e.options.backend.backendOptions.some((e) => e?.projectId))
        ),
    Z = class e extends Mt {
        constructor(e = {}, t) {
            if (
                (super(),
                (this.options = tn(e)),
                (this.services = {}),
                (this.logger = X),
                (this.modules = {external: []}),
                rn(this),
                t && !this.isInitialized && !e.isClone)
            ) {
                if (!this.options.initAsync) return (this.init(e, t), this);
                setTimeout(() => {
                    this.init(e, t);
                }, 0);
            }
        }
        init(e = {}, t) {
            ((this.isInitializing = !0),
                typeof e == `function` && ((t = e), (e = {})),
                e.defaultNS == null &&
                    e.ns &&
                    (q(e.ns)
                        ? (e.defaultNS = e.ns)
                        : e.ns.indexOf(`translation`) < 0 && (e.defaultNS = e.ns[0])));
            let n = en();
            ((this.options = {...n, ...this.options, ...tn(e)}),
                (this.options.interpolation = {...n.interpolation, ...this.options.interpolation}),
                e.keySeparator !== void 0 &&
                    (this.options.userDefinedKeySeparator = e.keySeparator),
                e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator),
                typeof this.options.overloadTranslationOptionHandler != `function` &&
                    (this.options.overloadTranslationOptionHandler =
                        n.overloadTranslationOptionHandler),
                this.options.showSupportNotice !== !1 &&
                    !cn(this) &&
                    !on() &&
                    (typeof console < `u` &&
                        console.info !== void 0 &&
                        console.info(
                            `🌐 i18next is made possible by our own product, Locize — consider powering your project with managed localization (AI, CDN, integrations): https://locize.com 💙`,
                        ),
                    sn()));
            let r = (e) => (e ? (typeof e == `function` ? new e() : e) : null);
            if (!this.options.isClone) {
                this.modules.logger
                    ? X.init(r(this.modules.logger), this.options)
                    : X.init(null, this.options);
                let e;
                e = this.modules.formatter ? this.modules.formatter : Zt;
                let t = new Vt(this.options);
                this.store = new Nt(this.options.resources, this.options);
                let i = this.services;
                ((i.logger = X),
                    (i.resourceStore = this.store),
                    (i.languageUtils = t),
                    (i.pluralResolver = new Wt(t, {
                        prepend: this.options.pluralSeparator,
                        simplifyPluralSuffix: this.options.simplifyPluralSuffix,
                    })),
                    this.options.interpolation.format &&
                        this.options.interpolation.format !== n.interpolation.format &&
                        this.logger.deprecate(
                            `init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting`,
                        ),
                    e &&
                        (!this.options.interpolation.format ||
                            this.options.interpolation.format === n.interpolation.format) &&
                        ((i.formatter = r(e)),
                        i.formatter.init && i.formatter.init(i, this.options),
                        (this.options.interpolation.format = i.formatter.format.bind(i.formatter))),
                    (i.interpolator = new qt(this.options)),
                    (i.utils = {hasLoadedNamespace: this.hasLoadedNamespace.bind(this)}),
                    (i.backendConnector = new $t(
                        r(this.modules.backend),
                        i.resourceStore,
                        i,
                        this.options,
                    )),
                    i.backendConnector.on(`*`, (e, ...t) => {
                        this.emit(e, ...t);
                    }),
                    this.modules.languageDetector &&
                        ((i.languageDetector = r(this.modules.languageDetector)),
                        i.languageDetector.init &&
                            i.languageDetector.init(i, this.options.detection, this.options)),
                    this.modules.i18nFormat &&
                        ((i.i18nFormat = r(this.modules.i18nFormat)),
                        i.i18nFormat.init && i.i18nFormat.init(this)),
                    (this.translator = new Bt(this.services, this.options)),
                    this.translator.on(`*`, (e, ...t) => {
                        this.emit(e, ...t);
                    }),
                    this.modules.external.forEach((e) => {
                        e.init && e.init(this);
                    }));
            }
            if (
                ((this.format = this.options.interpolation.format),
                (t ||= nn),
                this.options.fallbackLng && !this.services.languageDetector && !this.options.lng)
            ) {
                let e = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
                e.length > 0 && e[0] !== `dev` && (this.options.lng = e[0]);
            }
            (!this.services.languageDetector &&
                !this.options.lng &&
                this.logger.warn(`init: no languageDetector is used and no lng is defined`),
                [
                    `getResource`,
                    `hasResourceBundle`,
                    `getResourceBundle`,
                    `getDataByLanguage`,
                ].forEach((e) => {
                    this[e] = (...t) => this.store[e](...t);
                }),
                [
                    `addResource`,
                    `addResources`,
                    `addResourceBundle`,
                    `removeResourceBundle`,
                ].forEach((e) => {
                    this[e] = (...t) => (this.store[e](...t), this);
                }));
            let i = ft(),
                a = () => {
                    let e = (e, n) => {
                        ((this.isInitializing = !1),
                            this.isInitialized &&
                                !this.initializedStoreOnce &&
                                this.logger.warn(
                                    `init: i18next is already initialized. You should call init just once!`,
                                ),
                            (this.isInitialized = !0),
                            this.options.isClone || this.logger.log(`initialized`, this.options),
                            this.emit(`initialized`, this.options),
                            i.resolve(n),
                            t(e, n));
                    };
                    if (this.languages && !this.isInitialized) return e(null, this.t.bind(this));
                    this.changeLanguage(this.options.lng, e);
                };
            return (this.options.resources || !this.options.initAsync ? a() : setTimeout(a, 0), i);
        }
        loadResources(e, t = nn) {
            let n = t,
                r = q(e) ? e : this.language;
            if (
                (typeof e == `function` && (n = e),
                !this.options.resources || this.options.partialBundledLanguages)
            ) {
                if (
                    r?.toLowerCase() === `cimode` &&
                    (!this.options.preload || this.options.preload.length === 0)
                )
                    return n();
                let e = [],
                    t = (t) => {
                        t &&
                            t !== `cimode` &&
                            this.services.languageUtils.toResolveHierarchy(t).forEach((t) => {
                                t !== `cimode` && e.indexOf(t) < 0 && e.push(t);
                            });
                    };
                (r
                    ? t(r)
                    : this.services.languageUtils
                          .getFallbackCodes(this.options.fallbackLng)
                          .forEach((e) => t(e)),
                    this.options.preload?.forEach?.((e) => t(e)),
                    this.services.backendConnector.load(e, this.options.ns, (e) => {
                        (!e &&
                            !this.resolvedLanguage &&
                            this.language &&
                            this.setResolvedLanguage(this.language),
                            n(e));
                    }));
            } else n(null);
        }
        reloadResources(e, t, n) {
            let r = ft();
            return (
                typeof e == `function` && ((n = e), (e = void 0)),
                typeof t == `function` && ((n = t), (t = void 0)),
                (e ||= this.languages),
                (t ||= this.options.ns),
                (n ||= nn),
                this.services.backendConnector.reload(e, t, (e) => {
                    (r.resolve(), n(e));
                }),
                r
            );
        }
        use(e) {
            if (!e)
                throw Error(
                    `You are passing an undefined module! Please check the object you are passing to i18next.use()`,
                );
            if (!e.type)
                throw Error(
                    `You are passing a wrong module! Please check the object you are passing to i18next.use()`,
                );
            return (
                e.type === `backend` && (this.modules.backend = e),
                (e.type === `logger` || (e.log && e.warn && e.error)) && (this.modules.logger = e),
                e.type === `languageDetector` && (this.modules.languageDetector = e),
                e.type === `i18nFormat` && (this.modules.i18nFormat = e),
                e.type === `postProcessor` && Pt.addPostProcessor(e),
                e.type === `formatter` && (this.modules.formatter = e),
                e.type === `3rdParty` && this.modules.external.push(e),
                this
            );
        }
        setResolvedLanguage(e) {
            if (!(!e || !this.languages) && !([`cimode`, `dev`].indexOf(e) > -1)) {
                for (let e = 0; e < this.languages.length; e++) {
                    let t = this.languages[e];
                    if (
                        !([`cimode`, `dev`].indexOf(t) > -1) &&
                        this.store.hasLanguageSomeTranslations(t)
                    ) {
                        this.resolvedLanguage = t;
                        break;
                    }
                }
                !this.resolvedLanguage &&
                    this.languages.indexOf(e) < 0 &&
                    this.store.hasLanguageSomeTranslations(e) &&
                    ((this.resolvedLanguage = e), this.languages.unshift(e));
            }
        }
        changeLanguage(e, t) {
            this.isLanguageChangingTo = e;
            let n = ft();
            this.emit(`languageChanging`, e);
            let r = (e) => {
                    ((this.language = e),
                        (this.languages = this.services.languageUtils.toResolveHierarchy(e)),
                        (this.resolvedLanguage = void 0),
                        this.setResolvedLanguage(e));
                },
                i = (i, a) => {
                    (a
                        ? this.isLanguageChangingTo === e &&
                          (r(a),
                          this.translator.changeLanguage(a),
                          (this.isLanguageChangingTo = void 0),
                          this.emit(`languageChanged`, a),
                          this.logger.log(`languageChanged`, a))
                        : (this.isLanguageChangingTo = void 0),
                        n.resolve((...e) => this.t(...e)),
                        t && t(i, (...e) => this.t(...e)));
                },
                a = (t) => {
                    !e && !t && this.services.languageDetector && (t = []);
                    let n = q(t) ? t : t && t[0],
                        a = this.store.hasLanguageSomeTranslations(n)
                            ? n
                            : this.services.languageUtils.getBestMatchFromCodes(q(t) ? [t] : t);
                    (a &&
                        (this.language || r(a),
                        this.translator.language || this.translator.changeLanguage(a),
                        this.services.languageDetector?.cacheUserLanguage?.(a)),
                        this.loadResources(a, (e) => {
                            i(e, a);
                        }));
                };
            return (
                !e && this.services.languageDetector && !this.services.languageDetector.async
                    ? a(this.services.languageDetector.detect())
                    : !e && this.services.languageDetector && this.services.languageDetector.async
                      ? this.services.languageDetector.detect.length === 0
                          ? this.services.languageDetector.detect().then(a)
                          : this.services.languageDetector.detect(a)
                      : a(e),
                n
            );
        }
        getFixedT(e, t, n) {
            let r = (e, t, ...i) => {
                let a;
                ((a =
                    typeof t == `object`
                        ? {...t}
                        : this.options.overloadTranslationOptionHandler([e, t].concat(i))),
                    (a.lng = a.lng || r.lng),
                    (a.lngs = a.lngs || r.lngs),
                    (a.ns = a.ns || r.ns),
                    a.keyPrefix !== `` && (a.keyPrefix = a.keyPrefix || n || r.keyPrefix));
                let o = this.options.keySeparator || `.`,
                    s;
                return (
                    a.keyPrefix && Array.isArray(e)
                        ? (s = e.map(
                              (e) => (
                                  typeof e == `function` && (e = Lt(e, {...this.options, ...t})),
                                  `${a.keyPrefix}${o}${e}`
                              ),
                          ))
                        : (typeof e == `function` && (e = Lt(e, {...this.options, ...t})),
                          (s = a.keyPrefix ? `${a.keyPrefix}${o}${e}` : e)),
                    this.t(s, a)
                );
            };
            return (q(e) ? (r.lng = e) : (r.lngs = e), (r.ns = t), (r.keyPrefix = n), r);
        }
        t(...e) {
            return this.translator?.translate(...e);
        }
        exists(...e) {
            return this.translator?.exists(...e);
        }
        setDefaultNamespace(e) {
            this.options.defaultNS = e;
        }
        hasLoadedNamespace(e, t = {}) {
            if (!this.isInitialized)
                return (
                    this.logger.warn(
                        `hasLoadedNamespace: i18next was not initialized`,
                        this.languages,
                    ),
                    !1
                );
            if (!this.languages || !this.languages.length)
                return (
                    this.logger.warn(
                        `hasLoadedNamespace: i18n.languages were undefined or empty`,
                        this.languages,
                    ),
                    !1
                );
            let n = t.lng || this.resolvedLanguage || this.languages[0],
                r = this.options ? this.options.fallbackLng : !1,
                i = this.languages[this.languages.length - 1];
            if (n.toLowerCase() === `cimode`) return !0;
            let a = (e, t) => {
                let n = this.services.backendConnector.state[`${e}|${t}`];
                return n === -1 || n === 0 || n === 2;
            };
            if (t.precheck) {
                let e = t.precheck(this, a);
                if (e !== void 0) return e;
            }
            return !!(
                this.hasResourceBundle(n, e) ||
                !this.services.backendConnector.backend ||
                (this.options.resources && !this.options.partialBundledLanguages) ||
                (a(n, e) && (!r || a(i, e)))
            );
        }
        loadNamespaces(e, t) {
            let n = ft();
            return this.options.ns
                ? (q(e) && (e = [e]),
                  e.forEach((e) => {
                      this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
                  }),
                  this.loadResources((e) => {
                      (n.resolve(), t && t(e));
                  }),
                  n)
                : (t && t(), Promise.resolve());
        }
        loadLanguages(e, t) {
            let n = ft();
            q(e) && (e = [e]);
            let r = this.options.preload || [],
                i = e.filter(
                    (e) => r.indexOf(e) < 0 && this.services.languageUtils.isSupportedCode(e),
                );
            return i.length
                ? ((this.options.preload = r.concat(i)),
                  this.loadResources((e) => {
                      (n.resolve(), t && t(e));
                  }),
                  n)
                : (t && t(), Promise.resolve());
        }
        dir(e) {
            if (
                ((e ||=
                    this.resolvedLanguage ||
                    (this.languages?.length > 0 ? this.languages[0] : this.language)),
                !e)
            )
                return `rtl`;
            try {
                let t = new Intl.Locale(e);
                if (t && t.getTextInfo) {
                    let e = t.getTextInfo();
                    if (e && e.direction) return e.direction;
                }
            } catch {}
            let t =
                    `ar.shu.sqr.ssh.xaa.yhd.yud.aao.abh.abv.acm.acq.acw.acx.acy.adf.ads.aeb.aec.afb.ajp.apc.apd.arb.arq.ars.ary.arz.auz.avl.ayh.ayl.ayn.ayp.bbz.pga.he.iw.ps.pbt.pbu.pst.prp.prd.ug.ur.ydd.yds.yih.ji.yi.hbo.men.xmn.fa.jpr.peo.pes.prs.dv.sam.ckb`.split(
                        `.`,
                    ),
                n = this.services?.languageUtils || new Vt(en());
            return e.toLowerCase().indexOf(`-latn`) > 1
                ? `ltr`
                : t.indexOf(n.getLanguagePartFromCode(e)) > -1 ||
                    e.toLowerCase().indexOf(`-arab`) > 1
                  ? `rtl`
                  : `ltr`;
        }
        static createInstance(t = {}, n) {
            let r = new e(t, n);
            return ((r.createInstance = e.createInstance), r);
        }
        cloneInstance(t = {}, n = nn) {
            let r = t.forkResourceStore;
            r && delete t.forkResourceStore;
            let i = {...this.options, ...t, isClone: !0},
                a = new e(i);
            if (
                ((t.debug !== void 0 || t.prefix !== void 0) && (a.logger = a.logger.clone(t)),
                [`store`, `services`, `language`].forEach((e) => {
                    a[e] = this[e];
                }),
                (a.services = {...this.services}),
                (a.services.utils = {hasLoadedNamespace: a.hasLoadedNamespace.bind(a)}),
                r &&
                    ((a.store = new Nt(
                        Object.keys(this.store.data).reduce(
                            (e, t) => (
                                (e[t] = {...this.store.data[t]}),
                                (e[t] = Object.keys(e[t]).reduce(
                                    (n, r) => ((n[r] = {...e[t][r]}), n),
                                    e[t],
                                )),
                                e
                            ),
                            {},
                        ),
                        i,
                    )),
                    (a.services.resourceStore = a.store)),
                t.interpolation)
            ) {
                let e = {...en().interpolation, ...this.options.interpolation, ...t.interpolation},
                    n = {...i, interpolation: e};
                a.services.interpolator = new qt(n);
            }
            return (
                (a.translator = new Bt(a.services, i)),
                a.translator.on(`*`, (e, ...t) => {
                    a.emit(e, ...t);
                }),
                a.init(i, n),
                (a.translator.options = i),
                (a.translator.backendConnector.services.utils = {
                    hasLoadedNamespace: a.hasLoadedNamespace.bind(a),
                }),
                a
            );
        }
        toJSON() {
            return {
                options: this.options,
                store: this.store,
                language: this.language,
                languages: this.languages,
                resolvedLanguage: this.resolvedLanguage,
            };
        }
    }.createInstance();
(Z.createInstance,
    Z.dir,
    Z.init,
    Z.loadResources,
    Z.reloadResources,
    Z.use,
    Z.changeLanguage,
    Z.getFixedT,
    Z.t,
    Z.exists,
    Z.setDefaultNamespace,
    Z.hasLoadedNamespace,
    Z.loadNamespaces,
    Z.loadLanguages);
function ln(e) {
    return `--` + e + `-override`;
}
function un(e, t, n, r) {
    r === void 0 && (r = `translation`);
    let i = ln(r);
    var a = {
        lng: t,
        fallbackLng: [n, t, ...Object.keys(e)],
        debug: !1,
        ns: [i, r],
        defaultNS: r,
        fallbackNS: r,
        initImmediate: !1,
        initAsync: !1,
        resources: {},
    };
    Object.keys(e).forEach(function (t) {
        a.resources[t] = {[r]: e[t]};
    });
    var o = Z.createInstance();
    return (o.init(a), console.assert(o.isInitialized), o);
}
var dn = {
        consumer: {item: `Bezeichnung`, price: `Preis`, sum: `Summe`},
        'dbp-modal': {close: `Schließen`},
        demo: {
            consumer: `Verbraucher`,
            consumer_description: `Verbraucher "{{id}}" abonniert nur {{subscriptions}}`,
            provider: `Anbieter`,
            provider_description: `Anbieter "{{id}}" {{description}}`,
        },
        error: {
            'connection-to-server-refused': `Verbindung zum Server verweigert!`,
            summary: `Ein Fehler ist aufgetreten`,
        },
    },
    fn = {
        consumer: {item: `Description`, price: `Price`, sum: `sum`},
        'dbp-modal': {close: `Close`},
        demo: {
            consumer: `Consumer`,
            consumer_description: `Consumer "{{id}}" will only subscribe to {{subscriptions}}`,
            provider: `Provider`,
            provider_description: `Provider "{{id}}" {{description}}`,
        },
        error: {
            'connection-to-server-refused': `Connection to server refused!`,
            summary: `An error occurred`,
        },
    };
function pn() {
    return un({en: fn, de: dn}, `de`, `en`);
}
var mn = window.CustomEvent;
(!mn || typeof mn == `object`) &&
    ((mn = function (e, t) {
        t ||= {};
        var n = document.createEvent(`CustomEvent`);
        return (n.initCustomEvent(e, !!t.bubbles, !!t.cancelable, t.detail || null), n);
    }),
    (mn.prototype = window.Event.prototype));
function hn(e, t) {
    var n = `on` + t.type.toLowerCase();
    return (typeof e[n] == `function` && e[n](t), e.dispatchEvent(t));
}
function gn(e) {
    for (; e && e !== document.body; ) {
        var t = window.getComputedStyle(e),
            n = function (e, n) {
                return !(t[e] === void 0 || t[e] === n);
            };
        if (
            t.opacity < 1 ||
            n(`zIndex`, `auto`) ||
            n(`transform`, `none`) ||
            n(`mixBlendMode`, `normal`) ||
            n(`filter`, `none`) ||
            n(`perspective`, `none`) ||
            t.isolation === `isolate` ||
            t.position === `fixed` ||
            t.webkitOverflowScrolling === `touch`
        )
            return !0;
        e = e.parentElement;
    }
    return !1;
}
function _n(e) {
    for (; e; ) {
        if (e.localName === `dialog`) return e;
        e = e.parentElement ? e.parentElement : e.parentNode ? e.parentNode.host : null;
    }
    return null;
}
function vn(e) {
    for (; e && e.shadowRoot && e.shadowRoot.activeElement; ) e = e.shadowRoot.activeElement;
    e && e.blur && e !== document.body && e.blur();
}
function yn(e, t) {
    for (var n = 0; n < e.length; ++n) if (e[n] === t) return !0;
    return !1;
}
function bn(e) {
    return !e || !e.hasAttribute(`method`)
        ? !1
        : e.getAttribute(`method`).toLowerCase() === `dialog`;
}
function xn(e) {
    var t = [`button`, `input`, `keygen`, `select`, `textarea`].map(function (e) {
        return e + `:not([disabled])`;
    });
    t.push(`[tabindex]:not([disabled]):not([tabindex=""])`);
    var n = e.querySelector(t.join(`, `));
    if (!n && `attachShadow` in Element.prototype)
        for (
            var r = e.querySelectorAll(`*`), i = 0;
            i < r.length && !(r[i].tagName && r[i].shadowRoot && ((n = xn(r[i].shadowRoot)), n));
            i++
        );
    return n;
}
function Sn(e) {
    return e.isConnected || document.body.contains(e);
}
function Cn(e) {
    if (e.submitter) return e.submitter;
    var t = e.target;
    if (!(t instanceof HTMLFormElement)) return null;
    var n = Q.formSubmitter;
    if (!n) {
        var r = e.target;
        n = ((`getRootNode` in r && r.getRootNode()) || document).activeElement;
    }
    return !n || n.form !== t ? null : n;
}
function wn(e) {
    if (!e.defaultPrevented) {
        var t = e.target,
            n = Q.imagemapUseValue,
            r = Cn(e);
        n === null && r && (n = r.value);
        var i = _n(t);
        i &&
            ((r && r.getAttribute(`formmethod`)) || t.getAttribute(`method`)) === `dialog` &&
            (e.preventDefault(), n == null ? i.close() : i.close(n));
    }
}
function Tn(e) {
    if (
        ((this.dialog_ = e),
        (this.replacedStyleTop_ = !1),
        (this.openAsModal_ = !1),
        e.hasAttribute(`role`) || e.setAttribute(`role`, `dialog`),
        (e.show = this.show.bind(this)),
        (e.showModal = this.showModal.bind(this)),
        (e.close = this.close.bind(this)),
        e.addEventListener(`submit`, wn, !1),
        `returnValue` in e || (e.returnValue = ``),
        `MutationObserver` in window)
    )
        new MutationObserver(this.maybeHideModal.bind(this)).observe(e, {
            attributes: !0,
            attributeFilter: [`open`],
        });
    else {
        var t = !1,
            n = function () {
                (t ? this.downgradeModal() : this.maybeHideModal(), (t = !1));
            }.bind(this),
            r,
            i = function (i) {
                if (i.target === e) {
                    var a = `DOMNodeRemoved`;
                    ((t |= i.type.substr(0, a.length) === a),
                        window.clearTimeout(r),
                        (r = window.setTimeout(n, 0)));
                }
            };
        [`DOMAttrModified`, `DOMNodeRemoved`, `DOMNodeRemovedFromDocument`].forEach(function (t) {
            e.addEventListener(t, i);
        });
    }
    (Object.defineProperty(e, `open`, {
        set: this.setOpen.bind(this),
        get: e.hasAttribute.bind(e, `open`),
    }),
        (this.backdrop_ = document.createElement(`div`)),
        (this.backdrop_.className = `backdrop`),
        this.backdrop_.addEventListener(`mouseup`, this.backdropMouseEvent_.bind(this)),
        this.backdrop_.addEventListener(`mousedown`, this.backdropMouseEvent_.bind(this)),
        this.backdrop_.addEventListener(`click`, this.backdropMouseEvent_.bind(this)));
}
Tn.prototype = {
    get dialog() {
        return this.dialog_;
    },
    maybeHideModal: function () {
        (this.dialog_.hasAttribute(`open`) && Sn(this.dialog_)) || this.downgradeModal();
    },
    downgradeModal: function () {
        this.openAsModal_ &&
            ((this.openAsModal_ = !1),
            (this.dialog_.style.zIndex = ``),
            (this.replacedStyleTop_ &&= ((this.dialog_.style.top = ``), !1)),
            this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_),
            Q.dm.removeDialog(this));
    },
    setOpen: function (e) {
        e
            ? this.dialog_.hasAttribute(`open`) || this.dialog_.setAttribute(`open`, ``)
            : (this.dialog_.removeAttribute(`open`), this.maybeHideModal());
    },
    backdropMouseEvent_: function (e) {
        if (this.dialog_.hasAttribute(`tabindex`)) this.dialog_.focus();
        else {
            var t = document.createElement(`div`);
            (this.dialog_.insertBefore(t, this.dialog_.firstChild),
                (t.tabIndex = -1),
                t.focus(),
                this.dialog_.removeChild(t));
        }
        var n = document.createEvent(`MouseEvents`);
        (n.initMouseEvent(
            e.type,
            e.bubbles,
            e.cancelable,
            window,
            e.detail,
            e.screenX,
            e.screenY,
            e.clientX,
            e.clientY,
            e.ctrlKey,
            e.altKey,
            e.shiftKey,
            e.metaKey,
            e.button,
            e.relatedTarget,
        ),
            this.dialog_.dispatchEvent(n),
            e.stopPropagation());
    },
    focus_: function () {
        var e = this.dialog_.querySelector(`[autofocus]:not([disabled])`);
        (!e && this.dialog_.tabIndex >= 0 && (e = this.dialog_),
            (e ||= xn(this.dialog_)),
            vn(document.activeElement),
            e && e.focus());
    },
    updateZIndex: function (e, t) {
        if (e < t) throw Error(`dialogZ should never be < backdropZ`);
        ((this.dialog_.style.zIndex = e), (this.backdrop_.style.zIndex = t));
    },
    show: function () {
        this.dialog_.open || (this.setOpen(!0), this.focus_());
    },
    showModal: function () {
        if (this.dialog_.hasAttribute(`open`))
            throw Error(
                `Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.`,
            );
        if (!Sn(this.dialog_))
            throw Error(
                `Failed to execute 'showModal' on dialog: The element is not in a Document.`,
            );
        if (!Q.dm.pushDialog(this))
            throw Error(
                `Failed to execute 'showModal' on dialog: There are too many open modal dialogs.`,
            );
        (gn(this.dialog_.parentElement) &&
            console.warn(
                `A dialog is being shown inside a stacking context. This may cause it to be unusable. For more information, see this link: https://github.com/GoogleChrome/dialog-polyfill/#stacking-context`,
            ),
            this.setOpen(!0),
            (this.openAsModal_ = !0),
            Q.needsCentering(this.dialog_)
                ? (Q.reposition(this.dialog_), (this.replacedStyleTop_ = !0))
                : (this.replacedStyleTop_ = !1),
            this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling),
            this.focus_());
    },
    close: function (e) {
        if (!this.dialog_.hasAttribute(`open`))
            throw Error(
                `Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.`,
            );
        (this.setOpen(!1), e !== void 0 && (this.dialog_.returnValue = e));
        var t = new mn(`close`, {bubbles: !1, cancelable: !1});
        hn(this.dialog_, t);
    },
};
var Q = {};
if (
    ((Q.reposition = function (e) {
        var t = document.body.scrollTop || document.documentElement.scrollTop,
            n = t + (window.innerHeight - e.offsetHeight) / 2;
        e.style.top = Math.max(t, n) + `px`;
    }),
    (Q.isInlinePositionSetByStylesheet = function (e) {
        for (var t = 0; t < document.styleSheets.length; ++t) {
            var n = document.styleSheets[t],
                r = null;
            try {
                r = n.cssRules;
            } catch {}
            if (r)
                for (var i = 0; i < r.length; ++i) {
                    var a = r[i],
                        o = null;
                    try {
                        o = document.querySelectorAll(a.selectorText);
                    } catch {}
                    if (!(!o || !yn(o, e))) {
                        var s = a.style.getPropertyValue(`top`),
                            c = a.style.getPropertyValue(`bottom`);
                        if ((s && s !== `auto`) || (c && c !== `auto`)) return !0;
                    }
                }
        }
        return !1;
    }),
    (Q.needsCentering = function (e) {
        return window.getComputedStyle(e).position !== `absolute` ||
            (e.style.top !== `auto` && e.style.top !== ``) ||
            (e.style.bottom !== `auto` && e.style.bottom !== ``)
            ? !1
            : !Q.isInlinePositionSetByStylesheet(e);
    }),
    (Q.forceRegisterDialog = function (e) {
        if (
            ((window.HTMLDialogElement || e.showModal) &&
                console.warn(
                    `This browser already supports <dialog>, the polyfill may not work correctly`,
                    e,
                ),
            e.localName !== `dialog`)
        )
            throw Error(`Failed to register dialog: The element is not a dialog.`);
        new Tn(e);
    }),
    (Q.registerDialog = function (e) {
        e.showModal || Q.forceRegisterDialog(e);
    }),
    (Q.DialogManager = function () {
        this.pendingDialogStack = [];
        var e = this.checkDOM_.bind(this);
        ((this.overlay = document.createElement(`div`)),
            (this.overlay.className = `_dialog_overlay`),
            this.overlay.addEventListener(
                `click`,
                function (t) {
                    ((this.forwardTab_ = void 0), t.stopPropagation(), e([]));
                }.bind(this),
            ),
            (this.handleKey_ = this.handleKey_.bind(this)),
            (this.handleFocus_ = this.handleFocus_.bind(this)),
            (this.zIndexLow_ = 1e5),
            (this.zIndexHigh_ = 100150),
            (this.forwardTab_ = void 0),
            `MutationObserver` in window &&
                (this.mo_ = new MutationObserver(function (t) {
                    var n = [];
                    (t.forEach(function (e) {
                        for (var t = 0, r; (r = e.removedNodes[t]); ++t) {
                            if (r instanceof Element) r.localName === `dialog` && n.push(r);
                            else continue;
                            n = n.concat(r.querySelectorAll(`dialog`));
                        }
                    }),
                        n.length && e(n));
                })));
    }),
    (Q.DialogManager.prototype.blockDocument = function () {
        (document.documentElement.addEventListener(`focus`, this.handleFocus_, !0),
            document.addEventListener(`keydown`, this.handleKey_),
            this.mo_ && this.mo_.observe(document, {childList: !0, subtree: !0}));
    }),
    (Q.DialogManager.prototype.unblockDocument = function () {
        (document.documentElement.removeEventListener(`focus`, this.handleFocus_, !0),
            document.removeEventListener(`keydown`, this.handleKey_),
            this.mo_ && this.mo_.disconnect());
    }),
    (Q.DialogManager.prototype.updateStacking = function () {
        for (var e = this.zIndexHigh_, t = 0, n; (n = this.pendingDialogStack[t]); ++t)
            (n.updateZIndex(--e, --e), t === 0 && (this.overlay.style.zIndex = --e));
        var r = this.pendingDialogStack[0];
        r
            ? (r.dialog.parentNode || document.body).appendChild(this.overlay)
            : this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay);
    }),
    (Q.DialogManager.prototype.containedByTopDialog_ = function (e) {
        for (; (e = _n(e)); ) {
            for (var t = 0, n; (n = this.pendingDialogStack[t]); ++t)
                if (n.dialog === e) return t === 0;
            e = e.parentElement;
        }
        return !1;
    }),
    (Q.DialogManager.prototype.handleFocus_ = function (e) {
        var t = e.composedPath ? e.composedPath()[0] : e.target;
        if (
            !this.containedByTopDialog_(t) &&
            document.activeElement !== document.documentElement &&
            (e.preventDefault(), e.stopPropagation(), vn(t), this.forwardTab_ !== void 0)
        ) {
            var n = this.pendingDialogStack[0];
            return (
                n.dialog.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING &&
                    (this.forwardTab_
                        ? n.focus_()
                        : t !== document.documentElement && document.documentElement.focus()),
                !1
            );
        }
    }),
    (Q.DialogManager.prototype.handleKey_ = function (e) {
        if (((this.forwardTab_ = void 0), e.keyCode === 27)) {
            (e.preventDefault(), e.stopPropagation());
            var t = new mn(`cancel`, {bubbles: !1, cancelable: !0}),
                n = this.pendingDialogStack[0];
            n && hn(n.dialog, t) && n.dialog.close();
        } else e.keyCode === 9 && (this.forwardTab_ = !e.shiftKey);
    }),
    (Q.DialogManager.prototype.checkDOM_ = function (e) {
        this.pendingDialogStack.slice().forEach(function (t) {
            e.indexOf(t.dialog) === -1 ? t.maybeHideModal() : t.downgradeModal();
        });
    }),
    (Q.DialogManager.prototype.pushDialog = function (e) {
        var t = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
        return this.pendingDialogStack.length >= t
            ? !1
            : (this.pendingDialogStack.unshift(e) === 1 && this.blockDocument(),
              this.updateStacking(),
              !0);
    }),
    (Q.DialogManager.prototype.removeDialog = function (e) {
        var t = this.pendingDialogStack.indexOf(e);
        t !== -1 &&
            (this.pendingDialogStack.splice(t, 1),
            this.pendingDialogStack.length === 0 && this.unblockDocument(),
            this.updateStacking());
    }),
    (Q.dm = new Q.DialogManager()),
    (Q.formSubmitter = null),
    (Q.imagemapUseValue = null),
    window.HTMLDialogElement === void 0)
) {
    var En = document.createElement(`form`);
    if ((En.setAttribute(`method`, `dialog`), En.method !== `dialog`)) {
        var Dn = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, `method`);
        if (Dn) {
            var On = Dn.get;
            Dn.get = function () {
                return bn(this) ? `dialog` : On.call(this);
            };
            var kn = Dn.set;
            ((Dn.set = function (e) {
                return typeof e == `string` && e.toLowerCase() === `dialog`
                    ? this.setAttribute(`method`, e)
                    : kn.call(this, e);
            }),
                Object.defineProperty(HTMLFormElement.prototype, `method`, Dn));
        }
    }
    (document.addEventListener(
        `click`,
        function (e) {
            if (((Q.formSubmitter = null), (Q.imagemapUseValue = null), !e.defaultPrevented)) {
                var t = e.target;
                if (
                    (`composedPath` in e && (t = e.composedPath().shift() || t),
                    !(!t || !bn(t.form)))
                ) {
                    if (!(t.type === `submit` && [`button`, `input`].indexOf(t.localName) > -1)) {
                        if (!(t.localName === `input` && t.type === `image`)) return;
                        Q.imagemapUseValue = e.offsetX + `,` + e.offsetY;
                    }
                    _n(t) && (Q.formSubmitter = t);
                }
            }
        },
        !1,
    ),
        document.addEventListener(`submit`, function (e) {
            var t = e.target;
            if (!_n(t)) {
                var n = Cn(e);
                ((n && n.getAttribute(`formmethod`)) || t.getAttribute(`method`)) === `dialog` &&
                    e.preventDefault();
            }
        }));
    var An = HTMLFormElement.prototype.submit,
        jn = function () {
            if (!bn(this)) return An.call(this);
            var e = _n(this);
            e && e.close();
        };
    HTMLFormElement.prototype.submit = jn;
}
const Mn = (e, t, n = `_i18n`) =>
        class extends e {
            constructor() {
                (super(), (this[n] = t()), (this.lang = this[n].language));
            }
            static get properties() {
                return {...super.properties, lang: {type: String}};
            }
            update(e) {
                (e.forEach((e, t) => {
                    t === `lang` && this[n].changeLanguage(this.lang);
                }),
                    super.update(e));
            }
        },
    Nn = (e, t) => (e.endsWith(`/`) || (e += `/`), new URL(t.replace(/^\/+/, ``), e).href),
    Pn = Ke(
        (e) =>
            class extends e {
                static properties = {auth: {type: Object}, ...e.properties};
                constructor() {
                    (super(),
                        (this.auth = null),
                        (this._previousAuthState = null),
                        (this._authPending = !0));
                }
                update(e) {
                    if (e.has(`auth`)) {
                        let e = this._previousAuthState || {},
                            t = this.auth || {},
                            n = e[`login-status`] === `logged-in`,
                            r = e[`login-status`] === `logged-out`,
                            i = t[`login-status`] === `logged-in`,
                            a = t[`login-status`] === `logged-out`;
                        (!n && i && ((this._authPending = !1), this.loginCallback(t)),
                            !r &&
                                a &&
                                (this._authPending
                                    ? (this._authPending = !1)
                                    : this.logoutCallback()),
                            (this._previousAuthState = {...t}));
                    }
                    super.update(e);
                }
                isAuthPending() {
                    return this._authPending;
                }
                isLoggedIn() {
                    return this.auth && this.auth[`login-status`] === `logged-in`;
                }
                loginCallback(e) {}
                logoutCallback() {}
            },
    );
function Fn(e) {
    let t = new CustomEvent(`dbp-notification-send`, {bubbles: !0, cancelable: !0, detail: e});
    window.dispatchEvent(t) &&
        (alert(
            [e.summary, e.body].filter(Boolean).join(`:

`),
        ),
        console.log(`Use the web component dbp-notification to show fancy notifications.`));
}
var In = {
        'person-select': {
            'login-required': `Anmeldung erforderlich`,
            placeholder: `Bitte wählen Sie eine Person aus`,
        },
    },
    Ln = {
        'person-select': {
            'login-required': `Login required`,
            placeholder: `Please select a person`,
        },
    };
function Rn() {
    return un({en: Ln, de: In}, `de`, `en`);
}
var zn = `shared/select2.min.ae5735562faabd1a.css`;
const Bn = {
    handleXhrError(e, t, n, r = `sad`, i = `de`) {
        if (t === `abort`) return;
        let a,
            o = pn();
        (o.changeLanguage(i),
            e.responseJSON !== void 0 && e.responseJSON[`hydra:description`] !== void 0
                ? (a = e.responseJSON[`hydra:description`])
                : e.responseJSON !== void 0 && e.responseJSON.detail !== void 0
                  ? (a = e.responseJSON.detail)
                  : ((a = t), n && (a += ` - ` + n)),
            e.status === 0 && (a = o.t(`error.connection-to-server-refused`)),
            Fn({summary: o.t(`error.summary`), body: a, icon: r, type: `danger`}),
            this.sendSetPropertyEvent !== void 0 &&
                this.sendSetPropertyEvent(`analytics-event`, {category: `XhrError`, action: a}));
    },
    handleFetchError: async function (e, t = ``, n = `sad`, r = `de`) {
        if (e.name === `AbortError`) return;
        let i,
            a = pn();
        a.changeLanguage(r);
        try {
            await e
                .json()
                .then((t) => {
                    i =
                        t[`hydra:description`] === void 0
                            ? t.detail === void 0
                                ? e.statusText
                                : t.detail
                            : t[`hydra:description`];
                })
                .catch(() => {
                    i = e.statusText === void 0 ? e : e.statusText;
                });
        } catch {
            e.name === `TypeError` &&
                (i = e.message === `` ? a.t(`error.connection-to-server-refused`) : e.message);
        }
        (Fn({summary: t === `` ? a.t(`error.summary`) : t, body: i, icon: n, type: `danger`}),
            this.sendSetPropertyEvent !== void 0 &&
                this.sendSetPropertyEvent(`analytics-event`, {
                    category: `FetchError`,
                    action: t === `` ? i : t + `: ` + i,
                }));
    },
};
var Vn = c(m(), 1),
    Hn = c(g(), 1),
    Un = class e extends Mn(Qe(it), Rn) {
        constructor() {
            (super(),
                Object.assign(e.prototype, Bn),
                (this.auth = {}),
                (this.entryPointUrl = null),
                (this.$select = null),
                (this.active = !1),
                (this.selectId = `person-select-` + u(24)),
                (this.value = ``),
                (this.object = null),
                (this.ignoreValueUpdate = !1),
                (this.isSearching = !1),
                (this.lastResult = {}),
                (this.showReloadButton = !1),
                (this.reloadButtonTitle = ``),
                (this.disabled = !1),
                (this.localDataAttributes = []),
                (this._onDocumentClicked = this._onDocumentClicked.bind(this)),
                (0, Hn.default)(window, Vn.default));
        }
        static get scopedElements() {
            return {'dbp-icon': He};
        }
        $(e) {
            return (0, Vn.default)(this.shadowRoot.querySelector(e));
        }
        static get properties() {
            return {
                ...super.properties,
                active: {type: Boolean, attribute: !1},
                entryPointUrl: {type: String, attribute: `entry-point-url`},
                value: {type: String},
                object: {type: Object, attribute: !1},
                localDataAttributes: {type: Array},
                showReloadButton: {type: Boolean, attribute: `show-reload-button`},
                reloadButtonTitle: {type: String, attribute: `reload-button-title`},
                auth: {type: Object},
                disabled: {type: Boolean, reflect: !0},
            };
        }
        clear() {
            ((this.object = null),
                (0, Vn.default)(this).attr(`data-object`, ``),
                (0, Vn.default)(this).data(`object`, null),
                (this.value = ``),
                (0, Vn.default)(this).attr(`value`, ``),
                this.$select.val(null).trigger(`change`).trigger(`select2:unselect`),
                this.dispatchEvent(new CustomEvent(`change`, {detail: {value: ``}, bubbles: !0})));
        }
        connectedCallback() {
            (super.connectedCallback(),
                document.addEventListener(`click`, this._onDocumentClicked),
                this.updateComplete.then(() => {
                    ((this.$select = this.$(`#` + this.selectId)),
                        this.select2IsInitialized() || this.initSelect2());
                }));
            let e = this.getAttribute(`local-data-attributes`);
            if (e)
                try {
                    this.localDataAttributes = JSON.parse(e);
                } catch (e) {
                    console.error(
                        `local-data-attributes attribute must be a JSON array of strings`,
                        e.message,
                    );
                }
        }
        disconnectedCallback() {
            (document.removeEventListener(`click`, this._onDocumentClicked),
                super.disconnectedCallback());
        }
        _onDocumentClicked(e) {
            if (!e.composedPath().includes(this)) {
                let e = this.$(`#` + this.selectId);
                e.length && this.select2IsInitialized() && e.select2(`close`);
            }
        }
        initSelect2(e = !1) {
            let t = this._i18n,
                n = this,
                r = (0, Vn.default)(this);
            if (this.$select === null || this.entryPointUrl === null) return !1;
            let i = Nn(this.entryPointUrl, `/base/people`);
            if (
                (this.$select &&
                    this.$select.hasClass(`select2-hidden-accessible`) &&
                    (this.$select.select2(`destroy`),
                    this.$select.off(`select2:select`),
                    this.$select.off(`select2:closing`)),
                this.$select
                    .select2({
                        width: `100%`,
                        language: this.lang === `de` ? _() : v(),
                        minimumInputLength: 2,
                        allowClear: !0,
                        placeholder: this.authenticated()
                            ? t.t(`person-select.placeholder`)
                            : t.t(`person-select.login-required`),
                        dropdownParent: this.$(`#person-select-dropdown`),
                        ajax: {
                            delay: 500,
                            url: i,
                            contentType: `application/ld+json`,
                            beforeSend: function (e) {
                                (e.setRequestHeader(`Authorization`, `Bearer ` + n.auth.token),
                                    (n.isSearching = !0));
                            },
                            data: (e) => this.getCollectionQueryParameters(this, e.term),
                            processResults: function (e) {
                                (n.$(`#person-select-dropdown`).addClass(`select2-bug`),
                                    (n.lastResult = e));
                                let t = e[`hydra:member`],
                                    r = [];
                                return (
                                    t.forEach((e) => {
                                        r.push({id: e[`@id`], text: n.formatPerson(n, e)});
                                    }),
                                    {results: r}
                                );
                            },
                            error: (e, t, n) => {
                                this.handleXhrError(e, t, n);
                            },
                            complete: (e, t) => {
                                n.isSearching = !1;
                            },
                        },
                    })
                    .on(`select2:clear`, function (e) {
                        n.clear();
                    })
                    .on(`select2:select`, function (e) {
                        n.$(`#person-select-dropdown`).removeClass(`select2-bug`);
                        let t = e.params.data.id;
                        ((n.object = h(t, n.lastResult)),
                            r.attr(`data-object`, JSON.stringify(n.object)),
                            r.data(`object`, n.object),
                            r.attr(`value`) !== t &&
                                ((n.ignoreValueUpdate = !0),
                                r.attr(`value`, t),
                                n.dispatchEvent(
                                    new CustomEvent(`change`, {detail: {value: t}, bubbles: !0}),
                                )));
                    })
                    .on(`select2:closing`, (e) => {
                        n.isSearching && e.preventDefault();
                    }),
                !e && this.value !== `` && this.authenticated())
            ) {
                let e = Nn(this.entryPointUrl, this.value),
                    t = new URLSearchParams(this.getItemQueryParameters(this)).toString();
                (t && (e += `?${t}`),
                    fetch(e, {
                        headers: {
                            'Content-Type': `application/ld+json`,
                            Authorization: `Bearer ` + this.auth.token,
                        },
                    })
                        .then((e) => {
                            if (!e.ok) throw e;
                            return e.json();
                        })
                        .then((e) => {
                            n.object = e;
                            let t = e[`@id`],
                                i = new Option(n.formatPerson(this, e), t, !0, !0);
                            (r.attr(`data-object`, JSON.stringify(e)),
                                r.data(`object`, e),
                                n.$select.append(i).trigger(`change`),
                                n.dispatchEvent(
                                    new CustomEvent(`change`, {detail: {value: t}, bubbles: !0}),
                                ));
                        })
                        .catch((e) => {
                            (console.log(e), n.clear());
                        }));
            }
            return !0;
        }
        getItemQueryParameters(e) {
            let t = {};
            return (this.addIncludeLocalQueryParameter(e, t), t);
        }
        getCollectionQueryParameters(e, t) {
            let n = this.getFilterQueryParameters(e, t);
            return (this.addIncludeLocalQueryParameter(e, n), n);
        }
        getFilterQueryParameters(t, n) {
            return e.getFilterQueryParametersDefault(t, n);
        }
        static getFilterQueryParametersDefault(e, t) {
            return {search: t.trim(), sort: `familyName`};
        }
        addIncludeLocalQueryParameter(e, t) {
            this.localDataAttributes.length > 0 &&
                (t.includeLocal = this.localDataAttributes.join(`,`));
        }
        formatPerson(e, t) {
            let n = t.givenName ?? ``;
            t.familyName && (n += ` ${t.familyName}`);
            let r = this.formatLocalData(e, t);
            return (r && (n += ` ${r}`), n);
        }
        static formatPersonDefault(t, n) {
            let r = n.givenName ?? ``;
            n.familyName && (r += ` ${n.familyName}`);
            let i = e.formatLocalDataDefault(t, n);
            return (i && (r += ` ${i}`), r);
        }
        formatLocalData(t, n) {
            return e.formatLocalDataDefault(t, n);
        }
        static formatLocalDataDefault(e, t) {
            let n = t.localData ?? {};
            return Object.values(n).length === 0 ? `` : `(${Object.values(n).join(`, `)})`;
        }
        update(e) {
            (super.update(e),
                e.forEach((e, t) => {
                    switch (t) {
                        case `lang`:
                            this.select2IsInitialized() && this.initSelect2(!0);
                            break;
                        case `value`:
                            (!this.ignoreValueUpdate &&
                                this.select2IsInitialized() &&
                                this.initSelect2(),
                                (this.ignoreValueUpdate = !1));
                            break;
                        case `entryPointUrl`:
                            this.initSelect2(!0);
                            break;
                        case `auth`:
                            ((this.active = this.authenticated()),
                                this.active && (!e || !e.token) && this.initSelect2());
                            break;
                    }
                }));
        }
        select2IsInitialized() {
            return this.$select !== null && this.$select.hasClass(`select2-hidden-accessible`);
        }
        reloadClick() {
            this.object !== null &&
                this.dispatchEvent(
                    new CustomEvent(`change`, {detail: {value: this.value}, bubbles: !0}),
                );
        }
        authenticated() {
            return (this.auth.token || ``) !== ``;
        }
        static get styles() {
            return [
                $e(),
                et(),
                nt(),
                tt(),
                rt(),
                T`
                #person-select-dropdown {
                    position: relative;
                }

                .select2-control.control {
                    width: 100%;
                }

                .field .button.control {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: var(--dbp-border);
                    border-color: var(--dbp-muted);
                    -moz-border-radius-topright: var(--dbp-border-radius);
                    -moz-border-radius-bottomright: var(--dbp-border-radius);
                    line-height: 100%;
                }

                .field .button.control dbp-icon {
                    top: 0;
                }

                /* https://github.com/select2/select2/issues/5457 */
                .select2-bug .loading-results {
                    display: none !important;
                }

                .select2-results__option.loading-results,
                {
                    background-image: url("data:image/gif;base64,R0lGODlhTABKAMIFAAAAADU3NF1fXIuNirq8uf///////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6NFAmrvXgNAbr/IBhQWWkSQ6iGgTCQJkNwa/daRB0KcFwSAd1HEBF6Rr6kI2UkLoLGnjI5gOp4MmMnMJjGmFopo6oViXGzMsipJKvfRqTXS0BtAvhgS8C/zf8RbkIBgIVgcGZKNB5dJ1ZajYUFgnFiOVpykhePNZmXUZoxZTKcK5GhFYc6YqpCp5KtOq84iLVvXKhptpBnqA8SdyqZvnNAcITEbbtbdAJcvRjGywB5VCvDGKVCLpKL29CxNbOwatgK3lfJDug1Pdoq0L7Srguf9OoVowrznfHE/NdIhFuDDwI7FWzOlfEnyV66JWr8yHunYpwGOAmbwbHo/gDgLRc36ojcMI1hR0rTdj0L5SxlRJOF6hz8KLHgDzvO8GS0OaUOHh3IeCZBQXEHTKEoagUVegHlGyw9OfoYWM4LDVxenCpVFuLovpmYXIj06tED1AxlgZ7VCAoDWFNeUxUFIbXAXLq5tJqq8JagOqp4O5bBis/hqgh3bSBNvBawWaaT7g7rywxyAcoAEpap+w9Tvc2WFeibkDhuIUwkUIfWO4QEZs6+HGceM3oxJFJaduLDDAAiL568x/Fe2rmMbtKDjwOSvaWXLkw1i7Fm4S/xh5U9eR9hmLSW2GgzrIvwkfYWtZ8uYT+Y7rKcegvs28sK9Vx+pb/ibbUwnV17Ee736qDAQX7fhaZEHfvwZ0ICACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o0UIiu8OOcBuv9gKHqSZmLBqHoCdb6wQqTrV8Z4Xgh1N+jAAqcnYNBqv2CO0AMUGcwmIKnMRHuB22NwlDq1JgrP2wlQcUOyeiU4V1+UwUAQoAfu9PbA9a4SuGshT30ogVJZhA9XUi2JfYdgjlZzXQBalSKIklaYIZoTnSFum1BNZg+hmaNVaU2rEDOGsj2RSn+pswBmtaQRf2Neda+9CwR0uR8BxA6xyCLDjq2BKXfVR5+9gGSnyzHSNcrdOt8j2OIXFGDkIucMcz1Uxk28xIsqms017VC4ZTfrIAa169dB4A4p0BLZU2FQATB49Gw9RIJhIrhGEgl+SFj+TGM5PelCcvEoAiMaZ8i49bmFEsuefZRIejK374IcLnao1TGzJ2LNCZRkhfspQxsyn6SMomzYDeAsmsQstuS40ikyppsWbhPQImQ6SkjfSCUSdp9MXVR/jh2BlaiDtZ7KErW60e0LuHXtLpCDJwKjn3HuZNJyDJzaJoPk0fqptFxHLHIJ5bvHwFTklRqL4dV1+c1kFQw2T2Fsyp2UzkEUU6xsuZ1oAA4aOxb3epVHqIk8mnRHsq0S2eXoaV3x0jPdZD4/kw3ybtuL44P5oAu6xreisyBoVNOVErUQ7C2zp8WgPLwr7xBeh8f9prn5ZCrFARda3O4vaqacyEHfzoIE9F4JAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6NECWhvThLwLv/YChywZSdBRGMLBAI5kUMwgrEaGa3HJ7/wAaPFCwaF6qh78hEJZXN02AUCAyWj8Fu6IIFCQKux3okiM9ccvQ709aqcIF8kMKugU80S26PhvWAHF53eUODd2tmQwGIjQyKPHSOkylcfZSXGVNiko2bXJ2aW4GkIqGJWqUsVpmUC1qjPC9Xrpqqlph/t4uUn6pwLiynibGRTK1fxSKMtU26LbTNzrjSUaDVUZAtyNgYviOH3UVg1NVPsz/fwtxFz9sX6i3hRuRnwxD1gLNXEhUDNMoMsXsUb5eeaHdqGJSF0FwqUisE3BP3YEYVFxfhvJBYzYGiN3eBOHqUEPCWmmYPF4qY1wikyg8T15R8edKRy5djBubQpo9VvzoAt7BcczOSTjANERWkEtNjg6UhBDjdKabEVBQpoV3NkUanU6gevDqdSUIsxULgtlKFovYEzxFmz15re6Koh6Z0Xy2KS5EsAKniaiTVwAVwNZAvWuVrYbXW4mVDFfjt4gpsTgtoVxnOlpVxpseyOo6zG5Wb5ZWRkRSgERLPZMbATJrtjLMqXwW0azNtBFr35cqkd9Wslhvi4JGwXs+63W2Cc+YZEgAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jRRCK7w4ZwG6/2AojqIgaVhArkAgDCckEVwooBnBgjHu/5caawAsGh+qHfHIPBKSu1tzChTuPC4KkEYFDqDXsGjZpVIGA4FAFWi71Jby9CsOw+WMZ32/C/SKA3t+eF06VwGEiXo7iY0TYX+OZYFiMJKEdHyaAJGXCwSZmyuDnhcUa3wvWqUOVqJ9nVOLr6ImVK60fGRNlHu7gBykZnXCrD9go8ZMvUPKTJDOTrghxdE/0zbWR9gg1doozCxS3z7hUbHkEbSqFmdpYN6NobnNxqD09dag3GEuv+kT0Lgh0cYSQAZpcvlDJ4kGPhEB/ilC9nCELTyzKoaRaKYko8ZzZfh9DMGxiCFRbyqcUYOKxDgq5jaabNmCYRVBNlGAKmmE4qic30R+iHdQwckoRVPITCrDJzWmQQ4BBeiUB9QLYa42haXVgUeIUwEKBcCTaUxqYdNVHdrVwdmnbRmM7VC26FoQL7t+JVg33dF+q67u7fNC5zsAeSfSa9OiqkFJbz8mlncX30VPDkcOTTtn7iaiDRM+zAJwX+WhquJ+MqqFc5EEACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o3IIomyMOv9yABgKI5kaZYCxkFEcL5AkHKE4J6BujYCLOq7oBDiAwmGyKSjVQQqn8LBzeeEWjnSokhWvXojxdx3TC6bF0ytOte19tTwuHiY1s690vaOoD2ex3xFA39lH02EZoZag4hkgXF6jUkeAVMAfpKNlHEglYyZDDWco2xldaOoIwGfSYqpryF3SKd9UANvnZE0ljAzoEO4MAO6vw+8J8TFS4vKk1rJzQ2uJ5jRQsEv0NYK0y/D20HdvdrNoqTgG+LU6NfHIazsdBI25PEbNe6xMsP1f5uwRvpZUQcwhC9CBAuW+OYon0IYq7zQeijHDcVUsmYB5FKNgYIAG3YELsCm5uCOLCQytuIET4mhiFcSkjAp8QtKHwHsQbgpTGcHh1tEgpL5zicEkiVUGp2IwmiHZ06XHYoaCminllGRzqQqzWoMob+8xuDKgOc6sgq0pgSbSSwIrEbdxqjm1NwauPFAckrB1pRcETTtmYXYF6FbvD7tmqCL1mPSwtFuIm4cirLlBQkAACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o0UQsmQMOutBfhgKI5kWQ7cFpjsF6DYQw0tIKRQHcZ472eeGupHLDpWQqNSSUC2XssokRYS8KTYrHbL7Xo1VJ3Ydc02x+j05/YLiwNlJY3NdLICX+25lucSxHF9S24lVoKHiImKixAUdmgCQ4wEQWpqdHqWmiySRZWboCEXRoRimEQCj51FpXeBjA+PJniwPq0kq7UcgLo+e669Pp8mp8Ebwyavxg23uMspt1DPP5QvytPY2drbzxapNQGG2AOymuKL5KFPh3/qaHB+5e5iuUW/85vXx/ihxb7q4S7MIBdAHgl/tsxNkYdQmBp9HH6NimKwBERfWZDNulhYq52Oht0qiuLGIB04kgw0joCHUoHIDxyDvQTQcsG9EixbUgIXs5dKEfW2NQuRs+VMkONM1ZzwU8Q5kjt5Lr0JdGkDWdKsMnMxUauMnl7Dih1LtqzZs88SAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6LyEmKhDjrTAL4YCiOZFkOm+aZLBBcGDEILShUKUPXH57/wMyuhQoaj45Vy4dsOp/QqHRKrVqv2GxsyOu6ilUC10smB8CpjpnpFH/Ozu6ArT2qW6+6lKLv+/+AgYKDD25lIAE3dHV3h4cCVo2OkyM3TQOUmSaWQQSOeXYCSiFonWMsnGFQmDyQhDmsNYuvhacjoLQpoyW4uRpjAYkDcxa+xsfIycrLzM3Oz30ywbu3AsTHsZpfs1me2iy9V7bfJnBUkuRkqU3o6YelQePua3bawhcyotQt60Dy/Nxq7bPh5F8JV212wQMigx6VAebaeAmXzBuPhcga8ghoOqzdLYzJDH5A+GygCJAZTSLi2FHlG5a+PI6A6etfsH7NPAmbQxOaz59AgwodSrSo0aNIkypdyrTpsgQAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jBRCxLgS6s23AGAojmRpmkPWQd/pAkHKVe8pqFpQg/fq/8AG5SL4xILIpHLJbDqf0Kh0Sq1ar9iCQLfrhgbWlndMBoF/BG43IBWLLMD0TpCt2+/4vH7P7/ubNGUgAT17goeFUXKHjCR0SwONki4BODNqXmxKgS83lhqLc1UEAzpHSZGifx0EO5WrsLGys7S1tre4ubq7vL11pG4nhGexpJMhr3qpxyanV8vMO59OmNFeiUuh1oKPSsHbh8Ro32VFKURbkpo+2tfTHtWU4h3QXe9x8SIyQPUvyVGl3tzbENDVFVL/kLQ7MTAWORLOcLXaMU8isAAYHfnaQByBwsaPIEOKHEmypMmTKFOqXMmypcuXMGPKXJUAACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/otIOUiVhcDNOxRAKI5kaZ6n4HUg6gLBkG1W8LrqyhCCTea64K71kwmPyKRyyWw6n9CodEqtWq9Y1m1rAk6J3LB4ZNQRfNyA5nkWq7PwuHxOr9vv+Ly+PR4J1nVofWMBVYKDiD9MA4eJjiVvZo03f0p8boA0PTcVVWAoAV5CNQBlWS1/mXqrrK2ur7CxsrO0tba3uLlHPAGTJL2Vrp+PonGbjy+mVQPIfcpOl819wU3D0tOqo77XhM8r22GhFwPHjtQejIPnHjyDMSvMY95H8WLzEWLrTe1h9xG8KIpJqWciRrYVpET4g5IuRCgMUCwcrCJRl8WLGDNq3MgVsaPHjyBDihxJsqTJkyhTqlzJskACACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/o2QQQcpF+rN9QBgKI5kaZpD1w3B6QZX9kyt6wpqru+OYIc4nnAI+QACSAFFopARn9CodEqtWq/YrHaLNf6+okAq6wWbzyKBk0jwkYJTQg0c4GLdNph9z+/7/4CBgoMdNGhpa314h2h6V3OMkSSOQwSSl19jQm2QJmpsnV9wTyxHmlZtZnWEO4sup6wdoSWwsba3uLm6u7y9vr/AwcJ7EgKzkxa5cpgiyX+lzK92ltFntVKu1apUZdqMlELd3pKjOamXAQJKFgPGx6qJHBLvtPEa543XKtAm9jvUZ8r9MxYi3Z2AUdp80kJvhD5d/F74yxXxhMBe4voNy1YiMJ2zYBMsTBxGsqTJkyhTqlzJsqXLlzBjypxJs6bNm1oSAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6LFCKplTDrnQX4YCiOZFkGGKdOgxkGaPpQgWsHa67vkx0KvKDQ0fIBh8gdwQfAJZ/QqHRKrVqvWOWgxuyCjtWld0z+yqDbj+A8LHpRWarH54xDCVwX3J4lDAZsfIKDhIWGHAMCeWVrh3NlZXtTj5CVI5JDBJSWnCIDUW4vjUF4kIFCp0+bLqOHOosun646pT6pszOwJJi4GrV6t70MFH+KumDCycrLzM3Oz9DRfYkwNwGAyn66lsiCmp0+sli/4F3dT9/llbykoerrwRvp753nPKt0AtjEiuDxiHpaqZhHxh6PNCDYHdymJwoebFLIGZE2gSEJcdHcufjXPUtiCYHQENrAGA3fCIPNxNygqMDjJZYVmcB0KaKOtFIWm8BsYIEaF5I7gwodSrSo0aNIkypdyrSp06dREgAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jEgyZCEw670H+GAojmRZClz6COYXoFhGBW0dqHiuX7W4/0CHp4cKGnXDmiB2bEIGtB6A6axqkiCqdcvter2EqHT8GXwVLLJ6DQhoqyxzlcCWn7fi2vtulLr5TXRSe4AqMz12hYqLjE4UaWwBiYyQbGs3XViWmyOEP5WcoSCTR6AApDmmg407YWqerBpkRbE5miaotRqCPbo5rjawvgyqI7TDMmPHyA7FJLnMDQTO0NG7NEvW2tvc3dN5JS8V1tOiIJKx4OadfMDrY8I/t+9jf4H0oval+KGYTfMmXiyZMECAOjbxVABEh2TTMiNJ9AXhRcafIy7u/HSLcFnwxEYGAJ99XBBShMSNzkIwHFmgo4iH3jSyVDBm5gWX5xIOy3hCp6+SIGBu41miWrSUIWYiHTWSqMeRUKRkm+k0p80F5UZYvEpSjFCuF6aCHUu2rNmzaNMmAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6MFEJVhTjrTAL4YCiOZEkKW/p0JhAIkkYIbR2oeK5PdYjuwGCE1gPEhEgcoQhIOmXMwPGJnDFDgQF1S7Rpt+Dwk+K5Xr9iS9nMZv7EHbSTdYWl7+va9D5m7vlCSz1SgEIDZnKFHF1mf4o4hyJZjxAUAnlXL46KA5htUZtIkZ+kJIRUdKWqIYlJqQACrUqMV6GUKZ4tt1WjNW+7O68mv8A5vS22xRDHJsnKDrQlxM8cbtQbBMwmstcT2i3cxd9Fdt0N4yXh5hO5H5rrKjMv6sUUA5ft7uXwVqvu9Gn6+SsxCVC2fANHANzRKeGnU06iOTQDsQrCib5QXfQRjmuCvUv+nMXLlUXkgmykpgUqsy9QmwEmU8QciQheho0gFnZDJ2LmM2EmbFYrorMbzhtCIUgk4VOZoB5JK/mJ6uCpHqrnyDUFBpREUWpLR2zdFVbE13o4YY191LBIRZsoM63lc48NUnj30opQSa3roLl3eI4oGNXvYJhYLfRombjA0reN1YAoGZnDhcq7EgAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jMhJSoU460wC+GAojmRJCtemOsRABqjEDa5pA0G67vxK3CJdb0hk1G6CorI48NwCy6jqCBRKlQQBcBQYXDHUrRjn/fIkNIEgwG7DaBar+dwci3NzTMfO30LzEWZ7dnKAV4NPhoaIJniKX2ElXY9LdWJJiox9W2WPmpsgXYWUC1lOdm+jlANaoHYoiq2usziqTKe0oJ2CrbBKsoSkUp82tsIrY7vHRcQjystDP0C+0EV+xtUPWZzZQ5ElmN0q25fiGuRjf48ubwMUaKy4fOGewLkiosfS96HPwmuuPAjwZy6OGjaN1Mgo2KCFPVDUoLWQx++Do3oUK54A1KhMY6MvF9B5vINtR8eRL+ZMfKLGXYUWTTIG4yUiRg9L8/JkiXiLjzqGGWRKArrhZE2iG76VIIh0gVIuTTU8LFES6NQR9KKyuKYVgtFaXbUJDRFW2xaeZZ+G+FlWwVgQTJt+BdvWwlu4dd3eyat2RNVsfZ11lXC1mLCFHES++lvkoZt7FyntQzlJH0qLcXUWnhX52OZNAxlfCXzHHdCJCO+Ezqvg5ctjCQAAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jRAlJbw4azqA/2AojiQ4bKjWeYFgYdIQlDQQTGmub3IN7sCgQ+Cz4YTIFKEY2BFkp6RqVjw+esVP65XCZj9W3epL9gWiUudgIBDMAvBWu5JOP+Hl2rmeIxDzgB8CfIQPfmQuhYoLBFQ+i4tLVZB8knpohn6OIwNhUmNFmBmNgaWXil6mJImUMAUyf4idrReHqkWstJa3WYO0sSNUwLe+lJ45bmVNtGnDNaLMQZs0xdFCu9TWSaA02kikesfeG86c4uO1vUqNm9CV3DTujNM1uUjlNOcR+L2ddDEy6H2xlwMeL0D61Ag8GOJMQkJP+GVpIQ8do4htqGyi+MnQW0ReBKM9YRisoxRwJEnc0LUwpaA64iS6tNEq1UwR1Qqh1CJgTYEKnQKqqiiFSMhRNpkQtcggaT2mKGypg4qiJU6qKJxywroBWz6uGmS+BJthItkMYj2YpOqVxFKyWdZC1Qpi2VkIBq/ehZDlLde0K4HIvddXxx0Wgw1bBZETBr7GdfKWRLrYht+odEUExpC27mVDbJSZ7NywZ1dNgCDDqMzkDetwQSTffHby9c09lUgz3IzKtqnE14Qe3IL1jm+Oew1RsAA8RwIAIfkEAQEABwAsAAAAAEwASgBAA/5Yutz+jRQiK7w4a0wC+GAojmQ4bGi6UFkllDAYSGptc7EYRO8X/ILBgHUrNga5j4BW6OWYRtvAk9sxOskPNIpBZgGnC+ErWm5bBCcZcE5h1/BYIMy1EQZBQUD/2++FRHWCC2pxIXttgypehl8CipAPaXB0kZYFVFVMb3KJlwxZVgpjWZWfDIUwphOMWYGCd5lJjyhTjbdVq3W2uCU/uqcOsbKzQZ7BEJO9I7TIycsxzc6EMj59AMSGwNMasXHH3BrZMeDhHOMk2+YbX3Sc5OsToUzoh+WW775MrTBL644N6tnjxg/GDAcF+wVLpfBCwmj3NDCMoe7KxFACjFWgcPvnhUCIRXhBu3UQkp6RSfaY6/hRzo9X8YR15NOnT8YhMGM2OInLmM4rLdfM+fmwV8l1RZf5qxNRGUodK4P2DDfmD8cJrIRILRFxXT6AP1ts9RG220USosqK2SpNLYSkIrr+JDXLrQa4PirhAWRB7VkQlQQCkTvo64i0LY9STUzDsA7CsP5iaxwUMtNQKySDiadZGl5sXttZzLJ0mlRTdHO0PaUZwOomX9JecprkQmswlu+u2UY7FySRKcH1nlVRLJzSGT6TMNOiAJ6xIF6fg3YNOtrcwJ9q40JBe5w5uSXdRqk4UgfrcIaGm4Le1xC1z6UCeW83GdYJOS0lAAAh+QQBAQAHACwAAAAATABKAEAD/li63P6PyEKgvTjrGID/YCgCQrVBwziYp0UMQjfOn4ARAh2WbU/pIkcOCBj4jg0ZkaXUsZBHAhEQaBCatMATihlgZ9rLdboz9nDfJdRLbrcDZm50AIt1AgGBXr+S+31SbXp/KFtnQ240cRpjQHmGfiluiwuNQDyEGWkjT2SZLZZZLIFqnzdkkJJkNqZsZJQuiImzb5BcL3i0jnCmhKoiHQJ9vb2hgrDEPZuJyCeucLYZXrnLq9EOxiB5xdUz1zhkvMS/pQ3kNJjJCtlgVlNV6hGrDN1U18nnMwye8RZT6bLQ9XsQcAarBfXsDVTg6tKDfAbvQQGH6gJERRIzsNPR/gxbQUHCJlCQQCeGLhIZPZ5cCWyYL5aJ0g3EtRJPyIVr7uDJEzIlTmnvoP080rCNy6GndD1CKiahDnFMhcD00FEDm6oZPp7EGkEWVEAjX9hR2qIoiKN+0Mw6aJGIzJdu4Fm4KIJtJlL/XAjy6cNkXmwJw/SjGwKW1hCCBxL+kPjHFK6fDhdmsJgK08D0HjOtnJgf0o0h9k2JCpoxkyl8M71jIfkD5FZ/GSZMLae06yT/aENp/cGB2YgLeVNVmbuf07frhHtA/qdy71iTdEdw7qFx10TWe/x2dMJvzBX3xOqyq9FpOPOikCifqlnOdvbvXm+wDX9yMrX1gYmcOQ2+EdCoDKCRCxHBoAXgCRLsl0wCACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/jDKSSkRIOsNQm0EJwrEF2FiygXkdwVqnA1ldMlba+7KjWcCB+w34Bkfgx8g2BviiseoIqmsNZUBqLQycD4lBC82YHW9lJwyr4tut7NbKYEwGAgC+A5eIKhr44AFdE5MR0NZaoFTYjhkJihtfxaMMXCKBXdviQpohZcSkDIeC2E/jp8fWFZURKgTbK0OrEqSgbONnq+UbrymtYB8vZ2/rhBzW5vFDqUpyROhGn3FsLEuuyu5PMy8oxS3bc7L0KbHUWHXKafG6BuWrtSNm98q2crjKpLzIurKIPcif9h1INZPkMBuIWgVhKBPhBWBHcK52iaqAUR+BeFVStT+EKDELR05ECwQcsRHC/9ijGTgQxgLEnNi0rEDkd5JJMJW5BT5ic7OXogWsjyTE0afm0KTLqSDAamsoEpJacT44RbUfkRT1JtAkYOOTxpVOMVUJZBPTSYSolnJVRjbK27cpU354yRdGV+91dTAYqygTHHflmyX1xzgta/cvNWmOMJgIH5dPAbwq2uMyIyx1LqrAfORtWUsN4sqCE2ZwVsLcl5CarVnOarginptDiIp06Rly7itMPfjGqL35SarhMFqALQz//CkFkdh1YiNd1J6vF715GBqbm1ZDdXkbg+4dwc0OSKFvUAWMzzO9+RZbleNkWTPc0dwbnrQq6BaVf8tz/FHhPUfN+pVkNWAnWC3Dnr+waQUUwhmgAcNw7E0Hx5iULIHhRXaJ4hMQiUAACH5BAEBAAcALAAAAABMAEoAQAP+WLrc/jDKSSkJIOvNcyCVQ2gCGEJDp3aBMJhnca2qQAk0Z8e8jOckBzDYKzJSw50MM4QZi0hgoDEbApzPSVSKbQyYVk+pR/iFPYNn9cyWprNGAmEwEAgC+Hygnu7C1V85Sn+EW20ZbydmKokhYEN7fkVzj1wPhjSDhBJzYQwjVo2bFpUqUwuBTaMVmKaiCq00r3+pVqcVoIe6YXurMl+luxyRvjFzdxuzxWprQGNxy7VtkhLSAC1ZzbvKD2WQ1CLBNHhyauLj4No53HDW6A+LgsvwYaLxNODL9Qu5QOzz/TKZCIhv3gRbMO7VMBhBYYdG3qzkGxWrgyZYZ14YdLj+MEJFU8+ycVxxEUJEXS3oyFkpp865JBNRCJvJKKailzSHaWT4yR0bPC54kjkWUighSsH+GbXgc9hSI8h4PUlR9Ki6b2QWfdjUNBSPqwCUVstZMgJBnWRw5khZLsTHDbdYqR1WNcZIFkrltKlbJOq+sRmLveXAbTCReXeTXZp7RejZFV14iT06V5PhsE9lhHGSOENmBZ2VgNXxWTNW06pKq92KGojNVaM38Js7GbbakKFLG47bVQPrpbE1iJobl2dwD1h6H+bJ+NVJSwaPI4fAuFc0NuAYZyg76bLwG20+vBbRmYNNv2da8P1UoM4u7ia1r82T89r4I/Lrj6vtMb8nft/8WVDefwCsd9SAu+ARIBx3+Lfffb60ZMc1vNgBYWkyZKghQwkAADs=")
                    background-repeat: no-repeat;
                    padding-left: 35px;
                    background-position: 10px 50%;
                }
            `,
            ];
        }
        render() {
            let e = this._i18n;
            return we`
            <link rel="stylesheet" href="${d(zn)}" />
            <div class="select">
                <div class="field has-addons">
                    <div class="select2-control control">
                        <!-- https://select2.org-->
                        <select
                            id="${this.selectId}"
                            name="person"
                            class="select"
                            ?disabled=${!this.active || this.disabled}>
                            ${
                                this.authenticated()
                                    ? ``
                                    : we`
                                      <option value="" disabled selected>
                                          ${e.t(`person-select.login-required`)}
                                      </option>
                                  `
                            }
                        </select>
                    </div>
                    <a
                        class="control button"
                        id="reload-button"
                        ?disabled=${this.object === null}
                        @click="${this.reloadClick}"
                        style="display: ${this.showReloadButton ? `flex` : `none`}"
                        title="${this.reloadButtonTitle}">
                        <dbp-icon name="reload"></dbp-icon>
                    </a>
                </div>
                <div id="person-select-dropdown"></div>
            </div>
        `;
        }
    };
export {
    l as _,
    Nn as a,
    dt as c,
    et as d,
    $e as f,
    T as g,
    we as h,
    Pn as i,
    ot as l,
    Ue as m,
    Rn as n,
    Mn as o,
    Qe as p,
    Fn as r,
    un as s,
    Un as t,
    it as u,
};
//# sourceMappingURL=country-select.DDIhTD_g.js.map
