const router = require('express').Router();
const Channel = require('../../models/channel');
const User = require('../../models/user');
const fault = require('../../globals').fault;
const MessagePage = require('../../models/messagePage');
const redis = require('../../bin/redis');

router.get('/', function(req, res, next){
	Channel.find({}, (err, channels)=>{
		fault(err, next);
		res.json(channels);
	});
});


router.get('/:id', function(req, res, next){
	Channel.findById(req.params.id, (err, channel)=>{
		fault(err, next);
		res.json(channel);
	});
});

router.get('/:id/messages', function(req, res, next){
	redis.get(`messages:${req.params.id}`, (err, messages) => {
		fault(err, next);
		if(messages != null){
			console.log("Got Redis messages");
			populateMessages(JSON.parse(messages), (messages) => {
				res.json(messages);
			});
		} else {
			Channel.findById(req.params.id).populate('pageTail').exec((err, channel) => {
				fault(err, next);
				populateMessages(channel.pageTail.messages, (messages) => {
					res.json(messages);
				});
			});
		}
	});

	function populateMessages(messages, callback){
		let countOfReturns = 0;
		messages.forEach((message, i) => {
			User.findById(message.author, (err, user) => {
				countOfReturns++;
				messages[i].author = user;
				if(countOfReturns === messages.length) {
					callback(messages);
				}
			});
		});
	}
});


router.post('/', function(req, res, next){
    MessagePage.create({
        messages: []
    }, function(err, page){
        Channel.create({
            name : req.body.name,
            description : req.body.description,
            pageHead : page,
            pageTail : page
        }, function(err, channel){
			fault(err, next);
			redis.set(`messages:${channel._id}`, JSON.stringify(page.messages), err => {
				fault(err, next);
			});
			res.json(channel);

            User.findById(req.user._id, (err, user)=>{
            	fault(err, next);
            	user.createdRooms.push(channel);
            	user.save();
			});
        });
    });
});


router.delete('/:id', function(req, res){
	User.findById(req.user._id, (err, user)=>{
		fault(err, next);
		user.createdRooms.forEach((room, i)=>{
			if(String(room) === req.params.id){
				user.createdRooms.splice(i, 1);
			}
		});
		user.save();
	});
    Channel.findByIdAndRemove(req.params.id, function(err){
		fault(err, next);
        res.send("Successfully remove channel of id", req.params.id);
    });
});

module.exports = router;