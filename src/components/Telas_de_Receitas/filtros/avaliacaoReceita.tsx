import React, { useState, useEffect } from 'react';
import { View, Pressable, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getDatabase, ref, get, set, update } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import { Base64 } from 'js-base64';
import { PassarXP, verificarConquistas_e_Ranking, verificaNotaReceita } from '../../funcaoAuxiliadora/inserirDados';

const app = getApp();
const db = getDatabase(app);


type StarProps = {
  filled: boolean;
  onPress: () => void;
  disabled?: boolean;
  tamanho: number;
};

const Star = ({ filled, onPress, disabled, tamanho }: StarProps) => {
  return (
    <Pressable onPress={onPress} disabled={disabled} className={`${tamanho === 45 ? "mx-1" : "mx-[1.5px]"}`} >
      <Ionicons
        name={filled ? 'star' : 'star-outline'}
        size={tamanho}
        color={filled ? '#ffd83aff' : '#fbdf0cff'}
      />
    </Pressable>
  );
};

const AvaliacaoReceita = ({nome, usuarioAtual, No_de_Receita, recipe, tamanho}: any) => {
  // O usuarioAtual é o email do usuário logado em base64.
  // O No_de_Receita serve para definir se a receita é do aplicativo ou dos usuários.
  // Recipe é a receita em si.

  const [rating, setRating] = useState(0);
  const [ja_avaliou, setJa_Avaliou] = useState(true);
  const [estrelas, setEstrelas] = useState(0);


  useEffect(() => {
    // UseEffect que verifica se o usuário já avaliou a receita.
    if (!nome || !usuarioAtual || !No_de_Receita || !recipe || !tamanho) return;
    let ativo = true;

    async function verificarAvaliacao() {
      if (ativo) {
        setJa_Avaliou(true);
        setEstrelas(0);
      };
      
      const refUsuario = ref(db, `usuarios/${usuarioAtual}/avaliacoes/${No_de_Receita}/${recipe.tipo}/${recipe.id}`);
      const snapshot = await get(refUsuario);
      
      if (!ativo) return;

      if (!snapshot.exists()) {
        setJa_Avaliou(true);
        setEstrelas(0);
        // Se o usuário não avaliou a receita, setamos as estrelas para 0 e ja_avaliou para true.
      } else {
        setJa_Avaliou(false);
        const dados = snapshot.val();
        setEstrelas(dados.avaliou ?? 0);
        // Se o usuário já avaliou a receita, setamos as estrelas para o valor que ele avaliou.
        // Se o valor não existir (por algum motivo), setamos para 0.
      };
    };
    verificarAvaliacao();

    return () => { ativo = false; };
    // Faz uma limpeza no componente.

  }, [usuarioAtual, recipe, No_de_Receita]);

  const passarNota = async (valor: number): Promise<void> => {
    // Função que passa a nota para o banco de dados.
    try {
      if (ja_avaliou) {
        const refReceita = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/avaliacao`);
        const snapshot = await get(refReceita);
        const dados = snapshot.val(); 
        
        const notaAtual = dados.nota ? dados.nota : 0;
        const novaNota = notaAtual + valor;
        // Calcula a nova nota somando o valor do banco de dados com a nota atual.

        const quantidade = dados.contador ? dados.contador : 0;
        const novaQuant = quantidade + 1;
        // Calcula a nova quantidade de avaliações somando 1 ao contador atual.

        const media = parseFloat((novaNota/novaQuant).toFixed(1));
        // Calcula a média já com os valores atualizados.
    
        update(refReceita, {
          nota: novaNota,
          contador: novaQuant,
          media: media,
        });

        // Recupera a imagem do usuário.
        const refUsuario = ref(db, `usuarios/${usuarioAtual}`);
        const snapshotUsuario = await get(refUsuario);
        const dadosUsuario = snapshotUsuario.val();
        const imagemPerfil = dadosUsuario?.imagemPerfil;

        // Salva a avaliação no banco de dados da própria receita.
        const refAvaliacao = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/avaliacao/quem_avaliou`);
        const snapshotAvaliacao = await get (refAvaliacao);
        if (!snapshotAvaliacao.exists()) {
          set(refAvaliacao, {
            1: {
              nome: nome,
              nota: valor,
              email: usuarioAtual,
              imagemPerfil: imagemPerfil
            }
          });

        } else {
          const id = snapshotAvaliacao.numChildren();
          const refNovaAvaliacao = ref(db, `${No_de_Receita}/${recipe.tipo}/${recipe.id}/avaliacao/quem_avaliou/${id}`);
          update(refNovaAvaliacao, {
            nome: nome,
            nota: valor,
            email: usuarioAtual,
            imagemPerfil: imagemPerfil
          });
        };

        await nota_que_usuario_deu(valor);
        // Chama a função nota_que_usuario_deu, passando o valor de estrelas.

        setEstrelas(valor);
        setJa_Avaliou(false);
        // Não permite mais o usuário avaliar.

        Alert.alert('Avaliação', 'Obrigado por avaliar a receita!');
        await PassarXP(usuarioAtual, 1);
        // A cada receita que o usuário avaliar, o usuário recebe 1 xp.

        if (No_de_Receita === 'ReceitasUsuarios') {
          await PassarNota_do_Usuario(novaNota, novaQuant, media);
        };
        // Se for uma receita criada por um usuário, chama mais uma função.
      };
    } catch (erro) {
      console.log('Erro em passarNota', erro);
    };
  };
  
  const nota_que_usuario_deu = async (valor: number):Promise<void> => {
    // Função responsável por passar o valor que o usuário deu para a receita.
    try {
      const refUsuario = ref(db, `usuarios/${usuarioAtual}/avaliacoes/${No_de_Receita}/${recipe.tipo}`);
      const snapshot = await get(refUsuario);
      const idChildren = snapshot.numChildren();
      if (!snapshot.exists()) {
        const refUsuarioID = ref(db, `usuarios/${usuarioAtual}/avaliacoes/${No_de_Receita}/${recipe.tipo}/1`);
        set(refUsuarioID, {
        avaliou: valor,
        id: recipe.id
      });
      // Salva no banco de dados a nota da receita.
      } else {
          const refUsuarioIdChildren = ref(db, `usuarios/${usuarioAtual}/avaliacoes/${No_de_Receita}/${recipe.tipo}/${idChildren}`);
          const snapshotIdChildren = await get(refUsuarioIdChildren);
          if (!snapshotIdChildren.exists()) {
            set(refUsuarioIdChildren, {
              avaliou: valor,
              id: recipe.id
            });
          };
        // Só permite salvar a avaliação uma vez.
      };

    } catch (erro) {
      console.log('Erro em nota_que_usuario_deu', erro);
    };
  };

  const PassarNota_do_Usuario = async (novaNota: number, novaQuant: number, media: number): Promise<void> => {
    // Função que une a receita avaliada com o usuário que a criou.
    // Só é chamada em receitas criadas por usuários.
    try {
      const tipoUsuarioReceita = recipe.tipo;
      const emailUsuarioReceita = Base64.encode(recipe.email);
      // Pega o email do usuário que criou a receita.

      const idReceita = recipe.id;
      let refReceitaUsuario = ref(db, `usuarios/${emailUsuarioReceita}/receitas/${tipoUsuarioReceita}`)
      let snapshotReceitaUsuario = await get(refReceitaUsuario);
      let dadosReceitaUsuario = snapshotReceitaUsuario.val().filter(Boolean);
      let idDaReceita = dadosReceitaUsuario.filter((receita: any) => receita.id === idReceita);
      // Pega a receita com o id correto.

      let ReceitaCorreta = idDaReceita.map((receita: any) => receita.idReceitaUsuario);
      // Pega apenas o idReceitaUsuario.

      let refReceitaUsuarioFinal = ref(db, `usuarios/${emailUsuarioReceita}/receitas/${tipoUsuarioReceita}/${ReceitaCorreta}/avaliacao`);
      update (refReceitaUsuarioFinal, {
            nota: novaNota,
            contador: novaQuant,
            media: media,
      });
      // Basicamente, além de atualizarmos o valor das avaliações da receita apenas no nó principal de receitas,
      // Atualizamos também diretamente no nó do usuário que criou a receita.
      // Isso é útil caso seja necessário recuperar as avaliações das receitas de um usuário específico.
      // Obs: isso não é obrigatório, e daria para recuperar essas avaliações somente usando o nó principal de receitas,
      // Mas acredito que dessa forma fique mais intuitivo, apesar de, também, aumentar o database.
      // Portanto, talvez fosse necessário adaptar esse código se houvesse um número muito grande de receitas.

      await verificarConquistas_e_Ranking(emailUsuarioReceita);
      // Chama uma função que atualiza as conquistas e o ranking do usuário que criou a receita.

      await verificaNotaReceita(emailUsuarioReceita);
      // Chama uma outra função que atualiza as conquistas e o ranking do usuário que criou a receita.

      await PassarXP(emailUsuarioReceita, 1);
      // Chama a função PassarXP passando o email do usuário que criou a receita, não o usuário logado.

    } catch (erro) {
      console.log('Erro em PassarNota_do_Usuario', erro);
    };
  };


  return (
    <View className='justify-center items-center my-[20px]'>
      
      <View className='flex-row justify-center items-center'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          filled={ja_avaliou === false? i <= estrelas : i <= rating}
          onPress={() => {setRating(i); 
            passarNota(i)
          }}
          disabled = {ja_avaliou === false}
          tamanho = {tamanho}
        />
        ))}
        {/* Desabilita a opção de avaliar a receita caso o usuário já tenha avaliado */}
      </View>

    </View>
  );

{/* 
  
  Componente AvaliacaoReceita em React Native/TypeScript que exibe estrelas para avaliação de receitas, verifica se o usuário já 
avaliou usando Firebase Realtime Database, permite avaliar receita apenas uma vez, calcula média e contador de avaliações, 
atualiza avaliação tanto no nó principal da receita quanto no nó do usuário que criou a receita, integra funções auxiliares para 
passar XP, atualizar conquistas e ranking, usa Pressable e Ionicons para renderizar estrelas interativas, gerencia estado local 
de estrelas e avaliação, e trata receitas do app e de usuários.
  
*/}
};

export default AvaliacaoReceita;
 