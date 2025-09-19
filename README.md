# Empacotamento - Microserviço NestJS

## Descrição do Projeto

O microserviço **Empacotamento** foi desenvolvido como teste técnico para automatizar o processo de embalagem de pedidos de uma loja de jogos online (Seu Manoel).

O objetivo é:

- Receber uma lista de pedidos via API (JSON), onde cada pedido contém produtos com suas dimensões (altura, largura e comprimento em centímetros).
- Determinar automaticamente **quais caixas de papelão devem ser usadas para cada pedido** e **quais produtos vão em cada caixa**, tentando minimizar o número de caixas utilizadas.
- Considerar as caixas disponíveis:
    - **Caixa 1:** 30 x 40 x 80 cm
    - **Caixa 2:** 50 x 50 x 40 cm
    - **Caixa 3:** 50 x 80 x 60 cm

O microserviço retorna um JSON detalhando, para cada pedido, as caixas usadas e os produtos em cada uma.

O algoritmo utilizado é heurístico (greedy):

1. Ordena os produtos de cada pedido por **volume decrescente** (maiores primeiro).
2. Para cada produto, tenta encaixá-lo em uma caixa já aberta, verificando se cabe em **alguma orientação possível** (altura/largura/comprimento).
3. Caso o produto não caiba em nenhuma caixa aberta, abre a **menor caixa disponível** que possa comportá-lo.
4. Produtos que não cabem em nenhuma caixa disponível são marcados como `UNPACKABLE`.

> Este algoritmo garante resultados práticos na maioria dos casos, embora não seja 100% otimizado para cenários tridimensionais complexos.

---

## Tecnologias utilizadas

- Node.js + NestJS
- TypeScript
- Jest (testes unitários)
- Swagger (documentação da API)
- Docker

---

## Instalação e execução

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **Docker** instalados em sua máquina.

### Rodando com Docker (Recomendado)

A forma mais simples de executar o projeto é usando Docker Compose. Isso garante que todas as dependências sejam configuradas automaticamente.

1.  Clone o repositório:
    ```bash
    git clone <seu-repositorio-github>
    cd empacotamento
    ```

2.  Construa a imagem e inicie o container:
    ```bash
    docker-compose up --build
    ```

A API estará disponível em `http://localhost:3000`.

### Rodando sem Docker

1.  Clone o repositório:
    ```bash
    git clone <seu-repositorio-github>
    cd empacotamento
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação:
    ```bash
    npm run start:dev
    ```

A API estará disponível em `http://localhost:3000`.

---

## Documentação da API

A documentação da API (Swagger) está disponível em `http://localhost:3000/api`. Você pode usar esta interface para visualizar os endpoints e testar as requisições.

---

## Executando os Testes

Para garantir a qualidade do código, o projeto conta com testes unitários.

Para rodar todos os testes:
```bash
npm run test