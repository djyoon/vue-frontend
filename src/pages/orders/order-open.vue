<template>
    <div class="container container--padding-none">
        <div class="tablepage">
            <div class="wrap clearfix">
                <div class="tablepage__leftmenu" :class="{'tablepage__leftmenu__mshow': isTablet && visibleSideMenu}">
                    <button class="tablepage__leftmenu__toggle" @click="toggleSideMenu()"></button>
                    <h1 class="tablepage__lnb-title">Orders</h1>
                    <ul class="tablepage__lnb">
                        <li class="tablepage__li"><router-link to="/order-open" class="tablepage__link active">Open
                            Orders</router-link></li>
                        <li class="tablepage__li"><router-link to="/order-history" class="tablepage__link">
                            Order History</router-link></li>
                    </ul>
                </div>

                <div class="tablepage__content">
                    <h1 class="tablepage__content-title">Open Orders</h1>
                    <div class="filter-box text-right clearfix">
                        <div class="filter half">
                            <button class="filter__value" @click="showMarketDept">{{ sortMarketName }}</button>
                            <ul class="filter__optionbox" v-if="visibleMarketDept">
                                <li class="filter__option-li" v-for="market in marketDeptMenu" :key="market.key">
                                    <button class="filter__option-btn" @click="changeSortMarket(market.key, market.name)">
                                        {{ market.name }}
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div class="filter half">
                            <button class="filter__value" @click="showTypeDept">{{ sortTypeName }}</button>
                            <ul class="filter__optionbox" v-if="visibleTypeDept">
                                <li class="filter__option-li" v-for="type in typeDeptMenu" :key="type.key">
                                    <button class="filter__option-btn" @click="changeSortType(type.key, type.name)">
                                        {{ type.name }}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="openorder-table">
                        <div class="openorder-table__header clearfix" v-if="!isMobile">
                            <h2 class="col1 text-left">Date</h2>
                            <h2 class="col2 text-left">Market</h2>
                            <h2 class="col3 text-left">Type</h2>
                            <h2 class="col4 text-right">Price</h2>
                            <h2 class="col5 text-right">Amount</h2>
                            <h2 class="col6 text-right">Executed</h2>
                            <h2 class="col7 text-right" v-if="!isTablet">Unexecuted</h2>
                            <h2 class="col8 text-right" v-if="!isTablet">Executed Total</h2>
                            <h2 class="col9 text-right">Action</h2>
                        </div>
                        <div class="openorder-table__body clearfix" v-for="(order, index) in orders" :key="index">
                            <div class="openorder-table__row clearfix">
                                <p class="col1 text-left"><span class="mobile-unit">Date</span>{{ order.date | moment("MMM D, YYYY HH:mm") }}</p>
                                <p class="col2 text-left"><span class="mobile-unit">Pairs</span>{{ order.market | changeSlash }}</p>
                                <p class="col3 text-left"><span class="mobile-unit">Type</span>
                                    <span class="upper-case" :class="{'color-green': order.type === 'buy', 'color-red': order.type === 'sell'}">{{ order.type }}</span>
                                </p>
                                <p class="col4 text-right">
                                    <span class="mobile-unit">Price({{ order.market_base }})</span>
                                    {{ order.price | numberFormat('0,000.00000000') }}
                                    <span class="unit">({{ order.market_base }})</span>
                                </p>
                                <p class="col5 text-right">
                                    <span class="mobile-unit">Amount({{ order.coin_id }})</span>
                                    {{ order.quantity | numberFormat('0,000.0000') }}
                                    <span class="unit">({{ order.coin_id }})</span>
                                    <span v-if="isMobile">
                                        <br/>
                                        / {{ order.trade_quantity | numberFormat('0,000.0000') }}
                                        <span class="unit">({{ order.coin_id }})</span>
                                    </span>
                                </p>
                                <p class="col6 text-right" v-if="!isMobile">
                                    <span class="mobile-unit">Executed({{ order.coin_id }})</span>
                                    {{ order.trade_quantity | numberFormat('0,000.0000') }}
                                    <span class="unit">({{ order.coin_id }})</span>
                                </p>
                                <p class="col7 text-right" v-if="!isMobile && !isTablet">
                                    <span class="mobile-unit">Unexecuted({{ order.coin_id }})</span>
                                    {{ order.unexecuted | numberFormat('0,000.0000') }}
                                    <span class="unit">({{ order.coin_id }})</span>
                                </p>
                                <p class="col8 text-right" v-if="!isMobile && !isTablet">
                                    <span class="mobile-unit">Amount({{ order.market_base }})</span>
                                    {{ order.exetotal | numberFormat('0,000.00000000') }}
                                    <span class="unit">({{ order.market_base }})</span>
                                </p>
                                <p class="col9 text-right">
                                    <button class="textbutton" @click="cancelOrder(order)" :disabled="order.canceled"
                                        :class="{disabled: order.canceled}">Cancel</button>
                                </p>
                            </div>
                        </div>
                    </div>
                        <div>
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
    </div>
</template>

<script src="./order-open.js"></script>
