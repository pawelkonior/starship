export function isDisplayTrack(track) {
  const displayRegex = /screen|monitor|display|window/i;

  return track.kind === 'video' && displayRegex.test(track.label);
}

export function jsSnippetToJson(jsSnippet) {
  const noComments = jsSnippet.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, '');
  const noTrailingCommas = noComments.replace(/,(\s*[}\]])/g, '$1');
  const obj = eval('(' + noTrailingCommas + ')');
  const jsonString = JSON.stringify(obj);

  return JSON.parse(jsonString);
}