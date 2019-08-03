const express = require("express");
const router = express.Router();
const models = require("../models");
const axios = require("axios");
const moment = require("moment");
const StubhubApi = require("../entities/stubhubApi");
const SeatgeekApi = require("../entities/seatgeekApi");
let stubhubApi = new StubhubApi(
  "Stubhub",
  "https://api.stubhub.com/sellers/search/events/v3",
  process.env.STUBHUB_BEARER_TOKEN
);
let seatgeekApi = new SeatgeekApi(
  "Seatgeek",
  "https://api.seatgeek.com/2/events",
  process.env.SEATGEEK_CLIENT_ID
);
router.get("/", function(req, res, next) {
  return res.render("index");
});

router.post(
  "/pull_ticket",
  [stubhubApi.fetchevents, seatgeekApi.fetchevents],
  function(req, res, next) {
    console.log("before sending");
    res.send(req.body);
  }
);

router.post("/data_input", function(req, res, next) {
  console.log("what we get from the checkboxes", req.body);
  models.User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(foundUser => {
      if (!foundUser) {
        return new Promise((resolve, reject) => {
          models.User.create({
            email: req.body.email
          }).then(createdUser => {
            resolve(createdUser);
          });
        });
      } else {
        return foundUser;
      }
    })
    .then(userRow => {
      var checkedEvents = req.body.checkEvents;
      var eventUrls = Object.keys(checkedEvents).map(
        eventId => checkedEvents[eventId]
      );
      models.Event.findAll({
        where: {
          url: { $in: eventUrls }
        }
      })
        .then(foundEvents => {
          let userEventRows = [];
          eventUrls.forEach(eventUrl => {
            let foundEvent = foundEvents.filter(
              event => event.dataValues.url === eventUrl
            )[0];

            if (!foundEvent) {
              userEventRows.push(
                new Promise((resolve, reject) => {
                  models.Event.create({
                    url: checkedEvents.eventId
                  }).then(createdEvent => {
                    resolve([createdEvent, userRow]);
                  });
                })
              );
            } else {
              userEventRows.push(
                new Promise((resolve, reject) => {
                  resolve([foundEvent, userRow]);
                })
              );
            }
          });
          return Promise.all(userEventRows);
        })
        .then(userEventRows => {
          var promises = [];
          userEventRows.forEach(([eventRow, userRow]) => {
            promises.push(
              new Promise((resolve, reject) => {
                models.User_event.findOne({
                  where: {
                    userId: userRow.id,
                    eventId: eventRow.id
                  }
                }).then(foundUserEvent => {
                  if (!foundUserEvent) {
                      models.User_event.create({
                        requestedPrice: req.body.requestedPrice,
                        userId: userRow.id,
                        eventId: eventRow.id,
                        fulfilled: false
                      }).then(createdUserEvent => {
                        resolve(createdUserEvent);
                      });
                  } else {
                    resolve('userEvent found');
                  }
                });
              })
            );
          });
          return Promise.all(promises);
        })
        .then((x) => {
          console.log('this is x ', x)
          res.send(200, req.body);
        });
    });
});

module.exports = router;
