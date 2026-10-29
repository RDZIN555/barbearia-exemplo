# Testar o WhatsApp somente no seu computador Windows

Não informe seu número pessoal no chat, GitHub, Pull Request, config.js público, HTML ou painel do Cloudflare. O arquivo usado aqui é local, ignorado pelo Git. A prévia do Cloudflare é pública e **não é** este ambiente de teste.

## 1. Preparar o computador

1. Instale Node.js LTS 22.12 ou superior pelo instalador oficial de https://nodejs.org. Feche e reabra o terminal após instalar.
2. Obtenha o código da branch `feat/barbearia-exemplo-v1-2` (clone ou ZIP dessa branch, não da main antiga). Extraia o ZIP se necessário.
3. Abra a pasta que contém `package.json` no Explorador de Arquivos. Digite `powershell` na barra de endereço e pressione Enter.
4. Instale as dependências:

```powershell
npm.cmd ci --include=dev
```

O sufixo `.cmd` evita o bloqueio de npm.ps1 em instalações com política padrão do PowerShell. Não é necessário alterar a política de execução.

## 2. Criar a configuração privada

No mesmo terminal:

```powershell
if (!(Test-Path config.private.json)) { Copy-Item config.private.example.json config.private.json }
notepad config.private.json
```

O exemplo contém apenas:

```json
{
  "whatsapp": ""
}
```

No Bloco de Notas, preencha **somente entre as aspas vazias**, com seu DDD e número, ou com código do país e número. Salve e feche. Não copie esse conteúdo para nenhum outro arquivo. A normalização segue o mesmo formato do WhatsApp comercial: DDD nacional recebe 55; um DDI 55 já completo não é duplicado; outros países devem incluir `+` ou `00`.

O arquivo precisa estar na raiz do projeto, ao lado de `config.js`. Não coloque o número no arquivo de exemplo nem em `config.js`. Se `config.private.json` já existia, o comando acima o preserva.

## 3. Iniciar a prévia privada local

```powershell
npm.cmd run preview:private
```

O comando primeiro gera o site público normalmente, sem ler o arquivo privado. Depois inicia um servidor restrito a `127.0.0.1`, porta 8788. Abra manualmente no navegador desse mesmo computador:

`http://127.0.0.1:8788`

Deixe o terminal aberto durante o teste. Não use o endereço do Cloudflare, não exponha a porta por túneis e não tente abrir essa URL em outro computador ou celular. Não há cadastro nem autenticação fictícia: o isolamento é o servidor escutar somente o loopback do próprio computador. Quem tiver acesso ao seu computador/arquivo local ainda poderá lê-lo.

## 4. Conferir os botões

1. Clique no WhatsApp principal e confira o destinatário e a mensagem genérica.
2. Volte ao site e clique em cada serviço. Confira se a mensagem inclui o nome correto do serviço.
3. Para conferir o celular no próprio computador, abra as ferramentas do navegador (`F12`) e ative a simulação de dispositivo (`Ctrl+Shift+M` no Chrome/Edge). Teste também o flutuante, em uma área onde ele não cubra textos.
4. Não é necessário enviar a mensagem para validar o link. Se decidir enviá-la, confira primeiro o destinatário no próprio WhatsApp.

Os links abrem o serviço oficial WhatsApp; ao abri-los você acessa esse serviço. O número de teste não é publicado no site, mas pode aparecer na barra de endereço e no histórico do seu navegador local. Não compartilhe links/capturas que contenham o número.

As mensagens vêm de `whatsappMessage` e `serviceMessage` do config.js público; somente o número é substituído em memória no navegador desta prévia. Sem o arquivo privado, use `npm.cmd run preview` para testar o comportamento público “WhatsApp disponível em breve”.

## 5. Encerrar e remover o teste

1. Volte ao terminal e pressione `Ctrl+C` para encerrar o servidor.
2. Feche as abas de teste.
3. Exclua a configuração privada, se não quiser mantê-la no computador:

```powershell
Remove-Item config.private.json
```

4. Para gerar novamente o site público:

```powershell
npm.cmd run build
```

O build público sempre usa config.js e não lê o arquivo privado, mesmo se ele continuar presente. `--config` alternativo é bloqueado quando a saída é a pasta de publicação `dist`. O arquivo privado também é excluído da cópia de recursos. Nenhum número de teste é gravado em dist pelo modo privado.

Se estiver usando Git, `git check-ignore config.private.json` deve mostrar apenas o nome do arquivo. Não use `git add -f` nele. Não envie a pasta do projeto inteira como upload do Pages: o deploy usa somente dist.

## Como o isolamento funciona

- `config.private.example.json`: exemplo versionado vazio.
- `config.private.json`: arquivo pessoal local ignorado pelo Git.
- `npm run build`: produção, sem leitura ou injeção privada.
- `npm run preview:private`: servidor loopback que injeta um script **só na resposta em memória**; nenhum arquivo privado gerado em disco.
- O endpoint temporário tem caminho aleatório, `Cache-Control: no-store`, verificação de Host/Origin e bloqueio de requisições cross-site. O nome do arquivo e o número não são expostos como recurso público.
- O CLI recusa execução no Cloudflare Pages. Não há alteração de DNS, deploy ou autenticação de uma prévia pública.

Se o terminal disser que não conseguiu iniciar, confira se o JSON está válido, se o número está entre aspas e se outro programa ocupa a porta 8788. O programa não imprime o número nem o conteúdo inválido do arquivo nos logs.

O procedimento e as rotinas foram testados no ambiente Linux com Chromium e dados sintéticos temporários. Os comandos Windows usam APIs Node multiplataforma e PowerShell, mas não houve sessão Windows real disponível para validá-los; o teste manual do proprietário continua necessário.
