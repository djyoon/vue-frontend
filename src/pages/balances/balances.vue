<template>
    <div class="container container--padding-none">
        <div class="tablepage">
            <div class="wrap clearfix">
                <div class="tablepage__leftmenu" :class="{'tablepage__leftmenu__mshow': isTablet && visibleSideMenu}">
                    <button class="tablepage__leftmenu__toggle" @click="toggleSideMenu()"></button>
                    <h1 class="tablepage__lnb-title">Balances</h1>
                    <ul class="tablepage__lnb">
                        <li class="tablepage__li"><router-link to="/balances" class="tablepage__link active">Exchange Balance</router-link></li>
                        <li class="tablepage__li"><router-link to="/deposit_history" class="tablepage__link">Deposit History</router-link></li>
                        <li class="tablepage__li"><router-link to="/withdrawal_history" class="tablepage__link">Withdrawal History</router-link></li>
                    </ul>
                </div>
                <div class="tablepage__content">
                    <h1 class="tablepage__content-title">Exchange Balance</h1>
                    <div class="extimated">
                        <p>Estimated Total Value</p>
                        <h2>{{ usdTotal | numberFormat('0,000.0000') }} <span class="unit">USD</span></h2>
                        <label class="checkbox">
                            <input type="checkbox" class="blind checkbox__input" v-model="checkHideZero">
                            <span class="checkbox__icon" ></span> Hide zero asset
                        </label>
                    </div>
                    <div class="openorder-table openorder-table--balance">
                        <div class="openorder-table__header clearfix">
                            <h2 class="col1 text-left"><button class="sort-btn" @click="setSortOrder('coin_id')">Currency</button></h2>
                            <h2 class="col2 text-right"><button class="sort-btn" @click="setSortOrder('volume')">Volume</button></h2>
                            <h2 class="col3 text-right" v-if="!isMobile">Frozen</h2>
                            <h2 class="col4 text-right" v-if="!isMobile">Available</h2>
                            <h2 class="col5 text-right" v-if="!isMobile">Action</h2>
                        </div>
                        <div class="openorder-table__body clearfix" v-for="row in coin_list" :key="row.index">
                            <div class="openorder-table__balance--row clearfix" @click="row.selected = !row.selected">
                                <p class="col1 text-left logo">
                                    <img :src="row.coin_icon">
                                    <span class="coin_id">{{ row.coin_id }}</span>
                                    <span class="unit2">{{ row.coin_name }}</span>
                                </p>
                                <p class="col2 text-right">
                                    {{ row.volume | numberFormat('0,000.00000000') }}
                                    <span class="unit2">≈ {{ row.volume_usd | numberFormat('0,000.0000') }} USD</span>
                                </p>
                                <p class="col3 text-right"><span class="mobile-label">Frozen</span>{{ row.frozen | numberFormat('0,000.00000000') }}</p>
                                <p class="col4 text-right"><span class="mobile-label">Available</span>{{ row.available | numberFormat('0,000.00000000') }}</p>
                                <p class="col5 text-right">
                                    <button class="textbutton"
                                        @click="showDeposit(row.coin_id, row.coin_name, row.address)"
                                        :disabled=" row.coin_id == 'USD'"
                                        :class="{ disabled: row.coin_id == 'USD'}">Deposit</button>
                                    <button class="textbutton" @click="showWithdraw(row.coin_id, row.min_withdraw, row.withdraw_fee, row.price_usd, row.available)"
                                        :class="{ disabled: row.available <= 0 || row.coin_id == 'USD' }"
                                        :disabled="row.available <= 0 || row.coin_id == 'USD' ">Withdraw</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="visibleDeposit">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <h2 class="modal__title">{{ coin_id }} Deposit</h2>
                    <div class="modal__desc">
                        <p class="color-red" style="margin-bottom:.75em;">Send only {{ coin_id }} to this deposit address.</p>
                        Sending any other tokens to this address may result in the loss of your deposit
                    </div>

                    <div class="text-left" style="margin-top:2em;">
                        <label class="checkbox">
                            <input type="checkbox" class="blind checkbox__input" v-model="checkShowAddress">
                            <span class="checkbox__icon" :class="{ wrong: !isChecked }"></span>I have learned and confirm to deposit {{ coin_id }}- {{ coin_name }}
                        </label>
                    </div>
                    <div class="modal__btnbox">
                        <button class="btn btn--cancel btn--half" @click="hideDeposit">Cancel</button>
                        <button class="btn btn--confirm btn--half" @click="showAddress"
                                :disabled="api_calling">View</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="visibleAddress">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <h2 class="modal__title">{{ coin_id }} Deposit</h2>
                    <div class="modal__desc">
                        {{ coin_id }} Deposit Address
                    </div>

                    <div class="modal__qr">
                        <p class="modal__code">{{ address }}
                            <button href="" class="textbutton center"  v-clipboard:copy="address"
                                    v-clipboard:success="onCopyToClipboard"
                                    v-clipboard:error="onErrorClipboard" >Copy</button></p>

                        <div class="modal__qrimg">
                            <img alt="" :src="qr_code">
                        </div>
                        <p class="modal__desc">Or scan this QR code</p>
                    </div>

                    <div class="modal__btnbox">
                        <button class="btn btn--confirm btn--single" @click="hideAddress">Close</button>
                    </div>

                    <p class="modal__desc2" style="margin-top:2.5em;">
                        Send only {{ coin_id }} to {{ coin_id }} address. Sending any other asset to {{ coin_id }} address will result in the loss of your asset
                    </p>
                    <p class="modal__desc2">
                        {{ coin_id }} will be deposited within 30 minutes.
                    </p>
                    <p class="modal__desc2">
                        After making a deposit, you can track its progress on the <router-link to="/deposit_history" class="textbutton">Deposit History</router-link> page.
                    </p>
                </div>
            </div>
        </div>

        <div v-if="visibleWithdraw">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <h2 class="modal__title">{{ coin_id }} Withdraw</h2>

                    <form action="">
                        <div class="form modal__form">
                            <div class="form__group">
                                <label for="" class="form__title">{{ coin_id }} Withdrawal Address</label>
                                <div class="form__box">
                                    <input type="text" class="form__input" v-model="to_address" :class="{
                                        wrong: error_address.length > 0 }">
                                    <p class="form__wrong-text" v-if="error_address.length > 0">{{ error_address }}</p>
                                </div>
                            </div>
                            <div class="form__group">
                                <label for="" class="form__title">Withdrawal Amount (min:{{ min_withdraw |
                                decimalToString }})</label>
                                <div class="form__box">
                                    <input type="number" class="form__input" v-model="withdrawal_amount" :class="{
                                        wrong: error_withdraw.length > 0 }">
                                    <p class="form__wrong-text" v-if="error_withdraw.length > 0" >{{ error_withdraw
                                        }}</p>

                                    <span class="unit">{{ coin_id }}</span>
                                </div>
                            </div>
                            <div class="form__group">
                                <label for="" class="form__title">Fees</label>
                                <div class="form__box">
                                    <input type="text" class="form__input" v-model="withdraw_fee" disabled>
                                    <span class="unit"></span>
                                </div>
                            </div>
                            <div class="form__group">
                                <label for="" class="form__title">Receive Amount</label>
                                <div class="form__box">
                                    <input type="text" class="form__input" v-model="receive_amount" disabled>
                                    <span class="unit">{{ coin_id }}</span>
                                </div>
                            </div>


                        </div>
                    </form>

                    <div class="modal__btnbox">
                        <button class="btn btn--cancel btn--half" @click="hideWithdraw">Cancel</button>
                        <button class="btn btn--confirm btn--half" @click="otpAuthCheck">Withdraw</button>
                    </div>

                    <p class="modal__desc2" style="margin-top:2.5em;">
                        Once your withdrawal request has been approved, please go to your email and click the link inside to confirm your request
                    </p>
                    <p class="modal__desc2">
                        {{ coin_id }}'s one time minimum withdrawal is {{ min_withdraw | decimalToString }}
                        {{ coin_id }}, maximum withdrawal is {{ onetime_limit | numberFormat('0,000.00000000') }}
                        {{ coin_id }}, fee is {{ withdraw_fee | decimalToString }}{{ coin_id }}
                    </p>
                    <p class="modal__desc2">
                        If your withdrawal request requires approval from us, please click the link in the withdrawal confirmation email and wait for the confirmation call from our customer service.
                    </p>
                    <p class="modal__desc2">
                        After making a withdrawal, you can track its progress on the <router-link class="textbutton"
                            to="/withdrawal_history">Withdrawal History</router-link> page.
                    </p>
                </div>
            </div>
        </div>

        <div v-if="has_error">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <p class="modal__desc">
                        {{ error_common }}
                    </p>
                    <div class="modal__btnbox">
                        <button class="btn btn--confirm btn--single" @click="onErrorResponse">OK</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="visibleSuccess != visibleProcess">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <div class="madal__iconbox"><img src="../../images/icon/check.png" alt=""></div>
                    <h2 class="modal__title" v-if="visibleSuccess">Withdrawal successful.</h2>
                    <h2 class="modal__title" v-if="visibleProcess">Please wait.</h2>
                    <p class="modal__desc" v-if="visibleSuccess">
                        Please check your email. <br/>
                    </p>
                    <div class="modal__btnbox" v-if="visibleSuccess">
                        <a class="btn btn--confirm btn--single" @click="hideSuccess">OK</a>
                    </div>
                </div>
            </div>
        </div>

        <OtpAuth v-if="visibleOtpAuth" v-on:enterOtp="enterOtp" v-on:hideOtp="hideOtp" :error_message="error_otp"></OtpAuth>
    </div>
</template>

<script src="./balances.js"></script>
