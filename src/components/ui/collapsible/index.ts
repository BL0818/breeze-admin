import type { HTMLAttributes } from 'vue'

export { default as Collapsible } from './Collapsible.vue'
export { default as CollapsibleTrigger } from './CollapsibleTrigger.vue'
export { default as CollapsibleContent } from './CollapsibleContent.vue'

export type { CollapsibleRootEmits as CollapsibleEmits, CollapsibleRootProps as CollapsibleProps } from 'reka-ui'

export interface CollapsibleContentProps extends HTMLAttributes {
  as?: string
  forceMount?: boolean
}

export interface CollapsibleTriggerProps extends HTMLAttributes {
  as?: string
}
