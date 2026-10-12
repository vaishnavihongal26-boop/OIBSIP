const form = document.getElementById("form");
const message = document.getElementById("message");
const passwordInput = document.getElementById("password");

function show(text, type) {
  message.textContent = text;
  message.className = "msg " + type;
}

// Eye button: show or hide the password
document.getElementById("toggle").addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    return show("Fill in all fields.", "error");
  }

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (res.ok) {
    show("Account created. Taking you to login...", "success");
    setTimeout(() => (window.location.href = "/login.html"), 1500);
  } else {
    show(data.error, "error");
  }
});