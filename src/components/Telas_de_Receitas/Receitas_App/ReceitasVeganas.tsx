import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, ImageBackground, ActivityIndicator, Alert, Image } from 'react-native';
import { getDatabase, ref, get, update, onValue } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Filtrar from '../filtros/Filtrar';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../../../reducers/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Base64 } from 'js-base64';
import LoaderCompleto from '../../loading/loadingCompleto';
import { useAppDispatch } from '../../../reducers/hooks';
import { modificaOrdenacao } from '../../../reducers/filtrarReducer';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasVeganaApp'>

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

let recipesVeganas: any = [
  {
    email: '',
    id: 1,
    title: 'Tofu Grelhado com Gergelim',
    description: 'Crocante por fora, macio por dentro e cheio de sabor.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 15 min',
    image: require('../../../../assets/Receitas/ReceitasVeganas/tofu.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Tofu firme', quantidade: '200', medida: 'grama', id: 1 },
      { ing: 'Gergelim', quantidade: '2', medida: 'colher', id: 2 },
      { ing: 'Molho shoyu', quantidade: '2', medida: 'colher', id: 3 },
      { ing: 'Óleo de gergelim', quantidade: '1', medida: 'colher', id: 4 },
      { ing: 'Cebolinha picada', quantidade: '1', medida: 'grama', id: 5 }, // "a gosto" padronizado
    ],
    passos: [
      'Corte o tofu em fatias e seque com papel toalha.',
      'Pincele as fatias com molho shoyu e óleo de gergelim.',
      'Empane levemente no gergelim.',
      'Grelhe em frigideira antiaderente até dourar dos dois lados.',
      'Finalize com cebolinha picada e sirva.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 210,
    peso: 200,
    proteina: 35,
  },
  {
    email: '',
    id: 2,
    title: 'Curry de Grão-de-Bico',
    description: 'Um curry vegano cremoso, nutritivo e cheio de especiarias.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 45 min',
    image: require('../../../../assets/Receitas/ReceitasVeganas/curry.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Grão-de-bico cozido', quantidade: '2', medida: 'xícara', id: 1 },
      { ing: 'Tomate picado', quantidade: '2', medida: 'unidade', id: 2 },
      { ing: 'Cebola picada', quantidade: '1', medida: 'unidade', id: 3 },
      { ing: 'Alho picado', quantidade: '2', medida: 'unidade', id: 4 }, // dentes = unidade
      { ing: 'Leite de coco', quantidade: '200', medida: 'ml', id: 5 },
      { ing: 'Curry em pó', quantidade: '1', medida: 'colher', id: 6 },
      { ing: 'Azeite de oliva', quantidade: '1', medida: 'colher', id: 7 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 8 }, // "a gosto" padronizado
      { ing: 'Coentro fresco', quantidade: '1', medida: 'grama', id: 9 }, // "a gosto" padronizado
    ],
    passos: [
      'Aqueça o azeite em uma panela e refogue a cebola e o alho até dourar.',
      'Adicione o curry em pó e mexa até liberar aroma.',
      'Junte o tomate e cozinhe até desmanchar.',
      'Adicione o grão-de-bico, o leite de coco, sal e pimenta.',
      'Cozinhe por 15 minutos em fogo baixo, mexendo de vez em quando.',
      'Finalize com coentro fresco e sirva com arroz.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 340,
    peso: 350,
    proteina: 12,
  },
  {
    email: '',
    id: 3,
    title: 'Salada Morna de Batata-doce e Lentilha',
    description: 'Salada nutritiva e colorida, perfeita para qualquer refeição.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasVeganas/salada.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    refeicao: 'salada',
    ingredientes: [
      { ing: 'Batata-doce em cubos', quantidade: '2', medida: 'xícara', id: 1 },
      { ing: 'Lentilha cozida', quantidade: '1', medida: 'xícara', id: 2 },
      { ing: 'Cebola roxa fatiada', quantidade: '0.5', medida: 'unidade', id: 3 },
      { ing: 'Azeite de oliva', quantidade: '2', medida: 'colher', id: 4 },
      { ing: 'Salsinha picada', quantidade: '1', medida: 'grama', id: 5 }, // "a gosto" padronizado
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 6 }, // "a gosto" padronizado
      { ing: 'Limão', quantidade: '0.5', medida: 'unidade', id: 7 },
    ],
    passos: [
      'Cozinhe a batata-doce em água fervente até ficar macia, escorra e reserve.',
      'Em uma frigideira, aqueça o azeite e refogue a cebola até ficar levemente dourada.',
      'Adicione a lentilha cozida e a batata-doce, misture bem.',
      'Tempere com sal, pimenta, suco de limão e salsinha.',
      'Sirva morna ou em temperatura ambiente.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 260,
    peso: 300,
    proteina: 8,
  },
  {
    email: '',
    id: 4,
    title: 'Queijo Vegano Fermentado',
    description: 'Receita avançada com castanhas e fermentação natural.',
    dif: 'Mestre-cuca!',
    time: '⏱️ 2 horas+',
    image: require('../../../../assets/Receitas/ReceitasVeganas/queijo.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    refeicao: 'acompanhamento',
    ingredientes: [
      { ing: 'Castanha de caju crua', quantidade: '200', medida: 'grama', id: 1 },
      { ing: 'Água filtrada', quantidade: '0.5', medida: 'xícara', id: 2 },
      { ing: 'Suco de limão', quantidade: '2', medida: 'colher', id: 3 },
      { ing: 'Sal', quantidade: '1', medida: 'colher', id: 4 },
      { ing: 'Probiótico em pó', quantidade: '1', medida: 'unidade', id: 5 }, // cápsula = unidade
      { ing: 'Ervas finas', quantidade: '1', medida: 'grama', id: 6 }, // "a gosto" padronizado
    ],
    passos: [
      'Deixe as castanhas de caju de molho em água por 8 horas.',
      'Escorra e bata as castanhas com água filtrada, suco de limão e sal até formar um creme liso.',
      'Adicione o probiótico e misture bem.',
      'Transfira para um recipiente limpo, cubra com pano e deixe fermentar em local arejado por 24 a 36 horas.',
      'Misture ervas finas, modele e leve à geladeira até firmar.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 320,
    peso: 200,
    proteina: 22,
  },
  {
    email: '',
    id: 5,
    title: 'Risoto Vegano de Abóbora',
    description: 'Risoto cremoso feito com abóbora, arroz arbório e temperos naturais.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasVeganas/risoto.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Arroz arbório', quantidade: '1', medida: 'xícara', id: 1 },
      { ing: 'Abóbora cabotiá em cubos', quantidade: '2', medida: 'xícara', id: 2 },
      { ing: 'Cebola picada', quantidade: '0.5', medida: 'unidade', id: 3 },
      { ing: 'Alho picado', quantidade: '2', medida: 'unidade', id: 4 }, // dentes = unidade
      { ing: 'Caldo de legumes', quantidade: '1', medida: 'litro', id: 5 },
      { ing: 'Azeite de oliva', quantidade: '2', medida: 'colher', id: 6 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 7 }, // "a gosto" padronizado
      { ing: 'Salsinha picada', quantidade: '1', medida: 'grama', id: 8 }, // "a gosto" padronizado
    ],
    passos: [
      'Aqueça o azeite em uma panela e refogue a cebola e o alho até ficarem macios.',
      'Adicione a abóbora e refogue por alguns minutos.',
      'Junte o arroz arbório e misture bem.',
      'Adicione o caldo de legumes aos poucos, mexendo sempre, até o arroz ficar cremoso e al dente.',
      'Tempere com sal e pimenta.',
      'Finalize com salsinha picada e sirva quente.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 290,
    peso: 320,
    proteina: 6,
  },
];

export default function ReceitasVeganaApp({navigation}: Props) {
  const dispatch = useAppDispatch();
  let {ordenacao, refeicao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#eae244ff';
  const [emailB64, setEmailB64] = useState<string>('');
  const [receitaVeganaFavoritada, setReceita] = useState<number[]>([]);
  const [loadingReceitas, setLoadingReceitas] = useState<boolean>(true);
  const [loadingFavoritas, setLoadingFavoritas] = useState<boolean>(true);

  useEffect(() => {
    // Função que busca todas as receitas veganas e cria um nó para cada uma delas.
    try {
      dispatch(modificaOrdenacao('Ordenação Padrão'));
      setLoadingReceitas(true);
      const refReceita = ref(db, `ReceitasApp/vegetariano`);
      const listenerRefReceita = onValue(refReceita, async (snapshot) => {
          await buscaReceitas();
      });
      
      async function ReceitaFirebase() {
        try {
          await buscaReceitas();
          for (let i = 0; i < recipesVeganas.length; i++) {
            let refReceita = ref(db, `ReceitasApp/${recipesVeganas[i].tipo}/${recipesVeganas[i].id}`);
            let snapshot = await get(refReceita);
            if (!snapshot.exists()) {
              await update(refReceita, {
                ...recipesVeganas[i]
              });
            };
          };
        } catch (error) {
          console.log('Erro em ReceitaFirebase:', error);
        }
      };

      ReceitaFirebase();

      const user = onAuthStateChanged(authInstance, usuario => {
        if (!usuario || !usuario.email) return;
        setEmailB64(Base64.encode(usuario.email));
      });
      setLoadingReceitas(false);

      return () => {user(); listenerRefReceita();};
    } catch (error) {
      console.log('Erro no useEffect principal:', error);
    }
  }, [authInstance]);
  // Busca todas as receitas veganas e cria um nó pra elas, além de pegar o email do usuário.

  async function buscaReceitas() {
    try {
      const refReceita = ref(db, `ReceitasApp/vegano`);
      const snapshot = await get(refReceita);
      const dados = snapshot.val();
      const receitas = dados.filter(Boolean);
      
      for (let i = 0; i < recipesVeganas.length; i++) {
        recipesVeganas[i] = {
          ...recipesVeganas[i], 
          avaliacao: receitas[i].avaliacao, 
          comentarios: receitas[i].comentarios}
      };
    } catch (error) {
      console.log('Erro em buscaReceitas:', error);
    }
  }
  // Função que busca todas as receitas veganas do banco e atualiza o array local.

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
    // UseEffect que busca receitas favoritas sempre que tem uma mudança no nó ou email.
    try {
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
      setLoadingFavoritas(precisa_de_loading);
      const refOriginal = ref(db, `usuarios/${emailB64}/receitasFavoritas`);
      const snapshot = await get(refOriginal);
      if (snapshot.exists()) {
        const receitasFavoritadas = Object.values(snapshot.val()).filter(Boolean);
        const receitasFavoritadasVeganas = receitasFavoritadas.filter((r: any) => r.tipo === 'vegano' && r.email === '');
        setReceita(receitasFavoritadasVeganas.map((r: any) => r.id));
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
        <Text style={{textShadowColor: 'gray', textShadowRadius: 0.1, color: '#e0e641ff'}} className="opacity-98 text-5xl mt-2 p-[30px] font-bold mb-2 text-center">
          Receitas Veganas
        </Text>

          <View className="-mt-1">
            <Filtrar corDoFiltro={corDoFiltro} />
          </View>
          {/* Filtro das receitas */}

        <View className='p-[25px]'>
          {(ordenacao === 'Melhores Receitas' ?
          recipesVeganas.slice().sort((a: any, b: any) => b.avaliacao.media - a.avaliacao.media) // Filtra as receis com média maior - média menor.
          : ordenacao === 'Calorias' ? 
          recipesVeganas.slice().sort((a: any, b: any) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipesVeganas.slice().filter((receita: any) => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipesVeganas.slice().filter((receita: any) => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipesVeganas.slice().map((receita: any) => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a: any, b: any) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipesVeganas.slice().map((receita: any) => {
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
          :
          recipesVeganas
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
              colors={['#e5dc3aff', '#9d9135ff']}
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
                    name={Array.isArray(receitaVeganaFavoritada) ? receitaVeganaFavoritada.includes(recipe.id) ? "heart-sharp": "heart-outline" : "heart-outline"}
                    size={33} 
                    color="#3b3939b1"
                    />
                    <Ionicons 
                    className="absolute top-[2px] right-[2px] opacity-95" 
                    name={Array.isArray(receitaVeganaFavoritada) ? receitaVeganaFavoritada.includes(recipe.id) ? "heart-sharp": "heart-outline" : "heart-outline"}
                    size={32} 
                    color='#fb4949ff'/>   
                </TouchableOpacity>

                <View className="flex-1">
                  <Text className="font-bold text-[22px] mr-8 mb-1 text-amber-100">
                    {recipe.title}
                  </Text>
                  <Text className="text-neutral-100 font-medium text-[14px] mb-1">{recipe.description}</Text>
                  <Text style={{textShadowColor: 'black', textShadowRadius: 0.2}} className='text-[14px] text-white mb-1 font-bold'>
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
};
