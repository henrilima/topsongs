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
        <div :key="artist.id" data-aos="fade-left" class="flex-column artist-box" :class="{ 'fade-out': isFadingOut }"
          @animationend="handleAnimationEnd">
          <div class="disk" :style="{ backgroundImage: 'url(' + artist.icon + ')' }" :class="{ spin: isHover }"
            @mouseover="handleHover(true)" @animationend="handleHover(false)">
            <div class="hole"></div>
            <div class="hole hole-m"></div>
          </div>
          <h2 class="artist-name">{{ artist.name }}</h2>
          <p class="question">É esse seu artista?</p>
          <div class="buttons">
            <button class="cta-btn" v-if="artist" @click="getArtistData">
              Sim
            </button>
            <button class="cta-btn btn-not" @click="notIsMyArtist">
              Não
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex-column">
        <h1 class="emphasize">Crie artes incríveis!</h1>
        <p><strong>Simples e rápido:</strong> selecione, organize e personalize seu canvas musical.</p>
        <div class="flex-row">
          <div style="opacity: 1;"><img :src="doja" alt="canva" width="320" data-aos="fade-right" data-aos-delay="200" style="border-radius: 8px;" draggable="false" /></div>
        <div style="opacity: 0.6; margin-left: -120px;"><img :src="kali" alt="canva" width="300" data-aos="fade-right" data-aos-delay="600" style="border-radius: 8px;" draggable="false" /></div>
        <div style="opacity: 0.2; margin-left: -120px;"><img :src="marina" alt="canva" width="280" data-aos="fade-right" data-aos-delay="1000" style="border-radius: 8px;" draggable="false" /></div>
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
      const artistName = this.artistName;
      if (!artistName) {
        this.messages = "Por favor, insira o nome do seu artista.";
        return;
      }

      axios
        .get(
          // https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/artist?q=
          //
          `${this.$apiBaseURL}/api/artists?q=${encodeURIComponent(
            artistName
          )}`
        )
        .then((response) => {
          const artist = response.data.data[0];
          if (!artist) {
            this.messages =
              "Nenhum artista encontrado com esse nome.";
            return;
          }

          this.artist = {
            id: artist.id,
            name: artist.name,
            icon: artist.picture_big,
          };

          this.$nextTick(() => {
            AOS.refresh();
          });
        })
        .catch((error) => {
          console.error("Erro ao buscar os dados:", error);
          this.messages = "Ocorreu um erro ao buscar os dados.";
        });
    },
    notIsMyArtist() {
      this.isFadingOut = true;
    },
    handleAnimationEnd() {
      if (this.isFadingOut) {
        // Zera os dados do artista após a animação de fade-out
        this.artist = null;
        this.isFadingOut = false;
        this.artistName = "";
        this.messages = "";
        AOS.refresh();
      }
    },
    async getArtistData() {
      try {
        // Redireciona para a rota '/songs' e passa os dados diretamente como state
        this.$router.push({
          name: "selectSongs",
        });

        const artistData = { ...this.artist }; // Cria uma cópia do objeto
        localStorage.setItem("artistData", JSON.stringify(artistData));
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
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  align-items: center;
  justify-content: center;
}

main.homepage > div {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home > div {
  max-width: 400px;
  width: 100%;
}

.main-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.main-title .v-icon {
  color: var(--white);
}

form {
  margin-top: 1.6rem;
}

form h2 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  text-align: left;
  text-transform: uppercase;
  color: var(--lightgrey);
}

main.homepage div.artist-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

main.homepage div.artist-box h2.artist-name {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  color: var(--primary);
  text-align: center;
}

main.homepage div.artist-box div.buttons {
  width: 100%;
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-direction: row;
  justify-content: space-evenly;
}

main.homepage div.artist-box div.buttons button {
  width: 50%;
}

main.homepage div.artist-box div.disk {
  margin-bottom: 1rem;
}

.disk {
  width: 300px;
  height: 300px;
  background-size: cover;
  clip-path: circle(50% at center);
  position: relative;
}

.spin {
  animation: spin 10s forwards ease-in-out;
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
  background-color: var(--black);
  opacity: 1;
}

.fade-out {
  animation: fadeOut 0.3s forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 768px) {
  main.homepage {
    flex-direction: column;
    gap: 8rem;
    padding: 4rem 2rem;
  }

  main.homepage>div {
    max-width: 100%;
    width: 100%;
  }
}
</style>

84rem 2rem;
  }

  main.homepage>div {
    max-width: 100%;
    width: 100%;
