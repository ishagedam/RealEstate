const links = document.querySelectorAll(".footer-links a");

links.forEach(link => {

  link.addEventListener("mouseenter", () => {

    link.style.letterSpacing = "1px";

  });

  link.addEventListener("mouseleave", () => {

    link.style.letterSpacing = "0px";

  });

});



const footer = `

<footer class="sb-footer">

  <div class="sb-footer-container">

    <!-- ABOUT -->

    <div class="sb-footer-section">

      <h3 class="sb-footer-title">
        Swaraj Builders
      </h3>

      <p class="sb-footer-text">
        Building dream homes with trust, quality and modern architecture.
        We deliver premium residential and commercial projects with excellence.
      </p>

      <div class="sb-social-icons">

        <a href="https://facebook.com" target="_blank">
          <i class="fab fa-facebook-f"></i>
        </a>

        <a href="https://instagram.com" target="_blank">
          <i class="fab fa-instagram"></i>
        </a>

        <a href="https://twitter.com" target="_blank">
          <i class="fab fa-twitter"></i>
        </a>

        <a href="https://github.com" target="_blank">
          <i class="fab fa-github"></i>
        </a>

        <a href="https://linkedin.com" target="_blank">
          <i class="fab fa-linkedin-in"></i>
        </a>

        <a href="https://youtube.com" target="_blank">
          <i class="fab fa-youtube"></i>
        </a>

      </div>

    </div>

    <!-- LINKS -->

    <div class="sb-footer-section">

      <h3 class="sb-footer-title">
        Quick Links
      </h3>

      <div class="sb-footer-links">

        <a href="./index.html">Home</a>

        <a href="./AboutUs.htm">About</a>

        <a href="/properties/property.htm">Properties</a>

        <a href="./Gallery.htm">Gallery</a>

        <a href="./Contact.htm">Contact</a>

        <a href="./Sites.htm">Site Map</a>

      </div>

    </div>

    <!-- OFFICE -->

    <div class="sb-footer-section">

      <h3 class="sb-footer-title">
        Visit Our Office
      </h3>

      <p class="sb-footer-text">
        Swaraj Builders Head Office
      </p>

      <p class="sb-footer-text">
        123 Construction Plaza,
        Baner Road Pune,
        Maharashtra 411045
      </p>

    </div>

    <!-- CALL -->

    <div class="sb-footer-section">

      <h3 class="sb-footer-title">
        Call Us
      </h3>

      <p class="sb-footer-text">
        Sales: +91 98765 43210
      </p>

      <p class="sb-footer-text">
        Support: +91 98765 43211
      </p>

      <p class="sb-footer-text">
        Toll Free: 1800 123 4567
      </p>

    </div>

    <!-- EMAIL -->

    <div class="sb-footer-section">

      <h3 class="sb-footer-title">
        Email Us
      </h3>

      <div class="sb-footer-links">

        <a href="mailto:info@swarajbuilders.com">
          info@swarajbuilders.com
        </a>

        <a href="mailto:sales@swarajbuilders.com">
          sales@swarajbuilders.com
        </a>

        <a href="mailto:support@swarajbuilders.com">
          support@swarajbuilders.com
        </a>

      </div>

    </div>

  </div>

  <div class="sb-footer-bottom">

    © 2026 Swaraj Builders. All Rights Reserved.

  </div>

</footer>

`;

document.getElementById("footer").innerHTML = footer;