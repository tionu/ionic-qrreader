let QRReader = {};

QRReader.active = false;
QRReader.animation = null;
QRReader.videoTag = null;
QRReader.canvas = null;
QRReader.ctx = null;
QRReader.decoder = null;

QRReader.scan = function (callback) {

  let isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
  if (!isMediaStreamAPISupported) {
    stopScan()
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
        stopScan()
        callback(error, null);
      });
  }

  function startCapture(constraints) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        QRReader.videoTag.srcObject = stream;
        QRReader.videoTag.setAttribute('playsinline', true);
        QRReader.videoTag.setAttribute('controls', true);
        setTimeout(() => {
          document.querySelector('video').removeAttribute('controls');
        });
        decodeFrame();
        setTimeout(function () {
          QRReader.animation.style.display = 'block';
        }, 500)
      })
      .catch(function (error) {
        stopScan()
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
      stopScan();
      callback(null, message.data[0][2]);
    }
    setTimeout(decodeFrame, 0);
  }

  function stopScan() {
    QRReader.active = false;
    if (QRReader.videoTag && QRReader.videoTag.srcObject) {
      QRReader.videoTag.srcObject.getTracks().forEach(track => track.stop());
      QRReader.videoTag.srcObject = null;
    }
    QRReader.animation.style.display = 'none';
  }

  QRReader.decoder = new Worker('./assets/js/zbar-decoder.min.js');
  QRReader.animation = document.getElementById('scan-animation');
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

  QRReader.decoder.onmessage = onDecoderMessage;

  selectCamera().then((videoinput) => {
    startCapture(videoinput);
  });

};
