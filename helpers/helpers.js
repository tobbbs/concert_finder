const models = require("../models");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const StubhubApi = require("../entities/stubhubApi")
const SeatgeekApi = require ("../entities/seatgeekApi")
require("dotenv").config({
    path: path.resolve(__dirname, "..", ".env")
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


models.sequelize.sync().then(function () {
    let stubhubApi = new StubhubApi ('Stubhub', 'https://api.stubhub.com/sellers/search/events/v3', process.env.STUBHUB_BEARER_TOKEN )
    let seatgeekApi =  new SeatgeekApi ('Seatgeek', 'https://api.seatgeek.com/2', process.env.SEATGEEK_BEARER_TOKEN)
    console.log("Nice! Database looks fine");
    return stubhubApi.pricePoller()
}).then(() => {
    models.sequelize.close();
}).catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
    models.sequelize.close()
});

