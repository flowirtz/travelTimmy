
module.exports.getFlightSuggestion = function(date, destinationCity) {
    const startDate = date[0]
    if(date.length === 2) {
        //return trip included
        const endDate = date[1]
    }
    
    const destinationId = getCorrectCityId(destinationCity)
}

function getCorrectCityId(cityName) {
    //call the autocomplete thingy from skyscanner
}
