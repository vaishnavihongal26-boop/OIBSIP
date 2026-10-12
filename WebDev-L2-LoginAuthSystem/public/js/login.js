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
  const remember = document.getElementById("remember").checked;

  if (!email || !password) {
    return show("Enter your email and password.", "error");
  }

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });
  const data = await res.json();

  if (res.ok) {
    window.location.href = "/dashboard";
  } else {
    show(data.error, "error");
  }
});