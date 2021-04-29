const content = document.querySelector('.content');

const makeBigger = () => {
   const curr_size = window.getComputedStyle(content, null).getPropertyValue('font-size');
   content.style.fontSize = parseInt(curr_size.replace("px", "")) + 3 + "px";
};

const makeSmaller = () => {
   const curr_size = window.getComputedStyle(content, null).getPropertyValue('font-size');
   let int_size = parseInt(curr_size.replace("px", "")) - 3;
   int_size = int_size < 0 ? 0 : int_size;
   content.style.fontSize =  int_size + "px";
};

document.querySelector('.a1').onclick = makeBigger;
document.querySelector('.a2').onclick = makeSmaller;

