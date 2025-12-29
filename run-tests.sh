#!/bin/bash

echo "Instalando dependências de teste..."
npm install --save-dev mocha chai sinon supertest nyc

echo ""
echo "Executando testes..."
npm test
