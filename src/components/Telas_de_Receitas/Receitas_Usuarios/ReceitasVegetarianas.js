import React, {useState, useEffect} from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import PickD from '../../acessorios/Dificuldade';
import PickT from '../../acessorios/Timer';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';


const app = getApp();
const db = getDatabase(app);


const dificuldades = [
  'Qualquer nível!',
  'Fácil de fazer!',
  'Um pouco complicada...',
  'Difícil!',
  'Mestre-cuca!',
];

const tempo = [
  '15 minutos ⏱️',
  '30 minutos ⏱️',
  '45 minutos ⏱️',
  '1 hora+ ⏱️',
  '2 horas+ ⏱️',
  'Qualquer tempo ⏱️',
];

export default function VegetarianRecipesScreen() {

  const [nivel, setNivel] = useState('Qualquer nível');
  const [timer, setTimer] = useState('Qualquer tempo ⏱️');
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Função que busca as receitas veganas do nó de usuarios.
    const Busca_receitas = async () => {
      const refReceita = ref(db, `ReceitasUsuarios/vegetariano`);
      const snapshot = await get(refReceita);
      const dados = snapshot.val();
      setRecipes(dados.slice(1));
    };
    Busca_receitas();
}, []);
  

    const Receitas_Escolhidas = nivel === 'Qualquer nível!' ? recipes : recipes.filter(D => D.dif === nivel );
    const Tempo_Escolhido = timer === 'Qualquer tempo ⏱️' ? Receitas_Escolhidas : Receitas_Escolhidas.filter(T => T.time === timer);
  

  return (
    <View style={{ flex: 1, backgroundColor: '#F0FFF7' }}>
      <StatusBar hidden />
      <View style={{flexDirection: 'row', marginTop: 4}}>
        <PickD setNivel= {setNivel} />
        <PickT setTimer= {setTimer} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#3F9E8E',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Receitas Vegetarianas 🌱
        </Text>

        {Tempo_Escolhido.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              elevation: 4,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress = {() => {
              navigation.navigate('Receita', { recipe })
            }}
          >
            <Image
              source={recipe.image}
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                marginRight: 16,
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginBottom: 4,
                  color: '#333',
                }}
              >
                {recipe.title}
              </Text>
              <Text style={{ color: '#666', marginBottom: 4 }}>
                {recipe.description}
              </Text>

              <Text style={{ fontSize: 13, color: '#3F9E8E', fontWeight: 'bold' }}>
                ⏱️ {recipe.time}  •  {recipe.dif}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
