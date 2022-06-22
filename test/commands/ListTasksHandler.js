const { expect, assert } = require("chai");
const sinon = require('sinon');
const BoardAPI = require("../../src/api/BoardAPI");
const ListAPI = require("../../src/api/ListAPI");
const ListTasksHandler = require("../../src/commands/ListTasksHandler");

describe("ListTasksHandler", () => {
    it("parses command correctly", () => {
        const inputString = "listtasks todo";
        const instance = new ListTasksHandler(inputString);

        
        const parsed = instance.parseInput();
        expect(parsed).to.have.property('listName', 'todo');
        expect(parsed).to.have.property('showAll', false);

    });

    it("calls correct Trello APIs", async () => {

        const inputString = "listtasks todo";
        const instance = new ListTasksHandler(inputString);
        const postFake = sinon.fake();
        const boardGetListsSpy = sinon.spy(BoardAPI, 'getLists');
        const boardGetActiveBoardSpy = sinon.spy(BoardAPI, 'getActiveBoard');
        const listGetCardsSpy = sinon.spy(ListAPI, 'getCards');

        await instance.handle({
            client: {
                postMessage: postFake,
            },
            userEmail: 'fake@ncsu.edu',
        })

        assert.equal(postFake.callCount, 1);
        assert.equal(boardGetListsSpy.callCount, 1);
        assert.equal(listGetCardsSpy.callCount, 1);
        assert.equal(boardGetActiveBoardSpy.callCount, 1);

        boardGetActiveBoardSpy.restore();
        boardGetListsSpy.restore();
        listGetCardsSpy.restore();

    });

})