document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html"; 
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/api/auth/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const user = await response.json();

        if (response.ok) {
          
            document.getElementById("userNameDisplay").innerText = user.name.split(' ')[0];
            document.getElementById("fullName").innerText = user.name;
            document.getElementById("userEmail").innerText = user.email;
            document.getElementById("userPhone").innerText = user.phone || "Not Provided";
        }
    } catch (err) {
        console.error("Dashboard Error:", err);
    }

  
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
});






// ================= WELCOME TEXT =================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/profile", {
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