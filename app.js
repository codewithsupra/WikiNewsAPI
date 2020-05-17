const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
const articleSchema={
	title:String,
	content:String
};
const Article=mongoose.model("Article",articleSchema);

app.get("/articles",(req,res)=>{
	Article.find((err,foundarticles)=>{
		if(!err){

		 res.send(foundarticles)
		}
		else{
			res.send(err);
		}
	})


})

app.post("/articles",(req,res)=>{
	const newArticle=new Article({
		title:req.body.title,
		content:req.body.content
	});
	newArticle.save((err)=>{
		if(!err){
			res.redirect("/articles");
		}

	});

});
app.delete("/articles",(req,res)=>{
	Article.deleteMany((err)=>{
		if(!err){
			res.send("Successfuly deleted all articles");

		}
		else{
			res.send(err);
		}
	});

});
app.route("/articles/:articleTitle")
.get((req,res)=>{

	Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
		if(foundArticle)
		{
			res.send(foundArticle)
		}
		else{
			res.send("no found articles")
		}
	})
});
app.route("/articles/:articleTitle")
.put((req,res)=>{
	Article.update(
		{title:req.params.articleTitle},
		{title:req.body.title,content:req.body.content},
		{overwrite:true},
		(err)=>{
			if(!err){
				res.send("Successfully updated!");

			}
			
		}



		)

})
.patch((req,res)=>{
	Article.update(
		{title:req.params.articleTitle},
		{$set:req.body},
		(err)=>{
			if(!err)
			{
				res.send("Successfully updated article");
			}
			else{
				res.send(err);
			}
		}

		)

})
.delete((req,res)=>{
	Article.deleteOne(
	{
		title:req.params.articleTitle
	},
	(err)=>{
		if(!err){
			res.send("Successfully deleted");
		}
		else{
			res.send(err)
		}
	}


		)
})






app.listen(3000,()=>{
	console.log("Server is running!");
});