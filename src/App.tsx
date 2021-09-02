import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import EmailEditor, { SimpleMergeTag, UnlayerOptions } from 'react-email-editor';
import sampleTemplate from './sample.json';
import legacyTemplate from './legacyTemplate.json';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

const Bar = styled.div`
  flex: 1;
  background-color: #61dafb;
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 40px;
  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }
  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #000;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`;

interface TemplateData { design: any, html: string }

function App() {
  const [count, setCount] = useState(0);
  const emailEditorRef = useRef(null);

  const exportHtml = (): void => {
    emailEditorRef!.current.editor.exportHtml((data: TemplateData) => {
      const { design, html } = data;
      console.log('exportHtml', html);
    });
  };

  const loadLegacy1 = (): void => {
    console.log('loading Legacy template');
    setTimeout(() => {
      emailEditorRef.current.editor.loadDesign(legacyTemplate);
      console.log('Legacy template loaded');
    }, 4000)
  }
  const loadLegacyHTML = (): void => {
    console.log('loading Legacy template');
    fetch('./legacyEmail.html')
      .then(r => r.text())
      .then((html) => {
        // html variable has the text of the html file as a string
        setTimeout(() => {
          emailEditorRef.current.editor.loadDesign({ html: '<div>This is a legacy HTML template.</div>', classic: true });
          console.log('Legacy template loaded');
        }, 4000)
      })


  }
  const loadLegacy = (): void => {
    // TODO: Test legacy template
    // loadLegacyHTML();
    loadLegacy1();
  }

  const onLoad = (): void => {
    console.log('Loading editor');
    setTimeout(() => {
      emailEditorRef.current.editor.loadDesign(sampleTemplate);
      console.log('Editor loaded');
    }, 4000);
  };

  const saveDesign = (): void => {
    emailEditorRef.current.editor.exportHtml((data: TemplateData) => {
      console.log(data);
    });
  }

  const sendTestMail = (body: string): void => {
    const subject = "Test Mail " + count.toString();
    let OrderedBy = 'Testing Order';

    let mergeTagValues: { name: string; value: string }[] = [
      { name: "{{Name}}", value: 'Piyush' },
      { name: "{{myLink}}", value: 'https://www.google.com' },
      { name: "{{last_name}}", value: 'Chauhan' },
      { name: "{{imgMergeTag}}", value: 'https://1000logos.net/wp-content/uploads/2021/04/Facebook-logo.png' },
      { name: "{{imgMergeTag1}}", value: 'https://examples.unlayer.com/static/a54bca2a446e76ad190e0072325807f8/46991/logo.png' },
    ];
    for (let i = 0; i < mergeTagValues.length; i++) {
      if (body.search(mergeTagValues[i].name)) {
        let newBody = body.replaceAll(mergeTagValues[i].name, mergeTagValues[i].value);
        if (newBody === body) { } else {
          body = newBody;
          console.log(mergeTagValues[i].name + ' replaced with ' + mergeTagValues[i].value);
        }
      }
    }

    var myHeaders = new Headers();
    myHeaders.append("client", "TEST");
    myHeaders.append("Content-Type", "application/json");

    var raw: string = JSON.stringify({
      "email": {
        "from_email_id": "piyush.chauhan@getfareye.com",
        "kafkaKey": "string",
        "name": "string",
        "subject": subject,
        "template_id": 0,
        "to_email_ids": [
          "piyush.chauhan@getfareye.com",
          // "awadesh.kumar@getfareye.com",
          // "nandita.srivastava@getfareye.com"
        ]
      },
      "expiry_time": "2022-03-16T04:02:42Z",
      "message": body,
      "priority": "LOW",
      "type": "string"
    });

    var requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:8070/rest/v1/companies/1000/notifications?content_type=static&locale=EN", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const sentHTML_mail = () => {
    setCount(count + 1);
    console.log('Sending HTML mail ')
    emailEditorRef.current.editor.exportHtml((data: TemplateData) => {
      const { design, html } = data;
      sendTestMail(html);
    }, {
      mergeTags: {
        lastname: 'Boy'
      }
    });
  }

  const height = window.innerHeight;

  const optionSet1: UnlayerOptions = {
    mergeTags: [
      { name: "lastname", value: "{{lastname}}" },
      { name: "order_no", value: "{{order_number}}" },
    ],
    designTags: {
      business_name: "Electrolux",
      current_user_name: "Electrolux_User"
    },

  };
  const optionSet2: UnlayerOptions = {
    mergeTags: [
      { name: "merge_tag1", value: "{{merge_tag1}}" },
      { name: "merge_tag2", value: "{{merge_tag2}}" }
    ],
    designTags: {
      business_name: "Metro",
      current_user_name: "Metro_User"
    }
  };
  const options: UnlayerOptions = optionSet2;
  let customJS:string;
  fetch('custom.js').then((response) =>response.text()).then((responseText) => customJS = responseText);

  return (
    <div className="App">
      <Container>
        <Bar>
          <h1>React Email Editor (Demo)</h1>
          <button onClick={loadLegacy}>Load Legacy</button>
          <button onClick={onLoad}>Load Sample Template</button>
          <button onClick={saveDesign}>Save Design</button>
          <button onClick={exportHtml}>Export HTML</button>
          <button onClick={sentHTML_mail}>Send Test Mail</button>
        </Bar>
        <React.StrictMode>
          <EmailEditor
            ref={emailEditorRef}
            onLoad={onLoad}
            projectId={31930}
            minHeight={height - 60}
            options={{
              ...options,
              customJS: [
                // 'https://examples.unlayer.com/examples/custom-tool-data/custom.js',
                `console.log('cusomt js');
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
                        return "<img src='{{imgMergeTag}}' height='100px' width='100px' />"
                      }
                    },
                    head: {
                      css: function (values) { },
                      js: function (values) { console.log('Values in head js', values); }
                    }
                  }
                });
                
                `
              ],
              tools:{
                "custom#my_tool": {
                  data: {
                    name: 'John Doe',
                    age: '27',
                    photo: 'https://picsum.photos/id/1005/200',
                  },
                },
              }
            }} />
        </React.StrictMode>
      </Container>
    </div>
  );
}

export default App;
