const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');
console.log(auth_code);