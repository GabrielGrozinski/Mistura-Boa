import "../../../global.css";
import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, ref, set, update } from '@react-native-firebase/database';
import { Base64 } from 'js-base64';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TiposRotas } from '../../navigation/types';
import LinearGradient from "react-native-linear-gradient";

type Props = NativeStackScreenProps<TiposRotas, 'CriarUsuario'>;

const app = getApp();
const authInstance = auth(app);
const db = getDatabase(app);


export default function CriarUsuario({navigation}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [identificador, setIdentificador] = useState(0);
  type Escolha = { label: string, value: string, icone: string };
  const [choices, setChoices] = useState<Escolha[]>([
    { label: 'Aprender a cozinhar', value: 'aprender_cozinhar', icone: "👨‍🍳" },
    { label: 'Receitas diferentes', value: 'receitas_diferentes', icone: "🍲" },
    { label: 'Me tornar vegano', value: 'tornar_vegano', icone: "🍃" },
    { label: 'Controlar calorias', value: 'controlar_calorias', icone: "⚖️" },
    { label: 'Ficar fitness', value: 'ficar_fitness', icone: "🏃" },
    { label: 'Ganhar Músculo', value: 'ganhar_musculo', icone: "🏋️‍♂️" },
  ]);

  useEffect(() => {
    if (!authInstance.currentUser) return;
    // Define todos os valores de respostas.   
        if (identificador === 0) {
            setChoices([
    { label: 'Aprender a cozinhar', value: 'aprender_cozinhar', icone: "👨‍🍳" },
    { label: 'Receitas diferentes', value: 'receitas_diferentes', icone: "🍲" },
    { label: 'Me tornar vegano', value: 'tornar_vegano', icone: "🍃" },
    { label: 'Perder Peso', value: 'perder_peso', icone: "⚖️" },
    { label: 'Ficar fitness', value: 'ficar_fitness', icone: "🏃" },
    { label: 'Ganhar Músculo', value: 'ganhar_musculo', icone: "🏋️‍♂️" },
            ]);
      // Enquanto o "label" é o título da resposta que será mostrado ao usuário, o "value" é o valor que será mostrado no banco de dados.

        } else if (identificador === 1) {
            setChoices([
    { label: 'Iniciante na cozinha', value: 'iniciante', icone: "🆕" },
    { label: 'Intermediário (já cozinho algumas coisas)', value: 'intermediario', icone: "🍳" },
    { label: 'Avançado (cozinho com frequência)', value: 'avancado', icone: "🥪" },
    { label: 'Chef experiente', value: 'chef_experiente', icone: "🍛" },
    { label: 'Nunca cozinhei', value: 'nunca_cozinhei', icone: "👑" }
            ]);

        } else if (identificador === 2) {
            setChoices([
    { label: 'Vegetariano', value: 'vegetariano', icone: "🥗" },
    { label: 'Vegano', value: 'vegano', icone: "🥑" },
    { label: 'Carnívoro', value: 'carnivoro', icone: "🍖" },
    { label: 'Outro', value: 'outro', icone: "🍽️" }
            ]);

        } else if (identificador === 3) {
            setChoices([
    { label: 'Italiana', value: 'italiana', icone: "🍕" },
    { label: 'Japonesa', value: 'japonesa', icone: "🍣" },
    { label: 'Mexicana', value: 'mexicana', icone: "🌮" },
    { label: 'Brasileira', value: 'brasileira', icone: "🍛" },
    { label: 'Outra', value: 'outra', icone: "🥘" }
            ]);

        } else if (identificador === 4) {
            setChoices([
    { label: 'Anúncios nas redes sociais', value: 'redes_sociais', icone: "📰" },
    { label: 'Indicação de amigos', value: 'indicacao_amigos', icone: "🗣️" },
    { label: 'Busca na internet', value: 'busca_internet', icone: "🌐" },
    { label: 'Outro', value: 'outro', icone: "🔍" }
            ]);

        } else if (identificador === 5) {
          // Se o identificador é 5, significa que as perguntas terminaram.

          try {
          navigation.reset({
            index: 0,
            routes: [{name: 'primeiraTela'}]
          });
        } catch (erro) {
          console.log('Motivo:', erro);
        };
          // Nesse caso, é melhor usar o reset ao invés do navigate pois não é interessante o usuário voltar para essa tela.
        };

  }, [identificador, authInstance.currentUser]);

  const BotoesSelecionados = (valor: string) => {
      // Função que adiciona o valor selecionado com base no botão pressionado.
      if (selected.includes(valor)) {
            setSelected(
                selected.filter(itens => itens !== valor)
            );
            // Caso aquele botão já tenha sido selecionado, ele "filtra" ele do array, ou seja, desmarca o botão.
        } else {
            setSelected([...selected, valor]);
            // Caso contrário, adiciona ele.
        };
  };

  const PassarDados = () => {
      // Função que insere os dados do usuário no banco de dados.
      let informacao = '';
      authInstance.onAuthStateChanged(user => {
        if (user?.email) {
        const emailB64 = Base64.encode(user.email)
  
        if (identificador === 0) {
            informacao = `dados_do_usuário`;
        } else if (identificador === 1) {
            informacao = `nível_de_conhecimento`;
        } else if (identificador === 2) {
            informacao = `tipo_de_alimentação`;
        } else if (identificador === 3) {
            informacao = `comida_preferida`;
        } else if (identificador === 4) {
            informacao = `como_conheceu_app`;
        };
        // Verifica primeiro qual tipo de informação será passada.

        for (let i = 0; i < selected.length; i++) {
          let key: string = selected[i]  
          const userRef = ref(db, `usuarios/${emailB64}/${informacao}`);
            update(userRef, {
                [key]: 1,
            });
        };
        // Sempre ao clicar em avançar, adiciona as informações que o usuário colocou sobre a determinada informação.

        setSelected([]);
        // Reseta as informações.
        }
      })
  };

  return (
    <View className="flex-1 justify-center bg-white p-6 mb-6">
      <Text className="text-3xl font-bold text-center mb-4 text-[#323232]">
        {identificador === 0
            ? 'Qual seu objetivo neste aplicativo?'
            : identificador === 1
            ? 'Qual seu nível de conhecimento na cozinha?'
            : identificador === 2
            ? 'Qual seu tipo de alimentação?'
            : identificador === 3
            ? 'Qual sua culinária preferida?'
            : identificador === 4
            ? 'Como você conheceu nosso aplicativo?'
            : null
        }
      </Text>
      <Text className="mb-4 text-lg font-semibold text-center text-neutral-700">
        Isso vai nos ajudar a personalizar suas receitas
      </Text>
      <View className="mx-4">
        {choices.map(choice => (
          <TouchableOpacity
            key={choice.value}
            className="bg-[#f2f2f2] rounded-[12px] py-4 px-5 mb-4 items-center elevation-2 flex-row"
            style={selected.includes(choice.value) && {backgroundColor: '#2d8cf0'}}
            onPress={() => 
              identificador === 1 || identificador === 2 ? setSelected([choice.value]) :  
              BotoesSelecionados(choice.value)
            }
          >
          {/* Nas perguntas referentes ao identificador 1 e 2, o usuário só poderá marcar UMA opção, por isso ao invés de chamar
            a função específica, apenas adiciona um único valor à variavel useState.
          */}
            
            <Text className="text-lg text-[#323232] mr-2">{choice.icone}</Text>

            <Text className="text-lg text-[#323232]"
            style={selected.includes(choice.value) && {color: 'white'}}
            >{choice.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        className="mt-8 items-center elevation-1 rounded-full h-[55px] w-[315px] self-center overflow-hidden"
        onPress={() => {
            PassarDados()
            setIdentificador(identificador + 1)
        }        
        }
        disabled={selected.length === 0}
      >
        <LinearGradient
        colors={ selected.length !== 0 ? ['#4f46e5', '#9333ea'] : ['#ccc', '#ccc']}
        className="w-[100%] h-[100%] items-center justify-center"
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        
        >
        <Text className="text-lg font-semibold text-white">Avançar</Text>
        </LinearGradient>
      </TouchableOpacity>
      
    </View>
  );
};
