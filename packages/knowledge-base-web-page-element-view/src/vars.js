
switch(process.env.BUILD) {
    case "development":
        module.exports = {
            apiBaseUrl: 'https://mw-dev.tugraz.at',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-dev-mw-frontend',
        };

        break;
    case "production":
        module.exports = {
            apiBaseUrl: 'https://mw.tugraz.at',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-prod-mw-frontend',
        };
        break;
    case "demo":
        module.exports = {
            apiBaseUrl: 'https://api-demo.tugraz.at',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-dev-mw-frontend',
        };
        break;
    case "local":
    default:
        module.exports = {
            apiBaseUrl: 'http://127.0.0.1:8000',
            apiUrlPrefix: '',
            keyCloakClientId: 'auth-dev-mw-frontend-local',
        };
}
