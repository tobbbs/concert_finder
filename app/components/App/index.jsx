import React from 'react';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      bandName: '',
      date: '',
      email:'',
      requestedPrice: '',
       
    }
  }

  componentDidMount() {
    // component did mounts run when u load the webpage
  }

  handleSubmit(e) {
    e.preventDefault();
    const context = this;
    console.log("button works");
    console.log('state', this.state, 'context', context.state);
    axios.post('pull_ticket', {
      bandName: this.state.bandName,
      date: this.state.date, 
      email: this.state.email,
      requestedPrice: this.state.requestedPrice,

    })
    .then((res) => {
      console.log('sendback', this.state)
      this.setState({
        bandName: '',
      })
      console.log('41', this.state)
    })

  }

  handleChange(event) {
    console.log('change worked', this.state);
    const type = event.target.dataset.type;
    const value = event.target.value;
    console.log("type", type, "value", value);
    console.log("target", event.target.dataset);
    this.setState({
     [type]: value
    }); 


  }

  render() {
    console.log('60', this.state)
    return (
      <div>
       <form onSubmit={this.handleSubmit}>
          <label for="bandName">Band name</label>
          <input onChange={this.handleChange} type="text" id="bandName" name="bandName" data-type='bandName' placeholder="Band Name"/>
          <label for="date"> Date of concert </label>
          <input onChange={this.handleChange} type="date" name="date" data-type='date'/>
          <label for="email"> Contact email </label>
          <input onChange={this.handleChange} type="text" id="email" name="email" data-type='email' placeholder="Email Address"/>
          <label for="requestedPrice"> How much do you want to pay?</label>
          <input onChange={this.handleChange} type="text" id="requestedPrice" name="requestedPrice" data-type='requestedPrice' placeholder="Price"/>
          <input type="submit" value="Begin Search"/>
        </form>
      </div>
    )
  }
}
module.exports = App;
