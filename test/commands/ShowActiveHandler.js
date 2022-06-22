const { assert, expect, AssertionError } = require('chai');
const BoardAPI = require('../../src/api/BoardAPI');
const ShowActiveHandler = require('../../src/commands/ShowActiveHandler')
const sinon = require('sinon');


describe("ShowActiveHandler", () => {

    it("ensures that ShowActiveHandler validates input correctly", () => {
        const instance = new ShowActiveHandler("displayActiveBoard");
        expect(instance.isValid()).to.equal(true)
    })

    it("ensures that function calls inside handle function are correctly executed", async () => {
        const boardGetActiveBoardStub = sinon.stub(BoardAPI, 'getActiveBoard')
        boardGetActiveBoardStub.callThrough();

        const postFake = sinon.fake();

        const instance = new ShowActiveHandler(`displayActiveBoard`)

        await instance.handle({
            client:{
                postMessage: postFake,
            },
            userEmail: 'fake@ncsu.edu',
        })


        assert.isTrue(boardGetActiveBoardStub.calledOnce);
        assert.isTrue(postFake.calledOnce);

        // Reset stub
        boardGetActiveBoardStub.restore();

    });
})
