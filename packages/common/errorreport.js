import * as Sentry from '@sentry/browser';
import env from './env.js';
import environment from 'consts:environment';

/**
 * Initializes error reporting.
 * 
 * If a sentry DSN is set we will use sentry, if not we will log to the console.
 * 
 * @param {Boolean} [options.debug=false] Enable debug output
 * @param {String} [options.release] The project release
 */
export function init(options) {
  let defaults = {
    debug: false,
  };
  let actual = Object.assign({}, defaults, options);

  let sentryOptions = {debug: actual.debug, environment: environment};

  if (actual.release) {
    sentryOptions['release'] = actual.release;
  }

  if (!env.sentryDSN) {
    if (options.debug)
      console.log("No sentry DSN set, sentry disabled");

    // In case we don't have a sentry config, we still use sentry, but print
    // all events into the console don't send them to the server.
    // XXX: Dummy DSN needed to make init() work.
    sentryOptions['dsn'] = 'http://12345@dummy.dummy/42';
    sentryOptions['beforeSend'] = (event, hint) => {
      console.error('ERR-REPORT:', hint.originalException || hint.syntheticException);
      return null;
    };
  } else {
    sentryOptions['dsn'] = env.sentryDSN;
  }

  Sentry.init(sentryOptions);
}

/**
 * Log an exception
 *
 * @param {*} exception
 */
export function captureException(exception) {
  Sentry.captureException(exception);
}

/**
 * Log a message, returns an internal ID
 *
 * @param {String} message The message to log
 * @param {String} [level=error] The loglevel (error, warning, info, debug)
 */
export function captureMessage(message, level) {
  if (!level)
    level = 'error';
  if (!['error', 'warning', 'info', 'debug'].includes(level))
    throw new Error('Invalid log level');
  Sentry.captureMessage(message, level);
}