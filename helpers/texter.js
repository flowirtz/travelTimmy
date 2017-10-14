

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
    hereIsOurOffer: function(flight) {
        return "That's all. Here is your flight: " + flight + "Do you want to book now?"
    },
    bookNow: function(url) {
        return "Great. Here you go: " + url
    },
    cancelled: function() {
        return "Sorry I failed you... :-("
    }
}
