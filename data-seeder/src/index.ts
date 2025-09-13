// data-seeder/src/index.ts
import mongoose from "mongoose";
import crypto from "crypto";

// ===============================
// INTERFACES
// ===============================
interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "user";
  active: boolean;
  companyId?: string;
  teams?: string[];
  provider: "local" | "google";
  confirmationToken?: string;
}

interface ICompany {
  _id?: string;
  name: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  logo?: string;
  owner: string;
  teams?: string[];
  isActive: boolean;
}

interface ITeam {
  _id?: string;
  name: string;
  description?: string;
  company: string;
  members: string[];
  leader?: string;
  isActive: boolean;
}

interface IClient {
  _id?: any;
  name: string;
  description?: string;
  sector?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string;
  company: any;
  team?: any;
  assignedTo?: string;
  contacts: string[];
  opportunities: string[];
  isActive: boolean;
  goodForCustomer: number;
  estimatedBudget?: number;
  companySize: "1-10" | "11-50" | "51-200" | "200+";
  hasWorkedWithUs: boolean;
  knowsUs: boolean;
  interactions: Array<{
    date: Date;
    type: string;
    outcome: string;
    notes: string;
  }>;
  lastContactDate?: Date;
}

interface IContact {
  _id?: any;
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company: any;
  client: string;
  team?: any;
  assignedTo?: string;
  isPrimary: boolean;
  notes?: string;
  lastContactDate?: Date;
  opportunities: string[];
  isActive: boolean;
}

interface IOpportunity {
  _id?: any;
  title: string;
  description?: string;
  value: number;
  status: "lead" | "qualified" | "proposition" | "negotiation" | "won" | "lost";
  probability: number;
  expectedClosingDate?: Date;
  company: any;
  client: string;
  contacts: string[];
  team?: any;
  assignedTo?: string;
  notes?: string;
  products: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  isActive: boolean;
}

interface IDeal {
  _id?: any;
  title: string;
  description?: string;
  value: number;
  status:
    | "prospection"
    | "qualification"
    | "proposition"
    | "negociation"
    | "signature"
    | "perdu"
    | "gagne";
  probability: number;
  expectedClosingDate?: Date;
  company: any;
  client: string;
  contacts: string[];
  team?: any;
  assignedTo?: string;
  notes?: string;
  products: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  isActive: boolean;
}

// ===============================
// UTILITAIRES DE CONNEXION
// ===============================
const connectWithRetry = async (
  connectionFunc: () => Promise<mongoose.Connection>,
  maxRetries = 10
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = await connectionFunc();
      await connection.db?.admin().ping();
      return connection;
    } catch (error: any) {
      console.log(
        `Tentative de connexion ${i + 1}/${maxRetries} échouée:`,
        error?.message || error
      );
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

// ===============================
// CONNEXIONS MONGODB
// ===============================
const createAuthConnection = async () => {
  const authUri =
    process.env.AUTH_MONGO_URI ||
    "mongodb://localhost:27017/autenthication-service";
  console.log(`🔐 Connexion à: ${authUri}`);

  return connectWithRetry(() => {
    const authConnection = mongoose.createConnection(authUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    return Promise.resolve(authConnection);
  });
};

const createBddConnection = async () => {
  const bddUri =
    process.env.BDD_MONGO_URI || "mongodb://localhost:27017/bdd-services";
  console.log(`💾 Connexion à: ${bddUri}`);

  return connectWithRetry(() => {
    const bddConnection = mongoose.createConnection(bddUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    return Promise.resolve(bddConnection);
  });
};

// ===============================
// SCHÉMAS MONGODB
// ===============================
const createUserSchema = (connection: mongoose.Connection) => {
  const UserSchema = new mongoose.Schema(
    {
      firstName: { type: String },
      lastName: { type: String },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: { type: String, required: true },
      role: {
        type: String,
        required: true,
        enum: ["admin", "manager", "user"],
        default: "user",
      },
      active: { type: Boolean, default: false },
      teams: [{ type: String }],
      companyId: { type: String },
      lastLogin: { type: Date },
      provider: { type: String, enum: ["local", "google"], default: "local" },
      confirmationToken: { type: String },
    },
    { timestamps: true }
  );

  return connection.model<IUser>("User", UserSchema);
};

const createCompanySchema = (connection: mongoose.Connection) => {
  const CompanySchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        zipCode: { type: String },
        country: { type: String },
      },
      phone: { type: String },
      email: { type: String },
      website: { type: String },
      industry: { type: String },
      logo: { type: String },
      owner: { type: String, required: true },
      teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
  );

  return connection.model<ICompany>("Company", CompanySchema);
};

const createTeamSchema = (connection: mongoose.Connection) => {
  const TeamSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      members: [{ type: String }],
      leader: { type: String },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
  );

  return connection.model<ITeam>("Team", TeamSchema);
};

const createClientSchema = (connection: mongoose.Connection) => {
  const ClientSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      sector: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        zipCode: { type: String },
        country: { type: String },
      },
      phone: { type: String },
      email: { type: String },
      logo: { type: String },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      assignedTo: { type: String },
      contacts: [{ type: String }],
      opportunities: [{ type: String }],
      isActive: { type: Boolean, default: true },
      goodForCustomer: { type: Number, min: 0, max: 100, default: 50 },
      estimatedBudget: { type: Number },
      companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "200+"],
        default: "1-10",
      },
      hasWorkedWithUs: { type: Boolean, default: false },
      knowsUs: { type: Boolean, default: false },
      interactions: [
        {
          date: { type: Date, default: Date.now },
          type: {
            type: String,
            enum: [
              "call",
              "email",
              "meeting",
              "demo",
              "proposal",
              "follow_up",
              "other",
            ],
          },
          outcome: {
            type: String,
            enum: ["positive", "neutral", "negative", "no_response"],
          },
          notes: { type: String, maxlength: 200 },
        },
      ],
      lastContactDate: { type: Date },
    },
    { timestamps: true, versionKey: false }
  );

  return connection.model<IClient>("Client", ClientSchema);
};

const createContactSchema = (connection: mongoose.Connection) => {
  const ContactSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      position: { type: String },
      email: { type: String },
      phone: { type: String },
      mobile: { type: String },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      client: { type: String, required: true },
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      assignedTo: { type: String },
      isPrimary: { type: Boolean, default: false },
      notes: { type: String },
      lastContactDate: { type: Date },
      opportunities: [{ type: String }],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
  );

  return connection.model<IContact>("Contact", ContactSchema);
};

const createOpportunitySchema = (connection: mongoose.Connection) => {
  const OpportunitySchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      value: { type: Number, required: true },
      status: {
        type: String,
        enum: [
          "lead",
          "qualified",
          "proposition",
          "negotiation",
          "won",
          "lost",
        ],
        default: "lead",
      },
      probability: { type: Number, min: 0, max: 100, default: 20 },
      expectedClosingDate: { type: Date },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      client: { type: String, required: true },
      contacts: [{ type: String }],
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      assignedTo: { type: String },
      notes: { type: String },
      products: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
  );

  return connection.model<IOpportunity>("Opportunity", OpportunitySchema);
};

const createDealSchema = (connection: mongoose.Connection) => {
  const DealSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String },
      value: { type: Number, required: true },
      status: {
        type: String,
        enum: [
          "prospection",
          "qualification",
          "proposition",
          "negociation",
          "signature",
          "perdu",
          "gagne",
        ],
        default: "prospection",
      },
      probability: { type: Number, min: 0, max: 100, default: 20 },
      expectedClosingDate: { type: Date },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
      client: { type: String, required: true },
      contacts: [{ type: String }],
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      assignedTo: { type: String },
      notes: { type: String },
      products: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
  );

  return connection.model<IDeal>("Deal", DealSchema);
};

// ===============================
// FONCTIONS UTILITAIRES
// ===============================
const HASH_ITERATIONS = 10000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

const generateSalt = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

const hashPassword = (password: string, salt: string): string => {
  const hash = crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

  return `${HASH_ITERATIONS}:${HASH_DIGEST}:${HASH_KEY_LENGTH}:${salt}:${hash}`;
};

const createHashedPassword = (password: string): string => {
  const salt = generateSalt();
  return hashPassword(password, salt);
};

// Fonction pour générer des dates aléaoires
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomFutureDate = (daysFromNow: number = 90): Date => {
  const now = new Date();
  const future = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
  return randomDate(now, future);
};

const randomPastDate = (daysAgo: number = 30): Date => {
  const now = new Date();
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return randomDate(past, now);
};

// ===============================
// DONNÉES DE SEEDING
// ===============================
const seedData = async () => {
  console.log("🚀 Démarrage du seeding des données CRM...");

  let authConnection: mongoose.Connection | undefined;
  let bddConnection: mongoose.Connection | undefined;

  try {
    console.log("⏳ Attente de MongoDB...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("🔌 Établissement des connexions...");
    authConnection = await createAuthConnection();
    bddConnection = await createBddConnection();
    console.log("✅ Connexions établies");

    if (!authConnection || !bddConnection) {
      throw new Error(
        "Impossible d'établir les connexions aux bases de données"
      );
    }

    // Création des modèles
    const User = createUserSchema(authConnection);
    const Company = createCompanySchema(bddConnection);
    const Team = createTeamSchema(bddConnection);
    const Client = createClientSchema(bddConnection);
    const Contact = createContactSchema(bddConnection);
    const Opportunity = createOpportunitySchema(bddConnection);
    const Deal = createDealSchema(bddConnection);

    // Nettoyer les collections
    console.log("🧹 Nettoyage des collections...");
    await User.deleteMany({});
    await Company.deleteMany({});
    await Team.deleteMany({});
    await Client.deleteMany({});
    await Contact.deleteMany({});
    await Opportunity.deleteMany({});
    await Deal.deleteMany({});

    // ===============================
    // 1. CRÉER L'ADMINISTRATEUR SYSTÈME ET SA COMPANY
    // ===============================
    console.log("👑 Création de l'administrateur...");
    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@crew-crm.com",
      password: createHashedPassword("admin123"),
      role: "admin",
      active: true,
      provider: "local",
    });

    // Créer la company de l'admin
    const adminCompany = await Company.create({
      name: "Crew CRM Solutions",
      description: "Éditeur du logiciel Crew CRM - Solutions CRM innovantes",
      address: {
        street: "1 Avenue de l'Innovation",
        city: "Paris",
        zipCode: "75015",
        country: "France",
      },
      phone: "+33 1 00 00 00 00",
      email: "contact@crew-crm.com",
      website: "https://crew-crm.com",
      industry: "Software",
      owner: admin._id.toString(),
      teams: [] as any[],
      isActive: true,
    });

    // Mettre à jour l'admin avec sa companyId
    await User.findByIdAndUpdate(admin._id, {
      companyId: adminCompany._id.toString(),
    });

    console.log(
      `✅ Admin créé: ${admin.email} avec company: ${adminCompany.name}`
    );

    // ===============================
    // 2. CRÉER LES MANAGERS (PROPRIÉTAIRES D'ENTREPRISES)
    // ===============================
    console.log("👔 Création des managers...");
    const managersData = [
      {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@techcorp.fr",
        password: createHashedPassword("manager123"),
        role: "manager" as const,
        active: true,
        provider: "local" as const,
      },
      {
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@greenenergy.fr",
        password: createHashedPassword("manager123"),
        role: "manager" as const,
        active: true,
        provider: "local" as const,
      },
      {
        firstName: "Pierre",
        lastName: "Bernard",
        email: "pierre.bernard@creativeplus.fr",
        password: createHashedPassword("manager123"),
        role: "manager" as const,
        active: true,
        provider: "local" as const,
      },
      {
        firstName: "Sophie",
        lastName: "Dubois",
        email: "sophie.dubois@consulting-pro.fr",
        password: createHashedPassword("manager123"),
        role: "manager" as const,
        active: true,
        provider: "local" as const,
      },
    ];

    const managers = await User.insertMany(managersData);
    console.log(`✅ ${managers.length} managers créés`);

    // ===============================
    // 3. CRÉER LES ENTREPRISES
    // ===============================
    console.log("🏢 Création des entreprises...");
    const companiesData = [
      {
        name: "TechCorp Solutions",
        description: "Entreprise de solutions technologiques innovantes",
        address: {
          street: "123 Avenue des Champs-Élysées",
          city: "Paris",
          zipCode: "75008",
          country: "France",
        },
        phone: "+33 1 23 45 67 89",
        email: "contact@techcorp.fr",
        website: "https://techcorp-solutions.fr",
        industry: "Technology",
        owner: managers[0]._id.toString(),
        teams: [] as any[],
        isActive: true,
      },
      {
        name: "Green Energy Co",
        description: "Spécialiste des énergies renouvelables",
        address: {
          street: "456 Rue de la République",
          city: "Lyon",
          zipCode: "69002",
          country: "France",
        },
        phone: "+33 4 78 90 12 34",
        email: "info@greenenergy.fr",
        website: "https://green-energy.fr",
        industry: "Energy",
        owner: managers[1]._id.toString(),
        teams: [] as any[],
        isActive: true,
      },
      {
        name: "Creative Agency Plus",
        description: "Agence créative et marketing digital",
        address: {
          street: "789 Boulevard Saint-Germain",
          city: "Paris",
          zipCode: "75006",
          country: "France",
        },
        phone: "+33 1 45 67 89 01",
        email: "hello@creativeplus.fr",
        website: "https://creative-agency-plus.fr",
        industry: "Marketing",
        owner: managers[2]._id.toString(),
        teams: [] as any[],
        isActive: true,
      },
      {
        name: "Consulting Pro",
        description: "Cabinet de conseil en stratégie et management",
        address: {
          street: "321 Rue de Rivoli",
          city: "Paris",
          zipCode: "75001",
          country: "France",
        },
        phone: "+33 1 56 78 90 12",
        email: "contact@consulting-pro.fr",
        website: "https://consulting-pro.fr",
        industry: "Consulting",
        owner: managers[3]._id.toString(),
        teams: [] as any[],
        isActive: true,
      },
    ];

    const companies = await Company.insertMany(companiesData);
    console.log(
      `✅ ${companies.length + 1} entreprises créées (incluant admin)`
    );

    // Mettre à jour les managers avec leur companyId
    for (let i = 0; i < managers.length; i++) {
      await User.findByIdAndUpdate(managers[i]._id, {
        companyId: companies[i]._id.toString(),
      });
    }

    // ===============================
    // 4. CRÉER LES ÉQUIPES
    // ===============================
    console.log("👥 Création des équipes...");

    // Équipe admin
    const adminTeam = await Team.create({
      name: "Équipe Support",
      description: "Équipe de support et administration",
      company: adminCompany._id,
      members: [admin._id.toString()],
      leader: admin._id.toString(),
      isActive: true,
    });

    const teamsData = [
      // TechCorp Solutions
      {
        name: "Équipe Développement",
        description: "Équipe de développement logiciel",
        company: companies[0]._id,
        members: [] as string[],
        leader: managers[0]._id.toString(),
        isActive: true,
      },
      {
        name: "Équipe Commerciale Tech",
        description: "Équipe commerciale technologique",
        company: companies[0]._id,
        members: [],
        leader: managers[0]._id.toString(),
        isActive: true,
      },
      // Green Energy Co
      {
        name: "Équipe Ingénierie",
        description: "Équipe d'ingénieurs en énergie renouvelable",
        company: companies[1]._id,
        members: [],
        leader: managers[1]._id.toString(),
        isActive: true,
      },
      {
        name: "Équipe Commerciale Énergie",
        description: "Équipe commerciale spécialisée énergie",
        company: companies[1]._id,
        members: [],
        leader: managers[1]._id.toString(),
        isActive: true,
      },
      // Creative Agency Plus
      {
        name: "Équipe Créative",
        description: "Équipe de designers et créatifs",
        company: companies[2]._id,
        members: [],
        leader: managers[2]._id.toString(),
        isActive: true,
      },
      {
        name: "Équipe Business Dev",
        description: "Équipe développement commercial",
        company: companies[2]._id,
        members: [],
        leader: managers[2]._id.toString(),
        isActive: true,
      },
      // Consulting Pro
      {
        name: "Équipe Conseil",
        description: "Consultants senior",
        company: companies[3]._id,
        members: [],
        leader: managers[3]._id.toString(),
        isActive: true,
      },
      {
        name: "Équipe Ventes Conseil",
        description: "Équipe de vente pour les services de conseil",
        company: companies[3]._id,
        members: [],
        leader: managers[3]._id.toString(),
        isActive: true,
      },
    ];

    const teams = await Team.insertMany(teamsData);
    console.log(`✅ ${teams.length + 1} équipes créées (incluant admin)`);

    // ===============================
    // 5. CRÉER LES UTILISATEURS
    // ===============================
    console.log("👤 Création des utilisateurs...");
    const usersData = [
      // TechCorp Solutions
      {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.johnson@techcorp.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[0]._id.toString(),
        teams: [teams[0]._id.toString()],
        provider: "local" as const,
      },
      {
        firstName: "Bob",
        lastName: "Smith",
        email: "bob.smith@techcorp.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[0]._id.toString(),
        teams: [teams[1]._id.toString()],
        provider: "local" as const,
      },
      // Green Energy Co
      {
        firstName: "Diana",
        lastName: "Prince",
        email: "diana.prince@greenenergy.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[1]._id.toString(),
        teams: [teams[2]._id.toString()],
        provider: "local" as const,
      },
      {
        firstName: "Ethan",
        lastName: "Hunt",
        email: "ethan.hunt@greenenergy.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[1]._id.toString(),
        teams: [teams[3]._id.toString()],
        provider: "local" as const,
      },
      // Creative Agency Plus
      {
        firstName: "Fiona",
        lastName: "Gallagher",
        email: "fiona.gallagher@creativeplus.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[2]._id.toString(),
        teams: [teams[4]._id.toString()],
        provider: "local" as const,
      },
      {
        firstName: "George",
        lastName: "Washington",
        email: "george.washington@creativeplus.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[2]._id.toString(),
        teams: [teams[5]._id.toString()],
        provider: "local" as const,
      },
      // Consulting Pro
      {
        firstName: "Hannah",
        lastName: "Montana",
        email: "hannah.montana@consulting-pro.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[3]._id.toString(),
        teams: [teams[6]._id.toString()],
        provider: "local" as const,
      },
      {
        firstName: "Ian",
        lastName: "Malcolm",
        email: "ian.malcolm@consulting-pro.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[3]._id.toString(),
        teams: [teams[7]._id.toString()],
        provider: "local" as const,
      },
    ];

    const users = await User.insertMany(usersData);
    console.log(`✅ ${users.length} utilisateurs créés`);

    // ===============================
    // 6. CRÉER LES CLIENTS
    // ===============================
    console.log("🏪 Création des clients...");

    const allCompanies = [adminCompany, ...companies];
    const allTeams = [adminTeam, ...teams];
    const allUsers = [admin, ...managers, ...users];

    const clientsData = [
      // Clients pour TechCorp Solutions
      {
        name: "Innovate SARL",
        description: "Startup technologique spécialisée dans l'IA",
        sector: "Intelligence Artificielle",
        address: {
          street: "15 Rue de la Tech",
          city: "Paris",
          zipCode: "75011",
          country: "France",
        },
        phone: "+33 1 23 45 67 90",
        email: "contact@innovate-sarl.fr",
        company: companies[0]._id,
        team: teams[1]._id,
        assignedTo: users[1]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 85,
        estimatedBudget: 150000,
        companySize: "11-50" as const,
        hasWorkedWithUs: false,
        knowsUs: true,
        interactions: [
          {
            date: randomPastDate(15),
            type: "meeting",
            outcome: "positive",
            notes:
              "Premier contact très prometteur, intérêt fort pour nos solutions IA",
          },
          {
            date: randomPastDate(7),
            type: "demo",
            outcome: "positive",
            notes: "Demo technique réussie, demande de proposition",
          },
        ],
        lastContactDate: randomPastDate(7),
      },
      {
        name: "Digital Solutions Corp",
        description: "Entreprise de transformation digitale",
        sector: "Transformation Digitale",
        address: {
          street: "42 Avenue de la République",
          city: "Lyon",
          zipCode: "69003",
          country: "France",
        },
        phone: "+33 4 78 12 34 56",
        email: "info@digitalsolutions.fr",
        company: companies[0]._id,
        team: teams[0]._id,
        assignedTo: users[0]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 70,
        estimatedBudget: 80000,
        companySize: "51-200" as const,
        hasWorkedWithUs: true,
        knowsUs: true,
        interactions: [
          {
            date: randomPastDate(20),
            type: "call",
            outcome: "neutral",
            notes: "Appel de suivi, en réflexion sur nos services",
          },
        ],
        lastContactDate: randomPastDate(20),
      },

      // Clients pour Green Energy Co
      {
        name: "EcoConstruct",
        description: "Constructeur spécialisé dans l'éco-construction",
        sector: "Construction Écologique",
        address: {
          street: "88 Chemin des Énergies Vertes",
          city: "Marseille",
          zipCode: "13008",
          country: "France",
        },
        phone: "+33 4 91 23 45 67",
        email: "contact@ecoconstruct.fr",
        company: companies[1]._id,
        team: teams[3]._id,
        assignedTo: users[3]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 90,
        estimatedBudget: 500000,
        companySize: "200+" as const,
        hasWorkedWithUs: false,
        knowsUs: true,
        interactions: [
          {
            date: randomPastDate(10),
            type: "meeting",
            outcome: "positive",
            notes:
              "Très intéressé par nos solutions solaires pour leurs projets",
          },
          {
            date: randomPastDate(3),
            type: "proposal",
            outcome: "positive",
            notes: "Proposition envoyée pour installation panneaux solaires",
          },
        ],
        lastContactDate: randomPastDate(3),
      },
      {
        name: "Municipalities Group",
        description: "Groupement de communes pour projets énergétiques",
        sector: "Secteur Public",
        address: {
          street: "Place de la Mairie",
          city: "Grenoble",
          zipCode: "38000",
          country: "France",
        },
        phone: "+33 4 76 12 34 56",
        email: "energie@municipalities-group.fr",
        company: companies[1]._id,
        team: teams[2]._id,
        assignedTo: users[2]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 75,
        estimatedBudget: 2000000,
        companySize: "200+" as const,
        hasWorkedWithUs: false,
        knowsUs: false,
        interactions: [
          {
            date: randomPastDate(25),
            type: "email",
            outcome: "neutral",
            notes: "Premier contact par email, demande d'informations",
          },
        ],
        lastContactDate: randomPastDate(25),
      },

      // Clients pour Creative Agency Plus
      {
        name: "Fashion Forward",
        description: "Marque de mode éthique et responsable",
        sector: "Mode",
        address: {
          street: "67 Rue du Faubourg Saint-Honoré",
          city: "Paris",
          zipCode: "75008",
          country: "France",
        },
        phone: "+33 1 42 33 44 55",
        email: "marketing@fashionforward.fr",
        company: companies[2]._id,
        team: teams[5]._id,
        assignedTo: users[5]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 95,
        estimatedBudget: 120000,
        companySize: "11-50" as const,
        hasWorkedWithUs: true,
        knowsUs: true,
        interactions: [
          {
            date: randomPastDate(12),
            type: "meeting",
            outcome: "positive",
            notes: "Excellent meeting, renouvellement campagne publicitaire",
          },
          {
            date: randomPastDate(5),
            type: "follow_up",
            outcome: "positive",
            notes: "Validation du brief créatif",
          },
        ],
        lastContactDate: randomPastDate(5),
      },
      {
        name: "StartupHub",
        description: "Incubateur de startups technologiques",
        sector: "Innovation",
        address: {
          street: "134 Avenue Parmentier",
          city: "Paris",
          zipCode: "75011",
          country: "France",
        },
        phone: "+33 1 43 55 66 77",
        email: "com@startuphub.fr",
        company: companies[2]._id,
        team: teams[4]._id,
        assignedTo: users[4]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 80,
        estimatedBudget: 200000,
        companySize: "51-200" as const,
        hasWorkedWithUs: false,
        knowsUs: true,
        interactions: [
          {
            date: randomPastDate(8),
            type: "demo",
            outcome: "positive",
            notes: "Présentation de nos services créatifs, très intéressés",
          },
        ],
        lastContactDate: randomPastDate(8),
      },

      // Clients pour Consulting Pro
      {
        name: "Industrial Corp",
        description: "Grand groupe industriel français",
        sector: "Industrie",
        address: {
          street: "200 Avenue de l'Industrie",
          city: "Toulouse",
          zipCode: "31000",
          country: "France",
        },
        phone: "+33 5 61 22 33 44",
        email: "direction@industrialcorp.fr",
        company: companies[3]._id,
        team: teams[7]._id,
        assignedTo: users[7]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 85,
        estimatedBudget: 800000,
        companySize: "200+" as const,
        hasWorkedWithUs: false,
        knowsUs: true,
        interactions: [
          {
            date: randomPastDate(18),
            type: "meeting",
            outcome: "positive",
            notes: "Besoin d'accompagnement transformation digitale",
          },
          {
            date: randomPastDate(10),
            type: "proposal",
            outcome: "neutral",
            notes: "Proposition envoyée, en attente de retour",
          },
        ],
        lastContactDate: randomPastDate(10),
      },
      {
        name: "Retail Chain Plus",
        description: "Chaîne de magasins spécialisés",
        sector: "Commerce de détail",
        address: {
          street: "45 Boulevard des Commerces",
          city: "Lille",
          zipCode: "59000",
          country: "France",
        },
        phone: "+33 3 20 11 22 33",
        email: "siege@retailchainplus.fr",
        company: companies[3]._id,
        team: teams[6]._id,
        assignedTo: users[6]._id.toString(),
        contacts: [] as string[],
        opportunities: [] as string[],
        isActive: true,
        goodForCustomer: 60,
        estimatedBudget: 300000,
        companySize: "200+" as const,
        hasWorkedWithUs: false,
        knowsUs: false,
        interactions: [
          {
            date: randomPastDate(30),
            type: "call",
            outcome: "neutral",
            notes: "Premier contact téléphonique, présentation de nos services",
          },
        ],
        lastContactDate: randomPastDate(30),
      },
    ];

    const clients = await Client.insertMany(clientsData);
    console.log(`✅ ${clients.length} clients créés`);

    // ===============================
    // 7. CRÉER LES CONTACTS
    // ===============================
    console.log("👥 Création des contacts...");

    const contactsData = [
      // Contacts pour Innovate SARL
      {
        firstName: "Thomas",
        lastName: "Leblanc",
        position: "CTO",
        email: "thomas.leblanc@innovate-sarl.fr",
        phone: "+33 1 23 45 67 91",
        mobile: "+33 6 12 34 56 78",
        company: companies[0]._id,
        client: clients[0]._id.toString(),
        team: teams[1]._id,
        assignedTo: users[1]._id.toString(),
        isPrimary: true,
        notes: "Contact technique principal, très compétent en IA",
        lastContactDate: randomPastDate(7),
        opportunities: [] as string[],
        isActive: true,
      },
      {
        firstName: "Camille",
        lastName: "Rousseau",
        position: "CEO",
        email: "camille.rousseau@innovate-sarl.fr",
        phone: "+33 1 23 45 67 92",
        mobile: "+33 6 12 34 56 79",
        company: companies[0]._id,
        client: clients[0]._id.toString(),
        team: teams[1]._id,
        assignedTo: users[1]._id.toString(),
        isPrimary: false,
        notes: "Décideur final, vision stratégique claire",
        lastContactDate: randomPastDate(15),
        opportunities: [],
        isActive: true,
      },

      // Contacts pour Digital Solutions Corp
      {
        firstName: "Michel",
        lastName: "Dubois",
        position: "Directeur IT",
        email: "michel.dubois@digitalsolutions.fr",
        phone: "+33 4 78 12 34 57",
        mobile: "+33 6 23 45 67 89",
        company: companies[0]._id,
        client: clients[1]._id.toString(),
        team: teams[0]._id,
        assignedTo: users[0]._id.toString(),
        isPrimary: true,
        notes: "Ancien client, relation de confiance établie",
        lastContactDate: randomPastDate(20),
        opportunities: [],
        isActive: true,
      },

      // Contacts pour EcoConstruct
      {
        firstName: "Sylvie",
        lastName: "Moreau",
        position: "Directrice Développement Durable",
        email: "sylvie.moreau@ecoconstruct.fr",
        phone: "+33 4 91 23 45 68",
        mobile: "+33 6 34 56 78 90",
        company: companies[1]._id,
        client: clients[2]._id.toString(),
        team: teams[3]._id,
        assignedTo: users[3]._id.toString(),
        isPrimary: true,
        notes: "Très engagée sur les questions environnementales",
        lastContactDate: randomPastDate(3),
        opportunities: [],
        isActive: true,
      },
      {
        firstName: "Laurent",
        lastName: "Petit",
        position: "Responsable Achats",
        email: "laurent.petit@ecoconstruct.fr",
        phone: "+33 4 91 23 45 69",
        mobile: "+33 6 45 67 89 01",
        company: companies[1]._id,
        client: clients[2]._id.toString(),
        team: teams[3]._id,
        assignedTo: users[3]._id.toString(),
        isPrimary: false,
        notes: "Contact pour les aspects commerciaux et contractuels",
        lastContactDate: randomPastDate(10),
        opportunities: [],
        isActive: true,
      },

      // Contacts pour Fashion Forward
      {
        firstName: "Élise",
        lastName: "Garnier",
        position: "Directrice Marketing",
        email: "elise.garnier@fashionforward.fr",
        phone: "+33 1 42 33 44 56",
        mobile: "+33 6 56 78 90 12",
        company: companies[2]._id,
        client: clients[4]._id.toString(),
        team: teams[5]._id,
        assignedTo: users[5]._id.toString(),
        isPrimary: true,
        notes: "Excellente collaboration depuis 2 ans",
        lastContactDate: randomPastDate(5),
        opportunities: [],
        isActive: true,
      },

      // Contacts pour Industrial Corp
      {
        firstName: "François",
        lastName: "Leroy",
        position: "Directeur Général",
        email: "francois.leroy@industrialcorp.fr",
        phone: "+33 5 61 22 33 45",
        mobile: "+33 6 67 89 01 23",
        company: companies[3]._id,
        client: clients[6]._id.toString(),
        team: teams[7]._id,
        assignedTo: users[7]._id.toString(),
        isPrimary: true,
        notes: "Décideur principal, intéressé par transformation digitale",
        lastContactDate: randomPastDate(10),
        opportunities: [],
        isActive: true,
      },
      {
        firstName: "Nathalie",
        lastName: "Vincent",
        position: "Responsable Innovation",
        email: "nathalie.vincent@industrialcorp.fr",
        phone: "+33 5 61 22 33 46",
        mobile: "+33 6 78 90 12 34",
        company: companies[3]._id,
        client: clients[6]._id.toString(),
        team: teams[7]._id,
        assignedTo: users[7]._id.toString(),
        isPrimary: false,
        notes: "Point de contact technique, très compétente",
        lastContactDate: randomPastDate(18),
        opportunities: [],
        isActive: true,
      },
    ];

    const contacts = await Contact.insertMany(contactsData);
    console.log(`✅ ${contacts.length} contacts créés`);

    // ===============================
    // 8. CRÉER LES OPPORTUNITÉS
    // ===============================
    console.log("💼 Création des opportunités...");

    const opportunitiesData = [
      // Opportunités TechCorp
      {
        title: "Implémentation solution IA pour Innovate SARL",
        description:
          "Développement d'une plateforme IA personnalisée pour l'analyse de données clients",
        value: 150000,
        status: "proposition" as const,
        probability: 75,
        expectedClosingDate: randomFutureDate(45),
        company: companies[0]._id,
        client: clients[0]._id.toString(),
        contacts: [contacts[0]._id.toString(), contacts[1]._id.toString()],
        team: teams[1]._id,
        assignedTo: users[1]._id.toString(),
        notes:
          "Proposition technique validée, négociation commerciale en cours",
        products: [
          { name: "Plateforme IA Custom", price: 100000, quantity: 1 },
          { name: "Formation équipe", price: 25000, quantity: 2 },
          { name: "Support 1 an", price: 25000, quantity: 1 },
        ],
        isActive: true,
      },
      {
        title: "Migration Cloud Digital Solutions",
        description: "Migration complète de l'infrastructure vers le cloud",
        value: 80000,
        status: "qualified" as const,
        probability: 60,
        expectedClosingDate: randomFutureDate(60),
        company: companies[0]._id,
        client: clients[1]._id.toString(),
        contacts: [contacts[2]._id.toString()],
        team: teams[0]._id,
        assignedTo: users[0]._id.toString(),
        notes: "Client existant, confiance établie",
        products: [
          { name: "Migration Cloud", price: 50000, quantity: 1 },
          { name: "Configuration serveurs", price: 20000, quantity: 1 },
          { name: "Formation admin", price: 10000, quantity: 1 },
        ],
        isActive: true,
      },

      // Opportunités Green Energy
      {
        title: "Installation panneaux solaires EcoConstruct",
        description: "Installation de 500kW de panneaux solaires sur 3 sites",
        value: 500000,
        status: "negotiation" as const,
        probability: 85,
        expectedClosingDate: randomFutureDate(30),
        company: companies[1]._id,
        client: clients[2]._id.toString(),
        contacts: [contacts[3]._id.toString(), contacts[4]._id.toString()],
        team: teams[3]._id,
        assignedTo: users[3]._id.toString(),
        notes: "Négociation finale en cours, très probable",
        products: [
          { name: "Panneaux solaires 500kW", price: 350000, quantity: 1 },
          { name: "Installation", price: 100000, quantity: 1 },
          { name: "Maintenance 5 ans", price: 50000, quantity: 1 },
        ],
        isActive: true,
      },
      {
        title: "Projet éolien Municipalities Group",
        description: "Étude de faisabilité pour parc éolien communal",
        value: 50000,
        status: "lead" as const,
        probability: 30,
        expectedClosingDate: randomFutureDate(90),
        company: companies[1]._id,
        client: clients[3]._id.toString(),
        contacts: [] as string[],
        team: teams[2]._id,
        assignedTo: users[2]._id.toString(),
        notes: "Première phase d'étude, développement à long terme",
        products: [
          { name: "Étude de faisabilité", price: 30000, quantity: 1 },
          { name: "Étude environnementale", price: 20000, quantity: 1 },
        ],
        isActive: true,
      },

      // Opportunités Creative Agency
      {
        title: "Campagne 360 Fashion Forward",
        description: "Campagne publicitaire complète multi-canal",
        value: 120000,
        status: "won" as const,
        probability: 100,
        expectedClosingDate: randomPastDate(10),
        company: companies[2]._id,
        client: clients[4]._id.toString(),
        contacts: [contacts[5]._id.toString()],
        team: teams[5]._id,
        assignedTo: users[5]._id.toString(),
        notes: "Projet remporté, en cours de réalisation",
        products: [
          { name: "Stratégie créative", price: 30000, quantity: 1 },
          { name: "Production vidéo", price: 50000, quantity: 1 },
          { name: "Campagne digitale", price: 40000, quantity: 1 },
        ],
        isActive: true,
      },
      {
        title: "Identité visuelle StartupHub",
        description: "Refonte complète de l'identité visuelle",
        value: 45000,
        status: "qualified" as const,
        probability: 70,
        expectedClosingDate: randomFutureDate(40),
        company: companies[2]._id,
        client: clients[5]._id.toString(),
        contacts: [] as string[],
        team: teams[4]._id,
        assignedTo: users[4]._id.toString(),
        notes: "Brief validé, en attente de proposition finale",
        products: [
          { name: "Logo et charte graphique", price: 25000, quantity: 1 },
          { name: "Déclinaisons supports", price: 15000, quantity: 1 },
          { name: "Site web vitrine", price: 5000, quantity: 1 },
        ],
        isActive: true,
      },

      // Opportunités Consulting Pro
      {
        title: "Transformation digitale Industrial Corp",
        description: "Accompagnement transformation digitale sur 18 mois",
        value: 800000,
        status: "proposition" as const,
        probability: 65,
        expectedClosingDate: randomFutureDate(60),
        company: companies[3]._id,
        client: clients[6]._id.toString(),
        contacts: [contacts[6]._id.toString(), contacts[7]._id.toString()],
        team: teams[7]._id,
        assignedTo: users[7]._id.toString(),
        notes: "Gros projet stratégique, concurrence forte",
        products: [
          { name: "Audit et stratégie", price: 150000, quantity: 1 },
          { name: "Accompagnement 18 mois", price: 500000, quantity: 1 },
          { name: "Formation équipes", price: 100000, quantity: 1 },
          { name: "Support post-projet", price: 50000, quantity: 1 },
        ],
        isActive: true,
      },
      {
        title: "Optimisation supply chain Retail Chain",
        description: "Optimisation de la chaîne logistique",
        value: 200000,
        status: "lead" as const,
        probability: 40,
        expectedClosingDate: randomFutureDate(75),
        company: companies[3]._id,
        client: clients[7]._id.toString(),
        contacts: [],
        team: teams[6]._id,
        assignedTo: users[6]._id.toString(),
        notes: "Premier contact, besoin à qualifier",
        products: [
          { name: "Audit logistique", price: 50000, quantity: 1 },
          { name: "Plan d'optimisation", price: 100000, quantity: 1 },
          { name: "Implémentation", price: 50000, quantity: 1 },
        ],
        isActive: true,
      },
    ];

    const opportunities = await Opportunity.insertMany(opportunitiesData);
    console.log(`✅ ${opportunities.length} opportunités créées`);

    // ===============================
    // 9. CRÉER LES DEALS
    // ===============================
    console.log("🤝 Création des deals...");

    const dealsData = [
      // Deals TechCorp
      {
        title: "Solution IA avancée Innovate SARL",
        description: "Extension de la solution IA avec modules ML avancés",
        value: 200000,
        status: "qualification" as const,
        probability: 80,
        expectedClosingDate: randomFutureDate(50),
        company: companies[0]._id,
        client: clients[0]._id.toString(),
        contacts: [contacts[0]._id.toString(), contacts[1]._id.toString()],
        team: teams[1]._id,
        assignedTo: users[1]._id.toString(),
        notes: "Suite logique de la première opportunité",
        products: [
          { name: "Modules ML avancés", price: 120000, quantity: 1 },
          { name: "API Integration", price: 50000, quantity: 1 },
          { name: "Support premium 2 ans", price: 30000, quantity: 1 },
        ],
        isActive: true,
      },

      // Deals Green Energy
      {
        title: "Extension parc solaire EcoConstruct",
        description: "Ajout de 300kW supplémentaires",
        value: 300000,
        status: "prospection" as const,
        probability: 50,
        expectedClosingDate: randomFutureDate(120),
        company: companies[1]._id,
        client: clients[2]._id.toString(),
        contacts: [contacts[3]._id.toString()],
        team: teams[3]._id,
        assignedTo: users[3]._id.toString(),
        notes: "Projet futur conditionné par le succès du premier",
        products: [
          { name: "Panneaux solaires 300kW", price: 210000, quantity: 1 },
          { name: "Installation extension", price: 60000, quantity: 1 },
          { name: "Intégration système", price: 30000, quantity: 1 },
        ],
        isActive: true,
      },

      // Deals Creative Agency
      {
        title: "Campagne lancement produit Fashion Forward",
        description: "Campagne pour le lancement de la nouvelle collection",
        value: 180000,
        status: "negociation" as const,
        probability: 90,
        expectedClosingDate: randomFutureDate(25),
        company: companies[2]._id,
        client: clients[4]._id.toString(),
        contacts: [contacts[5]._id.toString()],
        team: teams[5]._id,
        assignedTo: users[5]._id.toString(),
        notes: "Client fidèle, négociation finale sur les détails",
        products: [
          { name: "Stratégie lancement", price: 40000, quantity: 1 },
          { name: "Production contenus", price: 80000, quantity: 1 },
          { name: "Médias et diffusion", price: 60000, quantity: 1 },
        ],
        isActive: true,
      },

      // Deals Consulting
      {
        title: "Phase 2 transformation Industrial Corp",
        description: "Deuxième phase de transformation digitale",
        value: 600000,
        status: "prospection" as const,
        probability: 70,
        expectedClosingDate: randomFutureDate(180),
        company: companies[3]._id,
        client: clients[6]._id.toString(),
        contacts: [contacts[6]._id.toString(), contacts[7]._id.toString()],
        team: teams[7]._id,
        assignedTo: users[7]._id.toString(),
        notes: "Conditionné par le succès de la phase 1",
        products: [
          { name: "Implémentation avancée", price: 400000, quantity: 1 },
          { name: "Change management", price: 150000, quantity: 1 },
          { name: "Optimisation processus", price: 50000, quantity: 1 },
        ],
        isActive: true,
      },

      // Deal gagné pour exemple
      {
        title: "Audit Fashion Forward - GAGNÉ",
        description: "Audit stratégique réalisé avec succès",
        value: 35000,
        status: "gagne" as const,
        probability: 100,
        expectedClosingDate: randomPastDate(30),
        company: companies[2]._id,
        client: clients[4]._id.toString(),
        contacts: [contacts[5]._id.toString()],
        team: teams[5]._id,
        assignedTo: users[5]._id.toString(),
        notes: "Projet terminé avec succès, client très satisfait",
        products: [
          { name: "Audit stratégique", price: 25000, quantity: 1 },
          { name: "Recommandations", price: 10000, quantity: 1 },
        ],
        isActive: true,
      },

      // Deal perdu pour exemple
      {
        title: "Projet éolien - PERDU",
        description: "Projet éolien non retenu",
        value: 100000,
        status: "perdu" as const,
        probability: 0,
        expectedClosingDate: randomPastDate(20),
        company: companies[1]._id,
        client: clients[3]._id.toString(),
        contacts: [],
        team: teams[2]._id,
        assignedTo: users[2]._id.toString(),
        notes: "Projet non retenu, budget insuffisant du client",
        products: [
          { name: "Étude complète", price: 80000, quantity: 1 },
          { name: "Installation", price: 20000, quantity: 1 },
        ],
        isActive: false,
      },
    ];

    const deals = await Deal.insertMany(dealsData);
    console.log(`✅ ${deals.length} deals créés`);

    // ===============================
    // 10. METTRE À JOUR LES RELATIONS
    // ===============================
    console.log("🔗 Mise à jour des relations...");

    // Mettre à jour les clients avec leurs contacts et opportunités
    for (let i = 0; i < clients.length; i++) {
      const clientContacts = contacts.filter(
        (contact) => contact.client === clients[i]._id.toString()
      );
      const clientOpportunities = opportunities.filter(
        (opp) => opp.client === clients[i]._id.toString()
      );

      await Client.findByIdAndUpdate(clients[i]._id, {
        contacts: clientContacts.map((c) => c._id.toString()),
        opportunities: clientOpportunities.map((o) => o._id.toString()),
      });
    }

    // Mettre à jour les contacts avec leurs opportunités
    for (let i = 0; i < contacts.length; i++) {
      const contactOpportunities = opportunities.filter((opp) =>
        opp.contacts.includes(contacts[i]._id.toString())
      );

      if (contactOpportunities.length > 0) {
        await Contact.findByIdAndUpdate(contacts[i]._id, {
          opportunities: contactOpportunities.map((o) => o._id.toString()),
        });
      }
    }

    // Mettre à jour les équipes avec les membres
    const teamUpdates = [
      { teamId: adminTeam._id, members: [admin._id.toString()] },
      { teamId: teams[0]._id, members: [users[0]._id.toString()] }, // Dev TechCorp
      { teamId: teams[1]._id, members: [users[1]._id.toString()] }, // Commercial TechCorp
      { teamId: teams[2]._id, members: [users[2]._id.toString()] }, // Ingénierie Green
      { teamId: teams[3]._id, members: [users[3]._id.toString()] }, // Commercial Green
      { teamId: teams[4]._id, members: [users[4]._id.toString()] }, // Créative Agency
      { teamId: teams[5]._id, members: [users[5]._id.toString()] }, // Business Dev Agency
      { teamId: teams[6]._id, members: [users[6]._id.toString()] }, // Conseil Consulting
      { teamId: teams[7]._id, members: [users[7]._id.toString()] }, // Ventes Consulting
    ];

    for (const update of teamUpdates) {
      await Team.findByIdAndUpdate(update.teamId, { members: update.members });
    }

    // Mettre à jour les entreprises avec leurs équipes
    await Company.findByIdAndUpdate(adminCompany._id, {
      teams: [adminTeam._id],
    });
    await Company.findByIdAndUpdate(companies[0]._id, {
      teams: [teams[0]._id, teams[1]._id],
    });
    await Company.findByIdAndUpdate(companies[1]._id, {
      teams: [teams[2]._id, teams[3]._id],
    });
    await Company.findByIdAndUpdate(companies[2]._id, {
      teams: [teams[4]._id, teams[5]._id],
    });
    await Company.findByIdAndUpdate(companies[3]._id, {
      teams: [teams[6]._id, teams[7]._id],
    });

    // ===============================
    // 11. STATISTIQUES ET RÉSUMÉ
    // ===============================
    console.log("\n🎉 Seeding CRM terminé avec succès!");
    console.log("\n📊 Résumé des données créées:");
    console.log(`👑 1 Admin système avec sa company: ${admin.email}`);
    console.log(`👔 ${managers.length} Managers (propriétaires d'entreprises)`);
    console.log(`🏢 ${companies.length + 1} Entreprises (incluant admin)`);
    console.log(`👥 ${teams.length + 1} Équipes (incluant admin)`);
    console.log(`👤 ${users.length} Utilisateurs`);
    console.log(`🏪 ${clients.length} Clients`);
    console.log(`👥 ${contacts.length} Contacts`);
    console.log(`💼 ${opportunities.length} Opportunités`);
    console.log(`🤝 ${deals.length} Deals`);

    console.log("\n🏢 Entreprises créées:");
    console.log(
      `  0. ${adminCompany.name} (Admin: ${admin.firstName} ${admin.lastName})`
    );
    companies.forEach((company, index) => {
      console.log(
        `  ${index + 1}. ${company.name} (Manager: ${
          managersData[index].firstName
        } ${managersData[index].lastName})`
      );
    });

    console.log("\n📈 Répartition des opportunités par statut:");
    const oppStatusCount = opportunities.reduce((acc: any, opp) => {
      acc[opp.status] = (acc[opp.status] || 0) + 1;
      return acc;
    }, {});
    Object.entries(oppStatusCount).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count}`);
    });

    console.log("\n🤝 Répartition des deals par statut:");
    const dealStatusCount = deals.reduce((acc: any, deal) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1;
      return acc;
    }, {});
    Object.entries(dealStatusCount).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count}`);
    });

    console.log("\n💰 Valeur totale du pipeline:");
    const totalOppValue = opportunities.reduce(
      (sum, opp) => sum + opp.value,
      0
    );
    const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    console.log(`  - Opportunités: ${totalOppValue.toLocaleString("fr-FR")} €`);
    console.log(`  - Deals: ${totalDealValue.toLocaleString("fr-FR")} €`);
    console.log(
      `  - Total pipeline: ${(totalOppValue + totalDealValue).toLocaleString(
        "fr-FR"
      )} €`
    );

    console.log("\n🔑 Comptes de connexion:");
    console.log("🔐 ADMIN SYSTÈME:");
    console.log(`  Email: admin@crew-crm.com`);
    console.log(`  Password: admin123`);
    console.log(`  Company: ${adminCompany.name}`);

    console.log("\n👔 MANAGERS:");
    managersData.forEach((manager, index) => {
      console.log(`  ${manager.firstName} ${manager.lastName}:`);
      console.log(`    Email: ${manager.email}`);
      console.log(`    Password: manager123`);
      console.log(`    Company: ${companies[index].name}`);
    });

    console.log("\n👤 UTILISATEURS:");
    usersData.forEach((user, index) => {
      console.log(`  ${user.firstName} ${user.lastName}:`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Password: user123`);
      console.log(
        `    Company: ${
          allCompanies.find((c) => c._id.toString() === user.companyId)?.name
        }`
      );
    });

    console.log("\n📋 Exemples de données CRM:");
    console.log("🏪 Clients avec le plus de potentiel:");
    const topClients = clients
      .sort((a, b) => b.goodForCustomer - a.goodForCustomer)
      .slice(0, 3);
    topClients.forEach((client, index) => {
      console.log(
        `  ${index + 1}. ${client.name} (${
          client.goodForCustomer
        }% potentiel, ${
          client.estimatedBudget?.toLocaleString("fr-FR") || "N/A"
        } € budget)`
      );
    });

    console.log("\n💼 Opportunités les plus importantes:");
    const topOpportunities = opportunities
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    topOpportunities.forEach((opp, index) => {
      console.log(
        `  ${index + 1}. ${opp.title} (${opp.value.toLocaleString(
          "fr-FR"
        )} €, ${opp.probability}% prob.)`
      );
    });

    console.log("\n🤝 Deals en cours de négociation:");
    const activeDeals = deals.filter((deal) =>
      ["qualification", "negociation", "proposition"].includes(deal.status)
    );
    activeDeals.forEach((deal) => {
      console.log(
        `  - ${deal.title} (${deal.value.toLocaleString("fr-FR")} €, ${
          deal.probability
        }%)`
      );
    });

    console.log("\n🎯 Prochaines échéances importantes:");
    const upcomingDeadlines = [...opportunities, ...deals]
      .filter(
        (item) =>
          item.expectedClosingDate && item.expectedClosingDate > new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.expectedClosingDate!).getTime() -
          new Date(b.expectedClosingDate!).getTime()
      )
      .slice(0, 5);

    upcomingDeadlines.forEach((item) => {
      const date = new Date(item.expectedClosingDate!);
      console.log(
        `  - ${item.title}: ${date.toLocaleDateString(
          "fr-FR"
        )} (${item.value.toLocaleString("fr-FR")} €)`
      );
    });

    console.log("\n💾 Bases de données utilisées:");
    console.log("- Users → autenthication-service");
    console.log(
      "- Companies, Teams, Clients, Contacts, Opportunities, Deals → bdd-services"
    );

    console.log("\n✨ Fonctionnalités CRM démontrées:");
    console.log(
      "- Gestion hiérarchique des utilisateurs (Admin > Managers > Users)"
    );
    console.log("- Organisations multi-entreprises avec équipes");
    console.log("- Pipeline de vente complet (Leads → Opportunités → Deals)");
    console.log("- Gestion des contacts et interactions");
    console.log("- Suivi des probabilités et dates de clôture");
    console.log("- Historique des interactions clients");
    console.log("- Produits et services avec tarification");
    console.log("- Assignation par équipe et utilisateur");
    console.log("- Segmentation par secteur et taille d'entreprise");

    console.log(
      "\n🚀 Le CRM est prêt à être utilisé avec des données réalistes!"
    );
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    throw error;
  } finally {
    // Fermer les connexions
    if (authConnection) {
      await authConnection.close();
    }
    if (bddConnection) {
      await bddConnection.close();
    }
    console.log("🔌 Connexions fermées");
  }
};

// ===============================
// POINT D'ENTRÉE
// ===============================
const runSeed = async () => {
  try {
    await seedData();
    console.log("✅ Script de seeding CRM terminé avec succès");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur fatale:", error);
    process.exit(1);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  runSeed();
}

export default seedData;
