import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, Text, ImageBackground, Pressable } from 'react-native';
import * as Progress from 'react-native-progress';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, ref, update, get } from '@react-native-firebase/database';
import auth, {onAuthStateChanged, signOut, reload} from '@react-native-firebase/auth';
import { Base64 } from 'js-base64';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import "../../../global.css";
import Barra from '../Barra/Barra';
import ImmersiveMode from 'react-native-immersive';
import { TipoDeAlimentacao, QuantXP } from '../Perfil/buscaDados';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { modificaRefeicao } from '../../reducers/filtrarReducer';
import { modificaAlmoco, modificaJantar, modificaCafeDaManha, modificaSobremesa } from '../../reducers/refeicoesReducer';
import LoaderCompleto from '../loading/loadingCompleto';


type Props = NativeStackScreenProps<TiposRotas, 'TelaPrincipal'>;

const app = getApp();
const db = getDatabase(app);
const authInstance = auth(app);


export default function TelaPrincipal({navigation}: Props) {
  const dispatch = useAppDispatch();
  const {barraCafeDaManha, barraAlmoco, barraSobremesa, barraJantar} = useAppSelector(state => state.refeicoes);
  const imagem = useRef<string>('');
  const [loadingImagem, setLoadingImagem] = useState<boolean>(false);
  // Todas as barras começam com 0.
  
  const [XP, setXp] = useState(0);
  const tela_de_receita = useRef<any>('');
  
  const todasRefeicoes = [
    {
      img: require('../../../assets/TelaPrincipal/CafeDaManha.png'),
      texto: 'Café da Manhã',
      barra: barraCafeDaManha,
      filtro: 'cafe_da_manha',
      troca: modificaCafeDaManha(1)
    },
    {
      img: require('../../../assets/TelaPrincipal/Almoco.png'),
      texto: 'Almoço',
      barra: barraAlmoco,
      filtro: 'prato_principal',
      troca: modificaAlmoco(1)
    },
    {
      img: require('../../../assets/TelaPrincipal/Sobremesa.png'),
      texto: 'Sobremesa',
      barra: barraSobremesa,
      filtro: 'sobremesa',
      troca: modificaSobremesa(1)
    },
    {
      img: require('../../../assets/TelaPrincipal/Jantar.png'),
      texto: 'Jantar',
      barra: barraJantar,
      filtro: 'prato_principal',
      troca: modificaJantar(1)
    },
  ];
 
  useEffect(() => {
    ImmersiveMode.setImmersive(true);
    buscaUsuario();

  }, [authInstance]);
  // Chama a função buscaUsuario.

  useEffect(() => {
    const user = onAuthStateChanged(authInstance, async usuario => {
      if (!usuario || !usuario.email) return;
      const refUltimoLogin = ref(db, `usuarios${Base64.encode(usuario.email)}`);
      const snapshotUltimoLogin = await get(refUltimoLogin);
      const dadosLogin = snapshotUltimoLogin.val();
      const diaAtual_em_milissegundos = Date.now();
      const ultimoLogin = dadosLogin.ultimoLogin;
      const diasLogados: number = dadosLogin.diasLogados;
      if (diaAtual_em_milissegundos - ultimoLogin >= 86400000) {
        // 86.400.000 equivale a um dia em milissegundos.
        update(refUltimoLogin, {
          ultimoLogin: diaAtual_em_milissegundos,
          diasLogados: diasLogados + 1
        });

      } else if (diaAtual_em_milissegundos - ultimoLogin > 2*86400000) {
        update(refUltimoLogin, {
          ultimoLogin: diaAtual_em_milissegundos,
          diasLogados: 1
        });

      } else {
        update(refUltimoLogin, {
          ultimoLogin: diaAtual_em_milissegundos,
        });
      };
    });

    return () => user();
  }, [])
  // Atualizando o último login e dias logados.

  async function buscaUsuario() {
    if (!authInstance || !authInstance.currentUser) return;

    const usuario = onAuthStateChanged(authInstance, async user => {
      if (!user) return;

      console.log('Usuário detectado, recarregando dados...');
      setLoadingImagem(false);

      await reload(user); // atualiza dados do servidor
      const userAtualizado = authInstance.currentUser;

      console.log('Email:', userAtualizado?.email);
      console.log('PhotoURL:', userAtualizado?.photoURL);

      if (!userAtualizado?.email || !userAtualizado?.photoURL) {
        console.log('Photo ainda null, tentando novamente...');
        setTimeout(async () => {
          await reload(userAtualizado ?? user);
          const novoUser = authInstance.currentUser;
          console.log('Photo após reload extra:', novoUser?.photoURL);
          if (novoUser?.photoURL) {
            imagem.current = novoUser.photoURL;
            const emailB64 = Base64.encode(novoUser.email!);
            setLoadingImagem(true);
            buscaDados(emailB64);
          };
        }, 2000);
        return;
      };

      const emailB64 = Base64.encode(userAtualizado.email!);
      imagem.current = userAtualizado.photoURL!;
      setLoadingImagem(true);
      buscaDados(emailB64);
    });

    return () => usuario();
  };
  // Função que busca informações do usuário. 

  async function buscaDados(email: string) {
    const xp = await QuantXP(email);
    setXp(xp);
    const tipoAlimentacao = await TipoDeAlimentacao(email);
    if (tipoAlimentacao[0] === 'carnivoro') {
      tela_de_receita.current = 'ReceitasCarnivoraApp';
    } else if (tipoAlimentacao[0] === 'vegano') {
      tela_de_receita.current = 'ReceitasVeganaApp';
    } else if (tipoAlimentacao[0] === 'vegetariano') {
      tela_de_receita.current = 'ReceitasVegetarianaApp';
    } else {
      const numeroAleatorio = Math.random();
      numeroAleatorio < 0.3 ? tela_de_receita.current = 'ReceitasCarnivoraApp'
      : numeroAleatorio < 0.6 ? tela_de_receita.current = 'ReceitasVeganaApp'
      : tela_de_receita.current = 'ReceitasVegetarianaApp';
    };
  };
  // Função que busca o xp e o tipo de alimentação do usuário.

  if (!loadingImagem) return (<LoaderCompleto/>);

 
  return (
    <ImageBackground
      source={require('../../../assets/TelaPrincipal/capa2.png')}
      resizeMode='cover'
      >
      <ScrollView contentContainerClassName='grow pb-[180px]'>
        <View className='items-center justify-center flex-1 w-full h-full'>
          <Pressable onPress={async () => await signOut(authInstance)} className="items-center justify-center absolute top-6 left-6">
            <Image
              source={{uri: imagem.current}}
              className="w-[85px] h-[85px]"
            />
          </Pressable>
          <View className="items-center justify-center h-[40px] w-[130px] absolute top-12 right-6 rounded-full bg-[#fffdf2ff] flex-row">
            <Text className='text-2xl ml-1'>🍪</Text>
            <Text className='text-xl font-bold text-[#3A2C1A] self-center ml-2 mr-2'>{XP}</Text>
          </View>
          
          {/* Retângulo "cartão" central */}
          <View className="w-[75%] h-4/5 items-center justify-start">
            {todasRefeicoes.map((refeicao, index) => (
            <Pressable onPress={() => {
              navigation.navigate(tela_de_receita.current);
              dispatch(modificaRefeicao(refeicao.filtro));
              dispatch(refeicao.troca);
              }}
              key={index}
              className='justify-start items-center'
              disabled={refeicao.barra === 1}
              >
             
              <Image
              className={`w-[100px] h-[100px] rounded-full ${refeicao.barra === 0 && 'opacity-60'}`}
              source={refeicao.img}
              />
              <Text className='text-2xl font-bold text-[#3A2C1A] self-center text-center mt-2'>{refeicao.texto}</Text>
              {index !== 3 && (
              <Progress.Bar 
              progress={refeicao.barra} 
              width={60} height={8} color="#6BB972" 
              unfilledColor="#FFF3C4" borderWidth={0} 
              borderRadius={10} style={{ transform: [{ rotate: '-270deg' }, {translateX: 35}] }}
              className="mb-[50px]" />
              )}

            </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className='absolute -bottom-1'>
        <Barra />
      </View>
    </ImageBackground>
  );

{/* 
  
  Componente TelaPrincipal é uma tela React Native/TypeScript que apresenta o dashboard principal do usuário: ativa o modo imersivo, 
escuta o estado de autenticação (onAuthStateChanged), codifica o e‑mail em Base64 e atualiza os estados de último login e 
dias logados; recarrega os dados do usuário (reload) para obter photoURL e mostra LoaderCompleto até a imagem estar disponível. 

  Depois busca XP e tipo de alimentação (QuantXP, TipoDeAlimentacao) para escolher a tela de receitas recomendada, exibe cards 
de refeições com imagem, nome e uma barra de progresso ligada ao estado do Redux e navega para a tela de receitas ao pressionar 
(despachando ações de filtro); há um componente Barra fixo no rodapé. 

  Observações: por mais que o controle de refeições seja gerenciado pelo redux, o ideal é ser tratado por meio de um banco de dados, 
é claro; é possível trocar a lógica das refeições por uma árvore de receitas ou desafios, semelhante ao que o aplicativo Duolingo
faz.

*/}
};
