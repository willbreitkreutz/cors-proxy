var express = require('express'),
    fetch = require('node-fetch'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json({limit: '500kb'}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-URL header in the request' });
            return;
        }
        const options = {
            method: req.method,
            headers: {
                "content-type": "application/json",
                'Authorization': req.header('Authorization')
            }
        }
        if(req.method !== "GET"){
            options.body = req.body
        }
        fetch(`${targetURL + req.url}`,options).then((response) => {
            return response.json()
        }).then((json) => {
            res.json(json)
        });
    }
});

app.set('port', process.env.PORT || 8010);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});