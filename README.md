# Ava — Demo do site (Apoio emocional para câncer ginecológico)

Este repositório contém uma versão estática (SPA) do app "Ava" conforme especificações fornecidas. A página foi projetada como um protótipo funcional com chat (texto), TTS (ouvir resposta) e STT (falar com a Ava — quando suportado pelo navegador).

Funcionalidades incluídas:
- Onboarding / perfil clínico básico.
- Painel (lista de medicamentos do dia com botão "Tomei", próximos agendamentos, atalho "Fale com a Ava").
- Tratamento: lista de medicamentos + formulário para adicionar.
- Sintomas: registrar sintomas com intensidade.
- Emoções: diário de humor simples e AvaChat (texto + botão "Ouvir resposta da Ava").
- "Falar com a Ava": usa Web Speech API (SpeechRecognition) quando suportado.
- Avisos éticos e limites: mensagens claras que Ava não substitui equipe de saúde; instruções para emergências.
- Persistência local via localStorage (dados salvo no navegador).

Arquivos principais:
- index.html — estrutura e telas.
- css/styles.css — estilos responsivos.
- js/app.js — lógica da SPA, armazenamento e TTS/STT.
- README.md — instruções.

Como testar localmente (recomendado):
1. Baixe os arquivos ou clone o repositório.
2. Sirva os arquivos com um servidor local (recomendado para STT/TTS funcionar corretamente):
   - Usando Python 3:
     ```
     python -m http.server 8000
     ```
     Depois abra: http://localhost:8000
   - Ou usando npx http-server:
     ```
     npx http-server -c-1
     ```
3. Abra no Chrome/Edge para melhor compatibilidade STT/TTS. Em localhost, STT costuma funcionar sem HTTPS; em domínio público HTTPS é necessário.
4. Teste:
   - Navegue entre abas inferiores.
   - Adicione medicamentos, agendamentos e sintomas.
   - No Emotions → Ava, escreva mensagens e clique em "Enviar".
   - Use "Ouvir última" ou o botão "Ouvir resposta da Ava" nos balões de resposta (se o navegador tiver vozes TTS).
   - Clique em "🎤 Falar com a Ava" para tentar STT (será solicitado acesso ao microfone).

Observações sobre voz:
- O site usa a API Web Speech (speechSynthesis e SpeechRecognition). A disponibilidade de vozes e qualidade de reconhecimento depende do navegador/sistema.
- A aplicação tenta selecionar vozes pt-BR quando disponíveis e ajustar ritmo/pitch para um tom calmo.

Como publicar (exemplo GitHub Pages):
1. Crie um repositório no GitHub e suba estes arquivos.
2. Vá em Settings → Pages → Branch: main / folder: / (root) e salve.
3. O site estará disponível no endereço fornecido pelo GitHub Pages (pode levar alguns minutos).

Posso criar o deploy para você:
- Se quiser que eu gere e publique um preview (Netlify/Vercel/GitHub Pages) preciso que você me permita:
  - Criar/usar um repositório no seu GitHub (usuário: `caio-z7`) OU
  - Você me informe um repositório já existente para eu enviar os arquivos (ou eu posso te enviar um ZIP).

Próximos passos que eu recomendo (MVP roadmap):
- MVP2: integrar TTS/STT robustos, rotinas guiadas em áudio (AvaRoutinesScreen), exportação de PDF e gráficos.
- Implementar backend para sincronização de dados clínicos com equipe (com autenticação).
- Segurança: criptografia de dados locais, consentimento explícito e política de privacidade.
- Testes com usuárias para ajustar tom da IA, mensagens de emergência e conteúdo sensível.

Quer que eu publique um link de preview para você agora?
- Posso ajudar a publicar no GitHub Pages/Netlify se você me autorizar a criar/usar um repositório no seu GitHub `caio-z7`, ou me fornecer o repo onde devo subir os arquivos.
- Se preferir, eu posso gerar um ZIP com os arquivos e você sobe manualmente — diga qual prefere.

Obrigado — se quiser ajustes (ex.: paleta de cores, voz mais quente, textos de onboarding diferentes, incluir logotipo/ilustrações ou mock de sessões de rotina), informe e eu adapto.
