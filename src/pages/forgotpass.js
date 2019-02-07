export default {
  data: function() {
    return {
      email: '',
      error_email: '',
      api_calling: false,
      request_success: false
    }
  },
  mounted: function () {

  },
  watch: {
    email: function() {
      this.error_email = ""
    }
  },
  methods: {
    submitRequest: function() {
      this.error_email = "";
      let hasError = false;

      if(this.email.length <= 0) {
        this.error_email = this.$t("common.error.required")
        hasError = true
      }
      else {
        const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if(!re.test(this.email)) {
          this.error_email = this.$t("common.error.invalidEmail")
          hasError = true
        }
      }

      if(hasError) {
        return;
      }

      this.api_calling = true

      var data = new FormData();
      data.append('memid', this.email);
      data.append('locale', 'en');

      this.$http.post(`${this.apiURI}password_recover`, data,
        { headers: { 'Content-Type': 'text/plain' }})
      .then((response) => {
        this.api_calling = false
        const result = response.data.result
        if(result.code == 1) {
          this.request_success = true
        }
        else {
          switch(result.code) {
            case -1: this.error_email = this.$t("common.error.invalidEmail")
              break
            case -2: this.error_email = this.$t("login.error.noExist")
              break
            case -3: this.error_email = this.$t("login.error.blockedAcc")
              break
            case -4: this.error_email = this.$t("signUp.error.failSendMail")
              break
            case -98: this.error_email = this.$t("common.error.blocked")
              break
            case -99: this.error_email = this.$t("common.error.system")
              break
            default: this.error_email = this.$t("common.error.unknown")
              break
          }
        }
      })
      .catch(() => {
        this.error_email = this.$t("common.error.unknown")
        this.api_calling = false
      })
    }
  }
}
