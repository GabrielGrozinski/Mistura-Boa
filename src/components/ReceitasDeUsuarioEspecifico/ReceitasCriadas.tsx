import React, {useState, useEffect} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { getDatabase, ref, get} from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import type { TiposRotas } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Filtrar from '../Telas_de_Receitas/filtros/Filtrar';
import { useAppSelector } from '../../reducers/hooks';
import LinearGradient from 'react-native-linear-gradient';
import LoaderCompleto from '../loading/loadingCompleto';
import { useAppDispatch } from '../../reducers/hooks';
import { modificaOrdenacao } from '../../reducers/filtrarReducer';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasCriadas'>;

const app = getApp();
const db = getDatabase(app);


export default function ReceitasCriadas({route, navigation}: Props) {
  const dispatch = useAppDispatch();
  const [recipes, setRecipes] = useState<any>([]);
  const {nome, usuarioAtual} = route.params;
  const {ordenacao, refeicao} = useAppSelector(state => state.filtro);
  const [loadingBuscaReceita, setLoadingBuscaReceita] = useState<boolean>(false);


  useEffect(() => {
    dispatch(modificaOrdenacao('Ordenação Padrão'));
    if (!usuarioAtual) {
      console.error('Usuário não autenticado');
      return;
    };
    buscaReceita();
  }, [usuarioAtual]);
  // Chama a função buscaReceita.

  async function buscaReceita() {
    setLoadingBuscaReceita(false);
    try {
      const refReceita = ref(db, `usuarios/${usuarioAtual}/receitas`);
      const snapshot = await get(refReceita);
      const dados = snapshot.val();
      let receitas = dados.filter(Boolean);
      setRecipes(receitas);
      setLoadingBuscaReceita(true);
    } catch (erro) {
      setLoadingBuscaReceita(true);
      console.log('Erro ao buscar receitas criadas', erro);
    };
  };
  // Função que busca as receitas criadas.

  const corDoFiltro = "#ff2323ff";

  if (!loadingBuscaReceita) return (
    <LoaderCompleto/>
  );

  return (
    <ImageBackground resizeMode='cover' source={require('../../../assets/TelaPrincipal/capa2.png')} className="flex-1">
      <StatusBar hidden />
      <ScrollView>
        <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className="opacity-98 text-6xl mt-2 p-[30px] font-bold text-red-500 mb-2 text-center">
          Receitas Criadas do {nome}
        </Text>

          <View className="-mt-1">
            <Filtrar corDoFiltro={corDoFiltro} />
          </View>
          {/* Filtro das receitas */}

        <View className='p-[25px]'>

          {(ordenacao === 'Calorias' ? 
          recipes.slice().sort((a: any, b: any) => a.calorias - b.calorias) // Filtra as receitas em menos caloria - mais caloria.
          : ordenacao === 'Ganhar Músculo' ?
          recipes.slice().filter((receita: any) => receita.proteina / receita.peso >= 0.1) // Filtra as receitas com mais de 0.1g de proteina por grama.
          : ordenacao === 'Emagrecer' ? 
          recipes.slice().filter((receita: any) => receita.calorias / receita.peso < 2) // Filtra as receitas com menos de 2 calorias por grama.
          : ordenacao === 'Tempo de Preparo' ?
          recipes.slice().map((receita: any) => {
            const partes: any = receita.time.split(' ');
            let tempo = parseInt(partes[1]);
            let medidaDeTempo = partes[2];
            if (medidaDeTempo !== 'min' && !isNaN(tempo)) tempo = tempo*60;
            return {...receita, idTempo: tempo};
          }).sort((a: any, b: any) => a.idTempo - b.idTempo) // Filtra as receitas em menos tempo - mais tempo.
          : ordenacao === 'Facilidade' ? recipes.slice().map((receita: any) => {
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
          recipes
          ).filter((receita: any) => refeicao === 'Todas' ? true : receita.refeicao === refeicao).
          map((recipe: any) => (
            <TouchableOpacity
              key={recipe.idUsuario}
              className="rounded-2xl min-h-[130px] mb-4 overflow-hidden flex-row items-center"
              style={{
                elevation: 5,
                shadowColor: 'black'
              }}
              onPress={() => navigation.navigate('Receita', {recipe: recipe})}
            >
              
              <LinearGradient
              colors={[`${recipe.tipo === 'carnivoro' ? '#bd4c1fff' : recipe.tipo === 'vegano' ? '#e5dc3aff' : '#5cca2aff'}`, 
                `${recipe.tipo === 'carnivoro' ? '#916040ff' : recipe.tipo === 'vegano' ? '#9d9135ff' : '#4e6c2aff'}`
              ]}
              className="w-[100%] h-[100%] items-center flex-row"
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              >
                <Image
                  source={recipe.email === '' ? recipe.image : {uri: recipe.image}}
                  className="w-[110px] h-full rounded-xl mr-2"
                />

                <View className="flex-1">
                  <Text className="font-bold text-[22px] mb-1 mr-8 text-amber-100">
                    {recipe.title}
                  </Text>
                  <Text className="text-neutral-100 font-medium text-[14px] mb-1">{recipe.description}</Text>
                  <Text style={{textShadowColor: 'black', textShadowRadius: 0.2}} className='text-[14px] mb-1 text-white font-bold'>
                    {recipe.time}  •  {recipe.dificuldade}
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
