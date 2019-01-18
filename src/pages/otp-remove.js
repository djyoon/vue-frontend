export default {

    data: function(){
        return {

            error_otp: '',
            code: '',
            api_calling : false,
            reset_success: false,
            progress: false,
            login_email : ''

        }
    },

    mounted : function() {
        this.login_email = this.$store.state.loginEmail
    },

    watch : {
        code : function(){
            this.error_otp= '';
        }
    },

    methods : {
        resetOtp : function(){

            let hasError = false

            if(this.code.length <= 0 ){
                hasError = true;
                this.error_otp = this.$t('otp.error.enter')
                return false;
            }

            if(hasError) {
                return;
            }

            this.progress = true;
            var data = new FormData()

            data.append('code', this.code)
            data.append('login_token', this.$store.state.loginToken)
            data.append('locale', 'en')

            this.api_calling = true

            this.$http.post(`${this.apiURI}otp_remove`, data,
                { headers: { 'Content-Type': 'text/plain' }})
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result
                    this.progress = false

                    if(result.code == 1) {
                        this.reset_success = true
                    }
                    else {
                        switch(result.code) {
                            case -1: this.error_otp = this.$t("otp.error.invalidToken")
                                this.$store.commit('logout')
                                break
                            case -2: this.error_otp = this.$t("otp.error.invalidOtp")
                                break
                            case -3: this.error_otp = this.$t("otp.error.noExist")
                                break
                            case -4:
                                this.error_otp  = this.$t("otp.error.invalidOtp")
                                break
                            case -97: this.error_otp = this.$t('account.error.loginFailed')
                                this.$store.commit('logout')
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
                    this.progress = false
                    this.api_calling = false
                    this.error_otp = this.$t("common.error.unknown")
                })

        }
    }
}
