const OpenBtns = document.querySelectorAll(".open-box-btn");
const AuthorBox = document.querySelector(".overlay");
const CloseBtn = document.querySelector(".box-cross");
var postId ;
function getValue(value) {
      console.log(value);
       postId = value ;
}
OpenBtns.forEach(OpenBtn => {
  OpenBtn.addEventListener("click", () => {
      AuthorBox.style.display = "block" ;
  });
})

CloseBtn.addEventListener("click", () => {
  AuthorBox.style.display = "none" ;
});


const EditBtn = document.querySelector("#Edit-button");
const DeleteBtn = document.querySelector("#Delete-button");
const EditBox = document.querySelector(".Edit-overlay");
const CancelBtn = document.querySelector("#Cancel-Btn");
EditBtn.addEventListener("click", (event) => {
  // EditBox.style.display = "block" ;
  console.log(postId) ;
  window.open(`/mypost/${postId}`,"_parent");
  event.preventDefault();
});

DeleteBtn.addEventListener("click", (event) => {
  window.open(`/deletepost/${postId}`,"_parent");
  event.preventDefault();
})

CancelBtn.addEventListener("click", () => {
  console.log("hh");
  EditBox.style.display = "none" ;
});