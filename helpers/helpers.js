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
  }).then(userEventRow => {
    userEventRow.forEach(userEvent => {
      stubhubUrl = userEvent.Event.dataValues.url;
      stubhubEventId = stubhubUrl.split("/");
      realStubhubId = stubhubEventId[4];

      if (userEvent.fulfilled === false) {
        axios
          .get("https://api.stubhub.com/sellers/search/events/v3", {
            params: {
              id: realStubhubId
            }
          })
          .then(stubhubRes => {
            let sendEmailAndFulfill = stubhubRes.data.events.map(
              stubhubEvent => {
                var lowestPrice = stubhubEvent.ticketInfo.minListPrice; //gets the minimum price for tickets
                var requestedPrice = userEvent.dataValues.requestedPrice;

                console.log(lowestPrice, requestedPrice)

                if (lowestPrice <= requestedPrice) {
                  console.log('this is requestedPrice:lowestPrice', requestedPrice, ':', lowestPrice)
                  return new Promise(function(resolve, reject) {
                    let msg = {
                      to: "test@example.com", //`${y.User.email}`,
                      from: "test@example.com",
                      subject: "Your Tickets are ready to be bought!",
                      text: "and easy to do anywhere, even with Node.js",
                      html:
                        "<strong>and easy to do anywhere, even with Node.js</strong>"
                    };
                    sgMail.send(msg)
                    .then((data) => {
                      return models.User_event.update(
                        {
                          fulfilled: true
                        },
                        {
                          where: {
                            id: userEvent.dataValues.id
                          }
                        }
                      ).then(() => {
                        return true;
                      })
                      .catch(() => {
                        return false;
                      })
                    })
                    .then(() => {
                      return true
                    })
                    .then((fulfilled) => {
                      resolve(fulfilled);
                    })
                  });
                }
                return;
              });
              return Promise.all(sendEmailAndFulfill);
          })
          .then((values) => {
            console.log("successfully sent emails", values);
            return;
          })
          .catch(err => {
            console.log("Promise err", err);
            return;
          });
      }
    });
  });
}

price_poller();
