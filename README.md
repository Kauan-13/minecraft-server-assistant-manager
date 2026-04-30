# Minecraft Server Assistant Manager

## Problematica
Eu comecei a jogar minecraft com meus amigos, eu abria o mundo para lan e utilizando uma VPN como `radmin`, logo começamos a ter um problema, eu precisava abrir o mundo para que meus amigos pudessem jogar, para resolver esse problema eu resolvi criar um servidor de minecraft dedicado, mas ainda era ruim pois eu precisava deixar o servidor rodando no meu computador consumindo um monte de memoria mesmo na ausencia dos meus amigos online e caso quisessemos outro mundo, no meu caso, um sobrevivencia vanilla e outro criativo com mods de construção eu teria que ativamento desligar um e ligar o outro, ou abrir os dois simultaneamente.

## Solução

Para resolver esse problema eu desenvolvi essa aplicação que permite meus amigos conectados a minha rede gerenciar os servidores. bastando eu deixar essa aplicação ligada, que tem um consumo extremamento baixo.

### Funcionalidades

1. Visualizar o estado atual de um servidor

1. Visualizar os jogadores online no servidor

1. Ligar servidor

1. Desligar servidor

1. Desligamento automático de servidor inativo

1. Valida se o servidor está vazio antes de desligar

1. Integração com o discord para notificar quando um servidor está disponivel

## Limitações

A aplicação ela só funciona em ambiente windows pois para a aplicação iniciar o servidor depende que exista um arquivo `run.bat` com o script para rodar o servidor.

A aplicação prevê a utilização de uma VPN como o `radmin` para conexão para os outros usuários.
Caso só uma pessoa precise ter acesso a aplicação então isso não seria problema.

## Configurações

Para que a aplicação funcione de maneira adequada é necessário algumas configurações. No repositorio do backend será necessário inserir as váriaveis no arquivo `.env`:

### .env

Arquivo com para configurar as variaveis de ambiente

- PORT:
    - Porta na qual o backend irá ser executado.
- API_TOKEN:
    - token de segurança para a api, será necessário caso o `requireToken` seja `true` no `config.json`
- RCON_PASSWORD:
    - A aplicação utiliza RCON (Remote Console) para enviar comandos para o servidor como o `/stop` para o servidor parar, será necessário que o a senha do RCON seja igual para todos os servidores que a aplicação for se comunicar.

> link para a wiki do minecraft caso não saiba como ativar o RCON no servidor: [minecraft.wiki](https://minecraft.wiki/w/RCON)


- URL_DISCORD_WEB_HOOK:
    - url do webhook do servidor do discord. Caso queira fazer a integração requer `enableDiscord: true` no `config.json`
- RADMIN_IP:
    - seu Ip na rede do radmin

- FRONTEND_URL:
    - url do frontend 
    
> `url do frontend` e `ip do radmin`, serve para a mensagem do discord para os usuários.

### config.json

Arquivo responsável por configurar as regras de negócio da aplicação

- maxConcurrentServers: (INTEGER) 
    - O limite de servidores que podem serem instanciados em paralelo

- enableDiscord: (BOOLEAN)
    - Habilita a integração com o discord
    
- servers: 
    - Lista dos servidores gerenciados pela aplicação

    - id: (INTEGER)
        - Identificação do servidor,
    - name: (STRING) 
        - Nome do servidor
    - path: (STRING)
        - Caminho do servidor no gerenciador de arquivos
    - port: (INTEGER)
        - Porta para acessar o servidor,
    - rconPort: (INTEGER)
        - Porta de conexão para protocolo RCON
    
- security:
    - Configurações de segurança da aplicação
    - enableIpWhitelist: (BOOLEAN) 
        - Habilita a verificação de IP
    - requireToken: (BOOLEAN) 
        - Habilita autenticação com token
        - allowedUsers:
            - Lista de usuários permitidos
            - name: (STRING) 
                - Nome do usuário no sistema
                - ips: 
                    - Lista de ips do usuário
    - CorsURLs: 
        - Lista de urls que podem fazer chamadas a API