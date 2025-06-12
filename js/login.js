// ROUTES
const LOGIN_ROUTE = "http://localhost:5678/api/users/login";

// ELEMENTS
const ERROR_MESSAGE = document.querySelector(".loginSection__errorMessage");
const EMAIL_INPUT = document.querySelector(".loginSection__mail");
const PASSWORD_INPUT = document.querySelector(".loginSection__password");
const SUBMIT_BUTTON = document.querySelector(".loginSection__submit");

// FUNCTIONS
const loginAttempt = async (pEmail, pPassword) => {
  // Create Request Body
  const payload = {
    email: pEmail,
    password: pPassword,
  };

  try {
    // Send the Request
    const res = await fetch(LOGIN_ROUTE, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      // Store the token in the session storage
      sessionStorage.setItem("userId", data.userId);
      sessionStorage.setItem("userToken", data.token);
      // Redirect user to the index page
      window.location.href = "index.html";
    } else {
      // Status "404" => User not found
      if (res.status == 404) {
        throw new Error("User not found");
      }
      // Status "401" => Wrong password
      if (res.status === 401) {
        throw new Error("Incorrect password");
      }
    }
  } catch (error) {
    ERROR_MESSAGE.textContent = `Error: ${error.message}`;
  }
};

// Callback
SUBMIT_BUTTON.addEventListener("click", (e) => {
  e.preventDefault();
  loginAttempt(
    EMAIL_INPUT.value,
    PASSWORD_INPUT.value
  );
});
