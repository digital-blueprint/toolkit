## Login notification Web Component

You can use this web component to show a login notification.
`dbp-login-required-warning` web component informs users that they must log in before they can use an application.

It replaces duplicated login-required-warning markup in individual applications and provides one consistent implementation for:

- Displaying the login-required-warning message
- Hiding the message while authentication or translations are loading
- Hiding the message after the user has logged in
- Translating the message and login-link text
- Notifying the consuming application when login is requested
- Applying the app-shell notification styles

The component does not perform authentication itself.

```javascript
import {DBPLoginRequiredWarning} from '@dbp-toolkit/common';

class Nameclass extends DBPLitElement {
    static get scopedElements() {
        return {
            'dbp-login-required-warning': DBPLoginRequiredWarning,
        };
    }

    render() {
        return html`
            <dbp-login-required-warning
                subscribe="auth,lang"
                @dbp-login-requested=${this._onLoginClicked}></dbp-login-required-warning>
        `;
    }
}
```

The component replaces inline markup such as:

```javascript
html`
    <div
        class="notification is-warning ${classMap({
            hidden: this.isLoggedIn() || this.isAuthPending() || this.loadingTranslations,
        })}">
        ${i18n.t('error-login-message')}
        <a href="#" @click=${this._onLoginClicked}>${i18n.t('error-login-link')}</a>
    </div>
`;
```

with:

```javascript
html`
    <dbp-login-required-warning
        subscribe="auth,lang"
        @dbp-login-requested=${this._onLoginClicked}></dbp-login-required-warning>
`;
```

This keeps login-required-warning behavior, styling, and translations in the app shell instead of duplicating them in every application.

### Attributes

| HTML attribute | JavaScript property |      Type |               Default | Description                                                     |
| -------------- | ------------------- | --------: | --------------------: | --------------------------------------------------------------- |
| `lang`         | `lang`              |  `string` | Current i18n language | Language used for the translated message.                       |
| `logged-in`    | `loggedIn`          | `boolean` |               `false` | Hides the warning when the user is logged in.                   |
| `auth-pending` | `authPending`       | `boolean` |               `false` | Hides the warning while authentication state is being resolved. |

An existing login handler can be reused directly:

```javascript
html`
    <dbp-login-required-warning
        @dbp-login-requested=${this._onLoginClicked}></dbp-login-required-warning>
`;
```

Internationalization

The component uses the app shell’s i18n configuration to translate both the warning message and login link.

Required translation keys

The following translation keys must be available:

- `error-login-message`
- `error-login-link`

### Styling

The component uses the app shell styles:

```javascript
static get styles() {
    return [
commonStyles.getThemeCSS(),
commonStyles.getGeneralCSS(),
commonStyles.getNotificationCSS(),
    ];
}
```

The rendered notification uses the standard warning classes:

```html
<div class="notification is-warning">...</div>
```

This ensures that the component matches other app-shell warnings and notifications.

### Customizing the component

After the custom properties are implemented, an application can configure them on the host element:

```css
dbp-login-required-warning {
    --dbp-login-required-warning-padding: 1.25rem;
    --dbp-login-required-warning-border-radius: 0.25rem;
    --dbp-login-required-warning-font-size: 1rem;
}
```

They can also be configured inline:

```javascript
html`
    <dbp-login-required-warning
        style="
            --dbp-login-required-warning-padding: 1.25rem;
            --dbp-login-required-warning-border-radius: 0.25rem;
        "></dbp-login-required-warning>
`;
```

Global application-level defaults can be set on :root:

```css
:root {
    --dbp-login-required-warning-padding: 1.25rem;
    --dbp-login-required-warning-border-radius: 0.25rem;
}
```

### Accessibility

Use `role="alert"` for the login-required-warning message;

```html
<div class="notification is-warning" role="alert">...</div>
```
