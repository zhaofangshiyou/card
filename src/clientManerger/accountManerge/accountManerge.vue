<template>
  <div class="account-manerge">
    <h3 class="title">主卡信息</h3>
    <div class="content">
      <p class="wrapper">
        <span class="tip">卡号</span>:
        <span class="message">{{user_msg.card_no}}</span>
      </p>
      <p class="wrapper">
        <span class="tip">姓名</span>:
        <span class="message">{{user_msg.name}}</span>
      </p>
      <p class="wrapper">
        <span class="tip">身份证</span>:
        <span class="message">{{user_msg.id_card}}</span>
      </p>
      <p class="wrapper">
        <span class="tip">售后油站</span>:
        <span class="message">{{user_msg.station_name}}</span>
      </p>
      <p class="wrapper">
        <span class="tip">单位全称</span>:
        <span class="message">{{user_msg.company}}</span>
      </p>
      <p class="wrapper">
        <span class="tip">营业执照</span>:
        <span class="message">{{user_msg.business_lis}}</span>
      </p>
      <p class="wrapper">
        <span class="tip">联系电话</span>:
        <span class="message">{{user_msg.mobile}}</span>
      </p>
      <div class="btn">
        <el-button type="primary"  size="small" @click="handleChangeUser">变更持卡人</el-button>
        <el-button  size="small" @click="handleEditUser">修改信息</el-button>
      </div>
    </div>

    <!-- 变更持卡人弹窗 -->
    <popup :width="30" @closePop="closeChange" :title="changeTitle" :showPop="changeFormVisible">
      <el-form :model="changeForm" :rules="rules" label-width="120px" ref="changeForm">
				<el-form-item label="变更人姓名：" prop="name">
          <el-input v-model="changeForm.name"></el-input>
				</el-form-item>
        <el-form-item label="变更人身份证：" prop="id_card">
          <el-input v-model="changeForm.id_card"></el-input>
				</el-form-item>
        <el-form-item label="变更人电话：" prop="mobile">
          <el-input v-model="changeForm.mobile"></el-input>
				</el-form-item>
        <el-form-item label="手机验证码：" prop="code">
          <el-row>
            <el-col :span="14">
              <el-input v-model="changeForm.code"></el-input>
            </el-col>
            <el-col :span="10">
              <el-button class="code" @click.stop="sendCode">{{codeText}}</el-button>
            </el-col>
          </el-row>
				</el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click.native="changeSubmit('changeForm')" style="width:100%">提交</el-button>
        </el-form-item>
			</el-form>
    </popup>
    <!-- 变更持卡人弹窗end -->

    <!---修改信息-->
    <popup :width="30" @closePop="closeEdit" :title="editTitle" :showPop="editFormVisible">
      <el-form :model="editForm" :rules="editRules" label-width="120px" ref="editForm">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="editForm.name"></el-input>
				</el-form-item>
        <el-form-item label="身份证：" prop="id_card">
          <el-input v-model="editForm.id_card"></el-input>
				</el-form-item>
        <el-form-item label="单位全称：" prop="company">
          <el-input v-model="editForm.company"></el-input>
				</el-form-item>
        <el-form-item label="营业执照：" prop="business_lis">
          <el-input v-model="editForm.business_lis"></el-input>
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer clearfloat">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit('editForm')">提交</el-button>
			</div>
    </popup>
    <!--修改信息end-->

  </div> 
</template>
<script>
  import Popup from 'base/popup'
  import { getCusCards, clientSendCode, updUser, editCardMess } from '../../api/client-api';
  import { messageWarn, isPoneAvailable } from '../../common/js/commonMethod';

  export default{
    components: {
      Popup
    },
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      var checkId = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('变更人身份证不能为空'));
        } else {
          const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的身份证号'));
          }
        }
      };
      var checkBuss = (editRules, value, callback) => {
        if (value) {
          const reg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的营业执照'));
          }
        } else {
          callback();
        }
      };
      var checkBussID = (editRules, value, callback) => {
        if (value) {
          const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的身份证号'));
          }
        } else {
          callback();
        }
      }
      return {
        sendAgain: true,
        codeText: '发送',
        changeForm: {},
        changeFormVisible: false,
        editFormVisible: false,
        editTitle: '修改信息',
        changeTitle: '变更持卡人',
        user_msg: {},
        editForm: {
          name: '',
          company: '',
          business_lis: '',
          id_card: ''
        },
        editRules: {
          id_card: [
            {validator: checkBussID, trigger: 'blur'}
          ],
          business_lis: [
            {validator: checkBuss, trigger: 'blur'}
          ]
        },
        changeForm: {
          name: '',
          id_card: '',
          mobile: '',
          code: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入变更人姓名', trigger: 'blur' }
          ],
          id_card: [
            {required: true,validator: checkId, trigger: 'blur'}
          ],
          mobile: [
            {required: true, validator: checkPhone, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      editSubmit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            let params = {
              name: this.editForm.name,
              company: this.editForm.company,
              business_lis: this.editForm.business_lis,
              id_card: this.editForm.id_card
            }
            editCardMess(params, this.user_msg.card_id).then((res) => {
              if (res.data.status === 0) {
                messageWarn('修改成功');
                this.editFormVisible = false,
                this.getData()
              } else {
                messageWarn(res.data.msg);
              }
            })
          } else {
            return false;
          }
        })
      },
      changeSubmit(changeForm) {
        this.$refs[changeForm].validate((valid) => {
          if (valid) {
            let params = {
              name: this.changeForm.name,
              mobile: this.changeForm.mobile,
              id_card: this.changeForm.id_card,
              code: this.changeForm.code
            }
            updUser(params,this.user_msg.card_id).then((res) => {
              if (res.data.status === 0) {
                messageWarn('修改成功');
                localStorage.removeItem('clientFlag')
                this.$router.push('/client-login')
              } else {
                messageWarn(res.data.msg);
              }
            })

          } else {
            return false;
          }
        });
      },
      sendCode() {
        if(isPoneAvailable(this.changeForm.mobile) && this.sendAgain) {
          let params = {
            mobile: this.changeForm.mobile,
            type: 'cus_cards_owner'
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
      getData() {
        getCusCards().then((res) => {
          if(res.data.status === 0) {
            this.user_msg = Object.assign({}, res.data.data);
          }else{
            messageWarn(res.data.msg);
          }
        })
      },
      closeChange(val) {
        this.changeFormVisible = val;
      },
      closeEdit(val) {
        this.editFormVisible = val;
      },
      handleChangeUser() {
        this.changeFormVisible = true;
      },
      handleEditUser() {
        this.editFormVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog{
    width: 30% !important;
  }
  .account-manerge{
    border:1px solid rgba(229,229,229,1);
    margin-top: 10px;
    box-shadow:0px 4px 10px 0px rgba(165,165,165,0.5);
    border-radius:2px;
  }
  .title{
    background:rgba(247,250,255,1);
    padding: 0;
    margin: 0;
    height: 48px;
    line-height: 48px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(34,34,34,1);
    padding-left: 12px;
  }
  .wrapper{
        background-color: #fff;
        box-sizing: border-box;
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid rgba(231,231,235,1);
        padding-left: 12px;
        padding: 0 0 0 12px;
        margin: 0;
    .tip{
      width: 60px;
      height: 16px;
      line-height: 16px;
      display: inline-block;
      text-align: justify;
      text-justify: inter-ideograph;
      vertical-align: middle;
    }
    .tip::after{
      content:"";
      display: inline-block;
      width:100%;
      overflow:hidden;
      height:0;
    }
    .message{
      height: 16px;
      line-height: 16px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 40px;
    }
  
  }
  .btn{
    margin: 40px 0 47px 12px; 
  }

  .code{
    float: right;
    width: 90%;
  }
</style>
