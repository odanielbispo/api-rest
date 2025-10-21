# API Automation - ServeRest

Este projeto mostra um fluxo de automação de requisições de API utilizando o **Postman** com a API de teste [ServeRest](https://serverest.dev). O objetivo é estudar criação, leitura e testes de endpoints, incluindo automação do token de autenticação via **Pre-request Script**.

---

## Estrutura do Repositório

📁 api-automation-serverest  
├── 📁 images/ ← Prints do Postman  
│ ├── 01-environment.png  
│ ├── 02-login-request.png  
│ ├── 03-pre-request-script.png  
│ ├── 04-create-product.png  
│ ├── 05-get-product.png  
├── 📁 postman/  
│ └── serverest.postman_collection.json ← Coleção exportada  
└── 📁 scripts/  
└── pre-request-login.js ← Script que gera e guarda o token  


> **Coleção exportada:** é uma exportação da coleção Postman (`.json`) que pode ser importada em outro Postman para reproduzir os testes e requisições.

---

## Configuração do Ambiente

1. Criar um **Environment** no Postman com a variável:
   - `baseUrl` → `https://serverest.dev`
2. Configurar as variáveis de login:
   - `login_email` → `"fulano@qa.com"`
   - `login_password` → `"teste"`
3. Adicionar a variável `token`, que será preenchida automaticamente pelo Pre-request Script.

---

## Fluxo das Requisições

### 1️⃣ Login (POST)
Endpoint: `{{baseUrl}}/login`  
Body JSON:
```json
{
  "email": "fulano@qa.com",
  "password": "teste"
}
```
Resposta esperada:
```json
{
  "message": "Login realizado com sucesso",
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2️⃣ Automação do Token

O Pre-request Script envia o login e extrai o token JWT do campo authorization, salvando na variável de ambiente token.

Código completo do Pre-request Script:
```javascript
const postRequest = {
  url: pm.environment.get("baseUrl") + "/login",
  method: "POST",
  body: {
    mode: "raw",
    options: { raw: { language: "json" } },
    raw: JSON.stringify({ email: "fulano@qa.com", password: "teste" })
  }
};

pm.sendRequest(postRequest, function (err, res) {
  if (err) {
    console.log("Erro ao gerar token:", err);
    return;
  }
  let responseJson = res.json();
  let auth = responseJson["authorization"].split(" ");
  console.log("Token JWT:", auth[1]);
  pm.environment.set("token", auth[1]);
});
```
> Sempre que o token expira, o Pre-request Script gera um novo automaticamente antes de outras requisições.

### 3️⃣ Criar Produto (POST)

Endpoint: {{baseUrl}}/produtos
Header:
```
Authorization: Bearer {{token}}
```
Body JSON:
```json
{
  "nome": "Logitech G Pro X 2",
  "preco": 810,
  "descricao": "Mouse",
  "quantidade": 50
}
```
Resposta:
```json
{
  "message": "Cadastro realizado com sucesso",
  "_id": "MnnPiJSmobNPBV3k"
}
```

### 4️⃣ Validar Produto Criado (GET)

Endpoint: {{baseUrl}}/produtos/MnnPiJSmobNPBV3k
Header:
```
Authorization: Bearer {{token}}
```
Resposta:
```json
{
  "nome": "Logitech G Pro X 2",
  "preco": 810,
  "descricao": "Mouse",
  "quantidade": 50,
  "_id": "MnnPiJSmobNPBV3k"
}
```

### Prints do Postman

01-environment.png → Variáveis de ambiente configuradas  
02-login-request.png → Requisição de login  
03-pre-request-script.png → Script Pre-request  
04-create-product.png → Requisição de criação de produto  
05-get-product.png → Validação do produto criado   

### Observações / Notes

O token JWT expira; o Pre-request Script gera um novo token automaticamente.

Utilize o Environment para facilitar mudanças de URL e credenciais.

A coleção Postman exportada (serverest.postman_collection.json) permite importar todo o fluxo em outro Postman.

Projeto destinado a fins de estudo em automação de APIs.



