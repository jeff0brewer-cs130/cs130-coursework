require('dotenv').config();
const axios = require('axios');
const express = require("express");
const router = express.Router();

axios.defaults.headers.common['X-API-Key'] = process.env.BUNGIE_API_KEY;

const OAuth = {
    client_id: '36633',
    client_secret: 'wtb8SXXP-uTQY3xLDhQw3vML-6hjxd881X3sCiRQGYE'
}

const encodebase64 = str => {
    let buff = new Buffer(str);
    return buff.toString('base64');
};

router.route("/authorize/:auth_code")
    .get((req, res) => {
        console.log(`GET /authorize/${req.params.auth_code}`);
        axios.post('https://www.bungie.net/Platform/App/OAuth/Token/', `grant_type=authorization_code&code=${auth_code}`,
            {
                headers: {
                    "Authorization": `Basic ${encodebase64(`${OAuth.client_id}:${OAuth.client_secret}`)}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(res => {
                OAuth.access_token = res.data.access_token;
                console.log(OAuth.access_token);
                res.status(200).send("authorization successful");
            })
            .catch(err => {
                console.log(err);
                res.status(500).send("authorization failed");
            });
    });



module.exports = router;