# Deploy - VPS KingHost + domínio entreraizesememorias.com.br

> Stack: Node.js 20+ · Express · MySQL/MariaDB · Nginx Proxy Reverso · SSL Let's Encrypt (HTTPS) · Systemd (serviço rodando em background)

---

## 📋 1. Pré-requisitos (verifique primeiro na KingHost)

Antes de começar, acesse o **painel KingHost (cPanel/KingPanel)** e confira:

1. **Sua VPS tem qual SO?** — recomendamos **Ubuntu 22.04 LTS ou 24.04 LTS** (Debian 12 também funciona).
2. **Acesso SSH habilitado** — você tem usuário `root` e a senha/IP da VPS.
3. **Domínio entreraizesememorias.com.br** já comprado na KingHost.
4. **MySQL/MariaDB** instalado na VPS (KingHost costuma entregar com MySQL incluso).

---

## 🌐 2. Configurar DNS do domínio (Painel KingHost → Zona DNS)

### 2.1 Encontre o IP público da sua VPS
No email de boas-vindas da KingHost ou no painel. Exemplo fictício: `187.20.30.40`.

### 2.2 Crie estes 2 registros DNS na Zona DNS do domínio:

| Tipo | NOME (Host) | VALOR (Destino) | TTL |
|---|---|---|---|
| **A** | `@` | `IP_DA_SUA_VPS_AQUI` | 300 |
| **A** | `www` | `IP_DA_SUA_VPS_AQUI` | 300 |

> ⚠️ Propagação DNS leva de **5 minutos a 24 horas**. Você pode acompanhar em: https://dnschecker.org/#A/entreraizesememorias.com.br

---

## 💻 3. Logar na VPS via SSH

Abra o **PowerShell (Windows)** ou **Terminal (Mac/Linux)** e digite:
```bash
ssh root@IP_DA_SUA_VPS_AQUI
```
Digite a senha quando pedir.

---

## 🔧 4. Instalar Node.js 20 LTS, Nginx, Certbot e MySQL (UMA VEZ SÓ)

Execute TUDO em sequência (copiar e colar, linha a linha ou tudo junto):

```bash
# === 4.1 Atualizar pacotes do sistema ===
apt update && apt upgrade -y

# === 4.2 Instalar utilitários básicos ===
apt install -y curl wget git nano unzip ufw

# === 4.3 Instalar Node.js 20 LTS via NodeSource (versão recomendada) ===
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar: deve mostrar v20.x.x
node -v && npm -v

# === 4.4 Instalar Nginx (servidor web / proxy reverso) ===
apt install -y nginx

# === 4.5 Instalar Certbot + plugin Nginx (SSL gratuito Let's Encrypt) ===
apt install -y certbot python3-certbot-nginx

# === 4.6 Verificar / Instalar Banco de Dados (MySQL PADRÃO, OU MariaDB) ===
#
# 💡 Você pediu o "MySQL normal" (Oracle MySQL Server) → abaixo É A OPÇÃO A (padrão).
# Ambos (MySQL / MariaDB) são 100% compatíveis com o projeto: mesmos comandos,
# mesma porta 3306, driver mysql2 e Sequelize funcionam IGUAL (dialect: 'mysql').
#
# → USE o que JÁ ESTIVER INSTALADO na sua VPS KingHost (não instale os dois!).
# → SE NENHUM estiver instalado, use a OPÇÃO A abaixo:

# --- 🅰️ OPÇÃO A (PADRÃO - VOCÊ PEDIU ESTE!): instalar MySQL Oracle oficial
apt install -y mysql-server mysql-client
systemctl enable --now mysql
systemctl status mysql --no-pager     # → deve mostrar "active (running)" verde

# OU --- 🅱️ OPÇÃO B (alternativa): instalar MariaDB (se a KingHost recomendar)
# apt install -y mariadb-server mariadb-client
# systemctl enable --now mariadb
# systemctl status mariadb --no-pager

# --- ✅ Verificação rápida (funciona PARA QUALQUER UM dos dois):
mysql --version        # → MySQL mostra "...mysql  Ver 8.x.x..." ; MariaDB mostra "...Distrib 10.x.x-MariaDB"
# Ambos são OK! O comando `mysql` funciona igual para os dois.
```

---

## 🗄️ 5. Criar banco de dados (MySQL normal) + usuário dedicado

```bash
# Entrar no shell MySQL como root
mysql -u root
```

Dentro do shell SQL (prompt será `MariaDB [(none)]>` ou `mysql>` — tanto faz, funciona igual), cole:
```sql
-- Cria banco de dados com charset UTF-8 (acentos PT-BR)
CREATE DATABASE IF NOT EXISTS aplicativo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Cria usuário dedicado (TROQUE a senha 'SENHA_FORTE_AQUI' por uma sua!)
CREATE USER IF NOT EXISTS 'app_memorias'@'localhost'
  IDENTIFIED BY 'SENHA_FORTE_AQUI';

-- Dá permissões completas nesse banco
GRANT ALL PRIVILEGES ON aplicativo.* TO 'app_memorias'@'localhost';
FLUSH PRIVILEGES;

-- Sai do MySQL
EXIT;
```

---

## 📂 6. Enviar o projeto para a VPS

Dois métodos possíveis: **Git (melhor)** ou **SCP/FTP**.

---

### 🅰️ MÉTODO 1: Usando GITHUB (RECOMENDADO)
Primeiro faça commit do projeto para um repositório privado no GitHub. Depois na VPS:

```bash
# Cria pasta do site e dá permissão
mkdir -p /var/www/memoriasqueeducam
cd /var/www/memoriasqueeducam

# Clone o repositório (TROQUE pelo seu link)
git clone https://github.com/SEU_USUARIO/memoriasQueEducam.git .

# Instala as dependências (SOMENTE de produção, pula devDependencies como sharp/nodemon)
npm ci --omit=dev --no-audit --no-fund
```

---

### 🅱️ MÉTODO 2: Enviar via SCP (sem GitHub — rápido)
No **PowerShell do SEU COMPUTADOR WINDOWS** (na pasta do projeto):

```powershell
# Cria zip do projeto (ignora node_modules, .env, backups)
Compress-Archive -Path . -DestinationPath deploy.zip -Force -ExcludePath node_modules,dist,.git,src\public\img\manifestacaoCultural\_original

# Copia para a VPS (TROQUE IP_DA_VPS)
scp deploy.zip root@IP_DA_VPS:/tmp/
```

Depois **na VPS SSH**:
```bash
cd /var/www && mkdir -p memoriasqueeducam && cd memoriasqueeducam
unzip -q /tmp/deploy.zip -d .
rm /tmp/deploy.zip
npm ci --omit=dev --no-audit --no-fund
```

---

## 🔐 7. Criar arquivo .env de produção

```bash
cd /var/www/memoriasqueeducam

# Copia template
cp .env.example .env

# Edita com nano
nano .env
```

Preencha exatamente assim (troque os campos):
```env
PORT=3000
NODE_ENV=production
APP_URL=https://www.entreraizesememorias.com.br

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app_memorias
DB_PASSWORD=SENHA_FORTE_QUE_VOCÊ_CRIOU_NO_PASSO_5
DB_NAME=aplicativo
```

Salve e saia do nano: **Ctrl+O → Enter → Ctrl+X**.

---

## 🚀 8. Testar o app primeiro (antes de colocar como serviço)

```bash
cd /var/www/memoriasqueeducam

# Dá permissão de leitura para www-data
chown -R www-data:www-data /var/www/memoriasqueeducam

# Teste rápido (segura 30s, deve mostrar: "Servidor rodando em http://localhost:3000")
timeout 30 node server.js
```

Se aparecer **"Tabelas sincronizadas com sucesso"** e **"Servidor rodando..."**, está tudo OK! O app conectou no banco MySQL. 🎉

(Se aparecer erro de conexão MySQL — volte e verifique passo 5 + arquivo .env)

Use **Ctrl+C** duas vezes para cancelar.

---

## ⚙️ 9. Registrar com PM2 (Gerenciador de Processos Node.js - 24h, inicia no boot, reinicia se cair)

> 🟢 **PM2** = escolha mais popular do mundo para apps Node em produção. Mais simples,
> interface visual `pm2 monit`, logs fáceis, restart automático, salva estado,
> e cria script de boot para systemd automaticamente com **1 comando**.

```bash
# === 9.1 Instalar PM2 GLOBALMENTE (disponível como comando no sistema) ===
npm install -g pm2@latest --no-audit --no-fund

# Confirma instalação: mostra versão
pm2 -v

# Cria pasta de logs PM2
mkdir -p /var/log/pm2

# === 9.2 INICIAR a aplicação com PM2 (usando arquivo ecosystem.config.js) ===
cd /var/www/memoriasqueeducam
pm2 start deploy/ecosystem.config.js --env production

# DEVE aparecer na tela:
# ┌────┬────────────────────┬──────────┬──────┬──────────┬──────────┬──────────┐
# │ id │ name               │ mode     │ ↺    │ status   │ cpu      │ memory   │
# ├────┼────────────────────┼──────────┼──────┼──────────┼──────────┼──────────┤
# │ 0  │ memoriasqueeducam  │ fork     │ 0    │ online   │ 0%       │ 40mb     │
# └────┴────────────────────┴──────────┴──────┴──────────┴──────────┴──────────┘
# → A coluna STATUS deve estar "online" ✅

# === 9.3 SALVAR os processos atuais para restaurar no boot ===
pm2 save

# === 9.4 CRIAR SCRIPT DE BOOT AUTOMÁTICO (quando VPS ligar, PM2 inicia o app) ===
pm2 startup systemd -u root --hp /root
```

> ⚠️ **IMPORTANTE**: Ao rodar o `pm2 startup ...` acima, o PM2 VAI MOSTRAR um comando na
> tela começando com `sudo env PATH=... systemctl enable pm2-root`. **VOCÊ PRECISA COPIAR
> E COLAR ESSE COMANDO E EXECUTÁ-LO!** Senão o app não inicia automaticamente no boot.

---

**📋 Comandos úteis PM2 (você vai usar muito):**

| O que você quer fazer | Comando |
|---|---|
| Ver status + CPU/MEMÓRIA (lista todos apps) | `pm2 status` |
| **Dashboard VISUAL** (colorido, tempo real!) | `pm2 monit` |
| Logs em TEMPO REAL (Node console.log todos) | `pm2 logs memoriasqueeducam` |
| Últimos 100 logs | `pm2 logs memoriasqueeducam --lines 100 --nostream` |
| **Reiniciar app** (depois de editar código!) | `pm2 restart memoriasqueeducam` |
| Parar app (temporariamente) | `pm2 stop memoriasqueeducam` |
| Parar e remover da lista PM2 | `pm2 delete memoriasqueeducam` |
| Limpar logs antigos | `pm2 flush` |
| (Após `restart` ou mudar config) Salvar estado | `pm2 save` |

---

**💡 Dica teste RÁPIDO do app (antes do Nginx):**
```bash
# Deve retornar HTTP/1.1 200 OK diretamente do Node porta 3000
curl -I http://127.0.0.1:3000/
```
Se voltar **200 OK**, PM2 + App Node estão 100% funcionando! Agora só falta o Nginx (proxy reverso + SSL). 🎉

---

## 🌐 10. Configurar Nginx Proxy Reverso + HTTPS (SSL)

### 10.1 Copiar configuração do Nginx
```bash
cp /var/www/memoriasqueeducam/deploy/nginx.conf /etc/nginx/sites-available/memoriasqueeducam

# Cria link simbólico para ativar o site
ln -sf /etc/nginx/sites-available/memoriasqueeducam /etc/nginx/sites-enabled/

# Apaga site default para não conflitar
rm -f /etc/nginx/sites-enabled/default

# Testa sintaxe do NGINX (deve mostrar "test is successful")
nginx -t

# Recarrega Nginx
systemctl reload nginx
```

### 10.2 Configurar Firewall (UFW) - OBRIGATÓRIO
```bash
# Libera SSH, HTTP e HTTPS
ufw allow 22
ufw allow 80
ufw allow 443

# Liga firewall
ufw --force enable

# Verifica regras
ufw status numbered
```

### 10.3 Emitir SSL GRATUITO (Let's Encrypt) - HTTPS!
Primeiro **confira que o DNS já propagou** (passo 2). Quando o domínio já apontar para a VPS, rode:

```bash
certbot --nginx -d entreraizesememorias.com.br -d www.entreraizesememorias.com.br
```

O Certbot pergunta:
1. **Email para alertas de expiração**: coloque seu email ✔️
2. **Aceitar termos de serviço**: `Y`
3. **Compartilhar email EFF** (opcional): `N`
4. **Redirecionar HTTP → HTTPS**: escolha **opção 2 (Redirect)** ✔️

Pronto! SSL ativo e válido por 90 dias (renova automaticamente).

---

## ✅ 11. Teste FINAL — Abrir o site!

No seu navegador, acesse:
- 🌐 **https://entreraizesememorias.com.br** (sem www)
- 🌐 **https://www.entreraizesememorias.com.br** (com www — seu domínio oficial)

Ambos devem:
- Mostrar **cadeado HTTPS verde** 🔒
- Carregar a página inicial (tela Memórias que Educam)
- Navegar por todas as telas sem erro 404/500
- Conexão com banco OK (jogos salvam progresso, etc.)

### Verificações rápidas na VPS:
```bash
# Testa resposta HTTP do app Node:
curl -I http://127.0.0.1:3000/
# → deve retornar HTTP/1.1 200 OK

# Testa resposta HTTPS do domínio público:
curl -I https://www.entreraizesememorias.com.br/
# → deve retornar HTTP/2 200
```

---

## 🔄 12. Como ATUALIZAR o site depois (quando alterar código)

Depois que você editar o código local, faça:
```bash
cd /var/www/memoriasqueeducam

# Se usar GITHUB:
git pull
npm ci --omit=dev --no-audit --no-fund
chown -R www-data:www-data /var/www/memoriasqueeducam

# Reinicia o processo Node pelo PM2 ✅
pm2 restart memoriasqueeducam

# (Sempre que reiniciar ou adicionar processos é bom salvar o estado)
pm2 save
```

Pronto! Site atualizado em ~10 segundos.

---

## 🆘 Problemas comuns + como ver logs

### Tela inicial não carrega / erro 502 Bad Gateway (Nginx):
Significa que o app Node NÃO está rodando no PM2. Verifique com **3 comandos do PM2**:
```bash
# 1. Ver lista de apps + STATUS (procure a linha "online" / "errored")
pm2 status

# 2. Ver LOGS do seu app em tempo real (Ctrl+C para sair)
# → aqui VOCÊ VÊ exatamente o erro do Node.js! Erro MySQL, erro porta, etc.
pm2 logs memoriasqueeducam --lines 100 --nostream

# 3. (Opcional) Dashboard visual em cores:
pm2 monit
```
Se estiver parado → `pm2 start deploy/ecosystem.config.js --env production` + `pm2 save`

### Páginas mostram "erro de banco":
```bash
# Teste manual de login no MySQL com as credenciais do .env
mysql -u app_memorias -p aplicativo
# → se entrar OK, o problema é outro; senão reset senha no passo 5
```

### Nginx não carrega / erro de sintaxe nginx.conf:
```bash
nginx -t
systemctl status nginx --no-pager
```

---

## 📁 Resumo dos arquivos criados no projeto local

| Arquivo | O que faz |
|---|---|
| `.env.example` | Template de variáveis ambiente (copiar → `.env` na VPS) |
| `deploy/ecosystem.config.js` | **Configuração PM2** (nome app, logs, memória, restart) |
| `deploy/nginx.conf` | Configuração do Nginx (proxy reverso porta 3000 → porta 80/443) |
| Este arquivo `DEPLOY.md` | Este guia passo a passo 📘 |
