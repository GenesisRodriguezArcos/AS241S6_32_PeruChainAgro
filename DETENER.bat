@echo off
title Detener PeruChain Agro
color 0C

echo Deteniendo contenedores...
docker stop peruchain-backend peruchain-frontend
docker rm peruchain-backend peruchain-frontend
docker network rm peruchain-network

echo.
echo Aplicacion detenida correctamente!
pause
