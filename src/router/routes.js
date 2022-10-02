/* eslint-disable max-len */
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/plant', name: 'plant', component: () => import('src/pages/plant/shopPlant.vue') },
      { path: '/vent', name: 'vent', component: () => import('pages/vent/index.vue') },
      // ---------------------------------LAB-------------------------------------------------------------------
      { path: '/lab/recup/setpoints', name: 'recupSetpoints', component: () => import('src/pages/lab/recup.vue') },
      { path: '/lab/recup/inflow', component: () => import('src/pages/lab/inflow.vue') },
      { path: '/lab/recup-online', component: () => import('src/pages/lab/lab-recuperator/recupOnline.vue') },
      { path: '/lab/recup-history', component: () => import('src/pages/lab/lab-recuperator/recupHistory.vue') },
      // -----------------------------------GENPRICE------------------------------------------------------------
      { path: '/services/genprice/calculations', component: () => import('src/pages/services/genprice/calculations.vue') },
      { path: '/services/genprice/references/materials', component: () => import('src/pages/services/genprice/materials/materials.vue') },
      { path: '/services/genprice/references/materials_categories', component: () => import('src/pages/services/genprice/materials/categories.vue') },
      { path: '/services/genprice/references/materials_measures', component: () => import('src/pages/services/genprice/materials/measures.vue') },
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
