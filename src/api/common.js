const axios = require('axios')

module.exports = {
    getAxiosInstance() {
        return axios.create({
            baseURL: "https://api.trello.com",   
        });
    },
    //Get the key,token ad workspace name from the environment variables
    getConfig() {
        const config = {}

        config.workspace = process.env.TRELLOWORKSPACE;

        return config;
    },
}
