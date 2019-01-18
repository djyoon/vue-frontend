export default {
    data: function() {
        return {
            otp: '',
            error_otp: '',
            qr_code: '',
            secret: '',

            api_calling: false
        }
    },

   mounted : function(){

       this.otp = "";
       this.error_otp = "";

       this.api_calling = true

       var data = new FormData();
       data.append('login_token', this.$store.state.loginToken)

       this.$http.post(`${this.apiURI}otp_create`, data,
           { headers: { 'Content-Type': 'text/plain' }})
           .then((response) => {
               this.api_calling = false
               const result = response.data.result

               if(result.code == 1) {
                   this.qr_code = result.data.qrcode;
                   this.secret = result.data.secret;
               }
               else {
                   switch(result.code) {
                       case -1: this.error_otp = this.$t("otp.error.invalidToken")
                           this.$store.commit('logout')
                           this.$router.push('/login')
                           break
                       case -2: this.error_otp = this.$t("otp.error.exist")
                           break
                       case -3:
                           this.error_otp = "You must have email authentication"
                           break
                       case -4: this.error_password = this.$t("login.error.exceed")
                           break
                       case -97: this.error_common = this.$t('account.error.loginFailed')
                           this.$store.commit('logout')
                           this.$router.push('/login')
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

    watch: {
       otp: function(){
           this.error_otp = '';
       }
    },
    methods: {
        submitOtp: function() {
            let hasError = false

            if(this.otp <= 0) {
                this.error_otp = this.$t('otp.error.enter')
                hasError = true
            }

            if(hasError) {
                return;
            }

            this.api_calling = true

            var data = new FormData();

            data.append('login_token', this.$store.state.loginToken)
            data.append('secret',this.secret)
            data.append('code',this.otp)

            this.$http.post(`${this.apiURI}otp_setup`, data,
                { headers: { 'Content-Type': 'text/plain' }})
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result

                    if(result.code == 1) {
                        this.$router.push('/account')
                    }
                    else {
                        switch(result.code) {
                            case -1: this.error_otp = this.$t("otp.error.invalidToken")
                                break
                            case -2: this.error_otp = this.$t("otp.error.invalidSecret")
                                break
                            case -3:this.error_otp = this.$t("otp.error.invalidOtp")
                                break
                            case -4: this.error_otp = this.$t("otp.error.invalidSecret")
                                break
                            case -97: this.error_otp = this.$t('account.error.loginFailed')
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
                    this.error_common = this.$t("common.error.unknown")
                    this.api_calling = false
                })
        },
        onCopyToClipboard: function() {

        },
        onErrorClipboard: function() {

        }
    }
}
