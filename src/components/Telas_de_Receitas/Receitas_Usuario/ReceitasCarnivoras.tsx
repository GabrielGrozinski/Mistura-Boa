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


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasCarnivoraUsuarios'>

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);


export default function ReceitasCarnivoraUsuarios({navigation}: Props) {
  const dispatch = useAppDispatch();
  let {ordenacao} = useAppSelector(state => state.filtro);
  const corDoFiltro = '#fd5a28ff';
  const [emailB64, setEmailB64] = useState<string>('');
  const [receitaCarnivoraFavoritada, setReceita] = useState<number[]>([]);
  const [loadingReceitas, setLoadingReceitas] = useState<boolean>(true);
  const [loadingFavoritas, setLoadingFavoritas] = useState<boolean>(true);
  const [recipesCarnivoras, setRecipesCarnivoras] = useState<any[]>([]);
  

  useEffect(() => {
    // Função que busca todas as receitas carnívoras e cria um nó para cada uma delas.
    dispatch(modificaOrdenacao('Ordenação Padrão'));
    setLoadingReceitas(true);
    
    async function ReceitaFirebase() {
      await buscaReceitas();
      const refReceita = ref(db, `ReceitasUsuarios/carnivoro`);
      onValue(refReceita, async (snapshot) => {
        await buscaReceitas();
      });
      await buscaReceitas();
    };

    ReceitaFirebase();

    const user = onAuthStateChanged(authInstance, usuario => {
      if (!usuario || !usuario.email) return;
      setEmailB64(Base64.encode(usuario.email));
    });
    setLoadingReceitas(false);

    return () => user();
  }, [authInstance]);

  async function buscaReceitas() {
    try {  
      const refReceita = ref(db, `ReceitasUsuarios/carnivoro`);
      const snapshot = await get(refReceita);
      const dados = snapshot.val();
      let receitas = dados.filter(Boolean);
      setRecipesCarnivoras(receitas);
    
    } catch (erro) {
      console.log('Erro ao fazer requisição', erro);
    };

  };

  const adicionaFavorito = async (recipe: any) => {
    // Função que adiciona a receita em sua lista de favoritos.
    try {
      let receitaFavoritada = false;
      
      const refOriginal = ref(db, `usuarios/${emailB64}/receitasFavoritas`);
      onValue(refOriginal, async (snapshot) => {
        if (snapshot.exists()) {
          const receitasFavoritadas = Object.values(snapshot.val()).slice(1);
          const verifica_se_ja_existe = receitasFavoritadas.some((r: any) => r.id === recipe.id && r.tipo === recipe.tipo && r.autor === recipe.autor);
          receitaFavoritada = verifica_se_ja_existe;
          // Verifica se a receita que está prestes a ser favoritada já existe na lista de favoritos do usuário.
          // A verificação é feita analisando o id, tipo e autor, pois são os únicos atributos que diferenciam uma receita de outra.
          // O id pode ser o mesmo se o tipo for diferente, e o autor também pode ser o mesmo se o tipo for diferente.
          // Por isso é importante verificar os 3 ao mesmo tempo.
          // Se a receita já foi favoritada, retorna true; senão, false.
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
      // O campo idChildren serve para organizar as receitas favoritadas na ordem que o usuário as favoritou.
      Alert.alert('Receita Favoritada', 'A receita foi adicionada aos seus favoritos!');
      
    } catch (erro: any) {
      console.log('Erro:', erro.message)
    };
  };

  onValue(ref(db, `usuarios/${emailB64}/receitasFavoritas`), async snapshot => await buscaReceitasFavoritas(false));

  async function buscaReceitasFavoritas(precisa_de_loading: boolean): Promise<void> {
    setLoadingFavoritas(precisa_de_loading);
    const refOriginal = ref(db, `usuarios/${emailB64}/receitasFavoritas`);
    const snapshot = await get(refOriginal);
    if (snapshot.exists()) {
      const receitasFavoritadas = Object.values(snapshot.val()).slice(1);
      const receitasFavoritadasCarnivoras = receitasFavoritadas.filter((r: any) => r.tipo === 'carnivoro' && r.email !== '');
      setReceita(receitasFavoritadasCarnivoras.map((r: any) => r.id));
    };
    setLoadingFavoritas(false);
  };

  useEffect(() => {
    buscaReceitasFavoritas(true);
  }, [emailB64]);

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
          recipesCarnivoras.slice().sort((a: any, b: any) => b.avaliacao.media - a.avaliacao.media) // Filtra as receitas com média maior - média menor.
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
          :
          recipesCarnivoras

          ).map((recipe: any) => (
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
                  source={{uri: recipe.image}}
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
