<template>
    <div class="container container--padding-none">
        <div class="tablepage">
            <div class="wrap clearfix">
                <div class="tablepage__leftmenu">
                    <h1 class="tablepage__lnb-title">Balances</h1>
                    <ul class="tablepage__lnb">
                        <li class="tablepage__li"><router-link to="/balances" class="tablepage__link">Exchange Balance</router-link></li>
                        <li class="tablepage__li"><router-link to="/deposit_history" class="tablepage__link active">Deposit History</router-link></li>
                        <li class="tablepage__li"><router-link to="/withdrawal_history" class="tablepage__link">Withdrawal History</router-link></li>
                    </ul>
                </div>

                <div class="tablepage__content">
                    <h1 class="tablepage__content-title">Deposit History</h1>
                    <br>
                    <div class="openorder-table openorder-table--deposit">
                        <div class="openorder-table__header clearfix">
                            <h2 class="col1 text-left"><button class="sort-btn" @click="setSortOrder('time')">Date
                            </button></h2>
                            <h2 class="col2 text-left"><button class="sort-btn" @click="setSortOrder('coin_id')">Currency</button></h2>
                            <h2 class="col3 text-left">Address</h2>
                            <h2 class="col4 text-left">Amount</h2>
                            <h2 class="col5 text-left">Confirmations</h2>
                            <h2 class="col6 text-left">Status</h2>
                            <h2 class="col7 text-right">Action</h2>
                        </div>
                        <div class="openorder-table__body clearfix">
                            <div class="openorder-table__row clearfix" v-for="history in historys" :key="history.index">
                                <p class="col1 text-left">
                                    {{ history.time | moment("MMM D YYYY HH:MM:SS") }}
                                </p>

                                <p class="col1 text-left logo">
                                    <img :src="history.coin_icon">
                                    {{ history.coin_id }}
                                </p>
                                <p class="col3 text-left popbox">
                                    {{ history.address_to }}
                                </p>
                                <p class="col4 text-left">
                                    {{ history.amount | numberFormat('0,000.00000000')}}
                                </p>
                                <p class="col5 text-left">
                                    {{ history.confirm }}
                                </p>
                                <p class="col6 text-left">
                                    {{ history.status }}
                                </p>
                                <p class="col7 text-right">
                                    <a class="textbutton" :href="history.link" :disabled="history.link"
                                       :class="{ disabled: history.link == false }" target="_blank">View</a>

                                    <span v-if="history.status == 'complete' ">
                                    <popper trigger="hover" :options="{placement: 'bottom'}">
                                        <div class="popper">
                                            {{ history.txid }}
                                        </div>
                                        <button class="textbutton" slot="reference" >
                                        TXID
                                    </button>
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

<script src="./deposit_history.js"></script>
