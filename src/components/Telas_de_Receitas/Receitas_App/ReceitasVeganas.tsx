import React, {useEffect} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { getDatabase, ref, get, update } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Filtrar from '../filtros/Filtrar';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../../../reducers/hooks';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasVeganaApp'>

const app = getApp();
const db = getDatabase(app);

const recipesVeganas = [
  {
    id: '1',
    title: 'Tofu Grelhado com Gergelim',
    description: 'Crocante por fora, macio por dentro e cheio de sabor.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 15 min',
    image: require('../../../../assets/Receitas/ReceitasVeganas/tofu.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    ingredientes: [
      { ing: 'Tofu firme', quantidade: '200g', icone: '🍥' },
      { ing: 'Gergelim', quantidade: '2 colheres de sopa', icone: '🌱' },
      { ing: 'Molho shoyu', quantidade: '2 colheres de sopa', icone: '🥣' },
      { ing: 'Óleo de gergelim', quantidade: '1 colher de chá', icone: '🫒' },
      { ing: 'Cebolinha picada', quantidade: 'a gosto', icone: '🌿' },
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
    id: '2',
    title: 'Curry de Grão-de-Bico',
    description: 'Um curry vegano cremoso, nutritivo e cheio de especiarias.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 45 min',
    image: require('../../../../assets/Receitas/ReceitasVeganas/curry.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    ingredientes: [
      { ing: 'Grão-de-bico cozido', quantidade: '2 xícaras', icone: '🧆' },
      { ing: 'Tomate picado', quantidade: '2', icone: '🍅' },
      { ing: 'Cebola picada', quantidade: '1', icone: '🧅' },
      { ing: 'Alho picado', quantidade: '2 dentes', icone: '🧄' },
      { ing: 'Leite de coco', quantidade: '200ml', icone: '🥥' },
      { ing: 'Curry em pó', quantidade: '1 colher de sopa', icone: '🌶️' },
      { ing: 'Azeite de oliva', quantidade: '1 colher de sopa', icone: '🫒' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Coentro fresco', quantidade: 'a gosto', icone: '🌿' },
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
    id: '3',
    title: 'Salada Morna de Batata-doce e Lentilha',
    description: 'Salada nutritiva e colorida, perfeita para qualquer refeição.',
    dif: 'Fácil de fazer!',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasVeganas/salada.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    ingredientes: [
      { ing: 'Batata-doce em cubos', quantidade: '2 xícaras', icone: '🍠' },
      { ing: 'Lentilha cozida', quantidade: '1 xícara', icone: '🌱' },
      { ing: 'Cebola roxa fatiada', quantidade: '1/2', icone: '🧅' },
      { ing: 'Azeite de oliva', quantidade: '2 colheres de sopa', icone: '🫒' },
      { ing: 'Salsinha picada', quantidade: 'a gosto', icone: '🌿' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Limão', quantidade: '1/2', icone: '🍋' },
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
    id: '4',
    title: 'Queijo Vegano Fermentado',
    description: 'Receita avançada com castanhas e fermentação natural.',
    dif: 'Mestre-cuca!',
    time: '⏱️ 2 horas+',
    image: require('../../../../assets/Receitas/ReceitasVeganas/queijo.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    ingredientes: [
      { ing: 'Castanha de caju crua', quantidade: '200g', icone: '🥜' },
      { ing: 'Água filtrada', quantidade: '1/2 xícara', icone: '💧' },
      { ing: 'Suco de limão', quantidade: '2 colheres de sopa', icone: '🍋' },
      { ing: 'Sal', quantidade: '1 colher de chá', icone: '🧂' },
      { ing: 'Probiótico em pó', quantidade: '1 cápsula', icone: '🦠' },
      { ing: 'Ervas finas', quantidade: 'a gosto', icone: '🌿' },
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
    id: '5',
    title: 'Risoto Vegano de Abóbora',
    description: 'Risoto cremoso feito com abóbora, arroz arbório e temperos naturais.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasVeganas/risoto.png'),
    autor: 'Mistura Boa',
    tipo: 'vegano',
    ingredientes: [
        { ing: 'Arroz arbório', quantidade: '1 xícara', icone: '🍚' },
        { ing: 'Abóbora cabotiá em cubos', quantidade: '2 xícaras', icone: '🎃' },
        { ing: 'Cebola picada', quantidade: '1/2', icone: '🧅' },
        { ing: 'Alho picado', quantidade: '2 dentes', icone: '🧄' },
        { ing: 'Caldo de legumes', quantidade: '1 litro', icone: '🥣' },
        { ing: 'Azeite de oliva', quantidade: '2 colheres de sopa', icone: '🫒' },
        { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
        { ing: 'Salsinha picada', quantidade: 'a gosto', icone: '🌿' },
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
  const {ordenacao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#eae244ff';

  useEffect(() => {
    async function ReceitaFirebase() {
      for (let i = 0; i < recipesVeganas.length; i++) {
        let refReceita = ref(db, `ReceitasApp/${recipesVeganas[i].tipo}/${recipesVeganas[i].id}`);
        let snapshot = await get(refReceita);
        if (!snapshot.exists()) {
          await update(refReceita, {
          ...recipesVeganas[i]
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
        <Text style={{textShadowColor: 'gray', textShadowRadius: 0.1, color: '#e0e641ff'}} className="opacity-98 text-5xl mt-2 p-[30px] font-bold mb-2 text-center">
          Receitas Veganas
        </Text>

          <View className="-mt-1">
            <Filtrar corDoFiltro={corDoFiltro} />
          </View>
          {/* Filtro das receitas */}

        <View className='p-[25px]'>
          {(ordenacao === 'Calorias' ? 
          recipesVeganas.slice().sort((a, b) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipesVeganas.slice().filter(receita => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipesVeganas.slice().filter(receita => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipesVeganas.slice().map(receita => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a, b) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipesVeganas.slice().map(receita => {
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
          recipesVeganas

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
              colors={['#e5dc3aff', '#9d9135ff']}
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
