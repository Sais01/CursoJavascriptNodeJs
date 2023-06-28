const express = require('express');
const exphbs =require('express-handlebars'); 
const app = express();
const path = require('path'); //consegue entender o nde é o diretório raiz da aplicação
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function(){
    console.log(`O express está rodando na porta ${PORT}`);
});

//body parser
app.use(bodyParser.urlencoded({extended: false}));

// handle bars
app.set('views', path.join(__dirname, 'views')); //onde vão ficar os arquivos html
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'})); //onde vai ficar o nosso arquivo principal de layout
app.set('view engine', 'handlebars'); //biblioteca que será utilizado para renderizar as views 

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db.authenticate()
.then(()=>{
    console.log("Conectou ao banco com sucesso");
})
.catch(err => {
    console.log("ocorreu um erro ao conectar: ", err);
});

// routes
app.get('/', (req, res) => {

    let search = req.query.job;//query = busca através da utl de get, body= busca do html 
    let query = '%'+search+'%'; //pode vir qualquer coisa antes ou depois do que está no search

    if(!search){
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs =>{
            res.render("index", {
                jobs
            });
        })
        .catch(err => console.log(err));
    }else{
        Job.findAll({
        where: {title: {[Op.like]:query}},      
        order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs =>{
            res.render("index", {
                jobs, search
            });
        })
        .catch(err => console.log(err));

    }

    
});

// jobs routes
app.use('/jobs', require('./routes/jobs'));
