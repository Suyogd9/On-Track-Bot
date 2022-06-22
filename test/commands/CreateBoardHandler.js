const { assert, expect, AssertionError } = require('chai');
const BoardAPI = require('../../src/api/BoardAPI');
const CreateBoardHandler = require('../../src/commands/CreateBoardHandler')
const sinon = require('sinon');


describe("CreateBoardHandler", () => {

    it("ensures that the CreateBoardHandler validates input correctly", () => {
        const instance = new CreateBoardHandler("CreateBoard myboard");
        expect(instance.isValid()).to.equal(true)
    })

    it("ensures that the CreateBoardHandler rejects incorrect command", () => {
        const instance = new CreateBoardHandler("Create myboard");
        expect(instance.isValid()).to.equal(false)
    })

    it("ensures that parseinput throws an error for incorrect message", () => {
        const instance = new CreateBoardHandler("CreateBoard");
        expect(instance.parseInput.bind(instance)).to.throw("Please pass a valid name for the board")
    })

    it("ensures that parseinput throws an error for invalid board name", () => {
        const instance = new CreateBoardHandler("CreateBoard #Board_");
        expect(instance.parseInput.bind(instance)).to.throw("Please pass a valid name for the board")
    })

    it("ensures that parseinput returns name for valid command entered by user", () => {
        const instance = new CreateBoardHandler("CreateBoard myboard");
        let responsedata = instance.parseInput()
        let retname = responsedata.name
        assert(retname === "myboard")
    })

    it("ensures that function calls inside handle function are correctly executed", async () => {
        const st = sinon.stub(BoardAPI, 'createBoard')
        st.callThrough();

        const name = 'board123'
        const instance = new CreateBoardHandler(`CreateBoard ${name}`)

        await instance.handle({
            client:{
                postMessage: () => void 0,
            },
            userEmail: 'fake@ncsu.edu'
        })


        assert(st.calledOnce)
        const argsForFirstCall = st.getCall(0).args[0];
        expect(argsForFirstCall).to.deep.include({
            boardName: name,
        })

    });
})