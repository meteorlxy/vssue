/*!
 * vssue - A vue-powered issue-based comment plugin
 *
 * @version v0.7.3
 * @link https://vssue.js.org
 * @license MIT
 * @copyright 2018-2019 meteorlxy
 */

import { Prop, Inject, Component, Vue as Vue$1, Watch, Provide } from 'vue-property-decorator';
import Vue from 'vue';
import { formatDateTime, getCleanURL } from '@vssue/utils';
import VueI18n from 'vue-i18n';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var script = Vue.extend({
    name: 'TransitionFade',
    functional: true,
    props: {
        group: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    render(h, { props, children }) {
        return h(props.group ? 'TransitionGroup' : 'Transition', {
            props: {
                name: 'fade',
                mode: 'out-in',
                appear: true,
            },
        }, children);
    },
});

/* script */
            const __vue_script__ = script;
            
/* template */

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "TransitionFade.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var TransitionFade = __vue_normalize__(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var script$1 = Vue.extend({
    name: 'Iconfont',
});

/* script */
            const __vue_script__$1 = script$1;
            
/* template */
var __vue_render__ = function (_h,_vm) {var _c=_vm._c;return _c('svg',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}]},[_c('symbol',{attrs:{"id":"vssue-icon-bitbucket","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M575.330231 490.861714q4.534857 35.986286-28.891429 57.709714t-63.707429 3.437714q-22.308571-9.728-30.573714-33.133714t-0.292571-46.884571 29.696-33.133714q20.553143-10.313143 41.398857-6.875429t36.571429 20.260571 15.725714 38.546286zM638.745088 478.866286q-7.972571-61.147429-64.585143-93.696t-112.566857-7.460571q-35.986286 16.018286-57.417143 50.541714t-19.748571 74.020571q2.267429 52.004571 44.251429 88.576t94.573714 32.036571q52.004571-4.534857 86.820571-47.981714t28.598857-96.036571zM775.375945 169.179429q-11.410286-15.433143-32.036571-25.453714t-33.133714-12.580571-40.594286-7.168q-166.253714-26.843429-323.437714 1.170286-24.576 4.022857-37.741714 6.875429t-31.451429 12.580571-28.598857 24.576q17.115429 16.018286 43.446857 25.965714t41.984 12.580571 50.029714 6.582857q130.267429 16.603429 256 0.585143 35.986286-4.534857 51.126857-6.875429t41.398857-12.288 42.861714-26.550857zM807.924517 760.539429q-4.534857 14.848-8.850286 43.739429t-7.972571 47.981714-16.310857 40.009143-33.133714 32.256q-49.152 27.428571-108.251429 40.886857t-115.419429 12.580571-115.126857-10.605714q-26.258286-4.534857-46.592-10.313143t-43.739429-15.433143-41.691429-24.868571-29.696-35.108571q-14.262857-54.857143-32.548571-166.838857l3.437714-9.142857 10.313143-5.12q127.414857 84.553143 289.426286 84.553143t290.011429-84.553143q11.995429 3.437714 13.677714 13.165714t-2.852571 25.746286-4.534857 21.138286zM911.348517 211.456q-14.848 95.451429-63.414857 374.272-2.852571 17.115429-15.433143 32.036571t-24.868571 22.820571-31.158857 17.700571q-144.018286 71.972571-348.598857 50.322286-141.677714-15.433143-225.133714-79.433143-8.557714-6.875429-14.555429-15.140571t-9.728-19.968-5.12-19.456-3.437714-22.601143-3.145143-19.968q-5.12-28.598857-15.140571-85.723429t-16.018286-92.306286-13.458286-84.260571-12.580571-90.258286q1.682286-14.848 10.020571-27.721143t17.993143-21.430857 25.746286-17.115429 26.258286-12.873143 27.428571-10.605714q71.460571-26.258286 178.834286-36.571429 216.576-21.138286 386.267429 28.598857 88.576 26.258286 122.88 69.705143 9.142857 11.410286 9.435429 29.110857t-3.145143 30.866286z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-github","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M512 12.64c-282.752 0-512 229.216-512 512 0 226.208 146.72 418.144 350.144 485.824 25.6 4.736 35.008-11.104 35.008-24.64 0-12.192-0.48-52.544-0.704-95.328-142.464 30.976-172.512-60.416-172.512-60.416-23.296-59.168-56.832-74.912-56.832-74.912-46.464-31.776 3.52-31.136 3.52-31.136 51.392 3.616 78.464 52.768 78.464 52.768 45.664 78.272 119.776 55.648 148.992 42.56 4.576-33.088 17.856-55.68 32.512-68.48-113.728-12.928-233.28-56.864-233.28-253.024 0-55.904 20-101.568 52.768-137.44-5.312-12.896-22.848-64.96 4.96-135.488 0 0 43.008-13.76 140.832 52.48 40.832-11.36 84.64-17.024 128.16-17.248 43.488 0.192 87.328 5.888 128.256 17.248 97.728-66.24 140.64-52.48 140.64-52.48 27.872 70.528 10.336 122.592 5.024 135.488 32.832 35.84 52.704 81.536 52.704 137.44 0 196.64-119.776 239.936-233.792 252.64 18.368 15.904 34.72 47.04 34.72 94.816 0 68.512-0.608 123.648-0.608 140.512 0 13.632 9.216 29.6 35.168 24.576 203.328-67.776 349.856-259.616 349.856-485.76 0-282.784-229.248-512-512-512z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-gitlab","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M59.544137 403.419429L512.115566 983.405714 16.09728 623.396571a39.936 39.936 0 0 1-14.299429-43.995428l57.709715-176.018286z m264.009143 0h377.161143L512.152137 983.405714zM210.40128 53.723429l113.152 349.696H59.544137l113.152-349.696a20.041143 20.041143 0 0 1 37.705143 0z m754.285714 349.696l57.709715 176.018285a39.862857 39.862857 0 0 1-14.299429 43.995429l-496.018286 360.009143 452.571429-579.986286z m0 0h-264.009143l113.152-349.696a20.041143 20.041143 0 0 1 37.705143 0z","fill":""}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-loading","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M843.307 742.24c0 3.217 2.607 5.824 5.824 5.824s5.824-2.607 5.824-5.824a5.823 5.823 0 0 0-5.824-5.824 5.823 5.823 0 0 0-5.824 5.824zM714.731 874.912c0 6.398 5.186 11.584 11.584 11.584s11.584-5.186 11.584-11.584-5.186-11.584-11.584-11.584-11.584 5.186-11.584 11.584zM541.419 943.2c0 9.614 7.794 17.408 17.408 17.408s17.408-7.794 17.408-17.408-7.794-17.408-17.408-17.408-17.408 7.794-17.408 17.408z m-186.56-9.152c0 12.795 10.373 23.168 23.168 23.168s23.168-10.373 23.168-23.168-10.373-23.168-23.168-23.168-23.168 10.373-23.168 23.168zM189.355 849.12c0 16.012 12.98 28.992 28.992 28.992s28.992-12.98 28.992-28.992-12.98-28.992-28.992-28.992-28.992 12.98-28.992 28.992zM74.731 704.736c0 19.228 15.588 34.816 34.816 34.816s34.816-15.588 34.816-34.816-15.588-34.816-34.816-34.816-34.816 15.588-34.816 34.816z m-43.008-177.28c0 22.41 18.166 40.576 40.576 40.576s40.576-18.166 40.576-40.576-18.166-40.576-40.576-40.576-40.576 18.166-40.576 40.576z m35.392-176.128c0 25.626 20.774 46.4 46.4 46.4s46.4-20.774 46.4-46.4c0-25.626-20.774-46.4-46.4-46.4-25.626 0-46.4 20.774-46.4 46.4z m106.176-142.016c0 28.843 23.381 52.224 52.224 52.224s52.224-23.381 52.224-52.224c0-28.843-23.381-52.224-52.224-52.224-28.843 0-52.224 23.381-52.224 52.224z m155.904-81.344c0 32.024 25.96 57.984 57.984 57.984s57.984-25.96 57.984-57.984-25.96-57.984-57.984-57.984-57.984 25.96-57.984 57.984z m175.104-5.056c0 35.24 28.568 63.808 63.808 63.808s63.808-28.568 63.808-63.808c0-35.24-28.568-63.808-63.808-63.808-35.24 0-63.808 28.568-63.808 63.808z m160.32 72.128c0 38.421 31.147 69.568 69.568 69.568s69.568-31.147 69.568-69.568-31.147-69.568-69.568-69.568-69.568 31.147-69.568 69.568z m113.92 135.488c0 41.638 33.754 75.392 75.392 75.392s75.392-33.754 75.392-75.392-33.754-75.392-75.392-75.392-75.392 33.754-75.392 75.392z m45.312 175.488c0 44.854 36.362 81.216 81.216 81.216s81.216-36.362 81.216-81.216c0-44.854-36.362-81.216-81.216-81.216-44.854 0-81.216 36.362-81.216 81.216z","fill":""}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-like","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-unlike","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4-8.3-3.6-17.2-5.4-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81z m627.2 160.4H496.8l9.6 198.4c0.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7-19.6-0.1-36.9-13.4-42.2-32.3L329 459.2V172h415.4c20.4 9.2 33.6 29.4 33.6 51.8 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 19.1-11 37.5-28.8 48.4z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-heart","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-edit","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M723.2 917.76H286.72c-65.28 0-118.4-51.2-118.4-113.92V261.76C168.32 198.4 221.44 147.2 286.72 147.2h375.04c17.92 0 32 14.08 32 32s-14.08 32-32 32H286.72c-30.08 0-54.4 22.4-54.4 49.92v542.08c0 27.52 24.32 49.92 54.4 49.92H723.2c30.08 0 54.4-22.4 54.4-49.92V440.32c0-17.92 14.08-32 32-32s32 14.08 32 32v363.52c0 62.72-53.12 113.92-118.4 113.92z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M499.84 602.24c-7.68 0-14.72-2.56-21.12-7.68-13.44-11.52-14.72-32-3.2-45.44L780.16 198.4c11.52-13.44 32-14.72 45.44-3.2s14.72 32 3.2 45.44L524.16 591.36c-6.4 7.04-15.36 10.88-24.32 10.88z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-delete","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M677.647059 256l0-90.352941c0-37.436235-23.461647-60.235294-61.771294-60.235294L408.094118 105.411765c-38.249412 0-61.741176 22.799059-61.741176 60.235294l0 90.352941-180.705882 0 0 60.235294 60.235294 0 0 512c0 54.272 33.972706 90.352941 90.352941 90.352941l391.529412 0c55.085176 0 90.352941-33.490824 90.352941-90.352941l0-512 60.235294 0 0-60.235294L677.647059 256zM406.588235 165.647059l210.823529 0-1.264941 90.352941L406.588235 256 406.588235 165.647059zM737.882353 858.352941l-451.764706 0 0-542.117647 451.764706 0L737.882353 858.352941zM466.823529 376.470588l-58.729412 0-1.505882 391.529412 60.235294 0L466.823529 376.470588zM617.411765 376.470588l-60.235294 0 0 391.529412 60.235294 0L617.411765 376.470588z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-reply","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M426.666667 384 426.666667 213.333333 128 512 426.666667 810.666667 426.666667 635.733333C640 635.733333 789.333333 704 896 853.333333 853.333333 640 725.333333 426.666667 426.666667 384Z"}})]),_vm._v(" "),_c('symbol',{attrs:{"id":"vssue-icon-error","viewBox":"0 0 1024 1024"}},[_c('path',{attrs:{"d":"M512 720m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M480 416v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8z"}}),_vm._v(" "),_c('path',{attrs:{"d":"M955.7 856l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48z m-783.5-27.9L512 239.9l339.8 588.2H172.2z"}})])])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = true;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "Iconfont.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var Iconfont = __vue_normalize__$1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var script$2 = Vue.extend({
    name: 'VssueIcon',
    functional: true,
    props: {
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: null,
        },
    },
    render(h, { props, data }) {
        return h('svg', Object.assign({}, data, { 'class': [
                'vssue-icon',
                `vssue-icon-${props.name}`,
            ], attrs: {
                'aria-hidden': 'true',
            } }), [
            h('title', props.title),
            h('use', {
                attrs: {
                    'xlink:href': `#vssue-icon-${props.name}`,
                },
            }),
        ]);
    },
});

/* script */
            const __vue_script__$2 = script$2;
            
/* template */

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = undefined;
  /* component normalizer */
  function __vue_normalize__$2(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueIcon.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueIcon = __vue_normalize__$2(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

let VssueComment = class VssueComment extends Vue$1 {
    constructor() {
        super(...arguments);
        this.editMode = false;
        this.editContent = this.comment.contentRaw;
        this.creatingReactions = [];
        this.isPutingComment = false;
        this.isDeletingComment = false;
    }
    get currentUser() {
        return this.vssue.user ? this.vssue.user.username : null;
    }
    get content() {
        return this.comment.content;
    }
    get author() {
        return this.comment.author;
    }
    get createdAt() {
        return formatDateTime(this.comment.createdAt);
    }
    get updatedAt() {
        return formatDateTime(this.comment.updatedAt);
    }
    get showReactions() {
        return Boolean(this.vssue.API && this.vssue.API.platform.meta.reactable && this.comment.reactions && !this.editMode);
    }
    get reactionKeys() {
        return ['heart', 'like', 'unlike'];
    }
    get editContentRows() {
        return this.editContent.split('\n').length - 1;
    }
    get editInputRows() {
        return this.editContentRows < 3 ? 5 : this.editContentRows + 2;
    }
    async postReaction({ reaction, }) {
        try {
            if (this.creatingReactions.includes(reaction))
                return;
            this.creatingReactions.push(reaction);
            const success = await this.vssue.postCommentReaction({
                commentId: this.comment.id,
                reaction,
            });
            if (!success) {
                this.vssue.$emit('error', new Error(this.vssue.$t('reactionGiven', { reaction: this.vssue.$t(reaction) })));
            }
            // always refresh reactions even already given
            const reactions = await this.vssue.getCommentReactions({
                commentId: this.comment.id,
            });
            if (reactions) {
                this.comment.reactions = reactions;
            }
        }
        finally {
            this.creatingReactions.splice(this.creatingReactions.findIndex(item => item === reaction), 1);
        }
    }
    enterEdit() {
        this.editMode = true;
        this.$nextTick(() => {
            this.$refs.input.focus();
        });
    }
    resetEdit() {
        this.editMode = false;
        this.editContent = this.comment.contentRaw;
    }
    async putComment() {
        try {
            if (this.vssue.isPending)
                return;
            if (this.editContent !== this.comment.contentRaw) {
                this.isPutingComment = true;
                this.vssue.isUpdatingComment = true;
                const comment = await this.vssue.putComment({
                    commentId: this.comment.id,
                    content: this.editContent,
                });
                if (comment) {
                    this.vssue.comments.data.splice(this.vssue.comments.data.findIndex(item => item.id === this.comment.id), 1, comment);
                }
            }
            this.editMode = false;
        }
        finally {
            this.isPutingComment = false;
            this.vssue.isUpdatingComment = false;
        }
    }
    async deleteComment() {
        try {
            if (this.vssue.isPending)
                return;
            if (!window.confirm(this.vssue.$t('deleteConfirm')))
                return;
            this.isDeletingComment = true;
            this.vssue.isUpdatingComment = true;
            const success = await this.vssue.deleteComment({
                commentId: this.comment.id,
            });
            if (success) {
                // decrease count immediately
                this.vssue.comments.count -= 1;
                // if there are more than one comment on this page, remove the deleted comment immediately
                if (this.vssue.comments.data.length > 1) {
                    this.vssue.comments.data.splice(this.vssue.comments.data.findIndex(item => item.id === this.comment.id), 1);
                }
                // if the page count should be decreased, change the query param to trigger comments reload
                if (this.vssue.query.page > 1 && this.vssue.query.page > Math.ceil(this.vssue.comments.count / this.vssue.query.perPage)) {
                    this.vssue.query.page -= 1;
                }
                else {
                    await this.vssue.getComments();
                }
            }
            else {
                this.vssue.$emit('error', new Error(this.vssue.$t('deleteFailed')));
            }
        }
        finally {
            this.isDeletingComment = false;
            this.vssue.isUpdatingComment = false;
        }
    }
};
__decorate([
    Prop({
        type: Object,
        required: true,
    })
], VssueComment.prototype, "comment", void 0);
__decorate([
    Inject()
], VssueComment.prototype, "vssue", void 0);
VssueComment = __decorate([
    Component({
        components: {
            VssueIcon,
        },
    })
], VssueComment);
var script$3 = VssueComment;

/* script */
            const __vue_script__$3 = script$3;
            
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-comment",class:{
    'vssue-comment-edit-mode': _vm.editMode,
    'vssue-comment-disabled': _vm.isDeletingComment || _vm.isPutingComment,
  }},[_c('div',{staticClass:"vssue-comment-avatar"},[_c('a',{attrs:{"href":_vm.author.homepage,"title":_vm.author.username,"target":"_blank"}},[_c('img',{attrs:{"src":_vm.author.avatar}})])]),_vm._v(" "),_c('div',{staticClass:"vssue-comment-body"},[_vm._t("body",[_c('div',{staticClass:"vssue-comment-header"},[_c('span',{staticClass:"vssue-comment-author"},[_c('a',{attrs:{"href":_vm.author.homepage,"title":_vm.author.username,"target":"_blank"}},[_vm._v("\n            "+_vm._s(_vm.author.username)+"\n          ")])]),_vm._v(" "),_c('span',{staticClass:"vssue-comment-created-at"},[_vm._v("\n          "+_vm._s(_vm.createdAt)+"\n        ")])]),_vm._v(" "),_c('div',{staticClass:"vssue-comment-main"},[(_vm.editMode)?_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.editContent),expression:"editContent"}],ref:"input",staticClass:"vssue-edit-comment-input",attrs:{"rows":_vm.editInputRows},domProps:{"value":(_vm.editContent)},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }if(!$event.ctrlKey){ return null; }_vm.putComment();},"input":function($event){if($event.target.composing){ return; }_vm.editContent=$event.target.value;}}}):_c('article',{staticClass:"markdown-body",domProps:{"innerHTML":_vm._s(_vm.content)}})]),_vm._v(" "),_c('div',{staticClass:"vssue-comment-footer"},[(_vm.editMode)?_c('span',{staticClass:"vssue-comment-hint"},[_vm._v("\n          "+_vm._s(_vm.vssue.$t('editMode'))+"\n        ")]):_vm._e(),_vm._v(" "),(_vm.showReactions)?_c('span',{staticClass:"vssue-comment-reactions"},_vm._l((_vm.reactionKeys),function(reaction){return _c('span',{key:reaction,staticClass:"vssue-comment-reaction",attrs:{"title":_vm.vssue.$t(_vm.creatingReactions.includes(reaction) ? 'loading' : reaction)},on:{"click":function($event){_vm.postReaction({ reaction: reaction });}}},[_c('VssueIcon',{attrs:{"name":_vm.creatingReactions.includes(reaction) ? 'loading' : reaction,"title":_vm.vssue.$t(_vm.creatingReactions.includes(reaction) ? 'loading' : reaction)}}),_vm._v(" "),_c('span',{staticClass:"vssue-comment-reaction-number"},[_vm._v("\n              "+_vm._s(_vm.comment.reactions[reaction])+"\n            ")])],1)}),0):_vm._e(),_vm._v(" "),_c('span',{staticClass:"vssue-comment-operations"},[(_vm.comment.author.username === _vm.currentUser && _vm.editMode)?_c('span',{staticClass:"vssue-comment-operation",class:{ 'vssue-comment-operation-muted': _vm.isPutingComment },attrs:{"title":_vm.vssue.$t(_vm.isPutingComment ? 'loading' : 'submit')},on:{"click":function($event){_vm.putComment();}}},[_c('VssueIcon',{directives:[{name:"show",rawName:"v-show",value:(_vm.isPutingComment),expression:"isPutingComment"}],attrs:{"name":"loading","title":_vm.vssue.$t('loading')}}),_vm._v("\n\n            "+_vm._s(_vm.vssue.$t('submit'))+"\n          ")],1):_vm._e(),_vm._v(" "),(_vm.comment.author.username === _vm.currentUser && _vm.editMode)?_c('span',{staticClass:"vssue-comment-operation vssue-comment-operation-muted",attrs:{"title":_vm.vssue.$t('cancel')},on:{"click":function($event){_vm.resetEdit();}}},[_vm._v("\n            "+_vm._s(_vm.vssue.$t('cancel'))+"\n          ")]):_vm._e(),_vm._v(" "),(_vm.comment.author.username === _vm.currentUser)?_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.editMode),expression:"!editMode"}],staticClass:"vssue-comment-operation",on:{"click":function($event){_vm.enterEdit();}}},[_c('VssueIcon',{attrs:{"name":"edit","title":_vm.vssue.$t('edit')}})],1):_vm._e(),_vm._v(" "),(_vm.comment.author.username === _vm.currentUser || _vm.vssue.isAdmin)?_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.editMode),expression:"!editMode"}],staticClass:"vssue-comment-operation",on:{"click":function($event){_vm.deleteComment();}}},[_c('VssueIcon',{attrs:{"name":_vm.isDeletingComment ? 'loading' : 'delete',"title":_vm.vssue.$t(_vm.isDeletingComment ? 'loading' : 'delete')}})],1):_vm._e(),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(!_vm.editMode),expression:"!editMode"}],staticClass:"vssue-comment-operation",on:{"click":function($event){_vm.vssue.$emit('reply-comment', _vm.comment);}}},[_c('VssueIcon',{attrs:{"name":"reply","title":_vm.vssue.$t('reply')}})],1)])])])],2)])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* component normalizer */
  function __vue_normalize__$3(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueComment.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueComment$1 = __vue_normalize__$3(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

let VssuePagination = class VssuePagination extends Vue$1 {
    get disabled() {
        return this.vssue.isPending;
    }
    get pageCount() {
        const pageCount = Math.ceil(this.vssue.comments.count / this.vssue.comments.perPage);
        return pageCount > 1 ? pageCount : 1;
    }
    get perPageOptions() {
        const perPageOptions = [5, 10, 20, 50];
        if (!perPageOptions.includes(this.vssue.options.perPage) && this.vssue.options.perPage < 100) {
            perPageOptions.push(this.vssue.options.perPage);
        }
        return perPageOptions.sort((a, b) => a - b);
    }
    get page() {
        return this.vssue.query.page > this.pageCount ? this.pageCount : this.vssue.query.page;
    }
    set page(val) {
        if (val > 0 && val <= this.pageCount) {
            this.vssue.query.page = val;
        }
    }
    get perPage() {
        return this.vssue.query.perPage;
    }
    set perPage(val) {
        if (this.perPageOptions.includes(val)) {
            this.vssue.query.perPage = val;
        }
    }
};
__decorate([
    Inject()
], VssuePagination.prototype, "vssue", void 0);
VssuePagination = __decorate([
    Component({
        components: {
            VssueIcon,
        },
    })
], VssuePagination);
var script$4 = VssuePagination;

/* script */
            const __vue_script__$4 = script$4;
            
/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.vssue.comments.count > _vm.perPageOptions[0])?_c('div',{staticClass:"vssue-pagination"},[_c('div',{staticClass:"vssue-pagination-per-page"},[_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.perPage),expression:"perPage"}],staticClass:"vssue-pagination-select",attrs:{"disabled":_vm.disabled},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.perPage=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},_vm._l((_vm.perPageOptions),function(val){return _c('option',{key:val,domProps:{"value":val}},[_vm._v("\n        "+_vm._s(val)+"\n      ")])}),0),_vm._v(" "),_c('span',[_vm._v("\n      "+_vm._s(_vm.vssue.$t('perPage'))+"\n    ")]),_vm._v(" "),(_vm.vssue.API.platform.meta.sortable)?_c('span',{class:{
        'vssue-pagination-link': true,
        'disabled': _vm.disabled,
      },attrs:{"title":_vm.vssue.$t('sort')},on:{"click":function($event){_vm.vssue.query.sort = (_vm.vssue.query.sort === 'asc' ? 'desc' : 'asc');}}},[_vm._v("\n      "+_vm._s(_vm.vssue.query.sort === 'asc' ? "↑" : "↓")+"\n    ")]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"vssue-pagination-page"},[_c('span',{class:{
        'vssue-pagination-link': true,
        'disabled': _vm.page === 1 || _vm.disabled,
      },attrs:{"title":_vm.vssue.$t('prev')},domProps:{"textContent":_vm._s("<")},on:{"click":function($event){_vm.page -= 1;}}}),_vm._v(" "),_c('span',[_vm._v("\n      "+_vm._s(_vm.vssue.$t('page'))+"\n    ")]),_vm._v(" "),_c('select',{directives:[{name:"show",rawName:"v-show",value:(_vm.pageCount > 1),expression:"pageCount > 1"},{name:"model",rawName:"v-model",value:(_vm.page),expression:"page"}],staticClass:"vssue-pagination-select",attrs:{"disabled":_vm.disabled},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.page=$event.target.multiple ? $$selectedVal : $$selectedVal[0];}}},_vm._l((_vm.pageCount),function(val){return _c('option',{key:val,domProps:{"value":val}},[_vm._v("\n        "+_vm._s(val)+"\n      ")])}),0),_vm._v(" "),_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.pageCount < 2),expression:"pageCount < 2"}],domProps:{"textContent":_vm._s(_vm.page)}}),_vm._v(" "),_c('span',{domProps:{"textContent":_vm._s((" / " + _vm.pageCount + " "))}}),_vm._v(" "),_c('span',{class:{
        'vssue-pagination-link': true,
        'disabled': _vm.page === _vm.pageCount || _vm.disabled,
      },attrs:{"title":_vm.vssue.$t('next')},domProps:{"textContent":_vm._s(">")},on:{"click":function($event){_vm.page += 1;}}})])]):_vm._e()};
var __vue_staticRenderFns__$2 = [];

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* component normalizer */
  function __vue_normalize__$4(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssuePagination.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssuePagination$1 = __vue_normalize__$4(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

var script$5 = Vue.extend({
    name: 'VssueStatus',
    functional: true,
    props: {
        iconName: {
            type: String,
            required: false,
            default: null,
        },
    },
    render(h, { props, children }) {
        const content = [h('p', {
                class: 'vssue-status-info',
            }, children)];
        if (props.iconName) {
            content.unshift(h(VssueIcon, {
                props: {
                    name: props.iconName,
                },
            }));
        }
        return h('div', {
            class: 'vssue-status',
        }, content);
    },
});

/* script */
            const __vue_script__$5 = script$5;
            
/* template */

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = undefined;
  /* component normalizer */
  function __vue_normalize__$5(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueStatus.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueStatus = __vue_normalize__$5(
    {},
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

let VssueComments = class VssueComments extends Vue$1 {
};
__decorate([
    Inject()
], VssueComments.prototype, "vssue", void 0);
VssueComments = __decorate([
    Component({
        components: {
            TransitionFade,
            VssueComment: VssueComment$1,
            VssuePagination: VssuePagination$1,
            VssueStatus,
        },
    })
], VssueComments);
var script$6 = VssueComments;

/* script */
            const __vue_script__$6 = script$6;
            
/* template */
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-comments"},[_c('TransitionFade',[(_vm.vssue.isFailed)?_c('VssueStatus',{key:"failed",attrs:{"icon-name":"error"}},[_vm._v("\n      "+_vm._s(_vm.vssue.$t('failed'))+"\n    ")]):(_vm.vssue.isLoginRequired)?_c('VssueStatus',{key:"require-login"},[_c('a',{on:{"click":function($event){_vm.vssue.$emit('login');}}},[_vm._v("\n        "+_vm._s(_vm.vssue.$t('requireLogin'))+"\n      ")])]):(!_vm.vssue.comments)?_c('VssueStatus',{key:"loading-comments",attrs:{"icon-name":"loading"}},[_vm._v("\n      "+_vm._s(_vm.vssue.$t('loadingComments'))+"\n    ")]):(_vm.vssue.comments.data.length === 0)?_c('VssueStatus',{key:"no-comments"},[_vm._v("\n      "+_vm._s(_vm.vssue.$t('noComments'))+"\n    ")]):_c('div',{key:"comments-list",staticClass:"vssue-comments-list"},[_c('VssuePagination'),_vm._v(" "),_c('TransitionFade',{attrs:{"group":""}},_vm._l((_vm.vssue.comments.data),function(comment){return _c('VssueComment',{key:comment.id,attrs:{"comment":comment}})}),1),_vm._v(" "),_c('VssuePagination',{directives:[{name:"show",rawName:"v-show",value:(_vm.vssue.comments.data.length > 5),expression:"vssue.comments.data.length > 5"}]})],1)],1)],1)};
var __vue_staticRenderFns__$3 = [];

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* component normalizer */
  function __vue_normalize__$6(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueComments.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueComments$1 = __vue_normalize__$6(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

var script$7 = Vue.extend({
    name: 'VssueIcon',
    functional: true,
    props: {
        type: {
            type: String,
            required: false,
            default: 'default',
        },
    },
    render(h, { props, data, children }) {
        return h('button', Object.assign({}, data, { 'class': [
                'vssue-button',
                `vssue-button-${props.type}`,
            ] }), children);
    },
});

/* script */
            const __vue_script__$7 = script$7;
            
/* template */

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = undefined;
  /* component normalizer */
  function __vue_normalize__$7(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueButton.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueButton = __vue_normalize__$7(
    {},
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
    undefined
  );

let VssueNewComment = class VssueNewComment extends Vue$1 {
    constructor() {
        super(...arguments);
        this.content = '';
    }
    get user() {
        return this.vssue.user;
    }
    get platform() {
        return this.vssue.API && this.vssue.API.platform.name;
    }
    get disabled() {
        return this.content === '' || this.vssue.isPending;
    }
    get loading() {
        return this.vssue.isCreatingComment;
    }
    get contentRows() {
        return this.content.split('\n').length - 1;
    }
    get inputRows() {
        return this.contentRows < 3 ? 5 : this.contentRows + 2;
    }
    created() {
        this.vssue.$on('reply-comment', (comment) => {
            const quotedComment = comment.contentRaw.replace(/\n/g, '\n> ');
            const replyContent = `@${comment.author.username}\n\n> ${quotedComment}\n\n`;
            this.content = this.content.concat(replyContent);
            this.focus();
        });
    }
    beforeDestroy() {
        this.vssue.$off('reply-comment');
    }
    focus() {
        this.$refs.input.focus();
    }
    async submit() {
        if (this.vssue.isPending)
            return;
        await this.vssue.postComment({ content: this.content });
        this.content = '';
        await this.vssue.getComments();
    }
};
__decorate([
    Inject()
], VssueNewComment.prototype, "vssue", void 0);
VssueNewComment = __decorate([
    Component({
        components: {
            VssueButton,
            VssueIcon,
        },
    })
], VssueNewComment);
var script$8 = VssueNewComment;

/* script */
            const __vue_script__$8 = script$8;
            
/* template */
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-new-comment"},[_c('div',{staticClass:"vssue-comment-avatar"},[(_vm.user)?_c('a',{attrs:{"href":_vm.user.homepage,"title":_vm.user.username,"target":"_blank"}},[_c('img',{attrs:{"src":_vm.user.avatar}})]):_c('VssueIcon',{attrs:{"name":_vm.platform.toLowerCase(),"title":_vm.vssue.$t('loginToComment', { platform: _vm.platform })},on:{"click":function($event){_vm.vssue.$emit('login');}}})],1),_vm._v(" "),_c('div',{staticClass:"vssue-new-comment-body"},[_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.content),expression:"content"}],ref:"input",staticClass:"vssue-new-comment-input",attrs:{"rows":_vm.inputRows,"disabled":!_vm.user || _vm.loading,"placeholder":_vm.vssue.$t(_vm.user ? 'placeholder' : 'noLoginPlaceHolder'),"spellcheck":false},domProps:{"value":(_vm.content)},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }if(!$event.ctrlKey){ return null; }_vm.submit();},"input":function($event){if($event.target.composing){ return; }_vm.content=$event.target.value;}}})]),_vm._v(" "),_c('div',{staticClass:"vssue-new-comment-footer"},[(_vm.user)?_c('span',{staticClass:"vssue-current-user"},[_c('span',[_vm._v(_vm._s(_vm.vssue.$t('currentUser'))+" - "+_vm._s(_vm.user.username)+" - ")]),_vm._v(" "),_c('a',{staticClass:"vssue-logout",on:{"click":function($event){_vm.vssue.$emit('logout');}}},[_vm._v("\n        "+_vm._s(_vm.vssue.$t('logout'))+"\n      ")])]):_c('span',{staticClass:"vssue-current-user"},[_vm._v("\n      "+_vm._s(_vm.vssue.$t('loginToComment', { platform: _vm.platform }))+"\n    ")]),_vm._v(" "),_c('div',{staticClass:"vssue-new-comment-operations"},[(_vm.user)?_c('VssueButton',{staticClass:"vssue-button-submit-comment",attrs:{"type":"primary","disabled":_vm.disabled},on:{"click":function($event){_vm.submit();}}},[_c('VssueIcon',{directives:[{name:"show",rawName:"v-show",value:(_vm.loading),expression:"loading"}],attrs:{"name":"loading"}}),_vm._v("\n\n        "+_vm._s(_vm.vssue.$t(_vm.loading ? 'submitting' : 'submitComment'))+"\n      ")],1):_c('VssueButton',{staticClass:"vssue-button-login",attrs:{"type":"primary","title":_vm.vssue.$t('loginToComment', { platform: _vm.platform })},on:{"click":function($event){_vm.vssue.$emit('login', { platform: _vm.platform });}}},[_vm._v("\n        "+_vm._s(_vm.vssue.$t('login', { platform: _vm.platform }))+"\n      ")])],1)])])};
var __vue_staticRenderFns__$4 = [];

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* component normalizer */
  function __vue_normalize__$8(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueNewComment.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueNewComment$1 = __vue_normalize__$8(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

let VssueNotice = class VssueNotice extends Vue$1 {
    constructor() {
        super(...arguments);
        // progress data
        this.progress = {
            show: false,
            percent: 0,
            timer: null,
            speed: 200,
        };
        // alert data
        this.alert = {
            show: false,
            message: null,
            timer: null,
        };
    }
    /**
     * Show progress when loading comments
     */
    onLoadingCommentsChange(val) {
        if (this.vssue.comments) {
            if (val) {
                this.progressStart();
            }
            else {
                this.progressDone();
            }
        }
    }
    created() {
        this.vssue.$on('error', e => this.alertShow(e.message));
    }
    beforeDestroy() {
        this.vssue.$off('error');
        if (this.progress.timer !== null)
            window.clearTimeout(this.progress.timer);
        if (this.alert.timer !== null)
            window.clearTimeout(this.alert.timer);
    }
    /**
     * Progress start
     */
    progressStart() {
        this.progress.show = true;
        this.progress.percent = 0;
        this.progress.timer = window.setInterval(() => {
            this.progress.percent += 5;
            if (this.progress.percent > 94) {
                if (this.progress.timer !== null)
                    window.clearInterval(this.progress.timer);
            }
        }, this.progress.speed);
    }
    /**
     * Progress stop
     */
    progressDone() {
        this.progress.percent = 100;
        if (this.progress.timer !== null)
            window.clearTimeout(this.progress.timer);
        this.progress.timer = null;
        window.setTimeout(() => {
            this.progress.show = false;
        }, this.progress.speed);
    }
    /**
     * Show alert message
     */
    alertShow(content) {
        this.alert.show = true;
        this.alert.message = content;
        if (this.alert.timer !== null)
            window.clearTimeout(this.alert.timer);
        this.alert.timer = window.setTimeout(() => {
            this.alertHide();
        }, 3000);
    }
    /**
     * Hide alert message
     */
    alertHide() {
        this.alert.show = false;
        if (this.alert.timer !== null)
            window.clearTimeout(this.alert.timer);
        this.alert.timer = null;
    }
};
__decorate([
    Inject()
], VssueNotice.prototype, "vssue", void 0);
__decorate([
    Watch('vssue.isLoadingComments')
], VssueNotice.prototype, "onLoadingCommentsChange", null);
VssueNotice = __decorate([
    Component({
        components: {
            TransitionFade,
        },
    })
], VssueNotice);
var script$9 = VssueNotice;

/* script */
            const __vue_script__$9 = script$9;
            
/* template */
var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue-notice"},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.progress.show),expression:"progress.show"}],staticClass:"vssue-progress",style:({
      'width': ((_vm.progress.percent) + "%"),
      'transition': ("all " + (_vm.progress.speed) + "ms linear"),
    })}),_vm._v(" "),_c('TransitionFade',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.alert.show),expression:"alert.show"}],staticClass:"vssue-alert",domProps:{"textContent":_vm._s(_vm.alert.message)},on:{"click":function($event){_vm.alertHide();}}})])],1)};
var __vue_staticRenderFns__$5 = [];

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* component normalizer */
  function __vue_normalize__$9(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "VssueNotice.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueNotice$1 = __vue_normalize__$9(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    undefined,
    undefined
  );

const messages = {
    // auth
    login: 'Login with {platform}',
    logout: 'Logout',
    currentUser: 'Current User',
    // comment input
    loading: 'Loading',
    submit: 'Submit',
    submitting: 'Submitting',
    submitComment: 'Submit Comment',
    cancel: 'Cancel',
    edit: 'Edit',
    editMode: 'Edit Mode',
    delete: 'Delete',
    reply: 'Reply',
    // reactions
    heart: 'Heart',
    like: 'Like',
    unlike: 'Unlike',
    // pagination
    perPage: 'Comments per page',
    sort: 'Click to change the sort direction',
    page: 'Page',
    prev: 'Previous Page',
    next: 'Next Page',
    // hint
    comments: 'Comments | {count} Comments',
    loginToComment: 'Login with {platform} account to leave a comment',
    placeholder: 'Leave a comment. Styling with Markdown is supported. Ctrl + Enter to submit.',
    noLoginPlaceHolder: 'Login to leave a comment. Styling with Markdown is supported. ',
    // status
    initializing: 'Initializing...',
    loadingComments: 'Loading comments...',
    failed: 'Failed to load comments',
    requireLogin: 'Login to view comments',
    noComments: 'No comments yet. Leave the first comment !',
    // alerts
    reactionGiven: `Already given '{reaction}' reaction`,
    deleteConfirm: 'Confirm to delete this comment ?',
    deleteFailed: 'Failed to delete comment',
};

const messages$1 = {
    // auth
    login: '使用 {platform} 登录',
    logout: '退出登录',
    currentUser: '当前用户',
    // comment input
    loading: '加载中',
    submit: '提交',
    submitting: '发表中',
    submitComment: '发表评论',
    cancel: '取消',
    edit: '编辑',
    editMode: '编辑模式',
    delete: '删除',
    reply: '回复',
    // reactions
    heart: '喜欢',
    like: '赞',
    unlike: '踩',
    // pagination
    perPage: '每页评论数',
    sort: '点击改变排序方式',
    page: '页数',
    prev: '上一页',
    next: '下一页',
    // hint
    comments: '评论 | {count} 条评论',
    loginToComment: '使用 {platform} 帐号登录后发表评论',
    placeholder: '留下你的评论丨支持 Markdown 语法丨Ctrl + Enter 发表评论',
    noLoginPlaceHolder: '登陆后才能发表评论丨支持 Markdown 语法',
    // status
    initializing: '正在初始化...',
    loadingComments: '正在加载评论...',
    failed: '加载评论失败',
    requireLogin: '登录后查看评论',
    noComments: '还没有评论，来发表第一条评论吧！',
    // alerts
    reactionGiven: `已经添加过 '{reaction}' 了`,
    deleteConfirm: '确认要删除该评论吗？',
    deleteFailed: '删除评论失败',
};

if (!Vue.prototype.hasOwnProperty('$i18n')) {
    Vue.use(VueI18n);
}
const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        'en': messages,
        'en-US': messages,
        'zh': messages$1,
        'zh-CN': messages$1,
    },
});

let VssueStore = class VssueStore extends Vue$1 {
    constructor() {
        super(...arguments);
        this.options = null;
        this.API = null;
        this.accessToken = null;
        this.user = null;
        this.issue = null;
        this.comments = null;
        this.query = {
            page: 1,
            perPage: 10,
            sort: 'desc',
        };
        this.isInitializing = true;
        this.isLoginRequired = false;
        this.isFailed = false;
        this.isLoadingComments = false;
        this.isCreatingComment = false;
        this.isUpdatingComment = false;
    }
    get version() {
        return "0.7.3";
    }
    get isPending() {
        return this.isLoadingComments || this.isCreatingComment || this.isUpdatingComment;
    }
    get isLogined() {
        return this.accessToken !== null && this.user !== null;
    }
    get isAdmin() {
        return this.options !== null && this.accessToken !== null && this.user !== null &&
            (this.user.username === this.options.owner ||
                this.options.admins.includes(this.user.username));
    }
    /**
     * the key of access token for local storage
     */
    get accessTokenKey() {
        return this.API ? `Vssue.${this.API.platform.name.toLowerCase()}.access_token` : '';
    }
    onQueryPerPageChange() {
        this.query.page = 1;
        this.getComments();
    }
    onQueryChange() {
        this.getComments();
    }
    /**
     * Created hook. Bind event listeners.
     */
    created() {
        this.$on('login', this.handleLogin);
        this.$on('logout', this.handleLogout);
    }
    /**
     * Set options of Vssue
     */
    setOptions(options) {
        this.options = Object.assign({
            labels: ['Vssue'],
            state: 'Vssue',
            prefix: '[Vssue]',
            admins: [],
            perPage: 10,
            proxy: (url) => `https://cors-anywhere.herokuapp.com/${url}`,
            issueContent: ({ url }) => url,
        }, options);
        // check options
        const requiredOptions = [
            'api',
            'owner',
            'repo',
            'clientId',
            'clientSecret',
        ];
        for (const opt of requiredOptions) {
            if (!this.options[opt]) {
                console.warn(`[Vssue] the option '${opt}' is required`);
            }
        }
        // set locale
        if (this.options.locale) {
            this.$i18n.locale = this.options.locale;
        }
        else {
            const locales = Object.keys(this.$i18n.messages);
            const navLangs = window.navigator.languages;
            this.$i18n.locale = navLangs.filter(item => locales.includes(item)).shift() || 'en';
        }
    }
    /**
     * Init VssueStore
     */
    async init() {
        try {
            if (!this.options)
                throw new Error('Options are required to initialize Vssue');
            // reset data
            this.API = null;
            this.accessToken = null;
            this.user = null;
            this.issue = null;
            this.comments = null;
            this.query = {
                page: 1,
                perPage: this.options.perPage,
                sort: 'desc',
            };
            // reset status
            this.isInitializing = true;
            this.isLoginRequired = false;
            this.isFailed = false;
            this.isLoadingComments = false;
            this.isCreatingComment = false;
            this.isUpdatingComment = false;
            // get the VssueAPI instance according to the options.api
            const APIConstructor = this.options.api;
            this.API = new APIConstructor({
                baseURL: this.options.baseURL,
                labels: this.options.labels,
                state: this.options.state,
                owner: this.options.owner,
                repo: this.options.repo,
                clientId: this.options.clientId,
                clientSecret: this.options.clientSecret,
                proxy: this.options.proxy,
            });
            // handle authorization
            await this.handleAuth();
        }
        finally {
            this.isInitializing = false;
        }
    }
    /**
     * Init comments according to issue id
     */
    async initCommentsByIssueId(issueId) {
        if (!this.API)
            return;
        // if `issueId` is set, get the issue and comments in the mean time
        // notice that will not create the issue if not found
        const [issue, comments] = await Promise.all([
            this.API.getIssue({
                accessToken: this.accessToken,
                issueId: issueId,
            }),
            this.API.getComments({
                accessToken: this.accessToken,
                issueId: issueId,
                query: this.query,
            }),
        ]);
        this.issue = issue;
        this.comments = comments;
    }
    /**
     * Init comments according to issue title
     */
    async initCommentsByIssueTitle(issueTitle) {
        if (!this.API || !this.options)
            return;
        // get issue according to title first
        this.issue = await this.API.getIssue({
            accessToken: this.accessToken,
            issueTitle: issueTitle,
        });
        // if the issue of this page does not exist, try to create it
        if (!this.issue) {
            // require login to create the issue
            if (!this.isLogined) {
                this.$emit('login');
            }
            // if current user is not admin, cannot create issue
            if (!this.isAdmin) {
                throw Error('Failed to get comments');
            }
            // create the corresponding issue
            this.issue = await this.API.postIssue({
                title: issueTitle,
                content: await this.options.issueContent({
                    options: this.options,
                    url: getCleanURL(window.location.href),
                }),
                accessToken: this.accessToken,
            });
        }
        // try to load comments
        await this.getComments();
    }
    /**
     * Get comments of this vssue according to the issue id
     */
    async getComments() {
        try {
            if (!this.API || !this.issue || this.isLoadingComments)
                return;
            this.isLoadingComments = true;
            const comments = await this.API.getComments({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                query: this.query,
            });
            this.comments = comments;
            if (this.query.page !== comments.page) {
                this.query.page = comments.page;
            }
            if (this.query.perPage !== comments.perPage) {
                this.query.perPage = comments.perPage;
            }
        }
        catch (e) {
            if (e.response && [401, 403].includes(e.response.status) && !this.isLogined) {
                this.isLoginRequired = true;
            }
            else {
                this.$emit('error', e);
                throw e;
            }
        }
        finally {
            this.isLoadingComments = false;
        }
    }
    /**
     * Post a new comment
     */
    async postComment({ content, }) {
        try {
            if (!this.API || !this.issue || this.isCreatingComment)
                return;
            this.isCreatingComment = true;
            const comment = await this.API.postComment({
                accessToken: this.accessToken,
                content,
                issueId: this.issue.id,
            });
            return comment;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
        finally {
            this.isCreatingComment = false;
        }
    }
    /**
     * Edit a comment
     */
    async putComment({ commentId, content, }) {
        try {
            if (!this.API || !this.issue)
                return;
            const comment = await this.API.putComment({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
                content,
            });
            return comment;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Delete a new comment
     */
    async deleteComment({ commentId, }) {
        try {
            if (!this.API || !this.issue)
                return;
            const success = await this.API.deleteComment({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
            });
            return success;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Get reactions of a comment
     */
    async getCommentReactions({ commentId, }) {
        try {
            if (!this.API || !this.issue)
                return;
            const reactions = await this.API.getCommentReactions({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
            });
            return reactions;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Create a new reaction to a certain comment
     */
    async postCommentReaction({ commentId, reaction, }) {
        try {
            if (!this.API || !this.issue)
                return false;
            const success = await this.API.postCommentReaction({
                accessToken: this.accessToken,
                issueId: this.issue.id,
                commentId,
                reaction,
            });
            return success;
        }
        catch (e) {
            this.$emit('error', e);
            throw e;
        }
    }
    /**
     * Get access token from local storage
     */
    getAccessToken() {
        this.accessToken = window.localStorage.getItem(this.accessTokenKey);
        return this.accessToken;
    }
    /**
     * Save access token to local storage
     */
    setAccessToken(token) {
        if (token === null) {
            window.localStorage.removeItem(this.accessTokenKey);
        }
        else {
            window.localStorage.setItem(this.accessTokenKey, token);
        }
        this.accessToken = token;
    }
    /**
     * Handle authorization and set access_token
     */
    async handleAuth() {
        if (!this.API)
            return;
        // handle authorize and try to get the access_token
        const accessToken = await this.API.handleAuth();
        if (accessToken) {
            // new access_token
            this.setAccessToken(accessToken);
            this.user = await this.API.getUser({ accessToken });
        }
        else if (this.getAccessToken()) {
            // have access_token in localstorage
            this.user = await this.API.getUser({ accessToken: this.accessToken });
        }
        else {
            // no access_token
            this.setAccessToken(null);
            this.user = null;
        }
    }
    /**
     * Redirect to the platform's authorization page
     */
    handleLogin() {
        if (!this.API)
            return;
        this.API.redirectAuth();
    }
    /**
     * Clean the access token stored in local storage
     */
    handleLogout() {
        this.setAccessToken(null);
        this.user = null;
    }
};
__decorate([
    Watch('query.perPage')
], VssueStore.prototype, "onQueryPerPageChange", null);
__decorate([
    Watch('query.page'),
    Watch('query.sort')
], VssueStore.prototype, "onQueryChange", null);
VssueStore = __decorate([
    Component({ i18n })
], VssueStore);
var VssueStore$1 = VssueStore;

let Vssue = class Vssue extends Vue$1 {
    constructor() {
        super(...arguments);
        /**
         * Provide the VssueStore for the child components
         */
        this.vssue = new VssueStore$1();
    }
    /**
     * The actual title of issue
     */
    get issueTitle() {
        if (this.vssue.options === null) {
            return '';
        }
        return typeof this.title === 'function' ? this.title(this.vssue.options) : `${this.vssue.options.prefix}${this.title}`;
    }
    /**
     * Set options of Vssue if `options` prop is changed
     */
    onOptionsChange(options) {
        this.vssue.setOptions(options);
    }
    /**
     * beforeMount hook
     */
    beforeMount() {
        // set options
        this.vssue.setOptions(this.options);
        // init vssue
        this.init();
    }
    /**
     * Init Vssue.
     */
    async init() {
        try {
            // init VssueStore
            await this.vssue.init();
            // init comments
            if (!this.issueId) {
                await this.vssue.initCommentsByIssueTitle(this.issueTitle);
            }
            else {
                await this.vssue.initCommentsByIssueId(this.issueId);
            }
        }
        catch (e) {
            if (e.response && [401, 403].includes(e.response.status)) {
                // in some cases, require login to load comments
                this.vssue.isLoginRequired = true;
            }
            else {
                this.vssue.isFailed = true;
            }
            console.error(e);
        }
    }
};
__decorate([
    Prop({
        type: [String, Function],
        required: false,
        default: () => opts => `${opts.prefix}${document.title}`,
    })
], Vssue.prototype, "title", void 0);
__decorate([
    Prop({
        type: [String, Number],
        required: false,
        default: null,
    })
], Vssue.prototype, "issueId", void 0);
__decorate([
    Prop({
        type: Object,
        required: false,
        default: () => ({}),
    })
], Vssue.prototype, "options", void 0);
__decorate([
    Provide('vssue')
], Vssue.prototype, "vssue", void 0);
__decorate([
    Watch('options', { deep: true })
], Vssue.prototype, "onOptionsChange", null);
Vssue = __decorate([
    Component({
        components: {
            Iconfont,
            TransitionFade,
            VssueComments: VssueComments$1,
            VssueNewComment: VssueNewComment$1,
            VssueNotice: VssueNotice$1,
            VssueStatus,
        },
    })
], Vssue);
var script$a = Vssue;

/* script */
            const __vue_script__$a = script$a;
            
/* template */
var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vssue"},[_c('Iconfont'),_vm._v(" "),_c('div',{staticClass:"vssue-header"},[_c('a',{staticClass:"vssue-header-comments-count",attrs:{"href":_vm.vssue.issue ? _vm.vssue.issue.link : null,"target":"_blank"}},[_c('span',[_vm._v("\n        "+_vm._s(_vm.vssue.comments
          ? _vm.vssue.$tc('comments', _vm.vssue.comments.count, { count: _vm.vssue.comments.count })
          : _vm.vssue.$tc('comments'))+"\n      ")])]),_vm._v(" "),_c('span',{staticClass:"vssue-header-powered-by"},[_c('span',[_vm._v("Powered by")]),_vm._v(" "),(_vm.vssue.API)?_c('span',[_c('a',{attrs:{"href":_vm.vssue.API.platform.link,"target":"_blank","title":((_vm.vssue.API.platform.name) + " API " + (_vm.vssue.API.platform.version))}},[_vm._v("\n          "+_vm._s(_vm.vssue.API.platform.name)+"\n        ")]),_vm._v(" "),_c('span',[_vm._v("&")])]):_vm._e(),_vm._v(" "),_c('a',{attrs:{"href":"https://github.com/meteorlxy/vssue","target":"_blank","title":("Vssue v" + (_vm.vssue.version))}},[_vm._v("\n        Vssue\n      ")])])]),_vm._v(" "),_c('TransitionFade',[(_vm.vssue.isInitializing)?_c('VssueStatus',{key:"initializing",attrs:{"icon-name":"loading"}},[_vm._v("\n      "+_vm._s(_vm.vssue.$t('initializing'))+"\n    ")]):_c('div',{key:"initialized",staticClass:"vssue-body"},[(_vm.vssue.API)?_c('VssueNewComment'):_vm._e(),_vm._v(" "),_c('VssueNotice'),_vm._v(" "),_c('VssueComments')],1)],1)],1)};
var __vue_staticRenderFns__$6 = [];

  /* style */
  const __vue_inject_styles__$a = undefined;
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* component normalizer */
  function __vue_normalize__$a(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "Vssue.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var VssueComponent = __vue_normalize__$a(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    undefined,
    undefined
  );

const VssuePlugin = {
    get version() {
        return "0.7.3";
    },
    installed: false,
    install(Vue$$1, options) {
        if (this.installed) {
            return false;
        }
        this.installed = true;
        Vue$$1.component('Vssue', {
            functional: true,
            props: {
                title: {
                    type: String,
                    required: false,
                    default: undefined,
                },
                issueId: {
                    type: [Number, String],
                    required: false,
                    default: undefined,
                },
                options: {
                    type: Object,
                    required: false,
                    default: undefined,
                },
            },
            render(h, { data, props }) {
                return h(VssueComponent, Object.assign({}, data, { props: {
                        title: props.title,
                        issueId: props.issueId,
                        options: Object.assign({}, options, props.options),
                    } }));
            },
        });
    },
    VssueComponent: VssueComponent,
};

export default VssuePlugin;
export { VssueComponent };
