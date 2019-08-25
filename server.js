var http = require('http');
var fs = require("fs");
var qs = require('querystring');

var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://localhost:27017/";



http.createServer(function(request, response) {

	if(request.url === "/index"){
		sendFileContent(response, "test.html", "text/html");
		
	}
	else if(request.url === "/realindex"){
		sendFileContent(response, "index.html", "text/html");
	}
	else if(request.url === "/edpw"){
		sendFileContent(response, "editpw.html", "text/html");
	}
	else if(request.url === "/favpage"){
		sendFileContent(response, "loadfav.html", "text/html");
	}
	else if(request.url === "/"){
		console.log("Requested URL is url" +request.url);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}
	
    else if(request.url==="/test"){
              
        if (request.method === "POST") {
            console.log("test");
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log(formData);
          return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            user.id = new Date().getTime()+ '';
            msg = JSON.stringify(user);
            
            info=formData.split("&");  
            var a = [];
			
            for(i=0; i<info.length; i++){
                
                var d=info[i].split("=");
				a[i] = d[1];
                
            }
            
            console.log(a[0]);
            console.log(a[1]);
            
            stringMsg = JSON.parse(msg);
            MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("mydb");

  					var myobj = stringMsg;

  					dbo.collection("customers").insertOne(myobj, function(err, res) {

    				if (err) throw err;

    				console.log("1 document inserted");

    				db.close();

  					});

					});
            
            
           // request.writeHead(200, {
            //  "Content-Type": "application/json",
            //  "Content-Length": msg.length
           // });
            //return request.end("okok");
            response.end("ok");
          });

        });
        
      }
	}
	
//login
else if(request.url==="/login"){
              
        if (request.method === "POST") {
            console.log("test");
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log(formData);
          return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            //user.id = "123456";
			
            msg = JSON.stringify(user);
            
            info=formData.split("&");  
            var a = [];
			
            for(i=0; i<info.length; i++){
                
                var d=info[i].split("=");
				a[i] = d[1];
                
            }
            
            console.log(a[0]);
            console.log(a[1]);
            
            stringMsg = JSON.parse(msg);
            MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("mydb");

  					var myobj = stringMsg;
					var query = { signupid: a[0], signuppw: a[1]}
					console.log(query);
  					//dbo.collection("customers").findOne({}, function(err, result) {
                    //dbo.collection("customers").find(query).toArray(function(err, result) {
					dbo.collection("customers").findOne(query, function(err, result) {
    				if (err) throw err;
    				console.log(result);
    				db.close();
                     
					 
					if (result != null){	
						response.end(result.id);
						
					}
					else
					{
						response.end('');
						
					}
  					});
			});
            
            
           // request.writeHead(200, {
            //  "Content-Type": "application/json",
            //  "Content-Length": msg.length
           // });
            //return request.end("okok");
            //esponse.end("okokss");
          });
        });
         
     
	  
	  
		}else {
        //form = publicPath + "ajaxSignupForm.html";
        sendFileContent(response, "web.html", "text/html");
       
      }
		

              
	}
	
	
//addfav
	else if(request.url==="/favadd"){
                        
        if (request.method === "POST") {
            console.log("test");
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log(formData);
          return request.on('end', function() {
            var user;
            user = qs.parse(formData);
            msg = JSON.stringify(user);
            
            info=formData.split("&");  
            var a = [];
			
            for(i=0; i<info.length; i++){
                
                var d=info[i].split("=");
				a[i] = d[1];
                
            }
            
            console.log(a[0]);
            console.log(a[1]);
            
            stringMsg = JSON.parse(msg);
            MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;

  					var dbo = db.db("mydb");

  					var myobj = stringMsg;
					var query = { login: a[0], password: a[1]}
	

  					dbo.collection("fav001").insertOne(myobj, function(err, res) {
					
    				if (err) throw err;


    				db.close();
				    
                     
					 
  					});
			});
            
            
          });
        });
        }else {
        //form = publicPath + "ajaxSignupForm.html";
		}
      
	}
	
	//loadfav
     else if (request.url === "/loadfav") {

        if (request.method === "POST") {
        formData = '';

        msg = '';
		return request.on('data', function (data) {

		formData += data;

		favinfo = formData.split("&");
		var params = {};
		for(var i = 0; i < favinfo.length; i++){
		var item = favinfo[i].split("=");
		params[item[0]] = item[1];
		}

		return request.on('end', function () {

		MongoClient.connect(dbUrl, function (err, db) {

		if (err)
		throw err;

		var dbo = db.db("mydb");
		var query = {id: params["id"]};


		//dbo.collection("FavList").findOne(query, function(err, result) {
		dbo.collection("fav001").find(query).toArray(function (err, result) {

		//console.log(result);

		if (err)
		throw err;

		db.close();


		if (result != null) {
		var arrayfav = [];
		for (var i = 0; i < result.length; i++) {
		arrayfav.push({a: result[i].a});
		}
		console.log(arrayfav.toString());
		return response.end(JSON.stringify(arrayfav));

		}

		});



		});


		});
		});
		}
		}
	
	//delfav
	else if (request.url === "/deletefav") {
		if (request.method === "POST") {
			formData = '';

			msg = '';
			return request.on('data', function (data) {
				formData += data;

				favinfo = formData.split("&");
				var params = {};
				for(var i = 0; i < favinfo.length; i++){
					var item = favinfo[i].split("=");
					params[item[0]] = item[1];
				}
				
				return request.on('end', function () {

					MongoClient.connect(dbUrl, function (err, db) {

						if (err)
						throw err;

						var dbo = db.db("mydb");
						var query = {id: params["id"], a: params["a"]};


						//dbo.collection("FavList").findOne(query, function(err, result) {
						dbo.collection("fav001").deleteOne(query, function (err, result) {

							//console.log(result);

							if (err)
							throw err;

							db.close();


							return response.end("success");

						});



					});
				});
				
			});
		}
	}
	// change password 
	else if (request.url === "/changepass") {
		if (request.method === "POST") {
			formData = '';

			msg = '';
			return request.on('data', function (data) {
				formData += data;

				favinfo = formData.split("&");
				var params = {};
				for(var i = 0; i < favinfo.length; i++){
					var item = favinfo[i].split("=");
					params[item[0]] = item[1];
				}
				
				return request.on('end', function () {

					MongoClient.connect(dbUrl, function (err, db) {

						if (err)
						throw err;

						var dbo = db.db("mydb");
						var query = {id: params["id"], signuppw: params["ext_pass"]};
						var newvalues = { $set: {signuppw: params["pass"] } };

						//dbo.collection("FavList").findOne(query, function(err, result) {
						dbo.collection("customers").updateOne(query, newvalues, function (err, result) {

							console.log(result.result.nModified);

							if (err)
							throw err;

							db.close();

							if(result.result.nModified > 0){
								return response.end("success");
							}
							else{
								return response.end("fail");
							}
							

						});



					});
				});
				
			});
		}
	}
	
	
	else if(/^\/[a-zA-Z0-9\-/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.js$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.bundle.min.js$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.css$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/-]*.min.css$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.jpg$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "image/jpg");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.jpeg$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "image/jpg");
	}
	else if(/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9-]*.min.css.map$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/map");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.min.js.map$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/map");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.css.map$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/map");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.png$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "image/png");
	}
	else if(/^\/[a-zA-Z0-9\/-/]*.ico$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/ico");
	}
	else if(/^\/[a-zA-Z0-9\/-/?]*.ttf$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/font");
	}
	else if(/^\/[a-zA-Z0-9\/-/?]*.woff$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/woff");
	}
	else if(/^\/[a-zA-Z0-9\/-/?]*.woff2$/.test(request.url.toString())){
				sendFileContent(response, request.url.toString().substring(1), "text/woff2");
			}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
}).listen(9999)

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}