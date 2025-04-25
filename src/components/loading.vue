<template>
    <main class="loading">
        <v-icon name="fa-compact-disc" animation="spin" speed="slow" scale="4" style="color: var(--white)" />
        <h1>Estamos carregando tudo... >:)</h1>
    </main>
</template>

<script>
export default {
    name: "LoadingPage",
};
</script>

<style scoped>
main.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    gap: 0.5rem;
}

main.loading h1 {
    font-size: 1.2rem;
    color: var(--lightgrey);
}
</style>