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
const fs = require("fs");

var app = express();
var pF = path.resolve(__dirname, "public");
var imgFolder = path.resolve(__dirname, "images");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
var dbURL = process.env.DATABASE_URL || "postgres://postgres:58nihcregor@localhost:5432/kitchen";

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

app.post("/adminItems", function(req,resp){
	console.log(req.body);
	if(req.body.type == "create"){
		resp.send({
			status:"success",
			name: req.body.name,
			img:req.body.img,
			desc:req.body.desc,
			price:req.body.price		
		});
	}

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

app.use("/scripts", express.static("build"));

app.use("/images", express.static("images"));

app.use("/css", express.static("css"));

app.use("/public", express.static("public"));

app.get("/", function(req, resp) {
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
