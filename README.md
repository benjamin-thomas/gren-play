## Hello Ports

Compile and run the program with:

```sh
gren make ./src/Main.gren && node app
gren make ./src/Main2.gren && node app
echo ./src/Main3.gren | entr -rc bash -c 'gren make ./src/Main3.gren && PORT=3000 node app'
```
