import React, { useState } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../../../reducers/hooks';
import { useAppSelector } from '../../../reducers/hooks';
import { modificaOrdenacao, modificaRefeicao } from '../../../reducers/filtrarReducer';

export default function Filtrar({corDoFiltro}: any) {
  const dispatch = useAppDispatch();
  let {refeicao} = useAppSelector(state => state.filtro);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [selected, setSelected] = useState('Ordenação Padrão');
  const [refeicaoSelected, setRefeicaoSelected] = useState('');

  const opcoes = [
    {
      label: 'Ordenação Padrão',
      icon: require('../../../../assets/Receitas/filtros/ordenacaoPadrao.png'),
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
    ...(corDoFiltro !== "#23d3ffff"
      ? [
          {
            label: 'Melhores Receitas',
            icon: require('../../../../assets/Receitas/filtros/melhoresReceitas.png'),
          },
        ]
      : []),
  ];
  // A verificação no final é importante pois na parte de Receitas Favoritas, não há o filtro de Melhores Receitas

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
          style={refeicao === 'cafe_da_manha' ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => {
            if (refeicao === 'cafe_da_manha') {
              setRefeicaoSelected('');
              dispatch(modificaRefeicao('Todas'))
            } else {
              setRefeicaoSelected('cafe_da_manha');
              dispatch(modificaRefeicao('cafe_da_manha'));
            };

          }}
        >
          <Text className={`${refeicaoSelected === 'cafe_da_manha' ? 'text-white' : 'text-black'} text-base font-medium`}>Café da Manhã</Text>
        </TouchableOpacity>

        {/* Pill 3 - Prato Principal */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={refeicao === 'prato_principal' ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => {
            if (refeicao === 'prato_principal') {
              setRefeicaoSelected('');
              dispatch(modificaRefeicao('Todas'))
            } else {
              setRefeicaoSelected('prato_principal');
              dispatch(modificaRefeicao('prato_principal'));
            };
          }}
        >
          <Text className={`${refeicaoSelected === 'prato_principal' ? 'text-white' : 'text-black'} text-base font-medium`}>Prato Principal</Text>
        </TouchableOpacity>
        
        {/* Pill 4 - Sobremesa */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={refeicao === 'sobremesa' ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => {
            if (refeicao === 'sobremesa') {
              setRefeicaoSelected('');
              dispatch(modificaRefeicao('Todas'))
            } else {
              setRefeicaoSelected('sobremesa');
              dispatch(modificaRefeicao('sobremesa'));
            };
          }}
        >
          <Text className={`${refeicaoSelected === 'sobremesa' ? 'text-white' : 'text-black'} text-base font-medium`}>Sobremesa</Text>
        </TouchableOpacity>
        
        {/* Pill 5 - Bebidas */}
        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full px-8 py-3 mr-4'
          style={refeicao === 'bebida' ? { backgroundColor: corDoFiltro } : { backgroundColor: '#f3f4f6' }}
          onPress={() => {
            if (refeicao === 'bebida') {
              setRefeicaoSelected('');
              dispatch(modificaRefeicao('Todas'))
            } else {
              setRefeicaoSelected('bebida');
              dispatch(modificaRefeicao('bebida'));
            }; 
          }}
        >
          <Text className={`${refeicaoSelected === 'bebida' ? 'text-white' : 'text-black'} text-base font-medium`}>Bebida</Text>
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

{/* 
  
  Componente Filtrar em React Native/TypeScript que exibe barra horizontal de filtros para receitas, permite selecionar ordenação 
(calorias, tempo de preparo, facilidade, emagrecer, ganhar músculo, melhores receitas) e tipo de refeição 
(Café da Manhã, Prato Principal, Sobremesa, Bebida), integra Redux para gerenciar estado de ordenação e refeição, aplica estilos 
condicionais nos botões e nos itens selecionados, usa ScrollView horizontal para rolagem, Modal para escolha de ordenação com 
ícones, atualiza seleção local e global, e garante experiência interativa de filtragem visual.

  Observações: novos filtros podem ser adicionados.
  
*/}
};
