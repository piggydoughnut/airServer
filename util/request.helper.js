function json400(res, msg){
    return res.status(400).json(msg);
}

function json200(res, msg){
    return res.status(200).json(msg);
}

module.exports = {json400, json200};
