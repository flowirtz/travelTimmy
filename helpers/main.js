const StateMachine = require("javascript-state-machine")
const texter = require('./texter')

let destination, startDate, endDate

var globalSM = new StateMachine({
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
        { name: "flyBackOnDate", from: "outboundGiven", to: (date) => {
            endDate = date
            return "datesGiven"
        } },
        { name: "noReturn", from: "outboundGiven", to: "datesGiven" },
        { name: "initialFlyBackOnDate", from: "destGiven", to: (date) => {
            endDate = date
            return "inboundGiven"
        } },
        { name: "delayedOnDate", from: "inboundGiven", to: (date) => {
            startDate = date
            return "datesGiven"
        } },
        { name: "book", from: "datesGiven", to: "booked" },
        { name: "cancel", from: "*", to: "start" },
    ],
    methods: {
        onFlightToDest: () => {console.log(texter.whenDoYouWantToFly(destination))},
        onOnDate: (date) => {console.log(date)},
    }
})

globalSM.flightToDest("London")
