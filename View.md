Layout / Flexbox

• `flex-1` — ocupa todo o espaço disponível (flex: 1).
• `flex` — define display: flex (flex container).
• `flex-row` / `flex-col` — organiza filhos em linha ou coluna.
• `flex-wrap` / `flex-nowrap` — controla quebra de linha.
• `items-left`, `items-center` — alinha itens no eixo cruzado (alignItems).
• `justify-start`, `justify-between`, `justify-center` — alinha itens no eixo principal (justifyContent).
• `self-*` — controla alinhamento individual (alignSelf).
• `basis-{n}` — define flex-basis do item.

self-auto → valor padrão (alignSelf: "auto")

self-start → (alignSelf: "flex-start")

self-end → (alignSelf: "flex-end")

self-center → (alignSelf: "center")

self-stretch → (alignSelf: "stretch")

self-baseline → (alignSelf: "baseline")

Espaçamentos (Margin e Padding)
• `p-#` — padding geral.
• `px-#`, `py-#` — padding horizontal/vertical.
• `pt-#`, `pr-#`, `pb-#`, `pl-#` — padding específico.
• `m-#`, `mx-#`, `my-#`, `mt-#`, ... — margens equivalentes.
• `-mt-#` — margens negativas.
• `space-y-4` — margem vertical para os filhos da View.
• `space-x-4` — margem horizontal para os filhos da View.

Tamanhos (Width/Height)
• `w-auto` / `w-full` — largura automática ou 100%.
• `w-{n}` — largura fixa.
• `w-1/2`, `w-1/3`, ... — largura fracionada.
• `h-auto` / `h-full` / `h-[100px]` / `h-[10%]` — altura equivalente.
• `min-w-#`, `max-w-#`, `min-h-#`, `max-h-#` — restrições de tamanho.

Fundo / Background
• `bg-transparent` — fundo transparente.
• `bg-white`, `bg-black`, `bg-gray-100`, `bg-red-500` etc — cores de fundo.
• `bg-gradient-to-r`, `from-*`, `to-*` — gradientes (requer setup extra).

Bordas (Border)
• `border`, `border-0`, `border-2`, ... — largura da borda.
• `border-t`, `border-b`, `border-l`, `border-r` — lados específicos.
• `border-{color}` — cor da borda.
• `border-dashed`, `border-dotted`, `border-solid` — estilo.
• `rounded`, `rounded-md`, `rounded-xl`, `rounded-full` — bordas arredondadas.
• `rounded-tl-*`, `rounded-tr-*`, ... — cantos específicos.

Sombras & Elevação
• `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, ... — sombras cross-platform.
• `shadow-none` — remove sombra.
• No Android, muitas vezes é necessário `elevation` adicional.

Posicionamento
• `relative`, `absolute` — posicionamento.
• `top-#`, `bottom-#`, `left-#`, `right-#` — offsets.
• `inset-0`, `inset-x-0`, `inset-y-0` — atalhos de posicionamento.
• `z-#` — zIndex.

Overflow / Clipping
• `overflow-visible`, `overflow-hidden`, `overflow-scroll` — controle de overflow.

Opacidade / Visibilidade
• `opacity-0` ... `opacity-100` — níveis de opacidade.
• `hidden` — remove o elemento da árvore de layout.

Transformações
• `translate-x-#`, `translate-y-#` — deslocamentos.
• `scale-#` — escala.
• `rotate-#` — rotação em graus.

Pseudo-classes / Estados
• `active:bg-*` — aplicado em Pressable/Touchable para estado pressionado.
• `hover:*` — apenas no Web.

Utilitários diversos
• `overflow-hidden` — útil para cards com cantos arredondados.
• `overflow-visible` — útil para cards com cantos arredondados.
• `pointer-events-none` / `pointer-events-auto` — controle de eventos.
• `aspect-video` — define aspect ratio (com plugin).