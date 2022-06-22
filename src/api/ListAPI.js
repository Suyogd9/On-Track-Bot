const { getAxiosInstance, getConfig } = require("./common")

//get list of tasks for paticular userID
module.exports = {
    getCards({ key, token, listId }) {
        const instance = getAxiosInstance();
        const config = getConfig();
        return instance.request({
            method: 'GET',
            url: `/1/lists/${listId}/cards`,
            params: {
                key,
                token,
            },
        }).then(res => res.data);
    },
}