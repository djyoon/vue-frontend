<template>
    <div class="container container--padding-none">
        <div class="tablepage">
            <div class="wrap clearfix">
                <div class="tablepage__leftmenu">
                    <h1 class="tablepage__lnb-title">Balances</h1>
                    <ul class="tablepage__lnb">
                        <li class="tablepage__li"><router-link to="/balances" class="tablepage__link">Exchange Balance</router-link></li>
                        <li class="tablepage__li"><router-link to="/deposit_history" class="tablepage__link">Deposit History</router-link></li>
                        <li class="tablepage__li"><router-link to="/withdrawal_history" class="tablepage__link active">
                            Withdrawal History</router-link></li>
                    </ul>
                </div>

                <div class="tablepage__content">
                    <h1 class="tablepage__content-title">Withdrawal History</h1>
                    <br>
                    <div class="openorder-table openorder-table--deposit">
                        <div class="openorder-table__header clearfix">
                            <h2 class="col1 text-left"><button class="sort-btn" @click="setSortOrder('time')">Date
                            </button></h2>
                            <h2 class="col2 text-left"><button class="sort-btn" @click="setSortOrder('coin_id')">Currency</button></h2>
                            <h2 class="col3 text-left">Address</h2>
                            <h2 class="col4 text-left">Amount</h2>
                            <h2 class="col5 text-left">Status</h2>
                            <h2 class="col6 text-right">Action</h2>
                        </div>
                        <div class="openorder-table__body clearfix">
                            <div class="openorder-table__row clearfix" v-for="row in history" :key="row.index">
                                <p class="col1 text-left">
                                    {{ row.time | moment("MMM D YYYY HH:MM:SS") }}
                                </p>
                                <p class="col1 text-left logo">
                                    <img :src="row.coin_icon">
                                    {{ row.coin_id }}
                                </p>
                                <p class="col3 text-left popbox">
                                    {{ row.address_to }}
                                </p>
                                <p class="col4 text-right">
                                    {{ row.amount | numberFormat('0,000.00000000')}}
                                </p>
                                <p class="col5 text-left">
                                    {{ row.status_str }}
                                </p>
                                <p class="col6 text-right">
                                    <a class="textbutton" :href="row.link" :disabled="row.link"
                                       :class="{ disabled: row.link == false }" target="_blank">View</a>
                                    <span v-if="row.status == 2 ">
                                        <popper trigger="hover" :options="{placement: 'bottom'}">
                                            <div class="popper">{{ row.txid }}</div>
                                            <button class="textbutton" slot="reference" :disabled="true"
                                                :class="{ disabled: true }">TXID</button>
                                        </popper>
                                   </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="pagination">
                        <ul class="clearfix pagination__box">
                            <li class="float-left pagination__item">
                                <button class="pagination__button pagination__arrows pagination__arrows--prev" @click="goPrevPage()" :class="{ disabled: prevPage <= 0}" :disabled="prevPage <= 0"></button>
                            </li>
                            <li class="float-left pagination__item" v-for="n in pages" v-bind:key="n">
                                <button class="pagination__button pagination__page" :class="{ active: curPage == n }" @click="goPage(n)">{{ n }}</button>
                            </li>
                            <li class="float-left pagination__item">
                                <button class="pagination__button pagination__arrows pagination__arrows--next" @click="goNextPage()" :class="{ disabled: nextPage > lastPage}" :disabled="nextPage > lastPage"></button>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script src="./withdrawal_history.js"></script>
