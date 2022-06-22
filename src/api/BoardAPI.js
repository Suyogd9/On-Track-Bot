const { getAxiosInstance, getConfig } = require("./common")

const readSQL = require("../DB/readActive")

module.exports = {
    //API call to create a board with name given in he input string
    createBoard({ token, key, boardName }) {
        const instance = getAxiosInstance();
        const config = getConfig();
        return instance.request({
            method: 'POST',
            url: `/1/boards/`,
            params: {
                name: boardName,
                idOrganization: config.workspace,
                key,
                token,
            }
        });
    },

    //API call to get list of tasks of the active board
    getLists({ token, key, boardId }) {
        const instance = getAxiosInstance();
        const config = getConfig();

        return instance.request({
            url: `/1/boards/${boardId}/lists`,
            params: {
                key,
                token,
            }
        }).then(res => res.data);

    },

    getBoards({ token, key, userId })
    {
        const instance = getAxiosInstance();
        const config = getConfig();

        return instance.request({
            url: `/1/members/${userId}/boards`,
            params: {
                key,
                token,
            }
        }).then(res => res.data);
    },

    //API call to get information about activeboard based on userID
    async getActiveBoard({
        token,
        key,
        userId,
    }) {
        const instance = getAxiosInstance();
        const config = getConfig();
        const boardId = await readSQL.getActiveBoardId({ userId });

        return instance.request({
            method: 'GET',
            url: `/1/boards/${boardId}`,
            params: {
                key,
                token,
            },
        }).then(res => res.data);

    },    

}
