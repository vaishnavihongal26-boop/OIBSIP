const emailEl = document.getElementById("email");
const logoutBtn = document.getElementById("logout");

async function loadUser() {
  const res = await fetch("/api/me");
  if (!res.ok) {
    window.location.href = "/login.html";
    return;
  }
  const data = await res.json();
  emailEl.textContent = data.email;
}

logoutBtn.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login.html";
});

loadUser();