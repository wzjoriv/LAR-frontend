export default function makeSearchTargets(buttonInfo) {
  let searchTargets = "";
  for (let i = 0; i < buttonInfo.length; i++) {
    if (buttonInfo[i].selected) {
      searchTargets = searchTargets + buttonInfo[i].id + ",";
    }
  }
  return searchTargets.slice(0, -1);
}
