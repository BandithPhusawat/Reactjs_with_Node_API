var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const secret = 'api-services';

app.use(cors())

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'node_db'
  });


app.post('/register', jsonParser ,function (req, res, next) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        connection.execute(
            'INSERT INTO users (email, password, fname, lname) VALUES( ? , ? , ? , ? )',
            [req.body.email, hash, req.body.fname, req.body.lname],
            function(err, results, fields) {
              if(err){
                res.json({status: "error", message: err})
                return
              }
              res.json({status: "ok"})
            }
        );
    });

});

app.post('/login', jsonParser ,function (req, res, next) { 
    connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [req.body.email],
        function(err, users, fields) {
            if(err) { res.json({status: 'error', message: err}); return }
            if(users.lenght == 0 ) { res.json({status: 'error', message: 'no user found'}); return }
            bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
                if(isLogin){
                    var token = jwt.sign({ email: users[0].email }, secret);
                    res.json({ status: 'ok', message: 'login success', token: token});
                }else{ 
                    res.json({ status: 'error', message: 'login fail'});
                }
            });
        }
    );
});


app.post('/authen', jsonParser ,function (req, res, next) { 
    try {
        const token = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(token, secret);
        res.json({status: 'ok', decoded})
        
    } catch (err) {
        res.json({status: 'error', message: err.error});
    }
});


app.post('/products', jsonParser ,function (req, res, next) { 
    connection.execute(
        'SELECT * FROM products WHERE status = 1',
        function(err, products, fields) {
            if(products){
                res.json({ status: 'ok', data: products});
            }else{ 
                res.json({ status: 'error', message: 'fail'});
            }
        }
    );
});

app.put('/products', jsonParser ,function (req, res, next) { 
    connection.execute(
        'INSERT INTO products (name, price, type_no) VALUES (? , ? , ?)',
        [req.headers.name, req.headers.price, req.headers.type_no],
        function(err, products, fields) {
            if(products){
                res.json({ status: 'ok', message: 'create success'});
            }else{ 
                res.json({ status: 'error', message: 'create fail'});
            }
        }
    );
});

app.post('/update_product', jsonParser ,function (req, res, next) { 
    connection.execute(
        'UPDATE products SET name = ? , price = ?, type_no = ? WHERE id = ? ',
        [req.headers.name, req.headers.price, req.headers.type_no, req.headers.id],
        function(err, products, fields) {
            if(products){
                res.json({ status: 'ok', message: 'update success'});
            }else{ 
                res.json({ status: 'error', message: 'update fail'});
            }
        }
    );
});

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})