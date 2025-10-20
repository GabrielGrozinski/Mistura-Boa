import React, { useState } from 'react';
import { Text, View, TextInput, Image, Modal, Pressable, TouchableOpacity } from 'react-native';
import { getDatabase, get, update, ref } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import Barra from '../Barra/Barra';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<TiposRotas, 'GeradorReceita'>;

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);

export default function GeradorReceita({ route, navigation }: Props) {
    const [modalVisivel, setModalVisivel] = useState<boolean>(false);
    const { usuarioAtual } = route.params;
    const [ingredientes, setIngredientes] = useState('');
    const [erro, setErro] = useState('');
    const cozinheiros = [
        {
            icone: require('../../../assets/GeradorReceita/hamburgao.png'),
            nome: 'Hamburgão',
            descricao: 'O Hamburgão adora receitas malucas!',
            cor1: 'rgba(255, 172, 47, 1)',
            cor2: 'rgba(220, 237, 74, 1)'
        },
        {
            icone: require('../../../assets/GeradorReceita/moranguinho.png'),
            nome: 'Moranguinho',
            descricao: 'A Moranguinho não gosta de bagunça!',
            cor1: 'rgba(146, 253, 39, 1)',
            cor2: 'rgba(96, 222, 157, 1)'
        },
        {
            icone: require('../../../assets/GeradorReceita/taco.png'),
            nome: 'Taco',
            descricao: 'O Taco ama comidas picantes!',
            cor1: 'rgba(255, 26, 26, 1)',
            cor2: 'rgba(210, 106, 68, 1)'
        }
    ];
    const [icone, setIcone] = useState(require('../../../assets/GeradorReceita/hamburgao.png'));
    const [nome, setNome] = useState('Hamburgão');
    const [descricao, setDescricao] = useState('O Hamburgão adora receitas malucas!');
    const [cor1, setCor1] = useState('rgba(255, 172, 47, 1)');
    const [cor2, setCor2] = useState('rgba(220, 237, 74, 1)');

    const FazerReceita = async (): Promise<void> => {
        setErro('');
        try {
            const receitaRef = ref(db, `usuarios/${usuarioAtual}`);
            const snapshot = await get(receitaRef);
            const dados = snapshot.val();
            const receitasGeradas = dados ? dados.receitasGeradas : 0;

            const recipe = {
                email: '',
                id: receitasGeradas + 1,
                title: 'Bife Grelhado com Alho',
                description: 'Suculento bife temperado com alho e ervas.',
                dif: 'Fácil de fazer!',
                time: '15 minutos ⏱️',
                image: null,
                autor: 'Hamburgão',
                tipo: 'carnivoro',
                refeicao: 'prato_principal',
                ingredientes: [
                    { ing: 'Batata', quantidade: '3', medida: 'unidade', id: 1 },
                    { ing: 'Carne', quantidade: '1', medida: 'unidade', id: 2 },
                    { ing: 'Macarrão', quantidade: '1', medida: 'unidade', id: 3 },
                    { ing: 'Queijo', quantidade: '1', medida: 'unidade', id: 4 },
                ],
                passos: [
                    'Cortar a carne',
                    'Temperar com sal e pimenta',
                    'Grelhar a carne em uma frigideira quente',
                    'Jogar ela no macarrão com queijo',
                    'Servir com batatas fritas',
                ],
                avaliacao: null,
                calorias: 0,
                peso: 0,
                proteina: 0,
            };

            receitaDB(recipe);
        } catch (error) {
            console.log('Erro ao gerar receita:', error);
        }
    };

    const receitaDB = async (recipe: any): Promise<void> => {
        try {
            const limiteRef = ref(db, `usuarios/${usuarioAtual}/limites`);
            const snapshotLimite = await get(limiteRef);
            const dados1 = snapshotLimite.val();
            const limite = dados1 ? dados1.limiteReceitasGeradas : 0;
            
            if (limite === 0) {
                setErro('Você atingiu o limite de receitas geradas. Por favor, tente novamente mais tarde.');
            } else {
                const novoLimite = limite - 1;
                await update(limiteRef, { limiteReceitasGeradas: novoLimite });
            }

            const receitasGeradasRef = ref(db, `usuarios/${usuarioAtual}`);
            const snapshotGeradas = await get(receitasGeradasRef);
            const dados2 = snapshotGeradas.val();
            const receitasGeradas = dados2 ? dados2.receitasGeradas : 0;
            const novoReceitasGeradas = receitasGeradas + 1;
            await update(receitasGeradasRef, { receitasGeradas: novoReceitasGeradas });

            const receitaRef = ref(db, `usuarios/${usuarioAtual}/receitasGeradasUser`);
            const snapshotReceita = await get(receitaRef);
            const id = snapshotReceita.exists() ? snapshotReceita.numChildren() : 1;
            await update(receitaRef, {
                [id]: recipe,
            });
            await verificaConquista(novoReceitasGeradas);
        } catch (erro) {
            console.log('Erro ao salvar receita no banco de dados:', erro);
            setErro('Erro ao salvar receita. Tente novamente.');
        }
    };

    const verificaConquista = async (receitasGeradas: number): Promise<void> => {
        const refConquista = ref(db, `usuarios/${usuarioAtual}/conquistas/receitas_geradas`);
        switch (receitasGeradas) {
            case 3:
                await update(refConquista, { 'receitas_geradas_3': 1 });
                break;
            case 10:
                await update(refConquista, { 'receitas_geradas_10': 1 });
                break;
            case 25:
                await update(refConquista, { 'receitas_geradas_25': 1 });
                break;
            case 50:
                await update(refConquista, { 'receitas_geradas_50': 1 });
                break;
            case 100:
                await update(refConquista, { 'receitas_geradas_100': 1 });
                break;
            case 1000:
                await update(refConquista, { 'receitas_geradas_1000': 1 });
                break;
            default:
                break;
        }
    };

    return (
        <View className="flex-1">
            <LinearGradient
                colors={[cor1, cor2]}
                className="w-full h-full justify-end items-center"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Pressable onPress={() => setModalVisivel(true)}>
                    <Image className="rounded-full h-[175px] w-[175px]" source={icone} />
                </Pressable>

                <Modal animationType='slide' transparent={false} onRequestClose={() => setModalVisivel(false)} visible={modalVisivel}>
                    <View className="flex-1 bg-[#132022] items-center">
                        <Text className='text-white mt-10 text-3xl font-bold text-center mb-10'>Escolha o seu cozinheiro!</Text>
                        <View className='h-full w-full flex-row flex-wrap'>
                            {cozinheiros.map((cozinheiro, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setModalVisivel(false);
                                        setIcone(cozinheiro.icone);
                                        setNome(cozinheiro.nome);
                                        setDescricao(cozinheiro.descricao);
                                        setCor1(cozinheiro.cor1);
                                        setCor2(cozinheiro.cor2);
                                    }}
                                    className='m-4'
                                >
                                    <Image className="rounded-full h-[90px] w-[90px]" source={cozinheiro.icone} />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </Modal>

                <View className='mb-4 -mt-6 bg-[#132022] w-40 opacity-98 h-12 items-center justify-center rounded-full'>
                    <Text className='font-bold text-2xl text-center opacity-96 text-white'>{nome}</Text>
                </View>

                <View className='bg-white items-center justify-center border border-b-2 border-neutral-200 rounded-2xl w-[90%] h-12 mb-4'>
                    <Text className='text-lg text-center'>{descricao}</Text>
                </View>

                <View style={{ borderRadius: 40, elevation: 1 }} className="bg-[#132022] opacity-98 w-[80%] h-[60%] items-center justify-start">
                    <Text className="text-2xl text-sky-300 mb-2 font-bold mt-8">Gerador de Receitas</Text>
                    <View className='flex-row mb-4 opacity-98 justify-center items-center'>
                        <TextInput
                            className="h-16 text-lg text-white text-semibold text-center"
                            placeholder="Quais ingredientes você tem?"
                            value={ingredientes}
                            onChangeText={setIngredientes}
                            placeholderTextColor={'#948f8fff'}
                        />
                        <Ionicons name="mic-outline" size={20} color="#BAE6FD" />
                    </View>
                    <TouchableOpacity className='bg-sky-400 opacity-98 h-[50px] w-[70%] items-center justify-center rounded-2xl' onPress={() => FazerReceita()}>
                        <Text className='text-white text-2xl font-bold text-center'>Gerar Receita</Text>
                    </TouchableOpacity>
                    {erro !== '' && (
                        <Text className="text-lg text-red-300 mt-6 text-center self-center">{erro}</Text>
                    )}
                </View>
            </LinearGradient>
            <View className="absolute -bottom-1">
                <Barra />
            </View>
        </View>
    );
};
