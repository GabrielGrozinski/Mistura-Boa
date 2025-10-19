import Imagem from "../models/imagemModelo.mjs";

export async function EnviarImagem(req, res, next) {
    try {
        const {id, tipo, contentType, image} = req.body;
        if (!id || !tipo || !contentType || !image) {
            const err = new Error("Campos obrigatórios ausentes");
            err.status = 404;
            return next(err);
        };
        const data = Buffer.from(image, 'base64');
        const imagemDuplicada = await Imagem.findOne({data});
        if (imagemDuplicada) {
            const err = new Error("Imagem já existe");
            err.status = 409;
            return next(err);
        };
        const novaImagem = new Imagem({
            id, tipo, data, contentType
        });
        await novaImagem.save();
        res.status(200).json(novaImagem);

    } catch (erro) {
        next(erro);
    };
};

export async function ReceberImagemEscolhida(req, res, next) {
    try {
        const {id, tipo} = req.query;
        if (!id || !tipo) {
            const err = new Error("Id e Tipo são obrigatórios");
            err.status = 404;
            return next(err);
        };

        const imagemEscolhida = await Imagem.findOne({id: Number(id), tipo});
        
        if (!imagemEscolhida) {
            const err = new Error("Sem imagem");
            err.status = 404;
            return next(err);
        };

        res.contentType(imagemEscolhida.contentType);
        const imageUrl = `data:${imagemEscolhida.contentType};base64,${imagemEscolhida.data.toString("base64")}`;
        return res.json({ imageUrl });

    } catch (erro) {
        next(erro);
    };
};

{/* 
    
    Funções de backend em Node.js/Express para manipulação de imagens usando Mongoose/ODM: inclui EnviarImagem que recebe id, tipo, 
contentType e image (em base64) no corpo da requisição, valida se todos os campos foram enviados, converte image em Buffer, 
verifica duplicidade no banco, cria e salva uma nova imagem e retorna status 200.

    ReceberImagemEscolhida que recebe id e tipo como query, valida presença, busca imagem correspondente no banco, retorna erro 404 
se não encontrada e, se encontrada, define contentType e retorna imageUrl em formato base64 no JSON, com tratamento de erros 
via next.    
    
*/}