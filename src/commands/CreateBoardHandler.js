const AbstractHandler = require("../AbstractHandler");
const BoardAPI = require("../api/BoardAPI")
const DB =  require('../DB/readActive');

module.exports = class CreateBoardHandler extends AbstractHandler {
    isValid(){
        return /^CreateBoard/i.test(this.inputString) 
    }

    parseInput()
    {
        const arr = this.inputString.split(" ");
        if(arr.length <= 1)
        {
            throw new Error("Please pass a valid name for the board");
        }

        const name = arr[1];
        const validname = /^[0-9a-zA-Z]+$/.test(name)
        if(!validname)
        {
            throw new Error("Please pass a valid name for the board");
        }
        return {
            name
        }
    }

    async handle({ client, channel_id, userEmail }){
        let name;
        try{
            const parsedname = this.parseInput();
            name = parsedname.name;
        } catch(e) {
                client.postMessage(e,channel_id);
                return;
        }
       
        if(name === undefined) {
            client.postMessage(`Please pass a name for the board`,channel_id)
            return ;
        }

        const token = await DB.getUserToken(userEmail);
        const key = await DB.getUserKey(userEmail);

        BoardAPI.createBoard({ token, key, boardName: name }).then(function (response) {
                const data = response.data
                const w = "This is the link to the board " + data.url
                client.postMessage(w, channel_id);
			})
			.catch(function (error) {
                console.error(`Error in BoardAPI.createBoard`)
                console.log(error);
            });
        };

}
