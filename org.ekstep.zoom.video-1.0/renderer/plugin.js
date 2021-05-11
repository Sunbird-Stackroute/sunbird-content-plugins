/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author jagadish.pujari@niit.com>
 */
org.ekstep.zoomRenderer = Plugin.extend({ // eslint-disable-line no-undef
  _type: 'org.ekstep.zoom.video',
  initPlugin: function (data) {
    var instance = this;
    console.log('zoom Meeting details', data);
    var zoomElement = '<div class="container"><button class="ui blue button btn" ng-click="joinMeeting()">Join Meeting</button></div>';
    $('#gameArea').html(zoomElement);
    setTimeout(function () {
      instance.joinMeeting(data);
    }, 3000);
  },
  joinMeeting: function (data) {
    console.log('zoom Meeting details for join', data);
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
      console.log(meetingConfig);

      document.getElementById('zmmtg-root').style.display = 'block'
      console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareJssdk();
      var signature = ZoomMtg.generateSignature({
        meetingNumber: data.id,
        apiKey: '9ccJuAHyStWc_21278HiDg',
        apiSecret: 'LBzJ0VPqk9pmmfUFdhQgrOYlv63GlCqarVp2',
        role: '1',
        success: function (res) {
          console.log(res.result);
          meetingConfig.signature = res.result;
          meetingConfig.apiKey = '9ccJuAHyStWc_21278HiDg';
        },
      });

      this.beginJoin(signature, data);
      console.log("signature", signature)
    }
  },

  beginJoin: function (signature, meetingDetails) {
    ZoomMtg.init({
      leaveUrl: 'http://localhost:3000/app/?contentId=do_112673164776996864179',
      success: function () {
        console.log("signature", signature);
        ZoomMtg.i18n.load('en-US');
        ZoomMtg.i18n.reload('en-US');
        ZoomMtg.join({
          meetingNumber: meetingDetails.id,
          userName: 'rupa',
          signature: signature,
          apiKey: '9ccJuAHyStWc_21278HiDg',
          userEmail: meetingDetails.host_email,
          passWord: meetingDetails.password,
          success: function (res) {
            console.log("meeting success result", res)
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