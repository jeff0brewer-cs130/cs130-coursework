const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');
const baseURL = 'http://localhost:8081';
const imageURL = 'http://bungie.net';

let user = {
    char_ids: []
};

const init = async () => {
    let authorize = await fetch(`${baseURL}/authorize/${auth_code}`);
    if(authorize.ok){
        console.log('login success');
        let char_info = await fetch(`${baseURL}/getProfile/Characters`);
        char_info = await char_info.json();
        char_info = char_info.characters.data;
        console.log(char_info);
        char_elem = document.querySelectorAll('.character');
        for(let i = 0; i < 3; i++){
            let curr_id = Object.keys(char_info)[i];
            user.char_ids.push(curr_id);
            char_elem[i].style.backgroundImage = `url(${imageURL + char_info[curr_id].emblemBackgroundPath})`;
            console.log(char_elem[i].style.backgroundImage);
        }
    }
    else{
        console.log('login failed');
    }
}
init();