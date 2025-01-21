<template>
  <div class="video-creator">
    <h1>Create Video from Images</h1>
    <input type="file" multiple @change="handleFiles" />
    <button @click="createVideo">Create Video</button>
    <video v-if="videoSrc" controls :src="videoSrc"></video>
  </div>
</template>
<script>
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export default {
  data() {
    return {
      ffmpeg: null,
      files: [],
      videoSrc: null,
      isProcessing: false,
    };
  },
  methods: {
    async initFFmpeg() {
      this.ffmpeg = createFFmpeg({ log: true });
      await this.ffmpeg.load();
    },
    handleFiles(event) {
      this.files = Array.from(event.target.files);
    },
    async createVideo() {
      if (this.files.length === 0) {
        alert('Please select some image files first.');
        return;
      }

      if (!this.ffmpeg) {
        await this.initFFmpeg();
      }

      this.isProcessing = true;
      try {
        for (let i = 0; i < this.files.length; i++) {
          this.ffmpeg.FS('writeFile', `img${i}.png`, await fetchFile(this.files[i]));
        }

        await this.ffmpeg.run('-framerate', '1', '-i', 'img%d.png', '-c:v', 'libx264', '-r', '30', '-pix_fmt', 'yuv420p', 'output.mp4');
        const data = this.ffmpeg.FS('readFile', 'output.mp4');

        this.videoSrc = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      } catch (error) {
        console.error('Error creating video:', error);
      } finally {
        this.isProcessing = false;
      }
    }
  }
};
</script>

<style scoped>
.video-creator {
  text-align: center;
}
input {
  margin: 20px;
}
button {
  margin: 20px;
}
</style>