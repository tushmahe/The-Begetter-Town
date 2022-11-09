console.log("header")

const currentLocation = location.href;
const menuItem = document.getElementsByClassName("nav-link");
const xyz = document.getElementsByClassName("nav-item");
const menuLength = menuItem.length
for (let i = 0 ;  i<menuLength; i++ ){
    if(menuItem[i].href === currentLocation){
        xyz[i].className += " active"
    }
}