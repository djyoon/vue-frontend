<template>
    <div class="order">
        <div class="order__header">
            <button class="order__header-tab-btn" :class="{active: tab == 0}" @click="changeTab(0)">Open Orders</button>
            <button class="order__header-tab-btn" :class="{active: tab == 1}" @click="changeTab(1)">Order History <span>(Last 7 days)</span></button>
            <button class="float-right order__header-more" @click="gotoMore">More</button>
        </div>
        <div class="order__body">
            <div class="state__viewer__body state__viewer__body--order state__order-view1" v-if="tab == 0">
                <div class="state__viewer-body-row clearfix mobile-no-show">
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-left float-left">Date</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order float-left text-left">Type</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-left float-left">Pairs</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Price({{ market_base }})</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Amount({{ coin_id }})</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Unexecuted({{ coin_id }})</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Action</h2>
                </div>
                <vue-nice-scrollbar v-bind:speed="100" theme="light" display="vertical" class="state__viewer-bodybox" :refresh="refresh" v-if="historyOpen.length > 0">
                    <div class="scroll-me">
                        <div class="state__viewer-body-row clearfix" v-for="row in historyOpen" :key="row.index">
                            <h2 class="state__viewer-col state__viewer-col--order text-left float-left">{{ row.time | moment("MMM D, YYYY HH:mm")}}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left text-left upper-case"
                                :class="{'color-red': row.type === 'sell', 'color-green': row.type === 'buy'}">{{ row.type }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-left float-left">{{ coin_id }}/{{ market_base }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.price }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.quantity | numberFormat(row.quantity.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.unexecuted | numberFormat(row.unexecuted.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">
                                <button class="textbutton" @click="cancelOrder(row)" :disabled="row.canceled"
                                    :class="{disabled: row.canceled}">Cancel</button>
                            </h2>
                        </div>
                    </div>
                </vue-nice-scrollbar>
                <div class="state__nodata" v-if="historyOpen.length <= 0">
                    <img src="../../images/main/clipboards.png"
                         srcset="../../images/main/clipboards@2x.png 2x,
                             ../../images/main/clipboards@3x.png 3x">
                    <p>You have no relevant data for the time being</p>
                </div>
            </div>
            <div class="state__viewer__body state__viewer__body--order state__order-view1" v-if="tab == 1">
                <div class="state__viewer-body-row clearfix mobile-no-show">
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-left float-left">Date</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order float-left text-left">Type</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-left float-left">Pairs</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Price({{ market_base }})</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Amount({{ coin_id }})</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Total({{ market_base }})</h2>
                    <h2 class="state__viewer-body-th state__viewer-body-th--order text-right float-left">Average Price ({{ market_base }})</h2>
                </div>
                <vue-nice-scrollbar v-bind:speed="100" theme="light" display="vertical" class="state__viewer-bodybox" :refresh="refresh" v-if="historyClose.length > 0">
                    <div class="scroll-me">
                        <div class="state__viewer-body-row clearfix" v-for="row in historyClose" :key="row.index">
                            <h2 class="state__viewer-col state__viewer-col--order text-left float-left">{{ row.time | moment("MMM D, YYYY HH:mm")}}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left text-left upper-case"
                                :class="{'color-red': row.type === 'sell', 'color-green': row.type === 'buy'}">{{ row.type }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-left float-left">{{ coin_id }}/{{ market_base }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.price }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.quantity | numberFormat(row.quantity.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.amount | numberFormat(row.amount.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">{{ row.price }}</h2>
                        </div>
                    </div>
                </vue-nice-scrollbar>
                <div class="state__nodata" v-if="historyClose.length <= 0">
                    <img src="../../images/main/clipboards.png"
                         srcset="../../images/main/clipboards@2x.png 2x,
                             ../../images/main/clipboards@3x.png 3x">
                    <p>You have no relevant data for the time being</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./my-order.js"></script>
