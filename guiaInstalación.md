# Entorno virtual en Node.js
Node.js: Usa npm y package.json para gestión de dependencias
- package.json = equivale al requirements.txt de Python
- node_modules/ = equivale al entorno virtual de Python
- npm install = equivale a pip install

# Dependencias
Si ejecutamos `npm list` veremos las dependencias instaladas en el proyecto.
Nosotros vamos a utilizar las siguientes:
- express
- mssql
- cors
- dotenv
- morgan
Cada una de estas cosas sirve para algo distinto.
Además vamos a utilizar `nodemon`

# ¿Qué es Nodemon?
Nodemon = Node Monitor. Es una herramienta que reinicia automáticamente tu servidor Node.js cuando detecta cambios en los archivos.