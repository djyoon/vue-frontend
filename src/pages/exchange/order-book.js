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
            market_base: "BTC"
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
                        this.resetOrderList()
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
            if(this.mode == 0) {
                this.buy = [];
                for(let i=0; i<this.buyFull.length; i++) {
                    this.buy.push(this.buyFull[i])
                    if(i >= 4) break;
                }

                this.sell = [];
                for(let i=this.sellFull.length-5; i<this.sellFull.length; i++) {
                    if(i < 0)
                        this.sell.push({price: "0", quantity: "0"})
                    else
                        this.sell.push(this.sellFull[i])
                }
            }
            else if(this.mode == 1) {
                this.buy = this.buyFull
            }
            else if(this.mode == 2) {
                this.sell = this.sellFull

                while(this.sell.length < 9) {
                    this.sell.splice(0, 0, {price: "0.00000000", quantity: "0.00000000"})
                }

                if(this.sell.length > 9) {
                    this.sell.splice(0, this.sell.length - 9)
                }
            }
        }
    }
}
