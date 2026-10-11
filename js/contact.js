/*
  EmailJS contact form setup
  --------------------------
  Replace the three placeholder values below with the values from your EmailJS account:
    1) PUBLIC_KEY
    2) SERVICE_ID
    3) TEMPLATE_ID

  Recommended EmailJS template variables:
    {{from_name}}
    {{reply_to}}
    {{subject}}
    {{message}}
    {{project_name}}
*/

const EMAILJS_CONFIG = {
  PUBLIC_KEY: "YOUR_PUBLIC_KEY",
  SERVICE_ID: "YOUR_SERVICE_ID",
  TEMPLATE_ID: "YOUR_TEMPLATE_ID"
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submitButton = document.getElementById("contact-submit");

  if (!form || !status || !submitButton) return;

  const isConfigured = !Object.values(EMAILJS_CONFIG).some((value) =>
    value.startsWith("YOUR_")
  );

  if (isConfigured && window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!isConfigured || !window.emailjs) {
      status.textContent =
        "EmailJS is not configured yet. Add your Public Key, Service ID and Template ID in js/contact.js.";
      status.className = "form-status form-status-error";
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    status.textContent = "Sending your message…";
    status.className = "form-status";

    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        form
      );

      form.reset();
      status.textContent = "Message sent successfully. Thank you for contacting us.";
      status.className = "form-status form-status-success";
    } catch (error) {
      console.error("EmailJS error:", error);
      status.textContent =
        "The message could not be sent. Please try again or contact a team member directly.";
      status.className = "form-status form-status-error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
});
