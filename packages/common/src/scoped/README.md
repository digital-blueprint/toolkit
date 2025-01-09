This is a copy of https://github.com/ing-bank/lion/blob/master/packages/ui/components/core/src/ScopedElementsMixin.js
which is a adapted version of https://www.npmjs.com/package/@open-wc/scoped-elements / https://open-wc.org/docs/development/scoped-elements/

Current version included here:
https://github.com/ing-bank/lion/blob/fef94cd01607d41ddaa43ca95d2227da6e32e726/packages/ui/components/core/src/ScopedElementsMixin.js

License: MIT

Reason for vendoring it: Same as https://github.com/ing-bank/lion/pull/2168
scoped-elements in v3 made the decision to require the polyfill, while previous
versions would fall back to non-scoped behaviour if the polyfill wasn't there.
We want to keep the old behaviour, so we're vendoring the wrapper from lion, to
keep the old API/behaviour while still upgrading to v3.
