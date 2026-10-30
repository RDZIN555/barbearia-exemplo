# Fontes verificadas e incorporadas — galeria V1.2.3

As páginas oficiais, os três JPEGs e https://www.pexels.com/license/ foram acessados com HTTP 200 após a ativação da rede. Os metadados ImageObject de cada página confirmaram o autor, a URL do arquivo, a licença e as dimensões. Os arquivos locais correspondem aos contentUrl oficiais; SHA-256 e dimensões originais constam em `licenses/pexels-gallery-sources.json`.

**Divergência resolvida:** as fotos oficiais dos links são diferentes dos anexos inline da conversa. A diferença foi informada antes de incorporá-las, e o proprietário autorizou expressamente usar as fotos oficiais dos links. Os anexos não foram reconstruídos nem atribuídos falsamente ao Pexels.

| Arquivo local | Autor confirmado | Fonte oficial | Licença |
| --- | --- | --- | --- |
| `assets/gallery/corte-pexels-9992818.jpg` | Alex Urezkov | https://www.pexels.com/photo/a-man-having-a-haircut-in-a-barber-shop-9992818/ | Pexels License |
| `assets/gallery/barba-pexels-7518742.jpg` | Pavel Danilyuk | https://www.pexels.com/photo/a-man-getting-a-haircut-in-a-barbershop-7518742/ | Pexels License |
| `assets/gallery/ambiente-pexels-12685938.jpg` | Jonathan Cooper | https://www.pexels.com/photo/view-of-a-barbershop-interior-12685938/ | Pexels License |

O original `assets/barbearia.jpg`, criado na V1, não é Pexels e continua com sua procedência anterior. Hero e original foram preservados. A galeria totaliza quatro imagens diferentes: esse original e as três fotos licenciadas acima.

## Condições verificadas

A página oficial permite baixar e usar fotos gratuitamente, modificá-las e utilizá-las em sites, materiais promocionais e templates vendidos. Atribuição não é obrigatória, mas os créditos foram registrados. O texto consultado está em `licenses/PEXELS-LICENSE.txt`, também distribuído no build junto ao registro das fontes.

Restrições relevantes: não retratar pessoas identificáveis de modo ofensivo; não sugerir endosso de pessoas/marcas; não vender cópias inalteradas como produto fotográfico; não redistribuir como banco de imagens/wallpapers; não usar as fotos como marca/logotipo/nome comercial. A licença não foi interpretada como cessão de direitos pessoais ou autorização individual além de suas condições.

Neste modelo, as fotos apenas ilustram serviços e um ambiente. As pessoas, autores e locais não são apresentados como clientes, profissionais, depoentes ou instalações reais da Barbearia Exemplo. Nenhuma foto foi usada no logotipo, favicon, hero ou testemunho. Não existe venda avulsa de fotografia. Para entregar um site de estabelecimento real, substituir por fotografias próprias/autorizadas e atualizar os créditos conforme o caso.

## Otimização e substituição futura

Os JPEGs originais foram mantidos. O build gera WebP/AVIF em larguras até 1600px, sem ampliar fontes menores, com srcset/sizes, dimensões reais, lazy loading e decodificação assíncrona. Nenhuma URL externa é usada para carregar fotos durante a navegação. O primeiro quadro preserva a imagem panorâmica existente, seguido de três retratos em colunas no desktop e uma coluna no celular.

Para substituir fotos de futuros clientes, editar somente `images.gallery` em config.js e os arquivos autorizados em assets; registrar autoria/licença e rodar o build. Não repetir fotos/recortes para simular variedade. Os pesos de cada variante estão em dist/image-report.json.
