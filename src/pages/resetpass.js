import OtpAuth from './otp-auth.vue'

export default {
  data: function() {
    return {
      new_pwd: '',
      confirm_pwd: '',
      otp_number: '',
      error_new: '',
      error_confirm: '',
      error_common: '',
      error_otp: '',
      api_calling: false,
      showOtpAuth: false,
      reset_success: false
    }
  },
  components: {
    OtpAuth
  },
  watch: {
    new_pwd: function() {
      this.error_new = ""
    },
    confirm_pwd: function() {
      this.error_confirm = ""
    }
  },
  methods: {
    enterOtp: function(otp_number) {
        this.otp_number = otp_number

        if(otp_number.length < 6) {
            this.error_otp = this.$t("password.error.invalidOtp")
        }
        else {
            this.submitReset()
        }
    },
    hideOtp: function() {
        this.showOtpAuth = false
    },
    submitReset: function() {
      this.error_new = "";
      this.error_confirm = "";
      this.error_common = "";
      let hasError = false;

      if(this.new_pwd.length <= 0) {
        this.error_new = this.$t("common.error.required")
        hasError = true
      }
      else if(this.new_pwd.length < 8) {
        this.error_new = this.$t("login.error.contain")
        hasError = true
      }
      else if(this.confirm_pwd <= 0) {
          this.error_confirm = this.$t('password.error.enter')
          hasError = true
      }
      else if(this.new_pwd !== this.confirm_pwd) {
          this.error_confirm = this.$t('password.error.notMatch')
          hasError = true
      }

      if(hasError) {
        return;
      }

      this.api_calling = true

      var data = new FormData();
      data.append('reset_token', this.$route.query.reset_token);
      data.append('new_password', this.new_pwd);
      data.append('otp_number', this.otp_number);

      this.$http.post(`${this.apiURI}password_reset_nologin`, data,
        { headers: { 'Content-Type': 'text/plain' }})
      .then((response) => {
        this.api_calling = false
        const result = response.data.result
        if(result.code == 1) {
          this.showOtpAuth = false
          this.reset_success = true
        }
        else {
          switch(result.code) {
            case -1: this.error_common = this.$t("password.error.invalidReset")
              break
            case -2: this.error_common = this.$t("password.error.invalidPwd")
              break
            case -3: this.error_common = this.$t("password.error.expiredReset")
              break
            case -4:
              if(this.showOtpAuth)
                  this.error_otp = this.$t("password.error.invalidOtp")
              else
                  this.showOtpAuth = true
              break
            case -98: this.error_common = this.$t("common.error.blocked")
              break
            case -99: this.error_common = this.$t("common.error.system")
              break
            default: this.error_common = this.$t("common.error.unknown")
              break
          }

          if(result.code != -4) this.showOtpAuth = false
        }
      })
      .catch(() => {
        this.error_common = this.$t("common.error.unknown")
        this.api_calling = false
        this.showOtpAuth = false
      })
    }
  }
}
