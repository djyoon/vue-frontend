<template>
    <div class="state__assets" :class="{not__oauth: !isLogin}">
        <h2 class="state__assets-title" v-if="isLogin">
            Assets <span>Total</span>
        </h2>
        <p class="state__assets-value" v-if="isLogin">
            {{ btcTotal | numberFormat('0,000.0000') }} BTC
            <span>≈ {{ usdTotal | numberFormat('0,000.00') }} USD</span>
        </p>
        <router-link to="/balances" class="state__wallet" v-if="isLogin">Wallet</router-link>

        <span v-if="!isLogin">
            <router-link to="/login" class="textbutton">Login</router-link> or <router-link to="/signup" class="textbutton">Sign Up</router-link> and start trading
        </span>
    </div>
</template>

<script src="./asset-total.js"></script>
