const url = require('url')
const nock = require('nock')

function convertEntriesToObject(entries) {
    const queryObject = {};
    for(const [key, value] of entries) {
        queryObject[key] = value;
    }
    return queryObject;
}

function getObjectFromQueryString(queryStr) {
    const queryStringEntries = new URLSearchParams(url.parse(queryStr).query).entries();
    return convertEntriesToObject(queryStringEntries);
}

const BASE_URL = 'https://api.trello.com';
const USER_ID = 'userIdForMockedUser';

function initialize(){
    
    //#region CreateBoard
    nock(BASE_URL)
    .post('/1/boards/')
    .query(queryObj => {
        return [
            'idOrganization' in queryObj,
            'key' in queryObj,
            'token' in queryObj,

            'name' in queryObj,
        ].every(Boolean)
    })
    .reply(200, (uri, requestBody) => {
        const queryObject = getObjectFromQueryString(uri);

        // Mocked ID
        const idBoard = 'abcd0123';

        const boardName = queryObject['name'];

        return {
            url: `https://trello.com/b/${idBoard}/${boardName}`,
        }

    })
    .persist()
    //#endregion

    //#region showActiveBoard
    nock(BASE_URL)
    .get(uri =>{
        return  /^\/1\/boards\/(?<activeBoardId>\w+)$/.test(uri)    
    })
    .query(queryObj => {
        return [
            'key' in queryObj,
            'token' in queryObj,
        ].every(Boolean)
    })
    .reply(200,() => {
        //Mocked ID
        const idBoard = 'abcd0123';

        const boardName = "Project CSC-510/4";

        return {
            url: `https://trello.com/b/${idBoard}/${boardName}`,
            name: boardName,
        }
    })
    .persist()  
    //#endregion
    
    //#region setActiveBoard
    nock(BASE_URL)
    .get(uri =>{
        return  /^\/1\/members\/(?<userID>\w+)\/boards$/.test(uri)    
    })
    .query(queryObj => {
        return [
            'key' in queryObj,
            'token' in queryObj,
        ].every(Boolean)
    })
    .reply(200,() => [
        {
            //Mocked ID
            id: 'abcd123',
            shortLink: 'efgh789'
        },
        {
            id: 'def123',
            shortLink: 'abc135',
        },
    ])
    .persist()  
    //#endregion

    //#region List Tasks

        //#region Members.getMyself
        nock(BASE_URL)
        .get(`/1/members/me`)
        .query(queryObj => [
            'key' in queryObj,
            'token' in queryObj,
            ].every(Boolean)
        )
        .reply(200, () => ({ 
            id: USER_ID,
            // more attributes can be added as needed
        }))
        .persist()
        //#endregion

        //#region BoardAPI.getLists()
        const listData = [ 
            // more attributes can be added as needed
            {
                id: 'l1',
                name: 'To-Do',
            },
            {
                id: 'l2',
                name: 'Doing',
            },
            {
                id: 'l3',
                name: 'Done'
            },
        ];
        const cardData = listData
            .flatMap(list => {
                return Array.from(Array(3)).map((_, i) => {
                    return {
                        id: `abcd${list.id.slice(-1)}${i}`,
                        idList: list.id,
                        name: `Card ${i} from ${list.name}`,
                        // Mark the `USER_ID` as a member of this card
                        // if card index is odd (arbitrary criteria) to have cards
                        // that do and do not have the USER_ID has their member
                        idMembers: 
                            i % 2 == 0
                            ? [ ]
                            : [ USER_ID ]
                    }
                })
            })

        nock(BASE_URL)
        .get(uri => {
            // ignore boardId parameter
            // `/1/boards/${boardId}/lists`
            return /^\/1\/boards\/(?<boardId>\w+)\/lists$/.test(uri)
        })
        .query(queryObj => [
            'key' in queryObj,
            'token' in queryObj,
            ].every(Boolean)
        )
        .reply(200, listData)
        .persist()
        //#endregion

        //#region ListAPI.getCards()
        nock(BASE_URL)
        .get(uri => {
            // /1/lists/${listId}/cards
            // For listId, iterate on listData[].id
            return listData
            .map(list => (new RegExp(`^/1/lists/${list.id}/cards$`)).test(uri))
            .some(Boolean)
        })
        .query(queryObj => [
            'key' in queryObj,
            'token' in queryObj,
            ].every(Boolean)
        )
        .reply(200, (uri) => {
            const listId = uri.match(/\/1\/lists\/(?<lid>\w+)\/cards/).groups['lid'];
            return cardData.filter(card => card.idList === listId);
        })
        .persist()
        //#endregion



    //#endregion
}

module.exports = {
    initialize,
    BASE_URL,
}
