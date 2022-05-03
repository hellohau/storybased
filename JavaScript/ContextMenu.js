let menu_open = false;

//Right click
const ctxMenu = document.getElementById("context-menu");
document.getElementById("canv").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    
    const { clientX : mouseX, clientY:mouseY } = e;
    const { normalizedX, normalizedY } = normalizePozition(mouseX , mouseY); 

    ctxMenu.style.top = `${mouseY}px`;
    ctxMenu.style.left = `${mouseX}px`;

    ctxMenu.classList.remove("visible");
    menu_open = true;

    setTimeout(() => {
        ctxMenu.classList.add("visible");
    });
});

window.addEventListener("click", (e) => {
    if(e.target.offsetParent != ctxMenu){
        ctxMenu.classList.remove("visible");
        menu_open = false;
    }
})

const normalizePozition = (mouseX, mouseY) => {
    // compute what the mouse position is relative to the container element (scope)
  
    // check if the element will go out of bounds
    const outOfBoundsOnX =
      mouseX + ctxMenu.clientWidth > document.body.clientWidth;
  
    const outOfBoundsOnY =
      mouseY + ctxMenu.clientHeight > document.body.clientHeight;
  
    let normalizedX = mouseX;
    let normalizedY = mouseY;
    
    // normalize on X
    if (outOfBoundsOnX) {
      normalizedX = 
        document.body.clientWidth - ctxMenu.clientWidth;
    }
  
    // normalize on Y
    if (outOfBoundsOnY) {
      normalizedY = 
        document.body.clientHeight - ctxMenu.clientHeight;
    }
  
    return { normalizedX, normalizedY };
};
