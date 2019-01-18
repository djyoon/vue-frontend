<template>
  <div class="container">
      <div class="login oauth">
          <div class="wrap">
              <h1 class="oauth__title">Login</h1>
              <form v-on:submit.prevent="submitLogin">
                  <div class="form">
                      <div class="form__group">
                          <label for="email" class="form__title">Email</label>
                          <div class="form__box">
                              <input type="text" id="email" class="form__input" v-bind:class="{ wrong: error_email.length > 0 }" v-model="email" maxlength="60">
                              <p class="form__wrong-text" v-if="error_email.length > 0">{{ error_email }}</p>
                          </div>
                      </div>

                      <div class="form__group form__group--mb2">
                          <label for="password" class="form__title" >Password</label>
                          <div class="form__box">
                              <input type="password" id="password" class="form__input" v-bind:class="{ wrong: error_password.length > 0 }" v-model="password" maxlength="16">
                              <p class="form__wrong-text" v-if="error_password.length > 0">{{ error_password }}</p>
                          </div>
                      </div>

                      <div class="form__group">
                          <p class="form__wrong-message" v-if="error_common.length > 0">{{ error_common }}</p>
                          <button type="submit" class="btn btn--login" :disabled="api_calling">Login</button>
                      </div>
                      <div class=" clearfix">
                          <router-link to="/signup" class="textbutton float-left">Sign up</router-link>
                          <router-link to="/forgot" class="textbutton float-right">Forgot Password?</router-link>
                      </div>
                  </div>
              </form>
          </div>
      </div>
  </div>
</template>

<script src="./login.js"></script>
