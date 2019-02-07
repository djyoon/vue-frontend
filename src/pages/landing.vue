<template>
  <div class="container">
      <div class="landing">

          <slick
            ref="slick"
            :options="slickOptionsBanner" class="landing__slidebox" @swipe="handleSwipe">

              <div class="landing__slide" style="background:url(../images/sub/banner-2.jpg) no-repeat center;background-size:cover;" v-bind:style="{ 'background-image': 'url(' + require('../images/sub/banner-2.png') + ')' }">
                  <h1 class="landing__slide-title">The Financial Hub of Digital Assets</h1>
                  <p class="landing__slide-desc">
                      Nexbill is open to almost all countries around the world, Lao PDR(Laos) incorporated entity or its relevant authorized affiliates.
                  </p>
              </div>

              <div class="landing__slide" style="background:url(../images/sub/banner-2.jpg) no-repeat center;background-size:cover;" v-bind:style="{ 'background-image': 'url(' + require('../images/sub/banner-2.png') + ')' }">
                  <h1 class="landing__slide-title">A secure and Trustworthy Crypto Assets Exchange</h1>
                  <p class="landing__slide-desc">
                      We are committed to providing the most high-speed trade matching on our innovative and user friendly platform.
                  </p>
              </div>

              <div class="landing__slide" style="background:url(../images/sub/banner-2.jpg) no-repeat center;background-size:cover;" v-bind:style="{ 'background-image': 'url(' + require('../images/sub/banner-2.png') + ')' }">
                  <h1 class="landing__slide-title">The Most Reliable Digital Asset Trading Platform</h1>
                  <p class="landing__slide-desc">
                      You can open a bank account with JDB bank in order to buy and sell Bitcoin, Ethereum, ESR and more.
                  </p>
              </div>
          </slick>

          <div class="landing__notice">
            <slick ref="slick" :options="slickOptionsNotice" class="wrap">
                <a href="" class="landing__notice-item">Announce &amp; Notice 1</a>
                <a href="" class="landing__notice-item">Announce &amp; Notice 2</a>
                <a href="" class="landing__notice-item">Announce &amp; Notice 3</a>
            </slick>
          </div>

          <div class="priceState">
              <div class="wrap clearfix">
                  <slick ref="slick" :options="slickOptionsPrice">
                    <div class="priceState__parent" v-for="(row, idx) in graph_list" :key="row.market_id">
                      <line-chart class="priceState__graph" :chart-data="datacollections[idx]" :options="graph_option"></line-chart>
                      <div class="priceState__item float-left" v-bind:class="{up: row.change_rate > 0, down: row.change_rate < 0}">
                          <h2 class="priceState__case"><strong>{{ row.coin_id }}</strong> / {{ row.market_base }}</h2>
                          <div class="priceState__price">
                              {{ row.price_last | numberFormat('0,000.00') }} <span class="priceState__dollar">/ ${{ row.price_last_usd | numberFormat('0,000.00') }}</span>
                          </div>
                          <p class="priceState__vol">
                              Vol : {{ row.volume_24h | numberFormat }} {{ row.coin_id }}
                          </p>
                          <span class="priceState__state">{{ row.change_rate > 0 ? "+" : ""}}{{ row.change_rate }}%</span>
                      </div>
                    </div>
                  </slick>
              </div>
          </div>

          <div class="market-tablebox">
              <div class="wrap">
                  <div class="market__tabbox clearfix">
                      <button class="float-left market__tab-btn" v-bind:class="{active: market_base == 'USD'}" v-on:click="changeMarket('USD')">
                         <div class="market__tab market__tab--usd">
                             <img src="../images/icon/usd.svg"/>
                             USD <span>Market</span>
                         </div>
                      </button>
                      <button class="float-left market__tab-btn" v-bind:class="{active: market_base == 'BTC'}" v-on:click="changeMarket('BTC')">
                          <div  class="market__tab market__tab--btc">
                              <img src="../images/icon/btc.svg"/>
                              BTC <span>Market</span>
                          </div>
                      </button>
                      <button class="float-left market__tab-btn" v-bind:class="{active: market_base == 'ETH'}" v-on:click="changeMarket('ETH')">
                          <div  class="market__tab market__tab--eth">
                              <img src="../images/icon/eth.svg"/>
                              ETH <span>Market</span>
                          </div>
                      </button>
                      <button class="float-left market__tab-btn" v-bind:class="{active: market_base == 'favor'}" v-on:click="changeMarket('favor')">
                          <div  class="market__tab market__tab--fvr">
                              <img src="../images/icon/favorites.svg"/>
                              Favorites
                          </div>
                      </button>
                  </div>
                  <table class="market-table">
                      <colgroup>
                          <col>
                          <col>
                          <col>
                          <col>
                          <col>
                          <col>
                      </colgroup>
                      <thead>
                      <tr>
                          <th>
                              <button class="sort-btn" v-on:click="setSortOrder('pairs')"
                                v-bind:class="{asc: sortOrder['pairs'] < 0, desc: sortOrder['pairs'] > 0 }">Pairs</button>
                          </th>
                          <th><button class="sort-btn" v-on:click="setSortOrder('price')"
                            v-bind:class="{asc: sortOrder['price'] < 0, desc: sortOrder['price'] > 0 }">Last Price</button></th>
                          <th><button class="sort-btn" v-on:click="setSortOrder('change')"
                            v-bind:class="{asc: sortOrder['change'] < 0, desc: sortOrder['change'] > 0 }">Change</button></th>
                          <th class="text-right">24h High</th>
                          <th class="text-right">24h Low</th>
                          <th class="text-right"><button class="sort-btn" v-on:click="setSortOrder('volume')"
                            v-bind:class="{asc: sortOrder['volume'] < 0, desc: sortOrder['volume'] > 0 }">24h Vol</button></th>
                      </tr>
                      </thead>
                      <tbody>
                      <!--
                      <a v-on:click=""><img src="../images/icon/favorites-nomal-icon.svg"/></a>
                      <a v-on:click=""><img src="../images/icon/favorites-select-icon.svg"/></a>
                      -->
                      <tr v-for="(row, index) in market_list[market_base]" :key="row.market_id">
                          <td>
                              <button @click="toggleFavor(index)">
                                  <img :src="require(row.favor ? '../images/icon/favorites-select-icon.svg' : '../images/icon/favorites-nomal-icon.svg')">
                              </button>
                              <button class="btn-favorite" @click="gotoExchange(row.market_id)">
                                  <strong>{{ row.coin_id }}</strong> / {{ row.market_base }}
                              </button>
                          </td>
                          <td class="price">
                              <span>{{ row.price_last | numberFormat('0,000.00000000') }}</span> / ${{ row.price_last_usd | numberFormat('0,000.00') }}
                          </td>
                          <td>
                              <span class="chip" v-bind:class="{up: row.change_rate > 0, down: row.change_rate < 0}">{{ row.change_rate > 0 ? '+' : '' }}{{ row.change_rate }}%</span>
                          </td>
                          <td class="text-right">
                              {{ row.high_24h | numberFormat('0,000.00000000') }}
                              <p class="trans">≈ ${{ row.high_24h_usd| numberFormat('0,000.00') }}</p>
                          </td>
                          <td class="text-right">
                              {{ row.low_24h | numberFormat('0,000.00000000') }}
                              <p class="trans">≈ ${{ row.low_24h_usd| numberFormat('0,000.00') }}</p>
                          </td>
                          <td class="text-right">
                              {{ row.volume_24h | numberFormat }}
                          </td>
                      </tr>
                      <tr v-if="market_error[market_base].length > 0">
                        <td colspan="6">{{ market_error[market_base] }}</td>
                      </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <ul class="landing-info wrap">
              <li class="landing-info__item float-left">
                  <div class="landing-info__icon">
                      <img src="../images/sub/fiat-trading-icon.png"
                           srcset="../images/sub/fiat-trading-icon@2x.png 2x,
                                   ../images/sub/fiat-trading-icon@3x.png 3x"
                           class="img">
                  </div>
                  <h2 class="landing-info__title">Fiat Trading</h2>
                  <p class="landing-info__desc">
                      A trusted platform with intuitive user interface allowing professionals to trade tokens with fiat currency conveniently.
                  </p>
              </li>
              <li class="landing-info__item float-left">
                  <div class="landing-info__icon">
                      <img src="../images/sub/security-icon.png"
                           srcset="../images/sub/security-icon@2x.png 2x,
                                   ../images/sub/security-icon@3x.png 3x"
                           class="img">
                  </div>
                  <h2 class="landing-info__title">Robust Security</h2>
                  <p class="landing-info__desc">
                      Safe use of microservices splitting design and AI to provide smart token and trading management.
                  </p>
              </li>
              <li class="landing-info__item float-left">
                  <div class="landing-info__icon">
                      <img src="../images/sub/multi-platform-icon.png"
                           srcset="../images/sub/multi-platform-icon@2x.png 2x,
                                   ../images/sub/multi-platform-icon@3x.png 3x"
                           class="img">
                  </div>
                  <h2 class="landing-info__title">Multi-Platform Support</h2>
                  <p class="landing-info__desc">
                      Supporting the fast and secure  transactions  across multiple devices,  from PC to Mobile.
                  </p>
              </li>
              <li class="landing-info__item float-left">
                  <div class="landing-info__icon">
                      <img src="../images/sub/support-icon.png"
                           srcset="../images/sub/support-icon@2x.png 2x,
                                   ../images/sub/support-icon@3x.png 3x"
                           class="img">
                  </div>
                  <h2 class="landing-info__title">Prompt Support</h2>
                  <p class="landing-info__desc">
                      24/7 customer service with professional staff, solving your trade problem in anytime.
                  </p>
              </li>
          </ul>
      </div>
  </div>
</template>

<script src="./landing.js"></script>
<style src="../../node_modules/slick-carousel/slick/slick.css"></style>
