const router = require('express').Router();
const Channel = require('../../models/channel');
const globals = require('../../globals/index');
const MessagePage = require('../../models/messagePage');
/*
    3 States: undefined, null, object
    (Let EJS change depending on channel name is received)
*/


/*
    Index
    state: undefined
 */
router.get('/', function(req, res, next){
    //Send undefined
    //And list of channels
    Channel.find({}, function(err, channels){
        if(globals.isError(err, res)) next();
        res.render('channel', {channel : undefined, list : channels}); //Should ask user to request with a channel id
    });
});

/*
    New
 */
router.get('/new', function(req, res){
    res.render('channel/new');
});

/*
    Show
    state: null or object
 */
router.get('/:id', function(req, res, next){
    Channel.findById(req.params.id, function(err, channel){
        if(globals.isError(err, res)) next();
        //Will return null or the object depending on if channel is found or not
        //If null, should ask user to try again with a different id
        if(channel === null) {
            Channel.find({}, function(err, channels) {
                if(globals.isError(err, res)) next();
                res.render('channel', {channel : null, list : channels}); //Also list available channels
            });
        } else {
            res.render('channel/show', {channel : channel});

        }
    });
});



/*
    Create
 */
router.post('/', function(req, res, next){
    MessagePage.create({
        messages: []
    }, function(err, page){
        Channel.create({
            name : req.body.name,
            description : req.body.description,
            members : ["Anonymous"],
            pageHead : page,
            pageTail : page
        }, function(err, channel){
            if(globals.isError(err, res)) next();
            res.redirect('/channel/'+channel._id);
        });
    });
});

/*
    Delete
 */
router.delete('/:id', function(req, res){
    Channel.findByIdAndRemove(req.parms.id, function(err){
        if(globals.isError(err, res)) next();
        res.send("Successfully remove channel of id", req.params.id);
    });
});

module.exports = router;