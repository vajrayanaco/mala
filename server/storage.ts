import { users, type User, type InsertUser, malas, type Mala, type InsertMala, type UpdateMala } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMala(id: number): Promise<Mala | undefined>;
  getMalaByUserId(userId: number): Promise<Mala | undefined>;
  createMala(mala: InsertMala): Promise<Mala>;
  updateMala(id: number, data: UpdateMala): Promise<Mala | undefined>;
  getAnonymousMala(): Promise<Mala>;
  updateAnonymousMala(data: UpdateMala): Promise<Mala>;
  resetAnonymousMala(): void;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private malas: Map<number, Mala>;
  private currentUserId: number;
  private currentMalaId: number;
  private anonymousMala: Mala;

  constructor() {
    this.users = new Map();
    this.malas = new Map();
    this.currentUserId = 1;
    this.currentMalaId = 1;
    
    // Create anonymous mala for users without accounts
    this.anonymousMala = {
      id: 0,
      userId: null,
      currentCount: 0,
      completedMalas: 0,
      totalRecitations: 0,
      guruRinpocheCompletedMalas: 0,
      guruRinpocheTotalRecitations: 0,
      greenTaraCompletedMalas: 0,
      greenTaraTotalRecitations: 0,
      whiteTaraCompletedMalas: 0,
      whiteTaraTotalRecitations: 0,
      chenrezigCompletedMalas: 0,
      chenrezigTotalRecitations: 0,
      dzambhalaCompletedMalas: 0,
      dzambhalaTotalRecitations: 0,
      shakyamuniCompletedMalas: 0,
      shakyamuniTotalRecitations: 0,
      medicineBuddhaCompletedMalas: 0,
      medicineBuddhaTotalRecitations: 0,
      manjushriCompletedMalas: 0,
      manjushriTotalRecitations: 0,
      vajrasattvaCompletedMalas: 0,
      vajrasattvaTotalRecitations: 0,
      confessionsCompletedMalas: 0,
      confessionsTotalRecitations: 0
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMala(id: number): Promise<Mala | undefined> {
    return this.malas.get(id);
  }

  async getMalaByUserId(userId: number): Promise<Mala | undefined> {
    return Array.from(this.malas.values()).find(
      (mala) => mala.userId === userId
    );
  }

  async createMala(insertMala: InsertMala): Promise<Mala> {
    const id = this.currentMalaId++;
    const mala: Mala = { 
      id,
      userId: insertMala.userId !== undefined ? insertMala.userId : null,
      currentCount: insertMala.currentCount !== undefined ? insertMala.currentCount : 0,
      completedMalas: insertMala.completedMalas !== undefined ? insertMala.completedMalas : 0,
      totalRecitations: insertMala.totalRecitations !== undefined ? insertMala.totalRecitations : 0,
      guruRinpocheCompletedMalas: insertMala.guruRinpocheCompletedMalas !== undefined ? insertMala.guruRinpocheCompletedMalas : 0,
      guruRinpocheTotalRecitations: insertMala.guruRinpocheTotalRecitations !== undefined ? insertMala.guruRinpocheTotalRecitations : 0,
      greenTaraCompletedMalas: insertMala.greenTaraCompletedMalas !== undefined ? insertMala.greenTaraCompletedMalas : 0,
      greenTaraTotalRecitations: insertMala.greenTaraTotalRecitations !== undefined ? insertMala.greenTaraTotalRecitations : 0,
      whiteTaraCompletedMalas: insertMala.whiteTaraCompletedMalas !== undefined ? insertMala.whiteTaraCompletedMalas : 0,
      whiteTaraTotalRecitations: insertMala.whiteTaraTotalRecitations !== undefined ? insertMala.whiteTaraTotalRecitations : 0,
      chenrezigCompletedMalas: insertMala.chenrezigCompletedMalas !== undefined ? insertMala.chenrezigCompletedMalas : 0,
      chenrezigTotalRecitations: insertMala.chenrezigTotalRecitations !== undefined ? insertMala.chenrezigTotalRecitations : 0,
      dzambhalaCompletedMalas: insertMala.dzambhalaCompletedMalas !== undefined ? insertMala.dzambhalaCompletedMalas : 0,
      dzambhalaTotalRecitations: insertMala.dzambhalaTotalRecitations !== undefined ? insertMala.dzambhalaTotalRecitations : 0,
      shakyamuniCompletedMalas: insertMala.shakyamuniCompletedMalas !== undefined ? insertMala.shakyamuniCompletedMalas : 0,
      shakyamuniTotalRecitations: insertMala.shakyamuniTotalRecitations !== undefined ? insertMala.shakyamuniTotalRecitations : 0,
      medicineBuddhaCompletedMalas: insertMala.medicineBuddhaCompletedMalas !== undefined ? insertMala.medicineBuddhaCompletedMalas : 0,
      medicineBuddhaTotalRecitations: insertMala.medicineBuddhaTotalRecitations !== undefined ? insertMala.medicineBuddhaTotalRecitations : 0,
      manjushriCompletedMalas: insertMala.manjushriCompletedMalas !== undefined ? insertMala.manjushriCompletedMalas : 0,
      manjushriTotalRecitations: insertMala.manjushriTotalRecitations !== undefined ? insertMala.manjushriTotalRecitations : 0,
      vajrasattvaCompletedMalas: insertMala.vajrasattvaCompletedMalas !== undefined ? insertMala.vajrasattvaCompletedMalas : 0,
      vajrasattvaTotalRecitations: insertMala.vajrasattvaTotalRecitations !== undefined ? insertMala.vajrasattvaTotalRecitations : 0,
      confessionsCompletedMalas: insertMala.confessionsCompletedMalas !== undefined ? insertMala.confessionsCompletedMalas : 0,
      confessionsTotalRecitations: insertMala.confessionsTotalRecitations !== undefined ? insertMala.confessionsTotalRecitations : 0
    };
    this.malas.set(id, mala);
    return mala;
  }

  async updateMala(id: number, data: UpdateMala): Promise<Mala | undefined> {
    const mala = await this.getMala(id);
    if (!mala) return undefined;
    
    const updatedMala = { ...mala, ...data };
    this.malas.set(id, updatedMala);
    return updatedMala;
  }

  async getAnonymousMala(): Promise<Mala> {
    return this.anonymousMala;
  }

  async updateAnonymousMala(data: UpdateMala): Promise<Mala> {
    this.anonymousMala = { ...this.anonymousMala, ...data };
    return this.anonymousMala;
  }

  resetAnonymousMala(): void {
    // Reset to default values with all fields explicitly set
    this.anonymousMala = {
      id: 0,
      userId: null,
      currentCount: 0,
      completedMalas: 0,
      totalRecitations: 0,
      guruRinpocheCompletedMalas: 0,
      guruRinpocheTotalRecitations: 0,
      greenTaraCompletedMalas: 0,
      greenTaraTotalRecitations: 0,
      whiteTaraCompletedMalas: 0,
      whiteTaraTotalRecitations: 0,
      chenrezigCompletedMalas: 0,
      chenrezigTotalRecitations: 0,
      dzambhalaCompletedMalas: 0,
      dzambhalaTotalRecitations: 0,
      shakyamuniCompletedMalas: 0,
      shakyamuniTotalRecitations: 0,
      medicineBuddhaCompletedMalas: 0,
      medicineBuddhaTotalRecitations: 0,
      manjushriCompletedMalas: 0,
      manjushriTotalRecitations: 0,
      vajrasattvaCompletedMalas: 0,
      vajrasattvaTotalRecitations: 0,
      confessionsCompletedMalas: 0,
      confessionsTotalRecitations: 0
    };
  }
}

export const storage = new MemStorage();
