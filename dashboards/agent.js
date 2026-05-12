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



//==================================

const amenitiesArr = Array.from(e.target.querySelectorAll('input[name="amenity"]:checked'))
                                .map(cb => cb.value);
    propertyData.amenities = amenitiesArr.join(', '); 

const featuresArr = Array.from(e.target.querySelectorAll('input[name="feature"]:checked'))
                               .map(cb => cb.value);
    propertyData.features = featuresArr.join(', ');

//=================================

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



// ===================== VIEW MY PROPERTIES WITH EDIT & DELETE =====================
const viewBtn = document.getElementById("viewMyPropertyBtn");
const myPropertyContainer = document.getElementById("myPropertyContainer");

// ================= EDIT MODAL =================
let editModal = null;
let editModalOpen = false;

function createEditModal() {
  editModal = document.createElement("div");
  editModal.id = "editModal";
  editModal.style = `
    display:none;
    position:fixed;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background:white;
    padding:20px;
    border:1px solid #ccc;
    z-index:1000;
  `;
  document.body.appendChild(editModal);
}

function openEditModal(property) {
  if (!editModal) createEditModal();
  if (editModalOpen) {
    editModal.style.display = "none";
    editModalOpen = false;
    return;
  }

  editModal.innerHTML = `
    <h3>Edit Property</h3>
    <span id="closeEditModalBtn" style="cursor:pointer; float:right;">&times;</span>
    <form id="editPropertyForm">
      <input type="hidden" id="editPropertyId" value="${property.id}">
      <label>Title:</label><br>
      <input type="text" id="editPropertyTitle" value="${property.title}" required><br><br>
      <label>Type:</label><br>
      <input type="text" id="editPropertyType" value="${property.type}" required><br><br>
      <label>City:</label><br>
      <input type="text" id="editPropertyCity" value="${property.city}" required><br><br>
      <label>Price:</label><br>
      <input type="number" id="editPropertyPrice" value="${property.price}" required><br><br>
      <label>Status:</label><br>
      <select id="editPropertyStatus">
        <option value="pending" ${property.status==="pending"?"selected":""}>Pending</option>
        <option value="approved" ${property.status==="approved"?"selected":""}>Approved</option>
        <option value="rejected" ${property.status==="rejected"?"selected":""}>Rejected</option>
      </select><br><br>
      <button type="submit">Save</button>
    </form>
  `;

  document.getElementById("closeEditModalBtn").addEventListener("click", () => {
    editModal.style.display = "none";
    editModalOpen = false;
  });

  document.getElementById("editPropertyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editPropertyId").value;
    const updatedData = {
      title: document.getElementById("editPropertyTitle").value,
      type: document.getElementById("editPropertyType").value,
      city: document.getElementById("editPropertyCity").value,
      price: document.getElementById("editPropertyPrice").value,
      status: document.getElementById("editPropertyStatus").value
    };
    try {
      const res = await fetch(`https://realestate-4667.onrender.com/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      alert("Property updated successfully");
      editModal.style.display = "none";
      editModalOpen = false;
      loadMyProperties();
    } catch (err) {
      console.error("Edit property error:", err);
      alert("Server error while updating property");
    }
  });

  editModal.style.display = "block";
  editModalOpen = true;
}

// ================= REQUEST DELETE =================
async function requestDelete(id) {
  if (!confirm("Are you sure you want to request delete this property?")) return;
  try {
    const res = await fetch(`https://realestate-4667.onrender.com/api/dashboard/agent/property/${id}/request-delete`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Delete request failed");
    }
    alert("Delete request sent successfully ✅");
    loadMyProperties();
  } catch (err) {
    console.error("Request delete error:", err);
    alert("Failed to send delete request ❌");
  }
}

// ================= BUTTON CLICK =================
viewBtn.addEventListener("click", () => {
  loadMyProperties();
});

// ===================== LOAD PROPERTIES =====================
async function loadMyProperties() {

  
  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/agent/properties", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();

    if (!data.properties || data.properties.length === 0) {
      alert("No properties found");
      return;
    }

    let contentHtml = `
      <table border="1" style="width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>City</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${data.properties.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.title}</td>
              <td>${p.type}</td>
              <td>${p.city}</td>
              <td>${p.price}</td>
              <td>${p.status}</td>
              <td>
                <button class="editBtn" data-prop='${JSON.stringify(p).replace(/'/g,"&apos;")}'>Edit</button> <br><br/>

                <button class="deleteBtn" data-id="${p.id}">Delete</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    
    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
      <div class="modal" style="position:relative; background:#fff; padding:20px; max-width:800px; margin:50px auto;">
        <span class="close-btn" style="
          position:absolute;
          top:10px;
          right:15px;
          font-size:24px;
          cursor:pointer;
          font-weight:bold;
        ">&times;</span>
        ${contentHtml}
      </div>
    `;
    document.body.appendChild(modal);

    
    modal.querySelector(".close-btn").addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

  
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const property = JSON.parse(btn.getAttribute("data-prop").replace(/&apos;/g,"'"));
        openEditModal(property);
      });
    });

    

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        requestDelete(id);
      });
    });

  } catch (err) {
    console.error("Load properties error:", err);
    alert("Error loading properties");
  }
}





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




// const viewProfileBtn = document.getElementById("viewProfileBtn");

// if (viewProfileBtn) {
//   viewProfileBtn.addEventListener("click", async () => {
//     try {
//       const res = await fetch("https://realestate-4667.onrender.com/api/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (!res.ok) throw new Error("Failed to load profile");

//       const p = await res.json();

//       const profileHtml = `
//         <h3>My Profile</h3>
//         <table border="1" style="width:100%; margin-top:10px;">
//           <tr><th>ID</th><td>${p.id}</td></tr>
//           <tr><th>Name</th><td>${p.name}</td></tr>
//           <tr><th>Email</th><td>${p.email}</td></tr>
//           <tr><th>Mobile</th><td>${p.mobile}</td></tr>
//           <tr><th>Role</th><td>${p.role}</td></tr>
//           <tr><th>Joined</th><td>${new Date(p.created_at).toLocaleDateString()}</td></tr>
//         </table>
//         <button onclick="closeModal()" style="margin-top:10px;">Close</button>
//       `;

//       showModal(profileHtml);

//     } catch (err) {
//       console.error("Load profile error:", err);
//       alert("Unable to load profile");
//     }
//   });
// }













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

//=========================================================================================================









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








//==============================================================================================================
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
