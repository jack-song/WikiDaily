/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 **/

'use strict';

const Alexa = require('alexa-sdk');
const YQL = require('yql');
const util = require('util');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Daily Wiki',
            GET_ARTICLE_MESSAGE: "Today's article is: ",
            HELP_MESSAGE: "You can ask for today's featured wikipedia article.",
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetArticleIntent');
    },
    'GetArticleIntent': function () {
        // get today's article'
        var that = this;
        var selector = '(//*[@id="mw-content-text"]//*[contains(@class,"MainPageBG")][1]//b/a)[1]';
        var query = new YQL(util.format("select * from html where url='%s' and xpath='%s'", process.env.DW_ENDPOINT, selector));

        query.exec(function(err, data) {
            var article = data.query.results.a.title;
            
            // Create speech output
            const speechOutput = that.t('GET_ARTICLE_MESSAGE') + article;
            that.emit(':tellWithCard', speechOutput, that.t('SKILL_NAME'), article);
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
