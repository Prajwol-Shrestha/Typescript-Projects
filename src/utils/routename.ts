
export default function routename( projectName : string) :string {
  return projectName.toLowerCase().replace(/\s/g, "");
}
