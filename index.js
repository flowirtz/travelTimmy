const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const fs = require('fs');

const entitydetector = require('./helpers/entitydetection')
const skyscanner = require('./helpers/skyscanner')
const twist = require('./helpers/twist');
const main = require('./helpers/main')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    console.log('Hello World');
    res.send("Hello, world!");
})

//
// TWIST ROUTES
//

app.post('/command', function (req, res) {
    var command = req.body.command_argument;
    var thread_id = Number(req.body.thread_id);

    twist.getCommentById(req.body.comment_id, (comment)=>{
        if(comment.attachments && comment.attachments.length > 0){
            twist.storeAttachments(comment.attachments);
        }
    });

    if(command){
        console.log(command);
        if(command.length > 0) {
            if(command.includes("show me")){
                twist.showTravelDocuments(res);
            }else {
                entitydetector.getCity(command, (cities) => {
                    if (cities && cities.length > 0) {
                        main.sm.flightToDest(cities[0])
                        res.sendStatus(200)
                    } else {
                        twist.postComment(thread_id, 'Without destination I\'m afraid I cannot help you. :(');
                        res.sendStatus(400)
                        console.log("No destination specified!")
                    }
                })
            }
        }
    }else{
        twist.postComment(thread_id, 'Don\'t hesitate to ask me something!');
        console.log('No command recognized!');
    }
})

app.post('/commentadded', function(req, res){
    var comment = req.body.comment;

    if(comment.thread_id && comment.thread_id == twist.thread.thread_id && twist.thread.awaitingResponse){
        twist.processResponse(comment.content);
        res.send(200)
    }else{
        console.log("No thread specified for added comment or comment was no response to current thread.")
        res.send(400)
    }
})


//
// Skyscanner routes
//
app.get('/flight/:destination/:dateStart', function(req, res) {
    const params = req.params
    skyscanner.getFlightSuggestion([params.dateStart], params.destination, (result) => {
        res.json(result)
    })
})
app.get('/flight/:destination/:dateStart/:dateEnd', function (req, res) {
    const params = req.params
    skyscanner.getFlightSuggestion([params.dateStart, params.dateEnd], params.destination, (result) => {
        res.json(result)
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
    twist.subscribeToComments();
})


