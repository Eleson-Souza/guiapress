const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');
const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');
const formatDate = require('./public/utils/formatDate');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/usersController');

// View engine
app.set('view engine', 'ejs');

// Configurando as Sessions

//Storage padrão do express-session: memória ram - Pode ocasionar problemas em sistemas de grande porte.
// Redis: Banco para salvamento de sessões (mais indicado). 

app.use(session({
    secret: "password-secret", cookie: {maxAge: 3600000} // sessão expira em 1 hora
}));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Static
app.use(express.static('public'));

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão realizada com sucesso!');
    }).catch((error) => {
        console.log('Erro ao se conectar: ' + error);
    });

// Configurando as rotas de arquivos externos
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

/* app.get('/session', (req, res) => {
    req.session.treinamento = 'Formação NodeJS';
    req.session.ano = 2020;
    req.session.email = 'elesonsouza@hotmail.com';
    req.session.user = {
        username: "elesonsouza",
        email: 'eleson@mail.com',
        id: 1
    }
    res.send('Sessão gerada!');
});

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    });
}); */

app.get('/', (req, res) => {

    Article.findAll({
        order: [
            ['id', 'desc']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories });
        });
    });
    
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article) {
            Category.findAll().then(categories => {
                var dateFormat = formatDate.formatDateAndTime(article);
                res.render('article', { 
                    article: article,
                    categories: categories,
                    dateFormat: dateFormat
                });
            });
        } else {
            res.redirect('/');
        }        
    }).catch(error => {
        console.log(error);
        res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category) {

            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });

        } else {
            res.redirect('/');
        }
    }).catch(error => {
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('O servidor está rodando na porta 3000!');
});