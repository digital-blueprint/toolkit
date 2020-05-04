import environment from 'consts:environment';

var config;

switch(environment) {
    case "development":
        config = {
            apiBaseUrl: 'https://mw-dev.tugraz.at',
            keyCloakBaseURL: 'https://auth-dev.tugraz.at/auth',
            keyCloakRealm: 'tugraz',
            keyCloakClientId: 'auth-dev-mw-frontend',
            //sentryDSN: 'http://0405d811e8d746cca2e70f6eff764570@129.27.166.25:9000/2',
        };

        break;
    case "demo":
        config = {
            apiBaseUrl: 'https://api-demo.tugraz.at',
            keyCloakBaseURL: 'https://auth-test.tugraz.at/auth',
            keyCloakRealm: 'tugraz',
            keyCloakClientId: 'ibib-demo_tugraz_at-IBIB',
        };
        break;
    case "production":
        config = {
            apiBaseUrl: 'https://api.tugraz.at',
            keyCloakBaseURL: 'https://auth.tugraz.at/auth',
            keyCloakRealm: 'tugraz',
            keyCloakClientId: 'ibib_tugraz_at-IBIB',
        };
        break;
    case "local":
    default:
        config = {
            apiBaseUrl: 'http://127.0.0.1:8000',
            keyCloakBaseURL: 'https://auth-dev.tugraz.at/auth',
            keyCloakRealm: 'tugraz',
            keyCloakClientId: 'auth-dev-mw-frontend-local',
        };
}


export default config;