import Slick from 'vue-slick'
import $ from 'jquery'
import LineChart from '../components/landing-chart'

export default {
    components: {
        Slick,
        LineChart
    },

    data: function() {
        return {
            slickOptionsBanner: {
                slidesToShow: 1,
                arrows: false,
                dots: true
            },
            slickOptionsNotice: {
                slidesToShow: 1,
                arrows: false,
                dots: false,
                autoplay: true,
                autoplaySpeed: 2000,
                speed: 1500,
            },
            slickOptionsPrice: {
                slidesToShow: 4,
                slidesToScroll: 2,
                arrows: false,
                dots: false,
            },
            market_base: 'USD',
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
            graph_market: ['BTC_USD', 'ETH_USD', 'ETH_BTC', 'ESRC_USD'],
            graph_list: [],
            datacollections: [null, null, null, null],
            graph_option: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: false
                    }],
                    yAxes: [{
                        display: false
                    }]
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    created: function() {
        this.graph_market.forEach((market_id) => {
            this.graph_list.push({
                market_id: market_id,
                coin_id: market_id.split('_')[0],
                market_base: market_id.split('_')[1],
                price_last: '0',
                price_last_usd: '0',
                change_rate: '0',
                volume_24h: '0'
            })
        })
    },
    mounted: function() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)

        this.requestMarket('USD')
        this.requestMarket('BTC')
        this.requestMarket('ETH')

        this.fillData()
    },
    beforeDestroy: function() {
        window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        next() {
            this.$refs.slick.next();
        },
        prev() {
            this.$refs.slick.prev();
        },
        reInit() {
            // Helpful if you have to deal with v-for to update dynamic lists
            this.$nextTick(() => {
                this.$refs.slick.reSlick();
            });
        },
        handleSwipe() {
            if ($('.landing__slidebox .slick-dots li').eq(0).hasClass('slick-active')) {
                $('.landing__slidebox .slick-dots').removeClass('act2 act3')
            }
            if ($('.landing__slidebox .slick-dots li').eq(1).hasClass('slick-active')) {
                $('.landing__slidebox .slick-dots').removeClass('act2 act3').addClass('act2')
            }
            if ($('.landing__slidebox .slick-dots li').eq(2).hasClass('slick-active')) {
                $('.landing__slidebox .slick-dots').removeClass('act2 act3').addClass('act3')
            }
        },
        handleResize() {
            const slidesToShow = window.innerWidth < 768 ? 2 : 4;
            if (slidesToShow != this.slickOptionsPrice.slidesToShow) {
                this.slickOptionsPrice.slidesToShow = slidesToShow;
                this.reInit();
            }
        },
        changeMarket(market) {
            this.market_base = market
            this.sortList(this.sortType, market)
        },
        toggleFavor(index) {
            const row = this.market_list[this.market_base][index]

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
        },
        setSortOrder(type) {
            this.sortType = type
            this.sortOrder[type] = this.sortOrder[type] * -1
            this.sortList(type, this.market_base)
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
            var data = new FormData()
            data.append('market_base', market)

            const landingFavor = this.$store.state.landingFavor
            const favors = landingFavor ? landingFavor.split(':') : []

            this.$http.post(`${this.apiURI}market_list`, data, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                .then((response) => {
                    const result = response.data.result
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

                            const gidx = this.graph_market.indexOf(row.market_id)
                            if (gidx >= 0) {
                                this.graph_list[gidx].price_last = row.price_last
                                this.graph_list[gidx].price_last_usd = row.price_last_usd
                                this.graph_list[gidx].change_rate = row.change_rate
                                this.graph_list[gidx].volume_24h = row.volume_24h
                            }

                            return row
                        })

                        this.sortList(this.sortType, market)
                    } else {
                        switch (result.code) {
                            case -1:
                                this.market_error[market] = 'Invaild email or email token.'
                                break
                            case -98:
                                this.market_error[market] = this.$t('common.error.blocked')
                                break
                            case -99:
                                this.market_error[market] = this.$t('common.error.system')
                                break
                            default:
                                this.market_error[market] = this.$t('common.error.unknown')
                                break
                        }
                    }
                })
                .catch(() => {
                    this.market_error[market] = this.$t('common.error.unknown')
                })
        },
        fillData() {
            for (let i = 0; i < 4; i++) {
                this.datacollections[i] = {
                    labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                    datasets: [{
                        label: 'Data One',
                        backgroundColor: '#3c3f4c',
                        data: [this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(),
                            this.getRandomInt(), this.getRandomInt(), this.getRandomInt(),
                            this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(), this.getRandomInt(),
                            this.getRandomInt(), this.getRandomInt(), this.getRandomInt()
                        ],
                        pointRadius: 0
                    }]
                }
            }
        },
        getRandomInt() {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
        },
        gotoExchange(market_id) {
            this.$store.commit("resetExchangeMarket", market_id)
            this.$router.push("/exchange?market_id=" + market_id)
        }
    }
}
