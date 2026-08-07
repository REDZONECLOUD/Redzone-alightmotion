const mainForm = document.querySelector("#main-form");
const fieldLabelText = document.querySelector("#field-label-text");
const fieldIcon = document.querySelector("#field-icon");
const submitButton = document.querySelector("#submit-button");
const buttonText = document.querySelector("#button-text");
const notice = document.querySelector("#notice");
const guideEmail = document.querySelector("#guide-email");
const statusTitle = document.querySelector("#status-title");
const statusText = document.querySelector("#status-text");
const stepKicker = document.querySelector("#step-kicker");
const stepTitle = document.querySelector("#step-title");
const stepDescription = document.querySelector("#step-description");
const dotOne = document.querySelector("#dot-one");
const dotTwo = document.querySelector("#dot-two");

let stage = "send";
let activeEmail = "";

function currentInput() {
  return document.querySelector("#main-input");
}

function setNotice(type, message) {
  notice.className = "notice " + type;
  notice.textContent = String(message || "");
}

function clearNotice() {
  notice.className = "notice hidden";
  notice.textContent = "";
}

function setBusy(busy, label) {
  submitButton.disabled = busy;
  if (busy) {
    buttonText.textContent = label;
  } else {
    buttonText.textContent = stage === "send"
      ? "Kirim link verifikasi"
      : "Verifikasi sekarang";
  }
}

function getMessage(data, fallback) {
  if (!data || typeof data !== "object") return fallback;
  return data.message || data.result?.message || data.data?.message || fallback;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify(body)
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {
      status: false,
      message: "Respons server tidak dapat dibaca."
    };
  }

  if (!response.ok || data?.status === false) {
    throw new Error(getMessage(data, "Permintaan gagal diproses."));
  }

  return data;
}

function linkIcon() {
  fieldIcon.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M9.5 14.5 14.5 9.5M8.1 16.7l-1.3 1.3a3.4 3.4 0 0 1-4.8-4.8l3-3a3.4 3.4 0 0 1 4.8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="m15.9 7.3 1.3-1.3a3.4 3.4 0 1 1 4.8 4.8l-3 3a3.4 3.4 0 0 1-4.8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

function switchToVerify(email) {
  stage = "verify";
  activeEmail = email;

  const oldInput = currentInput();
  const textarea = document.createElement("textarea");

  textarea.id = "main-input";
  textarea.name = "link";
  textarea.rows = 4;
  textarea.required = true;
  textarea.spellcheck = false;
  textarea.autocomplete = "off";
  textarea.placeholder = "Tempel seluruh link https://alight-creative...";

  oldInput.replaceWith(textarea);

  fieldLabelText.textContent = "Full link verifikasi";
  linkIcon();

  stepKicker.textContent = "Langkah 2 dari 2";
  stepTitle.textContent = "Tempel link verifikasi";
  stepDescription.textContent = "Salin seluruh link dari email lalu tempel di bawah.";
  buttonText.textContent = "Verifikasi sekarang";

  statusTitle.textContent = "Email berhasil dikirim";
  statusText.textContent = "Menunggu link verifikasi dari email.";

  dotOne.classList.remove("active");
  dotTwo.classList.add("active");

  guideEmail.textContent = "Email verifikasi sudah dikirim ke " + email + ".";
  guideEmail.classList.add("sent");

  localStorage.setItem("znn_am_email", email);

  setTimeout(() => {
    textarea.focus();
  }, 120);
}

mainForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNotice();

  if (stage === "send") {
    const email = currentInput().value.trim().toLowerCase();
    if (!email) return;

    setBusy(true, "Mengirim...");

    try {
      const data = await postJson("/api/send", { email });

      switchToVerify(email);

      setNotice(
        "success",
        getMessage(data, "Email verifikasi berhasil dikirim.")
      );
    } catch (error) {
      setNotice(
        "error",
        error.message || "Gagal mengirim email verifikasi."
      );
    } finally {
      setBusy(false);
    }

    return;
  }

  const link = currentInput().value.trim();
  if (!link || !activeEmail) return;

  setBusy(true, "Memverifikasi...");

  try {
    const data = await postJson("/api/verify", {
      email: activeEmail,
      link
    });

    setNotice(
      "success",
      getMessage(data, "Verifikasi berhasil. Premium sudah diproses.")
    );

    statusTitle.textContent = "Verifikasi berhasil";
    statusText.textContent = "Permintaan aktivasi premium sudah diproses.";
    currentInput().value = "";
  } catch (error) {
    setNotice(
      "error",
      error.message || "Verifikasi gagal diproses."
    );
  } finally {
    setBusy(false);
  }
});

const savedEmail = localStorage.getItem("znn_am_email");
if (savedEmail) {
  const input = currentInput();
  if (input) input.value = savedEmail;
}
