const AbstractHandler = require("../AbstractHandler");
const BoardAPI = require("../api/BoardAPI")
const ListAPI = require("../api/ListAPI");
const MemberAPI = require("../api/MemberAPI");
const DB =  require('../DB/readActive');

module.exports = class ListTasksHandler extends AbstractHandler {
    isValid() {
        const input = this.inputString.trim();
        return /^listtasks/i.test(input);
    }

    parseInput() {
        const input = this.inputString.trim();
        const args = input.split(' ');
        const listName = args[1];
        const validList = /(todo)|(inprogress)|(done)/i.test(listName);
        if (!validList) {
            throw new Error("Invalid list name");
        }
        return {
            listName,
            showAll: args[2] === "--all",
        }

    }

    async getCards({ token, key, boardId, listName }) {
        const lists = await BoardAPI.getLists({ token, key, boardId });
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

        const cards = await ListAPI.getCards({ token, key, listId: listForTasks.id });
        return cards;
    }

    async handle({ client, channel_id, userEmail }) {

        let listName;
        let showAll;
        try {
            const parsed = this.parseInput();
            listName = parsed.listName;
            showAll = parsed.showAll;
        } catch (e) {
            client.postMessage(e.message, channel_id);
            return;
        }

        const token = await DB.getUserToken(userEmail);
        const key = await DB.getUserKey(userEmail);


        const myself = await MemberAPI.getMyself({ token, key });
        const userId = myself.id;
        const projectBoardForUser = await BoardAPI.getActiveBoard({ key, token, userId });

        const cards = await this.getCards({
            key,
            token,
            boardId: projectBoardForUser.id,
            listName,
        });

        // Print the cards as needed
        const cardNames = cards
            .filter(card => {
                if(showAll) return showAll;
                return card.idMembers.find(id => userId == id)
            })
            .map(card => `ID: "${card.id}", Name: "${card.name}"`)
        
        client.postMessage(
            cardNames.join('\n'),
            channel_id
        );

    }
}