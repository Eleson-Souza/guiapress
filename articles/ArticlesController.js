const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}], // Inclui model category à consulta (join).
    }).then(articles => {
        res.render('admin/articles/index', { articles, articles });
    });
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', { categories: categories });
    });
});

router.post('/articles/save', adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var idCategoria = req.body.category;
    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: idCategoria
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/delete', adminAuth, (req, res) => {
    var id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            });

        } else { // NÃO FOR UM NÚMERO
            res.redirect('/admin/articles');
        }
    } else { // NULL
        res.redirect('/admin/articles');
    }
});

router.get('/admin/article/edit/:id', adminAuth, (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { 
                    article: article, 
                    categories: categories
                });
            });
        }
    }).catch(error => {
        res.redirect('/');
    })
});

router.post('/admin/article/update', adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(error => {
        res.redirect('/');
    });
});

// Rota de Paginação
router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset = 0;

    /* 
    1 = 0   |   6 = 20  
    2 = 4   |   7 = 24
    3 = 8   |   8 = 28
    4 = 12  |   9 = 32 =>  9 * 4 - 4 = 32
    5 = 16  |  10 = 36 => 10 * 4 - 4 = 36
    */
    // Offset será a página atual vezes 4 (quant. de registros por página) menos 4.
    offset = (parseInt(page) * 4) - 4;

    Article.findAndCountAll({
        limit: 4, // limite de linhas retornadas (as 4 primeiras)
        offset: offset, // Representa a partir de que número de tupla irá iniciar a exibição.
        order: [
            ['id', 'desc']
        ]
    }).then(articles => {

        var next;
        if(offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            offset: offset,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/pages', { result: result, categories: categories });
            //res.json(result);
        });
    });
});

module.exports = router;