import { Decimal } from 'decimal.js'

let refreshTimer = null

export default {
    data: function() {
        return {
            historyOpen: [],
            historyClose: [],
            coin_id: "",
            market_base: "",
            tab: 0,
            refresh: 0
        }
    },
    props: [ 'market_id', "isMobile", "isTablet", "isLogin" ],
    mounted: function() {
        refreshTimer = setTimeout(() => this.requestHistoryOpen(), 1000)
    },
    watch: {
        isLogin: function() {
            this.requestHistoryOpen()
        }
    },
    beforeDestroy: function () {
        if(refreshTimer)
            clearTimeout(refreshTimer)
    },
    methods: {
        requestHistoryOpen: function() {
            if(!this.isLogin) return

            this.coin_id = this.market_id.split('_')[0]
            this.market_base = this.market_id.split('_')[1]

            this.$emit("requestToHost", "account_trade",
                { "login_token": this.$store.state.loginToken, "market_id": this.market_id, "type": "*", "from": 0, "to": 9 }, this.resultHistoryOpen)
        },
        resultHistoryOpen(data) {
            const result = data.result
            if (result.code == 1) {
                this.historyOpen = result.data.rows.map((row, index) => {
                    row.index = index
                    row.unexecuted = new Decimal(row.quantity).minus(row.trade_quantity).toFixed(8)
                    return row
                })
            } else {
                switch (result.code) {
                    case -1:
                    case -97:
                    case -98:
                    case -99:
                    default:
                        // 오류 처리 안함
                        break
                }
            }

            this.refresh++
            this.requestHistoryClose()
        },
        requestHistoryClose() {
            if(!this.isLogin) return

            this.$emit("requestToHost", "account_order",
                { "login_token": this.$store.state.loginToken, "market_id": this.market_id, "type": "*", "from": 0, "to": 9 }, this.resultHistoryClose)
        },
        resultHistoryClose(data) {
            const result = data.result
            if (result.code == 1) {
                this.historyClose = result.data.rows.map((row, index) => {
                    row.index = index
                    row.canceled = false
                    return row
                })
            } else {
                switch (result.code) {
                    case -1:
                    case -97:
                    case -98:
                    case -99:
                    default:
                        // 오류 처리 안함
                        break
                }
            }

            this.refresh++
            refreshTimer = setTimeout(() => this.requestHistoryOpen(), 1000)
        },
        changeTab: function(tab) {
            this.tab = tab
        },
        gotoMore: function() {
            this.$router.push(this.tab == 0 ? "/order-open" : "/order-history")
        },
        cancelOrder: function(order) {
            order.canceled = true

            var data = new FormData()
            data.append('login_token', this.$store.state.loginToken)
            data.append('market_id', this.market_id)
            data.append('order_id', order.order_id)

            this.$http.post(`${this.apiURI}trade_cancel`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    const result = response.data.result
                    if (result.code == 1) {
                        this.addAlert("success", this.$t("exchange.cancelOrder"), this.$t("exchange.cancelOrderRequest"))
                    } else {
                        switch (result.code) {
                            case -1:
                            case -97:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("common.error.loginFailed"))
                                break
                            case -2:
                            case -3:
                            case -4:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("exchange.error.invalidParam"))
                                break
                            case -5:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("exchange.error.alreadyCancel"))
                                break
                            case -6:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("exchange.error.alreadyRequest"))
                                break
                            case -7:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("exchange.error.alreadyComplete"))
                                break
                            case -98:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("common.error.blocked"))
                                break
                            case -99:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("common.error.system"))
                                break
                            default:
                                this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("common.error.unknown"))
                                break
                        }
                    }
                })
                .catch(() => {
                  this.addAlert("error", this.$t("exchange.cancelOrder"), this.$t("common.error.unknown"))
                })
        },
        addAlert: function(type, title, desc) {
            this.$emit("addAlert", type, title, desc)
        }
    }
}
