import React, {useState, useEffect, useRef} from 'react';
import "../../../global.css";
import { View, Text, Pressable, ScrollView, Image, ImageBackground, Alert, Modal, StatusBar, TouchableOpacity } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { 
  QuantReceitas, DiasLogados, CriadoEm, UltimoLogin, QuantXP, buscaRequisitosCozinheiros, 
  QuantSeguidores, QuantSeguindo, NomeUsuario, RankingUsuario, BuscaImagem } from './buscaDados';
import { getDatabase, ref, get, update, remove, set } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import ImmersiveMode from 'react-native-immersive';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import Barra from '../Barra/Barra';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import LoaderCompleto from '../loading/loadingCompleto';
import LinearGradient from 'react-native-linear-gradient';

 
type Props = NativeStackScreenProps<TiposRotas, 'PerfilUsuario'>
  
const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

dayjs.locale("pt-br");

export default function PerfilUsuario({route, navigation}: Props) {
  const [emailUserAtual, setEmailUserAtual] = useState<string>('');
  const [loadingReceita, setLoadingReceita] = useState<boolean>(true);
  const [loadingReceitaMostrar, setLoadingReceitaMostrar] = useState<boolean>(true);
  const [loadingConquista, setLoadingConquista] = useState<boolean>(true);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
  // Parte de conquistas.
  const [conquistas, setConquistas] = useState<any>([]);
  const ImagensConquistas = [
    require('../../../assets/Perfil/conquistas/100Avaliacoes.png'),
    require('../../../assets/Perfil/conquistas/250Avaliacoes.png'),
    require('../../../assets/Perfil/conquistas/500Avaliacoes.png'),
    require('../../../assets/Perfil/conquistas/2500Avaliacoes.png'),
    require('../../../assets/Perfil/conquistas/5000Avaliacoes.png'),
    require('../../../assets/Perfil/conquistas/10000Avaliacoes.png'),
    require('../../../assets/Perfil/conquistas/3Receitas.png'),
    require('../../../assets/Perfil/conquistas/10Receitas.png'),
    require('../../../assets/Perfil/conquistas/25Receitas.png'),
    require('../../../assets/Perfil/conquistas/50Receitas.png'),
    require('../../../assets/Perfil/conquistas/100Receitas.png'),
    require('../../../assets/Perfil/conquistas/1000Receitas.png'),
    require('../../../assets/Perfil/conquistas/3Geradas.png'),
    require('../../../assets/Perfil/conquistas/10Geradas.png'),
    require('../../../assets/Perfil/conquistas/25Geradas.png'),
    require('../../../assets/Perfil/conquistas/100Geradas.png'),
    require('../../../assets/Perfil/conquistas/500Geradas.png'),
    require('../../../assets/Perfil/conquistas/1000Geradas.png'),
    require('../../../assets/Perfil/conquistas/Top1.png'),
    require('../../../assets/Perfil/conquistas/Top5.png'),
    require('../../../assets/Perfil/conquistas/Top50.png'),
    require('../../../assets/Perfil/conquistas/Top100.png'),
    require('../../../assets/Perfil/conquistas/Top200.png'),
  ];
  const conquistasRequisitos = useRef<number>(0); 
  // 

  const [seguidores, setSeguidores] = useState<number>(0);
  const [seguindo, setSeguindo] = useState<number>(0);
  const [quantReceitas, setQuantReceitas] = useState<number>(0);
  const [nome, setNome] = useState<string>('');
  const [xp, setXp] = useState<number>(0);
  const [ranking, setRanking] = useState<any>(require('../../../assets/Perfil/noRank.png'));
  const [texto_do_ranking, setTextoDoRanking] = useState<string>('Nenhum');
  const [diasLogados, setDiasLogados] = useState<number>(0);
  const [ultimoLogin, setUltimoLogin] = useState<string>('');
  const [criadoEm, setCriadoEm] = useState<string>('');
  const [requisitosCozinheiros, setRequisitosCozinheiros] = useState<boolean[]>([]);
  const [receitas_array, setReceitas_Array] = useState<boolean>(false);
  const [receitasUser, setReceitasUser] = useState<any>([]);
  const [cardCompletar, setCardCompletar] = useState<boolean>(false);
  const [info_user, setInfo] = useState<any>([]);
  const [status_seguir, setStatus_Seguir] = useState<any>([]);
  const [modalVisivel, setModalVisivel] = useState<boolean>(false);
  const [modalVisivelUser, setModalVisivelUser] = useState<boolean>(false);
  const [imagemPerfil, setImagemPerfil] = useState<any>('');

  const usuariosImagens = [
    {
      icone: require('../../../assets/Perfil/users/homemAdulto.png'),
      nome: 'O Cozinheiro',
      requisito: requisitosCozinheiros[0]
    },
    {
      icone: require('../../../assets/Perfil/users/mulherAdulta.png'),
      nome: 'A Cozinheira',
      requisito: requisitosCozinheiros[1]
    },
    {
      icone: require('../../../assets/Perfil/users/homemJovem.png'),
      nome: 'Garoto',
      requisito: requisitosCozinheiros[2]
    },
    {
      icone: require('../../../assets/Perfil/users/mulherJovem.png'),
      nome: 'Garota',
      requisito: requisitosCozinheiros[3]
    },
    {
      icone: require('../../../assets/Perfil/users/gato.png'),
      nome: 'Gato',
      requisito: requisitosCozinheiros[4],
      requisitoTexto: 'Crie 5 receitas'
    },
    {
      icone: require('../../../assets/Perfil/users/cachorro.png'),
      nome: 'Cachorro',
      requisito: requisitosCozinheiros[5],
      requisitoTexto: 'Tenha 500 Cookies'
    },
    {
      icone: require('../../../assets/Perfil/users/urso.png'),
      nome: 'Urso',
      requisito: requisitosCozinheiros[6],
      requisitoTexto: 'Seja ranking Bronze'
    },
    {
      icone: require('../../../assets/Perfil/users/coelho.png'),
      nome: 'Coelho',
      requisito: requisitosCozinheiros[7],
      requisitoTexto: 'Tenha 3 conquistas'
    },
    {
      icone: require('../../../assets/Perfil/users/dragao.png'),
      nome: 'Dragão',
      requisito: requisitosCozinheiros[8],
      requisitoTexto: 'Crie 30 receitas'
    },
    {
      icone: require('../../../assets/Perfil/users/mago.png'),
      nome: 'Mago',
      requisito: requisitosCozinheiros[9],
      requisitoTexto: 'Tenha 500 Cookies'
    },
    {
      icone: require('../../../assets/Perfil/users/fantasma.png'),
      nome: 'Fantasma',
      requisito: requisitosCozinheiros[10],
      requisitoTexto: 'Seja ranking Ouro'
    },
    {
      icone: require('../../../assets/Perfil/users/fada.png'),
      nome: 'Fada',
      requisito: requisitosCozinheiros[11],
      requisitoTexto: 'Tenha 10 conquistas'
    },
    {
      icone: require('../../../assets/Perfil/users/coelhoDaPascoa.png'),
      nome: 'Coelho da Páscoa',
      requisito: requisitosCozinheiros[12],
      requisitoTexto: 'Gere 100 receitas'
    },
    {
      icone: require('../../../assets/Perfil/users/papaiNoel.png'),
      nome: 'Papai Noel',
      requisito: requisitosCozinheiros[13],
      requisitoTexto: 'Avalie 1000 receitas'
    },
    {
      icone: require('../../../assets/Perfil/users/odin.png'),
      nome: 'Odin',
      poder: 'Receitas difíceis que você criar dão o dobro de Cookies',
      cor: 'text-yellow-300',
      requisito: requisitosCozinheiros[14],
      requisitoTexto: 'É preciso ser assinante'
    },
    {
      icone: require('../../../assets/Perfil/users/osiris.png'),
      nome: 'Osíris',
      poder: 'Receitas longas que você criar dão o dobro de Cookies',
      cor: 'text-green-300',
      requisito: requisitosCozinheiros[15],
      requisitoTexto: 'É preciso ser assinante'
    },
    {
      icone: require('../../../assets/Perfil/users/poseidon.png'),
      nome: 'Poseidon',
      poder: 'Você libera receitas exclusivas de frutos do mar',
      cor: 'text-sky-300',
      requisito: requisitosCozinheiros[16],
      requisitoTexto: 'É preciso ser assinante'
    },
    {
      icone: require('../../../assets/Perfil/users/demeter.png'),
      nome: 'Deméter',
      poder: 'Receitas veganas que você criar dão o dobro de Cookies',
      cor: 'text-purple-300',
      requisito: requisitosCozinheiros[17],
      requisitoTexto: 'É preciso ser assinante'
    },
  ];
  
  const { status_usuario } = route.params;
  // O status_usuario serve para definir se o perfil visitado é do próprio usuário, de um usuário que ele segue,
  // de um usuário que o segue ou de um usuário que nenhum dos dois se seguem.
  const [state_status_usuario, setStatus_Usuario] = useState<any>(status_usuario);
  // Transforma o status_usuario em uma variável useState.

  let { usuarioAtual } = route.params;
  if (!usuarioAtual) usuarioAtual = emailUserAtual;
  // Sempre ao ser levado na tela de perfil, o usuárioAtual será o email referente àquele usuário.
  // Isso serve, por exemplo, para quando um usuário visita o perfil de outro usuário.
  // Caso o usuárioAtual dê algum problema (por algum motivo), então o perfil visitado será o do usuário logado.

  useEffect(() => {
    ImmersiveMode.setImmersive(true);
    const user = onAuthStateChanged(authInstance, usuario => {
      if (usuario?.email) {
        if (usuarioAtual === Base64.encode(usuario.email)) setStatus_Usuario('Outro');
        setEmailUserAtual(Base64.encode(usuario.email));
      };
    });
    return () => user();
  }, [authInstance, usuarioAtual]);
  {/* Verificando Email e definindo o valor do state_status_usuario */}

  useEffect(() => {
    // Função que pega as receitas do usuário logado
    setLoadingReceita(false);
    async function pegarReceitas() {
      try {
      // Pega as receitas do usuário.
      const refReceitas = ref(db, `usuarios/${usuarioAtual}/receitas`);
      const snapshotReceitas = await get(refReceitas);
      if (snapshotReceitas.exists()) { 
        setReceitasUser(snapshotReceitas.val().filter(Boolean));
      };
      setLoadingReceita(false);

      } catch (erro: unknown) {
        if (erro instanceof Error) console.log('Erro comum Pegar Receitas:', erro.message);
        else
        console.log('Erro desconhecido:', erro);
      };
    };
    pegarReceitas();
  }, [usuarioAtual]);
  {/* Verificando as receitas do usuário */}

  useEffect (() => {
    // Função que pega as conquistas do usuário logado

    async function ordenarConquistas(): Promise<void> {
      try {
        const refConquistas = ref(db, `usuarios/${usuarioAtual}/conquistas`);
        const snapshot = await get(refConquistas);
        const dados = snapshot.val() as Record<string, any>;
        if (!dados) return;

        // "Achata" todos os objetos internos em itens individuais
        let conquistasArray: { nome: string; valor: any }[] = [];
        Object.entries(dados).forEach(([prefixo, obj]) => {
          Object.entries(obj).forEach(([num, valor]) => {
            conquistasArray.push({
              nome: `${prefixo}_${num}`, // ex: receitas_criadas_3
              valor,
            });
          });
        });

        const regex = /^(.*)_(\d+)$/;

        // ordena primeiro pelo prefixo e depois pelo número final
        conquistasArray.sort((a, b) => {
          const [, prefixA, numA] = a.nome.match(regex) || [null, a.nome, "0"];
          const [, prefixB, numB] = b.nome.match(regex) || [null, b.nome, "0"];

          const cmpPrefix = prefixA.localeCompare(prefixB);
          if (cmpPrefix !== 0) return cmpPrefix;

          return parseInt(numA, 10) - parseInt(numB, 10);
        });

        // Soma a quantidade de conquistas que o usuário tem.
        const conquistasRequisitosArray = conquistasArray.map((conquista) => conquista.valor)
        conquistasRequisitos.current = conquistasRequisitosArray.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

        // adiciona um id sequencial
        conquistasArray = conquistasArray.map((c, idx) => ({ id: idx, ...c }));

        conquistasArray = conquistasArray.map((c, idx) => ({imagem: ImagensConquistas[idx], ...c}));


        setConquistas(conquistasArray);
        setLoadingConquista(false);

      } catch (erro: unknown) {
        if (erro instanceof Error) console.log("Erro comum Conquistas:", erro.message);
        else console.log("Erro desconhecido:", erro);
      }
    }
    ordenarConquistas();
  }, [usuarioAtual]);
  {/* Pegando as conquistas do usuário */}

  useEffect(() => {
    // Função que pega os dados do usuário logado
    async function Dados_do_Usuario() {
      try {
      const requisitosCozinheiros_ = await buscaRequisitosCozinheiros(usuarioAtual, conquistasRequisitos.current);
      setRequisitosCozinheiros(requisitosCozinheiros_);

      const quantReceitas_ = await QuantReceitas(usuarioAtual);
      setQuantReceitas(quantReceitas_);

      const quantSeguidores_ = await QuantSeguidores(usuarioAtual);
      setSeguidores(quantSeguidores_);
      
      const quantSeguindo_ = await QuantSeguindo(usuarioAtual);
      setSeguindo(quantSeguindo_);

      const nome_ = await NomeUsuario(usuarioAtual);
      setNome(nome_);

      const xp_ = await QuantXP(usuarioAtual);
      setXp(xp_);

      const imagemPerfil_ = await BuscaImagem(usuarioAtual);
      setImagemPerfil(imagemPerfil_);

      const UltimoLogin_ = await UltimoLogin(usuarioAtual);
      console.log('Ultimo Login', UltimoLogin_)
      setUltimoLogin(UltimoLogin_);

      const CriadoEmFuncao_ = await CriadoEm(usuarioAtual);
      console.log('Criado em', CriadoEmFuncao_)
      const criadoEm_ = CriadoEmFuncao_.criadoEm;
      setCriadoEm(`Cozinheiro desde ${dayjs(criadoEm_).format("MMMM [de] YYYY")}`);
      console.log('Criado em 2', `Cozinheiro desde ${dayjs(criadoEm_).format("MMMM [de] YYYY")}`)

      const DiasLogados_ = await DiasLogados(usuarioAtual);
      console.log('Dias Logados', DiasLogados_)
      setDiasLogados(DiasLogados_);

      const ranking_ = await RankingUsuario(usuarioAtual, true);
      setTextoDoRanking(ranking_);
      switch (ranking_) {
        case 'Chefe Supremo':
          setRanking(require(`../../../assets/Perfil/chefeSupremo.png`));
          break;
        case 'Esmeralda':
          setRanking(require('../../../assets/Perfil/esmeralda.png'));
          break;
        case 'Diamante':
          setRanking(require('../../../assets/Perfil/diamante.png'));
          break;
        case 'Ouro':
          setRanking(require('../../../assets/Perfil/ouro.png'));
          break;
        case 'Bronze':
          setRanking(require('../../../assets/Perfil/bronze.png'));
          break;
        default:
          setRanking(require('../../../assets/Perfil/noRank.png'));
          break;
      };
      setLoadingInfo(false);

    } catch (erro: unknown) {
        if (erro instanceof Error) console.log('Erro comum Informacoes:', erro.message);
        else
        console.log('Erro desconhecido:', erro);
      };
    };

    Dados_do_Usuario();
  }, [usuarioAtual]);
  {/* Pegando os dados do usuário */}

  useEffect(() => {
    const todasInformacoes = [
      {
        valor: diasLogados,
        texto: 'Dias Seguidos',
        icone: 'flash-sharp',
        cor: '#0ea5e9'
      },
      {
        valor: quantReceitas,
        texto: 'Receitas',
        icone: 'pizza-sharp',
        cor: '#e9950eff'
      },
      {
        valor: xp,
        texto: 'Cookies',
        icone: '🍪',
        cor: null
      },
      {
        valor: texto_do_ranking,
        texto: 'Ranking',
        icone: ranking,
        cor: null
      },
    ];
    setInfo(todasInformacoes);

  }, [xp, quantReceitas, ranking, diasLogados, texto_do_ranking]);
  {/* Definindo as informações do usuário */}

  useEffect(() => {
    if (!receitasUser || receitasUser.length === 0) {
      setLoadingReceitaMostrar(false);
      return;
    };
    const soma = receitasUser.length;
    if (soma >= 3) {
      setReceitasUser(receitasUser.sort((a: any, b: any) => b.avaliacao.nota - a.avaliacao.nota));
      setReceitas_Array(true);
      setLoadingReceitaMostrar(false);
      // Só chama a função Receitas_a_mostrar se houver, ao menos, 3 receitas.
    } else {
      setReceitas_Array(false);
      setLoadingReceitaMostrar(false);
    };

  }, [receitasUser]);
  {/* Verificando se o usuário têm três receitas ou não */}

  const removerSeguidor = async () => {
    // Função para remover um seguidor.
    // A função é separada em duas partes.
    // A lógica da função é semelhante à função SeguirUsuario, mas ao contrário.
    setStatus_Usuario('Não Segue');
    try {
      onAuthStateChanged(authInstance, async usuario => {
      if (!usuario || !usuario.email) return;
        const emailB64 = Base64.encode(usuario.email);
        const refSeguindo = ref(db, `usuarios/${emailB64}/seguindo/${usuarioAtual}`);
        const snapshot = await get(refSeguindo);
        
        if (snapshot.exists()) {
          await remove(refSeguindo);
        };
        // Primeiro, remove o usuário da lista de seguindo do usuário atual.
            
        const refQuantSeguindo = ref(db, `usuarios/${emailB64}`);
        const snapshotQuantSeguindo = await get(refQuantSeguindo);
        const dadosSeguindo = snapshotQuantSeguindo.val();
        const QuantSeguindo = dadosSeguindo?.quantSeguindo;
        const QuantSeguindoNovo = QuantSeguindo - 1;
        
        if (!snapshotQuantSeguindo.exists()) return;
        if (snapshotQuantSeguindo.exists()) {
          update(refQuantSeguindo, {
            quantSeguindo: QuantSeguindoNovo,
          });
        };
        
        const refSeguidor = ref(db, `usuarios/${emailB64}/seguidores/${emailB64}`);
        const snapshotSeguidor = await get(refSeguidor);
        
        if (snapshotSeguidor.exists()) {
          await remove(refSeguidor);
        };
        // Depois, remove o usuário atual da lista de seguidores do usuário que foi seguido.
        
        const refQuantSeguidores = ref(db, `usuarios/${usuarioAtual}`);
        const snapshotQuantSeguidores = await get(refQuantSeguidores);
        const dadosSeguidores = snapshotQuantSeguidores.val();
        const QuantSeguidores = dadosSeguidores?.quantSeguidores;
        const QuantSeguidoresNovo = QuantSeguidores - 1;
        
        if (!snapshotQuantSeguidores.exists()) return;
        if (snapshotQuantSeguidores.exists()) {
          update(refQuantSeguidores, {
            quantSeguidores: QuantSeguidoresNovo,
          });
        };
      });
      

    } catch (erro) {
        console.log('Erro remover seguidor:', erro);
    };
  };
  // Função que remove seguidor.

  const SeguirUsuario = async (): Promise<void> => {
      // Função para seguir um usuário.
      // A função é separada em duas partes.
      setStatus_Usuario('Seguindo');
      try {
      onAuthStateChanged(authInstance, async usuario => {
        if (!usuario || !usuario.email) return;  
        const emailB64 = Base64.encode(usuario.email);
        const refSeguindo = ref(db, `usuarios/${emailB64}/seguindo/${usuarioAtual}`);
        const snapshot = await get(refSeguindo);
        // Verifica se o usuário logado já está seguindo o outro usuário (que ele clicou para seguir).
    
        const refQuantSeguindo = ref(db, `usuarios/${emailB64}`);
        const snapshotQuantSeguindo = await get(refQuantSeguindo);
        const dadosSeguindo = snapshotQuantSeguindo.val();
        const QuantSeguindo = dadosSeguindo?.quantSeguindo;
        const QuantSeguindoNovo = QuantSeguindo + 1;
        // Atualiza a quantidade de usuários que o usuário logado está seguindo.

        const imagemUsuarioRef = ref(db, `usuarios/${usuarioAtual}`);
        const snapshotImagemUsuario = await get(imagemUsuarioRef);
        const dadosImagemUsuario = snapshotImagemUsuario.val();
        const imagemPerfil = dadosImagemUsuario?.imagemPerfil;
        // Pega a imagem do usuário.

    
        if (!snapshot.exists() || snapshot.exists()) {
          set(refSeguindo, {
            nome: nome,
            email: Base64.decode(usuarioAtual),
            imagemPerfil
          });
        };
    
        if (!snapshotQuantSeguindo.exists()) return;
        if (snapshotQuantSeguindo.exists()) {
          update(refQuantSeguindo, {
            quantSeguindo: QuantSeguindoNovo,
          });
        };
        // Essa é a primeira parte da função, que adiciona o usuário na lista de seguindo do usuário atual.
          if (!authInstance.currentUser) return;
          const nomeAtual = authInstance.currentUser.displayName;
          const refSeguidor = ref(db, `usuarios/${usuarioAtual}/seguidores/${emailB64}`);
          const snapshotSeguidor = await get(refSeguidor);
      
          const refQuantSeguidores = ref(db, `usuarios/${usuarioAtual}`);
          const snapshotQuantSeguidores = await get(refQuantSeguidores);
          const dadosSeguidores = snapshotQuantSeguidores.val();
          const QuantSeguidores = dadosSeguidores?.quantSeguidores;
          const QuantSeguidoresNovo = QuantSeguidores + 1;
          // Atualiza a quantidade de seguidores do usuário que foi seguido.
          
          if (!snapshotSeguidor.exists() || snapshot.exists()) {
            set(refSeguidor, {
              nome: nomeAtual,
              email: usuario.email,
            });
          };
      
          if (!snapshotQuantSeguidores.exists()) return;
          if (snapshotQuantSeguidores.exists()) {
            update(refQuantSeguidores, {
              quantSeguidores: QuantSeguidoresNovo,
            });
        
      }});

      } catch (erro) {
        console.log('Erro seguir usuário:', erro);
      };
  };
  // Função que segue um usuário.

  useEffect(() => {
    switch (state_status_usuario) {
    case 'Seguir de volta!': 
      setStatus_Seguir({corBG: '#3bddfeff', corTexto: 'black', icone: 'person-add-sharp',  iconeCor: 'black', texto: 'SEGUIR DE VOLTA!'});
      break;
    case 'Seguindo':
      setStatus_Seguir({corBG: '#ccf1d6', corTexto: '#1d6b3d', icone: 'person-sharp',  iconeCor: '#1d6b3d', texto: 'SEGUINDO'});
      break;
    case 'Não Segue':
      setStatus_Seguir({corBG: '#3bddfeff', corTexto: 'black', icone: 'person-add-sharp',  iconeCor: 'black', texto: 'SEGUIR'});
      break;
    default: 
      setStatus_Seguir({corBG: '#ccf1d6', corTexto: '#1d6b3d', icone: 'person-add-sharp',  iconeCor: '#1d6b3d', texto: 'ADICIONAR AMIGOS'});
  };
  }, [state_status_usuario]);
  {/* Definindo o estado do usuário (seguindo, seguir de volta, etc) */}

  if (loadingConquista || loadingInfo || loadingReceita || loadingReceitaMostrar) return (
    <LoaderCompleto />
  );

  if (modalVisivelUser) return (
    <View className='flex-1'>
      <StatusBar hidden/>
      <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1.1}} colors={['#1c6c9eff', '#24cae4ff']} className='h-full w-full'>
      <Modal animationType='slide' transparent onRequestClose={() => setModalVisivelUser(false)} visible={modalVisivelUser}>
        <ScrollView contentContainerStyle={{alignItems: 'center'}} className='w-full grow'>
          <Image className='w-full h-[220px]' source={require('../../../assets/Perfil/users/usersCompletos/poseidon.png')} />
          <Text className='text-center font-extrabold text-white text-4xl mt-2 mx-10'>
              POSEIDON
          </Text>
          <Text className='font-medium text-center text-white text-2xl mt-2 mx-10'>
              Deus dos mares e oceanos, senhor das águas profundas. Carrega seu tridente dourado e controla as tempestades, além de usá-lo como garfo pessoal!
          </Text>
          <Text className='font-extrabold text-center text-white text-3xl mt-8 mx-10 text-center'>
                REQUISITOS PARA LIBERAR
          </Text>
          <View className="flex-row mt-4 justify-start w-full items-center">
            <View className="h-10 w-10 ml-10 rounded-full self-start bg-green-400 items-center justify-center">
              <Ionicons name="checkmark-sharp" size={30} color="#ffffffff" />
            </View>
            <Text className='text-xl font-medium text-white ml-1 text-center'>
              Ser Assinante
            </Text>
          </View>
          
          <Text className='font-extrabold text-center text-[#ffff3bff] text-3xl mt-8 mx-10 text-center'>
                VANTAGENS
          </Text>

          <View className="w-full items-center">
            
            <Text className='font-medium ml-10 text-center text-white text-xl mt-2 mx-10 text-center'>
              Dobro de Cookies ao criar receitas com peixes
            </Text>

            <Text className='font-medium ml-10 text-center text-white text-xl mt-1 mx-10 text-center'>
              Receitas exclusivas
            </Text>

            <Text className='font-medium ml-10 text-center text-white text-xl mt-1 mx-10 text-center'>
              Suas receitas ficam com um destaque de Poseidon
            </Text>

          </View>

          <TouchableOpacity onPress={() => setModalVisivelUser(false)} className='mt-6 mb-6 justify-center border-[3px] border-white bg-blue-400 w-[85%] h-12 rounded-2xl'>
            <Text className="text-white font-medium text-center text-2xl">
              Usar Poseidon
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </Modal>
      </LinearGradient>
    </View>
  );

  return (
    <View className="bg-[#132022] flex-1">
      <ScrollView contentContainerClassName="grow pb-[130px] pt-2">
        <View className="absolute top-6 right-6">
          <Text className="text-[20px]">⚙️</Text>
        </View>
        {/* Cabeçalho com imagem/ícone do avatar */}
        <View className='w-full h-1/4 items-center justify-center bg-[#d56f39]'>
          <Pressable onPress={() => setModalVisivel(true)}>
          <Image 
          source={{uri: imagemPerfil}}
          className='w-[260px] h-[260px]'
          />
          </Pressable>
        </View>

        <Modal animationType='slide' transparent={false} onRequestClose={() => setModalVisivel(false)} visible={modalVisivel}>
                <View className="flex-1 bg-[#132022] items-center">
                  <Text className='text-white mt-10 text-3xl font-bold text-center mb-10'>Escolha o seu cozinheiro!</Text>
                  <ScrollView nestedScrollEnabled={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-around', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {usuariosImagens.map((user, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {setModalVisivel(false); setModalVisivelUser(true);}}
                        className="m-4"
                      >

                        <Image className={`rounded-full self-center h-[120px] w-[120px]`} source={user.icone} />
                        <Text className={`font-bold text-white text-center self-center text-xl`}>
                          {user.nome}
                        </Text>

                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
        </Modal>

        {/* Nome e usuário */}
        <Text style={{fontFamily: "monospace"}} 
          className="text-xl font-bold text-white text-start ml-8 mt-4">
            {nome}
        </Text>
        <Text style={{fontFamily: "monospace"}} className="text-lg text-yellow-500 tracking-tight text-start ml-8">
            {criadoEm}
        </Text>

        {/* Número de seguidores/seguindo/receitas Criadas */}
        <Pressable className="flex-row justify-around mt-8 mb-8"
          onPress={() => navigation.navigate('AdicionarAmigos', {usuarioAtual, nome, AdicionarAmigos_ou_Ver_Seguidores: false})}>
          <Text style={{fontFamily: "monospace"}}  className="text-lg font-bold text-white text-center">
            {seguindo}{'\n'}Segue
          </Text>
          <Text style={{fontFamily: "monospace"}}  className="text-lg font-bold text-white text-center">
            {seguidores}{'\n'}Seguidores
          </Text>
        </Pressable>

        {/* Botão adicionar amigos */} 
        <TouchableOpacity style={{backgroundColor: status_seguir.corBG}} 
          className='bg-sky-500 elevation-1 border-2 border-b-[3.5px] border-black/10 self-start flex-row w-[65%] ml-8 items-center justify-center h-[42px] rounded-xl mb-5' 
          onPress={() => 
            status_usuario ===  'Seguir de volta!' ? SeguirUsuario() 
            : 
            status_usuario === 'Seguindo' ? removerSeguidor()
            : 
            status_usuario === 'Não Segue' ? SeguirUsuario() 
            : 
            navigation.navigate('AdicionarAmigos', {usuarioAtual, nome, AdicionarAmigos_ou_Ver_Seguidores: true})
            }>
            <Ionicons name={status_seguir.icone} color={status_seguir.iconeCor} size={24} />
            <Text style={{textShadowColor: 'gray', textShadowRadius: 0.2, color: status_seguir.corTexto}} 
            className='ml-2 text-xl text-center font-bold' >{status_seguir.texto}</Text>
        </TouchableOpacity>

        {/* Card de completar perfil*/}
        {cardCompletar && (
          <View className="bg-[#f1f6ff] p-4 rounded-xl mb-6">
            <Text className="font-bold text-[16px] text-[#2b3d69] mb-1">Completar perfil</Text>
            <Text className="text-[#555] text-[13px] mb-3">
              Complete os passos que faltam pro seu perfil ficar incrível!
            </Text>
            <Pressable className="bg-white p-2.5 rounded-lg border border-[#d0d8e0]">
              <Text className="text-center text-[#2b3d69] font-bold">CONTINUAR</Text>
            </Pressable>
            <Pressable className="absolute right-2 top-1" onPress= {() => setCardCompletar(!cardCompletar)}>
                <Text className="text-[20px]">X</Text>
            </Pressable>
          </View>
        )} 

        {/* Visão geral */}
        <Text className="ml-4 text-2xl font-extrabold opacity-95 text-white mt-6">Visão geral</Text>
        <View className="flex-row justify-around mb-4 mx-1 items-center flex-wrap">

          {info_user.map((info: any, index: number) => (
            
            <View key={index} className="mb-6 h-[65px] w-[45%] border-2 border-b-[3.5px] border-[#5f636f8d] rounded-xl flex-row items-center">
              
              {index === 0 && (
              <Ionicons name={info.icone} color={info.cor} size={30} className="self-start mt-2 -mr-1 ml-2" />
              )}
              
              {index === 1 && (
              <Ionicons name={info.icone} color={info.cor} size={30} className="self-start mt-2 -mr-1 ml-2" />
              )}

              {index === 2 && (
                <Text className="font-bold text-2xl self-start mt-1 ml-2">
                  {info.icone}
                </Text>
              )}

              {index === 3 && (
                <Pressable onPress={() => navigation.navigate('Ranking', {usuarioAtual: emailUserAtual})}>
                  <Image source={info.icone} className='h-[90%] w-[35px] self-start mt-1 ml-2' />
                </Pressable>
              )}

              <View className="ml-2">
                <Text className="font-bold text-2xl text-white">
                  {info.valor}
                </Text>
                <Text style={{color: "#737b7cba"}} className="text-lg">
                  {info.texto}
                </Text>
              </View>
            </View>
          
          ))}

        </View>

        {/* Receitas Favoritas do usuário */}
        {usuarioAtual === emailUserAtual && (
          <TouchableOpacity onPress={() => navigation.navigate('ReceitasFavoritas', {nome: nome, usuarioAtual: emailUserAtual})} className='self-center rounded-xl items-center justify-center border-2 border-b-[3.5px] border-sky-600 w-[50%] h-[50px] bg-sky-500'>
            <Text className='text-xl opacity-92 font-bold text-center text-white'>
              Receitas Favoritas
            </Text>
          </TouchableOpacity>
        )}

        {/* Conquistas */}
        <Text className="ml-4 mb-2 text-2xl font-extrabold opacity-95 text-white mt-6">Conquistas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="min-h-[125px] w-full ml-3" contentContainerClassName="flex-row">
          {conquistas.map((conquista: any) => (
            <View key={conquista.id}>
            <Image source={conquista.imagem} style={conquista.valor === 0 && {opacity: 0.4}} className='self-center w-[90px] h-[105px] mr-4' />
            {conquista.valor === 0 && (
              <Ionicons name="lock-closed-sharp" size={30} className="-mt-[85px] ml-[30.5px]" />
            )}
            </View>
          ))}
          {/* Se o usuário não tiver desbloqueado a conquista, vai mostrar um cadeado e a conquista com fundo vermelho */}
          {/* Se o usuário tiver desbloqueado a conquista, vai mostrar uma medalha e a conquista com fundo verde */}
        </ScrollView>

        {/* Seção de receitas criadas */}
        {!receitas_array && (
          <View>
            <Text className="ml-4 mb-2 text-2xl font-extrabold opacity-95 text-white mt-6">Suas Receitas</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="ml-2 mb-10">
                {quantReceitas === 0 && (
                  <Pressable onPress={() => Alert.alert(`É necessário criar mais ${3-quantReceitas} receita${3-quantReceitas !== 1 ? 's' : ''}!`)} className="flex-row">
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-xl w-36 p-3 mr-4 h-[100px]' />
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-xl w-36 p-3 mr-4 h-[100px]' />
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-xl w-36 p-3 mr-4 h-[100px]' />
                  </Pressable>
                )}
                {/* Se o usuário tiver nenhuma receita criada, mostra 3 receitas bloqueadas */}

                {quantReceitas === 1 && (
                  <Pressable onPress={() => Alert.alert(`É necessário criar mais ${3-quantReceitas} receita${3-quantReceitas !== 1 ? 's' : ''}!`)} className="flex-row">
                    <ImageBackground source={{uri: receitasUser[0].image}} 
                    className='rounded-xl items-center justify-center w-36 p-3 mr-4 h-[100px]' 
                    resizeMode='cover'
                    >
                      <LinearGradient
                        colors={['transparent', 'black']}
                        className='h-[100px] w-36 items-center justify-center'
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                      >
                        <Text className='text-white text-center mx-1 font-bold text-2xl'>
                          {receitasUser[0].title}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>

                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-xl w-36 p-3 mr-4 h-[100px]' />
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-xl w-36 p-3 mr-4 h-[100px]' />
                  </Pressable>
                )}
                {/* Se o usuário tiver uma receita criada, mostra 2 receitas bloqueadas e uma liberada */}

                {quantReceitas === 2 && (
                  <Pressable onPress={() => Alert.alert(`É necessário criar mais ${3-quantReceitas} receita${3-quantReceitas !== 1 ? 's' : ''}!`)} className="flex-row">
                    <ImageBackground source={{uri: receitasUser[0].image}} 
                    className='rounded-xl items-center justify-center w-36 p-3 mr-4 h-[100px]' 
                    resizeMode='cover'
                    >
                      <LinearGradient
                        colors={['transparent', 'black']}
                        className='h-[100px] w-36 items-center justify-center'
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                      >
                        <Text className='text-white text-center mx-1 font-bold text-2xl'>
                          {receitasUser[0].title}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>
                    
                    <ImageBackground source={{uri: receitasUser[1].image}} 
                    className='rounded-xl items-center justify-center w-36 p-3 mr-4 h-[100px]' 
                    resizeMode='cover'
                    >
                      <LinearGradient
                        colors={['transparent', 'black']}
                        className='h-[100px] w-36 items-center justify-center'
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}
                      >
                        <Text className='text-white text-center mx-1 font-bold text-2xl'>
                          {receitasUser[1].title}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>

                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-xl w-36 p-3 mr-4 h-[100px]' />
                  </Pressable>
                )}
                {/* Se o usuário tiver duas receitas criadas, mostra 1 receita bloqueada e duas liberadas */}
            </ScrollView>
          
          </View>
        )}
        {receitas_array && (
          <View>
            <Text className="text-2xl font-bold text-neutral-100 ml-4 mb-2">Suas receitas</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable className='rounded-xl items-center justify-center overflow-hidden w-36 p-3 mx-2 h-[100px]'>
                <ImageBackground source={{uri: receitasUser[0].image}}
                className='w-36 h-[100px] rounded-xl' 
                resizeMode='cover'
                > 
                  <LinearGradient
                  colors={['transparent', 'black']}
                  className='w-36 h-[100px] items-center justify-center'
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1.4}}
                  >
                    <Text className='text-white text-center mx-1 font-bold text-2xl'>
                      {receitasUser[0].title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>

              <Pressable className='rounded-xl items-center justify-center overflow-hidden w-36 p-3 mx-2 h-[100px]'>
                <ImageBackground source={{uri: receitasUser[1].image}}
                className='w-36 h-[100px] rounded-xl' 
                resizeMode='cover'
                > 
                  <LinearGradient
                  colors={['transparent', 'black']}
                  className='w-36 h-[100px] items-center justify-center'
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1.4}}
                  >
                    <Text className='text-white text-center mx-1 font-bold text-2xl'>
                      {receitasUser[1].title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
              
              <Pressable className='rounded-xl items-center justify-center overflow-hidden w-36 p-3 mx-2 h-[100px]'>
                <ImageBackground source={{uri: receitasUser[2].image}}
                className='w-36 h-[100px] rounded-xl' 
                resizeMode='cover'
                > 
                  <LinearGradient
                  colors={['transparent', 'black']}
                  className='w-36 h-[100px] items-center justify-center'
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1.4}}
                  >
                    <Text className='text-white text-center mx-1 font-bold text-2xl'>
                      {receitasUser[2].title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>

            </ScrollView>
            
            <Pressable onPress={() => navigation.navigate('ReceitasCriadas', {nome: nome, usuarioAtual: emailUserAtual})} className='mt-4 self-center rounded-xl items-center justify-center border-2 border-b-[3.5px] border-red-600 w-[50%] h-[50px] bg-red-500'>
              <Text className='text-xl opacity-92 font-bold text-center text-white'>
                Receitas Criadas
              </Text>
            </Pressable>

          </View>
        )}
        {/* Aqui é mostrado 3 receitas que o usuário criou */}

      </ScrollView>
        <View className='absolute -bottom-1'>
          <Barra />
        </View>
    </View>
  );

{/* 
  
  Componente Perfil é uma tela React Native/TypeScript que representa o perfil completo de um usuário dentro do aplicativo. Realiza 
diversas integrações com Firebase Realtime Database para buscar e atualizar informações como nome, imagem, XP, ranking, conquistas, 
receitas e relação de seguidores, além de usar Redux para sincronizar dados globais e gerenciar estados locais. Controla o modo 
imersivo, atualiza o login do usuário e exibe dinamicamente o progresso de cada seção do perfil. 

  A UI combina cards animados, modais de conquistas e cozinheiros desbloqueáveis, botões de seguir/deixar de seguir e navegação 
para outras telas (como Receitas e Conquistas). Serve como um centro visual e funcional do ecossistema social do app, conectando 
estatísticas, progressos e interações entre os usuários, além de ser possível mostrar o perfil do usuário logado ou outros perfis.

  Observações: é possível inserir, em algum lugar da tela, a informação do último login do usuário, que já está salva mas não é
usada; é sempre plausível adicionar ou remover algumas informações conforme o aplciativo se desenvolve e atualiza; a ação de seguir
usuário, adicionar amigos, seguir de volta e seguindo é controlada pelo status_usuario, mas o ideal é fazer esse controle pelo
Firebase. Se eu fosse levar o app à diante, com certeza mudaria o gerenciamento de estado.

*/}
};
 