const { getAxiosInstance, getConfig } = require("./common")

const readSQL = require("../DB/readActive");
const MemberAPI = require("./MemberAPI");
const BoardAPI = require("./BoardAPI");

module.exports = {
    async createCard({
        key,
        token,
        name,
        desc,
        collabEmails,
    }) {
        const instance = getAxiosInstance();
        const config = getConfig();

        // Use user emails to figure out their Trello UserIDs
        const myself = await MemberAPI.getMyself({ key, token })
        const cardCreatorId = myself.id;

        // Add card creator to collaborator
        const idMembers = [ cardCreatorId ];

        for(const email of collabEmails) {
            // Might throw UserIdNotFoundError if user's Trello userid is not present in the database 
            const userId = await MemberAPI.getMemberIdFromEmail(email)
            idMembers.push(userId);
        }

        //#region Get todo list
        console.log({
            cardCreatorId,
        })
        const boardId = await readSQL.getActiveBoardId({ userId: cardCreatorId });
        console.log({
            boardId: boardId,
        })
        const lists = await BoardAPI.getLists({ token, key, boardId });
        const todoList = lists.find(list => {
            console.log({
                listname: list.name,
            })
            return /(to do)|(todo)/i.test(list.name);
        });
        //#endregion

        return instance.request({
            method: 'POST',
            url: `/1/cards/`,
            params: {
                name,
                desc,
                idMembers,
                idList: todoList.id,
                key,
                token,
            }
        }).then(res => res.data);
    },

    moveCard({
        token,
        key,
        cardID,
        destListID,
    }){
        const instance = getAxiosInstance();
        const config = getConfig();
        return instance.request({
            method:"PUT",
            url: `/1/cards/${cardID}`,
            params: {
                idList: destListID,
                key,
                token,
            },
        }).then(res => res.data);
    },



}
