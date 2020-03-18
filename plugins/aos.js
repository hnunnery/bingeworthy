import Vue from "vue";
import AOS from "aos";

Vue.use(AOS);

export default ({ app }, inject) => {
  app.AOS = new AOS.init();
};