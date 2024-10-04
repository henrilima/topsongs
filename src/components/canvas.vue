<template>
    <div>
        <div class="canvaImg">
            <Loading v-if="loading" />
            <img v-else :src="src" alt="TopSongs | by HenriLima" />
        </div>

        <div class="color">
            <label for="colorPicker">Selecione uma cor</label>
            <input id="colorPicker" type="color" v-model="selectedColor" />

            <label for="colorPicker"
                >Opacidade ({{ this.opacityPercentage }}%)</label
            >
            <input
                id="opacityRange"
                type="range"
                min="0"
                max="100"
                v-model="opacityPercentage"
            />

            <button class="cta-btn" @click="changeColor">
                Alterar <v-icon name="fa-pencil-alt" scale="1" />
            </button>
            <button class="cta-btn" @click="downloadImage">
                Baixar imagem <v-icon name="fa-cloud-download-alt" scale="1" />
            </button>
        </div>
    </div>
</template>

<script>
import Loading from "@/components/loading.vue";
import axios from "axios";

export default {
    name: "CanvasComponent",
    props: ["imageSrc", "selectedSongs", "artistData"],
    components: { Loading },
    data() {
        return {
            loading: false,
            src: this.imageSrc,
            selectedColor: "#FEB029",
            opacityPercentage: 15,
        };
    },
    methods: {
        async changeColor() {
            this.loading = true;

            await axios
                .post(
                    `${this.$apiBaseURL}/topsongs/canvas`,
                    {
                        songs: this.selectedSongs,
                        artist: {
                            ...this.artistData,
                            color: this.selectedColor,
                            opacity: this.opacityPercentage,
                        },
                    },
                    {
                        responseType: "blob",
                    }
                )
                .then(async (response) => {
                    this.src = URL.createObjectURL(response.data);
                })
                .catch((error) => {
                    console.error("Erro:", error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        downloadImage() {
            const link = document.createElement("a");
            link.href = this.src;
            link.download = `top_songs_canvas_${this.artistData.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "_")}.png`;
            link.click();
        },
    },
};
</script>

<style scoped>
.canvaImg img {
    width: calc(1080px / 3.5);
    height: calc(1920px / 3.5);
    border-radius: 0.6rem;
}

.color {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: 768px) {
    .color {
        width: 100%;
        padding: 2rem;
    }
}

input[type="color"] {
    border: none;
    width: 100%;
    height: 40px;
    cursor: pointer;
    padding: 0;
    border-radius: 8px;
    border: none;
    overflow: hidden;
    appearance: none; /* Remove o estilo padrão do input */
    background-color: transparent;
    position: relative;
}

input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 0.5rem;
    background: var(--white);
    outline: none;
    transition: background 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--blurple);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Estilo para o label */
label {
    font-size: 1rem;
    text-transform: uppercase;
    text-align: center;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

input {
    margin-bottom: 1rem;
}
</style>