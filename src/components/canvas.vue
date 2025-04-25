<template>
    <div>
        <div class="canvaImg">
            <Loading v-if="loading" />
            <img v-else :src="src" alt="TopSongs | by HenriLima" />
        </div>

        <div class="customization">
            <div>
                <label>Selecione uma capa</label>
                <div class="images">
                    <div v-for="(song, index) in albumCovers" :key="index" :id="'cover_' + index" class="image-option"
                        @click="selectCover(song.cover, index)">
                        <img :src="song.cover" alt="Album Cover" />
                    </div>
                </div>
            </div>

            <div>
                <label>Selecione um padrão</label>
                <div class="images">
                    <div v-for="(pattern, index) in patternsData" :key="index" :id="'tipo_' + index"
                        class="image-option" @click="selectPattern(pattern.id, index)">
                        <img :src="pattern.src" alt="Pattern" />
                    </div>
                </div>
            </div>

            <div>
                <label for="colorPicker">Selecione uma cor</label>
                <input id="colorPicker" type="color" v-model="selectedColor" />
            </div>

            <div>
                <label for="opacityRange">Opacidade ({{ this.opacityPercentage }}%)</label>
                <input id="opacityRange" type="range" min="0" max="100" v-model="opacityPercentage" />
            </div>

            <div class="buttons">
                <button class="cta-btn" @click="changeColor">
                    <v-icon name="fa-pencil-alt" scale="1" />
                    <p>Alterar</p>
                </button>
                <button class="cta-btn" @click="downloadImage">
                    <v-icon name="fa-file-download" scale="1" />
                    <p>Baixar imagem</p>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.canvaImg img {
    width: calc(1080px / 3.5);
    height: calc(1920px / 3.5);
    border-radius: 0.6rem;
}

.customization {
    max-width: 300px;
    gap: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.customization>div:not(.buttons) {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.customization div div.images {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.customization .images .image-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    border: 2px solid transparent;
}

.customization .images .image-option:hover {
    cursor: pointer;
}

.customization .images .image-option img {
    width: calc((300px/3) - (0.2rem * 3) - 1rem);
    height: calc((300px/3) - (0.2rem * 3) - 1rem);
    object-fit: cover;
}

label {
    font-size: 1rem;
    text-transform: uppercase;
    text-align: center;
    font-weight: 800;
    margin-bottom: 0.1rem;
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
    appearance: none;
    background-color: transparent;
    position: relative;
}

input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
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
    background-color: var(--primary);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.buttons {
    width: 100%;
    gap: 0.5rem;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}

.buttons button {
    width: 50%;
    gap: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.buttons button p {
    width: 50%;
}

@media screen and (max-width: 768px) {
    .color {
        width: 100%;
        padding: 2rem;
    }
}
</style>

<script>
import Loading from "@/components/loading.vue";
import axios from "axios";

export default {
    name: "CanvasComponent",
    props: ["imageSrc", "selectedSongs", "artistData"],
    components: { Loading },
    data() {
        return {
            borderColor: '#fff',
            pattern: 1,
            loading: false,
            src: this.imageSrc,
            opacityPercentage: 15,
            lastCoverSelected: 0,
            lastPatternSelected: 0,
            selectedColor: "#B22222",
            newArtistData: { ...this.artistData },
        };
    },
    computed: {
        albumCovers() {
            const covers = [{
                id: 0,
                cover: this.artistData.icon
            }];

            var _testCovers = [this.artistData.icon];

            for (let i in this.selectedSongs) {
                if (!_testCovers.includes(this.selectedSongs[i].coverAlbum)) {
                    covers.push({
                        id: i + 1,
                        cover: this.selectedSongs[i].coverAlbum
                    });

                    _testCovers.push(this.selectedSongs[i].coverAlbum);
                }
            }

            return covers;
        },
        patternsData() {
            const patternsList = [];

            for (let i = 1; i <= 6; i++) {
                patternsList.push({
                    id: i,
                    src: require(`@/assets/patterns/tipo_${i}.svg`)
                });
            }

            return patternsList;
        }
    },
    mounted() {
        this.$nextTick(() => {
            const coverElement = document.getElementById(`cover_0`);
            const patternElement = document.getElementById(`tipo_0`);

            if (coverElement) {
                coverElement.style.borderColor = this.borderColor;
            }

            if (patternElement) {
                patternElement.style.borderColor = this.borderColor;
            }
        });
    },
    methods: {
        selectCover(cover, index) {
            if (this.lastCoverSelected === index) {
                return;
            }

            if (this.lastCoverSelected !== null) {
                document.getElementById(`cover_${this.lastCoverSelected}`).style.borderColor = 'transparent';
            }

            document.getElementById(`cover_${index}`).style.borderColor = this.borderColor;
            this.lastCoverSelected = index;
            this.newArtistData.icon = cover;
        },
        selectPattern(id, index) {
            if (this.lastPatternSelected === index) {
                return;
            }

            if (this.lastPatternSelected !== null) {
                document.getElementById(`tipo_${this.lastPatternSelected}`).style.borderColor = 'transparent';
            }

            document.getElementById(`tipo_${index}`).style.borderColor = this.borderColor;
            this.lastPatternSelected = index;
            this.pattern = id;
        },
        async changeColor() {
            this.loading = true;

            await axios
                .post(
                    `${this.$apiBaseURL}/topsongs/canvas`,
                    {
                        songs: this.selectedSongs,
                        artist: {
                            ...this.newArtistData,
                            color: this.selectedColor,
                            opacity: this.opacityPercentage,
                            pattern: this.pattern
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