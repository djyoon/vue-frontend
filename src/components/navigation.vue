<template>
  <div>
    <div class="header">
        <div class="wrap wrap_header">
            <div class="header__logo float-left">
                <router-link to="/" class="header__link">
                    <img class="logo_icon" src="../images/main/emblem.png"
                         srcset="../images/main/emblem@2x.png 2x,
                                ../images/main/emblem@3x.png 3x">
                    <img class="logo_typo" src="../images/main/logo.svg">
                </router-link>
            </div>
            <div class="header__gnb float-left">
                <router-link to="/exchange">Exchange</router-link>
                <router-link to="/router-link">Service</router-link>
            </div>
            <div class="header__oauth float-right">
                <div class="header__oauth-linkbox float-left">
                    <router-link to="/login" v-if="!isLogin">Login</router-link>

                    <router-link to="/order-open" v-if="isLogin">Orders</router-link>
                    <router-link to="/balances" v-if="isLogin">Balances</router-link>
                </div>
                <div class="float-left header__sign">
                    <router-link to="/signup" v-if="!isLogin">Sign Up</router-link>

                    <!-- 로그인 후 { -->
                    <div class="header__user-info select--custom--box" v-if="isLogin">
                        <button class="header__select haeder__user-mail i-am-a-popover-trigger" v-on:click="toggleAccountMenu">{{ loginEmail }}</button>
                        <ul class="select--custom i-am-a-popover close-me-by-clicking-outside-of-me" v-if="showAccountMenu" v-on-click-outside="closeAccountMenu">
                            <li class="select__option"><button @click="gotoAccount">Account Infomation</button></li>
                            <li class="select__option"><button @click="logout">Log out</button></li>
                        </ul>
                    </div>
                    <!-- } -->
                </div>
                <div class="header__lang select--custom--box">
                    <button class="header__select i-am-a-popover-trigger" v-on:click="toggleLanguageMenu">
                        <img src="../images/main/flag.png"
                             srcset="../images/main/flag@2x.png 2x,
                                         ../images/main/flag@3x.png 3x"
                             class="flag">
                        English
                    </button>
                    <ul class="select--custom i-am-a-popover close-me-by-clicking-outside-of-me" v-if="showLanguageMenu" v-on-click-outside="closeLanguageMenu">
                        <li class="select__option">
                            <router-link to="#//">
                                <img src="../images/main/flag.png"
                                     srcset="../images/main/flag@2x.png 2x,
                                         ../images/main/flag@3x.png 3x"
                                     class="flag">
                                English
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 모바일 메뉴 버튼 -->
            <button class="header__btn-menu" v-on:click="showMobileGnb = !showMobileGnb">
                <img src="../images/main/baseline-menu-24-px-copy-4.png"
                     srcset="../images/main/baseline-menu-24-px-copy-4@2x.png 2x,
                            ../images/main/baseline-menu-24-px-copy-4@3x.png 3x"
                     class="baseline-menu-24px-copy-4">
            </button>
        </div>
    </div>

    <transition name="gnb-slide">
      <div class="mgnb" v-if="showMobileGnb">
          <ul class="mgnb__depth1">
              <li class="mgnb__depth1-li">
                  <router-link class="mgnb__depth1-link" to="/exchange">Exchange</router-link>
              </li>
              <li class="mgnb__depth1-li">
                  <router-link class="mgnb__depth1-link" to="#//">Service</router-link>
              </li>
              <li class="mgnb__depth1-li">
                  <router-link class="mgnb__depth1-link" to="/order-open" v-if="isLogin">Orders</router-link>
              </li>
              <li class="mgnb__depth1-li">
                  <router-link class="mgnb__depth1-link" to="/balances" v-if="isLogin">Balances</router-link>
              </li>
              <li class="mgnb__depth1-li" v-if="isLogin">
                  <button class="mgnb__depth1-link mgnb__depth1-link--color-blue js-btn-depth i-am-a-popover-trigger" v-on:click="toggleAccountMenu">{{ loginEmail }}</button>
                  <transition name="mgnb-slide">
                    <ul class="mgnb__depth2 js-depth-target1 i-am-a-popover close-me-by-clicking-outside-of-me" v-if="showAccountMenu" v-on-click-outside="closeAccountMenu">
                        <li class="mgnb__depth2-li">
                            <button class="mgnb__depth2-link" @click="gotoAccount">Account Information</button>
                        </li>
                        <li class="mgnb__depth2-li">
                            <button class="mgnb__depth2-link" @click="logout">Log out</button>
                        </li>
                    </ul>
                  </transition>
              </li>
              <li class="mgnb__depth1-li" v-if="!isLogin" v-on:click="showMobileGnb = !showMobileGnb">
                  <router-link class="mgnb__depth1-link" to="/login">Login</router-link>
              </li>
              <li class="mgnb__depth1-li" v-if="!isLogin" v-on:click="showMobileGnb = !showMobileGnb">
                  <router-link class="mgnb__depth1-link" to="/signup">Sign up</router-link>
              </li>
              <li class="mgnb__depth1-li">
                  <a class="mgnb__depth1-link js-btn-depth i-am-a-popover-trigger" href="#//" v-on:click="toggleLanguageMenu">
                      <img src="../images/main/flag.png"
                           srcset="../images/main/flag@2x.png 2x,
                                       ../images/main/flag@3x.png 3x"
                           class="flag">
                      English
                  </a>
                  <transition name="mgnb-slide">
                    <ul class="mgnb__depth2 js-depth-target2 i-am-a-popover close-me-by-clicking-outside-of-me" v-if="showLanguageMenu" v-on-click-outside="closeLanguageMenu">
                        <li class="mgnb__depth2-li">
                            <a class="mgnb__depth2-link" href="#//">
                                <img src="../images/main/flag.png"
                                     srcset="../images/main/flag@2x.png 2x,
                                         ../images/main/flag@3x.png 3x"
                                     class="flag">
                                English
                            </a>
                        </li>
                    </ul>
                  </transition>
              </li>
          </ul>
      </div>
    </transition>
  </div>
</template>

<script src="./navigation.js"></script>

<style>
.gnb-slide-enter-active, .gnb-slide-leave-active {
  transition: all .5s ease;
  transform: translateY(0);
}
.gnb-slide-enter, .gnb-slide-leave-to {
  transform: translateY(-400px);
  opacity: 0;
}
.mgnb-slide-enter-active, .mgnb-slide-leave-active {
  transition: max-height .5s ease;
  max-height: 200px;
}
.mgnb-slide-enter, .mgnb-slide-leave-to {
  max-height: 0;
}
</style>
