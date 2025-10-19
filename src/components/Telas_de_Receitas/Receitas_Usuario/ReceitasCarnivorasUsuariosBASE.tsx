import React from "react";
import { View, Text, TextInput, Pressable, ImageBackground, ScrollView, Image } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Barra from "../../Barra/Barra";


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasCarnivoraUsuariosBASE'>

export default function ReceitasCarnivoraUsuariosBASE({navigation}: Props) {
  return (
    <ImageBackground
    source={require('../../../../assets/TelaPrincipal/capa2.png')}
    resizeMode="cover"
    className="flex-1">
      <View className="flex-1 p-4">
        {/* Título */}
        <Text style={{textShadowColor: 'black', textShadowRadius: 0.4}} className="text-6xl mt-10 font-bold mx-4 text-center text-red-800">
          Receitas dos Usuários
        </Text>

        {/* Barra de busca */}
        <View className="flex-row items-center mx-4 rounded-3xl mt-4 px-3 border-[3px] border-black/50">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Buscar"
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-2xl text-gray-700"
          />
        </View>

        {/* Categorias */}
        <View className="flex-row flex-wrap overflow-hidden justify-between mx-4 mt-5 opacity-98">
          <Pressable>
            <Image className="h-20 w-[140px] border-[2px] border-black/60 rounded-xl" source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/sobremesas.jpg')} />
          </Pressable>

          <Pressable>
            <Image className="h-20 w-[140px] border-[2px] border-black/60 rounded-xl" source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/pratosPrincipais.jpg')} />
          </Pressable>

          <Pressable>
            <Image className="h-20 w-[305px] border-[2px] border-black/70 mt-2 rounded-xl" source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/fitness.jpg')} />
          </Pressable>
        </View>

        {/* Receitas */}
        <ScrollView horizontal contentContainerClassName="flex-row h-[185px] mt-6">
          
          {/* Receita 1 */}
          <Image
          source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/brigadeiro.png')}
          className="h-[185px] w-[140px] mr-6 rounded-xl border-[3px] border-black/70"
          />

          {/* Receita 2 */}
          <Image
          source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/pizza.png')}
          className="h-[185px] w-[140px] mr-6 rounded-xl border-[3px] border-black/70"
          />

          {/* Receita 3 */}
          <Image
          source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/paoDeQueijo.png')}
          className="h-[185px] w-[140px] mr-6 rounded-xl border-[3px] border-black/70"
          />

        </ScrollView>

        <Pressable onPress={() => navigation.navigate('ReceitasCarnivoraUsuarios')} className="mx-4 mb-20 items-center">
          <Image className="h-20 w-[305px] border-[2px] border-black/70 rounded-xl" source={require('../../../../assets/Receitas/ReceitasCarnivorasApp/todasReceitas.jpg')} />
        </Pressable>
      </View>

      <View className="absolute -bottom-1">
        <Barra/>
      </View>

    </ImageBackground>
  );
  
{/* 
  
  ReceitasCarnivoraUsuariosBASE em React Native/TypeScript que exibe receitas enviadas por usuários do aplicativo com 
  ImageBackground de fundo, inclui título principal com estilo e sombra de texto, barra de busca com TextInput e ícone de lupa 
  (Ionicons), categorias de receitas exibidas com Pressable contendo Image de cada categoria, ScrollView horizontal mostrando 
  imagens de receitas em miniatura com borda e cantos arredondados, botão Pressable que leva à tela completa de receitas dos 
  usuários, e barra inferior fixa (Barra) para navegação; a tela é estática, não depende de Firebase ou estado dinâmico, focada 
  apenas na apresentação visual das categorias e receitas.

  Observações: além das categorias de receitas mostradas, é possível adicionar outras categorias, como receitas picantes, receitas
quentes, receitas frias e etc.
  
*/}
};
