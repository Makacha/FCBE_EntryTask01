const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express();
const port = 8888
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
app.get('/', (req, res) => {
    res.send('<form action="/timestamp" method="GET" target = "_blank">'+
    '<input type="submit" value="Get timestamp"><br>'+
    '</form>'+
    '<form action="/logs" method="POST">'+
    'Log information:<br>'+
    'level:<input type="text" name="level"><br>'+
    'message:<input type="text" name="message"><br>'+
    '<input type="submit" value="Save log">'+
    '</form><br>'+
    '<form action="/logs" method="GET" target = "_blank">'+
    'Get <input type="number" name="limit"> latest log<br>'+
    '</form>')
})
app.get('/timestamp', (req, res) => {
    res.json({
        "timestamp":Math.floor(Date.now() / 1000)
    })
    res.end()
})
app.get('/logs', (req, res) => {
    var n = req.query.limit
    if (n != null && fs.existsSync('./logs')) {
        fs.readFile('./logs/logs.log', "utf8", (err, data) => {
            if (err)
                return console.log(err)
            var listobj = data.split('\n')
            listobj.pop()
            const listlog = []
            listobj.forEach(element => listlog.push(JSON.parse(element)))
            const reslistlog = []
            for (var i = listlog.length - 1; i >= 0 && n > 0; i--, n--)
                reslistlog.push(listlog[i])
            res.json({"listlog":reslistlog})
        })
    }
    else
        res.redirect('/')
})
app.post('/logs', urlencodedParser, (req, res) => {
    const logger = {"timestamp": Math.floor(Date.now() / 1000),
                    "level": req.body.level,
                    "message": req.body.message
                    }
    const data = JSON.stringify(logger) + '\n'
    if (fs.existsSync('./logs') == false) {
        fs.mkdir('./logs', (err) => {
            if (err)
                return console.log(err);
        });
    }
    fs.appendFile('./logs/logs.log', data, (err) => {
        if(err) 
            return console.log(err)
        console.log("The log was saved!")
    })
    res.send('<script>alert("The log was been saved")</script>')
})

app.listen(port, (err) => {
    console.log(`App listening on url: http://localhost:${port}`)
}) 