// Sign-up form for the Monarch Lane Press list (MailerLite).
// Fill in the two IDs from the MailerLite embedded form code:
// the form's action looks like
// https://assets.mailerlite.com/jsonp/ACCOUNT_ID/forms/FORM_ID/subscribe
const MAILERLITE = {
  accountId: "",
  formId: "",
};

document.querySelectorAll("form[data-signup]").forEach((form) => {
  const msg = form.querySelector(".msg");
  const button = form.querySelector("button[type=submit]");
  const doneText = form.dataset.done;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    msg.textContent = "";

    const email = form.querySelector("input[type=email]");
    const consent = form.querySelector("input[name=consent]");
    const trap = form.querySelector("input[name=company]");

    if (!email.value || !email.checkValidity()) {
      msg.textContent = "Enter a valid email address, like name@example.com.";
      email.focus();
      return;
    }
    if (consent && !consent.checked) {
      msg.textContent = "Check the box to agree to receive the emails, then try again.";
      consent.focus();
      return;
    }
    if (trap && trap.value) {
      return; // filled by a bot
    }
    if (!MAILERLITE.accountId || !MAILERLITE.formId) {
      msg.textContent = "Sign-up isn't open yet. Please try again in a few days.";
      return;
    }

    const data = new FormData();
    data.append("fields[email]", email.value.trim());
    data.append("ml-submit", "1");
    data.append("anticsrf", "true");

    button.disabled = true;
    button.textContent = "Sending...";
    try {
      await fetch(
        `https://assets.mailerlite.com/jsonp/${MAILERLITE.accountId}/forms/${MAILERLITE.formId}/subscribe`,
        { method: "POST", body: data, mode: "no-cors" }
      );
      form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
      button.textContent = "Sent";
      msg.textContent = doneText;
    } catch (err) {
      button.disabled = false;
      button.textContent = form.dataset.label;
      msg.textContent =
        "The form couldn't reach the mailing service. Check your connection and try again.";
    }
  });
});
