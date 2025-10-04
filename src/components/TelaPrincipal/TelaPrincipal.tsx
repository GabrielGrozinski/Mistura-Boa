import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, Text, ImageBackground, Pressable } from 'react-native';
import * as Progress from 'react-native-progress';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { Base64 } from 'js-base64';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import "../../../global.css";
import Barra from '../Barra/Barra';
import ImmersiveMode from 'react-native-immersive';
import { TipoDeAlimentacao, QuantXP } from '../Perfil/buscaDados';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { modificaRefeicao } from '../../reducers/filtrarReducer';
import { modificaAlmoco, modificaJantar, modificaCafeDaManha, modificaSobremesa } from '../../reducers/refeicoesReducer';


type Props = NativeStackScreenProps<TiposRotas, 'TelaPrincipal'>;

const app = getApp();
const authInstance = auth(app);


export default function TelaPrincipal({navigation}: Props) {
  const dispatch = useAppDispatch();
  const {barraCafeDaManha, barraAlmoco, barraSobremesa, barraJantar} = useAppSelector(state => state.refeicoes);
  // Todas as barras começam com 0.
  
  const [XP, setXp] = useState(0);
  const tela_de_receita = useRef<any>('');
  
  const todasRefeicoes = [
    {
      img: require('../../../assets/TelaPrincipal/CafeDaManha.png'),
      texto: 'Café da Manhã',
      barra: barraCafeDaManha,
      filtro: 'cafe_da_manha',
      troca: modificaCafeDaManha(1)
    },
    {
      img: require('../../../assets/TelaPrincipal/Almoco.png'),
      texto: 'Almoço',
      barra: barraAlmoco,
      filtro: 'prato_principal',
      troca: modificaAlmoco(1)
    },
    {
      img: require('../../../assets/TelaPrincipal/Sobremesa.png'),
      texto: 'Sobremesa',
      barra: barraSobremesa,
      filtro: 'sobremesa',
      troca: modificaSobremesa(1)
    },
    {
      img: require('../../../assets/TelaPrincipal/Jantar.png'),
      texto: 'Jantar',
      barra: barraJantar,
      filtro: 'prato_principal',
      troca: modificaJantar(1)
    },
  ];
 
  useEffect(() => {
    ImmersiveMode.setImmersive(true);
    const usuario = onAuthStateChanged(authInstance, user => {
      if (!user || !user.email) return
      const emailB64 = Base64.encode(user.email);
      buscaDados(emailB64)
      // Função que busca dados do usuário.
    });

    return () => usuario();
  
  }, [authInstance]);

  async function buscaDados(email: string) {
    const xp = await QuantXP(email);
    setXp(xp);
    const tipoAlimentacao = await TipoDeAlimentacao(email);
    if (tipoAlimentacao[0] === 'carnivoro') {
      tela_de_receita.current = 'ReceitasCarnivoraApp';
    } else if (tipoAlimentacao[0] === 'vegano') {
      tela_de_receita.current = 'ReceitasVeganaApp';
    } else if (tipoAlimentacao[0] === 'vegetariano') {
      tela_de_receita.current = 'ReceitasVegetarianaApp';
    } else {
      const numeroAleatorio = Math.random();
      numeroAleatorio < 0.3 ? tela_de_receita.current = 'ReceitasCarnivoraApp'
      : numeroAleatorio < 0.6 ? tela_de_receita.current = 'ReceitasVeganaApp'
      : tela_de_receita.current = 'ReceitasVegetarianaApp';
    };
  };


  return (
    <ImageBackground
      source={require('../../../assets/TelaPrincipal/capa2.png')}
      resizeMode='cover'
      >
      <ScrollView contentContainerClassName='grow pb-[180px]'>
        <View className='items-center justify-center flex-1 w-full h-full'>
          <View className="items-center justify-center absolute top-6 left-6">
            <Image
              source={require('../../../assets/TelaPrincipal/user.png')}
              className="w-[85px] h-[85px] "
            />
          </View>
          <View className="items-center justify-center h-[40px] w-[130px] absolute top-12 right-6 rounded-full bg-[#fffdf2ff] flex-row">
            <Text className='text-2xl ml-1'>🍪</Text>
            <Text className='text-xl font-bold text-[#3A2C1A] self-center ml-2 mr-2'>{XP}</Text>
          </View>
          
          {/* Retângulo "cartão" central */}
          <View className="w-[75%] h-4/5 items-center justify-start">
            {todasRefeicoes.map((refeicao, index) => (
            <Pressable onPress={() => {
              navigation.navigate(tela_de_receita.current);
              dispatch(modificaRefeicao(refeicao.filtro));
              dispatch(refeicao.troca);
              }}
              key={index}
              className='justify-start items-center'
              disabled={refeicao.barra === 1}
              >
             
              <Image
              className={`w-[100px] h-[100px] rounded-full ${refeicao.barra === 0 && 'opacity-60'}`}
              source={refeicao.img}
              />
              <Text className='text-2xl font-bold text-[#3A2C1A] self-center text-center mt-2'>{refeicao.texto}</Text>
              {index !== 3 && (
              <Progress.Bar 
              progress={refeicao.barra} 
              width={60} height={8} color="#6BB972" 
              unfilledColor="#FFF3C4" borderWidth={0} 
              borderRadius={10} style={{ transform: [{ rotate: '-270deg' }, {translateX: 35}] }}
              className="mb-[50px]" />
              )}

            </Pressable>
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
