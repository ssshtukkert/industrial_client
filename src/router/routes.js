/* eslint-disable max-len */
const routes = [
  {
    component: () => import('layouts/MainLayout.vue'),
    path: '/',
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('pages/Index.vue'),
      },
      {
        path: '/monitoring/configurations',
        component: () => import('pages/monitoring/main.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'user'],
          permissionsBlock: {
            user: ['viewLogs', 'createConfiguration', 'editConfiguration', 'deleteConfiguration', 'changeConfiguration', 'copyConfiguration'],
          },
        },
      },
      {
        path: '/monitoring/mykonva',
        component: () => import('pages/monitoring/new_konva.vue'),
        // meta: {
        //   requiresAuth: true,
        //   allowedRoles: ['admin', 'user'],
        //   permissionsBlock: {
        //     user: ['viewLogs', 'createConfiguration', 'editConfiguration', 'deleteConfiguration', 'changeConfiguration', 'copyConfiguration'],
        //   },
        // },
      },
      {
        path: '/monitoring/configuration/:id',
        component: () => import('src/pages/monitoring/system_conf.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'user'],
          permissionsBlock: {
            user: ['viewLogs', 'editConfiguration', 'addedTimer', 'changeTag'],
          },
        },
      },
      // {
      //   path: '/vent/vu1',
      //   component: () => import('pages/vent/vu1.vue'),
      //   meta: {
      //     requiresAuth: false,
      //   },
      // },
      // {
      //   path: '/vent/vu2',
      //   component: () => import('pages/vent/vu2.vue'),
      //   meta: {
      //     requiresAuth: false,
      //   },
      // },
      // {
      //   path: '/konva',
      //   component: () => import('pages/canvas.vue'),
      //   meta: {
      //     requiresAuth: false,
      //   },
      // },
      {
        path: '/mykonva',
        component: () => import('pages/canvas.vue'),
        meta: {
          requiresAuth: false,
        },
      },
      // ---------------------------------LAB-------------------------------------------------------------------
      {
        path: '/lab/recup/main',
        component: () => import('src/pages/lab/main.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/inflow',
        component: () => import('src/pages/lab/inflow.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/outflow',
        component: () => import('src/pages/lab/outflow.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/output',
        component: () => import('src/pages/lab/output.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/tests',
        component: () => import('src/pages/lab/tests.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/testmanager',
        component: () => import('src/pages/lab/testmanager.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/calibration',
        component: () => import('src/pages/lab/calibration.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/charts/sensors',
        component: () => import('src/pages/lab/charts.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/charts/history',
        component: () => import('src/pages/lab/history.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup/alarms',
        component: () => import('src/pages/lab/alarms.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup-online',
        component: () => import('src/pages/lab/lab-recuperator/recupOnline.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      {
        path: '/lab/recup-history',
        component: () => import('src/pages/lab/lab-recuperator/recupHistory.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin', 'lab'],
        },
      },
      // {
      //   path: '/lab/test_rtk',
      //   component: () => import('src/pages/lab/test_rtk.vue'),
      //   meta: {
      //     requiresAuth: true,
      //     allowedRoles: ['admin'],
      //   },
      // },
      // -----------------------------------SERVICES GENPRICE------------------------------------------------------------
      // разрешения:
      // 'openCalculate' - открыть расчёт
      {
        path: '/services/genprice/calculations',
        component: () => import('src/pages/services/genprice/calculations.vue'),
        meta: {
          requiresAuth: true,
          permissionsBlock: {
            expert: ['deleteCalculate'],
            user: ['createCalculate', 'deleteCalculate', 'copyCalculate', 'editCalculate'],
          },
        },
      },
      {
        path: '/services/genprice/calculations/:id',
        component: () => import('src/pages/services/genprice/calculation.vue'),
        meta: {
          requiresAuth: true,
          permissionsBlock: {
            user: ['editMaterials'],
          },
        },
      },
      {
        path: '/services/references/materials',
        component: () => import('src/pages/services/genprice/materials/materials.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['expert', 'admin'],
        },
      },
      {
        path: '/services/references/materials_categories',
        component: () => import('src/pages/services/genprice/materials/categories.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['expert', 'admin'],
        },
      },
      {
        path: '/services/references/materials_measures',
        component: () => import('src/pages/services/genprice/materials/measures.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['expert', 'admin'],
        },
      },
      {
        path: '/services/references/fans',
        component: () => import('src/pages/services/productoptions/fans/fans.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['expert', 'admin'],
        },
      },
      {
        path: '/services/genprice/settings',
        component: () => import('src/pages/services/genprice/settings.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin'],
        },
      },
      {
        path: '/services/productoptions/configurations',
        component: () => import('src/pages/services/productoptions/configurations.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/services/productoptions/configurations/:id',
        component: () => import('src/pages/services/productoptions/configuration.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      // в разработке
      { path: '/services/chatOA', component: () => import('src/pages/services/chatOA/chatOA.vue') },
      {
        path: '/services/files',
        component: () => import('src/pages/services/files.vue'),
        meta: {
          requiresAuth: true,
          permissionsBlock: {
            user: ['operationsWithFiles'],
          },
        },
      },
      {
        path: '/services/projects',
        component: () => import('src/pages/services/projects.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin'],
        },
      },
      {
        path: '/services/project/:id',
        component: () => import('src/pages/services/project.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin'],
        },
      },
      { path: '/services/login', component: () => import('src/pages/Login.vue') },
      {
        path: '/services/users',
        component: () => import('src/pages/users.vue'),
        meta: {
          requiresAuth: true,
          allowedRoles: ['admin'],
        },
      },
      {
        path: '/editor',
        component: () => import('src/pages/konva.vue'),
      },
      {
        path: '/services/error_allow',
        component: () => import('src/components/ErrorAllow.vue'),
      },
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
