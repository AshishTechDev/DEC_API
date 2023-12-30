const OpenBtns = document.querySelectorAll(".open-box-btn");
const AuthorBox = document.querySelector(".signup-overlay");
const OverlayRemove = document.querySelectorAll(".overlay-remove");
const SignupBox = document.querySelector("#signup");
const LoginBox = document.querySelector("#login");
const ResetBox = document.querySelector("#reset");


   OpenBtns.forEach(OpenBtn => {
     OpenBtn.addEventListener("click", getValue = (value) => {
        var val = value ;
       AuthorBox.style.display = "flex" ;
       if(val == "signup") {
        console.log(val) ;
        LoginBox.style.display = "none" ;
        ResetBox.style.display = "none" ;
        SignupBox.style.display = "flex" ;

        } 
        if(val == "login") {
          console.log(val) ;
          ResetBox.style.display = "none" ;
          SignupBox.style.display = "none" ;
          LoginBox.style.display = "flex" ;
        }
        if(val == "reset") {
          // console.log(val) ;
          SignupBox.style.display = "none" ;
          LoginBox.style.display = "none" ;
          ResetBox.style.display = "flex" ;
        }
      });
    })

    
    OverlayRemove.forEach(Remove => {
    Remove.addEventListener("click", () =>{
       AuthorBox.style.display = "none" ;
     });
   });
    