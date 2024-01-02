const pickImageHandler = () => {
  document.querySelector("#imageUrl").click();
};

const pickedhandler = (e) => {
  if(e.target.files.length > 0) {
    const pickedFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      document.querySelector(".image-upload__preview").style.display = "block" ;
      document.querySelector(".image-upload__preview img").src = fileReader.result ;
    };
    fileReader.readAsDataURL(pickedFile);
  } else {
    return false ;
  }
};

const buttonLogo = document.querySelector(".button-logo");
const HomeOverlay = document.querySelector(".home-overlay");


HomeOverlay.addEventListener("click" , () => {
  console.log("heo");
  document.querySelector(".left-aside").style.left = "-70vw" ;
  buttonLogo.style.display = "flex" ;
  HomeOverlay.style.display = "none" ;
});

buttonLogo.addEventListener("click" , () => {
  console.log("fff");
  document.querySelector(".left-aside").style.left = 0 ;
  buttonLogo.style.display = "none" ;
  HomeOverlay.style.display = "block" ;
})