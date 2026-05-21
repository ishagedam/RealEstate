
document.addEventListener("DOMContentLoaded", () => {
  loadProperties();
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






async function loadProperties() {
  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/properties");
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Expected JSON but got:", text);
      return;
    }

    const data = await res.json();
    const properties = Array.isArray(data) ? data : []; 

    const container = document.getElementById("propertyContainer");
    container.innerHTML = ''; 

    properties.forEach(prop => {
      const card = document.createElement('div');
      card.classList.add('property-card');

      // Use id from DB
      const propId = prop.id;

      card.innerHTML = `
        <img src="${prop.image || 'default.jpg'}" alt="${prop.title}" class="image">
        <div class="property-info">
          <p class="property-name">${prop.title}</p>
          <p class="location">${prop.city}</p>
          <p class="property-price">₹${Number(prop.price).toLocaleString()}</p>
          <button class="view-details-btn" data-id="${propId}">View Details</button>
        </div>
      `;

      container.appendChild(card);
    });

    document.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const propertyId = e.target.dataset.id;
        if (!propertyId) {
          console.error("Property ID missing!");
          return;
        }
        await showPropertyDetails(propertyId);
      });
    });

  } catch (err) {
    console.error("Error loading properties:", err);
  }
}





async function showPropertyDetails(id) {
  try {
    const res = await fetch(`https://realestate-4667.onrender.com/api/properties/${id}`);
    if (!res.ok) {
      alert("Property not found");
      return;
    }

    const prop = await res.json();

    const oldModal = document.getElementById("modalOverlay");
    if (oldModal) oldModal.remove();

    document.body.style.overflow = "hidden";

    const modalContent = `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal modern-modal full-view-layout">
          
          <span class="close-btn" id="closeModal">&times;</span>

          <div class="modal-left">
            <div class="img-container">
               <img src="${prop.image || 'default.jpg'}" class="modal-image-zoom"/>
               <span class="badge-overlay">${prop.property_status || 'Premium'}</span>
            </div>
          </div>

          <div class="modal-right-content">
            
            <div class="modal-header">
              <h2>${prop.title}</h2>
              <div class="price-tag">₹ ${Number(prop.price).toLocaleString()}</div>
              <p class="location-text">
                <i class="fa-solid fa-location-dot"></i> 
                ${prop.type} • ${prop.city}
              </p>
            </div>

            <div class="gold-divider"></div>

            <div class="data-wrapper">
                <div class="section-box">
             
                  <h4><i class="fa-solid fa-align-left"></i> Description</h4>
         <i data-lucide="BedDouble"></i>   <i data-lucide="SquareDashedTopSolid"></i><p class="desc-text">${prop.description || 'Premium residence with modern architecture.'}</p>
                </div>

                <div class="details-flex">
                    <div class="section-box">
                      <h4><i class="fa-solid fa-house-chimney"></i> Property Details</h4>
                      <p><b>Size ➖</b> ${prop.floor || 'N/A'}</p>
                      <p><b>Status ➖</b> ${prop.property_status || 'N/A'}</p>
                      <p><b>Availability➖</b> <span class="${prop.is_available ? 'status-avail' : 'status-unavail'}">${prop.is_available ? 'Available' : 'Sold Out'}</span></p>
                    </div>

                    <div class="section-box">
                      <h4><i class="fa-solid fa-star"></i> Features</h4>
                      <ul class="feature-list">
                        ${(prop.features || '').split(',').map(f => `<li><i class="fa-solid fa-check"></i> ${f.trim()}</li>`).join('')}
                      </ul>
                    </div>
                </div>

                <div class="section-box">
                  <h4><i class="fa-solid fa-wifi"></i> Amenities</h4>
                  <div class="amenities">
                    ${(prop.amenities || '').split(',').map(a => `<span>${a.trim()}</span>`).join('')}
                  </div>
                </div>

                <div class="contact-footer-area">
                    <div class="text-contact">
                        <h4>Interested in this project?</h4>
                        <p>Get in touch with our sales team</p>
                    </div>
  
                    <button class="contact-btn" data-id="${prop.id}" data-agent="${prop.agent_id}"> 
                         Enquire Now <i class="fa-solid fa-hand-pointer"></i>
                    </button>
                </div>
            </div>

      
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalContent);
    document.getElementById("closeModal").onclick = closeModal;
    document.getElementById("closeModal2").onclick = closeModal;

    function closeModal() {
      document.getElementById("modalOverlay").remove();
      document.body.style.overflow = "auto";
    }

    lucide.createIcons();

  } catch (err) {
    console.error("Error:", err);
  }
}



document.addEventListener("click", (e) => {
  if (e.target.classList.contains("contact-btn")) {

    const propertyId = e.target.dataset.id;
    const agentId = e.target.dataset.agent;

    console.log("Redirecting:", propertyId, agentId); // 👈 check this

    window.location.href =
      `/properties/PropertyEnquiry.html?propertyId=${propertyId}&agentId=${agentId}`;
  }
});




const enquiryForm = document.getElementById("propertyEnquiryForm");

if (enquiryForm) {
  enquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      propertyId: document.getElementById("propertyId").value,
      agentId: document.getElementById("agentId").value,
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      mobile: document.getElementById("mobile").value,
      message: document.getElementById("message").value
    };

    const res = await fetch("https://realestate-4667.onrender.com/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);
  });


}

fetch("/footer/footer.html")
.then(response => response.text())
.then(data => {
  document.getElementById("footer").innerHTML = data;
});


