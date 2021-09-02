console.log('cusomt js');
unlayer.registerTool({
  name: 'my_tool',
  label: 'Logo Image',
  icon: 'fa-smile',
  supportedDisplayModes: ['web', 'email'],
  options: {},
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        console.log('Values in viewer', values);
        return "<img src='https://cdn.tools.unlayer.com/image/placeholder.png'>"
      }
    }),
    exporters: {
      web: function (values) {
        console.log('Values in web exporter', values);
        return "<img src='https://cdn.tools.unlayer.com/image/placeholder.png'>"
      },
      email: function (values) {
        console.log('Values in email exporter', values);
        return "<img src='{{imgMergeTag}}'>"
      }
    },
    head: {
      css: function (values) { },
      js: function (values) { console.log('Values in head js', values); }
    }
  }
});
