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
                <button class=" select--custom--view i-am-a-popover-trigger" v-on:click="toggleDepthMenu"><span>Group</span> {{depthNumber}}</button>
                <ul class="select--custom i-am-a-popover close-me-by-clicking-outside-of-me" v-if="showDepthMenu" v-on-click-outside="closeDepthMenu">
                    <li class="select__option"><button type="button" @click="selectDepth(8)" :class="{active: depth == 8}">0.00000001</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(7)" :class="{active: depth == 7}">0.0000001</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(6)" :class="{active: depth == 6}">0.000001</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(5)" :class="{active: depth == 5}">0.00001</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(4)" :class="{active: depth == 4}">0.0001</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(3)" :class="{active: depth == 3}">0.001</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(2)" :class="{active: depth == 2}">0.01</button></li>
                    <li class="select__option"><button type="button" @click="selectDepth(1)" :class="{active: depth == 1}">0.1</button></li>
                </ul>
            </div>
        </div>
        <div class="state__viewer__body">
            <div class="state__viewer-body-row clearfix state__viewer-header">
                <h2 class="state__viewer-body-th text-left float-left">Type</h2>
                <h2 class="state__viewer-body-th float-left">Price({{market_base}})</h2>
                <h2 class="state__viewer-body-th text-right float-left">Amount({{coin_id}})</h2>
            </div>
            <div class="state__trade-tab1 state__trade-tab">
                <div class="state__viewer-scrollbox state__viewer-sell" theme="light" display="vertical" v-if="mode == 0 || mode == 2" :class="{'state__viewer-scrollbox--long': mode == 2}">
                    <div class="state__viewer-body-row state__viewer-body-row--sell clearfix"
                        v-for="(row, index) in sell" :key="row.price">
                        <span class="state__row-progress"></span>
                        <div class="float-left state__viewer-col text-left">SELL {{ sell.length - index }}</div>
                        <div class="float-left state__viewer-col text-center">{{ row.price }}</div>
                        <div class="float-left state__viewer-col state__viewer-col-color-w text-right">{{ row.quantity }}</div>
                    </div>
                </div>
                <div class="state__viewer-total" :class="{'state__viewer-total--buy': last.mode === 'buy', 'state__viewer-total--sell': last.mode === 'sell', 'state__viewer-total-top': mode != 1, 'state__viewer-total-bottom': mode != 2}">
                    <span>{{ last.price }}</span> {{ last.quantity }} {{ coin_id }}
                </div>
                <div class="state__viewer-scrollbox state__viewer-buy" theme="light" display="vertical" v-if="mode == 0 || mode == 1" :class="{'state__viewer-scrollbox--long': mode == 1}">
                    <div class="state__viewer-body-row state__viewer-body-row--buy clearfix"
                        v-for="(row, index) in buy" :key="row.price">
                        <span class="state__row-progress"></span>
                        <div class="float-left state__viewer-col text-left">BUY {{ index + 1 }}</div>
                        <div class="float-left state__viewer-col text-center">{{ row.price }}</div>
                        <div class="float-left state__viewer-col state__viewer-col-color-w text-right">{{ row.quantity }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./order-book.js"></script>
