import React, {useState, useEffect} from 'react';
import "../../../global.css";
import { View, Text, ImageBackground, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { getDatabase, ref, get } from '@react-native-firebase/database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TiposRotas } from '../../navigation/types';
import { RankingUsuario } from './buscaDados';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

type Props = NativeStackScreenProps<TiposRotas, 'Ranking'>

const app = getApp();
const db = getDatabase(app);


export default function Ranking({ route }: Props) {
    const {usuarioAtual} = route.params;
    // Só será mostrado os rankings do seu usuário.
    const [passosBronze, setPassosBronze] = useState([]);
    const [passosOuro, setPassosOuro] = useState([]);
    const [passosDiamante, setPassosDiamante] = useState([]);
    const [passosEsmeralda, setPassosEsmeralda] = useState([]);
    const [passosCS, setPassosCS] = useState([]);
    const [ranking, setRanking] = useState<any>(require('../../../assets/Perfil/noRank.png'));
    const imagens = [
        require('../../../assets/Perfil/chefeSupremo.png'),
        require('../../../assets/Perfil/esmeralda.png'),
        require('../../../assets/Perfil/diamante.png'),
        require('../../../assets/Perfil/ouro.png'),
        require('../../../assets/Perfil/bronze.png'),
        require('../../../assets/Perfil/noRank.png'),
    ];

    useEffect(() => {
        // Função para verificar o ranking atual do usuário.
        async function buscaRanking() {
            const refRankingAtual = ref(db, `usuarios/${usuarioAtual}`);
            const snapshotRankingAtual = await get(refRankingAtual);
            const dados = snapshotRankingAtual.val();
            const RankingAtual = dados.rankingAtual;
            switch (RankingAtual) {
                case 'Chefe Supremo':
                    setRanking(require(`../../../assets/Perfil/chefeSupremo.png`));
                    break;
                case 'Esmeralda':
                    setRanking(require('../../../assets/Perfil/esmeralda.png'));
                    break;
                case 'Diamante':
                    setRanking(require('../../../assets/Perfil/diamante.png'));
                    break;
                case 'Ouro':
                    setRanking(require('../../../assets/Perfil/ouro.png'));
                    break;
                case 'Bronze':
                    setRanking(require('../../../assets/Perfil/bronze.png'));
                    break;
                default:
                    setRanking(require('../../../assets/Perfil/noRank.png'));
                    break;
            };
        };
        async function buscaPassos() {
            const todosPassos = await RankingUsuario(usuarioAtual, false);
            setPassosBronze(todosPassos[0]);
            setPassosOuro(todosPassos[1]);
            setPassosDiamante(todosPassos[2]);
            setPassosEsmeralda(todosPassos[3]);
            setPassosCS(todosPassos[4]);
        };
        buscaPassos();
        buscaRanking();

    }, [usuarioAtual]);

    return (
        <ImageBackground
            source={require('../../../assets/TelaPrincipal/capa.png')}
            resizeMode='cover'
            >
            <View
            className="absolute top-[5px] right-5 h-[75px] w-[75px] z-10"
            >
            <Image source={ranking} className="h-full w-full" />
            </View>
            {/* Seu Ranking Atual */}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="flex-grow my-5">
                
                <View style={{borderRadius: 50, borderWidth: 10}} className="justify-center bg-neutral-500 border-neutral-600 self-center h-[450px] w-[95%] items-center mb-[50px]">
                    <Image className="w-[150px] h-[150px]" source={imagens[5]} />
                </View>
                {/* NoRank */}
                                                                        
                <View style={{borderRadius: 50, borderWidth: 10}} className="justify-end bg-bronze500 border-bronze600 self-center h-[450px] w-[95%] items-center mb-[50px]">
                    <Image className="w-[150px] h-[150px] mb-6" source={imagens[4]} />
                    <View style={{borderRadius: 15}} className="bg-bronze400 h-[55%] mx-2 mb-4">
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="star-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 100 AVALIAÇÕES EM SUAS RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosBronze[0]/100}
                                color="#eca261ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosBronze[0]}/100
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="pizza-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                CRIE 10 RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosBronze[1]/10}
                                color="#eca261ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosBronze[1]}/10
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="medal-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 1 RECEITA COM MÉDIA DE 4.0 E NO MÍNIMO 40 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosBronze[2]}
                                color="#eca261ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosBronze[2]}/1
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Text className="font-bold text-2xl self-center ml-1 -mr-1">
                                🍪
                            </Text>
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                1000 COOKIES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosBronze[3]/1000}
                                color="#eca261ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosBronze[3]}/1000
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Bronze */}

                <View style={{borderRadius: 50, borderWidth: 10}} className="justify-end bg-yellow-400 border-yellow-500 self-center h-[450px] w-[95%] items-center mb-[50px]">
                    <Image className="w-[150px] h-[150px] mb-6" source={imagens[3]} />
                    <View style={{borderRadius: 15}} className="bg-yellow-200 h-[55%] mx-2 mb-4">
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="star-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 500 AVALIAÇÕES EM SUAS RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosOuro[0]/500}
                                color="#ffcc13ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosOuro[0]}/500
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="pizza-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                CRIE 25 RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosOuro[1]/25}
                                color="#ffcc13ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosOuro[1]}/25
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="medal-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 5 RECEITAS COM MÉDIA DE 4.0 E NO MÍNIMO 40 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosOuro[2]/5}
                                color="#ffcc13ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosOuro[2]}/5
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Text className="font-bold text-2xl self-center ml-1 -mr-1">
                                🍪
                            </Text>
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                10000 COOKIES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosOuro[3]/10000}
                                color="#ffcc13ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosOuro[3]}/10000
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Ouro */}
            
                <View style={{borderRadius: 50, borderWidth: 10}} className="justify-end bg-sky-500 border-sky-600 self-center h-[450px] w-[95%] items-center mb-[50px]">
                    <Image className="w-[150px] h-[150px] mb-6" source={imagens[2]} />
                    <View style={{borderRadius: 15}} className="bg-sky-200 h-[55%] mx-2 mb-4">
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="star-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 1000 AVALIAÇÕES EM SUAS RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosDiamante[0]/1000}
                                color="#1e6dffff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosDiamante[0]}/1000
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="pizza-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                CRIE 50 RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosDiamante[1]/50}
                                color="#1e6dffff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosDiamante[0]}/1000
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="medal-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 10 RECEITAS COM MÉDIA DE 4.0 E NO MÍNIMO 40 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosDiamante[2]/10}
                                color="#1e6dffff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosDiamante[1]}/50
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Text className="font-bold text-2xl self-center ml-1 -mr-1">
                                🍪
                            </Text>
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                50000 COOKIES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosDiamante[3]/50000}
                                color="#1e6dffff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosDiamante[3]}/50000
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Diamante */}
                
                <View style={{borderRadius: 50, borderWidth: 10}} className="justify-around bg-green-500 border-green-600 self-center h-[520px] w-[95%] items-center mb-[50px]">
                    <Image className="w-[150px] h-[150px] " source={imagens[1]} />
                    <View style={{borderRadius: 15}} className="bg-green-200 h-[60%] mx-2 mb-1">
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="star-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 2500 AVALIAÇÕES EM SUAS RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosEsmeralda[0]/2500}
                                color="#09ff00ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosEsmeralda[0]}/2500
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="pizza-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                CRIE 100 RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosEsmeralda[1]/100}
                                color="#09ff00ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosEsmeralda[0]}/100
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="medal-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 20 RECEITAS COM MÉDIA DE 4.0 E NO MÍNIMO 40 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosEsmeralda[2]/20}
                                color="#09ff00ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosEsmeralda[2]}/20
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="nutrition-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 1 RECEITA COM MÉDIA DE 4.5 E NO MÍNIMO 100 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosEsmeralda[3]/1}
                                color="#09ff00ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosEsmeralda[3]}/1
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Text className="font-bold text-2xl self-center ml-1 -mr-1">
                                🍪
                            </Text>
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                250000 COOKIES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosEsmeralda[4]/250000}
                                color="#09ff00ff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosEsmeralda[4]}/250000
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Esmeralda */}

                <View style={{borderRadius: 50, borderWidth: 10}} className="justify-around bg-purple-500 border-purple-600 self-center h-[520px] w-[95%] items-center mb-[50px]">
                    <Image className="w-[150px] h-[150px] " source={imagens[0]} />
                    <View style={{borderRadius: 15}} className="bg-purple-200 h-[60%] mx-2 mb-1">
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="star-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 5000 AVALIAÇÕES EM SUAS RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosCS[0]/5000}
                                color="#c8089eff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosCS[0]}/5000
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="pizza-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                CRIE 200 RECEITAS
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosCS[1]/200}
                                color="#c8089eff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosCS[1]}/200
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="medal-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 30 RECEITAS COM MÉDIA DE 4.0 E NO MÍNIMO 40 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosCS[2]/30}
                                color="#c8089eff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosCS[2]}/30
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Ionicons className='self-center ml-1 -mr-1' name="nutrition-outline" color="#54341cff" size={28} />
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                TENHA 3 RECEITAS COM MÉDIA DE 4.5 E NO MÍNIMO 100 AVALIAÇÕES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosCS[3]/3}
                                color="#c8089eff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[38px]">
                                {passosCS[3]}/3
                            </Text>
                        </View>
                        
                        <View className="flex-row w-full items-center ">
                            <Text className="font-bold text-2xl self-center ml-1 -mr-1">
                                🍪
                            </Text>
                            
                            <View className="items-center ml-2 w-[90%]">
                                <Text className="font-bold text-[#54341cff] mr-[18px] my-2 py-1 self-start">
                                1000000 COOKIES
                                </Text>
                                <Progress.Bar
                                className='self-start'
                                progress={passosCS[4]/1000000}
                                color="#c8089eff"
                                unfilledColor="#FFF3C4"
                                width={260}
                                height={6}
                                borderWidth={0}
                                borderRadius={5}
                                />
                            </View>
                            <Text className="font-bold text-[#54341cff] absolute right-[22px] top-[22px]">
                                {passosCS[4]}/1000000
                            </Text>
                        </View>

                    </View>
                </View>
                {/* Chefe Supremo */}

            </ScrollView>
        </ImageBackground>
);
};
