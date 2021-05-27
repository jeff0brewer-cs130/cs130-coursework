const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');
const baseURL = 'http://localhost:8081';
const imageURL = 'https://bungie.net';

const bungieEnum = {
    classType: ["Titan", "Hunter", "Warlock"]
}

const init = async () => {
    let authorize = await fetch(`${baseURL}/authorize/${auth_code}`);
    if(authorize.ok){
        console.log('login success');
        let char_info = await fetch(`${baseURL}/getProfile/Characters`);
        char_info = await char_info.json();
        char_info = char_info.characters.data;
        char_elem = document.querySelectorAll('.character');
        for(let i = 0; i < 3; i++){
            let curr_id = Object.keys(char_info)[i];
            char_elem[i].setAttribute('data-char_id', curr_id);
            char_elem[i].style.backgroundImage = `url(${imageURL + char_info[curr_id].emblemBackgroundPath})`;
            char_elem[i].innerHTML = bungieEnum.classType[char_info[curr_id].classType];
            char_elem[i].onclick = get_char_inventory;
        }
    }
    else{
        console.log('login failed');
        window.location.href = "./login.html";
    }
};
init();

const get_char_inventory = async (ev) => {
    let char_inventory = await fetch(`${baseURL}/getProfile/CharacterInventories`);
    char_inventory = await char_inventory.json();
    let char_id = ev.target.dataset.char_id;
    console.log(char_inventory);
    console.log(char_id);
};