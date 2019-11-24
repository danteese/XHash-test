<template>
  <v-app>
    <v-content>
      <v-container>
        <div class="header">
          <h1>Identify.</h1>
          <p>Integra identificación automática de nivel bancario y con la mejor experiencia para tu usuario.</p>
        </div>
        <v-stepper v-model="progress">
          <v-stepper-header>
            <v-stepper-step :complete="progress > 1" step="1">Bienvenido</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="progress > 2" step="2">OCR INE</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Prueba de vida</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4">Fin</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="mb-12 mx-auto" color="white" outlined height="400px">
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">Instrucciones</div>
                    <v-list-item-title class="headline mb-1">¡Bienvenido!</v-list-item-title>
                    <v-list-item-subtitle>Sistema de verificación de datos simulado.</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-card-subtitle>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut leo nunc. Proin ut nulla vel lacus consequat volutpat ac et neque. In at metus non risus finibus iaculis. Vivamus eget dapibus ipsum. Curabitur elementum rhoncus nisi, nec mollis lectus pharetra hendrerit. Morbi sed felis suscipit, malesuada nulla nec, gravida ipsum. Morbi at lectus sed mi pellentesque malesuada. Praesent magna orci, commodo sed felis sed, convallis interdum odio.
                  Duis maximus iaculis sem pretium rhoncus. Nam iaculis sollicitudin libero, id auctor erat pulvinar ut. In eu massa vehicula, commodo urna vel, tempus turpis. Sed eu tellus eu arcu consequat lobortis. Sed ut viverra nisi, non feugiat lorem. Cras convallis gravida sem, in pretium tellus ultricies non. Aliquam purus mauris, rhoncus quis libero et, faucibus malesuada velit. Nam vel efficitur mauris. Aliquam arcu elit, bibendum at vestibulum ac, dictum consectetur leo. In aliquet id ante vel interdum. Vestibulum eget nisi auctor erat fermentum tempor. Praesent nec velit non erat pharetra scelerisque. Duis dictum congue nibh a blandit. Sed dolor tortor, imperdiet vel hendrerit non, egestas sed eros. Cras nec venenatis augue, non pellentesque quam. Suspendisse feugiat nec tellus semper posuere.
                  Vestibulum suscipit efficitur luctus. Morbi a accumsan tortor, vel dapibus magna. Pellentesque ullamcorper ipsum vitae neque interdum, vitae dignissim sapien tincidunt. Nam sit amet nunc in massa iaculis dictum in non odio. Etiam luctus, felis quis sagittis porta, urna ex dignissim est, in malesuada tortor est non elit. Etiam tempor facilisis odio, id ullamcorper ante malesuada in. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla faucibus congue volutpat. Phasellus et rhoncus justo.
                  <br />
                  <br />
                  <strong>Da click en siguiente para continuar.</strong>
                </v-card-subtitle>
              </v-card>

              <v-btn color="primary" @click="progress = 2">Siguiente</v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <v-card
                class="mb-12"
                color="white"
                loader-height="10"
                :loading="requestProcessing"
                outlined
                min-height="200px"
              >
                <v-card-title>Identificación oficial: INE</v-card-title>
                <v-card-text>
                  Por favor proporciona una fotografía de tu INE por la parte delantera.
                  <v-layout justify-center>
                    <img src="./assets/ine.jpeg" alt height="300" />
                  </v-layout>
                  <v-layout>
                    <v-file-input
                      v-model="ine"
                      @change="onFileChange"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="INE"
                      label="Aquí va tu foto de INE"
                      prepend-icon="mdi-camera"
                    ></v-file-input>
                    <!-- TODO: Thiss button relies on a good server response -->
                    <v-btn :disabled="false" color="success" v-on:click="uploadImage">Upload</v-btn>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-btn color="primary" @click="turnOnVideo">Continue</v-btn>

              <v-btn text>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12" outlined color="white" min-height="400">
                <v-card-title>Prueba de vida</v-card-title>
                <v-card-text>
                  A continuación se le indicará que realice ciertas posiciones con su cabeza.
                  <br />
                  <br />

                  <v-layout justify-center>
                    <video ref="video" id="video" :width="video_W" :height="video_H" autoplay></video>
                  </v-layout>
                  <v-layout justify-center>
                    <v-btn id="snap" class="ma-2" color="success" v-on:click="capture">
                      <v-icon left>sentiment_satisfied_alt</v-icon>Take photo
                    </v-btn>
                  </v-layout>
                  <v-layout>
                    <v-btn color="primary" @click="progress = 4; turnOffVideo">Siguiente</v-btn>
                  </v-layout>
                  <canvas
                    :display="captures.length > 0"
                    ref="canvas"
                    id="canvas"
                    width="640"
                    height="480"
                  ></canvas>
                  <ul>
                    <li v-for="(c,i) in captures" :key="i">
                      <img :src="c" height="50" />
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
               
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="mb-12" outlined color="white" min-height="300">
                <v-card-title>Gracias por tu tiempo</v-card-title>
                <v-card-text>
                  Da click en finalizar para concluir la prueba.
                </v-card-text>
              </v-card>
              <v-btn color="primary" @click="progress = 1">Finalizar</v-btn>
            </v-stepper-content>

          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const client_id = 422;

export default {
  data() {
    return {
      ine: null,
      imageURL: "",
      video: null,
      canvas: {},
      captures: [],
      progress: 0, // Stepper starting point
      requestProcessing: false,
      video_H: 400,
      video_W: 400
    };
  },
  beforeCreate() {
    // TODO: Register an user and get the id
  },
  mounted() {
    // First stop everything
    this.turnOffVideo();
  },
  created() {
    console.log("Everything set up. By Dante Bazaldua");
  },
  methods: {
    onFileChange() {
      let reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result;
      };
      reader.readAsDataURL(this.ine);
    },
    async uploadImage() {
      console.log(this.ine);
      try {
        this.requestProcessing = true;
        let user = await this.$http.post("ocr/identification", {
          // customer_id: client_id,
          // document_type: 1, // DOCS IN DASHBOARD -> TYPES
          // do_ocr: true,
          document_file: this.imageURL
        });
        console.log(user);
      } catch (error) {
        console.log(error);
        console.log(error.response);
      } finally {
        this.requestProcessing = false;
      }
    },
    turnOnVideo() {
      this.progress = 3;
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.srcObject = stream;
        });
      }
    },
    turnOffVideo() {
      if (this.video != null) {
        this.video.srcObject.getTracks()[0].stop();
        this.video.srcObject = null;
      }
    },
    capture() {
      this.canvas = this.$refs.canvas;
      var context = this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, 640, 480);
      this.captures.push(this.canvas.toDataURL("image/png"));
    }
  }
};
</script>

<style>
* {
  font-family: "Lato", sans-serif;
}
.header {
  text-align: center;
}
#video {
  border-radius: 0.5;
}
</style>