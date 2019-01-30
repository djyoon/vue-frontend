import Vue from 'vue'
import VueRouter from 'vue-router'
import Landing from '../pages/landing.vue'
import Exchange from '../pages/exchange/index.vue'
import Login from '../pages/login.vue'
import LoginOTP from '../pages/login-otp.vue'
import Signup from '../pages/signup.vue'
import EmailAuth from '../pages/emailauth.vue'
import Account from '../pages/account.vue'
import OtpCreate from '../pages/otp-create.vue'
import OtpAuth from '../pages/otp-auth.vue'
import OtpRemove from '../pages/otp-remove.vue'
import Password from '../pages/password.vue'
import Balances from '../pages/balances/balances.vue'
import Orders from '../pages/orders/order-open.vue'
import OrderHistory from '../pages/orders/order-history.vue'
import DepositHistory from '../pages/balances/deposit_history.vue'
import WithdrawalHistory from '../pages/balances/withdrawal_history.vue'
import NotFound from '../pages/notfound.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: Landing },
        { path: '/exchange', component: Exchange },
        { path: '/login', component: Login },
        { path: '/login-otp', component: LoginOTP },
        { path: '/signup', component: Signup },
        { path: '/emailauth', component: EmailAuth },
        { path: '/otp-create', component: OtpCreate },
        { path: '/otp-auth', component: OtpAuth },
        { path: '/otp-remove', component : OtpRemove},
        { path: '/account', component: Account },
        { path: '/password', component: Password },
        { path: '/balances', component: Balances },
        { path: '/deposit_history', component: DepositHistory },
        { path: '/withdrawal_history', component: WithdrawalHistory },
        { path: '/order-open', component: Orders },
        { path: '/order-history', component: OrderHistory },
        { path: '*', component: NotFound }
    ],
    // 페이지 전환시 화면 맨위로 스크롤 이동
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
})

export default router
