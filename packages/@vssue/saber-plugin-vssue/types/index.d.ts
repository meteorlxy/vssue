interface SaberPlugin {
  name: string
  apply: (api: any, options: any) => void
}

declare const SaberPluginVssue: SaberPlugin

export default SaberPluginVssue
