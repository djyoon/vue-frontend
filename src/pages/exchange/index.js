import { mixin as onClickOutside } from 'vue-on-click-outside'
import Announcement from './announcement.vue'
import AssetTotal from './asset-total.vue'
import MarketList from './market-list.vue'
import TradeSummary from './trade-summary.vue'
import OrderBook from './order-book.vue'
import TradeChart from './trade-chart.vue'
import MarketOrder from './market-order.vue'
import MarketHistory from './market-history.vue'
import MyOrder from './my-order.vue'
import { Decimal } from 'decimal.js'

export default {
    mixins: [onClickOutside],
    data: function() {
        return {
            currentMobileTab: 0,
            isMobile: false,
            isTablet: false,
            isLogin: false,
            showGroupMenu: false,
            myAssets: [],
            usdTotal: "0",
            btcTotal: "0",
            api_calling: false,
            market_id: "BTC_USD",
            market_base: "USD",
            market_refresh: 0,
            fee_discount: 0,
            trade_fee: 0.1,
            min_order: 1,
            selectedPrice: 0,
            favorChanged: 0,

            // Error
            has_error: false,
            error_common: '',
            error_link: '',

            // Alert
            alerts: [],
            alertCounter: 0
        }
    },
    components: {
        "announcement": Announcement,
        "asset-total": AssetTotal,
        "market-list": MarketList,
        "trade-summary": TradeSummary,
        "order-book": OrderBook,
        "trade-chart": TradeChart,
        "market-order": MarketOrder,
        "market-history": MarketHistory,
        "my-order": MyOrder
    },
    created: function() {
        this.resetMarket()
    },
    mounted: function() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)

        this.reloadAccountInfo()
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.handleResize)
    },
    computed: {
        visibleTabTrade: function() {
            return !this.isMobile || this.currentMobileTab == 0
        },
        visibleTabMarket: function() {
            return !this.isMobile || this.currentMobileTab == 1
        },
        visibleTabChart: function() {
            return !this.isMobile || this.currentMobileTab == 2
        },
    },
    methods: {
        resetMarket: function() {
            let market_id = this.$route.query.market_id
            if(market_id && market_id.length > 0) {
                this.market_id = market_id.toUpperCase()
                this.market_base = market_id.split('_')[1]
            }
            else if(this.$store.state.exchangeMarket && this.$store.state.exchangeMarket.length > 0) {
                market_id = this.$store.state.exchangeMarket.toUpperCase()
                this.market_id = market_id
                this.market_base = market_id.split('_')[1]
            }
        },
        handleResize: function() {
            this.isMobile = window.innerWidth < 768
            this.isTablet = window.innerWidth < 1025
        },
        setMobileTab: function(tab) {
            this.currentMobileTab = tab
        },
        toggleDepthMenu: function() {
            this.showGroupMenu = !this.showGroupMenu
        },
        closeDepthMenu: function() {
            this.showGroupMenu = false
        },
        reloadAccountInfo: function() {
            const data = new FormData()
            data.append('login_token', this.$store.state.loginToken)

            this.api_calling = true

            this.$http.post(`${this.apiURI}account_info`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result
                    if (result.code == 1) {
                        this.fee_discount = result.data.fee_discount
                        this.reloadAccountBalance()
                    } else {
                        switch (result.code) {
                            case -1:
                            case -97:
                            case -98:
                                this.isLogin = false
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
                    this.isLogin = false
                    this.api_calling = false
                    this.popupError(this.$t('common.error.unknown'), '', false)
                })
        },
        reloadAccountBalance: function() {
            const data = new FormData()
            data.append('login_token', this.$store.state.loginToken)

            this.api_calling = true

            this.$http.post(`${this.apiURI}account_balance`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result
                    if (result.code == 1) {
                        const coins = result.data.rows
                        this.myAssets = coins

                        let usdTotal = new Decimal(0)
                        let btcTotal = new Decimal(0)
                        coins.forEach((coin) => {
                            const coinBalance = new Decimal(coin.balance)
                            usdTotal = usdTotal.plus(coinBalance.times(coin.price_usd))
                            btcTotal = btcTotal.plus(coinBalance.times(coin.price_btc))
                        })

                        this.usdTotal = usdTotal.toFixed(8)
                        this.btcTotal = btcTotal.toFixed(8)

                        this.isLogin = true
                    } else {
                        switch (result.code) {
                            case -1:
                            case -97:
                            case -98:
                                this.isLogin = false
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
                    this.isLogin = false
                    this.api_calling = false
                    this.popupError(this.$t('common.error.unknown'), '', false)
                })
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
        },
        selectMarket(market_id) {
            this.market_id = market_id
            this.$store.commit("resetExchangeMarket", market_id)
            this.$router.push("/exchange?market_id=" + market_id)
            location.reload()
        },
        setTradeFee(trade_fee) {
            this.trade_fee = trade_fee
        },
        setMinOrder(min_order) {
            this.min_order = min_order
        },
        refreshMarketList() {
            this.market_refresh++
        },
        addAlert: function(type, title, desc) {
            // type: success, warning, error
            const id = this.alertCounter++;
            this.alerts.push({id: id, type: type, title: title, desc: desc, visible: true})
            setTimeout(() => {
                this.pushRemoveAlert(id)
            }, 5000)
        },
        pushRemoveAlert: function(id) {
            for(let i=0; i<this.alerts.length; i++) {
                if(this.alerts[i].id == id) {
                    this.alerts[i].visible = false
                    setTimeout(() => {
                        this.removeAlert(id)
                    }, 400)
                    break
                }
            }
        },
        removeAlert: function(id) {
            for(let i=0; i<this.alerts.length; i++) {
                if(this.alerts[i].id == id) {
                    this.alerts.splice(i, 1)
                    break
                }
            }
        },
        selectPrice(price) {
            this.selectedPrice = price
        },
        toggleFavor() {
            this.favorChanged++;
        }
    }
}
