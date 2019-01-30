export default {
  data: function() {
    return {
      email: '',
      password: '',
      otp_number: '',
      error_otp: '',
      api_calling: false
    }
  },
  mounted: function () {
    this.email = localStorage.email
    this.password = localStorage.password
    localStorage.email = ''
    localStorage.password = ''

    if(!this.email || this.email.length <= 0 || !this.password || this.password.length <= 0) {
      this.$router.back();
    }
  },
  watch: {
    otp_number: function() {
      this.error_otp = ""
    }
  },
  methods: {
    submitLogin: function() {
      this.error_otp = "";
      let hasError = false;

      if(this.email.length <= 0) {
        this.error_otp = this.$t("common.error.required")
        hasError = true
      }
      else {
        const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if(!re.test(this.email)) {
          this.error_otp = this.$t("common.error.invalidEmail")
          hasError = true
        }
      }

      if(this.password.length <= 0) {
        this.error_otp = this.$t("common.error.required")
        hasError = true
      }
      else if(this.password.length < 8) {
        this.error_otp = this.$t("login.error.contain")
        hasError = true
      }

      if(this.otp_number.length <= 0) {
        this.error_otp = this.$t("common.error.enterOtp")
        hasError = true
      }
      else if(this.otp_number.length < 6) {
        this.error_otp = this.$t("login.error.enterOtp")
        hasError = true
      }

      if(hasError) {
        return;
      }

      this.api_calling = true

      var data = new FormData();
      data.append('memid', this.email);
      data.append('password', this.password);
      data.append('otp_number', this.otp_number);

      this.$http.post(`${this.apiURI}login_submit`, data,
        { headers: { 'Content-Type': 'text/plain' }})
      .then((response) => {
        this.api_calling = false
        const result = response.data.result
        const tryCount = result.code == -3 ? result.tryCount : 0;
        if(result.code == 1) {
          this.$store.commit('login', { token: result.login_token, email: this.email })
          this.$router.push('/')
        }
        else {
          switch(result.code) {
            case -1: this.error_otp = this.$t("login.error.noExist")
              break
            case -2: this.error_otp = this.$t("login.error.incorrect")
              break
            case -3:
              this.error_otp = this.$t("login.error.incorrect") + (tryCount > 1 ? ' ' + tryCount + this.$t("login.error.errCount") : '')
              break
            case -4: this.error_otp = this.$t("login.error.exceed")
              break
            case -5: this.error_otp = this.$t("login.error.blockedAcc")
              break
            case -6: this.error_otp = this.$t("login.error.enterOtp")
              break
            case -7: this.error_otp = this.$t("login.error.invalidOtp")
              break
            case -8: this.error_otp = this.$t("login.error.dismatchOtp")
              break
            case -98: this.error_otp = this.$t("common.error.blocked")
              break
            case -99: this.error_otp = this.$t("common.error.system")
              break
            default: this.error_otp = this.$t("common.error.unknown")
              break
          }
        }
      })
      .catch(() => {
        this.error_otp = this.$t("common.error.unknown")
        this.api_calling = false
      })
    }
  }
}
