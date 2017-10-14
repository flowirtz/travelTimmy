

module.exports = {
    whenDoYouWantToFly: function(location) {
        return ("Ah cool, to " + location + "! When do you want to go?")
    },
    doYouWantToFlyBack: function() {
        return "Do you want to book a return flight?"
    },
    whenDoYouWantToFlyBack: function() {
        return "Ok. When?"
    },
    noReturn: function(flight) {
        return "Alright, no return flight. Here is your flight: " + JSON.stringify(flight) + "Do you want to book now?"
    },
    hereIsOurOffer: function(flight) {
        return "That's all. Here is your flight: " + JSON.stringify(flight) + "Do you want to book now?"
    },
    bookNow: function(flight) {
        url = flight.bookingURL
        return "Great. Here you go: " + url
    },
    cancelled: function() {
        return "Sorry I failed you... :-("
    }
}
