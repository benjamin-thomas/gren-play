// gren make ./src/Main3.gren --output=main.js && PORT=4000 node --inspect ./start.js

const main = require("./main.js");
const app = main.Gren.Main3.init({})

// Mock database function to simulate fetching users from a database
function getDbUsers() {
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


app.ports.getDbUsers.subscribe(({ requestId }) => {
    console.log(`[APP] DB START`, { requestId });

    setTimeout(() => {
        const users = getDbUsers();

        const response = {
            requestId,
            users: users
        };

        app.ports.gotDbUsers.send(response);

        console.log(`[APP] DB END`);
    }, 2000);
});