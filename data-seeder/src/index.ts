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
  company: string; // ObjectId de Company
  members: string[];
  leader?: string;
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
      await connection.db?.admin().ping(); // Test la connexion
      return connection;
    } catch (error: any) {
      console.log(
        `Tentative de connexion ${i + 1}/${maxRetries} échouée:`,
        error?.message || error
      );
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Attendre 3 secondes
    }
  }
};

// ===============================
// CONNEXIONS MONGODB
// ===============================
const createAuthConnection = async () => {
  // Utiliser localhost si pas d'env variable (local dev) sinon utiliser mongo (Docker)
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
  // Utiliser localhost si pas d'env variable (local dev) sinon utiliser mongo (Docker)
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

// ===============================
// DONNÉES DE SEEDING
// ===============================
const seedData = async () => {
  console.log("🚀 Démarrage du seeding des données...");

  let authConnection: mongoose.Connection | undefined;
  let bddConnection: mongoose.Connection | undefined;

  try {
    // Attendre un peu pour que MongoDB soit complètement prêt
    console.log("⏳ Attente de MongoDB...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Connexions aux bases de données
    console.log("🔌 Établissement des connexions...");
    authConnection = await createAuthConnection();
    bddConnection = await createBddConnection();

    console.log("✅ Connexions établies");

    // Vérifier que les connexions sont bien établies
    if (!authConnection || !bddConnection) {
      throw new Error(
        "Impossible d'établir les connexions aux bases de données"
      );
    }

    // Création des modèles
    const User = createUserSchema(authConnection);
    const Company = createCompanySchema(bddConnection);
    const Team = createTeamSchema(bddConnection);

    // Nettoyer les collections
    console.log("🧹 Nettoyage des collections...");
    await User.deleteMany({});
    await Company.deleteMany({});
    await Team.deleteMany({});

    // ===============================
    // 1. CRÉER L'ADMINISTRATEUR SYSTÈME
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

    console.log(`✅ Admin créé: ${admin.email} (ID: ${admin._id})`);

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
        teams: [],
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
        teams: [],
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
        teams: [],
        isActive: true,
      },
    ];

    const companies = await Company.insertMany(companiesData);
    console.log(`✅ ${companies.length} entreprises créées`);

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
    const teamsData = [
      // TechCorp Solutions
      {
        name: "Équipe Développement",
        description: "Équipe de développement logiciel",
        company: companies[0]._id,
        members: [],
        leader: managers[0]._id.toString(),
        isActive: true,
      },
      {
        name: "Équipe DevOps",
        description: "Équipe infrastructure et déploiement",
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
        name: "Équipe Commerciale",
        description: "Équipe de vente et relation client",
        company: companies[1]._id,
        members: [],
        leader: managers[1]._id.toString(),
        isActive: true,
      },
      // Creative Agency Plus
      {
        name: "Équipe Design",
        description: "Équipe de designers et créatifs",
        company: companies[2]._id,
        members: [],
        leader: managers[2]._id.toString(),
        isActive: true,
      },
      {
        name: "Équipe Marketing",
        description: "Équipe marketing digital",
        company: companies[2]._id,
        members: [],
        leader: managers[2]._id.toString(),
        isActive: true,
      },
    ];

    const teams = await Team.insertMany(teamsData);
    console.log(`✅ ${teams.length} équipes créées`);

    // ===============================
    // 5. CRÉER LES UTILISATEURS
    // ===============================
    console.log("👤 Création des utilisateurs...");
    const usersData = [
      // TechCorp Solutions - Équipe Dev
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
        teams: [teams[0]._id.toString()],
        provider: "local" as const,
      },
      // TechCorp Solutions - Équipe DevOps
      {
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie.brown@techcorp.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[0]._id.toString(),
        teams: [teams[1]._id.toString()],
        provider: "local" as const,
      },
      // Green Energy Co - Équipe Ingénierie
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
        teams: [teams[2]._id.toString()],
        provider: "local" as const,
      },
      // Green Energy Co - Équipe Commerciale
      {
        firstName: "Fiona",
        lastName: "Gallagher",
        email: "fiona.gallagher@greenenergy.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[1]._id.toString(),
        teams: [teams[3]._id.toString()],
        provider: "local" as const,
      },
      // Creative Agency Plus - Équipe Design
      {
        firstName: "George",
        lastName: "Washington",
        email: "george.washington@creativeplus.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[2]._id.toString(),
        teams: [teams[4]._id.toString()],
        provider: "local" as const,
      },
      {
        firstName: "Hannah",
        lastName: "Montana",
        email: "hannah.montana@creativeplus.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[2]._id.toString(),
        teams: [teams[4]._id.toString()],
        provider: "local" as const,
      },
      // Creative Agency Plus - Équipe Marketing
      {
        firstName: "Ian",
        lastName: "Malcolm",
        email: "ian.malcolm@creativeplus.fr",
        password: createHashedPassword("user123"),
        role: "user" as const,
        active: true,
        companyId: companies[2]._id.toString(),
        teams: [teams[5]._id.toString()],
        provider: "local" as const,
      },
    ];

    const users = await User.insertMany(usersData);
    console.log(`✅ ${users.length} utilisateurs créés`);

    // ===============================
    // 6. METTRE À JOUR LES RELATIONS
    // ===============================
    console.log("🔗 Mise à jour des relations...");

    // Mettre à jour les équipes avec les membres
    const teamUpdates = [
      {
        teamId: teams[0]._id,
        members: [users[0]._id.toString(), users[1]._id.toString()],
      }, // Dev TechCorp
      { teamId: teams[1]._id, members: [users[2]._id.toString()] }, // DevOps TechCorp
      {
        teamId: teams[2]._id,
        members: [users[3]._id.toString(), users[4]._id.toString()],
      }, // Ingénierie Green
      { teamId: teams[3]._id, members: [users[5]._id.toString()] }, // Commercial Green
      {
        teamId: teams[4]._id,
        members: [users[6]._id.toString(), users[7]._id.toString()],
      }, // Design Creative
      { teamId: teams[5]._id, members: [users[8]._id.toString()] }, // Marketing Creative
    ];

    for (const update of teamUpdates) {
      await Team.findByIdAndUpdate(update.teamId, { members: update.members });
    }

    // Mettre à jour les entreprises avec leurs équipes
    await Company.findByIdAndUpdate(companies[0]._id, {
      teams: [teams[0]._id, teams[1]._id],
    });
    await Company.findByIdAndUpdate(companies[1]._id, {
      teams: [teams[2]._id, teams[3]._id],
    });
    await Company.findByIdAndUpdate(companies[2]._id, {
      teams: [teams[4]._id, teams[5]._id],
    });

    // ===============================
    // 7. RÉSUMÉ
    // ===============================
    console.log("\n🎉 Seeding terminé avec succès!");
    console.log("\n📊 Résumé des données créées:");
    console.log(`- 1 Admin système: admin@crew-crm.com`);
    console.log(`- 3 Managers (propriétaires d'entreprises)`);
    console.log(`- 3 Entreprises avec adresses complètes`);
    console.log(`- 6 Équipes réparties dans les entreprises`);
    console.log(`- 9 Utilisateurs répartis dans les équipes`);

    console.log("\n🏢 Entreprises créées:");
    companies.forEach((company, index) => {
      console.log(
        `  ${index + 1}. ${company.name} (Owner: ${
          managersData[index].firstName
        } ${managersData[index].lastName})`
      );
    });

    console.log("\n🔑 Mots de passe par défaut:");
    console.log("- Admin: admin123");
    console.log("- Managers: manager123");
    console.log("- Users: user123");

    console.log("\n💾 Bases de données utilisées:");
    console.log("- Users → autenthication-service");
    console.log("- Companies & Teams → bdd-services");
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
    console.log("✅ Script terminé avec succès");
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
