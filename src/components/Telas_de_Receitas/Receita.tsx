import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, StatusBar, TouchableOpacity, Alert, ImageBackground, ScrollView, Modal, Pressable } from 'react-native';
import ImmersiveMode from 'react-native-immersive';
import { getDatabase, ref, get, set, update, onValue } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AvaliacaoReceita from './filtros/avaliacaoReceita';
import LoaderCompleto from '../loading/loadingCompleto';
import Barra from '../Barra/Barra';
import { useAppDispatch } from '../../reducers/hooks';
import { modificaBarra } from '../../reducers/barraReducer';


type Props = NativeStackScreenProps<TiposRotas, 'Receita'>

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);


export default function Receita({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  let { recipe } = route.params;
  const [No_de_Receita, setNo_de_Receita] = useState('');
  const [Media, setMedia] = useState(0);
  const [iniciar, setIniciar] = useState<boolean>(false);
  const [pausado, setPausado] = useState<boolean>(false);
  const [tempoMinutos, setTempoMinutos] = useState<number>(0);
  const [Comentario, setComentario] = useState(false);
  const [todosComentarios, setTodosComentarios] = useState([]);
  const [Avaliacao, setAvaliacao] = useState<boolean>(false);
  const [todasAvaliacoes, setTodasAvaliacoes] = useState([]);
  const [verificaRanking, setVerificaRanking] = useState<boolean>(false);
  const usuarioAtual = useRef<string>('');
  const emailB64 = useRef<string>('');
  const nome = useRef<string>('');
  const imagemPerfil = useRef<string>('');
  const [loadingMedia_e_User, setLoadingMedia_e_User] = useState<boolean>(true);
  const [loadingComentarios, setLoadingComentarios] = useState<boolean>(true);
  const [loadingAvaliacao, setLoadingAvaliacao] = useState<boolean>(true);
  const [loadingRanking, setLoadingRanking] = useState<boolean>(true);
  const [loadingBuscaImagem, setLoadingBuscaImagem] = useState<boolean>(false);
  const comentarioInputRef = useRef<TextInput>(null);
  const [comentarioUser, setComentarioUser] = useState<string>('');
  const [Comentario_ou_Avaliacao, setComentario_ou_Avaliacao] = useState<boolean>(true);
  const [jaAvaliou, setJaAvaliou] = useState<boolean>(false);
  const [jaConcluiu, setJaConcluiu] = useState<boolean>(false);

  useEffect(() => {
    // UseEffect para não ter nenhuma borda azulada na barra de telas.
    try {
      dispatch(modificaBarra(-1));
    } catch (error) {
      console.log('Erro no useEffect modificaBarra:', error);
    }
  }, []);
  // Tirando a borda azul da barra de telas.

  useEffect(() => {
    try {
      // Define se a receita foi gerada por um usuário ou se é uma receita do app.
      // A verificação é feita pelo email. Se não houver email, foi o aplicativo.
      // A verificação é importante para o nó do firebase, afinal, existe um nó para as receitas dos usuários e outro para as do app.
      ImmersiveMode.setImmersive(true);
      setLoadingMedia_e_User(true);

      let no_de_receita_state = ''; // Criei essa variável para usar nesse useEffect, já que o useState pode não ter renderizado.
      if (!recipe.email || recipe.email === '' || recipe.email === null) {
        setNo_de_Receita('ReceitasApp');
        no_de_receita_state = 'ReceitasApp'
      } else {
        setNo_de_Receita('ReceitasUsuarios');
        no_de_receita_state = 'ReceitasUsuarios'
      };
      
      async function pegarMedia(): Promise<void> {
        try {
          const refMedia = ref(db, `${no_de_receita_state}/${recipe.tipo}/${recipe.id}/avaliacao`);
          const snapshot = await get(refMedia);
          const dados = snapshot.val();
          const media = Number(dados.media);
          setMedia(media);
          // A média é o número de estrelas que a receita tem, e é calculada pelo número de avaliações.
        } catch (error) {
          console.log('Erro em pegarMedia:', error);
        }
      };
      pegarMedia();

      const user = onAuthStateChanged(authInstance, usuario => {
        try {
          if (!usuario || !usuario.email || !usuario.displayName || !usuario.photoURL) return;
          usuarioAtual.current = usuario.email;
          emailB64.current = Base64.encode(usuario.email);
          nome.current = usuario.displayName;
          imagemPerfil.current = usuario.photoURL;
        } catch (error) {
          console.log('Erro em onAuthStateChanged:', error);
        }
      });

      setLoadingMedia_e_User(false);

      return () => user();
    } catch (error) {
      console.log('Erro no useEffect de definição de nó da receita e user:', error);
    }
  }, [recipe, authInstance]);
  // Definindo nó da receita e pegando informações do user.

  const converterTempo = (timeString: string) => {
    try {
      // Converte o tempo da receita, para que seja mostrado corretamente no temporizador.
      const tempoString = timeString.split(' ');
      const numero = parseInt(tempoString[1]);
      setIniciar(true);
      setPausado(false); // inicia/despausa
      // Extrai apenas números.

      if (numero < 15) {
        setTempoMinutos(numero*60*60);
      } else {
        setTempoMinutos(numero*60);
      };
      // A receita só pode ter 1 hora, 2 horas+ ou algum intervalo entre 15 minutos e 45 minutos.
      // Portanto, se o número for menor que 15, assume que é hora, e multiplica mais uma vez por 60.
    } catch (error) {
      console.log('Erro em converterTempo:', error);
    }
  };

  useEffect(() => {
    try {
      // Função para contar o tempo do temporizador.
      if (!iniciar || pausado || tempoMinutos <= 0) return;
      const intervalId = setInterval(() => {
        setTempoMinutos((prev) => Math.max(prev - 1, 0));
      }, 1000);
      // para quando chegar em 0
      // Decrementa o tempo em 1 segundo a cada 1000 milissegundos (1 segundo).
      
      return () => clearInterval(intervalId);
    } catch (error) {
      console.log('Erro no useEffect do temporizador:', error);
    }
  }, [iniciar, pausado, tempoMinutos]);
  // Temporizador.
  
  // Separa os minutos dos segundos.
  const minutes = Math.floor(tempoMinutos / 60);
  const seconds = tempoMinutos % 60;
  //

  const adicionaComentario = async (comentario: string): Promise<void> => {
      // Função para adicionar comentário.
      try {
        const refAvaliacao = ref(db, `usuarios/${emailB64.current}/avaliacoes/${No_de_Receita}/${recipe.tipo}/${recipe.id}`);
        const snapshotAvaliacao = await get (refAvaliacao);
        if (!snapshotAvaliacao.exists()) {
          return Alert.alert('Avalie a receita primeiro')
        };
        const dados = snapshotAvaliacao.val();
        const nota = dados.avaliou;
        // Só permite que o usuário comente se ele já avaliou a receita.

        // Salva o comentário no banco de dados do usuário.
        const refReceitaUsuario = ref(db, `usuarios/${emailB64.current}/comentarios/${No_de_Receita}/${recipe.tipo}/${recipe.id}`)
        const snapshotReceitaUsuario = await get(refReceitaUsuario);
        if (!snapshotReceitaUsuario.exists()) {
        set(refReceitaUsuario, {
          1: {
            comentario: comentario,
            nota: nota,
          }
        });
        } else {
          const id = snapshotReceitaUsuario.numChildren();
          const refReceitaUsuarioID = ref(db, `usuarios/${emailB64.current}/comentarios/${No_de_Receita}/${recipe.tipo}/${recipe.id}/${id}`)
          update(refReceitaUsuarioID, {
            comentario: comentario,
            nota: nota,
          });
        };

        // Salva o comentário no banco de dados da própria receita.
        const refReceita = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/comentarios`);
        const snapshotReceita = await get (refReceita);
        if (!snapshotReceita.exists()) {
          set(refReceita, {
            1: {
              nome: nome.current,
              nota: nota,
              comentario: comentario,
              email: emailB64.current,
              imagemPerfil: imagemPerfil.current
            }
          });

        } else {
          const id = snapshotReceita.numChildren();
          const refNovoComentario = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/comentarios/${id}`);
          update(refNovoComentario, {
            nome: nome.current,
            nota: nota,
            comentario: comentario,
            email: emailB64.current,
            imagemPerfil: imagemPerfil.current
          });
        };

      setComentarioUser('');
      } catch (erro) {
        console.log('Erro em adicionaComentario', erro);
      };
      // Cria um nó de comentários com o nome de quem comentou, a nota que ele deu à receita e o próprio comentário.
  };
  // Função que adiciona comentário;

  useEffect(() => {
    try {
      // Função para buscar quem já comentou.
      setLoadingComentarios(true);

      if (!recipe || !recipe.id || !recipe.tipo || !No_de_Receita) return;

      const refComentarios = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/comentarios`);
      const ListenerComentarios = onValue(refComentarios, async (snapshotComentarios) => 
        {
          try {
            if (!snapshotComentarios.exists()) {
              return;
                // Caso não haja comentários, a função não faz nada.
            };
            const dados = snapshotComentarios.val();
            setTodosComentarios(dados.filter(Boolean));        
          } catch (error) {
            console.log('Erro no ListenerComentarios:', error);
          }
        });

      setLoadingComentarios(false);

      return () => ListenerComentarios();
    } catch (error) {
      console.log('Erro no useEffect buscar comentários:', error);
    }
  }, [recipe, No_de_Receita]);
  // Busca quem comentou.

  useEffect(() => {
    try {
      // Função para buscar quem já avaliou a receita.
      setLoadingAvaliacao(true);

      if (!recipe || !recipe.id || !recipe.tipo || !No_de_Receita) return;

      const refAvaliacao = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/avaliacao/quem_avaliou`);
      const ListenerAvaliacao = onValue(refAvaliacao, async (snapshotAvaliacoes) => 
        {
          try {
            if (!snapshotAvaliacoes.exists()) {
              return;
              // Caso não haja avaliações, a função não faz nada.
            };
            const dados = snapshotAvaliacoes.val();
            setTodasAvaliacoes(dados.filter(Boolean));        
          } catch (error) {
            console.log('Erro no ListenerAvaliacao:', error);
          }
        });

      setLoadingAvaliacao(false);

      return () => ListenerAvaliacao();
    } catch (error) {
      console.log('Erro no useEffect buscar avaliações:', error);
    }
  }, [recipe, No_de_Receita]);
  // Busca quem avaliou.

  useEffect(() => {
    try {
      // Verifica o ranking do usuário para permitir ou não comentar.
      if (!emailB64.current || !emailB64 || emailB64.current === '') return;
      setLoadingRanking(true);
      async function buscaRanking(): Promise<void> {
        try {
          const refRankingAtual = ref(db, `usuarios/${emailB64.current}`);
          const snapshotRankingAtual = await get (refRankingAtual);
          const dados = snapshotRankingAtual.val();
          const ranking = dados?.rankingAtual;
          if (ranking === 'NoRank') {
            setVerificaRanking(false);
          } else {
            setVerificaRanking(true);
            // É preciso ser ranking bronze para comentar, e o ranking bronze é o primeiro ranking que o usuário pode alcançar.
          };
        } catch (error) {
          console.log('Erro em buscaRanking:', error);
        }
      };
      buscaRanking();
      
      setLoadingRanking(false);
    } catch (error) {
      console.log('Erro no useEffect verificar ranking:', error);
    }
  }, [emailB64.current]);
  // Verifica o ranking do usuário.

  useEffect(() => {
    try {
      // UseEffect que verifica se o usuário já avaliou a receita.
      if (!nome || !emailB64.current || !No_de_Receita || !recipe) return;

      const refUsuario = ref(db, `usuarios/${emailB64.current}/avaliacoes/${No_de_Receita}/${recipe.tipo}`);
      const ListenerAvaliou = onValue(refUsuario, async (snapshot) => 
        {
          try {
            if (!snapshot.exists()) {
              setJaAvaliou(false);
              // Se o usuário não avaliou nenhuma receita desse tipo ou nó, o valor é false;
            } else {
              let dados = snapshot.val();
              dados = dados.filter(Boolean);
              const dadosFiltrados = dados.filter((avaliacao: any) => avaliacao.id == recipe.id);
              
              if (!dadosFiltrados || dadosFiltrados.length === 0) {
                setJaAvaliou(false);
              } else {
              setJaAvaliou(true);
              // Se o usuário já avaliou a receita, setamos para true
              };
            };
          } catch (error) {
            console.log('Erro no ListenerAvaliou:', error);
          }
        });

      return () => ListenerAvaliou();
    } catch (error) {
      console.log('Erro no useEffect verificar se já avaliou:', error);
    }
  }, [emailB64.current, recipe, No_de_Receita]);
  // Verifica se o usuário já avaliou a receita.

  const concluirReceita = async () => {
    try {
      const refConcluirReceita = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/quem_concluiu`);
      const snapshot = await get(refConcluirReceita);
      const idChildren = snapshot.exists() ? snapshot.numChildren() : 1;
      const refConcluirReceitaID = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/quem_concluiu/${idChildren}`);
      if (!snapshot.exists()) {
        set(refConcluirReceitaID, {
          email: emailB64.current
        });
      } else {
        update(refConcluirReceitaID, {
          email: emailB64.current
        });
      };
      setJaConcluiu(true);
    } catch (error) {
      console.log('Erro em concluirReceita:', error);
    }
  };
  // Função que atualiza quem concluiu a receita.

  useEffect(() => {
    try {
      if (!recipe || !No_de_Receita) return;
      
      async function buscaQuemConcluiu() {
        try {
          const refConcluirReceita = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/quem_concluiu`);
          const snapshot = await get(refConcluirReceita)
          if (!snapshot.exists()) return;
          const dados = snapshot.val();
          const quemConcluiu = dados.filter(Boolean);
          const usuario_concluiu = quemConcluiu.filter((usuario: any) => usuario.email === emailB64.current);
          if (usuario_concluiu.length === 0) return;
          else return setJaConcluiu(true);
        } catch (error) {
          console.log('Erro em buscaQuemConcluiu:', error);
        }
      };

      buscaQuemConcluiu();
    } catch (error) {
      console.log('Erro no useEffect buscaQuemConcluiu:', error);
    }
  }, [recipe, No_de_Receita]);
  // Verifica se o usuário já concluiu a receita.

  
  if (loadingComentarios || loadingAvaliacao || loadingMedia_e_User || loadingRanking || loadingBuscaImagem) return (
    <LoaderCompleto/>
  );

  if (Comentario) 
    return (
      <View className='flex-1 h-full bg-[#ff6e14ff]'>
          <Modal transparent visible={Comentario} onRequestClose={() => setComentario(false)} animationType='slide'>
              <View className='h-full'>
                  <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1.6}} className='h-full w-full items-center justify-center' colors={['#ff6e14ff', '#ff7a28ff']}>
                    <View className='min-h-[450px] min-w-[300px] items-start p-2 bg-white border-[4px] rounded-xl border-[#242222ff]'>
                      <Pressable onPress={() => {setComentario(false); setComentarioUser('');}}>
                        <Ionicons name="arrow-back-outline" size={34} color="#000000ff" />
                      </Pressable>
                      <Text className='text-2xl mt-4 ml-2 font-bold'>
                        Escreva seu comentário
                      </Text>
                      <Text className='text-2xl mb-4 ml-2 font-bold'>
                        ou apenas avalie a receita
                      </Text>
                      
                      <View className='flex-row items-center mb-2'>
                        <Image className='w-[60px] h-[60px] mr-2' source={{uri: imagemPerfil.current}} />
                        <Text className='text-lg font-medium'>
                          {nome.current}
                        </Text>
                      </View>

                      <View className='min-h-[100px] self-center items-center min-w-[90%] bg-gray-100 rounded-2xl'>
                        
                        <TextInput
                        ref={comentarioInputRef}
                        value={comentarioUser}
                        onChangeText={texto => setComentarioUser(texto)}
                        placeholder='Compartilhe sua opinião sobre a receita...'
                        placeholderTextColor={'#5b5a59ff'}
                        returnKeyType='done'
                        keyboardType='default'
                        className="text-lg min-h-[100px] max-h-[100px] min-w-[85%] max-w-[85%] font-semibold mx-1 text-gray-800"
                        multiline
                        submitBehavior='blurAndSubmit'
                        textAlignVertical='top'
                        />

                      </View>

                      <View className='flex-row items-center'>
                        <Text className='font-bold text-xl mx-2'>
                          Avaliação: 
                        </Text>
                        <AvaliacaoReceita nome={nome.current} usuarioAtual={emailB64.current} No_de_Receita={No_de_Receita} recipe={recipe} tamanho={25} />
                      </View>
                      
                      <TouchableOpacity    
                        onPress={() => {adicionaComentario(comentarioUser); setComentario(false);}}
                        className='w-[95%] rounded-xl mb-2 self-center'
                      >
                        <Text className="text-center text-xl p-2 bg-[#FF6C44] mx-4 border border-transparent rounded-lg font-bold text-white">
                          Publicar Comentário
                        </Text>
                      </TouchableOpacity>

                    </View>
                  </LinearGradient>
              </View>


          </Modal>
      </View>
    );

  if (Avaliacao) return (
    <View className='flex-1 h-full bg-[#ff6e14ff]'>
        <Modal transparent visible={Avaliacao} onRequestClose={() => setAvaliacao(false)} animationType='slide'>
            <View className='h-full'>
                <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1.6}} className='h-full w-full items-center justify-center' colors={['#ff6e14ff', '#ff7a28ff']}>
                  <View className='min-h-[30%] max-h-[30%] min-w-[80%] max-w-[80%] items-start p-2 bg-white border-[4px] rounded-xl border-[#242222ff]'>
                    <Pressable onPress={() => setAvaliacao(false)}>
                      <Ionicons name="arrow-back-outline" size={34} color="#000000ff" />
                    </Pressable>
                    
                    <View className='flex-row items-center'>
                      <Image className='w-[60px] h-[60px] mr-2' source={{uri: imagemPerfil.current}} />
                      <Text className='text-lg font-medium'>
                        {nome.current}
                      </Text>
                    </View>

                    <View className='items-center self-center'>
                      <AvaliacaoReceita nome={nome.current} usuarioAtual={emailB64.current} No_de_Receita={No_de_Receita} recipe={recipe} tamanho={45} />
                    </View>

                  </View>
                </LinearGradient>
            </View>
        </Modal>
    </View>
  );

  return (
    <ImageBackground 
    className='flex-1' 
    resizeMode='cover' 
    source={require('../../../assets/TelaPrincipal/capa2.png')}>
      <StatusBar/>
      <ScrollView contentContainerClassName='grow pb-[85px]'>
        <ImageBackground source={No_de_Receita === 'ReceitasApp' ? recipe.image : {uri: recipe.image}} className="w-full items-center justify-center h-[240px]">
          <LinearGradient
          colors={['transparent', 'black']}
          className='h-full w-full items-center justify-center'
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          >
          <Text style={{textShadowColor: 'black', textShadowRadius: 0.4}} className="text-3xl w-[90%] text-center text-white font-bold mt-12">{recipe.title}</Text>
          <View className="flex-row items-center w-[90%] justify-center">
            <Text style={{textShadowColor: 'black', textShadowRadius: 0.4}} className="mx-4 text-white text-xl text-center font-light">{recipe.autor}</Text>
            <Text style={{textShadowColor: 'black', textShadowRadius: 0.4}} className="mx-4 text-white text-xl text-center font-light">{recipe.time}</Text>
            <Text style={{textShadowColor: 'black', textShadowRadius: 0.4}} className="mx-4 text-white text-xl text-center font-light">{Media} ⭐</Text>
          </View>
          </LinearGradient>
        </ImageBackground>
        
        <View style={{elevation: 1, shadowColor: 'black'}} className={`w-[85%] min-h-[${55 + 35*recipe.ingredientes.length}px] bg-white -mt-10 self-center rounded-2xl`}>
          <LinearGradient
          colors={['transparent', 'rgba(255, 235, 223, 1)']}
          className={`min-h-[${55 + 35*recipe.ingredientes.length}px] w-full items-center justify-around self-center`}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 3}}
          >
          <Text className="text-xl font-semibold mt-5 mb-2.5 mx-4">Ingredientes</Text>
          {recipe.ingredientes.map((item: any, index: number) => (
            <View key={index} className="flex-row w-full items-center mr-4 ml-10 mb-2">
              <Ionicons name="checkmark-circle-sharp" size={24} color="#FF6C44" />
              <Text className="ml-1 text-lg text-center">
                {`${item.ing} ${item.quantidade} ${item.medida}`}
              </Text>
            </View>
          ))}
          </LinearGradient>
        </View>

        <View style={{elevation: 1, shadowColor: 'black'}} className={`w-[85%] overflow-hidden justify-around mt-10 h-[${10 + 60*recipe.passos.length}px] bg-white -mt-10 self-center rounded-2xl`}>
          <LinearGradient
          colors={['transparent', 'rgba(255, 235, 223, 1)']}
          className={`h-[${10 + 60*recipe.passos.length}px] w-full items-center justify-around self-center`}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 3}}
          >
          {recipe.passos.map((item: any, index: number) => (
            <View key={index} className="items-center ml-2 w-full mr-[2px] my-4">
                <View className='bg-[#FF6C44] border border-black/10 h-10 w-10 left-[6px] top-[4px] rounded-full justify-center absolute'>
                <Text className='text-center text-white text-xl font-semibold'>{index + 1}</Text>
                </View>
                  <View className='ml-10 max-w-[220px] min-w-[220px]'>
                  <Text style={{textShadowColor: 'white', textShadowRadius: 0.1}} className='font-bold text-start self-start text-xl'>
                    Passo {index + 1}
                  </Text>
                  <Text style={{textShadowColor: 'white', textShadowRadius: 0.1}} className="text-start italic self-start text-lg">
                    {item}
                  </Text>
                </View>
            </View>
          ))}
          </LinearGradient>
          
        </View>
            
        <View className="justify-start items-center ml-4 mt-4 mb-4 flex-row ">
          
          <TouchableOpacity
            className="h-14 w-[200px] justify-center"
            onPress={() => {
              if (!iniciar) {
                converterTempo(recipe.time);
              } else {
                setPausado(!pausado); // alterna pausa
              }
            }}
          >
            <Text style={{textShadowColor: 'rgba(60, 59, 59, 0.39)', textShadowRadius: 0.1}} className="text-center text-xl font-bold text-[#FF6C44] self-center">
              {!iniciar ? 'ATIVAR TEMPORIZADOR' : pausado ? 'CONTINUAR' : 'PAUSAR'}
            </Text>
          </TouchableOpacity>

          {!iniciar && (
            <View className="justify-center">
              <Image
                source={require('../../../assets/Receitas/clock.gif')}
                className="w-[100px] h-[100px] self-center mt-2"
              />
              <Text style={{textShadowColor: 'rgba(165, 162, 162, 0.66)', textShadowRadius: 0.1}} className="mb-2 text-center text-xl font-bold text-black">
                {recipe.time}
              </Text>
            </View>
          )}
          {iniciar && (
            <View className="justify-center">
              <Image
                source={require('../../../assets/Receitas/clock.gif')}
                className="w-[100px] h-[100px] self-center mt-2"
              />
              <Text style={{textShadowColor: 'rgba(165, 162, 162, 0.66)', textShadowRadius: 0.1}} className="mb-2 text-center text-xl font-bold text-black">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </Text>
            </View>
          )}

        </View>
        
        <View className='items-center flex-row justify-around mb-4'>
          
          <TouchableOpacity onPress={() => setComentario_ou_Avaliacao(!Comentario_ou_Avaliacao)} className={`${Comentario_ou_Avaliacao && "border-b-[2px] border-[#FF6C44]"} p-4 flex-row items-center`}>
            <Ionicons name="chatbox" color={Comentario_ou_Avaliacao ? "#FF6C44" : "#A3A3A3"} size={Comentario_ou_Avaliacao ? 30 : 26} />
            <Text className={`font-medium ml-1 ${Comentario_ou_Avaliacao ? "text-2xl" : "text-xl"} ${Comentario_ou_Avaliacao ? "text-black" : "text-neutral-400"}`}>
              Comentários
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setComentario_ou_Avaliacao(!Comentario_ou_Avaliacao)} className={`${!Comentario_ou_Avaliacao && "border-b-[2px] border-[#ffec5dff]"} p-4 flex-row items-center`}>
            <Ionicons name="star" color={!Comentario_ou_Avaliacao ? "#ffec5dff" : "#A3A3A3"} size={!Comentario_ou_Avaliacao ? 30 : 26} />
            <Text className={`font-medium ml-1 ${!Comentario_ou_Avaliacao ? "text-2xl" : "text-xl"} ${!Comentario_ou_Avaliacao ? "text-black" : "text-neutral-400"}`}>
              Avaliações
            </Text>
          </TouchableOpacity>

        </View>

        <View style={{elevation: 1, shadowColor: 'black'}} className={`max-w-[320px] max-h-[270px] min-w-[320px] min-h-[150px] mb-2 bg-white self-center rounded-2xl`}>
          
          {Comentario_ou_Avaliacao && ( 
          <>
          {!verificaRanking && (
            <View className='items-center p-1'>
              <Ionicons className="mt-1" name="nutrition" size={40} color={"#FF6C44"} />
              <Text className='font-bold italic text-5xl text-center mb-2'>
                Ooooops!
              </Text>
              <Text className='text-xl text-center mb-1'>
                É necessário ser ranking Bronze para poder comentar e ver os comentários!
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Ranking', {usuarioAtual: emailB64.current})}>
                <Text className='text-xl text-blue-400 text-center mb-4'>
                  Clique aqui para ver o seu ranking atual!
                </Text>
              </TouchableOpacity>

            </View>
          )}

          {verificaRanking && (
          <>

          {todosComentarios.length !== 0 && (
            <>
              <View className='flex-row justify-center mt-2 mb-4'>
                <Ionicons name="chatbox" size={24} color="rgba(74, 67, 67, 1)" />
                <Text className="text-center text-xl font-bold text-black text-shadow-black text-shadow-radius-[0.5] ml-4">
                  Comentários ({todosComentarios.length})
                </Text>
              </View>

              <ScrollView nestedScrollEnabled={true} contentContainerClassName="w-[290px] self-center">
                {todosComentarios.map((comentario: any, index: number) => (
                  <TouchableOpacity onPress={() => navigation.navigate('PerfilUsuario', {usuarioAtual: comentario.email, status_usuario: 'Outro'})} key={index} className='flex-row w-[290px] h-[80px] items-center justify-start'>
                    <Image className='w-[60px] h-[60px] mr-2' source={{uri: comentario.imagemPerfil}} />
                    <View className='max-w-[210px] justify-center max-h-[80px] h-full'>
                      <View className='flex-row'>
                        <Text className='text-lg font-bold mr-2'>
                          {comentario.nome}
                        </Text>

                        {Array.from({ length: comentario.nota }).map((_, i) => (
                          <Ionicons
                            key={i}
                            name="star"
                            size={20}
                            color="rgba(255, 227, 71, 1)"
                          />
                        ))}

                      </View>
                      <Text numberOfLines={2} className='text-sm mr-2 truncate max-h-[35px]'>
                        {comentario.comentario}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                
                onPress={() => setComentario(!Comentario)}
                className='w-[90%] rounded-xl mt-4 mb-2 self-center'
              >
                <Text className="text-center p-1.5 bg-[#FF6C44] mx-4 rounded-lg font-bold text-white">
                  Avaliar Receita
                </Text>
                  
              </TouchableOpacity>
            </>
          )}

          {todosComentarios.length === 0 && (
            <View className='items-center'>
              <Ionicons className="mt-2" name="chatbox" size={40} color={"#FF6C44"} />
              <Text className='font-bold text-3xl text-center mb-2'>
                Nenhum comentário ainda...
              </Text>
              <Text className='text-xl text-center mb-4'>
                Seja o primeiro a compartilhar sua experiência com esta receita!
              </Text>
              <TouchableOpacity
                
                onPress={() => setComentario(!Comentario)}
                className='w-[90%] rounded-xl mb-2 self-center'
              >
                <Text className="text-center p-1.5 bg-[#FF6C44] mx-4 border border-transparent rounded-lg font-bold text-white text-shadow-black text-shadow-radius-1">
                  Avaliar Receita
                </Text>
                  
              </TouchableOpacity>
            </View>
          )}

          </>
          )}
          </>
          )}

          {!Comentario_ou_Avaliacao && ( 
          <>
          
          {todasAvaliacoes.length !== 0 && (
            <>
              <View className='flex-row justify-center mt-2 mb-4'>
                <Ionicons name="sparkles" size={24} color="#ffec5dff" />
                <Text className="text-center text-xl font-bold text-black text-shadow-black text-shadow-radius-[0.5] ml-4">
                  Avaliações ({todasAvaliacoes.length})
                </Text>
              </View>

              <ScrollView nestedScrollEnabled={true} contentContainerClassName="w-[290px] self-center">
                {todasAvaliacoes.map((avaliacao: any, index: number) => (
                  <View key={index} className='flex-row w-[290px] h-[80px] items-center justify-start'>
                    <Image className='w-[60px] h-[60px] mr-2' source={{uri: avaliacao.imagemPerfil}} />
                    <View className='max-w-[210px] justify-around max-h-[80px] h-full'>
                      <View className='flex-row'>
                        <Text className='text-lg font-bold mr-2'>
                          {avaliacao.nome}
                        </Text>

                        {Array.from({ length: avaliacao.nota }).map((_, i) => (
                          <Ionicons
                            key={i}
                            name="star"
                            size={20}
                            color="rgba(255, 227, 71, 1)"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {!jaAvaliou && ((
                <TouchableOpacity
                  
                  onPress={() => setAvaliacao(!Avaliacao)}
                  className='w-[90%] rounded-xl mt-4 mb-2 self-center'
                >
                  <Text className="text-center p-1.5 bg-[#FF6C44] mx-4 rounded-lg font-bold text-white">
                    Avaliar Receita
                  </Text>
                    
                </TouchableOpacity>
              ))}

            </>
          )}

          {todasAvaliacoes.length === 0 && (
            <View className='items-center'>
              <Ionicons className="mt-2" name="star" size={40} color={"#ffec5dff"} />
              <Text className='font-bold text-3xl text-center mb-2'>
                Nenhuma avaliação ainda...
              </Text>
              <Text className='text-xl text-center mb-4'>
                Seja o primeiro a compartilhar sua experiência com esta receita!
              </Text>
              
              <TouchableOpacity
                onPress={() => setAvaliacao(!Avaliacao)}
                className='w-[90%] rounded-xl mb-2 self-center'
              >
                <Text className="text-center p-1.5 bg-[#FF6C44] mx-4 rounded-lg font-bold text-white">
                  Avaliar Receita
                </Text>
                  
              </TouchableOpacity>
            </View>
          )}
          </>
          )}

        </View>

        <TouchableOpacity disabled={jaConcluiu} onPress={() => concluirReceita()} className="h-[200px] mt-2 self-center w-[90%] mb-2 overflow-hidden">
          <Image
          source={!jaConcluiu ? require('../../../assets/Receitas/concluirReceita.png') : require('../../../assets/Receitas/receitaConcluida.png')}
          className='h-full w-full'
          />
        </TouchableOpacity>
       
      </ScrollView>
        <View className='absolute -bottom-1'>
          <Barra/>
        </View>
    </ImageBackground>
  );

{/* 
  
  Tela Receita em React Native/TypeScript que gerencia temporizador, comentários e avaliações de uma receita, integra Firebase 
Realtime Database e Auth para buscar dados do usuário, permite adicionar comentários e concluir receitas, exibe informações da 
receita (ingredientes, passos, autor, tempo, média de avaliações) com ImageBackground, LinearGradient e ScrollView, controla 
modais de comentário/avaliação e inclui barra inferior fixa com Redux.

  Observações: só é possível acessar os comentários sendo ranking Bronze; não

*/}
};
 