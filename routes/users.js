const router = require('express').Router();
const User = require('../models/user');
const fault = require('../globals').fault;

router.get('/', function(req, res, next) {
	let query = User.findById(req.user._id);
	query.populate('createdRooms channels friends');
	query.exec((err, user)=>{
		fault(err, next);
		res.json(user);
	});
});

router.get('/:id', function(req, res, next){
	let query = User.findById(req.params._id);
	query.populate('createdRooms channels friends');
	query.exec((err, user)=>{
		fault(err, next);
		res.json(user);
	});
});

router.put('/:id/friends/add/:friend', function(req, res, next){
	User.findById(req.params.id, (err, user)=>{
		fault(err, next);
		user.friends.push(req.params.friend);
		user.save();
	});
});

router.put('/:id/channels/toggleSaved/:channel', function(req, res, next){
	User.findById(req.params.id, (err, user)=>{
		fault(err, next);
		console.log("toggling " + req.params.channel);
		let target = user.channels.indexOf(req.params.channel);
		if(target !==  -1){
			console.log("Found it, so removing it");
			user.channels.splice(target, 1);
			res.send(false);
		} else {
			console.log("Couldn't find one, so add it");
			user.channels.push(req.params.channel);
			res.send(true);
		}
		user.save();

	});
});

module.exports = router;
