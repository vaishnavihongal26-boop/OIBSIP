function requirePage(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login.html");
  }
  next();
}

function requireApi(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in." });
  }
  next();
}

module.exports = { requirePage, requireApi };