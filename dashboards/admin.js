
// ================= AUTH DATA =================
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

console.log("TOKEN:", token);
console.log("ROLE:", role);

const name = localStorage.getItem("name");

// ================= PAGE INFO =================
const page = window.location.pathname.split("/").pop();
const LOGIN_PATH = "../SignUp-Login/signlog.htm";

// ================= AUTH CHECK =================
if (!token || !role) {
  alert("Please login first");
  window.location.href = LOGIN_PATH;
}

// ================= ROLE PROTECTION =================
if (page === "adminDashboard.html" && role !== "admin") {
  alert("Admins only");
  window.location.href = LOGIN_PATH;
}

// ================= LOGOUT =================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = LOGIN_PATH;
});

// ================= MODAL HELPERS =================
function closeModal() {
  const modal = document.querySelector(".modal-overlay");
  if (modal) modal.remove();
}

function showModal(contentHtml) {
  const old = document.querySelector(".modal-overlay");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
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

//user button code

document.getElementById("viewUsersBtn")?.addEventListener("click", async () => {
  try {
    console.log("🚀 Calling API...");

    const res = await fetch("https://realestate-4667.onrender.com/api/dashboard/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("✅ Status:", res.status);

    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    const users = data.users;

    console.log("📦 Users Data:", users);

    if (!users || users.length === 0) {
      showModal("<p>No users found</p>");
      return;
    }

    const tableHtml = `
      <h3 class="modal-title">All Users</h3>

      <table class="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          ${users.map(u => `
            <tr>
              <td>${u.id}</td>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td>${u.role}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    showModal(tableHtml);

  } catch (err) {
    console.error("❌ View Users Error:", err);
    alert("Error loading users");
  }
});

// ================= VIEW AGENTS =================
document.getElementById("viewAgentBtn")?.addEventListener("click", async () => {
  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/dashboard/users", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load users");

    const data = await res.json();
    const agents = data.users.filter(u => u.role === "agent");

    if (agents.length === 0) {
      showModal("<p>No agents found</p>");
      return;
    }

    const tableHtml = `
      <h3>All Agents</h3>
      <table border="1" width="100%" cellpadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => `
            <tr>
              <td>${agent.id}</td>
              <td>${agent.name}</td>
              <td>${agent.email}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    showModal(tableHtml);

  } catch (err) {
    console.error("View Agents Error:", err);
    alert("Error loading agents. Please log in again.");
    localStorage.clear();
    window.location.href = LOGIN_PATH;
  }
});






// ================= APPROVE AGENT =================
document.getElementById("approveAgentBtn")?.addEventListener("click", async () => {
  
  
  const { value: userId } = await Swal.fire({
    title: 'Approve Agent',
    text: 'Enter User ID to approve:',
    input: 'text',
    inputPlaceholder: 'User ID goes here...',
    confirmButtonColor: '#D4AF37', 
    showCancelButton: true
  });

  if (!userId) return; 

  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/dashboard/approve-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userIdToApprove: userId })
    });
    
    if (!res.ok) throw new Error("Approval failed");

    const data = await res.json();
    

    Swal.fire('Success!', data.message, 'success');

    document.getElementById("viewUsersBtn").click();

  } catch (err) {
    console.error("Approve Agent Error:", err);
    Swal.fire('Error', 'Something went wrong!', 'error');
  }
});


const blockAgentBtn = document.getElementById("blockAgentBtn");

if (blockAgentBtn) {
    blockAgentBtn.addEventListener("click", async () => {
        
        const { value: userId } = await Swal.fire({
            title: 'Delete Agent Permanently?',
            text: "Enter the User ID to remove from database:",
            input: 'text',
            inputPlaceholder: 'User ID goes here...',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#333',
            confirmButtonText: 'Yes, Delete Permanently!',
            cancelButtonText: 'Cancel',
            backdrop: `rgba(0,0,0,0.6)`
        });

        if (!userId) return;

        try {
            const response = await fetch("https://realestate-4667.onrender.com/api/dashboard/block-agent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ id: userId })
            });

            const data = await response.json();

            if (response.ok) {
                
                await Swal.fire({
                    title: 'Deleted!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonColor: '#D4AF37'
                });

                const viewUsersBtn = document.getElementById("viewUsersBtn");
                if (viewUsersBtn) {
                    viewUsersBtn.click(); 
                    console.log("🔄 Table refreshing...");
                }

            } else {
                Swal.fire('Error', data.error || 'Failed to delete', 'error');
            }

        } catch (err) {
            console.error("Delete Error:", err);
            Swal.fire('Server Error', 'Could not connect to backend', 'error');
        }
    });
}

// view my properties 
document.getElementById("viewPropertiesBtn")?.addEventListener("click", async () => {


  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const properties = await res.json();

    if (!properties || properties.length === 0) {
      alert("No properties found");
      return;
    }

    let tableHtml = `
      <h3>All Properties</h3>
      <table border="1" width="100%" cellpadding="8">
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
          ${properties.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.title}</td>
              <td>${p.type}</td>
              <td>${p.city}</td>
              <td>${p.price}</td>
              <td>${p.status}</td>
              <td><button class="deleteBtn" data-id="${p.id}">Delete</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    showModal(tableHtml);

  
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete permanently?")) return;
        const id = btn.dataset.id;

        try {
    
const res = await fetch(`https://realestate-4667.onrender.com/api/dashboard/admin/property/${id}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${token}`
    }
});
          if (!res.ok) throw new Error("Delete failed");
          alert("Deleted ✅");
          closeModal();
        } catch (err) {
          console.error(err);
          alert("Delete failed ❌");893


          .toExponential.apply
        }
      });
    });

  } catch (err) {
    console.error(err);
    alert("Error loading properties");
  }
});


console.log("JS file loaded ✅");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded ✅");

  const form = document.getElementById("addPropertyForm");

  if (!form) {
    console.error("❌ Form not found");
    return;
  }

  console.log("Form found ✅");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("🔥 Form submit event triggered");
  });
});





console.log("Admin JS loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded ✅");

  const addBtn = document.getElementById("addPropertyBtn");
  const modal = document.getElementById("addPropertyModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const form = document.getElementById("addPropertyForm");


  if (!addBtn) {
    console.error("❌ Add Property button not found");
    return;
  }

  if (!modal) {
    console.error("❌ Modal not found");
    return;
  }

  if (!form) {
    console.error("❌ Form not found");
    return;
  }

  console.log("Form, button and modal found ✅");

  // OPEN MODAL
  addBtn.addEventListener("click", () => {
    console.log("➕ Add Property clicked");
    modal.style.display = "block";
  });

  // CLOSE MODAL
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // FORM SUBMIT
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("🔥 Form submit triggered");

    const formData = new FormData(form);
    const propertyData = Object.fromEntries(formData.entries());





const amenitiesArr = Array.from(form.querySelectorAll('input[name="amenity"]:checked'))
                              .map(cb => cb.value);
    propertyData.amenities = amenitiesArr.join(', '); 

    const featuresArr = Array.from(form.querySelectorAll('input[name="feature"]:checked'))
                             .map(cb => cb.value);
    propertyData.features = featuresArr.join(', ');



    console.log("Sending Data 👉", propertyData);

    try {
      const res = await fetch("https://realestate-4667.onrender.com/api/dashboard/admin/property", {
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

      console.log("Property Added ✅", data);

      alert("Property added successfully");

      form.reset();
      modal.style.display = "none";

    } catch (err) {
      console.error("Error ❌", err);
      alert("Server error");
    }
  });
});





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
        
//       `;

//       showModal(profileHtml);

//     } catch (err) {
//       console.error("Load profile error:", err);
//       alert("Unable to load profile");
//     }
//   });
// }































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

//=========================================================================================================





async function fetchEnquiries(url) {
    try {
        console.log("Fetching enquiries from:", url);
        const res = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch enquiries");

        const data = await res.json();
        renderTable(data);

        const container = document.getElementById("enquiryContainer");
        if (container) container.style.display = "block";
    } catch (err) {
        console.error("Enquiry fetch error:", err);
    }
}



function renderTable(enquiries) {
    if (!enquiries || !enquiries.length) {
        showModal("<p style='color: black; text-align: center;'>No enquries yet</p>");
        return;
    }

    let html = `
        <h3 style="color: #DAC064; margin-bottom: 15px;">Property Enquiries</h3>
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Prop ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    enquiries.forEach(e => {
        html += `
            <tr>
                <td>${e.property_id || e.propertyId}</td>
                <td>${e.name}</td>
                <td title="${e.email}">${e.email}</td>
                <td>${e.mobile}</td>
                <td>${e.message || 'No Message'}</td>
                <td><span class="status-tag">${e.status || 'Pending'}</span></td>
                <td>
                    <div class="action-flex">
              
                    <button class="actionBtn whatsapp" data-mobile="${e.mobile}" data-email="${e.email}">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    
                    
                    <button class="actionBtn call" data-mobile="${e.mobile}" data-email="${e.email}">
                        <i class="fas fa-phone"></i>
                    </button>
                    
               
                    <button class="actionBtn email" data-mobile="${e.mobile}" data-email="${e.email}">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
                </td>
            </tr>
        `;
    });

    html += "</tbody></table>";

    showModal(html);

   
    setTimeout(() => {
        attachActionButtons();
    }, 200);
}

function attachActionButtons() {
    document.querySelectorAll('.actionBtn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const mobile = btn.dataset.mobile;
            const email = btn.dataset.email;

            if (btn.classList.contains('whatsapp')) {
                if (mobile && mobile !== "undefined") {
                    window.open(`https://wa.me/${mobile}?text=Hello`, '_blank');
                } else { alert("Mobile number missing!"); }
            } 
            else if (btn.classList.contains('call')) {
                if (mobile && mobile !== "undefined") {
                    window.location.assign(`tel:${mobile}`);
                } else { alert("Mobile number missing!"); }
            } 
            else if (btn.classList.contains('email')) {
                if (email && email !== "undefined") {
                    window.location.assign(`mailto:${email}?subject=Enquiry`);
                } else { alert("Email ID missing!"); }
            }
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const myPropBtn = document.getElementById("myPropertiesBtn");
    const allAgentsBtn = document.getElementById("allAgentsBtn");

    if (myPropBtn) {
        myPropBtn.onclick = async (e) => {
            e.preventDefault();
            fetchEnquiries("https://realestate-4667.onrender.com/api/dashboard/admin/enquiries/my-Properties");
        };
    }

    if (allAgentsBtn) {
        allAgentsBtn.onclick = (e) => {
            e.preventDefault();
            fetchEnquiries("https://realestate-4667.onrender.com/api/dashboard/admin/enquiries/all-agents");
        };
    }
})





document.addEventListener("DOMContentLoaded", async () => {
    try {
       
        const token = localStorage.getItem("token");

        
        if (!token) {
            console.error("No token found, redirecting to login...");
            window.location.href = "login.html"; 
            return;
        }

  
        const res = await fetch("https://realestate-4667.onrender.com/api/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

     
        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Profile Data:", data);

    
        const welcomeEl = document.getElementById("welcomeText");
        
        if (welcomeEl && data.name) {
            welcomeEl.innerText = `Welcome ${data.name} 👋`;
        } else {
            console.warn("Welcome element or user name not found in response.");
        }

    } catch (err) {
        console.error("Error fetching profile:", err);
    }
});

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


async function loadMessages() {
  try {
    const res = await fetch("https://realestate-4667.onrender.com/api/contact_messages");
    const data = await res.json();
      if (!data.length) {
      showModal(`
        <div style="text-align:center; padding:40px;">
          <div style="font-size:60px;">💬</div>
          <h2>No Messages Available</h2>
          <p style="color:#777;">When users send messages, they will appear here.</p>
        </div>
      `);
      return;
    }

    let html = `
      <h3>Messages</h3>

      <div class="msg-table-wrapper">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
    `;

    data.forEach(msg => {
      html += `
        <tr>
          <td>${msg.name}</td>
          <td>${msg.email}</td>
          <td>${msg.mobile}</td>
          <td>${msg.message}</td>

          <td>
            <button class="deleteMsgBtn" data-id="${msg.id}">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    showModal(html);

  
    setTimeout(() => {
      document.querySelectorAll(".deleteMsgBtn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;

          if (!confirm("Delete this message?")) return;

          try {
            const res = await fetch(
              `https://realestate-4667.onrender.com/api/contact_messages/${id}`,
              { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Delete failed");

            alert("Message deleted ✅");

            loadMessages(); 

          } catch (err) {
            console.error(err);
            alert("Delete failed ❌");
          }
        });
      });
    }, 100);

  } catch (err) {
    console.error(err);
  }
}



async function fetchMyProperties() {
    const endpoint = `https://realestate-4667.onrender.com/api/dashboard/admin/enquiries/my-properties`;
    console.log("Fetching from:", endpoint); //

    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}`, 
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("My Properties Data:", data);

        if (data.length === 0) {
            document.querySelector('#propertyContainer').innerHTML = "<p>No properties found.</p>";
            return;
        }

        renderProperties(data); 

    } catch (err) {
        console.error("Fetch error:", err);
    }
}





document.addEventListener("DOMContentLoaded", () => {
    const viewBtn = document.getElementById("viewAgentPropertiesBtn");

    if (viewBtn) {
        viewBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

   
            const { value: agentId } = await Swal.fire({
                title: 'Agent Search',
                text: 'Enter the Agent ID to view their listings',
                input: 'text',
                inputPlaceholder: 'Enter Agent ID...',
                showCancelButton: true,
                confirmButtonText: 'Search',
                confirmButtonColor: '#DAC064'
            });

            if (!agentId) return;

            try {
         
                const res = await fetch(`https://realestate-4667.onrender.com/api/dashboard/admin/agent/${agentId}/properties`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();

                if (!res.ok) {
                    Swal.fire('Error', data.message || 'Agent not found', 'error');
                    return;
                }

                const properties = data.properties;

                if (!properties || properties.length === 0) {
                    Swal.fire('Info', 'No properties found for this agent.', 'info');
                    return;
                }

            
                let tableHtml = `
                    <div class="modal-header">
                        <h3>Properties for Agent ID: ${agentId}</h3>
                    </div>
                    <table border="1" width="100%" cellpadding="8" style="border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>City</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${properties.map(p => `
                                <tr>
                                    <td>${p.id}</td>
                                    <td>${p.title}</td>
                                    <td>${p.city}</td>
                                    <td>₹${p.price}</td>
                                    <td><button class="deleteBtn" data-id="${p.id}">Delete</button></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                `;

            
                showModal(tableHtml);

               
                document.querySelectorAll(".deleteBtn").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        if (!confirm("Delete this property permanently?")) return;
                        const propId = btn.dataset.id;

                        try {
                            const delRes = await fetch(`https://realestate-4667.onrender.com/api/dashboard/admin/property/${propId}`, {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            if (delRes.ok) {
                                alert("Property Deleted ✅");
                                closeModal();
                            } else {
                                alert("Failed to delete property ❌");
                            }
                        } catch (err) {
                            console.error("Delete Error:", err);
                        }
                    });
                });

            } catch (err) {
                console.error("Fetch Error:", err);
                Swal.fire('Error', 'Unable to connect to server.', 'error');
            }
        });
    }
});