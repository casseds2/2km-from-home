import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    mapReady: false
  }
});

window.initMap = () => app.$set({ mapReady: true });;

export default app;
