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
                :disabled="ocr != null"
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
                      @change="onFileChange($event)"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Imagen de documento"
                      label="Aquí va tu foto de INE"
                      prepend-icon="mdi-camera"
                    ></v-file-input>
                    <!-- TODO: Thiss button relies on a good server response -->
                    <v-btn :disabled="false" color="success" @click="uploadImage">Upload</v-btn>
                  </v-layout>
                  <template v-if="ocr != null">
                    <v-subheader>Los datos recibidos son:</v-subheader>
                    <v-layout justify-center class="d-flex flex-column">
                      <code outlined>{{ ocr }}</code>
                    </v-layout>
                  </template>
                  <template v-if="error">
                    <v-alert
                      type="error"
                    >No se pudo procesar tu información. Intenta con otra imagen.</v-alert>
                  </template>
                </v-card-text>
                <v-card-actions>
                  <v-progress-linear :active="requestProcessing" indeterminate color="blue"></v-progress-linear>
                </v-card-actions>
              </v-card>

              <v-btn color="primary" v-if="ocr != null" @click="progress = 3;">Siguiente</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12" outlined color="white" min-height="400">
                <v-card-title>Prueba de vida</v-card-title>
                <v-card-text>
                  A continuación se le indicará que realice ciertas posiciones con tu cabeza.
                  <br />
                  <br />
                  <v-progress-linear :active="!livenessReady" indeterminate color="blue"></v-progress-linear>
                  <v-btn
                    v-if="livenessReady"
                    color="primary"
                    @click="turnOnVideo(); livenessOn = true; send_frame()"
                  >
                    <v-icon left>sentiment_satisfied_alt</v-icon>Iniciar prueba
                  </v-btn>
                  <br />
                  <br />
                  <v-layout justify-center>
                    <video
                      ref="video"
                      id="video"
                      :width="video_W"
                      :height="video_H"
                      autoplay
                      alt="Tu videocámara"
                    ></video>
                    <v-overlay :absolute="true" :value="enough_movements >= 10">
                      <h1>¡Listo!</h1>
                    </v-overlay>
                    <v-overlay :absolute="true" :value="socket_disconnect">
                      <h2>Espera un momento estoy restableciendo la conexión.</h2>
                    </v-overlay>
                  </v-layout>
                  <template v-if="enough_movements > 0">
                    <v-alert dense type="info">
                      Tu movimiento actual es:
                      <strong>{{current_movement}}</strong>
                      . Necesitas otros {{ 10 - enough_movements }}.
                    </v-alert>
                  </template>
                  <canvas ref="canvas" id="canvas" width="640" height="480" style="display:none;"></canvas>
                  <!-- <ul>
                    <li v-for="(c,i) in captures" :key="i">
                      <img :src="c" height="50" />
                    </li>
                  </ul>-->
                </v-card-text>
              </v-card>
              <v-btn
                v-if="enough_movements >= 10"
                color="primary"
                @click="progress = 4; $socket.disconnect(true); turnOffVideo()"
              >Siguiente</v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="mb-12" outlined color="white" min-height="300">
                <v-card-title>Gracias por tu tiempo</v-card-title>
                <v-card-text>Da click en finalizar para concluir la prueba.</v-card-text>
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
var localstream;
export default {
  data() {
    return {
      ine: null,
      imageURL: "",
      formData: null,
      ocr: null,
      video: null,
      canvas: {},
      captures: [],
      progress: 3, // Stepper starting point
      requestProcessing: false,
      video_H: 400,
      video_W: 400,
      error: false, // Response for server (OCR)
      livenessReady: false,
      livenessOn: false,
      currentPhoto: null, // Frame
      enough_movements: 0, // For this demo the amount of mov is 10
      current_movement: null,
      socket_disconnect: false // Flag to get when the socket is out
    };
  },
  beforeCreate() {
    // TODO: Register an user and get the id
  },
  mouted() {
    this.turnOnVideo();
  },
  created() {
    console.log("Everything set up. By Dante Bazaldua");
  },
  sockets: {
    connect() {
      this.socket_disconnect = false;
      console.log("Socket connected");
      if (this.livenessOn) {
        this.send_frame();
      }
    },
    please_authorize() {
      let key = this.$http.defaults.headers.common["authorization"];
      this.$socket.emit("try_authorization", {
        token: "1"
      });
    },
    authorization_denied(error) {
      console.log(error);
    },
    authorization_granted() {
      console.log("Conexión exitosa.");
      this.livenessReady = true;
    },
    video_frame_recived() {
      console.log("Frame recieved");
      this.send_frame();
    },
    frame_response(msg) {
      console.log(msg);

      if (msg.length > 0) {
        this.current_movement = msg[0];
        this.enough_movements += 1;
      }
    },
    disconnect(err) {
      console.log(err);
      this.socket_disconnect = true;
    }
  },
  methods: {
    onFileChange(e) {
      let reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result.replace(
          /^data:image\/(png|jpg|jpeg);base64,/,
          ""
        );
      };
      reader.readAsDataURL(this.ine);
    },
    /**
     * OCR Identification for INE
     * Uses multipart data
     */
    async uploadImage() {
      let formdata = new FormData();
      formdata.append("document_file", this.ine);
      try {
        this.requestProcessing = true;
        let user = await this.$http.post("ocr/identification", formdata, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (user.data.result == false) {
          this.error = true;
        } else {
          this.ocr = user.data.payload;
          this.error = false;
        }
      } catch (error) {
        console.log(error);
        console.log(error.response);
        this.error = true;
      } finally {
        this.requestProcessing = false;
      }
    },
    // Liveness
    /**
     * Start socket and start recording
     */
    turnOnVideo() {
      this.progress = 3;
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          localstream = stream;
          this.video.srcObject = stream;
        });
      }
    },
    turnOffVideo() {
      localstream.getTracks()[0].stop();
      this.video.srcObject = null
    },
    /**
     * Create image from video in canvas
     */
    capture() {
      this.canvas = this.$refs.canvas;
      var context = this.canvas
        .getContext("2d")
        .drawImage(this.video, 0, 0, 640, 480);
      let currentPhoto = this.canvas.toDataURL("image/jpeg");
      // this.captures.push(currentPhoto); // Not necessary
      this.currentPhoto = currentPhoto;
    },
    /**
     * Suggested function to consume the API
     */
    send_frame() {
      this.capture();
      this.$socket.emit("video_frame", {
        data: this.currentPhoto
      });
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
code {
  background: #000 !important;
  color: #fff !important;
}
</style>