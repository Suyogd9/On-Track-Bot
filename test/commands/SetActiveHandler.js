const { assert, expect, AssertionError } = require('chai');
const setActive = require('../../src/DB/setActive');
const SetActiveHandler = require('../../src/commands/SetActiveBoardHandler')
const sinon = require('sinon');


describe("SetActiveHandler", () => {

    it("ensures that SetActiveHandler validates input correctly", () => {
        const instance = new SetActiveHandler("setActive");
        expect(instance.isValid()).to.equal(true)
    })

    it("ensures that function calls inside handle function are correctly executed", async () => {
        const setActiveStub = sinon.stub(setActive, 'setActiveBoardId')
        setActiveStub.callThrough();

        const postFake = sinon.fake();
        const boardId = 'def123';
        const shortBoardID = "abc135"
        const instance = new SetActiveHandler(`setActive ${shortBoardID}`)

        await instance.handle({
            client:{
                postMessage: postFake,
            },
            userEmail: 'fake@ncsu.edu',
        })

        assert.isTrue(setActiveStub.calledOnce);
        assert.isTrue(postFake.calledOnce);
        const argsForFirstCall = setActiveStub.getCall(0).args[0];
        expect(argsForFirstCall).to.deep.contain({
           activeBoardId: boardId,
        })

        // Reset stub
        setActiveStub.restore();

    });
})
