<template>
    <div class="footer">
        <div class="wrap">
            <div class="footer__info">
                <div class="footer__logo">
                    <a href="./">
                        <img src="../images/main/emblem-gray.png"
                             srcset="../images/main/emblem-gray@2x.png 2x,
                                     ../images/main/emblem-gray@3x.png 3x">
                        <img src="../images/main/logo-gray.png"
                             srcset="../images/main/logo-gray@2x.png 2x,
                                     ../images/main/logo-gray@3x.png 3x">
                    </a>
                </div>
                <p class="footer__vision">
                    The leading global digital asset exchange
                </p>
                <div class="footer__snsbox clearfix">
                    <a href="" class="footer__sns footer__sns--facebook">페이스북</a>
                    <a href="" class="footer__sns footer__sns--twitter">트위터</a>
                    <a href="" class="footer__sns footer__sns--youtube">유튜브</a>
                    <a href="" class="footer__sns footer__sns--instagram">인스타그램</a>
                </div>
                <p class="footer__copy">
                    Copyright &copy; 2018 jampick.
                </p>
            </div>
            <ul class="footer__gnb clearfix">
                <li class="float-left footer__gnb-libox">
                    <h2 class="footer__gnb-title" @click="toggleSupport()" :class="{active: visibleSupport}">Support</h2>
                    <transition name="footer-slide">
                      <div class="footer__gnb-depth" v-if="visibleSupport">
                          <a href="" class="footer__gnb-link">Guides</a>
                          <a href="" class="footer__gnb-link">FAQ</a>
                          <a href="" class="footer__gnb-link">Announcements</a>
                      </div>
                    </transition>
                </li>
                <li class="float-left footer__gnb-libox">
                    <h2 class="footer__gnb-title" @click="toggleTerms()" :class="{active: visibleTerms}">Terms</h2>
                    <transition name="footer-slide">
                    <div class="footer__gnb-depth" v-if="visibleTerms">
                        <a href="" class="footer__gnb-link">Terms of Service</a>
                        <a href="" class="footer__gnb-link">Transaction Regulation</a>
                        <a href="" class="footer__gnb-link">Fees</a>
                        <a href="" class="footer__gnb-link">Terms of Privacy Policy</a>
                        <a href="" class="footer__gnb-link">KYC&amp;AML Policies</a>
                    </div>
                    </transition>
                </li>
                <li class="float-left footer__gnb-libox">
                    <h2 class="footer__gnb-title" @click="toggleContact()" :class="{active: visibleContact}">Contact Us</h2>
                    <transition name="footer-slide">
                    <div class="footer__gnb-depth" v-if="visibleContact">
                        <a href="" class="footer__gnb-link">e-mail address</a>
                    </div>
                    </transition>
                </li>
            </ul>
            <p class="footer__copy--mobile">
                Copyright &copy; 2018 jampick.
            </p>
        </div>
    </div>
</template>

<script src="./footer.js"></script>

<style>
.footer-slide-enter-active, .footer-slide-leave-active {
  transition: max-height .5s;
  max-height: 200px;
}
.footer-slide-enter, .footer-slide-leave-to {
  transition: max-height .5s;
  max-height: 0;
}
</style>
