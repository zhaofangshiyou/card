
import axios from 'axios';
import qs from 'qs';
import _global from '../config/GLOBAL';

let base = '';
let instance = axios.create({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true
  })

  instance.interceptors.response.use(res => {
    if(res.data.status === 401 || res.data.status === 402) {
      window.location.href = '/#/login';
      localStorage.removeItem('isLogin')
    } 
    return res;
  },function (error)  {
    return Promise.reject(error)
  }
);
  
let url = _global.url;

//主卡列表
export const getCusCards = params => { return instance.get(`${url}/backen/cus_cards/main`, { params: params }); };

//登录
export const clientLogin = params => { return instance.post(`${url}/backen/cus_auth/login`, qs.stringify(params)); };

//发送验证码
export const clientSendCode = params => { return instance.post(`${url}/message`, qs.stringify(params)); };

//变更持卡人
export const updUser = (params,id) => { return instance.put(`${url}/backen/cus_cards/main/owner/upd/${id}`, qs.stringify(params)); };

//修改卡信息
export const editCardMess = (params,id) => { return instance.put(`${url}/backen/cus_cards/main/upd/${id}`, qs.stringify(params)); };

//副卡列表接口
export const getSubCardList = params => { return instance.get(`${url}/backen/cus_cards/sub`, { params: params }); };

//获取油品列表
export const getOilProduct = params => { return instance.get(`${url}/backen/oil`, { params: params }); };

//副卡新增
export const addSubCard = params => { return instance.post(`${url}/backen/cus_cards/sub/add`, qs.stringify(params)); };

//副卡修改
export const updSubCard = (params,id) => { return instance.put(`${url}/backen/cus_cards/sub/upd/${id}`, qs.stringify(params)); };

//删除副卡
export const delCusCards = (params) => { return instance.delete(`${url}/backen/cus_cards/sub/del`, {data : qs.stringify(params)}); };

//修改金额
export const updMoney = (params,id) => { return instance.put(`${url}/backen/cus_cards/sub/money/upd/${id}`, qs.stringify(params)); };

//消费查询-消费明细
export const comsumeDetail = params => { return instance.get(`${url}/backen/cus_query/consume/detail`, { params: params }); };

//消费查询-消费汇总
export const comsumeAll = params => { return instance.get(`${url}/backen/cus_query/consume/summary`, { params: params }); };

//消费查询-消费核查
export const comsumeCheck = params => { return instance.get(`${url}/backen/cus_query/consume/check`, { params: params }); };
