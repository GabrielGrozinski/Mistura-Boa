Estados visuais com NativeWind
• `pressed:bg-blue-700` — altera bg quando está pressionado (Pressable).
• `pressed:scale-95` — reduz escala no press para efeito de 'aperto'.
• `pressed:opacity-80` — diminui opacidade enquanto pressiona.
• `active:*` — similar; nomes variam conforme versão; prefira `pressed:` com Pressable.

Efeitos comuns para feedback
• `pressed:scale-95` + `transition` (ou animar com Reanimated) — feedback de clique suave.
• `pressed:translate-y-0.5` — leve deslocamento para baixo ao pressionar.
• `pressed:opacity-90` — efeito sutil de escurecimento.

Ripple Android / activeOpacity
• Pressable (Android): Use a prop `android_ripple={{ color: 'rgba(0,0,0,0.1)' }}` para ripple nativo.
• TouchableOpacity: use `activeOpacity={0.7}` para controlar a opacidade no press.
• TouchableHighlight: `underlayColor` para cor de fundo temporária.
• Note: android_ripple é uma prop React Native e não passa por className.

Acessibilidade e roles
• `accessible={true}` — torna o componente acessível ao leitor de tela.
• `accessibilityRole='button'` — informa que é um botão.
• `accessibilityLabel` — rótulo descritivo para leitores de tela.
• `accessibilityState={{ disabled: true }}` — indica estado desabilitado.

Desabilitar / Estado disabled
• Controle o estado disabled com props e classes condicionais:
• ```tsx Salvar ```
• Ao desabilitar, remova efeitos `pressed:` e ajuste `pointerEvents`/`accessibilityState` quando
necessário.

Touch targets e hitSlop
• `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}` — aumenta área clicável sem 

alterar layout.
• Use `minWidth`/`minHeight` e padding para manter touch targets acessíveis (48x48 dp
recomendado).

Delay e comportamento de pressão
• `delayPressIn`, `delayPressOut`, `delayLongPress` — controlam timing do press/longPress.
• `onPressIn` / `onPressOut` — para gerenciar animações/manipular estado visual ao pressionar.

Combinação de classes e dinamismo
• Você pode passar arrays/strings dinâmicas no className: `className={[ 'p-3', pressed &&
'bg-blue-700' ]}`.
• Use callback render prop do Pressable para estilos baseados em estado (se preferir):
• ```tsx {({ pressed }) => ( OK )} ```

Animações simples sem libs externas
• Combinar `pressed:scale-95` com `transition` (quando disponível) ou usar
`Animated`/Reanimated para transições mais suaves.
• Para micro-interactions, escala+opacidade já geram bom feedback.

Boas práticas
• Prefira Pressable quando precisar de controle de estados; TouchableOpacity para casos
simples.
• Mantenha touch targets >= 48x48 dp para acessibilidade.
• Use hitSlop para elementos pequenos (ícones) sem mudar layout.
• Centralize classes comuns em componentes wrapper (e.g., IconButton, CardButton) para
consistência.
• Teste ripple e sombras em Android (comportamento pode variar).

Exemplos práticos variados
• Botão primário com efeito de press: ```tsx Enviar ```
• Icon button com hitSlop: ```tsx ```
• Card pressable com pressed state: ```tsx {({pressed}) => ( Detalhes )} ```

Limitações / Observações
• Nem todas as utilidades web-only (hover, focus-visible) funcionam no mobile.
• `android_ripple` exige que a View contenha cor de fundo para visualizar o ripple com contraste.
• Algumas classes de transição/animation do Tailwind podem não existir por padrão; prefira
Animated/Reanimated para animações avançadas