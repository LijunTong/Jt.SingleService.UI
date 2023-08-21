<template>
  <el-card class="box-card" shadow="hover">
    <div class="article-list">
      <el-row :gutter="20">
        <el-col
          v-for="article in articles"
          :key="article.id"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <el-card class="article-card">
            <div class="article-title">{{ article.title }}</div>
            <div class="article-info">
              <span class="author">作者：{{ article.userId }}</span>
              <span
                class="created-at"
              >时间：{{ article.createTime }}</span>
            </div>
            <div class="article-summary">{{ article.id }}</div>
            <div class="article-statistics">
              <span class="likes">点赞数：{{ article.articleLikes || 0 }}</span>
              <span class="views">查看数：{{ article.articleReads || 0 }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as articleApi from '@/api/article'
export default {
  data() {
    return {
      pagination: {
        size: 10,
        page: 1,
        total: 0,
        column: ''
      },
      articles: []
    }
  },
  mounted() {
    console.log(11111)
  },
  activated() {
    console.log(11111)
    this.pagination.column = this.$route.query.column
    this.getArticleByColumn()
  },
  methods: {
    getArticleByColumn() {
      articleApi.getArticleByColumn(this.pagination)
        .then(res => {
          if (res.code === 1) {
            console.log(res.data)
            this.articles = res.data.data
          }
        })
    }
  }
}
</script>

<style scoped>
.article-list {
  padding: 20px;
}

.article-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.article-info {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}

.article-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.article-statistics {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
