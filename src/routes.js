import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

//客户模块
import clientAccountManerge from './clientManerger/accountManerge/accountManerge'
import ClientSecondCard from './clientManerger/secondCard/secondCard'
import ClientComsumeDetail from './clientManerger/comsumeDetail/comsumeDetail'
import ClientComsumeAll from './clientManerger/comsumeAll/comsumeAll'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '账户管理',
      iconCls: 'iconfont icon-manage',
      children: [
          { path: '/account_manerge', component: clientAccountManerge, name: '主卡管理' },
          { path: '/second_card', component: ClientSecondCard, name: '副卡管理'},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '消费查询',
      iconCls: 'iconfont icon-manage',
      children: [
          { path: '/client_comsume_detail', component: ClientComsumeDetail, name: '消费明细' },
          { path: '/client_comsume_all', component: ClientComsumeAll, name: '消费明细' },
      ]
    },
    //{ path: '/main', component: Main },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航一',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/main', component: Main, name: '主页', hidden: true },
    //         { path: '/table', component: Table, name: 'Table' },
    //         { path: '/form', component: Form, name: 'Form' },
    //         { path: '/user', component: user, name: '列表' },
    //     ]
    // },
    
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;