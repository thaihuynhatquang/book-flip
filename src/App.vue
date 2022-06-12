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
      <template v-slot:action-bar-bottom>
        <div class="action-bar-bottom">
          <button class="action-bar-button" >Print</button>
          <button class="action-bar-button" >Download</button>
        </div>
      </template>
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
import printJS from "print-js";

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
        "http://samsung.aiibook.net/vn/catImage/53/001.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/002.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/003.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/004.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/005.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/006.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/007.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/008.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/009.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/010.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/011.jpg",
        "http://samsung.aiibook.net/vn/catImage/53/s040.jpg",
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
      printJS({
        printable: this.imagesToPrint.map((image) => image.src),
        type: "image",
        imageStyle: "width:auto; height: 95vh",
      });
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
  margin: 20px 0 20px 0;
  height: 80vh;
}
.flipbook {
  width: 100%;
  height: 100%;
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
  font-size: 15px;
}

.btn-print {
  width: 120px;
  height: 25px;
  border: 1px solid #cccccc;
  cursor: pointer;
  color: #000000;
  margin: 0 10px 10px 0;
  font-size: 15px;
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
