function renderImageFromFile() {
    let readFile = new FileReader(); 
    readFile.onload = function(event)  {
      let renderImage = document.getElementById('renderedImage');
      renderImage.src = readFile.result;
    }
    readFile.readAsDataURL(event.target.files[0]);
}
  
function uploadImageFromURL() {
    const url = document.getElementById("urlLink").value; 
    if (url === "") {
        console.log("Empty Log ");
        alert("No URL found. Please enter a url link.");
        return;
    }
    const newImage = document.createElement("img");
    newImage.src = url;
    const showImage = document.getElementById("previewer");
    if (showImage.children[0] != null) {
        showImage.removeChild(showImage.children[0]);
    }
    showImage.appendChild(newImage);
} 