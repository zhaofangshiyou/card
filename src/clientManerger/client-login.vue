<template>
  <div class="login">
    <div class="client-login-header">
      <img src="../assets/logo-client.png" align="absmiddle">
    </div>
    <div class="client-login-wrapper">
      <div class="client-login-content">
        <div class="form">
          <h1 class="title">后台管理系统</h1>
          <div class="welcome_box">
            <div class="tip"></div>
            <div class="welcome_text">欢迎登录兆方后台管理系统</div>
            <div class="tip"></div>
          </div>
          <el-input v-model="mobile" class="clientPhone" placeholder="请输入手机号码"></el-input>
          <el-row type="flex" justify="space-between">
            <el-col :span="14">
              <el-input v-model="code" class="codeNum" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button class="code" @click.stop="sendCode">{{codeText}}</el-button>
            </el-col>
          </el-row>
          <div class="login-btn" @click="login">登 录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { clientLogin, clientSendCode } from '../api/client-api';
  import { messageWarn, isPoneAvailable } from '../common/js/commonMethod';

  export default {
    data() {
      return {
        mobile: '',
        code: '',
        codeText: '发送',
        sendAgain: true
      }
    },
    created() {
      localStorage.removeItem('user_id');
      localStorage.removeItem('clientFlag');
    },
    methods: {
      sendCode() {
        if(isPoneAvailable(this.mobile) && this.sendAgain) {
          let params = {
            mobile: this.mobile,
            type: 'cus_auth'
          }
          clientSendCode(params).then((res) => {
            if (res.data.status === 0) {
              this.countDown(60);
              messageWarn('验证码发送成功');
            } else if (res.data.status === 2) {
              messageWarn('请输入正确的手机号');
            } else if (res.data.status === 3) {
              messageWarn('今日发送验证码次数超过5次');
            } else {
              messageWarn('发送验证码失败');
            }
          })
        }else if(!this.sendAgain){
          messageWarn('验证码已发送，稍后重试');
        }else{
          messageWarn('请输入正确的手机号码');
        }
      },
      //验证码倒计时
      countDown(timeout) {
        let timer;
        if(timer) {
          clearTimeout(timer);
        }else{
          timer = setTimeout(() => {
            this.countDown(timeout);
          },1000);
          if(timeout===0) {
            this.codeText = '获取验证码';
            this.sendAgain = true;
            timeout = 60;
            clearTimeout(timer);
          }else{
            this.codeText = timeout + "s后重发";
            this.sendAgain = false;
            timeout--;
          }
        }
      },
      login() {
        if (!isPoneAvailable(this.mobile)) {
          messageWarn('请输入正确的手机号')
        } else if(!this.code) {
          messageWarn('请输入验证码')
        } else {
          let params = {
            mobile: this.mobile,
            code: this.code
          }
          clientLogin(params).then((res) => {
            if (res.data.status === 0) {
              localStorage.setItem('clientFlag', true);
              this.$router.push({ path: '/account_manerge' });
            }else{
              messageWarn(res.data.msg);
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login{
    font-size: 18px;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .client-login-header{
    height: 160px;
    line-height: 160px;
    width: 1200px;
    margin: 0 auto;
  }
  .client-login-wrapper{
    width: 100%;
    background: url('../assets/bg-client.png') no-repeat;
    background-size: 100% auto;
    min-height: 700px;
  }
  .client-login-content{
    width: 1200px;
    height: 700px;
    margin: 0 auto;
    position: relative;
    .form{
      width: 400px;
      box-sizing: border-box;
      padding: 50px 40px;
      background: #fff;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      .title{
        height:30px;
        font-size:30px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(64,158,255,1);
        line-height:30px;
        text-align: center;
        margin-top: 0;
      }
      .welcome_box{
        width: 100%;
        display: flex;
        height: 14px;
        margin: 0px auto 40px auto;
        .tip{
          flex: 1;
          border-top: 1px solid rgba(189,189,189,1);
          margin-top: 7px;
        }
        .welcome_text{
          padding: 0 5px;
          line-height: 14px;
          font-size: 14px;
          color:rgba(153,153,153,1);
        }
      }
      .el-row{
        margin-top: 20px;
      }
      .login-btn{
        width: 100%;
        height: 50px;
        height:50px;
        background:rgba(64,158,255,1);
        border-radius:4px;
        text-align: center;
        line-height: 50px;
        margin-top: 40px;
        color: #fff;
      }
      .clientPhone{
        .el-input__inner {
          background:rgba(250,250,250,1);
          border-radius:4px;
          border:1px solid rgba(204,204,204,1);
          padding-left: 40px;
          background: url('../assets/icon_iPhone.png') no-repeat 6px center;
        }
      }
      .codeNum {
        .el-input__inner {
          background:rgba(250,250,250,1);
          border-radius:4px;
          border:1px solid rgba(204,204,204,1);
          padding-left: 40px;
          background: url('../assets/icon_password.png') no-repeat 6px center;
        }
      }
      .code{
        float: right;
        width: 90%;
        background:rgba(250,250,250,1);
        border-radius:4px;
        border:1px solid rgba(204,204,204,1);
      }
    }
  }
</style>
