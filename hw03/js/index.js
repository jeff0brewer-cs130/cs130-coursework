/**
 * 
 * -------------------------------------
 * DOM Manipulation / Traversal Activity
 * -------------------------------------
 * 
 * 1. Create and attach an event handler (function) to each ".image" 
 * element so that when the ".image" element is clicked, the corresponding 
 * image loads in the .featured image element.
 * 
 * 2. Create event handlers for the next and previous buttons. The next button should
 *    show the next image in the thumbnail list. The previous should show the previous.
 * 
 * 3. If you get to the end, start at the beginning. 
 * 
 * 4. If you get to the beginning, loop around to the end.
 * 
 * 
 */

const images = [
    'images/field1.jpg',
    'images/purple.jpg',
    'images/jar.jpg',
    'images/green.jpg',
    'images/green1.jpg',
    'images/purple1.jpg',
    'images/magnolias.jpg',
    'images/daisy1.jpg'
];

const initScreen = () => {
    images.forEach((image, idx) => {
        document.querySelector('.cards').innerHTML += `
            <li class="card">
                <div class="image" 
                    style="background-image:url('${image}')"
                    data-index=${idx}"></div>
            </li>`;
    });
};

let sel_ind = 0;
const update_featured = () => {
    document.querySelector(".featured_image").style.backgroundImage = "url('" + images[sel_ind] + "')";
};

const thumbnail_click = ev => {
    sel_ind = parseInt(ev.currentTarget.dataset.index);
    update_featured();
};

const feature_next = ev => {
    sel_ind = sel_ind + 1 < images.length ? sel_ind + 1 : 0;
    update_featured();
};
document.querySelector(".featured_image").onclick = feature_next;
document.querySelector(".next").onclick = feature_next;

document.querySelector(".prev").onclick = ev => {
    sel_ind = sel_ind - 1 >= 0 ? sel_ind - 1 : images.length - 1;
    update_featured();
};

initScreen();
document.querySelectorAll(".image").forEach(elem => {
    elem.onclick = thumbnail_click;
});