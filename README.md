# 🍽️ Mistura Boa — App Inteligente de Receitas
Change the commit to EnglishVersion to read in English

 ![MisturaBoa](assets/README/readmePrincipal/MisturaBoa.png) 

Este projeto é um aplicativo de receitas feito em **React Native**, que combina **inteligência artificial**, **Firebase** e **design responsivo** para oferecer uma experiência personalizada ao usuário.  
O objetivo principal é apresentar uma arquitetura escalável, código limpo e práticas modernas de UI, servindo como projeto de **portfólio profissional**.

---

## Plataformas

- **Android** (desenvolvido e testado)
- Pode ser adaptado para iOS com pequenos ajustes

---

## Capturas de Tela

### Tela Inicial e Detalhes da Receita
| Início | Receitas |
|--------|----------|
| ![Início](assets/README/readmePrincipal/tela1.jpg) | ![Receitas](assets/README/readmePrincipal/tela2.jpg) |

### Criação de Receitas
| Gerador de Receita | Criar Receita |
|--------------------|---------------|
| ![GeradordeReceita](assets/README/readmePrincipal/tela3.jpg) | ![CriarReceita](assets/README/readmePrincipal/tela4.jpg) |

---

## Funcionalidades

- 🔐 **Autenticação com Firebase**
  - Login e cadastro com e-mail e senha
  - Gerenciamento de perfil com foto e nome
- 🧠 **Gerador de Receitas com IA**
  - Gera receitas com base nos ingredientes informados
  - Sugere combinações equilibradas usando IA generativa
- 🍴 **Gerador de Dieta com IA**
  - Cria planos alimentares personalizados (perda de peso, ganho de massa, vegetarianos, etc.)
  - Gera sugestões diárias/semanas com estimativas de macronutrientes
- 🍁 **Aplicativo Pensado a Longo Prazo**
  - Sistema de conquistas e rankings
  - Ícones de usuários para desbloquear
- ☁️ **Integração com Firebase Realtime Database**
  - Armazena receitas, favoritos e dados do usuário em tempo real
- 🖼️ **Upload de Imagens**
  - Envio e cache de fotos no MongoDB
- 💅 **Design Responsivo**
  - Estilização com **NativeWind** para um layout moderno e adaptável

---

## Bibliotecas / Ferramentas

Este projeto utiliza as seguintes bibliotecas e ferramentas:

- [React Native](https://reactnative.dev/) para o app Android  
- [TypeScript](https://www.typescriptlang.org/) para tipagem estática  
- [Firebase](https://firebase.google.com/) para autenticação, banco de dados e armazenamento  
- [NativeWind](https://www.nativewind.dev/) para estilização no padrão Tailwind  
- [React Navigation](https://reactnavigation.org/) para navegação   
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) (opcional para upload de imagens)
- [MongoDb](https://www.mongodb.com/) para armazenar dados e imagens.

---

## Estrutura do Projeto

Todo o código está localizado no diretório `src`, organizado para escalabilidade e legibilidade.

```
src/
 ├── components/       # Componentes reutilizáveis e Telas Principais
 ├── express/          # Estrutura do servidor dedicado
 ├── navigation/       # Navegação entre as telas 
 ├── reducers/         # Variáveis globais por meio do redux
 └── types/            # Tipagens globais em TypeScript
```

---

## Como Executar o Projeto

```bash
# Clonar o repositório
git clone https://github.com/GabrielGrozinski/Mistura-Boa.git

# Entrar no diretório
cd Mistura-Boa

# Instalar dependências
npm install

# Executar no Android
npx react-native run-android
```

---

## Filosofia do Projeto

Toda a lógica está organizada em **hooks** e **serviços** modulares, além dos **componentes principais**, garantindo separação entre as camadas de interface e dados.  
Isso facilita manutenção, legibilidade e integração com novos serviços de IA ou backends no futuro.

---

## Detalhes das Telas de Início (`src/components/Inicio`)

Esta pasta contém as telas iniciais do aplicativo, responsáveis pela experiência de entrada do usuário:

- **PrimeiraTela**  
  Tela de boas-vindas, com foco visual e apresentação do app. Não possui lógica de autenticação, apenas interface.
  Há também uma tela de loading que percorre por todo o aplicativo.

### Primeira Tela
| Início | Carregamento |
|--------|--------------|
| ![Início](assets/README/primeiraTela_e_Login/tela1.jpg) | ![Carregamento](assets/README/readmePrincipal/carregamento1.jpg) |

---

- **Login**  
  Tela para autenticação, permitindo ao usuário logar ou iniciar o cadastro. Integra com o Firebase para validação de credenciais e com o MongoDb para manutenção de dias logados.

### Login e Cadastro
| Login | Cadastro |
|-------|----------|
| ![Login](assets/README/primeiraTela_e_Login/tela2.jpg) | ![Cadastro](assets/README/primeiraTela_e_Login/tela3.jpg) |

---

- **CriarUsuario**  
  Tela de cadastro, onde o usuário informa dados como tipo de alimentação, objetivo com o aplicativo e foto de perfil. Realiza a criação do usuário no Firebase e prepara o perfil para uso no app.
  Alguns dados permitem mais de uma escolha, enquanto outros, como o tipo de alimentação, só permitem uma única escolha.

### Dados do Usuário
| Objetivo | Conhecimento |
|----------|--------------|
| ![Objetivo](assets/README/primeiraTela_e_Login/tela4.jpg) | ![Conhecimento](assets/README/primeiraTela_e_Login/tela5.jpg) |

| Alimentação | Culinária |
|-------------|-----------|
| ![Alimentação](assets/README/primeiraTela_e_Login/tela6.jpg) | ![Culinária](assets/README/primeiraTela_e_Login/tela7.jpg) |


| Pesquisa | Ícone |
|----------|-------|
| ![Pesquisa](assets/README/primeiraTela_e_Login/tela8.jpg) | ![Ícone](assets/README/primeiraTela_e_Login/tela9.jpg) |

---

## Detalhes da Tela de TelaPrincipal (`src/components/TelaPrincipal`)

Esta pasta contém a tela principal do aplicativo, responsável pela experiência base do usuário:

- **TelaPrincipal**  
  Tela Principal do aplicativo, onde o usuário tem a primeira experiência do aplicativo.
  A tela mostra o ícone do usuário, a quantidade de xp (mostrada em cookies) e a
  possibilidade de acessar receitas específicas de Café da Manhã, Almoço, 
  Sobremesa e Jantar.
  Embaixo desta e da maioria das telas há uma barra que permite o usuário alternar entre
  as telas.

### Tela Principal
| Tela Principal | Almoço | Almoço Concluído |
|----------------|--------|------------------|
| ![TelaPrincipal](assets/README/telaPrincipal/tela1.jpg) | ![Almoço](assets/README/telaPrincipal/tela2.jpg) | ![AlmoçoConcluído](assets/README/telaPrincipal/tela3.jpg) |

---

## Detalhes das Telas de Perfil (`src/components/Perfil`)

Esta pasta contém componentes referentes a tela de perfil do aplicativo, responsável por mostrar o perfil dos usuários e outras finalidades.

- **Perfil**  
  A tela base do perfil, onde temos o ícone do usuário (que ele pode trocar por outros, sendo que cada um tem seus próprios requisitos), o nome dele, quando o usuário foi criado (informação que é recuperada no MongoDb), o número de seguidores e 
  seguindo e um botão de adicionar amigos.
  Um pouco mais embaixo, há um container de visão geral, mostrando os dias (seguidos) de 
  login do usuário, a quantidade de receitas criadas, o xp e o ranking atual daquele usuário.
  Logo em sequência há um botão de Receitas Favoritas, de conquistas e das receitas criadas
  pelo usuário.
  Por fim, para o usuário liberar o botão de Receitas Criadas, ele precisa criar ao menos 3 receitas.
  Todas as informações são dinâmicas e mudam conforme o usuário usa o aplicativo.

### Tela de Perfil
| Perfil 1/2 | Perfil 2/2 |
|------------|------------|
| ![Perfil1/2](assets/README/perfil/tela1.jpg) | ![Perfil2/2](assets/README/perfil/tela2.jpg) |

---

### Tela de ícones
| ícones 1/2 | Ícones 2/2 |
|------------|------------|
| ![ícones1/2](assets/README/perfil/tela3.jpg) | ![ícones2/2](assets/README/perfil/tela4.jpg) |

---

### ícone de Poseidon
| Poseidon 1/2 | Poseidon 2/2 |
|--------------|--------------|
| ![Poseidon1/2](assets/README/perfil/tela5.jpg) | ![Poseidon2/2](assets/README/perfil/tela6.jpg) |

---

### Tela de Conquistas
| Conquistas 1/2 | Conquistas 2/2 |
|----------------|----------------|
| ![Conquistas1/2](assets/README/perfil/tela7.jpg) | ![Conquistas2/2](assets/README/perfil/tela8.jpg) |

---

### Tela de Receitas Criadas
| Receitas Criadas |
|------------------|
| ![ReceitasCriadas](assets/README/perfil/tela9.jpg) |

---

- **Adicionar Amigos** 
  A tela de adicionar amigos é acessada clicando no número de seguidores/seguindo ou clicando em adicionar amigos.
  Se clicado em em seguindo/seguidores, é mostrado os quem aquele usuário segue e por quem ele é seguido.
  É possível seguir um usuário a partir dessa tela, bem como é possível acessar o perfil do
  usuário e seguir ele de lá.
  Ao todo há 4 opções para o botão de adicionar amigos: o botão original, o botão de seguir, 
  seguindo e seguir de volta.

### Adicionar Amigos
| Usuários Para Seguir |
|----------------------|
| ![UsuáriosParaSeguir](assets/README/perfil/tela10.jpg) |

| Seguindo: 0 | Seguidores: 0 |
|-------------|---------------|
| ![Seguindo:0](assets/README/perfil/tela11.jpg) | ![Seguidores:0](assets/README/perfil/tela12.jpg) |

| Seguindo: 1 | Seguidores: 1 |
|-------------|---------------|
| ![Seguindo:1](assets/README/perfil/tela13.jpg) | ![Seguidores:1](assets/README/perfil/tela14.jpg) |

| Seguir | Seguindo |
|--------|----------|
| ![Seguir](assets/README/perfil/tela15.jpg) | ![Seguindo](assets/README/perfil/tela16.jpg) |

| Adicionar Amigos | Seguir de Volta |
|------------------|-----------------|
| ![AdicionarAmigos](assets/README/perfil/tela1.jpg) | ![SeguirdeVolta](assets/README/perfil/tela17.jpg) |

---

- **Ranking** 
  A tela de ranking mostra todos os rankings do aplicativo: NoRank (ranking inicial, que
  sequer é considerado um ranking), Bronze, Ouro, Diamante, Esmeralda e Chefe Supremo.
  Cada ranking tem os seus próprios requisitos, e eles são dinâmicos, portanto crescem conforme o usuário os completa.
  Na parte superior da tela é mostrado o ranking atual do usuário.

### Ranking
| Ranking 1/6 | Ranking 2/6 |
|-------------|-------------|
| ![Ranking1/6](assets/README/ranking/tela1.jpg) | ![Ranking2/6](assets/README/ranking/tela2.jpg) |

| Ranking 3/6 | Ranking 4/6 |
|-------------|-------------|
| ![Ranking3/6](assets/README/ranking/tela3.jpg) | ![Ranking4/6](assets/README/ranking/tela4.jpg) |

| Ranking 5/6 | Ranking 6/6 |
|-------------|-------------|
| ![Ranking5/6](assets/README/ranking/tela5.jpg) | ![Ranking6/6](assets/README/ranking/tela6.jpg) |

---

## Detalhes das Telas de Fitness (`src/components/Fitness`)

Esta pasta contém as as telas referentes a lógica de dieta do aplicativo, muito útil nos dias atuais.

- **Dieta**  
  A tela base, onde mostra as dietas do usuário (se ele criou alguma), além de dar a possibilidade de criar outras.

### Tela de Dietas
| Sem Dieta | Com Dieta |
|-----------|-----------|
| ![SemDieta](assets/README/criarDieta/tela1.jpg) | ![ComDieta](assets/README/criarDieta/tela2.jpg) |

---

- **CriarDieta**  
  A tela de criação da dieta, onde o usuário seleciona as opções, bem como o objetivo da dieta, o peso, a altura, restrições e o quanto ele pode gastar por dia, e uma Inteligência Artifical geraria a dieta.

  ### Criação da Dieta
| Objetivo | Peso |
|----------|------|
| ![Objetivo](assets/README/criarDieta/tela3.jpg) | ![Peso](assets/README/criarDieta/tela4.jpg) |

| Altura | Restrições |
|--------|------------|
| ![Altura](assets/README/criarDieta/tela5.jpg) | ![Restricoes](assets/README/criarDieta/tela6.jpg) | 

| Preço |
|-------|
| ![Preco](assets/README/criarDieta/tela7.jpg) |

---

- **DietaCriada**  
  Onde a dieta com os dados que o usuário passou é registrada.
  Nela há 4 refeições, com a quantidade dos macronutrientes em cada uma.
  Há também 4 refeições para cada dia da semana.
  **OBS: essa tela não foi finalizada. Ela é apenas um protótipo, pois não integrei a I.A no meu código, mas conceitualmente é isso que ela faria.**

### Dieta Criada
| Dieta Pronta |
|--------------|
| ![DietaPronta](assets/README/criarDieta/tela8.jpg) |

---

## Detalhes das Telas de GeraReceita de  (`src/components/GeraReceita`)

Esta pasta contém duas telas, uma referente a criação manual da receita e a geração de receita por I.A.

- **GeradorReceita**  
  A tela específica para gerar receitas com Inteligência Artificial. É possível alternar entre três "cozinheiros" (com personalidades diferentes): Hamburgão, Moranguinho e Taco.

### Gerador de Receitas
| Hamburgão | Moranguinho |
|-----------|-------------|
| ![Hamburgão](assets/README/gerarReceita/tela1.jpg) | ![Moranguinho](assets/README/gerarReceita/tela2.jpg) |

| Taco | Escolha do Cozinheiro |
|------|-----------------------|
| ![Taco](assets/README/gerarReceita/tela3.jpg) | ![EscolhadoCozinheiro](assets/README/gerarReceita/tela4.jpg) |

---

- **CriaReceita**  
  A tela onde é possível criar receitas.
  As receitas são criadas com características obrigatórias: Imagem, Título, Descrição, Dificuldade, Tempo, Passos da Receita, 
  Ingredientes da Receita, Tipo da Receita e Refeição.
  Algumas dessas opções são escritas pelo próprio usuário, enquanto outras são um conjunto de opções que o usuário somente 
  escolhe.
  Opções como texto e descrição possuem limite de caracteres.
  Cada receita criada funciona exatamente como as receitas base do aplicativo, e carregam todas as suas finalidades.

### Criador de Receitas
| Criar Receita 1/2 | Criar Receita 2/2 |
|-------------------|--------------------|
| ![CriarReceita1/2](assets/README/criarReceita/tela1.jpg) | ![CriarReceita2/2](assets/README/criarReceita/tela2.jpg) |

| Selecionar Imagem | Imagem Selecionada |
|-------------------|--------------------|
| ![SelecionarImagem](assets/README/criarReceita/tela3.jpg) | ![ImagemSelecionada](assets/README/criarReceita/tela4.jpg) |

| Descrição 1/6 | Descrição 2/6 |
|---------------|---------------|
| ![Descrição1/6](assets/README/criarReceita/tela5.jpg) | ![Descrição2/6](assets/README/criarReceita/tela6.jpg) |

| Descrição 3/6 | Descrição 4/6 |
|---------------|---------------|
| ![Descrição3/6](assets/README/criarReceita/tela7.jpg) | ![Descrição4/6](assets/README/criarReceita/tela8.jpg) |

| Descrição 5/6 | Descrição 6/6 |
|---------------|---------------|
| ![Descrição5/6](assets/README/criarReceita/tela9.jpg) | ![Descrição6/6](assets/README/criarReceita/tela10.jpg) |

| Passos da Receita |
|-------------------|
| ![PassosdaReceita](assets/README/criarReceita/tela11.jpg) |

| Ingredientes da Receita | Medida dos Ingredientes |
|-------------------------|-------------------------|
| ![IngredientesdaReceita](assets/README/criarReceita/tela12.jpg) | ![MedidadosIngredientes](assets/README/criarReceita/tela13.jpg) |

| Dificuldade | Tempo |
|-------------|-------|
| ![Dificuldade](assets/README/criarReceita/tela14.jpg) | ![Tempo](assets/README/criarReceita/tela15.jpg) |

| Refeição | Tipo da Receita |
|----------|-----------------|
| ![Refeição](assets/README/criarReceita/tela16.jpg) | ![TipodaReceita](assets/README/criarReceita/tela17.jpg) |

| Receita Criada | Avaliação da Receita Criada |
|----------------|-----------------------------|
| ![Refeição](assets/README/criarReceita/tela18.jpg) | ![TipodaReceita](assets/README/criarReceita/tela19.jpg) |

| Receita Criada Antes de ser Favoritada  | Após ser Favoritada |
|-----------------------------------------|---------------------|
| ![ReceitaCriadaAntesdeserFavoritada](assets/README/criarReceita/tela20.jpg) | ![ApósserFavoritada](assets/README/criarReceita/tela21.jpg) |

---

## Detalhes das Telas de Telas_de_Receitas de  (`src/components/Telas_de_Receitas`)

Esta pasta contém toda a lógica de receitas do aplicativo, como a separação das receitas por tipo, a filtragem delas e a própria tela de receita em si.

- **Receitas_app_e_usuarios**  
  As receitas são previamente separadas em Receitas Carnívoras (aplicativo), Receitas Carnívoras (usuários), Receitas Veganas (aplicativo), Receitas Veganas (usuários), Receitas Vegetarianas (aplicativo) e Receitas Vegetarianas (usuários).
  Além disso, há um indicativo sobre qual é o tipo de receita escolhida pelo usuário, desde que ele se cadastrou.

### Receitas Principais
| Carnívoro | Vegetariano | Vegano |
|-----------|-------------|------|
| ![Carnivoro](assets/README/tela_de_Receitas/tela1.jpg) | ![Vegetariano](assets/README/tela_de_Receitas/tela2.jpg) | ![Vegano](assets/README/tela_de_Receitas/tela3.jpg) |

---

- **Receitas Base**  
  Ao todo, há 6 telas de Receitas Base. Conceitualmente, cada uma teria as próprias receitas e dinâmicas, podendo criar seções exclusivas, como, por exemplo, em época de Natal, criar uma seção para receitas natalinas, ou se o usuário estiver usando o personagem Poseidon ter uma seção exclusiva de receitas do mar, que só aparecem para esse personagem.

### Receita Base Carnívora Aplicativo
| Receita Base |
|--------------|
| ![ReceitaBase](assets/README/tela_de_Receitas/tela4.jpg) |

---

- **Receitas Carnívoras, Veganas e Vegetarianas**  
  Todas as receitas são separadas por carnívoras, veganas e vegetarianas.
  É possível filtrar tais receitas de muitas formas, como receitas para emagrecer, para ganhar músculo; receitas mais fáceis, mais rápidas e com menos calorias.
  Também é possível filtrá-las por Café da Manhã, Prato Principal (almoço e janta), Sobremesa e Bebida.
  Os filtros são dinâmicos e funcionam em todas as receitas.
  Também é possível favoritar as receitas.

### Receitas
| Receitas Carnívoras | Filtro | Receitas Vegetarianas | Receitas Veganas |
|---------------------|--------|-----------------------|------------------|
| ![ReceitasCarnivoras](assets/README/receitas/tela1.jpg) | ![Filtro](assets/README/receitas/tela2.jpg) | ![ReceitasVegetarianas](assets/README/receitas/tela3.jpg) | ![ReceitasVeganas](assets/README/receitas/tela4.jpg) |

---

### Receitas Favoritas
| Favoritar Receita | Receitas Favoritas 1/2 | Receitas Favoritas 2/2 | Receitas Favoritas Filtradas |
|-------------------|------------------------|------------------------|------------------------------|
| ![FavoritarReceita](assets/README/receitas/tela17.jpg) | ![ReceitasFavoritas1/2](assets/README/receitas/tela18.jpg) | ![ReceitasFavoritas2/2](assets/README/receitas/tela19.jpg) | ![ReceitasFavoritasFiltradas](assets/README/receitas/tela20.jpg) |

---

### Receitas Criadas
| Receitas Criadas 1/2 | Receitas Criadas 2/2 |
|----------------------|----------------------|
| ![ReceitasCriadas1/2](assets/README/receitas/tela21.jpg) | ![ReceitasCriadas2/2](assets/README/receitas/tela22.jpg) |

---

- **Receita**  
  A tela de receita possui muitas mecânicas.
  De cima para baixo, ela traz a imagem da receita, junto ao título dela, o autor, o tempo de preparo e a avaliação da receita.
  Depois, os ingredientes e passos.
  Abaixo dos passos, há um temporizador (sempre com o tempo da própria receita), para o usuário poder usá-lo como parâmetro. O temporizador pode ser pausado.
  No fundo da receita estão os comentários e as avaliações, além de um botão de concluir receita, para o usuário poder marcar
  quais receitas ele já concluiu.
  Os comentários só podem ser acessados por usuários no mínimo ranking Bronze.
  O usuário pode avaliar ou comentar e avaliar a receita.

### Receita
| Receita 1/2 | Receita 2/2 |
|-------------|-------------|
| ![Receita1/2](assets/README/receitas/tela5.jpg) | ![Receita2/2](assets/README/receitas/tela6.jpg) |

---

### Temporizador
| Temporizador Pausar | Temporizador Continuar |
|---------------------|------------------------|
| ![TemporizadorPausar](assets/README/receitas/tela7.jpg) | ![TemporizadorContinuar](assets/README/receitas/tela8.jpg) |

---

### Concluir Receita
| Concluir Receita | Receita Concluida |
|------------------|-------------------|
| ![ConcluirReceita](assets/README/receitas/tela23.jpg) | ![ReceitaConcluida](assets/README/receitas/tela24.jpg) |

---

### Comentários e Avaliações
| Comentários | Avaliações | Comentários sem Ranking |
|-------------|------------|-------------------------|
| ![Comentários](assets/README/receitas/tela9.jpg) | ![Avaliações](assets/README/receitas/tela10.jpg) | ![ComentáriossemRanking](assets/README/receitas/tela11.jpg) |

| Avaliar Receita 1/2 | Avaliar Receita 2/2 | Receita Avaliada |
|---------------------|---------------------|------------------|
| ![AvaliarReceita1/2](assets/README/receitas/tela12.jpg) | ![AvaliarReceita2/2](assets/README/receitas/tela13.jpg) | ![ReceitaAvaliada](assets/README/receitas/tela14.jpg) |

| Escrever Comentário | Receita com Comentário |
|---------------------|---------------------|
| ![EscreverComentário](assets/README/receitas/tela15.jpg) | ![ReceitacomComentário](assets/README/receitas/tela16.jpg) |

---

## Monetização

Lógicamente, por ser um aplicativo para portfólio, não o monetizei, mas existem algumas ideias para fazê-lo gerar dinheiro.

- **Anúncios:** uma forma simples e prática de monetizar, mas que transmite a ideia de um aplicativo não-profissional. No
contexto do meu app, acredito que não seria interessante ter anúncios, com a exceção deles serem muito bem trabalhados, como,
por exemplo, na tela de gerar receitas com I.A, assim que o usuário clicar para gerar a receita, liberar o anúncio, uma vez que
a I.A demoraria alguns segundos para gerar a receita.
- **Assinatura:** forma muito comum de monetização em grandes aplicativos, e creio que seria muito mais prática no Mistura Boa. 
Inclusive, por mais que seja só um protótipo, o personagem Poseidon teria como requisito ser assinante do app. A assinatura poderia dar diversos benefícios: mais xp, mais receitas criadas por dia, receitas exclusivas para assinantes, personagens, passes de temporada, mais personagens para usar no gerador de receitas e até destaque em suas receitas criadas.

**No geral, tentei adaptar a lógica de produtos "live-service" no aplicativo. Prática que é muito comum em jogos.**
**A ideia é sempre manter o usuário entretido, criando objetivos para ele alcançar no aplicativo, criando uma pseudo-obrigação**
**dele em conquistar tais objetivos. O usuário se sente motivado a entrar diariamente no aplicativo, afinal, há prêmios por isso;**
**O usuário se sente motivado de criar receitas difíceis, afinal, há prêmios por isso; ele busca ganhar o máximo de xp pois quer muito usar um personagem específico e, para liberá-lo, precisa de uma certa quantidade de xp.**
**Toda a lógica de monetização de aplicativos live-service se concentra em vender assinaturas e micro-produtos, como personagens que você só libera pagando, e o engajamento do público se concentra muito na exclusividade. Se as pessoas decidirem gastar o próprio dinheiro, tem que ser por algo que elas julgam exclusivo.**
**É evidente que também é preciso haver um bom equilíbrio entre os assinantes terem vantagem o bastante para que a assinatura seja chamativa e que os não-assinantes não se sintam frustrados o bastante para desisntalarem o aplicativo.**

---

## Features extras

Aqui embaixo estão algumas features que não estão no aplicativo mas que poderiam estar. Elas servem para mostrar a minha visão sobre o app, como melhorá-lo e uma ideia geral do meu pensamento de como manter uma aplicação boa e rentável.

### Loading

O código possui uma tela de loading que percorre por todo o aplicativo.
Originalmente, a tela de loading possui uma única variação de imagem (caminhão andando) e diveras variações de texto.
Entretanto, existe a possibilidade de criar telas de loading exclusivas no aplicativo.
Por exemplo: uma tela de loading do Poseidon que só aparece se você estiver usando o personagem Poseidon.

| Poseidon | Papai Noel | Fantasma |
|----------|------------|----------|
| ![Poseidon](assets/README/readmePrincipal/carregamento2.png) | ![PapaiNoel](assets/README/readmePrincipal/carregamento3.png) | ![Fantasma](assets/README/readmePrincipal/carregamento4.png) |

---

### Eventos

Eventos são extremamente comuns em aplicativos hoje em dia, principalmente em apps que seguem a metodologia de engajamento do público.
No MisturaBoa, os eventos seriam destinados a receitas específicas, como receitas picantes, receitas que demoram 24 horas para serem feitas, as melhores receitas do ano e etc.

| Eventos |
|----------|
| ![Eventos](assets/README/readmePrincipal/eventos.png) |

---

### Receitas Festivas

Receitas festivas com certeza movimentariam o aplicativo em datas especiais. Seria bem plausível de esperar que o aumento de usuários (e, portanto, assinantes e produtos comprados) se intesificasse em época de Natal, Halloween, Páscoa e outras datas. Isso gera exclusividade e interesse.

| Halloween e Natal |
|-------------------|
| ![HalloweeneNatal](assets/README/readmePrincipal/receitasDestacadas.png) |

---

### Receitas Exclusivas

Bem como as receitas festivas, as receitas exclusivas geram exclusividade e, consequentemente, maior interesse e busca. Cada personagem (os mais difíceis de se conquistar, pelo menos) teria suas próprias receitas, o que, somado ao fato de alguns personagens só serem acessíveis por meio de assinatura e por meio de compra, aumentaria consideravelmente a monetização do aplicativo.

| Poseidon e Dragão |
|-------------------|
| ![PoseidoneDragão](assets/README/readmePrincipal/receitasExclusivas.png) |

---

### Receitas Lendárias

Essa é uma seção bem especial do aplicativo, onde haveria um "Livro Especial" contendo "Receitas Lendárias". Essencialmente são apenas receitas, mas com um toque artístico.
Para uma receita ser colocada neste livro, poderia ter um evento todo mês (ou ano) e o vencedor, isso é, a receita melhor avaliada, seria levada até este livro.
Para os assinantes, eles poderiam colocar até três de suas receitas para competir, enquanto usuários normais só poderiam colocar uma. Todos participam, mas os assinantes possuem mais chance.

| Receitas Lendárias |
|--------------------|
| ![ReceitasLendárias](assets/README/readmePrincipal/receitasLendarias.png) |

---

### Sistema de Ranking

O sistema de ranking já está implementado no aplicativo, mas há como deixar as recompensas por ranking muito mais abrangentes.
Por exemplo: para comentar em uma receita é necessário ser, no mínimo, ranking Bronze.
É possível repetir o padrão para todos os rankings. Segue alguns exemplos:
- **Ouro:** pode criar e gerar uma receita a mais todo dia.
- **Diamante:** recebe 1.5x mais de xp.
- **Esmeralda:** suas receitas ficam em destaque.
- **Chefe Supremo:** libera receitas e personagens exclusivos.

| NoRank | Bronze |
|--------|--------|
| ![NoRank](assets/README/ranking/noRank.png) | ![Bronze](assets/README/ranking/bronze.png) |

| Ouro | Diamante |
|------|----------|
| ![Ouro](assets/README/ranking/ouro.png) | ![Diamante](assets/README/ranking/diamante.png) |

| Esmeralda | Chefe Supremo |
|-----------|---------------|
| ![Esmeralda](assets/README/ranking/esmeralda.png) | ![ChefeSupremo](assets/README/ranking/chefeSupremo.png) |

---

### Árvore de Desafios/Receitas

É possível criar, seja na Tela Principal ou em um componente à parte, uma árvore de desafios ou receitas semelhante ao que o aplciativo Duolingo faz, onde o usuário realiza receitas específicas. Seria possível colocar receitas históricas, como o "Néctar e Ambrosia" dos deuses gregos, o famoso "Ratatouille", "Banquete de Gilgamesh", "Hidromel" e muitas outras, até chegar em uma "receita final".

| Árvore Duolingo | Árvore de Receitas |
|-----------|---------------|
| ![ArvoreDuolingo](assets/README/readmePrincipal/arvoreDeReceitas.jpg) | ![ArvoredeReceitas](assets/README/readmePrincipal/arvoreDeReceitasExemplo.png) |

---

### Cursos de Culinária

Cursos de culinária seriam um ótima adição aos assinantes do aplicativo. Uma forma de incentivar a qualidade das receitas e de se aumentar a arrecadação do app.

---

### Sistema de Energia

O sistema de energia está presente em boa parte dos aplicativos mobile, e é uma excelente forma de manter os usuários entretidos e promover a monetização.
Quando eu era mais jovem, me perguntava por que os jogos mobile (em sua grande maioria) tinham esse sistema de "energia", em que você é limitado a jogar o jogo apenas por algumas vezes ao dia.
Isso não fazia sentido para mim, afinal, por que não permitir que os usuários jogassem o quanto quisessem?
Mas, analisando hoje em dia, a lógica é bem simples.
Com o sistema de energia, os usuários nunca "se esgotam" do aplicativo. Se o app permitisse que eles o desfrutassem à vontade,
muito provavelmente, ainda nos primeiros dias, os usuários parariam de usá-lo, pois esgotariam toda a sua curiosidade.
No entanto, mantendo-os "presos", e, somado à atualizações futuras, o interesse é preservado por muito mais tempo.
Além, é claro, de uma clara estratégia de vender assinaturas, para que o usuário possa desfrutar um pouco mais do alicativo antes da cota de energia acabar.
**Seria possível introduzir essa mecânica para praticamente tudo do app, desde a criação e geração de receitas, conclusão de receitas e basicamente qualquer outra feature, com um pequeno ajuste, é claro.**

| Exemplo do Sistema de Energia |
|-------------------------------|
| ![ExemplodoSistemadeEnergia](assets/README/readmePrincipal/energia.jpg) |

---

## 📬 Contato

Fique à vontade para entrar em contato para dúvidas, sugestões ou oportunidades profissionais!

- **LinkedIn:** [LinkedIn](https://www.linkedin.com/in/gabriel-grozinski/)
- **E-mail:** gabrielgrozinski@gmail.com

---

Agradeço por visitar meu projeto!  
Estou aberto a feedbacks e oportunidades de colaboração.

---

## Observação

**Todos os arquivos possuem anotações próprias, mas sempre no fundo deles há uma anotação geral, abordando sobre ocomponente, possíveis melhorias, ideias para o futuro, o porquê de determinados códigos e etc.**
