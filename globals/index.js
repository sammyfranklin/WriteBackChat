module.exports = {
    isError : function(err, res, customMessage){
        if(err){
            res.send(err + '\n' + customMessage);
            return true;
        } else {
            return false;
        }
    }
};