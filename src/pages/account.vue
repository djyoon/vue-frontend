<template>
    <div class="container">
        <div class="mypage">
            <div class="wrap">
                <div class="container__title">
                    <h1>Account Information</h1>
                </div>

                <div class="mypage__box">
                    <h2 class="mypage__box-title">Basic Account</h2>
                    <ul class="mypage__itembox">
                        <li class="mypage__item clearfix mypage__item--basicaccount">
                            <div class="float-left mypage__item-title"><h3 class="Account">Account Email</h3></div>
                            <div class="mypage__item-value float-left">{{ email }}</div>
                        </li>
                        <li class="mypage__item clearfix mypage__item--basicaccount">
                            <div class="float-left mypage__item-title"><h3 class="Password">Password</h3></div>
                            <div class="mypage__item-value float-left">*********</div>
                            <router-link to="/password" class="textbutton full-right">Change</router-link>
                        </li>
                        <li class="mypage__item clearfix mypage__item--basicaccount">
                            <div class="float-left mypage__item-title"><h3 class="Security">Security Level</h3></div>
                            <div class="mypage__item-value float-left"><span style="color:#dc4646">Level {{ memLevel }}</span> <span class="mypage__item-value mypage__item-value-info">( Max 4 )</span></div>
                            <a href="" class="textbutton full-right">More</a>
                        </li>
                        <li class="mypage__item clearfix mypage__item--basicaccount">
                            <div class="float-left mypage__item-title"><h3 class="Maximum">Maximum Withdrawal Limit</h3></div>
                            <div class="mypage__item-value float-left"><span class="mypage__item-value mypage__item-value-info">{{ withdrawLimit | numberFormat("0,000") }} USD (24 hours)</span></div>
                            <a href="" class="textbutton full-right">More</a>
                        </li>
                        <li class="mypage__item clearfix mypage__item--basicaccount">
                            <div class="float-left mypage__item-title"><h3 class="Fee">Trading Fee</h3></div>
                            <div class="mypage__item-value float-left">VIP {{ vipLevel }} <span class="mypage__item-value mypage__item-value-info">{{ tradeFee | numberFormat("0.00") }}%</span></div>
                            <a href="" class="textbutton full-right">More</a>
                        </li>
                    </ul>
                </div>

                <div class="mypage__box mypage__box--security">
                    <h2 class="mypage__box-title">Security Settings</h2>
                    <ul class="mypage__itembox">
                        <li class="mypage__item clearfix mypage__item--Security">
                            <div class="float-left mypage__item-title"><h3 class="Email">Email <span class="label-level">Lv. 1</span></h3></div>
                            <div class="mypage__item-value float-left mypage__item-value--deepcolor">To be used for security verification when making withdrawals and changing security settings.</div>
                            <span class="full-right">
                            <img src="../images/icon/success-icon.png" alt="" v-if="memLevel >= 1">
                            <a class="textbutton" v-if="memLevel < 1" @click="retryEmailAuth">Require resend</a>
                          </span>
                        </li>
                        <li class="mypage__item clearfix mypage__item--Security">
                            <div class="float-left mypage__item-title"><h3 class="OTP">OTP Authentication <span class="label-level">Lv. 2</span></h3></div>
                            <div class="mypage__item-value float-left mypage__item-value--deepcolor">To be used for security verification when logging in, making withdrawal request, and modifying security settings.</div>
                            <span class="full-right">
                            <router-link to="/otp-remove" class="textbutton" v-if="memLevel >= 2">Reset OTP</router-link>
                            &nbsp;
                            <img src="../images/icon/success-icon.png" alt="" v-if="memLevel >= 2">
                            <router-link to="/otp-create" class="textbutton" v-if="memLevel < 2">Setup OTP</router-link>
                          </span>
                        </li>
                        <li class="mypage__item clearfix mypage__item--Security">
                            <div class="float-left mypage__item-title"><h3 class="KYC">KYC Authentication <span class="label-level">Lv. 3</span></h3></div>
                            <div class="mypage__item-value float-left mypage__item-value--deepcolor">Please enter your real identity information. Once it is certified, it cannot be modified.</div>
                            <p class=" full-right">Required Level 2</p>
                        </li>
                        <li class="mypage__item clearfix mypage__item--Security">
                            <div class="float-left mypage__item-title"><h3 class="Bank">Bank account <span class="label-level">Lv. 4</span></h3></div>
                            <div class="mypage__item-value float-left mypage__item-value--deepcolor">Please enter your real identity information. Once it is certified, it cannot be modified.</div>
                            <p class=" full-right">Required Level 3</p>
                        </li>
                    </ul>
                </div>
                <div class="mypage__box mypage__box--sign">
                    <h2 class="mypage__box-title">Sign-in History</h2>
                    <div class="col-titlebox clearfix">
                        <div class="column column1 float-left">Date</div>
                        <div class="column column2 float-left">IP Address</div>
                        <div class="column column3 float-left">Method</div>
                        <div class="column column4 float-left text-right">Location</div>
                    </div>

                    <ul class="mypage__itembox">
                        <li class="mypage__item clearfix mypage__item--sign" v-for="(history, index) in historys" v-bind:key="index">
                            <div class="column column1 float-left">{{ history.time | moment("from") }}</div>
                            <div class="column column2 float-left">{{ history.ip_addr }}</div>
                            <div class="column column3 float-left">{{ history.browser }}</div>
                            <div class="column column4 float-left text-right">{{ history.location }}</div>
                        </li>
                    </ul>
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
    </div>
</template>

<script src="./account.js"></script>
