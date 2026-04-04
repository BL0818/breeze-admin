/**
 * API Schema - 单一数据源
 *
 * 所有 Zod Schema 统一定义在此文件。
 * api 模块、mock handlers、vue 组件均从此导入。
 * 禁止在其他文件中重新定义 z.object。
 */
import { z } from 'zod'

// ======================== 枚举 ========================

export const UserRoleSchema = z.enum(['admin', 'manager', 'user'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const OrderStatusSchema = z.enum(['completed', 'pending', 'processing', 'cancelled'])
export type OrderStatus = z.infer<typeof OrderStatusSchema>

export const UserStatusSchema = z.enum(['active', 'inactive', 'pending'])
export type UserStatus = z.infer<typeof UserStatusSchema>

export const QueryRecordStatusSchema = z.enum(['pending', 'approved', 'rejected'])
export type QueryRecordStatus = z.infer<typeof QueryRecordStatusSchema>

export const QueryRecordPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])
export type QueryRecordPriority = z.infer<typeof QueryRecordPrioritySchema>

export const DepartmentSchema = z.enum(['sales', 'engineering', 'marketing', 'hr', 'finance'])
export type Department = z.infer<typeof DepartmentSchema>

// ======================== 实体 ========================

/** 用户基础信息（登录返回 / userinfo） */
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable(),
  role: UserRoleSchema,
})
export type User = z.infer<typeof UserSchema>

/** 用户列表项（用户管理页） */
export const UserListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  createdAt: z.string(),
})
export type UserListItem = z.infer<typeof UserListItemSchema>

/** 订单简要信息（Dashboard 近期订单） */
export const RecentOrderSchema = z.object({
  id: z.string(),
  customer: z.string(),
  amount: z.number(),
  status: OrderStatusSchema,
  date: z.string(),
})
export type RecentOrder = z.infer<typeof RecentOrderSchema>

/** 订单详情（订单列表页） */
export const OrderDetailSchema = z.object({
  id: z.string(),
  customer: z.string(),
  email: z.string(),
  amount: z.number(),
  status: OrderStatusSchema,
  date: z.string(),
  items: z.number(),
})
export type OrderDetail = z.infer<typeof OrderDetailSchema>

/** 查询记录（QueryTable 页） */
export const QueryRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  applicant: z.string(),
  department: DepartmentSchema,
  status: QueryRecordStatusSchema,
  priority: QueryRecordPrioritySchema,
  amount: z.number(),
  createDate: z.string(),
})
export type QueryRecord = z.infer<typeof QueryRecordSchema>

// ======================== 业务数据 ========================

/** KPI 指标卡片数据 */
const MetricItemSchema = z.object({
  value: z.number(),
  change: z.number(),
})

export const MetricsDataSchema = z.object({
  totalRevenue: MetricItemSchema,
  subscriptions: MetricItemSchema,
  activeUsers: MetricItemSchema,
  sales: MetricItemSchema,
})
export type MetricsData = z.infer<typeof MetricsDataSchema>

/** 销售趋势 */
export const SalesTrendItemSchema = z.object({
  month: z.string(),
  sales: z.number(),
})
export type SalesTrendItem = z.infer<typeof SalesTrendItemSchema>

// ======================== 请求体 ========================

export const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
})
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>

// ======================== 登录响应 data（解包后） ========================

export const LoginDataSchema = z.object({
  token: z.string(),
  user: UserSchema,
})
export type LoginData = z.infer<typeof LoginDataSchema>

// ======================== 请求管理 ========================

export const RequestLogSchema = z.object({
  id: z.string(),
  path: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  statusCode: z.number(),
  duration: z.number(),
  ip: z.string(),
  userAgent: z.string(),
  timestamp: z.string(),
  status: z.enum(['success', 'failed', 'timeout']),
})
export type RequestLog = z.infer<typeof RequestLogSchema>

// ======================== 权限切换 ========================

export const PermissionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  category: z.string(),
})
export type PermissionItem = z.infer<typeof PermissionItemSchema>

export const RolePermissionSchema = z.object({
  id: z.string(),
  roleName: z.string(),
  roleCode: z.string(),
  permissions: z.array(PermissionItemSchema),
  userCount: z.number(),
})
export type RolePermission = z.infer<typeof RolePermissionSchema>

// ======================== 超级管理员 ========================

export const SystemInfoSchema = z.object({
  version: z.string(),
  uptime: z.string(),
  totalUsers: z.number(),
  totalRequests: z.number(),
  dbSize: z.string(),
  memoryUsage: z.string(),
  cpuUsage: z.string(),
})
export type SystemInfo = z.infer<typeof SystemInfoSchema>

export const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable(),
  role: z.string(),
  lastLoginAt: z.string(),
  status: z.enum(['active', 'inactive']),
})
export type AdminUser = z.infer<typeof AdminUserSchema>

// ======================== 示例页面 ========================

export const ExampleItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  age: z.number().optional(),
  createdAt: z.string(),
})
export type ExampleItem = z.infer<typeof ExampleItemSchema>
