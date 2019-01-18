import { mixin as onClickOutside } from 'vue-on-click-outside'

export default {
  mixins: [onClickOutside],
  data: function() {
    return {
      showMobileGnb: false,
      showAccountMenu: false,
      showLanguageMenu: false
    }
  },
  computed: {
    isLogin() { return this.$store.state.isLoin },
    loginEmail() { return this.$store.state.loginEmail }
  },
  methods: {
    closeAccountMenu() { this.showAccountMenu = false },
    toggleAccountMenu() { this.showAccountMenu = !this.showAccountMenu },
    closeLanguageMenu() { this.showLanguageMenu = false },
    toggleLanguageMenu() { this.showLanguageMenu = !this.showLanguageMenu },
    logout() {
      this.$store.commit('logout')
      this.$router.push('/')
      this.closeAccountMenu()
    },
    gotoAccount() {
      this.closeAccountMenu()
      this.$router.push('/account')
    }
  }
}
