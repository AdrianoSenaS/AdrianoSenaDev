#!/bin/bash
# Caminho do NVM
export NVM_DIR="/home/srv-as/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Carrega nvm

# Vai para o diretório onde está o server.js
cd /home/srv-as/adrianosena.dev.br

# Roda o servidor
node server.js



