const router = require('express').Router();
const Channel = require('../../models/channel');
const globals = require('../../globals/index');
/*
    3 States: undefined, null, object
    (Let EJS change depending on channel name is received)
*/


/*
    Index
    state: undefined
 */
router.get('/', function(req, res){
    //Send undefined
    res.render('channel'); //Should ask user to request with a channel id
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
        res.render('channel', {channel : channel});
    });
});

/*
    Create
 */
router.post('/', function(req, res){
    Channel.create({
        name : req.body.name,
        description : req.body.description,
        members : [req.body.user]
    }, function(err, channel){
        if(globals.isError(err, res)) next();
        res.render('channel', {channel : channel});
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