<template>
    <div class="state__viewer">
        <div class="state__viewer-title cleaerfix">
            <button class="state__trate-btn float-left" @click="selectMode(0)" :class="{active: mode == 0}">
                <img src="../../images/main/trade-nomal.png"
                     srcset="../../images/main/trade-nomal@2x.png 2x,
                             ../../images/main/trade-nomal@3x.png 3x">
            </button>
            <button class="state__trate-btn float-left" @click="selectMode(1)" :class="{active: mode == 1}">
                <img src="../../images/main/trade-buy.png"
                     srcset="../../images/main/trade-buy@2x.png 2x,
                             ../../images/main/trade-buy@3x.png 3x">
            </button>
            <button class="state__trate-btn float-left" @click="selectMode(2)" :class="{active: mode == 2}">
                <img src="../../images/main/trade-sell.png"
                     srcset="../../images/main/trade-sell@2x.png 2x,
                             ../../images/main/trade-sell@3x.png 3x">
            </button>

            <div class="state__viewer-select select--custom--box float-right">
                <button class=" select--custom--view i-am-a-popover-trigger" v-on:click="toggleGroupMenu"><span>Group</span> {{ groupFormat }}</button>
                <ul class="select--custom i-am-a-popover close-me-by-clicking-outside-of-me" v-if="showGroupMenu" v-on-click-outside="closeGroupMenu">
                    <li class="select__option" v-for="(price, index) in priceGroup" :key="index"><button type="button"
                      @click="selectGroup(index)" :class="{active: depth == index}">{{ price }}</button></li>
                </ul>
            </div>
        </div>
        <div class="state__viewer__body">
            <div class="state__viewer-body-row clearfix state__viewer-header state__viewer-header-bottom">
                <h2 class="state__viewer-body-th text-left float-left">Type</h2>
                <h2 class="state__viewer-body-th float-left">Price({{market_base}})</h2>
                <h2 class="state__viewer-body-th text-right float-left">Amount({{coin_id}})</h2>
            </div>
            <div class="ob-board">
                <div class="ob-sell" v-if="mode == 0 || mode == 2" :class="{'ob-sell-long': mode == 2}">
                    <div class="ob-row"
                        v-for="(row, index) in sell" :key="index"
                        :style="{'background-image': 'linear-gradient(to left, #2d1a28 ' + row.rate + '%, transparent 0%)'}"
                        @click="selectPrice(row)">
                        <span class="ob-row-progress"></span>
                        <div class="float-left ob-row-cell text-left">SELL {{ sell.length - index }}</div>
                        <div class="float-left ob-row-cell text-right">{{ row.price | formatPrice(groupFormat) }}</div>
                        <div class="float-left ob-row-cell ob-row-white text-right">{{ row.quantity | numberFormat(row.quantity.length > 14 ? '0a' : '0.0000') }}</div>
                    </div>
                </div>
                <div class="ob-last" :class="{'ob-last-border-top': mode != 1, 'ob-last-border-bottom': mode != 2, 'ob-last-long': mode != 0}" v-if="visibleLast">
                    <span class="ob-last-price" :class="{'ob-last-price-buy': last.type === 'buy', 'ob-last-price-sell': last.type === 'sell'}">{{ last.price }}</span>
                    {{ last.quantity | numberFormat(last.quantity.length > 14 ? '0a' : '0.0000') }} {{ coin_id }}
                </div>
                <div class="ob-buy" v-if="mode == 0 || mode == 1" :class="{'ob-buy-long': mode == 1}">
                    <div class="ob-row"
                        v-for="(row, index) in buy" :key="index"
                        :style="{'background-image': 'linear-gradient(to left, #17282a ' + row.rate + '%, transparent 0%)'}"
                        @click="selectPrice(row)">
                        <span class="ob-row-progress"></span>
                        <div class="float-left ob-row-cell text-left">BUY {{ index + 1 }}</div>
                        <div class="float-left ob-row-cell text-right">{{ row.price | formatPrice(groupFormat) }}</div>
                        <div class="float-left ob-row-cell ob-row-white text-right">{{ row.quantity | numberFormat(row.quantity.length > 14 ? '0a' : '0.0000')}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./order-book.js"></script>
<style src="../../css/order-book.css"></style>
