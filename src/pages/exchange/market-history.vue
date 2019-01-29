<template>
    <div class="market__tradehistory float-left" :class="{'market__tradehistory--tablet': isTablet}">
        <div class="market__tradehistory-header">
            Trade History
        </div>
        <div class="state__viewer__body">
            <div class="state__viewer-body-row clearfix">
                <h2 class="state__viewer-body-th text-left float-left">Time</h2>
                <h2 class="state__viewer-body-th text-right float-left">Price({{ market_base }})</h2>
                <h2 class="state__viewer-body-th text-right float-left">Amount({{ coin_id }})</h2>
            </div>
            <div class="state__viewer-scrollbox state__viewer-scrollbox--long2" theme="light" display="vertical">
                <div class="state__viewer-body-row clearfix" v-for="row in history" :key="row.index"
                    :class="{'state__viewer-body-row--sell': row.type === 'sell', 'state__viewer-body-row--buy': row.type === 'buy'}">
                    <div class="float-left state__viewer-col state__viewer-col--color-white text-left">{{  row.time | moment(row.time > bef24h ? "HH:MM" : "MMM Do") }}</div>
                    <div class="float-left state__viewer-col text-right">{{ row.price }}</div>
                    <div class="float-left state__viewer-col state__viewer-col-color-w text-right">{{ row.quantity | numberFormat("0,000.0000") }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./market_history.js"></script>
