const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');

fetch(`http://localhost:8081/authorize/${auth_code}`)
    .then(res => {
        console.log(res);
    });