const { getAxiosInstance, getConfig } = require("./common")

const readSQL = require("../DB/readActive");

module.exports = {
    getMyself({
        key,
        token,
    }) {
        const instance = getAxiosInstance();
        const config = getConfig();
        return instance.request({
            method: 'GET',
            url: `/1/members/me`,
            params: {
                key,
                token,
            },
        }).then(res => res.data);
    },

    getMemberIdFromEmail(email) {
        return readSQL.getUserIdFromEmail(email);
    },
}