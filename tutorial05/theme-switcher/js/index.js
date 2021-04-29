const defaultTheme = () => {
   document.body.className = "";
};

const oceanTheme = () => {
   document.body.className = "ocean";
};

const desertTheme = () => {
   document.body.className = "desert";
};

document.querySelector('#default').onclick = defaultTheme;
document.querySelector('#ocean').onclick = oceanTheme;
document.querySelector('#desert').onclick = desertTheme;

