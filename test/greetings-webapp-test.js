const assert = require('assert');
const Greetings = require('../greetings-webapp');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://victor:victor123@localhost:5432/greetings_tests';

const pool = new Pool({
    connectionString
});

describe('The basic database web app', function () {

    beforeEach(async function () {
        await pool.query("delete from greetings;");
    });

    it('should able to greet victor in English', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal("Hello victor", await instance_for_greet.greetNameEntered('victor','English'));
    });

    it('should able to greet andile in IsiXhosa', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal("Molo andile", await instance_for_greet.greetNameEntered('andile','IsiXhosa'));
    });

    it('should able to greet sibusiso in Afrikaans', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal("Hallo sibusiso", await instance_for_greet.greetNameEntered('sibusiso','Afrikaans'));
    });

    it('should return undefined if no name has been entered', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal(undefined, await instance_for_greet.greetNameEntered('','Afrikaans'));
    });

    it('should return undefined if no language has been selected!', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal(undefined, await instance_for_greet.greetNameEntered('andile',''));
    });

    it('should return undefined if no language has been selected!', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal(undefined, await instance_for_greet.greetNameEntered('andile',''));
    });

    it('should return how many times an indivisual has been greeted!', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal("Hello victor", await instance_for_greet.greetNameEntered('victor','English'));
        assert.equal("Hello victor", await instance_for_greet.greetNameEntered('victor','English'));


        assert.equal(2, await instance_for_greet.counterFor('victor'));
    });

    it('should return the number of people in a database', async function () {
        let instance_for_greet = Greetings(pool);
        assert.equal("Hello victor", await instance_for_greet.greetNameEntered('victor','English'));
        assert.equal("Hallo sibusiso", await instance_for_greet.greetNameEntered('sibusiso','Afrikaans'));

        assert.equal(2, await instance_for_greet.getCounter());
    });



    after(function () {
        pool.end();
    })
});