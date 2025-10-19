import React, {useEffect, useState, useRef} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { TipoDeAlimentacao } from '../Perfil/buscaDados';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import { Base64 } from 'js-base64';
import Barra from '../Barra/Barra';


type Props = NativeStackScreenProps<TiposRotas, 'Receitas'>

const app = getApp();
const authInstance = auth(app);

export default function Receitas({navigation}: Props) {
    const [card, setCard] = useState<any>([]);
    const [tipo_de_alimentacao, setTipo_de_Alimentacao] = useState('');
 
    useEffect(() => {       
      const user = onAuthStateChanged(authInstance, async usuario => {
        if (!usuario || !usuario.email) return;
        const usuarioAtual = Base64.encode(usuario.email)
        const alimentacaoEscolhida = await TipoDeAlimentacao(usuarioAtual);
        setTipo_de_Alimentacao(alimentacaoEscolhida[0]);
      });
    
      return () => user();
    }, [authInstance]);
    // Busca o tipo de alimentação do usuário (carnívoro, vegano, vegetariano).

    useEffect(() => {
      // Define os cards de receitas.
      // Define o tipoCard com base na escolha do usuário.
      
      const cards = [
        
        {
          id: 1,
          category: 'CARNÍVORO',
          title: 'Você come de tudo um pouco? Então aqui é o seu lugar!',
          image: require('../../../assets/Receitas/carnivora.png'),
          tipoCard: tipo_de_alimentacao == 'carnivoro' ? true : false,
          tipoCardId: 'ReceitasCarnivoraAppBASE',
          tipoReceita: ''
        },
        {
          id: 2,
          category: 'CARNÍVORO',
          title: 'Você come de tudo um pouco? Então aqui é o seu lugar!',
          image: require('../../../assets/Receitas/carnivoraUsuario.png'),
          tipoCard: tipo_de_alimentacao == 'carnivoro' ? true : false,
          tipoCardId: 'ReceitasCarnivoraUsuariosBASE',
          tipoReceita: 'Receita dos Usuarios'
        },
        {
          id: 3,
          category: 'VEGETARIANO',
          title: 'Não come carne, mas quer aproveitar receitas incríveis? Esse é o ideal!',
          image: require('../../../assets/Receitas/vegetariano.png'),
          tipoCard: tipo_de_alimentacao == 'vegetariano' ? true : false,
          tipoCardId: 'ReceitasVegetarianaAppBASE',
          tipoReceita: ''
        },
        {
          id: 4,
          category: 'VEGETARIANO',
          title: 'Não come carne, mas quer aproveitar receitas incríveis? Esse é o ideal!',
          image: require('../../../assets/Receitas/vegetarianoUsuario.png'),
          tipoCard: tipo_de_alimentacao == 'vegetariano' ? true : false,
          tipoCardId: 'ReceitasVegetarianaUsuariosBASE',
          tipoReceita: 'Receita dos Usuarios'
        },
        {
          id: 5,
          category: 'VEGANO',
          title: 'Quer continuar comendo comidas deliciosas sem nenhuma presença animal? Essa é a melhor opção!',
          image: require('../../../assets/Receitas/vegano.png'),
          tipoCard: tipo_de_alimentacao == 'vegano' ? true : false,
          tipoCardId: 'ReceitasVeganaAppBASE',
          tipoReceita: ''
        },
        {
          id: 6,
          category: 'VEGANO',
          title: 'Quer continuar comendo comidas deliciosas sem nenhuma presença animal? Essa é a melhor opção!',
          image: require('../../../assets/Receitas/veganoUsuario.png'),
          tipoCard: tipo_de_alimentacao == 'vegano' ? true : false,
          tipoCardId: 'ReceitasVeganaUsuariosBASE',
          tipoReceita: 'Receita dos Usuarios'
        },
      ];
      setCard(cards);

    }, [tipo_de_alimentacao]);
    // Define os cards das receitas.


  return (
    <ImageBackground
    className='flex-1'
    resizeMode='cover'
    source={require('../../../assets/TelaPrincipal/capa2.png')}>

      <StatusBar hidden />
      
      <View className='pb-[80px] mt-6'>
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

                    {card.tipoReceita && (
                      <View className="bg-purple-200 rounded px-[6px] py-[2px]">
                        <Text className="text-[12px] font-semibold text-[#6B4D00]">
                          {card.tipoReceita}
                        </Text>
                      </View>
                    )}
 
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

{/* 
  
  Tela Receitas em React Native/TypeScript que busca tipo de alimentação do usuário via Firebase Auth, define cards de receitas 
(carnívoro, vegetariano, vegano) com base na escolha do usuário, exibe esses cards em ScrollView com Image, Text e TouchableOpacity, 
e permite navegar para telas específicas de cada card, usando ImageBackground e Barra inferior fixa.

  Sugestões: além das receitas padrões (carnívora, vegetariana e vegana), receitas comemorativas, como receitas de natal, halloween,
páscoa e outras podiam ser introduzidas, principalmente em datas próximas a tais comemorações. Outra possibilidade são as receitas 
exclusivas, como, por exemplo, receitas que só são acessíveis se você usar o personagens Poseidon.

*/}
};
