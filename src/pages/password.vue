<template>

    <div class="container">
        <div class="oauth">
            <div class="wrap">
                <div class="container__title">
                    <h1>Change password</h1>
                    <p>If you change your password, you will not be able to withdraw funds for 24 hours.</p>
                </div>
                    <div class="form">
                        <div class="form__group">
                            <label for="" class="form__title">Old Password</label>
                            <div class="form__box">
                                <input type="password" class="form__input" v-bind:class="{ wrong: error_old.length > 0 }" v-model="old_pwd" maxlength="16">
                                <p class="form__wrong-text" v-if="error_old.length > 0">{{ error_old }}</p>
                            </div>
                        </div>

                        <div class="form__group">
                            <label for="" class="form__title">New Password</label>
                            <div class="form__box">
                                <input type="password" class="form__input" v-bind:class="{ wrong: error_new.length > 0 }" v-model="new_pwd" maxlength="16"
                                       placeholder="Enter 8 to 16 characters with a mix of letters and numbers">
                                <p class="form__wrong-text" v-if="error_new.length > 0">{{ error_new }}</p>
                            </div>
                        </div>

                        <div class="form__group">
                            <label for="" class="form__title">Confirm Password</label>
                            <div class="form__box">
                                <input type="password" class="form__input" v-bind:class="{ wrong: error_confirm.length > 0 }" v-model="confirm_pwd" maxlength="16">
                                <p class="form__wrong-text" v-if="error_confirm.length > 0">{{ error_confirm }}</p>
                            </div>
                        </div>

                        <p class="form__wrong-message" v-if="error_common.length > 0">{{ error_common }}</p>
                        <div class="form__group form__group--btnbox">
                            <button type="button" class="btn btn--cancel float-left btn--half" :disabled="api_calling" @click="gotoAccount">Cancel</button>
                            <button type="submit" class="btn btn--confirm float-right btn--half" :disabled="api_calling" @click="changePwd">Confirm</button>
                        </div>

                    </div>
            </div>
        </div>

        <div v-if="reset_success">
            <div class="blackbg"></div>
            <div class="modal">
                <div class="text-center">
                    <div class="madal__iconbox"><img src="../images/icon/check.png" alt=""></div>
                    <h2 class="modal__title">Password change successful</h2>
                    <p class="modal__desc">
                        Your password has been changed.<br/>
                        Please login again.
                    </p>
                    <div class="modal__btnbox">
                        <a class="btn btn--confirm btn--single" @click="logout">Confirm</a>
                    </div>
                </div>
            </div>
        </div>

        <OtpAuth v-if="showOtpAuth" v-on:enterOtp="enterOtp" v-on:hideOtp="hideOtp" :error_message="error_otp"></OtpAuth>
    </div>

</template>
<script src="./password.js"></script>
