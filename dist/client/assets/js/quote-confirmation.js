(() => {
  "use strict";

  const receiptKey = "sheltonSubmissionReceiptV1";
  const maxReceiptAge = 10 * 60 * 1000;
  let receipt = null;

  try {
    const rawReceipt = window.sessionStorage.getItem(receiptKey);
    window.sessionStorage.removeItem(receiptKey);
    receipt = rawReceipt ? JSON.parse(rawReceipt) : null;
  } catch {
    receipt = null;
  }

  const age = Date.now() - Number(receipt?.at);
  const validReceipt = receipt?.v === 1
    && ["quote", "estimator"].includes(receipt?.kind)
    && Number.isFinite(age)
    && age >= 0
    && age <= maxReceiptAge;

  if (!validReceipt) return;

  const icon = document.querySelector("[data-confirmation-icon] i");
  const title = document.querySelector("[data-confirmation-title]");
  const copy = document.querySelector("[data-confirmation-copy]");
  const action = document.querySelector("[data-confirmation-action]");
  const actionLabel = document.querySelector("[data-confirmation-action-label]");

  document.title = "Thank You | Shelton Linen & Uniform Services";
  if (icon) icon.className = "ph ph-check";
  if (title) title.textContent = "Thank you. Your request was sent.";
  if (copy) copy.textContent = "Our team will review your details and follow up using the contact information you provided.";
  if (action) action.href = "index.html";
  if (actionLabel) actionLabel.textContent = "Return home";
})();
