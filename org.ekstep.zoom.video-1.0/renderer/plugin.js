/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author jagadish.pujari@niit.com>
 */
org.ekstep.zoomRenderer = Plugin.extend({ // eslint-disable-line no-undef
  _type: 'org.ekstep.zoom.video',
  initPlugin: function (data) {
    var instance = this;
    var zoomElement = '<link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.9.1/css/bootstrap.css" /><link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.9.1/css/react-select.css" /><script src="https://source.zoom.us/1.8.6/lib/vendor/react.min.js"></script><script src="https://source.zoom.us/1.8.6/lib/vendor/react-dom.min.js"></script><script src="https://source.zoom.us/1.8.6/lib/vendor/redux.min.js"></script><script src="https://source.zoom.us/1.8.6/lib/vendor/redux-thunk.min.js"></script> <script src="https://source.zoom.us/1.8.6/lib/vendor/lodash.min.js"></script>  <script src="https://source.zoom.us/zoom-meeting-1.8.6.min.js"></script><div class="container"><button class="ui blue button btn" ng-click="joinMeeting()">Join Meeting</button></div>';
    $('#gameArea').html(zoomElement);
    setTimeout(function () {
      instance.joinMeeting(data);
    },4000);
  },
  joinMeeting: function (data) {
    if (data != null) {
      var meetingConfig = {
        apiKey: '9ccJuAHyStWc_21278HiDg',
        meetingNumber: data.id,
        userName: 'rupa',
        passWord: data.password,
        leaveUrl: 'http://localhost:3000/app/?contentId=do_112673164776996864179',
        role: '1',
        userEmail: data.host_email,
      }
      document.getElementById('zmmtg-root').style.display = 'block'
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareJssdk();
      var signature = ZoomMtg.generateSignature({
        meetingNumber: data.id,
        apiKey: '9ccJuAHyStWc_21278HiDg',
        apiSecret: 'LBzJ0VPqk9pmmfUFdhQgrOYlv63GlCqarVp2',
        role: '1',
        success: function (res) {
          meetingConfig.signature = res.result;
          meetingConfig.apiKey = '9ccJuAHyStWc_21278HiDg';
        },
      });

      this.beginJoin(signature, data);
    }
  },

  beginJoin: function (signature, meetingDetails) {
    ZoomMtg.init({
      leaveUrl: 'http://localhost:3000/app/?contentId=do_112673164776996864179',
      success: function () {
        ZoomMtg.i18n.load('en-US');
        ZoomMtg.i18n.reload('en-US');
        ZoomMtg.join({
          meetingNumber:meetingDetails.id ,
          userName: 'rupa',
          signature: signature,
          apiKey: '9ccJuAHyStWc_21278HiDg',
          userEmail: meetingDetails.host_email,
          passWord: meetingDetails.password,
          success: function (res) {
            ZoomMtg.getAttendeeslist({});
            ZoomMtg.getCurrentUser({
              success: function (res) {
                console.log("success getCurrentUser", res.result.currentUser);
              },
            });
          },
          error: function (res) {
            console.log(res);
          },
        });
      },
      error: function (res) {
        console.log(res);
      },
    });
    ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
      console.log('inMeetingServiceListener onUserJoin', data);
    });
    ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
      console.log('inMeetingServiceListener onUserLeave', data);
    });
    ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', function (data) {
      console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
    });
    ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (data) {
      console.log('inMeetingServiceListener onMeetingStatus', data);
    });
  },
});
//# sourceURL=zoomRenderer.js