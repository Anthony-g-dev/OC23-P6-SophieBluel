// CONSTANTS
const routes = {
    login: "http://localhost:5678/api/users/login",
}


// VARIABLES
let loginElements = {
    errorMessage: document.querySelector(".loginSection__errorMessage"),
    emailInput: document.querySelector(".loginSection__mail"),
    passwordInput: document.querySelector(".loginSection__password"),
    submitButton: document.querySelector(".loginSection__submit")
}


// FUNCTIONS
let loginAttempt = async (pEmail, pPassword) => {
    // Create Request Body
    const reqBody = {
        email: pEmail, 
        password: pPassword
    };

    try {
        // Send the Request
        const res = await fetch(routes["login"], {
            method: "POST",
            headers: {"Content-Type": "application/json;charset=utf-8"},
            body: JSON.stringify(reqBody)
        });
        
        if (res.ok) {
            const data = await res.json();
            // Store the token in the session storage
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("userToken", data.token);
            // Redirect user to the index page
            window.location.href = "index.html";
        } else { // Error catcher
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
        loginElements["errorMessage"].textContent = `Error: ${error.message}`;
    }
}


// Callback
loginElements["submitButton"].addEventListener("click", (e) => {
    e.preventDefault();
    loginAttempt(loginElements["emailInput"].value, loginElements["passwordInput"].value);
});