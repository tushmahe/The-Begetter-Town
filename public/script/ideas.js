
// Add Idea pop up
let text1 = document.getElementById("title").innerText;
let text2 = document.getElementById("text").innerText;
function openForm() {
    const overlayItem = document.createElement('div');
    overlayItem.classList.add('overlay');

    document.getElementById("myForm").style.display = "block";
    document.querySelector('body').appendChild(overlayItem);
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
    document.querySelector('.overlay').remove();
  }

// Read- More POP-UP
document.querySelector('.pop-up-button').addEventListener('click',function(){
  const popUp = document.createElement('div');
  popUp.classList.add('pop-up');

  const popUpcross = document.createElement('button');
  popUpcross.innerHTML = 'X';
  popUpcross.classList.add('pop-up-cross');

  const popUpHeader = document.createElement('span');
  popUpHeader.textContent = text1;
  popUpHeader.classList.add('pop-up-header');

  const popUpcontent = document.createElement('span');
  popUpcontent.textContent = text2;
  popUpcontent.classList.add('pop-up-content');


  popUp.appendChild(popUpcross);
  popUp.appendChild(popUpHeader);
  popUp.appendChild(popUpcontent);


  const overlayItem = document.createElement('div');
  overlayItem.classList.add('overlay');

  document.querySelector('body').appendChild(overlayItem);
  document.querySelector('body').appendChild(popUp);


  document.querySelector('.pop-up-cross').addEventListener('click',function(){
      document.querySelector('.overlay').remove();
      document.querySelector('.pop-up').remove();
  });

});