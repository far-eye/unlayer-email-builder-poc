import React, { useRef } from 'react';
import styled from 'styled-components';

import EmailEditor, { SimpleMergeTag, UnlayerOptions } from 'react-email-editor';
import sampleTemplate from './sample.json';

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

  const onLoad = (): void => {
    // you can load your template here;
    // const templateJson = {};
    console.log('Loading editor');
    setTimeout(() => {
      emailEditorRef.current.editor.loadDesign(sampleTemplate);
      console.log('Editor loaded');
    }, 4000);
  };

  const saveDesign = (): void => {
    // @ts-ignore: Object is possibly 'null'.
    emailEditorRef.current.editor.exportHtml((data: TemplateData) => {
      console.log(data);
    });
  }

  const sendTestMail = (body: string): void => {
    let firstName = 'Piyush';
    let lastName = 'Chauhan';
    let OrderedBy = 'Testing Order';
    body = body.replaceAll("{{firstname}}", firstName);
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
        "subject": "My Subject1",
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
  const mergeTags: Array<SimpleMergeTag> = [
    { name: "lastname", value: "{{lastname}}" },
    { name: "order_no", value: "{{order_number}}" }
  ];
  const mergeTagsSet2: Array<SimpleMergeTag> = [
    { name: "merge_tag1", value: "{{merge_tag1}}" },
    { name: "merge_tag2", value: "{{merge_tag2}}" }
  ];
  const options: UnlayerOptions = {
    mergeTags: mergeTagsSet2, 
    // mergeTagsSet: mergeTagsSet2
  };

  return (
    <div className="App">
      <Container>
        <Bar>
          <h1>React Email Editor (Demo)</h1>
          <button onClick={onLoad}>Load Template</button>
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
