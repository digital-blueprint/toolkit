import environment from 'consts:environment';

export const getAPiUrl = (path = "") => {
    let apiBaseUrl = '';

    switch(environment) {
        case "development":
            apiBaseUrl = 'https://mw-dev.tugraz.at';
            break;
        case "demo":
            apiBaseUrl = 'https://api-demo.tugraz.at';
            break;
        case "production":
            apiBaseUrl = 'https://api.tugraz.at';
            break;
        case "bs":
            apiBaseUrl = 'http://bs-local.com:8000';
            break;
        case "local":
        default:
            apiBaseUrl = 'http://127.0.0.1:8000';
    }

    return apiBaseUrl + path;
};
