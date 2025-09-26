import React, {useState, useEffect, useCallback} from 'react';
import "../../../global.css";
import { View, Text, Pressable, ScrollView, Image, Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged, signOut} from '@react-native-firebase/auth';
import { 
  QuantReceitas, DiasLogados_e_UltimoLogin_e_CriadoEm, QuantXP, 
  QuantSeguidores, QuantSeguindo, NomeUsuario, RankingUsuario } from './buscaDados';
import { getDatabase, ref, get, update, remove, set } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import ImmersiveMode from 'react-native-immersive';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import Barra from '../Barra/Barra';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import LoaderCompleto from '../loading/loadingCompleto';
 
type Props = NativeStackScreenProps<TiposRotas, 'PerfilUsuario'>
 
const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

dayjs.locale("pt-br");

export default function PerfilUsuario({route, navigation}: Props) {
  const controller = new AbortController();
  const api = axios.create({
    timeout: 15000,
    signal: controller.signal,
    baseURL: 'http://192.168.1.36:3000'
  });

  const [emailUserAtual, setEmailUserAtual] = useState<string>('');
  const [loadingReceita, setLoadingReceita] = useState<boolean>(true);
  const [loadingReceitaMostrar, setLoadingReceitaMostrar] = useState<boolean>(true);
  const [loadingConquista, setLoadingConquista] = useState<boolean>(true);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
  const [carnivoros, setCarnivoros] = useState<any>([]);
  const [veganos, setVeganos] = useState<any>([]);
  const [vegetarianos, setVegetarianos] = useState<any>([]);
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
  const [receitas_array, setReceitas_Array] = useState<boolean>(false);
  const [receitasUser, setReceitasUser] = useState<any>([]);
  const [cardCompletar, setCardCompletar] = useState<boolean>(false);
  const [info_user, setInfo] = useState<any>([]);
  const [status_seguir, setStatus_Seguir] = useState<any>([]); 
  
  const { status_usuario } = route.params;
  const [state_status_usuario, setStatus_Usuario] = useState<any>(status_usuario);
  // Transforma o status_usuario em uma variável de estado.

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
      // Pega as receitas carnívoras
      const refCarnivoro = ref(db, `usuarios/${usuarioAtual}/receitas/carnivoro`);
      const snapshotCarnivoro = await get(refCarnivoro);
      if (snapshotCarnivoro.exists()) { 
        setCarnivoros(snapshotCarnivoro.val().slice(1));
      };

      // Pega as receitas veganas
      const refVegano = ref(db, `usuarios/${usuarioAtual}/receitas/vegano`);
      const snapshotVegano = await get(refVegano);
      if (snapshotVegano.exists()) {
        setVeganos(snapshotVegano.val().slice(1));
      }
      
      // Pega as receitas vegetarianas
      const refVegetariano = ref(db, `usuarios/${usuarioAtual}/receitas/vegetariano`);
      const snapshotVegetariano = await get(refVegetariano);
      if (snapshotVegetariano.exists()) {
        setVegetarianos(snapshotVegetariano.val().slice(1));
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

      const DiasLogados_e_UltimoLogin_e_CriadoEm_ = await DiasLogados_e_UltimoLogin_e_CriadoEm(usuarioAtual);
      const diasLogados_ = DiasLogados_e_UltimoLogin_e_CriadoEm_.diasLogados;
      const criadoEm_ = DiasLogados_e_UltimoLogin_e_CriadoEm_.criadoEm;
      const ultimoLogin_ = DiasLogados_e_UltimoLogin_e_CriadoEm_.ultimoLogin;
      setDiasLogados(diasLogados_);
      setCriadoEm(`Cozinheiro desde ${dayjs(criadoEm_).format("MMMM [de] YYYY")}`);
      setUltimoLogin(`O usuário não cozinha desde ${dayjs(ultimoLogin_).format("MMMM [de] YYYY")}`);

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
    if (
      !carnivoros ||
      !veganos ||
      !vegetarianos ||
      carnivoros.length <= 0 ||
      veganos.length <= 0 ||
      vegetarianos.length <= 0
    ) {
      setLoadingReceitaMostrar(false);
      return;
    }
    const soma = carnivoros.length + veganos.length + vegetarianos.length;
    if (soma >= 3) {
        Receitas_a_mostrar();
        setReceitas_Array(true);
        // Só chama a função Receitas_a_mostrar se houver, ao menos, 3 receitas.
    } else {
        setReceitas_Array(false);
        setLoadingReceitaMostrar(false);
    };

  }, [carnivoros, veganos, vegetarianos]);
  {/* Verificando se o usuário têm três receitas ou não */}

  const Receitas_a_mostrar = () => {
    // Função que mostra 3 receitas aleatórias do usuário.
    // É um função relativamente grande, mas o grande intuito dela é , em primeiro, pegar as receitas carnívoras, veganas e vegetarinas.
    // Depois, verifica se há receitas de todos os tipos. Caso haja, pega uma de cada.
    // Caso não haja, verifica quais tipos há e tenta pegar uma receita de cada tipo que houver.
    // Caso haja apenas um tipo de receita, pega 3 receitas desse tipo.
    // Existe uma outra função (numeroAleatorio) que gera um número aleatório baseado no tamanho do array de receitas.
    // Obs: o usuário PRECISA ter, ao menos, 3 receitas.

    try {

    const NumeroCarnivoro = numeroAleatorio(carnivoros.length);
    const NumeroVegano = numeroAleatorio(veganos.length);
    const NumeroVegetariano = numeroAleatorio(vegetarianos.length);
    if (
      carnivoros.length > 0 &&
      veganos.length > 0 &&
      vegetarianos.length > 0
    ) {
      setReceitasUser([carnivoros[NumeroCarnivoro], veganos[NumeroVegano], vegetarianos[NumeroVegetariano]]);
      // Se houver receitas de todos os tipos, pega uma de cada.
    } else if (
      carnivoros.length > 0 &&
      veganos.length > 0
    ) {
      // Se houver receitas carnívoras e veganas, pega, pelo menos, uma de cada.
        if (carnivoros.length > 1 && veganos.length === 1) {
          setReceitasUser([carnivoros[NumeroCarnivoro], 
            veganos[NumeroVegano], 
            carnivoros[ NumeroCarnivoro === 0 ? NumeroCarnivoro + 1 : NumeroCarnivoro - 1 ]]);
        } else if (carnivoros.length === 1 && veganos.length > 1) {
            setReceitasUser([veganos[NumeroVegano], 
              carnivoros[NumeroCarnivoro], 
              veganos[ NumeroVegano === 0 ? NumeroVegano + 1 : NumeroVegano - 1 ]]);
        } else {
            setReceitasUser([carnivoros[NumeroCarnivoro], veganos[NumeroVegano], 
              carnivoros.length > veganos.length ? carnivoros[ NumeroCarnivoro === 0 ? NumeroCarnivoro + 1 : NumeroCarnivoro - 1 ]
            : 
            carnivoros.length < veganos.length ? veganos[ NumeroVegano === 0 ? NumeroVegano + 1 : NumeroVegano - 1 ]
            :
            Math.random() < 0.5 ? carnivoros[ NumeroCarnivoro === 0 ? NumeroCarnivoro + 1 : NumeroCarnivoro - 1 ]
            : veganos[ NumeroVegano === 0 ? NumeroVegano + 1 : NumeroVegano - 1 ]
          ]);
        };
        // Faz mais uma verificação para saber se uma das receitas tem exatamente 1 receita.
        // Por exemplo: se Veganos tiver só uma receita, pega uma receita vegana e duas Carnívoras. E vice-versa.
        // Senão, pega uma de cada, e por fim, pega mais uma receita do tipo que tiver mais receitas entre si.
        // Se a quantidade de receitas for igual, usa o Math.random para definir se a receita será Carnívora ou Vegana.
    
    } else if (
      carnivoros.length > 0 &&
      vegetarianos.length > 0 
    ) {
          if (carnivoros.length > 1 && vegetarianos.length === 1) {
            setReceitasUser([carnivoros[NumeroCarnivoro], 
              vegetarianos[NumeroVegetariano], 
              carnivoros[ NumeroCarnivoro === 0 ? NumeroCarnivoro + 1 : NumeroCarnivoro - 1 ]]);
          } else if (carnivoros.length === 1 && vegetarianos.length > 1) {
              setReceitasUser([vegetarianos[NumeroVegetariano], 
                carnivoros[NumeroCarnivoro], 
                vegetarianos[ NumeroVegetariano === 0 ? NumeroVegetariano + 1 : NumeroVegetariano - 1 ]]);
          } else {
            setReceitasUser([carnivoros[NumeroCarnivoro], vegetarianos[NumeroVegetariano], carnivoros.length > vegetarianos.length ? carnivoros[ NumeroCarnivoro === 0 ? NumeroCarnivoro + 1 : NumeroCarnivoro - 1 ]
            : 
            carnivoros.length < vegetarianos.length ? vegetarianos[ NumeroVegetariano === 0 ? NumeroVegetariano + 1 : NumeroVegetariano - 1 ]
            :
            Math.random() < 0.5 ? carnivoros[ NumeroCarnivoro === 0 ? NumeroCarnivoro + 1 : NumeroCarnivoro - 1 ]
            : vegetarianos[ NumeroVegetariano === 0 ? NumeroVegetariano + 1 : NumeroVegetariano - 1 ]
          ]);
        };
          // Faz o mesmo, mas com Carnívoras e Vegetarianas.

    } else if (
      vegetarianos.length > 0 &&
      veganos.length > 0
    ) {
          if (veganos.length > 1 && vegetarianos.length === 1) {
            setReceitasUser([veganos[NumeroVegano], 
              vegetarianos[NumeroVegetariano], 
              veganos[ NumeroVegano === 0 ? NumeroVegano + 1 : NumeroVegano - 1 ]]);
          } else if (veganos.length === 1 && vegetarianos.length > 1) {
              setReceitasUser([vegetarianos[NumeroVegetariano], 
                veganos[NumeroVegano], 
                vegetarianos[ NumeroVegetariano === 0 ? NumeroVegetariano + 1 : NumeroVegetariano - 1 ]]);
          } else {
            setReceitasUser([vegetarianos[NumeroVegetariano], veganos[NumeroVegano], vegetarianos.length > veganos.length ? vegetarianos[ NumeroVegetariano === 0 ? NumeroVegetariano + 1 : NumeroVegetariano - 1 ]
            : 
            vegetarianos.length < veganos.length ? veganos[ NumeroVegano === 0 ? NumeroVegano + 1 : NumeroVegano - 1 ]
            :
            Math.random() < 0.5 ? vegetarianos[ NumeroVegetariano === 0 ? NumeroVegetariano + 1 : NumeroVegetariano - 1 ]
            : veganos[ NumeroVegano === 0 ? NumeroVegano + 1 : NumeroVegano - 1 ]
          ]);
        };
          // Faz o mesmo, mas com Vegetarianas e Veganas.

    } else if (
      carnivoros.length > 0
    ) {
      NumeroCarnivoro === 0 ? setReceitasUser([carnivoros[NumeroCarnivoro],
      carnivoros[NumeroCarnivoro + 1],
      carnivoros[NumeroCarnivoro + 2],
    ]) 
    : 
    NumeroCarnivoro === 1 ?  setReceitasUser([carnivoros[NumeroCarnivoro - 1],
      carnivoros[NumeroCarnivoro],
      carnivoros[NumeroCarnivoro + 1],
    ])
    :
    setReceitasUser([carnivoros[NumeroCarnivoro - 2],
      carnivoros[NumeroCarnivoro - 1],
      carnivoros[NumeroCarnivoro],
    ]);
    // Se houver apenas receitas carnívoras, pega 3 receitas carnívoras.
    // Há mais verificações para evitar erros, como pegar uma receita que não existe. Por exemplo, se o carnivoros.length for 5,
    // o NumeroCarnivoro pode ser 0, 1, 2, 3 ou 4.
    // No caso, se o número aleatório for 0, pega a receita 0, 1 e 2.
    // Se o número aleatório for 1, pega a receita 0, 1 e 2 também, mas evita pegar a receita -1, que não existe.
    // Se o número aleatório for 2, pega a receita 0, 1 e 2 também, mas evita pegar a receita -1 ou -2, que não existem.
      
    } else if (
      vegetarianos.length > 0
    ) {
      NumeroVegetariano === 0 ? setReceitasUser([vegetarianos[NumeroVegetariano],
      vegetarianos[NumeroVegetariano + 1],
      vegetarianos[NumeroVegetariano + 2],
    ]) 
    : 
    NumeroVegetariano === 1 ?  setReceitasUser([vegetarianos[NumeroVegetariano - 1],
      vegetarianos[NumeroVegetariano],
      vegetarianos[NumeroVegetariano + 1],
    ])
    :
    setReceitasUser([vegetarianos[NumeroVegetariano - 2],
      vegetarianos[NumeroVegetariano - 1],
      vegetarianos[NumeroVegetariano],
    ]);
    // Faz o mesmo, mas com receitas vegetarianas.
      
    } else if (
      veganos.length > 0
    ) {
      NumeroVegano === 0 ? setReceitasUser([veganos[NumeroVegano],
      veganos[NumeroVegano + 1],
      veganos[NumeroVegano + 2],
    ])
    :
    NumeroVegano === 1 ?  setReceitasUser([veganos[NumeroVegano - 1],
      veganos[NumeroVegano],
      veganos[NumeroVegano + 1],
    ])
    :
    setReceitasUser([veganos[NumeroVegano - 2],
      veganos[NumeroVegano - 1],
      veganos[NumeroVegano],
    ]);
    // Faz o mesmo, mas com receitas veganas.

    };
    setLoadingReceitaMostrar(false);
  } catch (erro: unknown) {
        if (erro instanceof Error) console.log('Erro comum Receitas:', erro.message);
        else
        console.log('Erro desconhecido:', erro);
      };
  };

  const numeroAleatorio = (array: number) => {
    return Math.floor(Math.random() * array);
  };

  const removerSeguidor = useCallback(async () => {
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
  }, [state_status_usuario]);

  const SeguirUsuario = useCallback(async (): Promise<void> => {
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
    
        if (!snapshot.exists() || snapshot.exists()) {
          set(refSeguindo, {
            nome: nome,
            email: Base64.decode(usuarioAtual),
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
  }, [state_status_usuario]);

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

  return (
    <View className="bg-[#132022] flex-1">
      <ScrollView contentContainerClassName="grow pb-[250px] pt-2">
        <View className="absolute top-6 right-6">
          <Text className="text-[20px]">⚙️</Text>
        </View>
        {/* Cabeçalho com imagem/ícone do avatar */}
        <View className='w-full h-1/4 bg-white'>
        <Pressable onPress={async () => await signOut(authInstance)}>
        <Image 
        source={require('../../../assets/Perfil/user.jpg')}
        className='w-full h-full'
        />
        </Pressable>
        </View>

        {/* Nome e usuário */}
        <Text style={{fontFamily: "monospace"}} 
        className="text-xl font-bold text-white text-start ml-8 mt-4">
          {nome}</Text>
        <Text style={{fontFamily: "monospace"}} className="text-lg text-yellow-700 tracking-tight text-start ml-8">
          {criadoEm}
        </Text>

        {/* Número de seguidores/seguindo/receitas Criadas */}
        <Pressable className="flex-row justify-around mt-8 mb-8"
        onPress={() => navigation.navigate('AdicionarAmigos', {usuarioAtual, nome})}>
          <Text style={{fontFamily: "monospace"}}  className="text-lg font-bold text-white text-center">
            {seguindo}{'\n'}Segue
          </Text>
          <Text style={{fontFamily: "monospace"}}  className="text-lg font-bold text-white text-center">
            {seguidores}{'\n'}Seguidores
          </Text>
        </Pressable>

        {/* Botão adicionar amigos */} 
        <Pressable style={{backgroundColor: status_seguir.corBG}} 
        className='bg-sky-500 elevation-1 self-start flex-row w-[65%] ml-8 items-center justify-center h-[42px] rounded-xl mb-5' 
        onPress={() => status_usuario ===  'Seguir de volta!' ? SeguirUsuario() : status_usuario === 'Seguindo' ? removerSeguidor()
          : status_usuario === 'Não Segue' ? SeguirUsuario() : false}>
          <Ionicons name={status_seguir.icone} color={status_seguir.iconeCor} size={24} />
          <Text style={{textShadowColor: 'gray', textShadowRadius: 0.2, color: status_seguir.corTexto}} 
          className='ml-2 text-xl text-center font-bold' >{status_seguir.texto}</Text>
        </Pressable>

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
                    className='rounded-lg w-36 p-3 mr-4 h-[100px]' />
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-lg w-36 p-3 mr-4 h-[100px]' />
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-lg w-36 p-3 mr-4 h-[100px]' />
                  </Pressable>
                )}
                {/* Se o usuário tiver nenhuma receita criada, mostra 3 receitas bloqueadas */}

                {quantReceitas === 1 && (
                  <Pressable onPress={() => Alert.alert(`É necessário criar mais ${3-quantReceitas} receita${3-quantReceitas !== 1 ? 's' : ''}!`)} className="flex-row">
                    <View className="bg-[#fff7ec] rounded-xl p-3 mr-3 items-center w-36">
                      <Text className="text-[30px] mb-1">🍽️</Text>
                    </View>
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-lg w-36 p-3 mr-4 h-[100px]' />
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-lg w-36 p-3 mr-4 h-[100px]' />
                  </Pressable>
                )}
                {/* Se o usuário tiver uma receita criada, mostra 2 receitas bloqueadas e uma liberada */}

                {quantReceitas === 2 && (
                  <Pressable onPress={() => Alert.alert(`É necessário criar mais ${3-quantReceitas} receita${3-quantReceitas !== 1 ? 's' : ''}!`)} className="flex-row">
                    <View className="bg-[#fff7ec] rounded-xl p-3 mr-3 items-center w-36">
                      <Text className="text-[30px] mb-1">🍽️</Text>
                    </View>
                    <View className="bg-[#fff7ec] rounded-xl p-3 mr-3 items-center w-36">
                      <Text className="text-[30px] mb-1">🍽️</Text>
                    </View>
                    <Image source={require('../../../assets/Perfil/receitaBloqueada.png')} 
                    className='rounded-lg w-36 p-3 mr-4 h-[100px]' />
                  </Pressable>
                )}
                {/* Se o usuário tiver duas receitas criadas, mostra 1 receita bloqueada e duas liberadas */}
            </ScrollView>
          
          </View>
        )}
        {receitas_array && (
          <View>
            <Text className="text-[15px] font-bold text-[#333] mb-2">Suas receitas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mb-10">
            {receitasUser.map((receita: any, index: number) => (
              <View key={index} className="bg-[#fff7ec] rounded-xl p-3 mr-3 items-center w-36">
                <Text className="text-[30px] mb-1">🍽️</Text>
                <Text className="text-[13px] font-bold text-[#333] text-center">{receita.title}</Text>
              </View>
            ))}
              <Pressable onPress={() => false}>
              <View className="bg-[#fff7ec] rounded-xl p-3 mr-3 items-center w-36 justify-center">
                <Text className="text-[13px] font-bold text-[#333] text-center">Clique para ver todas as receitas!</Text>
              </View>
              </Pressable>
            </ScrollView>
          </View>
        )}
        {/* Aqui é mostrado 3 receitas que o usuário criou */}

          

      </ScrollView>
        <View className='absolute -bottom-1'>
          <Barra />
        </View>
    </View>
  );
};
 