<template>
  <div>
    <Loading v-if="loading" />
    <main class="albums-and-songs" v-else>
      <div class="albums">
        <div class="header">
          <button @click="$router.push({ name: 'HomePage' })" class="back-home-btn">
            <v-icon name="fa-home" scale="1" />
          </button>
          <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="Pesquisar álbuns e singles..."
              @input="filterAlbums" />
            <div class="icon">
              <v-icon name="fa-search" scale="1" />
            </div>
          </div>
        </div>
        <div class="carousel sticky">
          <div class="carousel-images">
            <img :src="images[prevImageIndex]" alt="Carrossel de Imagens" @click="prevImage"
              :class="{ animate: animate }" @animationend="resetAnimation" :draggable="false" />
            <img :src="images[mainImageIndex]" alt="Carrossel de Imagens" :class="{ 'animate-main': animate }"
              @animationend="resetAnimation" :draggable="false" />
            <img :src="images[nextImageIndex]" alt="Carrossel de Imagens" @click="nextImage"
              :class="{ animate: animate }" @animationend="resetAnimation" :draggable="false" />
          </div>
          <p>{{ mainAlbumInfo.title }}</p>
          <p>{{ artistData.name }}</p>
        </div>
        <selectedSongs :selectedSongs="selectedSongs" />
      </div>
      <div class="songs">
        <div v-for="(song, index) in mainAlbumInfo.songs" :key="song.id" class="song fade-down-animation"
          @click="selectSong(song)" :id="song.id" :style="{ animationDelay: `${index * 100}ms` }">
          <div class="song-info">
            <div class="song-id">{{ song.track_position }}.</div>
            <div class="song-details">
              <p>
                {{ song.title }}
                <v-icon name="bi-explicit" scale="0.8" v-if="song.explicit_lyrics" />
              </p>
              <p>
                {{
                  `${Math.floor(song.duration / 60)}:${song.duration % 60 < 10 ? "0" : ""}${song.duration % 60}` }} </p>
            </div>
          </div>
          <div class="song-preview" @click.stop>
            <audio :ref="`audio_${song.id}`" :src="song.preview" type="audio/mpeg"></audio>
            <div class="controls">
              <button @click="playPause(song.id)" class="play-btn">
                <v-icon v-if="isPlaying[song.id]" name="fa-pause" scale="0.7" />
                <v-icon v-else name="fa-play" scale="0.7" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
main .header {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

main .header button.back-home-btn {
  width: auto;
  transition: all 0.4s ease;
}

main .header button.back-home-btn:hover {
  background-color: var(--active);
  cursor: pointer;
}

main .header div.search-bar {
  width: 100%;
  position: relative;
}

main .header div.search-bar input[type='text'] {
  width: 100%;
}

main .header div.search-bar div.icon {
  position: absolute;
  top: 50%;
  right: 0;
  padding: 0.5rem;
  transform: translate(0%, -50%);
}

main.albums-and-songs {
  position: relative;

  min-height: 100vh;
  gap: 4rem;
  margin: 4rem 0;

  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.albums,
.songs {
  max-width: 420px;
  width: 100%;
  padding: 1rem;
}

.albums {
  position: sticky;
  top: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 1rem;
  overflow: hidden;
  padding: 4rem 1rem;
}

.albums .carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.albums .carousel p {
  margin-top: 1.2rem;
  font-weight: 700;
  font-size: 1.2rem;
  text-align: center;
}

.albums .carousel p:nth-of-type(2) {
  margin-top: 0;
  font-weight: 500;
  font-size: 1rem;
}

.carousel-images {
  display: flex;
  transition: transform 0.5s ease;
  align-items: center;
  justify-content: center;
  object-fit: contain;
  gap: 1rem;
  padding: 0.5rem;
}

.carousel img {
  height: 180px;
  width: auto;
  display: block;
  border-radius: 8px;
  filter: drop-shadow(6px 6px 6px rgba(var(--shadow), 0.2));
  transition: all 0.4s ease;
}

.carousel img:hover {
  cursor: pointer;
}

.carousel img:nth-child(2):hover {
  scale: 1.05;
}

.carousel img:nth-child(1),
.carousel img:nth-child(3) {
  height: 120px;
  width: auto;
  display: block;
  opacity: 0.4;
}

.carousel img:nth-child(1):hover,
.carousel img:nth-child(3):hover {
  opacity: 0.7;
}

.albums {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.songs {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  justify-content: flex-start;
  align-items: flex-start;
}

.songs div.song {
  opacity: 0;
  width: 100%;
  display: flex;
  background-color: var(--semidarkgrey);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s ease;
}

.songs div.song:hover {
  cursor: pointer;
}

.songs div.song.active {
  background-color: var(--active);
}

.songs div.song div.song-info {
  display: flex;
  gap: 0.5rem;
}

.songs div.song div.song-info div.song-id {
  font-weight: 800;
  font-size: 1rem;
}

.songs div.song div.song-info div.song-details {
  display: flex;
  flex-direction: column;
}

.songs div.song div.song-info div.song-details p:nth-of-type(2) {
  color: var(--lightgrey);
}

.songs div.song div.song-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.songs div.song div.song-preview button {
  padding: 0.6rem;
  border-radius: 1.5rem;
  border: none;
  background-color: var(--darkgrey);
  color: var(--primary);

  display: flex;
  justify-content: center;
  align-items: center;
}

.animate {
  animation: trade-album 0.6s ease forwards;
}

.animate-main {
  animation: trade-album-main 0.6s ease forwards;
}

.fade-down-animation {
  animation: fade-down-animation 0.3s ease forwards;
}

@keyframes fade-down-animation {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes trade-album {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.4;
  }
}

@keyframes trade-album-main {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media screen and (max-width: 768px) {
  main.albums-and-songs {
    flex-direction: column;
    align-items: center;
    padding: 4rem 0;
    gap: 2rem;
  }

  .albums {
    position: initial;
    padding: 1rem !important;
    overflow: hidden;
  }
}
</style>

<script>
import { reactive } from "vue";
import axios from "axios";
import selectedSongs from "@/components/SelectedSongs.vue";
import Loading from "@/components/loading.vue";

export default {
  name: "selectSongs",
  components: { selectedSongs, Loading },
  data() {
    return {
      selectedSongs: [],
      isPlaying: reactive({}),
      animate: false,
      loading: true,
      artistData: {},
      images: [],
      mainImageIndex: 0,
      prevImageIndex: 0,
      nextImageIndex: 0,
      mainAlbumInfo: {
        title: "",
        cover: "",
        songs: [],
      },
      albums: [],
    };
  },
  methods: {
    async filterAlbums() {
      const exactMatchIndex = this.albums.findIndex(album =>
        album.title.toLowerCase() === this.searchQuery.toLowerCase()
      );

      if (exactMatchIndex !== -1) {
        this.mainImageIndex = exactMatchIndex;
      } else {
        const partialMatchIndex = this.albums.findIndex(album =>
          album.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        if (partialMatchIndex !== -1) {
          this.mainImageIndex = partialMatchIndex;
        } else {
          return; // No match found, exit the function
        }
      }

      this.prevImageIndex = (this.mainImageIndex - 1 + this.images.length) % this.images.length;
      this.nextImageIndex = (this.mainImageIndex + 1) % this.images.length;

      this.mainAlbumInfo = this.albums[this.mainImageIndex];

      try {
        const response = await axios.get(
          `${this.$apiBaseURL}/api/tracklist?q=` + this.albums[this.mainImageIndex].id
        );
        this.mainAlbumInfo.songs = response.data;

        for (const song of this.selectedSongs) {
          const el = document.getElementById(song.id);
          if (el) {
            el.classList.add("active");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar as músicas do álbum:", error);
      }
    },
    async nextImage() {
      this.animate = true;
      this.mainImageIndex = (this.mainImageIndex + 1) % this.images.length;
      this.prevImageIndex = (this.mainImageIndex - 1 + this.images.length) % this.images.length;
      this.nextImageIndex = (this.mainImageIndex + 1) % this.images.length;

      this.mainAlbumInfo = this.albums[this.mainImageIndex];

      await axios
        .get(
          `${this.$apiBaseURL}/api/tracklist?q=` +
          this.albums[this.mainImageIndex].id
        )
        .then((response) => {
          this.mainAlbumInfo.songs = response.data;
          // Verificando se a música já está selecionada e adicionando a classe active no elemento
          for (const song of this.selectedSongs) {
            const el = document.getElementById(song.id);
            if (el) {
              el.classList.add("active");
            }
          }
        });
    },
    async prevImage() {
      this.animate = true;
      this.mainImageIndex =
        (this.mainImageIndex - 1 + this.images.length) %
        this.images.length;
      this.prevImageIndex =
        (this.mainImageIndex - 1 + this.images.length) %
        this.images.length;
      this.nextImageIndex =
        (this.mainImageIndex + 1) % this.images.length;

      this.mainAlbumInfo = this.albums[this.mainImageIndex];
      await axios
        .get(
          `${this.$apiBaseURL}/api/tracklist?q=` +
          this.albums[this.mainImageIndex].id
        )
        .then((response) => {
          this.mainAlbumInfo.songs = response.data;

          // Verificando se a música já está selecionada e adicionando a classe active no elemento
          for (const song of this.selectedSongs) {
            const el = document.getElementById(song.id);
            if (el) {
              el.classList.add("active");
            }
          }
        });
    },
    resetAnimation() {
      this.animate = false;
    },
    playPause(songId) {
      // Verifica se já está tocando
      const isCurrentlyPlaying = this.isPlaying[songId];

      // Pause todos os áudios antes de tocar o novo
      for (const key in this.$refs) {
        const audioArray = this.$refs[key]; // Acesse o array de referências de áudio
        const audio = audioArray?.[0]; // Acesse o primeiro elemento do array
        if (audio && audio.tagName === "AUDIO" && !audio.paused) {
          // Se o áudio estiver tocando, pause
          audio.pause();
          this.isPlaying[key.split("_")[1]] = false; // Atualiza o estado de isPlaying
        }
      }

      // Obtém o áudio atual a partir do ID da música
      const audio = this.$refs[`audio_${songId}`]?.[0]; // Acesse o primeiro elemento do array
      if (audio) {
        if (!isCurrentlyPlaying) {
          // Se o áudio não estava tocando, comece a tocar
          audio
            .play()
            .then(() => {
              this.isPlaying[songId] = true; // Atualiza o estado para tocando
            })
            .catch((err) => {
              console.error(
                `Erro ao tocar o áudio ${songId}:`,
                err
              );
            });
        } else {
          // Se o áudio já estava tocando, pause
          audio.pause();
          this.isPlaying[songId] = false; // Atualiza o estado para pausado
        }
      } else {
        console.error(`Áudio com ID ${songId} não encontrado!`); // Log de erro útil
      }
    },

    selectSong(song) {
      const el = document.getElementById(song.id);
      if (el.classList.contains("active")) {
        el.classList.remove("active");

        // Removendo do array a música de acordo com o index dela
        const index = this.selectedSongs.findIndex(
          (s) => s.id === song.id
        );
        if (index !== -1) {
          this.selectedSongs.splice(index, 1);
        }
      } else {
        if (this.selectedSongs.length > 4) {
          return alert("Só é possível selecionar até 5 músicas desse artista.");
        }

        el.classList.add("active");
        this.selectedSongs.push({
          ...song,
          albumTitle: this.mainAlbumInfo.title,
          coverAlbum: this.mainAlbumInfo.cover,
        });
      }
    },
  },
  async created() {
    this.artistData = JSON.parse(localStorage.getItem("artistData")) || {};

    if (!this.artistData.id) {
      this.$router.push({
        name: "HomePage",
      });
    }

    if (Object.keys(this.artistData).length <= 0) {
      this.$router.push({
        name: "HomePage",
      });
    } else {
      const albumsCovers = [];
      const albums = [];
      await axios
        .get(`${this.$apiBaseURL}/api/albums?q=` + this.artistData.id)
        .then(async (response) => {
          if (response.data.albums.length <= 0) {
            this.$router.push({
              name: "HomePage",
            });
          }

          for (const album of response.data.albums) {
            albumsCovers.push(album.cover);
            albums.push(album);
          }

          this.images = albumsCovers;
          this.albums = albums;

          this.mainImageIndex = 0;
          this.prevImageIndex =
            (this.mainImageIndex - 1 + this.images.length) %
            this.images.length;
          this.nextImageIndex =
            (this.mainImageIndex + 1) % this.images.length;

          this.mainAlbumInfo = albums[this.mainImageIndex];

          await axios
            .get(
              `${this.$apiBaseURL}/api/tracklist?q=` +
              albums[this.mainImageIndex].id
            )
            .then((response) => {
              this.mainAlbumInfo.songs = response.data;
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.$router.push({
            name: "HomePage",
          });
        });
    }
  },
};
</script>