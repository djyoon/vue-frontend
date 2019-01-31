let refreshTimer = null

export default {
    data: function() {
        return {
            history: [],
            coin_id: "",
            market_base: "",
            bef24h: 0
        }
    },
    props: [ 'market_id', 'isTablet' ],
    mounted: function() {
        this.bef24h = Date.now() / 1000 - 24 * 60 * 60

        refreshTimer = setInterval(() => this.requestHistory(), 1000)
    },
    watch: {

    },
    beforeDestroy: function () {
        if(refreshTimer)
            clearTimeout(refreshTimer)
    },
    methods: {
        requestHistory() {
            this.coin_id = this.market_id.split('_')[0]
            this.market_base = this.market_id.split('_')[1]

            this.$emit("requestToHost", "market_order", { "market_id": this.market_id, "type": "*", "from": 0, "to": 10 }, this.resultHistory)
        },
        resultHistory(data) {
            const result = data.result
            if (result.code == 1) {
                this.history = result.data.rows.map((row, index) => {
                    row.index = index
                    return row
                })
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
        }
    }
}
