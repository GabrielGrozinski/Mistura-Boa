import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../../../reducers/hooks';
import { modificaOrdenacao } from '../../../reducers/filtrarReducer';

export default function Filtrar({corDoFiltro}: any) {
  const dispatch = useAppDispatch();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [selected, setSelected] = useState('Ordenação Padrão');
  const [cafeDaManha, setCafeDaManha] = useState<boolean>(false);
  const [PratoPrincipal, setPratoPrincipal] = useState<boolean>(false);
  const [aperitivo, setAperitivo] = useState<boolean>(false);
  const [Bebidas, setBebidas] = useState<boolean>(false);

  const opcoes = [
    {
      label: 'Ordenação Padrão',
      icon: require('../../../../assets/Receitas/filtros/ordenacaoPadrao.png'),
    },
    {
      label: 'Melhores Receitas',
      icon: require('../../../../assets/Receitas/filtros/melhoresReceitas.png'),
    },
    {
      label: 'Calorias',
      icon: require('../../../../assets/Receitas/filtros/calorias.png'),
    },
    {
      label: 'Ganhar Músculo',
      icon: require('../../../../assets/Receitas/filtros/ganharPeso.png'),
    },
    {
      label: 'Tempo de Preparo',
      icon: require('../../../../assets/Receitas/filtros/tempo.jpg'),
    },
    {
      label: 'Facilidade',
      icon: require('../../../../assets/Receitas/filtros/receitasFaceis.png'),
    },
    {
      label: 'Emagrecer',
      icon: require('../../../../assets/Receitas/filtros/perderPeso.png'),
    },
  ];

  return (
    <View className="w-full p-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {/* Pill 1 - Ordenar (abre modal) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setModalVisivel(true)}
          className='justify-center items-center flex-row rounded-full px-8 py-3 mr-4'
          style={selected !== 'Ordenação Padrão' ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          >
          <Text className={`${selected !== 'Ordenação Padrão' ? 'text-white' : 'text-black'} text-base font-medium mr-1`}>{selected !== 'Ordenação Padrão' ? selected : 'Ordenar'}</Text>
          <Ionicons name="chevron-down-outline" size={16} color={selected !== 'Ordenação Padrão' && 'white'} />
        </TouchableOpacity>

        {/* Pill 2 - Café da Manhã */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={cafeDaManha ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => setCafeDaManha(!cafeDaManha)}
        >
          <Text className={`${cafeDaManha ? 'text-white' : 'text-black'} text-base font-medium`}>Café da Manhã</Text>
        </TouchableOpacity>

        {/* Pill 3 - PratoPrincipal */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={PratoPrincipal ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => setPratoPrincipal(!PratoPrincipal)}
        >
          <Text className={`${PratoPrincipal ? 'text-white' : 'text-black'} text-base font-medium`}>Prato Principal</Text>
        </TouchableOpacity>
        
        {/* Pill 4 - Aperitivos */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={aperitivo ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => setAperitivo(!aperitivo)}
        >
          <Text className={`${aperitivo ? 'text-white' : 'text-black'} text-base font-medium`}>Aperitivos</Text>
        </TouchableOpacity>
        
        {/* Pill 4 - Bebidas */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={Bebidas ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => setBebidas(!Bebidas)}
        >
          <Text className={`${Bebidas ? 'text-white' : 'text-black'} text-base font-medium`}>Bebidas</Text>
        </TouchableOpacity>

        <View className="w-4" />
      </ScrollView>

      {/* Modal Ordenação */}
      <Modal
        visible={modalVisivel}
        statusBarTranslucent
        hardwareAccelerated
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-12 h-1.5 bg-gray-300 self-center rounded-full mb-4" />
            <Text className="text-center text-lg font-semibold mb-6">Ordenar por</Text>

            <View className="flex-row flex-wrap justify-between">
              {opcoes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelected(item.label);
                    setModalVisivel(false);
                    dispatch(modificaOrdenacao(item.label));
                  }}
                  className="w-[30%] items-center mb-6"
                >
                  <View 
                  className='w-[60px] overflow-hidden h-[60px] rounded-full border-2 items-center justify-center'
                  style={selected === item.label ? {borderColor: corDoFiltro} : {borderColor: '#d1d5db'}}
                  >
                    <Image source={item.icon}
                    className='h-[55px] w-[55px]'
                      resizeMode="contain"
                    />
                  </View>
                  
                  <Text
                    className='text-sm mt-2 text-center'
                    style={selected === item.label ? {color: corDoFiltro, fontWeight: 500} : {color: '#4b5563'}}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
