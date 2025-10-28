<template>
  <section class="selected-songs-component">
    <h2 v-if="selectedSongs.length > 0 && selectedSongs.length <= 5">
      Suas músicas selecionadas
    </h2>
    <h2 v-else>
      Escolha até 5 músicas de qualquer álbum para criar sua lista de favoritas. Pesquise o álbum ou clique nas capas para ver as músicas.
    </h2>
    <ul>
      <li v-for="song in selectedSongs" :key="song.id">
        {{ song.title }}
        <span :class="[
          'emphasis',
          {
            'emphasis-b':
              song.albumTitle
                .toLowerCase()
                .includes('deluxe') ||
              song.albumTitle
                .toLowerCase()
                .includes('edition'),
          },
        ]">[{{ song.albumTitle }}]</span>
      </li>
    </ul>
    <button class="cta-btn" v-if="selectedSongs.length == 5" @click="confirmSelections">
      Próximo
    </button>
  </section>
</template>

<script>
export default {
  name: "selectedSongs",
  props: {
    selectedSongs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      emphasis_b: false,
    };
  },
  methods: {
    confirmSelections() {
      localStorage.setItem(
        "selectedSongs",
        JSON.stringify(this.selectedSongs)
      );
      this.$router.push({
        name: "orderCanvas",
      });
    },
  },
};
</script>

<style scoped>
.selected-songs-component {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.selected-songs-component h2 {
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
  color: var(--lightgrey);
}

.selected-songs-component ul {
  margin-top: 0.5rem;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.selected-songs-component ul li {
  margin-bottom: 0.3rem;
  font-size: 1rem;
  transition: color 0.3s ease;
  text-align: center;
}

.selected-songs-component button {
  margin-top: 1rem;
}

.emphasis {
  color: var(--primary);
}

.emphasis-b {
  color: var(--secondary) !important;
}
</style>