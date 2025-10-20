import "../../../global.css";
import React, {useState, useEffect} from 'react';
import Loader from './loading';
import {View, Text} from 'react-native';

export default function LoaderCompleto() {
  const mensagens = [
    "Levando suas receitas quentinhas...",
    "O caminhão tá cheio de sabor!",
    "Carregando ingredientes secretos...",
    "Abastecendo o tanque de temperos...",
    "Transportando delícias pra sua tela...",
    "Segura aí, o forno tá esquentando!",
    "Misturando pitadas de amor e código...",
    "Colocando as receitas no porta-malas...",
    "O caminhão da culinária tá a caminho!",
    "Checando se o sal tá no ponto...",
    "Abrindo o livro de receitas da casa...",
    "Preparando o banquete digital...",
    "O aroma das receitas já tá no ar!",
    "Cuidado com a fome! Tá quase pronto!",
    "Sabor a caminho...",
  ];
  const [numeroAleatorio, setNumeroAleatorio] = useState<number>(0);
  useEffect(() => {
  const numeroAtual = Math.floor(Math.random() * mensagens.length)
  setNumeroAleatorio(numeroAtual)
  }, []);


    return (
        <View className='bg-tela flex-1 h-[100%] items-center justify-center'>
            <Text style={{color: '#4B2E18'}} className='text-5xl py-2 font-bold text-center'>  
                {mensagens[numeroAleatorio]}
            </Text>
            <Loader/>
        </View> 
    );

{/* 
    
    Tela de loading final, com uma grande variedade de textos.
    
    Sugestões: uma ideia que tive e que acredito que seria bem interessante para manter o "Ciclo de Engajamento" seria
cada personagem (ao menos os mais difíceis de se conseguir) ter uma tela de loading própria. Por exemplo: o Poseidon
poderia ter uma tela de loading no mar; o Papai Noel, uma tela de loading dele indo entregar presentes e etc.
    
*/}
};
