// code to read the database and return the board name with active status
const pg = require('pg')
class UserIdNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserIdNotFoundError';
    }
}


class UserTokenNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserTokenNotFoundError';
    }
}


class UserKeyNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserKeyNotFoundError';
    }
}

module.exports = {

    //Gets the boardID of the active board
    async getActiveBoardId({
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
                'select activeBoardId from bot where userid = $1',
                [ userId ]
            ) //Fetches the boardID from the bot database
            return results.rows[0].activeboardid;

        } catch(e) {

            console.error(e)

        } finally {

            client.end();
        }
    },

    UserIdNotFoundError,
    UserTokenNotFoundError,
    UserKeyNotFoundError,

    async getUserIdFromEmail( email ) {

        // TODO: extract this code to a factory function
        const client = new pg.Client({
            user: process.env.pgsqluser,
            password: process.env.pgsqlpwd,
            host: process.env.pgsqlhost,
            port: process.env.portno,
            database: process.env.pgsqldb
        })

        try {
            await client.connect()                   // creating a connection with the postgresSQL database
            const result = await client.query(
                'select userid from bot where useremail = $1',
                [ email ]
            ) 

            if(result.rows.length === 0) {
                throw new UserIdNotFoundError(`No userId found for email: ${email}`)
            }
            return result.rows[0].userid;
        } catch(e) {
            console.error(e)
            if(e instanceof UserIdNotFoundError) {
                throw e;
            }
        } finally {
            client.end();
        }

    },


    async getUserToken(userEmail) {

        // TODO: extract this code to a factory function
        const client = new pg.Client({
            user: process.env.pgsqluser,
            password: process.env.pgsqlpwd,
            host: process.env.pgsqlhost,
            port: process.env.portno,
            database: process.env.pgsqldb
        })

        try {
            await client.connect()                   // creating a connection with the postgresSQL database
            const result = await client.query(
                'select usertoken from bot where useremail = $1',
                [ userEmail ]
            ) 

            if(result.rows.length === 0) {
                throw new UserTokenNotFoundError(`No userToken found for email: ${userEmail}`)
            }
            return result.rows[0].usertoken;
        } catch(e) {
            console.error(e)
            if(e instanceof UserTokenNotFoundError) {
                throw e;
            }
        } finally {
            client.end();
        }
    },

    async getUserKey(userEmail) {

        // TODO: extract this code to a factory function
        const client = new pg.Client({
            user: process.env.pgsqluser,
            password: process.env.pgsqlpwd,
            host: process.env.pgsqlhost,
            port: process.env.portno,
            database: process.env.pgsqldb
        })

        try {
            await client.connect()                   // creating a connection with the postgresSQL database
            const result = await client.query(
                'select userkey from bot where useremail = $1',
                [ userEmail ]
            ) 

            if(result.rows.length === 0) {
                throw new UserKeyNotFoundError(`No userKey found for email: ${userEmail}`)
            }
            return result.rows[0].userkey;
        } catch(e) {
            console.error(e)
            if(e instanceof UserKeyNotFoundError) {
                throw e;
            }
        } finally {
            client.end();
        }
    }
}
