import Constants from "expo-constants";
const { manifest } = Constants;

export default function getLocalHost() {
  const uri = `http://${manifest.debuggerHost.split(":").shift()}`;
  return uri;
}
