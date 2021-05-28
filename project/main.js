const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');
const baseURL = 'http://localhost:8081';
const imageURL = 'https://bungie.net';

const bungieEnum = {
    classType: ["Titan", "Hunter", "Warlock"],
    bucket: {
        kinetic: 1498876634,
        energy: 2465295065,
        power: 953998645,
        head: 3448274439,
        arms: 3551918588,
        chest: 14239492,
        legs: 20886954,
        classitem: 158578786
    }
};

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
        // window.location.href = "./login.html";
    }
};
init();

const reset_inventory = () => {
    document.querySelectorAll('.inventory div').forEach(elem => {
        elem.setAttribute('data-instance_id', -1);
        elem.style.backgroundImage = '';
    })
};

const set_item_elem = async (item, elem) => {
    let item_info = await fetch(`${baseURL}/itemlookup/${item.itemHash}`);
    item_info = await item_info.json();
    elem.setAttribute('data-instance_id', item.itemInstanceId);
    elem.style.backgroundImage = `url(${imageURL + item_info.icon})`;
};

const get_char_inventory = async (ev) => {
    reset_inventory();
    let char_inventory = await fetch(`${baseURL}/getProfile/CharacterInventories,ItemInstances`);
    char_inventory = await char_inventory.json();
    char_inventory = char_inventory.characterInventories.data[ev.target.dataset.char_id].items;
    let inv_index = {
        kinetic: 0,
        energy: 0,
        power: 0,
        head: 0,
        arms: 0,
        chest: 0,
        legs: 0,
        classitem: 0
    };
    let elem = null;
    char_inventory.forEach(item => {
        switch(item.bucketHash){
            case bungieEnum.bucket.kinetic:
                elem = document.querySelectorAll('.kinetic')[1].querySelectorAll('div')[inv_index.kinetic];
                inv_index.kinetic++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.energy:
                elem = document.querySelectorAll('.energy')[1].querySelectorAll('div')[inv_index.energy];
                inv_index.energy++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.power:
                elem = document.querySelectorAll('.power')[1].querySelectorAll('div')[inv_index.power];
                inv_index.power++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.head:
                elem = document.querySelectorAll('.head')[1].querySelectorAll('div')[inv_index.head];
                inv_index.head++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.arms:
                elem = document.querySelectorAll('.arms')[1].querySelectorAll('div')[inv_index.arms];
                inv_index.arms++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.chest:
                elem = document.querySelectorAll('.chest')[1].querySelectorAll('div')[inv_index.chest];
                inv_index.chest++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.legs:
                elem = document.querySelectorAll('.legs')[1].querySelectorAll('div')[inv_index.legs];
                inv_index.legs++;
                set_item_elem(item, elem);
                break;
            case bungieEnum.bucket.classitem:
                elem = document.querySelectorAll('.classitem')[1].querySelectorAll('div')[inv_index.classitem];
                inv_index.classitem++;
                set_item_elem(item, elem);
                break;
        }
    });
    console.log(char_inventory);
};