import "../../../global.css";
import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StatusBar} from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import LoaderCompleto from "../loading/loadingCompleto";
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import ImmersiveMode from 'react-native-immersive';

const app = getApp();
const authInstance = auth(app);

type Props = NativeStackScreenProps<TiposRotas, 'primeiraTela'>;

export default function PrimeiraTela({navigation}: Props) {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        ImmersiveMode.setImmersive(true);
        const user = onAuthStateChanged(authInstance, usuario => {
            if (!usuario) return;
            navigation.reset({
                index: 0,
                routes: [{name: 'TelaPrincipal'}]
            });
            // Se o usuário estiver logado, é levado para a TelaPrincipal.
        });
        return () => user();
    }, []);
    // UseEffect que verifica se há um usuário logado.

    if (loading) return (
        <LoaderCompleto/>
    );

    return (
        <View className='bg-tela flex-1 h-[100%] items-center justify-center'>
            <StatusBar hidden />
            <Text style={{color: '#4B2E18'}} className='text-5xl mb-6 font-bold text-center'>
                Bem-vindo ao Mistura Boa!
            </Text>
            <Text style={{color: '#57371fff'}} className='text-2xl font-semibold text-center'>
                Vamos fazer sua primeira receita! {'\n'} Aperte para assar seu pão.
            </Text>
            <Image
            source={require('../../../assets/primeiraTela/forno.png')}
            className="h-1/3 w-[100%] mb-4"
            />  
            <TouchableOpacity 
            activeOpacity={0.6} 
            className="bg-orange-400 h-[65px] w-[275px] rounded-full items-center justify-center"
            onPress={() => {
                setLoading(!loading);
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Login'}]
                });
                }}>
                <Text className="text-white text-4xl font-semibold">
                    Assar Pão
                </Text>
            </TouchableOpacity>
        </View>

    );

{/*
     
    Componente PrimeiraTela é uma tela React Native/TypeScript que exibe uma tela de boas‑vindas, ativa o modo imersivo ao montar,
para retirar os botões do android, e escuta onAuthStateChanged para, caso haja usuário autenticado, resetar a navegação para 
'TelaPrincipal'. 

    Tem um estado loading (mostra LoaderCompleto quando true), esconde a StatusBar e renderiza textos, uma imagem de forno e um 
botão "Assar Pão" que alterna o loading e navega para 'Login'. 

    Observação rápida: A tela em si não executa nada, e serve apenas para conectar o usuário ao aplicativo por meio da identidade
visual do Mistura Boa.
    
*/}
};
