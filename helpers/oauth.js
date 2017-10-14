var http = require('http');
var exports = module.exports;

/*
* OAuth not needed as test token has been provided
 */

oauth = {
    access_token: 'oauth2:54fd8a5ff7379f4ef1617aa64b1ed5b40ce7bbc7',
    access_code: null,
    state: '6495246996',
    client_id: '54fd8a5ff7379f4ef1617aa64b1ed5b40ce7bbc7',
    client_secret: '5554019311',
    client_scope: 'threads:write,comments:write,threads:read,comments:read,messages:write,messages:read',
    redirect_url: '/'
};

exports.oauth = oauth;

exports.authenticate = function(){
    var options = {
        host: 'https://twistapp.com/oauth/authorize?'+ '' +
        'client_id=' + oauth.client_id +
        '&redirect_uri=' + oauth.redirect_url +
        '&scope=' + oauth.scope +
        '&state=' + oauth.state,
        port: '80',
        method: 'GET',
    };

    var req = http.request(options, function(res) {
        if(res.error){
            console.log(error);
        }
    });

    req.end();
};

exports.redirect = function(){
    // TODO implement
};