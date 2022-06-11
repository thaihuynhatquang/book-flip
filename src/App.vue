<template>
  <div id="bookflip">
    <flip-book
      class="flipbook"
      :pages="pages"
      :startPage="pageNum"
      @set-url-from-page="setUrlFromPage"
      @set-page-from-url="setPageFromUrl"
      @add-image-to-print="addImageToPrint"
      :zooms="[1, 2]"
    >
    </flip-book>
    <modal name="preview-images" height="auto" :scrollable="true">
      <close-icon
        :size="20"
        class="btn btn-close"
        @click="$modal.hide('preview-images')"
      />
      <div class="modal-title">Information</div>
      <div v-if="imagesToPrint.length > 0" class="preview-images-list">
        <div
          class="preview-image"
          v-for="{ src, pageNum } in imagesToPrint"
          :key="pageNum"
        >
          <div class="image">
            <img :src="src" />
            <div class="image-btn">
              <delete-icon
                :size="20"
                class="btn btn-remove"
                @click="removeImageFromPrint(pageNum)"
              />
            </div>
          </div>
          <div class="footer">Page {{ pageNum }}</div>
        </div>
      </div>
      <div class="text-no-images" v-else>No images selected</div>
      <button
        :disabled="!imagesToPrint.length > 0"
        class="btn btn-print"
        @click="printImages"
      >
        PRINT
      </button>
    </modal>
  </div>
</template>

<script>
import FlipBook from "./components/BookFlip/index.vue";
import CloseIcon from "vue-material-design-icons/Close";
import DeleteIcon from "vue-material-design-icons/Delete";

export default {
  name: "BookFlip",
  components: {
    FlipBook,
    CloseIcon,
    DeleteIcon,
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
      imagesToPrint: [],
    };
  },
  methods: {
    onFlipLeftEnd: function (page) {
      this.setUrlFromPage(page);
    },
    onFlipRightEnd: function (page) {
      this.setUrlFromPage(page);
    },
    setUrlFromPage: function (page) {
      if ("URLSearchParams" in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", page.toString());
        var newRelativePathQuery =
          window.location.pathname + "?" + searchParams.toString();
        history.pushState(null, "", newRelativePathQuery);
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
    addImageToPrint: function (page) {
      if (
        !this.imagesToPrint.find(
          (image) => image.pageNum.toString() === page.toString()
        )
      ) {
        this.imagesToPrint.push({
          src: this.pages[page],
          pageNum: page.toString(),
        });
      }
      this.$modal.show("preview-images");
    },
    removeImageFromPrint: function (page) {
      this.imagesToPrint = this.imagesToPrint.filter(
        (image) => image.pageNum.toString() !== page.toString()
      );
    },
    printImages: function () {
      console.log("HJIHIHI");
    },
  },
  mounted: function () {
    window.addEventListener("hashchange", this.setPageFromUrl);
    return this.setPageFromUrl();
  },
  watch: {
    imagesToPrint: function (newValue) {
      console.log(newValue);
      this.$modal.show("preview-images");
    },
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

.btn-close {
  position: absolute;
  right: 5px;
}

.btn {
  font-size: 30px;
  color: #666;
  cursor: pointer;
}

.btn svg {
  bottom: 0;
}

.action-bar .btn:not(:first-child) {
  margin-left: 10px;
}

.btn:hover {
  filter: drop-shadow(1px 1px 5px rgb(134, 133, 133));
  cursor: pointer;
}

.btn:active {
  filter: none !important;
}

.btn.disabled {
  color: #999;
  pointer-events: none;
}

.modal-title {
  margin-top: 10px;
  font-weight: 600;
}

.preview-images-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.preview-image {
  display: flex;
  flex-direction: column;
  margin: 10px;
}

.preview-image .image {
  position: relative;
  text-align: center;
}

.preview-image .image img {
  max-height: 80px;
  max-width: 240px;
  height: auto;
}

.image-btn {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.5);
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.image:hover > .image-btn {
  display: flex;
}

.preview-image .footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  font-size: 12px;
}

.btn-print {
  width: 120px;
  height: 25px;
  border: 1px solid #cccccc;
  cursor: pointer;
  color: #000000;
  margin: 0 10px 10px 0;
  font-size: 12px;
}

.btn-print:disabled {
  color: #cccccc;
  pointer-events: none;
}

.vm--overlay {
  background: rgba(0, 0, 0, 0.5);
}

.text-no-images {
  margin: 30px 0 30px 0;
}
</style>
