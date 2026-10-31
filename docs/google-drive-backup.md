# Configuração de Backups Automáticos no Google Drive para o MSAM

Siga este guia passo a passo para habilitar a autenticação OAuth2 e configurar o envio automático de backups dos seus servidores Minecraft para o Google Drive.

## 1. Configuração no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie um novo projeto (ex: `MSAM Backups`).
2. Navegue até **APIs e Serviços > Biblioteca**, pesquise por **Google Drive API** e clique em **Ativar**.
3. Acesse **APIs e Serviços > Tela de permissão OAuth**:
    - Em **Visão Geral** clique em **Vamos começar**
    - Em **Informações do app** preencha os dados obrigatórios (Nome do app, E-mail de suporte).
    - Em **Público** selecione o tipo de usuário **Externo**.
    - Em **Dados de contato** preencha o campo **email**
    - Em **Concluir** aceite os termos.
4. Em **Público-alvo** adicione o usuário de teste o email do drive onde os backups serão salvos.
5. Acesse **APIs e Serviços > Credenciais**:
    * Clique em **Criar Credenciais** e selecione **ID do cliente OAuth**.
    * Escolha o tipo de aplicativo **Aplicativo da Web**.
    * Em **URIs de redirecionamento autorizados**, adicione a URL exata do servidor temporário local: `http://localhost:3000/callback`.
    * Clique em **Criar** e copie o **ID do Cliente** e a **Chave Secreta do Cliente**.

## 2. Variáveis de Ambiente (.env)

No diretório raiz do seu backend, abra ou crie o arquivo `.env` e insira as credenciais geradas no passo anterior:

```env
# Credenciais do Google Cloud Console
GOOGLE_CLIENT_ID=seu_id_do_cliente_aqui
GOOGLE_CLIENT_SECRET=sua_chave_secreta_aqui
```

## 3. Configuração dos Servidores (config.json)

Para que o MSAM saiba para onde enviar o `.zip` gerado, você deve configurar o destino no seu arquivo de configuração de servidores.

1. Acesse o Google Drive pelo navegador.
2. Crie a pasta onde deseja armazenar os backups de um servidor específico.
3. Copie o ID da pasta diretamente da URL (a sequência de caracteres após `/folders/`).
4. Atualize o seu `config.json` adicionando as propriedades `uploadToGoogleDrive` e `driveFolderId` dentro do bloco `backup`:

```json
{
  "servers": [
    {
      "id": 1,
      "name": "Mundo Survival",
      "path": "./servers/survival",
      "rconPort": 25575,
      "backup": {
        "maxBackups": 5,
        "backupPath": "./servers/survival/backups",
        "uploadToGoogleDrive": true,
        "driveFolderId": "COLE_O_ID_DA_PASTA_AQUI"
      }
    }
  ]
}
```

## 4. Executando a Autenticação (CLI)

Com as credenciais salvas, você precisa gerar o token de acesso (que inclui o `refresh_token` para renovação automática) autorizando a aplicação no seu navegador.

1. Abra o terminal na raiz do backend do MSAM e execute:
```bash
npm run drive:auth
```

2. O terminal exibirá um link. Segure `Ctrl` (ou `Cmd`) e clique no link para abri-lo no navegador.
3. Faça login com a conta do Google que você adicionou em "Usuários de teste" e autorize as permissões de acesso ao Drive.
4. O navegador exibirá uma mensagem de sucesso ("Autenticação concluída com sucesso!").
5. O servidor temporário no terminal será encerrado automaticamente e o arquivo de credenciais será gerado em `data/google_token.json`.

A partir deste momento, sempre que a rotina de encerramento do servidor for chamada, o MSAM compactará os arquivos e efetuará o upload para a pasta especificada no Drive sem exigir nova interação manual.