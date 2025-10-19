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


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasVegetarianaApp'>

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

let recipesVegetarianas: any = [
  {
    email: '',
    id: 1,
    title: 'Omelete de Legumes',
    description: 'Omelete leve e saborosa com legumes variados.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 15 min',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/omelete.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Ovo', quantidade: '2', medida: 'unidade', id: 1 },
      { ing: 'Cebola picada', quantidade: '0.5', medida: 'unidade', id: 2 },
      { ing: 'Tomate picado', quantidade: '1', medida: 'unidade', id: 3 },
      { ing: 'Pimentão picado', quantidade: '0.25', medida: 'unidade', id: 4 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 5 }, // "a gosto" padronizado
      { ing: 'Azeite de oliva', quantidade: '1', medida: 'colher', id: 6 },
    ],
    passos: [
      'Bata os ovos com sal e pimenta.',
      'Aqueça o azeite em uma frigideira.',
      'Refogue a cebola, tomate e pimentão até ficarem macios.',
      'Despeje os ovos batidos sobre os legumes.',
      'Cozinhe em fogo baixo até firmar, dobre ao meio e sirva.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 210,
    peso: 180,
    proteina: 20,
  },
  {
    email: '',
    id: 2,
    title: 'Estrogonofe de Cogumelos',
    description: 'Um clássico em versão vegetariana.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/cogumelo.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Cogumelo fresco fatiado', quantidade: '200', medida: 'grama', id: 1 },
      { ing: 'Creme de leite', quantidade: '100', medida: 'ml', id: 2 },
      { ing: 'Cebola picada', quantidade: '0.5', medida: 'unidade', id: 3 },
      { ing: 'Molho de tomate', quantidade: '2', medida: 'colher', id: 4 },
      { ing: 'Azeite de oliva', quantidade: '1', medida: 'colher', id: 5 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 6 }, // "a gosto" padronizado
      { ing: 'Arroz branco cozido', quantidade: '1', medida: 'xícara', id: 7 }, // para acompanhar
    ],
    passos: [
      'Aqueça o azeite e refogue a cebola até dourar.',
      'Adicione os cogumelos e refogue até murcharem.',
      'Junte o molho de tomate, misture bem.',
      'Acrescente o creme de leite, tempere com sal e pimenta.',
      'Cozinhe por mais 2 minutos e sirva com arroz branco.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 260,
    peso: 250,
    proteina: 30,
  },
  {
    email: '',
    id: 3,
    title: 'Moqueca Vegetariana',
    description: 'Moqueca deliciosa sem ingredientes de origem animal.',
    dif: 'Difícil!',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/moqueca.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Palmito em rodelas', quantidade: '200', medida: 'grama', id: 1 },
      { ing: 'Tomate picado', quantidade: '2', medida: 'unidade', id: 2 },
      { ing: 'Pimentão em tiras', quantidade: '1', medida: 'unidade', id: 3 },
      { ing: 'Cebola em rodelas', quantidade: '1', medida: 'unidade', id: 4 },
      { ing: 'Leite de coco', quantidade: '200', medida: 'ml', id: 5 },
      { ing: 'Azeite de dendê', quantidade: '1', medida: 'colher', id: 6 },
      { ing: 'Coentro picado', quantidade: '1', medida: 'grama', id: 7 }, // "a gosto" padronizado
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 8 }, // "a gosto" padronizado
    ],
    passos: [
      'Em uma panela, faça camadas de cebola, tomate, pimentão e palmito.',
      'Tempere cada camada com sal, pimenta e coentro.',
      'Regue com leite de coco e azeite de dendê.',
      'Cozinhe em fogo baixo, com a panela tampada, por cerca de 30 minutos.',
      'Sirva quente, acompanhado de arroz branco.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 320,
    peso: 350,
    proteina: 6,
  },
  {
    email: '',
    id: 4,
    title: 'Macarrão com Espinafre',
    description: 'Macarrão com espinafre e queijo.',
    dif: 'Mestre-cuca!',
    time: '⏱️ 2 horas+',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/macarrao.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Macarrão tipo penne ou fusilli', quantidade: '250', medida: 'grama', id: 1 },
      { ing: 'Espinafre fresco', quantidade: '1', medida: 'unidade', id: 2 }, // maço = unidade
      { ing: 'Queijo parmesão ralado', quantidade: '50', medida: 'grama', id: 3 },
      { ing: 'Alho picado', quantidade: '2', medida: 'unidade', id: 4 }, // dentes = unidade
      { ing: 'Azeite de oliva', quantidade: '2', medida: 'colher', id: 5 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 6 }, // "a gosto" padronizado
      { ing: 'Creme de leite', quantidade: '100', medida: 'ml', id: 7 },
    ],
    passos: [
      'Cozinhe o macarrão em água fervente com sal até ficar al dente. Escorra e reserve.',
      'Em uma frigideira grande, aqueça o azeite e refogue o alho até dourar levemente.',
      'Adicione o espinafre e refogue até murchar.',
      'Junte o creme de leite, tempere com sal e pimenta e misture bem.',
      'Adicione o macarrão cozido à frigideira e envolva bem no molho.',
      'Finalize com queijo parmesão ralado por cima e sirva imediatamente.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 340,
    peso: 300,
    proteina: 14,
  },
  {
    email: '',
    id: 5,
    title: 'Lasanha de Berinjela',
    description: 'Uma lasanha leve e saborosa, feita com fatias de berinjela grelhadas.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/lasanha.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    refeicao: 'prato_principal',
    ingredientes: [
      { ing: 'Berinjela', quantidade: '2', medida: 'unidade', id: 1 },
      { ing: 'Molho de tomate', quantidade: '2', medida: 'xícara', id: 2 },
      { ing: 'Queijo mussarela ralado', quantidade: '150', medida: 'grama', id: 3 },
      { ing: 'Queijo parmesão ralado', quantidade: '50', medida: 'grama', id: 4 },
      { ing: 'Azeite de oliva', quantidade: '2', medida: 'colher', id: 5 },
      { ing: 'Sal e pimenta', quantidade: '1', medida: 'grama', id: 6 }, // "a gosto" padronizado
      { ing: 'Manjericão fresco', quantidade: '1', medida: 'grama', id: 7 }, // "a gosto" padronizado
    ],
    passos: [
      'Corte as berinjelas em fatias finas no sentido do comprimento.',
      'Grelhe as fatias em uma frigideira com azeite até dourarem dos dois lados.',
      'Em um refratário, faça camadas de berinjela, molho de tomate e queijo mussarela.',
      'Repita as camadas até acabarem os ingredientes, finalizando com molho e parmesão.',
      'Leve ao forno pré-aquecido a 200°C por cerca de 30 minutos.',
      'Decore com manjericão fresco e sirva quente.',
    ],
    avaliacao: { nota: 0, contador: 0, media: 0 },
    calorias: 290,
    peso: 320,
    proteina: 38,
  },
];

export default function ReceitasVegetarianaApp({navigation}: Props) {
  const dispatch = useAppDispatch();
  let {ordenacao, refeicao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#73c430ff';
  const [emailB64, setEmailB64] = useState<string>('');
  const [receitaVegetarianaFavoritada, setReceita] = useState<number[]>([]);
  const [loadingReceitas, setLoadingReceitas] = useState<boolean>(true);
  const [loadingFavoritas, setLoadingFavoritas] = useState<boolean>(true);

  useEffect(() => {
    // Função que busca todas as receitas vegetarianas e cria um nó para cada uma delas.
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
          for (let i = 0; i < recipesVegetarianas.length; i++) {
            let refReceita = ref(db, `ReceitasApp/${recipesVegetarianas[i].tipo}/${recipesVegetarianas[i].id}`);
            let snapshot = await get(refReceita);
            if (!snapshot.exists()) {
              await update(refReceita, {
                ...recipesVegetarianas[i]
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
  // Busca todas as receitas vegetarianas e cria um nó pra elas, além de pegar o email do usuário.

  async function buscaReceitas() {
    try {
      const refReceita = ref(db, `ReceitasApp/vegetariano`);
      const snapshot = await get(refReceita);
      const dados = snapshot.val();
      const receitas = dados.filter(Boolean);
      
      for (let i = 0; i < recipesVegetarianas.length; i++) {
        recipesVegetarianas[i] = {
          ...recipesVegetarianas[i], 
          avaliacao: receitas[i].avaliacao, 
          comentarios: receitas[i].comentarios}
      };
    } catch (error) {
      console.log('Erro em buscaReceitas:', error);
    }
  }
  // Função que busca todas as receitas vegetarianas do banco e atualiza o array local.

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
        const receitasFavoritadasVegetarianas = receitasFavoritadas.filter((r: any) => r.tipo === 'vegetariano' && r.email === '');
        setReceita(receitasFavoritadasVegetarianas.map((r: any) => r.id));
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
        <Text style={{textShadowColor: 'black', textShadowRadius: 0.1, color: '#73c430ff'}} className="opacity-98 text-5xl mt-2 p-[30px] font-bold mb-2 text-center">
          Receitas Vegetarianas
        </Text>

          <View className="-mt-1">
            <Filtrar corDoFiltro={corDoFiltro} />
          </View>
          {/* Filtro das receitas */}

        <View className='p-[25px]'>
          {(ordenacao === 'Melhores Receitas' ?
          recipesVegetarianas.slice().sort((a: any, b: any) => b.avaliacao.media - a.avaliacao.media) // Filtra as receis com média maior - média menor.
          : ordenacao === 'Calorias' ? 
          recipesVegetarianas.slice().sort((a: any, b: any) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipesVegetarianas.slice().filter((receita: any) => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipesVegetarianas.slice().filter((receita: any) => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipesVegetarianas.slice().map((receita: any) => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a: any, b: any) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipesVegetarianas.slice().map((receita: any) => {
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
          recipesVegetarianas
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
              colors={['#5cca2aff', '#4e6c2aff']}
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
                    name={Array.isArray(receitaVegetarianaFavoritada) ? receitaVegetarianaFavoritada.includes(recipe.id) ? "heart-sharp": "heart-outline" : "heart-outline"}
                    size={33} 
                    color="#3b3939b1"
                    />
                    <Ionicons 
                    className="absolute top-[2px] right-[2px] opacity-95" 
                    name={Array.isArray(receitaVegetarianaFavoritada) ? receitaVegetarianaFavoritada.includes(recipe.id) ? "heart-sharp": "heart-outline" : "heart-outline"}
                    size={32} 
                    color='#fb4949ff'/>   
                </TouchableOpacity>

                <View className="flex-1">
                  <Text className="font-bold text-[22px] mb-1 mr-8 text-amber-100">
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

{/* 
  
  Segue a mesma lógica das receitas carnívoras, mas com receitas vegetarianas.
 
*/} 
};
