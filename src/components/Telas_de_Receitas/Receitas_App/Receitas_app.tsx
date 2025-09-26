import React, {useEffect, useState, useRef} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { TipoDeAlimentacao } from '../../Perfil/buscaDados';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import { Base64 } from 'js-base64';
import Barra from '../../Barra/Barra';


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasApp'>

const app = getApp()
const authInstance = auth(app)

export default function ReceitasApp({navigation}: Props) {
    const [card, setCard] = useState<any>([]);
    const [tipo_de_alimentacao, setTipo_de_Alimentacao] = useState('');
    const [timer, setTimer] = useState('Qualquer tempo ⏱️');
 
    useEffect(() => { 
          
      const user = onAuthStateChanged(authInstance, async usuario => {
        if (!usuario || !usuario.email) return;
        const usuarioAtual = Base64.encode(usuario.email)
        const alimentacaoEscolhida = await TipoDeAlimentacao(usuarioAtual);
        setTipo_de_Alimentacao(alimentacaoEscolhida[0]);
      });
    
      return () => user();
      // Busca o tipo de alimentação do usuário (carnívoro, vegano, vegetariano).
    }, [authInstance]);

    useEffect(() => {
      // Define os cards de receitas.
      // Define o tipoCard com base na escolha do usuário.
      
      const cards = [
        
        {
          id: 1,
          category: 'CARNÍVORO',
          title: 'Você come de tudo um pouco? Então aqui é o seu lugar!',
          image: require('../../../../assets/Receitas/carnivora.png'),
          tipoCard: tipo_de_alimentacao == 'carnivoro' ? true : false,
          tipoCardId: 'ReceitasCarnivoraAppBASE',
        
        },
        {
          id: 2,
          category: 'VEGETARIANO',
          title: 'Não come carne, mas quer aproveitar receitas incríveis? Esse é o ideal!',
          image: require('../../../../assets/Receitas/vegetariano.png'),
          tipoCard: tipo_de_alimentacao == 'vegetariano' ? true : false,
          tipoCardId: 'ReceitasVegetarianaAppBASE',
        },
        {
          id: 3,
          category: 'VEGANO',
          title: 'Quer continuar comendo comidas deliciosas sem nenhuma presença animal? Essa é a melhor opção!',
          image: require('../../../../assets/Receitas/vegano.png'),
          tipoCard: tipo_de_alimentacao == 'vegano' ? true : false,
          tipoCardId: 'ReceitasVeganaAppBASE',
        },
      ];
      setCard(cards);

    }, [tipo_de_alimentacao]);


  return (
    <ImageBackground
    className='flex-1'
    resizeMode='cover'
    source={require('../../../../assets/TelaPrincipal/capa2.png')}>

      <StatusBar hidden />
      <Text className="text-[28px] font-bold text-[#A83232] text-center my-[18px] tracking-[1px]">
        Receitas do Aplicativo
      </Text>
      
      <View className='pb-[140px]'>
        <ScrollView className="grow p-4">
          {card.map((card: any) => (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.8}
              className="bg-[#F5F5F5] rounded-xl mb-5 overflow-hidden shadow"
              onPress={() => navigation.navigate(card.tipoCardId)}
            >
              <Image
                source={card.image}
                className="w-full h-[150px]"
                resizeMode="cover"
              />
              <View className="p-3">
                <View className="flex-row items-center mb-[6px]">
                  <View className="w-full flex-row justify-between">
                    <View className="bg-[#FFECAA] rounded px-[6px] py-[2px]">
                      <Text className="text-[12px] font-semibold text-[#6B4D00]">
                        {card.category}
                      </Text>
                    </View>

                    {card.tipoCard && (
                      <View className="bg-[#D6F5C6] rounded px-[6px] py-[2px]">
                        <Text className="text-[12px] font-semibold text-[#6B4D00]">
                          SUA ESCOLHA!
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text className="text-[14px] text-[#222] my-[6px]">
                  {card.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="absolute -bottom-1">
        <Barra />
      </View>
    </ImageBackground>
  );
};
