const GeneralApi = require("./generalApi");
const express = require("express");
const router = express.Router();
const models = require("../models");
const moment = require("moment");
const axios = require('axios');
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

class StubhubApi extends GeneralApi {
    constructor(name, apiUrl, envToken) {
        super(name, apiUrl, envToken); // call the super class constructor and pass in the name parameter

        this.axios = axios.create({
            headers: {
                'Authorization':`Bearer ${envToken}` 
            }
        });
    }

    getEventId(url) {
        return url.split('/')[4]
    }

    sendEmailAndFulfill(apiResEvents) {
        let promises = [];
        var context = this;

        apiResEvents.forEach(([apiRes, userEvent]) => {
            let {events: apiEvents} = apiRes.data;
            let apiEvent = apiEvents[0];
            let {minListPrice: lowestPrice} = apiEvent.ticketInfo;
            let {requestedPrice} = userEvent.dataValues;
            let {email} = userEvent.User.dataValues;

            if (lowestPrice <= requestedPrice) {
                promises.push(new Promise(function (resolve, reject) {
                    context.sendEmail(userEvent).then(() => {
                        resolve(`Successfully sent email to ${email}`);
                    }).catch((err) => {
                        reject(err.response.body);
                    })
                }))
            }
        })
        return Promise.all(promises);
    }
    fetchevents(req, res, next) {
        console.log('in fetch events 1')
        var today = moment(req.body.date, "YYYY-MM-DD")
        var tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD');
        console.log('first line')
        axios.get('https://api.stubhub.com/sellers/search/events/v3', {
            params: {
      
              dateLocal: req.body.date + " TO " + tomorrow, 
              performerName: req.body.bandName
            },
            headers: { 'Authorization': `Bearer ${process.env.STUBHUB_BEARER_TOKEN}`}
        })
        .then((stubhubRes) =>{
          req.body["stubhub"] = stubhubRes.data;
          return next();
        })
        .catch((err) => {
            console.log('error', err)
        })
    }

}

module.exports = StubhubApi;
