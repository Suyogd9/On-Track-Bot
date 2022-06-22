const { assert, expect } = require('chai');
const MattermostClient = require('mattermost-client')
const Index = require('../src/index')

describe("Index", () => {
    it("getClientInstance()", () => {
        let host = 'HOST';
        let group = 'GROUP';
        const client = Index.getClientInstance(host, group);

        expect(client).to.be.instanceOf(MattermostClient)
        expect(client).to.have.property('host', host)
        expect(client).to.have.property('group', group)
    })

    describe("getChatMessage()", () => {
        it("Parses the expected text message", () => {
            const chatMessage = 'Test message'
            const msg = {
                data: {
                    post: JSON.stringify({
                        message: chatMessage,
                    })
                }
            }
            const parsedMessage = Index.getChatMessage(msg);
            expect(parsedMessage).to.be.equal(chatMessage)
        })

        context("Malformed message", () => {
            it("no post attribute", () => {
                expect(Index.getChatMessage({
                    data: {},
                })).to.equal('');
            })

            it("checks if no data attribute is present", () => {
                expect(Index.getChatMessage({})).to.equal('');
            })

            it("checks if post doesn't have message attribute", () => {
                expect(Index.getChatMessage({
                    data: {
                        post: JSON.stringify('{}')
                    }
                })).to.equal('')
            })

        })
    })

    describe("getSenderName()", () => {
        it("parses sender name correctly", () => {

            const sender_name = '@user1'
            const msg = {
                data: {
                    sender_name,
                }
            }
            const parsedSenderName = Index.getSenderName(msg);
            expect(parsedSenderName).to.be.equal(sender_name)
        })

    })
})
