<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="isCollapse"
    router
  >
  <img @click="goToHome" src="./logo.png" width="70%" style="margin: 15px 0 0 24px" />
    <el-menu-item index="/person">
      <i class="el-icon-s-custom"></i>
      <span slot="title">人物查询</span>
    </el-menu-item>
    <el-menu-item index="/org">
      <i class="el-icon-s-finance"></i>
      <span slot="title">企业查询</span>
    </el-menu-item>
    <el-menu-item index="/fileupload">
      <i class="el-icon-folder-opened"></i>
      <span slot="title">数据集上传?</span>
    </el-menu-item>
    <el-menu-item index="/multisearch">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">多跳查询?</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AsideBar",
  components: {},
  props: ["is-collapse"],
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() {
    
  },
  mounted() {},
  methods: {
    goToHome(){
      this.$router.push("/");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>