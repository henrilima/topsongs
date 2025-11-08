<template>
  <main class="homepage">
    <div class="home">
      <div class="flex-column" v-if="!artist">
        <div class="main-title">
          <v-icon name="fa-compact-disc" animation="spin" speed="slow" scale="2" class="v-icon" />
          <p class="main-text">TopSongs.</p>
        </div>
        <p>
          Crie uma arte personalizada com suas 5 músicas favoritas de um artista. Digite o nome, selecione as músicas e compartilhe seu gosto musical!
        </p>
        <form @submit.prevent="findArtist">
          <h2>Digite o nome do artista:</h2>
          <p class="messages" v-if="messages">{{ messages }}</p>
          <input type="text" placeholder="Nome do artista" v-model="artistName" />
          <button type="submit" class="cta-btn">Buscar artista</button>
        </form>
      </div>

      <div class="flex-column" v-if="artist">
        <div
          :key="artist.id"
          data-aos="fade-left"
          class="flex-column artist-box"
          :class="{ 'fade-out': isFadingOut }"
          @animationend="handleAnimationEnd"
        >
          <div
            class="disk"
            :style="{ backgroundImage: 'url(' + artist.icon + ')' }"
            :class="{ spin: isHover }"
            @mouseover="handleHover(true)"
            @animationend="handleHover(false)"
          >
            <div class="hole"></div>
            <div class="hole hole-m"></div>
          </div>

          <h2 class="artist-name">{{ artist.name }}</h2>
          <p class="question">É esse seu artista?</p>
          <div class="buttons">
            <button class="cta-btn" v-if="artist" @click="getArtistData">Sim</button>
            <button class="cta-btn btn-not" @click="notIsMyArtist">Não</button>
          </div>
        </div>
      </div>
    </div>

    <div class="images">
      <div class="flex-column">
        <h1 class="emphasize">Crie artes incríveis!</h1>
        <p><strong>Simples e rápido:</strong> selecione, organize e personalize seu canvas musical.</p>
        <div class="flex-row image-stack">
          <div style="opacity: 1">
            <img :src="doja" alt="canva" width="320" data-aos="fade-right" data-aos-delay="1000" draggable="false" />
          </div>
          <div style="opacity: 0.6; margin-left: -100px">
            <img :src="kali" alt="canva" width="300" data-aos="fade-right" data-aos-delay="600" draggable="false" />
          </div>
          <div style="opacity: 0.3; margin-left: -100px">
            <img :src="marina" alt="canva" width="280" data-aos="fade-right" data-aos-delay="200" draggable="false" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import AOS from "aos";

export default {
  name: "HomePage",
  data() {
    return {
      artistName: "",
      artist: null,
      messages: "",
      isFadingOut: false,
      isHover: false,
      doja: require("@/assets/images/top_songs_canvas_doja_cat.png"),
      kali: require("@/assets/images/top_songs_canvas_kali_uchis.png"),
      marina: require("@/assets/images/top_songs_canvas_marina_sena.png"),
    };
  },
  methods: {
    handleHover(isHover) {
      this.isHover = isHover;
    },
    findArtist() {
      const artistName = this.artistName.trim();
      if (!artistName) {
        this.messages = "Por favor, insira o nome do seu artista.";
        return;
      }

      axios
        .get(`${this.$apiBaseURL}/api/artists?q=${encodeURIComponent(artistName)}`)
        .then((response) => {
          const artist = response.data.data[0];
          if (!artist) {
            this.messages = "Nenhum artista encontrado com esse nome.";
            return;
          }

          this.artist = {
            id: artist.id,
            name: artist.name,
            icon: artist.picture_big,
          };

          this.$nextTick(() => AOS.refresh());
        })
        .catch(() => {
          this.messages = "Ocorreu um erro ao buscar os dados.";
        });
    },
    notIsMyArtist() {
      this.isFadingOut = true;
    },
    handleAnimationEnd() {
      if (this.isFadingOut) {
        this.artist = null;
        this.isFadingOut = false;
        this.artistName = "";
        this.messages = "";
        AOS.refresh();
      }
    },
    async getArtistData() {
      try {
        this.$router.push({ name: "selectSongs" });
        localStorage.setItem("artistData", JSON.stringify(this.artist));
      } catch (error) {
        console.error("Erro ao buscar dados do artista:", error);
      }
    },
  },
};
</script>

<style scoped>
main.homepage {
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  background-color: var(--black);
  color: var(--white);
}

main.homepage > div {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.main-title .v-icon {
  color: var(--white);
}

form {
  margin-top: 1.6rem;
  width: 100%;
}

form h2 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  text-align: left;
  text-transform: uppercase;
  color: var(--lightgrey);
}

form input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  margin-bottom: 0.8rem;
  background: var(--darkgrey);
  color: var(--white);
}

main.homepage div.artist-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.artist-name {
  font-size: 1.8rem;
  margin: 1rem 0 0.5rem 0;
  font-weight: 800;
  color: var(--primary);
  text-align: center;
}

.artist-box .buttons {
  width: 100%;
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: space-evenly;
}

.artist-box .buttons button {
  width: 50%;
}

.disk {
  width: 250px;
  height: 250px;
  background-size: cover;
  background-position: center;
  clip-path: circle(50% at center);
  position: relative;
  transition: transform 0.3s ease;
}

.spin {
  animation: spin 10s linear infinite;
}

.hole {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70px;
  height: 70px;
  background-color: var(--black);
  border-radius: 50%;
  opacity: 0.75;
  transform: translate(-50%, -50%);
}

.hole-m {
  width: 28px;
  height: 28px;
  opacity: 1;
}

.fade-out {
  animation: fadeOut 0.3s forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.images {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
}

.image-stack {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: nowrap;
}

.image-stack img {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

@media (max-width: 1000px) {
  main.homepage {
    flex-direction: column;
    gap: 4rem;
  }

  .home {
    width: 100%;
    padding: 4rem 2rem !important;
  }

  .disk {
    width: 200px;
    height: 200px;
  }

  .artist-name {
    font-size: 1.4rem;
  }

  .images {
    display: none !important;
  }
}
</style>
