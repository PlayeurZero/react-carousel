export default function getFirstDefinedVar(...vars: any[]) {
  for (const varIndex in vars) {
    if (null != vars[varIndex]) {
      return vars[varIndex]
    }
  }
}
