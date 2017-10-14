const oauth = require('oauth');
const http = require('http');

module.exports.postComment(thread_id, content){
    var options = {
        host: 'https://api.twistapp.com/api/v2/comments/add',
        port: '80',
        method: 'POST',
        headers: {
            'Authorization': oauth.access_token,
        },
        parameters:{
            
        }
    };

    var req = http.request(options, function(res) {
        if(res.error){
            console.log(error);
        }
    });

    req.end();
}