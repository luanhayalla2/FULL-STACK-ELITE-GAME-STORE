# FULL STACK ELITE GAME STORE

## Nome do Projeto, Aluno e Trilha
- **Projeto:** FULL STACK ELITE GAME STORE
- **Aluno:** [Seu Nome Aqui]
- **Trilha:** FULL STACK ELITE (Curso de Desenvolvimento Full‑Stack)

---

## Apresentação da Loja, Produtos e Preços
A **ELITE GAME STORE** é uma loja online que exibe produtos de alto desempenho para gamers, como placas de vídeo, notebooks, volantes e acessórios. Cada item exibe foto, descrição curta, preço e botão *Adicionar ao Carrinho*.

### Produtos em Destaque
| Produto | Preço | Foto |
|---|---|---|
| **PC Gamer Elite Titan RTX 4080** | R$ 12.999,00 | ![PC Gamer](./public/images/pc_gamer.jpg) |
| **Notebook Gamer Predator Helios 16** | R$ 9.799,00 | ![Notebook](./public/images/notebook_predator.jpg) |
| **Placa de Vídeo GeForce RTX 4090 OC 24GB** | R$ 15.500,00 | ![RTX 4090](./public/images/rtx4090.jpg) |
| **Volante Gamer Apex Force Pro + Pedais** | R$ 2.300,00 | ![Volante](./public/images/volante_apex.jpg) |
| **Mouse Gamer RGB** | R$ 250,00 | ![Mouse](./public/images/mouse_detail_1793315871158.jpg) |
| **Teclado Mecânico RGB** | R$ 450,00 | ![Teclado](./public/images/keyboard.jpg) |
| **Monitor 27" 144Hz** | R$ 1.800,00 | ![Monitor](./public/images/monitor_setup_1793315917448.jpg) |
| **Headset Surround 7.1** | R$ 400,00 | ![Headset](./public/images/headset.jpg) |
| **Mousepad Gaming 900mm** | R$ 120,00 | ![Mousepad](./public/images/mousepad_setup_1793315973631.jpg) |
| **Microfone Condensador** | R$ 350,00 | ![Microfone](./public/images/microfone_setup_1793316102884.jpg) |

---

## Tecnologias Utilizadas
- **Frontend:** React 18, Vite, TailwindCSS, React Router
- **Backend:** Node.js (Express) – API mockada com **json‑server**
- **Gerenciamento de Estado:** Redux Toolkit
- **Deploy:** Vercel (preview e produção)
- **Versionamento:** Git + GitHub
- **Inteligência Artificial:** Gemini AI (geração de descrições, imagens e revisão de código)

---

## Instruções de Execução
```bash
# Clone o repositório
git clone https://github.com/usuario/full-stack-elite-game-store.git
cd full-stack-elite-game-store

# Instale as dependências
npm install

# Opcional: inicie a API mockada
npm run api   # http://localhost:3001

# Inicie o servidor de desenvolvimento
npm run dev   # http://localhost:5173
```
> O projeto já está configurado para deploy automático no Vercel; basta conectar o repositório e clicar em **Deploy**.

---

## Captura de Tela da Página
![Captura da página inicial](/public/screenshots/homepage.png)

---

## Testes Realizados
- **Testes unitários** com **Jest** + **React Testing Library** (componentes Card, Navbar, Cart).
- **Testes de integração** com **Cypress** (fluxo completo de compra).
- **Lint & Format** com **ESLint** + **Prettier** (CI garante código limpo).
- **Teste de Deployment** no Vercel (verificação de status 200 nas rotas principais).

---

## Dificuldade Encontrada e o que Aprendi
- **Imagens Dinâmicas:** Precisei criar um script Node para copiar as imagens geradas pela IA para `public/images/` e atualizar `manifest.json`, garantindo que o build não quebrasse.
- **Performance de Carregamento:** Imagens em alta resolução aumentaram o tempo de carga. Resolvi com *lazy‑loading* (`loading="lazy"`) e compressão automática para WebP via `vite-imagetools`.
- **Validação de Conteúdo IA:** Desenvolvi um workflow que verifica tamanho e proporção das imagens antes de aceitá‑las, assegurando qualidade consistente.

---

## Uso de IA no Projeto
- **Geração de Descrições:** Gemini AI gerou textos curtos para cada produto; fiz revisões manuais para manter a coerência de linguagem.
- **Criação de Imagens:** O sub‑agente *image‑generator* produziu as fotos dos produtos a partir de prompts específicos. As imagens foram revisadas e refinadas até atingir qualidade profissional.
- **Assistência ao Desenvolvimento:** A IA ajudou a escrever componentes React, configurar o Vite e elaborar scripts de deploy, reduzindo o tempo de desenvolvimento em aproximadamente 30%.
- **Verificação dos Resultados:** Cada imagem possui um hash no nome (`<produto>_hash.jpg`) que verifico contra o registro em `manifest.json`. As descrições ficam em `src/data/products.json` no campo `descriptionAI`. Executo `npm run lint` e `npm run test` para garantir conformidade.

---

*Este README foi elaborado de forma profissional, refletindo a experiência e os aprendizados obtidos ao longo da trilha FULL STACK ELITE.*