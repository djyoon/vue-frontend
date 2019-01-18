<template>
    <div class="container">
        <div class="join oauth">
            <div class="wrap">
                <div class="container__title">
                    <h1>Disable OTP Authenticator</h1>
                    <p>OTP authentication is enabled.<br/>
                      Enter OTP Code to disable OTP authentication.</p>
                </div>
                    <div class="form">
                        <div class="form__group">
                            <label for="" class="form__title">OTP code</label>
                            <div class="form__box">
                                <input type="password" class="form__input" v-bind:class="{ wrong: error_otp.length > 0 }" placeholder="Enter the 6-digit verification code." v-model="code" maxlength="6">
                                <p class="form__wrong-text" v-if="error_otp.length > 0">{{ error_otp }}</p>
                            </div>
                        </div>

                        <div class="form__group form__group--btnbox">
                            <button type="submit" class="btn btn--confirm" :disabled="api_calling" @click="resetOtp">Confirm</button>
                        </div>
                    </div>
            </div>
        </div>

        <div v-if="progress">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <div class="madal__iconbox"><img src="../images/icon/check.png" alt=""></div>
                    <h2 class="modal__title">Please wait.</h2>
                </div>
            </div>
        </div>


        <div v-if="reset_success">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <div class="madal__iconbox"><img src="../images/icon/check.png" alt=""></div>
                    <h2 class="modal__title">Request to disable OTP authentication</h2>
                    <p class="modal__desc">
                        Please check your email.<br/>
                        ({{ login_email }})
                    </p>
                    <div class="modal__btnbox">
                        <router-link to="/account" class="btn btn--confirm btn--single">Confirm</router-link>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>




<script src="./otp-remove.js"></script>
