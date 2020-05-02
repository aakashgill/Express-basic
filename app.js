const fs = require('fs');
const express = require('express');

let saiyanData = fs.readFileSync('saiyans.json');
const saiyans = JSON.parse(saiyanData);

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})
app.use(express.json());
app.use(express.static('website'));

app.get('/all', (req, res) => {
    res.send(saiyans);
})

app.post('/add', (req, res) => {
    let values = req.body;
    Object.keys(values).map(item => {
        if(item == '') {
            res.send({
                status: "Failure",
                message: "Empty values"
            });
        }
        else {
            saiyans[item] = values[item]
            writeInJSON('Saiyan Added', res);
        }
    })
})

app.delete('/delete/:name', (req, res) => {
    if(saiyans[req.params.name]) {
        delete saiyans[req.params.name];
        writeInJSON(req.params.name + ' Deleted', res);
    }
    else {
        res.send({
            status: "Fail",
            message: "Not found"
        })
    }
})


app.get('/search/:name', (req, res) => {

    let name = req.params.name;    
    let result = {};

    if(saiyans[name]) {
        result = {
            status: "found",
            word: name,
            power: saiyans[name]
        }
    }
    else {
        result = {
            status: "not found",
            word: name
        }
    }
    res.send(result)
})

// 404 error handling
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

function writeInJSON(message, res) {
    let strData = JSON.stringify(saiyans, null, 2);

    fs.writeFile('saiyans.json', strData, (err) => {
        reply = {
            status: "Success",
            message: message
        }
        res.send(reply);
    });
}
