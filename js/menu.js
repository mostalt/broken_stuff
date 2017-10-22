var navMain = document.querySelector(".main-nav");
var menuMain = document.querySelector(".page-header__menu");
var navToggle = document.querySelector(".main-nav__toggle");

navMain.classList.remove("main-nav--nojs");

navToggle.addEventListener("click", function() {
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opened");
    menuMain.classList.remove("page-header__menu--closed");
    menuMain.classList.add("page-header__menu--opened");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opened");
    menuMain.classList.add("page-header__menu--closed");
    menuMain.classList.remove("page-header__menu--opened");
  }
});
