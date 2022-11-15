
// Add Idea pop up
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
  popUpHeader.textContent = "HEY THERE";
  popUpHeader.classList.add('pop-up-header');

  const popUpcontent = document.createElement('span');
  popUpcontent.textContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
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