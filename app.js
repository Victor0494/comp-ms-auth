const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const pkg = require('./package.json')
const user = {"uuid":1,
              "login":"didone",
              "pass":"C0nnect"}

app.get('/',function(req,res) {
    res.send('Hello World!')
})

function decodAuth(authorization) {
    return new Buffer(authorization.split(' ')[1], 'base64').toString().split(':')
}

app.get('/api/auth',function (req,res) {
    let username
    let password
    if(req.headers.authorization){
        let decoded = decodAuth(req.headers.authorization)
        username = decoded[0]
        password = decoded[1]
    
    }
    if(username==user.login && password==user.pass){
        res.status(200).json({uuid:user.uuid,
                             login:username})
    } else {
        res.set('WWW-Authenticate', 'Basic realm="401"')
        res.status(401).send("Sucesso! A autenticação funciona")
    }
})

app.get('/api/versao',function (req, res) {
    res.status(200).send("Versão: "+pkg.version)
})

app.listen(port,function () {
    console.log("Rodando na porta:",port)
})