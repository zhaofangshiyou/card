<template>
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item label="副卡卡号：">
          <el-input v-model="card_no"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
        <el-form-item>
					<el-upload
            class="upload-demo"
            :action="upload_url"
            multiple
            :limit="3"
            :show-file-list="false"
            :with-credentials="true"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            accept=".xls,.xlsx"
            >
            <el-button type="success">导入</el-button>
            <span slot="tip" class="upload">支持单张副卡新增及多张副卡导入，多张副卡编辑请<i class="handleDown" @click="downTemplate">下载模板</i></span>
          </el-upload>
				</el-form-item>
			</el-form>
		</el-col>

        <!--列表-->
        <el-col :span="24" class="tab_header">
            <div class="tab_head_title">油站分布列表</div>
            <el-button type="success" size="small" @click="outExcelTable">&nbsp;&nbsp;导出&nbsp;&nbsp;</el-button>
            <el-button type="danger" size="small"  @click="batchRemove">批量删除</el-button>
        </el-col>
		<el-table :data="initList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号" width="100">
			</el-table-column>
			<el-table-column prop="card_no" label="副卡卡号" width="150">
			</el-table-column>
            <el-table-column prop="name" label="姓名" width="100">
			</el-table-column>
			<el-table-column prop="mobile" label="联系电话" width="150">
			</el-table-column>
      <el-table-column prop="car_num" label="车牌" width="100">
			</el-table-column>
			<el-table-column prop="car_type" label="车型" width="100">
			</el-table-column>
			<el-table-column prop="car_vol" label="油箱容量" width="100">
			</el-table-column>
			<el-table-column prop="day_vol" label="一天总加油量" min-width="100">
			</el-table-column>
      <el-table-column prop="limit_oil_type" label="可加油品" min-width="180">
			</el-table-column>
      <el-table-column prop="company_balance" label="分配金额" min-width="100">
			</el-table-column>
      <el-table-column prop="created_time" label="创建时间" min-width="180">
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleEditMoney(scope.$index, scope.row)">修改金额</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
        <!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="num" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

        <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addRules" ref="addForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addForm.name" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="addForm.mobile" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号码">
              <el-input v-model="addForm.car_num" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型信息">
              <el-input v-model="addForm.car_type" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="油箱容量">
              <el-input v-model="addForm.car_vol" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一天总加油量">
              <el-input v-model="addForm.day_vol" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="限制油品">
              <el-select v-model="addForm.limit_oil_type" multiple placeholder="请选择" size="100">
                  <el-option
                  v-for="item in oil_product"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配金额">
              <el-input v-model="addForm.money" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit('addForm')" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

        <!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" ref="addForm">
				<el-row>
          <el-col :span="12">
            <el-form-item label="姓名"  prop="name">
              <el-input v-model="editForm.name" size="100" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="editForm.mobile" size="100" :disabled="true" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号码">
              <el-input v-model="editForm.car_num" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车型信息">
              <el-input v-model="editForm.car_type" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="油箱容量">
              <el-input v-model="editForm.car_vol" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="一天总加油量">
              <el-input v-model="editForm.day_vol" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="限制油品">
              <el-select v-model="editForm.limit_oil_type" multiple placeholder="请选择" size="100">
                  <el-option
                  v-for="item in oil_product"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配金额">
              <el-input v-model="editForm.company_balance" size="100" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit()" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

    <!--追加金额-->
    <popup :width="30" @closePop="closeChange" :title="addMoneyTitle" :showPop="addMoneyFormVisible">
      <el-form :model="addMoneyForm" label-width="120px" ref="addMoneyForm">
        <el-form-item label="原始金额:">
          {{addMoneyForm.company_balance}}
				</el-form-item>
        <el-form-item label="修改类型:">
          <el-radio-group  v-model="addMoneyForm.type" @change="changeType">
            <el-radio label="1">增加金额</el-radio>
            <el-radio label="2">扣除金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额输入:" prop="business_lis">
          <el-input v-model="addMoneyForm.money" type="number" @change="handleMoney"></el-input>
				</el-form-item>
        <el-form-item label="最新余额:">
          {{addMoneyForm.new_money}}
				</el-form-item>
			</el-form>
      <div slot="footer" class="dialog-footer clearfloat">
				<el-button @click.native="addMoneyFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addMoneySubmit('editForm')">提交</el-button>
			</div>
    </Popup>

    </section>
</template>

<script>
    import { getSubCardList, getOilProduct, addSubCard, updSubCard, delCusCards, updMoney} from '../../api/client-api';
    import { messageWarn } from '../../common/js/commonMethod';
    import Popup from 'base/popup'

    export default {
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
            return {
                addMoneyForm: {
                  company_balance: '',
                  type: "1",
                  money: '',
                  new_money: '',
                  card_id: ''
                },
                addMoneyFormVisible: false,
                addMoneyTitle: '修改金额',
                oil_product: [],
                card_no: '',
                //文件上传地址
                upload_url: this.GLOBAL.url + '/backen/cus_cards/sub/upload',
                initList: [],
                listLoading: false,
                 //新增界面数据
                addFormVisible: false,
                addLoading: false,
                //del_ids
                del_ids: [],
				        addForm: {
                  name: '',
                  mobile: '',
                  car_num: '',
                  car_type: '',
                  car_vol: '',
                  day_vol: '',
                  limit_oil_type: [],
                  money: ''
                },
                addRules: {
                  name: [
                    {required: true, message: '姓名不能为空', trigger: 'blur'}
                  ],
                  mobile: [
                    {required: true, validator: checkPhone, trigger: 'blur'}
                  ]
                },
                editFormVisible: false,//编辑界面是否显示
				        editLoading: false,
                //编辑界面数据
                editForm: {
                  card_id:'',
                  name: '',
                  mobile: '',
                  car_num: '',
                  car_type: '',
                  car_vol: '',
                  day_vol: '',
                  limit_oil_type: [],
                  company_balance: ''
                },
                list: [],
                total: 0,
                page_num: 1,
                num: 15
            }
        },
        created:function() {
            this.getList(this.page_num,this.num, this.card_no);
            this.getOilProduct()
        },
        methods: {
          uploadError(err) {

          },
          uploadSuccess(response) {
            if (response.status === 0) {
              messageWarn('上传成功');
              this.getList(this.page_num,this.num, this.card_no);
            } else {
              this.$alert(response.msg, '错误提示', {
                confirmButtonText: '确定',
                callback: action => {
                  return;
                }
              });
            }
          },
          downTemplate() {
            window.open(this.GLOBAL.url + '/backen/cus_cards/sub/template', '_blank');
          },
          //追加金额
          addMoneySubmit() {
            let params = {
              money: this.addMoneyForm.new_money
            }
            updMoney(params, this.addMoneyForm.card_id).then((res) => {
              if(res.data.status === 0) {
                messageWarn('修改成功');
                this.addMoneyFormVisible = false;
                this.getList(this.page_num,this.num, this.card_no);
              }
            })
          },
          handleEditMoney(index,row) {
            this.addMoneyForm = {
                  company_balance: '',
                  type: "1",
                  money: '',
                  new_money: '',
                  card_id: ''
                }
            this.addMoneyFormVisible = true;
            this.addMoneyForm.company_balance = row.company_balance;
            this.addMoneyForm.new_money = row.company_balance;
            this.addMoneyForm.card_id = row.card_id;
          },
          closeChange(val) {
            this.addMoneyFormVisible = val;
          },
          changeType() {
            this.addMoneyForm.new_money = this.addMoneyForm.company_balance;
            this.addMoneyForm.money = "";
          },
          handleMoney() {
            if (this.addMoneyForm.money) {
              if (this.addMoneyForm.type == 1) {
                this.addMoneyForm.new_money = Number(this.addMoneyForm.company_balance) + Number(this.addMoneyForm.money)
              } else {
                if (Number(this.addMoneyForm.money) > Number(this.addMoneyForm.company_balance)) {
                  this.addMoneyForm.money = "";
                  this.addMoneyForm.new_money = this.addMoneyForm.company_balance;
                } else {
                  this.addMoneyForm.new_money = Number(this.addMoneyForm.company_balance) - Number(this.addMoneyForm.money)
                }
              }
            } else {
              this.addMoneyForm.new_money = this.addMoneyForm.company_balance;
            }

          },
          getOilProduct: function() {
                getOilProduct().then(res => {
                    if(res.data.status === 0) {
                        this.oil_product = res.data.data;
                    }else{
                       messageWarn(res.data.msg); 
                    }
                })
            },
            selectGet(vId) {
               let obj = {};
                obj = this.add_provice_list.find((item)=>{
                   return item.id === vId;
                });
                this.addForm.province = obj.name;
            },
            selectOil(event) {
                if(event) {
                    let obj = {};
                    this.station = '';
                    obj = this.pro_list.find((item)=>{
                    return item.id === event;
                    });
                    this.oil_station = obj.stations;
                }
            },
            getList(page_num,num,card_no) {
                this.listLoading = true;
                let params = {
                    page_num: page_num,
                    num: num,
                    card_no: card_no
                };
                getSubCardList(params).then(res => {
                    this.listLoading = false;
                    if(res.data.status===0) {
                        this.initList = res.data.data.card_list;
                        this.total = res.data.data.card_list_cnt;
                    }else{
                        messageWarn(res.data.msg);
                    }
                })
            },
            //提交新增
            addSubmit: function(addForm) {
              this.$refs[addForm].validate((valid) => {
                if (valid) {
                  
                  let limit_oil_type = this.addForm.limit_oil_type.join(',');
                  let params = {
                    name: this.addForm.name,
                    mobile: this.addForm.mobile,
                    car_num: this.addForm.car_num,
                    car_type: this.addForm.car_type,
                    car_vol: this.addForm.car_vol,
                    day_vol: this.addForm.day_vol,
                    limit_oil_type: limit_oil_type,
                    money: this.addForm.money
                  }
                  addSubCard(params).then((res) => {
                    if (res.data.status === 0) {
                      messageWarn('添加成功');
                      this.addFormVisible = false;
                      this.getList(this.page_num,this.num, this.card_no);
                    } else {
                      messageWarn(res.data.msg);
                    }
                  })
                } else {
                  return false;
                }
              })
            },
            //显示新增界面
            handleAdd: function () {
              this.addFormVisible = true;
              this.addForm = {
                  name: '',
                  mobile: '',
                  car_num: '',
                  car_type: '',
                  car_vol: '',
                  day_vol: '',
                  limit_oil_type: [],
                  money: ''
                  };
              },
            //查询
            searchList: function() {
                this.page_num = 1;
                this.getList(this.page_num,this.num, this.card_no);
            },
            //编辑
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.editForm.limit_oil_type = this.editForm.limit_oil_type.split(",");
            },

            //删除
            handleDel: function(index,row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                  type: 'warning'
                }).then(() => {
                  this.listLoading = true;
                  //NProgress.start();
                  let arr_id = JSON.stringify([row.card_id]);
                  let params = {
                      ids: arr_id
                  }
                  delCusCards(params).then((res) => {
                    this.listLoading = false;
                      //NProgress.done();
                      if(res.data.status === 0){
                          this.$message({
                          message: '删除成功',
                          type: 'success'
                      });
                      this.getList(this.page_num,this.num, this.card_no);
                      }else{
                          messageWarn(res.data.msg);
                      }
                  });
                }).catch(() => {

                });
            },
            //编辑提交
            editSubmit() {
                let limit_oil_type = this.editForm.limit_oil_type.join(',');
                let param = {
                    name: this.editForm.name,
                    mobile: this.editForm.mobile,
                    car_num: this.editForm.car_num,
                    car_type: this.editForm.car_type,
                    car_vol: this.editForm.car_vol,
                    day_vol: this.editForm.day_vol,
                    limit_oil_type: limit_oil_type,
                    money: this.editForm.company_balance
                }
               updSubCard(param,this.editForm.card_id).then(res => {
                   if(res.data.status === 0) {
                       messageWarn('编辑成功');
                       this.editFormVisible = false;
                       this.getList(this.page_num,this.num, this.card_no);
                   }else{
                       messageWarn(res.data.msg); 
                   }
               })    
            },
            selsChange: function (sels) {
                this.del_ids.length = 0;
                for(let i=0; i<sels.length; i++) {
                    this.del_ids.push(sels[i].card_id)
                }
				//this.sels = sels;
            },
            //批量删除
            batchRemove: function() {
              this.$confirm('确认删除选中记录吗?', '提示', {
					      type: 'warning'
				      }).then(() => {
					      this.listLoading = true;
                //NProgress.start();
                let params = {
                    ids: JSON.stringify(this.del_ids)
                }
					      delCusCards(params).then((res) => {
						      this.listLoading = false;
                  //NProgress.done();
                      if(res.data.status === 0){
                          this.$message({
                          message: '删除成功',
                          type: 'success'
                      });
                      this.getList(this.page_num,this.num, this.card_no);
                  }else{
                      messageWarn(res.data.msg);
                  }
					});
				}).catch(() => {

				});
            },
            handleCurrentChange(val) {
                this.page_num = val;
                this.getList(this.page_num,this.num,this.card_no);
            },
            //导出表格
            outExcelTable() {
                window.open(this.GLOBAL.url + '/backen/cus_cards/sub?act=export&card_no='+this.card_no, '_blank');
            }
        },
    }
</script>

<style scoped>
    .upload{
      font-size:10px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      margin-left: 10px;
    }
    .handleDown{
      font-style: normal;
      color: #679AFF;
      cursor:pointer;
    }
</style>