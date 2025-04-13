import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const malas = pgTable("malas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  currentCount: integer("current_count").notNull().default(0),
  completedMalas: integer("completed_malas").notNull().default(0),
  totalRecitations: integer("total_recitations").notNull().default(0),
  guruRinpocheCompletedMalas: integer("guru_rinpoche_completed_malas").notNull().default(0),
  guruRinpocheTotalRecitations: integer("guru_rinpoche_total_recitations").notNull().default(0),
  greenTaraCompletedMalas: integer("green_tara_completed_malas").notNull().default(0),
  greenTaraTotalRecitations: integer("green_tara_total_recitations").notNull().default(0),
  whiteTaraCompletedMalas: integer("white_tara_completed_malas").notNull().default(0),
  whiteTaraTotalRecitations: integer("white_tara_total_recitations").notNull().default(0),
  chenrezigCompletedMalas: integer("chenrezig_completed_malas").notNull().default(0),
  chenrezigTotalRecitations: integer("chenrezig_total_recitations").notNull().default(0),
  dzambhalaCompletedMalas: integer("dzambhala_completed_malas").notNull().default(0),
  dzambhalaTotalRecitations: integer("dzambhala_total_recitations").notNull().default(0),
  shakyamuniCompletedMalas: integer("shakyamuni_completed_malas").notNull().default(0),
  shakyamuniTotalRecitations: integer("shakyamuni_total_recitations").notNull().default(0),
  medicineBuddhaCompletedMalas: integer("medicine_buddha_completed_malas").notNull().default(0),
  medicineBuddhaTotalRecitations: integer("medicine_buddha_total_recitations").notNull().default(0),
  manjushriCompletedMalas: integer("manjushri_completed_malas").notNull().default(0),
  manjushriTotalRecitations: integer("manjushri_total_recitations").notNull().default(0),
  vajrasattvaCompletedMalas: integer("vajrasattva_completed_malas").notNull().default(0),
  vajrasattvaTotalRecitations: integer("vajrasattva_total_recitations").notNull().default(0),
  confessionsCompletedMalas: integer("confessions_completed_malas").notNull().default(0),
  confessionsTotalRecitations: integer("confessions_total_recitations").notNull().default(0),
  // Custom image URLs for each deity
  amitabhaImageUrl: text("amitabha_image_url").default(''),
  guruRinpocheImageUrl: text("guru_rinpoche_image_url").default(''),
  greenTaraImageUrl: text("green_tara_image_url").default(''),
  whiteTaraImageUrl: text("white_tara_image_url").default(''),
  chenrezigImageUrl: text("chenrezig_image_url").default(''),
  dzambhalaImageUrl: text("dzambhala_image_url").default(''),
  shakyamuniImageUrl: text("shakyamuni_image_url").default(''),
  medicineBuddhaImageUrl: text("medicine_buddha_image_url").default(''),
  manjushriImageUrl: text("manjushri_image_url").default(''),
  vajrasattvaImageUrl: text("vajrasattva_image_url").default(''),
  confessionsImageUrl: text("confessions_image_url").default(''),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMalaSchema = createInsertSchema(malas).pick({
  userId: true,
  currentCount: true,
  completedMalas: true,
  totalRecitations: true,
  guruRinpocheCompletedMalas: true,
  guruRinpocheTotalRecitations: true,
  greenTaraCompletedMalas: true,
  greenTaraTotalRecitations: true,
  whiteTaraCompletedMalas: true,
  whiteTaraTotalRecitations: true,
  chenrezigCompletedMalas: true,
  chenrezigTotalRecitations: true,
  dzambhalaCompletedMalas: true,
  dzambhalaTotalRecitations: true,
  shakyamuniCompletedMalas: true,
  shakyamuniTotalRecitations: true,
  medicineBuddhaCompletedMalas: true,
  medicineBuddhaTotalRecitations: true,
  manjushriCompletedMalas: true,
  manjushriTotalRecitations: true,
  vajrasattvaCompletedMalas: true,
  vajrasattvaTotalRecitations: true,
  confessionsCompletedMalas: true,
  confessionsTotalRecitations: true,
});

export const updateMalaSchema = createInsertSchema(malas).pick({
  currentCount: true,
  completedMalas: true,
  totalRecitations: true,
  guruRinpocheCompletedMalas: true,
  guruRinpocheTotalRecitations: true,
  greenTaraCompletedMalas: true,
  greenTaraTotalRecitations: true,
  whiteTaraCompletedMalas: true,
  whiteTaraTotalRecitations: true,
  chenrezigCompletedMalas: true,
  chenrezigTotalRecitations: true,
  dzambhalaCompletedMalas: true,
  dzambhalaTotalRecitations: true,
  shakyamuniCompletedMalas: true,
  shakyamuniTotalRecitations: true,
  medicineBuddhaCompletedMalas: true,
  medicineBuddhaTotalRecitations: true,
  manjushriCompletedMalas: true,
  manjushriTotalRecitations: true,
  vajrasattvaCompletedMalas: true,
  vajrasattvaTotalRecitations: true,
  confessionsCompletedMalas: true,
  confessionsTotalRecitations: true,
  // Custom image URLs
  amitabhaImageUrl: true,
  guruRinpocheImageUrl: true,
  greenTaraImageUrl: true,
  whiteTaraImageUrl: true,
  chenrezigImageUrl: true,
  dzambhalaImageUrl: true,
  shakyamuniImageUrl: true,
  medicineBuddhaImageUrl: true,
  manjushriImageUrl: true,
  vajrasattvaImageUrl: true,
  confessionsImageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMala = z.infer<typeof insertMalaSchema>;
export type UpdateMala = z.infer<typeof updateMalaSchema>;
export type Mala = typeof malas.$inferSelect;
