// gren make ./src/WebServerMain.gren --output=main.js && PORT=4000 node --inspect ./start.js

const main = require("./main.js");
const app = main.Gren.WebServerMain.init({})

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

const handleGetUsers = (requestId, cb) => {
    const mode = "setTimeout";

    if (mode === "sync") {
        (() => {
            cb(getDbUsers());
            console.log(`[APP] DB END (sync)`);
        })();
    } else if (mode === "promise") {
        getDbUsersPromise().then((users) => {
            cb(users);
            console.log(`[APP] DB END (promise)`);
        });
    } else if (mode === "setTimeout") {
        setTimeout(() => {
            cb(getDbUsers());
            console.log(`[APP] DB END (setTimeout)`);
        }, 2000);
    }
}

app.ports.getDbData.subscribe(({ requestId, operation }) => {
    console.log(`[APP] GET DB DATA`, { requestId, operation });

    switch (operation.kind) {
        case "getUsers": {
            handleGetUsers(requestId, (data) => {
                app.ports.gotDbData.send({
                    requestId,
                    users: data
                })
            });
            return;
        }
        case "getUser": {
            setTimeout(() => {
                const userId = operation.userId;
                const users = getDbUsers();
                const index = userId - 1;

                // This can fail at runtime. Since we don't have error handling yet,
                // the request won't terminate, but timeout.
                const user = users[index];
                console.log(`[APP] GOT DB DATA (getUser)`, { userId, user });
                app.ports.gotDbData.send({
                    requestId,
                    user: user
                });
            }, 1000);
            return;
        }
    }
    console.error(`[APP] GOT DB DATA (operation not found)`, operation);
});