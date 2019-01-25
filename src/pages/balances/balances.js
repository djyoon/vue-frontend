import {Decimal} from 'decimal.js';
import coinImages from "../../components/coin-icons.js"
import common from "../../components/common.js"
import OtpAuth from '../otp-auth.vue'


export default {
    data: function () {
        return {

            visibleDeposit: false,
            visibleAddress: false,
            visibleWithdraw: false,
            visibleOtpAuth : false,
            visibleSuccess : false,
            visibleProcess : false,

            isChecked: false,
            isMobile: false,
            isTablet: false,
            api_calling : false,
            checkShowAddress: false,
            checkHideZero: false,
            visibleSideMenu: false,

            memLevel : 0,

            coin_id: '',
            coin_name: '',
            address : '',
            usdTotal : 0,
            otp_number : '',
            qr_code : '',

            //출금
            to_address : '',
            receive_amount : '',
            min_withdraw : 0,
            withdrawal_amount : 0,
            withdraw_fee : 0,
            onetime_limit : 0,
            price_usd : 0,
            withdraw_max_crypto: 0,
            balance: 0,

            coin_list: [],
            // Error
            has_error: false,
            error_common: '',
            error_link: '',
            error_otp : '',
            error_address : '',
            error_withdraw : '',

            //Sort
            sortType: 'coin_id',
            sortOrder: {
                'volume': -1,
                'coin_id': -1,
            }
        }
    },
    components : {
        OtpAuth
    },
    filters : {
      decimalToString : function(value) {
          if(common.isEmpty(value)){
              return '0,000.00000000'
          } else {
              return value.toString()
          }
      }
    },
    mounted: function () {
        this.handleResize()
        window.addEventListener('resize', this.handleResize)

        this.requestBalance()
    },
    watch: {
        to_address : function(){
            let value = this.to_address
            if(!common.isEmpty(value)){
                if(this.validationCheck(this.to_address, this.coin_id)){
                    this.error_address = ''
                } else {
                    this.error_address = this.$t('wallet.error.invalidAddress')
                }
            }
        },
        withdrawal_amount : function() {
            let amount = new Decimal(this.withdrawal_amount).times(this.price_usd)
            if(!common.isEmpty(amount)){
                if(amount.comparedTo(this.min_withdraw.times(this.price_usd)) < 0) {
                    this.error_withdraw = this.$t('wallet.error.checkMinWithdraw')
                } else if(this.balance.comparedTo(this.withdrawal_amount) < 0) {
                    this.error_withdraw = this.$t('wallet.error.noavailable')
                } else if(amount.comparedTo(this.withdraw_max_crypto) > 0) {
                    this.error_withdraw = this.$t('wallet.error.onetimeMax')
                } else {
                    this.error_withdraw = ''
                    this.receive_amount = Decimal.sub(this.withdrawal_amount, this.withdraw_fee)
                }
            }
        },
        checkHideZero: function() {
            this.requestBalance()
        }
    },
    methods: {
        showDeposit: function (coin_id, coin_name, address) {

            this.coin_id = coin_id
            this.coin_name = coin_name
            this.address = address

            this.checkShowAddress = false
            this.visibleDeposit = true
        },
        hideDeposit: function () {
            this.visibleDeposit = false
        },
        showAddress: function () {
            if (!this.checkShowAddress) {
                return
            }
            this.qr_code = ''
            this.visibleDeposit = false
            this.visibleAddress = true

            if(common.isEmpty(this.address)){
                this.requestAddress()
            } else {
                this.requestQrCode(this.address)
            }


        },
        hideAddress: function () {
            this.requestBalance()
            this.visibleAddress = false
        },
        showWithdraw: function (coin_id, limit, fee, usd, balance) {

            this.to_address = ''
            this.withdrawal_amount = 0
            this.error_address = ''
            this.error_withdraw = ''
            this.receive_amount = 0

            this.coin_id = coin_id
            this.min_withdraw = limit
            this.withdraw_fee = fee
            this.price_usd = usd
            this.balance = balance
            // 1회출금제한
            this.onetime_limit = new Decimal(this.withdraw_max_crypto).dividedBy(this.price_usd)
            this.visibleWithdraw = true
        },
        hideWithdraw: function () {
            this.visibleWithdraw = false
        },
        hideSuccess : function(){
            this.visibleProcess = false
            this.visibleSuccess = false
        },
        requestBalance: function () {

            var data = new FormData()
            data.append('login_token', this.$store.state.loginToken)

            this.api_calling = true

            this.$http.post(`${this.apiURI}account_balance`, data,
                {headers: {'Content-Type': 'text/plain'}})
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result

                    if (result.code == 1) {
                        this.withdraw_max_crypto = result.data.withdraw_max_crypto

                        let usdTotal = new Decimal(0)
                        this.coin_list = []
                        result.data.rows.forEach((row, index) => {
                            row.index = index
                            row.coin_icon = this.isMobile ? coinImages.big[row.coin_id] : coinImages.normal[row.coin_id]
                            row.frozen = new Decimal(row.holding)
                            row.available = new Decimal(row.balance)

                            row.min_withdraw = new Decimal(row.min_withdraw)
                            row.withdraw_fee = new Decimal(row.withdraw_fee)
                            row.volume = Decimal.add(row.available, row.frozen)
                            row.volume_usd = row.volume.times(row.price_usd)
                            this.price_usd = row.price_usd
                            usdTotal = usdTotal.plus(row.volume_usd)
                            row.selected = false

                            if(!this.checkHideZero || row.volume.comparedTo(0) > 0)
                                this.coin_list.push(row)
                        })

                        this.usdTotal = usdTotal.toFixed(8)
                    }
                    else {
                        switch (result.code) {
                            case -1:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true);
                                break
                            case -97:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true);
                                break
                            case -98:
                                this.popupError(this.$t('account.error.blocked'), '/login', true);
                                break
                            case -99:
                                this.popupError(this.$t('common.error.system'), '', false);
                                break
                            default:
                                this.popupError(this.$t('common.error.unknown'), '', false);
                                break
                        }
                    }
                })
                .catch(() => {
                    this.popupError(this.$t('common.error.unknown'), '', false)
                    this.api_calling = false
                })

        },
        otpAuthCheck : function() {

            this.memLevel = this.$store.state.memLevel

            if(!common.isEmpty(this.to_address)
                && !common.isEmpty(this.withdrawal_amount)
                && this.error_address.length <= 0
                && this.error_withdraw.length <= 0){
                if(this.memLevel >= 2) {
                    this.visibleWithdraw = false
                    this.visibleOtpAuth = true
                } else {
                    this.requestWithdraw()
                }
            }
        },
        requestWithdraw : function () {
            if(common.isEmpty(this.to_address)
                || common.isEmpty(this.withdrawal_amount)
                || this.error_address.length > 0
                || this.error_withdraw.length > 0){
                this.visibleWithdraw = true
                return
            }

            var data = new FormData()

            data.append('login_token', this.$store.state.loginToken)
            data.append('address', this.to_address)
            data.append('quantity', this.withdrawal_amount)
            data.append('coin_id',this.coin_id)
            data.append('locale', 'en')
            data.append('otp_number', this.otp_number)

            this.api_calling = true
            this.visibleProcess = true

            this.$http.post(`${this.apiURI}account_withdraw`, data,
                { headers: { 'Content-Type': 'text/plain' }})
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result

                    if(result.code == 1) {
                        this.visibleSuccess = true
                        this.visibleProcess = false
                        this.visibleWithdraw = false
                    }
                    else {
                        this.visibleProcess = false
                        this.visibleSuccess = false
                        switch(result.code) {
                            case -1:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true)
                                break
                            case -2:
                                this.popupError(this.$t('wallet.error.duplicatedCoin'), '', false)
                                break
                            case -3:
                                this.popupError(this.$t('wallet.error.invalidAddress'), '', false)
                                break
                            case -4:
                                this.popupError(this.$t('wallet.error.errorQuantity'), '', false)
                                break
                            case -5:
                                this.popupError(this.$t('wallet.error.errorMinQuantity'), '', false)
                                break
                            case -6:
                                this.popupError(this.$t('wallet.error.onetimeMax'), '', false)
                                break
                            case -7:
                                this.popupError(this.$t('wallet.error.noavailable'), '', false)
                                break
                            case -8:
                                this.popupError(this.$t('wallet.error.dayMax'), '', false)
                                break
                            case -9:
                                this.popupError(this.$t('wallet.error.errorEmail'), '', false)
                                break
                            case -10:
                                this.popupError(this.$t('wallet.error.invalidOtp'), '', false)
                                break
                            case -97:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true)
                                break
                            case -98:
                                this.popupError(this.$t('account.error.blocked'), '/login', true)
                                break
                            case -99:
                                this.popupError(this.$t('common.error.system'), '', false)
                                break
                            default:
                                this.popupError(this.$t('common.error.unknown'), '', false)
                                break
                        }
                    }
                })
                .catch(() => {
                    this.popupError(this.$t('common.error.unknown'), '', false)
                    this.api_calling = false
                })
        },
        requestAddress: function () {

            var data = new FormData()

            data.append('login_token', this.$store.state.loginToken)
            data.append('locale', 'en')
            data.append('coin_id', this.coin_id)

            this.api_calling = true

            this.$http.post(`${this.apiURI}wallet_generate`, data,
                { headers: { 'Content-Type': 'text/plain' }})
                .then((response) => {
                    this.api_calling = false
                    const result = response.data.result

                    if(result.code == 1) {
                        this.address = result.data.address
                        this.requestQrCode(this.address)
                        this.visibleAddress = true
                    }
                    else {
                        switch(result.code) {
                            case -1:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true)
                                break
                            case -2:
                                this.popupError(this.$t('account.error.invalidCoin'), '', false)
                                break
                            case -3:
                                this.popupError(this.$t('account.error.duplicatedCoin'), '', false)
                                break
                            case -97:
                                this.popupError(this.$t('account.error.loginFailed'), '/login', true)
                                break
                            case -98:
                                this.popupError(this.$t('account.error.blocked'), '/login', true)
                                break
                            case -99:
                                this.popupError(this.$t('common.error.system'), '', false)
                                break
                            default:
                                this.popupError(this.$t('common.error.unknown'), '', false)
                                break
                        }
                    }
                })
                .catch(() => {
                    this.popupError(this.$t('common.error.unknown'), '', false)
                    this.api_calling = false
                })
        },
        requestQrCode : function(address) {
            this.qr_code = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl="+address
        },
        handleResize() {
            this.isMobile = window.innerWidth < 768
            this.isTablet = window.innerWidth < 1025
        },
        toggleSideMenu() {
            this.visibleSideMenu = !this.visibleSideMenu;
        },
        popupError(message, link, logout) {
            this.has_error = true
            this.error_common = message
            this.error_link = link

            if(logout) {
                this.$store.commit('logout')
            }
        },
        onErrorResponse() {
            this.has_error = false
            this.error_common = ''

            if(this.error_link.length > 0) {
                this.$router.push(this.error_link)
            }
        },
        onCopyToClipboard: function() {

        },
        onErrorClipboard: function() {

        },
        setSortOrder(type) {
            this.sortType = type
            this.sortOrder[type] = this.sortOrder[type] * -1
            this.sortList(type)
        },
        enterOtp: function(otp_number) {
            if(!common.isEmpty(otp_number)){
                this.otp_number = otp_number
                this.visibleOtpAuth = false
                this.requestWithdraw()
            }
        },
        hideOtp: function() {
            this.visibleOtpAuth = false
        },
        sortList(type) {
            this.coin_list = this.coin_list.sort(
                (a, b) => {
                    const order = this.sortOrder[type]
                    if (type === 'coin_id') {
                        if (a.coin_id.localeCompare(b.coin_id) < 0) return order
                        else if (a.coin_id.localeCompare(b.coin_id) > 0) return order * -1
                        else return 0
                    } else if (type === 'volume') {
                        if (a.volume < b.volume) return order
                        else if (a.volume > b.volume) return order * -1
                        else return 0
                    }
                }
            )
        },
        validationCheck(address, coinid){
            let reg = ''
            if( ( coinid == "ETH" || coinid == "CFX" )){
                reg = /^0x[0-9a-f]/i
            } else if( coinid == "BTC" || coinid == "ESRC" ){
                reg = /[0-9a-z]/i
            }

            return address.match(reg)
        }
    },
    beforeDestroy: function () {
        window.removeEventListener('resize', this.handleResize)
    }
}
