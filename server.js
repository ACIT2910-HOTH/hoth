/*jshint esversion: 6 */

module.exports = {
    add: function (a, b) {
        return a + b;
    }
};

// initializations
const pg = require("pg");
const express = require("express");
const path = require("path");
const port = process.env.PORT || 10000;
const bodyParser = require("body-parser");
const session = require("express-session");
const formidable = require('formidable');

const fs = require("fs");

var app = express();
var pF = path.resolve(__dirname, "public");
var imgFolder = path.resolve(__dirname, "images");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
var dbURL = process.env.DATABASE_URL || "postgres://postgres:Element1@localhost:5432/kitchen";


app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret:"this is our kitchen",
    resave:true,
    saveUninitialized:true
}));



// ajax response
app.post("/register", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("INSERT INTO hoth_users (first_name, last_name, password, email, username) VALUES ($1, $2, $3, $4, $5)", [req.body.fname, req.body.lname, req.body.password, req.body.email, req.body.uname], function(err, result) {
            done();
            
            if (err) {
                console.log(err);
            }
            
            resp.redirect("/created");
        });
    });
});

app.post("/login", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("SELECT * FROM hoth_users WHERE email = $1 AND password = $2", [req.body.email, req.body.password], function(err, result) {
            done();
            if (err) {
                console.log(err);
            }
            
            if (result.rows.length > 0) {
                req.session.username = result.rows[0].username;
                req.session.email = result.rows[0].email;
                req.session.loginid = result.rows[0].user_id;
                req.session.pass = result.rows[0].password;
                req.session.auth = result.rows[0].auth_level;
                req.session.fname = result.rows[0].first_name;
                
                resp.redirect("/");
            } else {
                resp.send("Wrong login information");
            }
        });
    });
});

app.post("/appetizers", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("SELECT * FROM hoth_items WHERE category = 'a'", function(err, result) {
            done();
            
            resp.send(result.rows);
        });
    });
});

app.post("/drinks", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("SELECT * FROM hoth_items WHERE category = 'b'", function(err, result) {
            done();
            
            resp.send(result.rows);
        });
    });
});

app.post("/desserts", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("SELECT * FROM hoth_items WHERE category = 'd'", function(err, result) {
            done();
            
            resp.send(result.rows);
        });
    });
});

app.post("/meals", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("SELECT * FROM hoth_items WHERE category = 'm'", function(err, result) {
            done();
            
            resp.send(result.rows);
        });
    });
});

app.post("/user-cp", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        if (req.session.auth == "C") {
            client.query("SELECT * FROM hoth_users WHERE auth_level = 'C'", function(err, result) {
                done();

                var obj = {
                    status:"customer",
                    result:result.rows
                };

                resp.send(obj);
            });
        } 
    });
});




app.post("/changeEmail", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("UPDATE hoth_users SET email = $1 WHERE user_id = $2", [req.body.email, req.session.loginid], function(err, result) {
            done();
            
            resp.send("Email has been changed");
            resp.end();
        });
    });
});

app.post("/changePassword", function(req, resp) {
    pg.connect(dbURL, function(err, client, done) {
        client.query("UPDATE hoth_users SET password = $1 WHERE user_id = $2", [req.body.password, req.session.loginid], function(err, result) {
            done();
            
            resp.send("Password has been changed");
            resp.end();
        });
    });
});

//---------------------------Order page --------------------//
var orders = []
app.post("/orders",function(req,resp){
    while(orders.length > 0){
        orders.pop();
    }
    orders.push(req.body.orders)
    console.log(orders)
    resp.send({status:"success"})
    
});

app.post("/get/orders",function(req,resp){
    resp.send({
        status:"success",
        orders:orders,
        username: req.session.username,
        fname:req.session.fname,
        email:req.session.email
    })
}); 

app.post("/get/price",function(req,resp){
    console.log(req.body);
    pg.connect(dbURL,function(err,client,done){
        if(err){
            console.log(err);
            resp.send({
                status:"fail"
            });
        }
        client.query("SELECT item_name,price FROM hoth_items WHERE item_code = $1",[req.body.item],function(err,result){
            done();
            
            if(err){
                console.log(err);
                resp.sent({
                    status:"faile",
                });
            }
            resp.send({
                status:"success",
                price:result.rows[0].price,
                name:result.rows[0].item_name
            });
        });
    });
         });

app.post("/save/order",function(req,resp){
    console.log(req.body)
    pg.connect(dbURL,function(err,client,done){
        if(err){
            console.log(err);
            resp.send({
                status:"fail",
                message:"database connection err"});
        }
        client.query("INSERT INTO hoth_orders (customer,total_price) VALUES ($1,$2) RETURNING order_id",[req.session.username,req.body.totalPrice],function(err,result){
            done();
            if(err){
                console.log(err);
                resp.sent({
                    status:"faile"
                });
            } else {
                resp.send({
                    status:"success",
                    id:result.rows[0].order_id
                });
            }
            
            
        });
    });
});

app.post("/order/detailes",function(req,resp){
    console.log(req.body)
        pg.connect(dbURL,function(err,client,done){
        if(err){
            console.log(err);
            resp.send({
                status:"fail"
            });
        }
        client.query("INSERT INTO hoth_order_details (item_name,quantity,order_id) VALUES ($1,$2,$3)",[req.body.name,req.body.quantity,req.body.id],function(err,result){
            done();
            
            if(err){
                console.log(err);
                resp.sent({
                    status:"fail"
                });
            }
            resp.send({
                status:"success"
            });
        });
    });
    
});

// -----------------------Order page end ------------------//
// -----------------------Admin operation---------------//
app.post("/change/price",function(req,resp){
    pg.connect(dbURL,function(err,client,done){
        if(err){
            console.log(err)
        }
        client.query("UPDATE hoth_items SET price = $1 WHERE item_code = $2",[req.body.price,req.body.item],function(err,result){
            done();
            console.log(result)
            if(err){
                console.log(err);
            }else {
                resp.send({status:"success"})

            }
        });
    });
});

app.post("/adminItems", function(req,resp){
	console.log(req.body);
    pg.connect(dbURL,function(err,client,done){
        if(err){
            console.log(err)
        }
        client.query("INSERT INTO hoth_items (item_code,category,description,item_name,filename,price) VALUES($1,$2,$3,$4,$5,$6)",[req.body.itemCode,req.body.category,req.body.desc,req.body.name,req.body.fileName,req.body.price],function(err,result){
            done();
            console.log(result)
            if(err){
                console.log(err);
            }else {
                resp.send({
                    status:"success",
                    name: req.body.name,
                    item_code:req.body.itemCode,
                    filename:req.body.fileName,
                    desc:req.body.desc,
                    price:req.body.price
                });

            }
        });
    });
});

var imageName;
app.post("/filename",function(req,resp){
    imageName = req.body.fileName
})

app.post('/upload', function(req, resp){
    
    console.log(imageName)
  var form = new formidable.IncomingForm();
 
  form.multiples = true;

  form.uploadDir = path.join(__dirname, '/images');

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, imageName));
  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.on('end', function() {
    resp.end('success');
  });

  form.parse(req);

});



//------------------------Admin operation end-----------//

app.use("/scripts", express.static("build"));

app.use("/js",express.static("js"))

app.use("/images", express.static("images"));

app.use("/css", express.static("css"));

app.use("/public", express.static("public"));


app.get("/", function(req, resp) {
    if(req.session.username == undefined){
        req.session.username = 'guest'
    }
    if (req.session.auth == "A") {
        resp.sendFile(pF + "/admin.html");
    } else if (req.session.auth == "E") {
        resp.sendFile(pF + "/kitchen.html");
    } else {
        resp.sendFile(pF + "/main.html");
    }
});

app.get("/profile", function(req, resp) {
    if(req.session.auth == "C") {
        resp.sendFile(pF + "/profile.html");
    } else {
        resp.sendFile(pF + "/main.html");
    }
});

app.get("/created", function(req, resp) {
    resp.sendFile(pF + "/created.html");
});

app.get("/signin", function(req, resp) {
    resp.sendFile(pF + "/login.html");
});

app.get("/logout", function(req, resp) {
    req.session.destroy();
    resp.redirect("/");
});


app.get("/user_profile", function(req, resp) {
    if (req.session.auth == "C") {
        resp.sendFile(pF + "/profile.html");
    } else if (req.session.auth == "A"){
		resp.sendFile(pF + "/admin.html");
	} else {
        resp.sendFile("/");
    }
});

app.get("/checkout", function(req, resp) {
    resp.sendFile(pF + "/orders.html");
});

app.get("/backdoor",function(req,resp){
    resp.sendFile(pF+"/admin.html")
})


//socket
io.on("connection", function(socket) {
    //socket.on("join room", function(room) {
    //    socket.room = room;
    //    socket.join = socket.room;
    //    
    //    console.log(socket.room);
    //});
    
    socket.join("connected");
    
    console.log("you are in room connected");
    
    socket.on("send message", function(orders) {
        console.log("order submitted")
        io.to("connected").emit("create message", orders);
    });
});

// server
server.listen(port, function(err) {
    if (err) {
        console.log("Error: " + err);
        return false;
    }
    
    console.log("Server is running on " + port);
});
