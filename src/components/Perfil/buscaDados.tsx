import { getDatabase, ref, get, update} from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import axios from 'axios';
import { Base64 } from 'js-base64';
import _ from 'lodash';

const app = getApp();
const db = getDatabase(app);

const controller = new AbortController();
const api = axios.create({
    timeout: 15000,
    signal: controller.signal,
    baseURL: 'http://192.168.1.9:3000'
});

    export async function TipoDeAlimentacao(usuarioAtual: string): Promise<any> {
      const refTipo = ref(db, `usuarios/${usuarioAtual}/tipo_de_alimentação`);
      const snapshot = await get(refTipo);
      const dados = snapshot.val();
      const [key, value] = _.toPairs(dados);
      return key;
      
      
      // Pega o tipo de alimentação do usuário.
    };

    export async function DiasLogados_e_UltimoLogin_e_CriadoEm(usuarioAtual: string): Promise<any> {
      try {
        const email = Base64.decode(usuarioAtual);
        const response = await api.get('/usuarios', {params: {email}});
        return response.data;
      } catch (erro) {
        return console.log("Erro:", erro);
      };
      // Pega o o último login do usuário, os dias logados e quando o usuário foi criado.
    };

    export async function QuantSeguindo(usuarioAtual: string): Promise<number> {
      const refQuantSeguindo = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantSeguindo = await get(refQuantSeguindo);
      const dadosSeguindo = snapshotQuantSeguindo.val();
      const quantSeguindo = dadosSeguindo?.quantSeguindo;
      return quantSeguindo;
      // Pega a quantidade de pessoas que o usuário está seguindo.
    };

    export async function QuantSeguidores(usuarioAtual: string): Promise<number> {
      const refQuantSeguidores = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantSeguidores = await get(refQuantSeguidores);
      const dadosSeguidores = snapshotQuantSeguidores.val();
      const quantSeguidores = dadosSeguidores?.quantSeguidores;
      return quantSeguidores;
      // Pega a quantidade de pessoas que estão seguindo o usuário.
    };
    
    export async function QuantXP(usuarioAtual: string): Promise<number> {
      const refQuantXP = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantXP = await get(refQuantXP);
      const dadosXP = snapshotQuantXP.val();
      const quantXP = dadosXP?.xp;
      return quantXP;
      // Pega a quantidade de pessoas que estão seguindo o usuário.
    };
    
    export async function NomeUsuario(usuarioAtual: string): Promise<string> {
      const refNome = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotNome = await get(refNome);
      const dadosNome = snapshotNome.val();
      const nomeUsuario = dadosNome?.nome;
      return nomeUsuario;
      // Pega o nome do usuário logado.
    };

    export async function QuantReceitas(usuarioAtual: string): Promise<number> {
      const refQuantReceita = ref(db, `usuarios/${usuarioAtual}`);
      const snapshotQuantReceita = await get(refQuantReceita);
      const dadosQuantReceita = snapshotQuantReceita.val();
      const QuantReceitaUsuario = dadosQuantReceita?.quantReceitas;
      return QuantReceitaUsuario;
      // Pega a quantidade de receitas criadas pelo usuário logado.
    };
    
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
