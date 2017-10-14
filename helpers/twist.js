const oauth = require('./oauth');
const request = require('request');
const querystring = require('querystring');

module.exports.postComment = function(thread_id, content){

    var authorization = 'Bearer ' + oauth.access_token;
    console.log(authorization);

    var options = { method: 'POST',
        url: 'https://api.twistapp.com/api/v2/comments/add',
        headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                authorization: 'Bearer oauth2:6fa20ec14931728b4dca4eaed98a1672aeff84c4' },
        form: { content: content, thread_id: thread_id } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}