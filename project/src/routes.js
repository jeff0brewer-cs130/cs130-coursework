require('dotenv').config();
const axios = require('axios');
const { response } = require('express');
const express = require("express");
const router = express.Router();

axios.defaults.headers.common['X-API-Key'] = process.env.BUNGIE_API_KEY;

let OAuth = {
    client_id: '36633',
    client_secret: 'wtb8SXXP-uTQY3xLDhQw3vML-6hjxd881X3sCiRQGYE'
};

let user = {};

const encodebase64 = str => {
    let buff = Buffer.from(str);
    return buff.toString('base64');
};

const bungieURL = 'https://www.bungie.net/Platform';

router.route("/authorize/:auth_code")
    .get((req, res) => {
        console.log(`GET /authorize/${req.params.auth_code}`);
        axios.post(`${bungieURL}/App/OAuth/Token/`, `grant_type=authorization_code&code=${req.params.auth_code}`,
            {
                headers: {
                    "Authorization": `Basic ${encodebase64(`${OAuth.client_id}:${OAuth.client_secret}`)}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                OAuth.access_token = response.data.access_token;
                axios.get(`${bungieURL}/User/GetMembershipsForCurrentUser/`, {
                        headers: {
                            Authorization: 'Bearer ' + OAuth.access_token
                        }
                    })
                    .then(response => {
                        const destiny_info = response.data.Response.destinyMemberships[0];
                        user.username = destiny_info.displayName;
                        user.member_id = destiny_info.membershipId;
                        user.member_type = destiny_info.membershipType;
                        res.status(200).send();
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send();
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
    });

router.route("/getProfile/:components")
    .get((req, res) => {
        console.log(`GET /getProfile/${req.params.components}`);

        axios.get(`${bungieURL}/Destiny2/${user.member_type}/Profile/${user.member_id}?components=${req.params.components}`, {
                headers: {
                    Authorization: 'Bearer ' + OAuth.access_token
                }
            })
            .then(response => {
                res.status(200).send(JSON.stringify(response.data.Response));
            })
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
    });

router.route("/itemlookup/:hash")
    .get((req, res) => {
        console.log(`GET /itemlookup/${req.params.hash}`);

        axios.get(`${bungieURL}/Destiny2/Manifest/DestinyInventoryItemDefinition/${req.params.hash}/`,  {
                headers: {
                    Authorization: 'Bearer ' + OAuth.access_token
                }
            })
            .then(response => {
                res.status(200).send(JSON.stringify(response.data.Response.displayProperties));
            })
            .catch(err => {
                console.log(err);
                res.status(500).send();
            });
    });



module.exports = router;