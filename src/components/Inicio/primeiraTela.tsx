import "../../../global.css";
import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import Loader from "../loading/loading";
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';

const app = getApp();
const authInstance = auth(app);

type Props = NativeStackScreenProps<TiposRotas, 'primeiraTela'>;

export default function PrimeiraTela({navigation}: Props) {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      onAuthStateChanged(authInstance, user => {
        if (user) navigation.reset({
            index: 0,
            routes: [{name: 'TelaPrincipal'}]
        });
      });
    }, [authInstance]);

    if (loading) {
    return (
        <View className='bg-tela flex-1 h-[100%] items-center justify-center'>
            <Text style={{color: '#4B2E18'}} className='text-5xl font-bold text-center'>  
                Levando suas receitas...
            </Text>
            <Loader/>
        </View> 
    );
    };

    return (
        <View className='bg-tela flex-1 h-[100%] items-center justify-center'>
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
};
