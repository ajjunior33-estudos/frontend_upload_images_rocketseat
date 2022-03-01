import { useCallback, useEffect, useState } from "react";
import { uniqueId } from "lodash";
import fileSize from "filesize";

import GlobalSytles from "./styles/global";
import { Container, Content } from "./styles/styles";

import api from "./services/api";

import UploadComponent from "./components/Upload";
import FileListComponent from "./components/FlieList";
function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  useEffect(() => {
    uploadedFiles.forEach(processUpload);
  }, [uploadedFiles]);

  const handleUpload = (files) => {
    const objectUploadedFiles = files.map((file) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: fileSize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    setUploadedFiles([...uploadedFiles, objectUploadedFiles]);
  };
  const updateFile = useCallback((id, data) => {
    setUploadedFiles((state) => {
      state.map((file) => (file.id === id ? { ...file, ...data } : file));
    });
  });

  const processUpload = useCallback(
    (uploadedFile) => {
      const formdata = new FormData();
      formdata.append("file", uploadedFile[0].file, uploadedFile[0].name);
      api
        .post("/upload", formdata, {
          onUploadProgress: (progressEvent) => {
            let progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            console.log(
              `A imagem ${uploadedFile[0].name} está ${progress}% carregada... `
            );

            updateFile(uploadedFile.id, { progress });
          },
          headers: { "content-type": "multipart/form-data" },
        })
        .then((response) => {
          console.log(
            `A imagem ${uploadedFile[0].name} já foi enviada para o servidor!`
          );

          updateFile(uploadedFile.id, {
            uploaded: true,
            id: response.data._id,
            url: response.data.url,
          });
        })
        .catch((err) => {
          console.error(
            `Houve um problema ao fazer upload da imagem ${uploadedFile[0].name} no servidor AWS`
          );
          console.log(err);

          updateFile(uploadedFile.id, {
            error: true,
          });
        });
    },
    [updateFile]
  );

  return (
    <>
      <Container>
        <Content>
          <UploadComponent onUpload={handleUpload} />
          {!!uploadedFiles.length && (
            <FileListComponent files={uploadedFiles} />
          )}
        </Content>
      </Container>
      <GlobalSytles />
    </>
  );
}

export default App;
