const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');

const OAuth = {
    client_id: '36633',
    client_secret: 'wtb8SXXP-uTQY3xLDhQw3vML-6hjxd881X3sCiRQGYE',
    token_body: {
        "grant_type": "authorization_code",
        "code": auth_code
    }
}

fetch(`https://www.bungie.net/Platform/App/OAuth/Token?grant_type=authorization_code&code=${auth_code}`, { 
        method: 'POST',
        headers: {
            "Authorization": `Basic ${btoa(`${OAuth.client_id}:${OAuth.client_secret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify(OAuth.token_body)
    })
    .then(res => {
        console.log(res);
    });