let QRReader = {};

QRReader.active = false;
QRReader.videoTag = null;
QRReader.canvas = null;
QRReader.ctx = null;
QRReader.decoder = null;

QRReader.scan = function (callback) {

  let isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
  if (!isMediaStreamAPISupported) {
    callback('MediaStreamAPI not supported.', null);
  }

  function selectCamera() {
    return navigator.mediaDevices.enumerateDevices().then(function (devices) {
      let constraints = {
        video: {
          facingMode: 'environment'
        }
      };
      let device = devices.filter(function (device) {
        if (device.kind == 'videoinput' && device.label.indexOf('back') >= 0) {
          return device;
        }
      });
      if (device.length) {
        constraints = {
          video: {
            deviceId: device[device.length - 1].deviceId,
            facingMode: 'environment'
          }
        };
      }
      return constraints;
    })
      .catch(function (error) {
        callback(error, null);
      });
  }

  function startCapture(constraints) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        QRReader.videoTag.srcObject = stream;
      })
      .catch(function (error) {
        callback(error, null);
      });
  }

  function decodeFrame() {
    if (!QRReader.active) return;
    try {
      QRReader.ctx.drawImage(QRReader.videoTag, 0, 0, QRReader.canvas.width, QRReader.canvas.height);
      let imgData = QRReader.ctx.getImageData(0, 0, QRReader.canvas.width, QRReader.canvas.height);
      if (imgData.data) {
        QRReader.decoder.postMessage(imgData);
      }
    } catch (e) {
      if (e.name == 'NS_ERROR_NOT_AVAILABLE') {
        setTimeout(decodeFrame, 0);
      }
    }
  }

  function onDecoderMessage(message) {
    if (message.data.length > 0) {
      QRReader.active = false;
      QRReader.videoTag.srcObject.getTracks().forEach(track => track.stop());
      QRReader.videoTag.srcObject = null;
      callback(null, message.data[0][2]);
    }
    setTimeout(decodeFrame, 0);
  }

  QRReader.decoder = new Worker('/assets/js/zbar-decoder.min.js');
  QRReader.videoTag = document.querySelector('video');
  QRReader.canvas = document.createElement('canvas');
  QRReader.ctx = QRReader.canvas.getContext('2d');
  QRReader.active = true;

  let streaming = false;
  QRReader.videoTag.addEventListener(
    'play',
    function (ev) {
      if (!streaming) {
        QRReader.canvas.width = window.innerWidth;
        QRReader.canvas.height = window.innerHeight;
        streaming = true;
      }
    },
    false
  );

  selectCamera().then((videoinput) => {
    startCapture(videoinput);
  });

  QRReader.decoder.onmessage = onDecoderMessage;
  decodeFrame();
};
