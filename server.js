// Referencing week 2-4 source codes

const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(express.json());
app.use(express.static('static'));

let rowData = [];

fs.readFile('./data/data.json', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    if (data) {
        rowData = JSON.parse(data);
    }
});

app.post("/list", (req, res) => {
    rowData.push(req.body.text);

    fs.writeFile('./data/data.json', JSON.stringify(rowData), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });
    res.json({list: rowData});
});

app.get("/hello", (req, res) => {
    res.send({msg: "Hello World"});
});

app.get("/echo/:id", (req, res) => {
    res.send({id: `${req.params.id}`});
});

app.post("/sum", (req, res) => {
    const totalSum = req.body.numbers.reduce((sum, number) => sum + number, 0);
    res.send({sum: totalSum});
});

app.listen(port, () => console.log("Server is running on port 3000"));
