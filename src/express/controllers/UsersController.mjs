import Usuario from "../models/userModelo.mjs";
import dayjs from 'dayjs';

export async function CriarUsuario(req, res, next) {
    try {
        const {email} = req.body;
        const diasLogados = 1
        const ultimoLogin = dayjs().startOf("day").format("YYYY-MM-DD");
        const criadoEm = dayjs().startOf("day").format("YYYY-MM-DD");
        const UserNovo = new Usuario({email, diasLogados, ultimoLogin, criadoEm});
        await UserNovo.save();
        res.status(201).json(UserNovo);

    } catch (erro) {
        next(erro);
    };
};

export async function GetUsuario(req, res, next) {
    try {
        const {email} = req.query
        if (!email || typeof email !== 'string') return res.status(400).json({message: "Email é obrigatório!"});
        const user = await Usuario.findOne({email})
        if (!user) return res.status(404).json({message: "Usuário não encontrado!"});
        res.json(user);
    } catch (erro) {
        next(erro);
    };
};

export async function alterar_DiasLogados_e_UltimoLogin(req, res, next) {
    try {
        const {email} = req.query;
        if (!email || typeof email !== 'string') return res.status(400).json({message: "Email é obrigatório"});
        const user = await Usuario.findOne({email});
        if (!user) return res.status(404).json({message: "Usuário não encontrado!"});
        const diaAtual = dayjs().startOf("day").format("YYYY-MM-DD");
        const ultimoLogin = dayjs(user.ultimoLogin);
        const diferenca_diaAtual_para_UltimoLogin = dayjs(diaAtual).diff(ultimoLogin, "day");
        let diasLogados = user.diasLogados;
        if (diferenca_diaAtual_para_UltimoLogin > 1) {
            diasLogados = 1
        } else if (diferenca_diaAtual_para_UltimoLogin === 1) {
            diasLogados = diasLogados + 1;
        };

        user.diasLogados = diasLogados;
        user.ultimoLogin = diaAtual;
        await user.save();

        return res.json(user);

    } catch (erro) {
        next(erro);
    };
};

{/* 
    
    Funções de backend em Node.js/Express que gerenciam usuários usando Mongoose/ODM e Dayjs: inclui CriarUsuario que recebe email 
no corpo da requisição, define diasLogados como 1, registra ultimoLogin e criadoEm com a data atual (início do dia) e salva um novo 
usuário no banco retornando status 201.

    GetUsuario que busca usuário por email passado como query, valida entrada e retorna erro 400 se não fornecido ou 404 se não 
encontrado, ou retorna o usuário encontrado.

    Alterar_DiasLogados_e_UltimoLogin que recebe email por query, valida e busca usuário, calcula diferença de dias entre hoje 
e ultimoLogin, reseta diasLogados para 1 se diferença >1, incrementa em 1 se diferença =1, atualiza ultimoLogin para hoje, 
salva e retorna o usuário atualizado, com tratamento de erros via next.   
    
*/}
