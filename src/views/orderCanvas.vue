<template>
    <div class="reorganize-and-canvas">
        <div class="reorganize" v-if="reorganizedDiv">
            <h2 v-if="selectedSongs.length > 0 && selectedSongs.length <= 5">
                Organize a ordem das suas músicas
            </h2>
            <draggable
                v-model="selectedSongs"
                class="draggable"
                @change="draggableChanged"
            >
                <template #item="{ element, index }">
                    <div class="item">
                        {{ index + 1 }}. {{ element.title }}
                        <span
                            :class="[
                                'emphasis',
                                {
                                    'emphasis-b':
                                        element.albumTitle
                                            .toLowerCase()
                                            .includes('deluxe') ||
                                        element.albumTitle
                                            .toLowerCase()
                                            .includes('edition'),
                                },
                            ]"
                        >
                            [{{ element.albumTitle }}]
                        </span>
                    </div>
                </template>
            </draggable>
            <button
                class="cta-btn"
                v-if="selectedSongs.length == 5"
                @click="confirmSelections"
            >
                Finalizar
            </button>
        </div>
        <Loading v-if="loading" />
        <Canvas
            class="canvas"
            v-if="canvas"
            :imageSrc="imageSrc"
            :artistData="artistData"
            :selectedSongs="selectedSongs"
        />
    </div>
</template>
  
  <script>
import Canvas from "@/components/canvas.vue";
import Loading from "@/components/loading.vue";
import draggable from "vuedraggable";
import axios from "axios";

export default {
    name: "orderCanvas",
    data() {
        return {
            artistData: {},
            selectedSongs: [], // Inicializa como array vazio
            canvas: false,
            loading: false,
            reorganizedDiv: true,
            imageSrc: null,
        };
    },
    components: { Canvas, draggable, Loading },
    created() {
        const songs = localStorage.getItem("selectedSongs");
        const artist = localStorage.getItem("artistData");
        this.selectedSongs = songs ? JSON.parse(songs) : [];
        this.artistData = artist ? JSON.parse(artist) : {};

        if (this.selectedSongs.length <= 0) {
            this.$router.push({
                name: "HomePage",
            });
        }
    },
    methods: {
        async confirmSelections() {
            this.loading = true;
            this.reorganizedDiv = false;

            await axios
                .post(
                    `${this.$apiBaseURL}/topsongs/canvas`,
                    {
                        songs: this.selectedSongs,
                        artist: this.artistData,
                    },
                    {
                        responseType: "blob",
                    }
                )
                .then(async (response) => {
                    this.imageSrc = URL.createObjectURL(response.data);
                })
                .catch((error) => {
                    console.error("Erro:", error);
                })
                .finally(() => {
                    this.loading = false;
                    this.canvas = true;
                });
        },
        draggableChanged() {
            localStorage.setItem(
                "selectedSongs",
                JSON.stringify(this.selectedSongs)
            );
        },
    },
};
</script>
  
  <style scoped>
.reorganize-and-canvas {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: row;
    height: 100vh;
    gap: 1rem;
}

@media screen and (max-width: 768px) {
    .reorganize-and-canvas {
        margin: 4rem 0;
        gap: 2rem;
    }
}

.reorganize,
.canvas {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 420px;
    width: 100%;
    padding: 1rem;
}

.canvas {
    max-width: 100%;
    min-height: 100vh;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4rem;
}

@media screen and (max-width: 768px) {
    .canvas {
        flex-direction: column-reverse;
        align-items: center;
        justify-content: center;
        gap: 6rem;
    }
}

.reorganize h2 {
    font-size: 1.2rem;
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
    color: var(--lightgrey);
}

.draggable {
    margin-top: 1.2rem;
}

.item {
    text-align: center;
    margin-bottom: 0.5rem;
    cursor: grab;
}

.item:active {
    cursor: grabbing;
}

.emphasis {
    color: var(--orange);
}

.emphasis-b {
    color: var(--blurple) !important;
}
</style>
  