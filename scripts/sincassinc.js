// Modulo FileSystem
const fs = require('fs')
const mc = require('./meusCallbacks')
// Função que lê o arquivo
function lerarquivo(arq) {
    console.log("Lendo o arquivo")
    return fs.readFile(arq,'utf-8',function (err,data) {
        if(err){
            console.log("Tivemos um erro ao ler o arquivo")
        } else {
            mc.depoisDoArquivo(mc.meuCallback)
        }
    })
}
console.log(mc.minhavariavel)
console.log("Antes da função lerarquivo")
let myFile = lerarquivo("./LICENSE")
console.log("Depois da função lerarquivo")