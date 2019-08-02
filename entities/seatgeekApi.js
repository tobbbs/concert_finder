const generalApi = require("./generalApi");

class SeatgeekApi extends generalApi {
    constructor(name, apiUrl, envToken) {
        super(name, apiUrl, envToken); // call the super class constructor and pass in the name parameter

        const axios = require('axios');
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
}

module.exports = SeatgeekApi;