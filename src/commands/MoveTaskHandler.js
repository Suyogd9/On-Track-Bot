const AbstractHandler = require("../AbstractHandler");
const BoardAPI = require("../api/BoardAPI");
const CardAPI = require("../api/CardAPI");
const ListAPI = require("../api/ListAPI");
const MemberAPI = require("../api/MemberAPI");
const DB =  require('../DB/readActive');

module.exports = class MoveTaskHandler extends AbstractHandler {
    isValid() {
        const input = this.inputString.trim();
        return /^MoveTask/i.test(input);
    }

    parseInput() {
        const input = this.inputString.trim();
        const args = input.split(' ');
        const toListName = args[1];
        const validList = /(inprogress)|(done)/i.test(toListName);
        if (!validList) {
            throw new Error("Please pass a valid destination list and task card ID");
        }

        const taskid = args[2];

        return {
            toListName, taskid
        }

    }

    async getCards({ key, token, boardId, listName }) {
        const lists = await BoardAPI.getLists({ key, token, boardId });
        const removeDashAndLowerCase = (s) => s.toLowerCase().replace(/[-\s]/g, '');
        const matcher = {
            todo: (list) => /(todo)/i.test(removeDashAndLowerCase(list.name)),
            inprogress: (list) => /(inprogress)|(doing)/i.test(removeDashAndLowerCase(list.name)),
            done: (list) => /done/i.test(removeDashAndLowerCase(list.name)),
        }

        const listForTasks = lists.find(matcher[listName]);
        if(!listForTasks) {
            return;
        }

        const cards = await ListAPI.getCards({ key, token, listId: listForTasks.id });
        return cards;
    }

    async handle({ client, channel_id, userEmail }){
        let toListName, taskid;
        try{
            const parsed = this.parseInput();
            toListName = parsed.toListName;
            taskid = parsed.taskid;
        } catch(e) {
                client.postMessage(e,channel_id);
                return;
        }

        const token = await DB.getUserToken(userEmail);
        const key = await DB.getUserKey(userEmail);
       
        const prevListName = {
            inprogress: "todo",
            done: "inprogress",
        }[toListName];
        const myself = await MemberAPI.getMyself({ token, key });
        const userId = myself.id;
        const projectBoardForUser = await BoardAPI.getActiveBoard({ token, key, userId });
        const cards = await this.getCards({ token, key, boardId: projectBoardForUser.id, listName: prevListName})
        
        const foundCard = cards.find(card => {
            return card.id === taskid
        });

        if (foundCard === undefined){
            client.postMessage(`Given card id was not found in the list. Please specify correct card id and list name.`,channel_id)
            return;
        }

        const lists = await BoardAPI.getLists({ token, key, boardId: projectBoardForUser.id });
        const removeDashAndLowerCase = (s) => s.toLowerCase().replace(/[-\s]/g, '');
        const matcher = {
            todo: (list) => /(todo)/i.test(removeDashAndLowerCase(list.name)),
            inprogress: (list) => /(inprogress)|(doing)/i.test(removeDashAndLowerCase(list.name)),
            done: (list) => /done/i.test(removeDashAndLowerCase(list.name)),
        }

        const destList = lists.find(matcher[toListName]);

        try {
            await CardAPI.moveCard({
                token,
                key,
                cardID: foundCard.id,
                destListID: destList.id,
            })
        } catch(e) {
            client.postMessage(e,channel_id);
            console.error(e);
            return
        }

        client.postMessage("Card successfully moved.",channel_id);

    };

}