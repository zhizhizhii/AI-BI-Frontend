<template>
  <el-header class="header">
    <div>
      <i class="el-icon-s-fold" @click="changeCollapse"></i>
      <span>AI与商务智能</span>
    </div>
    <div
      style="
        width: 90px;
        display: flex;
        align-items: center;
        justify-content: space-around;
      "
    >
      <div class="avatar-bar">
        <el-avatar
          src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
          shape="square"
          :size="40"
          class="avatar"
        ></el-avatar>
      </div>
      <el-tooltip
        class="item"
        effect="dark"
        content="网页全屏"
        placement="bottom"
      >
        <i class="el-icon-view" @click="screenFull"> </i>
      </el-tooltip>
    </div>
  </el-header>
</template>

<script>
import screenfull from "screenfull";
export default {
  name: "HeadBar",
  components: {},
  props: {},
  data() {
    return {
      breadList: [],
    };
  },
  computed: {},
  watch: {},
  mounted() {
  },
  methods: {
    changeCollapse() {
      this.$emit("changeCollapse", 0);
    },
    screenFull() {
      screenfull.toggle();

      this.$message.success("全屏啦");
    },
    onLogout() {
      this.$confirm("是否确认退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.localStorage.removeItem("user");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出登录成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  .avatar {
    margin-right: 10px;
  }
}
</style>