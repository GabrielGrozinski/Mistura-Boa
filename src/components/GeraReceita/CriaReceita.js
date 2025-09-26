import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity,
   Button, StyleSheet, ScrollView, PermissionsAndroid, Platform, 
   Alert} from 'react-native';
import ImmersiveMode from 'react-native-immersive';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get, set, update } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { launchImageLibrary } from 'react-native-image-picker';


const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);


export default function ReceitaDetalhes() {
  const navigation = useNavigation();
  const [passoAtual, setPassoAtual] = useState(0);
  const [cont, setCont] = useState(0)
  const [titulo, setTitulo] = useState('');
  const [tempo, setTempo] = useState(0);
  const [tipo, setTipo] = useState(1);
  const [imagem, setImagem] = useState(null);
  const user = authInstance.currentUser.displayName;
  const [minuto_hora, setMinuto_Hora] = useState(true);
  const [passos, setPassos] = useState([]);
  const [dif, setDif] = useState(0);
  const [desc, setDesc] = useState('');
  const [ingredientes, setIngredientes] = useState([
    {
    id: 1,
    ing: '',
    quantidade: 1,
    },
  ]);

    
  useEffect(() => {
      ImmersiveMode.setImmersive(true);
  }, []);

  const ativarPermissao = async () => {
      // Função para permitir o acesso à galeria de imagens.
      if (Platform.OS !== 'android') return true;
      // Para sistemas operacionais diferente do android, permite automaticamente.

      try {
        const permitir = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Permissão para adicionar imagens',
            message: 'Precisamos da sua permissão para adicionar imagens.',
            buttonPositive: 'Permitir',
          }
        );
        return permitir === PermissionsAndroid.RESULTS.GRANTED;
      } catch (erro) {
        console.warn('Erro ao conceder permissão:', erro);
        return false;
      };
  };

  const escolherImagem = async () => {
      // Função para escolher uma imagem da galeria.
      const permitir = await ativarPermissao();
      if (!permitir) {
        Alert.alert('Sem permissão para adicionar imagens');
        return;
      };
      // Se a permissão for concedida, abre a galeria de imagens.

      try {
          const resultado = await new Promise((resolve, reject) => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 1,
              },
              (response) => {
                if (response.didCancel) {
                  reject('Usuário cancelou');
                } else if (response.errorCode) {
                  reject(`Erro: ${response.errorMessage}`);
                } else {
                  resolve(response);
                }
              }
            );
          });

          const imagemEscolhida = {uri: resultado.assets?.[0].uri} ;
          setImagem(imagemEscolhida);
          
      } catch (erro) {
          console.log(erro);
          Alert.alert('Erro', String(erro));
      };
  };

  const uploadImagem = async (imagemEscolhida) => {
      // Aqui estaria o código para fazer o upload da imagem escolhida para o Firebase Storage
  };
  
  const proximoPasso = () => {
    // Função para avançar para o próximo passo.
    if (passoAtual === cont) {
      setPassoAtual(passoAtual + 1);
      setCont(cont + 1)
    };
  };

  const passoAnterior = () => {
    // Função para voltar ao passo anterior.
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1);
      setCont(cont - 1)
    };
  };

  const adicionaIngrediente = () => {
    // Função para adicionar um novo ingrediente.
    let id_novo = 0;
    id_novo = (ingredientes.length + 1);
    // O id é calculado com base na quantidade de ingredientes.

    let novo_ingrediente = [...ingredientes, {
    id: id_novo,
    ing: '',
    quantidade: 1,
    }, 
    ];
    setIngredientes(novo_ingrediente);
};

  const minutosParaHorasEMinutos = (minutos) => {
    // Função para converter minutos em horas e minutos.
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h >= 2) {
      return "2 horas+ ⏱️";
    } else if (h >= 1 && m < 30) {
      return `1 hora+ ⏱️`;
    } else if (h < 1 && m < 22) {
      return `15 minutos ⏱️`;
    } else if (h < 1 && m < 38) {
      return `30 minutos ⏱️`;
    } else if (h < 1 && m < 52) {
      return `45 minutos ⏱️`;
    } else if (h >= 1 && m >= 30 ) {
      return `2 horas+ ⏱️`;
    };
  };

  const ajustarId = () => {
    // Função para ajustar o id das receitas.
    // A função serve para corrigir alguns erros.
    // Por exemplo, se o usuário criar dois ingredientes, depois apagar o segundo ingrediente, e criar um novo, 
    // o id do novo ingrediente vai ser 3, ou seja, terremos duas receitas, com id 1 e 3, o que não é o ideal.
    // Portanto, após o usuário colocar todos os ingredientes desejados, a função irá ajustar os ids para que fiquem sequenciais.
    let ingredienteFiltrado = ingredientes.filter(item => item.ing !== '')
    let ingredienteNovo = ingredienteFiltrado.map((item, index) => 
      index == item.id ? item : {...item, id: index}
      );
    setIngredientes(ingredienteNovo);
    return ingredientes;
  };

  const UnirReceita_ao_Usuario = async (informacoes, carnivoro_vegetariano_vegano) => {
    // Função responsável por unir a receita criada ao usuário que a criou.
    // A função é separada em muitas partes.
    
    // Verifica Receita
    
    const refQuantReceitas = ref(db, `usuarios/logados/${emailB64}`);
    const snapshotReceitas = await get(refQuantReceitas);
    const dados = snapshotReceitas.val();
    const quantidade = dados?.quantReceitas || 0;
    const novaQuantidade = quantidade + 1;
    const idUsuario = novaQuantidade;
    await update(refQuantReceitas, {
        quantReceitas: novaQuantidade
    });
    // Verifica quantas receitas já foram criadas e adiciona mais uma.

    // Adiciona Receita
    
    const emailB64 = Base64.encode(authInstance.currentUser.email);
    const refReceita_original = ref(db, `usuarios/logados/${emailB64}/receitas/${carnivoro_vegetariano_vegano}`);
    // O nó onde a receita é criada. Isso é, dentro do nó do próprio usuário.

    const snapshot = await get(refReceita_original);
    const idChildren = snapshot.exists() && snapshot.numChildren() > 0 ? 
    snapshot.numChildren() : 1;
    const refReceitaAdicionar = ref(db, `usuarios/logados/${emailB64}/receitas/${carnivoro_vegetariano_vegano}/${idChildren}`);
    await update(refReceitaAdicionar, {...informacoes, idUsuario: idUsuario, idReceitaUsuario: idChildren});
    // São criados dois novos identificadores. Um identificador para as receitas daquele tipo e para todas as receitas do usuário.
    // O idReceitaUsuario (idChildren) é responsável, por exemplo, por separar as receitas carnívoras, ou só as receitas veganas, ou
    // só as vegetarianas. Enquanto isso o idUsuario separa todas as três receitas.
    // Isso é feito pois o id original da receita não é interessante de ser usado como identificador em um possível map.
    // Por exemplo, um usuário pode ter criado três receitas carnívoras, (idChildren seria 1, 2, 3), mas elas terem ids completamente...
    // ...diferentes. Uma pode ter id 20, outra 50 e outra 1000, já que os ids são feitos com base nas receitas de TODOS os usuários.
    // E no caso do idUsuario, imagine que um usuário tenha criado uma receita de cada tipo. O idChildren delas seria igual.
    // Por isso a necessidade do idUsuario. Ele é calculado com base na quantidade de receitas, e serve para todas as receitas.    

    // Atualizar Ranking

    try {
      if (novaQuantidade === 10) {
        const refRankingBronze = ref(db, `usuarios/logados/${emailB64}/ranking/bronze`);
        update(refRankingBronze, {
            'receita_criada_10': 1,
        });
        // Se houver 10 receitas criadas, atualiza o ranking.
        // O mesmo padrão é repetido em todos os outros rankings.

        await PassarXP(250);
        // A cada requisito de ranking atingido, o usuário recebe uma quantidade de xp, proporcional ao ranking que está alcançando.
      } else if (novaQuantidade === 25) {
          const refRankingOuro = ref(db, `usuarios/logados/${emailB64}/ranking/ouro`);
          update(refRankingOuro, {
              'receita_criada_25': 1,
          });
          await PassarXP(500);
      } else if (novaQuantidade === 50) {
          const refRankingDiamante = ref(db, `usuarios/logados/${emailB64}/ranking/diamante`);
          update(refRankingDiamante, {
              'receita_criada_50': 1,
          });
          await PassarXP(1000);
      } else if (novaQuantidade === 100) {
          const refRankingEsmeralda = ref(db, `usuarios/logados/${emailB64}/ranking/esmeralda`);
          update(refRankingEsmeralda, {
              'receita_criada_100': 1,
          });
          await PassarXP(2500);
      } else if (novaQuantidade === 200) {
          const refRankingChefeSupremo = ref(db, `usuarios/logados/${emailB64}/ranking/chefeSupremo`);
          update(refRankingChefeSupremo, {
              'receita_criada_200': 1,
          });
          await PassarXP(5000);
      };
    } catch (erro) {
      console.log('erro: 5', erro);
    };           
        
    // Conquistas de Receitas Criadas

    const refCVV = ref(db, `usuarios/logados/${emailB64}/receitas`);
    const CVV = await get(refCVV);
    const CVV_dados = CVV.val();
    const CVV_arrayOriginal = Object.values(CVV_dados);
    const CVV_array = CVV_arrayOriginal.map(item => item.slice(1));
    // Cria um array com três arrays, sendo cada um deles: Receitas Carnívoras, Veganas e Vegetarianas.

    const refReceitaCriada = ref(db, `usuarios/logados/${emailB64}/conquistas/receitas_criadas`);
    try {
      if (CVV_array.length === 3) {
          const refConquista = ref(db, `usuarios/logados/${emailB64}/conquistas/carnivoro_vegano_vegetariano`);
          await update(refConquista, {
            'carnivoro_vegano_vegetariano_1': 1,
          });
          // Se o usuário tiver receitas de todos os tipos, ele recebe uma conquista.

          await PassarXP(50);
      };
        
      if (novaQuantidade === 3 ) {
          await update(refReceitaCriada, {
            'receitas_criadas_3': 1 
          });
          // É a mesma lógica do ranking, mas com conquistas.
          await PassarXP(50);
        
      } else if (novaQuantidade === 10) {
          await update(refReceitaCriada, {
            'receitas_criadas_10': 1 
          });
          await PassarXP(100);
        
      } else if (novaQuantidade === 25) {
          await update(refReceitaCriada, {
            'receitas_criadas_25': 1 
          });
          await PassarXP(250);
        
      } else if (novaQuantidade === 50) {
          await update(refReceitaCriada, {
            'receitas_criadas_50': 1 
          });
          await PassarXP(500);
        
      } else if (novaQuantidade === 100) {
          await update(refReceitaCriada, {
            'receitas_criadas_100': 1 
          });
          await PassarXP(1000);
      };
    } catch (erro) {
      console.log('erro 7:', erro);
    };

    // Conquistas de tipos de Receitas Criadas (carnivoro, vegano, vegetariano)

    try {
      // Pega os arrays referentes às três receitas.
      const CVV_array_carnivoro = CVV_array[2];
      const CVV_tamanho_carnivoro = CVV_array_carnivoro.length;

      const CVV_array_vegetariano = CVV_array[0];
      const CVV_tamanho_vegetariano = CVV_array_vegetariano.length;
      
      const CVV_array_vegano = CVV_array[1];
      const CVV_tamanho_vegano = CVV_array_vegano.length;

      // Atualiza as conquistas com base na quantidade das receitas.
      const refConquista_CVV = ref(db, `usuarios/logados/${emailB64}/conquistas/carnivoro_vegano_vegetariano`);
      
      if (CVV_tamanho_carnivoro >= 10 && CVV_tamanho_vegetariano >= 10 && CVV_tamanho_vegano >= 10) {
        await update(refConquista_CVV, {
          'carnivoro_vegano_vegetariano_10': 1,
        });
        await PassarXP(500);
      } else if (CVV_tamanho_carnivoro >= 50 && CVV_tamanho_vegetariano >= 50 && CVV_tamanho_vegano >= 50) {
        await update(refConquista_CVV, {
          'carnivoro_vegano_vegetariano_50': 1,
        });
        await PassarXP(5000);
      } else if (CVV_tamanho_carnivoro >= 100 && CVV_tamanho_vegetariano >= 100 && CVV_tamanho_vegano >= 100) {
        await update(refConquista_CVV, {
          'carnivoro_vegano_vegetariano_100': 1,
        });
        await PassarXP(10000);
      } else if (CVV_tamanho_carnivoro >= 1000 && CVV_tamanho_vegetariano >= 1000 && CVV_tamanho_vegano >= 1000) {
        await update(refConquista_CVV, {
          'carnivoro_vegano_vegetariano_1000': 1,
        });
        await PassarXP(100000);
      };
    } catch (erro) {
      console.log('Erro 7:', erro);
    };
};

  const PassarXP = async (valor) => {
    // Essa função é separada em duas partes.
    // A primeira parte da função é responsável por passar o xp que o usuário recebe ao criar uma receita.
    // A segunda parte é uma grande verificação da quantidade de xp que o usuário tem. Caso atinja uma quantidade específica,
    // Atualiza o nó de um ranking específico.
    try {
    const emailB64 = Base64.encode(authInstance.currentUser.email);
    const refXP = ref(db, `usuarios/logados/${emailB64}`);
    const snapshotXP = await get(refXP);
    const dadosXP = snapshotXP.val();
    const XP_ = dadosXP.xp;
    const XPNovo = XP_ + valor;
    update(refXP, {
      xp: XPNovo
    });
    // Atualiza o valor do xp com base no parâmetro.

    if (XPNovo < 1000) {
      return;
    } else if (XPNovo >= 1000 && XPNovo < 10000) {
      
      const refBronze = ref(db, `usuarios/logados/${emailB64}/ranking/bronze`);
      const snapshotBronze = await get(refBronze);
      const dadosBronze = snapshotBronze.val();
      const valor_Bronze = dadosBronze.xp_1000;

      if (valor_Bronze === 0) {
        update(refBronze, {
          'xp_1000': 1,
        });
      };

    } else if (XPNovo >= 10000 && XPNovo < 50000) {
      
      const refOuro = ref(db, `usuarios/logados/${emailB64}/ranking/ouro`);
      const snapshotOuro = await get(refOuro);
      const dadosOuro = snapshotOuro.val();
      const valor_Ouro = dadosOuro.xp_10000;

      if (valor_Ouro === 0) {
        update(refOuro, {
          'xp_10000': 1,
        });
      };

    } else if (XPNovo >= 50000 && XPNovo < 250000) {
      
      const refDiamante = ref(db, `usuarios/logados/${emailB64}/ranking/diamante`);
      const snapshotDiamante = await get(refDiamante);
      const dadosDiamante = snapshotDiamante.val();
      const valor_Diamante = dadosDiamante.xp_50000;

      if (valor_Diamante === 0) {
        update(refDiamante, {
          'xp_50000': 1,
        });
      };

    } else if (XPNovo >= 250000 && XPNovo < 1000000) {
      
      const refEsmeralda = ref(db, `usuarios/logados/${emailB64}/ranking/esmeralda`);
      const snapshotEsmeralda = await get(refEsmeralda);
      const dadosEsmeralda = snapshotEsmeralda.val();
      const valor_Esmeralda = dadosEsmeralda.xp_250000;

      if (valor_Esmeralda === 0) {
        update(refEsmeralda, {
          'xp_250000': 1,
        });
      };

    } else if (XPNovo >= 1000000) {
      
      const refChefeSupremo = ref(db, `usuarios/logados/${emailB64}/ranking/chefeSupremo`);
      const snapshotChefeSupremo = await get(refChefeSupremo);
      const dadosChefeSupremo = snapshotChefeSupremo.val();
      const valor_ChefeSupremo = dadosChefeSupremo.xp_1000000;

      if (valor_ChefeSupremo === 0) {
        update(refChefeSupremo, {
          'xp_1000000': 1,
        });
      };
    };
    } catch (erro) {
    console.log('erro: 8', erro);
  };
  };

  const criarReceita = async () => {
    // Função responsável por criar a receita.
    try {
      ajustarId();
      // Chama a função de ajustar ids.

      const dificuldades = [
          'Fácil de fazer!',
          'Um pouco complicada...',
          'Difícil!',
          'Mestre-cuca!'
        ];
      let Dificuldade = dificuldades[dif-1];
      // Define a dificuldade com base na escolha do usuário.

      let Tempo = '';
      if (minuto_hora) {
          Tempo = minutosParaHorasEMinutos(tempo);
      } else if (!minuto_hora) {
          Tempo = minutosParaHorasEMinutos(tempo*60);
      };
      // Define primeiro se é minutos ou hora, e depois chama a função minutosParaHorasEMinutos.

      let carnivoro_vegetariano_vegano = '';
      if (tipo === 1) {
          carnivoro_vegetariano_vegano = 'carnivoro';
      } else if (tipo === 2) {
          carnivoro_vegetariano_vegano = 'vegetariano';
      } else if (tipo === 3) {
          carnivoro_vegetariano_vegano = 'vegano';
      };
      // Define o tipo de receita.
      
      const refReceita = ref(db, `ReceitasUsuarios/${carnivoro_vegetariano_vegano}`);
      const snapshot = await get(refReceita);
      let id = 1;
      if (snapshot.exists()) {
        id = snapshot.exists() && snapshot.numChildren() > 0 ? 
        snapshot.numChildren() : 1;
      };
      // Define o id da receita com base no número de receitas já existentes.
      // Se não houver receitas, o id é 1.
      // Se houver, o id é calculado com base na quantidade de filhos.

      const informacoes = {
          email: authInstance.currentUser.email,
          title: titulo,
          time: Tempo,
          autor: authInstance.currentUser.displayName,
          description: desc,
          dif: Dificuldade,
          tipo: carnivoro_vegetariano_vegano,
          ingredientes: ingredientes,
          passos: passos,
          id: id,
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
          avaliacao: 
          { nota: 0, contador: 0, media: 0 },
        };
      // Objeto literal com todas as informações que serão passadas ao criar a receita.
      // Toda receita é criada com um campo de notas, que serve para mostrar a avaliação daquela receita.

      const refReceitaID = ref(db, `ReceitasUsuarios/${carnivoro_vegetariano_vegano}/${id}`);
      await update(refReceitaID, informacoes);
      // Cria um nó em ReceitasUsuarios, separando a receita pelo tipo dela e o identificador.
      await UnirReceita_ao_Usuario(informacoes, carnivoro_vegetariano_vegano);
      // Chama uma outra função, responsável por unir a receita ao usuário que está a criando.

    } catch (erro) {
      console.log('erro 3:', erro)
    };
  };

  const proximaTela = () => { 
    // Função responsável por navegar para a tela da receita que foi criada.
    navigation.reset({
      index: 0,
      routes: [
        { name: tipo === 1 ? 'ReceitaCarnivoraUsuario' : tipo === 2 ? 'ReceitaVegetarianaUsuario' : 'ReceitaVeganaUsuario' } 
      ],
    });
  };

  return (

    <View style={styles.container} animationType='fade'>
      <ScrollView>
        <TouchableOpacity onPress={() => escolherImagem()}>
          <Image 
          style = {styles.imagem}
          source={imagem ? imagem : require('../../../assets/adicionar.png')}
          />
        </TouchableOpacity>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}> Qual o nome da sua receita? </Text>
          <TextInput style={styles.TextInput} 
            placeholderTextColor={'black'}
            placeholder = 'Digite'
            value={titulo}
            onChangeText={(texto) => setTitulo(texto)}
          />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.autor}>Por {user} • Pronto em </Text>
            <TextInput style={styles.TextInput2} 
                placeholderTextColor={'black'}
                placeholder = 'Digite'
                value={tempo}
                onChangeText={(texto) => setTempo(texto)}
                keyboardType='numeric'
            />
            <View style={{marginLeft: 15}}>
                <TouchableOpacity onPress={() => setMinuto_Hora(!minuto_hora)}>
                    <Text style={[styles.Min, {backgroundColor: minuto_hora === true ? 'green' : 'red'}]}>Minutos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMinuto_Hora(!minuto_hora)}>
                    <Text style={[styles.Hor, {backgroundColor: minuto_hora === true ? 'red' : 'green',}]}>Horas</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <TextInput
          style= {styles.TextInput4} 
          placeholder='Digite sua descrição'
          placeholderTextColor={'black'}
          value = {desc}
          onChangeText={texto => setDesc(texto)}
          />
        </View>
        
        
        <Text style={styles.subtitulo}>Ingredientes</Text>
        {ingredientes.map((ingrediente, index) => {      
            if (ingrediente.quantidade != 0) {
              return( 
                      <View key={ingrediente.id} style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10,}}>
                        <Text style={{fontSize: 18,}}>•</Text>
                        <View style={{flexDirection: 'row-reverse', alignItems: 'center', }}>
                      
                          {ingrediente.ing != '' && (  
                              <View style={{marginRight: 10, alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => {
                                  
                                  setIngredientes(ingredientes.map((item, i) => 
                                  i === index ? {...item, quantidade: item.quantidade + 1} : item
                                  ))
                                  
                                  }}>

                                  <Text style={{fontSize: 22, width: 20, textAlign: 'center', color: 'black', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.09)'}}>+</Text>
                                </TouchableOpacity>
                                  <Text>{ingrediente.quantidade}</Text>
                                <TouchableOpacity onPress={() => {
                                  
                                  if (ingrediente.quantidade > 1) {
                                  setIngredientes(ingredientes.map((item, i) =>
                                  i === index ? {...item, quantidade: item.quantidade - 1} : item
                                  ))
                                } else {
                                  setIngredientes(ingredientes.map((item, i) => 
                                    i === index ? {...item, ing: '', quantidade: 0} : item
                                    )
                                    )
                                }
                                  }}>

                                  <Text style={{fontSize: 22, width: 20, textAlign: 'center', color: 'black', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.09)'}}>-</Text>
                                </TouchableOpacity>
                              </View>
                              )}
                  
                              <TextInput style={styles.TextInput3}
                              placeholder='Digite um ingrediente'
                              placeholderTextColor={'black'}
                              value={ingrediente.ing}
                              onChangeText={texto => {setIngredientes(ingredientes.map((item, i) =>
                              i === index ? { ...item, ing: texto } : item
                              )
                              );
                              }}
                              />
            
                        </View>
                      </View>
                    )}
                  })}
            
              <TouchableOpacity onPress= {() => adicionaIngrediente()}>
                  <Text style={{fontSize: 30, color: 'green', textShadowColor: 'black', marginLeft: 38,}}>+</Text>    
              </TouchableOpacity>        
            
              <Text style={styles.subtitulo}>Passo {passoAtual + 1}</Text>
              <Text style={styles.passoTexto}></Text>

              <View style={styles.botoesPasso}>
                <TouchableOpacity
                  style={[styles.botaoPasso, { opacity: passoAtual === 0 ? 0.5 : 1 }]}
                  onPress={passoAnterior}
                  disabled={passoAtual === 0}
                >
                  <Text style={styles.botaoTexto}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botaoPasso, { opacity: passoAtual === 9 ? 0.5 : 1 }]}
                  onPress={() => {proximoPasso();}}
                  disabled={passoAtual === 9}
                >
                  <Text style={styles.botaoTexto}>Próximo</Text>
                </TouchableOpacity>
              </View>
              
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                style= {styles.TextInput4} 
                value = {passos[passoAtual] !== undefined ? passos[passoAtual] : ''}
                placeholder = 'O que fazer neste passo?'
                placeholderTextColor={'black'}
                onChangeText={texto => {
                setPassos(pas => {
                    const novosPassos = [...pas];
                    novosPassos[passoAtual] = texto
                    return novosPassos;
                
                })
                }}
                />
              </View>
              
              <View style={styles.tituloContainer}>
                <Text style={styles.titulo}> Qual o tipo da receita? </Text>
              </View>
              
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 2,}}>
                  <TouchableOpacity onPress={() => setTipo(1)}>
                          <Text style={[styles.tipos, {backgroundColor: tipo === 1 ? 'green' : 'red'}]}>Carnívora</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTipo(2)}>
                          <Text style={[styles.tipos, {backgroundColor: tipo === 2 ? 'green' : 'red'}]}>Vegetariana</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTipo(3)}>
                          <Text style={[styles.tipos, {backgroundColor: tipo === 3 ? 'green' : 'red'}]}>Vegana</Text>
                  </TouchableOpacity>
              </View>
              
              <View style={styles.tituloContainer}>
                <Text style={styles.titulo}> Qual a dificuldade da receita? </Text>
              </View>
              
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 2,}}>
                  <TouchableOpacity onPress={() => setDif(1)}>
                          <Text style={[styles.tipos, {backgroundColor: dif === 1 ? 'green' : 'red'}]}>Fácil de fazer!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDif(2)}>
                          <Text style={[styles.tipos, {backgroundColor: dif === 2 ? 'green' : 'red'}]}>Um pouco complicada...</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDif(3)}>
                          <Text style={[styles.tipos, {backgroundColor: dif === 3 ? 'green' : 'red'}]}>Difícil!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDif(4)}>
                          <Text style={[styles.tipos, {backgroundColor: dif === 4 ? 'green' : 'red'}]}>Mestre-cuca!</Text>
                  </TouchableOpacity>
              </View>

      </ScrollView>

            <View style={styles.temporizador}>

              <Button 
              title = 'Criar Receita'
              onPress = {() => criarReceita()}
              />

              <Button 
              title = 'Proxima'
              onPress = {() => proximaTela()}
              />

            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imagem: { width: '100%', height: 200 },
  tituloContainer: {
    padding: 16,
    alignItems: 'center',
  },
  TextInput: {
    height: 60, 
    width: 300, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    borderColor: 'rgba(0, 0, 0, 0.51)',
    borderRdius: 10,
    borderWidth: 2,
    elevation: 3,
    fontSize: 18,
    color: 'black',
    textShadowColor: 'black',
 
},
  TextInput2: {
    height: 45, 
    width: 100, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    borderColor: 'rgba(0, 0, 0, 0.51)',
    borderRdius: 10,
    borderWidth: 1,
    fontSize: 12,
    color: 'black',
    textShadowColor: 'black',
 
},
  TextInput3: {
    height: 45, 
    width: 135, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    fontSize: 12,
    color: 'black',
    textShadowColor: 'black',
 
},
  TextInput4: {
    height: 90, 
    width: 300, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    borderColor: 'rgba(0, 0, 0, 0.51)',
    borderRdius: 10,
    borderWidth: 2,
    elevation: 3,
    fontSize: 18,
    color: 'black',
    textShadowColor: 'black',
 
},
  Min: {
    height: 30, 
    width: 50, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderRdius: 10,
    borderWidth: 1,
    fontSize: 12,
    color: 'black',
    textShadowColor: 'black',
 
},
  tipos: {
    height: 45, 
    width: 100, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderRdius: 10,
    borderWidth: 1,
    fontSize: 12,
    color: 'black',
    textShadowColor: 'black',
 
},
  Hor: {
    height: 30, 
    width: 50, 
    fontWeight: 'bold', 
    marginTop: 10, 
    textAlign: 'center',
    textAlignVertical: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderRdius: 10,
    borderWidth: 1,
    fontSize: 12,
    color: 'black',
    textShadowColor: 'black',
 
},
  titulo: { fontSize: 22, fontWeight: 'bold', marginTop: 10, },
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
    //position: 'absolute',
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