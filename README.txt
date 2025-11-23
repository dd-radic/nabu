Run the application using CTRL+SHIFT+B

If you run npm install and update packages, navigate to:
\client\node_modules\react-scripts\config\webpackDevServer\config.js
and change the allowed hosts to:
allowedHosts: disableFirewall ? 'all' : ['all'],