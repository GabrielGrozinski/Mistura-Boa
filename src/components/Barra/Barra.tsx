import React, {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, Image, ImageBackground, ScrollView } from 'react-native';
import "../../../global.css";
import { useAppSelector, useAppDispatch } from '../../reducers/hooks';
import { modificaBarra } from '../../reducers/barraReducer';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { Base64 } from 'js-base64';

type Props = NativeStackNavigationProp<TiposRotas, 'Login'>;

const app = getApp();
const authInstance = auth(app);

export default function Barra() {
    const [usuarioAtual, setUsuarioAtual] = useState<string>('');
    const dispatch = useAppDispatch();
    const navigation = useNavigation<Props>();
    const {barra} = useAppSelector(state => state.barra);
    type telasTipo = {
        img: any,
        proximaTela: keyof TiposRotas,
        usuarioAtual: string,
        altura: number,
        largura: number,
    };
    
    const telas: telasTipo[] = [
        {
            img: require('../../../assets/barra/casa.png'),
            proximaTela: 'TelaPrincipal',
            usuarioAtual,
            altura: 42,
            largura: 42,
        },
        {
            img: require('../../../assets/barra/perfil.png'),
            proximaTela: 'PerfilUsuario',
            usuarioAtual,
            altura: 50,
            largura: 50,
        },
        {
            img: require('../../../assets/barra/dieta.png'),
            proximaTela: 'Dieta',
            usuarioAtual,
            altura: 45,
            largura: 45,
        },
        {
            img: require('../../../assets/barra/gerarReceita.png'),
            proximaTela: 'GeradorReceita',
            usuarioAtual,
            altura: 55,
            largura: 55,
        },
        {
            img: require('../../../assets/barra/receitasApp.png'),
            proximaTela: 'Receitas',
            usuarioAtual,
            altura: 38,
            largura: 38,
        },
        {
            img: require('../../../assets/barra/criarReceita.png'),
            proximaTela: 'CriarReceita',
            usuarioAtual,
            altura: 38,
            largura: 38,
        },
    ];

    useEffect(() => {
        const user = onAuthStateChanged(authInstance, usuario => {
            if (!usuario) return;
            if (usuario?.email) setUsuarioAtual(Base64.encode(usuario.email));
        });
        return () => user();
    }, [authInstance]);
    // UseEffect que recupera o email do usuário.

    function redirecionarUser(telaAtual: number) {
        dispatch(modificaBarra(telaAtual));
        if (telas[telaAtual].proximaTela === "PerfilUsuario") 
        navigation.navigate("PerfilUsuario", {usuarioAtual, status_usuario: 'Outro'});
        else if (telas[telaAtual].proximaTela === "AdicionarAmigos") return;
        else if (telas[telaAtual].proximaTela === "Ranking") return;
        else if (telas[telaAtual].proximaTela === "GeradorReceita") navigation.navigate("GeradorReceita", {usuarioAtual});
        else if (telas[telaAtual].proximaTela === "CriarDieta") return;
        else if (telas[telaAtual].proximaTela === "DietaCriada") return;
        else if (telas[telaAtual].proximaTela === "Receita") return;
        else if (telas[telaAtual].proximaTela === "ReceitasFavoritas") return;
        else if (telas[telaAtual].proximaTela === "ReceitasCriadas") return;
        else
        navigation.navigate(telas[telaAtual].proximaTela);
    };
    // Função que redireciona o usuário para a tela que ele clicou.

    return (
        <ImageBackground
            source={require('../../../assets/TelaPrincipal/capa2.png')}
            resizeMode='cover'
            className='flex-row w-full h-[75px] items-center border border-neutral-200 border-1'
            >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {telas.map((icone, index) => (
                <Pressable 
                className='h-[50px] w-[50px] mx-4 justify-center items-center' 
                key={index} 
                onPress={() => redirecionarUser(index)}
                style={barra === index && {borderColor: "#6B91D6", borderWidth: 3, borderRadius: 15}}    >
                    <Image
                    source={icone.img}
                    className={`${index === 4 ? '-mt-1' : ''}`}
                    style={{height: icone.altura, width: icone.largura}}
                    />
                </Pressable>
                ))}
            </ScrollView>
        </ImageBackground>  
    );

{/* 
    Componente funcional React Native que renderiza uma barra horizontal de ícones dentro de um ImageBackground e permite
scroll horizontal. Cada ícone é um Pressable que chama redirecionarUser(index). 
    
    A função despacha modificaBarra (Redux) e navega para a rota correspondente (react-navigation), passando parâmetros
quando necessário. Usa Firebase Auth (onAuthStateChanged) para obter o e‑mail do usuário atual, codifica em Base64 e armazena 
em estado local (usuarioAtual); a subscrição é limpa no return do useEffect.
    
    Lista de telas/ícones definida localmente com imagem (require), dimensões e rota destino; algumas rotas são tratadas 
como noop (não navegam).
    
    Aplica estilo de item ativo via estado global (borda azul)
    
*/}
};
