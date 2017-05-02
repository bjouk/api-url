var express=require('express')
var app=express()
var urlDb = 'mongodb://localhost:27017/linksapi';
var mongo=require('mongodb').MongoClient
function checkUrl(url){
	if(url.split('.')[0]=='www'||url.split('.')[0]=='http'){
		return true
	}
	else{
		return false
	}
}
function editUrl(url){
	if(url.split(':')[0]!='http' || url.split(':')[0]!='https'){
		url='http://'+url
	}
	return url
}
app.get('/new/:url',function(req,res){
	mongo.connect(urlDb, function(err, db) {
	    var collection = db.collection('links')
	    if(checkUrl){
	    	collection.insert({url:editUrl(req.params.url)},function(err,docsInserted){
	    		res.json({url:req.params.url,shortened:'http://localhost:8080/'+docsInserted["ops"][0]["_id"]})
	    	})
			
	    }
	    else{
	    	res.json({error:'Not an url'})
	    }
		
		db.close();
		})
 	})

app.get('/:id',function(req,res){
	mongo.connect(urlDb, function(err, db) {
	    var collection = db.collection('links')
		collection.find({index:parseInt(req.params.id)}).toArray(function(err,results){
			var urlRedirect=results[0]['url']
			res.redirect(urlRedirect)
			res.end();
		})
		db.close();
		})	
})
app.listen(8080);