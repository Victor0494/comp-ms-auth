const express = require('express')
const app = express()
const port = 3000

app.get('/',function(req,res) {
    res.send('Hello World!')
})

app.get('/outracoisa',function(req,res) {
    res.send('Outra Coisa')
})

app.listen(port,function () {
    console.log("Rodando na porta:",port)
})