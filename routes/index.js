const router = require('express').Router();
/* GET home page. */

router.get('/', function(req, res) {
    res.render('index', { user : req.user || null });
});

module.exports = router;
