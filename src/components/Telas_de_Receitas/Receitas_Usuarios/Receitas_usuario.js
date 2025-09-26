import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {Busca_tipo_de_alimentacao} from '../../acessorios/BuscaUsuario';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import ButtonGroup from '../../acessorios/barra';
 
const app = getApp()
const authInstance = auth(app)

export default function ReceitasUsuarios() {
    const [card, setCard] = useState([]);
    const navigation = useNavigation();
    const [tipo_de_alimentacao, setTipo_de_Alimentacao] = useState('')


    useEffect(() => { 
      if (!authInstance.currentUser) {return};
          async function buscaAlimentacao() {
            const usuarioEmail = authInstance.currentUser.email
            const alimentacaoEscolhida = await Busca_tipo_de_alimentacao(usuarioEmail)
            setTipo_de_Alimentacao(alimentacaoEscolhida);
          };
          buscaAlimentacao();

      // Busca o tipo de alimentação do usuário (carnívoro, vegano, vegetariano).
    }, [authInstance.currentUser]);

    useEffect(() => {
      
      const cards = [
        
        {
          id: 1,
          category: 'CARNÍVORO',
          title: 'Você come de tudo um pouco? Então aqui é o seu lugar!',
          image: require('../../../../assets/urso.png'),
          tipoCard: tipo_de_alimentacao == 'carnivoro' ? true : null,
          tipoCardId: 'ReceitaCarnivoraUsuario',
          
        },
        {
          id: 2,
          category: 'VEGETARIANO',
          title: 'Não come carne, mas quer aproveitar receitas incríveis? Esse é o ideal!',
          image: require('../../../../assets/urso.png'),
          tipoCard: tipo_de_alimentacao == 'vegetariano' ? true : null,
          tipoCardId: 'ReceitaVegetarianaUsuario',
        },
        {
          id: 3,
          category: 'VEGANO',
          title: 'Quer continuar comendo comidas deliciosas sem nenhuma presença animal? Essa é a melhor opção!',
          image: require('../../../../assets/urso.png'),
          tipoCard: tipo_de_alimentacao == 'vegano' ? true : null,
          tipoCardId: 'ReceitaVeganaUsuario',
        },
      ];
      // Define os cards de receitas.
      // Define o tipoCard com base na escolha do usuário.
      setCard(cards);

    }, [tipo_de_alimentacao]);


    return (
      <View style={{flex: 1, marginBottom: 60}}>
        <StatusBar hidden/>
        <Text style={styles.tituloApp}>  
            Receitas dos Usuários
        </Text>
        
        <ScrollView style={styles.container}>
        {card.map((card) => (
            <TouchableOpacity key={card.id} 
            style={styles.card} activeOpacity={0.8} 
            onPress={() => navigation.navigate(card.tipoCardId)}>
            
              <Image source={card.image} style={styles.image} resizeMode="cover" />
              <View style={styles.content}>

                  <View style={styles.header}>
                  
                      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.tag}>
                        <Text style={styles.tagText}>{card.category}</Text>
                        </View>
                        {card.tipoCard && (
                        <View style={styles.tagEscolha}>
                        <Text style={styles.tagText}>SUA ESCOLHA!</Text>
                        </View>
                        )}
                        {/* Mostra o tipo de alimentação que o usuário escolheu */}
                      </View>

                  </View>
                  
                  <Text style={styles.title}>{card.title}</Text>
              </View>
            </TouchableOpacity>
        ))}
        </ScrollView>
        <View style={{position: 'absolute', bottom: -100}}>
          <ButtonGroup/>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
    tituloApp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A83232',
    textAlign: 'center',
    marginVertical: 18,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#CCE5B0',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#FFECAA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    //marginRight: 8,
  },
  tagEscolha: {
    backgroundColor: '#D6F5C6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    
    //marginRight: 8,
    //marginLeft: 150,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B4D00',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 14,
    color: '#222',
    marginVertical: 6,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  buttonText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
