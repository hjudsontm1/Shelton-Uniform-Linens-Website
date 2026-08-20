(() => {
  "use strict";

  const form = document.querySelector("[data-quote-form]");
  if (!form) return;

  const submit = form.querySelector("[data-quote-submit]");
  const submitLabel = form.querySelector("[data-quote-submit-label]");
  const submitIcon = form.querySelector("[data-quote-submit-icon]");
  const status = form.querySelector("[data-quote-status]");
  const pageUrlField = form.querySelector("[data-quote-page-url]");
  const submittedAtField = form.querySelector("[data-quote-submitted-at]");
  const idleLabel = submit?.dataset.idleLabel || "Send my quote brief";
  const submissionReceiptKey = "sheltonSubmissionReceiptV1";
  const requiredFields = Array.from(form.querySelectorAll("input[required], select[required], textarea[required]"));
  const fieldNames = {
    company: "business name",
    name: "name",
    email: "email address",
    industry: "industry"
  };
  let inFlight = false;
  let activeController = null;
  let validationAnnouncementTimer = 0;

  const markSubmissionReceipt = () => {
    try {
      window.sessionStorage.setItem(submissionReceiptKey, JSON.stringify({
        v: 1,
        kind: "quote",
        at: Date.now()
      }));
    } catch {
      // Confirmation remains neutral if session storage is unavailable.
    }
  };

  if (pageUrlField) pageUrlField.value = window.location.href;

  const errorIdFor = (field) => `${field.id || field.name || "quote-field"}-error`;

  const getErrorNode = (field) => {
    const errorId = errorIdFor(field);
    let error = document.getElementById(errorId);
    if (!error) {
      error = document.createElement("span");
      error.id = errorId;
      error.className = "field-error";
      error.hidden = true;
      field.insertAdjacentElement("afterend", error);
    }

    const describedBy = new Set((field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(errorId);
    field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
    return error;
  };

  const validationMessageFor = (field) => {
    if (field.validity.typeMismatch && field.type === "email") return "Enter a valid email address.";
    if (field.validity.valueMissing && field.name === "industry") return "Choose an industry.";
    if (field.validity.valueMissing) {
      const fieldName = fieldNames[field.name] || "required field";
      return `Enter your ${fieldName}.`;
    }
    return "Review this field before sending.";
  };

  const showFieldError = (field) => {
    const error = getErrorNode(field);
    error.textContent = validationMessageFor(field);
    error.hidden = false;
    field.setAttribute("aria-invalid", "true");
  };

  const clearFieldError = (field) => {
    const error = document.getElementById(errorIdFor(field));
    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
    field.removeAttribute("aria-invalid");
  };

  const setStatus = (message = "", state = "", reason = "") => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
    status.dataset.reason = reason;
    status.setAttribute("role", state === "error" ? "alert" : "status");
    status.setAttribute("aria-live", state === "error" ? "assertive" : "polite");
  };

  const setSubmitState = (state) => {
    const isSending = state === "sending";
    const isSent = state === "sent";
    form.setAttribute("aria-busy", String(isSending));

    if (submit) {
      submit.disabled = isSending || isSent;
      submit.classList.toggle("is-sending", isSending);
      submit.dataset.state = state;
    }

    if (submitLabel) {
      submitLabel.textContent = isSending ? "Sending quote brief" : isSent ? "Quote brief sent" : idleLabel;
    }

    if (submitIcon) {
      submitIcon.className = isSending ? "ph ph-circle-notch" : isSent ? "ph ph-check" : "ph ph-arrow-right";
    }
  };

  form.addEventListener("invalid", (event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    showFieldError(field);
    window.clearTimeout(validationAnnouncementTimer);
    validationAnnouncementTimer = window.setTimeout(() => {
      setStatus("Please complete the highlighted required fields.", "error", "validation");
    }, 0);
  }, true);

  requiredFields.forEach((field) => {
    const clearWhenValid = () => {
      if (!field.validity.valid) return;
      clearFieldError(field);
      if (!form.querySelector("[aria-invalid='true']") && status?.dataset.reason === "validation") {
        setStatus();
      }
    };
    field.addEventListener("input", clearWhenValid);
    field.addEventListener("change", clearWhenValid);
  });

  if (!("fetch" in window) || !("FormData" in window) || !("AbortController" in window)) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (inFlight) return;

    requiredFields.forEach((field) => {
      if (field.validity.valid) clearFieldError(field);
    });

    inFlight = true;
    activeController = new AbortController();
    const configuredTimeout = Number.parseInt(form.dataset.submitTimeout || "15000", 10);
    const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 15000;
    const timeoutId = window.setTimeout(() => activeController?.abort(), timeoutMs);

    if (pageUrlField) pageUrlField.value = window.location.href;
    if (submittedAtField) submittedAtField.value = new Date().toISOString();
    setSubmitState("sending");
    setStatus("Sending your quote brief…", "sending");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: activeController.signal
      });

      if (!response.ok) {
        const requestError = new Error("Quote request was not accepted");
        requestError.status = response.status;
        throw requestError;
      }

      setSubmitState("sent");
      setStatus("Quote brief sent. Opening confirmation…", "success");
      markSubmissionReceipt();
      window.setTimeout(() => window.location.assign("thank-you.html"), 220);
    } catch (error) {
      const timedOut = error?.name === "AbortError";
      const rateLimited = error?.status === 429;
      const message = timedOut
        ? "The request took too long. Your details are still here. Please try again."
        : rateLimited
          ? "We’re receiving several requests right now. Your details are still here. Please try again shortly."
          : "We couldn’t send the request just now. Your details are still here. Please try again.";

      setSubmitState("idle");
      setStatus(message, "error", "submission");
      status?.focus({ preventScroll: true });
    } finally {
      window.clearTimeout(timeoutId);
      activeController = null;
      inFlight = false;
    }
  });

  window.addEventListener("pagehide", () => activeController?.abort(), { once: true });
})();
