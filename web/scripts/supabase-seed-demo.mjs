import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY antes de ejecutar el seed.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const propertyId = "11111111-1111-4111-8111-111111111111";

const demoUsers = [
  {
    email: "admin@admiamigo360.com",
    password: "Admin360!",
    role: "admin",
    fullName: "Monica Pena",
    title: "Administradora general",
    phone: "+57 300 555 0132",
  },
  {
    email: "residente@admiamigo360.com",
    password: "Resi360!",
    role: "resident",
    fullName: "Elena Rodriguez",
    title: "Residente Torre A 12B",
    phone: "+1 876 543 210",
    residentEmail: "residente@admiamigo360.com",
  },
  {
    email: "alexander@wright.com",
    password: "Owner360!",
    role: "resident",
    fullName: "Alexander Wright",
    title: "Propietario Torre A 12A",
    phone: "+1 234 567 890",
    residentEmail: "alexander@wright.com",
  },
  {
    email: "m.sterling@luxury.com",
    password: "OwnerLux360!",
    role: "resident",
    fullName: "Marcus Sterling",
    title: "Propietario Torre B PH1",
    phone: "+1 302 991 881",
    residentEmail: "m.sterling@luxury.com",
  },
  {
    email: "juan.ortega@correo.com",
    password: "Tenant360!",
    role: "resident",
    fullName: "Juan Camilo Ortega",
    title: "Residente Torre B 210",
    phone: "+57 310 442 9918",
    residentEmail: "juan.ortega@correo.com",
  },
];

async function findOrCreateAuthUser(email, password, role) {
  const listResult = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = listResult.data.users.find(
    (candidate) => candidate.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existing) {
    return existing;
  }

  const createResult = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });

  if (createResult.error || !createResult.data.user) {
    throw createResult.error ?? new Error(`No se pudo crear el usuario ${email}.`);
  }

  return createResult.data.user;
}

for (const account of demoUsers) {
  const authUser = await findOrCreateAuthUser(account.email, account.password, account.role);

  const profileResult = await supabase.from("profiles").upsert(
    {
      id: authUser.id,
      property_id: propertyId,
      role: account.role,
      full_name: account.fullName,
      title: account.title,
      phone: account.phone,
    },
    { onConflict: "id" },
  );

  if (profileResult.error) {
    throw profileResult.error;
  }

  if (account.residentEmail) {
    const residentUpdate = await supabase
      .from("residents")
      .update({ profile_id: authUser.id })
      .eq("email", account.residentEmail);

    if (residentUpdate.error) {
      throw residentUpdate.error;
    }
  }
}

console.log("Demo Supabase seed completado.");
