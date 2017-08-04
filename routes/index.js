const router = require('express').Router();
const User = require('../models/user');
const fault = require('../globals').fault;

router.get('/', function(req, res, next) {
    if(req.user){
		User.findById(req.user._id, (err, user) => {
		    fault(err, next);
		    respond(user);
        });
	} else {
        respond();
    }

    function respond(user=null){
		res.render('index', { user : user });
	}
});

module.exports = router;
