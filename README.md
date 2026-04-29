# Minecraft Server Assistant Manager

## Problematica
Eu comecei a jogar minecraft com meus amigos, eu abria o mundo para lan e utilizando uma VPN como `radmin`, logo começamos a ter um problema, eu precisava abrir o mundo para que meus amigos pudessem jogar, para resolver esse problema eu resolvi criar um servidor de minecraft dedicado, mas ainda era meio ruim pois eu precisava deixar o servidor rodando no meu computador consumindo um monte de memoria mesmo na ausencia dos meus amigos online e caso quisessemos outro mundo, no meu caso, um sobrevivencia vanilla e outro criativo com mods de construção eu teria que ativamento desligar um e ligar o outro, ou abrir os dois simultaneamente.

Para resolver esse problema eu desenvolvi essa aplicação que permite meus amigos conectados a minha rede gerenciar os servidores, ligando e desligando eles, e a aplicação também gerencia caso alguém deixe o servidor aberto sem ninguém online ele é fechado após um certo periodo de tempo.

## Limitações

A aplicação ela só funciona em ambiente windows pois para a aplicação iniciar o servidor depende que exista um arquivo `run.bat` com o script para rodar o servidor.

A aplicação prevê a utilização de uma VPN como o `radmin` para conexão para os outros usuários.
Caso só uma pessoa precise ter acesso a aplicação então isso não seria problema.

## Configurações

Para que a aplicação funcione de maneira adequada é necessário algumas configurações. No repositorio do backend será necessário inserir as váriaveis no arquivo `.env`:

- PORT:
    - Porta na qual o backend irá ser executado.
- API_TOKEN:
    - token de segurança para a api, será necessário caso o `requireToken` seja `true` no `config.json`
- RCON_PASSWORD:
    - A aplicação utiliza RCON (Remote Console) para enviar comandos para o servidor como o `/stop` para o servidor parar, será necessário que o a senha do RCON seja igual para todos os servidores que a aplicação for se comunicar.

> link para a wiki do minecraft caso não saiba como ativar o RCON no servidor: [minecraft.wiki](https://minecraft.wiki/w/RCON)


- URL_DISCORD_WEB_HOOK:
    - url do webhook do servidor do discord. Caso queira fazer a integração requer `enableDiscord: true` no `config.json`
RADMIN_IP=ip do radmin
FRONTEND_URL=url do frontend