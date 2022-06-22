const { assert, expect } = require('chai');
const common= require('../../src/api/common')

describe("api/common", () => {
    it("getAxiosInstance()", () => {
        const instance = common.getAxiosInstance();
        assert.equal(instance.defaults.baseURL, 'https://api.trello.com')
    });

    it('getConfig()', () => {
        const config = common.getConfig();
        assert.equal(config.workspace, process.env.TRELLOWORKSPACE)
    })
})