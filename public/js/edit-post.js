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