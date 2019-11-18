module.exports = function GreetingsWebApp(pool) {

    async function greetNameEntered(username, language) {
        let lowerCaseUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

        let gotNumber = /\d.*\d.*/.test(lowerCaseUsername);

        if (lowerCaseUsername === "" || language === undefined) {
            return;
        }

        if (!gotNumber) {
            let distinct_names = await pool.query("SELECT DISTINCT list_name FROM greetings WHERE list_name = $1", [lowerCaseUsername]);
            if (distinct_names.rows.length === 1) {
                await pool.query("UPDATE greetings SET counter_name = counter_name +1 WHERE list_name = $1", [lowerCaseUsername])
            } else {
                await pool.query("INSERT INTO greetings (list_name,counter_name) VALUES ($1,$2);", [lowerCaseUsername, 1])
            }

            if (language === "English") {
                return "Hello " + lowerCaseUsername;
            } else if (language === "IsiXhosa") {
                return "Molo " + lowerCaseUsername;
            } else if (language === "Afrikaans") {
                return "Hallo " + lowerCaseUsername;
            }
        }

    }

    async function getCounter() {
        var counter = await pool.query("SELECT count(*) FROM greetings");

        return counter.rows[0].count;
    }

    async function counterFor(name) {
        var count = await pool.query("SELECT counter_name FROM greetings WHERE list_name = $1", [name]);
        return count.rows[0].counter_name;
    }

    async function getAllNames() {

        var all_names = await pool.query("SELECT list_name FROM greetings");
        return all_names.rows;
    }

    async function reset() {
        var clearData = await pool.query("DELETE FROM greetings");
        return clearData.rows
    }


    return {
        greetNameEntered,
        getAllNames,
        getCounter,
        reset,
        counterFor
    }
}