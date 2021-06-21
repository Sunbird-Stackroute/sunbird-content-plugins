/**
 * Plugin to create repo instance and to register repo instance
 * @extends EkstepRenderer.Plugin
 * @author jagadish.pujari@niit.com>
 */
org.ekstep.zoomRenderer = Plugin.extend({ // eslint-disable-line no-undef
  _type: 'org.ekstep.zoom.video',
  initPlugin: function (data) {
    var instance = this;
    var zoomElement = `
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
      <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.9.1/css/bootstrap.css" />
      <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.9.1/css/react-select.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
      <script src="https://source.zoom.us/1.8.6/lib/vendor/react.min.js"></script>
      <script src="https://source.zoom.us/1.8.6/lib/vendor/react-dom.min.js"></script>
      <script src="https://source.zoom.us/1.8.6/lib/vendor/redux.min.js"></script>
      <script src="https://source.zoom.us/1.8.6/lib/vendor/redux-thunk.min.js"></script>
      <script src="https://source.zoom.us/1.8.6/lib/vendor/lodash.min.js"></script>
      <script src="https://source.zoom.us/zoom-meeting-1.8.6.min.js"></script>
      <script>
    $(document).ready(function () {
      var userName = $('#userName').val();
        $('#userName').on('input change', function () {
            if ($(this).val() != '') {
                $('#joinMeetingNow').prop('disabled', false);
            }
            else {
                $('#joinMeetingNow').prop('disabled', true);
            }
        });
    });

</script>
<script type="text/javascript">
    $(function () {
        $("#userName").keypress(function (e) {
            var keyCode = e.keyCode || e.which;
            $("#lblError").html("");
            //Regex for Valid Characters i.e. Alphabets.
            var regex = /^[A-Za-z]+$/;

            //Validate TextBox value against the Regex.
            var isValid = regex.test(String.fromCharCode(keyCode));

            if (!isValid) {
                $("#lblError").html("Please provie a valid username");
            }
            return isValid;
        });
    });
</script>
      <div class="container">
      <label>User name</label>
      <div class="username_field">
      <input type="text" name="username" id="userName" class="username" placeholder="Username">
      <i class="fa fa-user" aria-hidden="true"></i>
      </div>
      <div id="lblError" style="color: red"></div>
      <div class="joinMtg">
      <button class="ui blue button btn" disabled="disabled" id="joinMeetingNow">Join Meeting</button>
      </div>
    </div>
      <span id="EarlyJoiningTemplate" style="display: none; color: red; text-align: center; margin-top: -60px; font-weight: bold;"></span>
  `
      ;
    $('#gameArea').html(zoomElement);

    document.getElementById('joinMeetingNow').addEventListener('click', function () {
      instance.joinMeeting(data);
    });
  },


  joinMeeting: function (data) {
    var APIKey = 'oDjG_y9-RC66AC1tyQjs4Q';
    var APISecret = 'jKDQRJXYo5oaTiEyE1iw8MKF27ynvnlAQNYP';

    document.getElementById('joinMeetingNow').disabled = true;
    var userName = document.getElementById('userName').value
    document.getElementById('joinMeetingNow').disabled = false;
    let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm'),
      startDate = moment(data.zoomStartDate).format('YYYY-MM-DD HH:mm');
    endDate = moment(data.zoomEndDate).format('YYYY-MM-DD HH:mm');
    if (moment(currentDate).isBefore(startDate)) {
      document.getElementById('EarlyJoiningTemplate').textContent = `Meeting starts at ${startDate}, try again later.`;
      document.getElementById('EarlyJoiningTemplate').style.display = 'block';
    } else if (moment(currentDate).isAfter(endDate)) {
      document.getElementById('EarlyJoiningTemplate').textContent = `Meeting has Ended. Thank You.`;
      document.getElementById('EarlyJoiningTemplate').style.display = 'block';
    } else {
      if (data != null) {
        var meetingConfig = {
          apiKey: APIKey,
          meetingNumber: data.result.id,
          userName: userName,
          passWord: data.result.encrypted_password,
          leaveUrl: 'https://sunbird.stackroutelabs.com/workspace/content/create',
          role: '1',
          userEmail: data.result.host_email,
        }
        document.getElementById('zmmtg-root').style.display = 'block'
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
        var signature = ZoomMtg.generateSignature({
          meetingNumber: data.result.id,
          apiKey: APIKey,
          apiSecret: APISecret,
          role: '1',
          success: function (res) {
            meetingConfig.signature = res.result;
            meetingConfig.apiKey = APIKey;
          },
        });
        this.beginJoin(signature, data);
      }
    }
  },

  beginJoin: function (signature, meetingDetails) {
    var APIKey = 'oDjG_y9-RC66AC1tyQjs4Q';
    var userName = document.getElementById('userName').value
    ZoomMtg.init({
      leaveUrl: 'https://sunbird.stackroutelabs.com/workspace/content/create',
      success: function () {
        ZoomMtg.i18n.load('en-US');
        ZoomMtg.i18n.reload('en-US');
        ZoomMtg.join({
          meetingNumber: meetingDetails.result.id,
          userName: userName,
          signature: signature,
          apiKey: APIKey,
          userEmail: meetingDetails.result.host_email,
          passWord: meetingDetails.result.encrypted_password,
          success: function (res) {
            ZoomMtg.getAttendeeslist({});
            ZoomMtg.getCurrentUser({
              success: function (res) {
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
      // window.close();
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
