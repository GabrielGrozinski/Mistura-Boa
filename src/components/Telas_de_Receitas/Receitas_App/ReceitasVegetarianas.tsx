import React, {useEffect} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { getDatabase, ref, get, update } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Filtrar from '../filtros/Filtrar';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../../../reducers/hooks';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasVegetarianaApp'>

const app = getApp();
const db = getDatabase(app);

const recipesVegetarianas = [
  {
    id: '1',
    title: 'Omelete de Legumes',
    description: 'Omelete leve e saborosa com legumes variados.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 15 min',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/omelete.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    ingredientes: [
      { ing: 'Ovos', quantidade: '2', icone: '🥚' },
      { ing: 'Cebola picada', quantidade: '1/2', icone: '🧅' },
      { ing: 'Tomate picado', quantidade: '1', icone: '🍅' },
      { ing: 'Pimentão picado', quantidade: '1/4', icone: '🫑' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Azeite de oliva', quantidade: '1 colher de chá', icone: '🫒' },
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
    id: '2',
    title: 'Estrogonofe de Cogumelos',
    description: 'Um clássico em versão vegetariana.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/cogumelo.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    ingredientes: [
      { ing: 'Cogumelos frescos fatiados', quantidade: '200g', icone: '🍄' },
      { ing: 'Creme de leite', quantidade: '100ml', icone: '🥛' },
      { ing: 'Cebola picada', quantidade: '1/2', icone: '🧅' },
      { ing: 'Molho de tomate', quantidade: '2 colheres de sopa', icone: '🍅' },
      { ing: 'Azeite de oliva', quantidade: '1 colher de sopa', icone: '🫒' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Arroz branco cozido', quantidade: 'para acompanhar', icone: '🍚' },
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
    id: '3',
    title: 'Moqueca Vegetariana',
    description: 'Moqueca deliciosa sem ingredientes de origem animal.',
    dif: 'Difícil!',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/moqueca.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    ingredientes: [
      { ing: 'Palmito em rodelas', quantidade: '200g', icone: '🌴' },
      { ing: 'Tomate picado', quantidade: '2', icone: '🍅' },
      { ing: 'Pimentão em tiras', quantidade: '1', icone: '🫑' },
      { ing: 'Cebola em rodelas', quantidade: '1', icone: '🧅' },
      { ing: 'Leite de coco', quantidade: '200ml', icone: '🥥' },
      { ing: 'Azeite de dendê', quantidade: '1 colher de sopa', icone: '🟠' },
      { ing: 'Coentro picado', quantidade: 'a gosto', icone: '🌿' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
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
    id: '4',
    title: 'Macarrão com Espinafre',
    description: 'Macarrão com espinafre e queijo.',
    dif: 'Mestre-cuca!',
    time: '⏱️ 2 horas+',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/macarrao.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    ingredientes: [
      { ing: 'Macarrão tipo penne ou fusilli', quantidade: '250g', icone: '🍝' },
      { ing: 'Espinafre fresco', quantidade: '1 maço', icone: '🥬' },
      { ing: 'Queijo parmesão ralado', quantidade: '50g', icone: '🧀' },
      { ing: 'Alho picado', quantidade: '2 dentes', icone: '🧄' },
      { ing: 'Azeite de oliva', quantidade: '2 colheres de sopa', icone: '🫒' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Creme de leite', quantidade: '100ml', icone: '🥛' },
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
    id: '5',
    title: 'Lasanha de Berinjela',
    description: 'Uma lasanha leve e saborosa, feita com fatias de berinjela grelhadas.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasVegetarianas/lasanha.png'),
    autor: 'Mistura Boa',
    tipo: 'vegetariano',
    ingredientes: [
      { ing: 'Berinjela', quantidade: '2 médias', icone: '🍆' },
      { ing: 'Molho de tomate', quantidade: '2 xícaras', icone: '🍅' },
      { ing: 'Queijo mussarela ralado', quantidade: '150g', icone: '🧀' },
      { ing: 'Queijo parmesão ralado', quantidade: '50g', icone: '🧀' },
      { ing: 'Azeite de oliva', quantidade: '2 colheres de sopa', icone: '🫒' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Manjericão fresco', quantidade: 'a gosto', icone: '🌿' },
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
  const {ordenacao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#73c430ff';

  useEffect(() => {
    async function ReceitaFirebase() {
      for (let i = 0; i < recipesVegetarianas.length; i++) {
        let refReceita = ref(db, `ReceitasApp/${recipesVegetarianas[i].tipo}/${recipesVegetarianas[i].id}`);
        let snapshot = await get(refReceita);
        if (!snapshot.exists()) {
          await update(refReceita, {
          ...recipesVegetarianas[i]
        });
        };
      };
    };
    ReceitaFirebase();
  }, []);


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
          {(ordenacao === 'Calorias' ? 
          recipesVegetarianas.slice().sort((a, b) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipesVegetarianas.slice().filter(receita => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipesVegetarianas.slice().filter(receita => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipesVegetarianas.slice().map(receita => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a, b) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipesVegetarianas.slice().map(receita => {
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
          }).sort((a, b) => a.idDificuldade - b.idDificuldade) // Filtra as receitas em mais fácil - mais difícil.
          :
          recipesVegetarianas

          ).map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              activeOpacity={0.8}
              className="rounded-2xl mb-4 overflow-hidden flex-row items-center"
              style={{
                elevation: 5,
                shadowColor: 'black'
              }}
              onPress={() => false}
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
                <View className="flex-1">
                  <Text className="font-bold text-[22px] mb-1 text-amber-100">
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
