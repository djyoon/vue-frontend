<template>
    <div class="container">
        <announcement></announcement>

        <div class="trade-content">
            <div class="wrap">
                <div class="trading-mobile-tab">
                    <button class="trading-mobile-tab__btn" v-bind:class="{ active: currentMobileTab == 0 }" v-on:click="setMobileTab(0)">Trade</button>
                    <button class="trading-mobile-tab__btn" v-bind:class="{ active: currentMobileTab == 1 }" v-on:click="setMobileTab(1)">Market</button>
                    <button class="trading-mobile-tab__btn" v-bind:class="{ active: currentMobileTab == 2 }" v-on:click="setMobileTab(2)">Chart</button>
                </div>
            </div>

            <div class="state" v-bind:class="{'float-left': !isMobile}">
                <asset-total v-if="visibleTabMarket"
                    :usdTotal="usdTotal"
                    :btcTotal="btcTotal"
                    :isLogin="isLogin"></asset-total>

                <market-list v-if="visibleTabMarket"
                    v-on:selectMarket="selectMarket"
                    v-on:setTradeFee="setTradeFee"
                    v-on:setMinOrder="setMinOrder"
                    :market_base="market_base"
                    :market_id="market_id"
                    :refresh="market_refresh"></market-list>

                <trade-summary v-if="isMobile && visibleTabTrade"
                    :isMobile="isMobile"
                    :market_id="market_id"
                    v-on:refreshMarketList="refreshMarketList"></trade-summary>

                <order-book v-if="visibleTabTrade" :market_id="market_id"></order-book>
            </div>

            <div class="market" v-bind:class="{'float-left': !isMobile}">
                <trade-summary v-if="!isMobile"
                    :isMobile="isMobile"
                    :market_id="market_id"
                    v-on:refreshMarketList="refreshMarketList"></trade-summary>

                <trade-chart v-if="visibleTabChart"
                    :market_id="market_id"></trade-chart>

                <div class="market__bottom clearfix">
                    <market-order v-if="visibleTabTrade"
                        v-on:addAlert="addAlert"
                        :market_id="market_id"
                        :assets="myAssets"
                        :trade_fee="trade_fee"
                        :min_order="min_order"
                        :fee_discount="fee_discount"
                        :isLogin = "isLogin"
                        :isMobile="isMobile"
                        :isTablet="isTablet"></market-order>

                    <market-history v-if="visibleTabChart"
                        :market_id="market_id"></market-history>
                </div>
            </div>

            <div class="trade-bottom clearboth" v-if="visibleTabTrade">
                <my-order
                    v-on:addAlert="addAlert"
                    :market_id="market_id"
                    :isLogin = "isLogin"
                    :isMobile="isMobile"></my-order>

                <market-history v-if="isTablet"
                    :isTablet="isTablet"
                    :market_id="market_id"></market-history>
            </div>
        </div>

        <div class="alertbox">
            <transition name="alert-message" v-for="(alert, index) in alerts" :key="index">
                <div class="alert"
                    :class="{'alert--success': alert.type === 'success', 'alert--warning': alert.type === 'warning', 'alert--error': alert.type === 'error'}"
                    v-if="alert.visible">
                    <button class="alert__close" @click="pushRemoveAlert(alert.id)">닫기</button>
                    <h2 class="alert__title">{{alert.title}}</h2>
                    <p class="alert__desc">{{alert.desc}}</p>
                </div>
            </transition>
        </div>

        <div v-if="has_error">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <p class="modal__desc">
                        {{ error_common }}
                    </p>
                    <div class="modal__btnbox">
                        <button class="btn btn--confirm btn--single" @click="onErrorResponse">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./index.js"></script>

<style>
.alert-message-enter-active, .alert-message-leave-active {
  transition: opacity 0.5s;
  opacity: 1;
}
.alert-message-enter, .alert-message-leave-to {
  opacity: 0;
}
</style>
