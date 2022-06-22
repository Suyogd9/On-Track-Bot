
const OnTrack = require('./src')
const Mocking = require('./mocks')

if (process.env.NODE_ENV != 'test') {

    OnTrack.initializeBot().catch(console.error)
}

module.exports = OnTrack;