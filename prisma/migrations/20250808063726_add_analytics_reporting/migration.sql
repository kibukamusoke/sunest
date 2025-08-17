/*
  Warnings:

  - Added the required column `productName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSku` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'IN_APP', 'SMS', 'PUSH', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('SYSTEM', 'ORDER', 'INVENTORY', 'MERCHANT', 'USER', 'SECURITY', 'PROMOTION', 'REMINDER', 'ALERT');

-- CreateEnum
CREATE TYPE "EmailTemplateType" AS ENUM ('WELCOME', 'VERIFICATION', 'PASSWORD_RESET', 'ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'INVOICE_READY', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'MERCHANT_APPROVED', 'MERCHANT_REJECTED', 'PRODUCT_APPROVED', 'PRODUCT_REJECTED', 'LOW_STOCK_ALERT', 'PRICE_CHANGE', 'QUOTE_REQUEST', 'QUOTE_RECEIVED', 'RFQ_SUBMITTED', 'RFQ_RESPONSE', 'CART_ABANDONED', 'BULK_ORDER_READY', 'SHIPMENT_DELAYED', 'APPROVAL_REQUIRED', 'APPROVAL_GRANTED', 'APPROVAL_DENIED', 'SYSTEM_MAINTENANCE', 'SECURITY_ALERT');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('USER_REGISTERED', 'USER_LOGIN', 'USER_LOGOUT', 'ORDER_CREATED', 'ORDER_CONFIRMED', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'PAYMENT_PROCESSED', 'PAYMENT_FAILED', 'INVENTORY_LOW', 'INVENTORY_OUT', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_APPROVED', 'PRODUCT_REJECTED', 'MERCHANT_APPLIED', 'MERCHANT_APPROVED', 'MERCHANT_REJECTED', 'QUOTE_REQUESTED', 'QUOTE_SUBMITTED', 'RFQ_CREATED', 'RFQ_RESPONDED', 'CART_ABANDONED', 'PRICE_CHANGED', 'SYSTEM_ERROR', 'SECURITY_BREACH');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('SALES_REVENUE', 'ORDER_COUNT', 'USER_REGISTRATIONS', 'PRODUCT_VIEWS', 'SEARCH_QUERIES', 'CONVERSION_RATE', 'CART_ABANDONMENT', 'MERCHANT_PERFORMANCE', 'INVENTORY_TURNOVER', 'CUSTOMER_LIFETIME_VALUE', 'AVERAGE_ORDER_VALUE', 'FULFILLMENT_TIME', 'SHIPPING_COST', 'REFUND_RATE', 'CUSTOMER_SATISFACTION');

-- CreateEnum
CREATE TYPE "DimensionType" AS ENUM ('TIME_PERIOD', 'PRODUCT_CATEGORY', 'MERCHANT', 'CUSTOMER_SEGMENT', 'GEOGRAPHIC_REGION', 'USER_ROLE', 'DEVICE_TYPE', 'TRAFFIC_SOURCE', 'PAYMENT_METHOD', 'SHIPPING_METHOD');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('SALES_REPORT', 'INVENTORY_REPORT', 'CUSTOMER_REPORT', 'MERCHANT_REPORT', 'PRODUCT_PERFORMANCE', 'FINANCIAL_REPORT', 'OPERATIONAL_REPORT', 'MARKETING_REPORT', 'EXECUTIVE_SUMMARY', 'CUSTOM_REPORT');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'CSV', 'EXCEL', 'JSON');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DashboardType" AS ENUM ('EXECUTIVE', 'SALES', 'OPERATIONS', 'MARKETING', 'FINANCE', 'MERCHANT', 'CUSTOMER_SERVICE', 'INVENTORY', 'FULFILLMENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('LINE', 'BAR', 'PIE', 'AREA', 'SCATTER', 'DONUT', 'GAUGE', 'HEATMAP', 'FUNNEL', 'TABLE');

-- CreateEnum
CREATE TYPE "TimeGranularity" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR');

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "productBrand" TEXT,
ADD COLUMN     "productCategory" TEXT,
ADD COLUMN     "productImages" TEXT[],
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productSku" TEXT NOT NULL,
ADD COLUMN     "productSnapshot" JSONB,
ADD COLUMN     "snapshotCreatedAt" TIMESTAMP(3),
ADD COLUMN     "variantAttributes" JSONB,
ADD COLUMN     "variantName" TEXT,
ADD COLUMN     "variantSku" TEXT,
ADD COLUMN     "variantSnapshot" JSONB;

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EmailTemplateType" NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "variables" JSONB,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "channel" "NotificationChannel" NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "recipientId" TEXT,
    "recipientEmail" TEXT,
    "recipientPhone" TEXT,
    "templateId" TEXT,
    "eventId" TEXT,
    "eventType" "EventType",
    "scheduledFor" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "channels" "NotificationChannel"[],
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "timezone" TEXT,
    "emailDigest" BOOLEAN NOT NULL DEFAULT false,
    "digestFrequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_events" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB,
    "userId" TEXT,
    "merchantId" TEXT,
    "orderId" TEXT,
    "productId" TEXT,
    "severity" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "source" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "eventType" "EventType" NOT NULL,
    "conditions" JSONB,
    "targetRoles" TEXT[],
    "targetUserIds" TEXT[],
    "targetEmails" TEXT[],
    "templateId" TEXT,
    "channels" "NotificationChannel"[],
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "delay" INTEGER,
    "cooldownTime" INTEGER,
    "maxPerDay" INTEGER,
    "maxPerUser" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_queue" (
    "id" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "toEmail" TEXT NOT NULL,
    "toName" TEXT,
    "subject" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "bodyHtml" TEXT,
    "ccEmails" TEXT[],
    "bccEmails" TEXT[],
    "attachments" JSONB[],
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "notificationId" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "provider" TEXT,
    "providerId" TEXT,
    "providerData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_metrics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MetricType" NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "formula" TEXT,
    "dataSource" TEXT,
    "refreshRate" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRealTime" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_data_points" (
    "id" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "value" DECIMAL(15,4) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "granularity" "TimeGranularity" NOT NULL,
    "dimensions" JSONB,
    "userId" TEXT,
    "merchantId" TEXT,
    "productId" TEXT,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_data_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DashboardType" NOT NULL,
    "layout" JSONB NOT NULL,
    "ownerId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "sharedWith" TEXT[],
    "allowedRoles" TEXT[],
    "refreshRate" INTEGER DEFAULT 300,
    "timezone" TEXT DEFAULT 'UTC',
    "dateRange" JSONB,
    "autoRefresh" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templateSource" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_widgets" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ChartType" NOT NULL,
    "description" TEXT,
    "position" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metricId" TEXT,
    "dataQuery" JSONB,
    "chartConfig" JSONB,
    "filters" JSONB,
    "refreshRate" INTEGER DEFAULT 300,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ReportType" NOT NULL,
    "format" "ReportFormat" NOT NULL DEFAULT 'PDF',
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "parameters" JSONB,
    "template" TEXT,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "cronExpression" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "createdBy" TEXT NOT NULL,
    "recipients" TEXT[],
    "fileName" TEXT,
    "fileSize" INTEGER,
    "filePath" TEXT,
    "downloadUrl" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_metrics" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "filters" JSONB,
    "aggregation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_schedules" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "recipients" TEXT[],
    "subject" TEXT,
    "message" TEXT,
    "lastRun" TIMESTAMP(3),
    "nextRun" TIMESTAMP(3),
    "runCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_alerts" (
    "id" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "condition" TEXT NOT NULL,
    "threshold" DECIMAL(15,4) NOT NULL,
    "timeWindow" INTEGER NOT NULL,
    "recipients" TEXT[],
    "channels" TEXT[],
    "cooldown" INTEGER NOT NULL DEFAULT 60,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggered" TIMESTAMP(3),
    "triggerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metric_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_notifications" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL,
    "metricValue" DECIMAL(15,4) NOT NULL,
    "threshold" DECIMAL(15,4) NOT NULL,
    "message" TEXT NOT NULL,
    "channels" TEXT[],
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedBy" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_subscriptions" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "deliveryTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "format" "ReportFormat" NOT NULL DEFAULT 'PDF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSent" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_sessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "browserType" TEXT,
    "platform" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "merchantId" TEXT,
    "orderId" TEXT,
    "revenue" DECIMAL(15,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "category" TEXT,
    "action" TEXT,
    "label" TEXT,
    "value" DECIMAL(15,4),
    "userId" TEXT,
    "merchantId" TEXT,
    "productId" TEXT,
    "orderId" TEXT,
    "pageUrl" TEXT,
    "pageTitle" TEXT,
    "referrer" TEXT,
    "properties" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_metrics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "granularity" "TimeGranularity" NOT NULL,
    "totalRevenue" DECIMAL(15,2),
    "totalOrders" INTEGER,
    "totalUsers" INTEGER,
    "activeUsers" INTEGER,
    "newUsers" INTEGER,
    "averageOrderValue" DECIMAL(15,2),
    "conversionRate" DECIMAL(5,4),
    "customerLifetimeValue" DECIMAL(15,2),
    "activeMerchants" INTEGER,
    "newMerchants" INTEGER,
    "merchantRevenue" DECIMAL(15,2),
    "averageOrdersPerMerchant" DECIMAL(15,2),
    "totalProducts" INTEGER,
    "activeProducts" INTEGER,
    "productViews" INTEGER,
    "addToCartRate" DECIMAL(5,4),
    "averageFulfillmentTime" DECIMAL(10,2),
    "shippingCost" DECIMAL(15,2),
    "returnRate" DECIMAL(5,4),
    "customerSatisfaction" DECIMAL(3,2),
    "customMetrics" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "notification_templates"("name");

-- CreateIndex
CREATE INDEX "notifications_recipientId_idx" ON "notifications"("recipientId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_channel_idx" ON "notifications"("channel");

-- CreateIndex
CREATE INDEX "notifications_scheduledFor_idx" ON "notifications"("scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_category_key" ON "notification_preferences"("userId", "category");

-- CreateIndex
CREATE INDEX "system_events_type_idx" ON "system_events"("type");

-- CreateIndex
CREATE INDEX "system_events_userId_idx" ON "system_events"("userId");

-- CreateIndex
CREATE INDEX "system_events_createdAt_idx" ON "system_events"("createdAt");

-- CreateIndex
CREATE INDEX "system_events_processed_idx" ON "system_events"("processed");

-- CreateIndex
CREATE INDEX "email_queue_status_idx" ON "email_queue"("status");

-- CreateIndex
CREATE INDEX "email_queue_scheduledFor_idx" ON "email_queue"("scheduledFor");

-- CreateIndex
CREATE INDEX "email_queue_toEmail_idx" ON "email_queue"("toEmail");

-- CreateIndex
CREATE INDEX "analytics_metrics_type_idx" ON "analytics_metrics"("type");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_metrics_name_type_key" ON "analytics_metrics"("name", "type");

-- CreateIndex
CREATE INDEX "metric_data_points_metricId_timestamp_idx" ON "metric_data_points"("metricId", "timestamp");

-- CreateIndex
CREATE INDEX "metric_data_points_timestamp_idx" ON "metric_data_points"("timestamp");

-- CreateIndex
CREATE INDEX "metric_data_points_userId_idx" ON "metric_data_points"("userId");

-- CreateIndex
CREATE INDEX "metric_data_points_merchantId_idx" ON "metric_data_points"("merchantId");

-- CreateIndex
CREATE INDEX "dashboards_ownerId_idx" ON "dashboards"("ownerId");

-- CreateIndex
CREATE INDEX "dashboards_type_idx" ON "dashboards"("type");

-- CreateIndex
CREATE INDEX "dashboard_widgets_dashboardId_idx" ON "dashboard_widgets"("dashboardId");

-- CreateIndex
CREATE INDEX "dashboard_widgets_metricId_idx" ON "dashboard_widgets"("metricId");

-- CreateIndex
CREATE INDEX "reports_createdBy_idx" ON "reports"("createdBy");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "report_metrics_reportId_metricId_key" ON "report_metrics"("reportId", "metricId");

-- CreateIndex
CREATE INDEX "report_schedules_reportId_idx" ON "report_schedules"("reportId");

-- CreateIndex
CREATE INDEX "report_schedules_nextRun_idx" ON "report_schedules"("nextRun");

-- CreateIndex
CREATE INDEX "metric_alerts_metricId_idx" ON "metric_alerts"("metricId");

-- CreateIndex
CREATE INDEX "metric_alerts_isActive_idx" ON "metric_alerts"("isActive");

-- CreateIndex
CREATE INDEX "alert_notifications_alertId_idx" ON "alert_notifications"("alertId");

-- CreateIndex
CREATE INDEX "alert_notifications_triggeredAt_idx" ON "alert_notifications"("triggeredAt");

-- CreateIndex
CREATE INDEX "dashboard_subscriptions_userId_idx" ON "dashboard_subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_subscriptions_dashboardId_userId_key" ON "dashboard_subscriptions"("dashboardId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "analytics_sessions_sessionId_key" ON "analytics_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "analytics_sessions_userId_idx" ON "analytics_sessions"("userId");

-- CreateIndex
CREATE INDEX "analytics_sessions_startTime_idx" ON "analytics_sessions"("startTime");

-- CreateIndex
CREATE INDEX "analytics_sessions_merchantId_idx" ON "analytics_sessions"("merchantId");

-- CreateIndex
CREATE INDEX "analytics_events_sessionId_idx" ON "analytics_events"("sessionId");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_idx" ON "analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "analytics_events_timestamp_idx" ON "analytics_events"("timestamp");

-- CreateIndex
CREATE INDEX "analytics_events_userId_idx" ON "analytics_events"("userId");

-- CreateIndex
CREATE INDEX "analytics_events_productId_idx" ON "analytics_events"("productId");

-- CreateIndex
CREATE INDEX "business_metrics_date_idx" ON "business_metrics"("date");

-- CreateIndex
CREATE INDEX "business_metrics_category_idx" ON "business_metrics"("category");

-- CreateIndex
CREATE UNIQUE INDEX "business_metrics_name_date_granularity_key" ON "business_metrics"("name", "date", "granularity");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_events" ADD CONSTRAINT "system_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_rules" ADD CONSTRAINT "notification_rules_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "notification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_rules" ADD CONSTRAINT "notification_rules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_queue" ADD CONSTRAINT "email_queue_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_data_points" ADD CONSTRAINT "metric_data_points_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "analytics_metrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_widgets" ADD CONSTRAINT "dashboard_widgets_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "analytics_metrics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_metrics" ADD CONSTRAINT "report_metrics_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_metrics" ADD CONSTRAINT "report_metrics_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "analytics_metrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_schedules" ADD CONSTRAINT "report_schedules_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_alerts" ADD CONSTRAINT "metric_alerts_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "analytics_metrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_notifications" ADD CONSTRAINT "alert_notifications_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "metric_alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_subscriptions" ADD CONSTRAINT "dashboard_subscriptions_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_subscriptions" ADD CONSTRAINT "dashboard_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_sessions" ADD CONSTRAINT "analytics_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "analytics_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
