
//Import Middlewares
const express = require('express');
const http = require('http');
const builder = require('botbuilder');
const config = require('./config');

//myefrei API
const myefrei = require('./myefrei');

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

dialog.matches('getAbsences',
    function (session) {
        myefrei.getAbsences( function (result, excusedAbsences) {
            console.log(result.length);
            session.send("Vous avez "+result.length+" absences, dont "+excusedAbsences+" excusées");
        });
        session.endDialog();
    }
);

dialog.matches('getGrades',
    function (session) {
        myefrei.getGrades( function (result) {
            console.log(result);
            result.forEach(item => {
                session.send(item);
            });
        });
        session.endDialog();
    }
);

dialog.matches('getPlanningDay',
    function (session, args) {
        var d = new Date().toISOString().split('T')[0];
        var day = builder.EntityRecognizer.findEntity(args.entities, 'Jour');
        if(day) {
            if(day.entity.toLowerCase() == 'demain') {
                var tomorrow = new Date().getDay()+2;
                tomorrow = (tomorrow<10 ? '0'+tomorrow : tomorrow);
                d = d.slice(0,8)+tomorrow;
                console.log(d);
            }
        }
        
        myefrei.getPlanningDay( d,function (result) {
            console.log(result);
            if(result.length>0) {
                result.forEach(item => {
                    session.send(item);
                });
            }
            else {
                session.send("Vous n'avez pas cours demain ! Lourd");
            }
        });
        session.endDialog();
    }
);

dialog.onDefault(function (session) {
    session.send('Je n\'ai pas compris votre demande. Pouvez-vous reformuler s\'il vous plait?');
});

bot.dialog('/', dialog);

//Route for chat
app.use('/api/v1/messages', connector.listen());

//Route not found
app.use('*', (req, res) => {
    res.status(404).json({error: true, message: 'Not Found'});
});

