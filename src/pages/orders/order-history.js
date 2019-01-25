import common from '../../components/common.js'

export default {
    data: function() {
        return {

            visibleMarketDept: false,
            visibleTypeDept: false,
            isMobile: false,
            isTablet: false,
            visibleSideMenu: false,

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
    filters : {
        changeSlash : function(value) {
            if(common.isEmpty(value)){
                return ''
            } else {
                return value.replace('_','/')
            }
      }
    },
    mounted: function() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)

        this.marketDeptMenu = common.marketDeptMenu
        this.typeDeptMenu = common.typeDeptMenu
        this.requestOrderHistory()
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {

        goPrevPage() {
            if (this.prevPage <= 0) return
            this.curPage = this.prevPage
            this.requestOrderHistory()
        },
        goNextPage() {
            if (this.nextPage > this.lastPage) return
            this.curPage = this.nextPage
            this.requestOrderHistory()
        },
        goPage(page) {
            this.curPage = page
            this.requestOrderHistory()
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
            this.requestOrderHistory()
        },
        changeSortType: function(type, typeName) {
            this.sortType = type
            this.sortTypeName = typeName
            this.visibleTypeDept = false
            this.requestOrderHistory()
        },
        showMarketDept: function() {
            this.visibleMarketDept = !this.visibleMarketDept
        },
        showTypeDept: function() {
            this.visibleTypeDept = !this.visibleTypeDept
        },
        requestOrderHistory: function() {

            var data = new FormData()

            let startRow = (this.curPage - 1) * this.pageSize
            let endRow = this.curPage * this.pageSize - 1

            data.append('market_id', this.sortMarket)
            data.append('type', this.sortType)
            data.append('login_token', this.$store.state.loginToken)
            data.append('from', startRow)
            data.append('to', endRow)

            this.api_calling = true

            this.$http.post(`${this.apiURI}account_order`, data, {
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
                            row.coin_id = row.market_id.split('_')[0]
                            row.market_base = row.market_id.split('_')[1]
                            row.executed = row.trade_quantity

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
        toggleSideMenu() {
            this.visibleSideMenu = !this.visibleSideMenu;
        },
        handleResize() {
            this.isMobile = window.innerWidth < 768
            this.isTablet = window.innerWidth < 1025
        }
    }
}
