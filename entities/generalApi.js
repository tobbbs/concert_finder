const express = require("express");
const router = express.Router();
const models = require("../models");
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config({
    path: path.resolve(__dirname, "..", ".env")
});

class GeneralApi {
    constructor(name, apiURL, envToken) {
        this.name = name;
        this.apiURL = apiURL;
        this.envToken;
      
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log(process.env.SENDGRID_API_KEY, 'sendgrid');
    }

    sendEmail(userEvent) {
        let {url: eventURL} = userEvent.Event.dataValues;
        let {id: userId, email: userEmail} = userEvent.User.dataValues;
        let msg = {
            to: userEmail,
            from: "test@example.com",
            subject: "Your Tickets are ready to be bought!",
            text: `Buy it here! ${eventURL}`,
            html: `<strong>Buy it here! ${eventURL}</strong>`
        };
        //return sgMail.send(msg)
        //.then((data) => {
            return models.User_event.update({
                fulfilled: true
            }, {
                where: {
                    id: userId
                }
            })
            .catch((err) => {
                return err;
            })
        //});
    }

    getEventId(url) {
        return url
    }

    sendEmailAndFulfill(apiResEvents) {
        let promises = [];
        return Promise.all(promises);
    }

    fetchDataFromApi(userEventRow) {
        let promises = [];
        let context = this;
        userEventRow.forEach(userEvent => {
            let {url: eventURL} = userEvent.Event.dataValues;
            let eventId = this.getEventId(eventURL);

            if (!userEvent.fulfilled) {
                console.log('Axios', context.axios.defaults.headers.common)
                promises.push(context.axios.get(this.apiURL, {
                    params: {
                        id: eventId
                    }
                }).then(apiRes => {
                    return([apiRes, userEvent]);
                }).then((values) => {
                    return values;
                }).catch(err => {
                    //console.log('error', err)
                    return err;
                }));
            }
        });
        return Promise.all(promises);
    }

    pricePoller() {
        return new Promise((resolve, reject) => {
            models.User_event.findAll({
                include: [
                    {
                        model: models.User
                    }, {
                        model: models.Event
                    }
                ]
            }).then(userEventRow => {
                return this.fetchDataFromApi(userEventRow);
            }).then(apiEventsRes => {
                resolve(this.sendEmailAndFulfill(apiEventsRes));
            }).catch((err) => {
                reject(err);
            })
        });
    }
}

module.exports = GeneralApi;