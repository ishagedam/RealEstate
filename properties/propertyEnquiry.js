

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const propertyIdFromURL = params.get("propertyId");

  const propertyInput = document.getElementById("propertyId");
  const form = document.getElementById("propertyEnquiryForm");

  if (!form) {
    console.error("Form with ID 'propertyEnquiryForm' not found!");
    return;
  }

  if (propertyInput && propertyIdFromURL) {
    propertyInput.value = propertyIdFromURL;
    console.log("Property ID Set:", propertyIdFromURL);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      propertyId: Number(propertyInput.value),
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      mobile: document.getElementById("mobile").value,
      message: document.getElementById("message").value
    };

    console.log("Sending Data:", data);

    if (!data.propertyId) {
      alert("Property ID missing! URL नीट तपासा.");
      return;
    }

    try {
  
      const res = await fetch("https://realestate-4667.onrender.com/api/enquiries", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
         
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission Failed");
      }

      alert("Enquiry submitted successfully ✅");
      form.reset();

    } catch (err) {
      console.error("Submission Error:", err);
      alert("Error submitting enquiry ❌: " + err.message);
    }
  });
});