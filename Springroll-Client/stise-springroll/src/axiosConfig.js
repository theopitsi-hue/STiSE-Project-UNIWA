//used to make remote http request from the relevant api (aka our springroll backend)
//this is a configuration file to make sure everything works fine

//ps, i hate javascript
import axios from 'axios';

export default axios.create({
    baseURL: 'https://9c96-103-106-239-104.ap.ngrok.io',
    headers: { "ngrok-skip-browser-warning": "true" }
});
