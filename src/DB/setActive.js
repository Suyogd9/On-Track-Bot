// code to read the database and return the board name with active status
const pg = require('pg')
class UserIdNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserIdNotFoundError';
    }
}

module.exports = {

    //sets the active board for the current userId
    async setActiveBoardId({
        activeBoardId,
        userId
    }){
        const client = new pg.Client({
            user: process.env.pgsqluser,
            password: process.env.pgsqlpwd,
            host: process.env.pgsqlhost,
            port: process.env.portno,
            database: process.env.pgsqldb
        })
        try {
            await client.connect()                   // creating a connection with the postgresSQL database
            const results = await client.query(
                'update bot set activeboardid = $1 where userid = $2',
                [activeBoardId,userId ]
            ) 

        } catch(e) {

            console.error(e)

        } finally {

            client.end();
        }
    }
}