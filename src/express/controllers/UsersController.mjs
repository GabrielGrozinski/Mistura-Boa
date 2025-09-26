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
