<template>
    <div class="state__price">
        <div class="state__price-header clearfix">
            <button class="state__price-tab-btn float-left" v-bind:class="{active: market_base == 'USD'}" v-on:click="changeMarket('USD')">USD</button>
            <button class="state__price-tab-btn float-left" v-bind:class="{active: market_base == 'BTC'}" v-on:click="changeMarket('BTC')">BTC</button>
            <button class="state__price-tab-btn float-left" v-bind:class="{active: market_base == 'ETH'}" v-on:click="changeMarket('ETH')">ETH</button>
            <button class="state__price-tab-btn float-right" v-bind:class="{active: market_base == 'favor'}" v-on:click="changeMarket('favor')">Favorite</button>
        </div>
        <div class="state__price-body">
            <div class="table state__price-table">
                <table>
                    <colgroup>
                        <col width="40%">
                        <col width="20%">
                        <col width="40%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th class=" text-left"><button class="state__price-sort-btn" @click="setSortOrder('pairs')">Pairs</button></th>
                        <th><button class="state__price-sort-btn" @click="setSortOrder('change')">Change</button></th>
                        <th><button class="state__price-sort-btn" @click="setSortOrder('price')">Last Price</button></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in market_list[market_base]" :key="row.market_id" :class="{up: row.change_rate > 0, down: row.change_rate < 0}">
                            <td class="text-left state__price-case">
                                <button class="btn-state__price-favorite" @click="toggleFavor(index)" :class="{active: row.favor}">&nbsp;</button>
                                <button class="market-link" @click="selectMarket(row.market_id)">{{ row.coin_id }} / {{ row.market_base }}</button>
                            </td>
                            <td>
                                {{ row.change_rate > 0 ? '+' : '' }}{{ row.change_rate }}%
                            </td>
                            <td>
                                {{ row.price_last | numberFormat('0,000.0000') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script src="./market-list.js"></script>
