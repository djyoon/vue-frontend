import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/css/vue-popper.css';
import coinImages from "../../components/coin-icons.js"
import coinUrl from "../../components/coin-url.js"

export default {
    data: function() {
        return {

            coin_id: '',
            isMobile: false,
            historys: [],

            //Sort
            sortType: 'time',
            sortOrder: {
                'time': -1,
                'coin_id': -1,
            },

            // Paging
            totalCount: 0,
            curPage: 1,
            lastPage: 1,
            prevPage: 1,
            nextPage: 1,
            pages: [1],
            pageSize: 10,
            pageSplit: 5,

            // Error
            has_error: false,
            error_common: '',
            error_link: '',

        }
    },
    // Tootip
    components: {
        'popper': Popper
    },
    mounted: function() {

        this.showDepositHistory()
        this.handleResize()
        window.addEventListener('resize', this.handleResize)

    },
    watch: {

    },
    methods: {

        showDepositHistory: function() {

            var data = new FormData()

            let startRow = (this.curPage - 1) * this.pageSize
            let endRow = this.curPage * this.pageSize - 1

            data.append('coin_id', this.coin_id)
            data.append('login_token', this.$store.state.loginToken)
            data.append('from', startRow)
            data.append('to', endRow)
            data.append('locale', 'en')

            this.api_calling = true

            this.$http.post(`${this.apiURI}account_deposit_history`, data, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result
                    this.totalCount = result.data.total_rows;

                    this.resetPage()

                    if (result.code == 1) {
                        this.historys = []
                        result.data.rows.forEach((row) => {
                            this.historys.push({
                                time: row.time,
                                coin_icon: this.isMobile ? coinImages.big[row.coin_id] : coinImages.normal[row.coin_id],
                                coin_id: row.coin_id,
                                address_to: row.address_to,
                                amount: row.amount,
                                confirm: row.confirm + "/" + row.max_confirm,
                                status: row.status,

                                txid: row.txid,
                                link: coinUrl.url[row.coin_id] && row.status == 'complete' ? coinUrl.url[row.coin_id] + row.txid : false
                            })
                        })
                    } else {
                        switch (result.code) {
                            case -1:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true);
                                break
                            case -97:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true);
                                break
                            case -98:
                                this.popupError(this.$t('account.error.blocked'), '/login', true);
                                break
                            case -99:
                                this.popupError(this.$t('common.error.system'), '', false);
                                break
                            default:
                                this.popupError(this.$t('common.error.unknown'), '', false);
                                break
                        }
                    }
                })
                .catch(() => {
                    this.popupError(this.$t('common.error.unknown'), '', false)
                    this.api_calling = false
                })

        },
        handleResize() {
            this.isMobile = window.innerWidth < 768
        },
        popupError(message, link, logout) {
            this.has_error = true
            this.error_common = message
            this.error_link = link

            if (logout) {
                this.$store.commit('logout')
            }
        },
        onErrorResponse() {
            this.has_error = false
            this.error_common = ''

            if (this.error_link.length > 0) {
                this.$router.push(this.error_link)
            }
        },
        resetPage() {
            const pageSize = this.pageSize
            this.lastPage = Math.ceil(this.totalCount / pageSize)
            if (this.lastPage <= 0) this.lastPage = 1
            if (this.curPage > this.lastPage) this.curPage = this.lastPage

            const pageSplit = this.pageSplit
            this.nextPage = Math.ceil(this.curPage / pageSplit) * pageSplit + 1
            this.prevPage = Math.ceil(this.curPage / pageSplit) * pageSplit - 5

            this.pages = [];
            for (let n = this.prevPage + 1; n < this.nextPage; n++) {
                if (n > this.lastPage) break
                this.pages.push(n)
            }
        },
        goPrevPage() {
            if (this.prevPage <= 0) return
            this.curPage = this.prevPage
            this.showDepositHistory()
        },
        goNextPage() {
            if (this.nextPage > this.lastPage) return
            this.curPage = this.nextPage
            this.showDepositHistory()
        },
        goPage(page) {
            this.curPage = page
            this.showDepositHistory()
        },
        setSortOrder(type) {
            this.sortType = type
            this.sortOrder[type] = this.sortOrder[type] * -1
            this.sortList(type)
        },
        sortList(type) {
            this.historys = this.historys.sort(
                (a, b) => {
                    const order = this.sortOrder[type]
                    if (type === 'coin_id') {
                        if (a.coin_id.localeCompare(b.coin_id) < 0) return order
                        else if (a.coin_id.localeCompare(b.coin_id) > 0) return order * -1
                        else return 0
                    } else if (type === 'time') {
                        if (a.time < b.time) return order
                        else if (a.time > b.time) return order * -1
                        else return 0
                    }
                }
            )
        }
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.handleResize)
    }
}
