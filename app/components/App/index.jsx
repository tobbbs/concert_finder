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

      .then((res) => {
        console.log("finally went through", res);
        window.location = '/confirmationPage';
      });
  }

  renderEventsFound() {
    var context = this;
    var artistName = this.state.bandName;
    return (
      <div className='eventsFound'>
      <center> Select the events you want to keep an eye on! </center>
      <hr/>
      <form onSubmit={this.handleTrack}>
        {this.state.ticketsFoundStubhub.map(x => {
          return (
            <div className="checkboxItems">
              <input
                className=" col-md-3 checkbox"
                type="checkbox"
                id={x.id}
                data-url={x.webURI}
                onChange={this.handleTrack}
              />
              <label className=" col-md-9 custom-control-label" for="defaultChecked2">
                {x.description}  
                <div></div>
                Current lowest price: $
                {x.ticketInfo.minListPrice}{" "}
              </label>
            </div>
          );
        })}
        {this.state.ticketsFoundSeatgeek.map(x => {
          return (
            <div className="checkboxItems">
              <input
                className='col-md-3 checkbox'
                type="checkbox"
                id={x.id}
                data-url={x.url}
                onChange={this.handleTrack}
              />
              <label className=" col-md-9 custom-control-label" for="defaultChecked2">
                {artistName} performing at &nbsp; 
                {x.venue.name}
                <div></div>
                Current lowest price: ${x.stats.lowest_price}{" "}
              </label>
            </div>
          ); 
        })}

        <center><input
          className='col-md-12'
          type="submit"
          id="confirmEvent"
          onClick={this.confirmEvents}
          value="Watch these pages"
        />
        </center>
       </form>
    </div>  
    )
  }

  render() {
    var context = this;
    let {ticketsFoundSeatgeek, ticketsFoundStubhub} =this.state;
    return (
      <div id="background">
        <center>
        <div className='pageTitle'> Scalper, No Scalping </div>
        <img src='/scalper_icon.png' id='scalper'/>
        <div className='inputBoxContainer'>
          <form onSubmit={this.handleSubmit}>
          <div className='dataInput'>
            <label className='inputBoxTitle' for="bandName">Band name</label>
              <div><input
              className='inputBox'
              onChange={this.handleChange}
              type="text"
              id="bandName"
              name="bandName"
              data-type="bandName"
              placeholder="Band Name"
              autoFocus
              />
              </div>
          </div>
          <div className='dataInput'>
            <label className='inputBoxTitle' for="date"> Date of concert </label>
              <div><input
              className='inputBox'
              onChange={this.handleChange}
              type="date"
              name="date"
              data-type="date"
              />
              </div>
          </div>
          <div className='dataInput'>
            <label className='inputBoxTitle' for="email"> Contact email </label>
            <div><input
              className='inputBox'
              onChange={this.handleChange}
              type="text"
              id="email"
              name="email"
              data-type="email"
              placeholder="Email Address"
              />
              </div>
          </div>
          <div className='dataInput'>
            <label className='inputBoxTitle' for="requestedPrice"> How much do you want to pay?</label>
            <div><input
              className='inputBox'
              onChange={this.handleChange}
              type="text"
              id="requestedPrice"
              name="requestedPrice"
              data-type="requestedPrice"
              placeholder="Price"
              />
              </div>
          </div>
          <input type="submit" id='eventSearch' value="Begin Search" />
        </form>
        </div>
        </center>
      {ticketsFoundSeatgeek.length || ticketsFoundStubhub.length ? this.renderEventsFound() : <div></div>}
      <hr class="f"/>    
            <div className='footer'>
            <a href="https://www.instagram.com/tobinleung/?hl=en"><img src="https://mpng.pngfly.com/20180705/fai/kisspng-instagram-logo-computer-icons-insta-logo-5b3dd0b627ad89.2825955615307777821625.jpg" title="Instagram" id="Instagram" /></a>
            © 2019 Tobin Leung. Made in YVR
            </div>
     </div>
    );
  }
}
module.exports = App;
