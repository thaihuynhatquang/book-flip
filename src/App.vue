<template>
  <div id="bookflip">
    <div :class="{ 'has-mouse': hasMouse }" @touchstart="hasMouse = false">
      <flip-book
        class="flipbook"
        :pages="pages"
        :startPage="pageNum"
        @set-url-from-page="setUrlFromPage"
        @set-page-from-url="setPageFromUrl"
        :zooms="[1, 2]"
      >
      </flip-book>
    </div>
  </div>
</template>

<script>
import FlipBook from "./components/BookFlip/index.vue";
import LeftIcon from "vue-material-design-icons/ChevronLeft";
import RightIcon from "vue-material-design-icons/ChevronRight";
import PageFirstIcon from "vue-material-design-icons/PageFirst";
import PageLastIcon from "vue-material-design-icons/PageLast";

export default {
  name: "BookFlip",
  components: {
    FlipBook,
    LeftIcon,
    RightIcon,
    PageFirstIcon,
    PageLastIcon,
  },
  data: () => {
    return {
      pages: [
        null,
        "https://i.picsum.photos/id/413/400/600.jpg?hmac=y8FsPsjNs7PwaRawnYVp3wQg6evThVMvWMe8PiMImRo",
        "https://i.picsum.photos/id/1051/400/600.jpg?hmac=fc0_O5Vd0-b-_dNtfWxrKR8xVdqqmlBA4wHeQToox_4",
        "https://i.picsum.photos/id/423/400/600.jpg?hmac=3Y1_CVw8GammIaogm2JuZ4kIXmU0iKmeKPM3qXht7gE",
        "https://i.picsum.photos/id/239/400/600.jpg?hmac=iPhV3gDG_Tz6FjDLoIbZcW2Soc4DJNbfnlhWdIIHU3w",
        "https://i.picsum.photos/id/1035/400/600.jpg?hmac=hKKJgB92gXvDhCLyQtOO6iWGwpe50KYuIZkQRlQSmc0",
        "https://i.picsum.photos/id/85/400/600.jpg?hmac=OyOgWPfwv7Gsff0ywLmvJbHPtxmj8_ZAo8JGx8DV0Ao",
        "https://i.picsum.photos/id/757/400/600.jpg?hmac=zMttZXcr0ZGlxwLL0MzI-v-VsbiDgoEtFYA27PShT0c",
        "https://i.picsum.photos/id/336/400/600.jpg?hmac=D5OuITGaWwYrz5bKiBYX6PvqP3NVmFdCMsahfpI9xQ8",
        "https://i.picsum.photos/id/1072/400/600.jpg?hmac=-v-dfM2RzyVbA9uiSXKeECIoi1Ps6YLLNgkfULQ5vOA",
        "https://i.picsum.photos/id/868/400/600.jpg?hmac=rYpPl-LSTq6HiOV03M4zHXYTGU5pWSb8DhS84E-hKMM",
      ],
      pageNum: null,
      hasMouse: true,
      currentPage: null,
    };
  },
  methods: {
    onFlipLeftEnd: function (page) {
      this.setUrlFromPage(page);
    },
    onFlipRightEnd: function (page) {
      this.setUrlFromPage(page);
    },
    setUrlFromPage: function (page, reload = false) {
      if ("URLSearchParams" in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", page.toString());
        if (reload) {
          window.location.search = searchParams.toString();
        } else {
          var newRelativePathQuery =
            window.location.pathname + "?" + searchParams.toString();
          history.pushState(null, "", newRelativePathQuery);
        }
      }
    },
    setPageFromUrl: function () {
      const params = new URLSearchParams(window.location.search);
      if (params.has("page")) {
        const pageNum = parseInt(params.get("page"));
        if (pageNum > 0 && pageNum < this.pages.length) {
          return (this.pageNum = pageNum);
        } else if (pageNum <= 0) {
          this.pageNum = 1;
          this.setUrlFromPage(1);
          return;
        } else {
          this.pageNum = this.pages.length - 1;
          this.setUrlFromPage(this.pages.length - 1);
          return;
        }
      }
    },
  },
  mounted: function () {
    window.addEventListener("hashchange", this.setPageFromUrl);
    return this.setPageFromUrl();
  },
};
</script>

<style>
#bookflip {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.flipbook {
  width: 100%;
  height: 90vh;
  align-items: center;
}

.flipbook .bounding-box {
  box-shadow: 0 0 20px #000;
}
</style>
