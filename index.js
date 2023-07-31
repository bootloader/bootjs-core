require('dotenv').config();
const config = require('config');

module.exports = {
    get(key){
        return process.env[key] || config.get(key)
    }
}