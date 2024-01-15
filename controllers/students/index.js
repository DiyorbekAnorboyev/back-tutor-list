const { Router } = require("express");

const router = Router();

router.get("/Student", function (req, res) {
  res.send("Hello World Student");
});

router.post("/Student", function (req, res) {
    res.send("Hello World Student");
  });

module.exports = router;
