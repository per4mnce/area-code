/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask area code where is 8 6 0"
 *  Alexa: "(reads back location description)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    areaCodes = require('./data');

var APP_ID = 'amzn1.echo-sdk-ams.app.582bb4be-a571-4c73-bda7-ae2cfe19d47c'; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * AreaCodeHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var AreaCodeHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
AreaCodeHelper.prototype = Object.create(AlexaSkill.prototype);
AreaCodeHelper.prototype.constructor = AreaCodeHelper;

AreaCodeHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = {
        speech:  "<speak>Welcome to area code by Henry Schaumburger. You can ask a question like, "
                 +"where is <say-as interpret-as='digits'>860</say-as> ? ... "
                 +"Now, what area code would you like?</speak>",
        type:   AlexaSkill.speechOutputType.SSML
    },
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    repromptText = {
        speech: "For instructions on what you can say, please say help me.",
        type:   AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechText, repromptText);
};

AreaCodeHelper.prototype.intentHandlers = {
    "AreaCodeIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Area Code for " + itemName,
            location,
            speechOutput,
            repromptOutput;
        
        //Lookup description for a valid area code
        if (itemName in areaCodes) {
            location = areaCodes[itemName].Description;
        }
        
        if (location) {
            var speechText = "<speak>The location for " + "<say-as interpret-as='digits'>" + itemName + "</say-as> is " + location + "</speak>";
            speechOutput = {
                speech: speechText,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, location);
        } else {
            var speech;
            if (itemName) {
                if (itemName === "?") {
                    speech = "<speak>I'm sorry, I did not understand you. Please say ... 'where is' ... plus a three digit area code.</speak>";
                } else {
                    speech = "<speak>I'm sorry.  I could not find area code " + "<say-as interpret-as='digits'>" + itemName + "</say-as>"
                           + ". Please say ... 'where is' ... plus a three digit area code.</speak>";
                }
            } else {
                speech = "<speak>I'm sorry, I could not find that area code.  Please say ... 'where is' ... plus a three digit area code.</speak>";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.SSML
            };
            repromptOutput = {
                speech: "Please say ... 'where is' ... plus a three digit area code, or say cancel,  to quit.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = {
            speech:  "<speak>You get the location of an area code by saying, "
                    +"where is <say-as interpret-as='digits'>860</say-as> ? ... "
                    +"Now, what area code would you like?</speak>",
            type:   AlexaSkill.speechOutputType.SSML
        },
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        repromptText = {
            speech: "For instructions on what you can say, please say help me.",
            type:   AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechText, repromptText);
    }
};

exports.handler = function (event, context) {
    var areaCodeHelper = new AreaCodeHelper();
    areaCodeHelper.execute(event, context);
};
