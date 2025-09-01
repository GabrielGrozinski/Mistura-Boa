import "../../../global.css";
import React from 'react';
import Loader from './loading';
import {View, Text} from 'react-native';

export default function LoaderCompleto() {
    return (
        <View className='bg-tela flex-1 h-[100%] items-center justify-center'>
            <Text style={{color: '#4B2E18'}} className='text-5xl font-bold text-center'>  
                        Levando suas receitas...
            </Text>
            <Loader/>
        </View> 
    );
};
