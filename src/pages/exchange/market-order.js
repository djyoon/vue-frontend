import {Decimal} from 'decimal.js';

const amountRate = [0.1, 0.25, 0.5, 0.75, 1]

export default {
    data: function() {
        return {
            error_message: '',
            coin: { coin_id: "BTC", balance: "0", price_usd: "1" },
            base: { coin_id: "BTC", balance: "0", price_usd: "1" },
            buy: { price: "0", amount: "0" },
            sell: { price: "0", amount: "0" },
            tradeTab: 0
        }
    },
    props: [ 'market_id', 'assets', 'trade_fee', 'isMobile', 'isTablet', 'min_order', 'fee_discount', "isLogin", "selectedPrice" ],
    mounted: function() {
        this.resetMarket()
    },
    watch: {
        market_id: function() {
            this.resetMarket()
        },
        assets: function() {
            this.resetBalance()
        },
        selectedPrice: function() {
            this.buy.price = this.selectedPrice
            this.sell.price = this.selectedPrice
        }
    },
    computed: {
        buyTotal: function() {
            return new Decimal(this.buy.price).times(this.buy.amount).toFixed(8)
        },
        buyFee: function() {
            return new Decimal(this.trade_fee).times("0.01").times(this.buy.amount).toFixed(8)
        },
        buyPriceUsd: function() {
            return new Decimal(this.buy.price).times(this.base.price_usd).toFixed(4)
        },
        sellTotal: function() {
            return new Decimal(this.sell.price).times(this.sell.amount).toFixed(8)
        },
        sellFee: function() {
            return new Decimal(this.trade_fee).times("0.01").times(this.sell.amount).toFixed(8)
        },
        sellPriceUsd: function() {
            return new Decimal(this.sell.price).times(this.base.price_usd).toFixed(4)
        },
        realFeeRate: function() {
            return new Decimal(this.trade_fee).times(new Decimal(1).minus(new Decimal(this.fee_discount).times(0.01))).toString()
        },
        buttonSell: function() {
            if(this.isLogin)
                return this.$t('exchange.sell').replace("{coin}", this.coin.coin_id)
            else
                return this.$t('exchange.loginSell')
        },
        buttonBuy: function() {
            if(this.isLogin)
                return this.$t('exchange.buy').replace("{coin}", this.coin.coin_id)
            else
                return this.$t('exchange.loginBuy')
        }
    },
    methods: {
        resetMarket: function() {
            this.coin.coin_id = this.market_id.split('_')[0]
            this.base.coin_id = this.market_id.split('_')[1]
            this.resetBalance()
        },
        resetBalance: function() {
            this.assets.forEach((row) => {
                if(row.coin_id === this.coin.coin_id) this.coin = row
                if(row.coin_id === this.base.coin_id) this.base = row
            })
        },
        selectTab: function(index) {
            this.tradeTab = index
        },
        setBuyRate: function(index) {
            if(new Decimal(this.buy.price).comparedTo(0) > 0)
                this.buy.amount = new Decimal(this.base.balance).dividedBy(this.buy.price).times(amountRate[index]).toString()
        },
        setSellRate: function(index) {
            this.sell.amount = new Decimal(this.coin.balance).times(amountRate[index]).toString()
        },
        orderBuy: function() {
            if(this.isLogin) {
                const balance = new Decimal(this.base.balance)
                const price = new Decimal(this.buy.price)
                const amount = new Decimal(this.buy.amount)
                const total = amount.times(price)

                if(price.comparedTo(0) == 0 || amount.comparedTo(0) == 0) {
                    this.addAlert("warning", this.buttonBuy, this.$t("exchange.enterValue"))
                    return;
                }

                if(total.comparedTo(balance) > 0) {
                    this.addAlert("warning", this.buttonBuy, this.$t("exchange.notEnough"))
                    return;
                }

                if(amount.comparedTo(this.min_order) < 0) {
                    this.addAlert("warning", this.buttonBuy, this.$t("exchange.minOrder"))
                    return;
                }

                this.requestOrder("buy", price.toString(), amount.toString())
            }
            else {
                this.$router.push("/login")
            }
        },
        orderSell: function() {
            if(this.isLogin) {
                const balance = new Decimal(this.coin.balance)
                const price = new Decimal(this.sell.price)
                const amount = new Decimal(this.sell.amount)

                if(price.comparedTo(0) == 0 || amount.comparedTo(0) == 0) {
                    this.addAlert("warning", this.buttonSell, this.$t("exchange.enterValue"))
                    return;
                }

                if(amount.comparedTo(balance) > 0) {
                    this.addAlert("warning", this.buttonSell, this.$t("exchange.notEnough"))
                    return;
                }

                if(amount.comparedTo(this.min_order) < 0) {
                    this.addAlert("warning", this.buttonSell, this.$t("exchange.minOrder"))
                    return;
                }

                this.requestOrder("sell", price.toString(), amount.toString())
            }
            else {
                this.$router.push("/login")
            }
        },
        requestOrder: function(type, price, quantity) {
            var data = new FormData()
            data.append('login_token', this.$store.state.loginToken)
            data.append('market_id', this.market_id)
            data.append('type', type)
            data.append('price', price)
            data.append('quantity', quantity)

            this.$http.post(`${this.apiURI}trade_limit`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    const result = response.data.result
                    if (result.code == 1) {
                        this.addAlert("success", type === "buy" ? this.buttonBuy : this.buttonSell, this.$t("exchange.orderComplete"))

                        if(type === "buy") {
                            this.buy.price = "0"
                            this.buy.amount = "0"
                        }
                        else {
                            this.sell.price = "0"
                            this.sell.amount = "0"
                        }
                    } else {
                        switch (result.code) {
                            case -1:
                            case -97:
                                // 로그인 안됨
                                this.$store.commit('logout')
                                this.isLogin = false
                                break
                            case -6:
                                this.addAlert("warning", this.buttonSell, this.$t("exchange.minOrder"))
                                break
                            case -7:
                                this.addAlert("warning", this.buttonSell, this.$t("exchange.notEnough"))
                                break
                            default:
                                // 오류 처리 안함
                                break
                        }
                    }
                })
                .catch(() => {
                    // 오류 처리 안함
                })
        },
        addAlert: function(type, title, desc) {
            this.$emit("addAlert", type, title, desc)
        }
    }
}
