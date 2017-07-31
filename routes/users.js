const router = require('express').Router();
const User = require('../models/user');
const fault = require('../globals').fault;

router.get('/', function(req, res, next) {
	if(req.query.fetch === "rooms"){
		User.findById(req.user._id).populate('createdRooms').exec((err, user)=>{
			fault(err, next);
			res.json(user);
		})
	} else {
		res.json(req.user);
	}
});

router.get('/:id', function(req, res, next){
	let query = User.findById(req.params.id);
	if(req.query.fetch === "rooms"){
		query.populate('createdRooms');
	}
	query.exec((err, user)=>{
		fault(err, next);
		res.json(user);
	})
});

module.exports = router;
