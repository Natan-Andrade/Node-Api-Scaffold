#!/bin/bash

if [ ! -d "node_modules" ] && [ -f "package.json" ] ; 
then 
    npm install --unsafe-perm; 
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]  ; then 
    cp .env.example .env ; 
fi

echo "Iniciando Aplicacao"
exec "$@"