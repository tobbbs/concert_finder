const GeneralApi = require("./generalApi");
const express = require("express");
const router = express.Router();
const models = require("../models");
const axios = require('axios');
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

class StubhubApi extends GeneralApi {
    constructor(name, apiUrl, envToken) {
        axiosInstance = axios.create();
        super(name, apiUrl, envToken, axiosInstance); // call the super class constructor and pass in the name parameter
        console.log(this.axios.defaults.headers);
      }
    getEventId(url) {
        return url.split('/')[4]
    }

    sendEmailAndFulfill(apiResEvents) {
        let promises = [];
        var context = this;
        apiResEvents.forEach(([apiRes, userEvent]) => {
            let {events: apiEvents} = apiRes.data;
            apiEvents.forEach(apiEvent => {
                let {minListPrice: lowestPrice} = apiEvent.ticketInfo;
                let { requestedPrice } = userEvent.dataValues;
                let { email } = userEvent.User.dataValues;

                if (lowestPrice <= requestedPrice) {
                    promises.push(new Promise(function (resolve, reject) {
                        context.sendEmail(userEvent).then(() => {
                            resolve(`Successfully sent email to ${email}`);
                        }).catch((err) => {
                            reject(err.response.body);
                        })
                    }))
                }
            });
        })
        return Promise.all(promises);
    }
}

module.exports = StubhubApi;
