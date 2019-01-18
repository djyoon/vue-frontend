export default {
  data: function() {
    return {
      email: '',
      password: '',
      confirm: '',
      agree: false,
      error_email: '',
      error_password: '',
      error_confirm: '',
      error_agree: '',
      error_common: '',
      signup_success: false,
      api_calling: false

    }
  },
  mounted: function () {

  },
  watch: {
    email: function() {
      this.error_email = ""
    },
    password: function() {
      this.error_password = ""
    },
    confirm: function() {
      this.error_confirm = ""
    },
    agree: function() {
      this.error_agree = ""
    }
  },
  methods: {
    submitSignup: function() {
      this.error_email = ""
      this.error_password = ""
      this.error_confirm = ""
      this.error_agree = ""
      this.error_common = ""
      let hasError = false

      if(this.email.length <= 0) {
        this.error_email = this.$t('common.error.required')
        hasError = true
      }
      else {
        const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if(!re.test(this.email)) {
          this.error_email = this.$t('signUp.error.invalid')
          hasError = true
        }
      }

      if(this.password.length <= 0) {
        this.error_password = this.$t('common.error.required')
        hasError = true
      }
      else if(this.password.length < 8) {
        this.error_password = this.$t('common.error.invalidPwd')
        hasError = true
      }

      if(this.confirm.length <= 0) {
        this.error_confirm = this.$t('common.error.invalidPwd')
        hasError = true
      }
      else if(this.confirm !== this.password) {
        this.error_confirm = this.$t('signUp.error.notMatch')
        hasError = true
      }

      if(!this.agree) {
        this.error_agree = this.$t('common.error.required')
        hasError = true
      }

      if(hasError) {
        return;
      }

      var data = new FormData();
      data.append('memid', this.email);
      data.append('password', this.password);
      data.append('locale', 'en');

      this.api_calling = true

      this.$http.post(`${this.apiURI}signup_submit`, data,
        { headers: { 'Content-Type': 'text/plain' }})
      .then((response) => {
        this.api_calling = false
        const result = response.data.result
        if(result.code == 1) {
          this.signup_success = true
        }
        else {
          switch(result.code) {
            case -1: this.error_email = this.$t("signUp.error.invalid")
              break
            case -2: this.error_password = this.$t("signUp.error.incorrect")
              break
            case -3: this.error_email = this.$t("signUp.error.exist")
              break
            case -4: this.error_common = this.$t("signUp.error.failSendMail")
              break
            case -98: this.error_common = this.$t("common.error.blocked")
              break
            case -99: this.error_common = this.$t("common.error.system")
              break
            default: this.error_common = this.$t("common.error.unknown")
              break
          }
        }
      })
      .catch(() => {
        this.error_common = this.$t("common.error.unknown")
        this.api_calling = false
      })
    },
  }
}
