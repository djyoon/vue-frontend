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
                <vue-scrollbar class="state__viewer-bodybox" ref="Scrollbar" v-if="historyOpen.length > 0">
                    <div>
                        <div class="state__viewer-body-row clearfix" v-for="row in historyOpen" :key="row.index">
                            <h2 class="state__viewer-col state__viewer-col--order text-left float-left"><span class="mobile-unit">Date</span>{{ row.time | moment(isTablet ? "MMM D, HH:mm" : "MMM D YYYY, HH:mm")}}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left"
                                :class="{'color-red': row.type === 'sell', 'color-green': row.type === 'buy', 'text-right': isTablet}">
                                <span class="mobile-unit">Type</span>
                                <span class="upper-case">{{ row.type }}</span></h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left" :class="{'text-right': isTablet}">
                                <span class="mobile-unit">Pairs</span>{{ coin_id }}/{{ market_base }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left" :class="{'text-right': !isTablet}">
                                <span class="mobile-unit">Price({{ market_base }})</span>{{ row.price }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">
                                <span class="mobile-unit">Amount({{ coin_id }})</span>{{ row.quantity | numberFormat(row.quantity.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">
                                <span class="mobile-unit">Unexecuted({{ coin_id }})</span>{{ row.unexecuted | numberFormat(row.unexecuted.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-right">
                                <span class="mobile-unit">Action</span>
                                <button class="textbutton" @click="cancelOrder(row)" :disabled="row.canceled"
                                    :class="{disabled: row.canceled}">Cancel</button>
                            </h2>
                        </div>
                    </div>
                </vue-scrollbar>
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
                <vue-scrollbar class="state__viewer-bodybox" ref="Scrollbar" v-if="historyClose.length > 0">
                    <div>
                        <div class="state__viewer-body-row clearfix" v-for="row in historyClose" :key="row.index">
                            <h2 class="state__viewer-col state__viewer-col--order text-left float-left">
                                <span class="mobile-unit">Date</span>{{ row.time | moment(isTablet ? "MMM D, HH:mm" : "MMM D YYYY, HH:mm")}}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left"
                                :class="{'color-red': row.type === 'sell', 'color-green': row.type === 'buy', 'text-right': isTablet}">
                                <span class="mobile-unit">Type</span><span class="upper-case">{{ row.type }}</span></h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left" :class="{'text-right': isTablet}">
                                <span class="mobile-unit">Price({{ market_base }})</span>{{ coin_id }}/{{ market_base }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order float-left" :class="{'text-right': !isTablet}">
                                <span class="mobile-unit">Price({{ market_base }})</span>{{ row.price }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">
                                <span class="mobile-unit">Amount({{ coin_id }})</span>{{ row.quantity | numberFormat(row.quantity.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-left">
                                <span class="mobile-unit">Total({{ market_base }})</span>{{ row.amount | numberFormat(row.amount.length > 14 ? '0a' : '0.0000') }}</h2>
                            <h2 class="state__viewer-col state__viewer-col--order text-right float-right">
                                <span class="mobile-unit">Average Price ({{ market_base }})</span>{{ row.price }}</h2>
                        </div>
                    </div>
                </vue-scrollbar>
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
<style>
.vue-scrollbar-transition, .vue-scrollbar__scrollbar-vertical, .vue-scrollbar__scrollbar-horizontal {
  transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -webkit-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
}
.vue-scrollbar-transition--scrollbar {
  transition: opacity 0.5s linear;
  -moz-transition: opacity 0.5s linear;
  -webkit-transition: opacity 0.5s linear;
  -o-transition: opacity 0.5s linear;
}

.vue-scrollbar__wrapper {
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  /* background: white; */
}
.vue-scrollbar__wrapper:hover .vue-scrollbar__scrollbar-vertical, .vue-scrollbar__wrapper:hover .vue-scrollbar__scrollbar-horizontal {
  opacity: 1;
}
.vue-scrollbar__scrollbar-vertical, .vue-scrollbar__scrollbar-horizontal {
  opacity: 0.5;
  position: absolute;
  background: transparent;
}
.vue-scrollbar__scrollbar-vertical:hover, .vue-scrollbar__scrollbar-horizontal:hover {
  background: rgba(255, 255, 255, 0.3);
}
.vue-scrollbar__scrollbar-vertical .scrollbar, .vue-scrollbar__scrollbar-horizontal .scrollbar {
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  cursor: default;
  border-radius: 3px;
}
.vue-scrollbar__scrollbar-vertical {
  width: 6px;
  height: 100%;
  top: 0;
  right: 0;
}
.vue-scrollbar__scrollbar-vertical .scrollbar {
  width: 6px;
}
.vue-scrollbar__scrollbar-horizontal {
  height: 10px;
  width: 100%;
  bottom: 0;
  right: 0;
}
.vue-scrollbar__scrollbar-horizontal .scrollbar {
  height: 10px;
}
</style>
