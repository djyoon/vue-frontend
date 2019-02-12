<template>
    <div class="market__order float-left">
        <div class="market__order-header">
            <button class="market__order-tab-btn active">Limit Order</button>
            <button class="market__order-tab-btn">Market Order</button>
            <div class="float-right market__order-fee">
                Fee <span>{{ realFeeRate }} %</span>
            </div>
        </div>
        <div class="market__order-body clearfix">
            <div class="mobile-market__order-form-tabbox clearfix">
                <button class="buy" :class="{active: tradeTab == 0}" @click="selectTab(0)">BUY</button>
                <button class="sell" :class="{active: tradeTab == 1}" @click="selectTab(1)">SELL</button>
            </div>
            <div class="market__order-form market__order-form-buy float-left" v-if="(!isMobile && !isTablet) || tradeTab == 0">
                <div class="market__order-form-top clearfix">
                    Available {{ base.balance }} {{ base.coin_id }}
                    <router-link to="/balances" class="float-right">Deposit</router-link>
                </div>
                <div class="market__order-formzone">
                    <form action="">
                        <div class="market__order-formbox">
                            <div class="market__order-form-inputbox">
                                <span class="market__order-form-unit market__order-form-unit--left">Price</span>
                                <input type="text" class="market__order-form-input" v-model="buy.price">
                                <span class="market__order-form-unit market__order-form-unit--right">{{ base.coin_id }}</span>
                            </div>
                            <p class="market__order-form-helptext">≈ {{ buyPriceUsd }} USD</p>
                        </div>
                        <div class="market__order-formbox">
                            <div class="market__order-form-inputbox">
                                <span class="market__order-form-unit market__order-form-unit--left">Amount</span>
                                <input type="text" class="market__order-form-input" v-model="buy.amount">
                                <span class="market__order-form-unit market__order-form-unit--right">{{ coin.coin_id }}</span>
                            </div>
                            <div class="market__order-form-btnbox clearfix">
                                <button class="float-left market__order-set" type="button" @click="setBuyRate(0)">10%</button>
                                <button class="float-left market__order-set" type="button" @click="setBuyRate(1)">25%</button>
                                <button class="float-left market__order-set" type="button" @click="setBuyRate(2)">50%</button>
                                <button class="float-left market__order-set" type="button" @click="setBuyRate(3)">75%</button>
                                <button class="float-left market__order-set" type="button" @click="setBuyRate(4)">MAX</button>
                            </div>
                        </div>

                        <ul class="market__order-total">
                            <li>
                                Fee
                                <p class="float-right">{{ buyFee }} <span>{{ coin.coin_id }}</span></p>
                            </li>
                            <li>
                                Total
                                <p class="float-right">{{ buyTotal }} <span>{{ base.coin_id }}</span></p>
                            </li>
                        </ul>

                        <button class="market__order-form-submit" type="button" @click="orderBuy">
                            {{ buttonBuy }}
                        </button>
                    </form>
                </div>
            </div>
            <div class="market__order-form market__order-form-sell float-left" v-if="(!isMobile && !isTablet) || tradeTab == 1">
                <div class="market__order-form-top clearfix">
                    Available {{ coin.balance }} {{ coin.coin_id }}
                    <router-link to="/balances" class="float-right">Deposit</router-link>
                </div>
                <div class="market__order-formzone">
                    <form action="">
                        <div class="market__order-formbox">
                            <div class="market__order-form-inputbox">
                                <span class="market__order-form-unit market__order-form-unit--left">Price</span>
                                <input type="text" class="market__order-form-input" v-model="sell.price">
                                <span class="market__order-form-unit market__order-form-unit--right">{{ base.coin_id }}</span>
                            </div>
                            <p class="market__order-form-helptext">≈ {{ sellPriceUsd }} USD</p>
                        </div>
                        <div class="market__order-formbox">
                            <div class="market__order-form-inputbox">
                                <span class="market__order-form-unit market__order-form-unit--left">Amount</span>
                                <input type="text" class="market__order-form-input" v-model="sell.amount">
                                <span class="market__order-form-unit market__order-form-unit--right">{{ coin.coin_id }}</span>
                            </div>
                            <div class="market__order-form-btnbox clearfix">
                                <button class="float-left market__order-set" type="button" @click="setSellRate(0)">10%</button>
                                <button class="float-left market__order-set" type="button" @click="setSellRate(1)">25%</button>
                                <button class="float-left market__order-set" type="button" @click="setSellRate(2)">50%</button>
                                <button class="float-left market__order-set" type="button" @click="setSellRate(3)">75%</button>
                                <button class="float-left market__order-set" type="button" @click="setSellRate(4)">MAX</button>
                            </div>
                        </div>

                        <ul class="market__order-total">
                            <li>
                                Fee
                                <p class="float-right">{{ sellFee }} <span>{{ coin.coin_id }}</span></p>
                            </li>
                            <li>
                                Total
                                <p class="float-right">{{ sellTotal }} <span>{{ base.coin_id }}</span></p>
                            </li>
                        </ul>
                        <button class="market__order-form-submit" type="button" @click="orderSell">
                            {{ buttonSell }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./market-order.js"></script>
