import md5 from "md5"

const MD5 = (str) => {
  return md5(str)
}

function base64ToUtf8(base64String) {
  // 使用atob将Base64字符串解码为二进制数据
  const binaryString = atob(base64String);
  // 将二进制数据转换为Uint8Array
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  // 使用TextDecoder将Uint8Array解码为UTF-8字符串
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(bytes);
}

export { MD5, base64ToUtf8 }
