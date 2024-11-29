import axios from 'axios';

export const uploadImage = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // 'img' deve ser o nome esperado no backend para o arquivo

    const response = await axios.post('http://localhost:4000/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Retorna a string (ou outra resposta) enviada pelo backend
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};
