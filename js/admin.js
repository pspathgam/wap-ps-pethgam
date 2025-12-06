import { auth } from './firebase-config.js';
import { RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Initialize reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'normal',
    callback: () => {
        console.log("reCAPTCHA completed");
    },
    'expired-callback': () => {
        console.log("reCAPTCHA expired");
    }
}, auth);

// Send OTP
const phoneNumber = "+91xxxxxxxxxx";
const appVerifier = window.recaptchaVerifier;

signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP sent!");
    })
    .catch((error) => {
        console.error("Error sending OTP:", error);
    });
