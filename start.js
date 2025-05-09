// gren make ./src/Main3.gren --output=main.js && PORT=4000 node --inspect ./start.js

const main = require("./main.js");
const app = main.Gren.Main3.init({})

// receiving data from gren:
app.ports.toJS.subscribe((data) => {
    console.log(`Got data from Gren: ${data}`);
    app.ports.fromJS.send(`Returning data to Gren: ${data}`);
});

// sending data to gren:
app.ports.fromJS.send("Hello from JS!");