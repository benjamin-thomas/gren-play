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
    console.log(`[APP] DB START`, { requestId, operation });

    switch (operation) {
        case "getUsers":
            handleGetUsers(requestId, (data) => {
                app.ports.gotDbData.send({
                    requestId,
                    users: data
                })
            });
            break;
        default:
            console.error(`[APP] DB END (operation not found)`);
            break;
    }

    console.log(`[APP] DB END (default)`);
});