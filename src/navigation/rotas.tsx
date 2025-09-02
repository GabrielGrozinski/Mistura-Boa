import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { TiposRotas } from './types';
import primeiraTela from '../components/Inicio/primeiraTela';
import CriarUsuario from '../components/Inicio/CriarUsuario';
import Login from '../components/Inicio/Login';


const Stack = createNativeStackNavigator<TiposRotas>();

export default function Rotas() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='primeiraTela' screenOptions={{headerShown: false}}>
                <Stack.Screen name="primeiraTela" component={primeiraTela} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CriarUsuario" component={CriarUsuario} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
