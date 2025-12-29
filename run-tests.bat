@echo off
echo Instalando dependencias de teste...
call npm install --save-dev mocha chai sinon supertest nyc

echo.
echo Executando testes...
call npm test

pause
