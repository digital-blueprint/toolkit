class LoggerType {
    get debug() {
        if (window.location.hash.includes('debug')) {
            return console.debug;
        } else {
            return () => {};
        }
    }
}

export const Logger = new LoggerType();
