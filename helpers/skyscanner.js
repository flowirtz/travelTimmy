var request = require('request');
var config = require('../config.json')

let startDate, endDate, destination

//
// PUBLIC
//

//usage: getFlightSuggestion(["anytime", "anytime"], "London", callbackFn)
//date: yyyy-mm-dd
module.exports.getFlightSuggestion = function(date, destinationCity, callback) {
    startDate = date[0]
    if(date.length === 2) {
        //return trip included
        endDate = date[1]
    }

    _getCorrectCityId(destinationCity, _getFlightQuote, callback)
}

//
// PRIVATE
//
//beautify the flight trip data to include more than ids
function _cleanFlightData(data, finalCallback) {
    flight = data["Quotes"].find((date) => {
        if (endDate && !date["InboundLeg"]) {
            return false
        }
        return date["OutboundLeg"]
    })
    
    if(!flight) {
        //no flight found!
        return finalCallback(data, "poop")
    }

    carriers = data["Carriers"]
    places = data["Places"]

    result = {"outboundLeg": {}}
    result.prize = flight["MinPrice"]
    outboundLegRaw = flight["OutboundLeg"]
    result.outboundLeg.departureTime = outboundLegRaw["DepartureDate"]
    result.outboundLeg.airline = carriers.filter((carrier) => {
        return outboundLegRaw["CarrierIds"].includes(carrier["CarrierId"])
    })
    result.outboundLeg.originAirport = places.filter((place) => {
        return outboundLegRaw["OriginId"] === place["PlaceId"]
    })
    result.outboundLeg.destinationAirport = places.filter((place) => {
        return outboundLegRaw["DestinationId"] === place["PlaceId"]
    })

    if (flight["InboundLeg"]) {
        result["inboundLeg"] = {}
        inboundLegRaw = flight["InboundLeg"]
        result.inboundLeg.departureTime = inboundLegRaw["DepartureDate"]
        result.inboundLeg.airline = carriers.filter((carrier) => {
            return inboundLegRaw["CarrierIds"].includes(carrier["CarrierId"])
        })
        result.inboundLeg.originAirport = places.filter((place) => {
            return inboundLegRaw["OriginId"] === place["PlaceId"]
        })
        result.inboundLeg.destinationAirport = places.filter((place) => {
            return inboundLegRaw["DestinationId"] === place["PlaceId"]
        })
    }

    inboundDate = result.inboundLeg ? result.inboundLeg.departureTime.substring(0, 10) : null
    result.bookingURL = _getBookingURL(result.outboundLeg.originAirport[0]["SkyscannerCode"],
                                      result.outboundLeg.destinationAirport[0]["SkyscannerCode"],
                                      result.outboundLeg.departureTime.substring(0, 10),
                                      inboundDate)

    finalCallback(result, null)
}

// get a url to book the trip on skyscanner
function _getBookingURL(originPlace, destinationPlace, outboundDate, inboundDate) {
    requestURL = "http://partners.api.skyscanner.net/apiservices/referral/v1.0/ES/EUR/en-GB/"
    requestURL += originPlace + "/" + destinationPlace + "/" + outboundDate + "/"
    if(inboundDate) {
        requestURL += inboundDate + "/"
    }
    requestURL += "?apiKey=" + config.keys.skyscanner_flights.substring(0, 16)
    
    return requestURL
}

//get the quote data for the flight from skyscanner
function _getFlightQuote(startDate, endDate, destinationId, callback, finalCallback) {    
    requestURL = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/ES/eur/en-US/BCN-sky/"
    requestURL += destinationId + "/"
    requestURL += startDate
    if(endDate) {
        requestURL += "/" + endDate + "/"
    }
    requestURL += "?apiKey=" + config.keys.skyscanner_flights
    request(requestURL, function (error, response, body) {
        if (error) {
            throw Error("ERROR in skyscanner.getFlightQuote", error)
        }

        if (response && response.statusCode === 200) {
            //success.
            result = JSON.parse(body)
            callback(result, finalCallback)
        }
    })
}

//call the autocomplete thingy from skyscanner
function _getCorrectCityId(cityName, callback, finalCallback) {
    requestURL = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/ES/EUR/en-GB/?query="
    requestURL += cityName
    requestURL += "&apiKey=" + config.keys.skyscanner_flights

    request(requestURL, function(error, response, body) {
        if(error) {
            throw Error("ERROR in skyscanner.getCorrectCityId", error)
        }
        if(response && response.statusCode === 200) {
            //success. take the first cities id and return
            result = JSON.parse(body)
            callback(startDate, endDate, result["Places"][0]["PlaceId"], _cleanFlightData, finalCallback)
        }
    })
}

//helper function to union two arrays
function _union_arrays(x, y) {
    var obj = {};
    for (var i = x.length - 1; i >= 0; --i)
        obj[x[i]] = x[i];
    for (var i = y.length - 1; i >= 0; --i)
        obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
        if (obj.hasOwnProperty(k))
            res.push(obj[k]);
    }
    return res;
}
