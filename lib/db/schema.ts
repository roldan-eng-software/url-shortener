import { pgTable, uuid, varchar, integer, timestamp, text, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  isPremium: boolean('is_premium').default(false),
  stripeCustomerId: varchar('stripe_customer_id', { length: 100 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 100 }),
  premiumExpiresAt: timestamp('premium_expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userLinks = pgTable('user_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  customAlias: varchar('custom_alias', { length: 50 }),
  clicksTotal: integer('clicks_total').default(0),
  clicksGeo: jsonb('clicks_geo').default({}),
  clicksDevice: jsonb('clicks_device').default({}),
  clicksReferrers: jsonb('clicks_referrers').default({}),
  qrCode: text('qr_code'),
  isPremium: boolean('is_premium').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const anonLinks = pgTable('anon_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  clicksTotal: integer('clicks_total').default(0),
  clicksGeo: jsonb('clicks_geo').default({}),
  clicksDevice: jsonb('clicks_device').default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

export const urls = pgTable('urls', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
  userId: uuid('user_id'),
  isPremium: boolean('is_premium').default(false),
  clicksGeo: jsonb('clicks_geo').default({}),
  clicksDevice: jsonb('clicks_device').default({}),
  clicksReferrers: jsonb('clicks_referrers').default({}),
});

export const marketingLeads = pgTable('marketing_leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 120 }).notNull(),
  email: text('email').notNull(),
  company: varchar('company', { length: 160 }),
  phone: varchar('phone', { length: 40 }),
  interest: varchar('interest', { length: 40 }).notNull().default('premium'),
  source: varchar('source', { length: 80 }).notNull().default('home_conversion_band'),
  message: text('message'),
  status: varchar('status', { length: 30 }).notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserLink = typeof userLinks.$inferSelect;
export type NewUserLink = typeof userLinks.$inferInsert;
export type AnonLink = typeof anonLinks.$inferSelect;
export type NewAnonLink = typeof anonLinks.$inferInsert;
export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
export type MarketingLead = typeof marketingLeads.$inferSelect;
export type NewMarketingLead = typeof marketingLeads.$inferInsert;
