const checkAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  return next();
};

module.exports = checkAuthentication;
