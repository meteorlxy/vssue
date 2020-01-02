import { VueConstructor } from 'vue';
import Vssue from 'vssue';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import VssueAPI from '@vssue/api';
import '../styles/index.styl';

declare const VSSUE_OPTIONS: string;

declare module 'vue/types/vue' {
  export interface VueConstructor {
    component<Props>(
      id: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      definition: any
    ): ExtendedVue<Vue, {}, {}, {}, Props>;
  }
}

export default ({ Vue }: { Vue: VueConstructor }): void => {
  // options come from vuepress plugin config
  const vpOptions = JSON.parse(VSSUE_OPTIONS);

  Vue.use(
    Vssue,
    Object.assign({}, vpOptions, {
      api: VssueAPI,
    })
  );

  // get the vssue component registered by Vssue.Plugin
  const VssueComponent = Vue.component('Vssue');

  // make the vssue component client-only
  Vue.component('Vssue', {
    functional: true,

    /* eslint-disable-next-line vue/require-render-return */
    render(h, { parent, data }) {
      // if locale is not set by user, use Vuepress `$lang`
      if (!vpOptions.locale) {
        if (!data.attrs) {
          data.attrs = {};
        }
        if (!data.attrs.options) {
          data.attrs.options = {};
        }
        if (!data.attrs.options.locale) {
          data.attrs.options = Object.assign(
            {
              locale: parent.$lang || 'en',
            },
            data.attrs.options
          );
        }
      }
      if (parent._isMounted) {
        return h(VssueComponent, data);
      } else {
        parent.$once('hook:mounted', () => {
          parent.$forceUpdate();
        });
      }
    },
  });
};
