import { mixin as onClickOutside } from 'vue-on-click-outside'
import {Decimal} from 'decimal.js'
import numeral from 'numeral'

let refreshTimer = null

export default {
    mixins: [onClickOutside],
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
              "quantity": "0",
              "trade_count": "0"
            },
            mode: 0,
            group: 0,
            showGroupMenu: false,
            coin_id: "ETH",
            market_base: "BTC",
            visibleLast: false,
            priceGroup: ["0.00000001", "0.0000001", "0.000001", "0.00001", "0.0001", "0.001", "0.01", "0.1"],
            groupFormat: "0.00000001"
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
        },
        group: function() {
            this.groupFormat = this.priceGroup[this.group]
        },
    },
    filters : {
      formatPrice : function(value, format = "0.0") {
          if(value == 0)
              return '-'
          else
              return numeral(value).format(format)
      }
    },
    methods: {
        requestOrderBook() {
            this.$emit("requestToHost", "order_book", { 'market_id': this.market_id, 'group': this.group }, this.resultOrderBook)
        },
        resultOrderBook(data) {
            const result = data.result
            if (result.code == 1) {
                this.buyFull = result.data.buy
                this.sellFull = result.data.sell

                if(this.last.trade_count != result.data.last.trade_count)
                    this.$emit("reloadTradeHistory")

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
        },
        closeGroupMenu() {
            this.showGroupMenu = false
        },
        toggleGroupMenu() {
            this.showGroupMenu = !this.showGroupMenu
        },
        selectGroup(group) {
            this.group = group
            this.closeGroupMenu()
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
        },
        selectPrice(row) {
          this.$emit("selectPrice", new Decimal(row.price).toString())
        }
    }
}
