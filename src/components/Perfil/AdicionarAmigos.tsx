import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, get, set, update, remove } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { getApp } from '@react-native-firebase/app';
import auth, {onAuthStateChanged} from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoaderCompleto from '../loading/loadingCompleto';

type Props = NativeStackScreenProps<TiposRotas, 'AdicionarAmigos'>;

const app = getApp();
const db = getDatabase(app);
const authInstance = auth(app);


export default function AdicionarAmigos({navigation, route}: Props) {
  const [emailUserAtual, setEmailUserAtual] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  let { usuarioAtual, nome } = route.params;
  if (!usuarioAtual) usuarioAtual = emailUserAtual;

  const [abaAtiva, setAbaAtiva] = useState('seguindo');
  const [users, setUsers] = useState<any>([]);
  const [Seguindo, setSeguindo] = useState<any>([]);
  const [imagem, setImagem] = useState([
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
    require('../../../assets/Perfil/user.jpg'),
  ]);

  useEffect(() => {
    // Função que busca os usuários do aplicativo.
    setLoading(true);
    async function Buscar() {
      await buscarSeguindo();
    }
    Buscar();

  }, [usuarioAtual]);

  useEffect(() => {
    const user = onAuthStateChanged(authInstance, usuario => {
      if (!usuario || !usuario.email) return
      setEmailUserAtual(Base64.encode(usuario.email));
    });

    return () => user();
  }, [authInstance, usuarioAtual]);

  async function buscaUsuarios(seguindo: any): Promise<void> {
      try { 
        const refUsuarios = ref(db, `usuarios`);
        const snapshot = await get(refUsuarios);
        if (!snapshot.exists()) return;
        if (snapshot.exists()) {
          const usuarios = snapshot.val();
          const novosUsuarios = Object.fromEntries(
            Object.entries(usuarios).filter(
              ([key]) => key !== usuarioAtual
              )
            );
          // Pega todos os emails logados no aplicativo, removendo o email do usuário atual.
          
          const emailsSeguindoB64 = seguindo.map((user: any) => Base64.encode(user.email));
          const novosUsuarios_extra: any = Object.fromEntries(
            Object.entries(novosUsuarios).filter(
              ([key]) => !emailsSeguindoB64.includes(key)
              )
            );
          // Remove os usuários que o usuário atual já está seguindo.

          const listaUsuarios: any = Object.keys(novosUsuarios_extra).map(index => ({
              ...novosUsuarios_extra[index]
          }));
          // Monta uma lista com os usuários restantes, que o usuário atual ainda não está seguindo.
          
          const usuarios_que_te_seguem: any[] = [] 
          for (const user of listaUsuarios) {
            const refSeguidores = ref(db, `usuarios/${Base64.encode(user.email)}/seguindo/${usuarioAtual}`);
            const snapSeguidor = await get(refSeguidores);
            if (snapSeguidor.exists()) {
              usuarios_que_te_seguem.push(user);
            };
          };

          setUsers(usuarios_que_te_seguem);
          setLoading(false);

        };
        } catch (erro) {
          console.log('Erro Busca Usuário:', erro);
        };
      // Chama a função buscarSeguidor para atualizar a lista de seguidores.
  };

  const SeguirUsuario = async (email: string, nome: string): Promise<void> => {
    // Função para seguir um usuário.
    // A função é separada em duas partes.
    try {
    const emailB64 = Base64.encode(email);
    const refSeguindo = ref(db, `usuarios/${usuarioAtual}/seguindo/${emailB64}`);
    const snapshot = await get(refSeguindo);
    // Verifica se o usuário atual já está seguindo o outro usuário (que ele clicou para seguir).

    const refQuantSeguindo = ref(db, `usuarios/${usuarioAtual}`);
    const snapshotQuantSeguindo = await get(refQuantSeguindo);
    const dadosSeguindo = snapshotQuantSeguindo.val();
    const QuantSeguindo = dadosSeguindo?.quantSeguindo;
    const QuantSeguindoNovo = QuantSeguindo + 1;
    // Atualiza a quantidade de usuários que o usuário atual está seguindo.

    if (!snapshot.exists() || snapshot.exists()) {
      set(refSeguindo, {
        nome: nome,
        email: email,
      });
    };

    if (!snapshotQuantSeguindo.exists()) return;
    if (snapshotQuantSeguindo.exists()) {
      update(refQuantSeguindo, {
        quantSeguindo: QuantSeguindoNovo,
      });
    };
    // Essa é a primeira parte da função, que adiciona o usuário na lista de seguindo do usuário atual.
    
    if (!authInstance.currentUser) return;
    const nomeAtual = authInstance.currentUser.displayName;
    const refSeguidor = ref(db, `usuarios/${emailB64}/seguidores/${usuarioAtual}`);
    const snapshotSeguidor = await get(refSeguidor);

    const refQuantSeguidores = ref(db, `usuarios/${emailB64}`);
    const snapshotQuantSeguidores = await get(refQuantSeguidores);
    const dadosSeguidores = snapshotQuantSeguidores.val();
    const QuantSeguidores = dadosSeguidores?.quantSeguidores;
    const QuantSeguidoresNovo = QuantSeguidores + 1;
    // Atualiza a quantidade de seguidores do usuário que foi seguido.
    
    if (!snapshotSeguidor.exists() || snapshot.exists()) {
      set(refSeguidor, {
        nome: nomeAtual,
        email: authInstance.currentUser.email,
      });
    };

    if (!snapshotQuantSeguidores.exists()) return;
    if (snapshotQuantSeguidores.exists()) {
      update(refQuantSeguidores, {
        quantSeguidores: QuantSeguidoresNovo,
      });
    };
    // Essa é a segunda parte da função, que adiciona o usuário atual na lista de seguidores do usuário que foi seguido.
    await buscarSeguindo();

    } catch (erro) {
      console.log('Erro seguir usuário:', erro);
    };

  };

  const buscarSeguindo = async (): Promise<any> => {
    // Função para buscar os usuários que o usuário atual está seguindo.
    try {
    let usuariosSeguindo: any[] = [];
    const refSeguindoArray = ref(db, `usuarios/${usuarioAtual}/seguindo`);
    const snapshotSeguindo = await get(refSeguindoArray);
    console.log('teste4')
    
    if (!snapshotSeguindo.exists()) {
      await buscaUsuarios(usuariosSeguindo); 
      return;
    };
    const seguindo: any = Object.values(snapshotSeguindo.val());

    for (let i: number = 0; i<seguindo.length; i++) {
      let emailSeguindo = seguindo[i]?.email;
      let refNova = ref(db, `usuarios/${Base64.encode(emailSeguindo)}`);
      let snapshotNovo = await get(refNova);
      let dados = snapshotNovo.val();
      let emailUsuario = dados?.email;
      let nomeUsuario = dados?.nome;
      usuariosSeguindo = [...usuariosSeguindo, {email: emailUsuario, nome: nomeUsuario, id: i}]
    };
    // O for passa por todos os usuários seguidos, e recupera o email e o nome deles, além de criar um identificador.
    
    setSeguindo(usuariosSeguindo);
    await buscaUsuarios(usuariosSeguindo);

    } catch (erro) {
      console.log('Erro buscar Seguindo', erro);
    };
  };
  
  if (loading) return (
    <LoaderCompleto />
  );

  return (
  <View className="flex-1 bg-[#132022]">
    <Text className='text-[#888] font-bold text-2xl text-center self-center mt-8'>
      Amigos de {nome}
    </Text>
    <View className="flex-row mt-4 mb-2 h-[50px] justify-around border-2 border-[#5f636f8d] -mx-4">
      <TouchableOpacity
        className={`px-2.5 py-2 justify-center mx-2 border-b-2 ${
          abaAtiva === 'seguindo' ? 'border-[#007bff]' : 'border-transparent'
        }`}
        onPress={() => setAbaAtiva('seguindo')}
      >
        <Text
          className={
            abaAtiva === 'seguindo'
              ? 'text-[#007bff] text-xl font-bold text-center self-center'
              : 'text-[#888] text-xl text-center self-center'
          }
        >
          Seguindo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`px-2.5 py-2 mx-2 justify-center border-b-2 ${
          abaAtiva === 'Seguidores' ? 'border-[#007bff]' : 'border-transparent'
        }`}
        onPress={() => setAbaAtiva('Seguidores')}
      >
        <Text
          className={
            abaAtiva === 'Seguidores'
              ? 'text-[#007bff] text-xl font-bold text-center self-center'
              : 'text-[#888] text-xl text-center self-center'
          }
        >
          Seguidores
        </Text>
      </TouchableOpacity>
    </View>

    <View className="items-center mt-5 flex-1 mb-5">
      <ScrollView>
        {abaAtiva === 'Seguidores' && (
          <View className="w-full justify-center items-center">
            {users.length === 0 && (
              <View className="mx-4 mb-6 h-[75px] border-2 border-[#5f636f8d] rounded-xl flex-row items-center">
                  <Text className='text-xl opacity-95 w-full text-center text-white self-center'>
                      Ainda não tem seguidores
                  </Text>
              </View>
            )}
            
            {users.map((user: any, index: number) => (
              <TouchableOpacity key={index} onPress={() => navigation.navigate('PerfilUsuario', {usuarioAtual: Base64.encode(user.email), status_usuario: 'Seguir de volta!'})} className="items-center mx-[15px] w-full">
                <View className="flex-row justify-between mb-6 h-[75px] w-[90%] border-2 border-[#5f636f8d] rounded-xl flex-row items-center">
                <View className='flex-row'>
                    <Image source={imagem[index]} className="w-[45px] h-[45px] rounded-full items-center justify-center ml-4" />
                  <Text className="text-2xl ml-4 text-white self-center">{user.nome}</Text>
                </View>
                  <TouchableOpacity
                  className="bg-yellow-500 rounded-xl px-3 py-1 mr-2"
                  onPress={() => SeguirUsuario(user.email, user.nome)}
                >
                  <Ionicons name="person-add-sharp" size={24} color="#211309ff" />
                </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            
          </View>
        )}

        {abaAtiva === 'seguindo' && (
          <View className="w-full justify-center items-center">
            {Seguindo.length === 0 && (
              <View className="mx-4 mb-6 h-[75px] border-2 border-[#5f636f8d] rounded-xl flex-row items-center">
                  <Text className='text-xl opacity-95 w-full text-center text-white self-center'>
                      Ainda não segue ninguém
                  </Text>
              </View>
            )}

            {Seguindo.map((user: any, index: number) => (
              <TouchableOpacity key={index} onPress={() => navigation.navigate('PerfilUsuario', {usuarioAtual: Base64.encode(user.email), status_usuario: 'Seguindo'})} className="items-center mx-[15px] w-full">
                <View className="flex-row justify-between mb-6 h-[75px] w-[90%] border-2 border-[#5f636f8d] rounded-xl flex-row items-center">
                <View className='flex-row'>
                    <Image source={imagem[index]} className="w-[45px] h-[45px] rounded-full items-center justify-center ml-4" />
                  <Text className="text-2xl ml-4 text-white self-center">{user.nome}</Text>
                </View>
                  <Ionicons className="px-3 py-1 mr-2" name="chevron-forward-outline" size={24} color="#5f636fc9" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  </View>
);
};
             