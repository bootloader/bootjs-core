require('dotenv').config();
const config = require('config');

module.exports = {
    get(key){
        let dotkey = key.replace(/\_/g,".").toLowerCase();
        let _KEY = key.replace(/\./g,"_").toUpperCase();
        if(process.env[dotkey] !==undefined ){
            return process.env[dotkey];
        } else if(process.env[_KEY] !==undefined ){
            return process.env[_KEY];
        }
        return config.get(key);
    }
}