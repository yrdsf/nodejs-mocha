var chai = require('chai'),
    expect = chai.expect,
    SqlTest = require('easy-sql-tests');

describe('Set de pruebas', function () {

    var sqlTests;

    var dbConfig = {
        user: "DB_9B3201_dev_admin",
        password: "P4ssw0rd",
        server: "sql5040.site4now.net",
        database: "DB_9B3201_dev"
    };

    var errorCallback = function (error) {
        console.error(error);
    };

    var cleanup = function (done) {
        sqlTests.cleanup(function (error) {
            if (error) {
                errorCallback(error);
            }
            done();
        });
    };

    // Se ejecuta antes de todas las pruebas.
    before(function (done) {
        sqlTests = new SqlTest(dbConfig, {
            //cleanupQuery: 'EXEC [test].[cleaning_test_data]',
            errorCallback: errorCallback
        });

        sqlTests.connectionOpen(function (error) {
            if (error) {
                errorCallback(error);
                return done();
            }

            cleanup(done);
        });
    });

    // Se ejecuta después de todas las pruebas.
    after(function () {
        sqlTests.connectionClose();
    });

    // Se ejecuta después de cada caso de prueba
    afterEach(function (done) {
        cleanup(done);
    });

    it('test #1', function (done) {

        var assertionCallback = function (error, recordsets) {
            if (error) {
                return console.error(error);
            }
            // Retorna al menos un registro en el listado
            expect(recordsets.length).to.not.equal(0);
        };

        var testSteps = [
            {
                storProcName: 'dbo.SelectCategoria',
                args: { },
                assertionCallback: assertionCallback
            },
            {
                storProcName: 'dbo.SelectClienteByFiltro',
                args: {
                    Filtro: '45400037'
                },
                assertionCallback: assertionCallback
            }
        ];

        sqlTests.compileTest(testSteps, done);
    });

    it('test #2', function (done) {

        var assertionCallback = function (error, recordsets) {
            if (error) {
                return console.error(error);
            }
            // Retorna al menos un registro en el listado
            expect(recordsets.length).to.not.equal(0);
            
            var first_record = recordsets[0][0];

            expect(first_record.Color).to.equal("NEGRO");
            expect(first_record.PrecioVenta).to.equal(0);
        };

        var testSteps = [
            {
                storProcName: 'dbo.SelectProductoByModelo',
                args: {
                    Modelo: 'PLATINIUM'
                },
                assertionCallback: assertionCallback
            }
        ];

        sqlTests.compileTest(testSteps, done);
    });

});