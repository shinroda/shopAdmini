import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import ('../components/Login')
const Home = () => import ('../components/home/Home')
const Welcome = ()=> import ('../components/home/Welcome')

const User = ()=> import ('../components/user/User')


Vue.use(VueRouter)

const routes = [
  {path:'',redirect:'/login'},
  { path:'/login',component: Login},
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
       {path:'/welcome',component: Welcome},
       {path:'/users',component: User}
    ]
  }
]

const router = new VueRouter({
  routes,

})
//导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path ==='/login') return next()
  const token = window.sessionStorage.getItem('token')
  if(!token) return next('/login')
  next()
})
export default router