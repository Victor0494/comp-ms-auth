function func1(meuCallback) {
    console.log("Depois da leitura do arquivo")
    meuCallback()
}

function func2() {
    return "Meu Callback"
}

exports = {
    minhavariavel: 10,
    depoisDoArquivo: func1,
    meuCallback: func2
}