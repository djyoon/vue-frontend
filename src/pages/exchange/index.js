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
            myOrderRefresh: 0,
            tradeHistoryRefresh: 0,
            realMobile: false,

            // Error
            has_error: false,
            error_common: '',
            error_link: '',

            // Alert
            alerts: [],
            alertCounter: 0,

            // WebSockte
            websocketConnected: false,
            messagePool: {},
            max_request_id: 0,
            websocketSupport: false
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
        const filter = "windows phone|android|iPad|iPhone|iPod"
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if(userAgent)
           this.realMobile = filter.indexOf( userAgent.toLowerCase() ) >= 0

        if (window.ActiveXObject || !('ActiveXObject' in window)) {
            this.websocketSupport = true
        }

        this.resetMarket()
    },
    mounted: function() {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)

        if (this.websocketSupport) {
            this.websocketConnected = false
            this.$options.sockets.onmessage = (ev) => this.websocketMessage(ev)
            this.$options.sockets.onopen = () => this.websocketOpen()
            this.$options.sockets.onclose = () => this.websocketClose()
            this.$connect()
        }

        this.reloadAccountInfo()
    },
    beforeDestroy: function() {
        if(this.websocketSupport) {
            this.$disconnect()
            delete this.$options.sockets.onmessage
            delete this.$options.sockets.onopen
            delete this.$options.sockets.onclose
        }

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
        // 서버측에 전송할 메시지를 배열에 넣는다.
        requestToHost: function(command, params, callback) {
            if(this.websocketSupport) {
                this.max_request_id++
                this.messagePool[this.max_request_id] = {command: command, params: params, callback: callback, sent: false}

                this.websocketPopSend()
            }
            else {
                let data = new FormData();
                Object.keys(params).forEach((key) => {
                    data.append(key, params[key])
                })

                this.$http.post(`${this.apiURI}` + command, data,
                  { headers: { 'Content-Type': 'text/plain' }})
                .then((response) => {
                    const result = response.data
                    callback(result)
                })
                .catch(() => {

                })
            }
        },
        // 전송할 메시지를 꺼내서 서버로 전송한다.
        websocketPopSend: function() {
            const request_ids = Object.keys(this.messagePool)

            if(this.websocketConnected && request_ids.length > 0) {
                request_ids.forEach((request_id) => {
                    const msg = this.messagePool[request_id]
                    if(!msg.sent) {
                        const sendMsg = { "command": msg.command, "params": msg.params, "request_id": request_id }
                        this.$socket.send(JSON.stringify(sendMsg))
                        msg.sent = true
                    }
                })
            }
        },
        websocketMessage: function(ev) {
            const data = JSON.parse(ev.data)
            const request_id = data.result.request_id
            if(request_id in this.messagePool) {
                this.messagePool[request_id].callback(data)
                delete this.messagePool[request_id]
            }
        },
        websocketOpen: function() {
            this.websocketConnected = true
            this.websocketPopSend()
        },
        websocketClose: function() {
            this.websocketConnected = false
            setTimeout(() => this.$connect(), 1000)
        },
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
            const params = { "login_token": this.$store.state.loginToken }
            this.requestToHost("account_info", params, this.resultAccountInfo)
            this.api_calling = true
        },
        resultAccountInfo: function(data) {
            this.api_calling = false
            const result = data.result
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
        },
        reloadAccountBalance: function() {
            const params = { "login_token": this.$store.state.loginToken }
            this.requestToHost("account_balance", params, this.resultAccountBalance)
            this.api_calling = true
        },
        resultAccountBalance: function(data) {
            this.api_calling = false
            const result = data.result
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
        },
        reloadMyOrder() {
            this.myOrderRefresh++;
        },
        reloadTradeHistory() {
            this.tradeHistoryRefresh++;
        }
    }
}
