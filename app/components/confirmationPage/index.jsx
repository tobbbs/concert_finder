import React from "react";
import axios from "axios";


export default class confirmationPage extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    
  }
  render() {
    
    return (
      <div id="background">
        confirmation that u r tracking these things
      
        <hr class="f"/>    
            <div className='footer'>
            <a href="https://www.instagram.com/tobinleung/?hl=en"><img src="https://mpng.pngfly.com/20180705/fai/kisspng-instagram-logo-computer-icons-insta-logo-5b3dd0b627ad89.2825955615307777821625.jpg" title="Instagram" id="Instagram" /></a>
            © 2019 Tobin Leung. Made in YVR
            </div>
      </div>
    );
  }  
}


module.exports = confirmationPage;