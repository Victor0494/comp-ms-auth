const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
// Informações da package do projeto
const pkg = require('./package.json')
// Variáveis de ambiente
const port = process.env.PORT || 3000
const secret = process.env.SECRET
// Usuário temporário, isso virá do banco no futuro
const user = {"uuid":1,
              "login":"didone",
              "pass":"C0nnect"}
// Lugar para onde o usuário deverá ir para se autenticar
const redirectPath="/api/auth"
// Função de decodificação do login e senha
function decodAuth(authorization) {
    if(authorization===undefined) return [undefined,undefined]
    return new Buffer(authorization.split(' ')[1], 'base64').toString().split(':')
}
// Rotas
// Rota da raiz, mostra o nome do projeto
app.get('/',function(req,res) {
    res.send(pkg.name)
})
// Rota da versão da API
app.get('/api/version',function (req, res) {
    res.status(200).send("Versão: "+pkg.version)
})
// Rota de autenticação e geração do token
app.get('/api/auth',function (req,res) {
    // Decodifica o valor de authorization, passado no header da requisição
    let [username, password] = decodAuth(req.headers.authorization)
    // Compara os valores de usuário e senha enviados com o objeto em memória
    if(username==user.login && password==user.pass){
        // Se o login e senha estiverem corretos gera o token com um tempo de vida de 1 hora
        let token = jwt.sign({uuid:user.uuid,
                             login:username}, secret,
                             { expiresIn: 60*60 });
        // Responde com o status de logado como verdadeiro e o token gerado
        res.status(200).json({loged:true,
                                jwt:token})
    } else {
        // Se não o login e senha não estiverem corretos seta o cabeçalho da resposta exigindo autenticação
        res.set('WWW-Authenticate', 'Basic realm="401"')
        // devolve o status de loged como falso
        res.status(401).json({loged:false,redirect:redirectPath})
    }
})
// Rota que verifica o token
app.post('/api/verify',function(req,res) {
    // Recebe o token JWT pelo cabeçalho na chave autorization
    let token = req.headers.authorization
    // Caso o token tenha valor
    if(token){
        // remove a string "bearer"
        token = req.headers.authorization.split(' ')[1]
        // Usa a lib jwt para verificar a autenticidade do token
        jwt.verify(token, secret, function(err, decoded) {
            // Em caso de erro
            if(err){
                // Responde que o usuário não está logado e informa o path para onde ele deve ir para se autenticar
                res.status(401).json({loged:false,redirect:redirectPath})
            } else{
                // Caso não haja problemas é porque o token é válido
                // Adiciona o valor "loged" como verdadeiro
                decoded.loged = true
                // devolve o payload do token para o requisitante
                res.status(200).json(decoded)
            }
        })
    // Caso não venha nada no header autorization
    } else {
        // Exige a autenticação do usuário
        res.set('WWW-Authenticate', 'Bearer realm="401"')
        // Envia o status de loged como falso e o endereço onde ele se autentica
        res.status(401).json({loged:false,redirect:redirectPath})
    }
})
// Start do servidor na porta
app.listen(port,function () {
    console.log("Rodando na porta:",port)
})