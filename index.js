require('dotenv').config();
const config = require('config');
var prompt = require('prompt');
const fs = require('fs')

let LOCAL_STORE = {};

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
    },
    has(key){
        let dotkey = key.replace(/\_/g,".").toLowerCase();
        let _KEY = key.replace(/\./g,"_").toUpperCase();
        if(process.env[dotkey] !==undefined ){
            return true;
        } else if(process.env[_KEY] !==undefined ){
            return true;
        }
        return config.has(key);
    },
    getIfPresent(key,key2){
        if(this.has(key)){
            return this.get(key);
        } else if(key2){
            return this.get(key2);
        }
    },
    store(name){
        LOCAL_STORE[name] = LOCAL_STORE[name] || {};
        return LOCAL_STORE[name];
    },
    async manifest({ group,props}){
        return new Promise((resolve,reject)=>{
            let _props = {};
            let _values = {};
            props.map((key)=>{
                let _KEY = key.replace(/\./g,"_").toUpperCase();
                let value = this.getIfPresent(key);
                if(value == null || value === ''){
                    _props[_KEY] = { key,_KEY};
                    return _props[_KEY];
                } else {
                    _values[key] = value;
                }
            });
            if(Object.keys(_props).length){
                prompt.start();
                prompt.get(Object.keys(_props), function (err, result){
                    let writer = fs.createWriteStream("./config/local.properties",{
                        flags : 'as'
                    });
                    writer.write(`\n####### ${group || new Date().toDateString()} ##############`);
                    let values = {};
                    for(let _KEY in _props){
                        let key = _props[_KEY].key;
                        let value = result[_props[_KEY]._KEY];
                        if(value === undefined){
                            value = ' ?????????'
                        }
                        writer.write(`\n${key}=${value}`);
                        values[key] = value;
                    }
                    writer.end();
                    resolve({values : values})
                }); 
            } else {
                resolve({values : _values})
            }

        });
    }
}