
const router = require("express").Router();

router.get('/', (req, res, next) => {
  res.render('landing')
})

module.exports = router;
