<template>
  <div class="reorganize-and-canvas">
    <div class="reorganize" v-if="reorganizedDiv">
      <h2 v-if="selectedSongs.length > 0 && selectedSongs.length <= 5">
        Organize a ordem das suas músicas
      </h2>
      <draggable v-model="selectedSongs" class="draggable" @change="draggableChanged">
        <template #item="{ element, index }">
          <div class="item">
            {{ index + 1 }}. {{ element.title }}
            <span :class="[
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
            ]">
              [{{ element.albumTitle }}]
            </span>
          </div>
        </template>
      </draggable>
      <div class="buttons">
        <button class="cta-btn" v-if="selectedSongs.length == 5" @click="confirmSelections">
          Finalizar
        </button>

        <button @click="$router.push({ name: 'selectSongs' })" class="back-home-btn">
          <p>Voltar a tela de seleção</p>
        </button>
      </div>
    </div>
    <Loading v-if="loading" />
    <Canvas class="canvas" v-if="canvas" :imageSrc="imageSrc" :artistData="artistData" :selectedSongs="selectedSongs" />
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
      selectedSongs: [],
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
  height: 100vh;
  min-height: 100vh;

  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: row;
  gap: 1rem;
}

.reorganize,
.canvas {
  width: 100%;
  height: auto;
  padding: 1rem;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.reorganize {
  width: 360px;
}

.canvas {
  flex-direction: row;
  margin: 4rem 0;
  gap: 4rem;
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
  color: var(--primary);
}

.emphasis-b {
  color: var(--secondary) !important;
}

.buttons {
    width: 100%;
    gap: 0.5rem;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.buttons button {
    width: 100%;
    gap: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.buttons button:hover {
  cursor: pointer;
  background-color: var(--secondary);
}

.buttons button p {
    width: 50%;
    font-weight: 600;
    color: var(--white);
}

@media screen and (max-width: 768px) {
  .reorganize-and-canvas {
    height: auto;
    gap: 2rem;
  }

  .canvas {
    height: auto;

    gap: 4rem;
    justify-content: flex-end;
    flex-direction: column-reverse;
  }
}
</style>