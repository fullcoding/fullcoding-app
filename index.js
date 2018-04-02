
//Import Middlewares
const express = require('express');
const http = require('http');
const builder = require('botbuilder');
const config = require('./config');

//Create app
const app = express();

//Define port to use
const port = 8000 || process.env.PORT;

//Setup server
http.createServer(app).listen(port, () => (
    console.log('\x1b[32m%s%s\x1b[0m', 'server run on port:', port)
));

// Create connector and bot
var connector = new builder.ChatConnector({
    appId: config.connectorAppId,
    appPassword: config.connectorAppPassword
});

var bot = new builder.UniversalBot(connector);

var recognizer = new builder.LuisRecognizer(config.luisModelUrl);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('getGrades', [
    function (session) {
        builder.Prompts.text(session, 'De quelle ville voulez-vous connaître la météo ?');
    },
    function (session, results) {        
        var message= 'lol';
        session.send(message);
    }
]);

dialog.onDefault(function (session) {
    session.send('Je n\'ai pas compris votre demande, il faut écrire "donne-moi la météo" !');
});


//Route for chat
app.use('/api/v1/messages', connector.listen());

//Route not found
app.use('*', (req, res) => {
    res.status(404).json({error: true, message: 'Not Found'});
});

