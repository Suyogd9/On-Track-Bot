const { assert, expect } = require('chai');
const AbstractHandler = require('../src/AbstractHandler')

describe("AbstractHandler", () => {

    it("ensures that the AbstractHandler constructor sets inputString correctly", () => {
        const instance = new AbstractHandler("Hello");
        expect(instance.inputString).to.equal("Hello")
    })

    it("ensures that isValid() throws an exception with the message 'Not Implemented'", () => {
        const instance = new AbstractHandler();
        expect(instance.isValid.bind(instance)).to.throw("Not Implemented")
    })

    it("ensures that handle() throws an exception with the message 'Not Implemented'", () => {
        const instance = new AbstractHandler();
        expect(instance.handle.bind(instance)).to.throw("Not Implemented")
    })

})

