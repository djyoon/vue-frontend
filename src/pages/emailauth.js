export default {
  data: function() {
    return {
      error_auth: '',
    }
  },
  mounted: function () {
    var data = new FormData()
    data.append('memid', this.$route.query.memid)
    data.append('email_token', this.$route.query.email_token)

    this.$http.post(`${this.apiURI}email_auth`, data,
      { headers: { 'Content-Type': 'text/plain' }})
    .then((response) => {
      const result = response.data.result
      if(result.code == 1) {
        if(this.$store.state.isLoin) {
          if(result.auth_type == 3)
            this.$router.push('/withdrawal_history')
          else
            this.$router.push('/account')
        }
        else {
          if(result.auth_type == 1) {
            const reset_token = result.reset_token
            this.$router.push({ path: '/reset-password', query: { reset_token: reset_token }})
          }
          else
            this.$router.push('/login')
        }
      }
      else {
        switch(result.code) {
          case -1: this.error_auth = this.$t('emailAuth.error.invalid')
            break
          case -2: this.error_auth = this.$t('emailAuth.error.invalidToken')
            break
          case -3: this.error_auth = this.$t('emailAuth.error.expire')
            break
          case -4: this.error_auth = this.$t('emailAuth.error.exist')
            break
          case -98: this.error_auth = this.$t('common.error.blocked')
            break
          case -99: this.error_auth = this.$t('common.error.system')
            break
          default: this.error_auth = this.$t('common.error.unknown')
            break
        }
      }
    })
    .catch(() => {
      this.error_auth = this.$t('common.error.unknown')
    })
  },
}
