


document.addEventListener("DOMContentLoaded", () => {

    // ================= PANEL TOGGLE =================
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.querySelector(".container");

    if (signUpButton && signInButton && container) {
        signUpButton.addEventListener("click", () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener("click", () => {
            container.classList.remove("right-panel-active");
        });
    }

    // ================= PASSWORD TOGGLE =================
    // Note: He function global scope madhe aslele bare, jar tu HTML madhun onclick="togglePassword()" vaprat asshil tar.
    window.togglePassword = function(id) {
        const input = document.getElementById(id);
        if (input) {
            input.type = input.type === "password" ? "text" : "password";
        }
    };

    // ================= SIGNUP =================
    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = signupForm.name.value.trim();
            const email = signupForm.email.value.trim();
            const password = signupForm.password.value.trim();

            if (!name || !email || !password) {
                alert("All fields are required");
                return;
            }

            try {
                const res = await fetch("https://realestate-4667.onrender.com/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    alert("Signup successful! Please login.");
                    signupForm.reset();
                    if(container) container.classList.remove("right-panel-active");
                } else {
                    alert(data.error || "Signup failed");
                }

            } catch (err) {
                console.error("Signup error:", err);
                alert("Server error during signup");
            }
        });
    }

    // ================= LOGIN =================
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = loginForm.email.value.trim();
            const password = loginForm.password.value.trim();

            if (!email || !password) {
                alert("Email and password required");
                return;
            }

            try {
                const res = await fetch("https://realestate-4667.onrender.com/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const contentType = res.headers.get("content-type");

                if (!contentType || !contentType.includes("application/json")) {
                    const text = await res.text();
                    console.error("HTML received instead of JSON:", text);
                    alert("Backend error: check login API");
                    return;
                }

                const data = await res.json();
                console.log("LOGIN RESPONSE:", data);

                if (!res.ok) {
                    alert(data.error || "Invalid credentials");
                    return;
                }

          
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                localStorage.setItem("userId", data.userId || "");

            
                if (data.role === "admin") {
                    window.location.href = "../dashboards/adminDashboard.html";
                } else if (data.role === "agent") {
                    window.location.href = "../dashboards/agentDashboard.html";
                } else {
                    window.location.href = "../dashboards/user_dashboard/user.htm";
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("Server error during login");
            }
        });
    }

    // ---------------- Menu Toggle ----------------
    const menuIcon = document.querySelector('.menu-icon i');
    const navPart2 = document.querySelector('.navpart2');

    if (menuIcon && navPart2) {
        menuIcon.addEventListener('click', () => {
            navPart2.classList.toggle('active');
            menuIcon.classList.toggle('fa-bars');
            menuIcon.classList.toggle('fa-xmark');
        });
    }

    // ---------------- Animations (GSAP) ----------------
    if (typeof gsap !== "undefined") {
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

        // SplitType Text Animation
        const navTitle = document.querySelector(".navbar h6");
        if (navTitle && typeof SplitType !== "undefined") {
            const splitNav = new SplitType(navTitle, { types: "chars" });
            gsap.from(splitNav.chars, { y: -20, opacity: 0, duration: 0.5, stagger: 0.1 });
        }
    }

});
