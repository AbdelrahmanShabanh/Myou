var email = document.getElementById("email");
var password = document.getElementById("password");
var form = document.getElementById("form");
var msg = document.getElementById("msg");

// Function to validate the email
var validateEmail = (inputEmail) =>
  inputEmail.value.match(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

// Function to validate password
var validatePassword = (inputPassword) =>
  inputPassword.value.match(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

///////////////////////darkmode//////////////////////////////////
var iconn = document.getElementById("iconn");
iconn.onclick = function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    iconn.src = "dark theme icon/dark theme icon/sun.png";
  } else {
    iconn.src = "dark theme icon/dark theme icon/moon.png";
  }
};
////////////////////scroll//////////////////////////
var btn = document.querySelector(".up");
window.onscroll = function () {
  if (window.scrollY >= 600) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

btn.onclick = function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
};

/////////////////////////menubar/////////////////////////////////////
    document.addEventListener("DOMContentLoaded", function () {
      const menuBtn = document.getElementById("menu-btn");
      const closeBtn = document.getElementById("close-btn");
      const navbar = document.getElementById("navbar");

      menuBtn.addEventListener("click", function () {
        navbar.classList.add("show-the-menu");
      });

      closeBtn.addEventListener("click", function () {
        navbar.classList.remove("show-the-menu");
      });
    });


