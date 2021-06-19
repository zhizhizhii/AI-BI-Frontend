<template>
  <div>
    <el-card>
      <div slot="header">
        <span><b>人物查询</b></span>
      </div>
      <div class="card-body">
        <el-input
          style="flex: 2"
          v-model="familyName"
          placeholder="请输入姓(familyName)"
        ></el-input>
        <el-input
          style="flex: 2"
          v-model="givenName"
          placeholder="请输入名(givenName)"
        ></el-input>

        <el-button
          style="flex: 1"
          type="primary"
          plain
          icon="el-icon-search"
          @click="search"
          :loading="chart_loading"
          >搜索</el-button
        >
      </div>
    </el-card>
    <div
      v-loading="chart_loading"
      id="myChart"
      :style="{ width: '100%', height: '700px' }"
    ></div>
    <el-dialog
      width="30%"
      title="人物信息"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <div class="dialog-form-item">数据库ID：{{ d_dbId }}</div>
      <div class="dialog-form-item">姓名：{{ d_name }}</div>
      <div class="dialog-form-item">permId：{{ d_permId }}</div>
      <div class="dialog-form-item">
        LINK：<a :href="d_url" target="_blank">{{ d_url }}</a>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goToInfo">前往其主页</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { searchperson } from "@/api/person/";
export default {
  data() {
    return {
      //input
      givenName: "",
      familyName: "",

      chart_loading: false,
      dialogVisible: false,
      nodes: [],
      edges: [],
      d_dbId: 0,
      d_permId: 0,
      d_url: "",
      d_name: "",
    };
  },
  methods: {
    goToInfo() {
      this.dialogVisible = false;
      this.$router.push({
        path: "/personinfo",
        query: {
          id: this.d_dbId,
          name: this.d_name,
          permId: this.d_permId,
          url: this.d_url,
        },
      });
    },
    search() {
      if (this.givenName == "" || this.familyName == "") {
        this.$message({ type: "error", message: "请输入完整的姓和名!" });
        return;
      }
      this.chart_loading = true;
      searchperson(this.givenName, this.familyName)
        .then((res) => {
          this.nodes = [];
          this.edges = [];
          res.data.data.forEach((item) => {
            let name = `${item.honorificPrefix} ${item.givenName} ${
              item.familyName
            } ${
              item.additionalName == "" ? "" : "(" + item.additionalName + ")"
            }`;
            this.nodes.push({
              id: item.id,
              name,
              draggable: true,
              category: 1,
              meta: {
                permId: item.permId,
                url: item.uri,
              },
            });
          });
          this.drawLine();
          this.$message({ type: "success", message: "查询成功!" });
          this.chart_loading = false;
        })
        .catch(() => {
          this.$message({ type: "error", message: "Error!" });
          this.chart_loading = false;
        });
    },
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.on("click", (params) => {
        if (params.dataType == "node") {
          let meta = params.data.meta;
          this.d_dbId = params.data.id;
          this.d_name = params.data.name;
          this.d_permId = meta.permId;
          this.d_url = meta.url;
          this.dialogVisible = true;
        }
      });
      var option = {
        title: {
          text: "BI",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        tooltip: {},
        series: [
          {
            type: "graph",
            layout: "force",
            legendHoverLink: true,
            symbolSize: 80,
            roam: true,
            categories: [0, 1, 2],
            data: this.nodes,
            links: this.edges,
            roam: true,
            itemStyle: {
              normal: {
                borderColor: "#fff",
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.3)",
              },
            },
            label: {
              show: true,
              position: "bottom",
              distance: 5,
              fontSize: 12,
              align: "center",
            },
            force: {
              repulsion: 2000,
              edgeLength: [300, 350],
            },
            autoCurveness: 0.01,
            edgeLabel: {
              show: true,
              position: "middle",
              fontSize: 18,
              formatter: (params) => {
                return `${params.data.value}`;
              },
            },
            edgeSymbol: ["circle", "arrow"],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.card-body {
  width: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.dialog-form-item {
  font-size: 16px;
  margin-top: 10px;
}
</style>