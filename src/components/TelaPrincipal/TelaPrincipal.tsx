import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, ImageBackground } from 'react-native';
import * as Progress from 'react-native-progress';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged, signOut} from '@react-native-firebase/auth';
import { getDatabase, get, ref } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import "../../../global.css";
import Barra from '../Barra/Barra';
import ImmersiveMode from 'react-native-immersive'

type Props = NativeStackScreenProps<TiposRotas, 'TelaPrincipal'>;

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);


export default function TelaPrincipal({navigation}: Props) {
  const [progressTopLeft, setProgressTopLeft] = useState(0);
  const [progressTopRight, setProgressTopRight] = useState(0);
  const [progressBottomLeft, setProgressBottomLeft] = useState(0);
  const [progressBottomRight, setProgressBottomRight] = useState(0);
  // Todas as barras começam com 0.  
  const [xpAtual, setXp] = useState(0);
  const [RCAtual, setRC] = useState(0);
  const [RGAtual, setRG] = useState(0);
  const [SeguidoresAtual, setSeguidores] = useState(0);
  
  const todasRefeicoes = [
    {
      img: require('../../../assets/TelaPrincipal/CafeDaManha.png'),
      texto: 'Café da Manhã',
      barra: 1
    },
    {
      img: require('../../../assets/TelaPrincipal/Almoco.png'),
      texto: 'Almoço',
      barra: 1
    },
    {
      img: require('../../../assets/TelaPrincipal/Sobremesa.png'),
      texto: 'Sobremesa',
      barra: 0.5
    },
    {
      img: require('../../../assets/TelaPrincipal/CafeDaTarde.png'),
      texto: 'Café da Tarde',
      barra: 0
    },
    {
      img: require('../../../assets/TelaPrincipal/Jantar.png'),
      texto: 'Jantar',
      barra: 0
    },
  ];

 
  useEffect(() => {
    ImmersiveMode.setImmersive(true);
    const listenerUser = onAuthStateChanged(authInstance, user => {
      if (!user || !user.email) return
    const emailB64 = Base64.encode(user.email);
    // Função que busca dados do usuário.
    async function buscaDados() {
      const refUsuario = ref(db, `usuarios/${emailB64}`);
      const snapshotUsuario = await get(refUsuario);
      const dadosUsuario = snapshotUsuario.val();
      const xp = dadosUsuario.xp;
      const receitasCriadas = dadosUsuario.quantReceitas;
      const receitasGeradas = dadosUsuario.receitasGeradas;
      const Seguidores = dadosUsuario.quantSeguidores;
      const xpBarra = xp/1000;
      const receitasCriadasBarra = receitasCriadas/10;
      const receitasGeradasBarra = receitasGeradas/10;
      const seguidoresBarra = Seguidores/5;
      setProgressTopLeft(xpBarra);
      setProgressTopRight(receitasCriadasBarra);
      setProgressBottomLeft(receitasGeradasBarra);
      setProgressBottomRight(seguidoresBarra);
      setXp(xp);
      setRG(receitasGeradas);
      setRC(receitasCriadas);
      setSeguidores(Seguidores);
    };
    buscaDados();
    });

    return () => listenerUser();
  
  }, [authInstance]);


  return (
    <ImageBackground
      source={require('../../../assets/TelaPrincipal/capa2.png')}
      resizeMode='cover'
      >
      <ScrollView contentContainerClassName='grow pb-[180px]'>
        <View className='items-center justify-center flex-1 w-full h-full'>
          <TouchableOpacity className="items-center justify-center absolute top-6 left-6" onPress={() => {navigation.navigate('primeiraTela'); signOut(authInstance)}}>
            <Image
              source={require('../../../assets/TelaPrincipal/user.png')}
              className="w-[85px] h-[85px] "
            />
          </TouchableOpacity>
          <View className="items-center justify-center h-[40px] w-[130px] absolute top-12 right-6 rounded-full bg-[#fffdf2ff] flex-row">
            <Text className='text-2xl ml-1'>🍪</Text>
            <Text className='text-xl font-bold text-[#3A2C1A] self-center ml-2 mr-2'>0</Text>
          </View>
          
          {/* Retângulo "cartão" central */}
          <View className="w-[75%] h-4/5 items-center justify-start">
            {todasRefeicoes.map((refeicao, index) => (

            <View key={index} className='justify-start items-center'>
            <Image
            className='w-[100px] h-[100px] rounded-full'
            source={refeicao.img}
            />
            <Text className='text-2xl font-bold text-[#3A2C1A] self-center text-center mt-2'>{refeicao.texto}</Text>
            {index !== 4 && (
            <Progress.Bar 
            progress={refeicao.barra} 
            width={60} height={8} color="#6BB972" 
            unfilledColor="#FFF3C4" borderWidth={0} 
            borderRadius={10} style={{ transform: [{ rotate: '-270deg' }, {translateX: 35}] }}
            className="mb-[50px]" />
            )}
            </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className='absolute -bottom-1'>
        <Barra />
      </View>
    </ImageBackground>
  );
};
