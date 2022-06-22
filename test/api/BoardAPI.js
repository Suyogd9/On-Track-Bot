const { assert, expect } = require('chai');
const BoardAPI = require('../../src/api/BoardAPI')

describe("BoardAPI", () => {
    it("createBoard()", async () => {
        const name = 'board1';
        const response = await BoardAPI.createBoard({ key: 'fakekey', token: 'faketoken', boardName: name });

        assert.equal(response.status, 200)
        assert.isTrue(response.data.url.includes(name))
    })
})