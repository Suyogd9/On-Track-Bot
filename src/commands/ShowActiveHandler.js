const AbstractHandler = require("../AbstractHandler"); 
const BoardAPI = require("../api/BoardAPI");
const MemberAPI = require("../api/MemberAPI");
const DB =  require('../DB/readActive');

module.exports = class Show_ActiveHandler extends AbstractHandler {
    //checks if the input message is valid
    isValid(){
        return /^displayActiveBoard/i.test(this.inputString) 
    }

    //handles the call to postgresSQL database to get the active board ID
    async handle({ client, channel_id, userEmail }){


        const token = await DB.getUserToken(userEmail);
        const key = await DB.getUserKey(userEmail);

        console.log({ token})

        const myself = await MemberAPI.getMyself({ token, key });
        const userId = myself.id;
        await BoardAPI.getActiveBoard({ key, token, userId }).then((board) => {
            const w = `Active board is "${board.name}"`
            client.postMessage(w, channel_id);
        })
        .catch((error) => {
            console.error(`Error in GetBoardAPI.getBoard`)
            console.log(error);
        });
    }
}
