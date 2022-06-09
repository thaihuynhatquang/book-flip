<template>
  <div :class="{ 'has-mouse': hasMouse }" @touchstart="hasMouse = false">
    <Flipbook
      class="flipbook"
      :pages="pages"
      :startPage="pageNum"
      v-slot="flipbook"
      ref="flipbook"
      @flip-left-start="onFlipLeftStart"
      @flip-left-end="onFlipLeftEnd"
      @flip-right-start="onFlipRightStart"
      @flip-right-end="onFlipRightEnd"
      @zoom-start="onZoomStart"
      @zoom-end="onZoomEnd"
    >
      <div class="action-bar">
        <page-first-icon
          class="btn page-first"
          :class="{ disabled: !flipbook.canFlipLeft }"
          @click="onGoToFirstPage"
        />
        <left-icon
          class="btn left"
          :class="{ disabled: !flipbook.canFlipLeft }"
          @click="flipbook.flipLeft"
        />
        <div class="page-num">
          <span>
            Page
            <input
              ref="input"
              type="number"
              :value="flipbook.page"
              :min="1"
              :max="pages.length - 1"
              @keypress.enter="(event) => onGoToPage(event.target.value)"
            />
            of {{ flipbook.numPages }}
          </span>
        </div>

        <right-icon
          class="btn right"
          :class="{ disabled: !flipbook.canFlipRight }"
          @click="flipbook.flipRight"
        />
        <page-last-icon
          class="btn page-last"
          :class="{ disabled: !flipbook.canFlipRight }"
          @click="onGoToLastPage"
        />
      </div>
    </Flipbook>
  </div>
</template>

<script>
import Flipbook from "flipbook-vue";
import LeftIcon from "vue-material-design-icons/ChevronLeft";
import RightIcon from "vue-material-design-icons/ChevronRight";
import PageFirstIcon from "vue-material-design-icons/PageFirst";
import PageLastIcon from "vue-material-design-icons/PageLast";

export default {
  components: {
    Flipbook,
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
    onFlipLeftStart: function (page) {
      return console.log("flip-left-start", page);
    },
    onFlipLeftEnd: function (page) {
      console.log("flip-left-end", page);
      this.setUrlFromPage(page);
    },
    onFlipRightStart: function (page) {
      return console.log("flip-right-start", page);
    },
    onFlipRightEnd: function (page) {
      console.log("flip-right-end", page);
      this.setUrlFromPage(page);
    },
    onGoToFirstPage: function () {
      console.log("flip-start");
      this.setUrlFromPage(1, true);
    },
    onGoToLastPage: function () {
      console.log("flip-end");
      this.setUrlFromPage(this.pages.length - 1, true);
    },
    onGoToPage: function (page) {
      console.log("goto-page", page);
      this.setUrlFromPage(page, true);
    },
    onZoomStart: function (zoom) {
      return console.log("zoom-start", zoom);
    },
    onZoomEnd: function (zoom) {
      return console.log("zoom-end", zoom);
    },
    setPageFromUrl: function () {
      const params = new URLSearchParams(window.location.search);
      if (params.has("page")) {
        return (this.pageNum = parseInt(params.get("page")));
      }
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
  },
  mounted: function () {
    window.addEventListener("hashchange", this.setPageFromUrl);
    return this.setPageFromUrl();
  },
};
</script>

<style>
.flipbook {
  width: 90vw;
  height: calc(100vh - 50px - 40px);
}

.flipbook .bounding-box {
  box-shadow: 0 0 20px #000;
}

.action-bar {
  width: 100%;
  height: 30px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-bar .btn {
  font-size: 30px;
  color: #666;
}

.action-bar .btn svg {
  bottom: 0;
}

.action-bar .btn:not(:first-child) {
  margin-left: 10px;
}

.has-mouse .action-bar .btn:hover {
  filter: drop-shadow(1px 1px 5px #000);
  cursor: pointer;
}

.action-bar .btn:active {
  filter: none !important;
}

.action-bar .btn.disabled {
  color: #999;
  pointer-events: none;
}

.action-bar .page-num {
  font-size: 12px;
  margin-left: 10px;
}

.action-bar .page-num input {
  width: 30px;
  text-align: center;
}
</style>
