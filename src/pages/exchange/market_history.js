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

            var data = new FormData()
            data.append('market_id', this.market_id)
            data.append('type', '*')
            data.append('from', 0)
            data.append('to', 10)

            this.$http.post(`${this.apiURI}market_order`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    const result = response.data.result
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
                })
                .catch(() => {
                    // 오류 처리 안함
                })
        }
    }
}
