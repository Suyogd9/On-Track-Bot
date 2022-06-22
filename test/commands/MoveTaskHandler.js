const { assert, expect } = require('chai');
const CardAPI = require('../../src/api/CardAPI');
const MoveTaskHandler = require('../../src/commands/MoveTaskHandler')
const sinon = require('sinon');
const nock = require('nock')
const mocks = require('../../mocks/index')

describe("MoveTaskHandler", () => {

    it("ensures that the MoveTaskHandler validates input correctly", () => {
        const instance = new MoveTaskHandler("MoveTask inprogress 623e1afb3c13c341b48a1c52");
        expect(instance.isValid()).to.equal(true)
    })

    it("ensures that the MoveTaskHandler rejects incorrect command", () => {
        const instance = new MoveTaskHandler("move inprogress 623e1afb3c13c341b48a1c52");
        expect(instance.isValid()).to.equal(false)
    })

    describe("parseInput()", () => {
        it("throws an error for incorrect message", () => {
            const instance = new MoveTaskHandler("MoveTask");
            expect(instance.parseInput.bind(instance)).to.throw("Please pass a valid destination list and task card ID");
        })

    })

    it("ensures that function calls inside handle function are correctly executed", async () => {
        const st = sinon.stub(CardAPI, 'moveCard')

        //#region MoveTask
        nock(mocks.BASE_URL)
        .put(uri =>{
            return  /^\/1\/cards\/(\w+)$/.test(uri)
        })
        .query(queryObj => {
            return [
                'idList' in queryObj,
                'key' in queryObj,
                'token' in queryObj,
            ].every(Boolean)
        })
        .reply(200, (uri, requestBody) => {
        })
        //#endregion


        st.callThrough();

        const toListName = 'inprogress'
        const taskid = 'abcd11';
        
        const instance = new MoveTaskHandler(`MoveTask ${toListName} ${taskid}`)

        await instance.handle({
            client:{
                postMessage: () => void 0,
            },
            userEmail: 'fake@ncsu.edu',
        })

        assert(st.calledOnce)
        const argsForFirstCall = st.getCall(0).args[0];
        expect(argsForFirstCall).to.deep.include({
            cardID: taskid,
        })

        st.restore();

    });

})
