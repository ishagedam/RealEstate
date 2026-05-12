
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {


    // --- 1. Tab Switching Logic ---
    const ongoingBtn = document.getElementById('ongoingBtn');
    const completedBtn = document.getElementById('completedBtn');

    const ongoingSection = document.getElementById('ongoingSection');
    const completedSection = document.getElementById('completedSection');

    function switchTab(activeBtn, activeContent, inactiveBtn, inactiveContent) {
        activeBtn.classList.add('active-tab');
        inactiveBtn.classList.remove('active-tab');
        

        inactiveContent.classList.remove('active-content');

       
        setTimeout(() => {
            activeContent.classList.add('active-content');
        }, 10); 
    }


    ongoingBtn.addEventListener('click', function() {
        switchTab(ongoingBtn, ongoingSection, completedBtn, completedSection);
    });

    completedBtn.addEventListener('click', function() {
        switchTab(completedBtn, completedSection, ongoingBtn, ongoingSection);
    });

  
    
    const body = document.body;
    const viewDetailsButtons = document.querySelectorAll('.viewDetails');
    const modalContainers = document.querySelectorAll('.modal-container');
    const closeButtons = document.querySelectorAll('.closeBtn');
    
    function hideModal(modalElement) {
        modalElement.style.display = 'none';
        modalElement.classList.remove('is-open'); 
        body.classList.remove('modal-open'); 
    }

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
           
            const modalId = this.getAttribute('data-modal');
            const modalToShow = document.getElementById(modalId);

            if (modalToShow) {
                modalToShow.style.display = 'flex';
                modalToShow.classList.add('is-open'); 
                body.classList.add('modal-open');
            }
        });
    });

    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToHide = button.closest('.modal-container');
            if (modalToHide) {
                hideModal(modalToHide);
            }
        });
    });
    
    modalContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            
            if (event.target === container) {
                hideModal(container);
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal-container.is-open'); 
            if (openModal) {
                hideModal(openModal);
            }
        }
    });




  const addMediaBtn = document.getElementById("addMediaBtn");
  const mediaInput = document.getElementById("mediaInput");
  const uploadedGallery = document.getElementById("uploadedGallery");

  addMediaBtn.addEventListener("click", () => {
    mediaInput.click();
  });


  mediaInput.addEventListener("change", () => {
    const file = mediaInput.files[0];
    if (!file) return;

    const fileType = file.type;
    const reader = new FileReader();

    reader.onload = function(e) {
      const galleryItem = document.createElement("div");
      galleryItem.classList.add("galleryItem");

      if (fileType.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = e.target.result;
        galleryItem.appendChild(img);
      } else if (fileType.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = e.target.result;
        video.controls = true;
        galleryItem.appendChild(video);
      }

      uploadedGallery.appendChild(galleryItem);
    };

    reader.readAsDataURL(file);
    
  
    mediaInput.value = "";
  });
});

  


  // ---------------- Menu Toggle ----------------
  const menuIcon = document.querySelector('.menu-icon i');
  const navPart2 = document.querySelector('.navpart2');

  menuIcon.addEventListener('click', () => {
    navPart2.classList.toggle('active');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-xmark');

  });



 gsap.from(".navpart2 a", {
    y: -20,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,   
    delay: 0.3,      
    ease: "power3.out"
  });

  
  gsap.from(".contain h1", { duration: 1.5, y: 80, opacity: 0, stagger: 0.12 });
  gsap.from(".contain p", { duration: 1.2, y: 50, opacity: 0 });
  gsap.from(".contain .Buttons", { duration: 1.5, y: 80, opacity: 0 });


  const splitNav = new SplitType(".navbar h6", { types: "chars" });
  gsap.from(splitNav.chars, { y: -20, opacity: 0, duration: 0.5, stagger: 0.1 });






// ==========================================  About page js   ========================================
 


if (document.body.classList.contains("About")) {

    // Section fade-in
    gsap.from(".about-section", { y: 40, opacity: 0, duration: 0.8 });

    // Heading split animation
    const splitAbtHeading = new SplitType(".About .section1 .text h1", { types: "chars" });
    gsap.from(splitAbtHeading.chars, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      delay: 1.5
    });

    gsap.from(".About .section1 .text p", {
      z: 20,
      opacity: 0,
      delay: 2.6,
      duration: 0.3
    });

  
  
//===================  section 2

gsap.from(".section2 .story-text  .heading",{ x:-100, duration:1, opacity:0 ,scrollTrigger:{trigger:".section2 .story-text  .heading",start:"top 100%"}})

// =================   section3  
gsap.from(".About .section3 .val-text .h2s ",{x:-100, opacity:0,  duration: 1,scrollTrigger:{trigger:".About .section3 .val-text h2s",start:"top 80%"}})
gsap.from(".About .section3 .val-text p ",{y:100, opacity:0, stagger:2, duration: 1,scrollTrigger:{trigger:".About .section3 .val-text h2",start:"top 80%"}})

gsap.from(".About .section3 .valBoxes  b1",{x:-100, opacity:0,  duration: 1, delay:0.8,scrollTrigger:{trigger:".About .section3 .valBoxes b1",start:"top 80%"}})
gsap.from(".About .section3 .valBoxes  b2",{y:100, opacity:0,  duration: 1, delay:1,scrollTrigger:{trigger:".About .section3 .valBoxes b1",start:"top 80%"}})
gsap.from(".About .section3 .valBoxes  b3",{x:100, opacity:0,  duration: 1, delay:1.3,scrollTrigger:{trigger:".About .section3 .valBoxes b1",start:"top 80%"}})
gsap.from(".About .team-section .teamHead ",{ duration:2, rotate:-145,opacity:0, dealy:2,scrollTrigger:{trigger:".About .team-section .teamHead " ,start:"top 95%" }})



  const tl = gsap.timeline();


  tl.to(".member-card", {opacity: 1, y: 0, duration: 1, stagger: 0.3, 
    ease: "power2.out",
    scrollTrigger:{
      trigger:".member-card",
      start:"top 90%",
    }
  });


  gsap.to(".member-card .image-box img", {
    x: "0%", 
    duration: 1.5,
    stagger: 0.3, 
    ease: "power3.out",
    delay: 0.5, scrollTrigger:{
      trigger:".member-card .image-box img",
      start:"top 90%",
    } 
  })
}

// //=====================    section 5  =====================
//   gsap.from(".section5 .team-section .teamHead ",{ duration:2, rotate:-145,opacity:0, delay:1,scrollTrigger:{trigger:".section5 .team-section .teamHead" ,start:"top 80%"}})
//   gsap.from(".section5 .sldContainer ",{  x:100, duration:1.5, opacity:0, scrollTrigger:{trigger:".section5 .sldContainer", start:"top 80%"}})
//   gsap.from(".section5 .sldContainer h1",{  x:100, duration:1, delay:1,opacity:0, scrollTrigger:{trigger:".section5 .sldContainer h1" ,start:"top 80%"}})
//   gsap.from(".section5 .sldContainer h5",{  x:50, duration:2, delay:1.3, opacity:0, scrollTrigger:{trigger:".section5 .sldContainer h5" ,start:"top 90%"}})
//   gsap.from(".section5 .sldContainer p2",{  y:100, duration:2, delay:1.5, opacity:0, scrollTrigger:{trigger:".section5  .sldContainer p2" ,start:"top 90%"}})
//   gsap.from(".section5 .visitBox ",{  x:-90, duration:1, opacity:0, scrollTrigger:{trigger:".section5 .visitBox", start:"top90%"}})
//   gsap.from(".section5 .visitBox h4 ",{  x:-100, duration:1, delay:1.8,opacity:0, scrollTrigger:{trigger:".section5 .visitBox h4,p5", start:"top 90%"}})
//   gsap.from(".section5 .visitBox p5",{  x:100, duration:1,delay:1.8, opacity:0, scrollTrigger:{trigger:".section5 .visitBox h4,p5", start:"top 90%"}})


// }gsap.registerPlugin(ScrollTrigger);

// LEFT CONTENT animation
gsap.from(".sldContainer h1, .sldContainer h5, .sldContainer p", {
  y: 60,
  opacity: 0,
  duration: 1,
  stagger: 0.3,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".section5",
    start: "top 80%",
  }
});

// VISIT BOX animation
gsap.from(".visitBox", {
  x: 120,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".visitBox",
    start: "top 85%",
  }
});
// =============================================== SITE PAGE JS ==================================================




document.addEventListener("DOMContentLoaded", () => {
  gsap.from(".videosection .videocard1",{y:10, duration:2, delay:1 ,opacity:0,rotate:-10 });
   gsap.from(".videosection .videocard2",{y:10, duration:2, delay:1 ,opacity:0,rotate:10 });


  //  Gallary section animation
   gsap.from(".gallary .allimg .slide1 .slidetext",{x:-50,duration:1,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});
   gsap.from(".gallary .allimg .slide1 .imgbox",{x:50,duration:1,opacity:0,delay:1, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});

   gsap.from(".gallary .allimg .slide2 .slidetext",{x:50,duration:1, delay:1.3,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});
   gsap.from(".gallary .allimg .slide2 .imgbox",{x:-50,duration:1, delay:1.6,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});

   
   
   gsap.from(".gallary .allimg2 .slide3 .slidetext",{x:-50,duration:1, delay:1.9,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});
   gsap.from(".gallary .allimg2 .slide3 .imgbox",{x:50,duration:1, delay:2.2,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});

    gsap.from(".gallary .allimg2 .slide4 .slidetext",{x:50,duration:1, delay:2.6,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});
   gsap.from(".gallary .allimg2 .slide4 .imgbox",{x:-50,duration:1, delay:2.9,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});

   gsap.from(".gallary .allimg3 .slide5 .slidetext",{x:-50,duration:1, delay:3.2,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});
   gsap.from(".gallary .allimg3 .slide5 .imgbox",{x:50,duration:1, delay:3.6,opcity:0,scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});

   gsap.from(".gallary .allimg3 .slide6 .slidetext",{x:50,duration:1, delay:3.9,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});
   gsap.from(".gallary .allimg3 .slide6 .imgbox",{x:-50,duration:1, delay:4.2,opacity:0, ease:"power3.out", scrollTrigger:{trigger:".gallary .allimg .slide1 .slidetext",start:"top 80%"}});


//site page  animation 
   gsap.from(".OgContainer ongoing-grid .projectcard",{y:-50, duration:2,})







   //contact page animation
   gsap.from(".Enquiryhead .Enquiry",{x:20, duration:2, opacity:0,scrollTrigger:{trigger:".Enquiryhead,.Enquiry",start:"top 80%"}})
   gsap.from(".Enquiryhead .Enquirypara",{x:20, duration:2, opacity:0,delay:1,scrollTrigger:{trigger:".Enquiryhead,.Enquirypara",start:"top 90%"}})
   gsap.from("#contactForm",{y:20,duration:2,opacity:0,scrollTrigger:{trigger:"#contactForm",start:"top 90%"}})
   gsap.from(".contacthead",{y:30,duration:2,opacity:0,scrollTrigger:{trigger:".contacthead",start:"top 90%"}})
  }); 








document.querySelector(".videocard1").addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.style = `
    position:fixed;inset:0;background:rgba(0,0,0,.8);
    display:flex;align-items:center;justify-content:center;z-index:9999;
  `;
 
  
  const video = document.querySelector(".videocard1 video").cloneNode(true);
  video.style = "max-width:90%;max-height:90%";
  video.setAttribute("controls", "true"); 
  video.play(); 

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style = `
    position:absolute;top:20px;right:30px;
    font-size:2rem;color:white;background:none;border:none;cursor:pointer;
  `;
  closeBtn.onclick = () => overlay.remove();

  overlay.append(video, closeBtn);
  document.body.appendChild(overlay);
});




document.querySelector(".videocard2").addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.style = `
    position:fixed;inset:0;background:rgba(0,0,0,.8);
    display:flex;align-items:center;justify-content:center;z-index:9999;
  `;

  const video = document.querySelector(".videocard2 video").cloneNode(true);
  video.style = "max-width:90%;max-height:90%";
   video.setAttribute("controls", "true");
  video.play(); 

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.style = `
    position:absolute;top:20px;right:30px;
    font-size:2rem;color:white;background:none;border:none;cursor:pointer;
  `;
  closeBtn.onclick = () => overlay.remove();

  overlay.append(video, closeBtn);
  document.body.appendChild(overlay);
});





//=========================================   Gallery js  ================================================




const flipCard = document.querySelector('.card-right.flip-card');
const video = flipCard.querySelector('video');

flipCard.addEventListener('mouseenter', () => {
  video.play();
});

flipCard.addEventListener('mouseleave', () => {
  video.pause();
  video.currentTime = 0;
});




// ===================================================       Contact js      ========================================================
document.addEventListener("DOMContentLoaded", function () {

  const contactForm = document.getElementById("contactForm");

  // 👉 jar form nahi asel tar kahi hi karu naka
  if (!contactForm) return;

  console.log("Contact form active ✅");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("Form submit 🚀");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const message = document.getElementById("message").value;

    try {
      const res = await fetch("https://realestate-4667.onrender.com/api/contact-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, mobile, message })
      });

      const data = await res.json();
      alert("Message sent successfully ✅");

      contactForm.reset();
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  });

});




document.addEventListener("DOMContentLoaded", () => {

  gsap.from(".contactmain", { opacity:0,
  })
})


document.addEventListener("DOMContentLoaded", () => {
const addImageBtn = document.getElementById("addImageBtn");
const imageInput = document.getElementById("imageInput");
const gallery = document.getElementById("uploadedGallery");

addImageBtn.onclick = () => imageInput.click();

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const item = document.createElement("div");
  item.classList.add("galleryItem");

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  item.appendChild(img);
  gallery.appendChild(item);

  imageInput.value = "";
};

});



document.addEventListener('DOMContentLoaded', function() {
  
    const ongoingBtn = document.getElementById('ongoingBtn');
    const completedBtn = document.getElementById('completedBtn');
    const ongoingSection = document.getElementById('ongoingSection');
    const completedSection = document.getElementById('completedSection');

    function switchTab(activeBtn, activeContent, inactiveBtn, inactiveContent) {
        activeBtn.classList.add('active-tab');
        inactiveBtn.classList.remove('active-tab');
        inactiveContent.classList.remove('active-content');
        setTimeout(() => {
            activeContent.classList.add('active-content');
        }, 10); 
    }

    ongoingBtn.addEventListener('click', function() {
        switchTab(ongoingBtn, ongoingSection, completedBtn, completedSection);
    });

    completedBtn.addEventListener('click', function() {
        switchTab(completedBtn, completedSection, ongoingBtn, ongoingSection);
    });
    
    ongoingSection.classList.add('active-content');



    
    const body = document.body;
    const viewDetailsButtons = document.querySelectorAll('.viewDetails');
    const modalContainers = document.querySelectorAll('.modal-container');
    const closeButtons = document.querySelectorAll('.closeBtn');
    
   
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
       
            const modalId = this.getAttribute('data-modal');
            const modalToShow = document.getElementById(modalId);

            if (modalToShow) {
                modalToShow.style.display = 'flex'; 
         
                body.classList.add('modal-open'); 
            }
        });
    });

    
    function hideModal(modalElement) {
        modalElement.style.display = 'none';
     
        body.classList.remove('modal-open'); 
    }

   
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToHide = button.closest('.modal-container');
            if (modalToHide) {
                hideModal(modalToHide);
            }
        });
    });
    
    modalContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            if (event.target === container) {
                hideModal(container);
            }
        });
    });

  
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal-container[style*="display: flex"]');
            if (openModal) {
                hideModal(openModal);
            }
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS Loaded");

  fetch("/api/properties")
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      console.log("✅ Data fetched:", data);

      const container = document.getElementById("property-list");
      if (!container) {
        console.error("❌ 'property-list' div not found");
        return;
      }

      container.innerHTML = ""; 

      if (data.length === 0) {
        container.innerHTML = "<p>No properties found.</p>";
        return;
      }

      // Create property cards
      data.forEach(property => {
        const card = document.createElement("div");
        card.className = "property-card";
        card.innerHTML = `
          <img src="${property.image}" alt="${property.title}" style="width:100%;border-radius:10px;margin-bottom:10px;">
          <h2>${property.title}</h2>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Price:</strong> ${property.price}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("❌ Error fetching properties:", error);
      document.getElementById("property-list").innerHTML = "<p>Error loading properties.</p>";
    });
});



document.addEventListener("DOMContentLoaded", function () {

  const windowBox = document.getElementById("welcomeWindow");
  const signupBtn = document.querySelector(".signUp");
  const loginBtn = document.querySelector(".login");


  if (!windowBox || !signupBtn || !loginBtn) {
    console.log("Sliding elements not found on this page");
    return;
  }

  signupBtn.addEventListener("click", function () {
    windowBox.style.transform = "translateX(0)";
  });

  loginBtn.addEventListener("click", function () {
    windowBox.style.transform = "translateX(100%)";
  });

});
























































