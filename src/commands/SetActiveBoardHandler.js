const AbstractHandler = require("../AbstractHandler"); 
const setActive= require("../DB/setActive");
const BoardAPI = require("../api/BoardAPI");
const MemberAPI = require("../api/MemberAPI");
const DB =  require('../DB/readActive');

module.exports = class SetActiveHandler extends AbstractHandler {
    //checks if the input message is valid
    isValid(){
        return /^setActive/i.test(this.inputString) 
    }

    parseInput() {
        const input = this.inputString;
        const args = input.split(' ');
        if(args.length <= 1)
        {
            throw new Error("Please enter a valid url for the board");
        }
        const boardUrl = args[1];

        return {
            boardUrl       
         }

    }

    async getBoardIdAndUrl({ token, key, userId, boardShortId}) {
        const boards = await BoardAPI.getBoards({ token, key, userId });

        let result;
        
        // for (var prop in boards) {
        //     if(boards[prop].shortLink == boardShortId)
        //         result = boards[prop].id
        // }
        const board = boards.find(board => {
            return board.shortLink === boardShortId;
        })
        
        if(board === undefined) {
            throw new Error(`This board couldn't be found: ${boardShortId}`)
        }

        return [board.id, board.url]

    }
    
    //handles the call to database to set the active board ID
    async handle({ client, channel_id, userEmail }){

        let boardShortId;
        try{
            const parsedname = this.parseInput();
            boardShortId = parsedname.boardUrl;
        } catch(e) {
                client.postMessage(e,channel_id);
                return;
        }

        if(boardShortId === undefined) {
            client.postMessage(`Please pass a shortId for the board`, channel_id)
            return ;
        }
        
        const token = await DB.getUserToken(userEmail);
        const key = await DB.getUserKey(userEmail);

        const myself = await MemberAPI.getMyself({ token, key });
        const userId = myself.id;

        try {


            //get boardid that member belongs to 
            const [boardid, boardUrl] = await this.getBoardIdAndUrl({
                token,
                key,
                userId,
                boardShortId,
            });
            
            //writing code required to call the function using attributes userId and BoardId
            setActive.setActiveBoardId({
                activeBoardId : boardid,
                userId: userId
            });

            client.postMessage(
                `Active board changed to: ${boardUrl}`,
                channel_id,
            )

        }
        catch (e) {
            console.error(e);
            client.postMessage(e, channel_id);
            return;
        }

        
}
}


