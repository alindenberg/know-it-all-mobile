import Auth0 from 'react-native-auth0';
import base64 from 'base-64'
import AsyncStorage from '@react-native-community/async-storage'
async function _onLogin() {
    var auth0 = new Auth0({ domain: 'dev-b36cotoe.auth0.com', clientId: 'tiVh3DouTapxG785vcApzzEJHlj8T92s' });
    await auth0.webAuth
        .authorize({
            scope: 'openid email',
            audience: 'http://localhost:8080',
            prompt: 'login',
        })
        .then((credentials) => {
            AsyncStorage.setItem('accessToken', credentials.accessToken);
            AsyncStorage.setItem('idToken', credentials.idToken);
            var idToken = JSON.parse(base64.decode(credentials.idToken.split(".")[1]))
            fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    authorization: credentials.accessToken
                },
                body: JSON.stringify({userid: idToken.sub, email: idToken.email})
            }).catch((err) => {
                console.log("Create user err: ", err)
            })
        })
        .catch(error => console.log(error));
};

async function _onLogout() {
    await AsyncStorage.removeItem('accessToken')
}

async function _onPasswordChange() {
    var idToken = await AsyncStorage.getItem('idToken')
    var email = JSON.parse(base64.decode(idToken.split('.')[1])).email
    await fetch("https://dev-b36cotoe.auth0.com/dbconnections/change_password", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body:
            JSON.stringify({
                client_id: 'tiVh3DouTapxG785vcApzzEJHlj8T92s',
                email: email,
                connection: 'Username-Password-Authentication'
            })
    }).catch(err => {
        console.log("ERROR WHEN FETCHING ", err)
    })
}

export {
    _onLogin,
    _onLogout,
    _onPasswordChange
}