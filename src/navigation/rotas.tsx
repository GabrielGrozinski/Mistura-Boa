import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { TiposRotas } from './types';
import primeiraTela from '../components/Inicio/primeiraTela';
import CriarUsuario from '../components/Inicio/CriarUsuario';
import Login from '../components/Inicio/Login';
import TelaPrincipal from '../components/TelaPrincipal/TelaPrincipal';
import PerfilUsuario from '../components/Perfil/Perfil';
import AdicionarAmigos from '../components/Perfil/AdicionarAmigos';
import Ranking from '../components/Perfil/Ranking';
import Dieta from '../components/Fitness/Dieta.tsx';
import CriarDieta from '../components/Fitness/CriarDieta.tsx';
import DietaCriada from '../components/Fitness/DietaCriada.tsx';
import GeradorReceita from '../components/GeraReceita/GeradorReceita.tsx';
import ReceitasApp from '../components/Telas_de_Receitas/Receitas_App/Receitas_app.tsx';
import ReceitasCarnivoraApp from '../components/Telas_de_Receitas/Receitas_App/ReceitasCarnivoras.tsx';
import ReceitasCarnivoraAppBASE from '../components/Telas_de_Receitas/Receitas_App/ReceitasCarnivorasAppBASE.tsx';
import ReceitasVegetarianaAppBASE from '../components/Telas_de_Receitas/Receitas_App/ReceitasVegetarianaAppBASE.tsx';
import ReceitasVegetarianaApp from '../components/Telas_de_Receitas/Receitas_App/ReceitasVegetarianas.tsx';
import ReceitasVeganaAppBASE from '../components/Telas_de_Receitas/Receitas_App/ReceitasVeganaAppBASE.tsx';
import ReceitasVeganaApp from '../components/Telas_de_Receitas/Receitas_App/ReceitasVeganas.tsx';

const Stack = createNativeStackNavigator<TiposRotas>();

export default function Rotas() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='primeiraTela' screenOptions={{headerShown: false}}>
                <Stack.Screen name="primeiraTela" component={primeiraTela} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CriarUsuario" component={CriarUsuario} />
                <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} />
                <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
                <Stack.Screen name="AdicionarAmigos" component={AdicionarAmigos} />
                <Stack.Screen name="Ranking" component={Ranking} />
                <Stack.Screen name="Dieta" component={Dieta} />
                <Stack.Screen name="CriarDieta" component={CriarDieta} />
                <Stack.Screen name="DietaCriada" component={DietaCriada} />
                <Stack.Screen name="GeradorReceita" component={GeradorReceita} />
                <Stack.Screen name="ReceitasApp" component={ReceitasApp} />
                <Stack.Screen name="ReceitasCarnivoraApp" component={ReceitasCarnivoraApp} />
                <Stack.Screen name="ReceitasCarnivoraAppBASE" component={ReceitasCarnivoraAppBASE} />
                <Stack.Screen name="ReceitasVegetarianaAppBASE" component={ReceitasVegetarianaAppBASE} />
                <Stack.Screen name="ReceitasVegetarianaApp" component={ReceitasVegetarianaApp} />
                <Stack.Screen name="ReceitasVeganaAppBASE" component={ReceitasVeganaAppBASE} />
                <Stack.Screen name="ReceitasVeganaApp" component={ReceitasVeganaApp} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
