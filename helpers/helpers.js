const express = require("express");
const router = express.Router();
const models = require("../models");
const axios = require("axios");
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
axios.defaults.headers.common["Authorization"] = `Bearer ${
  process.env.STUBHUB_BEARER_TOKEN
}`;

models.sequelize
  .sync()
  .then(function() {
    console.log("Nice! Database looks fine");
  })
  .catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!");
  });

function price_poller() {
  models.User_event.findAll({
    include: [
      {
        model: models.User
      },
      {
        model: models.Event
      }
    ]
  }).then(blegh => {
    blegh
      .forEach(x => {
        stubhubUrl = x.Event.dataValues.url;
        stubhubEventId = stubhubUrl.split("/");
        realStubhubId = stubhubEventId[4];

        if (x.fulfilled == false) {
          axios
            .get("https://api.stubhub.com/sellers/search/events/v3", {
              params: {
                id: realStubhubId
              }
            })
            .then(stubhubRes => {
              let promiseGetEvents = stubhubRes.data.events.map(x => {
                var lowestPrice = x.ticketInfo.minListPrice; //gets the minimum price for tickets
                var obtainedUrl = `https://www.stubhub.com/event/${x.id}`;
                //dictionary for lowest price and id?

                return new Promise(function(resolve, reject) {
                  models.Event.findOne({
                    where: {
                      url: obtainedUrl
                    },
                    include: [
                      {
                        model: models.User_event,
                        include: [
                          {
                            model: models.User
                          }
                        ]
                      }
                    ]
                  })
                    .then(event => {
                      resolve([event, lowestPrice]);
                    })
                    .catch(err => {
                      reject(err);
                    });
                });
              });
              return Promise.all(promiseGetEvents);
            })
            .then(values => {
              let promises = [];
              values.forEach(res => {
                let x = res[0];
                let lowestPrice = res[1];
                let event = x.dataValues;
                let userEvents = event.User_events;
                userEvents.forEach(y => {
                  let requestedPrice = y.dataValues.requestedPrice;
                  if (requestedPrice < parseFloat(lowestPrice)) {
                    promises.push(
                      new Promise(function(resolve, reject) {
                        let msg = {
                          to: "test@example.com", //`${y.User.email}`,
                          from: "test@example.com",
                          subject: "Your Tickets are ready to be bought!",
                          text: "and easy to do anywhere, even with Node.js",
                          html:
                            "<strong>and easy to do anywhere, even with Node.js</strong>"
                        };
                        sgMail.send(msg).then(data => {
                          models.User_event.update(
                            {
                              fulfilled: true
                            },
                            {
                              where: {
                                id: y.dataValues.id
                              }
                            }
                          ).then(() => {
                            resolve();
                          });
                        });
                      })
                    );
                  }
                });
              });
              return Promise.all(promises);
            })
            .then(() => {
              console.log("successfully sent email");
              return;
            })
            .catch(err => {
              console.log("Promise err", err);
              return;
            });
        }
      })
      
  });
}

price_poller();
