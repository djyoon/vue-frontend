export default {
    data: function() {
        return {
            history: [],
            coin_id: "",
            market_base: "",
            bef24h: 0,
            max_seq: 0
        }
    },
    props: [ 'market_id', 'isTablet', 'refresh' ],
    mounted: function() {
        this.bef24h = Date.now() / 1000 - 24 * 60 * 60
    },
    watch: {
        refresh: function() {
            this.requestHistory()
        }
    },
    methods: {
        requestHistory() {
            this.coin_id = this.market_id.split('_')[0]
            this.market_base = this.market_id.split('_')[1]

            const seq = this.max_seq > 0 ? this.max_seq : '*'

            this.$emit("requestToHost", "market_order", { "market_id": this.market_id, "type": "*", "from": 0, "to": 10, "seq": seq }, this.resultHistory)
        },
        resultHistory(data) {
            const result = data.result
            if (result.code == 1) {
                const newdata = result.data.rows.map((row, index) => {
                    if(row.seq > this.max_seq) this.max_seq = row.seq
                    row.index = row.seq
                    return row
                })

                if(newdata.length > 0) this.history = newdata.concat(this.history)
                if(this.history.length > 11) this.history = this.history.slice(0, 11)
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
