1. Tamanho (Width / Height / Proporção)

w-10 / w-20 / w-full → Define a largura da imagem. Pode ser fixa ou relativa (full = 100%).

h-10 / h-20 / h-full → Define a altura da imagem.

min-w-0 / min-w-full → Define largura mínima.

max-w-0 / max-w-full → Define largura máxima.

min-h-0 / min-h-full → Define altura mínima.

max-h-0 / max-h-full → Define altura máxima.

aspect-[ratio] → Define proporção da imagem, ex: aspect-[16/9].

2. Margem e Espaçamento (Margin / Padding)

m-1 / m-2 / m-4 → Define margin em todos os lados.

mt-1 / mb-1 / ml-1 / mr-1 → Margin específica (top, bottom, left, right).

mx-1 / my-1 → Margin horizontal ou vertical.

p-1 / pt-1 / pb-1 / pl-1 / pr-1 → Padding (pouco usado em Image).

3. Borda (Border / Rounded)

border → Adiciona borda padrão (1px).

border-2 / border-4 → Espessura da borda.

border-red-500 / border-blue-200 → Cor da borda.

rounded / rounded-sm / rounded-lg / rounded-full → Arredonda os cantos da imagem.

rounded-tl / rounded-tr / rounded-bl / rounded-br → Arredondamento de cantos específicos.

4. Cor e Opacidade

bg-red-500 / bg-blue-200 → Cor de fundo (útil se imagem tiver transparência).

bg-opacity-50 → Opacidade do fundo.

opacity-50 / opacity-75 → Opacidade da imagem.

active:opacity-75 → Altera opacidade quando pressionada (interatividade).

5. Sombra (Shadow)

shadow / shadow-md / shadow-lg → Adiciona sombra à imagem.

shadow-red-500 / shadow-black → Cor da sombra.

6. Transformações (Transform)

rotate-45 / rotate-90 → Rotaciona a imagem.

scale-50 / scale-75 / scale-100 → Escala a imagem.

translate-x-2 / translate-y-2 → Move a imagem nos eixos x ou y.

7. Ajuste do Conteúdo (Object Fit / Overflow)

object-cover → A imagem cobre todo o container, cortando se necessário.

object-contain → A imagem se ajusta ao container sem cortar.

overflow-hidden → Esconde partes da imagem que ultrapassam os limites do container.

8. Ordem e Sobreposição (Z-index)

z-10 / z-20 / z-50 → Define ordem no eixo z (sobreposição).