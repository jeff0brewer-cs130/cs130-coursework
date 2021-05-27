const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');

fetch(`https://www.bungie.net/Platform/App/OAuth/Token?grant_type=authorization_code&code=${auth_code}`, { method: 'POST' })
    .then(res => {
        console.log(res);
    });