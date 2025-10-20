import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import type { TiposRotas } from '../../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<TiposRotas, 'CriarDieta'>

export default function CriarDieta({navigation}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [objetivo, setObjetivo] = useState<any>('');
  const [preco, setPreco] = useState<any>('');
  const [peso, setPeso] = useState<any>('');
  const [altura, setAltura] = useState<any>('');
  const [restricoes, setRestricoes] = useState<string[]>(['']);
  const [identificador, setIdentificador] = useState<number>(0);
  const [choices, setChoices] = useState<any>([
      { label: 'Ganhar Peso/Músculo', value: 'ganhar_peso_musculo' },
      { label: 'Perder Peso', value: 'perder_peso' },
      { label: 'Me Manter Saudável', value: 'manter_saudavel' },
  ]);

  useEffect(() => {
    // Define as opções de acordo com o identificador. 
    // A lógica é semelhante à de CriarUsuario.
    if (identificador === 0) {
      setChoices([
        { label: 'Ganhar Peso/Músculo', value: 'ganhar_peso_musculo' },
        { label: 'Perder Peso', value: 'perder_peso' },
        { label: 'Me Manter Saudável', value: 'manter_saudavel' },
      ]);
    } else if (identificador === 1) {
      setChoices([
        { label: '20 reais por dia', value: '20_reais' },
        { label: '50 reais por dia', value: '50_reais' },
        { label: '100 reais por dia', value: '100_reais' },
      ]);
    } else if (identificador === 2) {
      setChoices([
        { label: '50 quilos ou menos', value: '50_quilos_ou_menos' },
        { label: '50-60 quilos', value: '60-60_quilos' },
        { label: '60-70 quilos', value: '60-70_quilos' },
        { label: '70-80 quilos', value: '70-80_quilos' },
        { label: '80-90 quilos', value: '80-90_quilos' },
        { label: '100 quilos ou mais', value: '100_quilos_ou_mais' },
      ]);
    } else if (identificador === 3) {
      setChoices([
        { label: '1.50 ou menos', value: '1.50_ou_menos' },
        { label: '1.50 - 1.60', value: '1.50-1.60' },
        { label: '1.60 - 1.70', value: '1.60-1.70' },
        { label: '1.70 - 1.80', value: '1.70-1.80' },
        { label: '1.80 - 1.90', value: '1.80-1.90' },
        { label: '2.00 ou mais', value: '2.00_ou_mais' },
      ]);
    } else if (identificador === 4) {
      setChoices([
        { label: 'Sim', value: 'sim' },
        { label: 'Não', value: 'nao' },
      ]);
    } else if (identificador === 5) {
      setChoices([
        { label: 'Não consumo leite animal e derivados', value: 'nao_come_leite' },
        { label: 'Não consumo carne', value: 'nao_come_carne' },
        { label: 'Outro', value: 'outro' },
      ]);
    } else if (identificador === 6) {
      navigation.reset({
        index: 0,
        routes: [{name: 'DietaCriada', params: {objetivo, preco, peso, altura, restricoes}}]
      });
    }
  }, [identificador]);
  // UseEffect que define as perguntas e respostas.

  const BotoesSelecionados = (valor: string): void => {
      // Verifica se o valor já está selecionado.
      // Se estiver, remove-o da lista de selecionados.
      // Se não estiver, adiciona-o à lista de selecionados.  
      if (selected.includes(valor)) {
            setSelected(
                selected.filter(itens => itens !== valor)
            );
      } else {
            setSelected([...selected, valor]);
      };
  };
  // Função que permite selecionar as opções.

  const PassarDados = async () => {
      // Função que passa os dados selecionados para a próxima tela.
        if (selected.includes('nao')) {
            setIdentificador(6);
            return;
        };
        // Significa que o usuário não tem restrições alimentares.

        if (identificador === 0) {
              setObjetivo(selected);
        } else if (identificador === 1) {
              setPreco(selected);
        } else if (identificador === 2) {
              setPeso(selected);
        } else if (identificador === 3) {
              setAltura(selected);
        } else if (identificador === 5) { 
              setRestricoes(selected);
        };
          setSelected([]);
          setIdentificador(identificador + 1);
          // Incrementa o identificador para passar para a próxima pergunta, e limpa o selected.
          // Se o identificador for 6, navega para a tela CriandoDieta (useEffect já aborda essa lógica).
  };
  // Função que passa dados da dieta.
        
  return (
    <View className="flex-1 p-[25px] bg-white justify-center">
      {/* A lógica é basicamente a mesma da tela CriarUsuario */}
      <Text className="text-2xl font-semibold text-center mb-8 text-[#323232]">
        {identificador === 0
          ? 'Qual o objetivo da sua dieta?'
          : identificador === 1
          ? 'Quanto você pode gastar na dieta?'
          : identificador === 2
          ? 'Qual o seu peso atual?'
          : identificador === 3
          ? 'Qual a sua altura?'
          : identificador === 4
          ? 'Você tem alguma restrição alimentar?'
          : identificador === 5
          ? 'Qual é a restrição?'
          : null}
      </Text>
      <View className="mx-4">
        {choices.map((choice: any) => (
          <TouchableOpacity
            key={choice.value}
            className="bg-[#f2f2f2] rounded-[12px] py-4 px-5 mb-4 items-center elevation-2"
            style={
              selected.includes(choice.value) && { backgroundColor: '#2d8cf0' }
            }
            onPress={() =>
              identificador === 5
                ? BotoesSelecionados(choice.value)
                : setSelected([choice.value])
            }
          >
            <Text
              className="text-lg text-[#323232]"
              style={selected.includes(choice.value) && { color: 'white' }}
            >
              {choice.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        className="mt-8 items-center elevation-1 rounded-full h-[55px] w-[315px] self-center overflow-hidden"
        onPress={() => PassarDados()}
        disabled={selected.length === 0}
      >
        <LinearGradient
          colors={
            selected.length !== 0 ? ['#4f46e5', '#9333ea'] : ['#ccc', '#ccc']
          }
          className="w-full h-full items-center justify-center"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text className="text-lg font-semibold text-white">Avançar</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Só há uma pequena ressalva: quando o identificador for 5, o código muda um pouco pois na opção 5, 
      diferentemente das outras, o usuário só pode escolher UMA opção (sim ou não), enquanto nos outros é 
      possível escolher mais de uma opção. */}
    </View>
  );
{/* 
  
  Componente criarDieta é semelhante ao componente CriarUsuario, com a diferença dos dados sendo passados como props entre os
componentes, não os armazenando no Firebase.
  
*/}
};
