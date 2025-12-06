import { auth } from './firebase-config.js';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Initialize reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'normal', // or 'invisible'
    callback: () => {
        console.log("reCAPTCHA completed");
    },
    'expired-callback': () => {
        console.log("reCAPTCHA expired. Please solve again.");
    }
}, auth);

// Send OTP
document.getElementById('send-otp-btn').addEventListener('click', () => {
    const phoneNumber = document.getElementById('phone-input').value;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert("OTP sent successfully!");
        })
        .catch((error) => {
            console.error("Error sending OTP:", error);
            alert(error.message);
        });
});

// Verify OTP
document.getElementById('verify-otp-btn').addEventListener('click', () => {
    const otp = document.getElementById('otp-input').value;

    window.confirmationResult.confirm(otp)
        .then((result) => {
            const user = result.user;
            console.log("User signed in:", user);
            alert("Phone number verified successfully!");
        })
        .catch((error) => {
            console.error("Error verifying OTP:", error);
            alert(error.message);
        });
});
