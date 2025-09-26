import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImmersiveMode from 'react-native-immersive';
import StarRating from '../acessorios/estrelas';
import StarComentario from '../acessorios/estrelas2';
import { getDatabase, ref, get, set, update } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import { BlurView } from '@react-native-community/blur';


const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app)


export default function ReceitaDetalhes({ route }) {
  const [passoAtual, setPassoAtual] = useState(0);
  const { recipe } = route.params;
  const [No_de_Receita, setNo_de_Receita] = useState('');
  const [Media, setMedia] = useState(0);
  const [iniciar, pausar] = useState(null);
  const [tempoMinutos, setTempoMinutos] = useState(null);
  const [Comentario, setComentario] = useState(false);
  const [opiniao, setOpiniao] = useState('');
  const [todosComentarios, setTodosComentarios] = useState([]);
  const [verificaRanking, setVerificaRanking] = useState(null);
 
    useEffect(() => {
      // Define se a receita foi gerada por um usuário ou se é uma receita do app.
      // A verificação é feita pelo autor da receita. Se for Mistura Boa, foi o app.
      // A verificação é importante para o nó do firebase, afinal, existe um nó para as receitas dos usuários e outro para as do app.
      if (recipe.autor == 'Mistura Boa') {
        setNo_de_Receita('ReceitasApp');
        async function pegarMedia1() {
        const refMedia = ref(db, `ReceitasApp/${recipe.tipo}/${recipe.id}/avaliacao`);
        const snapshot = await get(refMedia);
        const dados = snapshot.val();
        const media = Number(dados.media);
        setMedia(media);
        // A média é o número de estrelas que a receita tem, e é calculada pelo número de avaliações.
        }
        pegarMedia1();
      } else {
        setNo_de_Receita('ReceitasUsuarios');
        async function pegarMedia2() {
        const refMedia = ref(db, `ReceitasUsuarios/${recipe.tipo}/${recipe.id}/avaliacao`);
        const snapshot = await get(refMedia);
        const dados = snapshot.val();
        const media = Number(dados.media);
        setMedia(media);
        }
        pegarMedia2();
      }
        ImmersiveMode.setImmersive(true);
    }, [recipe]);

  const proximoPasso = () => {
    if (passoAtual < recipe.passos.length - 1) {
      setPassoAtual(passoAtual + 1);
    };
    // O passo atual só pode ser incrementado se não for o último passo da receita.
  };

  const passoAnterior = () => {
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1);
    };
    // O passo atual só pode ser decrementado se não for o primeiro passo da receita.
  };

  const adicionaFavorito = async (recipe) => {
    // Função que adiciona a receita em sua lista de favoritos.
    const emailB64 = Base64.encode(authInstance.currentUser.email);
    const refOriginal = ref(db, `usuarios/logados/${emailB64}/receitasFavoritas`);
    const snapshot = await get(refOriginal);

    let receitaFavoritada = false;

    if (snapshot.exists()) {
      const dados = Object.values(snapshot.val()).slice(1);
      const verifica_se_ja_existe = dados.some(r => r.id === recipe.id && r.tipo === recipe.tipo && r.autor === recipe.autor);
      receitaFavoritada = verifica_se_ja_existe;
      // Verifica se a receita que está prestes a ser favoritada já existe na lista de favoritos do usuário.
      // A verificação é feita analisando o id, tipo e autor, pois são os únicos atributos que diferenciam uma receita de outra.
      // O id pode ser o mesmo se o tipo for diferente, e o autor também pode ser o mesmo se o tipo for diferente.
      // Por isso é importante verificar os 3 ao mesmo tempo.
      // Se a receita já foi favoritada, retorna true; senão, false.
    }

    if (receitaFavoritada) {
      Alert.alert('Você já favoritou essa receita')
      return;
    }
    
    const idChildren = snapshot.exists() && snapshot.numChildren() > 0 ? snapshot.numChildren() : 1;
    const refID = ref(db, `usuarios/logados/${emailB64}/receitasFavoritas/${idChildren}`);
    update(refID, {
      ...recipe, 
      idUsuario: idChildren
    });
    // O campo idChildren serve para organizar as receitas favoritadas, uma vez que uma receita carnivora e vegana podem ter o mesmo id.
    Alert.alert('Receita Favoritada', 'A receita foi adicionada aos seus favoritos!');
  };

  const converterTempo = (timeString) => {
    
    // Converte o tempo da receita, para que seja mostrado corretamente no temporizador.
    const numero = parseInt(timeString);
    pausar(true);
        // Extrai apenas números

    if (numero < 15) {
      setTempoMinutos(numero*60*60);
    } else {
      setTempoMinutos(numero*60);
    };
    // A receita só pode ter 1 hora, 2 horas+ ou algum intervalo entre 15 minutos e 45 minutos.
    // Portanto, se o número for menor que 15, assume que é hora, e multiplica mais uma vez por 60.
  };

  useEffect(() => {
    // Função para contar o tempo do temporizador.
    if (tempoMinutos <= 0) {
      pausar(false);
      return;
    }; 
    // para quando chegar em 0

    const intervalId = setInterval(() => {
      setTempoMinutos((prev) => Math.max(prev - 1, 0));
    }, 1000);
    // Decrementa o tempo em 1 segundo a cada 1000 milissegundos (1 segundo).

    return () => clearInterval(intervalId);

  }, [tempoMinutos]);
  
  // Separa os minutos dos segundos.
  const minutes = Math.floor(tempoMinutos / 60);
  const seconds = tempoMinutos % 60;
  //

  const adicionaComentario = async () => {
    // Função para adicionar comentário.
    const refAvaliacao = ref(db, `usuarios/logados/${emailUsuario}/avaliacoes/${No_de_Receita}/${recipe.tipo}/${recipe.id}`);
    const snapshotAvaliacao = await get (refAvaliacao);
    if (!snapshotAvaliacao.exists()) {
      return Alert.alert('Avalie a receita primeiro')
    };
    const dados = snapshotAvaliacao.val();
    const nota = dados.avaliou;
    // Só permite que o usuário comente se ele já avaliou a receita.

    const refReceita = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/comentarios`);
    const snapshotReceita = await get (refReceita);
    const emailUsuario = Base64.encode(authInstance.currentUser.email);
    if (!snapshotReceita.exists()) {
      set(refReceita, {
        1: {
          nome: authInstance.currentUser.displayName,
          nota: nota,
          comentario: opiniao,
        }
      })
    } else {
      const id = snapshotReceita.numChildren();
      const refNovoComentario = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/comentarios/${id}`);
      update(refNovoComentario, {
        nome: authInstance.currentUser.displayName,
        nota: nota,
        comentario: opiniao,
      })
    }
    // Cria um nó de comentários com o nome de quem comentou, a nota que ele deu à receita e o próprio comentário.
  };

  useEffect(() => {
    // Função para buscar quem já comentou.
    if (!recipe || !recipe.id || !recipe.tipo || !No_de_Receita) return;
    async function buscaComentarios() {
      const refComentarios = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/comentarios`);
      const snapshotComentarios = await get (refComentarios);
      if (!snapshotComentarios.exists()) {
        return;
        // Caso não haja comentários, a função não faz nada.
      };
      const dados = snapshotComentarios.val();
      setTodosComentarios(dados.slice(1));
    };
    buscaComentarios();

  }, [recipe, No_de_Receita]);

  useEffect(() => {
    // Verifica o ranking do usuário para permitir ou não comentar.
    const emailAtual = Base64.encode(authInstance.currentUser.email)
    async function buscaRanking() {
      const refRankingAtual = ref(db, `usuarios/logados/${emailAtual}`);
      const snapshotRankingAtual = await get (refRankingAtual);
      const dados = snapshotRankingAtual.val();
      const ranking = dados.rankingAtual;
      console.log('ranking', ranking)
      if (ranking === 'NoRank') {
        setVerificaRanking(false);
      } else {
        setVerificaRanking(true);
        // É preciso ser ranking bronze para comentar, e o ranking bronze é o primeiro ranking que o usuário pode alcançar.
      };
    };
    buscaRanking();
  }, [authInstance]);
  

  return (

    <View style={[styles.container, {opacity: Comentario ? 0.3 : 1}]} animationType='fade'>
      <ScrollView>
        <Image source={recipe.imagem} style={styles.imagem} />
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>{recipe.nome}</Text>
          <TouchableOpacity onPress={() => adicionaFavorito(recipe)}>
            <Text style={{fontSize: 28}}>❤️</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginBottom: 10,}}>
          <StarRating emailB64 = {Base64.encode(authInstance.currentUser.email)} No_de_Receita = {No_de_Receita} recipe = {recipe}/>
          {/* O componente de estrelas é chamado, passando informações úteis */}
          <Text style={styles.avaliacao}>{Media} ⭐</Text>
        </View>

        <Text style={styles.autor}>Por {recipe.autor} • Pronto em {recipe.tempo}</Text>

        <Text style={styles.subtitulo}>Ingredientes</Text>
        {recipe.ingredientes.map((item, index) => (
          <View key={index} style={styles.ingrediente}>
            <Icon name={item.icone} size={24} color="#FF6C44" />
            <Text style={styles.ingredienteTexto}>
              {item.quantidade}x {item.ing}
            </Text>
          </View>
        ))}

        <Text style={styles.subtitulo}>Passo {passoAtual + 1}</Text>
        <Text style={styles.passoTexto}>{recipe.passos[passoAtual]}</Text>

        <View style={styles.botoesPasso}>
          <TouchableOpacity
            style={[styles.botaoPasso, { opacity: passoAtual === 0 ? 0.5 : 1 }]}
            onPress={passoAnterior}
            disabled={passoAtual === 0}
          >
            <Text style={styles.botaoTexto}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botaoPasso, { opacity: passoAtual === recipe.passos.length - 1 ? 0.5 : 1 }]}
            onPress={proximoPasso}
            disabled={passoAtual === recipe.passos.length - 1}
          >
            <Text style={styles.botaoTexto}>Próximo</Text>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent: 'space-between', marginHorizontal: 10, flexDirection: 'row'}}>
          <View>
            <FastImage 
              source ={require('../../../assets/clock.gif')}
              style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 10, marginBottom: 10 }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <TouchableOpacity
            style={{height: 40, width: 200}}
            onPress={() => converterTempo(recipe.time)}
            >
              <Text style={{textAlign: 'center', fontWeight: 'bold', color: '#FF6C44', textShadowColor: 'black', textShadowOffset: 0.5, textShadowRadius: 1,}}>
                ATIVAR TEMPORIZADOR
              </Text>
            </TouchableOpacity>
          </View>
          {!iniciar && (
            <View style={{justifyContent: 'center'}}>
              <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black', textShadowColor: 'black', textShadowOffset: 1, textShadowRadius: 0.5,}}>
                {recipe.time}
              </Text>
            </View>
          )}
          {iniciar && (
            <View style={{justifyContent: 'center'}}>
              <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black', textShadowColor: 'black', textShadowOffset: 1, textShadowRadius: 0.5, marginRight: 20}}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>

        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black', textShadowColor: 'black', textShadowOffset: 1, textShadowRadius: 0.5, marginHorizontal: 20}}>Seção de Comentários</Text>
          <View style={{marginBottom: 10, marginTop: 10,}}>
            <TouchableOpacity onPress={() => verificaRanking ? setComentario(!Comentario) : Alert.alert('É preciso ser ranking Bronze para poder comentar')}>
              <Text style={{textAlign: 'center', padding: 5, backgroundColor: '#FF6C44', marginHorizontal: 16, borderColor: 'rgba(0, 0, 0, 0)', borderWidth: 1, borderRadius: 10, fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowOffset: 0.5, textShadowRadius: 1,}}>Adicionar Comentário</Text>
            </TouchableOpacity>
            
            <Modal transparent visible={Comentario} animationType='fade'>
              <View style={{ height: '100%', justifyContent: 'center', flexGrow: 1, alignItems: 'center'}}>
                <View style={{height: 300, width: 300, justifyContent: 'center', alignItems: 'center', borderRadius: 25, borderWidth: 1, borderColor: 'black', backgroundColor: 'rgbrgb(243, 226, 139)'}}>
                    <TextInput 
                    value = {opiniao}
                    onChangeText={texto => setOpiniao(texto)}
                    placeholder='Digite o seu comentário'
                    placeholderTextColor='white'
                    style={{color: 'white', fontSize: 14}}
                    />
                </View>
                <TouchableOpacity onPress={() => {setComentario(!Comentario); adicionaComentario()}}>
                <Text style={{textAlign: 'center', paddingHorizontal: 100, paddingVertical: 8, backgroundColor: '#FF6C44', marginHorizontal: 16, borderColor: 'rgba(0, 0, 0, 0)', borderWidth: 1, borderRadius: 10, fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowOffset: 0.5, textShadowRadius: 1,}}>Publicar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setComentario(!Comentario)}>
                <Text style={{textAlign: 'center', paddingHorizontal: 100, paddingVertical: 8, backgroundColor: 'red', marginHorizontal: 16, borderColor: 'rgba(0, 0, 0, 0)', borderWidth: 1, borderRadius: 10, fontWeight: 'bold', color: 'white', textShadowColor: 'black', textShadowOffset: 0.5, textShadowRadius: 1,}}>Sair</Text>
                </TouchableOpacity>
              </View>
              
            </Modal>

            <View style={{marginVertical: 10, marginBottom: 100,}}>
              {todosComentarios.length !== 0 && (
                todosComentarios.map((Comentarios, index) => (
                  <View style={{width: 350, marginTop: 20, position: 'relative', overflow: 'hidden', borderRadius: 12}} key={index}>
                    {!verificaRanking && (
                    <BlurView
                      style={styles.absolute}
                      blurType="light" 
                      blurAmount={5}
                      reducedTransparencyFallbackColor="white"
                    />
                    )}
                    {/* Os comentários ficam borrados se o usuário não for ranking bronze */}
                   <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', }}>
                      <Text style={{textAlign: 'center', marginRight: 10, fontSize: 20, fontWeight: 'bold', color: '#FF6C44', textShadowColor: 'black', textShadowOffset: 1, textShadowRadius: 0.5, marginLeft: 10, marginTop: 5,}}> 
                        {Comentarios.nome}
                      </Text>
                      <StarComentario nota={Comentarios.nota}/>
                      {/* Neste caso, como as estrelas só servem como aspecto visual, um outro componente é chamado,
                        passando a nota que o usuário deu à receita.
                      */}
                    </View>
                      <Text style={{textAlign: 'center', marginRight: 10, fontSize: 15, fontWeight: 'bold', color: 'black', textShadowColor: 'black', textShadowOffset: 1, textShadowRadius: 0.5, marginLeft: 10,}}>
                      {Comentarios.comentario}
                      </Text>
                   </View>
                  </View>
              ))
              )}
              {!verificaRanking && (
                <View style={styles.overlayContent}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>🔒</Text>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Seja ranking Bronze para ler os comentários</Text>
                </View>
              )}
              {/* Só permite ver os comentários se o usuário for ranking Bronze */}
              {todosComentarios.length === 0 && verificaRanking && (
                <View style={{marginTop: 20, width: 350, height: 125, justifyContent: 'flex-end'}}>
                  <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'black', textShadowColor: 'black', textShadowOffset: 1, textShadowRadius: 0.5, marginHorizontal: 20}}>Sem Comentários</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff' },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12, 
    zIndex: 2 
  },
  overlayContent: {
    position: 'absolute',       
    top: '40%',                 
    left: 0,
    right: 0,
    alignItems: 'center',      
    zIndex: 3,                
    pointerEvents: 'none'      
  },
  imagem: { width: '100%', height: 200 },
  tituloContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  autor: { marginHorizontal: 16, color: '#666' },
  avaliacao: {
    marginBottom: 5,
    marginHorizontal: 16,
    fontWeight: 'condensedBold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 9,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  ingrediente: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  ingredienteTexto: { marginLeft: 10, fontSize: 16 },
  passoTexto: { fontSize: 16, marginHorizontal: 16, marginBottom: 10 },
  botoesPasso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 30,
  },
  botaoPasso: {
    backgroundColor: '#FF6C44',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold' },
  temporizador: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6C44',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 15,
    height: 90
  },
  temporizadorTexto: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
    modalContent: {
    backgroundColor: '#eaffea',
    borderRadius: 25,
    padding: 20,
    gap: 10,
  },
    overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 10,
    height: '100%',
  },
});
