const downloadImage = (fileName: string, encodedImage: string) => {
  const link = document.createElement('a');
  link.href = `data:image/jpeg;base64,${encodedImage}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadImage;
