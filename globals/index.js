module.exports = {
    fault : function(err, next, customMessage){
        if(err){
            console.error({
                error : err,
                message : `ERROR(FAULT)! ${customMessage}`
            });
            return next() || true;
        }
        return false;
    }
};