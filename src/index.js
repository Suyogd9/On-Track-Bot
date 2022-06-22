const MattermostClient = require('mattermost-client');
const CreateBoardHandler = require('./commands/CreateBoardHandler');
const ListTasksHandler = require('./commands/ListTasksHandler');
const ShowActiveHandler = require('./commands/ShowActiveHandler');
const AddTaskHandler = require('./commands/AddTaskHandler');
const SetActiveBoardHandler = require('./commands/SetActiveBoardHandler');
const MoveTaskHandler = require('./commands/MoveTaskHandler');

function getClientInstance(host, group) {
    const client = new MattermostClient(host, group, {});
    return client;
}

async function initializeBot() {
    const host = 'chat.robotcodelab.com';
    const group = 'CSC510-S22';
    const bot_name = '@ontrack';

    const client = getClientInstance(host, group);

    console.log('Token login begin')
    await client.tokenLogin(process.env.BOTTOKEN);
    console.log('Token login end')

    client.on('hello', () => {
        console.log('Startup')
    })
    client.on('message', function (msg) {
        const chatMessage = getChatMessage(msg);

        let channel_id = msg.broadcast.channel_id;
        if( msg.data.sender_name == bot_name) return;
        
        console.log('User typed:')
        console.log(chatMessage)
        const handlers = [
            CreateBoardHandler,
            ListTasksHandler,
            ShowActiveHandler,
            AddTaskHandler,
            SetActiveBoardHandler,
            MoveTaskHandler,
        ]

        console.log(msg)
        const senderName = getSenderName(msg);
        const userEmail = senderName.replace(/^@/, '') + '@ncsu.edu';
        console.log({userEmail})

        handlers.some(function(cls){
            const instance = new cls(chatMessage)
            const willHandleRequest = instance.isValid();

            if (willHandleRequest) {
                //* The handler can and should exit early if the subcommand is incorrect
                //* It will parse the string message and react as needed
                instance.handle({
                    client,
                    channel_id,
                    userEmail,
                });
            }
            return willHandleRequest;    
        })
    });

}

function getChatMessage(msg) {
    return JSON.parse(msg?.data?.post ?? '{}')?.message ?? '';
}

function getSenderName(msg) {
    return msg?.data?.sender_name ?? '';
}

module.exports = {
    getClientInstance,
    getChatMessage,
    getSenderName,
    initializeBot,
}
