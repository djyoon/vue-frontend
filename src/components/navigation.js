import { mixin as onClickOutside } from 'vue-on-click-outside'

export default {
  mixins: [onClickOutside],
  data: function() {
    return {
      showMobileGnb: false,
      showAccountMenu: false,
      showLanguageMenu: false,
      befLogin: false,
      ncount: 0
    }
  },
  computed: {
    isLogin() { return this.$store.state.isLoin },
    loginEmail() { return this.$store.state.loginEmail }
  },
  mounted: function() {
    this.checkLogin()
  },
  methods: {
    closeAccountMenu() { this.showAccountMenu = false },
    toggleAccountMenu() { this.showAccountMenu = !this.showAccountMenu },
    closeLanguageMenu() { this.showLanguageMenu = false },
    toggleLanguageMenu() { this.showLanguageMenu = !this.showLanguageMenu },
    logout() {
      this.showMobileGnb = false;
      this.$store.commit('logout')
      this.$router.push('/')
      this.closeAccountMenu()
    },
    gotoAccount() {
      this.showMobileGnb = false;
      this.closeAccountMenu()
      this.$router.push('/account')
    },
    gotoPage(path) {
      this.showMobileGnb = false;
      this.$router.push('/' + path)
    },
    checkLogin() {
      if(this.$store.state.isLoin) {
        var data = new FormData()
        data.append('login_token', this.$store.state.loginToken)

        this.$http.post(`${this.apiURI}login_check`, data,
          { headers: { 'Content-Type': 'text/plain' }})
        .then((response) => {
          const result = response.data.result
          if(result.code == 1) {
            this.befLogin = true
            setTimeout(() => this.checkLogin(), 60000)
          }
          else {
            // 로그인 되어 있지 않은 경우 오류처리 없이 로그아웃 처리
            this.$store.commit('logout')

            if(this.befLogin) {
              // 로그아웃 된경우 화면을 강제로 갱신
              location.reload()
            }
          }
        })
        .catch(() => {
          // 오류처리 없이 로그아웃 처리
          this.$store.commit('logout')

          if(this.befLogin) {
            // 로그아웃 된경우 화면을 강제로 갱신
            location.reload()
          }
        })
      }
    }
  }
}
