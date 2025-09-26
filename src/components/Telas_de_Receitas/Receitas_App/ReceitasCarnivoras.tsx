import React, {useEffect} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { getDatabase, ref, get, update } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Filtrar from '../filtros/Filtrar';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '../../../reducers/hooks';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasCarnivoraApp'>

const app = getApp();
const db = getDatabase(app);


const recipesCarnivoras = [
  {
    email: null, // Não há email pois é uma receita padrão.
    id: 1, // Identificador da receita.
    title: 'Bife Grelhado com Alho', // Título.
    description: 'Suculento bife temperado com alho e ervas.', // Descrição.
    dif: 'Fácil de fazer!', // Dificuldade da receita.
    time: '⏱️ 15 min', // Tempo de preparo da receita.
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/bifeComAlho.png'), // Imagem da receita.
    autor: 'Mistura Boa', // Autor da receita. Como é uma receita padrão, o autor é o aplicativo.
    tipo: 'carnivoro', // Tipo da receita.
    ingredientes: [
      { ing: 'Bife de contrafilé', quantidade: '2', icone: '🥩' },
      { ing: 'Alho picado', quantidade: '2 dentes', icone: '🧄' },
      { ing: 'Azeite de oliva', quantidade: '1 colher de sopa', icone: '🫒' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Ervas frescas', quantidade: 'a gosto', icone: '🌿' },
    ], // Ingredientes da receita.
    passos: [
      'Tempere os bifes com sal, pimenta e alho.',
      'Aqueça o azeite em uma frigideira.',
      'Grelhe os bifes por 3-4 minutos de cada lado.',
      'Finalize com ervas frescas e sirva.',
    ], // Passos da receita.
    avaliacao: 
    { nota: 0, contador: 0, media: 0 }, // Sistema de avaliação da receita.
    
    // Esses três campos só servem para as receitas fitness.
    calorias: 320, // Quantidade de calorias da receita.
    peso: 350, // Peso em gramas ou quilos da receita.
    proteina: 75, // Quantidade de proteína. Muito importante para ganhar músculo.
  },
  {
    email: null,
    id: 2,
    title: 'Costela ao Forno',
    description: 'Costela assada lentamente, super macia!',
    dif: 'Um pouco complicada...',
    time: '⏱️ 1 hora+',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/costela.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    ingredientes: [
      { ing: 'Costela bovina', quantidade: '1 kg', icone: '🥩' },
      { ing: 'Alho amassado', quantidade: '4 dentes', icone: '🧄' },
      { ing: 'Cebola picada', quantidade: '1', icone: '🧅' },
      { ing: 'Sal grosso', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Pimenta-do-reino', quantidade: 'a gosto', icone: '🌶️' },
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
    email: null,
    id: 3,
    title: 'Hambúrguer Artesanal',
    description: 'Feito com carne de qualidade e tempero caseiro.',
    dif: 'Difícil!',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/hamburguer.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    ingredientes: [
      { ing: 'Carne moída', quantidade: '400g', icone: '🥩' },
      { ing: 'Sal e pimenta', quantidade: 'a gosto', icone: '🧂' },
      { ing: 'Pão de hambúrguer', quantidade: '2', icone: '🍞' },
      { ing: 'Queijo', quantidade: '2 fatias', icone: '🧀' },
      { ing: 'Alface e tomate', quantidade: 'a gosto', icone: '🥬' },
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
    email: null,
    id: 4,
    title: 'Wellington de Filé Mignon',
    description: 'Uma receita digna de chef profissional.',
    dif: 'Mestre-cuca!',
    time: '⏱️ 2 horas+',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/wellington.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    ingredientes: [
      { ing: 'Filé mignon', quantidade: '700g', icone: '🥩' },
      { ing: 'Massa folhada', quantidade: '1 pacote', icone: '🥐' },
      { ing: 'Cogumelos', quantidade: '200g', icone: '🍄' },
      { ing: 'Presunto cru', quantidade: '100g', icone: '🥓' },
      { ing: 'Mostarda', quantidade: '2 colheres de sopa', icone: '🌭' },
      { ing: 'Ovo', quantidade: '1', icone: '🥚' },
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
    email: null,
    id: 5,
    title: 'Pizza',
    description: 'Uma ótima e deliciosa pizza.',
    dif: 'Um pouco complicada...',
    time: '⏱️ 30 min',
    image: require('../../../../assets/Receitas/ReceitasCarnivoras/pizza.png'),
    autor: 'Mistura Boa',
    tipo: 'carnivoro',
    ingredientes: [
      { ing: 'Massa de pizza', quantidade: '1 disco', icone: '🍞' },
      { ing: 'Molho de tomate', quantidade: '4 colheres de sopa', icone: '🍅' },
      { ing: 'Queijo mussarela', quantidade: '150g', icone: '🧀' },
      { ing: 'Calabresa fatiada', quantidade: '100g', icone: '🥓' },
      { ing: 'Azeitonas', quantidade: 'a gosto', icone: '🫒' },
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
  const {ordenacao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#fd5a28ff';

  useEffect(() => {
    // Função que busca todas as receitas carnívoras e cria um nó para cada uma delas.
    async function ReceitaFirebase() {
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
  }, []);


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
          {(ordenacao === 'Calorias' ? 
          recipesCarnivoras.slice().sort((a, b) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipesCarnivoras.slice().filter(receita => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipesCarnivoras.slice().filter(receita => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipesCarnivoras.slice().map(receita => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a, b) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipesCarnivoras.slice().map(receita => {
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
          recipesCarnivoras

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
              colors={['#bd4c1fff', '#916040ff']}
              className="w-[100%] h-[100%] items-center flex-row"
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              >
                <Image
                  source={recipe.image}
                  className="w-[110px] h-[130px] rounded-xl mr-2"
                />
                <View className="flex-1">
                  <Text className="font-bold text-[22px] mb-1 text-amber-100">
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
};
