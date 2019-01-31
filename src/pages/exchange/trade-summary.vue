<template>
    <div class="market__surmary">
        <img class="icon-eth" v-if="!isLoading" v-bind:src="coin_icon">
        <div class="market__surmary-case market__surmary-lineheight float-left" v-if="!isLoading">
            <p>{{ coin_id }}/{{ market_base }}</p><span>{{ coin_name }}</span>
        </div>
        <div class="market__surmary-price market__surmary-lineheight float-left" v-if="!isLoading">
            <p>{{ price_last | numberFormat('0,000.0000') }} <em class="per">{{ change_rate > 0 ? '+' : '' }}{{ change_rate }}%</em></p>
            <span>≈ {{ price_usd | numberFormat('0,000.0000') }} USD</span>
        </div>
        <ul class="market__state float-left" v-if="!isMobile && !isLoading">
            <li class="float-left">
                <span>24h High</span>
                <p>{{ high_24h | numberFormat('0,000.0000') }}</p>
            </li>
            <li class="float-left">
                <span>24h Low</span>
                <p>{{ low_24h | numberFormat('0,000.0000') }}</p>
            </li>
            <li class="float-left">
                <span>24h Volume</span>
                <p>{{ volume_24h | numberFormat('0,000.0000') }}</p>
            </li>
        </ul>
        <button class="market-favorite" v-if="!isLoading" v-bind:class="{active: favor}" @click="toggleFavor"></button>
    </div>
</template>

<script src="./trade-summary.js"></script>
