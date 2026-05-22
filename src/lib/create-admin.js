const { createClient } = require('@supabase/supabase-js');

// Load environment variables directly
const supabaseUrl = "https://isjeakgqzdwsfhvwuaoe.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzamVha2dxemR3c2Zodnd1YW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQzNzk5NSwiZXhwIjoyMDk1MDEzOTk1fQ.kF_JZIxLrOkhy9Q3_PIcJXdpfCAA5ERTZnGCh8UCSbg";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('--- SiamLink Admin Seeding Script ---');
  const email = 'admin@siamlink.com';
  const password = 'admin123456';

  try {
    // 1. Create or fetch user via Auth Admin API
    console.log(`Checking if auth user ${email} exists...`);
    
    // List users to check if already created
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let adminUser = users.find(u => u.email === email);

    if (!adminUser) {
      console.log(`User ${email} does not exist. Creating via admin client...`);
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });
      if (createError) throw createError;
      adminUser = user;
      console.log(`Successfully created auth user: ${adminUser.id}`);
    } else {
      console.log(`Auth user already exists: ${adminUser.id}. Updating password for safety...`);
      const { data: { user }, error: updateError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: password }
      );
      if (updateError) throw updateError;
      adminUser = user;
    }

    // 2. Fetch or Create Profile with Pro level
    console.log(`Checking profile record for user_id: ${adminUser.id}...`);
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', adminUser.id)
      .maybeSingle();

    if (profileFetchError) throw profileFetchError;

    if (!existingProfile) {
      console.log('Profile does not exist. Inserting new pro profile...');
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: adminUser.id,
            username: 'admin',
            display_name: 'แอดมินสยามลิงก์',
            bio: 'บัญชีแอดมินผู้ดูแลระบบ SiamLink ตลอดชีพ 👑 [config:remove_watermark=true]',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
            theme: 'luxury_gold',
            plan: 'pro'
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.log('Failed to create profile with username "admin", trying username "admin_siamlink"...');
        const { data: retryProfile, error: retryError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: adminUser.id,
              username: 'admin_siamlink',
              display_name: 'แอดมินสยามลิงก์',
              bio: 'บัญชีแอดมินผู้ดูแลระบบ SiamLink ตลอดชีพ 👑 [config:remove_watermark=true]',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
              theme: 'luxury_gold',
              plan: 'pro'
            }
          ])
          .select()
          .single();

        if (retryError) throw retryError;
        console.log('Profile created successfully with fallback username:', retryProfile.username);
      } else {
        console.log('Profile created successfully with username:', newProfile.username);
      }
    } else {
      console.log('Profile already exists. Forcing upgrade to lifetime PRO and username configuration...');
      const { data: updatedProfile, error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          plan: 'pro',
          display_name: 'แอดมินสยามลิงก์',
          bio: 'บัญชีแอดมินผู้ดูแลระบบ SiamLink ตลอดชีพ 👑 [config:remove_watermark=true]',
          theme: 'luxury_gold'
        })
        .eq('user_id', adminUser.id)
        .select()
        .single();

      if (updateProfileError) throw updateProfileError;
      console.log('Profile updated successfully to lifetime PRO:', updatedProfile.plan);
    }

    console.log('\n🎉 SUCCESS: Lifetime PRO admin account is ready to use!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Status: ACTIVE PRO (Lifetime)');

  } catch (err) {
    console.error('An error occurred during admin seeding:', err.message || err);
  }
}

main();
