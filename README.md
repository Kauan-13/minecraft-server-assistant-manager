# inecraft Server Assistant Manager (MSAM)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Kauan-13/minecraft-server-assistant-manager?style=for-the-badge)
![Status do CI](https://github.com/kauan-13/minecraft-server-assistant-manager/actions/workflows/ci.yml/badge.svg)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Winston](https://img.shields.io/badge/Winston_Logs-gray?style=for-the-badge&logo=logstash&logoColor=white)

## Motivação
Este projeto nasceu para resolver um problema comum ao jogar Minecraft com amigos via VPN (como Radmin) que é a necessidade de do host sempre online. 

Para que os amigos joguem, o dono do mundo precisa abrir o PC e carregar o servidor manualmente. Isso gerava desperdício de memória RAM ao manter servidores vazios rodando e tornava impossível a alternância entre diferentes tipos de jogo (Vanilla, Modpacks, Criativo) quando o dono do servidor estivesse fora do PC. O **MSAM** atua como um assistente de baixo consumo que permite aos próprios jogadores gerenciarem qual mundo deve estar ativo.

## Funcionalidades
- **Controle de Estado:** Ligar e desligar servidores via API.
- **Monitoramento em Tempo Real:** Visualização de status e lista de jogadores online.
- **Desligamento Automático:** Desligamento automático de servidores inativos após um período de ociosidade.
- **Segurança Robusta:** Proteção por Token de API e Whitelist de IPs.
- **Integração com Discord:** Notificações automáticas via Webhook quando um servidor fica online ou offline.

## Configuração

### 1. Variáveis de Ambiente (`.env`)
Configure estas chaves no seu arquivo `.env` para garantir a segurança e integração do sistema.

| Variável | Descrição |
| :--- | :--- |
| `PORT` | Porta onde o backend será executado (Ex: 3000). |
| `API_TOKEN` | Chave de segurança para validar as chamadas da API. |
| `RCON_PASSWORD` | Senha do RCON definida no `server.properties` do servidor do Minecraft. |
| `URL_DISCORD_WEBHOOK` | URL do Webhook do Discord para notificações. |
| `RADMIN_IP` | Seu IP na rede Radmin (exibido nas mensagens do Discord). |
| `FRONTEND_URL` | URL onde o frontend está hospedado. |

### 2. Regras de Negócio (`config.json`)
O arquivo `config.json` define como a aplicação deve se comportar.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `maxConcurrentServers` | `Integer` | Limite de servidores que podem rodar simultaneamente. |
| `enableDiscord` | `Boolean` | Ativa/Desativa a integração com o Discord. |
| `servers` | `Array` | Lista contendo `id`, `name`, `path`, `port` e `rconPort`. |
| `security.enableIpWhitelist` | `Boolean` | Ativa/Desativa a verificação de IP dos usuários. |
| `security.requireToken` | `Boolean` | Exige o header `x-api-token` nas requisições. |

## Executar o Projeto

### Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:

- Node.js
- npm
- Java (Compatível com a versão do seu servidor de Minecraft)
- Radmin VPN (Caso vá disponibilizar o acesso para amigos fora da sua rede local)

### 1. Instalação de Dependências
O projeto é dividido entre API e Interface. Você precisará instalar as dependências em ambos os diretórios:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```
### 2. Configuração de Ambiente

1. Renomeie no diretório `backend` e `frontend` o arquivo .env.example para .env e preencha as suas credenciais e tokens.

1. Renomeie no diretório `backend` o arquivo config.example.json para config.json e estruture a lista de seus servidores e defina as regras de negócio.

### 3. Execução da aplicação
**Backend:**
```bash
cd backend
npm run start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Encerramento do Sistema

Para encerrar a aplicação com segurança:

- **Backend:** No terminal em que a API está rodando, digite o comando `stop`. Isso garante que o sistema limpe os processos temporários antes de fechar.
- **Frontend:** Pode ser encerrado utilizando o comando padrão `CTRL + C` no terminal correspondente.

> [!IMPORTANT]
> Encerrar o **MSAM** não interrompe a execução dos servidores de Minecraft que estiverem online. Para desligá-los, utilize a interface do frontend ou os comandos internos do jogo antes de fechar a aplicação.

## Limitações
* **Sistema Operacional:** Compatível apenas com **Windows** (dependência de scripts `.bat` para inicialização).
* **Conectividade:** Projetado para uso em redes VPN como `Radmin VPN`.
* **RCON:** Essencial que os servidores de Minecraft estejam com o protocolo RCON habilitado para o desligamento seguro.

## Próximos Passos
Este projeto está em constante evolução. Confira o planejamento para próximas versões na aba de [Issues](https://github.com/Kauan-13/minecraft-server-assistant-manager/issues).