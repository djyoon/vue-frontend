<template>
  <div class="wrapper">
    <Navigation></Navigation>

    <router-view></router-view>

    <Footer></Footer>
  </div>
</template>

<style src="./css/style.css"></style>
<style src="./css/reset.css"></style>
<style src="./css/form.css"></style>

<script>
import Navigation from './components/navigation.vue'
import Footer from './components/footer.vue'
import store from './store'

export default {
  name: 'App',
  components: {
    Footer,
    Navigation
  },
  store
}
</script>
