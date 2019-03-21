import yenv from "yenv";

const mongoClient = require('mongodb').MongoClient;
const env = yenv();


class DbObjectManager {
    constructor() {
        if (!DbObjectManager.instance) {
            this._db = new Object();
            DbObjectManager.instance = this;
        }

        return DbObjectManager.instance;
    }

    getDb() {
        return this._db[0];
    }

    setDb(db) {
        this._db = db;
    }

    getDbAsync() {
        return new Promise((resolve, reject) => {

            if (Object.keys(this._db).length) {
                resolve(this._db[0]);
            } else {
                console.log(env.connectionString);
                console.log(env.database);

                mongoClient.connect(env.connectionString, { useNewUrlParser: true })
                    .then(client => {
                        console.log(`Connected correctly to database server`);

                        this._db[0] = client.db(env.database);
                        resolve(this._db[0]);
                    }, (response) => {
                        console.log(`Could not establish connection with database server`);
                        reject(response);
                    })
                    .catch(err => {
                        console.error(err);
                        reject(err);
                    });
            }
        });
    }

    fetchAllDbs() {
        let dbPromisesArr = [];
        dbPromisesArr.push(this.getDbAsync());

        return Promise.all(dbPromisesArr);
    }

}

const instance = new DbObjectManager();
Object.freeze(instance);

module.exports = instance;