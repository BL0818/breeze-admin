import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** i18n key, e.g. 'nav.dashboard' */
    title?: string
    /** Lucide icon name */
    icon?: string
    /** Allowed roles for access control */
    roles?: string[]
    /** Hide from sidebar menu */
    hidden?: boolean
    /** Whether authentication is required (default: true) */
    requiresAuth?: boolean
    /** Whether to pin this tab in tags view */
    affix?: boolean
    /** Keep component alive in memory */
    keepAlive?: boolean
    /** Explicit active menu path (for nested routes) */
    activeMenu?: string
  }
}
