import {Decimal} from 'decimal.js';

let refreshTimer = null

export default {
    data: function() {
        return {
            sell: [],
            buy: [],
            sellFull: [],
            buyFull: [],
            last: {
              "time": 0,
              "type": "buy",
              "price": "0.0",
              "quantity": "0"
            },
            mode: 0,
            group: 0,
            showDepthMenu: false,
            depth: 8,
            coin_id: "ETH",
            market_base: "BTC",
            visibleLast: false
        }
    },
    props: [ 'market_id' ],
    mounted: function() {
        this.coin_id = this.market_id.split('_')[0]
        this.market_base = this.market_id.split('_')[1]

        refreshTimer = setInterval(() => this.requestOrderBook(), 1000)
    },
    beforeDestroy: function () {
        if(refreshTimer)
            clearTimeout(refreshTimer)
    },
    watch: {
        market_id: function() {
            this.coin_id = this.market_id.split('_')[0]
        }
    },
    computed: {
        depthNumber: function() {
            return Math.pow(10, -this.depth).toFixed(this.depth)
        }
    },
    methods: {
        requestOrderBook() {
            var data = new FormData()
            data.append('market_id', this.market_id)

            this.$http.post(`${this.apiURI}order_book`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    const result = response.data.result
                    if (result.code == 1) {
                        this.buyFull = result.data.buy
                        this.sellFull = result.data.sell
                        this.last = result.data.last

                        let total = new Decimal(0)
                        this.buyFull.forEach((row) => {
                            total = total.plus(row.quantity)
                        })

                        this.buyFull.forEach((row) => {
                            row.rate = new Decimal(row.quantity).dividedBy(total).times(100).toNumber()
                        })

                        total = new Decimal(0)
                        this.sellFull.forEach((row) => {
                            total = total.plus(row.quantity)
                        })

                        this.sellFull.forEach((row) => {
                            row.rate = new Decimal(row.quantity).dividedBy(total).times(100).toNumber()
                        })

                        this.resetOrderList()
                        this.visibleLast = true
                    } else {
                        switch (result.code) {
                            case -1:
                            case -98:
                            case -99:
                            default:
                                // 오류 처리 없음
                                break
                        }
                    }
                })
                .catch(() => {
                    // 오류 처리 없음
                })
        },
        closeDepthMenu() {
            this.showDepthMenu = false
        },
        toggleDepthMenu() {
            this.showDepthMenu = !this.showDepthMenu
        },
        selectDepth(depth) {
            this.depth = depth
            this.closeDepthMenu()
        },
        selectMode(mode) {
            this.mode = mode
            this.resetOrderList()
        },
        resetOrderList() {
            const empty = {rate: "0", price: "0", quantity: "0"}
            if(this.mode == 0) {
                this.buy = [];
                for(let i=0; i<7; i++) {
                    if(i < this.buyFull.length)
                        this.buy.push(this.buyFull[i])
                    else
                        this.buy.push(empty)
                }

                this.sell = [];
                for(let i=this.sellFull.length-7; i<this.sellFull.length; i++) {
                    if(i < 0)
                        this.sell.push(empty)
                    else
                        this.sell.push(this.sellFull[i])
                }
            }
            else if(this.mode == 1) {
                this.buy = this.buyFull

                while(this.buy.length < 14) {
                    this.buy.push(empty)
                }

                if(this.buy.length > 14) {
                    this.buy.splice(14, this.buy.length - 14)
                }
            }
            else if(this.mode == 2) {
                this.sell = this.sellFull

                while(this.sell.length < 14) {
                    this.sell.splice(0, 0, empty)
                }

                if(this.sell.length > 14) {
                    this.sell.splice(0, this.sell.length - 14)
                }
            }
        }
    }
}
