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
        classitem: 1585787867,
        vault: 138197802
    }
};

let fetch_options = {};
let user = {};

const init = async () => {
    let authorize = await fetch(`${baseURL}/authorize/${auth_code}`);
    if(authorize.ok){
        authorize = await authorize.json();
        user.member_type = authorize.member_type;
        user.member_id = authorize.member_id;
        fetch_options = {
            headers:{
                Authorization: 'Bearer ' + authorize.access_token
            }
        }
        console.log('login success');
        let char_info = await fetch(`${baseURL}/getProfile/${user.member_type}/${user.member_id}/Characters`, fetch_options);
        char_info = await char_info.json();
        char_info = char_info.characters.data;
        char_elem = document.querySelectorAll('.character');
        for(let i = 0; i < 3; i++){
            let curr_id = Object.keys(char_info)[i];
            char_elem[i].setAttribute('data-char_id', curr_id);
            char_elem[i].style.backgroundImage = `url(${imageURL + char_info[curr_id].emblemBackgroundPath})`;
            char_elem[i].innerHTML = bungieEnum.classType[char_info[curr_id].classType];
            char_elem[i].onclick = show_char_items;
        }
        document.querySelector('.vault-tab').onclick = show_vault_items;
        let s = '';
        for(let i = 0; i < 500; i++){
            s += '<div></div>';
        }
        document.querySelector('.vault article').innerHTML = s;
        await get_vault_items();

        document.querySelector('.search button').onclick = search_items;

        stop_load();
    }
    else{
        console.log('login failed');
        window.location.href = "./login.html";
    }
};
init();

const stop_load = () => {
    document.querySelector('.sidebar').style.display = "block";
    document.querySelector('.loadouts').style.display = "block";
    document.querySelector('.loading').style.display = "none";
};

const search_items = () => {
    const query = document.querySelector('.search input').value.toLowerCase();
    const results = document.querySelector('.sidebar section');
    results.innerHTML = '';
    let elems = Array.from(document.querySelectorAll('.vault article div'));
    elems.filter(elem => elem.dataset.item_name && elem.dataset.item_name.includes(query)).forEach(elem => {
        results.appendChild(elem.cloneNode());
    });
};

const show_inventory = () => {
    document.querySelector('.inventory').style.display = "block";
    document.querySelector('.vault').style.display = "none";
};

const show_vault = () => {
    document.querySelector('.vault').style.display = "block";
    document.querySelector('.inventory').style.display = "none";
};

const reset_inventory = () => {
    document.querySelectorAll('.inventory div').forEach(elem => {
        elem.setAttribute('data-instance_id', -1);
        elem.style.backgroundImage = '';
    })
};

const equip_item = ev => {

};

const show_char_items = ev => {
    reset_inventory();
    show_inventory();
    get_char_inventory(ev);
    get_char_equipped(ev);
};

const show_vault_items = ev => {
    show_vault();
};

const set_item_elem = async (item, elem) => {
    let item_info = await fetch(`${baseURL}/itemlookup/${item.itemHash}`, fetch_options);
    item_info = await item_info.json();
    elem.setAttribute('data-instance_id', item.itemInstanceId);
    elem.setAttribute('data-item_name', item_info.name.toLowerCase());
    elem.style.backgroundImage = `url(${imageURL + item_info.icon})`;
};

const get_vault_items = async () => {
    let vault_items = await fetch(`${baseURL}/getProfile/${user.member_type}/${user.member_id}/ProfileInventories`, fetch_options);
    vault_items = await vault_items.json();
    vault_items = vault_items.profileInventory.data.items.filter(item => item.bucketHash == bungieEnum.bucket.vault);
    vault_items = vault_items.sort((a, b) => (a.itemHash > b.itemHash) ? 1 : -1);

    const elems = document.querySelectorAll('.vault article div');
    let i = 0;
    vault_items.forEach(item => {
        set_item_elem(item, elems[i]);
        i++;
    });
};

const get_char_equipped = async (ev) => {
    let char_equipped = await fetch(`${baseURL}/getProfile/${user.member_type}/${user.member_id}/CharacterEquipment`, fetch_options);
    char_equipped = await char_equipped.json();
    char_equipped = char_equipped.characterEquipment.data[ev.target.dataset.char_id].items;

    char_equipped.forEach(item => {
        switch(item.bucketHash){
            case bungieEnum.bucket.kinetic:
                set_item_elem(item, document.querySelector('.kinetic div'));
                break;
            case bungieEnum.bucket.energy:
                set_item_elem(item, document.querySelector('.energy div'));
                break;
            case bungieEnum.bucket.power:
                set_item_elem(item, document.querySelector('.power div'));
                break;
            case bungieEnum.bucket.head:
                set_item_elem(item, document.querySelector('.head div'));
                break;
            case bungieEnum.bucket.arms:
                set_item_elem(item, document.querySelector('.arms div'));
                break;
            case bungieEnum.bucket.chest:
                set_item_elem(item, document.querySelector('.chest div'));
                break;
            case bungieEnum.bucket.legs:
                set_item_elem(item, document.querySelector('.legs div'));
                break;
            case bungieEnum.bucket.classitem:
                set_item_elem(item, document.querySelector('.classitem div'));
                break;
    }
    });
};

const get_char_inventory = async (ev) => {
    let char_inventory = await fetch(`${baseURL}/getProfile/${user.member_type}/${user.member_id}/CharacterInventories`, fetch_options);
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
};