<template>
  <div>
    <el-card>
      <div slot="header">
        <span><b>企业模糊查询(fuzzy)</b></span>
      </div>
      <div class="card-body">
        <el-input
          style="flex: 2"
          v-model="orgName"
          placeholder="请输入企业名称,Expamle: alibaba group"
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
      title="企业信息"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <div class="dialog-form-item">数据库ID：{{ d_db_id }}</div>
      <div class="dialog-form-item">企业名：{{ d_name }}</div>
      <div class="dialog-form-item">地址：{{ d_address }}</div>
      <div class="dialog-form-item">permId：{{ d_permid }}</div>
      <div class="dialog-form-item">
        LINK：<a :href="d_url" target="_blank">{{ d_url }}</a>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goToOrg()">前往其主页</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { searchorg } from "@/api/org/";
export default {
  data() {
    return {
      dialogVisible: false,
      chart_loading: false,
      orgName: "",
      nodes: [],
      edges: [],
      d_db_id: 0,
      d_name: "",
      d_address: "",
      d_permid: 0,
      d_url: "",
    };
  },
  methods: {
    goToOrg() {
      this.dialogVisible = false;
      this.$router.push({
        path: "/orginfo",
        query: {
          id: this.d_db_id,
          name: this.d_name,
          address: this.d_address,
          permid: this.d_permid,
          url: this.d_url,
        },
      });
    },
    search() {
      if (this.orgName == "") {
        this.$message({ type: "error", message: "请输入企业名!" });
        return;
      }
      this.chart_loading = true;
      searchorg(this.orgName)
        .then((res) => {
          this.nodes = [];
          this.edges = [];
          res.data.data.forEach((item) => {
            this.nodes.push({
              id: item.id,
              name: item.organizationName,
              draggable: true,
              category: 0,
              meta: {
                address: item.headquartersAddress,
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
        });
    },
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.on("click", (params) => {
        if (params.dataType == "node") {
          this.d_db_id = params.data.id;
          this.d_name = params.data.name;
          this.d_address = params.data.meta.address;
          this.d_permid = params.data.meta.permId;
          this.d_url = params.data.meta.url;
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
                return `${params.data.value}\n${params.data.value}`;
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