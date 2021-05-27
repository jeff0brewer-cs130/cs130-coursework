const axios = require('axios');
require('dotenv').config();

axios.defaults.headers.common['X-API-Key'] = process.env.BUNGIE_API_KEY;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + 'COmfAxKGAgAgWtQ/01WHoTfu7hYguyGo+51PR7wQHThS3A3xIyplHSjgAAAA2QYtKaILMG7OVbT0cAS/7levgj57G/E/b6mKDrSy/LkBFQKIdW0t50l9HFnLS/nvlD7qQkQMcc+Uoq35pItNPPF5Yq8CqF9SKqOzncxEhDNoAt+XJFaPH+w6OMPAVxDP4X3AmkMTAbTl+ILBc2Z0Jf46jdXda4uOVZrnvDVQvgnweIA8iRQ9mKez/C9JY+8dvtaSKAAQz+S/bEmnKXRLk5YZ94MjFYs5FGoRQZeTPzhahfBgZaZSzveItctiCAK/mahXh6GNy6krzP4EDiZoe2OOUOs6eZm2u9cI2AdbG0A=';
const baseURL = 'https://www.bungie.net/Platform'

let user_info = {
    username: 'alf swarm',
    membershipType: 1
};

// axios.get(`${baseURL}/Destiny2/SearchDestinyPlayer/${user_info.membershipType}/${user_info.username}?returnOriginalProfile=true`)
//     .then(res => {
//         user_info.membershipId = res.data.Response[0].membershipId;
//         // axios.get(`${baseURL}/User/GetBungieAccount/${user_info.membershipId}/254/`)
//         //     .then(res => {
//         //         console.log(res.data.Response.destinyMemberships);
//         //         console.log(user_info);
//         //     })
//         axios.get(`${baseURL}/User/GetMembershipsById/${user_info.membershipId}/${user_info.membershipType}`)
//             .then(res => {
//                 console.log(res.data.Response);
//                 console.log(user_info)
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     })

axios.get(`https://www.bungie.net/Platform/User/GetCurrentBungieNetUser/`)
    .then(res => {
        console.log(res.data.Response);
    })
    .catch(err => {
        console.log(err);
    })

    