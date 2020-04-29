<template>
  <div class="articles-by-category">
    <PageTitle icon="fa fa-folder-o" :main="category.nome" sub="Categoria" />
    <ul>
      <li v-for="article in articles" :key="article.id">{{article.nome}}</li>
    </ul>
    <div class="load-more">
      <button
        v-if="loadMore"
        class="btn btn-lg btn-outline-primary"
        @click="getArticles"
      >Carregar Mais Artigos</button>
    </div>
  </div>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  name: "ArticlesByCategory",
  components: { PageTitle },
  data: function() {
    return {
      category: {},
      articles: [],
      page: 1,
      loadMore: true
    };
  },

  methods: {
    getCategory() {
      const url = `${baseApiUrl}/categories/${this.category.id}`;
      axios(url).then(res => (this.category = res.data));
    },
    getArticles() {
      const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`;
      axios(url).then(res => {
        this.articles = this.articles.concat(res.data);
        this.page++;

        if (res.data.length === 0) this.loadMore = false;
      });
    }
  },
  mounted() {
    this.category.id = this.$route.params.id;
    this.getCategory();
    this.getArticles();
  }
};
</script>

<style>
</style>