<template>
  <div class="ocha-header" @click="onClick()">
    <b-container>
      <div class="ocha-header-container">
        <a href="#" data-toggle="dropdown" class="ocha-services" aria-label="OCHA services">
          <span class="ocha-logo" />
          <span class="ocha-services-text">OCHA Services</span>

          <svg class="icon-o-arrow-up" viewBox="0 0 48 48"><path d="M0,34a4,4,0,0,1,1.17-2.83l20-20a4,4,0,0,1,5.66,0l20,20a4,4,0,1,1-5.66,5.66L24,19.66,6.83,36.83A4,4,0,0,1,0,34Z" /></svg>
          <svg class="icon-o-arrow-down" viewBox="0 0 48 48"><path d="M48,14a4,4,0,0,1-1.17,2.83l-20,20a4,4,0,0,1-5.66,0l-20-20a4,4,0,0,1,5.66-5.66L24,28.34,41.17,11.17A4,4,0,0,1,48,14Z" /></svg>
        </a>
        <div ref="menu" class="dropdown-menu ocha-services-menu-container" role="menu" style="z-index: 1003;">
          <b-container>
            <div class="ocha-services-menu">
              <div>
                <p class="list-title">
                  Related Platforms
                </p>
                <ul class="ocha-links-list">
                  <li><a href="https://humdata.org/" target="_blank">Humanitarian Data Exchange (HDX)</a></li>
                  <li><a href="https://tools.humdata.org/" target="_blank">HDX Tools</a></li>
                  <li><a href="http://hxlstandard.org/" target="_blank">Humanitarian Exchange Language (HXL)</a></li>
                </ul>
              </div>
              <div>
                <p class="list-title">
                  Other OCHA Services
                </p>
                <ul class="ocha-links-list">
                  <li>
                    <a href="https://fts.unocha.org/" target="_blank">Financial Tracking Service</a>
                  </li>
                  <li>
                    <a href="https://data.humdata.org/" target="_blank">Humanitarian Data Exchange</a>
                  </li>
                  <li>
                    <a href="https://humanitarian.id/" target="_blank">Humanitarian ID</a>
                  </li>
                  <li>
                    <a href="https://hum-insight.info/" target="_blank">Humanitarian InSight</a>
                  </li>
                  <li>
                    <a href="https://www.humanitarianresponse.info" target="_blank">Humanitarian Response</a>
                  </li>
                </ul>
              </div>
              <div>
                <p class="list-title list-title-empty">
  &nbsp;
                </p>
                <ul class="ocha-links-list">
                  <li><a href="https://interagencystandingcommittee.org/" target="_blank">Inter-Agency Standing Committee</a></li>
                  <li><a href="https://www.unocha.org" target="_blank">OCHA Website</a></li>
                  <li><a href="https://reliefweb.int" target="_blank">Relief Web</a></li>
                  <li><a href="https://vosocc.unocha.org/" target="_blank">Virtual OSOCC</a></li>
                </ul>
              </div>
              <div>
                <a href="https://www.unocha.org/ocha-digital-services" target="_blank" class="btn ocha-see-all">See all</a>
              </div>
            </div>
          </b-container>
        </div>
      </div>
    </b-container>
  </div>
</template>
<style lang='scss'>
.ocha-header {
  background-color: #252525;
  color: #FFF;
  line-height: 35px;
  padding: 0 45px;
  .ocha-header-container {
    height: 35px;
    margin: 0 auto;
    max-width: 1176px;
    width: 100%;
    .ocha-services {
      align-items: center;
      color: #EEE;
      display: inline-flex;
      font-family: helvetica, arial, sans-serif;
      font-size: 12px;
      font-weight: 400;
      .ocha-logo {
        background: url('"~@/assets/logos/ocha-white.svg') 50% no-repeat;
        background-size: contain;
        display: inline-block;
        flex-shrink: 0;
        height: 18px;
        margin-right: 4px;
        width: 21px;
      }
      .icon-o-arrow-up {
        display: none;
      }
      .icon-o-arrow-up,
      .icon-o-arrow-down {
        margin-left: 10px;
        height: 9px;
        fill: #EEE;
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .ocha-services-menu-container {
    .ocha-services-menu {
      color: #EEE;
      display: flex;
      font-family: helvetica, arial, sans-serif;
      font-size: 12px;
      font-weight: 600;
      justify-content: space-between;
      margin: 0 auto;
      max-width: 1176px;
      padding: 22px 0;
      width: 100%;
      .btn.ocha-see-all {
        background-color: #CCC;
        border: 0;
        color: #0077ce;
        font-family: 'Gotham-Bold';
        font-size: 12px;
        height: 43px;
        line-height: 34px;
        padding: 4px !important;
        text-align: center;
        text-transform: uppercase;
        width: 210px;
        &:hover {
          background-color: #888;
        }
      }
    }
  }
  .dropdown-menu {
    background-color: #333;
    border: 0;
    border-radius: 0;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
    display: none;
    left: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 35px;
    width: 100%;
    z-index: 1002;
    &.active {
      display: block;
    }
    .list-title {
      margin-bottom: 0;
      line-height: 21px;
    }
    .ocha-links-list {
      list-style-type: none;
      margin-top: 0;
      padding: 0;
      li {
        font-size: 12px;
        line-height: 21px;
        margin-top: 6px;
        a {
          color: #FFF;
          &:hover {
            color: #F2645A;
          }
        }
      }
    }
    .list-title {
      color: #EEE;
      font-size: 12px;
      font-weight: 400;
      margin-top: 0;
    }
  }
}

@media only screen and (max-width: 992px) {
  .ocha-header {
    padding: 0 5px;
    .ocha-services-menu-container {
      .ocha-services-menu {
        flex-flow: column;
        padding: 0 30px;
      }
    }
    .dropdown-menu {
      padding-bottom: 30px;
      .list-title {
        margin-top: 20px;
        &.list-title-empty {
          display: none;
        }
      }
    }
  }
}
</style>
<script>
export default {
  name: 'OchaHeader',
  components: {},
  props: [],
  data () {
    return {}
  },
  methods: {
    onClick () {
      const menu = this.$refs.menu
      menu.classList.toggle('active')
    }
  }
}
</script>
