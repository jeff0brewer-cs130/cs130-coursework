const url_search = new URLSearchParams(window.location.search);
const auth_code = url_search.get('code');
const baseURL = 'http://localhost:8081';
const imageURL = 'https://bungie.net';

const bungieEnum = {
    classType: ["Titan", "Hunter", "Warlock"],
    bucket: {
        vault: 138197802,
        dict: {
            1498876634: 'kinetic',
            2465295065: 'energy',
            953998645: 'power',
            3448274439: 'head',
            3551918588: 'arms',
            14239492: 'chest',
            20886954: 'legs',
            1585787867: 'classitem'
        }
    }
};

const equip_menu = document.querySelector('.equip');
let curr_item = null;

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
        let char_elem = document.querySelectorAll('.character');
        let equip_elem = document.querySelectorAll('.equip_char');
        for(let i = 0; i < 3; i++){
            const curr_id = Object.keys(char_info)[i];
            const emblem = `url(${imageURL + char_info[curr_id].emblemBackgroundPath})`;
            const char_class = bungieEnum.classType[char_info[curr_id].classType];

            char_elem[i].setAttribute('data-char_id', curr_id);
            char_elem[i].style.backgroundImage = emblem;
            char_elem[i].innerHTML = char_class;
            char_elem[i].onclick = show_char_items;

            equip_elem[i].setAttribute('data-char_id', curr_id);
            equip_elem[i].style.backgroundImage = emblem;
            equip_elem[i].innerHTML = char_class;
        }
        document.querySelector('.vault-tab').onclick = show_vault_items;
        let s = '';
        for(let i = 0; i < 500; i++){
            s += '<div></div>';
        }
        document.querySelector('.vault article').innerHTML = s;
        await get_vault_items();

        document.querySelector('.search button').onclick = search_items;
    }
    else{
        console.log('login failed');
        window.location.href = "./login.html";
    }
};
init();

const swap_nodes = (a, b) => {
    const parentA = a.parentNode;
    const parentB = b.parentNode;
    parentA.insertBefore(b.cloneNode(), parentA.firstChild);
    parentB.insertBefore(a.cloneNode(), parentB.firstChild);
    a.remove();
    b.remove();
};

const set_item_elem = async (item, elem) => {
    let item_info = await fetch(`${baseURL}/itemlookup/${item.itemHash}`, fetch_options);
    item_info = await item_info.json();
    elem.setAttribute('data-item_hash', item.itemHash);
    elem.setAttribute('data-instance_id', item.itemInstanceId);
    elem.setAttribute('data-bucket', bungieEnum.bucket.dict[item.bucketHash]);
    elem.setAttribute('data-item_name', item_info.name.toLowerCase());
    elem.style.backgroundImage = `url(${imageURL + item_info.icon})`;
    elem.onclick = start_move;
};

const start_move = ev => {
    equip_menu.replaceChild(ev.target.cloneNode(), equip_menu.querySelector('div'));
    equip_menu.style.display = 'block';
    curr_item = ev.target;
};

const equip_item = async ev => {
    const item_id = curr_item.dataset.instance_id;
    const char_id = ev.target.dataset.char_id;
    let res = await fetch(`${baseURL}/equipitem/${item_id}/${char_id}/${user.member_type}`, fetch_options);
    equip_menu.style.display = 'none';
    
    const equipped_item = document.querySelector(`.equipped .${curr_item.dataset.bucket}`);
    swap_nodes(curr_item, equipped_item);
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

const show_char_items = async ev => {
    const equip_buttons = equip_menu.querySelectorAll('.equip_char');
    const char_buttons = document.querySelectorAll('.character');

    for(let i = 0; i < equip_buttons.length; i++){
        if(equip_buttons[i].dataset.char_id == ev.target.dataset.char_id){
            equip_buttons[i].onclick = equip_item;
            equip_buttons[i].innerHTML = 'Equip';
        }
        else{
            equip_buttons[i].onclick = null;
            equip_buttons[i].innerHTML = char_buttons[i].innerHTML;
        }
    }
    reset_inventory();
    show_inventory();
    get_char_equipped(ev);
    get_char_inventory(ev);
};

const show_vault_items = ev => {
    show_vault();
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
        set_item_elem(item, document.querySelector(`.${bungieEnum.bucket.dict[item.bucketHash]} div`));
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
        const bucket = bungieEnum.bucket.dict[item.bucketHash];
        let elem = document.querySelectorAll(`.${bucket}`)[1].querySelectorAll('div')[inv_index[bucket]];
        inv_index[bucket]++;
        set_item_elem(item, elem);
    });
};