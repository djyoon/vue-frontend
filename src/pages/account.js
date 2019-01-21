export default {
    data: function () {
        return {

            api_calling: false,
            account_success: false,
            email: '',
            memLevel: 0,
            withdrawLimit: 0,
            vipLevel: 0,
            tradeFee: 0,
            historys : [],
            totalCount : 0,

            // Paging
            curPage : 1,
            lastPage : 1,
            prevPage : 1,
            nextPage : 1,
            pages : [ 1 ],
            pageSize : 5,
            pageSplit : 5,

            // Error
            has_error: false,
            error_common: '',
            error_link: '',
        }
    },
    mounted: function () {
        this.reloadAccountInfo()
    },
    methods: {
      reloadAccountInfo: function () {
          const data = new FormData()
          data.append('login_token', this.$store.state.loginToken)

          this.api_calling = true

          this.$http.post(`${this.apiURI}account_info`, data,
              {headers: {'Content-Type': 'text/plain'}})
              .then((response) => {
                  this.api_calling = false
                  const result = response.data.result
                  if (result.code == 1) {
                      this.account_success = true
                      this.email = this.$store.state.loginEmail
                      this.memLevel = result.data.memlevel
                      this.vipLevel = result.data.viplevel
                      this.withdrawLimit = result.data.withdraw_max_crypto
                      this.tradeFee = result.data.fee_discount

                      this.$store.commit('setMemLevel', result.data.memlevel)
                      this.result = result

                      this.showLoginHistory()
                  }
                  else {
                      switch (result.code) {
                          case -1: this.popupError(this.$t('account.error.loginFailed'), '/login', true); break
                          case -97: this.popupError(this.$t('account.error.loginFailed'), '/login', true); break
                          case -98: this.popupError(this.$t('account.error.blocked'), '/login', true); break
                          case -99: this.popupError(this.$t('common.error.system'), '', false); break
                          default: this.popupError(this.$t('common.error.unknown'), '', false); break
                      }
                  }
              })
              .catch(() => {
                  this.popupError(this.$t('common.error.unknown'), '', false)
                  this.api_calling = false
              })
      },
      retryEmailAuth: function(){
          const data = new FormData();
          data.append('login_token', this.$store.state.loginToken)
          data.append('locale', 'en')

          this.api_calling = true
          this.$http.post(`${this.apiURI}signup_auth_resend`, data,
              {headers: {'Content-Type': 'text/plain'}})
              .then((response) => {
                  this.api_calling = false
                  const result = response.data.result

                  if (result.code == 1) {
                      this.popupError(this.$t('signUp.notifyMail'), '', false)
                  }
                  else {
                      switch (result.code) {
                          case -1: this.popupError(this.$t('account.error.loginFailed'), '/login', true); break
                          case -4: this.popupError(this.$t('signUp.error.failSendMail'), '', false); break
                          case -97: this.popupError(this.$t('account.error.loginFailed'), '/login', true); break
                          case -98: this.popupError(this.$t('common.error.blocked'), '', false); break
                          case -99: this.popupError(this.$t('common.error.system'), '', false); break
                          default: this.popupError(this.$t('common.error.unknown'), '', false); break
                      }
                  }
              })
              .catch(() => {
                  this.popupError(this.$t('common.error.unknown'), '', false)
                  this.api_calling = false
              })
      },
      showLoginHistory(){
            const data = new FormData();
            data.append('login_token', this.$store.state.loginToken)

            let startRow = (this.curPage - 1) * this.pageSize
            let endRow = this.curPage * this.pageSize - 1

            data.append('from',startRow)
            data.append('to',endRow)

            this.api_calling = true

            this.$http.post(`${this.apiURI}login_history`, data,
                {headers: {'Content-Type': 'text/plain'}})
                .then((response) => {
                    this.api_calling = false

                    const resultCode = response.data.result.code
                    const result = response.data.result.data

                    this.totalCount = result.total_rows;
                    this.resetPage()

                    if (resultCode == 1) {
                        this.historys = []

                        let ipList = [];
                        result.rows.forEach((row) => {
                            ipList.push(row.ip_addr)
                            this.historys.push({
                                time: row.time,
                                ip_addr: row.ip_addr,
                                browser: row.browser,
                                location: ''
                            })
                        })

                        // 중복 IP 제거
                        const ipUniq = ipList.reduce(function(a,b) {
                            if (a.indexOf(b) < 0) a.push(b)
                            return a
                        }, [])

                        // IP 검색 문자열 생성
                        let ipDataString = ''
                        ipUniq.forEach((ip) => {
                          if(ipDataString.length > 0) ipDataString += ','
                          ipDataString += '{"query": "' + ip + '"}'
                        })

                        // IP주소로 위치 찾기 API 호출
                        this.$http.post(`http://ip-api.com/batch?fields=status,country,region,city,query`,
                          '[' + ipDataString + ']', {headers: {'Content-Type': 'text/plain'}})
                        .then((response) => {
                            const locations = response.data;
                            this.historys.forEach((row) => {
                                const found = locations.find((a) => { return row.ip_addr === a.query })
                                if(found && found.status === 'success') {
                                    row.location =
                                        found.region * 1 > 0 ?
                                            found.city + ', ' + found.country :   // Region이 숫자인 경우는 Region이 없기 때문에 보여주지 않음
                                            found.city + ', ' + found.region + ', ' + found.country
                                }
                            })
                        })
                        .catch(() => {
                        })
                    }
                    else {
                        switch (resultCode) {
                            case -1: this.popupError(this.$t('account.error.loginFailed'), '/login', true); break
                            case -97: this.popupError(this.$t('account.error.loginFailed'), '/login', true); break
                            case -98: this.popupError(this.$t('common.error.blocked'), '', false); break
                            case -99: this.popupError(this.$t('common.error.system'), '', false); break
                            default: this.popupError(this.$t('common.error.unknown'), '', false); break
                        }
                    }
                })
                .catch(() => {
                    this.popupError(this.$t('common.error.unknown'), '', false)
                    this.api_calling = false
                })
        },
        resetPage() {
            const pageSize = this.pageSize
            this.lastPage = Math.ceil(this.totalCount / pageSize)
            if(this.lastPage <= 0) this.lastPage = 1
            if(this.curPage > this.lastPage) this.curPage = this.lastPage

            const pageSplit = this.pageSplit
            this.nextPage = Math.ceil(this.curPage / pageSplit) * pageSplit + 1
            this.prevPage = Math.ceil(this.curPage / pageSplit) * pageSplit - 5

            this.pages = [];
            for(let n=this.prevPage+1; n<this.nextPage; n++) {
                if(n > this.lastPage) break
                this.pages.push(n)
            }
        },
        goPrevPage(){
            if(this.prevPage <= 0) return
            this.curPage = this.prevPage
            this.showLoginHistory()
        },
        goNextPage(){
            if(this.nextPage > this.lastPage) return
            this.curPage = this.nextPage
            this.showLoginHistory()
        },
        goPage(page){
            this.curPage = page
            this.showLoginHistory()
        },
        popupError(message, link, logout) {
            this.has_error = true
            this.error_common = message
            this.error_link = link

            if(logout) {
                this.$store.commit('logout')
            }
        },
        onErrorResponse() {
            this.has_error = false
            this.error_common = ''

            if(this.error_link.length > 0) {
              this.$router.push(this.error_link)
            }
        }
    }
}
