const router = require('express').Router();

router.get('/', function(req, res){
    res.render('socket');
});

module.exports = router;