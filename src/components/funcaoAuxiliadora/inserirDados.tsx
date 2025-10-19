import { getDatabase, ref, set, get, update} from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';
import axios from 'axios';

const app = getApp();
const db = getDatabase(app);

const controller = new AbortController();
const api = axios.create({
    timeout: 15000,
    signal: controller.signal,
    baseURL: 'http://192.168.1.24:3000'
});


  export const PassarXP = async (email: string, valor: number): Promise<void> => {
    // Função responsável por passar xp.
    // Em específico nessa tela, a função têm dois parâmetros, um de email e outro do valor de xp.
    // O email é um parâmetro pois além do email do usuário logado, o email de quem criou uma receita também recebe xp.
    // No caso, a função é chamada para passar o xp de quem avaliou a receita e de quem teve a receita avaliada.
    try {
      const refXP = ref(db, `usuarios/${email}`);
      const snapshotXP = await get(refXP);
      const dadosXP = snapshotXP.val();
      const XP_ = dadosXP.xp;
      const XPNovo = XP_ + valor;
      
      update(refXP, {
        xp: XPNovo
      });

      // Faz uma série de verificações, para saber se o número de xp corresponde a um requisito de ranking.  
      if (XPNovo < 1000) {
        
        const refBronze = ref(db, `usuarios/${email}/ranking/bronze`);
        const snapshotBronze = await get(refBronze);
        const dadosBronze = snapshotBronze.val();
        const valor_Bronze = dadosBronze.xp_1000;
        const valorNovo = Number(valor_Bronze) + valor;
        
        if (valorNovo >= 1000) {
          update(refBronze, {'xp_1000': 1000});
        } else {
          update(refBronze, {'xp_1000': valorNovo});
        };
        // Atualiza o valor uma única vez.
      
      } else if (XPNovo >= 1000 && XPNovo < 10000) {
              
        const refOuro = ref(db, `usuarios/${email}/ranking/ouro`);
        const snapshotOuro = await get(refOuro);
        const dadosOuro = snapshotOuro.val();
        const valor_Ouro = dadosOuro.xp_10000;
        const valorNovo = Number(valor_Ouro) + valor;

        if (valorNovo >= 10000) {
          update(refOuro, {'xp_10000': 10000});
        } else {
          update(refOuro, {'xp_10000': valorNovo});
        };
        
      } else if (XPNovo >= 10000 && XPNovo < 50000) {
              
        const refDiamante = ref(db, `usuarios/${email}/ranking/diamante`);
        const snapshotDiamante = await get(refDiamante);
        const dadosDiamante = snapshotDiamante.val();
        const valor_Diamante = dadosDiamante.xp_50000;
        const valorNovo = Number(valor_Diamante) + valor;
        
        if (valorNovo >= 50000) {
          update(refDiamante, {'xp_50000': 50000});
        } else {
          update(refDiamante, {'xp_50000': valorNovo});
        };
        
      } else if (XPNovo >= 50000 && XPNovo < 250000) {
              
        const refEsmeralda = ref(db, `usuarios/${email}/ranking/esmeralda`);
        const snapshotEsmeralda = await get(refEsmeralda);
        const dadosEsmeralda = snapshotEsmeralda.val();
        const valor_Esmeralda = dadosEsmeralda.xp_250000;
        const valorNovo = Number(valor_Esmeralda) + valor;
        
        if (valorNovo >= 250000) {
          update(refEsmeralda, {'xp_250000': 250000});
        } else {
          update(refEsmeralda, {'xp_250000': valorNovo});
        };
        
      } else if (XPNovo >= 250000 && XPNovo < 1000000) {
              
        const refChefeSupremo = ref(db, `usuarios/${email}/ranking/chefeSupremo`);
        const snapshotChefeSupremo = await get(refChefeSupremo);
        const dadosChefeSupremo = snapshotChefeSupremo.val();
        const valor_ChefeSupremo = dadosChefeSupremo.xp_1000000;
        const valorNovo = Number(valor_ChefeSupremo) + valor;
        
        if (valorNovo >= 1000000) {
          update(refChefeSupremo, {'xp_1000000': 1000000});
        } else {
          update(refChefeSupremo, {'xp_1000000': valorNovo});
        };
        
      };

    } catch (erro) {
      console.log('Erro em PassarXP', erro);
    };
  };
  // Função responsável por aumentar o xp do usuário.

  export const verificarConquistas_e_Ranking = async (email: string): Promise<void> => {
    // Função que atualiza as conquistas e rankings do usuário que criou a receita.
    try {
      const refCarnivoro = ref(db, `usuarios/${email}/receitas/carnivoro`);
      const snapshotCarnivoro = await get(refCarnivoro);
      const dadosCarnivoro = snapshotCarnivoro.exists() ? snapshotCarnivoro.val().filter(Boolean) : 0;
      const somenteContador_car = snapshotCarnivoro.exists() ? dadosCarnivoro.map((receita: any) => receita.avaliacao.contador) : 0;
      const somaDosContadoresDeCarnivoro = snapshotCarnivoro.exists() ? somenteContador_car.reduce((acumulador: number, valorAtual: number) => 
      acumulador + valorAtual, 0) : 0;
      // Pega o número de contador de todas as receitas carnívoras daquele usuário, e depois as soma.

      const refVegano = ref(db, `usuarios/${email}/receitas/vegano`);
      const snapshotVegano = await get(refVegano);
      const dadosVegano = snapshotVegano.exists() ? snapshotVegano.val().filter(Boolean) : 0;
      const somenteContador_veg = snapshotVegano.exists() ? dadosVegano.map((receita: any) => receita.avaliacao.contador) : 0;
      const somaDosContadoresDeVegano = snapshotVegano.exists() ? somenteContador_veg.reduce((acumulador: number, valorAtual: number) => 
      acumulador + valorAtual, 0) : 0;
      // Faz a mesma coisa.
      
      const refVegetariano = ref(db, `usuarios/${email}/receitas/vegetariano`);
      const snapshotVegetariano = await get(refVegetariano);
      const dadosVegetariano = snapshotVegetariano.exists() ? snapshotVegetariano.val().filter(Boolean) : 0;
      const somenteContador_vege = snapshotVegetariano.exists() ? dadosVegetariano.map((receita: any) => receita.avaliacao.contador) : 0;
      const somaDosContadoresDeVegetariano = snapshotVegetariano.exists() ? somenteContador_vege.reduce((acumulador: number, valorAtual: number) => 
      acumulador + valorAtual, 0) : 0;
      // Faz a mesma coisa.

      const somaFinal = somaDosContadoresDeCarnivoro + somaDosContadoresDeVegano + somaDosContadoresDeVegetariano;
      // Soma os contadores de todas as receitas.

      const refConquistaAvaliacao: any = ref(db, `usuarios/${email}/conquistas/avaliacao_de_receitas_do_usuario`);

      // Faz uma extensa verificação, para saber se o usuário conquistou alguma conquista ou um tópico de ranking.
      if (somaFinal < 100) {
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_100);
        update(refConquistaAvaliacao, {
          'avaliacao_100': valorNovo >= 100 ? 100 : valorNovo
          });

        const refRankingBronze = ref(db, `usuarios/${email}/ranking/bronze`);
        update(refRankingBronze, {
          'avaliacoes_100': valorNovo >= 100 ? 100 : valorNovo,
        });
        if (valorNovo >= 100) await PassarXP(email, 100);
        // Atualiza a conquista de 100 avaliações, o ranking e passa 100 de xp, como recompensa.
      
      
      } else if (somaFinal >= 100 && somaFinal < 250) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_250);
        update(refConquistaAvaliacao, {
          'avaliacao_250': valorNovo >= 250 ? 250 : valorNovo
          });
          if (valorNovo >= 250) await PassarXP(email, 250);
      
      
      } else if (somaFinal >= 250 && somaFinal < 500) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_500);
        update(refConquistaAvaliacao, {
            'avaliacao_500': valorNovo >= 500 ? 500 : valorNovo
        });
        const refRankingOuro = ref(db, `usuarios/${email}/ranking/ouro`);
        update(refRankingOuro, {
            'avaliacoes_500': valorNovo >= 500 ? 500 : valorNovo,
        });
        if (valorNovo >= 500) await PassarXP(email, 500);

      
      } else if (somaFinal >= 500 && somaFinal < 1000) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_1000);
        update(refConquistaAvaliacao, {
          'avaliacao_1000': valorNovo >= 1000 ? 1000 : valorNovo,
        });
        const refRankingDiamante = ref(db, `usuarios/${email}/ranking/diamante`);
        update(refRankingDiamante, {
            'avaliacoes_1000': valorNovo >= 1000 ? 1000 : valorNovo,
        });
        if (valorNovo >= 1000) await PassarXP(email, 1000);


      } else if (somaFinal >= 1000 && somaFinal < 2500) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_2500);
        update(refConquistaAvaliacao, {
          'avaliacao_2500': valorNovo >= 2500 ? 2500 : valorNovo,
        });
        const refRankingEsmeralda = ref(db, `usuarios/${email}/ranking/esmeralda`);
        update(refRankingEsmeralda, {
            'avaliacoes_2500': valorNovo >= 2500 ? 2500 : valorNovo,
        });
        if (valorNovo >= 2500) await PassarXP(email, 2500);


      } else if (somaFinal >= 2500 && somaFinal < 5000) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_5000);
        update(refConquistaAvaliacao, {
          'avaliacao_5000': valorNovo >= 5000 ? 5000 : valorNovo,
        });
        const refRankingChefeSupremo = ref(db, `usuarios/${email}/ranking/chefeSupremo`);
        update(refRankingChefeSupremo, {
            'avaliacoes_5000': valorNovo >= 5000 ? 5000 : valorNovo,
        });
        if (valorNovo >= 5000) await PassarXP(email, 5000);


      } else if (somaFinal >= 5000 && somaFinal < 7500) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_7500);
        update(refConquistaAvaliacao, {
          'avaliacao_7500': valorNovo >= 7500 ? 7500 : valorNovo,
        });
        if (valorNovo >= 7500) await PassarXP(email, 7500);


      } else if (somaFinal >= 7500 && somaFinal < 10000) {
        
        const valorNovo = somaFinal + Number(refConquistaAvaliacao?.avaliacao_10000);
        update(refConquistaAvaliacao, {
          'avaliacao_10000': valorNovo >= 10000 ? 10000 : valorNovo,
        });
        if (valorNovo >= 10000) await PassarXP(email, 10000);

      };

      // Chama uma outra função também responsável por atualizar o ranking.
    } catch (erro) {
      console.log('Erro em verificarConquistas_e_Ranking', erro);
    };
  };
  // Função que verifica as conquistas e rankings referentes a avaliação de uma receita.

  export const verificaNotaReceita = async (email: string): Promise<void> => {
    // Função que analisa as notas das receitas do usuário.
    try {
      const refReceitasCarnivoras = ref(db, `usuarios/${email}/receitas/carnivoro`);
      const snapshotCarnivoro = await get(refReceitasCarnivoras);
      const dadosCarnivoro = snapshotCarnivoro.val().filter(Boolean);
      const carnivoro_nota_4 = dadosCarnivoro.filter((receita: any) => receita.avaliacao.media >= 4);
      // Pega todas as receitas com média maior ou igual a 4.

      const carnivoro_10_avaliacoes = carnivoro_nota_4.filter((receita: any) => receita.avaliacao.contador >= 10);
      // Separa as receitas com média 4 e pelo menos 10 avaliações.

      const carnivoro_50_avaliacoes = carnivoro_nota_4.filter((receita: any) => receita.avaliacao.contador >= 50) ;
      // Separa as receitas com média 4 e pelo menos 50 avaliações.

      const carnivoro_nota_4_5 = dadosCarnivoro.filter((receita: any) => receita.avaliacao.media >= 4.5);
      // Pega todas as receitas com média de 4.5 ou mais.

      const carnivoro_100_avaliacoes = carnivoro_nota_4_5.filter((receita: any) => receita.avaliacao.contador >= 100);
      // Separa as receitas com média 4.5 e pelo menos 100 avaliações.

      // Faz o mesmo, mas com receitas veganas.
      const refReceitasVeganas = ref(db, `usuarios/${email}/receitas/vegano`);
      const snapshotVeganas = await get(refReceitasVeganas);
      const dadosVeganas = snapshotVeganas.exists() ? snapshotVeganas.val().filter(Boolean) : [];
      const vegano_nota_4 = dadosVeganas.filter((receita: any) => receita.avaliacao.media >= 4);
      const vegano_10_avaliacoes = vegano_nota_4.filter((receita: any) => receita.avaliacao.contador >= 10);
      const vegano_50_avaliacoes = vegano_nota_4.filter((receita: any) => receita.avaliacao.contador >= 50);
      const vegano_nota_4_5 = dadosVeganas.filter((receita: any) => receita.avaliacao.media >= 4.5);
      const vegano_100_avaliacoes = vegano_nota_4_5.filter((receita: any) => receita.avaliacao.contador >= 100);

      // Faz o mesmo, mas com receitas vegetarianas.
      const refReceitasVegetarianas = ref(db, `usuarios/${email}/receitas/vegetariano`);
      const snapshotVegetarianas = await get(refReceitasVegetarianas);
      const dadosVegetarianas = snapshotVegetarianas.exists() ? snapshotVegetarianas.val().filter(Boolean) : [];
      const vegetariano_nota_4 = dadosVegetarianas.filter((receita: any) => receita.avaliacao.media >= 4);
      const vegetariano_10_avaliacoes = vegetariano_nota_4.filter((receita: any) => receita.avaliacao.contador >= 10);
      const vegetariano_50_avaliacoes = vegetariano_nota_4.filter((receita: any) => receita.avaliacao.contador >= 50);
      const vegetariano_nota_4_5 = dadosVegetarianas.filter((receita: any) => receita.avaliacao.media >= 4.5);
      const vegetariano_100_avaliacoes = vegetariano_nota_4_5.filter((receita: any) => receita.avaliacao.contador >= 100);

      // Extensa verificação de rankings conquistados:

      // 🔹 Bronze
      if (carnivoro_10_avaliacoes.length + vegano_10_avaliacoes.length + vegetariano_10_avaliacoes.length >= 1) {
        const bronzeRef = ref(db, `usuarios/${email}/ranking/bronze/receita_nota_4_com_10_avaliacoes_1`);
        const bronzeSnap = await get(bronzeRef);

        if (!bronzeSnap.exists() || bronzeSnap.val() === 0) {
          await update(ref(db, `usuarios/${email}/ranking/bronze`), {
            receita_nota_4_com_10_avaliacoes_1: 1,
          });
          // uma receita nota 4 com 10 avaliações.
          await PassarXP(email, 25);
        };
      }

      // 🔹 Ouro
      else if (carnivoro_50_avaliacoes.length + vegano_50_avaliacoes.length + vegetariano_50_avaliacoes.length >= 5) {
        const ouroRef = ref(db, `usuarios/${email}/ranking/ouro/receita_nota_4_com_50_avaliacoes_5`);
        const ouroSnap = await get(ouroRef);
        const valorNovo = Number(ouroSnap.val()) + 1;
        if (valorNovo > 5) return;
        
        await update(ref(db, `usuarios/${email}/ranking/ouro`), {
          receita_nota_4_com_50_avaliacoes_5: valorNovo >= 5 ? 5 : valorNovo,
        });
        // três receitas nota 4 com 50 avaliações.
        if (valorNovo >= 5) await PassarXP(email, 100);

      }

      // 🔹 Diamante
      else if (carnivoro_50_avaliacoes.length + vegano_50_avaliacoes.length + vegetariano_50_avaliacoes.length >= 10) {
        const diamanteRef = ref(db, `usuarios/${email}/ranking/diamante/receita_nota_4_com_50_avaliacoes_10`);
        const diamanteSnap = await get(diamanteRef);
        const valorNovo = Number(diamanteSnap.val()) + 1;
        if (valorNovo > 10) return;

        await update(ref(db, `usuarios/${email}/ranking/diamante`), {
          receita_nota_4_com_50_avaliacoes_10: valorNovo >= 10 ? 10 : valorNovo,
        });
        // 10 receitas nota 4 com 50 avaliações.
        if (valorNovo >= 10) await PassarXP(email, 250);
        
      }

      // 🔹 Esmeralda
      else if (carnivoro_50_avaliacoes.length + vegano_50_avaliacoes.length + vegetariano_50_avaliacoes.length >= 20) {
        const esmeralda20Ref = ref(db, `usuarios/${email}/ranking/esmeralda/receita_nota_4_com_50_avaliacoes_20`);
        const esmeralda20Snap = await get(esmeralda20Ref);
        const valorNovo = Number(esmeralda20Snap.val()) + 1;
        if (valorNovo > 20) return;

        await update(ref(db, `usuarios/${email}/ranking/esmeralda`), {
          receita_nota_4_com_50_avaliacoes_20: valorNovo >= 20 ? 20 : valorNovo,
        });
        // 20 receitas nota 4 com 50 avaliações.
        if (valorNovo >= 20) await PassarXP(email, 500);
      
      }
      

      // 🔹 Chefe Supremo
      else if (carnivoro_50_avaliacoes.length + vegano_50_avaliacoes.length + vegetariano_50_avaliacoes.length >= 30) {
        const chefe30Ref = ref(db, `usuarios/${email}/ranking/chefeSupremo/receita_nota_4_com_50_avaliacoes_30`);
        const chefe30Snap = await get(chefe30Ref);
        const valorNovo = Number(chefe30Snap.val()) + 1;
        if (valorNovo > 30) return;

        await update(ref(db, `usuarios/${email}/ranking/chefeSupremo`), {
          receita_nota_4_com_50_avaliacoes_30: valorNovo >= 30 ? 30 : valorNovo,
        });
        // 30 receitas nota 4 com 50 avaliações.
        if (valorNovo >= 30) await PassarXP(email, 750);

      }

      // 🔹 Esmeralda
      else if (carnivoro_100_avaliacoes.length + vegano_100_avaliacoes.length + vegetariano_100_avaliacoes.length >= 1) {
        const esmeralda100Ref = ref(db, `usuarios/${email}/ranking/esmeralda/receita_1_nota_4.5_com_100_avaliacoes`);
        const esmeralda100Snap = await get(esmeralda100Ref);
        const valorNovo = Number(esmeralda100Snap.val()) + 1;
        if (valorNovo > 1) return;

        await update(ref(db, `usuarios/${email}/ranking/esmeralda`), {
          'receita_1_nota_4.5_com_100_avaliacoes': 1,
        });
        // 1 receita nota 4.5 com 100 avaliações.
        await PassarXP(email, 1000);

      }

      // 🔹 Chefe Supremo
      else if (carnivoro_100_avaliacoes.length + vegano_100_avaliacoes.length + vegetariano_100_avaliacoes.length >= 3) {
        const chefe100Ref = ref(db, `usuarios/${email}/ranking/chefeSupremo/receita_3_nota_4.5_100_avaliacoes`);
        const chefe100Snap = await get(chefe100Ref);
        const valorNovo = Number(chefe100Snap.val()) + 1;
        if (valorNovo > 3) return;

        await update(ref(db, `usuarios/${email}/ranking/chefeSupremo`), {
          'receita_3_nota_4.5_100_avaliacoes': valorNovo >= 3 ? 3 : valorNovo,
        });
        // 3 receitas nota 4.5 com 100 avaliações.
        if (valorNovo >= 3) await PassarXP(email, 3000);

      };

    } catch (erro) {
      console.log('Erro em verificaNotaReceita', erro);
    };
  };
  // Função que verifica as conquistas e rankings referentas as notas de uma receita.

  export const UnirReceita_ao_Usuario = async (receita: any, email: string) => {
    // A função é separada em muitas partes.
    
    // Verifica Receita
    const refQuantReceitas = ref(db, `usuarios/${email}`);
    const snapshotReceitas = await get(refQuantReceitas);
    const dados = snapshotReceitas.val();
    const quantidade = dados?.quantReceitas || 0;
    const novaQuantidade = quantidade + 1;
    const idUsuario = novaQuantidade;
    await update(refQuantReceitas, {
        quantReceitas: novaQuantidade
    });
    // Verifica quantas receitas já foram criadas e adiciona mais uma.

    
    // Adiciona Receita
    const refReceitaAdicionar = ref(db, `usuarios/${email}/receitas/${idUsuario}`);
    await set(refReceitaAdicionar, {...receita, idUsuario: idUsuario});
    // É criado um novo indentificador dentro das receitas, responsável por ser um identificador geral, uma vez que uma receita carnívora...
    // ...pode ter o mesmo id de uma receita vegetariana ou vegana, e vice-versa.
    // O identificador é igual a quantidade de receitas criadas pelo usuário. Portanto, por exemplo, a 4° receita criada, terá o idUsuario: 4.

    
    // Atualizar Ranking
    const refConquistaReceitaCriada = ref(db, `usuarios/${email}/conquistas/receitas_criadas`);
    const refRankingBronze = ref(db, `usuarios/${email}/ranking/bronze`);
    const refRankingOuro = ref(db, `usuarios/${email}/ranking/ouro`);
    const refRankingDiamante = ref(db, `usuarios/${email}/ranking/diamante`);
    const refRankingEsmeralda = ref(db, `usuarios/${email}/ranking/esmeralda`);
    const refRankingChefeSupremo = ref(db, `usuarios/${email}/ranking/chefeSupremo`);

    if (novaQuantidade < 3) {
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_3': novaQuantidade,
      });
      // Conquista 3 receitas criadas.
    
    } else if (novaQuantidade < 10) {
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_3': 3,
      });
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_10': novaQuantidade,
      });
      
      await update(refRankingBronze, {
        'receita_criada_10': novaQuantidade,
      });
      
      await PassarXP(email, 100);
      // Conquista 3 e 10 receitas criadas.
      // Ranking bronze.

    } else if (novaQuantidade < 25) {
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_10': 10,
      });
      
      await update(refRankingBronze, {
        'receita_criada_10': 10,
      });
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_25': novaQuantidade,
      });
      
      await update(refRankingOuro, {
          'receita_criada_25': novaQuantidade,
      });
      
      await PassarXP(email, 250);
      // Conquista 10 e 25 receitas criadas.
      // Ranking bronze e ouro.
      
    } else if (novaQuantidade < 50) {
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_25': 25,
      });
      
      await update(refRankingOuro, {
          'receita_criada_25': 25,
      });

      await update(refConquistaReceitaCriada, {
        'receitas_criadas_50': novaQuantidade,
      });
      
      await update(refRankingDiamante, {
        'receita_criada_50': novaQuantidade,
      });
      
      await PassarXP(email, 1000);
      // Conquista 25 e 50 receitas criadas.
      // Ranking ouro e diamante.
      
    } else if (novaQuantidade < 100) {
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_50': 50,
      });
      
      await update(refRankingDiamante, {
        'receita_criada_50': 50,
      });

      await update(refConquistaReceitaCriada, {
        'receitas_criadas_100': novaQuantidade,
      });

      await update(refRankingEsmeralda, {
        'receita_criada_100': novaQuantidade,
      });

      await PassarXP(email, 5000);
      // Conquista 50 e 100 receitas criadas.
      // Ranking diamante esmeralda.
      
    } else if (novaQuantidade < 200) {
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_100': 100,
      });

      await update(refRankingEsmeralda, {
        'receita_criada_100': 100,
      });

      await update(refConquistaReceitaCriada, {
        'receitas_criadas_1000': novaQuantidade,
      });

      await update(refRankingChefeSupremo, {
        'receita_criada_200': novaQuantidade,
      });

      await PassarXP(email, 25000);

      // Conquista 100 e 1000 receitas criadas.
      // Ranking esmeralda e chefe supremo.

    } else if (novaQuantidade >= 200) {
      
      await update(refRankingChefeSupremo, {
        'receita_criada_200': 200,
      });
      
      await PassarXP(email, 50000);
      // Ranking chefe supremo.

    } else if (novaQuantidade >= 1000) {
      
      await update(refConquistaReceitaCriada, {
        'receitas_criadas_1000': novaQuantidade,
      });
      // Conquista 1000 receitas criadas.

    };

  };
  // Função responsável por unir a receita criada ao usuário que a criou.
  
{/* 
  
  Arquivo inserirDados fornece funções utilitárias que operam no Realtime Database do Firebase: 
1: PassarXP (incrementa XP do usuário e atualiza segmentos de ranking conforme thresholds). 
2: verificarConquistas_e_Ranking (calcula somas de avaliações de receitas e atualiza conquistas/rankings, 
chamando PassarXP quando aplicável).
3: verificaNotaReceita (analisa notas/contadores das receitas para desbloquear conquistas de qualidade).
4: UnirReceita_ao_Usuario (incrementa o contador de receitas do usuário, grava a nova receita e atualiza conquistas/ranking 
relacionados). 

  Todas usam get/set/update/ref do @react-native-firebase, fazem várias leituras e escritas sequenciais com awaits e tratam 
erros por console.log.
  
*/}
