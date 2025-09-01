import "../../../global.css";
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../reducers/hooks';
import { getApp } from '@react-native-firebase/app';
import auth, {createUserWithEmailAndPassword, signInWithEmailAndPassword} from '@react-native-firebase/auth';
import { Base64 } from 'js-base64';
import { getDatabase, ref, set } from '@react-native-firebase/database';
import { modificaEmail } from '../../reducers/autenticacaoReducer';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import LoaderCompleto from "../loading/loadingCompleto";
import Ionicons from "react-native-vector-icons/Ionicons";

type Props = NativeStackScreenProps<TiposRotas, 'Login'>;

const app = getApp();
const authInstance = auth(app);
const db = getDatabase();


export default function FlipCardLogin({navigation}: Props) {
  const dispatch = useDispatch()
  const {email} = useAppSelector(state => state.autenticacao);
  
  // referências para nome, senha e email.
  const nomeRef = useRef<string>('');
  const senhaRef = useRef<string>('');
  const emailRef = useRef<string>('');
  const emailInputRef = useRef<TextInput>(null);
  const senhaInputRef = useRef<TextInput>(null);
  //

  const [login_cadastro, setLogin_Cadastro] = useState(false);
  const [verSenha, setVerSenha] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <LoaderCompleto/>
  );

  const Cadastro = async (email: string, senha: string, nome: string): Promise<void> => {
      // Função que executa o cadastro da pessoa.
        try {
          setLoadingAuth(true);
          const usuario = await createUserWithEmailAndPassword(authInstance, email, senha);
          // Cria um usuário com o email e a senha.

          await usuario.user.updateProfile({ displayName: nome });
          // Define o displayName como o nome do usuário.

          const emailB64 = Base64.encode(email);
          const userRef = ref(db, `usuarios/${emailB64}`);

          // Cria o banco de dados com o nome e email (por padrão) do usuário.
          await set(userRef, {
            nome: nome, // Nome do usuário.
            email: email, // Email do usuário.
            quantReceitas: 0, // Quantidade de receitas criadas pelo usuário.
            quantSeguindo: 0, // Quantidade de pessoas que o usuário segue.
            quantSeguidores: 0, // Quantidade de pessoas que seguem o usuário.
            xp: 0, // Quantidade de xp do usuário.
            rankingAtual: 'NoRank', // Ranking atual do usuário.
            receitasGeradas: 0, // Quantidade de receitas geradas pelo usuário.
          });

          // Lógica dos rankings e conquistas do usuário.

          await set(ref(db, `usuarios/${emailB64}/ranking/bronze`), {
            'avaliacoes_100': 0, // As receitas do usuário precisam ter 100 avaliações.
            'receita_criada_10': 0, // O usuário precisa criar 10 receitas.
            'receita_1_nota_4_com_10_avaliacoes': 0, // Uma de suas receitas tem uma nota média 4 com, no mínimo, 10 avaliações.
            'xp_1000': 0, // O usuário precisa adquirir 1000 de xp.
          });
          // Determina o ranking Bronze.

          await set(ref(db, `usuarios/${emailB64}/ranking/ouro`), {
            'avaliacoes_500': 0,
            'receita_criada_25': 0,
            'receita_5_nota_4_com_50_avaliacoes': 0, // Ter 5 receitas criadas com nota média 4 com, no mínimo, 50 avaliações.
            'xp_10000': 0,
          });
          // Determina o ranking Ouro.

          await set(ref(db, `usuarios/${emailB64}/ranking/diamante`), {
            'avaliacoes_1000': 0,
            'receita_criada_50': 0,
            'receita_10_nota_4_com_50_avaliacoes': 0,
            'xp_50000': 0,
          });
          // Determina o ranking Diamante.

          await set(ref(db, `usuarios/${emailB64}/ranking/esmeralda`), {
            'avaliacoes_2500': 0,
            'receita_criada_100': 0,
            'receita_20_nota_4_com_50_avaliacoes': 0,
            'receita_1_nota_4_5_com_100_avaliacoes': 0, // Ter uma receita com nota média 4.5 com, no mínimo, 100 avaliações.
            'xp_250000': 0,
          });
          // Determina o ranking Esmeralda.

          await set(ref(db, `usuarios/${emailB64}/ranking/chefeSupremo`), {
            'avaliacoes_5000': 0,
            'receita_criada_200': 0,
            'receita_30_nota_4_com_50_avaliacoes': 0,
            'receita_3_nota_4_5_100_avaliacoes': 0,
            'xp_1000000': 0,
          });
          // Determina o ranking Chefe Supremo.

          await set(ref(db, `usuarios/${emailB64}/conquistas/avaliacao_de_receitas_do_usuario`), {
            'avaliacao_100': 0,
            'avaliacao_250': 0,
            'avaliacao_500': 0,
            'avaliacao_1000': 0,
            'avaliacao_2500': 0,
            'avaliacao_5000': 0,
            'avaliacao_7500': 0,
            'avaliacao_10000': 0,
          });
          // Conquistas de avaliações das receitas do usuário.

          await set(ref(db, `usuarios/${emailB64}/conquistas/receitas_criadas`), {
            'receitas_criadas_3': 0,
            'receitas_criadas_10': 0,
            'receitas_criadas_25': 0,
            'receitas_criadas_50': 0,
            'receitas_criadas_100': 0,
            'receitas_criadas_1000': 0,
          });
          // Conquistas de receitas criadas pelo usuário.

          await set(ref(db, `usuarios/${emailB64}/conquistas/receitas_geradas`), {
            'receitas_geradas_3': 0,
            'receitas_geradas_10': 0,
            'receitas_geradas_25': 0,
            'receitas_geradas_50': 0,
            'receitas_geradas_100': 0,
            'receitas_geradas_1000': 0,
          });
          // Conquistas de receitas geradas pelo usuário.

          await set(ref(db, `usuarios/${emailB64}/conquistas/carnivoro_vegano_vegetariano`), {
            'carnivoro_vegano_vegetariano_1': 0,
            'carnivoro_vegano_vegetariano_10': 0,
            'carnivoro_vegano_vegetariano_50': 0,
            'carnivoro_vegano_vegetariano_100': 0,
            'carnivoro_vegano_vegetariano_1000': 0,
          });
          // Conquistas dos três tipos de receitas do usuário (carnivoro, vegetariano, vegano).

          navigation.reset({
            index: 0,
            routes: [{ name: 'CriarUsuario'}]
            });
          // O usuário é levado para a tela de criação do usuário.

      } catch (erro: any) {
          console.log(erro.message);

          switch (erro.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Erro', 'Este e-mail já está em uso.')
            break
          case 'auth/invalid-email':
            Alert.alert('Erro', 'Formato de e-mail inválido.')
            break
          case 'auth/weak-password':
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.')
            break
          case 'auth/operation-not-allowed':
            Alert.alert('Erro', 'Cadastro com e-mail e senha não está habilitado.')
            break
          case 'auth/account-exists-with-different-credential':
            Alert.alert('Erro', 'Conta existe com outro provedor. Faça login com ele primeiro.')
            break
          default:
            Alert.alert('Erro', 'Algo deu errado. Tente novamente.')
          };
          setLoadingAuth(false);
          // Salva o erro do cadastro.
      
      };
  };
  
  const Logar = async (email: string, senha: string): Promise<void> => {
    // Função que executa o login da pessoa, além de atualizar o banco de dados com o nó logados.    
        try {
          setLoadingAuth(true);
          await signInWithEmailAndPassword(authInstance, email, senha);
          // Faz login com o email e a senha que o usuário passou.

          navigation.reset({
            index: 0,
            routes: [{ name: 'CriarUsuario' }],
          })
        } catch (erro: any) {
            console.log(erro.message);

          switch (erro.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Erro', 'Este e-mail já está em uso.')
            break
          case 'auth/invalid-email':
            Alert.alert('Erro', 'Formato de e-mail inválido.')
            break
          case 'auth/weak-password':
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.')
            break
          case 'auth/operation-not-allowed':
            Alert.alert('Erro', 'Cadastro com e-mail e senha não está habilitado.')
            break
          case 'auth/account-exists-with-different-credential':
            Alert.alert('Erro', 'Conta existe com outro provedor. Faça login com ele primeiro.')
            break
          default:
            Alert.alert('Erro', 'Algo deu errado. Tente novamente.')
          };
            setLoadingAuth(false);
            // Salva o erro do login.
        };
  };

  if (login_cadastro) return (
    <View className="flex-1 h-[100%] bg-tela justify-center items-center">
      <StatusBar hidden />
      {/* Card com dois versos, um para fazer login e outro para criar usuário */}

      <View style={{ width: 300, height: 350, marginBottom: 100}}>
        <View
          className="bg-tela absolute w-[300px] h-[350px] rounded-[5px] p-5 justify-center items-center gap-[20px]"
        >
          <Text style={{color: '#57371fff'}} className='pb-1 text-4xl font-bold text-center'>
            Criar Usuário
          </Text>
          
          <View className="h-[50px] bg-white rounded-2xl flex-row border-2 border border-amber-200 items-center"
          style={{ width: 275}}
          >
          <Ionicons
          name='person'
          size={24}
          color="#57371fff"
          className="mx-2"
          />

          <TextInput
          onChangeText= {texto => (nomeRef.current = texto)}
          className="text-lg font-semibold text-gray-800 flex-1" 
          placeholder="Nome de Usuário" 
          placeholderTextColor="#57371fff"
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()} />
          </View>
          
          <View className="h-[50px] bg-white rounded-2xl flex-row border-2 border border-amber-200 items-center"
          style={{ width: 275}}
          >
          <Ionicons
          name='mail'
          size={24}
          color="#57371fff"
          className="mx-2"
          />
           
          <TextInput 
          ref= {emailInputRef}
          value= {email}
          onChangeText= {texto => {emailRef.current = texto; dispatch(modificaEmail(texto));}}
          placeholder="Email" 
          placeholderTextColor="#57371fff"
          returnKeyType="next" 
          onSubmitEditing={() => senhaInputRef.current?.focus()}
          keyboardType="email-address"
          className="text-lg font-semibold text-gray-800 flex-1"  />
          {/* Usa o redux para modificar o email */}

          </View>

          <View className="h-[50px] bg-white rounded-2xl flex-row border-2 border border-amber-200 items-center"
          style={{ width: 275}}
          >
          <Ionicons
          name='lock-closed'
          size={24}
          color="#57371fff"
          className="mx-2"
          />

          <TextInput 
          ref={senhaInputRef} 
          onChangeText= {texto => (senhaRef.current = texto)}
          className="text-lg font-semibold text-gray-800 flex-1"
          placeholder="Senha" 
          placeholderTextColor="#57371fff" 
          secureTextEntry = {!verSenha}
          returnKeyType="done" />

          <TouchableOpacity onPress={() => setVerSenha(!verSenha)}>
            <Ionicons
            name={verSenha? "eye" : "eye-off"}
            size={24}
            color="#57371fff"
            className=" mx-2"
            />
          </TouchableOpacity>
          </View>

          {loadingAuth && (
            <ActivityIndicator size="small" color="#323232" />
          )} 
          {!loadingAuth && (
          <TouchableOpacity
          className="w-[285px] bg-orange-400 h-[60px] items-center justify-center rounded-full"  
          onPress={() => Cadastro(emailRef.current, senhaRef.current, nomeRef.current)}>
            <Text 
            className="text-white font-bold text-3xl text-center"
            >Fazer Receitas!</Text>
          </TouchableOpacity>
          )
        }
                  <Image
          source={require('../../../assets/primeiraTela/Login/forno.png')}
          className="self-center h-[150px] w-[150px]"
          />
          {/* Cadastra o usuário passando o email, a senha e o nome dele */}

        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 h-[100%] bg-tela justify-center items-center">
      <StatusBar hidden />
      {/* Card com dois versos, um para fazer login e outro para criar usuário */}

      <View style={{ width: 300, height: 350, marginBottom: 100}}>
        <View
          className="bg-tela absolute w-[300px] h-[350px] rounded-[5px] p-5 justify-center items-center gap-[20px]"
        >
          <Image
          source={require('../../../assets/primeiraTela/Login/forno.png')}
          className="self-center h-[150px] w-[150px]"
          />
          <Text style={{color: '#57371fff'}} className='pb-1 text-4xl font-bold text-center'>
            Fazer Login
          </Text>
          
          <View className="h-[50px] bg-white rounded-2xl flex-row border-2 border border-amber-200 items-center"
          style={{ width: 275}}
          >
          <Ionicons
          name='mail'
          size={24}
          color="#57371fff"
          className="mx-2"
          />
           
          <TextInput 
          ref= {emailInputRef}
          value= {email}
          onChangeText= {texto => {emailRef.current = texto; dispatch(modificaEmail(texto));}}
          placeholder="Email" 
          placeholderTextColor="#57371fff"
          returnKeyType="next" 
          onSubmitEditing={() => senhaInputRef.current?.focus()}
          keyboardType="email-address"
          className="text-lg font-semibold text-gray-800 flex-1"  />
          {/* Usa o redux para modificar o email */}

          </View>

          <View className="h-[50px] bg-white rounded-2xl flex-row border-2 border border-amber-200 items-center"
          style={{ width: 275}}
          >
          <Ionicons
          name='lock-closed'
          size={24}
          color="#57371fff"
          className="mx-2"
          />

          <TextInput 
          ref={senhaInputRef} 
          onChangeText= {texto => (senhaRef.current = texto)}
          className="text-lg font-semibold text-gray-800 flex-1"
          placeholder="Senha" 
          placeholderTextColor="#57371fff" 
          secureTextEntry = {!verSenha}
          returnKeyType="done" />

          <TouchableOpacity onPress={() => setVerSenha(!verSenha)}>
            <Ionicons
            name={verSenha? "eye" : "eye-off"}
            size={24}
            color="#57371fff"
            className=" mx-2"
            />
          </TouchableOpacity>
          </View>
          {/* Usa o secureTextEntry para ocultar a senha */}

          {loadingAuth && (
            <ActivityIndicator size="small" color="#323232" />
          )} 
          {!loadingAuth && (
          <TouchableOpacity
          className="w-[285px] bg-orange-400 h-[60px] items-center justify-center rounded-full"  
          onPress={() => Logar(emailRef.current, senhaRef.current)}>
            <Text 
            className="text-white font-bold text-3xl text-center"
            >Entrar</Text>
          </TouchableOpacity>
          )}
          
          <View className="flex-row">
            <Text style={{color: '#57371fff'}} className='pb-1 text-xl font-bold text-center mr-2'>
              Não tem conta?
            </Text>
            <TouchableOpacity onPress={() => setLogin_Cadastro(true)}>
              <Text style={{color: '#57371fff'}} className='underline pb-1 text-xl font-bold text-center'>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>

);
};
