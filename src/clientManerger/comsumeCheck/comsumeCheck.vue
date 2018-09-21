<template>
  <section>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
            <el-form-item label="加油次数大于(次)：">
              <el-input v-model="times" type="number" :min="0" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item label="加油总量大于(升)：">
              <el-input type="number" v-model="vol" :min="0" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item label="单比加油量大于油箱容量(%)：">
              <el-input v-model="rate" type="number" :step="0.01" :min="0.00" :max="10" style="width: 150px"></el-input>
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
			<el-table-column prop="card_no" label="卡号" width="150">
			</el-table-column>
			<el-table-column prop="card_type" label="卡类型">
			</el-table-column>
			<el-table-column prop="car_type" label="车型" width="100">
			</el-table-column>
			<el-table-column prop="car_vol" label="油箱容量" width="100">
			</el-table-column>
      <el-table-column prop="t_vol" label="总升数">
			</el-table-column>
      <el-table-column prop="t_time" label="加油次数">
			</el-table-column>
      <el-table-column prop="per_t_vol" label="加油次数">
			</el-table-column>
      <el-table-column prop="t1_vol" label="92#总升数" width="120">
			</el-table-column>
      <el-table-column prop="per_t1_vol" label="92#单比加油量"  width="120">
			</el-table-column>
      <el-table-column prop="t1_times" label="92#加油次数" width="120">
			</el-table-column>
      <el-table-column prop="t2_vol" label="95#总升数" width="120">
			</el-table-column>
      <el-table-column prop="per_t2_vol" label="95#单比加油量" width="120" >
			</el-table-column>
      <el-table-column prop="t2_times" label="95#加油次数" width="120">
			</el-table-column>
      <el-table-column prop="t3_vol" label="98#总升数" width="120">
			</el-table-column>
      <el-table-column prop="per_t3_vol" label="98#单比加油量" width="120">
			</el-table-column>
      <el-table-column prop="t3_time" label="98#加油次数" width="120">
			</el-table-column>
      <el-table-column prop="t4_vol" label="0#总升数" width="120">
			</el-table-column>
      <el-table-column prop="per_t4_vol" label="0#单比加油量" width="120">
			</el-table-column>
      <el-table-column prop="t4_time" label="0#加油次数" width="120">
			</el-table-column>
      <el-table-column prop="t5_vol" label="-10#总升数" width="120">
			</el-table-column>
      <el-table-column prop="per_t5_vol" label="-10#单比加油量" width="120">
			</el-table-column>
      <el-table-column prop="t5_time" label="-10#加油次数" width="130">
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
  import { comsumeCheck } from '../../api/client-api';
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
        times: '',
        vol: '',
        rate: '',
        mobile: '',
        page_num: 1,
        num: 15,
      }
    },
    created: function() {
        this.getList(this.times,this.vol,this.rate,this.begin_time,this.end_time,this.page_num,this.num);
    },
    methods: {
      handleChangeTime(val) {
        console.log(val)
        console.log(123)
        
      },
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
        this.getList(this.times,this.vol,this.rate,this.begin_time,this.end_time,this.page_num,this.num);
      },
      handleCurrentChange: function(val) {
        this.page_num = val;
        this.getList(this.times,this.vol,this.rate,this.begin_time,this.end_time,this.page_num,this.num);

      },
      getList: function(times,vol,rate,begin_time,end_time,page_num,num) {
        if (rate) {
          rate = rate +'%'
        }
        let params ={
          times: times,
          vol: vol,
          rate: rate,
          begin_time: begin_time,
          end_time: end_time,
          page_num: page_num,
          num: num
        }
        comsumeCheck(params).then( res=> {
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
        let data = '&time='+ this.time + '&vol=' + this.vol + '&rate=' + this.rate + '&begin_time='+ this.begin_time + '&end_time=' + this.end_time; 
        window.open(this.GLOBAL.url + '/backen/cus_query/consume/check?act=export'+data, '_blank');
      }
    }
  }

</script>