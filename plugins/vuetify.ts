import { createVuetify } from "vuetify";
import {
  VBtn,
  VApp,
  VLayout,
  VAppBar,
  VNavigationDrawer,
  VList,
  VListItem,
  VAvatar,
  VIcon,
  VMain,
  VCard,
  VCardActions,
  VCardTitle,
  VCardText,
  VSelect,
  VTable,
  VTooltip,
  VProgressCircular,
  VTextField,
  VPagination,
  VSlideXTransition,
  VChipGroup,
  VChip,
  VFabTransition,
  VHover,
  VDialog,
  VTextarea,
  VImg,
  VCheckbox,
  VSnackbar,
} from "vuetify/components";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import VuetifyToast from "vuetify-toast-snackbar";
import { app } from "firebase-admin";

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp) => {
    const vuetify = createVuetify({
      ssr: true,
      theme: {
        defaultTheme: "musicMuseDark",
        themes: {
          musicMuseDark: {
            dark: true,
            colors: {
              primary: "#BA68C8",
              secondary: "#3F51B5",
              background: "#191414",
              info: "#2196F3",
              error: "#FF5722",
              success: "#4CAF50",
              warning: "#FFC107",
            },
          },
        },
      },
      components: {
        VBtn,
        VLayout,
        VAppBar,
        VNavigationDrawer,
        VList,
        VListItem,
        VAvatar,
        VIcon,
        VMain,
        VCard,
        VCardActions,
        VCardTitle,
        VCardText,
        VSelect,
        VTable,
        VTooltip,
        VProgressCircular,
        VTextField,
        VPagination,
        VSlideXTransition,
        VFabTransition,
        VChipGroup,
        VChip,
        VApp,
        VHover,
        VDialog,
        VTextarea,
        VImg,
        VCheckbox,
        VSnackbar,
      },
    });

    nuxtApp.vueApp.use(vuetify);
  },
  hooks: {
    "app:created": (app) => {
      app.use(VuetifyToast);

      ChartJS.register(
        RadialLinearScale,
        ArcElement,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
      );
    },
    "app:beforeMount": () => {
      const styles = getComputedStyle(document.documentElement);

      ChartJS.defaults.font.family = `"Lexend", sans-serif`;
      ChartJS.defaults.color = styles.getPropertyValue("--text-primary");
    },
  },
});
