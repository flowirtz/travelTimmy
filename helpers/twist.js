const oauth = require('./oauth');
const request = require('request');
const querystring = require('querystring');

const authorization = 'Bearer ' + oauth.oauth.access_token;
var thread = {
    awaitingResponse: false,
    thread_id: null
};

module.exports.thread = thread;

module.exports.postComment = function(thread_id, content){

    thread.thread_id = thread_id;
    thread.awaitingResponse = true;

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

module.exports.subscribeToComments = function(){

    const target_url = "/commentadded"

    var options = { method: 'POST',
        url: 'https://api.twistapp.com/api/v2/hooks/subscribe',
        headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                authorization: authorization },
        form: { event: 'comment_added', target_url: target_url } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

module.exports.processResponse = function(comment){
    // TODO implement (! set awaitingresponse to false at the end)
    module.exports.postComment(thread.thread_id, "Thanks for responding");
}