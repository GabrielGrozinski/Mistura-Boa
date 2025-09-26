import React from "react";
import { View, Text, TextInput, Pressable, ImageBackground, ScrollView, Image } from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Barra from "../../Barra/Barra";


type Props = NativeStackScreenProps<TiposRotas, 'ReceitasVeganaAppBASE'>

export default function ReceitasVeganaAppBASE({navigation}: Props) {
  return (
    <ImageBackground
    source={require('../../../../assets/TelaPrincipal/capa2.png')}
    resizeMode="cover"
    className="flex-1">
      <View className="flex-1 p-4">
        {/* Título */}
        <Text style={{textShadowColor: 'black', textShadowRadius: 0.4}} className="text-6xl mt-10 font-bold mx-4 text-center text-green-600">
          Receitas do Aplicativo
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
            <Image className="h-20 w-[140px] border-[2px] border-black/60 rounded-xl" source={require('../../../../assets/Receitas/ReceitasVeganasApp/sobremesas.jpg')} />
          </Pressable>

          <Pressable>
            <Image className="h-20 w-[140px] border-[2px] border-black/60 rounded-xl" source={require('../../../../assets/Receitas/ReceitasVeganasApp/pratosPrincipais.jpg')} />
          </Pressable>

          <Pressable>
            <Image className="h-20 w-[305px] border-[2px] border-black/70 mt-2 rounded-xl" source={require('../../../../assets/Receitas/ReceitasVeganasApp/fitness.jpg')} />
          </Pressable>
        </View>

        {/* Receitas */}
        <ScrollView horizontal contentContainerClassName="flex-row h-[185px] mt-6">
          
          {/* Receita 1 */}
          <Image
          source={require('../../../../assets/Receitas/ReceitasVeganasApp/brigadeiro.png')}
          className="h-[185px] w-[140px] mr-6 rounded-xl border-[3px] border-black/70"
          />

          {/* Receita 2 */}
          <Image
          source={require('../../../../assets/Receitas/ReceitasVeganasApp/pizza.png')}
          className="h-[185px] w-[140px] mr-6 rounded-xl border-[3px] border-black/70"
          />

          {/* Receita 3 */}
          <Image
          source={require('../../../../assets/Receitas/ReceitasVeganasApp/paoDeQueijo.png')}
          className="h-[185px] w-[140px] mr-6 rounded-xl border-[3px] border-black/70"
          />

        </ScrollView>

        <Pressable onPress={() => navigation.navigate('ReceitasVeganaApp')} className="mx-4 mb-20 items-center">
          <Image className="h-20 w-[305px] border-[2px] border-black/70 rounded-xl" source={require('../../../../assets/Receitas/ReceitasVeganasApp/todasReceitas.jpg')} />
        </Pressable>
      </View>

      <View className="absolute -bottom-1">
        <Barra/>
      </View>

    </ImageBackground>
  );
};
