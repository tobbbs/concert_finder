import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // component did mounts run when u load the webpage
  }

  handleSubmit(e) {
    
  }

  render() {
    return (
      <div>
       <form action="/action_page.php">
          <label for="bandName">Band name</label>
          <input type="text" id="bandName" name="bandName" placeholder="Band Name"/>
          <label for="date"> Date of concert </label>
          <input type="date" name="date"/>
          <label for="email"> Contact email </label>
          <input type="text" id="email" name="email" placeholder="Email Address"/>
          <label for="requestedPrice"> How much do you want to pay?</label>
          <input type="text" id="requestedPrice" name="requestedPrice" placeholder="Price"/>
          <input type="submit" value="Send"/>
        </form>
      </div>
    )
  }
}
