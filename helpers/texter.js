
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
        return "Alright, no return flight. Here is your flight: " + makeFlightDataReadable(flight) + "Do you want to book now?"
    },
    hereIsOurOffer: function(flight) {
        return "That's all. Here is your flight: " + makeFlightDataReadable(flight) + "Do you want to book now?"
    },
    bookNow: function(flight) {
        url = flight.bookingURL
        return "Great. Here you go: " + url
    },
    cancelled: function() {
        return "Sorry I failed you... :-("
    }
}

function makeFlightDataReadable(flightData) {
    let output = "\n \n"
    
    let inb
    if (flightData["inboundLeg"]) {
        inb = flightData["inboundLeg"]
        output += "**Outbound Flight**\n"
    }

    const out = flightData["outboundLeg"]
    output += out.originAirport[0].Name + " (**" + out.originAirport[0].IataCode + "**)"
    output += " > "
    output += out.destinationAirport[0].Name + " (**" + out.destinationAirport[0].IataCode + "**)"
    output += "\n"
    output += "**Departure**: " + out.departureTime.substring(0,10) + "\n"
    output += "**Airline**: " + out.airline[0].Name + "\n"
    

    if(inb) {
        output += "\n" + "**Return Flight**\n"
        output += inb.originAirport[0].Name + " (**" + inb.originAirport[0].IataCode + "**)"
        output += " > "
        output += inb.destinationAirport[0].Name + " (**" + inb.destinationAirport[0].IataCode + "**)"
        output += "\n"
        output += "**Departure**: " + inb.departureTime.substring(0, 10) + "\n"
        output += "**Airline**: " + inb.airline[0].Name + "\n"
    }

    output += "\n" + "**Prize**: Around " + flightData.prize + ",00 €" + "\n" + "\n"
    
    return output
}
