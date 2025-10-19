import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { getDatabase, ref, get, update, onValue } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Filtrar from '../filtros/Filtrar';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../../../reducers/hooks';
import { Base64 } from 'js-base64';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoaderCompleto from '../../loading/loadingCompleto';
import { useAppDispatch } from '../../../reducers/hooks';
import { modificaOrdenacao } from '../../../reducers/filtrarReducer';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasCarnivoraApp'>

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

let recipesCarnivoras: any = [
  {
    email: '',
    id: 1,
    title: 'Bife Grelhado com Alho',
    description: 'Suculento bife temperado com alho e ervas.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 15 min',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/bifeComAlho.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Bife de contrafilé', quantidade: '200', medida: 'gramas', id: 1 },
      { ing: 'Alho picado', quantidade: '1', medida: 'unidades', id: 2 },
      { ing: 'Azeite de oliva', quantidade: '20', medida: 'mls', id: 3 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'gramas', id: 4 },
      { ing: 'Ervas frescas', quantidade: '1', medida: 'gramas', id: 5 },
    ],
    passos: [
      'Tempere os bifes com sal, pimenta e alho.',
      'Aqueça o azeite em uma frigideira.',
      'Grelhe os bifes por 3-4 minutos de cada lado.',
      'Finalize com ervas frescas e sirva.',
    ],
    avaliacao: 
    { nota: 0, contador: 0, media: 0 },
    calorias: 320,
    peso: 350,
    proteina: 75,
  },
  {
    email: '',
    id: 2,
    title: 'Costela ao Forno',
    description: 'Costela assada lentamente, super macia!',
    dif: 'Um pouco complicada...',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/costela.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    refeicao: 'bebida',
    ingredientes: [
      { ing: 'Costela bovina', quantidade: '1000', medida: 'gramas', id: 1 },
      { ing: 'Alho amassado', quantidade: '4', medida: 'unidades', id: 2 },
      { ing: 'Cebola picada', quantidade: '1', medida: 'unidades', id: 3 },
      { ing: 'Sal grosso', quantidade: '1', medida: 'gramas', id: 4 }, // "a gosto" não é medida, então use 1 grama para manter padrão
      { ing: 'Pimenta-do-reino', quantidade: '1', medida: 'gramas', id: 5 }, // idem acima
    ],
    passos: [
      'Tempere a costela com sal, pimenta, alho e cebola.',
      'Envolva em papel alumínio e leve ao forno pré-aquecido a 180°C.',
      'Asse por cerca de 2 horas até ficar macia.',
      'Retire o papel e doure por mais 20 minutos.',
    ],
    avaliacao: 
    { nota: 0, contador: 0, media: 0 },
    calorias: 720,
    peso: 350,
    proteina: 60,
  },
  {
    email: '',
    id: 3,
    title: 'Hambúrguer Artesanal',
    description: 'Feito com carne de qualidade e tempero caseiro.',
    dif: 'Difícil!',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/hamburguer.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    refeicao: 'cafe_da_manha',
    ingredientes: [
      { ing: 'Carne moída', quantidade: '400', medida: 'gramas', id: 1 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'gramas', id: 2 }, // "a gosto" padronizado
      { ing: 'Pão de hambúrguer', quantidade: '2', medida: 'unidades', id: 3 },
      { ing: 'Queijo', quantidade: '2', medida: 'unidades', id: 4 }, // fatias = unidade
      { ing: 'Alface e tomate', quantidade: '1', medida: 'unidades', id: 5 }, // "a gosto" padronizado
    ],
    passos: [
      'Tempere a carne moída com sal e pimenta.',
      'Modele os hambúrgueres e grelhe até o ponto desejado.',
      'Monte o hambúrguer com pão, queijo, alface e tomate.',
      'Sirva imediatamente.',
    ],
    avaliacao:  
    { nota: 0, contador: 0, media: 0 },
    calorias: 700,
    peso: 350,
    proteina: 40,
  },
  {
    email: '',
    id: 4,
    title: 'Wellington de Filé Mignon',
    description: 'Uma receita digna de chef profissional.',
    dif: 'Mestre-cuca!',
    time: '⏱️ 2 horas+',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/wellington.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Filé mignon', quantidade: '700', medida: 'gramas', id: 1 },
      { ing: 'Massa folhada', quantidade: '1', medida: 'unidades', id: 2 }, // pacote = unidade
      { ing: 'Cogumelos', quantidade: '200', medida: 'gramas', id: 3 },
      { ing: 'Presunto cru', quantidade: '100', medida: 'gramas', id: 4 },
      { ing: 'Mostarda', quantidade: '2', medida: 'colher', id: 5 },
      { ing: 'Ovo', quantidade: '1', medida: 'unidades', id: 6 },
    ],
    passos: [
      'Sele o filé mignon e pincele com mostarda.',
      'Refogue os cogumelos e espalhe sobre o presunto cru.',
      'Envolva o filé com presunto e cogumelos.',
      'Enrole tudo na massa folhada, pincele com ovo.',
      'Asse em forno pré-aquecido a 200°C por cerca de 40 minutos.',
    ],
    avaliacao: 
    { nota: 0, contador: 0, media: 0 },
    calorias: 820,
    peso: 350,
    proteina: 65,
  },
  {
    email: '',
    id: 5,
    title: 'Pizza',
    description: 'Uma ótima e deliciosa pizza.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/pizza.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    refeicao: 'sobremesa',
    ingredientes: [
      { ing: 'Massa de pizza', quantidade: '1', medida: 'unidades', id: 1 }, // disco = unidade
      { ing: 'Molho de tomate', quantidade: '4', medida: 'colher', id: 2 },
      { ing: 'Queijo mussarela', quantidade: '150', medida: 'gramas', id: 3 },
      { ing: 'Calabresa fatiada', quantidade: '100', medida: 'gramas', id: 4 },
    ],
    passos: [
      'Espalhe o molho de tomate sobre a massa.',
      'Cubra com queijo, calabresa e azeitonas.',
      'Leve ao forno pré-aquecido a 220°C por 15 minutos.',
      'Sirva quente.',
    ],
    avaliacao: 
    { nota: 0, contador: 0, media: 0 },
    calorias: 420,
    peso: 350,
    proteina: 35,
  },
];

export default function ReceitasCarnivoraApp({navigation}: Props) {
  const dispatch = useAppDispatch();
  let {ordenacao, refeicao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#fd5a28ff';
  const [emailB64, setEmailB64] = useState<string>('');
  const [receitaCarnivoraFavoritada, setReceita] = useState<number[]>([]);
  const [loadingReceitas, setLoadingReceitas] = useState<boolean>(true);
  const [loadingFavoritas, setLoadingFavoritas] = useState<boolean>(true);

  useEffect(() => {
    // Função que busca todas as receitas carnívoras e cria um nó para cada uma delas.
    dispatch(modificaOrdenacao('Ordenação Padrão'));
    setLoadingReceitas(true);
    const refReceita = ref(db, `ReceitasApp/carnivoro`);
    const listenerRefReceita = onValue(refReceita, async (snapshot) => {
        await buscaReceitas();
    });
    
    async function ReceitaFirebase() {
      await buscaReceitas();
      for (let i = 0; i < recipesCarnivoras.length; i++) {
        let refReceita = ref(db, `ReceitasApp/${recipesCarnivoras[i].tipo}/${recipesCarnivoras[i].id}`);
        let snapshot = await get(refReceita);
        if (!snapshot.exists()) {
          await update(refReceita, {
          ...recipesCarnivoras[i]
        });
        };
      };
    };

    ReceitaFirebase();

    const user = onAuthStateChanged(authInstance, usuario => {
      if (!usuario || !usuario.email) return;
      setEmailB64(Base64.encode(usuario.email));
    });
    setLoadingReceitas(false);

    return () => {user(); listenerRefReceita();};
  }, [authInstance]);
  // Busca todas as receitas carnívoras e cria um nó pra elas, além de pegar o email do usuário.

  async function buscaReceitas() {
    try {
      const refReceita = ref(db, `ReceitasApp/carnivoro`);
      const snapshot = await get(refReceita);
      const dados = snapshot.val();
      const receitas = dados.filter(Boolean);
      
      for (let i = 0; i < recipesCarnivoras.length; i++) {
        recipesCarnivoras[i] = {
          ...recipesCarnivoras[i], 
          avaliacao: receitas[i].avaliacao, 
          comentarios: receitas[i].comentarios}
      };
    } catch (error) {
      console.log('Erro em buscaReceitas:', error);
    }
  }
  // Função que busca todas as receitas carnívoras do banco e atualiza o array local.

  const adicionaFavorito = async (recipe: any) => {
    // Função que adiciona a receita em sua lista de favoritos.
    try {
      let receitaFavoritada = false;
      
      const refOriginal = ref(db, `usuarios/${emailB64}/receitasFavoritas`);
      onValue(refOriginal, async (snapshot) => {
        if (snapshot.exists()) {
          const receitasFavoritadas = Object.values(snapshot.val()).filter(Boolean);
          const verifica_se_ja_existe = receitasFavoritadas.some((r: any) => r.id === recipe.id && r.tipo === recipe.tipo && r.autor === recipe.autor);
          receitaFavoritada = verifica_se_ja_existe;
        };
    
        if (receitaFavoritada) {
          Alert.alert('Você já favoritou essa receita')
          return;
        };
        
        const idChildren = snapshot.exists() && snapshot.numChildren() > 0 ? snapshot.numChildren() : 1;
        const refIDReceitasFavoritas = ref(db, `usuarios/${emailB64}/receitasFavoritas/${idChildren}`);
        update(refIDReceitasFavoritas, {
          ...recipe, 
          idUsuario: idChildren
        });
        await buscaReceitasFavoritas(false);
      }, { onlyOnce: true });
      Alert.alert('Receita Favoritada', 'A receita foi adicionada aos seus favoritos!');
      
    } catch (erro: any) {
      console.log('Erro:', erro.message)
    };
  };
  // Função que adiciona a receita em sua lista de favoritos.

  useEffect(() => {
    try {
      // UseEffect que busca receitas favoritas sempre que tem uma mudança no nó ou email.
      if (!emailB64) return;

      const refFavoritos = ref(db, `usuarios/${emailB64}/receitasFavoritas`);
      const unsubscribeFavoritos = onValue(refFavoritos, async snapshot => {
        await buscaReceitasFavoritas(false);
      });

      return () => unsubscribeFavoritos();
    } catch (error) {
      console.log('Erro no useEffect de favoritos:', error);
    }
  }, [emailB64]);
  // UseEffect que busca receitas favoritas sempre que tem uma mudança no nó ou email.

  async function buscaReceitasFavoritas(precisa_de_loading: boolean): Promise<void> {
    try {
      // Função que busca as receitas favoritas.
      setLoadingFavoritas(precisa_de_loading);
      const refOriginal = ref(db, `usuarios/${emailB64}/receitasFavoritas`);
      const snapshot = await get(refOriginal);
      if (snapshot.exists()) {
        const receitasFavoritadas = Object.values(snapshot.val()).filter(Boolean);
        const receitasFavoritadasCarnivoras = receitasFavoritadas.filter((r: any) => r.tipo === 'carnivoro' && r.email === '');
        setReceita(receitasFavoritadasCarnivoras.map((r: any) => r.id));
      };
      setLoadingFavoritas(false);
    } catch (error) {
      console.log('Erro em buscaReceitasFavoritas:', error);
    }
  }
  // Função que busca as receitas favoritas.

  useEffect(() => {
    try {
      buscaReceitasFavoritas(true);
    } catch (error) {
      console.log('Erro no useEffect de buscaReceitasFavoritas:', error);
    }
  }, [emailB64]);
  // UseEffect que busca receitas favoritas ao carregar o email.


  if (loadingFavoritas || loadingReceitas) return (
    <LoaderCompleto/>
  );
  
  return (
    <ImageBackground resizeMode='cover' source={require('../../../../assets/TelaPrincipal/capa2.png')} className="flex-1">
      <StatusBar hidden />
      <ScrollView>
        <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className="opacity-98 text-6xl mt-2 p-[30px] font-bold text-[#A83232] mb-2 text-center">
          Receitas Carnívoras
        </Text>

          <View className="-mt-1">
            <Filtrar corDoFiltro={corDoFiltro} />
          </View>
          {/* Filtro das receitas */}

        <View className='p-[25px]'>
          {(ordenacao === 'Melhores Receitas' ?
          recipesCarnivoras.slice().sort((a: any, b: any) => b.avaliacao.media - a.avaliacao.media) // Filtra as receis com média maior - média menor.
          : ordenacao === 'Calorias' ? 
          recipesCarnivoras.slice().sort((a: any, b: any) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipesCarnivoras.slice().filter((receita: any) => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipesCarnivoras.slice().filter((receita: any) => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipesCarnivoras.slice().map((receita: any) => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a: any, b: any) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipesCarnivoras.slice().map((receita: any) => {
            switch (receita.dif) {
              case 'Fácil de fazer!':
                return { ...receita, idDificuldade: 1 };
              case 'Um pouco complicada...':
                return { ...receita, idDificuldade: 2 };
              case 'Difícil!':
                return { ...receita, idDificuldade: 3 };
              case 'Mestre-cuca!':
                return { ...receita, idDificuldade: 4 };
              default:
                return { ...receita, idDificuldade: 0 };
            }
          }).sort((a: any, b: any) => a.idDificuldade - b.idDificuldade) // Filtra as receitas em mais fácil - mais difícil.
          : recipesCarnivoras

          ).filter((receita: any) => refeicao === 'Todas' ? true : receita.refeicao === refeicao).
          map((recipe: any) => (
            <TouchableOpacity
              key={recipe.id}
              activeOpacity={0.8}
              className="rounded-2xl min-h-[130px] mb-4 overflow-hidden flex-row items-center"
              style={{
                elevation: 5,
                shadowColor: 'black'
              }}
              onPress={() => navigation.navigate('Receita', {recipe})}
            >
              
              <LinearGradient
              colors={['#bd4c1fff', '#916040ff']}
              className="w-[100%] h-[100%] items-center flex-row"
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              >
                <Image
                  source={recipe.image}
                  className="w-[110px] h-full rounded-xl mr-2"
                />
                
                <TouchableOpacity className="absolute top-[2px] right-[2px]" onPress={() => adicionaFavorito(recipe)}>
                    <Ionicons 
                    className="absolute top-[2px] right-[2px] opacity-95" 
                    name={Array.isArray(receitaCarnivoraFavoritada) ? receitaCarnivoraFavoritada.includes(recipe.id) ? "heart-sharp": "heart-outline" : "heart-outline"}
                    size={33} 
                    color="#3b3939b1"
                    />
                    <Ionicons 
                    className="absolute top-[2px] right-[2px] opacity-95" 
                    name={Array.isArray(receitaCarnivoraFavoritada) ? receitaCarnivoraFavoritada.includes(recipe.id) ? "heart-sharp": "heart-outline" : "heart-outline"}
                    size={32} 
                    color='#fb4949ff'/>   
                </TouchableOpacity>

                <View className="flex-1">
                  <Text className="font-bold text-[22px] mb-1 mr-8 text-amber-100">
                    {recipe.title}
                  </Text>
                  <Text className="text-neutral-100 font-medium text-[14px] mb-1">{recipe.description}</Text>
                  <Text style={{textShadowColor: 'black', textShadowRadius: 0.2}} className='text-[14px] mb-1 text-white font-bold'>
                    {recipe.time}  •  {recipe.dif}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </ImageBackground>
  );

{/* 
  
  Tela ReceitasCarnivoraApp em React Native/TypeScript que exibe lista de receitas carnívoras, integra Firebase Realtime Database e 
Auth para buscar receitas e favoritos do usuário, cria nós no banco caso não existam, permite favoritar receitas com verificação de
duplicidade, aplica filtros e ordenações (melhores receitas, calorias, proteína, tempo, dificuldade), utiliza ScrollView e 
ImageBackground para exibir as receitas com LinearGradient, exibe informações básicas 
(imagem, título, descrição, tempo, dificuldade), controla estados de loading, gerencia email do usuário em Base64, conecta filtros 
com Redux e navega para tela individual de receita ao tocar em cada item.
 
*/}
};
