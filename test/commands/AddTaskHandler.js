const { assert, expect } = require('chai');
const CardAPI = require('../../src/api/CardAPI');
const AddTaskHandler = require('../../src/commands/AddTaskHandler')
const sinon = require('sinon');


describe("AddTaskHandler", () => {

    it("ensures that the AddTaskHandler validates input correctly", () => {
        const instance = new AddTaskHandler("Addtask a");
        expect(instance.isValid()).to.equal(true)
    })

    it("ensures that the AddTaskHandler rejects incorrect command", () => {
        const instance = new AddTaskHandler("addtas a");
        expect(instance.isValid()).to.equal(false)
    })

    describe("parseInput()", () => {
        it("throws an error for incorrect message", () => {
            const instance = new AddTaskHandler("AddTask");
            expect(instance.parseInput.bind(instance)).to.throw("Please pass a valid task name")
        })

        it("returns name for valid command entered by user", () => {
            const taskname = 'abc';
            const instance = new AddTaskHandler(`AddTask ${taskname}`);
            const parsed = instance.parseInput()
            assert.equal(parsed.taskName, taskname);
        })

        it("returns name and description", () => { 
            const taskName = 'Add github issues for feature X'
            const desc = 'Need to add the issues for proper tracking'
            const instance = new AddTaskHandler(`addtask ${taskName} --description ${desc}`)
            const {
                taskName: expTaskName,
                description: expDesc,
            } = instance.parseInput();
            assert.equal(taskName, expTaskName)
            assert.equal(desc, expDesc)
        })


        it("returns name and collaborator usernames", () => { 
            const taskName = 'Add github issues for feature X'
            const collaborators = ['@user1', '@user2', '@user3']
            const instance = new AddTaskHandler(`addtask ${taskName} --collab ${collaborators.join(' ')}`)
            const {
                taskName: expTaskName,
                collabs: expCollab
            } = instance.parseInput();
            assert.equal(taskName, expTaskName)
            assert.deepEqual(collaborators, expCollab)
        })

        it("returns name, description and collaborator usernames", () => { 
            const taskName = 'Add github issues for feature X'
            const desc = 'Need to add the issues for proper tracking'
            const collaborators = ['@user1', '@user2', '@user3']
            const instance = new AddTaskHandler(`addtask ${taskName} --description ${desc} --collab ${collaborators.join(' ')}`)

            const {
                taskName: expTaskName,
                description: expDesc,
                collabs: expCollab
            } = instance.parseInput();
            assert.equal(taskName, expTaskName)
            assert.equal(desc, expDesc)

            assert.deepEqual(collaborators, expCollab)
        })

    })



    it("ensures that function calls inside handle function are correctly executed", async () => {
        const st = sinon.stub(CardAPI, 'createCard')

        st.callsFake(() => {
            const shortId = 'fakeShortId';
            return {
                id: 'fakeCreatedCardId',
                shortUrl: `https://trello.com/c/${shortId}`
            }
        });

        const taskName = 'this is a title'
        const description = 'description of the task';
        const collabs =  '@user1 @user2 @user3';
        const collabEmails = collabs.split(' ').map(uname => {
            return uname.replace(/^@/, '') + '@ncsu.edu';
        });

        const instance = new AddTaskHandler(`addTask ${taskName} --description ${description} --collab ${collabs}`)

        await instance.handle({
            client:{
                postMessage: () => void 0,
            },
            userEmail: 'fake@ncsu.edu',
        })

        assert(st.calledOnce)

        const argsForFirstCall = st.getCall(0).args[0];
        expect(argsForFirstCall).to.deep.include({
            name: taskName,
            desc: description,
            collabEmails,
        })

        st.restore();

    });
})
