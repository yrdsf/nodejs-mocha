const dbInstanceManager = require('./dbObjectManager');

export default class ProductRepository {
    async get() {
        let db = dbInstanceManager.getDb();

        if (!!db) {
            let productoComercial = db.collection('ProductoComercial');
            let productos = await productoComercial.find().toArray();
            return new Promise(resolve => resolve(productos));
        } else { // database is undefined, initialization error
            let mensaje = `error getting ${codigoPais} database`;
            throw new Error(mensaje);
        }
    }
}