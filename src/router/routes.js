/* eslint-disable max-len */
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/plant', name: 'plant', component: () => import('src/pages/plant/shopPlant.vue') },
      { path: '/vent', name: 'vent', component: () => import('pages/vent/index.vue') },
      // ---------------------------------LAB-------------------------------------------------------------------
      { path: '/lab/:id', name: 'lab', component: () => import('src/pages/lab/shopLab.vue') },
      { path: '/lab/recup-par', component: () => import('src/pages/lab/lab-recuperator/recupPar.vue') },
      { path: '/lab/recup-online', component: () => import('src/pages/lab/lab-recuperator/recupOnline.vue') },
      { path: '/lab/recup-history', component: () => import('src/pages/lab/lab-recuperator/recupHistory.vue') },
      //----------------------------------------------------------------------------------------------------
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
