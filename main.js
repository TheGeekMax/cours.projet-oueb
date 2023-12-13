const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var showdown  = require('showdown');

function getAllArticleName(){
    
    var files = fs.readdirSync('./articles');
    //remove all extensions
    var files = files.map(function (fileName) {
        return fileName.replace('.md', '');
    });
    return files;
}

function nameToHtmlTag(name){
    let text = fs.readFileSync(__dirname + '/public/articleTemplate.html').toString();
    //on change les tags
    text = text.replace("{{articleLink}}",name);
    text = text.replace("{{articleURL}}","article/"+name);
    text = text.replace("{{articleName}}",name);
    text = text.replace("{{articleImg}}","pictures/"+name+".png");
    return text;
}

function getAllArticleNameHtml(){
    var allName = getAllArticleName();
    var allNameHtml = allName.map(nameToHtmlTag);
    return allNameHtml;
}

function getAllArticleNameAndIdOfH2(htmltext){
    //get all h2
    var regex = /<h2 id=".*">(.*?)<\/h2>/g;
    var matches = [];
    var match;
    while ((match = regex.exec(htmltext)) != null) {
        //2uplet of name and id
        //get id
        var regex2 = /<h2 id="(.*?)">.*<\/h2>/g;
        var match2 = regex2.exec(match[0]);
        matches.push([match[1],match2[1]]);
    }
    return matches;
}

function getAllh3textandIdofH2Id(htmltext,id){
    let lines = htmltext.split("\n")
    let h2regex = new RegExp("<h2 id=\""+id+"\">.*<\/h2>","g")
    let h2qq = new RegExp("<h2 id=\".*\">(.*?)<\/h2>","g")
    let h3test = new RegExp("<h3 id=\"(.*?)\">.*?<\/h3>","g")
    let h3data = new RegExp("<h3 id=\"(.*?)\">(.*?)<\/h3>","g")
    let h3matches = []
    let h2found = false
    //console.log(lines)
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if(h2regex.test(line)){
            h2found = true
            continue
        }
        if(h2found){
            if(h3test.test(line)){
                let data = h3data.exec(line)
                h3matches.push([data[2],data[1]])
                //on reset le regex
                h3data.lastIndex = 0
            }
            if(h2qq.test(line)){
                break
            }
        }
    }
    return h3matches
}

app.use("/pictures",express.static('pictures'))
app.use("/files",express.static('files'));

app.get('/', (req, res) => {
    //index.html is the main page
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/article', (req, res) => {
    //get article.html, and replace "{{articles}}" with all article names
    var articleHtml = fs.readFileSync(__dirname + '/public/article.html').toString();
    var allNameHtml = getAllArticleNameHtml();
    //add <h2> with "tout les articles" at pos 0
    allNameHtml.unshift("<h1>Projet Oueb<sup>2</sup></h1>\n<h2>tout les articles</h2>");

    articleHtml = articleHtml.replace("{{articles}}",allNameHtml.join("\n"));
    articleHtml = articleHtml.replace("{{categories}}","\n");

    //tags
    articleHtml = articleHtml.replace("{{tag-name}}","liste des articles");
    articleHtml = articleHtml.replace("{{tag-article}}","");
    articleHtml = articleHtml.replace("{{tag-img}}","/pictures/pics/logo.png");
    articleHtml = articleHtml.replace("{{tag-desc}}","Liste des articles des cours du projet oueb²");
    articleHtml = articleHtml.replace("{{sous-categories}}","\n");

    res.send(articleHtml);
});

app.get('/article/:name', (req, res) => {
    //get article.html, and replace "{{articles}}" with all article names
    var articleHtml = fs.readFileSync(__dirname + '/public/article.html').toString();

    var converter = new showdown.Converter();
    converter.setOption('tables', true);
    //test if file exist
    if(!fs.existsSync(__dirname + '/articles/'+req.params.name+'.md')){
        //error 404
        res.status(404).send("404 not found");
        return;
    }
    var text = fs.readFileSync(__dirname + '/articles/'+req.params.name+'.md')
    var html = converter.makeHtml(text.toString());

    let data = getAllArticleNameAndIdOfH2(html)

    let strButtons = ""
    data.forEach(element => {
        strButtons += "<a href='#"+element[1]+"'>"+element[0]+"</a>\n"
    });

    articleHtml = articleHtml.replace("{{articles}}",html);
    articleHtml = articleHtml.replace("{{categories}}",strButtons);

    //h3 data
    let h3txt = ""
    data.forEach(element => {
        h3txt += "<div id='"+element[1]+"_sep' class='separateurData'>\n"
        let h3data = getAllh3textandIdofH2Id(html,element[1])
        h3data.forEach(element2 => {
            h3txt += "<a href='#"+element2[1]+"'>"+element2[0]+"</a>\n"
        });
        h3txt += "</div>\n"
    });
    articleHtml = articleHtml.replace("{{sous-categories}}",h3txt);

    //tags
    articleHtml = articleHtml.replace("{{tag-name}}",req.params.name);
    articleHtml = articleHtml.replace("{{tag-article}}",req.params.name);
    articleHtml = articleHtml.replace("{{tag-img}}","/pictures/"+req.params.name+".png");
    articleHtml = articleHtml.replace("{{tag-desc}}","article de "+req.params.name+" du projet oueb²");

    res.send(articleHtml);
});


//process.env.PORT, process.env.IP
app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`app listening on port ${port}`)
})