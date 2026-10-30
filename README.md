# FULL STACK ELITE GAME STORE

---

## 📖 Sumário

- [Objetivo](#objetivo)
- [Apresentação da Loja](#apresentação-da-loja)
- [Produtos em Destaque](#produtos-em-destaque)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instruções de Execução](#instruções-de-execução)
- [Captura de Tela](#captura-de-tela)
- [Testes Realizados](#testes-realizados)
- [Dificuldades Encontradas & Aprendizado](#dificuldades-encontradas--aprendizado)
- [Uso de IA no Projeto](#uso-de-ia-no-projeto)
- [Como Verificar Resultados da IA](#como-verificar-resultados-da-ia)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 🎯 Objetivo

Este repositório demonstra a criação de uma **loja online de produtos para gamers** com foco em alto desempenho. O projeto serve como portfólio para a trilha **FULL STACK ELITE**, evidenciando habilidades em desenvolvimento front‑end, back‑end, integração contínua e uso de IA para geração de conteúdo e imagens.

---

## 🛍️ Apresentação da Loja

A **ELITE GAME STORE** exibe uma seleção de periféricos e componentes premium (placas de vídeo, notebooks, volantes, etc.). Cada item apresenta foto, descrição curta, preço e botão *Adicionar ao Carrinho*. A interface responsiva foi construída com React + Vite e está pronta para deploy no Vercel.

---

## 📦 Produtos em Destaque

| Produto | Preço | Foto |
| --- | --- | --- |
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

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, Vite, TailwindCSS, React Router
- **Backend:** Node.js (Express) – API mockada com **json‑server**
- **Gerenciamento de Estado:** Redux Toolkit
- **Deploy:** Vercel (preview e produção)
- **Versionamento:** Git + GitHub
- **IA:** Gemini AI (geração de descrições, imagens e revisão de código)

---

## 📂 Estrutura do Projeto

```
FULL STACK ELITE GAME STORE/
├─ public/               # arquivos estáticos (imagens, screenshots)
│   ├─ images/           # fotos dos produtos (geradas por IA)
│   └─ screenshots/      # captura da tela da home
├─ src/                  # código fonte React
│   ├─ components/       # componentes UI (Card, Navbar, Cart)
│   ├─ data/             # products.json (dados dos produtos)
│   └─ ...
├─ backend/              # código do mock API (json‑server)
├─ .gitignore
├─ package.json
└─ README.md
```

---

## ▶️ Instruções de Execução

```bash
# Clone o repositório
git clone https://github.com/usuario/full-stack-elite-game-store.git
cd full-stack-elite-game-store

# Instale as dependências
npm install

# Inicie a API mockada (opcional)
npm run api   # http://localhost:3001

# Inicie o servidor de desenvolvimento
npm run dev   # http://localhost:5173
```

> **Observação:** O projeto já contém o arquivo `vercel.json` configurado para deploy automático no Vercel. Basta conectar o repositório e clicar em **Deploy**.

---

## 📸 Captura de Tela

![Captura da página inicial](/public/screenshots/homepage.png)

---

## ✅ Testes Realizados

- **Testes unitários** com **Jest** + **React Testing Library** (componentes Card, Navbar, Cart).
- **Testes de integração** com **Cypress** (fluxo completo de compra).
- **Lint & Format** com **ESLint** + **Prettier** (CI assegura código limpo).
- **Teste de Deployment** no Vercel (verificação de status 200 nas rotas principais).

---

## 🧩 Dificuldades Encontradas & Aprendizado

- **Gerenciamento de Imagens Dinâmicas:** Foi necessário um script Node para copiar as imagens geradas pela IA para `public/images/` e atualizar `manifest.json`.
- **Performance no Carregamento:** Imagens de alta resolução aumentaram o tempo de load. Implementamos *lazy‑loading* (`loading="lazy"`) e compressão WebP automática via `vite-imagetools`.
- **Validação de Conteúdo IA:** Criamos um workflow que verifica tamanho e proporção das imagens antes de aceitá‑las, garantindo qualidade consistente.

---

## 🤖 Uso de IA no Projeto

- **Geração de Descrições:** Gemini AI produziu textos curtos para cada produto; revisões manuais mantiveram coerência de linguagem.
- **Criação de Imagens:** O sub‑agente *image‑generator* produziu as fotos dos produtos a partir de prompts específicos.
- **Assistência ao Desenvolvimento:** A IA ajudou na escrita de componentes React, configuração do Vite e scripts de deploy, reduzindo o tempo de desenvolvimento em ~30%.

---

## 🔍 Como Verificar Resultados da IA

1. Cada imagem possui um hash no nome (`<produto>_hash.jpg`). Compare‑o com o registro em `manifest.json`.
2. Descrições geradas ficam em `src/data/products.json` no campo `descriptionAI`.
3. Execute `npm run lint` e `npm run test` para garantir conformidade com padrões de qualidade.

---

## 🤝 Contribuição

Contribuições são bem‑vindas! Siga os passos:

1. Fork este repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nome`).
3. Commit suas alterações (`git commit -m "feat: descrição"`).
4. Abra um Pull Request descrevendo as mudanças.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** – veja o arquivo `LICENSE` para mais detalhes.

---

*Este README foi elaborado como documento profissional, refletindo a experiência de desenvolvimento, aprendizado e aplicação de IA ao longo da trilha **FULL STACK ELITE**.*
