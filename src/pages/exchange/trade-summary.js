import coinImages from "../../components/coin-icons.js"

export default {
    data: function() {
        return {
            isLoading: true,
            coin_id: "ETH",
            coin_name: "Ethereum",
            price_last: "3.20000000",
            price_change: "3.20000000",
            change_rate: "100.00",
            high_24h: "3.20000000",
            low_24h: "3.10000000",
            volume_24h: "431.00000000",
            price_usd: "4028.4800",
            coin_icon: coinImages["USD"],
            favor: false
        }
    },
    props: ['isMobile', 'market_id', 'favorChanged'],
    mounted: function() {
        this.requestMarket()
    },
    watch: {
        favorChanged: function() {
            this.refreshFavor()
        }
    },
    computed: {

    },
    methods: {
        requestMarket: function() {
            this.$emit("requestToHost", "market_info", { "market_id": this.market_id }, this.ressultMarket)
        },
        ressultMarket: function(data) {
            const landingFavor = this.$store.state.landingFavor
            const favors = landingFavor ? landingFavor.split(':') : []

            const result = data.result
            if (result.code == 1) {
                const row = result.data

                this.coin_id = row.coin_id
                this.market_base = row.market_base
                this.coin_name = row.coin_name
                this.price_change = row.price_change
                this.change_rate = row.change_rate
                this.volume_24h = row.volume_24h
                this.price_usd = row.price_usd
                this.price_last = row.price_last
                this.high_24h = row.high_24h
                this.low_24h = row.low_24h

                this.coin_icon = this.isMobile ? coinImages.big[row.coin_id] : coinImages.normal[row.coin_id]

                if (favors.indexOf(this.market_id) >= 0) {
                    this.favor = true
                }

                this.isLoading = false;
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
        refreshFavor: function() {
          let landingFavor = this.$store.state.landingFavor
          let favors = landingFavor ? landingFavor.split(':') : []
          const n = favors.indexOf(this.market_id)

          this.favor = n >= 0
        },
        toggleFavor: function() {
            let landingFavor = this.$store.state.landingFavor
            let favors = landingFavor ? landingFavor.split(':') : []
            const n = favors.indexOf(this.market_id)

            this.favor = !this.favor

            if (!this.favor && n >= 0) favors.splice(n, 1)
            else if (this.favor && n < 0) favors.push(this.market_id)

            landingFavor = favors.join(':')
            this.$store.commit('resetLandingFavor', landingFavor)

            this.$emit('refreshMarketList')
        }
    }
}
