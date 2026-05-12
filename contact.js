document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Contact JS Loaded");

  const form = document.getElementById("contactForm");

  if (!form) {
    console.log("❌ Form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("🚀 Form Submit Triggered");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch("https://realestate-4667.onrender.com/api/contact_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, mobile, message })
  
      });

    
        const result = await response.json();
      console.log(result);
      alert("Message Sent Successfully ✅");

      form.reset();

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  });
});






gsap.registerPlugin(ScrollTrigger);

// ================= NAVBAR =================
gsap.from(".navbar", {
  y: -60,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

// ================= HERO TEXT =================
gsap.from(".Firstsection h1", {
  y: 40,
  opacity: 0,
  duration: 1,
  delay: 0.2,
  ease: "power3.out"
});

gsap.from(".Firstsection p", {
  y: 20,
  opacity: 0,
  duration: 1,
  delay: 0.4,
  ease: "power3.out"
});

// ================= GET IN TOUCH =================
gsap.from(".contacthead", {
  scrollTrigger: {
    trigger: ".contacthead",
    start: "top 85%"
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out"
});

gsap.from(".contacthead + p", {
  scrollTrigger: {
    trigger: ".contacthead",
    start: "top 85%"
  },
  y: 20,
  opacity: 0,
  duration: 0.8,
  delay: 0.2,
  ease: "power3.out"
});

// ================= CONTACT INFO =================
gsap.from(".contactInfo > div", {
  scrollTrigger: {
    trigger: ".contactInfo",
    start: "top 80%"
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out"
});

// ================= FORM (SAFE - NO INPUT BREAK) =================
gsap.from("#contactForm", {
  scrollTrigger: {
    trigger: "#contactForm",
    start: "top 85%"
  },
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

// ================= MAP =================
gsap.from(".forthsection", {
  scrollTrigger: {
    trigger: ".forthsection",
    start: "top 85%"
  },
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});