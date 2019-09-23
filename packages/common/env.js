import environment from 'consts:environment';

var config;

switch(environment) {
    case "development":
        config = {
            apiBaseUrl: 'https://mw-dev.tugraz.at',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-dev-mw-frontend',
            //sentryDSN: 'http://0405d811e8d746cca2e70f6eff764570@129.27.166.25:9000/2',
        };

        break;
    case "production":
        config = {
            apiBaseUrl: 'https://mw.tugraz.at',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-prod-mw-frontend',
        };
        break;
    case "demo":
        config = {
            apiBaseUrl: 'https://api-demo.tugraz.at',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-dev-mw-frontend',
        };
        break;
    case "local":
    default:
        config = {
            apiBaseUrl: 'http://127.0.0.1:8000',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-dev-mw-frontend-local',
        };
}


export default config;