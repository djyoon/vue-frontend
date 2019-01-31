export default {
    data: function() {
        return {
            market_list: {
                'USD': [],
                'BTC': [],
                'ETH': [],
                favor: []
            },
            market_error: {
                'USD': '',
                'BTC': '',
                'ETH': '',
                favor: ''
            },
            sortType: 'pairs',
            sortOrder: {
                'pairs': -1,
                'price': -1,
                'change': -1,
                'volume': -1
            },
            cur_market_base: 'USD'
        }
    },
    props: [ 'market_base', 'refresh', 'market_id' ],
    mounted: function() {
        this.cur_market_base = this.market_base
        this.requestMarket('USD')
        this.requestMarket('BTC')
        this.requestMarket('ETH')
    },
    watch: {
        refresh: function() {
            this.market_list.favor = []
            this.requestMarket('USD')
            this.requestMarket('BTC')
            this.requestMarket('ETH')
        }
    },
    methods: {
        changeMarket(market) {
            this.cur_market_base = market
            this.sortList(this.sortType, market)
        },
        toggleFavor(index) {
            const row = this.market_list[this.cur_market_base][index]

            row.favor = !row.favor

            if (row.favor)
                this.market_list.favor.push(row)
            else {
                const n = this.market_list.favor.indexOf(row)
                this.market_list.favor.splice(n, 1)
            }

            const items = this.market_list.favor.map((row) => {
                return row.market_id
            })

            this.$store.commit('resetLandingFavor', items.join(':'))
            this.$emit('toggleFavor')
        },
        setSortOrder(type) {
            this.sortType = type
            this.sortOrder[type] = this.sortOrder[type] * -1
            this.sortList(type, this.cur_market_base)
        },
        sortList(type, market) {
            this.market_list[market] = this.market_list[market].sort(
                (a, b) => {
                    const order = this.sortOrder[type]
                    if (type === 'pairs') {
                        if (a.coin_id.localeCompare(b.coin_id) < 0) return order
                        else if (a.coin_id.localeCompare(b.coin_id) > 0) return order * -1
                        else return 0
                    } else if (type === 'change') {
                        if (a.price_change < b.price_change) return order
                        else if (a.price_change > b.price_change) return order * -1
                        else return 0
                    } else if (type === 'price') {
                        if (a.price_last < b.price_last) return order
                        else if (a.price_last > b.price_last) return order * -1
                        else return 0
                    } else if (type === 'volume') {
                        if (a.volume_24h < b.volume_24h) return order
                        else if (a.volume_24h > b.volume_24h) return order * -1
                        else return 0
                    }
                }
            )
        },
        requestMarket(market) {
            this.$emit("requestToHost", "market_list", { 'market_base': market }, this.resultMarket)
        },
        resultMarket(data) {
            const landingFavor = this.$store.state.landingFavor
            const favors = landingFavor ? landingFavor.split(':') : []

            const result = data.result
            const market = result.data.market_base

            if (result.code == 1) {
                this.market_list[market] = result.data.rows.map((row, index) => {
                    row.price_last_usd = row.price_last * result.data.price_usd
                    row.high_24h_usd = row.high_24h * result.data.price_usd
                    row.low_24h_usd = row.low_24h * result.data.price_usd
                    row.market_base = market
                    row.favor = false
                    row.index = index

                    if (favors.indexOf(row.market_id) >= 0) {
                        row.favor = true
                        this.market_list.favor.push(row)
                    }

                    if(row.market_id === this.market_id) {
                        this.$emit("setTradeFee", row.trade_fee)
                        this.$emit("setMinOrder", row.min_order)
                    }

                    return row
                })
                this.sortList(this.sortType, market)
            } else {
                switch (result.code) {
                    case -1:
                    case -98:
                    case -99:
                    default:
                        // 오류 처리 안함
                        break
                }
            }
        },
        selectMarket(market) {
            this.$emit("selectMarket", market)
        }
    }
}
