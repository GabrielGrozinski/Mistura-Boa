import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, FlatList, Image } from 'react-native';
import { getDatabase, ref, get, set, update } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import Barra from '../Barra/Barra';
import LoaderCompleto from '../loading/loadingCompleto';

type Props = NativeStackScreenProps<TiposRotas, 'Dieta'>

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);


export default function Dieta({navigation}: Props) {
  const [dieta, setDieta] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função que pega todas as dietas criadas pelo usuário.
    const usuario = onAuthStateChanged(authInstance, async user => {
      try {
        if (!user || !user.email) return;
        const userId = Base64.encode(user.email)
        const dietaRef = ref(db, `usuarios/${userId}/dieta`);
        const snapshot = await get(dietaRef);

        if (snapshot.exists()) {
          const dietaData = snapshot.val();
          setDieta(dietaData.slice(1));
          console.log('dieta', dietaData.slice(1))
        };
        setLoading(false);
      } catch (erro) {
        console.log('Erro ao buscar dados da dieta', erro);
      }; 
    });

    return () => usuario();

  }, [authInstance]);
  {/* Buscando a(s) dieta(s) */}

  if (loading) return (
    <LoaderCompleto/>
  );

  return (
    <ImageBackground
        source={require('../../../assets/TelaPrincipal/capa2.png')}
        resizeMode='cover'
        className='flex-1'
    >
        <FlatList
          data={dieta}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerClassName='grow items-center'
          renderItem={({ item }: any) => (
            <View>
              <TouchableOpacity style={{elevation: 2, shadowColor: 'black'}} className='justify-center rounded-2xl items-center mt-12 bg-white flex-row w-[250px] h-20' onPress={() => false}>
                <Image className='w-14 h-14 mr-2' source={require('../../../assets/Fitness/dietaIcone.png')} />
                <View className=''>
                  <Text className='text-2xl font-bold'>
                    {item.nome}
                  </Text>
                    
                  <Text className='text-xl mt-1 text-neutral-500 font-semibold'>
                    {item.tipoDieta}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row bg-green-500 items-center justify-center h-[66px] p-2.5 rounded-2xl mt-5" onPress={() => navigation.navigate('CriarDieta')}>
                  <Image className='w-14 h-14 mr-2' source={require('../../../assets/Fitness/dietaIcone.png')} />
                  <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className="text-3xl font-bold text-white text-center">Criar dieta</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View className="mb-20">
              <Text className="text-3xl font-bold mb-5 text-center">Nenhuma dieta ainda...</Text>
              <Text className="text-2xl opacity-85 mb-5 text-center">Que tal criarmos a sua primeira?</Text>
              <Image className='h-[130px] w-[200px] self-center' source={require('../../../assets/Fitness/SemDieta.png')} />
              <TouchableOpacity className="flex-row bg-green-500 items-center justify-center h-[66px] p-2.5 rounded-2xl mt-5" onPress={() => navigation.navigate('CriarDieta')}>
                  <Image className='w-14 h-14 mr-2' source={require('../../../assets/Fitness/dietaIcone.png')} />
                  <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className="text-3xl font-bold text-white text-center">Criar dieta</Text>
              </TouchableOpacity>
            </View> 
          }
          />
      <View className="absolute -bottom-1">
        <Barra />
      </View>
    </ImageBackground>
  );
};
