import OtpAuth from './otp-auth.vue'

export default {
    data: function() {
        return {

            old_pwd: '',
            new_pwd: '',
            confirm_pwd : '',
            error_old: '',
            error_new: '',
            error_confirm: '',
            memLevel: '',
            error_common: '',
            error_otp: '',
            reset_success: false,
            api_calling: false,
            showOtpAuth: false,
            otp_number: ''
        }
    },
    components: {
      OtpAuth
    },
    watch: {
        old_pwd: function() {
            this.error_old = ""
        },
        new_pwd: function() {
            this.error_new = ""
        },
        confirm_pwd: function() {
            this.error_confirm = ""
        },
    },

    mounted: function () {
        this.memLevel = this.$store.state.memLevel
    },

    methods: {
        changePwd: function() {
            let hasError = false

            if(this.old_pwd.length <= 0 || this.old_pwd.length < 8) {
                this.error_old = this.$t('password.error.invalidPwd')
                hasError = true
            }

            if(this.new_pwd.length <= 0 || this.new_pwd.length < 8) {
                this.error_new = this.$t('password.error.invalidPwd')
                hasError = true
            }
            else if(this.confirm_pwd <= 0){
                this.error_confirm = this.$t('password.error.enter')
                hasError = true
            }
            else if(this.confirm_pwd < 8){
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

            // Otp가 등록된 경우
            if(this.memLevel >= 2) {
              this.showOtpAuth = true;
              return;
            }

            this.requestChange()
        },
        enterOtp: function(otp_number) {
            this.otp_number = otp_number
            this.showOtpAuth = false

            this.requestChange()
        },
        hideOtp: function() {
            this.showOtpAuth = false;
        },
        requestChange: function() {

            var data = new FormData()

            data.append('old_password', this.old_pwd)
            data.append('new_password', this.new_pwd)
            data.append('otp_number', this.otp_number)
            data.append('login_token', this.$store.state.loginToken)
            data.append('locale', 'en')

            this.api_calling = true

            this.$http.post(`${this.apiURI}password_reset`, data,
                { headers: { 'Content-Type': 'text/plain' }})
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result
                    if(result.code == 1) {
                        this.reset_success = true
                    }
                    else {
                        switch(result.code) {
                            case -1: this.error_common = this.$t("password.error.invalidToken")
                                break
                            case -2: this.error_old = this.$t("password.error.invalidPwd")
                                break
                            case -3: this.error_old = this.$t("password.error.notMatch")
                                break
                            case -4:
                                this.error_otp  = this.$t("password.error.invalidOtp")
                                this.showOtpAuth = true;
                                break
                            case -97: this.error_common = this.$t('account.error.loginFailed')
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
                    this.error_password  = this.$t("common.error.unknown")
                    this.api_calling = false
                })
        },
        logout: function(){
            this.$store.commit('logout')
            this.$router.push('/login')
        },
        gotoAccount: function() {
            this.$router.push('/account')
        }
    }
}
