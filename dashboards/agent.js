// ================= AUTH DATA =================
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const userId = localStorage.getItem("userId");

console.log("TOKEN:", token);
console.log("ROLE:", role);

// ================= PAGE INFO =================
const page = window.location.pathname.split("/").pop();

// ================= LOGIN CONFIG =================
const LOGIN_PAGE = "signlog.htm";
const LOGIN_PATH = "../SignUp-Login/signlog.htm";



// ================= SKIP LOGIN PAGE =================
if (page !== LOGIN_PAGE) {
  if (!token || !role) {
    alert("Please login first");
    window.location.href = LOGIN_PATH;
  }
}

// ================= ROLE PROTECTION =================
if (page === "adminDashboard.html" && role !== "admin") {
  alert("Admins only");
  window.location.href = LOGIN_PATH;
}

if (page === "agentDashboard.html" && role !== "agent") {
  alert("Agents only");
  window.location.href = LOGIN_PATH;
}

if (page === "userDashboard.html" && role !== "user") {
  alert("Users only");
  window.location.href = LOGIN_PATH;
}

// ================= ADMIN BUTTON VISIBILITY =================
if (role === "admin") {
  [
    "viewUsersBtn",
    "approveAgentBtn",
    "viewAgentBtn",
    "blockAgentBtn",
    "viewPropertiesBtn",
    "deleteAnyPropertyBtn",
    "viewStatesBtn",
    "logoutBtn"
  ].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.style.display = "inline-block";
  });
}

// ================= LOGOUT =================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.clear();
  alert("Logged out");
  window.location.href = LOGIN_PATH;
});


/* ==================================================================================================================================
                                                          AGENT SECTION
===================================================================================================================================== */

// ================= ADD PROPERTY MODAL =================
document.getElementById("addPropertyBtn")?.addEventListener("click", () => {
  document.getElementById("addPropertyModal").style.display = "block";
  
});

document.getElementById("closeModalBtn")?.addEventListener("click", () => {
  document.getElementById("addPropertyModal").style.display = "none";
});


// ================= ADD PROPERTY =================
document.getElementById("addPropertyForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const propertyData = Object.fromEntries(formData.entries());




const amenitiesArr = Array.from(e.target.querySelectorAll('input[name="amenity"]:checked'))
                                .map(cb => cb.value);
    propertyData.amenities = amenitiesArr.join(', '); 

const featuresArr = Array.from(e.target.querySelectorAll('input[name="feature"]:checked'))
                               .map(cb => cb.value);
    propertyData.features = featuresArr.join(', ');



  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/dashboard/agent/property", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(propertyData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add property");
      return;
    }

    alert("Property added successfully");
    e.target.reset();
    document.getElementById("addPropertyModal").style.display = "none";

  } catch (err) {
    console.error("Add property error:", err);
    alert("Server error");
  }
  

});




window.openEditModal = null;
window.requestDelete = null;

document.addEventListener("DOMContentLoaded", () => {
    const viewBtn = document.getElementById("viewMyPropertyBtn");
    if (viewBtn) {
        viewBtn.onclick = loadMyProperties; 
    }
});

// ===================== 1. LOAD PROPERTIES =====================
async function loadMyProperties() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Session missing. Please login again.");
        return;
    }

    try {
        const res = await fetch("https://realestate-4667.onrender.com/api/agent/properties", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            alert("Your session expired (401). Please logout and login again.");
            return;
        }

        const data = await res.json();
        const properties = data.properties || [];

        if (properties.length === 0) {
            alert("No properties found.");
            return;
        }

        // Generate Table Rows
        const tableRows = properties.map(p => {
            const propId = p.id || p._id;
            const safeData = encodeURIComponent(JSON.stringify(p));
            return `
                <tr>
                    <td>${propId}</td>
                    <td><strong>${p.title}</strong></td>
                    <td>${p.type}</td>
                    <td>$${p.price}</td>
                    <td><span class="status-badge ${p.status}">${p.status}</span></td>
                    <td>
                        <button class="edit-btn" onclick="openEditModal('${safeData}')">
                            <i class="fa-solid fa-pen"></i> Edit
                        </button>
                        <button class="delete-btn" onclick="requestDelete('${propId}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }).join("");

        // Render List Modal
        const listModalHtml = `
            <div id="viewPropertiesModal" class="modal-overlay" style="display:flex;">
                <div class="modal-content" style="max-width: 950px; width: 95%;">
                    <div class="modal-header">
                        <h3>My Real Estate Listings</h3>
                        <span class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</span>
                    </div>
                    <div style="overflow-x:auto;">
                        <table class="property-table">
                            <thead>
                                <tr><th>ID</th><th>Title</th><th>Type</th><th>Price</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>`;

        const oldModal = document.getElementById("viewPropertiesModal");
        if (oldModal) oldModal.remove();
        document.body.insertAdjacentHTML('beforeend', listModalHtml);

    } catch (err) {
        console.error("Fetch Error:", err);
        alert("Connection error. Is the server awake?");
    }
}

// ===================== 2. FULL EDIT MODAL =====================
window.openEditModal = function(encodedData) {
    const property = JSON.parse(decodeURIComponent(encodedData));
    const propId = property.id || property._id;

    // Helper for checkboxes
    const isChecked = (val, list) => {
        if (!list) return "";
        const items = Array.isArray(list) ? list : list.split(',').map(s => s.trim());
        return items.includes(val.trim()) ? "checked" : "";
    };

    const editModalHtml = `
        <div id="editPropertyModal" class="modal-overlay" style="display:flex; z-index: 10001;">
            <div class="modal-content" style="max-width: 850px;">
                <div class="modal-header">
                    <h3>Edit: ${property.title}</h3>
                    <span class="close-btn" onclick="document.getElementById('editPropertyModal').remove()">&times;</span>
                </div>
                <form id="editPropertyForm">
                    <div class="form-grid">
                        <div class="form-group"><label>Title</label><input type="text" id="ed_title" value="${property.title || ''}" required></div>
                        <div class="form-group"><label>Price ($)</label><input type="number" id="ed_price" value="${property.price || ''}" required></div>
                        <div class="form-group"><label>Type</label>
                            <select id="ed_type">
                                <option value="Flat" ${property.type==='Flat'?'selected':''}>Flat</option>
                                <option value="House" ${property.type==='House'?'selected':''}>House</option>
                                <option value="Villa" ${property.type==='Villa'?'selected':''}>Villa</option>
                            </select>
                        </div>
                        <div class="form-group"><label>City</label><input type="text" id="ed_city" value="${property.city || ''}"></div>
                        <div class="form-group full-width"><label>Image URL</label><input type="text" id="ed_image" value="${property.image || ''}"></div>
                        <div class="form-group"><label>Floor</label><input type="text" id="ed_floor" value="${property.floor || ''}"></div>
                        <div class="form-group"><label>Property Status</label>
                            <select id="ed_pstatus">
                                <option value="Ready" ${property.property_status==='Ready'?'selected':''}>Ready</option>
                                <option value="Under Construction" ${property.property_status==='Under Construction'?'selected':''}>Under Construction</option>
                            </select>
                        </div>
                        <div class="form-group full-width">
                            <label>Features</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="ed_feat" value="Smart Home" ${isChecked("Smart Home", property.features)}> Smart Home</label>
                                <label><input type="checkbox" name="ed_feat" value="Modular Kitchen" ${isChecked("Modular Kitchen", property.features)}> Modular Kitchen</label>
                                <label><input type="checkbox" name="ed_feat" value="Balcony" ${isChecked("Balcony", property.features)}> Balcony</label>
                            </div>
                        </div>
                        <div class="form-group full-width"><label>Description</label><textarea id="ed_desc" rows="3">${property.description || ''}</textarea></div>
                        <div class="form-group full-width">
                            <label>Amenities</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="ed_amen" value="Infinity Pool" ${isChecked("Infinity Pool", property.amenities)}> Infinity Pool</label>
                                <label><input type="checkbox" name="ed_amen" value="Gym" ${isChecked("Gym", property.amenities)}> Gym</label>
                                <label><input type="checkbox" name="ed_amen" value="Parking" ${isChecked("Parking", property.amenities)}> Parking</label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="save-btn" style="width:100%; margin-top:15px; background:#DAC064; color:#000;">Update Everything</button>
                </form>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', editModalHtml);

    // Save Logic
    document.getElementById("editPropertyForm").onsubmit = async (e) => {
        e.preventDefault();
        const features = Array.from(document.querySelectorAll('input[name="ed_feat"]:checked')).map(el => el.value).join(", ");
        const amenities = Array.from(document.querySelectorAll('input[name="ed_amen"]:checked')).map(el => el.value).join(", ");

        const bodyData = {
            title: document.getElementById("ed_title").value,
            price: document.getElementById("ed_price").value,
            type: document.getElementById("ed_type").value,
            city: document.getElementById("ed_city").value,
            image: document.getElementById("ed_image").value,
            floor: document.getElementById("ed_floor").value,
            property_status: document.getElementById("ed_pstatus").value,
            description: document.getElementById("ed_desc").value,
            features: features,
            amenities: amenities
        };

        const res = await fetch(`https://realestate-4667.onrender.com/api/properties/${propId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            },
            body: JSON.stringify(bodyData)
        });

        if (res.ok) {
            alert("Property fully updated! ✅");
            location.reload(); 
        } else {
            alert("Update failed. Check if you are authorized.");
        }
    };
};

// ===================== 3. DELETE LOGIC =====================
window.requestDelete = async function(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    const res = await fetch(`https://realestate-4667.onrender.com/api/dashboard/agent/property/${id}/request-delete`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) { alert("Deleted Successfully! ✅"); location.reload(); }
};



// ================= MODAL HELPERS =================
function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) modal.remove();
      document.body.style.overflow = "auto";
}


function showModal(contentHtml) {


  document.body.style.overflow = "hidden";
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing

  const modal = document.createElement("div");
  modal.classList.add("modal-overlay");
  modal.innerHTML = `
    <div class="modal">
      <span class="close-btn">&times;</span>
      ${contentHtml}
    </div>
  `;
  document.body.appendChild(modal);

  
  modal.querySelector(".close-btn").addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}




//===========================================================================================================
const viewProfileBtn = document.getElementById("viewProfileBtn");

if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) return alert("Login first!");

        try {
            const res = await fetch("https://realestate-4667.onrender.com/api/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const p = await res.json();
            
            const initial = p.name ? p.name.charAt(0).toUpperCase() : "E";

            // 1. Create Modal Elements Dynamically
            const overlay = document.createElement("div");
            overlay.className = "custom-modal-overlay";
            overlay.id = "profileModalOverlay";

            overlay.innerHTML = `
                <div class="profile-card">
                    <button class="close-cross" id="closeProfileCross">&times;</button>
                    
                    <div class="profile-avatar">${initial}</div>
                    <h2 class="profile-name">${p.name}</h2>
                    <div class="profile-role-sub">${p.role.toUpperCase()}</div>

                    <div class="info-box">
                        <span class="info-label">Registered Email</span>
                        <div class="info-text">${p.email}</div>
                    </div>

                    <div class="info-box" style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span class="info-label">Account Status</span>
                            <div class="info-text">ACTIVE</div>
                        </div>
                        <div style="width:8px; height:8px; background:#DAC064; border-radius:50%;"></div>
                    </div>

                    <button class="btn-close-luxury" id="closeProfileBtn">CLOSE PROFILE</button>
                </div>
            `;

            document.body.appendChild(overlay);

            // 2. Close Logic (Doni buttons sathi: Cross ani Button)
            const closeActions = () => {
                const modal = document.getElementById("profileModalOverlay");
                if (modal) modal.remove();
            };

            document.getElementById("closeProfileBtn").addEventListener("click", closeActions);
            document.getElementById("closeProfileCross").addEventListener("click", closeActions);

            // Overlay var click kelyavar pan band vhavyasathi
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) closeActions();
            });

        } catch (err) {
            console.error(err);
            alert("Error loading profile");
        }
    });
}




// ================= WELCOME TEXT =================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    document.getElementById("welcomeText").innerText =
      `Welcome ${data.name} 👋`;

  } catch (err) {
    console.error(err);
  }
});




document.addEventListener("DOMContentLoaded", () => {

  console.log("Dashboard JS Loaded ✅");

  const btn = document.getElementById("viewEnquiryBtn");

  if (!btn) {
    console.error("Button not found ❌");
    return;
  }

  btn.addEventListener("click", async () => {

    console.log("Button clicked 🔥");

    try {
      const res = await fetch("https://realestate-4667.onrender.com/api/agent/enquiries", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      console.log("Enquiries:", data);

      let html = `<h3>My Enquiries</h3>`;

      if (data.length === 0) {
        html += `<p>No enquiries found 😢</p>`;
      } else {
       data.forEach(enq => {
  html += `
    <div class="enquiry-card">
      <p><b>Name:</b> ${enq.name}</p>
      <p><b>Email:</b> ${enq.email}</p>
      <p><b>Mobile:</b> ${enq.mobile}</p>
      <p><b>Message:</b> ${enq.message}</p>


      <div class="card-actions">
            <button class="actionBtn whatsapp" data-mobile="${enq.mobile}">
                <i class="fab fa-whatsapp"></i>
            </button>
            <button class="actionBtn call" data-mobile="${enq.mobile}">
                <i class="fas fa-phone"></i>
            </button>
            <button class="actionBtn email" data-email="${enq.email}">
                <i class="fas fa-envelope"></i>
            </button>
        </div>
    </div>
  `;
});
      }

    
      showModal(html);

    

setTimeout(attachActionButtons, 100);

    } catch (err) {
      console.error("Fetch error:", err);
    }

  });

});



function startMinimalWidgets() {
  
    function updateClock() {
        const timeEl = document.getElementById('rs-time');
        const dayEl = document.getElementById('rs-day');
        if (!timeEl) return;

        const now = new Date();
        timeEl.innerText = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dayEl.innerText = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }


    function updateCalendar() {
        const daysContainer = document.getElementById('rs-calendar-days');
        const monthYearEl = document.getElementById('rs-month-year');
        if (!daysContainer) return;

        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const today = now.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthYearEl.innerText = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        daysContainer.innerHTML = "";

       
        for (let i = 0; i < firstDay; i++) {
            daysContainer.innerHTML += `<div></div>`;
        }

    
        for (let i = 1; i <= daysInMonth; i++) {
            const activeClass = i === today ? 'class="rs-today"' : '';
            daysContainer.innerHTML += `<div ${activeClass}>${i}</div>`;
        }
    }

    setInterval(updateClock, 1000);
    updateClock();
    updateCalendar();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMinimalWidgets);
} else {
    startMinimalWidgets();
}




window.loadAndShowProfile = async function() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("https://realestate-4667.onrender.com/api/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        window.renderStaticProfile(data);
    } catch (err) {
        console.error("Error:", err);
    }
};

window.renderStaticProfile = function(p) {
    const profileImg = p.profile_pic 
        ? `https://realestate-4667.onrender.com/${p.profile_pic}` 
        : `https://ui-avatars.com/api/?name=${p.name}&background=DAC064&color=000&size=128`;

    const html = `
        <div class="profile-card-container">
            <div class="profile-img-wrapper">
                <img src="${profileImg}" alt="Admin">
            </div>

            <h2 class="profile-user-name">${p.name}</h2>
            <p class="profile-user-role">${p.role}</p>

            <div class="profile-info-box">
                <span class="info-label">Registered Email</span>
                <span class="info-value">${p.email}</span>

                <span class="info-label">Account Status</span>
                <span class="status-badge">ACTIVE</span>
            </div>

            <button onclick="Swal.close()" class="profile-close-btn">
                CLOSE PROFILE
            </button>
        </div>
    `;

    Swal.fire({
        html: html,
        showConfirmButton: false,
        background: 'transparent',
        width: '420px'
    });
};
