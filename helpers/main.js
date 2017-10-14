const StateMachine = require("javascript-state-machine")
const texter = require('./texter')
const twist = require('./twist');
const skycanner = require('./skyscanner')
const chrono = require('chrono-node')

let destination, startDate, endDate

sm = new StateMachine({
    init: "start",
    transitions: [
        {name: "flightToDest", from: "start", to: (dest) => {
            destination = dest
            return "destGiven"
        }},
        //{ name: "flight_to_on", from: "start", to: "" },
        { name: "onDate", from: "destGiven", to: (date) => {
            startDate = date
            return "outboundGiven"
        } },
        { name: "fromDateToDate", from: "destGiven", to: (start_date, end_date) => {
            startDate = start_date
            endDate = end_date
            return "datesGiven"
        } },
        { name: "wantReturn", from: "outboundGiven", to: "inboundWanted"},
        { name: "flyBackOnDate", from: "inboundWanted", to: (date) => {
            endDate = date
            return "datesGiven"
        } },
        { name: "noReturn", from: "outboundGiven", to: "datesGiven" },
        { name: "delayedOnDate", from: "inboundGiven", to: (date) => {
            startDate = date
            return "datesGiven"
        } },
        { name: "book", from: "datesGiven", to: "start" },
        { name: "cancel", from: "*", to: "start" },
    ],
    methods: {
        onFlightToDest: () => {
            twist.postComment(138431, texter.whenDoYouWantToFly(destination))
        },
        onOnDate: () => {
            twist.postComment(138431, texter.doYouWantToFlyBack())
        },
        onFromDateToDate: () => {
            skycanner.getFlightSuggestion([startDate, endDate], destination, function(result, error) {
                if(error) {
                    console.log(error)
                    twist.postComment(138431, "I could not find any flights.")
                    return sm.cancel()
                }
                twist.postComment(138431, texter.hereIsOurOffer(result))
            })
        },
        onWantReturn: () => {
            twist.postComment(138431, texter.whenDoYouWantToFlyBack())
        },
        onFlyBackOnDate: () => {
            skycanner.getFlightSuggestion([startDate, endDate], destination, function (result, error) {
                if (error) {
                    console.log(error)
                    twist.postComment(138431, "I could not find any flights.")
                    return sm.cancel()
                }
                twist.postComment(138431, texter.hereIsOurOffer(result))
            })
        },
        onNoReturn: () => {
            skycanner.getFlightSuggestion([startDate, endDate], destination, function (result, error) {
                if (error) {
                    console.log(error)
                    twist.postComment(138431, "I could not find any flights.")
                    return sm.cancel()
                }
                twist.postComment(138431, texter.noReturn(result))
            })
        },
        onCancel: () => {
            twist.postComment(138431, texter.cancelled())
        },
        onBook: () => {
            skycanner.getFlightSuggestion([startDate, endDate], destination, function (result, error) {
                if (error) {
                    console.log(error)
                    twist.postComment(138431, "I could not find any flights.")
                    return sm.cancel()
                }
                twist.postComment(138431, texter.bookNow(result))
            })
        }
    }
})

module.exports.determineNextState = function(message) {
    console.log("XXX: CUR STATE IS", this.sm.state)
    switch(this.sm.state) {
        case "start": //TODO
                      break
        case "destGiven": dealWithDate(chrono.parse(message))
                          break
        case "outboundGiven": wantReturnFlight(message)
                              break
        case "inboundWanted": dealWithReturnDate(chrono.parse(message))
                              break
        case "datesGiven": wantToBook(message)
                           break
    }
    console.log("XXX: NEW STATE IS", this.sm.state)

}

function getDateString(date) {
  return date.start.date().toISOString().slice(0,10);
}

function dealWithDate(dates) {
    switch(dates.length) {
        case 0: sm.cancel()
                break
        case 1: sm.onDate(getDateString(dates[0]))
                break
        case 2: sm.fromDateToDate(getDateString(dates[0]), getDateString(dates[1]))
                break
    }
}

function wantReturnFlight(message) {
    message = message.toUpperCase()
    if(message.includes("YES")) {
        this.sm.wantReturn()
    }
    else {
        this.sm.noReturn()
    }
}

function dealWithReturnDate(date) {
    switch (date.length) {
        case 0: sm.cancel()
            break
        case 1: sm.flyBackOnDate(getDateString(date[0]))
            break
    }
}

function wantToBook(message) {
    message = message.toUpperCase()
    if(message==="NO") {
        this.sm.cancel()
    }
    else {
        this.sm.book()
    }
}

module.exports.sm = sm
