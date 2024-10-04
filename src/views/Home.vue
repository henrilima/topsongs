<template>
    <main class="homepage">
        <div class="flex-column">
            <div class="main-title">
                <v-icon
                    name="fa-compact-disc"
                    animation="spin"
                    speed="slow"
                    scale="2"
                    class="v-icon"
                />
                <p class="main-text">TopSongs.</p>
            </div>
            <p>
                Crie uma arte com seu top 5 de um artista! Escolha suas músicas
                e compartilhe nas redes sociais.
            </p>
            <form @submit.prevent="findArtist">
                <p class="messages" v-if="messages">{{ messages }}</p>
                <input
                    type="text"
                    placeholder="Nome do seu artista"
                    v-model="artistName"
                />
                <button type="submit" class="cta-btn">Buscar</button>
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
                    <button
                        class="cta-btn"
                        v-if="artist"
                        @click="getArtistData"
                    >
                        Sim
                    </button>
                    <button class="cta-btn btn-not" @click="notIsMyArtist">
                        Não
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default {
    name: "HomePage",
    data() {
        return {
            artistName: "",
            artist: null,
            messages: "",
            isFadingOut: false,
            isHover: false,
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
            this.isFadingOut = true; // Inicia o fade-out
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
    mounted() {
        AOS.init(); // Inicializa as animações
    },
};
</script>

<style scoped>
main.homepage {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    gap: 4rem;
    overflow-x: hidden;
}

main.homepage > div {
    max-width: 400px;
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
    color: var(--orange);
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
    animation: spin 20s forwards ease;
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

    main.homepage > div {
        max-width: 100%;
        width: 100%;
    }
}
</style>
