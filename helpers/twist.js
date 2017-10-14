const oauth = require('./oauth');
const request = require('request');
const querystring = require('querystring');

const main = require('./main')

const authorization = 'Bearer ' + oauth.oauth.access_token;
var thread = {
    awaitingResponse: false,
    thread_id: null,
    travel_documents: []
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

    const target_url = "https://bot.traveltimmie.cricket/commentadded";

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
    main.determineNextState(comment)
    module.exports.postComment(thread.thread_id, "Thanks for responding");
}

module.exports.getCommentById = function(comment_id, callback){

    var options = { method: 'GET',
        url: 'https://api.twistapp.com/api/v2/comments/getone',
        headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                authorization: authorization },
        form: { id: comment_id } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        try {
            callback(JSON.parse(body));
        }catch (error){
            console.log("Error receiving comment fpr id " + comment_id);
            console.log(body);
        }
    });
}


module.exports.storeAttachments = function(attachments){
    thread.travel_documents.push(attachments);

    module.exports.postComment(thread.thread_id, "Thank you, I have received " + attachment_ids.length + " travel documents! :)");
}

module.exports.showTravelDocuments = function (res) {
    for(var document of thread.travel_documents){
        res.redirect(document.url);
    }
}