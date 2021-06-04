/**
 * Plugin to add questions in question stage.
 * @class org.ekstep.zoom.video
 * @extends org.ekstep.contenteditor.basePlugin
 * @author Jagdish P <jagdish.pujari@niit.com>
 */
org.ekstep.zoomvideo = {};
org.ekstep.zoomvideo.EditorPlugin = org.ekstep.contenteditor.basePlugin.extend({
  type: "org.ekstep.zoom.video",
  newMeetingDetails: {},
  initialize: function () {
    ecEditor.addEventListener("org.ekstep.zoom.video:showPopup", this.loadHtml, this);
    ecEditor.addEventListener("org.ekstep.zoom.video:addMeeting", this.addMeeting, instance);
    var templatePath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'editor/zoommeeting.html');
    var controllerPath = ecEditor.resolvePluginResource(this.manifest.id, this.manifest.ver, 'editor/zoommeetingCtrl.js');
    ecEditor.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);
  },
  /**
   * Open window to add question and options
   * @memberOf org.ekstep.questionbank
   * @param {string} event Type of event
   * @param {Object} dataObj Object passed when dispatched
   */

  loadHtml: function (event, dataObj) {
    var instance = this;
    ecEditor.getService(ServiceConstants.POPUP_SERVICE).open({
      template: 'ZoomMeetingTemplate',
      controller: 'ZoomMeetingController',
      controllerAs: '$ctrl',
      resolve: {
        'pluginInstance': function () {
          return instance;
        }
      },
      closeByEscape: false,
      closeByDocument: false
    });
  },

  newInstance: function () {
    var instance = this;
    var _parent = this.parent;
    this.parent = undefined;
    /*istanbul ignore else*/
    if (!this.attributes.x) {
      this.attributes.x = 10;
      this.attributes.y = 3;
      this.attributes.w = 78;
      this.attributes.h = 94;
      this.percentToPixel(this.attributes);
    }
    var props = this.convertToFabric(this.attributes);
    delete props.width;
    delete props.height;
    //add media to stage
    // Add stage object
    var stageImage = ecEditor.resolvePluginResource('org.ekstep.zoom.video', '1.0', 'editor/assets/zoom_1400x788.png');
    instance.addMedia({
      id: "Zoom-Icon",
      src: stageImage,
      assetId: "Zoom-Icon",
      type: "image",
      preload: true
    });
    fabric.Image.fromURL(stageImage, function (img) {
      if (instance.editorData) {
        console.log("zoom new-meeting details", instance)
        var editorData = instance.editorData
        console.log("zoom attributes", editorData)
        var meetingDetails = instance.getPropsForEditor(editorData.zoomtopic, editorData.id, editorData.zoomStartDate, editorData.zoomEndDate);
        instance.editorObj = new fabric.Group([img, meetingDetails]);
        instance.parent = _parent;
        instance.editorObj.scaleToWidth(props.w);
        instance.postInit();
      }
    }, props);

  },
  getPropsForEditor: function (title, id, startdate, enddate) {
    /* Display the all properties(title,date,time) on the editor*/
    title = new fabric.Text("Topic:" + title, {
      fontSize: 30,
      fill: 'black',
      textAlign: 'center',
      top: 33,
      left: 75
    });
    id = new fabric.Text("Meeting ID:" + id, {
      fontSize: 28,
      fill: 'black',
      top: 70,
      left: 90,
    });
    startdate = new fabric.Text("StartDate: " + startdate.toLocaleString(), {
      fontSize: 28,
      fill: 'black',
      top: 100,
      left: 90
    });
    enddate = new fabric.Text("EndDate:" + enddate.toLocaleString(), {
      fontSize: 28,
      fill: 'black',
      top: 130,
      left: 90,
    },
    );

    var fabricGroup = new fabric.Group([title, id, startdate, enddate]);
    return fabricGroup;
  },
  addMeeting: function (event, data) {
    var instance = this;
    instance.newMeetingDetails = data;
    ecEditor.dispatchEvent('org.ekstep.zoom.video:create', data);
    return data;
  },
  toECML: function () {
    var instance = this;
    var zoomECML = this._super();
    zoomECML.type = 'pligin';
    zoomECML.pluginId = instance.manifest.id;
    zoomECML.pluginVer = '1.0';
    zoomECML.data = instance.newMeetingDetails;
    return zoomECML;
  }
});
 //# sourceURL=zoomCallEditor.js