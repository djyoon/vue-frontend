import { Decimal } from 'decimal.js';
import common from '../../components/common.js'

export default {
    data: function() {
        return {

            visibleMarketDept: false,
            visibleTypeDept: false,

            orders: [],

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

            sortMarket: '*',
            sortType: '*',
            sortMarketName: 'ALL',
            sortTypeName: 'ALL',
            marketDeptMenu: [],
            typeDeptMenu: []
        }
    },
    mounted: function() {
        this.marketDeptMenu = common.marketDeptMenu
        this.typeDeptMenu = common.typeDeptMenu
        this.requestOrderOpen()
    },
    filters : {
        changeSlash : function(value) {
            if(common.isEmpty(value)){
                return ''
            } else {
                return value.replace('_','/')
            }
        }
    },
    methods: {
        goPrevPage() {
            if (this.prevPage <= 0) return
            this.curPage = this.prevPage
            this.requestOrderOpen()
        },
        goNextPage() {
            if (this.nextPage > this.lastPage) return
            this.curPage = this.nextPage
            this.requestOrderOpen()
        },
        goPage(page) {
            this.curPage = page
            this.requestOrderOpen()
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
        changeSortMarket: function(market, marketName) {
            this.sortMarket = market
            this.sortMarketName = marketName
            this.visibleMarketDept = false
            this.requestOrderOpen()
        },
        changeSortType: function(type, typeName) {
            this.sortType = type
            this.sortTypeName = typeName
            this.visibleTypeDept = false
            this.requestOrderOpen()
        },
        showMarketDept: function() {
            this.visibleMarketDept = !this.visibleMarketDept
        },
        showTypeDept: function() {
            this.visibleTypeDept = !this.visibleTypeDept
        },
        requestOrderOpen: function() {

            var data = new FormData()

            let startRow = (this.curPage - 1) * this.pageSize
            let endRow = this.curPage * this.pageSize - 1

            data.append('market_id', this.sortMarket)
            data.append('type', this.sortType)
            data.append('login_token', this.$store.state.loginToken)
            data.append('from', startRow)
            data.append('to', endRow)

            this.api_calling = true

            this.$http.post(`${this.apiURI}account_trade`, data, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result
                    if (result.code == 1) {
                        this.totalCount = result.data.total_rows;
                        this.resetPage()

                        this.orders = []
                        result.data.rows.forEach((row) => {
                            row.date = row.time
                            row.market = row.market_id
                            row.buycoin = row.market_id.split('_')[0]
                            row.sellcoin = row.market_id.split('_')[1]
                            row.unexecuted = new Decimal(row.quantity).minus(row.trade_quantity).toString()
                            row.exetotal = row.trade_amount

                            this.orders.push(row)
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
        popupError(message, link, logout) {
            this.has_error = true
            this.error_common = message
            this.error_link = link

            if (logout) {
                this.$store.commit('logout')
            }
        },
    },
}
