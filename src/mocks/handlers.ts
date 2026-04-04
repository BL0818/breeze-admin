/**
 * MSW Mock Handlers
 *
 * - 所有 Zod Schema 从 @/types/api-schema 统一导入，禁止在本文件中重新定义 z.object
 * - 每个 handler 必须调用 delay() 模拟真实网络
 * - 补全 POST /api/auth/forgot-password handler
 */
import { http, HttpResponse, delay } from 'msw'
import {
  LoginRequestSchema,
  ForgotPasswordRequestSchema,
  type User,
  type OrderDetail,
  type UserListItem,
  type QueryRecord,
  type MetricsData,
  type SalesTrendItem,
  type RecentOrder,
  type RolePermission,
  type ExampleItem,
} from '@/types/api-schema'

// ======================== Mock Data ========================

const mockUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  avatar: null,
  role: 'admin',
}

const mockLoginResponse = {
  code: 200,
  message: 'Login successful',
  data: {
    token: 'mock-jwt-token-' + Date.now(),
    user: mockUser,
  },
}

const mockMetricsData: { code: number; data: MetricsData } = {
  code: 200,
  data: {
    totalRevenue: { value: 124560, change: 12.5 },
    subscriptions: { value: 3240, change: 8.2 },
    activeUsers: { value: 18500, change: -2.4 },
    sales: { value: 89600, change: 15.3 },
  },
}

const mockSalesTrend: { code: number; data: SalesTrendItem[] } = {
  code: 200,
  data: [
    { month: 'Jan', sales: 8200 },
    { month: 'Feb', sales: 9320 },
    { month: 'Mar', sales: 9010 },
    { month: 'Apr', sales: 12340 },
    { month: 'May', sales: 11200 },
    { month: 'Jun', sales: 15600 },
  ],
}

const mockRecentOrders: { code: number; data: RecentOrder[] } = {
  code: 200,
  data: [
    { id: 'ORD-001', customer: 'Zhang San', amount: 1299, status: 'completed', date: '2026-03-28' },
    { id: 'ORD-002', customer: 'Li Si', amount: 899, status: 'pending', date: '2026-03-29' },
    { id: 'ORD-003', customer: 'Wang Wu', amount: 2599, status: 'processing', date: '2026-03-30' },
    { id: 'ORD-004', customer: 'Zhao Liu', amount: 1599, status: 'completed', date: '2026-03-31' },
    { id: 'ORD-005', customer: 'Chen Qi', amount: 3299, status: 'completed', date: '2026-04-01' },
  ],
}

const mockOrdersList: { code: number; data: OrderDetail[] } = {
  code: 200,
  data: [
    { id: 'ORD-001', customer: 'Zhang San', email: 'zhangsan@example.com', amount: 1299, status: 'completed', date: '2026-03-28', items: 3 },
    { id: 'ORD-002', customer: 'Li Si', email: 'lisi@example.com', amount: 899, status: 'pending', date: '2026-03-29', items: 1 },
    { id: 'ORD-003', customer: 'Wang Wu', email: 'wangwu@example.com', amount: 2599, status: 'processing', date: '2026-03-30', items: 5 },
    { id: 'ORD-004', customer: 'Zhao Liu', email: 'zhaoliu@example.com', amount: 1599, status: 'completed', date: '2026-03-31', items: 2 },
    { id: 'ORD-005', customer: 'Chen Qi', email: 'chenqi@example.com', amount: 3299, status: 'completed', date: '2026-04-01', items: 4 },
    { id: 'ORD-006', customer: 'Liu Bai', email: 'liubai@example.com', amount: 699, status: 'cancelled', date: '2026-04-01', items: 1 },
    { id: 'ORD-007', customer: 'Sun Jian', email: 'sunjian@example.com', amount: 4599, status: 'processing', date: '2026-04-02', items: 6 },
    { id: 'ORD-008', customer: 'Yang Fei', email: 'yangfei@example.com', amount: 1299, status: 'completed', date: '2026-04-02', items: 2 },
    { id: 'ORD-009', customer: 'Zhou Wei', email: 'zhouwei@example.com', amount: 899, status: 'pending', date: '2026-04-03', items: 1 },
    { id: 'ORD-010', customer: 'Wu Ling', email: 'wuling@example.com', amount: 2199, status: 'completed', date: '2026-04-03', items: 3 },
  ],
}

const mockUsersList: { code: number; data: UserListItem[] } = {
  code: 200,
  data: [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2026-01-15' },
    { id: '2', name: 'Zhang San', email: 'zhangsan@example.com', role: 'manager', status: 'active', createdAt: '2026-02-01' },
    { id: '3', name: 'Li Si', email: 'lisi@example.com', role: 'user', status: 'active', createdAt: '2026-02-10' },
    { id: '4', name: 'Wang Wu', email: 'wangwu@example.com', role: 'user', status: 'inactive', createdAt: '2026-02-20' },
    { id: '5', name: 'Zhao Liu', email: 'zhaoliu@example.com', role: 'manager', status: 'active', createdAt: '2026-03-01' },
    { id: '6', name: 'Chen Qi', email: 'chenqi@example.com', role: 'user', status: 'active', createdAt: '2026-03-05' },
    { id: '7', name: 'Liu Bai', email: 'liubai@example.com', role: 'user', status: 'pending', createdAt: '2026-03-10' },
    { id: '8', name: 'Sun Jian', email: 'sunjian@example.com', role: 'admin', status: 'active', createdAt: '2026-03-15' },
  ],
}

// ======================== Query Records (50 条动态生成) ========================

const departments = ['sales', 'engineering', 'marketing', 'hr', 'finance'] as const
const statuses = ['pending', 'approved', 'rejected'] as const
const priorities = ['low', 'medium', 'high', 'urgent'] as const
const titles = [
  'Budget Approval Q2', 'New Equipment Request', 'Travel Authorization', 'Marketing Campaign Budget',
  'Software License Renewal', 'Office Renovation', 'Training Program', 'Conference Attendance',
  'Consulting Services', 'Hardware Upgrade', 'Cloud Migration', 'Security Audit',
  'Team Building Event', 'Recruitment Budget', 'Employee Benefits', 'Project Kickoff',
  'Client Meeting Expenses', 'Research Funding', 'Patent Filing', 'Vendor Contract',
]
const applicants = [
  'John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
  'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'William Garcia', 'Patricia Rodriguez',
  'James Lee', 'Linda Walker', 'Thomas Hall', 'Barbara Allen', 'Charles Young',
  'Susan King', 'Daniel Wright', 'Jessica Lopez', 'Matthew Hill', 'Ashley Scott',
]

function generateQueryRecords(): QueryRecord[] {
  const records: QueryRecord[] = []
  for (let i = 1; i <= 50; i++) {
    const date = new Date('2026-01-01')
    date.setDate(date.getDate() + Math.floor(Math.random() * 90))
    records.push({
      id: `REQ-${String(i).padStart(3, '0')}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      applicant: applicants[Math.floor(Math.random() * applicants.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      amount: Math.floor(Math.random() * 50000) + 1000,
      createDate: date.toISOString().split('T')[0],
    })
  }
  return records.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
}

const mockQueryRecords = { code: 200, data: generateQueryRecords() }

// ======================== Handlers ========================

export const handlers = [
  // ---- Auth: 登录 ----
  http.post('/api/auth/login', async ({ request }) => {
    await delay(Math.random() * 500 + 300)
    const body = await request.json() as Record<string, unknown>
    const parseResult = LoginRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return HttpResponse.json(
        { code: 400, message: 'Invalid request body', data: null },
        { status: 400 },
      )
    }
    if (body.username === 'admin' && body.password === 'admin123') {
      return HttpResponse.json(mockLoginResponse)
    }
    return HttpResponse.json(
      { code: 401, message: 'Invalid credentials', data: null },
      { status: 401 },
    )
  }),

  // ---- Auth: 获取用户信息 ----
  http.get('/api/auth/userinfo', async ({ request }) => {
    await delay(Math.random() * 300 + 200)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { code: 401, message: 'Unauthorized', data: null },
        { status: 401 },
      )
    }
    return HttpResponse.json({ code: 200, message: 'success', data: mockUser })
  }),

  // ---- Auth: 忘记密码 ----
  http.post('/api/auth/forgot-password', async ({ request }) => {
    await delay(Math.random() * 500 + 300)
    const body = await request.json() as Record<string, unknown>
    const parseResult = ForgotPasswordRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return HttpResponse.json(
        { code: 400, message: 'Invalid email address', data: null },
        { status: 400 },
      )
    }
    return HttpResponse.json({
      code: 200,
      message: 'Reset link sent to your email',
      data: null,
    })
  }),

  // ---- Dashboard: Metrics ----
  http.get('/api/dashboard/metrics', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json(mockMetricsData)
  }),

  // ---- Dashboard: Sales Trend ----
  http.get('/api/dashboard/sales-trend', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json(mockSalesTrend)
  }),

  // ---- Dashboard: Recent Orders ----
  http.get('/api/dashboard/recent-orders', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json(mockRecentOrders)
  }),

  // ---- Orders ----
  http.get('/api/orders', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json(mockOrdersList)
  }),

  // ---- Users ----
  http.get('/api/users', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json(mockUsersList)
  }),

  // ---- Query Records ----
  http.get('/api/query-records', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json(mockQueryRecords)
  }),

  // ---- System: Request Logs ----
  http.get('/api/system/request-logs', async () => {
    await delay(Math.random() * 500 + 300)
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const
    const statuses = ['success', 'failed', 'timeout'] as const
    const paths = ['/api/auth/login', '/api/auth/userinfo', '/api/dashboard/metrics', '/api/dashboard/sales-trend', '/api/dashboard/recent-orders', '/api/orders', '/api/users', '/api/query-records']
    const logs = Array.from({ length: 30 }, (_, i) => {
      const date = new Date('2026-03-01')
      date.setDate(date.getDate() + Math.floor(Math.random() * 34))
      return {
        id: `REQ-${String(i + 1).padStart(4, '0')}`,
        path: paths[Math.floor(Math.random() * paths.length)],
        method: methods[Math.floor(Math.random() * methods.length)],
        statusCode: [200, 201, 204, 400, 401, 403, 404, 500][Math.floor(Math.random() * 8)],
        duration: Math.floor(Math.random() * 2000) + 50,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: ['Chrome/120.0', 'Firefox/119.0', 'Safari/17.0', 'Edge/120.0'][Math.floor(Math.random() * 4)],
        timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      }
    })
    return HttpResponse.json({ code: 200, data: logs })
  }),

  // ---- System: Permissions ----
  http.get('/api/system/permissions', async () => {
    await delay(Math.random() * 500 + 300)
    const data: RolePermission[] = [
      {
        id: '1', roleName: 'admin', roleCode: 'admin',
        permissions: [
          { id: 'p1', name: 'user:manage', code: 'user:manage', description: 'manageUserAccounts', enabled: true, category: 'user' },
          { id: 'p2', name: 'role:manage', code: 'role:manage', description: 'manageRolePermissions', enabled: true, category: 'permission' },
          { id: 'p3', name: 'system:config', code: 'system:config', description: 'modifySystemConfig', enabled: true, category: 'system' },
          { id: 'p4', name: 'data:export', code: 'data:export', description: 'exportSystemData', enabled: true, category: 'data' },
          { id: 'p5', name: 'audit:view', code: 'audit:view', description: 'viewAuditLogs', enabled: true, category: 'security' },
        ],
        userCount: 2,
      },
      {
        id: '2', roleName: 'manager', roleCode: 'manager',
        permissions: [
          { id: 'p6', name: 'order:manage', code: 'order:manage', description: 'manageOrders', enabled: true, category: 'order' },
          { id: 'p7', name: 'user:view', code: 'user:view', description: 'viewUserInfo', enabled: true, category: 'user' },
          { id: 'p8', name: 'data:export', code: 'data:export', description: 'exportData', enabled: false, category: 'data' },
          { id: 'p9', name: 'report:view', code: 'report:view', description: 'viewReports', enabled: true, category: 'report' },
        ],
        userCount: 5,
      },
      {
        id: '3', roleName: 'user', roleCode: 'user',
        permissions: [
          { id: 'p10', name: 'dashboard:view', code: 'dashboard:view', description: 'viewDashboard', enabled: true, category: 'overview' },
          { id: 'p11', name: 'order:view', code: 'order:view', description: 'viewOrders', enabled: true, category: 'order' },
        ],
        userCount: 8,
      },
    ]
    return HttpResponse.json({ code: 200, data })
  }),

  // ---- System: Admin Info ----
  http.get('/api/system/admin-info', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json({
      code: 200,
      data: {
        version: 'v1.2.0',
        uptime: '15d 8h 32m',
        totalUsers: 186,
        totalRequests: 24589,
        dbSize: '128 MB',
        memoryUsage: '67%',
        cpuUsage: '23%',
      }
    })
  }),

  // ---- System: Admin Users ----
  http.get('/api/system/admin-users', async () => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json({
      code: 200,
      data: [
        { id: '1', name: 'Admin User', email: 'admin@example.com', avatar: null, role: 'admin', lastLoginAt: '2026-04-04 09:15:32', status: 'active' },
        { id: '8', name: 'Sun Jian', email: 'sunjian@example.com', avatar: null, role: 'admin', lastLoginAt: '2026-04-03 14:22:10', status: 'active' },
        { id: '12', name: 'System Root', email: 'root@system.local', avatar: null, role: 'admin', lastLoginAt: '2026-04-01 06:00:00', status: 'inactive' },
      ]
    })
  }),

  // ======================== Example: 请求示例 ========================

  // ---- GET 示例：获取列表 ----
  http.get('/api/examples/list', async () => {
    await delay(Math.random() * 800 + 400)
    const data: ExampleItem[] = [
      { id: '1', name: 'Alice Wang', email: 'alice@example.com', createdAt: '2026-03-15' },
      { id: '2', name: 'Bob Chen', email: 'bob@example.com', createdAt: '2026-03-18' },
      { id: '3', name: 'Charlie Li', email: 'charlie@example.com', createdAt: '2026-03-22' },
      { id: '4', name: 'Diana Zhang', email: 'diana@example.com', createdAt: '2026-04-01' },
    ]
    return HttpResponse.json({ code: 200, data })
  }),

  // ---- POST 示例：创建资源 ----
  http.post('/api/examples/create', async ({ request }) => {
    await delay(Math.random() * 600 + 300)
    const body = await request.json() as Record<string, unknown>
    const data: ExampleItem = {
      id: String(Date.now()),
      name: (body.name as string) || 'Unnamed',
      email: (body.email as string) || '',
      createdAt: new Date().toISOString().split('T')[0],
    }
    return HttpResponse.json({ code: 200, data })
  }),

  // ---- PUT 示例：更新资源 ----
  http.put('/api/examples/update/:id', async ({ request, params }) => {
    await delay(Math.random() * 600 + 300)
    const body = await request.json() as Record<string, unknown>
    const data: ExampleItem = {
      id: params.id as string,
      name: (body.name as string) || 'Updated',
      age: (body.age as number) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    return HttpResponse.json({ code: 200, data })
  }),

  // ---- DELETE 示例：删除资源 ----
  http.delete('/api/examples/delete/:id', async ({ params }) => {
    await delay(Math.random() * 500 + 300)
    return HttpResponse.json({
      code: 200,
      data: { success: true },
      message: `Resource ${params.id} deleted successfully`,
    })
  }),

  // ---- 并发请求 A ----
  http.get('/api/examples/concurrent-a', async () => {
    await delay(Math.random() * 1000 + 500)
    return HttpResponse.json({
      code: 200,
      data: { totalUsers: 12580, activeUsers: 8340 },
    })
  }),

  // ---- 并发请求 B ----
  http.get('/api/examples/concurrent-b', async () => {
    await delay(Math.random() * 1200 + 600)
    return HttpResponse.json({
      code: 200,
      data: { totalOrders: 45230, revenue: 1286000 },
    })
  }),

  // ---- 并发请求 C ----
  http.get('/api/examples/concurrent-c', async () => {
    await delay(Math.random() * 800 + 400)
    return HttpResponse.json({
      code: 200,
      data: { cpu: '23.5%', memory: '67.2%' },
    })
  }),

  // ---- 错误处理：404 ----
  http.get('/api/examples/error/404', async () => {
    await delay(Math.random() * 300 + 200)
    return HttpResponse.json(
      { code: 404, message: 'Resource not found', data: null },
      { status: 404 },
    )
  }),

  // ---- 错误处理：500 ----
  http.get('/api/examples/error/500', async () => {
    await delay(Math.random() * 300 + 200)
    return HttpResponse.json(
      { code: 500, message: 'Internal server error', data: null },
      { status: 500 },
    )
  }),

  // ---- 错误处理：业务异常 ----
  http.get('/api/examples/error/business', async () => {
    await delay(Math.random() * 300 + 200)
    return HttpResponse.json({
      code: 4003,
      message: 'Permission denied: insufficient privileges',
      data: null,
    })
  }),
]
