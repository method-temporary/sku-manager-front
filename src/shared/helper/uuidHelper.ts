export function uuidv4() {
  function s4() {
    return ((1 + Math.random()) * 0x10000 || 0).toString(16).substring(1, 4);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
