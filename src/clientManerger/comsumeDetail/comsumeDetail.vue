<template>
  <section>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
            <el-form-item label="卡号">
              <el-input v-model="card_no"  placeholder="请输入卡号"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="mobile"  placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker
                    v-model="time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
			</el-form>
		</el-col>

     <!--列表-->
    <el-col :span="24" class="tab_header">
        <div class="tab_head_title">消费列表</div>
        <el-button type="success" size="small" @click="outExcelTable">&nbsp;&nbsp;导出&nbsp;&nbsp;</el-button>
    </el-col>
		<el-table :data="initList" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<el-table-column type="index" label="序号" width="100">
			</el-table-column>
			<el-table-column prop="name" label="姓名">
			</el-table-column>
			<el-table-column prop="card_no" label="卡号">
			</el-table-column>
			<el-table-column prop="card_type" label="卡类型">
			</el-table-column>
			<el-table-column prop="car_type" label="车型">
			</el-table-column>
			<el-table-column prop="car_vol" label="油箱容量">
			</el-table-column>
      <el-table-column prop="station_name" label="消费油站">
			</el-table-column>
      <el-table-column prop="oil_type" label="油品信息">
			</el-table-column>
      <el-table-column prop="vol" label="升数">
			</el-table-column>
      <el-table-column prop="money" label="金额">
			</el-table-column>
      <el-table-column prop="consume_time" label="消费时间" min-width="150">
			</el-table-column>
		</el-table>
    
    <!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="num" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
  </section>
</template>

<script>
  import { comsumeDetail } from '../../api/client-api';
	import { messageWarn } from '../../common/js/commonMethod';
  export default {
    data() {
      return {
        listLoading: false,
        time: [],
        initList: [],
        total: 0,
        begin_time: '',
        end_time: '',
        card_no: '',
        mobile: '',
        page_num: 1,
        num: 15,
      }
    },
    created: function() {
        this.getList(this.card_no,this.mobile,this.begin_time,this.end_time,this.page_num,this.num);
    },
    methods: {
      search: function() {
        this.begin_time = "";
        this.end_time = "";
        if(this.time[0]) {
          let begin_date = new Date(this.time[0]);
          this.begin_time = begin_date.getFullYear() + '-' + (begin_date.getMonth() + 1) + '-' + begin_date.getDate() + ' ' + begin_date.getHours() + ':' + begin_date.getMinutes() + ':' + begin_date.getSeconds(); 
        }
        if(this.time[1]) {
          let end_date = new Date(this.time[1]);
          this.end_time = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate() + ' ' + end_date.getHours() + ':' + end_date.getMinutes() + ':' + end_date.getSeconds(); 
        }
        this.getList(this.card_no,this.mobile,this.begin_time,this.end_time,this.page_num,this.num);
      },
      handleCurrentChange: function(val) {
        this.page_num = val;
        this.getList(this.card_no,this.mobile,this.begin_time,this.end_time,this.page_num,this.num);

      },
      getList: function(card_no,mobile,begin_time,end_time,page_num,num) {
        let params ={
          card_no: card_no,
          mobile: mobile,
          begin_time: begin_time,
          end_time: end_time,
          page_num: page_num,
          num: num
        }
        comsumeDetail(params).then( res=> {
          if(res.data.status === 0) {
            this.initList = res.data.data.consume_list;
            this.total = res.data.data.consume_list_cnt;
          }else{
            messageWarn(res.data.msg);
          }
        })
      },
      //导出表格
      outExcelTable() {
        let data = '&card_no='+ this.card_no + '&mobile=' + this.mobile + '&begin_time='+ this.begin_time + '&end_time=' + this.end_time; 
        window.open(this.GLOBAL.url + '/backen/cus_query/consume/detail?act=export'+data, '_blank');
      }
    }
  }

</script>