// gren make ./src/Main3.gren --output=main.js && PORT=4000 node --inspect ./start.js

const main = require("./main.js");
const app = main.Gren.Main3.init({})

// Mock database function to simulate fetching users from a database
const getDbUsers = () => {
    // Return a fixed list of users for simplicity
    return [
        "John Doe",
        "Jane Smith",
        "Robert Johnson",
        "Emily Davis",
        "Michael Brown",
        "Sarah Wilson"
    ];
}

const getDbUsersPromise = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getDbUsers());
        }, 2000);
    });
}



app.ports.getDbUsers.subscribe(({ requestId }) => {
    console.log(`[APP] DB START`, { requestId });

    const mode = "setTimeout";

    if (mode === "sync") {
        (() => {
            const users = getDbUsers();

            const response = {
                requestId,
                users: users
            };

            app.ports.gotDbUsers.send(response);

            console.log(`[APP] DB END (sync)`);
        })();
    } else if (mode === "promise") {
        getDbUsersPromise().then((users) => {
            const response = {
                requestId,
                users: users
            };

            app.ports.gotDbUsers.send(response);

            console.log(`[APP] DB END (promise)`);
        });
    } else if (mode === "setTimeout") {
        setTimeout(() => {
            const users = getDbUsers();

            const response = {
                requestId,
                users: users
            };

            app.ports.gotDbUsers.send(response);

            console.log(`[APP] DB END (setTimeout)`);
        }, 2000);
    }

});