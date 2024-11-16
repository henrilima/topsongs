// Importando os ícones do Oh-Vue-Icons
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as IconsFa from "oh-vue-icons/icons/fa";
import * as IconsBi from "oh-vue-icons/icons/bi";

import { createApp } from "vue";
import App from "./App.vue";

// Importando as rotas da aplicação
import router from "./routes";

// Importando os estilos
import "./assets/style.css";


// Adicionando os ícones aos componentes globais
const Icon = Object.values({
    ...IconsFa,
    ...IconsBi,
});
addIcons(...Icon);

// Criando a instância da aplicação Vue e aplicando as rotas e os ícones
const app = createApp(App);
app.use(router);
app.component("v-icon", OhVueIcon);

// Definindo a URL base da API
app.config.globalProperties.$apiBaseURL = 'https://top-songs-api.vercel.app';

// Iniciando a aplicação Vue na raiz do DOM
app.mount("#app");
