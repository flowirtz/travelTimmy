const express = require('express')
const app = express()

const entitydetector = require('./helpers/entitydetection')
const skyscanner = require('./helpers/skyscanner')

app.get('/', function (req, res) {
    if(req.command_argument){
        var command = req.command_argument;

        if(command.length > 0) {
            var city = entitydetector.getCity(command)

            if(city){

            }else{
                console.log("No destination specified!")
            }
        }
    }else{
        console.log('No command recognized!');
    }
})

//
// Skyscanner routes
//
app.get('/flight/:destination/:dateStart', function(req, res) {
    const params = req.params
    res.send(skyscanner.getFlightSuggestion([params.dateStart], params.destination))
})
app.get('/flight/:destination/:dateStart/:dateEnd', function (req, res) {
    const params = req.params
    res.send(skyscanner.getFlightSuggestion([params.dateStart, params.dateEnd], params.destination))
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
