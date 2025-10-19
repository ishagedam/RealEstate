gsap.registerPlugin(ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {


  




    // --- 1. Tab Switching Logic ---
    const ongoingBtn = document.getElementById('ongoingBtn');
    const completedBtn = document.getElementById('completedBtn');
    // Targets the separate <section> elements (your sfDelivered1 and sfDelivered2)
    const ongoingSection = document.getElementById('ongoingSection');
    const completedSection = document.getElementById('completedSection');

    function switchTab(activeBtn, activeContent, inactiveBtn, inactiveContent) {
        activeBtn.classList.add('active-tab');
        inactiveBtn.classList.remove('active-tab');
        
        // Start the fade-out/hide on the inactive container
        inactiveContent.classList.remove('active-content');

        // Delay the fade-in of the active container (allows the display:none to switch to display:block)
        setTimeout(() => {
            activeContent.classList.add('active-content');
        }, 10); 
    }

    // Event Listeners for tab buttons
    ongoingBtn.addEventListener('click', function() {
        switchTab(ongoingBtn, ongoingSection, completedBtn, completedSection);
    });

    completedBtn.addEventListener('click', function() {
        switchTab(completedBtn, completedSection, ongoingBtn, ongoingSection);
    });

    // --- 2. Modal/Popup Logic ---
    
    const body = document.body;
    const viewDetailsButtons = document.querySelectorAll('.viewDetails');
    const modalContainers = document.querySelectorAll('.modal-container');
    const closeButtons = document.querySelectorAll('.closeBtn');
    
    // Function to HIDE MODAL and ALLOW BODY SCROLLING
    function hideModal(modalElement) {
        modalElement.style.display = 'none';
        modalElement.classList.remove('is-open'); // Remove temporary state class
        body.classList.remove('modal-open'); 
    }

    // Function to SHOW MODAL and PREVENT BODY SCROLLING
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Gets the ID from the 'data-modal' attribute in the HTML button
            const modalId = this.getAttribute('data-modal');
            const modalToShow = document.getElementById(modalId);

            if (modalToShow) {
                modalToShow.style.display = 'flex'; // Show modal
                modalToShow.classList.add('is-open'); // Mark as open for ESC key/overlay listener
                body.classList.add('modal-open'); // Stops background scrolling
            }
        });
    });

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToHide = button.closest('.modal-container');
            if (modalToHide) {
                hideModal(modalToHide);
            }
        });
    });
    
    // Hide modal if user clicks outside the modal content (on the dark overlay)
    modalContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            // Check if the click target is the container itself, not a child element
            if (event.target === container) {
                hideModal(container);
            }
        });
    });

    // Optional: Hide modal on ESC key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal-container.is-open'); 
            if (openModal) {
                hideModal(openModal);
            }
        }
    });














  //gallaery uploaded section

  const addMediaBtn = document.getElementById("addMediaBtn");
  const mediaInput = document.getElementById("mediaInput");
  const uploadedGallery = document.getElementById("uploadedGallery");

  // Open file manager
  addMediaBtn.addEventListener("click", () => {
    mediaInput.click();
  });

  // Handle file selection
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
    
    // Reset input to allow re-uploading same file
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
    stagger: 0.15,   // gap between each link’s start
    delay: 0.3,      // wait before starting the whole group
    ease: "power3.out"
  });

  // ---------------- Hero Section Animations ----------------
  gsap.from(".contain h1", { duration: 1.5, y: 80, opacity: 0, stagger: 0.12 });
  gsap.from(".contain p", { duration: 1.2, y: 50, opacity: 0 });
  gsap.from(".contain .Buttons", { duration: 1.5, y: 80, opacity: 0 });

  // ---------------- Navbar Heading (SplitType) ----------------
  const splitNav = new SplitType(".navbar h4", { types: "chars" });
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

  
  }
//===================  section 2

gsap.from(".section2 .story-text  .heading",{ x:-100, duration:1, opacity:0 ,scrollTrigger:{trigger:".section2 .story-text  .heading",start:"top 100%"}})

// =================   section3  
gsap.from(".About .section3 .val-text .h2s ",{x:-100, opacity:0,  duration: 1,scrollTrigger:{trigger:".About .section3 .val-text h2s",start:"top 80%"}})
gsap.from(".About .section3 .val-text p ",{y:100, opacity:0, stagger:2, duration: 1,scrollTrigger:{trigger:".About .section3 .val-text h2",start:"top 80%"}})

gsap.from(".About .section3 .valBoxes  b1",{x:-100, opacity:0,  duration: 1, delay:0.8,scrollTrigger:{trigger:".About .section3 .valBoxes b1",start:"top 80%"}})
gsap.from(".About .section3 .valBoxes  b2",{y:100, opacity:0,  duration: 1, delay:1,scrollTrigger:{trigger:".About .section3 .valBoxes b1",start:"top 80%"}})
gsap.from(".About .section3 .valBoxes  b3",{x:100, opacity:0,  duration: 1, delay:1.3,scrollTrigger:{trigger:".About .section3 .valBoxes b1",start:"top 80%"}})
gsap.from(".About .team-section .teamHead ",{ duration:2, rotate:-145,opacity:0, dealy:2,scrollTrigger:{trigger:".About .team-section .teamHead " ,start:"top 95%" }})



  // Use GSAP's timeline for sequencing animations
  const tl = gsap.timeline();

  // Then, animate the cards
  tl.to(".member-card", {opacity: 1, y: 0, duration: 1, stagger: 0.3, // Animate each card with a 0.3-second delay
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

//=====================    section 5  =====================
  gsap.from(".section5 .team-section .teamHead ",{ duration:2, rotate:-145,opacity:0, delay:1,scrollTrigger:{trigger:".section5 .team-section .teamHead" ,start:"top 80%"}})
  gsap.from(".section5 .sldContainer ",{  x:100, duration:1.5, opacity:0, scrollTrigger:{trigger:".section5 .sldContainer", start:"top 80%"}})
  gsap.from(".section5 .sldContainer h1",{  x:100, duration:1, delay:1,opacity:0, scrollTrigger:{trigger:".section5 .sldContainer h1" ,start:"top 80%"}})
  gsap.from(".section5 .sldContainer h5",{  x:50, duration:2, delay:1.3, opacity:0, scrollTrigger:{trigger:".section5 .sldContainer h5" ,start:"top 90%"}})
  gsap.from(".section5 .sldContainer p2",{  y:100, duration:2, delay:1.5, opacity:0, scrollTrigger:{trigger:".section5  .sldContainer p2" ,start:"top 90%"}})
  gsap.from(".section5 .visitBox ",{  x:-90, duration:1, opacity:0, scrollTrigger:{trigger:".section5 .visitBox", start:"top90%"}})
  gsap.from(".section5 .visitBox h4 ",{  x:-100, duration:1, delay:1.8,opacity:0, scrollTrigger:{trigger:".section5 .visitBox h4,p5", start:"top 90%"}})
  gsap.from(".section5 .visitBox p5",{  x:100, duration:1,delay:1.8, opacity:0, scrollTrigger:{trigger:".section5 .visitBox h4,p5", start:"top 90%"}})
  






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

  // clone the existing video so it stays on the page
  const video = document.querySelector(".videocard2 video").cloneNode(true);
  video.style = "max-width:90%;max-height:90%";
   video.setAttribute("controls", "true"); // show controls
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






// const btn1 = document.querySelector(".btn1");
// const btn2 = document.querySelector(".btn2");
// const main1 = document.querySelector(".main1");
// const main2 = document.querySelector(".main2")
// const sfDelivered1 = document.querySelector(".sfDelivered1")


// btn1.addEventListener("click", () => {
//   main1.style.display = "flex";  
//   main2.style.display = "none";
 
// });

// btn2.addEventListener("click", () => {                                
//   main1.style.display = "none";
//   main2.style.display = "flex";   

   
    
// });



// function showOngoing() {
//       main1.style.display = "grid";
//       main2.style.display = "none";
//       btn1.classList.add("active-tab");
//       btn2.classList.remove("active-tab");

//       // Animate cards
//       gsap.from(".main1 .project-card", {opacity:0, y:50, stagger:0.2, duration:0.5});
//     }

//     function showCompleted() {
//       main2.style.display = "grid";
//       main1.style.display = "none";
//       btn2.classList.add("active-tab");
//       btn1.classList.remove("active-tab");

//       gsap.from(".main2 .project-card", {opacity:0, y:50, stagger:0.2, duration:0.5});
//     }

//     btn1.addEventListener("click", showOngoing);
//     btn2.addEventListener("click", showCompleted);

  
    // showOngoing();


























// const viewbtn1 = document.querySelector(".viewbtn1");
// const hiddenDetails1 = document.querySelector(".hiddenDetails1");
// viewbtn1.addEventListener("click",()=>{
//   hiddenDetails1.style.display ="flex";
// });


// const viewbtn2 = document.querySelector(".viewbtn2");
// const hiddenDetails2 = document.querySelector(".hiddenDetails2");
// viewbtn2.addEventListener("click",()=>{
//   hiddenDetails2.style.display ="flex";
// });

// const viewbtn3 = document.querySelector(".viewbtn3");
// const hiddenDetails3 = document.querySelector(".hiddenDetails3");
// viewbtn3.addEventListener("click",()=>{
//   hiddenDetails3.style.display ="flex";
// });


// const viewbtn4 = document.querySelector(".viewbtn4");
// const hiddenDetails4 = document.querySelector(".hiddenDetails4");
// viewbtn4.addEventListener("click",()=>{
//   hiddenDetails4.style.display ="flex";
// });


// const viewbtn5 = document.querySelector(".viewbtn5");
// const hiddenDetails5 = document.querySelector(".hiddenDetails5");
// viewbtn5.addEventListener("click",()=>{
//   hiddenDetails5.style.display ="flex";
// });


// const viewbtn6 = document.querySelector(".viewbtn6");
// const hiddenDetails6 = document.querySelector(".hiddenDetails6");
// viewbtn6.addEventListener("click",()=>{
//   hiddenDetails6.style.display ="flex";
// });

// const viewbtn7 = document.querySelector(".viewbtn7");
// const hiddenDetails7 = document.querySelector(".hiddenDetails7");
// viewbtn7.addEventListener("click",()=>{
//   hiddenDetails7.style.display ="flex";
// });







// const viewButtons = document.querySelectorAll("[class^='viewbtn']");
// const hiddenDetails = document.querySelectorAll("[class^='hiddenDetails']");
// const closeBtns = document.querySelectorAll(".closeBtn");


// viewButtons.forEach((btn, index) => {
//   btn.addEventListener("click", () => {
//     if (hiddenDetails[index]) {
//       hiddenDetails[index].style.display = "flex";
//       document.body.style.overflow = "hidden"; // lock background scroll
//     }
//   });
// });


// closeBtns.forEach(btn => {
//   btn.addEventListener("click", () => {
//     const parentOverlay = btn.closest("[class^='hiddenDetails']");
//     if (parentOverlay) {
//       parentOverlay.style.display = "none";
//       document.body.style.overflow = "auto"; 
//     }
//   });
// });


// hiddenDetails.forEach(overlay => {
//   overlay.addEventListener("click", e => {
//     if (e.target === overlay) {
//       overlay.style.display = "none";
//       document.body.style.overflow = "auto";
//     }
//   });
// });




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

const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent page reload

      const formData = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      };

      console.log('Form Submitted:', formData);
      alert(`Thank you, ${formData.name}! Your message has been received.`);

      form.reset(); // Clear the form
    });


document.addEventListener("DOMContentLoaded", () => {

  gsap.from(".contactmain", { opacity:0,
  })
})

















document.addEventListener("DOMContentLoaded", () => {
  // ---------------- File Picker ----------------
  const openFileBtn = document.getElementById("openFileBtn");
  const fileInput = document.getElementById("fileInput");

  if (openFileBtn && fileInput) {
    openFileBtn.addEventListener("click", () => {
      fileInput.click(); // opens file manager
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        console.log("Selected file:", fileInput.files[0].name);
        alert("You selected: " + fileInput.files[0].name);
      }
    });
  } else {
    console.error("File picker elements not found!");
  }
});

















































































document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Tab Switching Logic (Unchanged) ---
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


    // --- 2. Modal/Popup Logic (Modified to control body scroll and remove blur) ---
    
    const body = document.body;
    const viewDetailsButtons = document.querySelectorAll('.viewDetails');
    const modalContainers = document.querySelectorAll('.modal-container');
    const closeButtons = document.querySelectorAll('.closeBtn');
    
    // Function to SHOW MODAL and PREVENT BODY SCROLLING
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the target modal ID from the data attribute
            const modalId = this.getAttribute('data-modal');
            const modalToShow = document.getElementById(modalId);

            if (modalToShow) {
                modalToShow.style.display = 'flex'; 
                // Add class to body to prevent background scrolling
                body.classList.add('modal-open'); 
            }
        });
    });

    // Function to HIDE MODAL and ALLOW BODY SCROLLING
    function hideModal(modalElement) {
        modalElement.style.display = 'none';
        // Remove class to allow background scrolling
        body.classList.remove('modal-open'); 
    }

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToHide = button.closest('.modal-container');
            if (modalToHide) {
                hideModal(modalToHide);
            }
        });
    });
    
    // Hide modal if user clicks outside the modal content (on the overlay)
    modalContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            if (event.target === container) {
                hideModal(container);
            }
        });
    });

    // Optional: Hide modal on ESC key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal-container[style*="display: flex"]');
            if (openModal) {
                hideModal(openModal);
            }
        }
    });
});