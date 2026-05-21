const links = document.querySelectorAll(".footer-links a");

links.forEach(link => {

  link.addEventListener("mouseenter", () => {

    link.style.letterSpacing = "1px";

  });

  link.addEventListener("mouseleave", () => {

    link.style.letterSpacing = "0px";

  });

});