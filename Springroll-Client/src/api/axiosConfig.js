//used to make remote http request from the relevant api (aka our springroll backend)
//this is a configuration file to make sure everything works fine

//ps, i hate javascript
import axios from 'axios';

export default axios.create({
    baseURL: 'localhost:8080', //<--- todo, should be the base url for our website, but wouldnt that be localhost? kekw
    headers: { "ngrok-skip-browser-warning": "true" }
});
