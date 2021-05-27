const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');
const baseURL = 'http://localhost:8081';
const imageURL = 'http://bungie.net';

const init = async () => {
    let authorize = await fetch(`${baseURL}/authorize/${auth_code}`);
    if(authorize.ok){
        console.log('login success');
        let char_info = await fetch(`${baseURL}/getProfile/Characters`);
        char_info = await char_info.json();
        console.log(char_info);
    }
    else{
        console.log('login failed');
    }
}
init();