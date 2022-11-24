/* eslint-disable max-len */
const routes = [
  {
    component: () => import('layouts/MainLayout.vue'),
    path: '/',
    redirect: '/home',
    children: [
      { path: '/home', component: () => import('pages/Index.vue') },
      { path: '/plant', component: () => import('src/pages/plant/shopPlant.vue') },
      { path: '/vent', component: () => import('pages/vent/index.vue') },
      // ---------------------------------LAB-------------------------------------------------------------------
      { path: '/lab/recup/main', component: () => import('src/pages/lab/main.vue') },
      { path: '/lab/recup/inflow', component: () => import('src/pages/lab/inflow.vue') },
      { path: '/lab/recup/outflow', component: () => import('src/pages/lab/outflow.vue') },
      { path: '/lab/recup/output', component: () => import('src/pages/lab/output.vue') },
      { path: '/lab/recup/tests', component: () => import('src/pages/lab/tests.vue') },
      { path: '/lab/recup/calibration', component: () => import('src/pages/lab/calibration.vue') },
      { path: '/lab/recup/charts', component: () => import('src/pages/lab/charts.vue') },
      { path: '/lab/recup/alarms', component: () => import('src/pages/lab/alarms.vue') },
      { path: '/lab/recup-online', component: () => import('src/pages/lab/lab-recuperator/recupOnline.vue') },
      { path: '/lab/recup-history', component: () => import('src/pages/lab/lab-recuperator/recupHistory.vue') },
      // -----------------------------------GENPRICE------------------------------------------------------------
      { path: '/services/genprice/calculations', component: () => import('src/pages/services/genprice/calculations.vue') },
      { path: '/services/genprice/calculations/:id', component: () => import('src/pages/services/genprice/calculation.vue') },
      { path: '/services/genprice/references/materials', component: () => import('src/pages/services/genprice/materials/materials.vue') },
      { path: '/services/genprice/references/materials_categories', component: () => import('src/pages/services/genprice/materials/categories.vue') },
      { path: '/services/genprice/references/materials_measures', component: () => import('src/pages/services/genprice/materials/measures.vue') },
      { path: '/services/genprice/settings', component: () => import('src/pages/services/genprice/settings.vue') },
      { path: '/services/productoptions/configurations', component: () => import('src/pages/services/productoptions/configurations.vue') },
      { path: '/services/productoptions/configurations/:id', component: () => import('src/pages/services/productoptions/configuration.vue') },
      { path: '/farm/execute', component: () => import('src/pages/farm/index.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
