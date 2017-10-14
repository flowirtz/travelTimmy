const oauth = require('./oauth');
const request = require('request');
const querystring = require('querystring');

const main = require('./main')

const authorization = 'Bearer ' + oauth.oauth.access_token;
var thread = {
    awaitingResponse: false,
    thread_id: 138431,
    travel_documents: []
};

module.exports.thread = thread;

module.exports.postComment = function(thread_id, content, attachment){

    thread.thread_id = thread_id;
    thread.awaitingResponse = true;

    var options = { method: 'POST',
        url: 'https://api.twistapp.com/api/v2/comments/add',
        headers:
            { 'content-type': 'application/x-www-form-urlencoded',
                authorization: authorization },
        form: { content: content, thread_id: thread_id} };

    if(attachment){
        options.form['attachment'] = "[" + JSON.stringify(attachment) + "]";
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}

module.exports.processResponse = function(comment){
    main.determineNextState(comment)
}

module.exports.getCommentById = function(comment_id, callback){

    var options = { method: 'POST',
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
            console.log("Error receiving comment for id " + comment_id);
            console.log(body);
        }
    });
}


module.exports.storeAttachments = function(attachments){
    thread.travel_documents = thread.travel_documents.concat(attachments);

    module.exports.postComment(thread.thread_id, "Thank you, I have received " + attachments.length + " travel documents! :)");
}

module.exports.showTravelDocuments = function (res) {
    for(var document of thread.travel_documents){
        module.exports.postComment(thread.thread_id, document.url, document);
    }
}