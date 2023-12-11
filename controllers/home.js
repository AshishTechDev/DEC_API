exports.getIndex = async (req, res, next) => {
  try {
    res.render("home/home", {
      pageTitle: "home",
      path: "/",
    });
  } catch (err) {
    console.log(err.message);
  }
};