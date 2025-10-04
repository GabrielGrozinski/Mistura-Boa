import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, Modal, TouchableOpacity,
  ScrollView, Alert, Pressable, Image
  
} from 'react-native';
import ImmersiveMode from 'react-native-immersive';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { getDatabase, ref, get, set } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import {UnirReceita_ao_Usuario, PassarXP } from '../funcaoAuxiliadora/inserirDados';
import Barra from '../Barra/Barra';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import LoaderCompleto from '../loading/loadingCompleto';


type Props = NativeStackScreenProps<TiposRotas, 'CriarReceita'>;

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

const controller = new AbortController();
const apiImagem = axios.create({
  baseURL: 'http://192.168.1.24:3000',
  timeout: 15000,
  signal: controller.signal
});


export default function CriarReceita({navigation}: Props) {
  const tituloInput = useRef<TextInput>(null);
  const descricaoInput = useRef<TextInput>(null);
  const passosInput = useRef<TextInput>(null);
  const ingredientesInput = useRef<TextInput>(null);
  const ingredientesQuantidadeInput = useRef<TextInput>(null);

  const [modalDificuldade, setModalDificuldade] = useState<boolean>(false);
  const dificuldadeOpcoes = ['Fácil de fazer!', 'Um pouco complicada...', 'Difícil!', 'Mestre-cuca!'];
  const dificuldade = useRef<string>('Ex: Fácil de fazer!');
  const [modalTempo, setModalTempo] = useState<boolean>(false);
  const tempoOpcoes = ['⏱️ 15 min', '⏱️ 30 min', '⏱️ 45 min', '⏱️ 1 hora+', '⏱️ 2 horas+'];
  const tempo = useRef<string>('Defina o Tempo');
  const [modalTipo, setModalTipo] = useState<boolean>(false);
  const tipoOpcoes = [
    {texto: 'Carnivoro', valor: 'carnivoro'},
    {texto: 'Vegano', valor: 'vegano'},
    {texto: 'Vegetariano', valor: 'vegetariano'},
  ];
  const tipoTexto = useRef<string>('Ex: Vegano');
  const tipoValor = useRef<string>('');
  const [modalRefeicao, setModalRefeicao] = useState<boolean>(false);
  const refeicaoOpcoes = [
    {texto: 'Café da Manhã', valor: 'cafe_da_manha'},
    {texto: 'Prato Principal', valor: 'prato_principal'},
    {texto: 'Sobremesa', valor: 'sobremesa'},
    {texto: 'Bebida', valor: 'bebida'},
  ];
  const refeicaoTexto = useRef<string>('Ex: Almoço');
  const refeicaoValor = useRef<string>('');
  const [titulo, setTitulo] = useState<string>('');
  const [passos, setPassos] = useState<string[]>(['']);
  const [descricao, setDescricao] = useState('');
  const [ingredientes, setIngredientes] = useState<any[]>([
    {
    id: 1,
    ing: '',
    quantidade: 0,
    medida: 'Grama',
    }
  ]);
  const [modalMedida, setModalMedida] = useState<boolean>(false);
  const medidasOpcoes = [
    'Grama',
    'Unidade',
    'Quilo',
    'Litro',
    'ML',
    'Xícara',
    'Colher',
  ];
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [imagem, setImagem] = useState<object>({});
  const imagemEscolhida = useRef<string>('');
  const usuarioAtual = useRef<string>('');
  const emailB64 = useRef<string>('');
  const [loading, setLoading] = useState<boolean>(false);

    
  useEffect(() => {
      ImmersiveMode.setImmersive(true);
      const user = onAuthStateChanged(authInstance, usuario => {
        if (!usuario || !usuario.email || !usuario.displayName) return;
        setName(usuario.displayName);
        emailB64.current = Base64.encode(usuario.email);
        usuarioAtual.current = usuario.email;
      });

      return () => user();
  }, []);

  const escolherImagem = async () => {
    // Função que escolhe uma imagem do usuário.

    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária!');
      return;
    };

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.5,
      mediaTypes: ['images'],
      base64: true
    });

    if (result.canceled) {
      Alert.alert('Operação cancelada');
      return;
    };
 
    const imagem = result.assets[0];
    imagemEscolhida.current = imagem.uri;
    const imagemB64 = imagem.base64;
    const tipoImagem = imagem.mimeType || 'image/jpeg';

    const imagemUpload = {
      image: imagemB64,
      contentType: tipoImagem,
    };
    setImagem(imagemUpload);
  };

  const EnviarImagem = async (id: number, tipo: string): Promise<boolean> => {
    // Função que envia a imagem escolhida do usuário para o mongoDB.
    try {
      const imagemUpload = {...imagem, id: id, tipo: tipo};
      await apiImagem.post('/imagemReceitas', imagemUpload);
      console.log('Imagem enviada!');
      return true;

    } catch (erro: any) {
      if (erro.response && erro.response.status === 409) {
        console.log('Imagem duplicada');
        return false;
      };
      console.log('Erro ao enviar imagem para o mongoDB', erro);
      return false;
    };
  };

  const RecuperarImagem = async (id: number, tipo: string): Promise<string | boolean> => {
    // Função que recupera a imagem do mongoDb e insere o uri dela no firebase.
    try {
      const response = await apiImagem.get('/imagemReceitas', {params: {id, tipo}});
      const imagem = response.data.imageUrl;
      return imagem;

    } catch (erro) {
      console.log('Erro ao recuperar imagem', erro);
      return false;
    };
  };

  const criarReceita = async () => {
    // Função responsável por criar a receita.
    setLoading(true);
    try {
      const refReceita = ref(db, `ReceitasUsuarios/${tipoValor.current}`);
      const snapshot = await get(refReceita);
      const id = snapshot.exists() && snapshot.numChildren() > 0 ? snapshot.numChildren() : 1;
      // Define o id da receita com base no número de receitas já existentes.
      // Se não houver receitas, o id é 1 (pois é a primeira receita criada neste nó).
      // Se houver, o id é calculado com base na quantidade de filhos.

      let novosPassos = passos;
      novosPassos = novosPassos.filter((passo) => passo !== '');
      // Retira os passos vazios.

      let novosIngredientes = ingredientes;
      novosIngredientes = novosIngredientes.filter((ingrediente) => ingrediente.ing !== '' && ingrediente.quantidade !== 0);
      novosIngredientes = novosIngredientes.map((ing, index) => ({...ing, id: index+1}));
      // Faz a mesma coisa, além de arrumar o id dos ingredientes.

      const verificaEnviarImagem = await EnviarImagem(id, tipoValor.current);
      // Chama uma função responsável por enviar a imagem ao mongoDb.
      if (!verificaEnviarImagem) return console.log('Erro ao criar receita: Enviar Imagem');

      const imagem = await RecuperarImagem(id, tipoValor.current);
      // Chama uma função responsável por recuperar a imagem do mongoDb.

      if (!imagem) return Alert.alert('Tente de novo!');

      const receita = {
        email: usuarioAtual.current, // Email do usuário.
        title: titulo, // Título da receita.
        image: imagem, // Imagem da receita em uri.
        time: tempo.current, // Tempo de preparo.
        autor: name, // Nome do usuário.
        description: descricao, // Descrição da receita.
        dificuldade: dificuldade.current, // Dificuldade da receita.
        tipo: tipoValor.current, // Tipo da receita.
        refeicao: refeicaoValor.current, // Qual refeição a receita se adequa melhor.
        ingredientes: novosIngredientes, // Ingredientes da receita.
        passos: novosPassos, // passos da receita.
        id: id, // Id dinâmico da receita.
        avaliacao: 
        { nota: 0, contador: 0, media: 0 }, // Sistema de avaliações da receita.
        calorias: 320, // Calorias estimadas por I.A.
        peso: 350, // Peso estimado por I.A.
        proteina: 75, // Quantidade de proteína estimada por I.A.
      };
      // Objeto literal com todas as informações que serão passadas ao criar a receita.

      const refReceitaID = ref(db, `ReceitasUsuarios/${tipoValor.current}/${id}`);
      const snapshotReceitaID = await get(refReceitaID);
      if (snapshotReceitaID.exists()) return Alert.alert('Ops!', 'Ocorreu um erro. Pode tentar de novo?');
      // Pode acontecer de dois ou mais usuários tentarem criar uma receita ao mesmo tempo, e isso embaralhar o firebase, por isso essa verificação.
      
      await set(refReceitaID, receita);
      // Cria um nó em ReceitasUsuarios, separando a receita pelo tipo dela e o identificador.

      await PassarXP(emailB64.current, 25);
      // O usuário recebe 25 de xp por receita criada.
      
      await UnirReceita_ao_Usuario(receita, emailB64.current);
      // Chama uma outra função, responsável por unir a receita ao usuário que está a criando.
      
      setLoading(false);
      proximaTela(receita);
      

    } catch (erro) {
      setLoading(false);
      console.log('Erro ao criar receita:', erro);
    };
  };

  const proximaTela = (receita: any) => { 
    // Função responsável por navegar para a tela da receita que foi criada.
    navigation.reset({
      index: 0,
      routes: [
        { name: 'Receita', params: {recipe: receita}} 
      ],
    });
  };
  
  if (loading) return (
    <LoaderCompleto/>
  );

  return (
    <View className="flex-1 bg-[#0e1317] pb-[90px]">
      <ScrollView>
        
        {imagemEscolhida.current === '' && (   
          <TouchableOpacity onPress={() => escolherImagem()} className="mt-20 bg-[#132022] rounded-xl border-[#444b51] items-center justify-around self-center max-h-[200px] max-w-[240px] min-h-[200px] min-w-[240px]">
            <Ionicons name="image-outline" className="mt-4" size={40} color="#444b51" />
            <Text className='font-bold text-lg mb-4 text-center text-neutral-400'>
              Adicionar imagem da receita
            </Text>
          </TouchableOpacity>
        )}
        {/* Adicionar Imagem */}

        {imagemEscolhida.current !== '' && (
          <TouchableOpacity className='mt-20 overflow-hidden rounded-xl self-center max-h-[200px] max-w-[240px] min-h-[200px] min-w-[240px]' onPress={() => escolherImagem()}>
            <Image
            className="w-full h-full"
            source={{uri: imagemEscolhida.current}}
            />
          </TouchableOpacity>
        )}

        <View className="p-4 w-[90%] mx-4 items-start">
          <Text className="text-2xl text-neutral-300 text-start self-start font-bold mt-2">
            Título
          </Text>
          <TextInput
            ref={tituloInput}
            className="h-[50px] w-full bg-[#132022] font-bold mt-2 text-center rounded-xl elevation-1 text-lg text-neutral-200"
            placeholderTextColor="#A3A3A3"
            placeholder="Ex: Bife com Batatas Fritas"
            value={titulo}
            onChangeText={(texto) => setTitulo(texto)}
            returnKeyType='next'
            onSubmitEditing={() => descricaoInput.current?.focus()}
          />
        </View>
        {/* Adicionar Título */}
        
        <View className="p-4 w-[90%] mx-4 items-start">
          <Text className="text-2xl text-neutral-300 text-start self-start font-bold mt-2">
            Descrição
          </Text>
          <TextInput
            ref={descricaoInput}
            className="h-[110px] w-full bg-[#132022] font-bold mt-2 text-center rounded-xl elevation-1 text-lg text-neutral-200"
            placeholderTextColor="#A3A3A3"
            placeholder="Fale um pouco sobre essa receita..."
            value={descricao}
            multiline
            textAlignVertical='top'
            onChangeText={(texto) => setDescricao(texto)}
            returnKeyType='done'
          />
        </View>
        {/* Adicionar Descrição */}

        <View className='flex-row justify-around mx-4 w-[90%]'>
          
          <View className="items-center w-[45%]">
            <Text className="text-2xl self-center text-neutral-300 text-start self-start font-bold mt-2">
              Dificuldade
            </Text>
            <Pressable onPress={() => setModalDificuldade(true)} className="h-[70px] items-center justify-center w-full bg-[#132022] mt-2 rounded-xl elevation-1">
              <Text className={`font-bold text-lg text-center ${dificuldade.current === 'Ex: Fácil de fazer!' ? 'text-neutral-400' : 'text-neutral-100'}`}>
                {dificuldade.current}
              </Text>
            </Pressable>
          </View>
          
          <View className="items-center w-[45%]">
            <Text className="text-2xl self-center text-neutral-300 text-start self-start font-bold mt-2">
              Tempo
            </Text>
            <Pressable onPress={() => setModalTempo(true)} className="h-[70px] items-center justify-center w-full bg-[#132022] mt-2 rounded-xl elevation-1">
              <Text className={`font-bold text-lg text-center ${tempo.current === 'Defina o Tempo' ? 'text-neutral-400' : 'text-neutral-100'}`}>
                {tempo.current}
              </Text>
            </Pressable>
          </View>
        
        </View>
        {/* Adicionar Dificuldade e Tempo */}

        <Modal onRequestClose={() => setModalDificuldade(false)} animationType='slide' visible={modalDificuldade}>
          <View className='flex-1 bg-[#132022] justify-center items-center'>
            <View className='h-[380px] w-[90%] rounded-xl justify-center items-center'>
              {dificuldadeOpcoes.map((opcao: string, index: number) => (
                <Pressable key={index} onPress={() => {setModalDificuldade(false); dificuldade.current = opcao}} className="my-2 justify-center items-center h-[20%] w-full">
                    <Text className="text-3xl font-bold text-neutral-200 text-center">
                      {opcao}
                    </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
        {/* Modal de dificuldade */}

        <Modal onRequestClose={() => setModalTempo(false)} animationType='slide' visible={modalTempo}>
          <View className='flex-1 bg-[#132022] justify-center items-center'>
            <View className='h-[500px] w-[90%] rounded-xl justify-center items-center'>
              {tempoOpcoes.map((opcao: string, index: number) => (
                <Pressable key={index} onPress={() => {setModalTempo(false); tempo.current = opcao}} className="my-2 justify-center items-center h-[17.5%] w-full">
                    <Text className="text-3xl font-bold text-neutral-200 text-center">
                      {opcao}
                    </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
        {/* Modal de tempo */}
        
        <View className="mt-10 min-h-[140px] w-[90%] mx-4 items-start">
          
          <Text className="text-2xl text-neutral-300 text-start self-start font-bold mt-2">
            Passos da Receita
          </Text>
          
          <View className='bg-[#132022] mt-2 rounded-xl w-full items-center'>
            {passos.map((passo: any, index: number) => (
              <TextInput
              key={index}
                ref={passosInput}
                className="min-h-[50px] w-[85%] mb-4 font-bold border-b-2 border-neutral-600 rounded-xl elevation-1 text-lg text-neutral-200"
                placeholderTextColor="#c9c4c4ff"
                placeholder={`Passo ${index + 1}`}
                value={passo.descricao}
                multiline
                onChangeText={(texto) => {
                  let novosPassos = [...passos];
                  novosPassos[index] = texto;
                  setPassos(novosPassos);
                }}
                textAlign='left'
                returnKeyType='done'
              />
            ))}

          </View>

          <TouchableOpacity className="self-center items-center justify-center" disabled={passos.length >= 6} onPress={() => setPassos([...passos, ''])}>
            <Text className={`${passos.length < 6 ? 'text-4xl' : 'text-2xl'} ${passos.length < 6 ? 'text-green-400' : 'text-red-400'} mt-2`}>
                {passos.length >= 6 ? "Limite de Passos atingidos!" : "+"}  
            </Text>
          </TouchableOpacity>

        </View>
        {/* Adicionar Passos */}

        <View className="items-center mt-10 min-h-[120px] w-[90%] mx-4 items-start">
          
          <Text className="text-2xl text-neutral-300 text-start self-start font-bold mt-2">
            Ingredientes da Receita
          </Text>
          
          <View className='bg-[#132022] rounded-lg mt-2 min-h-[60px] w-full'>
            {ingredientes.map((ingrediente: any, index: number) => (
              
              <View className='flex-row min-h-[50px] w-full rounded-2xl items-center justify-around' key={index}>
                <TextInput
                  ref={ingredientesInput}
                  className="min-h-[50px] w-[40%] ml-8 font-bold rounded-xl elevation-1 text-lg text-neutral-200"
                  placeholderTextColor="#c9c4c4ff"
                  placeholder={`${index + 1}° ingrediente`}
                  value={ingrediente.ing}
                  multiline
                  onChangeText={(texto) => {
                    let novosIngredientes = [...ingredientes];
                    novosIngredientes[index] = {...novosIngredientes[index], ing: texto};
                    setIngredientes(novosIngredientes);
                  }}
                  textAlign='left'
                  returnKeyType='next'
                  onSubmitEditing={() => ingredientesQuantidadeInput.current?.focus()}
                />
                <View className="w-[100px] mb-2 mr-8 justify-around">
                  <TextInput
                  ref={ingredientesQuantidadeInput}
                  className="text-neutral-200 font-bold"
                  placeholder='0'
                  placeholderTextColor={'#e8e5e5ff'}
                  textAlign='center'
                  textAlignVertical='bottom'
                  returnKeyType='done'
                  value={ingrediente.quantidade}
                  onChangeText={(texto) => {
                    let novasQuantidades = [...ingredientes];
                    novasQuantidades[index] = {...novasQuantidades[index], quantidade: texto};
                    setIngredientes(novasQuantidades);
                  }}
                  keyboardType='numeric'
                  />
                  
                  <Pressable 
                  onPress={() => {setModalMedida(true); setIngredienteSelecionado(index);}} 
                  className="flex-row -mt-2 border-t border-neutral-700 items-center justify-center mx-1">
                    
                    <Text className='text-white mt-[2px] mr-1 text-center'>
                      {ingrediente.medida}
                    </Text>
                    <Ionicons className="mt-[4px]" name="caret-down-circle-outline" size={16} color="#ada8a8ff" />

                  </Pressable>

                </View>
              </View>
              
            ))}

          </View>

          <TouchableOpacity className="self-center items-center justify-center" disabled={ingredientes.length >= 10} 
          onPress={() => setIngredientes([...ingredientes, {id: ingredientes.length + 1, ing: '', quantidade: 0, medida: 'Grama'}])}>

            <Text className={`${ingredientes.length < 10 ? 'text-4xl' : 'text-2xl'} ${ingredientes.length < 10 ? 'text-green-400' : 'text-red-400'} mt-2`}>
                {ingredientes.length >= 10 ? "Limite de Ingredientes atingidos!" : "+"}  
            </Text>

          </TouchableOpacity>

        </View>
        {/* Adicionar Ingredientes */}

        <Modal onRequestClose={() => setModalMedida(false)} animationType='slide' visible={modalMedida}>
          <View className='flex-1 bg-[#132022] justify-center items-center'>
            <View className='h-[400px] w-[90%] rounded-xl justify-center items-center'>
              {medidasOpcoes.map((opcao: string, index: number) => (
                <Pressable key={index} 
                onPress={() => {
                  if (ingredienteSelecionado !== null) {
                    setIngredientes((medidasAtuais) => {
                      const novasMedidas = [...medidasAtuais];
                      novasMedidas[ingredienteSelecionado] = {
                        ...novasMedidas[ingredienteSelecionado],
                        medida: opcao,
                      };
                      return novasMedidas;
                    });
                  }
                  setModalMedida(false);
                }}
                className="my-2 justify-center items-center h-[20%] w-full">
                    <Text className="text-3xl font-bold text-neutral-200 text-center">
                      {opcao}
                    </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
        {/* Modal de medida dos ingredientes */}

        <View className='flex-row justify-around mx-4 w-[90%]'>
          
          <View className="items-center w-[45%]">
            <Text className="text-2xl self-center text-neutral-300 text-start self-start font-bold mt-2">
              Receita
            </Text>
            <Pressable onPress={() => setModalTipo(true)} className="h-[70px] items-center justify-center w-full bg-[#132022] mt-2 rounded-xl elevation-1">
                <Text className={`font-bold text-lg text-center ${tipoTexto.current === 'Ex: Vegano' ? 'text-neutral-400' : 'text-neutral-100'}`}>
                  {tipoTexto.current}
                </Text>
            </Pressable>
          </View>
            
          <View className="items-center w-[45%]">
            <Text className="text-2xl self-center text-neutral-300 text-start self-start font-bold mt-2">
              Refeição
            </Text>
            <Pressable onPress={() => setModalRefeicao(true)} className="h-[70px] items-center justify-center w-full bg-[#132022] mt-2 rounded-xl elevation-1">
                <Text className={`font-bold text-lg text-center ${refeicaoTexto.current === 'Ex: Almoço' ? 'text-neutral-400' : 'text-neutral-100'}`}>
                  {refeicaoTexto.current}
                </Text>
            </Pressable>
          </View>
        
        </View>
        {/* Adicionar Tipo e Refeição */}

        <Modal onRequestClose={() => setModalTipo(false)} animationType='slide' visible={modalTipo}>
          <View className='flex-1 bg-[#132022] justify-center items-center'>
            <View className='h-[200px] w-[90%] rounded-xl justify-center items-center'>
              {tipoOpcoes.map((opcao: any, index: number) => (
                <Pressable key={index} onPress={() => {setModalTipo(false); tipoTexto.current = opcao.texto; tipoValor.current = opcao.valor}} className="my-2 justify-center items-center h-[30%] w-full">
                    <Text className="text-3xl font-bold text-neutral-200 text-center">
                      {opcao.texto}
                    </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
        {/* Modal de tipo */}
        
        <Modal onRequestClose={() => setModalRefeicao(false)} animationType='slide' visible={modalRefeicao}>
          <View className='flex-1 bg-[#132022] justify-center items-center'>
            <View className='h-[200px] w-[90%] rounded-xl justify-center items-center'>
              {refeicaoOpcoes.map((opcao: any, index: number) => (
                <Pressable key={index} onPress={() => {setModalRefeicao(false); refeicaoTexto.current = opcao.texto; refeicaoValor.current = opcao.valor}} className="my-2 justify-center items-center h-[30%] w-full">
                    <Text className="text-3xl font-bold text-neutral-200 text-center">
                      {opcao.texto}
                    </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
        {/* Modal de refeição */}

        <TouchableOpacity 
          onPress={() => {
            dificuldade.current == 'Ex: Fácil de fazer!' ? Alert.alert('Dados faltando!', 'Adicione a dificuldade!')
            : tempo.current == 'Defina o Tempo' ? Alert.alert('Dados faltando!', 'Adicione o tempo!')
            : tipoValor.current == '' ? Alert.alert('Dados faltando!', 'Adicione o tipo!')
            : tipoValor.current == '' ? Alert.alert('Dados faltando!', 'Adicione o tipo!')
            : titulo == '' ? Alert.alert('Dados faltando!', 'Adicione o título!')
            : passos[0] == '' && passos.length === 1 ? Alert.alert('Dados faltando!', 'Adicione um passo!')
            : ingredientes[0].ing == '' && ingredientes.length === 1 ? Alert.alert('Dados faltando!', 'Adicione um ingrediente!')
            : descricao == '' ? Alert.alert('Dados faltando!', 'Adicione uma descrição!')
            : imagemEscolhida.current == '' ? Alert.alert('Dados faltando!', 'Adicione uma imagem!')
            : criarReceita();
          }}
          className='p-4 w-[70%] mt-6 rounded-xl h-[55px] items-center justify-center self-center bg-sky-500'>
          <Text className='text-3xl text-neutral-100 font-bold text-center'>
            Criar Receita
          </Text>
        </TouchableOpacity>
        {/* Criar receita */}       

      </ScrollView>

      <View className="absolute -bottom-1">
        <Barra />
      </View>

    </View>
  );
};
