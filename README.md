## Hello Ports

Compile and run the program with:

```sh
gren make ./src/Main.gren && node app
gren make ./src/Main2.gren && node app
echo ./src/WebServerMain.gren | entr -rc bash -c 'gren make ./src/WebServerMain.gren && PORT=3000 node app'
```
