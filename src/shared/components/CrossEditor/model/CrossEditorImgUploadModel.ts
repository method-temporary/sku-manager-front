import { srcParser } from '../../Image/Image';

interface CrossEditorImgUploadModel {
  addmsg: ImageUploadResult[];
  result: string;
}

interface ImageUploadResult {
  editorFrame: string;
  imageKind: string;
  imageURL: string;
}

function initImageUploadResult() {
  //
  return {
    editorFrame: '',
    imageKind: 'image',
    imageURL: '',
  };
}

function getImageUploadResult(url: string, editorFrame: string) {
  //
  const imageUploadResult = initImageUploadResult();
  imageUploadResult.editorFrame = `NamoSE_editorframe_${editorFrame}`;
  // imageUploadResult.imageUrl = srcParser(url);
  imageUploadResult.imageURL = `https://image.mysuni.sk.com/suni-asset${url}`;

  return imageUploadResult;
}

export function getCrossEditorImgUploadToJson(urls: string[] | string, editorFrame: string): string {
  //
  const addmsg: ImageUploadResult[] = [];

  if (Array.isArray(urls)) {
    //
    urls.map((url) => {
      addmsg.push(getImageUploadResult(url, editorFrame));
    });
  } else {
    addmsg.push(getImageUploadResult(urls, editorFrame));
  }

  return JSON.stringify({
    addmsg,
    result: 'success',
  });
}
