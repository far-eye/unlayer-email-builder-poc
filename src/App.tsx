import React, { useRef } from 'react';
import styled from 'styled-components';

import EmailEditor, { SimpleMergeTag, UnlayerOptions } from 'react-email-editor';
import sampleTemplate from './sample.json';
import legacyTemplate from './legacyTemplate.json';
const fs = require('fs');
const promisify = require('util').promisify;


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
      }, 4000)})


  }
  const loadLegacy = (): void => {
    // TODO: Test legacy template
    loadLegacyHTML();
    // loadLegacy1();
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
    const subject = "Test Mail1";
    let firstName = 'Piyush';
    let lastName = 'Chauhan';
    let OrderedBy = 'Testing Order';
    body = body.replaceAll("{{Name}}", firstName);
    body = body.replaceAll("{{last_name}}", lastName);
    body = body.replaceAll("{{Ordered By}}", OrderedBy);

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
          "pi.codemonk@gmail.com",
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
    }
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
          <EmailEditor ref={emailEditorRef} onLoad={onLoad} projectId={31147} minHeight={height - 60} options={options} />
        </React.StrictMode>
      </Container>
    </div>
  );
}

export default App;
