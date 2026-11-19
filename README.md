# Huff Studio · Portfólio

Portfólio da Huff Studio com os sites feitos pelo estúdio. HTML, CSS e JavaScript puro: sem etapa de build, é só abrir o `index.html`.

Publicação: GitHub Pages (branch `main`, pasta raiz) → https://huffstudio.github.io/Portf-lio/

## Seções
1. **Abertura**: "Huff." sobe letra por letra, o contador vai a 100% enquanto os prints carregam e o nome voa para o menu.
2. **Hero**: tipografia gigante com a pilha de prints dos sites trocando sozinha.
3. **Trabalhos (anel 3D)**: 12 cards dos sites girando sobre uma seda vinho em WebGL. Começa pequeno e inclinado e se abre ao redor de quem rola. Dá para arrastar, e passar o mouse inclina o card e mostra outra tela. Passar o mouse nos setores da frase destaca os sites daquele setor.
4. **No celular**: galeria horizontal com os prints de celular de cada site.
5. **Portfólio**: uma página por projeto (cor, print, celular, recursos, paleta e link).
6. **Estúdio**: texto, processo em 4 passos e a paleta da casa.
7. **Contato**: frase para completar, que vira um e-mail pronto.

## Como editar
Tudo o que muda fica em **`assets/js/data.js`**:
- `CONFIG.email`: e-mail que recebe os contatos (**trocar pelo real**).
- `PROJECTS`: os sites. Para adicionar um novo, copie um bloco e coloque 3 imagens em `assets/img`:
  `nome.webp` (tela inicial, 1280×800), `nome-2.webp` (outra tela, 1280×800) e `nome-m.webp` (celular, 600×1298).

## Arquivos
- `index.html`: estrutura
- `assets/css/style.css`: visual (cores no topo, em `:root`)
- `assets/js/data.js`: projetos e contato
- `assets/js/silk.js`: seda vinho do fundo do anel
- `assets/js/main.js`: abertura, anel 3D, galeria, revelações, cursor e formulário
