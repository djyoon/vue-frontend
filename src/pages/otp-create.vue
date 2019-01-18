<template>
    <div class="container">
            <div class="join oauth">
                <div class="wrap">
                    <div class="container__title">
                        <h1>Link Google Authenticator</h1>
                        <p>Recommended to be used for withdrawal password & security settings modifications.</p>
                    </div>
                        <div class="form">

                            <div class="auth-step">
                                <div class="auth-step__title">
                                    <span>1</span> Add and back up key.
                                </div>
                                <p class="auth-step__desc">
                                    Open Google Auth and scan the below QR code or enter the below key manually to add a security token.
                                </p>
                                <p class="auth-step__desc auth-step__desc--red">
                                    This key is required to retrieve your Google Auth when you change or lose your phone.
                                </p>
                                <a href="" class="textbutton">How to use OTP?</a>

                                <div class="auth-step__codebox clearfix">
                                    <div class="float-left auth-step__qrcode">
                                        <img alt="" v-bind:src="qr_code">
                                    </div>
                                    <div class="float-left auth-step__codetext">
                                        Secret Key
                                        <p>
                                            {{ secret }} <button class="textbutton"
                                                                 v-clipboard:copy="secret"
                                                                 v-clipboard:success="onCopyToClipboard"
                                                                 v-clipboard:error="onErrorClipboard">Copy</button>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="auth-step">
                                <div class="auth-step__title">
                                    <span>2</span> Enter the 6-digit verification code.
                                </div>
                                <div class="form__group">
                                    <label for="" class="form__title">OTP Code</label>
                                    <div class="form__box">
                                        <input type="text" class="form__input" v-model="otp">
                                        <p class="form__wrong-text" v-if="error_otp.length > 0">{{ error_otp }}</p>
                                    </div>
                                </div>
                                <div class="form__group form__group--btnbox">
                                    <button type="submit" class="btn btn--confirm" @click="submitOtp">Confirm</button>
                                </div>
                            </div>

                        </div>
                </div>
            </div>
        </div>
</template>

<script src="./otp-create.js"></script>
