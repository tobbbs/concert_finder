const GeneralApi = require("./generalApi");
const express = require("express");
const router = express.Router();
const models = require("../models");
const moment = require("moment");
const axios = require('axios');
const path = require("path");

class SeatgeekApi extends GeneralApi {
    constructor(name, apiUrl, envToken) {
        super(name, apiUrl, envToken); // call the super class constructor and pass in the name parameter

        const axios = require('axios');
        this.axios = axios.create({
          config: { headers: {'Content-Type': 'application/json' }}
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
      var today = moment(req.body.date, "YYYY-MM-DD")
      var tomorrow = moment(today).add(1, 'days').format('YYYY-MM-DD')
      var performers = req.body.bandName
      var cleanPerformers = performers.replace(" ", "-")
      axios.get(`https://api.seatgeek.com/2/events`, {
        params: {
          client_id : process.env.SEATGEEK_CLIENT_ID,
          "performers.slug": cleanPerformers,
          "datetime_local.gte" : req.body.date,
          "datetime_local.lte" : tomorrow
        } 
      })
    .then((seatgeekRes) => {
      req.body["seatgeek"] = seatgeekRes.data 
      return next();
    })
    .catch((err)=> {
      console.log('made an oops', err.response.data)
    });
    }

}

module.exports = SeatgeekApi;