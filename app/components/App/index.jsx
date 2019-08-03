import React from "react";
import axios from "axios";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDataInput = this.handleDataInput.bind(this);
    this.handleTrack = this.handleTrack.bind(this);
    this.confirmEvents = this.confirmEvents.bind(this);

    this.state = {
      bandName: "",
      date: "",
      email: "",
      requestedPrice: "",
      ticketsFoundSeatgeek: [],
      ticketsFoundStubhub: [],
      checkEvents: {},
    };
  }

  componentDidMount() {
    // component did mounts run when u load the webpage
  }

  handleSubmit(e) {
    e.preventDefault();
    const context = this;
    console.log("button works");
    console.log("state", this.state, "context", context.state);
    axios
      .post("pull_ticket", {
        bandName: this.state.bandName,
        date: this.state.date,
        email: this.state.email,
        requestedPrice: this.state.requestedPrice
      })
      .then(res => {
        console.log("sendback", this.state);
        console.log(res.data);
        this.setState({
          ticketsFoundSeatgeek: res.data.seatgeek.events,
          ticketsFoundStubhub: res.data.stubhub.events
        });
        console.log(res.data.seatgeek.events);
        console.log(res.data.stubhub.events);
      });
  }

  handleChange(event) {
    console.log("change worked", this.state);
    const type = event.target.dataset.type;
    const value = event.target.value;
    console.log("type", type, "value", value);
    console.log("target", event.target.dataset);
    this.setState({
      [type]: value
    });
  }

  handleDataInput(e) {
    console.log("datainput state", this.state);
    console.log(e.target.id);
    console.log("bandname", bandName);
    var context = this.state;
    context.eventId = e.target.id;
    context.url = e.target.dataset.url;

    axios.post("/data_input", context).then(() => {
      //go to a confirmation page
    });
  }

  handleTrack(e) {
    console.log(
      "what checkboxes give me",
      e.target.checked,
      e.target.dataset.url,
      e.target.id
    );
    var context = this.state;
    var checkedEvents = this.state.checkEvents;
    if (e.target.checked === true) {
      checkedEvents[e.target.id] = e.target.dataset.url;
    } else {
      delete checkedEvents[e.target.id];
    }
    this.setState({
      checkEvents: checkedEvents
    });
  }
  confirmEvents(e) {
    e.preventDefault();
    var context = this.state
    delete context.ticketsFoundSeatgeek;
    delete context.ticketsFoundStubhub;
    console.log("state after submitting", this.state);
    axios
      .post("/data_input", context)

      .then(res => {
        console.log("finally went through");
      });
  }

  render() {
    var context = this;
    var artistName = this.state.bandName;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label for="bandName">Band name</label>
          <input
            onChange={this.handleChange}
            type="text"
            id="bandName"
            name="bandName"
            data-type="bandName"
            placeholder="Band Name"
          />
          <label for="date"> Date of concert </label>
          <input
            onChange={this.handleChange}
            type="date"
            name="date"
            data-type="date"
          />
          <label for="email"> Contact email </label>
          <input
            onChange={this.handleChange}
            type="text"
            id="email"
            name="email"
            data-type="email"
            placeholder="Email Address"
          />
          <label for="requestedPrice"> How much do you want to pay?</label>
          <input
            onChange={this.handleChange}
            type="text"
            id="requestedPrice"
            name="requestedPrice"
            data-type="requestedPrice"
            placeholder="Price"
          />
          <input type="submit" value="Begin Search" />
        </form>
        <form onSubmit={this.handleTrack}>
          {this.state.ticketsFoundStubhub.map(x => {
            return (
              <div class="checkboxItems">
                <input
                  type="checkbox"
                  id={x.id}
                  data-url={x.webURI}
                  onChange={this.handleTrack}
                />
                <label class="custom-control-label" for="defaultChecked2">
                  {x.description} Current lowest price:{" "}
                  {x.ticketInfo.minListPrice}{" "}
                </label>
              </div>
            );
          })}
          {this.state.ticketsFoundSeatgeek.map(x => {
            return (
              <div class="checkboxItems">
                <input
                  type="checkbox"
                  id={x.id}
                  data-url={x.url}
                  onChange={this.handleTrack}
                />
                <label class="custom-control-label" for="defaultChecked2">
                  {artistName} performing at
                  {x.venue.name}
                  Current lowest price: {x.stats.lowest_price}{" "}
                </label>
              </div>
            );
          })}

          <input
            type="submit"
            onClick={this.confirmEvents}
            id="confirmEvent"
            value="Watch these pages"
          />
        </form>
      </div>
    );
  }
}
module.exports = App;
