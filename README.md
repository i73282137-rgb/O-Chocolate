# Oba Chocolate — site pronto para Cloudflare Pages

Projeto estático organizado a partir do HTML monolítico da Oba Chocolate. A pasta `C:\aleat\Obachocolate_Site` contém somente os arquivos que deverão ser publicados.

## Estrutura

- `index.html`: estrutura e conteúdo principal.
- `assets/css/styles.css`: estilos e animações.
- `assets/js/`: lógica da abertura, catálogo, sacola e interações.
- `assets/images/`: imagens deduplicadas e imagem de compartilhamento social.
- `assets/fonts/`: fontes locais usadas pelo layout.
- `assets/icons/`: favicon, ícones do navegador/PWA.
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `llms.txt`: indexação, descoberta e metadados.
- `404.html`: página de erro no mesmo estilo visual.
- `_headers`: cabeçalhos úteis para Cloudflare Pages.

## Publicação no Cloudflare Pages

O diretório de publicação é a própria raiz `Obachocolate_Site`. Não existe etapa de build: o projeto continua sendo HTML, CSS e JavaScript estáticos.

Antes da publicação definitiva, substituir `https://example.com/` pelo domínio final em:

- `index.html`: canonical, Open Graph, Twitter/X Card e Schema.org.
- `robots.txt`: endereço do sitemap.
- `sitemap.xml`: URL principal.
- `llms.txt`: URL canônica informativa.

Se a primeira publicação for feita em um endereço `*.pages.dev`, esses valores podem ser atualizados para esse endereço e depois trocados pelo domínio próprio quando ele estiver conectado.

## Manutenção

Edite conteúdo em `index.html`, estilos em `assets/css/styles.css` e comportamento em `assets/js/`. Evite voltar a incorporar imagens ou fontes em Base64 dentro do HTML/JS, pois isso aumenta bastante o peso da página. Ao trocar imagens, mantenha os caminhos existentes ou atualize as referências correspondentes.

O HTML monolítico recuperado foi preservado fora da pasta pública em `C:\aleat\Obachocolate_Source_Backup\index-monolitico-original.html`.

## Próxima etapa

O projeto ainda não foi publicado. Quando houver uma nova ordem explícita do usuário, a próxima ação será conectar/configurar e publicar este diretório no Cloudflare Pages, atualizando os URLs do domínio na mesma etapa.
