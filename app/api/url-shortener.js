'use strict'

var validUrl = require('valid-url');

module.exports = function(app, db) {
    //handles mapping from long url to short url
    app.get('/new/:url*', function(request, response) {
        var url = request.url.slice(5);
       
        if(validUrl.isUri(url)){
            var respData = {
                "original_url": url,
                "short_url" : process.env.APP_URL + map()
            };
            response.send(JSON.stringify(respData));
            saveToDb(respData);
        } else{
            response.send(JSON.stringify("Error!"));
        }
    });
    
    //handles mapping from short to long url
    app.get('/:url', function(request, response){
        var url = process.env.APP_URL + request.params.url;
        findmap(url, response);
    });
    
    function map(){
        return (Math.floor(Math.random() * 500 + 100)).toString().substring(0, 2);
    }
    
    function saveToDb(mapping){
        console.log(mapping);
        var url_maps = db.collection('urlmaps');
        url_maps.save(mapping, function(err, result){
            if(err) throw err;
            console.log('Entered ' + result);
        });
    }
    
    function findmap(link, response){
        var map = db.collection('urlmaps');
        map.findOne({
           "short_url" : link 
        }, function(err, result){
            if(err) throw err;
            if(result){
                response.redirect(result.original_url);
            }else {
                response.send('Site not present in database');
            }
        });
    }
}