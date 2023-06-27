let express = require('express');
let app = express();

app.get('/', function(req,res){
    res.send("Primeira rota com express");
});

app.get('/teste', function(req,res){
    res.send("Testando rota com express");
});


app.listen(3000, function(){
    console.log("A aplicação está funcionando na porta 3000!");
})