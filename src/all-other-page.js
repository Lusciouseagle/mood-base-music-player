document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".code-input");
    const verifyBtn = document.getElementById("verifyBtn");
    const resendBtn = document.getElementById("resendBtn");
    const errorMsg = document.getElementById("errorMsg");

    let timer = 60;
    let countdown;

    // Auto-jump to next input
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            validateCode();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && index > 0 && input.value === "") {
                inputs[index - 1].focus();
            }
        });
    });

    // Validate if all inputs are filled
    function validateCode() {
        let code = "";
        inputs.forEach((input) => {
            code += input.value;
        });
        verifyBtn.disabled = code.length !== inputs.length;
    }

    // Start Resend Timer
    function startResendTimer() {
        resendBtn.disabled = true;
        resendBtn.textContent = `Resend Code (${timer}s)`;
        countdown = setInterval(() => {
            timer--;
            resendBtn.textContent = `Resend Code (${timer}s)`;
            if (timer === 0) {
                clearInterval(countdown);
                resendBtn.disabled = false;
                resendBtn.textContent = "Resend Code";
            }
        }, 1000);
    }

    // Start timer on page load
    startResendTimer();

    // Resend Code Handler
    resendBtn.addEventListener("click", function () {
        timer = 60;
        startResendTimer();
        errorMsg.textContent = "New code has been sent!";
    });

    // Verify Button Click
    verifyBtn.addEventListener("click", async function () {
        let enteredCode = "";
        inputs.forEach((input) => enteredCode += input.value);
    
        try {
            const response = await fetch("http://localhost:5000/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: enteredCode }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                alert("Email verified successfully!");
                window.location.href = "index.html"; // Redirect to mood-based music player
            } else {
                errorMsg.innerText = "Invalid verification code. Please try again.";
                errorMsg.style.color = "red";
            }
        } catch (error) {
            console.error("Verification error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
    
});
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.querySelectorAll(".toggle-password");

    togglePassword.forEach((eyeIcon) => {
        eyeIcon.addEventListener("click", function () {
            const passwordField = this.previousElementSibling;

            if (passwordField.type === "password") {
                passwordField.type = "text"; // Show password
                this.classList.remove("fa-eye"); // Change to closed eye icon
                this.classList.add("fa-eye-slash");
            } else {
                passwordField.type = "password"; // Hide password
                this.classList.remove("fa-eye-slash"); // Change to open eye icon
                this.classList.add("fa-eye");
            }
        });
    });
    const forgotPasswordBtn = document.getElementById("forgot-password-btn");
    const loginEmailInput = document.getElementById("login-email");

    if (forgotPasswordBtn) {
        forgotPasswordBtn.disabled = true;  // Initially disabled

        loginEmailInput.addEventListener("input", () => {
            const email = loginEmailInput.value.trim();
            forgotPasswordBtn.disabled = !email.endsWith("@gmail.com") && !email.endsWith("@paruluniversity.ac.in");
        });

        forgotPasswordBtn.addEventListener("click", async () => {
            const email = loginEmailInput.value.trim();
            if (!email) {
                alert("Please enter your email first.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/check-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();
                if (data.exists) {
                    window.location.href = "forgot-password.html";
                } else {
                    alert("Account doesn't exist. Please sign up first.");
                }
            } catch (error) {
                console.error("Error checking email:", error);
                alert("Something went wrong. Please try again later.");
            }
        });
    }

});
function checkInputs() {
    const name = document.getElementById("signup-name")?.value || "";
    const email = document.getElementById("signup-email")?.value || "";
    const password = document.getElementById("signup-password")?.value || "";

    const signupButton = document.getElementById("signup-btn");
    if (signupButton) {
        signupButton.disabled = !(name && email && password);
        signupButton.style.background = signupButton.disabled ? "#ccc" : "#4CAF50"; // Change color
    }

    const loginEmail = document.getElementById("login-email")?.value || "";
    const loginPassword = document.getElementById("login-password")?.value || "";

    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
        loginButton.disabled = !(loginEmail && loginPassword);
        loginButton.style.background = loginButton.disabled ? "#ccc" : "#4CAF50";
    }
}

// Attach event listeners
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", checkInputs);
});
document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMessage = document.getElementById("login-error-message");

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.innerText = data.message; // Show error message to the user
            errorMessage.style.color = "red";
        } else {
            window.location.href = "index.html"; // Redirect on success
        }
    } catch (error) {
        console.error("Login Error:", error);
        errorMessage.innerText = "An error occurred. Please try again.";
    }
});
document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const errorMessage = document.getElementById("signup-error-message");

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|paruluniversity\.ac\.in)$/;
    if (!emailRegex.test(email)) {
        errorMessage.innerText = "Email must be @gmail.com or @paruluniversity.ac.in.";
        return;
    }

    // Password validation
    const passwordRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (!passwordRegex.test(password)) {
        errorMessage.innerText = "Password must be 5-15 characters, letters, and numbers only.";
        return;
    }

    try {
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.innerText = data.message;
            errorMessage.style.color = "red";
        } else {
            window.location.href = "verification.html"; // Redirect to verification page
        }
    } catch (error) {
        console.error("Signup Error:", error);
        errorMessage.innerText = "An error occurred. Please try again.";
    }
});

document.getElementById("update-password-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const errorMsg = document.getElementById("update-password-error");

    if (newPassword !== confirmPassword) {
        errorMsg.innerText = "Passwords do not match!";
        errorMsg.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/update-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();

        if (data.success) {
            alert("Password updated successfully!");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            errorMsg.innerText = "Error updating password!";
            errorMsg.style.color = "red";
        }
    } catch (error) {
        console.error("Update password error:", error);
        alert("Something went wrong. Please try again.");
    }
});
document.getElementById("verify-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = localStorage.getItem("userEmail"); // Store email in localStorage on signup
    const code = document.getElementById("verification-code").value;
    const errorMessage = document.getElementById("verify-error-message");

    try {
        const response = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.innerText = data.message;
            errorMessage.style.color = "red";
        } else {
            window.location.href = "index.html"; // Redirect on success
        }
    } catch (error) {
        console.error("Verification Error:", error);
        errorMessage.innerText = "An error occurred. Please try again.";
    }
});
// Update the forgot password logic
document.getElementById("forgot-password-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
        alert("Please enter your email first.");
        return;
    }

    try {
        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.text();

        if (response.ok) {
            window.location.href = 'verify-code.html';
        } else {
            alert(data);
        }
    } catch (error) {
        console.error("Error checking email:", error);
        alert("Something went wrong. Please try again later.");
    }
});