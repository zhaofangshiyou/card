<template>
  <div class="popup" v-if="showPop">
    <div class="wrapper" :style="{width: width + '%'}">
      <div class="popheader">
        <div class="title">{{title}}</div>
        <div class="close" @click="close">
          <i class="el-dialog__close el-icon el-icon-close"></i>
        </div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 30
    },
    showPop: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('closePop',false);
    }
  }
}
</script>

<style lang="scss" scoped>
  .popup{
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: auto;
    margin: 0;
    background:rgba(0,0,0,.3);
    z-index: 99999;
    .wrapper{
      position: absolute;
      background: #fff;
      height: auto;
      left: 50%;
      transform: translateX(-50%);
      top: 15%;
      padding: 20px;
      border-radius: 4px;
      .popheader{
        display: flex;
        justify-content: space-between;
        .title{
          line-height: 1;
          font-size: 16px;
          font-weight: 700;
          color: #1f2d3d;
        }
        .close{
          color: #bfcbd9;
          font-size: 16px;
        }
      }
      .content{
        padding: 30px 0;
      }
      footer{
        width: 100%;
        text-align: right;
      }
    }
  }
</style>
