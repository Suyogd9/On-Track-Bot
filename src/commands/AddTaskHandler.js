const AbstractHandler = require("../AbstractHandler");
const CardAPI = require("../api/CardAPI");
const DB =  require('../DB/readActive');
//include api for addtask

module.exports = class AddTaskHandler extends AbstractHandler {
    isValid() {
        const input = this.inputString.trim();
        return /^AddTask/i.test(input) ;
    }

    parseInput()
    {
        /*
        Invoked command would look like this:
        Collborators should be mentioned at the end, AFTER the description

        Only title for the task:
        addtask title
        addtask multi word title

        Collaborators with title
        addtask multi word title --collab @user1 @user2

        Description along with tile
        addtask multi word title --description This task should be simple, but it depends on the given data 

        Description with title and collaborators
        addtask multi word title --description This task should be simple, but it depends on the given data --collab @user1 @user2

        */
        const input = this.inputString.trim();
        const [, ...words] = input.split(" ");
        if(words.length <= 0)
        {
            throw new Error("Please pass a valid task name for the list");
        }
        

        //#region Parse different subparts of the command
        const taskNameWords = [];
        const descWords = [];
        const collabWords = [];
        let isDesc = false;
        let isCollabName = false;
        for(const word of words) {
            if(word.length == 0) {
                continue;
            }
            if(word == "--description") {
                isDesc = true;
                isCollabName = false;
                continue;
            } else if (word == "--collab") {
                isDesc = false;
                isCollabName = true;
                continue;
            }
            if(!isDesc && !isCollabName) {
                taskNameWords.push(word);
            } else if(isDesc) {
                descWords.push(word);
            } else if (isCollabName) {
                collabWords.push(word)
            }
        }
        //#endregion


        //#region Task title
        if(taskNameWords.length == 0)
        {
            throw new Error("Please pass a valid task name");
        }
        const taskName = taskNameWords.join(' ');
        //#endregion


        //#region Collaborators
        const collabs = []

        if(collabWords.length > 0)
        {
            //check that collaborators begin with '@'
            for (const collab of collabWords) {
                if(!collab.startsWith('@')) {
                    throw new Error(`Collaborator name should begin with "@": ${collab}`)
                }
                collabs.push(collab);
            }
        }
        //#endregion

        //#region Description
        let description = descWords.join(' ');
        //#endregion

        return {
            taskName,
            collabs,
            description,
        }
    }

    async handle({ client, channel_id, userEmail }){
        let taskName, collabUsernames, description;
        try{
            const parsed = this.parseInput();
            taskName = parsed.taskName;
            collabUsernames = parsed.collabs;
            description = parsed.description;
        } catch(e) {
                client.postMessage(e,channel_id);
                return;
        }

        const token = await DB.getUserToken(userEmail);
        const key = await DB.getUserKey(userEmail);

        const collabEmails = [];
        for (const cUser of collabUsernames) {
            const email = cUser.replace(/^@/, '') + '@ncsu.edu'
            collabEmails.push(email);
        }

        let card;
        try {
            card = await CardAPI.createCard({
                key,
                token,
                name: taskName,
                desc: description,
                collabEmails,
            });
        } catch (error) {
            console.error({error})
            client.postMessage(error, channel_id);
            return;
        }

        const msg = `Card was created successfully: ${card.shortUrl}`;
        client.postMessage(msg, channel_id)
       

        
    }
}
