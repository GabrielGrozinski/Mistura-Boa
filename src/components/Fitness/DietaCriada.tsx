import React, {useEffect, useState} from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import LoaderCompleto from '../loading/loadingCompleto';


type Props = NativeStackScreenProps<TiposRotas, 'DietaCriada'>

export default function DietaCriada({route}: Props) {
    const {objetivo, preco, peso, altura, restricoes} = route.params;
    const [abaAtiva, setAbaAtiva] = useState('seguindo');
    const [restricoesList, setRestricoesList] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {  
        if (restricoes.includes('nao')) { 
            setRestricoesList('Nenhuma restrição');
        } else {
            setRestricoesList(restricoes.join(', '));
        }
        // Verificação para saber se o usuário tem ou não restrições alimentares.
        // Se tiver, mostra as restrições, passando uma vírgula entre elas.

    }, [restricoes]);
    // UseEffect que verifica as restrições alimentares.

    useEffect(() => {
        // Aqui eu colocaria a lógica da I.A, que analisaria os dados do usuário e criaria uma dieta personalizada.
        // Seria levado em consideração o objetivo, preço, peso, altura e as restrições (se tiver).
        // Assim que a receita fosse gerada, os dados dela seriam levados ao Firebase, junto do xp que o usuário ganharia.
        // Por enquanto, vou simular esse processo com um setTimeout.
        const timer = setTimeout(() => {
            setLoading(false);
            }, 5000);
        return () => clearTimeout(timer);
        
        // No app real, o loading só acabaria quando a I.A criasse a dieta.
    }, [objetivo, preco, peso, altura, restricoesList]);
    // UseEffect que teria a lógica da dieta criada.

    if (loading) return (
        <LoaderCompleto/>
    );

    return (
        <ImageBackground
              source={require('../../../assets/TelaPrincipal/capa2.png')}
              resizeMode='cover'
            className='flex-1 bg-white items-center justify-center'
        >

            <View className="flex-row flex-wrap absolute items-center bg-white -top-1 w-full h-[20%] justify-around border-2 border-neutral-600">              
                <View className="mt-10">
                <TouchableOpacity
                    onPress={() => setAbaAtiva('segunda')}
                >
                    <Text
                    className={
                        abaAtiva === 'segunda'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Segunda-Feira //
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setAbaAtiva('terca')}
                >
                    <Text
                    className={
                        abaAtiva === 'terca'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Terça-Feira //
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => setAbaAtiva('quarta')}
                >
                    <Text
                    className={
                        abaAtiva === 'quarta'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Quarta-Feira //
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setAbaAtiva('quinta')}
                >
                    <Text
                    className={
                        abaAtiva === 'quinta'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Quinta-Feira //
                    </Text>
                </TouchableOpacity>

                </View>

                <View className="mt-10">
                
                <TouchableOpacity
                    onPress={() => setAbaAtiva('sexta')}
                >
                    <Text
                    className={
                        abaAtiva === 'sexta'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Sexta-Feira //
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setAbaAtiva('sabado')}
                >
                    <Text
                    className={
                        abaAtiva === 'sabado'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Sábado //
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setAbaAtiva('domingo')}
                >
                    <Text
                    className={
                        abaAtiva === 'domingo'
                        ? 'text-[#007bff] text-xl font-bold text-center self-center'
                        : 'text-[#888] text-xl text-center self-center'
                    }
                    >
                    // Domingo //
                    </Text>
                </TouchableOpacity>
            </View>

            </View>

                <View className="flex-row flex-wrap justify-center">
                    
                    <View style={{elevation: 2, shadowColor: 'black'}} className='max-w-[250px] opacity-98 my-8 h-[35%] w-[45%] mx-2 bg-white rounded-2xl'>
                        <View className='flex-row mt-3 items-center justify-center mb-1'>
                            <Text className='text-xl mr-2'>🍪</Text>
                                <Text style={{textShadowColor: 'gray', textShadowRadius: 0.1}} className='font-bold text-xl'>
                                    Café da Manhã
                                </Text>
                        </View>

                        <View className="justify-center mx-2">
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-green-500 px-[6px]'>PROTEÍNA: 25g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-yellow-500 px-[6px]'>GORDURA: 10g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-red-500 px-[6px]'>CARBOIDRATOS: 25g</Text>
                        </View>
                    </View>
                    
                    <View style={{elevation: 2, shadowColor: 'black'}} className='max-w-[250px] opacity-98 my-8 h-[35%] w-[45%] mx-2 bg-white rounded-2xl'>
                        <View className='flex-row mt-3 items-center justify-center mb-1'>
                            <Text className='text-xl mr-2'>🍪</Text>
                                <Text style={{textShadowColor: 'gray', textShadowRadius: 0.1}} className='font-bold text-xl'>
                                    Almoço
                                </Text>
                        </View>

                        <View className="justify-center mx-2">
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-green-500 px-[6px]'>PROTEÍNA: 25g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-yellow-500 px-[6px]'>GORDURA: 10g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-red-500 px-[6px]'>CARBOIDRATOS: 25g</Text>
                        </View>
                    </View>
                    
                    <View style={{elevation: 2, shadowColor: 'black'}} className='max-w-[250px] opacity-98 my-8 h-[35%] w-[45%] mx-2 bg-white rounded-2xl'>
                        <View className='flex-row mt-3 items-center justify-center mb-1'>
                            <Text className='text-xl mr-2'>🍪</Text>
                                <Text style={{textShadowColor: 'gray', textShadowRadius: 0.1}} className='font-bold text-xl'>
                                    Café da Tarde
                                </Text>
                        </View>

                        <View className="justify-center mx-2">
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-green-500 px-[6px]'>PROTEÍNA: 25g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-yellow-500 px-[6px]'>GORDURA: 10g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-red-500 px-[6px]'>CARBOIDRATOS: 25g</Text>
                        </View>
                    </View>
                    
                    <View style={{elevation: 2, shadowColor: 'black'}} className='max-w-[250px] opacity-98 my-8 h-[35%] w-[45%] mx-2 bg-white rounded-2xl'>
                        <View className='flex-row mt-3 items-center justify-center mb-1'>
                            <Text className='text-xl mr-2'>🍪</Text>
                                <Text style={{textShadowColor: 'gray', textShadowRadius: 0.1}} className='font-bold text-xl'>
                                    Jantar
                                </Text>
                        </View>
                        
                        <View className="justify-center mx-2">
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-green-500 px-[6px]'>PROTEÍNA: 25g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-yellow-500 px-[6px]'>GORDURA: 10g</Text>
                            
                            <Text style={{textShadowColor: 'black', textShadowRadius: 0.1}} className='my-1 text-white font-semibold rounded-full text-center opacity-99 bg-red-500 px-[6px]'>CARBOIDRATOS: 25g</Text>
                        </View>
                    </View>

                </View> 
        </ImageBackground>
    );

{/* 
    
    Componente DietaCriada é uma tela React Native/TypeScript que recebe via rota os parâmetros 
(objetivo, preco, peso, altura, restricoes), monta um estado local para aba ativa e lista de restrições 
(transformando o array em string ou mostrando "Nenhuma restrição") e usa um estado de loading, atualmente finalizado 
por um setTimeout de 5s que simula a geração da dieta. 

    A interface exibe abas para os dias da semana e cartões de refeições com valores de macronutrientes estáticos; não há 
lógica de I.A. implementada nem persistência no backend, e a UI está incompleta/ prototípica, servindo apenas como mock 
visual até a implementação da geração automática e refinamentos de layout.   
    
*/}

};
