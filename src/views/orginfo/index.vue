<template>
  <div>
    <el-card v-loading="start_loading">
      <div slot="header">
        <el-page-header @back="goBack" content="企业信息详情页">
        </el-page-header>
        <div class="card-body">
          <div class="body-container">
            <el-tag size="medium">{{ database_id }}</el-tag>
            <span class="name-form-item">{{ name }}</span>
            <div class="address-form-item">
              <i class="el-icon-location-information">{{ address }}</i>
            </div>
            <div class="rate-form-item">
              <el-rate v-model="starscore" disabled text-color="#ff9900" />
              <span>Score : {{ score }}分</span>
              <el-button
                :loading="score_btn_loading"
                @click="getScore"
                size="small"
                type="warning"
                plain
                >在线评分</el-button
              >
            </div>
            <div class="normal-form-item">permId: {{ permId }}</div>
            <div class="normal-form-item">
              permorg_link: <a :href="url" target="_blank">{{ url }}</a>
            </div>
          </div>
        </div>
      </div>
      <div
        v-loading="chart_loading"
        id="myChart"
        :style="{ width: '100%', height: '700px' }"
      ></div>
    </el-card>
    <el-dialog
      width="30%"
      title="企业信息"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <div class="dialog-form-item">数据库ID：{{ d_db_id }}</div>
      <div class="dialog-form-item">姓名：{{ d_name }}</div>
      <div class="dialog-form-item">permId：{{ d_permid }}</div>
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
import { singleorg, getorgscore } from "@/api/org/";
export default {
  data() {
    return {
      start_loading: false,
      chart_loading: false,
      score_btn_loading: false,
      dialogVisible: false,
      nodes: [],
      edges: [],
      score: 0,
      //本页信息相关
      database_id: 0,
      name: "",
      permId: 0,
      url: "",
      address: "",
      //点击信息相关
      d_db_id: 0,
      d_name: "",
      d_permid: 0,
      d_url: "",
    };
  },
  watch: {
    $route: "getQuerys",
  },
  computed: {
    starscore: {
      get() {
        return parseInt((this.score / 20).toFixed(3));
      },
      set(val) {
        this.score = val * 20;
      },
    },
  },
  activated() {
    //重置数据
    this.score = 0;
    this.getQuerys();
    this.start_loading = true;
    //发送请求
    let db_id = this.database_id;
    singleorg(db_id).then((res) => {
      //建立本页节点
      this.nodes.push({
        id: db_id,
        name: this.name,
        draggable: true,
        category: 0,
        meta: {
          address: this.address,
          permId: this.address,
          url: this.url,
        },
      });
      //建立其余节点及关系
      res.data.data.forEach((item) => {
        let name = `${item.honorificPrefix} ${item.givenName} ${item.familyName} ${item.additionalName}`;
        //点
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
        //边
        this.edges.push({
          source: item.id + "",
          target: this.database_id,
          value: "任职于",
        });
      });
      //绘制图形
      this.drawLine();
      this.start_loading = false;
    });
  },
  deactivated() {
    this.nodes = [];
    this.edges = [];
  },
  methods: {
    getQuerys() {
      this.database_id = this.$route.query.id;
      this.name = this.$route.query.name;
      this.permId = this.$route.query.permid;
      this.url = this.$route.query.url;
      this.address = this.$route.query.address;
    },
    goBack() {
      history.back();
    },
    getScore() {
      this.score_btn_loading = true;
      getorgscore(this.database_id)
        .then((res) => {
          //score
          let s;
          if (res.data.data < 12000) {
            s = ((res.data.data / 12000) * 100).toFixed(3);
          } else {
            s = ((res.data.data / 20000) * 100).toFixed(3);
          }
          this.score = s > 100 ? 100 : s;
          this.$message({ type: "success", message: "在线评分成功!" });
          this.score_btn_loading = false;
        })
        .catch(() => {
          this.$message({ type: "error", message: "Error" });
        });
    },
    goToInfo() {
      this.dialogVisible = false;
      this.$router.push({
        path: "/personinfo",
        query: {
          id: this.d_db_id,
          name: this.d_name,
          permId: this.d_permid,
          url: this.d_url,
        },
      });
    },
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.off("click");
      myChart.on("click", (params) => {
        if (params.dataType == "node" && params.data.id != this.database_id) {
          this.d_db_id = params.data.id;
          this.d_name = params.data.name;
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
  display: flex;
  align-items: center;
}
.body-container {
  margin-top: 20px;
  line-height: 20px;
}
.name-form-item {
  font-size: 22px;
  font-weight: bolder;
}
.address-form-item {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.rate-form-item {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.normal-form-item {
  font-size: 18px;
  margin-top: 15px;
}
.dialog-form-item {
  font-size: 16px;
  margin-top: 10px;
}
</style>