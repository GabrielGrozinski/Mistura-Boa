import { getDatabase, ref, get, update} from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import axios from 'axios';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Base64 } from 'js-base64';
import _ from 'lodash';

const app = getApp();
const db = getDatabase(app);
dayjs.locale("pt-br");

const controller = new AbortController();
const api = axios.create({
    timeout: 15000,
    signal: controller.signal,
    baseURL: 'http://192.168.1.24:3000'
});

    export async function TipoDeAlimentacao(usuarioAtual: string): Promise<any> {
      const refTipo = ref(db, `usuarios/${usuarioAtual}/tipo_de_alimentação`);
      const snapshot = await get(refTipo);
      const dados = snapshot.val();
      const [key, value] = _.toPairs(dados);
      return key;
      
      // Pega o tipo de alimentação do usuário.
    };
    // Busca o tipo de alimentação.

    export async function DiasLogados(usuarioAtual: string): Promise<number> {
      const refUltimoLogin = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotUltimoLogin = await get(refUltimoLogin);
      const dadosLogin = snapshotUltimoLogin.val();
      const diasLogados: number = dadosLogin.diasLogados;
      return diasLogados;
    };
    // Verifica os dias logados do usuário.

    export async function UltimoLogin(usuarioAtual: string): Promise<string> {
      const refUltimoLogin = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotUltimoLogin = await get(refUltimoLogin);
      const dadosLogin = snapshotUltimoLogin.val();
      const diaAtual_em_milissegundos: number = Date.now();
      const ultimoLogin: number = dadosLogin.ultimoLogin;
      if (diaAtual_em_milissegundos - ultimoLogin < 10*60*1000) {
        return "Online Agora!";
      } else if (diaAtual_em_milissegundos - ultimoLogin < 15*60*1000) {
        return "O usuário cozinhou pela última vez há 15 minutos!";
      } else if (diaAtual_em_milissegundos - ultimoLogin < 30*60*1000) {
        return "O usuário cozinhou pela última vez há 30 minutos!";
      } else if (diaAtual_em_milissegundos - ultimoLogin < 60*60*1000) {
        return "O usuário cozinhou pela última vez há 1 hora!";
      } else if (diaAtual_em_milissegundos - ultimoLogin < 2*60*60*1000) {
        return "O usuário cozinhou pela última vez há 2 horas!";
      } else if (diaAtual_em_milissegundos - ultimoLogin < 24*60*60*1000) {
        return "O usuário cozinhou pela última vez ontem!";
      } else if (diaAtual_em_milissegundos - ultimoLogin < 48*60*60*1000) {
        return "O usuário cozinhou pela última vez dois dias atrás!";
      } else {
        return `O usuário não cozinha desde ${dayjs(ultimoLogin).format("D [de] MMMM [de] YYYY")}`;
      };   
    };
    // Verifica o último login do usuário.

    export async function CriadoEm(usuarioAtual: string): Promise<any> {
      // Pega o o último login do usuário, os dias logados e quando o usuário foi criado.  
      const email = Base64.decode(usuarioAtual);
      const response = await api.get('/usuarios', {params: {email}});
      return response.data;  
    };
    // Verifica quando o usuário foi criado.

    export async function QuantSeguindo(usuarioAtual: string): Promise<number> {
      const refQuantSeguindo = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantSeguindo = await get(refQuantSeguindo);
      const dadosSeguindo = snapshotQuantSeguindo.val();
      const quantSeguindo = dadosSeguindo?.quantSeguindo;
      return quantSeguindo;
      // Pega a quantidade de pessoas que o usuário está seguindo.
    };
    // Busca a quantidade de pessoas que seguem o usuário.

    export async function QuantSeguidores(usuarioAtual: string): Promise<number> {
      const refQuantSeguidores = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantSeguidores = await get(refQuantSeguidores);
      const dadosSeguidores = snapshotQuantSeguidores.val();
      const quantSeguidores = dadosSeguidores?.quantSeguidores;
      return quantSeguidores;
      // Pega a quantidade de pessoas que estão seguindo o usuário.
    };
    // Busca a quantidade de pessoas que o usuário segue.
    
    export async function QuantXP(usuarioAtual: string): Promise<number> {
      const refQuantXP = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantXP = await get(refQuantXP);
      const dadosXP = snapshotQuantXP.val();
      const quantXP = dadosXP?.xp;
      return quantXP;
      // Pega a quantidade de pessoas que estão seguindo o usuário.
    };
    // Busca o xp atual do usuário.
    
    export async function BuscaImagem(usuarioAtual: string): Promise<number> {
      const refImagem = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotImagem = await get(refImagem);
      const dadosImagem = snapshotImagem.val();
      const quantImagem = dadosImagem?.imagemPerfil;
      return quantImagem;
      // Pega a quantidade de pessoas que estão seguindo o usuário.
    };
    // Busca a imagem de perfil do usuário.
    
    export async function NomeUsuario(usuarioAtual: string): Promise<string> {
      const refNome = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotNome = await get(refNome);
      const dadosNome = snapshotNome.val();
      const nomeUsuario = dadosNome?.nome;
      return nomeUsuario;
      // Pega o nome do usuário logado.
    };
    // Busca o nome do usuário.

    export async function QuantReceitas(usuarioAtual: string): Promise<number> {
      const refQuantReceita = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantReceita = await get(refQuantReceita);
      const dadosQuantReceita = snapshotQuantReceita.val();
      const QuantReceitaUsuario = dadosQuantReceita?.quantReceitas;
      return QuantReceitaUsuario;
      // Pega a quantidade de receitas criadas pelo usuário logado.
    };
    // Busca a quantidade de receitas criadas.
    
    export async function QuantReceitasGeradas(usuarioAtual: string): Promise<number> {
      const refQuantReceitaGeradas = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantReceitaGeradas = await get(refQuantReceitaGeradas);
      const dadosQuantReceitaGeradas = snapshotQuantReceitaGeradas.val();
      const QuantReceitaUsuarioGeradas = dadosQuantReceitaGeradas?.receitasGeradas;
      return QuantReceitaUsuarioGeradas;
      // Pega a quantidade de receitas geradas pelo usuário logado.
    };
    // Busca a quantidade de receitass geradas.
    
    export async function buscaAssinante(usuarioAtual: string): Promise<boolean> {
      return false
      // Verifica se o usuário é assinante do aplicativo.
    };
    // Verifica se o usuário é assinante.

    export async function buscaRequisitosCozinheiros(usuarioAtual: string, quantConquistas: number): Promise<boolean[]> {
      // Função que busca os requisitos dos cozinheiros do perfil.
      // Os 4 primeiros cozinheiros não possuem requisitos, então vou começar a partir do quinto.
      if (!usuarioAtual) return [false];
      let arrayComOsRequisitos = [true, true, true, true];
      const refUsuarioBase = ref(db, `usuarios/${usuarioAtual}`);

      // Busca Quantidade de Receitas:
      const quantReceita = await QuantReceitas(usuarioAtual);
      const requisitoGato = quantReceita >= 5 ? true : false;
      const requisitoDragao = quantReceita >= 30 ? true : false;

      // Busca XP:
      const quantXP = await QuantXP(usuarioAtual);
      const requisitoCachorro = quantXP >= 500 ? true : false;
      const requisitoMago = quantXP >= 5000 ? true : false;

      // Busca Ranking:
      const qualRanking = await RankingUsuario(usuarioAtual, true);
      const requisitoUrso = qualRanking !== "Nenhum" ? true : false;
      const requisitoFantasma = qualRanking !== "Nenhum" ? qualRanking !== "Bronze" ? true : false : false;

      // Busca Conquistas:
      const requisitoCoelho = quantConquistas >= 3 ? true : false;
      const requisitoFada = quantConquistas >= 10 ? true : false;

      // Busca Avaliacao:
      let quantAvaliacao = 0;
      const refAvaliacoesApp = ref(db, `usuarios/${usuarioAtual}/avaliacoes/ReceitasApp`);
      const snapshotAvalicoesApp = await get(refAvaliacoesApp);
      if (snapshotAvalicoesApp.exists()) {
        let dados: any = Object.values(snapshotAvalicoesApp.val());
        dados = dados.map((item: any) => item.filter(Boolean));
        // Retira o valor null.
        quantAvaliacao = dados.reduce((acumulador: number, valorAtual: any) => acumulador + valorAtual.length, 0);
      };
      const refAvaliacoesUsuario = ref(db, `usuarios/${usuarioAtual}/avaliacoes/ReceitasUsuarios`);
      const snapshotAvalicoesUsuario = await get(refAvaliacoesUsuario);
      if (snapshotAvalicoesUsuario.exists()) {
        let dados: any = Object.values(snapshotAvalicoesUsuario.val());
        dados = dados.map((item: any) => item.filter(Boolean));
        quantAvaliacao = dados.reduce((acumulador: number, valorAtual: any) => acumulador + valorAtual.length, 0);
      };
      const requisitoPapaiNoel = quantAvaliacao >= 1000 ? true : false;

      // Busca Quantidade de Receitas Geradas:
      const quantReceitasGeradas = await QuantReceitasGeradas(usuarioAtual);
      const requisitoCoelhoDaPascoa = quantReceitasGeradas >= 100 ? true : false;

      // Busca Assinatura:
      const verificaAssinante = await buscaAssinante(usuarioAtual);
      const requisitoOdin = verificaAssinante ? true : false
      const requisitoOsiris = verificaAssinante ? true : false
      const requisitoPoseidon = verificaAssinante ? true : false
      const requisitoDemeter = verificaAssinante ? true : false
      
      arrayComOsRequisitos.push(requisitoGato, requisitoCachorro, requisitoUrso, requisitoCoelho, requisitoDragao,
        requisitoMago, requisitoFantasma, requisitoFada, requisitoCoelhoDaPascoa, requisitoPapaiNoel, requisitoOdin,
        requisitoOsiris, requisitoPoseidon, requisitoDemeter);

      return arrayComOsRequisitos
    };
    // Busca possíveis requisitos dos ícones de cozinheiros.
    
    export async function RankingUsuario(usuarioAtual: string, ranking_ou_passos: boolean): Promise<any> {
      let passosBronze: any = [];
      const refBronze = ref(db, `usuarios/${usuarioAtual}/ranking/bronze`);
      const snapshotBronze = await get(refBronze);
      const dadosBronze = snapshotBronze.val();
      const bronze_avaliacao = dadosBronze.avaliacoes_100;
      const bronze_receitaCriada = dadosBronze.receita_criada_10;
      const bronze_nota = dadosBronze.receita_1_nota_4_com_10_avaliacoes;
      const bronze_xp = dadosBronze.xp_1000;
      const bronze_ = bronze_avaliacao + bronze_receitaCriada + bronze_nota + bronze_xp;
      const continua_bronze = bronze_ === 100 + 10 + 1 + 1000 ? true : false;
      passosBronze = [bronze_avaliacao, bronze_receitaCriada, bronze_nota, bronze_xp];

      let passosOuro: any = [];
      const refOuro = ref(db, `usuarios/${usuarioAtual}/ranking/ouro`);
      const snapshotOuro = await get(refOuro);
      const dadosOuro = snapshotOuro.val();
      const ouro_avaliacao = dadosOuro.avaliacoes_500;
      const ouro_receitaCriada = dadosOuro.receita_criada_25;
      const ouro_nota = dadosOuro.receita_5_nota_4_com_50_avaliacoes;
      const ouro_xp = dadosOuro.xp_10000;
      const ouro_ = ouro_avaliacao + ouro_receitaCriada + ouro_nota + ouro_xp;
      const continua_ouro = ouro_ === 500 + 25 + 5 + 10000 ? true : false;
      passosOuro = [ouro_avaliacao, ouro_receitaCriada, ouro_nota, ouro_xp];

      let passosDiamante: any = [];
      const refDiamante = ref(db, `usuarios/${usuarioAtual}/ranking/diamante`);
      const snapshotDiamante = await get(refDiamante);
      const dadosDiamante = snapshotDiamante.val();
      const diamante_avaliacao = dadosDiamante.avaliacoes_1000;
      const diamante_receitaCriada = dadosDiamante.receita_criada_50;
      const diamante_nota = dadosDiamante.receita_10_nota_4_com_50_avaliacoes;
      const diamante_xp = dadosDiamante.xp_50000;
      const diamante_ = diamante_avaliacao + diamante_receitaCriada + diamante_nota + diamante_xp;
      const continua_diamante = diamante_ === 1000 + 50 + 10 + 50000 ? true : false;
      passosDiamante = [diamante_avaliacao, diamante_receitaCriada, diamante_nota, diamante_xp];

      let passosEsmeralda: any = [];
      const refEsmeralda = ref(db, `usuarios/${usuarioAtual}/ranking/esmeralda`);
      const snapshotEsmeralda = await get(refEsmeralda);
      const dadosEsmeralda = snapshotEsmeralda.val();
      const Esmeralda_avaliacao = dadosEsmeralda.avaliacoes_2500;
      const Esmeralda_receitaCriada = dadosEsmeralda.receita_criada_100;
      const Esmeralda_nota = dadosEsmeralda.receita_20_nota_4_com_50_avaliacoes;
      const Esmeralda_xp = dadosEsmeralda.xp_250000;
      const Esmeralda_nota100 = dadosEsmeralda.receita_1_nota_4_5_com_100_avaliacoes;
      const esmeralda_ = Esmeralda_avaliacao + Esmeralda_receitaCriada + Esmeralda_nota + Esmeralda_xp + Esmeralda_nota100;
      const continua_esmeralda = esmeralda_ === 2500 + 100 + 20 + 250000 + 1 ? true : false;
      passosEsmeralda = [Esmeralda_avaliacao, Esmeralda_receitaCriada, Esmeralda_nota, Esmeralda_nota100, Esmeralda_xp];

      let passosCS: any = [];
      const refChefeSupremo = ref(db, `usuarios/${usuarioAtual}/ranking/chefeSupremo`);
      const snapshotChefeSupremo = await get(refChefeSupremo);
      const dadosChefeSupremo = snapshotChefeSupremo.val();
      const ChefeSupremo_avaliacao = dadosChefeSupremo.avaliacoes_5000;
      const ChefeSupremo_receitaCriada = dadosChefeSupremo.receita_criada_200;
      const ChefeSupremo_nota = dadosChefeSupremo.receita_30_nota_4_com_50_avaliacoes;
      const ChefeSupremo_xp = dadosChefeSupremo.xp_1000000;
      const ChefeSupremo_nota100 = dadosChefeSupremo.receita_3_nota_4_5_100_avaliacoes;
      const ChefeSupremo_ = ChefeSupremo_avaliacao + ChefeSupremo_receitaCriada + ChefeSupremo_nota + ChefeSupremo_xp + ChefeSupremo_nota100;
      const continua_ChefeSupremo = ChefeSupremo_ === 5000 + 200 + 30 + 1000000 + 3 ? true : false;
      passosCS = [ChefeSupremo_avaliacao, ChefeSupremo_receitaCriada, ChefeSupremo_nota, ChefeSupremo_nota100, ChefeSupremo_xp];
      
      const todosPassos: any = [passosBronze, passosOuro, passosDiamante, passosEsmeralda, passosCS];

      if (ranking_ou_passos) {
        const refRankingAtual = ref(db, `usuarios/${usuarioAtual}`);
        if (continua_ChefeSupremo) {
          await update(refRankingAtual, {rankingAtual: 'ChefeSupremo'});
          return 'Chefe Supremo'
        } else if (continua_esmeralda) {
          await update(refRankingAtual, {rankingAtual: 'Esmeralda'});
          return 'Esmeralda'
        } else if (continua_diamante) {
          await update(refRankingAtual, {rankingAtual: 'Diamante'});
          return 'Diamante'
        } else if (continua_ouro) {
          await update(refRankingAtual, {rankingAtual: 'Ouro'});
          return 'Ouro'
        } else if (continua_bronze) {
          await update(refRankingAtual, {rankingAtual: 'Bronze'});
          return 'Bronze'
        } else {
          return 'Nenhum'
        };
      } else {
        return todosPassos;
      };
    };
    // Busca o ranking atual e os passos.
