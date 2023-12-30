const pickImageHandler = () => {
  document.querySelector("#profileBanner").click();
};

const pickedhandler = (e) => {
  if(e.target.files.length > 0) {
    const pickedFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      document.querySelector(".profile-cover img").src = fileReader.result ;
    };
    fileReader.readAsDataURL(pickedFile);
  } else {
    return false ;
  }
};

const pickProfileHandler = () => {
  document.querySelector("#profilePic").click(); //file
};

const pickedProfile = (e) => {
  if(e.target.files.length > 0) {
    const pickedFile = e.target.files[0];
    const Reader = new FileReader();
    Reader.onload = () => {
      document.querySelector(".profile-pic img").src = Reader.result ;
    };
    Reader.readAsDataURL(pickedFile);
  } else {
    return false ;
  }
};