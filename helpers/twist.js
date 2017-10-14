const oauth = require('./oauth');
const request = require('request');
const querystring = require('querystring');

module.exports.postComment = function(thread_id, content){

    var authorization = 'Bearer ' + oauth.oauth.access_token;

    var options = { method: 'POST',
        url: 'https://api.twistapp.com/api/v2/comments/add',
        headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                authorization: authorization },
        form: { content: content, thread_id: thread_id } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}